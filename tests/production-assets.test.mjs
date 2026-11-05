import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { collectProductionAssets, imageReferences } from '../scripts/production-assets.mjs'
import { webpImageUrl } from '../src/lib/imageAssets.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const result = collectProductionAssets(root)
const included = new Set(result.kept.map(file => file.url))

test('production keeps game images from all eight chapter snapshots, including JSON-only references', () => {
  const visit = value => {
    if (typeof value === 'string' && value.startsWith('/images/')) assert.ok(included.has(webpImageUrl(value)), `Missing production asset: ${value}`)
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
    assert.ok(included.has(`/images/map/journey-v2/finteen-map-${region}.webp`))
  }
  for (const sprite of ['gold-coin', 'piggy-bank']) {
    assert.ok(included.has(`/images/finteen-v2/chapter-02/asset-mini-game/savings-race/${sprite}.webp`))
  }
  assert.deepEqual(imageReferences('src={`/images/map/region-${region.file}.png`}'), ['/images/map/region-'])
})

test('unused legacy images are omitted from deployment while remaining available in the source tree', () => {
  assert.ok(included.has('/images/c1/mini-game/c1_item_game_gift_card.webp'))
  assert.ok(included.has('/images/c1/mini-game/c1_item_student_book.webp'))
  for (const url of ['/images/c1/thumbnail/c1_thumbnail_event.png', '/images/c2/scene/c2_scene_hau_qua_an_voi_ban_option_a.png']) {
    assert.ok(!included.has(url))
    assert.ok(fs.existsSync(path.join(root, 'public', url.slice(1))))
  }
  assert.ok(result.excluded.reduce((sum, file) => sum + file.bytes, 0) > 400_000_000)
  assert.ok(included.has('/favicon.svg'))
})

test('deployment contains only WebP raster images and preserves the real brand logo', () => {
  assert.ok(included.has('/brand/finteen-logo-v2.webp'))
  assert.ok(!result.kept.some(file => /\.(png|jpe?g|bmp|tiff)$/i.test(file.url)))
  for (const file of result.kept.filter(file => file.url.endsWith('.webp'))) {
    const header = fs.readFileSync(file.filename).subarray(0, 12)
    assert.equal(header.toString('ascii', 0, 4), 'RIFF')
    assert.equal(header.toString('ascii', 8, 12), 'WEBP')
  }
})
