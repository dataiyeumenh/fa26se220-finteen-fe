import { useNavigate } from 'react-router-dom'
import { Rocket, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTA({ onTryDemo }) {
  const navigate = useNavigate()

  return (
    <section className="relative py-24 md:py-28 bg-[#22c55e] text-center overflow-hidden">
      {/* Solid color blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#fbbf24] opacity-20 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#84cc16] opacity-25 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#16a34a] opacity-15 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5 text-balance text-white">
          Sẵn sàng trở thành <span className="text-[#1a3a1a]">thiên tài tiền</span> chưa?
        </h2>
        <p className="text-lg md:text-xl text-white mb-10 max-w-[560px] mx-auto text-balance font-medium">
          Tham gia cùng 10.000+ bạn trẻ đang thay đổi cách nghĩ về tiền — mỗi ngày
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="xl"
            onClick={() => navigate('/register')}
            className="bg-white text-[#16a34a] font-extrabold hover:bg-[#faf8f5] border-0 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] hover:-translate-y-0.5"
          >
            Bắt đầu miễn phí <Rocket className="w-4 h-4 ml-2 text-[#fbbf24]" aria-hidden="true" />
          </Button>
          <Button
            size="xl"
            variant="light"
            onClick={onTryDemo}
          >
            Xem demo 1 phút <Play className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
