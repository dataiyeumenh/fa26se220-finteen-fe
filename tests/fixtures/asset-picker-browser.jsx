import { createRoot } from 'react-dom/client';
import { AssetPicker } from '/src/features/studio/AssetsPage.jsx';
import { auth } from '/src/api/auth.api.js';
import { filterPickerAssets } from '/src/features/studio/assetPickerFilters.js';
import '/src/index.css';

const images = ['/images/c1/scene/c1_cutscene_reading_manga.webp', '/images/c1/ti/c1_ti_neutral.webp', '/images/c1/teo/c1_teo_neutral.webp'];
const assets = Array.from({ length: 55 }, (_, index) => ({
  id: `image-${index}`, kind: 'IMAGE', label: `Cấp ${index % 3 + 1} ${index % 2 ? 'nữ' : 'nam'} – Phòng khách ${index + 1}`,
  url: images[index % 3], ref: `assets/cap-${index % 3 + 1}-${index % 2 ? 'nu' : 'nam'}-${index}.webp`, chapterCode: index < 30 ? 'CH01' : 'CH02',
  width: index % 3 === 0 ? 1600 : 900, height: index % 3 === 2 ? 1600 : 900,
  sizeBytes: (index + 1) * 1024, status: index % 2 ? 'ORPHAN' : 'IN_USE', createdAt: new Date(2026, 0, index + 1).toISOString(),
}));
assets.push({ id: 'shared', kind: 'IMAGE', label: 'Ảnh dùng chung', url: images[0], usage: [{ chapterCode: 'CH01' }, { chapterCode: 'CH03' }] });
auth.getSnapshot = () => ({ actor: { id: 'picker-test', roles: ['GAME_EDITOR'] }, loading: false });
auth.accountRequest = async path => {
  if (path.startsWith('/api/studio/assets?')) return assets;
  throw new Error(`Unexpected request: ${path}`);
};
let picked;
const errors = [];
window.addEventListener('error', event => errors.push(event.message));
const root = createRoot(document.getElementById('root'));
root.render(<AssetPicker chapter="CH01" onPick={asset => { picked = asset; }} onClose={() => {}} notify={() => {}} />);
const wait = () => new Promise(resolve => setTimeout(resolve, 100));
const assert = (ok, message) => { if (!ok) throw Error(message); };
const setValue = async (element, value) => {
  Object.getOwnPropertyDescriptor(element.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype, 'value').set.call(element, value);
  element.dispatchEvent(new Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  await wait();
};
const select = label => [...document.querySelectorAll('.sp-picker-filter-grid label')].find(el => el.firstChild.textContent === label).querySelector('select');
async function run() {
  for (let i = 0; i < 100 && !document.querySelector('.sp-asset'); i++) await wait();
  await new Promise(resolve => setTimeout(resolve, 300));
  const dialog = document.querySelector('[role="dialog"]');
  const bounds = dialog.getBoundingClientRect();
  assert(bounds.width <= innerWidth && bounds.height <= innerHeight, 'Dialog exceeds viewport');
  if (innerWidth > 1200) assert(Math.abs(bounds.width - 1180) < 1, 'Picker did not expand to 1180px');
  assert(dialog.scrollWidth <= dialog.clientWidth + 1, 'Dialog overflows horizontally');
  assert(document.querySelectorAll('.sp-asset').length === 24, 'Default page size failed');
  document.querySelector('[aria-label="Trang sau"]').click(); await wait();
  assert(document.querySelectorAll('.sp-asset').length === 7, 'Pagination did not include assets used by this chapter');
  await setValue(document.querySelector('[aria-label="Tìm ảnh"]'), 'phong khach 30');
  assert(document.querySelectorAll('.sp-asset').length === 1, 'Combined accent-insensitive search or page reset failed');
  await setValue(document.querySelector('[aria-label="Tìm ảnh"]'), 'no-match');
  assert(dialog.textContent.includes('Không có ảnh khớp bộ lọc'), 'Empty state missing');
  [...dialog.querySelectorAll('button')].find(el => el.textContent === 'Xem tất cả ảnh').click(); await wait();
  await setValue(select('Giới tính'), 'nu');
  await setValue(select('Độ tuổi'), '3');
  await setValue(select('Trạng thái'), 'ORPHAN');
  await setValue(select('Dáng ảnh'), 'portrait');
  assert(document.querySelectorAll('.sp-asset').length === 9, 'Combined metadata and naming filters failed');
  await setValue(select('Chương'), 'CH02');
  assert(document.querySelectorAll('.sp-asset').length === 4, 'Chapter filter failed');
  await setValue(document.querySelector('[aria-label="Sắp xếp ảnh"]'), 'size');
  document.querySelector('.sp-asset').click(); await wait();
  assert(picked.id === 'image-53', 'Sort or pick callback failed');
  const source = JSON.stringify(assets);
  assert(filterPickerAssets(assets, { shape: 'square' }).length === 18, 'Square filter includes missing dimensions');
  filterPickerAssets(assets, { sort: 'resolution' });
  assert(JSON.stringify(assets) === source, 'Filtering mutated source assets');
  assert(errors.length === 0, errors.join('\n'));
  [...dialog.querySelectorAll('button')].find(el => el.textContent.includes('Xóa bộ lọc')).click(); await wait();
  window.assetPickerResult = { status: 'PASS', width: innerWidth, dialogWidth: bounds.width, checks: ['responsive width', 'pagination', 'accent-insensitive search', 'empty/reset', 'combined filters', 'usage chapters', 'sort/pick', 'immutable assets'], errors };
}
run().catch(error => { window.assetPickerResult = { status: 'FAIL', error: error.stack }; });
