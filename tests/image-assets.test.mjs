import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveContentImages, webpImageUrl } from '../src/lib/imageAssets.js'

test('legacy local images resolve to WebP without changing query parameters or external uploads', () => {
  const image = '/images/map/journey-v2/finteen-map-01-home.png'
  assert.equal(webpImageUrl(image + '?v=2#map'), image.replace('.png', '.webp') + '?v=2#map')
  for (const url of ['https://cdn.example.com/image.png', '/uploads/unknown.png', '{{ASSET_BASE}}/image.png', 'data:image/png;base64,abc']) {
    assert.equal(webpImageUrl(url), url)
  }
})

test('nested API content resolves local images without mutating scene IDs, numbers or the original payload', () => {
  const original = { id: 'SC01', amount: 20, image: '/brand/finteen-logo-v2.png', scenes: [{ image: '/images/map/journey-v2/finteen-map-01-home.png', nextSceneId: 'END', voice: null }] }
  const resolved = resolveContentImages(original)
  assert.equal(resolved.image, '/brand/finteen-logo-v2.webp')
  assert.match(resolved.scenes[0].image, /\.webp$/)
  assert.equal(resolved.scenes[0].nextSceneId, 'END')
  assert.equal(resolved.scenes[0].voice, null)
  assert.equal(resolved.amount, 20)
  assert.match(original.image, /\.png$/)
})
