import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Plus, KeyRound, Archive, Copy, Users } from 'lucide-react'
import { useWorkspace } from './useWorkspace'
import { dispatch, saveLearner } from './demoStore'
import { PLANS, activeLearners } from './model'
import { Heading, Modal, ActionForm, Notice, Empty } from './ui'
import { dateLabel } from './format'

export function Learners() {
  const { actor, db } = useWorkspace()
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const slots = db.slots.filter(s => s.ownerId === actor.id)
  const count = slots.filter(s => s.learnerId).length
  return <><Heading title={actor.role === 'teacher' ? 'Học sinh & slot' : 'Không gian của các con'} description={`${count}/${PLANS[actor.plan].capacity} đang hoạt động · ${slots.length - count} slot sẵn sàng tạo tài khoản.`}/>
    <div className="ws-toolbar"><label>Tìm tài khoản<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tên hoặc mã đăng nhập"/></label><Link className="ws-text-link" to="/dashboard/reports">Xem cả lịch sử tài khoản đã thu hồi →</Link></div><Notice text={message}/>
    <div className="ws-grid three">{slots.map(slot => { const learner = db.learners.find(l => l.id === slot.learnerId); if (search && !`${learner?.name || ''} ${learner?.code || ''}`.toLowerCase().includes(search.toLowerCase())) return null; return <article key={slot.id} className={`ws-card ws-slot ${learner ? '' : 'inactive'}`}><div className="ws-row"><span className="ws-pill">Slot {String(slot.number).padStart(2, '0')}</span><small>{learner ? '● Hoạt động' : 'Chưa kích hoạt'}</small></div><Users className="ws-slot-icon"/><h2>{learner?.name || 'Chỗ cho một hành trình mới'}</h2>{learner ? <><div className="ws-code"><code>{learner.code}</code><button aria-label={`Sao chép mã ${learner.name}`} onClick={async () => { try { await navigator.clipboard.writeText(learner.code); setMessage('Đã sao chép mã đăng nhập.') } catch { setMessage(`Mã đăng nhập: ${learner.code}`) } }}><Copy size={17}/></button></div><p>Kế thừa gói {PLANS[actor.plan].name}</p><Link className="ws-text-link" to={`/dashboard/learners/${learner.id}`}>Chi tiết hành trình →</Link><div className="ws-actions"><button className="ws-btn" onClick={() => setModal({ type: 'pin', learner })}><KeyRound size={15}/> Đặt lại PIN</button><button className="ws-btn danger" onClick={() => setModal({ type: 'revoke', learner })}><Archive size={15}/> Thu hồi</button></div></> : <><p>Tạo mã đăng nhập riêng và đặt PIN để bắt đầu.</p><button className="ws-btn" onClick={() => setModal({ type: 'create', slot })}><Plus size={17}/> Tạo tài khoản</button></>}</article> })}</div>
    {modal && <Modal title={modal.type === 'create' ? 'Tạo tài khoản học sinh' : modal.type === 'pin' ? `Đặt lại PIN · ${modal.learner.name}` : `Thu hồi · ${modal.learner.name}`} description={modal.type === 'revoke' ? 'Mã cũ và phiên đăng nhập sẽ mất hiệu lực. Lịch sử được giữ lại; slot trở về chưa kích hoạt.' : 'Học sinh đăng nhập bằng mã được cấp và PIN do bạn đặt. Không sử dụng QR.'} onClose={() => setModal(null)}><ActionForm submit={modal.type === 'revoke' ? 'Xác nhận thu hồi' : 'Lưu và kích hoạt'} onSubmit={async form => { if (modal.type === 'revoke') dispatch('REVOKE_LEARNER', { learnerId: modal.learner.id }); else await saveLearner({ slotId: modal.slot?.id, learnerId: modal.learner?.id, name: form.get('name'), pin: form.get('pin') }); setMessage(modal.type === 'create' ? 'Đã tạo tài khoản. Gửi mã đăng nhập và PIN bạn vừa đặt cho học sinh.' : 'Đã cập nhật tài khoản.'); setModal(null) }}>{modal.type === 'create' && <label>Tên học sinh<input name="name" required maxLength={80}/></label>}{modal.type !== 'revoke' && <label>PIN mới (4–6 chữ số)<input name="pin" type="password" inputMode="numeric" pattern="[0-9]{4,6}" autoComplete="new-password" required/><small>Hãy ghi nhớ PIN để đưa cho học sinh; hệ thống không hiển thị lại PIN.</small></label>}</ActionForm></Modal>}
  </>
}
export function LearnerDetail() {
  const { id } = useParams()
  const { actor, db } = useWorkspace()
  const learner = db.learners.find(l => l.id === id && l.ownerId === actor.id)
  if (!learner) return <Empty>Không tìm thấy học sinh. <Link to="/dashboard/learners">Về danh sách</Link></Empty>
  const results = db.submissions.filter(s => s.learnerId === id && s.ownerId === actor.id)
  const events = db.events.filter(e => e.learnerId === id && e.ownerId === actor.id).toReversed()
  return <><Heading title={learner.name} description={`${learner.code} · ${learner.status === 'active' ? 'Đang hoạt động' : 'Đã thu hồi'} · Tạo lúc ${dateLabel(learner.createdAt)}`}/><section className="ws-card"><h2>Tiến độ học tập</h2><Empty>Chưa có dữ liệu tiến độ chương/bài học từ gameplay.</Empty></section><section className="ws-card"><h2>Kết quả Quiz</h2>{results.length ? results.map(r => <div className="ws-list-row" key={r.id}><span>{r.title}<small>{dateLabel(r.submittedAt)}</small></span><strong>{r.correct}/{r.total}</strong></div>) : <Empty>Chưa có bài kiểm tra đã nộp.</Empty>}</section><section className="ws-card"><h2>Nhật ký hành trình tài khoản</h2>{events.map(e => <div className="ws-list-row" key={e.id}><span>{e.detail}<small>{dateLabel(e.at)}</small></span></div>)}</section></>
}
export function Groups() {
  const { actor, db } = useWorkspace()
  const learners = activeLearners(db, actor.id)
  const groups = db.groups.filter(g => g.ownerId === actor.id)
  const [editing, edit] = useState(null)
  return <><Heading title="Nhóm học sinh" description="Sắp xếp học sinh để giao bài kiểm tra. Một học sinh có thể ở nhiều nhóm."><button className="ws-btn primary" onClick={() => edit({ name: '', learnerIds: [] })}>+ Tạo nhóm</button></Heading><div className="ws-grid three">{groups.map(g => <article className="ws-card" key={g.id}><Users/><h2>{g.name}</h2><p>{g.learnerIds.length} học sinh</p><button className="ws-btn" onClick={() => edit(g)}>Chỉnh sửa nhóm</button></article>)}</div>{!groups.length && <Empty>Chưa có nhóm. Kích hoạt các slot học sinh rồi thêm vào nhóm.</Empty>}{editing && <Modal title={editing.id ? 'Chỉnh sửa nhóm' : 'Tạo nhóm'} description="Chỉ hiển thị học sinh đang hoạt động thuộc tài khoản của bạn." onClose={() => edit(null)}><ActionForm onSubmit={form => { dispatch('SAVE_GROUP', { id: editing.id, name: form.get('name'), learnerIds: form.getAll('learner') }); edit(null) }}><label>Tên nhóm<input name="name" required defaultValue={editing.name} maxLength={80}/></label><div className="ws-checks">{learners.map(l => <label key={l.id}><input type="checkbox" name="learner" value={l.id} defaultChecked={editing.learnerIds.includes(l.id)}/>{l.name} <small>{l.code}</small></label>)}</div></ActionForm></Modal>}</>
}
