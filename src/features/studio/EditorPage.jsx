// Soạn chương + chơi thử (bản demo). Nội dung đúng hình dạng chapterNV2GameData; GET …/draft trả URL ảnh thật, lưu lại
// nguyên vậy BE tự đổi về {{ASSET_BASE}}. Sửa nhanh các trường hay đổi; trường khác sửa ở chế độ JSON.
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { auth } from '../../api/auth.api'
import { canEdit } from './permissions'
import { studioApi, formatError } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import EditorCanvas from './EditorCanvas'
import { nextSceneId, insertScene, copyScene } from './sceneEditing'
import { prepareDraftV2, parseCondition } from './draftV2'
import { AssetPicker } from './AssetsPage'
import { Btn, Panel } from './ui'

function template(code) {
  const n = Number(code.slice(2))
  return {
    id: `chapter-${n}`,
    title: `Chương ${n}`,
    version: '1.0.0',
    initialStats: { SAVING: 50, HAPPINESS: 50 },
    sprites: {},
    scenes: [
      { id: `${code}_SC01`, type: 'dialogue', title: 'Mở đầu', background: '', characters: [], speaker: 'An', speakerId: 'AN', text: 'Lời thoại đầu tiên…', nextSceneId: `${code}_CHOICE` },
      {
        id: `${code}_CHOICE`,
        type: 'choice',
        title: 'Lựa chọn',
        background: '',
        characters: [],
        speaker: 'An',
        speakerId: 'AN',
        text: 'Mình nên làm gì?',
        options: [
          { id: `${code}_A`, text: 'A. Tiết kiệm', nextSceneId: `${code}_END` },
          { id: `${code}_B`, text: 'B. Tiêu ngay', nextSceneId: `${code}_END` },
        ],
      },
      { id: `${code}_END`, type: 'ending', title: 'Kết thúc', background: '', characters: [], nextSceneId: null },
    ],
    endingRules: { priorityOrder: [], endings: [] },
  }
}

/** Màn chơi thử: nền, nhân vật, lời thoại, lựa chọn / mini-game giả lập — bấm để đi qua các cảnh. */
function Stage({ scene, go }) {
  if (!scene) return <p className="p-6">Chưa có cảnh để xem. Thêm cảnh hoặc nhập nội dung JSON.</p>
  const next = (id) => (
    <button type="button" className="rounded bg-white px-3 py-1.5 text-left text-slate-800" disabled={!id} onClick={() => go(id)}>
      {id ? `Tiếp → ${id}` : 'Hết chương'}
    </button>
  )
  let opts = null
  if (scene.type === 'choice')
    opts = (scene.options || []).map((o) => (
      <button key={o.id} type="button" className="rounded bg-white px-3 py-1.5 text-left text-slate-800" onClick={() => go(o.nextSceneId)}>
        {o.text || o.label}
      </button>
    ))
  else if (scene.type === 'minigame')
    opts = (
      <>
        <div>🎮 {scene.game?.title || 'Mini-game'} ({scene.game?.mechanic})</div>
        <button type="button" className="rounded bg-white px-3 py-1.5 text-slate-800" onClick={() => go(scene.onPassSceneId || scene.nextSceneId)}>
          Giả lập: qua
        </button>
        <button type="button" className="rounded bg-white px-3 py-1.5 text-slate-800" onClick={() => go(scene.id)}>
          Giả lập: thử lại
        </button>
      </>
    )
  else if (scene.type !== 'ending') opts = next(scene.nextSceneId)
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-800 bg-cover bg-center" style={{ backgroundImage: scene.background ? `url("${scene.background}")` : 'none' }}>
      <div className="absolute inset-0 flex items-end justify-between px-[6%]">
        {(scene.characters || []).map((c, i) => c.src && <img key={i} src={c.src} alt={c.id || ''} className="max-h-[78%]" />)}
      </div>
      <div className="absolute right-[3%] bottom-[3%] left-[3%] rounded-xl bg-slate-900/85 p-3 text-white">
        {scene.speaker && <b className="text-amber-200">{scene.speaker}: </b>}
        {scene.text || scene.inspect?.dataText || scene.title}
        {scene.type === 'ending' && <div>🏁 Kết thúc chương</div>}
        <div className="mt-2 flex flex-col gap-1.5">{opts}</div>
      </div>
    </div>
  )
}

export default function EditorPage({ notify, code }) {
  const [search, setSearch] = useSearchParams()
  const [meta, setMeta] = useState(null)
  const [content, setContent] = useState(null)
  const [idx, setIdx] = useState(0)
  const [json, setJson] = useState(null) // chuỗi khi đang ở chế độ JSON
  const [picking, setPicking] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [dirty, setDirty] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [warnings, setWarnings] = useState([])
  const [refreshError, setRefreshError] = useState('')
  const [conditionDrafts, setConditionDrafts] = useState({})
  const { busy, run } = useStudioAction(notify)
  const write = canEdit(auth.getSnapshot().actor) && meta?.status !== 'SUBMITTED'
  const schemaLoader = useCallback(() => studioApi.get('/api/studio/scene-schema'), [])
  const schemaQuery = useStudioResource(schemaLoader)

  useEffect(() => {
    let active = true
    const fresh = search.get('new') && canEdit(auth.getSnapshot().actor)
    const request = fresh ? Promise.resolve({ draft: { status: 'MỚI', revision: 0 }, content: template(code) }) : studioApi.get(`/api/studio/chapters/${encodeURIComponent(code)}/draft`)
    request.then(result => {
      if (!active) return
      setMeta(result.draft); setContent(prepareDraftV2(result.content)); setIdx(0); setLoadError('')
    }).catch(error => { if (active) setLoadError(formatError(error)) })
    return () => { active = false }
  }, [code, search, attempt])
  useEffect(() => {
    if (!dirty) return
    const warn = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (loadError) return <Panel title={code}><p role="alert">{loadError}</p><Btn onClick={() => { setLoadError(''); setAttempt(value => value + 1) }}>Thử lại</Btn></Panel>
  if (!content) return <p role="status">Đang tải {code}…</p>
  const scenes = content.scenes || []
  const scene = scenes[idx] || scenes[0]
  const ids = scenes.map((s) => s.id)
  const update = (patch) => { if (!write || busy) return; setDirty(true); setContent({ ...content, scenes: scenes.map((s, i) => (i === idx ? { ...s, ...patch } : s)) }) }
  const editCondition = (index, raw) => {
    if (!write || busy) return
    setConditionDrafts(previous => ({ ...previous, [`${scene.id}/${index}`]: raw }))
    setDirty(true)
    try {
      const condition = parseCondition(raw)
      update({ options: scene.options.map((option, i) => {
        if (i !== index) return option
        const next = { ...option }
        if (condition === undefined) delete next.condition
        else next.condition = condition
        return next
      }) })
    } catch { /* Keep incomplete JSON visible until the author fixes it. */ }
  }
  const go = (id) => {
    const i = ids.indexOf(id)
    if (i < 0) notify(`Cảnh "${id}" không tồn tại`)
    else setIdx(i)
  }

  const save = async () => {
    if (!write || busy) return
    if (json === null) {
      for (const [key, raw] of Object.entries(conditionDrafts)) {
        if (!scenes.some(scene => key.startsWith(`${scene.id}/`))) continue
        try { parseCondition(raw) } catch (error) { return notify(`Điều kiện ${key}: JSON chưa hợp lệ. ${error.message}`) }
      }
    }
    let body = content
    if (json !== null) {
      try {
        body = JSON.parse(json)
      } catch (e) {
        return notify('JSON sai: ' + e.message)
      }
    }
    if (!body || typeof body !== 'object' || Array.isArray(body) || !Array.isArray(body.scenes) || !body.scenes.length) return notify('Nội dung phải là đối tượng JSON có ít nhất một scene.')
    body = prepareDraftV2(body)
    await run(async () => {
      const saved = await studioApi.put(`/api/studio/chapters/${encodeURIComponent(code)}/draft`, body)
      try {
        const refreshed = await studioApi.get(`/api/studio/chapters/${encodeURIComponent(code)}/draft`)
        return { saved, refreshed }
      } catch (error) { return { saved, refreshError: formatError(error) } }
    }, 'Đã lưu nháp ' + code, result => {
      if (result.refreshed) setMeta(result.refreshed.draft)
      setContent(prepareDraftV2(result.refreshed?.content || body)); setIdx(0); setJson(null); setDirty(false); setConditionDrafts({})
      setWarnings(result.saved?.warnings || []); setRefreshError(result.refreshError || '')
      if (search.has('new') && result.refreshed) setSearch({}, { replace: true })
    })
  }

  const addScene = () => {
    if (!write || busy) return
    const id = nextSceneId(code, scenes)
    const result = insertScene(scenes, idx, { id, type: 'dialogue', title: '', background: scene?.background || '', characters: [], speaker: '', text: '', nextSceneId: scene?.nextSceneId ?? null })
    setContent({ ...content, scenes: result.scenes }); setIdx(result.index); setDirty(true)
  }
  const duplicateScene = () => {
    if (!write || busy || !scene) return
    const result = insertScene(scenes, idx, copyScene(scene, nextSceneId(code, scenes)))
    setContent({ ...content, scenes: result.scenes }); setIdx(result.index); setDirty(true)
  }
  const deleteScene = () => {
    if (!write || busy || !scene) return
    if (!window.confirm(`Xóa cảnh ${scene.id}? Bạn cần cập nhật các cảnh đang trỏ đến cảnh này trước khi lưu.`)) return
    setContent({ ...content, scenes: scenes.filter((_, i) => i !== idx) })
    setIdx(Math.max(0, idx - 1)); setDirty(true)
  }
  const toggleJson = () => {
    if (json === null) {
      for (const raw of Object.values(conditionDrafts)) { try { parseCondition(raw) } catch { return notify('Hãy sửa JSON điều kiện chưa hợp lệ trước khi đổi chế độ.') } }
      setJson(JSON.stringify(content, null, 2)); return
    }
    try {
      const parsed = JSON.parse(json)
      if (!parsed || !Array.isArray(parsed.scenes)) throw new Error('Cần mảng scenes trong nội dung chương.')
      setContent(prepareDraftV2(parsed)); setIdx(0); setJson(null); setConditionDrafts({})
    } catch (error) { notify('JSON: ' + error.message) }
  }
  return <>
    <EditorCanvas code={code} content={content} meta={meta} scenes={scenes} scene={scene} idx={idx} setIdx={setIdx}
      preview={<Stage scene={scene} go={go} />} write={write} busy={busy} dirty={dirty} json={json}
      setJson={value => { setJson(value); setDirty(true) }} toggleJson={toggleJson} save={save} update={update}
      addScene={addScene} duplicateScene={duplicateScene} deleteScene={deleteScene} onPick={() => setPicking(true)} schemaQuery={schemaQuery}
      warnings={warnings} refreshError={refreshError} conditionDrafts={conditionDrafts} editCondition={editCondition} />
    {picking && <AssetPicker chapter={code} notify={notify} onClose={() => setPicking(false)} onPick={asset => { update({ background: asset.url }); setPicking(false) }} />}
  </>
}
