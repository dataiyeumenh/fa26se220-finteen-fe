# Cá nhân hoá trước CH01

Triển khai theo tài liệu `personalization.md` của BE #57 và yêu cầu PR 1. Các schema đã được đối chiếu với OpenAPI production ngày 14/11/2026.

- Trên thẻ hồ sơ FAMILY, phụ huynh xem trạng thái và mở “Cá nhân hoá cho bé”. Ba nhóm nút lấy giá trị từ `catalog`; mỗi nhóm có lựa chọn không biết. PUT ghi đè đủ ba chiều, dùng `null` cho chiều để bé chọn.
- Trong form phụ huynh, dòng chỉ đọc “Bé đang nhận nội dung” hiển thị nhãn cuối từ `labels`. Các nút vẫn dùng `parent`, kể cả khi bé đã trả lời. Chiều thiếu nhãn hiển thị “bản gốc”.
- Trên thẻ học sinh CLASS, giáo viên chỉ xem trạng thái qua GET, không có form chỉnh sửa.
- Bé vào CH01 gọi GET cá nhân hoá. `NOT_STARTED`/`WAITING_CHILD` hỏi theo `askChild`, gửi nguồn `CHILD`; `WAITING_GAME` chọn nhân vật/đồ theo `askInGame`, gửi nguồn `GAME` và không gửi tuổi. Bỏ qua vẫn PUT `answers: {}`. `COMPLETED`/`SKIPPED` mở chương ngay. Lỗi GET/PUT giữ bước hiện tại và cho thử lại.
- Bé tải chương qua `/api/play/releases/{version}/chapters/{code}` bằng token SLOT. Khách xem thử tiếp tục dùng đường công khai. FE giữ nguyên `releaseVersion`, `variantKey` và dữ liệu chương trong player, không ghép nội dung và không thêm cache chương cá nhân hoá. Checkpoint khác `variantKey` không được khôi phục để tránh trộn quyết định giữa các bản.
- Payload kết thúc chương giữ hợp đồng `ChapterBatchRequest`: không thêm `variantKey` vì API này không khai báo trường đó.

## Kiểm thử

```sh
npm run test:personalization
npm run test:personalization:browser
node --test --test-concurrency=1 tests/personalization.test.mjs tests/visual-novel-progress.test.mjs tests/kid-play-progress.test.mjs tests/kid-demo.test.mjs tests/auth-api.test.mjs tests/teacher-slot-consent.test.mjs
npm run build
```

Browser test dùng Chrome headless (đường dẫn Windows mặc định, hoặc biến `BROWSER_EXECUTABLE`), lưu kết quả tại `output/personalization/browser.json`. Kiểm thử dùng API mô phỏng, không ghi dữ liệu lên production.

## Hai ca kiểm tra production trước khi bàn giao lead

Cần tài khoản chủ FAMILY, chủ CLASS và phiên SLOT của bé để thực hiện:

1. Phụ huynh lưu Nữ cho bé. Trong phiên SLOT của đúng bé, GET `/api/play/personalization` phải có `labels.gender = "FEMALE"` và `parent = null`.
2. Chủ CLASS gọi PUT `/api/slots/{slotId}/personalization` phải nhận HTTP 403, mã 3004. Giao diện giáo viên chỉ có trạng thái.

Các kiểm thử tự động xác nhận payload, token và xử lý lỗi 403; chúng không chứng minh dữ liệu/quyền trên production. Chưa thực hiện hai ca này khi không có phiên đăng nhập thử nghiệm.
