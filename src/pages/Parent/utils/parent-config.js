import { Home, Users, BarChart3, CalendarDays, MessageCircle, Settings } from 'lucide-react'

export const parentRole = {
  id: 'parent',
  label: 'Phụ huynh',
  emoji: '👨‍👩‍👧',
  gradient: 'from-[#4dabff] to-[#b8ff3d]',
  activeBg: 'bg-[#4dabff]/10',
  activeText: 'text-[#4dabff]',
}

export const parentNavItems = [
  { icon: Home, label: 'Tổng quan', to: '/dashboard/parent' },
  { icon: Users, label: 'Con em', to: '/dashboard/parent/children', badge: '2' },
  { icon: BarChart3, label: 'Báo cáo', to: '/dashboard/parent/reports' },
  { icon: CalendarDays, label: 'Lịch học', to: '/dashboard/parent/schedule' },
  { icon: MessageCircle, label: 'Tin nhắn GVCN', to: '/dashboard/parent/messages' },
  { icon: Settings, label: 'Cài đặt', to: '/dashboard/parent/settings' },
]
