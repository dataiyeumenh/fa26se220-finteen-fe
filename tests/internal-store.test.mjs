import test from 'node:test'
import assert from 'node:assert/strict'
class MemoryStorage { data = new Map(); getItem(k) { return this.data.get(k) ?? null } setItem(k, v) { this.data.set(k, String(v)) } }
globalThis.localStorage = new MemoryStorage()
globalThis.sessionStorage = new MemoryStorage()
const events = new Map()
globalThis.window = { addEventListener: (type, fn) => events.set(type, fn) }
const store = await import('../src/features/internal/store.js')
const { staffSession, applyInternal } = await import('../src/features/internal/model.js')

test('internal login seeds once, resolves role from account and rejects locked or stale sessions', async () => {
  await store.initializeInternal()
  assert.equal(store.getInternalSnapshot().db.staff.length, 4)
  assert.equal(store.getInternalSnapshot().db.chapters[0].publishedVersion, null)
  assert.equal(localStorage.getItem(store.INTERNAL_DB_KEY).includes(store.DEMO_PASSWORD), false)
  await assert.rejects(store.loginInternal({ email: 'manager@finteen.demo', password: 'wrong' }))
  await store.loginInternal({ email: ' MANAGER@FINTEEN.DEMO ', password: store.DEMO_PASSWORD })
  assert.equal(staffSession(store.getInternalSnapshot().db, store.getInternalSnapshot().session).role, 'manager')
  const managerSession = store.getInternalSnapshot().session
  await store.createStaff({ name: 'New editor', email: 'new@finteen.demo', role: 'editor', password: 'new-test-pass' })
  store.logoutInternal()
  await store.loginInternal({ email: 'new@finteen.demo', password: 'new-test-pass' })
  const snapshot = store.getInternalSnapshot()
  const saved = JSON.parse(sessionStorage.getItem(store.INTERNAL_SESSION_KEY))
  assert.equal(staffSession(snapshot.db, saved).role, 'editor')
  const locked = applyInternal(snapshot.db, managerSession, 'UPDATE_STAFF', { id: saved.id, role: 'editor', active: false })
  localStorage.setItem(store.INTERNAL_DB_KEY, JSON.stringify(locked))
  events.get('storage')({ key: store.INTERNAL_DB_KEY })
  assert.equal(staffSession(store.getInternalSnapshot().db, saved), null)
  assert.throws(() => store.dispatchInternal('SAVE_DRAFT', {}))
  await assert.rejects(store.loginInternal({ email: 'new@finteen.demo', password: 'new-test-pass' }))
  await store.initializeInternal()
  assert.equal(store.getInternalSnapshot().db.staff.length, 5)
  assert.equal(store.getInternalSnapshot().db.staff.find(s => s.id === saved.id).active, false)
})
