import { createRoot } from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import EditorPage from '/src/features/studio/EditorPage.jsx'
import { auth } from '/src/api/auth.api.js'
import { studioApi } from '/src/features/studio/studioClient.js'
import '/src/index.css'
import chapter from './content/CH03.json'

let content = structuredClone(chapter)
const scenario = new URLSearchParams(location.search).get('case')
if (scenario === 'nested') content.scenes[3].condition = { all: [{ any: [{ var: 'flag:jobs_compared', op: '==', value: true }, { var: 'money', op: '>=', value: 1000 }] }, { var: 'money', op: '>=', value: 0 }] }
window.branchingQA = { saved: null }
auth.getSnapshot = () => ({ actor: { id: 'qa', roles: [scenario === 'readonly' ? 'GAME_REVIEWER' : 'GAME_EDITOR'] }, loading: false })
studioApi.get = async path => path.endsWith('/draft') ? { draft: { status: 'DRAFT', revision: 1 }, content: structuredClone(content) }
  : path.endsWith('/voice') ? { items: [], pending: 0 } : { stats: [{ key: 'SAVING', label: 'Tiết kiệm' }] }
studioApi.put = async (path, body) => { content = structuredClone(body); window.branchingQA.saved = structuredClone(body); return { warnings: [] } }
createRoot(document.getElementById('root')).render(<RouterProvider router={createMemoryRouter([{ path: '*', element: <EditorPage code="CH03" notify={() => {}} /> }])} />)

// Run from the browser console or a browser tool. All saves stay in this fixture.
window.runBranchingQA = async () => {
  const wait = () => new Promise(resolve => setTimeout(resolve, 100))
  const check = (ok, message) => { if (!ok) throw Error(message) }
  const click = async text => {
    const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text)
    check(b, `Missing button: ${text}`); b.click(); await wait()
  }
  const choose = async (label, value) => {
    const el = document.querySelector(`[aria-label="${label}"]`)
    check(el, `Missing field: ${label}`)
    if (el.getAttribute('role') === 'radiogroup') { el.querySelector(`input[value="${value}"]`).click(); await wait(); return }
    Object.getOwnPropertyDescriptor(el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype, 'value').set.call(el, value)
    el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); await wait()
  }
  document.querySelectorAll('.scene-timeline button')[4].click(); await wait()
  check(!document.querySelector('.conditional-flow').textContent.includes('jobs_compared'), 'Internal flag leaked into the flow')
  await click('Chọn việc cần kiểm tra')
  const actions = [...document.querySelector('[aria-label="Việc cần kiểm tra 1.1"]').options].map(o => o.textContent)
  check(new Set(actions).size === actions.length, 'Indistinguishable action options')
  await choose('Trẻ đã làm hay chưa 1.1', 'false'); await click('Hủy')
  check(document.querySelector('.conditional-question').textContent.startsWith('Trẻ đã'), 'Cancel changed the requirement')
  await click('Chọn việc cần kiểm tra'); await choose('Trẻ đã làm hay chưa 1.1', 'false')
  check(document.querySelector('.condition-preview').textContent.includes('Nếu trẻ chưa làm'), 'Negative requirement has misleading preview')
  await click('Áp dụng')
  document.querySelector('[aria-label="Hoàn tác"]').click(); await wait()
  check(document.querySelector('.conditional-question').textContent.startsWith('Trẻ đã'), 'Undo failed')
  document.querySelector('[aria-label="Làm lại"]').click(); await wait()
  check(document.querySelector('.conditional-question').textContent.startsWith('Trẻ chưa'), 'Redo failed')
  await click('Lưu nháp')
  check(window.branchingQA.saved.scenes[3].condition.all[0].var === 'flag:jobs_compared', 'Editing changed the stored flag key')
  check(window.branchingQA.saved.scenes[3].condition.all[0].value === false, 'Negative requirement did not persist')
  await click('Chọn việc cần kiểm tra'); await click('+ Thêm yêu cầu'); await click('Áp dụng')
  check(document.querySelector('[role=alert]'), 'Incomplete requirement was accepted')
  await choose('Nội dung cần kiểm tra 1.2', 'money'); await choose('Giá trị 1.2', '500000')
  await choose('Cách kết hợp yêu cầu 1', 'any'); await click('Áp dụng'); await click('Lưu nháp')
  check(window.branchingQA.saved.scenes[3].condition.any[1].value === 500000, 'Any/numeric requirement was not preserved')
  await click('Chọn việc cần kiểm tra'); await click('Không cần yêu cầu trước')
  check(document.querySelector('.condition-preview').textContent.includes('Luôn xem cảnh này'), 'Clearing has no explanation')
  await click('Áp dụng'); await click('Lưu nháp')
  check(window.branchingQA.saved.scenes[3].condition.all.length === 0, 'Clearing did not persist as always true')
  document.querySelectorAll('.conditional-routes button')[0].click(); await wait()
  document.querySelector('.studio-pick-grid button').click(); await wait(); await click('Lưu nháp')
  check(window.branchingQA.saved.scenes[3].ifTrueSceneId === chapter.scenes[0].id, 'Changing the next scene did not persist')
  return { passed: true, checks: ['human action names', 'cancel', 'negative preview', 'undo/redo', 'stored key preservation', 'incomplete requirement validation', 'any/numeric editing', 'clear requirements', 'scene target editing'] }
}
