# 🎬 CHƯƠNG 4 — BACKGROUND & SCENE PROMPTS

> **MỤC ĐÍCH**: Tách riêng **BG** (nền trống, không nhân vật) và **SCENE** (composite, có nhân vật) cho Chương 4 — **Thực tập sinh** (Tí 22 tuổi).
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Tất cả BG và SCENE phải dùng **CHÍNH XÁC** earnest teen proportions (giống Chương 1-3) — KHÔNG dùng kawaii 1:2.5 chibi. Khi ghép sprite emotion lên BG, phải nhất quán về art style.
>
> **⚠️ QUY TẮC TUỔI NHÂN VẬT**: Tí 22t là sinh viên năm cuối / thực tập sinh IT. Phải prompt lại character reference (chiều cao, vóc dáng, gương mặt, tóc, trang phục đi làm).
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

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 4)

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt |
|---|---|---|---|
| Tí | **22** | 🇻🇳 Việt Nam | `a 22-year-old Vietnamese man` |
| NV Ngân hàng | **30** | 🇻🇳 Việt Nam | `a 30-year-old Vietnamese man` |
| Scammer | **24** | 🇻🇳 Việt Nam | `a 24-year-old Vietnamese man` |
| Giảng viên | **50** | 🇻🇳 Việt Nam | `a 50-year-old Vietnamese woman` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các scene của cùng 1 nhân vật.

### Aspect ratio + mapping theo loại scene VN

| Loại ảnh | Tỉ lệ | Loại scene VN dùng | Đặc điểm |
|---|---|---|---|
| **BG trống** (cho dialogue — không nhân vật) | 16:9 ngang | `type: 'dialogue'` | Nền môi trường toàn cảnh rỗng, sẽ ghép sprite portrait lên |
| **BG composite** (có nhân vật sẵn trong ảnh) | 16:9 ngang | `type: 'narrator'` | Toàn cảnh 16:9 Việt Nam, có nhân vật Việt đang hành động trong ảnh — KHÔNG render sprite riêng |

### 🔗 CROSS-REFERENCE ĐẾN CHƯƠNG 3 (dùng ảnh Tí 19t làm reference khi gen ảnh Tí 22t)

> 🎯 **QUAN TRỌNG**: Khi gen ảnh Tí 22t ở chương 4 (thực tập sinh), phải upload kèm **ảnh Tí 19t (`c3_ti_neutral.png`)** làm reference để AI giữ đúng phong cách nhân vật, chỉ thay đổi tuổi + trưởng thành + đồ đi làm.
>
> **⚠️ LƯU Ý QUAN TRỌNG VỚI 3 NHÂN VẬT MỚI (NV Ngân hàng, Scammer, Giảng viên)**: KHÔNG CÓ reference từ chương trước → gen đầu tiên từ prompt, không cần upload ảnh.

| Nhân vật chương 4 | Dùng ảnh reference | Ghi chú |
|---|---|---|
| Tí 22t (mọi scene) | `c3_ti_neutral.png` (Tí 19t: tóc side part, áo thun xám, jeans xanh nhạt) | Giữ nguyên khuôn mặt, nhưng ĐỔI tóc NGẮN slicked-back + áo sơ mi TRẮNG + cà vạt + quần tây + giày tây + BADGE |
| NV Ngân hàng 30t | **KHÔNG CÓ reference** | Nhân vật mới — gen đầu tiên |
| Scammer 24t | **KHÔNG CÓ reference** | Nhân vật mới — gen đầu tiên |
| Giảng viên 50t | **KHÔNG CÓ reference** | Nhân vật mới — gen đầu tiên |

---

# 👥 CÁC NHÂN VẬT XUẤT HIỆN Ở CHƯƠNG 4

| ID | Tên nhân vật | Tuổi cố định | Quốc tịch | Vai trò | Xuất hiện trong file này? |
|---|---|---|---|---|---|
| `ti` | Tí (nhân vật chính) | **22** | 🇻🇳 Việt Nam | Thực tập sinh IT | ✅ Có |
| `nvnganhang` | NV Ngân hàng | **30** | 🇻🇳 Việt Nam | Tư vấn trả góp 0% | ✅ Có |
| `scammer` | Scammer | **24** | 🇻🇳 Việt Nam | Lừa đảo đầu tư | ✅ Có |
| `giangvien` | Giảng viên | **50** | 🇻🇳 Việt Nam | Trả bài thi | ✅ Có |

---

# 🎨 STYLE TOKEN — BG VÀ SCENE (earnest teen — giống Chương 1-3)

> **⚠️ KHÁC VỚI BIBLE GỐC**: Bible cũ dùng 1:2.5 kawaii chibi, nhưng dự án này đã chốt dùng **earnest teen proportions 1:4-1:5** từ Chương 1 → phải giữ nhất quán. KHÔNG copy style từ `image-generation-bible.md` mục Scene 5.1-5.4 (đó là style cũ).

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

## 📍 BG 1 — CỬA HÀNG ĐIỆN TỬ (SHOWROOM LAPTOP)

### 📄 `c4_bg_electronics_store_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại với NV Ngân hàng về hợp đồng trả góp laptop 18tr (Scene 5.1)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Scene 5.1: Laptop cứu tinh. Cửa hàng điện tử (FPT Shop / Phong Vũ style) ở trung tâm thương mại / mặt đường lớn. Trưng bày laptop, có bàn tư vấn trả góp riêng. NV Ngân hàng setup bàn nhỏ ngay trong cửa hàng để ký hợp đồng tại chỗ.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (bắt buộc dùng y hệt Chương 1-3, KHÔNG dùng bible cũ)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (BG kawaii cartoon environment — MODERN VIETNAMESE ELECTRONICS RETAIL STORE SHOWROOM, Studio Ghibli urban-temptation aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the showroom**, capturing the whole store. The viewer does NOT look through a door — the showroom simply fills the entire frame edge-to-edge like a wide panoramic photo from inside. **ALL FOUR WALLS visible** with **floor and ceiling all visible**.
>
> **LEFT side**: rows of **illuminated display shelves** stacked with **brand-new laptops** (5-6 cartoon chunky laptops showing colorful screens — MacBook silver, Dell black, Asus blue, etc.) arranged on glass shelves with small price tags underneath each (generic stylized — NO real text, NO real prices, just small cartoon yellow price tags with placeholder numbers). Above the shelves: **bright LED strip lights** (white cool light) + a **hanging banner** with stylized cartoon laptop logos (generic silhouettes).
>
> **CENTER of frame**: a **tall glass pedestal** displaying the **"flagship" laptop** (the 18-million-VND target — silver chunky laptop on a rotating stand, screen glowing bright, a small red sticker "HOT" visible). This is the temptation focal point.
>
> **RIGHT side**: a **small fold-out counter/table** (the bank's pop-up desk for installment contracts) with **2 office chairs**, a **stack of generic cartoon installment contract papers**, a **small calculator**, a **pen holder with red pens**, a **wobbly standing banner** with stylized "TRẢ GÓP 0%" text (generic placeholder — NO real bank name, NO real brand, just chunky cartoon letters in red/yellow). A few **small Vietnamese flags** on the counter (tiny desk flags).
>
> **BACK wall (far)**: large **glass storefront window** showing **bright urban daytime outside** (busy street with cartoon motorbikes passing, neon signs, tall building silhouettes). The bright daylight streaming in adds contrast.
>
> **CEILING**: clean white acoustic tiles with **bright LED panel lights** (cool white fluorescent store lighting) + a few small **security cameras** (small white dome cameras mounted on ceiling).
>
> **FLOOR**: polished gray-white tile, a few **carpet mats** near the entrance, the **soft glow of LED strip lights** reflecting on the polished surface.
>
> NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH.
>
> **Lighting**: bright cool white LED ceiling lights + bright daylight from storefront window + warm glow from laptop screens + warm spotlight on the flagship pedestal — **clean modern consumer-electronics-showroom atmosphere in kawaii cartoon style, slightly sterile/cold but with warm laptop screen accents**.
>
> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the showroom fills the entire frame with NO door, NO doorframe, NO wall edges — the very left edge is display shelves, the very right edge is the bank counter, the top edge is ceiling, the bottom edge is floor). **Background image ONLY, no characters**.

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — **KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes**), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (BG kawaii cartoon environment — MODERN VIETNAMESE ELECTRONICS RETAIL STORE SHOWROOM, Studio Ghibli urban-temptation aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the showroom itself, far from any door or wall**, capturing the whole store in a single panoramic view. **The camera is INSIDE the store, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. Image is FULL-BLEED — the showroom extends edge-to-edge across the entire 16:9 frame. The very left edge of the frame is display shelves (continuing into the wall), the very right edge is the bank counter (continuing into the wall), the top edge is the ceiling, the bottom edge is the floor. **ALL FOUR WALLS visible** with **floor and ceiling all visible**, the showroom opens up like a typical Vietnamese electronics retail store rented by a major chain.
>
> **LEFT side of frame**: rows of **illuminated display shelves** (kawaii cartoon chunky white shelves with bright LED strip lights under each shelf) stacked with **brand-new laptops** (5-6 cartoon chunky laptops showing colorful screens — silver MacBook-style, black Dell-style, blue Asus-style, etc.) arranged on glass shelves with small price tags underneath each (generic stylized — NO real text, NO real prices, just small cartoon yellow price tags with placeholder numbers). Above the shelves: bright LED strip lights (cool white light) + a **hanging banner** with stylized cartoon laptop logos (generic silhouettes, NO real brands).
>
> **CENTER of frame**: a **tall glass pedestal** displaying the **"flagship" laptop** (the 18-million-VND target — silver chunky laptop on a rotating stand, screen glowing bright, a small red cartoon sticker "HOT" visible on the screen corner). This is the temptation focal point.
>
> **RIGHT side of frame**: a **small fold-out counter/table** (the bank's pop-up desk for installment contracts) with **2 office chairs** (gray), a **stack of generic cartoon installment contract papers** with placeholder text lines, a **small calculator**, a **pen holder with red pens**, a **wobbly standing banner** with stylized "TRẢ GÓP 0%" text (generic placeholder — NO real bank name, NO real brand, just chunky cartoon letters in red/yellow). A few **small Vietnamese flags** on the counter (tiny desk flags — red with yellow star, generic placeholder).
>
> **CENTER-BACK wall (far)**: large **glass storefront window** showing **bright urban daytime outside** (busy street with cartoon motorbikes passing, neon signs in Vietnamese glowing softly pink/yellow/cyan, tall building silhouettes, motorbike traffic). The bright daylight streaming in adds contrast.
>
> **CEILING (TOP of frame)**: clean white acoustic tiles with **bright LED panel lights** (cool white fluorescent store lighting — the BRIGHTEST light source in the frame) + a few small **security cameras** (small white dome cameras mounted on ceiling — chunky cartoon style).
>
> **FLOOR (BOTTOM of frame)**: polished gray-white tile, a few **carpet mats** (dark blue) near where the entrance would be, the **soft glow of LED strip lights** reflecting on the polished surface (kawaii cartoon reflection lines).
>
> NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH.
>
> **Lighting**: bright cool white LED ceiling lights (BRIGHTEST, casting cool white pool over the whole store) + bright daylight from storefront window + warm glow from laptop screens (small warm accents scattered on left shelves) + warm spotlight on the flagship pedestal (small warm pool around the 18tr laptop) — **clean modern consumer-electronics-showroom atmosphere in kawaii cartoon style, slightly sterile/cold but with warm laptop screen accents creating focal points**.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE (the showroom fills the entire frame with NO door, NO doorframe, NO wall edges, NO window frame border, NO arch, NO rectangular framing visible — the very left edge is display shelves, the very right edge is the bank counter, the top edge is ceiling, the bottom edge is floor). **Background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 2 — VĂN PHÒNG CÔNG TY IT (BÀN LÀM VIỆC TÍ)

### 📄 `c4_bg_office_cubicle_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại nội tâm về việc mua BNPL điện thoại mới (Scene 5.2), hoặc Tí ngồi code đồ án tại bàn
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Văn phòng công ty IT nơi Tí thực tập (kiểu startup nhỏ hoặc phòng IT của công ty lớn). Bàn làm việc cá nhân của Tí, dual monitor, laptop cá nhân, tai nghe. Đồng nghiệp xung quanh làm việc (chỉ là background mờ).

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (BG kawaii cartoon environment — MODERN VIETNAMESE IT COMPANY OFFICE CUBICLE, Studio Ghibli urban-working aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the office**, capturing Tí's cubicle and the surrounding workspace. **The camera is INSIDE the office, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE**. Image is FULL-BLEED.
>
> **CENTER of frame**: **Tí's workstation** (this is the focal point, will be where Tí sits in dialogue scene — but for BG we keep it empty):
> - **Modern L-shaped white desk** with:
>   - **2 large external monitors** (chunky cartoon rectangle monitors, generic stylized — left monitor showing fake code editor with colorful syntax lines #7dd3fc #fbbf24 #22c55e on dark #1e293b background, right monitor showing Slack/Teams UI with generic chat bubbles)
>   - **Laptop open on the desk** (small chunky cartoon laptop, personal device)
>   - **Mechanical keyboard** (cartoon RGB style, generic colors)
>   - **Mouse + mousepad**
>   - **Small ceramic mug of coffee** (chunky kawaii mug with steam rising, warm brown coffee)
>   - **A few stacked university textbooks** (Giải tích, Cấu trúc dữ liệu — generic cartoon books with Vietnamese text on spines)
>   - **Small desk plant** (cây xanh nhỏ in pot — succulents style)
>   - **Over-ear black headphones** resting on desk
> - **Ergonomic office chair** (gray mesh, modern kawaii style) — empty for BG
> - **Small phone dock** with a **flagship smartphone** (the target of Tí's BNPL desire — visible in BG as a subtle detail)
>
> **LEFT side of frame**: floor-to-ceiling **glass partition wall** (frosted glass with cartoon kawaii lines) separating Tí's cubicle from another cubicle. Through the frosted glass: **soft silhouettes of 1-2 colleagues** working at their desks (very small simplified silhouettes, NOT detailed).
>
> **RIGHT side of frame**: **white office cabinets** + a **small bookshelf** with technical books + a **mini fridge** (chunky white fridge with a small cartoon sticker).
>
> **BACK wall**: **glass walls of the office** with **vertical blinds** half-closed, showing **bright urban daytime outside** (city skyline, modern office buildings, a glimpse of sky).
>
> **CEILING**: white acoustic tiles + **LED panel lights** + a few **small ceiling speakers** + **AC vents** + a few **white dome security cameras**.
>
> **FLOOR**: light gray carpet tiles (modern office), a few **cables neatly bundled** under the desk.
>
> NO people, NO characters, NO sprites, NO DOORWAY.
>
> **Lighting**: cool modern LED panel lights + soft daylight through glass walls + small warm glow from monitors (cool blue accent on desk from screens) + warm pool from coffee mug steam — **clean modern IT office working atmosphere in kawaii cartoon style**.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 3 — QUÁN CAFE ĐÊM (NƠI GẶP SCAMMER)

### 📄 `c4_bg_cafe_night_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại với Scammer (bạn cũ ĐH) về cơ hội đầu tư "30%/tháng" (Scene 5.3)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Scene 5.3: Cạm bẫy "Làm giàu không khó". Quán cafe đêm kiểu Highlands / The Coffee House nhưng vibe tối hơn (đèn Edison vàng, tường gạch trần, view đường phố ban đêm qua cửa kính). Tối thứ 7, Tí hẹn gặp "Minh" — bạn cũ ĐH — người giới thiệu cơ hội đầu tư. Quán vắng, chỉ có 2 người.

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (BG kawaii cartoon environment — MOODY NIGHTTIME VIETNAMESE CAFÉ INTERIOR, Studio Ghibli noir-suspense aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the café**, capturing the whole interior. **The camera is INSIDE the café, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges**. Image is FULL-BLEED.
>
> **LEFT side of frame**: **exposed red brick wall** with a few **small black-and-white framed photos** (cartoon kawaii silhouettes — NOT real photos, NOT real people). A **single hanging Edison bulb** (warm amber glow, casting a small warm pool of light below). A small **wooden shelf** with a few **coffee-related knickknacks** (cartoon chunky ceramic mugs, small plants).
>
> **CENTER of frame**: a **small round dark-wood table** (this is the focal point — the meeting table for the dialogue) with **2 empty ceramic coffee cups** on it (chunky kawaii white cups with coffee residue, steam long gone), a **small ceramic ashtray** (empty), a **crumpled napkin**. 2 **dark wood chairs** facing each other (empty for BG).
>
> **RIGHT side of frame**: **large floor-to-ceiling window** with **rain streaking down the glass** (cửa sổ lớn có nước mưa chảy). Through the window — **busy urban night street**:
> - **Neon signs in Vietnamese** glowing pink/cyan/yellow ("CAFE", "TIỆM VÀNG")
> - **Cartoon motorbike silhouettes** passing by with red taillights
> - **Wet asphalt reflecting** the neon glow (kawaii cartoon reflection lines)
> - **A few pedestrians with umbrellas** (small simplified silhouettes)
> - **Dark night sky** with a few stars visible
>
> **CEILING**: **dark wooden beams** with multiple **hanging Edison bulbs** in a row (warm amber pool of light over each table — most OFF, only 2-3 ON near the meeting table).
>
> **FLOOR**: **dark polished concrete** (or worn dark wood planks) with subtle reflections of the Edison bulbs.
>
> **BACKGROUND details**: a **small bar counter** far in the back (with espresso machine silhouette, NOT detailed), a few **other empty tables with chairs** (empty — café is quiet tonight), a **small bookshelf** with a few books.
>
> NO people, NO characters, NO sprites, NO DOORWAY.
>
> **Lighting**: **MOODY NOIR** — main light sources are 2-3 warm Edison bulbs (small warm amber pools on the meeting table and a few other spots) + **cool blue neon spillover** from the rainy window (subtle cool blue tint on the right side near the window) + **dark shadows** everywhere else — **dramatic contrast, suspicious atmosphere, kawaii cartoon noir aesthetic**. The MEETING TABLE is the BRIGHTEST spot (focal point where 2 characters will sit).
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 4 — GIẢNG ĐƯỜNG ĐẠI HỌC (GIỜ TRẢ BÀI THI)

### 📄 `c4_bg_lecture_hall_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí nhận bài thi rớt môn chuyên ngành từ Giảng viên (Scene 5.4)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Scene 5.4 (Life Event): Rớt môn chuyên ngành. Giảng đường ĐH lớn kiểu cũ Bắc Việt Nam (kiến trúc thập niên 80-90, nhưng vẫn được giữ gìn sạch đẹp — không phải giảng đường bỏ hoang rách nát). Ghế gỗ xếp tầng dốc, bảng xanh lớn, quạt trần, hàng cửa sổ kính rộng ven tường. Trời chiều muộn, ánh sáng vàng-cam dịu từ cửa sổ chiếu xiên vào các dãy bàn. Sau giờ thi, giảng viên gọi từng sinh viên lên nhận bài. Tí là 1 trong những người bị rớt.

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (BG kawaii cartoon environment — GRAND OLD VIETNAMESE UNIVERSITY LECTURE HALL INTERIOR, Studio Ghibli nostalgic-grandeur aesthetic, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**:
> **⭐⭐⭐ CRITICAL LAYOUT — READ THIS FIRST ⭐⭐⭐**: The lecture hall follows the **STANDARD VIETNAMESE UNIVERSITY AUDITORIUM LAYOUT** — a LONG RECTANGULAR ROOM where the **STAGE + LECTERN + CHALKBOARD are ALL at ONE SHORT END of the room** (let's call it the "FRONT"), and **ALL STUDENT SEATS FACE toward that front**. The room is NOT a square with stage in the middle. The stage is at ONE WALL, not floating in the center.
>
> **Conceptual floor plan (BIRD'S EYE VIEW, camera = the "VIEWER" arrow at the top)**:
> ```
>            ┌─────────────────────────────────────────────┐
>            │           BACK WALL (ceiling high)         │
>            └─────────────────────────────────────────────┘
>                          ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
>                          │ │ │ │ │ │ │ │ │   ← student seating rises upward
>                          │ tiered wooden seats (3 sections)
>                          │ facing the FRONT (downward in this map)
>                          │ │ │ │ │ │ │ │ │
>                          ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
>            ┌─────────────────────────────────────────────┐
>            │  STAGE (raised 60cm, 2 wooden steps front)  │
>            │           [LECTERN at center of stage]       │
>            │  ┌────────────────────────────────────┐     │
>            │  │   GREEN CHALKBOARD on front wall   │     │
>            │  │   (mounted on the wall BEHIND     │     │
>            │  │   the stage, directly behind       │     │
>            │  │   the lectern, ~5m wide)           │     │
>            │  └────────────────────────────────────┘     │
>            └─────────────────────────────────────────────┘
>                          ← FRONT WALL →
>                              [VIEWER CAMERA = back-middle of hall, low eye-level ~1.5m]
> ```
>
> **THE CAMERA = placed in the BACK-CENTER of the hall at STUDENT EYE-LEVEL (~1.5m height, sitting on the back-row seat perspective)**. The camera looks STRAIGHT FORWARD toward the FRONT WALL. The student seats fill the space BETWEEN the camera and the stage in a forward direction. The stage + lectern + chalkboard are all stacked at the FAR END (the front of the frame).
>
> **WHAT THE IMAGE LOOKS LIKE (left-to-right, top-to-bottom)**:
> - **TOP edge of frame** = the high ceiling with fans + pendant lamps (above)
> - **UPPER THIRD** = the BACK of the hall — the last few rows of tiered wooden desks (closest to the camera, biggest in frame), with the EXIT DOORS visible on the LEFT and RIGHT walls at the very back (NOT a doorway framing the image — just normal side doors set into the back wall, partly visible)
> - **MIDDLE of frame** = the MIDDLE of the seating area — many rows of tiered wooden desks on both sides of a CENTRAL AISLE going from camera to stage
> - **LOWER THIRD (the FRONT of the hall, FAR AWAY across the room)** = the **RAISED WOODEN STAGE** spanning the FULL WIDTH of the front (15-20m wide, 3-4m deep, raised 60cm above the floor). On the stage: **ONLY ONE LECTERN at CENTER** (the standard Vietnamese grand-auditorium setup — a single teacher podium, NOT multiple). **DIRECTLY BEHIND the lectern**, mounted on the FRONT WALL of the hall, is a **LARGE GREEN CHALKBOARD spanning 4-5m wide**. The chalkboard is ATTACHED to the wall directly behind the lectern — student-facing the lectern, the chalkboard is RIGHT THERE as the backdrop of the lectern (typical classroom/lecture hall setup). The stage has **2 short wooden steps** at center-front going DOWN to the main floor.
>
> **LOWER THIRD — DETAILED BREAKDOWN (FRONT OF THE HALL, FAR ACROSS THE ROOM)**:
> - **The stage** (raised wooden platform, cao hơn sàn 60cm, viền gỗ chạm khắc giản đơn, mặt sàn gỗ bóng cũ) spanning the FULL WIDTH of the front, accessed by **2 short wooden steps** at center-front going down to the main floor.
> - **ONLY ONE lectern on the stage at CENTER** (the standard Vietnamese grand-auditorium setup — a single teacher podium, NOT multiple). The **grand wooden lectern** (chunky cartoon wooden podium, ~1.2m tall, with a stylized circular university emblem engraved on the front — generic NOT real school name, NO real logo, NO real text). On the lectern TOP: a **neat stack of exam papers** + a **small chalk holder with chalk sticks** + a **glass water pitcher with a few ceramic cups beside it** (the professor's water setup, kept on the lectern itself — the standard Vietnamese style) + a **small wooden gavel** (cái búa gõ nhẹ) + a **small Vietnamese desk flag on a tiny stand** (quốc kỳ để bàn — placed at the front-right corner of the lectern, a patriotic detail common in Vietnamese academic halls).
> - To the RIGHT of the lectern (still on the stage): a **simple wooden side chair** for the professor (empty, indicates the lecture has ended and the professor has left to pack up).
> - **DIRECTLY BEHIND the lectern, mounted on the FRONT WALL of the hall (the wall facing the camera)**: a **LARGE GREEN CHALKBOARD spanning 4-5m wide** (clean dark green, slightly dusty, well-used but not wrecked) — has **mathematical formulas** drawn in white chalk (generic stylized — equations, integrals, geometric shapes, NO real specific formulas, just chunky cartoon chalk lines suggesting "advanced math"). A few **small chalk drawings** in the corners (small kawaii doodles — a smiley, a small house — hint at a professor with personality). The chalkboard sits AT THE SAME WALL as the lectern backdrop — meaning in the image, the chalkboard APPEARS IN THE LOWER THIRD of the frame, immediately behind the lectern, NOT floating high above or far away.
> - To the LEFT of the chalkboard (on the same front wall): a **large wall-mounted analog clock** (chunky cartoon old school clock, white face with black Roman numerals, showing ~17:00 — 5 PM).
> - To the RIGHT of the chalkboard (on the same front wall): a **golden-framed honor board** (bảng vàng thành tích) with small generic "Khen Thưởng" placeholder text and tiny stylized student photos in uniform grid (NOT real photos, NOT real names — just abstract cartoon portrait silhouettes).
>
> **UPPER-MIDDLE of frame (the BACK of the hall, closest to the camera)**: **3 SECTIONS of curved tiered wooden desks** separated by 2 wide aisles (left section + center section + right section — like a grand amphitheater). Each section has **~12-15 rows** of tiered seating. The FRONT rows (closest to the stage, in the middle of the frame) are LOWER and SMALLER (perspective foreshortening — they appear smaller in the distance). The BACK rows (closest to the camera, at the top of the seating area in frame) are HIGHER and LARGER (the camera is sitting in the back, so back rows dominate the upper part of the frame). Each row rises ~25cm so back-row students can see over the front rows. The desks are **chunky cartoon old-school wooden** (light beige wood, with attached folding seats — fixed bench-seat design common in Vietnamese ĐH grand halls), **clean and well-maintained** (NO ink stains, NO carvings, NO scratches — just the dignified patina of decades of use). Small **wooden writing surfaces** in front of each seat. A few **loose exam papers** scattered on a couple of front-row desks (others have been collected), a **single forgotten pen** on one seat. The aisles have **light gray concrete steps** worn smooth from decades of foot traffic. **The 2 wide aisles form a CENTER AISLE running from the stage steps straight back toward the camera** — this is the visual symmetry axis of the frame.
>
> **LEFT WALL of frame (running the entire length, from foreground to background)**: a long row of **8-10 tall arched windows** (cửa sổ vòm cao kiểu Pháp, the classic Vietnamese colonial-era university architectural detail — wabi-sabi elegance), each window is **4-5m tall, ~1.5m wide**, divided into many small glass panes by **dark wooden mullions**, looking out to **lush green trees + red brick rooftops of older campus buildings + a late-afternoon warm golden sky** (late afternoon warm golden hour glow streaming through the windows in long diagonal beams — **THE PRIMARY LIGHT SOURCE**). A few **white sheer curtains** hang from the top of each window, drifting slightly in a soft breeze from an open window at the far end. Below each window: **clay planter boxes** with **small green plants** (cây xanh) and **small purple/pink flowers** — adds a soft Ghibli touch of life to the academic space. The windows are PERSPECTIVE-FORESHORTENED (front windows near the stage are smaller and far away in the background, back windows near the camera are larger and prominent in the foreground).
>
> **RIGHT WALL of frame**: mirror of the LEFT wall (another row of **8-10 tall arched windows** with the same late-afternoon golden light streaming in), plus 3-4 **large framed academic posters** mounted between windows (generic stylized — NO real text, just chunky cartoon illustration of physics/math/engineering concepts, like "Newton's Cradle" or "Pythagorean Theorem" diagrams — adds academic atmosphere).
>
> **CEILING (TOP of frame, soaring high above the entire hall)**: **HIGH vaulted ceiling** (~10-12m high — grand scale), painted in **soft cream-white** with subtle **exposed dark wooden beams** running across (chunky cartoon trusses, like an old European academic hall). Hanging from the ceiling: **6-8 industrial pendant lamps** with **dome-shaped metal shades** (đèn chụp kim loại kiểu công nghiệp — slightly retro, dark green or brass finish) — most are OFF, only 2-3 are ON with warm yellow light. Center of the ceiling: **3 large 4-blade wooden ceiling fans** (quạt trần cánh gỗ to), turning slowly. **NO spider webs, NO dust clumps** — just dignified old academic hall.
>
> **FLOOR (BOTTOM of frame, BETWEEN camera and stage)**: the **central aisle** with **polished dark wooden floor planks** with a subtle warm sheen (worn smooth from decades of student footsteps) leads straight back from the stage steps. The front few rows of wooden desks are visible on both sides of the central aisle (perspective-foreshortened — smaller as they recede toward the stage).
>
> **BACK WALL (TOP of frame, the wall behind the camera position)**: NOT prominently visible — just a hint of the wall with a single small EXIT sign (đèn EXIT) on the upper-left corner of the back wall and a closed wooden door on the upper-right (just a small detail showing the hall has a back entrance, NOT a doorway framing the camera view).
>
> NO people, NO characters, NO sprites, NO DOORWAY framing the camera, NO DOORFRAME BORDER.
>
> **Lighting**: **LATE-AFTERNOON WARM GOLDEN HOUR** as the PRIMARY light — long diagonal warm golden-orange beams streaming through both side wall windows (catches dust motes in the air creating a kawaii atmospheric detail — small floating sparkle dust particles), creating a soft amber glow across the wooden desks and stage. Secondary: **2-3 warm pendant lamp pools** from ceiling lights ON (small warm yellow circular pools). The hall is **bright, airy, dignified** — NOT gloomy, NOT dark, NOT creepy. The warmth of late afternoon + the academic grandeur creates a **bittersweet nostalgic feel** (warm light on a serious occasion — the day is ending, results are being given, students' futures are being decided). Soft **white sheer curtains diffusing** the light at the windows.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, **background image ONLY, no characters**.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 🎬 PHẦN B — SCENE COMPOSITE (CÓ NHÂN VẬT TRONG ẢNH)

> **SCENE = ảnh toàn cảnh 16:9 có sẵn nhân vật đang hành động**. Dùng cho `narrator` scene.
> React engine sẽ load ảnh BG composite (có nhân vật), KHÔNG ghép sprite thêm.

---

## 📍 SCENE 5.1 — CỬA HÀNG ĐIỆN TỬ: TÍ KÝ HỢP ĐỒNG TRẢ GÓP

### 📄 `c4_bg_electronics_store_signing.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí đứng trước quầy trong cửa hàng điện tử, NV Ngân hàng đang đẩy hợp đồng trả góp qua
**Nhân vật trong ảnh**: Tí + NV Ngân hàng (2 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Scene 5.1: Laptop cứu tinh. Tí đang đứng trước bàn tư vấn của NV Ngân hàng trong cửa hàng điện tử. NV đẩy hợp đồng trả góp "0% lãi suất 12 tháng" cho laptop 18tr. Tí do dự — tay với cây bút, tay kia lưỡng lự chạm ví.

**🔗 CROSS-REFERENCE (upload ảnh kèm prompt trong Gemini)**:
- **Tí**: upload `c3_ti_neutral.png` làm reference (Tí 19t gốc: tóc side part, áo thun xám, jeans xanh nhạt). GIỮ khuôn mặt + da + style, **ĐỔI** sang áo sơ mi TRẮNG + cà vạt + quần tây đen + giày tây + tóc slicked-back + height 172cm + **mắc định mắt SẠCH (clean eyes, KHÔNG có dark circles ở neutral — chỉ thêm NHẸ khi emotion anxious/defeated)**.
- **NV Ngân hàng**: KHÔNG có reference — gen đầu tiên từ prompt.

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (kawaii cartoon environment + 2 characters — MODERN VIETNAMESE ELECTRONICS STORE INSTALLMENT SIGNING SCENE, Studio Ghibli urban-temptation aesthetic)**:
> Same electronics retail store as `c4_bg_electronics_store_empty.png` (BG1), **rendered in kawaii cartoon style with TENSE TEMPTATION atmosphere**. The display shelves with laptops on left. The flagship 18-million-VND laptop on the rotating pedestal in the center-back. The glass storefront window in the far background showing urban daytime outside. The bright LED ceiling lights + bright daylight from window.
>
> **⭐ FOCAL POINT — TÍ AND NV NGÂN HÀNG AT THE SMALL COUNTER (CENTER OF FRAME, FACING EACH OTHER ACROSS THE TABLE)**:
>
> **Character 1 — Tí (RIGHT side of frame, FACING the counter)**: **a 22-year-old Vietnamese man (Tí, age-locked 22)**. Phải giống reference `c3_ti_neutral.png` (Tí 19t) nhưng **ĐỔI rõ rệt**: height **172cm (cao hơn 19t 4cm)**, mature slim build, **face LONGER + sharper jawline + clean healthy eyes (KHÔNG có dark circles ở SC này — scene tempted, không thức khuya)** hair NGẮN slicked-back nhẹ (gel tự nhiên), soft warm light beige skin, Vietnamese facial features, sạch (không mụn). Outfit (ĐỒ ĐI LÀM THỰC TẬP): **crisp WHITE button-up dress shirt** (hex #ffffff, collar), **thin DARK-BLUE tie** (hex #1a2b4a, slightly loosened), **slim-fit BLACK formal pants** (hex #1a1a1a), **polished BLACK leather derby shoes** (hex #1a1a1a), **OFFICE ID BADGE clipped to left chest**. POSE: standing slightly hunched forward over the counter, body at 3/4 angle, **his RIGHT HAND reaching forward hesitantly for the pen** the banker is offering, **his LEFT HAND hovering over his wallet** in his back pocket (visible from the side), sweat drop on his forehead. Expression: **TEMPTED ANXIOUS** — eyes wide looking at the pen, eyebrows slightly raised, small worried mouth, **3 small sweat drops** on his forehead + temples. Face proportions STAY NORMAL 22-year-old adult.
>
> **Character 2 — NV Ngân hàng (LEFT side of frame, behind the counter, FACING Tí)**: **a 30-year-old Vietnamese man (banker, age-locked 30)**, height 175cm, balanced average young-professional build, warm light-tan office-worker skin (hex #e8c8a8), short black hair neatly combed with light gel (kiểu tóc banker gọn gàng), friendly mature eyes (NORMAL-sized — NOT giant kawaii eyes), small natural eyebrows, oval face with soft jawline, clean-shaven. Outfit: **charcoal-blue slim-fit suit** (hex #2a3a4a), **white dress shirt** (hex #ffffff), **dark-red silk tie** (hex #8b1a1a), **polished black oxford shoes** (hex #1a1a1a), **generic stylized bank ID BADGE clipped to left chest**. POSE: leaning FORWARD across the counter in classic sales posture, **his RIGHT HAND sliding a generic stylized installment contract paper across to Tí** (paper has chunky cartoon "TRẢ GÓP 0%" placeholder text — NO real bank name), **his LEFT HAND holding a pen offering it to Tí** with a friendly professional smile. Expression: **FRIENDLY SALESY** — wide professional smile (mouth showing teeth in polished sales grin), eyebrows slightly raised, **1 small sparkle ✨** near his head.
>
> **Between them on the counter**: the contract paper, 2 pens, a small calculator, a coffee mug (Tí's nervous energy drink).
>
> **Background details**: visible through the glass storefront window — busy urban daytime outside. The flagship 18-million-VND laptop glowing softly on its pedestal in the background (the temptation focal point). A few **small Vietnamese flags** on the counter. NO DOORWAY, NO DOORFRAME BORDER.
>
> **Lighting**: bright cool LED ceiling lights + bright daylight from storefront window + small warm glow from the flagship laptop on pedestal — **clean modern showroom meeting-the-salesman atmosphere in kawaii cartoon style, slight temptation mood**.
>
> **Aspect ratio**: 16:9 cinematic widescreen. Both characters FULLY VISIBLE FROM HEAD TO TOE at the counter (~30% of frame width each), the flagship laptop pedestal visible in background, the contract paper on counter visible. NO CROPPING. NO DOORWAY BORDER, NO WINDOW FRAME BORDER.
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**:
> - **Tí**: MUST closely match reference `c3_ti_neutral.png` (face shape, eye style, skin tone pale white). Do NOT redesign face. Do NOT change hair to messy/wild. Do NOT add heavy dark circles (KHÔNG cần dark circles cho scene tempted — giữ mắt sạch). Do NOT wear different clothes (PHẢI mặc áo sơ mi TRẮNG + cà vạt + quần tây đen + giày tây + BADGE — KHÔNG mặc áo thun xám + jeans như 19t). **DO NOT MAKE TÍ INTO A 16-YEAR-OLD OR 13-YEAR-OLD KID** — face must look like a 22-year-old adult professional intern.
> - **NV Ngân hàng**: gen đầu tiên từ prompt, KHÔNG cần upload reference.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 5.2 — VĂN PHÒNG: TÍ NHẬN ĐIỆN THOẠI BNPL MỚI

### 📄 `c4_bg_office_bnpl_phone.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí ngồi tại bàn làm việc, vừa nhận flagship phone qua BNPL 10tr, đang cầm điện thoại mới ngắm nghía
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Scene 5.2: Buy Now Pay Later. Tí vừa được duyệt khoản vay BNPL 10 triệu để mua flagship phone. Tí ngồi tại bàn làm việc ở công ty, giờ nghỉ trưa, cầm điện thoại mới trên tay, mắt sáng rỡ — KHÔNG nhận ra mình vừa rơi vào bẫy nợ.

**🔗 CROSS-REFERENCE**:
- **Tí**: upload `c3_ti_neutral.png` làm reference (Tí 19t gốc). ĐỔI sang đồ 22t + đang cầm flagship phone.

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (kawaii cartoon environment + 1 character — TÍ AT HIS OFFICE DESK HOLDING A NEW FLAGSHIP PHONE, Studio Ghibli consumer-temptation aesthetic)**:
> Same IT office cubicle as `c4_bg_office_cubicle_empty.png` (BG2), **rendered in kawaii cartoon style with AFTERNOON WORKPLACE DECADENCE atmosphere**. The dual monitors on the desk (still showing fake code editor and Slack UI). The coffee mug. The small desk plant. The over-ear headphones resting on desk. Through the frosted glass partition — soft silhouettes of colleagues. Through the back glass walls — bright urban afternoon outside.
>
> **⭐ FOCAL POINT — TÍ SITTING IN HIS OFFICE CHAIR, HOLDING A NEW FLAGSHIP PHONE**:
> **a 22-year-old Vietnamese man (Tí, age-locked 22)** — MUST closely match `c3_ti_neutral.png` (Tí 19t: face shape, eye style, skin tone pale white). Height **172cm**, mature slim build, face LONGER + sharper jawline + **clean excited eyes (KHÔNG có dark circles ở scene BNPL — chỉ focus vào cảm giác phấn khích deceptive-thrill)** Hair NGẮN slicked-back nhẹ (gel tự nhiên). Outfit (ĐỒ ĐI LÀM THỰC TẬP — slightly loosened after lunch): **crisp WHITE button-up dress shirt** (hex #ffffff, collar unbuttoned ONE button at the top — after-lunch informality), **thin DARK-BLUE tie** (hex #1a2b4a, pulled down more loosely than morning), **slim-fit BLACK formal pants** (hex #1a1a1a), **OFFICE ID BADGE clipped to left chest** (slightly crooked now). POSE: **slouched comfortably in the ergonomic office chair** (chair visible), body at 3/4 angle facing viewer, **BOTH HANDS holding a brand-new flagship smartphone** (chunky cartoon modern smartphone with edge-to-edge screen, generic stylized — NO real brand name, NO real Apple/Samsung logo, just a generic black rectangle with a small camera bump) in front of his chest at eye level, **the phone screen glowing brightly** showing a fake "BNPL — KHOẢN VAY 10.000.000 VND ĐÃ DUYỆT" green notification (generic stylized text). Expression: **DECEPTIVELY THRILLED** — eyes sparkling with excitement (small glint, NOT bug-eyed, NOT kawaii ✨ — just a small gleam), wide smile showing teeth (genuine joy, not predatory), eyebrows raised, **2 small kawaii money symbols** floating near his head (small ✨$ sparkles, generic cartoon money symbols — NOT real money). **NO blush circles**. Face proportions STAY NORMAL.
>
> **Around Tí on the desk**: the new flagship phone box (chunky cartoon box, generic stylized, NO real brand) is open on the desk with styrofoam visible. A few **crumpled BNPL contract papers** nearby (a subtle visual hint — this isn't free). The old chunky laptop on the desk is now closed (Tí đang ngắm điện thoại, không làm việc).
>
> **Background details**: through the frosted glass partition — soft silhouettes of 1-2 colleagues working. Through the back glass walls — bright urban afternoon. A few **small notification popups** floating near the phone in the foreground (subtle hint of incoming debt reminders). NO DOORWAY, NO DOORFRAME BORDER.
>
> **Lighting**: cool modern LED ceiling lights + soft afternoon daylight through glass walls + **WARM GLOW from the new phone screen** (warm white glow spilling onto Tí's face and hands — this is the focal light source) + small warm accent from coffee mug — **clean modern office but with the warm hypnotic glow of a new toy, deceptive-thrill atmosphere in kawaii cartoon style**.
>
> **Aspect ratio**: 16:9 cinematic widescreen. Tí sits in chair in CENTER (~40% of frame width, ~55-70% of frame height), phone held up in front of him glowing, full office BG visible (monitors, desk, frosted glass partition, glass walls). NO CROPPING. NO DOORWAY BORDER, NO WINDOW FRAME BORDER.
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match reference `c3_ti_neutral.png` (face shape, eye style, hair color, skin tone pale white). Do NOT redesign face. Do NOT change hair to messy/wild. Do NOT add heavy dark circles (scene này là BNPL — phấn khích, KHÔNG có thâm mắt). Do NOT wear different clothes (PHẢI mặc áo sơ mi TRẮNG + cà vạt + quần tây đen + BADGE — KHÔNG mặc áo thun xám như 19t). **DO NOT MAKE TÍ INTO A 16-YEAR-OLD OR 13-YEAR-OLD KID** — face must look like a 22-year-old adult professional intern.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 5.3 — QUÁN CAFE ĐÊM: TÍ GẶP SCAMMER

### 📄 `c4_bg_cafe_scammer_meeting.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí ngồi đối diện Scammer tại bàn tròn trong quán cafe đêm, scammer đang chìa điện thoại giới thiệu cơ hội đầu tư "30%/tháng"
**Nhân vật trong ảnh**: Tí + Scammer (2 người)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Scene 5.3: Cạm bẫy "Làm giàu không khó". Tối thứ 7, Tí ngồi đối diện "Minh" — bạn cũ ĐH — trong quán cafe đêm vắng. Scammer đang chìa điện thoại bóng loáng, giới thiệu cơ hội đầu tư "30%/tháng chắc chắn 100%". Tí vừa nghi ngờ vừa bị cám dỗ (đang cần tiền trả góp + áp lực đồ án).

**🔗 CROSS-REFERENCE**:
- **Tí**: upload `c3_ti_neutral.png` (Tí 19t gốc). ĐỔI sang đồ 22t.
- **Scammer**: KHÔNG có reference — gen đầu tiên từ prompt.

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (kawaii cartoon environment + 2 characters — MOODY NIGHTTIME VIETNAMESE CAFÉ SCAMMER MEETING, Studio Ghibli noir-suspense aesthetic)**:
> Same moody nighttime café as `c4_bg_cafe_night_empty.png` (BG3), **rendered in kawaii cartoon style with TENSE NOIR SUSPICION atmosphere**. The exposed red brick wall on the left. The single hanging Edison bulb (warm amber pool). The dark wood meeting table in CENTER. The rain-streaked large window on the right showing busy urban night street with neon signs + motorbikes + wet asphalt. The dark wooden ceiling beams with hanging Edison bulbs. The dark polished concrete floor.
>
> **⭐ FOCAL POINT — TÍ AND SCAMMER AT THE SMALL ROUND TABLE (CENTER OF FRAME, FACING EACH OTHER)**:
>
> **Character 1 — Scammer (LEFT side of frame, FACING Tí)**: **a 24-year-old Vietnamese man (scammer — former classmate of Tí, age-locked 24)**, height **178cm**, slim lean build (slightly thin, bóng bẩy bên ngoài), warm light urban skin (hex #e8c8a8), **slicked-back SHINY black hair** with heavy gel, **thin GOLD CHAIN visible at collar** (small subtle gold necklace peeking out), **slightly narrow sharp eyes** with a hint of cunning (NORMAL-sized — NOT giant kawaii eyes), thin sharp eyebrows, oval face with sharper jawline, light 1-day stubble. Outfit: **shiny BLACK expensive slim-fit suit** (hex #1a1a1a), **black dress shirt** (hex #1a1a1a, NO tie, top button unbuttoned showing the gold chain), **polished black shoes** (hex #1a1a1a). POSE: **leaning ACROSS the table toward Tí**, body at 3/4 angle, **his RIGHT HAND pointing at his open smartphone** lying on the table showing a glowing red "INVESTMENT OPPORTUNITY — 30% monthly return GUARANTEED" notification (generic stylized — NO real text, just chunky cartoon red text), **his LEFT HAND holding his coffee cup** casually. Expression: **PREDATORY CONVINCING** — **1-sided smirk** (ONLY the LEFT corner of the mouth pulled up, NOT both corners), **one eyebrow raised**, eyes looking DIRECTLY at Tí with calculated intent, chin tilted slightly UP. **1 small sparkle ✨** near his gold chain (his "bling" is the bait), **NO blush circles**. Face proportions STAY NORMAL — do NOT bug-eye out.
>
> **Character 2 — Tí (RIGHT side of frame, FACING Scammer)**: **a 22-year-old Vietnamese man (Tí, age-locked 22)**. Phải giống reference `c3_ti_neutral.png` (Tí 19t) nhưng **ĐỔI rõ rệt**: height **172cm**, mature slim build, face LONGER + sharper jawline + **clean eyes (scene scammer — KHÔNG thêm dark circles, chỉ focus vào suspicious-but-tempted vibe)**, hair NGẮN slicked-back nhẹ, soft warm light beige skin, Vietnamese facial features, sạch. Outfit (ĐỒ ĐI LÀM THỰC TẬP — vẫn mặc đồ đi làm vì ra cafe sau giờ làm): **crisp WHITE button-up dress shirt** (hex #ffffff, collar, hơi nhăn vì cả ngày), **thin DARK-BLUE tie** (hex #1a2b4a, loosened), **slim-fit BLACK formal pants** (hex #1a1a1a), **polished BLACK leather derby shoes** (hex #1a1a1a), **OFFICE ID BADGE clipped to left chest**. POSE: **leaning BACK slightly defensive** in his chair, body at 3/4 angle facing scammer, **his LEFT HAND gripping his own wallet** on his lap UNDER the table (visible from the side angle), **his RIGHT HAND holding his own coffee cup** raised mid-sip (his only defense — act casual). Expression: **SUSPICIOUS BUT TEMPTED** — eyes slightly narrowed at the scammer (suspicious), one eyebrow slightly raised, small worried mouth (NOT scared, NOT convinced — just calculating risk), **3 small sweat drops** on his forehead + temples (the temptation working on him), **2 small $$$ sparkle symbols** floating near his head (his greed is being activated). **NO blush circles**. Face proportions STAY NORMAL.
>
> **Between them on the table**: 2 empty/half-empty coffee cups, the scammer's open smartphone (showing the red notification), a small crumpled napkin, no real money on the table (the negotiation hasn't closed yet).
>
> **Background details**: through the rain-streaked window on the right — busy urban night with neon signs glowing + motorbikes passing + wet asphalt reflecting neon. The Edison bulbs casting warm pools. The rest of the café is empty (other tables visible but unoccupied). NO DOORWAY, NO DOORFRAME BORDER.
>
> **Lighting**: **MOODY NOIR** — 2-3 warm Edison bulbs (small warm amber pools on the meeting table = BRIGHTEST spots) + **cool blue neon spillover** from rainy window (subtle cool blue tint on right side) + **dramatic shadows on faces** (warm/cool chiaroscuro on both characters). The MEETING TABLE is the BRIGHTEST focal point. Tense suspicious atmosphere.
>
> **Aspect ratio**: 16:9 cinematic widescreen. Both characters FULLY VISIBLE FROM HEAD TO TOE at the table (~30% of frame width each), rain-streaked window visible in background. NO CROPPING. NO DOORWAY BORDER, NO WINDOW FRAME BORDER.
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**:
> - **Tí**: MUST closely match `c3_ti_neutral.png`. Do NOT redesign face. Do NOT change hair. Do NOT add dark circles (scene scammer — mắt sạch, chỉ focus vào suspicious-but-tempted vibe). Do NOT wear different clothes (PHẢI mặc áo sơ mi TRẮNG + cà vạt + quần tây đen + BADGE — KHÔNG mặc áo thun xám + jeans như 19t). **DO NOT MAKE TÍ INTO A 16-YEAR-OLD** — face must look like 22-year-old adult.
> - **Scammer**: gen đầu tiên từ prompt.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 5.4 — GIẢNG ĐƯỜNG: TÍ NHẬN BÀI THI RỚT MÔN

### 📄 `c4_bg_lecture_hall_failed_exam.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí ngồi tại giảng đường, cầm bài thi có stamp "FAILED" + dòng "PHÍ HỌC LẠI: 1.800.000 VND", mặt cúi buồn. Giảng viên đứng phía trước đã trả bài xong, các sinh viên khác đang ra về vui vẻ
**Nhân vật trong ảnh**: Tí (chính) + 1-2 sinh viên khác (background silhouette nhỏ) + Giảng viên (ở xa)
**Aspect**: 16:9

**📍 BỐI CẢNH CỐT TRUYỆN**: Chương 4 — Scene 5.4 (Life Event): Rớt môn chuyên ngành. Sau giờ trả bài chiều muộn, Tí ngồi lại 1 mình trong giảng đường lớn vắng, nhìn bài thi có dấu "FAILED" đỏ và dòng viết tay "Phí học lại: 1,800,000 VND". Bạn bè xung quanh đã ra về ăn mừng / chụp ảnh. Giảng viên đã thu dọn bài về. Tí cô đơn giữa giảng đường vắng — ánh chiều vàng ấm xuyên qua cửa sổ vòm tạo nên contrast đẹp mà buồn: BG đẹp nhưng Tí đang defeat.

**🔗 CROSS-REFERENCE**:
- **Tí**: upload `c3_ti_neutral.png` (Tí 19t gốc). ĐỔI sang đồ 22t + thêm biểu cảm defeated.
- **Giảng viên + bạn học**: KHÔNG có reference — gen đầu tiên từ prompt.

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> **Setting (kawaii cartoon environment + 1 main character + tiny background figures — GRAND OLD VIETNAMESE UNIVERSITY LECTURE HALL IN LATE-AFTERNOON GOLDEN HOUR AFTER FAILED EXAM, Studio Ghibli bittersweet-grandeur-melancholy aesthetic)**:
> Same grand old Vietnamese ĐH lecture hall as `c4_bg_lecture_hall_empty.png` (BG4), **rendered in kawaii cartoon style with WARM GOLDEN LATE-AFTERNOON + BITTERSWEET MELANCHOLY atmosphere** (the BG itself is grand and beautiful — warm golden beams, soft curtains, plants, wooden furniture — but Tí's sadness contrasts with the beauty, creating emotional depth). The layout is **STANDARD VIETNAMESE LECTURE HALL** — stage + lectern + chalkboard all clustered at the FAR FRONT (LOWER THIRD of frame), with the camera positioned in the BACK-MIDDLE of the hall looking forward toward the front. The grand vaulted ceiling with hanging industrial pendant lamps. The 3 large 4-blade wooden ceiling fans slowly rotating. The 8-10 tall arched windows on both LEFT and RIGHT side walls streaming warm late-afternoon golden-orange light in long diagonal beams across the desks (catches dust motes in the air). The white sheer curtains drifting softly. The clay planter boxes with small green plants + small purple/pink flowers below the windows. The 3 sections of curved tiered wooden desks (12-15 rows each, with the central aisle running straight from the stage back toward the camera). The raised wooden stage at the FAR FRONT with ONLY ONE grand wooden lectern (with university emblem, water pitcher, cups, gavel, Vietnamese desk flag) + a simple empty wooden side chair on stage (professor has left). The 2 short wooden steps at center-front leading up to the stage. The LARGE GREEN CHALKBOARD mounted on the FRONT WALL directly behind the lectern (4-5m wide, with white chalk mathematical formulas + a few small kawaii doodles in the corners — smiley + small house — professor with personality). The wall-mounted analog clock showing ~17:00 (5 PM — late afternoon) to the LEFT of the chalkboard. The golden-framed honor board to the RIGHT of the chalkboard. The polished dark wooden floor of the central aisle.
>
> **⭐ FOCAL POINT — TÍ SITTING ALONE IN THE MIDDLE SECTION, MIDDLE TIER (center-left of frame, ~5-6 rows from the front, so he's positioned in the middle-distance between camera and stage)**:
> **a 22-year-old Vietnamese man (Tí, age-locked 22)**. Phải giống reference `c3_ti_neutral.png` nhưng **ĐỔI rõ rệt**: height **172cm**, mature slim build, face LONGER + sharper jawline + **dark circles NHẸ vừa phải (scene FAILED — nhưng vẫn NHẸ, không quầng thâm đậm, chỉ hơi nhợt nhạt)** (THÊM nhẹ so với neutral), hair NGẮN slicked-back nhẹ (slightly disheveled from shock), soft warm light beige skin (slightly paler now from stress), Vietnamese facial features, sạch. Outfit (ĐỒ ĐI LÀM THỰC TẬP — hơi nhàu sau cả ngày): **crisp WHITE button-up dress shirt** (hex #ffffff, slightly wrinkled at sleeves and collar from the long day), **thin DARK-BLUE tie** (hex #1a2b4a, pulled down even more loosely), **slim-fit BLACK formal pants** (hex #1a1a1a), **polished BLACK leather derby shoes** (hex #1a1a1a), **OFFICE ID BADGE clipped to left chest** (slightly crooked now). POSE: **slumped in a wooden desk** in the middle tier of the middle section (sitting on the left side of the central aisle — so the camera sees him slightly from the side), body facing slightly toward the viewer (3/4 angle), **BOTH HANDS holding a single exam paper** in front of him at chest level — the paper has a big red rectangular stamp reading "FAILED" (generic stylized stamp — chunky cartoon red rectangle with bold "FAILED" in English placeholder, NO real Vietnamese text) and a small handwritten line below "PHÍ HỌC LẠI: 1.800.000 VND" (generic stylized — chunky cartoon red handwriting placeholder, NO real Vietnamese text). His head is **bowed slightly down**, eyes looking DOWN at the paper in his hands (NOT at viewer), eyebrows drawn together in sad pinch. Expression: **DEFEATED HOLLOW QUIET GRIEF** — eyes downcast looking at the FAILED paper, eyelids lowered, small downturned frown, **1 single small cartoon tear drop** in corner of left eye (1 tiny tear, NOT crying, NOT multiple), **3 small sweat drops** on forehead + temples, **NO blush circles**. Face proportions STAY NORMAL — do NOT enlarge head, do NOT stretch face, do NOT bug-eye out.
>
> **Around Tí**: a few **crumpled exam papers** on his desk (others that were passed back, not his), his **school bag** (small black laptop backpack) slumped on the desk beside him. His **chair** is slightly pushed back (he slumped down).
>
> **In the FAR BACKGROUND (LOWER THIRD of frame, on the stage, small silhouettes ~25-30% of Tí's height)**:
> - **1 small PROFESSOR FIGURE** (the Giảng viên) standing NEAR the lectern on the stage at the FAR FRONT, packing up the remaining papers into a folder, walking toward the stage steps. Generic academic silhouette.
>
> **In the FAR BACKGROUND (UPPER-MIDDLE of frame, behind Tí, near the back wall, small silhouettes ~20-25% of Tí's height)**:
> - **2-3 OTHER STUDENTS** (small kawaii silhouettes) walking OUT of the lecture hall through the back exit (the back doors on the back wall), chatting and laughing, holding their PASSED exam papers, completely oblivious to Tí's defeat. They wear casual clothes (NOT detailed — just kawaii silhouettes). They are walking AWAY from the camera toward the back wall doors.
>
> **Background atmosphere**: the lecture hall is now MOSTLY EMPTY — most students have left after getting their results. The grand hall is **BRIGHT + AIRY + WARM** with the late-afternoon golden light — but Tí is visually ISOLATED alone in the vast space (the warm beautiful BG contrasts with his defeat). The **white sheer curtains** at the windows drift softly in a gentle breeze from the open far window. The **clay planter boxes** with green plants + small purple/pink flowers catch the golden light beautifully. **Dust motes sparkle in the warm diagonal light beams** (kawaii atmospheric detail — golden dust particles floating in the air). The wall clock reads ~17:00. The chalkboard still has the professor's last formulas + doodles. NO DOORWAY, NO DOORFRAME BORDER.
>
> **Lighting**: **LATE-AFTERNOON WARM GOLDEN HOUR** as the PRIMARY light — long diagonal warm golden-orange beams streaming through both side wall arched windows (THE BRIGHTEST light source, catches dust motes in the air creating a kawaii atmospheric detail — small floating golden sparkle dust particles), creating a soft amber pool around Tí and the surrounding desks. Secondary: **2-3 warm pendant lamp pools** from the ceiling industrial lamps ON (small warm yellow circular pools). Soft **white sheer curtains diffusing** the light at the windows. The atmosphere is **bittersweet — a beautiful warm grand hall at golden hour, but Tí sits alone with his failure** (the warm beautiful BG intensifies the loneliness and the emotional weight of the moment). The golden light hits Tí from the SIDE (3/4 side-lit by golden beams) — his face is half in warm golden light + half in soft shadow (Ghibli-style chiaroscuro). NO DOORWAY, NO DOORFRAME BORDER.
>
> **Aspect ratio**: 16:9 cinematic widescreen. **Tí sits in the MIDDLE SECTION OF THE HALL (NOT in front of the lectern, NOT floating in the middle — he's seated in a row of wooden desks about halfway between camera and stage)**, occupying CENTER of frame (~40% of frame width, ~55-70% of frame height). Behind Tí (toward the top of frame, smaller in distance): a few rows of empty tiered wooden desks leading up to the back wall. In FRONT of Tí (toward the bottom of frame, smaller in distance): more rows of empty tiered wooden desks leading down to the stage. **In the FAR FRONT (LOWER THIRD, very small in the distance)**: the stage + lectern + chalkboard + professor silhouette. **In the FAR BACK (UPPER-MIDDLE, very small in the distance)**: a few students walking out through the back doors. NO CROPPING. NO DOORWAY BORDER, NO WINDOW FRAME BORDER.
>
> **⭐ CRITICAL CHARACTER IDENTITY RULE**: Tí MUST closely match `c3_ti_neutral.png`. Do NOT redesign face. Do NOT change hair. Do NOT make dark circles TOO DARK (scene failed — NHẸ vừa phải, không quầng thâm đậm, chỉ hơi nhợt nhạt). Do NOT wear different clothes (PHẢI mặc áo sơ mi TRẮNG + cà vạt + quần tây đen + BADGE — KHÔNG mặc áo thun xám + jeans như 19t). **DO NOT MAKE TÍ INTO A 16-YEAR-OLD** — face must look like 22-year-old adult intern.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 BẢNG TỔNG HỢP

## Tất cả BG (không nhân vật) — 4 file

| # | Filename | Địa điểm | Thời gian | Loại scene VN | Dùng cho cốt truyện | Aspect |
|---|---|---|---|---|---|---|
| BG1 | `c4_bg_electronics_store_empty.png` | Cửa hàng điện tử (showroom laptop) | Ban ngày | `dialogue` | Scene 5.1 (ký trả góp laptop 18tr) | 16:9 |
| BG2 | `c4_bg_office_cubicle_empty.png` | Văn phòng IT (bàn làm việc Tí) | Ban ngày | `dialogue` | Scene 5.2 (BNPL điện thoại 10tr) | 16:9 |
| BG3 | `c4_bg_cafe_night_empty.png` | Quán cafe đêm | Tối + mưa | `dialogue` | Scene 5.3 (scammer "30%/tháng") | 16:9 |
| BG4 | `c4_bg_lecture_hall_empty.png` | Giảng đường ĐH cũ | Âm u, sau giờ thi | `dialogue` | Scene 5.4 (rớt môn, 1.8tr học lại) | 16:9 |

## Tất cả SCENE (có nhân vật) — 4 file

| # | Filename | Địa điểm | Nhân vật | Loại scene VN | Dùng cho cốt truyện | Aspect |
|---|---|---|---|---|---|---|
| SC1 | `c4_bg_electronics_store_signing.png` | Cửa hàng điện tử | Tí + NV Ngân hàng | `narrator` | Scene 5.1 (ký trả góp laptop) | 16:9 |
| SC2 | `c4_bg_office_bnpl_phone.png` | Văn phòng IT | Tí | `narrator` | Scene 5.2 (nhận điện thoại BNPL) | 16:9 |
| SC3 | `c4_bg_cafe_scammer_meeting.png` | Quán cafe đêm | Tí + Scammer | `narrator` | Scene 5.3 (gặp scammer đầu tư) | 16:9 |
| SC4 | `c4_bg_lecture_hall_failed_exam.png` | Giảng đường | Tí + 2-3 SV khác + GV | `narrator` | Scene 5.4 (nhận bài rớt) | 16:9 |

## Tổng: 8 prompts (4 BG + 4 SCENE)

---

# 🔑 QUY TẮC STYLE BẮT BUỘC

> **⚠️ MỌI prompt trong file này phải tuân theo quy tắc dưới đây — vi phạm sẽ ra ảnh sai art style.**

### Về STYLE TOKEN
- **BẮT BUỘC** dùng full earnest teen style token trong MỌI prompt (BG + SCENE)
- **BẮT BUỘC** thêm block **Anti-distortion CRITICAL + Framing rule** vào MỌI prompt (xem đầu file)
- **NOT** realistic, semi-realistic, cinematic-photorealistic, anime-background, 3D, Pixar
- **NOT** high-detail realistic skin, realistic textures, photographic backgrounds

### Về SETTING (mô tả environment)
- Environment phải được mô tả bằng **ngôn ngữ kawaii cartoon**: "simple chunky rectangles", "cute wavy green lines", "soft brown texture dots"
- **KHÔNG** dùng ngôn ngữ realistic: "photorealistic brick wall", "weathered texture", "depth of field", "bokeh", "cinematic lighting ratio"

### Về NHÂN VẬT trong SCENE
- Mỗi prompt SCENE đã **TỰ CHỨA ĐẦY ĐỦ** character reference — copy là chạy, không cần tra cứu
- **Tí 22t**: dùng character reference từ `c3_ti_neutral.png` (Tí 19t) — **height 172cm (cao hơn 19t 4cm) + face LONGER + sharper jawline + clean eyes by default (KHÔNG dark circles ở neutral — chỉ thêm NHẸ khi anxious/defeated) + tóc NGẮN slicked-back nhẹ (ĐỔI từ side part 19t) + áo sơ mi TRẮNG + cà vạt XANH ĐẬM + quần tây ĐEN + giày tây ĐEN + BADGE công ty cài ngực trái** — KHÔNG dùng reference từ `image-generation-bible.md` mục 1.4 (style kawaii 1:2.5 cũ)
- **NV Ngân hàng 30t**: nhân vật MỚI — 175cm, balanced build, light-tan office skin, charcoal-blue suit + white shirt + dark-red tie + black oxford shoes + bank badge — KHÔNG có reference nào khác
- **Scammer 24t**: nhân vật MỚI — 178cm, slim lean build, light urban skin, slicked-back shiny hair, gold chain, shiny black suit + black shirt (no tie) — KHÔNG có reference nào khác
- **Giảng viên 50t**: nhân vật MỚI — 158cm, slim mature build, light pale skin, low black bun + silver strands, thin metal-frame glasses, elegant pale-blue blouse + dark skirt + flat shoes — KHÔNG có reference nào khác
- **Face proportions** phải giống portrait sprite — do NOT enlarge head, do NOT stretch face trong SCENE
- **Body** dùng head-to-body 1:4-1:5 earnest teen proportions cho tất cả nhân vật — not realistic figure proportions

### Về ASPECT RATIO
- Tất cả **BG**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE
- Tất cả **SCENE**: 16:9 cinematic widescreen
- **KHÔNG BAO GIỜ** dùng 3:4 cho BG hoặc SCENE (chỉ dùng 3:4 cho portrait sprite)

### Về CHARACTER IDENTITY
- **Tí 22t** phải GIỐNG HỆT `c3_ti_neutral.png` (Tí 19t) về:
  - Khuôn mặt: oval, mặt dài thanh, mũi hơi flat, mắt monolid cute-style
  - Da: pale white (hex #f0e0d0)
  - Kiểu tóc gốc: NGẮN gọn (giờ đổi sang slicked-back 22t)
  - KHÔNG mụn, KHÔNG tàn nhang, KHÔNG nốt ruồi
- **3 nhân vật mới** (NVNH, Scammer, GV): gen đầu tiên từ prompt, sau đó upload ảnh đã gen làm reference cho emotion sau

### Về CROSS-REFERENCE
- Khi gen SCENE có Tí, **LUÔN upload** `c3_ti_neutral.png` (Tí 19t gốc) làm reference
- Khi gen SCENE có NV Ngân hàng / Scammer / Giảng viên, upload ảnh emotion NEUTRAL đã gen ở chương `chuong-4-characters.md` (nếu đã gen)

---

# 📌 CHECKLIST GIAO ĐỒNG ĐỘI — CHƯƠNG 4

### Phase 1 — Gen 4 BG TRỐNG (cho dialogue + narrator tĩnh)
- [ ] **Dùng STYLE TOKEN: BG TRỐNG earnest teen** (16:9, NO people, NO characters)
- [ ] Gen các file:
  - [ ] `c4_bg_electronics_store_empty.png` (cửa hàng điện tử trống)
  - [ ] `c4_bg_office_cubicle_empty.png` (văn phòng IT trống)
  - [ ] `c4_bg_cafe_night_empty.png` (quán cafe đêm trống)
  - [ ] `c4_bg_lecture_hall_empty.png` (giảng đường cũ trống)
- [ ] BG này KHÔNG xóa nền, lưu PNG đầy đủ 16:9 FULL-BLEED

### Phase 2 — Gen 4 BG COMPOSITE (cho narrator cinematic có nhân vật)
- [ ] **Dùng STYLE TOKEN: BG COMPOSITE earnest teen** (16:9, có nhân vật trong ảnh đang hành động)
- [ ] Gen các file:
  - [ ] `c4_bg_electronics_store_signing.png` (Tí + NV Ngân hàng tại quầy)
  - [ ] `c4_bg_office_bnpl_phone.png` (Tí ngồi bàn cầm flagship phone BNPL)
  - [ ] `c4_bg_cafe_scammer_meeting.png` (Tí + Scammer tại bàn cafe đêm)
  - [ ] `c4_bg_lecture_hall_failed_exam.png` (Tí ngồi 1 mình trong giảng đường với bài FAILED)
- [ ] **LƯU Ý**: Khi gen Tí trong SCENE, dùng **character reference 19t** (`c3_ti_neutral.png` — Tí 19t gốc) — rồi **ĐỔI** sang áo sơ mi TRẮNG + cà vạt + quần tây + giày tây + tóc slicked-back + height 172cm + **mặc định mắt SẠCH (clean eyes, KHÔNG có dark circles — chỉ thêm NHẸ khi emotion anxious/defeated)**
- [ ] **LƯU Ý**: Khi gen NV Ngân hàng trong SCENE 5.1, dùng **character reference mới** (`c4_nvnganhang_neutral.png` từ file `chuong-4-characters.md`) — KHÔNG có từ chương trước
- [ ] **LƯU Ý**: Khi gen Scammer trong SCENE 5.3, dùng **character reference mới** (`c4_scammer_predatory.png` hoặc `convincing.png`) — KHÔNG có từ chương trước
- [ ] **LƯU Ý**: Khi gen Giảng viên + sinh viên trong SCENE 5.4, dùng **character reference mới** (`c4_giangvien_*.png`) — KHÔNG có từ chương trước
- [ ] **LƯU Ý**: Style cho 22t phải dùng **earnest teen proportions** (head-to-body 1:4-1:5, medium eyes, NO blush circles, natural skin shading) — KHÔNG dùng kawaii 1:2.5 cho SCENE (vì reference đã được thiết kế theo earnest teen)

### Phase 3 — Post-process PNG (Character Portraits + BG)
- [ ] Up **14 portrait** (5 Tí + 3 NVNH + 3 Scammer + 3 GV) lên `remove.bg` → xuất PNG nền trong suốt
- [ ] Tên file giữ nguyên `c4_[character]_[emotion].png`
- [ ] Verify từng file: mở bằng trình xem ảnh → nền phải là caro trắng-đen (trong suốt)
- [ ] **KHÔNG** xóa nền các BG (8 file: 4 trống + 4 composite) → chúng cần giữ nguyên

### Phase 4 — Lưu trữ theo cấu trúc React
Lưu ảnh vào folder `d:\DO-AN\SEQ\public\assets\chapter-4\` (đường dẫn đúng cho Vite):
```
d:\DO-AN\SEQ\public\assets\chapter-4\
portraits\                  ← (PNG trong suốt, đã remove.bg — dùng cho dialogue)
  ├── c4_ti_neutral.png
  ├── c4_ti_tempted.png
  ├── c4_ti_anxious.png
  ├── c4_ti_defeated.png
  ├── c4_ti_hopeful.png
  ├── c4_nvnganhang_neutral.png
  ├── c4_nvnganhang_friendly_sales.png
  ├── c4_nvnganhang_pressuring.png
  ├── c4_scammer_neutral.png
  ├── c4_scammer_predatory.png
  ├── c4_scammer_convincing.png
  ├── c4_giangvien_neutral.png
  ├── c4_giangvien_strict.png
  └── c4_giangvien_kind.png

bg\                         ← (PNG đầy đủ nền, KHÔNG xóa nền)
  ├── c4_bg_electronics_store_empty.png
  ├── c4_bg_office_cubicle_empty.png
  ├── c4_bg_cafe_night_empty.png
  └── c4_bg_lecture_hall_empty.png

scenes\                     ← (BG composite có nhân vật, KHÔNG xóa nền — narrator dùng)
  ├── c4_bg_electronics_store_signing.png
  ├── c4_bg_office_bnpl_phone.png
  ├── c4_bg_cafe_scammer_meeting.png
  └── c4_bg_lecture_hall_failed_exam.png
```

### Phase 5 — Mapping với React Component
Mapping BG_HAS_CHARACTER để React engine biết scene nào dùng sprite, scene nào dùng composite:

```javascript
// VisualNovelPlayer.jsx — thêm vào BG_HAS_CHARACTER list
const BG_HAS_CHARACTER = [
  // ... existing từ chapter 1-3
  // Chapter 4
  'c4_bg_electronics_store_signing',  // composite: Tí + NV Ngân hàng
  'c4_bg_office_bnpl_phone',          // composite: Tí ngồi bàn
  'c4_bg_cafe_scammer_meeting',      // composite: Tí + Scammer
  'c4_bg_lecture_hall_failed_exam',  // composite: Tí + SV khác
];
```

---

# 🚨 NẾU TOOL GEN VẪN RA SAI (MẸO KHẮC PHỤC)

> **Vấn đề thường gặp**: Gen ra ảnh giống style bible cũ (1:2.5 kawaii chibi) hoặc sai đồ đi làm.

### Cách khắc phục:
1. **Style sai về 1:2.5 kawaii** → Thêm câu "**THIS IS EARNEST TEEN STYLE, NOT CHIBI. Head must be SMALLER than body. Eyes must be SMALLER, not huge round kawaii.**" vào đầu prompt
2. **Tí mặc đồ 19t thay vì 22t** → Đảm bảo block "Outfit" trong prompt có đầy đủ: WHITE shirt + DARK-BLUE tie + BLACK pants + BLACK derby shoes + BADGE
3. **NV Ngân hàng trông như Tí** → Thêm "**THIS CHARACTER IS NOT TÍ — different face, different build, different outfit (suit not school shirt)**"
4. **Scammer trông quá hiền** → Thêm "**THIS CHARACTER IS A PREDATOR — sharp jawline, sly eyes, shiny slicked-back hair, predatory smirk**"
5. **Giảng viên trông quá trẻ** → Thêm "**THIS CHARACTER IS 50 YEARS OLD — visible mature face, soft jawline, silver strands, glasses, scholar demeanor**"

### Anti-distortion nhắc lại:
- Nếu tool cố tình **enlarge head** → nhắc "**do NOT enlarge head, keep head-to-body 1:4 to 1:5**"
- Nếu tool cố tình **add blush circles** → nhắc "**NO kawaii blush circles on cheeks, NO pink dots**"
- Nếu tool cố tình **make Tí into a kid** → nhắc "**MUST look like a 22-year-old ADULT intern, NOT a 13-year-old kid, NOT a 16-year-old teen**"

---

# 🎯 REFERENCE NHANH — ĐẶC ĐIỂM TÍ 22T

| Đặc điểm | Tí 22t (Chương 4) | Tí 19t (Chương 3) | Tí 16t (Chương 2) | Tí 13t (Chương 1) |
|---|---|---|---|---|
| Tuổi | **22** | 19 | 16 | 13 |
| Height | **172cm** | 170cm | 165cm | 150cm |
| Build | mature slim | lean slim | gầy | nhỏ |
| Tóc | **NGẮN slicked-back** | side part 7:3 | fringe vuốt nhẹ | ngắn hơi xoăn |
| Outfit | **sơ mi TRẮNG + cà vạt XANH + quần tây ĐEN + giày tây + BADGE** | thun xám + jeans xanh | thun trắng + short navy | thun vàng + short navy |
| Skin | pale white SẠCH (mặc định — chỉ thêm NHẸ dark circles khi anxious/defeated) | pale white + dark circles | pale white sạch | beige cute |
| Dark circles | **RÕ** | có (nhẹ) | không | không |
| Jawline | sharper (trưởng thành) | mature | dài thanh | bầu bĩnh |
| Phụ kiện | **BADGE công ty** | balo laptop | balo học sinh | balo đỏ |

**⭐ KHI NÀO KHÔNG CHẮC → LUÔN UPLOAD `c3_ti_neutral.png` (Tí 19t gốc) LÀM REFERENCE, SAU ĐÓ APPLY CHANGES THEO BẢNG TRÊN.**


---

## 🪧 TỔNG KẾT CHƯƠNG 4 — TỈNH TÁO TRƯỚC CÁM DỖ

**Output**: `images/chuong-4/bg_tong_ket_chuong.png`
**Loại**: Tranh tổng kết biểu tượng, không nhân vật, 16:9 — 1920 × 1080.
**Dùng cho**: Nhìn lại ý nghĩa cả chương, dùng chung cho các nhánh.
**Ý nghĩa cần gợi**: Đọc điều khoản trả góp; cân nhắc BNPL; nhận diện lời hứa làm giàu; giữ ưu tiên học tập và trách nhiệm tài chính.
**Thiết kế mới**: Tỉnh táo trước cám dỗ. Tiêu đề và câu chốt ý đặt trên khoảng giấy sáng ở giữa; các cụm đồ vật kể lại bài học nằm quanh rìa. Không dùng bảng gỗ lớn che gần hết cảnh. Đây là tranh hồi tưởng mang tính biểu tượng, không phải cảnh mới xảy ra sau nhiệm vụ cuối.

```text
Create ONE beautifully composed 16:9 full-bleed illustrated chapter-recap card, target 1920 x 1080. This is a finished visual-novel chapter reflection illustration, not a slide template or a literal continuation of the last scene.

STYLE: Hand-drawn 2D Vietnamese everyday-life storybook illustration, consistent with the established earnest slice-of-life game art: medium-thickness softly colored outlines, soft flat cel-shading with gentle gradients, subtle watercolor-paper grain, carefully simplified tangible objects, restrained warm natural light. Delicate edges, readable silhouettes, atmospheric depth, polished art direction. No photorealism, 3D, glossy vector clipart, giant cartoon faces or hyper-cute styling. NO people, character sprites, silhouettes, hands or human reflections.

CHAPTER MEANING: An elegant still-life of early adult decisions, with a magnifying glass as a subtle visual guide to reading and understanding commitments. The lesson is: Đọc điều khoản trả góp; cân nhắc BNPL; nhận diện lời hứa làm giàu; giữ ưu tiên học tập và trách nhiệm tài chính. This meaning is visual direction; do not render that explanatory sentence as text.

COLOR STORY: warm ivory #f4ebdb, restrained slate #647b8b, teal #6f9b97 and small copper accents #c58b64. Use cream for most of the image, two main supporting hues, and only small warm accents. Richer colors belong to the outer object groups; central text sits against a quiet light field.

CUSTOM ILLUSTRATED MOTIFS AND PLACEMENT: LOWER LEFT: an ordinary open laptop with a neutral blank screen, an unmarked contract and a small savings pouch, suggesting the choice between credit and existing savings without a purchase receipt or selected option. UPPER LEFT: a plain smartphone with a dark screen and a short stack of unnumbered calendar leaves, connecting buying now with future payment obligations. LOWER RIGHT: a magnifying glass rests partly over an unmarked investment flyer, with a fragile decorative gold ribbon at its corner, conveying scrutiny of seductive promises without a rising chart, promised return, red alert or scammer character. UPPER RIGHT: an open study book, capped pen and plain tuition envelope, recalling graduation work and the retake cost.

BACKGROUND AND ATMOSPHERE: Very faint office-window geometry fades into paper at the outer top edges; a muted teal pencil line curves between the objects, stopping before the central text. Light is warm-neutral and thoughtful, no danger-red poster or triumph lighting.

COMPOSITION: One coherent illustration, not a grid or a set of cards. Arrange the specified object groups as an asymmetrical but balanced open wreath around a large central breathing space. Keep ALL objects outside the central text zone, approximately x=20-80% and y=28-65% of the canvas. Let the lower objects anchor the image, with lighter smaller accents above. Objects have consistent perspective and gentle contact shadows; no floating dashboard icons. Keep secondary details sparse, three depth levels at most. The light center has a soft irregular paper wash integrated into the artwork, NOT a rectangular parchment plaque, wooden sign, bordered box, ribbon banner or physical board. No hard frame around the image.

TEXT HIERARCHY AND EXACT VIETNAMESE COPY: Center-align the following three lines as one group, vertically centered around 46% of canvas height.
Line 1, modest chapter eyebrow, approximately 40 px at 1920 x 1080:
Tổng kết chương 4
Line 2, main meaning title, approximately 76 px, the largest text:
Tỉnh táo trước cám dỗ
Line 3, supporting reflection, approximately 34 px:
Hiểu cam kết trước khi quyết định.

TYPOGRAPHY: Elegant bold readable storybook serif for the meaning title, simple clear medium-weight lettering for the chapter line and reflection. All text dark warm brown #3b3028 with strong contrast on light cream. Full accurate Vietnamese diacritics, no decorative strokes colliding with accents. Keep generous vertical gaps, at least 10% canvas-edge safety margin, no text touching objects. Main title must fit the central width; reduce it slightly only if needed, never crop it. These THREE specified lines are the ONLY readable text. All bills, books, screens, cards and calendars remain unmarked or abstract. No extra lesson labels or microtext.

NARRATIVE RULE: A thematic recap of learning, NOT a declared player achievement. No success badge, failure stamp, stars, grades, scores, balances, invented rates, selected choices, completed transaction or guaranteed outcome. Symbols show concepts explored in the chapter regardless of the chosen branches. 

ASPECT AND DELIVERY: ONE rectangular 16:9 PNG, 1920 x 1080, full bleed, no black margins. Artwork already includes the three specified text lines. No sprite or dialogue box should be layered over the finished card. If gameplay needs scores or detailed recap text, show them on a subsequent UI screen instead of covering this illustration.

NEGATIVE: huge wooden title panel, boxed parchment, generic last-room screenshot, slide deck, infographic grid, collage of screenshots, split-screen rooms, icon stickers, money rain, giant coin piles, glitter explosion, victory trophy, neon finance dashboard, upward profit arrow, confirmed outcome, people, faces, hands, silhouettes, readable prop labels, extra text, misspelled Vietnamese, missing accents, tiny captions, crowded center, overlapping lettering, cropped title, illegible calligraphy, watermark, logo, photorealism, 3D render, heavy black outlines, black borders.
```

**Kiểm tra riêng ảnh tổng kết**: Đủ 3 dòng chữ đúng dấu; bài học được gợi qua đồ vật; trung tâm thoáng; không có bảng gỗ che tranh; không thể hiện người chơi đã thắng/thua. Giữ màu sắc và nét vẽ đồng bộ cả bộ, nhưng bố cục đồ vật đúng riêng chương 4.

**Bổ sung danh mục ảnh**: 1 ảnh tổng kết theo đường dẫn trên; các bảng đếm BG/scene cũ chỉ tính ảnh gameplay, chưa gồm ảnh tổng kết này.
