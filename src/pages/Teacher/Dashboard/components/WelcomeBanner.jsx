import { Star, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({
  user,
  rating,
  totalStudents,
  pendingGrading,
  accent = '#0284c7',
  accentText = '#0369a1',
}) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-white"
      style={{ backgroundColor: accent }}
    >
      {/* Decorative color blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#fbbf24' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#38bdf8' }}
        aria-hidden="true"
      />

      {/* Decorative */}
      <span className="absolute -bottom-4 -right-4 text-7xl opacity-20" aria-hidden="true">📚</span>
      <PlusCircle
        className="absolute top-12 left-1/4 w-5 h-5 animate-bounce-subtle"
        style={{ color: '#fbbf24', opacity: 0.6 }}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-xs font-bold mb-3">
          <Star className="w-3 h-3 fill-[#fbbf24] text-[#fbbf24]" aria-hidden="true" />
          Đánh giá <span className="text-[#fbbf24] font-extrabold">{rating}</span> từ học sinh
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">
          Chào {user?.name || 'cô'}!
        </h1>
        <p className="text-white/95 text-sm md:text-base mb-5">
          Bạn đang quản lý{' '}
          <span className="font-extrabold" style={{ color: '#fbbf24' }}>
            {pendingGrading || 'nhiều'} lớp
          </span>{' '}
          với tổng cộng <span className="font-extrabold">{totalStudents} học sinh</span>. Có{' '}
          <span className="font-extrabold text-[#fefce8]">5 bài nộp</span> cần chấm hôm nay
        </p>
        <Button
          className="bg-white hover:bg-[#faf8f5] border-0 font-extrabold shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
          style={{ color: accentText }}
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" /> Tạo bài tập mới
        </Button>
      </div>
    </div>
  )
}
