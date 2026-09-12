import { AlertTriangle, TrendingDown, CreditCard, PiggyBank, Wallet, Receipt } from 'lucide-react'

const problems = [
  {
    number: '01',
    icon: TrendingDown,
    title: 'Nghĩ tiết kiệm = "bỏ heo"',
    description:
      'Bạn tiết kiệm 1 triệu/tháng trong 20 năm? Bạn sẽ có gần 500 triệu nhờ lãi kép — gấp 2.5 lần số bạn nghĩ.',
    accent: '#22c55e',
    bgAccent: 'bg-[#22c55e]/10',
  },
  {
    number: '02',
    icon: CreditCard,
    title: 'Không biết "0% lãi" = bao nhiêu?',
    description:
      'Mua điện thoại 20 triệu trả góp 12 tháng "0%". Thực tế bạn trả 22-25 triệu — phí ẩn nằm ở đâu?',
    accent: '#fb923c',
    bgAccent: 'bg-[#fb923c]/10',
  },
  {
    number: '03',
    icon: Wallet,
    title: 'Lương về là "bay" trong tuần',
    description:
      'Vấn đề không phải kiếm ít, mà là KHÔNG có kế hoạch. Một ngân sách đơn giản sẽ thay đổi tất cả.',
    accent: '#fbbf24',
    bgAccent: 'bg-[#fbbf24]/15',
  },
  {
    number: '04',
    icon: PiggyBank,
    title: 'Gửi tiết kiệm nhưng lạm phát "ăn" hết',
    description:
      'Lãi suất 6%/năm nhưng lạm phát 7%. Bạn nghĩ mình có lời, nhưng thực tế tiền đang MẤT GIÁ trị.',
    accent: '#38bdf8',
    bgAccent: 'bg-[#38bdf8]/10',
  },
  {
    number: '05',
    icon: Receipt,
    title: 'Mua trước, trả sau — không đọc hợp đồng',
    description:
      'Trả góp xe, mua nhà, vay tiêu dùng — mỗi quyết định đều có "chi phí ẩn" mà bạn không thấy.',
    accent: '#a78bfa',
    bgAccent: 'bg-[#a78bfa]/10',
  },
  {
    number: '06',
    icon: TrendingDown,
    title: '"Tương lai để tính sau"',
    description:
      'Ở tuổi 18, mỗi năm chờ đợi = mất 100 triệu khi về hưu. Bắt đầu sớm = đỡ cực gấp 10 lần.',
    accent: '#f87171',
    bgAccent: 'bg-[#f87171]/10',
  },
]

export function Problems() {
  return (
    <section className="py-24 md:py-28 bg-white">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#fb923c]/10 rounded-full px-5 py-2 text-sm font-semibold text-[#ea580c] mb-4">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            Vấn đề thực tế
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a3a1a] tracking-tight mb-4 text-balance">
            Bạn có đang mắc những lỗi này?
          </h2>
          <p className="text-lg text-slate-500 max-w-[600px] mx-auto text-balance">
            Nghiên cứu cho thấy học sinh THPT thường mắc những sai lầm tài chính mà không ai nhận ra
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => {
            const IconComponent = p.icon
            return (
              <div
                key={p.number}
                className="group relative bg-[#faf8f5] rounded-3xl p-8 overflow-hidden transition-all duration-300 border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(34,197,94,0.15)] hover:border-[#22c55e] animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Top color stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: p.accent }}
                  aria-hidden="true"
                />

                <span className="absolute top-6 right-6 font-mono text-7xl font-bold text-[#1a3a1a]/[0.05] leading-none">
                  {p.number}
                </span>
                <div
                  className={`w-[60px] h-[60px] rounded-2xl ${p.bgAccent} flex items-center justify-center mb-5`}
                >
                  <IconComponent className="w-7 h-7" style={{ color: p.accent }} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#1a3a1a] mb-3 leading-tight">{p.title}</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed">{p.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
