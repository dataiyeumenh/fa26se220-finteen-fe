import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, BookOpen, RefreshCw, ShieldCheck, Users, WalletCards } from 'lucide-react'
import { useWorkspace } from './useWorkspace'
import { PLANS } from './model'
import { Heading, Empty } from './ui'
import AccountSettings from '../auth/AccountSettings'
import { auth } from '../../api/auth.api'
import PaymentResult from './PaymentResult'
import { currentEntitlements, formatPlanDate, PLAN_NAME } from './entitlements'

const money = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0))
const PLAN_COPY = {
  PARENT: { name: 'Gói Gia đình', description: 'Đồng hành cùng con và theo dõi hành trình học tài chính.', benefits: ['Tối đa 4 hồ sơ trẻ', 'Đầy đủ 8 chương học', 'Theo dõi tiến độ học tập'] },
  TEACHER: { name: 'Gói Giáo viên', description: 'Tổ chức lớp học và quản lý hành trình của học sinh.', benefits: ['Tối đa 40 học sinh', 'Quản lý lớp và bài kiểm tra', 'Báo cáo kết quả học tập'] },
}

export function Overview() {
  const { actor } = useWorkspace()
  const teacher = actor.role === 'teacher'
  return <><Heading title={`Chào ${actor.name}!`} description="Cùng xem nhanh không gian FinTeen của bạn hôm nay."/>
    <section className="ws-overview-hero"><div><span className="ws-overview-kicker">TỔNG QUAN TÀI KHOẢN</span><h2>{teacher ? 'Lớp học đã sẵn sàng để tiếp tục' : 'Cùng đồng hành trên hành trình tài chính'}</h2><p>{teacher ? 'Quản lý học sinh, nhóm học và tiến độ tại cùng một nơi.' : 'Theo dõi các con, thời hạn gói và kết quả học tập thật thuận tiện.'}</p><Link className="ws-btn primary" to={teacher ? '/dashboard/groups' : '/dashboard/learners'}>{teacher ? 'Mở nhóm học sinh' : 'Xem danh sách các con'}</Link></div><BookOpen /></section>
    <div className="ws-overview-grid"><Link to="/dashboard/plans" className="ws-overview-tile"><span><WalletCards /></span><div><small>Gói đang dùng</small><strong>{actor.plans.length || 0}</strong><p>{actor.plans.map(p => PLANS[p].name).join(' + ') || 'Chưa có gói học tập'}</p></div></Link><Link to="/dashboard/learners" className="ws-overview-tile"><span><Users /></span><div><small>{teacher ? 'Học sinh & slot' : 'Các con & slot'}</small><strong>Quản lý</strong><p>Xem hồ sơ và quyền truy cập</p></div></Link><Link to="/dashboard/reports" className="ws-overview-tile"><span><BarChart3 /></span><div><small>Tiến độ học tập</small><strong>Báo cáo</strong><p>Theo dõi kết quả theo thời gian</p></div></Link></div>
    <section className="ws-card ws-account-strip"><span><ShieldCheck /></span><div><h2>Tài khoản đã kết nối</h2><p>Gói hiện có: {actor.plans.map(p => PLANS[p].name).join(' + ') || 'Chưa có gói'}.</p></div><Link className="ws-btn" to="/dashboard/settings">Quản lý tài khoản</Link>{actor.role === 'guest' && <Link className="ws-btn" to="/dashboard/demo">Chơi thử</Link>}</section></>
}
export function Plans() {
  const { actor, entitlements, entitlementsLoading } = useWorkspace()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [buying, setBuying] = useState('')
  const [payment, setPayment] = useState(null)
  const load = async () => {
    setLoading(true); setError('')
    try { setPlans(await auth.listPlans() || []) }
    catch (loadError) { setError(loadError.message) }
    finally { setLoading(false) }
  }
  // Public plan prices are loaded independently from the account's owned entitlements.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); void auth.ensureEntitlements().catch(() => {}) }, [])
  const activeEntitlements = currentEntitlements(actor, entitlements)
  const buy = async kind => {
    setBuying(kind); setError('')
    try {
      const created = await auth.createPayment(kind)
      setPayment(created)
      setBuying('')
    } catch (buyError) {
      setError(buyError.message); setBuying('')
    }
  }
  return <><Heading title="Gói học tập" description="Chọn gói phù hợp để đồng hành cùng trẻ trên hành trình tài chính."><button className="ws-btn" onClick={() => void load()} disabled={loading}><RefreshCw size={16}/> Làm mới</button></Heading>
    <section className="ws-card ws-current-plan"><div><strong>Gói đang có</strong><p>{actor.plans.map(p => PLANS[p].name).join(' + ') || 'Tài khoản của bạn hiện chưa có gói học tập.'}</p></div>{entitlementsLoading && !entitlements ? <span className="ws-plan-validity">Đang tải thời hạn…</span> : activeEntitlements.length > 0 && <div className="ws-plan-validities">{activeEntitlements.map(item => <span className="ws-plan-validity" key={item.id}><strong>{PLAN_NAME[item.kind] || item.kind}</strong><span>Kỳ hiện tại: {formatPlanDate(item.startsOn)} – {formatPlanDate(item.currentExpiresOn || item.expiresOn)}</span>{item.renewalCount > 0 && <span>Đã gia hạn đến: {formatPlanDate(item.expiresOn)}</span>}</span>)}</div>}</section>
    {error && <p className="ws-notice" role="alert">{error}</p>}
    {loading ? <Empty>Đang tải bảng giá…</Empty> : plans.length ? <div className="ws-grid two ws-public-plans">{plans.map(plan => {
      const copy = PLAN_COPY[plan.kind] || { name: plan.kind, description: 'Gói học tập FinTeen.', benefits: [] }
      const owned = actor.plans.includes(String(plan.kind).toLowerCase())
      return <article className={`ws-card ws-plan ws-plan-${String(plan.kind).toLowerCase()} ${plan.kind === 'TEACHER' ? 'featured' : ''}`} key={plan.kind}>
        <div className="ws-row"><span className="ws-pill">{plan.kind}</span>{owned && <span className="ws-owned-plan">Đang sử dụng</span>}</div>
        <h2>{copy.name}</h2><p>{copy.description}</p>
        <div className="ws-plan-number">{money(plan.price)} <span>/ {plan.months} tháng</span></div>
        <ul>{copy.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
        <button className="ws-btn primary" disabled={Boolean(buying)} onClick={() => void buy(plan.kind)}>{buying === plan.kind ? 'Đang tạo đơn…' : owned ? 'Gia hạn gói' : 'Mua gói ngay'}</button>
        <small className="ws-plan-note">Mã VietQR và thông tin chuyển khoản sẽ hiển thị ngay tại đây.</small>
      </article>
    })}</div> : <Empty>Hiện chưa có gói nào được mở bán.</Empty>}
    {payment && <div className="payment-overlay" role="dialog" aria-modal="true" aria-label="Thanh toán gói học tập"><PaymentResult payment={payment} onClose={() => setPayment(null)}/></div>}
  </>
}
export function Settings() {
  const { actor } = useWorkspace()
  return <AccountSettings actor={actor}/>
}
export function LearnerHome() {
  return <Empty>Không gian học sinh đang chờ kết nối API SLOT.</Empty>
}
