import { Link, Navigate, useLocation } from 'react-router-dom'
import { useWorkspace } from '../workspace/useWorkspace'
import AdminDashboard from '../../pages/Admin/Dashboard/AdminDashboard'

import { hasInternalAccess } from './access'
import '@/components/public/public.css'
import AssetLibrary from './AssetLibrary'
import StudioWorkspace from './StudioWorkspace'

export default function InternalApp() {
  const { pathname } = useLocation()
  const { actor, loading } = useWorkspace()
  if (loading) return <p role="status">Đang kiểm tra quyền truy cập…</p>
  if (!actor) return <Navigate to="/internal/login" replace />
  if (!hasInternalAccess(actor)) return <Navigate to="/internal/login" replace />
  if (!actor.roles.includes('ADMIN')) return <StudioWorkspace actor={actor} />
  if (pathname === '/internal/assets') return <AssetLibrary actor={actor} />
  return <><nav aria-label="Studio"><Link to="/internal/assets">Thư viện ảnh Studio</Link></nav><AdminDashboard /></>
}
