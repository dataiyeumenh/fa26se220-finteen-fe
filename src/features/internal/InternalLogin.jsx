import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useInternal } from './hooks'
import { DEMO_ACCOUNTS, DEMO_PASSWORD, loginInternal } from './store'
import { STAFF_ROLES } from './model'
import './internal.css'

export default function InternalLogin() {
  const { actor } = useInternal()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (actor) return <Navigate to="/internal" replace/>
  return <main className="studio-login"><section className="studio-login-story"><Link to="/" className="studio-logo">f. <b>finteen</b></Link><span className="studio-eyebrow">CONTENT STUDIO</span><h1>Mỗi câu chuyện hay<br/>bắt đầu từ đội ngũ.</h1><p>Biên tập, kiểm duyệt và phát hành trong một không gian chung. Mỗi vai có trách nhiệm và phạm vi riêng.</p><div className="studio-flow"><span>01<br/><b>Biên tập</b></span><span>02<br/><b>Kiểm duyệt</b></span><span>03<br/><b>Phát hành</b></span></div><small>Admin theo dõi toàn bộ quy trình với quyền chỉ đọc.</small></section><section className="studio-login-panel"><ShieldCheck size={34}/><h2>Đăng nhập nội bộ</h2><p>Dùng tài khoản được cấp. Vai được xác định từ tài khoản.</p><form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { await loginInternal({ email, password }) } catch (err) { setError(err.message) } finally { setBusy(false) } }}><fieldset disabled={busy}><label>Email nội bộ<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ten@finteen.demo"/></label><label>Mật khẩu<input type={visible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}/></label><button type="button" className="studio-password-toggle" aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</button>{error && <p className="studio-error" role="alert">{error}</p>}<button className="studio-login-submit" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Vào không gian làm việc'}<ArrowRight size={18}/></button></fieldset></form><details className="studio-demo-accounts"><summary>Tài khoản demo để thử quy trình</summary><p>Mật khẩu chung: <code>{DEMO_PASSWORD}</code></p><div>{DEMO_ACCOUNTS.map(account => <button type="button" disabled={busy} key={account.id} onClick={() => { setEmail(account.email); setPassword(DEMO_PASSWORD); setError('') }}><b>{STAFF_ROLES[account.role]}</b><small>{account.email}</small></button>)}</div><small>Chọn một thẻ để điền thông tin, sau đó bấm đăng nhập. Dữ liệu mẫu được tạo lần đầu; không ghi đè dữ liệu đã lưu.</small></details><Link to="/login">Đăng nhập Parent / Teacher / Kid →</Link></section></main>
}
