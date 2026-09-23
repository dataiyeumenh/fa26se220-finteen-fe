import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowRight,
  Coins,
  TrendingUp,
  Users,
  BookOpen,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Hero({ onTryDemo }) {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-[#fcfcff]">
      {/* Decorative blobs — solid colors, no gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[8%] right-[-8%] w-[320px] h-[320px] rounded-full bg-[#ffe43b] opacity-10 blur-3xl animate-float" />
        <div className="absolute bottom-[15%] left-[-5%] w-[280px] h-[280px] rounded-full bg-[#339b75] opacity-15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[30%] w-[220px] h-[220px] rounded-full bg-[#ffe99b] opacity-10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[20%] left-[10%] w-[180px] h-[180px] rounded-full bg-[#ffe43b] opacity-[0.07] blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] right-[15%] w-[160px] h-[160px] rounded-full bg-[#4f9be8] opacity-[0.08] blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="animate-slide-in">
            <div className="inline-flex items-center gap-2 bg-[#dcf6e8] border-2 border-[#b7e5cb] rounded-full px-4 py-2 text-sm font-bold text-[#206c53] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#ffe43b]" aria-hidden="true" />
              <span>Học tài chính — không nhàm chán</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 text-balance text-[#25263d]">
              Quản{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#25263d]">đồng tiền</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#ffe43b] -z-0" aria-hidden="true" />
              </span>
              <br />
              <span className="text-[#7151b2]">genius</span>
            </h1>

            <p className="text-lg md:text-xl text-[#25263d]/75 leading-relaxed mb-10 max-w-[540px] text-balance">
              Khám phá cách quản lý tiền qua những bài học ngắn,
              trò chơi vui và các lựa chọn trong cuộc sống. Học từng chút, tự tin từng ngày.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="xl"
                onClick={() => navigate('/register')}
                className="bg-[#ffe43b] text-[#25263d] border-0 shadow-[0_8px_24px_rgba(215,166,35,0.35)] hover:bg-[#f5d51f]"
              >
                Bắt đầu miễn phí <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
                className="border-2 border-[#25263d] text-[#25263d] hover:bg-[#25263d] hover:text-white"
              >
                <a href="#how-it-works">Xem nó chạy thế nào</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t-2 border-dashed border-[#ffe43b]/20">
              {[
                { value: '13–18', label: 'Độ tuổi khám phá', Icon: Users, color: '#3568bd' },
                { value: '8', label: 'Chương hành trình', Icon: TrendingUp, color: '#339b75' },
                { value: '1', label: 'Chương dùng thử', Icon: BookOpen, color: '#7554b8' },
              ].map(stat => {
                const Icon = stat.Icon
                return (
                  <div key={stat.label}>
                    <div className="flex items-baseline gap-1.5">
                      <Icon className="w-5 h-5" style={{ color: stat.color }} aria-hidden="true" />
                      <span className="font-display text-4xl md:text-5xl font-black" style={{ color: stat.color }}>
                        {stat.value}
                      </span>
                    </div>
                    <div className="text-sm text-[#25263d]/65 mt-1 font-medium">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="home-phone-scene relative animate-slide-in" style={{ animationDelay: '200ms' }}>
            <div className="relative w-full max-w-[320px] mx-auto">
              {/* Phone frame */}
              <div className="bg-[#25263d] rounded-[40px] p-3 shadow-[0_20px_60px_rgba(215,166,35,0.25)] border-[3px] border-[#25263d]">
                <div className="bg-white rounded-[32px] overflow-hidden aspect-[9/19]">
                  <div className="bg-[#ffe43b] text-[#25263d] py-5 px-4 text-center">
                    <h3 className="text-base font-extrabold">Lãi kép thần kỳ</h3>
                    <p className="text-xs opacity-90 mt-1">10 triệu → bao nhiêu?</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-[#e4f6ed] border-2 border-[#339b75]/20 rounded-2xl p-4">
                      <div className="text-xs text-[#25263d]/65 mb-1.5 font-medium">
                        Đoán đi: 10 triệu sau 40 năm?
                      </div>
                      <div className="font-display text-3xl font-black text-[#25263d]">? VNĐ</div>
                    </div>
                    <Input
                      type="text"
                      defaultValue="20,000,000"
                      placeholder="Nhập số của bạn..."
                      className="border-2 border-[#ffe43b]/20"
                    />
                    <Button
                      onClick={onTryDemo}
                      className="w-full bg-[#ffe43b] text-[#25263d] font-bold border-0 hover:bg-[#f59e0b]"
                    >
                      Xem đáp án <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating stickers — mỗi cái 1 màu riêng */}
              <div className="hidden md:flex absolute top-[12%] right-[-18%] bg-[#ffdfce] rounded-2xl p-3 shadow-[0_8px_24px_rgba(244,114,182,0.2)] animate-bounce-subtle items-center gap-2 border-2 border-[#e8b49a]/40">
                <span className="text-xl" aria-hidden="true">😱</span>
                <div>
                  <div className="text-xs font-extrabold text-[#25263d]">Thử đoán xem!</div>
                  <div className="text-[10px] text-[#25263d]/60">Khám phá sức mạnh lãi kép</div>
                </div>
              </div>

              <div
                className="hidden md:flex absolute bottom-[22%] left-[-18%] bg-[#e7deff] rounded-2xl p-3 shadow-[0_8px_24px_rgba(215,166,35,0.2)] animate-bounce-subtle items-center gap-2 border-2 border-[#bba9ea]/40"
                style={{ animationDelay: '1.5s' }}
              >
                <span className="text-xl" aria-hidden="true">🧠</span>
                <div>
                  <div className="text-xs font-extrabold text-[#25263d]">Học qua trải nghiệm</div>
                  <div className="text-[10px] text-[#25263d]/60">Mỗi lựa chọn, một bài học</div>
                </div>
              </div>

              <div
                className="hidden lg:flex absolute top-[55%] right-[-22%] bg-[#d4eeff] rounded-2xl p-3 shadow-[0_8px_24px_rgba(56,189,248,0.2)] animate-bounce-subtle items-center gap-2 border-2 border-[#4f9be8]/20"
                style={{ animationDelay: '0.75s' }}
              >
                <Coins className="w-5 h-5 text-[#ef9270]" aria-hidden="true" />
                <div>
                  <div className="text-xs font-extrabold text-[#25263d]">Lạm phát</div>
                  <div className="text-[10px] text-[#25263d]/60">6% / năm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
