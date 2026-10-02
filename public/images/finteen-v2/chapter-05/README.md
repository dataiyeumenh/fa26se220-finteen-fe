# Chương 5 — Ngân hàng và lãi

Bộ ảnh theo GDD v2, phong cách kawaii cartoon 2D. **Hiện có 27 PNG: 4 background, 4 tranh scene hoàn chỉnh và 19 ảnh nhân vật/mini-game/đạo cụ.** Đợt bổ sung này thêm 3 góc nền và 4 tranh kể chuyện bằng imagegen tích hợp, giữ nguyên các ảnh đã có.

## Background và scene bổ sung — hướng dẫn sử dụng hiện tại

SC01: toàn phòng thực hành → tranh hai tài khoản. SC02: góc máy tính → tranh tra cứu nguồn. SC03: góc bảng timeline → tranh tiền và sức mua → Compound Timeline. SC04: quầy kế hoạch → tranh trình bày thời hạn → reflection.

| File mới | Gắn vào đâu |
| --- | --- |
| `bg/bg09b-provider-research-station.png` | SC02: tra cứu nhà cung cấp và điều kiện. |
| `bg/bg09c-timeline-teaching-wall.png` | SC03: góc trình bày Compound Timeline, tránh lặp toàn phòng. |
| `bg/bg09d-plan-confirmation-counter.png` | SC04: quầy xác nhận kế hoạch theo thời hạn. |
| `scene/sc01-two-accounts.png` | SC01: giới thiệu hai tài khoản giả lập. |
| `scene/sc02-investigating-provider.png` | SC02: kiểm tra lời quảng cáo và nguồn, chưa chuyển tiền. |
| `scene/sc03-money-and-purchasing-power.png` | SC03: minh họa tiền danh nghĩa và sức mua trong lượt luyện. |
| `scene/sc04-planning-for-deadline.png` | SC04: trình bày kế hoạch cho ngày cần tiền, không cố định A/B. |

- `bg/` là nền không có nhân vật, dùng cùng sprite khi thoại, chọn đáp án hoặc chơi mini-game. Các góc cận có bàn/quầy chiếm tiền cảnh: dùng chân dung nửa người hoặc ẩn sprite để tránh chân xuyên bàn.
- `scene/` là tranh đã có nhân vật và hành động. Dùng làm tranh dẫn cảnh/chuyển nhịp; ẩn sprite rời khi hiện tranh để không trùng nhân vật. Có thể chuyển về góc nền tương ứng khi người chơi bắt đầu thao tác.
- Các tranh dùng cùng nhận dạng tóc, màu áo và phong cách chibi của bộ đã duyệt. Độ tuổi tình huống vẫn giới thiệu theo GDD.
- Chữ, giá, công thức, ngày và trạng thái lựa chọn do UI hiển thị. Lưới lịch, nét giấy hoặc hình sản phẩm trong tranh chỉ minh họa, không lấy làm dữ liệu kiểm tra hoặc vùng bấm cố định.
- Các scene không chốt kết quả nhánh. Khi hiển thị hậu quả/ending, dùng dữ liệu và biểu cảm riêng theo lựa chọn thực của người chơi.
- Toàn bộ ảnh mới là tranh ngang có nền kín, không cần alpha. Chưa tích hợp vào gameplay; đây là hướng dẫn ghép cho bước triển khai.

### Prompt bổ sung (imagegen tích hợp)

<details>
<summary>bg/bg09b-provider-research-station.png</summary>

Tham chiếu: `chapter-05/bg/bg09-banking-practice-room.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New close oblique angle of student research workstation in same banking practice room: large blank monitor, keyboard, two blank account brochures and notebook on wooden desk, window at side. Clear cream wall and shelves beyond. No people. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>bg/bg09c-timeline-teaching-wall.png</summary>

Tham chiếu: `chapter-05/bg/bg09-banking-practice-room.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New near-frontal medium-wide view of teaching corner in same banking lab: large completely blank cream display dominates wall, small tabletop in foreground with blank calendar and wooden pointer, plants and mint trim at edges. No chart or data yet. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>bg/bg09d-plan-confirmation-counter.png</summary>

Tham chiếu: `chapter-05/bg/bg09-banking-practice-room.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New customer-eye medium view across simulated bank training counter in same classroom. Two empty seats, blank clipboard, plain mint and lavender passbooks on desk, modest laptop at far side with blank screen. Soft daylight, no branding or people. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc01-two-accounts.png</summary>

Tham chiếu: `chapter-05/bg/bg09-banking-practice-room.png`, `chapter-01/char/an/an-neutral.png`, `chapter-05/char/bank-guide/bank-guide-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and male bank guide navy suit red tie sit across training desk in banking classroom comparing two blank passbooks, one mint open and one lavender closed. Guide gently introduces them, An attentive. Medium two-shot, no cash transfer or signature. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc02-investigating-provider.png</summary>

Tham chiếu: `chapter-05/bg/bg09-banking-practice-room.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/minh/minh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt sits at classroom research computer inspecting blank screen and account brochure. Minh navy polo beside him gestures toward screen while An pauses thoughtfully with pencil. Medium side view showing faces, no real app logo, no transfer. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc03-money-and-purchasing-power.png</summary>

Tham chiếu: `chapter-05/bg/bg09-banking-practice-room.png`, `chapter-01/char/an/an-neutral.png`, `chapter-02/char/co-linh/co-linh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and Co Linh blue blouse compare small stack of plain tokens with a modest mint shopping basket on classroom demonstration table. Co Linh explains with open palm, An thinks carefully. Large blank teaching board behind, no fixed graph or values. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc04-planning-for-deadline.png</summary>

Tham chiếu: `chapter-05/bg/bg09-banking-practice-room.png`, `chapter-01/char/an/an-neutral.png`, `chapter-05/char/bank-guide/bank-guide-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt at simulated banking counter lays a blank calendar beside course workbook and blank plan sheet, explains his time horizon to navy-suited male bank guide with red tie who listens. Medium two-shot, reflective not celebratory, no signed contract, no transfer. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

## Cấu trúc

```text
chapter-05/
  bg/
  scene/
  char/an/
  char/minh/
  char/co-linh/
  char/bank-guide/
  asset-mini-game/compound-timeline/
  props/
  README.md
```

Đường dẫn frontend bắt đầu bằng `/images/finteen-v2/chapter-05/`. Các ảnh dùng lại được sao chép vào chương này để thư mục tự đầy đủ.

## Context

An 16 tuổi có 1.000.000đ, cần đúng 1.000.000đ trả khóa học sau ba tháng. Chương độc lập, không mang tiền hoặc sản phẩm đã mua từ chương 4 sang. Các tài khoản và nhà cung cấp đều giả định, hoạt động diễn ra trong phòng thực hành ngân hàng của trường.

Mục tiêu: đọc lãi, phí, điều kiện rút và phạm vi bảo vệ; chọn theo ngày cần dùng tiền; phân biệt lãi đơn/lãi kép, tiền danh nghĩa/sức mua. Bài tập lãi kép theo năm tách khỏi bài so tài khoản ba tháng.

## Ánh xạ cảnh

| Cảnh | Background | Cách ghép ảnh |
| --- | --- | --- |
| CH05_SC01 — Hai tài khoản | BG09 | An trung tính/suy nghĩ và nhân viên trung tính/giải thích. Đặt hai icon tài khoản vào thẻ A/B. Phong bì và sách minh họa mục tiêu khóa học. |
| CH05_SC02 — Đọc điều kiện trước khi chọn | BG09 | Minh rủ rê, An suy nghĩ, nhân viên giải thích. Laptop mở thẻ tra cứu nhà cung cấp, phí, phạm vi bảo vệ; ứng dụng bên ngoài thể hiện bằng UI, không cần thêm ảnh nền. |
| CH05_SC03 — Lãi tăng còn sức mua thì sao | BG09 | An suy nghĩ/lo lắng, cô Linh giải thích. Compound Timeline dùng icon tiền, giỏ hàng và lịch; có thể ẩn sprite khi người chơi thao tác. |
| CH05_SC04 — Chọn theo thời hạn | BG09 | An suy nghĩ/nhẹ nhõm, nhân viên giải thích. Hiện thẻ kế hoạch, lịch ba tháng và mục tiêu khóa học. |
| Reflection / ending | Giữ BG09 | An suy nghĩ hoặc nhẹ nhõm, cô Linh giải thích/động viên. Báo cáo kết quả và phần cần sửa là UI riêng. |

GDD mô tả bốn scene nhưng đoạn hội tụ sau CH05_SC04 ghi “scene 5” mà chưa có mô tả riêng. Bộ ảnh dùng BG09 cho phần reflection/ending, không tự thêm nội dung scene 5; cần thống nhất mã cảnh khi tích hợp.

## Background gốc — 1 ảnh

| File | Kích thước | Sử dụng |
| --- | --- | --- |
| `bg/bg09-banking-practice-room.png` | 1672 × 941 | Phòng thực hành sáng, máy tính tra cứu bên trái, quầy mô phỏng bên phải và bảng trống phía sau. Dùng xuyên suốt chương. |

Đặt bảng so sánh hoặc timeline thành lớp UI riêng phía trước hay trong vùng bảng trống; không ghi cố định lãi suất hoặc công thức vào background. Không có nhận diện ngân hàng thật.

## Nhân vật — 11 ảnh

| File trong `char/` | Kích thước | Sử dụng |
| --- | --- | --- |
| `an/an-neutral.png` | 1792 × 2400 | Nhận dữ kiện mục tiêu và hai tài khoản. |
| `an/an-thinking.png` | 1084 × 1451 | Đọc phí, nguồn, thời hạn và tính toán. |
| `an/an-worried-money.png` | 1792 × 2400 | Phát hiện thiếu tiền sau phí hoặc sức mua giảm. |
| `an/an-relieved.png` | 1084 × 1451 | Hoàn thành phương án khả thi. |
| `minh/minh-neutral.png` | 1792 × 2400 | Trao đổi thông tin tài khoản. |
| `minh/minh-inviting.png` | 1792 × 2400 | Giới thiệu ứng dụng quảng cáo lãi cao, cảnh 2. |
| `co-linh/co-linh-neutral.png` | 1084 × 1451 | Lắng nghe phần suy ngẫm. |
| `co-linh/co-linh-explaining.png` | 1084 × 1451 | Giải thích sức mua, lãi kép, nhu cầu dài hạn và sửa kế hoạch. |
| `co-linh/co-linh-encouraging.png` | 1084 × 1451 | Động viên sau điều chỉnh hoặc kết thúc. |
| `bank-guide/bank-guide-neutral.png` | 1084 × 1451 | Nhân viên mô phỏng chào và lắng nghe. |
| `bank-guide/bank-guide-explaining.png` | 1084 × 1451 | Giải thích phí, điều kiện rút và xác nhận kế hoạch. |

Nhân viên mặc vest navy, cà vạt đỏ trầm và bảng tên trống. Trang phục chỉ nhận diện vai trong mô phỏng; không chứng minh nhà cung cấp đáng tin hay sản phẩm được bảo vệ.

## Compound Timeline — 5 ảnh

Tất cả 1254 × 1254, alpha trong suốt. File trong `asset-mini-game/compound-timeline/`:

| File | Sử dụng |
| --- | --- |
| `flexible-account.png` | Sổ mở mint và thẻ coral, icon tài khoản A linh hoạt. Không phải ảnh thẻ thanh toán thực. |
| `term-account.png` | Sổ tím và đồng hồ cát, icon tài khoản B kỳ hạn. Không dùng ổ khóa vì tình huống cho phép rút sớm với mức lãi khác. |
| `nominal-money.png` | Minh họa số tiền danh nghĩa trong bài tập; số đồng xu không tương ứng một mệnh giá hay số dư cụ thể. |
| `purchasing-power-basket.png` | Minh họa thẻ mua sắm. Dùng cùng một ảnh trước/sau tăng giá để giữ nguyên lượng hàng; vật trong giỏ là minh họa, không định giá từng món. |
| `time-calendar.png` | Icon thời gian. Trục năm, mốc ba tháng và thao tác kéo do UI dựng, không dùng ô trong icon làm timeline thật. |

### Bài so tài khoản sau ba tháng

| Phương án | Điều kiện giả định | Phép tính và số dư dự kiến |
| --- | --- | --- |
| A linh hoạt | 3%/năm, phí 5.000đ/tháng | Lãi đơn: 1.000.000 × 3% × 3/12 = 7.500đ; phí 15.000đ; còn 992.500đ. |
| B kỳ hạn | Kỳ hạn 12 tháng, 6%/năm, không phí; rút sớm 0,2%/năm | Rút sau 3 tháng: 1.000.000 × 0,2% × 3/12 = 500đ; còn 1.000.500đ. |

Không dùng 6% làm lãi suất ba tháng của B khi rút sớm. A thiếu 7.500đ cho mục tiêu; chỉ công nhận kế hoạch khả thi khi nguồn bù được xác minh. Phương án bù chưa rõ là trạng thái chờ, không phải tiền đã có.

### Lượt luyện lãi kép và sức mua

Vốn minh họa 1.000.000đ, 5%/năm, ghép lãi theo năm:
- Năm 1: 1.050.000đ.
- Năm 2: 1.102.500đ.
- Khi so với lãi đơn cùng giả định: năm 2 là 1.100.000đ. Hiển thị rõ công thức và chế độ đang xem.
- Thẻ mua sắm tăng giá 8% sau một năm: 1.000.000đ thành 1.080.000đ. Tiền danh nghĩa 1.050.000đ vẫn thiếu 30.000đ để mua cùng lượng hàng.

Không biến icon xu thành đồ thị tăng trưởng cố định; biểu đồ cần lấy số từ dữ liệu. Không kéo mức tăng giá năm đầu sang các năm sau nếu chưa công bố giả định. Nhu cầu dài hạn/hưu trí được giải thích qua lời thoại và timeline, không cần thêm nhân vật già hoặc cảnh tương lai.

## Đạo cụ — 3 ảnh

Tất cả 1254 × 1254, alpha trong suốt.

| File | Sử dụng |
| --- | --- |
| `props/course-fund-envelope.png` | Quỹ đầu chương 1.000.000đ; chữ và số dư bằng UI. |
| `props/course-goal.png` | Mục tiêu khóa học sau ba tháng. Sách chỉ minh họa việc học, không ngụ ý đây là khóa thiết kế 200.000đ ở chương 3. |
| `props/provider-check-laptop.png` | Mở thẻ nguồn/nhà cung cấp và ứng dụng ngoài trong cảnh 2. Không ngụ ý An sở hữu laptop từ chương trước. |

## Lưu ý tích hợp

- Lựa chọn đọc nguồn hoặc chọn kế hoạch không chuyển tiền, không tự mở hai tài khoản và không cộng số dư dự kiến vào Money.
- Các phép tính ba tháng và lãi kép theo năm là bài tập; chưa có thời gian/giao dịch thực trôi qua thì Money không đổi. Điểm WEALTH hoặc SAVING không phải tiền.
- Phạm vi bảo vệ, tên nhà cung cấp và kênh giám sát cần ghi theo dữ liệu giả định được duyệt. Không gắn logo FDIC, dấu bảo đảm hoặc suy rằng mọi sản phẩm đều là tiền gửi được bảo vệ.
- UI hiển thị rõ đơn vị phần trăm/năm, phí/tháng, thời hạn và quy tắc rút sớm. Số liệu đây là kịch bản học tập, không phải lãi suất sản phẩm hiện hành.
- Ending áp dụng đầy đủ điều kiện GDD, kiểm tra Recovery trước. Ảnh nhẹ nhõm không tự đồng nghĩa Goal Achieved; phương án chưa xác minh nguồn bù cần bước sửa.
- Giữ alpha, dùng contain cho sprite/icon, canh theo chân và chiều cao hiển thị; background dùng cover. Chừa vùng hộp thoại, không kéo giãn hình.
- Bộ này chỉ bàn giao ảnh và ghi chú, chưa tích hợp luồng game hoặc sửa logic.

## Nguồn và kiểm tra

13 ảnh dùng lại nguyên bản:
- 9 sprite An/Minh/cô Linh cùng đường dẫn trong `../chapter-02/char/`.
- Lịch: `../chapter-02/asset-mini-game/savings-race/month-calendar.png`.
- Phong bì: `../chapter-01/props/allowance-envelope.png`.
- Laptop: `../chapter-03/props/source-check-laptop.png`.
- Sách khóa học: `../chapter-03/asset-mini-game/career-match/intro-course.png`.

7 ảnh tạo/chỉnh bằng **imagegen tích hợp**: BG09, hai sprite nhân viên và bốn icon tài khoản/tiền/sức mua. BG09 tham chiếu phong cách `../chapter-02/bg/bg03-camp-common-room.png`. Nhân viên tham chiếu trang phục từ `D:/DO-AN/chuong-4/nhan-vien-ngan-hang/bình-thường.png` và nét chibi từ `../chapter-03/char/tu-van/tu-van-neutral.png`; pose giải thích giữ nhận dạng sprite mới.

Đã mở đủ PNG, kiểm tra kích thước và pixel alpha của 19 ảnh tiền cảnh; background kín. Thư mục hiện gồm 27 ảnh và README này.

## Prompt tạo ảnh

<details>
<summary>bg/bg09-banking-practice-room.png</summary>

```text
Use case: illustration-story. Reference image is STYLE and palette reference, not a room to copy exactly. ONE landscape 16:9 visual novel BG09 background: a Vietnamese school financial education practice classroom arranged as a simulated bank learning lab. Warm cream walls, mint trim, pale wooden furniture, daylight from left windows, a few green plants. Rear right a modest training-service counter with laptop and blank document trays, left two student computer stations. Large completely BLANK pale cream teaching display on rear wall to hold later interactive comparison/timeline UI. Clear wide empty lower foreground for separate character sprites and dialogue. Clean kawaii cartoon 2D warm brown linework, soft cel shading matching reference. No people, real bank branding, logos, flags, currency symbols, text, letters, rates, numbers, graphs, safes or cash piles. Not a commercial bank advertisement. Full bleed single environment.
```

</details>

<details>
<summary>char/bank-guide/bank-guide-neutral.png</summary>

```text
Use case: style-transfer. Image 1 is identity and outfit reference: Vietnamese male simulated bank employee, short swept black hair, navy suit, white shirt, muted red tie, blank clipped badge. Image 2 is STYLE/PROPORTIONS ONLY: clean cute chibi cartoon 2D, warm dark brown outlines, soft cel shading, round friendly face and large eyes. Redraw image 1 in image 2 style as one full-body game sprite. Calm closed-mouth smile, relaxed neutral eyebrows, arms naturally down, holding small completely blank cream clipboard at one side. Preserve navy suit red tie distinction. Full body including shoes centered with generous margins. Genuine alpha transparent background, no letters, numbers, logos, fake writing, insignia, scenery, floor shadow or watermark.
```

</details>

<details>
<summary>char/bank-guide/bank-guide-explaining.png</summary>

```text
Use case: identity-preserve. Edit exact reference simulated bank guide to one explaining pose. Preserve identical face, short swept dark hair, navy suit, white shirt, muted red tie, blank badge, dark shoes, proportions and kawaii cartoon 2D rendering. Friendly speaking smile, one hand open palm gently explaining to side, other holds completely blank cream clipboard near waist. No pointing pressure or sales gesture. Full body centered with clear margins, head to shoes visible. Real alpha transparent background; no text, numbers, symbols, logos, money, checkmarks, backdrop, checkerboard or floor shadow.
```

</details>

<details>
<summary>asset-mini-game/compound-timeline/flexible-account.png</summary>

```text
Use case: illustration-story. One square transparent educational game item for a FLEXIBLE BANK ACCOUNT: an open small mint passbook with completely blank cream pages and a simple plain coral rectangular account card tucked beside it. Coherent compact still life, three-quarter view, rounded chunky shapes, warm dark-brown outlines and soft flat cel shading, kawaii cartoon 2D matching chibi Vietnamese visual novel assets. No bank logo, card number, chip, currency signs, rates, text, fake writing, arrows, checks or protection seal. It is an illustrative account icon, not proof of safety. Complete objects centered with generous margins, real alpha transparent background, no hands, people, scenery, floor shadow or watermark.
```

</details>

<details>
<summary>asset-mini-game/compound-timeline/term-account.png</summary>

```text
Use case: illustration-story. One square transparent game item representing a TERM BANK ACCOUNT: a closed small lavender passbook with entirely blank cover and cream page edges, beside a small cream-and-coral hourglass with pale sand. Compact coherent still life three-quarter view. Kawaii cartoon 2D, rounded chunky forms, warm dark brown outlines, soft flat cel shading matching mint/cream educational visual novel icons. The hourglass signifies duration only; no padlock because early withdrawal is possible. No coins, rates, numbers, writing, logos, seals, checkmarks, arrows or guaranteed returns. Full objects centered generous margins. Real alpha transparent background; no people, hands, scenery, floor shadow or watermark.
```

</details>

<details>
<summary>asset-mini-game/compound-timeline/nominal-money.png</summary>

```text
Use case: illustration-story. One square transparent educational game item: a small neat stack of three plain warm-gold circular tokens with one matching coin leaning against it, all faces completely blank. Illustrates nominal money in a compound-interest exercise, not real currency or a growth graph. Kawaii cartoon 2D, chunky rounded forms, warm dark brown outlines, soft flat cel shading, gentle highlights matching cream/mint chibi game assets. Compact centered three-quarter still life, generous margins. No arrows, sprout, percent, text, digits, dollar signs, logo, stars, checkmarks, hands, people, floor shadow, background or watermark. Genuine alpha transparency.
```

</details>

<details>
<summary>asset-mini-game/compound-timeline/purchasing-power-basket.png</summary>

```text
Use case: illustration-story. One square transparent educational game item for a generic purchasing-power shopping card: a small mint shopping basket holding one plain cream package, a simple coral notebook and a small plain bottle. Neutral illustrative goods, same basket will be reused before and after a price change; no implied change in quantity. Kawaii cartoon 2D rounded chunky shapes, clean warm dark brown outlines, soft flat cel shading, mint cream coral palette matching chibi financial education visual novel. Compact coherent arrangement, three-quarter view, entire basket centered generous margins. No text, numbers, brand, price tag, currency symbol, arrows, checks, discount signs, people, hands, scenery, floor shadow or watermark. Real alpha transparent background.
```

</details>

