import { Outlet, Link } from 'react-router-dom'
import { ArrowLeft, Wallet, Lightbulb, Coins } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative blobs — multi-color */}
      <div className="absolute top-0 left-0 w-[480px] h-[480px] rounded-full bg-[#22c55e]/15 blur-3xl pointer-events-none animate-float" aria-hidden="true" />
      <div
        className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-[#fbbf24]/15 blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#38bdf8]/12 blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '4s' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-[260px] h-[260px] rounded-full bg-[#84cc16]/15 blur-3xl pointer-events-none animate-float"
        style={{ animationDelay: '1s' }}
        aria-hidden="true"
      />

      {/* Floating icons ngữ nghĩa (Wallet, Coins, Lightbulb) — không phải sparkle decor */}
      <Coins className="absolute top-24 right-20 w-7 h-7 text-[#fbbf24]/40 animate-bounce-subtle" style={{ animationDelay: '1s' }} aria-hidden="true" />
      <Wallet className="absolute bottom-20 left-20 w-7 h-7 text-[#38bdf8]/40 animate-bounce-subtle" style={{ animationDelay: '0.6s' }} aria-hidden="true" />
      <Lightbulb className="absolute bottom-32 right-12 w-8 h-8 text-[#84cc16]/40 animate-bounce-subtle" style={{ animationDelay: '1.4s' }} aria-hidden="true" />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-bold text-[#1a3a1a]/70 hover:text-[#16a34a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Về trang chủ
      </Link>

      {/* Logo top-right */}
      <Link to="/" className="absolute top-6 right-6 z-20 flex items-center gap-2 text-[#1a3a1a] font-extrabold text-lg">
        <div className="w-9 h-9 rounded-xl bg-[#22c55e] flex items-center justify-center text-white font-extrabold text-base shadow-[0_4px_14px_rgba(34,197,94,0.4)]">
          F
        </div>
        <span>
          <span className="text-[#22c55e]">Fin</span>
          <span className="text-[#1a3a1a]">Teen</span>
        </span>
      </Link>

      {/* Auth content */}
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <Outlet />
      </div>
    </div>
  )
}
