# 🎭 CHƯƠNG 7 — CHARACTER EMOTION PORTRAITS

> **Mục đích**: Lập gia đình — Quản trị rủi ro & tài sản. Đồng bộ với `chuong-7-backgrounds.md`. Các PNG dưới đây là **đầu ra dự kiến**, chưa phải ảnh đã tạo.
> **COPY-PASTE**: Mỗi khối prompt có đủ style, nhận diện/bối cảnh, ánh sáng, bố cục và negative; copy nguyên khối, không cần ghép mô tả từ prompt khác. Reference chỉ hỗ trợ nhất quán.

# 📖 CỐT TRUYỆN GỐC VÀ PHẠM VI

Nguồn ưu tiên: `D:\DO-AN\cot_truyen\mau\cot-truyen-hoan-chinh-v1.docx`, phần CHƯƠNG 7. Bible chỉ tham khảo tạo hình; giữ style earnest teen/adult 1:4–1:5 của các chương gần nhất, không quay lại chibi 1:2.5.

Chương có 3 nhiệm vụ, không có Life Event. Nhiệm vụ 1 là **đêm trước lễ cưới**, không phải sau lễ cưới. Nhiệm vụ 2 là phân tích khoản vay của hệ thống, không có thoại nhân viên tín dụng. Nhiệm vụ 3 diễn ra sau khi ổn định chỗ ở; không mặc định đã mua căn hộ 2 tỷ. Tí 30 tuổi và vợ 27 tuổi là mốc tạo hình theo bible; giờ/địa điểm nhiệm vụ 2–3 là lựa chọn dàn cảnh. Vợ mặc quần dài để thống nhất với bộ prompt gần nhất. Không thêm nốt ruồi mới cho Tí, không thêm cặp nhẫn trước lễ cưới; bỏ nhẫn nhất quán toàn bộ bộ ảnh chương này. Không vẽ chuyên gia mạng thành người đang ngồi cùng gia đình.

# 📐 KIẾN TRÚC VISUAL NOVEL

| Loại | Cách dùng | Chữ/số |
|---|---|---|
| Thoại / độc thoại | Sprite + BG không người đúng nơi, đúng thời điểm | UI game |
| Narrator | Composite có nhân vật; không ghép sprite chồng lên | UI game |
| Lựa chọn / mini-game | BG trống, điều khiển UI tương tác | Dữ liệu kịch bản/phiên chơi |
| Tiêu đề nhiệm vụ | Nền không người, bảng tiêu đề lớn chính giữa | Chỉ đúng tiêu đề trong prompt |
| Tổng kết | Tranh biểu tượng các bài học, trung tâm thoáng | Đúng ba dòng chữ trong prompt tổng kết ở file backgrounds |

Sprite nền trắng cần tách nền thành PNG trong suốt trước khi dùng. Tất cả người lớn mặc quần dài đến mắt cá. BG không có người, bóng người hay phản chiếu người; composite không cắt đầu/tay/chân bởi mép ảnh. Phòng bình dân sạch, nguyên vẹn. Không gen trạng thái lựa chọn đã hoàn tất trước khi người chơi chọn.

# 🔒 KHÓA STYLE VÀ LIÊN KẾT CẢNH — CHƯƠNG 7

**Style bắt buộc**: Mọi prompt bắt đầu phần style bằng **Kawaii 2D cartoon style**, dùng nét viền vừa, cel-shading mềm và tỷ lệ người lớn 1:4–1:5 như chương 6. Tổng kết cũng cùng nét vẽ này; chỉ bố cục biểu tượng khác cảnh gameplay.

| Chuỗi cảnh | Không gian / ánh sáng | Khóa nối cảnh |
|---|---|---|
| Tiêu đề NV1 → BG wedding_eve → scene wedding_eve | Phòng khách, đêm trước cưới; đèn phải, cửa sổ trái tối | Giữ nguyên phong bì, sổ, bàn ghế; scene chỉ thêm Tí bên trái và vợ tương lai bên phải sofa |
| Tiêu đề NV2 → BG housing → scene housing_dti | Cùng thiết kế phòng khách ở thời điểm bàn mua nhà; ánh sáng ngày từ trái | Bỏ phong bì, đặt laptop và tờ giới thiệu căn hộ; không tự xuất hiện nhân viên ngân hàng |
| Tiêu đề NV3 → BG portfolio → scene portfolio | Phòng khách theo cùng sơ đồ, buổi tối sau khi ổn định chỗ ở | Đổi đúng đạo cụ thành laptop, sổ và hai cốc; không suy ra quyền sở hữu căn hộ từ hình |
| Tổng kết | Tranh biểu tượng, không phải cảnh diễn biến mới | Nhắc lại hai túi tiền/quỹ chung, căn hộ mô hình và đa dạng hóa; giữ style, không mặc định nhánh thắng |

**Sơ đồ chung**: cửa sổ TRÁI → sofa tường SAU → bàn thấp GIỮA → bàn làm việc/tủ/đèn PHẢI → cửa vào SAU-PHẢI. Camera cố định ở góc trước-trái của phòng, nhìn chéo về sofa và tường phải; không lật gương, không đổi cửa sổ/cửa ra vào. Tí ngồi trái, vợ ngồi phải trong cả ba composite. Mỗi tiêu đề dùng đúng geometry/đạo cụ/giờ của BG nhiệm vụ đó.

**Reference**: Tạo và duyệt c7_bg_wedding_eve_empty.png trước để khóa kiến trúc; dùng ảnh này khi gen c7_bg_housing_empty.png và c7_bg_portfolio_empty.png. Mỗi composite/tiêu đề kèm đúng BG của nhiệm vụ; composite kèm c7_ti_thoughtful.png và c7_wife_warm.png đã duyệt để khóa nhận diện. Không dùng ảnh sai tuổi làm mẫu trang phục.

**Chuyển thời điểm**: NV1 là trước cưới; NV2 và NV3 là các mốc sau đó, không phải cùng một đêm. Dùng lời dẫn hiện có để chuyển mốc; không tự vẽ cưới, bàn giao nhà hoặc kết quả đầu tư. Trang phục và phụ kiện giữ theo bộ chuẩn trong file.

# 👕 NHẬN DIỆN, TRANG PHỤC VÀ REFERENCE

## Tí 30 tuổi — `ti`

a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

**Reference**: c6_ti_hopeful.png → c7_ti_thoughtful.png. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

## Vợ tương lai / vợ 27 tuổi — `wife`

a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

**Reference**: Tạo c7_wife_warm.png trước; dùng làm reference cho toàn bộ emotion và scene. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

# 🧩 SỐ LIỆU VÀ MAPPING NHIỆM VỤ

| Nhiệm vụ | Nội dung UI theo Word | Ràng buộc hình ảnh |
|---|---|---|
| 1 | A: gộp 100%, SAVINGS tăng tốc (nguồn không cho số), HAP -10. B: quỹ chung 70%, quỹ riêng 30%, HAP +20, FIQ +25, GOAL +5. | Không đóng dấu phương án đã chọn lên ảnh. |
| 2 | Tích lũy 600 triệu; căn hộ 2 tỷ; vay 1,4 tỷ/20 năm; thu nhập 30 triệu/tháng; trả 14 triệu/tháng, gần 47%. A: sở hữu nhà, RISK +70. B: căn nhỏ hơn hoặc tiếp tục thuê để tỷ lệ dưới 30%, FIQ +35, RISK +10, GOAL +5. | Không gen chìa khóa/nhà mới trước lựa chọn; không tự suy ra lãi suất từ số trả góp. |
| 3 | Vốn nhàn rỗi 200 triệu. A: all-in một mã nóng, nguồn ghi RISK max 90 và tài sản biến động. B: 50% trái phiếu, 30% ETF, 20% cổ phiếu tăng trưởng, FIQ +40, RISK +15. | Không dùng vốn 850 triệu, DCA 5 triệu/tháng hoặc năm 2031 từ bible cũ; không biến tăng trưởng trong kịch bản thành lợi nhuận bảo đảm. |

Số liệu này chép theo kịch bản game, không tự sửa logic hay bổ sung phép tính tài chính ngoài nguồn. Tên nhiệm vụ trên ảnh đánh số **1, 2, 3**, không dùng 7.1/7.2/7.3.

# 🎨 PROMPT NHÂN VẬT — COPY NGUYÊN TỪNG KHỐI

## Tí 30 tuổi — thoughtful (trầm ngâm)

**Output**: `images/chuong-7/c7_ti_thoughtful.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 1–3 trước lựa chọn.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

EXPRESSION THOUGHTFUL: Gently drawn inner brows, attentive eyes, closed neutral mouth; calm deliberation. No face stretching or painted cheek circles.

POSE: Standing upright, one hand lightly touching chin, other arm relaxed.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 30 tuổi — warm (ấm áp)

**Output**: `images/chuong-7/c7_ti_warm.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 1 mở đầu cuộc bàn bạc.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

EXPRESSION WARM: Soft eyes and a small warm smile, relaxed brows. No face stretching or painted cheek circles.

POSE: Standing upright, hands loosely joined near waist.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 30 tuổi — concerned (lo lắng)

**Output**: `images/chuong-7/c7_ti_concerned.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 2 khi đọc tỷ lệ gần 47%.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

EXPRESSION CONCERNED: Slightly knitted brows, worried eyes, lips gently pressed; no sweat caricature. No face stretching or painted cheek circles.

POSE: Standing with one open hand near waist, the other relaxed.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 30 tuổi — tempted (dao động)

**Output**: `images/chuong-7/c7_ti_tempted.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 2 mua ngay hoặc nhiệm vụ 3 all-in.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

EXPRESSION TEMPTED: Interested focused eyes, one subtly raised brow, small uncertain smile. No face stretching or painted cheek circles.

POSE: Standing slightly inclined forward, hands relaxed and visible; no purchase action.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 30 tuổi — explaining (trao đổi)

**Output**: `images/chuong-7/c7_ti_explaining.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 1 quỹ 70/30; nhiệm vụ 3 đa dạng hóa.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

EXPRESSION EXPLAINING: Engaged eyes, gently lifted brows, mouth slightly open as if calmly speaking. No face stretching or painted cheek circles.

POSE: Standing, one open palm at waist level, other hand lowered.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 30 tuổi — determined (quyết tâm)

**Output**: `images/chuong-7/c7_ti_determined.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Sau khi người chơi xác nhận phương án.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

EXPRESSION DETERMINED: Steady eyes, relaxed firm brows, small closed confident smile. No face stretching or painted cheek circles.

POSE: Standing balanced, hands loosely joined; no victory fist.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Vợ tương lai / vợ 27 tuổi — warm (ấm áp)

**Output**: `images/chuong-7/c7_wife_warm.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 1 mở đầu.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

EXPRESSION WARM: Soft attentive eyes, relaxed eyebrows, gentle small smile. No face stretching or painted cheek circles.

POSE: Standing upright, hands loosely joined at waist.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Vợ tương lai / vợ 27 tuổi — explaining (đề xuất)

**Output**: `images/chuong-7/c7_wife_explaining.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 1 đề xuất gộp lương; trao đổi nhiệm vụ 2–3.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

EXPRESSION EXPLAINING: Engaged eyes, gently lifted brows, naturally parted speaking lips. No face stretching or painted cheek circles.

POSE: Standing, one open palm gesturing toward partner outside sprite, other hand relaxed.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Vợ tương lai / vợ 27 tuổi — concerned (băn khoăn)

**Output**: `images/chuong-7/c7_wife_concerned.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 2 áp lực trả góp, nhiệm vụ 3 cân nhắc rủi ro.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

EXPRESSION CONCERNED: Brows gently drawn together, thoughtful worried eyes, closed mouth. No face stretching or painted cheek circles.

POSE: Standing with hands loosely joined, shoulders natural.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Vợ tương lai / vợ 27 tuổi — reassuring (đồng hành)

**Output**: `images/chuong-7/c7_wife_reassuring.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Phản hồi khi cùng cân nhắc, không áp đặt lựa chọn.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

EXPRESSION REASSURING: Soft steady gaze and a small understanding smile. No face stretching or painted cheek circles.

POSE: Standing, one hand open near waist, other relaxed, no contact with an absent person.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

# 📋 BẢNG TỔNG HỢP — 10 SPRITE

| Nhân vật | Emotion | File | Dùng cho |
|---|---|---|---|
| Tí 30 tuổi | thoughtful | `c7_ti_thoughtful.png` | Nhiệm vụ 1–3 trước lựa chọn |
| Tí 30 tuổi | warm | `c7_ti_warm.png` | Nhiệm vụ 1 mở đầu cuộc bàn bạc |
| Tí 30 tuổi | concerned | `c7_ti_concerned.png` | Nhiệm vụ 2 khi đọc tỷ lệ gần 47% |
| Tí 30 tuổi | tempted | `c7_ti_tempted.png` | Nhiệm vụ 2 mua ngay hoặc nhiệm vụ 3 all-in |
| Tí 30 tuổi | explaining | `c7_ti_explaining.png` | Nhiệm vụ 1 quỹ 70/30; nhiệm vụ 3 đa dạng hóa |
| Tí 30 tuổi | determined | `c7_ti_determined.png` | Sau khi người chơi xác nhận phương án |
| Vợ tương lai / vợ 27 tuổi | warm | `c7_wife_warm.png` | Nhiệm vụ 1 mở đầu |
| Vợ tương lai / vợ 27 tuổi | explaining | `c7_wife_explaining.png` | Nhiệm vụ 1 đề xuất gộp lương; trao đổi nhiệm vụ 2–3 |
| Vợ tương lai / vợ 27 tuổi | concerned | `c7_wife_concerned.png` | Nhiệm vụ 2 áp lực trả góp, nhiệm vụ 3 cân nhắc rủi ro |
| Vợ tương lai / vợ 27 tuổi | reassuring | `c7_wife_reassuring.png` | Phản hồi khi cùng cân nhắc, không áp đặt lựa chọn |

# THỨ TỰ GEN VÀ KIỂM TRA

1. Tạo ảnh reference đầu tiên theo bảng nhận diện, kiểm tra tuổi, khuôn mặt, quần dài, tay chân và màu trang phục.
2. Dùng reference đã duyệt cho các emotion còn lại; mỗi prompt vẫn tự đầy đủ.
3. Đối chiếu composite trong `chuong-7-backgrounds.md`; giữ nguyên trang phục và tuổi theo đúng giai đoạn.
4. Tách nền trắng rồi kiểm tra viền tóc, bàn tay, khoảng trống giữa tay/thân và giày trước khi ghép sprite.
5. Kiểm tra đủ 10 file; không đưa sprite vào composite đã có nhân vật.
