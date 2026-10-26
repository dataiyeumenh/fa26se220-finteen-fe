// Danh sách chương + gửi duyệt / chấm Đạt / Trả về. Cũng là màn "Chờ duyệt" khi reviewOnly.
import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowDownWideNarrow, ArrowRight, CheckCircle2, Clock3, FilePenLine, Layers3, ListFilter, Plus, Rocket, Search, Undo2, X } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { canEdit, canWithdraw } from './permissions'
import { CHANGE_CLASS, STATUS_LABEL, studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { turnOf } from './chapterWork'
import { Btn, PageHeader, StateBox, StudioDialog, Tag } from './ui'

const numberOf = draft => draft.chapterNumber ?? Number(draft.code.slice(2))
const editorPath = code => `/internal/editor/${encodeURIComponent(code)}`
const FILTERS = [
  { id: 'ALL', label: 'Tất cả', icon: Layers3, hint: 'Toàn bộ nội dung' },
  { id: 'DRAFT', label: 'Đang soạn', icon: FilePenLine, hint: 'Đang hoàn thiện' },
  { id: 'REJECTED', label: 'Trả về', icon: Undo2, hint: 'Cần chỉnh sửa' },
  { id: 'SUBMITTED', label: 'Chờ duyệt', icon: Clock3, hint: 'Đang chờ phản hồi' },
  { id: 'APPROVED', label: 'Đã duyệt', icon: CheckCircle2, hint: 'Sẵn sàng phát hành' },
  { id: 'RELEASED', label: 'Đã phát hành', icon: Rocket, hint: 'Đã đưa vào game' },
]

const matchesFilter = (draft, filter) => filter === 'ALL'
  || draft.status === filter

const searchText = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()
const TURN_LABEL = { fix: 'Cần bạn chỉnh sửa', submit: 'Chờ bạn gửi duyệt', review: 'Chờ bạn duyệt', publish: 'Chờ phát hành' }

const shortTime = value => value ? new Date(value).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : ''

function ChapterRow({ draft, actor, busy, onAction, onWithdraw }) {
  const turn = turnOf(actor, draft)
  const readOnly = !canEdit(actor) || draft.status === 'SUBMITTED'
  const ownWaiting = draft.status === 'SUBMITTED' && draft.editorId === actor?.id
  const activityAt = draft.updatedAt || draft.submittedAt || draft.reviewedAt || draft.releasedAt
  return <li className={`sp-chapter${turn ? ' is-mine' : ''}`}>
    <div className="sp-chapter-no"><small>CH</small>{String(numberOf(draft)).padStart(2, '0')}</div>
    <div className="sp-chapter-main">
      <div className="sp-chapter-title"><h3>{draft.title || draft.code}</h3><Tag tone={draft.status}>{STATUS_LABEL[draft.status] || draft.status}</Tag></div>
      <p className="sp-chapter-line"><span>{draft.code}</span> · Bản nháp #{draft.revision}{activityAt ? ` · Cập nhật ${shortTime(activityAt)}` : ''}</p>
      {turn && <span className="sp-chapter-next"><span aria-hidden="true" />{TURN_LABEL[turn]}</span>}
    </div>
    <div className="sp-chapter-actions">
      {turn === 'fix' ? <Link className="sp-btn is-primary" to={editorPath(draft.code)}>Sửa chương</Link>
        : <Link className="sp-btn" to={editorPath(draft.code)}>{readOnly ? 'Xem chương' : 'Tiếp tục soạn'}<ArrowRight size={15} aria-hidden="true" /></Link>}
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
  const [filter, setFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('priority')
  const [mineOnly, setMineOnly] = useState(false)
  const all = data || []
  // Chương đến lượt mình lên đầu, còn lại theo số chương.
  const sorted = [...all].sort((a, b) => {
    if (sort === 'updated') return (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0) || numberOf(a) - numberOf(b)
    if (sort === 'number-desc') return numberOf(b) - numberOf(a)
    if (sort === 'number') return numberOf(a) - numberOf(b)
    return Number(!!turnOf(actor, b)) - Number(!!turnOf(actor, a)) || numberOf(a) - numberOf(b)
  })
  const keyword = searchText(query.trim())
  const visible = sorted.filter(draft => matchesFilter(draft, filter)
    && (!mineOnly || !!turnOf(actor, draft))
    && (!keyword || searchText(`${draft.code} ${numberOf(draft)} ${draft.title || ''}`).includes(keyword)))
  const activeFilters = filter !== 'ALL' || !!query || mineOnly
  const resetFilters = () => { setFilter('ALL'); setQuery(''); setMineOnly(false) }
  const countFor = id => all.filter(draft => matchesFilter(draft, id)).length
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
    <PageHeader className="sp-chapter-page-head" title={title} intro={intro || (!reviewOnly ? 'Quản lý nội dung, theo dõi tiến độ và hoàn thiện từng chương trong game.' : undefined)} actions={!reviewOnly && canEdit(actor) && <Btn tone="primary" disabled={loading || !!error} onClick={() => setCreating(true)}><Plus size={17} aria-hidden="true" />Thêm chương mới</Btn>} />
    {loading && !data ? <StateBox kind="loading">Đang tải danh sách chương…</StateBox>
      : error ? <StateBox kind="error" title="Chưa tải được danh sách chương" actions={<Btn onClick={reload}>Thử lại</Btn>}>{error}</StateBox>
      : reviewOnly ? <>
        <h2 className="sp-group-title">Chờ bạn duyệt ({forMe.length})</h2>
        {forMe.length ? <ul className="sp-chapters">{forMe.map(draft => <ChapterRow key={draft.code} draft={draft} {...rowProps} />)}</ul>
          : <StateBox title="Không có chương đang chờ duyệt" actions={<Link className="sp-btn" to="/internal/chapters">Xem tất cả chương</Link>}>Khi người soạn gửi một chương lên, chương đó sẽ hiện ở đây và trên menu.</StateBox>}
        {notMine.length > 0 && <><h2 className="sp-group-title">Đang chờ người khác duyệt</h2>
          <ul className="sp-chapters">{notMine.map(draft => <ChapterRow key={draft.code} draft={draft} {...rowProps} />)}</ul></>}
      </>
      : sorted.length ? <>
        <section className="sp-chapter-filter-panel" aria-label="Bộ lọc chương">
          <div className="sp-chapter-filter-heading"><span><ListFilter size={16} aria-hidden="true" />Lọc theo trạng thái</span><small>Chọn một trạng thái để xem chương</small></div>
          <div className="sp-chapter-dashboard">
            {FILTERS.map(({ id, label, icon: Icon, hint }) => <button type="button" key={id} className={filter === id ? 'active' : ''} data-status={id} aria-pressed={filter === id} aria-controls="chapter-results" onClick={() => setFilter(id)}>
              <span className="sp-chapter-stat-top"><Icon size={18} aria-hidden="true" /><strong>{countFor(id)}</strong></span>
              <span>{label}</span><small>{hint}</small>
            </button>)}
          </div>
          <div className="sp-chapter-toolbar">
            <label className="sp-chapter-search">
              <Search size={18} aria-hidden="true" />
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm mã, số hoặc tên chương…" aria-label="Tìm chương" />
              {query && <button type="button" aria-label="Xóa từ khóa tìm kiếm" onClick={() => setQuery('')}><X size={16} aria-hidden="true" /></button>}
            </label>
            <label className="sp-chapter-sort"><ArrowDownWideNarrow size={17} aria-hidden="true" /><select aria-label="Sắp xếp chương" value={sort} onChange={event => setSort(event.target.value)}>
              <option value="priority">Ưu tiên cần xử lý</option><option value="updated">Cập nhật gần nhất</option><option value="number">Số chương tăng dần</option><option value="number-desc">Số chương giảm dần</option>
            </select></label>
            <label className="sp-chapter-mine"><input type="checkbox" checked={mineOnly} onChange={event => setMineOnly(event.target.checked)} />Cần tôi xử lý</label>
          </div>
        </section>
        <div className="sp-chapter-results-head">
          <h2>Danh sách chương <span aria-live="polite">{visible.length}/{all.length}</span></h2>
          {activeFilters ? <button type="button" onClick={resetFilters}><X size={14} aria-hidden="true" />Xóa bộ lọc</button> : <span>Theo dõi và tiếp tục công việc của bạn</span>}
        </div>
        <div id="chapter-results">
        {visible.length
          ? <ul className="sp-chapters" aria-label="Danh sách chương">{visible.map(draft => <ChapterRow key={draft.code} draft={draft} {...rowProps} />)}</ul>
          : <StateBox title="Không tìm thấy chương phù hợp" actions={<Btn onClick={resetFilters}>Xóa bộ lọc</Btn>}>Thử đổi từ khóa hoặc chọn một trạng thái khác.</StateBox>}
        </div>
      </>
      : <StateBox title="Chưa có chương nào" actions={canEdit(actor) && <Btn tone="primary" onClick={() => setCreating(true)}>Thêm chương đầu tiên</Btn>}>Chương đầu tiên bạn tạo sẽ hiện ở đây.</StateBox>}
    {pending && <ActionDialog key={`${pending.draft.code}-${pending.action}`} pending={pending} busy={busy} error={actionError} onClose={() => setPending(null)} onSend={send} />}
    {creating && <NewChapterDialog rows={all} onClose={() => setCreating(false)} />}
  </>
}
