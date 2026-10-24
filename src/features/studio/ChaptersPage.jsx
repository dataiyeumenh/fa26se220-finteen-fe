// Danh sách chương + gửi duyệt / chấm Đạt / Trả về. Cũng là màn "Chờ duyệt" khi reviewOnly.
import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { canEdit, canWithdraw } from './permissions'
import { CHANGE_CLASS, STATUS_LABEL, studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { TURN_LABEL, reviewedNote, statusLine, stepOf, turnOf } from './chapterWork'
import { Btn, PageHeader, StateBox, StudioDialog } from './ui'

const STEPS = ['Đang soạn', 'Chờ duyệt', 'Đã duyệt', 'Đã phát hành']
const numberOf = draft => draft.chapterNumber ?? Number(draft.code.slice(2))
const editorPath = code => `/internal/editor/${encodeURIComponent(code)}`

function Track({ status }) {
  const now = stepOf(status)
  const tone = status === 'REJECTED' ? ' is-bad' : status === 'SUBMITTED' ? ' is-wait' : status === 'RELEASED' ? ' is-ship' : ''
  return <ol className="sp-track" aria-label={`Bước ${now + 1} trên 4: ${STATUS_LABEL[status] || status}`}>
    {STEPS.map((step, index) => <li key={step} className={index < now ? 'done' : index === now ? `now${tone}` : undefined} aria-current={index === now ? 'step' : undefined}>
      <i aria-hidden="true" />{index === now && status === 'REJECTED' ? 'Bị trả về' : step}
    </li>)}
  </ol>
}

function ChapterRow({ draft, actor, busy, onAction, onWithdraw }) {
  const turn = turnOf(actor, draft)
  const readOnly = !canEdit(actor) || draft.status === 'SUBMITTED'
  const ownWaiting = draft.status === 'SUBMITTED' && draft.editorId === actor?.id
  const quote = draft.status === 'REJECTED' ? draft.reviewNote : draft.status === 'SUBMITTED' ? draft.changeNote : ['APPROVED', 'RELEASED'].includes(draft.status) ? draft.reviewNote : ''
  const quoteLabel = draft.status === 'SUBMITTED' ? 'Người soạn ghi' : draft.status === 'REJECTED' ? 'Góp ý' : 'Nhận xét'
  const reviewed = reviewedNote(draft)
  return <li className={`sp-chapter${turn ? ' is-mine' : ''}`}>
    <div className="sp-chapter-no"><small>Chương</small>{String(numberOf(draft)).padStart(2, '0')}</div>
    <div className="sp-chapter-main">
      <div className="sp-chapter-title"><h3>{draft.title || draft.code}</h3>{turn && <span className="sp-turn">{TURN_LABEL[turn]}</span>}</div>
      <Track status={draft.status} />
      <p className="sp-chapter-line">{statusLine(draft)}</p>
      {quote && <p className="sp-chapter-line">{quoteLabel}: <q>{quote}</q></p>}
      <p className="sp-chapter-line">Bản nháp số {draft.revision}{draft.changeClass && CHANGE_CLASS[draft.changeClass] ? `, loại thay đổi: ${CHANGE_CLASS[draft.changeClass].label.toLowerCase()}` : ''}{reviewed ? `. ${reviewed}.` : '.'}</p>
    </div>
    <div className="sp-chapter-actions">
      {turn === 'fix' ? <Link className="sp-btn is-primary" to={editorPath(draft.code)}>Sửa theo góp ý</Link>
        : <Link className="sp-btn" to={editorPath(draft.code)}>{readOnly ? 'Xem và chơi thử' : 'Mở trình soạn'}</Link>}
      {turn === 'publish' && <Link className="sp-btn is-primary" to="/internal/releases">Đến màn phát hành</Link>}
      {turn === 'submit' && <Btn tone="primary" disabled={busy} onClick={() => onAction(draft, 'submit')}>Gửi duyệt</Btn>}
      {turn === 'review' && <><Btn disabled={busy} onClick={() => onAction(draft, 'reject')}>Trả về</Btn><Btn tone="primary" disabled={busy} onClick={() => onAction(draft, 'approve')}>Đạt</Btn></>}
      {canWithdraw(actor, draft) && <Btn disabled={busy} onClick={() => onWithdraw(draft)}>Rút lại để sửa</Btn>}
      {ownWaiting && actor.roles?.some(role => ['ADMIN', 'GAME_REVIEWER'].includes(role)) && <small>Bạn sửa chương này nên cần người khác duyệt.</small>}
    </div>
  </li>
}

const DIALOG = {
  submit: { title: name => `Gửi ${name} đi duyệt`, confirm: 'Gửi duyệt', done: 'Đã gửi chương đi duyệt.', explain: 'Người duyệt sẽ chơi thử rồi chấm Đạt hoặc Trả về. Trong lúc chờ, chương bị khoá sửa; bạn có thể rút lại nếu cần sửa tiếp.', note: 'Bạn đã thay đổi gì?', noteHint: 'Không bắt buộc. Giúp người duyệt biết nên xem chỗ nào.' },
  approve: { title: name => `Chấm Đạt cho ${name}`, confirm: 'Chấm Đạt', done: 'Đã chấm Đạt. Chương chờ phát hành.', explain: 'Chương sẽ vào hàng chờ phát hành. Người phát hành sẽ đưa nó vào bản game tiếp theo.', note: 'Nhận xét', noteHint: 'Không bắt buộc.' },
  reject: { title: name => `Trả ${name} về cho người soạn`, confirm: 'Trả về', done: 'Đã trả chương về cho người soạn.', explain: 'Người soạn sẽ thấy góp ý của bạn và phải sửa rồi gửi lại.', note: 'Cần sửa gì?', noteHint: 'Bắt buộc. Viết cụ thể cảnh nào, sai ở đâu.' },
}

function ActionDialog({ pending, busy, error, onClose, onSend }) {
  const { draft, action } = pending
  const text = DIALOG[action]
  const [changeClass, setChangeClass] = useState(draft.changeClass || 'MINOR')
  const [note, setNote] = useState('')
  const noteRequired = action === 'reject'
  return <StudioDialog title={text.title(`Chương ${numberOf(draft)}`)} onClose={onClose} busy={busy}>
    <form className="sp-dialog-body" onSubmit={event => { event.preventDefault(); if (!noteRequired || note.trim()) onSend({ changeClass, note: note.trim() }) }}>
      <p>{text.explain}</p>
      {action !== 'reject' && <fieldset className="sp-choices" disabled={busy}>
        <legend>Mức thay đổi so với bản đang chạy{action === 'approve' && ' (người soạn đề xuất sẵn)'}</legend>
        {Object.entries(CHANGE_CLASS).map(([value, { label, hint }]) => <label className="sp-choice" key={value}>
          <input type="radio" name="changeClass" value={value} checked={changeClass === value} onChange={() => setChangeClass(value)} /><span>{label}</span><small>{hint}</small>
        </label>)}
      </fieldset>}
      <label className="sp-field">{text.note}<small>{text.noteHint}</small>
        <textarea className="sp-input" required={noteRequired} disabled={busy} value={note} onChange={event => setNote(event.target.value)} /></label>
      {error && <div className="studio-submit-error sp-inline-error" role="alert"><strong>{action === 'submit' ? 'Chưa gửi được' : 'Chưa chấm được'}</strong>{error}
        {action === 'submit' && <div className="mt-2"><Link className="sp-btn" to={editorPath(draft.code)}>Mở trình soạn để sửa</Link></div>}</div>}
      <div className="sp-dialog-actions"><Btn disabled={busy} onClick={onClose}>Huỷ</Btn>
        <Btn type="submit" tone="primary" disabled={busy || (noteRequired && !note.trim())}>{busy ? 'Đang gửi…' : text.confirm}</Btn></div>
    </form>
  </StudioDialog>
}

function NewChapterDialog({ rows, onClose }) {
  const navigate = useNavigate()
  const next = Math.max(0, ...rows.map(numberOf)) + 1
  const [value, setValue] = useState(String(next))
  const number = Number(value)
  const code = `CH${String(number).padStart(2, '0')}`
  const taken = rows.some(draft => draft.code === code)
  const invalid = !Number.isInteger(number) || number < 1 || number > 99
  return <StudioDialog title="Thêm chương mới" onClose={onClose}>
    <form className="sp-dialog-body" onSubmit={event => { event.preventDefault(); if (!invalid && !taken) navigate(`${editorPath(code)}?new=1`) }}>
      <label className="sp-field">Số chương<small>Chương mới sẽ có mã {invalid ? 'CH…' : code}. Gợi ý: số kế tiếp sau chương cuối.</small>
        <input className="sp-input" type="number" min={1} max={99} step={1} value={value} onChange={event => setValue(event.target.value)} style={{ maxWidth: 160 }} autoFocus /></label>
      {taken && <div className="sp-inline-error" role="alert">Chương {number} đã có. Mở chương đó trong danh sách để sửa.</div>}
      <div className="sp-dialog-actions"><Btn onClick={onClose}>Huỷ</Btn><Btn type="submit" tone="primary" disabled={invalid || taken}>Mở trình soạn</Btn></div>
    </form>
  </StudioDialog>
}

export default function ChaptersPage({ notify, reviewOnly = false, title = 'Chương', intro }) {
  const actor = auth.getSnapshot().actor
  const loader = useCallback(() => studioApi.get('/api/studio/chapters'), [])
  const { data, loading, error, reload } = useStudioResource(loader)
  const { busy, run, error: actionError, clearError } = useStudioAction(notify)
  const [pending, setPending] = useState(null)
  const [creating, setCreating] = useState(false)
  const all = data || []
  // Chương đến lượt mình lên đầu, còn lại theo số chương.
  const sorted = [...all].sort((a, b) => (turnOf(actor, b) ? 1 : 0) - (turnOf(actor, a) ? 1 : 0) || numberOf(a) - numberOf(b))
  const send = ({ changeClass, note }) => {
    const { draft, action } = pending
    const path = `/api/studio/chapters/${encodeURIComponent(draft.code)}/${action === 'submit' ? 'submit' : 'review'}`
    const body = action === 'submit' ? { changeClass, note } : { pass: action === 'approve', changeClass: action === 'approve' ? changeClass : draft.changeClass, note }
    void run(() => studioApi.post(path, body), DIALOG[action].done, () => { setPending(null); reload() })
  }
  const withdraw = draft => void run(() => studioApi.post(`/api/studio/chapters/${encodeURIComponent(draft.code)}/withdraw`), 'Đã rút chương về để sửa tiếp.', reload)
  const rowProps = { actor, busy, onAction: (draft, action) => { clearError(); setPending({ draft, action }) }, onWithdraw: withdraw }
  const waiting = all.filter(draft => draft.status === 'SUBMITTED')
  const forMe = waiting.filter(draft => turnOf(actor, draft) === 'review')
  const notMine = waiting.filter(draft => turnOf(actor, draft) !== 'review')
  return <>
    <PageHeader title={title} intro={intro} actions={!reviewOnly && canEdit(actor) && <Btn tone="primary" disabled={loading || !!error} onClick={() => setCreating(true)}><Plus size={17} aria-hidden="true" />Thêm chương mới</Btn>} />
    {loading && !data ? <StateBox kind="loading">Đang tải danh sách chương…</StateBox>
      : error ? <StateBox kind="error" title="Chưa tải được danh sách chương" actions={<Btn onClick={reload}>Thử lại</Btn>}>{error}</StateBox>
      : reviewOnly ? <>
        <h2 className="sp-group-title">Chờ bạn duyệt ({forMe.length})</h2>
        {forMe.length ? <ul className="sp-chapters">{forMe.map(draft => <ChapterRow key={draft.code} draft={draft} {...rowProps} />)}</ul>
          : <StateBox title="Không có chương đang chờ duyệt" actions={<Link className="sp-btn" to="/internal/chapters">Xem tất cả chương</Link>}>Khi người soạn gửi một chương lên, chương đó sẽ hiện ở đây và trên menu.</StateBox>}
        {notMine.length > 0 && <><h2 className="sp-group-title">Đang chờ người khác duyệt</h2>
          <ul className="sp-chapters">{notMine.map(draft => <ChapterRow key={draft.code} draft={draft} {...rowProps} />)}</ul></>}
      </>
      : sorted.length ? <ul className="sp-chapters" aria-label="Danh sách chương">{sorted.map(draft => <ChapterRow key={draft.code} draft={draft} {...rowProps} />)}</ul>
      : <StateBox title="Chưa có chương nào" actions={canEdit(actor) && <Btn tone="primary" onClick={() => setCreating(true)}>Thêm chương đầu tiên</Btn>}>Chương đầu tiên bạn tạo sẽ hiện ở đây.</StateBox>}
    {pending && <ActionDialog key={`${pending.draft.code}-${pending.action}`} pending={pending} busy={busy} error={actionError} onClose={() => setPending(null)} onSend={send} />}
    {creating && <NewChapterDialog rows={all} onClose={() => setCreating(false)} />}
  </>
}
