# Gắn mã mini-game và sửa báo cáo học tập — 24/11/2026

**Cập nhật sau phản hồi lead:** CH01–CH08 đã được gửi duyệt (`SUBMITTED`); CH01 đã chạy Sinh giọng và đủ 160 bản đọc READY. Đã sửa khóa câu sai theo `gameId`/`itemId`. Xem [bàn giao và bảng 98 lựa chọn](../../docs/knowledge-base/ban-giao-lead-2026-11-24.md) cùng [audit gửi duyệt](lead-followup-2026-11-24.audit.json). Các trạng thái DRAFT bên dưới là tại thời điểm lưu migration; bản công khai hiện vẫn 2.7.2.

Đã gắn mã theo Task 2 của [bảng đã duyệt](../../docs/knowledge-base/bao-cao-duyet-noi-dung-2026-11-23.md) vào bản nháp Studio thật của cả 8 chương. Đã đọc lại API sau từng lần lưu và kiểm tra đủ 13 mini-game, 63 câu đang được chấm; 101 vị trí `grade.concept` nếu tính cả cấu hình dùng chung giữa các cảnh.

| Chương | Revision sau lưu | Trạng thái |
|---|---|---|
| CH01 | 91 | DRAFT |
| CH02 | 25 | DRAFT |
| CH03 | 8 | DRAFT |
| CH04 | 6 | DRAFT |
| CH05 | 7 | DRAFT |
| CH06 | 6 | DRAFT |
| CH07 | 6 | DRAFT |
| CH08 | 7 | DRAFT |

Lead có thể kiểm tra tại [Studio](https://fa26se220-finteen-fe.vercel.app/internal/chapters). Các chương được giữ ở bản nháp để kiểm mã trước khi gửi duyệt/phát hành. Bản công khai đã kiểm tra sau khi lưu vẫn là **2.7.2**.

## Nội dung đã lưu

- Gắn `grade.concept` cho từng câu theo ID trong bảng duyệt; đồng bộ `knowledgeUnits` của cảnh và `metadata.allKnowledgeUnits` của chương.
- Savings Race chỉ có chủ đề D04.02, không thêm câu chấm hay dùng điểm luyện tập làm bằng chứng kiến thức.
- Đối chiếu phạm vi phần chơi: CH06 là 6/4 câu; CH07 là 2/10 câu; CH08 là 2/3/3 câu, theo `game.rounds` và `game.config.mode`. Cấu hình dùng chung giữ đủ mã của các câu; danh sách mã cảnh lấy theo phần đang chơi.
- So sánh toàn bộ nội dung trước/sau: chỉ thay đổi mã câu, danh sách mã cảnh và danh sách mã chương. Lời thoại, cá nhân hóa, ảnh, đáp án, luật chấm và luồng cảnh giữ nguyên.

[Audit đọc lại từ Studio](minigame-concepts-2026-11-24.audit.json) có mã từng câu, đường dẫn, revision và toàn bộ cảnh báo lưu nháp. CH01 có 30 cảnh báo chênh số trong chữ cá nhân hóa; CH02 có một cảnh báo trường khóa cũ `requires`. Các trường gây cảnh báo đã có trong nội dung trước sửa, nằm ngoài thay đổi mã này; CH03–CH08 không có cảnh báo lưu.

Bản sao trước sửa: `output/concepts-2026-11-24/chapters.before.json` (không đưa vào git). [Hàm migration](minigame-concepts-2026-11-24.mjs) dừng nếu thiếu cảnh, gặp câu chưa có trong mapping hoặc cấu trúc phần chơi thay đổi; chạy lại không tạo mã trùng.

## Báo cáo web

Đã sửa đủ bốn mục trong `LearnerReportContent.jsx`:

1. Hiện `miniGames.wrong`: tên câu, “Bé chọn”, “Đáp án”, giải thích.
2. Đổi trạng thái cuối hành trình: PARTIAL → “Tạm thời (còn chương chờ hậu trắc)”, COMPLETE → “Đầy đủ”.
3. Ưu tiên `item.name`, dự phòng bằng bảng tên cục bộ; hiện `item.objective` khi BE trả về.
4. Dùng `optionId` làm key; lựa chọn thiếu nhãn hiện “Lựa chọn trong truyện”.

Phần FE mới nằm trong workspace, chưa triển khai lên production. Nhận xét AI, bốn trạng thái đánh giá và BR-53 giữ nguyên.

## Kiểm chứng

- Kiểm thử mapping trên fixture của đủ 8 chương: qua; kiểm tra tính lặp an toàn, chỉ đổi trường được phép, 13 game/63 câu và các trường hợp cấu trúc thay đổi.
- Chạy migration cuối cùng trên bản sao draft thật: đủ 8 chương, 13 game, 63 câu.
- Kiểm thử Chrome báo cáo học tập: qua, gồm câu sai, trạng thái cuối hành trình, tên từ BE, mục tiêu, fallback lựa chọn và dữ liệu trống.
- Build và lint hai tệp JSX đã sửa: qua.
- Bộ `npm test`: 336/338 qua. Hai bài cũ trong `kid-demo.test.mjs` và `personalization.test.mjs` lỗi “Phiên đăng nhập đã thay đổi ở tab khác”; fixture dùng storage không lưu giá trị nên không đáp ứng đồng bộ phiên hiện tại. Các tệp auth và hai test này nằm ngoài phạm vi sửa đổi.

Việc xác nhận BE thực sự tổng hợp đúng số câu theo từng phần cần kiểm tra bằng kết quả chơi trên bản nội dung sau khi được duyệt/phát hành; audit hiện tại xác nhận cấu hình và dữ liệu đã lưu trong Studio.
