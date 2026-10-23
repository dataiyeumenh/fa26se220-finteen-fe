// Soạn chương + chơi thử (bản demo). Nội dung đúng hình dạng chapterNV2GameData; GET …/draft trả URL ảnh thật, lưu lại
// nguyên vậy BE tự đổi về {{ASSET_BASE}}. Sửa nhanh các trường hay đổi; trường khác sửa ở chế độ JSON.
import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { hasRole, STATUS_LABEL, studioApi } from './studioClient'
import { AssetPicker } from './AssetsPage'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'

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
        <button type="button" className="rounded bg-white px-3 py-1.5 text-slate-800" onClick={() => go(scene.onFailSceneId || scene.nextSceneId)}>
          Giả lập: trượt
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

export default function EditorPage({ notify }) {
  const { code } = useParams()
  const [search] = useSearchParams()
  const [meta, setMeta] = useState(null)
  const [content, setContent] = useState(null)
  const [idx, setIdx] = useState(0)
  const [json, setJson] = useState(null) // chuỗi khi đang ở chế độ JSON
  const [picking, setPicking] = useState(false)

  const load = useCallback(async () => {
    if (search.get('new')) {
      setMeta({ status: 'MỚI', revision: 0 })
      setContent(template(code))
      return
    }
    try {
      const r = await studioApi.get(`/api/studio/chapters/${code}/draft`)
      setMeta(r.draft)
      setContent(r.content)
      setIdx(0)
    } catch (e) {
      notify(e.message)
    }
  }, [code, search, notify])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  if (!content) return <p>Đang tải {code}…</p>
  const scenes = content.scenes || []
  const scene = scenes[idx] || scenes[0]
  const ids = scenes.map((s) => s.id)
  const update = (patch) => setContent({ ...content, scenes: scenes.map((s, i) => (i === idx ? { ...s, ...patch } : s)) })
  const go = (id) => {
    const i = ids.indexOf(id)
    if (i < 0) notify(`Cảnh "${id}" không tồn tại`)
    else setIdx(i)
  }

  const save = async () => {
    let body = content
    if (json !== null) {
      try {
        body = JSON.parse(json)
      } catch (e) {
        return notify('JSON sai: ' + e.message)
      }
    }
    try {
      await studioApi.put(`/api/studio/chapters/${code}/draft`, body)
      notify('Đã lưu nháp ' + code, true)
      setJson(null)
      const r = await studioApi.get(`/api/studio/chapters/${code}/draft`)
      setMeta(r.draft)
      setContent(r.content)
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }

  const addScene = () => {
    const id = window.prompt('Id cảnh mới', `${code}_SC${String(scenes.length + 1).padStart(2, '0')}`)
    if (!id) return
    const prev = scenes[idx]
    const copy = scenes.map((s) => ({ ...s }))
    if (prev && prev.type !== 'choice' && 'nextSceneId' in prev) copy[idx].nextSceneId = id
    copy.splice(idx + 1, 0, { id, type: 'dialogue', title: '', background: prev?.background || '', characters: [], speaker: '', text: '', nextSceneId: prev?.nextSceneId ?? null })
    setContent({ ...content, scenes: copy })
    setIdx(idx + 1)
  }

  const sceneSelect = (value, onChange) => (
    <select className={`${inputCls} w-full`} value={value || ''} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">(không)</option>
      {ids.map((i) => (
        <option key={i}>{i}</option>
      ))}
    </select>
  )

  return (
    <>
      <Panel
        title={`${code} — ${content.title || ''}`}
        actions={
          <>
            <Btn onClick={() => setJson(json === null ? JSON.stringify(content, null, 2) : null)}>{json === null ? 'JSON' : 'Theo cảnh'}</Btn>
            <Btn tone="primary" onClick={save} disabled={!hasRole('ADMIN', 'GAME_EDITOR')}>
              Lưu nháp
            </Btn>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          Trạng thái <Tag tone={meta?.status}>{STATUS_LABEL[meta?.status] || meta?.status}</Tag> · rev {meta?.revision} · {scenes.length} cảnh
          {meta?.status === 'SUBMITTED' && ' · đang chờ duyệt — rút lại rồi mới lưu được (6003)'}
          {meta?.status === 'RELEASED' && ` · lưu sẽ mở nháp mới (rev ${meta.revision + 1})`}
        </p>
      </Panel>
      {json !== null ? (
        <Panel>
          <textarea className="h-[70vh] w-full rounded-md border border-slate-300 p-2 font-mono text-xs" value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} />
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-[320px_1fr]">
          <Panel title="Cảnh" actions={<Btn onClick={addScene}>+ Cảnh thoại</Btn>}>
            <div className="flex max-h-[70vh] flex-col gap-1 overflow-auto">
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`rounded-md border px-2 py-1.5 text-left text-sm ${i === idx ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
                >
                  <span className="text-xs text-slate-500">{s.type}</span> {s.id}
                  <div className="truncate">{s.title || s.text}</div>
                </button>
              ))}
            </div>
          </Panel>
          <Panel>
            <Stage scene={scene} go={go} />
            <div className="mt-3 grid gap-2 text-sm">
              <label className="text-xs text-slate-500">Tiêu đề cảnh</label>
              <input className={inputCls} value={scene.title || ''} onChange={(e) => update({ title: e.target.value })} />
              <label className="text-xs text-slate-500">Người nói</label>
              <input className={inputCls} value={scene.speaker || ''} onChange={(e) => update({ speaker: e.target.value })} />
              <label className="text-xs text-slate-500">Lời thoại</label>
              <textarea className={inputCls} rows={3} value={scene.text || ''} onChange={(e) => update({ text: e.target.value })} />
              <label className="text-xs text-slate-500">Ảnh nền</label>
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} value={scene.background || ''} onChange={(e) => update({ background: e.target.value })} />
                <Btn onClick={() => setPicking(true)}>Chọn từ kho</Btn>
              </div>
              {scene.type === 'choice' &&
                (scene.options || []).map((o, i) => (
                  <div key={o.id || i} className="flex items-center gap-2">
                    <input
                      className={`${inputCls} flex-1`}
                      value={o.text || ''}
                      onChange={(e) => update({ options: scene.options.map((x, j) => (j === i ? { ...x, text: e.target.value, ...(x.label !== undefined ? { label: e.target.value } : {}) } : x)) })}
                    />
                    →
                    <div className="w-48">{sceneSelect(o.nextSceneId, (v) => update({ options: scene.options.map((x, j) => (j === i ? { ...x, nextSceneId: v } : x)) }))}</div>
                  </div>
                ))}
              {scene.type !== 'choice' && scene.type !== 'ending' && (
                <>
                  <label className="text-xs text-slate-500">Cảnh kế tiếp</label>
                  {sceneSelect(scene.nextSceneId, (v) => update({ nextSceneId: v }))}
                </>
              )}
              <div>
                <Btn
                  tone="danger"
                  onClick={() => {
                    if (!window.confirm(`Xoá cảnh ${scene.id}? Cảnh khác trỏ tới nó sẽ báo lỗi khi lưu.`)) return
                    setContent({ ...content, scenes: scenes.filter((_, i) => i !== idx) })
                    setIdx(Math.max(0, idx - 1))
                  }}
                >
                  Xoá cảnh
                </Btn>
              </div>
            </div>
          </Panel>
        </div>
      )}
      {picking && (
        <AssetPicker
          chapter={code}
          notify={notify}
          onClose={() => setPicking(false)}
          onPick={(a) => {
            update({ background: a.url })
            setPicking(false)
          }}
        />
      )}
    </>
  )
}
