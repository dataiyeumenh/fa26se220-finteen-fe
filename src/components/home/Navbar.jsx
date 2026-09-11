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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f0]/85 backdrop-blur-xl border-b-2 border-[#2d1b4e]/8">
      <div className="container mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 text-[#2d1b4e] font-extrabold text-lg">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-[#2d1b4e] font-extrabold text-base shadow-[0_4px_14px_rgba(184,255,61,0.5)]">
            F
          </div>
          <span className="text-gradient-primary">FinTeen</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#2d1b4e]/80 hover:text-[#a855f7] transition-colors"
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
            className="hidden sm:inline-flex text-[#2d1b4e] hover:bg-[#2d1b4e]/8 hover:text-[#2d1b4e]"
          >
            Đăng nhập
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/register')}
            className="hidden sm:inline-flex gradient-accent text-[#2d1b4e] hover:opacity-90 shadow-[0_4px_14px_rgba(184,255,61,0.4)]"
          >
            Bắt đầu ngay
          </Button>
          <button className="md:hidden p-2 text-[#2d1b4e]" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
