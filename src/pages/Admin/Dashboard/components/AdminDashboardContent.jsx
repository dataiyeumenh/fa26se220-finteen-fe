import { useState } from "react";
import {
  BadgeDollarSign,
  CheckCircle2,
  CreditCard,
  Gift,
  History,
  LogOut,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  UserCog,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import useAdminDashboard, {
  useAdminAccountSearch,
  useAdminEntitlement,
  useAdminPlans,
  useAdminRoleAccounts,
  useAdminRoleLogs,
  useAdminRoles,
  useAdminTransactions,
} from "../hooks/useAdminDashboard";
import "../styles/admin.css";
import "../styles/admin-modern.css";

const PLAN_KINDS = ["PARENT", "TEACHER"];
const STATUS_LABELS = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
};
const TABS = [
  ["plans", "Bảng giá", BadgeDollarSign],
  ["transactions", "Giao dịch", CreditCard],
  ["roles", "Phân quyền", UserCog],
  ["role-logs", "Nhật ký phân quyền", History],
  ["grant", "Cấp gói", Gift],
];
const ROLE_OPTIONS = [
  {
    id: "ADMIN",
    label: "Quản trị viên",
    description: "Toàn quyền quản trị giá, giao dịch, gói và vai trò.",
  },
  {
    id: "GAME_MANAGER",
    label: "Quản lý nội dung",
    description: "Điều phối quy trình và quản lý nội dung trò chơi.",
  },
  {
    id: "GAME_EDITOR",
    label: "Biên tập viên",
    description: "Tạo và chỉnh sửa nội dung trò chơi.",
  },
  {
    id: "GAME_REVIEWER",
    label: "Kiểm duyệt viên",
    description: "Xem xét và duyệt nội dung trước khi phát hành.",
  },
];
const ROLE_LABELS = Object.fromEntries(
  ROLE_OPTIONS.map((role) => [role.id, role.label]),
);
const money = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const dateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";

function SummaryCards({ items }) {
  return (
    <div className="admin-summary-grid">
      {items.map(({ label, value, note, Icon = CheckCircle2, tone = "" }) => (
        <article
          className={`admin-card admin-summary-card ${tone}`}
          key={label}
        >
          <span>
            <Icon size={18} />
            {label}
          </span>
          <strong>{value}</strong>
          <small>{note}</small>
        </article>
      ))}
    </div>
  );
}

function Notice({ type = "info", children }) {
  return children ? (
    <div
      className={`admin-notice ${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  ) : null;
}

function PlansTab() {
  const {
    plans,
    loading,
    saving,
    notice,
    load,
    save: savePlan,
  } = useAdminPlans();
  const handleSave = async (event, kind) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await savePlan(kind, Number(form.get("price")), Number(form.get("months")));
  };
  return (
    <>
      <header className="admin-heading">
        <div>
          <span>QUẢN LÝ GÓI</span>
          <h1>Bảng giá</h1>
          <p>Giá mới chỉ áp dụng cho giao dịch được tạo sau khi cập nhật.</p>
        </div>
        <button
          className="admin-secondary"
          onClick={() => void load()}
          disabled={loading}
        >
          <RefreshCw size={17} /> Làm mới
        </button>
      </header>
      <Notice type={notice?.type}>{notice?.text}</Notice>
      {loading ? (
        <div className="admin-loading">Đang tải bảng giá…</div>
      ) : (
        <div className="admin-plan-grid">
          {PLAN_KINDS.map((kind) => {
            const plan = plans[kind];
            return (
              <form
                className={`admin-card admin-plan-card ${kind.toLowerCase()}`}
                key={`${kind}-${plan?.updatedAt || "new"}`}
                onSubmit={(event) => void handleSave(event, kind)}
              >
                <div className="admin-card-title">
                  <div className={`admin-plan-icon ${kind.toLowerCase()}`}>
                    <BadgeDollarSign />
                  </div>
                  <div>
                    <small>GÓI {kind}</small>
                    <h2>{kind === "PARENT" ? "Phụ huynh" : "Giáo viên"}</h2>
                  </div>
                </div>
                <div className="admin-plan-summary">
                  <span>{plan ? "Giá đang áp dụng" : "Thiết lập gói học"}</span>
                  <div>
                    <strong>{plan ? money(plan.price) : "Chưa mở bán"}</strong>
                    {plan && <small>/ {plan.months} tháng</small>}
                  </div>
                  <p>
                    {kind === "PARENT"
                      ? "Dành cho phụ huynh đồng hành cùng con."
                      : "Dành cho giáo viên tổ chức lớp học."}
                  </p>
                </div>
                <label>
                  Giá bán (VND)
                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    required
                    defaultValue={plan?.price || ""}
                    placeholder="99000"
                  />
                </label>
                <label>
                  Thời hạn (tháng)
                  <input
                    name="months"
                    type="number"
                    min="1"
                    max="36"
                    required
                    defaultValue={plan?.months || 3}
                  />
                </label>
                <p className="admin-meta">
                  {plan
                    ? `Cập nhật gần nhất: ${dateTime(plan.updatedAt)}`
                    : "Lưu lần đầu để gói xuất hiện ở trang mua gói."}
                </p>
                <button className="admin-primary" disabled={Boolean(saving)}>
                  <Save size={17} />
                  {saving === kind ? "Đang lưu…" : "Lưu bảng giá"}
                </button>
              </form>
            );
          })}
        </div>
      )}
    </>
  );
}

function TransactionsTab() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const size = 20;
  const { rows, loading, reconciling, notice, reload, reconcile } =
    useAdminTransactions(status, page, size);
  const paidRows = rows.filter((row) => row.status === "PAID");
  return (
    <>
      <header className="admin-heading">
        <div>
          <span>THANH TOÁN</span>
          <h1>Giao dịch</h1>
          <p>
            Danh sách mới nhất trước. Đối soát dùng khi nghi webhook PayOS chưa
            tới.
          </p>
        </div>
        <button className="admin-secondary" onClick={reload} disabled={loading}>
          <RefreshCw size={17} /> Làm mới
        </button>
      </header>
      {!loading && (
        <SummaryCards
          items={[
            {
              label: "Tổng giao dịch",
              value: rows.length,
              note: "Danh sách đang hiển thị",
              Icon: CreditCard,
            },
            {
              label: "Đã thanh toán",
              value: paidRows.length,
              note: `${money(paidRows.reduce((sum, row) => sum + Number(row.amount), 0))} ghi nhận`,
              Icon: CheckCircle2,
              tone: "green",
            },
            {
              label: "Chờ xử lý",
              value: rows.filter((row) => row.status === "PENDING").length,
              note: "Cần tiếp tục theo dõi",
              Icon: RefreshCw,
              tone: "purple",
            },
          ]}
        />
      )}
      <div className="admin-filter">
        <label>
          Trạng thái
          <select
            value={status}
            onChange={(event) => {
              setPage(0);
              setStatus(event.target.value);
            }}
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="FAILED">Thất bại</option>
          </select>
        </label>
      </div>
      <Notice type={notice?.type}>{notice?.text}</Notice>
      <section className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading">Đang tải giao dịch…</div>
        ) : rows.length ? (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Gói</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.orderCode}
                    className={row.needsReview ? "needs-review" : ""}
                  >
                    <td>
                      <strong>{row.orderCode}</strong>
                      <small>
                        {row.purpose === "RENEW" ? "Gia hạn" : "Mua mới"}
                      </small>
                      {row.needsReview && (
                        <span className="admin-review-flag">CẦN KIỂM TRA</span>
                      )}
                    </td>
                    <td>
                      {row.email}
                      <small>{row.accountId}</small>
                    </td>
                    <td>
                      <span
                        className={`admin-chip ${row.kind === "TEACHER" ? "purple" : ""}`}
                      >
                        {row.kind}
                      </span>
                      <small>
                        {row.months
                          ? `${row.months} tháng`
                          : "Chưa có thời hạn"}
                      </small>
                    </td>
                    <td>
                      <strong>{money(row.amount)}</strong>
                      {row.note && (
                        <small className="admin-transaction-note">
                          {row.note}
                        </small>
                      )}
                    </td>
                    <td>
                      <span
                        className={`admin-status ${String(row.status).toLowerCase()}`}
                      >
                        {STATUS_LABELS[row.status] || row.status}
                      </span>
                    </td>
                    <td>
                      {dateTime(row.createdAt)}
                      <small>
                        {row.paidAt
                          ? `Thanh toán: ${dateTime(row.paidAt)}`
                          : "Chưa thanh toán"}
                      </small>
                    </td>
                    <td>
                      {row.status === "PENDING" && (
                        <button
                          className="admin-secondary compact"
                          disabled={Boolean(reconciling)}
                          onClick={() => void reconcile(row.orderCode)}
                        >
                          <RefreshCw size={15} />
                          {reconciling === String(row.orderCode)
                            ? "Đang đối soát…"
                            : "Đối soát"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">Không có giao dịch phù hợp.</div>
        )}
      </section>
      <div className="admin-pagination">
        <button
          className="admin-secondary"
          disabled={loading || page === 0}
          onClick={() => setPage((value) => value - 1)}
        >
          ← Trang trước
        </button>
        <span>Trang {page + 1}</span>
        <button
          className="admin-secondary"
          disabled={loading || rows.length < size}
          onClick={() => setPage((value) => value + 1)}
        >
          Trang sau →
        </button>
      </div>
    </>
  );
}

function AccountSearch({ onFound, disabled = false }) {
  const {
    loading,
    error,
    search: searchAccount,
  } = useAdminAccountSearch(onFound);
  const search = async (event) => {
    event.preventDefault();
    const email = String(
      new FormData(event.currentTarget).get("email") || "",
    ).trim();
    await searchAccount(email);
  };
  return (
    <div>
      <form
        className="admin-account-search"
        onSubmit={(event) => void search(event)}
      >
        <label>
          Email tài khoản
          <input
            name="email"
            type="email"
            autoComplete="off"
            required
            placeholder="nguoidung@example.com"
          />
        </label>
        <button className="admin-primary" disabled={disabled || loading}>
          <Search size={17} />
          {loading ? "Đang tìm…" : "Tìm tài khoản"}
        </button>
      </form>
      <Notice type="error">{error}</Notice>
    </div>
  );
}

function AccountCard({ account }) {
  return (
    <section className="admin-card admin-account-card">
      <div className="admin-account-avatar">
        {(account.displayName || account.email || "?")
          .trim()
          .charAt(0)
          .toUpperCase()}
      </div>
      <div>
        <span>TÀI KHOẢN ĐÃ CHỌN</span>
        <h2>{account.displayName || "Chưa đặt tên hiển thị"}</h2>
        <p>{account.email}</p>
        <small>ID: {account.id}</small>
      </div>
      <div className="admin-account-plans">
        <span>Gói hiện có</span>
        <div>
          {account.plans?.length ? (
            account.plans.map((plan) => (
              <b
                className={`admin-chip ${plan === "TEACHER" ? "purple" : ""}`}
                key={plan}
              >
                {plan}
              </b>
            ))
          ) : (
            <em>Chưa có gói</em>
          )}
        </div>
      </div>
    </section>
  );
}

function InternalAccounts({
  selectedId,
  onSelect,
  reloadKey,
  disabled = false,
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const { rows, loading, error, reload } = useAdminRoleAccounts(reloadKey);
  const keyword = search.trim().toLowerCase();
  const visibleRows = rows.filter((row) => {
    const matchesSearch =
      !keyword ||
      `${row.displayName || ""} ${row.email || ""}`
        .toLowerCase()
        .includes(keyword);
    const matchesRole = !roleFilter || row.roles?.includes(roleFilter);
    return matchesSearch && matchesRole;
  });
  return (
    <section className="admin-card admin-table-card admin-section">
      <div className="admin-section-heading">
        <div>
          <div className="admin-section-title">
            <h2>Tài khoản có vai trò nội bộ</h2>
            <span>{rows.length}</span>
          </div>
          <p>Chọn một tài khoản để xem, cấp hoặc thu hồi vai trò.</p>
        </div>
        <button
          type="button"
          className="admin-secondary compact"
          disabled={loading || disabled}
          onClick={reload}
        >
          <RefreshCw size={15} />
          {loading ? "Đang tải…" : "Tải lại"}
        </button>
      </div>
      <Notice type="error">{error}</Notice>
      {!!rows.length && (
        <div className="admin-role-list-toolbar">
          <label>
            Tìm trong danh sách
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tên hoặc email"
            />
          </label>
          <label>
            Vai trò
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              {ROLE_OPTIONS.map((role) => (
                <option value={role.id} key={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>
          {(search || roleFilter) && (
            <button
              type="button"
              className="admin-secondary compact"
              onClick={() => {
                setSearch("");
                setRoleFilter("");
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}
      {loading && !rows.length ? (
        <div className="admin-loading">Đang tải danh sách…</div>
      ) : visibleRows.length ? (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tài khoản</th>
                <th>Vai trò</th>
                <th>Gói</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  className={row.id === selectedId ? "active" : ""}
                >
                  <td>
                    <strong>
                      {row.displayName || "Chưa đặt tên hiển thị"}
                    </strong>
                    <small>{row.email}</small>
                  </td>
                  <td>
                    <div className="admin-chip-list">
                      {(row.roles || []).map((role) => (
                        <span
                          className={`admin-chip ${role === "ADMIN" ? "purple" : ""}`}
                          key={role}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="admin-chip-list">
                      {row.plans?.length ? (
                        row.plans.map((plan) => (
                          <span
                            className={`admin-chip ${plan === "TEACHER" ? "purple" : ""}`}
                            key={plan}
                          >
                            {plan}
                          </span>
                        ))
                      ) : (
                        <em>Chưa có gói</em>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-secondary compact"
                      disabled={disabled}
                      onClick={() => onSelect(row)}
                    >
                      {row.id === selectedId ? "Đang chọn" : "Quản lý"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          {rows.length
            ? "Không có tài khoản phù hợp bộ lọc."
            : "Chưa có tài khoản nào giữ vai trò nội bộ."}
        </div>
      )}
    </section>
  );
}

function RolesTab({ actor }) {
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(null);
  const roles = useAdminRoles();
  const { account, busy, notice, listVersion, changeRole, setNotice } = roles;
  const chooseAccount = (value) => {
    roles.chooseAccount(value);
    setPending(null);
    setReason("");
  };
  const requestChange = (role, action) => {
    if (!reason.trim()) {
      setNotice({
        type: "error",
        text: "Vui lòng nhập lý do trước khi thay đổi vai trò.",
      });
      return;
    }
    setNotice(null);
    setPending({ role, action });
  };
  const confirmChange = async () => {
    if (!account || !pending) return;
    if (await changeRole({ ...pending, reason })) {
      setReason("");
      setPending(null);
    }
  };
  return (
    <>
      <header className="admin-heading">
        <div>
          <span>QUẢN LÝ TRUY CẬP</span>
          <h1>Phân quyền tài khoản</h1>
          <p>
            Danh sách người đang giữ vai trò nội bộ ở ngay dưới; muốn cấp cho
            người mới thì tìm chính xác bằng email.
          </p>
        </div>
      </header>
      <InternalAccounts
        selectedId={account?.id}
        onSelect={chooseAccount}
        reloadKey={listVersion}
        disabled={busy}
      />
      <section className="admin-account-lookup">
        <div>
          <h2>Cấp quyền cho tài khoản khác</h2>
          <p>
            Tài khoản chưa có vai trò nội bộ sẽ không xuất hiện trong danh sách
            bên trên. Hãy tìm bằng email chính xác.
          </p>
        </div>
        <AccountSearch onFound={chooseAccount} disabled={busy} />
      </section>
      <Notice type={notice?.type}>{notice?.text}</Notice>
      {account && (
        <div
          className="admin-role-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-manager-title"
        >
          <div className="admin-role-modal-panel">
            <div className="admin-role-modal-heading">
              <div>
                <span>QUẢN LÝ TRUY CẬP</span>
                <h2 id="role-manager-title">Phân quyền tài khoản</h2>
              </div>
              <button
                type="button"
                aria-label="Đóng"
                disabled={busy}
                onClick={() => chooseAccount(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-role-modal-body">
              <AccountCard account={account} />
              <section className="admin-role-section">
                <div className="admin-section-heading plain">
                  <div>
                    <h2>Vai trò nội bộ</h2>
                    <p>Nhập lý do, sau đó chọn vai trò cần cấp hoặc thu hồi.</p>
                  </div>
                </div>
                <label className="admin-reason">
                  Lý do thay đổi
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    maxLength="255"
                    required
                    placeholder="Ghi rõ lý do cấp hoặc thu hồi vai trò…"
                  />
                  <small>{reason.length}/255 ký tự</small>
                </label>
                <div className="admin-role-grid">
                  {ROLE_OPTIONS.map((role) => {
                    const active = account.roles?.includes(role.id);
                    const selfAdmin =
                      active && role.id === "ADMIN" && account.id === actor?.id;
                    return (
                      <article
                        className={`admin-card admin-role-card ${active ? "active" : ""}`}
                        key={role.id}
                      >
                        <div>
                          <span className="admin-role-state">
                            {active ? (
                              <>
                                <CheckCircle2 size={15} /> Đang có quyền
                              </>
                            ) : (
                              "Chưa được cấp"
                            )}
                          </span>
                          <h3>{role.label}</h3>
                          <code>{role.id}</code>
                          <p>{role.description}</p>
                        </div>
                        <div className="admin-role-actions">
                          <button
                            type="button"
                            className={
                              active ? "admin-danger" : "admin-primary"
                            }
                            disabled={busy || selfAdmin}
                            title={
                              selfAdmin
                                ? "Bạn không thể tự thu hồi quyền ADMIN của mình."
                                : ""
                            }
                            onClick={() =>
                              requestChange(
                                role.id,
                                active ? "revoke" : "grant",
                              )
                            }
                          >
                            {active ? "Thu hồi vai trò" : "Cấp vai trò"}
                          </button>
                          {selfAdmin && (
                            <small className="admin-role-warning">
                              Không thể tự thu hồi quyền ADMIN.
                            </small>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      {pending && (
        <div
          className="admin-confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="role-confirm-title"
        >
          <div className="admin-card">
            <span>XÁC NHẬN THAY ĐỔI</span>
            <h2 id="role-confirm-title">
              {pending.action === "grant" ? "Cấp" : "Thu hồi"} vai trò{" "}
              {pending.role}?
            </h2>
            <p>
              Tài khoản <strong>{account.email}</strong> sẽ được cập nhật quyền
              ngay lập tức.
            </p>
            <blockquote>{reason}</blockquote>
            {pending.role === "ADMIN" && pending.action === "grant" && (
              <p className="admin-confirm-warning">
                Vai trò ADMIN có toàn quyền quản trị hệ thống. Hãy chắc chắn đây
                là đúng người.
              </p>
            )}
            <div>
              <button
                className="admin-secondary"
                disabled={busy}
                onClick={() => setPending(null)}
              >
                Hủy
              </button>
              <button
                className={
                  pending.action === "revoke" ? "admin-danger" : "admin-primary"
                }
                disabled={busy}
                onClick={() => void confirmChange()}
              >
                {busy ? "Đang xử lý…" : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RoleLogsTab() {
  const [page, setPage] = useState(0);
  const [subjectId, setSubjectId] = useState("");
  const [appliedSubjectId, setAppliedSubjectId] = useState("");
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const size = 50;
  const { rows, loading, error, startLoading, reload } = useAdminRoleLogs(
    appliedSubjectId,
    page,
    size,
  );
  const keyword = search.trim().toLowerCase();
  const visibleRows = rows.filter((row) => {
    const matchesSearch =
      !keyword ||
      `${row.actorEmail || ""} ${row.targetEmail || ""} ${row.reason || ""} ${row.role || ""}`
        .toLowerCase()
        .includes(keyword);
    const matchesAction = action === "" || String(row.granted) === action;
    return matchesSearch && matchesAction;
  });
  const applySubject = (event) => {
    event.preventDefault();
    startLoading();
    setPage(0);
    setAppliedSubjectId(subjectId.trim());
  };
  const changePage = (nextPage) => {
    startLoading();
    setPage(nextPage);
  };
  return (
    <>
      <header className="admin-heading">
        <div>
          <span>KIỂM SOÁT TRUY CẬP</span>
          <h1>Nhật ký phân quyền</h1>
          <p>
            Theo dõi ai đã cấp hoặc thu hồi vai trò, tài khoản bị tác động, lý
            do và thời gian thực hiện.
          </p>
        </div>
        <button className="admin-secondary" disabled={loading} onClick={reload}>
          <RefreshCw size={17} /> Làm mới
        </button>
      </header>
      <form className="admin-log-subject-filter" onSubmit={applySubject}>
        <label>
          Lọc theo Account ID
          <input
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
            placeholder="UUID tài khoản bị tác động"
          />
        </label>
        <button className="admin-primary" disabled={loading}>
          <Search size={16} /> Áp dụng
        </button>
        {appliedSubjectId && (
          <button
            type="button"
            className="admin-secondary"
            disabled={loading}
            onClick={() => {
              setSubjectId("");
              startLoading();
              setPage(0);
              setAppliedSubjectId("");
            }}
          >
            Xem tất cả
          </button>
        )}
      </form>
      <div className="admin-filter admin-log-filter">
        <label>
          Tìm trong trang
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Email, vai trò hoặc lý do"
          />
        </label>
        <label>
          Thao tác
          <select
            value={action}
            onChange={(event) => setAction(event.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="true">Cấp vai trò</option>
            <option value="false">Thu hồi vai trò</option>
          </select>
        </label>
      </div>
      <Notice type="error">{error}</Notice>
      <section className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading">Đang tải nhật ký…</div>
        ) : visibleRows.length ? (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Người thực hiện</th>
                  <th>Thao tác</th>
                  <th>Tài khoản bị tác động</th>
                  <th>Lý do</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const ActionIcon = row.granted ? UserPlus : UserMinus;
                  return (
                    <tr key={row.id}>
                      <td>{dateTime(row.createdAt)}</td>
                      <td>
                        <strong>{row.actorEmail}</strong>
                        <small>{row.actorId}</small>
                      </td>
                      <td>
                        <div
                          className={`admin-log-event ${row.granted ? "grant" : "revoke"}`}
                        >
                          <span>
                            <ActionIcon size={16} />
                          </span>
                          <div>
                            <strong>
                              {row.granted ? "Cấp vai trò" : "Thu hồi vai trò"}
                            </strong>
                            <small>
                              {ROLE_LABELS[row.role] || row.role}
                              <code>{row.role}</code>
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{row.targetEmail}</strong>
                        <small>{row.targetId}</small>
                      </td>
                      <td className="admin-log-reason">{row.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            {rows.length
              ? "Không có nhật ký phù hợp bộ lọc trong trang này."
              : "Chưa có lịch sử cấp hoặc thu hồi vai trò."}
          </div>
        )}
      </section>
      <div className="admin-pagination">
        <button
          className="admin-secondary"
          disabled={loading || page === 0}
          onClick={() => changePage(page - 1)}
        >
          ← Trang trước
        </button>
        <span>Trang {page + 1}</span>
        <button
          className="admin-secondary"
          disabled={loading || rows.length < size}
          onClick={() => changePage(page + 1)}
        >
          Trang sau →
        </button>
      </div>
    </>
  );
}

function GrantTab() {
  const { account, busy, notice, chooseAccount, grant } = useAdminEntitlement();
  const submit = async (event) => {
    event.preventDefault();
    if (!account) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const saved = await grant({
      kind: form.get("kind"),
      months: Number(form.get("months")),
      reason: form.get("reason"),
    });
    if (saved) formElement.reset();
  };
  return (
    <>
      <header className="admin-heading">
        <div>
          <span>HỖ TRỢ TÀI KHOẢN</span>
          <h1>Cấp gói thủ công</h1>
          <p>
            Dùng cho tài khoản trải nghiệm hoặc đền bù. Mỗi lần cấp đều cần ghi
            rõ lý do.
          </p>
        </div>
      </header>
      <AccountSearch onFound={chooseAccount} disabled={busy} />
      <Notice type={notice?.type}>{notice?.text}</Notice>
      {account ? (
        <>
          <AccountCard account={account} />
          <div className="admin-grant-layout">
            <form
              className="admin-card admin-form"
              onSubmit={(event) => void submit(event)}
            >
              <div className="admin-form-row">
                <label>
                  Loại gói
                  <select name="kind" defaultValue="PARENT">
                    <option value="PARENT">PARENT — Phụ huynh</option>
                    <option value="TEACHER">TEACHER — Giáo viên</option>
                  </select>
                </label>
                <label>
                  Số tháng
                  <input
                    name="months"
                    type="number"
                    min="1"
                    max="36"
                    defaultValue="3"
                    required
                  />
                </label>
              </div>
              <label>
                Lý do cấp gói
                <textarea
                  name="reason"
                  required
                  maxLength="255"
                  placeholder="Ví dụ: Tài khoản dùng thử cho buổi demo…"
                />
              </label>
              <button className="admin-primary" disabled={busy}>
                <Gift size={17} />
                {busy ? "Đang cấp gói…" : "Xác nhận cấp gói"}
              </button>
            </form>
            <aside className="admin-card admin-help">
              <ShieldCheck />
              <h2>Kiểm tra trước khi cấp</h2>
              <ul>
                <li>Email và tên tài khoản phải đúng người nhận.</li>
                <li>Thời hạn cho phép từ 1 đến 36 tháng.</li>
                <li>Ghi lý do cụ thể để thuận tiện đối soát.</li>
                <li>Gói có hiệu lực ngay sau khi backend xác nhận.</li>
              </ul>
            </aside>
          </div>
        </>
      ) : (
        <div className="admin-card admin-account-empty">
          <Search />
          <h2>Tìm tài khoản trước khi cấp gói</h2>
          <p>Bạn không cần nhập hoặc sao chép Account ID thủ công nữa.</p>
        </div>
      )}
    </>
  );
}

export default function AdminDashboardContent({ actor }) {
  const [tab, setTab] = useState("plans");
  const { logout } = useAdminDashboard();
  const content =
    tab === "transactions" ? (
      <TransactionsTab />
    ) : tab === "roles" ? (
      <RolesTab actor={actor} />
    ) : tab === "role-logs" ? (
      <RoleLogsTab />
    ) : tab === "grant" ? (
      <GrantTab />
    ) : (
      <PlansTab />
    );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <b>f.</b>
          <span>
            finteen<small>ADMIN CONSOLE</small>
          </span>
        </a>
        <div className="admin-user">
          <ShieldCheck />
          <div>
            <strong>
              {actor?.displayName || actor?.name || "Quản trị viên"}
            </strong>
            <small>{actor?.email}</small>
          </div>
        </div>
        <nav aria-label="Điều hướng quản trị">
          {TABS.map(([id, label, Icon]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}>
          <LogOut size={18} /> Đăng xuất
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <span>Hệ thống quản trị FinTeen</span>
          <span className="admin-admin-badge">
            <ShieldCheck size={15} /> ADMIN
          </span>
        </div>
        <div className="admin-content">{content}</div>
      </main>
    </div>
  );
}
