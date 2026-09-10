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
          <Button size="sm" className="gradient-primary text-white border-0 font-extrabold">
            Chấm tất cả ({pendingCount})
          </Button>
        }
      />
      <div className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 overflow-hidden">
        {submissions.map((s, i) => (
          <div
            key={s.id}
            className={`p-4 flex items-center gap-4 hover:bg-[#fff8f0]/50 transition-colors ${
              i !== submissions.length - 1 ? 'border-b-2 border-[#2d1b4e]/8' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#ffd93d]/15 flex items-center justify-center text-base font-extrabold text-[#2d1b4e]">
              {s.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-[#2d1b4e] truncate">{s.name}</div>
              <div className="text-xs text-[#2d1b4e]/60">{s.task}</div>
            </div>
            <div className="text-xs text-[#2d1b4e]/50 hidden md:block">{s.time}</div>
            {s.status === 'done' ? (
              <div className="bg-[#b8ff3d]/20 text-[#9eea1f] text-xs font-extrabold px-3 py-1.5 rounded-full">
                ⭐ {s.score}
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-[#ff8e53] text-white hover:bg-[#ff8e53]/90 border-0 font-extrabold"
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
