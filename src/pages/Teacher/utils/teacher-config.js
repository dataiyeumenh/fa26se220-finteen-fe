import { Home, Users, FileText, BarChart3, MessageCircle, Settings } from 'lucide-react'

export const teacherRole = {
  id: 'teacher',
  label: 'Giáo viên',
  emoji: '👩‍🏫',
  gradient: 'from-[#fbbf24] to-[#ff8e53]',
  activeBg: 'bg-[#ff8e53]/10',
  activeText: 'text-[#ff8e53]',
}

export const teacherNavItems = [
  { icon: Home, label: 'Tổng quan', to: '/dashboard/teacher' },
  { icon: Users, label: 'Lớp của tôi', to: '/dashboard/teacher/classes', badge: '3' },
  { icon: FileText, label: 'Bài tập', to: '/dashboard/teacher/assignments' },
  { icon: BarChart3, label: 'Thống kê', to: '/dashboard/teacher/analytics' },
  { icon: MessageCircle, label: 'Tin nhắn', to: '/dashboard/teacher/messages', badge: '5' },
  { icon: Settings, label: 'Cài đặt', to: '/dashboard/teacher/settings' },
]
