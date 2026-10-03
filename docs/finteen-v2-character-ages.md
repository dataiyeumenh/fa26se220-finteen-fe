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

Theo phản hồi trực tiếp của người dùng ngày 03/10/2026: **giữ phong cách chibi cân đối**, không kéo dài chân/thân sang kiểu anime. Phân biệt tuổi An/Minh bằng nét mặt, vai, tư thế, trang phục phù hợp tình huống và chiều cao tương đối. Mẹ và cô là người trưởng thành khoảng 30 tuổi theo định hướng người dùng, giữ vóc dáng/chiều cao ổn định; không tăng chiều cao khi An/Minh lớn hơn. Tuổi người lớn ở đây là định hướng tạo hình, không phải con số trích từ GDD v2.

Giữ nhận diện tóc và màu chủ đạo, nhưng trang phục cần thay đổi hợp lý giữa nhóm tuổi; không dùng nguyên áo/quần trẻ nhỏ rồi chỉ kéo dài tay chân. An và Minh cùng nhóm tuổi trong mỗi chapter. Chương 2, 4 và 5 có thể dùng chung bộ 16 tuổi; chương 3 là 17 và chương 6 là 18. Chênh lệch 17–18 có thể nhẹ; không phóng đại để ép mỗi tuổi thành một vóc dáng khác hẳn.

### Đề xuất trang phục chibi

| Tuổi | An | Minh |
| --- | --- | --- |
| 14 | Áo thun vàng, quần short xanh, dép trắng | Polo xanh navy, short be, sneaker trắng |
| 16 | Sơ mi khoác ngắn tay vàng, thun trắng, jean xanh dài | Sơ mi khoác navy, thun sáng, quần be dài |
| 17 | Polo vàng, quần xanh dài | Polo navy, quần be dài |
| 18 | Sơ mi khoác vàng xắn tay, áo kem, quần xanh dài | Sơ mi navy xắn tay, quần be dài, đồng hồ |

Màu tóc/màu áo chủ đạo là dấu hiệu nhận diện. Bảng trang phục là đề xuất mỹ thuật, không phải chi tiết bắt buộc được ghi trong GDD. Khi ghép cảnh phải dùng cùng mốc chiều cao cho mỗi người lớn; chỉ thay tương quan vóc dáng của nhóm An/Minh theo tình huống. Góc máy/phối cảnh có thể đổi, nhưng không tăng kích thước người lớn để luôn cao hơn An/Minh.

Bảng mẫu: `output/age-review/chibi-age-design.png`. Đây là mẫu kiểm tra tạo hình, chưa thay thế tất cả sprite/tranh cảnh.

## Trạng thái rà soát

Bộ ảnh `public/images/finteen-v2` hiện có sáu chapter. Kiểm tra hash cho thấy sáu bộ sprite An/Minh ban đầu giống nhau hoàn toàn; chưa phân biệt 14/16/17/18 tuổi. Lượt sửa tỷ lệ cao dài đã dừng theo phản hồi người dùng và được chuyển thành bản nháp trong `output/age-review/tall-drafts`. Đã khôi phục bộ ảnh đang dùng về bản gốc. Bước tiếp theo là bảng mẫu chibi có trang phục và chiều cao tương đối phù hợp; chưa hoàn tất thay toàn bộ ảnh.
