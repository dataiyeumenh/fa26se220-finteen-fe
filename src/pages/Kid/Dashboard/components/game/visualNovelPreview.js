import { evaluateCondition } from './conditions.js'
import { initialNovelProgress } from './visualNovelProgress.js'

// Start a draft in a fresh, memory-only run. Conditions use the same evaluator as gameplay.
export function initialPreviewProgress(data, startSceneId) {
  const initial = initialNovelProgress(data)
  let index = Math.max(0, data.scenes.findIndex(scene => scene.id === startSceneId))
  const seen = new Set()
  while (data.scenes[index]?.type === 'conditional' && !seen.has(index)) {
    seen.add(index)
    const scene = data.scenes[index]
    const passed = evaluateCondition(scene.condition, {
      stats: initial.stats, money: initial.money, flags: {}, inspectedIds: {}, choiceLedger: {}, miniGameScore: 0,
    })
    const target = data.scenes.findIndex(item => item.id === (passed ? scene.ifTrueSceneId : scene.ifFalseSceneId))
    if (target < 0) break
    index = target
  }
  return { ...initial, scenePath: [index] }
}
