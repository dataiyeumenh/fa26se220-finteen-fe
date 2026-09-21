# Đề xuất thiết kế FinTeen

## Phạm vi rà soát

Đề xuất dựa trên code các route đang hoạt động, CSS và những ảnh người dùng đã gửi. Đã xem cấu trúc trang chủ, auth, workspace, Kid, Quiz, bản đồ, player và mini-game. Phiên làm việc chưa có trình duyệt kết nối nên chưa kiểm tra trực quan từng trang ở các kích thước màn hình. Đây là đề xuất; chưa thay đổi giao diện ứng dụng.

Các dashboard cũ trong src/pages/Parent, Teacher và Admin không được App.jsx render trực tiếp. Ưu tiên thiết kế các trang đang hoạt động trong src/features/workspace và bản đồ/player hiện tại.

## 1. Những điểm cần cải thiện

- Trang chủ dùng xanh tươi #22C55E, workspace xanh rêu/olive, bản đồ và game thiên về nâu vàng. Cần một hệ thống màu liên kết các khu vực.
- Kid và người lớn đang gần như dùng chung bố cục, trong khi nhu cầu học/chơi và quản lý dữ liệu khác nhau.
- Trang Teacher đang tạo thẻ lớn cho từng slot, có thể thành 40 thẻ với nhiều ô trống.
- Trang chủ có nhiều viền màu, bóng xanh, blob nền và màu nhấn cạnh tranh với nội dung.
- Site tải bốn font: Plus Jakarta Sans, Space Grotesk, Baloo 2, Be Vietnam Pro. Nhiều nhãn dashboard chỉ 10–13px, chưa phù hợp mục tiêu dễ đọc.
- Editor Quiz và chọn học sinh có thể thành modal rất dài. Báo cáo nhét nhiều kết quả trong một ô bảng sẽ khó quét thông tin.
- Khi triển khai cần hoàn thiện menu mobile trang chủ đang chưa có thao tác mở, thay favicon Vite, cập nhật CTA phù hợp người lớn đăng ký và Kid đăng nhập bằng mã/PIN.

## 2. Hướng thẩm mỹ khuyến nghị

**Xanh ngọc đậm + kem sáng + vàng mật ong.** Giữ cảm giác gần gũi với tranh làng quê, đồng thời làm giao diện sáng, rõ hơn. Người lớn dùng xanh làm hành động chính; Kid dùng vàng cho nút chơi/tiếp tục. Hình minh họa mang nhiều màu, còn phần UI giữ ít màu để nội dung nổi bật.

| Vai trò | Màu | Cách dùng |
|---|---|---|
| Thương hiệu | #176B52 | Nút chính người lớn, mục đang chọn |
| Hover | #125640 | Hover/pressed của nút xanh |
| Nền toàn trang | #F7F8F2 | Kem rất nhẹ |
| Bề mặt | #FFFFFF | Form, bảng, thẻ |
| Nền xanh nhạt | #E8F3EC | Chọn đáp án, tóm tắt, vùng hỗ trợ |
| Vàng mật ong | #F4C75B | CTA Kid, mốc đang chơi, huy hiệu |
| Chữ trên vàng | #3A311B | Tránh chữ trắng trên vàng |
| Chữ chính | #203B32 | Tiêu đề, nội dung |
| Chữ phụ | #63746C | Mô tả; không giảm opacity thêm |
| Viền | #DFE7DE | Viền mỏng trên nền sáng |
| Thông tin | #416CC7 / #EAF2FF | Thông tin phụ, chuỗi biểu đồ bổ sung |
| Thành công | #23724F / #E8F3EC | Hoàn thành, đúng; kèm nhãn/icon |
| Cảnh báo | #8A5B12 / #FFF2CC | Nội dung cần chú ý |
| Lỗi | #B74B43 / #FBECE8 | Lỗi nhập, sai; không dùng để trang trí |

Không tô mỗi card một màu; không dùng gradient nhiều màu ở mọi section. Phần lớn diện tích là kem/trắng; xanh và vàng giúp định hướng hành động. Màu trạng thái luôn có chữ hoặc biểu tượng đi cùng.

## 3. Font và hình khối

- Be Vietnam Pro cho toàn site, form, bảng và lời thoại; số liệu dùng tabular-nums.
- Baloo 2 chỉ dành cho tiêu đề Kid, chương và tên nhân vật. Trang quản lý dùng Be Vietnam Pro.
- Body 16px, chữ phụ 14px, nhãn bảng 13–14px; metadata không quan trọng mới xuống 12px.
- Tiêu đề trang 28–36px; tiêu đề card 18–22px. Hero landing 44–56px desktop, 32–36px mobile.
- Quiz: câu hỏi 22–24px, đáp án 18–20px. Thoại game giữ 24–28px desktop, khoảng 20–22px mobile; chia đoạn dài thay vì làm hộp thoại cao.
- Khoảng cách theo bậc 8/12/16/24/32/48px. Card padding 24px, bảng padding ngang 16–20px.
- Người lớn: card bo 16–20px, nút 10–12px, viền 1px và bóng nhẹ.
- Kid: card bo 20–24px, nút 14–16px; chỉ CTA chính có bóng đáy nhẹ.
- Giảm animation lặp. Hover nhẹ và hỗ trợ chế độ giảm chuyển động.

## 4. Ba bố cục chính

### Trang công khai

Header gọn, nội dung tối đa khoảng 1200px. Landing hero hai cột. Auth hai cột trên desktop: 45% minh họa/giới thiệu và 55% form. Mobile giữ logo, tiêu đề, form; ẩn minh họa lớn.

### Dashboard chung Guest / Parent / Teacher

Sidebar trắng 232–248px, mục đang chọn nền xanh. Header khoảng 64px có tên trang và tài khoản; tránh lặp tiêu đề “Không gian đồng hành”. Padding nội dung 28–32px. Bảng tận dụng chiều ngang; form đơn giản giới hạn khoảng 720–800px. Mobile dùng drawer mở bằng nút menu thay cho hàng menu cuộn ngang dài.

Parent/Teacher dùng cùng hệ thống thiết kế nhưng khác cách trình bày phù hợp lượng dữ liệu: Parent 4 thẻ, Teacher bảng danh sách.

### Khu Kid

Desktop dùng điều hướng ngang: **Góc học tập · Bài học · Trò chơi · Cửa hàng · Quiz**. Quiz xuất hiện với Kid thuộc gói Teacher theo luồng đã chốt. Không có sidebar quản trị chiếm bề ngang bản đồ.

Mobile dùng 4–5 mục ngắn dưới màn hình, có icon + nhãn; tài khoản và đăng xuất trong menu avatar. Khi vào game, ẩn toàn bộ điều hướng web.

## 5. Đề xuất từng trang

| Trang | Bố cục và thay đổi chính |
|---|---|
| Trang chủ `/` | Hero: “Học cách dùng tiền qua từng lựa chọn”, bên cạnh là hình game/bản đồ thật. Hai CTA rõ: dùng thử chương 1 và xem lựa chọn dành cho người lớn. Giảm badge, hashtag, bóng màu và các section lặp ý. |
| Đăng nhập `/login` | Form trắng 420–460px, input cao khoảng 48px. Tab Người lớn và Kid rõ. Kid nhập mã/PIN. Lỗi sát trường, hạn chế blob nền. |
| Đăng ký `/register` | Cùng hệ auth; chỉ người lớn đăng ký. Mô tả Guest ngắn, không bắt chọn role trước khi mua gói. |
| Guest `/dashboard` | Giới thiệu chương 1 + hai gói + ba bước bắt đầu. Bỏ các thẻ thống kê toàn số 0 không giúp người mới. |
| Demo Guest `/dashboard/demo` | Một card có ảnh cảnh thật, tên chương và CTA thử. Giữ lối demo riêng, không mở menu Kid cho Guest. |
| Parent `/dashboard` | Chào ngắn; vùng chính là 4 thẻ con theo lưới 2×2. Mỗi thẻ có tên, trạng thái và xem hành trình. Báo cáo ở dưới. Giảm hero/icon cây lớn. |
| Teacher `/dashboard` | Tóm tắt học sinh và Quiz khi có dữ liệu. Vùng chính 2/3 cho nhóm/lượt giao gần đây, 1/3 cho thao tác tiếp theo. Không dựng biểu đồ giả ở trạng thái mới. |
| Gói `/dashboard/plans` | Hai thẻ cùng kích thước, 4/40 slot rõ. CTA và giá cùng vị trí. Một thông điệp chung “Mở khóa một lần, không thời hạn”. Không tự gắn “phổ biến nhất”. |
| Slot `/dashboard/learners` | Parent: 4 thẻ. Teacher: bảng tên, mã, nhóm, trạng thái; có tìm kiếm và lọc. Hiển thị số slot còn lại thay vì 40 thẻ trống. |
| Chi tiết `/dashboard/learners/:id` | Header nhận diện + ba tab Hành trình / Kết quả Quiz / Nhật ký. Bài chưa có dữ liệu phải ghi rõ, không vẽ tiến độ mẫu. |
| Nhóm `/dashboard/groups` | Card nhóm gọn. Mở nhóm để xem thành viên và bài đã giao. Chỉnh thành viên bằng drawer có tìm kiếm và số đã chọn. |
| Báo cáo `/dashboard/reports` | Bộ lọc một hàng, một nút Xuất có menu định dạng. Bảng tổng hợp dễ quét; chi tiết bài mở drawer thay vì dồn vào ô bảng. |
| Quản lý Quiz `/dashboard/quiz-management` | Ba tab Đề kiểm tra / Đã giao / Kết quả. Editor là trang riêng thay cho modal dài; danh sách câu bên trái, nội dung giữa, thiết lập/preview ở bên phải. |
| Tài khoản `/dashboard/settings` | Form vừa chiều ngang, chia thông tin cá nhân và gói hiện tại. Một nút lưu; trạng thái đã lưu sát form. |
| Góc Kid `/dashboard/kid` | Một khối lớn “Khám phá/Tiếp tục hành trình” có ảnh thật và nút vàng. Bên dưới là nội dung liên quan và Quiz chờ làm nếu có. Không đặt số slot/gói ở vị trí nổi bật với trẻ. |
| Bài học `/dashboard/kid/lessons` | Bản đồ chiếm phần lớn màn hình. Thanh chuyển vùng gọn, giảm viền nâu. Giữ đế tròn và tỉ lệ ảnh. Mốc hiện tại vàng, hoàn thành xanh, chưa chơi trung tính nhưng vẫn bấm được khi gói đã mở. |
| Trò chơi `/dashboard/kid/games` | Card có ảnh chương, tên và hành động. Chương chưa có nội dung ghi rõ “Đang chuẩn bị”. Không thêm bộ lọc lịch sử khi chưa lưu lịch sử. |
| Quiz Kid `/dashboard/kid/quiz` | Danh sách Chờ làm / Đã hoàn thành. Màn làm bài tập trung vào một câu; đáp án lớn 2×2 desktop, một cột mobile. Có quay lại và rà đáp án trước nộp. |
| Cửa hàng `/dashboard/kid/shop` | Hiện chỉ thiết kế empty state gọn và đẹp. Khi nhóm chốt mới thêm danh mục, giá, số dư; không tự đặt ra xu/thanh toán/vật phẩm. |

### Trang chủ: nhịp nội dung

Giới thiệu → xem cách chơi → lợi ích học tập → người lớn đồng hành → hai gói → FAQ → CTA cuối. Xen nền trắng/kem, chỉ một section xanh đậm tạo điểm nhấn. “Đăng nhập bằng mã” phải dễ tìm. Số người học, hiệu quả và lời chứng thực hiện có chỉ nên trình bày như dữ liệu thật sau khi được xác nhận. Thay favicon Vite bằng dấu hiệu FinTeen.

### Quản lý tài khoản Kid

Đặt PIN/thu hồi vào menu thao tác phụ, để “Xem hành trình” là hành động chính. Modal tạo chỉ cần tên + PIN; sau khi tạo có khối sao chép mã rõ. Thu hồi có xác nhận giải thích giữ lịch sử và trả slot về trống.

### Quản lý Quiz và Kid làm Quiz

Tên hai khu phải khác nhau: Teacher **Quản lý Quiz**, Kid **Quiz**. Teacher có lối xem kết quả trực tiếp. Khi giao, tóm tắt đề và người nhận trước xác nhận. Kid dùng màu xanh nhạt để thể hiện đang chọn, chỉ đánh dấu đúng/sai sau nộp. Không thêm đồng hồ khi đề chưa quy định thời gian. Phần giải thích đáp án chỉ có khi dữ liệu đề hỗ trợ.

### Player và mini-game

- Player giữ tỉ lệ background; không kéo méo hoặc crop mất nội dung để lấp màn hình. Hai bên có thể dùng nền phụ mờ/cùng tông cảnh thay viền đen cứng.
- Ẩn header/sidebar website, chỉ để các nút nổi cần thiết ở góc.
- Hộp thoại kem giấy #FFF8E8, chữ nâu đậm, viền mảnh. Chia đoạn dài để giữ chữ lớn và tránh che nhân vật.
- Lựa chọn vẫn ở giữa màn hình; click vùng cảnh trống tiếp tục thoại nhưng không chồng thao tác lên nút/menu/minigame.
- Mini-game giữ chất liệu ấm, vùng “Cần” xanh nhạt và “Muốn” vàng nhạt. Một thanh tiến độ gọn; vùng chơi chiếm diện tích chính.
- Ảnh vật phẩm cùng cỡ, tên dễ đọc. Tránh ảnh quá lớn gây cuộn lồng trong cột. Đúng/sai có nhãn/icon; giữ thao tác chọn vật phẩm rồi chọn vùng đích cho cảm ứng.

### Bản đồ trên điện thoại

Xem từng vùng hoặc pan trong vùng, không ép cả bản đồ vào một ảnh rất nhỏ. Nhãn chương đặt dưới/cạnh đế, không phủ kín đế. Chỉ một mốc hiện tại nổi bật nhất. Không gán tiến độ giả 60% khi chưa kết nối gameplay.

## 6. Thứ tự triển khai

1. Thống nhất token màu, font, button/input/card; cập nhật ghi chú thiết kế (DESIGN.md đang mô tả hệ Mobbin đơn sắc khác hướng sản phẩm).
2. Tách shell người lớn và Kid, hoàn thiện điều hướng desktop/mobile, giữ quyền đã chốt.
3. Trang chủ + auth để trải nghiệm trước/sau đăng nhập thống nhất.
4. Dashboard, Parent 4 thẻ, Teacher bảng học sinh, trang gói.
5. Quản lý Quiz / Kid làm Quiz và báo cáo.
6. Viền/nhãn bản đồ, thư viện game, chi tiết player và mini-game; giữ nguyên cốt truyện.

## 7. Tiêu chí kiểm tra khi triển khai

- Kiểm tra desktop khoảng 1440px, laptop 1280px, tablet 768px và mobile 390/360px.
- Không tràn ngang toàn trang; chỉ vùng bản đồ có hành vi pan chủ đích.
- Hành động dùng được bằng cảm ứng và bàn phím; không phụ thuộc hover.
- Kid không thấy menu quản lý; Parent không có Quản lý Quiz; Teacher không được đưa vào màn làm bài Kid.
- Có trạng thái mới, trống, đang lưu, lỗi, đã thu hồi và chương đang chuẩn bị.
- Kiểm tra tương phản theo cặp màu thực tế, nhất là chữ trên vàng và nhãn nhỏ.
- Game giữ chữ lớn; ảnh, nhân vật, lời thoại và lựa chọn không chồng lên nhau.
- Không chuyển dữ liệu minh họa trong bản thiết kế thành số liệu thật của sản phẩm.
