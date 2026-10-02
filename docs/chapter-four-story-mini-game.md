# Chương 4 — mini-game truyện ngắn: Thời gian hay tiền bạc?

## Bản hiện tại

Giữ `ChapterFourMiniGame.jsx`, `chapterFourStory.js`, `chapter-four-story.css` và `tests/chapter-four-story.test.mjs` theo xác nhận ngày 01/10/2026. Các prototype khác đã được đưa ra ngoài dự án.

Sau đợt reset, các đường dẫn `/prototype/career-match` và `/prototype/chapter-4` không còn hoạt động. Cập nhật nội bộ 01/10/2026 đã nối component này vào demo chương 4 tại `/internal/chapters/demo-chapter-4/demo` (cần tài khoản nội bộ được phép). Bản nháp mẫu chỉ hiện cho người học tại chương 4 sau khi Reviewer Pass và Manager publish. Xem `internal-workspace.md`.

Theo yêu cầu rút gọn, bản này chuyển trọng tâm sang Scene 4.3 của GDD v3 (time vs money), không còn là bản thực hiện toàn bộ ma trận Career Match của Scene 4.4. Tiền đề: Minh đã chọn việc sự kiện ở 4.1 và được giải thích tiền công ở 4.2. Intro nhắc lại tiền đề để người chơi mới hiểu mà không phải chơi lại cả chương.

## Luồng 3 phút

1. Cảnh dẫn: ca làm đầu và bài kiểm tra sắp tới; mẹ dặn việc học phải được giữ.
2. Hai tin nhắn, ba thẻ lựa chọn. Chỉ một quyết định và một nút xác nhận. Học nhóm 13–14h30, ca ngắn 15–17h, có 30 phút để đi lại.
3. Cảnh phòng khách Minh–mẹ: trả bài → phản hồi của mẹ → kết quả cuối tháng. Lời thoại thay theo nhánh. Không có dashboard điểm, bảng hỏi, lịch, tính giờ, hay biến cố ngẫu nhiên.
4. Cảnh nối với Mai dẫn về việc so sánh công việc ở 4.4. Route độc lập kết thúc đoạn preview, không giả vờ mở một chương đã triển khai. Khi được nhúng vào player, callback `onComplete` trả payload cho caller quyết định chuyển cảnh.

## Kịch bản mới theo yêu cầu người dùng

Các điểm 4/7/8 và phản hồi của mẹ là kịch bản bổ sung, không có sẵn trong GDD và không phải dự báo năng lực học tập ngoài đời.

| Nhánh | Điểm | Tuần 1 sau phí xe | Ba tuần tiếp (đã xảy ra trong lời kể) | Cả tháng |
| --- | --- | --- | --- | --- |
| Làm đủ ca, không ôn | 4/10 | 120k − 20k = 100k | Mẹ tạm dừng làm, 0k | 100k |
| Nghỉ ca đầu, ôn cùng nhóm và tự luyện | 8/10 | 0k | Hoàn thành 3 ca không trùng học, 300k | 300k |
| Xin nửa ca sau buổi nhóm | 7/10 | 60k − 20k = 40k | Hoàn thành 3 ca không trùng học, 300k | 340k |

Nhánh cân bằng còn ít thời gian tự luyện hơn nhánh học, nên không tối ưu mọi mặt. Các ca tiếp chỉ được tính sau đoạn nhảy thời gian “ba tuần sau”, không hiển thị như tiền đã nhận ở tuần đầu.

Payload có `chapterId:4`, `sceneId:'4.3'`, `nextSceneId:'4.4'`, `F_JOB_ROUTE`, `F_WORK_STUDY_BALANCE`, `F_PART_TIME_ALLOWED`, điểm và thu nhập. Chưa tự ghi backend hoặc chuyển dashboard cũ sang cốt truyện 10 chương.

## Ảnh và kiểm tra

Ảnh scene mẹ–Minh được tạo bằng image_gen tích hợp, sao chép nguyên bản vào `public/images/career-match/minh-mom-ending-v1.png`. Dùng lại ảnh kawaii ngày hội cho intro và cảnh nối. Prompt lưu trong `docs/chapter-four-ending-image-prompt.md`.

Kiểm tra: build, ESLint hai module mới, `node --test tests/chapter-four-story.test.mjs`. Kiểm tra ba nhánh có đủ thoại, số tiền nhất quán và payload nối đúng cảnh. Không kiểm tra trực quan nếu trình duyệt công cụ chưa kết nối.
