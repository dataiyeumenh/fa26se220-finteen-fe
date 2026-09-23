import test from 'node:test'
import assert from 'node:assert/strict'
class MemoryStorage {
  data = new Map()
  getItem(key) { return this.data.get(key) ?? null }
  setItem(key, value) { this.data.set(key, String(value)) }
}
globalThis.localStorage = new MemoryStorage()
globalThis.sessionStorage = new MemoryStorage()
const events = new Map()
globalThis.window = { addEventListener: (type, fn) => events.set(type, fn) }
const { register, login, logout, saveLearner, dispatch, getSnapshot } = await import('../src/features/workspace/demoStore.js')
const { resolveSession, applyAction } = await import('../src/features/workspace/model.js')
test('browser demo lifecycle: credentials are hashed; old PIN/code rejected; refresh and cross-tab revocation work', async () => {
  await register({ name: 'Parent', email: 'P@EXAMPLE.COM', password: 'parent-pass-123' })
  assert.equal(resolveSession(getSnapshot().db, getSnapshot().session).role, 'guest')
  assert.equal(localStorage.getItem('finteen.workspace.demo.v1').includes('parent-pass-123'), false)
  await assert.rejects(register({ name: 'P', email: 'p@example.com', password: 'new-pass-123' }))
  dispatch('ACTIVATE_DEMO_PLAN', { plan: 'parent' })
  const slotId = getSnapshot().db.slots[0].id
  await assert.rejects(saveLearner({ slotId, name: 'Child', pin: 'abcd' }))
  await saveLearner({ slotId, name: 'Child', pin: '9876' })
  const child = getSnapshot().db.learners[0]
  const ownerSession = getSnapshot().session
  logout()
  await assert.rejects(login({ kind: 'learner', identifier: child.code, secret: '0000' }))
  await login({ kind: 'learner', identifier: ` ${child.code.toLowerCase()} `, secret: '9876' })
  assert.equal(resolveSession(getSnapshot().db, getSnapshot().session).name, 'Child')
  assert.equal(JSON.parse(sessionStorage.getItem('finteen.workspace.session.v1')).id, child.id)
  logout()
  await login({ kind: 'adult', identifier: 'p@example.com', secret: 'parent-pass-123' })
  await saveLearner({ learnerId: child.id, pin: '123456' })
  logout()
  await assert.rejects(login({ kind: 'learner', identifier: child.code, secret: '9876' }))
  await login({ kind: 'learner', identifier: child.code, secret: '123456' })
  const updated = applyAction(getSnapshot().db, ownerSession, { type: 'REVOKE_LEARNER', payload: { learnerId: child.id } })
  localStorage.setItem('finteen.workspace.demo.v1', JSON.stringify(updated))
  events.get('storage')({ key: 'finteen.workspace.demo.v1' })
  assert.equal(resolveSession(getSnapshot().db, getSnapshot().session), null)
  await assert.rejects(login({ kind: 'learner', identifier: child.code, secret: '123456' }))
})
