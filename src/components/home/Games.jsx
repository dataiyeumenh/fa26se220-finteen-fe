import { Gamepad2, Wallet, Gift, Smartphone } from 'lucide-react'

const games = [
  {
    icon: Wallet,
    accent: '#247957',
    surface: '#caf1df',
    bgIcon: 'bg-white/60',
    badge: 'Phổ biến nhất',
    badgeColor: '#247957',
    badgeBg: 'bg-white',
    title: 'Lương tháng đầu tiên',
    description:
      'Vừa đi làm, lương về. Mua iPhone mới hay bắt đầu xây nền tảng tiết kiệm?',
    tags: ['Tiết kiệm', 'Chi tiêu', 'Ngân sách'],
    emoji: '💼',
    border: '#8ccfb1',
  },
  {
    icon: Gift,
    accent: '#ad4925',
    surface: '#ffdbca',
    bgIcon: 'bg-white/60',
    badge: 'Tết vibes',
    badgeColor: '#b45309',
    badgeBg: 'bg-white',
    title: 'Tiền lì xì',
    description:
      'Ông bà cho 5 triệu lì xì. Mua gì? Đầu tư? Hay "để đó tính sau"?',
    tags: ['Lãi kép', 'Đầu tư', 'Kiên nhẫn'],
    emoji: '🧧',
    border: '#efb092',
  },
  {
    icon: Smartphone,
    accent: '#286cac',
    surface: '#cde9ff',
    bgIcon: 'bg-white/60',
    badge: 'Cảnh báo',
    badgeColor: '#0369a1',
    badgeBg: 'bg-white',
    title: 'Mua điện thoại trả góp',
    description:
      '"0% lãi suất" nghe quá ngon — nhưng sự thật là gì? Bạn sẽ trả bao nhiêu?',
    tags: ['Lãi suất', 'Trả góp', 'Tín dụng'],
    emoji: '📱',
    border: '#4f9be8',
  },
]

export function Games() {
  return (
    <section id="games" className="relative py-24 md:py-28 bg-[#effbf5] overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#ffe43b]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-[#ffe43b]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 right-1/3 w-56 h-56 rounded-full bg-[#4f9be8]/8 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#ffe43b]/20 rounded-full px-5 py-2 text-sm font-bold text-[#51428b] mb-4 shadow-sm">
            <Gamepad2 className="w-4 h-4 text-[#ffe43b]" aria-hidden="true" />
            Trò chơi
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#25263d]">
            Học qua <span className="text-[#3568bd]">tình huống đời thật</span>
          </h2>
          <p className="text-lg text-[#25263d]/65 max-w-[600px] mx-auto text-balance">
            Không có đề thi, chỉ có <span className="font-bold text-[#25263d]">những quyết định bạn phải đưa ra mỗi ngày</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((g, i) => {
            const IconComponent = g.icon
            return (
              <div
                key={g.title}
                className="group bg-[#fcfcff] rounded-3xl overflow-hidden transition-all duration-300 border-2 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(215,166,35,0.15)] animate-fade-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  borderColor: `${g.border}30`,
                }}
              >
                <div
                  className="relative h-44 flex items-center justify-center"
                  style={{ backgroundColor: g.surface }}
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
                  <h3 className="text-xl font-extrabold text-[#25263d] mb-2">{g.title}</h3>
                  <p className="text-sm text-[#25263d]/65 leading-relaxed mb-4">{g.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white rounded-full text-xs font-bold text-[#25263d]/70 border-2"
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
