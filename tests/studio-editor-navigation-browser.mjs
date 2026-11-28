import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const folder = path.resolve('output/studio-editor-navigation');
mkdirSync(folder, { recursive: true });
const base = process.env.STUDIO_TEST_BASE || 'http://localhost:5173';
const results = [], errors = [];
const modal = page => page.getByRole('alertdialog');
const speech = page => page.locator('textarea[aria-label="Lời thoại"]');
const goAssets = page => page.getByRole('navigation', { name: 'Điều hướng Studio' }).locator('a[href="/internal/assets"]').click();
const savedText = page => page.evaluate(() => window.studioNavigation.content.CH04.scenes[0].text);
async function check(name, test, { width = 1440, fresh = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 } });
  const page = await context.newPage(); page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push({ name, message: error.message }));
  await page.route('**/*', route => route.request().method() !== 'GET' && !route.request().url().startsWith(base) ? route.abort() : route.continue());
  try {
    await page.goto(`${base}/tests/fixtures/studio-editor-navigation-browser.html`);
    await page.getByRole('link', { name: fresh ? 'Tạo CH05' : 'Mở CH04', exact: true }).click();
    await speech(page).waitFor();
    await test(page);
    results.push({ name, width, status: 'PASS' }); console.log(`PASS: ${name} (${width})`);
  } catch (error) {
    results.push({ name, width, status: 'FAIL', message: error.stack });
    await page.screenshot({ path: path.join(folder, `${results.length}-failure.png`), fullPage: true });
    console.error(`FAIL: ${name}: ${error.message}`);
  } finally { await context.close(); }
}
try {
  await check('Sidebar: stay preserves edits; save and leave persists then navigates', async page => {
    await speech(page).fill('Saved before sidebar navigation'); await goAssets(page);
    await modal(page).getByRole('button', { name: 'Ở lại chỉnh sửa' }).click();
    assert.equal(await speech(page).inputValue(), 'Saved before sidebar navigation');
    await goAssets(page); await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click();
    await page.waitForURL('**/internal/assets');
    assert.equal(await savedText(page), 'Saved before sidebar navigation');
    assert.equal(await page.evaluate(() => window.studioNavigation.putCount), 1);
  });
  await check('Breadcrumb: discard leaves without saving', async page => {
    await speech(page).fill('Discard this'); await page.locator('.scene-editor-back').click();
    await modal(page).getByRole('button', { name: 'Không lưu và rời đi' }).click();
    await page.waitForURL('**/internal/chapters'); assert.equal(await page.evaluate(() => window.studioNavigation.putCalls), 0);
  });
  await check('Brand link: Escape cancels leaving', async page => {
    await speech(page).fill('Keep this'); await page.locator('a.studio-brand').click();
    await modal(page).waitFor(); await page.keyboard.press('Escape'); await modal(page).waitFor({ state: 'detached' });
    assert.equal(await speech(page).inputValue(), 'Keep this');
  });
  await check('Failed save remains in editor and supports retry', async page => {
    await speech(page).fill('Retry my save'); await page.evaluate(() => { window.studioNavigation.failSave = true; }); await goAssets(page);
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click();
    await modal(page).getByRole('alert').waitFor(); assert.equal(new URL(page.url()).pathname, '/internal/editor/CH04');
    assert.equal(await speech(page).inputValue(), 'Retry my save');
    await page.evaluate(() => { window.studioNavigation.failSave = false; });
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click();
    await page.waitForURL('**/internal/assets'); assert.equal(await savedText(page), 'Retry my save');
  });
  await check('Invalid JSON never saves or leaves', async page => {
    await page.getByRole('button', { name: 'JSON', exact: true }).click(); await page.getByRole('textbox', { name: 'JSON nội dung chương' }).fill('{');
    await goAssets(page); await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click(); await modal(page).getByRole('alert').waitFor();
    assert.equal(await page.evaluate(() => window.studioNavigation.putCalls), 0);
    await modal(page).getByRole('button', { name: 'Ở lại chỉnh sửa' }).click(); assert.equal(await page.getByRole('textbox', { name: 'JSON nội dung chương' }).inputValue(), '{');
  });
  await check('Repeated save clicks send once; Escape cannot close a running save', async page => {
    await speech(page).fill('Save once'); await page.evaluate(() => { window.studioNavigation.delay = 900; }); await goAssets(page);
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).evaluate(button => { button.click(); button.click(); });
    await page.keyboard.press('Escape'); assert.equal(await modal(page).count(), 1);
    await page.waitForURL('**/internal/assets'); assert.equal(await page.evaluate(() => window.studioNavigation.putCalls), 1);
  });
  await check('Browser Back: stay restores history; save proceeds to original destination', async page => {
    await speech(page).fill('Save on browser Back'); await page.evaluate(() => history.back()); await modal(page).waitFor();
    await modal(page).getByRole('button', { name: 'Ở lại chỉnh sửa' }).click(); await page.waitForURL('**/internal/editor/CH04');
    await page.evaluate(() => history.back()); await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click();
    await page.getByRole('heading', { name: 'Navigation fixture' }).waitFor(); assert.equal(await savedText(page), 'Save on browser Back');
    await page.evaluate(() => history.forward()); await speech(page).waitFor(); assert.equal(await speech(page).inputValue(), 'Save on browser Back');
  });
  await check('Browser Forward is guarded', async page => {
    await goAssets(page); await page.waitForURL('**/internal/assets'); await page.evaluate(() => history.back()); await speech(page).waitFor();
    await speech(page).fill('Keep before Forward'); await page.evaluate(() => history.forward()); await modal(page).waitFor();
    await modal(page).getByRole('button', { name: 'Ở lại chỉnh sửa' }).click(); assert.equal(await speech(page).inputValue(), 'Keep before Forward');
  });
  await check('Programmatic navigation saves old chapter before switching chapter', async page => {
    await speech(page).fill('Old chapter saved'); await page.evaluate(() => { void window.navigateStudio('/internal/editor/CH05'); });
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click(); await page.waitForURL('**/internal/editor/CH05');
    assert.equal(await savedText(page), 'Old chapter saved'); assert.equal(await speech(page).inputValue(), 'Original dialogue');
  });
  await check('Logout requires choice and saves before signing out', async page => {
    await speech(page).fill('Save before logout'); await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
    assert.equal(await page.evaluate(() => window.studioNavigation.signOuts), 0);
    await modal(page).getByRole('button', { name: 'Ở lại chỉnh sửa' }).click(); await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click(); await page.waitForFunction(() => window.studioNavigation.signOuts === 1);
    assert.deepEqual(await page.evaluate(() => window.studioNavigation.events), ['put-start', 'put-saved', 'logout']);
  });
  await check('New chapter can save from leave confirmation', async page => {
    await speech(page).fill('New chapter saved on leave'); await goAssets(page); await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click();
    await page.waitForURL('**/internal/assets'); assert.equal(await page.evaluate(() => window.studioNavigation.content.CH05.scenes[0].text), 'New chapter saved on leave');
  }, { fresh: true });
  await check('New chapter toolbar save clears new flag without a leave prompt', async page => {
    await speech(page).fill('New chapter toolbar save'); await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
    await page.waitForURL('**/internal/editor/CH05'); assert.equal(await modal(page).count(), 0); assert.equal(await speech(page).inputValue(), 'New chapter toolbar save');
  }, { fresh: true });
  await check('Persisted save still leaves if refresh fails', async page => {
    await speech(page).fill('Persisted despite refresh failure'); await page.evaluate(() => { window.studioNavigation.failRefresh = true; }); await goAssets(page);
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click(); await page.waitForURL('**/internal/assets'); assert.equal(await savedText(page), 'Persisted despite refresh failure');
  });
  await check('Reload triggers native beforeunload; cancelling keeps edits', async page => {
    await speech(page).fill('Do not reload'); const dialogPromise = page.waitForEvent('dialog', { timeout: 6000 });
    const reloading = page.reload({ waitUntil: 'domcontentloaded', timeout: 6000 }).catch(() => {});
    const dialog = await dialogPromise; assert.equal(dialog.type(), 'beforeunload'); await dialog.dismiss(); await reloading;
    assert.equal(await speech(page).inputValue(), 'Do not reload');
  });
  await check('An open scene dialog must be completed before save and leave', async page => {
    await page.getByRole('button', { name: 'Thêm cảnh', exact: true }).click();
    await page.locator('.studio-kind-grid').waitFor();
    await page.evaluate(() => history.back()); await modal(page).waitFor();
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click();
    await modal(page).getByRole('alert').waitFor(); assert.equal(await page.evaluate(() => window.studioNavigation.putCalls), 0);
    await modal(page).getByRole('button', { name: 'Ở lại chỉnh sửa' }).click();
    assert.equal(await page.locator('.studio-kind-grid').isVisible(), true);
  });
  await check('Clean editor leaves without popup', async page => { await goAssets(page); await page.waitForURL('**/internal/assets'); assert.equal(await modal(page).count(), 0); });
  await check('Mobile drawer navigation saves before leaving', async page => {
    await speech(page).fill('Mobile saved'); await page.getByRole('button', { name: 'Mở menu Studio nội dung' }).click(); await goAssets(page);
    await modal(page).getByRole('button', { name: 'Lưu nháp và rời đi' }).click(); await page.waitForURL('**/internal/assets');
    assert.equal(await savedText(page), 'Mobile saved'); assert.equal(await page.locator('.ft-sidebar-drawer').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  }, { width: 390 });
} finally {
  writeFileSync(path.join(folder, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await browser.close();
}
console.log(JSON.stringify({ passed: results.filter(r => r.status === 'PASS').length, failed: results.filter(r => r.status === 'FAIL').length, errors }));
if (results.some(r => r.status === 'FAIL') || errors.length) process.exitCode = 1;
