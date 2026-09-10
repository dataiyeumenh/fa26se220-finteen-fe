import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { parentRole, parentNavItems } from '../utils/parent-config.js'
import useParentDashboard from '../Dashboard/hooks/useParentDashboard.js'

export default function ParentLayout({ children }) {
  const { user } = useParentDashboard()
  return (
    <DashboardLayout role={parentRole} navItems={parentNavItems} user={user}>
      {children}
    </DashboardLayout>
  )
}
