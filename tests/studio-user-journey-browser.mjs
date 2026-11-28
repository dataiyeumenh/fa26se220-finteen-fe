// Uses an already running Vite app; every API call is intercepted in isolated browser contexts.
// Run with PLAYWRIGHT_MODULE pointing to a local Playwright index.mjs.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const folder = path.resolve('output/studio-qa');
mkdirSync(folder, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const base = process.env.STUDIO_TEST_BASE || 'http://localhost:5173';
const results = [], findings = [], browserErrors = [], writes = [];
const image = '/images/c1/scene/c1_cutscene_reading_manga.webp';
const altImage = '/images/c1/teo/c1_teo_neutral.webp';
const sceneTemplate = () => ({ id: 'CH04', title: 'QA chapter', initialMoney: 500000, initialStats: {}, sprites: {}, scenes: [
  { id: 'INTRO', type: 'dialogue', title: 'Intro', background: image, characters: [], speaker: 'An', text: 'Original dialogue', nextSceneId: 'END' },
  { id: 'END', type: 'ending', title: 'End', background: image, characters: [] },
] });
let model = { draft: { code: 'CH04', chapterNumber: 4, title: 'QA chapter', status: 'DRAFT', revision: 1, editorId: 'GAME_EDITOR', editorName: 'QA Editor' }, content: sceneTemplate(), questions: [], assets: [{ id: 'asset', registered: true, kind: 'IMAGE', label: 'QA image', chapterCode: 'CH04', url: altImage, ref: '/qa-image.webp', width: 1672, height: 941, status: 'ORPHAN' }], releases: [{ version: '0.9.0', current: true, chapters: [] }, { version: '0.8.0', current: false, chapters: [] }], rejectSubmit: true, failSave: false, saveDelay: 0 };
async function session(role) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => browserErrors.push({ role, message: error.message }));
  page.on('dialog', dialog => dialog.accept());
  await page.route('**/api/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.startsWith('/src/')) return route.continue();
    const endpoint = url.pathname.replace(/^\/finteen/, '');
    const method = request.method();
    const body = request.headers()['content-type']?.includes('application/json') ? request.postDataJSON() : null;
    if (method !== 'GET') writes.push({ role, method, endpoint, body });
    let result = {}, status = 200, code = 0, message = '';
    if (endpoint === '/api/auth/internal/login') result = { accessToken: `qa-${role}`, expiresIn: 3600 };
    else if (endpoint === '/api/auth/me') result = { id: role, displayName: `QA ${role}`, roles: [role], plans: [], email: `${role}@example.test` };
    else if (endpoint === '/api/studio/chapters') result = [model.draft];
    else if (endpoint.endsWith('/draft')) {
      if (method === 'PUT') {
        if (model.saveDelay) await new Promise(resolve => setTimeout(resolve, model.saveDelay));
        if (model.failSave) { status = 500; code = 9999; message = 'QA save failed'; }
        else { model.content = body; Object.assign(model.draft, { title: body.title, editorId: role, revision: model.draft.revision + 1, status: 'DRAFT' }); }
        result = { warnings: [] };
      } else result = { draft: model.draft, content: model.content };
    } else if (endpoint.endsWith('/scene-schema')) result = {};
    else if (endpoint.endsWith('/voice')) result = { items: [], pending: 0 };
    else if (endpoint.endsWith('/submit')) {
      if (model.rejectSubmit) { model.rejectSubmit = false; status = 400; code = 1001; message = 'đường đi: thiếu cảnh kết thúc QA'; }
      else { model.draft.status = 'SUBMITTED'; result = model.draft; }
    } else if (endpoint.endsWith('/withdraw')) { model.draft.status = 'DRAFT'; result = model.draft; }
    else if (endpoint.endsWith('/review')) {
      assert.notEqual(role, model.draft.editorId);
      if (!body.pass) assert.ok(body.note.trim());
      Object.assign(model.draft, { status: body.pass ? 'APPROVED' : 'REJECTED', reviewerId: role, reviewerName: role, reviewNote: body.note });
      result = model.draft;
    } else if (endpoint === '/api/studio/releases/next') result = { version: '1.0.0', currentVersion: model.releases.find(r => r.current)?.version, changeClass: 'MINOR', drafts: [model.draft] };
    else if (endpoint === '/api/studio/releases') {
      if (method === 'POST') { assert.equal(body.version, undefined); assert.equal(model.draft.status, 'APPROVED'); model.releases.forEach(r => { r.current = false; }); result = { version: '1.0.0', current: true, note: body.note, chapters: [{ code: 'CH04', chapterNumber: 4 }] }; model.releases.push(result); model.draft.status = 'RELEASED'; }
      else result = [...model.releases].sort((a, b) => b.version.localeCompare(a.version, 'en', { numeric: true }));
    } else if (endpoint.endsWith('/recall')) { assert.ok(body.reason.trim()); const release = model.releases.find(r => endpoint.includes(r.version)); release.recalledAt = new Date().toISOString(); release.current = false; const fallback = [...model.releases].filter(r => !r.recalledAt).sort((a, b) => b.version.localeCompare(a.version, 'en', { numeric: true }))[0]; fallback.current = true; }
    else if (endpoint.endsWith('/current')) model.releases.forEach(r => { r.current = endpoint.includes(r.version); });
    else if (endpoint === '/api/studio/questions') {
      if (method === 'POST') { result = { ...body, id: 'question' }; model.questions.push(result); }
      else result = model.questions.filter(q => (!q.retiredAt || url.searchParams.get('includeRetired') === 'true') && (!url.searchParams.get('q') || q.stem.includes(url.searchParams.get('q'))));
    } else if (endpoint.endsWith('/questions/question')) { Object.assign(model.questions[0], body); result = model.questions[0]; }
    else if (/\/questions\/question\/(retire|restore)$/.test(endpoint)) { model.questions[0].retiredAt = endpoint.endsWith('/retire') ? new Date().toISOString() : null; result = model.questions[0]; }
    else if (endpoint === '/api/studio/assets') {
      if (method === 'POST') { assert.match(request.headers()['content-type'], /multipart\/form-data; boundary=/); assert.match(request.postDataBuffer().toString(), /name="file"/); result = { asset: model.assets[0], duplicate: false }; }
      else result = model.assets;
    } else if (endpoint === '/api/studio/assets/asset') { if (method === 'PUT') Object.assign(model.assets[0], body); result = model.assets[0]; if (method === 'DELETE') model.assets = []; }
    else { status = 404; code = 9999; message = `Unexpected mock endpoint ${method} ${endpoint}`; browserErrors.push({ role, message }); }
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ code, message, result }) });
  });
  await page.goto(`${base}/internal/login`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('textbox', { name: 'Địa chỉ email' }).waitFor({ timeout: 60000 });
  await page.getByRole('textbox', { name: 'Địa chỉ email' }).fill(`${role}@example.test`);
  await page.getByLabel('Mật khẩu', { exact: true }).fill('qa-password');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.locator('.so-welcome').waitFor();
  return { page, context };
}
const nav = (page, target) => page.getByRole('navigation', { name: 'Điều hướng Studio' }).locator(`a[href="/internal/${target}"]`).click();
const pass = name => { results.push({ name, status: 'PASS' }); console.log(`PASS: ${name}`); };
async function screenshot(page, name) { await page.screenshot({ path: path.join(folder, `${name}.png`), fullPage: true }); }
try {
  const editor = await session('GAME_EDITOR');
  const p = editor.page;
  await nav(p, 'chapters'); await p.getByRole('link', { name: 'Tiếp tục soạn', exact: true }).click();
  await p.getByRole('textbox', { name: 'Lời thoại', exact: true }).fill('QA saved dialogue');
  await p.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await p.locator('.scene-save-state').filter({ hasText: 'Đã lưu' }).waitFor();
  assert.equal(model.content.scenes[0].text, 'QA saved dialogue');
  await p.reload(); await p.getByRole('textbox', { name: 'Lời thoại', exact: true }).waitFor();
  assert.equal(await p.getByRole('textbox', { name: 'Lời thoại', exact: true }).inputValue(), 'QA saved dialogue');
  pass('Editor save and reload persist dialogue');
  await p.getByRole('button', { name: 'Thêm cảnh', exact: true }).first().click();
  await p.getByRole('dialog').getByRole('button', { name: /^Lời thoại/ }).click();
  await p.getByRole('textbox', { name: 'Tiêu đề cảnh', exact: true }).fill('QA new scene');
  await p.getByRole('button', { name: 'Nhân đôi cảnh', exact: true }).click();
  await p.getByRole('button', { name: 'Cảnh 4: QA new scene (bản sao)', exact: true }).waitFor();
  await p.locator('button[aria-label="Hoàn tác"]').click();
  assert.equal(await p.getByRole('button', { name: 'Cảnh 4: QA new scene (bản sao)', exact: true }).count(), 0);
  await p.getByRole('button', { name: 'Làm lại', exact: true }).click();
  await p.getByRole('button', { name: 'Cảnh 4: QA new scene (bản sao)', exact: true }).waitFor();
  await p.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await p.locator('.scene-save-state').filter({ hasText: 'Đã lưu' }).waitFor();
  pass('Scene add, duplicate, undo, redo and save');
  await p.getByRole('button', { name: 'Chơi thử từ cảnh này' }).click();
  await p.locator('.vn-player[data-preview="true"]').waitFor(); await p.getByRole('button', { name: 'Quay lại trình soạn', exact: true }).click();
  pass('Play preview opens and closes');
  await p.getByRole('textbox', { name: 'Lời thoại', exact: true }).fill('QA failed save keeps this');
  model.failSave = true;
  await p.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await p.getByRole('alert').first().waitFor();
  assert.equal(await p.getByRole('textbox', { name: 'Lời thoại', exact: true }).inputValue(), 'QA failed save keeps this');
  assert.match(await p.locator('.scene-save-state').innerText(), /chưa lưu/i);
  model.failSave = false;
  await p.getByRole('button', { name: 'Lưu nháp', exact: true }).click(); await p.locator('.scene-save-state').filter({ hasText: 'Đã lưu' }).waitFor();
  pass('Failed save preserves edits and supports retry');
  await nav(p, 'chapters'); await p.getByRole('button', { name: 'Gửi duyệt', exact: true }).click();
  await p.getByRole('dialog').getByRole('button', { name: 'Gửi duyệt', exact: true }).click();
  await p.locator('.studio-submit-error').waitFor(); assert.equal(model.draft.status, 'DRAFT');
  await p.getByRole('dialog').getByRole('button', { name: 'Gửi duyệt', exact: true }).click();
  await p.locator('.sp-chapter-title .sp-tag').filter({ hasText: 'Chờ duyệt' }).waitFor();
  pass('Submit validation error stays open; retry submits');
  await p.getByRole('button', { name: 'Rút lại để sửa', exact: true }).click();
  await p.getByRole('button', { name: 'Gửi duyệt', exact: true }).waitFor();
  await p.getByRole('button', { name: 'Gửi duyệt', exact: true }).click();
  await p.getByRole('dialog').getByRole('button', { name: 'Gửi duyệt', exact: true }).click();
  await p.locator('.sp-chapter-title .sp-tag').filter({ hasText: 'Chờ duyệt' }).waitFor();
  pass('Author withdraws and resubmits'); await editor.context.close();

  const reviewer = await session('GAME_REVIEWER'); const r = reviewer.page;
  await nav(r, 'reviews'); await r.getByRole('link', { name: 'Xem chương', exact: true }).click();
  await r.getByRole('button', { name: 'JSON', exact: true }).click();
  assert.equal(await r.getByRole('button', { name: 'Lưu nháp', exact: true }).count(), 0);
  assert.equal(await r.getByRole('textbox', { name: 'JSON nội dung chương' }).getAttribute('readonly'), '');
  pass('Reviewer draft is read-only');
  await nav(r, 'reviews'); await r.getByRole('button', { name: 'Trả về', exact: true }).click();
  assert.equal(await r.getByRole('dialog').getByRole('button', { name: 'Trả về', exact: true }).isDisabled(), true);
  await r.getByRole('dialog').getByRole('button', { name: 'Huỷ', exact: true }).click();
  await r.getByRole('button', { name: 'Đạt', exact: true }).click();
  await r.getByRole('dialog').getByRole('button', { name: 'Chấm Đạt', exact: true }).click();
  await r.getByText('Không có chương đang chờ duyệt', { exact: true }).waitFor();
  assert.equal(model.draft.status, 'APPROVED'); pass('Reviewer rejection requires note; approval completes');
  await nav(r, 'assets'); await r.locator('.sp-asset').waitFor();
  assert.equal(await r.getByRole('button', { name: 'Tải ảnh lên', exact: true }).count(), 0);
  await nav(r, 'questions'); await r.locator('.sp-question-filters').waitFor();
  assert.equal(await r.getByRole('button', { name: 'Thêm câu hỏi', exact: true }).count(), 0);
  pass('Reviewer cannot mutate asset or question libraries'); await reviewer.context.close();

  const manager = await session('GAME_MANAGER'); const m = manager.page;
  await nav(m, 'releases'); await m.getByRole('button', { name: 'Phát hành bản 1.0.0' }).click();
  assert.equal(model.releases.length, 2);
  await m.getByRole('dialog').getByRole('button', { name: 'Phát hành 1.0.0', exact: true }).click();
  await m.getByRole('status').filter({ hasText: 'Đã phát hành' }).first().waitFor();
  assert.equal(model.draft.status, 'RELEASED'); pass('Manager publish requires confirmation and omits version override');
  await nav(m, 'history'); await m.getByRole('button', { name: 'Thu hồi bản này', exact: true }).click();
  const recall = m.getByRole('dialog'); assert.equal(await recall.getByRole('button', { name: /^Thu hồi 1/ }).isDisabled(), true);
  await m.getByLabel('Lý do thu hồi').fill('QA reason'); await recall.getByRole('button', { name: /^Thu hồi 1/ }).click();
  await m.locator('.sp-release').filter({ has: m.getByText('1.0.0', { exact: true }) }).getByRole('button', { name: 'Thu hồi bản này', exact: true }).waitFor({ state: 'detached' });
  assert.equal(model.releases.find(x => x.current).version, '0.9.0');
  await m.getByRole('listitem').filter({ hasText: '0.8.0' }).getByRole('button', { name: 'Dùng bản này', exact: true }).click();
  await m.getByRole('dialog').getByRole('button', { name: /^Chuyển sang/ }).click();
  await m.getByText('Đang chạy', { exact: true }).last().waitFor();
  assert.equal(model.releases.find(x => x.current).version, '0.8.0'); pass('Recall requires reason and falls back; switch current version works');
  await nav(m, 'questions'); await m.getByRole('button', { name: 'Thêm câu hỏi', exact: true }).first().click();
  await m.getByLabel('Nội dung câu hỏi', { exact: true }).fill('QA question');
  for (let i = 1; i <= 4; i++) await m.getByRole('textbox', { name: `Nội dung lựa chọn ${i}` }).fill(`Option ${i}`);
  await m.getByRole('button', { name: 'Lưu câu hỏi', exact: true }).click(); await m.locator('.sp-q-stem').filter({ hasText: 'QA question' }).waitFor();
  await m.getByRole('button', { name: 'Chỉnh sửa', exact: true }).click(); await m.getByRole('dialog').locator('textarea[name="stem"]').fill('QA question edited');
  await m.getByRole('button', { name: 'Lưu câu hỏi', exact: true }).click(); await m.locator('.sp-q-stem').filter({ hasText: 'QA question edited' }).waitFor();
  await m.getByText('Lọc nâng cao', { exact: true }).click(); await m.getByLabel('Hiện câu đã ngừng dùng').check(); await m.getByRole('button', { name: 'Áp dụng', exact: true }).click();
  await m.getByRole('button', { name: 'Ngừng dùng', exact: true }).click(); await m.getByRole('dialog').getByRole('button', { name: 'Ngừng dùng', exact: true }).click();
  await m.getByRole('button', { name: 'Khôi phục', exact: true }).click(); await m.getByRole('button', { name: 'Ngừng dùng', exact: true }).waitFor();
  pass('Question create, edit, retire and restore');
  await nav(m, 'assets'); await m.getByRole('button', { name: 'Tải ảnh lên', exact: true }).click();
  await m.getByRole('dialog').locator('input[type=file]').setInputFiles({ name: 'qa.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV1cAAAAASUVORK5CYII=', 'base64') });
  await m.getByRole('dialog').getByRole('button', { name: 'Tải ảnh lên', exact: true }).click();
  await m.getByRole('dialog').waitFor({ state: 'detached' });
  await m.locator('.sp-asset').click(); await m.getByRole('dialog').locator('input[name=label]').fill('QA image edited'); await m.getByRole('button', { name: 'Lưu tên', exact: true }).click();
  await m.locator('.sp-asset').filter({ hasText: 'QA image edited' }).click(); await m.getByRole('button', { name: 'Xoá tài nguyên', exact: true }).click();
  await m.getByRole('button', { name: 'Xoá vĩnh viễn', exact: true }).click(); await m.locator('.sp-asset').waitFor({ state: 'detached' });
  pass('Image multipart upload, rename and orphan deletion'); await manager.context.close();
} catch (error) {
  results.push({ status: 'FAIL', name: 'Core user journey', message: error.stack });
  console.error(error.message);
  for (const context of browser.contexts()) for (const page of context.pages()) await screenshot(page, 'journey-failure').catch(() => {});
} finally {
  writeFileSync(path.join(folder, 'user-journey.json'), JSON.stringify({ results, findings, browserErrors, writes }, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ passed: results.filter(x => x.status === 'PASS').length, failed: results.filter(x => x.status === 'FAIL').length, browserErrors }, null, 2));
if (results.some(x => x.status === 'FAIL') || browserErrors.length) process.exitCode = 1;
