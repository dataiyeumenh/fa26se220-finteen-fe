export const LOGIN_FAILURE_MESSAGE =
  "Không thể đăng nhập. Vui lòng kiểm tra thông tin đăng nhập và thử lại.";

// Never display server-provided login text: it can reveal accounts, roles or URLs.
export function authServiceErrorMessage(error) {
  if (error?.status === 0)
    return "Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.";
  if (error?.status === 429)
    return "Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một lúc rồi thử lại.";
  if (error?.status >= 500)
    return "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.";
  return null;
}

export function loginErrorMessage(error) {
  return authServiceErrorMessage(error) || LOGIN_FAILURE_MESSAGE;
}
