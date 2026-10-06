# Không gian nội bộ FinTeen · Frontend demo

Triển khai ngày 01/10/2026. Dùng `npm run dev`, mở `/internal/login` hoặc bấm **Đăng nhập nhân sự nội bộ** ở trang đăng nhập công khai.

## Tài khoản thử

Mật khẩu chung: `FinTeenDemo!2026`.

| Email | Vai |
| --- | --- |
| `editor@finteen.demo` | Game Editor |
| `reviewer@finteen.demo` | Game Reviewer |
| `manager@finteen.demo` | Manager Operator |
| `admin@finteen.demo` | Admin chỉ đọc |

Trang đăng nhập có thẻ điền sẵn thông tin demo. Không có radio tự cấp vai nội bộ; vai lấy từ tài khoản. Dữ liệu mẫu chỉ tạo khi kho nội bộ chưa có nhân sự. Mật khẩu lưu dưới dạng PBKDF2; tài khoản mẫu chỉ để thử trên máy, không dùng làm tài khoản production.

## Phạm vi theo vai

- Editor: xem chương được giao, nhập tên/tóm tắt/cảnh/lời thoại/lựa chọn, gắn mini game Minh học/làm vào chương 4, lưu bản mới, chơi demo và gửi duyệt.
- Reviewer: chỉ xem chương được giao, chơi hết một nhánh demo, bấm ghi nhận hoàn thành rồi đánh giá Pass/Failed kèm nhận xét. Không sửa cốt truyện.
- Manager: tạo Editor/Reviewer, khóa/mở tài khoản, đổi vai khi đã phân công lại chương, tạo và phân công chương, publish bản đã Pass. Không tạo Admin/Manager hoặc tự đánh giá thay Reviewer.
- Admin: đọc tổng quan, nhân sự, tiến độ duyệt/phát hành, nhật ký; xem tài khoản người lớn và các lượt kích hoạt gói mô phỏng. Chỉ có tổng số người học, không hiển thị danh tính hoặc kết quả từng trẻ. Không có quyền ghi nội dung/nhân sự/duyệt/publish.

## Thử một vòng đầy đủ

1. Đăng nhập Editor. Mở chương 4 được tạo sẵn ở trạng thái Draft; có mini game Minh chọn lịch học và ca làm đã được giữ từ trước.
2. Bấm **Biên tập bản mới** nếu muốn sửa. Mỗi lần lưu tạo một phiên bản; chọn **Chơi demo** để xem bản đã lưu, rồi **Gửi duyệt**.
3. Đăng xuất nội bộ, vào Reviewer. Mở chương đang chờ duyệt, chơi demo tới cuối (với mini game cần đi hết cảnh kết và bấm tiếp tục chương), rồi bấm **Ghi nhận hoàn thành demo**.
4. Quay lại chương, chọn Pass hoặc Failed và viết nhận xét. Nếu Failed, Editor sửa thành bản nháp mới rồi gửi lại; Reviewer cần chơi lại bản mới.
5. Vào Manager, mở **Phát hành**, chọn bản đã Pass, kiểm tra và xác nhận publish.
6. Đăng nhập Child/Student có gói trong luồng công khai, mở **Trò chơi → Chương 4**. Trang chơi nhận bản vừa phát hành. Bản nháp/đang duyệt không hiển thị cho người học.
7. Editor sửa tiếp sau publish: người học vẫn thấy bản đã phát hành trước đó cho tới khi bản mới Pass và được Manager publish.

Hai khu vực dùng phiên riêng để thử workflow thuận tiện. Muốn xem hai vai nội bộ cùng lúc, đăng nhập ở hai tab. Mỗi tab có phiên trong sessionStorage; dữ liệu dùng chung localStorage và cập nhật qua sự kiện storage.

## Quy tắc phiên bản và dữ liệu

- Trạng thái: Draft → Pending → Passed/Failed; Passed → Published. Sửa bản Failed/Passed/Published tạo Draft mới, không sửa nội dung bản cũ.
- Nhận xét và bằng chứng chơi demo gắn với số phiên bản. Không dùng kết quả Pass hoặc demo của bản cũ cho bản mới.
- Bản đang Pending không sửa. Manager có thể phân công lại nhân sự; việc này không sửa nội dung hoặc kết quả duyệt lịch sử.
- `revision` chặn thao tác dựa trên chương đã bị cập nhật ở tab khác. Form biên tập giữ revision lúc mở; nếu xung đột, giữ nội dung nhập để người dùng sao chép rồi tải lại.
- Khóa/mở/đổi vai nhân sự làm mất hiệu lực phiên cũ. Manager không được đổi vai người còn được phân công chương.
- Cảnh tối đa 60, mỗi cảnh tối đa 4 lựa chọn; dẫn đến cảnh phía sau hoặc kết thúc, không có vòng lặp. Đây là trình soạn narrative demo, chưa phải trình thiết kế mọi cơ chế game.
- Kho: `finteen.internal.demo.v1`; phiên: `finteen.internal.session.v1`. Tách khỏi tài khoản Parent/Teacher. Không xóa hoặc reset kho workspace hiện có.
- Bản đồ hiện tại có 8 chương; không tự chuyển toàn bộ game sang tuyến 10 chương. Chương 1–2 có sẵn tiếp tục hoạt động nếu chưa publish nội dung thay thế cho số chương đó. Chương 4 mẫu chưa tự publish.

## Cấu trúc và backend còn thiếu

`src/features/internal/model.js` chứa chuyển trạng thái và kiểm tra vai. `store.js` là adapter trình duyệt. Các trang ở cùng thư mục, route gắn tại `src/App.jsx`; `StoryPlayer.jsx` dùng chung cho demo và nội dung phát hành. `UserGames.jsx` và `KidPages.jsx` đọc bản đã publish, không đọc nhận xét nội bộ vào dữ liệu hiển thị công khai.

Frontend không tạo ranh giới bảo mật thật: người dùng có thể sửa localStorage. Backend cần xác thực/ủy quyền, seed tài khoản quản lý an toàn, lưu phiên, giới hạn đăng nhập, giao dịch nguyên tử/version lock, audit bền vững, API chương/phiên bản/review/publish, kiểm tra hoàn thành demo và xác nhận thanh toán. Chưa gửi email mời, đồng bộ giữa máy, upload media, lưu tiến độ gameplay hay doanh thu thật. Publish hiện chỉ áp dụng trên cùng trình duyệt.

## Kiểm tra

- `npm run test:internal`: model workflow, chặn sai vai, khóa phiên, tương thích phát hành, SSR các trang/guard và quyền đọc Admin.
- `npm run test:workspace`: kiểm tra hồi quy Parent/Teacher và người học.
- `node --test tests/chapter-four-story.test.mjs`: các nhánh mini game chương 4.
- `npm run build`; ESLint các file thêm/sửa.
- Chưa kiểm tra bố cục và tương tác bằng trình duyệt thật do công cụ chưa có browser kết nối. Build có cảnh báo bundle chính trên 500 kB; phần studio và mini game chương 4 đã tách tải theo nhu cầu.
