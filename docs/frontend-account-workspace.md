# Luồng tài khoản và dashboard FinTeen — bản thử frontend

## Phạm vi

Đã nối giao diện đăng ký, đăng nhập, dashboard chung, gói, slot, nhóm, Quiz và báo cáo bằng dữ liệu lưu trên trình duyệt. Không sửa player, cốt truyện, lựa chọn hay mini-game.

Đây chưa phải hệ thống tài khoản/thanh toán thật. Không có dữ liệu mẫu tự điền vào báo cáo, không gọi API thanh toán. Các chương 2–8 vẫn giữ trang thông báo nội dung đang được chuẩn bị của dự án.

## Cách chạy và dùng thử

```sh
npm run dev -- --host 127.0.0.1
```

1. Mở `/register`, đăng ký tên, email và mật khẩu từ 8 ký tự. Tài khoản bắt đầu là Guest, được xem gói và chơi chương 1.
2. Mở **Gói học tập**. Chọn **Kích hoạt gói thử**, xác nhận thao tác mô phỏng. Không thu tiền. Gói Gia đình tạo 4 slot; gói Giáo viên tạo 40 slot. Các slot đều chưa kích hoạt.
3. Mở **Các con & slot / Học sinh & slot**. Tạo tài khoản trong một slot, nhập tên và PIN 4–6 chữ số. Mã đăng nhập được sinh tự động, có nút sao chép. PIN không hiển thị lại sau khi lưu.
4. Đăng xuất. Tại `/login`, chuyển sang **Học sinh**, nhập mã và PIN đã đặt. Học sinh kế thừa 8 chương của gói chủ tài khoản.
5. Để thử Teacher, đăng ký một tài khoản người lớn khác và kích hoạt gói Giáo viên. Tạo học sinh, tạo nhóm, tạo Quiz và giao cho nhóm hoặc từng học sinh.
6. Đăng nhập học sinh, vào **Quiz**, chọn đáp án và xác nhận nộp bài. Đăng nhập lại giáo viên để xem **Tiến độ & báo cáo** và **Chi tiết hành trình**.
7. Thử đặt lại PIN: PIN cũ và phiên đăng nhập học sinh cũ mất hiệu lực. Thử thu hồi: mã cũ không đăng nhập được; slot trở về chưa kích hoạt. Tạo lại slot sinh học sinh mới với mã mới, lịch sử mới. Lịch sử học sinh cũ vẫn xem được qua bộ lọc **Đã thu hồi**.

Hai tài khoản có thể thử trên hai tab cùng trình duyệt: dữ liệu dùng chung qua localStorage; phiên đăng nhập lưu riêng bằng sessionStorage của từng tab. Tab được nhân bản có thể sao chép phiên ban đầu, hãy đăng xuất ở tab đó để đổi tài khoản. Thay đổi dữ liệu sẽ được đồng bộ qua sự kiện storage.

## Những quy tắc đã áp dụng

- Role của cả con thuộc Parent và học sinh thuộc Teacher là **`kid`**. Các mục **Bài học, Trò chơi, Cửa hàng** chỉ có trong khu vực `/dashboard/kid/*`; Parent/Teacher không được truy cập trực tiếp. Guest dùng thử chương 1 qua `/dashboard/demo`, tách khỏi khu vực Kid.
- Cửa hàng hiện chỉ có route/menu và trang thông báo đang chuẩn bị; chưa triển khai vật phẩm, tiền tệ hoặc giao dịch.
- Loại phiên `kind: 'learner'` và bảng dữ liệu `learners` vẫn giữ tên kỹ thuật cũ để tương thích tài khoản/PIN đã tạo; quyền được xác định bằng `role: 'kid'`.
- Người lớn chưa có gói có role Guest. Không có ô chọn role để tự cấp Parent hoặc Teacher.
- Gói không có ngày hết hạn; không tạo cơ chế gia hạn.
- Chỉ chủ tài khoản được quản lý slot, PIN, nhóm và báo cáo của học sinh mình.
- Không có QR. Đăng nhập học sinh luôn dùng mã + PIN.
- Thu hồi giữ lại lịch sử, kết quả Quiz, các lượt giao bài; loại tài khoản cũ khỏi nhóm hiện tại. Slot mới không kế thừa lịch sử học sinh trước.
- Teacher có **Quản lý Quiz** (`/dashboard/quiz-management`, component `TeacherQuizManagement`) để tạo đề, giao bài và theo dõi kết quả. Kid kế thừa gói Teacher có **Quiz** (`/dashboard/kid/quiz`, component `KidQuiz`) để làm bài, nộp bài và xem kết quả.
- Các route cũ `/dashboard/parent`, `/dashboard/teacher`, `/dashboard/user`, `/dashboard/learner` chuyển về không gian tương ứng. Link bài học/game cũ được chuyển về Kid hoặc demo Guest tùy role. Dashboard Admin cũ không nằm trong luồng đăng nhập hiện tại.
- Guard frontend kiểm tra đăng nhập và gói trước khi mở trang/chương. Đây chỉ là kiểm soát trải nghiệm bản thử; quyền thực phải được backend xác thực.

## Quiz: mặc định của bản thử

Mỗi câu có đúng 4 lựa chọn và 1 đáp án đúng, chưa có giới hạn thời gian. Mỗi lượt giao bài cho phép mỗi học sinh nộp một lần. Khi cần làm lại, giáo viên giao một lượt mới.

Lượt giao bài lưu bản sao đề và danh sách học sinh tại thời điểm giao. Sửa đề hoặc thay đổi nhóm sau đó không sửa bài đã giao và kết quả cũ. Khi chọn trùng học sinh ở nhiều nhóm, danh sách người nhận được loại trùng. Học sinh xem lại đáp án và điểm sau khi nộp.

Các mặc định này có thể chỉnh khi nhóm chốt yêu cầu nghiệp vụ Quiz.

## Báo cáo

- Lọc theo học sinh, nhóm hiện tại, trạng thái đang hoạt động/đã thu hồi và khoảng ngày nộp bài.
- Điểm trung bình là trung bình phần trăm đúng của các bài đã nộp trong khoảng lọc, không tính bài chưa nộp thành điểm 0.
- CSV có BOM UTF-8, mở được bằng Excel; xuất chi tiết từng bài đã nộp. Đây là CSV, không phải XLSX.
- JSON xuất danh sách học sinh, kết quả Quiz, trạng thái, lịch sử tài khoản và trường tiến độ. Không xuất mật khẩu, PIN hay dữ liệu băm xác thực. Bộ lọc ngày áp dụng cho kết quả Quiz; lịch sử tài khoản trong JSON giữ đầy đủ.
- **In / Lưu PDF** mở hộp thoại in của trình duyệt. Chọn “Lưu dưới dạng PDF”; bố cục in ẩn sidebar và các nút điều khiển.
- Tiến độ gameplay, thời gian chơi, quyết định và chỉ số nhân vật **chưa được thu thập**. Trang chi tiết hiển thị chưa có dữ liệu, không tạo số liệu giả. Hook bản đồ đã bỏ tiến độ hoàn thành giả trước đây; hiện bắt đầu từ chương 1, chưa tự tăng theo game.

## Tổ chức code

- `src/features/workspace/model.js`: quy tắc cấp gói, slot, thu hồi, nhóm, Quiz, quyền và phiên.
- `demoStore.js`: adapter trình duyệt; ghi dữ liệu, đăng nhập, tạo hash mật khẩu/PIN với PBKDF2 và salt riêng.
- `useWorkspace.js`: đồng bộ React với dữ liệu/phiên.
- `Guards.jsx`: guard route và quyền chương.
- `WorkspaceLayout.jsx`, `workspace.css`: dashboard dùng chung và bố cục mobile.
- `AuthForm.jsx`, `Overview.jsx`, `Learners.jsx`, `Quiz.jsx`, `Reports.jsx`: các màn hình.
- `reporting.js`: lọc và xuất báo cáo, có xử lý CSV formula injection.

## Phần cần backend / quyết định của nhóm

1. Đăng ký, đăng nhập, đặt lại mật khẩu, lưu phiên, xác thực quyền thật và giới hạn thử PIN. localStorage không phải nơi lưu dữ liệu tài khoản thật; client có thể bị sửa nên hash ở frontend không thay thế bảo mật backend.
2. Danh mục gói, giá, đơn hàng, xác nhận thanh toán từ server. Chỉ backend được cấp gói sau giao dịch hợp lệ, đồng thời tạo slot một lần.
3. API học sinh/slot, sinh mã duy nhất toàn hệ thống, PIN, thu hồi phiên và lưu lịch sử.
4. API nhóm, đề, giao bài, chấm bài phía server. Không gửi đáp án đúng cho học sinh trước khi nộp.
5. Sự kiện học tập từ gameplay và lưu tiến độ theo learner ID; báo cáo tổng hợp trên server. Hiện chưa sửa gameplay để phát các sự kiện này.
6. Quy tắc mua nhiều gói/chuyển Parent ↔ Teacher chưa chốt, nên bản thử không cho mua thêm/chuyển gói trên cùng tài khoản đã có gói.

## Kiểm tra

```sh
npm run test:workspace
npm run build
```

Test bao phủ gói 4/40 slot, Guest, quyền sở hữu, PIN/thu hồi phiên, tái sử dụng slot, lưu lịch sử, Quiz snapshot/chấm/nộp trùng, báo cáo và CSV, đăng nhập qua adapter trình duyệt, cùng render các trang bằng React server renderer. Kiểm tra render này không thay thế việc kiểm tra bố cục trong trình duyệt.
