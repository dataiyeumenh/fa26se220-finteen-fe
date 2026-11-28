import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const base = process.env.STUDIO_TEST_BASE || 'http://localhost:5173';
const image = '/images/c1/scene/c1_cutscene_reading_manga.webp';
const replacement = '/images/c1/teo/c1_teo_neutral.webp';
const errors = [];
const scenes = () => [
  { id: 'CH03_SC01_JOBS', type: 'dialogue', title: 'An xem qua các việc làm', background: image, text: 'Để mình xem qua các việc làm trước đã.', nextSceneId: 'QUESTION', inspect: {
    id: 'ch03_job_compare', buttonText: 'Xem bảng so sánh ba việc', dataText: 'Quỹ thời gian: 12 giờ/tuần.', setFlags: { jobs_compared: true },
    popupImages: [
      { src: image, caption: 'Việc 1', description: 'Mô tả 1' },
      { src: image, caption: 'Việc 2', description: 'Mô tả 2' },
      { src: image, caption: 'Việc 3', description: 'Mô tả 3' },
    ],
  } },
  { id: 'QUESTION', type: 'choice', title: 'Câu hỏi có nút xem', text: 'Chọn một việc', options: [{ id: 'a', text: 'Việc A', nextSceneId: 'CARDS' }, { id: 'b', text: 'Việc B', nextSceneId: 'END' }], inspect: { id: 'reference', buttonText: 'Xem lại thông tin', popupImage: image, dataText: 'Thông tin gốc' } },
  { id: 'CARDS', type: 'dialogue', title: 'Cảnh có thẻ', text: 'Đọc các thẻ', nextSceneId: 'END', inspect: { id: 'cards', buttonText: 'Mở sổ tay', autoNextSceneOnClose: true, cards: [
    { id: 'c1', label: 'Thẻ 1', image, text: 'Nội dung thẻ 1', sections: [{ label: 'Thông tin chung', items: ['Dòng gốc 1', 'Dòng gốc 2'] }] },
    { id: 'c2', label: 'Thẻ 2', image, text: 'Nội dung thẻ 2' },
  ] } },
  { id: 'END', type: 'ending', title: 'Kết thúc' },
];
const panel = page => page.locator('[aria-labelledby="inspect-panel-title"]');
async function save(page) {
  await page.getByRole('button', { name: 'Lưu nháp', exact: true }).click();
  await page.locator('.scene-save-state').filter({ hasText: 'Đã lưu' }).waitFor();
  return page.evaluate(() => window.studioNavigation.content.CH04.scenes);
}
async function check(width) {
  const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 1000 }, isMobile: width < 600, hasTouch: width < 600 });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(`${base}/tests/fixtures/studio-editor-navigation-browser.html`);
    await page.evaluate(async ({ scenes, replacement }) => {
      window.studioNavigation.content.CH04.scenes = scenes;
      const { auth } = await import('/src/api/auth.api.js');
      const request = auth.accountRequest;
      auth.accountRequest = (path, options) => path.startsWith('/api/studio/assets') ? Promise.resolve([{ id: 'asset', kind: 'IMAGE', label: 'Ảnh kiểm thử', url: replacement, chapterCode: 'CH04', status: 'IN_USE' }]) : request(path, options);
    }, { scenes: scenes(), replacement });
    await page.getByRole('link', { name: 'Mở CH04', exact: true }).click();
    await page.getByLabel('Chữ trên nút bấm để xem', { exact: true }).waitFor();
    const layout = await page.evaluate(() => {
      const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
      return { preview: box('.scene-editor-workbench'), properties: box('.scene-inspector'), content: box('.scene-content-area'), workspace: box('.scene-editor-body') };
    });
    if (width > 850) {
      assert.ok(Math.abs(layout.preview.height - layout.properties.height) < 1, 'Preview and properties should have equal height');
      assert.ok(layout.content.top >= layout.preview.bottom - 1, 'Content should start below both columns');
      assert.ok(Math.abs(layout.content.width - layout.workspace.width) < 1, 'Interaction content should use the workspace width');
      await page.getByRole('button', { name: 'Thu gọn bảng bên', exact: true }).click();
      assert.equal(await page.locator('.scene-inspector').count(), 0);
      await page.getByRole('button', { name: 'Mở bảng bên', exact: true }).click();
      await page.locator('.scene-inspector').waitFor();
    } else {
      assert.ok(layout.properties.top >= layout.preview.bottom - 1, 'Mobile properties should follow the preview');
      assert.ok(layout.content.top >= layout.properties.bottom - 1, 'Mobile content should follow the properties');
    }
    assert.equal(await page.getByLabel('Chữ trên nút bấm để xem', { exact: true }).inputValue(), 'Xem bảng so sánh ba việc');
    assert.equal(await panel(page).locator('[aria-label="Các ảnh khi mở"] > .inspect-content-list > details').count(), 3);
    await panel(page).getByLabel('Tên nút mở thông tin', { exact: true }).fill('Xem ba công việc');
    assert.equal(await page.getByLabel('Chữ trên nút bấm để xem', { exact: true }).inputValue(), 'Xem ba công việc');
    const gallery = panel(page).locator('[aria-label="Các ảnh khi mở"] > .inspect-content-list > details');
    await gallery.nth(1).locator('summary').click();
    await gallery.nth(1).getByLabel('Chú thích ảnh', { exact: true }).fill('Công việc 2');
    await gallery.nth(1).getByLabel('Mô tả', { exact: true }).fill('Thu nhập thực nhận 2');
    await gallery.nth(1).getByRole('button', { name: 'Đổi ảnh', exact: true }).click();
    await page.locator('.sp-asset').first().click();
    const saved = await save(page);
    assert.equal(saved[0].inspect.popupImages.length, 3);
    assert.equal(saved[0].inspect.popupImages[0].src, image);
    assert.deepEqual(saved[0].inspect.popupImages[1], { src: replacement, caption: 'Công việc 2', description: 'Thu nhập thực nhận 2' });
    assert.deepEqual(saved[0].inspect.setFlags, { jobs_compared: true });
    assert.equal(saved[0].nextSceneId, 'QUESTION');
    await page.getByRole('button', { name: 'Chơi thử từ cảnh này', exact: true }).click();
    await page.locator('.vn-player').getByRole('button', { name: 'Xem ba công việc', exact: true }).click();
    assert.equal(await page.locator('.vn-popup-grid figure').count(), 3);
    assert.equal(await page.locator('.vn-popup-grid figure').nth(1).locator('figcaption').innerText(), 'Công việc 2');
    assert.equal(await page.locator('.vn-popup-grid figure').nth(1).locator('img').getAttribute('src'), replacement);
    await page.locator('.vn-inspect-done').click();
    await page.getByRole('button', { name: 'Quay lại trình soạn', exact: true }).click();
    await page.getByRole('button', { name: 'Cá nhân hóa', exact: true }).click();
    await page.getByLabel('Chữ trên nút bấm để xem', { exact: true }).fill('Xem ba công việc thể thao');
    await gallery.nth(1).getByLabel('Chú thích ảnh', { exact: true }).fill('Công việc thể thao 2');
    await page.getByRole('combobox', { name: 'Sở thích', exact: true }).selectOption('MUSIC');
    assert.equal(await page.getByLabel('Chữ trên nút bấm để xem', { exact: true }).inputValue(), 'Xem ba công việc');
    assert.equal(await gallery.nth(1).getByLabel('Chú thích ảnh', { exact: true }).inputValue(), 'Công việc 2');
    await page.getByRole('combobox', { name: 'Sở thích', exact: true }).selectOption('SPORT');
    const personalized = await save(page);
    assert.equal(personalized[0].inspect.buttonText, 'Xem ba công việc');
    assert.equal(personalized[0].inspect.variants['interest:SPORT'].buttonText, 'Xem ba công việc thể thao');
    assert.equal(personalized[0].inspect.popupImages[1].variants['interest:SPORT'].caption, 'Công việc thể thao 2');
    await page.getByRole('button', { name: 'Bản gốc', exact: true }).click();
    await page.getByRole('button', { name: 'Cảnh 2: Câu hỏi có nút xem', exact: true }).click();
    await panel(page).getByLabel('Nội dung khi bấm xem', { exact: true }).fill('Thông tin đã chỉnh');
    assert.equal(await page.getByLabel('Chữ trên nút bấm để xem', { exact: true }).inputValue(), 'Xem lại thông tin');
    await page.getByRole('button', { name: 'Cảnh 3: Cảnh có thẻ', exact: true }).click();
    const first = panel(page).locator('[aria-label="Các thẻ thông tin"] > .inspect-content-list > details').first();
    await first.getByLabel('Tiêu đề', { exact: true }).first().fill('Thẻ đã chỉnh 1');
    await first.locator('[aria-label="Các dòng thông tin"] textarea').first().fill('Dòng đã chỉnh 1');
    const result = await save(page);
    assert.equal(result[1].inspect.dataText, 'Thông tin đã chỉnh');
    assert.deepEqual(result[1].options, scenes()[1].options);
    assert.equal(result[2].inspect.cards[0].label, 'Thẻ đã chỉnh 1');
    assert.deepEqual(result[2].inspect.cards[0].sections[0].items, ['Dòng đã chỉnh 1', 'Dòng gốc 2']);
    assert.equal(result[2].inspect.cards[0].id, 'c1');
    assert.equal(result[2].inspect.cards[1].label, 'Thẻ 2');
    assert.equal(result[2].inspect.autoNextSceneOnClose, true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log(`PASS ${width}: dialogue/choice inspect, full gallery, real game popup, cards, personalization, saved routes and flags`);
  } finally { await context.close(); }
}
try {
  await check(1440);
  await check(390);
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
