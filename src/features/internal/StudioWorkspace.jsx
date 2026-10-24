import { Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, BookOpen, CheckCheck, ChevronRight, Image, LayoutDashboard, Layers3, LogOut, PenLine, Rocket, ShieldCheck } from 'lucide-react'
import { auth } from '../../api/auth.api'
import AssetLibrary from './AssetLibrary'
import './studio-workspace.css'

const sections = [
  { path: '/internal/chapters', title: 'Biên tập chương', icon: PenLine, roles: ['GAME_EDITOR'], description: 'Soạn nội dung, quản lý bản nháp và gửi chương đi duyệt.', step: '01', status: 'Chưa kết nối' },
  { path: '/internal/reviews', title: 'Kiểm duyệt nội dung', icon: CheckCheck, roles: ['GAME_REVIEWER'], description: 'Xem nháp, chơi thử và phản hồi chất lượng từng chương.', step: '02', status: 'Chưa kết nối' },
  { path: '/internal/releases', title: 'Quản lý phát hành', icon: Rocket, roles: ['GAME_MANAGER'], description: 'Theo dõi phiên bản, phát hành và quản lý bản đang chạy.', step: '03', status: 'Chưa kết nối' },
  { path: '/internal/assets', title: 'Thư viện ảnh', icon: Image, roles: ['GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER'], description: 'Tìm ảnh có sẵn, xem trước và lấy ref cho nội dung chương.', status: 'Đã kết nối' },
]
const roleLabels = { GAME_EDITOR: 'Biên tập viên', GAME_REVIEWER: 'Kiểm duyệt viên', GAME_MANAGER: 'Quản lý nội dung' }

export default function StudioWorkspace({ actor }) {
  const { pathname } = useLocation()
  const available = sections.filter(section => section.roles.some(role => actor.roles.includes(role)))
  const current = available.find(section => section.path === pathname)
  if (pathname !== '/internal' && pathname !== '/internal/' && !current) return <Navigate to="/internal" replace />
  const name = actor.displayName || actor.name || actor.email
  return <div className="studio-workspace">
    <aside className="studio-sidebar">
      <Link className="studio-brand" to="/internal"><span><Layers3 size={23} /></span><div>finteen<small>CONTENT STUDIO</small></div></Link>
      <div className="studio-profile"><span>{name.slice(0, 1).toUpperCase()}</span><div><strong>{name}</strong><small>{actor.roles.map(role => roleLabels[role]).filter(Boolean).join(' · ')}</small></div></div>
      <p className="studio-nav-label">KHÔNG GIAN LÀM VIỆC</p>
      <nav aria-label="Điều hướng Studio">
        <NavLink end to="/internal"><LayoutDashboard size={19} /> Tổng quan</NavLink>
        {available.map(({ path, title, icon: Icon }) => <NavLink key={path} to={path}><Icon size={19} />{title}</NavLink>)}
      </nav>
      <div className="studio-sidebar-bottom"><span><ShieldCheck size={16} /> Truy cập nội bộ</span><button onClick={() => auth.logout()}><LogOut size={18} /> Đăng xuất</button></div>
    </aside>
    <div className="studio-main">
      <header className="studio-topbar"><span>Workspace <ChevronRight size={14} /> <strong>{current?.title || 'Tổng quan'}</strong></span><span className="studio-member-tag">FinTeen Team</span></header>
      {pathname === '/internal/assets' ? <AssetLibrary actor={actor} embedded /> : <main className="studio-content">
        <span className="studio-eyebrow">CONTENT STUDIO</span>
        <h1>{current ? current.title : `Chào ${name}!`}</h1>
        <p className="studio-intro">{current ? current.description : 'Chọn một công việc để bắt đầu xây dựng trải nghiệm học tập cho các bạn nhỏ.'}</p>
        {current ? <section className="studio-coming-soon"><current.icon size={38} /><h2>Không gian đang được chuẩn bị</h2><p>Chức năng này chưa được kết nối API. Bạn có thể sử dụng thư viện ảnh trong lúc chờ hoàn thiện.</p><Link to="/internal/assets">Mở thư viện ảnh <ArrowRight size={17} /></Link></section> : <>
          <section className="studio-welcome"><div><span>CHUNG MỘT HÀNH TRÌNH</span><h2>Nội dung tốt bắt đầu<br />từ đội ngũ tận tâm.</h2><p>Biên tập · Kiểm duyệt · Phát hành</p></div><BookOpen size={100} strokeWidth={1} aria-hidden="true" /></section>
          <div className="studio-section-heading"><h2>Công việc của bạn</h2><span>{available.length} khu vực</span></div>
          <div className="studio-menu-grid">{available.map(({ path, title, icon: Icon, description, status }) => <Link className="studio-menu-card" to={path} key={path}><span className="studio-menu-icon"><Icon size={23} /></span><span className={`studio-status ${status === 'Đã kết nối' ? 'ready' : ''}`}>{status}</span><h3>{title}</h3><p>{description}</p><span className="studio-open">Mở không gian <ArrowRight size={16} /></span></Link>)}</div>
          <p className="studio-footnote"><ShieldCheck size={16} /> Các mục công việc hiển thị theo vai trò được cấp cho tài khoản.</p>
        </>}
      </main>}
    </div>
  </div>
}
