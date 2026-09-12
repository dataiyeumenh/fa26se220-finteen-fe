import { SectionHeader } from '@/components/dashboard/StatCard'

const achievementColors = ['#fbbf24', '#f59e0b', '#d97706', '#38bdf8', '#a78bfa', '#22c55e']

export default function Achievements({ items }) {
  return (
    <div className="mb-8">
      <SectionHeader title="Thành tích gần đây" emoji="🏅" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((a, idx) => {
          const color = achievementColors[idx % achievementColors.length]
          return (
            <div
              key={a.id}
              className="bg-white rounded-2xl border-2 border-[#fbbf24]/30 p-5 text-center hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(251,191,36,0.3)] transition-all relative overflow-hidden"
            >
              {/* Background tint */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <span aria-hidden="true">{a.emoji}</span>
                </div>
                <div className="text-sm font-extrabold text-[#1a3a1a]">{a.title}</div>
                <div className="text-xs text-[#1a3a1a]/60 mt-1">{a.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
