# 🎭 CHƯƠNG 5 — CHARACTER EMOTION PORTRAITS

> **MỤC ĐÍCH**: Tách riêng file emotion portraits (nhân vật 3:4 trên nền trắng) cho Chương 5 — **Vừa ra trường — Thất nghiệp** (Tí 22 tuổi). Dùng cho **dialogue** scene khi 2 nhân vật nói chuyện qua lại với nhau.
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Mọi emotion phải dùng **CHÍNH XÁC** style token earnest teen (giống Chương 1-4) — KHÔNG dùng 1:2.5 kawaii chibi. Tí 22t là **vừa ra trường, thất nghiệp 2.5 tháng** → **head-to-body 1:4-1:5, NO blush circles, NO kawaii baby-face**.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi prompt là **KHỐI TỰ CHỨA ĐẦY ĐỦ** — copy nguyên khối `[Style token + Character reference đầy đủ + Expression + Aspect]` là dán vào Gemini là chạy được. KHÔNG cần tra cứu thêm ở đâu khác.

---
# 📐 KIẾN TRÚC VISUAL NOVEL — LOẠI ẢNH DIALOGUE

> 🎮 **Game này là Visual Novel kiểu Ren'Py / VN Studio**. Khi có thoại nói chuyện qua lại giữa 2 nhân vật, scene thuộc loại `dialogue`.

| Loại scene VN | Sprite nhân vật | Background | Loại ảnh gen |
|---|---|---|---|
| **`type: 'dialogue'`** (có đối thoại giữa 2+ nhân vật) | ✅ Render sprite riêng | BG trống (xem file `chuong-5-backgrounds.md`) | **PORTRAIT sprite** (1 nhân vật đứng một mình, nền trắng) |

> 📌 File này chỉ chứa **PORTRAIT SPRITE 3:4** — ảnh nền trắng của từng nhân vật với từng emotion. React engine sẽ ghép 2 portrait lên BG trống (xem file `chuong-5-backgrounds.md`).
---

# 👕 TRANG PHỤC CHUẨN — ĐỒNG BỘ SPRITE VÀ SCENE CHƯƠNG 5

> Bảng này áp dụng thống nhất trong `chuong-5-characters.md` và `chuong-5-backgrounds.md`. Mỗi nhân vật có một bộ đồ nhận diện; đổi biểu cảm, tư thế hoặc ánh sáng không làm đổi kiểu đồ, màu gốc, độ dài tay/quần hay phụ kiện. Ánh sáng cảnh có thể làm màu hiển thị ấm/lạnh hơn, nhưng không đổi màu vật liệu.

| Nhân vật | Trang phục cố định |
|---|---|
| Tí 22t | Polo cotton tay ngắn xanh nhạt `#a8c4d8`, cổ mềm 2 nút, mặc ngoài quần; quần kaki cotton **dài đến mắt cá**, ống đứng xám đậm `#4a4a4a`; sneaker vải thấp cổ trắng ngà `#f5f5f0`, tất cổ ngắn xám nhạt `#c9c9c9`. Đồ vừa vặn, sạch, nguyên vẹn, không logo; không vest, cà vạt, thẻ nhân viên hoặc đồng hồ. |
| Bà chủ trọ 55t | Áo blouse tay ngắn cài nút hồng đất `#c88f98`, hoa nhỏ kem `#f2e4cf` và lá xanh trầm `#7c8b72`, mặc ngoài quần; quần cotton dài ống đứng rộng vừa màu than `#343434`; dép nhựa một quai ngang nâu đậm `#6b4a36`; khuyên nụ tròn vàng nhỏ `#c9a34e`. |
| Minh 23t | Sơ mi trắng `#ffffff` tay dài cài cổ tay, sơ vin; quần chinos dài ống đứng xám đậm `#3a3a3a`; loafer da nâu `#79513a`; thắt lưng đen `#222222`, khóa bạc; đồng hồ dây mắt xích bạc `#b8bdc5`, mặt tròn tối `#242424` ở cổ tay trái, không logo; không vest. |
| HR 32t | Blouse beige `#d4c4a8` tay dài cài cổ tay, sơ vin; chân váy bút chì dài ngang gối màu than `#2a2a2a`; giày bít mũi gót vuông thấp 3 cm màu đen `#222222`; dây chuyền vàng mảnh, mặt tròn nhỏ `#c9a34e`; kính chữ nhật đen. |
| Bác sĩ 45t | Blouse trắng `#f5f5f0` tay dài, dài ngang gối, mở phía trước; áo scrub cổ V và **quần scrub dài** xanh navy `#1a3a6a`; giày y tế bít mũi chống trượt đen `#222222`; găng xanh nhạt `#8ab8e0`; ống nghe đen đầu bạc; thẻ ở túi ngực trái; kính chữ nhật đen. |

> **Tí ở Scene 5.1, 5.2, 5.3 và cả 4 emotion**: cùng polo xanh nhạt + quần kaki dài xám đậm + sneaker trắng ngà. Trang phục bình dân, gọn gàng, phù hợp người mới ra trường đi tìm việc; giữ nguyên khi họp lớp và phỏng vấn công ty nhỏ. Trong Scene 5.1, Tí đã mặc đồ và mang giày để chuẩn bị ra ngoài tìm việc trước khi chủ trọ đến. Quần luôn dài đến mắt cá, không xắn gấu.
>
> **Ngoại lệ duy nhất ở Life Event 5**: vẫn đúng polo và quần dài của Tí; áo hơi nhăn và được vén tạm để khám bụng/gắn điện cực. Giày và tất được tháo, đặt gọn cạnh cáng; không đổi sang đồ bệnh nhân. Vòng tay bệnh nhân là phụ kiện riêng của cảnh cấp cứu. Bác sĩ vẫn giữ nguyên bộ đồ chuẩn.
>
> **Reference**: `c4_ti_defeated.png` chỉ dùng giữ khuôn mặt, tóc, vóc dáng và phong cách của Tí, không sao chép bộ đồ Chương 4. Sau khi duyệt ảnh đầu tiên của từng nhân vật trong Chương 5, dùng ảnh đó làm reference trang phục cho các emotion và scene tiếp theo. Mỗi prompt bên dưới đã ghi đầy đủ bộ đồ để có thể copy riêng.

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 5)

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt |
|---|---|---|---|
| Tí | **22** | 🇻🇳 Việt Nam | `a 22-year-old Vietnamese man` |
| Bà chủ trọ | **55** | 🇻🇳 Việt Nam | `a 55-year-old Vietnamese woman` |
| Thằng Minh | **23** | 🇻🇳 Việt Nam | `a 23-year-old Vietnamese man` |
| HR Cô ty nhỏ | **32** | 🇻🇳 Việt Nam | `a 32-year-old Vietnamese woman` |
| Bác sĩ | **45** | 🇻🇳 Việt Nam | `a 45-year-old Vietnamese man` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các emotion của cùng 1 nhân vật.

### Bảng emotion cần gen

| Nhân vật | Số emotion | Danh sách emotion |
|---|---|---|
| Tí 22t | **4** | neutral, desperate, ashamed, resigned |
| Bà chủ trọ | **3** | neutral, angry, impatient |
| Thằng Minh | **3** | happy_braggy, casual, sympathetic |
| HR Cô ty nhỏ | **3** | neutral, professional, slightly_pitiful |
| Bác sĩ | **3** | neutral, concerned, professional_reassuring |

> **Tổng: 16 emotion portraits** (5 nhân vật × emotion)
> Tất cả đều aspect **3:4 vertical**, nền trắng trơn.

---

# 🎨 STYLE TOKEN — CHUNG CHO MỌI EMOTION PORTRAIT

> **⚠️ KHÁC VỚI BIBLE GỐC**: Bible cũ dùng 1:2.5 kawaii chibi, nhưng dự án này đã chốt dùng **earnest teen proportions 1:4-1:5** từ Chương 1 → phải giữ nhất quán. KHÔNG copy style từ `image-generation-bible.md` mục cũ.

```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
```

### Anti-distortion CRITICAL block (áp dụng MỌI emotion)

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters —
do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face,
do NOT distort facial features even when the character is screaming, shocked,
angry, or laughing. Head size and facial proportions stay consistent with the
canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image
frame — top of head AND both feet AND both hands all visible — character
occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up,
NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust,
NOT shoulders-up, NOT waist-up. Plenty of white negative space above head
and below feet.
```

### Negative prompt (áp dụng cho MỌI emotion)

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality,
3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features,
wrong age appearance, caucasian features, anime-stereotype Western face,
Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks,
slim sharp jawline (wrong for age 22 man), tall muscular body (wrong for lean 22-year-old),
realistic Vietnamese adult face, child proportions (must look exactly 22), haggard face, gaunt face, hollow cheeks, sunken eyes, drug addict, cancer patient, malnourished, sickly, pale xanh xao, dark heavy eye bags, swollen under-eyes, oversized hanging clothes on skinny frame (must look like HEALTHY 22-year-old office worker, NOT sick/addicted/homeless)
```

---

# 🔗 CROSS-REFERENCE — ẢNH GỐC CẦN UPLOAD KÈM

> 🎯 **QUAN TRỌNG**: Khi gen emotion, **LUÔN upload ảnh reference gốc** để giữ đúng khuôn mặt, tóc, da, vóc dáng.

| Nhân vật chương 5 | Upload reference | Ghi chú |
|---|---|
| Tí 22t | `c4_ti_defeated.png` (tham chiếu nhận diện) | Polo cotton tay ngắn xanh nhạt `#a8c4d8`, cổ mềm 2 nút, mặc ngoài quần; quần kaki cotton **dài đến mắt cá**, ống đứng xám đậm `#4a4a4a`; sneaker vải thấp cổ trắng ngà `#f5f5f0`, tất cổ ngắn xám nhạt `#c9c9c9`. Đồ vừa vặn, sạch, nguyên vẹn, không logo; không vest, cà vạt, thẻ nhân viên hoặc đồng hồ. Giữ khuôn mặt, tóc và vóc dáng khỏe mạnh; quầng mắt cực nhẹ. |
| Bà chủ trọ | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 55t, phụ nữ Việt Nam, chunky body, tóc búi củ tỏi, blouse hoa, khó tính |
| Thằng Minh | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 23t, cao 177cm, rounded build, tóc rẽ ngôi gọn; sơ mi trắng, chinos xám, loafer nâu, đồng hồ dây bạc ở tay trái; không vest. |
| HR Cô ty nhỏ | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 32t, phụ nữ Việt Nam, tóc đuôi ponytail, blouse beige, kính, HR professional |
| Bác sĩ | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 45t, đàn ông Việt Nam, áo blouse trắng, stethoscope, kính, mệt nhưng competent |

---

# 👥 CÁC NHÂN VẬT CHÍNH TRONG CHƯƠNG 5 (CÓ THOẠI)

| ID | Tên nhân vật | Tuổi cố định | Quốc tịch | Vai trò |
|---|---|---|---|---|
| `ti` | Tí (nhân vật chính) | **22** | 🇻🇳 Việt Nam | Thất nghiệp 2.5 tháng |
| `chutro` | Bà chủ trọ | **55** | 🇻🇳 Việt Nam | Đòi tiền nhà 3 triệu |
| `minh` | Thằng Minh | **23** | 🇻🇳 Việt Nam | Bạn ĐH, khoe xe & công ty nước ngoài |
| `hr` | HR Cô ty nhỏ | **32** | 🇻🇳 Việt Nam | Offer lương 4.5tr/tháng |
| `bacsi` | Bác sĩ | **45** | 🇻🇳 Việt Nam | Cấp cứu đêm |

---

# 👤 TÍ 22 TUỔI — VỪA RA TRƯỜNG, THẤT NGHIỆP

> **Reference bắt buộc**: upload `c4_ti_defeated.png` (Tí 22t thực tập sinh bị rớt môn)
>
> **Mô tả cố định** (dùng trong MỌI prompt emotion):
> `a 22-year-old Vietnamese man`. height **172cm**, **NORMAL-HEALTHY slim build** (vẫn cân đối, KHÔNG hốc hác, KHÔNG gầy gò xương xẩu — chỉ hơi ít tập gym trong 2.5 tháng thất nghiệp, vẫn là dân văn phòng 22t bình thường, body ổn), face **LONGER + sharper jawline** (22t trưởng thành — vẫn là mặt THANH NIÊN ĐI LÀM, KHÔNG phải mặt người ốm/bệnh), skin **warm light beige khỏe mạnh** (tone da VN ĐI LÀM VĂN PHÒNG, KHÔNG nhợt nhạt xanh xao, KHÔNG vàng bệnh — chỉ hơi ít ngủ nên tone tổng thể rất nhẹ nhàng, vẫn khỏe), **dark circles CỰC NHẸ ở mắt dưới** (giống dân vừa mất ngủ 1-2 đêm — gần như KHÔNG THẤY rõ, chỉ shading rất tinh tế — KHÔNG có quầng đậm, KHÔNG có bọng mắt sưng, KHÔNG trông như nghiện/ốm). hair **NGẮN slicked-back nhẹ** (hơi xơ xác không vuốt kỹ — kiểu mới ra trường chưa cắt lại tóc sau mùa thất nghiệp, vẫn gọn gàng cơ bản, KHÔNG tóc bết dính bẩn). Vietnamese facial features, sạch. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes. Body proportions: **NORMAL healthy 22-year-old Vietnamese male adult, balanced build, NOT skinny, NOT haggard, NOT gaunt, NOT sickly, NOT hollow-cheeked, NOT sunken-eyed, NOT drug-addict-thin, NOT cancer-patient-thin. Vẫn là thanh niên 22t khỏe mạnh bình thường, chỉ hơi mệt + stress vì thất nghiệp**.
>
> **⚠️ CRITICAL CHO TÍ CHƯƠNG 5**:
> 1. **Bộ mặt cơ bản** (khuôn mặt, mắt, mũi, miệng, tai) PHẢI y hệt `c4_ti_defeated.png`. Chỉ thay đổi expression + dark circles intensity tùy scene. KHÔNG redraw khuôn mặt.
> 2. **Tí 22t = thanh niên KHỎE MẠNH, KHÔNG phải người ốm/nghiện**: body phải cân đối bình thường, mặt phải có DA THỊT (NOT hốc hác, NOT xương lồi), mắt phải TỈNH TÁO với tone đồng đều (không có bọng sưng, không có quầng đậm). Trông giống **dân văn phòng mới nghỉ việc 2.5 tháng** chứ KHÔNG giống **bệnh nhân giai đoạn cuối / người nghiện / người suy dinh dưỡng**. Stress chỉ thể hiện qua expression (eyes, eyebrows, mouth) chứ KHÔNG thể hiện qua suy nhược vật lý.

---

## 🔰 PROMPT MẪU ĐẦY ĐỦ CHO TÍ 22T (copy từ đây — paste vào Gemini + chỉ thay phần Expression)

> **Dùng cho cả 4 emotion**: neutral, desperate, ashamed, resigned. Copy khối dưới → paste Gemini → thay phần **[EXPRESSION]** bằng emotion tương ứng.
>
> ```
> Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> a 22-year-old Vietnamese man (Tí, age-locked 22). Phải giống reference c4_ti_defeated.png — same face, same hair, same build, same skin tone. height 172cm, NORMAL-HEALTHY slim build (vẫn cân đối khỏe mạnh như chương 4, KHÔNG gầy đi, KHÔNG sụt cân, KHÔNG hốc hác — chỉ hơi ít tập gym 2.5 tháng thất nghiệp), face LONGER + sharper jawline (22t trưởng thành — khuôn mặt THANH NIÊN ĐI LÀM khỏe mạnh, KHÔNG phải mặt người ốm/bệnh), warm light beige skin KHỎE MẠNH (tone da VN đi làm văn phòng, KHÔNG nhợt nhạt xanh xao, KHÔNG vàng bệnh — chỉ hơi ít ngủ nên tone tổng thể nhẹ nhàng hơn chương 4 xíu), dark circles CỰC NHẸ ở mắt dưới (gần như KHÔNG THẤY rõ, chỉ shading rất tinh tế như dân mới mất ngủ 1-2 đêm — KHÔNG quầng đậm, KHÔNG bọng mắt, KHÔNG trông như nghiện/ốm), hair NGẮN slicked-back nhẹ (hơi xơ xác không vuốt kỹ — kiểu mới ra trường chưa cắt lại tóc sau thất nghiệp, vẫn gọn gàng), Vietnamese facial features, sạch. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes. Body proportions: NORMAL healthy 22-year-old Vietnamese male adult, balanced build, NOT skinny, NOT haggard, NOT gaunt, NOT sickly, NOT hollow-cheeked, NOT sunken-eyed, NOT drug-addict-thin, NOT cancer-patient-thin. Vẫn là thanh niên 22t khỏe mạnh bình thường, chỉ hơi stress vì thất nghiệp.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, head + shoulders + torso + legs + feet + both hands all visible.
>
> Background: pure white, no elements, no shadows.
>
> [EXPRESSION]: [chèn emotion cụ thể ở đây — xem 4 emotion dưới].
>
> Aspect ratio: 3:4 vertical, white background.
>
> Negative prompt: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, slim sharp jawline (wrong for age 22 man), tall muscular body (wrong for lean 22-year-old), realistic Vietnamese adult face, child proportions (must look exactly 22), haggard face, gaunt face, hollow cheeks, sunken eyes, drug addict, cancer patient, malnourished, sickly, pale xanh xao, dark heavy eye bags, swollen under-eyes, oversized hanging clothes on skinny frame (must look like HEALTHY 22-year-old office worker, NOT sick/addicted/homeless), haggard face, gaunt face, hollow cheeks, sunken eyes, drug addict, cancer patient, malnourished, sickly, pale xanh xao, dark heavy eye bags, swollen under-eyes, oversized hanging clothes on skinny frame (must look like HEALTHY 22-year-old office worker, NOT sick/addicted/homeless)
> ```

---

## Tí — Emotion: `neutral` (trung lập — đang suy nghĩ)

### 📄 `c5_ti_neutral.png`
**Aspect**: 3:4 vertical
**Mô tả**: Tí suy nghĩ trung lập, mặt bình thường nhưng có vẻ mệt.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 22-year-old Vietnamese man**. Phải giống reference `c4_ti_defeated.png` — same face, same hair, same build, same skin tone. height **172cm**, **NORMAL-HEALTHY slim build** (vẫn cân đối, KHÔNG gầy/sụt cân/hốc hác — chỉ hơi ít tập gym 2.5 tháng thất nghiệp), face LONGER + sharper jawline (22t trưởng thành — mặt THANH NIÊN ĐI LÀM khỏe mạnh), **warm light beige skin KHỎE MẠNH** (KHÔNG nhợt nhạt xanh xao — tone da VN đi văn phòng), **dark circles CỰC NHẸ ở mắt dưới** (gần như không thấy rõ, chỉ shading rất tinh tế — KHÔNG quầng đậm, KHÔNG bọng mắt sưng, KHÔNG trông như nghiện/ốm), hair NGẮN slicked-back nhẹ (hơi xơ xác không vuốt kỹ — kiểu chưa cắt lại tóc sau thất nghiệp, vẫn gọn gàng). Vietnamese facial features, sạch. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes. Body proportions: NORMAL healthy 22-year-old Vietnamese male adult, balanced build, NOT skinny, NOT haggard, NOT gaunt, NOT sickly, NOT hollow-cheeked, NOT sunken-eyed, NOT drug-addict-thin.
>
> **Expression: NEUTRAL (trung lập — đang suy nghĩ)**:
> - Eyes: **open, looking straight at viewer**, medium-sized irises (dark brown), medium eyelids (NOT droopy, NOT fully open), one small white highlight in each eye. Eyebrows: **slightly knitted together in mild concern** (the "đang suy nghĩ" look — not worried but not relaxed).
> - Mouth: **slightly straight line** (flat, not smiling, not frowning — the "mình đang cân nhắc" neutral expression).
> - Face: jaw tight, overall tension in the face but controlled.
> - **NO blush circles** on cheeks. **NO tears**. **NO sweat**. Skin shading subtle natural.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, head + shoulders + torso + legs + feet + both hands all visible.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, slim sharp jawline (wrong for age 22 man), tall muscular body (wrong for lean 22-year-old), realistic Vietnamese adult face, child proportions (must look exactly 22), haggard face, gaunt face, hollow cheeks, sunken eyes, drug addict, cancer patient, malnourished, sickly, pale xanh xao, dark heavy eye bags, swollen under-eyes, oversized hanging clothes on skinny frame (must look like HEALTHY 22-year-old office worker, NOT sick/addicted/homeless)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `desperate` (tuyệt vọng — sắp khóc)

### 📄 `c5_ti_desperate.png`
**Aspect**: 3:4 vertical
**Mô tả**: Tí nhìn bằng nước mắt, miệng run, tay nắm chặt.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 22-year-old Vietnamese man**. Phải giống reference `c4_ti_defeated.png` — same face, same hair, same build, same skin tone. height **172cm**, **NORMAL-HEALTHY slim build** (vẫn cân đối, KHÔNG gầy/sụt cân/hốc hác), face LONGER + sharper jawline (22t trưởng thành), **warm light beige skin KHỎE MẠNH** (KHÔNG nhợt nhạt xanh xao), **dark circles CỰC NHẸ** (gần như không thấy rõ, chỉ shading rất tinh tế — KHÔNG quầng đậm/bọng mắt/trông như nghiện), hair NGẮN slicked-back nhẹ (hơi xơ xác — chưa cắt lại tóc sau thất nghiệp, vẫn gọn gàng). Vietnamese facial features, sạch. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes. Body proportions: NORMAL healthy 22-year-old, NOT skinny/haggard/gaunt/sickly/hollow-cheeked/sunken-eyed/drug-addict-thin.
>
> **Expression: DESPERATE (tuyệt vọng — sắp khóc)**:
> - Eyes: **wide open, looking at viewer**, pupils dilated (lớn hơn neutral), **EYES FILLED WITH TEARS** (2-3 visible small tears welling up at lower eyelid — NOT streaming yet, just about to spill). Eyebrows: **strongly knitted in upward V** (the "tao sắp khóc rồi" desperate expression).
> - Mouth: **slightly trembling open** (small gap, lips quivering — the "run" expression of holding back tears).
> - Face: jaw clenched tight, face flushed slightly (emotional tension), skin shading shows tightness.
> - **NO blush circles**. **1-2 small sweat drops** on temple (stress). Skin shading subtle natural.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, hands **clutching at his own shirt at chest level** (the anxiety gesture — fingers gripping the hem of his shirt, the "sắp khóc" tension). Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, slim sharp jawline (wrong for age 22 man), tall muscular body (wrong for lean 22-year-old), realistic Vietnamese adult face, child proportions (must look exactly 22), haggard face, gaunt face, hollow cheeks, sunken eyes, drug addict, cancer patient, malnourished, sickly, pale xanh xao, dark heavy eye bags, swollen under-eyes, oversized hanging clothes on skinny frame (must look like HEALTHY 22-year-old office worker, NOT sick/addicted/homeless)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `ashamed` (hổ thẹn — tự ái)

### 📄 `c5_ti_ashamed.png`
**Aspect**: 3:4 vertical
**Mô tả**: Tí cúi mặt, tránh nhìn, miệng cắn môi, tay nắm chặt.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 22-year-old Vietnamese man**. Phải giống reference `c4_ti_defeated.png` — same face, same hair, same build, same skin tone. height **172cm**, **NORMAL-HEALTHY slim build** (vẫn cân đối, KHÔNG gầy/sụt cân/hốc hác), face LONGER + sharper jawline (22t trưởng thành), **warm light beige skin KHỎE MẠNH** (KHÔNG nhợt nhạt xanh xao), **dark circles CỰC NHẸ** (gần như không thấy rõ, chỉ shading rất tinh tế — KHÔNG quầng đậm/bọng mắt/trông như nghiện), hair NGẮN slicked-back nhẹ (hơi xơ xác — chưa cắt lại tóc sau thất nghiệp, vẫn gọn gàng). Vietnamese facial features, sạch. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes. Body proportions: NORMAL healthy 22-year-old, NOT skinny/haggard/gaunt/sickly/hollow-cheeked/sunken-eyed/drug-addict-thin.
>
> **Expression: ASHAMED (hổ thẹn — tự ái nổi lên)**:
> - Eyes: **directed DOWN and to the side** (NOT looking at viewer — he's ashamed, avoiding eye contact), eyelids half-lowered (not fully closed, not fully open), just enough to see the **white of the upper eye** and the **lower lashes**. Eyebrows: **angled sharply downward toward the nose** (the "mình xấu hổ" shame expression — both brows tilted down-in).
> - Mouth: **tight pressed line** (lips pressed together firmly, corners slightly downturned — the "cắn môi giữ nước mắt" expression).
> - Face: **whole face tilted slightly to one side** (avoiding camera), head **bowed slightly down** (not looking up), jaw clenched tight, skin shading shows emotional redness at cheekbones (subtle shame flush).
> - **NO blush circles** (the flush is natural skin shading, not cartoon pink circles). **NO tears** (he is holding it in). **NO sweat**. Skin shading subtle natural.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **hands tightly gripping his own shirt at chest level** (clenched fists at hem, the "embarrassed+tensing" gesture), **body slightly hunched forward**. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, slim sharp jawline (wrong for age 22 man), tall muscular body (wrong for lean 22-year-old), realistic Vietnamese adult face, child proportions (must look exactly 22), haggard face, gaunt face, hollow cheeks, sunken eyes, drug addict, cancer patient, malnourished, sickly, pale xanh xao, dark heavy eye bags, swollen under-eyes, oversized hanging clothes on skinny frame (must look like HEALTHY 22-year-old office worker, NOT sick/addicted/homeless)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Tí — Emotion: `resigned` (cam chịu — đầu hàng)

### 📄 `c5_ti_resigned.png`
**Aspect**: 3:4 vertical
**Mô tả**: Tí nhìn xuống, mặt phẳng lặng, mắt trống rỗng, đã từ bỏ hy vọng.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 22-year-old Vietnamese man**. Phải giống reference `c4_ti_defeated.png` — same face, same hair, same build, same skin tone. height **172cm**, **NORMAL-HEALTHY slim build** (vẫn cân đối, KHÔNG gầy/sụt cân/hốc hác), face LONGER + sharper jawline (22t trưởng thành), **warm light beige skin KHỎE MẠNH** (KHÔNG nhợt nhạt xanh xao), **dark circles CỰC NHẸ** (gần như không thấy rõ, chỉ shading rất tinh tế — KHÔNG quầng đậm/bọng mắt/trông như nghiện), hair NGẮN slicked-back nhẹ (hơi xơ xác — chưa cắt lại tóc sau thất nghiệp, vẫn gọn gàng). Vietnamese facial features, sạch. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes. Body proportions: NORMAL healthy 22-year-old, NOT skinny/haggard/gaunt/sickly/hollow-cheeked/sunken-eyed/drug-addict-thin.
>
> **Expression: RESIGNED (cam chịu — đầu hàng)**:
> - Eyes: **staring blankly at the floor** (eyes directed DOWN, looking at nothing in particular — the thousand-yard stare), eyelids **heavy and half-closed** (the "đã hết sức chống cự" look — eyes are tired, not fully focused), no tears, no emotion in the eyes — just **hollow emptiness**. Eyebrows: **flat, almost horizontal** (no tension, no concern — completely relaxed/flattened in defeat).
> - Mouth: **slightly open in a small loose frown** (not crying, not smiling — just the "không còn gì để mất" expression, mouth slightly slack).
> - Face: **completely slack** — jaw not clenched, face not tight, shoulders slumped. The whole body language is **defeated, collapsed, surrendered**. Skin shading shows extreme tiredness (the exhaustion of having fought and lost).
> - **NO blush circles**. **NO tears** (cried out). **NO sweat**. Skin shading subtle natural. The face is the most **empty and lifeless** of all his expressions.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **arms hanging limp at sides** (not gripping anything, not tensing — completely relaxed in defeat), **body slumped forward slightly**. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, slim sharp jawline (wrong for age 22 man), tall muscular body (wrong for lean 22-year-old), realistic Vietnamese adult face, child proportions (must look exactly 22), haggard face, gaunt face, hollow cheeks, sunken eyes, drug addict, cancer patient, malnourished, sickly, pale xanh xao, dark heavy eye bags, swollen under-eyes, oversized hanging clothes on skinny frame (must look like HEALTHY 22-year-old office worker, NOT sick/addicted/homeless)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 👤 BÀ CHỦ TRỌ 55 TUỔI

> **Reference**: KHÔNG CÓ — gen đầu tiên từ prompt.
>
> **Mô tả cố định** (dùng trong MỌI prompt emotion):
> `a 55-year-old Vietnamese woman`. height **158cm**, **chunky matronly proportional body** (NOT obese, NOT thin — sturdy, grandmother-build, wider hips and shoulders than young woman). face **ROUNDER + wider** (the typical Vietnamese 55t woman face — wider jaw, shorter neck, fuller cheeks), skin **warm medium beige** (the weathered Vietnamese peasant/landlady skin tone), **NO obvious wrinkles drawn as lines** (just subtle skin shading suggesting age). hair **pulled back in a tight bun** (kiểu tóc búi củ tỏi, simple old-fashioned). Vietnamese facial features, plain. Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image. Body proportions: average Vietnamese matronly 55t woman, NOT tall, NOT skinny.
>
> **⚠️ CRITICAL**: Must look 55, NOT 35, NOT 70. Matronly but NOT frail. Neutral expression must be "slightly stern" not "sweet grandmother".

---

## 🔰 PROMPT MẪU ĐẦY ĐỦ CHO BÀ CHỦ TRỌ 55T (copy từ đây — paste vào Gemini + chỉ thay phần Expression)

> **Dùng cho cả 3 emotion**: neutral, angry, impatient. Copy khối dưới → paste Gemini → thay phần **[EXPRESSION]** bằng emotion tương ứng.
>
> ```
> Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> a 55-year-old Vietnamese woman. height 158cm, chunky matronly proportional body (NOT obese, NOT thin — sturdy, grandmother-build, wider hips and shoulders than young woman), face ROUNDER + wider (the typical Vietnamese 55t woman face — wider jaw, shorter neck, fuller cheeks), skin warm medium beige (the weathered Vietnamese peasant/landlady skin tone), NO obvious wrinkles drawn as lines (just subtle skin shading suggesting age). Hair pulled back in a tight bun (kiểu tóc búi củ tỏi, simple old-fashioned). Vietnamese facial features, plain. Small gold earrings (NOT fancy, just small chunky cartoon gold). Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image. Body proportions: average Vietnamese matronly 55t woman, NOT tall, NOT skinny. Must look 55, NOT 35, NOT 70.
>
> Full body visible (3:4 vertical portrait — head + torso + legs all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up). Plenty of white negative space above head and below feet. Standing pose, head + shoulders + torso + legs + feet + both hands all visible.
>
> Background: pure white, no elements, no shadows.
>
> [EXPRESSION]: [chèn emotion cụ thể ở đây — xem 3 emotion dưới].
>
> Aspect ratio: 3:4 vertical, white background.
>
> Negative prompt: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, elderly frail woman, young woman (must look exactly 55)
> ```

---

## Bà chủ trọ — Emotion: `neutral` (bình thường — đang nhắc nhở)

### 📄 `c5_chutro_neutral.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt nghiêm túc vừa phải, có vẻ như đang nói chuyện bình thường nhưng hơi cứng.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 55-year-old Vietnamese woman**. height **158cm**, **chunky matronly proportional body** (sturdy, grandmother-build), face **ROUNDER + wider** (wide jaw, fuller cheeks), skin **warm medium beige** (weathered), **NO obvious wrinkle lines** (subtle shading only), hair **tight bun** (củ tỏi), small **gold earrings**. Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image.
>
> **Expression: NEUTRAL (bình thường — đang nhắc nhở vừa phải)**:
> - Eyes: **open, looking at viewer**, medium-sized irises (dark brown), medium eyelids. Eyebrows: **slightly furrowed** (not angry, just "businesslike" — the "đang nói chuyện nghiêm túc" neutral).
> - Mouth: **slightly flat line** (not smiling, not frowning — neutral business tone).
> - Face: jaw firm, expression stern-but-contained.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **arms crossed** (huýt sáo kiểu nhắc nhở — serious but not threatening) hoặc **hands on hips** (the "tôi-đang-nói-chuyện-nghiêm-túc" posture). Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, elderly frail woman, young woman (must look exactly 55)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Bà chủ trọ — Emotion: `angry` (nóng giận — đòi tiền)

### 📄 `c5_chutro_angry.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt đỏ lên vì tức, mày cau có, miệng mở to.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 55-year-old Vietnamese woman**. height **158cm**, **chunky matronly proportional body**, face **ROUNDER + wider**, skin **warm medium beige**, hair **tight bun**, small gold earrings. Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image.
>
> **Expression: ANGRY (nóng giận — đòi tiền)**:
> - Eyes: **WIDE OPEN, glaring at viewer**, pupils small (angry — pupils contract), **ANGRY EYES** (eyelids pulled back hard). Eyebrows: **strongly drawn down in angry V** (classic angry face — both brows angled sharply down toward the nose).
> - Mouth: **WIDE OPEN** (mid-shouting — mouth open wide enough to show teeth, the "đang la hét" expression, but NOT stretched-unrealistically — just wide open).
> - Face: **entire face flushed red** (the angry flush — skin shading shows reddish tint on cheeks, nose, forehead), jaw dropped open.
> - Small **2-3 cartoon anger marks** above head (classic !‗ symbols).
> - **NO blush circles** (the red is angry flush, not pink circles). **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **one hand pointing accusingly** (index finger extended toward viewer), **other hand on hip** (chống nạnh). Body leaning forward aggressively. Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, elderly frail woman, young woman (must look exactly 55)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Bà chủ trọ — Emotion: `impatient` (mất kiên nhẫn — hết chờ)

### 📄 `c5_chutro_impatient.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt khó chịu, mày nhăn lại, tỏ vẻ "tao không có thời gian".

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 55-year-old Vietnamese woman**. height **158cm**, **chunky matronly proportional body**, face **ROUNDER + wider**, skin **warm medium beige**, hair **tight bun**, small gold earrings. Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image.
>
> **Expression: IMPATIENT (mất kiên nhẫn — hết chờ)**:
> - Eyes: **half-lidded, looking down at viewer** (the "tao nhìn xuống mày" expression), eyelids pulled down in disdain. Eyebrows: **one raised high, one lowered** (the classic impatient asymmetric brow — "tôi không có thời gian cho mày").
> - Mouth: **tight pressed line with corner slightly turned down** (the "khó chịu" frown — lips pressed together firmly, corners down).
> - Face: jaw jutting out slightly (defiant), expression of "tôi đã cho mày đủ thời gian rồi".
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **arms crossed tight** (hugging herself — defensive-impatient posture), weight shifted to one hip. Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, elderly frail woman, young woman (must look exactly 55)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 👤 THẰNG MINH 23 TUỔI — BẠN ĐẠI HỌC THÀNH CÔNG

> **Nền thoại Nhiệm vụ 2**: ghép sprite Minh và Tí lên `images/chuong-5/c5_bg_class_reunion_restaurant_empty.png` (BG5 trong `chuong-5-backgrounds.md`). Dùng `happy_braggy`, `casual`, `sympathetic` theo câu thoại; Tí đổi biểu cảm tương ứng. Ảnh `c5_bg_class_reunion_restaurant.png` đã có nhân vật, chỉ dùng cho đoạn kể chuyện, không ghép thêm sprite. Ảnh `bg_nhiem_vu_2.png` có chữ lớn chỉ dùng giới thiệu nhiệm vụ.

> **Reference**: KHÔNG CÓ — gen đầu tiên từ prompt.
>
> **Mô tả cố định** (dùng trong MỌI prompt emotion):
> `a 23-year-old Vietnamese man`. height **177cm** (taller than Tí by ~5cm), **rounded proportional build** (NOT muscular, NOT thin — average-rounded 23t guy, comfortable in life), face **ROUNDER + friendlier** than Tí (wider smile, softer features), skin **warm light beige** (good nutrition, well-cared-for), **NO dark circles** (completely well-rested). hair **short side-parted** (the typical 23t urban Vietnamese guy — neat, clean-cut). Vietnamese facial features, friendly. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image. Body proportions: average rounded 23t adult male, NOT tall/slender like Tí, NOT muscular.
>
> **⚠️ CRITICAL**: Must look 23, NOT 18, NOT 30. Confident/privileged vibe phải thể hiện qua outfit (silver metal-link watch on left wrist, crisp white shirt) chứ KHÔNG phải khuôn mặt kiểu "rich snob". Friendly face, average build.

---

## 🔰 PROMPT MẪU ĐẦY ĐỦ CHO THẰNG MINH 23T (copy từ đây — paste vào Gemini + chỉ thay phần Expression)

> **Dùng cho cả 3 emotion**: happy_braggy, casual, sympathetic. Copy khối dưới → paste Gemini → thay phần **[EXPRESSION]** bằng emotion tương ứng.
>
> ```
> Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> a 23-year-old Vietnamese man (Minh, age-locked 23). height 177cm (taller than Tí by ~5cm), rounded proportional build (NOT muscular, NOT thin — average-rounded 23t guy, comfortable in life, healthy weight), face ROUNDER + friendlier than Tí (wider smile, softer features, less sharp jawline), skin warm light beige (good nutrition, well-cared-for, NO dark circles — completely well-rested), hair short side-parted (the typical 23t urban Vietnamese guy — neat, clean-cut, slightly gelled at the side). Vietnamese facial features, friendly look. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image. Body proportions: average rounded 23t adult male, NOT tall/slender like Tí, NOT muscular.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, head + shoulders + torso + legs + feet + both hands all visible.
>
> Background: pure white, no elements, no shadows.
>
> [EXPRESSION]: [chèn emotion cụ thể ở đây — xem 3 emotion dưới].
>
> Aspect ratio: 3:4 vertical, white background.
>
> Negative prompt: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, slim sharp jawline (wrong for age 23 rounded build), muscular body (wrong for average 23t), realistic Vietnamese adult face, child proportions (must look exactly 23)
> ```

---

## Thằng Minh — Emotion: `happy_braggy` (vui khoe khoang)

### 📄 `c5_minh_happy_braggy.png`
**Aspect**: 3:4 vertical
**Mô tả**: Cười toe toét, tay khoe chìa khóa xe SH, mặt tự mãn.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 23-year-old Vietnamese man**. height **177cm**, **rounded proportional build** (average-rounded), face **ROUNDER + friendlier**, skin **warm light beige** (well-cared-for), **NO dark circles**, hair **short side-parted** (neat), Vietnamese facial features. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.
>
> **Expression: HAPPY BRAGGY (vui khoe khoang)**:
> - Eyes: **wide open, sparkling, looking at viewer**, big bright eyes (no tiredness, full of life), eyebrows **raised high in excitement** (both eyebrows up — "nhìn xem tao có gì").
> - Mouth: **big open grin showing teeth** (the proud smile — wide open, corners fully up, teeth visible, NOT villain smile, just happy-proud-braggy).
> - Face: **whole face bright and open** — cheeks raised, eyes squinting slightly in the smile, the whole face radiates confidence and pride. No shame, no concern, just pure "tao thành công rồi" energy.
> - **NO blush circles** (he's not embarrassed, he's proud). **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **right arm raised high** holding the **motorcycle key fob** (the SH-style smart key, red blinking dot, generic Honda logo — the icon of success), **left hand gesturing at the key**. Body language: confident, open, leaning slightly forward in excitement. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular body, thin body (must look average-rounded 23), elderly face (must look exactly 23)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Thằng Minh — Emotion: `casual` (bình thường — nói chuyện)

### 📄 `c5_minh_casual.png`
**Aspect**: 3:4 vertical
**Mô tả**: Cười thân thiện như bạn bình thường, không khoe khoang.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 23-year-old Vietnamese man**. height **177cm**, **rounded proportional build**, face **ROUNDER + friendlier**, skin **warm light beige** (well-cared-for), **NO dark circles**, hair **short side-parted** (neat), Vietnamese facial features. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.
>
> **Expression: CASUAL (bình thường — nói chuyện thân thiện)**:
> - Eyes: **open, looking at viewer**, friendly medium-sized eyes, eyebrows **relaxed neutral** (not raised, not furrowed — just "đang nói chuyện thân thiện").
> - Mouth: **small friendly smile** (gentle curve, corners up slightly — warm but not braggy).
> - Face: **relaxed and open** — the friendly face of a buddy catching up, not showing off.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, arms relaxed at sides or one hand in pocket (the casual pose). Body language: relaxed, friendly, no tension. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular body, thin body (must look average-rounded 23), elderly face (must look exactly 23)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Thằng Minh — Emotion: `sympathetic` (đồng cảm — tiếc cho Tí)

### 📄 `c5_minh_sympathetic.png`
**Aspect**: 3:4 vertical
**Mô tả**: Cười gượng nhẹ, mắt nhìn Tí có vẻ tiếc, tay đặt lên vai Tí.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 23-year-old Vietnamese man**. height **177cm**, **rounded proportional build**, face **ROUNDER + friendlier**, skin **warm light beige** (well-cared-for), **NO dark circles**, hair **short side-parted** (neat), Vietnamese facial features. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.
>
> **Expression: SYMPATHETIC (đồng cảm — tiếc cho Tí)**:
> - Eyes: **slightly sad, looking at viewer (or slightly off to side)** — the "tao tiếc cho mày" expression, medium eyelids, eyebrows **slightly knitted together in mild concern** (the sympathetic pinch — not full sadness, just "đồng cảm").
> - Mouth: **small apologetic smile** (the "xin lỗi mày" expression — slight curve, corners slightly down — not a full smile, more like a gentle rueful half-smile).
> - Face: **slightly softer** than the braggy version — the expression of a friend who genuinely feels bad for Tí but also feels a bit awkward about his own success.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **one arm extended slightly** (the sympathetic gesture — hand palm-out slightly raised, or reaching toward Tí). Body language: gentle, reaching out, compassionate. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular body, thin body (must look average-rounded 23), elderly face (must look exactly 23)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 👤 HR CÔ TY NHỎ 32 TUỔI

> **Reference**: KHÔNG CÓ — gen đầu tiên từ prompt.
>
> **Mô tả cố định** (dùng trong MỌI prompt emotion):
> `a 32-year-old Vietnamese woman`. height **162cm**, **slim proportional build** (NOT chunky, NOT skinny — average healthy Vietnamese female build), face **OVAL** (average Vietnamese female face — not wide like 55t, not tiny like 22t), skin **warm medium beige** (office-worker tone, some indoor time), **NO obvious wrinkles** (32t, still young but not fresh-grad young). hair **in a low ponytail** (professional, simple — the typical Vietnamese HR hair). Eyeglasses: **black-framed rectangular glasses** (the standard HR look). Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image. Body proportions: average slim 32t Vietnamese woman.
>
> **⚠️ CRITICAL**: Must look 32, NOT 25, NOT 45. Office-worker vibe phải thể hiện qua outfit (pencil skirt, glasses, ponytail) chứ KHÔNG phải mặt "senior corporate". Professional, neutral look.

---

## 🔰 PROMPT MẪU ĐẦY ĐỦ CHO HR 32T (copy từ đây — paste vào Gemini + chỉ thay phần Expression)

> **Dùng cho cả 3 emotion**: neutral, persuasive, resigned. Copy khối dưới → paste Gemini → thay phần **[EXPRESSION]** bằng emotion tương ứng.
>
> ```
> Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> a 32-year-old Vietnamese woman (HR cô ty nhỏ, age-locked 32). height 162cm, slim proportional build (NOT chunky, NOT skinny — average healthy Vietnamese female build), face OVAL (average Vietnamese female face — not wide like 55t, not tiny like 22t), skin warm medium beige (office-worker tone, some indoor time), NO obvious wrinkles (32t, still young but not fresh-grad young). hair in a low ponytail (professional, simple — the typical Vietnamese HR hair). Eyeglasses: black-framed rectangular glasses (the standard HR look). Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image. Body proportions: average slim 32t Vietnamese woman.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, head + shoulders + torso + legs + feet + both hands all visible.
>
> Background: pure white, no elements, no shadows.
>
> [EXPRESSION]: [chèn emotion cụ thể ở đây — xem 3 emotion dưới].
>
> Aspect ratio: 3:4 vertical, white background.
>
> Negative prompt: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, young woman (must look exactly 32, not 22)
> ```

---

## HR — Emotion: `neutral` (trung lập — đang phỏng vấn)

### 📄 `c5_hr_neutral.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt chuyên nghiệp trung lập, đang xem hồ sơ.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 32-year-old Vietnamese woman**. height **162cm**, **slim proportional build**, face **OVAL**, skin **warm medium beige**, **NO obvious wrinkles**, hair **low ponytail** (professional), black-framed **rectangular eyeglasses**. Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image.
>
> **Expression: NEUTRAL (trung lập — đang phỏng vấn)**:
> - Eyes: **open, looking at viewer through glasses**, medium-sized irises, eyebrows **relaxed neutral** (not raised, not furrowed).
> - Mouth: **small professional smile** (the HR smile — polite but not warm, the "chào ứng viên" expression).
> - Face: **relaxed, professional** — the neutral face of someone doing their job.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, arms relaxed at sides or holding a clipboard/folder (the HR's work tool). Body language: professional, approachable but not warm. Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular woman, skinny anorexic woman, elderly woman (must look exactly 32)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## HR — Emotion: `professional` (chuyên nghiệp — đang thuyết phục)

### 📄 `c5_hr_professional.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt nghiêm túc chuyên nghiệp, đang thuyết phục Tí ký hợp đồng.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 32-year-old Vietnamese woman**. height **162cm**, **slim proportional build**, face **OVAL**, skin **warm medium beige**, **NO obvious wrinkles**, hair **low ponytail**, black-framed **rectangular eyeglasses**. Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image.
>
> **Expression: PROFESSIONAL (chuyên nghiệp — đang thuyết phục)**:
> - Eyes: **focused, looking at viewer through glasses**, medium eyelids, eyebrows **slightly knitted in concentration** (focused on the sale — the "đang thuyết phục" expression).
> - Mouth: **firm professional line** (not smiling, not frowning — the business-tone mouth, slightly pressed).
> - Face: **confident and focused** — the face of someone who has done this pitch many times and knows the script.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **one hand extended** (gesturing toward a contract/paper — the convincing gesture). Body language: assertive, professional, leaning slightly forward. Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular woman, skinny anorexic woman, elderly woman (must look exactly 32)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## HR — Emotion: `slightly_pitiful` (hơi thương hại — nhìn Tí đáng thương)

### 📄 `c5_hr_slightly_pitiful.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt hơi mềm lại, mắt nhìn Tí có chút thương hại.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 32-year-old Vietnamese woman**. height **162cm**, **slim proportional build**, face **OVAL**, skin **warm medium beige**, **NO obvious wrinkles**, hair **low ponytail**, black-framed **rectangular eyeglasses**. Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image.
>
> **Expression: SLIGHTLY PITIFUL (hơi thương hại)**:
> - Eyes: **slightly sad, looking at viewer through glasses**, medium eyelids, eyebrows **slightly raised in the middle** (the "đáng thương" sympathetic brow — not full pity, just a hint of "tao thấy mày khổ thật").
> - Mouth: **small soft frown** (not quite a smile, corners slightly down — the "tao cũng không làm gì được" expression).
> - Face: **softer than the professional version** — the face of someone who knows the offer is bad but also knows Tí is desperate. She is NOT cruel, she's pragmatic.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, arms relaxed at sides or hands clasped in front (the "tao đành chịu" gesture). Body language: sympathetic but professional, slight forward lean. Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular woman, skinny anorexic woman, elderly woman (must look exactly 32)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 👤 BÁC SĨ 45 TUỔI

> **Reference**: KHÔNG CÓ — gen đầu tiên từ prompt.
>
> **Mô tả cố định** (dùng trong MỌI prompt emotion):
> `a 45-year-old Vietnamese man`. height **170cm**, **average proportional build** (NOT muscular, NOT thin — average Vietnamese doctor), face **AVERAGE VIETNAMESE MALE FACE** (not wide like 55t woman, not round like 23t guy, more oval-rectangular), skin **warm medium beige** (doctor's skin — some exhaustion but healthy), **salt-and-pepper at temples** (the iconic 45t Vietnamese male doctor hair), short hair, simple. Eyeglasses: **thin black rectangular frames**. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image. Body proportions: average 45t Vietnamese male doctor.
>
> **⚠️ CRITICAL**: Must look 45, NOT 30, NOT 60. Vietnamese BV công doctor look — salt-and-pepper temples, glasses, lab coat. NOT private-clinic "bác sĩ Hàn Quốc". Calm, professional.

---

## 🔰 PROMPT MẪU ĐẦY ĐỦ CHO BÁC SĨ 45T (copy từ đây — paste vào Gemini + chỉ thay phần Expression)

> **Dùng cho cả 3 emotion**: neutral, concerned, reassuring. Copy khối dưới → paste Gemini → thay phần **[EXPRESSION]** bằng emotion tương ứng.
>
> ```
> Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> a 45-year-old Vietnamese man (bác sĩ, age-locked 45). height 170cm, average proportional build (NOT muscular, NOT thin — average Vietnamese doctor build), face AVERAGE VIETNAMESE MALE FACE (not wide like 55t woman, not round like 23t guy, more oval-rectangular, slightly more "mature" than 30t but NOT aged-out), skin warm medium beige (doctor's skin — some exhaustion but healthy), salt-and-pepper hair at temples (the iconic 45t Vietnamese male doctor hair, the "black with some gray streaks at sides" look), short hair otherwise. Eyeglasses: thin black rectangular frames (NOT chunky, NOT round). Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image. Body proportions: average 45t Vietnamese male doctor.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, head + shoulders + torso + legs + feet + both hands all visible.
>
> Background: pure white, no elements, no shadows.
>
> [EXPRESSION]: [chèn emotion cụ thể ở đây — xem 3 emotion dưới].
>
> Aspect ratio: 3:4 vertical, white background.
>
> Negative prompt: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, private clinic Korean-style doctor (NOT that — must be Vietnamese BV công style), young man (must look exactly 45)
> ```

---

## Bác sĩ — Emotion: `neutral` (trung lập — đang khám)

### 📄 `c5_bacsi_neutral.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt tập trung chuyên nghiệp, đang xem kết quả khám.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 45-year-old Vietnamese man**. height **170cm**, **average proportional build**, face **AVERAGE VIETNAMESE MALE FACE** (oval-rectangular), skin **warm medium beige**, **salt-and-pepper at temples**, short hair, thin black **rectangular eyeglasses**. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image.
>
> **Expression: NEUTRAL (trung lập — đang khám)**:
> - Eyes: **focused, looking at viewer through glasses**, medium-sized irises, medium eyelids, eyebrows **relaxed neutral** (not worried, not relieved — just "đang làm việc").
> - Mouth: **slightly neutral line** (not smiling, not frowning).
> - Face: **professional, focused** — the neutral face of a doctor doing routine work.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **holding clipboard** in one hand (the medical chart), **other hand on hip** or at side. Body language: professional, competent, calm. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular doctor, thin anorexic man, young doctor (must look exactly 45)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Bác sĩ — Emotion: `concerned` (lo lắng — bệnh nhân nghiêm trọng)

### 📄 `c5_bacsi_concerned.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt cau mày, mắt nhìn bệnh nhân có vẻ lo, tay cầm kết quả.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 45-year-old Vietnamese man**. height **170cm**, **average proportional build**, face **AVERAGE VIETNAMESE MALE FACE**, skin **warm medium beige**, **salt-and-pepper at temples**, short hair, thin black **rectangular eyeglasses**. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image.
>
> **Expression: CONCERNED (lo lắng — bệnh nhân nghiêm trọng)**:
> - Eyes: **focused but worried, looking at viewer through glasses**, medium eyelids, eyebrows **strongly knitted together in the middle** (the "có vấn đề nghiêm trọng" worried expression — both brows raised in the center like ∧).
> - Mouth: **firm pressed line** (not open, lips pressed together — the "đang suy nghĩ nghiêm trọng" expression).
> - Face: **tense, concentrated** — the face of a doctor who has just seen something concerning in the test results. Jaw tight.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **holding clipboard against chest** (clutching the medical chart tightly), **other hand rubbing chin** (the "đang suy nghĩ" gesture). Body language: tense, focused, slightly hunched forward in concern. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular doctor, thin anorexic man, young doctor (must look exactly 45)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## Bác sĩ — Emotion: `professional_reassuring` (trấn an — bệnh nhân sẽ ổn)

### 📄 `c5_bacsi_reassuring.png`
**Aspect**: 3:4 vertical
**Mô tả**: Mặt dịu lại, mắt nhìn bệnh nhân trấn an, tay vỗ vai.

> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.
>
> **a 45-year-old Vietnamese man**. height **170cm**, **average proportional build**, face **AVERAGE VIETNAMESE MALE FACE**, skin **warm medium beige**, **salt-and-pepper at temples**, short hair, thin black **rectangular eyeglasses**. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image.
>
> **Expression: PROFESSIONAL REASSURING (trấn an — bệnh nhân sẽ ổn)**:
> - Eyes: **soft, looking at viewer through glasses**, medium eyelids, eyebrows **slightly raised** (the reassuring brow — both brows gently up, not worried, just "tao hiểu, mày sẽ ổn").
> - Mouth: **small gentle smile** (not a huge grin, just a kind reassuring smile — the "bác sĩ tốt" expression).
> - Face: **whole face softer** than the concerned version — the face of an experienced doctor who has seen this before and knows the patient will recover. Warmth in the expression.
> - **NO blush circles**. **NO tears**. **NO sweat**.
>
> Full body visible (3:4 vertical portrait — head + shoulders + torso + legs + feet all in frame, occupies ~55-70% of vertical frame height, NOT zoomed-in, NOT bust shot, NOT cropped, NOT shoulders-up, NOT waist-up). Plenty of white negative space above head and below feet. Standing pose, **one hand resting gently on the patient's shoulder** (the bedside manner gesture — reassuring physical contact). Body language: warm, calm, professional, comforting. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image.
>
> **Aspect ratio**: 3:4 vertical, white background.
>
> **Negative prompt**: text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, wrong age appearance, caucasian features, anime-stereotype Western face, Japanese anime face, K-pop face, big round eyes anime stereotype, kawaii blush circles on cheeks, muscular doctor, thin anorexic man, young doctor (must look exactly 45)

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 BẢNG TỔNG HỢP

## Tất cả emotion portraits — 16 file

| Nhân vật | Emotion | File | Ghi chú |
|---|---|---|---|
| Tí 22t | neutral | `c5_ti_neutral.png` | Đang suy nghĩ |
| Tí 22t | desperate | `c5_ti_desperate.png` | Sắp khóc |
| Tí 22t | ashamed | `c5_ti_ashamed.png` | Tự ái |
| Tí 22t | resigned | `c5_ti_resigned.png` | Đầu hàng |
| Bà chủ trọ 55t | neutral | `c5_chutro_neutral.png` | Đang nhắc nhở |
| Bà chủ trọ 55t | angry | `c5_chutro_angry.png` | Đòi tiền |
| Bà chủ trọ 55t | impatient | `c5_chutro_impatient.png` | Hết chờ |
| Thằng Minh 23t | happy_braggy | `c5_minh_happy_braggy.png` | Khoe xe |
| Thằng Minh 23t | casual | `c5_minh_casual.png` | Nói chuyện |
| Thằng Minh 23t | sympathetic | `c5_minh_sympathetic.png` | Tiếc cho Tí |
| HR 32t | neutral | `c5_hr_neutral.png` | Phỏng vấn |
| HR 32t | professional | `c5_hr_professional.png` | Thuyết phục |
| HR 32t | slightly_pitiful | `c5_hr_slightly_pitiful.png` | Thương hại |
| Bác sĩ 45t | neutral | `c5_bacsi_neutral.png` | Đang khám |
| Bác sĩ 45t | concerned | `c5_bacsi_concerned.png` | Lo lắng |
| Bác sĩ 45t | professional_reassuring | `c5_bacsi_reassuring.png` | Trấn an |

## Thứ tự gen khuyến nghị

1. **Tí 22t** — gen 4 emotion trước (vì Tí là nhân vật chính, dùng reference `c4_ti_defeated.png`)
2. **Bà chủ trọ** — gen 3 emotion
3. **Thằng Minh** — gen 3 emotion
4. **HR Cô ty nhỏ** — gen 3 emotion
5. **Bác sĩ** — gen 3 emotion
