import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useUserLessons } from './hooks/useUserLessons'
import GameMap from './components/GameMapReal'
import {
  Home,
  BookOpen,
  Gamepad2,
  Trophy as TrophyIcon,
  MessageCircle,
  User as UserIcon,
} from 'lucide-react'
import useUserDashboard from './hooks/useUserDashboard.js'

const role = {
  id: 'user',
  label: 'Học sinh',
  emoji: 'GraduationCap',
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
  { icon: TrophyIcon, label: 'Thành tích', to: '/dashboard/user/achievements' },
  { icon: MessageCircle, label: 'Trợ lý AI', to: '/dashboard/user/ai' },
  { icon: UserIcon, label: 'Hồ sơ', to: '/dashboard/user/profile' },
]

export default function UserLessons() {
  const { user } = useUserDashboard()
  const { chapters, loading, error } = useUserLessons()

  const handleChapterClick = (chapter) => {
    console.log('Chapter clicked:', chapter)
    // TODO: Navigate to chapter detail page
    // navigate(`/dashboard/user/lessons/${chapter.id}`)
  }

  if (loading) {
    return (
      <DashboardLayout role={role} navItems={navItems} user={user}>
        <div className="text-center text-sm text-[#1a3a1a]/60 py-12">
          Đang tải bản đồ...
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role={role} navItems={navItems} user={user}>
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: '#f8717115',
            borderColor: '#f87171',
            color: '#dc2626',
          }}
        >
          {error}
        </div>
      </DashboardLayout>
    )
  }

  // Quick stats (compact)
  const completedCount = chapters.filter((c) => c.status === 'completed').length
  const currentChapter = chapters.find((c) => c.status === 'current')
  const totalLessonsCompleted = chapters.reduce((sum, c) => sum + c.lessonsCompleted, 0)
  const totalLessons = chapters.reduce((sum, c) => sum + c.totalLessons, 0)
  const overallProgress = Math.round((totalLessonsCompleted / totalLessons) * 100)

  return (
    <DashboardLayout role={role} navItems={navItems} user={user}>
      <div className="space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/user"
              className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center transition-colors hover:bg-gray-50"
              style={{ borderColor: '#fbbf2440' }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Hành trình của bạn
              </h1>
              <p className="text-gray-500 text-xs md:text-sm font-medium">
                Cuộc phiêu lưu tài chính qua 8 chương · {overallProgress}% hoàn thành
              </p>
            </div>
          </div>

          {/* Mini stats pill */}
          <div className="flex items-center gap-2 text-[11px] md:text-xs font-bold">
            <span className="px-2.5 py-1 rounded-full bg-white border-2 border-[#22c55e] text-[#166534]">
              ✓ {completedCount}/8 chương
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white border-2 border-[#3b82f6] text-[#1e40af]">
              📚 {totalLessonsCompleted}/{totalLessons} bài
            </span>
            {currentChapter && (
              <span
                className="px-2.5 py-1 rounded-full text-white animate-pulse"
                style={{ backgroundColor: currentChapter.color }}
              >
                ▶ {currentChapter.title}
              </span>
            )}
          </div>
        </div>

        {/* ADVENTURE MAP */}
        <GameMap chapters={chapters} onChapterClick={handleChapterClick} />
      </div>
    </DashboardLayout>
  )
}
