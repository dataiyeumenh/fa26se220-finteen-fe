import { useCallback } from 'react'
import { Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import { ArrowLeft, BookOpen, CheckCheck, ChevronRight, Image, History, LayoutDashboard, Layers3, LogOut, PenLine, Rocket, Sparkles } from 'lucide-react'
import { auth } from '../../api/auth.api'
import ChaptersPage from '../studio/ChaptersPage'
import EditorPage from '../studio/EditorPage'
import ReleasesPage from '../studio/ReleasesPage'
import AssetsPage from '../studio/AssetsPage'
import QuestionsPage from '../studio/QuestionsPage'
import { getStudioMenu } from '../studio/portalMenu'
import RoleOverview from '../studio/RoleOverview'
import { ROLE_LABELS, turnOf } from '../studio/chapterWork'
import { studioApi } from '../studio/studioClient'
import { useStudioResource } from '../studio/useStudioResource'
import { useToast } from '../studio/useToast'
import './studio-workspace.css'

const menuIcons = { chapter: PenLine, review: CheckCheck, release: Rocket, history: History, asset: Image, question: BookOpen }

function MenuIcon({ name }) { const Icon = menuIcons[name]; return <Icon size={19} aria-hidden="true" /> }

export default function StudioWorkspace({ actor }) {
  const { pathname } = useLocation()
  const { notify, view } = useToast()
  const roleChoices = ['GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER'].filter(role => actor.roles.includes('ADMIN') || actor.roles.includes(role))
  const available = getStudioMenu(actor)
  const primary = available.filter(section => section.group !== 'library')
  const shared = available.filter(section => section.group === 'library')
  const editorCode = /^\/internal\/editor\/(CH\d{2})$/.exec(pathname)?.[1]
  const current = available.find(section => section.path === pathname || (editorCode && section.path === '/internal/chapters'))
  // Số chương đang chờ chính mình, hiện cạnh mục menu; tải lại mỗi lần đổi màn để số luôn đúng.
  const loader = useCallback(() => pathname && studioApi.get('/api/studio/chapters'), [pathname])
  const chapters = useStudioResource(loader).data
  const count = turn => (Array.isArray(chapters) ? chapters : []).filter(draft => turnOf(actor, draft) === turn).length
  const counts = { review: count('review'), release: count('publish') }
  const isAdmin = actor.roles.includes('ADMIN')
  const pageTitle = editorCode ? `Trình soạn ${editorCode}` : current?.title || 'Tổng quan'
  if (pathname !== '/internal' && pathname !== '/internal/' && !current) return <Navigate to="/internal" replace />
  const name = actor.displayName || actor.name || actor.email
  const pageProps = { notify, title: current?.title, intro: current?.description }
  return <div className={`studio-workspace${editorCode ? ' studio-workspace-editing' : ''}`}>
    <aside className="studio-sidebar">
      <Link className="studio-brand" to="/internal" aria-label="FinTeen Studio, về Tổng quan"><span><Layers3 size={22} aria-hidden="true" /></span><div>FinTeen<small>Studio nội dung</small></div></Link>
      <div className="studio-profile"><span aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span><div><strong title={name}>{name}</strong><small>{actor.roles.map(role => ROLE_LABELS[role]).filter(Boolean).join(', ')}</small></div></div>
      <nav aria-label="Điều hướng Studio">
        <p className="studio-nav-group-label studio-nav-group-first">Không gian làm việc</p>
        <NavLink end to={isAdmin ? '/internal/admin' : '/internal'} title={isAdmin ? 'Quay lại Admin' : 'Tổng quan'}>
          {isAdmin ? <ArrowLeft size={19} aria-hidden="true" /> : <LayoutDashboard size={19} aria-hidden="true" />}
          {isAdmin ? 'Quay lại Admin' : 'Tổng quan'}
        </NavLink>
        {primary.map(({ path, title, icon }) => <NavLink key={path} to={path} title={title} className={editorCode && path === '/internal/chapters' ? 'active' : undefined}>
          <MenuIcon name={icon} />{title}{counts[icon] > 0 && <span className="sp-nav-count" aria-label={`${counts[icon]} chương chờ bạn`}>{counts[icon]}</span>}
        </NavLink>)}
        <p className="studio-nav-group-label">Thư viện dùng chung</p>
        {shared.map(({ path, title, icon }) => <NavLink key={path} to={path} title={title}><MenuIcon name={icon} />{title}</NavLink>)}
      </nav>
      <div className="studio-sidebar-bottom"><button type="button" title="Đăng xuất" onClick={() => auth.logout()}><LogOut size={18} aria-hidden="true" />Đăng xuất</button></div>
    </aside>
    <div className="studio-main">
      <header className="studio-global-header">
        <div className="studio-header-title">
          <strong>Content Studio</strong>
          <span>/ {pageTitle}</span>
        </div>
        <div className="studio-header-meta">
          <span className="studio-role-pill"><Sparkles size={15} aria-hidden="true" />{isAdmin ? 'Quản trị viên' : 'Thành viên Studio'}</span>
        </div>
      </header>
      {editorCode && <nav className="studio-topbar" aria-label="Vị trí"><Link to="/internal/chapters">{current?.title || 'Chương'}</Link><ChevronRight size={14} aria-hidden="true" /><strong>{editorCode}</strong></nav>}
      <main className={`studio-content${editorCode ? ' studio-content-editor' : ''}`}>
        {editorCode ? <div className="studio-api-content"><EditorPage key={editorCode} code={editorCode} notify={notify} /></div>
          : !current ? <RoleOverview actor={actor} name={name} roles={roleChoices} />
          : pathname === '/internal/assets' ? <AssetsPage {...pageProps} />
          : pathname === '/internal/releases' ? <ReleasesPage key={pathname} {...pageProps} mode="plan" />
          : pathname === '/internal/history' ? <ReleasesPage key={pathname} {...pageProps} mode="history" />
          : pathname === '/internal/questions' ? <QuestionsPage {...pageProps} />
          : <ChaptersPage key={pathname} {...pageProps} reviewOnly={pathname === '/internal/reviews'} />}
      </main>
      {view}
    </div>
  </div>
}
