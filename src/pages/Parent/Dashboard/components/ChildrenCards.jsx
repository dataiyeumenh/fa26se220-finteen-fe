import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

export default function ChildrenCards({ children }) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Theo dõi con em"
        subtitle="Tiến độ học tập của các con"
        emoji="👨‍👩‍👧‍👦"
        action={
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#2d1b4e] text-[#2d1b4e] hover:bg-[#2d1b4e] hover:text-white"
          >
            Thêm con
          </Button>
        }
      />
      <div className="grid md:grid-cols-2 gap-4">
        {children.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 p-6 hover:shadow-finteen-md transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center text-white font-extrabold text-xl shadow-sm`}
              >
                {c.avatar}
              </div>
              <div className="flex-1">
                <div className="text-base font-extrabold text-[#2d1b4e]">{c.name}</div>
                <div className="text-xs text-[#2d1b4e]/60">{c.grade}</div>
              </div>
              <span className="text-xs font-bold text-[#9eea1f] bg-[#b8ff3d]/15 px-2.5 py-1 rounded-full">
                🔥 {c.streak} ngày
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs font-bold text-[#2d1b4e] mb-1.5">
                <span>Tiến độ tổng</span>
                <span>{c.progress}%</span>
              </div>
              <div className="h-2.5 bg-[#fff8f0] rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.color} rounded-full`}
                  style={{ width: `${c.progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-[#2d1b4e]/65 font-medium pt-3 border-t border-[#2d1b4e]/8">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {c.weeklyTime} / tuần
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-[#4dabff] hover:bg-[#4dabff]/10 h-auto p-0 font-extrabold"
              >
                Chi tiết →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
