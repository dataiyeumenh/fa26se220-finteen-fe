import { Server, Shield, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WelcomeBanner({ systemOk, accent = '#c4b5fd', accentText = '#5b21b6' }) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden text-[#1a3a1a]"
      style={{ backgroundColor: accent }}
    >
      {/* Decorative color blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#a78bfa' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: '#c4b5fd' }}
        aria-hidden="true"
      />

      <span className="absolute top-2 right-4 text-6xl opacity-90" aria-hidden="true">🛡️</span>
      <span className="absolute -bottom-4 -right-4 text-7xl opacity-20" aria-hidden="true">⚙️</span>
      <Settings
        className="absolute top-12 left-1/4 w-5 h-5 animate-bounce-subtle"
        style={{ color: '#5b21b6', opacity: 0.5 }}
        aria-hidden="true"
      />

      <div className="relative">
        <div
          className="inline-flex items-center gap-2 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold mb-3 border"
          style={{
            backgroundColor: '#ffffff40',
            borderColor: '#5b21b630',
            color: '#1a3a1a',
          }}
        >
          <Server className="w-3 h-3" style={{ color: '#5b21b6' }} aria-hidden="true" />
          Hệ thống {systemOk ? 'hoạt động bình thường' : 'có cảnh báo'}
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-1.5">Chào Admin!</h1>
        <p className="text-[#1a3a1a]/85 text-sm md:text-base mb-5">
          Hệ thống có{' '}
          <span className="font-extrabold" style={{ color: accentText }}>
            12.4K người dùng
          </span>
          , trong đó <span className="font-extrabold">8.2K hoạt động</span> hôm nay. Có{' '}
          <span className="font-extrabold" style={{ color: '#c2410c' }}>
            3 báo cáo lỗi
          </span>{' '}
          cần xem xét
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            className="bg-[#5b21b6] text-white hover:bg-[#4c1d95] border-0 font-extrabold shadow-[0_4px_14px_rgba(91,33,182,0.3)]"
          >
            <Shield className="w-4 h-4" aria-hidden="true" />
            Xem báo cáo lỗi
          </Button>
          <Button
            className="bg-white hover:bg-[#faf8f5] border-2 border-[#5b21b6] text-[#5b21b6] font-extrabold"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            Cài đặt nhanh
          </Button>
        </div>
      </div>
    </div>
  )
}
