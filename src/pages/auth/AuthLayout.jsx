import { Outlet, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#fff8f0] relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[480px] h-[480px] rounded-full bg-[#ffb3d9]/40 blur-3xl pointer-events-none animate-float" />
      <div
        className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-[#b8ff3d]/30 blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#4dabff]/25 blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '4s' }}
      />

      {/* Floating stickers */}
      <span className="absolute top-12 left-12 text-4xl animate-bounce-subtle">💸</span>
      <span className="absolute top-24 right-20 text-3xl animate-bounce-subtle" style={{ animationDelay: '1s' }}>⭐</span>
      <span className="absolute bottom-20 left-20 text-3xl animate-bounce-subtle" style={{ animationDelay: '0.6s' }}>🪙</span>
      <span className="absolute bottom-32 right-12 text-4xl animate-bounce-subtle" style={{ animationDelay: '1.4s' }}>💡</span>
      <span className="hidden md:block absolute top-1/2 left-8 text-3xl animate-bounce-subtle" style={{ animationDelay: '0.8s' }}>✨</span>
      <span className="hidden md:block absolute top-1/2 right-8 text-3xl animate-bounce-subtle" style={{ animationDelay: '1.6s' }}>🚀</span>

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-bold text-[#2d1b4e]/70 hover:text-[#2d1b4e] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Về trang chủ
      </Link>

      {/* Logo top-right */}
      <Link to="/" className="absolute top-6 right-6 z-20 flex items-center gap-2 text-[#2d1b4e] font-extrabold text-lg">
        <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-[#2d1b4e] font-extrabold text-base shadow-[0_4px_14px_rgba(184,255,61,0.5)]">
          F
        </div>
        <span className="text-gradient-primary">FinTeen</span>
      </Link>

      {/* Auth content */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <Outlet />
      </div>
    </div>
  )
}
