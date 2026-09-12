import { Link, useLocation } from 'react-router-dom'
import { Bell, Search, LogOut, Home, Users, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Map emoji string → Lucide icon component
const emojiMap = {
  Users,
  GraduationCap,
  // thêm icon khác nếu cần
}

/**
 * Layout dùng chung cho cả 4 role dashboards.
 * - `role`: object { id, label, emoji, accent, accentText, accentBg, accentHover, accentDeep, onAccent }
 *   Trong đó:
 *     - accent: màu chính của role (solid)
 *     - accentText: text color cho accent buttons/links
 *     - accentBg: background tint nhẹ cho active items
 *     - accentHover: hover background
 *     - accentDeep: color sâu hơn cho shadow glow
 *     - onAccent: màu text/icon khi đặt TRÊN nền accent (vd white cho dark bg, dark cho light bg)
 * - `navItems`: các item sidebar [{ icon, label, to, badge? }]
 * - `user`: object { name, role, avatar }
 */
export function DashboardLayout({ role, navItems, user, children }) {
  const location = useLocation()

  // Tách các giá trị accent ra để dùng trong nhiều class
  const accent = role.accent || '#22c55e'
  const accentText = role.accentText || '#16a34a'
  const accentBg = role.accentBg || '#22c55e15'
  const accentHover = role.accentHover || '#22c55e10'
  const accentDeep = role.accentDeep || '#16a34a'
  // Mặc định: nếu accent là dark/vibrant → white text, light → dark text
  const onAccent = role.onAccent || '#ffffff'

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 bg-white border-r-2 sticky top-0 h-screen"
        style={{ borderColor: `${accent}15` }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 px-6 h-16 border-b-2"
          style={{ borderColor: `${accent}10` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold"
            style={{
              backgroundColor: accent,
              color: onAccent,
              boxShadow: `0 4px 14px ${accent}50`,
            }}
          >
            F
          </div>
          <span
            className="font-extrabold text-lg"
            style={{ color: accent }}
          >
            FinTeen
          </span>
        </Link>

        {/* Role badge — solid color */}
        <div className="px-4 py-4">
          <div
            className="rounded-2xl p-4 relative overflow-hidden"
            style={{
              backgroundColor: accent,
              color: onAccent,
            }}
          >
            {/* Icon đại diện role — Lucide */}
            {(() => {
              const Icon = emojiMap[role.emoji]
              return Icon ? (
                <Icon
                  className="absolute top-2 right-2 w-7 h-7 opacity-80"
                  style={{ color: onAccent }}
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="absolute top-1 right-2 text-2xl opacity-80"
                  style={{ color: onAccent }}
                  aria-hidden="true"
                >
                  {role.emoji}
                </span>
              )
            })()}
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-85">
              Đang đăng nhập
            </div>
            <div className="text-base font-extrabold mt-0.5">{role.label}</div>
            <div className="text-xs opacity-90 mt-0.5">{user?.name || 'Guest'}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1a3a1a]/40 px-3 py-2">
            Menu
          </div>
          {navItems.map(item => {
            const active = location.pathname === item.to
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-bold transition-all"
                style={
                  active
                    ? { backgroundColor: accentBg, color: accentText }
                    : { color: '#1a3a1a' }
                }
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.backgroundColor = accentHover
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                    style={
                      item.badgeStyle
                        ? item.badgeStyle
                        : { backgroundColor: `${accent}15`, color: accentText }
                    }
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div
          className="p-4 border-t-2 space-y-2"
          style={{ borderColor: `${accent}10` }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-[#1a3a1a]/70"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = accentHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Home className="w-4 h-4" /> Về trang chủ
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            style={{ color: accentText }}
          >
            <LogOut className="w-4 h-4" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b-2 flex items-center px-4 md:px-6 gap-3"
          style={{ borderColor: `${accent}10` }}
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 font-extrabold">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: accent, color: onAccent }}
            >
              F
            </div>
            <span style={{ color: accent }}>FinTeen</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a3a1a]/40" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-[#faf8f5] border-2 text-sm font-semibold text-[#1a3a1a] placeholder:text-[#1a3a1a]/40 focus:outline-none"
              style={{ borderColor: `${accent}30` }}
              onFocus={e => (e.currentTarget.style.borderColor = accent)}
              onBlur={e => (e.currentTarget.style.borderColor = `${accent}30`)}
            />
          </div>

          <div className="flex-1 lg:flex-none" />

          {/* Bell */}
          <button
            className="relative w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center transition-colors"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = accentHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#faf8f5')}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#1a3a1a]" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#fbbf24' }}
            />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shadow-sm"
              style={{ backgroundColor: accent, color: onAccent }}
            >
              {user?.avatar || 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-extrabold text-[#1a3a1a] leading-tight">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-[#1a3a1a]/60">{role.label}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
