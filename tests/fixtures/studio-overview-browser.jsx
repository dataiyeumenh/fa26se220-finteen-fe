import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import StudioWorkspace from '/src/features/internal/StudioWorkspace.jsx';
import { auth } from '/src/api/auth.api.js';
import '/src/index.css';

const params = new URLSearchParams(location.search);
const role = { editor: 'GAME_EDITOR', reviewer: 'GAME_REVIEWER', manager: 'GAME_MANAGER' }[params.get('role')] || 'GAME_EDITOR';
const scenario = params.get('scenario') || 'mixed';
const actor = { id: 'overview-user', name: { GAME_EDITOR: 'Editor HA', GAME_REVIEWER: 'Reviewer HA', GAME_MANAGER: 'Manager HA' }[role], roles: params.has('multi') ? ['GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER'] : [role] };
const names = ['Tiền đầu tiên', 'Tháng đầu tiên và mục tiêu lớn', 'Công việc đầu tiên', 'Mua thông minh', 'Ngân hàng và lãi', 'Mượn tiền có dễ không?', 'Biến cố bất ngờ', 'Tiền sinh tiền và kế hoạch 18 tuổi'];
const statuses = ['DRAFT', 'REJECTED', 'DRAFT', 'SUBMITTED', 'APPROVED', 'RELEASED', 'SUBMITTED', 'APPROVED'];
const rows = names.map((title, index) => ({ code: `CH0${index + 1}`, chapterNumber: index + 1, title, revision: index + 2,
  status: scenario === 'empty' ? 'RELEASED' : statuses[index], editorId: index >= 6 ? actor.id : 'another-editor', editorName: 'Biên tập viên', reviewerName: 'Người duyệt',
  updatedAt: `2026-11-${String(20 + index).padStart(2, '0')}T03:20:00Z`, reviewNote: index === 1 ? 'Kiểm tra lại lời thoại và ảnh nền của cảnh 3.' : null,
}));
let reads = 0;
auth.getSnapshot = () => ({ actor, loading: false });
auth.accountRequest = async (path, options = {}) => {
  if (options.method && options.method !== 'GET') throw Error('Overview must not write data');
  if (path !== '/api/studio/chapters') throw Error(`Unexpected API request: ${path}`);
  reads++;
  if (scenario === 'error' && !window.allowOverviewLoad) throw Error('Không tải được dữ liệu kiểm thử.');
  return rows;
};
const errors = [];
window.addEventListener('error', event => errors.push(event.message));
createRoot(document.getElementById('root')).render(<MemoryRouter initialEntries={['/internal']}><StudioWorkspace actor={actor} /></MemoryRouter>);
const wait = () => new Promise(resolve => setTimeout(resolve, 100));
const assert = (value, message) => { if (!value) throw Error(message); };
async function check() {
  for (let i = 0; i < 100 && !document.querySelector(scenario === 'error' ? '.so-welcome + .sp-state.is-error' : '.so-stats'); i++) await wait();
  if (scenario === 'error') {
    assert(document.querySelector('.sp-state.is-error')?.textContent.includes('Chưa tải được'), 'Error state missing');
    assert(!document.querySelector('.so-stats'), 'Error displayed invented statistics');
    window.allowOverviewLoad = true;
    [...document.querySelectorAll('button')].find(el => el.textContent === 'Thử lại').click();
    for (let i = 0; i < 100 && !document.querySelector('.so-stats'); i++) await wait();
  }
  await wait();
  const counts = [...document.querySelectorAll('.so-stat > strong')].map(el => Number(el.textContent));
  assert(JSON.stringify(counts) === JSON.stringify(scenario === 'empty' ? [0, 0, 0, 8] : [3, 2, 2, 1]), 'Incorrect pipeline counts');
  const workCount = Number(document.querySelector('.so-count').textContent);
  const expected = scenario === 'empty' ? 0 : role === 'GAME_EDITOR' || params.has('multi') ? 3 : 1;
  assert(workCount === expected, 'Role work count includes ineligible chapters');
  assert(document.querySelectorAll('.so-work-list > li').length === expected, 'Work list differs from role count');
  if (scenario === 'empty') assert(document.querySelector('.so-empty h3'), 'Empty queue missing');
  if (role !== 'GAME_EDITOR' && !params.has('multi')) assert(!document.querySelector('.so-work-list')?.textContent.includes(names[role === 'GAME_REVIEWER' ? 6 : 7]), 'Self-authored work leaked into queue');
  if (params.has('multi')) {
    const select = document.querySelector('.so-role-select select');
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(select, 'GAME_REVIEWER');
    select.dispatchEvent(new Event('change', { bubbles: true })); await wait();
    assert(Number(document.querySelector('.so-count').textContent) === (scenario === 'empty' ? 0 : 1), 'Changing role did not update work');
    assert(document.querySelector('.so-welcome-actions a').getAttribute('href') === '/internal/reviews', 'Role action did not update');
  }
  assert(document.querySelectorAll('.so-recent-list > li').length === 4, 'Recent updates missing');
  assert(document.querySelectorAll('.so-workflow li.is-current').length === 1, 'Role workflow focus missing');
  assert(document.documentElement.scrollWidth <= innerWidth + 1, 'Overview overflows viewport');
  assert(errors.length === 0, errors.join('; '));
  window.overviewTestResult = { status: 'PASS', role, scenario, width: innerWidth, counts, workCount, reads, checks: ['role queue permissions', 'statistics', 'recent updates', 'role actions', 'empty/error states', 'responsive layout'], errors };
}
check().catch(error => { window.overviewTestResult = { status: 'FAIL', role, scenario, message: error.stack, errors }; });
