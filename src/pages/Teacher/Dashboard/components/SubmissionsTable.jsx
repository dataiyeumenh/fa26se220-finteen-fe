import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

export default function SubmissionsTable({ submissions }) {
  const pendingCount = submissions.filter(s => s.status === 'pending').length

  return (
    <div className="mb-8">
      <SectionHeader
        title="Bài nộp gần đây"
        subtitle="Cần chấm và phản hồi sớm nhé"
        emoji="📝"
        action={
          <Button
            size="sm"
            className="bg-[#fb923c] text-white border-0 font-extrabold hover:bg-[#ea580c] shadow-[0_4px_14px_rgba(251,146,60,0.3)]"
          >
            Chấm tất cả ({pendingCount})
          </Button>
        }
      />
      <div className="bg-white rounded-2xl border-2 border-[#38bdf8]/15 overflow-hidden">
        {submissions.map((s, i) => (
          <div
            key={s.id}
            className={`p-4 flex items-center gap-4 hover:bg-[#faf8f5]/50 transition-colors ${
              i !== submissions.length - 1 ? 'border-b-2 border-[#38bdf8]/15' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/15 flex items-center justify-center text-base font-extrabold text-[#6d28d9]">
              {s.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-[#1a3a1a] truncate">{s.name}</div>
              <div className="text-xs text-[#1a3a1a]/60">{s.task}</div>
            </div>
            <div className="text-xs text-[#1a3a1a]/50 hidden md:block">{s.time}</div>
            {s.status === 'done' ? (
              <div className="bg-[#22c55e]/15 text-[#16a34a] text-xs font-extrabold px-3 py-1.5 rounded-full">
                ⭐ {s.score}
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-[#fb923c] text-white hover:bg-[#ea580c] border-0 font-extrabold"
              >
                Chấm ngay
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
