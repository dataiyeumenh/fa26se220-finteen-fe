import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Award, BarChart3, BookOpen, Clock3, Compass, Gamepad2, History, Map, PlayCircle, RefreshCw, ShieldCheck, Users, WalletCards } from 'lucide-react'
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
const PAYMENT_STATUS = { PENDING: 'Chờ thanh toán', PAID: 'Đã thanh toán', FAILED: 'Không thành công' }
const paymentDateTime = value => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—'

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
  const [payments, setPayments] = useState([])
  const [paymentPage, setPaymentPage] = useState(0)
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [hasMorePayments, setHasMorePayments] = useState(false)
  const load = async () => {
    setLoading(true); setError('')
    try { setPlans(await auth.listPlans() || []) }
    catch (loadError) { setError(loadError.message) }
    finally { setLoading(false) }
  }
  const loadPayments = async (page = 0, append = false) => {
    setPaymentsLoading(true)
    try {
      const result = await auth.listPayments({ page, size: 10 })
      const rows = Array.isArray(result) ? result : Array.isArray(result?.content) ? result.content : []
      setPayments(current => append ? [...current, ...rows] : rows)
      setPaymentPage(page)
      setHasMorePayments(rows.length === 10)
    } catch (loadError) { setError(loadError.message) }
    finally { setPaymentsLoading(false) }
  }
  // Public plan prices are loaded independently from the account's owned entitlements.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); void loadPayments(); void auth.ensureEntitlements().catch(() => {}) }, [])
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
  return <><Heading title="Gói học tập" description="Chọn gói phù hợp để đồng hành cùng trẻ trên hành trình tài chính."><button className="ws-btn" onClick={() => { void load(); void loadPayments() }} disabled={loading || paymentsLoading}><RefreshCw size={16}/> Làm mới</button></Heading>
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
    <section className="ws-card ws-payment-history"><div className="ws-row"><div><h2>Lịch sử thanh toán</h2><p>Các giao dịch mua mới và gia hạn gói, mới nhất trước.</p></div><button className="ws-btn" onClick={() => void loadPayments()} disabled={paymentsLoading}><RefreshCw size={15}/> Cập nhật</button></div>{paymentsLoading && !payments.length ? <Empty>Đang tải lịch sử thanh toán…</Empty> : payments.length ? <div className="ws-table-wrap"><table><thead><tr><th>Mã đơn</th><th>Gói</th><th>Loại</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th></tr></thead><tbody>{payments.map(row => <tr key={row.orderCode}><td><strong>{row.orderCode}</strong></td><td>{PLAN_NAME[row.kind] || row.kind}</td><td>{row.purpose === 'RENEW' ? 'Gia hạn' : 'Mua mới'}</td><td><strong>{money(row.amount)}</strong></td><td><span className={`ws-payment-status ${String(row.status).toLowerCase()}`}>{PAYMENT_STATUS[row.status] || row.status}</span></td><td>{paymentDateTime(row.paidAt || row.createdAt)}<small>{row.paidAt ? 'Thời điểm thanh toán' : 'Thời điểm tạo đơn'}</small></td></tr>)}</tbody></table></div> : <Empty>Bạn chưa có giao dịch thanh toán nào.</Empty>}{hasMorePayments && <button className="ws-btn ws-load-more" disabled={paymentsLoading} onClick={() => void loadPayments(paymentPage + 1, true)}>{paymentsLoading ? 'Đang tải…' : 'Xem thêm giao dịch'}</button>}</section>
    {payment && <div className="payment-overlay" role="dialog" aria-modal="true" aria-label="Thanh toán gói học tập"><PaymentResult payment={payment} onClose={() => { setPayment(null); void loadPayments() }}/></div>}
  </>
}
export function Settings() {
  const { actor } = useWorkspace()
  return <AccountSettings actor={actor}/>
}
export function LearnerHome() {
  const { actor, learnerDashboard: dashboard, learnerDashboardLoading: loading, learnerDashboardError: error } = useWorkspace()
  const navigate = useNavigate()
  useEffect(() => {
    void auth.ensureLearnerDashboard().catch(apiError => {
      if ([3007, 3009].includes(apiError.code)) navigate('/login?as=kid&reason=slot-ended', { replace: true })
      else if (apiError.code === 3003) navigate('/login?as=kid', { replace: true })
    })
  }, [navigate])
  if (loading && !dashboard) return <Empty>Đang tải không gian học tập…</Empty>
  if (error && !dashboard) return <Empty>{error} <button className="ws-btn" onClick={() => void auth.ensureLearnerDashboard({ force: true })}>Thử lại</button></Empty>
  if (!dashboard) return <Empty>Chưa có dữ liệu dashboard.</Empty>
  const { learner, progress, quizzes, achievements = [], recentActivities = [] } = dashboard
  const isStudent = learner.groupContext === 'CLASS'
  const total = progress.totalChapters
  const completed = progress.completedChapters || 0
  const percent = total ? Math.min(100, Math.round(completed / total * 100)) : null
  const continueChapter = progress.continueChapter
  return <>
    <section className="ws-kid-welcome"><div><span><Compass size={15}/> FINTEEN · HÀNH TRÌNH CỦA BẠN</span><h1>Chào {learner.displayName || actor.name}!</h1><p>{isStudent ? 'Học sinh' : 'Con trong gia đình'} <i/> {learner.groupName}</p></div><div className="ws-kid-welcome-note"><strong>Mỗi lựa chọn nhỏ</strong><span>đều tạo nên một tương lai lớn.</span></div></section>
    <section className="ws-kid-journey-card">
      <div className="ws-kid-journey-main"><span className="ws-kid-section-label">{completed ? 'TIẾP TỤC HÀNH TRÌNH' : 'ĐIỂM KHỞI ĐẦU'}</span><h2>{continueChapter ? <>Chương <em>{String(continueChapter).padStart(2, '0')}</em> đang chờ bạn</> : 'Bạn đã hoàn thành hành trình hiện tại'}</h2><p>{total === null ? 'Bản đồ hành trình đã sẵn sàng. Bắt đầu chương đầu tiên và khám phá cách tiền vận hành trong cuộc sống.' : `Bạn đã hoàn thành ${completed} trong ${total} chương của hành trình.`}</p>{percent !== null && <div className="ws-kid-progress"><div><span>Tiến độ của bạn</span><strong>{percent}%</strong></div><div className="ws-progress-track" aria-label={`Tiến độ học tập ${percent}%`}><span style={{ width: `${percent}%` }}/></div></div>}{continueChapter && <Link className="ws-btn primary" to={`/dashboard/kid/play?chapter=${continueChapter}`}><PlayCircle size={18}/> {completed ? 'Học tiếp chương này' : 'Bắt đầu khám phá'} <ArrowRight size={17}/></Link>}</div>
      <div className="ws-kid-journey-aside"><div className="ws-journey-orbit"><Map/><span>{String(completed).padStart(2, '0')}</span><small>{total ? `/ ${total} chương` : 'chương đã xong'}</small></div><div className="ws-kid-mini-metrics"><div><BookOpen/><span><strong>{completed}</strong>Đã hoàn thành</span></div><div><Award/><span><strong>{achievements.length}</strong>Huy hiệu</span></div>{isStudent && <div><Clock3/><span><strong>{quizzes?.pending?.length || 0}</strong>Quiz đang chờ</span></div>}</div></div>
    </section>
    <div className="ws-kid-dashboard-grid"><section className="ws-card ws-kid-shortcuts"><div className="ws-kid-section-head"><div><span className="ws-kid-section-label">KHÁM PHÁ</span><h2>Đi đâu tiếp theo?</h2></div></div><div className="ws-kid-shortcut-list"><Link to="/dashboard/kid/lessons"><span><Map/></span><div><strong>Bản đồ hành trình</strong><small>Xem lộ trình qua các vùng</small></div><ArrowRight/></Link><Link to="/dashboard/kid/games"><span><Gamepad2/></span><div><strong>Trò chơi theo chương</strong><small>Chọn thẳng câu chuyện muốn chơi</small></div><ArrowRight/></Link><Link to="/dashboard/kid/achievements"><span><Award/></span><div><strong>Bộ sưu tập huy hiệu</strong><small>{achievements.length ? `${achievements.length} huy hiệu đã mở khóa` : 'Huy hiệu đầu tiên đang chờ bạn'}</small></div><ArrowRight/></Link>{isStudent && <Link to="/dashboard/kid/quiz"><span><Clock3/></span><div><strong>Quiz của lớp</strong><small>{quizzes?.pending?.length ? `${quizzes.pending.length} bài đang chờ` : 'Không có bài cần làm'}</small></div><ArrowRight/></Link>}</div></section>
    <section className="ws-card ws-learner-activity"><div className="ws-kid-section-head"><div><span className="ws-kid-section-label">NHẬT KÝ</span><h2>Hoạt động gần đây</h2></div>{progress.lastPlayedAt && <small>Học gần nhất {dateTimeLabel(progress.lastPlayedAt)}</small>}</div>{recentActivities.length ? <div className="ws-activity-list">{recentActivities.map((activity, index) => <div key={`${activity.type}-${activity.at}-${index}`}><span>{activity.label}</span><time>{dateTimeLabel(activity.at)}</time></div>)}</div> : <div className="ws-kid-activity-empty"><span><History/></span><strong>Nhật ký đang chờ dấu mốc đầu tiên</strong><p>Hoàn thành một chương để bắt đầu ghi lại hành trình của bạn.</p><Link to="/dashboard/kid/lessons">Mở bản đồ <ArrowRight size={15}/></Link></div>}</section></div>
  </>
}

const ACHIEVEMENT_NAMES = { PIGGY_GOLD: 'Heo đất vàng' }
const dateTimeLabel = value => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : ''

export function LearnerAchievements() {
  const { learnerDashboard: dashboard, learnerDashboardLoading: loading, learnerDashboardError: error } = useWorkspace()
  useEffect(() => { void auth.ensureLearnerDashboard().catch(() => {}) }, [])
  if (loading && !dashboard) return <Empty>Đang tải thành tích…</Empty>
  if (error && !dashboard) return <Empty>{error} <button className="ws-btn" onClick={() => void auth.ensureLearnerDashboard({ force: true })}>Thử lại</button></Empty>
  const achievements = dashboard?.achievements || []
  return <><Heading title="Thành tích của bạn" description="Những huy hiệu bạn đã đạt được trong hành trình học tài chính."/>{achievements.length ? <div className="ws-grid three">{achievements.map(item => <article className="ws-card ws-achievement" key={`${item.code}-${item.earnedAt}`}><Award/><h2>{ACHIEVEMENT_NAMES[item.code] || item.code}</h2><p>Đạt ngày {dateTimeLabel(item.earnedAt)}</p></article>)}</div> : <Empty>Chưa có huy hiệu. Hoàn thành các chương để mở khóa thành tích đầu tiên.</Empty>}</>
}
