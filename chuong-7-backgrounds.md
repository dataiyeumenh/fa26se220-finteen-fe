# 🎬 CHƯƠNG 7 — BACKGROUND & SCENE PROMPTS

> **Mục đích**: Lập gia đình — Quản trị rủi ro & tài sản. Đồng bộ với `chuong-7-characters.md`. Các PNG dưới đây là **đầu ra dự kiến**, chưa phải ảnh đã tạo.
> **COPY-PASTE**: Mỗi khối prompt có đủ style, nhận diện/bối cảnh, ánh sáng, bố cục và negative; copy nguyên khối, không cần ghép mô tả từ prompt khác. Reference chỉ hỗ trợ nhất quán.

# 📖 CỐT TRUYỆN GỐC VÀ PHẠM VI

Nguồn ưu tiên: `D:\DO-AN\cot_truyen\mau\cot-truyen-hoan-chinh-v1.docx`, phần CHƯƠNG 7. Bible chỉ tham khảo tạo hình; giữ style earnest teen/adult 1:4–1:5 của các chương gần nhất, không quay lại chibi 1:2.5.

Chương có 3 nhiệm vụ, không có Life Event. Nhiệm vụ 1 là **đêm trước lễ cưới**, không phải sau lễ cưới. Nhiệm vụ 2 là phân tích khoản vay của hệ thống, không có thoại nhân viên tín dụng. Nhiệm vụ 3 diễn ra sau khi ổn định chỗ ở; không mặc định đã mua căn hộ 2 tỷ. Tí 30 tuổi và vợ 27 tuổi là mốc tạo hình theo bible; giờ/địa điểm nhiệm vụ 2–3 là lựa chọn dàn cảnh. Vợ mặc quần dài để thống nhất với bộ prompt gần nhất. Không thêm nốt ruồi mới cho Tí, không thêm cặp nhẫn trước lễ cưới; bỏ nhẫn nhất quán toàn bộ bộ ảnh chương này. Không vẽ chuyên gia mạng thành người đang ngồi cùng gia đình.

# 📐 KIẾN TRÚC VISUAL NOVEL

| Loại | Cách dùng | Chữ/số |
|---|---|---|
| Thoại / độc thoại | Sprite + BG không người đúng nơi, đúng thời điểm | UI game |
| Narrator | Composite có nhân vật; không ghép sprite chồng lên | UI game |
| Lựa chọn / mini-game | BG trống, điều khiển UI tương tác | Dữ liệu kịch bản/phiên chơi |
| Tiêu đề nhiệm vụ | Nền không người, bảng tiêu đề lớn chính giữa | Chỉ đúng tiêu đề trong prompt |
| Tổng kết | Tranh biểu tượng các bài học, trung tâm thoáng | Đúng ba dòng chữ trong prompt tổng kết |

Sprite nền trắng cần tách nền thành PNG trong suốt trước khi dùng. Tất cả người lớn mặc quần dài đến mắt cá. BG không có người, bóng người hay phản chiếu người; composite không cắt đầu/tay/chân bởi mép ảnh. Phòng bình dân sạch, nguyên vẹn. Không gen trạng thái lựa chọn đã hoàn tất trước khi người chơi chọn.

# 🔒 KHÓA STYLE VÀ LIÊN KẾT CẢNH — CHƯƠNG 7

**Style bắt buộc**: Mọi prompt bắt đầu phần style bằng **Kawaii 2D cartoon style**, dùng nét viền vừa, cel-shading mềm và tỷ lệ người lớn 1:4–1:5 như chương 6. Tổng kết cũng cùng nét vẽ này; chỉ bố cục biểu tượng khác cảnh gameplay.

| Chuỗi cảnh | Không gian / ánh sáng | Khóa nối cảnh |
|---|---|---|
| Tiêu đề NV1 → BG wedding_eve → scene wedding_eve | Phòng khách, đêm trước cưới; đèn phải, cửa sổ trái tối | Giữ nguyên phong bì, sổ, bàn ghế; scene chỉ thêm Tí bên trái và vợ tương lai bên phải sofa |
| Tiêu đề NV2 → BG housing → scene housing_dti | Cùng thiết kế phòng khách ở thời điểm bàn mua nhà; ánh sáng ngày từ trái | Bỏ phong bì, đặt laptop và tờ giới thiệu căn hộ; không tự xuất hiện nhân viên ngân hàng |
| Tiêu đề NV3 → BG portfolio → scene portfolio | Phòng khách theo cùng sơ đồ, buổi tối sau khi ổn định chỗ ở | Đổi đúng đạo cụ thành laptop, sổ và hai cốc; không suy ra quyền sở hữu căn hộ từ hình |
| Tổng kết | Tranh biểu tượng, không phải cảnh diễn biến mới | Nhắc lại hai túi tiền/quỹ chung, căn hộ mô hình và đa dạng hóa; giữ style, không mặc định nhánh thắng |

**Sơ đồ chung**: cửa sổ TRÁI → sofa tường SAU → bàn thấp GIỮA → bàn làm việc/tủ/đèn PHẢI → cửa vào SAU-PHẢI. Camera cố định ở góc trước-trái của phòng, nhìn chéo về sofa và tường phải; không lật gương, không đổi cửa sổ/cửa ra vào. Tí ngồi trái, vợ ngồi phải trong cả ba composite. Mỗi tiêu đề dùng đúng geometry/đạo cụ/giờ của BG nhiệm vụ đó.

**Reference**: Tạo và duyệt c7_bg_wedding_eve_empty.png trước để khóa kiến trúc; dùng ảnh này khi gen c7_bg_housing_empty.png và c7_bg_portfolio_empty.png. Mỗi composite/tiêu đề kèm đúng BG của nhiệm vụ; composite kèm c7_ti_thoughtful.png và c7_wife_warm.png đã duyệt để khóa nhận diện. Không dùng ảnh sai tuổi làm mẫu trang phục.

**Chuyển thời điểm**: NV1 là trước cưới; NV2 và NV3 là các mốc sau đó, không phải cùng một đêm. Dùng lời dẫn hiện có để chuyển mốc; không tự vẽ cưới, bàn giao nhà hoặc kết quả đầu tư. Trang phục và phụ kiện giữ theo bộ chuẩn trong file.

# 👕 NHẬN DIỆN, TRANG PHỤC VÀ REFERENCE

## Tí 30 tuổi — `ti`

a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

**Reference**: c6_ti_hopeful.png → c7_ti_thoughtful.png. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

## Vợ tương lai / vợ 27 tuổi — `wife`

a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

**Reference**: Tạo c7_wife_warm.png trước; dùng làm reference cho toàn bộ emotion và scene. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

# 🧩 SỐ LIỆU VÀ MAPPING NHIỆM VỤ

| Nhiệm vụ | Nội dung UI theo Word | Ràng buộc hình ảnh |
|---|---|---|
| 1 | A: gộp 100%, SAVINGS tăng tốc (nguồn không cho số), HAP -10. B: quỹ chung 70%, quỹ riêng 30%, HAP +20, FIQ +25, GOAL +5. | Không đóng dấu phương án đã chọn lên ảnh. |
| 2 | Tích lũy 600 triệu; căn hộ 2 tỷ; vay 1,4 tỷ/20 năm; thu nhập 30 triệu/tháng; trả 14 triệu/tháng, gần 47%. A: sở hữu nhà, RISK +70. B: căn nhỏ hơn hoặc tiếp tục thuê để tỷ lệ dưới 30%, FIQ +35, RISK +10, GOAL +5. | Không gen chìa khóa/nhà mới trước lựa chọn; không tự suy ra lãi suất từ số trả góp. |
| 3 | Vốn nhàn rỗi 200 triệu. A: all-in một mã nóng, nguồn ghi RISK max 90 và tài sản biến động. B: 50% trái phiếu, 30% ETF, 20% cổ phiếu tăng trưởng, FIQ +40, RISK +15. | Không dùng vốn 850 triệu, DCA 5 triệu/tháng hoặc năm 2031 từ bible cũ; không biến tăng trưởng trong kịch bản thành lợi nhuận bảo đảm. |

Số liệu này chép theo kịch bản game, không tự sửa logic hay bổ sung phép tính tài chính ngoài nguồn. Tên nhiệm vụ trên ảnh đánh số **1, 2, 3**, không dùng 7.1/7.2/7.3.

# PHẦN A — BG KHÔNG NHÂN VẬT

## BG1: Đêm trước lễ cưới — bàn chuyện quỹ chung

**Output**: `images/chuong-7/c7_bg_wedding_eve_empty.png`
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Chapter 7, Đêm trước lễ cưới — bàn chuyện quỹ chung. 

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: NIGHT BEFORE THE WEDDING, dark blue outside LEFT window, warm floor lamp from RIGHT, soft ceiling fill. On the central table: a modest stack of closed plain red envelopes with NO markings and a blank notebook with pen. Envelopes remain closed; no visible cash total or calculation. No completed wedding ceremony or already-taken wedding portrait.

COMPOSITION: Wide environment establishing shot, readable architecture and depth. Keep near-foreground LEFT and RIGHT areas clear for full-body dialogue sprites, no large blocking objects. Bottom 22% has subdued detail for game dialogue. No character-shaped emptiness painted as a silhouette. Screens, papers and brochures contain only abstract unreadable marks, no data or interaction controls.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## BG2: Phân tích khoản vay — ban ngày

**Output**: `images/chuong-7/c7_bg_housing_empty.png`
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Chapter 7, Phân tích khoản vay — ban ngày. 

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: DAYTIME at the later housing-planning discussion, soft daylight entering the LEFT window, lamps off. Central table: open plain laptop angled toward sofa, unmarked apartment brochure with simple abstract floor plan, blank paper and pen. No red envelopes, signed contract, keys, handover celebration or loan officer. The laptop is only an abstract neutral screen awaiting game UI.

COMPOSITION: Wide environment establishing shot, readable architecture and depth. Keep near-foreground LEFT and RIGHT areas clear for full-body dialogue sprites, no large blocking objects. Bottom 22% has subdued detail for game dialogue. No character-shaped emptiness painted as a silhouette. Screens, papers and brochures contain only abstract unreadable marks, no data or interaction controls.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## BG3: Bàn đầu tư — buổi tối

**Output**: `images/chuong-7/c7_bg_portfolio_empty.png`
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Chapter 7, Bàn đầu tư — buổi tối. 

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: EVENING after housing has stabilized, dark blue beyond LEFT window, warm RIGHT floor lamp and gentle screen fill. On central table: open plain laptop, closed notebook and two simple ceramic cups. No envelopes, property contract or apartment keys. Laptop has neutral unreadable blocks, no pie chart, selected allocation, rising profit graph or confirmed order. This setting supports both buying and continuing to rent.

COMPOSITION: Wide environment establishing shot, readable architecture and depth. Keep near-foreground LEFT and RIGHT areas clear for full-body dialogue sprites, no large blocking objects. Bottom 22% has subdued detail for game dialogue. No character-shaped emptiness painted as a silhouette. Screens, papers and brochures contain only abstract unreadable marks, no data or interaction controls.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

# PHẦN B — SCENE COMPOSITE CÓ NHÂN VẬT

**Cách tạo scene**: Đính kèm ảnh BG và nhân vật ghi dưới từng Output cùng prompt. Các ảnh nằm trong `images/chuong-7/`; nếu chưa có, tạo và duyệt theo phần A và `chuong-7-characters.md` trước. BG khóa góc máy, bố cục, ánh sáng, đạo cụ; ảnh nhân vật khóa mặt, tuổi và trang phục. Tư thế/biểu cảm theo scene, không mang nền trắng của sprite vào tranh. Scene đã có người, không ghép thêm sprite khi hiển thị.

## Scene 1: Đồng thuận dòng tiền

**Output**: `images/chuong-7/c7_scene_wedding_eve.png`
**Aspect**: 16:9

**Nhân vật cần cho vào**: Tí 30 tuổi và vợ tương lai 27 tuổi — đúng 2 người.
**Ảnh nhân vật cần đính kèm**: `c7_ti_thoughtful.png` và `c7_wife_warm.png`.
**Background cần đính kèm**: `c7_bg_wedding_eve_empty.png` — phòng khách đêm trước lễ cưới, phong bao đỏ trên bàn giữa.
**Bố trí và biểu cảm**: Tí ngồi trái sofa phía sau, vợ tương lai ngồi phải, mở một bàn tay trao đổi; Tí lắng nghe trầm ngâm. Chưa phân chia tiền hay tổ chức lễ cưới.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 7, Đêm trước lễ cưới — bàn chuyện quỹ chung. BEFORE the choice: Ti sits on the LEFT half of the BACK sofa, his future wife on the RIGHT half. Both calmly discuss the unmarked red envelopes on the central table. She gestures with one open palm; he listens thoughtfully, hands visible resting near his knees. No ring exchange, ceremony, completed allocation or argument.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: NIGHT BEFORE THE WEDDING, dark blue outside LEFT window, warm floor lamp from RIGHT, soft ceiling fill. On the central table: a modest stack of closed plain red envelopes with NO markings and a blank notebook with pen. Envelopes remain closed; no visible cash total or calculation. No completed wedding ceremony or already-taken wedding portrait.

CHARACTERS: Exactly 2 visible persons.

CHARACTER 1: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

CHARACTER 2: a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

ACTION AND PLACEMENT: BEFORE the choice: Ti sits on the LEFT half of the BACK sofa, his future wife on the RIGHT half. Both calmly discuss the unmarked red envelopes on the central table. She gestures with one open palm; he listens thoughtfully, hands visible resting near his knees. No ring exchange, ceremony, completed allocation or argument. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Scene 2: Cân nhắc khoản vay

**Output**: `images/chuong-7/c7_scene_housing_dti.png`
**Aspect**: 16:9

**Nhân vật cần cho vào**: Tí 30 tuổi và vợ 27 tuổi — đúng 2 người.
**Ảnh nhân vật cần đính kèm**: `c7_ti_thoughtful.png` và `c7_wife_warm.png`.
**Background cần đính kèm**: `c7_bg_housing_empty.png` — cùng phòng khách ban ngày, đèn tắt; laptop, tờ giới thiệu căn hộ, giấy và bút trên bàn.
**Bố trí và biểu cảm**: Tí ngồi trái sofa, vợ ngồi phải, cùng hơi nghiêng về laptop; Tí lo lắng, vợ chăm chú cân nhắc. Không thêm nhân viên tín dụng, hợp đồng đã ký hay chìa khóa nhà mới.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 7, Phân tích khoản vay — ban ngày. BEFORE deciding whether to buy: Ti sits LEFT and wife RIGHT on BACK sofa, both lean slightly toward the neutral laptop on the central table. Ti looks concerned, wife thoughtfully attentive; hands rest visibly beside the unmarked brochure. No loan officer, contract signing, keys, new home or predetermined choice.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: DAYTIME at the later housing-planning discussion, soft daylight entering the LEFT window, lamps off. Central table: open plain laptop angled toward sofa, unmarked apartment brochure with simple abstract floor plan, blank paper and pen. No red envelopes, signed contract, keys, handover celebration or loan officer. The laptop is only an abstract neutral screen awaiting game UI.

CHARACTERS: Exactly 2 visible persons.

CHARACTER 1: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

CHARACTER 2: a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

ACTION AND PLACEMENT: BEFORE deciding whether to buy: Ti sits LEFT and wife RIGHT on BACK sofa, both lean slightly toward the neutral laptop on the central table. Ti looks concerned, wife thoughtfully attentive; hands rest visibly beside the unmarked brochure. No loan officer, contract signing, keys, new home or predetermined choice. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Scene 3: Thảo luận đầu tư

**Output**: `images/chuong-7/c7_scene_portfolio.png`
**Aspect**: 16:9

**Nhân vật cần cho vào**: Tí 30 tuổi và vợ 27 tuổi — đúng 2 người.
**Ảnh nhân vật cần đính kèm**: `c7_ti_thoughtful.png` và `c7_wife_warm.png`.
**Background cần đính kèm**: `c7_bg_portfolio_empty.png` — cùng phòng khách buổi tối, đèn bên phải sáng; laptop, sổ đóng và hai cốc trên bàn.
**Bố trí và biểu cảm**: Tí ngồi trái sofa, mở bàn tay trao đổi; vợ ngồi phải lắng nghe, một tay cạnh sổ. Chưa chốt phân bổ hay thể hiện lợi nhuận.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 7, Bàn đầu tư — buổi tối. BEFORE choosing all-in or diversification: Ti sits LEFT and wife RIGHT on BACK sofa, calmly comparing possibilities on the neutral laptop. Ti gestures with an open palm; wife listens, one hand relaxed beside notebook. No visible allocation percentages, stock ticker, guaranteed return or successful-trade celebration.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: EVENING after housing has stabilized, dark blue beyond LEFT window, warm RIGHT floor lamp and gentle screen fill. On central table: open plain laptop, closed notebook and two simple ceramic cups. No envelopes, property contract or apartment keys. Laptop has neutral unreadable blocks, no pie chart, selected allocation, rising profit graph or confirmed order. This setting supports both buying and continuing to rent.

CHARACTERS: Exactly 2 visible persons.

CHARACTER 1: a 30-year-old Vietnamese man (Ti, age-locked 30), height 172 cm, healthy balanced adult build, warm light-beige skin, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, short black hair neatly combed back, very light neatly trimmed stubble. Preserve face, hairline and skin tone from the approved c6_ti_hopeful.png, aging him gently by four years; do not invent a new mole or redesign his face. Outfit: navy two-button suit jacket (#263b55), open, white long-sleeve dress shirt (#f5f5f0) with buttoned cuffs, wine-red tie (#702d40), matching navy full-length straight trousers reaching the ankles, black belt with small silver buckle, dark socks, black polished oxford shoes (#222222), modest round silver-case watch with black leather strap on LEFT wrist. No briefcase, logo or employee badge. No wedding ring in this chapter: the first scene occurs BEFORE the wedding, and the subsequent scenes keep this same simplified accessory design. Keep identical clothing colors and lengths in every portrait and composite.

CHARACTER 2: a 27-year-old Vietnamese woman (Ti's future wife / wife, age-locked 27), height 162 cm, healthy slim adult build, warm light-beige skin, oval face, medium dark-brown eyes, natural nose and lips, long dark-brown hair (#362820) parted on the left and falling just below the shoulders. Outfit: pastel-pink long-sleeve blouse (#e8bdc5), opaque cotton with a modest round neckline, buttoned cuffs, tucked into charcoal full-length straight trousers (#4a4a4a) reaching the ankles; plain cream closed-toe flat shoes (#e8dfcf), small pearl stud earrings. No skirt, high heels, handbag, logo or wedding ring. Keep this exact face, hair, clothing and accessories in every expression and scene; do not switch to a beige blouse at the housing discussion.

ACTION AND PLACEMENT: BEFORE choosing all-in or diversification: Ti sits LEFT and wife RIGHT on BACK sofa, calmly comparing possibilities on the neutral laptop. Ti gestures with an open palm; wife listens, one hand relaxed beside notebook. No visible allocation percentages, stock ticker, guaranteed return or successful-trade celebration. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

# PHẦN C — TIÊU ĐỀ NHIỆM VỤ VÀ TỔNG KẾT

Ngoại lệ chữ: ảnh tiêu đề có chữ lớn chính giữa; nền và composite khác không có chữ đọc được. Tên đầy đủ ở dưới, ngắt dòng chỉ để dễ đọc.

## Tiêu đề — Nhiệm vụ 1: Quản lý tài chính cặp đôi

**Output**: `images/chuong-7/bg_nhiem_vu_1.png`
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the exact specified Vietnamese title, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Chapter 7, Đêm trước lễ cưới — bàn chuyện quỹ chung. Entry to this mission BEFORE its interaction; preserve its setting and time.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: NIGHT BEFORE THE WEDDING, dark blue outside LEFT window, warm floor lamp from RIGHT, soft ceiling fill. On the central table: a modest stack of closed plain red envelopes with NO markings and a blank notebook with pen. Envelopes remain closed; no visible cash total or calculation. No completed wedding ceremony or already-taken wedding portrait.

TITLE COMPOSITION: Center a matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535), front-facing with no perspective skew. Panel about 76% of image width and 52% of image height. This is a graphic overlay, not a sign installed in the room. Keep landmarks visible around it. All letters at least 10% from image edges. Large bold storybook serif, dark brown (#3b2417), generous line spacing, complete Vietnamese diacritics. Render ONLY this exact text with these line breaks:

Nhiệm vụ 1:
Quản lý tài chính
cặp đôi

No-text rules for ordinary backgrounds do NOT apply to the specified title. No extra heading, English Mission label, subtitle, branch badge or caption. No cropped panel or letters.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. Only the specified title is readable; every prop remains unmarked.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: missing title, blank sign, misspelled Vietnamese, missing accents, wrong mission number, extra text, tiny lettering, overlapping or cropped title, people, silhouettes, human reflections, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Tiêu đề — Nhiệm vụ 2: Mua nhà & Đòn bẩy tài chính

**Output**: `images/chuong-7/bg_nhiem_vu_2.png`
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the exact specified Vietnamese title, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Chapter 7, Phân tích khoản vay — ban ngày. Entry to this mission BEFORE its interaction; preserve its setting and time.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: DAYTIME at the later housing-planning discussion, soft daylight entering the LEFT window, lamps off. Central table: open plain laptop angled toward sofa, unmarked apartment brochure with simple abstract floor plan, blank paper and pen. No red envelopes, signed contract, keys, handover celebration or loan officer. The laptop is only an abstract neutral screen awaiting game UI.

TITLE COMPOSITION: Center a matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535), front-facing with no perspective skew. Panel about 76% of image width and 52% of image height. This is a graphic overlay, not a sign installed in the room. Keep landmarks visible around it. All letters at least 10% from image edges. Large bold storybook serif, dark brown (#3b2417), generous line spacing, complete Vietnamese diacritics. Render ONLY this exact text with these line breaks:

Nhiệm vụ 2:
Mua nhà &
Đòn bẩy tài chính

No-text rules for ordinary backgrounds do NOT apply to the specified title. No extra heading, English Mission label, subtitle, branch badge or caption. No cropped panel or letters.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. Only the specified title is readable; every prop remains unmarked.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: missing title, blank sign, misspelled Vietnamese, missing accents, wrong mission number, extra text, tiny lettering, overlapping or cropped title, people, silhouettes, human reflections, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Tiêu đề — Nhiệm vụ 3: Phân bổ danh mục đầu tư

**Output**: `images/chuong-7/bg_nhiem_vu_3.png`
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the exact specified Vietnamese title, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Chapter 7, Bàn đầu tư — buổi tối. Entry to this mission BEFORE its interaction; preserve its setting and time.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese couple's living room, approximately 18 square meters, housing tenure deliberately unspecified (rented or owned). Camera INSIDE at adult eye level, wide view showing left, back and right walls and intact cream ceramic floor. LEFT: a rectangular window with intact white frame, pale-beige curtains and ordinary neighboring apartment buildings outside. BACK: a light-gray two-seat sofa against an unmarked warm-cream wall, a small open wooden shelf holding plain books and one green potted plant; no family photo, wedding portrait or child's toys. CENTER: a low rectangular medium-brown wooden coffee table with rounded corners, enough room to sit on the sofa behind it. RIGHT: a compact wooden desk and plain chair, closed storage cabinet, simple warm floor lamp beside the sofa. A closed brown entrance door is at the far-right rear edge. Everything affordable, intact, lightly used and tidy. No luxury penthouse, property deeds, new-house keys or ownership certificate. Keep window LEFT, sofa BACK, desk RIGHT in all versions; no mirrored floor plan. TIME: EVENING after housing has stabilized, dark blue beyond LEFT window, warm RIGHT floor lamp and gentle screen fill. On central table: open plain laptop, closed notebook and two simple ceramic cups. No envelopes, property contract or apartment keys. Laptop has neutral unreadable blocks, no pie chart, selected allocation, rising profit graph or confirmed order. This setting supports both buying and continuing to rent.

TITLE COMPOSITION: Center a matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535), front-facing with no perspective skew. Panel about 76% of image width and 52% of image height. This is a graphic overlay, not a sign installed in the room. Keep landmarks visible around it. All letters at least 10% from image edges. Large bold storybook serif, dark brown (#3b2417), generous line spacing, complete Vietnamese diacritics. Render ONLY this exact text with these line breaks:

Nhiệm vụ 3:
Phân bổ danh mục
đầu tư

No-text rules for ordinary backgrounds do NOT apply to the specified title. No extra heading, English Mission label, subtitle, branch badge or caption. No cropped panel or letters.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT room corner looking diagonally toward BACK sofa and RIGHT wall. Window stays LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Never mirror the layout. Ti occupies sofa LEFT and wife sofa RIGHT in composites. Empty BG, title and composite for a mission preserve identical furniture placement, lighting and props; composite only adds characters. For laptop scenes, the laptop sits centered on the low table, keyboard toward the sofa and screen facing the couple, rear lid toward foreground camera, no screen displayed toward the viewer. Their eyes, hands and screen orientation must agree.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. Only the specified title is readable; every prop remains unmarked.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: missing title, blank sign, misspelled Vietnamese, missing accents, wrong mission number, extra text, tiny lettering, overlapping or cropped title, people, silhouettes, human reflections, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## 🪧 TỔNG KẾT CHƯƠNG 7 — CÙNG XÂY NỀN TẢNG VỮNG BỀN

**Output**: `images/chuong-7/bg_tong_ket_chuong.png`
**Loại**: Tranh tổng kết biểu tượng, không nhân vật, 16:9 — 1920 × 1080.
**Dùng cho**: Nhìn lại ý nghĩa cả chương, dùng chung cho các nhánh.
**Ý nghĩa cần gợi**: Đồng thuận tài chính cặp đôi; sức chịu đựng khoản vay mua nhà; phân bổ và đa dạng hóa đầu tư.
**Thiết kế mới**: Cùng xây nền tảng vững bền. Tiêu đề và câu chốt ý đặt trên khoảng giấy sáng ở giữa; các cụm đồ vật kể lại bài học nằm quanh rìa. Không dùng bảng gỗ lớn che gần hết cảnh. Đây là tranh hồi tưởng mang tính biểu tượng, không phải cảnh mới xảy ra sau nhiệm vụ cuối.

```text
Create ONE beautifully composed 16:9 full-bleed illustrated chapter-recap card, target 1920 x 1080. This is a finished visual-novel chapter reflection illustration, not a slide template or a literal continuation of the last scene.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the three exact Vietnamese recap lines specified below, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. ENVIRONMENT-ONLY RECAP: no people, faces, hands, silhouettes or human reflections. Keep the same kawaii 2D cartoon outlines, object simplification and cel-shading as the gameplay backgrounds. Subtle paper texture only, not painterly realism.

CHAPTER MEANING: Two quiet curved paths converge into a shared planning surface, then branch into several balanced possibilities; cooperation and measured risk are the emotional center. The lesson is: Đồng thuận tài chính cặp đôi; sức chịu đựng khoản vay mua nhà; phân bổ và đa dạng hóa đầu tư. This meaning is visual direction; do not render that explanatory sentence as text.

COLOR STORY: warm ivory #f5ebdd, muted rose #c59a97, deep desaturated navy #586f85 and soft sage #91a18c. Use cream for most of the image, two main supporting hues, and only small warm accents. Richer colors belong to the outer object groups; central text sits against a quiet light field.

CUSTOM ILLUSTRATED MOTIFS AND PLACEMENT: LOWER LEFT: two plain closed coin pouches beside one shared unmarked household ledger, with two modest ceramic cups behind, representing personal autonomy and shared responsibilities without locking a 100% or 70/30 allocation. UPPER LEFT: one small apartment model on an unmarked planning sheet beside a modest savings jar, symbolizing affordability analysis, not an acquired property; no handover key, contract signature or housewarming. LOWER RIGHT: three equal-height small planting pots holding three different modest seedlings, next to three unmarked investment folders, a visual metaphor for diversification rather than guaranteed growth or exact allocation. UPPER RIGHT: a small simple balance scale standing level, with one plain pebble on each pan, suggesting measured household borrowing and risk, not a numeric DTI verdict.

BACKGROUND AND ATMOSPHERE: A barely visible sofa-back contour and a warm domestic window glow at the outer edges dissolve into paper. Two muted rose and navy lines gently join under the central title and continue toward the surrounding objects without crossing text. No wedding ceremony, no visible people and no luxury apartment.

COMPOSITION: One coherent illustration, not a grid or a set of cards. Arrange the specified object groups as an asymmetrical but balanced open wreath around a large central breathing space. Keep ALL objects outside the central text zone, approximately x=20-80% and y=28-65% of the canvas. Let the lower objects anchor the image, with lighter smaller accents above. Objects have consistent perspective and gentle contact shadows; no floating dashboard icons. Keep secondary details sparse, three depth levels at most. The light center has a soft irregular paper wash integrated into the artwork, NOT a rectangular parchment plaque, wooden sign, bordered box, ribbon banner or physical board. No hard frame around the image.

TEXT HIERARCHY AND EXACT VIETNAMESE COPY: Center-align the following three lines as one group, vertically centered around 46% of canvas height.
Line 1, modest chapter eyebrow, approximately 40 px at 1920 x 1080:
Tổng kết chương 7
Line 2, main meaning title, approximately 76 px, the largest text:
Cùng xây nền tảng vững bền
Line 3, supporting reflection, approximately 34 px:
Đồng thuận hôm nay, vững vàng ngày mai.

TYPOGRAPHY: Elegant bold readable storybook serif for the meaning title, simple clear medium-weight lettering for the chapter line and reflection. All text dark warm brown #3b3028 with strong contrast on light cream. Full accurate Vietnamese diacritics, no decorative strokes colliding with accents. Keep generous vertical gaps, at least 10% canvas-edge safety margin, no text touching objects. Main title must fit the central width; reduce it slightly only if needed, never crop it. These THREE specified lines are the ONLY readable text. All bills, books, screens, cards and calendars remain unmarked or abstract. No extra lesson labels or microtext.

NARRATIVE RULE: A thematic recap of learning, NOT a declared player achievement. No success badge, failure stamp, stars, grades, scores, balances, invented rates, selected choices, completed transaction or guaranteed outcome. Symbols show concepts explored in the chapter regardless of the chosen branches. 

ASPECT AND DELIVERY: ONE rectangular 16:9 PNG, 1920 x 1080, full bleed, no black margins. Artwork already includes the three specified text lines. No sprite or dialogue box should be layered over the finished card. If gameplay needs scores or detailed recap text, show them on a subsequent UI screen instead of covering this illustration.

NEGATIVE: huge wooden title panel, boxed parchment, generic last-room screenshot, slide deck, infographic grid, collage of screenshots, split-screen rooms, icon stickers, money rain, giant coin piles, glitter explosion, victory trophy, neon finance dashboard, upward profit arrow, confirmed outcome, people, faces, hands, silhouettes, readable prop labels, extra text, misspelled Vietnamese, missing accents, tiny captions, crowded center, overlapping lettering, cropped title, illegible calligraphy, watermark, logo, photorealism, 3D render, heavy black outlines, black borders.
```

**Kiểm tra riêng ảnh tổng kết**: Đủ 3 dòng chữ đúng dấu; bài học được gợi qua đồ vật; trung tâm thoáng; không có bảng gỗ che tranh; không thể hiện người chơi đã thắng/thua. Giữ màu sắc và nét vẽ đồng bộ cả bộ, nhưng bố cục đồ vật đúng riêng chương 7.


---

# 🧩 MAPPING HIỂN THỊ

| Đoạn | Ảnh / UI | Quy tắc |
|---|---|---|
| Nhiệm vụ 1 | `bg_nhiem_vu_1.png` → composite nhiệm vụ 1 → `c7_bg_wedding_eve_empty.png` + sprite / UI | Tiêu đề đúng địa điểm; composite không thêm sprite; UI mới hiển thị lựa chọn và kết quả. |
| Nhiệm vụ 2 | `bg_nhiem_vu_2.png` → composite nhiệm vụ 2 → `c7_bg_housing_empty.png` + sprite / UI | Tiêu đề đúng địa điểm; composite không thêm sprite; UI mới hiển thị lựa chọn và kết quả. |
| Nhiệm vụ 3 | `bg_nhiem_vu_3.png` → composite nhiệm vụ 3 → `c7_bg_portfolio_empty.png` + sprite / UI | Tiêu đề đúng địa điểm; composite không thêm sprite; UI mới hiển thị lựa chọn và kết quả. |
| Tổng kết | `bg_tong_ket_chuong.png` | Tranh biểu tượng về đồng thuận, sức vay và đa dạng hóa; không mặc định đầu tư thắng. |

# 📋 BẢNG TỔNG HỢP — 10 PROMPT

| File | Nội dung | Loại |
|---|---|---|
| `c7_bg_wedding_eve_empty.png` | BG1: Đêm trước lễ cưới — bàn chuyện quỹ chung | bg |
| `c7_bg_housing_empty.png` | BG2: Phân tích khoản vay — ban ngày | bg |
| `c7_bg_portfolio_empty.png` | BG3: Bàn đầu tư — buổi tối | bg |
| `c7_scene_wedding_eve.png` | Scene 1: Đồng thuận dòng tiền | scene |
| `c7_scene_housing_dti.png` | Scene 2: Cân nhắc khoản vay | scene |
| `c7_scene_portfolio.png` | Scene 3: Thảo luận đầu tư | scene |
| `bg_nhiem_vu_1.png` | Tiêu đề — Nhiệm vụ 1: Quản lý tài chính cặp đôi | title |
| `bg_nhiem_vu_2.png` | Tiêu đề — Nhiệm vụ 2: Mua nhà & Đòn bẩy tài chính | title |
| `bg_nhiem_vu_3.png` | Tiêu đề — Nhiệm vụ 3: Phân bổ danh mục đầu tư | title |
| `bg_tong_ket_chuong.png` | Tiêu đề — Tổng kết chương 7 | title |

**Tổng**: 3 BG trống + 3 composite + 3 tiêu đề nhiệm vụ + 1 tổng kết = **10 prompt**. Kết hợp **10 sprite** trong `chuong-7-characters.md`: **20 ảnh dự kiến**.

## Cây đầu ra

```text
images/chuong-7/
  c7_ti_thoughtful.png
  c7_ti_warm.png
  c7_ti_concerned.png
  c7_ti_tempted.png
  c7_ti_explaining.png
  c7_ti_determined.png
  c7_wife_warm.png
  c7_wife_explaining.png
  c7_wife_concerned.png
  c7_wife_reassuring.png
  c7_bg_wedding_eve_empty.png
  c7_bg_housing_empty.png
  c7_bg_portfolio_empty.png
  c7_scene_wedding_eve.png
  c7_scene_housing_dti.png
  c7_scene_portfolio.png
  bg_nhiem_vu_1.png
  bg_nhiem_vu_2.png
  bg_nhiem_vu_3.png
  bg_tong_ket_chuong.png
```

## Thứ tự tạo ảnh và kiểm tra

1. Tạo reference nhân vật trong file characters, khóa mặt, tuổi, màu đồ và phụ kiện; giữ quần dài.
2. Tạo BG đầu tiên; dùng ảnh đã duyệt hỗ trợ giữ vị trí cửa sổ trái, sofa sau, bàn phải giữa các giờ. Mỗi prompt vẫn đủ mô tả để dùng riêng.
3. Tạo các BG còn lại; kiểm tra không có người, phản chiếu người, chữ/số hay kết quả dựng sẵn.
4. Tạo composite kèm reference BG và nhân vật tương ứng; số người, tuổi, trang phục, thời điểm phải trùng prompt.
5. Tạo tiêu đề, kiểm tra đủ dấu tiếng Việt, số 1/2/3, chữ lớn ở giữa, không thiếu/cắt chữ. Tổng kết dùng tranh biểu tượng riêng, đủ ba dòng chữ và đồ vật gợi đúng bài học.
6. Kiểm tra giao diện không ghép sprite lên composite, không biến mini-game thành ảnh tĩnh; số liệu và kết quả do UI hiển thị.
