import { Home, BookOpen, Gamepad2, Trophy, MessageCircle, User as UserIcon } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import useUserDashboard from '../Dashboard/hooks/useUserDashboard.js'

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

export default function UserLayout({ children }) {
  const { user } = useUserDashboard()
  return (
    <DashboardLayout role={role} navItems={navItems} user={user}>
      {children}
    </DashboardLayout>
  )
}
