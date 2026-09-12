import { Home, Users, FileText, BarChart3, MessageCircle, Settings } from 'lucide-react'

// Giáo viên → Blue (chuyên nghiệp, tin cậy)
// onAccent = white vì accent là deep blue
export const teacherRole = {
  id: 'teacher',
  label: 'Giáo viên',
  emoji: 'GraduationCap',
  accent: '#0284c7',
  accentText: '#0369a1',
  accentBg: '#38bdf815',
  accentHover: '#38bdf810',
  accentDeep: '#0284c7',
  onAccent: '#ffffff',
}

export const teacherNavItems = [
  { icon: Home, label: 'Tổng quan', to: '/dashboard/teacher' },
  { icon: Users, label: 'Lớp của tôi', to: '/dashboard/teacher/classes', badge: '3' },
  { icon: FileText, label: 'Bài tập', to: '/dashboard/teacher/assignments' },
  { icon: BarChart3, label: 'Thống kê', to: '/dashboard/teacher/analytics' },
  { icon: MessageCircle, label: 'Tin nhắn', to: '/dashboard/teacher/messages', badge: '5' },
  { icon: Settings, label: 'Cài đặt', to: '/dashboard/teacher/settings' },
]
