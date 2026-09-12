/**
 * Card thống kê dùng chung trong dashboards.
 * - accent: tên preset color (lime/green/orange/yellow/blue/purple/coral/red)
 * - accentColor: màu hex từ role (optional — sẽ override preset)
 * - accentText: text color tương ứng (optional)
 */
const accentMap = {
  lime: { bg: '#84cc1615', text: '#65a30d', border: '#84cc16' },
  green: { bg: '#22c55e15', text: '#16a34a', border: '#22c55e' },
  dark: { bg: '#16a34a15', text: '#16a34a', border: '#16a34a' },
  light: { bg: '#4ade8015', text: '#22c55e', border: '#4ade80' },
  orange: { bg: '#fb923c15', text: '#ea580c', border: '#fb923c' },
  yellow: { bg: '#fbbf2415', text: '#b45309', border: '#fbbf24' },
  blue: { bg: '#38bdf815', text: '#0369a1', border: '#38bdf8' },
  purple: { bg: '#a78bfa15', text: '#6d28d9', border: '#a78bfa' },
  coral: { bg: '#f8717115', text: '#dc2626', border: '#f87171' },
  pink: { bg: '#ec489915', text: '#be185d', border: '#ec4899' },
  red: { bg: '#f8717115', text: '#dc2626', border: '#f87171' },
}

function hexToBg(hex) {
  // Convert hex to rgba-ish with 15% opacity by appending to string
  return `${hex}15`
}

export function StatCard({
  label,
  value,
  hint,
  emoji,
  accent = 'green',
  trend,
  accentColor,
  accentText,
}) {
  // Ưu tiên dùng accentColor từ role, fallback preset
  const baseColor = accentColor || accentMap[accent]?.border || '#22c55e'
  const textColor = accentText || accentMap[accent]?.text || '#16a34a'
  const bgColor = accentColor ? hexToBg(accentColor) : accentMap[accent]?.bg || '#22c55e15'
  const borderColor = accentColor ? `${baseColor}66` : `${accentMap[accent]?.border || '#22c55e'}66`

  return (
    <div className="bg-white rounded-2xl border-2 border-[#22c55e]/10 p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl border-2 flex items-center justify-center text-xl"
          style={{
            backgroundColor: bgColor,
            borderColor: borderColor,
          }}
        >
          {emoji}
        </div>
        {trend && (
          <span
            className={`text-xs font-extrabold ${trend.startsWith('+') ? 'text-[#16a34a]' : 'text-[#f87171]'}`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-black text-[#1a3a1a] leading-none">{value}</div>
      <div className="text-xs text-[#1a3a1a]/60 mt-1.5 font-medium">{label}</div>
      {hint && <div className="text-[10px] text-[#1a3a1a]/40 mt-1">{hint}</div>}
    </div>
  )
}

export function SectionHeader({ title, subtitle, emoji, action }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-[#1a3a1a] flex items-center gap-2">
          {emoji && <span aria-hidden="true">{emoji}</span>}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-[#1a3a1a]/60 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
