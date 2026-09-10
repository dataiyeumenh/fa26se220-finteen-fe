import { Home, BookOpen, Gamepad2, Trophy, MessageCircle, User as UserIcon } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import useUserDashboard from './hooks/useUserDashboard.js'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import StatsGrid from './components/StatsGrid.jsx'
import ContinueLearning from './components/ContinueLearning.jsx'
import Achievements from './components/Achievements.jsx'
import AiSuggestionCard from './components/AiSuggestionCard.jsx'

const role = {
  id: 'user',
  label: 'Học sinh',
  emoji: '🎓',
  gradient: 'from-[#a855f7] to-[#ff6b9d]',
  activeBg: 'bg-[#ff6b9d]/10',
  activeText: 'text-[#ff6b9d]',
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
            streak={dashboard.streak}
            lessonsThisWeek={dashboard.lessonsThisWeek}
            lessonsTarget={dashboard.lessonsTarget}
          />
          <StatsGrid stats={dashboard.stats} />
          <ContinueLearning lessons={dashboard.continueLessons} />
          <Achievements items={dashboard.achievements} />
          <AiSuggestionCard />
        </>
      )}
    </DashboardLayout>
  )
}
