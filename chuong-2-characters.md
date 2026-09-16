# 🎭 CHƯƠNG 2 — EMOTION MAP & PROMPT LIST (NHÂN VẬT LỚN LÊN)
> **"Học sinh Cấp 3 ở thị trấn huyện" — Tí 16 tuổi**
>
> File này dành cho **đồng đội** (artist / designer / dev). Mỗi emotion của từng nhân vật trong Chương 2 đều có **prompt Gen ảnh riêng** + **filename chuẩn** + **giải thích dùng ở đoạn hội thoại nào**.
>
> **⚠️ QUAN TRỌNG — DÙNG ẢNH CHƯƠNG 1 LÀM REFERENCE**: Tất cả nhân vật lớn lên ở Chương 2 (Tí/Tèo/Hùng từ 13t → 16t, Mẹ từ 35t → 38t) đều dùng **ảnh chương 1 làm reference** trong Gemini để giữ phong cách nhân vật, chỉ áp dụng thay đổi về tuổi + trưởng thành. **Mỗi prompt đã ghi rõ upload ảnh nào.**
>
> **📁 Xem thêm**:
> - `chuong-1-emotion-map.md` — Nhân vật chương 1 (Tí 13t, Tèo 13t, Hùng 13t, Mẹ 35t, Bố 40t, Cô Tư 35t) — đây là ảnh nguồn để upload kèm khi gen nhân vật chương 2
> - `chuong-2-backgrounds.md` — Background + Scene (composite) cho chương 2

---

## 📐 QUY ƯỚC ĐỌC NHANH

### Cấu trúc mỗi prompt
```
📄 filename — emotion — dùng ở đoạn...
🔗 Upload reference: [ảnh chương 1 nào]
> [⭐ BẮT ĐẦU PROMPT ⭐] Style token + Full character reference (đã nâng cấp lên tuổi mới) + Specific emotion + Pose + Lighting [⭐ KẾT THÚC PROMPT ⭐]
```

### Cách gen trong Gemini
1. **Upload ảnh reference** được ghi trong block **🔗 Upload reference**
2. **Copy nguyên khối prompt** từ `⭐ BẮT ĐẦU PROMPT ⭐` đến `⭐ KẾT THÚC PROMPT ⭐`
3. Paste vào Gemini cùng với ảnh reference đã upload
4. AI sẽ giữ phong cách nhân vật + áp dụng thay đổi tuổi/trưởng thành mới

### ⚠️ LƯU Ý QUAN TRỌNG: TẠI SAO GEN RA "y chang" VÀ CÁCH KHẮC PHỤC

**❌ Vấn đề thường gặp**: Khi upload ảnh reference 13 tuổi + paste prompt, AI thường **giữ nguyên y chang** tỉ lệ cơ thể + kiểu tóc + chiều cao của ảnh reference, chỉ thay đổi rất nhỏ. Nguyên nhân:
- AI ưu tiên "character consistency" hơn "age progression"
- Prompt mô tả tuổi mới bị "lờ mờ" so với ảnh reference trực quan

**✅ Cách khắc phục** (đã áp dụng trong file này):

1. **Dùng keyword mạnh "AGE PROGRESSION"** ngay đầu prompt — đánh dấu rõ đây là tác vụ lớn lên, không phải gen mới
2. **Thêm khối "WHAT TO CHANGE"** dạng liệt kê bullet rõ ràng — AI đọc sẽ biết phải thay đổi gì
3. **Thêm khối "WHAT TO KEEP"** — chỉ giữ phong cách khuôn mặt, không giữ tóc/cơ thể
4. **Thêm NEGATIVE phủ định cụ thể**: "do NOT keep the same proportions, do NOT keep the same short 13-year-old haircut"
5. **Mô tả lại chi tiết 16 tuổi** NGAY SAU dòng "reference uploaded" — để AI đối chiếu
6. **So sánh tương quan** ("TALLER than reference by 18cm", "hair LONGER than reference by 2-4cm")

**⚠️ MẸO QUAN TRỌNG**: Nếu sau khi gen vẫn "y chang", thử 1 trong 3 cách sau:
- **Cách A**: Thêm câu "The reference image is from 3 YEARS AGO. Show the character NOW at 16 — clearly older, taller, with longer teenage hair."
- **Cách B**: Upload thêm 1 ảnh khác (real photo của 1 nam sinh Việt Nam 16 tuổi) làm **size/age reference** phụ
- **Cách C**: Tăng "strength" của prompt tuổi mới lên — ghi "AGE 16 (NOT 13, NOT 15, EXACTLY 16 YEARS OLD)" in hoa nhiều lần

### Quy ước đặt tên file (NAMING CONVENTION)
```
[chapter]_[character]_[context]_[emotion].png

Ví dụ:
- c2_ti_neutral.png          → Chương 2, Tí, neutral default
- c2_ti_school_tempted.png   → Chương 2, Tí, ở trường, bị cám dỗ
- c2_hung_invite_smug.png    → Chương 2, Hùng, ở sân trường, rủ tự tin
```

---

# 🎨 STYLE TOKEN — CHARACTER PORTRAIT (sprite)

```
Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark.
```

### CRITICAL blocks (áp dụng MỌI prompt)

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
NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and
below feet.
```

### Negative prompt (CHARACTER PORTRAIT)
```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality,
3D render, photorealistic, chibi, ugly, background scenery, environment, floor,
ground, room interior, outdoor scene, building, tree, sky, shadow on background,
gradient background, colored background, busy background, scenery, backdrop,
furniture, props, anything behind the character, East Asian (Japanese/Korean/Chinese)
features, wrong age appearance, caucasian features, anime-stereotype Western face,
Japanese anime face, K-pop face, big round eyes anime stereotype,
slim sharp jawline (wrong for 16-year-old Vietnamese boy), tall muscular body
(wrong for lean 16-year-old), realistic Vietnamese adult face on teen characters,
child proportions (must look exactly 16), brand new clothes, fashion model outfit
```

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 2)

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt | Có reference chương 1? | Đổi gì so với chương 1 |
|---|---|---|---|---|---|
| Tí | **16** | 🇻🇳 Việt Nam | `a 16-year-old Vietnamese boy` | ✅ `c1_ti_neutral.png` | Tăng chiều cao (150→170cm), tóc hơi dài hơn 1 chút (3-4cm, vẫn ngắn gọn kiểu VN), thêm đồng phục cấp 3, gầy hơn (cao lên chứ không béo lên), bớt baby fat |
| Mẹ Tí | **38** | 🇻🇳 Việt Nam | `a 38-year-old Vietnamese woman` | ✅ `c1_me_neutral.png` | **BỎ — không gen Mẹ 38t, dùng lại ảnh chương 1 nếu cần minh họa (Mẹ 35→38 khác rất ít, không đáng gen lại, tránh rủi ro AI gen sai như vụ Tí)** |
| Hùng | **16** | 🇻🇳 Việt Nam | `a 16-year-old Vietnamese boy` | ✅ `c1_hung_neutral.png` | Tăng chiều cao (150→172cm), tóc slicked-back style teenage, đồng phục cấp 3 |
| Cô Hiệu trưởng | **50** | 🇻🇳 Việt Nam | `a 50-year-old Vietnamese woman` | ❌ KHÔNG (nhân vật mới) | N/A — gen trực tiếp, không cần upload reference |
| Tèo | **16** | 🇻🇳 Việt Nam | `a 16-year-old Vietnamese boy` | ✅ `c1_teo_neutral.png` | Tăng chiều cao, tóc mohawk dài hơn chút, hoodie cam |
| Bố Tí | **40** | 🇻🇳 Việt Nam | `a 40-year-old Vietnamese man` | ✅ `c1_bo_neutral.png` | Giữ nguyên — không xuất hiện ở chương 2 |
| Cô Tư | **35** | 🇻🇳 Việt Nam | `a 35-year-old Vietnamese woman` | ✅ `c1_cotu_neutral.png` | Giữ nguyên — không xuất hiện ở chương 2 |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các emotion của cùng 1 nhân vật.

### 🎒 QUY TẮC BA LÔ (Tí 16t ở Chương 2)

| Cốt truyện | Có ba lô? | Lý do |
|---|---|---|
| Ở phòng trọ / trong nhà / nằm liệt giường | ❌ KHÔNG | Trong nhà |
| Đi học / tan học / đi đường | ✅ CÓ | Đi học cả ngày cần đồ |
| Bán hàng ở sạp Mẹ (đêm) | ❌ KHÔNG (giấu dưới quầy) | Đang làm việc |
| Đi xem phim cuối tuần | ✅ CÓ | Đi chơi xa |

> **Mặc định**: Tí 16t ở neutral state **KHÔNG đeo ba lô** — đây là trạng thái mặc định khi không có cốt truyện cụ thể.

### Aspect ratio + mapping theo loại scene VN

| Loại ảnh | Tỉ lệ | Loại scene VN dùng | Đặc điểm |
|---|---|---|---|
| **Character portrait** (sprite — 1 nhân vật) | 3:4 vertical | `type: 'dialogue'` | Nhân vật đứng một mình, nền trắng → xóa nền bằng remove.bg → ghép vào background |
| **Cinematic scene** (composite có sẵn cảnh + nhân vật) | 16:9 ngang | `type: 'narrator'` | Toàn cảnh Việt Nam, có nhân vật Việt trong ảnh — KHÔNG render sprite riêng (xem `chuong-2-backgrounds.md`) |

---

# 👥 CÁC NHÂN VẬT XUẤT HIỆN Ở CHƯƠNG 2

| ID | Tên nhân vật | Tuổi cố định | Quốc tịch | Vai trò | Số emotion cần gen | Reference chương 1 |
|---|---|---|---|---|---|---|
| `ti` | Tí (nhân vật chính) | **16** | 🇻🇳 Việt Nam | Học sinh cấp 3 — quản lý chi tiêu | **9 emotions** | ✅ `c1_ti_neutral.png` |
| `me` | Mẹ Tí | **38** | 🇻🇳 Việt Nam | Bán đồ ăn vặt ở sạp cổng trường | **BỎ** (giữ reference chương 1, Mẹ 35→38 không đáng gen lại) | — |
| `hung` | Hùng (bạn cùng lớp cấp 3) | **16** | 🇻🇳 Việt Nam | Con nhà giàu, rủ xem phim | **4 emotions** | ✅ `c1_hung_neutral.png` |
| `hieutruong` | Cô Hiệu trưởng | **50** | 🇻🇳 Việt Nam | Trao giấy khen lễ tổng kết | **3 emotions** | ❌ KHÔNG (mới) |
| `teo` | Tèo (bạn thân) | **16** | 🇻🇳 Việt Nam | Bạn cùng lớp cấp 3 | **0** (chỉ nhắc tên trong thoại, không xuất hiện) | — |
| `bo` | Bố Tí | **40** | 🇻🇳 Việt Nam | Ở quê | **0** | — |
| `cotu` | Cô Tư | **35** | 🇻🇳 Việt Nam | Ở quê | **0** | — |

> **Tổng cộng**: **16 emotion prompts** cho riêng Chương 2 (Tí 9 + Hùng 4 + Cô Hiệu trưởng 3 — Mẹ Tí BỎ)

---

# 📋 QUY TẮC TÁI SỬ DỤNG ẢNH CHƯƠNG 1

> **Quy tắt cứng — áp dụng cho TOÀN BỘ chương 2:**
>
> | Loại nhân vật | Xử lý ở chương 2 |
> |---|
> | **Nhân vật phụ ít xuất hiện** (Mẹ Tí, Bố Tí, Cô Tư, Tèo) | **TÁI SỬ DỤNG ảnh chương 1** (KHÔNG gen mới — tiết kiệm thời gian + giữ visual continuity, vì họ không thay đổi nhiều giữa chương 1 và 2) |
> | **Nhân vật chính có AGE PROGRESSION** (Tí 13t→16t, Hùng 13t→16t) | **GEN MỚI 16t** từ reference 13t chương 1 (BẮT BUỘC — phải thấy sự khác biệt về tuổi) |
> | **Nhân vật mới** (Cô Hiệu trưởng 50t) | **GEN MỚI từ đầu** (không có reference chương 1) |
>
> **Lưu ý**: Nếu Mẹ Tí hoặc Bố Tí CẦN xuất hiện trong cảnh chương 2 (ví dụ: flashback, cảnh gia đình, điện thoại) → designer **dùng lại ảnh chương 1**, KHÔNG gen lại ảnh 38t/40t.

---

# 😐 PHẦN 1 — TRẠNG THÁI BÌNH THƯỜNG (NEUTRAL / IDLE STATES)

> **Mỗi nhân vật PHẢI có 1 ảnh neutral** → dùng làm **default portrait** khi đang đọc thoại bình thường, không có emotion cụ thể.
>
> **Đặc điểm**:
> - Mặt thư giãn tự nhiên, **không cười không khóc**
> - Mắt mở bình thường, **không nhướn mày không nhíu mày**
> - Tư thế **đứng/ngồi thoải mái**, không gồng
> - Phù hợp làm **ảnh mặc định** trong dialogue box visual novel
>
> **Filename convention**: `c2_[character]_neutral.png`

---

## 📄 `c2_ti_neutral.png` — TÍ — BÌNH THƯỜNG (neutral ở phòng trọ)
**Dùng ở đoạn**: Mặc định cho mọi đoạn thoại của Tí không có emotion cụ thể (VD: Tí nghĩ thầm, monologue nội tâm).
**Outfit**: Casual everyday — **plain white or light gray short-sleeve t-shirt (simple, clean, age-appropriate for a 16-year-old)**, **plain dark navy or black cotton shorts (knee-length, simple), white low-cut sneakers or simple sandals** (Tí 16t mặc đồ bình thường như một cậu bé cấp 3 Việt Nam — đi học về hay đi chơi đều mặc đồ đơn giản, KHÔNG còn áo vàng quần xanh như hồi cấp 2 nữa)

**🔗 Upload reference**: **`c1_ti_neutral.png`** (ảnh Tí 13 tuổi từ chương 1)
> AI sẽ giữ nguyên phong cách khuôn mặt + kiểu tóc, chỉ áp dụng thay đổi:
> - Tăng chiều cao 150cm → **170cm**
> - Thay gầy → **lean teenage build, gầy hơn 13t một chút, cao lên chứ không béo lên**
> - Bớt baby fat trên mặt, khuôn mặt dài hơn một chút (hint mature nhưng vẫn rõ ràng 16t)
> - Tóc: vẫn short layered kiểu Việt Nam, nhưng **hơi dài hơn reference một chút (3-4cm all around), fringe ngắn gọn 2-3cm** (vẫn short practical cut, KHÔNG shaggy anime dài rủ xuống trán)
> - Outfit: **plain white or light gray short-sleeve t-shirt (simple, clean, fitted, age-appropriate for a 16-year-old Vietnamese high school boy — NOT the yellow t-shirt from age 13, this is NEW older-teen clothing), plain dark navy or black cotton shorts (knee-length, simple, fitted), simple white sneakers or sandals** (Tí 16t mặc đồ bình thường như một cậu bé cấp 3 Việt Nam — đơn giản gọn gàng, KHÔNG còn áo vàng quần xanh như hồi cấp 2)
> - KHÔNG ba lô (đang ở phòng trọ)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **⚠️⚠️⚠️ AGE PROGRESSION TASK — CRITICAL READ THIS FIRST ⚠️⚠️⚠️**
>
> **The uploaded reference image is Tí at age 13 (3 YEARS AGO). The output MUST be Tí at age 16 (3 YEARS OLDER, NOW). This is an AGE PROGRESSION task — the character MUST visibly grow up.**
>
> **❌ DO NOT COPY THE REFERENCE.** DO NOT keep the same proportions. DO NOT keep the same short 13-year-old haircut. DO NOT keep the same 150cm short height.
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE (READ CAREFULLY)**:
> - **Head:body ratio**: 1:2.5 (chibi kid) → **1:3.5 (taller teen proportions — body LONGER, legs LONGER, neck LONGER, NOT chibi anymore)**
> - **Height**: 150cm → **170cm** (TALLER by 20cm — character must look CLEARLY TALLER, taller than 13-year-old reference)
> - **Body build**: skinny 13-year-old kid → **lean 16-year-old teenager with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS** (visible long legs typical of teens growth spurt, NOT the short stubby chibi limbs of reference)
> - **Haircut**: short layered 2-3cm → **vẫn ngắn nhưng hơi dài hơn một chút (3-4cm all around), fringe ngắn gọn 2-3cm (KHÔNG dài rủ xuống trán như anime Nhật — kiểu con trai Việt Nam 16t thực tế đi học cấp 3 vẫn để tóc ngắn gọn practical)**
> - **Face**: round baby-fat cheeks → face LOSING ALL baby-fat, **oval face shape, visible jawline forming, face LONGER (not round anymore)**, clearly older teen
> - **Outfit fit**: old worn casual clothes → **plain white short-sleeve t-shirt + navy shorts (simple, fitted, age-appropriate for a 16-year-old Vietnamese high school boy — NOT the same casual clothes from age 13, this is NEW older-teen clothing)**
>
> **✅ FINAL TARGET**: A clearly 16-year-old Vietnamese high school boy with TEEN proportions (NOT chibi kid proportions), NOT a copy of the 13-year-old reference.
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body is NOTICEABLY LONGER than chibi kid style, with visible longer legs and longer torso, head proportionally SMALLER relative to body than a typical chibi kid)** (small-ish head, longer body, longer legs typical of 16-year-old teen), long limbs (NOT stubby), normal-sized round sparkly eyes (NOT huge oversized chibi eyes — eyes are proportionate to TEEN face, smaller relative to face than chibi kid), thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NOT chibi kid proportions (head:body 1:2.5 with huge head + stubby limbs) — character MUST have TEEN proportions (head:body 1:3.5 with smaller head + longer body + longer legs). **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 16-year-old Vietnamese boy (Tí, age-locked at 16, Vietnamese nationality — NOT 13, NOT 15, EXACTLY 16 YEARS OLD)** living away from home to attend high school in a small-town Vietnam, height **170cm (20cm TALLER than the 13-year-old reference)**, **lean 16-year-old teenage build — taller and slimmer than the 13-year-old reference (NOT muscular, NOT chubby, NOT the same skinny-kid proportions as the reference), slim limbs typical of Vietnamese teenage boys who grew up skinny** (visible thin arms, narrow bony shoulders becoming slightly broader than at 13, thin legs, NOT athletic, NOT buff), soft warm light beige cute-friendly skin with slight sun exposure (NOT pale urban kid, NOT tanned farm worker — middle ground typical small-town high school boy, SAME skin tone as reference but matured), **typical Vietnamese high school boy facial features — slightly flat and wider nose bridge (NOT pointy Japanese-style nose — SAME as reference), soft round face STARTING TO SLIM DOWN from baby-fat cheeks of the reference (still a touch of youth but CLEARLY OLDER than 13, with HINT OF JAWLINE FORMING), single eyelid or shallow double eyelid (NOT large Western-style double eyelids — SAME as reference), monolid-friendly eye shape (SAME as reference), mouth slightly wide with natural-looking lips (SAME as reference)**, **Vietnamese high school boy haircut (HƠI DÀI hơn reference một chút chứ vẫn ngắn gọn kiểu Việt Nam — short layered cut about 3-4cm all around the head (CHỈ HƠI DÀI hơn reference 2-3cm một chút, vẫn là short practical cut), fringe cũng NGẮN GỌN khoảng 2-3cm phía trước trán (KHÔNG dài rủ xuống che lông mày như anime Nhật — kiểu con trai Việt Nam thực tế đi học cấp 3), tóc hơi nhọn ở đỉnh đầu một chút nhưng vẫn gọn gàng practical), hair looks natural and soft with NO gel, NO wax, NO pomade, NO slicked-back, NO neat combed, NO gelled spikes, NO anime-stereotype messy fringe. The cut is a typical Vietnamese rural lower-secondary-to-high-school boy haircut from the 2010s-2020s — practical, short, gọn gàng, age-appropriate for a 16-year-old boy. NOT spiky, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun, NOT long fringe covering eyebrows, NOT shaggy anime hair.**, **16-year-old teenage boy face — round but starting to mature (OLDER-LOOKING than the 13-year-old reference), HINT OF JAWLINE FORMING (NOT baby-fat anymore), bright thoughtful eyes like a 9th-grader (SAME eye shape as reference but with hint of maturity), big round black-brown eyes (NOT oversized anime-stereotype round eyes, more natural proportion with hint of maturity compared to 13-year-old version)**, narrow-but-broadening shoulders (BROADER than reference's narrow child shoulders), thin limbs starting to show slight teenage definition (LONGER and SLIMMER than reference). Clearly looks 16 years old — hint of jawline, NO facial hair (still too young for stubble), teenage-young face, head still slightly larger relative to body (kawaii proportions), but CLEARLY MORE GROWN-UP than the 13-year-old reference image.
>
> **Outfit — FIXED CANONICAL COLORS**: **plain white short-sleeve t-shirt (hex #f5f5f5 — simple clean white cotton), plain dark navy cotton shorts (hex #2a2f3d, knee-length, properly fitted), simple white low-cut sneakers (hex #ffffff, plain rubber soles, minimal design)**. Tí 16t mặc đồ bình thường như một cậu bé cấp 3 Việt Nam đi chơi/ở phòng trọ. **KHÔNG còn áo vàng quần xanh như hồi cấp 2 nữa.** **NO backpack, NO bag — Tí ở phòng trọ, KHÔNG đeo balo.** Balo chỉ xuất hiện ở emotion có cốt truyện đi học/đi đường dài.
>
> **Specific emotion**: NEUTRAL — relaxed natural default face, eyebrows at rest position, mouth closed in soft natural line, eyes looking forward calmly, no particular emotion showing. Hint of homesick pensiveness (since he's now living alone in a rental dorm away from family).
>
> **Pose**: standing naturally with both arms relaxed at sides, full body visible from head to toe, facing camera straight-on, weight evenly distributed on both feet, very slight slouch typical of a tired high school boy studying late. **Character is the ONLY element in the image — pure plain white background, nothing else visible.**
>
> **Lighting**: **flat even studio lighting, no directional sunlight, no environment shadows, no golden hour warmth — just clean neutral studio lighting on a plain white seamless backdrop.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 🔁 FULL PROMPTS — 8 EMOTION CÒN LẠI CỦA TÍ 16T

> **⚠️ LƯU Ý**: 8 emotion sau đây là **FULL COPY-PASTE READY** (giống format `c2_ti_neutral.png`).
> Chỉ cần copy nguyên khối từ ⭐ BẮT ĐẦU PROMPT ⭐ đến ⭐ KẾT THÚC PROMPT ⭐.
>
> **🔒 QUY TẮC CỐ ĐỊNH CHO ĐỒNG PHỤC CẤP 3**:
> - Áo sơ mi trắng ngắn tay (ironed, neat collar, tucked into pants)
> - Quần dài navy (#2a2f3d, long pants NOT shorts, ironed)
> - Cà vạt lụa đỏ (#cc2222) — neatly knotted với Windsor knot, tip reaches belt
> - Thắt lưng da đen + khóa bạc đơn giản
> - Giày sneaker trắng (clean white low-cut, white rubber soles, spotless)
> - **CÓ balo đỏ** (red backpack) khi đi học/tan học
> - **KHÔNG balo** khi ở phòng trọ

| # | Filename | Emotion | Outfit | Balo | Dùng ở |
|---|---|---|---|---|---|
| 2 | `c2_ti_neutral_school.png` | Neutral ở trường | Đồng phục cấp 3 đầy đủ | ✅ | Default Tí ở trường |
| 3 | `c2_ti_school_tempted.png` | Bị cám dỗ (Flash Sale) | Đồng phục cấp 3 | ❌ | Mission 2.2 |
| 4 | `c2_ti_school_conflicted.png` | Do dự (Hùng rủ xem phim) | Đồng phục cấp 3 | ✅ | Mission 2.3 |
| 5 | `c2_ti_dorm_shocked.png` | Sốc (mất xe) | Casual home (áo thun + short) | ❌ | Life Event 2 |
| 6 | `c2_ti_stage_proud.png` | Tự hào (nhận giấy khen) | Đồng phục cấp 3 | ❌ | Mission 2.4 |
| 7 | `c2_ti_dorm_tired.png` | Mệt mỏi (sau 1 ngày) | Casual home | ❌ | Narrator |
| 8 | `c2_ti_dorm_determined.png` | Quyết tâm (mở đầu chương 3) | Casual home | ❌ | Cuối chương 2 |
| 9 | `c2_ti_dorm_relieved.png` | Nhẹ nhõm (mẹ gọi) | Casual home | ❌ | Mẹ động viên |

---

## 📄 `c2_ti_neutral_school.png` — TÍ — NEUTRAL (ở trường, mặc đồng phục)

**Dùng ở đoạn**: Default cho mọi đoạn thoại của Tí khi ở trường cấp 3 (lúc đi học, ra cổng trường, đứng sân trường).

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in school uniform, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, bright thoughtful eyes**.
>
> **Outfit — VIETNAMESE SCHOOL UNIFORM (ĐỒNG PHỤC CẤP 3 CHUẨN)**:
> - **White short-sleeved dress shirt** (hex #ffffff, clean cotton, ironed, neat pointed collar, tucked into pants)
> - **Navy blue long pants** (hex #2a2f3d, long pants to ankle, ironed)
> - **Red silk tie** (hex #cc2222, neatly knotted with Windsor knot, tip reaches belt buckle)
> - **Black leather belt** (simple black leather belt with plain silver rectangular buckle)
> - **White sneakers** (hex #ffffff, clean low-cut canvas sneakers, white rubber soles, white laces, spotless)
> - **Red backpack** (simple red student backpack, worn on both shoulders)
>
> **Specific emotion**: **NEUTRAL at school** — relaxed natural default face, eyebrows at rest position, mouth closed in soft natural line, eyes looking forward calmly. Standing in front of school (background pure white, no gate visible).
>
> **Pose**: standing naturally facing forward, **red backpack worn on both shoulders** (both straps on shoulders, backpack sits neatly behind), two hands relaxed naturally at sides, full body visible from head to toe. Weight evenly distributed on both feet, slight relaxed posture.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_ti_school_tempted.png` — TÍ — BỊ CÁM DỖ (ở lớp, thấy Flash Sale)

**Dùng ở đoạn**: Mission 2.2 — Tí mở điện thoại ở lớp, thấy Flash Sale giày thể thao giảm 70%, mắt mở to longingly muốn mua.

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in school uniform, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, bright thoughtful eyes**.
>
> **Outfit — VIETNAMESE SCHOOL UNIFORM (ĐỒNG PHỤC CẤP 3 CHUẨN)**:
> - **White short-sleeved dress shirt** (hex #ffffff, clean cotton, ironed, neat pointed collar, tucked into pants)
> - **Navy blue long pants** (hex #2a2f3d, long pants to ankle, ironed)
> - **Red silk tie** (hex #cc2222, neatly knotted, tip reaches belt buckle)
> - **Black leather belt** (simple black leather belt with plain silver rectangular buckle)
> - **White sneakers** (hex #ffffff, clean low-cut canvas sneakers, white rubber soles, white laces, spotless)
> - **NO backpack** (in classroom, backpack stored under desk)
>
> **Specific emotion**: **TEMPTED LONGING** — eyes WIDE OPEN with longing sparkle (large shiny highlights in eyes showing temptation), eyebrows raised slightly (the "wow!" expression), mouth slightly open in a small "oh..." of desire, one hand holding smartphone up at chest level (looking at Flash Sale screen), the other hand clenching at side (suppressing the urge). Soft blush circles on cheeks with slight increase.
>
> **Pose**: standing slightly leaning forward, one hand holding smartphone up at chest level (showing stylized cartoon phone screen with sneaker icon and red SALE tag, generic design, no brand logo), other hand clenched in fist at side, full body visible from head to toe, facing 3/4 view to camera, slight lean toward the phone.
>
> **Lighting**: flat even studio lighting on plain white backdrop. Phone screen emits slight soft glow on face.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_ti_school_conflicted.png` — TÍ — DO DỰ (Hùng rủ xem phim)

**Dùng ở đoạn**: Mission 2.3 — Hùng vỗ vai Tí cười hô hớ rủ đi xem phim cuối tuần → Tí do dự vì lo tiền.

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in school uniform, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, bright thoughtful eyes**.
>
> **Outfit — VIETNAMESE SCHOOL UNIFORM (ĐỒNG PHỤC CẤP 3 CHUẨN)**:
> - **White short-sleeved dress shirt** (hex #ffffff, clean cotton, ironed, neat pointed collar, tucked into pants)
> - **Navy blue long pants** (hex #2a2f3d, long pants to ankle, ironed)
> - **Red silk tie** (hex #cc2222, neatly knotted, tip reaches belt buckle)
> - **Black leather belt** (simple black leather belt with plain silver rectangular buckle)
> - **White sneakers** (hex #ffffff, clean low-cut canvas sneakers, white rubber soles, white laces, spotless)
> - **Red backpack** (simple red student backpack, worn on both shoulders)
>
> **Specific emotion**: **CONFLICTED TORN** — eyebrows furrowed with worry (NOT angry, NOT sad — just confused torn between yes/no), eyes looking DOWN at the ground (avoiding eye contact because conflicted), lips pressed together in a small worried line, one hand scratching the back of head (cartoon "I don't know" gesture), the other hand clutching backpack strap nervously. Slight sweat drop on temple.
>
> **Pose**: standing in front of school (background pure white), weight shifted to one leg, one hand raised scratching back of head, other hand clutching red backpack strap at chest level. Full body visible from head to toe, facing 3/4 view to camera, slight downward tilt of head.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_ti_dorm_shocked.png` — TÍ — SỐC (mất xe đạp)

**Dùng ở đoạn**: Life Event 2 — Tí về phòng trọ, mở cửa thấy chỗ để xe đạp TRỐNG → sốc.

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in casual home outfit, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, bright eyes**.
>
> **Outfit — CASUAL HOME (ở phòng trọ, KHÔNG đồng phục)**:
> - **White short-sleeved t-shirt** (plain white cotton t-shirt, simple clean, NOT the school uniform shirt — just a regular home t-shirt)
> - **Navy blue shorts** (knee-length, simple cotton shorts, hex #2a2f3d)
> - **Simple plastic flip-flops** (simple sandals — casual home footwear)
> - **NO backpack, NO school uniform, NO sneakers**
>
> **Specific emotion**: **SHOCKED STUNNED** — eyes WIDE OPEN with small pupils (large round eyes showing the whites, tiny pupil dots in center for shocked look, sparkly highlights indicating disbelief), eyebrows raised HIGH up (shock — eyebrows lifted way up), mouth open in classic "O" shape (small round mouth, NOT stretched wide, NOT screaming — this is shocked silent gasp), both hands placed on top of head (cartoon "oh no" gesture — both palms flat on top of hair, fingers spread). Light sweat drops on temples. Slight pale tone on cheeks (shock pallor).
>
> **Pose**: standing in the middle of an empty space (background pure white), both hands placed on top of head, knees slightly bent (the "weak knees" of shock), body slightly leaning back. Full body visible from head to toe, facing 3/4 view to camera.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_ti_stage_proud.png` — TÍ — TỰ HÀO (nhận giấy khen)

**Dùng ở đoạn**: Mission 2.4 — Tí đứng trên sân khấu lễ tổng kết, một tay giơ cao tờ giấy khen, tay kia cầm phong bì tiền thưởng.

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in school uniform, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, bright happy eyes**.
>
> **Outfit — VIETNAMESE SCHOOL UNIFORM (ĐỒNG PHỤC CẤP 3 CHUẨN)**:
> - **White short-sleeved dress shirt** (hex #ffffff, clean cotton, ironed, neat pointed collar, tucked into pants)
> - **Navy blue long pants** (hex #2a2f3d, long pants to ankle, ironed)
> - **Red silk tie** (hex #cc2222, neatly knotted, tip reaches belt buckle)
> - **Black leather belt** (simple black leather belt with plain silver rectangular buckle)
> - **White sneakers** (hex #ffffff, clean low-cut canvas sneakers, white rubber soles, white laces, spotless)
> - **NO backpack** (on stage receiving award)
>
> **Specific emotion**: **PROUD TRIUMPHANT JOY** — eyes SQUEEZED SHUT in pure joy (closed-eye smile — happy expression where eyes scrunch up happily), mouth WIDE OPEN in big toothy grin (open smile showing teeth, pure happiness), eyebrows raised with excitement, soft pink blush circles ENHANCED (bigger and brighter than normal, flushed with pride).
>
> **Pose**: standing tall and proud, **one arm raised HIGH above head holding a red award certificate (A4-sized paper, red cover with gold border, stylized cartoon award — "GIẤY KHEN" text, no government seal)**, other arm holding a small yellow-red envelope (stylized cartoon money envelope, yellow background with red ribbon). Full body visible from head to toe, facing forward toward camera with big proud smile, slight chest-out confident stance.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_ti_dorm_tired.png` — TÍ — MỆT MỎI (sau 1 ngày dài)

**Dùng ở đoạn**: Narrator sau 1 ngày Tí vừa bán hàng ở sạp Mẹ + đi học → về phòng trọ mệt mỏi.

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in casual home outfit, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, tired eyes**.
>
> **Outfit — CASUAL HOME (ở phòng trọ, KHÔNG đồng phục)**:
> - **White short-sleeved t-shirt** (plain white cotton t-shirt, simple clean)
> - **Navy blue shorts** (knee-length, simple cotton shorts, hex #2a2f3d)
> - **Simple plastic flip-flops** (simple sandals)
> - **NO backpack, NO school uniform, NO sneakers**
>
> **Specific emotion**: **EXHAUSTED TIRED** — eyes HALF-DROOPED (drooping eyelids showing exhaustion — upper eyelids falling halfway over the pupils, NOT fully closed, just heavy tired eyes), eyebrows slightly raised at inner corners (tired worried look), mouth slightly open with a long exhale (small open mouth with tired sigh), shoulders SLUMPED forward (tired posture showing fatigue). Slight dark circles under eyes (subtle tiredness indicators).
>
> **Pose**: standing with slouched tired posture, shoulders drooping forward, one hand on hip (the exhausted gesture), other arm hanging limp at side. Head slightly tilted down. Slight lean to one side. Full body visible from head to toe, facing 3/4 view to camera.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_ti_dorm_determined.png` — TÍ — QUYẾT TÂM (mở đầu chương 3)

**Dùng ở đoạn**: Cuối chương 2 → mở đầu chương 3 — Tí nhận ra đã quản lý tiền sai, quyết tâm thay đổi.

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in casual home outfit, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, determined eyes**.
>
> **Outfit — CASUAL HOME (ở phòng trọ, KHÔNG đồng phục)**:
> - **White short-sleeved t-shirt** (plain white cotton t-shirt, simple clean)
> - **Navy blue shorts** (knee-length, simple cotton shorts, hex #2a2f3d)
> - **Simple plastic flip-flops** (simple sandals)
> - **NO backpack, NO school uniform, NO sneakers**
>
> **Specific emotion**: **DETERMINED RESOLUTE STRONG-WILLED** — eyebrows furrowed TIGHTLY and angled DOWN (the determination furrow — serious focused expression), eyes NARROWED with fierce determination (sharp focused gaze, eyes slightly narrowed showing willpower), mouth pressed into a FIRM straight line (closed mouth, lips pressed tight). Blush circles normal.
>
> **Pose**: standing TALL and STRAIGHT (upright confident stance, chest out, shoulders back), BOTH hands clenched into FISTS at sides, feet planted firmly shoulder-width apart, full body visible from head to toe, facing forward toward camera with fierce determined gaze.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_ti_dorm_relieved.png` — TÍ — NHẸ NHÕM (mẹ động viên qua điện thoại)

**Dùng ở đoạn**: Mẹ Tí gọi điện thoại động viên sau khi Tí kể chuyện mất xe → Tí nhẹ nhõm, vừa khóc xong.

**🔗 Upload reference**: `c1_ti_neutral.png`

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **STYLE REFERENCE (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference shows a younger version of this character. Generate the SAME CHARACTER but OLDER — taller body proportions, longer limbs, slightly more mature face. This is a character growth illustration.**
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, skin tone, blush style).
>
> **✅ MUST CHANGE**:
> - **Head:body ratio**: shorter → **taller teen proportions (body LONGER, legs LONGER, neck LONGER)**
> - **Body**: thin and small → **lean teenage build — taller and slimmer, with noticeably LONGER LEGS and SLIGHTLY BROADER SHOULDERS**
> - **Haircut**: short → **short practical cut slightly longer, fringe short and neat (Vietnamese student style)**
> - **Face**: round with baby fat → **oval face shape, jawline forming, face LONGER**
>
> **✅ FINAL TARGET**: The same character from reference, but clearly older and taller, with teen proportions (NOT child proportions).
>
> ---
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (taller teen proportions — body is NOTICEABLY LONGER than the reference, with visible longer legs and longer torso, head proportionally SMALLER relative to body)**, long limbs (NOT stubby), normal-sized round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Character reference**: **Tí — a Vietnamese student character with teen proportions (taller and leaner than the reference)** in casual home outfit, **lean teenage build — taller and slimmer than the reference**, soft warm light beige skin, **Vietnamese facial features — slightly flat and wider nose bridge, soft oval face, single eyelid or shallow double eyelid, monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **Vietnamese student haircut (short practical cut, fringe short and neat about 2-3cm, hair natural and soft with NO gel, NO wax, NO pomade, NO slicked-back)**, **teenage face — oval face shape, jawline forming, emotional watery eyes**.
>
> **Outfit — CASUAL HOME (ở phòng trọ, KHÔNG đồng phục)**:
> - **White short-sleeved t-shirt** (plain white cotton t-shirt, simple clean)
> - **Navy blue shorts** (knee-length, simple cotton shorts, hex #2a2f3d)
> - **Simple plastic flip-flops** (simple sandals)
> - **NO backpack, NO school uniform, NO sneakers**
>
> **Specific emotion**: **RELIEVED EMOTIONAL TEARFUL JOY** — eyes slightly watery with hint of tears (glassy sparkly eyes with moisture, NOT crying actively — just recently cried, eyes still glistening), eyebrows slightly raised in relief, mouth in a small wobbly smile (slight smile but lips tremble slightly), one hand holding smartphone pressed to ear (talking on phone), the other hand hanging at side. Light pink blush on cheeks (emotional flush).
>
> **Pose**: standing next to a window (background pure white), one hand holding smartphone pressed to right ear, other arm relaxed at side. Slight upward tilt of head (looking up with relief). Full body visible from head to toe, facing 3/4 view to camera. Posture relaxed.
>
> **Lighting**: **soft warm golden window light from the side (warm glow illuminating one side of the face, the other side in gentle shadow)**. NOTE: still pure white background, NO window visible — only the WARM LIGHT EFFECT on character.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 👦 PHẦN 2 — HÙNG (16 tuổi) — 4 EMOTIONS

---

## 📄 `c2_hung_neutral.png` — HÙNG — NEUTRAL (mặc định)

**Dùng ở đoạn**: Default — dùng cho mọi đoạn thoại Hùng không có emotion cụ thể.
**Outfit**: School uniform (white shirt + navy pants + tie) + clean white sneakers + đứng trước cổng trường

**🔗 Upload reference**: **`c1_hung_neutral.png`**

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **AGE PROGRESSION (BẮT BUỘC — ĐỌC TRƯỚC KHI GEN)**
>
> **The uploaded reference image is Hùng at age 13 (3 YEARS AGO). The output MUST be Hùng at age 16 (3 YEARS OLDER, NOW). This is an AGE PROGRESSION task — the character MUST visibly grow up.**
>
> **❌ DO NOT COPY THE REFERENCE.** DO NOT keep the same proportions. DO NOT keep the same 13-year-old slicked-back haircut. DO NOT keep the same 150cm short height.
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, fair skin tone, blush style).
>
> **✅ MUST CHANGE (READ CAREFULLY)**:
> - **Head:body ratio**: 1:2.5 (chibi kid) → **1:3.5 (taller teen proportions — body LONGER, legs LONGER, neck LONGER, NOT chibi anymore)**
> - **Height**: 150cm → **172cm** (TALLER by 22cm — Hùng 16t must look CLEARLY TALLER than reference, and TALLEST in the friend group)
> - **Body build**: skinny 13-year-old kid → **LEAN TALL 16-year-old teenage build** — taller and SLIMMER than the 13-year-old reference (NOT muscular, NOT chubby, NOT broad-shouldered — SLIM and LEAN, narrow frame, narrow shoulders only SLIGHTLY broader than reference, but CLEARLY TALLER), **LONG SLENDER LEGS visible** (BOTH legs clearly visible from hip to ankle in frame — long straight lean legs typical of a 16-year-old growth spurt, NOT stubby, NOT short, clearly 172cm tall boy proportions), thin lean arms hanging naturally, **THIN slender limbs** (thin wrists, narrow shoulders, lean overall — like a typical Vietnamese teenage boy who grew tall and skinny but not chubby or muscular), well-fed wealthy kid but still naturally lean and tall
> - **Haircut**: short childish slick → **teenage slicked-back style with more volume on top** (LONGER hair than reference, more voluminous, soft natural combed-back, no excessive gel)
> - **Face**: round baby-fat cheeks → face LOSING ALL baby-fat, **oval face shape, visible jawline forming, face LONGER (not round anymore)**, clearly older teen
>
> **✅ FINAL TARGET**: A clearly 16-year-old Vietnamese high school boy — TALL and LEAN (like a bamboo shoot teen who grew tall fast), in school uniform + TEEN proportions (NOT chibi kid proportions, NOT chubby, NOT short), NOT a copy of the 13-year-old reference.

> **Full character reference**: **a 16-year-old Vietnamese boy (Hùng, age-locked at 16, Vietnamese nationality — NOT 13, NOT 15, EXACTLY 16 YEARS OLD)** attending high school in a small-town Vietnam, height **172cm (22cm TALLER than the 13-year-old reference)**, **LEAN TALL teenage build — clearly TALLER and SLIMMER than the 13-year-old reference** (NOT muscular, NOT chubby, NOT broad frame — NARROW lean frame, narrow shoulders slightly broader than reference, but HEIGHT is the dominant change), **LONG SLENDER LEGS clearly visible** (BOTH legs in full from hip to ankle — long straight lean legs, NOT stubby, NOT short, clearly 172cm tall boy proportions), **THIN SLENDER LIMBS** (thin lean arms, narrow wrists, lean overall body), **TALL teen silhouette** (head-to-toe should look clearly taller than the 13-year-old reference), fair skin (SAME skin tone as reference), **typical Vietnamese high school boy facial features — slightly flat and wider nose bridge, monolid eyes, soft friendly expression, blush circles on cheeks** (same facial features as reference but matured — oval face, visible jawline, NO baby fat remaining).

> **Style token**: Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body is NOTICEABLY LONGER than chibi kid style, with visible longer legs and longer torso, head proportionally SMALLER relative to body than a typical chibi kid)** (small-ish head, longer body, longer legs typical of 16-year-old teen), long limbs (NOT stubby), normal-sized round sparkly eyes (NOT huge oversized chibi eyes — eyes are proportionate to TEEN face, smaller relative to face than chibi kid), thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature fashion model proportions. This is a cute kawaii teen illustration.

> **Anti-distortion rule**: **CRITICAL — DO NOT stretch, enlarge, or distort the character's head or body.** This character must maintain kawaii teen proportions (1:3.5 head:body). The head is proportionally SMALL relative to the body — NOT a large chibi head on a small body. The body is LONGER and TALLER with visible long legs — NOT short or stubby. The eyes are NORMAL-SIZED (proportionate to the teen face) — NOT huge oversized chibi eyes. Violating this rule produces a cartoonish chibi character instead of a teen character. **The image MUST look like a 16-year-old high school boy, NOT a 7-year-old child.**

> **Framing rule**: **3:4 vertical** — Portrait framing. **CRITICAL HEIGHT FRAMING: Hùng at 172cm is the TALLEST character in the story — his head must appear at the TOP of the frame with VISIBLE CLEAR SPACE above his head (the top 15-20% of frame is empty white space), and his FEET (both feet, full sneakers) must appear at the BOTTOM of the frame with VISIBLE CLEAR SPACE below his feet (the bottom 10-15% of frame is empty white space).** The character occupies roughly **55–70% of vertical frame height** — NOT zoomed-in, NOT close-up, NOT bust shot, NOT shoulders-up, NOT waist-up. **Both feet and full sneakers must be visible at the bottom of the frame.** Character centered. Head positioned in the upper portion of the frame, legs stretching toward the bottom edge. **The character should look TALL and LEAN — the long legs should be OBVIOUS and VISIBLE.** Leave **10% transparent padding** around all edges. Character centered.

> **Outfit**: **school uniform cấp 3** — white short-sleeved dress shirt (ironed, neat collar), **navy blue long pants** (NOT shorts), black leather belt with simple silver buckle, **red silk tie** (neatly knotted, tip reaches belt), clean white low-cut sneakers (brand new, white rubber soles, white laces, spotless), NO logo on shoes. This is the STANDARD Vietnamese high school uniform. Outfit must be CRISP and NEAT — a well-dressed wealthy kid.

> **Specific emotion**: **NEUTRAL / IDLE** — Hùng's face is completely relaxed, expressionless (NOT smiling, NOT smirking, NOT frowning — just neutral teenage face), eyebrows at natural rest position (NOT raised, NOT furrowed), eyes looking forward with a calm casual gaze (normal kawaii size, NOT enlarged, NOT sparkly — just normal calm teen eyes), mouth closed in a natural neutral line (NOT smiling, NOT smirking, NOT pouting). Blush circles NORMAL SIZE (NOT enhanced, NOT glowing). **Face proportions STAY NORMAL kawaii teen size** — do NOT enlarge head, do NOT stretch face.

> **Pose**: Standing neutral. **LEGS MUST BE LONG AND VISIBLE — both legs in full from hip to ankle clearly visible in frame.** Two hands casually inserted into front pockets of navy pants (classic cool-kid casual pose). Standing upright but relaxed — not stiff, not slouching. Weight evenly distributed on both legs. Feet shoulder-width apart, facing forward. **CRITICAL: Knees should appear in the LOWER THIRD of the frame (knees positioned low, clearly visible) — the legs should look long and stretched out.** Standing in front of school gate (background blurred/stripped, white background only — NO scenery visible). Natural cool-kid stance. **Both feet with sneakers must be at the very bottom of the frame.**

> **Accessories**: Clean white sneakers visible. Red tie visible. No hat. No headphones. No phone in hand (hands are in pockets). No accessories.

> **Aspect ratio**: 3:4 vertical.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_hung_invite_smug.png` — HÙNG — RỦ ĐI XEM PHIM (tự tin mời)

**Dùng ở đoạn**: Mission 2.3 — Hùng vỗ vai Tí cười hô hớ rủ đi xem phim cuối tuần.
**Outfit**: School uniform + brand new white sneakers + đứng cạnh Honda Vision scooter

**🔗 Upload reference**: **`c1_hung_neutral.png`**

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **⚠️⚠️⚠️ AGE PROGRESSION TASK — CRITICAL READ THIS FIRST ⚠️⚠️⚠️**
>
> **The uploaded reference image is Hùng at age 13 (3 YEARS AGO). The output MUST be Hùng at age 16 (3 YEARS OLDER, NOW). This is an AGE PROGRESSION task — the character MUST visibly grow up.**
>
> **❌ DO NOT COPY THE REFERENCE.** DO NOT keep the same proportions. DO NOT keep the same 13-year-old slicked-back haircut. DO NOT keep the same 150cm short height.
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, fair skin tone, blush style).
>
> **✅ MUST CHANGE (READ CAREFULLY)**:
> - **Head:body ratio**: 1:2.5 (chibi kid) → **1:3.5 (taller teen proportions — body LONGER, legs LONGER, neck LONGER, NOT chibi anymore)**
> - **Height**: 150cm → **172cm** (TALLER by 22cm — Hùng 16t must look CLEARLY TALLER than reference, and TALLEST in the friend group)
> - **Body build**: skinny 13-year-old kid → **LEAN TALL 16-year-old teenage build** — taller and SLIMMER than the 13-year-old reference (NOT muscular, NOT chubby, NOT broad-shouldered — SLIM and LEAN, narrow frame, narrow shoulders only SLIGHTLY broader than reference, but CLEARLY TALLER), **LONG SLENDER LEGS visible** (BOTH legs clearly visible from hip to ankle in frame — long straight lean legs typical of a 16-year-old growth spurt, NOT stubby, NOT short, clearly 172cm tall boy proportions), thin lean arms hanging naturally, **THIN slender limbs** (thin wrists, narrow shoulders, lean overall — like a typical Vietnamese teenage boy who grew tall and skinny but not chubby or muscular), well-fed wealthy kid but still naturally lean and tall
> - **Haircut**: short childish slick → **teenage slicked-back style with more volume on top** (LONGER hair than reference, more voluminous, soft natural combed-back, no excessive gel)
> - **Face**: round baby-fat cheeks → face LOSING ALL baby-fat, **oval face shape, visible jawline forming, face LONGER (not round anymore)**, clearly older teen
>
> **✅ FINAL TARGET**: A clearly 16-year-old Vietnamese high school boy — TALL and LEAN (like a bamboo shoot teen who grew tall fast), in school uniform + brand-new sneakers + TEEN proportions (NOT chibi kid proportions, NOT chubby, NOT short), NOT a copy of the 13-year-old reference.
>
> ---
>
> (Same style token + anti-distortion rule — SAME as `c2_hung_neutral.png`)

> **Framing rule**: **3:4 vertical** — Portrait framing. **CRITICAL HEIGHT FRAMING: Hùng at 172cm is the TALLEST character in the story — his head must appear at the TOP of the frame with VISIBLE CLEAR SPACE above his head (the top 15-20% of frame is empty white space), and his FEET (both feet, full sneakers) must appear at the BOTTOM of the frame with VISIBLE CLEAR SPACE below his feet (the bottom 10-15% of frame is empty white space).** The character occupies roughly **55–70% of vertical frame height** — NOT zoomed-in, NOT close-up, NOT bust shot, NOT shoulders-up, NOT waist-up. **Both feet and full sneakers must be visible at the bottom of the frame.** Character centered. Head positioned in the upper portion of the frame, legs stretching toward the bottom edge. **The character should look TALL and LEAN — the long legs should be OBVIOUS and VISIBLE.**
>
> **Full character reference**: SAME as `c2_hung_neutral.png` (Hùng 16t, **172cm, LEAN TALL teen, narrow frame, LONG SLENDER LEGS**, fair skin, slicked-back hair).
>
> **Specific emotion**: **SMUG CONFIDENT INVITING** — confident cool teenage smirk (the classic "I got this" smirk, NOT arrogant, NOT mean — just friendly-cool confidence), one eyebrow raised (signature cool-teen expression), eyes half-lidded with confident sparkle (the "I've got plans" look), mouth in a slight asymmetric smirk (one corner of mouth upturned — the "you know you want to come" expression), one hand raised in a casual inviting gesture toward camera (toward where Tí would be in dialogue — palm up, fingers loosely open), the other hand holding his smartphone casually. Blush circles normal. **Face proportions STAY NORMAL kawaii size** — do NOT enlarge head, do NOT stretch face.
>
> **Pose**: standing coolly with one hand raised in inviting gesture (palm toward viewer), other hand holding smartphone at side, weight slightly shifted to one leg (cool relaxed lean). **LEGS MUST BE LONG AND VISIBLE — both legs in full from hip to ankle clearly visible in frame. Knees should appear in the LOWER THIRD of the frame (knees positioned low, clearly visible) — the legs should look long and stretched out. Both feet with sneakers must be at the very bottom of the frame.** Full body visible, facing 3/4 view to camera.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_hung_disappointed.png` — HÙNG — THẤT VỌNG (Tí từ chối đi xem phim)

**Dùng ở đoạn**: Mission 2.3 — Tí từ chối đi xem phim vì lo tiền → Hùng hơi thất vọng nhưng hiểu.
**Outfit**: School uniform

**🔗 Upload reference**: **`c1_hung_neutral.png`**

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **⚠️⚠️⚠️ AGE PROGRESSION TASK — CRITICAL READ THIS FIRST ⚠️⚠️⚠️**
>
> **The uploaded reference image is Hùng at age 13 (3 YEARS AGO). The output MUST be Hùng at age 16 (3 YEARS OLDER, NOW). This is an AGE PROGRESSION task — the character MUST visibly grow up.**
>
> **❌ DO NOT COPY THE REFERENCE.** DO NOT keep the same proportions. DO NOT keep the same 13-year-old slicked-back haircut. DO NOT keep the same 150cm short height.
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, fair skin tone, blush style).
>
> **✅ MUST CHANGE (READ CAREFULLY)**:
> - **Head:body ratio**: 1:2.5 (chibi kid) → **1:3.5 (taller teen proportions — body LONGER, legs LONGER, neck LONGER, NOT chibi anymore)**
> - **Height**: 150cm → **172cm** (TALLER by 22cm — Hùng 16t must look CLEARLY TALLER than reference, and TALLEST in the friend group)
> - **Body build**: skinny 13-year-old kid → **LEAN TALL 16-year-old teenage build** — taller and SLIMMER than the 13-year-old reference (NOT muscular, NOT chubby, NOT broad-shouldered — SLIM and LEAN, narrow frame, narrow shoulders only SLIGHTLY broader than reference, but CLEARLY TALLER), **LONG SLENDER LEGS visible** (BOTH legs clearly visible from hip to ankle in frame — long straight lean legs typical of a 16-year-old growth spurt, NOT stubby, NOT short, clearly 172cm tall boy proportions), thin lean arms hanging naturally, **THIN slender limbs** (thin wrists, narrow shoulders, lean overall — like a typical Vietnamese teenage boy who grew tall and skinny but not chubby or muscular), well-fed wealthy kid but still naturally lean and tall
> - **Haircut**: short childish slick → **teenage slicked-back style with more volume on top** (LONGER hair than reference, more voluminous, soft natural combed-back, no excessive gel)
> - **Face**: round baby-fat cheeks → face LOSING ALL baby-fat, **oval face shape, visible jawline forming, face LONGER (not round anymore)**, clearly older teen
> - **Outfit**: casual kid → **school uniform cấp 3 (white shirt + navy pants + tie + NEW clean white sneakers)** — NEW clothing, NOT in reference
>
> **✅ FINAL TARGET**: A clearly 16-year-old Vietnamese high school boy — TALL and LEAN (like a bamboo shoot teen who grew tall fast), in school uniform + TEEN proportions (NOT chibi kid proportions, NOT chubby, NOT short), NOT a copy of the 13-year-old reference.
>
> ---
>
> (Same style token + anti-distortion rule — SAME as `c2_hung_neutral.png`)

> **Framing rule**: **3:4 vertical** — Portrait framing. **CRITICAL HEIGHT FRAMING: Hùng at 172cm is the TALLEST character in the story — his head must appear at the TOP of the frame with VISIBLE CLEAR SPACE above his head (the top 15-20% of frame is empty white space), and his FEET (both feet, full sneakers) must appear at the BOTTOM of the frame with VISIBLE CLEAR SPACE below his feet (the bottom 10-15% of frame is empty white space).** The character occupies roughly **55–70% of vertical frame height** — NOT zoomed-in, NOT close-up, NOT bust shot, NOT shoulders-up, NOT waist-up. **Both feet and full sneakers must be visible at the bottom of the frame.** Character centered. Head positioned in the upper portion of the frame, legs stretching toward the bottom edge. **The character should look TALL and LEAN — the long legs should be OBVIOUS and VISIBLE.**
>
> **Full character reference**: SAME as `c2_hung_neutral.png` (Hùng 16t, **172cm, LEAN TALL teen, narrow frame, LONG SLENDER LEGS**, fair skin, slicked-back hair).
>
> **Specific emotion**: **DISAPPOINTED BUT UNDERSTANDING** — eyebrows slightly furrowed with mild disappointment (NOT angry, NOT sad, just "oh well" mild disappointment), eyes slightly downcast (looking down at the ground or at his own shoes, NOT avoiding Tí aggressively), mouth in a small "oh..." understanding line (closed mouth, slight downturned corners — the "oh well, no worries" expression), one hand scratching the back of his head (cartoon "well okay then" gesture), the other hand hanging at side. Blush circles normal. **Face proportions STAY NORMAL kawaii size**.
>
> **Pose**: standing upright, one hand scratching back of head (cartoon understanding gesture), other arm hanging at side. **LEGS MUST BE LONG AND VISIBLE — both legs in full from hip to ankle clearly visible in frame. Knees should appear in the LOWER THIRD of the frame (knees positioned low, clearly visible) — the legs should look long and stretched out. Both feet with sneakers must be at the very bottom of the frame.** Full body visible, facing 3/4 view to camera.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_hung_friendly_chat.png` — HÙNG — THÂN THIỆN (nói chuyện bình thường)

**Dùng ở đoạn**: Các đoạn thoại thường ngày giữa Hùng và Tí (ngoài lúc rủ đi xem phim).
**Outfit**: School uniform

**🔗 Upload reference**: **`c1_hung_neutral.png`**

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> **⚠️⚠️⚠️ AGE PROGRESSION TASK — CRITICAL READ THIS FIRST ⚠️⚠️⚠️**
>
> **The uploaded reference image is Hùng at age 13 (3 YEARS AGO). The output MUST be Hùng at age 16 (3 YEARS OLDER, NOW). This is an AGE PROGRESSION task — the character MUST visibly grow up.**
>
> **❌ DO NOT COPY THE REFERENCE.** DO NOT keep the same proportions. DO NOT keep the same 13-year-old slicked-back haircut. DO NOT keep the same 150cm short height.
>
> **✅ ONLY KEEP**: facial features (Vietnamese nose shape, monolid eyes, lip shape, fair skin tone, blush style).
>
> **✅ MUST CHANGE (READ CAREFULLY)**:
> - **Head:body ratio**: 1:2.5 (chibi kid) → **1:3.5 (taller teen proportions — body LONGER, legs LONGER, neck LONGER, NOT chibi anymore)**
> - **Height**: 150cm → **172cm** (TALLER by 22cm — Hùng 16t must look CLEARLY TALLER than reference, and TALLEST in the friend group)
> - **Body build**: skinny 13-year-old kid → **LEAN TALL 16-year-old teenage build** — taller and SLIMMER than the 13-year-old reference (NOT muscular, NOT chubby, NOT broad-shouldered — SLIM and LEAN, narrow frame, narrow shoulders only SLIGHTLY broader than reference, but CLEARLY TALLER), **LONG SLENDER LEGS visible** (BOTH legs clearly visible from hip to ankle in frame — long straight lean legs typical of a 16-year-old growth spurt, NOT stubby, NOT short, clearly 172cm tall boy proportions), thin lean arms hanging naturally, **THIN slender limbs** (thin wrists, narrow shoulders, lean overall — like a typical Vietnamese teenage boy who grew tall and skinny but not chubby or muscular), well-fed wealthy kid but still naturally lean and tall
> - **Haircut**: short childish slick → **teenage slicked-back style with more volume on top** (LONGER hair than reference, more voluminous, soft natural combed-back, no excessive gel)
> - **Face**: round baby-fat cheeks → face LOSING ALL baby-fat, **oval face shape, visible jawline forming, face LONGER (not round anymore)**, clearly older teen
> - **Outfit**: casual kid → **school uniform cấp 3 (white shirt + navy pants + tie + NEW clean white sneakers)** — NEW clothing, NOT in reference
>
> **✅ FINAL TARGET**: A clearly 16-year-old Vietnamese high school boy — TALL and LEAN (like a bamboo shoot teen who grew tall fast), in school uniform + TEEN proportions (NOT chibi kid proportions, NOT chubby, NOT short), NOT a copy of the 13-year-old reference.
>
> ---
>
> (Same style token + anti-distortion rule — SAME as `c2_hung_neutral.png`)

> **Framing rule**: **3:4 vertical** — Portrait framing. **CRITICAL HEIGHT FRAMING: Hùng at 172cm is the TALLEST character in the story — his head must appear at the TOP of the frame with VISIBLE CLEAR SPACE above his head (the top 15-20% of frame is empty white space), and his FEET (both feet, full sneakers) must appear at the BOTTOM of the frame with VISIBLE CLEAR SPACE below his feet (the bottom 10-15% of frame is empty white space).** The character occupies roughly **55–70% of vertical frame height** — NOT zoomed-in, NOT close-up, NOT bust shot, NOT shoulders-up, NOT waist-up. **Both feet and full sneakers must be visible at the bottom of the frame.** Character centered. Head positioned in the upper portion of the frame, legs stretching toward the bottom edge. **The character should look TALL and LEAN — the long legs should be OBVIOUS and VISIBLE.**
>
> **Full character reference**: SAME as `c2_hung_neutral.png` (Hùng 16t, **172cm, LEAN TALL teen, narrow frame, LONG SLENDER LEGS**, fair skin, slicked-back hair).
>
> **Specific emotion**: **FRIENDLY CASUAL** — friendly relaxed teenage smile (closed mouth, slight upturn — the casual friendly smile of a 16-year-old kid chatting with a friend), eyebrows at rest, eyes looking forward with friendly warmth (normal kawaii size, NOT enlarged), one hand holding his smartphone casually (showing Tí something on screen, maybe a meme or a movie trailer). Blush circles normal. **Face proportions STAY NORMAL kawaii size**.
>
> **Pose**: standing upright with one hand holding smartphone up slightly (as if showing Tí something on the screen), other arm hanging at side. **LEGS MUST BE LONG AND VISIBLE — both legs in full from hip to ankle clearly visible in frame. Knees should appear in the LOWER THIRD of the frame (knees positioned low, clearly visible) — the legs should look long and stretched out. Both feet with sneakers must be at the very bottom of the frame.** Full body visible, facing 3/4 view to camera.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 👩‍🏫 PHẦN 3 — CÔ HIỆU TRƯỞNG (50 tuổi) — 3 EMOTIONS

---

## 📄 `c2_hieutruong_neutral.png` — CÔ HIỆU TRƯỞNG — NEUTRAL (mặc định)

**Dùng ở đoạn**: Default — dùng cho mọi đoạn thoại cô Hiệu trưởng không có emotion cụ thể.
**Outfit**: Áo dài xanh đậm (#1a2b4a) + brooch + tóc búi thấp

**🔗 Upload reference**: **KHÔNG CÓ (nhân vật mới)** — gen trực tiếp từ prompt

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body is NOTICEABLY LONGER than chibi kid style, with visible longer legs and longer torso, head proportionally SMALLER relative to body than a typical chibi kid)**, long limbs (NOT stubby), normal-sized round sparkly eyes (NOT huge oversized chibi eyes), thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi kid proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Full character reference**: **a Vietnamese woman (Cô Hiệu trưởng) serving as the high school principal of a small-town Vietnam school**, dignified mature appearance, **tall slender adult build** (long legs, elongated body proportions typical of a tall Vietnamese woman — clearly TALL figure with VISIBLE LONG LEGS shown in frame), **dark navy blue áo dài** (hex #1a2b4a, classic elegant Vietnamese ao dai in deep navy, ironed and pristine, appropriate formal attire, áo dài tunic FALLS LONG past the knees to mid-calf level — floor-length split sides), **navy long pants underneath** (matching dark navy trousers, slim fit, ankle-length, hex #1a2b4a), **low black flat shoes** (simple low-heeled black leather flats, formal Vietnamese style, hex #111111), **low bun hairstyle** (tóc búi thấp sau đầu, neat and dignified, salt-and-pepper hair with streaks of silver-gray showing age gracefully), **simple gold brooch** at the áo dài collar (small decorative brooch/pin, simple elegant), **warm kind mature face** with gentle expression, soft subtle wrinkles around eyes (kind grandmotherly look), dark expressive eyes (warm, approachable, professional), **typical Vietnamese woman facial features** — slightly flat wider nose bridge, gentle mouth, kind demeanor.
>
> **Specific emotion**: **NEUTRAL / IDLE** — Cô Hiệu trưởng's face is completely relaxed and kind, expressionless (NOT smiling, NOT stern — just neutral warm professional face), eyebrows at natural rest position (NOT raised, NOT furrowed), eyes looking forward with a calm warm gaze (normal adult size, NOT enlarged), mouth closed in a gentle natural line (NOT smiling, NOT frowning). **Face proportions STAY NORMAL adult** — do NOT enlarge head, do NOT stretch face.
>
> **Pose**: standing tall and dignified, both hands placed lightly in front of her belly (classic formal/ceremonial pose), full body visible from head to toe, facing 3/4 view to camera. Standing in front of school stage (background pure white — NO scenery visible). **CRITICAL FULL-BODY FRAMING: head at top with whitespace above, both feet with black flats clearly visible at the BOTTOM of the frame with whitespace below — character occupies 55-70% of vertical frame, full long áo dài + long legs + black shoes all visible.**
>
> **Outfit**: **dark navy blue áo dài** (hex #1a2b4a, clean cotton, ironed, pristine formal, tunic length to mid-calf), **navy long pants** underneath (hex #1a2b4a, slim ankle-length trousers), **low black flat shoes** (hex #111111, simple formal flats), **low bun hairstyle** (tóc búi thấp, neat dignified, salt-and-pepper silver-gray streaks), **simple gold brooch** at the collar, **simple pearl earrings** (optional), NO necklace, NO other accessories.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_hieutruong_speaking.png` — CÔ HIỆU TRƯỞNG — ĐANG PHÁT BIỂU (xướng tên học sinh)

**Dùng ở đoạn**: Mission 2.4 — Cô đọc tên Tí trên sân khấu lễ tổng kết.
**Outfit**: Áo dài xanh đậm + brooch

**🔗 Upload reference**: **KHÔNG CÓ (nhân vật mới)** — gen trực tiếp từ prompt

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body is NOTICEABLY LONGER than chibi kid style, with visible longer legs and longer torso, head proportionally SMALLER relative to body than a typical chibi kid)**, long limbs (NOT stubby), normal-sized round sparkly eyes (NOT huge oversized chibi eyes), thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi kid proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Full character reference**: SAME as `c2_hieutruong_neutral.png` — **Cô Hiệu trưởng, Vietnamese school principal, dignified mature tall slender adult build** (long legs, elongated body proportions typical of a tall Vietnamese woman — clearly TALL figure with VISIBLE LONG LEGS shown in frame), **dark navy blue áo dài** (hex #1a2b4a, classic elegant Vietnamese ao dai in deep navy, ironed and pristine, áo dài tunic FALLS LONG past the knees to mid-calf level — floor-length split sides), **navy long pants underneath** (matching dark navy trousers, slim fit, ankle-length, hex #1a2b4a), **low black flat shoes** (simple low-heeled black leather flats, formal Vietnamese style, hex #111111), **low bun hairstyle** (tóc búi thấp, neat dignified, salt-and-pepper silver-gray streaks), **simple gold brooch** at the collar, **warm kind mature face**, soft subtle wrinkles around eyes, dark expressive eyes, typical Vietnamese woman facial features.
>
> **Specific emotion**: **PROUD SPEAKING DIGNIFIED** — dignified proud speaking face, eyebrows slightly raised in formal address, mouth slightly open as if speaking (SMALL mouth opening, NOT gaping, NOT shouting — this is dignified formal speaking), eyes looking forward with professional pride (normal adult eye size, NOT enlarged). One hand holding the small microphone raised to her mouth, the other hand holding the small stack of red certificates. **Face proportions STAY NORMAL adult**.
>
> **Pose**: standing tall, one hand holding small microphone raised slightly to her mouth (as if announcing), other hand holding small stack of red certificates at waist, full body visible, facing 3/4 view to camera. **CRITICAL FULL-BODY FRAMING: head at top with whitespace above, both feet with black flats clearly visible at the BOTTOM of the frame with whitespace below — full long áo dài + long legs + black shoes all visible in frame.**
>
> **Outfit**: **dark navy blue áo dài** (hex #1a2b4a, tunic length to mid-calf), **navy long pants** underneath (hex #1a2b4a, slim ankle-length trousers), **low black flat shoes** (hex #111111, simple formal flats), **low bun hairstyle**, **simple gold brooch**, NO other accessories.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 `c2_hieutruong_kind_handing.png` — CÔ HIỆU TRƯỞNG — TRAO GIẤY KHEN (vui vẻ đưa giấy khen)

**Dùng ở đoạn**: Mission 2.4 — Cô trao giấy khen và phong bì tiền thưởng cho Tí trên sân khấu.
**Outfit**: Áo dài xanh đậm + brooch

**🔗 Upload reference**: **KHÔNG CÓ (nhân vật mới)** — gen trực tiếp từ prompt

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body is NOTICEABLY LONGER than chibi kid style, with visible longer legs and longer torso, head proportionally SMALLER relative to body than a typical chibi kid)**, long limbs (NOT stubby), normal-sized round sparkly eyes (NOT huge oversized chibi eyes), thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi kid proportions. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.**
>
> **Full character reference**: SAME as `c2_hieutruong_neutral.png` — **Cô Hiệu trưởng, Vietnamese school principal, dignified mature tall slender adult build** (long legs, elongated body proportions typical of a tall Vietnamese woman — clearly TALL figure with VISIBLE LONG LEGS shown in frame), **dark navy blue áo dài** (hex #1a2b4a, classic elegant Vietnamese ao dai in deep navy, ironed and pristine, áo dài tunic FALLS LONG past the knees to mid-calf level — floor-length split sides), **navy long pants underneath** (matching dark navy trousers, slim fit, ankle-length, hex #1a2b4a), **low black flat shoes** (simple low-heeled black leather flats, formal Vietnamese style, hex #111111), **low bun hairstyle** (tóc búi thấp, neat dignified, salt-and-pepper silver-gray streaks), **simple gold brooch** at the collar, **warm kind mature face**, soft subtle wrinkles around eyes, dark expressive eyes, typical Vietnamese woman facial features.
>
> **Specific emotion**: **KIND PROUD HANDOVER** — kind warm proud face with a small smile (closed mouth, gentle upturn — the "well done, young man" smile), eyes soft with pride (normal adult eye size, NOT enlarged), eyebrows at rest position with subtle proud lift. Body language warm and ceremonial. **Both hands together holding a red award certificate AND a symbolic cartoon paper money envelope, presented forward with BOTH HANDS** (the formal Vietnamese ceremonial handover style — both hands cupping the items as if offering them respectfully, like an official award ceremony) — red award certificate (A4-sized, red cover with gold border, "GIẤY KHEN" text) AND a stylized red-yellow envelope (NO real Vietnamese dong) BOTH HELD TOGETHER in both hands, presented forward at chest level. **Face proportions STAY NORMAL adult**.
>
> **Pose**: standing tall with **BOTH HANDS together held at chest level, both hands cupping the red certificate + money envelope together, presenting them forward toward viewer/Tí** (formal ceremonial two-handed handover style), full body visible, facing 3/4 view to camera. The arms are slightly bent at the elbows, both hands extended forward at chest height holding the awards together. **CRITICAL FULL-BODY FRAMING: head at top with whitespace above, both feet with black flats clearly visible at the BOTTOM of the frame with whitespace below — full long áo dài + long legs + black shoes all visible in frame.**
>
> **Outfit**: **dark navy blue áo dài** (hex #1a2b4a, tunic length to mid-calf), **navy long pants** underneath (hex #1a2b4a, slim ankle-length trousers), **low black flat shoes** (hex #111111, simple formal flats), **low bun hairstyle**, **simple gold brooch**, NO other accessories.
>
> **Lighting**: flat even studio lighting on plain white backdrop.
>
> **Aspect ratio**: 3:4 vertical.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 BẢNG TỔNG HỢP PROMPTS

## Tất cả emotion prompts — 16 file

| # | Filename | Nhân vật | Tuổi | Emotion | Dùng ở cốt truyện | Reference chương 1 |
|---|---|---|---|---|---|---|
| 1 | `c2_ti_neutral.png` | Tí | 16 | Neutral (ở phòng trọ) | Default khi Tí ở phòng trọ | `c1_ti_neutral.png` |
| 2 | `c2_ti_neutral_school.png` | Tí | 16 | Neutral (ở trường) | Default khi Tí ở trường | `c1_ti_neutral.png` |
| 3 | `c2_ti_school_tempted.png` | Tí | 16 | Bị cám dỗ | Mission 2.2 (Flash Sale) | `c1_ti_neutral.png` |
| 4 | `c2_ti_school_conflicted.png` | Tí | 16 | Do dự | Mission 2.3 (rủ xem phim) | `c1_ti_neutral.png` |
| 5 | `c2_ti_dorm_shocked.png` | Tí | 16 | Sốc | Life Event 2 (mất xe) | `c1_ti_neutral.png` |
| 6 | `c2_ti_stage_proud.png` | Tí | 16 | Tự hào | Mission 2.4 (nhận giấy khen) | `c1_ti_neutral.png` |
| 7 | `c2_ti_dorm_tired.png` | Tí | 16 | Mệt mỏi | Narrator sau 1 ngày dài | `c1_ti_neutral.png` |
| 8 | `c2_ti_dorm_determined.png` | Tí | 16 | Quyết tâm | Cuối chương 2 (mở đầu chương 3) | `c1_ti_neutral.png` |
| 9 | `c2_ti_dorm_relieved.png` | Tí | 16 | Nhẹ nhõm | Mẹ động viên qua điện thoại | `c1_ti_neutral.png` |
| 10 | `c2_hung_neutral.png` | Hùng | 16 | Neutral | Default khi Hùng nói chuyện | `c1_hung_neutral.png` |
| 11 | `c2_hung_invite_smug.png` | Hùng | 16 | Rủ đi tự tin | Mission 2.3 (rủ xem phim) | `c1_hung_neutral.png` |
| 12 | `c2_hung_disappointed.png` | Hùng | 16 | Thất vọng | Mission 2.3 (Tí từ chối) | `c1_hung_neutral.png` |
| 13 | `c2_hung_friendly_chat.png` | Hùng | 16 | Thân thiện | Đoạn thoại thường ngày | `c1_hung_neutral.png` |
| 14 | `c2_hieutruong_neutral.png` | Cô Hiệu trưởng | 50 | Neutral | Default khi cô nói chuyện | KHÔNG (mới) |
| 15 | `c2_hieutruong_speaking.png` | Cô Hiệu trưởng | 50 | Phát biểu | Mission 2.4 (xướng tên) | KHÔNG (mới) |
| 16 | `c2_hieutruong_kind_handing.png` | Cô Hiệu trưởng | 50 | Trao giấy khen | Mission 2.4 (trao giấy khen) | KHÔNG (mới) |

> **Tổng cộng: 16 emotion prompts** cho riêng Chương 2 (Tí 9 + Hùng 4 + Cô Hiệu trưởng 3 — Mẹ Tí BỎ)

---

# 📌 CHECKLIST GIAO ĐỒNG ĐỘI — CHƯƠNG 2 (EMOTION)

### Phase 1 — Gen 16 emotion prompts (cho dialogue scene)

**Bước 1: Chuẩn bị ảnh reference chương 1**
- [ ] Đảm bảo có sẵn 2 ảnh reference chương 1:
  - [ ] `c1_ti_neutral.png` (Tí 13t)
  - [ ] `c1_hung_neutral.png` (Hùng 13t)

**Bước 2: Gen emotion cho Tí (9 file)**
- [ ] Upload `c1_ti_neutral.png` + dùng prompt tương ứng
- [ ] Gen các file:
  - [ ] `c2_ti_neutral.png` (neutral phòng trọ — casual home)
  - [ ] `c2_ti_neutral_school.png` (neutral ở trường — đồng phục + balo đỏ)
  - [ ] `c2_ti_school_tempted.png` (bị cám dỗ — đồng phục, không balo)
  - [ ] `c2_ti_school_conflicted.png` (do dự — đồng phục + balo đỏ)
  - [ ] `c2_ti_dorm_shocked.png` (sốc - casual home)
  - [ ] `c2_ti_stage_proud.png` (tự hào - đồng phục, không balo)
  - [ ] `c2_ti_dorm_tired.png` (mệt mỏi - casual home)
  - [ ] `c2_ti_dorm_determined.png` (quyết tâm - casual home)
  - [ ] `c2_ti_dorm_relieved.png` (nhẹ nhõm - casual home + warm lighting)

**Bước 3: Gen emotion cho Hùng (4 file)**
- [ ] Upload `c1_hung_neutral.png` + dùng prompt tương ứng
- [ ] Gen các file:
  - [ ] `c2_hung_neutral.png` (neutral — đồng phục, tay đút túi)
  - [ ] `c2_hung_invite_smug.png` (rủ đi tự tin)
  - [ ] `c2_hung_disappointed.png` (thất vọng)
  - [ ] `c2_hung_friendly_chat.png` (thân thiện)

**Bước 4: Gen emotion cho Cô Hiệu trưởng (3 file) — NHÂN VẬT MỚI, KHÔNG CẦN UPLOAD**
- [ ] Gen trực tiếp từ prompt (không cần upload ảnh reference):
  - [ ] `c2_hieutruong_neutral.png` (neutral — áo dài xanh đậm)
  - [ ] `c2_hieutruong_speaking.png` (phát biểu — cầm micro)
  - [ ] `c2_hieutruong_kind_handing.png` (trao giấy khen — đưa giấy khen + phong bì)

**Bước 5: Hậu xử lý**
- [ ] Dùng `remove.bg` xóa nền trắng cho TẤT CẢ 16 file emotion → PNG trong suốt
- [ ] Kiểm tra mỗi file:
  - [ ] Mặt không bị distort (đầu to, mặt méo, mắt lồi)
  - [ ] Toàn thân nhân vật nằm gọn trong khung (đầu + chân + 2 tay đều thấy)
  - [ ] Background là pure white #FFFFFF (không có scenery/floor)
  - [ ] Hex color đúng cho từng món đồ trong outfit
- [ ] **LƯU Ý**: Sau khi gen Tí 16t thành công, có thể dùng các ảnh Tí 16t đã gen làm reference cho các emotion khác của Tí 16t → giúp consistency tốt hơn nữa (vì cùng 1 model AI gen ra sẽ giống nhau hơn)

---

# 🔑 QUY TẮC STYLE BẮT BUỘC

### Khi gen emotion nhân vật lớn lên:
1. **BẮT BUỘC upload ảnh reference chương 1** trước khi gen (trừ Cô Hiệu trưởng — nhân vật mới)
2. **BẮT BUỘC giữ phong cách khuôn mặt** từ reference (AI phải giữ same face features, chỉ áp dụng aging)
3. **CHỈ thay đổi**:
   - Tuổi (chính xác theo bảng quy tắc cố định)
   - Chiều cao, vóc dáng
   - Kiểu tóc (hơi dài hơn reference một chút, vẫn ngắn gọn kiểu Việt Nam 16t thực tế)
   - Outfit (theo từng emotion)
   - Subtle aging details (sợi bạc, hint mature)
4. **KHÔNG BAO GIỜ thay đổi**:
   - Quốc tịch (luôn là Việt Nam)
   - Phong cách khuôn mặt (giữ facial features giống reference)
   - Màu tóc (đen tuyền, không nâu, không vàng)
   - Kiểu cơ thể chính (lean cho Tí/Tèo/Hùng, soft-mature cho Mẹ)
5. **Background BẮT BUỘC pure white #FFFFFF** — không scenery, không floor, không shadow
6. **Anti-distortion + Framing rule** PHẢI có trong MỌI prompt
7. **Negative prompt** PHẢI có ở MỌI prompt

### Đồng phục cấp 3 Việt Nam — Mô tả chuẩn

Khi gen nhân vật mặc đồng phục, bắt buộc phải có:
- Áo sơ mi trắng ngắn tay (hex #ffffff, tucked into pants)
- Quần dài navy (hex #2a2f3d, NOT shorts)
- Cà vạt lụa đỏ (hex #cc2222)
- Thắt lưng da đen + khóa bạc
- Giày sneaker trắng (clean, spotless)

### Mapping emotion → scene VN trong React
```js
// dialogue scene
{
  type: 'dialogue',
  character: 'ti',
  expression: 'school_tempted',  // → load c2_ti_school_tempted.png
  background: 'classroom_empty',  // → load c2_bg_classroom_empty.png
}

// hoặc
{
  type: 'narrator',
  background: 'mom_stall_handover',  // → load c2_bg_mom_stall_handover.png (composite)
}
```