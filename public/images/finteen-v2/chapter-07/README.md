# Chương 7 — Biến cố bất ngờ

Bộ art hoàn tất ngày 14/10/2026 theo `Document v2/FinTeen_Game_Design_Document_GDD_v2.docx`, mục 5.7; đối chiếu bối cảnh và mini-game với bản `Revised/FinTeen_Game_Design_Document_GDD_v2_revised.docx`. Đây là chapter độc lập, An và Minh 17 tuổi trong mô phỏng bảo vệ tài chính.

**26 PNG: 4 background, 4 scene, 9 sprite, 7 ảnh mini-game, 2 props.** 16 ảnh tạo mới bằng imagegen tích hợp; 10 ảnh tái sử dụng nguyên bản. Phong cách cartoon 2D kawaii/chibi, viền nâu ấm, màu mint–kem–coral, đồng bộ chương 1–6. Bộ art sẵn sàng để tích hợp; lượt này không thêm gameplay.

## Background và scene

| Scene GDD | Background trống | Tranh kể chuyện | Nhân vật và cách sử dụng |
| --- | --- | --- | --- |
| SC01 — Khoản chi bất ngờ | `bg/bg11-school-infirmary.png` | `scene/sc01-understanding-medical-cost.png` | An và cô Linh đọc điều kiện bảo hiểm sau khi đã được chăm sóc. Tranh mở cảnh có băng dán nhỏ, không mô tả tổn thương nặng. |
| SC02 — Giải quyết khoản cần trả | `bg/bg11b-medical-paperwork-desk.png` | `scene/sc02-paying-and-keeping-records.png` | An và Minh xem giấy tờ/đề nghị trên điện thoại trước quyết định. Không thể hiện đã vay hoặc đã được hoàn tiền. |
| SC03 — Tin nhắn hoàn phí | `bg/bg12-refund-message-phone.png` | `scene/sc03-checking-refund-message.png` | An dừng trước điện thoại, cô Linh hỗ trợ đối chiếu kênh liên hệ. Hiện tin nhắn và lựa chọn bằng UI. |
| SC04 — Khiếu nại và phục hồi | `bg/bg11c-recovery-evidence-desk.png` | `scene/sc04-organizing-evidence-and-support.png` | An/cô Linh rà soát chứng từ; dùng trước phần tương tác hoặc reflection, không mặc định hồ sơ được duyệt. |

BG11 và các góc bàn là cùng bối cảnh phòng y tế trường. BG12 là góc điện thoại trong tình huống này. Tranh và nền ngang 1672×941, gần 16:9. `scene/` đã có nhân vật: ẩn sprite rời khi dùng. `bg/` dùng cho hội thoại/choice/mini-game. Với nền cận bàn, dùng portrait nhỏ hoặc ẩn sprite để không xuyên mặt bàn. Ending giữ nền SC04 và đổi biểu cảm/feedback theo kết quả.

GDD có câu hội tụ từ SC04 đến “scene 5” nhưng chỉ định nghĩa 4 scene và bảng kiến trúc cũng ghi 4. Bộ art ánh xạ SC04 sang reflection/ending; không tự thêm cảnh thứ năm.

## Nhân vật — 9 PNG alpha

Sao chép nguyên bản từ `../chapter-03/char/`, đúng bộ 17 tuổi. An polo vàng/quần xanh dài; Minh polo navy/quần be dài. Cô Linh dùng mẫu người lớn chibi cố định: sơ mi xanh, kính đen, tóc buộc. Giữ tỷ lệ chibi và căn chân bằng `contain`, không kéo dài thân để diễn tả tuổi.

| File | Vai trò |
| --- | --- |
| `char/an/an-neutral.png` | Mở đầu/đọc dữ kiện |
| `char/an/an-thinking.png` | Kiểm tra điều kiện và quyết định |
| `char/an/an-worried-money.png` | Nhận ra tổn thất hoặc nghĩa vụ chưa xử lý |
| `char/an/an-relieved.png` | Đã hiểu và thực hiện bước bảo vệ phù hợp |
| `char/minh/minh-neutral.png` | Cùng đọc hồ sơ |
| `char/minh/minh-inviting.png` | Giới thiệu đề nghị vay nhanh trong SC02 |
| `char/co-linh/co-linh-neutral.png` | Lắng nghe |
| `char/co-linh/co-linh-explaining.png` | Giải thích điều kiện và kênh hỗ trợ |
| `char/co-linh/co-linh-encouraging.png` | Phản hồi và hỗ trợ phục hồi |

## Scam or Safe — 7 PNG alpha

Tất cả nằm trong `asset-mini-game/scam-or-safe/`, tạo mới từng ảnh riêng, 1280×1280.

| File | Chức năng |
| --- | --- |
| `message-phone.png` | Thẻ tin nhắn/OTP, dùng chung cho các tình huống để không lộ đáp án bằng hình |
| `link-inspection.png` | Mở kiểm tra đường dẫn, người gửi và bối cảnh |
| `time-pressure.png` | Minh họa dấu hiệu thúc ép thời gian; không bắt buộc người chơi trả lời nhanh |
| `stop-transaction.png` | Thẻ hành động 1: dừng giao dịch |
| `official-contact.png` | Thẻ hành động 2: liên hệ kênh chính thức đã đối chiếu độc lập |
| `protect-account.png` | Thẻ hành động 3: bảo vệ tài khoản |
| `save-evidence.png` | Thẻ hành động 4: lưu bằng chứng và báo cáo |

Lượt 1 phân loại dấu hiệu theo dữ kiện, lượt 2 xếp thẻ hành động. Nhãn, lời nhắn, URL giả lập, lý do, thứ tự và đúng/sai phải nằm trong UI. Không lấy màu hình làm đáp án, không yêu cầu nhập OTP/số điện thoại thật. Một hình tin nhắn có thể dùng cho nhiều thẻ nội dung.

## Props

| File | Nguồn và cách dùng |
| --- | --- |
| `props/insurance-terms-folder.png` | Tạo mới alpha; minh họa mở Inspect phạm vi, loại trừ, phần tự trả và hồ sơ. Chi tiết do UI hiển thị. |
| `props/medical-receipt.png` | Sao chép `../chapter-06/props/terms-and-fees.png`; hóa đơn/chứng từ minh họa, không tự chứng minh đã trả hay được duyệt. |

## Dữ kiện nội dung cần giữ khi tích hợp

Money đầu 1.500.000đ; chi phí y tế giả lập 300.000đ. Khoản dự trù không là ví riêng. Phí bảo hiểm đã trả trước tình huống, phần tự trả 100.000đ; tối đa 200.000đ có thể được xét chi trả sau hồ sơ hợp lệ, chưa cộng vào Money. Chọn dùng tiền hiện có còn 1.200.000đ. Vay nóng gồm nhận 300.000đ rồi chi 300.000đ, nghĩa vụ 360.000đ sau một tháng.

Tin “nhận ngay 200.000đ, nhập OTP” là giả lập cố định. Nhập OTP gây tổn thất mô phỏng 150.000đ; phục hồi không tự hoàn tiền. Chuyển cho người lạ hứa thu hồi gây chi thêm 100.000đ. Đã lộ dữ liệu vẫn ghi nhận ending Recovery theo GDD, kể cả sau bảo vệ. Ảnh không cố định kết quả nhánh.

Kiểm kê/kích thước/checksum: [manifest](../chapter-07-08-manifest.json). [Bảng xem toàn bộ ảnh](../../../../output/chapter-07-08-art/chapter-07-review.png). [Prompt tạo ảnh](../../../../output/chapter-07-08-art/final-prompts.md).
