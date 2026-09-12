import { Star, MessageCircle, Quote, ThumbsUp } from 'lucide-react'

const testimonials = [
  {
    name: 'Trần Minh Tuấn',
    role: 'Lớp 11 · THPT Nguyễn Du',
    avatar: 'T',
    quote:
      'Em tưởng tiết kiệm 1tr/tháng × 20 năm ≈ 200tr. Sau khi học FinTeen, em biết con số thật là hơn 500tr. Sốc luôn!',
    accent: '#22c55e',
    bgAccent: 'bg-[#22c55e]',
    bgSoft: 'bg-[#22c55e]/10',
  },
  {
    name: 'Lê Hoàng Yến',
    role: 'Lớp 10 · THPT Lê Quý Đôn',
    avatar: 'L',
    quote:
      'Em mê nhất phần "đoán trước". Nhìn kết quả em sai be bét nhưng hiểu NGAY tại sao. Không có cách nào quên được!',
    accent: '#fbbf24',
    bgAccent: 'bg-[#fbbf24]',
    bgSoft: 'bg-[#fbbf24]/15',
  },
  {
    name: 'Nguyễn Phương Linh',
    role: 'Lớp 12 · THPT Chuyên Lê Hồng Phong',
    avatar: 'N',
    quote:
      'Game "Mua điện thoại trả góp" khiến em sợ luôn. Giờ em biết "0% lãi" thường là cú lừa. Cảm ơn FinTeen nhiều lắm!',
    accent: '#38bdf8',
    bgAccent: 'bg-[#38bdf8]',
    bgSoft: 'bg-[#38bdf8]/10',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 md:py-28 bg-[#faf8f5] overflow-hidden">
      <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-[#22c55e]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-[#fbbf24]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-10 w-56 h-56 rounded-full bg-[#38bdf8]/8 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#22c55e]/20 rounded-full px-5 py-2 text-sm font-bold text-[#16a34a] mb-4 shadow-sm">
            <MessageCircle className="w-4 h-4 text-[#fbbf24]" aria-hidden="true" />
            Học sinh nói gì
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#1a3a1a]">
            Hàng nghìn bạn trẻ đã <span className="text-[#22c55e]">"à ha!"</span>
          </h2>
          <p className="text-lg text-[#1a3a1a]/65 max-w-[600px] mx-auto text-balance">
            Không phải mình nói — <span className="font-bold text-[#1a3a1a]">chính các bạn ấy kể cho bạn nghe</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group bg-white rounded-3xl p-8 transition-all duration-300 border-2 border-[#22c55e]/10 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(34,197,94,0.15)] hover:border-[#22c55e] animate-fade-up relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Top color bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${t.bgAccent}`} aria-hidden="true" />

              <Quote className="w-8 h-8 mb-4" style={{ color: `${t.accent}50` }} aria-hidden="true" />
              <div className="text-[#fbbf24] text-lg mb-4 flex gap-0.5">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="text-base text-[#1a3a1a] leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-full ${t.bgAccent} flex items-center justify-center text-white font-extrabold text-lg shadow-sm`}
                >
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-extrabold text-[#1a3a1a]">{t.name}</h4>
                  <p className="text-sm text-[#1a3a1a]/60">{t.role}</p>
                </div>
                <ThumbsUp
                  className="w-5 h-5"
                  style={{ color: t.accent }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
