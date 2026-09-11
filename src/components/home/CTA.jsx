import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function CTA({ onTryDemo }) {
  const navigate = useNavigate()

  return (
    <section className="relative py-24 md:py-28 gradient-primary text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(184, 255, 61, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(77, 171, 255, 0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Floating stickers */}
      <span className="absolute top-16 left-[15%] text-4xl animate-bounce-subtle">💸</span>
      <span className="absolute top-24 right-[18%] text-3xl animate-bounce-subtle" style={{ animationDelay: '0.6s' }}>⭐</span>
      <span className="absolute bottom-20 left-[20%] text-3xl animate-bounce-subtle" style={{ animationDelay: '1.2s' }}>🚀</span>
      <span className="absolute bottom-28 right-[15%] text-4xl animate-bounce-subtle" style={{ animationDelay: '1.8s' }}>💖</span>

      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5 text-balance text-white">
          Sẵn sàng trở thành <span className="text-[#2d1b4e]">thiên tài tiền</span> chưa? 🧠
        </h2>
        <p className="text-lg md:text-xl text-white/95 mb-10 max-w-[560px] mx-auto text-balance font-medium">
          Tham gia cùng 10.000+ bạn trẻ đang thay đổi cách nghĩ về tiền — mỗi ngày ✨
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="xl"
            onClick={() => navigate('/register')}
            className="bg-white text-[#2d1b4e] font-extrabold hover:bg-[#fff8f0] border-0 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] hover:-translate-y-0.5"
          >
            Bắt đầu miễn phí 🚀
          </Button>
          <Button
            size="xl"
            variant="outline"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2d1b4e] font-extrabold"
          >
            Xem demo 1 phút ▶
          </Button>
        </div>
      </div>
    </section>
  )
}
