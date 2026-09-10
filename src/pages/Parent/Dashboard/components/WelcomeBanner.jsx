import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({ user, weeklyGrowth, streakChild }) {
  return (
    <div className="bg-gradient-to-br from-[#4dabff] to-[#b8ff3d] rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-white">
      <span className="absolute top-2 right-4 text-6xl opacity-90">👨‍👩‍👧</span>
      <span className="absolute -bottom-4 -right-4 text-7xl opacity-20">📊</span>
      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-xs font-bold mb-3">
          <TrendingUp className="w-3 h-3" />
          Tuần này: +{weeklyGrowth}% tiến bộ
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">
          Xin chào phụ huynh {user?.name || ''}! 🌟
        </h1>
        <p className="text-white/95 text-sm md:text-base mb-5">
          Cả 2 con đều đang học tốt. <span className="font-extrabold">{streakChild}</span> có streak{' '}
          <span className="font-extrabold">7 ngày</span>, ai đó vừa hoàn thành bài kiểm tra 🎉
        </p>
        <Button className="bg-white text-[#4dabff] hover:bg-[#fff8f0] border-0 font-extrabold">
          Xem báo cáo chi tiết
        </Button>
      </div>
    </div>
  )
}
