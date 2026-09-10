/**
 * Card thống kê dùng chung trong dashboards.
 * - accent: tên accent color key (lime/pink/purple/blue/orange)
 */
const accentMap = {
  lime: { bg: 'bg-[#b8ff3d]/15', text: 'text-[#9eea1f]', border: 'border-[#b8ff3d]/40' },
  pink: { bg: 'bg-[#ff6b9d]/15', text: 'text-[#ff6b9d]', border: 'border-[#ff6b9d]/40' },
  purple: { bg: 'bg-[#a855f7]/15', text: 'text-[#a855f7]', border: 'border-[#a855f7]/40' },
  blue: { bg: 'bg-[#4dabff]/15', text: 'text-[#4dabff]', border: 'border-[#4dabff]/40' },
  orange: { bg: 'bg-[#ff8e53]/15', text: 'text-[#ff8e53]', border: 'border-[#ff8e53]/40' },
  yellow: { bg: 'bg-[#ffd93d]/15', text: 'text-[#fbbf24]', border: 'border-[#ffd93d]/40' },
}

export function StatCard({ label, value, hint, emoji, accent = 'purple', trend }) {
  const a = accentMap[accent] || accentMap.purple
  return (
    <div className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 p-5 hover:-translate-y-0.5 hover:shadow-finteen-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-xl ${a.bg} ${a.border} border-2 flex items-center justify-center text-xl`}
        >
          {emoji}
        </div>
        {trend && (
          <span className={`text-xs font-extrabold ${trend.startsWith('+') ? 'text-[#9eea1f]' : 'text-[#ff6b9d]'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="font-display text-3xl font-black text-[#2d1b4e] leading-none">{value}</div>
      <div className="text-xs text-[#2d1b4e]/60 mt-1.5 font-medium">{label}</div>
      {hint && <div className="text-[10px] text-[#2d1b4e]/40 mt-1">{hint}</div>}
    </div>
  )
}

export function SectionHeader({ title, subtitle, emoji, action }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-[#2d1b4e] flex items-center gap-2">
          {emoji && <span>{emoji}</span>}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-[#2d1b4e]/60 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
