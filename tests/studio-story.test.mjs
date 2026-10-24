import test from 'node:test'
import assert from 'node:assert/strict'
import { insertLinked, removeLinked, duplicateLinked, continuation, storyIssues, evalCondition, conditionSentence } from '../src/features/studio/storyOps.js'

const line = () => [
  { id: 'a', type: 'dialogue', text: 'A', nextSceneId: 'q' },
  { id: 'q', type: 'choice', text: 'Q', options: [{ id: 'q1', text: '1', nextSceneId: 'b' }, { id: 'q2', text: '2', nextSceneId: 'c' }] },
  { id: 'b', type: 'dialogue', text: 'B', nextSceneId: 'd' },
  { id: 'c', type: 'dialogue', text: 'C', nextSceneId: 'd' },
  { id: 'd', type: 'dialogue', text: 'D', nextSceneId: 'end' },
  { id: 'end', type: 'ending' },
]

test('a new question after a dialogue sends every option to the old next scene (branch and rejoin)', () => {
  const scenes = line()
  const result = insertLinked(scenes, 2, { id: 'new', type: 'choice', options: [{ id: 'x', text: '' }, { id: 'y', text: '' }] })
  assert.equal(result.index, 3)
  assert.equal(result.scenes[2].nextSceneId, 'new')
  assert.deepEqual(result.scenes[3].options.map(option => option.nextSceneId), ['d', 'd'])
  assert.equal(scenes[2].nextSceneId, 'd', 'input is not mutated')
  assert.equal(storyIssues(result.scenes.map(scene => scene.id === 'new' ? { ...scene, options: scene.options.map(o => ({ ...o, text: 'ok' })) } : scene)).length, 0)
})

test('inserting at a question puts the new scene before it so no branch is cut', () => {
  const result = insertLinked(line(), 1, { id: 'new', type: 'dialogue', text: 'N' })
  assert.equal(result.index, 1)
  assert.equal(result.scenes[0].nextSceneId, 'new')
  assert.equal(result.scenes[1].nextSceneId, 'q')
})

test('deleting relinks the previous scene; deleting a question relinks to where its branches rejoin', () => {
  const plain = removeLinked(line(), 2)
  assert.equal(plain.scenes.find(scene => scene.id === 'q').options[0].nextSceneId, 'd')
  assert.equal(continuation(line(), line()[1]), 'd')
  const question = removeLinked(line(), 1)
  assert.equal(question.scenes[0].nextSceneId, 'd')
  const first = removeLinked(line(), 0)
  assert.equal(first.scenes[0].id, 'q')
})

test('duplicating keeps the story connected and gives the copy fresh option ids', () => {
  const dialogue = duplicateLinked(line(), 0, 'copy')
  assert.equal(dialogue.scenes[0].nextSceneId, 'copy')
  assert.equal(dialogue.scenes[1].nextSceneId, 'q')
  const question = duplicateLinked(line(), 1, 'copy')
  assert.equal(question.scenes[0].nextSceneId, 'copy')
  assert.deepEqual(question.scenes[1].options.map(option => [option.id, option.nextSceneId]), [['copy_OPT1', 'q'], ['copy_OPT2', 'q']])
})

test('issues put the root cause first and group the consequences into one line', () => {
  const scenes = line()
  delete scenes[0].nextSceneId
  const issues = storyIssues(scenes)
  assert.match(issues[0].text, /Cảnh 1: chưa chọn cảnh tiếp theo/)
  assert.equal(issues.filter(item => item.group).length, 1)
  assert.match(issues.at(-1).text, /5 cảnh không có đường nào đi tới/)
})

test('conditions read as sentences and evaluate three-valued in play mode', () => {
  const state = { money: 300000, score: 0, stats: { SAVING: 50 }, flags: { done: true }, choices: { q: 'q1' }, inspected: {} }
  assert.equal(evalCondition({ all: [{ var: 'money', op: '>=', value: 200000 }, { var: 'choice:q', op: '==', value: 'q1' }] }, state), true)
  assert.equal(evalCondition({ var: 'SAVING', op: '>', value: 60 }, state), false)
  assert.equal(evalCondition({ any: [{ var: 'unknownVar', op: '==', value: true }, { var: 'flag:done', op: '==', value: true }] }, state), true)
  assert.equal(evalCondition({ var: 'unknownVar', op: '==', value: true }, state), undefined)
  assert.equal(conditionSentence({ var: 'money', op: '>=', value: 500000 }, line()), 'Tiền của An ít nhất 500.000đ')
  assert.match(conditionSentence({ var: 'choice:q', op: '==', value: 'q2' }, line()), /đã chọn “2”/)
})
