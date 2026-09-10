import { Sparkles } from 'lucide-react'

const features = [
  {
    icon: '📊',
    title: 'Máy mô phỏng',
    description:
      'Lãi kép, lạm phát, trả góp, nợ xoay vòng — nghịch tới bến để hiểu cách tiền thật sự chạy',
    tag: 'Tương tác 100%',
    bg: 'from-[#b8ff3d]/25 to-[#4dabff]/15',
    color: '#9eea1f',
    border: '#b8ff3d',
  },
  {
    icon: '🎯',
    title: 'Đoán trước khi học',
    description:
      'Cam kết con số trước khi xem đáp án. Khoảng chênh giữa "đoán" và "thật" chính là bài học',
    tag: 'Phương pháp độc quyền',
    bg: 'from-[#ff6b9d]/25 to-[#ff8e53]/15',
    color: '#ff6b9d',
    border: '#ff6b9d',
  },
  {
    icon: '🤖',
    title: 'Trợ lý AI thông minh',
    description:
      'Hỏi bất kỳ câu gì, AI giải thích bằng chính con số và ngôn ngữ của bạn',
    tag: 'Chat tiếng Việt',
    bg: 'from-[#c084fc]/25 to-[#ec4899]/15',
    color: '#a855f7',
    border: '#a855f7',
  },
  {
    icon: '📱',
    title: 'Học mọi nơi',
    description:
      'Hỗ trợ offline, dùng được trên điện thoại, tablet, laptop — không sợ mất mạng',
    tag: 'Có offline',
    bg: 'from-[#4dabff]/25 to-[#ffd93d]/15',
    color: '#4dabff',
    border: '#4dabff',
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-28 bg-[#fff8f0] overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-[#ffb3d9]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 rounded-full bg-[#b8ff3d]/30 blur-3xl pointer-events-none" />
      <span className="absolute top-32 left-12 text-3xl animate-bounce-subtle pointer-events-none">💸</span>
      <span className="absolute bottom-24 right-16 text-4xl animate-bounce-subtle pointer-events-none" style={{ animationDelay: '1s' }}>💡</span>

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2d1b4e]/10 rounded-full px-5 py-2 text-sm font-bold text-[#a855f7] mb-4 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Tính năng
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#2d1b4e]">
            Học cách <span className="text-gradient-primary">tiền bạc hoạt động</span>
          </h2>
          <p className="text-lg text-[#2d1b4e]/65 max-w-[600px] mx-auto text-balance">
            Không đọc lý thuyết. Không làm bài tập khô khan. <span className="font-bold text-[#2d1b4e]">Trực tiếp nghịch các con số</span> 🤓
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group bg-white rounded-3xl p-7 text-center transition-all duration-300 border-2 border-[#2d1b4e]/8 hover:-translate-y-2 hover:shadow-finteen-md animate-fade-up"
              style={{ animationDelay: `${i * 100}ms`, borderColor: f.border }}
            >
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${f.bg} flex items-center justify-center text-4xl mx-auto mb-5 transition-transform group-hover:scale-110 group-hover:rotate-3`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-extrabold text-[#2d1b4e] mb-2.5">{f.title}</h3>
              <p className="text-sm text-[#2d1b4e]/65 leading-relaxed mb-4">{f.description}</p>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{ color: f.color, backgroundColor: `${f.color}1a` }}
              >
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
