# Chương 1 — Tiền đầu tiên: hướng dẫn sử dụng ảnh

<!-- chibi-age-update -->
## Cập nhật tạo hình ngày 03/10/2026

**Tất cả nhân vật đều chibi.** An/Minh trong tình huống này là **14 tuổi** theo GDD v2. Khác tuổi thể hiện qua quần áo và nét mặt; giữ tỷ lệ cơ thể chibi nhất quán, không dùng tăng chiều cao để phân biệt tuổi. Mẹ/cô/NPC dùng mẫu người lớn chibi cố định giữa các chương.

Đã thay **9 sprite và 3 tranh scene** bằng imagegen tích hợp tại đúng đường dẫn cũ. Các sprite giữ nền trong suốt. Xem [manifest kích thước và checksum hiện tại](../character-age-manifest.json), [quy tắc tạo hình](../README.md) và [nguồn độ tuổi](../../../../docs/finteen-v2-character-ages.md).

Thông tin nguồn tái sử dụng, kích thước và prompt cũ bên dưới là lịch sử của đợt tạo trước, được cập nhật này thay thế đối với **nhân vật và tranh scene**. Các hướng dẫn bối cảnh, đạo cụ, mini-game và tình huống vẫn dùng được. Bộ art này chưa được tích hợp thêm vào gameplay trong đợt sửa hình.
<!-- /chibi-age-update -->

Bộ ảnh theo GDD v2, phong cách kawaii cartoon 2D. **Hiện có 24 PNG: 5 background, 3 tranh scene hoàn chỉnh và 16 ảnh nhân vật/mini-game/đạo cụ.** Đợt bổ sung này thêm 2 góc nền và 3 tranh kể chuyện bằng imagegen tích hợp, giữ nguyên các ảnh đã có.

## Background và scene bổ sung — hướng dẫn sử dụng hiện tại

SC01: toàn phòng khách → góc bàn gia đình → tranh nhận tiền. SC02: toàn cửa hàng → quầy tai nghe → tranh cân nhắc. SC03: góc bàn học → tranh kiểm tra ưu tiên; khi chấm nhánh dùng sprite biểu cảm tương ứng.

| File mới | Gắn vào đâu |
| --- | --- |
| `bg/bg01c-family-table.png` | SC01: góc bàn trao tiền, chuyển từ nền phòng khách toàn cảnh. |
| `bg/bg02b-headphone-display.png` | SC02: cận quầy tai nghe khi kiểm tra món đồ và ưu tiên. |
| `scene/sc01-receiving-allowance.png` | SC01: mẹ trao khoản tiền đầu chương, chưa thể hiện chi tiêu. |
| `scene/sc02-headphone-temptation.png` | SC02: Minh rủ xem tai nghe trước lựa chọn mua/hoãn. |
| `scene/sc03-checking-priorities.png` | SC03: kiểm tra nhu cầu, mục tiêu lớp vẽ; dùng trước kết quả nhánh. |

- `bg/` là nền không có nhân vật, dùng cùng sprite khi thoại, chọn đáp án hoặc chơi mini-game. Các góc cận có bàn/quầy chiếm tiền cảnh: dùng chân dung nửa người hoặc ẩn sprite để tránh chân xuyên bàn.
- `scene/` là tranh đã có nhân vật và hành động. Dùng làm tranh dẫn cảnh/chuyển nhịp; ẩn sprite rời khi hiện tranh để không trùng nhân vật. Có thể chuyển về góc nền tương ứng khi người chơi bắt đầu thao tác.
- Các tranh dùng cùng nhận dạng tóc, màu áo và phong cách chibi của bộ đã duyệt. Độ tuổi tình huống vẫn giới thiệu theo GDD.
- Chữ, giá, công thức, ngày và trạng thái lựa chọn do UI hiển thị. Lưới lịch, nét giấy hoặc hình sản phẩm trong tranh chỉ minh họa, không lấy làm dữ liệu kiểm tra hoặc vùng bấm cố định.
- Các scene không chốt kết quả nhánh. Khi hiển thị hậu quả/ending, dùng dữ liệu và biểu cảm riêng theo lựa chọn thực của người chơi.
- Toàn bộ ảnh mới là tranh ngang có nền kín, không cần alpha. Chưa tích hợp vào gameplay; đây là hướng dẫn ghép cho bước triển khai.

### Prompt bổ sung (imagegen tích hợp)

<details>
<summary>bg/bg01c-family-table.png</summary>

Tham chiếu: `chapter-01/bg/bg01-living-room-afternoon.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New intimate eye-level view across family coffee table toward sofa and sunlit window. Blank cream envelope, simple sketchbook and pencil on table, no laptop. Familiar home layout, foreground space for dialogue sprites. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>bg/bg02b-headphone-display.png</summary>

Tham chiếu: `chapter-01/bg/bg02-headphone-shop.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New close oblique view along headphone shop display counter, two modest headphones on stands, blank small price cards, accessory shelves behind. Clear counter surface for inspect UI. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc01-receiving-allowance.png</summary>

Tham chiếu: `chapter-01/bg/bg01-living-room-afternoon.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/me/me-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An in yellow shirt receives a plain cream envelope from his mother in mustard headscarf and brown apron across their living room table. Warm attentive interaction, mother gently explaining, An listening. Medium two-shot at seated eye level, envelope between hands. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc02-headphone-temptation.png</summary>

Tham chiếu: `chapter-01/bg/bg02-headphone-shop.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/minh/minh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and Minh navy polo stand at headphone display in familiar shop. Minh enthusiastically gestures to headphones on a stand while An thoughtfully pauses with hand near chin. Three-quarter medium two-shot, no purchase, no handing over money. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc03-checking-priorities.png</summary>

Tham chiếu: `chapter-01/bg/bg01b-study-corner.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/me/me-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt sits at study desk comparing his existing intact headphones with sketchbook and a blank desk calendar, mother in mustard headscarf stands beside him supportively. An holds pencil above notebook, thoughtful not celebratory. Over-desk medium view. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

## Cấu trúc và đường dẫn

```text
chapter-01/
  bg/
  scene/
  char/an/
  char/minh/
  char/me/
  asset-mini-game/needs-or-wants/
  props/
  README.md
```

Đường dẫn dùng trong frontend: `/images/finteen-v2/chapter-01/` cộng với tên file tương đối bên dưới. Ví dụ: `/images/finteen-v2/chapter-01/char/an/an-neutral.png`.

## Context và ánh xạ cảnh

An 14 tuổi nhận 500.000đ, cần giữ 300.000đ cho lớp vẽ ngày 28. Tai nghe hiện tại vẫn hoạt động, nhưng Minh rủ An mua tai nghe mới.

| Cảnh | Background | Nhân vật và nội dung |
| --- | --- | --- |
| CH01_SC01 — Nhận tiền và xác định ưu tiên | `bg/bg01-living-room-afternoon.png` | An, mẹ và phong bì. Minh xuất hiện qua tin nhắn, không đứng trong phòng. |
| CH01_SC02 — Món đồ đang giảm giá | `bg/bg02-headphone-shop.png` | An và Minh; mẹ nhắn tin. Hình tai nghe dùng trong phần xem dữ kiện / so sánh. |
| CH01_SC03 — Kiểm tra nhu cầu và chốt mục tiêu | `bg/bg01b-study-corner.png` | An và mẹ; mini-game Needs or Wants, reflection và ending. |

BG01B là góc bàn học trong cùng căn nhà, biến thể của BG01 mà GDD dùng cho scene 3; không thêm cảnh truyện thứ tư. Ending dùng lại nền cảnh 3 và thay biểu cảm, không cần ảnh ending riêng.

## Background gốc — 3 ảnh

| File trong `bg/` | Cách dùng | Kích thước |
| --- | --- | --- |
| `bg01-living-room-afternoon.png` | Phòng khách buổi chiều, cảnh nhận tiền từ mẹ. | 2752 × 1536 |
| `bg02-headphone-shop.png` | Cửa hàng phụ kiện, cảnh cân nhắc mua tai nghe. | 1672 × 941 |
| `bg01b-study-corner.png` | Góc bàn học, chốt mục tiêu, mini-game và ending. Lịch để trống để thêm ngày bằng UI. | 1672 × 941 |

## Nhân vật — 9 ảnh

| File trong `char/` | Cách dùng | Kích thước |
| --- | --- | --- |
| `an/an-neutral.png` | An lắng nghe, đọc dữ kiện ở cảnh 1 và đầu cảnh 2. | 1792 × 2400 |
| `an/an-thinking.png` | An tính tổng giá, cân nhắc lựa chọn hoặc sửa kế hoạch ở cảnh 2–3. | 1084 × 1451 |
| `an/an-relieved.png` | An nhẹ nhõm khi giữ đủ tiền cho lớp vẽ; cảnh 3 / ending A. | 1084 × 1451 |
| `an/an-worried-money.png` | An nhận ra khoản thiếu sau khi mua ngay; cảnh 3 / ending C. Tiền trên tay chỉ là minh họa. | 1792 × 2400 |
| `minh/minh-neutral.png` | Minh trò chuyện bình thường hoặc chấp nhận việc An hoãn mua. | 1792 × 2400 |
| `minh/minh-inviting.png` | Minh rủ An mua tai nghe ở cảnh 2. Không dùng như thái độ chế giễu. | 1792 × 2400 |
| `me/me-neutral.png` | Mẹ lắng nghe, trao đổi ở cảnh 1 và 3. | 1792 × 2400 |
| `me/me-explaining.png` | Mẹ giải thích khoản tiền có mục đích ở cảnh 1, hướng dẫn ở cảnh 3. | 1792 × 2400 |
| `me/me-concerned.png` | Mẹ quan tâm khi An còn thiếu tiền hoặc cần khắc phục ở cảnh 3. | 1792 × 2400 |

### Gợi ý theo nhánh

- **Mua ngay:** chi 250.000đ, còn 250.000đ, thiếu 50.000đ cho lớp vẽ. Dùng An lo lắng khi nhận ra khoản thiếu; mẹ có thể dùng nét quan tâm.
- **Hoãn mua / so giá rồi hoãn:** An suy nghĩ lúc cân nhắc và nhẹ nhõm khi xác nhận giữ đủ tiền.
- **Ending A:** An nhẹ nhõm, mẹ trung tính. **Ending B:** An suy nghĩ về kế hoạch điều chỉnh khả thi. **Ending C:** An lo khoản tiền còn lại, mẹ quan tâm.
- Điều kiện ending theo logic GDD, không suy từ hình. Tên ảnh thể hiện cảm xúc, không gán tính cách hoặc đạo đức cho người chơi.

## Mini-game — 6 ảnh

Thư mục: `asset-mini-game/needs-or-wants/`. Mỗi ảnh 1254 × 1254, dùng cho một thẻ độc lập.

| File | Nội dung thẻ và lưu ý |
| --- | --- |
| `01-meal.png` | Bữa ăn chính hằng ngày. |
| `02-bus-ticket.png` | Vé xe cho việc di chuyển cần thiết trong hoàn cảnh đã nêu. |
| `03-art-class-booking.png` | Phí lớp vẽ đã đăng ký, một khoản cam kết cần thanh toán. Không đồng nghĩa mọi lớp học thêm đều là nhu cầu bắt buộc. |
| `04-replacement-headphones.png` | Tai nghe thay thế khi thiết bị cũ hỏng và cần cho mục đích sử dụng được nêu trên thẻ. |
| `05-upgrade-headphones.png` | Tai nghe nâng cấp khi thiết bị cũ vẫn đáp ứng nhu cầu. Cũng dùng minh họa sản phẩm muốn mua ở cảnh 2. |
| `06-desk-decoration.png` | Tượng mèo trang trí bàn, không phải thú nuôi hay heo tiết kiệm. |

- Phân loại theo hoàn cảnh trên thẻ, không gắn sẵn đáp án chỉ dựa vào hình.
- Tai nghe thay thế là một đôi còn hoạt động. Việc thiết bị cũ bị hỏng là **tình huống giả định riêng của thẻ**, không thay đổi tình tiết truyện rằng tai nghe của An vẫn dùng được.
- Hình tai nghe cơ bản cũng có thể minh họa thiết bị hiện tại trong phần xem dữ kiện của cốt truyện; ghi rõ hoàn cảnh bằng chữ.
- Dấu đánh dấu trên phiếu lớp vẽ thể hiện đã đăng ký, không phải dấu đáp án đúng.

## Đạo cụ — 1 ảnh

`props/allowance-envelope.png` — 1254 × 1254, phong bì minh họa khoản tiền nhận ở cảnh 1. Không có mệnh giá cố định; hiển thị số tiền bằng UI.

## Quy tắc ghép ảnh

- Nền gần 16:9, dùng `object-fit: cover`. Nhân vật và vật phẩm dùng `object-fit: contain`, giữ tỷ lệ và căn nhân vật theo bàn chân.
- 16 ảnh foreground (nhân vật, mini-game, phong bì) đã kiểm tra có alpha trong suốt thật. Giữ alpha khi đổi định dạng.
- Gợi ý bố cục: An ở phải, nhân vật đối thoại ở trái; chừa phía dưới cho hộp thoại. Có thể đảo vị trí theo giao diện.
- Chữ và số hiển thị bằng UI: số dư 500.000đ, mục tiêu 300.000đ, ngày 28; giá trong nước 250.000đ; báo giá trực tuyến 8 USD, tỷ giá giả lập 25.000đ/USD, phí 20.000đ, tổng 220.000đ.
- Lịch trên bàn để trống có chủ đích; thêm ngày 28 bằng phần mục tiêu / lịch tương tác. Không ghi cứng vào ảnh nền.
- Tiền trên sprite hoặc phong bì chỉ mang tính tượng trưng; không tính số dư từ số tờ tiền trong tranh.
- Giữ cùng nhận dạng An: tóc nâu đậm, áo vàng, quần xanh, dép trắng. Các biểu cảm mới tham chiếu trực tiếp mẫu trung tính.
- Tỷ lệ chibi giữ theo bộ ảnh đã duyệt. Độ tuổi và hoàn cảnh thể hiện bằng phần giới thiệu chương.

## Nguồn ảnh dùng lại

Đã rà 223 ảnh trong 8 thư mục chương thuộc `D:/DO-AN`. Các bản gốc được giữ nguyên. Tên vai trong bộ mới theo GDD: An dùng mẫu Tí cũ, Minh dùng mẫu Hùng cũ, mẹ dùng mẫu mẹ Tí.

| File trong bộ mới | File gốc |
| --- | --- |
| `bg/bg01-living-room-afternoon.png` | `D:/DO-AN/chương-7/background/phân-tích-khoản-vay.png` |
| `char/an/an-neutral.png` | `D:/DO-AN/chuong-1/Ti/bình-thường.png` |
| `char/an/an-worried-money.png` | `D:/DO-AN/chuong-1/Ti/bối-rối.png` |
| `char/minh/minh-neutral.png` | `D:/DO-AN/chuong-1/Hung/bình-thường.png` |
| `char/minh/minh-inviting.png` | `D:/DO-AN/chuong-1/Hung/đắc-ý.png` |
| `char/me/me-neutral.png` | `D:/DO-AN/chuong-1/ME-TI/binh-thương.png` |
| `char/me/me-explaining.png` | `D:/DO-AN/chuong-1/ME-TI/dạy-dỗ.png` |
| `char/me/me-concerned.png` | `D:/DO-AN/chuong-1/ME-TI/lo-lăng.png` |

Ảnh tạo bổ sung: hai nền cửa hàng / góc bàn học, hai biểu cảm An suy nghĩ / nhẹ nhõm, sáu hình mini-game và phong bì. Góc bàn học tham chiếu căn phòng khách; giữ nét vẽ cartoon 2D và tách chữ, số khỏi ảnh.

## Phạm vi bàn giao

Chỉ gồm bộ ảnh chương 1, chưa thay vào gameplay đang chạy. Logic tiền, lựa chọn, điểm số và ending triển khai riêng theo GDD v2. Các file preview và JSON phục vụ tạo / kiểm tra đã được dọn; ghi chú sử dụng tập trung trong file này.

## Công thức lắp cảnh hoàn chỉnh cho AI

Khởi tạo: `scenarioMoney=500000`, `reservedForArtClass=300000`, `headphonePrice=250000`, `oldHeadphonesWorking=true`. Không mang state từ gameplay Tí hoặc chương khác vào.

| Beat | Chế độ và lớp ảnh | Nội dung/điểm chuyển |
| --- | --- | --- |
| SC01-A | `scene/sc01-receiving-allowance.png`, không sprite | Establishing: mẹ trao phong bì, chưa trừ tiền. |
| SC01-B | `bg/bg01c-family-table.png` + mẹ `explaining` trái + An `neutral` phải + prop phong bì | UI hiện 500.000đ, cam kết lớp vẽ 300.000đ ngày 28. Minh chỉ xuất hiện dưới dạng tin nhắn. |
| SC02-A | `scene/sc02-headphone-temptation.png`, không sprite | Chuyển địa điểm; tranh chỉ cho thấy lời mời, không khẳng định đã mua. |
| SC02-B | `bg/bg02-headphone-shop.png` hoặc góc cận `bg02b` + Minh `inviting` trái + An `thinking` phải | Hiện dữ kiện tai nghe cũ còn dùng được; mở lựa chọn mua ngay / so giá / hoãn. Dùng thẻ `05-upgrade-headphones.png` cho món muốn mua. |
| SC02-C | cùng nền + panel so sánh | Báo giá nội địa 250.000đ; online `8×25.000+20.000=220.000đ`. So giá không tự mua. Chỉ nút xác nhận mua mới tạo transaction. |
| SC03-A | `scene/sc03-checking-priorities.png`, không sprite | Nhịp suy ngẫm trước mini-game, chưa hiển thị ending. |
| SC03-B | `bg/bg01b-study-corner.png` + An `thinking` + mẹ `explaining` | Needs or Wants dùng 6 ảnh theo từng thẻ; câu chữ hoàn cảnh quyết định đáp án, không phải pixel. |
| SC03-C | cùng nền + sprite theo kết quả | Mua ngay: An `worried-money`, mẹ `concerned`, còn 250.000đ và thiếu 50.000đ. Hoãn: An `relieved`, mẹ `neutral`, vẫn đủ quỹ. Nhánh sửa dùng An `thinking`. |

Effect phải có ID như `ch01.purchase_headphones`; chỉ áp dụng một lần. Ending lấy từ state lựa chọn + số dư + bước recovery, không lấy từ sprite. Scene kết không cần ảnh mới: dùng BG01B, biểu cảm và bảng recap HTML.

### Kiểm thử bắt buộc

- Minh không xuất hiện vật lý trong SC01; mẹ không đứng trong cửa hàng nếu chỉ nhắn tin.
- `scene/*.png` không bị chồng sprite.
- Hoãn/so giá không làm giảm tiền; mua đúng một lần còn 250.000đ.
- Reload sau mua không trừ thêm; mini-game hỗ trợ bàn phím và giải thích câu sai.
