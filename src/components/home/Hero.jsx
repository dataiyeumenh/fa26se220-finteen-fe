import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Coins, PartyPopper, Star } from 'lucide-react'

export function Hero({ onTryDemo }) {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden gradient-sunny">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[8%] right-[-8%] w-[320px] h-[320px] rounded-full bg-[#ffb3d9] opacity-40 blur-3xl animate-float" />
        <div className="absolute bottom-[15%] left-[-5%] w-[280px] h-[280px] rounded-full bg-[#b8ff3d] opacity-30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[30%] w-[220px] h-[220px] rounded-full bg-[#4dabff] opacity-25 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div className="animate-slide-in">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2d1b4e]/10 rounded-full pl-3 pr-4 py-2 text-sm font-bold text-[#2d1b4e] mb-6 shadow-sm">
              <PartyPopper className="w-4 h-4 text-[#ff6b9d]" />
              <span>Cho Gen Z, bởi Gen Z 🚀</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 text-balance text-[#2d1b4e]">
              Quản <span className="text-gradient-primary">đồng tiền</span>
              <br />
              như một <span className="inline-flex items-baseline"><span className="text-gradient-primary">genius</span></span> ✨
            </h1>

            <p className="text-lg md:text-xl text-[#2d1b4e]/75 leading-relaxed mb-10 max-w-[540px] text-balance">
              Trở thành "thiên tài tài chính" chỉ trong vài tuần — qua những bài học ngắn,
              trò chơi vui và thử thách đoán trước cực cuốn. Không nhàm chán, không lý thuyết khô khan.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="xl" onClick={onTryDemo} className="gradient-primary text-white border-0 shadow-[0_8px_24px_rgba(168,85,247,0.4)] hover:opacity-90">
                Bắt đầu miễn phí 🚀
              </Button>
              <Button size="xl" variant="outline" asChild className="border-2 border-[#2d1b4e] text-[#2d1b4e] hover:bg-[#2d1b4e] hover:text-white">
                <a href="#how-it-works">Xem nó chạy thế nào →</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t-2 border-dashed border-[#2d1b4e]/15">
              {[
                { value: '10K+', label: 'Bạn trẻ đang học', emoji: '👯' },
                { value: '95%', label: 'Thấy "à ha!" ngay', emoji: '💡' },
                { value: '50+', label: 'Bài học không buồn ngủ', emoji: '🎮' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl">{stat.emoji}</span>
                    <span className="font-display text-4xl md:text-5xl font-black text-gradient-primary">
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-sm text-[#2d1b4e]/65 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="relative animate-slide-in [animation-delay:200ms]">
            <div className="relative w-full max-w-[320px] mx-auto">
              <div className="bg-[#2d1b4e] rounded-[40px] p-3 shadow-[0_20px_60px_rgba(168,85,247,0.35)] border-[3px] border-[#2d1b4e]">
                <div className="bg-white rounded-[32px] overflow-hidden aspect-[9/19]">
                  <div className="gradient-primary text-white py-5 px-4 text-center">
                    <h3 className="text-base font-extrabold">💰 Lãi kép thần kỳ</h3>
                    <p className="text-xs opacity-90 mt-1">10 triệu → bao nhiêu?</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-gradient-to-br from-[#fff8f0] to-[#ffe5ec] border-2 border-[#ff6b9d]/30 rounded-2xl p-4">
                      <div className="text-xs text-[#2d1b4e]/65 mb-1.5 font-medium">
                        🤓 Đoán đi: 10 triệu sau 40 năm?
                      </div>
                      <div className="font-display text-3xl font-black text-[#2d1b4e]">? VNĐ</div>
                    </div>
                    <Input type="text" defaultValue="20,000,000" placeholder="Nhập số của bạn..." className="border-2 border-[#2d1b4e]/15 focus-visible:border-[#a855f7]" />
                    <Button onClick={onTryDemo} className="w-full gradient-accent text-[#2d1b4e] font-bold border-0 hover:opacity-90">
                      Xem đáp án <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating stickers */}
              <div className="hidden md:flex absolute top-[12%] right-[-18%] bg-white rounded-2xl p-3 shadow-finteen-md animate-bounce-subtle items-center gap-2 border-2 border-[#ff6b9d]/30">
                <span className="text-xl">😱</span>
                <div>
                  <div className="text-xs font-extrabold text-[#2d1b4e]">Sai số -96%</div>
                  <div className="text-[10px] text-[#2d1b4e]/60">Đáp án: 520 triệu</div>
                </div>
              </div>

              <div
                className="hidden md:flex absolute bottom-[22%] left-[-18%] bg-white rounded-2xl p-3 shadow-finteen-md animate-bounce-subtle items-center gap-2 border-2 border-[#b8ff3d]"
                style={{ animationDelay: '1.5s' }}
              >
                <span className="text-xl">🧠</span>
                <div>
                  <div className="text-xs font-extrabold text-[#2d1b4e]">+15% hiểu bài</div>
                  <div className="text-[10px] text-[#2d1b4e]/60">Sau 1 tuần</div>
                </div>
              </div>

              <div
                className="hidden lg:flex absolute top-[55%] right-[-22%] bg-white rounded-2xl p-3 shadow-finteen-md animate-bounce-subtle items-center gap-2 border-2 border-[#4dabff]/40"
                style={{ animationDelay: '0.75s' }}
              >
                <Coins className="w-5 h-5 text-[#ff8e53]" />
                <div>
                  <div className="text-xs font-extrabold text-[#2d1b4e]">Lạm phát</div>
                  <div className="text-[10px] text-[#2d1b4e]/60">6% / năm 🐛</div>
                </div>
              </div>

              {/* Decorative stickers */}
              <div className="absolute -top-4 -left-4 text-4xl animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>⭐</div>
              <div className="absolute -bottom-2 -right-2 text-3xl animate-bounce-subtle" style={{ animationDelay: '1.8s' }}>💸</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
