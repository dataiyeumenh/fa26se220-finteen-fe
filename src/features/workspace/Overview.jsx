import { Link } from 'react-router-dom'
import { ArrowUpRight, Users, BookOpen, ClipboardCheck, Sprout } from 'lucide-react'
import { useState } from 'react'
import { useWorkspace } from './useWorkspace'
import { PLANS, activeLearners } from './model'
import { dispatch } from './demoStore'
import { Heading, Empty, Modal, ActionForm, Notice } from './ui'

export function Overview() {
  const { db, actor } = useWorkspace()
  const learners = activeLearners(db, actor.id)
  const results = db.submissions.filter(s => s.ownerId === actor.id)
  const plan = PLANS[actor.plan]
  return <><Heading title={`Chào ${actor.name}!`} description="Cùng con và học sinh xây dựng những thói quen tài chính tốt."/>
    <section className="ws-hero"><div><span className="ws-pill">{plan ? `Gói ${plan.name} · Không thời hạn` : 'Bắt đầu hành trình'}</span><h2>{plan ? 'Một nơi để đồng hành, từng bước trưởng thành.' : 'Khám phá FinTeen cùng chương học đầu tiên.'}</h2><p>{plan ? `${learners.length}/${plan.capacity} tài khoản học sinh đã được kích hoạt.` : 'Trải nghiệm chương 1 miễn phí. Chọn gói khi bạn sẵn sàng đồng hành cùng học sinh.'}</p><Link className="ws-btn primary" to={plan ? '/dashboard/learners' : '/dashboard/demo'}>{plan ? 'Quản lý học sinh' : 'Khám phá chương 1'} <ArrowUpRight size={18}/></Link></div><Sprout className="ws-hero-art" aria-hidden="true"/></section>
    <div className="ws-grid three">{[[Users, 'Học sinh hoạt động', learners.length], [BookOpen, 'Chương được mở khóa', plan ? 8 : 1], [ClipboardCheck, 'Bài kiểm tra đã nộp', results.length]].map(([Icon, title, value]) => <article className="ws-card ws-stat" key={title}><Icon/><p>{title}</p><strong>{value}</strong></article>)}</div>
    <section className="ws-card"><h2>Việc tiếp theo</h2>{!plan ? <p>Chọn gói Gia đình để nhận 4 slot, hoặc gói Giáo viên để nhận 40 slot cùng nhóm và Quiz.</p> : !learners.length ? <p>Các slot đang ở trạng thái chưa kích hoạt. Tạo tài khoản và đặt PIN để học sinh có thể đăng nhập.</p> : <p>Xem từng học sinh trong mục Tiến độ & báo cáo. Kết quả Quiz sẽ xuất hiện sau khi học sinh nộp bài.</p>}<Link className="ws-text-link" to={!plan ? '/dashboard/plans' : '/dashboard/reports'}>{!plan ? 'Xem các gói' : 'Xem báo cáo'} →</Link></section>
  </>
}
export function Plans() {
  const { actor } = useWorkspace()
  const [selected, select] = useState(null)
  return <><Heading title="Chọn cách bạn đồng hành" description="Mở khóa một lần, sử dụng không thời hạn. Học sinh kế thừa nội dung từ tài khoản của bạn."/>
    <div className="ws-grid two">{Object.entries(PLANS).map(([key, plan]) => <article key={key} className={`ws-card ws-plan ${key === 'teacher' ? 'featured' : ''}`}><span className="ws-pill">{key === 'parent' ? 'CHO GIA ĐÌNH' : 'CHO LỚP HỌC'}</span><h2>{plan.name}</h2><div className="ws-plan-number">{plan.capacity}<span> slot học sinh</span></div><p>Giá chính thức chưa công bố</p><ul><li>Mở khóa toàn bộ 8 chương, không thời hạn</li><li>Mã đăng nhập riêng và PIN do bạn đặt</li><li>Theo dõi hành trình, báo cáo và xuất file</li>{key === 'teacher' && <li>Nhóm học sinh và giao bài kiểm tra Quiz</li>}</ul><button className="ws-btn primary" disabled={Boolean(actor.plan)} onClick={() => select(key)}>{actor.plan === key ? 'Gói đang sử dụng' : actor.plan ? 'Đã có gói khác' : 'Kích hoạt gói thử'}</button></article>)}</div>
    <p className="ws-muted">Chưa hỗ trợ mua đồng thời hoặc chuyển giữa hai gói vì quy tắc này chưa được chốt.</p>
    {selected && <Modal title={`Kích hoạt thử gói ${PLANS[selected].name}`} description="Đây là mô phỏng trên trình duyệt, không thu tiền và không tạo giao dịch thật." onClose={() => select(null)}><ActionForm submit="Xác nhận kích hoạt thử" onSubmit={() => { dispatch('ACTIVATE_DEMO_PLAN', { plan: selected }); select(null) }}><p>Bạn sẽ nhận {PLANS[selected].capacity} slot chưa kích hoạt và mở khóa 8 chương.</p></ActionForm></Modal>}
  </>
}
export function Settings() {
  const { actor } = useWorkspace()
  const [message, setMessage] = useState('')
  return <><Heading title="Tài khoản của bạn" description="Thông tin dùng chung cho không gian phụ huynh và giáo viên."/><section className="ws-card"><ActionForm onSubmit={form => { dispatch('UPDATE_PROFILE', { name: form.get('name') }); setMessage('Đã cập nhật tên.') }}><label>Họ tên<input name="name" defaultValue={actor.name} required maxLength={80}/></label><label>Email<input value={actor.email} readOnly/></label><p>Gói: {PLANS[actor.plan]?.name || 'Chưa có gói'} · {actor.plan ? 'Không thời hạn' : 'Dùng thử chương 1'}</p></ActionForm><Notice text={message}/></section></>
}
export function LearnerHome() {
  const { actor, db } = useWorkspace()
  const pending = db.assignments.filter(a => a.learnerIds.includes(actor.id) && !db.submissions.some(s => s.assignmentId === a.id && s.learnerId === actor.id))
  return <><Heading eyebrow="FINTEEN · GÓC HỌC TẬP" title={`Sẵn sàng khám phá, ${actor.name}?`} description="Mỗi chương là một bước trên hành trình hiểu và sử dụng tiền thông minh."/><section className="ws-hero"><div><span className="ws-pill">8 chương được mở khóa</span><h2>Hành trình của bạn bắt đầu từ đây.</h2><p>Tài khoản của bạn kế thừa gói {PLANS[actor.plan].name}.</p><Link className="ws-btn primary" to="/dashboard/kid/lessons">Mở bản đồ hành trình →</Link></div><Sprout className="ws-hero-art"/></section>{actor.plan === 'teacher' && <section className="ws-card"><h2>Quiz của bạn</h2><p>{pending.length} bài đang chờ hoàn thành.</p><Link className="ws-text-link" to="/dashboard/kid/quiz">Vào Quiz →</Link></section>}<Empty>Tiến độ trò chơi chưa kết nối với hệ thống báo cáo. Kết quả bài kiểm tra được lưu riêng cho tài khoản của bạn.</Empty></>
}
