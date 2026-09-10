import { Repeat } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: '📝',
    title: 'Đoán trước',
    emoji: '🤔',
    description:
      'Trước mỗi bài, hệ thống hỏi bạn ước lượng một con số. Không đáp án, không gợi ý — chỉ có trực giác của bạn.',
  },
  {
    number: 2,
    icon: '👀',
    title: 'Quan sát',
    emoji: '😮',
    description:
      'Máy mô phỏng đặt con số thật cạnh con số bạn đoán. Khoảng cách giữa "đoán" và "thật" chính là bài học.',
  },
  {
    number: 3,
    icon: '💡',
    title: 'Hiểu thật',
    emoji: '🧠',
    description:
      'Giờ bạn học bài giảng với động lực khác hẳn — vì bạn biết mình sai ở đâu, và MUỐN hiểu tại sao.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-28 gradient-primary text-white overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 10% 90%, rgba(184, 255, 61, 0.25) 0%, transparent 45%), radial-gradient(circle at 90% 10%, rgba(77, 171, 255, 0.25) 0%, transparent 45%)',
          }}
        />
      </div>

      {/* Floating stickers */}
      <span className="absolute top-20 left-12 text-4xl animate-bounce-subtle">⭐</span>
      <span className="absolute top-32 right-20 text-3xl animate-bounce-subtle" style={{ animationDelay: '1.5s' }}>✨</span>
      <span className="absolute bottom-24 left-1/4 text-4xl animate-bounce-subtle" style={{ animationDelay: '0.8s' }}>🎉</span>

      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full px-5 py-2 text-sm font-bold text-white mb-4">
            <Repeat className="w-4 h-4" />
            Cách hoạt động
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-white">
            Chỉ <span className="text-[#2d1b4e]">3 bước</span> để hiểu tài chính 🚀
          </h2>
          <p className="text-lg text-white/90 max-w-[600px] mx-auto text-balance">
            Phương pháp "Đoán → Quan sát → Hiểu" — chứng minh hiệu quả và độc đáo ✨
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-[35px] left-[calc(16.67%+35px)] right-[calc(16.67%+35px)] h-[3px] -z-10"
            style={{
              background: 'linear-gradient(90deg, #b8ff3d 0%, #fff 50%, #ff6b9d 100%)',
              opacity: 0.5,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative text-center animate-fade-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="relative inline-block">
                <div className="w-[70px] h-[70px] rounded-full gradient-accent flex items-center justify-center font-display text-3xl font-black text-[#2d1b4e] mx-auto shadow-[0_8px_30px_rgba(184,255,61,0.5)]">
                  {step.number}
                </div>
                <span className="absolute -top-2 -right-2 text-2xl">{step.emoji}</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-3 flex items-center justify-center gap-2 mt-5">
                <span className="text-3xl">{step.icon}</span>
                {step.title}
              </h3>
              <p className="text-[15px] text-white/90 leading-relaxed max-w-[300px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
