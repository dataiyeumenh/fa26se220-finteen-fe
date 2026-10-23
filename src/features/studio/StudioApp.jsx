// Studio nội dung — bản DEMO 24/10 (Claude làm theo lời Hưng; team FE tối ưu, trang trí, gộp với /internal sau).
// Route riêng /studio/* để không đụng trang admin hiện có. API: build/api-docs/content.md, assets.md, quiz.md (BE).
import { useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { currentSession, login, logout, switchSession, useStudioSession, StudioError } from './studioClient'
import { Btn } from './ui'
import { inputCls } from './styles'
import { useToast } from './useToast'
import ChaptersPage from './ChaptersPage'
import EditorPage from './EditorPage'
import ReleasesPage from './ReleasesPage'
import AssetsPage from './AssetsPage'
import QuestionsPage from './QuestionsPage'

const NAV = [
  ['chapters', 'Chương'],
  ['releases', 'Phát hành'],
  ['assets', 'Kho ảnh'],
  ['questions', 'Kho câu hỏi'],
]

function LoginPage({ notify }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await login(email.trim(), password)
      notify('Đã đăng nhập ' + email, true)
    } catch (err) {
      notify(err instanceof StudioError && err.code === 3022 ? 'Tài khoản này không phải tài khoản nội bộ (3022)' : err.message)
    } finally {
      setBusy(false)
      setPassword('')
    }
  }
  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-md rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="mb-1 text-xl font-bold text-[#1f3864]">FinTeen Studio</h1>
      <p className="mb-4 text-sm text-slate-500">
        Đăng nhập nội bộ (Editor / Reviewer / Manager / Admin). Đăng nhập thêm tài khoản khác để đổi vai nhanh — người sửa
        không tự duyệt, không tự phát hành.
      </p>
      <label className="mb-1 block text-xs text-slate-500">Email</label>
      <input className={`${inputCls} mb-3 w-full`} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      <label className="mb-1 block text-xs text-slate-500">Mật khẩu</label>
      <input
        className={`${inputCls} mb-4 w-full`}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <Btn tone="primary" type="submit" disabled={busy || !email || !password}>
        Đăng nhập
      </Btn>
    </form>
  )
}

export default function StudioApp() {
  const state = useStudioSession()
  const { notify, view } = useToast()
  const me = currentSession()
  const [adding, setAdding] = useState(false)

  if (!me || adding) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoginPage
          notify={(m, ok) => {
            notify(m, ok)
            if (ok) setAdding(false)
          }}
        />
        {me && (
          <p className="mt-4 text-center">
            <Btn onClick={() => setAdding(false)}>Quay lại Studio</Btn>
          </p>
        )}
        {view}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex flex-wrap items-center gap-3 bg-[#1f3864] px-5 py-3 text-white">
        <b className="mr-4 text-lg">FinTeen Studio</b>
        <span className="rounded bg-white/15 px-2 py-0.5 text-xs">bản demo</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select
            className="rounded-md bg-white px-2 py-1 text-sm text-slate-800"
            value={state.active}
            onChange={(e) => switchSession(Number(e.target.value))}
          >
            {state.sessions.map((s, i) => (
              <option key={s.email} value={i}>
                {s.name} — {s.roles.join(', ') || 'không vai'}
              </option>
            ))}
          </select>
          <Btn onClick={() => setAdding(true)}>+ Tài khoản</Btn>
          <Btn onClick={logout}>Đăng xuất</Btn>
        </div>
      </header>
      <nav className="flex gap-1 border-b border-slate-200 bg-white px-5">
        {NAV.map(([to, label]) => (
          <NavLink
            key={to}
            to={`/studio/${to}`}
            className={({ isActive }) =>
              `border-b-2 px-3 py-3 text-sm ${isActive ? 'border-blue-600 font-semibold text-[#1f3864]' : 'border-transparent text-slate-500'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="mx-auto max-w-6xl p-5">
        <Routes>
          <Route path="chapters" element={<ChaptersPage notify={notify} />} />
          <Route path="editor/:code" element={<EditorPage notify={notify} />} />
          <Route path="releases" element={<ReleasesPage notify={notify} />} />
          <Route path="assets" element={<AssetsPage notify={notify} />} />
          <Route path="questions" element={<QuestionsPage notify={notify} />} />
          <Route path="*" element={<Navigate to="/studio/chapters" replace />} />
        </Routes>
      </main>
      {view}
    </div>
  )
}
