import {
  Home,
  Users,
  Layers,
  ShieldAlert,
  FileText,
  Settings,
  Activity,
} from 'lucide-react'

export const adminRole = {
  id: 'admin',
  label: 'Quản trị viên',
  emoji: '🛡️',
  gradient: 'from-[#4dabff] to-[#a855f7]',
  activeBg: 'bg-[#a855f7]/10',
  activeText: 'text-[#a855f7]',
}

export const adminNavItems = [
  { icon: Home, label: 'Tổng quan', to: '/dashboard/admin' },
  { icon: Users, label: 'Người dùng', to: '/dashboard/admin/users', badge: '12.4K' },
  { icon: Layers, label: 'Nội dung', to: '/dashboard/admin/content' },
  { icon: Activity, label: 'Analytics', to: '/dashboard/admin/analytics' },
  { icon: ShieldAlert, label: 'Báo cáo lỗi', to: '/dashboard/admin/reports', badge: '3', badgeStyle: 'bg-[#ff6b9d]/15 text-[#ff6b9d]' },
  { icon: Settings, label: 'Cài đặt hệ thống', to: '/dashboard/admin/settings' },
]
