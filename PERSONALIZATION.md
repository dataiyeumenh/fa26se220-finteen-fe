# Cá nhân hoá của phụ huynh và bé

## PR 2: Danh sách chương từ release API

- Bản đồ và báo cáo học sinh lấy số chương, số thứ tự và tên chương từ `getCurrentRelease().chapters` (`GET /api/content/current`). Dashboard cũng lấy tổng số chương từ danh sách này.
- Bỏ `PLANS.*.chapters`, `CHAPTERS` và fallback `totalChapters ?? 8`. Tiến độ chơi vẫn lấy `chaptersDone` của lần chơi trên server; tổng chương được bổ sung từ release trước khi kiểm tra tiến độ.
- Guard chỉ cho bé mở chương có trong release, đã hoàn thành hoặc là chương kế tiếp sau các chương đã xong. Khách vẫn chỉ xem thử chương 1.
- Bản đồ tạo thêm vùng theo từng hai chương; từ chương 9 dùng lại ảnh vùng cuối. Chưa cần thêm ảnh để chương mới xuất hiện. Release rỗng hiển thị thông báo chưa có chương; lỗi tải có nút thử lại.
- Browser test dùng release giả lập 9 chương để kiểm tra vùng thứ 5, tên chương thống nhất giữa bản đồ và báo cáo, mở chương 9, chặn chương 10 và thử lại sau lỗi API. Đây là kiểm tra với API giả lập, chưa phải xác nhận phát hành chương 9 trên production.

```sh
node --test --test-concurrency=1 tests/kid-play-progress.test.mjs tests/workspace-model.test.mjs tests/kid-demo.test.mjs tests/personalization.test.mjs tests/chapter-seven.test.mjs tests/chapter-eight.test.mjs tests/visual-novel-progress.test.mjs
npm run test:personalization:browser
npm run build
```

## PR 1: Luồng cá nhân hoá

Triển khai theo tài liệu `personalization.md` của BE #57 và yêu cầu PR 1. Các schema đã được đối chiếu với OpenAPI production ngày 14/11/2026.

- Trên thẻ hồ sơ FAMILY, phụ huynh xem trạng thái và mở “Cá nhân hoá cho bé”. Ba nhóm nút lấy giá trị từ `catalog`; mỗi nhóm có lựa chọn không biết. PUT ghi đè đủ ba chiều, dùng `null` cho chiều để bé chọn.
- Trong form phụ huynh, dòng chỉ đọc “Bé đang nhận nội dung” hiển thị nhãn cuối từ `labels`. Các nút vẫn dùng `parent`, kể cả khi bé đã trả lời. Chiều thiếu nhãn hiển thị “bản gốc”.
- Trên thẻ học sinh CLASS, giáo viên chỉ xem trạng thái qua GET, không có form chỉnh sửa.
- Bé chưa rõ trạng thái hoặc còn bước chưa hoàn tất được kiểm tra cá nhân hoá trước khi mở bất kỳ chương nào, kể cả đã chơi qua CH01. `NOT_STARTED`/`WAITING_CHILD` hỏi theo `askChild`, gửi nguồn `CHILD`; `WAITING_GAME` chọn nhân vật/đồ theo `askInGame`, gửi nguồn `GAME` và không gửi tuổi. Bỏ qua vẫn PUT `answers: {}`. Khi đã biết trạng thái `COMPLETED`/`SKIPPED`, FE ghi nhớ trong bộ nhớ của phiên SLOT và mở các chương sau mà không gọi GET cá nhân hoá lặp lại. Đăng nhập mới, đổi bé hoặc tải lại trang cần đọc trạng thái một lần. GET trong menu hồ sơ và PUT thành công cập nhật lại trạng thái đã nhớ; phản hồi muộn của phiên khác không được đưa vào bộ nhớ phiên hiện tại. Lỗi GET/PUT giữ bước hiện tại và cho thử lại.
- Bé mở “Cá nhân hoá của em” chỉ từ menu hồ sơ tại `/dashboard/kid/personalization`, kể cả sau khi đã hoàn tất hoặc bỏ qua. Không có mục này trên thanh điều hướng, thanh dưới điện thoại hay menu trò chơi. Màn hình hiển thị nhãn cuối và cho chọn lại ba chiều từ `catalog`. API không trả câu trả lời gốc của bé, nên form chọn lại không tự điền từ `labels`. PUT nguồn `CHILD` ghi đè câu trả lời cũ; câu chưa chọn không được gửi. Nếu server trả bước còn thiếu, FE tiếp tục hỏi/chọn phụ theo trạng thái mới.
- Player đang mở giữ nguyên cảnh, tiến độ, release và biến thể; lưu câu trả lời (ví dụ từ cửa sổ khác) không tải lại nội dung chương đang mở. Nội dung mới áp dụng từ lần mở chương tiếp theo, bao gồm mở lại chương cũ. Thay đổi câu trả lời không xoá kết quả chương đã hoàn thành trên server.
- Bé tải chương qua `/api/play/releases/{version}/chapters/{code}` bằng token SLOT. Khách xem thử tiếp tục dùng đường công khai. FE giữ nguyên `releaseVersion`, `variantKey` và dữ liệu chương trong player, không ghép nội dung và không thêm cache chương cá nhân hoá. Khi mở lại cùng chương với biến thể mới, FE khôi phục cảnh theo scene ID và giữ quyết định, tiền, điểm đã lưu: hợp đồng BE đảm bảo cá nhân hoá chỉ đổi chữ/ảnh/giọng, không đổi cấu trúc và chấm điểm. Checkpoint không hợp lệ hoặc không còn scene tương ứng vẫn bị từ chối.
- Payload kết thúc chương giữ hợp đồng `ChapterBatchRequest`: không thêm `variantKey` vì API này không khai báo trường đó.

## Kiểm thử

```sh
npm run test:personalization
npm run test:personalization:browser
node --test --test-concurrency=1 tests/personalization.test.mjs tests/visual-novel-progress.test.mjs tests/kid-play-progress.test.mjs tests/kid-demo.test.mjs tests/auth-api.test.mjs tests/teacher-slot-consent.test.mjs
npm run build
```

Browser test dùng Chrome headless (đường dẫn Windows mặc định, hoặc biến `BROWSER_EXECUTABLE`), lưu kết quả tại `output/personalization/browser.json`. Kiểm thử dùng API mô phỏng, không ghi dữ liệu lên production. Có kiểm tra bé vào thẳng CH02, chỉnh khi đã bỏ qua, hủy/lưu lỗi, giữ nguyên player khi thay đổi, mở lại chương giữ checkpoint, dùng biến thể mới ở CH03, không GET trạng thái lặp khi đã hoàn tất và chỉ có lối vào trong menu hồ sơ.

## Hai ca kiểm tra production trước khi bàn giao lead

Cần tài khoản chủ FAMILY, chủ CLASS và phiên SLOT của bé để thực hiện:

1. Phụ huynh lưu Nữ cho bé. Trong phiên SLOT của đúng bé, GET `/api/play/personalization` phải có `labels.gender = "FEMALE"` và `parent = null`.
2. Chủ CLASS gọi PUT `/api/slots/{slotId}/personalization` phải nhận HTTP 403, mã 3004. Giao diện giáo viên chỉ có trạng thái.

Các kiểm thử tự động xác nhận payload, token và xử lý lỗi 403; chúng không chứng minh dữ liệu/quyền trên production. Chưa thực hiện hai ca này khi không có phiên đăng nhập thử nghiệm.
