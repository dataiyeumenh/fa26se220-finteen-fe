import { useEffect, useId, useState } from "react";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, BadgeDollarSign, CalendarDays, Check, ChevronRight, RefreshCw, ShieldCheck, UserRound, UserPlus, Users } from "lucide-react";
import { adminDashboardApi as api } from "../api/adminDashboardApi";
import { loadRecentAccounts, revenueSeries, vietnamDateKey } from "../api/adminOverviewData";
import "../styles/admin-overview.css";

const number = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));
const money = (value) => `${number(value)} ₫`;
const compactMoney = (value) => new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const dateLabel = (date) => new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit" }).format(date);
const roleLabels = { ADMIN: "Quản trị viên", GAME_EDITOR: "Biên tập viên", GAME_REVIEWER: "Kiểm duyệt viên", GAME_MANAGER: "Quản lý nội dung" };

function RevenueChart({ refreshKey }) {
  const [days, setDays] = useState(30);
  const [result, setResult] = useState({ loading: true });
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState(null);
  const gradientId = useId();
  useEffect(() => {
    let active = true;
    const to = new Date();
    const from = new Date(to.getTime() - (days - 1) * 86400000);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult({ loading: true });
    api.getAdminTransactionStats({ from: vietnamDateKey(from), to: vietnamDateKey(to) })
      .then((stats) => {
        if (!active) return;
        const points = revenueSeries(stats, days, to);
        setResult({ stats, points, loading: false });
        setSelected(null);
      })
      .catch(() => { if (active) setResult({ error: "Chưa tải được biểu đồ. Hãy thử làm mới.", loading: false }); });
    return () => { active = false; };
  }, [days, refreshKey, retry]);
  const points = result.points || [];
  const selectedPoint = points[selected];
  const min = Math.min(0, ...points.map((point) => point.amount));
  const max = Math.max(1, ...points.map((point) => point.amount));
  const y = (amount) => 170 - ((amount - min) / (max - min)) * 150;
  const x = (index) => 65 + index / Math.max(1, points.length - 1) * 625;
  const line = points.map((point, index) => `${index ? "L" : "M"}${x(index)},${y(point.amount)}`).join(" ");
  const hasRevenue = points.some((point) => point.amount !== 0);
  return <section className="saas-panel saas-revenue">
    <div className="saas-panel-heading"><div><h2>Doanh thu đã thanh toán</h2><p>Tiền từ các giao dịch thanh toán thành công theo ngày</p></div><div className="saas-periods" role="group" aria-label="Khoảng thời gian doanh thu">{[7, 30, 90].map((value) => <button key={value} aria-pressed={days === value} onClick={() => setDays(value)}>{value} ngày</button>)}</div></div>
    {result.loading ? <div className="saas-chart-placeholder" role="status"><RefreshCw size={22} className="saas-spin"/>Đang tải doanh thu…</div> : result.error ? <div className="saas-chart-placeholder" role="alert">{result.error}<button className="saas-text-button" onClick={() => setRetry((value) => value + 1)}>Thử lại</button></div> : <>
      <div className="saas-revenue-total"><strong>{money(result.stats?.paidAmount)}</strong><span><i/>Đã thanh toán · {days} ngày</span></div>
      <div className="saas-chart-detail" aria-live="polite">{selectedPoint ? `${dateLabel(selectedPoint.date)}: ${money(selectedPoint.amount)}` : hasRevenue ? "Di chuột, chạm hoặc dùng phím mũi tên để xem từng ngày" : `Chưa có giao dịch thanh toán trong ${days} ngày qua`}</div>
      <svg className="saas-chart" viewBox="0 0 720 215" role="img" tabIndex={0} aria-label={`Biểu đồ doanh thu đã thanh toán ${days} ngày, tổng ${money(result.stats?.paidAmount)}. Dùng phím mũi tên để xem từng ngày.`} onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); setSelected((current) => Math.max(0, Math.min(days - 1, (current ?? -1) + (event.key === "ArrowRight" ? 1 : -1)))); } }}>
        <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10a88a" stopOpacity=".18"/><stop offset="100%" stopColor="#10a88a" stopOpacity=".01"/></linearGradient></defs>
        {[0, 1, 2, 3].map((tick) => { const value = min + (max - min) * tick / 3; return <g key={tick}><line x1="65" x2="690" y1={y(value)} y2={y(value)} stroke="#e9eef0" strokeDasharray="4 5"/><text x="53" y={y(value) + 4} textAnchor="end">{compactMoney(value)}</text></g>; })}
        <path d={`${line} L690,${y(0)} L65,${y(0)} Z`} fill={`url(#${gradientId})`}/><path d={line} fill="none" stroke="#119b7e" strokeWidth="2.5" strokeLinejoin="round"/>
        {selectedPoint && <g><line x1={x(selected)} x2={x(selected)} y1="20" y2="170" stroke="#97cbbd" strokeDasharray="3 3"/><circle cx={x(selected)} cy={y(selectedPoint.amount)} r="4" fill="#119b7e" stroke="white" strokeWidth="2"/></g>}
        {points.map((point, index) => <rect key={index} x={x(index) - 625 / (points.length - 1) / 2} y="10" width={625 / (points.length - 1)} height="175" fill="transparent" onMouseEnter={() => setSelected(index)} onClick={() => setSelected(index)}><title>{dateLabel(point.date)}: {money(point.amount)}</title></rect>)}
        {[0, Math.floor((points.length - 1) / 3), Math.floor((points.length - 1) * 2 / 3), points.length - 1].map((index) => <text key={index} x={x(index)} y="204" textAnchor="middle">{dateLabel(points[index].date)}</text>)}
      </svg>
      <div className="saas-revenue-footer"><span><ArrowDownLeft size={15}/>Tổng đã thanh toán <b>{money(result.stats?.paidAmount)}</b></span><span>Chưa trừ hoàn tiền · Không phải lợi nhuận</span></div>
    </>}
  </section>;
}

function RecentAccounts({ refreshKey, onNavigate }) {
  const [state, setState] = useState({ loading: true });
  const [retry, setRetry] = useState(0);
  const [visible, setVisible] = useState(5);
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ loading: true });
    loadRecentAccounts(api, { isActive: () => active })
      .then((accounts) => { if (active) { setState({ accounts, loading: false }); setVisible(5); } })
      .catch(() => { if (active) setState({ error: "Không tải được tài khoản mới trong 7 ngày gần nhất.", loading: false }); });
    return () => { active = false; };
  }, [refreshKey, retry]);
  return <section className="saas-panel saas-recent-accounts">
    <div className="saas-panel-heading"><div><h2><UserPlus size={17}/>Tài khoản mới trong 7 ngày{state.accounts && <span className="saas-recent-accounts-count">{number(state.accounts.length)}</span>}</h2><p>Hôm nay và 6 ngày trước · Giờ Việt Nam (GMT+7)</p></div><button className="saas-text-button" onClick={() => onNavigate?.("accounts")}>Quản lý tài khoản<ArrowRight size={15}/></button></div>
    {state.loading ? <div className="saas-empty" role="status">Đang tải tài khoản mới…</div> : state.error ? <div className="saas-empty" role="alert">{state.error}<button className="saas-text-button" onClick={() => setRetry((value) => value + 1)}>Thử lại</button></div> : state.accounts.length ? <>
      <div className="saas-table-wrap"><table><thead><tr><th>Tài khoản</th><th>Email</th><th>Gói hiện có</th><th>Đăng ký lúc</th></tr></thead><tbody>{state.accounts.slice(0, visible).map((account) => <tr key={account.id}><td><div className="saas-person"><span>{(account.displayName || account.email || "?").charAt(0).toUpperCase()}</span><b>{account.displayName || "Chưa đặt tên"}</b></div></td><td>{account.email}</td><td>{account.plans?.length ? account.plans.map((plan) => plan === "PARENT" ? "Phụ huynh" : plan === "TEACHER" ? "Giáo viên" : plan).join(", ") : "Chưa có gói"}</td><td>{new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "short", timeStyle: "short" }).format(new Date(account.createdAt))}</td></tr>)}</tbody></table></div>
      <div className="saas-activity-footer"><span>Hiển thị {Math.min(visible, state.accounts.length)}/{number(state.accounts.length)} tài khoản mới</span>{visible < state.accounts.length && <button className="saas-text-button" onClick={() => setVisible((value) => value + 5)}>Xem thêm<ChevronRight size={14}/></button>}</div>
    </> : <div className="saas-empty"><UserPlus size={27}/><strong>Chưa có tài khoản mới trong 7 ngày gần nhất</strong><p>Tài khoản mới đăng ký sẽ xuất hiện tại đây.</p></div>}
  </section>;
}

function AccountBreakdown({ accounts, onNavigate }) {
  const total = Number(accounts?.total || 0);
  const parents = Math.min(total, Math.max(0, Number(accounts?.parents || 0)));
  const teachers = Math.min(total - parents, Math.max(0, Number(accounts?.teachers || 0)));
  const other = total - parents - teachers;
  const segments = [["Phụ huynh", parents, "#139b7e"], ["Giáo viên", teachers, "#8d91dd"], ["Tài khoản khác", other, "#dce5eb"]];
  return <section className="saas-panel saas-accounts"><div className="saas-panel-heading"><div><h2>Cơ cấu tài khoản</h2><p>Người dùng trên nền tảng</p></div><Users size={19}/></div>
    <div className="saas-donut" role="img" aria-label={segments.map(([label, value]) => `${label}: ${number(value)}`).join(", ")} style={{ background: total ? `conic-gradient(#139b7e 0 ${parents / total * 100}%, #8d91dd ${parents / total * 100}% ${(parents + teachers) / total * 100}%, #dce5eb ${(parents + teachers) / total * 100}% 100%)` : "#e9eef0" }}><div><strong>{number(total)}</strong><span>Tổng tài khoản</span></div></div>
    <div className="saas-legend">{segments.map(([label, value, color]) => <div key={label}><span><i style={{ background: color }}/>{label}</span><b>{number(value)}<small>{total ? Math.round(value / total * 100) : 0}%</small></b></div>)}</div>
    <button className="saas-text-button" onClick={() => onNavigate?.("accounts")}>Quản lý tài khoản<ArrowRight size={15}/></button>
  </section>;
}

export default function AdminOverview({ onNavigate }) {
  const [state, setState] = useState({ loading: true });
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    let active = true;
    api.getAdminDashboard().then((data) => {
      if (active) setState({ data, loading: false, updatedAt: new Date() });
    }).catch((error) => { if (active) setState({ error: error?.message || "Không tải được tổng quan quản trị.", loading: false }); });
    return () => { active = false; };
  }, [refreshKey]);
  const refresh = () => { setState({ loading: true }); setRefreshKey((value) => value + 1); };
  const { data, loading, error, updatedAt } = state;
  const cards = data ? [
    { label: "Doanh thu đã thanh toán", value: money(data.revenue?.paidTotal), note: `Toàn thời gian · 30 ngày: ${money(data.revenue?.paidLast30Days)}`, Icon: BadgeDollarSign, tone: "green", tab: "transactions" },
    { label: "Tổng tài khoản", value: number(data.accounts?.total), note: `${number(data.accounts?.parents)} phụ huynh · ${number(data.accounts?.teachers)} giáo viên`, Icon: Users, tone: "blue", tab: "accounts" },
    { label: "Người học hoạt động", value: number(data.learners?.active), note: `${number(data.learners?.archived)} lưu trữ · ${number(data.learners?.wiped)} đã xóa`, Icon: UserRound, tone: "purple", tab: "accounts" },
    { label: "Gói đã kích hoạt", value: number(data.plans?.active), note: "Quyền sử dụng vĩnh viễn", Icon: ShieldCheck, tone: "amber", tab: "plans" },
  ] : [];
  return <div className="saas-overview">
    <header className="saas-heading"><div><div className="saas-eyebrow"><span/>KHÔNG GIAN QUẢN TRỊ</div><h1>Tổng quan hệ thống</h1><p>Mọi chỉ số quan trọng, trong một góc nhìn.</p></div><div className="saas-heading-actions"><span className="saas-date"><CalendarDays size={15}/>{new Intl.DateTimeFormat("vi-VN", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}</span><button className="admin-secondary" onClick={refresh} disabled={loading}><RefreshCw size={15} className={loading ? "saas-spin" : ""}/>Làm mới</button></div></header>
    {error && <div className="admin-notice error" role="alert">{error}</div>}
    {loading ? <div className="saas-skeletons" role="status" aria-label="Đang tải tổng quan">{[0, 1, 2, 3].map((index) => <div className="saas-skeleton" key={index}/>)}<span>Đang tải tổng quan…</span></div> : data && <>
      <div className="saas-kpis">{cards.map(({ label, value, note, Icon, tone, tab }) => <button className={`saas-kpi ${tone}`} key={label} onClick={() => onNavigate?.(tab)}><div className="saas-kpi-top"><span>{label}</span><span className="saas-icon"><Icon size={19}/></span></div><strong>{value}</strong><div className="saas-kpi-note"><span>{note}</span><ArrowUpRight size={15}/></div></button>)}</div>
      <div className="saas-analytics"><RevenueChart refreshKey={refreshKey}/><AccountBreakdown accounts={data.accounts} onNavigate={onNavigate}/></div>
      <RecentAccounts refreshKey={refreshKey} onNavigate={onNavigate}/>
      <section className="saas-panel saas-activity"><div className="saas-panel-heading"><div><h2>Hoạt động quản trị gần đây</h2><p>Theo dõi các thay đổi quyền truy cập trong hệ thống</p></div><button className="saas-text-button" onClick={() => onNavigate?.("role-logs")}>Xem nhật ký<ArrowRight size={15}/></button></div>
        {data.recentAdminActions?.length ? <div className="saas-table-wrap"><table><thead><tr><th>Người thực hiện</th><th>Thao tác</th><th>Tài khoản</th><th>Thời gian</th><th>Lý do</th></tr></thead><tbody>{data.recentAdminActions.slice(0, 5).map((row) => <tr key={row.id}><td><div className="saas-person"><span>{(row.actorEmail || "A").charAt(0).toUpperCase()}</span><b>{row.actorEmail || "—"}</b></div></td><td><span className={`saas-action-tag ${row.granted ? "grant" : "revoke"}`}>{row.granted ? <Check size={12}/> : <ArrowDownLeft size={12}/>}{row.granted ? "Cấp" : "Thu hồi"} {roleLabels[row.role] || row.role}</span></td><td>{row.targetEmail || "—"}</td><td className="saas-time">{row.createdAt ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(row.createdAt)) : "—"}</td><td>{row.reason || "—"}</td></tr>)}</tbody></table></div> : <div className="saas-empty"><ShieldCheck size={28}/><strong>Chưa có hoạt động quản trị</strong><p>Các thay đổi vai trò sẽ xuất hiện tại đây.</p></div>}
        <div className="saas-activity-footer"><span><span className="saas-status-dot"/>Cập nhật lúc {updatedAt?.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span><span>Hiển thị {Math.min(5, data.recentAdminActions?.length || 0)} hoạt động gần nhất</span></div>
      </section>
    </>}
  </div>;
}
