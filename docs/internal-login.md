# Đăng nhập nội bộ

- Truy cập trực tiếp `/internal/login` (có thể lưu bookmark hoặc gửi đường dẫn cho nhân sự). `/internal` tự chuyển đến trang này khi chưa đăng nhập.
- Trang nội bộ gọi `POST /api/auth/internal/login {email, password}`, trang thường gọi `POST /api/auth/login`. Cùng dùng phiên ACCOUNT và lấy quyền từ `/api/auth/me`. Google chỉ hiển thị ở trang thường vì Swagger chưa có endpoint Google nội bộ.
- ADMIN vào bảng quản trị và mở Content Studio từ menu; GAME_EDITOR, GAME_REVIEWER, GAME_MANAGER vào tổng quan Studio. Các luồng chương, duyệt, phát hành, tài nguyên và câu hỏi đã nối API. Xem [STUDIO.md](STUDIO.md) trong thư mục docs để biết quyền và cách kiểm tra.
- `/internal/login` chỉ nhận ADMIN, GAME_EDITOR, GAME_REVIEWER, GAME_MANAGER. `/login` chỉ nhận tài khoản không có các vai trò này (bao gồm trẻ em). Tài khoản có cả quyền nội bộ và gói người dùng vẫn phải dùng trang nội bộ.
- Sau xác thực mật khẩu, Google hoặc OTP, frontend kiểm tra vai trò từ hồ sơ server; đăng nhập sai cổng sẽ xóa phiên vừa tạo và hiển thị đường dẫn đúng. Phiên có sẵn mở sai trang sẽ thấy thông báo cùng nút đổi tài khoản.
- Backend kiểm tra quyền đăng nhập nội bộ; frontend vẫn kiểm tra vai trò sau khi nhận hồ sơ để chặn đăng nhập nhầm trang.
- Không hiển thị liên kết nội bộ trên menu công khai. URL riêng giúp tách luồng sử dụng; backend vẫn phải kiểm tra quyền mỗi API.
- Cấp quyền qua chức năng quản trị hiện có, gọi `/api/admin/roles/grant` kèm lý do. Điều kiện chưa từng mua gói và quy tắc không tự duyệt/phát hành bản mình sửa phải do backend kiểm tra; trang login không tự cấp quyền.
- Hosting cần fallback các URL SPA, bao gồm `/internal/login`, về `index.html`.

## Thư viện ảnh

- Mở `/internal/assets` từ liên kết trong khu vực nội bộ.
- ADMIN, GAME_EDITOR và GAME_MANAGER có form tải PNG/JPEG/WebP tối đa 5 MB; GAME_REVIEWER không có form upload. Backend quyết định quyền đọc danh sách.
- `POST /api/studio/assets`: FormData gồm `file`, tùy chọn `label`, `chapterCode`; dùng Bearer ACCOUNT, không tự đặt Content-Type để trình duyệt sinh boundary.
- `GET /api/studio/assets?kind=IMAGE&chapter=CH04&q=...` để chọn ảnh; hiển thị URL server trả về, sao chép `ref` để dán vào JSON chương. `duplicate: true` hiển thị thông báo đã dùng lại bản cũ.
- Base URL phải bao gồm `/finteen`: `https://kidzeconomy.com.vn/finteen` (đã có trong `.env.example`).
- Lỗi server hiển thị message, HTTP status và code để tra cứu; không ghi token ra giao diện.
- Contract đối chiếu tại https://kidzeconomy.com.vn/finteen/v3/api-docs. Chưa kiểm thử upload có xác thực trên production do không có thông tin đăng nhập nội bộ trong phiên làm việc.
