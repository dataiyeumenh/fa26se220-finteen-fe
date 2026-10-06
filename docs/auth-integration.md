# Kết nối auth người lớn

Đã nối theo `auth (1).md` và `README (1).md` cập nhật OTP ngày 06/10/2026.

## Chạy

- Chạy `npm install`, sau đó `npm run dev`; mở **http://localhost:5173** (không dùng 127.0.0.1). Port cố định để khớp CORS production.
- `.env` cấu hình backend production. Đây là **dữ liệu thật**. Không còn URL backend mặc định hardcode trong code.
- Máy mới: copy `.env.example` thành `.env`. Điền Firebase Web config được gửi riêng vào `.env`, rồi khởi động lại Vite. Không dùng service-account JSON/private key. `.env` được gitignore; chỉ commit `.env.example`. Nếu đã có `.env.local`, Vite ưu tiên các giá trị trong file đó.
- `VITE_SWAGGER_URL` là link tài liệu, không phải URL gửi request API.
- Backend local: đặt `VITE_API_BASE_URL=http://localhost:8080` (không `/finteen`).
- Chưa có config: Google tự khóa; đăng nhập mật khẩu không phụ thuộc Firebase.

## Đã nối

Tất cả code gọi API nằm trong `src/api`: `auth.client.js` chứa endpoint và xử lý response/token; `auth.api.js` khởi tạo phiên dùng chung; `firebase.js` xử lý Google; `config.js` đọc biến môi trường. Đã xóa `dashboard.api.js` giả lập; các dashboard cũ hiện trạng thái chưa kết nối thay vì số liệu mẫu. `src/features/auth/AccountSettings.jsx` chỉ là giao diện.

Đăng ký → màn nhập OTP → POST `/api/auth/verify {email, otp}` → nhận token → `/me` → dashboard (Guest khi chưa có gói). Lỗi đăng nhập 3011 chuyển sang màn OTP. Gửi lại xác minh dùng query email, khóa nút 60 giây. Quên mật khẩu → màn OTP và mật khẩu mới → POST `/api/auth/password/reset {email, otp, newPassword}` → quay lại đăng nhập; không tự đăng nhập sau reset. Không gọi link GET hoặc trang HTML cũ. OTP giữ dạng chuỗi để không mất số 0 đầu, 6 số, BE kiểm hạn 10 phút và vô hiệu sau 5 lần sai. Mã mới thay mã cũ. Không lưu OTP hay mật khẩu vào storage. Đổi mật khẩu vẫn thay token mới; Google login/link qua Firebase `user.getIdToken()`, theo [Firebase Web Auth](https://firebase.google.com/docs/auth/web/google-signin).

Token ACCOUNT giữ trong sessionStorage theo base URL; không lưu mật khẩu, không lưu Firebase token, không dùng cookie, không giả lập refresh token. Reload/focus tải lại `/me`, hết hạn theo `expiresIn` hoặc lỗi 3003 thì xóa phiên. 3002 (sai mật khẩu) không tự đăng xuất. sessionStorage vẫn có rủi ro XSS, nên không chèn HTML không tin cậy. Đăng xuất xóa phiên phía FE; BE chưa cung cấp endpoint logout/revoke.

Quyền/gói lấy từ `/me`, không suy ra từ JWT hay lựa chọn vai trên form. Đã gỡ kho tài khoản/phiên workspace demo, mật khẩu mẫu, seed nhân sự và xác thực nội bộ local. Không đọc localStorage để khôi phục tài khoản. Kid khóa đăng nhập trong lúc chờ `slot.md`; nội bộ hiển thị chưa kết nối API. Các thao tác chưa có backend bị từ chối, không giả lập thành công. Nội dung game/chơi thử vẫn giữ nguyên.

## Xóa dữ liệu cũ trong trình duyệt

Đóng các tab FinTeen khác. Tại `http://localhost:5173`, mở F12 → Application → Storage, chọn đúng origin localhost:5173 và Clear site data; sau đó tải lại trang. Thao tác này xóa dữ liệu demo cũ và đăng xuất trên origin đó, không xóa tài khoản backend. Nếu từng dùng `127.0.0.1` hoặc port khác, cần làm riêng trên origin đó. Có thể xóa riêng các khóa `finteen.workspace.demo.v1`, `finteen.internal.demo.v1` trong Local Storage; `finteen.workspace.session.v1`, `finteen.internal.session.v1` và khóa bắt đầu bằng `finteen.account.v1:` trong Session Storage. Không cần xóa lịch sử hay dữ liệu tất cả website. Lỗi 3001 do BE trả về không được giải quyết bằng xóa storage.

## Người dùng kiểm tra email thật

1. Đăng ký Gmail của bạn → màn nhập OTP, chưa có token; nhập mã đúng → vào Guest ngay, không đăng nhập lại.
2. Đăng nhập trước xác minh: 3011 chuyển sang OTP. Kiểm tra cooldown 60 giây, Inbox/Spam; thử mã sai 3012, hết hạn 3013, đã xác minh 3014. Gửi lại thì dùng mã mới nhất.
3. Reload trang, kiểm tra tên/gói đúng; đăng xuất rồi đăng nhập lại.
4. Quên mật khẩu: thông báo trung tính kể cả email không tồn tại. Nhập OTP + mật khẩu mới ngay trong FE; thử 3017/3018; thành công quay lại đăng nhập bằng mật khẩu mới, phiên cũ bị từ chối.
5. Trong Tài khoản: thử sai mật khẩu cũ (giữ phiên), xác nhận không khớp (không gửi), đổi đúng (tiếp tục dùng token mới).
6. Có Firebase config: Google account mới; email đã có mật khẩu → 3020 → đăng nhập mật khẩu rồi liên kết. Thử Google đã gắn tài khoản khác → 3021, hủy/chặn popup và đăng nhập lại sau liên kết.
7. Kiểm tra mất mạng, khôi phục mạng, hết hạn token và tài khoản có cả hai gói.

Không tự động chạy test tạo tài khoản hay gửi email production. Test mock: `node --test tests/auth-api.test.mjs`. Build: `npm run build`.

Kiểm tra toàn bộ auth (client + render): `npm run test:auth`. Firebase SDK tải động khi bấm Google. Override `@grpc/grpc-js` lên bản vá 1.14.5 để tránh dependency có cảnh báo của Firestore đi kèm SDK (app không dùng Firestore). Audit còn cảnh báo `brace-expansion` trong dependency tooling có sẵn, không thuộc phần auth. Build còn cảnh báo chunk chính lớn hơn 500 kB.
