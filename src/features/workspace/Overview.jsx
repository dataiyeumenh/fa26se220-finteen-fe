import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, RefreshCw } from "lucide-react";
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
  const [plans, setPlans] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState("");
  const [payment, setPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [hasMorePayments, setHasMorePayments] = useState(false);
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
  const buy = async (kind, addon = false) => {
    setBuying(kind);
    setError("");
    try {
      const created = addon
        ? await workspaceApi.createAddonPayment(kind, 1)
        : await workspaceApi.createPayment(kind);
      setPayment(created);
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
            {actor.plans.map((p) => PLANS[p].name).join(" + ") ||
              "Tài khoản của bạn hiện chưa có gói học tập."}
          </p>
        </div>
        {actor.plans.length > 0 && (
          <span className="ws-plan-validity">Quyền sử dụng vĩnh viễn</span>
        )}
      </section>
      {quotas.length > 0 && (
        <section className="ws-card">
          <h2>Ví slot</h2>
          <p>Slot đã xóa vẫn được tính là đã dùng và không được hoàn lại.</p>
          <div className="ws-grid two">
            {quotas.map((quota) => (
              <article className="ws-card" key={quota.context || quota.plan}>
                <strong>{quota.context === "CLASS" || quota.plan === "TEACHER" ? "Ví giáo viên" : "Ví gia đình"}</strong>
                <p>Đã có: {quota.limit ?? 0} · Đã dùng: {quota.used ?? 0}</p>
                <p>Đang giữ cho lớp: {quota.reserved ?? 0} · Còn trống: {quota.free ?? 0}</p>
                <small>Gói gốc {quota.base ?? 0} + mua thêm {quota.extra ?? 0} · đã xóa {quota.wiped ?? 0}</small>
              </article>
            ))}
          </div>
        </section>
      )}
      {error && (
        <p className="ws-notice" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <Empty>Đang tải bảng giá…</Empty>
      ) : plans.length ? (
        <div className="ws-grid two ws-public-plans">
          {plans.map((plan) => {
            const copy = PLAN_COPY[plan.kind] || {
              name: plan.kind,
              description: "Gói học tập FinTeen.",
              benefits: [],
            };
            const owned = actor.plans.includes(String(plan.kind).toLowerCase());
            return (
              <article
                className={`ws-card ws-plan ws-plan-${String(plan.kind).toLowerCase()} ${plan.kind === "TEACHER" ? "featured" : ""}`}
                key={plan.kind}
              >
                <div className="ws-row">
                  <span className="ws-pill">{plan.kind}</span>
                  {owned && <span className="ws-owned-plan">Đang sử dụng</span>}
                </div>
                <h2>{copy.name}</h2>
                <p>{copy.description}</p>
                <div className="ws-plan-number">
                  {money(plan.price)} <span>· mua 1 lần, dùng mãi</span>
                </div>
                {owned && plan.addonPrice != null && (
                  <p className="ws-plan-note">
                    Gói thêm {plan.addonSlots} slot: {money(plan.addonPrice)} / pack
                  </p>
                )}
                <ul>
                  {copy.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <button
                  className="ws-btn primary"
                  disabled={Boolean(buying)}
                  onClick={() => void buy(plan.kind, owned)}
                  disabled={Boolean(buying) || (owned && plan.addonPrice == null)}
                >
                  {buying === plan.kind
                    ? "Đang tạo đơn…"
                    : owned
                      ? plan.addonPrice == null ? "Chưa mở bán slot thêm" : `Mua thêm ${plan.addonSlots} slot`
                      : "Mua gói ngay"}
                </button>
                <small className="ws-plan-note">
                  Mã VietQR và thông tin chuyển khoản sẽ hiển thị ngay tại đây.
                </small>
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
                    <td>{row.purpose === "RENEW" ? "Gia hạn" : "Mua mới"}</td>
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
