const ERROR_MESSAGES = {
  3002: "Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại.",
  3003: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  3004: "Bạn không có quyền thực hiện thao tác này.",
  3005: "Gói sử dụng đã hết hạn. Vui lòng gia hạn để tiếp tục.",
  3006: "Nhóm đã hết chỗ.",
  3007: "Không tìm thấy mã truy cập. Vui lòng kiểm tra lại.",
  3008: "Mã PIN đã bị khóa do nhập sai nhiều lần. Vui lòng đợi 15 phút rồi thử lại.",
  3009: "Nhóm hoặc lớp học đã kết thúc. Mã truy cập không còn sử dụng được.",
  3011: "Email chưa được xác minh. Vui lòng nhập mã xác minh để tiếp tục.",
  3012: "Mã xác minh không hợp lệ hoặc đã được sử dụng. Vui lòng yêu cầu mã mới.",
  3013: "Mã xác minh đã hết hạn. Vui lòng yêu cầu mã mới.",
  3014: "Email đã được xác minh. Bạn có thể đăng nhập.",
  3016: "Tài khoản tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau 15 phút.",
  3017: "Mã đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng. Vui lòng yêu cầu mã mới.",
  3018: "Mã đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu mã mới.",
  3020: "Email này đã đăng ký bằng mật khẩu. Hãy đăng nhập bằng mật khẩu, rồi vào Tài khoản để liên kết Google.",
  3021: "Google này đã liên kết với tài khoản FinTeen khác. Hãy chọn tài khoản Google khác.",
  5001: "Bạn đã có nhóm đang mở. Hãy kết thúc nhóm cũ trước.",
  5002: "Nhóm đã kết thúc.",
  5003: "Vui lòng xác nhận đã có sự đồng ý của phụ huynh trước.",
  5004: "Hồ sơ trẻ này không còn hoạt động.",
  8001: "Không tìm thấy bài kiểm tra phù hợp.",
  8002: "Bài kiểm tra đã phát hành hoặc là bài kiểm tra sau khi học nên không thể thay đổi.",
  8003: "Học sinh này chưa nộp bài.",
  8004: "Bài kiểm tra đã quá hạn nộp.",
  8005: "Bạn đã nộp bài này rồi.",
  8006: "Câu trả lời không khớp với đề.",
  8007: "Một câu hỏi đã bị rút, không tồn tại hoặc không dùng được cho đề giáo viên.",
  8008: "Chỉ lớp đang mở mới sử dụng được bài kiểm tra.",
};

const HTTP_MESSAGES = {
  400: "Thông tin gửi lên chưa hợp lệ. Vui lòng kiểm tra lại.",
  401: "Vui lòng đăng nhập lại để tiếp tục.",
  403: "Bạn không có quyền thực hiện thao tác này.",
  404: "Không tìm thấy dữ liệu được yêu cầu.",
  409: "Dữ liệu đã thay đổi hoặc bị trùng. Vui lòng tải lại rồi thử lại.",
  413: "Tệp tải lên quá lớn. Vui lòng chọn tệp nhỏ hơn.",
  422: "Thông tin gửi lên chưa hợp lệ. Vui lòng kiểm tra lại.",
  429: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một lúc rồi thử lại.",
};

// Keep detailed Vietnamese errors from the server; translate English responses
// at the API boundary so every page receives a user-facing Vietnamese message.
export function vietnameseApiMessage(message, code, status, fallback = "Yêu cầu không thành công. Vui lòng thử lại.") {
  const text = typeof message === "string" ? message.trim() : "";
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/iu.test(text.normalize("NFC"))) return text;
  return ERROR_MESSAGES[code] || HTTP_MESSAGES[status] ||
    (status >= 500 ? "Máy chủ đang gặp sự cố. Vui lòng thử lại sau." : fallback);
}

export function vietnameseError(error, fallback = "Đã xảy ra lỗi. Vui lòng thử lại.") {
  if (error instanceof SyntaxError)
    return "JSON chưa hợp lệ. Vui lòng kiểm tra dấu ngoặc, dấu nháy và dấu phẩy.";
  return vietnameseApiMessage(error?.message, error?.code, error?.status, fallback);
}
