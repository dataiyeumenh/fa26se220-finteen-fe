import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, CheckCircle2, Clock3, Copy, RefreshCw, X, XCircle } from 'lucide-react'
import QRCode from 'qrcode'
import { auth } from '../../api/auth.api'
import './workspace.css'

const POLL_MS = 2500
const money = value => new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + 'đ'

export default function PaymentResult({ payment: initialPayment, onClose }) {
  const [payment, setPayment] = useState({ ...initialPayment, status: initialPayment?.status || 'PENDING' })
  const [qrImage, setQrImage] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [copied, setCopied] = useState('')
  const [now, setNow] = useState(null)
  const timer = useRef(null)
  const terminal = payment.status === 'PAID' || payment.status === 'FAILED'
  const expiresAt = useMemo(() => Date.parse(payment.expiresAt || ''), [payment.expiresAt])
  const secondsLeft = Number.isFinite(expiresAt) && now !== null ? Math.max(0, Math.ceil((expiresAt - now) / 1000)) : null
  const countdown = secondsLeft === null ? '' : `${String(Math.floor(secondsLeft / 3600)).padStart(2, '0')}:${String(Math.floor(secondsLeft % 3600 / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  useEffect(() => {
    let active = true
    QRCode.toDataURL(initialPayment.qrCode, { width: 320, margin: 2, errorCorrectionLevel: 'M' })
      .then(url => { if (active) setQrImage(url) })
      .catch(() => { if (active) setError('Không thể tạo hình QR. Bạn vẫn có thể chuyển khoản bằng thông tin bên dưới.') })
    return () => { active = false }
  }, [initialPayment.qrCode])

  const check = useCallback(async (manual = false) => {
    if (manual) setChecking(true)
    try {
      const latest = await auth.getPayment(initialPayment.orderCode)
      setPayment(current => ({ ...current, ...latest }))
      setError('')
      if (latest.status === 'PAID') {
        await auth.refresh()
        await auth.ensureEntitlements({ force: true })
      }
      return latest.status
    } catch (checkError) {
      setError(checkError.message)
      return 'ERROR'
    } finally { if (manual) setChecking(false) }
  }, [initialPayment.orderCode])

  useEffect(() => {
    let active = true
    const poll = async () => {
      const status = await check()
      if (active && status !== 'PAID' && status !== 'FAILED') timer.current = window.setTimeout(poll, POLL_MS)
    }
    timer.current = window.setTimeout(poll, POLL_MS)
    return () => { active = false; if (timer.current) window.clearTimeout(timer.current) }
  }, [check])

  useEffect(() => {
    if (terminal) return undefined
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0)
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => { window.clearTimeout(initialTick); window.clearInterval(id) }
  }, [terminal])

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(String(value)); setCopied(label)
      window.setTimeout(() => setCopied(''), 1500)
    } catch { setError('Không thể sao chép tự động. Vui lòng chọn và sao chép thủ công.') }
  }

  const cancel = async () => {
    setCancelling(true); setError('')
    try {
      await auth.cancelPayment(payment.orderCode, 'Người dùng hủy trên màn hình thanh toán')
      setPayment(current => ({ ...current, status: 'FAILED' }))
    } catch (cancelError) {
      if (cancelError.code === 4006) await check(true)
      else setError(cancelError.message)
    } finally { setCancelling(false) }
  }

  if (payment.status === 'PAID') return <section className="payment-checkout payment-terminal success" role="status"><CheckCircle2/><h2>Thanh toán thành công</h2><p>Gói học tập đã được cập nhật vào tài khoản của bạn.</p><button className="ws-btn primary" onClick={onClose}>Hoàn tất</button></section>
  if (payment.status === 'FAILED') return <section className="payment-checkout payment-terminal failed" role="status"><XCircle/><h2>Giao dịch chưa thành công</h2><p>Đơn đã bị hủy, hết hạn hoặc không thể hoàn tất. Bạn có thể đóng cửa sổ và tạo đơn mới.</p><button className="ws-btn primary" onClick={onClose}>Quay lại bảng giá</button></section>

  return <section className="payment-checkout" aria-labelledby="payment-title">
    <div className="payment-checkout-head"><div><span className="payment-eyebrow">THANH TOÁN FINTEEN</span><h2 id="payment-title">Quét mã để thanh toán</h2></div><button className="payment-close" onClick={onClose} aria-label="Đóng"><X/></button></div>
    <p className="payment-hint">Dùng ứng dụng ngân hàng quét VietQR. Hệ thống sẽ tự xác nhận sau khi nhận được tiền.</p>
    <div className="payment-checkout-grid">
      <div className="payment-qr-wrap">{qrImage ? <img src={qrImage} alt="Mã VietQR thanh toán"/> : <div className="payment-qr-loading">Đang tạo mã QR…</div>}<strong>{money(payment.amount)}</strong>{countdown && <span><Clock3 size={15}/> QR còn hiệu lực {countdown}</span>}</div>
      <div className="payment-bank"><h3>Chuyển khoản thủ công</h3>{[['Ngân hàng (BIN)', payment.bin], ['Số tài khoản', payment.accountNumber], ['Chủ tài khoản', payment.accountName], ['Nội dung', payment.description]].map(([label, value]) => <div className="payment-bank-row" key={label}><span>{label}</span><strong>{value || '—'}</strong>{value && <button onClick={() => void copy(label, value)} aria-label={`Sao chép ${label}`}>{copied === label ? <Check/> : <Copy/>}</button>}</div>)}
        <div className="payment-bank-row"><span>Mã đơn</span><strong>{payment.orderCode}</strong><button onClick={() => void copy('Mã đơn', payment.orderCode)} aria-label="Sao chép mã đơn">{copied === 'Mã đơn' ? <Check/> : <Copy/>}</button></div>
      </div>
    </div>
    {error && <p className="ws-notice" role="alert">{error}</p>}
    <div className="payment-waiting"><span className="payment-pulse"/><span>Đang chờ thanh toán</span></div>
    <div className="payment-actions"><button className="ws-btn" onClick={() => void check(true)} disabled={checking || cancelling}><RefreshCw size={16}/>{checking ? 'Đang kiểm tra…' : 'Kiểm tra ngay'}</button><button className="ws-btn danger" onClick={() => void cancel()} disabled={checking || cancelling}>{cancelling ? 'Đang hủy…' : 'Hủy giao dịch'}</button></div>
  </section>
}
