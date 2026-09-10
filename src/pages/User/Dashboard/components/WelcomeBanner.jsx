import { Flame, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({ user, streak, lessonsThisWeek, lessonsTarget }) {
  return (
    <div className="bg-gradient-to-br from-[#a855f7] to-[#ff6b9d] rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-white">
      <span className="absolute top-2 right-4 text-6xl opacity-90">🎉</span>
      <span className="absolute -bottom-4 -right-4 text-7xl opacity-20">💸</span>
      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-xs font-bold mb-3">
          <Flame className="w-3 h-3" />
          Streak {streak} ngày 🔥
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">
          Chào {user?.name || 'bạn'}! 👋
        </h1>
        <p className="text-white/90 text-sm md:text-base mb-5">
          Bạn đã học <span className="font-extrabold">{lessonsThisWeek} bài</span> tuần này. Còn{' '}
          <span className="font-extrabold">{lessonsTarget - lessonsThisWeek} bài</span> nữa là hoàn thành mục tiêu 🚀
        </p>
        <Button className="bg-white text-[#a855f7] hover:bg-[#fff8f0] border-0 font-extrabold">
          <PlayCircle className="w-4 h-4" /> Tiếp tục học
        </Button>
      </div>
    </div>
  )
}
