# 🎭 CHƯƠNG 8 — CHARACTER EMOTION PORTRAITS

> **Mục đích**: Tương lai — Sau khi sinh con & Tự do tài chính. Đồng bộ với `chuong-8-backgrounds.md`. Các PNG dưới đây là **đầu ra dự kiến**, chưa phải ảnh đã tạo.
> **COPY-PASTE**: Mỗi khối prompt có đủ style, nhận diện/bối cảnh, ánh sáng, bố cục và negative; copy nguyên khối, không cần ghép mô tả từ prompt khác. Reference chỉ hỗ trợ nhất quán.

# 📖 CỐT TRUYỆN GỐC VÀ PHẠM VI

Nguồn ưu tiên: `D:\DO-AN\cot_truyen\mau\cot-truyen-hoan-chinh-v1.docx`, phần CHƯƠNG 8 và HỆ THỐNG KẾT CỤC cuối tài liệu. Bible chỉ tham khảo tạo hình; giữ style earnest teen/adult 1:4–1:5 của các chương gần nhất, không quay lại chibi 1:2.5.

Chương có 3 nhiệm vụ, không có Life Event riêng. Nhiệm vụ 1 là **đọc bài báo rồi suy ngẫm**, không phải tai nạn xảy ra với Tí, không tự thêm đại lý bảo hiểm. Nhiệm vụ 2 có **con 1 tuổi**, còn 17 năm tới đại học. Chốt Tí **40 tuổi** ở nhiệm vụ 1–2 theo hướng tạo hình bible (Word không quy định tuổi cha ở hai nhiệm vụ này); con trai là lựa chọn tạo hình, Word chỉ ghi “con”. Nhiệm vụ 3 chốt **Tí 50 tuổi theo Word**. Sau đó chỉ hiện một ending phù hợp. Không mang sprite Tí 40t sang ending, không mang em bé 1t sang cảnh Tí 50t; không tự thêm vợ/con trưởng thành có thoại. Bộ ảnh ending tập trung Tí, phần con cháu kể bằng UI. Phần mô tả Mission 8.3 nêu S/A/C, nhưng mục HỆ THỐNG KẾT CỤC cuối Word bổ sung B và danh hiệu đầy đủ: dùng đủ S/A/B/C theo phần này.

# 📐 KIẾN TRÚC VISUAL NOVEL

| Loại | Cách dùng | Chữ/số |
|---|---|---|
| Thoại / độc thoại | Sprite + BG không người đúng nơi, đúng thời điểm | UI game |
| Narrator | Composite có nhân vật; không ghép sprite chồng lên | UI game |
| Lựa chọn / mini-game | BG trống, điều khiển UI tương tác | Dữ liệu kịch bản/phiên chơi |
| Tiêu đề nhiệm vụ | Nền không người, bảng tiêu đề lớn chính giữa | Chỉ đúng tiêu đề trong prompt |
| Tổng kết | Tranh biểu tượng các bài học, trung tâm thoáng | Đúng ba dòng chữ trong prompt tổng kết ở file backgrounds |

Sprite nền trắng cần tách nền thành PNG trong suốt trước khi dùng. Tất cả người lớn mặc quần dài đến mắt cá. BG không có người, bóng người hay phản chiếu người; composite không cắt đầu/tay/chân bởi mép ảnh. Phòng bình dân sạch, nguyên vẹn. Không gen trạng thái lựa chọn đã hoàn tất trước khi người chơi chọn.

# 🔒 KHÓA STYLE VÀ LIÊN KẾT CẢNH — CHƯƠNG 8

**Style bắt buộc**: Mọi prompt có **Kawaii 2D cartoon style** đúng hệ nét viền vừa và cel-shading mềm của chương 6–7. Người lớn giữ 1:4–1:5; em bé đúng 1 tuổi dùng tỷ lệ trẻ nhỏ tự nhiên, không ép tỷ lệ người lớn. Tổng kết, BG và ending cùng phong cách, không chuyển sang tranh bán hiện thực.

| Chuỗi cảnh | Không gian / ánh sáng | Khóa nối cảnh |
|---|---|---|
| Tiêu đề NV1 → BG insurance → scene insurance_article | Phòng khách gia đình, tối; Tí 40t đọc bài báo | Cửa sổ trái, sofa sau, bàn thấp giữa; tablet và sổ không đổi giữa BG và scene |
| Tiêu đề NV2 → BG education → scene education_fund | Chính phòng khách đó, cuối chiều; con 1t, Tí 40t | Chỉ đổi giờ/đạo cụ: thêm thảm chơi, laptop và con; không thay cấu trúc phòng hay tuổi con thành 3t |
| Chuyển mốc → tiêu đề NV3 → BG fire → scene fire_reflection | Tí 50t, buổi tối; góc bàn làm việc PHẢI của phòng gia đình | Đây là đổi góc camera sau bước nhảy tuổi; giữ cửa sổ trái, sofa sau, bàn phải, tủ và cửa sau-phải |
| Tổng kết → đúng một ending | Tổng kết biểu tượng trước phân loại; ending sau phân loại | S/A/B/C là bốn nhánh loại trừ nhau, không phải bốn cảnh xảy ra lần lượt |
| Scene ending S/A/B/C | Mỗi nhánh là một tranh hoàn chỉnh có Tí 50 tuổi và bối cảnh riêng | Tạo trực tiếp scene, không tạo BG ending riêng; lời kết và danh hiệu hiển thị bằng UI, không ghép sprite |

**Kế thừa không gian**: Dùng c7_bg_portfolio_empty.png đã duyệt làm reference kiến trúc cho phòng gia đình chương 8. Giữ cửa sổ TRÁI, sofa SAU, bàn thấp GIỮA, bàn làm việc/tủ/đèn PHẢI và cửa SAU-PHẢI. Thêm giỏ đồ chơi là thay đổi đời sống có chủ đích, không tự biến thành căn hộ sang trọng. NV1–2 giữ camera góc trước-trái; NV3 đổi sang góc gần bàn thấp nhìn về bàn làm việc phải, vẫn thấy các mốc kiến trúc để nhận ra cùng nhà.

**Reference theo nhiệm vụ**: c8_bg_insurance_empty.png là mẫu phòng; c8_bg_education_empty.png giữ geometry và đổi ánh sáng/đạo cụ. c8_bg_fire_empty.png dùng cả hai để giữ kiến trúc ở góc máy mới. Scene/tiêu đề nhiệm vụ 1–3 dùng BG tương ứng; scene ending tạo trực tiếp theo bối cảnh trong prompt. Nhân vật: c8_ti40_thoughtful.png cho NV1–2, c8_child1_happy.png chỉ cho NV2, c8_ti50_reflective.png cho NV3 và ending; khuôn mặt già đi có kiểm soát, không thay người.

**Mốc tuổi**: Trước NV3 phải có chuyển thời gian rõ sang 50 tuổi theo nguồn. Không đưa em bé 1 tuổi sang mốc này. Nếu sau này bổ sung con ở mốc 50 tuổi thì cần thiết kế tuổi tương ứng riêng; bộ hiện tại không thêm nhân vật đó. Ending A/B/C tái dùng chi tiết nội thất gia đình khi phù hợp; S là địa điểm du lịch mới được phép xuất hiện sau khi nhánh S được chọn.

# 👕 NHẬN DIỆN, TRANG PHỤC VÀ REFERENCE

## Tí 40 tuổi — `ti40`

a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

**Reference**: c7_ti_thoughtful.png → c8_ti40_thoughtful.png. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

## Con 1 tuổi — `child1`

a 1-year-old Vietnamese baby (Ti's child, visual design chosen as a boy, age-locked one year), healthy natural infant proportions, warm light-beige skin, soft naturally rounded cheeks without painted blush circles, small dark-brown eyes, fine short black hair. Pale-yellow long-sleeve cotton top (#f1d985), pale-yellow full-length soft trousers covering the ankles, cream socks, no shoes or jewelry. Sitting securely with both legs and hands visible, or supported safely on the father's lap; never standing unsupported, never depicted as a three-year-old. Natural infant head-to-body ratio about 1:3 to 1:4, not adult 1:5 and not exaggerated chibi. Keep identical appearance and clothes in sprite and education scene.

**Reference**: Tạo c8_child1_happy.png trước; dùng lại trong composite nhiệm vụ 2. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

## Tí 50 tuổi — `ti50`

a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

**Reference**: c8_ti40_thoughtful.png → c8_ti50_reflective.png. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

# 🧩 SỐ LIỆU VÀ MAPPING NHIỆM VỤ

| Nhiệm vụ | Nội dung UI theo Word | Ràng buộc hình ảnh |
|---|---|---|
| 1 | Đọc khái niệm Premium / Deductible. A: mua bảo hiểm sức khỏe và bảo vệ thu nhập, WEALTH giảm tiền phí hằng năm chưa định lượng, RISK về 0, HAP +30. B: dùng tiền đầu tư lướt sóng, RISK +80. | Giữ đây là cơ chế kịch bản; không tự đặt phí, mức khấu trừ, quyền lợi hoặc vẽ hợp đồng đã ký trước lựa chọn. |
| 2 | Con 1 tuổi; còn 17 năm tới đại học; áp dụng Quy tắc 72 và thiết lập trích quỹ học vấn hằng tháng; FIQ +40, GOAL +10. | Nguồn chưa cho lãi suất, tiền trích, học phí, số dư hay đáp án cụ thể; không tự bịa để in lên hình. UI tương tác nằm ngoài ảnh. |
| 3 | Tí 50 tuổi; hệ thống đọc WEALTH, SAVINGS, FIQ, HAP, RISK, GOAL của cả 8 chương. | Biểu đồ lịch sử và số liệu dùng dữ liệu phiên chơi, không vẽ đường tăng trưởng giả hay chọn trước ending S. |

Số liệu này chép theo kịch bản game, không tự sửa logic hay bổ sung phép tính tài chính ngoài nguồn. Tên nhiệm vụ trên ảnh đánh số **1, 2, 3**, không dùng 8.1/8.2/8.3.

# 🎨 PROMPT NHÂN VẬT — COPY NGUYÊN TỪNG KHỐI

## Tí 40 tuổi — thoughtful (suy ngẫm)

**Output**: `images/chuong-8/c8_ti40_thoughtful.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 1 đọc bài báo; nhiệm vụ 2 lập kế hoạch.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

EXPRESSION THOUGHTFUL: Attentive eyes, gently knitted brows and neutral closed mouth. No face stretching or painted cheek circles.

POSE: Standing, one hand lightly touching chin, other hand lowered.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 40 tuổi — worried (lo xa)

**Output**: `images/chuong-8/c8_ti40_worried.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 1 trước lựa chọn bảo hiểm.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

EXPRESSION WORRIED: Slightly raised inner brows, concerned eyes, lips pressed naturally. No face stretching or painted cheek circles.

POSE: Standing, hands loosely joined near waist.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 40 tuổi — tender (trìu mến)

**Output**: `images/chuong-8/c8_ti40_tender.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 2 nhìn con, sprite riêng không bế con.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

EXPRESSION TENDER: Soft affectionate eyes, relaxed brows, small warm smile. No face stretching or painted cheek circles.

POSE: Standing, arms relaxed with open hands, no imaginary infant in arms.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 40 tuổi — determined (chủ động)

**Output**: `images/chuong-8/c8_ti40_determined.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Sau lựa chọn bảo vệ gia đình hoặc hoàn tất quỹ học vấn.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

EXPRESSION DETERMINED: Steady attentive eyes, relaxed eyebrows, subtle confident smile. No face stretching or painted cheek circles.

POSE: Standing balanced, one open palm near waist, other hand lowered.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Con 1 tuổi — happy (cười vui)

**Output**: `images/chuong-8/c8_child1_happy.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 2 đúng con 1 tuổi trong nguồn.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired, matching the established chapter art. MEDIUM-thickness outlines, soft flat cel-shading with gentle gradients, warm natural soft lighting, natural medium-sized eyes with one small highlight, no painted kawaii blush circles. Natural ONE-YEAR-OLD infant anatomy, head-to-body ratio about 1:3 to 1:4; adult 1:4 to 1:5 proportions apply only to adult characters. No exaggerated chibi head, no photorealism, no semi-realism, no 3D, no text, no watermark.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 1-year-old Vietnamese baby (Ti's child, visual design chosen as a boy, age-locked one year), healthy natural infant proportions, warm light-beige skin, soft naturally rounded cheeks without painted blush circles, small dark-brown eyes, fine short black hair. Pale-yellow long-sleeve cotton top (#f1d985), pale-yellow full-length soft trousers covering the ankles, cream socks, no shoes or jewelry. Sitting securely with both legs and hands visible, or supported safely on the father's lap; never standing unsupported, never depicted as a three-year-old. Natural infant head-to-body ratio about 1:3 to 1:4, not adult 1:5 and not exaggerated chibi. Keep identical appearance and clothes in sprite and education scene.

EXPRESSION HAPPY: Happy eyes with natural eyelids, small open delighted smile, natural cheeks. No face stretching or painted cheek circles.

POSE: Sitting securely upright on the white studio surface, both legs forward, both hands visible resting naturally near knees; do not make infant stand.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Natural seated infant, not standing; preserve one-year-old anatomy. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, adult body proportions, unsupported standing, three-year-old, adult face.
```

---

## Tí 50 tuổi — reflective (nhìn lại)

**Output**: `images/chuong-8/c8_ti50_reflective.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Nhiệm vụ 3 trước khi hệ thống xác định ending.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

EXPRESSION REFLECTIVE: Thoughtful neutral eyes, gently relaxed brows, closed neutral mouth. No face stretching or painted cheek circles.

POSE: Standing upright with both hands relaxed visibly at sides.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 50 tuổi — relaxed (thảnh thơi)

**Output**: `images/chuong-8/c8_ti50_relaxed.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Reference biểu cảm để tạo scene ending S; không ghép sprite lên scene đã có Tí.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

EXPRESSION RELAXED: Peaceful eyes, relaxed brows, small satisfied smile. No face stretching or painted cheek circles.

POSE: Standing comfortably with both hands relaxed and visible.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 50 tuổi — content (an yên)

**Output**: `images/chuong-8/c8_ti50_content.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Reference biểu cảm để tạo scene ending A; không ghép sprite lên scene đã có Tí.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

EXPRESSION CONTENT: Warm contented eyes, gentle modest smile. No face stretching or painted cheek circles.

POSE: Standing balanced, hands loosely joined near waist.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 50 tuổi — tired (mệt nhưng gắng gượng)

**Output**: `images/chuong-8/c8_ti50_tired.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Reference biểu cảm để tạo scene ending B; không ghép sprite lên scene đã có Tí.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

EXPRESSION TIRED: Slightly lowered eyelids, subdued tired eyes, neutral mouth; no illness or hollow cheeks. No face stretching or painted cheek circles.

POSE: Standing with subtly tired shoulders, hands relaxed; upright and capable.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

## Tí 50 tuổi — distressed (áp lực)

**Output**: `images/chuong-8/c8_ti50_distressed.png`
**Aspect**: 3:4 vertical
**Dùng cho**: Reference biểu cảm để tạo scene ending C; không ghép sprite lên scene đã có Tí.

```text
Create ONE single-character full-body PNG emotion sprite.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

IDENTITY AND OUTFIT: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

EXPRESSION DISTRESSED: Gently drawn eyebrows, worried downward gaze, small downturned mouth; no oversized tears or screaming. No face stretching or painted cheek circles.

POSE: Standing with slightly lowered shoulders, hands loosely joined, maintain dignity.

FRAMING: Entire head, both hands, legs and both feet inside image. Figure occupies about 55–70% of vertical height, generous white space above head and below feet. Standing adult, natural 1:4–1:5 head-to-body ratio. No close-up, bust, waist-up or cropped view. Pure white #FFFFFF background, no environment, no furniture, no other person, no floor line or cast shadow. Warm neutral soft studio light without recoloring clothes.

ASPECT: 3:4 vertical, target 1536 x 2048.

NEGATIVE: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, chibi, kawaii blush circles, photorealism, semi-realism, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, environment, colored background, props, baby-face, toddler proportions, shorts.
```

---

# 📋 BẢNG TỔNG HỢP — 10 SPRITE

| Nhân vật | Emotion | File | Dùng cho |
|---|---|---|---|
| Tí 40 tuổi | thoughtful | `c8_ti40_thoughtful.png` | Nhiệm vụ 1 đọc bài báo; nhiệm vụ 2 lập kế hoạch |
| Tí 40 tuổi | worried | `c8_ti40_worried.png` | Nhiệm vụ 1 trước lựa chọn bảo hiểm |
| Tí 40 tuổi | tender | `c8_ti40_tender.png` | Nhiệm vụ 2 nhìn con, sprite riêng không bế con |
| Tí 40 tuổi | determined | `c8_ti40_determined.png` | Sau lựa chọn bảo vệ gia đình hoặc hoàn tất quỹ học vấn |
| Con 1 tuổi | happy | `c8_child1_happy.png` | Nhiệm vụ 2 đúng con 1 tuổi trong nguồn |
| Tí 50 tuổi | reflective | `c8_ti50_reflective.png` | Nhiệm vụ 3 trước khi hệ thống xác định ending |
| Tí 50 tuổi | relaxed | `c8_ti50_relaxed.png` | Reference biểu cảm cho scene ending S; không ghép lên scene |
| Tí 50 tuổi | content | `c8_ti50_content.png` | Reference biểu cảm cho scene ending A; không ghép lên scene |
| Tí 50 tuổi | tired | `c8_ti50_tired.png` | Reference biểu cảm cho scene ending B; không ghép lên scene |
| Tí 50 tuổi | distressed | `c8_ti50_distressed.png` | Reference biểu cảm cho scene ending C; không ghép lên scene |

# THỨ TỰ GEN VÀ KIỂM TRA

1. Tạo ảnh reference đầu tiên theo bảng nhận diện, kiểm tra tuổi, khuôn mặt, quần dài, tay chân và màu trang phục.
2. Dùng reference đã duyệt cho các emotion còn lại; mỗi prompt vẫn tự đầy đủ.
3. Đối chiếu composite trong `chuong-8-backgrounds.md`; giữ nguyên trang phục và tuổi theo đúng giai đoạn.
4. Tách nền trắng rồi kiểm tra viền tóc, bàn tay, khoảng trống giữa tay/thân và giày trước khi ghép sprite.
5. Kiểm tra đủ 10 file; không đưa sprite vào composite đã có nhân vật.
