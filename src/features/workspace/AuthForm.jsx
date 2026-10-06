import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Eye, EyeOff, GraduationCap, KeyRound, Users } from 'lucide-react'
import { useEffect } from 'react'
import { auth } from '../../api/auth.api'
import { googleIdToken, googleReady } from '../../api/firebase'
import { useWorkspace } from './useWorkspace'
import OtpForm from '../auth/OtpForm'
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
  const { actor, loading } = useWorkspace()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const kind = !registration && params.get('as') === 'kid' ? 'learner' : 'adult'
  const kid = kind === 'learner'
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [otpMode, setOtpMode] = useState(null)
  const [cooldown, setCooldown] = useState(0)
  useEffect(() => {
    if (!cooldown) return
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])
  const chooseKind = next => {
    setParams(next === 'learner' ? { as: 'kid' } : {}, { replace: true })
    setError('')
    setMessage(''); setOtpMode(null)
  }
  if (loading && !otpMode) return <p role="status">Đang kiểm tra phiên đăng nhập…</p>
  const destination = current => current?.roles?.includes('ADMIN') ? '/internal' : current?.role === 'kid' ? '/dashboard/kid' : '/dashboard'
  if (actor) return <Navigate replace to={destination(actor)} />
  if (otpMode) return <OtpForm email={email} mode={otpMode} cooldown={cooldown} onCooldown={setCooldown}
    onBack={() => { setOtpMode(null); setError(''); setMessage(''); navigate('/login') }}
    onSuccess={reset => {
      setOtpMode(null)
      if (reset) { setMessage('Đã đặt lại mật khẩu. Hãy đăng nhập bằng mật khẩu mới.'); navigate('/login', { replace: true }) }
      else navigate(destination(auth.getSnapshot().actor), { replace: true })
    }} />

  const onSubmit = async event => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError(''); setMessage(''); setBusy(true)
    try {
      if (registration) {
        if (form.get('secret') !== form.get('confirm')) throw new Error('Mật khẩu xác nhận chưa khớp. Bạn kiểm tra lại nhé.')
        await auth.register({ displayName: form.get('name'), email: form.get('identifier'), phone: form.get('phone'), password: form.get('secret') })
        setEmail(String(form.get('identifier')).trim()); setOtpMode('verify'); setCooldown(60)
        return
      } else if (kid) { throw new Error('Đăng nhập học sinh chưa kết nối API SLOT. Không còn đăng nhập demo.') }
      else { await auth.login(form.get('identifier'), form.get('secret')) }
      navigate(destination(auth.getSnapshot().actor), { replace: true })
    } catch (err) { setError(err.code === 3016 ? 'Tài khoản tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau 15 phút.' : err.message); if (err.code === 3011) { setEmail(String(form.get('identifier')).trim()); setOtpMode('verify') } } finally { setBusy(false) }
  }

  const emailAction = async action => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Bạn nhập địa chỉ email hợp lệ trước nhé.'); return }
    setBusy(true); setError(''); setMessage('')
    try {
      await auth[action](email)
      setCooldown(60)
      setEmail(email.trim()); setOtpMode('reset')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const googleLogin = async () => {
    setBusy(true); setError(''); setMessage('')
    try { const token = await googleIdToken(); await auth.googleLogin(token); navigate(destination(auth.getSnapshot().actor), { replace: true }) }
    catch (err) { setError(err.code === 3020 ? 'Email này đã đăng ký bằng mật khẩu. Hãy đăng nhập bằng mật khẩu, rồi vào Tài khoản để liên kết Google.' : err.message) }
    finally { setBusy(false) }
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
      <fieldset disabled={busy || kid}>
        {registration && <label htmlFor="ft-name">Họ và tên<input id="ft-name" name="name" placeholder="Nhập họ và tên của bạn" autoComplete="name" required maxLength={80} /></label>}
        <label htmlFor="ft-identifier">{kid ? 'Mã đăng nhập' : 'Địa chỉ email'}<input id="ft-identifier" name="identifier" type={kid ? 'text' : 'email'} onChange={event => { if (!kid) setEmail(event.target.value) }} autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={kid ? 'VD: FT-XXXXXXXXXX' : 'ban@example.com'} required /></label>
        {registration && <label htmlFor="ft-phone">Số điện thoại (không bắt buộc)<input id="ft-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Nhập số điện thoại của bạn" /></label>}
        <PasswordField id="ft-secret" label={kid ? 'Mã PIN' : 'Mật khẩu'} name="secret" placeholder={kid ? 'Nhập PIN 4–6 chữ số' : 'Nhập mật khẩu của bạn'} autoComplete={registration ? 'new-password' : 'current-password'} minLength={kid ? 4 : 8} maxLength={kid ? 6 : undefined} pattern={kid ? '[0-9]{4,6}' : undefined} inputMode={kid ? 'numeric' : undefined} hint={registration ? 'Sử dụng ít nhất 8 ký tự.' : undefined} required />
        {registration && <PasswordField id="ft-confirm" label="Xác nhận mật khẩu" name="confirm" placeholder="Nhập lại mật khẩu vừa tạo" autoComplete="new-password" required minLength={8} />}
        {kid && <div className="ft-pin-note"><KeyRound size={18} aria-hidden="true" /><p>Chưa có mã hoặc quên PIN? Nhờ phụ huynh hoặc giáo viên tạo tài khoản, đặt lại PIN giúp bạn nhé.</p></div>}
        {error && <p className="ft-auth-error" id="ft-auth-error" role="alert">{error}</p>}
        <button className="ft-button ft-primary ft-submit" type="submit" disabled={busy}>{busy ? 'Đang xử lý…' : registration ? 'Tạo tài khoản miễn phí' : kid ? 'Vào góc học tập' : 'Đăng nhập'}{!busy && <ArrowRight size={19} aria-hidden="true" />}</button>
      </fieldset>
    </form>
    {message && <p className="ft-free-note" role="status">{message}</p>}
    {!kid && <div className="ft-auth-alternatives">
      {!registration && <button type="button" className="ft-auth-text-action" disabled={busy || cooldown > 0} onClick={() => emailAction('forgot')}>Quên mật khẩu?{cooldown > 0 ? ` (${cooldown}s)` : ''}</button>}
      <div className="ft-auth-divider"><span>hoặc</span></div>
      <button type="button" className="ft-google-button" disabled={busy || !googleReady} title={!googleReady ? 'Đăng nhập Google chưa được cấu hình' : undefined} onClick={googleLogin}>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z"/>
          <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"/>
          <path fill="#FBBC05" d="M6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.07a10 10 0 0 0 0 9.02l3.34-2.59Z"/>
          <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59C7.2 7.72 9.4 5.96 12 5.96Z"/>
        </svg>
        <span>Tiếp tục với Google</span>
      </button>
      {auth.getSnapshot().error && !error && <p role="alert">{auth.getSnapshot().error}</p>}
    </div>}
    <p className="ft-auth-switch">{registration ? 'Bạn đã có tài khoản?' : 'Bạn là phụ huynh hoặc giáo viên mới?'} <Link to={registration ? '/login' : '/register'}>{registration ? 'Đăng nhập' : 'Đăng ký ngay'} <ArrowUpRight size={15} aria-hidden="true" /></Link></p>
    {kid && <p role="status">Đăng nhập học sinh đang chờ kết nối API SLOT. Tài khoản và PIN demo đã ngừng sử dụng.</p>}
  </section>
}
