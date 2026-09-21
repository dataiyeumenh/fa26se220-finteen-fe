# 🎬 CHƯƠNG 5 — BACKGROUND & SCENE PROMPTS

> **MỤC ĐÍCH**: Tách riêng **BG** (nền trống, không nhân vật), **SCENE** (composite, có nhân vật) và **ẢNH TIÊU ĐỀ** (nền có tên nhiệm vụ, sự kiện bất ngờ hoặc tổng kết chương) cho Chương 5 — **Vừa ra trường — Khủng hoảng tài chính** (Tí 22 tuổi, mới ra trường, thất nghiệp 2.5 tháng).
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Tất cả BG và SCENE phải dùng **CHÍNH XÁC** earnest teen proportions (giống Chương 1-4) — KHÔNG dùng kawaii 1:2.5 chibi. Khi ghép sprite emotion lên BG, phải nhất quán về art style.
>
> **⚠️ QUY TẮC TUỔI NHÂN VẬT**: Tí 22t vừa ra trường, thất nghiệp 2.5 tháng. Trang phục bình dân, sạch và vừa vặn: polo xanh nhạt + quần kaki dài xám đậm + sneaker trắng ngà; giữ nguyên giữa các cảnh. Tóc NGẮN slicked-back hơi xơ xác nhẹ. Thất nghiệp thể hiện qua bối cảnh và biểu cảm, không qua quần áo rách hoặc rộng thùng thình.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi prompt trong file này là **KHỐI TỰ CHỨA ĐẦY ĐỦ** — copy nguyên khối `[Style token + Character reference đầy đủ + Setting + Aspect]` là dán vào Gemini là chạy được. KHÔNG cần tra cứu thêm ở đâu khác.
>
> **Visual Novel engine**:
> - `type: 'dialogue'` → load **BG** (nền môi trường không nhân vật, không phải nền trắng) + sprite portrait ghép lên
> - `type: 'narrator'` → load **SCENE** (đã có nhân vật trong ảnh, không cần sprite)
> - **Ảnh tiêu đề ở Phần C** → dùng riêng lúc chuyển vào nhiệm vụ/sự kiện hoặc tổng kết chương; chữ đã nằm trong ảnh, không ghép sprite hay hộp thoại che chữ.
>
> **Ngoại lệ chữ cho Phần C**: các quy tắc `no text` / negative `text` của BG và SCENE không áp dụng cho ảnh tiêu đề. Ảnh tiêu đề bắt buộc có đúng chữ tiếng Việt được chỉ định trong từng prompt; cấm chữ thừa, logo và watermark.

---

# 📐 KIẾN TRÚC VISUAL NOVEL — 3 LOẠI ẢNH

> 🎮 **Game này là Visual Novel kiểu Ren'Py / VN Studio**. Mỗi scene thuộc 1 trong 2 loại VN:

| Loại scene VN | Sprite nhân vật | Background | Loại ảnh gen |
|---|---|---|---|
| **`type: 'dialogue'`** (có đối thoại giữa 2+ nhân vật) | ✅ Render sprite riêng | **BG trống** (không có nhân vật trong ảnh) → sprite ghép lên trên | **PORTRAIT sprite** (1 nhân vật đứng một mình, nền trắng) + **BG TRỐNG** |
| **`type: 'narrator'`** (kể chuyện, không đối thoại) | ❌ KHÔNG render sprite | **BG COMPOSITE** (ảnh có sẵn nhân vật đang hành động) | **CINEMATIC SCENE** (ảnh toàn cảnh 16:9, có nhân vật trong ảnh) |
| **`type: 'choice'`** (lựa chọn) | ❌ | BG mờ + UI overlay | — |

> 📌 **Quy tắc vàng**:
> - **Dialogue scene** → load ảnh portrait sprite (nền trong suốt) + ghép lên **BG trống** (cùng nơi, không nhân vật)
> - **Narrator scene** → load ảnh **BG composite** (có sẵn nhân vật) → KHÔNG ghép sprite thêm

> 📖 **Tham khảo**: Project demo `d:\NGT\Test\finteen-app\src\components\VisualNovelPlayer.jsx`
> - Line 159: `const CharacterComponent = currentScene.character ? getSprite(currentScene.character, currentScene.expression || 'happy') : null`
> - Line 187: `dialogueBgOpacity = isDialogue ? 0.62 : 1.0` → BG mờ xuống khi dialogue, sprite nổi bật
> - Line 198-201: `BG_HAS_CHARACTER` list → biết scene nào dùng BG composite, engine skip sprite

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
| Thằng Minh (bạn đại học) | **23** | 🇻🇳 Việt Nam | `a 23-year-old Vietnamese man` |
| HR Cô ty nhỏ | **32** | 🇻🇳 Việt Nam | `a 32-year-old Vietnamese woman` |
| Bác sĩ | **45** | 🇻🇳 Việt Nam | `a 45-year-old Vietnamese man` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các scene của cùng 1 nhân vật.

### Aspect ratio + mapping theo loại scene VN

| Loại ảnh | Tỉ lệ | Loại scene VN dùng | Đặc điểm |
|---|---|---|---|
| **BG trống** (cho dialogue — không nhân vật) | 16:9 ngang | `type: 'dialogue'` | Nền môi trường toàn cảnh rỗng, sẽ ghép sprite portrait lên |
| **BG composite** (có nhân vật sẵn trong ảnh) | 16:9 ngang | `type: 'narrator'` | Toàn cảnh 16:9 Việt Nam, có nhân vật Việt đang hành động trong ảnh — KHÔNG render sprite riêng |
| **Ảnh tiêu đề** (Phần C, có chữ lớn ở giữa) | 16:9 ngang, đề xuất 1920 × 1080 | Màn chuyển vào nhiệm vụ/sự kiện/tổng kết | Nền minh họa không nhân vật + bảng giấy ghi tên; không ghép thêm sprite/hộp thoại |

### 🔗 CROSS-REFERENCE ĐẾN CHƯƠNG 4 (dùng ảnh Tí 22t-defeated làm reference)

> 🎯 **QUAN TRỌNG**: Upload `c4_ti_defeated.png` để giữ nhận diện Tí 22t. Trang phục Chương 5 được thay bằng polo xanh nhạt + quần kaki dài xám đậm + sneaker trắng ngà, đúng bộ chuẩn trong mọi sprite và scene.
>
> **⚠️ LƯU Ý QUAN TRỌNG VỚI 4 NHÂN VẬT MỚI (Bà chủ trọ, Thằng Minh, HR, Bác sĩ)**: KHÔNG CÓ reference từ chương trước → gen đầu tiên từ prompt, không cần upload ảnh.

| Nhân vật chương 5 | Dùng ảnh reference | Ghi chú |
|---|---|---|
| Tí 22t (mọi scene) | `c4_ti_defeated.png` (tham chiếu nhận diện) | Polo cotton tay ngắn xanh nhạt `#a8c4d8`, cổ mềm 2 nút, mặc ngoài quần; quần kaki cotton **dài đến mắt cá**, ống đứng xám đậm `#4a4a4a`; sneaker vải thấp cổ trắng ngà `#f5f5f0`, tất cổ ngắn xám nhạt `#c9c9c9`. Đồ vừa vặn, sạch, nguyên vẹn, không logo; không vest, cà vạt, thẻ nhân viên hoặc đồng hồ. LE 5 tháo giày và tất đặt cạnh cáng, giữ nguyên áo và quần dài. |
| Bà chủ trọ 55t | **KHÔNG CÓ reference** | Nhân vật mới — gen đầu tiên |
| Thằng Minh 23t | **KHÔNG CÓ reference** | Nhân vật mới — gen đầu tiên |
| HR Cô ty nhỏ 32t | **KHÔNG CÓ reference** | Nhân vật mới — gen đầu tiên |
| Bác sĩ 45t | **KHÔNG CÓ reference** | Nhân vật mới — gen đầu tiên (chỉ xuất hiện trong LE 5) |

---

# 👥 CÁC NHÂN VẬT XUẤT HIỆN Ở CHƯƠNG 5

| ID | Tên nhân vật | Tuổi cố định | Quốc tịch | Vai trò | Xuất hiện trong file này? |
|---|---|---|---|---|---|
| `ti` | Tí (nhân vật chính) | **22** | 🇻🇳 Việt Nam | Mới ra trường, thất nghiệp | ✅ Có |
| `chutro` | Bà chủ trọ | **55** | 🇻🇳 Việt Nam | Đòi tiền nhà | ✅ Có |
| `minh` | Thằng Minh (bạn ĐH) | **23** | 🇻🇳 Việt Nam | Khoe xe khoe công ty nước ngoài | ✅ Có |
| `hr` | HR Cô ty nhỏ | **32** | 🇻🇳 Việt Nam | Offer lương 4.5tr không BH | ✅ Có |
| `bacsi` | Bác sĩ | **45** | 🇻🇳 Việt Nam | Cấp cứu đêm (LE 5) | ✅ Có |

---

# 🎨 STYLE TOKEN — BG VÀ SCENE (earnest teen — giống Chương 1-4)

> **⚠️ KHÁC VỚI BIBLE GỐC**: Bible cũ dùng 1:2.5 kawaii chibi, nhưng dự án này đã chốt dùng **earnest teen proportions 1:4-1:5** từ Chương 1 → phải giữ nhất quán. KHÔNG copy style từ `image-generation-bible.md` mục cũ.

```
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). Head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe — phong cách thanh tú ổn định chững chạc, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
```

### Anti-distortion CRITICAL block (áp dụng MỌI BG + SCENE)

```
CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters —
do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face,
do NOT bug-eye out the eyes even in shock or anger.

CRITICAL framing rule: the FULL CHARACTERS must fit entirely inside the image
frame — top of head AND both feet AND both hands all visible — characters
occupy roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up,
NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust,
NOT shoulders-up, NOT waist-up. Plenty of white negative space above head
and below feet.
```

### Negative prompt (áp dụng cho CẢ BG và SCENE)

```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality,
3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features,
wrong age appearance, caucasian features, anime-stereotype Western face,
Japanese anime face, K-pop face, big round eyes anime stereotype,
kawaii blush circles on cheeks, slim sharp jawline (wrong for age 22 man),
tall muscular body (wrong for lean 22-year-old),
realistic Vietnamese adult face, child proportions (must look exactly 22)
```

---

# 🏞️ PHẦN A — BACKGROUND (BG) — NỀN TRỐNG, KHÔNG CÓ NHÂN VẬT

> **BG = ảnh nền toàn cảnh 16:9**, không nhân vật.
> Dùng cho: `dialogue` scene (React ghép sprite lên) HOẶC `narrator` tĩnh.
>
> **Style**: Kawaii 2D cartoon background — flat cel-shaded environment, simple shapes, pastel/warm colors, Studio Ghibli-inspired urban Vietnam setting rendered as cute cartoon. NO realistic rendering, NO photographic background, NO anime background.

---

## 📍 BG 1 — PHÒNG TRỌ CŨ (PHÒNG TRỌ SINH VIÊN NỘI THẤT CŨ)

> **Mức độ cũ thống nhất**: phòng trọ bình dân đã ở nhiều năm nhưng vẫn sạch, khô ráo và nguyên vẹn. Chỉ thể hiện tuổi đời bằng màu sơn hơi ngả, rèm nhạt màu và vài vết xước nhẹ trên đồ gỗ. Nội thất đơn giản, còn dùng tốt; không tạo cảm giác nhà hoang hoặc xuống cấp nặng. Áp dụng cho BG1, Scene 5.1 và ảnh Nhiệm vụ 1. Tổng kết dùng tranh biểu tượng riêng.

### 📄 `c5_bg_rental_room_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại với Bà chủ trọ đứng ngoài cửa phòng về tiền nhà 3tr (Scene 5.1)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 5 — Scene 5.1: Chiếc khiên cuối cùng. Phòng trọ bình dân đã sử dụng nhiều năm, ở tầng 3 của dãy trọ sinh viên ngoại ô thành phố (giống khu trọ gần các ĐH lớn — tường kem hơi ngả màu, cửa sổ nhỏ, phòng sạch và nguyên vẹn). Tí ở đây suốt 4 năm ĐH, giờ mới ra trường nhưng CHƯA DỌN ĐI vì chưa có việc mới. Phòng nhỏ ~12m², nội thất tối giản: giường đơn, bàn học, tủ quần áo cũ, lavabo trong góc. Ánh đèn vàng buồn (vì tiền điện tiết kiệm).

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (bắt buộc dùng y hệt Chương 1-4, KHÔNG dùng bible cũ)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

> **Setting (BG kawaii cartoon environment — OLD VIETNAMESE STUDENT RENTAL ROOM INTERIOR, Studio Ghibli melancholy-quiet aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the small room**, capturing the whole cramped space. The viewer does NOT look through a door — the room simply fills the entire frame edge-to-edge like a wide panoramic photo from inside. **ALL FOUR WALLS visible** with **floor and ceiling all visible**.
>
> **LEFT WALL**: A **small single window** (~1m x 1.2m) with **intact painted metal grill bars** (chấn song sắt — typical Vietnamese rental room security detail). Through the window: **overcast gray sky** + view of **neighboring tin-roofed buildings** + **electrical wires tangling across** (the iconic chaotic Vietnamese urban view). The window has **slightly faded pink curtains**, clean and untorn, drawn neatly to one side. Below the window: A **small white ceramic sink** (lavabo rửa mặt kiểu trọ — with a working single tap, clean ceramic surface, no leaks), a **small plastic mirror** above it (intact glass, clean surface, slightly aged plastic frame), a **bar of soap** on a small dish, a **plastic toothbrush holder** with 1 toothbrush, a **small stack of dishes**. **NO actual bathroom** — just this mini-sink.
>
> **BACK WALL (CENTER of frame, the wall opposite the entrance)**: A **single bed** (giường đơn cũ — wooden frame, mattress has **faded blue-white checkered bedsheet**, slightly rumpled, one thin pillow) against the back wall, taking up most of the visible wall space. Above the bed: A **small wooden shelf** mounted on the wall with a few **stacked textbooks** (generic — NO real titles), a **small alarm clock** (digital, red LED digits showing "15:47"), a **rolled-up poster tube** (Tí's bằng đại học — generic diploma scroll tied with a red ribbon). Beside the bed on the floor: A **sparse area rug** (cheap plastic woven mat, faded).
>
> **RIGHT WALL**: A **small wooden desk** (chunky old-school — secondhand, a few light surface scuffs, sturdy and level legs) against the right wall with a **mismatched wooden chair**. On the desk: An **older well-kept laptop** (open, showing a paused webpage — NOT detailed, just chunky cartoon rectangle suggesting "đang rải CV"), a **neat small stack of CV papers** with application notes (generic unreadable marks), a few discarded draft sheets contained in a small wastebasket beside the desk. A **reusable water bottle** standing upright. A **small portable mirror**. A **pen holder**.
>
> **ENTRANCE WALL (LEFT of frame, the door to the hallway — door is SHUT, NOT framing the camera, just visible as a closed wooden door on the left side)**: A **closed old wooden door** (vintage rental room door — slightly faded but intact dark brown paint, working brass doorknob, small peephole at eye level). The door is **CLOSED, NOT OPEN** — visible just as a detail on the left edge of frame (NOT a doorway bordering the image).
>
> **CEILING (TOP of frame)**: Low ceiling (~2.5m — typical rental room) painted in **clean, slightly aged off-white** (intact dry ceiling, no damp patches or peeling paint). A **single bare incandescent bulb** hanging from a thin wire in the center of the ceiling (the only light source — gives off a **dim warm yellow glow** — the room is moody and dim, NOT bright). The ceiling corners are **clean and free of cobwebs**; the room is modest but regularly cared for.
>
> **FLOOR (BOTTOM of frame)**: **Older ceramic floor tiles** (small square ivory tiles, intact, swept clean, slight loss of gloss from years of use). A **small wastebasket** contains the discarded packaging; no loose litter. A **single sealed instant-noodle packet** rests on a low shelf (a subtle reminder of inexpensive meals). A **small stack of folded clothes** sits on a plastic chair. **No loose shoes on the floor** — Tí wears his sneakers in the dialogue sprite and Scene 5.1, so do not duplicate them in the backdrop.
>
> **Wall details**: **NO posters** (Tí đã lâu không treo gì). A **single electrical switch** on the right wall near the entrance door (old plastic switch, yellowed). A **neatly secured electrical cable** runs along the ceiling corner; a **small power strip** is fixed beside the desk (4 outlets, 1 has the laptop charger plugged in). The wall paint is **clean cream-white, gently yellowed with age**, with a few faint furniture scuffs near the floor. Walls are dry and intact, with no mold, peeling plaster or large stains.
>
> NO people, NO characters, NO sprites, NO DOORWAY framing the camera, NO DOORFRAME BORDER.
>
> **Lighting**: **DIM WARM YELLOW BULB** as the PRIMARY light source — the single incandescent bulb casts a warm but dim yellow-amber glow over the entire room, creating soft shadows in the corners. Secondary: **faint cold-gray daylight** leaking through the small window (no direct sun, it's late afternoon overcast). The contrast between the warm dim bulb light + cold gray window light creates a **melancholic lonely atmosphere** (Ghibli-style — like in "Whisper of the Heart" or "Only Yesterday"). The room feels **small, modest and quiet** — a familiar, cared-for room where someone is waiting anxiously for a job reply. The sadness comes from the stillness and lighting, not from ruined furniture or dirt. NOT scary, NOT horror, NOT dark horror — just melancholic and still. Atmosphere: **quiet desperation, late-afternoon alone-in-room-after-rejection-streak gloom**.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 2 — QUÁN CÀ PHÊ CHIỀU MUỘN (PHỤ — DÙNG NẾU CẦN)

### 📄 `c5_bg_cafe_evening.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue`/transition — Tí ngồi suy nghĩ một mình sau khi nhận thư từ chối CV (optional — between 5.1 và 5.2)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Quán cà phê vỉa hè bình dân kiểu Sài Gòn (highlands coffee / The Coffee House style) — Tí ngồi 1 mình, laptop mở, đọc mail từ chối. Chiều muộn ~5h, ánh vàng ấm xuyên qua kính.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — MODERN VIETNAMESE URBAN CAFÉ INTERIOR, Studio Ghibli quiet-evening aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the café**, capturing the whole space. The viewer does NOT look through a door — the café simply fills the entire frame edge-to-edge. **ALL FOUR WALLS visible** with **floor and ceiling all visible**.
>
> **LEFT WALL**: A **large floor-to-ceiling glass storefront window** (~3m wide, 1m x 3m) showing the **street outside** — late-afternoon sidewalk with a few passersby silhouettes (chunky kawaii silhouettes, NOT detailed), motorbikes parked in a row, late-afternoon golden hour sunlight hitting the opposite building walls. The window has **a small etched logo** (generic — NO real brand, NO real text, just a stylized coffee cup symbol). A few **small potted plants** on the windowsill (succulents, small fern).
>
> **BACK WALL (CENTER of frame)**: A **long wooden counter/bar** (~4m wide, dark walnut wood) with **3-4 coffee machines** (chunky cartoon espresso machines — black + chrome accents), a **row of glass jars** with coffee beans, a **menu board** above (large dark wood-board with **chalk-written menu items** — "Cà phê đen", "Bạc xỉu", "Trà sen" — generic stylized text, NO real logo), a **small chalkboard** with "Hôm nay: Cà phê dừa" written in chunky cartoon handwriting.
>
> **RIGHT WALL**: A **wooden shelf** with **stacked colorful ceramic mugs** (~30+ mugs in various colors — earth tones, generic). A few **small framed prints** of coffee plants (cartoon botanical illustrations). A **large wall clock** (chunky cartoon analog, white face with black numbers, showing ~17:10).
>
> **CEILING (TOP of frame)**: **Exposed industrial ceiling** with **dark wooden beams**, hanging **3-4 vintage pendant lights** with brass dome shades (warm yellow bulbs). A **slow-rotating ceiling fan** in the center (~1.2m blade length, dark wood).
>
> **FLOOR (BOTTOM of frame)**: **Warm-toned hardwood floor planks** (medium brown, slightly worn, warm glow from pendant lights). 4-5 **small round bistro tables** (each with 2 chairs — wooden, mismatched). The tables have **small glass ashtrays** + **menu cards** + **paper napkin holders**. One table has an **abandoned half-finished coffee cup** + **crumpled receipt** (suggests: customers have been and gone).
>
> **ENTRANCE WALL (LEFT of frame, the glass door — door visible as a glass sliding door on the left side, NOT framing the camera)**: A **glass sliding door** with a "PUSH" sticker (generic — NO real text, just chunky cartoon arrow). The door is **OPEN** (showing a sliver of sidewalk outside) — visible just as a detail on the left edge of frame (NOT a doorway bordering the image).
>
> **Atmosphere**: Mostly empty (chỉ có 1-2 silhouette khách hàng ngồi xa xa — kawaii silhouettes, NOT detailed). Late-afternoon warm golden light streaming through the large glass storefront (creates long diagonal golden light beams across the wooden floor — main lighting). Quiet ambient atmosphere — like the café is breathing slowly. The single coffee cup on the abandoned table symbolizes "drinking alone".
>
> NO people in detail (only silhouettes), NO characters, NO sprites, NO DOORWAY framing the camera, NO DOORFRAME BORDER.
>
> **Lighting**: **LATE-AFTERNOON WARM GOLDEN HOUR** as PRIMARY light — long diagonal warm golden-orange beams streaming through the large glass storefront window (THE BRIGHTEST light source), catching dust motes in the air. Secondary: **warm pendant lamp pools** from the 3-4 ceiling pendant lights ON (small warm yellow circular pools). The atmosphere is **quiet melancholy** — a beautiful warm café at golden hour, but mostly empty (the emptiness contrasts with the warmth, suggesting Tí's loneliness). Soft shadows from the pendant lights. NO DOORWAY, NO DOORFRAME BORDER.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 3 — VĂN PHÒNG CÔNG TY NHỎ (OFFICE CŨ)

### 📄 `c5_bg_small_company_office_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại với HR Cô ty nhỏ về offer lương 4.5tr (Scene 5.3)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 5 — Scene 5.3: Lời đề nghị rẻ mạt. Văn phòng công ty nhỏ (startup 5-10 người) ở tầng 2 hoặc tầng 3 một tòa nhà cũ ngoại ô — không phải văn phòng startup xịn ở quận 1. Bàn làm việc ghép lại, màn hình cũ, điều hòa cũ, cửa sổ nhỏ. HR dẫn Tí vào phòng họp nhỏ có bàn kính tròn 4 ghế.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — SMALL CRAMPED VIETNAMESE OFFICE / STARTUP ROOM, Studio Ghibli cramped-melancholy aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the small meeting room**, capturing the whole cramped office. The viewer does NOT look through a door — the meeting room fills the entire frame edge-to-edge. **ALL FOUR WALLS visible** with **floor and ceiling all visible**.
>
> **CENTER of frame**: A **small round glass meeting table** (~1m diameter, clear glass top, chrome legs) with **4 mismatched office chairs** around it (some are plastic chairs, some are old office chairs on wheels, NOT matching — suggesting a company that bought whatever was cheap). On the table: **2-3 stack of CVs** (Tí's CV is on top with a few red pen marks), a **single A4 contract paper** (the job offer — a few cartoon text lines, NO real readable text, just stylized lines), a **fancy blue pen** (the HR's pen), 2 **small ceramic coffee cups** (HR offering Tí water/coffee).
>
> **LEFT WALL**: An **old whiteboard** mounted on the wall (stained, has faded marker scribbles — generic stylized diagrams, NO real text), 2-3 **old motivational posters** (generic — "TEAMWORK!" "DREAM BIG!" placeholder text, NO real brand). A **tall metal filing cabinet** (old beige, dented, slightly rusted edges) with **a few folders spilling out**.
>
> **BACK WALL (CENTER of frame, behind the table)**: A **window** looking out to **a narrow alley between buildings** + **electrical wires tangling** + **gray sky** + a **neighboring concrete wall with faded advertisement** (generic — NO real ad, just chunky stylized shapes). A **small standing air-conditioner** unit (cũ, yellowed plastic) below the window making a low hum (cartoon "vrmmm" implied by small motion lines).
>
> **RIGHT WALL**: A **tall bookshelf** packed with **old binders** (red, blue, green spines — generic, NO real labels) + a **few fake plants** (dusty plastic fern). A **water dispenser** (the typical Vietnamese hot-cold dispenser with a big blue plastic jug on top, slightly stained). A **clock** on the wall (showing ~14:30 — afternoon).
>
> **CEILING (TOP of frame)**: **Low ceiling** (~2.7m — typical Vietnamese office space) with **drop-ceiling tiles** (cheap white acoustic panels, one is stained brown). A **fluorescent tube light** (long rectangular, the harsh white-blue type — typical cheap office). A few **loose cables** hanging from a corner.
>
> **FLOOR (BOTTOM of frame)**: **Cheap vinyl floor tiles** (gray-brown, slightly peeling at edges, scuffed from office chairs rolling). A **few crumpled papers** (rejected contracts? old receipts?). A **small dust bunny** in the corner under the filing cabinet. A **worn floor mat** at the entrance (the "CHÀO MỪNG" Vietnamese welcome mat — generic red design).
>
> **ENTRANCE WALL (RIGHT of frame, the door is OPEN — visible as a glass door with a small "PHÒNG HỌP" sign on the left, NOT framing the camera)**: A **glass door with aluminum frame** + a small white plastic sign with stylized "PHÒNG HỌP" text (generic Vietnamese placeholder, NO real logo). The door is **OPEN** — visible just as a detail on the right edge of frame (NOT a doorway bordering the image).
>
> NO people, NO characters, NO sprites, NO DOORWAY framing the camera, NO DOORFRAME BORDER.
>
> **Lighting**: **HARSH FLUORESCENT WHITE-BLUE TUBE LIGHT** as PRIMARY (the typical cheap office ceiling tube — casts a flat, slightly bluish-white light over everything, creating flat shadows). Secondary: **faint natural daylight** leaking through the window (weak, gray-white, NOT warm). The combination creates a **drained, depressing office atmosphere** — the typical sad small-company Vietnamese office where ambitious new grads end up feeling exploited. NOT bright, NOT airy, NOT cheerful — just flat fluorescent emptiness. Atmosphere: **small-company desperation, fluorescent-lit gloom, "công ty bóc lột" energy**. NO DOORWAY, NO DOORFRAME BORDER.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 4 — PHÒNG BỆNH VIỆN ĐÊM (LE 5)

### 📄 `c5_bg_hospital_room_night_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue`/narrator — Tí nằm viện sau khi cấp cứu đêm vì đau dạ dày (Life Event 5)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Phòng bệnh viện công (kiểu Bệnh viện Bạch Mai / Chợ Rẫy — phòng 4-6 giường, không phải phòng VIP) lúc 2-3h sáng. Tí nằm giường sắt, truyền nước. Ánh đèn trắng huỳnh quang lạnh. Yên tĩnh đến rợn.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — VIETNAMESE PUBLIC HOSPITAL WARD ROOM AT NIGHT, Studio Ghibli cold-clinical-melancholy aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the hospital ward**, capturing the whole clinical space. The viewer does NOT look through a door — the ward simply fills the entire frame edge-to-edge. **ALL FOUR WALLS visible** with **floor and ceiling all visible**.
>
> **CENTER of frame**: A **standard hospital bed** (giường bệnh viện công — metal frame painted cream-white with chipped paint, adjustable headboard, narrow mattress in a thin blue-white striped bedsheet, slightly rumpled). A **metal bedside table** next to it (the standard kind — small wheeled table with a lower shelf, holding a **clear IV drip stand** with a half-empty plastic saline bag hanging, a small cup of water, a used crumpled tissue, a small plastic cup with pills, a **paper wristband** with Tí's name printed — generic placeholder "BỆNH NHÂN" with bar code). An **oxygen tube** draped over the bed.
>
> **LEFT WALL**: An **old medical monitor** mounted on a small shelf (showing chunky cartoon green waveform — "beep... beep..." implied, NOT detailed numbers), a **blood pressure cuff** hanging on a hook, an **electrical outlet** with a cable plugged in. A **small whiteboard** with generic "BỆNH NHÂN: [placeholder]" — NOT real name, just chunky cartoon lines.
>
> **BACK WALL (CENTER of frame, the wall behind the bed)**: A **medical gas outlet panel** on the wall (the kind with multiple valves — chunky cartoon metal plate with 3-4 valves). Above the bed: a **small fluorescent exam light** (already OFF). A **call button** (the typical red button on a cable — generic "BÁO Y TÁ").
>
> **RIGHT WALL**: A **second empty bed** (4-6-bed ward — show 2-3 more empty beds visible in the background, all with rumpled but unused sheets — emphasizes the LATE-NIGHT QUIET and Tí's isolation). A **small plastic chair** (visitor chair — the typical blue plastic kind). A **curtain rail** along the ceiling with **faded blue-green hospital curtains** bunched up (can be pulled around each bed for privacy, currently bunched).
>
> **CEILING (TOP of frame)**: **High hospital ceiling** (~3m — typical hospital) painted **institutional cream-white**, showing water stains near the corners (plumbing leaks). A **long fluorescent tube light** running down the center (ONE is ON — emits cold clinical white-blue glow). Another tube is OFF (creating a dim corner). A few **small holes** in the ceiling tiles.
>
> **FLOOR (BOTTOM of frame)**: **Cold hard linoleum floor** (gray-brown institutional, slightly scuffed). A **small plastic rug** beside Tí's bed with **a pair of off-white low-top canvas sneakers** (hex #f5f5f0) with **light-gray ankle socks** (hex #c9c9c9) tucked inside, placed neatly beside the bed (Tí’s belongings, matching LE 5). A **few dust bunnies** in corners (hospital cleaning crew only mops, doesn't deep-clean). A **small medicine cart** parked at the far end (with small drawers, generic chunky bottles — NO real readable labels).
>
> **ENTRANCE WALL (RIGHT of frame, the ward sliding door is visible on the right, NOT framing the camera)**: A **large double-door ward entrance** (the typical Vietnamese hospital kind — sliding glass doors with aluminum frames, both doors visible, ONE is partially open showing a glimpse of the empty hallway outside with dim nighttime lighting). A small handwritten note taped to the door glass: "Y TÁ TRỰC: 22h-6h" (generic — NO real names). The door is **PARTIALLY OPEN**, NOT a doorway framing the camera — visible just as a detail on the right edge of frame.
>
> **Window detail**: A **small high window** on the LEFT wall, frosted glass, showing **faint deep-night blue-black sky** outside (no street lights visible — late night, ~3 AM). The window has **horizontal metal blinds** tilted shut.
>
> NO people, NO characters, NO sprites, NO DOORWAY framing the camera, NO DOORFRAME BORDER.
>
> **Lighting**: **ONE COLD FLUORESCENT TUBE** as PRIMARY light (the single ON tube casts a **harsh cold white-blue clinical glow** over Tí's bed — flat, sterile, no warmth). Secondary: **faint cold-blue moonlight** leaking through the high window. The combination creates a **cold, lonely, clinical night atmosphere** — the typical "bệnh viện công lúc 3h sáng" gloom (Ghibli-style — like the silent stillness of "Spirited Away" bathhouse at night). The ward feels **cold, quiet, sterile, isolated**. NOT scary-horror, NOT blood, NOT gore — just cold clinical emptiness. Atmosphere: **3AM hospital solitude, fluorescent-lit loneliness, "tao đang nằm một mình giữa đêm khuya" mood**. NO DOORWAY, NO DOORFRAME BORDER.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 5 — NHÀ HÀNG HỌP LỚP (NỀN TRỐNG CHO THOẠI TÍ VÀ MINH)

### 📄 `c5_bg_class_reunion_restaurant_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại với Minh trong Nhiệm vụ 2: Bữa tiệc họp lớp (Scene 5.2). Ghép sprite Tí và Minh với biểu cảm tương ứng.
**Aspect**: 16:9
**Output**: `images/chuong-5/c5_bg_class_reunion_restaurant_empty.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 5 — Nhiệm vụ 2: Bữa tiệc họp lớp. Nhóm bạn đại học hẹn nhau tại nhà hàng sang trọng kiểu fusion ở thành phố, với tường gạch trần, đèn chandelier, bàn gỗ dài và khăn trải bàn trắng. Minh khoe thành công khiến Tí tự ái. Đây là nền môi trường cho đoạn đối thoại, giữ cùng nhà hàng và ánh sáng với `c5_bg_class_reunion_restaurant.png` nhưng không vẽ sẵn người. Ảnh tiêu đề `bg_nhiem_vu_2.png` chỉ dùng mở đầu nhiệm vụ, không dùng làm nền thoại.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — UPSCALE VIETNAMESE FUSION RESTAURANT INTERIOR, Studio Ghibli bittersweet-elegant aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the restaurant**, looking along the long reunion table from its near end. The viewer does NOT look through a door — the dining room fills the entire frame edge-to-edge. **LEFT, BACK and RIGHT WALLS visible**, with **floor and ceiling visible**; the entrance wall is behind the camera. Natural straight-line perspective, NOT fisheye. This is the SAME restaurant as the reunion composite, with slightly wider framing to leave room for dialogue sprites.
>
> **LEFT WALL**: An **exposed red-brick wall** with **3-4 vintage framed prints** of old Saigon/Hanoi streets (simple monochrome architectural illustrations, NO people or readable text in the prints). A **tall built-in wooden wine rack** holding about 20 bottles with plain unreadable labels. **Two brass wall sconces** with warm filament bulbs. Keep the same brick color, wine rack and wall decor as the composite scene.
>
> **BACK WALL (CENTER of frame, opposite the camera)**: A **large open kitchen pass-through** with a **brass-trimmed counter** and a **blank dark menu board** above. The kitchen is completely unstaffed in this background: **NO chefs, NO silhouettes**, no human reflections. A few simple stacked plates and cooking utensils remain visible through the opening, rendered as chunky cartoon shapes.
>
> **RIGHT WALL**: A **floor-to-ceiling arched window** about 3m tall looking onto a **rainy Vietnamese city street at night** — deep blue-black sky and abstract colored light reflections on wet pavement. NO pedestrians, riders, human silhouettes or readable shop signs outside. **Three tall candles in glass jars** sit on the window sill. Keep the window shape and position identical to the reunion composite.
>
> **CENTER of frame**: The **long dark-walnut reunion table** (about 3m long, 8-10 seats) with a **white linen tablecloth**, **8-10 empty wooden chairs**, white ceramic plates, wine glasses, folded cloth napkins in rings, small candles, wooden salt/pepper mills and a small vase with one red rose. A **single water glass** rests at the near-end place setting. **All chairs are unoccupied**. No bill, payment terminal or visible result of the player's choice. **NO motorcycle key in the BG** — Minh's sprite may hold the key separately, so do not duplicate it on the table.
>
> **CEILING (TOP of frame)**: **High vaulted ceiling** about 5m tall with **exposed dark wooden beams** and **3-4 brass chandeliers with crystal pendants**, each with about 6 warm candle-shaped bulbs. Chandeliers hang at slightly different heights, matching the composite scene. A **wooden ceiling fan** sits between two chandeliers.
>
> **FLOOR (BOTTOM of frame)**: **Polished dark hardwood planks** with a subtle warm sheen. Leave **clear floor space at the near-left and near-right foreground** for the standing character sprites; position the reunion table and its chairs in the middle distance so no chair back or table edge blocks the future sprites. Keep the **bottom 20% visually quiet** for the dialogue box. No loose belongings or tall foreground props. Do not draw characters or interface elements into these empty areas.
>
> **ENTRANCE WALL (BEHIND the camera, NOT visible)**: The entrance is behind the viewer, as in the composite scene. **NO visible doorway around the camera, NO DOORFRAME BORDER**. Preserve the restaurant layout rather than adding a new entrance in the foreground.
>
> **Background atmosphere**: Elegant and prepared for a reunion, with other **empty dining tables** in the far background and a **small grand piano with an empty stool** in a distant corner. Soft candlelight and tasteful furnishings create a bittersweet evening mood. No diners, friends, staff or human shapes, even far away or in reflections. The empty version exists to support dialogue sprites; the composite version supplies the people.
>
> NO people, NO characters, NO sprites, NO silhouettes, NO human reflections, NO DOORWAY framing the camera, NO DOORFRAME BORDER. NO text, NO parchment title panel, NO mission label, NO UI, NO logo, NO watermark.
>
> **Lighting**: **WARM LOW-LIGHT EVENING GOLDEN** as PRIMARY — brass chandeliers cast soft golden pools over the white tablecloth and dark wooden floor. Secondary: **gentle candlelight** and **cool rainy-night blue from the arched window on the right**. Match the light direction, palette and time of day of the reunion composite. Atmosphere: **elegant, warm, quietly bittersweet**, not shabby, ruined or frightening. Render at normal background brightness; dialogue dimming is handled by the game interface, not baked into the image.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**. Target 1920 × 1080. Keep the table, walls, floor and ceiling readable without cropping important architecture.
>
> **Negative prompt**: people, characters, sprites, silhouettes, human reflections, crowd, occupied chairs, chefs, waitstaff, human portraits, text, letters, numbers, watermark, logo, blurry, low quality, 3D render, photorealistic, semi-realistic, title card, wooden title sign, parchment panel, interface, fisheye distortion, doorway border, black margins, clutter blocking the left or right foreground.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

### Cách dùng bộ ảnh nhà hàng trong Nhiệm vụ 2

| Đoạn | Ảnh | Cách hiển thị |
|---|---|---|
| Giới thiệu nhiệm vụ | `bg_nhiem_vu_2.png` | Có tên nhiệm vụ lớn ở giữa, không ghép sprite |
| Kể chuyện về buổi họp lớp | `c5_bg_class_reunion_restaurant.png` | Có sẵn Tí, Minh và bạn bè; không ghép thêm sprite |
| Minh nói và Tí đáp lại | `c5_bg_class_reunion_restaurant_empty.png` | Ghép sprite Minh/Tí theo người nói và biểu cảm; không trùng nhân vật trong nền |
| Chọn cách phản ứng | Nền nhà hàng trống đang dùng | Phủ giao diện lựa chọn theo thiết kế `choice`; không dùng bảng tiêu đề nhiệm vụ làm nền |

---

# 🎬 PHẦN B — SCENE COMPOSITE (CÓ NHÂN VẬT — DÙNG CHO NARRATOR)

> **SCENE = ảnh 16:9 có sẵn nhân vật Việt đang hành động**, dùng cho `narrator` scene.
> KHÔNG render sprite portrait ghép — nhân vật đã nằm sẵn trong ảnh toàn cảnh.

---

## 📍 SCENE 5.1 — PHÒNG TRỌ: CHỦ TRỌ ĐÒI TIỀN NHÀ

### 📄 `c5_bg_rental_room_evicted.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Tí ngồi bên trong phòng trọ, bà chủ trọ đứng ngoài cửa (hoặc trong cửa) đang đòi tiền nhà 3 triệu. Cửa phòng mở. Tí nhìn xuống mặt buồn.
**Nhân vật trong ảnh**: Tí (chính, foreground) + Bà chủ trọ (chính, doorway) + có thể đồ đạc lỉnh kỉnh trong tay (chuẩn bị dọn đi)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 5 — Scene 5.1: Chiếc khiên cuối cùng. Hôm nay là hạn chót tiền nhà tháng này. Chủ trọ đứng trước cửa phòng Tí (cửa mở), tay chống nạnh, mặt khó chịu. Tí ngồi co ro trên giường (đã mặc polo xanh nhạt, quần kaki dài xám đậm và mang sneaker trắng ngà để chuẩn bị ra ngoài tìm việc trước khi chủ trọ đến). Phòng trọ cũ y như BG1, giờ có nhân vật.

**🔗 CROSS-REFERENCE**:
- BG: xem `c5_bg_rental_room_empty.png` (BG1) — phòng trọ cũ y hệt
- Tí 22t-defeated → dùng ảnh `c4_ti_defeated.png` làm reference
- Bà chủ trọ 55t → mới, gen từ prompt dưới
- Folder output: `images/chuong-5/scene-5.1/`

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — SAME OLD VIETNAMESE STUDENT RENTAL ROOM INTERIOR AS BG1, Studio Ghibli melancholy-quiet aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW)**:
> Same as `c5_bg_rental_room_empty.png` (BG1) — the small, clean, lived-in room with the intact bed, sturdy secondhand desk with an older laptop and neatly stacked CVs, working sink and intact clean mirror, painted window bars and clean, slightly faded pink curtains. Cream walls are gently aged but dry; floor tiles are intact and swept. No mold, peeling paint, broken furniture, cobwebs or loose rubbish. **THE DOOR IS NOW HALF-OPEN** on the LEFT EDGE of frame, showing a sliver of hallway light.
>
> **The door is OPEN** (was CLOSED in BG1) — wood door is now **half-open** (pushed inwards, showing a thin strip of dim hallway behind it). Through the doorway sliver: just hint of **concrete hallway wall + a single dim bulb in the hallway** — NOT detailed hallway, just enough to show "someone is standing at the door".
>
> **Crucial layout**: the camera is INSIDE the room, **positioned at the FOOT of the bed**, looking **towards the BACK WALL** (where the bed is). So:
> - **BACKGROUND of frame**: the back wall with the bed (NEAR end of frame, perspective foreshortened)
> - **MIDDLE of frame**: the room interior — small desk on the right
> - **LEFT of frame (MIDDLE-FOREGROUND)**: the doorway, half-open, with Bà chủ trọ standing in the doorway
> - **CENTER-FOREGROUND**: Tí sitting on the floor/bed, slumped

> **⭐ FOCAL POINT — TÍ SITTING ON THE FLOOR BESIDE THE BED (CENTER-FOREGROUND of frame)**:
> **a 22-year-old Vietnamese man (Tí, age-locked 22)**. Phải giống reference `c4_ti_defeated.png` nhưng **ĐỔI trang phục vì giờ đã ra trường + thất nghiệp**:
> - height **172cm**, mature slim build, face LONGER + sharper jawline + **dark circles NHẸ (vẫn còn từ chương 4 nhưng KHÔNG ĐẬM hơn, chỉ nhợt nhạt)** (NHẸ vừa phải, không quầng thâm sâu, chỉ hơi mệt mỏi — 22t thất nghiệp nhưng chưa burnout cùng cực)
> - hair NGẮN slicked-back nhưng **hơi xơ xác không vuốt kỹ** (đã thất nghiệp 2.5 tháng nên không còn chăm)
> - soft warm light beige skin (slightly paler from stress)
> - Vietnamese facial features, sạch
> - Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
>
> POSE: **sitting on the FLOOR BESIDE the bed** (back against the bed frame, legs drawn up slightly, knees bent) — perspective: camera looks DOWN at Tí from foot-of-bed angle. Both hands in lap holding **a worn cheap smartphone** (screen dim, showing the bank app with EMPTY BALANCE — "$0 VND" implied, just a generic stylized cartoon "0" on a green-and-white app interface). Head **bowed DOWN looking at the phone** (NOT at viewer). Expression: **DEFEATED HOLLOW QUIET SHAME** — eyes downcast to phone, eyebrows drawn together in sad pinch, small downturned frown, **NO tears** (he has cried enough already — now just hollow), 1-2 small sweat drops on temple, **NO blush circles**. Face proportions STAY NORMAL — do NOT enlarge head, do NOT stretch face, do NOT bug-eye out.
>
> **On the floor AROUND Tí**: a **small open cardboard box** with a few **neatly packed belongings** (folded clothes, used but intact textbooks, a reusable water bottle) — the BEGINNING of packing up to leave (the visual foreshadowing of eviction). A **single loan-shark flyer** resting on top of the box ("VAY NHANH 30 PHÚT" generic — NO real company — implies Tí has been considering this option).

> **⭐ SECONDARY CHARACTER — BÀ CHỦ TRỌ STANDING IN THE DOORWAY (LEFT EDGE of frame, ~40% of frame height, 3/4 angle from outside)**:
> **a 55-year-old Vietnamese woman**. Bà chủ trọ kiểu bà chủ trọ Hà Nội/Sài Gòn truyền thống — **chunky** body (không obese nhưng sturdy, ngang hông ~150% size của Tí), **matronly** appearance (NOT thin, NOT young). Outfit: dusty-rose short-sleeve button-front blouse (hex #c88f98, small cream flowers #f2e4cf with muted-green leaves #7c8b72, relaxed fit, untucked) + charcoal full-length straight-leg cotton trousers (hex #343434, relaxed fit, hems at ankles) + dark-brown flat plastic slide sandals (hex #6b4a36, one broad strap, no heel) + small round gold stud earrings (hex #c9a34e). Keep the same floral pattern, sleeve length, colors and accessories in every image.
> - **hair pulled back in a tight bun** (kiểu tóc búi củ tỏi, simple)
>
> POSE: **standing in the open doorway** (visible from chest up — rest cut off by door frame), **one hand on her hip** (chống nạnh — assertive, angry), **one hand pointing at Tí** (gesturing aggressively). Expression: **ANGRY IMPATIENT DEMANDING** — eyebrows drawn down in angry V, mouth open mid-shout (the cartoon angry shouting mouth — but still NORMAL proportions, NOT stretched-wide). 2-3 small cartoon anger marks above her head (the classic ‼‗ symbols but stylized). She is **NOT entering the room** — she's leaning in from the hallway.
>
> The doorway itself: same intact wooden door (slightly faded dark brown paint) but now **OPEN INWARDS** (door swung open, showing her in it).

> **Background atmosphere**:
> - The room is mostly the same as BG1 but with **added details**:
> - A **paper note** taped to the front of the desk — typed lines "ĐÃ HẾT HẠN — 30 NGÀY" (generic — NO real text, just chunky cartoon red text placeholder, suggesting "landlord has been lenient for 30 days already")
> - A **receipt paper** on the bedside table — generic cartoon receipt with red "3.000.000 VND" placeholder amount
> - A slightly thicker, neatly aligned stack of CV drafts rests on the desk (suggesting he has applied to more jobs); any discarded sheets stay inside the small wastebasket
> - A **clean bowl beside one unopened instant-noodle packet** on the desk (emphasizing inexpensive meals without dirt, spoiled food or rubbish)

> **Lighting**: **MIXED — FLAT WHITE PHONE SCREEN (small secondary) + DIM WARM YELLOW BULB from ceiling (primary)** — same melancholic atmosphere as BG1 but Tí is now lit from ABOVE (the dim bulb casts a pool of dim warm yellow light on Tí's hunched form on the floor — emphasizing his small defeated figure in the cramped space). The Bà chủ trọ in the doorway is BACKLIT slightly by the hallway's colder light (she glows slightly with cooler light from the hallway, contrasting with the warm interior).

> **Aspect ratio**: 16:9 cinematic widescreen. **Tí occupies CENTER-FOREGROUND** (~25-30% of frame height — sitting on the floor — but emphasized by being in center). **Bà chủ trọ in LEFT-DOORWAY** (~40% of frame height — standing tall, dominating the left third). Room interior fills the rest. NO CROPPING. NO DOORWAY BORDER.

> **⭐ CRITICAL CHARACTER IDENTITY RULES**:
> - **Tí MUST match `c4_ti_defeated.png`** in facial structure and look 22. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
> - **Bà chủ trọ** must look 55, chunky matronly, angry, NOT young, NOT thin.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 5.2 — NHÀ HÀNG SANG: BỮA TIỆC HỌP LỚP

### 📄 `c5_bg_class_reunion_restaurant.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Bữa tiệc họp lớp cuối năm tại nhà hàng sang. Thằng Minh khoe đã mua xe máy riêng, làm công ty nước ngoài. Tí ngồi ở góc bàn, mặt tự ái, tay cầm ly nước.
**Nhân vật trong ảnh**: Tí (chính, foreground-center) + Thằng Minh (chính, bên cạnh Tí) + 2-3 bạn đại học khác (background, xung quanh bàn)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 5 — Scene 5.2: Bữa tiệc họp lớp. Nhà hàng sang trọng kiểu Latin/Italian fusion (kiểu Pizza 4P's hoặc Mùa Restaurant) ở quận 1 TP.HCM hoặc khu phố cổ Hà Nội — tường gạch trần, đèn chandelier pha lê, bàn gỗ nặng, khăn trải bàn trắng. Bạn bè ĐH của Tí ngồi quanh 1 bàn dài, thằng Minh đang khoe chìa khóa xe SH trên tay. Tí ngồi ở 1 đầu bàn, mặt cúi buồn vì tự ái.

**🔗 CROSS-REFERENCE**:
- BG thoại cùng địa điểm: `c5_bg_class_reunion_restaurant_empty.png` (BG5). Giữ cùng nội thất, màu sắc và ánh sáng đêm; chỉ thêm nhân vật cho bản composite. Có thể tham khảo `c2_bg_restaurant_sang.png` về phong cách, nhưng nhà hàng Chương 5 có đèn chandelier, khăn trắng và bàn gỗ nặng riêng.
- Tí 22t-defeated → dùng `c4_ti_defeated.png` làm reference
- Thằng Minh 23t → mới, gen từ prompt dưới
- Folder output: `images/chuong-5/scene-5.2/`

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — UPSCALE VIETNAMESE FUSION RESTAURANT INTERIOR, Studio Ghibli bittersweet-elegant aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — a fancy restaurant dining room fills the entire frame edge-to-edge.
>
> **LEFT WALL**: An **exposed red-brick wall** (the trendy upscale-Vietnamese-resto look) with **3-4 vintage framed prints** (generic — black-and-white photos of old Saigon/Hanoi streets, NO real photographer credit). A **tall wooden wine rack** built into the wall (holding ~20 bottles, generic labels — NO real brands). 2 **chunky wall sconces** with warm filament bulbs.
>
> **BACK WALL (CENTER of frame, the wall opposite the camera)**: A **large open kitchen pass-through** (the trendy open-kitchen window where chefs work — chunky cartoon chefs in white toques visible inside, just silhouettes, NO detailed faces). The pass-through has a **brass-trimmed counter** with a **hanging menu chalkboard** above.
>
> **RIGHT WALL**: A **floor-to-ceiling arched window** (~3m tall) looking out to a **rainy night street** (Vietnamese city at night, neon signs reflecting on wet pavement, motorcycles with headlights passing — blurry cartoon silhouettes outside). Inside the window sill: **3 tall candles in glass jars** flickering softly.
>
> **CEILING (TOP of frame)**: **HIGH vaulted ceiling** (~5m) with **exposed dark wooden beams** + **3-4 elegant brass chandeliers** with **crystal pendants** hanging down (each with ~6 candle-style bulbs, currently ON — warm golden glow). The chandeliers are at slightly different heights (asymmetric, trendy). A **slow-rotating ceiling fan** between 2 chandeliers (warm wood blades).
>
> **FLOOR (BOTTOM of frame)**: **Polished dark hardwood floor** with subtle warm sheen. **THE CENTRAL LONG DINING TABLE** (the reunion table — ~3m long, solid dark walnut wood, rectangular, seats 8-10 people on both sides) covered with a **white linen tablecloth** hanging to the floor. On the table: **8-10 dinner settings** (white ceramic plates, wine glasses, cloth napkins in rings), a **cluster of small candles in the center** (3-4 thick cream pillar candles, lit), a **wooden salt/pepper mill**, a **small vase with single red rose**, several **half-full wine glasses** (deep red wine — cartoon chunky red liquid), a **few smartphones** placed casually, a **single motorcycle key** prominently displayed on the table near one person (the SH key — Minh is showing it off).
>
> **ENTRANCE WALL (NOT visible)**: Entrance is BEHIND the camera — the long table extends from foreground to background.

> **⭐ FOCAL POINT — TÍ SITTING AT THE END OF THE TABLE (CENTER-FOREGROUND of frame, ~50% of frame height, sitting on a wooden chair, 3/4 angle from camera)**:
> **a 22-year-old Vietnamese man (Tí, age-locked 22)**. Phải giống reference `c4_ti_defeated.png` nhưng **ĐỔI trang phục**:
> - Same face as reference (mature slim build, dark circles NHẸ, hair NGẮN hơi xơ xác)
> - Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
>
> POSE: **sitting on a wooden chair at the LONG END of the table** (the "loser end" — isolated at the table's head, far from the others), **body slumped slightly**, **both hands loosely holding a half-full water glass** (the only thing Tí is drinking — while others drink wine — emphasizing "Tí cannot afford wine"). Head **slightly turned** away from camera, **looking down at his water glass** (NOT at viewer, NOT at Minh). Expression: **BITTER PRICKED HOLLOW PRIDE** — eyes downcast to glass, eyebrows slightly knit in self-conscious tightness, small tight forced-smile-frown (the "social embarrassment" expression — not full sad, but that "I don't belong here" pinch), **1 small sweat drop** on temple, **NO blush circles**. His posture is **closed/protective** (shoulders forward, body small in big chair). Face proportions STAY NORMAL.

> **⭐ SECONDARY CHARACTER — THẰNG MINH, TALL CONFIDENT FRIEND (RIGHT-CENTER of frame, sitting next to Tí, leaning forward bragging)**:
> **a 23-year-old Vietnamese man**. Bạn thân kiểu đại học, **cao hơn Tí ~5cm** (177cm), **rounded body type** (NOT muscular, NOT thin — average-rounded build), **smug expression**. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.
>
> POSE: **leaning forward across the table TOWARD the camera** (showing off), **right hand holding up a SH-styled motorcycle key** (the smart-key fob kind, with the Honda "H" logo stylized — generic — NOT real brand, just a chunky cartoon key fob with red blinking dot indicating "smart key"), **left hand gesturing at the key** proudly. Mouth open mid-speech (the "khoe khoang" mid-sentence pose — still NORMAL mouth, NOT stretched). **Confident smirk** expression — eyebrows raised, corners of mouth turned UP slightly in self-satisfied grin. He's telling the group about his new bike + his new foreign-company job.

> **Around the table (BACKGROUND — 3-4 OTHER FRIENDS, kawaii cartoon-style with varying details)**:
> **2-3 OTHER FRIENDS** (Vietnamese, gender mixed, mostly 22-23 years old) sitting around the table, in conversation:
> - **1 male friend** sitting next to Minh (well-dressed casual — polo shirt + watch), listening to Minh, nodding, holding a wine glass
> - **1 female friend** across from Tí (wearing a casual blouse + jeans + small earrings), looking at Tí with **mixed expression** (between sympathy and pity — the awkward "tiếc cho Tí" look), mouth slightly downturned
> - **1 male friend** at the far end of the table from Tí, mostly silhouette visible
>
> All background friends are **LESS DETAILED than main characters** (~60-70% detail level) — chunky cartoon style, generic faces, conversational poses, holding wine glasses.

> **Background atmosphere**:
> - The restaurant is **busy but not packed** — 2-3 OTHER TABLES with diners visible in the far background (kawaii silhouettes, NOT detailed)
> - **Waitstaff** in the background (1-2 in white shirts + black aprons, holding menus, walking past — kawaii silhouettes)
> - Soft **jazz music** implied (a **small stage area visible in the far corner** with a **grand piano** — UNPLAYED, just a decorative prop, but with a stool and sheet music)
> - The chandeliers cast **warm golden pools of light** over each table
> - The candle flames flicker softly (giving the scene a **bittersweet warm romantic** mood — but Tí is not feeling it)

> **Lighting**: **WARM LOW-LIGHT EVENING GOLDEN** — the 3-4 brass chandeliers cast multiple **warm golden pools** across the table (the crystals catch and scatter light into small sparkles). The candles on the table add intimate flickers. The far window shows night (deep blue-black with neon reflections). Inside the restaurant: **contrast between BRIGHT, WARM, ELEGANT, LIVELY** (where Minh and friends are, full of wine and laughter) and **Tí in his own pocket of slightly DIMMER, more isolated space** (he's at the end of the table, slightly further from the central chandelier pool, slightly more shadowed — visually emphasizing his isolation even in this upscale setting). NO DOORWAY, NO DOORFRAME BORDER.

> **Aspect ratio**: 16:9 cinematic widescreen. **Tí occupies CENTER-FOREGROUND** (~50% of frame height, sitting). **Thằng Minh occupies RIGHT-CENTER** (~50% of frame height, sitting). **Other friends are around the table** (~30-40% of frame height, sitting). The long table dominates the foreground. Full restaurant BG visible. NO CROPPING.

> **⭐ CRITICAL CHARACTER IDENTITY RULES**:
> - **Tí MUST match `c4_ti_defeated.png`** in facial structure and look 22. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
> - **Thằng Minh** must look 23, taller than Tí, rounded build, confident, friendly rather than villain-coded. Outfit: crisp white long-sleeve button-down shirt (hex #ffffff, regular tailored fit, sleeves down with cuffs buttoned, tucked in) + dark-gray full-length tailored chinos (hex #3a3a3a, straight legs, hems at ankles) + brown leather loafers (hex #79513a) + thin black leather belt (hex #222222, small silver buckle) + silver metal-link wristwatch on LEFT wrist (band #b8bdc5, round dark face #242424, no brand logo). NO blazer. Keep the same watch, colors and fit in every image.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 5.3 — VĂN PHÒNG CÔNG TY NHỎ: KÝ HỢP ĐỒNG LƯƠNG THẤP

### 📄 `c5_bg_accepting_bad_job.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Tí ngồi trong phòng họp nhỏ, HR trước mặt đẩy hợp đồng 4.5tr/tháng. Tí nhìn xuống hợp đồng, mặt buồn + do dự.
**Nhân vật trong ảnh**: Tí (chính, foreground) + HR Cô ty nhỏ (chính, đối diện)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 5 — Scene 5.3: Lời đề nghị rẻ mạt. Phòng họp nhỏ của công ty startup ngoại ô. Bàn kính tròn 4 ghế. HR ngồi đối diện Tí, đẩy qua tờ hợp đồng. Tí ngồi im nhìn xuống.

**🔗 CROSS-REFERENCE**:
- BG: xem `c5_bg_small_company_office_empty.png` (BG3) — phòng họp công ty nhỏ
- Tí 22t-defeated → dùng `c4_ti_defeated.png` làm reference
- HR 32t → mới, gen từ prompt dưới
- Folder output: `images/chuong-5/scene-5.3/`

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — SAME SMALL CRAMPED VIETNAMESE OFFICE MEETING ROOM AS BG3, Studio Ghibli drained-clinical aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW)**:
> Same as `c5_bg_small_company_office_empty.png` (BG3) — the cramped meeting room with the small round glass table, 4 mismatched office chairs, the old whiteboard with faded scribbles, the small standing air-conditioner, the water dispenser, the dusty bookshelf, the window looking out to a narrow alley with gray sky.
>
> **KEY ADDITION FOR SCENE 5.3**: The **glass door of the meeting room is now OPEN** (visible on the RIGHT EDGE of frame — the glass door with "PHÒNG HỌP" sign, slightly open, showing a sliver of the open office area behind it — desks with old monitors visible in the open office area, 2-3 working silhouettes).

> **⭐ FOCAL POINT — TÍ SITTING AT THE GLASS TABLE (LEFT-FOREGROUND, ~50-55% of frame height, sitting, 3/4 angle)**:
> **a 22-year-old Vietnamese man (Tí, age-locked 22)**. Phải giống reference `c4_ti_defeated.png`:
> - Same face, dark circles NHẸ, hair NGẮN hơi xơ xác
> - Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
>   - **a small generic CV folder** placed on the table in front of him (the printed CV he brought)
>
> POSE: **sitting on a small plastic chair** (NOT fancy office chair — the company is cheap), **back slightly hunched**, **both hands on the table** in front of him (palms flat on glass — "what do I do?" posture), **head bowed looking down at the contract paper** on the table. Expression: **DEFEATED HESITANT SHAME** — eyes staring blankly at the paper, eyebrows drawn together in sad pinch, small tight downturned frown, **NO tears** (he's been emptied of emotion), 1-2 sweat drops on temple. He's been unemployed 2.5 months — he's DESPERATE but HESITANT (the contract has unfair terms). Face proportions STAY NORMAL.

> **⭐ SECONDARY CHARACTER — HR CÔNG TY NHỎ, SITTING OPPOSITE TÍ (CENTER-RIGHT of frame, ~50-55% of frame height, sitting, 3/4 angle)**:
> **a 32-year-old Vietnamese woman**. HR kiểu corporate-but-cheap-company — **slim-proportional build** (NOT chunky, NOT skinny — average Vietnamese female 32t), **professional-looking but tired** (kiểu "làm HR cho công ty nhỏ đã lâu nên mặt hơi mệt"). Outfit: beige long-sleeve blouse (hex #d4c4a8, relaxed but neat fit, cuffs buttoned, tucked in) + charcoal knee-length pencil skirt (hex #2a2a2a) + black closed-toe low block-heel pumps (hex #222222, heel height 3 cm) + thin gold necklace with a tiny round pendant (hex #c9a34e) + black rectangular eyeglasses. Keep the same sleeve length, skirt length, colors and accessories in every image.
> - **hair in a low ponytail** (the typical Vietnamese HR professional hair — neat)
>
> POSE: **sitting across the table from Tí, leaning back slightly**, **one hand holding a fancy pen** (the offer-signing pen, gold-and-black, mid-air — she's about to push it to Tí), **other hand resting on a stack of HR papers**. Expression: **NEUTRAL PROFESSIONAL — slightly impatient** — eyebrows neutral, mouth in a small forced-friendly smile (the kind HRs do when they know the offer is bad but they need a body in the seat), eyes looking at Tí with **measuring** gaze (NOT warm, NOT sympathetic — businesslike). The HR is **NOT a villain** — she's just doing her job in a cheap company.
>
> Between them on the table: the **printed job contract** (the focal point — a single A4 paper with chunky cartoon text lines + a highlighted "4,500,000 VND" placeholder in bold red + a few cartoon conditions text lines "Không bảo hiểm", "OT không tính phí" — generic placeholder, NO real readable text). Beside the contract: a **ceramic coffee cup** (HR's, half-finished), a **small water glass** (Tí's, untouched).

> **Background atmosphere**:
> - The meeting room is mostly the same as BG3 but with **added details**:
> - A **small desk nameplate** in front of the HR's chair reading "[Tên HR] — HR Manager" (generic — NO real name, just chunky cartoon placeholder text)
> - A **few rejected CVs** in a small stack on a side table (the HR has been rejecting many applicants — emphasizing the power imbalance)
> - The fluorescent tube is **humming** (cartoon "vrmmm" implied by small motion lines around the tube — the cheap flicker)

> **Lighting**: **HARSH FLUORESCENT WHITE-BLUE** (the typical cheap-company office light — flat, cold, slightly blue-tinged, casting very flat shadows under the eyes of both characters — emphasizing the "công ty bóc lột" energy). NO warm light, NO golden hour, NO romantic atmosphere — just cold clinical fluorescent reality. The atmosphere is **drained, desperate, transactional**. Tí is lit by the same flat cold light as the HR — equality in unflattering clinical light. The room feels **NOT bright, NOT airy, NOT cheerful** — just flat fluorescent emptiness.

> **Aspect ratio**: 16:9 cinematic widescreen. **Tí occupies LEFT-FOREGROUND** (~50-55% of frame height, sitting). **HR occupies CENTER-RIGHT** (~50-55% of frame height, sitting). The glass table with contract dominates the foreground. Full meeting room BG visible. NO CROPPING.

> **⭐ CRITICAL CHARACTER IDENTITY RULES**:
> - **Tí MUST match `c4_ti_defeated.png`** in facial structure and look 22. Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs) + simple off-white low-top canvas sneakers (hex #f5f5f0, matching off-white laces and soles, lightly worn but clean) + plain light-gray ankle socks (hex #c9c9c9). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes.
> - **HR must look 32, neutral professional but slightly tired — NOT villain, NOT aggressive, just "doing a job she knows is unfair"**. NOT young fresh grad energy, NOT old matron.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 LIFE EVENT 5 — PHÒNG CẤP CỨU ĐÊM: ĐAU DẠ DÀY

### 📄 `c5_bg_hospital_emergency.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Tí nằm trên cáng cấp cứu trong phòng cấp cứu bệnh viện lúc 3h sáng. Bác sĩ đang khám. Tí mặt nhợt nhạt.
**Nhân vật trong ảnh**: Tí (chính, nằm trên cáng) + Bác sĩ (chính, đứng cạnh cáng)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 5 — Life Event 5: Đau dạ dày cấp cứu. Áp lực thất nghiệp + ăn mì tôm dài ngày khiến Tí ngất xỉu tại phòng trọ, được đưa vào phòng cấp cứu bệnh viện lúc 3h sáng. Viện phí 3 triệu. Tí nằm trên cáng sắt, mặt nhợt nhạt, tay có kim truyền. Bác sĩ đứng cạnh đang khám.

**🔗 CROSS-REFERENCE**:
- BG: xem `c5_bg_hospital_room_night_empty.png` (BG4) — phòng bệnh viện đêm
- Tí 22t-defeated → dùng `c4_ti_defeated.png` làm reference
- Bác sĩ 45t → mới, gen từ prompt dưới
- Folder output: `images/chuong-5/life-event-5/`

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (giống hệt BG1)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL characters — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT bug-eye out the eyes even in shock or anger.

> **Setting (BG kawaii cartoon environment — SAME VIETNAMESE PUBLIC HOSPITAL EMERGENCY WARD AT NIGHT AS BG4, Studio Ghibli cold-clinical-melancholy aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW)**:
> Same as `c5_bg_hospital_room_night_empty.png` (BG4) — but now it's **PHÒNG CẤP CỨU (EMERGENCY ROOM)** instead of a regular ward bed:
> - **Center of frame**: A **hospital gurney/stretcher** (cáng cấp cứu — metal frame with thin mattress, raised slightly with mechanical lever, the typical bright blue-and-white sheet), wheeled trolley style. An **IV drip stand** next to it with the saline bag + tube running to Tí's left hand.
> - **Equipment around**: A **monitoring machine** (heart rate monitor) showing a chunky green waveform, an **oxygen tank** (large metal cylinder) on a wheeled stand, a **small instrument tray** (with stethoscope + blood pressure cuff + thermometer + a few generic vials — NO real labels)
> - **Background**: 2-3 other EMPTY GURNEYS in a row (the room has 4-6 spots, only 1 is occupied — Tí). One **curtain partially drawn** around the far corner (someone might be having a quiet conversation, but visible only as shadowed silhouettes).
> - **Ceiling**: same — fluorescent tube, one ON, others OFF
> - **Floor**: same — cold linoleum, with maybe a **small blood stain** (NOT gory — just a faded brownish-red mark that the cleaning crew missed, faintly visible)
> - **Door**: same partial-open double doors on the right

> **⭐ FOCAL POINT — TÍ LYING ON THE GURNEY (CENTER-LEFT of frame, ~70% of frame horizontal length — lying flat on back, 3/4 angle from above — camera looks DOWN at him slightly)**:
> **a 22-year-old Vietnamese man (Tí, age-locked 22)**. Phải giống reference `c4_ti_defeated.png` nhưng **ĐÃ CỰC KỲ TỆ HẠI** vì đau cấp cứu:
> - height **172cm**, mature slim build (đã sụt cân thêm do ăn mì gói nhiều ngày — nhìn GẦY HƠN reference)
> - face **PALER than reference** (nhợt nhạt gần như màu giấy — bệnh nhân nặng, mất nước)
> - **dark circles SÂU HƠN reference** (đợt này thì đậm thật — quầng thâm thâm sâu dưới mắt, NGƯỢC LẠI với rule ở các scene khác là "chỉ NHẸ" — ở LE 5 thì mới được ĐẬM vì đang bệnh nặng)
> - hair NGẮN **DISHEVELED, scattered messy** (không vuốt, không chải, xõa tùy ý — vì vừa ngất xỉu mới được đưa đến BV)
> - lips slightly **PALE / DRIED** (chapped, slightly blue-tinged at edges — the dehydration indicator)
> - Outfit: plain light-blue short-sleeve cotton polo shirt (hex #a8c4d8, soft collar with two matching buttons, regular fit, worn untucked to hip level, clean and intact, no logo) + dark-gray full-length straight-leg cotton chinos (hex #4a4a4a, regular fit, hems reaching the ankles, no tears, no rolled cuffs). NO blazer, NO tie, NO employee badge, NO jewelry or watch. Keep the same garment cut, colors and fit across all emotions and scenes. In this emergency scene ONLY, the polo is naturally wrinkled and temporarily lifted for examination/ECG leads. Both feet are bare; his off-white sneakers (#f5f5f0) and light-gray socks (#c9c9c9) are placed together on the floor mat beside the gurney. Keep his full-length chinos on, hems at ankles, no rolled cuffs; no hospital gown.
>
> POSE: **LYING FLAT ON BACK on the gurney**, head on a small flat pillow, **left arm extended** with the **IV needle inserted** (visible taping on the back of left hand + a thin tube running up to the drip), **right arm resting on his stomach** (clutching the stomach area — đang đau). Eyes **HALF-OPEN, glazed, looking up at the fluorescent light** with **FOCUSED PAIN expression** — eyebrows drawn up in pain-pinched V (the "đang chịu đựng" look), mouth **slightly open** mid-pained-breath, **beads of sweat on forehead** (NOT exaggerate sweat, just 4-5 small drops). Expression: **PHYSICAL PAIN + EXHAUSTION + DESPAIR** — physical because of stomach pain, exhaustion because of long-term stress, despair because "tao đang nằm viện 1 mình lúc 3h sáng". Face proportions STAY NORMAL — do NOT enlarge head, do NOT stretch face, do NOT bug-eye out.
>
> **On Tí's chest**: A few **ECG electrode stickers** (3-5 small round white stickers with wires running to the monitor) — showing the doctor's been checking his heart. On his stomach: the doctor's been pressing — there might be faint red press marks but NOT visible (we don't show the examination in detail).

> **⭐ SECONDARY CHARACTER — BÁC SĨ, STANDING BESIDE THE GURNEY (RIGHT-CENTER of frame, ~60% of frame height, standing, 3/4 angle)**:
> **a 45-year-old Vietnamese man**. Bác sĩ kiểu bác sĩ Việt Nam ở BV công — **average-proportional build** (NOT muscular, NOT thin — Vietnamese middle-aged doctor), **tired but competent expression**. Outfit: white knee-length lab coat (hex #f5f5f0, long sleeves, worn open, clean with light natural creases) over a navy-blue V-neck scrub top AND matching full-length straight-leg scrub trousers (hex #1a3a6a, hems at ankles) + plain black closed-toe slip-resistant medical shoes (hex #222222) + light-blue disposable exam gloves on both hands (hex #8ab8e0) + stethoscope around neck (black tubing, silver chestpiece) + plastic ID badge clipped to LEFT chest pocket (generic unreadable markings, no real name) + thin black rectangular eyeglasses. Keep the same coat length, scrub set, shoe color and badge position in every image.
> - **hair short, slight salt-and-pepper** at temples (the iconic Vietnamese 45t doctor hair)
>
> POSE: **standing beside the gurney** (Tí's right side), **looking down at Tí's stomach** (just examined), **holding a clipboard** in one hand (the medical chart with chunky cartoon medical notes — "ĐAU DẠ DÀY CẤP", generic — NO real text), **one gloved hand pointing at the IV tube** (adjusting the drip rate). Expression: **FOCUSED PROFESSIONAL CONCERN** — eyebrows slightly drawn together in concentration, mouth in a small concerned line, eyes looking down at his work. **NOT smiling** (this is a serious medical situation), **NOT cold** either — just focused.

> **Background atmosphere**:
> - The ward/cấp cứu room is mostly empty at 3 AM — 2-3 OTHER EMPTY GURNEYS visible, very few other people
> - A **NURSE silhouette** (kawaii silhouette, NOT detailed) visible in the far background at the nurse's station desk, head bowed (dozing between emergencies — the realism of BV công lúc 3h sáng)
> - The fluorescent tube is **slightly flickering** (cheap Vietnamese hospital maintenance issue)
> - A **paper wristband** on Tí's left wrist (the generic "BỆNH NHÂN" wristband with bar code)
> - **Quiet silence** of 3 AM empty hospital

> **Lighting**: **ONE COLD FLUORESCENT TUBE OVER TÍ'S GURNEY** as primary (casts a **cold white-blue pool over Tí lying down** — emphasizing his vulnerability — flat shadows under his eyes, cheekbones, jaw). Secondary: **faint cold-blue moonlight** from the high window (barely visible). The combination creates a **cold, lonely, late-night clinical atmosphere** — the "3 AM BV công" loneliness (the moment when you realize "tao đang nằm đây 1 mình, không ai biết"). NOT horror, NOT bloody, NOT gory — just quiet cold clinical sadness. Atmosphere: **hospital 3 AM solitude, fluorescent-lit loneliness, "tao đã đến đáy" mood**.

> **Aspect ratio**: 16:9 cinematic widescreen. **Tí occupies LEFT-CENTER (lying down — takes ~70% of frame width, ~30% of frame height)**. **Bác sĩ occupies RIGHT-CENTER (standing — ~60% of frame height)**. The gurney + equipment dominates the foreground-mid. Full hospital emergency ward BG visible. NO CROPPING.

> **⭐ CRITICAL CHARACTER IDENTITY RULES**:
> - **Tí MUST match `c4_ti_defeated.png`** in facial structure and look 22; in LE 5 his face is paler and dark circles deeper. Keep his light-blue polo (#a8c4d8) and full-length dark-gray chinos (#4a4a4a); polo temporarily lifted for examination, trouser hems remain at ankles. Off-white sneakers (#f5f5f0) and light-gray socks (#c9c9c9) are removed and placed beside the gurney. NO hospital gown, NO employee badge.
> - **Bác sĩ must look 45, Vietnamese, average build, professional but tired, NOT young, NOT villain, just "đang làm việc lúc 3h sáng"**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 🪧 PHẦN C — ẢNH TIÊU ĐỀ NHIỆM VỤ, SỰ KIỆN BẤT NGỜ VÀ TỔNG KẾT CHƯƠNG

> **Thiết kế theo mẫu người dùng**: nền minh họa 2D liên quan đến nội dung, bảng giấy kem viền gỗ ở chính giữa, chữ nâu đậm lớn và dễ đọc. Các ảnh nhiệm vụ/sự kiện dùng cùng kiểu bảng, bố cục và chữ. Ảnh tổng kết dùng tranh biểu tượng riêng và ba dòng chữ quy định trong prompt. Riêng sự kiện bất ngờ có viền sáng hổ phách quanh bảng để tạo điểm nhấn. Tổng kết gom ý nghĩa cả chương bằng đồ vật biểu tượng; không bị ràng buộc vào nền bệnh viện của cảnh cuối.
>
> **Định dạng**: PNG ngang **16:9**, đề xuất **1920 × 1080**, nền kín toàn khung, không bo góc hoặc chừa nền đen trong file ảnh. Bảng tiêu đề nằm giữa cả chiều ngang và chiều dọc; mọi chữ nằm trong vùng an toàn, cách mép ảnh tối thiểu 10%. Không có nhân vật, để ảnh không áp đặt biểu cảm hoặc kết quả lựa chọn của người chơi.
>
> **Quy tắc tên hiển thị**: dùng `Nhiệm vụ 1:`, `Nhiệm vụ 2:`, `Nhiệm vụ 3:`. Số nhiệm vụ bắt đầu lại từ 1 trong mỗi folder chương; không dùng số ghép như `5.1` hoặc chữ `Mission` trên ảnh. Chương 5 có 3 nhiệm vụ, không thêm nhiệm vụ 4. Sự kiện dùng đúng `Sự kiện bất ngờ: [tên sự kiện]`, không gắn số. Các mã Scene 5.1/5.2/5.3 và LE 5 trong tài liệu chỉ là mã đối chiếu cốt truyện, không phải chữ đưa lên ảnh.
>
> **Lưu file**: cả 5 ảnh dưới `images/chuong-5/`, theo cây thư mục cuối phần này. Đây là đường dẫn đầu ra khi tạo ảnh, không phải khẳng định ảnh PNG đã tồn tại.
>
> **Copy-paste**: mỗi khối dưới ghi trực tiếp style, thời điểm xuất hiện trong cốt truyện, vị trí tường/cửa/đồ nội thất, ánh sáng, điều kiện giữ đúng bối cảnh, bố cục chữ và negative. Copy nguyên một khối là đủ, không phải ghép thêm prompt BG hoặc tra file khác. Ảnh reference chỉ hỗ trợ đối chiếu; không thay mô tả đã ghi trong prompt. Không thêm `no text` từ BG cũ vì ảnh tiêu đề phải có chữ.

---

## 🪧 NHIỆM VỤ 1 — CHIẾC KHIÊN CUỐI CÙNG

### 📄 `bg_nhiem_vu_1.png`
**Loại**: Ảnh nền tiêu đề, không nhân vật, có chữ lớn ở giữa.
**Dùng cho**: Trước nhiệm vụ Chiếc khiên cuối cùng — quỹ khẩn cấp và tiền trọ (đối chiếu Scene 5.1).
**Output**: `images/chuong-5/bg_nhiem_vu_1.png`
**Chữ chính xác**: `Nhiệm vụ 1: Chiếc khiên cuối cùng`

```text
Create ONE 16:9 landscape PNG chapter mission title background, target 1920 x 1080. Vietnamese everyday-life visual novel, hand-drawn 2D cartoon environment with Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired environment styling, medium-thickness outlines, soft flat cel-shading, gentle gradients, softly textured wood and cream paper. This is an environment-only title illustration: NO people, NO silhouettes, NO character sprites. Not photorealistic, not 3D.

STORY CONTEXT AND EXACT APPEARANCE: Chapter 5, immediately before Mission 1 begins at Ti’s rented room, late afternoon on the rent deadline. Ti is a 22-year-old Vietnamese graduate who has been unemployed for two and a half months; the landlady is about to demand the monthly rent. Introduce the room BEFORE the confrontation, before checking the player’s emergency savings, before any loan or eviction branch. These facts guide the atmosphere only; do not render them as additional text or draw any people.

BACKGROUND — RENTAL ROOM AT THE RENT DEADLINE: A small approximately 12-square-meter Vietnamese student rental room on the third floor of a suburban building, familiar after four university years. Wide-angle camera INSIDE the room; no doorway border. LEFT: small window with intact painted metal bars, gray overcast afternoon sky, nearby tin roofs and electrical wires outside, clean slightly faded pink curtain; beneath it, a working white ceramic sink and an intact clean mirror in an aged plastic frame. BACK: sturdy single wooden bed with clean blue-white checkered bedding and one thin pillow; a small wall shelf holds used textbooks and a rolled diploma tied with red ribbon. RIGHT: well-kept secondhand wooden desk with light surface scuffs, matching simple chair, older working laptop, neatly stacked CVs, pen holder, reusable water bottle, a closed unmarked rent envelope and a small closed savings tin whose contents cannot be seen. ENTRANCE: intact dark-brown wooden door, CLOSED at the left edge before the landlady arrives. CEILING: low, clean off-white ceiling with one simple warm-yellow bulb. FLOOR AND WALLS: intact swept ivory ceramic tiles, clean cream walls gently yellowed with age, only faint furniture scuffs, no mold, peeling paint, leaks, cracked tiles, broken mirror, cobwebs or loose rubbish. The room is old but cared for, never ruined. No readable writing, laptop text, numbers or wall signage beyond the central title.

LIGHTING AND CONTINUITY: Dim but readable warm-yellow ceiling light mixed with soft gray late-afternoon window light. Keep the left window, back bed and right desk visible around the title panel so this is recognizably the room that the next scene enters. Do not change it into a bedroom in a wealthy home, a cafe, an office, a hospital or a ruined shack. No packing boxes, paid bill, loan app or visible balance that would impose a player outcome.

SELF-CONTAINED CONTINUITY RULE: The setting, architecture, props, lighting and story moment above are fully specified in this prompt. Use them directly without needing another prompt or reference image. Any attached image may help match details but must not replace this location or timing. The cream panel and wooden frame are a graphic title overlay, not a physical sign to add to the room. Only the exact Vietnamese title below is rendered as text.

COMPOSITION: Full-bleed background. At the exact horizontal and vertical center, place a large matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535), front-facing with no perspective skew. Panel occupies about 72% of image width and 46% of image height. Subtle rounded paper corners and soft shadow; the actual image remains rectangular. Leave the panel clear of objects and keep all lettering at least 10% away from the image edges.

RENDER THIS EXACT VIETNAMESE TEXT, centered as two lines:
Nhiệm vụ 1:
Chiếc khiên cuối cùng

TYPOGRAPHY: Large bold storybook serif lettering with full Vietnamese glyph support, dark brown (#3b2417) on cream. The mission name on line two is the dominant text; line one is about 70% of its font size. Both lines are highly legible, evenly spaced and centered. Preserve every accent and the colon after 1. This is the only readable text in the image. Integrate the title into the illustration itself.

NEGATIVE: missing title, blank sign, English title, Mission, 5.1, wrong mission number, misspelled Vietnamese, missing diacritics, extra captions, tiny text, ornate illegible calligraphy, overlapping letters, cropped title, text behind props, people, watermark, logo, photorealism, 3D render, black margins, rounded outer image crop.
```

---

## 🪧 NHIỆM VỤ 2 — BỮA TIỆC HỌP LỚP

### 📄 `bg_nhiem_vu_2.png`
**Loại**: Ảnh nền tiêu đề, không nhân vật, có chữ lớn ở giữa.
**Dùng cho**: Trước nhiệm vụ Bữa tiệc họp lớp — áp lực đồng trang lứa và sĩ diện (đối chiếu Scene 5.2).
**Output**: `images/chuong-5/bg_nhiem_vu_2.png`
**Chữ chính xác**: `Nhiệm vụ 2: Bữa tiệc họp lớp`

```text
Create ONE 16:9 landscape PNG chapter mission title background, target 1920 x 1080. Vietnamese everyday-life visual novel, hand-drawn 2D cartoon environment with Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired environment styling, medium-thickness outlines, soft flat cel-shading, gentle gradients, softly textured wood and cream paper. This is an environment-only title illustration: NO people, NO silhouettes, NO character sprites. Not photorealistic, not 3D.

STORY CONTEXT AND EXACT APPEARANCE: Chapter 5, immediately before Mission 2, the university class reunion at an upscale city restaurant on a rainy evening. Ti is still unemployed; his friend Minh will boast about his job and motorcycle. This title introduces the dinner BEFORE their conversation and before the player chooses whether to spend money out of pride or accept the friends’ generosity. No outcome, payment or argument has happened in this introductory image. These facts guide the atmosphere only; do not draw the characters or add explanatory text.

BACKGROUND — REUNION RESTAURANT BEFORE THE CONVERSATION: Wide-angle view from INSIDE an upscale Vietnamese fusion restaurant, looking lengthwise at a roughly three-meter dark-walnut reunion table. LEFT WALL: exposed red brick, three or four monochrome architectural street prints without people, built-in dark wooden wine rack and two brass sconces. BACK WALL: brass-trimmed open kitchen service counter, empty and unstaffed, with a blank dark menu board. RIGHT WALL: tall arched floor-to-ceiling window onto a rainy Vietnamese city night; blue-black sky and abstract neon reflections on wet pavement, no readable signs or people; three candles in glass jars on the sill. CEILING: high vaulted ceiling, dark wooden beams, three or four brass chandeliers with crystal pendants and a wooden ceiling fan. CENTER: long walnut table covered with white linen, eight to ten empty wooden chairs, white plates, wine glasses, cloth napkins, small candles, wooden salt/pepper mills and one red rose in a small vase; a single water glass at the near-end place setting. FLOOR: polished dark hardwood. A small grand piano and empty stool sit in a far corner. No diners, friends, staff, chefs or human reflections. Keep the restaurant’s distinctive brick wall, arched window, white tablecloth and chandeliers visible around the title. Do not put a motorcycle key on the table: Minh will hold his key in the following character scene. No receipts, bill, payment terminal or readable text except the central title.

LIGHTING AND CONTINUITY: Warm golden chandelier pools and gentle candlelight, contrasted with cool rainy-night blue from the RIGHT window. The elegant setting should convey the coming social comparison without showing any winner or loser. Keep this restaurant setting throughout the title, reunion narrative and dialogue; do not replace it with the optional cafe, a school classroom, a rental room or a daytime banquet hall.

SELF-CONTAINED CONTINUITY RULE: The setting, architecture, props, lighting and story moment above are fully specified in this prompt. Use them directly without needing another prompt or reference image. Any attached image may help match details but must not replace this location or timing. The cream panel and wooden frame are a graphic title overlay, not a physical sign to add to the room. Only the exact Vietnamese title below is rendered as text.

COMPOSITION: Full-bleed background. At the exact horizontal and vertical center, place a large matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535), front-facing with no perspective skew. Panel occupies about 72% of image width and 46% of image height. Subtle rounded paper corners and soft shadow; the actual image remains rectangular. Restaurant details remain visible around the panel. Nothing overlaps the letters; all lettering stays at least 10% away from image edges.

RENDER THIS EXACT VIETNAMESE TEXT, centered as two lines:
Nhiệm vụ 2:
Bữa tiệc họp lớp

TYPOGRAPHY: Large bold storybook serif lettering with full Vietnamese glyph support, dark brown (#3b2417) on cream. The mission name on line two is the dominant text; line one is about 70% of its font size. Both lines are highly legible, evenly spaced and centered. Preserve every accent and the colon after 2. This is the only readable text in the image. Integrate the title into the illustration itself.

NEGATIVE: missing title, blank sign, English title, Mission, 5.2, wrong mission number, misspelled Vietnamese, missing diacritics, extra captions, tiny text, ornate illegible calligraphy, overlapping letters, cropped title, text behind props, people, watermark, logo, photorealism, 3D render, black margins, rounded outer image crop.
```

---

## 🪧 NHIỆM VỤ 3 — LỜI ĐỀ NGHỊ RẺ MẠT

### 📄 `bg_nhiem_vu_3.png`
**Loại**: Ảnh nền tiêu đề, không nhân vật, có chữ lớn ở giữa.
**Dùng cho**: Trước nhiệm vụ Lời đề nghị rẻ mạt — định giá bản thân và điều kiện làm việc (đối chiếu Scene 5.3).
**Output**: `images/chuong-5/bg_nhiem_vu_3.png`
**Chữ chính xác**: `Nhiệm vụ 3: Lời đề nghị rẻ mạt`

```text
Create ONE 16:9 landscape PNG chapter mission title background, target 1920 x 1080. Vietnamese everyday-life visual novel, hand-drawn 2D cartoon environment with Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired environment styling, medium-thickness outlines, soft flat cel-shading, gentle gradients, softly textured wood and cream paper. This is an environment-only title illustration: NO people, NO silhouettes, NO character sprites. Not photorealistic, not 3D.

STORY CONTEXT AND EXACT APPEARANCE: Chapter 5, immediately before Mission 3’s interview and job-offer conversation, after Ti receives an invitation from a small company. Ti is a 22-year-old graduate still under pressure after prolonged unemployment. The next conversation is about a low-paid probationary offer without insurance or paid overtime. Place the title at the meeting-room stage BEFORE the contract is accepted or refused; do not show the earlier email-reading scene or a first day of employment. These facts guide the atmosphere only; no people and no explanatory text.

BACKGROUND — SMALL COMPANY MEETING ROOM BEFORE THE OFFER: A cramped meeting room in a modest Vietnamese company of five to ten employees, on an upper floor of an older suburban building. Wide-angle interior view, no doorway border. CENTER: small round glass table about one meter across, chrome legs and four mismatched chairs, some plastic and some old office chairs. On it: an unsigned A4 job contract represented only by abstract lines, a closed CV folder, a pen, one small ceramic coffee cup and one untouched water glass. LEFT WALL: older whiteboard with faded unreadable marks and a beige metal filing cabinet. BACK WALL: small window facing a narrow alley with gray afternoon sky, electrical wires and the neighboring concrete wall; a small standing air-conditioner beneath it. RIGHT WALL: shelf of red, blue and green binders, a modest plastic plant and a water dispenser with a large blue jug. CEILING: low white suspended ceiling and a long fluorescent tube. FLOOR: simple gray-brown vinyl, lightly worn. RIGHT EDGE: partly open aluminum-framed glass door showing a few unoccupied desks and older monitors outside; no readable door sign. No people, no office-worker silhouettes, no salary numbers, no readable clauses or company branding beyond the central title.

LIGHTING AND CONTINUITY: Flat cold white-blue fluorescent light, with weak gray afternoon daylight through the BACK window. Keep the cream title panel clearly readable while preserving the subdued office atmosphere around it. Maintain the round glass table, mismatched chairs, alley-facing window and standing air-conditioner from the following HR conversation. This is not a luxury corporate boardroom, a home desk, a restaurant or a celebratory job-success scene. Keep the contract unsigned and the chair positions unoccupied.

SELF-CONTAINED CONTINUITY RULE: The setting, architecture, props, lighting and story moment above are fully specified in this prompt. Use them directly without needing another prompt or reference image. Any attached image may help match details but must not replace this location or timing. The cream panel and wooden frame are a graphic title overlay, not a physical sign to add to the room. Only the exact Vietnamese title below is rendered as text.

COMPOSITION: Full-bleed background. At the exact horizontal and vertical center, place a large matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535), front-facing with no perspective skew. Panel occupies about 72% of image width and 46% of image height. Subtle rounded paper corners and soft shadow; the actual image remains rectangular. Office props stay at the periphery. Nothing overlaps the letters; all lettering stays at least 10% away from image edges.

RENDER THIS EXACT VIETNAMESE TEXT, centered as two lines:
Nhiệm vụ 3:
Lời đề nghị rẻ mạt

TYPOGRAPHY: Large bold storybook serif lettering with full Vietnamese glyph support, dark brown (#3b2417) on cream. The mission name on line two is the dominant text; line one is about 70% of its font size. Both lines are highly legible, evenly spaced and centered. Preserve every accent and the colon after 3. This is the only readable text in the image. Integrate the title into the illustration itself.

NEGATIVE: missing title, blank sign, English title, Mission, 5.3, wrong mission number, misspelled Vietnamese, missing diacritics, extra captions, tiny text, ornate illegible calligraphy, overlapping letters, cropped title, text behind props, signed contract, people, watermark, logo, photorealism, 3D render, black margins, rounded outer image crop.
```

---

## 🪧 SỰ KIỆN BẤT NGỜ — ĐAU DẠ DÀY CẤP CỨU

### 📄 `bg_su_kien_bat_ngo.png`
**Loại**: Ảnh nền tiêu đề sự kiện, không nhân vật, không đánh số.
**Dùng cho**: Trước cảnh cấp cứu đêm do đau dạ dày (đối chiếu LE 5).
**Output**: `images/chuong-5/bg_su_kien_bat_ngo.png`
**Chữ chính xác**: `Sự kiện bất ngờ: Đau dạ dày cấp cứu`

```text
Create ONE 16:9 landscape PNG unexpected-event title background, target 1920 x 1080. Vietnamese everyday-life visual novel, hand-drawn 2D cartoon environment with Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired environment styling, medium-thickness outlines, soft flat cel-shading, gentle gradients, softly textured wood and cream paper. This is an environment-only title illustration: NO people, NO silhouettes, NO character sprites. Not photorealistic, not 3D.

STORY CONTEXT AND EXACT APPEARANCE: Chapter 5, the unexpected stomach-pain emergency after the three missions. Ti has collapsed at his rental room after unemployment stress and prolonged cheap meals; this title transitions into the public hospital emergency-room scene at about 3 AM, BEFORE the examination and hospital-cost consequences are presented. Show the destination of this exact event, not a generic accident or a recovery scene. These facts guide the atmosphere only; draw no patient or doctor and add no explanatory text.

BACKGROUND — PUBLIC HOSPITAL EMERGENCY ROOM AT 3 AM: Wide-angle view from INSIDE a modest Vietnamese public hospital emergency room. LEFT-CENTER: empty wheeled metal gurney with a thin blue-white sheet and a small flat pillow, matching the stretcher used in the following examination. Beside it stand an IV pole with a clear saline bag, a basic monitor showing an abstract green waveform, an oxygen cylinder and a small metal instrument tray. BACK: two or three more empty gurneys and a pale blue-green privacy curtain, with a quiet unstaffed nurses’ station farther away. LEFT WALL: small high window with tilted blinds, deep blue-black night outside, no daylight. RIGHT EDGE: partly open double doors revealing a dim empty hospital corridor. CEILING: institutional off-white ceiling, only one long cold fluorescent tube switched on above the main gurney. FLOOR: gray-brown linoleum. No people, patients, nurses, doctors, silhouettes, blood, readable labels, clock digits or medical text; the central event title is the only readable text.

LIGHTING AND CONTINUITY: A cold white-blue pool from the single fluorescent tube, very faint blue night light from the high LEFT window and dim corridor spill at the RIGHT doors. Keep the stretcher, IV pole, monitor and blue-green curtain recognizable around the panel. Do not substitute a normal bedroom, daytime hospital lobby, operating theater or road accident. Restrained amber light streaks may decorate only the OUTSIDE of the central wooden title frame to mark an unexpected event; these are graphic accents, not actual fire, an explosion or a change to warm daytime hospital lighting.

SELF-CONTAINED CONTINUITY RULE: The setting, architecture, props, lighting and story moment above are fully specified in this prompt. Use them directly without needing another prompt or reference image. Any attached image may help match details but must not replace this location or timing. The cream panel and wooden frame are a graphic title overlay, not a physical sign to add to the room. Only the exact Vietnamese title below is rendered as text.

COMPOSITION: Full-bleed background. At the exact horizontal and vertical center, place a large matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535), front-facing with no perspective skew. Panel occupies about 78% of image width and 48% of image height to fit the longer title. Subtle rounded paper corners and soft shadow; the actual image remains rectangular. No glow or equipment crosses the lettering. Keep all text at least 10% away from image edges.

RENDER THIS EXACT VIETNAMESE TEXT, centered as two lines:
Sự kiện bất ngờ:
Đau dạ dày cấp cứu

TYPOGRAPHY: Large bold storybook serif lettering with full Vietnamese glyph support. Line one is dark brown (#3b2417), about 70% of the dominant second line's font size; line two is deep reddish brown (#713528). High contrast on cream, even spacing, clear accents. Include the colon after “ngờ”. Do NOT number the event. This is the only readable text in the image. Integrate the title into the illustration itself.

NEGATIVE: missing title, blank sign, English title, Life Event, Event 5, Sự kiện 5, LE 5, numbered event, misspelled Vietnamese, missing diacritics, extra captions, tiny text, ornate illegible calligraphy, overlapping letters, cropped title, people, blood, gore, fire, flames, explosion, watermark, logo, photorealism, 3D render, black margins, rounded outer image crop.
```

---

## 🪧 TỔNG KẾT CHƯƠNG 5 — VỮNG VÀNG QUA BIẾN CỐ

**Output**: `images/chuong-5/bg_tong_ket_chuong.png`
**Loại**: Tranh tổng kết biểu tượng, không nhân vật, 16:9 — 1920 × 1080.
**Dùng cho**: Nhìn lại ý nghĩa cả chương, dùng chung cho các nhánh.
**Ý nghĩa cần gợi**: Quỹ khẩn cấp; áp lực đồng trang lứa; định giá bản thân; đầu tư kỹ năng; rủi ro sức khỏe và chi phí bất ngờ.
**Thiết kế mới**: Vững vàng qua biến cố. Tiêu đề và câu chốt ý đặt trên khoảng giấy sáng ở giữa; các cụm đồ vật kể lại bài học nằm quanh rìa. Không dùng bảng gỗ lớn che gần hết cảnh. Đây là tranh hồi tưởng mang tính biểu tượng, không phải cảnh mới xảy ra sau nhiệm vụ cuối.

```text
Create ONE beautifully composed 16:9 full-bleed illustrated chapter-recap card, target 1920 x 1080. This is a finished visual-novel chapter reflection illustration, not a slide template or a literal continuation of the last scene.

STYLE: Hand-drawn 2D Vietnamese everyday-life storybook illustration, consistent with the established earnest slice-of-life game art: medium-thickness softly colored outlines, soft flat cel-shading with gentle gradients, subtle watercolor-paper grain, carefully simplified tangible objects, restrained warm natural light. Delicate edges, readable silhouettes, atmospheric depth, polished art direction. No photorealism, 3D, glossy vector clipart, giant cartoon faces or hyper-cute styling. NO people, character sprites, silhouettes, hands or human reflections.

CHAPTER MEANING: A protective arc of meaningful everyday objects suggests resilience during unemployment, with a small warm desk light illuminating the page rather than a victory sunrise. The lesson is: Quỹ khẩn cấp; áp lực đồng trang lứa; định giá bản thân; đầu tư kỹ năng; rủi ro sức khỏe và chi phí bất ngờ. This meaning is visual direction; do not render that explanatory sentence as text.

COLOR STORY: warm ivory #f4ecdf, deep muted blue #62768d, soft sage #94a58d and a small amber glow #d2ad76. Use cream for most of the image, two main supporting hues, and only small warm accents. Richer colors belong to the outer object groups; central text sits against a quiet light field.

CUSTOM ILLUSTRATED MOTIFS AND PLACEMENT: LOWER LEFT: a closed emergency-savings tin beside a plain rent envelope and an ordinary rental-room key, representing the reserve that can absorb a housing shock; no visible balance or empty/full comparison. UPPER LEFT: a simple restaurant plate, neatly folded napkin and a plain bank card set slightly apart, recalling peer pressure and spending for appearances without depicting an expensive feast. LOWER RIGHT: a carefully kept CV folder, an open learning book and a small sturdy green seedling, symbolizing professional self-worth and continued learning, not a job offer or earned certificate. UPPER RIGHT: a folded unmarked hospital bill with a small clean medical pouch, a restrained reminder of the nighttime emergency, no gurney, blood, recovery symbol or hospital-room panorama.

BACKGROUND AND ATMOSPHERE: Only a faint cream wall and a soft desk-lamp glow at the perimeter; main space is an illustrated reflective composition, not a literal room. Objects form a shallow protective crescent around the bottom and sides. Warm center and cool-blue edge shading express compassion and steadiness without promising recovery, employment or debt repayment.

COMPOSITION: One coherent illustration, not a grid or a set of cards. Arrange the specified object groups as an asymmetrical but balanced open wreath around a large central breathing space. Keep ALL objects outside the central text zone, approximately x=20-80% and y=28-65% of the canvas. Let the lower objects anchor the image, with lighter smaller accents above. Objects have consistent perspective and gentle contact shadows; no floating dashboard icons. Keep secondary details sparse, three depth levels at most. The light center has a soft irregular paper wash integrated into the artwork, NOT a rectangular parchment plaque, wooden sign, bordered box, ribbon banner or physical board. No hard frame around the image.

TEXT HIERARCHY AND EXACT VIETNAMESE COPY: Center-align the following three lines as one group, vertically centered around 46% of canvas height.
Line 1, modest chapter eyebrow, approximately 40 px at 1920 x 1080:
Tổng kết chương 5
Line 2, main meaning title, approximately 76 px, the largest text:
Vững vàng qua biến cố
Line 3, supporting reflection, approximately 34 px:
Giữ khoản dự phòng, giữ giá trị bản thân.

TYPOGRAPHY: Elegant bold readable storybook serif for the meaning title, simple clear medium-weight lettering for the chapter line and reflection. All text dark warm brown #3b3028 with strong contrast on light cream. Full accurate Vietnamese diacritics, no decorative strokes colliding with accents. Keep generous vertical gaps, at least 10% canvas-edge safety margin, no text touching objects. Main title must fit the central width; reduce it slightly only if needed, never crop it. These THREE specified lines are the ONLY readable text. All bills, books, screens, cards and calendars remain unmarked or abstract. No extra lesson labels or microtext.

NARRATIVE RULE: A thematic recap of learning, NOT a declared player achievement. No success badge, failure stamp, stars, grades, scores, balances, invented rates, selected choices, completed transaction or guaranteed outcome. Symbols show concepts explored in the chapter regardless of the chosen branches. 

ASPECT AND DELIVERY: ONE rectangular 16:9 PNG, 1920 x 1080, full bleed, no black margins. Artwork already includes the three specified text lines. No sprite or dialogue box should be layered over the finished card. If gameplay needs scores or detailed recap text, show them on a subsequent UI screen instead of covering this illustration.

NEGATIVE: huge wooden title panel, boxed parchment, generic last-room screenshot, slide deck, infographic grid, collage of screenshots, split-screen rooms, icon stickers, money rain, giant coin piles, glitter explosion, victory trophy, neon finance dashboard, upward profit arrow, confirmed outcome, people, faces, hands, silhouettes, readable prop labels, extra text, misspelled Vietnamese, missing accents, tiny captions, crowded center, overlapping lettering, cropped title, illegible calligraphy, watermark, logo, photorealism, 3D render, heavy black outlines, black borders.
```

**Kiểm tra riêng ảnh tổng kết**: Đủ 3 dòng chữ đúng dấu; bài học được gợi qua đồ vật; trung tâm thoáng; không có bảng gỗ che tranh; không thể hiện người chơi đã thắng/thua. Giữ màu sắc và nét vẽ đồng bộ cả bộ, nhưng bố cục đồ vật đúng riêng chương 5.


### 📁 Cây thư mục đầu ra — ảnh tiêu đề Chương 5

```text
images/
└── chuong-5/
    ├── bg_nhiem_vu_1.png
    ├── bg_nhiem_vu_2.png
    ├── bg_nhiem_vu_3.png
    ├── bg_su_kien_bat_ngo.png
    └── bg_tong_ket_chuong.png
```

> Khi áp dụng cho chương khác, đổi folder thành `chuong-N/` và bắt đầu lại từ `bg_nhiem_vu_1.png`. Chương nào có nhiệm vụ thứ 4 mới thêm `bg_nhiem_vu_4.png`. Tên file sự kiện không gắn số; nếu một chương có nhiều sự kiện, thêm tên sự kiện không dấu vào tên file để phân biệt.

---

# 📋 BẢNG TỔNG HỢP

## Tất cả BG (không nhân vật) — 5 file

| # | Tên file | Mô tả | Dùng cho Scene |
|---|---|---|---|
| 1 | `c5_bg_rental_room_empty.png` | Phòng trọ cũ vừa phải, sạch và nguyên vẹn, ánh đèn vàng dịu | 5.1 (dialogue) |
| 2 | `c5_bg_cafe_evening.png` | Quán cà phê chiều muộn | Optional transition |
| 3 | `c5_bg_small_company_office_empty.png` | Văn phòng công ty nhỏ tù đọng | 5.3 (dialogue) |
| 4 | `c5_bg_hospital_room_night_empty.png` | Phòng bệnh viện đêm 3h sáng | LE 5 (optional) |
| 5 | `c5_bg_class_reunion_restaurant_empty.png` | Nhà hàng họp lớp, không người và không chữ | Nhiệm vụ 2 / 5.2 (dialogue) |

## Tất cả SCENE composite (có nhân vật) — 4 file

| # | Tên file | Nhân vật chính | Nhân vật phụ | Dùng cho |
|---|---|---|---|---|
| 1 | `c5_bg_rental_room_evicted.png` | Tí (sitting floor) | Bà chủ trọ (doorway) | Scene 5.1 narrator |
| 2 | `c5_bg_class_reunion_restaurant.png` | Tí (table end) | Thằng Minh (bragging) + 3 friends | Scene 5.2 narrator |
| 3 | `c5_bg_accepting_bad_job.png` | Tí (across table) | HR (offering contract) | Scene 5.3 narrator |
| 4 | `c5_bg_hospital_emergency.png` | Tí (lying gurney) | Bác sĩ (examining) | LE 5 narrator |

## Ảnh tiêu đề có chữ — 5 file mới

| Đường dẫn output | Chữ hiển thị chính xác | Vị trí sử dụng |
|---|---|---|
| `images/chuong-5/bg_nhiem_vu_1.png` | Nhiệm vụ 1: Chiếc khiên cuối cùng | Trước nhiệm vụ 1 |
| `images/chuong-5/bg_nhiem_vu_2.png` | Nhiệm vụ 2: Bữa tiệc họp lớp | Trước nhiệm vụ 2 |
| `images/chuong-5/bg_nhiem_vu_3.png` | Nhiệm vụ 3: Lời đề nghị rẻ mạt | Trước nhiệm vụ 3 |
| `images/chuong-5/bg_su_kien_bat_ngo.png` | Sự kiện bất ngờ: Đau dạ dày cấp cứu | Trước cảnh cấp cứu |
| `images/chuong-5/bg_tong_ket_chuong.png` | Tổng kết chương 5 | Cuối chương, vào phần tổng kết |

> **Tổng cộng trong file: 14 prompt ảnh** = 5 BG trống + 4 SCENE composite + 5 ảnh tiêu đề có chữ. Ảnh tiêu đề là ảnh bổ sung, không thay nền thoại hoặc ảnh kể chuyện.

## Lệnh gen — thứ tự ưu tiên

> 🎯 **Khuyến nghị**: gen theo thứ tự này để mỗi ảnh reference đều có sẵn khi cần.

1. **Trước tiên** — gen `c5_bg_rental_room_empty.png` (BG1) để có backdrop phòng trọ
2. Sau đó — gen `c5_bg_rental_room_evicted.png` (SCENE 5.1) — upload Tí reference `c4_ti_defeated.png` + bà chủ trọ gen mới
3. Gen `c5_bg_class_reunion_restaurant_empty.png` (BG5) trước để chốt nhà hàng; sau đó gen `c5_bg_class_reunion_restaurant.png` (SCENE 5.2), dùng BG5 làm reference không gian cùng reference Tí và Minh đã duyệt để giữ nhận diện và trang phục.
4. Gen `c5_bg_small_company_office_empty.png` (BG3) + `c5_bg_accepting_bad_job.png` (SCENE 5.3) — upload Tí + HR mới
5. Gen `c5_bg_hospital_room_night_empty.png` (BG4) + `c5_bg_hospital_emergency.png` (LE 5) — upload Tí + bác sĩ mới
6. **Optional** — gen BG2 quán cà phê nếu cần transition scene
7. Gen 3 ảnh tiêu đề `bg_nhiem_vu_1.png`, `bg_nhiem_vu_2.png`, `bg_nhiem_vu_3.png` bằng các khối đầy đủ ở Phần C; dùng ảnh đầu tiên đã duyệt làm reference bố cục bảng và kiểu chữ cho hai ảnh còn lại.
8. Gen ảnh sự kiện theo thiết kế bảng tiêu đề; ảnh tổng kết theo tranh biểu tượng riêng. Lưu cả 5 ảnh vào `images/chuong-5/`.

### Kiểm tra riêng cho ảnh tiêu đề trước khi dùng

- Đọc lại nguyên văn từng dấu tiếng Việt, dấu hai chấm và số nhiệm vụ; không có chữ Mission hoặc số dạng 5.1 trên ảnh.
- Tên nằm chính giữa, đủ lớn và rõ khi thu nhỏ; bảng và chữ không bị cắt hoặc che bởi đồ vật.
- Sự kiện hiển thị đúng `Sự kiện bất ngờ: Đau dạ dày cấp cứu`, không có số sự kiện.
- Tổng kết hiển thị đúng ba dòng chữ trong prompt riêng, không tự ghi điểm, thành tích hay kết quả nhánh.
- Giữ cùng bảng giấy, viền gỗ và kiểu chữ giữa cả 5 ảnh; kiểm tra đúng folder chương và tên file trong bảng output.

> ⚠️ **Quy tắc đặc biệt LE 5**: Tí trong ảnh này có **dark circles SÂU HƠN các scene khác** (đợt này mới được ĐẬM vì bệnh nặng). Khi gen, **ghi rõ "DEEP DARK CIRCLES (this scene is medical crisis — different from other scenes)"** để AI không copy rule NHẸ từ các scene trước.
