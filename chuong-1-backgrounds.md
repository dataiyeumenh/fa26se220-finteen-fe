# 🎬 CHƯƠNG 1 — BACKGROUND & SCENE PROMPTS

> **MỤC ĐÍCH**: Tách riêng **BG** (nền trống, không nhân vật) và **SCENE** (composite, có nhân vật) cho Chương 1.
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Tất cả BG và SCENE phải dùng **CHÍNH XÁC** style token kawaii 2D giống hệt portrait sprite — để khi ghép sprite lên BG, nhất quán về art style. KHÔNG BAO GIỜ dùng style realistic, semi-realistic, cinematic-photorealistic cho BG/SCENE.
>
> **Visual Novel engine**:
> - `type: 'dialogue'` → load **BG** (trắng trơn, không nhân vật) + sprite portrait ghép lên
> - `type: 'narrator'` → load **SCENE** (đã có nhân vật trong ảnh, không cần sprite)

---

---

# 🏞️ PHẦN A — BACKGROUND (BG) — NỀN TRỐNG, KHÔNG CÓ NHÂN VẬT

> **BG = ảnh nền toàn cảnh 16:9**, không nhân vật.
> Dùng cho: `dialogue` scene (React ghép sprite lên) HOẶC `narrator` tĩnh.
>
> **Style**: Kawaii 2D cartoon background — flat cel-shaded environment, simple shapes, pastel/warm colors, Studio Ghibli-inspired rural Vietnam setting rendered as cute cartoon. NO realistic rendering, NO photographic background, NO anime background.

---

## 📍 BG 1 — PHÒNG NGỦ TÍ (ĐÊM)

### 📄 `c1_bg_piggybank_room_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí nói chuyện với Mẹ hoặc Bố trong phòng
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc dùng y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**

> **Setting (BG kawaii cartoon environment — WARM COZY COTTAGE BEDROOM OF A 13-YEAR-OLD VIETNAMESE BOY (TÍ), Studio Ghibli countryside aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the room itself, far from any door or wall**, capturing the whole bedroom in a single panoramic view. **The camera is INSIDE the room, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer does NOT look through a door. The viewer simply SEES the room from inside, as if standing in the middle of the bedroom with a wide-angle lens. **Image is FULL-BLEED** — the bedroom extends **edge-to-edge across the entire 16:9 frame**. The very left edge of the frame is the warm wooden wall of the room (continuing into the wall), the very right edge is the same wall, the top edge is the ceiling, the bottom edge is the floor — there is **no rectangular doorway box, no window frame border, no arch framing the scene**, the room simply fills the entire frame like a wide panoramic photograph taken from inside a bedroom. **ALL FOUR WALLS visible** with **floor and ceiling all visible**, the room opens up like a warm beloved bedroom of a teenage boy (Ponyo's village / Totoro's countryside cottage aesthetic). **Environment rendered in cute kawaii cartoon style with WARM, LOVING aesthetic — DECORATION-DENSE, lived-in, BOY'S bedroom full of small boyish cozy details (NOT girly — NO flowers, NO dreamcatcher feathers, NO floral embroidery)**: **Ceiling** at top — warm honey-brown wooden beams crisscrossing overhead, a soft warm lantern (đèn lồng) hanging from the center beam on a thin string casting a warm golden-amber circle of light down onto the floor below, plus **3-4 small folded paper airplanes** (máy bay giấy) tucked between the beams and **a small string of warm fairy lights** draped along the wooden beams for cozy charm. **Back wall (far away from viewer)** — smooth cream-white plastered wall (soft warm cream tones, like a cozy cottage interior), a small wooden bed centered against this wall with a **pale blue mosquito net** (mùng xanh nhạt — boyish color) draped over four corner posts hanging softly like a tiny tent, soft white bedding with a folded **navy blue blanket** (boyish color) at the foot. Above the bed: a **small poster of a football/soccer star** (generic cartoon boy kicking a ball, NO real player face) and a tiny framed family photo. **Left wall** — a warm wooden desk/chair setup (bàn học nhỏ) — this is Tí's study area for a 13-year-old boy: a small stack of textbooks, a tiny pink piggy bank (heo đất) sitting on the desk, a small pencil holder with several cartoon pencils, a small desk lamp with a blue shade, plus a small window with a soft blue curtain letting in cool blue moonlight. Above the desk on the wall: a small **framed poster of a Real Madrid football jersey** (áo đấu Real Madrid màu trắng với logo Real Madrid, kiểu dáng cartoon kawaii) and a tiny clock with cartoon hands. **Right wall** — a simple **wooden wardrobe** (tủ quần áo) with warm wooden doors, plus a small hanging **folded paper plane mobile** (đàn máy bay giấy treo), a small **toy car** (ô tô đồ chơi nhỏ) on a tiny wall shelf, and a small **worn wooden cricket bat** (gậy cricket/đánh bóng) leaning in the corner. **Floor** — warm honey-brown wooden floor (sàn gỗ ấm) with subtle plank lines stretching from the bottom edge of the frame toward the back wall in soft perspective, the warm lantern glow creating a golden-amber circle of light on the floor in the center of the room. A small **toy robot figure** (đồ chơi robot nhỏ) on the floor in the left corner, a small pair of **boyish cartoon sandals** (đôi dép nam) by the bed, a small **ball** (quả bóng nhỏ — generic round cartoon ball) on the floor near the desk. NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING in this image. **The room looks like a warm safe haven — cozy, lived-in, LOVED, boyish, decoration-dense** — the kind of bedroom where a 13-year-old VIETNAMESE BOY feels safe. **Background style matches the kawaii cartoon aesthetic** — flat warm colors, thick outlines on furniture, simple shapes, Studio Ghibli countryside coziness, full-room immersive perspective, edge-to-edge full-bleed with no borders.

> **Lighting**: warm lantern glow (golden-amber) hanging from ceiling casting a soft glowing circle of light down on the wooden floor in the center of the room, cool soft blue moonlight streaming through the left-wall window creating a gentle silver-blue tint on that side of the room, plus warm fairy lights along the ceiling beams adding tiny golden sparkle dots — **cozy nighttime bedroom atmosphere like a Studio Ghibli night scene**, warm and safe-feeling, EVERY part of the room visible and lit.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the room fills the entire frame with NO door, NO doorframe, NO wall edges, NO window frame border, NO arch, NO rectangular framing visible — the very left edge is wall, the very right edge is wall, the top edge is ceiling, the bottom edge is floor), **background image ONLY, no characters**.

---

## 📍 BG 2 — TẠP HÓA CÔ TƯ (VIEW TỪ CỬA NHÌN VÀO)

### 📄 `c1_bg_shop_interior_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí đối thoại với Cô Tư trong shop
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar.

> **Setting (kawaii cartoon environment — WARM COZY VILLAGE GROCERY STORE, Studio Ghibli aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the shop itself, far from any door or wall**, capturing the whole shop interior in a single panoramic view. **The camera is INSIDE the shop, NOT outside the entrance** — there is **NO doorway, NO doorframe, NO entrance frame, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer does NOT look through a door. The viewer simply SEES the shop from inside, as if standing in the middle of the shop with a wide-angle lens. **Image is FULL-BLEED** — the shop interior extends **edge-to-edge across the entire 16:9 frame**. The very left edge of the frame is the warm wooden wall/shelves of the shop itself (continuing into the wall), the very right edge is the same, the top edge is the ceiling, the bottom edge is the floor — there is **no rectangular doorway box, no window frame border, no arch framing the scene**, the shop simply fills the entire frame like a wide panoramic photograph taken from inside a tạp hóa. **ALL FOUR WALLS visible** with **floor and ceiling all visible**. **Environment rendered in cute kawaii cartoon style with WARM LOVING aesthetic — DETAIL-DENSE, cozy, well-stocked, full of small cartoon shop items**: **Ceiling** at top — simple warm-white fluorescent tube light (ống huỳnh quang) running across the center of the ceiling, casting warm white light downward, simple warm-brown wooden rafters visible, plus a small **slow-spinning warm ceiling fan** with 3 cartoon blades and 2 tiny warm pull-strings hanging from it. **Back wall (the wall opposite the entrance, far away)** — tall wooden shelves packed densely with colorful Vietnamese snacks drawn as cute adorable cartoon packages — bright orange-red bim bim Oishi bags stacked 3-high, yellow-green mì Hảo Hảo cups stacked neatly like tiny towers, colorful bánh Trung Thu boxes in pink and gold with cute mooncake illustrations, small bags of candies in adorable pink/blue/green, a row of bright orange soda bottles, a few green rice-wine bottles, a small cluster of cartoon toy boxes. A handwritten sign "GIÁ HỌC SINH - GIẢM 5%" hanging above the back-wall shelves, plus a small colorful paper lantern strung above for warmth. **Left wall** — the wooden counter (quầy) running along this wall, warm honey-brown chunky cartoon wood with thick outlines, an old wooden abacus resting on one end with colorful red beads, a few bags of bim bim stacked on the counter, a small potted plant by the corner of the counter, a small calendar with cute cartoon pictures on the wall above the counter, a small **rotating postcard rack** with tiny cartoon postcards, a small hand-drawn cartoon cat calendar pinned to the wall. **Right wall** — a window with cheerful yellow curtain (with little flower-shaped tie-backs) letting in warm golden afternoon sunlight, more small shelves with candy/toy boxes, a small framed family photo on the wall, a small chalkboard with cute hand-drawn prices "Bim bim: 5k / Mì: 10k" in bubbly cartoon letters, a small **hanging bunch of cartoon keychains** for sale swaying gently. **Floor (filling the bottom edge of the frame and stretching toward back wall)** — warm terracotta tile floor rendered as cute soft-orange cartoon tiles in a simple grid pattern in soft perspective stretching toward the back wall, slightly dusty golden tint from the sunlight. A small flower pot in a corner, a small cartoon **welcome mat** (thảm chùi chân) near where the viewer is standing at the entrance edge of the frame, a tiny cartoon broom leaning in a corner. NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING in this image.

> **Lighting**: warm fluorescent tube white light from the ceiling + warm golden afternoon sunlight streaming in through the right-wall window, creating a bright warm golden glow across the right side of the shop — **cozy warm kawaii cartoon grocery store atmosphere, every part of the shop visible and lit, decoration-dense**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the shop fills the entire frame with NO door, NO doorframe, NO wall edges, NO window frame border, NO entrance framing, NO arch, NO rectangular framing visible — the very left edge is wall, the very right edge is wall, the top edge is ceiling, the bottom edge is floor), **background image ONLY, no characters**.

---

## 📍 BG 3 — TẠP HÓA CÔ TƯ (VIEW TỪ NGOÀI NHÌN VÀO)

### 📄 `c1_bg_shop_overview.png`
**Loại**: BG (nền trống, wide shot, không nhân vật)
**Dùng cho**: `narrator` tĩnh — Narrator giới thiệu "Đây là tạp hóa Cô Tư..."
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar.

> **Setting (kawaii cartoon environment — WARM COZY VILLAGE SHOP, PANORAMIC EXTERIOR VIEW FROM THE STREET, Studio Ghibli aesthetic)**:
> **WIDE-ANGLE PANORAMIC EXTERIOR SHOT, NO WINDOW FRAME, NO DOOR FRAME BORDER** — Imagine a **wide-angle lens placed in the middle of the dirt path in front of the shop, at ~150cm eye height**, capturing the whole shop and its surroundings in a single panoramic view. **The camera is OUTSIDE in the open air, NOT looking through a window or door** — there is **NO window frame, NO doorframe, NO arch, NO rectangular framing visible anywhere**. The image is **FULL-BLEED EDGE-TO-EDGE** — the shop, sky, ground, and surroundings extend all the way to every edge of the 16:9 frame. **Environment in cute kawaii cartoon style with WARM LOVING aesthetic**: **Sky** (top half of frame, edge-to-edge) — warm cheerful blue afternoon sky with soft white cartoon cloud strips, warm golden light filtering through, extending to the very left and right edges of the frame. **Ahead (center-distance)** — the charming small Vietnamese shop building, a one-story cottage with warm cream-white plastered walls and faded blue-gray tile roof, the **open front door** of the shop centered in the front of the shop glowing warmly with golden interior light (the shop door is part of the shop building, NOT a frame for the camera), like a little warm beacon. To the left and right of the shop entrance: a small stepped stoop and a small bench outside. **Ground under viewer's feet and stretching toward the shop** — warm dusty path (nền đất) in soft warm-brown cartoon earth with tiny pebble dots, soft perspective lines leading toward the shop door (the viewer can imagine they are walking this path), the path extends to the very bottom edge of the frame. A few **tiny cute chickens** wandering on the path to the right, drawn as adorable chunky orange-yellow cartoon chickens with big eyes. **Left side of frame (edge-to-edge)** — a bamboo fence (hàng rào tre) in warm tan tones and a row of palm trees (cây dừa) as simple warm green cartoon triangles with brown trunks, extending to the very left edge of the frame. **Right side of frame (edge-to-edge)** — more palm trees and a lush green rice paddy (ruộng lúa) visible as a soft green strip at the warm horizon, extending to the very right edge of the frame. **Floating golden dust particles** in the sunlight — tiny warm kawaii sparkles like in a Studio Ghibli scene. NO people, NO characters visible anywhere. NO WINDOW FRAME, NO DOORFRAME BORDER, NO RECTANGULAR FRAMING visible in this image.

> **Lighting**: late afternoon golden hour sunlight (warm amber/gold) on exterior, warm dim fluorescent inside the shop through the open door, atmospheric perspective with slightly hazy distance.

> **Aspect ratio**: 16:9 widescreen, **background image ONLY, no characters**.

---

## 📍 BG 4 — VƯỜN NHÀ (CHIỀU TÀ)

### 📄 `c1_bg_garden_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Bố sai Tí làm vườn, Tí than thở
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar.

> **Setting (kawaii cartoon environment — WARM COZY VILLAGE GARDEN, FIRST-PERSON VIEW IN THE MIDDLE OF THE GARDEN, Studio Ghibli aesthetic)**:
> **FIRST-PERSON CAMERA VIEWPOINT** — Imagine the viewer is **standing in the middle of the vegetable garden at ~150cm eye height, looking around** as if they were a 13-year-old Vietnamese boy doing garden chores — the whole garden wraps around the viewer. **ALL DIRECTIONS visible**: **Sky above** — warm late-afternoon golden hour sky with soft warm cloud strips. **Ground under feet** — soft warm-brown earth with rows of morning glory plants (rau muống) in cute wavy bright green stretching out in all directions, small heart-shaped leaves, with a few tiny red tomatoes on tomato plants scattered around. **In front of viewer (center of frame)** — more rows of morning glory and tomato plants. **Left side of frame** — a wooden hoe (cuốc) leaning against a bamboo fence in chunky cartoon brown, a bamboo fence (hàng rào tre) in warm tan tones running along the left side. **Right side of frame** — the charming Vietnamese countryside house with warm terracotta tile roof in the mid-distance, soft warm cream walls, a small dirt yard in front of the house, the house's wooden door and a tiny window visible. **Behind viewer (visible at top edges and background distance)** — a tall mango tree casting a long golden shadow across the garden toward the viewer, more bamboo fencing visible at the back of the garden, distant lush green rice paddies (ruộng lúa) and palm trees (cây dừa) under a warm horizon. A few tiny cute chickens pecking at the warm earth here and there. **Warm golden afternoon sunlight** casting a long golden shadow stretching across the garden, dust motes floating like tiny golden kawaii sparkles. NO people, NO characters in this image.

> **Lighting**: warm golden hour sunlight from upper-left, long shadow stretching to lower-right across the garden, soft dust motes floating in the golden light (kawaii cartoon sparkles).

> **Aspect ratio**: 16:9, **background image ONLY, no characters**.

---

## 📍 BG 5 — SÂN TRƯỜNG (TRƯA)

### 📄 `c1_bg_schoolyard_empty.png`
**Loại**: BG (nền trống, không nhân vật chính)
**Dùng cho**: `dialogue` — Tí và Tèo nói chuyện về thẻ bài
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar.

> **Setting (kawaii cartoon environment — WARM SUNNY VILLAGE SCHOOLYARD, FIRST-PERSON VIEW IN THE MIDDLE OF THE YARD, Studio Ghibli aesthetic)**:
> **FIRST-PERSON CAMERA VIEWPOINT** — Imagine the viewer is **standing in the middle of the schoolyard at ~150cm eye height, looking around** as if they were a 13-year-old Vietnamese student on a sunny lunch break. The whole schoolyard wraps around the viewer. **ALL DIRECTIONS visible**: **Sky above (upper third of frame)** — bright cheerful blue sky with soft white cartoon cloud strips, warm tropical midday sun glowing warmly. **Ground under viewer's feet** — warm terracotta brick floor (nền gạch) rendered as a grid of small warm-orange cartoon bricks stretching out in all directions with soft perspective lines. **In front of viewer (center of frame)** — more brick yard stretching toward the back wall. **Left side of frame** — the tall **mango tree** (cây xoài) on the left, a large soft-green cartoon circle crown with thick brown trunk, casting **dappled circular warm shadows** on the brick floor around the viewer (the viewer could step into the shade right next to them). **Right side of frame** — more brick yard with a small flower pot near the corner, a cheerful school bell visible on the wall in the distance. **Behind viewer / far back wall** — an **old warm-cream concrete wall** (vách xi măng) in the background, simple chunky warm-gray rectangles with a few **faded colorful poster** rectangles in cheerful faded colors. A few **other 13-year-old students** (VERY small, tiny figures, blurred, purely decorative background) playing marbles in the far distance to the left under the mango tree. **Warm bright tropical midday sunlight** — warm yellow-white light, soft warm shadows under the mango tree, vivid cheerful blue sky. NO main characters, NO Tí, NO Tèo in this image.

> **Lighting**: warm bright tropical midday sunlight — warm yellow-white light, soft warm simple shadows under the mango tree, vivid cheerful blue sky at top — **cozy warm lively schoolyard atmosphere** in kawaii cartoon style.

> **Aspect ratio**: 16:9, **background image ONLY, no main characters**.

---

## 📍 BG 6 — ĐƯỜNG LÀNG (CHIỀU VÀNG)

### 📄 `c1_bg_road_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tí gặp Hùng trên đường tan học
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar.

> **Setting (kawaii cartoon environment — WARM GOLDEN HARVEST COUNTRYSIDE ROAD, VIEWPOINT STANDING ON THE ROAD LOOKING DOWN THE ROAD TOWARD THE VILLAGE, Studio Ghibli countryside aesthetic)**:
> **VIEWPOINT: STANDING ON THE ROAD, LOOKING ALONG THE ROAD TOWARD THE VILLAGE** — Imagine the viewer is **Tí himself, standing on the narrow countryside road at ~150cm eye height, looking forward down the road toward the direction of his village** (as if he is about to bike home from school and sees the village road stretching ahead). The viewer is positioned ON the road surface itself, with the road extending **straight ahead from the viewer's feet toward the distant horizon** in strong central perspective (the road's center line vanishes at the upper-center of the frame). A slight 3/4 angle (~20 độ lệch, very mild) gives a cinematic feel without losing the "looking down the road" reading. **Image is FULL-BLEED EDGE-TO-EDGE**, no window frame, no doorframe, no rectangular framing visible. **CÙNG ĐỊA ĐIỂM VỚI BG 7 (cầu) — BG 7 sẽ là góc nhìn TÈO đứng gần cầu nhìn ngược về phía đường dốc xuống**, nên ở BG 5 đường sẽ chạy về phía xa mà phía xa đó sẽ là **hướng đi đến cầu**. **CÙNG TÔNG**: late-harvest golden hour, lúa chín vàng rực mùa gặt tháng 9.
> 
> **Sky (upper portion of frame, edge-to-edge)** — warm **late-harvest golden hour sky** glowing rich amber-gold with soft warm orange-pink cloud strips stretched across, the sun setting low in the upper-left of the frame casting long horizontal warm rays from behind the viewer's left shoulder. Tiny warm floating dust particles glinting in the air like little gold sparkles.
> 
> **Road (cutting straight from bottom-center toward upper-center vanishing point)** — the **narrow asphalt road** with simple white dashed center line in cartoon style, the road extending from the viewer's feet at the bottom edge of the frame straight ahead into the distance in strong central perspective. Long warm golden shadows stretch diagonally across the road surface from the rice stalks on the left. The road surface catches warm golden highlights from the setting sun.
> 
> **Both sides of the road (filling left and right halves of frame) — GOLDEN RICE PADDY READY FOR HARVEST (cánh đồng lúa chín vàng sắp gặt) on BOTH sides**:
> - Vast golden rice paddies stretching from beside the road on both sides all the way to the horizon, the ripe rice stalks (bông lúa) bent heavy in **rich warm golden-yellow color** (NOT green — this is HARVEST season, late September, lúa đã chín vàng rực), drawn as soft warm cartoon strokes of golden-yellow with tiny darker gold strokes for the rice grains, swaying gently in cartoon style.
> - **2-3 elderly Vietnamese farmers (bác nông dân đang gặt lúa)** working in the paddy on the **left side**, drawn as small cute kawaii cartoon figures with traditional Vietnamese **nón lá** (conical straw hat) and simple work clothes (áo nâu, quần xắn gối), bent over the rice stalks with tiny golden sickles (liềm) in hand, mid-harvest motion. They have warm friendly weathered faces (NOT wrinkled elderly, just gentle smiling mature adults).
> - One farmer carrying a small **gánh lúa** (carrying pole with two baskets of golden rice stalks) balanced on their shoulder, walking slowly across the paddy.
> - **In the paddy closer to the viewer (mid-foreground, left side)** — a **water buffalo (trâu)** standing ankle-deep in a small muddy patch at the edge of the rice paddy, drawn as a cute chunky dark-gray cartoon water buffalo with gentle eyes and curved horns, chewing grass slowly, with a small wooden plow (cày) resting beside it.
> - A small flock of **3-4 cartoon chickens** (gà) pecking around near the edge of the paddy on the right side — chunky white/orange-brown cartoon hens with tiny red combs and round bodies, plus a proud little rooster (gà trống) with bright red comb and colorful tail feathers.
> - A small **brown-and-white cartoon dog (chó)** sitting near the right roadside watching the farmer work, tail wagging gently, soft floppy ears, friendly kawaii face.
> - Bamboo fences (hàng rào tre) in warm tan tones running along both sides of the road between the road and the rice paddies.
> 
> **Far distance (upper-center where the road vanishes)** — soft warm atmospheric golden haze with silhouettes of distant palm trees and low hills (đồi thấp) in soft warm-blue/gray tones, atmospheric perspective. **A few tall coconut palm trees** (cây dừa) drawn as simple warm green cartoon fronds on tall brown trunks scattered in the mid-distance on both sides of the road, their long golden shadows stretching across the road surface. A small **wooden stilt house** (nhà sàn nhỏ) in the warm mid-distance on the right side with cream walls and faded terracotta tile roof, with a small **clothesline** outside where a colorful shirt is drying in the wind.
> 
> **KEY CONNECTOR TO BG 7**: in the far distance where the road vanishes at the upper-center of the frame, the road appears to **dip slightly downward** (suggesting the downhill slope leading toward the bridge that BG 7 will show from the opposite direction). This creates the visual link that BG 5 (Tí on the road looking toward village) and BG 7 (Tèo near the bridge looking back toward the road) are the same continuous countryside scene.
> 
> NO bicycles, NO main characters (Tí, Hùng) — only background supporting characters (the 2-3 farmers), animals (water buffalo, chickens, dog), and environment. NO WINDOW FRAME, NO DOORFRAME, NO RECTANGULAR FRAMING in this image.

> **Lighting**: late-harvest golden hour — rich warm amber-gold sunlight from upper-right (sun setting low), long warm golden shadows stretching diagonally across the road and paddy, soft atmospheric golden haze in the distance, warm orange-pink tint on the clouds, glowing dust particles in the air. Rich harvest-movie cinematic feel.

> **Aspect ratio**: 16:9, **background image ONLY, no characters**.

---

## 📍 BG 7 — CẦU BÊ TÔNG (CHIỀU VÀNG MÙA GẶT — CÙNG TÔNG VỚI BG 5)

### 📄 `c1_bg_bridge_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Tèo hét lên khi thấy Tí phóng về cầu
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5, very short stubby limbs, huge round sparkly eyes, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT high-detail, NOT 3D, NOT Pixar.

> **Setting (kawaii cartoon environment — DRAMATIC VILLAGE BRIDGE, VIEWPOINT STANDING ON THE BRIDGE LOOKING BACK UP THE ROAD, Studio Ghibli countryside aesthetic — CÙNG ĐỊA ĐIỂM VỚI BG 5, NHƯNG NGƯỢC HƯỚNG)**:
> **VIEWPOINT: STANDING ON/NEAR THE BRIDGE, LOOKING BACK UP THE ROAD TOWARD THE VILLAGE (the reverse direction of BG 5)** — Imagine the viewer is **Tèo, standing on the small concrete bridge (cầu bê tông) at ~150cm eye height, looking back UP the road toward the direction where Tí is biking from** (Tèo's POV right before he screams at Tí to slow down). The road in front of the viewer goes **uphill** (a steep upward slope away from the bridge), extending from the viewer's feet at the bottom-center of the frame and rising up into the distance in strong central perspective (the road's center line vanishes at the upper-center of the frame). A slight 3/4 angle (~20 độ lệch, very mild) gives cinematic feel without losing the "looking up the road" reading. **Image is FULL-BLEED EDGE-TO-EDGE**, no window frame, no doorframe, no rectangular framing visible. **CÙNG ĐỊA ĐIỂM VỚI BG 5 ĐƯỜNG LÀNG — nhưng BG 5 là Tí nhìn về phía làng (đường chạy ra xa), BG 7 này là Tèo nhìn ngược từ cầu lên đường dốc**, nên ở BG 7 đường sẽ chạy từ dưới cầu lên trên về phía xa (hướng ngược lại so với BG 5). **CÙNG TÔNG**: late-harvest golden hour, lúa chín vàng rực mùa gặt tháng 9.
> 
> **Sky (upper portion of frame, edge-to-edge)** — same warm **late-harvest golden hour sky** as BG5: rich amber-gold glowing sky with soft warm orange-pink cloud strips stretched across, sun setting low in the upper-right of the frame (behind the viewer's right shoulder) casting long horizontal warm rays. Tiny warm floating dust particles glinting in the air like little gold sparkles.
> 
> **Foreground (bottom edge of frame, near the viewer's feet) — THE BRIDGE is right under the viewer**:
> - The viewer's feet are on the **concrete bridge surface** (cầu bê tông) — chunky weathered gray concrete slabs with a simple warm-white dashed center line continuing onto the bridge. The bridge has **simple rusty metal railings** (lan can sắt rỉ) on both sides catching the warm golden light — the railings are visibly rusty/old (this is the bridge whose brakes fail later in the scene).
> - **Below the bridge** (visible in the lower portion of the frame, slightly to either side under the bridge railings) — a thin strip of small green-brown water of the irrigation canal (mương nước) with a few warm-water lilies and small reeds growing along the muddy banks.
> 
> **Mid-distance (cutting straight from the bridge upward to upper-center vanishing point) — THE ROAD GOING UPHILL**:
> - The **narrow asphalt road** continues straight up from the bridge in strong central perspective, going over a **steep UPWARD slope** (the road tilts up from the bridge toward the distant horizon in the upper-center of the frame, creating dramatic leading lines pulling the eye toward where Tí will appear). Long warm golden shadows stretch diagonally across the road surface from the rice stalks on the left.
> 
> **Both sides of the road (filling left and right halves of frame) — GOLDEN RICE PADDY READY FOR HARVEST on BOTH sides (same as BG5)**:
> - Vast golden rice paddies (cánh đồng lúa chín vàng sắp gặt) stretching from beside the road on both sides all the way to the horizon, in **rich warm golden-yellow color** (NOT green — this is mùa gặt late September), drawn as soft warm cartoon strokes of golden-yellow with tiny darker gold rice grains, swaying gently.
> - **2-3 elderly Vietnamese farmers (bác nông dân đang gặt lúa)** working in the paddy on the **left side**, drawn as small cute kawaii cartoon figures with traditional Vietnamese **nón lá** (conical straw hat) and simple work clothes, bent over the rice stalks with tiny golden sickles, mid-harvest motion.
> - One farmer carrying a small **gánh lúa** balanced on their shoulder, walking across the paddy.
> - **A small water buffalo** (trâu) standing ankle-deep in a muddy patch at the edge of the paddy on the right side in the mid-distance, drawn as a chunky dark-gray cartoon water buffalo with gentle eyes and curved horns, chewing grass calmly — completely unaware of what's about to happen.
> - A small flock of **3-4 cartoon chickens** (gà) pecking near the right roadside — chunky white/orange-brown hens with red combs plus a proud little rooster with bright red comb and colorful tail feathers.
> - A small **brown-and-white cartoon dog** (chó) standing near the left roadside watching the road, alert ears, tail slightly raised, looking up the road as if sensing something coming from far away.
> - Bamboo fences (hàng rào tre) in warm tan tones running along both sides of the road between the road and the rice paddies.
> - **Tall coconut palm trees** (cây dừa) scattered in the mid-distance on both sides of the road as simple warm green cartoon fronds on tall brown trunks, casting long golden shadows across the road surface. A small **wooden stilt house** (nhà sàn nhỏ) in the warm mid-distance on the right side with cream walls and faded terracotta tile roof, with a small **clothesline** outside where a colorful shirt is drying in the wind.
> 
> **Far distance (upper-center where the uphill road vanishes)** — soft warm atmospheric golden haze with silhouettes of distant palm trees and low hills (đồi thấp) in soft warm-blue/gray tones, atmospheric perspective. This is where the road levels out at the top of the slope and disappears into the warm horizon haze — Tí will appear here, biking down toward the viewer.
> 
> **Atmospheric perspective**: soft warm atmospheric golden haze in the distance, soft warm-blue/gray silhouettes of distant low hills on the horizon. NO people, NO bicycles, NO main characters (Tí, Tèo, Hùng) in this image — only background environment + animals.

> **Lighting**: late-harvest golden hour sunset — rich warm amber-gold sunlight from upper-right (sun setting low), long warm golden shadows stretching diagonally across the road and paddy, soft atmospheric golden haze around the road vanishing in the distance, warm orange-pink tint on the clouds, glowing dust particles in the air. Dramatic cinematic feel — the road going uphill creates tension: Tí will appear from that vanishing point on the horizon, biking DOWN toward the bridge viewer (Tèo).

> **Aspect ratio**: 16:9 with strong central perspective (the uphill road) vanishing toward upper-center, **background image ONLY, no characters**.

---

## 📍 BG 8 — PHÒNG BỆNH (CHIỀU TÀ)

### 📄 `c1_bg_sickbed_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: `dialogue` — Mẹ hoặc Bố ngồi cạnh giường Tí
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc dùng y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, head-to-body ratio 1:2.5 (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL across ALL emotions — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features even when the character is screaming, shocked, angry, or laughing. Head size and facial proportions stay consistent with the canonical reference in every emotion sprite.** **CRITICAL framing rule: the FULL CHARACTER must fit entirely inside the image frame — top of head AND both feet AND both hands all visible — character occupies roughly 55–70% of vertical frame height, NOT zoomed-in, NOT close-up, NOT bust shot, NOT cropped, NOT portrait crop, NOT tight framing, NOT bust, NOT shoulders-up, NOT waist-up. Plenty of white negative space above head and below feet.**

> **Setting (BG kawaii cartoon environment — WARM COZY COTTAGE BEDROOM OF A 13-YEAR-OLD VIETNAMESE BOY (TÍ), same room as BG1 but in LATE AFTERNOON golden hour, Studio Ghibli countryside aesthetic)**:
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — Imagine a **wide-angle lens placed INSIDE the room itself, far from any door or wall**, capturing the whole bedroom in a single panoramic view. **The camera is INSIDE the room, NOT outside the door** — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. The viewer does NOT look through a door. The viewer simply SEES the room from inside, as if standing in the middle of the bedroom with a wide-angle lens. **Image is FULL-BLEED** — the bedroom extends **edge-to-edge across the entire 16:9 frame**. The very left edge of the frame is the warm wooden wall of the room (continuing into the wall), the very right edge is the same wall, the top edge is the ceiling, the bottom edge is the floor — there is **no rectangular doorway box, no window frame border, no arch framing the scene**, the room simply fills the entire frame like a wide panoramic photograph taken from inside a bedroom. **ALL FOUR WALLS visible** with **floor and ceiling all visible**, the room opens up like a warm beloved bedroom of a teenage boy (Ponyo's village / Totoro's countryside cottage aesthetic). **Environment rendered in cute kawaii cartoon style with WARM, MELANCHOLY atmosphere — same room as BG1 but now in late afternoon golden hour, the room feels quieter, more sorrowful, boyish bedroom full of small boyish cozy details (NOT girly — NO flowers, NO dreamcatcher feathers, NO floral embroidery)**: **Ceiling** at top — warm honey-brown wooden beams crisscrossing overhead, a soft warm lantern (đèn lồng) hanging from the center beam on a thin string casting a warm golden-amber circle of light down onto the floor below, plus **3-4 small folded paper airplanes** (máy bay giấy) tucked between the beams and **a small string of warm fairy lights** draped along the wooden beams for cozy charm. **Back wall (far away from viewer)** — smooth cream-white plastered wall (soft warm cream tones, like a cozy cottage interior), a small wooden bed centered against this wall with a **pale blue mosquito net** (mùng xanh nhạt — boyish color) draped over four corner posts hanging softly like a tiny tent, soft white bedding with a folded **navy blue blanket** (boyish color) neatly arranged at the foot. Above the bed: a **small poster of a football/soccer star** (generic cartoon boy kicking a ball, NO real player face) and a tiny framed family photo. **Left wall** — a warm wooden desk/chair setup (bàn học nhỏ) — this is Tí's study area for a 13-year-old boy: a small stack of textbooks, a small pencil holder with several cartoon pencils, a small desk lamp with a blue shade, plus a small window with a soft blue curtain letting in **warm golden late-afternoon sunlight**. Above the desk on the wall: a small **framed poster of a Real Madrid football jersey** (áo đấu Real Madrid màu trắng với logo Real Madrid, kiểu dáng cartoon kawaii) and a tiny clock with cartoon hands. **Right wall** — a simple **wooden wardrobe** (tủ quần áo) with warm wooden doors, plus a small hanging **folded paper plane mobile** (đàn máy bay giấy treo), a small **toy car** (ô tô đồ chơi nhỏ) on a tiny wall shelf, and a small **worn wooden cricket bat** (gậy cricket/đánh bóng) leaning in the corner. A small wooden bedside table (tủ đầu giường) next to the bed with a warm glowing dim lamp casting amber glow, and **a small pink piggy bank (heo đất) placed UPSIDE DOWN on its side, BROKEN OPEN** (heo đất bị lật úp, vỡ miệng — the top of the piggy bank is cracked/split open showing the empty hollow inside, the two halves of the ceramic piggy bank resting on the bedside table like an overturned broken shell, the crack clearly visible with a tiny jagged line down the center, the warm golden afternoon light catching the broken edges of the ceramic) — this is the symbol of Tí's regret, the broken piggy bank that caused everything, sitting cracked open on the bedside table. **Floor** — warm honey-brown wooden floor (sàn gỗ ấm) with subtle plank lines stretching from the bottom edge of the frame toward the back wall in soft perspective, the warm lantern glow creating a golden-amber circle of light on the floor in the center of the room, and **warm golden late-afternoon sunlight** streaming diagonally across the wooden floor from the right side. A small **toy robot figure** (đồ chơi robot nhỏ) on the floor in the left corner, a small pair of **boyish cartoon sandals** (đôi dép nam) by the bed, a small **ball** (quả bóng nhỏ — generic round cartoon ball) on the floor near the desk. A small wooden chair next to the bedside table (this is where Mẹ hoặc Bố will sit beside Tí's sickbed), with a small folded blanket on the chair. NO people, NO characters, NO sprites, NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING in this image. **The room looks like a warm safe haven that has become a sickroom — cozy, lived-in, LOVED, boyish, decoration-dense, but now tinged with quiet sadness** — the kind of bedroom where a 13-year-old VIETNAMESE BOY lies sick in bed after an accident, the broken piggy bank on the bedside table a silent reminder of what went wrong. **Background style matches the kawaii cartoon aesthetic** — flat warm colors, thick outlines on furniture, simple shapes, Studio Ghibli countryside coziness, full-room immersive perspective, edge-to-edge full-bleed with no borders.

> **Lighting**: warm golden late-afternoon sunlight (chiều tà) streaming diagonally through the right-wall window casting warm amber-gold rays across the wooden floor and onto the empty bed, soft warm lantern glow (golden-amber) hanging from ceiling creating a gentle golden circle of light on the floor, warm fairy lights along the ceiling beams adding tiny golden sparkle dots — **melancholy late-afternoon bedroom atmosphere, warm but sad, every part of the room visible and softly lit**.

> **Aspect ratio**: 16:9 widescreen **FULL-BLEED EDGE-TO-EDGE** (the room fills the entire frame with NO door, NO doorframe, NO wall edges, NO window frame border, NO arch, NO rectangular framing visible — the very left edge is wall, the very right edge is wall, the top edge is ceiling, the bottom edge is floor), **background image ONLY, no characters**.

---

---

# 🎬 PHẦN B — SCENE (COMPOSITE) — CÓ NHÂN VẬT TRONG ẢNH

> **SCENE = ảnh toàn cảnh 16:9** đã có nhân vật hành động trong ảnh.
> Dùng cho: `narrator` scene — engine KHÔNG ghép sprite, nhân vật đã có sẵn.
>
> **Style**: **CHÍNH XÁC** giống portrait sprite — kawaii 2D cartoon (head-to-body 1:2.5, huge eyes, thick outlines, cel-shading, soft blush). Background environment cũng phải là kawaii cartoon style y hệt (không realistic, không semi-realistic).
>
> **⚠️ CRITICAL**: Nhân vật trong SCENE dùng **style kawaii portrait** (head-to-body 1:2.5, huge eyes, thick outlines) — không phải realistic figure, không cinematic. Background cũng phải là kawaii cartoon environment.

---

## 📍 SCENE 1 — PHÒNG NGỦ TÍ: TÍ PHÁ HEO ĐẤT

### 📄 `c1_bg_piggybank_moment.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene mở đầu Chương 1
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc — y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:2.5** (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary. **CRITICAL anti-distortion: face proportions stay NORMAL — do NOT enlarge the head, do NOT widen the mouth, do NOT stretch the face, do NOT distort facial features. Head size and facial proportions stay consistent with the canonical reference.**

> **Setting (kawaii cartoon environment + character — WARM COZY NIGHT IN TÍ'S BOYISH BEDROOM, Studio Ghibli cottage aesthetic)**:
> Interior of a **traditional Vietnamese countryside COTTAGE BEDROOM of a 13-year-old boy (Tí)** (rural Vietnam, 2010s era) at **night** — warm, cozy, and safe-feeling, like a Studio Ghibli night scene. **FULL-BLEED VIEW** — the bedroom extends **edge-to-edge across the entire 16:9 frame** with **NO DOOR, NO DOOR FRAME, NO WALL EDGES, NO RECTANGULAR FRAMING visible ANYWHERE in the image**. The very left edge is wall/floor, the very right edge is wall/floor, the top edge is ceiling, the bottom edge is floor — there is **no doorway box framing the scene**, the room simply fills the entire frame. **Environment in cute kawaii cartoon style with WARM LOVING aesthetic — BOYISH (NOT girly — NO flowers, NO dreamcatcher feathers, NO floral embroidery), DETAIL-DENSE**: The room has **smooth cream-white plastered walls** (soft warm cream tones, like a cozy cottage) with a small family photo on the wall, a small wall shelf with 2-3 tiny cartoon textbooks. The **warm wooden floor** (sàn gỗ ấm) in soft honey-brown tones with subtle plank lines. A **single warm lantern** (đèn lồng) hanging from the ceiling — a small golden-amber glowing oval shape on a thin string, casting a warm golden circle of light on the small wooden table below. On the table: a **broken pink piggy bank** (heo đất) — two pink halves with a few pink shards scattered, and **scattered symbolic cartoon paper money bills** — simple stylized green rectangles fanned out (generic money, NO real Vietnamese dong, NO portraits, NO flags), plus a small pencil holder with cartoon pencils, and a small folded paper airplane next to the piggy bank (Tí was playing). A small **blue curtain** (rèm xanh nhạt — boyish color) on the side window with **cool blue moonlight** casting a soft silver glow on the far wall, a small toy car on the windowsill. The rest of the room is in warm lantern glow — dark but cozy corners. In the dimly lit background: a small wooden bed with a **pale blue mosquito net** (boyish color) visible, a small pair of **boyish cartoon sandals** (đôi dép nam) by the bed, a small **ball** (quả bóng nhỏ) on the floor near the desk. **A 13-year-old Vietnamese boy (Tí)** kneeling beside the table, face lit warmly from below by the lantern glow, eyes wide and sparkling with excitement and nervousness, the golden light making his face glow like a warm Studio Ghibli night scene. Mustard yellow oversized t-shirt (hex #e5aa46), navy blue shorts (hex #424a61), soft warm light beige cute-friendly skin, short black hair.

> **Character reference (Tí — age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tí, age-locked at 13, Vietnamese nationality), height 145cm, skinny lanky child build (typical underfed rural Vietnamese village teenager — visible thin arms, narrow bony shoulders, thin legs with slightly prominent knees, NOT muscular, NOT athletic), soft warm light beige cute-friendly skin (NOT pale white, NOT dark — warm mid-tone), short black messy hair (pitch-black, no brown, no highlights), typical Vietnamese rural boy facial features (slightly flat wider nose bridge, single eyelid or shallow double eyelid, soft round child cheeks with baby fat, gentle warm expression). Clearly looks 13 years old.

> **Lighting**: warm lantern glow (amber/orange) on the table area + cool blue moonlight through a small side window creating soft blue tint on the far corners, warm center / cool edge contrast — cozy nighttime bedroom atmosphere in kawaii cartoon style.

> **Aspect ratio**: 16:9 cinematic, **scene includes Tí in action**.

---

## 📍 SCENE 2 — TẠP HÓA CÔ TƯ: TÍ ĐƯA TIỀN, CÔ TƯ GHI SỔ

### 📄 `c1_bg_shop_counter_composite.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí cầm 200k đặt lên counter, Cô Tư ghi sổ rồi đưa bim bim
**Nhân vật trong ảnh**: Cô Tư + Tí (2 người)
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc — y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:2.5** (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary.

> **Setting (kawaii cartoon environment + 2 characters — WARM COZY VILLAGE GROCERY STORE, FULL-BLEED VIEW WITH NO WINDOW FRAME, NO DOOR FRAME BORDER)**:
> Same Vietnamese rural grocery store interior as `c1_bg_shop_interior_empty.png`, **rendered in kawaii cartoon style with WARM COZY aesthetic, NO WINDOW FRAME, NO DOOR FRAME BORDER, NO RECTANGULAR FRAMING visible**. Wooden shelves packed with colorful Vietnamese snack packages (bim bim, mì Hảo Hảo, bánh) drawn as cute adorable cartoon packages. Long wooden counter in warm honey-brown chunky cartoon wood (counter reaches roughly chest-height on Tí, who is a 13-year-old boy). **CRITICAL TÍ POSE — STANDING AT THE COUNTER, NOT KNEELING, NOT SQUATTING, NOT SITTING, NOT BENDING LOW, NOT ON THE FLOOR** — Tí is **STANDING UPRIGHT on his two feet behind/at the front of the counter**, his feet planted on the floor (NOT kneeling on the floor, NOT crouching down, NOT lying down, NOT bowing low). His **upper body** is visible above the counter surface (we see his head, torso, arms, shoulders, and the top of his hips), his arms reach **upward and forward** to place the money on the counter top — the bill is being laid down FLAT on the counter surface by Tí's outstretched hand coming from above (the bill rests on top of the counter, NOT being held down low near the floor). Tí stands at the same eye level as the front of the counter, fully upright like a customer at a shop checkout — NOT kneeling, NOT praying, NOT bowing, NOT crouching. **CRITICAL: Tí is NOT kneeling on the floor — his body is fully upright, standing tall, both legs straight, both feet on the floor.** **Behind the counter**: a 35-year-old Vietnamese woman (Cô Tư, age-locked at 35, Vietnamese nationality, Northern Vietnamese Bắc bộ) — plain long-sleeved button-up shirt in muted light blue tucked into high-waist dark long pants, short colorful floral half-apron tied at waist, long straight black hair in low ponytail at the nape, slim-to-medium taller build at 162cm, bright sharp mischievous eyes, smooth warm light-tan skin, thin reading glasses on nose — holding an old wooden abacus with one hand, a pencil in the other writing in a small notebook, focused on the transaction, looking down at the counter at the money being placed there. **In front of the counter (on the customer side, same side as Cô Tư behind)**: a 13-year-old Vietnamese boy (Tí) **STANDING UPRIGHT** (NOT kneeling, NOT crouching, NOT on the floor), mustard yellow t-shirt (hex #e5aa46), school backpack on shoulder, his right arm extended FORWARD AND SLIGHTLY UPWARD placing a symbolic cartoon paper money bill (generic stylized green rectangle, NO real Vietnamese dong) **FLAT on the counter top** — the bill is resting on the wooden counter surface at chest-height level for Cô Tư, Tí's hand is positioned just above the bill having just laid it down. A few bags of **bim bim** on the counter between them (tiny cute cartoon chip bags). **Warm golden afternoon sunlight** streaming through open door, warm fluorescent ceiling light — cozy warm shop atmosphere.

> **Character reference — Cô Tư (age-locked 35, Vietnamese nationality, Northern Vietnamese Bắc bộ)**:
> 35-year-old Vietnamese woman (Cô Tư, age-locked at 35), height 162cm, slim-to-medium build, smooth warm light-tan skin (NOT wrinkled, NOT weathered), long straight black hair in low casual ponytail (NOT gray-streaked, NOT elderly bun), bright sharp mischievous eyes (Northern Vietnamese women are famous for sharp clever eyes), clearly looks 35 — youthful energetic shopkeeper lady.

> **Character reference — Tí (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tí, age-locked at 13), skinny lanky child build, soft warm light beige cute-friendly skin, short black hair, typical Vietnamese rural boy facial features. Clearly looks 13.

> **Lighting**: warm fluorescent tube white light from ceiling + warm golden afternoon sunlight streaming through open door (right side) — bright warm kawaii cartoon grocery store atmosphere.

> **Aspect ratio**: 16:9 cinematic, **scene includes Cô Tư + Tí in action**.

---

## 📍 SCENE 3 — VƯỜN NHÀ: BỐ VÀ TÍ CÙNG LÀM VƯỜN

### 📄 `c1_bg_garden_father_working.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene "Bố Tí cầm cuốc, Tí nhổ cỏ phụ bố..."
**Nhân vật trong ảnh**: Bố Tí + Tí (2 người)
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc — y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:2.5** (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary.

> **Setting (kawaii cartoon environment + 2 characters — WARM COZY VILLAGE GARDEN, golden afternoon)**:
> Same Vietnamese countryside vegetable garden as `c1_bg_garden_empty.png`, **rendered in kawaii cartoon style with WARM LOVING aesthetic**. Rows of morning glory plants (rau muống) in cute wavy bright green, tomato plants with adorable tiny red tomatoes. A wooden hoe leaning against the bamboo fence. In the background: a charming Vietnamese countryside house with warm terracotta tile roof and cozy dirt yard. Tiny cute chickens pecking at the warm earth. A tall tree casting a long golden shadow across the garden. Bamboo fence enclosing the garden in warm tan tones. Distant lush green rice paddies and palm trees under a warm sky. **A 40-year-old Vietnamese man (Bố Tí)** standing tall and working — white sleeveless tank top with sweat stains, full-length ankle-length black cotton pants, white rubber sandals, handkerchief draped over shoulder, holding a wooden hoe mid-swing, **broad shoulders, tall lean build, V-shaped taper, deep tan brown skin, black hair with scattered silver streaks**. **A 13-year-old Vietnamese boy (Tí)** kneeling nearby pulling weeds, mustard yellow oversized t-shirt (hex #e5aa46), navy blue shorts (hex #424a61), white rubber sandals, looking exhausted and sweaty, shoulders slumped. **Warm golden afternoon sunlight** casting long golden shadows, dust motes floating like tiny golden sparkles — cozy Studio Ghibli golden hour atmosphere.

> **Character reference — Bố Tí (age-locked 40, Vietnamese nationality, Bắc Bộ)**:
> 40-year-old Vietnamese man (Bố Tí, age-locked at 40), height 175cm TALL with LONG LEGS (55% of height), Bắc Bộ Northern face — square jawline with full healthy flesh cheeks, NORMAL-sized sharp adult eyes (NOT big anime eyes), healthy-LEAN TONED TALL SLIM farmer build with BROAD SHOULDERS wider than hips creating clear V-taper, NARROWER slim waist, WASHBOARD-FLAT firm stomach with NO belly, deep tan brown weather-worn skin, BLACK hair with SCATTERED silver streaks (NOT all-gray, NOT all-silver), holding wooden hoe mid-swing.

> **Character reference — Tí (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tí, age-locked at 13), skinny lanky child build, soft warm light beige cute-friendly skin, short black hair, kneeling pulling weeds, exhausted expression, shoulders slumped.

> **Lighting**: warm golden hour sunlight from the side (left), long shadows stretching across the garden, dust particles in the sunbeams (tiny golden kawaii sparkles) — warm cozy late afternoon kawaii cartoon atmosphere.

> **Aspect ratio**: 16:9 cinematic, **scene includes Bố Tí + Tí in action**.

---

## 📍 SCENE 4 — SÂN TRƯỜNG: TÍ VÀ TÈO BUÔN THẺ BÀI

### 📄 `c1_bg_schoolyard_trade.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí và Tèo ngồi buôn thẻ bài, Tèo khoe thẻ hiếm
**Nhân vật trong ảnh**: Tí + Tèo (2 người)
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc — y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:2.5** (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary.

> **Setting (kawaii cartoon environment + 2 characters — WARM SUNNY VILLAGE SCHOOLYARD)**:
> Same rural Vietnamese lower-secondary schoolyard under mango tree as `c1_bg_schoolyard_empty.png`, **rendered in kawaii cartoon style with WARM LOVING aesthetic**. Warm-cream concrete wall with faded cheerful poster rectangles. Mango tree casting a dappled pattern of soft circular warm shadows on the warm terracotta brick floor. **Two 13-year-old Vietnamese boys sitting cross-legged** on the warm brick floor. **Tí** (left side of frame): mustard yellow oversized t-shirt (hex #e5aa46), navy blue shorts (hex #424a61), soft warm light beige cute-friendly skin, red canvas backpack on ground beside him — holding a thick stack of symbolic cartoon paper money bills (generic stylized green rectangles, NO real Vietnamese dong) fanned out in one hand, greedy smile, eyes darting suspiciously. **Tèo** (right side of frame): faded orange baggy shirt with cartoon print, denim shorts, slightly darker warm skin than Tí, tiny mohawk strip of hair, slightly rounded cute plump baby cheeks (NOT double chin, NOT fat), worn black sandals — holding a cardboard box labeled "QUÁI THÚ" with cute cartoon monster illustrations visible, mischievous sly grin, tucking bills into his pocket. A few tiny kawaii student figures in far background (blurred, decorative). **Warm bright tropical midday sunlight** — warm yellow-white light, soft warm shadows, vivid cheerful blue sky — cozy lively schoolyard atmosphere.

> **Character reference — Tí (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tí, age-locked at 13), skinny lanky child build, soft warm light beige cute-friendly skin, short black hair, greedy scheming expression. Clearly looks 13.

> **Character reference — Tèo (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tèo, age-locked at 13), slightly stockier build than Tí, warm mid-tone skin slightly darker than Tí, tiny mohawk strip of hair, slightly rounded cute plump baby cheeks (NOT chubby, NOT fat), mischievous sly grin. Clearly looks 13.

> **Lighting**: warm bright tropical midday sunlight — warm yellow-white light, soft warm simple shadows under the mango tree, vivid cheerful blue sky — **cozy lively warm schoolyard atmosphere** in kawaii cartoon style.

> **Aspect ratio**: 16:9 cinematic, **scene includes Tí + Tèo in action**.

---

## 📍 SCENE 5 — ĐƯỜNG LÀNG: TÍ VÀ HÙNG ĐUA XE ĐẠP

### 📄 `c1_bg_road_bike_race.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene Tí đuổi theo Hùng để ganh đua
**Nhân vật trong ảnh**: Tí + Hùng (2 người)
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc — y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:2.5** (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary.

> **Setting (kawaii cartoon environment + 2 characters — WARM GOLDEN COUNTRYSIDE ROAD, Studio Ghibli afternoon)**:
> Same Vietnamese countryside road as `c1_bg_road_empty.png`, **rendered in kawaii cartoon style with WARM LOVING aesthetic**. Narrow asphalt road lined with lush green rice paddies on both sides stretching to a warm golden horizon. Bamboo fences in warm tan tones and palm trees in mid-distance under a warm amber sky. **Side-view shot** showing two 13-year-old boys racing bicycles. **Hùng** (front, left side of frame): taller well-built, fairer skin than Tí, glossy black slicked-back hair, navy blue polo shirt with tiny horse logo, tan khaki shorts, brand-new white sneakers — astride a shiny brand-new **silver Martin 107 alloy-frame mountain bike** (simple kawaii cartoon bike shape, silver-gray with shiny highlights), disc brakes, riding confidently with smirk, chin tilted up, one hand resting on handlebar. **Tí** (behind, right side of frame): soft warm light beige cute-friendly skin, short black hair, mustard yellow oversized t-shirt (hex #e5aa46), navy blue shorts (hex #424a61), white rubber sandals, red canvas school backpack (hex #c83b3b) — pedaling desperately beside his **rusty old black single-speed bicycle** (simple kawaii cartoon bike shape, dark gray with rust-brown spots), worn tires, leaning forward intensely, face jealous and frustrated, eyes glued to Hùng's new bike. **Motion blur** on background (simple horizontal kawaii speed lines). **Warm late-afternoon golden hour sun** from behind, rim lighting on both characters, floating golden dust sparkles in the air.

> **Character reference — Tí (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tí, age-locked at 13), skinny lanky child build, soft warm light beige cute-friendly skin, short black hair, desperate jealous expression while cycling. Clearly looks 13.

> **Character reference — Hùng (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Hùng, age-locked at 13), taller well-built, fairer skin than Tí, glossy black slicked-back hair, smug confident smirk expression, brand-new bike. Clearly looks 13 (just taller/richer than Tí).

> **Lighting**: warm late-afternoon golden hour sun from behind (upper-right), rim lighting on both characters and bicycles creating golden outline, long shadows on the road surface, dust particles in the air (tiny golden kawaii sparkles).

> **Aspect ratio**: 16:9 cinematic side-view comparison, **scene includes Tí + Hùng in action**.

---

## 📍 SCENE 6 — CẦU BÊ TÔNG: TÍ BAY KHỎI XE ĐẠP

### 📄 `c1_bg_bridge_crash.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene đứt phanh — khoảnh khắc nguy hiểm nhất (khoảnh khắc đỉnh điểm)
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc — y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:2.5** (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary.

> **Setting (kawaii cartoon environment + 1 character — DRAMATIC COZY VILLAGE BRIDGE, Studio Ghibli moment)**:
> Same small concrete bridge as `c1_bg_bridge_empty.png`, **rendered in kawaii cartoon style with WARM DRAMATIC aesthetic**. The bridge is the central focus with strong perspective (leading lines converging toward center). **A 13-year-old Vietnamese boy (Tí)** is **mid-air** being thrown forward off his rusty old bicycle, face with **shocked scared kid expression** — eyes wide but **normal kawaii size** (NOT bug-eyed, NOT distorted), eyebrows raised in fear, small "aa!" open mouth (medium size, NOT gaping wide, NOT horror scream), **face stays cute round child proportions** consistent with all other Tí sprites. His **rusty old black bicycle** is tumbling separately in the air beside him (simple kawaii cartoon bike shape, dark gray, with broken handlebar visible). **The brake cable** is visibly snapped and dangling loose (simple orange-brown thin line). Below the bridge: a **warm splash of brown mud and water** erupting in the irrigation canal — simple kawaii cartoon splash shapes (warm brown and soft blue blobs). Lush green rice paddies on both sides stretching to a hazy warm sky. Palm trees, **soft white clouds** in hazy blue sky, a tiny cute water buffalo grazing in the far distance. **Motion blur and golden dust particles** (simple horizontal speed lines and tiny warm kawaii sparkles) suggesting violent motion — but in the warm cozy kawaii cartoon aesthetic.

> **Character reference — Tí (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tí, age-locked at 13), skinny lanky child build, soft warm light beige cute-friendly skin, short black hair, mid-air scared shocked expression — face proportions STAY NORMAL kawaii size (do NOT enlarge head, do NOT stretch face).

> **Lighting**: warm bright midday sunlight with slight golden overexposure to suggest urgency/drama, soft warm shadows on the bridge surface, warm golden tones throughout — **warm dramatic kawaii cartoon atmosphere**.

> **Aspect ratio**: 16:9 cinematic with strong leading lines, dynamic diagonal composition, dramatic freeze-frame feel, **scene includes Tí in action**.

---

## 📍 SCENE 7 — PHÒNG BỆNH: TÍ NẰM LIỆT GIƯỜNG HỐI HẬN

### 📄 `c1_bg_sickbed_ti_bedridden.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Cutscene kết Chương 1 — Tí nằm nhìn heo đất úp, miệng ngậm ngùi
**Nhân vật trong ảnh**: Tí (1 người)
**Aspect**: 16:9

> **STYLE TOKEN (bắt buộc — y hệt portrait sprite)**:
> Kawaii 2D cartoon style, Studio Ghibli x Sanrio x Doraemon-inspired cute proportions, **head-to-body ratio 1:2.5** (very large head, tiny body), very short stubby limbs, huge round sparkly eyes with two large white circle highlights, thick dark outlines, flat cel-shading with minimal gradients, soft pink blush circles on cheeks, soft cozy warm lighting, kid-friendly wholesome adorable vibe, cute Japanese kawaii illustration style, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT anime teen face, NOT mature face, NOT high-detail realistic skin, NOT 3D, NOT Pixar, NOT creepy, NOT scary.

> **Setting (kawaii cartoon environment + 1 character — COZY RURAL BEDROOM, warm melancholy like Studio Ghibli, MUST MATCH `c1_bg_sickbed_empty.png` EXACTLY, MUST BE HORIZONTAL 16:9 NOT VERTICAL)**:
> **CRITICAL CAMERA: WIDE-ANGLE HORIZONTAL INTERIOR SHOT — the camera is placed in the MIDDLE of the room, at normal eye level, looking STRAIGHT AHEAD — this is a FULL-ROOM wide shot, NOT a bedside close-up, NOT a close-up of the bed, NOT a zoomed-in portrait shot, NOT a vertical framing. The ENTIRE ROOM fills the 16:9 horizontal frame — all four walls, floor, ceiling, bed, desk, wardrobe, window, everything visible in ONE wide panoramic view. The character (Tí in bed) occupies only the MIDDLE-DISTANCE of the room, NOT the foreground, NOT dominating the frame. The room is WIDE and SPACIOUS in the frame, NOT compressed, NOT zoomed-in, NOT portrait crop. DO NOT make this a close-up of Tí's face or a zoomed-in bedside view — this is a full-room background with Tí visible inside it like a tiny figure in the room. Aspect ratio MUST be 16:9 HORIZONTAL (landscape) — the frame is WIDER than it is tall. NO vertical framing, NO portrait orientation, NO 9:16, NO close-up crop.**
> **WIDE-ANGLE INTERIOR SHOT, NO DOORWAY AT ALL** — the camera is **INSIDE the room**, NOT outside the door — there is **NO doorway, NO doorframe, NO door, NO wall edges, NO rectangular framing visible ANYWHERE in the image**. Same Vietnamese countryside cottage bedroom as `c1_bg_piggybank_room_empty.png` (BG1) AND `c1_bg_sickbed_empty.png` (BG8), **rendered in kawaii cartoon style with WARM COZY aesthetic** — must be the SAME ROOM, just with Tí now lying sick in bed. **ALL FOUR WALLS visible** with **floor and ceiling all visible** in a WIDE HORIZONTAL frame. **Ceiling** — warm honey-brown wooden beams crisscrossing overhead, a soft warm lantern (đèn lồng) hanging from the center beam on a thin string casting a warm golden-amber circle of light, plus **3-4 small folded paper airplanes** (máy bay giấy) tucked between the beams and **a small string of warm fairy lights** draped along the wooden beams. **Back wall** — smooth cream-white plastered wall (soft warm cream tones), the **small wooden bed** centered against this wall with a **pale blue mosquito net** (mùng xanh nhạt — boyish color, NOT pink, NOT cream) draped over four corner posts hanging softly like a tiny tent, soft white bedding with a folded **navy blue blanket** (boyish color, NOT cream) at the foot. Above the bed: a **small poster of a football/soccer star** (generic cartoon boy kicking a ball) and a tiny framed family photo. **Left wall** — a warm wooden desk/chair setup (bàn học nhỏ) — Tí's study area: a small stack of textbooks, a small pencil holder with several cartoon pencils, a small desk lamp with a blue shade, plus a small window with a soft blue curtain letting in **warm golden late-afternoon sunlight**. Above the desk: a small **framed poster of a Real Madrid football jersey** (áo đấu Real Madrid màu trắng, cartoon kawaii) and a tiny clock. **Right wall** — a simple **wooden wardrobe** (tủ quần áo) with warm wooden doors, a small hanging **folded paper plane mobile** (đàn máy bay giấy treo), a small **toy car** (ô tô đồ chơi nhỏ) on a tiny wall shelf, and a small **worn wooden cricket bat** (gậy cricket/đánh bóng) leaning in the corner. A small wooden **bedside table** next to the bed with a warm glowing dim lamp casting amber glow. **A small wooden chair** next to the bedside table with a small folded blanket on it. **On the bedside table — the BROKEN piggy bank**: a small **pink piggy bank (heo đất) split open into TWO HALVES**, broken apart, lying on its side with the crack visible down the center showing the empty hollow inside — the top half is separated from the bottom half, both halves resting on the bedside table like an overturned broken shell, a few tiny ceramic shard crumbs scattered beside it, the warm golden afternoon light catching the broken edges of the ceramic. **Floor** — warm honey-brown wooden floor with subtle plank lines, the warm lantern glow creating a golden-amber circle of light in the center, **warm golden late-afternoon sunlight** streaming diagonally across the floor from the right wall window. A small **toy robot figure** on the floor in the left corner, a small pair of **boyish cartoon sandals** (đôi dép nam) by the bed, a small **ball** (quả bóng nhỏ) on the floor near the desk. **Tí (a 13-year-old Vietnamese boy)** lying on his side on the bed, head on a small pillow near the bedside table, wearing **soft faded patient clothes** (simple light cream-gray cartoon shirt), **leg wrapped in white bandage** sticking out from under the **navy blue blanket** (boyish color, folded back at the foot, NOT cream, NOT pink). His **face** is thinner from sickness — still clearly Tí (same kawaii round proportions, head-to-body ratio 1:2.5, same soft warm light beige skin, huge round sparkly eyes with two white circle highlights) but with slightly drawn cheeks, eyes **teary and regretful**, looking toward the bedside table (toward the broken piggy bank) with a soft sad expression. The **broken piggy bank on the bedside table** is in clear view from Tí's line of sight — Tí is gazing at the source of his regret. NO people other than Tí in bed. NO DOORWAY, NO DOOR, NO DOORFRAME, NO WINDOW FRAME BORDER, NO ARCH, NO RECTANGULAR FRAMING visible anywhere. **Late afternoon golden sunlight** streaming through the soft blue curtain (NOT yellow), casting warm golden rays across the room. **This is a FULL-ROOM WIDE SHOT — the room is spacious and open, Tí is a small figure in the middle-distance of the room, NOT a close-up, NOT foreground-dominant, NOT zoomed-in.**

> **Character reference — Tí (age-locked 13, Vietnamese nationality)**:
> 13-year-old Vietnamese boy (Tí, age-locked at 13), thinner from sickness, soft warm light beige cute-friendly skin, short black hair, teary regretful expression lying in bed, leg bandaged, clearly looks 13. **Face proportions STAY NORMAL kawaii size** (do NOT distort face).

> **Lighting**: warm dim amber lamp light on the bedside table area + soft golden late-afternoon sunlight through the yellow curtain — warm melancholy quiet bedroom atmosphere in kawaii cartoon style.

> **Aspect ratio**: 16:9 cinematic, **scene includes Tí in bed**.

---

---

# 📋 BẢNG TỔNG HỢP

## Tất cả BG (không nhân vật) — 8 file
| # | Filename | Địa điểm | Thời gian | Loại scene VN | Aspect |
|---|---|---|---|---|---|
| BG1 | `c1_bg_piggybank_room_empty.png` | Phòng ngủ Tí | Đêm | `dialogue` | 16:9 |
| BG2 | `c1_bg_shop_interior_empty.png` | Tạp hóa Cô Tư (trong) | Trưa | `dialogue` | 16:9 |
| BG3 | `c1_bg_shop_overview.png` | Tạp hóa Cô Tư (ngoài) | Chiều tà | `narrator` tĩnh | 16:9 |
| BG4 | `c1_bg_garden_empty.png` | Vườn nhà | Chiều tà | `dialogue` | 16:9 |
| BG5 | `c1_bg_schoolyard_empty.png` | Sân trường | Trưa | `dialogue` | 16:9 |
| BG6 | `c1_bg_road_empty.png` | Đường làng | Chiều vàng | `dialogue` | 16:9 |
| BG7 | `c1_bg_bridge_empty.png` | Cầu bê tông | Trưa nắng | `dialogue` | 16:9 |
| BG8 | `c1_bg_sickbed_empty.png` | Phòng bệnh | Chiều tà | `dialogue` | 16:9 |

## Tất cả SCENE (có nhân vật) — 7 file
| # | Filename | Địa điểm | Nhân vật | Loại scene VN | Aspect |
|---|---|---|---|---|---|
| SC1 | `c1_bg_piggybank_moment.png` | Phòng ngủ Tí (đêm) | Tí (phá heo đất) | `narrator` | 16:9 |
| SC2 | `c1_bg_shop_counter_composite.png` | Tạp hóa Cô Tư (trưa) | Cô Tư + Tí | `narrator` | 16:9 |
| SC3 | `c1_bg_garden_father_working.png` | Vườn nhà (chiều tà) | Bố + Tí | `narrator` | 16:9 |
| SC4 | `c1_bg_schoolyard_trade.png` | Sân trường (trưa) | Tí + Tèo | `narrator` | 16:9 |
| SC5 | `c1_bg_road_bike_race.png` | Đường làng (chiều vàng) | Tí + Hùng | `narrator` | 16:9 |
| SC6 | `c1_bg_bridge_crash.png` | Cầu bê tông (trưa) | Tí (tai nạn) | `narrator` | 16:9 |
| SC7 | `c1_bg_sickbed_ti_bedridden.png` | Phòng bệnh (chiều tà) | Tí (liệt giường) | `narrator` | 16:9 |

## Tổng: 15 prompts (8 BG + 7 SCENE)

**Tổng cộng Chương 1: 46 prompts**
- 6 neutral portraits
- 24 emotion portraits
- 8 BG (trống)
- 7 SCENE (composite)
- 1 UI mockup

---

## 🔑 QUY TẮC STYLE BẮT BUỘC

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
- **NOT** realistic, semi-realistic, cinematic-photorealistic, anime-background, 3D, Pixar
- **NOT** high-detail realistic skin, realistic textures, photographic backgrounds

### Về SETTING (mô tả environment)
- Environment phải được mô tả bằng **ngôn ngữ kawaii cartoon**: "simple chunky rectangles", "cute wavy green lines", "soft brown texture dots", "tiny cartoon chickens"
- **KHÔNG** dùng ngôn ngữ realistic: "photorealistic brick wall", "weathered texture", "depth of field", "bokeh", "cinematic lighting ratio"

### Về NHÂN VẬT trong SCENE
- Dùng **CHÍNH XÁC** character reference giống portrait sprite (age-locked, full description)
- **Face proportions** phải giống portrait sprite — do NOT enlarge head, do NOT stretch face trong SCENE
- **Body** dùng head-to-body 1:2.5 kawaii proportions — not realistic figure proportions

### Về ASPECT RATIO
- Tất cả **BG**: 16:9 widescreen
- Tất cả **SCENE**: 16:9 cinematic
- **KHÔNG BAO GIỜ** dùng 3:4, 4:3, 1:1 cho BG/SCENE
