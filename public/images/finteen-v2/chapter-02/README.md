# Chương 2 — Tháng đầu tiên và mục tiêu lớn

<!-- chibi-age-update -->
## Cập nhật tạo hình ngày 03/10/2026

**Tất cả nhân vật đều chibi.** An/Minh trong tình huống này là **16 tuổi** theo GDD v2. Khác tuổi thể hiện qua quần áo và nét mặt; giữ tỷ lệ cơ thể chibi nhất quán, không dùng tăng chiều cao để phân biệt tuổi. Mẹ/cô/NPC dùng mẫu người lớn chibi cố định giữa các chương.

Đã thay **9 sprite và 5 tranh scene** bằng imagegen tích hợp tại đúng đường dẫn cũ. Các sprite giữ nền trong suốt. Xem [manifest kích thước và checksum hiện tại](../character-age-manifest.json), [quy tắc tạo hình](../README.md) và [nguồn độ tuổi](../../../../docs/finteen-v2-character-ages.md).

Thông tin nguồn tái sử dụng, kích thước và prompt cũ bên dưới là lịch sử của đợt tạo trước, được cập nhật này thay thế đối với **nhân vật và tranh scene**. Các hướng dẫn bối cảnh, đạo cụ, mini-game và tình huống vẫn dùng được. Bộ art này chưa được tích hợp thêm vào gameplay trong đợt sửa hình.
<!-- /chibi-age-update -->

Bộ ảnh theo GDD v2, phong cách kawaii cartoon 2D. **Hiện có 28 PNG: 5 background, 5 tranh scene hoàn chỉnh và 18 ảnh nhân vật/mini-game/đạo cụ.** Đợt bổ sung này thêm 2 góc nền và 5 tranh kể chuyện bằng imagegen tích hợp, giữ nguyên các ảnh đã có.

## Background và scene bổ sung — hướng dẫn sử dụng hiện tại

SC01: phòng sinh hoạt → tranh giới thiệu. SC02: bàn phong bì → tranh chia ngân sách → Budget Builder. SC03: bảng mục tiêu → tranh kế hoạch laptop. SC04: sân trường → góc xe → tranh kiểm tra xe. SC05: bàn ngân sách → tranh rà soát → recap.

| File mới | Gắn vào đâu |
| --- | --- |
| `bg/bg03b-budget-table.png` | SC02/SC05: bàn phong bì ngân sách và rà soát sau biến cố. |
| `bg/bg05b-bicycle-corner.png` | SC04: góc xe đạp gặp sự cố, dùng khi xem báo giá sửa. |
| `scene/sc01-camp-budget-briefing.png` | SC01: giới thiệu thu nhập mô phỏng và mục tiêu tự lập. |
| `scene/sc02-dividing-envelopes.png` | SC02: chia nhóm ngân sách trước khi chấm phương án. |
| `scene/sc03-laptop-goal-planning.png` | SC03: lập kế hoạch laptop sáu tháng; hình laptop là mục tiêu. |
| `scene/sc04-bicycle-surprise.png` | SC04: phát hiện khoản sửa xe bất ngờ, chưa thanh toán. |
| `scene/sc05-revising-budget.png` | SC05: rà soát ngân sách, có thể dùng cho reflection trung tính. |

- `bg/` là nền không có nhân vật, dùng cùng sprite khi thoại, chọn đáp án hoặc chơi mini-game. Các góc cận có bàn/quầy chiếm tiền cảnh: dùng chân dung nửa người hoặc ẩn sprite để tránh chân xuyên bàn.
- `scene/` là tranh đã có nhân vật và hành động. Dùng làm tranh dẫn cảnh/chuyển nhịp; ẩn sprite rời khi hiện tranh để không trùng nhân vật. Có thể chuyển về góc nền tương ứng khi người chơi bắt đầu thao tác.
- Các tranh dùng cùng nhận dạng tóc, màu áo và phong cách chibi của bộ đã duyệt. Độ tuổi tình huống vẫn giới thiệu theo GDD.
- Chữ, giá, công thức, ngày và trạng thái lựa chọn do UI hiển thị. Lưới lịch, nét giấy hoặc hình sản phẩm trong tranh chỉ minh họa, không lấy làm dữ liệu kiểm tra hoặc vùng bấm cố định.
- Các scene không chốt kết quả nhánh. Khi hiển thị hậu quả/ending, dùng dữ liệu và biểu cảm riêng theo lựa chọn thực của người chơi.
- Toàn bộ ảnh mới là tranh ngang có nền kín, không cần alpha. Chưa tích hợp vào gameplay; đây là hướng dẫn ghép cho bước triển khai.

### Prompt bổ sung (imagegen tích hợp)

<details>
<summary>bg/bg03b-budget-table.png</summary>

Tham chiếu: `chapter-02/bg/bg03-camp-common-room.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New slightly elevated close view of activity table in same camp room. Five blank pastel budget envelopes arranged in a gentle semicircle, blank open notebook, pencil and simple calculator with blank display. Chairs and windows behind. Tabletop fills lower half. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>bg/bg05b-bicycle-corner.png</summary>

Tham chiếu: `chapter-02/bg/bg05-schoolyard.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New ground-level medium-wide view of shaded bicycle parking corner beside same school courtyard. Simple bicycle rack, one mint student bicycle with visibly soft front tire, small hand pump nearby. No people, tree faces or written banners; warm pastel school architecture. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc01-camp-budget-briefing.png</summary>

Tham chiếu: `chapter-02/bg/bg03-camp-common-room.png`, `chapter-01/char/an/an-neutral.png`, `chapter-02/char/co-linh/co-linh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt sits at camp activity table listening to Co Linh with glasses and blue blouse. Co Linh places plain envelope beside blank monthly planning sheet, An attentive. Medium two-shot with camp windows behind, no cash denominations. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc02-dividing-envelopes.png</summary>

Tham chiếu: `chapter-02/bg/bg03-camp-common-room.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/minh/minh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and Minh navy polo at camp table sorting five blank pastel budgeting envelopes. An thoughtfully moves one envelope, Minh points to another with friendly curiosity. Slightly elevated medium two-shot showing hands, envelopes and blank notebook. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc03-laptop-goal-planning.png</summary>

Tham chiếu: `chapter-02/bg/bg04-club-goal-board.png`, `chapter-01/char/an/an-neutral.png`, `chapter-02/char/co-linh/co-linh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and Co Linh blue blouse stand beside club goal board. An pins a plain illustration card of a laptop onto board; Co Linh gestures toward six blank pastel planning cards aligned below it. Curious hopeful mood, no actual purchased laptop or success trophy. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc04-bicycle-surprise.png</summary>

Tham chiếu: `chapter-02/bg/bg05-schoolyard.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/minh/minh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt crouches to inspect front tire of mint student bicycle in schoolyard while Minh navy polo holds handlebars steady. Concerned thoughtful faces, no crash or injury. Medium wide story composition at bicycle height, wheel and faces visible. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc05-revising-budget.png</summary>

Tham chiếu: `chapter-02/bg/bg03-camp-common-room.png`, `chapter-01/char/an/an-neutral.png`, `chapter-02/char/co-linh/co-linh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and Co Linh blue blouse sit together at camp table revising a blank budget notebook after an unexpected expense. An moves a pastel envelope beside notebook, Co Linh calmly points to paper. Reflective supportive mood, afternoon light, no celebration. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

## Cấu trúc và đường dẫn

```text
chapter-02/
  bg/
  scene/
  char/an/
  char/minh/
  char/co-linh/
  asset-mini-game/budget-builder/
  asset-mini-game/savings-race/
  props/
  README.md
```

Đường dẫn frontend: `/images/finteen-v2/chapter-02/` cộng với đường dẫn tương đối bên dưới. Ví dụ: `/images/finteen-v2/chapter-02/char/co-linh/co-linh-explaining.png`.

Các ảnh dùng lại được sao chép vào chương 2 để thư mục tự đầy đủ; không cần lấy đường dẫn ảnh từ chương 1 khi chạy game.

## Context

An 16 tuổi tham gia trại trải nghiệm sống tự lập do trường tổ chức. Nhận 3.000.000đ thu nhập mô phỏng đầu tháng; lập ngân sách, lên kế hoạch laptop 6.000.000đ và xử lý khoản sửa xe bất ngờ 200.000đ. Các chi phí là dữ liệu giả định của bài học, không phải giá sinh hoạt chuẩn.

Giữ nhận dạng chibi của An và Minh từ bộ chương 1. Giới thiệu lại độ tuổi / hoàn cảnh ở đầu chương theo GDD; đây là tình huống độc lập, không mang số tiền hay mục tiêu lớp vẽ từ chương trước sang.

## Ánh xạ 5 cảnh

| Cảnh | Background | Nhân vật, đạo cụ và cách ghép |
| --- | --- | --- |
| CH02_SC01 — Tháng đầu sống tự lập | `bg/bg03-camp-common-room.png` | An trung tính + cô Linh giải thích. Phong bì thu nhập minh họa 3.000.000đ. Bảng chi phí hiển thị bằng UI. |
| CH02_SC02 — Chia ngân sách tháng | Dùng lại BG03 | An suy nghĩ + Minh rủ rê; cô Linh giải thích khi phản hồi. Mở Budget Builder trên cùng nền; có thể ẩn sprite để dành chỗ thao tác. |
| CH02_SC03 — Laptop trong sáu tháng | `bg/bg04-club-goal-board.png` | An suy nghĩ / nhẹ nhõm + cô Linh giải thích / động viên. Đặt hình laptop và kế hoạch lên vùng bảng trống; mở Savings Race. |
| CH02_SC04 — Khoản sửa xe bất ngờ | `bg/bg05-schoolyard.png` | An lo lắng / suy nghĩ + Minh. Ghép `props/student-bicycle.png` ở khoảng sân trống; báo giá sửa xe bằng thẻ UI. |
| CH02_SC05 — Rà soát sau biến cố | Dùng lại BG03 | An suy nghĩ / nhẹ nhõm + cô Linh giải thích / động viên. Bảng recap tách tiền đã chi khỏi kế hoạch. Ending dùng nền này và đổi biểu cảm. |

Các nền toàn cảnh được kết hợp với góc nền và tranh scene bổ sung bên dưới; chọn góc theo hoạt động của từng cảnh.

## Background gốc — 3 ảnh

| File trong `bg/` | Nội dung / sử dụng | Kích thước |
| --- | --- | --- |
| `bg03-camp-common-room.png` | Phòng sinh hoạt trại hè; scene 1, 2, 5 và ending. Bảng trống, góc có phong bì lập kế hoạch. | 1672 × 941 |
| `bg04-club-goal-board.png` | Góc bảng mục tiêu câu lạc bộ cùng phong cách BG03; scene 3 và Savings Race. | 1672 × 941 |
| `bg05-schoolyard.png` | Sân trường dùng lại từ chương 2 cũ; scene 4. Xe đạp là lớp ảnh riêng. | 2752 × 1536 |

BG04 có bảng nhìn gần chính diện. Khi đặt UI lên bảng, dùng một khung nội dung nằm trong phần mặt bảng, tránh tràn qua viền gỗ; không ghi cố định dữ liệu lên file ảnh.

## Nhân vật — 9 ảnh

| File trong `char/` | Gắn ở đâu / khi nào | Kích thước |
| --- | --- | --- |
| `an/an-neutral.png` | An nhận dữ kiện đầu chương và lắng nghe. | 1792 × 2400 |
| `an/an-thinking.png` | An phân bổ ngân sách, tính thời hạn, cân nhắc cách sửa xe hoặc điều chỉnh kế hoạch. | 1084 × 1451 |
| `an/an-relieved.png` | An có kế hoạch khả thi hoặc đã xử lý được khoản phát sinh. Không dùng để mặc định đã sở hữu laptop. | 1084 × 1451 |
| `an/an-worried-money.png` | Ngân sách thiếu hụt hoặc gặp khoản sửa xe chưa có cách xử lý. Tờ tiền cầm tay chỉ tượng trưng. | 1792 × 2400 |
| `minh/minh-neutral.png` | Minh trao đổi bình thường tại scene 2 và 4. | 1792 × 2400 |
| `minh/minh-inviting.png` | Minh đề xuất tăng giải trí ở scene 2; có thể dùng khi đưa ra ý kiến ở scene 4. Không thể hiện ác ý / chế giễu. | 1792 × 2400 |
| `co-linh/co-linh-neutral.png` | Cô Linh lắng nghe hoặc mở đầu cuộc trò chuyện. | 1084 × 1451 |
| `co-linh/co-linh-explaining.png` | Hướng dẫn ngân sách, phép tính mục tiêu và rà soát cuối chương. | 1084 × 1451 |
| `co-linh/co-linh-encouraging.png` | Động viên khi An sửa ngân sách, kéo dài thời hạn hoặc khắc phục khoản thiếu. | 1084 × 1451 |

Cô Linh được phát triển từ mẫu nữ có kính trong kho cũ: giữ mặt và tóc, bỏ tạp dề bán hàng; áo xanh nhạt, quần xanh navy, giày kem. Ba biểu cảm tham chiếu cùng một bản trung tính để giữ nhận dạng. Không cần mẹ của An trong chương này.

### Gợi ý theo nhánh và ending

- Ngân sách vượt thu nhập: An lo lắng → suy nghĩ khi sửa; cô Linh giải thích, không quát mắng.
- Kế hoạch 1.000.000đ/tháng trong 6 tháng hoặc 800.000đ/tháng trong 8 tháng: cả hai có thể dùng nét nhẹ nhõm khi đã kiểm tra tính khả thi. Không gán nét thất bại chỉ vì chọn lâu hơn.
- Phát sinh sửa xe: An suy nghĩ / lo lắng trước quyết định; nhẹ nhõm nếu xử lý được và đã cập nhật kế hoạch.
- Ending A: An nhẹ nhõm, cô Linh trung tính / động viên. Ending B: An suy nghĩ hoặc nhẹ nhõm sau điều chỉnh. Ending C: An lo lắng, cô Linh động viên để sửa.
- Hình laptop luôn là mục tiêu dự kiến trong chương, không phải bằng chứng đã tiết kiệm đủ hoặc đã mua máy.

## Mini-game 1 — Budget Builder

Thư mục `asset-mini-game/budget-builder/`, mỗi ảnh 1254 × 1254.

| File | Mục ngân sách | Nội dung gắn bằng UI |
| --- | --- | --- |
| `housing.png` | Phòng ở chia sẻ | Mức khởi đầu 600.000đ; hình giường / góc phòng chỉ đại diện chi phí chỗ ở, không phải mua nhà. |
| `food.png` | Ăn uống | Mức khởi đầu 900.000đ. |
| `transport.png` | Đi lại | Mức khởi đầu 200.000đ; phương án gói khác 260.000đ chỉ khi có dữ kiện tình huống tương ứng. |
| `entertainment.png` | Giải trí | Mức khởi đầu 100.000đ. Tay cầm là hình đại diện nhóm chi, không có nghĩa phải mua tay cầm. |
| `emergency-buffer.png` | Khoản linh hoạt / dự trù | Phần dành cho bất ngờ; biểu tượng khiên chỉ là minh họa dự phòng, không phải bảo hiểm hoặc tài khoản riêng. |

Mục tiết kiệm mua laptop dùng **chung** `asset-mini-game/savings-race/laptop-goal.png`, không nhân đôi file sang Budget Builder. Như vậy có hình cho đủ 6 nhóm: phòng, ăn, đi lại, giải trí, mục tiêu và dự trù.

Kéo thẻ phân bổ là lập kế hoạch, **không trừ Money và không tạo thêm số dư ví / phong bì**. Tổng các khoản nền là 1.800.000đ, còn 1.200.000đ cho mục tiêu và linh hoạt. Nếu dành mục tiêu 1.000.000đ thì còn 200.000đ linh hoạt; nếu dành 800.000đ thì còn 400.000đ. Giao diện phải cập nhật theo lựa chọn hiện hành.

Số tiền kéo thả, thẻ phân bổ, nhãn và vùng thả dựng bằng UI để chỉnh được giá trị, hỗ trợ thao tác bàn phím và tránh chốt số liệu vào ảnh.

## Mini-game 2 — Savings Race

Thư mục `asset-mini-game/savings-race/`, mỗi ảnh 1254 × 1254.

| File | Cách dùng |
| --- | --- |
| `laptop-goal.png` | Đích tiết kiệm 6.000.000đ, dùng tại bảng mục tiêu, Budget Builder và Savings Race. Màn hình máy để trống, không có thương hiệu. |
| `month-calendar.png` | Mẫu ô tháng tái sử dụng. Render nhiều lần cho 6 hoặc 8 tháng rồi gắn nhãn tháng, số tiền, tiến độ bằng UI. |

- Phương án A: 1.000.000đ × 6 tháng = 6.000.000đ.
- Phương án B: 800.000đ × 7 tháng = 5.600.000đ, chưa đủ; × 8 tháng = 6.400.000đ, đủ mục tiêu.
- Sau khoản phát sinh, dùng lại ảnh lịch và cập nhật mức / thời hạn theo kế hoạch sửa. Không cần generate lịch mới.
- Timeline, đường tiến độ, mốc đã hoàn thành và trạng thái khóa được dựng bằng code. Không dùng tốc độ bấm để đánh giá năng lực chỉ vì tên mini-game có chữ Race.
- Các mốc tháng thể hiện dự kiến, không tự cộng tiền tích lũy vào Money của lượt hiện tại.

## Đạo cụ — 2 ảnh

| File trong `props/` | Cách dùng | Kích thước |
| --- | --- | --- |
| `monthly-income-envelope.png` | Scene 1: minh họa thu nhập mô phỏng đầu kỳ; gắn 3.000.000đ bằng UI. Dùng lại phong bì chương 1, không mang theo số tiền / mục tiêu cũ. | 1254 × 1254 |
| `student-bicycle.png` | Scene 4: ghép xe ở khoảng sân trống cạnh An. Trạng thái cần sửa / đã sửa thể hiện bằng lời thoại và thẻ tình huống. | 1536 × 1024 |

Xe được vẽ nguyên hình, không có hư hỏng cụ thể vì GDD chỉ nói cần sửa, chưa quy định bộ phận nào. Không tự thêm tai nạn, chấn thương hoặc nguyên nhân hỏng. Một file dùng cả trước và sau xử lý; phần thông tin nói rõ trạng thái. Chỉ phát sinh trừ 200.000đ khi xác nhận sự kiện sửa, không phải lúc xuất hiện ảnh xe.

## Quy tắc ghép và kiểm tra

- Background kín khung gần 16:9, dùng `object-fit: cover`; sprite và vật phẩm dùng `object-fit: contain` để giữ tỷ lệ.
- Căn chân nhân vật, chừa vùng dưới cho hộp thoại. Giữ tỷ lệ cô Linh là người lớn khi ghép với An và Minh; không ép tất cả sprite cao bằng nhau chỉ vì canvas gần cùng tỷ lệ.
- Scene 4: dùng xe như đạo cụ trên mặt sân, không kéo xe phủ toàn màn. Tránh đè lên khuôn mặt hoặc vùng lời thoại.
- 18 ảnh foreground có alpha trong suốt thật; đã kiểm tra và xem trên nền sáng. Giữ alpha khi chuyển định dạng.
- Mọi số dư, phép tính, giá, tháng, phản hồi và điều kiện khóa phải hiển thị bằng UI. Các bảng và lịch trống có chủ đích.
- Recap phân biệt số đã thực chi với phân bổ kế hoạch. Không suy tiền đã tiêu hoặc mục tiêu đã đạt từ số tờ tiền, phong bì, hình laptop hay biểu cảm.
- Không gán tính cách hoặc đạo đức từ biểu cảm. Các nhánh chọn thời hạn hợp lý khác nhau cần phản hồi tương xứng.

## Nguồn ảnh dùng lại

Các file gốc và chương 1 được giữ nguyên.

| File chương 2 | Nguồn |
| --- | --- |
| `bg/bg05-schoolyard.png` | `D:/DO-AN/chuong-2/background/sân-trường.png` |
| `char/an/an-neutral.png` | `../chapter-01/char/an/an-neutral.png` |
| `char/an/an-thinking.png` | `../chapter-01/char/an/an-thinking.png` |
| `char/an/an-relieved.png` | `../chapter-01/char/an/an-relieved.png` |
| `char/an/an-worried-money.png` | `../chapter-01/char/an/an-worried-money.png` |
| `char/minh/minh-neutral.png` | `../chapter-01/char/minh/minh-neutral.png` |
| `char/minh/minh-inviting.png` | `../chapter-01/char/minh/minh-inviting.png` |
| `asset-mini-game/budget-builder/food.png` | `../chapter-01/asset-mini-game/needs-or-wants/01-meal.png` |
| `asset-mini-game/budget-builder/transport.png` | `../chapter-01/asset-mini-game/needs-or-wants/02-bus-ticket.png` |
| `props/monthly-income-envelope.png` | `../chapter-01/props/allowance-envelope.png` |

Tham chiếu tạo mới: nền cửa hàng của chương 1 dùng làm mẫu nét vẽ / màu cho BG03, sau đó BG03 làm mẫu cho BG04. Cô Linh tham chiếu `public/images/c1/co-tu/c1_cotu_teaching.png`, đổi trang phục và biểu cảm cho đúng vai người hướng dẫn.

## Phạm vi

Chỉ bàn giao bộ ảnh chương 2 và tài liệu này; chưa thay gameplay hiện tại. Tài liệu bám mục 5.2 của GDD v2. Thư mục không giữ bản preview, JSON kiểm tra hoặc ảnh nháp; những điểm logic còn cần chốt trong GDD không được coi là đã giải quyết bằng việc tạo ảnh.

## Prompt tạo ảnh

Các prompt nguyên văn được lưu bên dưới để tái tạo / chỉnh sửa khi cần. Công cụ: imagegen tích hợp. Bản xe đạp cuối đã qua bước tách nền bổ sung.

<details>
<summary>bg/bg03-camp-common-room.png</summary>

```text
Use case: illustration-story. Create ONE 16:9 landscape production background BG03 for chapter 2 of a Vietnamese teen financial-learning visual novel. The supplied image is a STYLE REFERENCE ONLY; do not draw a shop. Draw a bright empty school summer-camp common room used for a simulated independent-living workshop: warm cream walls, mint window trim, rounded light-wood tables and chairs, a large completely blank pinboard on the rear wall, small bookshelf, plants and a few blank colored planning envelopes on a side table. Kawaii cartoon 2D, clean warm brown outlines, rounded shapes, softly saturated butter yellow/mint/coral palette, gentle cel shading, sunny afternoon. Eye-level wide room, open uncluttered lower foreground for separately overlaid character sprites and dialogue. No people, no beds, no writing, no numbers, no labels, no logos, no watermarks, no UI, no charts with data. Full-bleed single scene.
```

</details>

<details>
<summary>bg/bg04-club-goal-board.png</summary>

```text
Use case: illustration-story. Create ONE production landscape 16:9 background BG04 for the goal-setting scene of a Vietnamese school summer-camp visual novel. Supplied image is environment and style reference: SAME school workshop room, matching cream walls, mint trim, honey wood, plants, sunny afternoon and clean kawaii cartoon 2D outlines. Camera now faces a large freestanding wooden-framed pale cream planning board for the design club, prominently centered in middle distance, almost front-on. Board surface entirely BLANK, unobstructed, wide enough to later overlay laptop goal and timeline in code. Beside board a low shelf with sketchbooks and pencil cups, at edges rounded chairs and windows. Empty lower foreground for two separately overlaid chibi sprites and a dialogue box. No people, no laptop baked onto board, no timelines, no lettering, no digits, no prices, no logos, no watermark, no UI. Warm inviting flat cel shaded cartoon, not photorealistic. Full-bleed scene.
```

</details>

<details>
<summary>char/co-linh/co-linh-neutral.png</summary>

```text
Use case: identity-preserve. Edit the supplied female cartoon sprite into Co Linh, the approachable school workshop mentor for a Vietnamese teen financial-learning visual novel. Preserve the same face identity, long dark side ponytail, rectangular glasses, blush, clean kawaii cartoon 2D linework and stylized proportions. Remove the floral shopkeeper apron COMPLETELY. Keep light blue long-sleeved collared blouse, navy trousers, simple cream flat shoes. Change expression and pose to neutral welcoming: relaxed eyebrows, gentle closed-mouth smile, both arms relaxed naturally, one hand loosely resting over the other at waist. No props, no pointing finger. Full body visible head to shoes with clear margin, centered portrait format. Genuine alpha transparent background, no scenery, no floor shadow, no checkerboard, no words, no symbols, no watermark. Single sprite, not a sheet.
```

</details>

<details>
<summary>char/co-linh/co-linh-explaining.png</summary>

```text
Use case: identity-preserve. Edit this exact Co Linh character sprite into ONE explaining pose. Preserve identical face, glasses, dark side ponytail, blue blouse, navy trousers, cream flat shoes, proportions, colors and kawaii cartoon 2D linework. Change only arms and expression: relaxed raised eyebrows, small friendly speaking mouth, one forearm raised with open palm presenting a budget board to the side; other hand relaxed near waist. Patient teacher explaining, never scolding, no sharp pointing finger. Full body centered head to shoes, same scale and framing, generous clear margins. No props, no apron, no text, no symbols, no environment. Real transparent alpha background, no checkerboard, no floor shadow. Single sprite only.
```

</details>

<details>
<summary>char/co-linh/co-linh-encouraging.png</summary>

```text
Use case: identity-preserve. Produce ONE encouraging pose variant of this exact Co Linh sprite. Preserve identical face, glasses, dark side ponytail, light blue blouse, navy trousers, cream flat shoes, cartoon proportions and clean kawaii 2D cel shading. Change only expression/arm pose: warm empathetic gentle smile, eyebrows slightly raised with reassurance, one hand softly resting on upper chest and the other relaxed with a small open-palm gesture. She supports a student revising a financial plan; calm, not celebrating, not judging, no thumbs-up. Full body including shoes visible, same centered framing with ample transparent margins. Genuine alpha transparent background, no checkerboard, no scenery, no floor shadow, no text, symbols, props, or apron. Single sprite.
```

</details>

<details>
<summary>asset-mini-game/budget-builder/housing.png</summary>

```text
Use case: illustration-story. ONE standalone square transparent PNG icon for the HOUSING category of a Vietnamese teen Budget Builder game. Draw a cozy miniature cutaway corner of a simple shared school-camp room: one modest wooden single bed with mint blanket and cream pillow, a tiny bedside cabinet and a small simple wall/window fragment behind, arranged as one compact dollhouse-like icon. No luxurious furniture, no people. Kawaii cartoon 2D, clean dark warm-brown outlines, rounded shapes, flat cel shading, butter-yellow wood and soft mint palette matching a chibi educational visual novel. Three-quarter slightly elevated view, centered entire object with clear margins. Real alpha transparency, no overall background, no checkerboard, no text, no price, no numbers, no logo, no watermark, no card frame.
```

</details>

<details>
<summary>asset-mini-game/budget-builder/entertainment.png</summary>

```text
Use case: illustration-story. ONE standalone square PNG illustration for the ENTERTAINMENT budget category of a Vietnamese teen educational visual novel. A cheerful mint-and-cream generic game controller with two rounded thumbsticks and small coral/yellow buttons, slightly tilted three-quarter front view. No brands, no console, no hands, no other objects. Kawaii cartoon 2D matching chibi game assets: chunky soft rounded shapes, clean dark warm-brown outlines, flat cel shading, gentle highlights. Center entire controller with 15 percent empty margin. Genuine alpha transparent background, no checkerboard or scene or ground shadow. No text, letters, numbers, price, watermark, moral symbol or card frame.
```

</details>

<details>
<summary>asset-mini-game/budget-builder/emergency-buffer.png</summary>

```text
Use case: illustration-story. ONE square standalone transparent PNG asset for an EMERGENCY BUFFER planning category in a Vietnamese teen Budget Builder game. A pale mint open paper envelope, fully empty inside, with a small simple warm-gold shield emblem printed on its front. Emblem is a plain shield outline only, no checkmark. This is a planning envelope for unexpected expenses, not an insurance policy, bank account or medical kit. Kawaii cartoon 2D: rounded paper corners, clean dark warm brown outlines, flat soft cel shading, modest highlights, cream inner lining. Three-quarter slightly tilted view, centered full object, generous margins. No coins, banknotes, text, numbers, currency signs, logos, watermark, scenery or card frame. Genuine transparent alpha background, no checkerboard.
```

</details>

<details>
<summary>asset-mini-game/savings-race/laptop-goal.png</summary>

```text
Use case: illustration-story. ONE standalone square transparent PNG game item for a savings goal: a modest student laptop opened at about 110 degrees, mint-grey casing, simple cream keyboard with unlettered keys, blank pale blue screen with only a soft reflection. Three-quarter slightly elevated front view, entire laptop visible centered with clear 15 percent margins. Kawaii cartoon 2D illustration matching a Vietnamese chibi financial educational game: clean warm dark-brown outlines, rounded shapes, soft flat cel shading, gentle highlights. Affordable practical study laptop, not gaming or luxury. No other objects, no hands, no brand logo, no writing, no numbers, no price, no UI on screen, no watermark. Genuine transparent alpha background, no checkerboard or floor shadow.
```

</details>

<details>
<summary>asset-mini-game/savings-race/month-calendar.png</summary>

```text
Use case: illustration-story. ONE standalone square transparent PNG reusable month-tile asset for a savings planning game. Draw a small freestanding spiral desk calendar viewed almost straight-on, cream blank page, mint header band and butter-yellow triangular base. Two simple dark binding loops at top. The FRONT PAGE must be entirely BLANK with generous clean central area for a month label and amount rendered later in code: no printed grid, no dates, no letters, no numbers, no checkmarks. Kawaii cartoon 2D, rounded corners, clean warm brown outlines, flat cel shading, soft friendly colors matching a chibi Vietnamese educational game. Complete object centered, 15 percent transparent padding. Real alpha transparent background, no scenery, no tabletop, no floor shadow, no checkerboard, no watermark. One calendar only.
```

</details>

<details>
<summary>props/student-bicycle.png</summary>

```text
Use case: background-extraction. EDIT TARGET: the supplied bicycle image. Remove the entire dark blurry colored backdrop and all halo, glow, haze and ground shadow. Preserve ONLY the bicycle itself: mint frame, cream fenders, brown saddle, metal basket, wheels, spokes, chain, pedals, kickstand. All spaces between spokes, basket wires, frame tubes and outside the silhouette must be fully transparent alpha, not smoky gradients. Keep the bicycle colors, shape, side view, linework and all parts unchanged. Export a clean isolated full bicycle PNG cutout on genuinely transparent alpha background, with clear empty margin around the complete bike. No new background, no white matte, no checkerboard, no text, no crop.
```

</details>

