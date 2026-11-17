import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BadgeDollarSign,
  CheckCircle2,
  CircleX,
  Clock3,
  Eye,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { adminDashboardApi as api } from "../api/adminDashboardApi";
import {
  adminRoleLabel,
  entitlementSourceLabel,
  learnerStatusLabel,
  planClassName,
  planLabel,
  providerLabel,
  transactionStatusLabel,
} from "../adminLabels";
import "../styles/admin-overview.css";

const INTERNAL_ROLES = ["ADMIN", "GAME_EDITOR", "GAME_REVIEWER", "GAME_MANAGER"];
const money = (value) => new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
}).format(Number(value || 0));
const dateTime = (value) => value
  ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value))
  : "—";
const dateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const transactionFilters = (q = "") => ({ q, status: "", from: "", to: "" });
const TRANSACTION_STATUSES = { PAID: "Đã thanh toán", PENDING: "Chờ thanh toán", FAILED: "Thất bại" };

function TransactionSummary({ stats, loading, from, to, error, onRetry }) {
  const count = stats?.count || {};
  const total = Object.values(count).reduce((sum, value) => sum + Number(value || 0), 0);
  const paid = Number(count.PAID || 0);
  const rate = total ? Math.round(paid / total * 100) : 0;
  const formatDay = (value) => value.split("-").reverse().join("/");
  const range = from && to ? `${formatDay(from)} → ${formatDay(to)}` : from ? `Từ ${formatDay(from)}` : to ? `Đến ${formatDay(to)}` : "Toàn thời gian";
  const cards = [
    { label: "Doanh thu đã thanh toán", value: money(stats?.paidAmount), note: "Tiền đã thu · Chưa trừ hoàn tiền", Icon: BadgeDollarSign, tone: "green" },
    { label: "Tổng giao dịch", value: total, note: range, Icon: ReceiptText, tone: "blue" },
    { label: "Đã thanh toán", value: paid, note: `${rate}% tổng giao dịch`, Icon: CheckCircle2, tone: "purple" },
    { label: "Chờ thanh toán", value: Number(count.PENDING || 0), note: "Đang chờ khách thanh toán", Icon: Clock3, tone: "amber" },
    { label: "Thất bại", value: Number(count.FAILED || 0), note: "Thanh toán không thành công", Icon: CircleX, tone: "rose" },
  ];
  return <section className="saas-overview admin-transaction-summary" aria-label="Tổng hợp giao dịch" aria-busy={loading}>
    {error ? <div className="admin-notice error" role="alert">{error}<button className="admin-secondary compact" onClick={onRetry}>Thử lại</button></div> : <div className="saas-kpis admin-transaction-kpis">
      {cards.map(({ label, value, note, Icon, tone }) => <article className={`saas-kpi ${tone}`} key={label}>
        <div className="saas-kpi-top"><span>{label}</span><span className="saas-icon"><Icon size={19} aria-hidden="true"/></span></div>
        <strong>{loading ? "…" : typeof value === "number" ? new Intl.NumberFormat("vi-VN").format(value) : value}</strong>
        <div className="saas-kpi-note"><span>{loading ? "Đang cập nhật…" : note}</span></div>
      </article>)}
    </div>}
  </section>;
}
const pageShape = (value, fallbackPage = 0, fallbackSize = 20) => Array.isArray(value)
  ? { items: value, totalElements: value.length, totalPages: value.length ? 1 : 0, page: fallbackPage, size: fallbackSize }
  : {
      items: value?.items ?? [],
      totalElements: value?.totalElements ?? 0,
      totalPages: value?.totalPages ?? 0,
      page: value?.page ?? fallbackPage,
      size: value?.size ?? fallbackSize,
    };
const messageOf = (error, fallback) => error?.message || fallback;

function Notice({ error, children }) {
  if (!error && !children) return null;
  return <div className={`admin-notice ${error ? "error" : "success"}`} role={error ? "alert" : "status"}>{error || children}</div>;
}

function Pager({ page }) {
  if (!page) return null;
  return (
    <div className="admin-pagination">
      <button className="admin-secondary" disabled={page.loading || page.index <= 0} onClick={() => page.onChange(page.index - 1)}>← Trang trước</button>
      <span>Trang {page.index + 1}/{Math.max(1, page.totalPages)} · {page.totalElements} kết quả</span>
      <button className="admin-secondary" disabled={page.loading || page.index + 1 >= page.totalPages} onClick={() => page.onChange(page.index + 1)}>Trang sau →</button>
    </div>
  );
}

export { default as AdminOverviewTab } from "./AdminOverview";

function TransactionDetail({ detail, busy, onClose, onRefund }) {
  if (!detail) return null;
  const fields = [
    ["Mã đơn", detail.orderCode], ["Tài khoản", detail.email], ["Gói", `${planLabel(detail.kind)} · ${detail.months || 0} tháng`],
    ["Số tiền", money(detail.amount)], ["Trạng thái", transactionStatusLabel(detail.status)], ["Tạo lúc", dateTime(detail.createdAt)],
    ["Thanh toán", dateTime(detail.paidAt)], ["Hết hạn", dateTime(detail.expiresAt)], ["Mã cổng", detail.gatewayRef || "—"],
    ["Nội dung chuyển khoản", detail.transferNote || "—"], ["Ghi chú", detail.note || "—"], ["Hoàn tiền", detail.refundedAt ? `${money(detail.refundAmount)} · ${dateTime(detail.refundedAt)}` : "Chưa hoàn"],
  ];
  return <div className="admin-role-modal" role="dialog" aria-modal="true"><div className="admin-role-modal-panel admin-detail-panel"><div className="admin-role-modal-heading"><div><span>CHI TIẾT GIAO DỊCH</span><h2>Đơn #{detail.orderCode}</h2></div><button aria-label="Đóng" onClick={onClose}><X/></button></div><div className="admin-role-modal-body"><div className="admin-detail-grid">{fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>{detail.refundedAt && <div className="admin-notice"><b>Lý do hoàn:</b> {detail.refundReason}<br/><small>Ghi nhận bởi {detail.refundedByEmail || "—"}</small></div>}<div className="admin-modal-actions">{detail.status === "PAID" && !detail.refundedAt && <button className="admin-danger" disabled={busy} onClick={onRefund}><RotateCcw size={16}/> Hoàn tiền</button>}<button className="admin-secondary" onClick={onClose}>Đóng</button></div></div></div></div>;
}

function RefundDialog({ transaction, busy, error, onCancel, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  if (!transaction) return null;
  const submit = (event) => {
    event.preventDefault();
    onSubmit({ amount: amount === "" ? null : Number(amount), reason });
  };
  return <div className="admin-confirm" role="alertdialog" aria-modal="true"><form className="admin-card admin-refund-form" onSubmit={submit}><span>XÁC NHẬN HOÀN TIỀN</span><h2>Hoàn đơn #{transaction.orderCode}</h2><p>Tiền được chuyển trả ngoài ứng dụng. Thao tác này chỉ ghi nhận kết quả trong hệ thống.</p><div className="admin-notice error"><b>Hoàn tiền sẽ thu hồi gói của đơn này, kể cả khi hoàn một phần.</b></div><label>Số tiền hoàn<input type="number" min="1" max={transaction.amount} value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={`Để trống để hoàn đủ ${money(transaction.amount)}`}/></label><label>Lý do<textarea required maxLength="255" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Nhập lý do hoàn tiền…"/><small>{reason.length}/255 ký tự</small></label><Notice error={error}/><div><button type="button" className="admin-secondary" disabled={busy} onClick={onCancel}>Hủy</button><button className="admin-danger" disabled={busy || !reason.trim()}>{busy ? "Đang ghi nhận…" : "Xác nhận hoàn"}</button></div></form></div>;
}

export function AdminTransactionsTab({ initialQuery = "" }) {
  const [filters, setFilters] = useState(() => transactionFilters(initialQuery));
  const [applied, setApplied] = useState(() => transactionFilters(initialQuery));
  const [period, setPeriod] = useState("all");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(pageShape([], 0, 20));
  const [stats, setStats] = useState(null);
  const [detail, setDetail] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = () => setRefreshVersion((value) => value + 1);
  useEffect(() => {
    if (filters.q.trim() === applied.q) return;
    const timer = window.setTimeout(() => {
      setApplied((current) => ({ ...current, q: filters.q.trim() }));
      setPageIndex(0);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.q, applied.q]);
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true); setError("");
    api.listAdminTransactions({ ...applied, page: pageIndex, size: 20 })
      .then((list) => { if (active) setPage(pageShape(list, pageIndex, 20)); })
      .catch((loadError) => { if (active) setError(messageOf(loadError, "Không tải được giao dịch.")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [applied, pageIndex, refreshVersion]);
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatsLoading(true); setStatsError("");
    api.getAdminTransactionStats({ from: applied.from, to: applied.to })
      .then((summary) => { if (active) setStats(summary); })
      .catch((loadError) => { if (active) setStatsError(messageOf(loadError, "Không tải được thống kê giao dịch.")); })
      .finally(() => { if (active) setStatsLoading(false); });
    return () => { active = false; };
  }, [applied.from, applied.to, refreshVersion]);
  const openDetail = async (orderCode) => {
    setBusy(true); setError("");
    try { setDetail(await api.getAdminTransaction(orderCode)); }
    catch (loadError) { setError(messageOf(loadError, "Không tải được chi tiết giao dịch.")); }
    finally { setBusy(false); }
  };
  const refund = async ({ amount, reason }) => {
    setBusy(true); setError(""); setNotice("");
    try {
      const updated = await api.refundAdminTransaction({ orderCode: refundTarget.orderCode, amount, reason });
      setDetail(updated); setRefundTarget(null); setNotice(`Đã ghi nhận hoàn tiền cho đơn #${updated.orderCode}.`);
      setPage((current) => ({ ...current, items: current.items.map((row) => row.orderCode === updated.orderCode ? { ...row, ...updated } : row) }));
      await load();
    } catch (refundError) {
      const conflict = refundError?.status === 409 || refundError?.code === 4008;
      const unavailable = refundError?.status === 404;
      setError(unavailable
        ? "Chức năng hoàn tiền chưa mở"
        : conflict
          ? "Đơn đã được hoàn hoặc không còn đủ điều kiện hoàn. Dữ liệu đang được tải lại."
          : messageOf(refundError, "Không ghi nhận được hoàn tiền."));
      if (conflict) { setRefundTarget(null); await openDetail(refundTarget.orderCode); await load(); }
    } finally { setBusy(false); }
  };
  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setApplied((current) => ({ ...current, [key]: value }));
    setPageIndex(0);

  };
  const changePeriod = (value) => {
    setPeriod(value);

    const to = new Date();
    const from = new Date(to);
    from.setDate(from.getDate() - Number(value) + 1);
    const range = value === "all" ? { from: "", to: "" } : { from: dateOnly(from), to: dateOnly(to) };
    setFilters((current) => ({ ...current, ...range }));
    setApplied((current) => ({ ...current, ...range }));
    setPageIndex(0);
  };
  const clearFilters = () => {
    const next = transactionFilters();
    setFilters(next); setApplied(next); setPeriod("all"); setPageIndex(0);
  };
  return <div className="admin-transactions-page">
    <header className="admin-heading"><div><span>THANH TOÁN</span><h1>Giao dịch và hoàn tiền</h1><p>Tìm kiếm, đối soát số liệu, xem chi tiết và ghi nhận hoàn tiền.</p></div><button className="admin-secondary" disabled={loading} onClick={() => void load()}><RefreshCw size={17}/> Làm mới</button></header>
    <TransactionSummary stats={stats} loading={statsLoading} from={applied.from} to={applied.to} error={statsError} onRetry={load}/>
    <div className="admin-filter admin-transaction-filter" role="search" aria-label="Lọc giao dịch">
      <label className="admin-transaction-search">Tìm giao dịch<div className="admin-account-search-field"><Search size={17} aria-hidden="true"/><input type="search" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} placeholder="Mã đơn hàng hoặc email khách hàng"/></div></label>
      <label>Trạng thái thanh toán<select value={filters.status} onChange={(event) => changeFilter("status", event.target.value)}><option value="">Tất cả trạng thái</option>{Object.entries(TRANSACTION_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Khoảng thời gian<select value={period} onChange={(event) => changePeriod(event.target.value)}><option value="7">7 ngày gần nhất</option><option value="30">30 ngày gần nhất</option><option value="90">90 ngày gần nhất</option><option value="all">Toàn thời gian</option></select></label>
      <button type="button" className="admin-secondary admin-clear-filters" onClick={clearFilters}><X size={15}/>Xóa bộ lọc</button>
    </div>
    <div className="admin-transaction-results" role="status"><span>{loading ? "Đang tải giao dịch…" : `${page.totalElements} giao dịch phù hợp`}</span><span>Tìm theo mã đơn, email, trạng thái và thời gian</span></div>
    <Notice error={error}>{notice}</Notice>
    <section className="admin-card admin-table-card">{loading ? <div className="admin-loading">Đang tải giao dịch…</div> : page.items.length ? <div className="admin-table-wrap"><table><thead><tr><th>Đơn hàng</th><th>Khách hàng</th><th>Gói</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th><th></th></tr></thead><tbody>{page.items.map((row) => <tr key={row.orderCode} className={row.needsReview ? "needs-review" : ""}><td><strong>#{row.orderCode}</strong><small>{row.purpose === "RENEW" ? "Gia hạn" : "Mua mới"}</small></td><td>{row.email}<small>{row.accountId}</small></td><td><span className={`admin-chip ${planClassName(row.kind)}`}>{planLabel(row.kind)}</span><small>{row.months} tháng</small></td><td><strong>{money(row.amount)}</strong>{row.refundedAt && <small className="admin-refunded">Đã hoàn {money(row.refundAmount)}</small>}</td><td><span className={`admin-status ${String(row.status).toLowerCase()}`}>{transactionStatusLabel(row.status)}</span></td><td>{dateTime(row.createdAt)}<small>{row.paidAt ? `Trả: ${dateTime(row.paidAt)}` : "Chưa thanh toán"}</small></td><td><button className="admin-secondary compact" disabled={busy} onClick={() => void openDetail(row.orderCode)}><Eye size={15}/> Chi tiết</button></td></tr>)}</tbody></table></div> : <div className="admin-empty">Không có giao dịch phù hợp.</div>}</section>
    <Pager page={{ index: pageIndex, totalPages: page.totalPages, totalElements: page.totalElements, loading, onChange: setPageIndex }}/>
    <TransactionDetail detail={detail} busy={busy} onClose={() => setDetail(null)} onRefund={() => { setRefundTarget(detail); setError(""); }}/>
    <RefundDialog transaction={refundTarget} busy={busy} error={error} onCancel={() => { setRefundTarget(null); setError(""); }} onSubmit={(value) => void refund(value)}/>
  </div>;
}

function AccountDetail({ detail, onClose, onShowTransactions }) {
  if (!detail) return null;
  const account = detail.account || {};
  return <div className="admin-role-modal" role="dialog" aria-modal="true"><div className="admin-role-modal-panel admin-detail-panel" key={account.id}><div className="admin-role-modal-heading"><div><span>CHI TIẾT TÀI KHOẢN</span><h2>{account.displayName || account.email}</h2></div><button aria-label="Đóng" onClick={onClose}><X/></button></div><div className="admin-role-modal-body"><div className="admin-detail-grid"><div><span>Email</span><strong>{account.email}</strong></div><div><span>Ngày tạo</span><strong>{dateTime(account.createdAt)}</strong></div><div><span>Xác minh email</span><strong>{dateTime(account.emailVerifiedAt)}</strong></div><div><span>Đăng nhập gần nhất</span><strong>{dateTime(account.lastLoginAt)}</strong></div><div><span>Nhà cung cấp</span><strong>{(account.providers || []).map(providerLabel).join(", ") || "—"}</strong></div><div><span>Khóa đến</span><strong>{dateTime(account.lockedUntil)}</strong></div></div><section className="admin-detail-section"><h3>Vai trò nội bộ</h3><div className="admin-chip-list">{detail.roles?.length ? detail.roles.map((role) => <span className="admin-chip purple" key={role}>{adminRoleLabel(role)}</span>) : <em>Không có vai trò nội bộ</em>}</div></section><section className="admin-detail-section"><h3>Gói và quyền lợi</h3>{detail.entitlements?.length ? detail.entitlements.map((item, index) => <article className="admin-entitlement" key={`${item.kind}-${item.createdAt}-${index}`}><div><strong>{planLabel(item.kind)}</strong><span className={`admin-status ${item.active ? "paid" : "failed"}`}>{item.active ? "Còn hạn" : "Hết hạn"}</span></div><small>{item.startsOn} → {item.expiresOn} · {entitlementSourceLabel(item.source)}{item.orderCode ? ` · Đơn #${item.orderCode}` : ""}</small>{item.reason && <p>{item.reason}</p>}</article>) : <div className="admin-empty compact">Chưa có gói.</div>}</section><section className="admin-detail-section"><div className="admin-section-inline"><h3>20 giao dịch mới nhất</h3><button className="admin-secondary compact" onClick={() => onShowTransactions(account.email)}>Xem tất cả</button></div>{detail.transactions?.length ? <div className="admin-table-wrap admin-detail-table"><table><thead><tr><th>Đơn</th><th>Gói</th><th>Số tiền</th><th>Trạng thái</th><th>Ngày tạo</th></tr></thead><tbody>{detail.transactions.map((row) => <tr key={row.orderCode}><td><strong>#{row.orderCode}</strong></td><td>{planLabel(row.kind)}</td><td>{money(row.amount)}</td><td><span className={`admin-status ${row.refundedAt || row.status === "FAILED" ? "failed" : row.status === "PAID" ? "paid" : "pending"}`}>{row.refundedAt ? "Đã hoàn" : transactionStatusLabel(row.status)}</span></td><td>{dateTime(row.createdAt)}</td></tr>)}</tbody></table></div> : <div className="admin-empty compact">Chưa có giao dịch.</div>}</section><section className="admin-detail-section"><h3>Người học</h3><div className="admin-slot-grid">{["ACTIVE", "ARCHIVED", "WIPED"].map((key) => <div key={key}><span>{learnerStatusLabel(key)}</span><strong>{detail.slots?.[key] || 0}</strong></div>)}</div></section></div></div></div>;
}

export function AdminAccountsTab({ onShowTransactions }) {
  const [pageSize, setPageSize] = useState(8);
  const pageSizeRef = useRef(8);
  const tableRef = useRef(null);
  const pagerRef = useRef(null);
  const [filters, setFilters] = useState({ q: "", role: "", plan: "" });
  const [applied, setApplied] = useState(filters);
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(pageShape([], 0, pageSize));
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (filters.q.trim() === applied.q) return;
    const timer = window.setTimeout(() => {
      setApplied((current) => current.q === filters.q.trim() ? current : { ...current, q: filters.q.trim() });
      setPageIndex(0);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.q, applied.q]);
  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const fitRows = () => {
      const top = table.getBoundingClientRect().top + window.scrollY;
      const headerHeight = table.querySelector("thead")?.getBoundingClientRect().height || 44;
      const rowHeight = Math.max(62, ...Array.from(table.querySelectorAll("tbody tr"), (row) => row.getBoundingClientRect().height));
      const pagerHeight = pagerRef.current?.getBoundingClientRect().height || 60;
      const size = window.innerWidth <= 680 ? 5 : Math.max(3, Math.min(20, Math.floor((window.innerHeight - top - headerHeight - pagerHeight - 24) / rowHeight)));
      if (pageSizeRef.current !== size) {
        pageSizeRef.current = size;
        setPageSize(size);
        setPageIndex(0);
      }
    };
    fitRows();
    const observer = new ResizeObserver(fitRows);
    observer.observe(table);
    const filter = table.previousElementSibling;
    if (filter) observer.observe(filter);
    window.addEventListener("resize", fitRows);
    return () => { observer.disconnect(); window.removeEventListener("resize", fitRows); };
  }, [page.items]);
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true); setError("");
    api.listAdminAccounts({ ...applied, page: pageIndex, size: pageSize })
      .then((result) => { if (active) setPage(pageShape(result, pageIndex, pageSize)); })
      .catch((loadError) => { if (active) setError(messageOf(loadError, "Không tải được danh sách tài khoản.")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [applied, pageIndex, pageSize, refreshVersion]);
  const open = async (id) => {
    setLoading(true); setError("");
    try { setDetail(await api.getAdminAccount(id)); }
    catch (loadError) { setError(messageOf(loadError, "Không tải được chi tiết tài khoản.")); }
    finally { setLoading(false); }
  };
  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setApplied((current) => ({ ...current, [key]: value }));
    setPageIndex(0);
  };
  const clearFilters = () => {
    setFilters({ q: "", role: "", plan: "" });
    setApplied({ q: "", role: "", plan: "" });
    setPageIndex(0);
  };
  return <div className="admin-accounts-page">
    <header className="admin-heading"><div><span>TÀI KHOẢN</span><h1>Danh sách tài khoản</h1><p>Tìm kiếm và lọc tài khoản theo vai trò hoặc gói còn hiệu lực.</p></div><button className="admin-secondary" disabled={loading} onClick={() => setRefreshVersion((value) => value + 1)}><RefreshCw size={17}/> Làm mới</button></header>
    <div className="admin-filter admin-accounts-filter" role="search" aria-label="Lọc tài khoản">
      <label>Tìm kiếm<div className="admin-account-search-field"><Search size={17} aria-hidden="true"/><input type="search" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} placeholder="Email hoặc tên hiển thị"/></div></label>
      <label>Vai trò nội bộ<select value={filters.role} onChange={(event) => changeFilter("role", event.target.value)}><option value="">Tất cả vai trò</option>{INTERNAL_ROLES.map((role) => <option key={role} value={role}>{adminRoleLabel(role)}</option>)}</select></label>
      <label>Gói còn hạn<select value={filters.plan} onChange={(event) => changeFilter("plan", event.target.value)}><option value="">Tất cả gói</option><option value="PARENT">Phụ huynh</option><option value="TEACHER">Giáo viên</option></select></label>
      <button type="button" className="admin-secondary admin-clear-filters" disabled={!filters.q && !filters.role && !filters.plan} onClick={clearFilters}><X size={15}/>Xóa bộ lọc</button>
    </div>
    <Notice error={error}/>
    <section ref={tableRef} className="admin-card admin-table-card admin-accounts-table" aria-busy={loading}>
      {loading && !page.items.length ? <div className="admin-loading">Đang tải tài khoản…</div> : page.items.length ? <table>
        <thead><tr><th>Tài khoản</th><th>Vai trò nội bộ</th><th>Gói</th><th>Ngày tạo</th><th>Người học</th><th><span className="sr-only">Thao tác</span></th></tr></thead>
        <tbody>{page.items.map((row) => <tr key={row.id}>
          <td data-label="Tài khoản"><strong>{row.displayName || "Chưa đặt tên"}</strong><small>{row.email}</small></td>
          <td data-label="Vai trò nội bộ"><div className="admin-chip-list">{row.roles?.length ? row.roles.map((role) => <span className="admin-chip purple" key={role}>{adminRoleLabel(role)}</span>) : <em>Không có</em>}</div></td>
          <td data-label="Gói"><div className="admin-chip-list">{row.plans?.length ? row.plans.map((plan) => <span className={`admin-chip ${planClassName(plan)}`} key={plan}>{planLabel(plan)}</span>) : <em>Chưa có gói</em>}</div></td>
          <td data-label="Ngày tạo">{dateTime(row.createdAt)}</td>
          <td data-label="Người học">{row.slots?.length || 0}</td>
          <td><button className="admin-secondary compact" onClick={() => void open(row.id)}><Eye size={15}/> Chi tiết</button></td>
        </tr>)}</tbody>
      </table> : <div className="admin-empty">Không có tài khoản phù hợp.</div>}
    </section>
    <div ref={pagerRef} className="admin-accounts-pagination"><span>{pageSize} tài khoản / trang{loading ? " · Đang tải…" : ""}</span><Pager page={{ index: pageIndex, totalPages: page.totalPages, totalElements: page.totalElements, loading, onChange: setPageIndex }}/></div>
    <AccountDetail detail={detail} onClose={() => setDetail(null)} onShowTransactions={onShowTransactions}/>
  </div>;
}
