# Đề xuất mini-game cho chương 2–8 — FinTeen

> Bản thiết kế đề xuất, chưa triển khai gameplay. Đọc từ `cot_truyen_text.txt`, đối chiếu các file `chuong-N-backgrounds.md` và cấu trúc VisualNovelPlayer hiện tại. Những vòng chơi, vật phẩm hoặc thông số mới dưới đây là thiết kế bổ sung, không phải nội dung đã có trong cốt truyện.

## 1. Hướng thiết kế chung

Mỗi chương nên có **một mini-game chính 3–5 phút** và **một tương tác ngắn 45–90 giây**. Không biến tất cả nhiệm vụ thành mini-game; giữ những cuộc đối thoại quan trọng để người chơi còn quan tâm tới Tí và các nhân vật.

Bảy chương có bảy cách chơi chính khác nhau:

| Chương đúng theo cốt truyện | Mini-game chính | Hành động chủ đạo | Bài học nhìn thấy qua thao tác |
| --- | --- | --- | --- |
| 2. Cấp 3 — Quản lý chi tiêu | Một buổi thay mẹ trông sạp | Mua nguyên liệu, định giá, phục vụ theo lượt | Doanh thu khác lợi nhuận; tiền bán hàng còn phải hoàn vốn |
| 3. Đại học — Chi phí sống và đánh đổi | Xếp một tuần không kiệt sức | Xếp khối thời gian lên lịch | Thời gian, thu nhập và việc học cạnh tranh cùng một nguồn lực |
| 4. Thực tập — Bước đầu tự lập | Thám tử hợp đồng 0% | Tìm và đối chiếu bằng chứng | Khoản trả mỗi tháng không phải toàn bộ chi phí hay nghĩa vụ |
| 5. Sau tốt nghiệp — Khủng hoảng | Chiếc cầu đến kỳ thu nhập tiếp theo | Lập phương án qua các lượt tuần | Thanh khoản, quỹ dự phòng và nghĩa vụ nợ khi mất thu nhập |
| 6. Có việc làm — Thế giới tài chính | Cỗ máy ngày lương | Nối dòng tiền theo thứ tự | Gross/Net, ưu tiên tiết kiệm, chi phí nợ còn lại |
| 7. Lập gia đình — Tài sản và rủi ro | Căn nhà qua ba mùa gió | Đặt kế hoạch rồi thử tình huống | Khả năng trả nợ cần chịu được biến động, không chỉ tháng thuận lợi |
| 8. Có con — Tương lai | Khu vườn 17 năm | Lập kế hoạch và chạy dòng thời gian | Thời gian tích lũy, học phí tăng, bảo vệ các mục tiêu dài hạn |

Nhịp mỗi trò: **câu chuyện đặt vấn đề → người chơi thử → thấy hậu quả → được giải thích → xác nhận kết quả → trở lại câu chuyện**.

### Quy tắc chấm

- Kiến thức có đáp án: có thể chấm đúng/sai, nhưng luôn giải thích.
- Quyết định cuộc sống: chấm khả năng hiểu ràng buộc và giữ kế hoạch khả thi; không mặc định người chi nhiều, thuê nhà, vay nợ hay có ít tiền là người chơi kém.
- Khi thiếu tiền do chương trước, có một nhánh hỗ trợ hoặc kế hoạch thu hẹp; không tạo màn chơi bất khả thi rồi quy lỗi người chơi.
- Tiền, nợ và chi phí chỉ cập nhật **một lần khi xác nhận**. Chơi thử lại dùng bản sao trạng thái, không cho cày FIQ hoặc tiền.
- Không tính điểm theo tốc độ bấm. Đồng hồ chỉ biểu diễn thời gian trong câu chuyện; luôn có thể tạm dừng.
- Dữ kiện lãi/phí/lương trên màn hình là thông số tình huống mô phỏng. Không trình bày số trong kịch bản như chính sách tài chính hiện hành.

---

## 2. Chương 2 — Một buổi thay mẹ trông sạp

### Nguồn cốt truyện

Mission 2.1: mẹ giao 200.000đ quản lý sạp ăn vặt. Mission 2.2: flash sale giày 300.000đ. Mission 2.3: có 300.000đ, sắp phải đóng 150.000đ, bạn rủ xem phim hết 250.000đ. Mission 2.4: thưởng học sinh giỏi 2 triệu. Cuối chương mất xe, cần 1,2 triệu.

### Mini-game chính: Sạp hàng một buổi chiều — Mission 2.1

**Màn hình:** sạp của mẹ ở giữa, khay nguyên liệu bên trái, khách xuất hiện bên phải. Chỉ hiện ba số: tiền trong ngăn kéo, vốn chưa thu hồi, lãi/lỗ. Sổ chi phí có thể mở để xem chi tiết.

**Cách chơi:**

1. Nhận đúng 200.000đ vốn. Đọc phiếu mua nguyên liệu có giá, lượng làm được và nguồn gốc.
2. Chọn lượng nhập, không vượt tiền đang có. Chọn một trong ba mức giá đã hiển thị.
3. Chơi ba lượt bán hàng. Mỗi lượt có nhóm khách với sức mua và nhu cầu rõ; người chơi quyết định phục vụ và trả tiền thừa bằng mệnh giá.
4. Đến cuối buổi, tự chia tiền trong ngăn kéo thành phần trả vốn cho mẹ và phần lãi. Game mới mở sổ đối chiếu.

**Ví dụ tính toán minh họa, không phải giá thị trường:** nhập 10 phần, tổng chi 200.000đ; bán đủ 10 phần với giá 28.000đ/phần → thu 280.000đ, lãi 80.000đ. Nếu chỉ bán 7 phần thì thu 196.000đ và còn hàng. Phải phân biệt tiền mặt đang thiếu so với vốn với giá trị hàng còn lại; nếu chốt hàng dễ hỏng hết giá trị cuối buổi, ghi rõ giả định này.

**Điểm thú vị:** mức giá cao làm mỗi đơn lời hơn nhưng có nhóm khách không mua; nhập nhiều tăng khả năng bán nhưng có thể tồn. Phiếu nguồn gốc cho người chơi kiểm tra an toàn trước khi mua. Không thưởng hành vi dùng nguyên liệu nguy hiểm, cũng không dựng toàn bộ trò thành phép cộng tiền thừa.

**Chấm:** nhận biết lãi thật, không vượt ngân sách, quyết định dựa trên dữ kiện và an toàn. Không dùng doanh thu đơn lẻ làm điểm thắng.

**Nối lại truyện:** lời mẹ nhận xét đúng hành vi. Nếu dùng trò thay lựa chọn A/B cũ, phải viết bảng kết quả mới; không vừa cộng lãi mô phỏng vừa cộng lại 280.000đ của nhánh gốc.

**Tài nguyên mới:** 3–4 nguyên liệu, 2–3 món ăn, tiền giấy và khay. Có thể tái sử dụng background sạp, sprite mẹ và Tí. Không cần gen ảnh kết quả cho mọi con số.

### Tương tác ngắn: Phong bì cuối tuần — Mission 2.3

Người chơi nhận 300.000đ và lịch hạn đóng tiền. Đặt trước 150.000đ vào phong bì bắt buộc, thử kéo vé xem phim 250.000đ vào phần còn lại: màn hình hiện thiếu 100.000đ và đúng ngày bị thiếu. Trước khi trả lời Hùng, người chơi nhìn thấy hậu quả của lịch chi tiền.

Có thể bổ sung phương án gặp bạn với chi phí thấp hơn, nhưng đó là nhánh thoại mới, không tự giả định truyện đã có. Không dạy rằng mọi giải trí đều sai. Mini-game sạp học **kiếm và tính tiền**, tương tác này học **dành tiền cho nghĩa vụ**.

---

## 3. Chương 3 — Xếp một tuần không kiệt sức

### Nguồn cốt truyện

Mission 3.1 chọn phòng gần trường 3 triệu hoặc xa trường 1,5 triệu, mất 1,5 giờ đi lại mỗi ngày. Mission 3.2 có 20 giờ rảnh/tuần để làm thêm hoặc học. Mission 3.3 đã có mini-game bốn lọ, ngân sách 4 triệu. Mission 3.4 thiếu tiền cuối tháng; biến cố thêm 400.000đ điện nước.

### Mini-game chính: Lịch tuần của Tí — Mission 3.2

**Màn hình:** sổ lịch bảy ngày nằm trên bàn học, cạnh đó là điện thoại báo ca làm. Các khối học bắt buộc và nghỉ ngơi nền đã khóa; người chơi phân bổ **20 giờ linh hoạt**, không phải chỉ được ngủ/nghỉ trong 20 giờ này.

**Cách chơi:**

1. Xem lịch đi lại đã chịu ảnh hưởng bởi lựa chọn phòng ở 3.1. Cần chốt 20 giờ trong nguồn là đã trừ thời gian di chuyển hay chưa; mặc định thiết kế là đã trừ, tránh tính hai lần.
2. Đặt các thẻ ca cà phê, gia sư, tự học và thời gian phục hồi vào ô trống. Ca làm có độ dài và thời điểm cụ thể, không chỉ kéo thanh tỷ lệ.
3. Những ca trùng lớp hoặc không đủ thời gian đi lại bị cảnh báo có lý do.
4. Bấm “Chạy thử tuần”. Tí đi qua lịch, hiện thu nhập, bài tập hoàn thành và mức mệt theo từng ngày.
5. Trước khi chốt được đổi một số thẻ để quan sát khác biệt. Deadline bài nhóm xuất hiện như dữ kiện biết trước, không phải bẫy bí mật cuối lượt.

**Điểm thú vị:** một ca lương cao có thể nằm ngay trước ngày thi; căn phòng xa khiến ca tối khó nối với buổi học sớm. Người chơi phải giải bài toán lịch, không chọn đáp án đạo đức.

**Chấm:** lịch không trùng, còn thời gian đạt mục tiêu học, dòng tiền khả thi và không quá tải theo quy tắc công khai. Chấp nhận nhiều lịch đạt yêu cầu.

**Ràng buộc số:** thu nhập trong nguồn là theo tháng, 20 giờ là theo tuần. Phải chọn một quy ước mô phỏng tuần–tháng rõ ràng trước khi định giá từng ca; không chia tùy tiện để làm gia sư luôn thắng.

**Nối truyện:** kết quả học và lịch đã chốt mới ảnh hưởng nguy cơ học lại ở Life Event 4. Không phạt học lại tự động nếu người chơi đã bảo vệ việc học.

**Tài nguyên:** sổ lịch, thẻ công việc, icon xe buýt/cà phê/sách. Toàn bộ ô lịch và số dựng bằng code.

### Tương tác ngắn: Bốn lọ biết báo trước — nâng cấp Mission 3.3

Giữ bốn lọ trong truyện, nhưng có hóa đơn phải thả vào trước. Mỗi lần cấp tiền cho một lọ, lịch tháng hiện những ngày đã đủ chi phí. Có nút “Thử hóa đơn tăng 400.000đ” để quan sát khả năng chịu biến cố, không tự trừ tiền ở lượt thử.

**Lỗi cần giải quyết:** 4 triệu không đủ cho phòng 3 triệu + ăn tối thiểu 1,5 triệu, chưa tính đi lại. Màn này phải thừa nhận thiếu ít nhất 500.000đ, dùng thu nhập làm thêm đã có hoặc cho lập phương án bù; không bắt tìm một tỷ lệ phân bổ không tồn tại. Đừng cộng thêm 4 triệu lần nữa nếu tiền đã được nhận ở cảnh dẫn nhập.

---

## 4. Chương 4 — Thám tử hợp đồng 0%

### Nguồn cốt truyện

Mission 4.1: laptop 18 triệu, trả 1,5 triệu × 12 tháng hoặc máy cũ 5 triệu. Mission 4.2: BNPL 10 triệu. Mission 4.3: lời mời cam kết 30%/tháng. Life Event 4 liên quan việc học từ chương 3.

### Mini-game chính: Chiếc kính lúp trước khi ký — Mission 4.1

**Màn hình:** quầy laptop, một tờ quảng cáo “0%” và hợp đồng dạng giấy lớn. Kính lúp là nút mở thông tin chứ không bắt lia chuột chính xác vào chữ nhỏ.

**Cách chơi:**

1. Bấm mở bốn bằng chứng: giá máy, lịch trả, các khoản phí, điều kiện trễ hạn.
2. Ghim bằng chứng vào ba câu hỏi: “Tổng số tiền?”, “Mỗi tháng phải dành bao nhiêu?”, “Nếu trả muộn thì sao?”.
3. Điền lịch nghĩa vụ vào dòng tiền của Tí. Cho chạy thử một tháng có học phí trước khi ký.
4. So sánh với máy cũ 5 triệu và yêu cầu tối thiểu để làm đồ án.
5. Người chơi tự quyết định, kèm chọn lý do. Xác nhận mới tạo nghĩa vụ trả nợ hoặc mua máy cũ.

**Điểm thú vị:** quảng cáo ngắn và dễ chịu; từng bằng chứng bổ sung làm thay đổi cách hiểu. Có phản hồi “Bạn đã xem được số tiền phải trả, nhưng chưa kiểm tra tháng đầu thiếu bao nhiêu”.

**Chấm:** đọc đủ thông tin quan trọng, tính tổng đúng và nhận ra khả năng chi trả; không mặc định mọi khoản vay đều xấu. Các khoản phí không có con số trong nguồn phải được thiết kế riêng và ghi là dữ liệu mô phỏng; không bịa phí để chứng minh đáp án định sẵn.

**Tài nguyên:** hợp đồng, lịch trả, hai thẻ laptop. Có thể dùng background cửa hàng sẵn có.

### Tương tác ngắn: Đọc vị cuộc chat — Mission 4.3

Cuộc chat hiện dần lời mời của bạn cũ. Người chơi chọn câu hỏi để hỏi lại: tiền sinh lời từ đâu, chứng cứ nào, rút tiền thế nào, vì sao được bảo đảm. Sau đó ghim các dấu hiệu đáng ngờ vào một bảng chứng cứ rồi quyết định chuyển tiền hay dừng.

Cam kết 30%/tháng là dữ kiện của kịch bản. Các câu ép chuyển ngay, giấu thông tin hoặc thưởng rủ bạn là **thoại bổ sung**, phải viết rõ trước khi đưa vào game. Thưởng việc kiểm tra và dừng giao dịch, không chấm chỉ dựa vào một từ khóa. Không dùng link, QR hay tài khoản thật.

---

## 5. Chương 5 — Chiếc cầu đến kỳ thu nhập tiếp theo

### Nguồn cốt truyện

Thất nghiệp 2,5 tháng; tiền nhà 3 triệu đến hạn; họp lớp gây áp lực sĩ diện; offer 4,5 triệu với điều kiện bất lợi; cuối chương viện phí 3 triệu.

### Mini-game chính: Kế hoạch vượt tháng khó — Mission 5.1

**Màn hình:** một cuốn sổ chi tiêu với bốn trang tuần. Mỗi trang là một nhịp cầu; tiền nhà, sinh hoạt cơ bản và đi tìm việc là các tấm ván bắt buộc, khoản tùy chọn đặt sau. Đây là hình ảnh minh họa dòng tiền, không phải trò nhảy cầu cần phản xạ.

**Cách chơi:**

1. Nhận đúng tiền mặt, quỹ dự phòng và nghĩa vụ nợ thực tế từ chương trước; không phát đồng loạt một khoản mới.
2. Xếp hóa đơn theo ngày đến hạn, nhìn số dư dự kiến sau mỗi tuần.
3. Chọn nguồn chi cho từng hóa đơn: tiền mặt, rút quỹ dự phòng, khoản thu đã xác nhận hoặc hỗ trợ đã được chấp thuận trong nhánh truyện.
4. So sánh một đề nghị vay bằng **tiền nhận được – tổng phải trả – ngày đến hạn**, không chỉ khoản tháng đầu.
5. Bấm chạy kế hoạch và nhận bản báo cáo: còn đủ bao lâu, thiếu vào ngày nào, nghĩa vụ nào bị dời sang tương lai.

**Điểm thú vị:** dời hóa đơn sang tuần sau không làm nó biến mất. Thu nhập công việc có ngày nhận cụ thể; một offer chưa nhận việc không tự biến thành tiền dùng ngay.

**Chấm:** nhận ra thiếu hụt, giữ các nhu cầu cơ bản, tìm hỗ trợ và hiểu nợ. Người có quỹ thấp vẫn có thể đạt điểm kiến thức tốt; tiền không phải điểm đạo đức.

**Nhánh mới nên bổ sung:** thương lượng thời hạn, hỗ trợ tạm thời hoặc công việc ngắn hạn phù hợp. Những lựa chọn này chưa có trong bản gốc, cần viết thêm phản hồi và điều kiện. Không ép người hết tiền vào tín dụng đen như lựa chọn hợp lệ duy nhất.

**Giới hạn:** chỉ chạy bốn lượt ngắn. Không cho người chơi nhịn ăn hoặc bỏ điều trị để đạt huy chương. Biến cố viện phí diễn ra ở đúng Life Event 5; không cộng thêm một lần bệnh viện trong mini-game.

### Tương tác ngắn: Offer dưới lớp giấy bóng — Mission 5.3

Mở email nhận việc và đánh dấu lương, giờ làm, tăng ca, thời điểm trả và quyền lợi. Đặt lịch làm thử vào một ngày để thấy thời gian còn cho tìm việc/học. Người chơi gửi lại một bộ câu hỏi làm rõ hoặc chọn nhánh truyện.

Không biến trò này thành kết luận “cứ từ chối việc lương thấp là thắng”. Cần xét khả năng duy trì sinh hoạt và các lựa chọn thực tế; đánh giá kỹ năng đọc và thương lượng. Không đưa kết luận pháp lý về hợp đồng nếu chưa có dữ liệu kiểm chứng.

---

## 6. Chương 6 — Cỗ máy ngày lương

### Nguồn cốt truyện

Mission 6.1 đã có mini-game phiếu lương: Gross 18 triệu, Net 15,25 triệu. Mission 6.2 tiết kiệm tự động khoảng 3 triệu. Mission 6.3 dư nợ thẻ 6 triệu, trả tối thiểu 300.000đ, mức lãi kịch bản 30%/năm.

### Mini-game chính: Lắp dòng tiền ngày lương — Mission 6.1–6.2

**Màn hình:** phiếu lương mở ra thành một đường chạy của các đồng tiền. Các cổng là “Gross”, “Khoản khấu trừ”, “Net”, “Tiết kiệm”, “Nghĩa vụ”, “Chi tiêu”. Đường chạy là hình ảnh học tập, không phải luồng chuyển khoản thật.

**Cách chơi:**

1. Soát phiếu lương và gắn từng khoản khấu trừ vào ô đúng, thấy tiền giảm từ Gross về Net.
2. Chỉ sau khi đối chiếu xong mới phân bổ Net, tránh lấy lương trước khấu trừ để lập chi tiêu.
3. Đặt lệnh tiết kiệm vào ngày nhận lương, bố trí nghĩa vụ tới hạn trước phần tùy chọn.
4. Chạy thử hai cách: tiết kiệm đầu kỳ và tiết kiệm phần dư. Giữ cùng các hóa đơn để so sánh công bằng.
5. Chốt một lịch, quay lại cuộc gọi tư vấn ở Mission 6.2.

**Điểm thú vị:** người chơi tự lắp thứ tự cổng và thấy dòng tiền đến mục tiêu nào trước. Kế hoạch không đủ sống phải báo đỏ; không thưởng trích tiết kiệm đến mức không trả nổi nghĩa vụ.

**Chấm:** đối chiếu phiếu lương chính xác, không phân bổ quá Net, nhận ra ảnh hưởng thứ tự. Trích cuối tháng vẫn có thể để dành nếu kiểm soát chi tiêu tốt; đừng dựng kết quả tự động bằng 0 chỉ để ép phương án.

**Số liệu cần chuẩn hóa:** 18 triệu − 15,25 triệu = 2,75 triệu tổng khấu trừ. Các dòng chi tiết phải cộng khớp, dùng mô hình giả lập đã kiểm tra. “20% của 15,25 triệu” là 3,05 triệu, không phải đúng 3 triệu; chọn một cách diễn đạt thống nhất. Nếu hiển thị thuế/bảo hiểm theo quy định thật thì phải cập nhật nguồn trước khi lập công thức.

### Tương tác ngắn: Cục nợ chưa biến mất — Mission 6.3

Hai bản sao cùng bắt đầu với dư nợ 6 triệu. Người chơi chọn lịch trả rồi bấm “Qua kỳ tiếp theo”, quan sát phần tiền trả vào gốc và phần lãi/phí theo giả định công khai. Trước mỗi lượt, yêu cầu dự đoán dư nợ còn khoảng bao nhiêu.

Phải giữ cùng điều kiện, không thêm mua sắm riêng cho một phương án. Trả tối thiểu không đồng nghĩa hết nợ. Nếu thu nhập không đủ trả toàn bộ, cho mô phỏng kế hoạch trả cao hơn tối thiểu nhưng vẫn đủ sinh hoạt.

Kịch bản cho 30%/năm, nhưng chưa định nghĩa cách tính ngày/kỳ. Không âm thầm chia 12 rồi gọi đó là sao kê thật. Chỉ dùng mô hình đơn giản có nhãn giả lập và ghi rõ khi nào tính lãi.

---

## 7. Chương 7 — Căn nhà qua ba mùa gió

### Nguồn cốt truyện

Mission 7.1 thỏa thuận quỹ chung–riêng. Mission 7.2 có 600 triệu, nhà 2 tỷ, vay 1,4 tỷ; thu nhập chung 30 triệu/tháng và khoản trả 14 triệu/tháng trong tình huống. Mission 7.3 có 200 triệu vốn nhàn rỗi, so sánh tập trung với phân bổ danh mục.

### Mini-game chính: Căn nhà chịu được biến cố — Mission 7.2

**Màn hình:** hai vợ chồng đặt mô hình căn nhà lên bàn, phía dưới là ba ngăn chi: khoản trả nợ, sinh hoạt, dự phòng. Chọn phương án ở, xem từng ngăn còn chỗ hay không.

**Cách chơi:**

1. Nhập phương án nhà/vay hoặc thuê tiếp từ các thẻ có đủ dữ kiện. Hiển thị cả tiền trả trước và khoản dự phòng còn lại.
2. Tính 14/30 ≈ 46,7% và so sánh tiền thực còn cho sinh hoạt; không chỉ nhìn một đồng hồ tỷ lệ.
3. Chạy ba kịch bản: tháng bình thường, thu nhập một người gián đoạn, thêm một khoản chi cần thiết. Các số cụ thể của hai biến cố là dữ liệu thiết kế mới, phải công khai trước khi chốt.
4. Mỗi kịch bản là phép thử riêng từ cùng trạng thái, không cộng dồn tai họa bất ngờ.
5. Điều chỉnh phương án và xác nhận cùng người bạn đời.

**Điểm thú vị:** nhà lớn có thể đẹp ở lượt đầu nhưng không vượt nổi tình huống xấu; thuê tiếp có thể giữ linh hoạt; nhà nhỏ giảm áp lực nhưng không nhất thiết là đáp án duy nhất.

**Chấm:** có kế hoạch trả nợ và thanh khoản khả thi, hiểu tác động biến cố, không tiêu hết dự phòng vào trả trước. Ngưỡng 30% của bản gốc là tiêu chí mô phỏng được đặt ra trong trò, không một bảo đảm an toàn áp dụng cho mọi gia đình.

**Nối truyện:** nếu vẫn chọn vay cao, kể hệ quả đúng mức chịu đựng đã thể hiện; không tự kết luận chắc chắn vỡ nợ chỉ vì đi qua một tỷ lệ.

### Tương tác ngắn: Đoàn thuyền danh mục — Mission 7.3

200 triệu được biểu diễn bằng các kiện hàng, mỗi kiện chuyển vào một “thuyền” tài sản. Cho thử cùng ba tình huống thị trường với phương án tập trung và phân bổ. Đồ thị xuất hiện sau khi chạy, kèm tiền còn và mức giảm lớn nhất.

Thuyền chỉ là hình minh họa phân bổ; không biến thành trò né sóng theo phản xạ. Không chấm lời nhiều nhất trong một lượt là giỏi nhất. Mẫu 50/30/20 trong truyện là một phương án so sánh, không đáp án tối ưu phổ quát. Không gọi trái phiếu là tuyệt đối an toàn hoặc bảo đảm ETF luôn tăng.

Có thể mở màn ngắn bằng “bàn quỹ chung–riêng” từ 7.1, nhưng không cần một mini-game lớn thứ ba. Hai người thống nhất mục tiêu và phần tự chủ trước khi chơi mua nhà.

---

## 8. Chương 8 — Khu vườn 17 năm

### Nguồn cốt truyện

Mission 8.1 đọc bài báo rồi cân nhắc bảo hiểm; không có tai nạn thật xảy ra trong cảnh này. Mission 8.2 con 1 tuổi, còn 17 năm tới đại học, quy tắc 72 và lãi kép. Mission 8.3 nhìn lại cuộc đời ở tuổi 50 và nhận một ending phù hợp.

### Mini-game chính: Trồng quỹ học vấn — Mission 8.2

**Màn hình:** một khu vườn có cây mục tiêu học vấn và lịch tăng tuổi của con. Tiền đóng góp, phần tăng trưởng và mục tiêu học phí là ba màu phân biệt. Vẻ lớn lên của cây chỉ minh họa, số thực nằm cạnh đó.

**Cách chơi:**

1. Chọn mức góp định kỳ trong khả năng còn lại của ngân sách gia đình, thời điểm bắt đầu và bộ giả định mô phỏng.
2. Xem chi phí mục tiêu hôm nay và mức dự kiến tại thời điểm nhập học; không so tài sản tương lai với giá hôm nay.
3. Chạy nhanh qua 17 năm trong vài mốc, không bắt bấm 204 tháng. Quan sát phần tự góp và phần tăng trưởng tách biệt.
4. So sánh “bắt đầu bây giờ” với “để vài năm nữa” trong cùng bộ giả định. Cho cả so sánh giữ nguyên mức góp và thử mức góp bù trễ để thấy sự khác nhau.
5. Thử một năm tạm ngừng góp hoặc mức tăng trưởng thấp hơn, rồi chỉnh kế hoạch. Các tình huống là thử nghiệm, không phải tai họa thật đã thêm vào truyện.

**Điểm thú vị:** người chơi nhận một cây chưa đạt mốc nhưng có thể điều chỉnh bằng hành động cụ thể, không chỉ bị hiện “sai”. Góp nhiều nhất không tự là tốt nhất nếu làm gia đình thiếu chi phí hiện tại.

**Chấm:** mục tiêu rõ, phân biệt vốn và tăng trưởng, hiểu thời điểm bắt đầu, kiểm tra được một kịch bản bất lợi. Không bảo đảm cây luôn lớn hoặc hứa đủ quỹ ở một tỷ suất cố định.

**Quy tắc 72:** làm câu dự đoán ngắn rồi so với mô phỏng; ghi là ước lượng thời gian nhân đôi một khoản vốn ở tốc độ tăng trưởng giả định. Không áp dụng trực tiếp cho toàn bộ số dư đang được nộp thêm hằng tháng.

**Tài nguyên:** cây 3–4 giai đoạn hoặc SVG dựng bằng code; lịch tuổi và thẻ mục tiêu. Không cần 17 background khác nhau.

### Tương tác ngắn: Khiên có khe hở — Mission 8.1

Sau bài báo, mở bảng **tình huống giả định**: khám/chữa bệnh, gián đoạn thu nhập, sự kiện không thuộc phạm vi. Người chơi đọc các thẻ hợp đồng rồi ghép đúng phạm vi bảo vệ. Lật thẻ để thấy phí, giới hạn, phần tự trả và điều kiện áp dụng theo từng loại hợp đồng mô phỏng.

Không dùng một khái niệm khấu trừ cho mọi sản phẩm bảo hiểm. Không cho mua bảo hiểm xong RISK thực tế về 0 hay hết mọi khoản chi. Có quỹ dự phòng cho phần không được bảo vệ. Không biến bài báo thành tai nạn thật của Tí.

### Mission 8.3: Album lựa chọn, không phải bài thi cuối

Dùng các mốc thực đã chơi tạo album: sạp hàng, lịch học, chiếc laptop, tháng thất nghiệp, lương đầu tiên, căn nhà, quỹ học vấn. Mỗi ảnh ghi quyết định và tác động có dữ liệu. Cho người chơi thử “Nếu khi đó…” trên bản sao, nhưng không sửa ending chính nếu chưa chơi lại hành trình.

Đây là phần hồi tưởng tùy chọn, không cộng thêm điểm vô hạn và không đổi toàn bộ cuộc đời chỉ vì một câu trả lời cuối.

---

## 9. Liên kết giữa các chương

| Dữ liệu đã chốt | Ảnh hưởng về sau |
| --- | --- |
| Tiết kiệm chương 2 | Khả năng xử lý mất xe, không phát quỹ mới để xóa hệ quả |
| Phòng trọ và lịch tuần chương 3 | Chi phí nền, thời gian, điều kiện của biến cố học lại chương 4 |
| Hợp đồng laptop/BNPL chương 4 | Lịch trả nợ thực trong tháng thất nghiệp chương 5 |
| Quỹ còn lại và khoản vay chương 5 | Nghĩa vụ cần giải quyết khi có lương chương 6 |
| Tiết kiệm tự động và dư nợ chương 6 | Khả năng đặt mục tiêu chung chương 7 |
| Nghĩa vụ nhà ở và danh mục chương 7 | Phần tiền thực có thể góp quỹ cho con chương 8 |

Không chỉ truyền sáu thanh chỉ số. Cần thêm trạng thái có ý nghĩa: số dư tiền mặt, quỹ tiết kiệm, khoản nợ, lịch nghĩa vụ, lựa chọn nhà, lịch học và quyết định đã xác nhận.

## 10. Các điểm cần sửa/chốt trước khi code

1. **Tên chương trên map hiện lệch cốt truyện.** Chương 2 thật là học sinh cấp 3, chương 5 thật là khủng hoảng sau tốt nghiệp; không thiết kế mini-game theo tên mock của map.
2. **WEALTH đang vừa gọi là tổng tài sản vừa dùng như ví tiền.** Cần chốt `cash`, `savings`, `debt`, tài sản và phần tổng hợp; chuyển tiền vào tiết kiệm không làm mất tổng tài sản, vay tiền không làm tăng tài sản ròng tương ứng.
3. **Chương 3 có ngân sách bất khả thi ở một số nhánh.** Phải dùng thu nhập thực hoặc cho xử lý thiếu hụt. Dòng SAVINGS +1.5k trong nhánh tiết kiệm tiền trọ cần đối chiếu đơn vị trước khi nhập dữ liệu.
4. **Chương 4 có lời quảng cáo nhưng chưa có bảng phí.** Không tự dựng phép tính tổng vay thiếu dữ kiện; thêm bộ dữ liệu giả lập rõ ràng.
5. **Chương 5 thiếu nhánh 0 < SAVINGS < 3 triệu.** Phải hỗ trợ quỹ một phần và khoản thiếu còn lại.
6. **Chương 6 lệch số giữa phần trăm và số tiền tiết kiệm.** Chuẩn hóa trước khi chấm đúng/sai.
7. **Chương 7 thiếu công thức tạo khoản trả 14 triệu.** Dùng số này như báo giá của tình huống hoặc thêm đủ dữ kiện; không suy ra một lãi suất thật rồi đưa vào game.
8. **Bảo hiểm không nên là nút xóa mọi rủi ro.** Đánh giá phạm vi và khả năng chịu phần chi còn lại.
9. **Cơ chế HAPPINESS = 0 trong nguồn đang ép lựa chọn bất lợi.** Đề xuất thay bằng hạn chế năng lượng, gợi ý nghỉ/tìm hỗ trợ, vẫn giữ quyền quyết định. Không dùng nhãn sức khỏe tâm thần để kết luận nhân vật mất khả năng suy nghĩ.
10. **Ending chưa đủ quy tắc cho các chỉ số mâu thuẫn.** Giữ đây là việc cần thiết kế riêng; không tự gán điểm mini-game để bảo đảm một tier.

## 11. Triển khai vừa sức với engine hiện tại

### Làm theo ba đợt

- **Đợt 1:** sạp hàng C2, lịch tuần C3, đọc hợp đồng C4. Ba kiểu chơi khác nhau, có thể trình diễn ngay, dễ giải thích mục tiêu học tập.
- **Đợt 2:** dòng tiền khủng hoảng C5 và cỗ máy lương C6. Chốt sổ tiền/nợ dùng chung trước khi làm.
- **Đợt 3:** thử sức khoản vay C7 và quỹ 17 năm C8. Cần mô hình giả lập nhất quán và giải thích kết quả tốt.

### Hợp đồng kết quả đề xuất

Không dùng duy nhất `{ passed: true/false }` cho mọi trò. Engine hiện đang rẽ nhánh bằng `onPassSceneId`/`onFailSceneId`; cần mở rộng khi triển khai:

```js
{
  outcome: 'balanced_plan',
  learning: { understood: ['cashflow', 'tradeoff'], needsReview: [] },
  decision: { /* kế hoạch thực sự đã xác nhận */ },
  ledgerChanges: [], // giao dịch tiền/nợ, không cộng vào đây rồi cộng lại trong thoại
  statEffects: {},
  nextSceneId: '...',
  confirmed: true
}
```

- Tách `simulationState` của lượt thử khỏi trạng thái hành trình.
- Sinh mã xác nhận theo chương + nhiệm vụ để chặn ghi kết quả hai lần.
- Hiển thị tóm tắt trước khi chốt. Nút chơi lại ở màn kết quả chỉ thử lại, không nhận thêm tiền/điểm.
- Các ca kiểm tra cần thiết: không tạo tiền khi chuyển quỹ; nghĩa vụ không biến mất; không âm thầm xóa nợ; ngân sách thiếu được phát hiện; lưu/mở lại không cộng thưởng lần hai; thử lại không đổi lịch sử; nhánh không đủ tiền vẫn có đường tiếp tục.

### Giao diện chung

- Giữ nền tranh của đúng địa điểm, phủ nhẹ khi cần đọc bảng.
- Mỗi mini-game có một vật thể trung tâm: sạp, lịch, hợp đồng, sổ tuần, phiếu lương, căn nhà hoặc cây mục tiêu.
- Chữ nội dung 20–24px trên desktop, tên nhiệm vụ 30–36px; không nhét nhiều bảng số nhỏ.
- Kéo thả luôn có phương án bấm chọn rồi bấm đích; không phụ thuộc chuột, tốc độ hoặc màu sắc.
- Kết quả nói rõ **vì sao**, chỉ ra một điểm nên điều chỉnh, rồi trở về hội thoại. Không hiển thị một hộp “Sai” chung cho mọi tình huống.

## 12. Đề xuất chốt

Làm bảy mini-game chính theo bảng đầu, bổ sung tương tác ngắn khi không phá nhịp truyện. Ưu tiên cảm giác người chơi đang sống qua các quyết định của Tí, thay vì ngắt câu chuyện để làm một bài kiểm tra tài chính.
