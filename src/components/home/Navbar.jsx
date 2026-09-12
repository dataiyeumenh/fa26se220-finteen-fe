import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Tính năng', href: '#features' },
  { label: 'Trò chơi', href: '#games' },
  { label: 'Cách hoạt động', href: '#how-it-works' },
  { label: 'Đánh giá', href: '#testimonials' },
]

export function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-xl border-b-2 border-[#22c55e]/15">
      <div className="container mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 text-[#1a3a1a] font-extrabold text-lg">
          <div className="w-9 h-9 rounded-xl bg-[#22c55e] flex items-center justify-center text-white font-extrabold text-base shadow-[0_4px_14px_rgba(34,197,94,0.4)]">
            F
          </div>
          <span>
            <span className="text-[#22c55e]">Fin</span>
            <span className="text-[#1a3a1a]">Teen</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#1a3a1a]/80 hover:text-[#16a34a] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="hidden sm:inline-flex text-[#1a3a1a] hover:bg-[#22c55e]/10 hover:text-[#16a34a]"
          >
            Đăng nhập
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/register')}
            className="hidden sm:inline-flex bg-[#22c55e] text-white hover:bg-[#16a34a] shadow-[0_4px_14px_rgba(34,197,94,0.35)]"
          >
            Bắt đầu ngay
          </Button>
          <button className="md:hidden p-2 text-[#1a3a1a]" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
