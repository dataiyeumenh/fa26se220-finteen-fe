import test from 'node:test'
import assert from 'node:assert/strict'
import { completeLogin } from '../src/features/auth/loginPolicy.js'

function clientFor(actor, error = '') {
  let snapshot = { actor, error }
  return {
    getSnapshot: () => snapshot,
    logout: () => { snapshot = { actor: null, error: '' } },
  }
}

test('all internal roles require internal login, including accounts with user plans', () => {
  for (const role of ['ADMIN', 'GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER']) {
    const actor = { roles: [role], plans: ['PARENT'], role: 'parent' }
    const allowed = clientFor(actor)
    assert.equal(completeLogin(allowed, true), '/internal')
    assert.equal(allowed.getSnapshot().actor, actor)
    const denied = clientFor(actor)
    assert.throws(() => completeLogin(denied, false), /\/internal\/login/)
    assert.equal(denied.getSnapshot().actor, null)
  }
})

test('normal users and children require public login; wrong portal clears session', () => {
  for (const role of ['guest', 'parent', 'teacher', 'kid']) {
    const actor = { role, roles: role === 'kid' ? ['CHILD'] : [] }
    const allowed = clientFor(actor)
    assert.equal(completeLogin(allowed, false), role === 'kid' ? '/dashboard/kid' : '/dashboard')
    assert.equal(allowed.getSnapshot().actor, actor)
    const denied = clientFor(actor)
    assert.throws(() => completeLogin(denied, true), /tài khoản người dùng tại \/login/)
    assert.equal(denied.getSnapshot().actor, null)
  }
})

test('profile load failure clears session and never navigates', () => {
  const client = clientFor(null, 'Profile unavailable')
  assert.throws(() => completeLogin(client, true), /Profile unavailable/)
  assert.equal(client.getSnapshot().actor, null)
})
