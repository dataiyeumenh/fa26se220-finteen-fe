import { vietnameseError } from "../../lib/vietnameseMessages.js";

const LEARNER_MANAGEMENT_ERRORS = {
  3004: "Bạn không có quyền thao tác với nhóm hoặc hồ sơ này.",
  3005: "Bạn cần mua gói học tập trước khi tạo lớp hoặc hồ sơ mới.",
  3006: "Ví slot đã hết chỗ trống. Hãy mua thêm slot để tiếp tục.",
  3026: "Nhóm đã đủ số hồ sơ dự kiến.",
  5001: "Bạn đã có một nhóm đang mở. Hãy kết thúc nhóm cũ trước.",
  5002: "Nhóm này đã kết thúc.",
  5003: "Vui lòng xác nhận đã có sự đồng ý của phụ huynh trước.",
  5004: "Hồ sơ này không còn hoạt động.",
};

export const learnerManagementError = (error) =>
  LEARNER_MANAGEMENT_ERRORS[error?.code] ||
  vietnameseError(error, "Không thể hoàn thành thao tác. Vui lòng thử lại.");
