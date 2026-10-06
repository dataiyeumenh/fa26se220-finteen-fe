import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BookOpen, ClipboardList, LayoutDashboard, LogOut, ShieldCheck, Users, Radio } from 'lucide-react'
import { useInternal } from './hooks'
import { logoutInternal } from './store'
import { STAFF_ROLES } from './model'
import '../workspace/workspace.css'
import './internal.css'

export function RequireStaff({ roles }) {
  const { actor } = useInternal()
  if (!actor) return <Navigate to="/internal/login" replace/>
  if (roles && !roles.includes(actor.role)) return <Navigate to="/internal" replace/>
  return <Outlet/>
}
export default function InternalLayout() {
  const { actor } = useInternal()
  const navigate = useNavigate()
  const oversight = ['manager', 'admin'].includes(actor.role)
  const links = [['/internal', 'Tổng quan', LayoutDashboard], ['/internal/chapters', actor.role === 'reviewer' ? 'Chương cần duyệt' : 'Cốt truyện & chương', BookOpen], ...(oversight ? [['/internal/staff', actor.role === 'manager' ? 'Nhân sự & phân công' : 'Nhân sự nội bộ', Users], ['/internal/publications', 'Phát hành', Radio]] : []), ...(actor.role === 'admin' ? [['/internal/accounts', 'Tài khoản & giao dịch', ShieldCheck]] : []), ['/internal/audit', 'Nhật ký thao tác', ClipboardList]]
  return <div className={`ws studio studio-${actor.role}`}><aside className="ws-sidebar"><Link to="/internal" className="ws-brand"><span>F</span> FinTeen</Link><div className="ws-identity"><ShieldCheck/><strong>{actor.name}</strong><small>{STAFF_ROLES[actor.role]}</small></div><nav aria-label="Điều hướng nội bộ">{links.map(([to, label, Icon]) => <NavLink end={to === '/internal'} key={to} to={to}><Icon size={18}/>{label}</NavLink>)}</nav><Link className="ws-text-link" to="/">Về trang công khai</Link><button className="ws-logout" onClick={() => { logoutInternal(); navigate('/internal/login') }}><LogOut size={18}/> Đăng xuất nội bộ</button></aside><div className="ws-main"><header className="ws-top"><span>Không gian sản xuất nội dung</span><span className="ws-pill">{STAFF_ROLES[actor.role]}{actor.role === 'admin' ? ' · Chỉ đọc' : ''}</span></header><div className="ws-demo">Bản thử nội bộ · Lưu trên trình duyệt · Phát hành chỉ áp dụng trên trình duyệt này.</div><main className="ws-content"><Outlet/></main></div></div>
}
