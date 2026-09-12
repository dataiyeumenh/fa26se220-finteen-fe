import { Home, BookOpen, Gamepad2, Trophy, MessageCircle, User as UserIcon } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import useUserDashboard from '../Dashboard/hooks/useUserDashboard.js'

// Học sinh → Modern Gold (vàng ánh kim fintech)
const role = {
  id: 'user',
  label: 'Học sinh',
  emoji: 'GraduationCap', // Lucide icon — thay vì emoji
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

export default function UserLayout({ children }) {
  const { user } = useUserDashboard()
  return (
    <DashboardLayout role={role} navItems={navItems} user={user}>
      {children}
    </DashboardLayout>
  )
}
