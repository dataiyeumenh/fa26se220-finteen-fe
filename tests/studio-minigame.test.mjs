import test from 'node:test'
import assert from 'node:assert/strict'
import { gradeItems, setAnswer, settingFields, textGroups, getAt } from '../src/features/studio/minigameOps.js'

const game = {
  id: 'G', kind: 'NEED_WANT', title: 'Cần hay muốn', mechanic: 'drag', timeLimitSeconds: 60, passScore: 5,
  items: [
    { id: 'MEAL', label: 'Bữa ăn hàng ngày', image: 'https://x/a/meal.webp', category: 'NEEDS', explanation: 'Ăn uống là nhu cầu thiết yếu.', grade: { rule: { eq: 'NEEDS' } } },
    { id: 'TOY', label: 'Đồ chơi mới', image: 'https://x/a/toy.webp', category: 'WANTS', explanation: 'Món này chỉ là mong muốn.', grade: { rule: { eq: 'WANTS' } } },
  ],
  zones: [{ id: 'NEEDS', title: 'Giỏ Cần' }, { id: 'WANTS', title: 'Giỏ Muốn' }],
  config: { questions: [{ id: 'q1', prompt: 'Lãi năm đầu là bao nhiêu?', answer: 2500, grade: { rule: { eq: 2500 } } }, { id: 'q2', prompt: 'Chọn đúng', grade: { rule: { all: [{ eq: 1 }, { eq: 2 }] } } }] },
}

test('texts are grouped by area with plain labels and skip codes, images and answers', () => {
  const groups = textGroups(game)
  const items = groups.find(group => group.section === 'items')
  assert.equal(items.label, 'Các thẻ')
  assert.ok(items.fields.some(field => field.label === 'Bữa ăn hàng ngày · Giải thích'))
  assert.ok(!JSON.stringify(groups).includes('NEEDS'))
  assert.ok(!JSON.stringify(groups).includes('meal.webp'))
})

test('numbers and images are found for the simple settings form', () => {
  const { numbers, images } = settingFields(game)
  assert.ok(numbers.some(field => field.label === 'Thời gian chơi (giây)' && field.value === 60))
  assert.ok(!numbers.some(field => field.value === 2500), 'answers stay out of settings')
  assert.equal(images.length, 2)
})

test('answers: eq / in become pickable choices taken from the game, compound rules stay advanced', () => {
  const items = gradeItems(game)
  assert.equal(items.length, 4)
  assert.deepEqual(items[0].choices.map(choice => choice.label), ['Giỏ Cần', 'Giỏ Muốn'])
  assert.equal(items[2].numeric, true)
  assert.equal(items[3].simple, false)
  const copy = structuredClone(game)
  setAnswer(copy, items[0].path, { eq: 'WANTS' })
  assert.equal(getAt(copy, items[0].path).category, 'WANTS', 'legacy answer field follows')
})
