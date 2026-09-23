import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useWorkspace } from './useWorkspace'
import { canAccessChapter } from './model'
import WorkspaceLayout from './WorkspaceLayout'
import { Empty } from './ui'

export function RequireAccount({ kind, roles, plans }) {
  const { actor } = useWorkspace()
  if (!actor) return <Navigate to="/login" replace />
  const home = actor.role === 'kid' ? '/dashboard/kid' : '/dashboard'
  if (kind && actor.kind !== kind) return <Navigate to={home} replace />
  if (roles && !roles.includes(actor.role)) {
    return <Navigate to={actor.role === 'guest' ? '/dashboard/plans' : home} replace />
  }
  if (plans && !plans.includes(actor.plan)) return <Navigate to={home} replace />
  return <Outlet />
}

export function Shell() {
  return <WorkspaceLayout><Outlet /></WorkspaceLayout>
}

export function AccountHome() {
  const { actor } = useWorkspace()
  return <Navigate to={!actor ? '/login' : actor.role === 'kid' ? '/dashboard/kid' : '/dashboard'} replace />
}

// Hỗ trợ link bản đồ cũ, bao gồm nút thoát nằm trong player hiện tại.
export function LessonsEntry() {
  const { actor } = useWorkspace()
  const destination = actor?.role === 'kid' ? '/dashboard/kid/lessons'
    : actor?.role === 'guest' ? '/dashboard/demo' : '/dashboard'
  return <Navigate to={destination} replace />
}

export function LegacyGameEntry() {
  const { actor } = useWorkspace()
  const { search } = useLocation()
  const destination = actor?.role === 'kid' ? `/dashboard/kid/play${search}`
    : actor?.role === 'guest' ? `/dashboard/demo/play${search}` : '/dashboard'
  return <Navigate to={destination} replace />
}

export function ChapterGuard({ children }) {
  const { actor } = useWorkspace()
  const [params] = useSearchParams()
  const chapter = Number(params.get('chapter') || 1)
  if (!canAccessChapter(actor, chapter)) {
    return <Navigate to={actor?.role === 'kid' ? '/dashboard/kid/lessons' : '/dashboard/plans'} replace />
  }
  return children
}

export function NotFound() {
  return <WorkspaceLayout><Empty>Trang này chưa có trong luồng hiện tại. Hãy chọn một mục trên thanh điều hướng.</Empty></WorkspaceLayout>
}
