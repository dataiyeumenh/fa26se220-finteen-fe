# Chương 4 — Mua thông minh

<!-- chibi-age-update -->
## Cập nhật tạo hình ngày 03/10/2026

**Tất cả nhân vật đều chibi.** An/Minh trong tình huống này là **16 tuổi** theo GDD v2. Khác tuổi thể hiện qua quần áo và nét mặt; giữ tỷ lệ cơ thể chibi nhất quán, không dùng tăng chiều cao để phân biệt tuổi. Mẹ/cô/NPC dùng mẫu người lớn chibi cố định giữa các chương.

Đã thay **11 sprite và 4 tranh scene** bằng imagegen tích hợp tại đúng đường dẫn cũ. Các sprite giữ nền trong suốt. Xem [manifest kích thước và checksum hiện tại](../character-age-manifest.json), [quy tắc tạo hình](../README.md) và [nguồn độ tuổi](../../../../docs/finteen-v2-character-ages.md).

Thông tin nguồn tái sử dụng, kích thước và prompt cũ bên dưới là lịch sử của đợt tạo trước, được cập nhật này thay thế đối với **nhân vật và tranh scene**. Các hướng dẫn bối cảnh, đạo cụ, mini-game và tình huống vẫn dùng được. Bộ art này chưa được tích hợp thêm vào gameplay trong đợt sửa hình.
<!-- /chibi-age-update -->

Bộ ảnh theo GDD v2, phong cách kawaii cartoon 2D. **Hiện có 26 PNG: 4 background, 4 tranh scene hoàn chỉnh và 18 ảnh nhân vật/mini-game/đạo cụ.** Đợt bổ sung này thêm 2 góc nền và 4 tranh kể chuyện bằng imagegen tích hợp, giữ nguyên các ảnh đã có.

## Background và scene bổ sung — hướng dẫn sử dụng hiện tại

SC01: toàn cửa hàng → tranh Minh giới thiệu máy. SC02: quầy so sánh → tranh hỏi nhân viên → Smart Shopping. SC03: quầy chứng từ → tranh hỏi khoản phí. SC04: bàn học → tranh theo dõi sau mua → UI nhắc hạn/reflection.

| File mới | Gắn vào đâu |
| --- | --- |
| `bg/bg08b-phone-comparison-counter.png` | SC02: quầy so sánh ba máy A/B/C. |
| `bg/bg08c-checkout-documents.png` | SC03: quầy thanh toán và đối chiếu chứng từ. |
| `scene/sc01-phone-needs.png` | SC01: Minh giới thiệu mẫu C, An cân nhắc nhu cầu. |
| `scene/sc02-comparing-three-phones.png` | SC02: so nhu cầu, chất lượng và tổng chi phí trước mua. |
| `scene/sc03-questioning-receipt.png` | SC03: phát hiện khoản phí cần hỏi; không cố định việc trả thêm. |
| `scene/sc04-following-renewal.png` | SC04: theo dõi chứng từ/gia hạn; không khẳng định đã hủy. |

- `bg/` là nền không có nhân vật, dùng cùng sprite khi thoại, chọn đáp án hoặc chơi mini-game. Các góc cận có bàn/quầy chiếm tiền cảnh: dùng chân dung nửa người hoặc ẩn sprite để tránh chân xuyên bàn.
- `scene/` là tranh đã có nhân vật và hành động. Dùng làm tranh dẫn cảnh/chuyển nhịp; ẩn sprite rời khi hiện tranh để không trùng nhân vật. Có thể chuyển về góc nền tương ứng khi người chơi bắt đầu thao tác.
- Các tranh dùng cùng nhận dạng tóc, màu áo và phong cách chibi của bộ đã duyệt. Độ tuổi tình huống vẫn giới thiệu theo GDD.
- Chữ, giá, công thức, ngày và trạng thái lựa chọn do UI hiển thị. Lưới lịch, nét giấy hoặc hình sản phẩm trong tranh chỉ minh họa, không lấy làm dữ liệu kiểm tra hoặc vùng bấm cố định.
- Các scene không chốt kết quả nhánh. Khi hiển thị hậu quả/ending, dùng dữ liệu và biểu cảm riêng theo lựa chọn thực của người chơi.
- Toàn bộ ảnh mới là tranh ngang có nền kín, không cần alpha. Chưa tích hợp vào gameplay; đây là hướng dẫn ghép cho bước triển khai.

### Prompt bổ sung (imagegen tích hợp)

<details>
<summary>bg/bg08b-phone-comparison-counter.png</summary>

Tham chiếu: `chapter-04/bg/bg08-phone-shop.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New medium close oblique view of display counter within reference phone shop. Exactly three unbranded phones on stands: mint, coral with home button, lavender. Blank screens and blank price cards. Shelves behind, clear space between stands for later UI. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>bg/bg08c-checkout-documents.png</summary>

Tham chiếu: `chapter-04/bg/bg08-phone-shop.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New customer-eye view facing checkout in same phone shop. Wooden counter foreground, payment terminal with blank screen at edge, two entirely blank separate cream documents and pen on counter, shop shelves behind. Empty clerk position, no people. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc01-phone-needs.png</summary>

Tham chiếu: `chapter-04/bg/bg08-phone-shop.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/minh/minh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and Minh navy polo browse phone shop. Minh shows a lavender unbranded phone in his hand, An thoughtfully examines display without taking any phone. Medium two-shot, friendly peer influence, no checkout or money. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc02-comparing-three-phones.png</summary>

Tham chiếu: `chapter-04/bg/bg08-phone-shop.png`, `chapter-01/char/an/an-neutral.png`, `chapter-04/char/shop-assistant/shop-assistant-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt compares three phones on shop counter, mint coral lavender; female assistant short bob mint polo explains a blank comparison sheet with open hand. Both look at products and sheet, medium side two-shot. No chosen phone or checkmark. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc03-questioning-receipt.png</summary>

Tham chiếu: `chapter-04/bg/bg08-phone-shop.png`, `chapter-01/char/an/an-neutral.png`, `chapter-04/char/shop-assistant/shop-assistant-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt politely points at one of two blank documents on checkout counter while female shop assistant bob hair mint polo looks down attentively and holds a pen ready to check. Medium close two-shot focused on documents and facial expressions. No cash exchange or visible selected phone. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc04-following-renewal.png</summary>

Tham chiếu: `chapter-01/bg/bg01b-study-corner.png`, `chapter-01/char/an/an-neutral.png`, `chapter-02/char/co-linh/co-linh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt seated at study desk uses plain calendar and blank receipt alongside a phone placed FACE DOWN so model is not visible; Co Linh glasses blue blouse listens as An explains. Calm thoughtful medium two-shot, no cancellation checkmark. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

## Cấu trúc

```text
chapter-04/
  bg/
  scene/
  char/an/
  char/minh/
  char/co-linh/
  char/shop-assistant/
  asset-mini-game/smart-shopping/
  props/
  README.md
```

Đường dẫn frontend: `/images/finteen-v2/chapter-04/` cộng đường dẫn tương đối dưới đây. Các ảnh dùng lại được sao chép vào chương để thư mục tự đầy đủ.

## Context

Theo GDD v2 mục 5.4: An 16 tuổi, có 2.500.000đ; điện thoại cũ hỏng pin và không còn cập nhật ứng dụng học. An muốn mua máy đủ nhu cầu, tổng chi phí năm đầu tối đa 2.000.000đ, giữ ít nhất 500.000đ cho hoạt động trường. Đây là tình huống độc lập, không mang số dư hoặc giao dịch chương 3 sang.

Nội dung chương này là Smart Shopping trong v2. Bộ ảnh không thay đổi mini-game lịch học/ca làm thuộc phiên bản nội dung cũ trong dự án.

## Ánh xạ bốn cảnh

| Cảnh | Nền | Cách ghép |
| --- | --- | --- |
| CH04_SC01 — Nhu cầu thật | BG08 | An trung tính/suy nghĩ, Minh rủ rê, nhân viên giải thích. Dùng ba ảnh máy trên các thẻ A/B/C; dữ kiện nhu cầu, pin, bảo hành và thanh toán là UI riêng. |
| CH04_SC02 — So cả năm sử dụng | BG08 | An suy nghĩ, nhân viên giải thích. Mở Smart Shopping; có thể ẩn sprite để dành chỗ bảng so sánh. Icon pin mở thông tin kiểm tra; icon lịch mở điều kiện dùng thử và hủy. |
| CH04_SC03 — Thanh toán và kiểm tra hóa đơn | BG08 | Dùng quầy thu ngân trong nền, An trung tính rồi lo lắng/suy nghĩ và nhân viên giải thích. Bộ chứng từ mở hai thẻ báo giá/hóa đơn trong UI; nội dung được cập nhật theo máy đã chọn. |
| CH04_SC04 — Sau mua và ngày gia hạn | BG07 | An suy nghĩ/nhẹ nhõm, cô Linh giải thích/động viên. Ghép máy đã mua, bộ chứng từ và lịch nhắc. Ending giữ nền này và đổi biểu cảm. |

Các nhánh dùng góc nền phù hợp và sprite biểu cảm theo kết quả; tranh scene minh họa thời điểm kể chuyện, không tự xác định ending.

## Background gốc — 2 ảnh

| File | Kích thước | Cách dùng |
| --- | --- | --- |
| `bg/bg08-phone-shop.png` | 1672 × 941 | Cửa hàng điện thoại, quầy thanh toán, khoảng trống ghép nhân vật. Cảnh 1–3. |
| `bg/bg07-study-desk.png` | 1672 × 941 | Góc bàn học dùng lại chương 3. Cảnh 4 và ending. |

Bảng treo phía sau BG08 có hình máy trang trí; đó không phải bảng lựa chọn tương tác. Dựng bảng so sánh ba máy A/B/C thành lớp UI phía trước, không ánh xạ các hình trên tường thành lựa chọn. Vật trang trí bàn học không mang mục tiêu chương trước sang.

## Nhân vật — 11 ảnh

| File trong `char/` | Kích thước | Gắn ở đâu |
| --- | --- | --- |
| `an/an-neutral.png` | 1792 × 2400 | Nhận dữ kiện, xem máy, chuẩn bị thanh toán. |
| `an/an-thinking.png` | 1084 × 1451 | So tổng chi, xem điều kiện, đối chiếu phí. |
| `an/an-worried-money.png` | 1792 × 2400 | Nhận ra vượt mục tiêu chi hoặc khoản phí bất thường. |
| `an/an-relieved.png` | 1084 × 1451 | Hoàn thành kế hoạch phù hợp và xử lý chứng từ. |
| `minh/minh-neutral.png` | 1792 × 2400 | Trò chuyện tại cửa hàng. |
| `minh/minh-inviting.png` | 1792 × 2400 | Rủ chọn mẫu C giống bạn bè, cảnh 1. |
| `co-linh/co-linh-neutral.png` | 1084 × 1451 | Lắng nghe phần suy ngẫm cuối chương. |
| `co-linh/co-linh-explaining.png` | 1084 × 1451 | Phản hồi về đánh đổi, chứng từ và thuê bao. |
| `co-linh/co-linh-encouraging.png` | 1084 × 1451 | Động viên sau điều chỉnh kế hoạch/ending. |
| `shop-assistant/shop-assistant-neutral.png` | 1084 × 1451 | Chào và lắng nghe nhu cầu. |
| `shop-assistant/shop-assistant-explaining.png` | 1084 × 1451 | Giới thiệu điều kiện, kiểm tra hóa đơn và xác nhận chỉnh phí. |

Nhân viên là người bán hàng trong tình huống, không dùng vẻ ngoài để kết luận lừa đảo. Hai pose giữ cùng tóc bob, áo polo mint và bảng tên trống.

## Smart Shopping — 5 ảnh

Tất cả 1254 × 1254, nền trong suốt. File trong `asset-mini-game/smart-shopping/`:

| File | Cách dùng |
| --- | --- |
| `phone-a-new.png` | Máy A mới, viền mint; thẻ so sánh và máy sau mua nếu chọn A. |
| `phone-b-used.png` | Máy B đã qua sử dụng, viền coral, nút home; vẫn nguyên vẹn. Không suy ra pin tốt chỉ từ ảnh. |
| `phone-c-premium.png` | Máy C nhiều tính năng hơn nhu cầu, viền tím. Không thêm huy hiệu đúng/sai theo mẫu máy. |
| `battery-repair-inspection.png` | Mở dữ kiện pin, khả năng sửa chữa, tuổi thọ; không phải kết quả đã kiểm tra đạt. |
| `renewal-calendar.png` | Nhắc đọc ngày hết dùng thử/gia hạn/hủy. Lịch thật, ngày và nút hủy do UI dựng. |

| Máy/phương án | Giá máy | Điều kiện và tổng năm đầu theo tình huống |
| --- | --- | --- |
| A, hủy trước gia hạn | 1.600.000đ | Bảo hành 12 tháng, dùng thử một tháng; hủy đúng hạn thì tổng 1.600.000đ. |
| A, giữ thuê bao đủ năm | 1.600.000đ | 11 tháng × 50.000đ = 550.000đ; tổng 2.150.000đ, vượt mục tiêu năm đầu. |
| B | 1.300.000đ | Bảo hành 6 tháng; đọc biên bản pin và điều kiện máy cũ/sửa chữa. |
| C | 2.300.000đ | Cả ba máy chạy được ứng dụng học; C vượt nhu cầu và mục tiêu chi đã đặt. |

Tên A/B/C, giá, bảo hành và điều kiện là chữ UI. Không chấm “máy cũ luôn tốt hơn”; đánh giá dựa trên nhu cầu, phép tính và bằng chứng.

## Đạo cụ — 2 ảnh

Cả hai 1254 × 1254, nền trong suốt.

| File | Gắn ở đâu |
| --- | --- |
| `props/shopping-budget-envelope.png` | Minh họa 2.500.000đ đầu chương, mục tiêu giữ 500.000đ; số tiền do UI hiển thị. |
| `props/receipt-and-quotation.png` | Icon mở hai chứng từ ở cảnh 3, lưu chứng từ tại cảnh 4. Giấy trống là minh họa, không thay thế văn bản tương tác. |

## Lưu ý tích hợp và tiền

- Cảnh 2 chỉ chọn/so sánh, chưa trừ tiền. Cảnh 3 xác nhận mua mới trừ một lần: A 1.600.000đ, B 1.300.000đ, C 2.300.000đ; còn lần lượt 900.000đ, 1.200.000đ, 200.000đ trước các phí khác.
- Hóa đơn xuất hiện khoản 100.000đ chưa có trong báo giá: chưa tự trừ phí. Nhánh hỏi qua kênh chính thức lưu hai bản và được sửa chứng từ theo kịch bản; nhánh đồng ý trả thêm mới trừ 100.000đ.
- Đặt nhắc hủy chưa đồng nghĩa đã hủy thành công. UI cần thể hiện hành động hủy đúng hạn và trạng thái xác nhận trước khi kết luận không phát sinh thuê bao.
- Với A giữ thuê bao, chỉ trừ 50.000đ ở từng tháng đã đi qua; 550.000đ là tổng dự báo năm đầu, không trừ thêm cả khoản đó lần nữa.
- Điều kiện đổi trả, bảo hành và xử lý phí là giả định hiển thị của tình huống. Không suy ra quyền bồi thường hay quy định pháp luật từ hình ảnh.
- Ending dùng BG07: An nhẹ nhõm hoặc suy nghĩ với cô Linh. Áp dụng đầy đủ điều kiện GDD, ưu tiên kiểm tra Recovery; không quyết định ending chỉ từ máy đã chọn hoặc biểu cảm.
- Dùng contain cho sprite/icon, giữ alpha và canh chân theo chiều cao hiển thị. Nền dùng cover; chừa vùng hộp thoại phía dưới. Không kéo giãn ảnh máy.
- Đây là bộ tài nguyên bàn giao và ghi chú, chưa tích hợp vào luồng game hoặc sửa logic.

## Nguồn ảnh và kiểm tra

12 ảnh dùng lại nguyên bản:
- 9 sprite An, Minh, cô Linh: cùng đường dẫn trong `../chapter-02/char/`.
- BG07: `../chapter-03/bg/bg07-study-desk.png`.
- Lịch: `../chapter-02/asset-mini-game/savings-race/month-calendar.png`.
- Phong bì: `../chapter-01/props/allowance-envelope.png`.

8 ảnh bổ sung bằng **imagegen tích hợp**: BG08, hai pose nhân viên, ba điện thoại, icon kiểm tra pin và bộ chứng từ. BG08 chỉnh từ `../chapter-01/bg/bg02-headphone-shop.png`; nhân viên dùng cô Linh trung tính làm tham chiếu phong cách, pose giải thích giữ nhận dạng nhân viên mới. Máy B/C tham chiếu máy A để đồng bộ góc nhìn và tỉ lệ.

Đã mở đủ PNG, kiểm tra kích thước và xác nhận 18 ảnh tiền cảnh có pixel trong suốt. Thư mục bàn giao hiện chứa 26 ảnh và README này; không kèm preview hoặc JSON.

## Prompt tạo ảnh

<details>
<summary>bg/bg08-phone-shop.png</summary>

```text
Use case: precise-object-edit. Edit reference shop into ONE landscape 16:9 visual novel BG08 PHONE SHOP background. Preserve warm mint/cream wood interior, clean kawaii cartoon 2D outlines, soft cel shading, daylight and welcoming mood. Replace headphone racks and case-heavy displays with modest smartphone display stands and a few accessories. Keep a clearly visible checkout counter at rear right with a small payment terminal and blank paper slip. Add a blank cream comparison display board on rear wall. Empty clear lower foreground for separate character sprites and dialogue. No people anywhere. No brands, text, letters, prices, numbers, advertisements, installment offers, logos or watermark. Phones screens are blank soft blue. Full bleed single environment.
```

</details>

<details>
<summary>char/shop-assistant/shop-assistant-neutral.png</summary>

```text
Use case: illustration-story. Reference is STYLE ONLY. Create one full-body Vietnamese female phone-shop assistant around 25, distinct from reference teacher: short dark bob haircut ending at chin, no glasses, warm brown eyes, friendly calm closed-mouth smile. Mint short sleeve polo with blank cream badge, dark teal straight trousers, cream sneakers. Relaxed hands together at waist. Match kawaii chibi cartoon 2D proportions, warm brown outlines, blush and soft cel shading of reference. Entire body including shoes centered with margins. Real transparent alpha background. No text, logos, props, floor shadows, checkerboard or scenery. Professional approachable expression, no exaggerated sales grin.
```

</details>

<details>
<summary>char/shop-assistant/shop-assistant-explaining.png</summary>

```text
Use case: identity-preserve. Edit this exact shop assistant into one explaining pose, preserving face, bob hairstyle, mint polo, blank cream badge, dark teal trousers, cream sneakers, chibi proportions and rendering. Friendly speaking smile. One hand open palm gesturing towards a product off frame; other hand holds a plain cream receipt at waist, entirely blank. Full body head to shoes centered with margins, matching reference scale. Real transparent alpha background. No backdrop, checkerboard, text, numbers, logos, money, success symbols or floor shadow.
```

</details>

<details>
<summary>asset-mini-game/smart-shopping/phone-a-new.png</summary>

```text
Use case: illustration-story. One square transparent game item sprite: a single NEW BASIC SMARTPHONE, mint green rounded frame, modest simple design, small centered camera at top, blank pale blue screen with simple soft diagonal reflection. Near frontal slightly three-quarter view, standing vertically, whole phone centered with generous margins. Kawaii cartoon 2D, chunky warm dark-brown outline, soft flat cel shading, cream/mint pastel palette matching Vietnamese chibi educational visual novel. No hands, people, box, accessories, labels, letters, numbers, app icons, price, logo, stars, approval ticks, floor shadow or background. Real alpha transparency. This is neutral product option A, do not signal correct answer.
```

</details>

<details>
<summary>asset-mini-game/smart-shopping/phone-b-used.png</summary>

```text
Use case: precise-object-edit. Make a distinct OPTION B used smartphone sprite matching reference A's exact illustration style, camera angle and scale. Change mint frame to muted peach/coral, use slightly thicker cream bezel and a small oval home button in bottom bezel to distinguish an older model. Screen blank pale blue with gentle reflection. Phone well cared for and fully intact: no cracks, damage, dirt or low-battery symbols. Full single phone centered, square canvas. Preserve kawaii cartoon 2D warm brown outlines and soft cel shading. Actual alpha transparent background. No labels, letters, numbers, brand, price, badge, checkmark, people or floor shadow.
```

</details>

<details>
<summary>asset-mini-game/smart-shopping/phone-c-premium.png</summary>

```text
Use case: precise-object-edit. Make distinct OPTION C premium-feature smartphone using reference A same angle, canvas, scale and warm brown cartoon outlines. Change frame to soft lavender, thinner bezels with a neat narrow pill camera at top of screen and slightly squared rounded corners. Keep blank pale blue screen soft diagonal reflection. One intact modern phone, no additional objects. Neutral visual treatment equally attractive as A, no sparkles, luxury aura, crown, checkmarks or value judgments. Kawaii cartoon 2D cel shading. Entire phone centered square canvas generous margins. Real alpha transparent background, no text, numbers, price, brand, people, backdrop or floor shadow.
```

</details>

<details>
<summary>asset-mini-game/smart-shopping/battery-repair-inspection.png</summary>

```text
Use case: illustration-story. One square game item illustration for inspecting smartphone battery and repairability: a small generic mint rectangular phone battery beside a short cream handled precision screwdriver and a magnifying glass, compact coherent still life. Battery has plain face with no charge gauge, no percent, no plus minus symbols, no warning or checkmark. Kawaii cartoon 2D rounded chunky shapes, clean warm dark brown outlines, soft flat cel shading, pastel mint cream coral. Entire arrangement centered with generous margins. Real alpha transparent background. No people, hands, text, digits, brand, scenery, floor shadow, frame or watermark. Neutral inspection tool, not proof the battery has passed.
```

</details>

<details>
<summary>props/receipt-and-quotation.png</summary>

```text
Use case: illustration-story. ONE square transparent game prop illustration: a cream purchase quotation sheet on a mint clipboard with a long narrow cream receipt laid alongside, both faces entirely blank, and one small coral paperclip. Two documents clearly distinct within a single compact coherent arrangement, slight three-quarter angle, large clean blank paper surfaces. Kawaii cartoon 2D, rounded shapes, warm dark brown outlines, soft cel shading, cream mint coral palette matching chibi financial-learning game. Intended as icon opening an evidence-comparison UI, not a readable invoice itself. No text, ruled fake writing, numbers, currency, stamps, tick, signature, brand, money, people, hands, floor shadow, backdrop or watermark. Entire arrangement centered with ample margins and true alpha transparency.
```

</details>

