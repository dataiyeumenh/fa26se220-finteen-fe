import {
  Home,
  Users,
  Layers,
  ShieldAlert,
  FileText,
  Settings,
  Activity,
} from 'lucide-react'

// Admin → Purple pastel (uy quyền nhưng dịu nhẹ)
// onAccent = dark ink vì accent là light purple
export const adminRole = {
  id: 'admin',
  label: 'Quản trị viên',
  emoji: '🛡️',
  accent: '#c4b5fd',
  accentText: '#5b21b6',
  accentBg: '#c4b5fd25',
  accentHover: '#c4b5fd20',
  accentDeep: '#6d28d9',
  onAccent: '#1a3a1a',
}

export const adminNavItems = [
  { icon: Home, label: 'Tổng quan', to: '/dashboard/admin' },
  { icon: Users, label: 'Người dùng', to: '/dashboard/admin/users', badge: '12.4K' },
  { icon: Layers, label: 'Nội dung', to: '/dashboard/admin/content' },
  { icon: Activity, label: 'Analytics', to: '/dashboard/admin/analytics' },
  {
    icon: ShieldAlert,
    label: 'Báo cáo lỗi',
    to: '/dashboard/admin/reports',
    badge: '3',
    badgeStyle: { backgroundColor: '#f8717115', color: '#dc2626' },
  },
  { icon: Settings, label: 'Cài đặt hệ thống', to: '/dashboard/admin/settings' },
]
