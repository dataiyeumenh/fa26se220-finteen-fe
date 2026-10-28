import test from 'node:test'
import assert from 'node:assert/strict'
import { getStudioMenu } from '../src/features/studio/portalMenu.js'

const menu = (...roles) => getStudioMenu({ roles })
const paths = roles => menu(...roles).map(item => item.path.split('/').at(-1))

test('single-role menus follow the lead matrix', () => {
  assert.deepEqual(paths(['GAME_EDITOR']), ['chapters', 'assets', 'questions'])
  assert.deepEqual(paths(['GAME_REVIEWER']), ['reviews', 'chapters', 'history', 'assets', 'questions'])
  assert.deepEqual(paths(['GAME_MANAGER']), ['releases', 'history', 'chapters', 'assets', 'questions'])
  assert.equal(menu('GAME_REVIEWER').find(item => item.icon === 'asset').readOnly, true)
  assert.equal(menu('GAME_MANAGER').find(item => item.icon === 'asset').readOnly, false)
  assert.deepEqual(menu('PARENT'), [])
})

test('multiple roles get the union without duplicate routes; ADMIN gets all Studio menus', () => {
  const combined = paths(['GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER'])
  assert.deepEqual(combined, ['reviews', 'chapters', 'releases', 'history', 'assets', 'questions'])
  assert.equal(new Set(combined).size, combined.length)
  assert.deepEqual(paths(['ADMIN']), combined)
  assert.deepEqual(paths(['GAME_EDITOR', 'GAME_REVIEWER']), ['reviews', 'chapters', 'history', 'assets', 'questions'])
  assert.equal(menu('GAME_EDITOR', 'GAME_REVIEWER').find(item => item.icon === 'chapter').title, 'Chương')
  assert.equal(menu('GAME_EDITOR', 'GAME_REVIEWER').find(item => item.icon === 'chapter').readOnly, false)
})

test('reviewer reference pages show view access separately from their titles', () => {
  const items = menu('GAME_REVIEWER')
  assert.deepEqual(items.filter(item => item.readOnly).map(item => item.icon), ['chapter', 'history', 'asset', 'question'])
  assert.ok(items.every(item => !item.title.includes('(xem)')))
  assert.ok(!items.find(item => item.icon === 'review').readOnly)
})
