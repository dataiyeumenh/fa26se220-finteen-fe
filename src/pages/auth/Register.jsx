import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, GraduationCap } from 'lucide-react'
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
    <div className="bg-white rounded-3xl border-2 border-[#2d1b4e]/8 shadow-finteen-lg p-8 md:p-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#fff8f0] border-2 border-[#ff6b9d]/40 rounded-full px-4 py-1.5 text-xs font-bold text-[#2d1b4e] mb-4">
          🎉 Hoàn toàn miễn phí
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#2d1b4e] mb-2 tracking-tight">
          Tạo tài khoản <span className="text-gradient-primary">mới</span>
        </h1>
        <p className="text-sm text-[#2d1b4e]/65">
          Cùng nhau làm chủ đồng tiền, bắt đầu từ hôm nay 🚀
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#2d1b4e] mb-2">
            👤 Tên hiển thị
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1b4e]/40 pointer-events-none" />
            <Input
              type="text"
              required
              placeholder="VD: Minh Tuấn"
              className="pl-11"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

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
          <label className="block text-sm font-bold text-[#2d1b4e] mb-2">
            🎓 Bạn đang học lớp mấy?
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1b4e]/40 pointer-events-none" />
            <select
              required
              value={form.grade}
              onChange={e => setForm({ ...form, grade: e.target.value })}
              className="flex h-12 w-full rounded-2xl border-2 border-slate-200 bg-white pl-11 pr-4 py-2 text-base font-semibold text-[#2d1b4e] focus-visible:outline-none focus-visible:border-[#a855f7] focus-visible:ring-2 focus-visible:ring-[#a855f7]/20 transition-colors"
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
          <label className="block text-sm font-bold text-[#2d1b4e] mb-2">
            🔒 Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d1b4e]/40 pointer-events-none" />
            <Input
              type={showPwd ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Tối thiểu 6 ký tự"
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
          <p className="text-xs text-[#2d1b4e]/50 mt-1.5">
            💡 Mẹo: dùng cả chữ + số cho dễ nhớ
          </p>
        </div>

        <label className="flex items-start gap-2 text-sm text-[#2d1b4e]/70 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-2 border-[#2d1b4e]/20 text-[#b8ff3d] focus:ring-[#b8ff3d]"
          />
          <span>
            Tôi đồng ý với{' '}
            <a href="#" className="font-bold text-[#a855f7] hover:underline">
              Điều khoản
            </a>{' '}
            và{' '}
            <a href="#" className="font-bold text-[#a855f7] hover:underline">
              Chính sách bảo mật
            </a>{' '}
            của FinTeen
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full gradient-primary text-white font-extrabold border-0 shadow-finteen-md hover:opacity-95"
        >
          {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí 🎉'}
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
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Đăng ký với Google
      </Button>

      <p className="text-center text-sm text-[#2d1b4e]/70 mt-8">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-extrabold text-[#a855f7] hover:underline">
          Đăng nhập ngay →
        </Link>
      </p>
    </div>
  )
}
