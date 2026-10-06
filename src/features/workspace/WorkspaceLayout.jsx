import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Users, Layers, ClipboardList, BarChart3, Settings, LogOut, Package, GraduationCap, Gamepad2, Store, Play } from 'lucide-react'
import { useWorkspace } from './useWorkspace'
import { auth } from '../../api/auth.api'
import './workspace.css'
import './role-theme.css'

export default function WorkspaceLayout({ children }) {
  const { actor } = useWorkspace()
  const navigate = useNavigate()
  const learner = actor?.role === 'kid'
  const teacher = actor?.role === 'teacher'
  const paid = actor?.role === 'parent' || teacher
  const dualContext = actor?.plans?.includes('parent') && actor?.plans?.includes('teacher')
  const label = learner ? 'Học sinh' : teacher ? 'Giáo viên' : paid ? 'Phụ huynh' : 'Guest · dùng thử'
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
      <div className="ws-identity"><GraduationCap size={25}/><strong>{actor?.name}</strong><small>{label}</small></div>
      {dualContext && <fieldset className="ws-context-switch"><legend>Phạm vi đang dùng</legend>
        <label><input type="radio" name="workspace-context" checked={actor.role === 'parent'} onChange={() => { auth.setContext('parent'); navigate('/dashboard') }}/> Phụ huynh</label>
        <label><input type="radio" name="workspace-context" checked={actor.role === 'teacher'} onChange={() => { auth.setContext('teacher'); navigate('/dashboard') }}/> Giáo viên</label>
      </fieldset>}
      <nav aria-label="Điều hướng dashboard">{links.map(([to, text, Icon]) => <NavLink end key={to} to={to}><Icon size={19}/>{text}</NavLink>)}</nav>
      <button className="ws-logout" onClick={() => { auth.logout(); navigate('/login') }}><LogOut size={18}/> Đăng xuất</button>
    </aside>
    <div className="ws-main"><header className="ws-top"><span>Không gian {learner ? 'học tập' : 'đồng hành'}</span><span className="ws-pill">{label}</span></header>
      <div className="ws-demo">Tài khoản dùng API thật · Các tính năng học sinh và thanh toán chưa kết nối.</div>
      <main className="ws-content">{children}</main>
    </div>
  </div>
}
