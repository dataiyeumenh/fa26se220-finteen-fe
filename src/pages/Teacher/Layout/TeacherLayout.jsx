import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { teacherRole, teacherNavItems } from '../utils/teacher-config.js'
import useTeacherDashboard from '../Dashboard/hooks/useTeacherDashboard.js'

export default function TeacherLayout({ children }) {
  const { user } = useTeacherDashboard()
  return (
    <DashboardLayout role={teacherRole} navItems={teacherNavItems} user={user}>
      {children}
    </DashboardLayout>
  )
}
