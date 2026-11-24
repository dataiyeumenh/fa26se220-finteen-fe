# Xác thực và cấu hình API

Đối chiếu source ngày **09/11/2026**: `src/api/config.js`, `auth.api.js`, `auth.client.js`, `firebase.js` và `src/features/workspace/useWorkspace.js`.

## Cấu hình

- Tạo `.env` từ `.env.example`, cấu hình `VITE_API_BASE_URL`, rồi chạy `npm install` và `npm run dev`. Vite phục vụ tại `http://localhost:5173`.
- `VITE_API_BASE_URL` là địa chỉ gửi request; `VITE_SWAGGER_URL` chỉ là địa chỉ tài liệu. Không đặt URL Swagger vào API base.
- Google login cần đủ cấu hình Firebase Web trong các biến `VITE_FIREBASE_*`. Khi thiếu cấu hình, không thể mở popup Google. Không đưa service-account/private key vào frontend.
- Xem schema biến môi trường trong `.env.example`; không ghi token hoặc mật khẩu vào tài liệu.

## ACCOUNT và SLOT

`auth.api.js` tạo một singleton bằng `createAuthClient`. `useWorkspace` đọc trạng thái qua `useSyncExternalStore`; không có React Context provider riêng cho store này.

| Phiên | Đăng nhập | Request sau đăng nhập |
| --- | --- | --- |
| ACCOUNT | `/api/auth/login`, `/api/auth/internal/login`, xác minh OTP hoặc Google | `auth.accountRequest`, header Bearer ACCOUNT |
| SLOT | `/api/slots/login` với mã hồ sơ và PIN | `auth.slotRequest`, header Bearer SLOT |
| Công khai | Không yêu cầu token | `auth.publicRequest`; content client có transport riêng |

ACCOUNT gọi `/api/auth/me` để lấy account, roles và plans. Context parent/teacher được chọn từ gói hợp lệ, lưu trong localStorage; tài khoản không có gói được ánh xạ thành guest. Quyền nội bộ lấy từ `actor.roles`, xem [internal-login.md](internal-login.md).

SLOT nhận thông tin hồ sơ từ API đăng nhập và tạo actor `role=kid`, `kind=learner`. `groupContext=FAMILY` tương ứng child/gói parent; `CLASS` tương ứng student/gói teacher. Dashboard người học lấy từ `/api/learner/dashboard` và được cache trong store.

## Bộ nhớ và hạn dùng

Token ACCOUNT/SLOT cùng `expiresAt` được lưu trong sessionStorage, theo API base URL. Context người lớn nằm riêng trong localStorage. Khi đăng nhập ACCOUNT thành công, client xóa phiên SLOT cũ.

`startAuth` phục hồi ACCOUNT bằng `/api/auth/me`, refresh khi cửa sổ được focus và kiểm tra hết hạn mỗi giây. Đây không phải cơ chế refresh token. `accountRequest` và `slotRequest` chọn đúng phiên, kiểm tra hạn dùng trước khi gọi API; request dùng `credentials: omit` và timeout 20 giây. Client chỉ nhận thành công khi HTTP thành công và `ApiResponse.code === 0`, trả về `result`.

Đăng xuất phía frontend xóa phiên trong store/storage. Lỗi phiên ACCOUNT 3003 và các lỗi phiên SLOT 3003/3007/3009 được xử lý theo từng loại phiên. UI guards kiểm tra role/plan; backend vẫn cần thực thi quyền trên API.

Google login tải động Firebase SDK, mở popup, lấy ID token rồi gửi đến `/api/auth/login/google` để nhận ACCOUNT. Firebase chỉ giữ phiên trong bộ nhớ và đăng xuất sau khi lấy token; ứng dụng không dùng Firestore để lưu dữ liệu nghiệp vụ.

## Thông báo xác thực không tiết lộ tài khoản

- Đăng nhập sai mật khẩu, tài khoản không tồn tại, bị khóa hoặc dùng sai cổng đều hiển thị: **Không thể đăng nhập. Vui lòng kiểm tra thông tin đăng nhập và thử lại.** Áp dụng cho người dùng, nội bộ, Google và mã/PIN học sinh.
- FE không hiển thị nguyên văn lỗi máy chủ ở bước đăng nhập và không đưa liên kết sang cổng khác trong thông báo lỗi. Lỗi đăng nhập cũng không tự chuyển sang bước xác minh email dựa trên mã lỗi; xác minh đăng ký vẫn đi qua luồng OTP riêng.
- Quên mật khẩu và gửi lại mã có cùng thông báo trung lập cho tài khoản đủ hoặc không đủ điều kiện. Lỗi mạng, giới hạn yêu cầu và sự cố dịch vụ dùng thông báo cố định, không kèm dữ liệu tài khoản hay URL.
- **Yêu cầu BE cần phối hợp:** từ chối sai cổng trước khi cấp token; trả cùng HTTP status, mã lỗi công khai và cấu trúc thông báo cho các lỗi thông tin đăng nhập; xử lý thời gian phản hồi nhất quán để hạn chế dò tài khoản. Chi tiết nguyên nhân chỉ ghi trong log được bảo vệ, không ghi mật khẩu/OTP/token.
- Bản sửa FE chỉ kiểm soát nội dung ứng dụng hiển thị. FE không thay đổi được response body/status hoặc thời gian xử lý của BE; không được xem việc ẩn URL là thay thế cho kiểm tra quyền tại API.

Tham khảo: [OWASP Authentication Cheat Sheet — Authentication Responses](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses).

## Kiểm tra

```powershell
npm run test:auth
```

Đây là hướng dẫn chạy kiểm tra; không khẳng định đã kiểm thử đăng nhập production trong đợt dọn tài liệu. Luồng xác thực được minh họa trong [sơ đồ ACCOUNT/SLOT](diagrams/03-authentication.svg).
