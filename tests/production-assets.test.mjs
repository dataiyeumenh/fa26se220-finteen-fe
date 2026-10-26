import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { collectProductionAssets, imageReferences } from '../scripts/production-assets.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const result = collectProductionAssets(root)
const included = new Set(result.kept.map(file => file.url))

test('production keeps game images from all eight chapter snapshots, including JSON-only references', () => {
  const visit = value => {
    if (typeof value === 'string' && value.startsWith('/images/')) assert.ok(included.has(value), `Missing production asset: ${value}`)
    else if (Array.isArray(value)) value.forEach(visit)
    else if (value && typeof value === 'object') Object.values(value).forEach(visit)
  }
  assert.equal(result.snapshot.chapters.length, 8)
  for (let i = 1; i <= 8; i++) {
    visit(JSON.parse(fs.readFileSync(path.join(root, `tests/fixtures/content/CH${String(i).padStart(2, '0')}.json`), 'utf8')))
  }
  for (const chapter of result.snapshot.chapters) chapter.localImages.forEach(visit)
})

test('dynamic map regions and Savings Race sprites survive filtering', () => {
  for (const region of ['01-home', '02-new-steps', '03-build', '04-horizon']) {
    assert.ok(included.has(`/images/map/journey-v2/finteen-map-${region}.png`))
  }
  for (const sprite of ['gold-coin', 'piggy-bank']) {
    assert.ok(included.has(`/images/finteen-v2/chapter-02/asset-mini-game/savings-race/${sprite}.png`))
  }
  assert.deepEqual(imageReferences('src={`/images/map/region-${region.file}.png`}'), ['/images/map/region-'])
})

test('unused legacy images are omitted from deployment while remaining available in the source tree', () => {
  assert.ok(included.has('/images/c1/mini-game/c1_item_game_gift_card.png'))
  assert.ok(included.has('/images/c1/mini-game/c1_item_student_book.png'))
  for (const url of ['/images/c1/thumbnail/c1_thumbnail_event.png', '/images/c2/scene/c2_scene_hau_qua_an_voi_ban_option_a.png']) {
    assert.ok(!included.has(url))
    assert.ok(fs.existsSync(path.join(root, 'public', url.slice(1))))
  }
  assert.ok(result.excluded.reduce((sum, file) => sum + file.bytes, 0) > 400_000_000)
  assert.ok(included.has('/favicon.svg'))
})
