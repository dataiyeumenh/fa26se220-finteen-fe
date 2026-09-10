import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({ user, rating, totalStudents, pendingGrading }) {
  return (
    <div className="bg-gradient-to-br from-[#fbbf24] to-[#ff8e53] rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-white">
      <span className="absolute top-2 right-4 text-6xl opacity-90">👩‍🏫</span>
      <span className="absolute -bottom-4 -right-4 text-7xl opacity-20">📚</span>
      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-xs font-bold mb-3">
          <Star className="w-3 h-3 fill-current" />
          Đánh giá {rating} ⭐ từ học sinh
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">
          Chào {user?.name || 'cô'}! 🌟
        </h1>
        <p className="text-white/95 text-sm md:text-base mb-5">
          Bạn đang quản lý <span className="font-extrabold">{pendingGrading || 'nhiều'} lớp</span> với tổng cộng{' '}
          <span className="font-extrabold">{totalStudents} học sinh</span>. Có{' '}
          <span className="font-extrabold">5 bài nộp</span> cần chấm hôm nay 📝
        </p>
        <Button className="bg-white text-[#ff8e53] hover:bg-[#fff8f0] border-0 font-extrabold">
          ➕ Tạo bài tập mới
        </Button>
      </div>
    </div>
  )
}
