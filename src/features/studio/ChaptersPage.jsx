// Danh sách nháp + vòng đời: gửi duyệt (Editor) → duyệt / trả về (Reviewer, không phải người sửa) → phát hành (tab Phát hành).
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { currentAccountId, fmtTime, hasRole, STATUS_LABEL, studioApi } from './studioClient'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'

const CLASS_HELP = 'PATCH = sửa lỗi · MINOR = thêm, bản cũ vẫn đúng · MAJOR = đổi cái đã dạy / thêm chương'

function ReviewBox({ draft, onDone, notify }) {
  const [pass, setPass] = useState(true)
  const [note, setNote] = useState('')
  const [cls, setCls] = useState('')
  const send = async () => {
    try {
      await studioApi.post(`/api/studio/chapters/${draft.code}/review`, { pass, note: note || null, changeClass: cls || null })
      notify(pass ? `Đã duyệt ${draft.code}` : `Đã trả về ${draft.code}`, true)
      onDone()
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md bg-slate-50 p-2">
      <select className={inputCls} value={pass ? 'y' : 'n'} onChange={(e) => setPass(e.target.value === 'y')}>
        <option value="y">Đạt</option>
        <option value="n">Trả về</option>
      </select>
      {pass && (
        <select className={inputCls} value={cls} onChange={(e) => setCls(e.target.value)} title={CLASS_HELP}>
          <option value="">Giữ loại {draft.changeClass}</option>
          <option>PATCH</option>
          <option>MINOR</option>
          <option>MAJOR</option>
        </select>
      )}
      <input className={`${inputCls} flex-1`} placeholder={pass ? 'Nhận xét (tuỳ chọn)' : 'Lý do trả về (bắt buộc)'} value={note} onChange={(e) => setNote(e.target.value)} />
      <Btn tone="primary" onClick={send} disabled={!pass && !note.trim()}>
        Gửi
      </Btn>
    </div>
  )
}

function SubmitBox({ draft, onDone, notify }) {
  const [cls, setCls] = useState('MINOR')
  const [note, setNote] = useState('')
  const send = async () => {
    try {
      await studioApi.post(`/api/studio/chapters/${draft.code}/submit`, { changeClass: cls, note })
      notify(`Đã gửi duyệt ${draft.code}`, true)
      onDone()
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md bg-slate-50 p-2">
      <select className={inputCls} value={cls} onChange={(e) => setCls(e.target.value)} title={CLASS_HELP}>
        <option>PATCH</option>
        <option>MINOR</option>
        <option>MAJOR</option>
      </select>
      <input className={`${inputCls} flex-1`} placeholder="Lý do sửa (tuỳ chọn)" value={note} onChange={(e) => setNote(e.target.value)} />
      <Btn tone="primary" onClick={send}>
        Gửi duyệt
      </Btn>
    </div>
  )
}

export default function ChaptersPage({ notify }) {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [open, setOpen] = useState(null) // {code, mode: 'submit' | 'review'}
  const [newCode, setNewCode] = useState('')
  const me = currentAccountId()

  const load = useCallback(async () => {
    try {
      setRows(await studioApi.get('/api/studio/chapters'))
    } catch (e) {
      notify(e.message)
    }
  }, [notify])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const done = () => {
    setOpen(null)
    void load()
  }

  const create = () => {
    // Nhận "4", "ch4", "CH04" → CH04 (CH4 và CH04 là hai chương khác nhau ở BE). Trống → chương kế tiếp.
    const taken = rows.map((r) => Number(r.code.slice(2)))
    const raw = (newCode.trim() || String(Math.max(0, ...taken) + 1)).toUpperCase().replace(/^CH/, '')
    if (!/^\d{1,2}$/.test(raw) || Number(raw) < 1) return notify('Mã chương dạng CH04 hoặc số 4')
    const code = 'CH' + raw.padStart(2, '0')
    if (taken.includes(Number(raw))) return notify(`${code} đã có — bấm "Mở" ở dòng đó`)
    navigate(`/studio/editor/${code}?new=1`)
  }

  const withdraw = async (code) => {
    try {
      await studioApi.post(`/api/studio/chapters/${code}/withdraw`)
      notify('Đã rút ' + code, true)
      void load()
    } catch (e) {
      notify(`${e.code ?? ''} ${e.message}`)
    }
  }

  return (
    <Panel
      title="Nháp mới nhất của từng chương"
      actions={
        <>
          <input className={`${inputCls} w-24`} placeholder="CH04" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
          <Btn tone="primary" onClick={create} disabled={!hasRole('ADMIN', 'GAME_EDITOR')}>
            + Chương mới
          </Btn>
          <Btn onClick={load}>Tải lại</Btn>
        </>
      }
    >
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-slate-500 uppercase">
          <tr>
            <th className="p-2">Chương</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Rev</th>
            <th className="p-2">Loại</th>
            <th className="p-2">Người sửa</th>
            <th className="p-2">Người duyệt / nhận xét</th>
            <th className="p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => {
            const mine = d.editorId && d.editorId === me
            return (
              <tr key={d.code} className="border-t border-slate-100 align-top">
                <td className="p-2">
                  <b>{d.code}</b>
                  <div className="text-xs text-slate-500">{d.title}</div>
                </td>
                <td className="p-2">
                  <Tag tone={d.status}>{STATUS_LABEL[d.status] || d.status}</Tag>
                </td>
                <td className="p-2">
                  {d.revision}
                  {d.reviewedRevision && <div className="text-xs text-slate-500">duyệt rev {d.reviewedRevision}</div>}
                </td>
                <td className="p-2">{d.changeClass}</td>
                <td className="p-2">
                  {d.editorName}
                  <div className="text-xs text-slate-500">{fmtTime(d.updatedAt)}</div>
                  {d.changeNote && <div className="text-xs text-slate-500">“{d.changeNote}”</div>}
                </td>
                <td className="p-2">
                  {d.reviewerName}
                  {d.reviewNote && <div className="text-xs text-slate-500">“{d.reviewNote}”</div>}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    <Btn onClick={() => navigate(`/studio/editor/${d.code}`)}>Mở</Btn>
                    {d.status === 'DRAFT' && hasRole('ADMIN', 'GAME_EDITOR') && (
                      <Btn tone="primary" onClick={() => setOpen({ code: d.code, mode: 'submit' })}>
                        Gửi duyệt
                      </Btn>
                    )}
                    {d.status === 'SUBMITTED' && mine && <Btn onClick={() => withdraw(d.code)}>Rút</Btn>}
                    {d.status === 'SUBMITTED' && hasRole('ADMIN', 'GAME_REVIEWER') && (
                      <Btn
                        tone="primary"
                        disabled={mine}
                        title={mine ? 'Không tự duyệt bản mình sửa (6002)' : ''}
                        onClick={() => setOpen({ code: d.code, mode: 'review' })}
                      >
                        Duyệt…
                      </Btn>
                    )}
                  </div>
                  {open?.code === d.code && open.mode === 'submit' && <SubmitBox draft={d} onDone={done} notify={notify} />}
                  {open?.code === d.code && open.mode === 'review' && <ReviewBox draft={d} onDone={done} notify={notify} />}
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="p-3 text-slate-500">
                Chưa có chương nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Panel>
  )
}
