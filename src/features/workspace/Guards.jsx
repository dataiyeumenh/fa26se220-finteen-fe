import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useWorkspace } from './useWorkspace'
import { canAccessChapter } from './model'
import WorkspaceLayout from './WorkspaceLayout'
import { Empty } from './ui'
import { auth } from '../../api/auth.api'

export function RequireAccount({ kind, roles, plans }) {
  const { actor, loading, authError } = useWorkspace()
  if (loading) return <Empty>Đang kiểm tra phiên đăng nhập…</Empty>
  if (authError && auth.hasSession()) return <Empty>{authError} <button onClick={() => void auth.refresh().catch(() => {})}>Thử lại</button> <button onClick={() => auth.logout()}>Đăng nhập lại</button></Empty>
  if (!actor) return <Navigate to="/login" replace />
  const home = actor.role === 'kid' ? '/dashboard/kid' : '/dashboard'
  if (kind && actor.kind !== kind) return <Navigate to={home} replace />
  if (roles && !roles.includes(actor.role)) {
    return <Navigate to={actor.role === 'guest' ? '/dashboard/plans' : home} replace />
  }
  if (plans && !plans.includes(actor.plan)) return <Navigate to={home} replace />
  if (actor.source === 'api' && roles?.some(role => ['parent', 'teacher'].includes(role))) return <WorkspaceLayout><Empty>Chức năng học sinh, nhóm và báo cáo chưa kết nối API. Quyền gói học được đọc từ tài khoản thật; dữ liệu demo không dùng chung.</Empty></WorkspaceLayout>
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
