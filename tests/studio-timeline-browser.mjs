import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const base = process.env.STUDIO_TEST_BASE || 'http://localhost:5173';
const errors = [];
const linear = () => [
  { id: 'A', title: 'Alpha', type: 'dialogue', text: 'A', nextSceneId: 'B' },
  { id: 'B', title: 'Beta', type: 'dialogue', text: 'B', nextSceneId: 'C' },
  { id: 'C', title: 'Gamma', type: 'dialogue', text: 'C', nextSceneId: 'END' },
  { id: 'END', title: 'End', type: 'ending' },
];
const ids = page => page.locator('[data-timeline-id]').evaluateAll(nodes => nodes.map(node => node.dataset.timelineId));
const save = async page => {
  await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await page.locator('.scene-save-state').filter({ hasText: 'Đã lưu' }).waitFor();
  return page.evaluate(() => window.studioNavigation.content.CH04.scenes);
};
const undo = page => page.locator('button[aria-label="Hoàn tác"]').click();
const redo = page => page.getByRole('button', { name: 'Làm lại', exact: true }).click();
async function check(name, scenes, test, mobile = false) {
  const context = await browser.newContext({ viewport: { width: mobile ? 390 : 1440, height: mobile ? 844 : 1000 }, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(`${base}/tests/fixtures/studio-editor-navigation-browser.html`);
    await page.evaluate(scenes => { window.studioNavigation.content.CH04.scenes = scenes; }, scenes);
    await page.getByRole('link', { name: 'Mở CH04', exact: true }).click();
    await page.locator('.scene-thumbnail').first().waitFor();
    await test(page, context);
    console.log(`PASS: ${name}`);
  } finally { await context.close(); }
}
try {
  await check('end button appends while first scene is selected; undo and redo keep placement', linear(), async page => {
    await page.getByRole('button', { name: 'Thêm cảnh vào cuối chương', exact: true }).click();
    await page.getByRole('heading', { name: 'Thêm cảnh vào cuối chương' }).waitFor();
    await page.getByRole('dialog').getByRole('button', { name: /^Lời thoại/ }).click();
    assert.equal((await ids(page)).length, 5);
    assert.deepEqual((await ids(page)).slice(0, 4), ['A', 'B', 'C', 'END']);
    const added = (await ids(page)).at(-1);
    assert.equal(await page.locator('.scene-thumbnail[aria-pressed=true]').getAttribute('aria-label'), `Cảnh 5: ${added}`);
    await page.locator('.scene-undo-bar').getByRole('button', { name: 'Hoàn tác' }).click();
    assert.deepEqual(await ids(page), ['A', 'B', 'C', 'END']);
    await redo(page); assert.equal((await ids(page)).at(-1), added);
    const saved = await save(page);
    assert.equal(saved.at(-1).id, added);
    await page.evaluate(() => window.navigateStudio('/internal/assets'));
    await page.locator('.scene-thumbnail').first().waitFor({ state: 'detached' });
    await page.evaluate(() => window.navigateStudio('/internal/editor/CH04'));
    await page.locator('.scene-thumbnail').first().waitFor();
    assert.equal((await ids(page)).at(-1), added);
  });
  await check('hovering a gap inserts exactly between two scenes and reconnects incoming branches', [
    { id: 'Q', type: 'choice', title: 'Question', text: 'Q', options: [{ id: 'yes', text: 'Yes', nextSceneId: 'B' }, { id: 'no', text: 'No', nextSceneId: 'END' }] },
    ...linear().slice(1),
  ], async page => {
    const gap = page.locator('.scene-insert-gap').nth(1);
    await gap.hover();
    assert.equal(await gap.locator('button').evaluate(button => getComputedStyle(button).opacity), '1');
    await gap.getByRole('button').click();
    await page.getByRole('heading', { name: 'Thêm cảnh giữa cảnh 1 và 2' }).waitFor();
    await page.getByRole('dialog').getByRole('button', { name: /^Lời thoại/ }).click();
    const order = await ids(page), added = order[1];
    assert.deepEqual([order[0], ...order.slice(2)], ['Q', 'B', 'C', 'END']);
    const saved = await save(page);
    assert.equal(saved[0].options[0].nextSceneId, added);
    assert.equal(saved[0].options[1].nextSceneId, 'END');
    assert.equal(saved[1].nextSceneId, 'B');
  });
  await check('native drag changes straight playback order, keeps selection and supports undo/redo', linear(), async page => {
    await page.locator('[data-timeline-id=C] .scene-thumbnail').dragTo(page.locator('.scene-insert-gap').nth(1));
    assert.deepEqual(await ids(page), ['A', 'C', 'B', 'END']);
    assert.equal(await page.locator('.scene-thumbnail[aria-pressed=true]').getAttribute('aria-label'), 'Cảnh 2: Gamma');
    await undo(page); assert.deepEqual(await ids(page), ['A', 'B', 'C', 'END']);
    await redo(page); assert.deepEqual(await ids(page), ['A', 'C', 'B', 'END']);
    const saved = await save(page);
    assert.deepEqual(saved.slice(0, 3).map(scene => scene.nextSceneId), ['C', 'B', 'END']);
  });
  await check('keyboard move preserves branch targets and scene data', [
    { id: 'Q', title: 'Question', type: 'conditional', condition: { var: 'money', op: '>', value: 0 }, ifTrueSceneId: 'B', ifFalseSceneId: 'END' },
    ...linear().slice(1),
  ], async page => {
    await page.locator('[data-timeline-id=B] .scene-thumbnail').focus();
    await page.keyboard.press('Alt+ArrowRight');
    assert.deepEqual(await ids(page), ['Q', 'C', 'B', 'END']);
    const saved = await save(page);
    assert.equal(saved[0].ifTrueSceneId, 'B');
    assert.equal(saved[0].ifFalseSceneId, 'END');
    assert.equal(saved[1].nextSceneId, 'END');
    assert.equal(saved[2].nextSceneId, 'C');
  });
  await check('touch handle reorders on mobile without overflowing the document', linear(), async (page, context) => {
    await page.locator('.scene-timeline').scrollIntoViewIfNeeded();
    const source = page.locator('[data-timeline-id=A] .scene-reorder-handle');
    const target = page.locator('.scene-insert-gap').nth(2);
    const a = await source.boundingBox(), b = await target.boundingBox();
    const cdp = await context.newCDPSession(page);
    const y = a.y + a.height / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x + a.width / 2, y }] });
    for (let step = 1; step <= 12; step++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: a.x + a.width / 2 + (b.x + b.width / 2 - a.x - a.width / 2) * step / 12, y }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.deepEqual(await ids(page), ['B', 'A', 'C', 'END']);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const saved = await save(page);
    assert.deepEqual(saved.slice(0, 3).map(scene => scene.nextSceneId), ['A', 'C', 'END']);
  }, true);
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
