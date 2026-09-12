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
    <DashboardLayout role={adminRole} navItems={adminNavItems} user={dashboard.user}>
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
          <WelcomeBanner systemOk={dashboard.systemOk} />
          <StatsGrid stats={dashboard.stats} accentColor={adminRole.accent} accentText={adminRole.accentText} />
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
