import { SectionHeader } from '@/components/dashboard/StatCard'

export default function Achievements({ items }) {
  return (
    <div className="mb-8">
      <SectionHeader title="Thành tích gần đây" emoji="🏅" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(a => (
          <div
            key={a.id}
            className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 p-5 text-center hover:-translate-y-0.5 hover:shadow-finteen-md transition-all"
          >
            <div className="text-4xl mb-2">{a.emoji}</div>
            <div className="text-sm font-extrabold text-[#2d1b4e]">{a.title}</div>
            <div className="text-xs text-[#2d1b4e]/60 mt-1">{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
