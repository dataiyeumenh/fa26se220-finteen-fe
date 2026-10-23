// Kho câu hỏi trong Studio (BE quiz.md mục "Kho câu hỏi trong Studio"). Reviewer chỉ xem.
import { useCallback, useEffect, useState } from 'react'
import { hasRole, studioApi } from './studioClient'
import { Btn, Panel } from './ui'
import { inputCls } from './styles'

function QuestionForm({ q, onClose, onSaved, notify }) {
  const [f, setF] = useState(() => q || { pool: 'CEE', stem: '', options: ['', '', '', ''], correctIndex: 0, chapter: '', standard: '', concept: '' })
  const save = async () => {
    const body = {
      externalId: f.externalId || null,
      pool: f.pool,
      stem: f.stem,
      options: f.options,
      correctIndex: Number(f.correctIndex),
      standard: f.standard || null,
      concept: f.concept || null,
      source: f.source || null,
      license: f.license || null,
      chapter: f.chapter ? Number(f.chapter) : null,
      replacesId: null,
    }
    try {
      await (q?.id ? studioApi.put(`/api/studio/questions/${q.id}`, body) : studioApi.post('/api/studio/questions', body))
      notify('Đã lưu câu hỏi', true)
      onSaved()
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }
  return (
    <Panel title={q?.id ? `Sửa câu ${q.externalId}` : 'Câu mới'} actions={<Btn onClick={onClose}>Đóng</Btn>}>
      <textarea className={`${inputCls} mb-2 w-full`} rows={2} placeholder="Câu hỏi" value={f.stem} onChange={(e) => setF({ ...f, stem: e.target.value })} />
      {f.options.map((o, i) => (
        <label key={i} className="mb-1 flex items-center gap-2 text-sm">
          <input type="radio" checked={Number(f.correctIndex) === i} onChange={() => setF({ ...f, correctIndex: i })} />
          <input className={`${inputCls} flex-1`} value={o} onChange={(e) => setF({ ...f, options: f.options.map((x, j) => (j === i ? e.target.value : x)) })} />
        </label>
      ))}
      <div className="mt-2 flex flex-wrap gap-2">
        {['pool', 'chapter', 'standard', 'concept'].map((k) => (
          <input key={k} className={inputCls} placeholder={k} value={f[k] ?? ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
        ))}
        <Btn tone="primary" onClick={save}>
          Lưu
        </Btn>
      </div>
      <p className="mt-2 text-xs text-slate-500">Câu đã nằm trong đề đã phát chỉ sửa được nhãn (8009) — muốn đổi nội dung thì tạo câu mới thay câu cũ.</p>
    </Panel>
  )
}

export default function QuestionsPage({ notify }) {
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [retired, setRetired] = useState(false)
  const [editing, setEditing] = useState(undefined)
  const write = hasRole('ADMIN', 'GAME_EDITOR', 'GAME_MANAGER')

  const load = useCallback(async () => {
    try {
      setRows(await studioApi.get(`/api/studio/questions?${new URLSearchParams({ q, includeRetired: retired })}`))
    } catch (e) {
      notify(e.message)
    }
  }, [q, retired, notify])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const act = async (id, action) => {
    try {
      await studioApi.post(`/api/studio/questions/${id}/${action}`)
      notify('Xong', true)
      void load()
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }

  return (
    <>
      {editing !== undefined && (
        <QuestionForm
          q={editing}
          notify={notify}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined)
            void load()
          }}
        />
      )}
      <Panel
        title="Kho câu hỏi"
        actions={
          <>
            <input className={inputCls} placeholder="tìm chữ…" value={q} onChange={(e) => setQ(e.target.value)} />
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={retired} onChange={(e) => setRetired(e.target.checked)} /> cả câu đã rút
            </label>
            {write && (
              <Btn tone="primary" onClick={() => setEditing(null)}>
                + Câu mới
              </Btn>
            )}
          </>
        }
      >
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-slate-500 uppercase">
            <tr>
              <th className="p-2">Mã</th>
              <th className="p-2">Câu hỏi</th>
              <th className="p-2">Đáp án</th>
              <th className="p-2">Nhãn</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 200).map((x) => (
              <tr key={x.id} className={`border-t border-slate-100 align-top ${x.retiredAt ? 'opacity-50' : ''}`}>
                <td className="p-2">
                  {x.externalId}
                  <div className="text-xs text-slate-500">
                    {x.pool}
                    {x.chapter ? ` · CH${x.chapter}` : ''}
                  </div>
                </td>
                <td className="p-2">
                  {x.stem}
                  <ol className="ml-5 list-decimal text-xs text-slate-500">
                    {x.options.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ol>
                </td>
                <td className="p-2">{x.correctIndex + 1}</td>
                <td className="p-2 text-xs text-slate-500">
                  {x.standard} {x.concept}
                </td>
                <td className="p-2">
                  {write && (
                    <div className="flex gap-1">
                      <Btn onClick={() => setEditing(x)}>Sửa</Btn>
                      {x.retiredAt ? <Btn onClick={() => act(x.id, 'restore')}>Đưa lại</Btn> : <Btn tone="danger" onClick={() => act(x.id, 'retire')}>Rút</Btn>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  )
}
