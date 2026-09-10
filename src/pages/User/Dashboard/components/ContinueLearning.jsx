import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

export default function ContinueLearning({ lessons }) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Tiếp tục học"
        subtitle="Bài học bạn đang dở dang"
        emoji="📖"
        action={
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#2d1b4e] text-[#2d1b4e] hover:bg-[#2d1b4e] hover:text-white"
          >
            Xem tất cả
          </Button>
        }
      />
      <div className="grid md:grid-cols-3 gap-4">
        {lessons.map(l => (
          <div
            key={l.id}
            className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 p-5 hover:-translate-y-0.5 hover:shadow-finteen-md hover:border-[#ff6b9d] transition-all cursor-pointer"
          >
            <div className="text-3xl mb-3">{l.emoji}</div>
            <div className="text-xs font-bold text-[#a855f7] uppercase tracking-wider mb-1">
              {l.subject}
            </div>
            <div className="text-base font-extrabold text-[#2d1b4e] mb-3">{l.title}</div>
            <div className="h-2 bg-[#fff8f0] rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full transition-all"
                style={{ width: `${l.progress}%` }}
              />
            </div>
            <div className="text-xs text-[#2d1b4e]/60 mt-1.5 font-medium">
              {l.progress}% hoàn thành
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
