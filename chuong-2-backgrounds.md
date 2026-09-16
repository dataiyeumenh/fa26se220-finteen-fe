# 🎬 CHƯƠNG 2 — BACKGROUND & SCENE PROMPTS

> **MỤC ĐÍCH**: Tách riêng **BG** (nền trống, không nhân vật) và **SCENE** (composite, có nhân vật) cho Chương 2 — giai đoạn **Học sinh Cấp 3 ở thị trấn huyện** (Tí 16 tuổi).
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Tất cả BG và SCENE phải dùng **CHÍNH XÁC** style token kawaii 2D giống hệt portrait sprite — để khi ghép sprite lên BG, nhất quán về art style. KHÔNG BAO GIỜ dùng style realistic, semi-realistic, cinematic-photorealistic cho BG/SCENE.
>
> **⚠️ QUY TẮC TUỔI NHÂN VẬT**: Từ Chương 2 trở đi, các nhân vật chính **Tí, Tèo, Hùng** đã lớn lên: **13 tuổi → 16 tuổi** (học sinh cấp 3). Phải prompt lại toàn bộ character reference của Tí, Tèo, Hùng (chiều cao, vóc dáng, gương mặt, tóc, trang phục). Các nhân vật người lớn (Bố 40, Mẹ ~38, Cô Tư 35) **giữ nguyên** — chỉ prompt BG mỗi nơi nếu setting thay đổi.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi prompt trong file này là **KHỐI TỰ CHỨA ĐẦY ĐỦ** — copy nguyên khối `[Style token + Character reference đầy đủ + Setting + Aspect]` là dán vào Gemini là chạy được. KHÔNG cần tra cứu thêm ở đâu khác.
>
> **Visual Novel engine**:
> - `type: 'dialogue'` → load **BG** (trắng trơn, không nhân vật) + sprite portrait ghép lên
> - `type: 'narrator'` → load **SCENE** (đã có nhân vật trong ảnh, không cần sprite)

---

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
> 📖 **Tham khảo**: Project demo `d:\NGT\Test\finteen-app\src\components\VisualNovelPlayer.jsx`
> - Line 159: `const CharacterComponent = currentScene.character ? getSprite(currentScene.character, currentScene.expression || 'happy') : null`
> - Line 187: `dialogueBgOpacity = isDialogue ? 0.62 : 1.0` → BG mờ xuống khi dialogue, sprite nổi bật
> - Line 198-201: `BG_HAS_CHARACTER` list → biết scene nào dùng BG composite, engine skip sprite

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 2)

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt |
|---|---|---|---|
| Tí | **16** | 🇻🇳 Việt Nam | `a 16-year-old Vietnamese boy` |
| Tèo | **16** | 🇻🇳 Việt Nam | `a 16-year-old Vietnamese boy` |
| Hùng | **16** | 🇻🇳 Việt Nam | `a 16-year-old Vietnamese boy` |
| Mẹ Tí | **38** | 🇻🇳 Việt Nam | `a 38-year-old Vietnamese woman` |
| Bố Tí | **40** | 🇻🇳 Việt Nam | `a 40-year-old Vietnamese man` |
| Cô Tư | **35** | 🇻🇳 Việt Nam | `a 35-year-old Vietnamese woman` |
| Cô Hiệu trưởng | **50** | 🇻🇳 Việt Nam | `a 50-year-old Vietnamese woman` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các emotion của cùng 1 nhân vật.
>
> ⚠️ **Từ chương 2 → 8**, Tí/Tèo/Hùng giữ **age-locked 16 tuổi** (hết cấp 3). Khi lên chương 3 (sinh viên ĐH) sẽ prompt lại thành 19 tuổi.

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
| **BG trống** (cho dialogue — không nhân vật) | 16:9 ngang | `type: 'dialogue'` | Nền môi trường toàn cảnh rỗng, sẽ ghép sprite portrait lên |
| **BG composite** (có nhân vật sẵn trong ảnh) | 16:9 ngang | `type: 'narrator'` | Toàn cảnh 16:9 Việt Nam, có nhân vật Việt đang hành động trong ảnh — KHÔNG render sprite riêng |

### 🔗 CROSS-REFERENCE ĐẾN CHƯƠNG 1 (dùng ảnh lúc nhỏ làm reference khi gen ảnh 16 tuổi)

> 🎯 **QUAN TRỌNG**: Khi gen ảnh Tí/Tèo/Hùng ở chương 2 (16 tuổi), phải upload kèm **ảnh lúc nhỏ (13 tuổi) làm reference** để AI giữ đúng phong cách nhân vật, chỉ thay đổi tuổi và chi tiết trưởng thành.
>
> Bảng cross-reference này cho biết **prompt nào ở chương 1** nên upload kèm khi gen mỗi prompt ở chương 2:
>
> | Nhân vật chương 2 | Dùng ảnh reference | Ghi chú |
> |---|---|---|
> | Tí 16t (school uniform) | `c2_ti_dorm_neutral.png` ⚠️ **DÙNG ẢNH NÀY (Tí 16t ở trọ: tóc đen gọn vuốt nhẹ, da trắng sạch, áo thun trắng + short navy + giày trắng, mặt dài thanh, gầy) — KHÔNG dùng c1_ti_neutral.png (Tí 13t chương 1)** | Giữ nguyên khuôn mặt + tóc + da + style đúng reference 16t, chỉ thêm đồng phục cấp 3 |
> | Tí 16t (casual home) | `c2_ti_dorm_neutral.png` ⚠️ **DÙNG ẢNH NÀY (Tí 16t ở trọ) — KHÔNG dùng c1_ti_neutral.png** | Giữ nguyên khuôn mặt + tóc + style đúng reference 16t, chỉ thay đồ casual ở nhà |
> | Tèo 16t | `c1_teo_neutral.png` | Giữ mặt + mohawk, chỉ thay đồ hoodie cam, tăng chiều cao |
> | Hùng 16t | `c1_hung_neutral.png` | Giữ mặt + slicked hair, chỉ thay đồ school uniform, tăng chiều cao |
> | Mẹ Tí 38t | `c1_me_neutral.png` | Giữ mặt + tóc, chỉ thay trang phục (áo bà ba), thêm vài sợi bạc ở thái dương |
> | Cô Hiệu trưởng 50t | **KHÔNG CÓ reference chương 1** | Nhân vật mới — gen đầu tiên không cần reference |
>
> **⚠️ LƯU Ý QUAN TRỌNG VỀ REFERENCE TÍ**: 
> - **KHÔNG dùng** `c1_ti_neutral.png` (Tí 13t chương 1: mặt bầu bĩnh, áo xanh dương, đầu to, da sáng) — đây là Tí nhỏ.
> - **PHẢI dùng** `c2_ti_dorm_neutral.png` (Tí 16t ở trọ: **da trắng sạch, tóc đen gọn vuốt nhẹ sang bên, mặt dài thanh, gầy, áo thun trắng + short navy + giày trắng, mặt sạch không mụn** — copy 1:1 từ ảnh reference) — đây là Tí chương 2 đang sống tự lập ở phòng trọ thị trấn huyện.
> - Nếu Gemini tự gen lại khuôn mặt Tí mà không upload reference → Tí sẽ bị trẻ con hóa (giống Tí 13t chương 1). **LUÔN upload ảnh reference 16t kèm theo.**
>
> **Cách dùng trong Gemini**: Upload ảnh reference + paste prompt → AI sẽ giữ phong cách nhân vật nhưng áp dụng thay đổi tuổi mới.

---

# 👥 CÁC NHÂN VẬT XUẤT HIỆN Ở CHƯƠNG 2

| ID | Tên nhân vật | Tuổi cố định | Quốc tịch | Vai trò | Xuất hiện trong file này? |
|---|---|---|---|---|---|
| `ti` | Tí (nhân vật chính) | **16** | 🇻🇳 Việt Nam | Học sinh cấp 3 — quản lý chi tiêu | ✅ Có |
| `me` | Mẹ Tí | **38** | 🇻🇳 Việt Nam | Bán đồ ăn vặt ở sạp cổng trường | ✅ Có |
| `hung` | Hùng (bạn cùng lớp cấp 3) | **16** | 🇻🇳 Việt Nam | Con nhà giàu, rủ xem phim | ✅ Có |
| `hieutruong` | Cô Hiệu trưởng | **50** | 🇻🇳 Việt Nam | Trao giấy khen lễ tổng kết | ✅ Có |
| `teo` | Tèo (bạn thân) | **16** | 🇻🇳 Việt Nam | Bạn cùng lớp cấp 3 | ❌ Không xuất hiện ở BG/SCENE chương 2 (chỉ ở portrait emotion) |
| `bo` | Bố Tí | **40** | 🇻🇳 Việt Nam | Ở quê, không lên thị trấn | ❌ Không xuất hiện |
| `cotu` | Cô Tư (chủ tạp hóa) | **35** | 🇻🇳 Việt Nam | Ở quê, không lên thị trấn | ❌ Không xuất hiện |

---

# 🎨 STYLE TOKEN — CHIA THEO LOẠI ẢNH

### 🏪 STYLE TOKEN cho **BG TRỐNG** (empty background cho dialogue — không có nhân vật)
```
Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, empty Vietnamese [LOCATION NAME] setting. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT 3D, NOT Pixar, NOT creepy, NOT scary. NO people, NO characters, empty scene ready for character sprites to be added later, rich environmental detail, atmospheric perspective, 16:9 widescreen composition, no text, no watermark.
```

> 🔒 **Dùng cho**: `c2_bg_[place]_empty.png` (VD: `c2_bg_dorm_room_empty.png`)
> → Background **rỗng không có ai**, sẽ được React load cùng với sprite portrait khi vào dialogue scene.
> → Lưu ý: BG này **KHÔNG xóa nền**, là PNG đầy đủ 16:9.

### 🎬 STYLE TOKEN cho **BG COMPOSITE** (narrator cinematic — có nhân vật trong ảnh)
```
Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, full background scene with Vietnamese small-town. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT 3D, NOT Pixar, NOT creepy, NOT scary. setting (small-town high school, street food stalls, rental dorm, internet cafe, cinema), characters IN the scene naturally posed and placed mid-action, rich environmental detail, atmospheric perspective, depth of field, 16:9 widescreen composition, no text, no watermark.
```

> 🔒 **Dùng cho**: `c2_bg_[place]_[action].png` (VD: `c2_bg_dorm_flash_sale.png`)
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
slim sharp jawline (wrong for age 16 boy), tall muscular body (wrong for lean 16-year-old),
realistic Vietnamese adult face, child proportions (must look exactly 16)
```

---

# 🏞️ PHẦN A — BACKGROUND (BG) — NỀN TRỐNG, KHÔNG CÓ NHÂN VẬT

> **BG = ảnh nền toàn cảnh 16:9**, không nhân vật.
> Dùng cho: `dialogue` scene (React ghép sprite lên) HOẶC `narrator` tĩnh.
>
> **Style**: Kawaii 2D cartoon background — flat cel-shaded environment, simple shapes, pastel/warm colors, Studio Ghibli-inspired small-town Vietnam setting rendered as cute cartoon. NO realistic rendering, NO photographic background, NO anime background.

---

## 📍 BG 1 — PHÒNG TRỌ TÍ Ở THỊ TRẤN (TỐI, BAN ĐÊM)

### 📄 `c2_bg_dorm_room_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí nói chuyện với Mẹ qua điện thoại, hoặc Tí đối thoại với Hùng về kế hoạch đi xem phim
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Phòng trọ Tí thuê ở thị trấn huyện khi đi học cấp 3 xa nhà. Dùng cho:
- Dialogue: Tí gọi điện cho Mẹ (Mission 2.1 trước/sau khi nhận sạp hàng)
- Dialogue: Tí + Hùng nhắn tin về kế hoạch đi xem phim (Mission 2.3)
- Dialogue: Tí ngồi nhìn đôi giày mòn — nội tâm trước quyết định mua giày (Mission 2.2)

> **STYLE TOKEN (bắt buộc dùng y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**

> **Setting (BG kawaii cartoon environment — WARM COZY SMALL-TOWN RENTAL DORM ROOM OF A 16-YEAR-OLD VIETNAMESE BOY (TÍ) LIVING AWAY FROM HOME TO ATTEND HIGH SCHOOL, Studio Ghibli countryside small-town aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the room itself, far from any door or wall**, capturing the whole dorm room in a single panoramic view. **The camera is INSIDE the room, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer does NOT look through a door. The viewer simply SEES the room from inside, as if standing in the middle of the small rental room with a wide-angle lens. **Image is FULL-BLEED** — the dorm room extends **edge-to-edge across the entire 16:9 frame**. The very left edge of the frame is the warm painted wall of the room (continuing into the wall), the very right edge is the same wall, the top edge is the ceiling, the bottom edge is the floor — there is **no rectangular doorway box, no window frame border, no arch framing the scene**, the room simply fills the entire frame like a wide panoramic photograph taken from inside a small-town rental dorm. **ALL FOUR WALLS visible** with **floor and ceiling all visible**, the room opens up like a simple but cozy living space of a 16-year-old Vietnamese country boy living alone in the district town for high school (a more grown-up version of Tí's bedroom from Chapter 1, but simpler and smaller because it's a rental). **Environment rendered in cute kawaii cartoon style with WARM, NOSTALGIC HOMESICK atmosphere — DETAIL-DENSE, lived-in, TEENAGE-BOY rental dorm full of small boyish teenage details (NOT girly — NO flowers, NO dreamcatcher feathers, NO floral embroidery)**: **Ceiling** at top — simple flat white-painted ceiling with a **single warm bare bulb** (bóng đèn tròn) hanging from a thin wire in the center casting a warm golden-amber circle of light down onto the small desk below, plus **a small slow-spinning warm ceiling fan** with 3 cartoon blades and 2 pull-strings hanging from it (a typical Vietnamese rental dorm has a ceiling fan). A few **tiny watercolor marks** on the white ceiling suggesting age. **Back wall (far away from viewer)** — smooth pale-cream painted wall (cream-white tones, with hairline cracks and small patches showing it's a worn rental), a **small single metal-frame bed** (giường sắt đơn) pushed against this wall with a **pale blue thin blanket** (boyish color) folded neatly, a **small thin pillow** at the head, a **small mosquito net** (mùng xanh nhạt — boyish color) hanging from a single rope above the bed. Above the bed: a **small taped poster** of a band/football star (generic cartoon boy, NO real face) and a small **framed family photo** from back home in the village (small wooden frame). **Left wall** — a **small wooden rental desk** (bàn học nhỏ thuê trọ) — this is Tí's study area: a few stacked **textbooks labeled "Toán", "Lý", "Hóa"** (math/physics/chemistry — high school subjects) drawn as small cartoon books, a **tall stack of mock exam papers** (đề thi thử) in cartoon paper stacks, a **small pencil holder** with cartoon pencils, a **small reading lamp** with a soft warm yellow shade, plus a **small window** with thin pale-blue curtains letting in cool silver-blue moonlight. Above the desk on the wall: a **small taped weekly class schedule** (thời khóa biểu) hand-drawn in cartoon style, and a **small clock** with cartoon hands. A **small electric rice cooker** (nồi cơm điện nhỏ) on the floor next to the desk — a kawaii cartoon chunky white rice cooker with a small steam plume rising from it. **Right wall** — a **simple open wooden wardrobe/shelf** (kệ treo quần áo mở) with a few **hanging school shirts and pants** in cartoon style (mustard yellow, navy blue, gray, white — boyish school clothes), plus a **small backpack** (ba lô) hanging from a hook, a **small plastic water bottle** on a shelf, a **small calendar** with cute cartoon picture on the wall. **Floor** — simple **ceramic tile floor** (nền gạch men) in soft warm-cream square tiles with subtle grout lines stretching from the bottom edge toward the back wall in soft perspective, the warm bulb glow creating a golden-amber circle of light in the center. A small pair of **boyish cartoon sandals** (đôi dép nam) by the bed, a small **ball** (quả bóng nhỏ) on the floor near the desk, a **small trash bin** in the corner, and **a small folded note from home** on the desk — a tiny piece of paper with a tiny kawaii heart drawn on it (from Mẹ). NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING in this image. **The room looks like a warm but small rental space — cozy in a sparse way, lived-in, LOVED in a homesick way, boyish, decoration-dense** — the kind of dorm room where a 16-year-old VIETNAMESE BOY from the countryside feels a little homesick but is learning to be independent. **Background style matches the kawaii cartoon aesthetic** — flat warm colors, thick outlines on furniture, simple shapes, Studio Ghibli small-town coziness, full-room immersive perspective, edge-to-edge full-bleed with no borders.

> **Lighting**: warm bare bulb glow (golden-amber) hanging from ceiling casting a soft glowing circle of light down on the desk area, cool soft blue moonlight streaming through the left-wall window creating a gentle silver-blue tint on that side of the room — **cozy but slightly melancholic small-town dorm nighttime atmosphere like a Studio Ghibli night scene**, warm but a little lonely, EVERY part of the room visible and lit.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the room fills the entire frame with NO door, NO doorframe, NO wall edges, NO window frame border, NO arch, NO rectangular framing visible — the very left edge is wall, the very right edge is wall, the top edge is ceiling, the bottom edge is floor), **background image ONLY, no characters**.

---

## 📍 BG 2 — SẠP HÀNG MẸ CỔNG TRƯỜNG CẤP 3 (CHIỀU TÀ)

### 📄 `c2_bg_mom_stall_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí nói chuyện với Mẹ về việc nhập nguyên liệu, hoặc khách hàng học sinh nói chuyện với Tí
**Aspect**: 16:9

**📍 MAP / LAYOUT REFERENCE (BẮT BUỘC — KHỚP VỚI BG3)**:
> **Sạp Mẹ nằm ở phía TRƯỚC cổng trường, lệch sang TRÁI cổng (theo hướng nhìn từ ngoài đường vào)**.
> Sơ đồ từ trên xuống (top-down map):
> ```
>   [Cổng trường THPT]   ← BG3 đứng giữa đường nhìn thẳng vào đây
>          |  banner
>       [pillar L]  [pillar R]
>       ___|__________|___
>      |  school wall     |
>      |___   _____   ____|
>          | |     | |
>          | | sân | |
>          | | trường|
>          | |_______|
>      _________________________  ← đường phố (vỉa hè rộng)
>      [cây bàng]              [cây bàng]
>   [sạp Mẹ ★]                  [street cart nhỏ]
>      ↑ BG2: camera đứng đây, nhìn chéo về phía cổng trường
> ```
> - **Sạp Mẹ** đặt ở **vỉa hè bên trái** (cách cổng trường khoảng 8-10m về phía trái)
> - **Cổng trường** ở giữa-không trung tâm khung hình, hơi lệch phải (vì camera nhìn chéo)
> - Cùng kiến trúc cổng với BG3: 2 cột vuông cao, banner "TRƯỜNG THPT ABC", cổng sắt mở rộng, tường rào cream kéo dài 2 bên
> - Cùng bối cảnh ánh sáng: chiều vàng, golden hour, mặt trời ở phía trên-phải

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Sạp hàng đồ ăn vặt mà Mẹ mở ở cổng trường cấp 3 để kiếm thêm thu nhập. Dùng cho:
- Dialogue: Tí đối thoại với Mẹ trước khi nhận sạp (Mission 2.1)
- Dialogue: Tí phục vụ khách hàng học sinh khi đang bán hàng (Mission 2.1, sau khi chọn Chọn A thành công)

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (kawaii cartoon environment — WARM COZY SMALL-TOWN MOBILE STREET FOOD STALL OUTSIDE A HIGH SCHOOL GATE, AFTERNOON, Studio Ghibli aesthetic)**:
> **WIDE-ANGLE EXTERIOR STALL SHOT, NO WINDOW FRAME, NO DOOR FRAME BORDER** — Imagine a **wide-angle lens placed on the sidewalk (vỉa hè) at the LEFT side of the school gate, at ~150cm eye height, looking diagonally across the street toward the school gate which is in the upper-right area of the frame**. The camera is **STANDING NEXT TO MOM'S STALL** (the stall is the MAIN SUBJECT in the foreground-left), and looking diagonally toward the school gate in the distance. **The camera is OUTSIDE in the open air, NOT looking through a window or door** — there is **NO window frame, NO doorframe, NO arch, NO rectangular framing visible anywhere**. The image is **FULL-BLEED EDGE-TO-EDGE** — the stall, school gate, and street extend all the way to every edge of the 16:9 frame. **Environment in cute kawaii cartoon style with WARM BUSY AFTERNOON-HUSTLE aesthetic**: **Sky (upper third of frame, edge-to-edge)** — warm late-afternoon golden-orange sky with soft white cartoon cloud strips, the sun getting low in the upper-right casting long warm rays (SAME SUN POSITION AS BG3 — consistent lighting), a few warm kawaii floating dust particles. **Foreground-left (main subject) — MOM'S STREET FOOD STALL (sạp hàng Mẹ)** — a **simple small Vietnamese mobile street food stall** with chunky kawaii details positioned in the LEFT third of the frame (sạp Mẹ nằm ở vỉa hè bên trái cổng trường): a **bright blue-and-white striped canvas awning** (bạt che sọc xanh-trắng) propped up on a thin metal frame casting a small shadow, a **long horizontal wooden counter** (quầy gỗ dài) at chest-height with thick outlines facing the viewer (the customer side is TOWARD the camera), a **small chalkboard sign** on the stall reading "BÁNH TRÁNG NƯỚNG - XOÀI LẮC - TRÀ ĐÁ" in bubbly cartoon Vietnamese (THIS IS THE ONLY TEXT — small handwritten cartoon sign above the stall), a **few cute cartoon food displays** on the counter: stacks of round bánh tráng nướng (Vietnamese grilled rice paper pizzas) drawn as cute golden-brown circles, a small jar of colorful xoài lắc (mango shake) candies in pink/yellow/green, a small bucket of trà đá (iced tea) bottles. Behind the stall counter: a **small hand-painted wooden menu board** with cute cartoon icons of food items. A small **handwritten cardboard sign** on the side reading "GIÁ HỌC SINH" with a tiny kawaii star. A small **warm bare bulb** hanging from the awning frame casting a warm yellow glow on the food. **Mid-ground (center-to-right of frame, in the distance diagonally)** — the **entrance gate of the SAME high school seen in BG3 (cổng trường THPT ABC)** — a **tall concrete pillar gate with TWO SQUARE PILLARS** in warm cream paint with simple chunky kawaii outlines (SAME ARCHITECTURE AS BG3), a **horizontal banner** spanning the gate reading "TRƯỜNG THPT ABC" (THIS IS THE ONLY OTHER TEXT — small banner above the gate) in cartoon letters (SAME BANNER AS BG3), **wrought-iron sliding gates** open wide (SAME GATE STYLE AS BG3), a **small flagpole with Vietnamese red flag with yellow star** visible through the gate. The school boundary wall in warm cream extends from the LEFT side of the gate (passing BEHIND MOM'S STALL, since the stall is between the camera and the wall on the left) and continues to the RIGHT side of the gate toward the right edge of the frame. A few **small palm tree saplings** planted along the school wall on the right side of the gate. **Ground under viewer's feet and stretching toward the stall and across to the gate** — warm dusty asphalt road (nền nhựa đường) in soft warm-gray cartoon style with subtle perspective lines leading from the foreground (where the stall is) DIAGONALLY TOWARD the school gate in the distance, a few small kawaii **fallen leaves** scattered on the ground. **Right side of frame (edge-to-edge)** — a row of **small street trees** (cây bàng nhỏ — tropical almond trees) in soft green cartoon crowns with thick brown trunks planted along the sidewalk on the right side of the school gate, their long golden shadows stretching across the road, a few small parked bicycles/scooters in chunky kawaii cartoon style (warm gray-blue metal). NO people, NO characters, NO main characters (no Tí, no Mẹ) in this image.

> **Lighting**: late afternoon golden hour sunlight (warm amber-gold) from upper-right (SAME SUN DIRECTION AS BG3 for visual consistency), warm bulb glow on the stall casting a yellow circle on the counter, long warm shadows from the awning and trees stretching LEFT-TO-RIGHT (toward camera-left), soft atmospheric golden haze in the distance, warm orange-pink tint on the clouds.

> **Aspect ratio**: 16:9 widescreen, **background image ONLY, no characters**.

---

## 📍 BG 3 — CỔNG TRƯỜNG CẤP 3 (GIỜ TAN HỌC, CHIỀU VÀNG)

### 📄 `c2_bg_school_gate_empty.png`
**Loại**: BG (nền trống, wide shot, không nhân vật)
**Dùng cho**: `narrator` tĩnh — Narrator giới thiệu "Đây là trường cấp 3 huyện, nơi Tí bắt đầu cuộc sống tự lập..."
**Aspect**: 16:9

**📍 MAP / LAYOUT REFERENCE (BẮT BUỘC — KHỚP VỚI BG2)**:
> **BG3 = góc nhìn từ giữa đường, NHÌN THẲNG vào cổng trường**. BG3 và BG2 là **CÙNG MỘT ĐỊA ĐIỂM** nhưng nhìn từ 2 góc khác nhau.
> Sơ đồ từ trên xuống (top-down map):
> ```
>   [Cổng trường THPT]   ← BG3: camera đứng đây, nhìn thẳng vào cổng
>          |  banner
>       [pillar L]  [pillar R]
>       ___|__________|___
>      |  school wall     |
>      |___   _____   ____|
>          | |     | |
>          | | sân | |
>          | | trường|
>          | |_______|
>      _________________________  ← đường phố
>      [cây bàng]              [cây bàng]
>   [sạp Mẹ ★]                  [street cart]
>      ← BG2: camera đứng đây, nhìn chéo về cổng trường
> ```
> - **Cổng trường** là TRUNG TÂM BG3 (nhìn thẳng từ giữa đường)
> - **Sạp Mẹ** ở góc TRÁI xa (rìa trái khung hình BG3, nhỏ xa — chính là cái "street vendor cart" nhỏ được nhắc tới)
> - Cùng kiến trúc: 2 cột vuông cao, banner "TRƯỜNG THPT ABC", cổng sắt mở rộng, tường rào cream
> - Cùng ánh sáng chiều vàng, mặt trời ở phía trên-trái (BG3) / trên-phải (BG2) — đây là khác biệt DUY NHẤT vì góc nhìn khác nhau 90°

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Mở đầu chương, narrator giới thiệu bối cảnh mới (thị trấn huyện, trường cấp 3) khi Tí bắt đầu cuộc sống tự lập xa nhà.

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (kawaii cartoon environment — WARM COZY SMALL-TOWN HIGH SCHOOL ENTRANCE AT DISMISSAL TIME, LATE AFTERNOON GOLDEN HOUR, Studio Ghibli aesthetic)**:
> **WIDE-ANGLE PANORAMIC EXTERIOR SHOT FROM THE STREET FACING THE GATE, NO WINDOW FRAME, NO DOOR FRAME BORDER** — Imagine a **wide-angle lens placed in the MIDDLE OF THE STREET (giữa đường phố) at ~150cm eye height, LOOKING DIRECTLY AT THE SCHOOL GATE FRONT-ON** (camera facing the gate dead-on, NOT at an angle). The gate is the CENTRAL FOCUS of the frame, perfectly centered. **The camera is OUTSIDE in the open air, NOT looking through a window or door** — there is **NO window frame, NO doorframe, NO arch, NO rectangular framing visible anywhere**. The image is **FULL-BLEED EDGE-TO-EDGE**. **Environment in cute kawaii cartoon style with WARM BUSY AFTERNOON aesthetic — A LOT OF BACKGROUND HIGH SCHOOL STUDENTS (not Tí, not main characters)**: **Sky (upper third of frame, edge-to-edge)** — warm late-afternoon golden hour sky with soft white cartoon cloud strips, the sun low in the upper-LEFT of the frame casting long warm rays DOWNWARD-RIGHT, warm kawaii floating dust particles in the air like gold sparkles. **Ahead (CENTER of frame) — THE HIGH SCHOOL GATE (cổng trường THPT ABC)** — a **tall concrete gate with TWO SQUARE PILLARS** in warm cream paint with simple chunky kawaii outlines, a **horizontal banner** spanning the gate reading "TRƯỜNG THPT ABC" in cartoon letters, **wrought-iron sliding gates** fully open at dismissal time, behind the gates a glimpse of the schoolyard with **small green trees** and **a flagpole with the Vietnamese red flag with yellow star** (small in the distance). The gate is the central focus of the frame. **A crowd of small cute background high school students** (10-15 small kawaii figures in white áo dài / blue school uniforms, very small in the frame, blurred, purely decorative) flowing OUT of the gate and onto the street, some on bicycles, some walking in pairs chatting, some carrying backpacks. **Ground in front of gate** — warm dusty asphalt street in soft warm-gray cartoon style stretching toward the viewer's feet, soft perspective lines. **Left side of frame** — the school boundary wall in warm cream extending to the LEFT edge, with a few small faded poster rectangles. A few parked bicycles/scooters along the wall. **On the FAR LEFT (edge of frame, in the mid-distance)** — a small **streetside stall with a bright blue-and-white striped canvas awning** (this is MOM'S STALL from BG2, but seen from far away, small in the frame, on the left sidewalk) — recognizable by the SAME BLUE-WHITE STRIPED AWNING but smaller due to distance. **Right side of frame** — a row of small street trees (cây bàng) extending to the right edge, a small **xe ôm** (motorbike taxi) parked with a chunky warm-colored helmet on the seat. **In the foreground, mid-distance** — a small **street vendor cart** (xe đẩy bán hàng rong) with a colorful awning selling trà đá and chè, drawn as cute chunky cartoon with steam rising from a small pot (THIS IS A DIFFERENT SMALL CART, NOT mom — mom is the blue-white striped one in the far left). NO main characters, NO Tí, NO Tèo, NO Hùng in this image. NO WINDOW FRAME, NO DOORFRAME BORDER, NO RECTANGULAR FRAMING visible.

> **Lighting**: late afternoon golden hour sunlight (warm amber-gold) from upper-LEFT, long warm shadows from the gate pillars stretching to the RIGHT, dust motes floating in golden light, warm orange-pink tint on clouds.

> **Aspect ratio**: 16:9 widescreen, **background image ONLY, no characters**.

---

## 📍 BG 4 — LỚP HỌC CẤP 3 (BAN ĐÊM, ĐÈN SÁNG)

### 📄 `c2_bg_classroom_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí ngồi bàn làm bài, điện thoại rung (Flash sale giày), hoặc đối thoại với bạn cùng bàn
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Lớp học cấp 3 ban đêm (giờ tự học). Dùng cho:
- Dialogue: Tí ngồi bàn, điện thoại rung thông báo Flash Sale giày sneaker (Mission 2.2 — khoảnh khắc Tí bị cám dỗ mua sắm)

> **STYLE TOKEN (bắt buộc dùng y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**

> **Setting (BG kawaii cartoon environment — WARM COZY SMALL-TOWN VIETNAMESE HIGH SCHOOL CLASSROOM AT NIGHT WITH LIGHTS ON, Studio Ghibli school aesthetic)**:
> **WIDE-ANGLE INTERIOR CLASSROOM SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed at the back of the classroom at the teacher's podium level**, capturing the whole classroom in a single panoramic view. **The camera is INSIDE the classroom, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer does NOT look through a door. The viewer simply SEES the classroom from inside, as if standing at the back of the room with a wide-angle lens. **Image is FULL-BLEED** — the classroom extends **edge-to-edge across the entire 16:9 frame**. The very left edge of the frame is the warm painted wall of the classroom (continuing into the wall), the very right edge is the same wall, the top edge is the ceiling with fluorescent tubes, the bottom edge is the floor — there is **no rectangular doorway box, no window frame border, no arch framing the scene**, the classroom simply fills the entire frame. **ALL FOUR WALLS visible** with **floor and ceiling all visible**, the classroom opens up like a typical small-town Vietnamese high school classroom (cấp 3) at night with the lights still on for self-study (tự học / ôn bài). **Environment rendered in cute kawaii cartoon style with WARM, COZY NIGHTTIME-STUDY atmosphere — DETAIL-DENSE, lived-in, full of small school details**: **Ceiling** at top — simple flat white-painted ceiling with **two long fluorescent tube lights** (đèn tuýp) running across the center casting cool white-warm light downward, plus a **slow-spinning warm ceiling fan** with 3 cartoon blades and 2 pull-strings hanging from it, a few small cobwebs in corners. **Front wall (far away from viewer, behind the empty teacher's desk)** — a **large green chalkboard** (bảng đen) in chunky cartoon dark-green with simple thick outline, with **faded chalk scribbles** of math/physics equations in cartoon style (NO real formulas, just generic squiggles), a **small chalk tray** below the board with a few small cartoon chalk pieces and a soft chalkboard eraser, a **pull-down projector screen** rolled up above the chalkboard. Above the chalkboard: a **small banner** with "PHẤN ĐẤU HỌC TỐT" or similar generic Vietnamese school slogan in cartoon letters (THIS IS THE ONLY TEXT). A small **Vietnamese flag** (cờ đỏ sao vàng) on a small pole in the corner of the front wall. **Left wall** — a long row of **small classroom windows** with pale-blue half-drawn curtains (rèm xanh nhạt), dark blue-black night sky visible outside with tiny cartoon stars and a soft moon, a few small windows with warm light from the street filtering in. A small **class schedule poster** (thời khóa biểu) taped to the wall in cartoon style. **Right wall** — a long row of **wooden coat hooks** with a few cartoon backpacks and a cartoon jacket hanging, a **small bulletin board** with cartoon pinned notes from students, a small **clock** with cartoon hands showing late evening time (around 8pm). **Floor** — simple **ceramic tile floor** (nền gạch men) in soft warm-cream square tiles with subtle perspective lines stretching toward the front chalkboard, cool fluorescent reflections on the tile. **Rows of student desks and chairs** (bàn ghế học sinh) — about 6-8 rows of **2-person wooden desks** in chunky kawaii cartoon style with thick dark outlines, warm honey-brown wooden tops, simple metal legs, in pairs facing the chalkboard. **All desks are EMPTY** — no characters. Each desk has small details: a stack of **textbooks** (Toán, Lý, Anh văn — math/physics/English) in cartoon style, a **small pencil case** with cartoon pencils sticking out, a **small notebook** open. A few small crumpled paper balls on the floor between desks (cartoon warm-cream crumpled balls). A small **piece of chalk** dropped on the floor near the chalkboard. NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING in this image.

> **Lighting**: cool white fluorescent tube lights from ceiling casting even classroom light, plus cool blue moonlight streaming through left-wall windows creating a gentle silver-blue tint, plus tiny warm orange glow from a single desk lamp left on somewhere — **cozy nighttime small-town high school classroom atmosphere in kawaii cartoon style, EVERY part of the room visible and lit**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the classroom fills the entire frame with NO door, NO doorframe, NO wall edges, NO window frame border, NO arch, NO rectangular framing visible — the very left edge is wall, the very right edge is wall, the top edge is ceiling, the bottom edge is floor), **background image ONLY, no characters**.

---

## 📍 BG 5 — SÂN TRƯỜNG CẤP 3 (GIỜ RA CHƠI, TRƯA NẮNG)

### 📄 `c2_bg_highschool_yard_empty.png`
**Loại**: BG (nền trống, không nhân vật chính)
**Dùng cho**: `dialogue` — Hùng vỗ vai Tí rủ đi xem phim cuối tuần, Tí đáp lại
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Sân trường cấp 3 giờ ra chơi. Dùng cho:
- Dialogue: Hùng vỗ vai Tí rủ đi xem phim cuối tuần (Mission 2.3 — khoảnh khắc Tí bị cám dỗ)

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (kawaii cartoon environment — WARM SUNNY SMALL-TOWN HIGH SCHOOL YARD, FIRST-PERSON VIEW IN THE MIDDLE OF THE YARD, Studio Ghibli aesthetic)**:
> **FIRST-PERSON CAMERA VIEWPOINT** — Imagine the viewer is **standing in the middle of the high school yard at ~165cm eye height (now taller because the characters are 16)** looking around as if they were a 16-year-old Vietnamese high school student on a sunny lunch break. The whole schoolyard wraps around the viewer. **ALL DIRECTIONS visible**: **Sky above (upper third of frame)** — bright cheerful blue tropical sky with soft white cartoon cloud strips, warm tropical midday sun glowing warmly with a few tiny kawaii sparkle dots. **Ground under viewer's feet** — warm **concrete schoolyard** (sân xi măng trường học) in soft warm-cream-gray cartoon style with subtle expansion-joint lines stretching out in all directions with soft perspective. **In front of viewer (center of frame)** — more concrete yard stretching toward the back of the school building. **Left side of frame** — the **tall mango tree** (cây xoài) on the left, a large soft-green cartoon circle crown with thick brown trunk, casting **dappled circular warm shadows** on the concrete floor. A few **small benches** (ghế đá) in chunky warm-gray stone near the tree. **Right side of frame** — the **multi-story school building** (dãy nhà cấp 3 nhiều tầng) in warm cream-yellow walls, 3 floors visible, rows of small classroom windows with pale-blue curtains, a wide concrete staircase leading up to the second floor, a small **water fountain** (vòi nước uống) on the right side. **Behind viewer / far back wall** — the **basketball court** (sân bóng rổ) at the far end of the yard with a small orange hoop, a few **other 16-year-old students** (VERY small, tiny figures, blurred, purely decorative background) playing basketball or chatting in small groups in the far distance. A small **hand-painted banner** spanning part of the back wall reading "XÂY DỰNG TRƯỜNG HỌC THÂN THIỆN" or similar generic Vietnamese school slogan in cartoon letters (THIS IS THE ONLY TEXT). **Warm bright tropical midday sunlight** — warm yellow-white light, soft warm shadows under the mango tree, vivid cheerful blue sky. NO main characters, NO Tí, NO Hùng, NO Tèo in this image.

> **Lighting**: warm bright tropical midday sunlight — warm yellow-white light, soft warm simple shadows under the mango tree and school building, vivid cheerful blue sky at top — **cozy warm lively high school yard atmosphere** in kawaii cartoon style.

> **Aspect ratio**: 16:9, **background image ONLY, no main characters**.

---

## 📍 BG 6 — RẠP CHIẾU PHIM HUYỆN (TỐI, BAN ĐÊM)

### 📄 `c2_bg_cinema_lobby_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí nói chuyện với Hùng ở sảnh rạp phim trước khi mua vé
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Sảnh rạp chiếu phim ở trung tâm thị trấn huyện. Dùng cho:
- Dialogue: Tí đứng trước quầy vé với Hùng, do dự không biết có nên mua vé 250k không (Mission 2.3)

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (kawaii cartoon environment — WARM COZY SMALL-TOWN CINEMA LOBBY AT NIGHT, Studio Ghibli aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the cinema lobby itself**, capturing the whole lobby in a single panoramic view. **The camera is INSIDE the lobby, NOT outside the door** — there is **NO doorway, NO doorframe, NO entrance frame, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer simply SEES the lobby from inside with a wide-angle lens. **Image is FULL-BLEED EDGE-TO-EDGE**. **ALL FOUR WALLS visible** with **floor and ceiling all visible**. **Environment in cute kawaii cartoon style with WARM EXCITING MOVIE-NIGHT aesthetic — DETAIL-DENSE, full of small kawaii cinema details**: **Ceiling** at top — dark painted ceiling with **small warm-yellow recessed spotlights** (đèn downlight) scattered around casting warm circles of light, plus **small hanging cinema posters** for fake cartoon superhero movies (generic cartoon superhero silhouette posters — NO real movie titles, NO real characters, NO copyrighted names, just generic "Siêu Anh Hùng XYZ" cartoon posters in kawaii style, THIS IS THE ONLY TEXT and it's small handwritten cartoon lettering). A small **slow-spinning disco ball** (quả cầu kính) hanging from the center casting tiny warm sparkle dots around the lobby. **Front wall (the wall opposite the ticket counter, far away)** — a **large illuminated movie poster display** with a **big colorful cartoon superhero movie poster** (generic superhero cartoon — strong cartoon silhouette, big muscles, cape flying, NOT real superhero IP) framed in chunky kawaii cartoon style. To the sides: small **poster display racks** with small movie flyers. **Left wall** — the **ticket counter** (quầy vé) running along this wall in warm dark-wood chunky cartoon style, an **old CRT computer monitor** on the counter showing a cartoon ticket booking screen, a **small popcorn machine** (máy bắp rang) with warm orange-red cartoon popcorn visible inside the glass case, a small **drink dispenser** with rows of cartoon soda cups, a small **"MUA 2 VÉ TẶNG 1 BẮP"** handwritten cardboard sign. **Right wall** — a small **concession stand display** with rows of cartoon candy boxes and cartoon drinks, plus a **small standing banner** with "WELCOME" written in cartoon letters (THIS IS THE ONLY ENGLISH TEXT, in cartoon style). A small **soft warm wall sconce** casting a yellow glow. **Floor** — dark glossy **cinema lobby floor** in deep warm-brown/charcoal tones with subtle reflections of the warm spotlights, stretching from the bottom edge toward the back wall. A small **red carpet strip** (thảm đỏ) running through the middle of the floor. A few small **cinema seats** (ghế chờ) in warm red cartoon style near the back wall. NO people, NO characters, NO main characters in this image.

> **Lighting**: dim warm overall atmosphere with bright warm-yellow spotlights from ceiling casting small golden pools of light, warm orange-red popcorn-machine glow from left wall, soft warm cinema screen glow from the front wall poster — **exciting warm cozy small-town cinema lobby night atmosphere in kawaii cartoon style**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE**, **background image ONLY, no characters**.

---

## 📍 BG 7 — QUÁN NET GẦN NHÀ (TỐI, ĐÈN NEON)

### 📄 `c2_bg_internet_cafe_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí quay lại quán net sau khi nhận ra xe bị mất (narrator tĩnh), hoặc đối thoại nội tâm
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Quán net gần nhà trọ của Tí. Dùng cho:
- Narrator tĩnh: Mô tả bối cảnh quán net — nơi Tí ghé chơi 30 phút trước khi xe bị mất
- Dialogue: Tí nội tâm sau khi nhận ra xe đạp bị trộm

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (kawaii cartoon environment — WARM COZY SMALL-TOWN INTERNET CAFE AT NIGHT, Studio Ghibli retro-game aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the internet cafe itself**, capturing the whole shop interior in a single panoramic view. **The camera is INSIDE the cafe, NOT outside the door** — there is **NO doorway, NO doorframe, NO entrance frame, NO wall edges, NO rectangular framing visible ANYWHERE**. **Image is FULL-BLEED EDGE-TO-EDGE**. **ALL FOUR WALLS visible** with **floor and ceiling all visible**. **Environment in cute kawaii cartoon style with WARM RETRO-GAMING NIGHTTIME aesthetic — DETAIL-DENSE, glowing screens, dim cozy atmosphere**: **Ceiling** at top — dark painted ceiling with **small warm-white fluorescent tube lights** running across casting dim warm light, plus **warm neon glow** from below reflecting up (warm pink-purple-blue neon strips on the walls creating a soft glow on the ceiling). **Front wall (the wall opposite the entrance, far away)** — a **wall mural** of a generic cartoon game character (NOT real IP, generic pixel-art hero), with **several small CRT monitors** in chunky kawaii cartoon style arranged in 2 rows of 4 (8 stations total), each glowing with a **different warm cartoon game scene** (a generic pixel-art RPG battle screen, a cartoon racing game, a cartoon puzzle game — generic placeholder scenes, NOT real game IPs, NOT copyrighted), the screens casting colorful kawaii glow onto the players' chairs. **Left wall** — the **reception counter** (quầy tính tiền) running along this wall in dark-wood chunky cartoon style, an **old chunky CRT monitor** on the counter showing a cartoon timer in warm green, a **small bowl of cartoon candy** for customers, a **small hand-painted cardboard sign** reading "GIỜ CHƠI: 5K/GIỜ" in cartoon letters (THIS IS THE ONLY TEXT, small handwritten Vietnamese). A **soft warm pink-purple neon sign** above the counter in cartoon style with a generic pixel-art icon (no real brand). **Right wall** — a long row of **glowing CRT monitors** at customer stations, each with a **small kawaii cartoon character avatar** on the screen (generic tiny cartoon game characters, NOT real IPs), the screens casting colorful warm glow on the walls, a **small wall-mounted fan** spinning slowly, a few small **cable tangles** drawn as cute cartoon yarn-ball style, a small **water dispenser** (bình nước) in the corner with cartoon stacked cups. **Floor** — simple **dark ceramic tile floor** (nền gạch tối) in soft warm-charcoal square tiles with subtle perspective lines stretching toward the back wall, the colorful monitor glow reflecting subtly on the tiles. Rows of **chunky old CRT computer stations** in 2 rows facing each other in the middle of the room, each station with a tiny cartoon gaming chair (warm red cartoon chairs). A few **empty soda cans** on the floor. NO people, NO characters, NO main characters (no Tí, no thief) in this image.

> **Lighting**: dim warm-white fluorescent overall + bright colorful glow from the CRT monitors casting soft pink/blue/orange glow on walls + warm pink-purple neon sign glow + small warm bulb at the counter — **cozy warm small-town internet cafe nighttime retro-gaming atmosphere in kawaii cartoon style, dim but inviting**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE**, **background image ONLY, no characters**.

---

## 📍 BG 8 — SÂN KHẤU LỄ TỔNG KẾT (TRƯA, TRONG TRƯỜNG)

### 📄 `c2_bg_stage_award_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đứng trên sân khấu nhận giấy khen, hoặc narrator giới thiệu cảnh lễ tổng kết
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Sân khấu hội trường lễ tổng kết năm học. Dùng cho:
- Narrator tĩnh: Giới thiệu cảnh lễ tổng kết — "Cả hội trường im phắc khi cô hiệu trưởng xướng tên..."

> **STYLE TOKEN (bắt buộc dùng y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**

> **Setting (BG kawaii cartoon environment — WARM COZY SMALL-TOWN HIGH SCHOOL YEAR-END AWARDS CEREMONY STAGE, Studio Ghibli school aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT FROM THE AUDIENCE LOOKING AT THE STAGE, NO DOORWAY** — Imagine a **wide-angle lens placed at the back of the school auditorium at audience eye level**, looking forward toward the stage in a single panoramic view. **The camera is INSIDE the auditorium, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer simply SEES the stage from the audience with a wide-angle lens. **Image is FULL-BLEED** — the auditorium extends **edge-to-edge across the entire 16:9 frame**. The very left edge of the frame is the warm painted wall of the auditorium, the very right edge is the same wall, the top edge is the ceiling with stage lights, the bottom edge is the auditorium floor with the front row of seats — there is **no rectangular doorway box, no window frame border, no arch framing the scene**. **Environment rendered in cute kawaii cartoon style with WARM, PROUD, CEREMONIAL atmosphere — DETAIL-DENSE, festive, school-celebration**: **Ceiling** at top — dark painted auditorium ceiling with **a row of warm-bright stage spotlights** (đèn sân khấu) in chunky cartoon housings casting warm yellow-white beams down onto the stage, plus a few **small hanging Vietnamese flags** (cờ đỏ sao vàng) on small poles for decoration. **Front wall (far away from viewer, the BACK WALL OF THE STAGE)** — a **large red velvet stage curtain** (rèm nhung đỏ) drawn open to the sides, revealing the **stage backdrop** with **a large colorful banner** spanning the width reading "LỄ TỔNG KẾT NĂM HỌC" in cartoon Vietnamese letters (THIS IS THE ONLY TEXT, large painted banner), with small painted **flowers and stars** in pink/gold cartoon style decorating the backdrop. **Left side of stage** — a **small wooden podium** (bục phát biểu) with a small cartoon microphone on top, a **small flower bouquet** beside the podium. **Right side of stage** — a **long table** with rows of stacked **red award certificates** (giấy khen đỏ) and **gold medal trays** in cartoon kawaii style, a **few small flower vases** on the table. **Floor (the stage floor)** — warm polished wood stage floor in soft honey-brown with subtle plank lines, a few small **red carpet runners** on the floor. **Foreground (bottom edge of frame, in front of the stage, in the audience area)** — the **front rows of audience seats** — rows of **small wooden benches** in warm honey-brown cartoon style, with **a few tiny blurred background students** sitting in the back rows (very small, blurred, purely decorative), the **audience floor** in simple warm-cream tile. NO main characters (NO Tí, NO cô hiệu trưởng, NO Tèo, NO Hùng) in this image — only environment.

> **Lighting**: bright warm stage spotlights from above casting warm yellow-white pools of light on the stage backdrop and floor, dim warm ambient light in the audience area — **festive proud warm kawaii cartoon school ceremony atmosphere, EVERY part of the stage visible and lit**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the auditorium fills the entire frame with NO door, NO doorframe, NO wall edges, NO arch, NO rectangular framing visible), **background image ONLY, no characters**.

---

## 📍 BG 9 — QUÁN BÁN GIÀY SNEAKER / TRUNG TÂM THƯƠNG MẠI NHỎ (TRƯA)

### 📄 `c2_bg_shoe_store_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí nhìn đôi giày mòn gót dưới gầm bàn (nội tâm / narrator tĩnh)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Cửa hàng giày sneaker / trung tâm thương mại nhỏ ở thị trấn. Dùng cho:
- Dialogue: Tí nhìn đôi giày mòn gót dưới gầm bàn (nội tâm — khoảnh khắc Tí bị cám dỗ mua sắm Mission 2.2)
- Narrator tĩnh: Mô tả cửa hàng giày đang Flash Sale

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (kawaii cartoon environment — WARM COZY SMALL-TOWN SHOE STORE / MINI MALL, Studio Ghibli retail aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the small shoe store**, capturing the whole store in a single panoramic view. **The camera is INSIDE the store, NOT outside the door** — there is **NO doorway, NO doorframe, NO entrance frame, NO wall edges, NO rectangular framing visible ANYWHERE**. **Image is FULL-BLEED EDGE-TO-EDGE**. **ALL FOUR WALLS visible** with **floor and ceiling all visible**. **Environment in cute kawaii cartoon style with WARM RETAIL TEMPTATION aesthetic — DETAIL-DENSE, well-lit, full of colorful cartoon shoes**: **Ceiling** at top — simple white-painted ceiling with **rows of warm-bright track lights** (đèn rọi) casting warm yellow-white pools of light down onto the shoe displays below, plus **a small slow-spinning warm ceiling fan**. **Front wall (the wall opposite the entrance, far away)** — a **large display shelf** packed densely with rows of cute kawaii cartoon **sneakers in many bright colors** (white/red/blue/black/pink cartoon shoes, drawn as cute adorable shapes with thick outlines), each pair sitting on a small **warm-white display box**, with a **large "SALE 70%"** cardboard sign in bubbly red cartoon letters (THIS IS THE ONLY TEXT, large handwritten Vietnamese) hanging above. A few **small poster displays** of cartoon runners in chunky kawaii style. **Left wall** — a **long glass counter** (tủ kính trưng bày) running along this wall in warm-wood chunky cartoon style with thick outlines, displaying **rows of premium sneakers** inside (white/air-force-1 style cartoon sneakers, silver metallic cartoon sneakers, black cartoon sneakers with cute stripes), a small **handwritten sign** on the counter reading "GIÁ GỐC 1.000K - GIẢM CÒN 300K" in cartoon letters (THIS IS THE OTHER TEXT). A **warm wood cash register** on one end of the counter. **Right wall** — a **tall mirror display** (gương lớn) leaning against the wall for customers to try shoes, more **rows of shoe shelves** with cute cartoon sneakers, a **small bench** (ghế thử giày) in warm-wood cartoon style. A **small standing A-frame sign** (biển chữ A) reading "FLASH SALE HÔM NAY" in cartoon letters. **Floor** — polished warm-cream tile floor in soft cartoon style with subtle perspective lines stretching toward the back wall, the warm spotlights creating bright pools of light on the floor. A few **small cardboard boxes** stacked near the back wall. NO people, NO characters in this image.

> **Lighting**: bright warm track-light pools from ceiling + warm wood-counter glow + bright "SALE" sign glow — **bright warm retail temptation atmosphere in kawaii cartoon style**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE**, **background image ONLY, no characters**.

---

## 📍 BG 10 — ĐƯỜNG PHỐ THỊ TRẤN HUYỆN BAN ĐÊM (XE ĐẠP BỊ MẤT)

### 📄 `c2_bg_town_street_bike_stolen_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `narrator` tĩnh — Tí bước ra khỏi quán net, chỗ để xe trống — narrator mô tả "chiếc xe đạp màu xanh da trời đã không còn cánh nào"
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Life Event 2: Mất xe đạp. Đường phố thị trấn ban đêm trước cửa quán net. Dùng cho:
- Narrator tĩnh: "Bước ra thì chiếc xe đạp màu xanh da trời đã không còn cánh nào..."

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar. **CRITICAL anti-distortion + framing rule** (xem đầu file).

> **Setting (kawaii cartoon environment — WARM COZY SMALL-TOWN STREET AT NIGHT, EMPTY BIKE RACK, Studio Ghibli small-town night aesthetic)**:
> **WIDE-ANGLE PANORAMIC EXTERIOR SHOT, NO WINDOW FRAME, NO DOOR FRAME BORDER** — Imagine a **wide-angle lens placed in the middle of the small-town street at ~165cm eye height**, capturing the street and the empty bike rack in front of the internet cafe. **The camera is OUTSIDE in the open air, NOT looking through a window or door** — there is **NO window frame, NO doorframe, NO arch, NO rectangular framing visible anywhere**. The image is **FULL-BLEED EDGE-TO-EDGE**. **Environment in cute kawaii cartoon style with WARM NIGHTTIME LONELY atmosphere — DETAIL-DENSE, quiet small-town night**: **Sky (upper portion of frame, edge-to-edge)** — warm deep blue-purple night sky with soft cartoon stars scattered across and a small crescent moon in the upper-left, soft warm yellow-orange glow from street lights on the clouds, NO bright moon (it's a quiet night). **Ahead (center of frame) — THE EMPTY BIKE RACK** — a small **metal bike rack** (kệ để xe đạp) in chunky kawaii dark-gray cartoon style, with **only 3 bikes remaining** in the rack (the other slots are EMPTY — visible empty curved metal hooks where Tí's blue bike used to be), the empty slots have a subtle sad lonely feeling. The remaining bikes are random cartoon kawaii bicycles in warm-gray/red/black colors. **Behind the bike rack (mid-distance)** — the **closed internet cafe** (quán net đã đóng cửa) with rolling shutters half-closed, a small warm yellow bulb above the door still glowing, the cafe's pink-purple neon sign dimmed/off. **Behind the cafe** — a row of **small-town closed shops** with rolling shutters down, warm street lights casting pools of yellow on the sidewalk. **Ground under viewer's feet** — warm asphalt street in soft dark-gray cartoon style with subtle perspective lines, a few small **fallen leaves** scattered, soft warm-yellow street-light pools reflecting on the asphalt. **Left side of frame** — a **small street tree** (cây bàng) in soft dark-green cartoon crown with thick brown trunk, casting a long shadow, a few small **warm street lamps** (đèn đường) in chunky kawaii cartoon style with warm yellow glows. **Right side of frame** — a small **xe ôm motorbike** parked with its warm headlight off, more closed shops, a small **drinking stall** (quán trà đá) still open with a single warm bulb glowing. A few **tiny background pedestrians** (very small, very blurred, purely decorative) walking far away. NO main characters, NO Tí, NO thief, NO bikes except the 3 remaining ones in this image.

> **Lighting**: dim warm yellow-orange street-lamp pools + small warm bulb glow on the closed cafe + dark deep-blue-purple night sky — **quiet warm lonely small-town night atmosphere in kawaii cartoon style, dim but with warm pools of light**.

> **Aspect ratio**: 16:9 widescreen, **background image ONLY, no characters**.

---

---

# 🎬 PHẦN B — SCENE (COMPOSITE) — CÓ NHÂN VẬT TRONG ẢNH

> **SCENE = ảnh toàn cảnh 16:9** đã có nhân vật hành động trong ảnh.
> Dùng cho: `narrator` scene — engine KHÔNG ghép sprite, nhân vật đã có sẵn.
>
> **Style**: **CHÍNH XÁC** giống portrait sprite — kawaii 2D cartoon (head-to-body 1:2.5, huge eyes, thick outlines, cel-shading, soft blush). Background environment cũng phải là kawaii cartoon style y hệt (không realistic, không semi-realistic).
>
> **⚠️ CRITICAL**: Nhân vật trong SCENE dùng **style kawaii portrait** (head-to-body 1:2.5, huge eyes, thick outlines) — không phải realistic figure, không cinematic. Background cũng phải là kawaii cartoon environment.
>
> **⚠️ QUY TẮC TUỔI NHÂN VẬT (QUAN TRỌNG)**: Từ Chương 2 trở đi, **Tí, Tèo, Hùng** đã lớn lên (13 → 16 tuổi, học cấp 3). Phải dùng **character reference mới** cho 3 nhân vật này. Các nhân vật người lớn (Bố 40, Mẹ ~38, Cô Tư 35) **giữ nguyên** character reference từ Chương 1 — chỉ thêm setting mới.
>
> **⚠️ MỖI PROMPT SCENE DƯỚI ĐÂY TỰ CHỨA ĐẦY ĐỦ**: Style token + Character reference (đầy đủ hex color, face, body, outfit) + Setting + Bối cảnh cốt truyện + Aspect ratio. Copy nguyên khối là dùng được, không cần tra cứu thêm ở đâu khác.

---

## 📍 SCENE 1 — SẠP HÀNG MẸ: MẸ GIAO SẠP CHO TÍ

### 📄 `c2_bg_mom_stall_handover.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene "Mẹ giao cho con toàn quyền quản lý sạp hàng chiều nay..."
**Nhân vật trong ảnh**: Mẹ Tí + Tí (2 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Mission 2.1: Phụ mẹ bán hàng. Mẹ mở sạp đồ ăn vặt ở cổng trường cấp 3 để kiếm thêm. Hôm nay Mẹ bận việc ở hợp tác xã nên giao cho Tí toàn quyền quản lý sạp chiều nay + đưa Tí 200k tiền vốn. Tí đứng trước sạp nhận phong bì tiền, vừa hào hứng vừa hồi hộp.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Mẹ Tí**: upload `c1_me_neutral.png` làm reference (giữ mặt + tóc, chỉ thay trang phục áo bà ba xanh nhạt + thêm vài sợi bạc ở thái dương)
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ mặt + tóc + màu tóc + skin tone y hệt reference; **CHỈ** thay đồ casual ở nhà + tăng chiều cao 168cm, KHÔNG thay đổi khuôn mặt, KHÔNG thay đổi kiểu tóc, KHÔNG thay đổi màu da)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 16t có da sạch mịn KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 16t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 16-YEAR-OLD TEENAGER — natural facial proportions, not a 13-year-old kid, not a 10-year-old child, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose style, lip style, face proportions 1:1 from the reference.** **CRITICAL anti-distortion: face proportions stay NORMAL** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet. ⭐ DO NOT CROP THE CHARACTERS — BOTH MẸ AND TÍ MUST SHOW FULL HEAD TO FULL FEET INSIDE THE 16:9 FRAME.**
>
> **Setting (kawaii cartoon environment + 2 characters — WARM COZY AFTERNOON AT MOM'S STREET FOOD STALL OUTSIDE HIGH SCHOOL, Studio Ghibli small-town aesthetic)**:
> Same small mobile street food stall as `c2_bg_mom_stall_empty.png` (BG2), **rendered in kawaii cartoon style with WARM BUSY LOVING MOTHER-SON HANDOVER aesthetic**. The **bright blue-and-white striped canvas awning** of the stall casting a small shadow on the warm asphalt road. The **long horizontal wooden counter** with cute cartoon food displays (bánh tráng nướng, xoài lắc, trà đá) and a small chalkboard menu. **Behind the counter**: a **38-year-old Vietnamese woman (Mẹ Tí)** — pastel-blue áo bà ba blouse (hex color #a8c8e0), dark long pants (hex #3a3a4a), small floral half-apron (hex #e0a8c8 + warm green), white rubber sandals (hex #f0f0f0), long straight black hair in low ponytail, kind tired warm eyes, soft round cheeks — handing a small **symbolic cartoon paper money envelope** (phong bì tiền vốn 200k — generic stylized green rectangle, NO real Vietnamese dong) to Tí with both hands, gentle proud maternal smile on her face, slightly leaning forward over the counter. **In front of the counter (customer side)**: a **16-year-old Vietnamese boy (Tí)** — **⭐ MẶC ĐỒ Ở NHÀ (HOME CASUAL CLOTHES) — KHÔNG MẶC ĐỒNG PHỤC, KHÔNG ĐEO BALO, KHÔNG CẦM CẶP SÁCH**: outfit = a **plain white cotton t-shirt** (hex #f0f0f0, simple clean white tee, slightly loose fit, hem at hips, NOT tucked in), **dark navy cotton shorts** (hex #2a3344, knee-length casual shorts), **simple white sneakers** (hex #f0f0f0, clean white casual shoes, NOT sandals, NOT bare feet). **PHYSICAL FEATURES (PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png` mà bạn đã upload — copy các đặc điểm sau 1:1)**: height 168cm, **lean slender teenage build** (gầy, thanh mảnh, dáng nhỏ — so với Tí 13t bầu bĩnh thì gầy hơn nhiều), **clean warm fair skin** (da trắng sáng #f0e0d0, SẠCH, mịn — KHÔNG ngăm, KHÔNG có mụn, KHÔNG có tàn nhang, KHÔNG rám nắng — giống y hệt reference bạn gửi), **short neat pitch-black hair** (tóc đen tuyền, NGẮN, gọn gàng, vuốt nhẹ sang một bên tự nhiên — KHÔNG rối bù, KHÔNG xù, KHÔNG dài, KHÔNG che mắt — giống y hệt reference bạn gửi, đỉnh tóc hơi nhô nhẹ), **longer slim face shape** (mặt dài, thanh, cằm hơi nhọn — KHÔNG tròn xoe, KHÔNG bầu bĩnh), **simple natural black thin eyebrows** (lông mày đen tự nhiên, mỏng, hơi cong nhẹ — KHÔNG rậm, KHÔNG dày), **clean face with NO acne, NO blemishes, NO facial hair** (mặt sạch, KHÔNG mụn, KHÔNG có râu, KHÔNG tàn nhang — giống y hệt reference), **NO kawaii blush circles** (KHÔNG có 2 vòng tròn hồng đậm trên má kiểu kawaii — chỉ shading nhẹ tự nhiên như reference 16t, KHÔNG blush đậm, KHÔNG blush đỏ). **STANDING UPRIGHT** (NOT kneeling, NOT crouching, NOT on the floor), receiving the money envelope with both hands, expression a mix of nervousness and excitement (eyes wide but normal kawaii size, small open-mouthed "aa!" expression, eyebrows slightly raised). **NO backpack on his shoulder, NO school bag in his hands, NO books, NO school uniform — just casual home clothes because Tí just woke up from nap / is in the middle of a casual afternoon at his rental dorm when Mom visits the stall to hand it over**. Behind them: the high school gate visible in the warm distance. **Warm golden late-afternoon sunlight** from upper-right casting long warm shadows on the asphalt, warm bulb glow on the stall counter, soft golden dust particles in the air.
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Both characters MUST closely match the uploaded reference photos (face shape, eye style, hair color, hair style, skin tone, blush). Do NOT redesign the face. Do NOT change eye color. Do NOT change hair color to brown or blonde. Do NOT add anime-style adult features. Do NOT age them up unnaturally. **⭐ DO NOT MAKE TÍ INTO A 13-YEAR-OLD KID: face must look like a 16-year-old teen — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE.
>
> **Lighting**: warm golden late-afternoon sunlight (chiều tà) from upper-right + warm bulb glow on stall counter + soft golden dust particles — **warm busy loving mother-son handover afternoon atmosphere in kawaii cartoon style**.
>
> **Aspect ratio**: 16:9 cinematic, **scene includes Mẹ Tí + Tí in action — BOTH CHARACTERS FULLY VISIBLE FROM HEAD TO TOE**.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 2 — PHÒNG TRỌ TÍ: TÍ NHÌN ĐÔI GIÀY MÒN GÓT + FLASH SALE ĐIỆN THOẠI

### 📄 `c2_bg_dorm_flash_sale.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí ngồi bàn làm bài, điện thoại rung thông báo Flash Sale giày sneaker
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Mission 2.2: Flash Sale 11/11 — Mua sắm cảm xúc. Đang ngồi bấm đề toán trong phòng trọ ban đêm, điện thoại rung thông báo Flash Sale 70% đôi giày sneaker. Tí nhìn đôi giày mòn gót dưới gầm bàn → bị cám dỗ. Đây là khoảnh khắc cám dỗ mua sắm, Tí ở trạng thái nội tâm tempted.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thay đồ casual ở nhà)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 16t có da sạch mịn KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 16t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 16-YEAR-OLD TEENAGER — natural facial proportions, not a 13-year-old kid, not a 10-year-old child, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose style, lip style, face proportions 1:1 from the reference.** **CRITICAL anti-distortion: face proportions stay NORMAL** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + 1 character — WARM COZY NIGHT IN TÍ'S RENTAL DORM ROOM, FLASH SALE TEMPTATION, Studio Ghibli dorm aesthetic)**:
> Same small rental dorm room as `c2_bg_dorm_room_empty.png` (BG1), **rendered in kawaii cartoon style with WARM TEMPTATION NIGHTTIME aesthetic**. The single warm bare bulb hanging from the ceiling casting a warm golden-amber circle of light down onto the small rental desk. The metal-frame bed with pale-blue blanket and pale-blue mosquito net visible in the background. The small rental desk with the **small reading lamp** with soft warm yellow shade ON, casting a small bright pool of warm light on the desk. A few stacked high school textbooks (Toán, Lý, Hóa) and a notebook open with a cartoon pencil lying on it. **A 16-year-old Vietnamese boy (Tí)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1): height 168cm, **lean slender teenage build** (gầy thanh mảnh), **clean warm fair skin** (#f0e0d0, trắng sáng sạch mịn, KHÔNG ngăm, KHÔNG mụn), **short neat pitch-black hair** (tóc đen tuyền gọn gàng vuốt nhẹ sang bên — KHÔNG rối bù, KHÔNG xù, KHÔNG dài), **longer slim face shape** (mặt dài thanh, cằm nhọn, KHÔNG tròn xoe), **simple natural black thin eyebrows** (lông mày mỏng cong nhẹ), clean face with NO acne, NO blemishes, NO facial hair, soft pink blush circles — **SITTING on a small wooden chair** at the desk (NOT kneeling, NOT lying down, NOT on the bed), **wearing casual home clothes** — a **plain white cotton t-shirt** (hex color #f0f0f0, simple clean white tee, slightly loose fit), **dark navy cotton shorts** (hex #2a3344, knee-length casual shorts), **simple white sneakers** (hex #f0f0f0, clean white casual shoes — NOT bare feet, NOT sandals), red canvas backpack (hex #c83b3b) dropped on the floor next to the chair. His **right hand is holding a smartphone** (small kawaii cartoon smartphone with a glowing warm screen showing a **cartoon Flash Sale banner** — bright red background, generic "FLASH SALE 70%" in bubbly cartoon letters, a generic cartoon sneaker icon (NOT real brand, generic red-white cartoon sneaker silhouette), and a "MUA NGAY" button in cartoon style — THIS IS THE ONLY TEXT on the phone screen, all in cartoon handwritten style). His **left hand is gripping the edge of the desk**, leaning forward with **tempted conflicted expression** — eyes wide and sparkling with desire (normal kawaii size, NOT bug-eyed), eyebrows slightly furrowed in conflict, small "o!" open mouth (small, NOT gaping wide), blush circles slightly darker pink. His **worn old pair of school shoes** (đôi giày da đen mòn gót, hex #1a1a1a) is on the floor under the desk, with the **soles visibly worn down** and a small **taped-up toe** — a small visual reminder of why he wants new shoes. A small **electric rice cooker** on the floor next to the desk with a tiny warm steam plume. The **folded note from Mẹ** with the tiny kawaii heart is visible on the desk corner. NO DOORWAY, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING anywhere. **Late afternoon turning to evening** — warm bulb glow + cool blue moonlight starting to come through the window.
>
> **Lighting**: warm bare bulb glow from ceiling + small warm yellow reading lamp pool on the desk + cool blue moonlight starting through the window — **warm temptation late-afternoon-to-evening dorm atmosphere in kawaii cartoon style**.
>
> **Aspect ratio**: 16:9 cinematic, **scene includes Tí in action — FULL CHARACTER FROM HEAD TO TOE VISIBLE**.
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match the uploaded reference photo `c2_ti_dorm_neutral.png` (face shape, eye style, hair color, hair style, skin tone, blush). Do NOT redesign the face. Do NOT change eye color. Do NOT change hair color to brown or blonde. Do NOT add messy/wild hair. Do NOT add acne. Do NOT change skin tone to tan/dark. Do NOT wear different clothes from what is described above. **⭐ DO NOT MAKE TÍ INTO A 13-YEAR-OLD KID: face must look like a 16-year-old teen — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 3 — SÂN TRƯỜNG CẤP 3: HÙNG RỦ TÍ ĐI XEM PHIM

### 📄 `c2_bg_highschool_yard_movie_invite.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Hùng vỗ vai Tí ở sân trường cấp 3, rủ đi xem phim cuối tuần
**Nhân vật trong ảnh**: Tí + Hùng (2 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Mission 2.3: Bạn rủ đi xem phim — Lập ngân sách & Đánh đổi. Sân trường cấp 3 giờ ra chơi, Hùng vỗ vai Tí cười hô hớ rủ đi xem phim cuối tuần (vé + bắp nước 250k). Tí nhớ lịch tuần sau phải nộp 150k tiền quỹ lớp và tiền điện nước với mẹ → do dự. Tí ở trạng thái conflicted tempted (vừa muốn đi vừa lo).

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thay đồng phục cấp 3)
- **Hùng**: upload `c1_hung_neutral.png` làm reference (giữ mặt + slicked hair, chỉ thay đồng phục cấp 3 + tăng chiều cao 172cm + thêm Honda Vision scooter mới)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 16t có da sạch mịn KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 16t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 16-YEAR-OLD TEENAGER — natural facial proportions, not a 13-year-old kid, not a 10-year-old child, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose style, lip style, face proportions 1:1 from the reference.** **CRITICAL anti-distortion: face proportions stay NORMAL.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + 2 characters — WARM SUNNY SMALL-TOWN HIGH SCHOOL YARD, MOVIE INVITATION MOMENT, Studio Ghibli school aesthetic)**:
> Same small-town high school yard as `c2_bg_highschool_yard_empty.png` (BG5), **rendered in kawaii cartoon style with WARM LIVELY BUDDY-INVITATION aesthetic**. Bright cheerful blue sky with soft white clouds. Warm concrete yard with dappled shadows under the mango tree. The 3-story school building in warm cream-yellow on the right with rows of pale-blue-curtained windows. A few **tiny blurred background students** playing basketball in the far distance. **Two 16-year-old Vietnamese boys (Tí + Hùng)** standing face-to-face in the warm dappled shade of the mango tree, both **STANDING UPRIGHT** (NOT sitting, NOT kneeling).
>
> **Character 1 — Hùng (left side of frame, slightly taller)**: **16-year-old Vietnamese boy (Hùng, age-locked 16, Vietnamese nationality)**, height 172cm, well-built teenage build (broader shoulders than Tí and Tèo, slim but athletic-ish), fairer skin than Tí (slightly lighter warm beige tone), glossy black slicked-back hair with more teenage volume on top (NOT childish slick, soft natural combed style, no excessive gel), sharp confident teenage eyes. Outfit: white button-up high school shirt (hex #FFFFFF) neatly tucked into navy blue school pants (hex #1a2b4a), school tie worn properly, **brand-new white sneakers** (hex #FFFFFF, visible clean white cartoon shoes) instead of old ones, smartphone (hex #2a2a2a) in one hand. Behind him is parked his **brand-new silver Honda Vision scooter** (small chunky kawaii cartoon scooter in cream-white hex #f0e8d8 with cute round headlight) casting a small shadow. **The other hand raised in a friendly inviting gesture** toward Tí. Expression: **confident cool teenage smirk**, eyes half-lidded cool, one eyebrow raised. Face proportions STAY NORMAL kawaii size — do NOT distort.
>
> **Character 2 — Tí (right side of frame, slightly shorter than Hùng)**: **16-year-old Vietnamese boy (Tí, age-locked 16, Vietnamese nationality)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1): height 168cm, **lean slender teenage build** (gầy thanh mảnh, KHÔNG vạm vỡ, KHÔNG cơ bắp), **clean warm fair skin** (#f0e0d0, trắng sáng sạch mịn, KHÔNG ngăm, KHÔNG mụn, KHÔNG rám nắng), **short neat pitch-black hair** (tóc đen tuyền gọn gàng vuốt nhẹ sang bên tự nhiên — KHÔNG rối bù, KHÔNG xù, KHÔNG dài, KHÔNG shaggy), **longer slim face shape** (mặt dài thanh, cằm nhọn, KHÔNG tròn xoe), **simple natural black thin eyebrows** (lông mày mỏng cong nhẹ), clean face with NO acne, NO blemishes, NO facial hair. Outfit: white button-up high school shirt (hex #FFFFFF) tucked into navy blue school pants (hex #1a2b4a), red-and-blue striped tie (hex #c83b3b + #1a2b4a), **worn black leather school shoes** (hex #1a1a1a) with visibly worn-down soles (you can see the worn sole detail from this angle), red canvas backpack (hex #c83b3b) on his back. **STANDING UPRIGHT** (NOT sitting, NOT kneeling). Expression: **conflicted tempted expression** — one hand scratching the back of his head (cartoon gesture of thinking/worrying), eyes looking down at his own worn shoes, eyebrows slightly furrowed in concern, small "uh..." mouth (small open mouth, NOT gaping wide), blush circles pink. Face proportions STAY NORMAL kawaii size — do NOT distort.
>
> **Lighting**: warm bright tropical midday sunlight — warm yellow-white light, soft warm dappled shadows under the mango tree, vivid cheerful blue sky — **cozy lively warm high school yard friendship-invitation atmosphere in kawaii cartoon style**.
>
> **Aspect ratio**: 16:9 cinematic, **scene includes Tí + Hùng in action — BOTH CHARACTERS FULLY VISIBLE FROM HEAD TO TOE**.
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Both characters MUST closely match the uploaded reference photos (face shape, eye style, hair color, hair style, skin tone, blush). Do NOT redesign the face. Do NOT change eye color. Do NOT change hair color to brown or blonde. Do NOT add messy/wild hair to Tí. Do NOT add acne to Tí. Do NOT change Tí's skin tone to tan/dark. Do NOT wear different clothes from what is described above. **⭐ DO NOT MAKE TÍ INTO A 13-YEAR-OLD KID: face must look like a 16-year-old teen — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACES MUST REMAIN RECOGNIZABLE FROM REFERENCE.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 4 — SÂN KHẤU LỄ TỔNG KẾT: TÍ NHẬN GIẤY KHEN + PHONG BÌ

### 📄 `c2_bg_stage_ti_award.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí đứng trên sân khấu nhận giấy khen và phong bì tiền thưởng từ cô hiệu trưởng
**Nhân vật trong ảnh**: Tí + Cô Hiệu trưởng (2 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Mission 2.4: Tiền thưởng học sinh giỏi. Lễ tổng kết năm học, cô hiệu trưởng xướng tên Tí lên nhận giấy khen và phong bì tiền thưởng 2.000.000 VNĐ. Khoảnh khắc Tí hãnh diện đứng trên sân khấu, sau lưng là khán giả vỗ tay.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thay đồng phục cấp 3 sạch hơn cho lễ)
- **Cô Hiệu trưởng**: KHÔNG CÓ reference chương 1 (nhân vật mới). Gen trực tiếp không cần upload ảnh.

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 16t có da sạch mịn KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 16t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 16-YEAR-OLD TEENAGER — natural facial proportions, not a 13-year-old kid, not a 10-year-old child, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose style, lip style, face proportions 1:1 from the reference.** **CRITICAL anti-distortion: face proportions stay NORMAL.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + 2 characters — WARM COZY SMALL-TOWN HIGH SCHOOL YEAR-END AWARDS CEREMONY STAGE, PROUD MOMENT, Studio Ghibli school aesthetic)**:
> **⭐ CAMERA POV: VIEWPOINT IS FROM AUDIENCE LEVEL, LOOKING UP AT THE STAGE. The viewer is in the FRONT ROW of the audience seats, looking slightly upward toward the stage where the ceremony happens. This matches the empty BG (`c2_bg_stage_award_empty.png`) perspective.**
> Same school auditorium stage as `c2_bg_stage_award_empty.png` (BG8), **rendered in kawaii cartoon style with WARM PROUD CEREMONIAL aesthetic**. **Behind and around the characters (filling the upper 60-70% of the frame)**: the **stage backdrop** with **red velvet curtains open to both sides** (left and right) revealing the colorful **"LỄ TỔNG KẾT NĂM HỌC"** banner backdrop with small painted flowers and stars in the center. The **wooden podium with microphone** at center-back of stage (podium height ~120cm, reaches chest-height of Tí/Cô Hiệu trưởng — so the TOP of the podium reaches roughly the characters' chest-level, NOT head-level, NOT shoulder-level — characters' HEADS are 1.3-1.5x the height of the podium above the podium top). The **long table on the right** of the stage stacked with red award certificates and gold medals. The **wooden stage floor** with warm circular spotlight pools. **Stage spotlights + ceiling spot rig + ceiling speakers** visible above the stage (matches BG aesthetic). A few small **flower bouquets** on stage. **NO cờ đỏ sao vàng — trường cấp 3 huyện treo băng-rôn và hoa, không treo cờ trên sân khấu**. **In front of the stage (filling the bottom 20-25% of the frame)**: a few rows of **dark audience seating** with **small blurred heads of students** in chairs clapping — this is decorative and confirms the perspective.
> **⭐ BOTH CHARACTERS MUST STAND CENTER-STAGE (upper portion of frame), with the curtain + banner backdrop DIRECTLY BEHIND THEM, and the wooden stage floor with warm spotlight pools DIRECTLY UNDER THEIR FEET. The viewer looks UP at them from the audience seats.** **NOT floating, NOT in front of stage, NOT below stage level, NOT in hallway, NOT in classroom.** **⭐ RELATIVE SCALE — characters must be VISIBLY TALLER than the podium by 1.3 to 1.5 head-heights: podium reaches the characters' chest/upper-torso level, podium top is BELOW the characters' chin. Podium is NOT taller than characters. The characters' shoulders + head must extend WELL ABOVE the podium, with at least 3 head-heights of character visible above the podium top.**
>
> **Character 1 — Tí (center-left of stage)**: **16-year-old Vietnamese boy (Tí, age-locked 16, Vietnamese nationality)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1): height 168cm, **lean slender teenage build** (gầy thanh mảnh), **clean warm fair skin** (#f0e0d0, trắng sáng sạch mịn, KHÔNG ngăm, KHÔNG mụn), **short neat pitch-black hair** (tóc đen tuyền gọn gàng vuốt nhẹ sang bên tự nhiên — KHÔNG rối bù, KHÔNG xù, KHÔNG dài, KHÔNG shaggy), **longer slim face shape** (mặt dài thanh, cằm nhọn, KHÔNG tròn xoe), **simple natural black thin eyebrows** (lông mày mỏng cong nhẹ), clean face with NO acne, NO blemishes, NO facial hair. Outfit: **neat crisp white button-up school uniform shirt with POINTED COLLAR (cổ nhọn, NOT round collar, NOT oversized, NOT t-shirt, NOT casual tee)** (hex #FFFFFF, slim-fit, vừa vặn không rộng, sleeve cuffs at wrists, properly tucked into pants), **navy school pants** (hex #1a2b4a, slim-fit), **red-and-blue tie** (hex #c83b3b + #1a2b4a, properly knotted at the pointed collar), **polished black school shoes** (hex #1a1a1a) — these are slightly cleaner than usual because this is a ceremony day. **STANDING UPRIGHT TALL** on the stage (NOT bowing, NOT kneeling, NOT crouching), **holding a red award certificate (giấy khen đỏ)** with both hands in front of his chest (cartoon chunky red certificate with gold seal and a small cartoon star — generic, NO real names, NO real text except small cartoon "GIẤY KHEN" in cartoon letters), and a **symbolic cartoon paper money envelope** (phong bì tiền thưởng 2 triệu — generic stylized red-yellow envelope, NO real Vietnamese dong, just a generic chunky red envelope with gold cartoon decorations). Expression: **proud happy smile** with sparkly eyes (normal kawaii size, NOT bug-eyed, NOT huge round kawaii eyes), small happy "^^" mouth, **NO kawaii blush circles on cheeks** (chỉ shading nhẹ tự nhiên — không vẽ 2 vòng tròn hồng đậm trên má). Face proportions STAY NORMAL.
>
> **Character 2 — Cô Hiệu trưởng (Tí's left, viewer's right side of frame, STANDING ON STAGE NEXT TO TÍ)**: **50-year-old Vietnamese woman (Cô Hiệu trưởng, age-locked at 50 — KHÔNG quá già, KHÔNG 60-70 tuổi, KHÔNG phải bà nội — là phụ nữ trung niên 50t vẫn đang làm hiệu trưởng)**, height 162cm, slim-mature professional build, smooth warm light-tan skin (NOT wrinkled, NOT elderly-looking, NOT sagging skin, just mature professional — da mịn có vài nếp nhăn nhỏ ở đuôi mắt thôi), hair in **neat low bun** với **tóc ĐEN (hair PITCH-BLACK) chỉ có vài sợi bạc nhỏ lẫn vào — KHÔNG được tóc bạc/trắng/grey/silver chiếm đa số, KHÔNG được như bà ngoại 70t** (màu tóc chính là #1a1a1a đen tuyền, chỉ thêm 2-3 sợi bạc nhỏ), **NORMAL-sized sharp warm adult eyes** (NOT big anime kawaii eyes — this is an adult character, eyes proportionate to mature face, smaller and more dignified than kawaii teen eyes, warm kind proud expression), kind proud warm smile (NOT huge cheshire-cat smile). Outfit: **formal dark-blue áo dài truyền thống** (hex #1a2b4a, traditional Vietnamese long dress reaching ankles, form-fitting at top, flowing at bottom, with simple elegant cartoon flower patterns embroidered on the body), small **gold brooch** at the collar, one hand holding out toward Tí having just given him the certificate and envelope (this hand is extended toward Tí in a congratulatory gesture), the other hand holding a **small microphone** for announcing. Face proportions STAY NORMAL adult style — NOT kawaii giant eyes, NOT chibi-3-head-body, NOT teen face, NOT baby-face, NOT distorted face. **NO kawaii blush circles on cheeks.**
>
> **Lighting**: bright warm stage spotlights from above casting warm yellow-white pools of light on the stage backdrop and floor (so the characters' faces are well-lit by warm spotlights), soft warm ambient glow — **festive proud warm kawaii cartoon school ceremony atmosphere**.

> **⭐ CRITICAL CAMERA + SCALE RULE**: This is a **MEDIUM-WIDE CINEMATIC SHOT** showing both characters on the stage WITH FULL BG VISIBLE — NOT close-up, NOT tight framing, NOT portrait crop, NOT zoomed-in. Both characters occupy roughly **35-50% of vertical frame height** (NOT oversized, NOT dominating the frame). The **stage backdrop (curtains + banner + podium + spotlight rig) occupies roughly 60-70% of frame at the top**, with characters positioned in the upper-center. The **audience seating + heads occupy roughly 20-25% of frame at the bottom**. **Camera is at AUDIENCE-LEVEL (front row) looking slightly UP at the stage** — characters appear slightly elevated against the backdrop. The full stage composition (curtain + banner + podium + table + spotlights + characters + audience) is visible in 16:9. **⭐ NO CROPPING — do NOT crop characters' bodies, do NOT crop BG elements (curtains, banner, podium, spotlights). Show the COMPLETE STAGE composition as one cinematic shot.**
>
> **⭐⭐⭐ CRITICAL RELATIVE SCALE RULE (PODIUM vs CHARACTERS)**: The **wooden podium is ~120cm tall** (chest-height of average adult). The TWO CHARACTERS (Tí 168cm, Cô Hiệu trưởng 162cm) must be VISIBLY MUCH TALLER than the podium — **podium top reaches the characters' CHEST / UPPER-TORSO level, NOT shoulder level, NOT head level**. From the camera POV (looking up from audience): the **characters' HEADS extend WELL ABOVE the podium top by at least 3 head-heights** of character body visible above the podium top. **The characters must look like ADULTS standing behind a podium, NOT shrunk-down kids barely peeking over the podium.** Podium is a SMALL ACCESSORY in the scene (occupies <15% of frame height), characters are the DOMINANT focal point (occupy 35-50% frame height). Stage floor + spotlight pools should be small at the bottom; character bodies occupy most of the frame's middle; backdrop banner takes upper portion.

> **Aspect ratio**: 16:9 cinematic widescreen — **FULL BG VISIBLE (curtains + banner + podium + spotlights + characters + audience), NO CROPPING, characters occupy 35-50% of frame height**.
>
> **⭐ CRITICAL CHARACTER IDENTITY + STAGING RULE**: Both characters MUST closely match the uploaded reference photos. Tí MUST match `c2_ti_dorm_neutral.png` exactly — copy face, hair, skin, body 1:1. Do NOT redesign the face. Do NOT change hair to messy/wild. Do NOT add acne. Do NOT change skin tone to tan/dark. Do NOT put blush circles on cheeks. Do NOT wear t-shirt or round-collar — Tí wears POINTED-COLLAR button-up school shirt. **⭐ STAGING: both characters MUST stand CENTER-STAGE in front of the PODIUM (microphone stand behind/between them), with the red velvet CURTAINS + "LỄ TỔNG KẾT NĂM HỌC" BANNER backdrop DIRECTLY BEHIND them, and the polished wooden STAGE FLOOR with warm SPOTLIGHT pools DIRECTLY UNDER their feet. Camera is at AUDIENCE LEVEL (front row) looking slightly UP at the stage. The audience seating area with small blurred heads of students MUST be visible at the bottom 20-25% of frame to confirm the perspective. They are NOT in audience seating area, NOT on floor level, NOT in hallway, NOT in classroom.** Cô Hiệu trưởng is a NEW character without reference — keep her MATURE ADULT 50-year-old face (NOT kawaii giant eyes, NOT teen face, NOT 70-year-old granny, hair PITCH-BLACK with only 2-3 silver strands, NOT grey hair, NOT silver hair). **Cô Hiệu trưởng's hair MUST be primarily PITCH-BLACK (#1a1a1a), with ONLY 2-3 thin silver strands mixed in for realism — NOT grey, NOT white, NOT silver hair dominant.** **⭐ DO NOT MAKE TÍ INTO A 13-YEAR-OLD KID: Tí's face must look like a 16-year-old teen — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** **⭐ SCALE: characters occupy 35-50% of frame height (NOT oversized dominating the frame). FULL BG composition visible — curtains, banner, podium, spotlight rig, audience. NO CROPPING.** **⭐⭐ PODIUM SCALE FIX: The wooden podium is ~120cm tall — it reaches only the characters' CHEST/UPPER-TORSO level. The characters' HEADS extend at least 3 head-heights ABOVE the podium top. The podium looks like a small accessory in the scene (<15% of frame height); the characters DOMINATE the frame.** Kawaii 2D cartoon style but FACES MUST REMAIN RECOGNIZABLE.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 5 — ĐƯỜNG PHỐ THỊ TRẤN: TÍ BƯỚC RA KHỎI QUÁN NET, CHỖ ĐỂ XE TRỐNG

### 📄 `c2_bg_internet_cafe_bike_stolen.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene "Bước ra thì chiếc xe đạp màu xanh da trời đã không còn cánh nào..."
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Life Event 2: Mất xe đạp. Tí ghé quán net gần nhà chơi 30 phút, bước ra thì xe đạp bị trộm. Khoảnh khắc Tí đứng sững trước chỗ để xe trống — biểu cảm sốc, hốt hoảng, lạnh sống lưng.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thay đồng phục cấp 3)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 16t có da sạch mịn KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 16t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 16-YEAR-OLD TEENAGER — natural facial proportions, not a 13-year-old kid, not a 10-year-old child, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose style, lip style, face proportions 1:1 from the reference.** **CRITICAL anti-distortion: face proportions stay NORMAL** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + 1 character — DRAMATIC COZY SMALL-TOWN STREET AT NIGHT, EMPTY BIKE RACK, Studio Ghibli sad-moment aesthetic)**:
> **⭐⭐⭐ CRITICAL COMPOSITION — TÍ IS STARING AT THE EMPTY BIKE RACK. The frame is composed so that:**
> **- Tí stands in the LEFT-CENTER FOREGROUND** (occupying ~40-50% of frame width, ~55-70% of frame height — from head to feet visible).
> **- The EMPTY BIKE RACK with the 2 EMPTY SLOTS is positioned at the RIGHT-CENTER of the frame**, at a distance of ~2-3 meters from Tí, on the same horizontal level as Tí so Tí's eye-line naturally falls on the empty slots.
> **- Tí's HEAD AND EYES ARE TURNED TOWARD THE EMPTY BIKE RACK** (Tí's face/body angled ~3/4 toward viewer's left, but head turned RIGHT to look at the empty rack — creating a "looking-back-at-something" pose).
> **- Tí's GAZE LINE** from his eyes clearly points AT the 2 empty slots of the bike rack (the viewer can SEE what Tí is looking at).
> **- The empty rack + the 2 EMPTY CURVED METAL HOOKS are the VISUAL FOCAL POINT on the right side of the frame** — viewer reads "Tí is looking at the empty rack, his bike is gone."
> Same small-town street with empty bike rack as `c2_bg_town_street_bike_stolen_empty.png` (BG10), **rendered in kawaii cartoon style with WARM SAD-REALIZATION NIGHTTIME aesthetic**. The deep blue-purple night sky with small stars and a crescent moon. The small metal bike rack in chunky kawaii dark-gray cartoon style, positioned at RIGHT-CENTER of the frame, with **3 remaining bikes in the rack** (red, black, warm-gray) and **2 EMPTY slots** (the empty curved metal hooks clearly visible where Tí's blue bike used to be — the absence is the focus, the 2 empty hooks should look prominent and conspicuous). **On the ground below the empty slots**: a **broken bike lock (chain lock cut in half)** lying on the asphalt (cartoon chunky silver chain lock with 2 separated broken halves, NOT a clean cut, the broken metal links clearly visible — telling the story "the thief cut the lock"). The closed internet cafe behind with rolling shutters half-closed and warm yellow bulb above the door (positioned in LEFT-BACKGROUND, behind Tí, suggesting Tí just stepped out of this cafe). The dim warm yellow street lamps casting pools of yellow light on the dark asphalt street. A few small **fallen leaves** on the ground.
>
> **Character — Tí (LEFT-CENTER FOREGROUND of frame, HEAD TURNED TO LOOK AT THE EMPTY BIKE RACK ON THE RIGHT)**: **16-year-old Vietnamese boy (Tí, age-locked 16, Vietnamese nationality)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1): height 168cm, **lean slender teenage build** (gầy thanh mảnh), **clean warm fair skin** (#f0e0d0, trắng sáng sạch mịn, KHÔNG ngăm, KHÔNG mụn), **short neat pitch-black hair** (tóc đen tuyền gọn gàng vuốt nhẹ sang bên tự nhiên — KHÔNG rối bù, KHÔNG xù, KHÔNG dài, KHÔNG shaggy), **longer slim face shape** (mặt dài thanh, cằm nhọn, KHÔNG tròn xoe), **simple natural black thin eyebrows** (lông mày mỏng cong nhẹ), clean face with NO acne, NO blemishes, NO facial hair. Outfit: **school uniform** — white shirt tucked (hex #FFFFFF), navy pants (hex #1a2b4a), red-and-blue tie (hex #c83b3b + #1a2b4a), worn black shoes (hex #1a1a1a), red canvas backpack on his back (hex #c83b3b). **POSING**: **body facing slightly toward viewer (~3/4 angle, with his LEFT shoulder closer to viewer)**, **head TURNED 90° TO THE RIGHT** so he's looking back over his right shoulder at the empty bike rack. **Both arms hang limply at his sides** (NOT raised, NOT in pockets, NOT crossed — just hanging in shock like a frozen puppet), **his school backpack still on his back** (he just walked out of the cafe). **One foot slightly forward** as if he just took a step out and then froze mid-step. Expression: **shocked horrified realization of LOSS** — **eyes wide and staring with horror (normal kawaii size, NOT bug-eyed, NOT distorted)** focused on the empty rack (NOT at viewer, NOT at random spot — eyes clearly aimed at the empty hooks), **eyebrows raised HIGH in fear/surprise**, **small open "O" mouth** (small, NOT gaping wide, NOT horror scream, NOT cartoonish yelling — a quiet gasp of realization, like "Oh no..."), **slight sweat drop** on the side of his head (1 small cartoon kawaii sweat drop near temple — NOT multiple drops, NOT full panic), **blush circles slightly faded** (shock drains the blush), **NO kawaii blush circles on cheeks**, **face slightly pale** (subtle pale shading under eyes, like the color just drained). The overall pose reads: **"He just walked out of the cafe, took one step, and froze — staring at the empty bike rack in dawning horror."** Face proportions STAY NORMAL kawaii size — do NOT enlarge head, do NOT stretch face, do NOT bug-eye out the eyes even in shock.
>
> **Behind Tí**: a few **tiny blurred pedestrians** walking away in the warm distance (very small, decorative). A small **drinking stall** (quán trà đá) still open with a warm bulb on the right side. The atmosphere is **sad lonely realization** — the bike is gone, Tí is alone in the dark street. NO DOORWAY, NO DOORFRAME BORDER, NO WINDOW FRAME BORDER.
>
> **Lighting**: dim warm yellow-orange street-lamp pools + small warm bulb glow on the closed cafe + dark deep-blue-purple night sky + soft warm reflection on the asphalt. **Cool blue moonlight on Tí** (subtle blue tint on Tí's skin/hair from the night sky, contrasting with the warm yellow street-lamp pool on the empty bike rack area — creates the "cold realization vs warm street" mood). **Quiet warm lonely sad small-town night atmosphere in kawaii cartoon style.**
>
> **Aspect ratio**: 16:9 cinematic widescreen. **⭐⭐⭐ SCENE COMPOSITION — Tí in LEFT-CENTER FOREGROUND looking at EMPTY BIKE RACK in RIGHT-CENTER: Tí occupies ~40-50% of frame width on the LEFT side, the empty bike rack + 2 empty hooks + broken chain lock occupy ~25-30% of frame width on the RIGHT side. Tí and the empty rack are separated by ~30-40% empty asphalt middle ground. Tí's HEAD IS TURNED RIGHT (90°) so he's clearly looking AT the empty rack. Both Tí (head to feet visible) AND the empty rack are FULLY VISIBLE in 16:9, NO CROPPING.**

> **⭐⭐⭐ CRITICAL SCENE STAGING + STARE RULE**: This scene is ABOUT THE STARE. Tí MUST be looking AT the empty bike rack — his eyes, head turn, and gaze line MUST all clearly point at the 2 empty hooks. The viewer MUST be able to read the storytelling: "Tí is staring in shock at the empty rack where his bike used to be, with the broken chain lock on the ground." If Tí is not actively staring at the empty rack with a horrified expression, the scene FAILED. **Tí MUST NOT be looking at the viewer, NOT looking at the cafe door, NOT looking at random spot — he is locked onto the empty rack in dawning horror.**
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match the uploaded reference photo `c2_ti_dorm_neutral.png` (face shape, eye style, hair color, hair style, skin tone, blush). Do NOT redesign the face. Do NOT change hair to messy/wild. Do NOT add acne. Do NOT change skin tone to tan/dark. Do NOT wear different clothes. **⭐ DO NOT MAKE TÍ INTO A 13-YEAR-OLD KID: face must look like a 16-year-old teen — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE. **⭐⭐ SCALE FIX: Tí occupies 55-70% of vertical frame height (from head to feet visible) — Tí is the FOCAL POINT on the LEFT side, NOT cropped, NOT close-up, NOT bust shot. The empty bike rack + broken chain lock on the RIGHT is the SECONDARY FOCAL POINT.**
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 6A — SẠP HÀNG MẸ: TÍ BÁN HÀNG THÀNH CÔNG (ĐÔNG KHÁCH, VUI VẺ)

### 📄 `c2_bg_mom_stall_busy_SUCCESS.png`
**Loại**: SCENE (composite, có nhân vật) — **phiên bản THÀNH CÔNG**
**Dùng cho**: `narrator` — Cutscene hậu quả Mission 2.1 — Chọn A (nhập nguyên liệu sạch → bán hết veo trong 1 tiếng)
**Nhân vật trong ảnh**: Tí (chính, sau quầy) + 5-6 học sinh khách hàng (background nhỏ)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Mission 2.1 hậu quả (nhánh thành công). Tí nhập nguyên liệu sạch từ Mẹ, sạp bán hết veo trong 1 tiếng, đông khách nườm nượp. Tí mệt nhưng vui vẻ, tự hào — lần đầu tiên trong đời kiếm được tiền bằng sức lao động chân chính.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thay đồng phục cấp 3 + tạp dề trắng)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE — SCENE 6A (SUCCESS) ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 16t có da sạch mịn KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 16t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 16-YEAR-OLD TEENAGER — natural facial proportions, not a 13-year-old kid, not a 10-year-old child, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose style, lip style, face proportions 1:1 from the reference.** **CRITICAL anti-distortion: face proportions stay NORMAL.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + characters — WARM BUSY SUCCESSFUL SMALL-TOWN HIGH SCHOOL STALL LATE AFTERNOON)**:
> Same small mobile street food stall as `c2_bg_mom_stall_empty.png` (BG2), **rendered in kawaii cartoon style with WARM BUSY HUSTLE-BUSTLE SUCCESSFUL-CROWD aesthetic**. The blue-and-white striped awning with tiny cartoon pennants. The long wooden counter. **NOT EMPTY anymore — the stall is THRIVING**. **Behind the stall (filling ~40% of frame width at top-left and top-center)**: the high school gate in warm distance with golden hour glow, the school building with VN flag, a few **warm autumn trees**. **The stall area (center of frame, ~50% width × 60% height)**: blue-and-white striped awning, long wooden counter, big **"BÁN SẠCH TRONG HÔM NAY"** handwritten cartoon cardboard sign in red marker propped on the counter (THIS IS THE ONLY TEXT in the image), a small cartoon cash box open with stacks of green cartoon money bills visible, scattered **empty food containers** on the counter showing how fast the food sold out (this tells the story "everything is sold out, the stall was a hit"), a few remaining **bánh tráng nướng and xoài lắc** on display plates (just 2-3 left, almost sold out), a small **paper receipt roll** on the side. **In front of the counter (filling ~50% of frame width at bottom)**: **5-6 small cute background high school students** (very small, ~30-40% of Tí's height) crowding around the stall, wearing **white áo dài nữ sinh** (3-4 girls) or **blue-white school uniforms nam sinh** (2 boys), some **holding small green cartoon money bills** outstretched toward the stall, some **holding small cartoon food packages** happily, all with **happy excited expressions**, a few **small cute gesture lines** around them showing the bustling energy. NO empty space — the crowd fills the front area completely. **Above the stall**: a few small floating **cartoon stars + sparkles** showing the success vibe.
>
> **Character — Tí (BEHIND THE COUNTER, CENTER-LEFT of frame, working as busy shopkeeper)**: **16-year-old Vietnamese boy (Tí, age-locked 16, Vietnamese nationality)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1): height 168cm, **lean slender teenage build** (gầy thanh mảnh), **clean warm fair skin** (#f0e0d0, trắng sáng sạch mịn, KHÔNG ngăm, KHÔNG mụn), **short neat pitch-black hair** (tóc đen tuyền gọn gàng vuốt nhẹ sang bên tự nhiên — KHÔNG rối bù, KHÔNG xù, KHÔNG dài, KHÔNG shaggy), **longer slim face shape** (mặt dài thanh, cằm nhọn, KHÔNG tròn xoe), **simple natural black thin eyebrows** (lông mày mỏng cong nhẹ), clean face with NO acne, NO blemishes, NO facial hair. Outfit: **⭐⭐⭐ CASUAL HOME WEAR (Tí's clothes he wears at his rental dorm — SAME AS reference `c2_ti_dorm_neutral.png` casual outfit) + white apron on top + NO backpack**:
> - **White casual t-shirt** (hex #FFFFFF, **CREW-NECK round collar** — this is Tí's HOME t-shirt, NOT a school uniform shirt with pointed collar, NOT a dress shirt, NOT a polo — a simple soft cotton t-shirt with **round crew neckline**, slightly loose fit) — same casual white t-shirt as the reference `c2_ti_dorm_neutral.png`. **Sleeves are short** (NOT rolled-up, NOT long-sleeved — t-shirt has natural short sleeves).
> - **Navy shorts** (hex #1a2b4a, knee-length chino shorts, slim-fit) — same casual navy shorts as the reference `c2_ti_dorm_neutral.png`. Casual home shorts, NOT school uniform pants.
> - **White sneakers / canvas shoes** (hex #f5f5f0) — same casual white shoes as the reference `c2_ti_dorm_neutral.png`. Casual slip-on sneakers, NOT polished black school shoes.
> - **⭐ WHITE HALF-APRON** (tạp dề trắng, hex #f5f5f0) — TIED AT HIS WAIST OVER his casual t-shirt + shorts (covering from waist to mid-thigh) — **THIS IS THE KEY ITEM** that tells the viewer "Tí is the shopkeeper". The apron has a small front pocket. **WITHOUT THE APRON, THE OUTFIT IS INCOMPLETE — Tí MUST be wearing the white apron PROMINENTLY VISIBLE in the frame.**
> - **⭐ NO BACKPACK ON BACK** — Tí is working, NOT a student walking home. He's wearing his casual home clothes + apron only.
> - **NO SCHOOL UNIFORM in this scene** — Tí is NOT wearing school uniform (no pointed-collar shirt, no tie, no navy pants, no black shoes). He's wearing his **casual home outfit** because he came straight from his rental dorm to the stall. The school uniform (with pointed collar + tie) was only for the previous scene (going to school / going home / Mẹ handover scene).
>
> This outfit should look like **Tí's reference `c2_ti_dorm_neutral.png` (white t-shirt + navy shorts + white sneakers) + white apron on top**. Same character, same casual home clothes, same colors — just with apron added for working at the stall. **POSING**: **STANDING UPRIGHT BEHIND THE COUNTER** (NOT in front, NOT kneeling, NOT on the floor — he's the shopkeeper at work), **one hand** (his right hand) **holding out a small cartoon food package** toward a customer (giving change / handing over the food), **other hand** (his left hand) **resting on the counter** with a small green cartoon money bill in it (just received payment). Body slightly turned toward the customers in front. Expression: **PROUD HAPPY TIRED BUT ACCOMPLISHED SMILE** — eyes **sparkling with happiness and pride** (normal kawaii size, NOT bug-eyed, NOT distorted), a few small **cartoon sweat drops** on his forehead + temple (1-2 small drops, showing he has been working hard for 1 hour straight — this is GOOD tired, working-tired, NOT sick-tired), mouth in a **wide happy grin** showing his teeth (kawaii "haha" grin, NOT creepy, NOT too wide, NOT horror-smile), **NO kawaii blush circles on cheeks** (chỉ shading nhẹ tự nhiên — natural 16t skin như reference), natural warm slight rosiness from working hard. Face proportions STAY NORMAL kawaii size. He looks like a **young shopkeeper PROUD of his first successful day** — not a kid, not a teen in costume, but a real working teenager.
>
> **Lighting**: **WARM GOLDEN LATE-AFTERNOON SUNSET GLOW** from upper-right (signature chương 2 chiều tà) + warm bulb glow on stall counter + soft golden rim-light on Tí + warm orange-yellow ambient — **PROUD SUCCESSFUL BUZZING WARM AFTERNOON kawaii cartoon stall atmosphere**. Slight warm orange-tint over the whole frame (golden hour mood).
>
> **Aspect ratio**: 16:9 cinematic widescreen. **Tí FULLY VISIBLE FROM HEAD TO TOE behind the counter (55-70% of vertical frame height), 5-6 background students FULLY VISIBLE in front of the counter (30-40% of Tí's height each), stall + awning + sign + counter all FULLY VISIBLE, NO CROPPING.**
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match the uploaded reference photo `c2_ti_dorm_neutral.png` (face shape, eye style, hair color, hair style, skin tone, blush). Do NOT redesign the face. Do NOT change hair to messy/wild. Do NOT add acne. Do NOT change skin tone to tan/dark. Do NOT wear different clothes from what is described above. **⭐ DO NOT MAKE TÍ INTO A 13-YEAR-OLD KID: face must look like a 16-year-old teen — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE. Crowd characters (5-6 background students) are minor decorative figures — they do NOT need reference, just keep them small and cute in school uniforms.

> **⭐⭐⭐ FINAL OUTFIT REMINDER — CASUAL HOME CLOTHES (T-shirt + shorts + sneakers) + WHITE APRON + NO SCHOOL UNIFORM**: Tí MUST wear his **CASUAL HOME OUTFIT** from his reference `c2_ti_dorm_neutral.png`: **white round-neck t-shirt** (NOT pointed-collar shirt, NOT dress shirt, NOT polo, NOT school uniform) + **navy shorts** + **white sneakers** — WITH the white apron tied at his waist. **NO school uniform** (no tie, no pointed-collar shirt, no black shoes, no navy pants). **NO backpack**. The casual white t-shirt is the KEY visual cue (together with the apron) that tells viewers "Tí is the shopkeeper who came straight from his rental dorm, NOT a student in uniform". Round crew neckline is REQUIRED — NOT pointed collar.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE — SCENE 6A (SUCCESS) ⭐**

---

---

## 📍 SCENE 6B — SẠP HÀNG MẸ: TÍ BỊ TỊCH THU HÀNG (ĐÌNH CHỈ, BUỒN BÃ)

### 📄 `c2_bg_mom_stall_busy_FAIL.png`
**Loại**: SCENE (composite, có nhân vật) — **phiên bản THẤT BẠI**
**Dùng cho**: `narrator` — Cutscene hậu quả Mission 2.1 — Chọn B (nhập bột trôi nổi → học sinh đau bụng → bị tịch thu hàng)
**Nhân vật trong ảnh**: Tí (chính, sau quầy) + 1 nhân viên chức năng (bên trái)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 2 — Mission 2.1 hậu quả (nhánh thất bại). Tí nhập bột trôi nổi rẻ tiền để tăng lợi nhuận. Sau 1 tuần, nhiều học sinh đau bụng phải đi khám. Tí bị cán bộ y tế / quản lý thị trường đến tịch thu toàn bộ hàng hóa, đình chỉ sạp. Tí đứng sau quầy trống, mặt buồn bã, có lỗi, sợ gọi điện về cho Mẹ.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c2_ti_dorm_neutral.png` làm reference (giữ y hệt khuôn mặt + tóc + da + style từ ảnh reference 16t; **CHỈ** thay đồng phục cấp 3 + tạp dề trắng)

---

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE — SCENE 6B (FAIL) ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). **head-to-body ratio 1:4 to 1:5** (MEDIUM head, NATURAL teenage body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), **NATURAL-LOOKING medium-sized eyes** (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), **MEDIUM-thickness outlines** (vừa phải, KHÔNG thick black chibi outline), **soft flat cel-shading with gentle gradients** (chuyển sắc nhẹ ở mặt + áo — không flat 100%), **VERY SUBTLE natural teen skin shading, NO kawaii blush circles on cheeks** (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên như reference; reference 16t có da sạch mịn KHÔNG blush kiểu kawaii), **warm natural soft lighting** (không warm-cozy-cute quá mức), **gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc như reference 16t**, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. **CRITICAL: face must look like a 16-YEAR-OLD TEENAGER — natural facial proportions, not a 13-year-old kid, not a 10-year-old child, not a baby. The face MUST closely follow the uploaded reference `c2_ti_dorm_neutral.png` — copy face shape, eye size, eye style, eyebrow shape, nose shape, lip style, face proportions 1:1 from the reference.** **CRITICAL anti-distortion: face proportions stay NORMAL.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**
>
> **Setting (kawaii cartoon environment + characters — SAD EMPTY FAILURE SMALL-TOWN HIGH SCHOOL STALL LATE AFTERNOON, GUILTY SHAMEFUL MOMENT)**:
> Same small mobile street food stall as `c2_bg_mom_stall_empty.png` (BG2), **rendered in kawaii cartoon style with COLD SAD SHAMEFUL EMPTY aesthetic**. The blue-and-white striped awning (looking faded now). The long wooden counter. **NOT CROWDED — the stall is EMPTY and SHUT DOWN**. **Behind the stall (filling ~40% of frame width at top-left and top-center)**: the high school gate in cool gray distance (NOT warm golden anymore — the warm golden hour has passed, now it feels cold and gray), the school building looking dim. **The stall area (center of frame, ~50% width × 60% height)**: blue-and-white striped awning looking faded and droopy, long wooden counter now **EMPTY** (no food displays remaining — all seized), a big **red-and-white "BỊ ĐÌNH CHỈ" / "ĐÃ TỊCH THU"** sign (THIS IS THE ONLY TEXT in the image, hand-written style in red marker on white cardboard, taped crookedly on the awning with visible tape), an **open red confiscation box** on the counter with a clipboard showing a **confiscation report** (cartoon chunky red box with sealed papers), a small **sealed evidence bag** with confiscated items inside (cartoon chunky transparent bag with red tape), **2 small cartoon "X" red warning marks** on the awning showing "do not operate". **In front of the counter (filling ~40% of frame width at LEFT side)**: **1 small authority figure** (small chunky cartoon figure ~50-60% of Tí's height) wearing **dark navy uniform with a small badge and a wide-brim hat** (cartoon cán bộ quản lý thị trường / y tế — NOT police, NOT scary, but stern authority figure), **pointing at the confiscation report** with one hand and **holding a clipboard with the other**, looking SERIOUS but NOT angry — just doing their job. The front area otherwise EMPTY (no customers, no crowd — just empty asphalt + 1 small authority figure). **A few small fallen leaves on the ground** (sad autumn atmosphere). The stall looks like a **place that has just been shut down**.
>
> **Character — Tí (BEHIND THE COUNTER, CENTER-RIGHT of frame, looking GUILTY and SAD)**: **16-year-old Vietnamese boy (Tí, age-locked 16, Vietnamese nationality)** — **PHẢI GIỐNG Y HỆT ẢNH REFERENCE 16t `c2_ti_dorm_neutral.png`** (copy 1:1): height 168cm, **lean slender teenage build** (gầy thanh mảnh), **clean warm fair skin** (#f0e0d0, trắng sáng sạch mịn, KHÔNG ngăm, KHÔNG mụn — now slightly **paler** than usual from stress/guilt), **short neat pitch-black hair** (tóc đen tuyền gọn gàng — now slightly **messy/drooping** because he's been stressed all day, NOT wildly messy, NOT bedhead, just a little disheveled showing he's not taking care of himself well), **longer slim face shape** (mặt dài thanh, cằm nhọn, KHÔNG tròn xoe), **simple natural black thin eyebrows** (lông mày mỏng — now slightly **drawn together in worry**, NOT furrowed angry), clean face with NO acne, NO blemishes, NO facial hair. Outfit: **⭐⭐⭐ CASUAL HOME WEAR (Tí's clothes he wears at his rental dorm — SAME AS reference `c2_ti_dorm_neutral.png` casual outfit) + white apron on top + NO backpack** (same base outfit as Success version, but now showing signs of the hard day + stress):
> - **White casual t-shirt** (hex #FFFFFF, **CREW-NECK round collar** — this is Tí's HOME t-shirt, NOT school uniform, NOT dress shirt, NOT polo — a simple soft cotton t-shirt with **round crew neckline**) — same casual white t-shirt as the reference `c2_ti_dorm_neutral.png`. Short sleeves.
> - **Navy shorts** (hex #1a2b4a, knee-length chino shorts) — same casual navy shorts as the reference `c2_ti_dorm_neutral.png`.
> - **White sneakers** (hex #f5f5f0) — same casual white shoes as the reference `c2_ti_dorm_neutral.png`.
> - **⭐ WHITE HALF-APRON** (tạp dề trắng, hex #f5f5f0) — TIED AT HIS WAIST OVER his casual t-shirt + shorts — same apron as Success version, but now with a small **cartoon stain** (like a small smudge) from the day's events. **THE APRON MUST BE VISIBLE** — it's still on him because he was just working.
> - **⭐ NO BACKPACK ON BACK** — Tí is working, NOT a student.
> - **NO SCHOOL UNIFORM in this scene** — Tí is NOT wearing school uniform (no pointed-collar shirt, no tie, no navy pants, no black shoes). He's wearing his **casual home outfit** because he came straight from his rental dorm to the stall.
>
> This outfit should look like **Tí's reference `c2_ti_dorm_neutral.png` (white t-shirt + navy shorts + white sneakers) + white apron** + signs of stress. Same character, same casual home clothes, same colors — but now showing the hard day + the consequence. **POSING**: **STANDING UPRIGHT BEHIND THE COUNTER** (NOT in front, NOT kneeling, NOT on the floor), **both hands gripping the edge of the counter** (NOT in pockets, NOT raised — holding the counter for support, like he's trying to stay standing through the shame), body slightly turned toward the authority figure on the left (he has to face them), **shoulders slightly slumped** (NOT hunched cartoonishly, just slightly lowered — body language of defeat). Expression: **WORRIED GUILTY ASHAMED** — eyes **wide with worry** but **NOT crying, NOT bug-eyed** (normal kawaii size, soft worried gaze looking DOWN at the counter, NOT at authority figure, NOT at viewer — he can't look anyone in the eye), **eyebrows slightly drawn up in the middle** (worried pinch, NOT angry furrow, NOT cartoonish "^_^" worry), mouth in a **small worried "..." expression** (small downturned mouth, lips pressed together, NOT gaping, NOT screaming, NOT cartoonishly sad — a quiet shame), **2-3 small cartoon sweat drops** on his forehead + temple (stress sweat from the humiliation), **NO kawaii blush circles on cheeks** (chỉ shading nhẹ tự nhiên — natural 16t skin như reference, but slightly paler from guilt), **NO tears** (this is a 16-year-old boy trying to hold it together, NOT a kid crying). Face proportions STAY NORMAL kawaii size. He looks like a **teen who knows he made a mistake and is facing the consequences** — sad, ashamed, but still standing.
>
> **Lighting**: **COOL GRAY OVERCAST LATE-AFTERNOON GLOW** from upper-right (NOT warm golden hour anymore — the warm has drained out of the scene to reflect Tí's mood), cool white bulb glow on stall counter (the only warm light source, dim), soft cool blue-gray ambient — **SAD SHAMEFUL GUILTY QUIET kawaii cartoon stall atmosphere**. Slight cool blue-tint over the whole frame (cold reality hitting). NOT dark, NOT nighttime — still daytime late afternoon, just emotionally cold.
>
> **Aspect ratio**: 16:9 cinematic widescreen. **Tí FULLY VISIBLE FROM HEAD TO TOE behind the counter (55-70% of vertical frame height), 1 authority figure FULLY VISIBLE on the LEFT side (~50-60% of Tí's height), stall + awning + sign + counter + confiscation box all FULLY VISIBLE, NO CROPPING.**
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match the uploaded reference photo `c2_ti_dorm_neutral.png` (face shape, eye style, hair color, hair style, skin tone, blush). Do NOT redesign the face. Do NOT change hair to messy/wild. Do NOT add acne. Do NOT change skin tone to tan/dark (note: slight paler from stress is OK). Do NOT wear different clothes from what is described above. **⭐ DO NOT MAKE TÍ INTO A 13-YEAR-OLD KID: face must look like a 16-year-old teen — natural facial proportions, NOT baby-face, NOT toddler-face, NOT huge round kawaii eyes, NOT thick chibi outline, NOT 2 kawaii blush circles on cheeks. Copy face 1:1 from reference `c2_ti_dorm_neutral.png`.** Kawaii 2D cartoon style but FACE MUST REMAIN RECOGNIZABLE FROM REFERENCE. The 1 authority figure is a minor decorative character — does NOT need reference, just keep them small in dark uniform with hat.

> **⭐⭐⭐ FINAL OUTFIT REMINDER — CASUAL HOME CLOTHES (T-shirt + shorts + sneakers) + WHITE APRON + NO SCHOOL UNIFORM**: Tí MUST wear his **CASUAL HOME OUTFIT** from his reference `c2_ti_dorm_neutral.png`: **white round-neck t-shirt** (NOT pointed-collar shirt, NOT dress shirt, NOT polo, NOT school uniform) + **navy shorts** + **white sneakers** — WITH the white apron tied at his waist (with a small smudge from the day's events). **NO school uniform** (no tie, no pointed-collar shirt, no black shoes, no navy pants). **NO backpack**. The casual white t-shirt is the KEY visual cue that tells viewers "Tí was just working when the authority came, in his casual home clothes + apron". Round crew neckline is REQUIRED — NOT pointed collar.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE — SCENE 6B (FAIL) ⭐**

---

---

# 📋 BẢNG TỔNG HỢP

## Tất cả BG (không nhân vật) — 10 file

| # | Filename | Địa điểm | Thời gian | Loại scene VN | Dùng cho cốt truyện | Aspect |
|---|---|---|---|---|---|---|
| BG1 | `c2_bg_dorm_room_empty.png` | Phòng trọ Tí | Tối | `dialogue` | Mission 2.1, 2.2, 2.3 | 16:9 |
| BG2 | `c2_bg_mom_stall_empty.png` | Sạp hàng Mẹ cổng trường | Chiều tà | `dialogue` | Mission 2.1 | 16:9 |
| BG3 | `c2_bg_school_gate_empty.png` | Cổng trường cấp 3 | Chiều vàng | `narrator` tĩnh | Mở đầu chương 2 | 16:9 |
| BG4 | `c2_bg_classroom_empty.png` | Lớp học cấp 3 | Tối (đèn sáng) | `dialogue` | Mission 2.2 (Flash Sale) | 16:9 |
| BG5 | `c2_bg_highschool_yard_empty.png` | Sân trường cấp 3 | Trưa | `dialogue` | Mission 2.3 (rủ xem phim) | 16:9 |
| BG6 | `c2_bg_cinema_lobby_empty.png` | Rạp phim huyện | Tối | `dialogue` | Mission 2.3 (trước mua vé) | 16:9 |
| BG7 | `c2_bg_internet_cafe_empty.png` | Quán net | Tối (đèn neon) | `dialogue` / `narrator` tĩnh | Life Event 2 (mất xe) | 16:9 |
| BG8 | `c2_bg_stage_award_empty.png` | Sân khấu lễ tổng kết | Trưa | `dialogue` / `narrator` tĩnh | Mission 2.4 (nhận giấy khen) | 16:9 |
| BG9 | `c2_bg_shoe_store_empty.png` | Cửa hàng giày sneaker | Trưa | `dialogue` | Mission 2.2 (cám dỗ mua giày) | 16:9 |
| BG10 | `c2_bg_town_street_bike_stolen_empty.png` | Đường phố thị trấn (xe mất) | Tối | `narrator` tĩnh | Life Event 2 (nhận ra xe mất) | 16:9 |

## Tất cả SCENE (có nhân vật) — 7 file

| # | Filename | Địa điểm | Nhân vật | Loại scene VN | Dùng cho cốt truyện | Aspect |
|---|---|---|---|---|---|---|
| SC1 | `c2_bg_mom_stall_handover.png` | Sạp hàng Mẹ (chiều tà) | Mẹ + Tí | `narrator` | Mission 2.1 (mở đầu — giao sạp) | 16:9 |
| SC2 | `c2_bg_dorm_flash_sale.png` | Phòng trọ Tí (tối) | Tí | `narrator` | Mission 2.2 (Flash Sale cám dỗ) | 16:9 |
| SC3 | `c2_bg_highschool_yard_movie_invite.png` | Sân trường cấp 3 (trưa) | Tí + Hùng | `narrator` | Mission 2.3 (Hùng rủ xem phim) | 16:9 |
| SC4 | `c2_bg_stage_ti_award.png` | Sân khấu lễ tổng kết (trưa) | Tí + Cô Hiệu trưởng | `narrator` | Mission 2.4 (nhận giấy khen) | 16:9 |
| SC5 | `c2_bg_internet_cafe_bike_stolen.png` | Đường phố thị trấn (tối) | Tí | `narrator` | Life Event 2 (xe bị mất) | 16:9 |
| SC6a | `c2_bg_mom_stall_busy_SUCCESS.png` | Sạp hàng Mẹ (chiều tà) | Tí + crowd | `narrator` | Mission 2.1 — Chọn A (thành công) | 16:9 |
| SC6b | `c2_bg_mom_stall_busy_FAIL.png` | Sạp hàng Mẹ (chiều tà) | Tí | `narrator` | Mission 2.1 — Chọn B (thất bại) | 16:9 |

## Tổng: 17 prompts (10 BG + 7 SCENE — bao gồm 2 phiên bản SC6)

---

# 🔑 QUY TẮC STYLE BẮT BUỘC

> **⚠️ MỌI prompt trong file này phải tuân theo quy tắc dưới đây — vi phạm sẽ ra ảnh sai art style.**

### Về STYLE TOKEN
- **BẮT BUỘC** dùng full kawaii 2D style token trong MỌI prompt (BG + SCENE):
  ```
  Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, 
  head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes with 
  two large white circle highlights, thick dark outlines, flat cel-shading with minimal 
  gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly 
  wholesome adorable vibe, cute Japanese kawaii illustration style
  ```
- **BẮT BUỘC** thêm block **Anti-distortion CRITICAL + Framing rule** vào MỌI prompt (xem đầu file)
- **NOT** realistic, semi-realistic, cinematic-photorealistic, anime-background, 3D, Pixar
- **NOT** high-detail realistic skin, realistic textures, photographic backgrounds

### Về SETTING (mô tả environment)
- Environment phải được mô tả bằng **ngôn ngữ kawaii cartoon**: "simple chunky rectangles", "cute wavy green lines", "soft brown texture dots", "tiny cartoon chickens"
- **KHÔNG** dùng ngôn ngữ realistic: "photorealistic brick wall", "weathered texture", "depth of field", "bokeh", "cinematic lighting ratio"

### Về NHÂN VẬT trong SCENE
- Mỗi prompt SCENE đã **TỰ CHỨA ĐẦY ĐỦ** character reference — copy là chạy, không cần tra cứu
- **Tí/Tèo/Hùng ở Chương 2**: dùng **character reference mới (16 tuổi, cao hơn, gầy hơn, tóc hơi dài hơn, có đồng phục cấp 3)** — KHÔNG dùng reference cũ 13 tuổi
- **Bố/Mẹ/Cô Tư ở Chương 2**: dùng **character reference giữ nguyên từ Chương 1** (nếu xuất hiện — chương 2 chỉ có Mẹ xuất hiện ở sạp hàng, Bố + Cô Tư ở quê không lên)
- **Cô Hiệu trưởng** (mới xuất hiện Chương 2): 50 tuổi, mặt người lớn bình thường, KHÔNG dùng kawaii giant eyes
- **Face proportions** phải giống portrait sprite — do NOT enlarge head, do NOT stretch face trong SCENE
- **Body** dùng head-to-body 1:2.5 kawaii proportions cho Tí/Tèo/Hùng — not realistic figure proportions

### Về ASPECT RATIO
- Tất cả **BG**: 16:9 widescreen
- Tất cả **SCENE**: 16:9 cinematic
- **KHÔNG BAO GIỜ** dùng 3:4, 4:3, 1:1 cho BG/SCENE

### Về LOGIC MÀU SẮC / STYLE NHẤT QUÁN GIỮA CHƯƠNG 1 → CHƯƠNG 2
- Style kawaii phải GIỐNG HỆT chương 1 (cùng head-to-body ratio, cùng eye style, cùng outline thickness, cùng blush style)
- **Lighting tone** vẫn warm cozy — nhưng chương 2 thêm chút **nostalgic independence** (xa nhà, một mình ở thị trấn)
- Backgrounds chương 2 có thêm **soft warm golden-hour tone** (chiều tà, chiều vàng) cho các scene ngoài trời — đây là signature chương 2

### Về MAPPING BG ↔ scene VN (dùng trong React data)

```
[dialogue scene: Tí + Hùng nói chuyện ở sân trường cấp 3]
  type: 'dialogue'
  background: 'highschool_yard_empty'   // ← BG trống
  character: 'hung', expression: 'smug_invite'   // ← sprite Hùng ghép lên
  characterPosition: 'left'
  // React load: BG trống + 2 sprite portrait (Tí + Hùng)

[narrator scene: Mẹ giao sạp cho Tí]
  type: 'narrator'
  background: 'mom_stall_handover'  // ← BG composite có sẵn Mẹ + Tí
  // React load: BG composite ONLY (KHÔNG load sprite — đã có trong ảnh)

[narrator scene: cổng trường tan học]
  type: 'narrator'
  background: 'school_gate_empty'     // ← BG trống (narrator tĩnh)
  // React load: BG trống ONLY (chỉ kể cảnh không có nhân vật)
```

> **Quy tắc React** (tham khảo `VisualNovelPlayer.jsx` line 159-201):
> - `scene.type === 'dialogue'` → `character + expression` → load sprite + BG trống
> - `scene.type === 'narrator'` → KHÔNG load sprite, chỉ load BG (trống HOẶC composite)
> - BG composite có nhân vật trong ảnh → thêm vào `BG_HAS_CHARACTER` list (engine skip sprite)
> - BG trống → load bình thường, KHÔNG vào `BG_HAS_CHARACTER`

---

# 📌 CHECKLIST GIAO ĐỒNG ĐỘI — CHƯƠNG 2

### Phase 1 — Gen 10 BG TRỐNG (cho dialogue + narrator tĩnh)
- [ ] **Dùng STYLE TOKEN: BG TRỐNG** (16:9, NO people, NO characters)
- [ ] Gen các file:
  - [ ] `c2_bg_dorm_room_empty.png` (phòng trọ trống)
  - [ ] `c2_bg_mom_stall_empty.png` (sạp Mẹ trống)
  - [ ] `c2_bg_school_gate_empty.png` (cổng trường cấp 3 trống, chiều vàng)
  - [ ] `c2_bg_classroom_empty.png` (lớp học cấp 3 trống)
  - [ ] `c2_bg_highschool_yard_empty.png` (sân trường cấp 3 trống)
  - [ ] `c2_bg_cinema_lobby_empty.png` (rạp phim trống)
  - [ ] `c2_bg_internet_cafe_empty.png` (quán net trống)
  - [ ] `c2_bg_stage_award_empty.png` (sân khấu lễ tổng kết trống)
  - [ ] `c2_bg_shoe_store_empty.png` (cửa hàng giày sneaker trống)
  - [ ] `c2_bg_town_street_bike_stolen_empty.png` (đường phố trống, xe mất)
- [ ] BG này KHÔNG xóa nền, lưu PNG đầy đủ 16:9

### Phase 2 — Gen 7 BG COMPOSITE (cho narrator cinematic có nhân vật)
- [ ] **Dùng STYLE TOKEN: BG COMPOSITE** (16:9, có nhân vật trong ảnh đang hành động)
- [ ] Gen các file:
  - [ ] `c2_bg_mom_stall_handover.png` (Mẹ giao sạp cho Tí)
  - [ ] `c2_bg_dorm_flash_sale.png` (Tí ngồi phòng trọ thấy Flash Sale)
  - [ ] `c2_bg_highschool_yard_movie_invite.png` (Hùng rủ Tí đi xem phim)
  - [ ] `c2_bg_stage_ti_award.png` (Tí nhận giấy khen + phong bì)
  - [ ] `c2_bg_internet_cafe_bike_stolen.png` (Tí bước ra, chỗ để xe trống)
  - [ ] `c2_bg_mom_stall_busy_SUCCESS.png` (sạp đông khách, Tí vui)
  - [ ] `c2_bg_mom_stall_busy_FAIL.png` (sạp bị đình chỉ, Tí buồn)
- [ ] **LƯU Ý**: Khi gen Tí/Tèo/Hùng trong SCENE, dùng **character reference CHƯƠNG 2** (16 tuổi, school uniform, etc.) — KHÔNG dùng reference 13 tuổi từ chương 1
- [ ] **LƯU Ý**: Khi gen Mẹ/Cô Hiệu trưởng, dùng **character reference mới** (Mẹ 38t áo bà ba, Cô Hiệu trưởng 50t áo dài)
- [ ] **MỖI PROMPT SCENE copy nguyên khối ⭐⭐⭐ là dùng được** — không cần tra cứu block character reference ở đâu khác
