# 🎭 CHƯƠNG 1 — EMOTION MAP & PROMPT LIST
> **"Khám phá tiền tệ" — Tí 13 tuổi**
>
> File này dành cho **đồng đội** (artist / designer / dev). Mỗi emotion của từng nhân vật trong Chương 1 đều có **prompt Gen ảnh riêng** + **filename chuẩn** + **giải thích dùng ở đoạn hội thoại nào**.

---

## 📐 QUY ƯỚC ĐỌC NHANH

### Cấu trúc mỗi prompt
```
📄 filename — emotion — dùng ở đoạn...
> [Style token + Full character reference + Specific emotion + Pose + Lighting]
```

# 📐 KIẾN TRÚC VISUAL NOVEL — 3 LOẠI ẢNH

> 🎮 **Game này là Visual Novel kiểu Ren'Py / VN Studio**. Mỗi scene thuộc 1 trong 2 loại VN:
>
> | Loại scene VN | Sprite nhân vật | Background | Loại ảnh gen |
> |---|---|---|---|
> | **`type: 'dialogue'`** (có đối thoại giữa 2+ nhân vật) | ✅ Render sprite riêng | **BG trống** (không có nhân vật trong ảnh) → sprite ghép lên trên | **PORTRAIT sprite** (1 nhân vật đứng một mình, nền trắng) + **BG TRỐNG** |
> | **`type: 'narrator'`** (kể chuyện, không đối thoại) | ❌ KHÔNG render sprite | **BG COMPOSITE** (ảnh có sẵn nhân vật đang hành động) | **CINEMATIC SCENE** (ảnh toàn cảnh 16:9, có nhân vật trong ảnh) |
> | **`type: 'choice'`** (lựa chọn) | ❌ | BG mờ + UI overlay | — |
>
> 📌 **Quy tắc vàng**:
> - **Dialogue scene** → load ảnh portrait sprite (nền trong suốt) + ghép lên **BG trống** (cùng nơi, không nhân vật)
> - **Narrator scene** → load ảnh **BG composite** (có sẵn nhân vật) → KHÔNG ghép sprite thêm
>
> ## 🎯 VÍ DỤ CỤ THỂ — CÙNG NƠI "SHOP" CÓ NHIỀU PHIÊN BẢN BG
>
> | File BG | Nội dung | Dùng cho scene VN |
> |---|---|---|
> | `c1_bg_shop_empty.png` | Quầy tạp hóa **rỗng**, không ai đứng | Dialogue giữa Tí & Cô Tư (sprite riêng ghép lên) |
> | `c1_bg_shop_overview.png` | BG quay rộng toàn shop, không ai | Narrator tĩnh "Hôm đó trời nắng, shop vắng khách..." |
> | `c1_bg_shop_cotu_counting.png` | BG có Cô Tư đang ghi sổ, Tí đưa tiền | Narrator cinematic "Cô Tư nhận tiền, Tí nhận bim bim" |
>
> → **1 nơi có thể có nhiều BG khác nhau**, mỗi BG phục vụ 1 mục đích kể chuyện.
>
> 📖 **Tham khảo**: Project demo `d:\NGT\Test\finteen-app\src\components\VisualNovelPlayer.jsx`
> - Line 159: `const CharacterComponent = currentScene.character ? getSprite(currentScene.character, currentScene.expression || 'happy') : null`
> - Line 187: `dialogueBgOpacity = isDialogue ? 0.62 : 1.0` → BG mờ xuống khi dialogue, sprite nổi bật
> - Line 198-201: `BG_HAS_CHARACTER` list → biết scene nào dùng BG composite, engine skip sprite

---

# 🎨 STYLE TOKEN — CHIA THEO LOẠI ẢNH

### 🟢 STYLE TOKEN cho **CHARACTER PORTRAIT** (sprite — dùng cho dialogue)
```
Character portrait, Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration stylesolid pure white #FFFFFF background, NO background scenery, NO environment,
NO floor, NO ground, NO shadows on background, only the character standing,
full body visible from head to toe, no text, no watermark.
```

> 🔒 **Dùng cho**: `c1_ti_*.png`, `c1_bo_*.png`, `c1_me_*.png`, `c1_teo_*.png`, `c1_hung_*.png`, `c1_cotu_*.png`
> → Đồng đội dùng `remove.bg` xóa nền trắng → PNG trong suốt → React ghép lên background dialogue box.
>
> ⚠️ **Background BẮT BUỘC là pure white #FFFFFF** — KHÔNG có scenery, KHÔNG có floor, KHÔNG có shadow đổ trên nền. Mục đích: `remove.bg` xóa nền dễ, sprite ghép lên BG dialogue mượt.

### 🏪 STYLE TOKEN cho **BG TRỐNG** (empty background cho dialogue — không có nhân vật)
```
Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, empty Vietnamese [LOCATION NAME] setting. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT 3D, NOT Pixar, NOT creepy, NOT scary.
NO people, NO characters, empty scene ready for character sprites to be added later,
rich environmental detail, atmospheric perspective, 16:9 widescreen composition,
no text, no watermark.
```

> 🔒 **Dùng cho**: `c1_bg_[place]_empty.png` (VD: `c1_bg_shop_empty.png`)
> → Background **rỗng không có ai**, sẽ được React load cùng với sprite portrait khi vào dialogue scene.
> → Lưu ý: BG này **KHÔNG xóa nền**, là PNG đầy đủ 16:9.

### 🎬 STYLE TOKEN cho **BG COMPOSITE** (narrator cinematic — có nhân vật trong ảnh)
```
Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration stylefull background scene with Vietnamese village. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT 3D, NOT Pixar, NOT creepy, NOT scary.
setting (rice paddies, traditional stilt houses, dirt roads, market stalls),
characters IN the scene naturally posed and placed mid-action, rich environmental detail,
atmospheric perspective, depth of field, 16:9 widescreen composition,
no text, no watermark.
```

> 🔒 **Dùng cho**: `c1_bg_[place]_[action].png` (VD: `c1_bg_shop_cotu_counting.png`)
> → Ảnh toàn cảnh 16:9 có nhân vật Việt Nam đang hành động trong cảnh, KHÔNG cần xóa nền.

### 🎨 STYLE TOKEN cho **UI MOCKUP** (mini-game — bảng lương, kéo-thả)
```
Modern 2D mobile game UI mockup style, clean flat design, vibrant colors,
soft pastel palette, soft shadows, 1080x1080, highly detailed UI elements,
Vietnamese text-friendly, no character, only UI components, no watermark.
```

> 🔒 **Dùng cho**: `c1_ui_*.png`

---

### Negative prompt (áp dụng cho CẢ 3 loại)
```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality,
3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features,
wrong age appearance, caucasian features, anime-stereotype Western face,
Japanese anime face, K-pop face, big round eyes anime stereotype,
slim sharp jawline (wrong for age 13 boy), tall muscular body (wrong for skinny 13-year-old),
realistic Vietnamese adult face, child proportions (must look exactly 13)
```

### 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt |
|---|---|---|---|
| Tí | **13** | 🇻🇳 Việt Nam | `a 13-year-old Vietnamese boy` |
| Bố Tí | **40** | 🇻🇳 Việt Nam | `a 40-year-old Vietnamese man` |
| Mẹ Tí | **35** | 🇻🇳 Việt Nam | `a 35-year-old Vietnamese woman` |
| Tèo | **13** | 🇻🇳 Việt Nam | `a 13-year-old Vietnamese boy` |
| Hùng | **13** | 🇻🇳 Việt Nam | `a 13-year-old Vietnamese boy` |
| Cô Tư | **35** | 🇻🇳 Việt Nam | `a 35-year-old Vietnamese woman` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các emotion của cùng 1 nhân vật.

### 🟢 CHARACTER PORTRAIT — Negative prompt RIÊNG (chống AI vẽ BG)
```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality,
3D render, photorealistic, chibi, ugly, background scenery, environment, floor,
ground, room interior, outdoor scene, building, tree, sky, shadow on background,
gradient background, colored background, busy background, scenery, backdrop,
furniture, props, anything behind the character, East Asian (Japanese/Korean/Chinese)
features, wrong age appearance, caucasian features, anime-stereotype Western face,
Japanese anime face, K-pop face, big round eyes anime stereotype, slim sharp jawline
(wrong for age 13 boy), tall muscular body (wrong for skinny 13-year-old),
realistic Vietnamese adult face, child proportions (must look exactly 13),
brand new clothes, fashion model outfit
```

### 🎒 QUY TẮC BA LÔ (Tí 13t)

| Cốt truyện | Có ba lô? | Lý do |
|---|---|---|
| Ở nhà / phá heo đất / đi mua bim bim gần | ❌ KHÔNG | Trong nhà / đi bộ quãng ngắn |
| Đi học / tan học / đi đường dài | ✅ CÓ | Đi học cả ngày cần đồ |
| Đang bay khỏi xe sau khi tan học | ✅ CÓ (bay theo) | Logic nối tiếp từ cảnh trước |
| Nằm liệt giường | ❌ KHÔNG | Đã cởi đồ bệnh nhân |
| Đặt heo đất lại (kết chương) | ❌ KHÔNG | Ở trong nhà |

> **Mặc định**: Tí 13t ở neutral state **KHÔNG đeo ba lô** — đây là trạng thái mặc định khi không có cốt truyện cụ thể.

### Quy ước đặt tên file (NAMING CONVENTION)
```
[chapter]_[character]_[emotion]_[variant].png

Ví dụ:
- c1_ti_curious.png         → Chương 1, Tí, đang tò mò
- c1_ti_piggybank_happy.png → Chương 1, Tí, vui vì được heo đất
- c1_cotu_grumpy.png        → Chương 1, Cô Tư, đang quát khách
```

### Aspect ratio + mapping theo loại scene VN

| Loại ảnh | Tỉ lệ | Loại scene VN dùng | Đặc điểm |
|---|---|---|---|
| **Character portrait** (sprite — 1 nhân vật) | 3:4 vertical | `type: 'dialogue'` | Nhân vật đứng một mình, nền trắng → xóa nền bằng remove.bg → ghép vào background |
| **Cinematic scene** (composite có sẵn cảnh + nhân vật) | 16:9 ngang | `type: 'narrator'` | Toàn cảnh làng quê VN, có nhân vật Việt trong ảnh — KHÔNG render sprite riêng |
| **UI mockup** (mini-game) | 1:1 vuông | `type: 'choice'` (overlay) | Bảng lương, kéo-thả CẦN/THÍCH |

---

# 👥 CÁC NHÂN VẬT XUẤT HIỆN Ở CHƯƠNG 1

| ID | Tên nhân vật | Tuổi cố định | Quốc tịch | Vai trò | Số emotion cần gen |
|---|---|---|---|---|---|
| `ti` | Tí (nhân vật chính) | **13** | 🇻🇳 Việt Nam | Khám phá tiền tệ | **8 emotions** |
| `bo` | Bố Tí | **40** | 🇻🇳 Việt Nam | Nông dân, dạy sức lao động | **4 emotions** |
| `me` | Mẹ Tí | **40** | 🇻🇳 Việt Nam | Bán đồ ăn vặt, dạy CẦN/THÍCH | **3 emotions** |
| `teo` | Tèo (bạn thân) | **13** | 🇻🇳 Việt Nam | Rủ làm ăn vặt lời lãi | **3 emotions** |
| `hung` | Hùng (bạn cùng lớp) | **13** | 🇻🇳 Việt Nam | Con nhà giàu, khoe xe | **3 emotions** |
| `cotu` | Cô Tư (chủ tạp hóa) | **35** | 🇻🇳 Việt Nam | Bán đồ, NPC dạy bài | **3 emotions** |
| `scene` | Background cốt truyện | — | 🇻🇳 Việt Nam | Bối cảnh Chương 1 | **7 scenes** |
| `ui` | Mini-game UI | — | — | Kéo-thả CẦN/THÍCH | **1 mockup** |

> ⚠️ **MỖI NHÂN VẬT CÒN CÓ THÊM 1 TRẠNG THÁI BÌNH THƯỜNG (neutral/idle)** → dùng làm default khi không có emotion cụ thể. Tổng thực tế: **30 emotion prompts + 7 scenes + 1 UI = 38 prompts**.

**Tổng cộng: 38 prompts** cho riêng Chương 1 (30 character states bao gồm neutral + 7 scenes + 1 UI).

---

# 🎭 PHẦN 1 — CHARACTER EMOTIONS (XUẤT HIỆN Ở CHƯƠNG 1)

> Mỗi emotion dựa trên **đúng cốt truyện** — Tí sẽ đi qua 8 cung bậc cảm xúc ở Chương 1, từ tò mò → gian xảo → sợ hãi → bất ngờ → trưởng thành.

---

# 😐 PHẦN 1A — TRẠNG THÁI BÌNH THƯỜNG (NEUTRAL / IDLE STATES)

> **Mỗi nhân vật PHẢI có 1 ảnh neutral** → dùng làm **default portrait** khi đang đọc thoại bình thường, không có emotion cụ thể.
>
> **Đặc điểm**:
> - Mặt thư giãn tự nhiên, **không cười không khóc**
> - Mắt mở bình thường, **không nhướn mày không nhíu mày**
> - Tư thế **đứng/ngồi thoải mái**, không gồng
> - Phù hợp làm **ảnh mặc định** trong dialogue box visual novel
>
> **Filename convention**: `c1_[character]_neutral.png`

---

### 📄 `c1_ti_neutral.png` — TÍ — BÌNH THƯỜNG (neutral)
**Dùng ở đoạn**: Mặc định cho mọi đoạn thoại của Tí không có emotion cụ thể.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)** living in rural Vietnam in the 2010s, height 150cm, **skinny and lanky build typical of underfed rural Vietnamese village teenagers** (visible thin arms, narrow bony shoulders, thin legs with slightly prominent knees, NOT muscular, NOT athletic), soft warm light beige cute-friendly skin with visible sun exposure on arms and face (slightly darker than urban kids), **typical Vietnamese rural village boy facial features: slightly flat and wider nose bridge (NOT pointy Japanese-style nose), soft round child cheeks with a touch of baby fat still present, single eyelid or shallow double eyelid (NOT large Western-style double eyelids), monolid-friendly eye shape, mouth slightly wide with natural-looking lips**, **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, **innocent and pure child-like face — round and full of baby fat, bright curious eyes like a kid who hasn't grown up yet (looks like a primary-school-leaving kid học sinh cấp 2 mới lớn, NOT a mature teenager, NOT a young adult)**, big round black-brown eyes (NOT oversized anime-stereotype round eyes, more natural proportion), narrow shoulders, thin limbs. Clearly looks 13 years old — soft jawline, no facial hair, youthful innocent face, child-like proportions (head slightly larger relative to body).
>
> **Outfit — FIXED CANONICAL COLORS**: oversized **mustard yellow short-sleeve t-shirt (hex color #e5aa46, slightly too big, hand-me-down look, slightly wrinkled fabric)**, **navy blue knee-length shorts (hex color #424a61, with visible wear and slight fading)**, white rubber sandals (Vietnamese "tổ ong" style). **NO backpack, NO bag — Tí ở nhà/đi chơi làng, KHÔNG đeo balo.** Balo chỉ xuất hiện ở emotion có cốt truyện đi học/đi đường dài. **LƯU Ý**: màu áo và quần PHẢI đúng hex #e5aa46 và #424a61 — không được tự đổi tone.
>
> **Specific emotion**: NEUTRAL — relaxed natural default face, eyebrows at rest position, mouth closed in soft natural line, eyes looking forward calmly, no particular emotion showing.
>
> **Pose**: standing naturally with both arms relaxed at sides, full body visible from head to toe, facing camera straight-on, weight evenly distributed on both feet, slight slouch typical of a tired rural kid. **Character is the ONLY element in the image — pure plain white background, nothing else visible.**
>
> **Lighting**: **flat even studio lighting, no directional sunlight, no environment shadows, no golden hour warmth — just clean neutral studio lighting on a plain white seamless backdrop.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_bo_neutral.png` — BỐ TÍ — BÌNH THƯỜNG (neutral)
**Dùng ở đoạn**: Mặc định cho mọi đoạn thoại của Bố không có emotion cụ thể.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 40-year-old Vietnamese man (Tí's father, age-locked at 40, Vietnamese nationality)**, height **175cm** (TALL for his age — appears NOTICEABLY taller than average Vietnamese man, taller than most men in his village, taller than his wife (158cm) by a clear 17cm, taller than Tí 13yo by a clear LOT — has strong VERTICAL proportions with **LONG LEGS that take up about 55% of his total height, legs are NOTICEABLY LONGER than his torso** (NOT short stubby legs, NOT square torso with short legs, NOT compressed height, NOT stunted vertical proportions, NOT short king, NOT compact — his LEGS are LONG and EXTENDED giving him a TALL ELONGATED silhouette), NOT round-bodied, NOT circular-bodied, NOT ball-shaped, NOT spherical, NOT kawaii-chubby-body, NOT baby-torso proportions — his body silhouette is **LONG and ELONGATED like a tall slim tree** not a short round ball), healthy-LEAN toned **TALL SLIM** Bắc Bộ farmer build — fit and strong from years of farm labor but NOT bodybuilder, NOT bulked-up, NOT muscle-bound, NOT thick, NOT round (think TALL slim laborer physique, NOT gym physique, NOT short stout peasant, NOT round peasant): **NOTABLY BROAD SHOULDERS** that are visibly wide (NOT narrow, NOT average — wider than his hips, creating a clear V-taper that signals a fit hard-working man — broad shoulders + narrow waist + LONG LEGS = athletic tall farmer build), arms have **visible lean muscle tone from plowing, hoeing, carrying, chopping wood** (NOT bulging biceps, NOT noodle-arms, NOT skinny-stick arms — arms have shape and tone but stay SLIM and proportionate to his TALL frame), chest is broad but flat, **WASHBOARD-FLAT stomach with NO belly at all** (NOT six-pack abs show-off, NOT round belly, NOT paunch, NOT soft middle-aged spread, NOT beer gut, NOT bloated stomach, NOT weight gain around midsection, NOT thick waist, NOT round middle — his stomach is firm flat and tight like a man who works the fields every day, and his waist is NOTICEABLY NARROWER than his shoulders, creating clear V-shape taper from shoulders down to slim hips), hips are SLIM and NARROW (NOT wide hips, NOT round hips, NOT pear-shaped), hands are large and rough with calluses and a few small scars from years of farm work, posture is upright and straight with squared shoulders (signals discipline and gia giáo — NOT slouched, NOT hunched, NOT farmer's stoop). **Hair color**: **BLACK hair (predominantly black) with SCATTERED silver streaks** sprinkled through — mostly black with a few silver highlights at the temples and a few scattered streaks through the top and sides (NOT all-gray, NOT all-silver, NOT salt-and-pepper throughout, NOT fully gray, NOT white-haired, NOT silver-haired, NOT old-man white hair, NOT peppered throughout — appears at 40 as a man whose hair is still BLACK with only slight early silvering). **Northern Vietnamese countryside face structure**: **square-ish face with clearly defined jawbone and cheekbones** (NOT round Nam Bộ face, NOT oval, NOT soft, NOT gaunt, NOT hollow-cheeked, NOT sunken-cheeks, NOT skinnny-face, NOT malnourished-face — his face is **well-fed and full with healthy flesh** showing he eats well from his farm work and lives in abundance, but the BONE STRUCTURE is square and defined under the flesh — imagine a man whose jaw is wide and pronounced but whose cheeks are full of healthy life, NOT a gaunt starving man, NOT a sunken face), straight broad Vietnamese-Kinh nose (NOT pointy, NOT button-nose, NOT Western-nose), **normal-sized sharp eyes under thick natural brows** that look observant and experienced (**NOT bug-eyes, NOT huge round anime eyes, NOT enlarged cartoon eyes — eye size must be PROPORTIONATE TO A NORMAL ADULT VIETNAMESE MAN FACE, small eyes for a man but sharp and quick, NOT doll-eyes, NOT kawaii-cute-eyes**), forehead has **a few clear horizontal lines** (NOT deep wrinkles, NOT smooth baby skin — sign of someone who squints in the sun thinking), nasolabial folds are softly visible (depth-of-character lines, NOT old-man lines), under-eye slight darkening from sun and labor (NOT dark sunken eye sockets, NOT raccoon eyes — just a hint of tan). **Face overall: a HEALTHY full face with strong defined bones underneath — a working father who is well-fed from his harvest, gaunt-free, hollow-free, sunken-free — NOT a starving peasant, NOT a sick man, NOT a weak man — but a PROUD and ROBUST countryside father with full healthy flesh on a strong square jawline.** **Overall impression: a TALL, fit, healthy-faced, thông minh giàu kinh nghiệm Bắc Bộ rural father in his prime years — cao ráo khỏe mạnh, well-fed với khuôn mặt đầy đặn khỏe mạnh (không gầy gò, không hốc hác, không má hóp), vai rộng rõ rệt với V-taper xuống eo thon (clear V-shape taper from broad shoulders to narrow waist = athletic farmer build), eo hẹp hơn vai rõ rệt (NOT same width shoulder-to-waist, NOT straight tube), bụng phẳng lì (NO belly, NO round midriff), chân dài (tall vertical proportions, NOT stunted, NOT compressed-height), mặt vuông góc cạnh Bắc Bộ đầy đặc trưng với hàm rộng và xương gò má rõ nhưng vẫn đầy đặn healthy flesh, mắt sắc nhỏ và tinh tường (small sharp adult eyes, NOT huge cartoon eyes) cho thấy người đã trải nhiều và biết nhiều — imposing through QUIET AUTHORITY, EXPERIENCED EYES, BROAD-SHOULDDERED POSTURE, and TALL STANCE, NOT bulk, NOT bodybuilder muscles, NOT round belly. Vibe người cha Bắc Bộ vừa cao vừa khỏe vừa khôn: tay thô ráp của nông dân nhưng thân hình athletic V-shape và ánh mắt của người từng trải.**
>
> **Outfit**: white sleeveless tank top (áo ba lỗ, Vietnamese cotton fabric, casual working-class style — slightly loose fit showing broad shoulders), **FULL-LENGTH long black cotton pants reaching down to the ankles (NOT shorts, NOT knee-length, NOT crop pants, NOT 3/4 pants, NOT capri, NOT above-ankle — must extend ALL THE WAY down to cover the ankles and tuck slightly over the rubber sandals)**, white rubber sandals (Vietnamese "tổ ong" style, slip-on). **Pant length is MANDATORY: ankle-length cotton pants are non-negotiable for a proper traditional Bắc Bộ countryside farmer — NOT shorts, NOT modern, NOT westernized.**
>
> **Specific emotion**: NEUTRAL — calm relaxed default face, eyebrows at rest, mouth closed in natural line, eyes looking forward calmly, a slight hint of his usual stern look but no active emotion.
>
> **Pose**: standing tall naturally with arms relaxed at sides, full body visible, facing camera straight-on.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, no directional sunlight, no environment cast shadows, no warm golden hour — just clean neutral studio lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_me_neutral.png` — MẸ TÍ — BÌNH THƯỜNG (neutral)
**Dùng ở đoạn**: Mặc định cho mọi đoạn thoại của Mẹ không có emotion cụ thể.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Tí's mother, age-locked at 35, Vietnamese nationality)** living in rural Bắc Bộ Northern Vietnam, height 158cm, **healthy working-farmwife build — slim-medium with natural curves from years of farm labor and carrying, slightly tanned arms and shoulders from sun, NOT skinny, NOT frail, NOT chubby, NOT plump, NOT fat, NOT office-worker-pale** (think a healthy active countryside wife who works in the garden, feeds chickens, hauls water, and helps with harvest — physically capable but feminine, NOT bodybuilder, NOT thin like a city girl), **soft warm yellowish-brown sun-weathered Bắc Bộ countryside skin** (NOT pale office-worker skin, NOT white-collar, NOT urban-girl skin — clearly a woman who works outdoors regularly, with sun-tanned hands and forearms showing her labor, but her face stays relatively protected by her khăn mỏ quạ so the face is still soft and feminine), **typical 35-year-old Bắc Bộ Kinh Vietnamese female facial features**: **oval face with soft rounded jawline and high cheekbones** (NOT round Nam Bộ chubby face, NOT square face, NOT gaunt, NOT haggard, NOT old-looking, NOT grandmother-aged), **soft small Vietnamese nose** (NOT pointy, NOT Western-nose, NOT big), **normal-sized warm almond-shaped dark brown eyes** with gentle eye-folds (NOT huge anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT round doe eyes, NOT small beady eyes — proportionate to a soft feminine adult face), eyebrows are natural and softly arched (NOT thin plucked, NOT drawn-on, NOT bold), **a few faint smile lines at the corner of eyes from years of smiling** (NOT deep wrinkles, NOT crow's feet, NOT aged lines, NOT old-mother wrinkles — just a hint of life-experience at 35, looks like a young still-beautiful mother in her prime, NOT a tired old woman, NOT 40+, NOT middle-aged-hag, NOT bà ngoại), lips are naturally pink and full (NOT thin, NOT lined, NOT over-drawn). **Hair**: long black hair (still mostly BLACK with maybe one or two faint silver strands hidden near the temples — NOT gray, NOT streaked silver, NOT salt-and-pepper, NOT grandmother-hair, NOT all-silver — at 35 her hair is still YOUNG and BLACK) tied back in a low practical bun with a few soft wisps framing her face, or alternatively worn under her khăn mỏ quạ. **Overall impression: a YOUNG, healthy, beautiful, still-in-her-prime 35-year-old Bắc Bộ rural mother — looks 30-something, NOT 40+, NOT approaching-middle-age, NOT tired, NOT worn-out, NOT grandmother-like — a woman who is still youthful and attractive with the gentle warmth of a countryside mother, working-farmwife energy but feminine soft feminine face.**
>
> **Outfit**: **traditional rural Bắc Bộ Northern Vietnamese farmwife outfit — NOT Nam Bộ áo bà ba, NOT Southern Vietnamese, NOT city clothes, NOT modern, NOT office**: **dark brown coarse hand-woven fabric "áo yếm"** (traditional sleeveless bodice with two shoulder straps crossing at the back, common everyday Bắc Bộ peasant women's garment — NOT the Southern Nam Bộ "áo bà ba" with 3 flaps and floral patterns, NOT a fitted city blouse) over a **pale beige or off-white long-sleeve loose "áo tứ thân" or simple long-sleeve coarse cotton shirt** with sleeves rolled up to the elbows showing her sun-tanned forearms (working-farmer look), paired with **dark brown or charcoal-black loose-fitting "quần lưng vải"** (traditional Bắc Bộ wide-leg coarse cotton pants with a cloth waistband tied at the back, NOT modern jeans, NOT skinny pants, NOT dress, NOT skirt), and on her head a **traditional yellow-brown "khăn mỏ quạ"** (the iconic triangular Northern Vietnamese peasant women's headscarf, folded and tied at the back, framing her face and covering her hair — this is THE defining Bắc Bộ nông dân women's accessory, NOT a city scarf, NOT a hat, NOT bare hair showing, NOT a hairband). **Optional when working outdoors**: a faded floral-patterned "áo ngoài" loose jacket draped over shoulders or tied at the waist. Simple **canvas shoes** or **khăn đỏ (red rubber slippers / dép lê nhựa)**. Hands often slightly dirt-dusted from farm work. **The khăn mỏ quạ is MANDATORY for the Bắc Bộ rural farmwife look — without it the character reads as a city woman or Nam Bộ woman, NOT Bắc Bộ.**
>
> **Specific emotion**: NEUTRAL — gentle calm default face, soft natural expression, eyebrows at rest, mouth in soft natural line, eyes looking forward calmly with mild warmth but no active emotion.
>
> **Pose**: standing naturally with hands clasped lightly in front (Vietnamese woman default pose), full body visible, facing camera straight-on.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, no directional sunlight, no environment cast shadows, no warm golden hour — just clean neutral studio lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_teo_neutral.png` — TÈO — BÌNH THƯỜNG (neutral)
**Dùng ở đoạn**: Mặc định cho mọi đoạn thoại của Tèo không có emotion cụ thể.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tèo, age-locked at 13, Vietnamese nationality)**, height 145cm, average stocky kid build (NOT chubby, NOT fat, NOT overweight, NOT double chin), slightly darker soft warm light beige cute-friendly skin than Tí, typical Vietnamese facial features, short black hair in a tiny mohawk strip, round mischievous eyes, slightly rounded plump baby cheeks (cute, NOT obese). Clearly looks 13 years old.
>
> **Outfit**: oversized faded orange t-shirt with random cartoon print, knee-length denim shorts, worn white rubber sandals.
>
> **Specific emotion**: NEUTRAL — relaxed natural default face with a tiny hint of his usual cheekiness, eyebrows at rest, mouth closed in slight natural smirk (not full grin), eyes looking forward calmly.
>
> **Pose**: standing naturally with both hands in shorts pockets (Vietnamese kid casual pose), full body visible, facing camera straight-on.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, no directional sunlight, no environment cast shadows, no warm golden hour — just clean neutral studio lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_hung_neutral.png` — HÙNG — BÌNH THƯỜNG (neutral)
**Dùng ở đoạn**: Mặc định cho mọi đoạn thoại của Hùng không có emotion cụ thể.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Hùng, age-locked at 13, Vietnamese nationality)**, height 158cm, taller and well-built for his age, fairer soft warm light beige cute-friendly skin than Tí (typical of urban Vietnamese kids from better-off families), typical Vietnamese male teenage facial features (slightly sharper jawline from being well-fed), black hair slicked back neatly and glossy, sharp confident eyes. Clearly looks 13 years old.
>
> **Outfit**: brand-new navy blue polo shirt with small horse logo on chest, tan khaki shorts, pristine white sneaker shoes, silver digital watch.
>
> **Specific emotion**: NEUTRAL — cool composed default face, eyebrows at rest, mouth closed in natural line, eyes looking forward calmly with mild confidence but no active emotion.
>
> **Pose**: standing naturally with one hand resting at side, full body visible, facing camera straight-on, posture upright but relaxed.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, no directional sunlight, no environment cast shadows, no warm golden hour — just clean neutral studio lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_cotu_neutral.png` — CÔ TƯ — BÌNH THƯỜNG (neutral)
**Dùng ở đoạn**: Mặc định cho mọi đoạn thoại của Cô Tư không có emotion cụ thể.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Cô Tư, age-locked at 35, Vietnamese nationality, Northern Vietnamese Bắc bộ accent)**, height 162cm (taller than average Vietnamese woman, lanky long-limbed build), slim-to-medium build (NOT plump, NOT large waist), smooth warm light-tan skin (NOT wrinkled, NOT weathered, NOT age-spotted — she is still youthful), typical young-to-middle-aged Northern Vietnamese shopkeeper woman facial features — round friendly face but with sharper clever jawline (sharp tongue but kind-hearted look), long straight black hair (NOT gray-streaked, NOT elderly bun — she is 35 not 60) tied back in a low casual ponytail at the nape of the neck, bright sharp mischievous eyes (Northern Vietnamese women are famous for sharp clever eyes that can spot a naughty kid from across the street). Clearly looks 35 years old — youthful energetic shopkeeper lady.
>
> **Outfit**: simple practical shopkeeper outfit — a plain long-sleeved button-up shirt in muted color (light blue or pastel green) tucked into high-waist dark blue/black long pants (typical Northern Vietnamese working woman style, NOT fancy, NOT traditional áo bà ba), a short colorful floral-patterned half-apron tied at waist over the shirt (the kind of practical apron Bắc bộ shopkeepers wear to protect clothes while selling goods), simple flat rubber sandals or plain leather sandals.
>
> **Specific emotion**: NEUTRAL — calm default shopkeeper face, eyebrows at rest, mouth closed in a natural line (no smile no scowl), bright sharp eyes looking forward calmly with a hint of "I see everything these kids do" knowing look.
>
> **Pose**: standing naturally behind the counter, both hands resting forward on an invisible surface at waist height (as if leaning on counter), full body visible from head to toe, facing camera straight-on, plump short elderly posture. **Character is the ONLY element in the image — pure plain white background, no scenery, no furniture, no counter visible — only the character with hands held forward as if resting on something.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, no directional sunlight, no environment cast shadows, no warm golden hour — just clean neutral studio lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

## 🧒 TÍ — **13 TUỔI** — 🇻🇳 THIẾU NIÊN VIỆT NAM (8 emotions)

> **Cốt truyện tham chiếu**: Tí bắt đầu ở làng, tò mò về 200k trong heo đất, học CẦN/THÍCH từ mẹ, bị bố dạy sức lao động, rủ Tèo buôn thẻ bài lời 50k, ganh tị với xe đạp mới của Hùng, suýt chết vì xe đứt phanh, và cuối cùng nhận ra giá trị đồng tiền.

### 🔒 COMMON FEATURES cho MỌI emotion của Tí (copy kèm vào TỪNG prompt)
```
- Short black hair, neatly combed schoolboy haircut (Vietnamese "kiểu đầu học sinh"),
  trimmed short on sides, slightly longer on top but still tidy — NOT messy,
  NOT wild, NOT anime-spiky. Hair is clean and well-groomed.
- Innocent child face — round and full of baby fat, soft cheeks like a child,
  bright curious eyes that still look like a kid who hasn't grown up.
- Look like a 13-year-old primary-school-leaving kid (học sinh cấp 2 mới lớn),
  NOT a mature teenager, NOT a young adult.
```

---

### 📄 `c1_ti_curious.png` — TÒ MÒ (curious)
**Dùng ở đoạn**: Scene mở đầu — Tí phá heo đất, đếm tiền, tự hỏi "200k mua được gì?"

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny build, soft warm light beige cute-friendly skin, typical Vietnamese facial features (slightly flat nose bridge, soft round child cheeks with baby fat common to Vietnamese teenagers, single eyelid or shallow double eyelid), **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, **innocent child-like face, bright curious eyes like a kid who hasn't grown up yet**, big round black-brown eyes wide open, narrow shoulders, thin limbs. Clearly looks 13 years old — soft jawline, no facial hair, youthful innocent face.
>
> **Outfit**: oversized mustard yellow short-sleeve t-shirt (hex color #e5aa46), navy blue knee-length shorts (hex color #424a61), white rubber sandals (Vietnamese "tổ ong" style).
>
> **Specific emotion**: deep curiosity, eyebrows slightly raised, mouth in small "o" shape, eyes sparkling, head tilted 15° to the right as if asking a question.
>
> **Pose**: sitting cross-legged in mid-air (legs crossed, hovering pose — no floor visible), holding a broken pink piggy bank and a symbolic cartoon paper money bill (generic stylized green rectangular paper representing money — NO real currency design, NO portraits, NO flags, NO national emblems, NO real denomination numbers, NO security features, NO specific country symbols. Just a simple green rectangle representing generic money, NOT real Vietnamese dong, NOT real US dollar) up to eye level with both hands, examining it like a treasure. **Character is the ONLY element in the image — pure plain white background, no scenery, no furniture, no floor, no ground visible — only the character and the items he is holding.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, no directional sunlight, no environment cast shadows, no warm golden hour, no window light, no indoor lamp light — just clean neutral studio lighting with optional subtle dramatic rim light on the character only.**
>
> **Aspect ratio**: 3:4 vertical, full character + piggy bank visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_ti_confused_money.png` — BỐI RỐI (confused, overwhelmed)
**Dùng ở đoạn**: Scene tạp hóa — Tí cầm 200k vào tiệm Cô Tư, lần đầu đối diện quá nhiều lựa chọn.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny, soft warm light beige cute-friendly skin, typical Vietnamese facial features (slightly flat nose bridge, soft round child cheeks with baby fat), **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, **innocent child-like face, bright eyes like a kid who hasn't grown up yet**, big round black-brown eyes, narrow shoulders, thin limbs. Clearly looks 13 years old — youthful innocent face.
>
> **Outfit**: mustard yellow oversized t-shirt (hex color #e5aa46, hand-me-down, slightly wrinkled), navy blue shorts (hex color #424a61, visible wear), white rubber sandals.
> **Outfit (KHÔNG ba lô)** — Tí 13t đi tạp hóa mua bim bim, cầm 200k trong tay, KHÔNG cần balo. Balo chỉ dùng khi đi học cả ngày.
>
> **Specific emotion**: **child-like confusion, like a 13-year-old kid who has never seen so many snacks at once and doesn't know what to pick.** Eyes wide open and round (NOT squinted, NOT darting sideways suspiciously, NOT glaring), eyebrows raised UPWARD in surprise (NOT pinched together like a scowl), mouth slightly open in a small "oh" shape (NOT biting lip, NOT frowning, NOT scowling). Soft curious "uhh what should I pick?" expression on a round innocent baby-fat face. **NOT evil, NOT menacing, NOT villain-like, NOT adult stress, NOT adult anxiety** — this is a child overwhelmed by too many fun choices, not an adult under pressure.
>
> **Pose**: standing in mid-air (no ground visible), holding the symbolic cartoon paper money bill (generic stylized green rectangular paper representing money — NO real currency, NO portraits, NO flags, NO real numbers) in both hands at chest height, head tilted slightly to one side, eyes looking down at the bill in his hands with a soft confused "what do I do?" expression, shoulders slightly raised in a small shrug. Body language is soft and unsure like a child — NOT tense, NOT stressed, NOT like an adult under pressure. **Character is the ONLY element in the image — pure plain white background, no scenery, no furniture, no shelves visible — only the character and the bill he is holding.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, no directional sunlight, no environment cast shadows, no fluorescent tube, no door sunlight — just clean neutral studio lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_ti_scheming.png` — GIAN XẢO (scheming, sly)
**Dùng ở đoạn**: Scene phi vụ thẻ bài — Tí nảy ra ý định buôn thẻ với Tèo để lời 50k.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny, soft warm light beige cute-friendly skin, typical Vietnamese facial features (slightly flat nose bridge, soft round child cheeks with baby fat), **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, **innocent child-like face** — but with a sly twist in his eyes.
>
> **Outfit**: mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), white rubber sandals.
>
> **Specific emotion**: **mischievous kid scheming, like a 13-year-old boy who just figured out a clever way to make a quick profit and is proud of his idea** — smart-alecky, slightly cocky, but still clearly a child, NOT a villain, NOT evil, NOT adult criminal. One eyebrow raised slightly higher than the other in a playful "hmm?" expression (NOT villain-eyebrow, NOT sinister — just a casual kid cocky look). The other eyebrow relaxed. Eyes wide open and bright with clever curiosity and excitement at his own idea (NOT squinted evilly, NOT glaring, NOT menacing — but NOT blank cute eyes either; the eyes should have a spark of "I know something you don't" cleverness like a smart-aleck kid). Mouth pulled to ONE SIDE in an uneven lopsided grin (NOT a centered cute smile, NOT a closed smirk, NOT menacing) — like a kid who just thought of something cheeky and is trying not to laugh out loud. **Teeth: regular full set of normal healthy teeth visible in the grin, NOT missing teeth, NOT gaps, NOT snaggletooth, NOT snaggletooth gap, NOT chipped, NOT broken, NOT rotten, NOT sún răng, NOT toothless** — Tí has normal complete teeth for a 13-year-old. The whole face still has baby-fat round cheeks showing through. Looks like a clever kid who knows he's about to get away with something — like a kid who hid the cookie jar before mom notices. Childish mischief, NOT adult cunning, NOT villain scheming, NOT horror movie character.
>
> **Pose**: standing in mid-air (no ground visible), one hand held near chin with index finger pointing up at cheek in the classic "I have an idea!" kid gesture, other hand holding the symbolic cartoon paper money bill (generic stylized green rectangular paper representing money — NO real currency, NO portraits, NO flags, NO real numbers) held up slightly as if showing off. Body weight shifted to one foot, slight forward lean — the lean is **curious and slightly cocky** like a kid leaning in to share a secret with his friend, NOT sneaky villain-lean. The whole body language is playful mischievous kid energy — a clever kid, not a villain. **Character is the ONLY element in the image — pure plain white background, no scenery, no furniture visible — only the character and the bill he is holding.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle rim light from behind the character to add dramatic edge — no environment cast shadows, no background scenery lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_ti_greedy.png` — THAM LAM (greedy, eager)
**Dùng ở đoạn**: Tí thấy đống tiền lời từ vụ thẻ bài, mắt sáng rỡ.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny, soft warm light beige cute-friendly skin, typical Vietnamese facial features (slightly flat nose bridge, soft round child cheeks with baby fat), **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, **innocent child-like face, bright eyes like a kid who hasn't grown up yet**. Clearly looks 13 years old.
>
> **Outfit**: mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), white rubber sandals.
>
> **Specific emotion**: **full greedy excitement, classic anime "money-obsessed kid" trope** — Tí's eyes are wide open with cartoon **coin-star pupils / dollar-sign pupils / yen-sign pupils / sparkle-stars in eyes** (the iconic anime trope where greedy characters have stars or currency symbols reflected in their eyes — this is REQUIRED for the greedy vibe, like Tom from Tom & Jerry when he sees cheese, or anime characters spotting treasure). Big open-mouthed grin showing his complete set of normal healthy teeth (NOT missing, NOT gaps, NOT snaggletooth, NOT sún răng). Tongue sticking out slightly at the corner of his mouth in excitement (small kid tongue-out, NOT drooling). Both eyebrows raised high up in excited surprise. Slight pink blush on cheeks from excitement. Face still round with baby-fat cheeks — a kid, NOT an adult, NOT a villain.
>
> **Pose**: standing in mid-air (no ground visible), BOTH ARMS wrapped around a visible stack of symbolic cartoon paper money bills (generic stylized green rectangles representing money — NO real currency, NO portraits, NO flags, NO real numbers) held tightly to his chest in a tight hug, like a kid hugging a pile of candy he doesn't want to share. Both feet slightly off the ground in a tiny excited tiptoe (NOT full jump, NOT flying, NOT action-hero pose — just a small kid standing on tiptoes from excitement). Looking down at the stack of money in his arms with the coin-star eyes. Body language is "MINE! ALL MINE!" kid energy. **Character is the ONLY element in the image — pure plain white background, no scenery, no furniture visible — only the character hugging the stack of symbolic cartoon money bills.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one bright soft overhead light on the character only — no environment cast shadows, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_ti_jealous.png` — GHEN TỊ (jealous, resentful)
**Dùng ở đoạn**: Tí thấy Hùng phóng xe đạp Martin 107 mới qua mặt.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny, soft warm light beige cute-friendly skin, typical Vietnamese facial features (slightly flat nose bridge, soft round child cheeks with baby fat), **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, **innocent child-like face, bright eyes like a kid who hasn't grown up yet**. Clearly looks 13 years old.
>
> **Outfit**: mustard yellow oversized t-shirt (hex color #e5aa46, hand-me-down, slightly wrinkled), navy blue shorts (hex color #424a61, visible wear), white rubber sandals, worn red canvas school backpack (hex color #c83b3b) slung over one shoulder.
> **Outfit (CÓ ba lô)** — Tí 13t vừa tan học, đang đạp xe trên đường làng thì gặp Hùng. Ba lô hợp lý với ngữ cảnh.
>
> **Specific emotion**: **child-like pouty jealousy, like a 13-year-old kid who wants the cool toy his friend has.** Mouth pushed forward into a soft round pout like a kid about to cry (NOT a tight angry scowl, NOT a hard grimace, NOT a snarl). Eyebrows drawn together slightly and angled UPWARD in the middle in a sad-pouty way (NOT furrowed downward like anger, NOT angled down like an adult scowl). Eyes looking sideways with a soft wistful "I wish I had that too" expression (NOT narrowed, NOT glaring, NOT glaring with hatred — more like a kid watching other kids play). Eyelids slightly droopy in longing. Hands held at sides with fingers slightly curled (NOT tight white-knuckled fists, NOT clenched aggressive fists — just a small child's soft frustration). Whole face still has baby-fat round cheeks showing through. Looks like a kid who got the smaller toy — sad pout, NOT villain rage, NOT adult bitterness.
>
> **Pose**: standing in mid-air (no ground visible), both hands held forward at chest height with fingers loosely curled as if gripping an invisible handlebar (soft kid grip, NOT white-knuckled adult grip, NOT tense death grip). Head turned slightly to one side looking sideways at an unseen direction with a wistful sad-pouty expression, shoulders slightly slumped forward in a small kid way (NOT squared aggressive stance, NOT villain stance). **Character is the ONLY element in the image — pure plain white background, no scenery, no bicycle, no furniture visible — only the character with hands positioned as if gently gripping handlebars.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle warm rim light on character only — no environment shadows, no background scenery lighting.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_ti_terrified.png` — SỢ HÃI (terrified, screaming)
**Dùng ở đoạn**: Tai nạn đứt phanh — Tí bay khỏi xe đạp xuống ruộng lúa.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny, soft warm light beige cute-friendly skin, typical Vietnamese facial features (slightly flat nose bridge, soft round child cheeks with baby fat), **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, hair strands now flying wildly from wind impact, **innocent child-like face** — soft youthful but twisted in terror. Clearly looks 13 years old.
>
> **Outfit**: mustard yellow oversized t-shirt (hex color #e5aa46, now mud-splattered), navy blue shorts (hex color #424a61), white rubber sandals (one flying off).
>
> **Specific emotion**: **child-like scared scream, like a 13-year-old kid on a rollercoaster for the first time who is suddenly terrified.** Eyes wide open with small pupils (NOT pin-prick anime villain eyes, NOT slit eyes, NOT menacing glare) — but eye size still normal kawaii proportion (eyes do NOT take up more than 30% of face area). Eyebrows raised UPWARD in shock (NOT angled down, NOT angry). Mouth open in a small round "aa!" scared shape — **mouth size SMALL to medium, NOT gaping wide, NOT taking up half the face, NOT a horror scream, NOT a villain snarl**. Small sweat drops on forehead and one small tear forming at the corner of one eye (NOT dramatic anime villain tears). **Face proportions stay NORMAL — face MUST keep the same round child-like proportions as other emotions, do NOT enlarge the head, do NOT distort facial features, do NOT stretch the face. Head-to-body ratio stays 1:2.5 consistent with other Tí sprites. The face is a scared KID face, NOT a horror movie character, NOT a deformed exaggerated face.**
>
> **Pose**: mid-air action pose like a kid who just tripped, body small and compact tumbling diagonally (body stays kawaii 1:2.5 proportions, NOT stretched, NOT elongated, NOT deformed), arms flailing outward (NOT crossed protectively, NOT villain-style), legs splayed in a surprised kid way, red canvas school backpack flying off one shoulder (consistent with c1_ti_jealous.png — Tí was coming back from school). Expression is "aaaa I'm gonna fall!" small kid-scream (small mouth, normal face proportions, NOT horror scream), NOT action-hero pose, NOT villain falling. **Face MUST stay normal size and round kawaii proportions — do NOT enlarge the head, do NOT make mouth huge, do NOT distort the face. Character is the ONLY element in the image — pure plain white background, no scenery, no rice paddy, no ground visible — only the tumbling character and his flying backpack.**
> **Outfit (CÓ ba lô bay theo)** — Tí vừa tan học, gặp Hùng ở emotion trước (c1_ti_jealous.png), nên lúc tai nạn vẫn còn đeo ba lô. Ba lô đang bay theo khi Tí văng khỏi xe.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, bright and even — no harsh directional sunlight, no background, no motion blur on environment.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_ti_sad_sickbed.png` — BUỒN BÃ / MỆT MỎI (sad, defeated)
**Dùng ở đoạn**: Hậu quả tai nạn — Tí nằm liệt giường, băng kín, hối hận.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny, paler than usual, short black hair messy. Clearly looks 13 years old, soft boyish face now showing regret.
>
> **Outfit**: simple Vietnamese rural pajamas (áo bệnh nhân), bandage wrapped around left arm, small band-aid on forehead.
>
> **Specific emotion**: tired sadness and deep regret. Eyes half-open and looking down (eyes smaller than usual — droopy heavy eyelids covering the top half of the iris, NOT fully wide, NOT bug eyes, NOT sleep-closed). **Lower eyelids slightly puffed with a small red-pink rim** to convey crying-sadness. Eyebrows soft drooping, inner corners angled slightly UP toward the bridge of the nose (the classic sad-mouth-down brow-up inner-corner signal — conveys sorrow, NOT neutral, NOT angled down in anger). Lips slightly downturned at the corners (a small soft downturn, NOT a huge frown, NOT stretching past the bottom of the nose). A single tear forming in the corner of one eye (small round tear drop, NOT heavy dramatic anime tears streaming down face). **Overall mood = distinct sad kid in bed, NOT sleepy, NOT bored, NOT neutral, NOT sick-tired without emotion. Clearly different from other emotions.** Quiet gentle sadness with a hint of self-blame regret — NOT theatrical crying, NOT dramatic wailing, NOT adult grief. **Face proportions stay NORMAL — head NOT enlarged, face NOT distorted, cheeks still round baby-fat showing through, NOT hollow-cheeked drama face. The sad expression comes from the EYEBROW + EYELID + MOUTH-CORNER signals, NOT from stretching or enlarging the head.**
>
> **Pose**: **FULL-BODY LONG SHOT, character is small in frame, head and feet are both small enough that there is plenty of whitespace above the head and below the feet** (NOT close-up, NOT portrait crop, NOT zoomed-in on face, NOT bust shot, NOT shoulders-up, NOT waist-up, NOT tight framing, NOT cropped at hips, NOT filling the entire frame with the character). The character is lying on an invisible flat surface (as if on bed — but no bed visible), body propped up slightly on his right elbow so his torso is lifted at a low angle (a sick kid lying in bed looking at his broken piggy bank). Head tilted slightly forward and down with chin tucked in toward chest (a submissive dejected posture typical of a sad kid in bed, NOT head held up high, NOT smiling-up posture). Eyes cast down toward the broken piggy bank with a sad, regretful gaze (NOT looking forward at camera, NOT perky). The character wears simple Vietnamese rural pajamas (áo bệnh nhân, loose pale colored cotton fabric — pale blue or pale grey), bandaged left arm (wrapped in white gauze), small band-aid on forehead. Empty broken piggy bank (pink ceramic, cracked with a chip missing from the rim) is placed on an unseen surface just in front of the character at chest/face level, roughly at the level of the character's left hand — **the piggy bank is clearly visible in frame** as a small companion object beside the character's face, NOT cropped out, NOT omitted, NOT too far from the character to be unreadable. **Both feet visible in frame at the bottom edge** (small bare feet in pajama pants, simple and kawaii). The character must fit ENTIRELY inside the image frame: top of hair visible, both feet visible, both hands visible. **CAMERA FRAMING**: full body + piggy bank visible, character occupies approximately 55–65% of the vertical frame height — the HEAD looks small enough that the body proportions stay accurate (1:2.5 head-to-body), face features readable but NOT zoomed in, NOT enlarged. Plenty of white negative space above head and below feet. The character is the dominant element with the piggy bank as a secondary element. The whole body is in frame, not cropped. **Character + piggy bank are the ONLY elements in the image — pure plain white background #FFFFFF, no scenery, no bed, no furniture visible.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one warm soft rim light from beside the character — no environment cast shadows, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character + piggy bank visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_ti_determined.png` — KIÊN ĐỊNH / TRƯỞNG THÀNH (determined, wiser)
**Dùng ở đoạn**: Kết Chương 1 — Tí đặt ống heo đất trở lại, quyết tâm tiết kiệm lại từ đầu.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality)**, height 150cm, skinny, soft warm light beige cute-friendly skin, typical Vietnamese facial features (slightly flat nose bridge, soft round child cheeks with baby fat), **short layered Vietnamese schoolboy haircut (kiểu tóc layer ngắn học sinh cấp 2) — even short length all around the head about 2-3 cm, with soft natural layers on top slightly covering the forehead in a neat fringe, fringe brushed to one side naturally (NOT perfectly combed, NOT slicked, NOT gel-styled, NOT with hair product), fringe slightly falling over eyebrows but not covering eyes. Hair looks natural, soft, freshly washed, no gel, no wax, no pomade. The cut is uniform length like a typical Vietnamese rural lower-secondary schoolboy haircut from the 2010s — practical, neat, age-appropriate for a 13-year-old boy. NOT spiky, NOT messy, NOT wild, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun.**, **innocent child-like face** — but with a newly matured expression in his eyes. Clearly looks 13 years old.
>
> **Outfit**: mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), white rubber sandals.
>
> **Specific emotion**: mature determination for a 13-year-old kid, eyes calm and steady looking forward (NOT angry, NOT glaring), eyebrows firm but soft (NOT furrowed in anger), mouth in small confident line with a tiny gentle smile (NOT scowl, NOT frown). A quiet "I learned my lesson" expression — looks like a kid who has just grown up a tiny bit after a hard life lesson, NOT an adult warrior, NOT a villain, NOT a hero pose. Face still round with baby-fat cheeks showing through — he's still 13.
>
> **Pose**: standing tall in mid-air (no ground visible), both hands held forward at chest height holding a brand-new empty pink piggy bank (as if placing it on a table — but no table visible, no ground visible). Looking directly at camera with that small quiet confident smile, full body visible from head to toe. **Character is the ONLY element in the image — pure plain white background, no scenery, no table, no furniture visible — only the character and the piggy bank he is holding forward.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle warm soft rim light on character only — no window light, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character + piggy bank visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

## 👨 BỐ TÍ — **40 TUỔI** — 🇻🇳 ĐÀN ÔNG VIỆT NAM (4 emotions)

> **Cốt truyện tham chiếu**: Bố là nông dân thẳng thắn, dạy Tí bài học sức lao động và giá trị đồng tiền qua việc nhà, không nói nhiều nhưng mỗi lời đều nặng ký.
>
> **Visual direction**: Bố Tí 40 tuổi — người đàn ông Việt Nam nông thôn **Bắc Bộ** trong giai đoạn **đang ở độ chín** (chứ không phải 50+ trông già). Đặc trưng Bắc Bộ: mặt **vuông góc cạnh** với xương hàm rõ rệt (NOT mặt tròn phía Nam), mũi thẳng đặc trưng người Kinh Bắc Bộ, da **ngăm gió nâu đồng** (NOT trắng, NOT vàng nhạt, NOT da sáng) — rám nắng từ năm này qua năm khác ngoài đồng. **Thân hình healthy-LEAN nhưng có cơ rắn chắc vừa phải** — kiểu người lao động chân tay khỏe mạnh thật sự chứ không phải bodybuilder: vai rộng vừa phải (NOT shoulder-broad, NOT bodybuilder), cánh tay có cơ bắp vừa đủ từ cày bừa vác cuốc (NOT bulging muscle, NOT skinny stick-arm, NOT noodle-arm), bàn tay to thô ráp có vết chai, ngực hơi rộng, bụng phẳng (NOT six-pack show-off, NOT fat belly, NOT round-bellied, NOT paunch). Vai vuông, lưng thẳng — dáng người lao động kỷ luật. Tóc cắt ngắn gọn gàng vuốt về sau (kiểu tóc bổ luống hoặc húi cua hai bên vuốt ngược — đặc trưng đàn ông Bắc Bộ thế hệ 1980s), chỉ có vài sợi bạc rất nhẹ ở thái dương (già sớm một chút so với tuổi 40 — dấu hiệu người trưởng thành sớm và chịu thương chịu khó). Râu lởm chởm 2 ngày (kiểu đàn ông Bắc nông thôn không cạo kỹ). Áo ba lỗ trắng, quần đen dài, dép tổ ong.
>
> **Biểu cảm "thông minh giàu kinh nghiệm"**: đây là điểm quan trọng — bố Tí không phải nông dân thường. Mắt **sâu sắc, sáng và tinh tường** (NOT dull-eyed, NOT half-shut, NOT sleepy) — kiểu mắt "đã thấy nhiều chuyện đời". **Trán rộng và có nếp nhăn ngang** (deep horizontal forehead lines from years of thoughtful squinting under the sun) — dấu hiệu người suy nghĩ chín chắn, không phải nông dân cục mịch. **Khóe miệng có một nếp nhăn sâu** ăn từ cánh mũi xuống khóe miệng (nasolabial folds — dấu hiệu người từng trải, suy tư, KHÔNG phải dấu hiệu già), cho cảm giác khuôn mặt có chiều sâu tri thức. Lông mày rậm tự nhiên (kiểu lông mày người Bắc Bộ — đậm, rõ, hơi xếch nhẹ nhưng không dữ). Ánh mắt **nghiêm nghị gia giáo** nhưng không tàn nhẫn — khi nhìn vào mắt ông thì thấy sự **từng trải và công bằng** chứ không phải sự ngốc nghếch hay tức giận.
>
> **Body language**: Khi giận thì không hét lớn mà cứ **im lặng nhìn** rồi nói ngắn gọn bằng những câu ngắn như "Đi.", "Vườn.", "Không." — quyền lực đến từ sự **im lặng**. Khi vui thì không cười to, chỉ khóe miệng hơi nhếch lên, ánh mắt dịu xuống rồi quay đi. **Visual essence**: bóng dáng một người cha Bắc Bộ Việt Nam thế hệ 1980s–90s — nông dân **vừa khỏe vừa khôn** — tay thô ráp của người làm ruộng nhưng ánh mắt của người đã đọc nhiều sách và trải nhiều sự đời. Không phải nông dân cục mịch, không phải trí thức thành thị, mà là người nông dân Bắc Bộ có học thức và từng trải — 'thương con nhưng không chiều con'.

---

### 📄 `c1_bo_strict.png` — NGHIÊM KHẮC (strict, pointing at garden)
**Dùng ở đoạn**: Bố sai Tí ra vườn làm cỏ thay vì ngồi chơi.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 40-year-old Vietnamese man (Tí's father, age-locked at 40, Vietnamese nationality)**, height **175cm** (TALL for his age — appears NOTICEABLY taller than average Vietnamese man, taller than most men in his village, taller than his wife (158cm) by a clear 17cm, taller than Tí 13yo by a clear LOT — has strong VERTICAL proportions with **LONG LEGS that take up about 55% of his total height, legs are NOTICEABLY LONGER than his torso** (NOT short stubby legs, NOT square torso with short legs, NOT compressed height, NOT stunted vertical proportions, NOT short king, NOT compact — his LEGS are LONG and EXTENDED giving him a TALL ELONGATED silhouette), NOT round-bodied, NOT circular-bodied, NOT ball-shaped, NOT spherical, NOT kawaii-chubby-body, NOT baby-torso proportions — his body silhouette is **LONG and ELONGATED like a tall slim tree** not a short round ball), healthy-LEAN toned **TALL SLIM** Bắc Bộ farmer build — fit and strong from years of farm labor but NOT bodybuilder, NOT bulked-up, NOT muscle-bound, NOT thick, NOT round (think TALL slim laborer physique, NOT gym physique, NOT short stout peasant, NOT round peasant): **NOTABLY BROAD SHOULDERS** that are visibly wide (NOT narrow, NOT average — wider than his hips, creating a clear V-taper that signals a fit hard-working man — broad shoulders + narrow waist + LONG LEGS = athletic tall farmer build), arms have **visible lean muscle tone from plowing, hoeing, carrying, chopping wood** (NOT bulging biceps, NOT noodle-arms, NOT skinny-stick arms — arms have shape and tone but stay SLIM and proportionate to his TALL frame), chest is broad but flat, **WASHBOARD-FLAT stomach with NO belly at all** (NOT six-pack abs show-off, NOT round belly, NOT paunch, NOT soft middle-aged spread, NOT beer gut, NOT bloated stomach, NOT weight gain around midsection, NOT thick waist, NOT round middle — his stomach is firm flat and tight like a man who works the fields every day, and his waist is NOTICEABLY NARROWER than his shoulders, creating clear V-shape taper from shoulders down to slim hips), hips are SLIM and NARROW (NOT wide hips, NOT round hips, NOT pear-shaped), hands are large and rough with calluses and a few small scars from years of farm work, posture is upright and straight with squared shoulders (signals discipline and gia giáo — NOT slouched, NOT hunched, NOT farmer's stoop). **Hair color**: **BLACK hair (predominantly black) with SCATTERED silver streaks** sprinkled through — mostly black with a few silver highlights at the temples and a few scattered streaks through the top and sides (NOT all-gray, NOT all-silver, NOT salt-and-pepper throughout, NOT fully gray, NOT white-haired, NOT silver-haired, NOT old-man white hair, NOT peppered throughout — appears at 40 as a man whose hair is still BLACK with only slight early silvering). **Northern Vietnamese countryside face structure**: **square-ish face with clearly defined jawbone and cheekbones** (NOT round Nam Bộ face, NOT oval, NOT soft, NOT gaunt, NOT hollow-cheeked, NOT sunken-cheeks, NOT skinnny-face, NOT malnourished-face — his face is **well-fed and full with healthy flesh** showing he eats well from his farm work and lives in abundance, but the BONE STRUCTURE is square and defined under the flesh — imagine a man whose jaw is wide and pronounced but whose cheeks are full of healthy life, NOT a gaunt starving man, NOT a sunken face), straight broad Vietnamese-Kinh nose (NOT pointy, NOT button-nose, NOT Western-nose), **normal-sized sharp eyes under thick natural brows** that look observant and experienced (**NOT bug-eyes, NOT huge round anime eyes, NOT enlarged cartoon eyes — eye size must be PROPORTIONATE TO A NORMAL ADULT VIETNAMESE MAN FACE, small eyes for a man but sharp and quick, NOT doll-eyes, NOT kawaii-cute-eyes**), forehead has **a few clear horizontal lines** (NOT deep wrinkles, NOT smooth baby skin — sign of someone who squints in the sun thinking), nasolabial folds are softly visible (depth-of-character lines, NOT old-man lines), under-eye slight darkening from sun and labor (NOT dark sunken eye sockets, NOT raccoon eyes — just a hint of tan). **Face overall: a HEALTHY full face with strong defined bones underneath — a working father who is well-fed from his harvest, gaunt-free, hollow-free, sunken-free — NOT a starving peasant, NOT a sick man, NOT a weak man — but a PROUD and ROBUST countryside father with full healthy flesh on a strong square jawline.** **Overall impression: a TALL, fit, healthy-faced, thông minh giàu kinh nghiệm Bắc Bộ rural father in his prime years — cao ráo khỏe mạnh, well-fed với khuôn mặt đầy đặn khỏe mạnh (không gầy gò, không hốc hác, không má hóp), vai rộng rõ rệt với V-taper xuống eo thon (clear V-shape taper from broad shoulders to narrow waist = athletic farmer build), eo hẹp hơn vai rõ rệt (NOT same width shoulder-to-waist, NOT straight tube), bụng phẳng lì (NO belly, NO round midriff), chân dài (tall vertical proportions, NOT stunted, NOT compressed-height), mặt vuông góc cạnh Bắc Bộ đầy đặc trưng với hàm rộng và xương gò má rõ nhưng vẫn đầy đặn healthy flesh, mắt sắc nhỏ và tinh tường (small sharp adult eyes, NOT huge cartoon eyes) cho thấy người đã trải nhiều và biết nhiều — imposing through QUIET AUTHORITY, EXPERIENCED EYES, BROAD-SHOULDDERED POSTURE, and TALL STANCE, NOT bulk, NOT bodybuilder muscles, NOT round belly. Vibe người cha Bắc Bộ vừa cao vừa khỏe vừa khôn: tay thô ráp của nông dân nhưng thân hình athletic V-shape và ánh mắt của người từng trải.**
>
> **Outfit**: white sleeveless tank top (áo ba lỗ, Vietnamese cotton fabric, casual working-class style — slightly loose fit showing broad shoulders), **FULL-LENGTH long black cotton pants reaching down to the ankles (NOT shorts, NOT knee-length, NOT crop pants, NOT 3/4 pants, NOT capri, NOT above-ankle — must extend ALL THE WAY down to cover the ankles and tuck slightly over the rubber sandals)**, white rubber sandals (Vietnamese "tổ ong" style, slip-on). **Pant length is MANDATORY: ankle-length cotton pants are non-negotiable for a proper traditional Bắc Bộ countryside farmer — NOT shorts, NOT modern, NOT westernized.**
>
> **Accessories**: steel wrench resting on shoulder, handkerchief draped on the other.
>
> **Specific emotion**: firm strict scolding, eyebrows angled down sharply, mouth pulled into a stern straight line, eyes glaring with intense focus, vein popping on temple, one hand pointing authoritatively.
>
> **Pose**: standing tall, full body visible, one hand pointing toward an unseen garden direction, the other hand resting on hip, weight on back foot like a commander.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one dramatic warm rim light from the side hitting only the character's face — no environment shadows, no background scenery.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_bo_proud.png` — TỰ HÀO (proud, slight smile)
**Dùng ở đoạn**: Bố thấy Tí tự mình đi làm thêm kiếm tiền mua lại ống heo.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 40-year-old Vietnamese man (Tí's father, age-locked at 40, Vietnamese nationality)**, height **175cm** (TALL for Vietnamese man with **LONG LEGS making up 55% of his tall height** — taller than most men in his village, taller than his wife by 17cm, NOT short, NOT compact, NOT stunted, NOT compressed-height, NOT round-baby-torso with short-legs), **healthy-LEAN TONED TALL SLIM Bắc Bộ farmer build** (NOT fat, NOT chubby, NOT round-bellied, NOT paunch, NOT stocky, NOT barrel-chested, NOT bodybuilder, NOT muscle-bound, NOT thick, NOT round-bodied, NOT circular-bodied, NOT ball-shaped, NOT kawaii-chubby, NOT baby proportions, NOT spherical) — body silhouette is **LONG ELONGATED TALL** (like a tall slim tree, NOT a short round ball), **NOTABLY BROAD SHOULDERS** visibly wider than his hips creating clear V-shape taper from shoulders down to **NOTICEABLY NARROWER slim waist** (NOT narrow shoulders, NOT average shoulders, NOT same width shoulder-to-waist, NOT straight tube body, NOT same-width torso), **slim narrow hips** (NOT wide hips, NOT pear-shaped, NOT round hips), visible lean muscle tone in arms from years of farm labor — arms shaped by hoeing and carrying, NOT bulging biceps, NOT noodle arms, flat broad chest, **WASHBOARD-FLAT firm stomach with NO belly at all** (NOT six-pack show-off, NOT round belly, NOT paunch, NOT beer gut, NOT soft middle-aged spread, NOT weight around midsection, NOT bloated — his waist is NOTICEABLY NARROWER than his shoulders, clear athletic V-shape taper), large rough calloused hands, squared shoulders kept straight (NOT slouched, NOT hunched, NOT farmer's stoop). **Northern Vietnamese healthy face**: square-ish face with WIDE defined jawline and cheekbones (NOT round Nam Bộ face, NOT gaunt, NOT hollow-cheeked, NOT sunken, NOT malnourished), well-fed full healthy flesh on strong bones (NOT skinny-faced, NOT starving peasant, NOT sick-looking — a healthy working father who eats well), straight broad nose, **NORMAL-sized sharp adult eyes** under thick dark natural brows (**NOT big anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT doll-eyes, NOT enlarged cartoon eyes — small sharp adult male eyes for a wise experienced man**), forehead has clear horizontal lines from squinting in the sun thinking (NOT deep wrinkles, NOT smooth baby skin), light nasolabial folds (depth-of-character lines, NOT old-man lines), deep warm light brown weather-tanned cute-friendly skin (NOT pale, NOT white, NOT yellow-pale — looks like a man who has worked outdoors his whole life). **Hair color**: **BLACK hair (predominantly black) with SCATTERED silver streaks** sprinkled through — mostly black with a few silver highlights at the temples and a few scattered streaks through the top and sides (NOT all-gray, NOT all-silver, NOT salt-and-pepper throughout, NOT fully gray, NOT white-haired, NOT silver-haired, NOT old-man white hair). **Overall impression: a TALL, fit, healthy-faced, thông minh giàu kinh nghiệm Bắc Bộ rural father in his prime years — cao ráo khỏe mạnh, well-fed với khuôn mặt đầy đặn khỏe mạnh (không gầy gò, không hốc hác, không má hóp), vai rộng rõ rệt với V-taper xuống eo thon (clear V-shape taper from broad shoulders to narrow waist = athletic farmer build), eo hẹp hơn vai rõ rệt (NOT same width shoulder-to-waist, NOT straight tube), bụng phẳng lì (NO belly, NO round midriff), chân dài (tall vertical proportions, NOT stunted, NOT compressed-height), mặt vuông góc cạnh Bắc Bộ đầy đặc trưng với hàm rộng và xương gò má rõ nhưng vẫn đầy đặn healthy flesh, mắt sắc nhỏ và tinh tường (small sharp adult eyes, NOT huge cartoon eyes) cho thấy người đã trải nhiều và biết nhiều — imposing through QUIET AUTHORITY, EXPERIENCED EYES, BROAD-SHOULDDERED POSTURE, and TALL STANCE, NOT bulk, NOT bodybuilder muscles, NOT round belly. Vibe người cha Bắc Bộ vừa cao vừa khỏe vừa khôn: tay thô ráp của nông dân nhưng thân hình athletic V-shape và ánh mắt của người từng trải.** Clearly looks 40 years old.
>
> **Outfit**: white sleeveless tank top, **FULL-LENGTH long black cotton pants reaching down to the ankles (NOT shorts, NOT knee-length, NOT crop, NOT 3/4 pants, NOT capri, NOT above-ankle — must extend all the way down to the ankles and tuck over the rubber sandals)**, white rubber sandals.
>
> **Specific emotion**: hidden pride, mouth corners slightly upturned trying not to smile, eyebrows relaxed, eyes warm and soft, a single proud tear could form in corner.
>
> **Pose**: standing with arms now folded, head tilted slightly, looking at something off-camera (Tí) with a barely-there smile.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle warm rim light on character's shoulders — no sunset effect, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_bo_angry.png` — GIẬN DỮ (angry, shouting)
**Dùng ở đoạn**: Bố biết Tí liều mình đua xe với Hùng → tai nạn.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 40-year-old Vietnamese man (Tí's father, age-locked at 40, Vietnamese nationality)**, height **175cm** (TALL for Vietnamese man with **LONG LEGS making up 55% of his tall height** — taller than most men in his village, taller than his wife by 17cm, NOT short, NOT compact, NOT stunted, NOT compressed-height, NOT round-baby-torso with short-legs), **healthy-LEAN TONED TALL SLIM Bắc Bộ farmer build** (NOT fat, NOT chubby, NOT round-bellied, NOT paunch, NOT stocky, NOT barrel-chested, NOT bodybuilder, NOT muscle-bound, NOT thick, NOT round-bodied, NOT circular-bodied, NOT ball-shaped, NOT kawaii-chubby, NOT baby proportions, NOT spherical) — body silhouette is **LONG ELONGATED TALL** (like a tall slim tree, NOT a short round ball), **NOTABLY BROAD SHOULDERS** visibly wider than his hips creating clear V-shape taper from shoulders down to **NOTICEABLY NARROWER slim waist** (NOT narrow shoulders, NOT average shoulders, NOT same width shoulder-to-waist, NOT straight tube body, NOT same-width torso), **slim narrow hips** (NOT wide hips, NOT pear-shaped, NOT round hips), visible lean muscle tone in arms from years of farm labor — arms shaped by hoeing and carrying, NOT bulging biceps, NOT noodle arms, flat broad chest, **WASHBOARD-FLAT firm stomach with NO belly at all** (NOT six-pack show-off, NOT round belly, NOT paunch, NOT beer gut, NOT soft middle-aged spread, NOT weight around midsection, NOT bloated — his waist is NOTICEABLY NARROWER than his shoulders, clear athletic V-shape taper), large rough calloused hands, squared shoulders kept straight (NOT slouched, NOT hunched, NOT farmer's stoop). **Northern Vietnamese healthy face**: square-ish face with WIDE defined jawline and cheekbones (NOT round Nam Bộ face, NOT gaunt, NOT hollow-cheeked, NOT sunken, NOT malnourished), well-fed full healthy flesh on strong bones (NOT skinny-faced, NOT starving peasant, NOT sick-looking — a healthy working father who eats well), straight broad nose, **NORMAL-sized sharp adult eyes** under thick dark natural brows (**NOT big anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT doll-eyes, NOT enlarged cartoon eyes — small sharp adult male eyes for a wise experienced man**), forehead has clear horizontal lines from squinting in the sun thinking (NOT deep wrinkles, NOT smooth baby skin), light nasolabial folds (depth-of-character lines, NOT old-man lines), deep warm light brown weather-tanned cute-friendly skin (NOT pale, NOT white, NOT yellow-pale — looks like a man who has worked outdoors his whole life). **Hair color**: **BLACK hair (predominantly black) with SCATTERED silver streaks** sprinkled through — mostly black with a few silver highlights at the temples and a few scattered streaks through the top and sides (NOT all-gray, NOT all-silver, NOT salt-and-pepper throughout, NOT fully gray, NOT white-haired, NOT silver-haired, NOT old-man white hair). **Overall impression: a TALL, fit, healthy-faced, thông minh giàu kinh nghiệm Bắc Bộ rural father in his prime years — cao ráo khỏe mạnh, well-fed với khuôn mặt đầy đặn khỏe mạnh (không gầy gò, không hốc hác, không má hóp), vai rộng rõ rệt với V-taper xuống eo thon (clear V-shape taper from broad shoulders to narrow waist = athletic farmer build), eo hẹp hơn vai rõ rệt (NOT same width shoulder-to-waist, NOT straight tube), bụng phẳng lì (NO belly, NO round midriff), chân dài (tall vertical proportions, NOT stunted, NOT compressed-height), mặt vuông góc cạnh Bắc Bộ đầy đặc trưng với hàm rộng và xương gò má rõ nhưng vẫn đầy đặn healthy flesh, mắt sắc nhỏ và tinh tường (small sharp adult eyes, NOT huge cartoon eyes) cho thấy người đã trải nhiều và biết nhiều — imposing through QUIET AUTHORITY, EXPERIENCED EYES, BROAD-SHOULDDERED POSTURE, and TALL STANCE, NOT bulk, NOT bodybuilder muscles, NOT round belly. Vibe người cha Bắc Bộ vừa cao vừa khỏe vừa khôn: tay thô ráp của nông dân nhưng thân hình athletic V-shape và ánh mắt của người từng trải.** Clearly looks 40 years old, weathered angry face.
>
> **Outfit**: white sleeveless tank top, **FULL-LENGTH long black cotton pants reaching down to the ankles (NOT shorts, NOT knee-length, NOT crop, NOT 3/4 pants, NOT capri, NOT above-ankle — must extend all the way down to the ankles and tuck over the rubber sandals)**, white rubber sandals.
>
> **Specific emotion**: explosive anger, mouth open shouting (medium mouth size, NOT gaping wide, NOT taking up more than 25% of face, normal face proportions maintained), eyebrows V-shaped sharp, vein popping on forehead, eyes glaring with fury, fists clenched. Face stays cute kawaii round proportions consistent with other Tí sprites — do NOT enlarge head, do NOT stretch mouth.
>
> **Pose**: standing with one hand raised high as if about to spank, the other hand pointing at the broken bicycle on the ground, body leaning forward in rage.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one dramatic warm rim light from behind character only — no silhouette effect, no background scenery.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_bo_kind.png` — HIỀN TỪ (kind, fatherly, teaching)
**Dùng ở đoạn**: Bố ngồi xuống nói chuyện nhẹ nhàng với Tí sau tai nạn, kể chuyện thời trẻ.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 40-year-old Vietnamese man (Tí's father, age-locked at 40, Vietnamese nationality)**, height **175cm** (TALL for Vietnamese man with **LONG LEGS making up 55% of his tall height** — taller than most men in his village, taller than his wife by 17cm, NOT short, NOT compact, NOT stunted, NOT compressed-height, NOT round-baby-torso with short-legs), **healthy-LEAN TONED TALL SLIM Bắc Bộ farmer build** (NOT fat, NOT chubby, NOT round-bellied, NOT paunch, NOT stocky, NOT barrel-chested, NOT bodybuilder, NOT muscle-bound, NOT thick, NOT round-bodied, NOT circular-bodied, NOT ball-shaped, NOT kawaii-chubby, NOT baby proportions, NOT spherical) — body silhouette is **LONG ELONGATED TALL** (like a tall slim tree, NOT a short round ball), **NOTABLY BROAD SHOULDERS** visibly wider than his hips creating clear V-shape taper from shoulders down to **NOTICEABLY NARROWER slim waist** (NOT narrow shoulders, NOT average shoulders, NOT same width shoulder-to-waist, NOT straight tube body, NOT same-width torso), **slim narrow hips** (NOT wide hips, NOT pear-shaped, NOT round hips), visible lean muscle tone in arms from years of farm labor — arms shaped by hoeing and carrying, NOT bulging biceps, NOT noodle arms, flat broad chest, **WASHBOARD-FLAT firm stomach with NO belly at all** (NOT six-pack show-off, NOT round belly, NOT paunch, NOT beer gut, NOT soft middle-aged spread, NOT weight around midsection, NOT bloated — his waist is NOTICEABLY NARROWER than his shoulders, clear athletic V-shape taper), large rough calloused hands, squared shoulders kept straight (NOT slouched, NOT hunched, NOT farmer's stoop). **Northern Vietnamese healthy face**: square-ish face with WIDE defined jawline and cheekbones (NOT round Nam Bộ face, NOT gaunt, NOT hollow-cheeked, NOT sunken, NOT malnourished), well-fed full healthy flesh on strong bones (NOT skinny-faced, NOT starving peasant, NOT sick-looking — a healthy working father who eats well), straight broad nose, **NORMAL-sized sharp adult eyes** under thick dark natural brows (**NOT big anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT doll-eyes, NOT enlarged cartoon eyes — small sharp adult male eyes for a wise experienced man**), forehead has clear horizontal lines from squinting in the sun thinking (NOT deep wrinkles, NOT smooth baby skin), light nasolabial folds (depth-of-character lines, NOT old-man lines), deep warm light brown weather-tanned cute-friendly skin (NOT pale, NOT white, NOT yellow-pale — looks like a man who has worked outdoors his whole life). **Hair color**: **BLACK hair (predominantly black) with SCATTERED silver streaks** sprinkled through — mostly black with a few silver highlights at the temples and a few scattered streaks through the top and sides (NOT all-gray, NOT all-silver, NOT salt-and-pepper throughout, NOT fully gray, NOT white-haired, NOT silver-haired, NOT old-man white hair). **Overall impression: a TALL, fit, healthy-faced, thông minh giàu kinh nghiệm Bắc Bộ rural father in his prime years — cao ráo khỏe mạnh, well-fed với khuôn mặt đầy đặn khỏe mạnh (không gầy gò, không hốc hác, không má hóp), vai rộng rõ rệt với V-taper xuống eo thon (clear V-shape taper from broad shoulders to narrow waist = athletic farmer build), eo hẹp hơn vai rõ rệt (NOT same width shoulder-to-waist, NOT straight tube), bụng phẳng lì (NO belly, NO round midriff), chân dài (tall vertical proportions, NOT stunted, NOT compressed-height), mặt vuông góc cạnh Bắc Bộ đầy đặc trưng với hàm rộng và xương gò má rõ nhưng vẫn đầy đặn healthy flesh, mắt sắc nhỏ và tinh tường (small sharp adult eyes, NOT huge cartoon eyes) cho thấy người đã trải nhiều và biết nhiều — imposing through QUIET AUTHORITY, EXPERIENCED EYES, BROAD-SHOULDDERED POSTURE, and TALL STANCE, NOT bulk, NOT bodybuilder muscles, NOT round belly. Vibe người cha Bắc Bộ vừa cao vừa khỏe vừa khôn: tay thô ráp của nông dân nhưng thân hình athletic V-shape và ánh mắt của người từng trải.** Clearly looks 40 years old.
>
> **Outfit**: clean white sleeveless tank top, long black cotton pants, white rubber sandals, but now sleeves are clean and hair combed slightly.
>
> **Specific emotion**: gentle wise kindness, soft smile with closed lips, eyebrows relaxed, eyes warm with depth, calm comforting gaze.
>
> **Pose**: sitting on an invisible low stool (as if on stool — but no stool visible), leaning slightly forward, one hand resting forward on an unseen shoulder height (as if resting on a child's head off-frame), looking down with loving expression. **Character is the ONLY element in the image — pure plain white background, no scenery, no stool, no furniture visible — only the character with hands positioned as if resting on a child.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle warm soft rim light on character only — no indoor lamp light, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

## 👩 MẸ TÍ — **40 TUỔI** — 🇻🇳 PHỤ NỮ VIỆT NAM (3 emotions)

> **Cốt truyện tham chiếu**: Mẹ dạy Tí phân biệt CẦN/THÍCH qua 2 tờ tiền, là người kiên nhẫn, dịu dàng nhưng kiên định.

---

### 📄 `c1_me_teaching.png` — DẠY DỖ (teaching, holding 2 bills)
**Dùng ở đoạn**: Mẹ cầm 2 tờ tiền (1 tờ mua gạo, 1 tờ mua bim bim) hỏi Tí chọn cái nào.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Tí's mother, age-locked at 35, Vietnamese nationality)** living in rural Bắc Bộ Northern Vietnam, height 158cm, healthy working-farmwife build (slim-medium with natural curves from years of farm labor and carrying, slightly tanned arms and shoulders from sun, NOT skinny, NOT frail, NOT chubby, NOT plump, NOT fat, NOT office-worker-pale), soft warm yellowish-brown sun-weathered Bắc Bộ countryside skin (NOT pale office-worker skin, NOT urban-girl skin — sun-tanned hands and forearms showing her labor, face still soft and feminine), typical 35-year-old Bắc Bộ Kinh Vietnamese female facial features: oval face with soft rounded jawline and high cheekbones (NOT round Nam Bộ chubby face, NOT square, NOT gaunt, NOT haggard, NOT old-looking, NOT grandmother-aged, NOT 40+, NOT middle-aged-hag), soft small Vietnamese nose (NOT pointy, NOT Western-nose), normal-sized warm almond-shaped dark brown eyes with gentle eye-folds (NOT huge anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT round doe eyes, NOT small beady eyes), natural softly arched eyebrows (NOT thin plucked, NOT drawn-on), faint smile lines at eye corners from years of smiling (NOT deep wrinkles, NOT crow's feet, NOT aged lines, NOT old-mother wrinkles — just a hint of life-experience at 35, looks like a YOUNG still-beautiful mother in her prime, NOT a tired old woman, NOT approaching-middle-age, NOT bà ngoại), naturally pink full lips (NOT thin, NOT lined). Long BLACK hair (still mostly BLACK with maybe one or two faint silver strands hidden near the temples — NOT gray, NOT streaked silver, NOT grandmother-hair, NOT all-silver, NOT salt-and-pepper — at 35 her hair is still YOUNG and BLACK) tied back in a low practical bun with a few soft wisps framing her face, or worn under her khăn mỏ quạ. **Overall impression: a YOUNG, healthy, beautiful, still-in-her-prime 35-year-old Bắc Bộ rural mother — looks 30-something, NOT 40+, NOT approaching-middle-age, NOT tired, NOT worn-out, NOT grandmother-like — a woman who is still youthful and attractive with the gentle warmth of a countryside mother.**
>
> **Outfit**: **traditional rural Bắc Bộ Northern Vietnamese farmwife outfit — NOT Nam Bộ áo bà ba, NOT Southern Vietnamese, NOT city clothes, NOT modern, NOT office**: **dark brown coarse hand-woven fabric "áo yếm"** (traditional sleeveless bodice with two shoulder straps crossing at the back, common everyday Bắc Bộ peasant women's garment — NOT the Southern Nam Bộ "áo bà ba" with 3 flaps and floral patterns, NOT a fitted city blouse) over a **pale beige or off-white long-sleeve loose "áo tứ thân" or simple long-sleeve coarse cotton shirt** with sleeves rolled up to the elbows showing her sun-tanned forearms (working-farmer look), paired with **dark brown or charcoal-black loose-fitting "quần lưng vải"** (traditional Bắc Bộ wide-leg coarse cotton pants with a cloth waistband tied at the back, NOT modern jeans, NOT skinny pants, NOT dress, NOT skirt), and on her head a **traditional yellow-brown "khăn mỏ quạ"** (the iconic triangular Northern Vietnamese peasant women's headscarf, folded and tied at the back, framing her face and covering her hair — this is THE defining Bắc Bộ nông dân women's accessory, NOT a city scarf, NOT a hat, NOT bare hair showing, NOT a hairband). **Optional when working outdoors**: a faded floral-patterned "áo ngoài" loose jacket draped over shoulders or tied at the waist. Simple **canvas shoes** or **khăn đỏ (red rubber slippers / dép lê nhựa)**. Hands often slightly dirt-dusted from farm work. **The khăn mỏ quạ is MANDATORY for the Bắc Bộ rural farmwife look — without it the character reads as a city woman or Nam Bộ woman, NOT Bắc Bộ.**
>
> **Accessories**: woven rattan market basket (giỏ đi chợ) at her feet, reading glasses hanging from neck cord.
>
> **Specific emotion**: patient teaching smile, eyebrows slightly raised in question, mouth in soft warm half-smile, eyes focused kindly.
>
> **Pose**: kneeling or sitting low (no stool visible), holding two symbolic cartoon paper money bills (generic stylized green rectangular paper representing money — NO real currency, NO portraits, NO flags, NO real numbers) — one in each hand — extended forward toward an unseen Tí, body language as if presenting a teaching choice. **Character is the ONLY element in the image — pure plain white background, no scenery, no furniture visible — only the character and the two bills she is holding.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one warm soft rim light on character only — no indoor lamp, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_me_disappointed.png` — THẤT VỌNG (disappointed, sad)
**Dùng ở đoạn**: Mẹ biết Tí dùng hết tiền heo đất mua thẻ bài.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Tí's mother, age-locked at 35, Vietnamese nationality)** living in rural Bắc Bộ Northern Vietnam, height 158cm, healthy working-farmwife build (slim-medium with natural curves from years of farm labor and carrying, slightly tanned arms from sun, NOT skinny, NOT frail, NOT chubby, NOT plump, NOT fat, NOT office-worker-pale), soft warm yellowish-brown sun-weathered Bắc Bộ countryside skin (NOT pale, NOT urban-girl), typical 35-year-old Bắc Bộ Kinh Vietnamese female facial features: oval face with soft rounded jawline and high cheekbones (NOT round Nam Bộ chubby, NOT square, NOT gaunt, NOT haggard, NOT old-looking, NOT grandmother-aged, NOT 40+, NOT middle-aged-hag), soft small Vietnamese nose, normal-sized warm almond-shaped dark brown eyes with gentle eye-folds (NOT huge anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT round doe eyes, NOT small beady eyes), natural softly arched eyebrows, faint smile lines at eye corners (NOT deep wrinkles, NOT crow's feet, NOT aged lines, NOT old-mother wrinkles — just a hint of life-experience at 35, looks YOUNG and still-beautiful, NOT a tired old woman, NOT approaching-middle-age, NOT bà ngoại), naturally pink full lips. Long BLACK hair (still mostly BLACK — NOT gray, NOT streaked silver, NOT grandmother-hair) tied back in a low practical bun with soft wisps framing face. **Overall: a YOUNG, healthy, beautiful 35-year-old Bắc Bộ rural mother in her prime — NOT 40+, NOT grandmother-like, NOT tired, NOT worn-out.**
>
> **Outfit**: traditional Bắc Bộ rural farmwife — dark brown hand-woven "áo yếm" over pale beige long-sleeve coarse cotton shirt with sleeves rolled up, dark brown loose "quần lưng vải" pants, yellow-brown "khăn mỏ quạ" headscarf tied at the back.
>
> **Specific emotion**: quiet disappointment, eyebrows soft downturned, mouth corners pulled down slightly, eyes looking down and to the side, sighing expression.
>
> **Pose**: seated on an invisible chair (no chair visible), one hand resting on her own knee, looking downward with sad eyes at an empty broken piggy bank placed on an unseen table in front. **Character is the ONLY element in the image — pure plain white background, no scenery, no chair, no table, no furniture visible — only the character.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, slightly dimmer overall mood — no indoor lamp, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_me_worried_sickbed.png` — LO LẮNG (worried, caring)
**Dùng ở đoạn**: Mẹ ngồi cạnh giường Tí khi Tí bị thương sau tai nạn.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Tí's mother, age-locked at 35, Vietnamese nationality)** living in rural Bắc Bộ Northern Vietnam, height 158cm, healthy working-farmwife build (slim-medium, slightly tanned arms, NOT skinny, NOT frail, NOT chubby, NOT plump, NOT fat, NOT office-worker-pale), soft warm yellowish-brown sun-weathered Bắc Bộ countryside skin, typical 35-year-old Bắc Bộ Kinh Vietnamese female facial features: oval face with soft rounded jawline and high cheekbones (NOT round Nam Bộ chubby, NOT square, NOT gaunt, NOT haggard, NOT old-looking, NOT grandmother-aged, NOT 40+, NOT middle-aged-hag), soft small Vietnamese nose, normal-sized warm almond-shaped dark brown eyes (NOT huge anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT round doe eyes, NOT small beady eyes), natural softly arched eyebrows, faint smile lines at eye corners (NOT deep wrinkles, NOT crow's feet, NOT aged lines — a YOUNG still-beautiful mother in her prime, NOT a tired old woman, NOT bà ngoại), naturally pink full lips. Long BLACK hair (NOT gray, NOT grandmother-hair, NOT all-silver) tied back in a low practical bun now slightly disheveled. **Overall: a YOUNG, healthy 35-year-old Bắc Bộ rural mother in her prime — NOT 40+, NOT grandmother-like.**
>
> **Outfit**: simple home wear — dark brown "áo yếm" over pale long-sleeve shirt sleeves rolled up, dark "quần lưng vải" pants, khăn mỏ quạ loosened showing some hair slightly falling out.
>
> **Specific emotion**: deep motherly worry, eyebrows pinched together with concern, mouth in tight worried line, eyes red-rimmed from crying, one hand on Tí's forehead (Tí off-frame).
>
> **Pose**: seated (no bed visible), leaning forward, one hand extended forward at chest height (as if touching a forehead off-frame), other hand holding a wet towel near her chest, looking down with worried loving eyes. **Character is the ONLY element in the image — pure plain white background, no scenery, no bed, no furniture visible — only the character and the towel she is holding.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle warm soft rim light on character only — no bedside lamp, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

## 👦 TÈO — **13 TUỔI** — 🇻🇳 THIẾU NIÊN VIỆT NAM (3 emotions)

> **Cốt truyện tham chiếu**: Bạn thân chí cốt, rủ Tí buôn thẻ bài. Tèo luôn là đứa nghĩ ra trò trước, nhưng cũng là đứa sẵn sàng bỏ Tí khi nguy hiểm.

---

### 📄 `c1_teo_excited_plan.png` — HÀO HỨNG (excited, scheming)
**Dùng ở đoạn**: Tèo rủ Tí buôn thẻ bài Quái thú, mắt sáng rỡ.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tèo, age-locked at 13, Vietnamese nationality)**, height 145cm, average stocky kid build (NOT chubby, NOT fat, NOT overweight, NOT double chin), slightly darker soft warm light beige cute-friendly skin than Tí, typical Vietnamese facial features, short black hair in a tiny mohawk strip, round mischievous eyes, slightly rounded plump baby cheeks (cute, NOT obese). Clearly looks 13 years old.
>
> **Outfit**: oversized faded orange t-shirt with random cartoon print, knee-length denim shorts, worn white rubber sandals.
>
> **Accessories**: a cardboard box of "Quái Thú" monster trading cards tucked under one arm.
>
> **Specific emotion**: hyper-excited scheming, huge open-mouthed grin showing all teeth, eyes sparkling, eyebrows shooting up, hands gesturing wildly.
>
> **Pose**: standing with one hand pointing at a chalk-drawn chart on the ground (showing profit %), the other hand fanning out a few monster cards, body leaning forward conspiratorially.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, bright and even — no schoolyard sunlight, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_teo_proud.png` — HÃNH DIỆN (proud, showing off cards)
**Dùng ở đoạn**: Tèo khoe bộ sưu tập thẻ hiếm vừa lời được.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tèo, age-locked at 13, Vietnamese nationality)**, height 145cm, average stocky kid build (NOT chubby, NOT fat, NOT double chin), slightly darker soft warm light beige cute-friendly skin, typical Vietnamese facial features, tiny mohawk, round mischievous eyes, slightly rounded plump baby cheeks (cute, NOT obese). Clearly looks 13 years old.
>
> **Outfit**: faded orange t-shirt, denim shorts, black sandals.
>
> **Specific emotion**: smug pride, chin tilted up, one eyebrow raised, slight smirk, arms crossed over chest showing off.
>
> **Pose**: standing tall (regular kid pose, NOT a heavy-set kid), arms crossed, fanning out a holographic ultra-rare monster card in his mouth (between teeth), looking down at an unseen Tí with mocking grin.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle warm rim light on character only — no dust particles, no background scenery.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_teo_scared_run.png` — HOẢNG SỢ BỎ CHẠY (scared, running away)
**Dùng ở đoạn**: Tèo thấy Tí gặp tai nạn, sợ liên lụy → bỏ chạy.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Tèo, age-locked at 13, Vietnamese nationality)**, height 145cm, average stocky kid build (NOT chubby, NOT fat, NOT double chin), slightly darker soft warm light beige cute-friendly skin, typical Vietnamese facial features, tiny mohawk. Clearly looks 13 years old.
>
> **Outfit**: faded orange t-shirt, denim shorts, black sandals.
>
> **Specific emotion**: pure panic guilt, eyes wide with fear, mouth in grimace, eyebrows V-shaped in worry, looking back over shoulder while running.
>
> **Pose**: full-body dynamic running pose away from camera, one hand dropping the monster card box on the ground, looking back over shoulder with scared guilty face.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one dramatic warm rim light on character only — no late afternoon shadows, no dust particles, no background scenery.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

## 🎒 HÙNG — **13 TUỔI** — 🇻🇳 THIẾU NIÊN VIỆT NAM (3 emotions)

> **Cốt truyện tham chiếu**: Bạn cùng lớp con nhà giàu, luôn khoe đồ mới và chọc tức Tí về khoảng cách giàu nghèo.

---

### 📄 `c1_hung_smug_bike.png` — ĐẮC Ý (smug, showing off bike)
**Dùng ở đoạn**: Hùng phóng Martin 107 mới qua mặt Tí trên đường làng.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Hùng, age-locked at 13, Vietnamese nationality)**, height 158cm, taller and well-built for his age, fairer soft warm light beige cute-friendly skin than Tí (typical of urban Vietnamese kids from better-off families), typical Vietnamese male teenage facial features (slightly sharper jawline from being well-fed), black hair slicked back neatly and glossy, sharp confident eyes. Clearly looks 13 years old but with a more polished appearance.
>
> **Outfit**: brand-new plain navy blue polo shirt (NO large horse logo on chest — clean solid-color basic polo, NOT a designer-brand-flex polo, just a plain polo that a rich Vietnamese kid in the 2010s would actually wear), tan khaki shorts, simple clean white canvas sneakers (NOT running shoes, NOT athletic sneakers, NOT modern basketball shoes — just plain white canvas lace-up shoes), silver digital watch on wrist.
>
> **Accessories**: a simple basic mobile phone (small brick-style Nokia-like or clamshell, NOT smartphone, NOT iPhone) tucked in his back short pocket — rich-kid convenience item for calling parents, NOT a tech flex. No bicycle visible.
>
> **Specific emotion**: **cocky 1-sided smirk** — ONLY the LEFT corner of the mouth pulled up slightly (NOT a full grin, NOT both corners of mouth up, NOT friendly smile, NOT happy grin, NOT full-face smile). One eyebrow raised, the other eyebrow neutral. **Eyes looking DOWN with contempt** (pupils positioned in the lower part of the eye, NOT looking at camera, NOT looking forward, NOT looking at viewer). Chin tilted slightly UP to show superiority. Soft sneer at the corner. The face should still have visible baby-fat round cheeks (he is 13, NOT adult, NOT angular mature male face, NOT sharp jawline, NOT adult-man face).
>
> **Pose**: standing upright in a cocky celebrating pose — body weight shifted onto one leg (hip cocked slightly to the side), the other leg relaxed. ONE hand resting casually on his hip OR pointing to his side as if showing off "this is my new bike" with a dismissive gesture. The other hand hanging casually at his side OR making a small "look at me" wave. Body slightly leaning back with a confident chest-out posture, chin up. The pose reads "I just won" or "I am showing off" — celebration of a new toy, NOT riding, NOT mid-action. **This is a STANDING sprite, NOT a riding pose, NOT a bicycle seat pose, NOT seated in mid-air, NOT on a bicycle.** **Character is the ONLY element in the image — pure plain white background, no scenery, no bicycle, no furniture visible — only the standing character.**
>
> **Camera angle**: slight LOW-angle (camera below character's eye level looking up at him) to make the character look dominant and superior — this is the rich kid feeling like king of the road.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one bright soft rim light highlighting the character's edge — no bike shine, no background scenery.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_hung_teasing.png` — CHỌC TỨC (teasing, mocking)
**Dùng ở đoạn**: Hùng quay lại nhìn Tí đang đạp xe cà rỗng, cười nhạo.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Hùng, age-locked at 13, Vietnamese nationality)**, height 158cm, well-built, fairer soft warm light beige cute-friendly skin, typical Vietnamese male teenage facial features, glossy slicked-back black hair. Clearly looks 13 years old.
>
> **Outfit**: brand-new navy blue polo shirt, tan khaki shorts, pristine white sneakers, silver watch.
>
> **Specific emotion**: mocking laughter, mouth open laughing (medium mouth size, NOT gaping wide, normal face proportions maintained), eyes squeezed into crescents, hands clutching stomach from laughing too hard. Face stays cute kawaii round proportions consistent with other sprites — do NOT enlarge head.
>
> **Pose**: standing on an invisible road shoulder, one hand pointing forward at chest height (as if pointing at someone off-frame), the other hand slapping his own knee, body bent forward laughing mockingly. **Character is the ONLY element in the image — pure plain white background, no scenery, no road, no ground visible — only the character.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one subtle warm backlight creating a soft halo on character's head — no golden hour, no background scenery.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_hung_indifferent.png` — THỜ Ơ (indifferent, walking away)
**Dùng ở đoạn**: Hùng thấy Tí bị tai nạn nhưng không dừng lại giúp, chỉ nhìn rồi đi tiếp.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 13-year-old Vietnamese boy (Hùng, age-locked at 13, Vietnamese nationality)**, height 158cm, well-built, fairer soft warm light beige cute-friendly skin, typical Vietnamese male teenage facial features, glossy slicked-back black hair. Clearly looks 13 years old.
>
> **Outfit**: navy blue polo shirt, tan khaki shorts, pristine white sneakers.
>
> **Specific emotion**: cold indifference, neutral mouth, eyebrows flat, eyes glancing sideways without emotion, slight shrug of one shoulder.
>
> **Pose**: viewed from behind-side (back and one shoulder visible), walking forward with one hand on an invisible handlebar (as if riding bike), body posture already moving forward, head turned slightly looking back once over the shoulder with a blank expression. **Character is the ONLY element in the image — pure plain white background, no scenery, no bicycle, no road, no furniture visible — only the character.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, slightly desaturated cool tone — no late afternoon sky, no background scenery.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

## 🏪 CÔ TƯ — **55 TUỔI** — 🇻🇳 PHỤ NỮ VIỆT NAM (3 emotions)

> **Cốt truyện tham chiếu**: Chủ tạp hóa đầu làng, vừa là NPC dạy bài vừa là người hàng xóm quen, hay quát nhưng thương Tí.

---

### 📄 `c1_cotu_friendly.png` — THÂN THIỆN (friendly, smiling)
**Dùng ở đoạn**: Cô Tư chào Tí khi Tí bước vào tiệm lần đầu.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Cô Tư, age-locked at 35, Vietnamese nationality, Northern Vietnamese Bắc bộ accent)**, height 162cm, slim-to-medium build, smooth warm light-tan skin (NOT wrinkled, NOT aged), long straight black hair in a low casual ponytail at the nape (NOT gray-streaked, NOT elderly bun), bright sharp mischievous eyes. Clearly looks 35 years old — youthful energetic shopkeeper lady.
>
> **Outfit**: simple practical shopkeeper outfit — plain long-sleeved button-up shirt in muted light blue or pastel green tucked into high-waist dark blue/black long pants, short colorful floral half-apron tied at waist, simple flat rubber sandals.
>
> **Accessories**: a small notepad and pen tucked in apron pocket OR a simple handheld calculator in hand — practical shopkeeper tool. Optionally thin reading glasses pushed up on forehead (for checking small prices).
>
> **Specific emotion**: warm welcoming friendly smile, squinted happy eyes, head tilted slightly, both hands resting naturally at her sides or one hand gesturing welcoming.
>
> **Pose**: standing behind an invisible counter (no counter visible), leaning forward slightly, both hands clasped together in front of chest, looking at an unseen Tí with welcoming smile. **Character is the ONLY element in the image — pure plain white background, no scenery, no counter, no furniture visible — only the character.**
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one warm soft front light on character only — no fluorescent tube, no door sunlight, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_cotu_teaching.png` — DẠY BẢO (teaching, scolding kindly)
**Dùng ở đoạn**: Cô Tư dạy Tí phân biệt CẦN/THÍCH ngay tại quầy.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Cô Tư, age-locked at 35, Vietnamese nationality, Northern Vietnamese Bắc bộ accent)**, height 162cm, slim-to-medium build, smooth warm light-tan skin, long straight black hair in low casual ponytail, bright sharp mischievous eyes. Clearly looks 35 years old — same face as the friendly version, just different expression.
>
> **Outfit**: simple practical shopkeeper outfit — plain long-sleeved button-up shirt in muted color tucked into high-waist dark long pants, short colorful floral half-apron tied at waist, simple flat rubber sandals.
>
> **Accessories**: thin reading glasses worn on nose now (she put them down from forehead to read the small price labels / lesson notes).
>
> **Specific emotion**: stern but loving teaching expression, one eyebrow raised, finger pointing up in lesson mode, mouth open as if mid-sentence explaining.
>
> **Pose**: standing behind counter, one hand pointing a finger upward in "lesson learned" gesture, the other hand gesturing at the shelves of products behind her.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one slightly brighter warm soft rim light on character's face — no indoor store light, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

### 📄 `c1_cotu_grumpy.png` — CÁU BẲN (grumpy, scolding)
**Dùng ở đoạn**: Cô Tư mắng Tí vì dám ăn quỵt bim bim.

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props**, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Full character reference**: **a 35-year-old Vietnamese woman (Cô Tư, age-locked at 35, Vietnamese nationality, Northern Vietnamese Bắc bộ accent)**, height 162cm, slim-to-medium build, smooth warm light-tan skin, long straight black hair in low ponytail (slightly disheveled now in anger), bright sharp mischievous eyes now glaring. Clearly looks 35 years old — same face as the other versions.
>
> **Outfit**: simple practical shopkeeper outfit — plain long-sleeved button-up shirt tucked into high-waist dark long pants, short colorful floral half-apron tied at waist, both simple flat rubber sandals ON her feet (she did NOT take her sandal off — that is cartoon-villain behavior; she is a polite angry adult, both feet properly dressed).
>
> **Accessories**: NO weapon in hand, NO raised slipper, NO sandal in hand — she is a polite angry adult, NOT a cartoon villain. Optional: thin reading glasses now worn on nose (she put them down from forehead in concentration while scolding).
>
> **Specific emotion**: **annoyed-but-controlled scolding expression** — furrowed eyebrows angled down (NOT V-shaped cartoon villain), **mouth closed in a tight thin line OR slightly open mid-sentence at medium size** (NOT gaping wide, NOT shouting, NOT screaming — she is a polite adult scolding in measured words, NOT losing her temper). Eyes are sharp and narrow, **staring down at an unseen shorter target** (pupils positioned in the lower part of eye, looking DOWN at Tí who is shorter than her). A small vein mark may appear at temple as a kawaii "annoyed" indicator, but the face stays calm-and-stern, NOT exploding-angry. NO screaming mouth, NO exaggerated expressions, NO cartoon rage. Face proportions stay cute kawaii round consistent with other sprites.
>
> **Pose**: **standing slightly bent forward at the waist (leaning down toward an unseen shorter person Tí)** — back slightly hunched forward, head tilted down looking at someone shorter than her. **ONE hand resting on her hip** (chống hông — classic Vietnamese "tức giận có kiểm soát" pose). The **other hand raised to chest-height, palm open, fingers together, gesturing calmly but firmly in a "nghe chưa" / "thế này thế này" lecturing motion** (NOT pointing aggressively at the door, NOT swinging, NOT threatening — just calm adult lecturing gesture). Body weight shifted onto one leg. The pose reads: "I am a disappointed shopkeeper aunt scolding you, but I still respect you because I am an adult" — NOT "I want to hit you". **Character is the ONLY element in the image — pure plain white background, no scenery, no counter, no furniture visible — only the character.**
>
> **Framing**: full body shot at the **normal portrait scale** — character occupies roughly 55–70% of vertical frame height (SAME as all other sprites in this chapter), top of head AND both feet AND both hands all visible, plenty of white negative space above head and below feet. **NOT zoomed in, NOT close-up, NOT cropped, NOT bust shot, NOT waist-up, NOT tighter than the neutral/friendly/teaching sprites.** This sprite must look at the SAME eye-level and SCALE as the other Cô Tư emotion sprites — only the emotion and pose differ, NOT the framing.
>
> **Lighting**: **flat even studio lighting on a pure white seamless backdrop, with one slightly shadowed warm rim light on character's face for subtle drama — no indoor light, no background.**
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up portrait, NOT bust shot, NOT zoomed-in on face.

---

# 🎬 PHẦN 2 — SCENE BACKGROUNDS (7 scenes — Việt Nam thập niên 2010s)

> Đây là ảnh **toàn cảnh** (cinematic 16:9) dùng làm background cutscene giữa các đoạn hội thoại. Tất cả bối cảnh lấy bối cảnh **nông thôn Việt Nam thập niên 2010s** để khớp thời đại Tí 13 tuổi.
>
> ⚠️ **2 LOẠI BG SCENE** — phân biệt rõ theo loại scene VN:
>
> | Loại BG | Có nhân vật trong ảnh? | Dùng cho scene VN nào? |
> |---|---|---|
> | **Narrator scene** (`type: 'narrator'`) | ✅ CÓ nhân vật trong ảnh | VN engine chỉ load BG → nhân vật đã có sẵn trong ảnh |
> | **Dialogue scene** (`type: 'dialogue'`) | ❌ KHÔNG có nhân vật | VN engine load BG + render sprite portrait lên trên |
>
> 📌 Trong file này, tao đã đánh dấu rõ từng BG scene:
> - **CÓ nhân vật** trong prompt → dùng làm narrator BG
> - **KHÔNG có nhân vật** trong prompt → dùng làm dialogue BG (kết hợp với sprite)

---

# 🌄 BACKGROUND SCENES — 2 PHIÊN BẢN MỖI NƠI

> 📌 **Nguyên tắc mới (cập nhật)**: Mỗi địa điểm (shop, garden, road...) có **2 PHIÊN BẢN BG** tách biệt:
>
> | Phiên bản BG | Suffix filename | Nhân vật trong ảnh? | Dùng cho scene VN nào? |
> |---|---|---|---|
> | **BG TRỐNG** | `_empty` | ❌ KHÔNG | `dialogue` (sprite ghép lên) HOẶC narrator tĩnh "nơi này vắng..." |
> | **BG COMPOSITE** | `_action` hoặc tên hành động cụ thể | ✅ CÓ | `narrator` cinematic kể hành động "Tí đang làm X, Cô Tư đang làm Y" |
>
> ⚠️ **Trước đây** tao gộp 1 BG/file → **sai**. Giờ tách rõ để:
> - Dialogue: load BG trống + sprite portrait (React ghép)
> - Narrator hành động: load BG composite (đã có nhân vật, KHÔNG cần sprite)
> - Narrator tĩnh: load BG trống (chỉ kể cảnh không có ai)
>
> 📖 Tham khảo demo `VisualNovelPlayer.jsx`:
> - Line 187: BG mờ xuống 62% khi dialogue → nhân vật nổi bật
> - Line 198-201: `BG_HAS_CHARACTER` → BG composite, engine skip sprite

---

## 📍 ĐỊA ĐIỂM 1 — PHÒNG NGỦ TÍ

### 📄 `c1_bg_piggybank_room_empty.png` — Phòng ngủ Tí, BG trống (DÙNG CHO DIALOGUE)
**Loại BG**: 🏪 BG TRỐNG — không có nhân vật → dùng cho **DIALOGUE scene** (sprite Tí ghép lên)
**Dùng ở đoạn**: Tí nói chuyện với Mẹ, hoặc Tí nói chuyện với Bố ở phòng.

> (Style token BG TRỐNG + Setting: Interior of a traditional Vietnamese countryside house bedroom (rural Vietnam, 2010s era) at night. Wooden bed with mosquito net (mùng) hanging from above, wooden bedside table with a small lantern, brick walls, dirt floor visible. Warm lantern glow on the empty room. NO people, NO characters. Empty scene ready for character sprites to be added. Aspect ratio 16:9 widescreen.)

### 📄 `c1_bg_piggybank_moment.png` — Khoảnh khắc Tí phá heo đất (DÙNG CHO NARRATOR)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene** (kể cinematic)
**Dùng ở đoạn**: Cutscene mở đầu Chương 1 — "Tí lén phá heo đất giữa đêm..."

> (Style token BG COMPOSITE + Setting: Interior of a traditional Vietnamese countryside house bedroom (rural Vietnam, 2010s era) at night. Red tile roof visible, brick walls, dirt floor. A single lantern hanging from the ceiling casting warm yellow circle of light on a small wooden table. On the table: a broken pink piggy bank and scattered symbolic cartoon paper money bills (generic stylized green rectangles representing money — NO real Vietnamese dong, NO portraits, NO flags, NO real numbers). A 13-year-old Vietnamese boy (Tí, mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), soft warm light beige cute-friendly skin, short black hair) is kneeling beside the table, face lit from below by the lantern, eyes wide and reflecting the bills. Warm lantern glow + cool blue moonlight through window. 16:9 cinematic.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: Interior of a traditional Vietnamese countryside house (rural Vietnam, 2010s era) at night. Red tile roof visible, brick walls, dirt floor. A single lantern hanging from the ceiling casting warm yellow circle of light on a small wooden table. On the table: a broken pink piggy bank and scattered symbolic cartoon paper money bills (generic stylized green rectangles representing money — NO real Vietnamese dong, NO portraits, NO flags, NO real numbers). A 13-year-old Vietnamese boy (Tí, mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), soft warm light beige cute-friendly skin, short black hair) is kneeling beside the table, face lit from below by the lantern, eyes wide and reflecting the bills.
>
> **Lighting**: warm lantern glow + cool blue moonlight through window.
>
> **Aspect ratio**: 16:9 cinematic.

---

## 📍 ĐỊA ĐIỂM 2 — TẠP HÓA CÔ TƯ

### 📄 `c1_bg_shop_interior_empty.png` — Tạp hóa Cô Tư, BG trống, view từ cửa nhìn vào (DÙNG CHO DIALOGUE)
**Loại BG**: 🏪 BG TRỐNG — không có nhân vật → dùng cho **DIALOGUE scene** (sprite Tí + sprite Cô Tư ghép lên)
**Dùng ở đoạn**: Cutscene chuyển cảnh sang tạp hóa, Tí đối thoại với Cô Tư trong shop.

> (Style token BG TRỐNG + Setting: Interior of a small Vietnamese rural grocery store (typical "tạp hóa" in countryside Vietnam). Wooden shelves packed with colorful Vietnamese snacks (bim bim Oishi, mì Hảo Hảo, bánh Trung Thu), candies, and a few toys. A handwritten sign reads "GIÁ HỌC SINH - GIẢM 5%" hanging above the wooden counter. A yellow curtain on the side window. Fluorescent tube light on the ceiling. Warm golden afternoon sunlight streaming through the open door. An old abacus resting on the counter. Floor is cracked tile, slightly dusty. NO people, NO characters. Empty scene ready for character sprites. 16:9.)

### 📄 `c1_bg_shop_counter_composite.png` — View từ Tí nhìn lên Cô Tư (DÙNG CHO NARRATOR/DIALOGUE)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Cutscene "Tí cầm tờ 200k đặt lên counter, Cô Tư ghi sổ rồi đưa bim bim..."

> (Style token BG COMPOSITE + Setting: Same Vietnamese rural grocery store interior as c1_bg_shop_interior_empty.png. Behind the counter stands a 35-year-old Vietnamese woman (Cô Tư, Northern Vietnamese Bắc bộ shopkeeper — plain long-sleeved button-up shirt in muted light blue, dark long pants, short floral half-apron tied at waist, long straight black hair in low ponytail, slim-to-medium taller build at 162cm, bright sharp mischievous eyes, NOT elderly, NOT wrinkled, NOT gray-haired) holding an old abacus, writing numbers with a pencil. In front of the counter, a 13-year-old Vietnamese boy (Tí, mustard yellow t-shirt (hex color #e5aa46), soft warm light beige cute-friendly skin, school backpack on shoulder) extending his right hand holding a symbolic cartoon paper money bill (generic stylized green rectangle representing money — NO real Vietnamese dong, NO portraits, NO flags) toward Cô Tư, face hopeful and slightly nervous. A few bags of bim bim on the counter between them. Warm fluorescent white + golden door sunlight. 16:9 cinematic.)

### 📄 `c1_bg_shop_overview.png` — Nhìn shop TỪ XA, BG trống (DÙNG CHO NARRATOR tĩnh)
**Loại BG**: 🏪 BG TRỐNG — wide shot, không có nhân vật cụ thể → dùng cho **NARRATOR scene** tĩnh
**Dùng ở đoạn**: Narrator giới thiệu "Đây là tạp hóa Cô Tư, nơi Tí hay ghé mua bim bim..."

> (Style token BG TRỐNG + Setting: Wide shot of the Vietnamese rural grocery store from outside looking through the open door. Show more of the surrounding dirt road and a few chickens walking past. The shop interior is dimly visible with warm fluorescent light, shelves of snacks, but NO people visible inside or outside. Late afternoon golden hour, dust particles in the air, atmospheric perspective. 16:9 widescreen cinematic.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: Interior of a small Vietnamese rural grocery store (typical "tạp hóa" in countryside Vietnam). Wooden shelves packed with colorful Vietnamese snacks (bim bim Oishi, mì Hảo Hảo, bánh Trung Thu), candies, and a few toys. A handwritten sign reads "GIÁ HỌC SINH - GIẢM 5%" hanging above the wooden counter. A yellow curtain on the side window. Fluorescent tube light on the ceiling. Warm golden afternoon sunlight streaming through the open door. An old abacus resting on the counter. Floor is cracked tile, slightly dusty.
> **Nếu dùng cho NARRATOR**: thêm `Behind the counter stands a 35-year-old Vietnamese woman (Cô Tư, Northern Vietnamese Bắc bộ shopkeeper — plain long-sleeved button-up shirt, dark long pants, short floral half-apron, long black hair in low ponytail, slim taller build).`
>
> **Lighting**: warm fluorescent white + golden door sunlight.
>
> **Aspect ratio**: 16:9 cinematic.

---

## 📍 ĐỊA ĐIỂM 3 — VƯỜN NHÀ

### 📄 `c1_bg_garden_empty.png` — Vườn nhà, BG trống (DÙNG CHO DIALOGUE)
**Loại BG**: 🏪 BG TRỐNG — không có nhân vật → dùng cho **DIALOGUE scene** (sprite Bố Tí ghép lên khi sai Tí)
**Dùng ở đoạn**: Bố sai Tí ra vườn làm cỏ, Tí than thở.

> (Style token BG TRỐNG + Setting: A small Vietnamese countryside vegetable garden in late afternoon (rural Vietnam, 2010s). Rows of morning glory (rau muống), a few tomato plants, a hoe leaning against a wooden fence. In the background, a typical Vietnamese countryside house with red tile roof (máy ngói đỏ) and dirt yard. A few chickens pecking at the dirt. Long shadow stretching across the garden from a tree. Bamboo fence enclosing the garden. Distant rice paddies and palm trees. NO people, NO characters. 16:9.)

### 📄 `c1_bg_garden_father_working.png` — Bố và Tí cùng làm vườn (DÙNG CHO NARRATOR hành động)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Cutscene "Bố Tí cầm cuốc, Tí nhổ cỏ phụ bố..."

> (Style token BG COMPOSITE + Setting: Same Vietnamese countryside vegetable garden, interior view. A 40-year-old Vietnamese man (Bố Tí, age-locked at 40, Vietnamese nationality, height **175cm TALL** with LONG LEGS, **Bắc Bộ Northern face structure — square-ish face with defined jawline and cheekbones and full healthy flesh** (NOT gaunt, NOT hollow-cheeked, NOT sunken, NOT starving-face), **NORMAL-sized sharp adult eyes** (NOT big anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes), white sleeveless tank top with sweat stains slightly loose showing broad shoulders, **FULL-LENGTH long black cotton pants reaching down to the ankles** (NOT shorts, NOT knee-length, NOT crop, NOT capri — must be ankle-length traditional countryside pants), white rubber sandals, **healthy-LEAN TONED TALL SLIM farmer build** (NOT fat, NOT chubby, NOT barrel-chested, NOT round-bellied, NOT paunch, NOT beer gut, NOT bodybuilder, NOT thick, NOT round-bodied, NOT circular, NOT ball-shaped, NOT spherical, NOT kawaii-chubby) with **NOTABLY BROAD SHOULDERS wider than hips creating clear V-taper** down to **NOTICEABLY NARROWER slim waist** and **WASHBOARD-FLAT firm stomach with NO belly** (waist NOTICEABLY NARROWER than shoulders, NOT same-width shoulder-to-waist, NOT straight tube), **LONG LEGS making up 55% of his tall height** (NOT short stubby legs, NOT stunted), visible lean muscle tone in arms (NOT bulging biceps, NOT noodle arms), **deep tan brown weather-worn cute-friendly skin** (NOT pale, NOT yellow-pale), **BLACK hair (predominantly black) with SCATTERED SILVER STREAKS** sprinkled through — mostly black with silver streaks at the temples and a few highlights, NOT all-gray, NOT all-silver, NOT salt-and-pepper throughout, NOT white-haired, NOT silver-haired, NOT old-man-hair, light 2-day stubble beard, holding a wooden hoe, mid-swing motion, handkerchief draped over shoulder) working the soil. A 13-year-old Vietnamese boy (Tí, mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), white rubber sandals, red canvas backpack on a hook nearby) kneeling nearby pulling weeds, looking exhausted and sweaty, shoulders slumped. Warm golden hour sunlight from the side, long shadows, dust in the sunbeams. 16:9 cinematic.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: A small Vietnamese countryside vegetable garden in late afternoon (rural Vietnam, 2010s). Rows of morning glory (rau muống), a few tomato plants (cà chua), a hoe leaning against a wooden fence. In the background, a typical Vietnamese countryside house with red tile roof (máy ngói đỏ) and dirt yard. A few chickens pecking at the dirt. Long shadow stretching across the garden from a tree. Bamboo fence enclosing the garden. Distant rice paddies and palm trees.
> **CÓ nhân vật**: A 13-year-old Vietnamese boy (Tí, mustard yellow t-shirt (hex color #e5aa46), soft warm light beige cute-friendly skin) kneeling in the garden pulling weeds, looking exhausted. A 40-year-old Vietnamese man (Bố Tí, age-locked at 40, Vietnamese nationality, TALL height **175cm** with **LONG LEGS (55% of his height)**, **Bắc Bộ Northern face — square jawline, full healthy flesh cheeks (NOT gaunt, NOT hollow-cheeked, NOT sunken), NORMAL-sized sharp adult eyes** (NOT big anime eyes), **FULL-LENGTH ankle-length black pants** (NOT shorts, NOT knee-length), **NOTABLY BROAD SHOULDERS** with clear V-taper to **NOTICEABLY NARROWER slim waist** and **WASHBOARD-FLAT firm stomach NO belly** (NOT round-bellied, NOT paunch, NOT round-bodied, NOT thick, NOT circular), **healthy-LEAN TONED TALL SLIM build** (NOT fat, NOT barrel-chested, NOT thick, NOT round-bodied), deep tan weather-worn skin, **BLACK hair with SCATTERED silver streaks** (NOT all-gray, NOT all-silver, NOT white-haired, NOT silver-haired)) standing tall with arms crossed nearby, watching sternly.
>
> **Lighting**: warm golden hour sunlight from the side, long shadows, dust in the sunbeams.
>
> **Aspect ratio**: 16:9 cinematic.

---

### 📄 `c1_bg_garden_lazy_Ti.png` — Tí nằm đọc truyện dưới gốc cây, bỏ mặc vườn (DÙNG CHO NARRATOR hành động)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Hệ quả Mission 1.2 nhánh B — Tí từ chối làm vườn: "Thôi bố làm đi, con buồn ngủ lắm." Cắt cảnh sang Tí nằm dưới gốc cây đọc truyện tranh Conan, mặc quần đùi, áo thun, mắt hí híp lười biếng. Vườn vẫn đầy lá rụng, gà vẫn đói kêu quang quác phía sau. Tí không nhận 30k tiền công → HAPPINESS +10 (lười thoải mái) nhưng RISK +5 (mất cơ hội rèn luyện tính kỷ luật tài chính).

> (Style token BG COMPOSITE + Setting: Same Vietnamese countryside vegetable garden in late afternoon, but viewed from a different angle — under a large mango tree (cây xoài) at the edge of the garden. A 13-year-old Vietnamese boy (Tí, mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), white rubber sandals, NO backpack) LYING FLAT ON HIS BACK on a woven bamboo mat (chiếu), one hand behind his head as a pillow, the other hand holding open a manga comic book (generic cartoon manga volume — generic "QUÁI THÚ" cover in bright colors, NO real Conan brand, NO real text except generic cartoon letters, NO real brand) held above his face, reading with lazy half-lidded eyes, a small silly content smile on his face. Soft warm light beige cute-friendly skin, soft pink blush circles on cheeks. A small cartoon sweat drop on his temple from the afternoon heat. **The garden in the BACKGROUND is UNTOUCHED — overgrown with weeds, leaves scattered everywhere, chickens (gà) pecking at the dirt near an empty feeder, a wooden hoe leaning UNUSED against the bamboo fence**. The Vietnamese countryside house with red tile roof (máy ngói đỏ) visible in the soft golden-distance. Warm late-afternoon golden hour sunlight filtering through mango leaves creating dappled shadows on Tí and the mat. A few cartoon flies buzzing lazily. The contrast: lazy Tí in foreground vs. neglected garden in background tells the story "Tí chose comfort over earning money". 16:9 cinematic lazy-afternoon aesthetic.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: A Vietnamese countryside vegetable garden in late afternoon (rural Vietnam, 2010s), under a large mango tree (cây xoài) at the edge of the garden. Rows of morning glory (rau muống) and tomato plants (cà chua) in the background — UNTOUCHED, overgrown with weeds. A wooden hoe leaning UNUSED against the bamboo fence. A few chickens (gà) pecking at the dirt near an empty feeder. The Vietnamese countryside house with red tile roof (máy ngói đỏ) visible in soft golden-distance. Bamboo fence and distant rice paddies.
> **CÓ nhân vật**: A 13-year-old Vietnamese boy (Tí, mustard yellow t-shirt (hex color #e5aa46), soft warm light beige cute-friendly skin, soft pink blush circles, NO backpack) LYING FLAT ON HIS BACK on a woven bamboo mat (chiếu), one hand behind his head as a pillow, the other hand holding open a cartoon manga book above his face, reading with lazy half-lidded eyes and a small silly content smile. A small cartoon sweat drop on his temple from heat.
>
> **Lighting**: warm late-afternoon golden hour sunlight filtering through mango leaves creating dappled shadows on Tí and the mat, soft warm golden glow on the neglected garden background.
>
> **Aspect ratio**: 16:9 cinematic.

---

## 📍 ĐỊA ĐIỂM 4 — SÂN TRƯỜNG

### 📄 `c1_bg_schoolyard_empty.png` — Sân trường, BG trống (DÙNG CHO DIALOGUE)
**Loại BG**: 🏪 BG TRỐNG — không có nhân vật chính → dùng cho **DIALOGUE scene** (sprite Tí + sprite Tèo ghép lên)
**Dùng ở đoạn**: Tí và Tèo nói chuyện về thẻ bài.

> (Style token BG TRỐNG + Setting: A rural Vietnamese lower-secondary schoolyard at midday (typical Vietnamese cấp 2 làng quê). Old concrete wall with faded propaganda posters, mango tree (cây xoài) casting dappled shadows, brick floor. A few other 13-year-old Vietnamese students playing marbles in distant (blurred, background only). NO main characters in the center, NO focus on any person. Harsh midday tropical sunlight, sharp shadows, bright blue sky. 16:9.)

### 📄 `c1_bg_schoolyard_trade.png` — Tí và Tèo ngồi buôn thẻ bài (DÙNG CHO NARRATOR hành động)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Cutscene Tí và Tèo ngồi buôn thẻ bài, Tèo khoe thẻ hiếm.

> (Style token BG COMPOSITE + Setting: Same rural Vietnamese lower-secondary schoolyard under mango tree. Two 13-year-old Vietnamese boys sitting cross-legged on the brick floor. Tí (left, mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), soft warm light beige cute-friendly skin, red canvas backpack on ground beside him) holding a thick stack of symbolic cartoon paper money bills (generic stylized green rectangles representing money — NO real Vietnamese dong, NO portraits, NO flags, NO real numbers) fanned out in one hand, greedy smile, eyes darting suspiciously. Tèo (right, faded orange baggy shirt with cartoon print, denim shorts, slightly darker skin than Tí, tiny mohawk strip of hair, slightly rounded cute plump baby cheeks (NOT double chin, NOT fat), worn black sandals) holding a cardboard box labeled "QUÁI THÚ" with cartoon monsters visible, mischievous sly grin, tucking bills into his pocket. Midday harsh sunlight. 16:9 cinematic.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: A rural Vietnamese lower-secondary schoolyard at midday (typical Vietnamese cấp 2 làng quê). Old concrete wall with faded propaganda posters, mango tree (cây xoài) casting dappled shadows, brick floor. A few other 13-year-old Vietnamese students playing with marbles in distant. Two 13-year-old Vietnamese boys sitting cross-legged on the ground: Tí (left, white t-shirt, holding money, soft warm light beige cute-friendly skin) and Tèo (right, faded orange shirt, surrounded by monster card boxes, slightly rounded cute plump baby cheeks (NOT chubby, NOT fat), tiny mohawk).
>
> **Lighting**: harsh midday tropical sunlight with sharp shadows, bright blue sky visible.
>
> **Aspect ratio**: 16:9 cinematic.

---

## 📍 ĐỊA ĐIỂM 5 — ĐƯỜNG LÀNG

### 📄 `c1_bg_road_empty.png` — Đường làng, BG trống (DÙNG CHO DIALOGUE)
**Loại BG**: 🏪 BG TRỐNG — không có nhân vật → dùng cho **DIALOGUE scene** (sprite Tí gặp Hùng trên đường)
**Dùng ở đoạn**: Tí và Hùng gặp nhau trên đường tan học.

> (Style token BG TRỐNG + Setting: A picturesque narrow Vietnamese countryside asphalt road, lined with lush green rice paddies (ruộng lúa) on both sides stretching to horizon. Bamboo fences (hàng rào tre) and palm trees (cây dừa) in distance. Late afternoon golden hour, long shadows on the road. A small concrete bridge visible mid-distance. NO people, NO bicycles on the road, empty scene. 16:9.)

### 📄 `c1_bg_road_bike_race.png` — Tí và Hùng đua xe đạp (DÙNG CHO NARRATOR hành động)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Cutscene Tí đuổi theo Hùng để ganh đua.

> (Style token BG COMPOSITE + Setting: Same Vietnamese countryside road. Side-view shot showing two 13-year-old Vietnamese boys racing bicycles. Hùng (front, taller well-built, fairer skin than Tí, glossy black slicked-back hair, navy blue polo shirt with tiny horse logo, tan khaki shorts, pristine white sneakers) astride a shiny brand-new silver Martin 107 alloy-frame mountain bike with disc brakes, riding confidently with smirk, chin tilted up, hand resting on handlebar. Tí (behind, soft warm light beige cute-friendly skin, short black hair, mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), white rubber sandals, red canvas school backpack (hex color #c83b3b)) pedaling desperately beside his rusty old black single-speed bicycle with worn tires, leaning forward, face jealous and frustrated, eyes glued to Hùng's new bike. Motion blur on background. Warm late-afternoon golden hour sun from behind, rim lighting, dust particles. 16:9 cinematic side-view comparison.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: A picturesque narrow Vietnamese countryside asphalt road, lined with lush green rice paddies (ruộng lúa) on both sides stretching to horizon. Bamboo fences (hàng rào tre) and palm trees (cây dừa) in distance. Late afternoon golden hour, long shadow stretched on the road. A small concrete bridge visible mid-distance.
> **CÓ nhân vật**: Two 13-year-old Vietnamese boys racing bicycles on the road. Hùng (lead, well-dressed navy polo shirt, tan shorts, brand-new shiny bicycle Martin 107) riding confidently with smirk. Tí (behind, mustard yellow t-shirt (hex color #e5aa46), worn red canvas school backpack) pedaling desperately, leaning forward, face jealous and frustrated, old rusty bicycle.
>
> **Lighting**: warm late-afternoon golden hour sun from behind, rim lighting on subject, dust particles.
>
> **Aspect ratio**: 16:9 cinematic.

---

### 📄 `c1_bg_road_Ti_rides_old_bike_save.png` — Tí cưỡi xe đạp cũ rỉ sét quyết định tiết kiệm (DÙNG CHO NARRATOR hành động)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Hệ quả Mission 1.4 nhánh B — Tí bỏ qua lời chọc của Hùng, quyết định KHÔNG độ xe, để dành 500k tiền tiết kiệm mua điện thoại. Cắt cảnh Tí đạp chiếc xe cũ rỉ sét một mình trên đường làng về nhà, tay cầm chặt tay lái, mặt kiên quyết, miệng lẩm bẩm "Cố lên Tí ơi, mày sẽ mua được điện thoại xịn hơn." Tone: TÍCH CỰC, TRƯỞNG THÀNH SỚM.

> (Style token BG COMPOSITE + Setting: **SIDE-VIEW SHOT** — A picturesque narrow Vietnamese countryside asphalt road stretching LEFT-TO-RIGHT across the frame (the road goes horizontally, NOT receding into the distance — this avoids the duplicate-bike problem of front-view). **EXACTLY ONE single bicycle in the entire image** (CRITICAL: only ONE bicycle — Tí's old rusty bike, NO second bike, NO bike on the ground, NO bike parts lying around, NO bike wheel separately, NO shadow that looks like a bike). A 13-year-old Vietnamese boy (Tí, mustard yellow oversized t-shirt (hex color #e5aa46), navy blue shorts (hex color #424a61), white rubber sandals, red canvas school backpack (hex color #c83b3b) on his back) is SITTING ON THE SADDLE of his **EXACTLY ONE** rusty old black single-speed bicycle, PEDALING FORWARD along the road (moving from the LEFT side of frame toward the RIGHT side of frame, in profile view — viewer sees Tí's right side profile, NOT front view). Tí's HANDS GRIP THE HANDLEBAR TIGHTLY, his LEGS are in mid-pedal motion (one foot up, one foot down at different positions on the pedal — this is the pedaling action, NOT a second bike). The **EXACTLY ONE** bicycle has VISIBLY RUSTY CHAIN, WORN TIRES with smooth tread, a small patched-up brown leather seat (NO second saddle, NO bike parked next to him, NO bike lying on the ground — ONLY this ONE bike that Tí is currently riding). Tí's face shows a SMALL DETERMINED FROWN (eyebrows slightly drawn together, mouth in a small firm line, NOT smiling but NOT angry — committed expression), soft warm light beige cute-friendly skin, soft pink blush circles on cheeks, eyes looking FORWARD (in the direction he's riding — to the right of frame — NOT at viewer, NOT down — focused on the road ahead, on the future). His TONGUE is poking out slightly from the corner of his mouth in concentration (the classic cartoon "trying hard" detail). A tiny cartoon sweat drop on his temple from pedaling effort.
>
> **THE FULL BACKGROUND STRETCHES BEYOND THE ROAD** — both above the road (sky) and below the road (foreground + landscape) must be FULLY VISIBLE in 16:9: **Above the road** — a wide open **bright blue sky with soft white cumulus clouds** taking up the upper 30-35% of the frame, with **3-4 tall coconut palm trees (cây dừa)** standing tall at different distances on the horizon line, their long curved trunks and frond tops clearly visible against the sky. **Below the road + on both sides** — **lush green rice paddies (ruộng lúa)** stretching to the horizon on BOTH sides of the road (visible on the left side AND right side of the road), with **bamboo fences (hàng rào tre)** running along the edges of the paddies, a few scattered small bushes, a small wooden farm shed in the far distance. **The road itself** is gray asphalt with a thin yellow center line, stretching from the left edge of frame to the right edge of frame (horizontal, NOT perspective), with Tí + his ONE bicycle positioned roughly in the CENTER of the frame (50% along the horizontal axis). The BG is COMPLETE countryside — sky + palms + paddies + fences + shed all visible, NO crop, NO empty white edges, NO missing horizon. NO Hùng visible anywhere (Hùng has gone ahead on his new bike long ago).
>
> Late afternoon golden hour sun from the upper-right of frame casting warm rim-lighting on Tí's back/right-side and a long soft shadow on the road surface. Warm golden glow on the rice paddies, soft orange-tint on the clouds. Dust particles floating in golden air. 16:9 cinematic side-view aesthetic emphasizing determination.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.** **⭐⭐⭐ CRITICAL: ONLY ONE BICYCLE in the ENTIRE IMAGE — Tí's ONE rusty old bike that he is CURRENTLY RIDING. NO second bike, NO bike parked anywhere, NO bike lying on the ground, NO bike wheel separately, NO bike parts on the ground, NO bike shadow that resembles a bike shape. ONLY THE SINGLE BIKE TÍ IS RIDING.**
>
> **Setting**: A picturesque narrow Vietnamese countryside asphalt road stretching LEFT-TO-RIGHT horizontally across the frame (SIDE-VIEW, NOT perspective). **FULL BACKGROUND VISIBLE 16:9**: bright blue sky with soft white cumulus clouds (upper 30-35% of frame) + 3-4 tall coconut palm trees (cây dừa) at the horizon line + lush green rice paddies (ruộng lúa) stretching on BOTH sides of the road to horizon + bamboo fences (hàng rào tre) along the paddy edges + a small wooden farm shed in far distance. Road has gray asphalt + thin yellow center line, stretching from left edge to right edge of frame. NO crop, NO missing horizon, NO empty white edges.
> **CÓ nhân vật**: A 13-year-old Vietnamese boy (Tí, mustard yellow t-shirt (hex color #e5aa46), soft warm light beige cute-friendly skin, soft pink blush circles, red canvas school backpack on his back) is SITTING ON THE SADDLE of his **EXACTLY ONE** rusty old black single-speed bicycle, PEDALING FORWARD in profile view (moving from LEFT to RIGHT of frame). Hands grip handlebar tightly. Legs mid-pedal motion (one up, one down). Face shows SMALL DETERMINED FROWN — eyebrows slightly drawn together, mouth small firm line, tongue poking out slightly in concentration, eyes looking FORWARD at the road (NOT at viewer). Tiny cartoon sweat drop on temple.
>
> **Lighting**: warm late-afternoon golden hour sun from upper-right, warm rim-lighting on Tí's back/right-side, long soft shadow on road surface, warm golden glow on rice paddies, soft orange-tint on clouds. Dust particles floating in golden air.
>
> **Aspect ratio**: 16:9 cinematic side-view.

---

## 📍 ĐỊA ĐIỂM 6 — CẦU BÊ TÔNG

### 📄 `c1_bg_bridge_empty.png` — Cầu bê tông, BG trống (DÙNG CHO DIALOGUE)
**Loại BG**: 🏪 BG TRỐNG — không có nhân vật → dùng cho **DIALOGUE scene** (sprite Tí hoặc Tèo ghép lên khi hoảng)
**Dùng ở đoạn**: Tèo hét lên khi thấy Tí đang phóng về phía cầu.

> (Style token BG TRỐNG + Setting: A small concrete bridge (cầu bê tông) over an irrigation canal (mương nước) in rural Vietnam. Rusty metal railings, steep downward slope on one side, green rice paddy below, palm trees and hazy sky, water buffalo (trâu) grazing in distance. The bridge is the central focus — dramatic perspective from one end looking down the slope. NO people, NO bicycles. Midday harsh sunlight, slightly overexposed to suggest urgency. 16:9 with strong leading lines from the road sloping down to the bridge.)

### 📄 `c1_bg_bridge_crash.png` — Tí bay khỏi xe đạp (DÙNG CHO NARRATOR — khoảnh khắc đỉnh điểm)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Cutscene đứt phanh — khoảnh khắc nguy hiểm nhất.

> (Style token BG COMPOSITE + Setting: Same small concrete bridge viewed from one end with strong perspective. A 13-year-old Vietnamese boy (Tí, mustard yellow t-shirt (hex color #e5aa46), soft warm light beige cute-friendly skin, red canvas school backpack (hex color #c83b3b) falling off one shoulder) is mid-air being thrown forward off his rusty old bicycle, face with shocked scared kid expression (eyes wide but normal kawaii size, eyebrows raised, small "aa!" mouth — NOT horror scream, NOT distorted face, NOT enlarged head, face stays cute round child proportions), the rusty bicycle tumbling separately in the air. The brake cable visibly snapped and dangling loose. Below, a splash of brown mud and water erupting in the irrigation canal. Green rice paddy on both sides stretching to horizon. Palm trees, hazy sky with white clouds, a water buffalo grazing far in the background. Motion blur and dust particles suggesting violent motion. 16:9 dynamic diagonal composition with dramatic freeze-frame feel.)

> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: A small concrete bridge (cầu bê tông) over an irrigation canal (mương nước) in rural Vietnam, dramatic action moment. Rusty metal railings, steep downward slope on one side, green rice paddy below, palm trees and hazy sky, water buffalo (trâu) grazing in distance. The bridge is the central focus — dramatic perspective from one end looking down the slope.
> **CÓ nhân vật**: A 13-year-old Vietnamese boy (Tí, mustard yellow t-shirt (hex color #e5aa46), soft warm light beige cute-friendly skin, school backpack falling off) mid-air being thrown forward off his bicycle, face with scared shocked kid expression (eyes wide but normal size, small open mouth — NOT horror scream, NOT distorted face, NOT enlarged head), bicycle handlebars broken, tire detached. Motion blur and dust particles suggesting violent motion.
>
> **Lighting**: midday harsh sunlight, slightly overexposed to suggest urgency, dramatic angle.
>
> **Aspect ratio**: 16:9 cinematic with strong leading lines from the road sloping down to the bridge.

---

## 📍 ĐỊA ĐIỂM 7 — PHÒNG NGỦ TÍ SAU TAI NẠN

### 📄 `c1_bg_sickbed_empty.png` — Phòng bệnh, BG trống (DÙNG CHO DIALOGUE)
**Loại BG**: 🏪 BG TRỐNG — không có nhân vật → dùng cho **DIALOGUE scene** (sprite Mẹ hoặc Bố ngồi cạnh giường)
**Dùng ở đoạn**: Mẹ hỏi Tí có đau không, Bố kể chuyện.

> (Style token BG TRỐNG + Setting: A simple Vietnamese countryside bedroom (typical rural Vietnam 2010s). Wooden bed with thin mattress, mosquito net (mùng) hanging from above. A small wooden bedside table with a dim lamp and an empty pink piggy bank placed upside down. Window with yellow curtain showing late afternoon. Worn wooden floor. On the wall: a small photo frame. NO people, NO characters. Empty scene with melancholy mood. Warm dim lamp light + soft golden late-afternoon sunlight through window. 16:9.)

### 📄 `c1_bg_sickbed_ti_bedridden.png` — Tí nằm liệt giường hối hận (DÙNG CHO NARRATOR)
**Loại BG**: 🎬 BG COMPOSITE — có nhân vật trong ảnh → dùng cho **NARRATOR scene**
**Dùng ở đoạn**: Cutscene kết Chương 1 — Tí nằm nhìn heo đất úp, miệng ngậm ngùi.

> (Style token BG COMPOSITE + Setting: Same simple Vietnamese countryside bedroom, bedside view. A 13-year-old Vietnamese boy (Tí, wearing faded patient clothes, leg wrapped in white bandage, lying on wooden bed under thin blanket, mosquito net draped over) lying on his side, staring at an empty pink piggy bank placed upside down on the bedside table. His eyes are teary and regretful, face thin from sickness. On the wall: a small photo of Tí as a small boy with his parents. Late afternoon golden hour sunlight streaming through yellow curtain, melancholy mood. 16:9 cinematic.)


> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration styleVietnamese rural setting, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting**: A simple Vietnamese countryside bedroom (typical rural Vietnam 2010s). Wooden bed with thin mattress, mosquito net (mùng) hanging from above. A small wooden bedside table with a dim lamp and an empty pink piggy bank placed upside down. Window with yellow curtain showing late afternoon. Worn wooden floor. On the wall: a small photo of Tí as a small boy with his parents.
>
> **Lighting**: warm dim lamp light + soft golden late-afternoon sunlight through window, melancholy mood.
>
> **Aspect ratio**: 16:9 cinematic.

---

# 🎮 PHẦN 3 — UI MOCKUP

---

### 📄 `c1_ui_needs_vs_wants.png` — Mini-game kéo thả CẦN / THÍCH
**Dùng ở đoạn**: Khi Tí vào tạp hóa Cô Tư lần đầu tiên → trigger mini-game.

> Chibi 2D cartoon UI design, top-down view, flat illustration style with pastel colors.
>
> **Setting**: A clean wooden table surface, seen from above. Split into two equal columns by a glowing vertical line. Left column has a green banner labeled **"NEEDS"** with Vietnamese label "CẦN" below. Right column has a red banner labeled **"WANTS"** with Vietnamese label "THÍCH" below.
>
> **Floating items to drag**: a 5kg rice bag icon, a 1.5L water bottle icon, a stack of school notebook + pen icon, a prepaid game card with star design, a giant bag of "Oishi" chips icon, a "Conan" manga book icon.
>
> **Hand visible**: A 13-year-old Vietnamese boy's hand (soft warm light beige cute-friendly skin matching Tí's age-locked reference) reaching in from top of frame with a glowing cyan circle cursor around fingertip.
>
> **Style**: Chibi 2D cartoon UI, clean line art, soft drop shadows, pastel colors, lighthearted educational game UI.
>
> **Aspect ratio**: 1:1 square.

---

# 📋 BẢNG TỔNG HỢP — DÀNH CHO ĐỒNG ĐỘI

### 🟢 NEUTRAL STATES — CHARACTER PORTRAITS (sprite cho dialogue scene — gen trước)
| # | Filename | Nhân vật | Tuổi | Quốc tịch | Loại ảnh | Loại scene VN | Dùng ở đoạn hội thoại | Aspect |
|---|---|---|---|---|---|---|---|---|
| 1 | `c1_ti_neutral.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Default cho mọi thoại của Tí | 3:4 |
| 2 | `c1_bo_neutral.png` | Bố | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Default cho mọi thoại của Bố | 3:4 |
| 3 | `c1_me_neutral.png` | Mẹ | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Default cho mọi thoại của Mẹ | 3:4 |
| 4 | `c1_teo_neutral.png` | Tèo | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Default cho mọi thoại của Tèo | 3:4 |
| 5 | `c1_hung_neutral.png` | Hùng | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Default cho mọi thoại của Hùng | 3:4 |
| 6 | `c1_cotu_neutral.png` | Cô Tư | **35** | 🇻🇳 VN | Portrait sprite | `dialogue` | Default cho mọi thoại của Cô Tư | 3:4 |

### 🎭 SPECIFIC EMOTIONS — CHARACTER PORTRAITS (sprite cho dialogue scene — gen sau neutral)
| # | Filename | Nhân vật | Tuổi | Quốc tịch | Loại ảnh | Loại scene VN | Dùng ở đoạn hội thoại | Aspect |
|---|---|---|---|---|---|---|---|---|
| 7 | `c1_ti_curious.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Mở đầu — phá heo đất | 3:4 |
| 8 | `c1_ti_confused_money.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Tạp hóa Cô Tư | 3:4 |
| 9 | `c1_ti_scheming.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Sau khi nghe Tèo rủ | 3:4 |
| 10 | `c1_ti_greedy.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Đếm tiền lời từ thẻ | 3:4 |
| 11 | `c1_ti_jealous.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Thấy Hùng xe mới (CÓ ba lô) | 3:4 |
| 12 | `c1_ti_terrified.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Tai nạn đứt phanh | 3:4 |
| 13 | `c1_ti_sad_sickbed.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Hậu tai nạn | 3:4 |
| 14 | `c1_ti_determined.png` | Tí | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Kết Chương 1 | 3:4 |
| 15 | `c1_bo_strict.png` | Bố | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Sai Tí làm vườn | 3:4 |
| 16 | `c1_bo_proud.png` | Bố | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Thấy Tí tự kiếm tiền | 3:4 |
| 17 | `c1_bo_angry.png` | Bố | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Biết Tí liều xe | 3:4 |
| 18 | `c1_bo_kind.png` | Bố | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Nói chuyện sau tai nạn | 3:4 |
| 19 | `c1_me_teaching.png` | Mẹ | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Dạy CẦN/THÍCH | 3:4 |
| 20 | `c1_me_disappointed.png` | Mẹ | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Biết Tí phá heo | 3:4 |
| 21 | `c1_me_worried_sickbed.png` | Mẹ | **40** | 🇻🇳 VN | Portrait sprite | `dialogue` | Ngồi cạnh giường | 3:4 |
| 22 | `c1_teo_excited_plan.png` | Tèo | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Rủ buôn thẻ bài | 3:4 |
| 23 | `c1_teo_proud.png` | Tèo | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Khoe thẻ hiếm | 3:4 |
| 24 | `c1_teo_scared_run.png` | Tèo | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Bỏ chạy sau tai nạn | 3:4 |
| 25 | `c1_hung_smug_bike.png` | Hùng | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Khoe xe mới | 3:4 |
| 26 | `c1_hung_teasing.png` | Hùng | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Cười nhạo Tí | 3:4 |
| 27 | `c1_hung_indifferent.png` | Hùng | **13** | 🇻🇳 VN | Portrait sprite | `dialogue` | Bỏ đi sau tai nạn | 3:4 |
| 28 | `c1_cotu_friendly.png` | Cô Tư | **35** | 🇻🇳 VN | Portrait sprite | `dialogue` | Chào Tí | 3:4 |
| 29 | `c1_cotu_teaching.png` | Cô Tư | **35** | 🇻🇳 VN | Portrait sprite | `dialogue` | Dạy CẦN/THÍCH | 3:4 |
| 30 | `c1_cotu_grumpy.png` | Cô Tư | **35** | 🇻🇳 VN | Portrait sprite | `dialogue` | Mắng ăn quỵt | 3:4 |

### 🎬 SCENES — BG TRỐNG + BG COMPOSITE (mỗi nơi có 1 BG chính)

#### 🏪 BG TRỐNG — cho DIALOGUE scene (có sprite riêng ghép lên) — **7 file**
| # | Filename | Quốc tịch | Loại ảnh | Loại scene VN | Dùng ở đoạn | Aspect |
|---|---|---|---|---|---|---|
| 31 | `c1_bg_piggybank_room_empty.png` | 🇻🇳 VN | BG trống | `dialogue` | Tí nói Mẹ/Bố trong phòng | 16:9 |
| 32 | `c1_bg_shop_interior_empty.png` | 🇻🇳 VN | BG trống | `dialogue` | Tí đối thoại Cô Tư trong shop | 16:9 |
| 33 | `c1_bg_shop_overview.png` | 🇻🇳 VN | BG trống | `narrator` tĩnh | "Shop vắng tanh chiều hôm ấy..." | 16:9 |
| 34 | `c1_bg_garden_empty.png` | 🇻🇳 VN | BG trống | `dialogue` | Bố sai Tí làm vườn | 16:9 |
| 35 | `c1_bg_schoolyard_empty.png` | 🇻🇳 VN | BG trống | `dialogue` | Tí nói Tèo về thẻ bài | 16:9 |
| 36 | `c1_bg_road_empty.png` | 🇻🇳 VN | BG trống | `dialogue` | Tí gặp Hùng trên đường | 16:9 |
| 37 | `c1_bg_bridge_empty.png` | 🇻🇳 VN | BG trống | `dialogue` | Tèo hét khi thấy Tí phóng về cầu | 16:9 |
| 38 | `c1_bg_sickbed_empty.png` | 🇻🇳 VN | BG trống | `dialogue` | Mẹ/Bố ngồi cạnh giường | 16:9 |

#### 🎬 BG COMPOSITE — cho NARRATOR cinematic (có nhân vật trong ảnh) — **7 file**
| # | Filename | Quốc tịch | Loại ảnh | Loại scene VN | Dùng ở đoạn | Aspect |
|---|---|---|---|---|---|---|
| 39 | `c1_bg_piggybank_moment.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene mở đầu — Tí phá heo | 16:9 |
| 40 | `c1_bg_shop_counter_composite.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene Tí đưa tiền, Cô Tư ghi sổ | 16:9 |
| 41 | `c1_bg_garden_father_working.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene Bố + Tí làm vườn | 16:9 |
| 41a | `c1_bg_garden_lazy_Ti.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene Tí nằm dưới gốc cây đọc truyện — nhánh lười Mission 1.2 | 16:9 |
| 42 | `c1_bg_schoolyard_trade.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene Tí + Tèo buôn thẻ | 16:9 |
| 43 | `c1_bg_road_bike_race.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene Tí đua Hùng | 16:9 |
| 43a | `c1_bg_road_Ti_rides_old_bike_save.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene Tí đạp xe cũ về nhà, quyết tiết kiệm — nhánh tốt Mission 1.4 | 16:9 |
| 44 | `c1_bg_bridge_crash.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene tai nạn đứt phanh | 16:9 |
| 45 | `c1_bg_sickbed_ti_bedridden.png` | 🇻🇳 VN | BG composite | `narrator` | Cutscene kết — Tí nằm liệt giường | 16:9 |

### 🎨 UI MOCKUP
| # | Filename | Loại ảnh | Quốc tịch | Loại scene VN | Dùng ở đoạn hội thoại | Aspect |
|---|---|---|---|---|---|---|
| 46 | `c1_ui_needs_vs_wants.png` | UI mockup | — | `choice` overlay | Mini-game | 1:1 |

**Tổng: 48 prompts** cho riêng Chương 1:
- **6 neutral states** (Portrait sprite — gen đầu tiên → làm reference cho emotion)
- **24 specific emotions** (Portrait sprite — gen sau neutral)
- **7 BG trống** (BG cho dialogue + narrator tĩnh)
- **9 BG composite** (Cinematic cho narrator cinematic có nhân vật — thêm 2 nhánh mới: 1.2B garden_lazy_Ti + 1.4B road_Ti_rides_old_bike_save)
- **1 UI mockup** (mini-game)

### 🔑 Mapping BG ↔ scene VN (dùng trong React data)

```
[dialogue scene: Tí và Cô Tư nói chuyện trong shop]
  type: 'dialogue'
  background: 'shop_interior_empty'   // ← BG trống
  character: 'ti', expression: 'confused_money'   // ← sprite ghép lên
  characterPosition: 'left'
  // React load: BG trống + 2 sprite portrait (Tí + Cô Tư)

[dialogue scene: Bố sai Tí làm vườn]
  type: 'dialogue'
  background: 'garden_empty'      // ← BG trống
  character: 'bo', expression: 'strict'           // ← sprite Bố
  // React load: BG trống + sprite Bố

[narrator scene: Tí mua bim bim]
  type: 'narrator'
  background: 'shop_counter_composite'  // ← BG composite có sẵn Cô Tư + Tí
  // React load: BG composite ONLY (KHÔNG load sprite — đã có trong ảnh)

[narrator scene: shop vắng khách]
  type: 'narrator'
  background: 'shop_overview'     // ← BG trống (narrator tĩnh)
  // React load: BG trống ONLY (chỉ kể cảnh không có nhân vật)
```

> **Quy tắc React** (tham khảo `VisualNovelPlayer.jsx` line 159-201):
> - `scene.type === 'dialogue'` → `character + expression` → load sprite + BG trống
> - `scene.type === 'narrator'` → KHÔNG load sprite, chỉ load BG (trống HOẶC composite)
> - BG composite có nhân vật trong ảnh → thêm vào `BG_HAS_CHARACTER` list (engine skip sprite)
> - BG trống → load bình thường, KHÔNG vào `BG_HAS_CHARACTER`

---

# 📌 CHECKLIST GIAO ĐỒNG ĐỘI

> 🎮 **Game là Visual Novel** — engine tham khảo ở `d:\NGT\Test\finteen-app\src\components\VisualNovelPlayer.jsx`. Có 2 loại scene:
> - `type: 'dialogue'` → cần **portrait sprite** (nhân vật đứng một mình, nền trong suốt)
> - `type: 'narrator'` → cần **cinematic composite** (ảnh toàn cảnh có sẵn nhân vật)

### Phase 1 — Gen 6 NEUTRAL STATES (Character Portraits)
- [ ] Gen `c1_ti_neutral.png` → dùng làm reference gốc cho tất cả emotion Tí
- [ ] Gen `c1_bo_neutral.png` → dùng làm reference gốc cho tất cả emotion Bố
- [ ] Gen `c1_me_neutral.png` → dùng làm reference gốc cho tất cả emotion Mẹ
- [ ] Gen `c1_teo_neutral.png` → dùng làm reference gốc cho tất cả emotion Tèo
- [ ] Gen `c1_hung_neutral.png` → dùng làm reference gốc cho tất cả emotion Hùng
- [ ] Gen `c1_cotu_neutral.png` → dùng làm reference gốc cho tất cả emotion Cô Tư
- [ ] **Dùng STYLE TOKEN: Portrait sprite** (nền trắng, không có background)

### Phase 2 — Gen 24 SPECIFIC EMOTIONS (Character Portraits)
- [ ] **Upload ảnh neutral làm reference** để giữ consistent style
- [ ] **Dùng STYLE TOKEN: Portrait sprite** (nền trắng, không có background)
- [ ] Copy prompt từ file → paste vào Gemini → gen 2-4 lần → chọn 1 ảnh đẹp
- [ ] **Đặt tên file đúng theo convention** trong bảng tổng hợp

### Phase 3 — Gen 7 BG TRỐNG + 7 BG COMPOSITE (chia 2 phases nhỏ)

#### Phase 3a — Gen 7 BG TRỐNG (cho dialogue + narrator tĩnh)
- [ ] **Dùng STYLE TOKEN: BG TRỐNG** (16:9, NO people, NO characters)
- [ ] Gen các file:
  - [ ] `c1_bg_piggybank_room_empty.png` (phòng ngủ trống)
  - [ ] `c1_bg_shop_interior_empty.png` (tạp hóa trống, view từ cửa nhìn vào)
  - [ ] `c1_bg_shop_overview.png` (tạp hóa trống, view từ ngoài nhìn vào)
  - [ ] `c1_bg_garden_empty.png` (vườn trống)
  - [ ] `c1_bg_schoolyard_empty.png` (sân trường trống)
  - [ ] `c1_bg_road_empty.png` (đường làng trống)
  - [ ] `c1_bg_bridge_empty.png` (cầu trống)
  - [ ] `c1_bg_sickbed_empty.png` (phòng bệnh trống)
- [ ] BG này KHÔNG xóa nền, lưu PNG đầy đủ 16:9

#### Phase 3b — Gen 9 BG COMPOSITE (cho narrator cinematic có nhân vật)
- [ ] **Dùng STYLE TOKEN: BG COMPOSITE** (16:9, có nhân vật trong ảnh đang hành động)
- [ ] Gen các file:
  - [ ] `c1_bg_piggybank_moment.png` (Tí phá heo đất)
  - [ ] `c1_bg_shop_counter_composite.png` (Cô Tư ghi sổ, Tí đưa tiền)
  - [ ] `c1_bg_garden_father_working.png` (Bố + Tí làm vườn)
  - [ ] `c1_bg_garden_lazy_Ti.png` (Tí nằm đọc truyện dưới gốc cây — nhánh B Mission 1.2)
  - [ ] `c1_bg_schoolyard_trade.png` (Tí + Tèo buôn thẻ bài)
  - [ ] `c1_bg_road_bike_race.png` (Tí + Hùng đua xe đạp)
  - [ ] `c1_bg_road_Ti_rides_old_bike_save.png` (Tí đạp xe cũ về nhà, quyết tiết kiệm — nhánh B Mission 1.4)
  - [ ] `c1_bg_bridge_crash.png` (Tí bay khỏi xe đạp)
  - [ ] `c1_bg_sickbed_ti_bedridden.png` (Tí nằm liệt giường)
- [ ] BG composite KHÔNG xóa nền, lưu PNG đầy đủ 16:9
- [ ] Verify: mỗi ảnh phải có **rõ ràng 1-2 nhân vật chính** trong cảnh

### Phase 4 — Gen 1 UI MOCKUP
- [ ] **Dùng STYLE TOKEN: UI mockup** (1:1, flat design)

### Phase 5 — Post-process PNG (Character Portraits)
- [ ] Up **30 portrait** (6 neutral + 24 emotion) lên `remove.bg` → xuất PNG nền trong suốt
- [ ] Tên file giữ nguyên `c1_[character]_[emotion].png`
- [ ] Verify từng file: mở bằng trình xem ảnh → nền phải là caro trắng-đen (trong suốt)
- [ ] **KHÔNG** xóa nền các BG (24 file: 17 trống + 7 composite) → chúng cần giữ nguyên

### Phase 6 — Lưu trữ theo cấu trúc React
Lưu ảnh vào folder `d:\DO-AN\SEQ\public\assets\chapter-1\` (đường dẫn đúng cho Vite):
```
d:\DO-AN\SEQ\public\assets\chapter-1\
  portraits\                  ← (PNG trong suốt, đã remove.bg — dùng cho dialogue)
    ti\
      c1_ti_neutral.png
      c1_ti_curious.png
      c1_ti_confused_money.png
      c1_ti_scheming.png
      c1_ti_greedy.png
      c1_ti_jealous.png
      c1_ti_terrified.png
      c1_ti_sad_sickbed.png
      c1_ti_determined.png
    bo\
      c1_bo_neutral.png
      c1_bo_strict.png
      c1_bo_proud.png
      c1_bo_angry.png
      c1_bo_kind.png
    me\
      c1_me_neutral.png
      c1_me_teaching.png
      c1_me_disappointed.png
      c1_me_worried_sickbed.png
    teo\
      c1_teo_neutral.png
      c1_teo_excited_plan.png
      c1_teo_proud.png
      c1_teo_scared_run.png
    hung\
      c1_hung_neutral.png
      c1_hung_smug_bike.png
      c1_hung_teasing.png
      c1_hung_indifferent.png
    cotu\
      c1_cotu_neutral.png
      c1_cotu_friendly.png
      c1_cotu_teaching.png
      c1_cotu_grumpy.png
  bgs\                        ← (PNG đầy đủ 16:9, KHÔNG xóa nền — dùng cho dialogue + narrator)
    # BG trống (7 file, không có nhân vật)
    piggybank_room_empty.png
    shop_interior_empty.png
    shop_overview.png
    garden_empty.png
    schoolyard_empty.png
    road_empty.png
    bridge_empty.png
    sickbed_empty.png
    # BG composite (7 có nhân vật)
    piggybank_moment.png          ← BG_HAS_CHARACTER
    shop_counter_composite.png    ← BG_HAS_CHARACTER
    garden_father_working.png     ← BG_HAS_CHARACTER
    schoolyard_trade.png          ← BG_HAS_CHARACTER
    road_bike_race.png            ← BG_HAS_CHARACTER
    bridge_crash.png              ← BG_HAS_CHARACTER
    sickbed_ti_bedridden.png      ← BG_HAS_CHARACTER
  ui\
    c1_ui_needs_vs_wants.png
```

### Phase 7 — Code React (tham khảo VisualNovelPlayer.jsx)
- [ ] Tạo `src/data/c1Sprites.js` — map `character + expression → /assets/chapter-1/portraits/[char]/[file].png`
- [ ] Tạo `src/data/c1Bgs.js` — map **14 bgId** (7 trống + 7 composite) → `/assets/chapter-1/bgs/[file].png`
- [ ] Trong `VisualNovelPlayer.jsx`:
  - Khi `currentScene.type === 'dialogue'` → load portrait sprite ở `characterPosition` + load BG trống (có suffix `_empty` / `_overview`)
  - Khi `currentScene.type === 'narrator'` → load BG (trống HOẶC composite tùy scene)
  - List `BG_HAS_CHARACTER` (line 198 demo) → thêm **7 BG composite**:
    ```js
    const BG_HAS_CHARACTER = [
      'piggybank_moment',
      'shop_counter_composite',
      'garden_father_working',
      'schoolyard_trade',
      'road_bike_race',
      'bridge_crash',
      'sickbed_ti_bedridden',
    ]
    ```
  - 7 BG trống → load bình thường, KHÔNG vào `BG_HAS_CHARACTER`
- [ ] Dialogue box: speakerName, text typewriter, Continue button
- [ ] Choice UI: hiển thị khi `type === 'choice'`
- [ ] Modal: lesson (good ending) + fail (bad ending)

---

# 🚨 NẾU TOOL GEN VẪN RA SAI (MẸO KHẮC PHỤC)

> 📌 **LƯU Ý QUAN TRỌNG**: Ảnh mẫu Tí lần gen đầu tiên cho thấy tool Gen vẫn bị **4 lỗi phổ biến** — dù style token đã có `Vietnamese ethnicity`. Đây là checklist fix.

### Vấn đề 1: Tool gen ra mặt Nhật / Hàn / Trung
**Triệu chứng**: Mặt V-line baby, mũi nhỏ pointy, mắt to tròn anime-style.
**Khắc phục**:
- Negative: `East Asian features, Korean face, Japanese face, Chinese face, anime-stereotype face, K-pop idol face, Japanese anime face, big round eyes anime stereotype`
- Positive bổ sung: `slightly flat and wider nose bridge, single eyelid or shallow double eyelid, monolid-friendly eye shape, soft round child cheeks`

### Vấn đề 2: Tool gen Tí già hơn (17-18 tuổi thay vì 13)
**Triệu chứng**: Vai bè, cơ bắp, hàm nhọn, dáng cao to.
**Khắc phục**:
- Positive: `must look exactly 13 years old, child proportions (head slightly larger relative to body), skinny and lanky build typical of underfed rural Vietnamese village teenagers, visible thin arms, narrow bony shoulders, thin legs with slightly prominent knees, NOT muscular, NOT athletic, soft jawline, no facial hair`
- Negative: `slim sharp jawline (wrong for age 13 boy), tall muscular body (wrong for skinny 13-year-old), mature face, adult features, beard, mustache, deep wrinkles`

### Vấn đề 3: Da quá trắng hoặc quá đen
**Triệu chứng**: Da trắng bệch như Hàn Quốc hoặc da quá tối.
**Khắc phục**:
- Quá trắng: positive `soft warm light beige cute-friendly skin, slightly darker warm tone on arms and face`
- Quá đen: positive `NOT dark-skinned, NOT African, NOT African-American`
- Negative: `realistic Vietnamese adult face, pale white skin, fair porcelain skin`

### Vấn đề 4: Tóc / mắt bị đổi (tóc nâu, mắt xanh)
**Triệu chứng**: Tóc nâu highlight, mắt xanh/lam/xám.
**Khắc phục**:
- Positive: `pitch-black hair (no brown, no highlights), dark brown eyes (no blue, no green, no gray), big round black-brown eyes (NOT oversized anime-stereotype round eyes, more natural proportion)`

### Vấn đề 5: Quần áo quá sạch sẽ / quá mới (mất chất "làng quê nghèo")
**Triệu chứng**: Đồ như vừa mua ở shop, không có cảm giác hand-me-down.
**Khắc phục**:
- Positive: `slightly too big, hand-me-down look, visible wear, slightly faded color, wrinkled fabric`
- Negative: `brand new clothes, fashion model outfit, trendy, designer clothes`

### Vấn đề 6: Biểu cảm quá "anime" (mắt to biết buồn, nước mắt như suối)
**Triệu chứng**: Khi emotion = sad/angry, tool Gen vẽ mắt anime to lên 200% và nước mắt tuôn như manga.
**Khắc phục**:
- Positive: `natural realistic human expression, subtle emotion, not exaggerated anime style`
- Negative: `extreme anime expression, dramatic tears, sparkle eyes, huge shiny eyes, chibi expression`

---

# 🎯 REFERENCE NHANH — ĐẶC ĐIỂM NGƯỜI VIỆT NAM

> Bảng tham chiếu để đồng đội copy kèm vào mỗi prompt.

### 🧒 Trẻ em / thiếu niên Việt Nam (13-16t)
```
Vietnamese rural village boy/girl, slightly flat and wider nose bridge,
single eyelid or shallow double eyelid, monolid-friendly eye shape,
soft round child cheeks with baby fat, soft warm light beige cute-friendly skin,
short black messy hair (typical of village kids playing outdoors),
skinny build, slightly darker skin than urban kids, child proportions
(head slightly larger than adult).
```

### 👨 Đàn ông Việt Nam trưởng thành (40-50t)
```
Vietnamese middle-aged man age 40, height **175cm TALL** with **LONG LEGS making up 55% of his height** (NOT short, NOT compact, NOT stunted, NOT round-baby-torso with short-legs). **Bắc Bộ (Northern Vietnamese) face structure** — square-ish face with WIDE defined jawbone and cheekbones (NOT round Nam Bộ face, NOT oval, NOT soft, **NOT gaunt, NOT hollow-cheeked, NOT sunken, NOT skinny-face** — full healthy flesh on strong bones, a well-fed working father NOT a starving peasant), straight broad Vietnamese-Kinh nose (NOT pointy, NOT Western-nose), **NORMAL-sized sharp watchful experienced eyes** under thick dark natural brows (**NOT big anime eyes, NOT bug-eyes, NOT kawaii-cute-eyes, NOT doll-eyes, NOT enlarged cartoon eyes — small sharp adult male eyes**), forehead has clear horizontal lines from years of squinting in the sun thinking (NOT deep old wrinkles, NOT smooth baby skin), nasolabial folds softly visible (depth-of-character lines, NOT old-man lines), weathered soft warm **deep tan brown** cute-friendly skin (looks like a man who has worked outdoors his whole life — NOT pale, NOT yellow, NOT white, NOT office-worker skin), **Hair color**: **BLACK hair (predominantly black) with SCATTERED silver streaks** — mostly black with a few silver highlights at the temples and a few scattered streaks through the top and sides (NOT all-gray, NOT all-silver, NOT salt-and-pepper throughout, NOT fully gray, NOT white-haired, NOT silver-haired, NOT old-man white hair, NOT peppered throughout — at 40 his hair is still mostly BLACK with only slight early silvering). **Healthy-LEAN TONED TALL SLIM farmer build** (NOT fat, NOT chubby, NOT thick-bodied, NOT barrel-chested, NOT stocky, NOT bodybuilder, NOT round-bellied, NOT paunch, NOT beer gut, NOT round-bodied, NOT circular, NOT ball-shaped, NOT spherical, NOT kawaii-chubby, NOT baby proportions — body silhouette is **LONG ELONGATED TALL** like a tall slim tree NOT a short round ball): **NOTABLY BROAD SHOULDERS** visibly wider than hips creating clear V-taper (NOT narrow, NOT average, NOT same-width shoulder to waist) down to a **NOTICEABLY NARROWER slim waist** with **slim narrow hips** (NOT wide hips, NOT pear-shaped), arms with visible lean muscle tone from hoeing/carrying/plowing (NOT bulging biceps, NOT noodle arms), flat chest, **WASHBOARD-FLAT firm stomach with NO belly at all** (NOT six-pack show-off, NOT round belly, NOT paunch, NOT soft middle-aged spread, NOT weight around midsection — clear athletic V-shape taper from broad shoulders to narrow waist), large rough calloused hands, squared shoulders kept straight and upright from discipline (NOT slouched, NOT hunched, NOT stooped, NOT farmer's stoop). **Overall impression: a TALL (175cm), TALL-LEGGED, fit, healthy-faced, thông minh giàu kinh nghiệm Bắc Bộ rural father — cao gầy khỏe khôn, well-fed mặt đầy đặn (không gầy, không má hóp), broad V-shape với chân dài chiếm 55% height, tóc đen điểm xuyết bạc, mắt nhỏ sắc tinh tường — imposing through QUIET AUTHORITY, BROAD-SHOULDERED V-SHAPE POSTURE, EXPERIENCED EYES, and TALL ELONGATED STANCE, NOT bulk, NOT bodybuilder, NOT round belly, NOT short, NOT round-bodied.**
```

### 👩 Phụ nữ Việt Nam trưởng thành (35-50t)
```
Vietnamese mature woman, oval face, soft small nose, gentle round eyes,
slight wrinkles at eye corners (typical "crow's feet" from years of smiling
and sun), yellowish-brown skin, long black hair often tied in low ponytail
or bun, gentle maternal features, plump soft build (typical of rural
Vietnamese women who eat rice regularly).
```

### 👵 Phụ nữ Việt Nam lớn tuổi (50-60t)
```
Vietnamese elderly woman, round face with sagging cheeks and double chin,
gray-streaked black hair in tight bun, deeply wrinkled tanned skin with
visible age spots, small beady eyes, plump short build, weathered face
from years of sun and market work.
```

---

✅ **File đã chuẩn hóa đầy đủ**. Mỗi nhân vật giờ đã có **độ tuổi cố định + quốc tịch Việt Nam + cụm age-locked** trong TỪNG prompt → tool Gen khó mà sai.

Mày muốn tao **làm tương tự cho Chương 2–8** (mỗi chương 1 file `.md` riêng), hay **bổ sung thêm Section nhân vật phụ xuyên chương** (Minh 23t, vợ Tí 27t, con Tí 1t,...) vào file này? 🎨
