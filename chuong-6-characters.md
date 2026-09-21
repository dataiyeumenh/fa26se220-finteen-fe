# 🎭 CHƯƠNG 6 — CHARACTER EMOTION PORTRAITS

> **MỤC ĐÍCH**: Bộ sprite toàn thân 3:4 nền trắng cho **Có việc làm — Thế giới tài chính**. Hai nhân vật: Tí 26t và chuyên viên ngân hàng nữ 42t, tổng **9 emotion portraits**.
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Giữ đúng style token earnest teen/adult 1:4–1:5 từ Chương 1–5; không chibi đầu lớn, không má hồng tròn.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi emotion có đủ style + anti-distortion + nhận diện/trang phục + expression + pose/framing + background + aspect + negative. Copy nguyên khối, không phải lấy thêm mô tả từ prompt khác.

---

# 📐 KIẾN TRÚC VISUAL NOVEL — LOẠI ẢNH DIALOGUE

| Loại hiển thị | Ảnh nhân vật | Nền |
|---|---|---|
| Thoại/độc thoại của Tí | Sprite Tí theo emotion | BG không nhân vật đúng địa điểm |
| Cuộc gọi tư vấn | Tí trên BG phòng trọ; chuyên viên trong ô cuộc gọi riêng hoặc chuyển sang BG ngân hàng | Không ghép hai người đứng chung một phòng |
| Narrator dùng composite | Không ghép sprite | Scene đã có nhân vật |
| Mini-game và lựa chọn | Theo thiết kế UI | Không dùng sprite thay cho màn hình tương tác |

> Gen sprite nền trắng; tách nền thành PNG trong suốt trước khi ghép vào game. Các đường dẫn bên dưới là tên đầu ra dự kiến, không phải ảnh đã được tạo.

---

# 📖 CỐT TRUYỆN GỐC VÀ PHẠM VI CHƯƠNG 6

> **Nguồn ưu tiên**: `D:\DO-AN\cot_truyen\mau\cot-truyen-hoan-chinh-v1.docx`, mục **CHƯƠNG 6: CÓ VIỆC LÀM — THẾ GIỚI TÀI CHÍNH**. Chương có **3 nhiệm vụ**, không có Life Event riêng. Không tự thêm nhiệm vụ 4 hoặc ảnh sự kiện bất ngờ.
>
> **Phân biệt cốt truyện và thiết kế hình ảnh**: Word không chốt tuổi, giới tính chuyên viên, địa điểm Tí nhận cuộc gọi hoặc giờ của từng nhiệm vụ. Bộ ảnh dùng Tí **26 tuổi** theo mốc tạo hình Chương 6 trong `image-generation-bible.md`; chuyên viên chọn **nữ 42 tuổi** để cố định nhận diện. Địa điểm và ánh sáng được chốt bên dưới là lựa chọn dàn cảnh, không phải tình tiết bổ sung vào cốt truyện.
>
> **Không sao chép lỗi từ bible cũ**: giữ style earnest teen/adult 1:4–1:5, không dùng kawaii 1:2.5. Nhiệm vụ 2 là **cuộc gọi điện thoại**, không phải gặp trực tiếp tại quầy ngân hàng. Nhiệm vụ 3 dùng **30%/năm** như Word, không lấy 25% từ prompt cũ. Cốt truyện chi tiết không có nhiệm vụ riêng về lãi kép/đầu tư trong chương này, nên không tự thêm dù phần game map nhắc đến.

| Nhiệm vụ hiển thị | Diễn biến đúng nguồn | Dàn cảnh cố định cho bộ ảnh |
|---|---|---|
| Nhiệm vụ 1: Cú sốc Gross và Net | Hợp đồng Gross 18.000.000đ; thông báo nhận 15.250.000đ; Tí mở payslip và tìm hiểu các khoản trừ | Bàn làm việc công ty, ban ngày; không thêm HR giải thích |
| Nhiệm vụ 2: Quy tắc “Pay Yourself First” | Chuyên viên gọi điện khuyên trích 20%; người chơi chọn bật 3.000.000đ/tháng hoặc tiêu trước, dư mới tiết kiệm | Tí ở phòng trọ cuối chiều sau giờ làm; chuyên viên ở khu tư vấn ngân hàng riêng, liên lạc từ xa |
| Nhiệm vụ 3: Bẫy thanh toán tối thiểu thẻ tín dụng | Sao kê dư nợ 6.000.000đ; chọn trả tối thiểu 300.000đ hoặc trả toàn bộ; nhánh tối thiểu còn gốc 5.700.000đ với mức lãi 30%/năm theo kịch bản | Tí xem ứng dụng tại bàn phòng trọ buổi tối, trước khi xác nhận lựa chọn |
| Tổng kết chương 6 | Nhìn lại ba bài học sau nhiệm vụ 3 | Tranh biểu tượng về thu nhập, tiết kiệm và thẻ tín dụng; dùng chung mọi nhánh, không khẳng định thành tích |

> **Số liệu để triển khai giao diện**: giữ các giá trị trên theo kịch bản; không coi chúng là phép tính thuế/lãi đã được xác minh. Word đồng thời nêu “20%” và lựa chọn “3 triệu”; không ghi `20% × 15.250.000 = 3.000.000` vì hai giá trị không bằng nhau. Ảnh nền/scene chỉ có màn hình và giấy tờ với hình khối không đọc được; các số, nhãn và thao tác kéo/xem/xác nhận được dựng bằng UI để đúng chữ và có thể tương tác.

---

# 👕 TRANG PHỤC CHUẨN — ĐỒNG BỘ SPRITE VÀ SCENE CHƯƠNG 6

> Áp dụng giống nhau trong `chuong-6-characters.md` và `chuong-6-backgrounds.md`. Cùng nhân vật phải giữ khuôn mặt, màu gốc quần áo, kiểu tóc, giày và vị trí phụ kiện qua mọi biểu cảm. Cả hai nhân vật đều mặc **quần dài đến mắt cá**. Không tự thay đồ giữa scene và sprite.

| Nhân vật | Bộ đồ cố định |
|---|---|
| Tí 26t | Sơ mi trắng `#f5f5f0` tay dài cài cổ tay, mở 1 nút cổ, sơ vin; quần dài ống đứng xám đậm `#4a4a4a`; thắt lưng đen khóa bạc; loafer đen `#222222`, tất xám đậm; đồng hồ mặt tròn dây da đen ở tay trái. Không vest, cà vạt hoặc thẻ nhân viên. |
| Chuyên viên ngân hàng nữ 42t | Blazer navy `#263b55` mở phía trước, blouse ngà `#f2eee5`, quần dài navy cùng bộ; giày đen gót vuông 3 cm; kính chữ nhật đen; tóc búi thấp; tai nghe công việc đen ở tai phải, mic gần miệng; khuyên nụ bạc nhỏ. Không logo hay thẻ tên ngân hàng thật. |

> **Ở phòng trọ**: Tí vẫn mặc bộ đồ đi làm trong thời điểm dàn cảnh; không thêm áo ngủ hoặc quần ngắn. Phòng trọ vẫn bình dân, cũ vừa phải nhưng sạch và nguyên vẹn như Chương 5; có việc làm không đồng nghĩa đã mua nhà hay chuyển sang căn hộ sang trọng.
>
> **Qua điện thoại**: chuyên viên không đứng/ngồi cùng phòng với Tí. Sprite chuyên viên chỉ dùng trong ô chân dung cuộc gọi riêng; nếu giao diện chưa hỗ trợ ô cuộc gọi thì dùng BG ngân hàng riêng khi chuyển sang đầu dây bên kia.

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 6)

| ID | Nhân vật | Tuổi cố định | Quốc tịch | Cụm bắt buộc trong prompt |
|---|---|---|---|---|
| `ti` | Tí, nhân viên mới có công việc chính thức | 26 | Việt Nam | `a 26-year-old Vietnamese man` |
| `bank_advisor` | Chuyên viên tư vấn ngân hàng qua điện thoại | 42 | Việt Nam | `a 42-year-old Vietnamese woman` |

> Không thêm nhân vật HR, sếp, Minh hoặc nhân viên thu hồi nợ: cốt truyện Chương 6 không có thoại của họ. Thông báo ngân hàng và ứng dụng là giao diện hệ thống, không phải nhân vật cần sprite.

---

### Bảng emotion cần gen

| Nhân vật | Số emotion | Danh sách |
|---|---|---|
| Tí 26t | 6 | hopeful, surprised, attentive, tempted, worried, determined |
| Chuyên viên ngân hàng 42t | 3 | professional, explaining, reassuring |

---

# 🎨 STYLE TOKEN — CHUNG CHO MỌI EMOTION PORTRAIT

```text
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
```

### Anti-distortion và framing (áp dụng mọi emotion)

```text
CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
```

### Negative prompt (áp dụng mọi emotion)

```text
text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character
```

---

# 🔗 CROSS-REFERENCE — ẢNH GỐC CẦN UPLOAD KÈM

| Nhân vật | Reference | Cách dùng |
|---|---|---|
| Tí 26t | `c5_ti_neutral.png` đã duyệt; dự phòng `c4_ti_defeated.png` | Giữ nhận diện, đổi sang bộ sơ mi/quần dài Chương 6. Không dùng Tí bệnh nặng trong cảnh cấp cứu để khóa sắc mặt. |
| Chuyên viên ngân hàng 42t | Chưa có, tạo `c6_bank_advisor_professional.png` trước | Sau khi duyệt, dùng cùng ảnh này cho hai emotion còn lại và scene cuộc gọi phía ngân hàng. Không lấy HR Chương 5 làm cùng nhân vật. |

---

# 👥 CÁC NHÂN VẬT CHÍNH TRONG CHƯƠNG 6

| Nhân vật | Vai trò | Nền sử dụng |
|---|---|---|
| Tí | Nhận lương, nghe tư vấn từ xa, cân nhắc thanh toán thẻ | BG1 văn phòng; BG2 phòng trọ cuối chiều; BG4 phòng trọ tối |
| Chuyên viên ngân hàng | Đầu dây tư vấn nhiệm vụ 2 | BG3 khu tư vấn ngân hàng hoặc ô chân dung cuộc gọi riêng |

---

# 👤 TÍ 26 TUỔI — NHÂN VIÊN CHÍNH THỨC

> **Mô tả cố định**: a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.

## 🔰 PROMPT MẪU ĐẦY ĐỦ — TÍ 26 TUỔI — NHÂN VIÊN CHÍNH THỨC

> Khối mẫu dùng khi muốn thay biểu cảm; các emotion bên dưới đã điền đầy đủ, không còn chỗ trống.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> Expression: [EXPRESSION — thay bằng biểu cảm cần tạo, giữ nguyên nhận diện và trang phục].
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `hopeful` (hy vọng — vui vì công việc chính thức)

### 📄 `c6_ti_hopeful.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_ti_hopeful.png`
**Mô tả**: hy vọng — vui vì công việc chính thức.
**Dùng cho**: Mở đầu nhiệm vụ 1, trước khi thấy số tiền thực nhận.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression: HOPEFUL**:
> - Eyes / eyebrows: Eyes bright but naturally sized, eyebrows gently raised with optimism.
> - Mouth: Small relaxed closed-mouth smile, no exaggerated grin.
> - Face: Relaxed healthy face, modest happiness rather than triumphant wealth.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing upright, shoulders relaxed, hands loosely at sides; no phone or paper required.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `surprised` (bất ngờ — số tiền thực nhận thấp hơn Gross)

### 📄 `c6_ti_surprised.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_ti_surprised.png`
**Mô tả**: bất ngờ — số tiền thực nhận thấp hơn Gross.
**Dùng cho**: Nhiệm vụ 1, khi Tí thấy thông báo lương.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression: SURPRISED**:
> - Eyes / eyebrows: Eyes open slightly wider in confusion, medium pupils, eyebrows raised and drawn together; no giant bug-eyes.
> - Mouth: Small parted mouth, questioning rather than screaming.
> - Face: Mild forehead tension, no blush circles, no tears, no panic distortion.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing, RIGHT hand holding a plain smartphone at chest height, screen facing toward him with no readable text; LEFT hand open in a small questioning gesture, watch stays on left wrist.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `attentive` (chăm chú — đọc payslip hoặc nghe tư vấn)

### 📄 `c6_ti_attentive.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_ti_attentive.png`
**Mô tả**: chăm chú — đọc payslip hoặc nghe tư vấn.
**Dùng cho**: Mini-game nhiệm vụ 1 và cuộc gọi nhiệm vụ 2.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression: ATTENTIVE**:
> - Eyes / eyebrows: Focused dark-brown eyes, gently lowered upper lids, eyebrows neutral with slight concentration.
> - Mouth: Closed neutral mouth with a very slight attentive smile.
> - Face: Calm listening expression, no tears, no sweat.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing, RIGHT hand holds a plain smartphone at chest level, screen angled toward him without readable text; LEFT hand relaxed near waist, left-wrist watch visible. He can be studying the screen or listening on speakerphone, not pressing any confirmation button; do not depict a second person beside him.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `tempted` (dao động — muốn chọn cách nhẹ ví trước mắt)

### 📄 `c6_ti_tempted.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_ti_tempted.png`
**Mô tả**: dao động — muốn chọn cách nhẹ ví trước mắt.
**Dùng cho**: Nhiệm vụ 2 khi cân nhắc tiêu trước và nhiệm vụ 3 khi thấy mức trả tối thiểu.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression: TEMPTED**:
> - Eyes / eyebrows: Eyes glance slightly to the side, one eyebrow subtly raised; expression suggests considering an easy shortcut.
> - Mouth: A small uncertain half-smile, not a satisfied success grin.
> - Face: Thoughtful hesitation, normal facial proportions, no villain expression.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing, RIGHT hand holds a plain smartphone near the waist, LEFT hand lightly touches chin; no finger pressing the screen, no confirmed action.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `worried` (lo lắng — đối diện dư nợ thẻ)

### 📄 `c6_ti_worried.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_ti_worried.png`
**Mô tả**: lo lắng — đối diện dư nợ thẻ.
**Dùng cho**: Nhiệm vụ 3 trước lựa chọn thanh toán và lời giải thích bẫy nợ.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression: WORRIED**:
> - Eyes / eyebrows: Eyes directed slightly downward, eyebrows softly pinched inward with concern; no deep eye bags.
> - Mouth: Small tight downturned line, no sobbing.
> - Face: Moderate worry, slight jaw tension, no gauntness or illness.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing with shoulders slightly forward, RIGHT hand holding plain smartphone away from body, LEFT hand resting lightly at abdomen, left watch unchanged; keep whole body visible.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `determined` (quyết tâm — chủ động quản lý tiền)

### 📄 `c6_ti_determined.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_ti_determined.png`
**Mô tả**: quyết tâm — chủ động quản lý tiền.
**Dùng cho**: Nhánh bật tiết kiệm tự động của nhiệm vụ 2 hoặc trả toàn bộ của nhiệm vụ 3; không dùng để áp đặt kết quả trước lựa chọn.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression: DETERMINED**:
> - Eyes / eyebrows: Steady focused eyes, eyebrows gently drawn down with resolve, not anger.
> - Mouth: Small firm closed-mouth line with barely raised corners.
> - Face: Composed, responsible expression, no triumphant wealth imagery.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing straight, both hands loosely settled at waist level, fingers natural; no payment receipt, no celebratory gesture, no extra props.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 👤 CHUYÊN VIÊN NGÂN HÀNG NỮ 42 TUỔI

> **Mô tả cố định**: a 42-year-old Vietnamese woman (bank financial advisor, age-locked 42), height 163 cm, average healthy proportional build, oval face with gently rounded jaw, warm medium-beige skin, medium dark-brown eyes and subtle natural age shading, no exaggerated wrinkles. Black hair parted slightly to the side and gathered into a neat LOW BUN at the nape, not a ponytail. Thin black rectangular glasses, calm approachable professional presence. New character, distinct from Chapter 5 HR: older face, low bun, navy trouser suit and work headset. Outfit: navy-blue fitted single-breasted blazer (#263b55), worn open over an ivory long-sleeve blouse (#f2eee5) with a simple round neckline; matching navy full-length straight-leg tailored trousers (#263b55), hems at ankles; plain black closed-toe low block-heel shoes (#222222, 3 cm heel); thin black rectangular eyeglasses; a small black single-ear work headset (#222222) over the RIGHT ear with microphone toward the mouth; tiny round silver stud earrings. NO bank logo, NO name badge, NO necklace, NO extra handset or smartwatch. Keep identical clothing, glasses and headset position in all portraits and the bank-side call scene.

## 🔰 PROMPT MẪU ĐẦY ĐỦ — CHUYÊN VIÊN NGÂN HÀNG NỮ 42 TUỔI

> Khối mẫu dùng khi muốn thay biểu cảm; các emotion bên dưới đã điền đầy đủ, không còn chỗ trống.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 42-year-old Vietnamese woman (bank financial advisor, age-locked 42), height 163 cm, average healthy proportional build, oval face with gently rounded jaw, warm medium-beige skin, medium dark-brown eyes and subtle natural age shading, no exaggerated wrinkles. Black hair parted slightly to the side and gathered into a neat LOW BUN at the nape, not a ponytail. Thin black rectangular glasses, calm approachable professional presence. New character, distinct from Chapter 5 HR: older face, low bun, navy trouser suit and work headset. Outfit: navy-blue fitted single-breasted blazer (#263b55), worn open over an ivory long-sleeve blouse (#f2eee5) with a simple round neckline; matching navy full-length straight-leg tailored trousers (#263b55), hems at ankles; plain black closed-toe low block-heel shoes (#222222, 3 cm heel); thin black rectangular eyeglasses; a small black single-ear work headset (#222222) over the RIGHT ear with microphone toward the mouth; tiny round silver stud earrings. NO bank logo, NO name badge, NO necklace, NO extra handset or smartwatch. Keep identical clothing, glasses and headset position in all portraits and the bank-side call scene.
>
> Expression: [EXPRESSION — thay bằng biểu cảm cần tạo, giữ nguyên nhận diện và trang phục].
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Chuyên viên ngân hàng — Emotion: `professional` (chuyên nghiệp — mở đầu cuộc gọi)

### 📄 `c6_bank_advisor_professional.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_bank_advisor_professional.png`
**Mô tả**: chuyên nghiệp — mở đầu cuộc gọi.
**Dùng cho**: Chuyên viên gọi cho khách hàng mới đi làm trong nhiệm vụ 2.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 42-year-old Vietnamese woman (bank financial advisor, age-locked 42), height 163 cm, average healthy proportional build, oval face with gently rounded jaw, warm medium-beige skin, medium dark-brown eyes and subtle natural age shading, no exaggerated wrinkles. Black hair parted slightly to the side and gathered into a neat LOW BUN at the nape, not a ponytail. Thin black rectangular glasses, calm approachable professional presence. New character, distinct from Chapter 5 HR: older face, low bun, navy trouser suit and work headset. Outfit: navy-blue fitted single-breasted blazer (#263b55), worn open over an ivory long-sleeve blouse (#f2eee5) with a simple round neckline; matching navy full-length straight-leg tailored trousers (#263b55), hems at ankles; plain black closed-toe low block-heel shoes (#222222, 3 cm heel); thin black rectangular eyeglasses; a small black single-ear work headset (#222222) over the RIGHT ear with microphone toward the mouth; tiny round silver stud earrings. NO bank logo, NO name badge, NO necklace, NO extra handset or smartwatch. Keep identical clothing, glasses and headset position in all portraits and the bank-side call scene.
>
> **Expression: PROFESSIONAL**:
> - Eyes / eyebrows: Attentive eyes through glasses, relaxed eyebrows, gaze slightly toward the viewer as a call portrait.
> - Mouth: Small courteous professional smile, lips slightly parted while greeting.
> - Face: Calm, friendly and measured, no exaggerated sales grin.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing neutral full-body sprite, RIGHT hand lightly near the headset control without covering her face, LEFT hand relaxed; she is speaking remotely, no customer present.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Chuyên viên ngân hàng — Emotion: `explaining` (giải thích — trích tiết kiệm trước khi tiêu)

### 📄 `c6_bank_advisor_explaining.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_bank_advisor_explaining.png`
**Mô tả**: giải thích — trích tiết kiệm trước khi tiêu.
**Dùng cho**: Giải thích đề xuất 20% và cách thiết lập tiết kiệm tự động trong nhiệm vụ 2.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 42-year-old Vietnamese woman (bank financial advisor, age-locked 42), height 163 cm, average healthy proportional build, oval face with gently rounded jaw, warm medium-beige skin, medium dark-brown eyes and subtle natural age shading, no exaggerated wrinkles. Black hair parted slightly to the side and gathered into a neat LOW BUN at the nape, not a ponytail. Thin black rectangular glasses, calm approachable professional presence. New character, distinct from Chapter 5 HR: older face, low bun, navy trouser suit and work headset. Outfit: navy-blue fitted single-breasted blazer (#263b55), worn open over an ivory long-sleeve blouse (#f2eee5) with a simple round neckline; matching navy full-length straight-leg tailored trousers (#263b55), hems at ankles; plain black closed-toe low block-heel shoes (#222222, 3 cm heel); thin black rectangular eyeglasses; a small black single-ear work headset (#222222) over the RIGHT ear with microphone toward the mouth; tiny round silver stud earrings. NO bank logo, NO name badge, NO necklace, NO extra handset or smartwatch. Keep identical clothing, glasses and headset position in all portraits and the bank-side call scene.
>
> **Expression: EXPLAINING**:
> - Eyes / eyebrows: Focused eyes through glasses, eyebrows slightly raised to emphasize an explanation.
> - Mouth: Small open speaking mouth, normal proportions.
> - Face: Patient, clear and matter-of-fact, not stern or pushy.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing full body, LEFT palm open in a small explanatory gesture, RIGHT hand relaxed. Headset stays on RIGHT ear; no tablet being handed to Ti and no other person.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Chuyên viên ngân hàng — Emotion: `reassuring` (trấn an — để khách tự quyết định)

### 📄 `c6_bank_advisor_reassuring.png`
**Aspect**: 3:4 vertical
**Output**: `images/chuong-6/c6_bank_advisor_reassuring.png`
**Mô tả**: trấn an — để khách tự quyết định.
**Dùng cho**: Phản hồi trong cuộc gọi khi Tí cân nhắc; không hứa giàu nhanh hoặc xác nhận đã bật tính năng.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
>
> a 42-year-old Vietnamese woman (bank financial advisor, age-locked 42), height 163 cm, average healthy proportional build, oval face with gently rounded jaw, warm medium-beige skin, medium dark-brown eyes and subtle natural age shading, no exaggerated wrinkles. Black hair parted slightly to the side and gathered into a neat LOW BUN at the nape, not a ponytail. Thin black rectangular glasses, calm approachable professional presence. New character, distinct from Chapter 5 HR: older face, low bun, navy trouser suit and work headset. Outfit: navy-blue fitted single-breasted blazer (#263b55), worn open over an ivory long-sleeve blouse (#f2eee5) with a simple round neckline; matching navy full-length straight-leg tailored trousers (#263b55), hems at ankles; plain black closed-toe low block-heel shoes (#222222, 3 cm heel); thin black rectangular eyeglasses; a small black single-ear work headset (#222222) over the RIGHT ear with microphone toward the mouth; tiny round silver stud earrings. NO bank logo, NO name badge, NO necklace, NO extra handset or smartwatch. Keep identical clothing, glasses and headset position in all portraits and the bank-side call scene.
>
> **Expression: REASSURING**:
> - Eyes / eyebrows: Soft attentive eyes, gently raised inner brows, natural eyelids.
> - Mouth: Small warm reassuring smile, no wide laugh.
> - Face: Understanding professional expression, not pity or condescension.
> - NO kawaii blush circles. Keep facial anatomy unchanged.
>
> **Pose**: Standing full body, hands loosely joined near waist with natural fingers, headset unchanged; no physical contact with Ti and no confirmed transaction.
>
> Full body visible, head, both hands, legs and both feet entirely inside the frame. Character occupies about 55–70% of the vertical image height, with generous white space above the head and below the feet. Standing pose, natural adult proportions 1:4–1:5. NOT close-up, NOT bust, NOT waist-up, NOT cropped. Background: pure white #FFFFFF, no environment, no furniture, no cast shadow, no other person.
>
> **Aspect ratio**: 3:4 vertical, pure white background.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 BẢNG TỔNG HỢP

## Tất cả emotion portraits — 9 file

| Nhân vật | Emotion | Tên file | Dùng cho |
|---|---|---|---|
| Tí 26t | hopeful | `c6_ti_hopeful.png` | Mở đầu nhiệm vụ 1, trước khi thấy số tiền thực nhận. |
| Tí 26t | surprised | `c6_ti_surprised.png` | Nhiệm vụ 1, khi Tí thấy thông báo lương. |
| Tí 26t | attentive | `c6_ti_attentive.png` | Mini-game nhiệm vụ 1 và cuộc gọi nhiệm vụ 2. |
| Tí 26t | tempted | `c6_ti_tempted.png` | Nhiệm vụ 2 khi cân nhắc tiêu trước và nhiệm vụ 3 khi thấy mức trả tối thiểu. |
| Tí 26t | worried | `c6_ti_worried.png` | Nhiệm vụ 3 trước lựa chọn thanh toán và lời giải thích bẫy nợ. |
| Tí 26t | determined | `c6_ti_determined.png` | Nhánh bật tiết kiệm tự động của nhiệm vụ 2 hoặc trả toàn bộ của nhiệm vụ 3; không dùng để áp đặt kết quả trước lựa chọn. |
| Chuyên viên 42t | professional | `c6_bank_advisor_professional.png` | Chuyên viên gọi cho khách hàng mới đi làm trong nhiệm vụ 2. |
| Chuyên viên 42t | explaining | `c6_bank_advisor_explaining.png` | Giải thích đề xuất 20% và cách thiết lập tiết kiệm tự động trong nhiệm vụ 2. |
| Chuyên viên 42t | reassuring | `c6_bank_advisor_reassuring.png` | Phản hồi trong cuộc gọi khi Tí cân nhắc; không hứa giàu nhanh hoặc xác nhận đã bật tính năng. |

## Thứ tự gen khuyến nghị

1. Tạo `c6_ti_hopeful.png`, đối chiếu mặt với Tí chương trước và duyệt bộ đồ Chương 6.
2. Dùng ảnh Tí đã duyệt để tạo 5 emotion còn lại, giữ nguyên sơ mi, quần dài, giày và đồng hồ.
3. Tạo `c6_bank_advisor_professional.png`, duyệt mặt, búi tóc, bộ suit navy và tai nghe.
4. Dùng ảnh chuyên viên đã duyệt để tạo `explaining` và `reassuring`.
5. Kiểm tra đủ đầu, tay, chân; tách nền trắng trước khi dùng sprite. Đối chiếu prompt scene trong `chuong-6-backgrounds.md`.
