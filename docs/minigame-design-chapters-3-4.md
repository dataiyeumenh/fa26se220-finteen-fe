# FinTeen — Thiết kế mini-game Chương 3 và Chương 4

> **Trạng thái:** Đề xuất thiết kế đầy đủ để duyệt nội dung, chuẩn bị tài nguyên và triển khai. Chưa phải gameplay đã được code.
>
> **Nguồn:** `cot_truyen_text.txt`, `chuong-3-backgrounds.md`, `chuong-4-backgrounds.md`, bản đề xuất `docs/minigame-design-chapters-2-8.md` và ý tưởng người dùng: hai ảnh hợp đồng, tìm 10 điểm khác biệt trên ảnh thứ hai.
>
> Các lời thoại, bộ số và luật chơi bổ sung được ghi rõ là thiết kế mới. Khi khác với lựa chọn A/B cũ, phải thay bảng nhánh tương ứng; không cộng cả hệ quả cũ và hệ quả mới.

## Mục lục

1. Hướng thiết kế và thứ tự chơi
2. Chương 3: Bản đồ phòng trọ
3. Chương 3: Lịch tuần 20 giờ
4. Chương 3: Bốn lọ ngân sách
5. Chương 3: Bảy ngày trước kỳ tiền mới
6. Chương 4: Tìm 10 thay đổi trong hợp đồng
7. Chương 4: Lịch trả sau
8. Chương 4: Thám tử cuộc chat
9. Liên kết truyện, trạng thái và điểm
10. Tài nguyên, giao diện và kế hoạch triển khai
11. Checklist nghiệm thu

---

## 1. Hướng thiết kế và thứ tự chơi

### Mục tiêu

Người chơi phải cảm thấy đang cùng Tí giải quyết đời sống: tìm chỗ ở, chia thời gian, giữ tiền qua tháng, đọc giấy tờ và kiểm chứng lời mời. Không chuyển mọi nhiệm vụ thành bài trắc nghiệm, cũng không dùng thao tác nhanh để thay cho hiểu biết tài chính.

### Danh sách đầy đủ

| ID | Chèn vào cốt truyện | Tên trò | Quy mô | Thời lượng dự kiến |
| --- | --- | --- | --- | --- |
| C3-G1 | Mission 3.1 | Phòng rẻ có thật sự rẻ? | Tương tác ngắn | 1–2 phút |
| C3-G2 | Mission 3.2 | Một tuần của Tí | Mini-game chính | 3–5 phút |
| C3-G3 | Mission 3.3 | Bốn lọ, một tháng | Mini-game chính ngắn, phát triển trò có sẵn | 2–3 phút |
| C3-G4 | Mission 3.4 + Life Event 3 | Bảy ngày còn lại | Tùy chọn mở rộng | 1–2 phút |
| C4-G1 | Mission 4.1 | Hợp đồng đã bị thay đổi! | Mini-game chính theo ý tưởng người dùng | 4–6 phút, không ép thời gian |
| C4-G2 | Mission 4.2 | Mua hôm nay, trả ngày nào? | Tương tác ngắn | 1–2 phút |
| C4-G3 | Mission 4.3 | Cuộc chat có vấn đề | Mini-game phụ | 2–3 phút |

**Bản đầu nên làm:** C3-G2, C3-G3, C4-G1 và C4-G3. C3-G1/C4-G2 có thể bắt đầu bằng giao diện tương tác đơn giản; C3-G4 để tùy chọn. Không bắt người chơi làm liên tiếp bốn màn dài trong một chương.

### Luật chung

- Hướng dẫn bằng một thao tác mẫu; không mở đầu bằng một trang luật dài.
- Mọi trò kéo thả đều có cách bấm chọn rồi bấm đích, dùng được trên điện thoại và bàn phím.
- Được thử lại trước khi xác nhận; thử lại không tạo thêm tiền hoặc điểm hành trình.
- Không trừ tiền nhân vật vì bấm nhầm vùng ảnh.
- Thông tin đủ để ra quyết định phải được cung cấp trước khi chấm.
- Câu hỏi kiến thức có đáp án; lựa chọn đời sống có thể có nhiều phương án hợp lý.
- Bảng kết quả chỉ giải thích các hệ quả thật sự được mô hình hóa.
- Số lãi, phí, thu nhập bổ sung trong tài liệu là **dữ liệu giả lập cho trò chơi**, không phải báo giá hay quy định hiện hành.

---

## 2. C3-G1 — Phòng rẻ có thật sự rẻ?

### Bối cảnh và bài học

Tí vừa lên thành phố. Hai phương án gốc: gần trường 3 triệu/tháng và ngoại ô 1,5 triệu/tháng, mất 1,5 giờ đi lại mỗi ngày. Trò giúp so sánh tổng chi phí và thời gian, không chỉ giá thuê.

### Giao diện

Bản đồ nhỏ có trường học và hai phòng trọ. Bên dưới là hai thẻ tổng hợp: tiền thuê, khoản đi lại đã biết, thời gian di chuyển, phần ngân sách còn lại. Không cần bản đồ địa lý thật.

### Vòng chơi

1. Bấm một địa điểm để mở thông tin phòng.
2. Bấm tuyến di chuyển để thấy thời gian trong một ngày và số ngày đi học đã quy định trong tình huống.
3. Đặt thẻ chi phí vào hồ sơ từng phòng: tiền thuê, đi lại và các khoản được cung cấp.
4. Chạy thử một ngày: Tí rời phòng, đến trường, về nhà. Có thể bỏ qua hoạt cảnh.
5. Chọn phòng và chọn lý do ưu tiên: ngân sách, thời gian học hoặc việc làm gần đó.

### Kết quả

Không chấm phòng trung tâm là luôn đúng. Hiện: “Bạn giữ được nhiều tiền hơn, nhưng cần dành thêm thời gian đi lại” hoặc “Bạn tiết kiệm thời gian, nhưng ngân sách tháng cần thêm nguồn bù”.

**Thông số phải chốt:** 1,5 giờ trong nguồn là thời gian đi lại mỗi ngày; không tự nhân đôi thành 3 giờ. Chi phí vé xe, điện nước và đặt cọc chưa có thì phải cung cấp trước, không giấu để phạt sau.

### Nối truyện và tài nguyên

Lưu `housingChoice`, chi phí thuê và thông tin lịch đi lại. Không nhận nhà bằng cách trừ tiền ở cả mini-game lẫn cảnh thoại. Tái sử dụng ảnh hai phòng trong bộ chương 3; đường và thẻ chi phí dựng bằng code.

---

## 3. C3-G2 — Một tuần của Tí

### Bối cảnh

Mission 3.2 cho Tí 20 giờ linh hoạt mỗi tuần. Kịch bản có hai hướng: làm cà phê nhiều giờ, hoặc kết hợp gia sư và tự học. Trò mới cho phép tự xếp một kế hoạch, không chỉ chọn A/B.

### Mục tiêu học

Hiểu rằng thu nhập trước mắt, thời gian học và khả năng phục hồi cạnh tranh cùng một quỹ thời gian. Nhìn thấy lịch làm phù hợp còn phụ thuộc thời điểm, không chỉ tổng số giờ.

### Giao diện

```text
MỘT TUẦN CỦA TÍ           Đã xếp 14/20 giờ

[Ca cà phê] [Gia sư] [Tự học] [Phục hồi]

       T2    T3    T4    T5    T6    T7    CN
Lịch   Các buổi học và sinh hoạt cố định đã được đánh dấu
Trống  Các ô để xếp hoạt động, đúng 20 giờ linh hoạt

Tiền dự kiến | Tiến độ học | Mức tải lịch
                         [Chạy thử tuần]
```

### Thiết kế bảng lịch

- Có 10 ô linh hoạt, mỗi ô 2 giờ, chia quanh lịch học cố định.
- Giờ ngủ, ăn, học bắt buộc đã được tính bên ngoài 20 giờ; không buộc người chơi mua quyền ngủ bằng giờ linh hoạt.
- Mặc định 20 giờ là sau các nghĩa vụ nền và đi lại đã biết. Phòng xa ảnh hưởng vị trí ô trống và khả năng nối ca; không trừ giờ di chuyển lần hai.
- Một ca có thể cần hai ô liên tiếp. Ca gia sư chỉ có ở một số khung giờ đã công bố.

### Bộ dữ kiện mẫu để chạy thử

**Đề xuất mới, cần duyệt cân bằng trước khi code:**

- Cà phê: 2 giờ/thẻ; mô phỏng 4 tuần/tháng, mỗi thẻ lặp hằng tuần tạo 250.000đ/tháng. Đủ 20 giờ cà phê mỗi tuần tương ứng 2,5 triệu/tháng, khớp lựa chọn gốc.
- Gia sư: 2 giờ/thẻ; tối đa 5 thẻ/tuần; mỗi thẻ lặp tạo 300.000đ/tháng. 10 giờ/tuần tương ứng 1,5 triệu/tháng, khớp nguồn.
- Tự học: 2 giờ/thẻ; mục tiêu tuần 4 thẻ trước hạn bài tập Chủ nhật.
- Phục hồi: hoạt động thư giãn thêm ngoài sinh hoạt cơ bản; có tác dụng giảm tải lịch theo luật công khai.
- Một cấu hình ví dụ khả thi: 5 thẻ gia sư + 4 thẻ tự học + 1 thẻ phục hồi. Các vị trí ca phải được bố trí để cấu hình này thật sự xếp được.
- Thu nhập tạo ra là lịch thu dự kiến của tháng, không được cộng cả tháng ngay khi vừa xếp lịch tuần.

Đây là một cách chuyển hai phương án nguồn sang trò xếp lịch, không phải thông tin tiền công ngoài đời.

### Cách chơi

1. Xem mục tiêu bài tập và lịch các ca có thể nhận.
2. Kéo thẻ vào ô hoặc bấm thẻ rồi chọn ô.
3. Lịch trùng bị chặn; lịch nặng được cảnh báo nhưng không tự xóa lựa chọn.
4. Bấm “Chạy thử”: từng ngày hiện việc đã hoàn thành, tiền dự kiến và mức tải.
5. Màn tổng kết cho biết ràng buộc nào đáp ứng/chưa đáp ứng; cho sửa rồi xác nhận.

### Cách đánh giá

Đánh giá riêng ba trục: **khả thi về lịch**, **bảo vệ mục tiêu học**, **nguồn tiền**. Không gộp tất cả thành con số “giỏi tài chính” duy nhất. Nghỉ thêm không tự bị xem là lười; làm nhiều không tự bị xem là sai.

Ví dụ phản hồi:

- “Thu nhập dự kiến cao, nhưng còn thiếu hai buổi tự học trước hạn.”
- “Kế hoạch học đủ, nhưng ngân sách tháng chưa bù được tiền trọ đã chọn.”
- “Lịch này giữ được việc học và có nguồn thu; hãy đối chiếu với bốn lọ ở nhiệm vụ tiếp theo.”

### Nhánh và lỗi cần tránh

Kết quả có thể là `study_protected`, `income_focused`, `needs_revision`. Life Event học lại chương 4 phải xét trạng thái học đã lưu, không phạt mọi người như nhau. Không tự chẩn đoán kiệt sức hay ép quyết định mua sắm chỉ từ một thanh điểm.

### Tài nguyên

Một mặt bàn/sổ lịch, 4 icon hoạt động, thẻ ca làm và vài động tác nhỏ của Tí. Chữ, ô lịch, điểm và tiền dùng HTML/SVG, không gen vào ảnh.

---

## 4. C3-G3 — Bốn lọ, một tháng

### Bối cảnh và mục tiêu

Mission 3.3 đã có bốn lọ: trọ, ăn uống, đi lại, giải trí. Người chơi phân bổ 4 triệu gia đình gửi cộng những nguồn thu thực sự đã xác nhận. Học phân biệt phân bổ tiền với tiêu tiền.

### Cách chơi

1. Hóa đơn thuê từ lựa chọn 3.1 xuất hiện trước. Các mức chi cơ bản khác được niêm yết trong tình huống.
2. Người chơi kéo tiền vào lọ hoặc dùng nút +/- và nhập số.
3. Lọ đầy lên, còn lịch tháng cho thấy những nghĩa vụ đã có tiền dành sẵn.
4. Bấm kiểm tra: chỉ ra khoản thiếu cụ thể, không chỉ thông báo “phân bổ sai”.
5. Có thể chạy thử hóa đơn tăng 400.000đ. Đây là xem trước giả định, chưa phải sự kiện thật và chưa trừ vào tài khoản.
6. Xác nhận kế hoạch, trở lại câu chuyện.

### Điểm quan trọng về dữ kiện

Phòng 3 triệu + ăn tối thiểu 1,5 triệu đã vượt 4 triệu. Trò phải mở cách nhìn phần thiếu và nguồn bù, không bắt tìm tỷ lệ hợp lệ trong một bài toán không có nghiệm. Thu nhập chưa đến ngày nhận không dùng để trả hóa đơn đã quá hạn.

Chuyển 500.000đ vào lọ không đồng nghĩa đã chi 500.000đ. Lưu `reservedBudget`; chỉ giảm tiền khi hóa đơn thật được thanh toán. Không biến chuyển tiền giữa lọ thành thu nhập mới.

### Chấm và phản hồi

Chấp nhận nhiều tỷ lệ, miễn đáp ứng ràng buộc hoặc có phương án bù được xác nhận. Không bắt phần giải trí luôn bằng 0. Khi không đủ nguồn lực, người chơi vẫn đạt mục tiêu nhận diện thiếu hụt và chọn hỗ trợ; không bị khóa vô hạn.

### Tài nguyên

4 lọ rỗng, hóa đơn, ví và nền bàn. Mức nước/tiền trong lọ vẽ động bằng code.

---

## 5. C3-G4 — Bảy ngày còn lại

### Vai trò

Tương tác tùy chọn ở Mission 3.4, dùng ví còn 120.000đ và 7 ngày tới tiền mới. Không phải trò thi sống bằng ăn mì. Mục tiêu là nhìn lịch thiếu hụt và xử lý sớm.

### Vòng chơi

- Bảy thẻ ngày, các nghĩa vụ đã biết và thời điểm tiền về.
- Đặt các khoản chi hoặc nguồn hỗ trợ vào ngày cụ thể.
- Nếu chọn mượn bạn 200.000đ như truyện, phải đặt thêm một thẻ nghĩa vụ trả, không chỉ hiện tiền tăng.
- Cho xem và xác nhận phương án, không yêu cầu tối đa hóa tiết kiệm bằng bỏ nhu cầu cơ bản.

Ở Life Event 3, hóa đơn điện nước tăng 400.000đ được thêm vào sổ tiền **một lần**. Nếu không đủ, cho thấy khoản thiếu và chọn xử lý; không âm thầm biến phần thiếu thành RISK rồi quên nghĩa vụ.

Có thể giữ nhiệm vụ này dưới dạng thoại và lựa chọn trong bản đầu để tránh chương 3 quá dài.

---

## 6. C4-G1 — Hợp đồng đã bị thay đổi!

### 6.1. Ý tưởng chính của người dùng

Có **hai ảnh hợp đồng** gần như giống nhau:

- Bên trái: bản được gửi cho Tí trước đó.
- Bên phải: bản được đưa cho Tí lúc chuẩn bị ký.

Người chơi bấm trên **ảnh bên phải** để tìm **đúng 10 nội dung đã bị sửa**. Tìm đúng thì khoanh vị trí tương ứng ở cả hai bản và tăng tiến độ. Đây là trò tìm điểm khác biệt theo hình ảnh, không thay bằng một bảng câu hỏi A/B.

### 6.2. Tình huống trong truyện

Gắn vào Mission 4.1: máy hỏng, Tí cần laptop làm đồ án. Cửa hàng giới thiệu máy 18 triệu và trả 1,5 triệu × 12 tháng.

**Đoạn dẫn bổ sung đề xuất:**

> Nhân viên: “Đây là bản hợp đồng em xem trước. Lát nữa anh đưa bản ký nhé.”
>
> Tí: “Khoan… bản này hình như không giống bản gửi lúc đầu.”
>
> Hướng dẫn: “Tìm 10 nội dung đã thay đổi trên bản bên phải. Bạn có thể phóng to để đọc.”

Việc có hai bản khác nhau là tình tiết mới cho mini-game, không được nói là nguyên văn cốt truyện đã có. Không kết luận mọi thay đổi đều gian lận; mục tiêu là phát hiện và yêu cầu làm rõ trước khi ký.

### 6.3. Hai lớp mục tiêu

1. **Quan sát:** tìm được trường thông tin khác nhau.
2. **Hiểu:** biết thay đổi đó ảnh hưởng tổng chi phí, thời hạn hoặc quyền lợi thế nào.

Bản trái chỉ là bản tham chiếu, không mặc định là hợp đồng tốt hay phù hợp với Tí.

### 6.4. Bố cục màn hình

```text
HỢP ĐỒNG ĐÃ BỊ THAY ĐỔI!                    Đã tìm: 04 / 10
Bấm vào phần khác trên bản bên phải.

[BẢN ĐƯỢC GỬI TRƯỚC]             [BẢN ĐƯA ĐỂ KÝ]
[Ảnh hợp đồng tham chiếu]         [Ảnh hợp đồng tương tác]
[Khoanh đối chiếu tương ứng]      [Khoanh những mục đã tìm]

[Thu nhỏ] [Phóng to] [Về toàn trang]     [Gợi ý] [Các mục đã tìm]

Thông tin vừa tìm: Phí hồ sơ tăng từ … thành …
                                             [Xem kết quả]
```

- Desktop: hai cột cùng kích thước, cùng vị trí cuộn khi bật “Cuộn đồng bộ”.
- Điện thoại dọc: chuyển giữa hai tab “Bản trước/Bản ký”; giữ cùng mức zoom và vùng đang đọc. Chỉ bản ký nhận lựa chọn.
- Không thu hai trang chữ thành hai ảnh nhỏ đến mức không đọc được.
- Mở bảng giải thích không che khu vực hợp đồng đang thao tác; dùng khay nhỏ phía dưới hoặc bảng có thể đóng.
- Không chèn hộp thoại nhân vật trong khi tìm điểm khác biệt.

### 6.5. Bộ 10 khác biệt cụ thể

**Toàn bộ bảng dưới là dữ liệu hư cấu để thiết kế trò chơi, không phải mẫu hợp đồng thật.** Giữ thời hạn trả góp 12 tháng, lãi suất ghi trên cả hai bản là 0%, không có trả trước. Khoản trả góp hàng tháng dưới đây chỉ là tiền máy, chưa gồm các phí riêng đã ghi rõ.

| # | Trường duy nhất bị thay đổi | Bản gửi trước | Bản đưa ký | Điều cần giải thích |
| --- | --- | --- | --- | --- |
| 1 | Giá máy tài trợ | 18.000.000đ | 18.600.000đ | Giá món hàng trong bản ký đã khác |
| 2 | Tiền máy trả mỗi tháng | 1.500.000đ | 1.550.000đ | Nghĩa vụ định kỳ cao hơn; hai giá trị vẫn khớp với 12 kỳ |
| 3 | Phí hồ sơ một lần | 0đ | 300.000đ | Có khoản chi ngoài giá máy ngay khi ký |
| 4 | Phí dịch vụ mỗi tháng | 0đ | 25.000đ | Khoản nhỏ lặp lại qua nhiều kỳ vẫn tạo chi phí |
| 5 | Phí cho một lần trả trễ | 50.000đ | 150.000đ | Chi phí nếu xảy ra vi phạm đã đổi |
| 6 | Ngày đến hạn hằng tháng | Ngày 10 | Ngày 05 | Cần đối chiếu ngày nhận tiền với ngày phải trả |
| 7 | Khoảng gia hạn mô phỏng | 3 ngày | 0 ngày | Ít thời gian xoay xở hơn; không mặc định hợp đồng thật có gia hạn |
| 8 | Phí tất toán sớm mô phỏng | 0% dư nợ tiền máy còn lại | 2% dư nợ tiền máy còn lại | Trả hết sớm cần xem điều kiện áp dụng |
| 9 | Dịch vụ bảo vệ thiết bị | Không đăng ký · 0đ/tháng | Có đăng ký · 60.000đ/tháng | Kiểm tra dịch vụ thêm và việc đã đồng ý hay chưa |
| 10 | Thời hạn bảo hành ghi trong giấy | 12 tháng | 6 tháng | Khác biệt còn nằm ở quyền lợi, không chỉ tiền |

**Chống phát sinh khác biệt ngoài ý muốn:**

- Mỗi hàng trên là một vùng cần tìm. Hàng 9 có hai đoạn chữ đổi nhưng tính một mục vì thuộc cùng trường dịch vụ.
- Giá máy và tiền máy/tháng là hai mục riêng có quan hệ với nhau; phần giải thích chỉ ra mối liên hệ.
- Không in thêm “tổng phải trả” trong ảnh vì con số suy ra sẽ tạo khác biệt thứ 11. Tổng chỉ xuất hiện ở màn giải thích sau trò chơi.
- Mọi trường còn lại giống hệt: tên Tí, tên cửa hàng hư cấu, mã tài liệu, số trang, thời hạn 12 tháng, tiêu đề, bố cục, chữ ký trống, font, con dấu minh họa nếu có.
- Không có khác biệt về vết giấy, vị trí trang trí hoặc màu nền làm người chơi hiểu nhầm đó là mục cần tìm.
- Dùng đúng 10 vùng được đánh số nội bộ; không đánh số đáp án trên ảnh.

### 6.6. Phép tính kết quả mẫu, có thể kiểm thử

Trong mô phỏng này, không có trả trễ/tất toán sớm và dịch vụ thiết bị được thu đủ 12 tháng:

- Bản trước: 1.500.000 × 12 = **18.000.000đ**.
- Bản ký: 1.550.000 × 12 + 300.000 + 25.000 × 12 + 60.000 × 12 = **19.920.000đ**.
- Chênh lệch: **1.920.000đ**.
- Tiền phải trả thường kỳ ở bản ký: 1.550.000 + 25.000 + 60.000 = **1.635.000đ/tháng**, chưa tính phí hồ sơ một lần.
- Phí trễ và phí tất toán chỉ tính nếu đúng điều kiện phát sinh, không cộng sẵn cả hai vào chi phí chắc chắn.

Không gọi chênh lệch này là lãi suất thực của một sản phẩm thật. Đây là tổng dòng tiền theo bộ dữ liệu trò chơi.

### 6.7. Từng bước chơi

1. Hai bản xuất hiện cùng mức zoom. Làm mẫu thao tác bằng một chú thích ngoài ảnh; không tự tiết lộ một đáp án.
2. Người chơi bấm vùng bên phải. Nếu trúng một mục chưa tìm, lưu ID mục đó và đánh dấu trên cả hai bản.
3. Khoanh xanh kèm số thứ tự đã tìm, không chỉ đổi màu.
4. Khay phản hồi ghi “Mục 3: Phí hồ sơ” và một câu giải thích. Có thể đọc kỹ sau để không ngắt dòng quan sát.
5. Bấm lại mục đã tìm: mở lại giải thích, không cộng lần hai.
6. Bấm sai: một vòng mờ hiện ngắn rồi mất, nhắc “Hãy so lại cùng dòng ở bản trái”. Không rung toàn màn hình, không trừ WEALTH.
7. Khi đủ 10, mở “Xem kết quả”; không tự nhảy sang cảnh mới trước khi người chơi đọc.
8. Sau kết quả, Tí chọn bước tiếp theo trong câu chuyện.

### 6.8. Gợi ý và hỗ trợ

- Gợi ý mức 1: nói nhóm cần xem, ví dụ “Hãy kiểm tra ngày thanh toán”.
- Mức 2: làm sáng vùng rộng chứa dòng tương ứng trên cả hai bản.
- Mức 3: chỉ rõ khác biệt, ghi nhận “Được hướng dẫn” thay vì tự tìm.
- Không giới hạn thời gian. Có thể ghi thời gian hoàn thành cho người thích thử lại, nhưng không dùng để phạt hoặc quyết định cốt truyện.
- Có chế độ đối chiếu bằng văn bản với 10 trường và các trường giống nhau để hỗ trợ bàn phím, đọc màn hình hoặc ảnh không tải được. Chế độ này cùng mục tiêu học, không bắt buộc dùng mắt dò ảnh.
- Không khóa câu chuyện nếu còn thiếu một mục: cho xem giải thích có hướng dẫn rồi tiếp tục.

### 6.9. Kết quả và chấm điểm

Tách kết quả thành:

- `foundIndependently`: tự tìm.
- `foundWithHints`: tìm sau gợi ý.
- `revealed`: được chỉ rõ.
- `understoodTopics`: chủ đề đã xem giải thích/hoàn thành đối chiếu cuối.

Không cần một điểm 100 để phân biệt giỏi/kém. Có thể hiện “Tự tìm 7/10 · Có gợi ý 2 · Đã xem giải thích 1”.

Sau khi tìm xong, thêm **hai tương tác ngắn**:

1. Chọn các khoản phát sinh chắc chắn để tính tổng chi phí theo giả định đã nêu.
2. Chọn một bước hợp lý: yêu cầu đối chiếu và giải thích/sửa bản ký, tạm dừng để xem khả năng trả, hoặc quay lại phương án máy cũ.

Không đánh giá hiểu tài chính chỉ từ khả năng tìm 10 số khác nhau. Không trừ tiền vì bấm sai. Điểm FIQ và nhánh thoại cụ thể cần cân bằng với tổng chương, chưa mặc định thưởng 10 điểm mỗi khác biệt.

### 6.10. Trở lại câu chuyện

Các nhánh đề xuất:

- **Phát hiện và yêu cầu làm rõ:** nhân viên đối chiếu, Tí chỉ xem xét ký một bộ điều khoản được xác nhận rõ.
- **Tạm hoãn để tính ngân sách:** mở bảng khả năng trả theo thu nhập và nghĩa vụ hiện có.
- **Chọn máy cũ:** nếu đủ 5 triệu SAVINGS, mua theo nhánh gốc; nếu thiếu thì phải có thoại/nhánh khác, không cho số dư âm ngầm.
- **Muốn ký bản hiện tại:** chỉ sau khi hiện rõ tổng tiền và nghĩa vụ; đây là quyết định truyện, không bị ép vì tìm thiếu điểm khác biệt.

Nếu giữ hoàn toàn nhánh A/B cũ, mini-game chỉ tạo một cờ `contractReviewed` và mở phần giải thích; không tự thay giá khoản vay thật trong hệ thống. Nếu dùng bản hợp đồng mới làm giao dịch thật của Tí, phải thay toàn bộ bảng tiền và thoại liên quan. Chỉ chọn một cách tích hợp khi code.

### 6.11. Cách sản xuất đúng hai ảnh

**Đề xuất dùng một mẫu giấy rồi xuất hai phiên bản từ cùng bố cục.** Người chơi vẫn nhìn hai ảnh PNG đúng như ý tưởng ban đầu.

1. Gen nền tài liệu/giấy đẹp nếu cần, không gen số tiền và đoạn chữ dài.
2. Dựng một bố cục hợp đồng với font tiếng Việt rõ bằng HTML/SVG hoặc công cụ dàn trang.
3. Đổ bộ dữ liệu bản trước và bản ký vào đúng cùng các ô.
4. Xuất hai PNG cùng kích thước, cùng căn lề và cùng font.
5. Lập bảng 10 vùng bấm tương ứng.
6. So sánh pixel bằng công cụ kiểm tra để xác nhận chỉ 10 vùng thay đổi, kiểm tra trực quan chữ Việt và toàn bộ số tiền.

**Kích thước đề xuất:** 1600 × 2200 px cho mỗi ảnh một trang. Các dòng cần đọc được khi phóng to. Mỗi trường có hộp cố định đủ chứa giá trị dài hơn, tránh xuống dòng làm dịch toàn trang.

Tên tài nguyên:

```text
public/images/minigames/chapter-4/contract-diff/
  c4_contract_reference.png
  c4_contract_changed.png
  c4_contract_paper.png        # tùy chọn, nền mẫu
```

Dữ liệu vùng và nội dung giải thích đặt trong source, không nhúng đáp án thành chữ trong tranh.

Nếu dùng AI để tạo cả hai bản: gen một bản trước rồi chỉnh từ bản đó, yêu cầu giữ mọi phần còn lại. Tuy nhiên vẫn phải kiểm tra đủ chữ và đúng 10 khác biệt; không coi kết quả gen là dữ liệu chuẩn tự động.

### 6.12. Quy tắc vùng bấm và phóng to

Lưu vùng theo tỷ lệ 0–1 trên ảnh, không theo pixel màn hình:

```js
{
  id: 'processing_fee',
  referenceRegion: { x: 0.1, y: 0.3, width: 0.5, height: 0.05 },
  changedRegion: { x: 0.1, y: 0.3, width: 0.5, height: 0.05 },
  // Tọa độ trên chỉ minh họa cấu trúc, phải đo lại từ ảnh cuối.
  before: '0đ',
  after: '300.000đ',
  topic: 'upfront_cost',
  explanation: 'Phí hồ sơ là khoản chi thêm ngoài tiền máy.'
}
```

- Tính vị trí bấm dựa trên hình chữ nhật ảnh thực tế sau zoom/cuộn; không dựa trên vùng container có khoảng trống.
- Hai ảnh và lớp đánh dấu dùng cùng phép biến đổi để không lệch khoanh.
- Cho vùng bấm rộng hơn chữ một chút nhưng không chồng sang dòng khác.
- Kéo để pan không được tính là click. Kết thúc kéo/zoom không làm tăng bộ đếm.
- Có nút zoom và cuộn để dùng được cả khi không có thao tác chụm ngón tay.

---

## 7. C4-G2 — Mua hôm nay, trả ngày nào?

### Bối cảnh

Mission 4.2: app cho hạn mức BNPL 10 triệu, Tí muốn mua điện thoại. Học nhìn lịch nghĩa vụ tương lai, không nhầm hạn mức với tiền của mình.

### Cách chơi

Một màn điện thoại có thẻ mua hàng và lịch tháng. Người chơi mở điều kiện kế hoạch, đặt các kỳ thanh toán vào ngày đến hạn, rồi ghép với các ngày nhận tiền và hóa đơn sẵn có.

Nhấn “Xem tháng sau”: hiện tiền có thể dùng, tiền đã cam kết và ngày bị thiếu. Sau đó chọn mua, hoãn hoặc phương án phù hợp khác.

### Giới hạn dữ liệu

10 triệu trong nguồn là hạn mức, không phải tự động giá điện thoại. Bộ giá, số kỳ và phí phải được cung cấp khi thiết kế dữ liệu. Không mặc định “không lãi” là “không có chi phí”; cũng không tự thêm phí bí mật mà người chơi không được đọc.

Nếu đã mua laptop, nghĩa vụ laptop phải xuất hiện. Chỉ nhận thông báo được duyệt hạn mức không làm WEALTH tăng 10 triệu.

### Kết quả

Thưởng việc nhận ra xung đột ngày đến hạn và lập kế hoạch khả thi. Không bắt xóa mọi ứng dụng tài chính mới là đáp án đúng. Chỉ ghi nghĩa vụ sau khi xác nhận mua.

---

## 8. C4-G3 — Cuộc chat có vấn đề

### Bối cảnh

Mission 4.3: bạn cấp ba giới thiệu mô hình đầu tư “cam kết 30%/tháng”. Trò chơi là thu thập bằng chứng trong cuộc chat trước khi quyết định.

### Giao diện và cách chơi

- Bên trái là cuộc chat; bên phải là sổ “Điều đã biết / Điều cần kiểm tra”.
- Chọn một câu hỏi: tiền sinh lời từ đâu, tài liệu nào xác nhận, điều kiện rút tiền, bên nào chịu trách nhiệm.
- Sau mỗi câu trả lời, ghim nội dung có liên quan vào một chủ đề trong sổ.
- Kết thúc bằng lựa chọn hành động, không phải câu hỏi “Bạn này tốt hay xấu?”.

### Kịch bản mở rộng mẫu

| Tin nhắn | Người chơi nên làm gì | Bài học |
| --- | --- | --- |
| “Cam kết 30% mỗi tháng” — có trong nguồn | Yêu cầu cơ chế, bằng chứng và điều kiện | Không xem lời hứa là bằng chứng |
| “Chỉ hôm nay mới còn suất” — thoại mới | Không để áp lực thời gian thay việc kiểm tra | Trì hoãn để xác minh |
| “Cứ chuyển vào tài khoản cá nhân của tớ” — thoại mới | Kiểm tra bên nhận và tài liệu giao dịch | Tách tình bạn khỏi bằng chứng |
| “Không cần đọc, tớ làm rồi” — thoại mới | Yêu cầu thông tin có thể kiểm chứng | Lời kể không thay thế tài liệu |
| “Rủ thêm người thì thưởng thêm” — thoại mới | Hỏi nguồn tạo doanh thu thật | Tìm hiểu mô hình thay vì chỉ nhìn thưởng |

Không dùng tài khoản, link hoặc QR thật. Nếu tin nhắn mới không được đưa vào nội dung, không đòi người chơi phải tìm đúng dấu hiệu đó.

### Chấm và nối truyện

Chấm câu hỏi phù hợp, phân biệt lời hứa với chứng cứ và lựa chọn kiểm tra trước khi chuyển tiền. Không thưởng việc chửi người bạn hoặc đánh đồng mọi đầu tư với lừa đảo. Nếu người chơi chọn chuyển tiền theo nhánh gốc, phải có bước xác nhận trong bối cảnh trò chơi và chỉ áp dụng thiệt hại một lần.

### Tài nguyên

Tái sử dụng chân dung bạn cấp ba, điện thoại, bubble chat và sổ bằng chứng bằng code. Không cần gen một ảnh cho từng tin nhắn.

---

## 9. Liên kết truyện, trạng thái và điểm

### Dữ liệu cần lưu

| Dữ liệu | Nguồn | Nơi sử dụng |
| --- | --- | --- |
| Lựa chọn trọ, lịch và chi phí đi lại | C3-G1 | C3-G2, C3-G3 |
| Kế hoạch tuần và mục tiêu học | C3-G2 | Thu nhập dự kiến, điều kiện Life Event 4 |
| Phân bổ và ngày đến hạn | C3-G3 | C3-G4, biến cố điện nước |
| Nghĩa vụ mượn bạn | C3-G4 | Các tháng kế tiếp |
| Các mục hợp đồng đã tìm/đã hiểu | C4-G1 | Phản hồi kiến thức, thoại trước ký |
| Điều khoản giao dịch đã xác nhận | C4-G1, C4-G2 | Lịch trả nợ chương 5–6 |
| Kết quả kiểm chứng cuộc chat | C4-G3 | Nhánh từ chối/chuyển tiền và phản hồi |

### Ba loại trạng thái tách biệt

1. `attemptState`: vị trí thẻ, vùng hợp đồng đã tìm, zoom, số lần gợi ý.
2. `simulationState`: tiền và nghĩa vụ của lượt thử, có thể đặt lại.
3. `storyState`: chỉ cập nhật khi người chơi xác nhận kết quả/giao dịch.

Không dùng RISK để thay cho khoản nợ cụ thể. Không dùng WEALTH vừa làm tiền mặt vừa làm tài sản ròng nếu muốn các phép tính xuyên chương nhất quán.

### Kết quả đề xuất cho engine

```js
{
  gameId: 'c4_contract_diff',
  outcome: 'reviewed_with_guidance',
  evidence: {
    foundIds: [],
    hintedIds: [],
    revealedIds: [],
    understoodTopics: []
  },
  decision: null,
  ledgerChanges: [],
  statEffects: {},
  nextSceneId: 'c4_contract_review',
  confirmed: true
}
```

Mini-game ảnh hợp đồng không trực tiếp ký hợp đồng chỉ vì đã tìm đủ 10 mục. Hành động ký/mua nằm ở bước quyết định sau đó.

Engine hiện chỉ nhận `passed` và rẽ nhánh pass/fail. Khi triển khai cần thêm loại mini-game, màn kết quả và nhánh theo `outcome`; không nhét mọi kế hoạch vào một biến đúng/sai.

---

## 10. Tài nguyên, giao diện và kế hoạch triển khai

### Phân công tài nguyên

| Phần | Gen ảnh nếu cần | Dựng bằng code |
| --- | --- | --- |
| Phòng trọ | Hai bối cảnh hiện có | Thẻ chi phí, tuyến di chuyển |
| Lịch tuần | Mặt bàn hoặc giấy sổ | Lịch, thẻ ca, số giờ, cảnh báo |
| Bốn lọ | Lọ rỗng và vật trang trí | Mức tiền, hóa đơn, công thức |
| Hợp đồng | Nền giấy sạch | Nội dung chuẩn, xuất 2 ảnh, vùng bấm, khoanh |
| BNPL | Khung điện thoại tùy chọn | Lịch kỳ trả, số tiền, kết quả |
| Cuộc chat | Avatar nhân vật hiện có | Tin nhắn, lựa chọn hỏi, bảng bằng chứng |

### Phong cách

- Giấy kem, viền nâu, điểm nhấn vàng; phù hợp giao diện game đang làm.
- Baloo 2 cho tiêu đề, Be Vietnam Pro cho nội dung.
- Trò hợp đồng có chế độ đọc phóng to; không cố ép chữ 24px vào toàn bộ một trang A4 thu nhỏ.
- Không đặt sprite người nói đè vùng thao tác. Giữ menu ở góc và khóa cơ chế bấm nền để chuyển cảnh khi đang chơi mini-game.
- Nút quan trọng: “Chạy thử”, “Kiểm tra”, “Xem kết quả”, “Xác nhận”. Không dùng một nút “Tiếp tục” cho bốn hành động khác nhau.

### Thứ tự làm đề xuất

1. **C4-G1 bản mẫu:** hai tài liệu cùng bố cục, 10 vùng bấm, zoom, giải thích. Đây là trò có ý tưởng rõ nhất để duyệt trải nghiệm.
2. **C3-G2:** lịch 20 giờ, các điều kiện và một kế hoạch mẫu hợp lệ.
3. **C3-G3:** bộ tính ngân sách, thiếu hụt và ngày đến hạn.
4. **C4-G3:** cuộc chat và bảng bằng chứng.
5. Bổ sung C3-G1/C4-G2, cân nhắc C3-G4 sau khi chơi thử nhịp cả chương.

---

## 11. Checklist nghiệm thu

### Riêng hai ảnh hợp đồng

- Có đúng 10 trường khác; phần ngoài vùng cho phép giống nhau.
- Chữ tiếng Việt không lỗi; giá máy và 12 khoản tiền máy cộng khớp.
- Tổng mẫu: 18.000.000đ và 19.920.000đ trong trường hợp đã quy định.
- Không cộng phí có điều kiện nếu chưa phát sinh sự kiện.
- Bấm bên trái không vô tình nhận điểm; bấm lại mục cũ không cộng lại.
- Khoanh không lệch sau resize, zoom, pan, cuộn hoặc chuyển tab.
- Gợi ý không tiết lộ mục đã tìm; đủ 10 mới hiện trạng thái tìm đủ.
- Người dùng có thể dùng chế độ hỗ trợ và vẫn tiếp tục câu chuyện.

### Trạng thái và học tập

- Chưa ký/mua thì chưa có giao dịch, nghĩa vụ hoặc mất tiền.
- Lượt thử không tiêu tiền thật trong hành trình.
- Lưu/mở lại không cộng thưởng lần hai; bỏ dở có thể tiếp tục.
- Không có lịch tuần bất khả thi do dữ liệu ca sai.
- Nhánh phòng trọ đắt không bị ép giải ngân sách 4 triệu vô nghiệm.
- Thu nhập dự kiến khác tiền đã nhận; hạn mức tín dụng khác số dư.
- Không đánh rớt môn mọi người bất kể lựa chọn học trước đó.
- Kết quả giải thích đúng quyết định của người chơi, không dùng thoại khen/chê cố định.

**Kết luận thiết kế:** chương 3 cho người chơi sắp xếp nguồn lực; chương 4 cho người chơi quan sát, đối chiếu và kiểm chứng. Trò tìm 10 thay đổi là điểm nhấn của chương 4, còn các tương tác khác đưa kiến thức đó trở lại quyết định thật của Tí.
