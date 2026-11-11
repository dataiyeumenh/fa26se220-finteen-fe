# Tài liệu kỹ thuật FinTeen

Cập nhật ngày **09/11/2026**. Thư mục này giữ tài liệu kỹ thuật phục vụ source hiện tại và sơ đồ kiến trúc.

| Nội dung | Tài liệu |
| --- | --- |
| Kiến trúc tổng quan, thành phần, xác thực, game và Studio | [diagrams/README.md](diagrams/README.md) |
| Phạm vi tích hợp API và phần còn dùng mock | [api-coverage-2026-11-02.md](api-coverage-2026-11-02.md) |
| Cấu hình và cơ chế xác thực ACCOUNT/SLOT | [auth-integration.md](auth-integration.md) |
| Đăng nhập và phân quyền cổng nội bộ | [internal-login.md](internal-login.md) |
| Content Studio, quyền và luồng duyệt/phát hành | [STUDIO.md](STUDIO.md) |
| Cấu trúc page, hook và API Parent/Teacher | [parent-teacher/README.md](parent-teacher/README.md) |
| Quy tắc tuổi và tạo hình asset đang được README ảnh tham chiếu | [finteen-v2-character-ages.md](finteen-v2-character-ages.md) |
| Contract sử dụng ảnh và layer của từng chương | [README asset](../public/images/finteen-v2/README.md) |

## Nguồn xác nhận hành vi

Ưu tiên source đang được import. Route nằm trong `src/App.jsx`; phiên và HTTP client nằm trong `src/api/auth.client.js`; nội dung game được tải qua `src/api/content.api.js`, không lấy từ các bản đặc tả chương cũ. README asset mô tả cách dùng hình, không xác nhận rằng mọi asset đều đã được runtime sử dụng.

Sơ đồ và tài liệu tích hợp mô tả frontend. Repository không chứa mã backend hoặc schema database; các ghi chú này không thay thế kiểm thử API thực tế.

## Phạm vi sau khi dọn

Đã bỏ các bộ báo cáo DOCX, screenshot, ZIP xuất, script tạo báo cáo, prompt tạo ảnh, GDD và hướng dẫn demo/triển khai cũ. Không giữ bản sao lịch sử trong `docs`. Danh sách file đã xóa và checksum nằm tại `output/docs-cleanup-2026-11-09/`.

`/docs/` hiện nằm trong `.gitignore`; file mới có thể bị bỏ qua, còn file đã được Git theo dõi vẫn xuất hiện trong `git status` khi thay đổi.
