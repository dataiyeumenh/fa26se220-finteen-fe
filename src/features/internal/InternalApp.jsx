import { Link, Navigate } from 'react-router-dom'
import { useWorkspace } from '../workspace/useWorkspace'

export default function InternalApp() {
  const { actor, loading } = useWorkspace()
  if (loading) return <p role="status">Đang kiểm tra quyền truy cập…</p>
  if (!actor) return <Navigate to="/login" replace />
  if (!actor.roles?.includes('ADMIN')) return <Navigate to="/dashboard" replace />
  return <main style={{ padding: '3rem', maxWidth: 720, margin: 'auto' }}>
    <h1>Không gian nội bộ chưa kết nối API</h1>
    <p>Đã gỡ tài khoản và đăng nhập demo. Chức năng này sẽ mở khi backend cung cấp API và phân quyền tương ứng.</p>
    <Link to="/login">Đăng nhập tài khoản thật</Link>
  </main>
}
