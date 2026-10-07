import { Navigate } from 'react-router-dom'
import { useWorkspace } from '../workspace/useWorkspace'
import AdminDashboard from './AdminDashboard'

export default function InternalApp() {
  const { actor, loading } = useWorkspace()
  if (loading) return <p role="status">Đang kiểm tra quyền truy cập…</p>
  if (!actor) return <Navigate to="/login" replace />
  if (!actor.roles?.includes('ADMIN')) return <Navigate to="/dashboard" replace />
  return <AdminDashboard />
}
