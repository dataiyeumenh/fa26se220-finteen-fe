import { SectionHeader } from '@/components/dashboard/StatCard'

const activityColors = [
  '#fb923c30',
  '#fdba7430',
  '#a78bfa30',
  '#c084fc30',
  '#f9731630',
  '#22c55e30',
]

export default function ActivityFeed({ items, accent = '#fb923c' }) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Hoạt động gần đây"
        subtitle="Nhật ký học tập của con"
        emoji="📜"
      />
      <div
        className="bg-white rounded-2xl border-2 divide-y-2"
        style={{ borderColor: `${accent}30`, borderTopColor: `${accent}30` }}
      >
        {items.map((a, idx) => (
          <div
            key={a.id}
            className="p-4 flex items-center gap-4 hover:bg-[#faf8f5]/50 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: activityColors[idx % activityColors.length] }}
            >
              <span aria-hidden="true">{a.emoji}</span>
            </div>
            <div className="flex-1 text-sm text-[#1a3a1a] font-medium">{a.text}</div>
            <div className="text-xs text-[#1a3a1a]/50">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
