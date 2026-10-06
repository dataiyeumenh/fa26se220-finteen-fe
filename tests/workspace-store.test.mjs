import test from 'node:test'
import assert from 'node:assert/strict'
import { getSnapshot, dispatch, saveLearner } from '../src/features/workspace/pendingBackend.js'

test('unconnected workspace cannot authenticate, seed data or pretend mutations succeeded', () => {
  assert.equal(getSnapshot().session, null)
  assert.deepEqual(getSnapshot().db.accounts, [])
  assert.throws(() => dispatch('ACTIVATE_DEMO_PLAN', { plan: 'teacher' }), /chưa kết nối API/)
  assert.throws(() => saveLearner({ name: 'Test' }), /chưa kết nối API/)
})
