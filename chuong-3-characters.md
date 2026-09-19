# 🎭 CHƯƠNG 3 — CHARACTER EMOTION PORTRAITS

> **MỤC ĐÍCH**: Tách riêng file emotion portraits (nhân vật 3:4 trên nền trắng) cho Chương 3 — sinh viên Đại học (Tí 19 tuổi). Dùng cho **dialogue** scene khi 2 nhân vật nói chuyện qua lại với nhau.
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Mọi emotion phải dùng **CHÍNH XÁC** style token kawaii 2D giống hệt portrait sprite gốc (Tí 19t từ chương 3). Đặc biệt **CHÚ TRỌ** (chủ nhà cho thuê phòng trọ) và **CHỦ QUÁN CÀ PHÊ** (Boss quán nơi Tí làm thêm đêm) là 2 nhân vật mới cần gen emotion — phải lock age (50t, 45t) và giữ phong cách kawaii 2D y hệt.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi prompt là **KHỐI TỰ CHỨA ĐẦY ĐỦ** — copy nguyên khối `[Style token + Character reference đầy đủ + Expression + Aspect]` là dán vào Gemini là chạy được. KHÔNG cần tra cứu thêm ở đâu khác.

---

# 📐 KIẾN TRÚC VISUAL NOVEL — LOẠI ẢNH DIALOGUE

> 🎮 **Game này là Visual Novel kiểu Ren'Py / VN Studio**. Khi có thoại nói chuyện qua lại giữa 2 nhân vật, scene thuộc loại `dialogue`.
>
> | Loại scene VN | Sprite nhân vật | Background | Loại ảnh gen |
> |---|---|---|---|
> | **`type: 'dialogue'`** (có đối thoại giữa 2+ nhân vật) | ✅ Render sprite riêng | BG trống (xem file `chuong-3-backgrounds.md`) | **PORTRAIT sprite** (1 nhân vật đứng một mình, nền trắng) |
>
> 📌 File này chỉ chứa **PORTRAIT SPRITE 3:4** — ảnh nền trắng của từng nhân vật với từng emotion. React engine sẽ ghép 2 portrait lên BG trống (xem file `chuong-3-backgrounds.md`).

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 3)

| Nhân vật | Tuổi cố định | Quốc tịch | Cụm mô tả bắt buộc trong mỗi prompt |
|---|---|---|---|
| Tí | **19** | 🇻🇳 Việt Nam | `a 19-year-old Vietnamese boy` |
| Chủ trọ | **50** | 🇻🇳 Việt Nam | `a 50-year-old Vietnamese woman` |
| Chủ quán cà phê | **45** | 🇻🇳 Việt Nam | `a 45-year-old Vietnamese woman` |

> ⚠️ **TUYỆT ĐỐI KHÔNG** thay đổi tuổi hoặc quốc tịch giữa các emotion của cùng 1 nhân vật.

### Bảng emotion cần gen

| Nhân vật | Số emotion | Danh sách emotion |
|---|---|---|
| Tí 19t | **5** | neutral, worried, frustrated, sad, tired |
| Chủ trọ | **5** | neutral, strict, angry, impatient, friendly |
| Chủ quán cà phê | **5** | neutral, stern, tired, kind, busy |

> **Tổng: 15 emotion portraits** (1 nhân vật × 5 emotion × 3 nhân vật)
> Tất cả đều aspect **3:4 vertical**, nền trắng trơn.

---

# 🎨 STYLE TOKEN — CHUNG CHO MỌI EMOTION PORTRAIT

```
Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props, no text, no watermark. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary.
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
NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and
below feet.
```

### Negative prompt (áp dụng cho MỌI emotion)
```
text, watermark, blurry, deformed hands, extra fingers, mutated, low quality,
3D render, photorealistic, chibi, ugly, East Asian (Japanese/Korean/Chinese) features,
wrong age appearance, caucasian features, anime-stereotype Western face,
Japanese anime face, K-pop face, big round eyes anime stereotype,
slim sharp jawline (wrong for age 19 boy), tall muscular body (wrong for lean 19-year-old),
realistic Vietnamese adult face, child proportions (must look exactly 19)
```

---

# 🔗 CROSS-REFERENCE — ẢNH GỐC CẦN UPLOAD KÈM

> 🎯 **QUAN TRỌNG**: Khi gen emotion, **LUÔN upload ảnh reference gốc** để giữ đúng khuôn mặt, tóc, da, vóc dáng.

| Nhân vật chương 3 | Upload reference | Ghi chú |
|---|---|---|
| Tí 19t | `c2_ti_dorm_neutral.png` (Tí 16t) | height **178cm (cao hơn 16t 8cm, visibly THINNER — bony wrists, collarbone, flat belly), tóc **SIDE PART RẼ NGÔI** (KHÁC 16t fringe vuốt nhẹ sang bên), áo thun **XÁM** (hex #d0d0d0) + quần jeans **XANH DƯƠNG NHẠT** (hex #6890c0) + sneaker trắng + balo đen to + **tai nghe chụp đầu đen đeo quanh cổ** + **laptop** (khác 16t)** |
| Chủ trọ | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 50t, phụ nữ trung niên **Bắc bộ dân tộc Kinh**, dáng vừa vừa, da sáng trung bình, áo bà ba hoa nhí vải lụa, quần kaki nâu, dép tổ ong |
| Chủ quán cà phê | **KHÔNG CÓ reference** — gen đầu tiên từ prompt | 45t, phụ nữ trung niên, tóc ngắn, áo sơ mi đen, mặt nghiêm |

---

# 👥 CÁC NHÂN VẬT CHÍNH TRONG CHƯƠNG 3 (CÓ THOẠI)

| ID | Tên nhân vật | Tuổi cố định | Vai trò | Scene có thoại |
|---|---|---|---|---|
| `ti` | Tí | **19** | Sinh viên ĐH năm nhất, sống trọ, làm thêm đêm ở quán cà phê (height **178cm — cao hơn 16t 8cm, gầy hơn rõ rệt**, **áo thun XÁM `#d0d0d0`** + **quần jeans XANH DƯƠNG NHẠT `#6890c0` DÀI tới mắt cá chân** + sneaker trắng + balo đen to + **tai nghe chụp đầu đen quanh cổ** + **laptop**, tóc **SIDE PART RẼ NGÔI 7:3**, **mặc định mắt sạch KHÔNG thâm, chỉ thâm nhẹ khi emotion tired/sad**) | Tất cả 5 scene |
| `chutro` | Chủ trọ | **50** | Bà chủ nhà cho thuê phòng trọ của Tí | Scene 1, Scene 2, Scene 5 |
| `chuquancafe` | Chủ quán cà phê | **45** | Bà chủ quán cà phê specialty nơi Tí làm thêm đêm 20h-24h | Scene 3, Scene 4 |

> 📌 **Scene chia theo cốt truyện**:
> - **Scene 1**: Split-screen chọn phòng trọ (Tí nội tâm — không có thoại, nhưng vẫn cần emotion portrait để dùng cho các đoạn khác nếu cần)
> - **Scene 2**: Bài toán 20 giờ — Tí làm thêm đêm (có thoại với Chủ quán cà phê)
> - **Scene 3**: Trò chơi Lọ thủy tinh (UI mockup, không có thoại)
> - **Scene 4**: Bão giá cuối tháng — Tí ở phòng trọ (có thoại với Chủ trọ về tiền điện nước)
> - **Scene 5 (Life Event)**: Hóa đơn điện nước — Tí đối mặt Chủ trọ ngoài hành lang (có thoại lớn với Chủ trọ)
>
> **2 nhân vật CÓ THOẠI qua lại với nhau** là:
> - **Tí ↔ Chủ quán cà phê** (Scene 2 — ca làm đêm)
> - **Tí ↔ Chủ trọ** (Scene 4 + Scene 5 — hóa đơn điện nước)

---

# 📋 PHẦN A — TÍ 19 TUỔI (5 EMOTION)

## 📄 TÍ NEUTRAL — `c3_ti_neutral.png`

**📍 Dùng cho**: emotion mặc định khi Tí bình thường, nói chuyện bình thường
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid style, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)** (small-ish head, longer body, longer legs typical of 19-year-old teen), long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face, smaller relative to face than chibi kid), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no props, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **CRITICAL NO-PROPS RULE**: NO props around character — NO bed, bowl, food, money, flyer, cup, bag, chair, meter. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5 with huge head + stubby limbs) — character MUST have TEEN proportions (1:3.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped. Plenty of white negative space above head and below feet.
>
> **Full character reference**: **a 19-year-old Vietnamese boy (Tí, age-locked at 19, EXACTLY 19 YEARS OLD — university student)**, height **178cm (cao HƠN 16t tận 8cm — phải nhìn rõ rệt TALLER than 16-year-old reference, KHÔNG được gần bằng — 19-year-old adult university student phải visibly taller, NOT same height as 16-year-old)**, **lean THINNER build than 16t — **visibly THINNER than 16-year-old reference** (sinh viên ĐH ăn mì gói làm đêm nên gầy rõ rệt: **visible bony wrists (cổ tay xương xẩu nhô rõ), visible collarbone outline (xương quai xanh nhô trên da), narrower bony shoulders, thin visible arms, thin visible legs, flat belly (NOT the same slightly-rounded teen belly as 16-year-old), overall WIRY SKINNY university student build — KHÔNG chubby, KHÔNG muscular, KHÔNG similar to 16-year-old**), soft warm light beige cute-friendly skin (SAME skin tone as 16t reference — pale clean Vietnamese skin), **typical Vietnamese university boy facial features — slightly flat and wider nose bridge (NOT pointy Japanese-style nose — SAME as 16t reference), oval face shape FULLY matured (KHÔNG còn baby-fat như 13t, jawline HOÀN TOÀN hình thành, face LONGER than 16t — clearly 19-year-old adult face), single eyelid or shallow double eyelid (NOT large Western-style double eyelids — SAME as 16t reference), monolid-friendly eye shape (SAME as 16t reference), mouth slightly wide with natural-looking lips (SAME as 16t reference)**, **Vietnamese university boy haircut — SIDE PART RẼ NGÔI (KHÁC 16t fringe vuốt nhẹ sang bên): side-parted short hair about 4-5cm all around the head, NGÔI RÕ RỆT chẻ 7:3 hoặc 8:2 — phần nhiều vuốt sang một bên, phần ít bên kia, fringe phía trước trán dài hơn 16t một chút (3-4cm, che nhẹ 1 phần trán, KHÔNG che hết trán), tóc hơi nhọn ở đỉnh đầu một chút nhưng vẫn gọn gàng practical, hair looks natural and soft with NO gel, NO wax, NO pomade, NO slicked-back, NO gelled spikes. The cut is a typical Vietnamese university boy side-part haircut from 2020s — practical, neat, has distinct side parting. NOT spiky, NOT curly, NOT afro, NOT anime-stereotype wild hair, NOT slicked back, NOT ponytail, NOT buzz cut, NOT military crew cut, NOT man bun, NOT shaggy anime hair. ⛔ KHÁC 16t (16t fringe vuốt nhẹ, 19t side part rẽ ngôi rõ rệt)**, **19-year-old university boy face — oval with full jawline forming, mature eyes (still monolid cute-style, NOT realistic), normal-sized round black-brown eyes (SAME proportion as 16t reference, just hint of maturity in eye expression)**, narrower shoulders (THINNER than 16t due to diet), thin limbs showing slight teenage definition (THINNER than 16t — slim wiry university student body). Looks 19 years old — full jawline, NO facial hair, slight dark circles (subtle, NOT prominent — vì thức khuya làm bài + ca đêm, CHỈ HƠI nhợt nhạt chứ KHÔNG thâm đậm zombie). **MẶC ĐỊNH neutral KHÔNG có dark circles rõ rệt — chỉ hơi nhợt nhạt.**
>
> **Outfit — KHÁC 16t (sinh viên ĐH đi học/ra ngoài)**: **light gray short-sleeve t-shirt (hex #d0d0d0, plain gray cotton tee with ROUND crew neckline — ĐỔI từ trắng sang xám cho khác biệt với 16t)**, **light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, FULL-LENGTH LONG PANTS dài tới mắt cá chân — KHÔNG shorts, KHÔNG knee-length, KHÔNG ngắn, jeans ống suông rộng vừa kiểu sinh viên ĐH)**, **simple white sneakers (hex #f0f0f0, GIỮ NGUYÊN giày trắng 16t)**. ⛔ KHÔNG mặc áo trắng + short navy như 16t — phải khác biệt rõ. **CÓ big black laptop backpack (hex #2a2a2a) over both shoulders** — to hơn balo học sinh cấp 3. **OVER-EAR BLACK HEADPHONES (tai nghe chụp đầu đen) đeo quanh cổ**. **LAPTOP visible peeking out from backpack or held in one hand**. ⛔ KHÔNG cầm flyer. Expression: **NEUTRAL — calm friendly gentle half-smile**, eyes CLEAN sáng (KHÔNG thâm), eyebrows at rest, mouth a small gentle smile. Pose: **STANDING UPRIGHT, full body visible from head to toe, looking at camera**, both arms relaxed at sides.
>
> **Specific emotion**: NEUTRAL — relaxed natural default face, eyebrows at rest position, mouth closed in soft natural line, eyes looking forward calmly, no particular emotion showing. Calm tired university student vibe.
>
> **Pose**: standing naturally with both arms relaxed at sides, full body visible from head to toe, facing camera straight-on, weight evenly distributed on both feet, very slight slouch typical of a tired university student studying late. **Character is the ONLY element in the image — pure plain white background, nothing else visible.**
>
> **Lighting**: flat even studio lighting, no directional sunlight, no environment shadows — clean neutral studio lighting on plain white seamless backdrop.
>
> **Aspect ratio**: 3:4 vertical, full character visible from head to feet. Full body shot, NOT close-up, NOT bust shot, NOT zoomed-in.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

## 📄 TÍ WORRIED — `c3_ti_worried.png`

**📍 Dùng cho**: Tí lo lắng — khi cân nhắc giữa 2 lựa chọn phòng trọ (Scene 1 split-screen), khi tính tiền điện nước (Scene 4), khi đối mặt chủ trọ (Scene 5)
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Full character reference**: **a 19-year-old Vietnamese boy (Tí, age-locked at 19)**, height **178cm (cao HƠN 16t tận 8cm — phải nhìn rõ rệt TALLER than 16-year-old reference, KHÔNG được gần bằng — 19-year-old adult university student phải visibly taller, NOT same height as 16-year-old)**, **lean THINNER build than 16t — **visibly THINNER than 16-year-old reference** (sinh viên ĐH ăn mì gói làm đêm nên gầy rõ rệt: **visible bony wrists (cổ tay xương xẩu nhô rõ), visible collarbone outline (xương quai xanh nhô trên da), narrower bony shoulders, thin visible arms, thin visible legs, flat belly (NOT the same slightly-rounded teen belly as 16-year-old), overall WIRY SKINNY university student build — KHÔNG chubby, KHÔNG muscular, KHÔNG similar to 16-year-old**)**, soft warm light beige cute-friendly skin (SAME as 16t reference — pale clean Vietnamese skin, **KHÔNG có dark circles rõ rệt ở worried — chỉ hơi nhợt nhạt nhẹ**), Vietnamese facial features (flat nose bridge, oval matured face with full jawline, single eyelid or shallow double eyelid, monolid-friendly eye shape — SAME as 16t), **Vietnamese university boy haircut — **SIDE PART RẼ NGÔI (KHÁC 16t)**: side-parted short hair about 4-5cm all around, **NGÔI RÕ RỆT một bên (chẻ ngôi rõ từ 7:3 hoặc 8:2)**, phía trước trán fringe dài hơn 16t một chút (3-4cm, che nhẹ 1 phần trán), hair looks natural and soft with NO gel, NO pomade, NO wax, mature university boy face, smaller blush circles than 16t. **Outfit — KHÁC 16t (sinh viên ĐH)**: light gray short-sleeve t-shirt (hex #d0d0d0), **light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, FULL-LENGTH LONG PANTS dài tới mắt cá chân — KHÔNG shorts, KHÔNG knee-length, KHÔNG ngắn)**, simple white sneakers (hex #f0f0f0). **CÓ big black laptop backpack (hex #2a2a2a) over both shoulders** + **OVER-EAR BLACK HEADPHONES (tai nghe chụp đầu màu đen) đeo quanh cổ** + **LAPTOP visible peeking out from backpack or held in one hand (máy tính xách tay)**. ⛔ KHÔNG cầm flyer. Expression: **WORRIED ANXIOUS — small nervous frown**, eyebrows slightly raised in middle (worried pinch), eyes wide and slightly glassy, small downturned "..." mouth, **2 small sweat drops** on forehead. Pose: **STANDING UPRIGHT, full body visible from head to toe, looking at camera**, both arms at sides (KHÔNG cầm gì).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 TÍ FRUSTRATED — `c3_ti_frustrated.png`

**📍 Dùng cho**: Tí bực bội khi ca làm đêm kéo dài (Scene 2 — sau khi lau bàn thứ 10), khi thấy hóa đơn điện nước cuối tháng (Scene 4)
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Full character reference**: **a 19-year-old Vietnamese boy (Tí, age-locked at 19)**, height **178cm (cao HƠN 16t tận 8cm — phải nhìn rõ rệt TALLER than 16-year-old reference, KHÔNG được gần bằng — 19-year-old adult university student phải visibly taller, NOT same height as 16-year-old)**, **lean THINNER build than 16t — **visibly THINNER than 16-year-old reference** (sinh viên ĐH ăn mì gói làm đêm nên gầy rõ rệt: **visible bony wrists, visible collarbone, narrower bony shoulders, thin arms, thin legs, flat belly — KHÔNG chubby, KHÔNG muscular, KHÔNG similar to 16-year-old**)**, soft warm light beige cute-friendly skin (SAME as 16t, **KHÔNG có dark circles ở frustrated — vì đây là bực bội NHẸ, KHÔNG phải mệt cực**), Vietnamese facial features (flat nose bridge, oval matured face with full jawline, single eyelid, monolid eye shape — SAME as 16t), **Vietnamese university boy haircut — **SIDE PART RẼ NGÔI (KHÁC 16t)**: side-parted short hair 4-5cm, **NGÔI RÕ RỆT chẻ 7:3 hoặc 8:2**, fringe 3-4cm che nhẹ trán, NO gel/pomade/wax**, mature university boy face, blush circles. **Outfit — KHÁC 16t (sinh viên ĐH)**: light gray short-sleeve t-shirt (hex #d0d0d0), **light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, FULL-LENGTH LONG PANTS dài tới mắt cá chân — KHÔNG shorts, KHÔNG knee-length, KHÔNG ngắn, jeans ống suông rộng vừa)**, simple white sneakers (hex #f0f0f0). ⛔ KHÔNG mặc áo trắng + short navy như 16t. **CÓ big black laptop backpack (hex #2a2a2a) over both shoulders** + **OVER-EAR BLACK HEADPHONES đeo quanh cổ** + **LAPTOP peeking từ balo/cầm tay**. Expression: **FRUSTRATED GRUMPY — slightly irritated**, eyebrows drawn together and slightly down (frustrated pinch), eyes half-closed and squinting with annoyance, mouth small frown lips pressed, **1 cartoon anger vein mark** on left temple (small kawaii angry vein symbol), blush circles slightly faded. Pose: **STANDING UPRIGHT, full body visible from head to toe, looking at camera**, both hands at sides (KHÔNG cầm gì).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 TÍ SAD — `c3_ti_sad.png`

**📍 Dùng cho**: Tí buồn — khi đếm tiền cuối tháng không đủ (Scene 4), khi bị chủ trọ mắng vì trả tiền trễ (Scene 5)
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Full character reference**: **a 19-year-old Vietnamese boy (Tí, age-locked at 19)**, height **178cm (cao HƠN 16t tận 8cm — phải nhìn rõ rệt TALLER than 16-year-old reference, KHÔNG được gần bằng — 19-year-old adult university student phải visibly taller, NOT same height as 16-year-old)**, **lean THINNER build than 16t — **visibly THINNER than 16-year-old reference** (sinh viên ĐH ăn mì gói làm đêm nên gầy rõ rệt: **visible bony wrists, visible collarbone, narrower bony shoulders, thin arms, thin legs, flat belly — KHÔNG chubby, KHÔNG muscular, KHÔNG similar to 16-year-old**)**, soft warm light beige cute-friendly skin (SAME as 16t, **MILD dark circles under eyes — thâm NHẸ vừa phải, KHÔNG quầng thâm đậm zombie, chỉ kiểu thiếu ngủ 1 chút**), Vietnamese facial features (flat nose bridge, oval matured face with full jawline, single eyelid, monolid eye shape — SAME as 16t), **Vietnamese university boy haircut — **SIDE PART RẼ NGÔI (KHÁC 16t)**: side-parted short hair 4-5cm, **NGÔI RÕ RỆT chẻ 7:3 hoặc 8:2**, fringe 3-4cm che nhẹ trán, NO gel/pomade/wax**, mature university boy face, blush circles. **Outfit — KHÁC 16t (sinh viên ĐH)**: light gray short-sleeve t-shirt (hex #d0d0d0), **light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, FULL-LENGTH LONG PANTS dài tới mắt cá chân — KHÔNG shorts, KHÔNG knee-length, KHÔNG ngắn, jeans ống suông rộng vừa)**, simple white sneakers (hex #f0f0f0). ⛔ KHÔNG mặc áo trắng + short navy như 16t. **CÓ big black laptop backpack (hex #2a2a2a) over both shoulders** + **OVER-EAR BLACK HEADPHONES đeo quanh cổ** + **LAPTOP peeking từ balo/cầm tay**. Expression: **SAD HOPELESS — quiet downcast sadness**, eyes downcast looking at floor (eyelids lowered), eyebrows raised in middle and drooping at edges (sad pinch), small downturned frown, **1 small cartoon tear drop** in corner of left eye (1 single small kawaii tear), **2 small sweat drops** on forehead. Pose: **STANDING UPRIGHT, full body visible from head to toe**, shoulders slightly slumped, both hands hanging limp at sides (KHÔNG cầm gì).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 TÍ TIRED — `c3_ti_tired.png`

**📍 Dùng cho**: Tí mệt mỏi — sau ca làm đêm 4 tiếng ở quán cà phê (Scene 2), lúc đếm tiền cuối tháng trên giường (Scene 4)
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Full character reference**: **a 19-year-old Vietnamese boy (Tí, age-locked at 19)**, height **178cm (cao HƠN 16t tận 8cm — phải nhìn rõ rệt TALLER than 16-year-old reference, KHÔNG được gần bằng — 19-year-old adult university student phải visibly taller, NOT same height as 16-year-old)**, **lean THINNER build than 16t — **visibly THINNER than 16-year-old reference** (sinh viên ĐH ăn mì gói làm đêm nên gầy rõ rệt: **visible bony wrists, visible collarbone, narrower bony shoulders, thin arms, thin legs, flat belly — KHÔNG chubby, KHÔNG muscular, KHÔNG similar to 16-year-old**)**, soft warm light beige cute-friendly skin (SAME as 16t, **MILD dark circles under eyes — thâm NHẸ vừa phải, KHÔNG quầng thâm đậm zombie, chỉ kiểu vừa tan ca đêm**), Vietnamese facial features (flat nose bridge, oval matured face with full jawline, single eyelid, monolid eye shape — SAME as 16t), **Vietnamese university boy haircut — **SIDE PART RẼ NGÔI (KHÁC 16t)**: side-parted short hair 4-5cm, **NGÔI RÕ RỆT chẻ 7:3 hoặc 8:2**, fringe 3-4cm che nhẹ trán, NO gel/pomade/wax**, mature university boy face, blush circles. **Outfit — KHÁC 16t (sinh viên ĐH, ở nhà/phòng trọ)**: light gray short-sleeve t-shirt (hex #d0d0d0), **light blue denim jeans (hex #6890c0 — XANH DƯƠNG NHẠT, FULL-LENGTH LONG PANTS dài tới mắt cá chân — KHÔNG shorts, KHÔNG knee-length, KHÔNG ngắn, jeans ống suông rộng vừa)**, simple white sneakers (hex #f0f0f0). ⛔ KHÔNG mặc áo trắng + short navy như 16t. **KHÔNG balo (Tí ở nhà, KHÔNG đeo balo)** + **OVER-EAR BLACK HEADPHONES (tai nghe chụp đầu đen) để trên bàn cạnh hoặc đeo trên đầu** + **LAPTOP open trên bàn**. Expression: **EXHAUSTED DROWSY — heavy eyelids**, eyes half-closed with droopy eyelids (NOT closed, NOT sleeping), eyebrows slightly raised in tired surprise, mouth small flat line, **3 small cartoon sweat drops** on forehead + temple, blush circles very faded. Pose: **STANDING UPRIGHT, full body visible from head to toe, looking at camera with droopy eyes**, both arms hanging limp at sides (KHÔNG cầm gì), shoulders slightly slumped.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 PHẦN B — CHỦ TRỌ 50 TUỔI (5 EMOTION)

> **NHÂN VẬT MỚI — KHÔNG CÓ reference**. Gen đầu tiên từ prompt, không cần upload ảnh kèm.
>
> **Character cố định**: 50 tuổi, phụ nữ trung niên Việt Nam BẮC BỘ dân tộc Kinh, dáng vừa vừa (regular AVERAGE mature build, hơi tròn tròn tự nhiên ở bụng nhưng KHÔNG stout chubby, KHÔNG mập quá), da sáng trung bình đồng bằng Bắc Bộ (hex #d4b08c, sáng hơn da nông thôn miền Nam), tóc đen thẳng ngang vai buộc gọn kiểu bà Bắc bộ truyền thống (KHÔNG curly, KHÔNG xoăn, tóc thẳng mượt) có vài sợi bạc ở thái dương, áo bà ba hoa nhí vải lụa mềm kiểu Bắc bộ (hex base #d4a890 với hoa nhỏ đỏ/hồng/vàng), quần dài thụng kaki nâu đậm, dép tổ ong cao su trắng.

---

## 📄 CHỦ TRỌ NEUTRAL — `c3_chutro_neutral.png`

**📍 Dùng cho**: mặc định khi chủ trọ bình thường, mở cửa phòng cho xem
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 50-year-old Vietnamese woman (chủ trọ — landlady, kiểu BẮC BỘ dân tộc Kinh), height 155cm, regular AVERAGE mature build — VỪA VỪA không quá mập cũng không gầy (dáng trung bình phụ nữ Bắc Bộ 50 tuổi, hơi tròn tròn tự nhiên ở bụng/eo nhưng KHÔNG stout chubby, KHÔNG obese, KHÔNG fat, KHÔNG heavy-set — chỉ là phụ nữ trung niên bình thường khỏe mạnh), warm light-medium rustic northern-Vietnamese skin (hex #d4b08c — sáng hơn da nông thôn miền Nam, da Bắc bộ tươi sáng hồng hào hơn), short straight black hair cắt ngang vai kiểu tóc bà Bắc bộ truyền thống (KHÔNG curly, KHÔNG tóc xoăn, tóc thẳng mượt buộc gọn sau gáy hoặc cắt ngắn gọn — typical northern-Vietnamese landlady hair), a few silver strands at temples, kind mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 50-year-old adult woman), small mole on right cheek, oval face with soft jawline (KHÔNG double chin rõ rệt, chỉ hơi đầy đặn tự nhiên theo tuổi).** Outfit BẮC BỘ truyền thống: **áo bà ba hoa nhí vải lụa vải mềm (hex base #d4a890 với hoa nhí nhỏ màu đỏ/hồng/vàng — kiểu áo bà ba Bắc bộ thanh lịch, KHÔNG vải thô rẻ tiền), loose dark-brown canvas pants (hex #4a3a2a — quần vải tối màu giản dị), white Vietnamese rubber "tổ ong" sandals (hex #f0f0f0)**, small gold earrings. Expression: **NEUTRAL — friendly but businesslike**, small polite smile (lips closed, NOT wide grin), eyebrows at rest, eyes calm and observant. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, both hands clasped in front of her belly (typical Vietnamese mature-woman resting pose).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ TRỌ STRICT — `c3_chutro_strict.png`

**📍 Dùng cho**: chủ trọ nhắc nhở về giờ giấc, nội quy phòng trọ, yêu cầu trả tiền đúng hạn
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 50-year-old Vietnamese woman (chủ trọ — landlady, kiểu BẮC BỘ dân tộc Kinh), height 155cm, regular AVERAGE mature build — VỪA VỪA không quá mập cũng không gầy (dáng trung bình phụ nữ Bắc Bộ 50 tuổi, hơi tròn tròn tự nhiên ở bụng/eo nhưng KHÔNG stout chubby, KHÔNG obese, KHÔNG fat, KHÔNG heavy-set — chỉ là phụ nữ trung niên bình thường khỏe mạnh), warm light-medium rustic northern-Vietnamese skin (hex #d4b08c — sáng hơn da nông thôn miền Nam, da Bắc bộ tươi sáng hồng hào hơn), short straight black hair cắt ngang vai kiểu tóc bà Bắc bộ truyền thống (KHÔNG curly, KHÔNG tóc xoăn, tóc thẳng mượt buộc gọn sau gáy hoặc cắt ngắn gọn — typical northern-Vietnamese landlady hair), a few silver strands at temples, strict mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 50-year-old adult woman), small mole on right cheek, oval face with soft jawline (KHÔNG double chin rõ rệt).** Outfit BẮC BỘ truyền thống: **áo bà ba hoa nhí vải lụa vải mềm (hex base #d4a890 với hoa nhí nhỏ màu đỏ/hồng/vàng — kiểu áo bà ba Bắc bộ thanh lịch), loose dark-brown canvas pants (hex #4a3a2a), white Vietnamese rubber "tổ ong" sandals (hex #f0f0f0)**, small gold earrings. Expression: **STRICT — stern serious but not angry**, eyebrows drawn down in a strict line (slightly furrowed, NOT fully angry), eyes sharp and watchful (NOT squinting, NOT glaring), mouth in a flat determined line (horizontal firm line, NOT frowning deeply), **no smile** (this is business-mode, not friendly-mode), chin slightly raised showing authority. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, one hand raised with index finger pointing upward in a "remember this!" gesture (cartoon lecturing finger, NOT shaking fist), the other hand on her hip.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ TRỌ ANGRY — `c3_chutro_angry.png`

**📍 Dùng cho**: chủ trọ quát mắng vì trả tiền trọ trễ, vì làm ồn sau 22h, vì xài điện nước quá nhiều
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 50-year-old Vietnamese woman (chủ trọ — landlady), height 155cm, regular AVERAGE mature build — VỪA VỪA không quá mập cũng không gầy (dáng trung bình phụ nữ Bắc Bộ 50 tuổi, hơi tròn tròn tự nhiên ở bụng/eo nhưng KHÔNG stout chubby, KHÔNG obese, KHÔNG fat, KHÔNG heavy-set), warm light-medium rustic northern-Vietnamese skin (hex #d4b08c, now slightly FLUSHED reddish from anger), short straight black hair cắt ngang vai kiểu Bắc bộ (KHÔNG curly, tóc thẳng mượt buộc gọn — typical northern-Vietnamese landlady hair, now slightly disheveled from agitation), a few silver strands at temples, angry mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 50-year-old adult woman, eyes sharp and glaring), small mole on right cheek, oval face with soft jawline (KHÔNG double chin rõ rệt) (now with puffed cheeks from anger).** Outfit: **floral-patterned áo bà ba (hex base #4a3a2a with small flower pattern in red/pink/yellow), loose dark-brown canvas pants (hex #4a3a2a), white Vietnamese rubber "tổ ong" sandals (hex #f0f0f0)**, small gold earrings. Expression: **ANGRY SCOLDING — proper angry mature woman scolding**, eyebrows drawn down HARD and together (deep angry furrow), eyes narrowed sharp glaring, mouth WIDE OPEN shouting (open mouth showing teeth, BUT NOT cartoonishly huge, NOT screaming horror — a natural adult scolding shout, mouth opened ~50% of full shout), **2-3 cartoon anger vein marks** on her forehead (small kawaii pop-vein symbols), **1 cartoon anger symbol** (#) floating near her head (a small # symbol, kawaii style, NOT aggressive), cheeks visibly puffed. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, one hand on her hip, the other hand pointing forward accusingly (index finger pointing AT viewer/camera — scolding pose).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ TRỌ IMPATIENT — `c3_chutro_impatient.png`

**📍 Dùng cho**: chủ trọ giục trả tiền, giục dọn phòng, đứng ngoài cửa gõ cửa đòi tiền
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 50-year-old Vietnamese woman (chủ trọ — landlady), height 155cm, regular AVERAGE mature build — VỪA VỪA không quá mập cũng không gầy (dáng trung bình phụ nữ Bắc Bộ 50 tuổi, hơi tròn tròn tự nhiên ở bụng/eo nhưng KHÔNG stout chubby, KHÔNG obese, KHÔNG fat, KHÔNG heavy-set), warm medium-tan rustic northern-Vietnamese skin (hex #d4b08c), short straight black hair cắt ngang vai kiểu Bắc bộ (KHÔNG curly, tóc thẳng mượt buộc gọn), a few silver strands at temples, impatient mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 50-year-old adult woman), small mole on right cheek, oval face with soft jawline (KHÔNG double chin rõ rệt).** Outfit: **floral-patterned áo bà ba (hex base #4a3a2a with small flower pattern in red/pink/yellow), loose dark-brown canvas pants (hex #4a3a2a), white Vietnamese rubber "tổ ong" sandals (hex #f0f0f0)**, small gold earrings. Expression: **IMPATIENT ANNOYED — tapping foot energy**, eyebrows slightly raised in exasperation, eyes rolling slightly upward (looking up in annoyance, NOT rolling back full), mouth in a small impatient pout (lips pressed together and pushed slightly forward, small impatient "tch" expression), **1 cartoon impatience symbol** (a small cartoon ⏰ clock icon floating near her head — kawaii style), blush circles normal pink. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, one hand on her hip, the other hand tapping her wrist as if checking a watch (cartoon checking-watch gesture — impatient waiting).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ TRỌ FRIENDLY — `c3_chutro_friendly.png`

**📍 Dùng cho**: chủ trọ cười hiền khi Tí trả tiền đúng hạn, khi giới thiệu phòng lần đầu
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 50-year-old Vietnamese woman (chủ trọ — landlady), height 155cm, regular AVERAGE mature build — VỪA VỪA không quá mập cũng không gầy (dáng trung bình phụ nữ Bắc Bộ 50 tuổi, hơi tròn tròn tự nhiên ở bụng/eo nhưng KHÔNG stout chubby, KHÔNG obese, KHÔNG fat, KHÔNG heavy-set), warm medium-tan rustic northern-Vietnamese skin (hex #d4b08c, slightly warmer pinker from smiling), short straight black hair cắt ngang vai kiểu Bắc bộ (KHÔNG curly, tóc thẳng mượt buộc gọn), a few silver strands at temples, warm friendly mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 50-year-old adult woman, but eyes crinkle warmly at corners), small mole on right cheek, oval face with soft jawline (KHÔNG double chin rõ rệt).** Outfit: **floral-patterned áo bà ba (hex base #4a3a2a with small flower pattern in red/pink/yellow), loose dark-brown canvas pants (hex #4a3a2a), white Vietnamese rubber "tổ ong" sandals (hex #f0f0f0)**, small gold earrings. Expression: **FRIENDLY WARM — genuine kind maternal smile**, eyes crinkling warmly at corners (mature crow-feet lines, NOT cartoon star-eyes, NOT kawaii heart eyes), eyebrows relaxed, mouth in a warm closed-mouth smile with cheeks pushing up (mature Vietnamese-bà-kind-of-smile, lips closed showing warmth), **3 small cartoon heart/sparkle symbols** floating near her head (small kawaii hearts and sparkles — gentle, NOT aggressive, NOT love-struck). Pose: **STANDING UPRIGHT, full body visible, looking at camera**, both hands clasped warmly in front of her chest (welcoming gesture, NOT prayer pose), slight head tilt.
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 PHẦN C — CHỦ QUÁN CÀ PHÊ 45 TUỔI (5 EMOTION)

> **NHÂN VẬT MỚI — KHÔNG CÓ reference**. Gen đầu tiên từ prompt, không cần upload ảnh kèm.
>
> **Character cố định**: 45 tuổi, phụ nữ trung niên Việt Nam, dáng người thanh mảnh (slim mature build, không mập), da sáng hơn chủ trọ (sống ở thành phố), tóc ngắn ngang tai màu nâu sẫm highlight nâu sáng, áo sơ mi đen dài tay cài cúc cẩn thận, quần kaki đen, giày bệt đen.

---

## 📄 CHỦ QUÁN CÀ PHÊ NEUTRAL — `c3_chuquancafe_neutral.png`

**📍 Dùng cho**: mặc định khi chủ quán bình thường, hướng dẫn Tí công việc ngày đầu
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 45-year-old Vietnamese woman (chủ quán cà phê — coffee shop owner), height 160cm, slim mature urban-professional build, fair warm urban skin (hex #e8c8a8 — lighter than rural landlady), short ear-length dark-brown hair with subtle light-brown highlights (NOT black, NOT grey, NOT blonde — natural Vietnamese urban hair color), professional sharp mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 45-year-old adult woman, eyes are sharp and discerning), defined cheekbones, slim jawline, small light lipstick.** Outfit: **crisp black button-up long-sleeve blouse (hex #1a1a1a, sleeves rolled to elbows showing forearms — busy working look), slim-fit black formal pants (hex #2a2a2a), low black leather flat shoes (hex #1a1a1a)**, small silver wristwatch on left wrist, small silver stud earrings. Expression: **NEUTRAL — professional composed**, small polite businesslike smile (lips closed, slight curve up), eyebrows at rest, eyes calm and observant. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, both hands at her sides (relaxed but professional stance, NOT crossed arms).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ QUÁN CÀ PHÊ STERN — `c3_chuquancafe_stern.png`

**📍 Dùng cho**: chủ quán quở trách Tí khi làm sai (ví dụ: quên lau bàn, đổ cà phê), nhắc nhở về tiêu chuẩn phục vụ
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 45-year-old Vietnamese woman (chủ quán cà phê — coffee shop owner), height 160cm, slim mature urban-professional build, fair warm urban skin (hex #e8c8a8), short ear-length dark-brown hair with subtle light-brown highlights (now pulled back tight into a small bun showing she's serious), stern mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 45-year-old adult woman, eyes narrowed sharp), defined cheekbones, slim jawline.** Outfit: **crisp black button-up long-sleeve blouse (hex #1a1a1a, sleeves fully buttoned at wrists now — strict mode), slim-fit black formal pants (hex #2a2a2a), low black leather flat shoes (hex #1a1a1a)**, small silver wristwatch on left wrist, small silver stud earrings. Expression: **STERN — professional serious displeased**, eyebrows drawn down in a strict line (slightly furrowed, NOT full angry), eyes narrowed sharp watching (sharp focused stare, NOT squinting mean), mouth in a flat firm line (closed horizontal line, NOT frowning deeply), **no smile** (boss-mode, not friendly-mode), chin slightly raised. Pose: **STANDING UPRIGHT, full body visible, looking at camera**, arms crossed over her chest (typical authority pose, NOT aggressive, NOT pointing finger).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ QUÁN CÀ PHÊ TIRED — `c3_chuquancafe_tired.png`

**📍 Dùng cho**: chủ quán mệt mỏi sau giờ đông khách, nhìn Tí thông cảm khi Tí than mệt
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 45-year-old Vietnamese woman (chủ quán cà phê — coffee shop owner, urban Vietnamese, kiểu phụ nữ Bắc bộ/dân thành phố điềm đạm), height 160cm, slim mature urban-professional build, fair warm urban skin (hex #e8c8a8, naturally slightly paler from fatigue — NOT ghost-pale, NOT zombie, just 1 shade lighter than normal), short ear-length dark-brown hair with subtle light-brown highlights (naturally slightly loose after a long shift — a couple of strands near her temple falling gently, NOT messy-disaster), tired mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 45-year-old adult woman, eyes half-lidded with NATURAL subtle soft shadow under them — NOT dramatic dark circles, NOT heavy bags, just a gentle muted purple-gray smudge like an actual person after work, NOT painted-on), defined cheekbones, slim jawline, small light lipstick slightly faded from wiping.** Outfit: **black button-up long-sleeve blouse (hex #1a1a1a, sleeves now rolled back down to wrists and top button casually loosened, NOT disheveled, NOT wrinkled — just naturally relaxed end-of-shift), slim-fit black formal pants (hex #2a2a2a), low black leather flat shoes (hex #1a1a1a)**, small silver wristwatch on left wrist. **Expression NATURALLY TIRED — SUBTLE QUIET exhaustion, NOT theatrical, NOT cartoon-comedy-tired**: eyes naturally half-lidded with eyelids lowered calmly (NOT droopy-sad, NOT closed, NOT sleepy — just a quiet calm lowered-lid look like someone who's been on their feet all day), **eyebrows relaxed and natural (NOT pinched, NOT furrowed, NOT raised in fake empathy)**, mouth in a NATURAL small flat relaxed line (NOT a smile, NOT a frown, NOT a "pout" — just lips gently closed at rest, soft natural relaxation, NO exaggerated "small tired soft smile" — tired people don't perform a smile, they just rest their face), **chinese 暗色 subtle shadow under eyes (mute khaki-purple gray smudge, very soft, blended into skin tone — like real human being after 10 hours of work, NOT painted-on dark circles, NOT bold graphic lines)**, **NO cartoon sweat drops** (KHÔNG giọt mồ hôi cartoon — that's comedic, this is quiet realistic-mature exhaustion), **NO sparkle/heart/vein symbols floating** (KHÔNG kawaii pop-symbols overhead, this is a tired mature adult woman, NOT a chibi character), blush circles subtly MUTED (faded lighter pink than neutral — natural tired-pale, NOT removed, NOT dramatic white). Pose: **STANDING UPRIGHT NATURALLY — NOT dramatic, NOT gesture-heavy, just a normal tired person standing**, **one hand resting lightly on her hip (relaxed, NOT assertive)**, **the other hand raised to the side of her neck in a SUBTLE light gesture (NOT rubbing, NOT massaging — just fingertips lightly touching the side of her neck the way a tired office worker might, NATURAL and quiet)**, shoulders slightly slumped forward (NOT hunched, NOT slouched — just subtly relaxed-down from ideal posture), weight shifted onto one leg (natural tired stance, NOT stiff).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ QUÁN CÀ PHÊ KIND — `c3_chuquancafe_kind.png`

**📍 Dùng cho**: chủ quán thông cảm cho Tí, cho Tí thêm ca, tặng Tí ly cà phê miễn phí cuối ca
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 45-year-old Vietnamese woman (chủ quán cà phê — coffee shop owner), height 160cm, slim mature urban-professional build, fair warm urban skin (hex #e8c8a8, slightly warmer pinker from smiling), short ear-length dark-brown hair with subtle light-brown highlights, kind warm mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 45-year-old adult woman, eyes soft warm crinkling at corners), defined cheekbones, slim jawline, small light lipstick.** Outfit: **crisp black button-up long-sleeve blouse (hex #1a1a1a, sleeves rolled to elbows showing forearms), slim-fit black formal pants (hex #2a2a2a), low black leather flat shoes (hex #1a1a1a)**, small silver wristwatch on left wrist, small silver stud earrings. Expression: **KIND EMPATHETIC — gentle warm smile**, eyes soft warm crinkling at corners (mature crow-feet lines, NOT cartoon star-eyes, NOT kawaii heart eyes), eyebrows relaxed, mouth in a warm closed-mouth smile (lips closed showing warmth, NOT big grin), **2-3 small cartoon heart/sparkle symbols** floating near her head (small kawaii hearts and sparkles — gentle caring vibe, NOT aggressive, NOT love-struck). Pose: **STANDING UPRIGHT, full body visible, looking at camera**, one hand on her chest in a gentle caring gesture (hand over heart — Vietnamese style "I care about you" gesture), the other hand offering forward palm-up as if offering something (small offering gesture, NOT pushy, NOT demanding).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📄 CHỦ QUÁN CÀ PHÊ BUSY — `c3_chuquancafe_busy.png`

**📍 Dùng cho**: chủ quán đang bận rộn với khách, không có thời gian nói chuyện, giao việc nhanh cho Tí
**Aspect**: 3:4 vertical

> **⭐ BẮT ĐẦU PROMPT COPY-PASTE ⭐**
>
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:3.5 (TEEN proportions — body NOTICEABLY LONGER than chibi kid, with visible longer legs and longer torso, head proportionally SMALLER relative to body than chibi)**, long limbs (NOT stubby), normal-sized round sparkly eyes with two white circle highlights (NOT huge oversized chibi eyes, NOT tiny realistic eyes — proportionate to TEEN face), thick dark outlines, flat cel-shading with minimal gradients, **soft pink blush circles on cheeks (GIỮ NGUYÊN style 16t — cute blush đậm hồng trên má)**, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, isolated character on pure plain white background #FFFFFF, no scenery, no environment, no floor, no ground, no furniture behind, no text, no watermark. ⛔ **CRITICAL SOLO CHARACTER RULE**: image must contain EXACTLY ONE (1) character — Tí alone. ⛔ **NO RANDOM PROPS** — KHÔNG bed, bowl, food, money, flyer, cup, chair, meter. ✅ **ALLOWED WEARABLE/BODY PROPS** (vì là đồ Tí đeo/cầm trên người, không phải scenery): over-ear black headphones đeo quanh cổ hoặc trên đầu, laptop cầm tay hoặc peeking from backpack, black backpack trên vai. NOT realistic, NOT semi-realistic, NOT anime teen face (mature), NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar. NOT chibi kid proportions (1:2.5). **CRITICAL anti-distortion**: face proportions stay NORMAL across ALL emotions. **CRITICAL framing rule**: FULL CHARACTER must fit inside frame — top of head AND both feet AND both hands all visible — character 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped.
>
> **Setting**: **a 45-year-old Vietnamese woman (chủ quán cà phê — coffee shop owner), height 160cm, slim mature urban-professional build, fair warm urban skin (hex #e8c8a8, slightly FLUSHED from rushing around), short ear-length dark-brown hair with subtle light-brown highlights (now slightly messy from rushing — hair has small flyaways), busy mature almond-shaped eyes (NORMAL-sized mature eyes — NOT giant kawaii eyes — this is a 45-year-old adult woman, eyes sharp and darting around showing she's multitasking), defined cheekbones, slim jawline.** Outfit: **black button-up long-sleeve blouse (hex #1a1a1a, sleeves rolled up to elbows — busy working look), with a small dark-gray half-apron (hex #4a4a4a) tied at her waist — apron shows she's hands-on working, slim-fit black formal pants (hex #2a2a2a), low black leather flat shoes (hex #1a1a1a)**, small silver wristwatch on left wrist. Expression: **BUSY RUSHING — focused multitasking**, eyebrows slightly raised in concentration, eyes sharp and alert (looking around quickly, NOT at camera specifically), mouth slightly open showing she's about to bark an order (small "a!" mouth, NOT shouting, NOT gaping), **2 small cartoon sweat drops** on her forehead + temple (rushing around), **3 small motion lines** around her head (cartoon speed-busy lines, NOT aggressive). Pose: **STANDING UPRIGHT, full body visible, looking at camera but slightly turned as if about to rush off**, one hand on her hip, the other hand holding a small clipboard with a checklist (cartoon chunky clipboard with paper checklist — busy boss checking tasks).
>
> **Aspect ratio**: 3:4 vertical, character portrait, white background.
>
> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 📋 BẢNG TỔNG HỢP — 15 EMOTION PORTRAITS

| # | Filename | Nhân vật | Emotion | Aspect | Scene VN dùng |
|---|---|---|---|---|---|
| 1 | `c3_ti_neutral.png` | Tí 19t | neutral | 3:4 | Mặc định mọi dialogue Tí |
| 2 | `c3_ti_worried.png` | Tí 19t | worried | 3:4 | Scene 1, 4, 5 (lo lắng) |
| 3 | `c3_ti_frustrated.png` | Tí 19t | frustrated | 3:4 | Scene 2, 4 (bực bội) |
| 4 | `c3_ti_sad.png` | Tí 19t | sad | 3:4 | Scene 4, 5 (buồn) |
| 5 | `c3_ti_tired.png` | Tí 19t | tired | 3:4 | Scene 2, 4 (mệt) |
| 6 | `c3_chutro_neutral.png` | Chủ trọ 50t | neutral | 3:4 | Mặc định mọi dialogue Chủ trọ |
| 7 | `c3_chutro_strict.png` | Chủ trọ 50t | strict | 3:4 | Nhắc nhở nội quy, trả tiền |
| 8 | `c3_chutro_angry.png` | Chủ trọ 50t | angry | 3:4 | Quát mắng, cảnh cáo |
| 9 | `c3_chutro_impatient.png` | Chủ trọ 50t | impatient | 3:4 | Giục trả tiền, giục mở cửa |
| 10 | `c3_chutro_friendly.png` | Chủ trọ 50t | friendly | 3:4 | Tí trả tiền đúng hạn, giới thiệu phòng |
| 11 | `c3_chuquancafe_neutral.png` | Chủ quán 45t | neutral | 3:4 | Mặc định mọi dialogue Chủ quán |
| 12 | `c3_chuquancafe_stern.png` | Chủ quán 45t | stern | 3:4 | Nhắc nhở tiêu chuẩn, quở trách |
| 13 | `c3_chuquancafe_tired.png` | Chủ quán 45t | tired | 3:4 | Cuối ca, thông cảm Tí |
| 14 | `c3_chuquancafe_kind.png` | Chủ quán 45t | kind | 3:4 | Thông cảm, cho thêm ca, tặng cà phê |
| 15 | `c3_chuquancafe_busy.png` | Chủ quán 45t | busy | 3:4 | Đang bận, giao việc nhanh |

**Tổng: 15 emotion portraits** (5 emotion × 3 nhân vật)

---

# 🔑 QUY TẮC STYLE BẮT BUỘC

> **⚠️ MỌI emotion trong file này phải tuân theo quy tắc dưới đây — vi phạm sẽ ra ảnh sai art style.**

### Về STYLE TOKEN
- **BẮT BUỘC** dùng full kawaii 2D style token trong MỌI emotion (đã nhúng sẵn ở đầu mỗi prompt)
- **BẮT BUỘC** thêm block **Anti-distortion CRITICAL + Framing rule** (đã nhúng sẵn ở mỗi prompt)
- **NOT** realistic, semi-realistic, cinematic-photorealistic, 3D, Pixar

### Về NHÂN VẬT TRONG EMOTION
- Mỗi prompt emotion đã **TỰ CHỨA ĐẦY ĐỦ** character reference — copy là chạy, không cần tra cứu
- **Tí 19t**: dùng character reference từ chương 2 `c2_ti_dorm_neutral.png` (Tí 16t mặc thun trắng + short navy + sneaker trắng + tóc đen gọn vuốt nhẹ sang bên) — **height 178cm (cao HƠN 16t 8cm) + noticeably THINNER and LEANER build (gầy hơn rõ rệt) + áo thun XÁM `#d0d0d0` + quần jeans XANH DƯƠNG NHẠT `#6890c0` DÀI tới mắt cá chân + sneaker trắng + tai nghe đen quanh cổ + laptop + balo đen to + tóc SIDE PART RẼ NGÔI 7:3** — KHÔNG dùng reference từ `image-generation-bible.md` mục 1.3 (style khác)
- **Chủ trọ 50t**: nhân vật MỚI — 155cm, dáng vừa vừa Bắc bộ (KHÔNG stout chubby), warm light-medium rustic skin `#d4b08c`, short straight black hair cắt ngang vai kiểu bà Bắc bộ (KHÔNG curly), floral áo bà ba `#d4a890`, dark-brown canvas pants, white "tổ ong" sandals — KHÔNG dùng reference nào khác
- **Chủ quán cà phê 45t**: nhân vật MỚI — 160cm, slim mature urban, fair urban skin, short ear-length dark-brown hair, black button-up blouse + black formal pants + low black flat shoes — KHÔNG dùng reference nào khác
- **Face proportions** phải giữ NHẤT QUÁN giữa các emotion của cùng 1 nhân vật — không được phá vỡ canonical face

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

### Phase 1 — Gen 5 emotion Tí 19t
- [ ] Upload `c3_ti_neutral.png` (ảnh gốc từ `image-generation-bible.md` mục 1.3) làm reference
- [ ] Gen `c3_ti_neutral.png` → `c3_ti_worried.png` → `c3_ti_frustrated.png` → `c3_ti_sad.png` → `c3_ti_tired.png`
- [ ] Đảm bảo face identity NHẤT QUÁN qua 5 emotion (luôn upload `c3_ti_neutral.png` đã gen làm reference cho 4 emotion sau)

### Phase 2 — Gen 5 emotion Chủ trọ 50t (NHÂN VẬT MỚI)
- [ ] KHÔNG CÓ reference — gen đầu tiên từ prompt
- [ ] Gen `c3_chutro_neutral.png` TRƯỚC → upload làm reference cho 4 emotion sau
- [ ] Gen `c3_chutro_strict.png` → `c3_chutro_angry.png` → `c3_chutro_impatient.png` → `c3_chutro_friendly.png`
- [ ] Đảm bảo face identity + outfit + body NHẤT QUÁN qua 5 emotion

### Phase 3 — Gen 5 emotion Chủ quán cà phê 45t (NHÂN VẬT MỚI)
- [ ] KHÔNG CÓ reference — gen đầu tiên từ prompt
- [ ] Gen `c3_chuquancafe_neutral.png` TRƯỚC → upload làm reference cho 4 emotion sau
- [ ] Gen `c3_chuquancafe_stern.png` → `c3_chuquancafe_tired.png` → `c3_chuquancafe_kind.png` → `c3_chuquancafe_busy.png`
- [ ] Đảm bảo face identity + outfit + body NHẤT QUÁN qua 5 emotion

### Lưu ý cuối
- [ ] MỖI PROMPT EMOTION copy nguyên khối ⭐⭐⭐ là dùng được — không cần tra cứu block character reference ở đâu khác
- [ ] Tất cả 15 file phải là PNG 3:4 nền trắng đầy đủ
