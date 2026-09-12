import { BarChart3, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AnalyticsCTA() {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#38bdf8]/25 p-5 md:p-6 flex items-center gap-4 relative overflow-hidden">
      {/* Side color stripe */}
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#0284c7]" aria-hidden="true" />

      <div className="w-14 h-14 rounded-2xl bg-[#0284c7] flex items-center justify-center shrink-0">
        <BarChart3 className="w-7 h-7 text-white" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-[#1a3a1a]">Thống kê học tập tuần này</div>
        <div className="text-xs text-[#1a3a1a]/65 mt-0.5">
          Xem điểm, tiến độ và thời gian học của từng lớp để điều chỉnh bài giảng
        </div>
      </div>
      <Button
        size="sm"
        className="bg-[#0284c7] text-white hover:bg-[#0369a1] border-0 font-extrabold hidden md:inline-flex"
      >
        Xem ngay
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}
