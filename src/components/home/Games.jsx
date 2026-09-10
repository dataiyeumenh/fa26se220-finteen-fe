import { Gamepad2 } from 'lucide-react'

const games = [
  {
    emoji: '💼',
    imageStyle: 'from-[#fff8f0] to-[#ffd93d]',
    accent: '#fbbf24',
    badge: '🔥 Phổ biến nhất',
    title: 'Lương tháng đầu tiên',
    description:
      'Vừa đi làm, lương về 💵. Mua iPhone mới hay bắt đầu xây nền tảng tiết kiệm?',
    tags: ['Tiết kiệm', 'Chi tiêu', 'Ngân sách'],
  },
  {
    emoji: '🧧',
    imageStyle: 'from-[#ffe5ec] to-[#ffb3d9]',
    accent: '#ff6b9d',
    badge: 'Tết vibes 🌸',
    title: 'Tiền lì xì',
    description:
      'Ông bà cho 5 triệu lì xì. Mua gì? Đầu tư? Hay "để đó tính sau"?',
    tags: ['Lãi kép', 'Đầu tư', 'Kiên nhẫn'],
  },
  {
    emoji: '📱',
    imageStyle: 'from-[#dbeafe] to-[#bfdbfe]',
    accent: '#4dabff',
    badge: '⚠️ Cảnh báo',
    title: 'Mua điện thoại trả góp',
    description:
      '"0% lãi suất" nghe quá ngon 🍰 — nhưng sự thật là gì? Bạn sẽ trả bao nhiêu?',
    tags: ['Lãi suất', 'Trả góp', 'Tín dụng'],
  },
]

export function Games() {
  return (
    <section id="games" className="relative py-24 md:py-28 bg-white overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#a855f7]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-[#4dabff]/15 blur-3xl pointer-events-none" />
      <span className="absolute top-32 right-20 text-3xl animate-bounce-subtle pointer-events-none">🎯</span>
      <span className="absolute bottom-32 left-16 text-4xl animate-bounce-subtle pointer-events-none" style={{ animationDelay: '1.2s' }}>🪙</span>

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-[#2d1b4e]/10 rounded-full px-5 py-2 text-sm font-bold text-[#ff6b9d] mb-4 shadow-sm">
            <Gamepad2 className="w-4 h-4" />
            Trò chơi
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance text-[#2d1b4e]">
            Học qua <span className="text-gradient-primary">tình huống đời thật</span>
          </h2>
          <p className="text-lg text-[#2d1b4e]/65 max-w-[600px] mx-auto text-balance">
            Không có đề thi, chỉ có <span className="font-bold text-[#2d1b4e]">những quyết định bạn phải đưa ra mỗi ngày</span> ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((g, i) => (
            <div
              key={g.title}
              className="group bg-[#fff8f0] rounded-3xl overflow-hidden transition-all duration-300 border-2 border-[#2d1b4e]/8 hover:-translate-y-2 hover:shadow-finteen-lg hover:border-[#b8ff3d] animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={`relative h-44 bg-gradient-to-br ${g.imageStyle} flex items-center justify-center text-7xl`}
              >
                {g.emoji}
                {g.badge && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-white rounded-full text-xs font-extrabold text-[#2d1b4e] shadow-sm">
                    {g.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-[#2d1b4e] mb-2">{g.title}</h3>
                <p className="text-sm text-[#2d1b4e]/65 leading-relaxed mb-4">{g.description}</p>
                <div className="flex flex-wrap gap-2">
                  {g.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white rounded-full text-xs font-bold text-[#2d1b4e]/70 border-2 border-[#2d1b4e]/8"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
