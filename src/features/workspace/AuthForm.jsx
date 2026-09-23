import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Eye, EyeOff, GraduationCap, KeyRound, Users } from 'lucide-react'
import { register, login } from './demoStore'
import { useWorkspace } from './useWorkspace'
import '@/components/public/public.css'

function PasswordField({ id, label, hint, ...inputProps }) {
  const [visible, setVisible] = useState(false)
  const action = `${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`
  return <div className="ft-field-group">
    <label htmlFor={id}>{label}</label>
    <div className="ft-password-field">
      <input {...inputProps} id={id} type={visible ? 'text' : 'password'} aria-describedby={hint ? `${id}-hint` : undefined} />
      <button type="button" className="ft-password-toggle" aria-label={action} title={action} aria-controls={id} aria-pressed={visible} onClick={() => setVisible(value => !value)}>
        {visible ? <EyeOff size={21} aria-hidden="true" /> : <Eye size={21} aria-hidden="true" />}
      </button>
    </div>
    {hint && <small id={`${id}-hint`}>{hint}</small>}
  </div>
}

export default function AuthForm({ registration = false }) {
  const { actor } = useWorkspace()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const kind = !registration && params.get('as') === 'kid' ? 'learner' : 'adult'
  const kid = kind === 'learner'
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const chooseKind = next => {
    setParams(next === 'learner' ? { as: 'kid' } : {}, { replace: true })
    setError('')
  }
  if (actor) return <Navigate replace to={actor.role === 'kid' ? '/dashboard/kid' : '/dashboard'} />

  const onSubmit = async event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError(''); setBusy(true)
    try {
      if (registration) {
        if (form.get('secret') !== form.get('confirm')) throw new Error('Mật khẩu xác nhận chưa khớp. Bạn kiểm tra lại nhé.')
        await register({ name: form.get('name'), email: form.get('identifier'), password: form.get('secret') })
      } else await login({ kind, identifier: form.get('identifier'), secret: form.get('secret') })
      navigate(kid ? '/dashboard/kid' : '/dashboard', { replace: true })
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return <section className="ft-auth-form">
    <span className="ft-small-label">{registration ? 'BẮT ĐẦU MỘT HÀNH TRÌNH' : 'HẸN GẶP BẠN Ở CHƯƠNG TIẾP THEO'}</span>
    <h1>{registration ? 'Tạo tài khoản mới.' : kid ? 'Chào bạn, nhà khám phá!' : 'Chào mừng trở lại!'}</h1>
    <p className="ft-auth-intro">{registration ? 'Dành cho phụ huynh và giáo viên. Tạo tài khoản để cùng các bạn nhỏ khám phá FinTeen.' : kid ? 'Nhập mã và PIN được cấp để vào góc học tập của bạn.' : 'Đăng nhập để đồng hành cùng con và học sinh.'}</p>
    {!registration && <div className="ft-auth-tabs" role="group" aria-label="Loại tài khoản">
      <button type="button" disabled={busy} aria-pressed={!kid} onClick={() => chooseKind('adult')}><Users size={19} aria-hidden="true" /><span>Người lớn<small>Phụ huynh / Giáo viên</small></span></button>
      <button type="button" disabled={busy} aria-pressed={kid} onClick={() => chooseKind('learner')}><GraduationCap size={20} aria-hidden="true" /><span>Kid<small>Học sinh 13–18 tuổi</small></span></button>
    </div>}
    {registration && <div className="ft-register-note"><span className="ft-icon-circle ft-lime"><GraduationCap size={20} aria-hidden="true" /></span><p>Các bạn học sinh đã có mã?<br /><Link to="/login?as=kid">Đăng nhập Kid tại đây <ArrowRight size={14} aria-hidden="true" /></Link></p></div>}
    <form key={`${kind}-${registration}`} className="ft-account-fields" onSubmit={onSubmit} aria-busy={busy} aria-describedby={error ? 'ft-auth-error' : undefined}>
      <fieldset disabled={busy}>
        {registration && <label htmlFor="ft-name">Họ và tên<input id="ft-name" name="name" placeholder="Nhập họ và tên của bạn" autoComplete="name" required maxLength={80} /></label>}
        <label htmlFor="ft-identifier">{kid ? 'Mã đăng nhập' : 'Địa chỉ email'}<input id="ft-identifier" name="identifier" type={kid ? 'text' : 'email'} autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={kid ? 'VD: FT-XXXXXXXXXX' : 'ban@example.com'} required /></label>
        <PasswordField id="ft-secret" label={kid ? 'Mã PIN' : 'Mật khẩu'} name="secret" placeholder={kid ? 'Nhập PIN 4–6 chữ số' : 'Nhập mật khẩu của bạn'} autoComplete={registration ? 'new-password' : 'current-password'} minLength={kid ? 4 : 8} maxLength={kid ? 6 : undefined} pattern={kid ? '[0-9]{4,6}' : undefined} inputMode={kid ? 'numeric' : undefined} hint={registration ? 'Sử dụng ít nhất 8 ký tự.' : undefined} required />
        {registration && <PasswordField id="ft-confirm" label="Xác nhận mật khẩu" name="confirm" placeholder="Nhập lại mật khẩu vừa tạo" autoComplete="new-password" required minLength={8} />}
        {kid && <div className="ft-pin-note"><KeyRound size={18} aria-hidden="true" /><p>Chưa có mã hoặc quên PIN? Nhờ phụ huynh hoặc giáo viên tạo tài khoản, đặt lại PIN giúp bạn nhé.</p></div>}
        {error && <p className="ft-auth-error" id="ft-auth-error" role="alert">{error}</p>}
        <button className="ft-button ft-primary ft-submit" type="submit" disabled={busy}>{busy ? 'Đang xử lý…' : registration ? 'Tạo tài khoản miễn phí' : kid ? 'Vào góc học tập' : 'Đăng nhập'}{!busy && <ArrowRight size={19} aria-hidden="true" />}</button>
      </fieldset>
    </form>
    {registration && <p className="ft-free-note">Bắt đầu với chương 1 dùng thử. Chọn gói khi bạn sẵn sàng.</p>}
    <p className="ft-auth-switch">{registration ? 'Bạn đã có tài khoản?' : 'Bạn là phụ huynh hoặc giáo viên mới?'} <Link to={registration ? '/login' : '/register'}>{registration ? 'Đăng nhập' : 'Đăng ký ngay'} <ArrowUpRight size={15} aria-hidden="true" /></Link></p>
    <details className="ft-demo-disclosure"><summary>Đang sử dụng bản thử nghiệm</summary><p>Tài khoản và dữ liệu chỉ lưu trên trình duyệt này, chưa kết nối API đăng nhập.</p></details>
  </section>
}
