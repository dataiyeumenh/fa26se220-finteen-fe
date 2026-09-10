import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { adminRole, adminNavItems } from '../utils/admin-config.js'
import useAdminDashboard from '../Dashboard/hooks/useAdminDashboard.js'

export default function AdminLayout({ children }) {
  const { user } = useAdminDashboard()
  return (
    <DashboardLayout role={adminRole} navItems={adminNavItems} user={user}>
      {children}
    </DashboardLayout>
  )
}
