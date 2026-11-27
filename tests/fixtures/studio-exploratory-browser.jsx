import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import StudioWorkspace from '/src/features/internal/StudioWorkspace.jsx';
import { auth } from '/src/api/auth.api.js';
import { tokenProblems } from '/src/features/studio/variantOps.js';
import '/src/index.css';

const testCase = new URLSearchParams(location.search).get('case') || 'navigation';
const originalImage = '/images/c1/scene/c1_cutscene_reading_manga.webp';
const teenImage = '/images/c1/teo/c1_teo_neutral.webp';
const newBase = '/images/c1/ti/c1_ti_neutral.webp';
const actor = { id: 'qa-editor', name: 'QA Editor', roles: ['GAME_EDITOR'] };
const draft = { code: 'CH04', chapterNumber: 4, title: 'Exploratory QA', status: 'DRAFT', revision: 1, editorId: actor.id };
let content = { id: 'CH04', title: 'Exploratory QA', sprites: {}, initialStats: {}, scenes: [{ id: 'INTRO', type: 'dialogue', title: 'Intro', background: testCase === 'empty-background' ? '' : originalImage, text: 'Original dialogue', characters: [], nextSceneId: 'END' }, { id: 'END', type: 'ending', title: 'End', characters: [] }] };
const assets = [{ id: 'teen', label: 'Teen image', url: teenImage }, { id: 'base', label: 'New base', url: newBase }].map(a => ({ ...a, chapterCode: 'CH04', kind: 'IMAGE', status: 'ORPHAN', width: 1000, height: 600 }));
let finishUpload, uploadPending = false;
auth.getSnapshot = () => ({ actor, loading: false });
auth.accountRequest = async (path, options = {}) => {
  if (path.endsWith('/draft')) {
    if (options.method === 'PUT') { content = structuredClone(options.body); draft.revision++; return { warnings: [] }; }
    return { draft: { ...draft }, content: structuredClone(content) };
  }
  if (path === '/api/studio/chapters') return [{ ...draft }];
  if (path.endsWith('/scene-schema')) return {};
  if (path.endsWith('/voice')) return { items: [], pending: 0 };
  if (path.startsWith('/api/studio/assets')) {
    if (options.method === 'POST') { uploadPending = true; return new Promise(resolve => { finishUpload = () => resolve({ asset: assets[0], duplicate: false }); }); }
    return assets;
  }
  throw Error(`Unexpected QA request: ${path}`);
};
createRoot(document.getElementById('root')).render(<RouterProvider router={createMemoryRouter([{ path: '*', element: <StudioWorkspace actor={actor} /> }], { initialEntries: ['/internal/editor/CH04'] })} />);
const wait = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));
const until = async (condition, label) => { for (let i = 0; i < 80; i++) { if (condition()) return; await wait(); } throw Error(`Timed out: ${label}`); };
const button = text => [...document.querySelectorAll('button')].find(el => el.textContent.trim() === text);
const click = async element => { if (!element) throw Error('Missing control'); element.click(); await wait(); };
const setValue = async (element, value) => { const prototype = element.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLTextAreaElement.prototype; Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value); element.dispatchEvent(new Event(element.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); await wait(); };
const choose = (label, value) => setValue(document.querySelector(`select[aria-label="${label}"]`), value);
const background = () => document.querySelector('.stage-frame')?.style.backgroundImage;
const pick = async label => { await click(button('Đổi ảnh nền')); await until(() => document.querySelector('.sp-asset'), 'asset picker'); await click([...document.querySelectorAll('.sp-asset')].find(el => el.querySelector('strong')?.textContent === label)); };
async function run() {
  await until(() => document.querySelector('textarea[aria-label="Lời thoại"]'), 'editor');
  if (testCase === 'navigation') {
    await setValue(document.querySelector('textarea[aria-label="Lời thoại"]'), 'QA unsaved dialogue');
    await click(document.querySelector('nav[aria-label="Điều hướng Studio"] a[href="/internal/assets"]'));
    const guarded = !!document.querySelector('.ft-leave-editor-confirm');
    return { testCase, expected: 'Confirmation before leaving dirty editor', guarded, editorStillMounted: !!document.querySelector('textarea[aria-label="Lời thoại"]'), landedInAssets: !!document.querySelector('.sp-library-page'), bugReproduced: !guarded && !!document.querySelector('.sp-library-page') };
  }
  if (testCase === 'fallback') {
    await click(button('Cá nhân hóa')); await choose('Giới tính', 'FEMALE'); await choose('Tuổi', '11_14'); await pick('Teen image');
    await click(button('Bản gốc')); await pick('New base'); const baseAfterEdit = background();
    await click(button('Cá nhân hóa')); await choose('Tuổi', '8_10'); const fallbackAfterEdit = background();
    return { testCase, expected: newBase, baseAfterEdit, fallbackAfterEdit, bugReproduced: !fallbackAfterEdit.includes(newBase) && fallbackAfterEdit.includes(originalImage) };
  }
  if (testCase === 'empty-background') {
    await click(button('Cá nhân hóa')); await choose('Giới tính', 'FEMALE'); await choose('Tuổi', '11_14'); await pick('Teen image');
    await click(button('Lưu nháp')); await until(() => draft.revision > 1, 'save');
    const problems = tokenProblems(content);
    return { testCase, expected: 'Valid personalization tokens after choosing an image', problems, tokens: content.personalization.tokens, bugReproduced: problems.some(p => p.includes('thiếu chữ mặc định')) };
  }
  if (testCase === 'upload-cancel' || testCase === 'upload-reopen') {
    await click(button('Đổi ảnh nền')); await until(() => document.querySelector('.sp-picker-upload summary'), 'upload');
    await click(document.querySelector('.sp-picker-upload summary'));
    const transfer = new DataTransfer(); transfer.items.add(new File([new Uint8Array([137, 80, 78, 71])], 'qa.png', { type: 'image/png' }));
    const input = document.querySelector('.sp-picker-upload input[type=file]'); input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true })); await wait();
    await click(button('Tải ảnh lên')); await until(() => uploadPending, 'pending upload');
    await click([...document.querySelector('.sp-asset-picker').querySelectorAll('button')].find(el => el.textContent.trim() === 'Đóng'));
    const popupClosed = !document.querySelector('.sp-asset-picker');
    if (testCase === 'upload-reopen') await pick('New base');
    const beforeComplete = background();
    finishUpload(); await wait(500); const afterComplete = background();
    return { testCase, expected: 'Closing picker must not later select a background', popupClosed, beforeComplete, afterComplete, bugReproduced: popupClosed && beforeComplete !== afterComplete };
  }
  throw Error('Unknown test case');
}
run().then(result => { window.studioExploratoryResult = { completed: true, ...result }; }).catch(error => { window.studioExploratoryResult = { completed: false, testCase, error: error.stack }; });
