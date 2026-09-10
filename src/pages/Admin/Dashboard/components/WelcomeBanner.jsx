import { Server } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({ systemOk }) {
  return (
    <div className="bg-gradient-to-br from-[#4dabff] via-[#a855f7] to-[#2d1b4e] rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-white">
      <span className="absolute top-2 right-4 text-6xl opacity-90">🛡️</span>
      <span className="absolute -bottom-4 -right-4 text-7xl opacity-20">⚙️</span>
      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-xs font-bold mb-3">
          <Server className="w-3 h-3" />
          Hệ thống {systemOk ? 'hoạt động bình thường' : 'có cảnh báo'}
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">Chào Admin! 👋</h1>
        <p className="text-white/95 text-sm md:text-base mb-5">
          Hệ thống có <span className="font-extrabold">12.4K người dùng</span>, trong đó{' '}
          <span className="font-extrabold">8.2K hoạt động</span> hôm nay. Có{' '}
          <span className="font-extrabold">3 báo cáo lỗi</span> cần xem xét 🛠️
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-white text-[#a855f7] hover:bg-[#fff8f0] border-0 font-extrabold">
            Xem báo cáo lỗi
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#a855f7] font-extrabold"
          >
            Cài đặt nhanh
          </Button>
        </div>
      </div>
    </div>
  )
}
