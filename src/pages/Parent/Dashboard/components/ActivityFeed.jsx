import { SectionHeader } from '@/components/dashboard/StatCard'

export default function ActivityFeed({ items }) {
  return (
    <div className="mb-8">
      <SectionHeader title="Hoạt động gần đây" subtitle="Nhật ký học tập của con" emoji="📜" />
      <div className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 divide-y-2 divide-[#2d1b4e]/8">
        {items.map(a => (
          <div
            key={a.id}
            className="p-4 flex items-center gap-4 hover:bg-[#fff8f0]/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#b8ff3d]/15 flex items-center justify-center text-xl">
              {a.emoji}
            </div>
            <div className="flex-1 text-sm text-[#2d1b4e] font-medium">{a.text}</div>
            <div className="text-xs text-[#2d1b4e]/50">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
