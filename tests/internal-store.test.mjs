import test from 'node:test'
import assert from 'node:assert/strict'
import * as store from '../src/features/internal/store.js'

test('internal backend has no demo accounts, local authentication or successful fake writes', () => {
  assert.equal(store.loginInternal, undefined)
  assert.equal(store.initializeInternal, undefined)
  assert.equal(store.DEMO_PASSWORD, undefined)
  assert.equal(store.getInternalSnapshot().session, null)
  assert.deepEqual(store.getInternalSnapshot().db.staff, [])
  assert.deepEqual(store.getInternalSnapshot().db.chapters, [])
  assert.throws(() => store.createStaff({}), /chưa có API/)
  assert.throws(() => store.dispatchInternal('PUBLISH', {}), /chưa có API/)
})
