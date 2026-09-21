import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Tính năng', href: '#features' },
  { label: 'Trò chơi', href: '#games' },
  { label: 'Cách hoạt động', href: '#how-it-works' },
  { label: 'Đánh giá', href: '#testimonials' },
]

export function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#fcfcff]/90 backdrop-blur-xl border-b-2 border-[#ffe43b]/15">
      <div className="container mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 text-[#25263d] font-extrabold text-lg">
          <div className="w-9 h-9 rounded-xl bg-[#ffe43b] flex items-center justify-center text-white font-extrabold text-base shadow-[0_4px_14px_rgba(215,166,35,0.4)]">
            F
          </div>
          <span>
            <span className="text-[#3568bd]">Fin</span>
            <span className="text-[#25263d]">Teen</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#25263d]/80 hover:text-[#51428b] transition-colors"
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
            className="hidden sm:inline-flex text-[#25263d] hover:bg-[#ffe43b]/10 hover:text-[#51428b]"
          >
            Đăng nhập
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/register')}
            className="hidden sm:inline-flex bg-[#ffe43b] text-[#25263d] hover:bg-[#f5d51f] shadow-[0_4px_14px_rgba(215,166,35,0.35)]"
          >
            Bắt đầu ngay
          </Button>
          <button className="md:hidden p-2 text-[#25263d]" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="home-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {menuOpen && <nav id="home-mobile-menu" className="md:hidden grid gap-1 px-6 py-4 bg-white border-t border-slate-100" aria-label="Điều hướng di động">
        {navLinks.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-3 text-sm font-medium">{link.label}</a>)}
        <button onClick={() => navigate('/login')} className="py-3 text-left text-sm font-semibold text-[#3568bd]">Đăng nhập</button>
        <button onClick={() => navigate('/register')} className="py-3 text-left text-sm font-semibold text-[#3568bd]">Tạo tài khoản</button>
      </nav>}
    </header>
  )
}
