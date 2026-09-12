import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { teacherRole, teacherNavItems } from '../utils/teacher-config.js'
import useTeacherDashboard from './hooks/useTeacherDashboard.js'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import ClassesGrid from './components/ClassesGrid.jsx'
import SubmissionsTable from './components/SubmissionsTable.jsx'
import AnalyticsCTA from './components/AnalyticsCTA.jsx'

export default function TeacherDashboard() {
  const dashboard = useTeacherDashboard()

  return (
    <DashboardLayout role={teacherRole} navItems={teacherNavItems} user={dashboard.user}>
      {dashboard.loading && (
        <div className="text-center text-sm text-[#1a3a1a]/60 py-12">Đang tải dữ liệu...</div>
      )}

      {dashboard.error && (
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: '#f8717115',
            borderColor: '#f87171',
            color: '#dc2626',
          }}
        >
          {dashboard.error}
        </div>
      )}

      {!dashboard.loading && !dashboard.error && (
        <>
          <WelcomeBanner
            user={dashboard.user}
            rating={dashboard.rating}
            totalStudents={dashboard.totalStudents}
            pendingGrading={dashboard.classes?.length}
          />
          <StatsGrid stats={dashboard.stats} accentColor={teacherRole.accent} accentText={teacherRole.accentText} />
          <ClassesGrid classes={dashboard.classes} />
          <SubmissionsTable submissions={dashboard.submissions} />
          <AnalyticsCTA />
        </>
      )}
    </DashboardLayout>
  )
}
