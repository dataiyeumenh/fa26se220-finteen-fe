// Optional browser smoke test. Set PLAYWRIGHT_MODULE to a Playwright index.mjs
// outside the project, and BROWSER_EXECUTABLE to a local Chrome/Edge binary.
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { createServer } from 'vite'
import { mkdir } from 'node:fs/promises'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright')
const server = await createServer({ server: { host: '127.0.0.1', port: 5193, strictPort: true, hmr: false } })
await server.listen()
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || undefined })
const errors = []
const writes = []
const draft = { code: 'CH04', title: 'Chương thử', status: 'DRAFT', editorId: 'seed', editorName: 'Seed', revision: 1, changeClass: 'MINOR' }
let content = { title: 'Chương thử', scenes: [{ id: 'SC01', type: 'dialogue', text: 'Xin chào', nextSceneId: 'END', characters: [] }, { id: 'END', type: 'ending', title: 'Kết thúc', characters: [] }] }
let questions = []
let aiKeys = []
let uploads = 0
let rejectNextSubmit = true
const pathWarning = 'đường đi: thiếu "đi tiếp tới đâu" tại SC01'
const assets = [{ id: 'asset', registered: true, kind: 'IMAGE', label: 'Nhà An', ref: '{{ASSET_BASE}}/a/demo.webp', url: '/images/map/journey-v2/finteen-map-01-home.png', status: 'ORPHAN', usage: [], chapterCode: 'CH04' }]
let releases = [{ version: '0.9.0', current: true, chapters: [], changeClass: 'PATCH' }]
const schema = { schemaVersion: 2, type: 'object', properties: { scenes: { type: 'array', items: { properties: { type: { enum: ['dialogue', 'choice', 'ending'] } } } } } }

async function session(role) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/finteen/api/**', async route => {
    const request = route.request()
    const path = new URL(request.url()).pathname.replace('/finteen', '')
    const method = request.method()
    const body = request.headers()['content-type']?.includes('application/json') ? request.postDataJSON() : null
    let result
    let status = 200
    let code = 0
    let message = ''
    if (method !== 'GET') writes.push({ role, method, path, body })
    if (path === '/api/auth/internal/login') result = { accessToken: `test-${role}`, expiresIn: 28800 }
    else if (path === '/api/auth/me') result = { id: role, roles: [role], plans: [], displayName: role, email: `${role}@example.com` }
    else if (path === '/api/studio/chapters') result = [draft]
    else if (path.endsWith('/draft')) {
      if (method === 'PUT') { assert.equal(body.scenes.some(scene => 'onFailSceneId' in scene), false); content = body; Object.assign(draft, { editorId: role, editorName: role, revision: draft.revision + 1, status: 'DRAFT' }) }
      result = method === 'PUT' ? { code: draft.code, title: content.title, warnings: [pathWarning] } : { draft: { ...draft }, content }
    } else if (path.endsWith('/submit')) {
      if (rejectNextSubmit) { rejectNextSubmit = false; status = 400; code = 1001; message = pathWarning }
      else { draft.status = 'SUBMITTED'; result = draft }
    }
    else if (path.endsWith('/withdraw')) { draft.status = 'DRAFT'; result = draft }
    else if (path.endsWith('/review')) {
      assert.ok(body.note.trim())
      assert.notEqual(draft.editorId, role)
      Object.assign(draft, { status: body.pass ? 'APPROVED' : 'REJECTED', reviewerId: role, reviewerName: role, reviewNote: body.note })
      result = draft
    } else if (path === '/api/studio/scene-schema') result = schema
    else if (path === '/api/studio/releases/next') result = { version: '1.0.0', changeClass: 'MINOR', currentVersion: releases.find(release => release.current)?.version, drafts: [draft] }
    else if (path === '/api/studio/releases') {
      if (method === 'POST') { assert.equal(body.version, undefined); releases.forEach(release => { release.current = false }); releases.push({ version: '1.0.0', current: true, chapters: [{ code: 'CH04' }], note: body.note }) }
      result = releases
    } else if (path.endsWith('/current')) { releases.forEach(release => { release.current = path.includes(release.version) }); result = {} }
    else if (path.endsWith('/recall')) { assert.ok(body.reason.trim()); const release = releases.find(value => path.includes(value.version)); release.current = false; release.recalledAt = new Date().toISOString(); result = {} }
    else if (path === '/api/studio/assets') {
      if (method === 'POST') {
        assert.match(request.headers()['content-type'], /multipart\/form-data; boundary=/)
        assert.match(request.postDataBuffer().toString(), /name="file"/)
        assert.equal(request.headers().authorization, `Bearer test-${role}`)
        result = { asset: assets[0], duplicate: uploads++ > 0 }
      } else result = assets
    }
    else if (path === '/api/studio/assets/asset') {
      if (method === 'PUT') Object.assign(assets[0], body)
      result = assets[0]
      if (method === 'DELETE') assets.splice(0)
    } else if (path === '/api/studio/questions') {
      if (method === 'POST') questions.push({ ...body, id: 'question' })
      result = questions
    } else if (path === '/api/studio/questions/question') { questions[0] = { ...questions[0], ...body }; result = questions[0] }
    else if (path.endsWith('/retire') || path.endsWith('/restore')) { questions[0].retiredAt = path.endsWith('/retire') ? new Date().toISOString() : null; result = questions[0] }
    else if (path === '/api/plans') result = []
    else if (path === '/api/admin/ai-keys') {
      if (method === 'POST') aiKeys.push({ id: 'key', provider: body.provider, alias: body.alias, masked: '****test', priority: body.priority, enabled: true })
      result = aiKeys
    } else if (path.startsWith('/api/admin/ai-keys/key')) {
      if (path.endsWith('/test')) Object.assign(aiKeys[0], { lastTestOk: true, lastTestAt: new Date().toISOString() })
      if (path.endsWith('/disable')) aiKeys[0].enabled = false
      if (path.endsWith('/enable')) aiKeys[0].enabled = true
      result = aiKeys[0]
      if (method === 'DELETE') aiKeys = []
    }
    else { status = 404; code = 9999; message = `Unexpected mock endpoint ${method} ${path}`; errors.push(message) }
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ code, result, message }) })
  })
  await page.goto('http://127.0.0.1:5193/internal/login')
  await page.getByRole('textbox', { name: 'Địa chỉ email' }).fill(`${role}@example.com`)
  await page.getByLabel('Mật khẩu', { exact: true }).fill('test-password')
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await page.waitForURL('**/internal')
  if (role !== 'ADMIN') {
    const heading = { GAME_EDITOR: 'KHÔNG GIAN BIÊN TẬP', GAME_REVIEWER: 'KHÔNG GIAN KIỂM DUYỆT', GAME_MANAGER: 'KHÔNG GIAN PHÁT HÀNH' }[role]
    await page.getByText(heading, { exact: true }).waitFor()
    if (process.env.STUDIO_SCREENSHOT_DIR) {
      await mkdir(process.env.STUDIO_SCREENSHOT_DIR, { recursive: true })
      await page.screenshot({ path: `${process.env.STUDIO_SCREENSHOT_DIR}/${role.toLowerCase()}-overview.png`, fullPage: true })
    }
  }
  return { page, context }
}

try {
  const editor = await session('GAME_EDITOR')
  await editor.page.getByRole('navigation', { name: 'Điều hướng Studio' }).locator('a[href="/internal/chapters"]').click()
  await editor.page.getByRole('link', { name: 'Mở trình soạn' }).click()
  await editor.page.getByRole('button', { name: 'Cảnh 1: SC01', exact: true }).waitFor()
  await editor.page.getByRole('button', { name: 'Thêm cảnh', exact: true }).first().click()
  await editor.page.getByLabel('Tiêu đề cảnh', { exact: true }).fill('Cảnh vừa thêm')
  await editor.page.getByRole('button', { name: 'Nhân đôi cảnh', exact: true }).click()
  await editor.page.getByRole('button', { name: 'Cảnh 3: Cảnh vừa thêm (bản sao)', exact: true }).waitFor()
  await editor.page.setViewportSize({ width: 800, height: 900 })
  const timeline = editor.page.locator('.scene-timeline-track')
  await timeline.evaluate(element => { element.scrollLeft = 0 })
  await timeline.hover()
  await editor.page.mouse.wheel(0, 240)
  await editor.page.waitForFunction(() => document.querySelector('.scene-timeline-track').scrollLeft > 0)
  await editor.page.mouse.wheel(0, -240)
  await editor.page.waitForFunction(() => document.querySelector('.scene-timeline-track').scrollLeft === 0)
  await editor.page.setViewportSize({ width: 1600, height: 1000 })
  if (process.env.STUDIO_SCREENSHOT_DIR) {
    await mkdir(process.env.STUDIO_SCREENSHOT_DIR, { recursive: true })
    await editor.page.screenshot({ path: `${process.env.STUDIO_SCREENSHOT_DIR}/editor-desktop.png`, fullPage: true })
    await editor.page.setViewportSize({ width: 390, height: 844 })
    assert.equal(await editor.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true)
    await editor.page.screenshot({ path: `${process.env.STUDIO_SCREENSHOT_DIR}/editor-mobile.png`, fullPage: true })
    await editor.page.setViewportSize({ width: 1600, height: 1000 })
  }
  await editor.page.getByRole('button', { name: 'JSON', exact: true }).click()
  const json = editor.page.getByRole('textbox', { name: 'JSON nội dung chương' })
  content.title = 'Đã biên tập'
  content.scenes[0].onFailSceneId = 'obsolete-transition'
  await json.fill(JSON.stringify(content))
  await editor.page.getByRole('button', { name: 'Lưu nháp', exact: true }).click()
  await editor.page.getByRole('status').filter({ hasText: 'Đã lưu nháp' }).waitFor()
  await editor.page.getByText('Cảnh báo cần kiểm tra (1)', { exact: true }).waitFor()
  await editor.page.getByText(pathWarning, { exact: true }).waitFor()
  await editor.page.getByRole('navigation').locator('a[href="/internal/chapters"]').click()
  await editor.page.getByRole('button', { name: 'Gửi duyệt', exact: true }).click()
  const submitDialog = editor.page.getByRole('dialog')
  await submitDialog.getByRole('button', { name: 'Gửi duyệt', exact: true }).click()
  await editor.page.locator('.studio-submit-error').getByText(pathWarning, { exact: false }).waitFor()
  assert.equal(draft.status, 'DRAFT')
  await submitDialog.getByRole('button', { name: 'Gửi duyệt', exact: true }).click()
  await editor.page.getByText('Chờ duyệt', { exact: true }).waitFor()
  await editor.context.close()

  const reviewer = await session('GAME_REVIEWER')
  await reviewer.page.getByRole('navigation').locator('a[href="/internal/reviews"]').click()
  await reviewer.page.getByRole('link', { name: 'Xem và chơi thử' }).click()
  assert.equal(await reviewer.page.getByRole('button', { name: 'Lưu nháp', exact: true }).count(), 0)
  await reviewer.page.getByRole('button', { name: 'JSON', exact: true }).click()
  assert.equal(await reviewer.page.getByRole('textbox', { name: 'JSON nội dung chương' }).getAttribute('readonly'), '')
  await reviewer.page.getByRole('navigation').locator('a[href="/internal/reviews"]').click()
  await reviewer.page.getByRole('button', { name: 'Trả về', exact: true }).click()
  assert.equal(await reviewer.page.getByRole('dialog').getByRole('button', { name: 'Trả về', exact: true }).isDisabled(), true)
  await reviewer.page.getByRole('dialog').getByRole('button', { name: 'Huỷ', exact: true }).click()
  await reviewer.page.getByRole('button', { name: 'Đạt', exact: true }).click()
  await reviewer.page.getByRole('button', { name: 'Chấm Đạt', exact: true }).click()
  await reviewer.page.getByText('Không có chương đang chờ duyệt', { exact: true }).waitFor()
  await reviewer.page.getByRole('navigation').locator('a[href="/internal/assets"]').click()
  await reviewer.page.getByText('Nhà An', { exact: true }).waitFor()
  assert.equal(await reviewer.page.getByRole('button', { name: 'Tải ảnh lên' }).count(), 0)
  await reviewer.page.getByRole('navigation').getByRole('link', { name: 'Kho câu hỏi' }).click()
  assert.equal(await reviewer.page.getByRole('button', { name: 'Thêm câu hỏi' }).count(), 0)
  await reviewer.context.close()

  const manager = await session('GAME_MANAGER')
  await manager.page.getByRole('navigation').locator('a[href="/internal/releases"]').click()
  await manager.page.getByRole('button', { name: /^Phát hành bản / }).click()
  await manager.page.getByRole('dialog').getByRole('button', { name: /^Phát hành \d/ }).click()
  await manager.page.getByRole('status').filter({ hasText: 'Đã phát hành bản' }).waitFor()
  assert.equal(releases.find(release => release.version === '1.0.0').current, true)
  await manager.page.getByRole('navigation').locator('a[href="/internal/history"]').click()
  await manager.page.getByRole('button', { name: 'Thu hồi bản này', exact: true }).click()
  await manager.page.getByLabel('Lý do thu hồi').fill('Thu hồi để kiểm tra')
  await manager.page.getByRole('dialog').getByRole('button', { name: /^Thu hồi \d/ }).click()
  await manager.page.getByRole('button', { name: 'Thu hồi bản này', exact: true }).waitFor({ state: 'detached' })
  await manager.page.getByRole('button', { name: 'Dùng bản này' }).click()
  await manager.page.getByRole('dialog').getByRole('button', { name: /^Chuyển sang / }).click()
  await manager.page.getByText('Đang chạy', { exact: true }).waitFor()
  await manager.page.getByRole('navigation').getByRole('link', { name: 'Kho câu hỏi' }).click()
  await manager.page.getByRole('button', { name: 'Thêm câu hỏi' }).click()
  await manager.page.getByLabel('Nội dung câu hỏi').fill('Nên tiết kiệm khi nào?')
  for (let index = 1; index <= 4; index++) await manager.page.getByRole('textbox', { name: `Nội dung lựa chọn ${index}` }).fill(`Lựa chọn ${index}`)
  await manager.page.getByRole('button', { name: 'Lưu câu hỏi' }).click()
  await manager.page.getByRole('cell', { name: /Nên tiết kiệm khi nào\?/ }).waitFor()
  await manager.page.getByRole('button', { name: 'Sửa', exact: true }).click()
  await manager.page.getByLabel('Nội dung câu hỏi').fill('Câu hỏi đã chỉnh sửa')
  await manager.page.getByRole('button', { name: 'Lưu câu hỏi' }).click()
  await manager.page.getByRole('cell', { name: /Câu hỏi đã chỉnh sửa/ }).waitFor()
  await manager.page.getByRole('button', { name: 'Ngừng dùng', exact: true }).click()
  await manager.page.getByRole('dialog').getByRole('button', { name: 'Ngừng dùng', exact: true }).click()
  await manager.page.getByRole('button', { name: 'Khôi phục', exact: true }).click()
  await manager.page.getByRole('button', { name: 'Ngừng dùng', exact: true }).waitFor()
  await manager.page.getByRole('navigation').locator('a[href="/internal/assets"]').click()
  const image = { name: 'test.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV1cAAAAASUVORK5CYII=', 'base64') }
  for (const toast of ['test.png: đã tải lên', 'đã có trong kho']) {
    await manager.page.getByRole('button', { name: 'Tải ảnh lên' }).click()
    await manager.page.getByRole('dialog').locator('input[type=file]').setInputFiles(image)
    await manager.page.getByRole('dialog').getByRole('button', { name: 'Tải ảnh lên' }).click()
    await manager.page.getByRole('status').filter({ hasText: toast }).waitFor()
  }
  await manager.page.getByRole('button', { name: /Nhà An/ }).click()
  await manager.page.getByLabel('Tên ảnh', { exact: true }).fill('Ảnh đã sửa')
  await manager.page.getByRole('button', { name: 'Lưu nhãn' }).click()
  await manager.page.getByRole('button', { name: /Ảnh đã sửa/ }).click()
  await manager.page.getByRole('button', { name: 'Xoá ảnh', exact: true }).click()
  await manager.page.getByRole('button', { name: 'Xoá vĩnh viễn', exact: true }).click()
  await manager.page.getByText('Kho chưa có ảnh nào', { exact: true }).waitFor()
  await manager.context.close()

  const admin = await session('ADMIN')
  await admin.page.getByRole('button', { name: 'Khóa AI', exact: true }).click()
  await admin.page.getByRole('button', { name: 'Thêm khoá', exact: true }).click()
  await admin.page.getByLabel('Tên gợi nhớ').fill('Khóa test')
  await admin.page.getByLabel('Khoá bí mật').fill('not-a-real-api-key')
  await admin.page.getByRole('dialog').getByRole('button', { name: 'Thêm khoá', exact: true }).click()
  await admin.page.getByText('Khóa test', { exact: true }).waitFor()
  await admin.page.getByRole('button', { name: 'Kiểm tra', exact: true }).click()
  await admin.page.getByText(/Thành công/).waitFor()
  await admin.page.getByRole('button', { name: 'Tắt', exact: true }).click()
  await admin.page.getByText('Đã tắt', { exact: true }).waitFor()
  await admin.page.getByRole('button', { name: 'Bật', exact: true }).click()
  await admin.page.getByText('Đang bật', { exact: true }).waitFor()
  await admin.page.getByRole('button', { name: 'Xoá', exact: true }).click()
  await admin.page.getByRole('button', { name: 'Xoá khoá', exact: true }).click()
  await admin.page.getByText('Chưa có khoá AI', { exact: true }).waitFor()
  await admin.page.getByRole('link', { name: 'Content Studio' }).click()
  await admin.page.getByRole('link', { name: 'Mở trình soạn' }).first().waitFor()
  await admin.context.close()
  content = { title: 'Schema v2', scenes: [{ id: 'CHOICE', type: 'choice', options: [{ id: 'A', text: 'Xem tiếp', condition: { type: 'ALWAYS_UNLOCKED' }, lockedReason: '', nextSceneId: 'END' }] }, { id: 'END', type: 'ending' }] }
  draft.status = 'DRAFT'
  const v2 = await session('GAME_EDITOR')
  await v2.page.getByRole('navigation').locator('a[href="/internal/chapters"]').click()
  await v2.page.getByRole('link', { name: 'Mở trình soạn' }).click()
  await v2.page.getByLabel('Lý do khóa lựa chọn 1', { exact: true }).fill('Hãy xem thẻ trước.')
  const newCondition = '{"all":[{"var":"choice:budget"},{"var":"inspected:card-1"}]}'
  await v2.page.getByLabel('Điều kiện lựa chọn 1', { exact: true }).fill('{')
  await v2.page.getByRole('button', { name: 'Lưu nháp', exact: true }).click()
  await v2.page.getByRole('alert').filter({ hasText: 'JSON chưa hợp lệ' }).waitFor()
  await v2.page.getByLabel('Điều kiện lựa chọn 1', { exact: true }).fill(newCondition)
  await v2.page.getByRole('button', { name: 'Lưu nháp', exact: true }).click()
  await v2.page.getByRole('status').filter({ hasText: 'Đã lưu nháp' }).waitFor()
  assert.deepEqual(content.scenes[0].options[0].condition, JSON.parse(newCondition))
  assert.equal(content.scenes[0].options[0].lockedReason, 'Hãy xem thẻ trước.')
  await v2.context.close()
  questions = Array.from({ length: 31 }, (_, index) => ({ id: `bulk-${index}`, externalId: `Q${index + 1}`, pool: 'CEE', stem: `Câu hỏi phân trang ${index + 1}`, options: ['A', 'B'], correctIndex: 0 }))
  assets.push(...Array.from({ length: 25 }, (_, index) => ({ id: `bulk-asset-${index}`, kind: 'IMAGE', ref: `test-${index}`, label: `Ảnh phân trang ${index + 1}`, url: '/images/map/journey-v2/finteen-map-01-home.png', usage: [] })))
  const paged = await session('GAME_MANAGER')
  await paged.page.getByRole('navigation', { name: 'Điều hướng Studio' }).locator('a[href="/internal/questions"]').click()
  const questionList = paged.page.getByRole('region', { name: 'Danh sách câu hỏi' })
  await questionList.getByRole('cell', { name: 'Câu hỏi phân trang 1', exact: false }).first().waitFor()
  assert.equal(await questionList.locator('tbody tr').count(), 20)
  const questionPager = paged.page.getByRole('navigation', { name: 'Phân trang câu hỏi' })
  await questionPager.getByRole('button', { name: 'Trang sau', exact: true }).click()
  await questionList.getByRole('cell', { name: /Câu hỏi phân trang 21/ }).waitFor()
  await questionPager.getByRole('combobox').selectOption('10')
  assert.equal(await questionList.locator('tbody tr').count(), 10)
  assert.equal(await questionPager.getByRole('button', { name: 'Trang 1', exact: true }).getAttribute('aria-current'), 'page')
  assert.ok(Math.abs(await paged.page.locator('.studio-sidebar').evaluate(element => element.getBoundingClientRect().height) - 1000) < 2)
  await paged.page.getByRole('navigation', { name: 'Điều hướng Studio' }).locator('a[href="/internal/assets"]').click()
  const assetList = paged.page.getByRole('region', { name: 'Danh sách ảnh' })
  await assetList.getByRole('button', { name: /Ảnh phân trang 1/ }).first().waitFor()
  assert.equal(await assetList.getByRole('button').count(), 24)
  const assetPager = paged.page.getByRole('navigation', { name: 'Phân trang ảnh' })
  await assetPager.getByRole('button', { name: 'Trang sau', exact: true }).click()
  await assetList.getByRole('button', { name: /Ảnh phân trang 25/ }).waitFor()
  assert.equal(await assetList.getByRole('button').count(), 1)
  if (process.env.STUDIO_SCREENSHOT_DIR) await paged.page.screenshot({ path: `${process.env.STUDIO_SCREENSHOT_DIR}/assets-pagination.png`, fullPage: true })
  await paged.context.close()
  assert.deepEqual(errors, [])
  assert.ok(writes.some(write => write.path.endsWith('/draft') && write.method === 'PUT'))
  assert.ok(writes.some(write => write.path.endsWith('/review')))
  assert.ok(writes.some(write => write.path.endsWith('/releases') && write.method === 'POST'))
  console.log('PASS: Editor save/submit; Reviewer read-only/review; Manager publish/recall/current, questions CRUD, multipart/duplicate/asset metadata/delete; Admin AI-key lifecycle and Studio entry; no browser errors.')
} finally {
  await browser.close()
  await server.close()
}
