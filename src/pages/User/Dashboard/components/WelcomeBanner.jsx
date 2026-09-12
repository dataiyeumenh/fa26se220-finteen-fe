import { Flame, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({
  user,
  streak,
  lessonsThisWeek,
  lessonsTarget,
  accent = '#fbbf24',
  accentText = '#92400e',
}) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-white"
      style={{ backgroundColor: accent }}
    >
      {/* Decorative color blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#f59e0b' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#fbbf24' }}
        aria-hidden="true"
      />

      <div className="relative">
        <div
          className="inline-flex items-center gap-2 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold mb-3 border border-white/20 text-white"
        >
          <Flame className="w-3 h-3" aria-hidden="true" />
          Streak {streak} ngày
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">
          Chào {user?.name || 'bạn'}!
        </h1>
        <p className="text-white/90 text-sm md:text-base mb-5">
          Bạn đã học{' '}
          <span className="font-extrabold text-white">
            {lessonsThisWeek} bài
          </span>{' '}
          tuần này. Còn{' '}
          <span className="font-extrabold text-white">
            {lessonsTarget - lessonsThisWeek} bài
          </span>{' '}
          nữa là hoàn thành mục tiêu
        </p>
        <Button
          className="bg-white text-[#92400e] hover:bg-white/90 border-0 font-extrabold shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
        >
          <PlayCircle className="w-4 h-4" aria-hidden="true" /> Tiếp tục học
        </Button>
      </div>
    </div>
  )
}
