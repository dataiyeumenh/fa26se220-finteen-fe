import { Home, BookOpen, Gamepad2, Trophy, MessageCircle, User as UserIcon } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import useUserDashboard from './hooks/useUserDashboard.js'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import ContinueLearning from './components/ContinueLearning.jsx'
import Achievements from './components/Achievements.jsx'
import AiSuggestionCard from './components/AiSuggestionCard.jsx'

// Học sinh → Modern Gold (vàng ánh kim fintech)
const role = {
  id: 'user',
  label: 'Học sinh',
  emoji: 'GraduationCap', // Lucide icon — thay vì emoji 🎓
  accent: '#fbbf24',
  accentText: '#92400e',
  accentBg: '#fbbf2415',
  accentHover: '#fbbf2410',
  accentDeep: '#d97706',
  onAccent: '#ffffff',
}

const navItems = [
  { icon: Home, label: 'Tổng quan', to: '/dashboard/user' },
  { icon: BookOpen, label: 'Bài học', to: '/dashboard/user/lessons', badge: '5 mới' },
  { icon: Gamepad2, label: 'Trò chơi', to: '/dashboard/user/games', badge: '3' },
  { icon: Trophy, label: 'Thành tích', to: '/dashboard/user/achievements' },
  { icon: MessageCircle, label: 'Trợ lý AI', to: '/dashboard/user/ai' },
  { icon: UserIcon, label: 'Hồ sơ', to: '/dashboard/user/profile' },
]

export default function UserDashboard() {
  const dashboard = useUserDashboard()

  return (
    <DashboardLayout role={role} navItems={navItems} user={dashboard.user}>
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
            streak={dashboard.streak}
            lessonsThisWeek={dashboard.lessonsThisWeek}
            lessonsTarget={dashboard.lessonsTarget}
          />
          <StatsGrid stats={dashboard.stats} accentColor={role.accent} accentText={role.accentText} />
          <ContinueLearning lessons={dashboard.continueLessons} />
          <Achievements items={dashboard.achievements} />
          <AiSuggestionCard />
        </>
      )}
    </DashboardLayout>
  )
}
