import test from 'node:test'
import assert from 'node:assert/strict'
import { createAuthClient } from '../src/api/auth.client.js'

function fixture() {
  const saved = new Map()
  const calls = []
  const queue = []
  let now = 0
  const auth = createAuthClient({
    baseUrl: 'https://example.com/finteen',
    now: () => now,
    storage: { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) },
    fetcher: async (url, init) => {
      calls.push({ url, ...init })
      assert.ok(queue.length, 'Unexpected API request')
      const next = queue.shift()
      return { ok: next.status === 200, status: next.status, json: async () => next.body }
    },
  })
  const ok = result => queue.push({ status: 200, body: { code: 0, result } })
  const login = async () => {
    ok({ accessToken: 'internal-token', expiresIn: 28800 })
    ok({ id: 'staff', roles: ['ADMIN'], plans: [], email: 'staff@example.com' })
    await auth.internalLogin(' staff@example.com ', 'secret-password')
    assert.ok(calls[0].url.endsWith('/api/auth/internal/login'))
  }
  return { auth, calls, queue, ok, login, expire: () => { now = 28800 * 1000 + 1 } }
}

test('all Studio and AI endpoints use the shared ACCOUNT bearer and preserve server results', async () => {
  const context = fixture()
  const { auth, calls, ok } = context
  await context.login()
  const operations = [
    ['GET', '/api/studio/chapters'],
    ['GET', '/api/studio/chapters/CH04/draft'],
    ['PUT', '/api/studio/chapters/CH04/draft', { title: 'Nội dung', scenes: [{ id: 'scene', type: 'ending' }], unknownField: { keep: true } }],
    ['POST', '/api/studio/chapters/CH04/submit', { changeClass: 'MINOR', note: 'Updated' }],
    ['POST', '/api/studio/chapters/CH04/withdraw'],
    ['POST', '/api/studio/chapters/CH04/review', { pass: false, changeClass: 'MINOR', note: 'Cần chỉnh sửa' }],
    ['GET', '/api/studio/scene-schema'],
    ['GET', '/api/studio/releases'],
    ['GET', '/api/studio/releases/next'],
    ['POST', '/api/studio/releases', { note: 'New release' }],
    ['POST', '/api/studio/releases/1.0.0/current'],
    ['POST', '/api/studio/releases/1.0.0/recall', { reason: 'Lỗi nội dung' }],
    ['GET', '/api/studio/assets?kind=IMAGE&chapter=CH04&status=ORPHAN&q=An'],
    ['GET', '/api/studio/assets/asset-id'],
    ['PUT', '/api/studio/assets/asset-id', { label: 'Nhà An', chapterCode: 'CH04' }],
    ['DELETE', '/api/studio/assets/asset-id'],
    ['GET', '/api/studio/questions?chapter=4&includeRetired=true'],
    ['POST', '/api/studio/questions', { stem: 'Câu hỏi', options: ['A', 'B'], correctIndex: 1, replacesId: null }],
    ['PUT', '/api/studio/questions/question-id', { stem: 'Đã sửa', options: ['A', 'B'], correctIndex: 0 }],
    ['POST', '/api/studio/questions/question-id/retire'],
    ['POST', '/api/studio/questions/question-id/restore'],
    ['GET', '/api/admin/ai-keys'],
    ['POST', '/api/admin/ai-keys', { provider: 'GEMINI', alias: 'Test', key: 'test-only-key', priority: 1 }],
    ['POST', '/api/admin/ai-keys/key-id/test'],
    ['POST', '/api/admin/ai-keys/key-id/enable'],
    ['POST', '/api/admin/ai-keys/key-id/disable'],
    ['DELETE', '/api/admin/ai-keys/key-id'],
  ]
  for (const [method, path, body] of operations) {
    const result = { path, fromServer: true }
    ok(result)
    assert.deepEqual(await auth.studioRequest(path, { method, body }), result)
    const request = calls.at(-1)
    assert.equal(request.url, `https://example.com/finteen${path}`)
    assert.equal(request.method, method)
    assert.equal(request.headers.Authorization, 'Bearer internal-token')
    if (body === undefined) {
      assert.equal(request.body, undefined)
      assert.equal(request.headers['Content-Type'], undefined)
    } else {
      assert.deepEqual(JSON.parse(request.body), body)
      assert.equal(request.headers['Content-Type'], 'application/json')
    }
  }
})

test('Studio errors retain HTTP/code and expired/logout sessions never send a request', async () => {
  const context = fixture()
  await context.login()
  context.queue.push({ status: 403, body: { code: 6002, message: 'Không tự duyệt' } })
  await assert.rejects(context.auth.studioRequest('/api/studio/chapters/CH04/review', { method: 'POST', body: { pass: true } }), error => error.status === 403 && error.code === 6002 && error.message === 'Không tự duyệt')
  assert.equal(context.auth.hasSession(), true)
  context.expire()
  const count = context.calls.length
  await assert.rejects(context.auth.studioRequest('/api/studio/chapters'), error => error.status === 401)
  assert.equal(context.calls.length, count)
  assert.equal(context.auth.hasSession(), false)
  assert.throws(() => context.auth.studioRequest('https://outside.example/api'), /không hợp lệ/)
})

test('draft save returns warnings without failure; submit preserves the exact path validation message', async () => {
  const context = fixture()
  await context.login()
  const message = 'đường đi: CH04_SC02 không tới được; lựa chọn CH04_A thiếu "đi tiếp tới đâu".\nKhông có đường tới Kết.'
  context.ok({ code: 'CH04', title: 'Nháp', warnings: [message] })
  const saved = await context.auth.studioRequest('/api/studio/chapters/CH04/draft', { method: 'PUT', body: { scenes: [] } })
  assert.deepEqual(saved.warnings, [message])
  context.queue.push({ status: 400, body: { code: 1001, message } })
  await assert.rejects(context.auth.studioRequest('/api/studio/chapters/CH04/submit', { method: 'POST', body: { changeClass: 'PATCH' } }), error => error.status === 400 && error.code === 1001 && error.message === message)
  assert.equal(context.auth.hasSession(), true)
})
