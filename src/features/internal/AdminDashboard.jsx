import { useEffect, useState } from 'react'
import { BadgeDollarSign, CheckCircle2, CreditCard, Gift, LogOut, RefreshCw, Save, ShieldCheck, Users } from 'lucide-react'
import { auth } from '../../api/auth.api'
import { useWorkspace } from '../workspace/useWorkspace'
import './admin.css'
import './admin-modern.css'

const PLAN_KINDS = ['PARENT', 'TEACHER']
const STATUS_LABELS = { PENDING: 'Chờ thanh toán', PAID: 'Đã thanh toán', FAILED: 'Thất bại' }
const TABS = [
  ['plans', 'Bảng giá', BadgeDollarSign],
  ['transactions', 'Giao dịch', CreditCard],
  ['grant', 'Cấp gói', Gift],
]
const money = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value || 0))
const dateTime = value => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—'

// TODO(REMOVE-ADMIN-MOCK): Xóa các dữ liệu và thông báo mock bên dưới khi backend cung cấp API tương ứng.
const MOCK_TRANSACTIONS = [
  { orderCode: 'FT26100701', email: 'minh.anh@gmail.com', accountId: 'acc-demo-01', kind: 'PARENT', amount: 299000, status: 'PAID', purpose: 'NEW', createdAt: '2026-10-07T08:42:00+07:00', paidAt: '2026-10-07T08:45:00+07:00', isMock: true },
  { orderCode: 'FT26100702', email: 'thay.nam@school.edu.vn', accountId: 'acc-demo-02', kind: 'TEACHER', amount: 899000, status: 'PENDING', purpose: 'RENEW', createdAt: '2026-10-07T09:18:00+07:00', isMock: true },
  { orderCode: 'FT26100608', email: 'ngoc.lan@gmail.com', accountId: 'acc-demo-03', kind: 'PARENT', amount: 299000, status: 'PAID', purpose: 'RENEW', createdAt: '2026-10-06T15:30:00+07:00', paidAt: '2026-10-06T15:33:00+07:00', isMock: true },
  { orderCode: 'FT26100604', email: 'co.ha@school.edu.vn', accountId: 'acc-demo-04', kind: 'TEACHER', amount: 899000, status: 'FAILED', purpose: 'NEW', createdAt: '2026-10-06T10:05:00+07:00', isMock: true },
  { orderCode: 'FT26100511', email: 'hoang.pham@gmail.com', accountId: 'acc-demo-05', kind: 'PARENT', amount: 299000, status: 'PAID', purpose: 'NEW', createdAt: '2026-10-05T20:12:00+07:00', paidAt: '2026-10-05T20:14:00+07:00', isMock: true },
  { orderCode: 'FT26100507', email: 'mai.tran@gmail.com', accountId: 'acc-demo-06', kind: 'PARENT', amount: 299000, status: 'PENDING', purpose: 'NEW', createdAt: '2026-10-05T14:21:00+07:00', isMock: true },
]

const MOCK_GRANTS = [
  { id: 1, email: 'demo.parent@finteen.vn', kind: 'PARENT', months: 3, reason: 'Tài khoản trải nghiệm cho phụ huynh', by: 'Nguyễn Minh', at: '2026-10-07T08:30:00+07:00' },
  { id: 2, email: 'teacher.hoa@school.edu.vn', kind: 'TEACHER', months: 6, reason: 'Đồng hành chương trình thí điểm tại trường', by: 'Nguyễn Minh', at: '2026-10-06T16:10:00+07:00' },
  { id: 3, email: 'support.case@finteen.vn', kind: 'PARENT', months: 1, reason: 'Bù thời gian gián đoạn dịch vụ', by: 'Lê An', at: '2026-10-05T09:45:00+07:00' },
  { id: 4, email: 'workshop@school.edu.vn', kind: 'TEACHER', months: 3, reason: 'Tài khoản phục vụ workshop giáo viên', by: 'Lê An', at: '2026-10-03T13:20:00+07:00' },
]

function SummaryCards({ items }) {
  return <div className="admin-summary-grid">{items.map(({ label, value, note, Icon = CheckCircle2, tone = '' }) => <article className={`admin-card admin-summary-card ${tone}`} key={label}><span><Icon size={18}/>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>
}

function Notice({ type = 'info', children }) {
  return children ? <div className={`admin-notice ${type}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div> : null
}

function MockNotice({ children }) {
  return <div className="admin-mock-notice" role="note"><strong>Dữ liệu minh họa (mock)</strong><span>{children} Phần này cần được xóa khi API tương ứng hoàn thiện.</span></div>
}

function PlansTab() {
  const [plans, setPlans] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')
  const [notice, setNotice] = useState(null)
  const load = async () => {
    setLoading(true); setNotice(null)
    try { setPlans(Object.fromEntries(((await auth.listPlans()) || []).map(plan => [plan.kind, plan]))) }
    catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setLoading(false) }
  }
  // Loading remote data is the synchronization performed by this effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [])
  const save = async (event, kind) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSaving(kind); setNotice(null)
    try {
      const result = await auth.setPlanPrice(kind, Number(form.get('price')), Number(form.get('months')))
      setPlans(current => ({ ...current, [kind]: result }))
      setNotice({ type: 'success', text: `Đã cập nhật gói ${kind}. Bảng giá công khai có hiệu lực ngay.` })
    } catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setSaving('') }
  }
  return <>
    <header className="admin-heading"><div><span>QUẢN LÝ GÓI</span><h1>Bảng giá</h1><p>Giá mới chỉ áp dụng cho giao dịch được tạo sau khi cập nhật.</p></div><button className="admin-secondary" onClick={() => void load()} disabled={loading}><RefreshCw size={17}/> Làm mới</button></header>
    <Notice type={notice?.type}>{notice?.text}</Notice>
    {!loading && <><MockNotice>Hai chỉ số “Tài khoản có gói”, “Tỷ lệ gia hạn” và bảng so sánh quyền lợi chưa có API.</MockNotice><SummaryCards items={[{ label: 'Gói đang mở', value: Object.keys(plans).length || 2, note: 'Phụ huynh và Giáo viên', Icon: BadgeDollarSign }, { label: 'Tài khoản có gói', value: '1.248', note: '+8,4% so với tháng trước', Icon: Users, tone: 'green' }, { label: 'Tỷ lệ gia hạn', value: '78,6%', note: 'Trong 30 ngày gần nhất', Icon: RefreshCw, tone: 'purple' }]}/></>} 
    {loading ? <div className="admin-loading">Đang tải bảng giá…</div> : <div className="admin-plan-grid">{PLAN_KINDS.map(kind => {
      const plan = plans[kind]
      return <form className={`admin-card admin-plan-card ${kind.toLowerCase()}`} key={`${kind}-${plan?.updatedAt || 'new'}`} onSubmit={event => void save(event, kind)}>
        <div className="admin-card-title"><div className={`admin-plan-icon ${kind.toLowerCase()}`}><BadgeDollarSign/></div><div><small>GÓI {kind}</small><h2>{kind === 'PARENT' ? 'Phụ huynh' : 'Giáo viên'}</h2></div></div>
        <div className="admin-plan-summary"><span>{plan ? 'Giá đang áp dụng' : 'Thiết lập gói học'}</span><div><strong>{plan ? money(plan.price) : 'Chưa mở bán'}</strong>{plan && <small>/ {plan.months} tháng</small>}</div><p>{kind === 'PARENT' ? 'Dành cho phụ huynh đồng hành cùng con.' : 'Dành cho giáo viên tổ chức lớp học.'}</p></div>
        <label>Giá bán (VND)<input name="price" type="number" min="1" step="1" required defaultValue={plan?.price || ''} placeholder="99000"/></label>
        <label>Thời hạn (tháng)<input name="months" type="number" min="1" max="120" required defaultValue={plan?.months || 3}/></label>
        <p className="admin-meta">{plan ? `Cập nhật gần nhất: ${dateTime(plan.updatedAt)}` : 'Lưu lần đầu để gói xuất hiện ở trang mua gói.'}</p>
        <button className="admin-primary" disabled={Boolean(saving)}><Save size={17}/>{saving === kind ? 'Đang lưu…' : 'Lưu bảng giá'}</button>
      </form>
    })}</div>}
    {!loading && <section className="admin-card admin-table-card admin-section"><div className="admin-section-heading"><div><h2>So sánh quyền lợi gói</h2><p>Nội dung tổng hợp dùng để kiểm tra nhanh trước khi cập nhật bảng giá.</p></div><span className="admin-demo-label">DỮ LIỆU MẪU</span></div><div className="admin-table-wrap"><table><thead><tr><th>Gói</th><th>Đối tượng</th><th>Số hồ sơ</th><th>Lớp học</th><th>Báo cáo</th><th>Hỗ trợ</th></tr></thead><tbody><tr><td><span className="admin-chip">PARENT</span></td><td>Gia đình</td><td><strong>4 trẻ</strong></td><td>—</td><td>Tiến độ tuần</td><td>Email</td></tr><tr><td><span className="admin-chip purple">TEACHER</span></td><td>Giáo viên / trường học</td><td><strong>40 học sinh</strong></td><td>Không giới hạn</td><td>Lớp & bài kiểm tra</td><td>Ưu tiên</td></tr></tbody></table></div></section>}
  </>
}

function TransactionsTab() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [reconciling, setReconciling] = useState('')
  const [notice, setNotice] = useState(null)
  const size = 20
  const load = async (nextPage = page, nextStatus = status) => {
    setLoading(true); setNotice(null)
    try { setRows(await auth.listAdminTransactions({ status: nextStatus, page: nextPage, size }) || []) }
    catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setLoading(false) }
  }
  // Pagination and filtering intentionally trigger a fresh server request.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { void load(page, status) }, [page, status])
  const visibleRows = rows.length ? rows : MOCK_TRANSACTIONS.filter(row => !status || row.status === status)
  const paidRows = visibleRows.filter(row => row.status === 'PAID')
  const reconcile = async orderCode => {
    setReconciling(String(orderCode)); setNotice(null)
    try {
      const result = await auth.reconcileTransaction(orderCode)
      setRows(current => current.map(row => String(row.orderCode) === String(orderCode) ? { ...row, ...result } : row))
      setNotice({ type: 'success', text: `Đã đối soát đơn ${orderCode}: ${STATUS_LABELS[result.status] || result.status}.` })
    } catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setReconciling('') }
  }
  return <>
    <header className="admin-heading"><div><span>THANH TOÁN</span><h1>Giao dịch</h1><p>Danh sách mới nhất trước. Đối soát dùng khi nghi webhook PayOS chưa tới.</p></div><button className="admin-secondary" onClick={() => void load()} disabled={loading}><RefreshCw size={17}/> Làm mới</button></header>
    {!loading && !rows.length && <MockNotice>API chưa trả về giao dịch phù hợp nên bảng và các chỉ số bên dưới đang dùng dữ liệu mẫu.</MockNotice>}
    {!loading && <SummaryCards items={[{ label: 'Tổng giao dịch', value: visibleRows.length, note: 'Danh sách đang hiển thị', Icon: CreditCard }, { label: 'Đã thanh toán', value: paidRows.length, note: `${money(paidRows.reduce((sum, row) => sum + Number(row.amount), 0))} ghi nhận`, Icon: CheckCircle2, tone: 'green' }, { label: 'Chờ xử lý', value: visibleRows.filter(row => row.status === 'PENDING').length, note: 'Cần tiếp tục theo dõi', Icon: RefreshCw, tone: 'purple' }]}/>} 
    <div className="admin-filter"><label>Trạng thái<select value={status} onChange={event => { setPage(0); setStatus(event.target.value) }}><option value="">Tất cả</option><option value="PENDING">Chờ thanh toán</option><option value="PAID">Đã thanh toán</option><option value="FAILED">Thất bại</option></select></label>{!rows.length && !loading && <span className="admin-demo-label">ĐANG HIỂN THỊ DỮ LIỆU MẪU</span>}</div>
    <Notice type={notice?.type}>{notice?.text}</Notice>
    <section className="admin-card admin-table-card">{loading ? <div className="admin-loading">Đang tải giao dịch…</div> : visibleRows.length ? <div className="admin-table-wrap"><table><thead><tr><th>Đơn hàng</th><th>Khách hàng</th><th>Gói</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th><th></th></tr></thead><tbody>{visibleRows.map(row => <tr key={row.orderCode}><td><strong>{row.orderCode}</strong><small>{row.purpose === 'RENEW' ? 'Gia hạn' : 'Mua mới'}</small></td><td>{row.email}<small>{row.accountId}</small></td><td><span className={`admin-chip ${row.kind === 'TEACHER' ? 'purple' : ''}`}>{row.kind}</span></td><td><strong>{money(row.amount)}</strong></td><td><span className={`admin-status ${String(row.status).toLowerCase()}`}>{STATUS_LABELS[row.status] || row.status}</span></td><td>{dateTime(row.createdAt)}<small>{row.paidAt ? `Thanh toán: ${dateTime(row.paidAt)}` : 'Chưa thanh toán'}</small></td><td>{row.status === 'PENDING' && <button className="admin-secondary compact" disabled={row.isMock || Boolean(reconciling)} title={row.isMock ? 'Dữ liệu mẫu không thể đối soát' : ''} onClick={() => void reconcile(row.orderCode)}><RefreshCw size={15}/>{reconciling === String(row.orderCode) ? 'Đang đối soát…' : 'Đối soát'}</button>}</td></tr>)}</tbody></table></div> : <div className="admin-empty">Không có giao dịch phù hợp.</div>}</section>
    <div className="admin-pagination"><button className="admin-secondary" disabled={loading || page === 0} onClick={() => setPage(value => value - 1)}>← Trang trước</button><span>Trang {page + 1}</span><button className="admin-secondary" disabled={loading || rows.length < size} onClick={() => setPage(value => value + 1)}>Trang sau →</button></div>
  </>
}

function GrantTab() {
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [grants, setGrants] = useState(MOCK_GRANTS)
  const submit = async event => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setBusy(true); setNotice(null)
    try {
      await auth.grantEntitlement({ accountId: form.get('accountId'), kind: form.get('kind'), months: Number(form.get('months')), reason: form.get('reason') })
      setGrants(current => [{ id: Date.now(), email: String(form.get('accountId')).slice(0, 12) + '…', kind: form.get('kind'), months: Number(form.get('months')), reason: form.get('reason'), by: 'Quản trị viên', at: new Date().toISOString() }, ...current])
      setNotice({ type: 'success', text: 'Đã cấp gói thành công. Quyền của tài khoản được cập nhật ngay.' })
      formElement.reset()
    } catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setBusy(false) }
  }
  return <>
    <header className="admin-heading"><div><span>HỖ TRỢ TÀI KHOẢN</span><h1>Cấp gói thủ công</h1><p>Dùng cho tài khoản trải nghiệm hoặc đền bù. Mỗi lần cấp đều cần ghi rõ lý do.</p></div></header>
    <Notice type={notice?.type}>{notice?.text}</Notice>
    <MockNotice>Backend mới hỗ trợ thao tác cấp gói, chưa có API thống kê và lịch sử cấp gói.</MockNotice>
    <SummaryCards items={[{ label: 'Đã cấp tháng này', value: 18, note: '12 Parent · 6 Teacher', Icon: Gift }, { label: 'Sắp hết hạn', value: 5, note: 'Trong 7 ngày tới', Icon: RefreshCw, tone: 'purple' }, { label: 'Tỷ lệ đang hoạt động', value: '94%', note: '17/18 tài khoản', Icon: CheckCircle2, tone: 'green' }]}/>
    <div className="admin-grant-layout"><form className="admin-card admin-form" onSubmit={event => void submit(event)}>
      <label>Account ID<input name="accountId" required pattern="[0-9a-fA-F-]{36}" placeholder="UUID của tài khoản"/><small>Người dùng lấy ID của mình từ thông tin tài khoản (`/api/auth/me`).</small></label>
      <div className="admin-form-row"><label>Loại gói<select name="kind" defaultValue="PARENT"><option value="PARENT">PARENT — Phụ huynh</option><option value="TEACHER">TEACHER — Giáo viên</option></select></label><label>Số tháng<input name="months" type="number" min="1" max="36" defaultValue="3" required/></label></div>
      <label>Lý do cấp gói<textarea name="reason" required maxLength="500" placeholder="Ví dụ: Tài khoản dùng thử cho buổi demo…"/></label>
      <button className="admin-primary" disabled={busy}><Gift size={17}/>{busy ? 'Đang cấp gói…' : 'Xác nhận cấp gói'}</button>
    </form><aside className="admin-card admin-help"><ShieldCheck/><h2>Lưu ý an toàn</h2><ul><li>Kiểm tra chính xác Account ID trước khi cấp.</li><li>Thời hạn cho phép từ 1 đến 36 tháng.</li><li>Backend chưa có API tìm tài khoản theo email, nên màn hình này không giả lập chức năng tìm kiếm.</li><li>Quyền có hiệu lực ngay, người dùng không cần đăng nhập lại.</li></ul></aside></div>
    <section className="admin-card admin-table-card admin-section"><div className="admin-section-heading"><div><h2>Lịch sử cấp gói gần đây</h2><p>Theo dõi tài khoản, thời hạn và lý do hỗ trợ.</p></div><span className="admin-demo-label">DỮ LIỆU MẪU</span></div><div className="admin-table-wrap"><table><thead><tr><th>Tài khoản</th><th>Gói</th><th>Thời hạn</th><th>Lý do</th><th>Người thực hiện</th><th>Thời gian</th></tr></thead><tbody>{grants.map(row => <tr key={row.id}><td><strong>{row.email}</strong></td><td><span className={`admin-chip ${row.kind === 'TEACHER' ? 'purple' : ''}`}>{row.kind}</span></td><td><strong>{row.months} tháng</strong></td><td>{row.reason}</td><td>{row.by}</td><td>{dateTime(row.at)}</td></tr>)}</tbody></table></div></section>
  </>
}

export default function AdminDashboard() {
  const { actor } = useWorkspace()
  const [tab, setTab] = useState('plans')
  const content = tab === 'transactions' ? <TransactionsTab/> : tab === 'grant' ? <GrantTab/> : <PlansTab/>
  return <div className="admin-shell"><aside className="admin-sidebar"><a className="admin-brand" href="/"><b>f.</b><span>finteen<small>ADMIN CONSOLE</small></span></a><div className="admin-user"><ShieldCheck/><div><strong>{actor?.displayName || actor?.name || 'Quản trị viên'}</strong><small>{actor?.email}</small></div></div><nav aria-label="Điều hướng quản trị">{TABS.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={19}/>{label}</button>)}</nav><button className="admin-logout" onClick={() => auth.logout()}><LogOut size={18}/> Đăng xuất</button></aside><main className="admin-main"><div className="admin-topbar"><span>Hệ thống quản trị FinTeen</span><span className="admin-admin-badge"><ShieldCheck size={15}/> ADMIN</span></div><div className="admin-content">{content}</div></main></div>
}
