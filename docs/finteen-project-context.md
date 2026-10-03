# FinTeen — Bối cảnh dự án

## Cập nhật cốt truyện và hình ảnh ngày 03/10/2026

Người dùng xác nhận các chương trong cốt truyện mới là những câu chuyện riêng. Đã đối chiếu `Document v2/FinTeen_Game_Design_Document_GDD_v2.docx`: **8 chapter độc lập**, An đại diện từng tình huống, Minh là bạn cùng tuổi. Tuổi chương 1–8 lần lượt **14, 16, 17, 16, 16, 18, 17, 18**. Khi làm bộ art `public/images/finteen-v2`, dùng bản này thay cho tuyến Tí 8 giai đoạn cuộc đời hoặc tuyến Minh 10 chương trong context cũ. Xem [quy tắc độ tuổi nhân vật](finteen-v2-character-ages.md). Đây không phải xác nhận toàn bộ gameplay main đã chuyển sang GDD v2.

## Cập nhật tài khoản nhiều vai ngày 01/10/2026

### Trạng thái triển khai nội bộ

Đã bổ sung frontend cho Editor, Reviewer, Manager Operator và Admin tại `/internal/login`. Có tài khoản mẫu, phân công chương, soạn cảnh/lựa chọn, demo, duyệt Pass/Failed theo phiên bản, publish và nhật ký; Admin chỉ đọc số liệu tổng hợp, không xem kết quả từng trẻ. Nội dung publish nối vào trang chơi cùng trình duyệt. Chưa có backend, email mời, thanh toán thật hoặc đồng bộ giữa máy. Chi tiết và tài khoản thử: `internal-workspace.md`.

Người dùng xác nhận: **một tài khoản có thể đồng thời có Parent và Teacher khi mua cả hai gói**. Quyết định này thay thế giới hạn một tài khoản chỉ có một trong hai vai ghi ngày 30/09.

- Dùng chung tài khoản đăng nhập; radio Parent/Teacher chọn vai sử dụng khi đăng nhập. Người có cả hai gói chỉ cần đổi lựa chọn radio để đăng nhập theo vai tương ứng, không cần tạo tài khoản khác.
- Server kiểm tra quyền theo gói đã mua cho vai được chọn; radio không tự cấp quyền khi tài khoản chưa có gói tương ứng.
- Phạm vi gia đình và lớp học vẫn tách biệt: Parent quản lý Child, Teacher quản lý Student; không tự hợp nhất hoặc chia sẻ kết quả giữa hai phạm vi dù cùng chủ tài khoản.
- Đã triển khai trong bản thử frontend ngày 01/10/2026: sở hữu hai gói, radio chọn vai khi đăng nhập, phiên theo vai, tách slot/người học/báo cáo và giới hạn thao tác theo vai. Xem `frontend-account-workspace.md`. Chưa có xác thực hoặc thanh toán server. Các vai nhân sự được triển khai tiếp trong khu vực nội bộ riêng, xem phần trạng thái phía trên.

## Cập nhật phân quyền và phạm vi ngày 30/09/2026

Nguồn: yêu cầu trực tiếp của người dùng ngày 30/09/2026. Ưu tiên nội dung này khi khác với mô tả nghiệp vụ cũ bên dưới. Đây là yêu cầu đã ghi nhận, chưa phải xác nhận mã nguồn đã triển khai.

### Yêu cầu đã xác nhận

- Tách Adult thành hai vai **Parent** và **Teacher**. Mỗi người chỉ xem kết quả của trẻ do mình tạo: Parent xem Child của mình, Teacher xem Student của mình. Không liên kết/chia sẻ kết quả giữa hai phạm vi.
- Quiz: hệ thống cung cấp các lựa chọn số lượng câu hỏi để Teacher chọn. Hệ thống tự chấm trên thang điểm 10, tính điểm từ các câu đúng và điểm mỗi câu; Teacher không chấm thủ công theo mô tả mới. Chưa chốt các số lượng cho phép, cách chọn câu từ kho và việc chia đều hay đặt trọng số điểm từng câu.
- Đăng nhập Parent/Teacher dùng **radio chọn vai**. Theo cập nhật 01/10/2026, một tài khoản được có cả Parent và Teacher khi mua cả hai gói; radio chọn vai sử dụng khi đăng nhập. Thiết lập/đăng nhập các vai quản lý theo phần xác nhận bên dưới.
- Tách **Child** và **Student** vì khác người tạo: Child do Parent tạo, Student do Teacher tạo, phù hợp phân biệt gia đình/lớp học đã ghi nhận trước đó.
- **Game Editor** nhập cốt truyện và chơi demo.
- **Game Reviewer** chơi demo, viết nhận xét và đánh giá game **pass** hoặc **failed**.
- **Manager Operator** quản lý Editor và Reviewer, đồng thời publish game lên hệ thống.
- Duyệt và publish theo **từng chương**. Chương bắt buộc được Reviewer đánh giá **pass** trước khi Manager Operator publish.
- Nhóm đang dự tính **Admin chỉ theo dõi**, Manager Operator thực hiện vận hành. Đây là định hướng đang cân nhắc; người dùng yêu cầu đề xuất phân quyền cụ thể cho hai vai, chưa xác nhận ma trận quyền cuối cùng.
- Công nghệ AI không bị ràng buộc nhà cung cấp hay cách triển khai cụ thể; ưu tiên có sản phẩm ở **tuần 12** để ra hội đồng. Chưa chọn nhà cung cấp/mô hình. API key là cơ chế xác thực, có thể dùng cùng dịch vụ AI bên thứ ba, không phải hai phương án loại trừ nhau.
- Cần chuẩn bị kỹ phần **server**. Chưa có quyết định mới về stack, hạ tầng hay kế hoạch triển khai server trong yêu cầu này.

### Phân quyền và chấm điểm đã được người dùng chốt

Người dùng xác nhận “chuẩn rồi” sau đề xuất phân quyền Admin/Manager, tài khoản nội bộ và chia đều điểm quiz ngày 30/09/2026. Các quyết định dưới đây được ưu tiên hơn các ghi chú chưa chốt phía trên.

- Admin chỉ đọc dashboard tổng quan, trạng thái tài khoản, giao dịch, tiến độ duyệt/publish và nhật ký thao tác; không mặc định được đọc chi tiết kết quả từng trẻ. Không sửa nội dung, duyệt/publish hoặc quản lý tài khoản nhân sự.
- Manager Operator tạo/mời, khóa/mở tài khoản Editor/Reviewer; gán hai vai này và phân công chương; theo dõi review và publish phiên bản chương đã pass. Không tự cấp quyền Admin/Manager, không sửa quyết định review hoặc tự bỏ qua bước pass.
- Tạo sẵn tài khoản Admin và Manager Operator khi triển khai. Nhân sự dùng trang đăng nhập nội bộ chung, server xác định vai đã được cấp. Radio Parent/Teacher chỉ chọn ngữ cảnh đăng nhập; server phải kiểm tra vai của tài khoản, không cấp quyền từ lựa chọn radio.
- Luồng đề xuất: Draft → Pending review → Pass hoặc Failed; Failed quay lại Editor sửa rồi gửi duyệt lại; Pass → Manager publish. Review gắn với phiên bản chương: sửa bản đã pass phải duyệt lại; bản đã publish giữ nguyên đến khi bản mới được duyệt và publish.
- Quiz chia đều điểm: N câu, mỗi câu 10/N điểm, điểm tổng = số câu đúng × 10/N; chỉ làm tròn điểm tổng khi hiển thị. Người dùng đã xác nhận phương án này.

### Điểm còn mở

- Quiz: các số lượng câu cho phép, chọn câu tự động hay Teacher chọn từ kho.
- Người dùng yêu cầu **bỏ qua câu hỏi số 6 về backend và mốc thời gian** trong lượt làm rõ này. Không tiếp tục yêu cầu trả lời; yêu cầu chuẩn bị kỹ server và mục tiêu tuần 12 vẫn được giữ.

## Cập nhật game và mini-game ngày 28/09/2026

Người dùng cung cấp ba tài liệu mới và yêu cầu dùng làm context mới cho game/mini-game. Đã đọc và lưu tại [finteen-game-context.md](finteen-game-context.md), kèm bản trích đầy đủ trong `finteen-game-context-sources/`.

**Ưu tiên context mới cho gameplay:** 10 chương về teen Việt Nam, 5 stats WEALTH/SAVING/HAPPINESS/RISK/GOAL, framework D01–D08, 6 Financial Decision Styles, 12 mini-game có thiết kế mở rộng và 6 endings gợi ý. Những mô tả 8 chương/hành trình tới nghỉ hưu bên dưới là bối cảnh cũ, không dùng làm chuẩn thiết kế game mới. Mini-game mới có thể chấm theo reasoning, context và goal-fit, không mặc định mọi bài có duy nhất một đáp án cố định. Context nghiệp vụ tài khoản/slot/quiz/người lớn bên dưới chưa được bộ tài liệu mới thay thế. Việc cập nhật thiết kế chưa đồng nghĩa mã nguồn và các Feature/slide cũ đã được migrate.

## Cập nhật được người dùng xác nhận ngày 27/09/2026

- Slide Actor phải tách **Con** và **Học sinh** thành hai vai nghiệp vụ riêng: Con thuộc gia đình/phụ huynh, Học sinh thuộc lớp/giáo viên. Nội dung bên dưới tổng hợp nguồn cũ, trong đó hai nhóm còn gộp chung.
- Cả hai dùng slot do người lớn cấp, chơi 8 chương và mini-game, nhận thành tựu/chứng chỉ, đổi thưởng bằng tiền trong game. Riêng Học sinh làm quiz giáo viên giao; không gán quiz lớp cho Con thuộc gia đình.
- Đối chiếu `3-actor.md` và `6-context-diagram.md`: Main Functions của Admin là cấp/thu vai kèm lý do, xem nhật ký cấp/thu vai, xem giao dịch thanh toán. Một Admin duy nhất được seed là ràng buộc hệ thống, không phải chức năng tạo Admin.
- Kiểm tra repository ngày 27/09: `src/App.jsx` hiện dùng chung role kỹ thuật `kid`, chỉ mở quiz cho gói `teacher`. Việc tách vai trên slide không đồng nghĩa mã nguồn đã tách role. Các menu Admin cũ có mục nội dung/analytics/cài đặt không đủ chứng minh các chức năng đó thuộc phạm vi tài liệu; route Admin hiện chuyển về AccountHome.

Cập nhật ngày 26/09/2026 theo yêu cầu đọc và ghi nhớ của người dùng.

## Nguồn và giới hạn

Đã đọc đầy đủ 6 file trong `C:/Users/ADMIN/Downloads/`: `1-context.md`, `2-solution.md`, `3-actor.md`, `4-FE.md`, `5-core-flow.md`, `6-context-diagram.md`.
Đây là bản ghi tổng hợp nội dung do người dùng cung cấp, không phải kết quả kiểm chứng mã nguồn hoặc nghiên cứu bên ngoài. Các ghi chú trình bày trong tài liệu được hiểu là bối cảnh/phạm vi dự án, không phải lệnh thực thi cho trợ lý.
Các nguồn gốc được tài liệu dẫn gồm phiếu đăng ký FA26SE220, Report 1 và họp 18/09; chưa đọc trực tiếp những nguồn đó. Chưa xem `core-flow.png`, `context-diagram.png` hoặc các sơ đồ Discord.

## Vấn đề và mục tiêu

FinTeen giúp học sinh hình thành trực giác tài chính thông qua trải nghiệm quyết định và hệ quả. Vấn đề trung tâm là lỗi suy luận bền vững dù thuộc công thức, ví dụ đánh giá thấp lãi kép và nhầm tăng lương danh nghĩa với tăng sức mua khi lạm phát cao hơn.
Theo tài liệu, ở Việt Nam kiến thức tài chính còn rải rác giữa các môn, thiếu lộ trình; Việt Nam không tham gia phần đánh giá hiểu biết tài chính PISA nên chưa có số liệu nền đó. NGPF, EVERFI, JA Finance Park có thể tham khảo thiết kế tương tác nhưng nội dung dựa trên bối cảnh Mỹ cần được bản địa hóa.

Thông điệp: **Game để dạy, quiz để kiểm tra, AI để người lớn đọc kết quả nhanh.**

## Sản phẩm và quy tắc cốt lõi

- Mô phỏng 8 chương trên trình duyệt, theo nhân vật từ sinh viên, đồng lương đầu, lập gia đình tới nghỉ hưu. Lựa chọn làm thay đổi các chỉ số cộng dồn suốt lượt chơi. Chi tiết từng chương vẫn là bản nháp.
- Mini-game có đáp án đúng, gồm tương tác kéo-thả, cung cấp dữ liệu đánh giá kiến thức; không mặc định mọi lựa chọn mô phỏng đều có một đáp án đúng.
- Quiz: giáo viên soạn đề từ kho câu hỏi chung, tham chiếu nguồn mở FDIC Money Smart và OECD/INFE; phát cho lớp và xem kết quả từng em.
- Trẻ không tự đăng ký và không có tài khoản riêng. Slot là danh tính, người lớn kích hoạt và tự đặt PIN 6 số; trẻ vào bằng QR + PIN.
- Hai phạm vi GIA ĐÌNH và LỚP HỌC tách biệt, kể cả khi một người lớn có cả vai phụ huynh và giáo viên. Không suy diễn việc tự động hợp nhất dữ liệu một trẻ giữa hai phạm vi.
- Gói phụ huynh: tối đa 4 slot. Gói giáo viên: tối đa 40 slot trong một lớp đang mở.
- Kết thúc lớp: lưu trữ lớp cùng 40 slot và đông cứng báo cáo, đồng thời trả lại hạn mức. Không hiểu việc trả hạn mức là xóa dữ liệu lịch sử.
- Thành tựu, chứng chỉ và cửa hàng đổi thưởng bằng tiền trong game.
- App mobile React Native trên Android chỉ cho người lớn: quản lý slot/lớp, xem kết quả, soạn quiz; không chứa game.

## Tác nhân và quyền

- Khách: đăng ký, bắt buộc xác minh email, chơi demo, mua gói.
- Phụ huynh: kích hoạt slot, đặt PIN, xem kết quả/chứng chỉ/tổng kết từng con.
- Giáo viên: có các khả năng tương ứng của phụ huynh trong phạm vi lớp, nhập danh sách lớp, soạn quiz, kết thúc lớp; không suy diễn quyền đọc mọi dữ liệu gia đình.
- Học sinh: vào bằng QR + PIN, chơi chương và mini-game, nhận thành tựu, đổi thưởng, làm quiz lớp.
- Admin: đúng một người, được seed khi máy chủ khởi động; không có chức năng tạo admin. Cấp/thu vai kèm lý do được ghi nhật ký, xem giao dịch thanh toán.
- Vai phụ huynh/giáo viên/cả hai gắn với gói đã mua; tài liệu cũng có khả năng admin thay đổi vai có ghi lý do.

## Luồng chính và dữ liệu

1. Khách đăng ký, xác minh email, chơi demo.
2. Mua gói → PayOS xác nhận thanh toán → hệ thống bật vai.
3. Người lớn kích hoạt slot, đặt PIN, đưa QR cho trẻ.
4. Trẻ vào bằng QR + PIN, chơi chương gồm đoạn thoại và mini-game.
5. Cuối chương gửi một lô gồm lựa chọn, đáp án mini-game và chỉ số; gửi lại không tạo bản ghi trùng (idempotent).
6. Hệ thống cập nhật mức nắm từng khái niệm; mô hình ngôn ngữ viết tổng kết mỗi đêm từ số liệu đã tính.
7. Người lớn xem kết quả, chứng chỉ, tổng kết qua web/mobile.

Game chạy trong trình duyệt và chơi được khi mất mạng; có mạng trở lại mới gửi lô dữ liệu. Cần phân biệt mô hình người học (ước lượng mức nắm khái niệm, phân nhóm lớp) với mô hình ngôn ngữ (diễn giải số liệu thành tổng kết).

## Danh mục Feature

FE nghĩa là **Feature**, không phải Front End trong bộ slide này.

| Mã | Nội dung |
| --- | --- |
| FE-01 | Đăng ký người lớn và xác minh email bắt buộc |
| FE-02 | Vai theo gói mua |
| FE-03 | QR + PIN 6 số cho trẻ |
| FE-04 | Tách dữ liệu gia đình và lớp học |
| FE-05 | Kết thúc/lưu trữ lớp và trả hạn mức slot |
| FE-06 | Mô phỏng 8 chương, chỉ số thay đổi theo lựa chọn |
| FE-07 | Mini-game kéo-thả có đáp án đúng |
| FE-08 | Ghi dữ liệu theo chương, chống ghi trùng khi gửi lại |
| FE-09 | Giáo viên soạn quiz từ kho chung |
| FE-10 | Thành tựu và chứng chỉ |
| FE-11 | Cửa hàng dùng tiền trong game |
| FE-12 | Mobile cho người lớn, không có game |
| FE-13 | Mô hình người học và tổng kết AI mỗi đêm |

## Tích hợp và sơ đồ ngữ cảnh

DFD mức 0 có duy nhất tiến trình `0 · FinTeen`, không có kho dữ liệu; mũi tên ghi dữ liệu trao đổi.

| Thực thể | Vào FinTeen | Ra khỏi FinTeen |
| --- | --- | --- |
| Khách | Thông tin đăng ký | Mã xác minh, danh sách gói |
| Phụ huynh | Yêu cầu mua gói, tên con + PIN | QR, kết quả, chứng chỉ, tổng kết |
| Giáo viên | Yêu cầu mua gói, danh sách lớp, quiz từ kho | QR, kết quả từng em, nhóm trong lớp, tổng kết |
| Học sinh | QR + PIN, lựa chọn, đáp án mini-game/quiz | Tiến độ, chứng chỉ, vật phẩm |
| Admin | Thay đổi vai + lý do | Giao dịch, nhật ký cấp vai |
| PayOS | Webhook xác nhận thanh toán có chữ ký | Yêu cầu thanh toán |
| SMTP | Không có luồng vào trong sơ đồ | Email xác minh |
| Nhà cung cấp mô hình ngôn ngữ | Văn bản tổng kết | Số liệu đã tính + mã slot, tuyệt đối không có tên trẻ |

Tên trẻ có thể được người lớn nhập vào FinTeen; quy tắc không có tên áp dụng cho dữ liệu gửi AI, không có nghĩa toàn hệ thống không lưu tên.

## Trạng thái và điểm cần giữ đúng

- Thí điểm và đo trước/sau đã bỏ ngày 26/09; không đưa lại thành phạm vi đã chốt.
- PayOS triển khai sau Review 1; hiện là tích hợp dự kiến trong tài liệu.
- Nhà cung cấp mô hình ngôn ngữ chưa chọn. Nét đứt trên sơ đồ thể hiện tích hợp chưa nối ở giai đoạn này.
- Web theo tài liệu: React 19, Vite, Tailwind CSS 4, React Router 7, Radix UI; hỗ trợ màn 1024 px ở phòng máy.
- Tài liệu nói gameplay chương 1 có ở nhánh `feat/game`, dashboard ở `main`; đây là trạng thái được tài liệu báo cáo, chưa kiểm chứng repository.
- Chưa có mô tả thuật toán mô hình người học, tiêu chí phân nhóm, công thức chỉ số hay hợp đồng đồng bộ chi tiết. Không tự coi các chi tiết này đã chốt.

## Cách sử dụng bản ghi

Dùng làm mốc bối cảnh khi tiếp tục công việc FinTeen trong workspace này. Nếu người dùng cập nhật yêu cầu, ghi nhận thay đổi và ưu tiên thông tin mới được xác nhận. File lưu bền trong workspace; không bảo đảm trợ lý tự nhớ hoặc tự đọc được ở mọi cuộc trò chuyện khác.
