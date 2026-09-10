import { Button } from '@/components/ui/button'

export default function AnalyticsCTA() {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#ffd93d]/40 p-5 md:p-6 flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#ffd93d]/15 flex items-center justify-center text-3xl shrink-0">
        📊
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-[#2d1b4e]">Thống kê học tập tuần này</div>
        <div className="text-xs text-[#2d1b4e]/65 mt-0.5">
          Xem điểm, tiến độ và thời gian học của từng lớp để điều chỉnh bài giảng
        </div>
      </div>
      <Button
        size="sm"
        className="bg-[#ff8e53] text-white hover:bg-[#ff8e53]/90 border-0 font-extrabold hidden md:inline-flex"
      >
        Xem ngay
      </Button>
    </div>
  )
}
