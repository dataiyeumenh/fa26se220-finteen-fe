# Sửa bổ sung kho PISA/FDIC theo góp ý lead — 19/11/2026

Đã áp dụng vào kho Studio: **6 câu PISA + 11 câu FDIC**, tạo bản `-R1` với `replacesId`. Backend tự ngừng dùng câu gốc; đề đã phát hành giữ nội dung cũ. Không tạo hay phát hành đề mới.

- [Dữ liệu trước sửa](quiz-currency-followup-2026-11-19.before.json).
- [Payload câu thay thế](quiz-currency-followup-2026-11-19.replacements.json) — đã áp dụng, không chạy lại để tạo trùng.
- [Đối chiếu ID và trạng thái](quiz-currency-followup-2026-11-19.audit.json).

## PISA

- 017: phiếu lương thành từng dòng và số tiền đồng; giữ quan hệ lương gộp − khấu trừ = thực nhận.
- 020: câu hỏi PIN tự chứa bối cảnh; bỏ mô tả hình thẻ và số thẻ không cần cho câu hỏi.
- 028: bốn gói cước trình bày riêng, đơn vị đồng; xác định tháng 30 ngày, gọi 60 phút/ngày và không nhắn tin để có đáp án duy nhất.
- 032: đủ bảng phí và lịch sử dụng ZCycle, bỏ tham chiếu F306Q01; hai lựa chọn gồm cả phương án và khoản tiết kiệm 120.000 đồng.
- 033: hóa đơn nhiều dòng bằng đồng, bỏ chỉ dẫn ảnh và ô điền trống không được UI chấm; chọn khoản 100.000 đồng cho các chuyến vốn miễn phí.
- 034: mô tả việc mua xe và vay có lãi ngay trong câu, bỏ chỉ dẫn biển hiệu; số tiền mô phỏng 6.000.000 đồng.

## FDIC

Đã thay 001, 083, 097, 099, 107, 108, 110, 111, 112, 121 và 126. Các bài tính và tỷ lệ dùng số tiền đồng mô phỏng, giữ quan hệ giữa các khoản và vị trí đáp án đúng; không coi đây là tỷ giá hối đoái.

Riêng 001 không quy đổi hạn mức pháp lý bảo hiểm tiền gửi của Mỹ thành hạn mức Việt Nam. Bản mới kiểm tra nguyên lý bảo hiểm tiền gửi có giới hạn và phạm vi bảo vệ, không đưa một hạn mức VND tự đặt. Nguồn đối chiếu: [FDIC — Understanding Deposit Insurance](https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance).

Đọc lại API xác nhận đủ 17 câu mới khớp payload; 17 câu cũ đã ngừng dùng nhưng giữ nguyên nội dung, đáp án và reference. Kho PISA/FDIC đang hoạt động không còn `$`, `USD`, `zeds`, chỉ dẫn `[Hình…]`/`[Biển…]` hoặc `F306Q01` trong stem/options. Nội dung nguyên bản trong reference vẫn được giữ để tra cứu nguồn.

## Kiểm chứng giao diện cùng đợt sửa

`npm run test:minigame-envelope:browser` kiểm tra Chrome thật ở 1366×768 và touch ở 390×844. Ảnh và kết quả tại `output/minigame-envelope/` (gitignore).

CH01 đưa món sai lên đầu giỏ, đưa focus tới món sai đầu tiên và cuộn để thấy phản hồi; bỏ tên món lặp trong phản hồi. CH02 thay nền X bằng thân/miệng/nắp phong bì: phong bì trống luôn mở, có tiền thì đóng, lấy tiền ra thì mở lại. Phong bì có tiền mở ngay khi kéo thẻ khác lên phía trên, trước khi thả; rời đi hoặc thả vào thì đóng. Phân biệt trống/có tiền bằng trạng thái mở/đóng và số tiền bên dưới, không dùng badge. Hỗ trợ kéo chuột, giữ/kéo cảm ứng, chọn rồi bấm và thao tác bàn phím. Đầu vào chấm điểm lần đầu giữ nguyên.

Kiểm thử chuột dùng sự kiện CDP thực, xác nhận `pointercancel` của HTML5 drag không xóa trạng thái đang kéo; phong bì đã có tiền phải mở trước `drop`, không đổi số tiền chỉ vì rê lên, rồi đóng sau khi nhận tiền.
