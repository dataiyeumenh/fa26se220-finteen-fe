import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Archive, Copy, KeyRound, Plus, RefreshCw, ShieldCheck, Trash2, Users, XCircle } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { useWorkspace } from './useWorkspace'
import { Heading, Modal, ActionForm, Notice, Empty } from './ui'

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
  const [slots, setSlots] = useState([])
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
      const open = allGroups.find(item => item.context === context && !item.closedAt) || null
      setGroup(open)
      setSlots(open ? await auth.listGroupSlots(open.id) || [] : [])
    } catch (loadError) { setError(errorMessage(loadError)) }
    finally { setLoading(false) }
  }, [context])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])
  useEffect(() => {
    if (!message && !error) return undefined
    const timer = window.setTimeout(() => { setMessage(''); setError('') }, 4500)
    return () => window.clearTimeout(timer)
  }, [message, error])
  const active = slots.filter(slot => slot.status === 'ACTIVE')
  const inactive = slots.filter(slot => slot.status !== 'ACTIVE')
  const visible = (tab === 'ACTIVE' ? active : inactive).filter(slot => !search || `${slot.displayName || ''} ${slot.code || ''}`.toLowerCase().includes(search.toLowerCase()))
  const available = group ? Math.max(0, Number(group.slotLimit) - Number(group.slotUsed)) : 0

  const run = async (action, success) => {
    setError('')
    try { await action(); setMessage(success); setModal(null); await load() }
    catch (actionError) { const text = errorMessage(actionError); setError(text); throw new Error(text, { cause: actionError }) }
  }

  if (loading) return <Empty>Đang tải nhóm và hồ sơ trẻ từ máy chủ…</Empty>
  if (!group) return <><Heading title={context === 'CLASS' ? 'Lớp học của bạn' : 'Không gian gia đình'} description="Bạn chưa có nhóm đang mở cho gói này."/><Notice text={error}/><button className="ws-btn primary" onClick={() => setModal({ type: 'group' })}><Plus size={17}/> {context === 'CLASS' ? 'Tạo lớp học' : 'Tạo không gian gia đình'}</button>{modal?.type === 'group' && <Modal title={context === 'CLASS' ? 'Tạo lớp học' : 'Tạo không gian gia đình'} description={`Nhóm này có tối đa ${context === 'CLASS' ? 40 : 4} chỗ.`} onClose={() => setModal(null)}><ActionForm submit="Tạo nhóm" onSubmit={form => run(() => auth.openGroup(form.get('name'), context), 'Đã tạo nhóm thành công.')}><label>Tên nhóm<input name="name" required maxLength={80} autoComplete="off" placeholder={context === 'CLASS' ? 'VD: Lớp 8A' : 'VD: Nhà mình'}/></label></ActionForm></Modal>}</>

  if (groupsOnly) return <><Heading title="Quản lý lớp học" description={`${group.name} · ${group.slotUsed}/${group.slotLimit} hồ sơ đang hoạt động.`}><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/> Làm mới</button></Heading><Feedback message={message} error={error}/><section className="ws-card"><Users/><h2>{group.name}</h2><p>{group.consentConfirmed ? 'Đã xác nhận đồng ý của phụ huynh.' : 'Chưa xác nhận đồng ý của phụ huynh.'}</p><p>{available} chỗ trống trên tổng số {group.slotLimit}.</p><div className="ws-actions">{!group.consentConfirmed && <button className="ws-btn primary" onClick={() => setModal({ type: 'consent' })}><ShieldCheck size={16}/> Xác nhận sự đồng ý</button>}<Link className="ws-btn" to="/dashboard/learners">Quản lý học sinh</Link><button className="ws-btn danger" onClick={() => setModal({ type: 'close' })}><XCircle size={16}/> Kết thúc lớp</button></div></section>{renderConfirmModal(modal, group, setModal, run)}</>

  return <><Heading title={actor.role === 'teacher' ? 'Học sinh và hồ sơ đăng nhập' : 'Không gian của các con'} description={`${active.length}/${group.slotLimit} đang hoạt động · ${available} chỗ trống.`}><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/> Làm mới</button></Heading>
    {!group.consentConfirmed && context === 'CLASS' && <section className="ws-card ws-consent"><ShieldCheck/><div><strong>Cần xác nhận sự đồng ý của phụ huynh</strong><p>Bạn phải hoàn tất bước này trước khi tạo hồ sơ học sinh.</p></div><button className="ws-btn primary" onClick={() => setModal({ type: 'consent' })}>Tôi đã có sự đồng ý</button></section>}
    <Feedback message={message} error={error}/><div className="ws-toolbar"><label>Tìm hồ sơ<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tên hoặc mã đăng nhập" autoComplete="off"/></label><div className="ws-tabs ws-slot-tabs"><button className={tab === 'ACTIVE' ? 'active' : ''} onClick={() => setTab('ACTIVE')}>Đang hoạt động ({active.length})</button><button className={tab === 'INACTIVE' ? 'active' : ''} onClick={() => setTab('INACTIVE')}>Đã thu hồi ({inactive.length})</button></div>{available > 0 && <button className="ws-btn primary" disabled={context === 'CLASS' && !group.consentConfirmed} onClick={() => setModal({ type: 'create' })}><Plus size={17}/> Tạo hồ sơ trẻ</button>}{context === 'CLASS' && available > 0 && <button className="ws-btn" disabled={!group.consentConfirmed} onClick={() => setModal({ type: 'bulk' })}>Tạo nhiều hồ sơ</button>}</div>
    {visible.length ? <div className="ws-grid three">{visible.map(slot => <SlotCard key={slot.id} slot={slot} setModal={setModal} setMessage={setMessage}/>)}</div> : <Empty>{tab === 'ACTIVE' ? 'Chưa có hồ sơ trẻ đang hoạt động.' : 'Chưa có hồ sơ đã thu hồi hoặc xóa.'}</Empty>}
    {modal && <SlotModal modal={modal} group={group} setModal={setModal} run={run}/>}
  </>
}

function SlotCard({ slot, setModal, setMessage }) {
  const active = slot.status === 'ACTIVE'
  return <article className={`ws-card ws-slot ${active ? '' : 'inactive'}`}><div className="ws-row"><span className="ws-pill">{STATUS_LABEL[slot.status] || slot.status}</span>{slot.locked && <small>🔒 Đang khóa</small>}</div><Users className="ws-slot-icon"/><h2>{slot.displayName || 'Đã xóa dữ liệu'}</h2>{slot.code && <div className="ws-code"><code>{slot.code}</code><button aria-label="Sao chép mã" onClick={async () => { try { await navigator.clipboard.writeText(slot.code); setMessage('Đã sao chép mã đăng nhập.') } catch { setMessage(`Mã đăng nhập: ${slot.code}`) } }}><Copy size={17}/></button></div>}<div className="ws-actions">{active && <><button className="ws-btn" onClick={() => setModal({ type: 'pin', slot })}><KeyRound size={15}/> Đổi mã PIN</button><button className="ws-btn danger" onClick={() => setModal({ type: 'return', slot })}><Archive size={15}/> Thu hồi</button></>} {slot.status !== 'WIPED' && <button className="ws-btn danger" onClick={() => setModal({ type: 'wipe', slot })}><Trash2 size={15}/> Xóa dữ liệu</button>}</div></article>
}

function SlotModal({ modal, group, setModal, run }) {
  if (['consent', 'close'].includes(modal.type)) return renderConfirmModal(modal, group, setModal, run)
  const titles = { create: 'Tạo hồ sơ cho trẻ', pin: `Đổi mã PIN · ${modal.slot?.displayName}`, return: `Thu hồi · ${modal.slot?.displayName}`, wipe: `Xóa dữ liệu · ${modal.slot?.displayName}`, bulk: 'Tạo nhiều hồ sơ trẻ' }
  const descriptions = { return: 'Hồ sơ chuyển sang trạng thái đã thu hồi, trả lại chỗ trống và mã đăng nhập ngừng hoạt động.', wipe: 'Tên, mã và PIN sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.', bulk: 'Mỗi dòng theo định dạng: Tên học sinh | PIN 6 số. Nếu vượt hạn mức, toàn bộ danh sách sẽ bị từ chối.' }
  return <Modal title={titles[modal.type]} description={descriptions[modal.type] || 'Mã PIN phải có đúng 6 chữ số và sẽ không được máy chủ trả lại.'} onClose={() => setModal(null)}><ActionForm submit={modal.type === 'return' ? 'Xác nhận thu hồi' : modal.type === 'wipe' ? 'Xóa vĩnh viễn' : 'Lưu'} onSubmit={form => {
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

export function LearnerDetail() {
  const { id } = useParams()
  return <Empty>Hồ sơ {id} được quản lý tại danh sách học sinh. Chức năng xem tiến độ chơi hiện chưa được máy chủ hỗ trợ. <Link to="/dashboard/learners">Về danh sách</Link></Empty>
}

export function Groups() { return <Learners groupsOnly/> }
