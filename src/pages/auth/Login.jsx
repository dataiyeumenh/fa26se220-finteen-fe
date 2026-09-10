import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Login() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 800)
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-[#2d1b4e]/8 shadow-finteen-lg p-8 md:p-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#fff8f0] border-2 border-[#ffd93d]/40 rounded-full px-4 py-1.5 text-xs font-bold text-[#2d1b4e] mb-4">
          👋 Chào mừng quay lại
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#2d1b4e] mb-2 tracking-tight">
          Đăng nhập <span className="text-gradient-primary">nào!</span>
        </h1>
        <p className="text-sm text-[#2d1b4e]/65">
          Tiếp tục hành trình làm chủ đồng tiền của bạn ✨
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#2d1b4e] mb-2">
            📧 Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1b4e]/40 pointer-events-none" />
            <Input
              type="email"
              required
              placeholder="ban@email.com"
              className="pl-11"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-[#2d1b4e]">
              🔒 Mật khẩu
            </label>
            <a href="#" className="text-xs font-bold text-[#a855f7] hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1b4e]/40 pointer-events-none" />
            <Input
              type={showPwd ? 'text' : 'password'}
              required
              placeholder="••••••••"
              className="pl-11 pr-11"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2d1b4e]/40 hover:text-[#2d1b4e]"
              aria-label="Toggle password"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[#2d1b4e]/70 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-2 border-[#2d1b4e]/20 text-[#b8ff3d] focus:ring-[#b8ff3d]"
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full gradient-primary text-white font-extrabold border-0 shadow-finteen-md hover:opacity-95"
        >
          {loading ? 'Đang vào...' : 'Đăng nhập 🚀'}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#2d1b4e]/10" />
        <span className="text-xs font-bold text-[#2d1b4e]/40">HOẶC</span>
        <div className="flex-1 h-px bg-[#2d1b4e]/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full border-2 border-[#2d1b4e]/15 text-[#2d1b4e] hover:bg-[#fff8f0] font-bold"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Tiếp tục với Google
      </Button>

      <p className="text-center text-sm text-[#2d1b4e]/70 mt-8">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-extrabold text-[#a855f7] hover:underline">
          Đăng ký miễn phí →
        </Link>
      </p>
    </div>
  )
}
