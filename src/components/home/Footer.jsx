import { Zap, Gamepad2, BookOpen, Coins, LifeBuoy, Mail, HelpCircle, Bug, Eye, PenTool, Rocket, Newspaper } from 'lucide-react'

const footerLinks = [
  {
    title: 'Sản phẩm',
    links: [
      { label: 'Tính năng', Icon: Zap, color: '#3568bd' },
      { label: 'Trò chơi', Icon: Gamepad2, color: '#ffe43b' },
      { label: 'Bài học', Icon: BookOpen, color: '#4f9be8' },
      { label: 'Giá', Icon: Coins, color: '#ef9270' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', Icon: LifeBuoy, color: '#3568bd' },
      { label: 'Liên hệ', Icon: Mail, color: '#4f9be8' },
      { label: 'Câu hỏi thường gặp', Icon: HelpCircle, color: '#ffe43b' },
      { label: 'Báo lỗi', Icon: Bug, color: '#e57787' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', Icon: Eye, color: '#339b75' },
      { label: 'Blog', Icon: PenTool, color: '#a78bfa' },
      { label: 'Tuyển dụng', Icon: Rocket, color: '#ef9270' },
      { label: 'Báo chí', Icon: Newspaper, color: '#4f9be8' },
    ],
  },
]

const socialIcons = [
  { label: 'Facebook', text: 'f', color: 'hover:bg-[#ffe43b]' },
  { label: 'LinkedIn', text: 'in', color: 'hover:bg-[#4f9be8]' },
  { label: 'Twitter', text: 'X', color: 'hover:bg-[#25263d]' },
  { label: 'YouTube', text: '▶', color: 'hover:bg-[#e57787]' },
]

export function Footer() {
  return (
    <footer className="bg-[#25263d] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#ffe43b] opacity-15 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-[#ffe43b] opacity-10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#339b75] opacity-10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-12 mb-12">
          <div>
            <a href="#" className="flex items-center gap-2.5 text-white font-extrabold text-lg mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ffe43b] flex items-center justify-center text-white font-extrabold text-base shadow-[0_4px_14px_rgba(215,166,35,0.4)]">
                F
              </div>
              <span className="text-[#339b75]">FinTeen</span>
            </a>
            <p className="text-sm text-white/70 leading-relaxed max-w-[300px]">
              Nền tảng học tài chính cho học sinh Việt Nam — qua trò chơi, thử thách và mô phỏng thực tế.
            </p>
          </div>

          {footerLinks.map(group => (
            <div key={group.title}>
              <h4 className="text-base font-extrabold mb-5 text-white">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map(({ label, Icon, color }) => (
                    <li key={label}>
                      <a
                        href="#"
                        className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-2 group"
                      >
                        <Icon
                          className="w-4 h-4 transition-colors"
                          style={{ color: color }}
                          aria-hidden="true"
                        />
                        <span className="group-hover:translate-x-0.5 transition-transform">{label}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-5">
          <p className="text-sm text-white/60">
            © 2026 FinTeen · Đồ án SE
          </p>
          <div className="flex gap-3">
            {socialIcons.map(icon => (
              <a
                key={icon.label}
                href="#"
                aria-label={icon.label}
                className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${icon.color} hover:-translate-y-1 hover:text-white`}
              >
                {icon.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
