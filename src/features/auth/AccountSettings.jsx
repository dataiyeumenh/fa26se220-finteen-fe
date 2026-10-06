import { useState } from 'react'
import { auth } from '../../api/auth.api'
import { googleIdToken, googleReady } from '../../api/firebase'

export default function AccountSettings({ actor }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  async function change(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setMessage(''); setError(''); setBusy(true)
    try {
      if (data.get('newPassword') !== data.get('confirm')) throw new Error('Mật khẩu xác nhận chưa khớp.')
      await auth.changePassword(data.get('oldPassword'), data.get('newPassword'))
      form.reset(); setMessage('Đã đổi mật khẩu và cập nhật phiên mới. Các phiên cũ không còn hiệu lực.')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  async function link() {
    setBusy(true); setMessage(''); setError('')
    try { await auth.linkGoogle(await googleIdToken()); setMessage('Đã liên kết Google. Lần sau bạn có thể đăng nhập bằng Google.') }
    catch (err) { setError(err.code === 3021 ? 'Google này đã liên kết với tài khoản FinTeen khác. Hãy chọn tài khoản Google khác.' : err.message) }
    finally { setBusy(false) }
  }
  return <section className="ws-card">
    <h1>Tài khoản của bạn</h1><p>{actor.name} · {actor.email}</p>
    <p>Gói hiện có: {actor.plans.map(p => p === 'parent' ? 'Gia đình' : 'Giáo viên').join(' + ') || 'Chưa có gói'}</p>
    <p>Thông tin và quyền được lấy từ máy chủ. API cập nhật tên chưa được cung cấp.</p>
    <h2>Đổi mật khẩu</h2><form className="ws-form" onSubmit={change}><fieldset disabled={busy}>
      <label>Mật khẩu hiện tại<input name="oldPassword" type="password" autoComplete="current-password" required /></label>
      <label>Mật khẩu mới<input name="newPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
      <label>Xác nhận mật khẩu mới<input name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label>
      <button className="ws-btn primary" disabled={busy}>{busy ? 'Đang xử lý…' : 'Đổi mật khẩu'}</button>
    </fieldset></form>
    <p>Tài khoản chỉ dùng Google chưa có mật khẩu để đổi bằng chức năng này.</p>
    <h2>Liên kết Google</h2><p>Chọn Google bạn sở hữu. Email Google có thể khác email FinTeen.</p>
    <button className="ws-btn" disabled={busy || !googleReady} onClick={link}>Liên kết Google</button>
    {!googleReady && <p>Đang chờ cấu hình Firebase.</p>}
    {message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}
  </section>
}
