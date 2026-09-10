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
    <DashboardLayout
      role={parentRole}
      navItems={parentNavItems}
      user={dashboard.user}
    >
      {dashboard.loading && (
        <div className="text-center text-sm text-[#2d1b4e]/60 py-12">Đang tải dữ liệu...</div>
      )}

      {dashboard.error && (
        <div className="bg-[#ff6b9d]/10 border-2 border-[#ff6b9d]/40 rounded-2xl p-4 mb-6 text-sm text-[#ff6b9d] font-bold">
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
          <StatsGrid stats={dashboard.stats} />
          <ChildrenCards children={dashboard.children} />
          <ActivityFeed items={dashboard.activities} />
          <WeeklyReportCTA />
        </>
      )}
    </DashboardLayout>
  )
}
