import { useState } from 'react'
import { Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import { BookOpen, CheckCheck, ChevronRight, Image, History, LayoutDashboard, Layers3, LogOut, PenLine, Rocket, ShieldCheck } from 'lucide-react'
import { auth } from '../../api/auth.api'
import ChaptersPage from '../studio/ChaptersPage'
import EditorPage from '../studio/EditorPage'
import ReleasesPage from '../studio/ReleasesPage'
import AssetsPage from '../studio/AssetsPage'
import QuestionsPage from '../studio/QuestionsPage'
import { getStudioMenu } from '../studio/portalMenu'
import RoleOverview from '../studio/RoleOverview'
import { useToast } from '../studio/useToast'
import './studio-workspace.css'

const menuIcons = { chapter: PenLine, review: CheckCheck, release: Rocket, history: History, asset: Image, question: BookOpen }
const roleLabels = { ADMIN: 'Quản trị viên', GAME_EDITOR: 'Biên tập viên', GAME_REVIEWER: 'Kiểm duyệt viên', GAME_MANAGER: 'Quản lý nội dung' }

function MenuIcon({ name }) { const Icon = menuIcons[name]; return <Icon size={19} /> }

export default function StudioWorkspace({ actor }) {
  const { pathname } = useLocation()
  const { notify, view } = useToast()
  const roleChoices = ['GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER'].filter(role => actor.roles.includes('ADMIN') || actor.roles.includes(role))
  const [chosenRole, setChosenRole] = useState(roleChoices[0])
  const activeRole = roleChoices.includes(chosenRole) ? chosenRole : roleChoices[0]
  const available = getStudioMenu(actor)
  const primary = available.filter(section => section.group !== 'library')
  const shared = available.filter(section => section.group === 'library')
  const editorCode = /^\/internal\/editor\/(CH\d{2})$/.exec(pathname)?.[1]
  const current = available.find(section => section.path === pathname || (editorCode && section.path === '/internal/chapters'))
  if (pathname !== '/internal' && pathname !== '/internal/' && !current) return <Navigate to="/internal" replace />
  const name = actor.displayName || actor.name || actor.email
  return <div className={`studio-workspace${editorCode ? ' studio-workspace-editing' : ''}`}>
    <aside className="studio-sidebar">
      <Link className="studio-brand" to="/internal"><span><Layers3 size={23} /></span><div>finteen<small>CONTENT STUDIO</small></div></Link>
      <div className="studio-profile"><span>{name.slice(0, 1).toUpperCase()}</span><div><strong>{name}</strong><small>{actor.roles.map(role => roleLabels[role]).filter(Boolean).join(' · ')}</small></div></div>
      {roleChoices.length > 1 && pathname === '/internal' && <label className="studio-role-switch">Tổng quan theo vai trò<select value={activeRole} onChange={event => setChosenRole(event.target.value)}>{roleChoices.map(role => <option value={role} key={role}>{roleLabels[role]}</option>)}</select></label>}
      <p className="studio-nav-label">KHÔNG GIAN LÀM VIỆC</p>
      <nav aria-label="Điều hướng Studio">
        <NavLink end to="/internal"><LayoutDashboard size={19} /> Tổng quan</NavLink>
        {primary.map(({ path, title, icon }) => <NavLink key={path} to={path} className={editorCode && path === '/internal/chapters' ? 'active' : undefined}><MenuIcon name={icon} />{title}</NavLink>)}
        <p className="studio-nav-group-label">TÀI NGUYÊN DÙNG CHUNG</p>
        {shared.map(({ path, title, icon }) => <NavLink key={path} to={path}><MenuIcon name={icon} />{title}</NavLink>)}
        {actor.roles.includes('ADMIN') && <Link to="/internal/admin"><ShieldCheck size={19} /> Quản trị hệ thống</Link>}
      </nav>
      <div className="studio-sidebar-bottom"><span><ShieldCheck size={16} /> Truy cập nội bộ</span><button onClick={() => auth.logout()}><LogOut size={18} /> Đăng xuất</button></div>
    </aside>
    <div className="studio-main">
      <header className="studio-topbar"><span>Workspace <ChevronRight size={14} /> <strong>{current?.title || 'Tổng quan'}</strong></span><span className="studio-member-tag">FinTeen Team</span></header>
      <main className={`studio-content${editorCode ? ' studio-content-editor' : ''}`}>
        {!editorCode && <><span className="studio-eyebrow">CONTENT STUDIO</span>
        <h1>{current ? current.title : `Chào ${name}!`}</h1>
        <p className="studio-intro">{current ? current.description : 'Chọn một công việc để bắt đầu xây dựng trải nghiệm học tập cho các bạn nhỏ.'}</p></>}
        {current ? <div className="studio-api-content">
          {editorCode ? <EditorPage key={editorCode} code={editorCode} notify={notify} />
            : pathname === '/internal/assets' ? <AssetsPage notify={notify} />
            : pathname === '/internal/releases' ? <ReleasesPage key={pathname} notify={notify} mode="plan" />
            : pathname === '/internal/history' ? <ReleasesPage key={pathname} notify={notify} mode="history" />
            : pathname === '/internal/questions' ? <QuestionsPage notify={notify} />
            : <ChaptersPage key={pathname} notify={notify} reviewOnly={pathname === '/internal/reviews'} />}
        </div> : <>
          <RoleOverview role={activeRole} />
        </>}
      </main>
      {view}
    </div>
  </div>
}
