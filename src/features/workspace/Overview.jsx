import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, RefreshCw, WalletCards } from "lucide-react";
import { useWorkspace } from "./useWorkspace";
import { PLANS } from "./model";
import { Heading, Empty } from "./ui";
import AccountSettings from "../auth/AccountSettings";
import { auth } from "../../api/auth.api";
import { workspaceApi } from "./api/workspaceApi";
import { PageLoader } from "../../components/feedback/LoadingState";
import { PLAN_NAME } from "./entitlements";

const PaymentResult = lazy(() => import("./PaymentResult"));

const money = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
const PLAN_COPY = {
  PARENT: {
    name: "Gói Gia đình",
    description: "Đồng hành cùng con và theo dõi hành trình học tài chính.",
    benefits: [
      "Tối đa 4 hồ sơ trẻ",
      "Đầy đủ 8 chương học",
      "Theo dõi tiến độ học tập",
    ],
  },
  TEACHER: {
    name: "Gói Giáo viên",
    description: "Tổ chức lớp học và quản lý hành trình của học sinh.",
    benefits: [
      "Tối đa 40 học sinh",
      "Quản lý lớp và bài kiểm tra",
      "Báo cáo kết quả học tập",
    ],
  },
};
const quotaBelongsToRole = (quota, role) => {
  const context = String(quota?.context || "").toUpperCase();
  const plan = String(quota?.plan || quota?.kind || "").toUpperCase();
  if (role === "teacher") return context === "CLASS" || plan === "TEACHER";
  if (role === "parent") return context === "FAMILY" || plan === "PARENT";
  return true;
};
const PAYMENT_STATUS = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Không thành công",
};
const paymentDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(value))
    : "—";

export function Overview() {
  const { actor } = useWorkspace();
  return (
    <>
      <Heading
        title={`Chào ${actor.name}!`}
        description="Khám phá FinTeen và bắt đầu hành trình học tài chính."
      />
      <section className="ws-overview-hero">
        <div>
          <span className="ws-overview-kicker">BẮT ĐẦU VỚI FINTEEN</span>
          <h2>Trải nghiệm hành trình tài chính đầu tiên</h2>
          <p>
            Chơi thử nội dung miễn phí hoặc chọn gói phù hợp để tạo hồ sơ cho
            trẻ.
          </p>
          <div className="ws-actions">
            <Link className="ws-btn primary" to="/dashboard/demo">
              Chơi thử
            </Link>
            <Link className="ws-btn" to="/dashboard/plans">
              Xem các gói
            </Link>
          </div>
        </div>
        <BookOpen />
      </section>
    </>
  );
}

export function Plans() {
  const { actor } = useWorkspace();
  const paymentStorageKey = `finteen:payment:active:${actor.id}`;
  const [plans, setPlans] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState("");
  const [addonPacks, setAddonPacks] = useState({});
  const [payment, setPayment] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(paymentStorageKey) || "null");
    } catch {
      return null;
    }
  });
  const [payments, setPayments] = useState([]);
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [hasMorePayments, setHasMorePayments] = useState(false);
  const workspacePlan = actor.role === "parent" || actor.role === "teacher" ? actor.role : null;
  const visiblePlans = plans.filter((plan) => !workspacePlan || String(plan.kind).toLowerCase() === workspacePlan);
  const visibleOwnedPlans = actor.plans.filter((plan) => !workspacePlan || plan === workspacePlan);
  const visibleQuotas = quotas.filter((quota) => quotaBelongsToRole(quota, actor.role));
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [planRows, quotaRows] = await Promise.all([
        workspaceApi.listPlans(),
        workspaceApi.getQuota(),
      ]);
      setPlans(planRows || []);
      setQuotas(Array.isArray(quotaRows) ? quotaRows : quotaRows?.items || quotaRows?.quotas || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };
  const loadPayments = async (page = 0, append = false) => {
    setPaymentsLoading(true);
    try {
      const result = await workspaceApi.listPayments({ page, size: 10 });
      const rows = Array.isArray(result)
        ? result
        : Array.isArray(result?.content)
          ? result.content
          : [];
      setPayments((current) => (append ? [...current, ...rows] : rows));
      setPaymentPage(page);
      setHasMorePayments(rows.length === 10);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setPaymentsLoading(false);
    }
  };
  // Public plan prices are loaded independently from the account's owned entitlements.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    void loadPayments();
    void auth.ensureEntitlements().catch(() => {});
  }, []);
  const buy = async (kind, addon = false, packs = 1) => {
    const normalizedPacks = Math.max(1, Math.floor(Number(packs) || 1));
    setBuying(kind);
    setError("");
    try {
      const created = addon
        ? await workspaceApi.createAddonPayment(kind, normalizedPacks)
        : await workspaceApi.createPayment(kind);
      setPayment(created);
      try { sessionStorage.setItem(paymentStorageKey, JSON.stringify(created)); } catch { /* QR remains visible in memory. */ }
      setBuying("");
    } catch (buyError) {
      setError(buyError.message);
      setBuying("");
    }
  };
  return (
    <>
      <Heading
        title="Gói học tập"
        description="Chọn gói phù hợp để đồng hành cùng trẻ trên hành trình tài chính."
      >
        <button
          className="ws-btn"
          onClick={() => {
            void load();
            void loadPayments();
          }}
          disabled={loading || paymentsLoading}
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      <section className="ws-card ws-current-plan">
        <div>
          <strong>Gói đang có</strong>
          <p>
            {visibleOwnedPlans.map((p) => PLANS[p].name).join(" + ") ||
              "Tài khoản của bạn hiện chưa có gói học tập."}
          </p>
        </div>
        {visibleOwnedPlans.length > 0 && (
          <span className="ws-plan-validity">Quyền sử dụng vĩnh viễn</span>
        )}
      </section>
      {visibleQuotas.length > 0 && (
        <section className="ws-card ws-slot-wallet-section">
          <div className="ws-slot-wallet-heading">
            <div><span className="ws-slot-wallet-icon"><WalletCards /></span><div><h2>{actor.role === "parent" ? "Ví slot gia đình" : "Ví slot giáo viên"}</h2><p>{actor.role === "parent" ? "Mỗi hồ sơ con sử dụng 1 slot trong gói Gia đình." : "Quản lý số chỗ có thể cấp cho học sinh và lớp học."}</p></div></div>
            <span className="ws-pill">Sử dụng vĩnh viễn</span>
          </div>
          <div className="ws-slot-wallet-list">
            {visibleQuotas.map((quota) => actor.role === "parent" ? (
              <article className="ws-family-capacity" key={quota.context || quota.plan}>
                <div className="ws-family-capacity-available">
                  <span>Có thể tạo thêm</span>
                  <strong>{quota.free ?? "—"}<small>hồ sơ con</small></strong>
                  <p>{quota.free == null ? "Chưa có dữ liệu slot khả dụng." : Number(quota.free) > 0 ? "Bạn có thể tạo hồ sơ mới tại mục Các con." : "Đã hết slot khả dụng. Mua thêm slot bên dưới để tạo hồ sơ mới."}</p>
                </div>
                <div className="ws-family-capacity-details">
                  <dl>
                    <div><dt>Slot đã mua</dt><dd>{quota.limit ?? "—"}</dd><small>Slot từ gói và mua thêm</small></div>
                    <div><dt>Slot đã sử dụng</dt><dd>{quota.used ?? "—"}</dd><small>Gồm cả hồ sơ đã xóa</small></div>
                    <div><dt>Hồ sơ đã xóa</dt><dd>{quota.wiped ?? "—"}</dd><small>Vẫn tính là slot đã sử dụng</small></div>
                  </dl>
                  <p>Gói Gia đình: <b>{quota.base ?? "—"} slot</b><span aria-hidden="true"> · </span>Đã mua thêm: <b>{quota.extra ?? "—"} slot</b></p>
                </div>
              </article>
            ) : (
              <article className="ws-slot-wallet-card" key={quota.context || quota.plan}>
                <div className="ws-slot-wallet-total"><span>Tổng sức chứa</span><strong>{quota.limit ?? 0}</strong><small>slot đã sở hữu</small></div>
                <div className="ws-slot-wallet-stats">
                  <div><span>Còn trống</span><strong>{quota.free ?? 0}</strong><small>Sẵn sàng cấp mới</small></div>
                  <div><span>Đã sử dụng</span><strong>{quota.used ?? 0}</strong><small>Đang dùng và đã xóa</small></div>
                  <div><span>Giữ cho lớp</span><strong>{quota.reserved ?? 0}</strong><small>Đã dành trước</small></div>
                </div>
                <footer><span>Gói gốc <b>{quota.base ?? 0}</b> + mua thêm <b>{quota.extra ?? 0}</b></span><span>Đã xóa <b>{quota.wiped ?? 0}</b> slot</span></footer>
              </article>
            ))}
          </div>
          {actor.role === "parent" ? (
            <p className="ws-slot-wallet-note"><span className="ws-family-capacity-note-label">Lưu ý:</span> Xóa hồ sơ con không hoàn lại slot. Hồ sơ đã xóa vẫn được tính vào số slot đã sử dụng.</p>
          ) : (
            <p className="ws-slot-wallet-note">Slot đã xóa vẫn được tính là đã sử dụng và không được hoàn lại.</p>
          )}
        </section>
      )}
      {error && (
        <p className="ws-notice" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <Empty>Đang tải bảng giá…</Empty>
      ) : visiblePlans.length ? (
        <div className={`ws-grid ws-public-plans ${visiblePlans.length === 1 ? "ws-public-plans--single" : "two"}`}>
          {visiblePlans.map((plan) => {
            const copy = PLAN_COPY[plan.kind] || {
              name: plan.kind,
              description: "Gói học tập FinTeen.",
              benefits: [],
            };
            const owned = actor.plans.includes(String(plan.kind).toLowerCase());
            const packs = Math.max(1, Math.floor(Number(addonPacks[plan.kind]) || 1));
            return (
              <article
                className={`ws-card ws-plan ws-plan-${String(plan.kind).toLowerCase()} ${plan.kind === "TEACHER" ? "featured" : ""}`}
                key={plan.kind}
              >
                <div className="ws-plan-info">
                <div className="ws-row">
                  <span className="ws-pill">{plan.kind}</span>
                  {owned && <span className="ws-owned-plan">Đang sử dụng</span>}
                </div>
                <h2>{copy.name}</h2>
                <p>{copy.description}</p>
                <ul>
                  {copy.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                </div>
                <div className="ws-plan-purchase">
                <div className="ws-plan-number">
                  {money(owned && plan.addonPrice != null ? plan.addonPrice : plan.price)}{" "}
                  <span>
                    {owned && plan.addonPrice != null
                      ? `· thêm ${Number(plan.addonSlots || 0)} slot`
                      : "· mua 1 lần, dùng mãi"}
                  </span>
                </div>
                {owned && plan.addonPrice != null && (
                  <div className="ws-plan-note">
                    <label>
                      Số lượng mua thêm
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={packs}
                        onChange={(event) => setAddonPacks((current) => ({
                          ...current,
                          [plan.kind]: Math.max(1, Math.floor(Number(event.target.value) || 1)),
                        }))}
                      />
                    </label>
                    <p>
                      Nhận thêm {Number(plan.addonSlots || 0) * packs} slot · Tổng {money(Number(plan.addonPrice) * packs)}
                    </p>
                  </div>
                )}
                <button
                  className="ws-btn primary"
                  disabled={Boolean(buying) || (owned && plan.addonPrice == null)}
                  onClick={() => void buy(plan.kind, owned, packs)}
                >
                  {buying === plan.kind
                    ? "Đang tạo đơn…"
                    : owned
                      ? plan.addonPrice == null ? "Chưa mở bán slot thêm" : `Mua thêm ${Number(plan.addonSlots || 0) * packs} slot`
                      : "Mua gói ngay"}
                </button>
                <small className="ws-plan-note">
                  Mã VietQR và thông tin chuyển khoản sẽ hiển thị ngay tại đây.
                </small>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <Empty>Hiện chưa có gói nào được mở bán.</Empty>
      )}
      <section className="ws-card ws-payment-history">
        <div className="ws-row">
          <div>
            <h2>Lịch sử thanh toán</h2>
            <p>Các giao dịch mua mới và gia hạn gói, mới nhất trước.</p>
          </div>
          <button
            className="ws-btn"
            onClick={() => void loadPayments()}
            disabled={paymentsLoading}
          >
            <RefreshCw size={15} /> Cập nhật
          </button>
        </div>
        {paymentsLoading && !payments.length ? (
          <Empty>Đang tải lịch sử thanh toán…</Empty>
        ) : payments.length ? (
          <div className="ws-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Gói</th>
                  <th>Loại</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((row) => (
                  <tr key={row.orderCode}>
                    <td>
                      <strong>{row.orderCode}</strong>
                    </td>
                    <td>{PLAN_NAME[row.kind] || row.kind}</td>
                    <td>
                      {row.purpose === "ADDON"
                        ? Number(row.slots || row.addonSlots || 0) > 0
                          ? `Mua thêm ${Number(row.slots || row.addonSlots)} slot`
                          : "Mua thêm slot"
                        : row.purpose === "RENEW"
                          ? "Gia hạn cũ"
                          : "Mua gói"}
                    </td>
                    <td>
                      <strong>{money(row.amount)}</strong>
                    </td>
                    <td>
                      <span
                        className={`ws-payment-status ${String(row.status).toLowerCase()}`}
                      >
                        {PAYMENT_STATUS[row.status] || row.status}
                      </span>
                    </td>
                    <td>
                      {paymentDateTime(row.paidAt || row.createdAt)}
                      <small>
                        {row.paidAt
                          ? "Thời điểm thanh toán"
                          : "Thời điểm tạo đơn"}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>Bạn chưa có giao dịch thanh toán nào.</Empty>
        )}
        {hasMorePayments && (
          <button
            className="ws-btn ws-load-more"
            disabled={paymentsLoading}
            onClick={() => void loadPayments(paymentPage + 1, true)}
          >
            {paymentsLoading ? "Đang tải…" : "Xem thêm giao dịch"}
          </button>
        )}
      </section>
      {payment && (
        <div
          className="payment-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Thanh toán gói học tập"
        >
          <Suspense fallback={<PageLoader compact label="Đang mở thanh toán…" />}>
            <PaymentResult
              payment={payment}
              onClose={() => {
                setPayment(null);
                try { sessionStorage.removeItem(paymentStorageKey); } catch { /* Ignore unavailable storage. */ }
                void loadPayments();
              }}
            />
          </Suspense>
        </div>
      )}
    </>
  );
}
export function Settings() {
  const { actor } = useWorkspace();
  return <AccountSettings actor={actor} />;
}
