const footerLinks = [
  {
    title: 'Sản phẩm',
    links: [
      { label: 'Tính năng', emoji: '⚡' },
      { label: 'Trò chơi', emoji: '🎮' },
      { label: 'Bài học', emoji: '📚' },
      { label: 'Giá', emoji: '💰' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', emoji: '🆘' },
      { label: 'Liên hệ', emoji: '💬' },
      { label: 'Câu hỏi thường gặp', emoji: '❓' },
      { label: 'Báo lỗi', emoji: '🐞' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', emoji: '👀' },
      { label: 'Blog', emoji: '✍️' },
      { label: 'Tuyển dụng', emoji: '🚀' },
      { label: 'Báo chí', emoji: '📰' },
    ],
  },
]

const socialIcons = [
  { label: 'Facebook', text: 'f', color: 'hover:bg-[#4dabff]' },
  { label: 'LinkedIn', text: 'in', color: 'hover:bg-[#4dabff]' },
  { label: 'Twitter', text: '𝕏', color: 'hover:bg-[#a855f7]' },
  { label: 'YouTube', text: '▶', color: 'hover:bg-[#ff6b9d]' },
]

export function Footer() {
  return (
    <footer className="bg-[#2d1b4e] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#a855f7] opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#ff6b9d] opacity-15 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-[1200px] px-6 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-12 mb-12">
          <div>
            <a href="#" className="flex items-center gap-2.5 text-white font-extrabold text-lg mb-4">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-[#2d1b4e] font-extrabold text-base shadow-[0_4px_14px_rgba(184,255,61,0.5)]">
                F
              </div>
              <span className="text-gradient-accent">FinTeen</span>
            </a>
            <p className="text-sm text-white/70 leading-relaxed max-w-[300px]">
              Nền tảng học tài chính dành cho Gen Z Việt — qua trò chơi, thử thách và mô phỏng.
              Học để <span className="text-[#b8ff3d] font-bold">"à ha"</span>, không phải để đi thi 😉.
            </p>
          </div>

          {footerLinks.map(group => (
            <div key={group.title}>
              <h4 className="text-base font-extrabold mb-5 text-white">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map(link => (
                  <li key={link.label}>
                    <a
                      href="#"
                      className="text-sm text-white/70 hover:text-[#b8ff3d] transition-colors inline-flex items-center gap-2"
                    >
                      <span>{link.emoji}</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-5">
          <p className="text-sm text-white/60">
            © 2026 FinTeen · Đồ án SE. Made with 💜 by Gen Z
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
