import { Gamepad2, Wallet, Gift, Smartphone } from 'lucide-react'

const games = [
  {
    icon: Wallet,
    accent: '#22c55e',
    bgIcon: 'bg-[#22c55e]/10',
    badge: 'Phổ biến nhất',
    badgeColor: '#16a34a',
    badgeBg: 'bg-[#22c55e]/15',
    title: 'Lương tháng đầu tiên',
    description:
      'Vừa đi làm, lương về. Mua iPhone mới hay bắt đầu xây nền tảng tiết kiệm?',
    tags: ['Tiết kiệm', 'Chi tiêu', 'Ngân sách'],
    emoji: '💼',
    border: '#22c55e',
  },
  {
    icon: Gift,
    accent: '#fbbf24',
    bgIcon: 'bg-[#fbbf24]/15',
    badge: 'Tết vibes',
    badgeColor: '#b45309',
    badgeBg: 'bg-[#fbbf24]/20',
    title: 'Tiền lì xì',
    description:
      'Ông bà cho 5 triệu lì xì. Mua gì? Đầu tư? Hay "để đó tính sau"?',
    tags: ['Lãi kép', 'Đầu tư', 'Kiên nhẫn'],
    emoji: '🧧',
    border: '#fbbf24',
  },
  {
    icon: Smartphone,
    accent: '#38bdf8',
    bgIcon: 'bg-[#38bdf8]/15',
    badge: 'Cảnh báo',
    badgeColor: '#0369a1',
    badgeBg: 'bg-[#38bdf8]/20',
    title: 'Mua điện thoại trả góp',
    description:
      '"0% lãi suất" nghe quá ngon — nhưng sự thật là gì? Bạn sẽ trả bao nhiêu?',
    tags: ['Lãi suất', 'Trả góp', 'Tín dụng'],
    emoji: '📱',
    border: '#38bdf8',
  },
]

export function Games() {
  return (
    <section id="games" className="relative py-24 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#22c55e]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-[#fbbf24]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 right-1/3 w-56 h-56 rounded-full bg-[#38bdf8]/8 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#22c55e]/20 rounded-full px-5 py-2 text-sm font-bold text-[#16a34a] mb-4 shadow-sm">
            <Gamepad2 className="w-4 h-4 text-[#fbbf24]" aria-hidden="true" />
            Trò chơi
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#1a3a1a]">
            Học qua <span className="text-[#22c55e]">tình huống đời thật</span>
          </h2>
          <p className="text-lg text-[#1a3a1a]/65 max-w-[600px] mx-auto text-balance">
            Không có đề thi, chỉ có <span className="font-bold text-[#1a3a1a]">những quyết định bạn phải đưa ra mỗi ngày</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((g, i) => {
            const IconComponent = g.icon
            return (
              <div
                key={g.title}
                className="group bg-[#faf8f5] rounded-3xl overflow-hidden transition-all duration-300 border-2 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(34,197,94,0.15)] animate-fade-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  borderColor: `${g.border}30`,
                }}
              >
                <div
                  className="relative h-44 flex items-center justify-center"
                  style={{ backgroundColor: `${g.accent}15` }}
                >
                  <div className={`w-20 h-20 rounded-3xl ${g.bgIcon} flex items-center justify-center`}>
                    <IconComponent className="w-10 h-10" style={{ color: g.accent }} aria-hidden="true" />
                  </div>
                  <span className="absolute top-4 left-4 text-3xl" aria-hidden="true">{g.emoji}</span>
                  {g.badge && (
                    <span
                      className={`absolute top-4 right-4 px-3 py-1 ${g.badgeBg} rounded-full text-xs font-extrabold shadow-sm`}
                      style={{ color: g.badgeColor }}
                    >
                      {g.badge}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-[#1a3a1a] mb-2">{g.title}</h3>
                  <p className="text-sm text-[#1a3a1a]/65 leading-relaxed mb-4">{g.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white rounded-full text-xs font-bold text-[#1a3a1a]/70 border-2"
                        style={{ borderColor: `${g.border}25` }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
