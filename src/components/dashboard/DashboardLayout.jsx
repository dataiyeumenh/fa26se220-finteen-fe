import { Link, useLocation } from 'react-router-dom'
import { Bell, Search, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Layout dùng chung cho cả 4 role dashboards.
 * - `role`: object chứa { id, label, gradient, accent, emoji }
 * - `navItems`: các item sidebar [{ icon, label, to, badge? }]
 * - `user`: object { name, role, avatar }
 */
export function DashboardLayout({ role, navItems, user, children }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#fff8f0] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r-2 border-[#2d1b4e]/8 sticky top-0 h-screen">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 px-6 h-16 border-b-2 border-[#2d1b4e]/8">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-[#2d1b4e] font-extrabold shadow-[0_4px_14px_rgba(184,255,61,0.5)]">
            F
          </div>
          <span className="text-gradient-primary font-extrabold text-lg">FinTeen</span>
        </Link>

        {/* Role badge */}
        <div className="px-4 py-4">
          <div
            className={`rounded-2xl p-4 bg-gradient-to-br ${role.gradient} text-white relative overflow-hidden`}
          >
            <span className="absolute top-1 right-2 text-2xl opacity-90">{role.emoji}</span>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Đang đăng nhập
            </div>
            <div className="text-base font-extrabold mt-0.5">{role.label}</div>
            <div className="text-xs opacity-90 mt-0.5">{user?.name || 'Guest'}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#2d1b4e]/40 px-3 py-2">
            Menu
          </div>
          {navItems.map(item => {
            const active = location.pathname === item.to
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-bold transition-all ${
                  active
                    ? `${role.activeBg} ${role.activeText}`
                    : 'text-[#2d1b4e]/70 hover:bg-[#2d1b4e]/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeStyle || 'bg-[#2d1b4e]/10 text-[#2d1b4e]'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="p-4 border-t-2 border-[#2d1b4e]/8 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-[#2d1b4e]/70 hover:bg-[#2d1b4e]/5"
          >
            <Home className="w-4 h-4" /> Về trang chủ
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-[#ff6b9d] hover:bg-[#ff6b9d]/10"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b-2 border-[#2d1b4e]/8 flex items-center px-4 md:px-6 gap-3">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 font-extrabold">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-[#2d1b4e]">
              F
            </div>
            <span className="text-gradient-primary">FinTeen</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1b4e]/40" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-[#fff8f0] border-2 border-[#2d1b4e]/8 text-sm font-semibold text-[#2d1b4e] placeholder:text-[#2d1b4e]/40 focus:outline-none focus:border-[#a855f7]"
            />
          </div>

          <div className="flex-1 lg:flex-none" />

          {/* Bell */}
          <button
            className="relative w-10 h-10 rounded-full bg-[#fff8f0] hover:bg-[#2d1b4e]/8 flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#2d1b4e]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b9d] rounded-full" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white font-extrabold text-sm shadow-sm`}
            >
              {user?.avatar || 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-extrabold text-[#2d1b4e] leading-tight">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-[#2d1b4e]/60">{role.label}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
