// Release plan and version operations adapted from feat/studio-demo.
import { useCallback, useState } from 'react'
import { auth } from '../../api/auth.api'
import { canManage, canPublish } from './permissions'
import { fmtTime, studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'

export default function ReleasesPage({ notify, mode = 'plan' }) {
  const actor = auth.getSnapshot().actor
  const planLoader = useCallback(() => mode === 'plan' ? studioApi.get('/api/studio/releases/next') : Promise.resolve(null), [mode])
  const rowsLoader = useCallback(() => mode === 'history' ? studioApi.get('/api/studio/releases') : Promise.resolve([]), [mode])
  const planQuery = useStudioResource(planLoader)
  const rowsQuery = useStudioResource(rowsLoader)
  const { busy, run } = useStudioAction(notify)
  const [note, setNote] = useState('')
  const [pending, setPending] = useState(null)
  const [reason, setReason] = useState('')
  const plan = planQuery.data
  const reload = () => { planQuery.reload(); rowsQuery.reload() }
  const confirm = event => {
    event.preventDefault()
    const { action, version } = pending
    const path = action === 'publish' ? '/api/studio/releases' : `/api/studio/releases/${encodeURIComponent(version)}/${action}`
    // Version is calculated by the backend. Do not reuse a stale preview as input.
    const body = action === 'publish' ? { note: note.trim() } : action === 'recall' ? { reason: reason.trim() } : undefined
    void run(() => studioApi.post(path, body), 'Đã cập nhật bản phát hành.', () => { setPending(null); setNote(''); setReason(''); reload() })
  }
  return <>
    {mode === 'plan' && <Panel title="Bản sắp phát hành" actions={<Btn disabled={busy || planQuery.loading || rowsQuery.loading} onClick={reload}>Tải lại</Btn>}>
      {planQuery.loading ? <p role="status">Đang tính kế hoạch…</p> : planQuery.error ? <p role="alert" className="text-red-700">{planQuery.error}</p> : plan && <>
        <p>Phiên bản dự kiến <strong>{plan.version}</strong> · {plan.changeClass} · Bản hiện tại: {plan.currentVersion || 'Chưa có'}</p>
        <ul className="my-3 list-disc pl-5">{plan.drafts?.map(draft => <li key={draft.code}>{draft.code} · revision {draft.revision} · duyệt bởi {draft.reviewerName || '—'}</li>)}</ul>
        {canManage(actor) && <><label>Ghi chú phát hành<input className={`${inputCls} my-2 w-full`} value={note} onChange={event => setNote(event.target.value)} /></label><Btn tone="primary" disabled={busy || !canPublish(actor, plan)} onClick={() => setPending({ action: 'publish', version: plan.version })}>Phát hành</Btn>
          {!canPublish(actor, plan) && <p className="mt-2 text-sm text-amber-800">Cần nháp đã duyệt do người khác biên tập. Không được tự phát hành bản mình sửa.</p>}</>}
      </>}
    </Panel>}
    {mode === 'history' && <Panel title="Lịch sử phát hành" actions={<Btn disabled={busy || rowsQuery.loading} onClick={reload}>Tải lại</Btn>}>
      {rowsQuery.loading ? <p role="status">Đang tải lịch sử…</p> : rowsQuery.error ? <p role="alert" className="text-red-700">{rowsQuery.error}</p> : <table className="w-full text-sm"><thead><tr>{['Phiên bản', 'Thời gian / Loại', 'Chương', 'Ghi chú', 'Trạng thái', 'Thao tác'].map(label => <th className="p-2 text-left" key={label}>{label}</th>)}</tr></thead><tbody>
        {(rowsQuery.data || []).map(release => <tr key={release.version} className="border-t border-slate-100"><td className="p-2">{release.version}</td><td className="p-2">{fmtTime(release.releasedAt)}<small className="block">{release.changeClass}</small></td><td className="p-2">{release.chapters?.map(chapter => chapter.code).join(', ')}</td><td className="p-2">{release.note}</td><td className="p-2">{release.current && <Tag tone="APPROVED">Đang chạy</Tag>}{release.recalledAt && <Tag tone="REJECTED">Thu hồi {fmtTime(release.recalledAt)}</Tag>}</td><td className="p-2">
          {canManage(actor) && !release.recalledAt && <Btn disabled={busy} tone={release.current ? 'danger' : 'plain'} onClick={() => { setReason(''); setPending({ action: release.current ? 'recall' : 'current', version: release.version }) }}>{release.current ? 'Thu hồi' : 'Đặt làm hiện tại'}</Btn>}
        </td></tr>)}{!rowsQuery.data?.length && <tr><td className="p-4" colSpan={6}>Chưa có bản phát hành.</td></tr>}
      </tbody></table>}
    </Panel>}
    {pending && <Panel title={`Xác nhận ${pending.action === 'publish' ? 'phát hành' : pending.action === 'recall' ? 'thu hồi' : 'đổi bản đang chạy'} ${pending.version}`}>
      <form onSubmit={confirm}><fieldset disabled={busy} className="grid gap-3"><p>Thao tác sẽ cập nhật nội dung đang phục vụ người dùng.</p>
        {pending.action === 'recall' && <label>Lý do thu hồi<textarea className={`${inputCls} w-full`} required value={reason} onChange={event => setReason(event.target.value)} /></label>}
        <div className="flex gap-2"><Btn tone="primary" type="submit" disabled={busy || (pending.action === 'recall' && !reason.trim())}>Xác nhận</Btn><Btn disabled={busy} onClick={() => setPending(null)}>Hủy</Btn></div>
      </fieldset></form>
    </Panel>}
  </>
}
