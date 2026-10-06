import { useEffect, useRef, useState } from 'react'
import { auth } from '../../api/auth.api'

const errors = {
  3012: 'Mã không đúng, đã dùng hoặc đã bị vô hiệu sau 5 lần nhập sai. Kiểm tra mã hoặc xin mã mới.',
  3013: 'Mã xác minh đã hết hạn. Hãy gửi lại mã.',
  3014: 'Email đã được xác minh. Bạn có thể quay lại đăng nhập.',
  3017: 'Mã đặt lại mật khẩu không đúng, đã dùng hoặc đã bị vô hiệu sau 5 lần nhập sai. Kiểm tra mã hoặc xin mã mới.',
  3018: 'Mã đặt lại mật khẩu đã hết hạn. Hãy gửi lại mã.',
}

export default function OtpForm({ email, mode, cooldown, onCooldown, onBack, onSuccess }) {
  const reset = mode === 'reset'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState(reset ? 'Nếu email có tài khoản phù hợp, bạn sẽ nhận được mã. Hãy kiểm tra cả thư mục Spam.' : '')
  const [otp, setOtp] = useState('')
  const lock = useRef(false)
  const input = useRef(null)
  useEffect(() => { input.current?.focus() }, [])
  async function submit(event) {
    event.preventDefault()
    if (lock.current) return
    const data = new FormData(event.currentTarget)
    setError(''); setMessage('')
    if (!/^\d{6}$/.test(otp)) { setError('Nhập đủ 6 chữ số của mã OTP.'); return }
    if (reset && data.get('newPassword') !== data.get('confirm')) { setError('Mật khẩu xác nhận chưa khớp.'); return }
    lock.current = true; setBusy(true)
    try {
      if (reset) await auth.resetPassword(email, otp, data.get('newPassword'))
      else if (auth.hasSession()) await auth.refresh()
      else await auth.verify(email, otp)
      onSuccess(reset)
    } catch (err) { setError(errors[err.code] || err.message) }
    finally { lock.current = false; setBusy(false) }
  }
  async function resend() {
    if (lock.current || cooldown > 0) return
    lock.current = true; setBusy(true); setError(''); setMessage('')
    try {
      if (reset) await auth.forgot(email)
      else await auth.resend(email)
      onCooldown(60); setOtp('')
      setMessage('Nếu tài khoản đủ điều kiện, mã mới sẽ được gửi qua email. Hãy dùng mã mới nhất và kiểm tra cả Spam.')
      input.current?.focus()
    } catch (err) { setError(err.message) }
    finally { lock.current = false; setBusy(false) }
  }
  return <section className="ft-auth-form">
    <span className="ft-small-label">BẢO MẬT TÀI KHOẢN</span>
    <h1>{reset ? 'Đặt lại mật khẩu.' : 'Nhập mã xác minh.'}</h1>
    <p className="ft-auth-intro">Nhập mã 6 số được gửi đến <strong>{email}</strong>.</p>
    <form className="ft-account-fields" onSubmit={submit} aria-busy={busy}>
      <fieldset disabled={busy}>
        <label htmlFor="ft-otp">Mã OTP<input ref={input} className="ft-otp-input" id="ft-otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required /></label>
        {reset && <>
          <label htmlFor="ft-new-password">Mật khẩu mới<input id="ft-new-password" name="newPassword" type="password" autoComplete="new-password" minLength={8} placeholder="Ít nhất 8 ký tự" required /></label>
          <label htmlFor="ft-reset-confirm">Xác nhận mật khẩu mới<input id="ft-reset-confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label>
        </>}
        {error && <p className="ft-auth-error" role="alert">{error}</p>}
        <button className="ft-button ft-primary ft-submit" disabled={busy}>{busy ? 'Đang xử lý…' : reset ? 'Đặt lại mật khẩu' : 'Xác minh và tiếp tục'}</button>
      </fieldset>
    </form>
    {message && <p className="ft-free-note" role="status">{message}</p>}
    <p className="ft-free-note">Mã có hiệu lực 10 phút. Xin mã mới sẽ thay mã cũ; nhập sai 5 lần cần xin mã mới.</p>
    <div className="ft-auth-alternatives">
      <button className="ft-auth-text-action" disabled={busy || cooldown > 0} onClick={resend}>Gửi lại mã{cooldown > 0 ? ` (${cooldown}s)` : ''}</button>
      <button className="ft-auth-text-action" disabled={busy} onClick={onBack}>Quay lại đăng nhập</button>
    </div>
  </section>
}
