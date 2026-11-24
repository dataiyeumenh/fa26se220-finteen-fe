# Rà soát API ngày 02/11/2026

Phạm vi: route hiện tại trong `src/App.jsx`, các module API của từng trang và Studio.
Đây là kiểm tra tích hợp trong mã nguồn. Không xác nhận được tình trạng triển khai backend vì Swagger production không truy cập được trong phiên kiểm tra.

| Chức năng | Hiện trạng frontend |
| --- | --- |
| Đăng nhập, tài khoản, OTP, Google | Có API trong `src/api/auth.client.js` |
| Gói, thanh toán | Có API `/api/plans`, `/api/payments`, entitlements |
| Nhóm/lớp, slot học sinh | Có API trong Parent Learners và Teacher Groups |
| Dashboard và báo cáo người lớn | Có API group report, slot report; không còn dùng mock của tài liệu tháng 10 |
| Quiz giáo viên: kho câu hỏi, tạo/sửa/xóa/phát hành/kết quả | Có API `/api/questions`, `/api/quizzes` |
| Quiz học sinh | Có API trong `pages/Kid/Quiz/api/kidQuizApi.js` |
| Tiến độ học, ghi kết quả chương | Có API `/api/play/state`, `/api/play/chapter` |
| Studio: nội dung, câu hỏi, asset, duyệt/phát hành | Có client `/api/studio/*` |
| Admin: tài khoản, quyền, giao dịch, gói và khóa AI | Có client API |
| Import Quiz từ file | Chưa có client/contract backend; đã bổ sung mock API riêng |
| Student AI assistant | Removed from the kid dashboard |
| Thành tựu học sinh | Đã đọc `achievements` từ `/api/learner/dashboard`; nếu trống thì hiển thị danh mục mock có ghi chú |

## Thành tựu học sinh

Dashboard và trang Thành tích dùng chung nguồn: ưu tiên toàn bộ thành tựu thật từ dashboard API. Khi danh sách trống/không có trường achievements, hiển thị bộ mẫu 32 huy hiệu: hoàn thành từng chương 1–8 và hoàn thành từng chương với đánh giá A/B/C. Mẫu mở sẵn chương 1 hạng A, chương 2 hạng B, chương 3 hạng C (6 huy hiệu); còn lại hiển thị chưa mở. Đây là fixture minh họa, không phải kết quả thật của học sinh, không ghi lên server hay tự tính hạng từ tiến độ. UI ghi rõ mock ở cả hai màn hình. Chưa xác minh được backend có hỗ trợ danh mục/điều kiện chấm hạng; không tự đặt ngưỡng điểm A/B/C.

File CSV mẫu import đã thêm UTF-8 BOM và xuống dòng CRLF để Excel nhận tiếng Việt. Cần tải lại file mẫu mới; file đã tải trước đó không tự thay đổi.

## Journey progress and chapter submission (updated)

The kid dashboard AI assistant card has been removed. `/dashboard/kid/lessons` now reads `GET /api/play/state` and maps `chaptersDone` to chapter completion, replacing hardcoded demo progress. Incomplete chapters show 0%; no per-lesson progress is invented.

On reaching an ending, the game submits `POST /api/play/chapter` with chapter, releaseVersion, attemptIndex, choices, miniGames and finishedAt. Fixed the API wrapper missing getSnapshot: previously the sender could not read the learner slot code and skipped submission. Submission requires a learner slot and releaseVersion. Network/5xx failures are queued locally for retry when opening the game. Mid-chapter checkpoints remain browser-local.

Three automated regression tests pass using a mocked API. Live backend persistence has not been verified.

## Mock import Quiz

### Đối chiếu import với kho câu hỏi nội bộ

Kho câu hỏi nội bộ cũng có nút **Import từ file**, dành cho ADMIN, GAME_EDITOR và GAME_MANAGER (cùng quyền với Thêm câu hỏi). Hai màn hình dùng chung `QuestionFileImport`: cùng CSV tiếng Việt có BOM, JSON, mẫu cũ, giới hạn 1 MB/100 câu, kiểm tra bốn lựa chọn và xem trước đáp án. Một file dùng được ở cả hai nơi.

Điểm khác khi lưu: Quiz của giáo viên tạo **đề mock** trên trình duyệt; kho nội bộ lưu **câu hỏi thật** bằng `POST /api/studio/questions`, giống tạo thủ công. Người dùng chọn kho và chương áp dụng cho cả file. Không tự tạo đề/phát hành. Nếu một câu lưu lỗi, import dừng và báo số câu đã lưu; trong hộp thoại hiện tại có thể tiếp tục từ câu chưa xác nhận thành công. Lỗi mạng có thể khiến server đã lưu nhưng chưa phản hồi: cần kiểm tra kho trước khi thử lại vì chưa có contract idempotency/bulk import.

Trong Quản lý Quiz, chọn lớp đang mở → **Import từ file** → tải mẫu CSV hoặc chọn JSON/CSV → xem trước → nhập tên đề → lưu mock.

- CSV UTF-8: `Câu hỏi,Lựa chọn A,Lựa chọn B,Lựa chọn C,Lựa chọn D,Đáp án đúng`. Mỗi dòng là một câu hỏi; đáp án nhập A/B/C/D, ví dụ B là lựa chọn thứ hai. Mẫu có hai câu minh họa, cần thay hoặc xóa trước khi nhập. CSV cũ dùng `stem,A,B,C,D,correctIndex` vẫn được hỗ trợ. JSON: mảng câu hỏi hoặc `{ "questions": [...] }`, mỗi câu có `stem`, `options`, `correctIndex`.
- Giới hạn 1 MB, 1–100 câu, đúng 4 lựa chọn, đáp án đánh số 0–3.
- Mock lưu localStorage theo tài khoản; có thể xem và xóa, còn sau khi tải lại trang. Xóa dữ liệu trình duyệt sẽ mất đề.
- UI đánh dấu **DỮ LIỆU MOCK · CHƯA CÓ API**. Đề mock chưa phát hành/giao được cho học sinh, không gửi ID mock vào API thật.
- Danh sách, tạo đề từ kho và các thao tác hiện có vẫn gọi API thật; lỗi xác thực/mạng không được chuyển thành thành công giả.
- Khi có backend import, thay `teacherQuizApi.importQuiz` và bỏ nhánh đọc/ghi mock. Cần thống nhất contract nhập câu hỏi mới và quyền giáo viên trước khi kết nối.

## Các phần không phải API thiếu trong luồng hiện tại

- Thông báo sắp hết hạn được suy ra từ entitlement thật trên trình duyệt.
- Lịch học/tin nhắn không có route sản phẩm đang hoạt động.
- `features/internal/store.js` là store cũ chưa hỗ trợ ghi; route nội bộ hiện tại sử dụng Studio API. Không bật lại xác thực/dữ liệu nhân viên giả.
- `backend-parent-teacher-api-gap-analysis.md` là ghi nhận lịch sử tháng 10, không dùng làm danh sách API thiếu hiện tại.
