// Adapted from feat/studio-demo, using the portal ACCOUNT session.
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../api/auth.api'
import { canEdit, canReview, canWithdraw } from './permissions'
import { fmtTime, STATUS_LABEL, studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'

export default function ChaptersPage({ notify, reviewOnly = false }) {
  const navigate = useNavigate()
  const actor = auth.getSnapshot().actor
  const loader = useCallback(() => studioApi.get('/api/studio/chapters'), [])
  const { data, loading, error, reload } = useStudioResource(loader)
  const { busy, run, error: actionError, clearError } = useStudioAction(notify)
  const [newCode, setNewCode] = useState('')
  const [pending, setPending] = useState(null)
  const [note, setNote] = useState('')
  const [changeClass, setChangeClass] = useState('MINOR')
  const rows = (data || []).filter(draft => !reviewOnly || draft.status === 'SUBMITTED')
  const open = (draft, action) => { clearError(); setPending({ draft, action }); setNote(''); setChangeClass(draft.changeClass || 'MINOR') }
  const send = event => {
    event.preventDefault()
    const { draft, action } = pending
    const body = action === 'submit' ? { changeClass, note: note.trim() } : { pass: action === 'approve', changeClass, note: note.trim() }
    void run(() => studioApi.post(`/api/studio/chapters/${encodeURIComponent(draft.code)}/${action === 'submit' ? 'submit' : 'review'}`, body), 'Đã cập nhật trạng thái chương.', () => { setPending(null); reload() })
  }
  const create = () => {
    const raw = newCode.trim().toUpperCase().replace(/^CH/, '')
    if (!/^\d{1,2}$/.test(raw) || +raw < 1) return notify('Nhập mã chương dạng CH04 hoặc số 4.')
    const code = `CH${raw.padStart(2, '0')}`
    if (data?.some(draft => draft.code === code)) return notify(`${code} đã có. Hãy mở chương trong danh sách.`)
    navigate(`/internal/editor/${code}?new=1`)
  }
  return <>
    <Panel title={reviewOnly ? 'Chương đang chờ duyệt' : 'Nháp mới nhất của từng chương'} actions={<>
      {canEdit(actor) && <><input className={`${inputCls} w-24`} aria-label="Mã chương mới" placeholder="CH04" value={newCode} onChange={event => setNewCode(event.target.value)} /><Btn disabled={loading || busy || !!error} tone="primary" onClick={create}>+ Chương mới</Btn></>}
      <Btn onClick={reload} disabled={loading || busy}>Tải lại</Btn>
    </>}>
      {loading && <p role="status">Đang tải chương…</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!loading && !error && <table className="w-full text-sm"><thead><tr>{['Chương', 'Trạng thái', 'Revision / Loại', 'Người sửa', 'Người duyệt / nhận xét', 'Thao tác'].map(label => <th key={label} className="p-2 text-left text-xs text-slate-500">{label}</th>)}</tr></thead>
        <tbody>{rows.map(draft => <tr key={draft.code} className="border-t border-slate-100 align-top">
          <td className="p-2"><strong>{draft.code}</strong><div>{draft.title}</div></td>
          <td className="p-2"><Tag tone={draft.status}>{STATUS_LABEL[draft.status] || draft.status}</Tag></td>
          <td className="p-2">{draft.revision} · {draft.changeClass}<small className="block">Đã duyệt rev {draft.reviewedRevision ?? '—'}</small></td>
          <td className="p-2">{draft.editorName}<small className="block">{fmtTime(draft.updatedAt)}</small><p>{draft.changeNote}</p></td>
          <td className="p-2">{draft.reviewerName}<p>{draft.reviewNote}</p></td>
          <td className="p-2"><div className="flex flex-wrap gap-2">
            <Btn disabled={busy} onClick={() => navigate(`/internal/editor/${encodeURIComponent(draft.code)}`)}>Xem / Chơi thử</Btn>
            {canEdit(actor) && draft.status === 'DRAFT' && <Btn disabled={busy} onClick={() => open(draft, 'submit')}>Gửi duyệt</Btn>}
            {canWithdraw(actor, draft) && <Btn disabled={busy} onClick={() => void run(() => studioApi.post(`/api/studio/chapters/${encodeURIComponent(draft.code)}/withdraw`), 'Đã rút nháp khỏi hàng chờ duyệt.', reload)}>Rút nháp</Btn>}
            {canReview(actor, draft) && <><Btn disabled={busy} tone="primary" onClick={() => open(draft, 'approve')}>Đạt</Btn><Btn disabled={busy} tone="danger" onClick={() => open(draft, 'reject')}>Trả về</Btn></>}
            {draft.status === 'SUBMITTED' && draft.editorId === actor?.id && <small>Không tự duyệt bản mình sửa.</small>}
          </div></td>
        </tr>)}{!rows.length && <tr><td colSpan={6} className="p-4 text-slate-500">{reviewOnly ? 'Không có chương đang chờ duyệt.' : 'Chưa có bản nháp.'}</td></tr>}</tbody>
      </table>}
    </Panel>
    {pending && <Panel title={`${pending.action === 'submit' ? 'Gửi duyệt' : pending.action === 'approve' ? 'Duyệt đạt' : 'Trả về'} ${pending.draft.code}`}>
      {actionError && <div className="studio-submit-error" role="alert"><strong>{pending.action === 'submit' ? 'Chưa thể gửi duyệt' : 'Chưa thể đánh giá'}</strong><p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{actionError}</p>{pending.action === 'submit' && <Btn onClick={() => navigate(`/internal/editor/${encodeURIComponent(pending.draft.code)}`)}>Mở nháp để sửa</Btn>}</div>}
      <form onSubmit={send} className="grid gap-3"><fieldset disabled={busy} className="grid gap-3">
        <label>Loại thay đổi<select className={inputCls} value={changeClass} onChange={event => setChangeClass(event.target.value)}>{['PATCH', 'MINOR', 'MAJOR'].map(value => <option key={value}>{value}</option>)}</select></label>
        <p className="text-xs text-slate-500">PATCH: sửa lỗi · MINOR: bổ sung · MAJOR: thay đổi nội dung đã dạy hoặc thêm chương.</p>
        <label>Ghi chú {pending.action !== 'submit' && '(bắt buộc)'}<textarea required={pending.action !== 'submit'} className={`${inputCls} w-full`} value={note} onChange={event => setNote(event.target.value)} /></label>
        <div className="flex gap-2"><Btn type="submit" disabled={busy || (pending.action !== 'submit' && !note.trim())} tone="primary">{busy ? 'Đang xử lý…' : 'Xác nhận'}</Btn><Btn disabled={busy} onClick={() => setPending(null)}>Hủy</Btn></div>
      </fieldset></form>
    </Panel>}
  </>
}
