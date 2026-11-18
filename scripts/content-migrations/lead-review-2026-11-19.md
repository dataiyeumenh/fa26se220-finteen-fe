# Kết quả xử lý góp ý lead — 19/11/2026

## GV-15: đã lưu kho câu hỏi thật

Đã tạo 12 câu đã biên tập qua Studio, mã gốc thêm hậu tố `-R1`, nối với bản cũ bằng `replacesId`. Backend tự ngừng dùng bản cũ khi tạo câu thay thế. Đã đọc lại API và xác nhận đủ 12 bản mới hoạt động, 12 bản cũ đã ngừng dùng và giữ nguyên nội dung/đáp án/reference. Đề đã phát hành giữ nguyên câu hỏi cũ; đề mới dùng câu thay thế.

- OECD_INFE-002: tình huống độc lập, 1.000.000 đồng chia cho năm người, lạm phát giả định 5%; ba lựa chọn rõ ràng, bỏ lựa chọn khảo sát “Tự phát”.
- OECD_INFE-005: phục hồi dữ kiện từ QK5/QK6 của nguồn OECD: lãi 2%/năm, lãi nhập gốc hằng năm, không gửi thêm/rút tiền/phí/thuế. Số tiền mô phỏng 1.000.000 đồng, so sánh với 1.100.000 đồng sau năm năm.
- OECD_INFE-006 đến 013: bỏ giọng phỏng vấn, viết thành câu đúng/sai độc lập.
- PISA-021: hóa đơn từng dòng, tiền hàng 130.000 đồng + thuế 13.000 đồng + phí gửi 10.000 đồng = 153.000 đồng còn phải trả. Đây là quy mô tiền mô phỏng, không phải tỷ giá hối đoái.
- PISA-035: đủ tình huống Greg mua xe, cất xe và nguy cơ trộm; bỏ tham chiếu câu trước.

Tệp đối chiếu:

- [Bản gốc trước khi sửa](gv15-questions-2026-11-19.before.json).
- [Payload tạo câu thay thế](gv15-questions-2026-11-19.replacements.json), chỉ dùng để đối chiếu; đã áp dụng, không chạy lại để tạo trùng.
- [Kết quả kiểm tra ID và trạng thái](gv15-questions-2026-11-19.audit.json).

PUT câu đã dùng trong đề trả 409/8009; vì vậy bản sửa dùng vòng đời thay thế được backend hỗ trợ. `source` có giới hạn 160 ký tự: lưu tên tài liệu, câu/trang và DOI. Giấy phép lưu qua trường `license`, gồm thông báo FinTeen biên soạn, không phải bản dịch chính thức của OECD. Studio tạo câu mới chưa trả `reference` có cấu trúc; FE hiển thị `source` dự phòng trong kho chung.

Nguồn đối chiếu lãi kép: [OECD/INFE Toolkit 2022, trang 31–32, QK3/QK5/QK6/QK7](https://www.oecd.org/content/dam/oecd/en/publications/reports/2022/03/oecd-infe-toolkit-for-measuring-financial-literacy-and-financial-inclusion-2022_54dba970/cbc4114f-en.pdf).

## CH01–CH03: đã gửi duyệt trong Studio

Hai patch đã ghép theo ID vào draft của bản công khai 2.7.1:

- [Nội dung chương](lead-review-2026-11-19.json).
- [31 giải thích biến thể CH01](lead-review-2026-11-19.variants.json).

CH01 giải thích cả sáu món gốc và 31 biến thể cá nhân hóa. “Bộ màu vẽ cao cấp” giải thích rõ phần nâng cấp thuộc mong Muốn và có thể hoãn, không giả định An đã sở hữu dụng cụ chưa được xác nhận. Các khoản đã đăng ký giải thích nghĩa vụ thanh toán ngày 28.

CH02 thêm lý do ưu tiên cho đủ sáu phong bì. FE nêu mức mục tiêu, số tiền thiếu/dư và hướng điều chỉnh sau khi kiểm tra.

CH03 bổ sung 1.800.000đ chi phí thiết yếu vào đề trước khi chọn; hai phép tính còn lại cũng tự chứa đủ số liệu. Tên game được đổi sang “Ghép việc phù hợp”, cùng “Cần hay Muốn?” và “Chia phong bì thật hợp lý” ở các vị trí liên quan. Lời giải chỉ hiện một lần; chọn sai có gợi ý riêng.

ID, ảnh, luật chấm, đáp án, tiền và kết cấu cảnh được giữ nguyên. Bản sao draft trước sửa nằm trong `output/lead-review-2026-11-19/chapters.before.json` (gitignore).

Đã tạo lại đúng một câu thoại CH03_SC03_B3 sau đổi tên game. Cả ba chương không còn giọng đọc thiếu, lỗi hoặc chờ sinh.

Đã gửi duyệt cả ba chương, mức PATCH: CH01 revision 90, CH02 revision 24, CH03 revision 7. Trạng thái đã đọc lại là SUBMITTED. Chi tiết nằm trong [audit chương](lead-review-2026-11-19.audit.json).

Các thay đổi chương đang chờ người duyệt và người phát hành xử lý theo quyền Studio. Tài khoản phiên làm việc là GAME_EDITOR. Bản game công khai vẫn là 2.7.1.

## FE và kiểm chứng

FE giữ xuống dòng trong hóa đơn ở kho, xem đề, làm bài và kết quả; kho chung hiển thị nguồn dự phòng cho câu mới do Studio tạo. Chưa triển khai FE lên production.

Đã kiểm tra số học lạm phát/lãi kép, tổng hóa đơn, 12 mapping thay thế, 31 giải thích cá nhân hóa; kiểm thử Chrome dùng component thật để mở “Xem đề”, kiểm tra dòng thuế, đáp án và nguồn của đủ 12 câu. Bộ hồi quy mini-game kiểm tra cả thao tác sai/đúng và lời giải không lặp.
