import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { conditionActionChoices, conditionActions, conditionOutcomeLabels, conditionSentence } from '../src/features/studio/storyOps.js'

test('CH03 action names come from the actual content without changing stored flag keys', () => {
  const content = JSON.parse(readFileSync(new URL('./fixtures/content/CH03.json', import.meta.url), 'utf8'))
  const before = structuredClone(content)
  const jobs = conditionActions(content.scenes).find(a => a.var === 'flag:jobs_compared')
  assert.equal(jobs.label, 'Bấm “Xem bảng so sánh ba việc”')
  assert.equal(jobs.sources.length, 3)
  assert.match(jobs.location, /Cảnh 3:/)
  const sentence = conditionSentence({ var: jobs.var, op: '==', value: true }, content.scenes)
  assert.equal(sentence, 'Trẻ đã bấm “Xem bảng so sánh ba việc”')
  assert.doesNotMatch(sentence, /jobs_compared/)
  assert.match(conditionSentence({ var: 'flag:career_plan_opened', op: '==', value: true }, content.scenes), /Xem cảnh|xem cảnh/)
  assert.deepEqual(content, before)
})

test('action discovery follows scene, inspect, option and game completion setters, ignoring false setters', () => {
  const scenes = [{ id: 's', title: 'Bắt đầu', setFlags: { arrived: true, reset: false }, inspect: { id: 'card', buttonText: 'Xem giá', setFlags: { read: true } },
    options: [{ label: 'Tiết kiệm', flag: 'saved', setFlags: { discarded: false } }, { label: 'Bỏ qua', flag: 'overridden', setFlags: { overridden: false } }],
    game: { title: 'Ghép việc', onComplete: { setFlags: { finished: true } } } }]
  const actions = conditionActions(scenes)
  assert.deepEqual(actions.map(a => a.var), ['flag:arrived', 'inspected:card', 'flag:read', 'flag:saved', 'flag:finished'])
  assert.match(actions.at(-1).label, /Hoàn thành trò chơi/)
  assert.match(conditionSentence({ var: 'flag:read', op: '!=', value: true }, scenes), /Trẻ chưa bấm/)
  assert.match(conditionSentence({ var: 'flag:read', op: '!=', value: false }, scenes), /Trẻ đã bấm/)
})

test('empty requirements and unresolved action names are described without inventing meaning', () => {
  assert.equal(conditionSentence({ all: [] }, []), 'luôn luôn')
  assert.equal(conditionSentence({ any: [] }, []), 'không bao giờ')
  assert.match(conditionSentence({ var: 'flag:unknown', op: '==', value: true }, []), /chưa có mô tả/)
})

test('equivalent persistent inspect events share one option while preserving the condition being edited', () => {
  const scenes = [{ id: 's', inspect: { id: 'card', buttonText: 'Xem giá', setFlags: { read: true } } }]
  const actions = conditionActions(scenes)
  assert.deepEqual(conditionActionChoices(actions, 'flag:read').map(a => a.var), ['flag:read'])
  assert.deepEqual(conditionActionChoices(actions, 'inspected:card').map(a => a.var), ['inspected:card'])
  scenes.push({ id: 'reset', setFlags: { read: false } })
  assert.equal(conditionActionChoices(conditionActions(scenes), 'flag:read').length, 2, 'a resettable flag is different from having opened the card')
})

test('outcome labels follow negative requirements and empty groups without swapping stored routes', () => {
  assert.equal(conditionOutcomeLabels({ all: [{ var: 'flag:read', op: '==', value: false }] }).yes, 'Nếu trẻ chưa làm')
  assert.equal(conditionOutcomeLabels({ all: [{ var: 'flag:read', op: '!=', value: false }] }).yes, 'Nếu trẻ đã làm')
  assert.equal(conditionOutcomeLabels({ all: [] }).yes, 'Luôn xem cảnh này')
  assert.equal(conditionOutcomeLabels({ any: [] }).no, 'Luôn xem cảnh này')
  const nested = { all: [{ any: [{ var: 'money', op: '>', value: 0 }, { var: 'money', op: '==', value: 0 }] }, { var: 'money', op: '<', value: 100 }] }
  assert.match(conditionSentence(nested, []), /^\(.+ hoặc .+\) và /)
})
