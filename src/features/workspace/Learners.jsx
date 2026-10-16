import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Archive, CheckCircle2, ChevronDown, ChevronUp, Circle, Clock3, Copy, ImageIcon, KeyRound, LockKeyhole, PlayCircle, Plus, RefreshCw, ShieldCheck, Sparkles, Trash2, Trophy, Users, XCircle } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { useWorkspace } from './useWorkspace'
import { Heading, Modal, ActionForm, Empty } from './ui'
import { CHAPTERS } from './model'
import { dateLabel } from './format'

const errorMessage = error => ({
  3005: 'Gói đã hết hạn — hãy gia hạn để mở thêm hồ sơ trẻ.', 5001: 'Bạn đã có nhóm đang mở — hãy kết thúc nhóm cũ trước.',
  5002: 'Nhóm đã kết thúc.', 5003: 'Lớp cần xác nhận đã có sự đồng ý của phụ huynh trước.',
  3006: 'Nhóm đã hết chỗ.', 5004: 'Hồ sơ trẻ này không còn hoạt động.', 3004: 'Bạn không có quyền thao tác với nhóm hoặc hồ sơ này.',
})[error.code] || error.message
const STATUS_LABEL = { ACTIVE: 'ĐANG HOẠT ĐỘNG', ARCHIVED: 'ĐÃ THU HỒI', WIPED: 'ĐÃ XÓA DỮ LIỆU' }

export function Learners({ groupsOnly = false }) {
  const { actor } = useWorkspace()
  const context = actor.role === 'teacher' ? 'CLASS' : 'FAMILY'
  const [group, setGroup] = useState(null)
  const [groups, setGroups] = useState([])
  const [slots, setSlots] = useState([])
  const [capacity, setCapacity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('ACTIVE')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const allGroups = await auth.listGroups() || []
      const contextGroups = allGroups.filter(item => item.context === context)
      const open = contextGroups.find(item => !item.closedAt) || null
      setGroups(contextGroups)
      setGroup(open)
      if (open) {
        const [slotRows, availableCapacity] = await Promise.all([auth.listGroupSlots(open.id), auth.groupCapacity(open.id)])
        setSlots(slotRows || [])
        setCapacity(Number.isFinite(Number(availableCapacity)) ? Number(availableCapacity) : null)
      } else {
        setSlots([])
        setCapacity(null)
      }
    } catch (loadError) { setError(errorMessage(loadError)) }
    finally { setLoading(false) }
  }, [context])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(() => setMessage(''), 4500)
    return () => window.clearTimeout(timer)
  }, [message])
  const active = slots.filter(slot => slot.status === 'ACTIVE')
  const inactive = slots.filter(slot => slot.status !== 'ACTIVE')
  const visible = (tab === 'ACTIVE' ? active : inactive).filter(slot => !search || `${slot.displayName || ''} ${slot.code || ''}`.toLowerCase().includes(search.toLowerCase()))
  const available = group ? capacity ?? Math.max(0, Number(group.slotLimit) - Number(group.slotUsed)) : 0

  const run = async (action, success) => {
    setError('')
    try { await action(); setMessage(success); setModal(null); await load() }
    catch (actionError) { const text = errorMessage(actionError); setError(text); throw new Error(text, { cause: actionError }) }
  }

  if (loading) return <Empty>Đang tải nhóm và hồ sơ trẻ từ máy chủ…</Empty>
  if (error && !group) return <><Heading title={context === 'CLASS' ? 'Lớp học của bạn' : 'Không gian gia đình'} description="Không thể tải dữ liệu nhóm lúc này."/><Empty>{error} <button className="ws-btn" onClick={() => void load()}>Thử lại</button></Empty></>
  if (!group) return <><Heading title={context === 'CLASS' ? 'Lớp học của bạn' : 'Không gian gia đình'} description="Bạn chưa có nhóm đang mở cho gói này."/><button className="ws-btn primary" onClick={() => setModal({ type: 'group' })}><Plus size={17}/> {context === 'CLASS' ? 'Tạo lớp học' : 'Tạo không gian gia đình'}</button>{groupsOnly && <GroupHistory groups={groups}/>} {modal?.type === 'group' && <Modal title={context === 'CLASS' ? 'Tạo lớp học' : 'Tạo không gian gia đình'} description={`Nhóm này có tối đa ${context === 'CLASS' ? 40 : 4} chỗ.`} onClose={() => setModal(null)}><ActionForm submit="Tạo nhóm" onSubmit={form => run(() => auth.openGroup(form.get('name'), context), 'Đã tạo nhóm thành công.')}><label>Tên nhóm<input name="name" required maxLength={80} autoComplete="off" placeholder={context === 'CLASS' ? 'VD: Lớp 8A' : 'VD: Nhà mình'}/></label></ActionForm></Modal>}</>

  if (groupsOnly) return <><Heading title="Quản lý lớp học" description={`${group.name} · ${group.slotUsed}/${group.slotLimit} hồ sơ đang hoạt động.`}><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/> Làm mới</button></Heading><Feedback message={message} error={error}/><section className="ws-card"><Users/><h2>{group.name}</h2><p>{group.consentConfirmed ? 'Đã xác nhận đồng ý của phụ huynh.' : 'Chưa xác nhận đồng ý của phụ huynh.'}</p><p>{available} chỗ trống trên tổng số {group.slotLimit}.</p><div className="ws-actions">{!group.consentConfirmed && <button className="ws-btn primary" onClick={() => setModal({ type: 'consent' })}><ShieldCheck size={16}/> Xác nhận sự đồng ý</button>}<Link className="ws-btn" to="/dashboard/learners">Quản lý học sinh</Link><button className="ws-btn danger" onClick={() => setModal({ type: 'close' })}><XCircle size={16}/> Kết thúc lớp</button></div></section><GroupHistory groups={groups}/>{renderConfirmModal(modal, group, setModal, run)}</>

  return <><Heading title={actor.role === 'teacher' ? 'Học sinh và hồ sơ đăng nhập' : 'Không gian của các con'} description={`${active.length}/${group.slotLimit} đang hoạt động · ${available} chỗ trống.`}><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/> Làm mới</button></Heading>
    {!group.consentConfirmed && context === 'CLASS' && <section className="ws-card ws-consent"><ShieldCheck/><div><strong>Cần xác nhận sự đồng ý của phụ huynh</strong><p>Bạn phải hoàn tất bước này trước khi tạo hồ sơ học sinh.</p></div><button className="ws-btn primary" onClick={() => setModal({ type: 'consent' })}>Tôi đã có sự đồng ý</button></section>}
    <Feedback message={message} error={error}/><div className="ws-toolbar"><label>Tìm hồ sơ<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tên hoặc mã đăng nhập" autoComplete="off"/></label><div className="ws-tabs ws-slot-tabs"><button className={tab === 'ACTIVE' ? 'active' : ''} onClick={() => setTab('ACTIVE')}>Đang hoạt động ({active.length})</button><button className={tab === 'INACTIVE' ? 'active' : ''} onClick={() => setTab('INACTIVE')}>Đã thu hồi ({inactive.length})</button></div>{available > 0 && <button className="ws-btn primary" disabled={context === 'CLASS' && !group.consentConfirmed} onClick={() => setModal({ type: 'create' })}><Plus size={17}/> Tạo hồ sơ trẻ</button>}{context === 'CLASS' && available > 0 && <button className="ws-btn" disabled={!group.consentConfirmed} onClick={() => setModal({ type: 'bulk' })}>Tạo nhiều hồ sơ</button>}</div>
    {visible.length ? <div className="ws-grid three">{visible.map(slot => <SlotCard key={slot.id} slot={slot} setModal={setModal} setMessage={setMessage}/>)}</div> : <Empty>{tab === 'ACTIVE' ? 'Chưa có hồ sơ trẻ đang hoạt động.' : 'Chưa có hồ sơ đã thu hồi hoặc xóa.'}</Empty>}
    {modal && <SlotModal modal={modal} group={group} setModal={setModal} run={run}/>}
  </>
}

function GroupHistory({ groups }) {
  const closed = groups.filter(group => group.closedAt)
  if (!closed.length) return null
  return <section className="ws-card ws-group-history"><div className="ws-row"><div><h2>Lớp đã kết thúc</h2><p>Xem lại báo cáo của các lớp trước đây.</p></div><span className="ws-pill">{closed.length} lớp</span></div>{closed.map(group => <div className="ws-list-row" key={group.id}><span><strong>{group.name}</strong><small>Kết thúc {dateLabel(group.closedAt)} · {group.slotUsed ?? 0}/{group.slotLimit} hồ sơ</small></span><Link className="ws-btn" to={`/dashboard/reports?group=${encodeURIComponent(group.id)}`}>Xem báo cáo</Link></div>)}</section>
}

function SlotCard({ slot, setModal, setMessage }) {
  const active = slot.status === 'ACTIVE'
  return <article className={`ws-card ws-slot ${active ? '' : 'inactive'}`}><div className="ws-row"><span className="ws-pill">{STATUS_LABEL[slot.status] || slot.status}</span>{slot.locked && <small>🔒 Đang khóa</small>}</div><Users className="ws-slot-icon"/><h2>{slot.displayName || 'Đã xóa dữ liệu'}</h2>{slot.code && <div className="ws-code"><code>{slot.code}</code><button aria-label="Sao chép mã" onClick={async () => { try { await navigator.clipboard.writeText(slot.code); setMessage('Đã sao chép mã đăng nhập.') } catch { setMessage(`Mã đăng nhập: ${slot.code}`) } }}><Copy size={17}/></button></div>}<div className="ws-actions"><Link className="ws-btn" to={`/dashboard/learners/${slot.id}`}>Xem tiến độ</Link>{active && <><button className="ws-btn" onClick={() => setModal({ type: 'pin', slot })}><KeyRound size={15}/> Đổi mã PIN</button><button className="ws-btn warning" onClick={() => setModal({ type: 'return', slot })}><Archive size={15}/> Thu hồi</button></>} {slot.status !== 'WIPED' && <button className="ws-btn danger" onClick={() => setModal({ type: 'wipe', slot })}><Trash2 size={15}/> Xóa dữ liệu</button>}</div></article>
}

function SlotModal({ modal, group, setModal, run }) {
  if (['consent', 'close'].includes(modal.type)) return renderConfirmModal(modal, group, setModal, run)
  const titles = { create: 'Tạo hồ sơ cho trẻ', pin: `Đổi mã PIN · ${modal.slot?.displayName}`, return: `Thu hồi · ${modal.slot?.displayName}`, wipe: `Xóa dữ liệu · ${modal.slot?.displayName}`, bulk: 'Tạo nhiều hồ sơ trẻ' }
  const descriptions = { return: 'Hồ sơ chuyển sang trạng thái đã thu hồi, trả lại chỗ trống và mã đăng nhập ngừng hoạt động.', wipe: 'Tên, mã và PIN sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.', bulk: 'Mỗi dòng theo định dạng: Tên học sinh | PIN 6 số. Nếu vượt hạn mức, toàn bộ danh sách sẽ bị từ chối.' }
  return <Modal title={titles[modal.type]} description={descriptions[modal.type] || 'Mã PIN phải có đúng 6 chữ số và sẽ không được máy chủ trả lại.'} onClose={() => setModal(null)}><ActionForm submit={modal.type === 'return' ? 'Xác nhận thu hồi' : modal.type === 'wipe' ? 'Xóa vĩnh viễn' : 'Lưu'} submitTone={modal.type === 'return' ? 'warning' : modal.type === 'wipe' ? 'danger' : 'primary'} onSubmit={form => {
    if (modal.type === 'create') return run(async () => { const created = await auth.openSlot({ groupId: group.id, displayName: form.get('slot-child-name'), pin: form.get('slot-child-pin') }); return created }, 'Đã tạo hồ sơ trẻ. Hãy sao chép mã đăng nhập trên thẻ và đưa mã PIN vừa đặt cho trẻ.')
    if (modal.type === 'pin') return run(() => auth.changeSlotPin(modal.slot.id, form.get('slot-child-pin')), 'Đã đổi mã PIN và mở khóa hồ sơ.')
    if (modal.type === 'return') return run(() => auth.returnSlot(modal.slot.id), 'Đã thu hồi hồ sơ và trả lại chỗ trống.')
    if (modal.type === 'wipe') return run(() => auth.wipeSlot(modal.slot.id), 'Đã xóa vĩnh viễn dữ liệu hồ sơ.')
    const items = String(form.get('bulk')).split(/\r?\n/).filter(Boolean).map(line => { const [displayName, pin] = line.split('|').map(value => value.trim()); if (!displayName || !/^\d{6}$/.test(pin)) throw new Error(`Dòng không hợp lệ: ${line}`); return { displayName, pin } })
    if (!items.length) throw new Error('Hãy nhập ít nhất một học sinh.')
    return run(() => auth.openSlots(group.id, items), `Đã tạo ${items.length} hồ sơ trẻ.`)
  }}><input className="ws-autofill-trap" name="username" autoComplete="username" tabIndex={-1}/><input className="ws-autofill-trap" name="password" type="password" autoComplete="current-password" tabIndex={-1}/>{modal.type === 'create' && <label>Tên trẻ<input name="slot-child-name" required maxLength={40} autoComplete="off" data-lpignore="true" data-1p-ignore="true"/></label>}{['create', 'pin'].includes(modal.type) && <label>Mã PIN gồm 6 chữ số<input name="slot-child-pin" type="password" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" required/><small>PIN được gửi dạng chuỗi để giữ số 0 ở đầu.</small></label>}{modal.type === 'bulk' && <label>Danh sách<textarea name="bulk" rows={8} required autoComplete="off" placeholder={'Nguyễn An | 012345\nTrần Bình | 654321'}/></label>}{modal.type === 'wipe' && <label>Nhập XOA để xác nhận<input name="confirm" pattern="XOA" required autoComplete="off"/></label>}</ActionForm></Modal>
}

function Feedback({ message, error }) {
  const text = error || message
  return text ? <div className={`ws-toast ${error ? 'error' : 'success'}`} role={error ? 'alert' : 'status'}>{text}</div> : null
}

function renderConfirmModal(modal, group, setModal, run) {
  if (!modal || !['consent', 'close'].includes(modal.type)) return null
  const consent = modal.type === 'consent'
  return <Modal title={consent ? 'Xác nhận sự đồng ý' : 'Kết thúc nhóm'} description={consent ? 'Xác nhận rằng bạn đã có sự đồng ý của phụ huynh học sinh trước khi tạo hồ sơ.' : 'Tất cả hồ sơ đang hoạt động sẽ bị thu hồi. Không thể mở lại nhóm này.'} onClose={() => setModal(null)}><ActionForm submit={consent ? 'Tôi xác nhận' : 'Kết thúc nhóm'} onSubmit={() => run(() => consent ? auth.confirmConsent(group.id) : auth.closeGroup(group.id), consent ? 'Đã xác nhận sự đồng ý của phụ huynh.' : 'Đã kết thúc nhóm.')} >{!consent && <label>Nhập DONG để xác nhận<input name="confirm" pattern="DONG" required autoComplete="off"/></label>}</ActionForm></Modal>
}

export function SlotReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAllChapters, setShowAllChapters] = useState(false)
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setReport(await auth.getSlotReport(id)) }
    catch (loadError) { setError(errorMessage(loadError)) }
    finally { setLoading(false) }
  }, [id])
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])
  if (loading) return <Empty>Đang tải tiến độ học sinh từ máy chủ…</Empty>
  if (error) return <Empty>{error} <button className="ws-btn" onClick={() => void load()}>Thử lại</button> <Link to="/dashboard/reports">Về báo cáo</Link></Empty>
  if (!report) return <Empty>Chưa có dữ liệu báo cáo.</Empty>
  const { learner, progress, indicators } = report
  const labels = { wealth: 'Tài sản', saving: 'Tiết kiệm', happiness: 'Hạnh phúc', risk: 'Rủi ro', goal: 'Mục tiêu' }
  const level = value => value < 34 ? 'Thấp' : value < 67 ? 'Vừa' : 'Cao'
  const chaptersDone = new Set(progress.chaptersDone || [])
  const chapters = Array.from({ length: progress.totalChapters || 0 }, (_, index) => {
    const number = index + 1
    const status = chaptersDone.has(number) ? 'DONE' : progress.continueChapter === number ? 'PLAYING' : 'NOT_STARTED'
    return { number, title: CHAPTERS[index] || `Chương ${number}`, status }
  })
  const chapterStatus = { DONE: 'Đã hoàn thành', PLAYING: 'Đang chơi', NOT_STARTED: 'Chưa chơi' }
  const chapterIcon = { DONE: CheckCircle2, PLAYING: PlayCircle, NOT_STARTED: LockKeyhole }
  const percent = progress.totalChapters ? Math.round(progress.completedChapters / progress.totalChapters * 100) : 0
  const currentChapter = chapters.find(chapter => chapter.status === 'PLAYING')
  const focusIndex = Math.max(0, chapters.findIndex(chapter => chapter.status === 'PLAYING'))
  const windowStart = Math.max(0, Math.min(focusIndex - 3, chapters.length - 8))
  const visibleChapters = showAllChapters || chapters.length <= 8 ? chapters : chapters.slice(windowStart, windowStart + 8)
  const hiddenBefore = Math.max(0, windowStart)
  const hiddenAfter = Math.max(0, chapters.length - windowStart - visibleChapters.length)
  return <>
    <Heading title={learner.displayName || 'Đã xoá'} description={`${learner.group.name} · ${STATUS_LABEL[learner.status] || learner.status}`}><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/> Làm mới</button></Heading>
    <div className="ws-actions"><Link className="ws-btn" to="/dashboard/reports">Về báo cáo</Link></div>
    <section className="ws-card ws-progress-report">
      <div className="ws-progress-report-head"><div><span className="ws-eyebrow">HÀNH TRÌNH HỌC TẬP</span><h2>Tiến độ theo từng chương</h2><p>{currentChapter ? `Hiện đang học Chương ${currentChapter.number}: ${currentChapter.title}` : percent === 100 ? 'Đã hoàn thành toàn bộ hành trình hiện tại.' : 'Học sinh chưa bắt đầu hành trình.'}</p></div><div className="ws-progress-score"><strong>{percent}%</strong><span>hoàn thành</span></div></div>
      <div className="ws-progress-track" role="progressbar" aria-label="Tiến độ hoàn thành chương" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><span style={{ width: `${percent}%` }}/></div>
      <div className="ws-progress-summary"><div><CheckCircle2/><span><strong>{progress.completedChapters}</strong> đã xong</span></div><div><PlayCircle/><span><strong>{currentChapter ? 1 : 0}</strong> đang chơi</span></div><div><Circle/><span><strong>{chapters.filter(chapter => chapter.status === 'NOT_STARTED').length}</strong> chưa chơi</span></div><div><Clock3/><span>Lần chơi <strong>{progress.attemptIndex}</strong></span></div></div>
      {currentChapter && <aside className="ws-current-chapter"><span><Sparkles/></span><div><small>ĐANG TIẾP TỤC</small><strong>Chương {currentChapter.number} · {currentChapter.title}</strong><p>Đây là điểm hiện tại trong hành trình của học sinh.</p></div><b>{currentChapter.number}/{progress.totalChapters}</b></aside>}
      <div className="ws-journey-legend"><span><i className="done"/>Đã hoàn thành</span><span><i className="playing"/>Đang chơi</span><span><i/>Chưa chơi</span></div>
      {!showAllChapters && hiddenBefore > 0 && <button className="ws-journey-more" onClick={() => setShowAllChapters(true)}><ChevronUp/> Xem {hiddenBefore} chương trước</button>}
      {chapters.length ? <ol className="ws-chapter-timeline ws-chapter-roadmap" style={{ '--journey-progress': `${percent}%` }}>{visibleChapters.map(chapter => { const Icon = chapterIcon[chapter.status]; const detail = report.chapters?.find(item => item.chapter === chapter.number); const coverUrl = detail?.coverUrl || detail?.imageUrl || detail?.thumbnailUrl; return <li key={chapter.number} className={`is-${chapter.status.toLowerCase()} ${chapter.number % 2 ? 'is-left' : 'is-right'}`}><div className="ws-chapter-marker"><span>{chapter.number}</span><Icon aria-hidden="true"/></div><div className="ws-chapter-card">{coverUrl ? <img className="ws-chapter-cover" src={coverUrl} alt={`Ảnh bìa ${chapter.title}`}/> : <div className="ws-chapter-cover placeholder" aria-hidden="true"><ImageIcon/></div>}<div className="ws-chapter-copy"><span>CHẶNG {chapter.number}</span><strong>{chapter.title}</strong></div><span className="ws-chapter-status">{chapterStatus[chapter.status]}</span><p className="ws-chapter-message">{chapter.status === 'DONE' ? 'Đã đi qua chặng này' : chapter.status === 'PLAYING' ? 'Hành trình đang diễn ra tại đây' : 'Sẽ mở khi hoàn thành chặng trước'}</p>{detail && <div className="ws-chapter-detail"><small>Hoàn thành {dateLabel(detail.finishedAt)}</small><small>{detail.choices?.length || 0} lựa chọn · {detail.miniGames?.length || 0} câu mini-game</small></div>}</div></li>})}</ol> : <Empty>Chưa có thông tin chương học.</Empty>}
      {chapters.length > 8 && <div className="ws-journey-controls">{!showAllChapters && hiddenAfter > 0 && <button className="ws-journey-more" onClick={() => setShowAllChapters(true)}>Xem {hiddenAfter} chương tiếp theo <ChevronDown/></button>}<button className="ws-btn" onClick={() => setShowAllChapters(value => !value)}>{showAllChapters ? <><ChevronUp/> Thu gọn hành trình</> : <><ChevronDown/> Xem toàn bộ {chapters.length} chương</>}</button></div>}
      <footer className="ws-progress-meta"><Clock3 size={16}/>{progress.lastPlayedAt ? `Hoạt động gần nhất ${dateLabel(progress.lastPlayedAt)}` : 'Chưa có hoạt động nào được ghi nhận'}</footer>
    </section>
    <section className="ws-card"><h2>5 chỉ số hành vi</h2>{indicators ? <div className="ws-grid three">{Object.entries(indicators).map(([key, value]) => <article key={key}><strong>{labels[key] || key}</strong><p>{level(value)}</p><small>{value}/100</small></article>)}</div> : <Empty>Chưa có dữ liệu chỉ số.</Empty>}</section>
    <section className="ws-card ws-achievement-report"><div className="ws-report-section-head"><div><span className="ws-eyebrow">DẤU MỐC</span><h2>Thành tích</h2></div><Trophy/></div>{report.achievements?.length ? <div className="ws-achievement-grid">{report.achievements.map(item => { const imageUrl = item.imageUrl || item.iconUrl || item.badgeUrl; return <article key={`${item.code}-${item.earnedAt}`}>{imageUrl ? <img src={imageUrl} alt=""/> : <span><Trophy/></span>}<div><strong>{item.title || item.name || item.code}</strong><small>Đạt lúc {dateLabel(item.earnedAt)}</small></div></article>})}</div> : <Empty>Chưa có thành tích.</Empty>}</section>
  </>
}

export function Groups() { return <Learners groupsOnly/> }
