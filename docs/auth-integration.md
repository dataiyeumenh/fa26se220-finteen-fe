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

## Kiểm tra

```powershell
npm run test:auth
```

Đây là hướng dẫn chạy kiểm tra; không khẳng định đã kiểm thử đăng nhập production trong đợt dọn tài liệu. Luồng xác thực được minh họa trong [sơ đồ ACCOUNT/SLOT](diagrams/03-authentication.svg).
