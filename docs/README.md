# Tài liệu FinTeen sau đợt dọn 01/10/2026

> Cập nhật 03/10/2026 cho bộ art `public/images/finteen-v2`: dùng **GDD v2, 8 chapter độc lập**, với An/Minh có tuổi riêng theo tình huống. Xem [bảng tuổi và nguồn v2](finteen-v2-character-ages.md). Các ghi chú tuyến Minh 10 chương và tuyến Tí bên dưới là lịch sử/phạm vi code cũ, không phải chuẩn độ tuổi của bộ art v2.

## Phạm vi đã xác nhận

- Giữ nguyên mini game chương 1–2 trên main.
- Giữ bản chương 4 **Minh chọn giữa lịch học và ca làm**: xem [thiết kế và trạng thái tích hợp](chapter-four-story-mini-game.md).
- Đưa ra ngoài dự án các prototype Career Match nhiều bước, lịch/xe buýt, tìm điểm khác nhau, khủng hoảng, ngày lương và bố trí nhà; gồm test, ảnh riêng và đề xuất đi kèm.
- Bản lưu phần đã bỏ nằm tại `D:/DO-AN/SEQ-cleanup-20261001`, giữ cấu trúc đường dẫn cũ để có thể khôi phục.
- Giữ context gốc, tài liệu workspace và prompt bản đồ đang được dùng. `output/finteen-review1` là tài liệu báo cáo dự án, không phải mini game nên được giữ.

## Nguồn và điểm chưa thống nhất

- [Context dự án](finteen-project-context.md): yêu cầu tài khoản, quyền và nghiệp vụ; chứa các mốc lịch sử, không phải mô tả hoàn toàn trùng code hiện tại.
- [Context game](finteen-game-context.md) và [nguồn trích](finteen-game-context-sources/): thiết kế Minh, 10 chương. Bản chương 4 được giữ thuộc tuyến này.
- `../cot_truyen_text.txt` và `../chuong-N-backgrounds.md`: tuyến Tí, 8 chương đang tồn tại cùng code main. Chưa có quyết định chuyển toàn bộ main sang tuyến Minh; không tự ghép hai hệ thống số chương, nhân vật và chỉ số.
- [Workspace frontend](frontend-account-workspace.md): hướng dẫn bản thử tài khoản; đọc lưu ý cập nhật ở đầu file.
- [Prompt bản đồ](finteen-journey-map-art-brief.md): giữ vì ảnh bản đồ vẫn được code sử dụng.
- [Prompt cảnh kết chương 4](chapter-four-ending-image-prompt.md): nguồn tạo ảnh cho bản được giữ.

## Giới hạn hiện tại

Sau triển khai nội bộ 01/10, chương 4 đã có demo trong Content Studio và được nối vào trang chơi khi Manager publish. Xem [hướng dẫn nội bộ](internal-workspace.md) để thử Editor/Reviewer/Manager/Admin. Bản main chưa được kiểm định đầy đủ theo mọi yêu cầu backend trong context; hệ thống vẫn là frontend demo trên trình duyệt.

## Kết quả kiểm tra

- `npm run build`: đạt.
- `node --test tests/chapter-four-story.test.mjs`: 3/3 đạt.
- Sau cập nhật tài khoản hai vai ngày 01/10: `npm run test:workspace` đạt 13/13. Test Guest đã cập nhật theo hành vi main đang cho chơi chương 1–2; quyền demo không bị thay đổi. Test mới bao phủ hai gói, radio đăng nhập, dữ liệu cũ, phân tách dữ liệu/Quiz/báo cáo theo vai và quyền route.
- Không còn tham chiếu từ `src`/`tests` đến các module prototype đã đưa ra ngoài dự án. Chưa kiểm tra tương tác trực quan của chương 4 trong trình duyệt.
