// Phát hành (kế hoạch bản sắp ra) và Lịch sử bản (chọn bản đang chạy, thu hồi).
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, History, PackageCheck, Radio } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { canManage, canPublish } from './permissions'
import { CHANGE_CLASS, fmtTime, studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { Btn, ConfirmDialog, PageHeader, Panel, StateBox, Tag } from './ui'

const chapterName = draft => `Chương ${draft.chapterNumber ?? Number(draft.code?.slice(2))}`
const changeLabel = value => CHANGE_CLASS[value]?.label

function PlanView({ actor, notify, title, intro }) {
  const loader = useCallback(() => studioApi.get('/api/studio/releases/next'), [])
  const query = useStudioResource(loader)
  const { busy, run, error: actionError, clearError } = useStudioAction(notify)
  const [note, setNote] = useState('')
  const [confirming, setConfirming] = useState(false)
  const plan = query.data
  const head = <PageHeader title={title} intro={intro} />
  if (query.loading && !plan) return <>{head}<StateBox kind="loading">Đang xem chương nào sẵn sàng phát hành…</StateBox></>
  if (query.error) {
    const running = /bản đang chạy ([\d.]+)/.exec(query.error)?.[1]
    return <>{head}{query.errorCode === 6005
      ? <StateBox title="Chưa có chương nào đã duyệt để phát hành" actions={<Link className="sp-btn" to="/internal/chapters">Xem danh sách chương</Link>}>Khi người duyệt chấm Đạt một chương, chương đó sẽ hiện ở đây để bạn đưa vào game.</StateBox>
      : query.errorCode === 6006
        ? <StateBox title="Chưa phát hành được: game đang dùng một bản cũ" actions={<Link className="sp-btn is-primary" to="/internal/history">Mở Lịch sử bản</Link>}>
          Game đang chạy bản {running || 'cũ'}, không phải bản mới nhất (có người đã chuyển về bản cũ). Muốn phát hành tiếp, vào Lịch sử bản: dùng lại bản mới nhất, hoặc thu hồi bản đó nếu nó có lỗi.</StateBox>
        : <StateBox kind="error" title={query.errorCode === 6007 ? 'Bạn không phát hành được bản này' : 'Chưa tải được kế hoạch phát hành'} actions={<Btn onClick={query.reload}>Thử lại</Btn>}>{query.error}</StateBox>}</>
  }
  const allowed = canPublish(actor, plan)
  const ownDrafts = plan.drafts?.filter(draft => draft.editorId === actor?.id) || []
  const publish = () => void run(() => studioApi.post('/api/studio/releases', { note: note.trim() }), result => `Đã phát hành bản ${result?.version || plan.version}.`, () => { setConfirming(false); setNote(''); query.reload() })
  return <>
    {head}
    <div className="sp-release-plan">
      <Panel title="Bản sẽ phát hành">
        <div className="sp-versions">
          <div className="sp-version"><span>Game đang chạy</span><strong>{plan.currentVersion || 'Chưa có'}</strong></div>
          <ArrowRight size={22} aria-hidden="true" />
          <div className="sp-version is-next"><span>Sau khi phát hành</span><strong>{plan.version}</strong></div>
          {changeLabel(plan.changeClass) && <Tag tone="info">{changeLabel(plan.changeClass)}</Tag>}
        </div>
        <ul className="sp-plan-list" aria-label="Chương sẽ vào bản này">{plan.drafts?.map(draft => <li key={draft.code}>
          <strong>{chapterName(draft)}: {draft.title}</strong><span>{draft.reviewerName || 'Người duyệt'} chấm Đạt, bản nháp số {draft.revision}</span>
        </li>)}</ul>
        <p className="sp-hint" style={{ marginTop: 12 }}>Các chương khác giữ nguyên như bản {plan.currentVersion || 'hiện tại'}. Số bản do hệ thống tự tính theo mức thay đổi lớn nhất.</p>
      </Panel>
      <Panel title="Phát hành">
        {canManage(actor) ? <div className="sp-dialog-body">
          <label className="sp-field">Ghi chú cho bản này<small>Không bắt buộc. Ví dụ: thêm chương 6, sửa lỗi chính tả chương 4.</small>
            <textarea className="sp-input" value={note} disabled={busy} onChange={event => setNote(event.target.value)} /></label>
          {!allowed && <div className="sp-inline-error" role="note">{ownDrafts.length ? `Bạn đã sửa ${ownDrafts.map(chapterName).join(', ')} nên cần một người phát hành khác.` : 'Bản này chưa đủ điều kiện phát hành.'}</div>}
          <Btn tone="primary" disabled={busy || !allowed} onClick={() => { clearError(); setConfirming(true) }}>Phát hành bản {plan.version}</Btn>
        </div> : <p className="sp-hint">Chỉ người phát hành mới đưa được bản này vào game.</p>}
      </Panel>
    </div>
    {confirming && <ConfirmDialog title={`Phát hành bản ${plan.version}?`} confirmLabel={`Phát hành ${plan.version}`} busy={busy} error={actionError} onConfirm={publish} onClose={() => setConfirming(false)}>
      Sau khi bấm phát hành:
      <ul>
        <li>Người chơi mở game từ bây giờ sẽ nhận bản {plan.version}, gồm {plan.drafts?.map(chapterName).join(', ')} mới.</li>
        <li>Trẻ đang chơi dở vẫn chơi hết chương đó trên bản cũ.</li>
        {plan.currentVersion && <li>Bản {plan.currentVersion} vẫn được giữ; có thể quay lại trong Lịch sử bản.</li>}
      </ul>
    </ConfirmDialog>}
  </>
}

function HistoryView({ actor, notify, title, intro }) {
  const loader = useCallback(() => studioApi.get('/api/studio/releases'), [])
  const query = useStudioResource(loader)
  const { busy, run, error: actionError, clearError } = useStudioAction(notify)
  const [pending, setPending] = useState(null)
  const [reason, setReason] = useState('')
  const rows = query.data || []
  const current = rows.find(release => release.current)
  const newest = rows.find(release => !release.recalledAt)
  const manage = canManage(actor)
  // Thu hồi lùi về bản cũ hơn gần nhất chưa bị thu hồi (đúng luật BE).
  const fallbackOf = version => rows.slice(rows.findIndex(release => release.version === version) + 1).find(release => !release.recalledAt)
  const open = (action, release) => { clearError(); setReason(''); setPending({ action, release }) }
  const confirm = () => {
    const { action, release } = pending
    const path = `/api/studio/releases/${encodeURIComponent(release.version)}/${action}`
    void run(() => studioApi.post(path, action === 'recall' ? { reason: reason.trim() } : undefined),
      action === 'recall' ? `Đã thu hồi bản ${release.version}.` : `Game đã chuyển sang bản ${release.version}.`, () => { setPending(null); query.reload() })
  }
  const fallback = pending?.action === 'recall' ? fallbackOf(pending.release.version) : null
  return <>
    <PageHeader title={title} intro={intro} />
    {query.loading && !query.data ? <StateBox kind="loading">Đang tải các bản đã phát hành…</StateBox>
      : query.error ? <StateBox kind="error" title="Chưa tải được lịch sử bản" actions={<Btn onClick={query.reload}>Thử lại</Btn>}>{query.error}</StateBox>
      : !rows.length ? <StateBox title="Chưa phát hành bản nào" actions={manage && <Link className="sp-btn" to="/internal/releases">Mở màn phát hành</Link>}>Bản đầu tiên sẽ là 1.0.0, khi có chương được duyệt và phát hành.</StateBox>
      : <>
        <section className="sp-history-overview" aria-label="Tổng quan phiên bản">
          <div className="is-current"><Radio size={19} aria-hidden="true" /><span><small>Đang chạy</small><strong>{current?.version || '—'}</strong></span></div>
          <div><PackageCheck size={19} aria-hidden="true" /><span><small>Mới nhất</small><strong>{newest?.version || '—'}</strong></span></div>
          <div><History size={19} aria-hidden="true" /><span><small>Tổng phiên bản</small><strong>{rows.length}</strong></span></div>
        </section>
        {current && newest && current.version !== newest.version && <div className="sp-consequence" style={{ marginBottom: 16 }}>
          Game đang dùng bản {current.version}, cũ hơn bản mới nhất {newest.version}. Trong lúc này chưa phát hành bản mới được. {manage && `Dùng lại ${newest.version}, hoặc thu hồi ${newest.version} nếu bản đó có lỗi.`}
        </div>}
        <ul className="sp-releases sp-release-timeline" aria-label="Các bản đã phát hành">{rows.map(release => <li key={release.version} className={`sp-release${release.current ? ' is-current' : ''}${release.recalledAt ? ' is-recalled' : ''}`}>
          <span className="sp-release-dot" aria-hidden="true" />
          <div className="sp-release-version"><small>Phiên bản</small>{release.version}</div>
          <div className="sp-release-main">
            <div className="sp-release-meta">
              {release.current && <Tag tone="APPROVED">Đang chạy</Tag>}
              {release.recalledAt && <Tag tone="REJECTED">Đã thu hồi {fmtTime(release.recalledAt)}</Tag>}
              {!release.current && !release.recalledAt && release === newest && <Tag tone="info">Mới nhất</Tag>}
              <span>Phát hành {fmtTime(release.releasedAt)}</span>
              {changeLabel(release.changeClass) && <span>{changeLabel(release.changeClass)}</span>}
            </div>
            {release.chapters?.length > 0 && <div className="sp-release-chapters">{release.chapters.map(draft => <span key={draft.code}>{chapterName(draft)}</span>)}</div>}
            {release.note && <p>{release.note}</p>}
            {release.recallReason && <p>Lý do thu hồi: {release.recallReason}</p>}
          </div>
          {manage && !release.recalledAt && <div className="sp-chapter-actions">
            {release.current ? <Btn tone="danger" disabled={busy} onClick={() => open('recall', release)}>Thu hồi bản này</Btn>
              : <Btn disabled={busy} onClick={() => open('current', release)}>Dùng bản này</Btn>}
          </div>}
        </li>)}</ul>
      </>}
    {pending?.action === 'current' && <ConfirmDialog title={`Chuyển game sang bản ${pending.release.version}?`} confirmLabel={`Chuyển sang ${pending.release.version}`} busy={busy} error={actionError} onConfirm={confirm} onClose={() => setPending(null)}>
      <ul>
        <li>Người chơi mở game từ bây giờ sẽ nhận bản {pending.release.version}{current ? ` thay cho ${current.version}` : ''}.</li>
        <li>Không có gì bị xoá; có thể chuyển lại bất cứ lúc nào.</li>
        {newest && pending.release.version !== newest.version && <li>Khi game dùng bản cũ hơn bản mới nhất ({newest.version}), chưa phát hành bản mới được.</li>}
      </ul>
    </ConfirmDialog>}
    {pending?.action === 'recall' && <ConfirmDialog tone="danger" title={`Thu hồi bản ${pending.release.version}?`} confirmLabel={`Thu hồi ${pending.release.version}`} busy={busy} error={actionError}
      disabled={!fallback || !reason.trim()} onConfirm={confirm} onClose={() => setPending(null)}
      fields={fallback && <label className="sp-field">Lý do thu hồi<small>Bắt buộc. Ghi lỗi gặp phải để cả nhóm biết.</small>
        <textarea className="sp-input" required value={reason} disabled={busy} onChange={event => setReason(event.target.value)} /></label>}>
      {fallback ? <ul>
        <li>Game quay về bản {fallback.version}.</li>
        <li>Bản {pending.release.version} bị đánh dấu thu hồi và không dùng lại được nữa.</li>
        <li>Trẻ đang chơi dở trên bản này vẫn nộp kết quả được.</li>
      </ul> : 'Không còn bản cũ hơn để quay về. Hãy sửa lỗi rồi phát hành bản mới thay vì thu hồi.'}
    </ConfirmDialog>}
  </>
}

export default function ReleasesPage({ notify, mode = 'plan', title, intro }) {
  const actor = auth.getSnapshot().actor
  const props = { actor, notify, title: title || (mode === 'plan' ? 'Phát hành' : 'Lịch sử bản'), intro }
  return mode === 'plan' ? <PlanView {...props} /> : <HistoryView {...props} />
}
