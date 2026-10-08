import { useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Users, Layers, ClipboardList, BarChart3, Settings, LogOut, Package, GraduationCap, Gamepad2, Store, Play, CalendarDays, AlertTriangle } from 'lucide-react'
import { useWorkspace } from './useWorkspace'
import { auth } from '../../api/auth.api'
import './workspace.css'
import './role-theme.css'
import { currentEntitlements, daysUntilExpiry, formatPlanDate, PLAN_LIMIT, PLAN_NAME } from './entitlements'

export default function WorkspaceLayout({ children }) {
  const { actor, entitlements, entitlementsLoading } = useWorkspace()
  const navigate = useNavigate()
  const learner = actor?.role === 'kid'
  const teacher = actor?.role === 'teacher'
  const paid = actor?.role === 'parent' || teacher
  const dualContext = actor?.plans?.includes('parent') && actor?.plans?.includes('teacher')
  const activeEntitlements = currentEntitlements(actor, entitlements)
  const expiringEntitlements = activeEntitlements.map(item => ({ ...item, daysLeft: daysUntilExpiry(item.expiresOn) })).filter(item => item.daysLeft !== null && item.daysLeft >= 0 && item.daysLeft <= 7)
  useEffect(() => { if (!learner) void auth.ensureEntitlements().catch(() => {}) }, [learner])
  const label = learner ? actor?.learnerRole === 'student' ? 'Học sinh' : 'Con trong gia đình' : teacher ? 'Giáo viên' : paid ? 'Phụ huynh' : 'Khách · dùng thử'
  const links = learner ? [
    ['/dashboard/kid', 'Góc học tập', Home],
    ['/dashboard/kid/lessons', 'Bài học', BookOpen],
    ['/dashboard/kid/games', 'Trò chơi', Gamepad2],
    ['/dashboard/kid/shop', 'Cửa hàng', Store],
    ...(actor?.plan === 'teacher' ? [['/dashboard/kid/quiz', 'Quiz', ClipboardList]] : []),
  ] : [
    ['/dashboard', 'Tổng quan', Home], ['/dashboard/plans', 'Gói học tập', Package],
    ...(actor?.role === 'guest' ? [['/dashboard/demo', 'Dùng thử chương 1', Play]] : []),
    ...(paid ? [['/dashboard/learners', teacher ? 'Học sinh & slot' : 'Các con & slot', Users], ['/dashboard/reports', 'Tiến độ & báo cáo', BarChart3]] : []),
    ...(teacher ? [['/dashboard/groups', 'Nhóm học sinh', Layers], ['/dashboard/quiz-management', 'Quản lý Quiz', ClipboardList]] : []),
    ['/dashboard/settings', 'Tài khoản', Settings],
  ]
  return <div className={`ws ${learner ? 'ws-kid' : 'ws-adult'}`} data-ws-role={actor?.role || 'guest'}>
    <aside className="ws-sidebar">
      <Link to="/" className="ws-brand"><span>F</span> FinTeen</Link>
      <div className="ws-identity"><GraduationCap size={25}/><strong>{actor?.name}</strong><small>{label}</small>{!learner && actor?.role !== 'guest' && <div className="ws-profile-plans"><CalendarDays size={14}/>{entitlementsLoading && !entitlements ? <span>Đang tải thông tin gói…</span> : activeEntitlements.length ? <div>{activeEntitlements.map(item => <span className="ws-profile-plan" key={item.id}><strong>{PLAN_NAME[item.kind] || item.kind}</strong><small>Hạn mức {PLAN_LIMIT[item.kind] || '—'} · {item.renewalCount ? 'đã gia hạn đến' : 'dùng đến'} {formatPlanDate(item.expiresOn)}</small></span>)}</div> : <span>Chưa có thông tin gói</span>}</div>}</div>
      {dualContext && <fieldset className="ws-context-switch"><legend>Phạm vi đang dùng</legend>
        <label><input type="radio" name="workspace-context" checked={actor.role === 'parent'} onChange={() => { auth.setContext('parent'); navigate('/dashboard') }}/> Phụ huynh</label>
        <label><input type="radio" name="workspace-context" checked={actor.role === 'teacher'} onChange={() => { auth.setContext('teacher'); navigate('/dashboard') }}/> Giáo viên</label>
      </fieldset>}
      <nav aria-label="Điều hướng dashboard">{links.map(([to, text, Icon]) => <NavLink end key={to} to={to}><Icon size={19}/>{text}</NavLink>)}</nav>
      <button className="ws-logout" onClick={() => { auth.logout(); navigate('/login') }}><LogOut size={18}/> Đăng xuất</button>
    </aside>
    <div className="ws-main"><header className="ws-top"><span>Không gian {learner ? 'học tập' : 'đồng hành'}</span><span className="ws-pill">{label}</span></header>
      <div className="ws-demo"><strong>Chưa kết nối máy chủ:</strong> báo cáo và bài kiểm tra hiện vẫn dùng dữ liệu minh họa.</div>
      <main className="ws-content">{expiringEntitlements.length > 0 && <aside className="ws-expiry-alert" role="alert"><AlertTriangle/><div><strong>Gói học tập sắp hết hạn</strong>{expiringEntitlements.map(item => <p key={item.id}>{PLAN_NAME[item.kind] || item.kind} {item.daysLeft === 0 ? 'hết hạn hôm nay' : `còn ${item.daysLeft} ngày`} (đến {formatPlanDate(item.expiresOn)}). <Link to="/dashboard/plans">Gia hạn ngay</Link></p>)}</div></aside>}{children}</main>
    </div>
  </div>
}
