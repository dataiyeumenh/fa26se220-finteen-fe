import { Button } from '@/components/ui/button'

export default function WeeklyReportCTA() {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#4dabff]/30 p-5 md:p-6 flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#4dabff]/15 flex items-center justify-center text-3xl shrink-0">
        📊
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-[#2d1b4e]">Báo cáo tuần mới đã sẵn sàng!</div>
        <div className="text-xs text-[#2d1b4e]/65 mt-0.5">
          Xem chi tiết tiến độ, thời gian học và điểm số của con trong tuần vừa qua
        </div>
      </div>
      <Button
        size="sm"
        className="bg-[#4dabff] text-white hover:bg-[#4dabff]/90 border-0 font-extrabold hidden md:inline-flex"
      >
        Xem ngay
      </Button>
    </div>
  )
}
