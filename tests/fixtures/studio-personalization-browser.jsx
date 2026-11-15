import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import EditorPage from '/src/features/studio/EditorPage.jsx';
import { auth } from '/src/api/auth.api.js';
import { apiConfig } from '/src/api/config.js';
import '/src/index.css';
import '/src/features/studio/studio-pages.css';

const originalText = 'Tai nghe đang giảm giá còn 250.000đ!';
const customText = 'Giày thể thao đang giảm còn 250.000đ!';
const serverReadText = customText.replace('250.000đ', '250.000 đồng');
const originalImage = '/images/c1/ti/c1_ti_neutral.webp';
const customImage = '/images/c1/teo/c1_teo_neutral.webp';
// Real LineStatus has `key` and no `voiceUrl`. Use a verified public test clip.
const generatedKey = '364b59d6f1d5c5faccc5';
const generatedAudio = `${apiConfig.baseUrl}/assets/v/${generatedKey}.mp3`;
let saved = { id: 'CH01', title: 'Kiểm thử Editor cá nhân hóa', initialStats: {}, sprites: {}, scenes: [
  { id: 'S1', type: 'dialogue', title: 'Lời rủ của Minh', text: originalText, speaker: 'Minh', speakerId: 'MINH', background: '/images/c1/scene/c1_cutscene_reading_manga.webp', characters: [{ id: 'MINH', src: originalImage, position: 'left' }], nextSceneId: 'S2' },
  { id: 'S2', type: 'minigame', title: 'Phân loại', game: { id: 'G', kind: 'NEED_WANT', title: 'Phân loại nhu cầu', items: [{ id: 'I', label: 'Tai nghe', image: originalImage, category: 'WANTS' }] }, nextSceneId: 'END' },
  { id: 'END', type: 'ending', title: 'Kết thúc' },
] };
let writes = 0;
let generated = false, voicePolls = 0, voiceRequests = 0;
const errors = [];
auth.getSnapshot = () => ({ actor: { id: 'fixture-editor', roles: ['GAME_EDITOR'] }, loading: false });
auth.accountRequest = async (path, options = {}) => {
  if (options.method === 'PUT' && path.endsWith('/draft')) { saved = structuredClone(options.body); writes++; return { warnings: [] }; }
  if (options.method === 'POST' && path.endsWith('/voice')) { voiceRequests++; generated = true; voicePolls = 0; return { queued: 1, alreadyPending: 0, ready: 1, dispatched: true }; }
  if (options.method && options.method !== 'GET') throw Error(`Unexpected write: ${path}`);
  if (path.endsWith('/draft')) return { draft: { status: 'DRAFT', revision: writes + 1 }, content: structuredClone(saved) };
  if (path.endsWith('/voice')) {
    const ready = generated && ++voicePolls > 1;
    return { items: [
      { sceneId: 'S1', speakerId: 'MINH', readText: originalText, profile: 'adam', status: 'READY', key: 'previously_ready_clip' },
      { sceneId: 'S1', speakerId: 'MINH', readText: serverReadText, profile: 'adam', status: ready ? 'READY' : generated ? 'PENDING' : 'MISSING', key: generatedKey },
    ], ready: ready ? 2 : 1, missing: generated ? 0 : 1, failed: 0, pending: generated && !ready ? 1 : 0 };
  }
  if (path.endsWith('/scene-schema')) return {};
  if (path.startsWith('/api/studio/assets')) return [{ id: 'asset', kind: 'IMAGE', label: 'Ảnh kiểm thử', url: customImage, chapterCode: 'CH01', status: 'IN_USE' }];
  return [];
};
window.addEventListener('error', event => errors.push(event.message));
window.addEventListener('unhandledrejection', event => errors.push(String(event.reason)));
const root = createRoot(document.getElementById('root'));
// Windows Chrome can keep a minimum layout viewport wider than its screenshot.
// Constrain the actual workspace as well so the narrow acceptance check is real.
const testWidth = Number(new URLSearchParams(location.search).get('width')) || window.innerWidth;
document.body.style.maxWidth = `${testWidth}px`;
const mount = key => root.render(<MemoryRouter key={key}><div style={{ padding: 16 }}><EditorPage code="CH01" notify={() => {}} /></div></MemoryRouter>);
const wait = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));
const assert = (ok, message) => { if (!ok) throw Error(message); };
const button = (text, scope = document) => [...scope.querySelectorAll('button')].find(el => el.textContent.trim() === text);
const click = async el => { assert(el && !el.disabled, 'Missing enabled control'); el.click(); await wait(); };
const setValue = async (el, value) => {
  assert(el, 'Missing input');
  Object.getOwnPropertyDescriptor(el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype, 'value').set.call(el, value);
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  await wait();
};
const choose = (label, value) => setValue(document.querySelector(`select[aria-label="${label}"]`), value);
const stageText = () => { const el = document.querySelector('.stage-text'); return el?.value ?? el?.textContent; };
const stageImage = () => document.querySelector('.stage-character img, img.stage-character')?.getAttribute('src');
async function run() {
  mount(1);
  for (let i = 0; i < 80 && !button('Cá nhân hóa'); i++) await wait();
  const baseInspector = document.querySelector('.scene-inspector');
  const baseReading = baseInspector.querySelector('[aria-label="Cách đọc cho giọng"]');
  assert(baseReading.tagName === 'INPUT', 'Base reading control no longer matches the original single-line field');
  assert(baseReading.compareDocumentPosition(baseInspector.querySelector('.scene-voice-row')) & Node.DOCUMENT_POSITION_FOLLOWING, 'Base reading/audio order changed');
  assert(!baseInspector.querySelector('[aria-label="Chọn giọng đọc"]'), 'Personalized voice selector leaked into base sidebar');
  assert(baseInspector.querySelector('#group-voice').textContent === 'Giọng đọc', 'Base voice heading changed');
  assert(!baseInspector.querySelector('.personalization-tabs'), 'Personalization tabs changed the original base sidebar');
  await click(button('Cá nhân hóa'));
  assert(document.querySelector('.scene-inspector-heading').nextElementSibling === document.querySelector('.scene-inspector-tabs'), 'Tabs are not immediately below the scene heading');
  assert(!document.querySelector('.studio-voice-panel--render'), 'Generation panel opened before clicking generate');
  assert(!document.querySelector('.personalization-playback'), 'Duplicate dialogue/playback summary was not removed');
  const voiceSection = document.querySelector('.scene-current-voice');
  const readingField = document.querySelector('[aria-label="Cách đọc cho giọng"]');
  const titleField = [...document.querySelectorAll('.scene-inspector label')].find(el => el.textContent.includes('Tiêu đề cảnh')).querySelector('input');
  const nextSection = document.querySelector('[aria-labelledby="group-next"]');
  assert(titleField.compareDocumentPosition(nextSection) & Node.DOCUMENT_POSITION_FOLLOWING, 'Scene title is not above routing');
  assert(nextSection.compareDocumentPosition(voiceSection) & Node.DOCUMENT_POSITION_FOLLOWING, 'Routing is not above voice controls');
  assert(!document.querySelector('.personalization-editing'), 'Removed dialogue helper/reset/warnings block remained');
  assert(!document.querySelector('.scene-inspector .studio-variant textarea'), 'Duplicate sidebar dialogue editor remained');
  assert(readingField.compareDocumentPosition(voiceSection.querySelector('.scene-voice-row')) & Node.DOCUMENT_POSITION_FOLLOWING, 'Reading/audio order no longer matches base sidebar');
  assert(document.querySelectorAll('.scene-inspector [aria-label="Cách đọc cho giọng"]').length === 1, 'Reading field duplicated');
  assert(document.querySelectorAll('.stage-dialogue .stage-speaker').length === 1 && document.querySelector('.stage-dialogue .stage-speaker').tagName === 'SELECT', 'Chat did not keep exactly the upper name selector');
  assert(button('Gợi ý cách đọc (AI)', document.querySelector('.scene-editor-toolbar')) && !button('Gợi ý cách đọc (AI)', document.querySelector('.scene-inspector')), 'AI suggestion is not exclusively in the toolbar');
  assert(!button('Cập nhật giọng'), 'Removed refresh button remained');
  assert(!document.querySelector('.studio-voice-panel--render') && voiceRequests === 0, 'Changing modes opened generation panel or generated clips');
  assert(button('Nhân đôi cảnh') && button('Xóa cảnh') && button('Đổi ảnh nền') && button('Thêm nhân vật'), 'Base scene actions missing in personalized mode');
  assert(document.querySelector('.scene-target') && document.querySelector('.scene-advanced'), 'Routing or advanced settings missing');
  await setValue([...document.querySelectorAll('.scene-inspector label')].find(el => el.textContent.includes('Tiêu đề cảnh')).querySelector('input'), 'Tiêu đề dùng chung');
  await setValue(document.querySelector('textarea.stage-text'), customText);
  assert(stageText() === customText, 'Preview did not reflect unsaved personalized text');
  await choose('Sở thích', 'TECH');
  assert(stageText() === originalText, 'Unset interest did not fall back to base text');
  await choose('Sở thích', 'SPORT');
  await click(button('Nhân vật'));
  const assertDialogueTabHidden = () => {
    const sidebar = document.querySelector('.scene-inspector');
    assert(!sidebar.querySelector('[aria-labelledby="group-next"]') && !sidebar.querySelector('.scene-current-voice') && !sidebar.querySelector('.scene-inspector-actions') && !sidebar.querySelector('.scene-advanced'), 'Dialogue-only settings leaked into another tab');
    assert(![...sidebar.querySelectorAll('label')].some(el => el.textContent.includes('Tiêu đề cảnh')), 'Scene title remained outside the dialogue tab');
  };
  assertDialogueTabHidden();
  assert(document.querySelector('[aria-label="Tên nhân vật theo nhãn"]') && button('Chọn ảnh nhân vật'), 'Character controls were removed');
  await click(button('Mini-game', document.querySelector('.personalization-tabs')));
  assertDialogueTabHidden();
  assert(!document.querySelector('[aria-label="Tên nhân vật theo nhãn"]'), 'Character inputs leaked into mini-game tab');
  await click(button('Lời thoại', document.querySelector('.personalization-tabs')));
  assert(document.querySelector('.scene-current-voice') && document.querySelector('.scene-inspector-actions') && document.querySelector('.scene-advanced'), 'Dialogue controls were not restored after tab switch');
  assert(stageText() === customText, 'Tab switch discarded the dialogue edit');
  await click(button('Nhân vật', document.querySelector('.personalization-tabs')));
  await choose('Giới tính', 'FEMALE');
  await setValue(document.querySelector('[aria-label="Tên nhân vật theo nhãn"]'), 'Mai');
  assert(document.querySelector('.stage-dialogue .stage-speaker').value === 'Mai', 'Name not previewed');
  await choose('Giới tính', 'MALE');
  assert(document.querySelector('.stage-dialogue .stage-speaker').value === 'Minh', 'Name leaked to another gender');
  await choose('Giới tính', 'FEMALE');
  await choose('Tuổi', '11_14');
  await click(button('Chọn ảnh nhân vật'));
  for (let i = 0; i < 60 && !document.querySelector('.sp-asset'); i++) await wait();
  await click(document.querySelector('.sp-asset'));
  assert(stageImage() === customImage, 'Character appearance was not previewed');
  await choose('Tuổi', '8_10');
  assert(stageImage() === originalImage, 'Age fallback failed');
  await choose('Tuổi', '11_14');
  await click(document.querySelector('[aria-label="Hoàn tác"]'));
  assert(stageImage() === originalImage, 'Undo did not restore appearance');
  await click(document.querySelector('[aria-label="Làm lại"]'));
  assert(stageImage() === customImage, 'Redo did not restore custom appearance');
  await click(button('Lời thoại', document.querySelector('.personalization-tabs')));
  await click(button('Chơi thử từ cảnh này'));
  assert(document.querySelector('[role="dialog"]').textContent.includes(customText), 'Play used base dialogue');
  await click(button('Đóng', document.querySelector('[role="dialog"]')));
  await click(button('Lưu nháp'));
  assert(writes === 1, 'Draft was not saved');
  assert(saved.scenes[0].text === originalText && saved.scenes[0].nextSceneId === 'S2', 'Personalization overwrote base or routing');
  assert(saved.scenes[0].variants['interest:SPORT'].text === customText, 'Saved interest content missing');
  assert(saved.scenes[0].speaker === 'Minh' && saved.scenes[0].variants['gender:FEMALE'].speaker === 'Mai', 'Personalized name overwrote base');
  assert(saved.scenes[0].title === 'Tiêu đề dùng chung', 'Common title not saved');
  await click(button('Sinh giọng đọc'));
  assert(voiceRequests === 1, 'Generate required an extra confirmation or sent duplicate requests');
  for (let i = 0; i < 120 && !document.querySelector('.scene-voice-row audio'); i++) await wait();
  assert(document.querySelector('.scene-voice-row audio')?.getAttribute('src') === generatedAudio, 'Generated personalized voice not playable in sidebar');
  assert(document.querySelectorAll('.scene-inspector audio').length === 1 && document.querySelector('.scene-current-voice audio')?.getAttribute('src') === generatedAudio, 'Inspector did not show exactly one player for the selected scene');
  assert(!document.querySelector('.scene-current-voice').textContent.includes('cần bấm Sinh giọng'), 'Selected-scene player still claimed the completed recording was missing');
  const audio = document.querySelector('.scene-voice-row audio');
  await audio.play();
  assert(!audio.paused && audio.readyState >= 2, 'Public key-derived MP3 could not be decoded and played');
  audio.pause();
  assert(document.querySelector('.studio-voice-item audio')?.getAttribute('src') === generatedAudio, 'Ready voice disappeared from generation list');
  assert(document.querySelectorAll('.studio-voice-panel--render .studio-voice-item').length === 1, 'Previously READY recordings leaked into the new batch');
  assert(!document.querySelector('.studio-voice-panel--render').textContent.includes(originalText), 'Old dialogue appeared in the render results');
  await click(button('Chơi thử từ cảnh này'));
  assert(document.querySelector('[aria-label="Nghe giọng đọc cảnh đang chơi thử"]')?.getAttribute('src') === generatedAudio, 'Play dialog did not expose generated recording');
  await click(button('Đóng', document.querySelector('[role="dialog"]')));
  await click(button('Đóng', document.querySelector('.studio-voice-panel--render')));
  assert(!document.querySelector('.studio-voice-panel--render') && document.querySelector('.scene-current-voice audio'), 'Closing render results removed selected-scene playback');
  await click(button('Sinh giọng đọc'));
  assert(voiceRequests === 1 && !document.querySelector('.studio-voice-panel--render'), 'All-ready clips were regenerated or displayed as new results');
  await click(document.querySelector('[aria-label="Cảnh sau"]'));
  await click(button('Mini-game', document.querySelector('.personalization-tabs')));
  assertDialogueTabHidden();
  await click(button('Chỉnh mini-game theo sở thích'));
  const dialog = document.querySelector('[role="dialog"]');
  const item = [...dialog.querySelectorAll('.studio-variant-block')].find(el => el.querySelector('h4')?.textContent === 'Tai nghe');
  await click(button('Chọn ảnh', item));
  for (let i = 0; i < 60 && !document.querySelector('.sp-asset'); i++) await wait();
  await click(document.querySelector('.sp-asset'));
  await click(button('Xong', document.querySelector('[role="dialog"]')));
  await click(button('Lưu nháp'));
  assert(saved.scenes[1].game.items[0].variants['interest:SPORT'].image === customImage, 'Mini-game image not saved');
  assert(saved.scenes[1].game.items[0].category === 'WANTS', 'Mini-game scoring changed');
  mount(2); await wait(200);
  await click(button('Cá nhân hóa'));
  assert(!document.querySelector('.studio-voice-panel--render'), 'Reload automatically showed old render results');
  await choose('Giới tính', 'FEMALE'); await choose('Tuổi', '11_14');
  assert(stageText() === customText, 'Reload lost personalized text');
  assert(stageImage() === customImage, 'Reload lost character appearance');
  assert(document.querySelector('.stage-dialogue .stage-speaker').value === 'Mai', 'Reload lost personalized name');
  assert(document.querySelector('.scene-editor').getBoundingClientRect().right <= testWidth + 1, 'Editor overflowed the requested width');
  assert(document.documentElement.scrollWidth <= window.innerWidth + 1, 'Editor overflowed the viewport horizontally');
  assert(errors.length === 0, errors.join('; '));
  document.getElementById('result').textContent = JSON.stringify({ status: 'PASS', writes, checks: ['selected-scene dialogue and playback', 'render panel only after generate', 'new render batch excludes old READY clips', 'all-ready generates nothing', 'shared scene tools', 'personalized names', 'live preview', 'interest fallback', 'gender + age appearance', 'undo/redo', 'key-only READY audio in sidebar/list/play', 'save/reload', 'mini-game asset and scoring'], errors });
}
run().catch(error => { document.getElementById('result').textContent = JSON.stringify({ status: 'FAIL', message: error.message, errors }); });
