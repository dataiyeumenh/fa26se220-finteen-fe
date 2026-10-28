import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { collectProductionAssets } from './production-assets.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))

if (process.argv.includes('--refresh-content')) {
  const base = (process.argv.find(value => value.startsWith('--api-base='))?.slice('--api-base='.length)
    || process.env.VITE_API_BASE_URL || 'https://kidzeconomy.com.vn/finteen').replace(/\/+$/, '')
  const get = async endpoint => {
    const response = await fetch(base + endpoint, { signal: AbortSignal.timeout(20000) })
    const body = await response.json()
    if (!response.ok || body.code !== 0) throw new Error(`Content API failed: ${endpoint} (${response.status})`)
    return body.result
  }
  const current = await get('/api/content/current')
  if (!current?.version || !current.chapters?.length) throw new Error('Content release has no version or chapters')
  const chapters = []
  for (const { code } of current.chapters) {
    const content = await get(`/api/content/releases/${encodeURIComponent(current.version)}/chapters/${encodeURIComponent(code)}`)
    const refs = new Set()
    const visit = value => {
      if (typeof value === 'string' && value.startsWith('/images/')) refs.add(value.split(/[?#]/)[0])
      else if (Array.isArray(value)) value.forEach(visit)
      else if (value && typeof value === 'object') Object.values(value).forEach(visit)
    }
    visit(content)
    chapters.push({ code, localImages: [...refs].sort() })
  }
  fs.writeFileSync(path.join(root, 'scripts/production-content-assets.json'), JSON.stringify({
    source: base, version: current.version, checkedAt: new Date().toISOString(), chapters,
  }, null, 2) + '\n')
}

const result = collectProductionAssets(root)
const summarize = files => ({ count: files.length, bytes: files.reduce((sum, file) => sum + file.bytes, 0) })
const report = {
  version: result.snapshot.version,
  checkedAt: result.snapshot.checkedAt,
  kept: summarize(result.kept),
  excluded: summarize(result.excluded),
  references: result.references,
  includedFiles: result.kept.map(({ url, bytes }) => ({ url, bytes })),
  excludedFiles: result.excluded.map(({ url, bytes }) => ({ url, bytes })).sort((a, b) => b.bytes - a.bytes),
}
fs.mkdirSync(path.join(root, 'output'), { recursive: true })
fs.writeFileSync(path.join(root, 'output/deployment-assets-audit.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ version: report.version, kept: report.kept, excluded: report.excluded, report: 'output/deployment-assets-audit.json' }, null, 2))
