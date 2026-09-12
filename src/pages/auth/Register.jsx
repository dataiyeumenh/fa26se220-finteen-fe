import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const grades = ['Lớp 10', 'Lớp 11', 'Lớp 12', 'Đã tốt nghiệp', 'Khác']

export default function Register() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    grade: 'Lớp 10',
  })

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 800)
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-[#22c55e]/15 shadow-[0_20px_60px_rgba(34,197,94,0.18)] p-8 md:p-10 relative overflow-hidden">
      {/* Top color stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#22c55e]" aria-hidden="true" />

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#fefce8] border-2 border-[#fbbf24]/40 rounded-full px-4 py-1.5 text-xs font-bold text-[#1a3a1a] mb-4">
          <PartyPopper className="w-3 h-3 text-[#fb923c]" aria-hidden="true" />
          Hoàn toàn miễn phí
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#1a3a1a] mb-2 tracking-tight">
          Tạo tài khoản <span className="text-[#22c55e]">mới</span>
        </h1>
        <p className="text-sm text-[#1a3a1a]/65">
          Cùng nhau làm chủ đồng tiền, bắt đầu từ hôm nay
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#1a3a1a] mb-2">
            Tên hiển thị
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#fb923c] pointer-events-none" />
            <Input
              type="text"
              required
              placeholder="VD: Minh Tuấn"
              className="pl-11 border-[#22c55e]/15 focus-visible:border-[#22c55e]"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1a3a1a] mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e] pointer-events-none" />
            <Input
              type="email"
              required
              placeholder="ban@email.com"
              className="pl-11 border-[#22c55e]/15 focus-visible:border-[#22c55e]"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1a3a1a] mb-2">
            Bạn đang học lớp mấy?
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#38bdf8] pointer-events-none" />
            <select
              required
              value={form.grade}
              onChange={e => setForm({ ...form, grade: e.target.value })}
              className="flex h-12 w-full rounded-2xl border-2 border-[#22c55e]/15 bg-white pl-11 pr-4 py-2 text-base font-semibold text-[#1a3a1a] focus-visible:outline-none focus-visible:border-[#22c55e] focus-visible:ring-2 focus-visible:ring-[#22c55e]/20 transition-colors"
            >
              {grades.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1a3a1a] mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#84cc16] pointer-events-none" />
            <Input
              type={showPwd ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Tối thiểu 6 ký tự"
              className="pl-11 pr-11 border-[#22c55e]/15 focus-visible:border-[#22c55e]"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a3a1a]/40 hover:text-[#22c55e]"
              aria-label="Toggle password"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-[#1a3a1a]/50 mt-1.5">
            Mẹo: dùng cả chữ + số cho dễ nhớ
          </p>
        </div>

        <label className="flex items-start gap-2 text-sm text-[#1a3a1a]/70 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-2 border-[#22c55e]/30 text-[#22c55e] focus:ring-[#22c55e]"
          />
          <span>
            Tôi đồng ý với{' '}
            <a href="#" className="font-bold text-[#16a34a] hover:text-[#22c55e] hover:underline">
              Điều khoản
            </a>{' '}
            và{' '}
            <a href="#" className="font-bold text-[#16a34a] hover:text-[#22c55e] hover:underline">
              Chính sách bảo mật
            </a>{' '}
            của FinTeen
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full bg-[#22c55e] text-white font-extrabold border-0 shadow-[0_8px_24px_rgba(34,197,94,0.3)] hover:bg-[#16a34a]"
        >
          {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí'}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#22c55e]/10" />
        <span className="text-xs font-bold text-[#1a3a1a]/40">HOẶC</span>
        <div className="flex-1 h-px bg-[#22c55e]/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full border-2 border-[#1a3a1a]/15 text-[#1a3a1a] hover:bg-[#faf8f5] hover:border-[#1a3a1a] font-bold"
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
        Đăng ký với Google
      </Button>

      <p className="text-center text-sm text-[#1a3a1a]/70 mt-8">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-extrabold text-[#16a34a] hover:text-[#22c55e] hover:underline">
          Đăng nhập ngay →
        </Link>
      </p>
    </div>
  )
}
