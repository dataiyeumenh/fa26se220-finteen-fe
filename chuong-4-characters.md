# 🎭 CHƯƠNG 4 — CHARACTER EMOTION PORTRAITS

> **MỤC ĐÍCH**: Tách riêng file emotion portraits (nhân vật 3:4 trên nền trắng) cho Chương 4 — **sinh viên năm cuối / Thực tập sinh** (Tí 22 tuổi). Dùng cho **dialogue** scene khi 2 nhân vật nói chuyện qua lại với nhau.
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Mọi emotion phải dùng **CHÍNH XÁC** style token earnest teen (giống Chương 1-3) — KHÔNG dùng 1:2.5 kawaii chibi. Tí 22t là **sinh viên năm cuối ĐI THỰC TẬP (vẫn còn trong trường, chưa ra trường — chỉ mới đi thực tập tại công ty IT + làm đồ án tốt nghiệp)** → **head-to-body 1:4-1:5, NO blush circles, NO kawaii baby-face**.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi prompt là **KHỐI TỰ CHỨA ĐẦY ĐỦ** — copy nguyên khối `[Style token + Character reference đầy đủ + Expression + Aspect]` là dán vào Gemini là chạy được. KHÔNG cần tra cứu thêm ở đâu khác.

---

# 📐 KIẾN TRÚC VISUAL NOVEL — LOẠI ẢNH DIALOGUE

> 🎮 **Game này là Visual Novel kiểu Ren'Py / VN Studio**. Khi có thoại nói chuyện qua lại giữa 2 nhân vật, scene thuộc loại `dialogue`.
>
> | Loại scene VN | Sprite nhân vật | Background | Loại ảnh gen |
> |---|---|---|---|
> | **`type: 'dialogue'`** (có đối thoại giữa 2+ nhân vật) | ✅ Render sprite riêng | BG trống (xem file `chuong-4-backgrounds.md`) | **PORTRAIT sprite** (1 nhân vật đứng một mình, nền trắng) |
>
> 📌 File này chỉ chứa **PORTRAIT SPRITE 3:4** — ảnh nền trắng của từng nhân vật với từng emotion. React engine sẽ ghép 2 portrait lên BG trống (xem file `chuong-4-backgrounds.md`).

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 4)

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt |
|---|---|---|---|
| Tí | **22** | 🇻🇳 Việt Nam | `a 22-year-old Vietnamese man` |
| NV Ngân hàng | **30** | 🇻🇳 Việt Nam | `a 30-year-old Vietnamese man` |
| Scammer | **24** | 🇻🇳 Việt Nam | `a 24-year-old Vietnamese man` |
| Giảng viên | **50** | 🇻🇳 Việt Nam | `a 50-year-old Vietnamese woman` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các emotion của cùng 1 nhân vật.

### Bảng emotion cần gen

| Nhân vật | Số emotion | Danh sách emotion |
|---|---|---|
| Tí 22t | **5** | neutral, tempted, anxious, defeated, hopeful |
| NV Ngân hàng | **3** | neutral, friendly_sales, pressuring |
| Scammer | **3** | neutral, predatory, convincing |
| Giảng viên | **3** | neutral, strict, kind |

> **Tổng: 14 emotion portraits** (1 nhân vật × emotion × 4 nhân vật)
> Tất cả đều aspect **3:4 vertical**, nền trắng trơn.

---

# 🎨 STYLE TOKEN — CHUNG CHO MỌI EMOTION PORTRAIT

> **⚠️ KHÁC VỚI BIBLE GỐC**: Bible cũ dùng 1:2.5 kawaii chibi, nhưng dự án này đã chốt dùng **earnest teen proportions 1:3.5-1:5** từ Chương 1 → phải giữ nhất quán. KHÔNG copy style từ `image-generation-bible.md` mục 1.4 (đó là style cũ).

```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

### Anti-distortion CRITICAL block (áp dụng cho MỌI emotion)

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions —
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
realistic Vietnamese adult face, child proportions (must look exactly 22)
```

---

# 🔗 CROSS-REFERENCE — ẢNH GỐC CẦN UPLOAD KÈM

> 🎯 **QUAN TRỌNG**: Khi gen emotion, **LUÔN upload ảnh reference gốc** để giữ đúng khuôn mặt, tóc, da, vóc dáng.

| Nhân vật chương 4 | Upload reference | Ghi chú |
|---|---|---|
| Tí 22t | `c3_ti_neutral.png` (Tí 19t sinh viên) | height **172cm (cao hơn 19t 4cm) + gầy hơn 19t 1 chút (thực tập vất vả) + sạch sẽ hơn (đi làm nên gọn gàng hơn) + mặt dài hơn (22t trưởng thành hơn 19t) + dark circles NHẸ HƠN 19t (mặc định mắt SẠNH — chỉ thêm nhẹ khi tired/defeated) + tóc NGẮN gọn slicked-back nhẹ (ĐỔI từ side part 19t — 22t đi làm phải gọn gàng hơn) + áo sơ mi TRẮNG (ĐỔI từ áo thun xám 19t) + cà vạt xanh đậm (THÊM MỚI — đi làm) + quần tây đen (ĐỔI từ jeans 19t) + giày tây đen (ĐỔI từ sneaker 19t) + **BADGE công ty cài ngực trái** (THÊM MỚI) |
| NV Ngân hàng | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 30t, đàn ông Việt Nam, vest chỉnh tề, tie, badge, mặt niềm nở sales |
| Scammer | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 24t, đàn ông Việt Nam, tóc vuốt bóng, suit đen bóng, dây chuyền vàng, mặt cáo |
| Giảng viên | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 50t, phụ nữ Việt Nam, áo blouse lịch sự, tóc búi, kính, mặt nghiêm |

---

# 👥 CÁC NHÂN VẬT CHÍNH TRONG CHƯƠNG 4 (CÓ THOẠI)

| ID | Tên nhân vật | Tuổi cố định | Vai trò | Scene có thoại |
|---|---|---|---|---|
| `ti` | Tí | **22** | Thực tập sinh IT (đang làm đồ án tốt nghiệp + đi thực tập), sống trọ (height **172cm**, áo sơ mi **TRẮNG** + cà vạt xanh + quần tây đen + giày tây đen + **BADGE** công ty cài ngực trái, tóc NGẮN gọn slicked-back, mặt dài thanh trưởng thành, dark circles NHẸ (mặc định mắt SẠCH — chỉ thêm nhẹ khi tired/defeated) |
| `nvnganhang` | NV Ngân hàng | **30** | Nhân viên ngân hàng tư vấn trả góp 0% (vest xanh đen, tie đỏ, badge ngân hàng) | Scene 1 (Laptop cứu tinh) |
| `scammer` | Scammer | **24** | Bạn cũ ĐH, giới thiệu cơ hội đầu tư "30%/tháng" (lừa đảo) | Scene 3 (Cạm bẫy) |
| `giangvien` | Giảng viên | **50** | Giảng viên môn chuyên ngành, trả bài thi cho Tí | Scene 4 (Rớt môn) |

> 📌 **Phân chia cảnh**:
> - **Scene 5.1**: Tí ↔ NV Ngân hàng (ký hợp đồng trả góp laptop 18tr)
> - **Scene 5.2**: Tí + UI phone (BNPL — không thoại nhưng Tí có emotion)
> - **Scene 5.3**: Tí ↔ Scammer (mời đầu tư 30%/tháng)
> - **Scene 5.4**: Tí + Giảng viên (nhận bài thi rớt môn)

**4 nhân vật CÓ THOẠI qua lại**:
- Tí ↔ NV Ngân hàng (Scene 5.1)
- Tí ↔ Scammer (Scene 5.3)
- Tí ↔ Giảng viên (Scene 5.4)
- Scene 5.2 chỉ Tí + UI (BNPL — không cần NPC)

---

# 📋 PHẦN A — TÍ 22 TUỔI (5 EMOTION)

## 📄 TÍ NEUTRAL — `c4_ti_neutral.png`

**📍 Dùng cho**: emotion mặc định khi Tí nói chuyện bình thường, giới thiệu bản thân, đi làm sáng
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Full character reference**: **a 22-year-old Vietnamese man (Tí, age-locked at 22, EXACTLY 22 YEARS OLD — university senior / intern)**. Phải nhìn rõ rệt già hơn Tí 19t tham chiếu — height **172cm (cao hơn 19t 4cm)**, mature slim build, **face LONGER + sharper jawline + CLEAN FRESH EYES (under-eye area SÁNG sạch, NO dark circles, NO eye bags, NO under-eye shadows — mắt bình thường, healthy rested)**, **hair NGẮN gọn slicked-back nhẹ với gel tự nhiên (ĐỔI từ side part 19t — 22t đi làm phải gọn gàng hơn)**, soft warm light beige sạch sẽ skin, Vietnamese facial features (flat nose bridge, oval face matured, single eyelid, monolid eye shape), **small mole không có** (mặt sạch).
>
> **Outfit (ĐỒ ĐI LÀM THỰC TẬP — KHÁC 19t)**: **crisp WHITE button-up dress shirt** (hex #ffffff, collar, ĐỔI từ áo thun xám 19t) + **thin DARK-BLUE tie** (hex #1a2b4a, slightly loosened — đang đi làm thực tập), **slim-fit BLACK formal pants** (hex #1a1a1a, ĐỔI từ jeans 19t), **polished BLACK leather derby shoes** (hex #1a1a1a, ĐỔI từ sneaker 19t). **OFFICE ID BADGE clipped to left chest** (badge nhỏ hình chữ nhật, generic stylized — NO real text, NO real logo, NO real company name, chỉ là khối màu nhỏ). KHÔNG balo (22t đi làm cầm túi xách hoặc cặp).
>
> **Specific emotion**: NEUTRAL — calm tired professional face, eyebrows at rest position, mouth closed in soft natural line, eyes looking forward calmly, slight hint of stress from work. Calm tired-intern vibe.
>
> **Pose**: STANDING UPRIGHT, full body visible from head to toe, both arms relaxed at sides, looking at camera with a neutral tired-but-composed expression.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 TÍ TEMPTED — `c4_ti_tempted.png`

**📍 Dùng cho**: Tí bị cám dỗ trước laptop 18tr (Scene 1), trước BNPL 10tr (Scene 2), trước scam 30%/tháng (Scene 3)
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Full character reference**: **a 22-year-old Vietnamese man (Tí, age-locked at 22)**. Height **172cm**, mature slim build, **face LONGER + sharper jawline + CLEAN FRESH EYES (under-eye area SÁNG sạch, NO dark circles, NO eye bags — temptation là 1 emotion PHẤN KHÍCH, không phải mệt mỏi)**, hair NGẮN slicked-back nhẹ, soft warm light beige skin, Vietnamese facial features, sạch.
>
> **Outfit (ĐỒ ĐI LÀM THỰC TẬP — KHÁC 19t)**: **crisp WHITE button-up dress shirt** (hex #ffffff) + **thin DARK-BLUE tie** (hex #1a2b4a, slightly loosened), **slim-fit BLACK formal pants** (hex #1a1a1a), **polished BLACK leather derby shoes** (hex #1a1a1a). **OFFICE ID BADGE clipped to left chest**. KHÔNG balo.
>
> **Specific emotion**: **TEMPTED GREEDY FLICKER** — eyes looking at something off-frame (LÊN PHẢI — gợi đang nhìn giá/màn hình), **small upward curve at one corner of mouth** (greedy tempted half-smile), eyebrows slightly raised, **2 small kawaii money symbols** floating near his head (small ✨$ sparkle, generic cartoon money symbols — NOT real money), **NO blush circles**, **2 small sweat drops** on temples (excitement + temptation), face proportions STAY NORMAL.
>
> **Pose**: STANDING UPRIGHT, full body visible, head turned slightly 3/4 as if looking at something, body angled toward the temptation.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 TÍ ANXIOUS — `c4_ti_anxious.png`

**📍 Dùng cho**: Tí lo lắng về tiền trả góp, lo về kỳ thi cuối kỳ (trước khi rớt)
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Full character reference**: **a 22-year-old Vietnamese man (Tí, age-locked at 22)**. Height **172cm**, mature slim build, face LONGER + sharper jawline + **CLEAN FRESH EYES (under-eye area vẫn SÁNG sạch — anxious chỉ lo lắng tạm thời về tương lai, KHÔNG có dark circles vì Tí lo lắng 1 giây, chưa ngủ thiếu)** (KHÔNG thêm dark circles ở anxious), **hair NGẮN slicked-back nhẹ với gel (GIỮ NGUYÊN slicked-back nguyên vẹn — Tí 22t đi làm phải gọn gàng, KHÔNG được disheveled/ messy/ bù xù dù lo lắng đến đâu)**, soft warm light beige skin, Vietnamese facial features, sạch.
>
> **Outfit (ĐỒ ĐI LÀM THỰC TẬP)**: **crisp WHITE button-up dress shirt** (hex #ffffff) + **thin DARK-BLUE tie** (hex #1a2b4a, slightly loosened), **slim-fit BLACK formal pants** (hex #1a1a1a), **polished BLACK leather derby shoes** (hex #1a1a1a). **OFFICE ID BADGE clipped to left chest**.
>
> **Specific emotion**: **ANXIOUS WORRIED STRESSED** — eyes slightly wider than normal (still natural kawaii size, NOT bug-eyed), eyebrows raised and drawn together in worry pinch, **small flat worried mouth** (small downturned line), **3 small cartoon sweat drops** on forehead + temples + cheek, **2-3 cartoon worry lines** near eyebrows, **NO blush circles**, slight paler skin from stress, slight trembling visible (subtle, NOT exaggerated). Face proportions STAY NORMAL.
>
> **Pose**: STANDING UPRIGHT, full body visible, both hands fidgeting — one hand gripping the other wrist nervously.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 TÍ DEFEATED — `c4_ti_defeated.png`

**📍 Dùng cho**: Tí nhận bài thi rớt (Scene 4), Tí cầm offer lương rẻ (Chương 5 — reference cho tương lai)
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Full character reference**: **a 22-year-old Vietnamese man (Tí, age-locked at 22)**. Height **172cm**, mature slim build, face LONGER + sharper jawline + **CLEAN FRESH EYES (under-eye area SÁNG sạch — defeated là emotional defeat nhận bài rớt, KHÔNG phải mệt mỏi thể chất, KHÔNG có dark circles, KHÔNG có eye bags)** (KHÔNG thêm dark circles ở defeated), **hair NGẮN slicked-back nhẹ với gel (GIỮ NGUYÊN slicked-back nguyên vẹn — Tí 22t đi làm phải gọn gàng, KHÔNG được disheveled/ messy/ bù xù dù shock hay defeated đến đâu — chỉ có thể 1-2 strands hơi lệch nhẹ nếu muốn)**, soft warm light beige skin (slightly paler now from defeat), Vietnamese facial features, sạch.
>
> **Outfit (ĐỒ ĐI LÀM THỰC TẬP — hơi nhàu sau cả ngày dài)**: **crisp WHITE button-up dress shirt** (hex #ffffff, slightly wrinkled at sleeves and collar from a long day) + **thin DARK-BLUE tie** (hex #1a2b4a, pulled down even more loosely than normal), **slim-fit BLACK formal pants** (hex #1a1a1a), **polished BLACK leather derby shoes** (hex #1a1a1a). **OFFICE ID BADGE clipped to left chest** (slightly crooked now).
>
> **Specific emotion**: **DEFEATED HOLLOW GRIEF** — eyes DOWNCAST looking at floor (NOT at viewer), eyelids lowered, eyebrows drawn together at the inner corner in sad pinch, **small downturned frown**, **1 single small cartoon tear drop** in corner of left eye (1 tiny tear, NOT crying, NOT multiple), **NO blush circles**, **3 small sweat drops** on forehead + temples. Face proportions STAY NORMAL — do NOT enlarge head, do NOT stretch face, do NOT bug-eye out. The expression reads "I just failed / I just received bad news" — quiet internal defeat, NOT loud screaming.
>
> **Pose**: STANDING UPRIGHT but shoulders SLUMPED, full body visible, both arms hanging limp at sides (KHÔNG cầm gì), head slightly bowed.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 TÍ HOPEFUL — `c4_ti_hopeful.png`

**📍 Dùng cho**: Tí vừa ký hợp đồng trả góp laptop (nghĩ mình sắp có laptop xịn), Tí vừa được nhận vào thực tập
**Aspect**: 3:9 vertical *(fixed: 3:4)*

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Full character reference**: **a 22-year-old Vietnamese man (Tí, age-locked at 22)**. Height **172cm**, mature slim build, face LONGER + sharper jawline + **CLEAN FRESH EYES (under-eye area SÁNG sạch, NO dark circles, NO eye bags — hopeful là 1 emotion TÍCH CỰC, mắt phải sáng và rested)** (KHÔNG thêm dark circles ở hopeful), hair NGẮN slicked-back nhẹ, soft warm light beige skin, Vietnamese facial features, sạch.
>
> **Outfit (ĐỒ ĐI LÀM THỰC TẬP)**: **crisp WHITE button-up dress shirt** (hex #ffffff) + **thin DARK-BLUE tie** (hex #1a2b4a, slightly loosened), **slim-fit BLACK formal pants** (hex #1a1a1a), **polished BLACK leather derby shoes** (hex #1a1a1a). **OFFICE ID BADGE clipped to left chest**.
>
> **Specific emotion**: **HOPEFUL OPTIMISTIC SMALL JOY** — eyes slightly brighter (NOT bug-eyed, NOT sparkling kawaii, just a small glint of hope), eyebrows at rest, **small soft smile at corners of mouth** (NOT big grin, NOT laughing — a quiet hopeful smile), **2 small sparkle ✨ symbols** floating near his head (small kawaii sparkles), **NO blush circles**, NO sweat drops. Face proportions STAY NORMAL.
>
> **Pose**: STANDING UPRIGHT with shoulders slightly more relaxed than defeated, full body visible, one hand lightly touching his tie (subtle confident gesture).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 PHẦN B — NV NGÂN HÀNG 30 TUỔI (3 EMOTION)

> **NHÂN VẬT MỚI — KHÔNG CÓ reference**. Gen đầu tiên từ prompt, không cần upload ảnh kèm.
>
> **Character cố định**: 30 tuổi, đàn ông Việt Nam trẻ trung, height 175cm, build cân đối (không quá gầy không quá béo), da sáng trung bình kiểu dân văn phòng, tóc đen ngắm ngắm vuốt gọn kiểu banker, mặt tươi cười niềm nở kiểu sales, **vest xanh đen (charcoal suit)** + áo sơ mi trắng + **cà vạt đỏ đô** + giày tây đen bóng + **BADGE ngân hàng** cài ngực trái (badge hình chữ nhật nhỏ, generic stylized — không logo thật).

## 📄 NV NGÂN HÀNG NEUTRAL — `c4_nvnganhang_neutral.png`

**📍 Dùng cho**: NV giới thiệu sản phẩm trả góp
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 30-year-old Vietnamese man (nhân viên ngân hàng — banker, age-locked 30)**, height **175cm**, balanced average young-professional build (NOT fat, NOT skinny), warm light-tan office-worker skin (hex #e8c8a8 — sáng hơn da ngoài trời, da dân văn phòng), short black hair neatly combed with light gel (kiểu tóc banker gọn gàng professional, NGẮN gọn vuốt nhẹ sang bên, KHÔNG slicked-back quá bóng), friendly mature eyes (NORMAL-sized — NOT giant kawaii eyes — this is a 30-year-old professional), small natural eyebrows, oval face with soft jawline (mature, NOT baby-face), clean-shaven. Outfit: **charcoal-blue slim-fit suit (blazer + matching pants, hex #2a3a4a, chất vải tốt)**, **white dress shirt** (hex #ffffff, crisp collar), **dark-red silk tie** (hex #8b1a1a, knotted neatly), **polished black oxford shoes** (hex #1a1a1a), **leather belt**, **generic stylized bank ID BADGE clipped to left chest** (small rectangular badge, generic — NO real logo, NO real text, NO real bank name). Expression: **NEUTRAL PROFESSIONAL — small polite business smile**, eyebrows at rest, eyes calm and observant. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, one hand lightly resting at side, other hand holding a generic stylized folder (small chunky cartoon folder with placeholder text lines, NO real text).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 NV NGÂN HÀNG FRIENDLY_SALES — `c4_nvnganhang_friendly_sales.png`

**📍 Dùng cho**: NV đang mời chào Tí ký hợp đồng trả góp
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 30-year-old Vietnamese man (nhân viên ngân hàng)**, height **175cm**, balanced build, warm light-tan office-worker skin (hex #e8c8a8), short black hair neatly combed with light gel, friendly mature eyes (NORMAL-sized — NOT giant kawaii eyes), small natural eyebrows, oval face with soft jawline, clean-shaven. Outfit: **charcoal-blue slim-fit suit** (hex #2a3a4a), **white dress shirt** (hex #ffffff), **dark-red silk tie** (hex #8b1a1a), **polished black oxford shoes** (hex #1a1a1a), **generic bank ID BADGE clipped to left chest**. Expression: **FRIENDLY SALESY — wide professional smile** (mouth showing teeth in a polished sales grin, NOT creepy, NOT predatory — just standard sales-enthusiasm), eyebrows slightly raised in excitement, **1 small sparkle ✨ symbol** floating near his head (kawaii style, indicating his "great deal" pitch). Pose: **STANDING UPRIGHT, full body visible, body leaning slightly FORWARD toward viewer** (classic sales "lean in"), **one hand extended holding a pen** offering it to viewer, **other hand holding a generic stylized installment contract paper** (a chunky cartoon paper with placeholder text — "TRẢ GÓP 0%" written in bold cartoon letters, generic placeholder — NO real bank name).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 NV NGÂN HÀNG PRESSURING — `c4_nvnganhang_pressuring.png`

**📍 Dùng cho**: NV giục Tí ký gấp vì "khuyến mãi hết hạn hôm nay"
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 30-year-old Vietnamese man (nhân viên ngân hàng)**, height **175cm**, balanced build, warm light-tan office-worker skin (hex #e8c8a8), short black hair neatly combed with light gel, friendly mature eyes (NORMAL-sized — NOT giant kawaii eyes), small natural eyebrows, oval face with soft jawline, clean-shaven. Outfit: **charcoal-blue slim-fit suit** (hex #2a3a4a), **white dress shirt** (hex #ffffff), **dark-red silk tie** (hex #8b1a1a), **polished black oxford shoes** (hex #1a1a1a), **generic bank ID BADGE clipped to left chest**. Expression: **PRESSURING URGENT — small polite smile but with slightly furrowed brows showing urgency** (NOT angry, NOT aggressive — just sales-pressure "kí đi kí đi"), mouth slightly open mid-speech, **2-3 small sweat drops** on his temple (he's also under pressure from his KPI), **1 small ⏰ clock symbol** floating near his head (urgency symbol — generic stylized clock, NOT real brand). Pose: **STANDING UPRIGHT, full body visible, body leaning MORE FORWARD**, **one hand pointing at the contract paper** insistently, **other hand still holding pen offering it**.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 PHẦN C — SCAMMER 24 TUỔI (3 EMOTION)

> **NHÂN VẬT MỚI — KHÔNG CÓ reference**. Gen đầu tiên từ prompt, không cần upload ảnh kèm.
>
> **Character cố định**: 24 tuổi, đàn ông Việt Nam (bạn cũ ĐH của Tí), height 178cm, build hơi gầy nhưng ăn mặc sang (kiểu bóng bẩy), da sáng kiểu thành phố, tóc đen slicked-back bóng, **đeo DÂY CHUYỀN VÀNG** mỏng, **Suit đen bóng** (expensive suit) + áo sơ mi đen không cà vạt (cổ mở 1 khuy), mặt cáo cười nửa miệng, có vẻ nguy hiểm.

## 📄 SCAMMER NEUTRAL — `c4_scammer_neutral.png`

**📍 Dùng cho**: Scammer chào Tí bình thường ở quán cafe
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 24-year-old Vietnamese man (scammer — former classmate of Tí, age-locked 24)**, height **178cm**, slim lean build (slightly thin, NOT muscular, NOT fat — bóng bẩy bên ngoài nhưng ốm bên trong), warm light urban skin (hex #e8c8a8, fair from city life), **slicked-back SHINY black hair** with heavy gel (kiểu tóc vuốt ngược bóng loáng, very glossy, slick look), **thin GOLD CHAIN visible at collar** (small subtle gold necklace peeking out from shirt collar — generic stylized, NO real pendant), **slightly narrow sharp eyes** with a hint of cunning (NORMAL-sized — NOT giant kawaii eyes — this is a 24-year-old adult man), thin sharp eyebrows, oval face with sharper jawline (more angular than Tí — this guy is trying to look sophisticated), light 1-day stubble. Outfit: **shiny BLACK expensive slim-fit suit** (hex #1a1a1a, slightly more reflective than normal — looks expensive), **black dress shirt** (hex #1a1a1a, NO tie, top button unbuttoned showing the gold chain), **polished black shoes** (hex #1a1a1a). Expression: **NEUTRAL — small sly closed-mouth smile** (NOT grinning, NOT wide smile — a small "I know something you don't" smirk), eyebrows at rest, eyes calm but watching. Pose: **STANDING UPRIGHT, full body visible, looking at camera with that sly vibe**, both hands hanging at sides, weight shifted slightly to one leg (hip cocked).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 SCAMMER PREDATORY — `c4_scammer_predatory.png`

**📍 Dùng cho**: Scammer nhìn Tí như mồi, đang "đánh hơi"
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 24-year-old Vietnamese man (scammer — former classmate of Tí)**, height **178cm**, slim lean build, warm light urban skin (hex #e8c8a8), slicked-back SHINY black hair, **thin GOLD CHAIN at collar**, narrow sharp eyes, thin sharp eyebrows, oval face with sharper jawline, light 1-day stubble. Outfit: **shiny BLACK expensive slim-fit suit** (hex #1a1a1a), **black dress shirt** (hex #1a1a1a, NO tie, top button unbuttoned showing the gold chain), **polished black shoes** (hex #1a1a1a). Expression: **PREDATORY HUNGRY** — **1-sided smirk** (ONLY the LEFT corner of the mouth pulled up, NOT both corners — like a predator eyeing prey), **one eyebrow raised**, **eyes looking down at viewer with calculated intent** (pupils positioned in the lower part of the eye, NOT looking at camera), chin tilted slightly UP. **1 small sparkle ✨** near his gold chain (suggesting his "bling" is the bait), **NO blush circles**. Face proportions STAY NORMAL — do NOT bug-eye out.
>
> **Pose**: STANDING UPRIGHT, full body visible, one hand in suit pocket, other hand dangling his smartphone showing a glowing red investment notification.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 SCAMMER CONVINCING — `c4_scammer_convincing.png`

**📍 Dùng cho**: Scammer đang thuyết phục Tí "30%/tháng chắc chắn 100%"
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 24-year-old Vietnamese man (scammer — former classmate of Tí)**, height **178cm**, slim lean build, warm light urban skin (hex #e8c8a8), slicked-back SHINY black hair, **thin GOLD CHAIN at collar**, narrow sharp eyes, thin sharp eyebrows, oval face with sharper jawline, light 1-day stubble. Outfit: **shiny BLACK expensive slim-fit suit** (hex #1a1a1a), **black dress shirt** (hex #1a1a1a, NO tie, top button unbuttoned showing the gold chain), **polished black shoes** (hex #1a1a1a). Expression: **CONVINCING SINCERE-FAKE — wide persuasive smile** (mouth showing teeth in a calculated salesman grin, eyes squinting slightly with "sincerity"), eyebrows raised in mock-honesty, **3-4 small "$$$" money symbols** floating near his head (cartoon kawaii money signs — generic stylized, NOT real money), **NO blush circles**. The smile is **slightly too wide** — almost clown-like — that's the giveaway that he's scamming. Face proportions STAY NORMAL.
>
> **Pose**: STANDING UPRIGHT, full body visible, **one hand pointing AT viewer** (scolding gesture toward camera), **other hand holding his open smartphone** showing a glowing red investment chart with green up-arrow.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 PHẦN D — GIẢNG VIÊN 50 TUỔI (3 EMOTION)

> **NHÂN VẬT MỚI — KHÔNG CÓ reference**. Gen đầu tiên từ prompt, không cần upload ảnh kèm.
>
> **Character cố định**: 50 tuổi, nữ giảng viên ĐH Việt Nam, height 158cm, build thanh mảnh kiểu trí thức, da sáng hồng hào kiểu dân văn phòng nhiều năm, tóc đen có gáy búi gọn (low bun) với vài sợi bạc ở thái dương, **đeo KÍNH** (gọng kim loại mảnh, vuông nhỏ), mặt nghiêm trọng kiểu giáo sư, **áo blouse thanh lịch** + chân váy đen dài qua gối + giày bệt.

## 📄 GIẢNG VIÊN NEUTRAL — `c4_giangvien_neutral.png`

**📍 Dùng cho**: GV trả bài thi bình thường
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 50-year-old Vietnamese woman (giảng viên ĐH — university professor, age-locked 50)**, height **158cm**, slim mature intellectual build (NOT fat, NOT frail, NOT skinny — slim scholarly mature woman), warm light urban pale skin (hex #f0d8c0 — sáng hồng hào kiểu dân văn phòng, NOT tanned from outdoor), **short BLACK hair pulled into a low neat bun** at the nape (gọn gàng lịch sự, a few silver strands at temples), small **THIN METAL-FRAME GLASSES** (square small frame, professional), kind mature almond-shaped eyes (NORMAL-sized — NOT giant kawaii eyes — this is a 50-year-old adult woman), small natural thin eyebrows, oval face with soft jawline (mature scholar face, NOT round, NOT square), small light lipstick. Outfit: **elegant blouse** (hex #d4e8e8, pale blue-mint, button-up collar, lịch sự), **long dark skirt** (hex #2a2a3a, dài qua gối), **low black flat shoes** (hex #1a1a1a). Expression: **NEUTRAL — composed academic face, small polite closed-mouth smile**, eyebrows at rest, eyes calm and observant. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, both hands at sides, one hand lightly holding a stack of generic cartoon exam papers.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 GIẢNG VIÊN STRICT — `c4_giangvien_strict.png`

**📍 Dùng cho**: GV trả bài thi rớt cho Tí với vẻ mặt nghiêm khắc
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 50-year-old Vietnamese woman (giảng viên ĐH)**, height **158cm**, slim mature intellectual build, warm light urban pale skin (hex #f0d8c0), short BLACK hair low neat bun (silver strands at temples), small **THIN METAL-FRAME GLASSES** (square small frame), mature eyes (NORMAL-sized — NOT giant kawaii eyes), small natural thin eyebrows, oval face with soft jawline, small light lipstick. Outfit: **elegant blouse** (hex #d4e8e8), **long dark skirt** (hex #2a2a3a), **low black flat shoes** (hex #1a1a1a). Expression: **STRICT DISAPPOINTED — eyebrows drawn down firmly**, mouth in a flat determined line (no smile — this is disappointment mode), eyes sharp and serious behind glasses. **NO blush circles**. Pose: **STANDING UPRIGHT, full body visible**, **one hand extended FORWARD holding out a single cartoon exam paper with a big red "FAILED" stamp** (generic stylized stamp — NO real text, just a chunky cartoon red X mark on a paper), **other hand behind her back** (formal scolding posture).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 GIẢNG VIÊN KIND — `c4_giangvien_kind.png`

**📍 Dùng cho**: GV an ủi Tí "đăng ký học lại đi, cố gắng lên"
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> ```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:3.5 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải huge round sparkly eyes với 2 large white circle highlights, KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như người thật), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs).
```

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.

CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.
```

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality, 3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features, dark circles under eyes, eye bags, dark under-eye area, heavy under-eye shadows, eye hollows, exhausted eyes, sleepy tired eyes
```
>
> **Setting**: **a 50-year-old Vietnamese woman (giảng viên ĐH)**, height **158cm**, slim mature intellectual build, warm light urban pale skin (hex #f0d8c0), short BLACK hair low neat bun (silver strands at temples), small **THIN METAL-FRAME GLASSES** (square small frame), mature eyes (NORMAL-sized — NOT giant kawaii eyes — this is a 50-year-old adult woman), small natural thin eyebrows, oval face with soft jawline, small light lipstick. Outfit: **elegant blouse** (hex #d4e8e8), **long dark skirt** (hex #2a2a3a), **low black flat shoes** (hex #1a1a1a). Expression: **KIND GENTLE COMPASSIONATE — soft warm smile** (closed-mouth, NOT wide grin — a gentle kind academic smile), eyebrows soft and slightly raised in empathy, eyes warm behind glasses. **NO blush circles**. Pose: **STANDING UPRIGHT, full body visible**, **one hand extended palm-up toward viewer in a "you can do it" gesture**, **other hand holding the stack of papers at her side**.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 BẢNG TỔNG HỢP

| # | Filename | Nhân vật | Tuổi | Emotion | Aspect | Dùng ở cốt truyện |
|---|---|---|---|---|---|---|
| 1 | `c4_ti_neutral.png` | Tí 22t | 22 | neutral | 3:4 | Mặc định mọi dialogue Tí |
| 2 | `c4_ti_tempted.png` | Tí 22t | 22 | tempted | 3:4 | Scene 1, 2, 3 (bị cám dỗ) |
| 3 | `c4_ti_anxious.png` | Tí 22t | 22 | anxious | 3:4 | Lo về trả góp, lo thi |
| 4 | `c4_ti_defeated.png` | Tí 22t | 22 | defeated | 3:4 | Scene 4 (rớt môn), offer rẻ |
| 5 | `c4_ti_hopeful.png` | Tí 22t | 22 | hopeful | 3:4 | Sau khi ký HĐ trả góp |
| 6 | `c4_nvnganhang_neutral.png` | NVNH | 30 | neutral | 3:4 | Mặc định NVNH |
| 7 | `c4_nvnganhang_friendly_sales.png` | NVNH | 30 | friendly_sales | 3:4 | Mời ký HĐ |
| 8 | `c4_nvnganhang_pressuring.png` | NVNH | 30 | pressuring | 3:4 | Giục ký gấp |
| 9 | `c4_scammer_neutral.png` | Scammer | 24 | neutral | 3:4 | Mặc định scammer |
| 10 | `c4_scammer_predatory.png` | Scammer | 24 | predatory | 3:4 | Đánh hơi mồi |
| 11 | `c4_scammer_convincing.png` | Scammer | 24 | convincing | 3:4 | Thuyết phục "30%/tháng" |
| 12 | `c4_giangvien_neutral.png` | GV | 50 | neutral | 3:4 | Mặc định GV |
| 13 | `c4_giangvien_strict.png` | GV | 50 | strict | 3:4 | Trả bài rớt |
| 14 | `c4_giangvien_kind.png` | GV | 50 | kind | 3:4 | An ủi |

**Tổng: 14 emotion portraits** (5 Tí + 3 NVNH + 3 Scammer + 3 GV)

---

# 🔑 QUY TẮC STYLE BẮT BUỘC

> **⚠️ MỌI emotion trong file này phải tuân theo quy tắc dưới đây — vi phạm sẽ ra ảnh sai art style.**

### Về STYLE TOKEN
- **BẮT BUỘC** dùng **earnest teen proportions 1:3.5-1:5** (giống Chương 1-3)
- **KHÔNG** dùng 1:2.5 kawaii chibi từ `image-generation-bible.md` mục 1.4 (style cũ)
- **BẮT BUỘC** thêm block **Anti-distortion CRITICAL + Framing rule** (đã nhúng sẵn ở mỗi prompt)
- **NOT** realistic, semi-realistic, cinematic-photorealistic, 3D, Pixar

### Về NHÂN VẬT TRONG EMOTION
- Mỗi prompt emotion đã **TỰ CHỨA ĐẦY ĐỦ** character reference — copy là chạy, không cần tra cứu
- **Tí 22t**: dùng character reference từ `c3_ti_neutral.png` (Tí 19t mặc áo thun xám + jeans xanh nhạt + tóc side part) — **height 172cm (cao hơn 19t 4cm) + face LONGER + sharper jawline + dark circles NHẸ HƠN 19t (mặc định mắt SẠNH — chỉ thêm nhẹ khi tired/defeated) + tóc NGẮN slicked-back nhẹ (ĐỔI từ side part 19t) + áo sơ mi TRẮNG + cà vạt XANH ĐẬM + quần tây ĐEN + giày tây ĐEN + BADGE công ty cài ngực trái** — KHÔNG dùng reference từ `image-generation-bible.md` mục 1.4 (style kawaii cũ)
- **NV Ngân hàng 30t**: nhân vật MỚI — 175cm, balanced build, light-tan office skin, charcoal-blue suit + white shirt + dark-red tie + black oxford shoes + bank badge — KHÔNG có reference nào khác
- **Scammer 24t**: nhân vật MỚI — 178cm, slim lean build, light urban skin, slicked-back shiny hair, gold chain, shiny black suit + black shirt (no tie) — KHÔNG có reference nào khác
- **Giảng viên 50t**: nhân vật MỚI — 158cm, slim mature build, light pale skin, low black bun + silver strands, thin metal-frame glasses, elegant pale-blue blouse + dark skirt + flat shoes — KHÔNG có reference nào khác
- **Face proportions** phải giữ NHẤT QUÁN giữa các emotion của cùng 1 nhân vật

### Về ASPECT RATIO
- Tất cả emotion portrait: **3:4 vertical**
- **KHÔNG BAO GIỜ** dùng 16:9, 1:1 cho emotion portrait (chỉ dùng 3:4)
- Lưu PNG nền trắng đầy đủ 3:4 (không xóa nền — React engine tự xử lý)

### Về LOGIC NHẤT QUÁN GIỮA CÁC EMOTION
- Style kawaii phải GIỐNG HỆT giữa các emotion của cùng 1 nhân vật (cùng head-to-body ratio, cùng eye style, cùng outline thickness)
- **Outfit** giữ NGUYÊN giữa các emotion của cùng 1 nhân vật (trừ khi prompt yêu cầu thay đổi tự nhiên theo emotion như tay áo cuộn lên khi angry, tóc rối khi tired)
- **Face identity** phải NHẤT QUÁN — cùng kiểu mắt, cùng kiểu mũi, cùng kiểu miệng, cùng hình dáng mặt qua mọi emotion

---

# 📌 CHECKLIST GIAO ĐỒNG ĐỘI

### Phase 1 — Gen 5 emotion Tí 22t
- [ ] Upload `c3_ti_neutral.png` (Tí 19t gốc) làm reference
- [ ] Gen `c4_ti_neutral.png` TRƯỚC → upload làm reference cho 4 emotion sau
- [ ] Gen `c4_ti_tempted.png` → `c4_ti_anxious.png` → `c4_ti_defeated.png` → `c4_ti_hopeful.png`
- [ ] Đảm bảo face identity NHẤT QUÁN qua 5 emotion (luôn upload `c4_ti_neutral.png` đã gen làm reference cho 4 emotion sau)
- [ ] **LƯU Ý**: Tí 22t KHÔNG đeo balo (ĐỔI từ 19t) — đi làm thực tập cầm túi xách/cặp

### Phase 2 — Gen 3 emotion NV Ngân hàng 30t (NHÂN VẬT MỚI)
- [ ] KHÔNG CÓ reference — gen đầu tiên từ prompt
- [ ] Gen `c4_nvnganhang_neutral.png` TRƯỚC → upload làm reference cho 2 emotion sau
- [ ] Gen `c4_nvnganhang_friendly_sales.png` → `c4_nvnganhang_pressuring.png`
- [ ] Đảm bảo face identity + outfit + body NHẤT QUÁN qua 3 emotion

### Phase 3 — Gen 3 emotion Scammer 24t (NHÂN VẬT MỚI)
- [ ] KHÔNG CÓ reference — gen đầu tiên từ prompt
- [ ] Gen `c4_scammer_neutral.png` TRƯỚC → upload làm reference cho 2 emotion sau
- [ ] Gen `c4_scammer_predatory.png` → `c4_scammer_convincing.png`
- [ ] Đảm bảo face identity + outfit + body NHẤT QUÁN qua 3 emotion

### Phase 4 — Gen 3 emotion Giảng viên 50t (NHÂN VẬT MỚI)
- [ ] KHÔNG CÓ reference — gen đầu tiên từ prompt
- [ ] Gen `c4_giangvien_neutral.png` TRƯỚC → upload làm reference cho 2 emotion sau
- [ ] Gen `c4_giangvien_strict.png` → `c4_giangvien_kind.png`
- [ ] Đảm bảo face identity + outfit + body NHẤT QUÁN qua 3 emotion

### Lưu ý cuối
- [ ] MỖI PROMPT EMOTION copy nguyên khối ⭐⭐⭐ là dùng được — không cần tra cứu block character reference ở đâu khác
- [ ] Tất cả 14 file phải là PNG 3:4 nền trắng đầy đủ
- [ ] **KHÔNG dùng style 1:2.5 kawaii chibi từ bible cũ** — phải dùng earnest teen 1:3.5-1:5 cho đồng nhất với Chương 1-3
