import { TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({
  user,
  weeklyGrowth,
  streakChild,
  accent = '#fb923c',
  accentText = '#c2410c',
}) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-white"
      style={{ backgroundColor: accent }}
    >
      {/* Decorative color blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#ea580c' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#f97316' }}
        aria-hidden="true"
      />

      {/* Decorative */}
      <span className="absolute -bottom-4 -right-4 text-7xl opacity-20" aria-hidden="true">📊</span>
      <Users
        className="absolute top-12 left-1/4 w-5 h-5 animate-bounce-subtle"
        style={{ color: '#ffffff', opacity: 0.5 }}
        aria-hidden="true"
      />

      <div className="relative">
        <div
          className="inline-flex items-center gap-2 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold mb-3 border border-white/25 text-white"
        >
          <TrendingUp className="w-3 h-3" aria-hidden="true" />
          Tuần này: <span className="font-extrabold">+{weeklyGrowth}%</span> tiến bộ
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">
          Xin chào phụ huynh {user?.name || ''}!
        </h1>
        <p className="text-white/90 text-sm md:text-base mb-5">
          Cả 2 con đều đang học tốt.{' '}
          <span className="font-extrabold text-white">
            {streakChild}
          </span>{' '}
          có streak <span className="font-extrabold text-white">7 ngày</span>, ai đó vừa hoàn thành bài kiểm tra
        </p>
        <Button
          className="bg-white text-[#c2410c] hover:bg-white/90 border-0 font-extrabold shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
        >
          Xem báo cáo chi tiết
        </Button>
      </div>
    </div>
  )
}
