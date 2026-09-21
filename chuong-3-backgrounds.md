# 🎬 CHƯƠNG 3 — BACKGROUND & SCENE PROMPTS

> **MỤC ĐÍCH**: Tách riêng **BG** (nền trống, không nhân vật) và **SCENE** (composite, có nhân vật) cho Chương 3 — giai đoạn **Sinh viên Đại học** (Tí 19 tuổi).
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Tất cả BG và SCENE phải dùng **CHÍNH XÁC** style token kawaii 2D giống hệt portrait sprite — để khi ghép sprite lên BG, nhất quán về art style. KHÔNG BAO GIỜ dùng style realistic, semi-realistic, cinematic-photorealistic cho BG/SCENE.
>
> **⚠️ QUY TẮC TUỔI NHÂN VẬT**: Từ Chương 3 trở đi, **Tí** đã lớn lên (16 → 19 tuổi, sinh viên ĐH). Phải dùng character reference mới cho Tí. **Chủ trọ 50t** và **Chủ quán cà phê 45t** là nhân vật MỚI — KHÔNG có reference từ chương trước.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi prompt trong file này là **KHỐI TỰ CHỨA ĐẦY ĐỦ** — copy nguyên khối `[Style token + Character reference đầy đủ + Setting + Aspect]` là dán vào Gemini là chạy được. KHÔNG cần tra cứu thêm ở đâu khác.

---

# 📐 KIẾN TRÚC VISUAL NOVEL — 3 LOẠI ẢNH

> 🎮 **Game này là Visual Novel kiểu Ren'Py / VN Studio**. Mỗi scene thuộc 1 trong 2 loại VN:

| Loại scene VN | Sprite nhân vật | Background | Loại ảnh gen |
|---|---|---|---|
| **`type: 'dialogue'`** (có đối thoại giữa 2+ nhân vật) | ✅ Render sprite riêng | **BG trống** (không có nhân vật trong ảnh) → sprite ghép lên trên | **PORTRAIT sprite** (1 nhân vật đứng một mình, nền trắng) + **BG TRỐNG** |
| **`type: 'narrator'`** (kể chuyện, không đối thoại) | ❌ KHÔNG render sprite | **BG COMPOSITE** (ảnh có sẵn nhân vật đang hành động) | **CINEMATIC SCENE** (ảnh toàn cảnh 16:9, có nhân vật trong ảnh) |
| **`type: 'choice'`** (lựa chọn) | ❌ | BG mờ + UI overlay | — |

> 📌 **Chương 3 có thoại qua lại giữa 2 nhân vật** (Tí ↔ Chủ trọ, Tí ↔ Chủ quán cà phê) → cần **dialogue scene** với BG trống + 2 portrait sprites.
>
> 📖 **Tham khảo**: Project demo `d:\NGT\Test\finteen-app\src\components\VisualNovelPlayer.jsx`
> - Line 159: `const CharacterComponent = currentScene.character ? getSprite(currentScene.character, currentScene.expression || 'happy') : null`
> - Line 187: `dialogueBgOpacity = isDialogue ? 0.62 : 1.0` → BG mờ xuống khi dialogue, sprite nổi bật
> - Line 198-201: `BG_HAS_CHARACTER` list → biết scene nào dùng BG composite, engine skip sprite

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 3)

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt |
|---|---|---|---|
| Tí | **19** | 🇻🇳 Việt Nam | `a 19-year-old Vietnamese boy` |
| Chủ trọ | **50** | 🇻🇳 Việt Nam | `a 50-year-old Vietnamese woman` |
| Chủ quán cà phê | **45** | 🇻🇳 Việt Nam | `a 45-year-old Vietnamese woman` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các emotion của cùng 1 nhân vật.

### Aspect ratio + mapping theo loại scene VN

| Loại ảnh | Tỉ lệ | Loại scene VN dùng | Đặc điểm |
|---|---|---|---|
| **BG trống** (cho dialogue — không nhân vật) | 16:9 ngang | `type: 'dialogue'` | Nền môi trường toàn cảnh rỗng, sẽ ghép sprite portrait lên |
| **BG composite** (có nhân vật sẵn trong ảnh) | 16:9 ngang | `type: 'narrator'` | Toàn cảnh 16:9 Việt Nam, có nhân vật Việt đang hành động trong ảnh — KHÔNG render sprite riêng |

---

# 🔗 CROSS-REFERENCE ĐẾN CHƯƠNG 1+2 (dùng ảnh lúc nhỏ làm reference khi gen ảnh 19 tuổi)

> 🎯 **QUAN TRỌNG**: Khi gen ảnh Tí ở chương 3 (19 tuổi), phải upload kèm **ảnh reference từ chương 2** (`c2_ti_dorm_neutral.png`) để AI giữ đúng phong cách nhân vật, chỉ thay đổi tuổi và chi tiết trưởng thành.

| Nhân vật chương 3 | Dùng ảnh reference | Ghi chú |
|---|---|---|
| Tí 19t | `c2_ti_dorm_neutral.png` (Tí 16t ở trọ từ chương 2 — ảnh Tí 16t mặc áo thun xám (hex #d0d0d0) + quần jeans xanh (hex #3a4a5a) + sneaker trắng + tóc đen gọn vuốt nhẹ sang bên + da trắng sạch, height 168cm — **đây là chiều cao 16t trong ảnh gốc, KHI GEN TÍ 19T phải tăng lên 178cm + gầy hơn**) — **DÙNG ẢNH NÀY làm reference cho Tí 19t, KHÔNG dùng `c3_ti_neutral.png` từ bible** | height **178cm (cao hơn 16t 8cm, visibly THINNER and LEANER build — bony wrists, collarbone, narrow shoulders, thin wiry build)**, pale skin (giữ da trắng sạch), **thêm dark circles**, **tóc SIDE PART RẼ NGÔI (KHÁC 16t fringe vuốt nhẹ)**, **áo thun xám (hex #d0d0d0) + quần jeans XANH DƯƠNG NHẠT (hex #6890c0) + sneaker trắng + tai nghe chụp đầu đen + laptop + balo đen to** |
| Chủ trọ 50t | `c3_chutro_neutral.png` (gen từ file `chuong-3-characters.md`) | 155cm, mập, da ngăm, áo bà ba hoa |
| Chủ quán cà phê 45t | `c3_chuquancafe_neutral.png` (gen từ file `chuong-3-characters.md`) | 160cm, thanh mảnh, da sáng, áo sơ mi đen |

---

# 👥 CÁC NHÂN VẬT XUẤT HIỆN Ở CHƯƠNG 3

| ID | Tên nhân vật | Tuổi cố định | Vai trò | Xuất hiện trong file này? |
|---|---|---|---|---|
| `ti` | Tí (nhân vật chính) | **19** | Sinh viên ĐH năm nhất, sống trọ, làm thêm đêm (height **178cm — cao HƠN 16t 8cm + visibly THINNER and LEANER build (bony wrists, collarbone, narrow shoulders, thin wiry build)**, **TÓC SIDE PART RẼ NGÔI 7:3** (KHÁC 16t fringe vuốt nhẹ), áo thun xám (hex #d0d0d0) + quần jeans XANH DƯƠNG NHẠT (hex #6890c0) + sneaker trắng + **tai nghe chụp đầu đen đeo quanh cổ** + **laptop** + balo đen to, dark circles) | ✅ Có |
| `chutro` | Chủ trọ | **50** | Bà chủ nhà cho thuê phòng trọ của Tí | ✅ Có |
| `chuquancafe` | Chủ quán cà phê | **45** | Bà chủ quán cà phê specialty nơi Tí làm thêm đêm | ✅ Có |

---

# 🎨 STYLE TOKEN — CHIA THEO LOẠI ẢNH

### 🏪 STYLE TOKEN cho **BG TRỐNG** (empty background cho dialogue — không có nhân vật)
```
Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, empty Vietnamese [LOCATION NAME] setting. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NO people, NO characters, empty scene ready for character sprites to be added later, rich environmental detail, atmospheric perspective, 16:9 widescreen composition, no text, no watermark.
```

> 🔒 **Dùng cho**: `c3_bg_[place]_empty.png` (VD: `c3_bg_dorm_studio_empty.png`)
> → Background **rỗng không có ai**, sẽ được React load cùng với sprite portrait khi vào dialogue scene.
> → Lưu ý: BG này **KHÔNG xóa nền**, là PNG đầy đủ 16:9.

### 🎬 STYLE TOKEN cho **BG COMPOSITE** (narrator cinematic — có nhân vật trong ảnh)
```
Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, full background scene with Vietnamese urban. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT 3D, NOT Pixar, NOT creepy, NOT scary. setting (city studio apartment, coffee shop interior, dorm room, hallway with electric meter), characters IN the scene naturally posed and placed mid-action, rich environmental detail, atmospheric perspective, depth of field, 16:9 widescreen composition, no text, no watermark.
```

> 🔒 **Dùng cho**: `c3_bg_[place]_[action].png` (VD: `c3_bg_split_room_choice.png`)
> → Ảnh toàn cảnh 16:9 có nhân vật Việt Nam đang hành động trong cảnh, KHÔNG cần xóa nền.

### Anti-distortion CRITICAL block (áp dụng cho MỌI BG và SCENE)
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

### Negative prompt (áp dụng cho CẢ BG và SCENE)
```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality,
3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features,
wrong age appearance, caucasian features, anime-stereotype Western face,
Japanese anime face, K-pop face, big round eyes anime stereotype,
slim sharp jawline (wrong for age 19 boy), tall muscular body (wrong for lean 19-year-old),
realistic Vietnamese adult face, child proportions (must look exactly 19)
```

---

# 🏞️ PHẦN A — BACKGROUND (BG) — NỀN TRỐNG, KHÔNG CÓ NHÂN VẬT

> **BG = ảnh nền toàn cảnh 16:9**, không nhân vật.
> Dùng cho: `dialogue` scene (React ghép sprite lên) HOẶC `narrator` tĩnh.
>
> **Style**: Kawaii 2D cartoon background — flat cel-shaded environment, simple shapes, pastel/warm colors, Studio Ghibli-inspired urban Vietnam setting rendered as cute cartoon. NO realistic rendering, NO photographic background, NO anime background.

---

## 📍 BG 1 — PHÒNG TRỌ STUDIO 16M² TRUNG TÂM THÀNH PHỐ (BAN ĐÊM)

### 📄 `c3_bg_dorm_studio_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí nói chuyện với Chủ quán cà phê qua điện thoại về ca làm, hoặc Tí đối thoại nội tâm về chi phí cuối tháng
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Phòng trọ studio 16m² Tí thuê ở trung tâm thành phố khi vào ĐH. Đắt đỏ nhưng gần trường, gần quán cà phê làm thêm. Dùng cho:
- Dialogue: Tí nói chuyện nội tâm khi nhìn hóa đơn điện nước cuối tháng (Scene 4 + Scene 5)
- Dialogue: Tí + Chủ trọ đối thoại qua cửa về việc trả tiền trễ

> **STYLE TOKEN (bắt buộc dùng y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**

> **Setting (BG kawaii cartoon environment — COZY MODERN SMALL URBAN STUDIO APARTMENT OF A 19-YEAR-OLD VIETNAMESE UNIVERSITY STUDENT LIVING ALONE, Studio Ghibli urban-aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the studio room itself, far from any door or wall**, capturing the whole studio in a single panoramic view. **The camera is INSIDE the room, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer does NOT look through a door. The viewer simply SEES the studio from inside, as if standing in the middle of a small modern urban rental. **Image is FULL-BLEED** — the studio extends **edge-to-edge across the entire 16:9 frame**. The very left edge of the frame is the warm painted wall (continuing into the wall), the very right edge is the same wall, the top edge is the ceiling, the bottom edge is the floor — there is **no rectangular doorway box, no window frame border, no arch framing the scene**, the studio simply fills the entire frame like a wide panoramic photograph taken from inside a small-town rental. **ALL FOUR WALLS visible** with **floor and ceiling all visible**, the studio opens up like a typical small Vietnamese urban studio apartment (16m²) rented by a university student. **Environment rendered in cute kawaii cartoon style with COZY WARM NIGHTLIT atmosphere — DETAIL-DENSE, lived-in, TEENAGE-STUDENT studio full of small details**: **Ceiling** at top — simple flat white-painted ceiling with a **single small modern LED panel light** casting warm yellow-white circle of light down, plus **a small slow-spinning warm ceiling fan** with 3 cartoon blades and 2 pull-strings. **Back wall (far away from viewer, with big window)** — smooth cream-white painted wall, a **big floor-to-ceiling window** (cửa sổ lớn từ sàn đến trần) showing nighttime urban Vietnam: outside the window is a **busy intersection with cartoon motorbikes** passing by, **bright neon signs in Vietnamese** ("CÀ PHÊ", "PHỞ") glowing softly pink/yellow/cyan, tall building silhouettes. Inside: a **compact single bed** (giường đơn) pushed against this wall with a **pale-blue thin blanket** folded neatly, a **small thin pillow**. **Left wall** — a **small wooden study desk** with **stacked university textbooks** (Giải tích, Vật lý đại cương, Triết học Mac-Lenin — generic cartoon books with Vietnamese text on spines), a **tall stack of mock exam papers** in cartoon paper stacks, a **small pencil holder** with cartoon pencils, a **small reading lamp** with soft warm yellow shade, plus an **open laptop** on the desk (cartoon chunky laptop with glowing screen showing a generic code editor with green text on dark background — NO real code, just generic placeholder lines). Above the desk: a **small wall calendar** with cute cartoon picture, a **small clock** with cartoon hands showing late evening time (~22h). **Right wall** — a **simple open wooden wardrobe** with a few **hanging casual clothes** (gray t-shirts, blue jeans, white sneakers on the bottom shelf), a **small backpack** hanging from a hook, a **small electric rice cooker** (nồi cơm điện nhỏ) on the floor next to the wardrobe with a tiny warm steam plume. A **small standing fan** (quạt đứng) on the floor near the wardrobe. **Floor** — polished warm-cream tile floor with subtle grout lines, the warm ceiling light creating a golden-amber circle of light in the center. A small **electric meter box** (công tơ điện) on the wall near the door (outside frame, but its small red glowing display can be partially seen at the edge — small detail hinting at high electricity bills). NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING in this image.

> **Lighting**: warm LED panel light + soft warm glow from outside neon signs through the big window (pink/cyan/yellow tints from neon), warm reading lamp on desk — **cozy warm small urban studio nighttime atmosphere in kawaii cartoon style, slightly melancholic from being alone in big city, EVERY part of the room visible and lit**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the studio fills the entire frame with NO door, NO doorframe, NO wall edges, NO window frame border, NO arch, NO rectangular framing visible — the very left edge is wall, the very right edge is wall, the top edge is ceiling, the bottom edge is floor), **background image ONLY, no characters**.

---

## 📍 BG 2 — PHÒNG TRỌ NGOẠI Ô RẺ TIỀN (BAN ĐÊM)

### 📄 `c3_bg_dorm_cheap_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Phiên bản khác của lựa chọn phòng trọ (nếu Tí chọn phòng rẻ ngoại ô), dùng cho Tí đối thoại nội tâm về lý do chọn
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Phòng trọ rẻ tiền ngoại ô Tí thuê (lựa chọn B trong Scene 1 split-screen). Dùng cho:
- Dialogue: Tí nội tâm khi đếm tiền cuối tháng trong phòng trọ rẻ (Scene 4 — bão giá cuối tháng)

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (BG kawaii cartoon environment — SAD CRAMPED CHEAP OUTER-SUBURB RENTAL ROOM, Studio Ghibli melancholic-aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the small rundown rental room**, capturing the whole room in a single panoramic view. **The camera is INSIDE the room, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE**. **Image is FULL-BLEED EDGE-TO-EDGE**. **ALL FOUR WALLS visible** with **floor and ceiling all visible**. **Environment rendered in cute kawaii cartoon style with SAD MELANCHOLIC atmosphere — DETAIL-DENSE but depressing, cheap-rental feel**: **Ceiling** — old cream-yellow paint with mild water stains in corners, a **single dim warm bulb** on a thin wire casting a weak yellow circle of light down. **Back wall (far away from viewer)** — old yellow painted wall, slightly faded with a few small paint chips (NOT heavily peeled, NOT exposing bare concrete — just gently aged paint showing it's been lived in for years), a **single thin mattress on the floor** with a **worn thin blanket** folded neatly and a small flat pillow. **Left wall** — a **small dusty window** with view of **empty fields** and **old warehouses** in the distance (drawn as kawaii silhouette), a **thin pale curtain** hanging. Below window: a **basic wooden desk** with **stacked university textbooks** and a **small reading lamp** (working, casting a small warm circle on the desk), an **empty instant-noodle cup** on the desk. **Right wall** — a **small concrete shelf** with a few **mismatched plates and bowls**, a **small mirror** on the wall, a **plastic water bottle**. **Floor** — **stained concrete floor** with mild wear (NOT heavily cracked, NOT dirty — just lived-in). A **small fan** on the floor. A **small electric meter box** on the wall with red glowing display. NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR.

> **Lighting**: single dim warm bulb + cold blue moonlight through dusty window — **sad lonely cramped cheap-rental nighttime atmosphere in kawaii cartoon style, EVERY part of the room visible and lit**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE**, **background image ONLY, no characters**.

---

## 📍 BG 3 — HÀNH LANG PHÒNG TRỌ — CÓ CÔNG TƠ ĐIỆN (BAN NGÀY)

### 📄 `c3_bg_dorm_hallway_meter_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối mặt với Chủ trọ ở hành lang ngoài phòng về hóa đơn điện nước (Scene 5 — Life Event)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Life Event: Hóa đơn điện nước. Hành lang chung tầng trọ, nơi có công tơ điện, nơi Chủ trọ đứng đợi Tí để đòi tiền điện nước cuối tháng. Dùng cho:
- Dialogue: Tí bước ra khỏi phòng, gặp Chủ trọ đang đứng cạnh công tơ điện, giơ hóa đơn

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (BG kawaii cartoon environment — SHARED RENTAL HALLWAY WITH ELECTRIC METER BOX, Studio Ghibli urban-dorm aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the narrow rental hallway**, capturing the whole corridor in a single panoramic view. **The camera is INSIDE the hallway, NOT looking through a door** — there is **NO doorway, NO doorframe, NO entrance, NO wall edges, NO rectangular framing visible**. **Image is FULL-BLEED EDGE-TO-EDGE**. **ALL WALLS visible** with **floor and ceiling all visible**. **Environment rendered in cute kawaii cartoon style with HARSH DAYLIGHT DRAMA atmosphere — DETAIL-DENSE, lived-in, urban rental corridor**: **Ceiling** at top — concrete ceiling with **single bare fluorescent tube** (đèn tuýp cũ) casting cool white light, visible **exposed pipes and electrical wires** running across (small detail), a few cobwebs. **Back wall (far away from viewer, at the END of the hallway)** — **concrete painted wall** in dull cream-yellow with hairline cracks, **a small barred window** at the end letting in harsh daylight (the only natural light source), a **small stair railing** going up to the next floor visible at the end. **Left wall** (running along the left side of the hallway) — **3 closed wooden doors** in chunky kawaii cartoon style (each door = one tenant's room), each door has a small numbered plate (cartoon number plates — "101", "102", "103" — generic placeholder, THIS IS THE ONLY TEXT), small mismatched **door mats** (những chiếc thảm chùi chân khác nhau) in front of each door. Below the doors: a **narrow wooden bench** (ghế gỗ dài) for tenants to sit. **Right wall** — the **ELECTRIC METER BOX** (công tơ điện) mounted on the wall, **a metal box painted dull red with small digital display showing red glowing numbers** (cartoon chunky electric meter with red LED numbers — generic placeholder digits like "00452 kWh", small handwritten "ĐỌC HÀNG THÁNG" label in cartoon), below it a **small piece of paper** taped on the wall showing last month's reading. Below the meter: a **small trash bin**. **Floor** — **dusty tile floor** (nền gạch bẩn) in dull cream square tiles, slightly worn, with subtle perspective lines stretching toward the back wall, small **fallen leaves** drifting in through the end window. A few **paired cartoon sandals** (đôi dép) lined up against the left wall (typical Vietnamese shared-hallway behavior — leave shoes outside the room). NO people, NO characters, NO sprites, NO DOORWAY, NO DOORFRAME, NO RECTANGULAR FRAMING.

> **Lighting**: harsh cool daylight streaming through end window + single cool fluorescent tube — **tense confrontational daytime hallway atmosphere in kawaii cartoon style, EVERY part of the hallway visible and lit**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE**, **background image ONLY, no characters**.

---

## 📍 BG 4 — QUÁN CÀ PHÊ SPECIALTY — SAU GIỜ ĐÓNG CỬA (BAN ĐÊM)

### 📄 `c3_bg_coffee_shop_closed_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại với Chủ quán cà phê khi sắp hết ca làm đêm 20h-24h (Scene 2 — Bài toán 20 giờ)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Quán cà phê specialty nơi Tí làm thêm đêm. Sau giờ đóng cửa, khách đã về hết, chỉ còn Tí dọn dẹp cuối ca và Chủ quán đang ngồi kiểm tra sổ sách. Dùng cho:
- Dialogue: Tí nói chuyện với Chủ quán về lịch làm thêm tuần sau, về việc xin tăng ca
- Dialogue: Tí nội tâm khi thấy mệt mỏi nhưng vẫn cố

> **STYLE TOKEN (bắt buộc dùng y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**

> **Setting (BG kawaii cartoon environment — COZY VIETNAMESE SPECIALTY COFFEE SHOP AFTER CLOSING TIME, Studio Ghibli coffee-shop aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the coffee shop**, capturing the whole shop interior in a single panoramic view. **The camera is INSIDE the shop, NOT outside the door** — there is **NO doorway, NO doorframe, NO entrance frame, NO wall edges, NO rectangular framing visible ANYWHERE**. **Image is FULL-BLEED EDGE-TO-EDGE**. **ALL FOUR WALLS visible** with **floor and ceiling all visible**. **Environment rendered in cute kawaii cartoon style with COZY LATE-NIGHT WORKER atmosphere — DETAIL-DENSE, lived-in, warm barista-coffee aesthetic**: **Ceiling** at top — warm wooden ceiling with **exposed wooden beams**, **warm hanging Edison bulbs** (bóng đèn tròn vàng ấm) hanging from black cords casting small warm pools of light, plus a **small slow-spinning warm ceiling fan**. **Back wall (far away from viewer, the bar/counter wall)** — **mint-green painted wall** with **small framed coffee-art prints** (4-5 small cartoon kawaii coffee art frames — generic latte-art hearts, generic coffee-bean sketches, NO real brand logos), a **long wooden bar counter** (quầy bar gỗ) with **shelves of ceramic mugs** (hàng dãy cốc sứ) in warm pastel colors stacked neatly, a **chunky espresso machine** (máy pha cà phê) in chrome cartoon style on the counter, a **small hand-written menu chalkboard** on the wall showing generic cartoon coffee drinks (cà phê sữa đá, bạc xỉu, americano — bubbly cartoon Vietnamese, THIS IS THE ONLY TEXT, small handwritten). A small **cash register** (máy tính tiền) on one end of the counter. **Left wall** — the **front window/wall** with **big glass storefront** showing dark urban night outside (cool blue-purple tones), a few **small warm reflections** of the inside lights on the glass, a **small hanging "OPEN/CLOSED" sign** flipped to "CLOSED" (small cartoon chunky sign). A **small mop bucket** (xô lau nhà) with a wet mop leaning against the wall (cartoon chunky yellow mop in blue bucket). **Right wall** — **brick accent wall** with **3-4 small wooden tables with 2 chairs each** (bàn ghế gỗ nhỏ) — all tables are EMPTY now (after closing), each table has **used ceramic cups** left on it (cartoon chunky cups with leftover coffee residue), a few **crumpled napkins**. A **small standing menu board** with generic cartoon coffee illustrations. **Floor** — **polished warm-wood floor** with subtle plank lines stretching toward the back wall, the warm Edison bulbs creating golden pools of light. A **wet floor sign** (biển cảnh báo sàn ướt) in cartoon yellow. NO people, NO characters, NO sprites, NO DOORWAY, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH.

> **Lighting**: warm Edison bulbs casting small golden pools + cool blue moonlight through front glass + warm espresso machine glow from back wall — **cozy lonely late-night coffee shop after-closing atmosphere in kawaii cartoon style, dim but warm, EVERY part of the shop visible and lit**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE**, **background image ONLY, no characters**.

---

## 📍 BG 5 — ĐƯỜNG PHỐ THÀNH PHỐ BAN ĐÊM (TRƯỚC QUÁN CÀ PHÊ)

### 📄 `c3_bg_city_street_night_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `narrator` tĩnh — Tí bước ra khỏi quán cà phê sau ca làm đêm, đi bộ về phòng trọ
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Đường phố thành phố ban đêm. Tí vừa tan ca làm thêm đêm 24h, bước ra khỏi quán cà phê, đi bộ về phòng trọ trong đêm khuya. Dùng cho:
- Narrator tĩnh: Tí đi bộ một mình giữa đêm thành phố, ánh đèn neon phản chiếu trên mặt đường ướt

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (BG kawaii cartoon environment — BUSY URBAN VIETNAMESE CITY STREET AT NIGHT, Studio Ghibli urban-night aesthetic)**:
> **WIDE-ANGLE EXTERIOR STREET SHOT, NO WINDOW FRAME, NO DOOR FRAME BORDER** — Imagine a **wide-angle lens placed on the sidewalk at ~165cm eye height**, looking down a busy Vietnamese urban street at night. **The camera is OUTSIDE in the open air, NOT looking through a window or door** — there is **NO window frame, NO doorframe, NO arch, NO rectangular framing visible anywhere**. **Image is FULL-BLEED EDGE-TO-EDGE**. **Environment rendered in cute kawaii cartoon style with COZY URBAN NIGHTLIT atmosphere — DETAIL-DENSE, neon-lit, busy but lonely at this hour**: **Sky (upper portion of frame, edge-to-edge)** — deep blue-purple night sky with a few small cartoon stars and a small crescent moon, NO bright moon, warm orange glow from street lights on the clouds. **Ahead (center of frame)** — **down a long urban street** stretching into the distance with subtle perspective lines, **bright cartoon neon signs** in Vietnamese stacked on building facades ("CÀ PHÊ", "PHỞ", "BÁNH MÌ", "TIỆM VÀNG" — generic cartoon glowing signs in pink/cyan/yellow, THIS IS THE ONLY TEXT, bubbly cartoon Vietnamese letters). A few **small motorbikes** (xe máy) parked along the sidewalk. **Behind the camera (foreground)** — a small **coffee shop entrance** (cửa quán cà phê — just closed) with warm yellow light spilling out from inside (suggesting Tí just walked out), a small hanging "CLOSED" sign. **Left side of frame** — **tall urban building facades** in warm pastel cartoon colors (cream, peach, mint) with rows of small lit windows (some warm yellow, some dark), a **few small trees** in dark-green cartoon crowns planted along the sidewalk. **Right side of frame** — **more building facades** with bright neon shop signs, a small **bún đậu mắm tôm** stall closed with shutters down, a few **small parked bicycles**. **Ground** — warm asphalt street in soft dark-gray cartoon style, slightly wet reflecting the neon signs (kawaii reflections of pink/cyan on the wet asphalt), subtle perspective lines stretching toward the distance. **A few tiny blurred background pedestrians** (very small, very blurred, purely decorative) walking far away. NO main characters (NO Tí) in this image.

> **Lighting**: bright neon signs (pink/cyan/yellow) + warm street lamp pools + dark deep-blue-purple night sky + soft neon reflections on wet asphalt — **cozy busy urban Vietnamese night atmosphere in kawaii cartoon style, lonely but atmospheric**.

> **Aspect ratio**: 16:9 widescreen, **background image ONLY, no characters**.

---

# 🎬 PHẦN B — SCENE (COMPOSITE) — CÓ NHÂN VẬT TRONG ẢNH

> **SCENE = ảnh toàn cảnh 16:9** đã có nhân vật hành động trong ảnh.
> Dùng cho: `narrator` scene — engine KHÔNG ghép sprite, nhân vật đã có sẵn.
>
> **Style**: **CHÍNH XÁC** giống portrait sprite — kawaii 2D cartoon (head-to-body 1:2.5, huge eyes, thick outlines, cel-shading, soft blush). Background environment cũng phải là kawaii cartoon style y hệt (không realistic, không semi-realistic).
>
> **⚠️ CRITICAL**: Nhân vật trong SCENE dùng **style kawaii portrait** (head-to-body 1:2.5, huge eyes, thick outlines) — không phải realistic figure, không cinematic. Background cũng phải là kawaii cartoon environment.
>
> **⚠️ MỖI PROMPT SCENE DƯỚI ĐÂY TỰ CHỨA ĐẦY ĐỦ**: Style token + Character reference (đầy đủ hex color, face, body, outfit) + Setting + Bối cảnh cốt truyện + Aspect ratio. Copy nguyên khối là dùng được, không cần tra cứu thêm ở đâu khác.

---

## 📍 SCENE 1 — SPLIT-SCREEN: CHỌN PHÒNG TRỌ

### 📄 `c3_bg_split_room_choice.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene mở đầu chương 3 — Tí đứng giữa 2 lựa chọn phòng trọ (đắt trung tâm vs rẻ ngoại ô)
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Scene 4.1: Chọn vị trí sinh sống. Tí bước vào ĐH, đứng giữa 2 lựa chọn: phòng trọ studio 16m² đắt đỏ ở trung tâm thành phố (gần trường, gần chỗ làm, đắt), hoặc phòng trọ rẻ ngoại ô (rẻ hơn nhiều nhưng xa, ẩm thấp, cô đơn). Tí cầm 2 tờ flyer, đứng giữa 2 cánh cửa, mồ hôi chảy.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c3_ti_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 19t; **CHỈ** thêm expression worried)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 19t có da ngăm thiếu nắng với dark circles rõ rệt, KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 19t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 19-YEAR-OLD UNIVERSITY STUDENT — natural facial proportions, not a 16-year-old teen, not a 13-year-old kid, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose shape, lip style, face proportions 1:1 from the reference. KHÔNG dùng reference `c3_ti_neutral.png` từ bible vì đó là style khác (tóc layer dài + áo xám). CHỈ dùng `c2_ti_dorm_neutral.png` (Tí 16t mặc thun trắng + short navy + tóc ngắn gọn vuốt nhẹ sang bên) + thêm dark circles + giữ y chang đồ.** **CRITICAL anti-distortion: face proportions stay NORMAL** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet. ⭐ DO NOT CROP THE CHARACTER — TÍ MUST SHOW FULL HEAD TO FULL FEET INSIDE THE 16:9 FRAME.**
>
> **Setting (kawaii cartoon environment + 1 character — SPLIT-SCREEN COMPARISON OF TWO RENTAL APARTMENTS, Studio Ghibli urban-decision aesthetic)**:
> **⭐⭐⭐ SPLIT-SCREEN COMPOSITION**: Frame is divided by a **glowing vertical divider line** (warm golden glow running down the center of the frame) into **LEFT HALF** and **RIGHT HALF**.
>
> **LEFT HALF (warm neon evening — central city studio)**: **A small but clean modern studio apartment (16m²) in central city** rendered in kawaii cartoon style with WARM NEON EVENING LIGHTING. Details: **big floor-to-ceiling window** overlooking a busy intersection with cartoon motorbikes, **bright neon signs in Vietnamese** ("CÀ PHÊ", "PHỞ") glowing in pink/cyan/yellow, **polished warm-cream tile floor**, **compact single bed** with pale-blue blanket, **study desk with open laptop** glowing green. Lighting: warm neon evening light from window spilling into the room.
>
> **RIGHT HALF (flat gray daylight — outer suburb cheap room)**: **A worn-out room in outer suburbs** rendered in kawaii cartoon style with FLAT GRAY DAYLIGHT LIGHTING. Details: **peeling yellow paint** revealing bare concrete, **cracked wall**, **small dusty window** with view of **empty fields** and **old rusty warehouses** in the distance (drawn as kawaii silhouettes), **stained concrete floor**, **large thin mattress on the floor** (NO bed frame), **basic wooden desk** with stacked cartoon textbooks. Lighting: flat gray cold daylight from window.
>
> **⭐ TÍ STANDS CENTER-FOREGROUND, straddling both sides, in front of the glowing vertical divider line. Tí is the focal point of the frame.**
>
> **Character — Tí (CENTER-FOREGROUND, standing in front of the divider)**: **a 19-year-old Vietnamese boy named Tí, height 178cm (cao HƠN 16t 8cm, GẦY hơn rõ rệt — visible bony wrists, collarbone, narrow shoulders, thin wiry build)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1 — ảnh Tí 16t mặc thun trắng + short navy + sneaker trắng + tóc đen gọn vuốt nhẹ sang bên): **pale skin (hex #f0e0d0, da trắng sáng sạch, GIỮ y hệt reference 16t)**, **prominent dark circles under eyes (THÊM MỚI — visible smudgy purple-gray shading from university stress)** (visible smudgy purple-gray shading, NOT cosmetic, this is tiredness from exam stress), **short neat pitch-black hair NGẮN gọn gàng vuốt nhẹ sang một bên tự nhiên (GIỮ NGUYÊN kiểu tóc 16t — KHÔNG đổi sang layer dài, KHÔNG shaggy, KHÔNG messy wild)**, **slim oval face shape (mặt dài thanh, GIỮ NGUYÊN)**. **Outfit — KHÁC 16t (sinh viên ĐH)**: light gray short-sleeve t-shirt (hex #d0d0d0, plain gray cotton tee with ROUND crew neckline — ĐỔI từ trắng 16t sang xám), light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, knee-length — KHÁC navy 16t), simple white sneakers (hex #f0f0f0, GIỮ NGUYÊN giày 16t). ⛔ KHÔNG mặc áo trắng + short navy như 16t. **OVER-EAR BLACK HEADPHONES đeo quanh cổ** + **LAPTOP peeking từ balo**. **big black laptop backpack (hex #2a2a2a) on both shoulders** (balo to kiểu sinh viên ĐH, to hơn balo học sinh cấp 3). **STANDING UPRIGHT** (NOT sitting, NOT crouching), body slightly turned in 3/4 angle so he faces partly to LEFT and partly to viewer, **his RIGHT hand holding a small symbolic cartoon rental flyer** (a generic stylized rectangle with cartoon text — generic placeholder, NOT real text), **his LEFT hand holding ANOTHER small symbolic cartoon rental flyer** (different rectangle, generic placeholder, contrasting the 2 choices), expression: **WORRIED SWEATING NERVOUS — eyes wide and darting between LEFT and RIGHT halves of frame** (eyes moving side to side, NOT staring at viewer), eyebrows raised in worry, small "uh..." mouth, **3 small cartoon sweat drops** on his forehead + temples + cheek (multiple stress drops), **2 small cartoon dizzy spiral symbols** floating near his head (small kawaii spirals — decision paralysis), blush circles very faded (stress drains color). Face proportions STAY NORMAL 19-year-old proportions — do NOT enlarge head, do NOT stretch face, do NOT bug-eye out the eyes even in stress.
>
> **Lighting**: LEFT side warmer neon evening light (pink/cyan/yellow from signs), RIGHT side flat cold gray daylight — **split personality atmosphere in kawaii cartoon style**, divider line glowing warm gold.
>
> **Aspect ratio**: 16:9 cinematic widescreen. **Tí FULLY VISIBLE FROM HEAD TO TOE in center foreground (~30% of frame width, ~60-70% of frame height), 2 rental environments visible in LEFT and RIGHT halves of frame, glowing vertical divider line in center. NO CROPPING.**
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match the uploaded reference photo `c2_ti_dorm_neutral.png` (face shape, eye style, hair color NGẮN GỌN VUỐT NHẸ SANG BÊN, skin tone pale white sạch, dark circles mới thêm). Do NOT redesign the face. Do NOT change hair to messy/wild (GIỮ NGUYÊN tóc ngắn gọn 16t). Do NOT remove dark circles (ĐÃ THÊM dark circles ở 19t). Do NOT change skin tone to tan/dark (GIỮ da trắng sạch như 16t). Do NOT wear different clothes (GIỮ NGUYÊN áo thun xám (hex #d0d0d0) + quần jeans xanh (hex #3a4a5a) + sneaker trắng + balo đen to — KHÔNG đổi sang áo xám, KHÔNG đổi sang jeans). **⭐ DO NOT MAKE TÍ INTO A 16-YEAR-OLD OR 13-YEAR-OLD KID: face must look like a 19-year-old university student — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 2 — QUÁN CÀ PHÊ: TÍ LAU BÀN CUỐI CA ĐÊM

### 📄 `c3_bg_coffee_shop_late_shift.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí đang lau bàn cuối ca làm đêm ở quán cà phê, mệt mỏi nhưng vẫn cố
**Nhân vật trong ảnh**: Tí (1 người) + khách cuối (background nhỏ)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Mission/Scene 4.2: Bài toán 20 giờ — Tí làm thêm đêm 20h-24h ở quán cà phê specialty. Đã qua 23h30, khách cuối cùng đang mặc áo chuẩn bị về. Tí lau bàn cuối cùng, mắt lim dim, kiệt sức nhưng không dám nghỉ vì cần tiền.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thêm expression tired + thêm tạp dề + thêm dark circles)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 19t có da ngăm thiếu nắng với dark circles rõ rệt, KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 19t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 19-YEAR-OLD UNIVERSITY STUDENT — natural facial proportions, not a 16-year-old teen, not a 13-year-old kid, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose shape, lip style, face proportions 1:1 from the reference. KHÔNG dùng reference `c3_ti_neutral.png` từ bible vì đó là style khác (tóc layer dài + áo xám). CHỈ dùng `c2_ti_dorm_neutral.png` (Tí 16t mặc thun trắng + short navy + tóc ngắn gọn vuốt nhẹ sang bên) + thêm dark circles + giữ y chang đồ.** **CRITICAL anti-distortion: face proportions stay NORMAL** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + 1 character + tiny background — COZY LATE-NIGHT IN A VIETNAMESE COFFEE SHOP, Studio Ghibli worker-lonely aesthetic)**:
> Same coffee shop as `c3_bg_coffee_shop_closed_empty.png` (BG4), **rendered in kawaii cartoon style with COZY LONELY LATE-NIGHT WORK atmosphere**. The mint-green walls with small framed coffee-art prints. The long wooden bar counter with espresso machine, ceramic mugs, cash register. The brick accent wall with small wooden tables. Edison bulbs casting warm golden pools. The front glass showing dark urban night outside. The mop bucket in the corner. **A 19-year-old Vietnamese boy (Tí), height 178cm (cao HƠN 16t 8cm, GẦY hơn rõ rệt — visible bony wrists, collarbone, narrow shoulders, thin wiry build)** standing in the CENTER of the frame at a small wooden table, **wiping the table with a wet gray rag** in one hand (cartoon kawaii rag, NOT realistic stained rag), his body slightly hunched forward from fatigue, his **other hand resting on the table edge for support**. **Outfit — KHÁC 16t (sinh viên ĐH làm thêm đêm)**: light gray short-sleeve t-shirt (hex #d0d0d0, ĐỔI từ trắng 16t), light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, KHÁC navy 16t), **dark-blue half-apron (hex #2a3a5a) tied at his waist over his t-shirt** (THIS IS THE KEY ITEM — barista apron), simple white sneakers (hex #f0f0f0, GIỮ NGUYÊN giày 16t), his **big black laptop backpack (hex #2a2a2a) on the floor next to him** (NOT on his back — he put it down while working). His **hair is slightly messy from the long shift** (just slightly disheveled, NOT wildly messy, NOT bedhead — small flyaways showing he's been working hard, VẪN GIỮ tóc ngắn gọn vuốt nhẹ sang bên như 16t chỉ thêm vài sợi nhỏ lệch), **dark circles under eyes even MORE prominent** (purple-gray shading, deepened from exhaustion, GIỮ da trắng sáng sạch như 16t hex #f0e0d0). Expression: **EXHAUSTED DROWSY OVERWORKED** — eyes half-closed with droopy eyelids (eyelids half-lowered, NOT closed, NOT sleeping, NOT yawning wide), eyebrows slightly raised in tired surprise, mouth in a small flat line (small horizontal line, NOT frowning, NOT yawning), **3 small cartoon sweat drops** on his forehead + temples + cheek (long-shift fatigue), **1 small cartoon tear drop** in the corner of his left eye (1 single small tear, NOT multiple, NOT crying), blush circles very faded. **NO kawaii blush circles on cheeks**. Face proportions STAY NORMAL. He looks like a **university student barista at the END of a 4-hour shift**, exhausted but holding on. **In the BACKGROUND (small, blurred, far in the back near the front door)**: 1 tiny **last customer** (very small, ~25-30% of Tí's height, kawaii cartoon figure) putting on their jacket near the door, drawn as cute chunky cartoon figure with thick outlines (no need for reference — just decorative). A few used ceramic cups left on other tables. The **wet floor sign** (biển cảnh báo sàn ướt) cartoon yellow.
>
> **Lighting**: warm Edison bulb pools + cool blue moonlight through front glass + dim warm espresso machine glow — **cozy lonely late-night coffee shop worker-tired atmosphere in kawaii cartoon style**.
>
> **Aspect ratio**: 16:9 cinematic widescreen. **Tí FULLY VISIBLE FROM HEAD TO TOE in CENTER (~30-40% of frame width, ~55-70% of frame height), tiny last customer visible in background (~25-30% of Tí's height), full coffee shop BG visible behind, NO CROPPING.**
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match the uploaded reference photo `c2_ti_dorm_neutral.png` (face shape, eye style, hair color NGẮN GỌN VUỐT NHẸ SANG BÊN, skin tone da trắng sáng sạch pale). Do NOT redesign the face. Do NOT change hair to wildly messy (GIỮ tóc ngắn gọn 16t). Do NOT remove dark circles (THÊM dark circles ở 19t). Do NOT change skin tone to tan/dark (GIỮ da trắng sạch 16t). Do NOT wear different clothes from what is described above (GIỮ áo thun xám (hex #d0d0d0) + quần jeans xanh (hex #3a4a5a) + sneaker trắng + tạp dề xanh — KHÔNG đổi sang áo xám, KHÔNG đổi sang jeans). **⭐ DO NOT MAKE TÍ INTO A 16-YEAR-OLD OR 13-YEAR-OLD KID: face must look like a 19-year-old university student — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 4 — PHÒNG TRỌ RẺ: BÃO GIÁ CUỐI THÁNG

### 📄 `c3_bg_dorm_cheap_end_of_month.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí ngồi trên nệm mỏng giữa đống tô mì trống, đếm tiền cuối tháng không đủ
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Scene 4.4: Bão giá cuối tháng. Tí về phòng trọ rẻ ngoại ô, ngồi trên nệm mỏng giữa đống tô mì ăn liền đã ăn hết, đếm lại số tiền còn lại trong tháng → không đủ trả tiền trọ + điện nước + ăn uống. Bụng réo vì cả ngày chỉ ăn mì gói.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thêm expression sad/horrified + dark circles)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 19t có da ngăm thiếu nắng với dark circles rõ rệt, KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 19t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 19-YEAR-OLD UNIVERSITY STUDENT — natural facial proportions, not a 16-year-old teen, not a 13-year-old kid, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose shape, lip style, face proportions 1:1 from the reference. KHÔNG dùng reference `c3_ti_neutral.png` từ bible vì đó là style khác (tóc layer dài + áo xám). CHỈ dùng `c2_ti_dorm_neutral.png` (Tí 16t mặc thun trắng + short navy + tóc ngắn gọn vuốt nhẹ sang bên) + thêm dark circles + giữ y chang đồ.** **CRITICAL anti-distortion: face proportions stay NORMAL** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + 1 character — DESPERATE CRAMPED RENTAL ROOM END OF MONTH, Studio Ghibli despair-financial-anxiety aesthetic)**:
> Same cheap rundown rental room as `c3_bg_dorm_cheap_empty.png` (BG2), **rendered in kawaii cartoon style with COLD DESPERATE FINANCIAL ANXIETY atmosphere**. The peeling yellow paint. The single thin mattress on the floor (no bed frame). The basic wooden desk. The cracked wall. The dusty window showing dark urban night outside. The single dim bulb casting weak yellow light. The cold blue moonlight through window. The small broken reading lamp. **A 19-year-old Vietnamese boy (Tí), height 178cm (cao HƠN 16t 8cm, GẦY hơn rõ rệt — visible bony wrists, collarbone, narrow shoulders, thin wiry build)** sitting **CROSS-LEGGED on the thin mattress in the CENTER of the frame**, surrounded by **4-5 empty instant-noodle bowls** stacked beside him (cartoon chunky foam bowls with chopsticks stuck in them — kawaii ký hiệu "ăn mì liên tục"), a few **crumpled paper bills** scattered on the mattress around him, a **small electric meter box** on the wall behind him with red glowing display. **Outfit — KHÁC 16t (sinh viên ĐH ở nhà)**: light gray short-sleeve t-shirt (hex #d0d0d0 — ĐỔI từ trắng 16t, slightly wrinkled from wearing all day), light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, KHÁC gym shorts cũ), simple white sneakers (hex #f0f0f0 — GIỮ NGUYÊN giày 16t), his **big black laptop backpack (hex #2a2a2a) on the floor beside him** (open, empty — he already took out the laptop). **OVER-EAR BLACK HEADPHONES (tai nghe chụp đầu đen) để bên cạnh**. **LAPTOP open trên đùi hoặc trên bàn**. His **hair is slightly messier now** (slightly disheveled from stress, NOT wildly messy, NOT bedhead — VẪN GIỮ kiểu tóc ngắn gọn vuốt nhẹ sang bên 16t chỉ thêm vài sợi lệch), **skin GIỮ NGUYÊN pale white (hex #f0e0d0) — KHÔNG ngăm đi, KHÔNG tanned**, **dark circles DEEPER** (purple-gray shading very visible, THÊM MỚI so với 16t). His **both hands are holding a single crumpled symbolic cartoon paper money bill** (generic stylized green rectangle representing money — NO real Vietnamese dong, NO portraits, NO flags, just a generic chunky green cartoon bill with placeholder number), holding it up in front of his chest, eyes staring at it in HORROR. Expression: **HORRIFIED SHOCKED FINANCIAL PANIC** — eyes WIDE and staring at the money bill (normal kawaii size, NOT bug-eyed, NOT distorted), eyebrows raised HIGH in fear, **small open "O" mouth** (small, NOT gaping wide, NOT horror scream — a quiet "oh no..." gasp), **3 small cartoon sweat drops** on his forehead + temples, **2 small cartoon dizzy/panic symbols** floating near his head (small kawaii spirals), **NO kawaii blush circles on cheeks**, **face slightly pale** (paler than usual from stress/anxiety — visible paler shading under eyes and around mouth). Face proportions STAY NORMAL — do NOT enlarge head, do NOT stretch face, do NOT bug-eye out the eyes even in shock.
>
> **Behind Tí**: **a few empty stacked bowls** (4-5 cartoon chunky foam bowls with chopsticks) on the floor next to the mattress, a **crumpled receipts** pile, the **electric meter box on the wall with red glowing numbers** (visible behind Tí, slightly out of focus), the **broken reading lamp** on the desk (no light), the **tattered curtain** over the dusty window (drawn by cool blue moonlight). NO DOORWAY, NO DOORFRAME BORDER.
>
> **Lighting**: single dim bulb casting weak warm pool + cold blue moonlight through window — **sad lonely desperate end-of-month financial-anxiety atmosphere in kawaii cartoon style, dim and cold**.
>
> **Aspect ratio**: 16:9 cinematic widescreen. **Tí FULLY VISIBLE FROM HEAD TO TOE sitting on mattress in CENTER (~30-40% of frame width, ~55-70% of frame height), 4-5 empty noodle bowls visible, electric meter visible behind, full cheap rental room BG visible, NO CROPPING.**
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match the uploaded reference photo `c2_ti_dorm_neutral.png` (face shape, eye style, hair color NGẮN GỌN VUỐT NHẸ SANG BÊN, skin tone da trắng sáng sạch pale). Do NOT redesign the face. Do NOT change hair to wildly messy (GIỮ tóc ngắn gọn 16t). Do NOT remove dark circles (THÊM dark circles ở 19t). Do NOT change skin tone to tan/dark (GIỮ da trắng sạch 16t). Do NOT wear different clothes from what is described above (ở nhà: áo thun xám + quần jeans xanh nhạt + sneaker trắng + balo đen to — KHÔNG đổi sang áo trắng). **⭐ DO NOT MAKE TÍ INTO A 16-YEAR-OLD OR 13-YEAR-OLD KID: face must look like a 19-year-old university student — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 5 — HÀNH LANG TRỌ: TÍ ĐỐI MẶT CHỦ TRỌ VỀ HÓA ĐƠN ĐIỆN NƯỚC

### 📄 `c3_bg_dorm_hallway_electric_bill.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí đứng trong hành lang trọ, đối mặt với Chủ trọ đang giơ hóa đơn điện nước cuối tháng đòi tiền
**Nhân vật trong ảnh**: Tí + Chủ trọ (2 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 3 — Life Event Scene 4.5: Hóa đơn điện nước. Cuối tháng, Chủ trọ đứng ở hành lang chung cạnh công tơ điện, giơ hóa đơn điện nước (số tiền lớn vì Tí bật quạt + bật đèn làm bài khuya), đòi Tí trả ngay. Tí vừa bước ra khỏi phòng, mặt tái, mở ví lật ngược ra — bên trong chỉ còn vài tờ tiền lẻ.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c3_ti_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 19t; **CHỈ** thêm expression panicked)
- **Chủ trọ**: upload `c3_chutro_angry.png` làm reference (giữ y hệt khuôn mặt + tóc + áo bà ba + style; **CHỈ** thêm pose pointing)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 19t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face proportions stay NORMAL across ALL characters.** **CRITICAL framing rule: the FULL CHARACTERS must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — characters occupy roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet. ⭐ DO NOT CROP THE CHARACTERS — BOTH TÍ AND CHỦ TRỌ MUST SHOW FULL HEAD TO FULL FEET INSIDE THE 16:9 FRAME.**
>
> **Setting (kawaii cartoon environment + 2 characters — TENSE DAYTIME IN A SHARED RENTAL HALLWAY, ELECTRIC BILL CONFRONTATION, Studio Ghibli urban-drama aesthetic)**:
> Same shared rental hallway as `c3_bg_dorm_hallway_meter_empty.png` (BG3), **rendered in kawaii cartoon style with TENSE CONFRONTATIONAL DAYTIME DRAMA atmosphere**. The narrow concrete-painted corridor. The 3 closed wooden doors on the left wall with small numbered plates. The narrow wooden bench. The **electric meter box** on the right wall with red glowing numbers. The single bare fluorescent tube casting cool white light. The barred window at the end of the hallway letting in harsh daylight. A few paired cartoon sandals lined up against the wall. NO DOORWAY, NO DOORFRAME BORDER.
>
> **⭐ BOTH CHARACTERS STAND IN THE HALLWAY (CENTER OF FRAME), facing each other in tense confrontation. Tí on the RIGHT side of frame (viewer's left), Chủ trọ on the LEFT side of frame (viewer's right). The electric meter box is between them on the right wall behind Chủ trọ. The end window with harsh daylight is in the far background.**
>
> **Character 1 — Tí (RIGHT side of frame, viewer's left, FACING Chủ trọ)**: **a 19-year-old Vietnamese boy named Tí, height 178cm (cao HƠN 16t 8cm, GẦY hơn rõ rệt — visible bony wrists, collarbone, narrow shoulders, thin wiry build)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1 — ảnh Tí 16t mặc thun trắng + short navy + sneaker trắng + tóc đen gọn vuốt nhẹ sang bên): **pale skin (hex #f0e0d0 — da trắng sáng sạch, GIỮ y hệt reference 16t)**, **prominent dark circles under eyes (THÊM MỚI — visible smudgy purple-gray shading showing he's tired from university + working late)** (very visible now from accumulated stress), **short neat pitch-black hair NGẮN gọn gàng vuốt nhẹ sang một bên tự nhiên (GIỮ NGUYÊN kiểu tóc 16t — KHÔNG đổi sang layer dài, KHÔNG shaggy, KHÔNG messy wild)** (slightly disheveled from stress), **slim oval face shape (mặt dài thanh, GIỮ NGUYÊN)**. **Outfit — KHÁC 16t (sinh viên ĐH, TÓC SIDE PART)**: light gray short-sleeve t-shirt (hex #d0d0d0 — ĐỔI từ trắng 16t), light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, KHÁC navy 16t), simple white sneakers (hex #f0f0f0 — GIỮ NGUYÊN giày 16t), **OVER-EAR BLACK HEADPHONES đeo quanh cổ**, **big black laptop backpack (hex #2a2a2a) on his back**. (he just walked out of his room — balo to hơn balo học sinh cấp 3 vì đi ĐH). **STANDING UPRIGHT** but body slightly turned 3/4 away from viewer facing Chủ trọ, **his LEFT hand on his backpack strap nervously**, **his RIGHT hand holding his opened wallet INSIDE-OUT in front of him** (the wallet is flipped open showing it's nearly EMPTY, only 1-2 small crumpled symbolic cartoon paper bills inside, generic stylized green rectangles — NO real Vietnamese dong, NO portraits), the bills visibly thin/few. Expression: **PANICKED SWEATING MORTIFIED** — eyes wide and worried, eyebrows raised in worry, small worried "..." mouth (small downturned, NOT gaping), **3 small cartoon sweat drops** on his forehead + temples + cheek, **NO kawaii blush circles on cheeks**, slight paler skin from embarrassment, slight trembling in posture. Face proportions STAY NORMAL.
>
> **Character 2 — Chủ trọ (LEFT side of frame, viewer's right, FACING Tí, standing next to the electric meter box)**: **a 50-year-old Vietnamese woman (chủ trọ — landlady), height 155cm** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE `c3_chutro_angry.png`** (copy 1:1): **stout chubby mature build**, **warm medium-tan rustic northern-Vietnamese skin (hex #c89878, now slightly FLUSHED reddish from anger)**, **short curly black hair with a few silver strands reaching shoulder-length (slightly disheveled from agitation)**, **small mole on right cheek**, **kind round face with soft double chin (now with puffed cheeks from scolding)**. Outfit: **floral-patterned áo bà ba (hex base #4a3a2a with small flower pattern in red/pink/yellow)**, **loose dark-brown canvas pants (hex #4a3a2a)**, **white Vietnamese rubber "tổ ong" sandals (hex #f0f0f0)**, **small gold earrings**. **STANDING UPRIGHT** with body slightly turned 3/4 toward Tí, **LEFT hand on her hip** (authority pose), **RIGHT hand holding out a paper bill** (small cartoon chunky paper bill — generic stylized, NO real text, NO real money design — just a generic rectangle with cartoon handwritten numbers placeholder) toward Tí accusatorily, **other hand pointing at the electric meter box with her index finger** (pointing at the meter, scolding). Expression: **ANGRY SCOLDING — full scolding mode** (matching `c3_chutro_angry.png`): eyebrows drawn down HARD and together, eyes narrowed sharp glaring, mouth WIDE OPEN shouting (open mouth showing teeth, mature scolding shout, ~50% open), **2-3 cartoon anger vein marks** on her forehead, **1 cartoon anger symbol** (#) floating near her head, cheeks puffed. Face proportions STAY NORMAL adult woman — NOT giant kawaii eyes, NOT chibi.
>
> **Lighting**: harsh cool daylight streaming through end window + single cool fluorescent tube + red glow from electric meter box — **tense confrontational financial-drama daytime hallway atmosphere in kawaii cartoon style**.
>
> **Aspect ratio**: 16:9 cinematic widescreen. **⭐ BOTH CHARACTERS FULLY VISIBLE FROM HEAD TO TOE: Tí on RIGHT (~30% of frame width), Chủ trọ on LEFT (~25-30% of frame width), electric meter visible behind Chủ trọ, end window visible in background, NO CROPPING.**
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Both characters MUST closely match the uploaded reference photos (face shape, eye style, hair color, hair style, skin tone, blush). Do NOT redesign the face. Do NOT change eye color. Do NOT change hair color. Do NOT add messy/wild hair to Tí (GIỮ NGUYÊN tóc ngắn gọn 16t). Do NOT remove dark circles from Tí. **⭐ DO NOT CHANGE TÍ'S OUTFIT**: Tí phải mặc đồ sinh viên ĐH (áo thun xám + quần jeans xanh nhạt + sneaker trắng + balo đen to) — KHÔNG mặc đồ 16t. **⭐ DO NOT MAKE TÍ INTO A 16-YEAR-OLD OR 13-YEAR-OLD KID: Tí's face must look like a 19-year-old university student — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png` (chỉ thêm dark circles + da ngăm hơn 1 chút).** Kawaii 2D cartoon style but FACES MUST REMAIN RECOGNIZABLE FROM REFERENCE.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 BẢNG TỔNG HỢP

## Tất cả BG (không nhân vật) — 5 file

| # | Filename | Địa điểm | Thời gian | Loại scene VN | Dùng cho cốt truyện | Aspect |
|---|---|---|---|---|---|---|
| BG1 | `c3_bg_dorm_studio_empty.png` | Phòng trọ studio 16m² TT | Tối | `dialogue` | Scene 4, 5 (Tí nội tâm về tiền) | 16:9 |
| BG2 | `c3_bg_dorm_cheap_empty.png` | Phòng trọ rẻ ngoại ô | Tối | `dialogue` | Scene 4 (bão giá cuối tháng) | 16:9 |
| BG3 | `c3_bg_dorm_hallway_meter_empty.png` | Hành lang trọ (công tơ điện) | Ban ngày | `dialogue` | Scene 5 (đòi tiền điện nước) | 16:9 |
| BG4 | `c3_bg_coffee_shop_closed_empty.png` | Quán cà phê sau đóng cửa | Tối muộn | `dialogue` | Scene 2 (Tí + Chủ quán cuối ca) | 16:9 |
| BG5 | `c3_bg_city_street_night_empty.png` | Đường phố thành phố | Đêm | `narrator` tĩnh | Scene 2 (Tí đi bộ về trọ) | 16:9 |

## Tất cả SCENE (có nhân vật) — 4 file

| # | Filename | Địa điểm | Nhân vật | Loại scene VN | Dùng cho cốt truyện | Aspect |
|---|---|---|---|---|---|---|
| SC1 | `c3_bg_split_room_choice.png` | Split-screen 2 phòng trọ | Tí | `narrator` | Scene 4.1 (chọn phòng) | 16:9 |
| SC2 | `c3_bg_coffee_shop_late_shift.png` | Quán cà phê cuối ca đêm | Tí + khách cuối | `narrator` | Scene 4.2 (làm thêm đêm) | 16:9 |
| SC4 | `c3_bg_dorm_cheap_end_of_month.png` | Phòng trọ rẻ cuối tháng | Tí | `narrator` | Scene 4.4 (bão giá) | 16:9 |
| SC5 | `c3_bg_dorm_hallway_electric_bill.png` | Hành lang trọ | Tí + Chủ trọ | `narrator` | Life Event 4.5 (hóa đơn điện nước) | 16:9 |

> 📌 **Lưu ý**: Scene 4.3 (Trò chơi Lọ thủy tinh) là UI mockup 1:1 — **KHÔNG có trong file này**, được gen riêng theo prompt riêng trong `image-generation-bible.md` mục Scene 4.3.

## Tổng: 9 prompts (5 BG + 4 SCENE)

---

# 🔑 QUY TẮC STYLE BẮT BUỘC

> **⚠️ MỌI prompt trong file này phải tuân theo quy tắc dưới đây — vi phạm sẽ ra ảnh sai art style.**

### Về STYLE TOKEN
- **BẮT BUỘC** dùng full kawaii 2D style token trong MỌI prompt (BG + SCENE)
- **BẮT BUỘC** thêm block **Anti-distortion CRITICAL + Framing rule** vào MỌI prompt (xem đầu file)
- **NOT** realistic, semi-realistic, cinematic-photorealistic, anime-background, 3D, Pixar
- **NOT** high-detail realistic skin, realistic textures, photographic backgrounds

### Về SETTING (mô tả environment)
- Environment phải được mô tả bằng **ngôn ngữ kawaii cartoon**: "simple chunky rectangles", "cute wavy green lines", "soft brown texture dots", "tiny cartoon chickens"
- **KHÔNG** dùng ngôn ngữ realistic: "photorealistic brick wall", "weathered texture", "depth of field", "bokeh", "cinematic lighting ratio"

### Về NHÂN VẬT trong SCENE
- Mỗi prompt SCENE đã **TỰ CHỨA ĐẦY ĐỦ** character reference — copy là chạy, không cần tra cứu
- **Tí 19t**: dùng character reference từ chương 2 `c2_ti_dorm_neutral.png` (Tí 16t mặc thun trắng + short navy + sneaker trắng + tóc đen gọn vuốt nhẹ sang bên) — **height 178cm (cao hơn 16t 8cm) + visibly THINNER and LEANER build (gầy hơn rõ rệt) + áo thun xám (hex #d0d0d0) + quần jeans XANH DƯƠNG NHẠT (hex #6890c0) + sneaker trắng + tai nghe đen + laptop + balo đen to** — KHÔNG dùng reference từ `image-generation-bible.md` mục 1.3 (style khác)
- **Chủ trọ 50t**: dùng character reference từ `chuong-3-characters.md` mục `c3_chutro_neutral.png` (hoặc emotion tương ứng) — height 155cm, stout chubby, warm medium-tan rustic skin, short curly black-silver hair, floral áo bà ba, dark-brown canvas pants, white "tổ ong" sandals
- **Chủ quán cà phê 45t** (chỉ xuất hiện trong dialogue scene qua BG, không xuất hiện trong scene composite ở file này — xem `chuong-3-characters.md` để biết reference)
- **Face proportions** phải giống portrait sprite — do NOT enlarge head, do NOT stretch face trong SCENE
- **Body** dùng head-to-body 1:2.5 kawaii proportions cho tất cả nhân vật — not realistic figure proportions

### Về ASPECT RATIO
- Tất cả **BG**: 16:9 widescreen
- Tất cả **SCENE**: 16:9 cinematic
- **KHÔNG BAO GIỜ** dùng 3:4, 4:3, 1:1 cho BG/SCENE

### Về LOGIC MÀU SẮC / STYLE NHẤT QUÁN GIỮA CHƯƠNG 2 → CHƯƠNG 3
- Style kawaii phải GIỐNG HỆT chương 2 (cùng head-to-body ratio, cùng eye style, cùng outline thickness, cùng blush style)
- **Lighting tone** vẫn warm cozy — nhưng chương 3 thêm chút **urban independence + financial anxiety** (xa nhà hơn, một mình ở thành phố lớn, áp lực tiền trọ + điện nước + ca làm đêm)
- Backgrounds chương 3 có thêm **cool blue night tones** + **bright neon signs** cho các scene thành phố — đây là signature chương 3

### Về MAPPING BG ↔ scene VN (dùng trong React data)
```
[dialogue scene: Tí + Chủ trọ ở hành lang đòi tiền điện]
  type: 'dialogue'
  background: 'dorm_hallway_meter_empty'   // ← BG trống
  character: 'chutro', expression: 'angry'   // ← sprite Chủ trọ ghép lên
  characterPosition: 'left'
  // React load: BG trống + 2 sprite portrait (Tí + Chủ trọ)

[dialogue scene: Tí + Chủ quán ở quán cuối ca đêm]
  type: 'dialogue'
  background: 'coffee_shop_closed_empty'  // ← BG trống
  character: 'ti', expression: 'tired'   // ← sprite Tí ghép lên
  characterPosition: 'right'
  // React load: BG trống + 2 sprite portrait (Tí + Chủ quán)

[narrator scene: Tí ngồi trên nệm đếm tiền]
  type: 'narrator'
  background: 'dorm_cheap_end_of_month'  // ← BG composite có sẵn Tí
  // React load: BG composite ONLY (KHÔNG load sprite — đã có trong ảnh)
```

> **Quy tắc React** (tham khảo `VisualNovelPlayer.jsx` line 159-201):
> - `scene.type === 'dialogue'` → `character + expression` → load sprite + BG trống
> - `scene.type === 'narrator'` → KHÔNG load sprite, chỉ load BG (trống HOẶC composite)
> - BG composite có nhân vật trong ảnh → thêm vào `BG_HAS_CHARACTER` list (engine skip sprite)
> - BG trống → load bình thường, KHÔNG vào `BG_HAS_CHARACTER`

---

# 📌 CHECKLIST GIAO ĐỒNG ĐỘI — CHƯƠNG 3

### Phase 1 — Gen 5 BG TRỐNG (cho dialogue + narrator tĩnh)
- [ ] **Dùng STYLE TOKEN: BG TRỐNG** (16:9, NO people, NO characters)
- [ ] Gen các file:
  - [ ] `c3_bg_dorm_studio_empty.png` (phòng trọ studio 16m² trống)
  - [ ] `c3_bg_dorm_cheap_empty.png` (phòng trọ rẻ ngoại ô trống)
  - [ ] `c3_bg_dorm_hallway_meter_empty.png` (hành lang trọ có công tơ điện trống)
  - [ ] `c3_bg_coffee_shop_closed_empty.png` (quán cà phê sau đóng cửa trống)
  - [ ] `c3_bg_city_street_night_empty.png` (đường phố thành phố ban đêm trống)
- [ ] BG này KHÔNG xóa nền, lưu PNG đầy đủ 16:9

### Phase 2 — Gen 4 BG COMPOSITE (cho narrator cinematic có nhân vật)
- [ ] **Dùng STYLE TOKEN: BG COMPOSITE** (16:9, có nhân vật trong ảnh đang hành động)
- [ ] Gen các file:
  - [ ] `c3_bg_split_room_choice.png` (Tí đứng giữa 2 phòng trọ)
  - [ ] `c3_bg_coffee_shop_late_shift.png` (Tí lau bàn cuối ca đêm)
  - [ ] `c3_bg_dorm_cheap_end_of_month.png` (Tí đếm tiền cuối tháng trên nệm)
  - [ ] `c3_bg_dorm_hallway_electric_bill.png` (Tí + Chủ trọ đối mặt về hóa đơn điện nước)
- [ ] **LƯU Ý**: Khi gen Tí trong SCENE, dùng **character reference 16t** (`c2_ti_dorm_neutral.png` — Tí 16t mặc thun trắng + short navy + sneaker trắng + tóc ngắn gọn) — KHÔNG dùng `c3_ti_neutral.png` từ bible (style khác) — chỉ thêm dark circles + balo to hơn + **ĐỔI outfit**: áo thun xám (hex #d0d0d0) + quần jeans XANH DƯƠNG NHẠT (hex #6890c0) + sneaker trắng + tai nghe đen + laptop + height 178cm (cao HƠN 16t 8cm) + visibly THINNER and LEANER build
- [ ] **LƯU Ý**: Khi gen Chủ trọ trong SCENE 5, dùng **character reference mới** (`c3_chutro_angry.png` từ file `chuong-3-characters.md`) — KHÔNG có từ chương trước
- [ ] **LƯU Ý**: Style cho 19t phải dùng **earnest teen proportions** (head-to-body 1:4-1:5, medium eyes, NO blush circles, natural skin shading) — KHÔNG dùng kawaii 1:2.5 cho SCENE có nhân vật 19t (vì reference 19t đã được thiết kế theo phong cách earnest teen)
- [ ] **MỖI PROMPT SCENE copy nguyên khối ⭐⭐⭐ là dùng được** — không cần tra cứu block character reference ở đâu khác


---

## 🪧 TỔNG KẾT CHƯƠNG 3 — TỰ LẬP TỪ NHỮNG LỰA CHỌN

**Output**: `images/chuong-3/bg_tong_ket_chuong.png`
**Loại**: Tranh tổng kết biểu tượng, không nhân vật, 16:9 — 1920 × 1080.
**Dùng cho**: Nhìn lại ý nghĩa cả chương, dùng chung cho các nhánh.
**Ý nghĩa cần gợi**: Chi phí chỗ ở và đi lại; đánh đổi thời gian học/làm; phân bổ ngân sách; dòng tiền cuối tháng; hóa đơn bất ngờ.
**Thiết kế mới**: Tự lập từ những lựa chọn. Tiêu đề và câu chốt ý đặt trên khoảng giấy sáng ở giữa; các cụm đồ vật kể lại bài học nằm quanh rìa. Không dùng bảng gỗ lớn che gần hết cảnh. Đây là tranh hồi tưởng mang tính biểu tượng, không phải cảnh mới xảy ra sau nhiệm vụ cuối.

```text
Create ONE beautifully composed 16:9 full-bleed illustrated chapter-recap card, target 1920 x 1080. This is a finished visual-novel chapter reflection illustration, not a slide template or a literal continuation of the last scene.

STYLE: Hand-drawn 2D Vietnamese everyday-life storybook illustration, consistent with the established earnest slice-of-life game art: medium-thickness softly colored outlines, soft flat cel-shading with gentle gradients, subtle watercolor-paper grain, carefully simplified tangible objects, restrained warm natural light. Delicate edges, readable silhouettes, atmospheric depth, polished art direction. No photorealism, 3D, glossy vector clipart, giant cartoon faces or hyper-cute styling. NO people, character sprites, silhouettes, hands or human reflections.

CHAPTER MEANING: A gently curved city route connects student living, limited time and a monthly budget; a calm learning recap rather than a stressful bill collection scene. The lesson is: Chi phí chỗ ở và đi lại; đánh đổi thời gian học/làm; phân bổ ngân sách; dòng tiền cuối tháng; hóa đơn bất ngờ. This meaning is visual direction; do not render that explanatory sentence as text.

COLOR STORY: paper cream #f2e9d9, muted city blue #667f9b, warm amber #c99c65 and soft eucalyptus #8ca295. Use cream for most of the image, two main supporting hues, and only small warm accents. Richer colors belong to the outer object groups; central text sits against a quiet light field.

CUSTOM ILLUSTRATED MOTIFS AND PLACEMENT: LOWER LEFT: two small house-shaped rental-room miniatures of equal visual dignity beside a simple unbranded bus, symbolizing location versus commuting time; neither option is checked or highlighted. UPPER LEFT: a small clock with simple hands but no numerals, a study book and a plain cafe cup, arranged as a balanced group representing time shared between work and study. LOWER RIGHT: four transparent budgeting jars with different restrained colors and no labels, containing only a few abstract coin discs without readable denominations; a pencil and blank planner sit beneath. UPPER RIGHT: an unmarked utility bill beside a small household electricity meter, soft and understated, recalling an unexpected expense. Keep food and books present, never glamorize deprivation.

BACKGROUND AND ATMOSPHERE: A distant low-contrast city skyline and restrained window-grid shapes only along the far outer edge; a thin warm curved bus-route-like line connects the groups below the title, with no map labels or route numbers.

COMPOSITION: One coherent illustration, not a grid or a set of cards. Arrange the specified object groups as an asymmetrical but balanced open wreath around a large central breathing space. Keep ALL objects outside the central text zone, approximately x=20-80% and y=28-65% of the canvas. Let the lower objects anchor the image, with lighter smaller accents above. Objects have consistent perspective and gentle contact shadows; no floating dashboard icons. Keep secondary details sparse, three depth levels at most. The light center has a soft irregular paper wash integrated into the artwork, NOT a rectangular parchment plaque, wooden sign, bordered box, ribbon banner or physical board. No hard frame around the image.

TEXT HIERARCHY AND EXACT VIETNAMESE COPY: Center-align the following three lines as one group, vertically centered around 46% of canvas height.
Line 1, modest chapter eyebrow, approximately 40 px at 1920 x 1080:
Tổng kết chương 3
Line 2, main meaning title, approximately 76 px, the largest text:
Tự lập từ những lựa chọn
Line 3, supporting reflection, approximately 34 px:
Cân bằng tiền bạc, thời gian và việc học.

TYPOGRAPHY: Elegant bold readable storybook serif for the meaning title, simple clear medium-weight lettering for the chapter line and reflection. All text dark warm brown #3b3028 with strong contrast on light cream. Full accurate Vietnamese diacritics, no decorative strokes colliding with accents. Keep generous vertical gaps, at least 10% canvas-edge safety margin, no text touching objects. Main title must fit the central width; reduce it slightly only if needed, never crop it. These THREE specified lines are the ONLY readable text. All bills, books, screens, cards and calendars remain unmarked or abstract. No extra lesson labels or microtext.

NARRATIVE RULE: A thematic recap of learning, NOT a declared player achievement. No success badge, failure stamp, stars, grades, scores, balances, invented rates, selected choices, completed transaction or guaranteed outcome. Symbols show concepts explored in the chapter regardless of the chosen branches. 

ASPECT AND DELIVERY: ONE rectangular 16:9 PNG, 1920 x 1080, full bleed, no black margins. Artwork already includes the three specified text lines. No sprite or dialogue box should be layered over the finished card. If gameplay needs scores or detailed recap text, show them on a subsequent UI screen instead of covering this illustration.

NEGATIVE: huge wooden title panel, boxed parchment, generic last-room screenshot, slide deck, infographic grid, collage of screenshots, split-screen rooms, icon stickers, money rain, giant coin piles, glitter explosion, victory trophy, neon finance dashboard, upward profit arrow, confirmed outcome, people, faces, hands, silhouettes, readable prop labels, extra text, misspelled Vietnamese, missing accents, tiny captions, crowded center, overlapping lettering, cropped title, illegible calligraphy, watermark, logo, photorealism, 3D render, heavy black outlines, black borders.
```

**Kiểm tra riêng ảnh tổng kết**: Đủ 3 dòng chữ đúng dấu; bài học được gợi qua đồ vật; trung tâm thoáng; không có bảng gỗ che tranh; không thể hiện người chơi đã thắng/thua. Giữ màu sắc và nét vẽ đồng bộ cả bộ, nhưng bố cục đồ vật đúng riêng chương 3.

**Bổ sung danh mục ảnh**: 1 ảnh tổng kết theo đường dẫn trên; các bảng đếm BG/scene cũ chỉ tính ảnh gameplay, chưa gồm ảnh tổng kết này.
