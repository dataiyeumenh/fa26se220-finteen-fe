# Độ tuổi nhân vật theo GDD v2

Nguồn: `C:/Users/ADMIN/Downloads/FinTeen_Game_Document/Document v2/FinTeen_Game_Design_Document_GDD_v2.docx`, mục 1, 2 và phần mở đầu từng chapter. Đã đối chiếu trực tiếp ngày 03/10/2026.

GDD v2 gồm **8 chapter độc lập**. An là nhân vật đại diện của từng tình huống; tuổi và hoàn cảnh được giới thiệu lại khi mở chapter. Minh là bạn cùng tuổi. Không nối tuổi, tiền hay hoàn cảnh thành hành trình trưởng thành xuyên chương.

| Chương | Tình huống | Tuổi An và Minh |
| --- | --- | --- |
| 1 | Tiền đầu tiên | 14 |
| 2 | Tháng đầu tiên và mục tiêu lớn | 16, mô phỏng tự lập |
| 3 | Công việc đầu tiên | 17, mô phỏng nghề nghiệp |
| 4 | Mua thông minh | 16 |
| 5 | Ngân hàng và lãi | 16 |
| 6 | Mượn tiền có dễ không? | 18, mô phỏng tín dụng |
| 7 | Biến cố bất ngờ | 17, mô phỏng bảo vệ tài chính |
| 8 | Tiền sinh tiền và kế hoạch 18 tuổi | 18, mô phỏng đầu tư |

Mẹ, cô Linh, tư vấn viên, nhân viên cửa hàng và hướng dẫn viên ngân hàng cần có tạo hình người lớn phù hợp vai trò. GDD v2 không ghi tuổi số cụ thể cho những vai này; không lấy tuổi NPC từ GDD cũ để khẳng định là dữ kiện v2.

## Quy tắc sửa hình

Theo chốt mới nhất của người dùng ngày 03/10/2026: **tất cả nhân vật đều chibi; chỉ thay quần áo và nét mặt để thể hiện khác tuổi**. Giữ tỷ lệ cơ thể chibi nhất quán, không kéo dài chân/thân và không dùng tăng chiều cao để phân biệt tuổi. Mẹ/cô dùng cùng một tạo hình người lớn chibi ổn định giữa các chương. Định hướng khoảng 30 tuổi cho mẹ/cô là góp ý tạo hình của người dùng, không phải con số trích từ GDD v2.

Giữ nhận diện tóc và màu chủ đạo, nhưng trang phục cần thay đổi hợp lý giữa nhóm tuổi; không dùng nguyên áo/quần trẻ nhỏ rồi chỉ kéo dài tay chân. An và Minh cùng nhóm tuổi trong mỗi chapter. Chương 2, 4 và 5 có thể dùng chung bộ 16 tuổi; chương 3 là 17 và chương 6 là 18. Chênh lệch 17–18 có thể nhẹ; không phóng đại để ép mỗi tuổi thành một vóc dáng khác hẳn.

### Trang phục chibi đã áp dụng

| Tuổi | An | Minh |
| --- | --- | --- |
| 14 | Áo thun vàng, quần short xanh, dép trắng | Polo xanh navy, short be, sneaker trắng |
| 16 | Sơ mi khoác ngắn tay vàng, thun trắng, jean xanh dài | Sơ mi khoác navy, thun sáng, quần be dài |
| 17 | Polo vàng, quần xanh dài | Polo navy, quần be dài |
| 18 | Sơ mi khoác vàng xắn tay, áo kem, quần xanh dài | Sơ mi navy xắn tay, quần be dài, đồng hồ |

Màu tóc/màu áo chủ đạo là dấu hiệu nhận diện. Bảng trang phục là đề xuất mỹ thuật, không phải chi tiết bắt buộc được ghi trong GDD. Khi ghép cảnh dùng tỷ lệ chibi cố định cho mỗi nhân vật; chỉ góc máy, tư thế và phối cảnh làm thay đổi kích thước hiển thị. Không tăng kích thước người lớn để luôn cao hơn An/Minh, không lập thang chiều cao theo tuổi.

Bảng kiểm tra cuối: `output/age-review/final-sprites-review.png` và `output/age-review/final-scenes-review.png`. Bảng mẫu ban đầu `chibi-age-design.png` là lịch sử; không dùng nó để suy ra thang chiều cao theo tuổi.

## Trạng thái rà soát

Đã hoàn tất thay **84 PNG của sáu chapter: 60 sprite và 24 tranh cảnh**, tại đúng đường dẫn trong `public/images/finteen-v2`. Có 36 sprite riêng biệt và 24 cảnh; sprite 16 tuổi dùng lại ở chương 2/4/5, cô Linh dùng cùng bộ ở chương 2–6. Toàn bộ nhân vật chibi theo chốt mới nhất; phân biệt tuổi bằng quần áo và nét mặt. Đã kiểm tra trực quan, alpha và checksum các bản sao. Dùng imagegen tích hợp; xem `output/age-review/final-prompt-set.md` và manifest trong thư mục art.

Lượt sửa vóc dáng cao dài đã bị loại, giữ riêng trong `output/age-review/tall-drafts`; bản gốc được lưu trong `output/age-review/originals`. Đây là thay bộ asset, chưa tích hợp thêm gameplay mới.
