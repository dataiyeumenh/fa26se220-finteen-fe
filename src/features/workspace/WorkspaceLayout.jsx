import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Users, Layers, ClipboardList, BarChart3, Settings, LogOut, Package, Gamepad2, Store, Play, CalendarDays, AlertTriangle, Bell, ChevronDown, UserRound, CheckCircle2 } from 'lucide-react'
import { useWorkspace } from './useWorkspace'
import { auth } from '../../api/auth.api'
import { Button } from '@/components/ui/button'
import './workspace.css'
import './workspace-header.css'
import './workspace-visuals.css'
import './role-theme.css'
import './workspace-design-system.css'
import { currentEntitlements, daysUntilExpiry, formatPlanDate, PLAN_LIMIT, PLAN_NAME } from './entitlements'

export default function WorkspaceLayout({ children }) {
  const { actor, entitlements, entitlementsLoading } = useWorkspace()
  const navigate = useNavigate()
  const location = useLocation()
  const learner = actor?.role === 'kid'
  const teacher = actor?.role === 'teacher'
  const paid = actor?.role === 'parent' || teacher
  const dualContext = actor?.plans?.includes('parent') && actor?.plans?.includes('teacher')
  const activeEntitlements = currentEntitlements(actor, entitlements)
  const expiringEntitlements = activeEntitlements.map(item => ({ ...item, daysLeft: daysUntilExpiry(item.expiresOn) })).filter(item => item.daysLeft !== null && item.daysLeft >= 0 && item.daysLeft <= 7)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
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
  const closeMenus = () => { setProfileOpen(false); setNotificationsOpen(false) }
  const pageTheme = location.pathname.includes('/plans') ? 'packages' : location.pathname.includes('/learners') ? 'children' : location.pathname.includes('/reports') ? 'reports' : location.pathname.includes('/settings') ? 'account' : location.pathname.includes('/groups') ? 'groups' : location.pathname.includes('/quiz') ? 'quiz' : location.pathname.includes('/games') || location.pathname.includes('/shop') || location.pathname.includes('/lessons') ? 'learning' : 'overview'
  return <div className={`ws ${learner ? 'ws-kid' : 'ws-adult'}`} data-ws-role={actor?.role || 'guest'} data-ws-page={pageTheme}>
    <aside className="ws-sidebar">
      <Link to="/" className="ws-brand"><img src="/brand/finteen-logo-v2.png" alt="FinTeen" /></Link>
      {dualContext && <div className="ws-context-switch" aria-label="Chuyển phạm vi sử dụng"><span>Không gian làm việc</span><div><Button type="button" variant={actor.role === 'parent' ? 'default' : 'ghost'} size="sm" className={actor.role === 'parent' ? 'ws-role-button active' : 'ws-role-button'} aria-pressed={actor.role === 'parent'} onClick={() => { auth.setContext('parent'); navigate('/dashboard') }}><UserRound/> Phụ huynh</Button><Button type="button" variant={actor.role === 'teacher' ? 'default' : 'ghost'} size="sm" className={actor.role === 'teacher' ? 'ws-role-button active' : 'ws-role-button'} aria-pressed={actor.role === 'teacher'} onClick={() => { auth.setContext('teacher'); navigate('/dashboard') }}><BookOpen/> Giáo viên</Button></div></div>}
      <nav aria-label="Điều hướng dashboard">{links.map(([to, text, Icon]) => <NavLink end key={to} to={to}><Icon size={19}/>{text}</NavLink>)}</nav>
      <button className="ws-logout" onClick={() => { auth.logout(); navigate('/login') }}><LogOut size={18}/> Đăng xuất</button>
    </aside>
    <div className="ws-main"><header className="ws-top">
      <div className="ws-top-title"><strong>Không gian {learner ? 'học tập' : 'đồng hành'}</strong><small>{teacher ? 'Quản lý lớp học và tiến độ học sinh' : learner ? 'Tiếp tục hành trình tài chính của bạn' : 'Theo dõi hành trình học tập trong một nơi'}</small></div>
      <div className="ws-top-actions">
        <div className="ws-header-menu">
          <button className="ws-notification-button" type="button" aria-label="Thông báo" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(value => !value); setProfileOpen(false) }}><Bell size={20}/>{expiringEntitlements.length > 0 && <span>{expiringEntitlements.length}</span>}</button>
          {notificationsOpen && <div className="ws-header-dropdown ws-notification-dropdown"><div className="ws-dropdown-heading"><strong>Thông báo</strong><span>{expiringEntitlements.length || 0} mới</span></div>{expiringEntitlements.length ? expiringEntitlements.map(item => <Link to="/dashboard/plans" onClick={closeMenus} className="ws-notification-item" key={item.id}><AlertTriangle size={18}/><div><strong>{PLAN_NAME[item.kind] || item.kind} sắp hết hạn</strong><small>{item.daysLeft === 0 ? 'Hết hạn hôm nay' : `Còn ${item.daysLeft} ngày`} · đến {formatPlanDate(item.expiresOn)}</small></div></Link>) : <div className="ws-notification-empty"><CheckCircle2/><strong>Bạn đã xem hết thông báo</strong><small>Hiện chưa có thông báo mới.</small></div>}</div>}
        </div>
        <div className="ws-header-menu">
          <button className="ws-profile-trigger" type="button" aria-expanded={profileOpen} onClick={() => { setProfileOpen(value => !value); setNotificationsOpen(false) }}><span className="ws-profile-avatar">{String(actor?.name || 'F').trim().charAt(0).toUpperCase()}</span><span className="ws-profile-copy"><strong>{actor?.name || 'Tài khoản FinTeen'}</strong><small>{label}</small></span><ChevronDown className={profileOpen ? 'is-open' : ''} size={18}/></button>
          {profileOpen && <div className="ws-header-dropdown ws-profile-dropdown"><div className="ws-profile-summary"><span className="ws-profile-avatar large"><UserRound size={21}/></span><div><strong>{actor?.name || 'Tài khoản FinTeen'}</strong><small>{label}</small></div></div>{!learner && actor?.role !== 'guest' && <div className="ws-dropdown-plans"><div className="ws-dropdown-heading"><strong>Gói đang sử dụng</strong><CalendarDays size={16}/></div>{entitlementsLoading && !entitlements ? <p>Đang tải thông tin gói…</p> : activeEntitlements.length ? activeEntitlements.map(item => <div className="ws-dropdown-plan" key={item.id}><div><strong>{PLAN_NAME[item.kind] || item.kind}</strong><span>Đang hoạt động</span></div><small>Hạn mức {PLAN_LIMIT[item.kind] || '—'}</small><small>{item.renewalCount ? 'Đã gia hạn đến' : 'Sử dụng đến'} <b>{formatPlanDate(item.expiresOn)}</b></small></div>) : <p>Chưa có thông tin gói.</p>}</div>}<div className="ws-dropdown-links"><Link to="/dashboard/settings" onClick={closeMenus}><Settings size={17}/> Quản lý tài khoản</Link>{!learner && <Link to="/dashboard/plans" onClick={closeMenus}><Package size={17}/> Xem các gói học tập</Link>}<button onClick={() => { auth.logout(); navigate('/login') }}><LogOut size={17}/> Đăng xuất</button></div></div>}
        </div>
      </div>
    </header>
      <div className="ws-demo"><strong>Chưa kết nối máy chủ:</strong> báo cáo và bài kiểm tra hiện vẫn dùng dữ liệu minh họa.</div>
      <main className="ws-content">{expiringEntitlements.length > 0 && <aside className="ws-expiry-alert" role="alert"><AlertTriangle/><div><strong>Gói học tập sắp hết hạn</strong>{expiringEntitlements.map(item => <p key={item.id}>{PLAN_NAME[item.kind] || item.kind} {item.daysLeft === 0 ? 'hết hạn hôm nay' : `còn ${item.daysLeft} ngày`} (đến {formatPlanDate(item.expiresOn)}). <Link to="/dashboard/plans">Gia hạn ngay</Link></p>)}</div></aside>}{children}</main>
    </div>
  </div>
}
