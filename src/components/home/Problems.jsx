import { AlertTriangle } from 'lucide-react'

const problems = [
  {
    number: '01',
    icon: '🧮',
    color: 'coral',
    title: 'Biết công thức nhưng ước lượng sai',
    description:
      'Học sinh đọc thuộc lòng công thức lãi kép, nhưng khi được hỏi ước lượng 10 triệu sau 40 năm, nhiều em trả lời chỉ vài chục triệu thay vì hàng trăm triệu.',
  },
  {
    number: '02',
    icon: '💸',
    color: 'purple',
    title: 'Nhầm lẫn tiền danh nghĩa và thực',
    description:
      'Tưởng tăng lương 5% là tốt, nhưng không biết lạm phát 6% nghĩa là lương thực tế đã giảm. Đây là "ảo giác tiền tệ" - rất phổ biến ở người trẻ.',
  },
  {
    number: '03',
    icon: '🎮',
    color: 'accent',
    title: 'Học trên sách nhưng không thực hành',
    description:
      'Không ai hỏi học sinh "em nghĩ gì" trước khi dạy. Không có khoảng chênh giữa dự đoán và thực tế, không có động lực để thay đổi quan niệm sai.',
  },
]

const colorMap = {
  coral: 'from-[#ff6b6b] to-[#ee5a24]',
  purple: 'from-[#a855f7] to-[#7c3aed]',
  accent: 'from-[#00d4aa] to-[#00b894]',
}

const bgMap = {
  coral: 'bg-[#ff6b6b]/15',
  purple: 'bg-[#a855f7]/15',
  accent: 'bg-[#00d4aa]/15',
}

export function Problems() {
  return (
    <section className="py-24 md:py-28 bg-white">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff6b6b]/10 to-[#a855f7]/10 rounded-full px-5 py-2 text-sm font-semibold text-[#ff6b6b] mb-4">
            <AlertTriangle className="w-4 h-4" />
            Vấn đề thực tế
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] tracking-tight mb-4 text-balance">
            Bạn có đang mắc những lỗi này?
          </h2>
          <p className="text-lg text-slate-500 max-w-[600px] mx-auto text-balance">
            Nghiên cứu cho thấy học sinh THPT thường mắc những sai lầm tài chính mà không ai nhận ra
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div
              key={p.number}
              className="group relative bg-slate-50 rounded-3xl p-8 overflow-hidden transition-all duration-300 border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(26,26,46,0.15)] hover:border-[#00d4aa] animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[p.color]}`} />
              <span className="absolute top-6 right-6 font-mono text-7xl font-bold text-[#1a1a2e]/[0.06] leading-none">
                {p.number}
              </span>
              <div className={`relative w-15 h-15 rounded-2xl ${bgMap[p.color]} flex items-center justify-center text-3xl mb-5 w-[60px] h-[60px]`}>
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3 leading-tight">{p.title}</h3>
              <p className="text-[15px] text-slate-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
