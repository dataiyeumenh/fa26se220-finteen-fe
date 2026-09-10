import { Star, MessageCircle } from 'lucide-react'

const testimonials = [
  {
    name: 'Trần Minh Tuấn',
    role: 'Lớp 11 · THPT Nguyễn Du',
    avatar: 'T',
    quote:
      'Em tưởng tiết kiệm 1tr/tháng × 20 năm ≈ 200tr. Sau khi học FinTeen, em biết con số thật là hơn 500tr 🤯. Sốc luôn!',
    gradient: 'gradient-primary',
  },
  {
    name: 'Lê Hoàng Yến',
    role: 'Lớp 10 · THPT Lê Quý Đôn',
    avatar: 'L',
    quote:
      'Em mê nhất phần "đoán trước" 🤓. Nhìn kết quả em sai be bét nhưng hiểu NGAY tại sao. Không có cách nào quên được!',
    gradient: 'gradient-accent',
  },
  {
    name: 'Nguyễn Phương Linh',
    role: 'Lớp 12 · THPT Chuyên Lê Hồng Phong',
    avatar: 'N',
    quote:
      'Game "Mua điện thoại trả góp" khiến em sợ luôn 😅. Giờ em biết "0% lãi" thường là cú lừa. Cảm ơn FinTeen nhiều lắm!',
    gradient: 'gradient-coral',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 md:py-28 bg-[#fff8f0] overflow-hidden">
      <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-[#ffd93d]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-[#ffb3d9]/30 blur-3xl pointer-events-none" />
      <span className="absolute top-28 right-12 text-4xl animate-bounce-subtle">💬</span>
      <span className="absolute bottom-24 left-16 text-3xl animate-bounce-subtle" style={{ animationDelay: '1s' }}>💖</span>

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2d1b4e]/10 rounded-full px-5 py-2 text-sm font-bold text-[#9eea1f] mb-4 shadow-sm">
            <MessageCircle className="w-4 h-4" />
            Học sinh nói gì
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#2d1b4e]">
            Hàng nghìn bạn trẻ đã <span className="text-gradient-primary">"à ha!"</span>
          </h2>
          <p className="text-lg text-[#2d1b4e]/65 max-w-[600px] mx-auto text-balance">
            Không phải mình nói — <span className="font-bold text-[#2d1b4e]">chính các bạn ấy kể cho bạn nghe</span> 👇
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group bg-white rounded-3xl p-8 transition-all duration-300 border-2 border-[#2d1b4e]/8 hover:-translate-y-1 hover:shadow-finteen-md hover:border-[#ff6b9d] animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-[#fbbf24] text-lg mb-4 tracking-wider">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 inline-block fill-current" />
                ))}
              </div>
              <p className="text-base text-[#2d1b4e] leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-full ${t.gradient} flex items-center justify-center text-white font-extrabold text-lg shadow-sm`}
                >
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#2d1b4e]">{t.name}</h4>
                  <p className="text-sm text-[#2d1b4e]/60">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
