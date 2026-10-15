import test from 'node:test'
import assert from 'node:assert/strict'
import { flexibleReserveLock, advanceFallingItems, recordMiniGameResult, summarizeMiniGames } from '../src/pages/User/Dashboard/components/game/miniGameRules.js'

test('repair reserve choice uses the actual envelope allocation and allows exactly 200,000', () => {
  const option = { id: 'CH02_SC04_CHOICE_A' }
  for (const value of [0, 100000, 199999]) assert.ok(flexibleReserveLock(option, { emergency_buffer: value }))
  for (const value of [200000, 400000]) assert.equal(flexibleReserveLock(option, { emergency_buffer: value }), null)
  assert.ok(flexibleReserveLock(option, {}))
  assert.equal(flexibleReserveLock({ id: 'CH02_SC04_CHOICE_B' }, {}), null)
  assert.ok(flexibleReserveLock({ flag: 'risk_handled_buffer' }, { emergency_buffer: 100000 }))
})

const settings = { dt: 0.05, basket: 0.5, width: 800, saved: 0, targetAmount: 6000000 }
test('success or failed results do not contribute to the chapter score', () => {
  for (const outcome of ['success', 'failed']) {
    const results = recordMiniGameResult({ budget: { score: 4, total: 6 } }, { sceneId: 'savings', gameId: 'SAVINGS_RACE_CH02' }, { outcome })
    assert.equal(results.savings.outcome, outcome)
    assert.equal(results.savings.passed, outcome === 'success')
    assert.equal(results.savings.completed, true)
    assert.equal(results.savings.score, undefined)
    assert.deepEqual(summarizeMiniGames(results), { score: 4, total: 6, percent: 67 })
    assert.deepEqual(summarizeMiniGames({ savings: results.savings }), { score: 0, total: 0, percent: null })
  }
})
test('results retain separate mini-game scores and replay replaces rather than adds points', () => {
  const first = recordMiniGameResult({}, { chapterId: 'CH02', sceneId: 'budget', gameId: 'budget' }, { score: 4, total: 6, passed: false, allocations: { emergency_buffer: 200000 } })
  const both = recordMiniGameResult(first, { chapterId: 'CH02', sceneId: 'savings', gameId: 'savings' }, { score: 8, total: 10, saved: 1000000 })
  assert.deepEqual(summarizeMiniGames(both), { score: 12, total: 16, percent: 75 })
  assert.equal(both.budget.completed, true)
  assert.equal(both.budget.correctCount, 4)
  assert.equal(both.budget.passed, false)
  assert.equal(both.savings.saved, 1000000)
  const replay = recordMiniGameResult(both, { sceneId: 'budget' }, { score: 6, total: 6 })
  assert.deepEqual(summarizeMiniGames(replay), { score: 14, total: 16, percent: 88 })
  assert.deepEqual(summarizeMiniGames({}), { score: 0, total: 0, percent: null })
})

test('catching coins and avoiding expenses are correct; catching expenses and missing coins are wrong', () => {
  const result = advanceFallingItems([
    { id: 'coin-caught', x: 0.5, y: 0.81, value: 100000 },
    { id: 'expense-caught', x: 0.5, y: 0.81, value: -100000 },
    { id: 'expense-avoided', x: 0.1, y: 0.99, value: -100000 },
    { id: 'coin-missed', x: 0.1, y: 0.99, value: 100000 },
  ], settings)
  assert.deepEqual(result.decisions.map(item => item.correct), [true, false, true, false])
})
test('multiple falling items are independently caught, missed or kept in flight', () => {
  const result = advanceFallingItems([
    { id: 'coin', x: 0.5, y: 0.81, value: 500000 },
    { id: 'expense', x: 0.5, y: 0.81, value: -200000 },
    { id: 'falling', x: 0.8, y: 0.4, value: 100000 },
  ], settings)
  assert.equal(result.saved, 300000)
  assert.equal(result.catches.length, 2)
  assert.deepEqual(result.items.map(item => item.id), ['falling'])
  assert.ok(result.items[0].y > 0.4)
  const missed = advanceFallingItems([{ x: 0.1, y: 0.99, value: -200000 }], settings)
  assert.equal(missed.saved, 0)
  assert.equal(missed.items.length, 0)
})

test('expenses never make savings negative and each caught item is applied once', () => {
  const result = advanceFallingItems([{ x: 0.5, y: 0.81, value: -200000 }], { ...settings, saved: 50000 })
  assert.equal(result.saved, 0)
  assert.equal(result.catches[0].delta, -50000)
  assert.equal(advanceFallingItems(result.items, { ...settings, saved: result.saved }).catches.length, 0)
})

test('reaching the target completes immediately even with other items still falling', () => {
  const result = advanceFallingItems([
    { x: 0.5, y: 0.81, value: 100000 },
    { x: 0.5, y: 0.81, value: -200000 },
  ], { ...settings, saved: 5900000 })
  assert.equal(result.won, true)
  assert.equal(result.saved, 6000000)
  assert.equal(result.catches.length, 1)
})
