import { BarChart3, Target, Bot, Smartphone } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Máy mô phỏng',
    description:
      'Lãi kép, lạm phát, trả góp, nợ xoay vòng — nghịch tới bến để hiểu cách tiền thật sự chạy',
    tag: 'Tương tác 100%',
    bg: 'bg-[#cdbfff]',
    surface: '#f0eaff',
    color: '#6343b4',
    border: '#b5a0eb',
    emoji: '🎮',
  },
  {
    icon: Target,
    title: 'Đoán trước khi học',
    description:
      'Cam kết con số trước khi xem đáp án. Khoảng chênh giữa "đoán" và "thật" chính là bài học',
    tag: 'Phương pháp độc quyền',
    bg: 'bg-[#ffc5a6]',
    surface: '#fff0e7',
    color: '#a74b24',
    border: '#edb399',
    emoji: '🎯',
  },
  {
    icon: Bot,
    title: 'Trợ lý AI thông minh',
    description:
      'Hỏi bất kỳ câu gì, AI giải thích bằng chính con số và ngôn ngữ của bạn',
    tag: 'Chat tiếng Việt',
    bg: 'bg-[#afdbff]',
    surface: '#eaf5ff',
    color: '#286cac',
    border: '#4f9be8',
    emoji: '🤖',
  },
  {
    icon: Smartphone,
    title: 'Học mọi nơi',
    description:
      'Hỗ trợ offline, dùng được trên điện thoại, tablet, laptop — không sợ mất mạng',
    tag: 'Có offline',
    bg: 'bg-[#a6e9cc]',
    surface: '#e9f8f1',
    color: '#247957',
    border: '#339b75',
    emoji: '📱',
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-28 bg-white overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-[#ffe43b]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 left-0 w-64 h-64 rounded-full bg-[#ffe43b]/15 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-[#4f9be8]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#ffe43b]/20 rounded-full px-5 py-2 text-sm font-bold text-[#51428b] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#ffe43b]" aria-hidden="true" />
            Tính năng
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#25263d]">
            Học cách <span className="text-[#3568bd]">tiền bạc hoạt động</span>
          </h2>
          <p className="text-lg text-[#25263d]/65 max-w-[600px] mx-auto text-balance">
            Không đọc lý thuyết. Không làm bài tập khô khan. <span className="font-bold text-[#25263d]">Trực tiếp nghịch các con số</span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const IconComponent = f.icon
            return (
              <div
                key={f.title}
                className="group bg-white rounded-3xl p-7 text-center transition-all duration-300 border-2 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(215,166,35,0.15)] animate-fade-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  borderColor: `${f.border}30`,
                  backgroundColor: f.surface,
                }}
              >
                <div
                  className={`w-20 h-20 rounded-2xl ${f.bg} flex items-center justify-center mb-5 mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3 relative`}
                >
                  <IconComponent className="w-9 h-9 relative z-10" style={{ color: f.color }} aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 text-lg" aria-hidden="true">{f.emoji}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#25263d] mb-2.5">{f.title}</h3>
                <p className="text-sm text-[#25263d]/65 leading-relaxed mb-4">{f.description}</p>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                  style={{ color: f.color, backgroundColor: `${f.color}15` }}
                >
                  {f.tag}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
