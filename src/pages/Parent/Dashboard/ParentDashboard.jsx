import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import useParentDashboard from './hooks/useParentDashboard.js'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import ChildrenCards from './components/ChildrenCards.jsx'
import ActivityFeed from './components/ActivityFeed.jsx'
import WeeklyReportCTA from './components/WeeklyReportCTA.jsx'
import { parentRole, parentNavItems } from '../utils/parent-config.js'

export default function ParentDashboard() {
  const dashboard = useParentDashboard()

  return (
    <DashboardLayout role={parentRole} navItems={parentNavItems} user={dashboard.user}>
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
            weeklyGrowth={dashboard.weeklyGrowth}
            streakChild={dashboard.streakChild}
          />
          <StatsGrid stats={dashboard.stats} accentColor={parentRole.accent} accentText={parentRole.accentText} />
          <ChildrenCards children={dashboard.children} />
          <ActivityFeed items={dashboard.activities} />
          <WeeklyReportCTA />
        </>
      )}
    </DashboardLayout>
  )
}
