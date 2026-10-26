import fs from 'node:fs'
import path from 'node:path'

const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.svg'])

export function walkFiles(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? walkFiles(filename) : [filename]
  })
}

// Templates and directory constants retain every matching file, including suffixes
// appended elsewhere (e.g. spriteBase + '/gold-coin.png').
export function imageReferences(source) {
  return [...source.matchAll(/["'`]([^"'`\r\n]*\/images\/[^"'`\r\n]*)["'`]/g)]
    .map(match => match[1].slice(match[1].indexOf('/images/')).split('${')[0].split(/[?#]/)[0])
    .filter(Boolean)
}

export function collectProductionAssets(root) {
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'scripts/production-content-assets.json'), 'utf8'))
  const reasons = new Map()
  const add = (reference, reason) => {
    const list = reasons.get(reference) || new Set()
    list.add(reason)
    reasons.set(reference, list)
  }
  for (const filename of [...walkFiles(path.join(root, 'src')), path.join(root, 'index.html')]) {
    if (!sourceExtensions.has(path.extname(filename))) continue
    for (const ref of imageReferences(fs.readFileSync(filename, 'utf8'))) add(ref, path.relative(root, filename).replaceAll('\\', '/'))
  }
  for (const chapter of snapshot.chapters) {
    for (const ref of chapter.localImages) add(ref, `content ${snapshot.version}/${chapter.code}`)
  }
  const publicDir = path.join(root, 'public')
  const files = walkFiles(publicDir).map(filename => ({
    filename,
    url: '/' + path.relative(publicDir, filename).replaceAll('\\', '/'),
    bytes: fs.statSync(filename).size,
  }))
  const references = [...reasons.keys()]
  const matchesReference = (url, ref) => url === ref || (!path.posix.extname(ref)
    && (url.startsWith(ref + '/') || url.startsWith(ref)))
  // A missing exact reference is a broken asset, not an unused file.
  for (const ref of references) {
    if (!files.some(file => matchesReference(file.url, ref))) {
      throw new Error(`Production image reference has no matching file: ${ref}`)
    }
  }
  const matches = file => references.some(ref => matchesReference(file.url, ref))
  const kept = files.filter(file => !file.url.startsWith('/images/') || matches(file))
  const included = new Set(kept.map(file => file.url))
  const excluded = files.filter(file => !included.has(file.url))
  return { snapshot, kept, excluded, references: Object.fromEntries([...reasons].map(([ref, values]) => [ref, [...values]])) }
}

export function productionPublicAssets() {
  let config
  return {
    name: 'production-public-assets',
    apply: 'build',
    configResolved(resolved) { config = resolved },
    writeBundle() {
      const result = collectProductionAssets(config.root)
      const outDir = path.resolve(config.root, config.build.outDir)
      for (const file of result.kept) {
        const destination = path.join(outDir, file.url.slice(1))
        fs.mkdirSync(path.dirname(destination), { recursive: true })
        fs.copyFileSync(file.filename, destination)
      }
      const mb = files => (files.reduce((sum, file) => sum + file.bytes, 0) / 1e6).toFixed(2)
      config.logger.info(`Public assets: kept ${result.kept.length} files (${mb(result.kept)} MB); excluded ${result.excluded.length} files (${mb(result.excluded)} MB). Content snapshot: ${result.snapshot.version}.`)
    },
  }
}
