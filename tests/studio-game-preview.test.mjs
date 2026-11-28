import test from 'node:test'
import assert from 'node:assert/strict'
import { initialPreviewProgress } from '../src/pages/Kid/Dashboard/components/game/visualNovelPreview.js'
import { normalizeChapter } from '../src/pages/Kid/Dashboard/components/game/chapterShape.js'

const chapter = {
  id: 'preview', initialMoney: 300000, initialStats: { SAVING: 40 },
  scenes: [
    { id: 'intro', type: 'dialogue' },
    { id: 'check', type: 'conditional', condition: { var: 'flag:read', op: '==', value: true }, ifTrueSceneId: 'end', ifFalseSceneId: 'card' },
    { id: 'card', type: 'inspect' },
    { id: 'end', type: 'ending' },
  ],
}
test('a draft preview starts fresh at the selected scene without changing the draft', () => {
  const before = structuredClone(chapter)
  const first = initialPreviewProgress(chapter, 'card')
  assert.deepEqual(first.scenePath, [2])
  assert.equal(first.money, 300000)
  assert.equal(first.stats.SAVING, 40)
  first.stats.SAVING = 99
  first.flags.read = true
  const second = initialPreviewProgress(chapter, 'card')
  assert.deepEqual(second.flags, {})
  assert.equal(second.stats.SAVING, 40)
  assert.deepEqual(chapter, before)
})
test('a preview skips automatic branching with the actual game condition evaluator', () => {
  assert.deepEqual(initialPreviewProgress(chapter, 'check').scenePath, [2])
  const nested = structuredClone(chapter)
  nested.scenes[1].condition = { all: [{ var: 'money', op: '>=', value: 300000 }, { var: 'SAVING', op: '==', value: 40 }] }
  assert.deepEqual(initialPreviewProgress(nested, 'check').scenePath, [3])
  assert.deepEqual(initialPreviewProgress(chapter, 'missing').scenePath, [0])
})
test('broken draft branches and loops do not hang initialization', () => {
  const broken = structuredClone(chapter)
  broken.scenes[1].ifFalseSceneId = 'missing'
  assert.deepEqual(initialPreviewProgress(broken, 'check').scenePath, [1])
  broken.scenes[1].ifFalseSceneId = 'check'
  assert.deepEqual(initialPreviewProgress(broken, 'check').scenePath, [1])
})

test('the shared player accepts choice text from new draft scenes and preserves published labels', () => {
  const content = { scenes: [{ id: 'q', type: 'choice', options: [{ id: 'a', text: 'Mới soạn' }, { id: 'b', label: 'Đã phát hành', text: 'Context' }] }] }
  const normalized = normalizeChapter(content)
  assert.equal(normalized.scenes[0].options[0].label, 'Mới soạn')
  assert.equal(normalized.scenes[0].options[1].label, 'Đã phát hành')
  assert.equal(content.scenes[0].options[0].label, undefined)
})
