# PR 3: Dọn cho production

- Logo `public/brand/finteen-logo-v2.webp` được thu nhỏ từ 2172×724 xuống 400×133, giữ nền trong suốt. Dung lượng giảm từ 196290 xuống 7992 byte. Loading và trang 404 cũng dùng logo WebP này.
- `vercel.json` đặt `Cache-Control: public, max-age=31536000, immutable` cho `/assets/(.*)`, là thư mục chứa các file có hash do Vite sinh ra. Cần deploy lên Vercel rồi kiểm tra response headers để xác nhận cấu hình đã được áp dụng trên hosting.
- Bỏ `startScrollbars`, observer quét DOM, CSS và dependency OverlayScrollbars; thay bằng CSS scrollbar native, có hỗ trợ chế độ forced colors.
- Các trang Kid, Parent, Teacher và báo cáo học sinh được tải qua `lazy` trong `App.jsx`, có `Suspense` hiển thị loading. `PaymentResult` được tải khi mở thanh toán từ `Overview.jsx`.
- ErrorBoundary ở gốc ứng dụng và quanh player hiển thị thông báo cùng nút **Tải lại** khi render lỗi. Nút tải lại trang; boundary không xoá checkpoint đã lưu.
- `conditions.js` không còn thực thi biểu thức bằng `new Function`. Chuỗi và các object biểu thức `check`/`expression`/`formula` trả `false`; giữ `DEFAULT_FALLBACK` cho ending, điều kiện cấu trúc v2 và so sánh field không chạy mã.
- `npm test` chạy mọi file `tests/*.test.mjs`. Runner liệt kê file tường minh để chạy được trên Node 20 Windows, đồng thời chạy tuần tự để các test Vite không tranh cổng HMR. Có thể truyền thêm tham số Node test runner qua `npm test -- ...`.

## Kiểm tra

```sh
npm test
npm run test:production:browser
npm run test:personalization:browser
npm run build
```

Browser tests cần Chrome tại đường dẫn mặc định Windows hoặc đặt `BROWSER_EXECUTABLE`. Chúng dùng profile riêng và API giả lập; không gửi lựa chọn, câu trả lời hay kết quả chơi lên production. Kết quả kiểm tra recovery UI nằm ở `output/pr3/browser.json`.

Browser test production kiểm tra lỗi render ở gốc, lỗi trong boundary player, loading của lazy component, lỗi tải chunk và bấm **Tải lại** thật để phục hồi sau lỗi. Browser test cá nhân hoá kiểm tra tiếp các luồng đã có và bản đồ 9 chương giả lập.

Bộ responsive cũng đã chuyển sang kiểm tra scrollbar native và dùng cache Vite riêng để không tranh thư mục cache với test Node. Các ca trang chủ, bản đồ, preview quiz, player, menu giáo viên và editor chương được kiểm tra ở 320, 390, 768, 1024, 1440 và 1920px. Chạy lại bằng PowerShell:

```powershell
$env:RESPONSIVE_CASES = 'home,kid,quiz-preview,game,teacher-menu,editor-chapter'
npm run test:responsive
```

Kiểm tra thủ công thêm trên bản build preview: trang chủ không tải chunk Kid/Parent/Teacher/PaymentResult, logo có kích thước tự nhiên 400×133 và thanh cuộn dùng CSS native. Cấu hình cache Vercel không được áp dụng bởi `vite preview`.
