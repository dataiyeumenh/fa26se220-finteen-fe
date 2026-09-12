import { Home, Users, BarChart3, CalendarDays, MessageCircle, Settings } from 'lucide-react'

// Phụ huynh → Warm Coral (cam san hô ấm áp, đáng tin cậy, dịu mắt)
// onAccent = white vì accent đủ đậm
export const parentRole = {
  id: 'parent',
  label: 'Phụ huynh',
  emoji: 'Users',
  accent: '#fb923c',
  accentText: '#c2410c',
  accentBg: '#fb923c15',
  accentHover: '#fb923c10',
  accentDeep: '#ea580c',
  onAccent: '#ffffff',
}

export const parentNavItems = [
  { icon: Home, label: 'Tổng quan', to: '/dashboard/parent' },
  { icon: Users, label: 'Con em', to: '/dashboard/parent/children', badge: '2' },
  { icon: BarChart3, label: 'Báo cáo', to: '/dashboard/parent/reports' },
  { icon: CalendarDays, label: 'Lịch học', to: '/dashboard/parent/schedule' },
  { icon: MessageCircle, label: 'Tin nhắn GVCN', to: '/dashboard/parent/messages' },
  { icon: Settings, label: 'Cài đặt', to: '/dashboard/parent/settings' },
]
