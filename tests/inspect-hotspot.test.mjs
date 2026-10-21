import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeHotspot } from '../src/pages/Kid/Dashboard/components/game/inspectHotspot.js'
import { chapter4V2GameData } from '../src/pages/Kid/Dashboard/data/chapter4V2VisualNovel.js'

test('hotspot stays within image bounds after moving and resizing', () => {
  assert.deepEqual(normalizeHotspot({ x: 95, y: -20, width: 30, height: 20 }), { x: 70, y: 0, width: 30, height: 20 })
  assert.deepEqual(normalizeHotspot({ x: 10, y: 10, width: 150, height: -1 }), { x: 0, y: 10, width: 100, height: 2 })
  assert.deepEqual(normalizeHotspot({ x: NaN, y: Infinity }), { x: 0, y: 0, width: 30, height: 20 })
})

test('comparison opens from chapter 4 art; purchase options retain inspected requirement', () => {
  const scenes = chapter4V2GameData.scenes
  const art = scenes.find(scene => scene.id === 'CH04_SC02_ART')
  assert.equal(art.inspect.id, 'ch04_comparison')
  assert.equal(art.inspect.autoNextSceneOnClose, true)
  assert.deepEqual(normalizeHotspot(art.inspect.hotspot), art.inspect.hotspot)
  assert.equal(art.nextSceneId, 'CH04_SC02_B01')
  assert.equal(scenes.filter(scene => scene.inspect?.id === 'ch04_comparison').length, 1)
  const purchase = scenes.find(scene => scene.id === 'CH04_SC02')
  assert.equal(purchase.inspect, undefined)
  assert.equal(purchase.reviewAction.targetSceneId, art.id)
  for (const option of purchase.options) assert.ok(option.requires.inspected.includes(art.inspect.id))
})
