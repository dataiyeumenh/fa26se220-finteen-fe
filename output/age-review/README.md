# Bàn giao sửa nhân vật chibi

> **Phạm vi:** đây là hồ sơ sản xuất/kiểm chứng hình ảnh, không phải hướng dẫn runtime. AI ghép game phải đọc [`../../README.md`](../../README.md), [`../../public/images/finteen-v2/README.md`](../../public/images/finteen-v2/README.md) và README của từng chương. Không import ảnh trong `output/` vào game; asset phát hành nằm dưới `public/images/finteen-v2/`.

Hoàn tất ngày 03/10/2026. Đã thay **84 PNG** tại `../../public/images/finteen-v2`: 60 sprite và 24 tranh cảnh của sáu chương. Có 60 ảnh riêng biệt; các mẫu cùng tuổi và người lớn được dùng lại nhất quán.

- [Xem toàn bộ sprite cuối](final-sprites-review.png).
- [Xem toàn bộ tranh cảnh cuối](final-scenes-review.png).
- [Bộ prompt cuối](final-prompt-set.md).
- [Manifest đã cài vào dự án](../../public/images/finteen-v2/character-age-manifest.json).
- [Kết quả kiểm tra PNG, alpha và bản sao](verification.json).

Hướng đã chốt: tất cả nhân vật chibi; khác tuổi thể hiện bằng trang phục và nét mặt. Không đặt tăng chiều cao theo tuổi; người lớn dùng cùng mẫu chibi cố định giữa các chương. GDD v2 gồm các tình huống độc lập.

`chibi-sprites` và `chibi-scenes` chứa bản cuối dùng để thay vào dự án. `originals` là bản gốc trước khi sửa. `tall-drafts` và các bảng preview cũ là lịch sử đã loại bỏ; không dùng làm nguồn tạo hình hiện tại. Bảng `chibi-age-design.png` là đề xuất ban đầu, được bộ sprite cuối và quy tắc mới nhất thay thế.

Đã kiểm tra trực quan toàn bộ 36 sprite riêng biệt và 24 cảnh; kiểm tra alpha, đọc PNG và checksum của đủ 84 bản sao tại đường dẫn đích. Đây là sửa bộ asset, không phải đợt tích hợp gameplay mới.

## Cách AI được phép dùng thư mục này

- Dùng contact sheet để đối chiếu nhận dạng, trang phục và tính nhất quán chibi.
- Dùng `verification.json`/manifest để kiểm tra bản sao, kích thước và alpha.
- Dùng `originals` để điều tra lịch sử khi có lỗi, không làm fallback runtime.
- Không chọn ending, số tiền, lời thoại hay nhân vật trong cảnh từ file audit; các quyết định đó thuộc README chương và GDD.
- Nếu sửa asset đích, cập nhật lại manifest/kiểm chứng và README chương; không chỉ sửa bản trong `output/`.
