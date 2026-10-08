import test from 'node:test'
import assert from 'node:assert/strict'
import { createAuthClient } from '../src/api/auth.client.js'

const me = { id: 'a', displayName: 'Test', email: 'test@example.com', plans: ['TEACHER'], roles: ['ADMIN'] }
const token = { accessToken: 'account-token', expiresIn: 60, refreshToken: null }
function setup() {
  const data = new Map(), calls = [], queue = []
  let time = 1000
  const storage = { getItem: k => data.get(k), setItem: (k, v) => data.set(k, v) }
  const options = { baseUrl: 'https://example.com/finteen', storage, now: () => time, fetcher: async (url, init) => {
    calls.push({ url, ...init })
    const reply = queue.shift()
    if (reply instanceof Error) throw reply
    assert.ok(reply, 'Unexpected request')
    return { ok: reply.code === 0, status: reply.code === 0 ? 200 : 401, json: async () => reply }
  } }
  return { auth: createAuthClient(options), options, calls, queue, advance: n => { time += n } }
}
test('registration has no session; resend uses encoded query and no body; forgot is public JSON', async () => {
  const { auth, calls, queue } = setup()
  queue.push({ code: 0, result: me }, { code: 0 }, { code: 0 })
  await auth.register({ email: ' test@example.com ', password: 'password', displayName: ' Test ' })
  assert.equal(auth.hasSession(), false)
  assert.deepEqual(JSON.parse(calls[0].body), { email: 'test@example.com', password: 'password', displayName: 'Test' })
  await auth.resend('a+b@example.com')
  assert.match(calls[1].url, /verify\/resend\?email=a%2Bb%40example.com$/)
  assert.equal(calls[1].method, 'POST'); assert.equal(calls[1].body, undefined)
  await auth.forgot('test@example.com')
  assert.equal(calls[2].headers.Authorization, undefined)
  assert.deepEqual(JSON.parse(calls[2].body), { email: 'test@example.com' })
})
test('OTP verification exchanges a six-digit string for a session and fetches Guest profile', async () => {
  const { auth, calls, queue } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: { ...me, plans: [] } })
  await auth.verify(' test@example.com ', '012345')
  assert.ok(calls[0].url.endsWith('/api/auth/verify'))
  assert.equal(calls[0].method, 'POST')
  assert.deepEqual(JSON.parse(calls[0].body), { email: 'test@example.com', otp: '012345' })
  assert.equal(calls[0].headers.Authorization, undefined)
  assert.equal(calls[1].headers.Authorization, 'Bearer account-token')
  assert.equal(auth.getSnapshot().actor.role, 'guest')
})

test('OTP errors propagate without creating a session', async () => {
  for (const code of [3012, 3013, 3014]) {
    const { auth, queue } = setup()
    queue.push({ code, message: 'OTP error' })
    await assert.rejects(auth.verify('test@example.com', '012345'), e => e.code === code)
    assert.equal(auth.hasSession(), false)
  }
})

test('password reset sends email/otp/newPassword and does not auto-login', async () => {
  const { auth, calls, queue } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: me }, { code: 0 })
  await auth.login('test@example.com', 'old-password')
  await auth.resetPassword('test@example.com', '012345', 'new-password')
  assert.ok(calls.at(-1).url.endsWith('/api/auth/password/reset'))
  assert.deepEqual(JSON.parse(calls.at(-1).body), { email: 'test@example.com', otp: '012345', newPassword: 'new-password' })
  assert.equal(calls.at(-1).headers.Authorization, undefined)
  assert.equal(auth.hasSession(), false)
  for (const code of [3017, 3018]) {
    queue.push({ code, message: 'Reset error' })
    await assert.rejects(auth.resetPassword('test@example.com', '012345', 'new-password'), e => e.code === code)
  }
})

test('registration sends a trimmed optional phone and omits blank phone', async () => {
  const { auth, calls, queue } = setup()
  queue.push({ code: 0, result: me }, { code: 0, result: me })
  await auth.register({ email: 'test@example.com', password: 'password', displayName: 'Test', phone: ' 0901234567 ' })
  assert.equal(JSON.parse(calls[0].body).phone, '0901234567')
  await auth.register({ email: 'test@example.com', password: 'password', displayName: 'Test', phone: '   ' })
  assert.equal(Object.hasOwn(JSON.parse(calls[1].body), 'phone'), false)
})

test('login fetches me using ACCOUNT token, maps fresh plans, persists and restores with me', async () => {
  const { auth, queue, calls, options } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: me })
  await auth.login('test@example.com', 'password')
  assert.equal(calls[0].headers.Authorization, undefined)
  assert.equal(calls[1].headers.Authorization, 'Bearer account-token')
  assert.equal(auth.getSnapshot().actor.role, 'teacher')
  assert.deepEqual(auth.getSnapshot().actor.roles, ['ADMIN'])
  const restored = createAuthClient(options)
  assert.equal(restored.getSnapshot().actor, null)
  assert.equal(restored.getSnapshot().loading, true)
  queue.push({ code: 0, result: { ...me, plans: [] } })
  await restored.refresh()
  assert.equal(restored.getSnapshot().actor.role, 'guest')
})
test('dual-plan context is selectable only from server plans', async () => {
  const { auth, queue } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: { ...me, plans: ['PARENT', 'TEACHER'] } })
  await auth.login('test@example.com', 'password')
  assert.equal(auth.getSnapshot().actor.role, 'parent')
  auth.setContext('teacher')
  assert.equal(auth.getSnapshot().actor.role, 'teacher')
  assert.throws(() => auth.setContext('admin'), error => error.code === 3004)
})
test('wrong old password does not logout; change password immediately replaces bearer; 3003 clears it', async () => {
  const { auth, calls, queue } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: me })
  await auth.login('test@example.com', 'password')
  queue.push({ code: 3002, message: 'Wrong password' })
  await assert.rejects(auth.changePassword('bad', 'new-password'), e => e.code === 3002)
  assert.ok(auth.getSnapshot().actor)
  queue.push({ code: 0, result: { ...token, accessToken: 'new-token' } }, { code: 0, result: me })
  await auth.changePassword('old', 'new-password')
  assert.equal(calls.at(-1).headers.Authorization, 'Bearer new-token')
  queue.push({ code: 3003, message: 'Expired' })
  await assert.rejects(auth.refresh(), e => e.code === 3003)
  assert.equal(auth.hasSession(), false); assert.equal(auth.getSnapshot().actor, null)
})
test('expiresIn is seconds and expired token is not sent', async () => {
  const { auth, queue, calls, advance } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: me })
  await auth.login('test@example.com', 'password')
  advance(60001)
  await assert.rejects(auth.linkGoogle('firebase-id-token'), e => e.code === 3003)
  assert.equal(calls.length, 2); assert.equal(auth.hasSession(), false)
})
test('Google exchange/link payload and conflict codes preserve session', async () => {
  const { auth, queue, calls } = setup()
  queue.push({ code: 3020, message: 'Use password' })
  await assert.rejects(auth.googleLogin('firebase-token'), e => e.code === 3020)
  assert.equal(auth.hasSession(), false)
  queue.push({ code: 0, result: token }, { code: 0, result: me }, { code: 3021, message: 'Other account' }, { code: 0 })
  await auth.googleLogin('firebase-token')
  assert.deepEqual(JSON.parse(calls[1].body), { idToken: 'firebase-token', provider: 'GOOGLE' })
  await assert.rejects(auth.linkGoogle('another'), e => e.code === 3021)
  await auth.linkGoogle('same')
  assert.equal(calls.at(-1).headers.Authorization, 'Bearer account-token')
  assert.ok(auth.getSnapshot().actor)
})

test('admin API methods use the account token and documented payloads', async () => {
  const { auth, queue, calls } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: me })
  await auth.login('admin@example.com', 'password')
  queue.push(
    { code: 0, result: [] },
    { code: 0, result: { kind: 'PARENT', price: 99000, months: 3 } },
    { code: 0, result: [] },
    { code: 0, result: { orderCode: 123, status: 'PAID' } },
    { code: 0, result: {} },
  )
  await auth.listPlans()
  await auth.setPlanPrice('PARENT', 99000, 3)
  await auth.listAdminTransactions({ status: 'PENDING', page: 1, size: 20 })
  await auth.reconcileTransaction(123)
  await auth.grantEntitlement({ accountId: '00000000-0000-0000-0000-000000000001', kind: 'TEACHER', months: 6, reason: ' Demo ' })
  assert.equal(calls[2].headers.Authorization, undefined)
  assert.equal(calls[3].method, 'PUT')
  assert.deepEqual(JSON.parse(calls[3].body), { price: 99000, months: 3 })
  assert.match(calls[4].url, /status=PENDING/)
  assert.equal(calls[5].method, 'POST')
  assert.deepEqual(JSON.parse(calls[6].body), { accountId: '00000000-0000-0000-0000-000000000001', kind: 'TEACHER', months: 6, reason: 'Demo' })
  for (const call of calls.slice(3)) assert.equal(call.headers.Authorization, 'Bearer account-token')
})
test('payment API creates a VietQR order, lists, checks and cancels it', async () => {
  const { auth, queue, calls } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: { ...me, plans: [] } })
  await auth.login('user1@finteen.com', 'password')
  queue.push(
    { code: 0, message: 'OK', result: { orderCode: 1791234567890123, qrCode: '000201010212385700...', bin: '970422', accountNumber: '123456', accountName: 'FINTEEN', amount: 2000, description: 'FinTeen goi phu huynh', expiresAt: '2026-10-09T01:44:02Z' } },
    { code: 0, message: 'OK', result: [{ orderCode: 1791234567890123, status: 'PENDING' }] },
    { code: 0, message: 'OK', result: { orderCode: 1791234567890123, status: 'PENDING', amount: 2000, paidAt: null } },
    { code: 0, message: 'OK' },
  )
  const created = await auth.createPayment('PARENT')
  const history = await auth.listPayments({ page: 0, size: 20 })
  const checked = await auth.getPayment(created.orderCode)
  const cancelled = await auth.cancelPayment(created.orderCode, 'Người dùng hủy')
  assert.equal(created.qrCode, '000201010212385700...')
  assert.equal(history[0].status, 'PENDING')
  assert.equal(checked.status, 'PENDING')
  assert.equal(cancelled, undefined)
  assert.deepEqual(JSON.parse(calls[2].body), { kind: 'PARENT' })
  assert.match(calls[3].url, /\/api\/payments\?page=0&size=20$/)
  assert.match(calls[4].url, /\/api\/payments\/1791234567890123$/)
  assert.match(calls[5].url, /\/cancel\?reason=Ng%C6%B0%E1%BB%9Di%20d%C3%B9ng%20h%E1%BB%A7y$/)
  assert.equal(calls[5].method, 'POST')
  for (const call of calls.slice(2)) assert.equal(call.headers.Authorization, 'Bearer account-token')
})
test('group and slot management APIs use documented methods and payloads', async () => {
  const { auth, queue, calls } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: { ...me, plans: ['PARENT'] } })
  await auth.login('parent@example.com', 'password')
  queue.push(...Array.from({ length: 11 }, () => ({ code: 0, result: [] })))
  await auth.listGroups()
  await auth.openGroup(' Nhà mình ', 'FAMILY')
  await auth.confirmConsent('group-1')
  await auth.closeGroup('group-1')
  await auth.listGroupSlots('group-1')
  await auth.groupCapacity('group-1')
  await auth.openSlot({ groupId: 'group-1', displayName: ' Bé An ', pin: '012345' })
  await auth.openSlots('group-1', [{ displayName: ' Bé Bình ', pin: '123456' }])
  await auth.returnSlot('slot-1')
  await auth.wipeSlot('slot-1')
  await auth.changeSlotPin('slot-1', '654321')
  assert.deepEqual(JSON.parse(calls[3].body), { name: 'Nhà mình', context: 'FAMILY' })
  assert.equal(calls[4].method, 'POST'); assert.match(calls[4].url, /\/groups\/group-1\/consent$/)
  assert.equal(calls[5].method, 'POST'); assert.match(calls[5].url, /\/groups\/group-1\/close$/)
  assert.deepEqual(JSON.parse(calls[8].body), { groupId: 'group-1', displayName: 'Bé An', pin: '012345' })
  assert.deepEqual(JSON.parse(calls[9].body), { slots: [{ groupId: 'group-1', displayName: 'Bé Bình', pin: '123456' }] })
  assert.equal(calls[11].method, 'DELETE')
  assert.deepEqual(JSON.parse(calls[12].body), { pin: '654321' })
})

test('SLOT login normalizes code, keeps a separate session and restores the kid actor', async () => {
  const { auth, queue, calls, options } = setup()
  queue.push({ code: 0, result: token }, { code: 0, result: me })
  await auth.login('teacher@example.com', 'password')
  queue.push({ code: 0, result: { accessToken: 'slot-token', refreshToken: null, expiresIn: 28800, slot: { id: 'slot-1', displayName: 'Bé An', badge: null, groupContext: 'FAMILY' } } })
  await auth.slotLogin(' k7mpq2xa ', '012345')
  assert.deepEqual(JSON.parse(calls.at(-1).body), { code: 'K7MPQ2XA', pin: '012345' })
  assert.equal(calls.at(-1).headers.Authorization, undefined)
  assert.equal(auth.getSnapshot().actor.role, 'kid')
  assert.equal(auth.getSnapshot().actor.name, 'Bé An')
  assert.equal(auth.getSnapshot().actor.learnerRole, 'child')
  assert.equal(auth.getSnapshot().actor.plan, 'parent')
  const restored = createAuthClient(options)
  assert.equal(restored.getSnapshot().actor.role, 'kid')
  assert.equal(restored.getSnapshot().actor.name, 'Bé An')
  assert.equal(restored.hasSession(), true)
  queue.push({ code: 0, result: { accessToken: 'class-slot-token', refreshToken: null, expiresIn: 28800, slot: { id: 'slot-2', displayName: 'Bạn Bình', badge: 'blue', groupContext: 'CLASS' } } })
  await restored.slotLogin('pwq3whsu', '654321')
  assert.equal(restored.getSnapshot().actor.name, 'Bạn Bình')
  assert.equal(restored.getSnapshot().actor.learnerRole, 'student')
  assert.equal(restored.getSnapshot().actor.plan, 'teacher')
})
test('network failures are retryable, not a silent success or fake demo login', async () => {
  const { auth, queue } = setup()
  queue.push({ code: 0, result: token }, new Error('Offline'))
  await assert.rejects(auth.login('test@example.com', 'password'), /Không kết nối/)
  assert.equal(auth.getSnapshot().actor, null)
  queue.push({ code: 0, result: me })
  await auth.refresh()
  assert.ok(auth.getSnapshot().actor)
  auth.logout(); assert.equal(auth.hasSession(), false)
})

test('logout wins over an in-flight login response', async () => {
  let resolve
  const auth = createAuthClient({ baseUrl: 'https://example.com', storage: { getItem() {}, setItem() {} }, fetcher: () => new Promise(r => { resolve = r }) })
  const pending = auth.login('test@example.com', 'password')
  auth.logout()
  resolve({ ok: true, status: 200, json: async () => ({ code: 0, result: token }) })
  await pending
  assert.equal(auth.hasSession(), false)
  assert.equal(auth.getSnapshot().actor, null)
})
