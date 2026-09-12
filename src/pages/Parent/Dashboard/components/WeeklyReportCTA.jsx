import { BarChart3, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WeeklyReportCTA({ accent = '#fb923c', accentText = '#c2410c' }) {
  return (
    <div
      className="bg-white rounded-2xl border-2 p-5 md:p-6 flex items-center gap-4 relative overflow-hidden"
      style={{ borderColor: `${accent}40` }}
    >
      {/* Side color stripe */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}20` }}
      >
        <BarChart3 className="w-7 h-7" style={{ color: accentText }} aria-hidden="true" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-[#1a3a1a]">Báo cáo tuần mới đã sẵn sàng!</div>
        <div className="text-xs text-[#1a3a1a]/65 mt-0.5">
          Xem chi tiết tiến độ, thời gian học và điểm số của con trong tuần vừa qua
        </div>
      </div>
      <Button
        size="sm"
        className="font-extrabold hidden md:inline-flex border-0"
        style={{ backgroundColor: accent, color: '#ffffff' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Xem ngay
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Button>
    </div>
  )
}
