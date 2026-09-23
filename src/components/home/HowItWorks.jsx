import { Repeat, FileText, Eye, Lightbulb } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Đoán trước',
    description:
      'Trước mỗi bài, hệ thống hỏi bạn ước lượng một con số. Không đáp án, không gợi ý — chỉ có trực giác của bạn.',
    accent: '#806000',
    bg: 'bg-[#ffe43b]',
    emoji: '🎲',
  },
  {
    number: 2,
    icon: Eye,
    title: 'Quan sát',
    description:
      'Máy mô phỏng đặt con số thật cạnh con số bạn đoán. Khoảng cách giữa "đoán" và "thật" chính là bài học.',
    accent: '#286cac',
    bg: 'bg-[#4f9be8]',
    emoji: '👀',
  },
  {
    number: 3,
    icon: Lightbulb,
    title: 'Hiểu thật',
    description:
      'Giờ bạn học bài giảng với động lực khác hẳn — vì bạn biết mình sai ở đâu, và MUỐN hiểu tại sao.',
    accent: '#a65030',
    bg: 'bg-[#ef9270]',
    emoji: '💡',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-28 bg-[#eae2ff] text-[#352258] overflow-hidden"
    >
      {/* Solid color accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#ffe43b] opacity-[0.08] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#ffe43b] opacity-[0.06] blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#d5c7ee] rounded-full px-5 py-2 text-sm font-bold text-[#6944a3] mb-4">
            <Repeat className="w-4 h-4 text-[#6944a3]" aria-hidden="true" />
            Cách hoạt động
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#352258]">
            Chỉ <span className="text-[#6944a3]">3 bước</span> để hiểu tài chính
          </h2>
          <p className="text-lg text-[#65557b] max-w-[600px] mx-auto text-balance">
            Đoán → Quan sát → Hiểu: khám phá bài học từ chính lựa chọn của bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => {
            const IconComponent = step.icon
            return (
              <div
                key={step.number}
                className="relative text-center animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Connector dot between steps */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-[35px] left-[calc(50%+50px)] right-[calc(-50%+50px)] h-[3px] -z-10"
                    style={{ backgroundColor: '#cbb9e7' }}
                    aria-hidden="true"
                  />
                )}

                <div className="relative inline-block">
                  <div
                    className={`w-[70px] h-[70px] rounded-full ${step.bg} flex items-center justify-center font-display text-3xl font-black text-[#25263d] mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.25)]`}
                  >
                    {step.number}
                  </div>
                  <span
                    className="absolute -top-2 -right-2 text-2xl bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md"
                    aria-hidden="true"
                  >
                    {step.emoji}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold mb-3 mt-5 flex items-center justify-center gap-2">
                  <IconComponent className="w-6 h-6" style={{ color: step.accent }} aria-hidden="true" />
                  {step.title}
                </h3>
                <p className="text-[15px] text-[#65557b] leading-relaxed max-w-[300px] mx-auto">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
