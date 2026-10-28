import { auth } from "../../api/auth.api.js";

export const hasRole = (...roles) =>
  roles.some((role) => auth.getSnapshot().actor?.roles?.includes(role));
export const currentAccountId = () => auth.getSnapshot().actor?.id || null;

const request = (client, path, options) => {
  if (
    !path.startsWith("/api/studio/") &&
    !path.startsWith("/api/admin/ai-keys")
  ) {
    throw new Error("ÄÆ°á»ng dáº«n Studio khĂ´ng há»£p lá»‡.");
  }
  return client.accountRequest(path, options);
};

export const createStudioApi = (client) => ({
  request: (path, options) => request(client, path, options),
  get: (path) => request(client, path),
  post: (path, body) => request(client, path, { method: "POST", body }),
  put: (path, body) => request(client, path, { method: "PUT", body }),
  del: (path) => request(client, path, { method: "DELETE" }),
  upload: (path, form) => request(client, path, { method: "POST", body: form }),
});

export const studioApi = createStudioApi(auth);

export const STATUS_LABEL = {
  DRAFT: "Đang soạn",
  SUBMITTED: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị trả về",
  RELEASED: "Đã phát hành",
};
export const CHANGE_CLASS = {
  PATCH: {
    label: "Sửa nhỏ",
    hint: "Sửa lỗi chính tả, ảnh, câu chữ; không đổi điều trẻ học.",
  },
  MINOR: {
    label: "Bổ sung",
    hint: "Thêm cảnh, lựa chọn hoặc nội dung mới trong chương.",
  },
  MAJOR: {
    label: "Thay đổi lớn",
    hint: "Đổi điều chương dạy, hoặc thêm chương mới.",
  },
};
export const fmtTime = (value) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";
// Lỗi nói bằng lời thường cho người soạn nội dung; không hiện mã HTTP / mã lỗi.
// Lỗi kiểm nội dung (1001) và lỗi trạng thái bản (6006) giữ nguyên câu của BE vì BE đã nói rõ chỗ sai.
const PLAIN_ERRORS = {
  3003: "Phiên đăng nhập đã hết. Hãy đăng nhập lại.",
  3004: "Tài khoản của bạn không có quyền làm việc này.",
  6001: "Có người vừa phát hành cùng lúc. Tải lại rồi thử lại.",
  6002: "Bạn không thể tự duyệt chương do chính mình sửa. Hãy nhờ một người duyệt khác.",
  6003: "Chương vừa đổi trạng thái (có thể người khác vừa thao tác). Tải lại để xem trạng thái mới.",
  6005: "Chưa có chương nào được duyệt để phát hành.",
  6007: "Bạn đã sửa một chương trong bản này nên không thể tự phát hành. Hãy nhờ một người quản lý khác.",
  6009: "Ảnh đang được nội dung dùng nên không xoá được.",
  6010: "Máy chủ chưa xử lý được ảnh lúc này. Thử lại sau ít phút.",
  8009: "Câu hỏi đã nằm trong đề đã phát nên không đổi được chữ, lựa chọn hay đáp án. Hãy tạo câu mới thay cho câu này.",
};
export const formatError = (error) =>
  PLAIN_ERRORS[error?.code] ||
  error?.message ||
  "Có lỗi không rõ. Thử lại sau.";
