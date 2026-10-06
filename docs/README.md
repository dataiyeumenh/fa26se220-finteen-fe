# Mục lục nguồn sự thật FinTeen cho AI

File này giúp AI chọn đúng tài liệu trước khi viết code hoặc ghép ảnh. Ngày tài liệu hóa: 04/10/2026.

## Chọn tài liệu theo việc cần làm

| Việc | Đọc trước | Vai trò |
| --- | --- | --- |
| Ghép bộ ảnh An/Minh thành game | `../public/images/finteen-v2/README.md` rồi README từng chương | Nguồn sự thật về file ảnh, nhân vật, layer và cảnh. |
| Lấy cốt truyện, con số, lựa chọn, ending v2 | `finteen-game-context-sources/FinTeen_Game_Design_Document_GDD_v3_Expanded.md` và framework tài chính | Nguồn logic/nội dung; đối chiếu README chương trước khi chọn asset. |
| Xác nhận tuổi/tạo hình | `finteen-v2-character-ages.md` và manifest ảnh | Tuổi là thuộc tính của tình huống độc lập, không phải timeline trưởng thành. |
| Sửa gameplay Tí đang chạy | `../cot_truyen_text.txt`, runtime trong `public/images/c1`, `c2`, adapter trong `src` | Tuyến cũ, tách biệt với art v2. |
| Sửa demo chương 4 lịch học/ca làm | `chapter-four-story-mini-game.md` | Đây là đoạn Minh chọn lịch học–làm, không phải chương 4 Mua thông minh của v2. |
| Sửa tài khoản/Content Studio | `finteen-project-context.md`, `frontend-account-workspace.md`, `internal-workspace.md` | Mô tả frontend workspace và quyền demo. |
| Sửa bản đồ hành trình | `finteen-journey-map-art-brief.md` | Prompt và ý nghĩa bốn vùng bản đồ. |

## Thứ tự ưu tiên khi nguồn mâu thuẫn

1. File/runtime đang được code import là sự thật về **hành vi hiện chạy**.
2. README trong chính thư mục asset là sự thật về **cách dùng ảnh**.
3. GDD v2 là sự thật về **logic câu chuyện dự định triển khai**.
4. Tài liệu lịch sử, prompt và báo cáo audit chỉ giải thích nguồn gốc; không tự động ghi đè ba lớp trên.

Nếu cần thay hành vi hiện chạy theo GDD, đó là migration có chủ đích: ghi rõ tuyến bị thay, cập nhật adapter/test và không âm thầm đổi tên Tí thành An.

## Những nhầm lẫn cần tránh

- `cot_truyen_text.txt` là tuyến Tí 8 chương; `public/images/finteen-v2` là tuyến An/Minh theo GDD v2.
- Chương 4 trong `ChapterFourMiniGame.jsx` nói về ca làm và lịch ôn; `finteen-v2/chapter-04` nói về mua điện thoại thông minh.
- Tranh `scene/` đã có nhân vật, không phải background để chồng thêm sprite.
- Ảnh trong `output/` là báo cáo/preview/audit, không phải asset runtime.
- Các con số trong tranh chỉ minh họa. Dữ liệu tiền, ngày, phần trăm và đáp án phải đến từ state/UI.

## Trạng thái đã xác nhận

- Gameplay main hiện có chương 1–2 tuyến cũ và đoạn demo chương 4.
- Bộ `finteen-v2` có asset và README chi tiết cho chương 1–6; chương 7–8 chưa có bộ ảnh tương ứng.
- Content Studio, tài khoản và quyền hiện là mô phỏng frontend/local state.
- Không xem ghi chú “đã tạo ảnh” là bằng chứng ảnh đã được nối vào game.

## Checklist cho AI trước khi commit

- Nêu rõ đang sửa tuyến nào.
- Không dùng đường dẫn từ `output/` trong runtime.
- Kiểm tra mọi đường dẫn asset tồn tại và đúng chữ hoa/thường.
- Đối chiếu beat với bảng Công thức lắp cảnh của README chương.
- Test nhánh, phép tính, checkpoint và build.
- Cập nhật README chương nếu thêm/xóa/đổi vai asset.
