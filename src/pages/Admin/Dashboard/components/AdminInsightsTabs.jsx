import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BadgeDollarSign,
  CreditCard,
  Eye,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { adminDashboardApi as api } from "../api/adminDashboardApi";

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
const defaultRange = () => {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 29);
  return { from: dateOnly(from), to: dateOnly(to) };
};
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

export function AdminOverviewTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setData(await api.getAdminDashboard()); }
    catch (loadError) { setError(messageOf(loadError, "Không tải được tổng quan quản trị.")); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  const cards = data ? [
    ["Tài khoản", data.accounts?.total, `${data.accounts?.parents || 0} phụ huynh · ${data.accounts?.teachers || 0} giáo viên`, Users],
    ["Người học hoạt động", data.learners?.active, `${data.learners?.archived || 0} lưu trữ · ${data.learners?.wiped || 0} đã xóa`, UserRound],
    ["Doanh thu ròng", money(data.revenue?.netTotal), `30 ngày: ${money(data.revenue?.netLast30Days)}`, BadgeDollarSign],
    ["Đơn chờ xử lý", data.transactions?.pending, `${data.transactions?.needsReview || 0} đơn cần kiểm tra`, CreditCard],
    ["Đã hoàn tiền", data.transactions?.refunded, money(data.revenue?.refundedTotal), RotateCcw],
    ["Gói còn hiệu lực", data.plans?.active, `${data.plans?.expiringIn7Days || 0} gói hết hạn trong 7 ngày`, ShieldCheck],
  ] : [];
  return (
    <>
      <header className="admin-heading"><div><span>TỔNG QUAN</span><h1>Trung tâm quản trị</h1><p>Theo dõi tài khoản, doanh thu, gói học và các thao tác quản trị gần nhất.</p></div><button className="admin-secondary" disabled={loading} onClick={() => void load()}><RefreshCw size={17}/> Làm mới</button></header>
      <Notice error={error}/>
      {loading ? <div className="admin-loading">Đang tải tổng quan…</div> : data && <>
        <div className="admin-overview-grid">{cards.map(([label, value, note, Icon]) => <article className="admin-card admin-overview-card" key={label}><Icon size={20}/><span>{label}</span><strong>{value ?? 0}</strong><small>{note}</small></article>)}</div>
        <section className="admin-card admin-table-card admin-section"><div className="admin-section-heading"><div><h2>Hoạt động quản trị gần đây</h2><p>Các lần cấp hoặc thu hồi vai trò mới nhất.</p></div></div>
          {(data.recentAdminActions || []).length ? <div className="admin-table-wrap"><table><thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Thao tác</th><th>Tài khoản</th><th>Lý do</th></tr></thead><tbody>{data.recentAdminActions.map((row) => <tr key={row.id}><td>{dateTime(row.createdAt)}</td><td>{row.actorEmail}</td><td><span className={`admin-status ${row.granted ? "paid" : "failed"}`}>{row.granted ? "Cấp" : "Thu hồi"} {row.role}</span></td><td>{row.targetEmail}</td><td>{row.reason || "—"}</td></tr>)}</tbody></table></div> : <div className="admin-empty">Chưa có hoạt động quản trị.</div>}
        </section>
      </>}
    </>
  );
}

function TransactionDetail({ detail, busy, onClose, onRefund }) {
  if (!detail) return null;
  const fields = [
    ["Mã đơn", detail.orderCode], ["Tài khoản", detail.email], ["Gói", `${detail.kind} · ${detail.months || 0} tháng`],
    ["Số tiền", money(detail.amount)], ["Trạng thái", detail.status], ["Tạo lúc", dateTime(detail.createdAt)],
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
  const [filters, setFilters] = useState(() => ({ q: initialQuery, status: "", refunded: "", from: "", to: "" }));
  const [applied, setApplied] = useState(() => ({ q: initialQuery, status: "", refunded: "", from: "", to: "" }));
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(pageShape([], 0, 20));
  const [stats, setStats] = useState(null);
  const [detail, setDetail] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const statsRange = applied.from && applied.to ? { from: applied.from, to: applied.to } : defaultRange();
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [list, summary] = await Promise.all([
        api.listAdminTransactions({ ...applied, page: pageIndex, size: 20 }),
        api.getAdminTransactionStats(applied.from && applied.to ? { from: applied.from, to: applied.to } : defaultRange()),
      ]);
      setPage(pageShape(list, pageIndex, 20)); setStats(summary);
    } catch (loadError) { setError(messageOf(loadError, "Không tải được giao dịch.")); }
    finally { setLoading(false); }
  }, [applied, pageIndex]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
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
  const submitFilters = (event) => { event.preventDefault(); setPageIndex(0); setApplied(filters); };
  return <>
    <header className="admin-heading"><div><span>THANH TOÁN</span><h1>Giao dịch và hoàn tiền</h1><p>Tìm kiếm, đối soát số liệu, xem chi tiết và ghi nhận hoàn tiền.</p></div><button className="admin-secondary" disabled={loading} onClick={() => void load()}><RefreshCw size={17}/> Làm mới</button></header>
    {stats && <div className="admin-overview-grid compact"><article className="admin-card admin-overview-card"><CreditCard/><span>Đã thanh toán</span><strong>{stats.count?.PAID || 0}</strong><small>{money(stats.paidAmount)}</small></article><article className="admin-card admin-overview-card"><RotateCcw/><span>Đã hoàn</span><strong>{stats.refundedCount || 0}</strong><small>{money(stats.refundedAmount)}</small></article><article className="admin-card admin-overview-card"><BadgeDollarSign/><span>Doanh thu ròng</span><strong>{money(stats.netAmount)}</strong><small>{statsRange.from} → {statsRange.to}</small></article><article className="admin-card admin-overview-card"><Activity/><span>Chờ / thất bại</span><strong>{stats.count?.PENDING || 0} / {stats.count?.FAILED || 0}</strong><small>Cần theo dõi</small></article></div>}
    <form className="admin-filter admin-advanced-filter" onSubmit={submitFilters}><label>Tìm kiếm<input value={filters.q} onChange={(e) => setFilters((v) => ({ ...v, q: e.target.value }))} placeholder="Mã đơn hoặc email"/></label><label>Trạng thái<select value={filters.status} onChange={(e) => setFilters((v) => ({ ...v, status: e.target.value }))}><option value="">Tất cả</option><option value="PENDING">Chờ thanh toán</option><option value="PAID">Đã thanh toán</option><option value="FAILED">Thất bại</option></select></label><label>Hoàn tiền<select value={filters.refunded} onChange={(e) => setFilters((v) => ({ ...v, refunded: e.target.value }))}><option value="">Tất cả</option><option value="true">Đã hoàn</option><option value="false">Chưa hoàn</option></select></label><label>Từ ngày<input type="date" value={filters.from} onChange={(e) => setFilters((v) => ({ ...v, from: e.target.value }))}/></label><label>Đến ngày<input type="date" value={filters.to} onChange={(e) => setFilters((v) => ({ ...v, to: e.target.value }))}/></label><button className="admin-primary"><Search size={16}/> Áp dụng</button></form>
    <Notice error={error}>{notice}</Notice>
    <section className="admin-card admin-table-card">{loading ? <div className="admin-loading">Đang tải giao dịch…</div> : page.items.length ? <div className="admin-table-wrap"><table><thead><tr><th>Đơn hàng</th><th>Khách hàng</th><th>Gói</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th><th></th></tr></thead><tbody>{page.items.map((row) => <tr key={row.orderCode} className={row.needsReview ? "needs-review" : ""}><td><strong>#{row.orderCode}</strong><small>{row.purpose === "RENEW" ? "Gia hạn" : "Mua mới"}</small></td><td>{row.email}<small>{row.accountId}</small></td><td><span className="admin-chip">{row.kind}</span><small>{row.months} tháng</small></td><td><strong>{money(row.amount)}</strong>{row.refundedAt && <small className="admin-refunded">Đã hoàn {money(row.refundAmount)}</small>}</td><td><span className={`admin-status ${String(row.status).toLowerCase()}`}>{row.status}</span></td><td>{dateTime(row.createdAt)}<small>{row.paidAt ? `Trả: ${dateTime(row.paidAt)}` : "Chưa thanh toán"}</small></td><td><button className="admin-secondary compact" disabled={busy} onClick={() => void openDetail(row.orderCode)}><Eye size={15}/> Chi tiết</button></td></tr>)}</tbody></table></div> : <div className="admin-empty">Không có giao dịch phù hợp.</div>}</section>
    <Pager page={{ index: pageIndex, totalPages: page.totalPages, totalElements: page.totalElements, loading, onChange: setPageIndex }}/>
    {stats?.byDay?.length > 0 && <section className="admin-card admin-table-card admin-section"><div className="admin-section-heading"><div><h2>Doanh thu theo ngày</h2><p>Dựa trên ngày thanh toán và ngày hoàn tiền.</p></div></div><div className="admin-table-wrap"><table><thead><tr><th>Ngày</th><th>Đơn trả</th><th>Tiền trả</th><th>Đơn hoàn</th><th>Tiền hoàn</th><th>Ròng</th></tr></thead><tbody>{stats.byDay.map((row) => <tr key={row.date}><td>{row.date}</td><td>{row.paidCount}</td><td>{money(row.paidAmount)}</td><td>{row.refundedCount}</td><td>{money(row.refundedAmount)}</td><td><strong>{money(row.netAmount)}</strong></td></tr>)}</tbody></table></div></section>}
    <TransactionDetail detail={detail} busy={busy} onClose={() => setDetail(null)} onRefund={() => { setRefundTarget(detail); setError(""); }}/>
    <RefundDialog transaction={refundTarget} busy={busy} error={error} onCancel={() => { setRefundTarget(null); setError(""); }} onSubmit={(value) => void refund(value)}/>
  </>;
}

function AccountDetail({ detail, onClose, onShowTransactions }) {
  if (!detail) return null;
  const account = detail.account || {};
  return <div className="admin-role-modal" role="dialog" aria-modal="true"><div className="admin-role-modal-panel admin-detail-panel" key={account.id}><div className="admin-role-modal-heading"><div><span>CHI TIẾT TÀI KHOẢN</span><h2>{account.displayName || account.email}</h2></div><button aria-label="Đóng" onClick={onClose}><X/></button></div><div className="admin-role-modal-body"><div className="admin-detail-grid"><div><span>Email</span><strong>{account.email}</strong></div><div><span>Ngày tạo</span><strong>{dateTime(account.createdAt)}</strong></div><div><span>Xác minh email</span><strong>{dateTime(account.emailVerifiedAt)}</strong></div><div><span>Đăng nhập gần nhất</span><strong>{dateTime(account.lastLoginAt)}</strong></div><div><span>Nhà cung cấp</span><strong>{(account.providers || []).join(", ") || "—"}</strong></div><div><span>Khóa đến</span><strong>{dateTime(account.lockedUntil)}</strong></div></div><section className="admin-detail-section"><h3>Vai trò nội bộ</h3><div className="admin-chip-list">{detail.roles?.length ? detail.roles.map((role) => <span className="admin-chip purple" key={role}>{role}</span>) : <em>Không có vai trò nội bộ</em>}</div></section><section className="admin-detail-section"><h3>Gói và quyền lợi</h3>{detail.entitlements?.length ? detail.entitlements.map((item, index) => <article className="admin-entitlement" key={`${item.kind}-${item.createdAt}-${index}`}><div><strong>{item.kind}</strong><span className={`admin-status ${item.active ? "paid" : "failed"}`}>{item.active ? "Còn hạn" : "Hết hạn"}</span></div><small>{item.startsOn} → {item.expiresOn} · {item.source}{item.orderCode ? ` · Đơn #${item.orderCode}` : ""}</small>{item.reason && <p>{item.reason}</p>}</article>) : <div className="admin-empty compact">Chưa có gói.</div>}</section><section className="admin-detail-section"><div className="admin-section-inline"><h3>20 giao dịch mới nhất</h3><button className="admin-secondary compact" onClick={() => onShowTransactions(account.email)}>Xem tất cả</button></div>{detail.transactions?.length ? <div className="admin-table-wrap admin-detail-table"><table><thead><tr><th>Đơn</th><th>Gói</th><th>Số tiền</th><th>Trạng thái</th><th>Ngày tạo</th></tr></thead><tbody>{detail.transactions.map((row) => <tr key={row.orderCode}><td><strong>#{row.orderCode}</strong></td><td>{row.kind}</td><td>{money(row.amount)}</td><td><span className={`admin-status ${row.refundedAt || row.status === "FAILED" ? "failed" : row.status === "PAID" ? "paid" : "pending"}`}>{row.refundedAt ? "Đã hoàn" : row.status}</span></td><td>{dateTime(row.createdAt)}</td></tr>)}</tbody></table></div> : <div className="admin-empty compact">Chưa có giao dịch.</div>}</section><section className="admin-detail-section"><h3>Người học</h3><div className="admin-slot-grid">{["ACTIVE", "ARCHIVED", "WIPED"].map((key) => <div key={key}><span>{key}</span><strong>{detail.slots?.[key] || 0}</strong></div>)}</div></section></div></div></div>;
}

export function AdminAccountsTab({ onShowTransactions }) {
  const [filters, setFilters] = useState({ q: "", role: "", plan: "" });
  const [applied, setApplied] = useState(filters);
  const [pageIndex, setPageIndex] = useState(0);
  const [page, setPage] = useState(pageShape([], 0, 20));
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setPage(pageShape(await api.listAdminAccounts({ ...applied, page: pageIndex, size: 20 }), pageIndex, 20)); }
    catch (loadError) { setError(messageOf(loadError, "Không tải được danh sách tài khoản.")); }
    finally { setLoading(false); }
  }, [applied, pageIndex]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  const open = async (id) => {
    setLoading(true); setError("");
    try { setDetail(await api.getAdminAccount(id)); }
    catch (loadError) { setError(messageOf(loadError, "Không tải được chi tiết tài khoản.")); }
    finally { setLoading(false); }
  };
  const submit = (event) => { event.preventDefault(); setPageIndex(0); setApplied(filters); };
  return <>
    <header className="admin-heading"><div><span>TÀI KHOẢN</span><h1>Danh sách tài khoản</h1><p>Lọc theo vai trò nội bộ hoặc gói còn hiệu lực, sau đó xem hồ sơ quản trị đầy đủ.</p></div><button className="admin-secondary" disabled={loading} onClick={() => void load()}><RefreshCw size={17}/> Làm mới</button></header>
    <form className="admin-filter admin-advanced-filter" onSubmit={submit}><label>Tìm kiếm<input value={filters.q} onChange={(e) => setFilters((v) => ({ ...v, q: e.target.value }))} placeholder="Email hoặc tên hiển thị"/></label><label>Vai trò nội bộ<select value={filters.role} onChange={(e) => setFilters((v) => ({ ...v, role: e.target.value }))}><option value="">Tất cả</option>{INTERNAL_ROLES.map((role) => <option key={role}>{role}</option>)}</select></label><label>Gói còn hạn<select value={filters.plan} onChange={(e) => setFilters((v) => ({ ...v, plan: e.target.value }))}><option value="">Tất cả</option><option value="PARENT">Phụ huynh</option><option value="TEACHER">Giáo viên</option></select></label><button className="admin-primary"><Search size={16}/> Áp dụng</button></form>
    <Notice error={error}/>
    <section className="admin-card admin-table-card">{loading && !page.items.length ? <div className="admin-loading">Đang tải tài khoản…</div> : page.items.length ? <div className="admin-table-wrap"><table><thead><tr><th>Tài khoản</th><th>Vai trò nội bộ</th><th>Gói</th><th>Ngày tạo</th><th>Người học</th><th></th></tr></thead><tbody>{page.items.map((row) => <tr key={row.id}><td><strong>{row.displayName || "Chưa đặt tên"}</strong><small>{row.email}</small></td><td><div className="admin-chip-list">{row.roles?.length ? row.roles.map((role) => <span className="admin-chip purple" key={role}>{role}</span>) : <em>Không có</em>}</div></td><td><div className="admin-chip-list">{row.plans?.length ? row.plans.map((plan) => <span className="admin-chip" key={plan}>{plan}</span>) : <em>Chưa có gói</em>}</div></td><td>{dateTime(row.createdAt)}</td><td>{row.slots?.length || 0}</td><td><button className="admin-secondary compact" onClick={() => void open(row.id)}><Eye size={15}/> Chi tiết</button></td></tr>)}</tbody></table></div> : <div className="admin-empty">Không có tài khoản phù hợp.</div>}</section>
    <Pager page={{ index: pageIndex, totalPages: page.totalPages, totalElements: page.totalElements, loading, onChange: setPageIndex }}/>
    <AccountDetail detail={detail} onClose={() => setDetail(null)} onShowTransactions={onShowTransactions}/>
  </>;
}
