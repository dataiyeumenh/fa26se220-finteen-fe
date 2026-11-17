export const ADMIN_ROLE_LABELS = {
  ADMIN: "Quản trị viên",
  GAME_MANAGER: "Quản lý nội dung",
  GAME_EDITOR: "Biên tập viên",
  GAME_REVIEWER: "Kiểm duyệt viên",
};

export const PLAN_LABELS = {
  PARENT: "Phụ huynh",
  TEACHER: "Giáo viên",
};

export const TRANSACTION_STATUS_LABELS = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
};

export const LEARNER_STATUS_LABELS = {
  ACTIVE: "Đang hoạt động",
  ARCHIVED: "Đã lưu trữ",
  WIPED: "Đã xóa dữ liệu",
};

export const ENTITLEMENT_SOURCE_LABELS = {
  PAYMENT: "Thanh toán",
  ADMIN: "Quản trị viên cấp",
  MANUAL: "Cấp thủ công",
  PROMOTION: "Khuyến mãi",
  MIGRATION: "Chuyển đổi dữ liệu",
};

export const PROVIDER_LABELS = {
  GOOGLE: "Google",
  "google.com": "Google",
  PASSWORD: "Email và mật khẩu",
  password: "Email và mật khẩu",
  LOCAL: "Email và mật khẩu",
};

const labelOf = (labels, value) => labels[value] || value || "—";

export const adminRoleLabel = (value) => labelOf(ADMIN_ROLE_LABELS, value);
export const planLabel = (value) => labelOf(PLAN_LABELS, value);
export const planClassName = (value) => value === "TEACHER"
  ? "plan-teacher"
  : value === "PARENT"
    ? "plan-parent"
    : "";
export const transactionStatusLabel = (value) => labelOf(TRANSACTION_STATUS_LABELS, value);
export const learnerStatusLabel = (value) => labelOf(LEARNER_STATUS_LABELS, value);
export const entitlementSourceLabel = (value) => labelOf(ENTITLEMENT_SOURCE_LABELS, value);
export const providerLabel = (value) => labelOf(PROVIDER_LABELS, value);
