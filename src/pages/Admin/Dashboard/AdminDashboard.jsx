import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { adminRole, adminNavItems } from '../utils/admin-config.js'
import { adminActionTiles } from '../utils/admin-tiles.js'
import useAdminDashboard from './hooks/useAdminDashboard.js'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import SystemHealth from './components/SystemHealth.jsx'
import RecentUsers from './components/RecentUsers.jsx'
import SystemLogs from './components/SystemLogs.jsx'
import ActionTiles from './components/ActionTiles.jsx'

export default function AdminDashboard() {
  const dashboard = useAdminDashboard()

  return (
    <DashboardLayout
      role={adminRole}
      navItems={adminNavItems}
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
          <WelcomeBanner systemOk={dashboard.systemOk} />
          <StatsGrid stats={dashboard.stats} />
          <SystemHealth stats={dashboard.health} />
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <RecentUsers items={dashboard.recentUsers} />
            <SystemLogs logs={dashboard.logs} />
          </div>
          <ActionTiles tiles={adminActionTiles} />
        </>
      )}
    </DashboardLayout>
  )
}
