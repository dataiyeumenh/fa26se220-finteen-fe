// Soạn chương + chơi thử (bản demo). Nội dung đúng hình dạng chapterNV2GameData; GET …/draft trả URL ảnh thật, lưu lại
// nguyên vậy BE tự đổi về {{ASSET_BASE}}. Sửa nhanh các trường hay đổi; trường khác sửa ở chế độ JSON.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { auth } from '../../api/auth.api'
import { canEdit } from './permissions'
import { studioApi, formatError } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import EditorCanvas from './EditorCanvas'
import { nextSceneId } from './sceneEditing'
import { TYPE_LABEL, duplicateLinked, insertLinked, isLinear, removeLinked, storyIssues } from './storyOps'
import MinigameDialog from './MinigameDialog'
import { AddSceneDialog, CharacterDialog, ConditionDialog, EffectDialog, PlayDialog, ScenePickerDialog } from './SceneDialogs'
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

/** Gợi ý cách đọc của AI: mỗi câu Nhận (ghi spokenText vào nháp, cần Lưu nháp) hoặc Bỏ; ghi rõ AI nào sinh ra. */
function VoiceHints({ hints, scenes, write, onAccept, onDrop, onOpen, onClose }) {
  const number = id => scenes.findIndex(s => s.id === id) + 1
  return <Panel title="Gợi ý cách đọc cho giọng" actions={<>
    {write && hints.suggestions.length > 1 && <Btn tone="primary" onClick={() => onAccept(null, true)}>Nhận tất cả</Btn>}
    <Btn onClick={onClose}>Đóng</Btn>
  </>}>
    <p className="mb-3 text-xs text-slate-500">
      {hints.source ? `Gợi ý từ ${hints.source === 'GEMINI' ? 'Gemini' : 'OpenRouter'} (${hints.model}) · ` : ''}
      {hints.lines} câu thoại · {hints.sentToAi} câu có số / ký hiệu gửi AI · {hints.aiCalls} lần gọi. AI chỉ gợi ý — bấm Nhận rồi Lưu nháp mới ghi.
    </p>
    {!hints.suggestions.length && <p>Không còn gợi ý nào.</p>}
    <ul className="grid gap-2">{hints.suggestions.map(hint => <li key={hint.sceneId} className="rounded-lg border border-slate-200 p-3">
      <button type="button" className="text-xs text-blue-700 underline" onClick={() => onOpen(hint.sceneId)}>Cảnh {number(hint.sceneId)}</button>
      <p className="mt-1 text-sm text-slate-500">{hint.text}</p>
      <p className="mt-1 text-sm font-semibold">Đọc là: {hint.suggestion}</p>
      {!!hint.reasons?.length && <p className="text-xs text-slate-500">Vì: {hint.reasons.join(', ')}</p>}
      {write && <div className="mt-2 flex gap-2"><Btn tone="primary" onClick={() => onAccept(hint)}>Nhận</Btn><Btn onClick={() => onDrop(hint)}>Bỏ</Btn></div>}
    </li>)}</ul>
  </Panel>
}

export default function EditorPage({ notify, code, onNavigationStateChange }) {
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
  const [voiceHints, setVoiceHints] = useState(null) // gợi ý cách đọc của AI — chưa ghi vào nháp tới khi người soạn bấm Nhận
  const [history, setHistory] = useState({ past: [], future: [] })
  const [notice, setNotice] = useState(null) // ví dụ "Đã xoá cảnh 3" kèm nút Hoàn tác
  const [dialog, setDialog] = useState(null)
  const lastEdit = useRef({ key: null, at: 0 })
  const { busy, run } = useStudioAction(notify)
  useEffect(() => {
    onNavigationStateChange?.({ dirty, busy })
    return () => onNavigationStateChange?.({ dirty: false, busy: false })
  }, [dirty, busy, onNavigationStateChange])
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

  const scenes = content?.scenes || []
  const scene = scenes[idx] || scenes[0]
  const stats = schemaQuery.data?.stats || []
  const canChange = write && !busy && !!content
  /* hoàn tác / làm lại: chụp cả chương trước mỗi thay đổi; gõ liên tục vào cùng một ô gộp thành một bước */
  const remember = (mergeKey) => {
    const now = Date.now(), last = lastEdit.current
    lastEdit.current = { key: mergeKey, at: now }
    if (mergeKey && last.key === mergeKey && now - last.at < 1500) return
    setHistory(h => ({ past: [...h.past.slice(-79), { content, idx }], future: [] }))
  }
  const commit = (next, nextIdx = idx, mergeKey) => { if (!canChange) return; remember(mergeKey); setContent(next); setIdx(nextIdx); setDirty(true) }
  const update = (patch) => commit({ ...content, scenes: scenes.map((s, i) => (i === idx ? { ...s, ...patch } : s)) }, idx, `${scene?.id}:${Object.keys(patch).join(',')}`)
  const step = (from, to) => {
    if (!history[from].length || !canChange) return
    const target = history[from].at(-1)
    setHistory(h => ({ [from]: h[from].slice(0, -1), [to]: [...h[to], { content, idx }] }))
    lastEdit.current = { key: null, at: 0 }
    setContent(target.content); setIdx(Math.min(target.idx, (target.content.scenes?.length || 1) - 1)); setDirty(true); setNotice(null)
  }
  const undo = () => step('past', 'future')
  const redo = () => step('future', 'past')
  const announce = text => setNotice({ text, undo: () => { undo(); setNotice(null) } })
  useEffect(() => {
    const onKey = event => {
      if (!(event.ctrlKey || event.metaKey) || !['z', 'y'].includes(event.key.toLowerCase()) || json !== null) return
      if (event.target.closest?.('input, textarea, select, [contenteditable]')) return // ô đang gõ: để trình duyệt tự hoàn tác chữ
      event.preventDefault()
      if (event.key.toLowerCase() === 'y' || event.shiftKey) redo(); else undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 8000)
    return () => clearTimeout(timer)
  }, [notice])

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
  const suggestVoice = () => void run(
    () => studioApi.post(`/api/studio/chapters/${encodeURIComponent(code)}/voice/suggest`),
    result => result.aiCalls ? `AI gợi ý ${result.suggestions.length} câu (${result.aiCalls} lần gọi)` : 'Không có câu nào cần đổi cách đọc.',
    result => setVoiceHints(result),
  )
  const acceptHint = (hint, all = false) => {
    if (!write) return
    const picked = all ? voiceHints.suggestions : [hint]
    const byId = Object.fromEntries(picked.map(item => [item.sceneId, item.suggestion]))
    setContent({ ...content, scenes: scenes.map(s => (s.id in byId ? { ...s, spokenText: byId[s.id] } : s)) })
    setDirty(true)
    setVoiceHints(all ? null : { ...voiceHints, suggestions: voiceHints.suggestions.filter(item => item !== hint) })
  }
  const dropHint = hint => setVoiceHints({ ...voiceHints, suggestions: voiceHints.suggestions.filter(item => item !== hint) })
  const go = (id) => {
    const i = scenes.findIndex(s => s.id === id)
    if (i < 0) notify(`Không tìm thấy cảnh "${id}"`)
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
      setContent(prepareDraftV2(result.refreshed?.content || body)); setJson(null); setHistory({ past: [], future: [] }); setDirty(false); setConditionDrafts({})
      setWarnings(result.saved?.warnings || []); setRefreshError(result.refreshError || '')
      if (search.has('new') && result.refreshed) setSearch({}, { replace: true })
    })
  }

  /* chèn / xoá / nhân đôi không làm đứt mạch: câu hỏi mới thì mọi lựa chọn về cảnh kế cũ, xoá thì cảnh trước nối sang cảnh sau */
  const addScene = (type, gameKind) => {
    const id = nextSceneId(code, scenes)
    const fresh = { id, type, title: '', background: scene?.background || '', characters: structuredClone(scene?.characters || []) }
    if (['dialogue', 'summary', 'cutscene', 'ending', 'choice', 'inspect'].includes(type)) fresh.text = ''
    if (type === 'reflection') fresh.prompt = ''
    if (type === 'choice') fresh.options = [{ id: `${id}_OPT1`, text: '' }, { id: `${id}_OPT2`, text: '' }]
    if (type === 'inspect') fresh.inspect = { id: `${id}_INS`, buttonText: 'Bấm để xem', dataText: '' }
    if (type === 'conditional') fresh.condition = { all: [] }
    if (type === 'minigame') {
      const sample = scenes.find(s => s.game?.kind === gameKind)?.game
      fresh.game = { ...(sample ? structuredClone(sample) : { title: schemaQuery.data?.minigameKinds?.[gameKind]?.label || 'Mini-game' }), id: `${id}_GAME`, kind: gameKind }
    }
    const result = insertLinked(scenes, idx, fresh)
    commit({ ...content, scenes: result.scenes }, result.index)
    setDialog(null)
    announce(type === 'choice' ? 'Đã thêm câu hỏi. Mọi lựa chọn tạm đi về cảnh kế cũ; đổi “Bấm xong thì sang” để tạo nhánh riêng.' : `Đã thêm ${(TYPE_LABEL[type] || 'cảnh').toLowerCase()} ở cảnh ${result.index + 1}.`)
  }
  const duplicateScene = () => {
    if (!scene) return
    const result = duplicateLinked(scenes, idx, nextSceneId(code, scenes))
    commit({ ...content, scenes: result.scenes }, result.index)
    announce(`Đã nhân đôi thành cảnh ${result.index + 1}.`)
  }
  const deleteScene = () => {
    if (!scene) return
    if (scenes.length <= 1) return notify('Chương cần ít nhất một cảnh.')
    const result = removeLinked(scenes, idx)
    commit({ ...content, scenes: result.scenes }, result.index)
    announce(`Đã xoá cảnh ${idx + 1}${result.to ? '. Cảnh trước nối thẳng sang cảnh sau' : ''}.`)
  }
  /* bản đồ: tạo nhánh riêng cho một lựa chọn đang đi thẳng về điểm nhập; thêm cảnh ở cuối một làn */
  const createBranch = (questionIndex, optionIndex, joinIndex) => {
    const question = scenes[questionIndex], id = nextSceneId(code, scenes)
    const fresh = { id, type: 'dialogue', title: '', text: '', background: question.background || '', characters: structuredClone(question.characters || []), nextSceneId: joinIndex != null ? scenes[joinIndex].id : null }
    const next = scenes.map((item, i) => (i === questionIndex ? { ...item, options: item.options.map((option, k) => (k === optionIndex ? { ...option, nextSceneId: id } : option)) } : item))
    next.splice(questionIndex + 1, 0, fresh)
    commit({ ...content, scenes: next }, questionIndex + 1)
    announce(`Đã tạo nhánh riêng cho lựa chọn ${optionIndex + 1} ở cảnh ${questionIndex + 2}; xong cảnh đó thì về chỗ các làn nhập lại.`)
  }
  const addLaneEnd = lastIndex => {
    const id = nextSceneId(code, scenes), last = scenes[lastIndex]
    const result = insertLinked(scenes, lastIndex, { id, type: 'dialogue', title: '', text: '', background: last.background || '', characters: structuredClone(last.characters || []) })
    commit({ ...content, scenes: result.scenes }, result.index)
    announce(`Đã thêm cảnh ${result.index + 1} ở cuối làn.`)
  }
  const setOption = (index, patch) => update({ options: scene.options.map((option, k) => {
    if (k !== index) return option
    const next = { ...option, ...patch }
    for (const key of Object.keys(patch)) if (patch[key] === undefined) delete next[key]
    return next
  }) })

  const toggleJson = () => {
    if (json === null) {
      for (const raw of Object.values(conditionDrafts)) { try { parseCondition(raw) } catch { return notify('Hãy sửa JSON điều kiện chưa hợp lệ trước khi đổi chế độ.') } }
      setJson(JSON.stringify(content, null, 2)); return
    }
    try {
      const parsed = JSON.parse(json)
      if (!parsed || !Array.isArray(parsed.scenes)) throw new Error('Cần mảng scenes trong nội dung chương.')
      setContent(prepareDraftV2(parsed)); setIdx(0); setJson(null); setConditionDrafts({}); setHistory({ past: [], future: [] })
    } catch (error) { notify('JSON: ' + error.message) }
  }
  if (loadError) return <Panel title={code}><p role="alert">{loadError}</p><Btn onClick={() => { setLoadError(''); setAttempt(value => value + 1) }}>Thử lại</Btn></Panel>
  if (!content) return <p role="status">Đang tải {code}…</p>
  const option = dialog?.index != null ? scene?.options?.[dialog.index] : null
  const close = () => setDialog(null)
  return <>
    <EditorCanvas code={code} content={content} meta={meta} scenes={scenes} scene={scene} idx={idx} setIdx={setIdx}
      write={write} busy={busy} dirty={dirty} json={json}
      setJson={value => { setJson(value); setDirty(true) }} toggleJson={toggleJson} save={save} update={update} schemaQuery={schemaQuery}
      warnings={warnings} refreshError={refreshError} conditionDrafts={conditionDrafts} editCondition={editCondition} onSuggestVoice={suggestVoice}
      history={{ undo, redo, canUndo: history.past.length > 0, canRedo: history.future.length > 0 }} notice={notice} issues={storyIssues(scenes)}
      onAdd={() => setDialog({ kind: 'add' })} onDuplicate={duplicateScene} onDelete={deleteScene} onPickBackground={() => setPicking('background')}
      onAddCharacter={() => setDialog({ kind: 'character' })} onPlay={() => setDialog({ kind: 'play' })} openDialog={setDialog} onBranch={createBranch} onLaneEnd={addLaneEnd} onPickImage={apply => setPicking(() => apply)} />
    {voiceHints && <VoiceHints hints={voiceHints} scenes={scenes} write={write} onAccept={acceptHint} onDrop={dropHint} onOpen={id => go(id)} onClose={() => setVoiceHints(null)} />}
    {picking && <AssetPicker chapter={code} notify={notify} onClose={() => setPicking(false)} onPick={asset => {
      if (typeof picking === 'function') picking(asset.url)
      else if (picking === 'character') update({ characters: [...(scene.characters || []), { id: asset.label || 'NHAN_VAT', src: asset.url, position: 'center' }] })
      else update({ background: asset.url })
      setPicking(false)
    }} />}
    {dialog?.kind === 'add' && <AddSceneDialog schema={schemaQuery.data} linear={!scene || isLinear(scene)} number={idx + 1} onAdd={addScene} onClose={close} />}
    {dialog?.kind === 'target' && <ScenePickerDialog title={dialog.title} scenes={scenes} currentId={dialog.currentId} onClose={close} onPick={id => { dialog.apply(id); close() }} />}
    {dialog?.kind === 'effect' && option && <EffectDialog option={option} stats={stats} onClose={close} onSave={patch => { setOption(dialog.index, patch); close(); notify('Đã cập nhật ảnh hưởng của lựa chọn.', true) }} />}
    {dialog?.kind === 'lock' && option && <ConditionDialog title={`Khoá lựa chọn “${String(option.text || option.label || '').slice(0, 50)}”`} withReason value={option.condition} reason={option.lockedReason} scenes={scenes} stats={stats} contextId={scene.id}
      onClose={close} onRemove={() => { setOption(dialog.index, { condition: undefined, lockedReason: undefined }); close() }}
      onSave={(condition, lockedReason) => { setOption(dialog.index, { condition, lockedReason }); close(); notify('Đã khoá lựa chọn.', true) }} />}
    {dialog?.kind === 'condition' && <ConditionDialog title="Điều kiện rẽ nhánh" value={scene.condition} scenes={scenes} stats={stats} contextId={scene.id}
      onClose={close} onRemove={() => { update({ condition: { all: [] } }); close() }} onSave={condition => { update({ condition }); close() }} />}
    {dialog?.kind === 'character' && <CharacterDialog sprites={content.sprites} present={(scene.characters || []).map(item => item.id)} onClose={close}
      onLibrary={() => { close(); setPicking('character') }}
      onPick={(id, src, expression) => { const used = new Set((scene.characters || []).map(item => String(item.position).toLowerCase())); update({ characters: [...(scene.characters || []), { id, expression, src, position: ['center', 'right', 'left'].find(p => !used.has(p)) || 'right' }] }); close() }} />}
    {dialog?.kind === 'minigame' && <MinigameDialog game={scene.game} kind={schemaQuery.data?.minigameKinds?.[scene.game?.kind]} onClose={close}
      onPickImage={apply => setPicking(() => apply)} onSave={game => { update({ game }); close(); notify('Đã cập nhật mini-game.', true) }} />}
    {dialog?.kind === 'play' && <PlayDialog content={content} startIndex={idx} stats={stats} onClose={close} onEdit={index => { setIdx(index); close() }} />}
  </>
}
