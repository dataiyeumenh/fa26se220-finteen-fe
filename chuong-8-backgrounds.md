# 🎬 CHƯƠNG 8 — BACKGROUND & SCENE PROMPTS

## Đọc trước khi tạo ảnh — phân biệt nền trống và scene

File này chứa **3 nền trống + 7 scene có người (3 nhiệm vụ + 4 ending) + 3 ảnh tiêu đề + 1 tranh tổng kết**, tổng cộng 14 ảnh. Chỉ phần A là background để ghép sprite. Phần B là tranh hoàn chỉnh đã có nhân vật; phần C là ảnh tiêu đề/tổng kết không người.

| Bộ ảnh | Background trống cần tạo | Điểm phân biệt | Scene có người dùng nền đó |
|---|---|---|---|
| Nhiệm vụ 1 | `c8_bg_insurance_empty.png` | Toàn cảnh phòng khách buổi tối; tablet và sổ trên bàn, không thảm chơi | `c8_scene_insurance_article.png`: thêm Tí 40 tuổi; chuyển tablet từ bàn sang tay Tí |
| Nhiệm vụ 2 | `c8_bg_education_empty.png` | Biến thể cùng phòng/góc máy, cuối chiều; thêm thảm chơi, thay tablet bằng laptop | `c8_scene_education_fund.png`: thêm Tí 40 tuổi và con 1 tuổi |
| Nhiệm vụ 3 | `c8_bg_fire_empty.png` | Góc máy gần bàn làm việc bên phải vào ban đêm, bỏ thảm và đồ chơi em bé | `c8_scene_fire_reflection.png`: thêm Tí 50 tuổi |
| Ending S | Không tạo BG riêng | Sân gỗ ven biển lúc nắng vàng | `c8_scene_ending_s.png`: đã có Tí 50 tuổi thảnh thơi |
| Ending A | Không tạo BG riêng | Hiên nhà nhìn ra vườn buổi sáng | `c8_scene_ending_a.png`: đã có Tí 50 tuổi an yên |
| Ending B | Không tạo BG riêng | Phòng làm việc nhỏ đêm khuya, bàn cũ và đèn bàn | `c8_scene_ending_b.png`: đã có Tí 50 tuổi còn làm việc |
| Ending C | Không tạo BG riêng | Phòng khách đơn sơ ban đêm, hóa đơn và khay tiền gần cạn | `c8_scene_ending_c.png`: đã có Tí 50 tuổi lo âu |

**Tránh tạo lại nền giống nhau**: Tạo BG1 trước; dùng ảnh đã duyệt để tạo biến thể BG2 và góc máy BG3 theo đúng thay đổi trong bảng. Khi tạo scene nhiệm vụ 1–3, dùng đúng BG đã duyệt làm nền và thêm nhân vật theo phần B. Bốn scene ending tạo trực tiếp cả bối cảnh lẫn Tí theo prompt, chỉ cần ảnh reference nhân vật. Ba ảnh `bg_nhiem_vu_*.png` dùng lại BG tương ứng để thêm tiêu đề, không phải ba địa điểm mới. Bốn ending là bốn nhánh khác nhau; game chỉ hiển thị một nhánh.

**Kiểm tra nền trống**: Tất cả file `c8_bg_*_empty.png` phải có **0 người**, kể cả em bé, tay, bóng người hoặc người trên màn hình. Khi tạo phần A, chỉ sao chép khối prompt BG tương ứng; không gửi kèm prompt scene hay ảnh reference nhân vật. Nếu ảnh nền đã sinh ra có người thì cần tạo lại hoặc xóa người trước khi dùng.

> **Mục đích**: Tương lai — Sau khi sinh con & Tự do tài chính. Đồng bộ với `chuong-8-characters.md`. Các PNG dưới đây là **đầu ra dự kiến**, chưa phải ảnh đã tạo.
> **COPY-PASTE**: Mỗi khối prompt có đủ style, nhận diện/bối cảnh, ánh sáng, bố cục và negative; copy nguyên khối, không cần ghép mô tả từ prompt khác. Reference chỉ hỗ trợ nhất quán.

# 📖 CỐT TRUYỆN GỐC VÀ PHẠM VI

Nguồn ưu tiên: `D:\DO-AN\cot_truyen\mau\cot-truyen-hoan-chinh-v1.docx`, phần CHƯƠNG 8 và HỆ THỐNG KẾT CỤC cuối tài liệu. Bible chỉ tham khảo tạo hình; giữ style earnest teen/adult 1:4–1:5 của các chương gần nhất, không quay lại chibi 1:2.5.

Chương có 3 nhiệm vụ, không có Life Event riêng. Nhiệm vụ 1 là **đọc bài báo rồi suy ngẫm**, không phải tai nạn xảy ra với Tí, không tự thêm đại lý bảo hiểm. Nhiệm vụ 2 có **con 1 tuổi**, còn 17 năm tới đại học. Chốt Tí **40 tuổi** ở nhiệm vụ 1–2 theo hướng tạo hình bible (Word không quy định tuổi cha ở hai nhiệm vụ này); con trai là lựa chọn tạo hình, Word chỉ ghi “con”. Nhiệm vụ 3 chốt **Tí 50 tuổi theo Word**. Sau đó chỉ hiện một ending phù hợp. Không mang sprite Tí 40t sang ending, không mang em bé 1t sang cảnh Tí 50t; không tự thêm vợ/con trưởng thành có thoại. Bộ ảnh ending tập trung Tí, phần con cháu kể bằng UI. Phần mô tả Mission 8.3 nêu S/A/C, nhưng mục HỆ THỐNG KẾT CỤC cuối Word bổ sung B và danh hiệu đầy đủ: dùng đủ S/A/B/C theo phần này.

# 📐 KIẾN TRÚC VISUAL NOVEL

| Loại | Cách dùng | Chữ/số |
|---|---|---|
| Thoại / độc thoại | Sprite + BG không người đúng nơi, đúng thời điểm | UI game |
| Narrator | Composite có nhân vật; không ghép sprite chồng lên | UI game |
| Ending | Một scene hoàn chỉnh của nhánh S/A/B/C, đã có Tí 50 tuổi; không ghép sprite | Lời kết, danh hiệu và điểm bằng UI trên scene |
| Lựa chọn / mini-game | BG trống, điều khiển UI tương tác | Dữ liệu kịch bản/phiên chơi |
| Tiêu đề nhiệm vụ | Nền không người, bảng tiêu đề lớn chính giữa | Chỉ đúng tiêu đề trong prompt |
| Tổng kết | Tranh biểu tượng các bài học, trung tâm thoáng | Đúng ba dòng chữ trong prompt tổng kết |

Sprite nền trắng cần tách nền thành PNG trong suốt trước khi dùng. Tất cả người lớn mặc quần dài đến mắt cá. BG không có người, bóng người hay phản chiếu người; composite không cắt đầu/tay/chân bởi mép ảnh. Phòng bình dân sạch, nguyên vẹn. Không gen trạng thái lựa chọn đã hoàn tất trước khi người chơi chọn.

# 🔒 KHÓA STYLE VÀ LIÊN KẾT CẢNH — CHƯƠNG 8

**Style bắt buộc**: Mọi prompt có **Kawaii 2D cartoon style** đúng hệ nét viền vừa và cel-shading mềm của chương 6–7. Người lớn giữ 1:4–1:5; em bé đúng 1 tuổi dùng tỷ lệ trẻ nhỏ tự nhiên, không ép tỷ lệ người lớn. Tổng kết, BG và ending cùng phong cách, không chuyển sang tranh bán hiện thực.

| Chuỗi cảnh | Không gian / ánh sáng | Khóa nối cảnh |
|---|---|---|
| Tiêu đề NV1 → BG insurance → scene insurance_article | Phòng khách gia đình, tối; Tí 40t đọc bài báo | Cửa sổ trái, sofa sau, bàn thấp giữa; tablet và sổ không đổi giữa BG và scene |
| Tiêu đề NV2 → BG education → scene education_fund | Chính phòng khách đó, cuối chiều; con 1t, Tí 40t | Chỉ đổi giờ/đạo cụ: thêm thảm chơi, laptop và con; không thay cấu trúc phòng hay tuổi con thành 3t |
| Chuyển mốc → tiêu đề NV3 → BG fire → scene fire_reflection | Tí 50t, buổi tối; góc bàn làm việc PHẢI của phòng gia đình | Đây là đổi góc camera sau bước nhảy tuổi; giữ cửa sổ trái, sofa sau, bàn phải, tủ và cửa sau-phải |
| Tổng kết → đúng một ending | Tổng kết biểu tượng trước phân loại; ending sau phân loại | S/A/B/C là bốn nhánh loại trừ nhau, không phải bốn cảnh xảy ra lần lượt |
| Scene ending S/A/B/C | Mỗi nhánh là một tranh hoàn chỉnh có Tí 50 tuổi và bối cảnh riêng | Tạo trực tiếp scene, không tạo BG ending riêng; lời kết và danh hiệu hiển thị bằng UI, không ghép sprite |

**Kế thừa không gian**: Dùng c7_bg_portfolio_empty.png đã duyệt làm reference kiến trúc cho phòng gia đình chương 8. Giữ cửa sổ TRÁI, sofa SAU, bàn thấp GIỮA, bàn làm việc/tủ/đèn PHẢI và cửa SAU-PHẢI. Thêm giỏ đồ chơi là thay đổi đời sống có chủ đích, không tự biến thành căn hộ sang trọng. NV1–2 giữ camera góc trước-trái; NV3 đổi sang góc gần bàn thấp nhìn về bàn làm việc phải, vẫn thấy các mốc kiến trúc để nhận ra cùng nhà.

**Reference theo nhiệm vụ**: c8_bg_insurance_empty.png là mẫu phòng; c8_bg_education_empty.png giữ geometry và đổi ánh sáng/đạo cụ. c8_bg_fire_empty.png dùng cả hai để giữ kiến trúc ở góc máy mới. Scene/tiêu đề nhiệm vụ 1–3 dùng BG tương ứng; scene ending tạo trực tiếp theo bối cảnh trong prompt. Nhân vật: c8_ti40_thoughtful.png cho NV1–2, c8_child1_happy.png chỉ cho NV2, c8_ti50_reflective.png cho NV3 và ending; khuôn mặt già đi có kiểm soát, không thay người.

**Mốc tuổi**: Trước NV3 phải có chuyển thời gian rõ sang 50 tuổi theo nguồn. Không đưa em bé 1 tuổi sang mốc này. Nếu sau này bổ sung con ở mốc 50 tuổi thì cần thiết kế tuổi tương ứng riêng; bộ hiện tại không thêm nhân vật đó. Ending A/B/C tái dùng chi tiết nội thất gia đình khi phù hợp; S là địa điểm du lịch mới được phép xuất hiện sau khi nhánh S được chọn.

# 👕 NHẬN DIỆN, TRANG PHỤC VÀ REFERENCE

## Tí 40 tuổi — `ti40`

a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

**Reference**: c7_ti_thoughtful.png → c8_ti40_thoughtful.png. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

## Con 1 tuổi — `child1`

a 1-year-old Vietnamese baby (Ti's child, visual design chosen as a boy, age-locked one year), healthy natural infant proportions, warm light-beige skin, soft naturally rounded cheeks without painted blush circles, small dark-brown eyes, fine short black hair. Pale-yellow long-sleeve cotton top (#f1d985), pale-yellow full-length soft trousers covering the ankles, cream socks, no shoes or jewelry. Sitting securely with both legs and hands visible, or supported safely on the father's lap; never standing unsupported, never depicted as a three-year-old. Natural infant head-to-body ratio about 1:3 to 1:4, not adult 1:5 and not exaggerated chibi. Keep identical appearance and clothes in sprite and education scene.

**Reference**: Tạo c8_child1_happy.png trước; dùng lại trong composite nhiệm vụ 2. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

## Tí 50 tuổi — `ti50`

a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

**Reference**: c8_ti40_thoughtful.png → c8_ti50_reflective.png. Chỉ dùng ảnh reference khi đã có và đã duyệt; tên file không khẳng định ảnh đang tồn tại.

# 🧩 SỐ LIỆU VÀ MAPPING NHIỆM VỤ

| Nhiệm vụ | Nội dung UI theo Word | Ràng buộc hình ảnh |
|---|---|---|
| 1 | Đọc khái niệm Premium / Deductible. A: mua bảo hiểm sức khỏe và bảo vệ thu nhập, WEALTH giảm tiền phí hằng năm chưa định lượng, RISK về 0, HAP +30. B: dùng tiền đầu tư lướt sóng, RISK +80. | Giữ đây là cơ chế kịch bản; không tự đặt phí, mức khấu trừ, quyền lợi hoặc vẽ hợp đồng đã ký trước lựa chọn. |
| 2 | Con 1 tuổi; còn 17 năm tới đại học; áp dụng Quy tắc 72 và thiết lập trích quỹ học vấn hằng tháng; FIQ +40, GOAL +10. | Nguồn chưa cho lãi suất, tiền trích, học phí, số dư hay đáp án cụ thể; không tự bịa để in lên hình. UI tương tác nằm ngoài ảnh. |
| 3 | Tí 50 tuổi; hệ thống đọc WEALTH, SAVINGS, FIQ, HAP, RISK, GOAL của cả 8 chương. | Biểu đồ lịch sử và số liệu dùng dữ liệu phiên chơi, không vẽ đường tăng trưởng giả hay chọn trước ending S. |

Số liệu này chép theo kịch bản game, không tự sửa logic hay bổ sung phép tính tài chính ngoài nguồn. Tên nhiệm vụ trên ảnh đánh số **1, 2, 3**, không dùng 8.1/8.2/8.3.

# PHẦN A — BG KHÔNG NHÂN VẬT

## BG1: Đọc bài báo về rủi ro — buổi tối

**Output**: `images/chuong-8/c8_bg_insurance_empty.png`
**Loại ảnh**: BG TRỐNG — 0 nhân vật; dùng để ghép sprite/UI.
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: 2D cartoon environment illustration with Ghibli-inspired everyday warmth, medium-thickness outlines, simplified coherent objects, soft cel-shading with gentle gradients, warm natural lighting, consistent with the approved Chapter 8 backgrounds. Environment and objects ONLY. No people, bodies, faces, hands, silhouettes, human reflections, portraits or people on screens. No photorealism, 3D, chibi characters, watermark or logo. No readable text.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Evening family living room prepared for the insurance-reading mission. The room is unoccupied.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese family living room, approximately 18 square meters. Camera INSIDE, wide eye-level view of left, back and right walls and intact cream ceramic floor. LEFT: rectangular white-framed window, pale-beige curtains, ordinary neighboring apartment buildings. BACK: light-gray two-seat sofa against warm-cream wall, small open wooden shelf with plain books and green plant. CENTER: low rounded-corner medium-brown wooden coffee table, generous clear floor space. RIGHT: compact wooden desk and chair, closed storage cabinet, warm floor lamp beside sofa. Closed brown entrance door at far-right rear. One small woven basket of unbranded soft toys near the cabinet, away from the walkway. Clean and intact, ordinary means, no symbols proving a purchased house or successful investment. The geometry continues the Chapter 7 family room as a production continuity choice; no extra move or home purchase is implied. TIME: EVENING near the start of parenthood, dark blue outside LEFT window, warm RIGHT floor lamp and gentle ceiling fill. Central table holds a plain tablet with unreadable article blocks and a closed notebook. No accident, funeral, hospital equipment, insurance agent or signed policy. The article is a subject for reflection, not an event happening to this family.

COMPOSITION: Wide environment establishing shot, readable architecture and depth. Keep near-foreground LEFT and RIGHT areas clear for full-body dialogue sprites, no large blocking objects. Bottom 22% has subdued detail for game dialogue. No character-shaped emptiness painted as a silhouette. Screens, papers and brochures contain only abstract unreadable marks, no data or interaction controls.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT family-room corner: window LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Match the approved background for this mission. Preserve architecture, light and props. All chairs, sofa and floor areas are unoccupied. Do not add any person.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: people, adults, children, babies, faces, hands, bodies, silhouettes, human reflections, portraits, readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## BG2: Quỹ giáo dục — con 1 tuổi

**Output**: `images/chuong-8/c8_bg_education_empty.png`
**Loại ảnh**: BG TRỐNG — 0 nhân vật; dùng để ghép sprite/UI.
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: 2D cartoon environment illustration with Ghibli-inspired everyday warmth, medium-thickness outlines, simplified coherent objects, soft cel-shading with gentle gradients, warm natural lighting, consistent with the approved Chapter 8 backgrounds. Environment and objects ONLY. No people, bodies, faces, hands, silhouettes, human reflections, portraits or people on screens. No photorealism, 3D, chibi characters, watermark or logo. No readable text.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Late-afternoon family living room prepared for the education-planning mission. The play mat is empty; no adult or infant is present.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese family living room, approximately 18 square meters. Camera INSIDE, wide eye-level view of left, back and right walls and intact cream ceramic floor. LEFT: rectangular white-framed window, pale-beige curtains, ordinary neighboring apartment buildings. BACK: light-gray two-seat sofa against warm-cream wall, small open wooden shelf with plain books and green plant. CENTER: low rounded-corner medium-brown wooden coffee table, generous clear floor space. RIGHT: compact wooden desk and chair, closed storage cabinet, warm floor lamp beside sofa. Closed brown entrance door at far-right rear. One small woven basket of unbranded soft toys near the cabinet, away from the walkway. Clean and intact, ordinary means, no symbols proving a purchased house or successful investment. The geometry continues the Chapter 7 family room as a production continuity choice; no extra move or home purchase is implied. TIME: LATE AFTERNOON during Mission 2, soft golden daylight enters from LEFT, lamps off. A clean cream padded play mat lies on the central floor beside the sofa. Laptop and closed notebook are on the low table safely beyond infant reach; no cords, hot drinks or sharp objects within reach. Laptop contains abstract unreadable blocks, no confirmed savings plan or fixed balance. The play mat is empty. Do not depict a child.

COMPOSITION: Wide environment establishing shot, readable architecture and depth. Keep near-foreground LEFT and RIGHT areas clear for full-body dialogue sprites, no large blocking objects. Bottom 22% has subdued detail for game dialogue. No character-shaped emptiness painted as a silhouette. Screens, papers and brochures contain only abstract unreadable marks, no data or interaction controls.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT family-room corner: window LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Match the approved background for this mission. Preserve architecture, light and props. All chairs, sofa and floor areas are unoccupied. Do not add any person.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: people, adults, children, babies, faces, hands, bodies, silhouettes, human reflections, portraits, readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## BG3: Nhìn lại hành trình — Tí 50 tuổi

**Output**: `images/chuong-8/c8_bg_fire_empty.png`
**Loại ảnh**: BG TRỐNG — 0 nhân vật; dùng để ghép sprite/UI.
**Aspect**: 16:9

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: 2D cartoon environment illustration with Ghibli-inspired everyday warmth, medium-thickness outlines, simplified coherent objects, soft cel-shading with gentle gradients, warm natural lighting, consistent with the approved Chapter 8 backgrounds. Environment and objects ONLY. No people, bodies, faces, hands, silhouettes, human reflections, portraits or people on screens. No photorealism, 3D, chibi characters, watermark or logo. No readable text.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Nighttime desk corner in the same family living room, ten years later. The chair and room are unoccupied.

SETTING, GEOMETRY, PROPS AND LIGHTING: The RIGHT-side study desk of the established Vietnamese FAMILY LIVING ROOM, at NIGHT, ten years after the earlier missions. This is a closer camera angle within the same room, NOT a separate new study. Camera near the central coffee table looking diagonally toward the RIGHT wall desk; preserve room coordinates. LEFT background: the familiar white-framed window with pale-beige curtain and dark blue night beyond. BACK-left background: recognizable portion of the light-gray two-seat sofa against cream wall and its small open wooden shelf with plain books and green plant. RIGHT main focus: the same compact medium-brown wooden desk and plain chair, closed storage cabinet and warm floor lamp; closed brown entrance door remains at far-right rear. Central coffee table edge appears in the lower-left foreground. Cream ceramic floor unchanged. Remove the infant play mat and visible infant toys at this later age. Desk holds a plain laptop, a warm task lamp at back-right, ceramic cup, capped pen and closed unmarked notebook. The EMPTY chair faces the desk; laptop keyboard is immediately in front of the empty chair, with its screen facing that chair. Camera sees a narrow side/rear angle of the laptop. No person is seated here. Clean modest intact furnishings; no property deeds, trophies, debt notices or wealth indicators. Warm task light, soft floor-lamp fill and subtle cool screen light; reflective neutral mood before scoring.

COMPOSITION: Wide environment establishing shot, readable architecture and depth. Keep near-foreground LEFT and RIGHT areas clear for full-body dialogue sprites, no large blocking objects. Bottom 22% has subdued detail for game dialogue. No character-shaped emptiness painted as a silhouette. Screens, papers and brochures contain only abstract unreadable marks, no data or interaction controls.

CAMERA AND MATCHING SHOT LOCK: Closer view from near the central coffee table toward the RIGHT desk. Retain the LEFT window and BACK-left sofa landmarks; do not revert to the wide sofa-centered view. Match the approved background for this mission. Preserve architecture, light and props. All chairs, sofa and floor areas are unoccupied. Do not add any person.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: people, adults, children, babies, faces, hands, bodies, silhouettes, human reflections, portraits, readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

# PHẦN B — SCENE COMPOSITE CÓ NHÂN VẬT

**Cách tạo scene**: Với 3 scene nhiệm vụ, đính kèm ảnh BG và nhân vật ghi dưới từng Output cùng prompt. Với 4 scene ending, chỉ đính kèm reference nhân vật; bối cảnh được tạo trực tiếp từ mô tả đầy đủ trong prompt, không cần ảnh BG ending riêng. Các ảnh nằm trong `images/chuong-8/`; nếu chưa có, tạo và duyệt theo phần A và `chuong-8-characters.md` trước. BG khóa góc máy, bố cục, ánh sáng, đạo cụ; ảnh nhân vật khóa mặt, tuổi và trang phục. Tư thế/biểu cảm theo scene, không mang nền trắng của sprite vào tranh. Với ending, hai ảnh Tí là reference của cùng một người, không tạo hai Tí. Scene đã có người, không ghép thêm sprite khi hiển thị.

## Scene 1: Suy ngẫm sau bài báo

**Output**: `images/chuong-8/c8_scene_insurance_article.png`
**Loại ảnh**: SCENE CÓ NHÂN VẬT — tranh hoàn chỉnh, không dùng làm BG trống.
**Aspect**: 16:9

**Nhân vật cần cho vào**: Chỉ Tí 40 tuổi — đúng 1 người.
**Ảnh nhân vật cần đính kèm**: `c8_ti40_thoughtful.png`.
**Background cần đính kèm**: `c8_bg_insurance_empty.png` — phòng khách gia đình buổi tối, BG đọc bài báo về rủi ro.
**Bố trí và biểu cảm**: Tí ngồi sofa phía sau, cầm tablet bằng hai tay, nhìn bài báo với vẻ suy ngẫm và lo xa. Không thêm vợ, con hay nhân viên bảo hiểm.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 8, Đọc bài báo về rủi ro — buổi tối. BEFORE the insurance choice: Ti40 sits on BACK sofa, holding a plain tablet safely in both hands, gaze lowered toward unreadable article blocks, thoughtful concerned expression. He is reflecting on another family's risk described in an article. No injury, grieving relative, insurance salesperson, child in danger or signed policy.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese family living room, approximately 18 square meters. Camera INSIDE, wide eye-level view of left, back and right walls and intact cream ceramic floor. LEFT: rectangular white-framed window, pale-beige curtains, ordinary neighboring apartment buildings. BACK: light-gray two-seat sofa against warm-cream wall, small open wooden shelf with plain books and green plant. CENTER: low rounded-corner medium-brown wooden coffee table, generous clear floor space. RIGHT: compact wooden desk and chair, closed storage cabinet, warm floor lamp beside sofa. Closed brown entrance door at far-right rear. One small woven basket of unbranded soft toys near the cabinet, away from the walkway. Clean and intact, ordinary means, no symbols proving a purchased house or successful investment. The geometry continues the Chapter 7 family room as a production continuity choice; no extra move or home purchase is implied. TIME: EVENING near the start of parenthood, dark blue outside LEFT window, warm RIGHT floor lamp and gentle ceiling fill. The central table holds a closed notebook. The single tablet from the empty background is now in Ti's hands; do not duplicate it on the table. No accident, funeral, hospital equipment, insurance agent or signed policy. The article is a subject for reflection, not an event happening to this family.

CHARACTERS: Exactly 1 visible person.

CHARACTER 1: a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

ACTION AND PLACEMENT: BEFORE the insurance choice: Ti40 sits on BACK sofa, holding a plain tablet safely in both hands, gaze lowered toward unreadable article blocks, thoughtful concerned expression. He is reflecting on another family's risk described in an article. No injury, grieving relative, insurance salesperson, child in danger or signed policy. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

CAMERA AND MATCHING SHOT LOCK: Missions 1-2 use fixed eye-level camera at the FRONT-LEFT family-room corner: window LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Mission 3 uses the specified closer view of that RIGHT desk, retaining visible window/sofa landmarks and room coordinates. Do not mirror, relocate doors or introduce a new room. Within each mission, empty BG, title and composite match light and props exactly; composite only adds the specified people. Laptop screen always faces its seated user, keyboard within reach; show rear/side to camera when camera is opposite the user. Age transition to 50 happens before Mission 3; no one-year-old child at that time.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Scene 2: Nhìn con và nghĩ về học vấn

**Output**: `images/chuong-8/c8_scene_education_fund.png`
**Loại ảnh**: SCENE CÓ NHÂN VẬT — tranh hoàn chỉnh, không dùng làm BG trống.
**Aspect**: 16:9

**Nhân vật cần cho vào**: Tí 40 tuổi và con 1 tuổi — đúng 2 người.
**Ảnh nhân vật cần đính kèm**: `c8_ti40_thoughtful.png` và `c8_child1_happy.png`.
**Background cần đính kèm**: `c8_bg_education_empty.png` — phòng khách có thảm chơi màu kem; laptop trên bàn thấp ngoài tầm với của bé. Giữ ánh sáng và đạo cụ của BG2.
**Bố trí và biểu cảm**: Tí ngồi trên thảm lệch trái tâm, bé ngồi vững ngay bên phải trong tầm tay bố; bố cười trìu mến, một tay gần bé để hỗ trợ. Không thêm mẹ, không vẽ bé lớn hơn 1 tuổi.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired, matching the established chapter art. MEDIUM-thickness outlines, soft flat cel-shading with gentle gradients, warm natural soft lighting, natural medium-sized eyes with one small highlight, no painted kawaii blush circles. Natural ONE-YEAR-OLD infant anatomy, head-to-body ratio about 1:3 to 1:4; adult 1:4 to 1:5 proportions apply only to adult characters. No exaggerated chibi head, no photorealism, no semi-realism, no 3D, no text, no watermark. Father uses established adult proportions 1:4 to 1:5 and natural mature facial anatomy; only the infant uses infant proportions..

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 8, Quỹ giáo dục — con 1 tuổi. Ti40 sits on the cream play mat LEFT of center with knees naturally bent and both feet in frame. His ONE-YEAR-OLD child sits securely on the mat immediately RIGHT of him, within his reach, happily looking up. Father smiles tenderly, one hand resting near child for support, other on his own knee. The laptop stays on the central low table behind and beyond baby reach, abstract display only. No confirmed transfer or preset fund balance.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese family living room, approximately 18 square meters. Camera INSIDE, wide eye-level view of left, back and right walls and intact cream ceramic floor. LEFT: rectangular white-framed window, pale-beige curtains, ordinary neighboring apartment buildings. BACK: light-gray two-seat sofa against warm-cream wall, small open wooden shelf with plain books and green plant. CENTER: low rounded-corner medium-brown wooden coffee table, generous clear floor space. RIGHT: compact wooden desk and chair, closed storage cabinet, warm floor lamp beside sofa. Closed brown entrance door at far-right rear. One small woven basket of unbranded soft toys near the cabinet, away from the walkway. Clean and intact, ordinary means, no symbols proving a purchased house or successful investment. The geometry continues the Chapter 7 family room as a production continuity choice; no extra move or home purchase is implied. TIME: LATE AFTERNOON during Mission 2, soft golden daylight enters from LEFT, lamps off. A clean cream padded play mat lies on the central floor beside the sofa. Laptop and closed notebook are on the low table safely beyond infant reach; no cords, hot drinks or sharp objects within reach. Laptop contains abstract unreadable blocks, no confirmed savings plan or fixed balance. The child is one year old in this scene.

CHARACTERS: Exactly 2 visible persons.

CHARACTER 1: a 40-year-old Vietnamese man (Ti, age-locked 40), height 172 cm, healthy average build, warm light-beige skin, the recognizable slightly elongated face, dark-brown medium eyes and hairline of approved c7_ti_thoughtful.png, gently aged with faint crow's-feet and a few gray strands at the temples, short neatly combed black hair, light trimmed stubble. Outfit: slate-blue short-sleeve polo (#516b82), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt and closed brown loafers (#694735), beige socks, round silver-case watch with black leather strap on LEFT wrist. No jacket, tie, logo or new jewelry. No frailty, deep wrinkles or redesigned face. Keep outfit unchanged between insurance and education scenes.

CHARACTER 2: a 1-year-old Vietnamese baby (Ti's child, visual design chosen as a boy, age-locked one year), healthy natural infant proportions, warm light-beige skin, soft naturally rounded cheeks without painted blush circles, small dark-brown eyes, fine short black hair. Pale-yellow long-sleeve cotton top (#f1d985), pale-yellow full-length soft trousers covering the ankles, cream socks, no shoes or jewelry. Sitting securely with both legs and hands visible, or supported safely on the father's lap; never standing unsupported, never depicted as a three-year-old. Natural infant head-to-body ratio about 1:3 to 1:4, not adult 1:5 and not exaggerated chibi. Keep identical appearance and clothes in sprite and education scene.

ACTION AND PLACEMENT: Ti40 sits on the cream play mat LEFT of center with knees naturally bent and both feet in frame. His ONE-YEAR-OLD child sits securely on the mat immediately RIGHT of him, within his reach, happily looking up. Father smiles tenderly, one hand resting near child for support, other on his own knee. The laptop stays on the central low table behind and beyond baby reach, abstract display only. No confirmed transfer or preset fund balance. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

CAMERA AND MATCHING SHOT LOCK: Missions 1-2 use fixed eye-level camera at the FRONT-LEFT family-room corner: window LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Mission 3 uses the specified closer view of that RIGHT desk, retaining visible window/sofa landmarks and room coordinates. Do not mirror, relocate doors or introduce a new room. Within each mission, empty BG, title and composite match light and props exactly; composite only adds the specified people. Laptop screen always faces its seated user, keyboard within reach; show rear/side to camera when camera is opposite the user. Age transition to 50 happens before Mission 3; no one-year-old child at that time.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Scene 3: Tí 50 tuổi nhìn lại

**Output**: `images/chuong-8/c8_scene_fire_reflection.png`
**Loại ảnh**: SCENE CÓ NHÂN VẬT — tranh hoàn chỉnh, không dùng làm BG trống.
**Aspect**: 16:9

**Nhân vật cần cho vào**: Chỉ Tí 50 tuổi — đúng 1 người.
**Ảnh nhân vật cần đính kèm**: `c8_ti50_reflective.png`.
**Background cần đính kèm**: `c8_bg_fire_empty.png` — góc nhìn gần bàn làm việc bên phải của phòng gia đình, giữ các mốc cửa sổ và sofa theo BG3.
**Bố trí và biểu cảm**: Tí ngồi bàn bên phải ở góc ba phần tư, một tay cạnh sổ đóng, tay kia gần touchpad; trầm ngâm trung tính trước phân loại ending. Không có em bé 1 tuổi.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 8, Nhìn lại hành trình — Tí 50 tuổi. BEFORE ending classification: Ti50 sits at the RIGHT desk in three-quarter profile, one hand relaxed beside closed notebook, the other near the laptop touchpad. Thoughtful neutral expression, neither already celebrating nor despairing. Laptop screen is neutral unreadable blocks; historical charts and scores will be drawn by game UI. No signing a document or new investment.

SETTING, GEOMETRY, PROPS AND LIGHTING: The RIGHT-side study desk of the established Vietnamese FAMILY LIVING ROOM, at NIGHT when Ti is 50. This is a closer camera angle within the same room, NOT a separate new study. Camera near the central coffee table looking diagonally toward the RIGHT wall desk; preserve room coordinates. LEFT background: the familiar white-framed window with pale-beige curtain and dark blue night beyond. BACK-left background: recognizable portion of the light-gray two-seat sofa against cream wall and its small open wooden shelf with plain books and green plant. RIGHT main focus: the same compact medium-brown wooden desk and plain chair, closed storage cabinet and warm floor lamp; closed brown entrance door remains at far-right rear. Central coffee table edge appears in the lower-left foreground. Cream ceramic floor unchanged. Remove the infant play mat and visible infant toys at this later age. Desk holds a plain laptop, a warm task lamp at back-right, ceramic cup, capped pen and closed unmarked notebook. Chair faces the desk; laptop keyboard is immediately in front of the chair and screen faces the seated user, camera sees a narrow side/rear angle rather than a front-facing display turned away from Ti. Keep the user's face clear above and beside the laptop. Clean modest intact furnishings; no property deeds, trophies, debt notices or wealth indicators. Warm task light, soft floor-lamp fill and subtle cool screen light; reflective neutral mood before scoring.

CHARACTERS: Exactly 1 visible person.

CHARACTER 1: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

ACTION AND PLACEMENT: BEFORE ending classification: Ti50 sits at the RIGHT desk in three-quarter profile, one hand relaxed beside closed notebook, the other near the laptop touchpad. Thoughtful neutral expression, neither already celebrating nor despairing. Laptop screen is neutral unreadable blocks; historical charts and scores will be drawn by game UI. No signing a document or new investment. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

CAMERA AND MATCHING SHOT LOCK: Missions 1-2 use fixed eye-level camera at the FRONT-LEFT family-room corner: window LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Mission 3 uses the specified closer view of that RIGHT desk, retaining visible window/sofa landmarks and room coordinates. Do not mirror, relocate doors or introduce a new room. Within each mission, empty BG, title and composite match light and props exactly; composite only adds the specified people. Laptop screen always faces its seated user, keyboard within reach; show rear/side to camera when camera is opposite the user. Age transition to 50 happens before Mission 3; no one-year-old child at that time.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Ending S: Tự do Tài chính & Viên mãn — The Master Investor

**Output**: `images/chuong-8/c8_scene_ending_s.png`
**Loại ảnh**: SCENE CÓ NHÂN VẬT — tranh hoàn chỉnh, không dùng làm BG trống.
**Aspect**: 16:9

**Nhân vật cần cho vào**: Chỉ Tí 50 tuổi — đúng 1 người.
**Ảnh nhân vật cần đính kèm**: `c8_ti50_reflective.png` khóa nhận diện; `c8_ti50_relaxed.png` tham chiếu biểu cảm.
**Bối cảnh tạo trực tiếp trong scene**: sân gỗ ven biển lúc nắng vàng, ghế bên phải, cây bên trái, biển phía sau.
**Reference BG**: Không cần tạo hoặc đính kèm BG ending riêng.
**Bố trí và biểu cảm**: Tí ngồi thẳng thoải mái trên ghế bên phải, hai tay trên đùi, nhìn biển và mỉm cười nhẹ. Chỉ dùng sau khi chọn ending S.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 8, Ending S đã được hệ thống chọn. ONLY AFTER ending S selection. Seated upright in the RIGHT chair, hands relaxed visibly on thighs, looking toward the sea with a small satisfied smile; peaceful retirement and leisure.

SETTING, GEOMETRY, PROPS AND LIGHTING: A peaceful seaside travel terrace at golden hour, camera on a modest clean wooden deck with simple chair on RIGHT and small side table, low railing across BACK, turquoise open sea and distant coastal hills beyond, a single leafy plant on LEFT, warm sky. No private yacht, mansion, champagne, piles of money or readable destination sign. Travel and rest represent the selected financial-freedom ending; do not imply ownership of the terrace.

CHARACTERS: Exactly 1 visible person.

CHARACTER 1: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

ACTION AND PLACEMENT: ONLY AFTER ending S selection. Seated upright in the RIGHT chair, hands relaxed visibly on thighs, looking toward the sea with a small satisfied smile; peaceful retirement and leisure. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

ENDING SCENE LOCK: Generate ONE complete ending illustration containing Ti50 and the branch setting described above. No separate empty ending background is required. Use the approved Ti50 character references for identity and expression. S, A, B and C are mutually exclusive alternatives after scoring, never successive scenes. Keep Ti50 face, body and outfit identical across branches; only expression, posture and setting differ. The game overlays ending text and title on this scene; do not add another character sprite.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Ending A: Ổn định & An yên — The Smart Saver

**Output**: `images/chuong-8/c8_scene_ending_a.png`
**Loại ảnh**: SCENE CÓ NHÂN VẬT — tranh hoàn chỉnh, không dùng làm BG trống.
**Aspect**: 16:9

**Nhân vật cần cho vào**: Chỉ Tí 50 tuổi — đúng 1 người.
**Ảnh nhân vật cần đính kèm**: `c8_ti50_reflective.png` khóa nhận diện; `c8_ti50_content.png` tham chiếu biểu cảm.
**Bối cảnh tạo trực tiếp trong scene**: hiên nhà bình dị buổi sáng, vườn bên trái, hai ghế gỗ và bàn trà bên phải.
**Reference BG**: Không cần tạo hoặc đính kèm BG ending riêng.
**Bố trí và biểu cảm**: Tí ngồi một ghế bên phải, hai tay trên đùi, nhìn vườn an yên; ghế còn lại để trống. Chỉ dùng sau khi chọn ending A.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 8, Ending A đã được hệ thống chọn. ONLY AFTER ending A selection. Seated in one RIGHT chair, both hands relaxed on thighs, gentle contented smile, gaze toward the garden; steady peaceful later life.

SETTING, GEOMETRY, PROPS AND LIGHTING: A modest well-kept Vietnamese home veranda in soft morning light: LEFT a small potted flowering plant and open view of a quiet garden, BACK clean cream wall with intact wooden door, RIGHT two plain wooden chairs and small tea table with two empty cups, intact terracotta floor. A second chair suggests room for family company without introducing an unnamed character. Comfortable ordinary home, no luxury estate or financial hardship props.

CHARACTERS: Exactly 1 visible person.

CHARACTER 1: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

ACTION AND PLACEMENT: ONLY AFTER ending A selection. Seated in one RIGHT chair, both hands relaxed on thighs, gentle contented smile, gaze toward the garden; steady peaceful later life. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

ENDING SCENE LOCK: Generate ONE complete ending illustration containing Ti50 and the branch setting described above. No separate empty ending background is required. Use the approved Ti50 character references for identity and expression. S, A, B and C are mutually exclusive alternatives after scoring, never successive scenes. Keep Ti50 face, body and outfit identical across branches; only expression, posture and setting differ. The game overlays ending text and title on this scene; do not add another character sprite.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Ending B: Chật vật mưu sinh — The Survivor

**Output**: `images/chuong-8/c8_scene_ending_b.png`
**Loại ảnh**: SCENE CÓ NHÂN VẬT — tranh hoàn chỉnh, không dùng làm BG trống.
**Aspect**: 16:9

**Nhân vật cần cho vào**: Chỉ Tí 50 tuổi — đúng 1 người.
**Ảnh nhân vật cần đính kèm**: `c8_ti50_reflective.png` khóa nhận diện; `c8_ti50_tired.png` tham chiếu biểu cảm.
**Bối cảnh tạo trực tiếp trong scene**: phòng làm việc nhỏ đêm khuya, cửa sổ trái, bàn và laptop với đèn bàn bên phải.
**Reference BG**: Không cần tạo hoặc đính kèm BG ending riêng.
**Bố trí và biểu cảm**: Tí làm việc ở bàn bên phải, một tay dùng chuột, tay kia cạnh sổ; vai hơi mỏi, nét mặt mệt nhưng cố gắng. Chỉ dùng sau khi chọn ending B.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 8, Ending B đã được hệ thống chọn. ONLY AFTER ending B selection. Seated at RIGHT desk still working, one hand on mouse and the other resting open by notebook, shoulders slightly tired, restrained weary expression with resolve; no crying or collapse.

SETTING, GEOMETRY, PROPS AND LIGHTING: An ordinary small Vietnamese workroom late at night: LEFT closed small window with dark blue outside, BACK cream wall and plain shelf of unmarked folders, RIGHT worn but intact wooden desk with simple working laptop, task lamp, closed notebook and ordinary chair. Clean floor, furnishings modest and used but serviceable. Warm small pool of desk light, subdued cool room. No debt collector, starvation, eviction or medical emergency. This represents continued work and insecure finances, not complete dependency.

CHARACTERS: Exactly 1 visible person.

CHARACTER 1: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

ACTION AND PLACEMENT: ONLY AFTER ending B selection. Seated at RIGHT desk still working, one hand on mouse and the other resting open by notebook, shoulders slightly tired, restrained weary expression with resolve; no crying or collapse. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

ENDING SCENE LOCK: Generate ONE complete ending illustration containing Ti50 and the branch setting described above. No separate empty ending background is required. Use the approved Ti50 character references for identity and expression. S, A, B and C are mutually exclusive alternatives after scoring, never successive scenes. Keep Ti50 face, body and outfit identical across branches; only expression, posture and setting differ. The game overlays ending text and title on this scene; do not add another character sprite.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Ending C: Khủng hoảng toàn diện — The Debt Slave

**Output**: `images/chuong-8/c8_scene_ending_c.png`
**Loại ảnh**: SCENE CÓ NHÂN VẬT — tranh hoàn chỉnh, không dùng làm BG trống.
**Aspect**: 16:9

**Nhân vật cần cho vào**: Chỉ Tí 50 tuổi — đúng 1 người.
**Ảnh nhân vật cần đính kèm**: `c8_ti50_reflective.png` khóa nhận diện; `c8_ti50_distressed.png` tham chiếu biểu cảm.
**Bối cảnh tạo trực tiếp trong scene**: phòng khách đơn sơ sạch sẽ ban đêm, sofa xám phía sau, hóa đơn không chữ và khay tiền gần cạn trên bàn giữa.
**Reference BG**: Không cần tạo hoặc đính kèm BG ending riêng.
**Bố trí và biểu cảm**: Tí ngồi sofa phía sau, hơi cúi về trước, hai tay trên đầu gối, nhìn hóa đơn lo âu. Không thêm người đòi nợ hay người thân. Chỉ dùng sau khi chọn ending C.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions. Do not enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep facial structure, age, height, build and skin tone consistent with the approved reference. Natural hands, no extra fingers or limbs.

STORY MOMENT: Chapter 8, Ending C đã được hệ thống chọn. ONLY AFTER ending C selection. Seated on BACK sofa leaning slightly forward, hands resting open on knees, looking toward unmarked bills with drawn eyebrows and a small downturned mouth; sober worry, no grotesque despair or physical illness.

SETTING, GEOMETRY, PROPS AND LIGHTING: A sparse but clean Vietnamese family living room at night: LEFT small intact window with dark blue outside and faded beige curtain, BACK plain cream wall and older intact gray sofa, CENTER small wooden table with several unsigned unmarked bills and an almost empty open coin tray (no readable amount), RIGHT simple cabinet and low warm lamp. Clean intact tile floor. Subdued lighting, serious human dignity, no mold, broken house, homelessness, prison, collectors, chains, violence or hospital apparatus. Bills and worried posture convey financial pressure; dependency is explained by game text, not an invented family confrontation.

CHARACTERS: Exactly 1 visible person.

CHARACTER 1: a 50-year-old Vietnamese man (Ti, age-locked 50), height 171 cm, healthy mature average build with a slightly soft waist, warm light-beige skin, recognizable slightly elongated face and medium dark-brown eyes, gentle forehead and eye wrinkles, short neatly combed salt-and-pepper hair mostly black with gray at both temples, short trimmed gray-flecked stubble. Age the approved c8_ti40_thoughtful.png naturally by ten years; preserve identity. Outfit: dark-navy short-sleeve polo (#263b55), beige full-length straight khaki trousers (#c8b58e) reaching the ankles, brown leather belt, beige socks, closed brown loafers (#694735), round silver-case watch with black leather strap on LEFT wrist. Keep the same outfit and body across all four ending branches; show circumstances through setting and expression, not a new face, ragged costume, luxury suit or sudden illness.

ACTION AND PLACEMENT: ONLY AFTER ending C selection. Seated on BACK sofa leaning slightly forward, hands resting open on knees, looking toward unmarked bills with drawn eyebrows and a small downturned mouth; sober worry, no grotesque despair or physical illness. No other people, crowds or face images. Full bodies remain inside the image boundary; furniture may naturally overlap legs, but keep identity, hands and main action readable. Adult heads stay 1:4–1:5, natural eyes, no distorted emotions.

COMPOSITION: Wide cinematic story illustration, characters in middle ground, faces and hands above the bottom 22% reserved for game dialogue. Do not put white studio backgrounds behind characters. No UI, speech balloons, subtitles or burned-in numbers.

ENDING SCENE LOCK: Generate ONE complete ending illustration containing Ti50 and the branch setting described above. No separate empty ending background is required. Use the approved Ti50 character references for identity and expression. S, A, B and C are mutually exclusive alternatives after scoring, never successive scenes. Keep Ti50 face, body and outfit identical across branches; only expression, posture and setting differ. The game overlays ending text and title on this scene; do not add another character sprite.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. All screens and papers are abstract and unreadable. The game renders amounts, charts, text and choices separately.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: readable text, labels, numbers, logo, UI screenshot, selected option, outcome stamp, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

# PHẦN C — TIÊU ĐỀ NHIỆM VỤ VÀ TỔNG KẾT

Ngoại lệ chữ: ảnh tiêu đề có chữ lớn chính giữa; nền và composite khác không có chữ đọc được. Tên đầy đủ ở dưới, ngắt dòng chỉ để dễ đọc.

**Bộ tiêu đề chương cuối**: Ba ảnh dùng chung chữ serif ngà sáng, nhãn nhiệm vụ nhỏ màu vàng, nền giảm tương phản và họa tiết thanh mảnh theo chủ đề. Bỏ bảng gỗ/khung giấy cũ. NV1 gợi che chở bằng nét khiên, NV2 gợi tương lai bằng sách và mầm cây, NV3 gợi hành trình tám chương bằng vòng cung chân trời. Giữ nguyên tên nhiệm vụ, không thêm lời tuyên bố chiến thắng trước khi phân loại ending.

## Tiêu đề — Nhiệm vụ 1: Chiếc khiên bảo vệ tài chính

**Output**: `images/chuong-8/bg_nhiem_vu_1.png`
**Loại ảnh**: ẢNH TIÊU ĐỀ — 0 nhân vật; tái dùng BG nhiệm vụ tương ứng.
**Aspect**: 16:9
**Thiết kế tiêu đề**: Xanh đêm – vàng ấm; nét khiên bảo vệ ôm phía trên tiêu đề, ánh sáng ấm gợi sự che chở.
**Ảnh nền cần đính kèm**: `c8_bg_insurance_empty.png`. Giữ kiến trúc; cho phép phủ màu và giảm tương phản nền riêng cho ảnh tiêu đề.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: 2D cartoon environment illustration with Ghibli-inspired everyday warmth, medium-thickness outlines, simplified coherent objects, soft cel-shading with gentle gradients, warm natural lighting, consistent with the approved Chapter 8 backgrounds. Environment and objects ONLY. No people, bodies, faces, hands, silhouettes, human reflections, portraits or people on screens. No photorealism, 3D, chibi characters, watermark or logo. Render only the exact Vietnamese title specified below.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Evening family living room prepared for the insurance-reading mission. The room is unoccupied. This is the mission title card before interaction.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese family living room, approximately 18 square meters. Camera INSIDE, wide eye-level view of left, back and right walls and intact cream ceramic floor. LEFT: rectangular white-framed window, pale-beige curtains, ordinary neighboring apartment buildings. BACK: light-gray two-seat sofa against warm-cream wall, small open wooden shelf with plain books and green plant. CENTER: low rounded-corner medium-brown wooden coffee table, generous clear floor space. RIGHT: compact wooden desk and chair, closed storage cabinet, warm floor lamp beside sofa. Closed brown entrance door at far-right rear. One small woven basket of unbranded soft toys near the cabinet, away from the walkway. Clean and intact, ordinary means, no symbols proving a purchased house or successful investment. The geometry continues the Chapter 7 family room as a production continuity choice; no extra move or home purchase is implied. TIME: EVENING near the start of parenthood, dark blue outside LEFT window, warm RIGHT floor lamp and gentle ceiling fill. Central table holds a plain tablet with unreadable article blocks and a closed notebook. No accident, funeral, hospital equipment, insurance agent or signed policy. The article is a subject for reflection, not an event happening to this family.

TITLE COMPOSITION: A polished illustrated final-chapter title card with cinematic typography integrated directly over the room. No parchment rectangle, wooden frame, signboard or opaque panel. Keep the room recognizable at the outer left/right edges, but visually secondary: add a soft translucent deep-color wash and gentle edge vignette, reduce background contrast and fine detail behind the text, without changing the original light direction or time of day. The title must be the first thing the viewer notices even at thumbnail size. Text group centered at x=50%, y=47%, within x=14-86% and y=29-67%. Keep ornaments outside this text area.

TITLE ART DIRECTION: PROTECTION: deep midnight blue #182d46, warm ivory #fff2d9, restrained antique gold #d6b575. A fine open shield contour frames the title from outside its text area, arching above and tapering below, with two small botanical sprigs at its lower sides. This is an abstract graphic motif, not an insurance-company logo, purchased policy or success badge. Keep the original warm lamp glow at RIGHT; introduce a restrained amber graphic halo behind the lettering. Mood: reassuring, dignified, protective.

TYPOGRAPHY AND HIERARCHY: Render the exact three lines below. Line 1 is the smaller mission label, approximately 42 px at 1920 x 1080, medium-weight clear lettering in muted gold, flanked by two short fine horizontal rules. Lines 2 and 3 are the main title, approximately 108-120 px, bold elegant storybook serif with sturdy readable strokes, luminous ivory fill, a very thin warm-gold edge and a soft dark shadow for contrast. Keep the two main lines equal in prominence, with generous line spacing for Vietnamese accents; never use cramped script, exaggerated bevels, metallic 3D extrusion or neon outlines. The mission label must be clearly smaller than the title. Keep at least 10% canvas-edge safety margin; shrink the title slightly if necessary rather than cropping or breaking words. Full accurate Vietnamese diacritics. Render ONLY this exact text with these line breaks:

Nhiệm vụ 1:
Chiếc khiên
bảo vệ tài chính

No-text rules for ordinary backgrounds do NOT apply to the specified title. No extra heading, English Mission label, subtitle, branch badge or caption. No cropped ornaments or letters.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT family-room corner: window LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Match the approved background for this mission. Preserve architecture, props and source-light direction. The title-specific color wash, vignette and reduced background contrast are allowed as graphic treatment only; do not change the room or time of day. All chairs, sofa and floor areas are unoccupied. Do not add any person.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. Only the specified title is readable; every prop remains unmarked.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: wooden title board, parchment panel, opaque central rectangle, generic slide template, busy ornamental border, tiny main title, low-contrast lettering, excessive glitter, confetti, victory trophy, money rain, neon glow, 3D metallic text, people, adults, children, babies, faces, hands, bodies, silhouettes, human reflections, portraits, missing title, blank sign, misspelled Vietnamese, missing accents, wrong mission number, extra text, tiny lettering, overlapping or cropped title, people, silhouettes, human reflections, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Tiêu đề — Nhiệm vụ 2: Quỹ giáo dục tương lai

**Output**: `images/chuong-8/bg_nhiem_vu_2.png`
**Loại ảnh**: ẢNH TIÊU ĐỀ — 0 nhân vật; tái dùng BG nhiệm vụ tương ứng.
**Aspect**: 16:9
**Thiết kế tiêu đề**: Xanh lá trầm – kem – vàng mật; sách mở và mầm cây ở chân chữ, gợi vun đắp tương lai.
**Ảnh nền cần đính kèm**: `c8_bg_education_empty.png`. Giữ kiến trúc; cho phép phủ màu và giảm tương phản nền riêng cho ảnh tiêu đề.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: 2D cartoon environment illustration with Ghibli-inspired everyday warmth, medium-thickness outlines, simplified coherent objects, soft cel-shading with gentle gradients, warm natural lighting, consistent with the approved Chapter 8 backgrounds. Environment and objects ONLY. No people, bodies, faces, hands, silhouettes, human reflections, portraits or people on screens. No photorealism, 3D, chibi characters, watermark or logo. Render only the exact Vietnamese title specified below.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Late-afternoon family living room prepared for the education-planning mission. The play mat is empty; no adult or infant is present. This is the mission title card before interaction.

SETTING, GEOMETRY, PROPS AND LIGHTING: Modest clean Vietnamese family living room, approximately 18 square meters. Camera INSIDE, wide eye-level view of left, back and right walls and intact cream ceramic floor. LEFT: rectangular white-framed window, pale-beige curtains, ordinary neighboring apartment buildings. BACK: light-gray two-seat sofa against warm-cream wall, small open wooden shelf with plain books and green plant. CENTER: low rounded-corner medium-brown wooden coffee table, generous clear floor space. RIGHT: compact wooden desk and chair, closed storage cabinet, warm floor lamp beside sofa. Closed brown entrance door at far-right rear. One small woven basket of unbranded soft toys near the cabinet, away from the walkway. Clean and intact, ordinary means, no symbols proving a purchased house or successful investment. The geometry continues the Chapter 7 family room as a production continuity choice; no extra move or home purchase is implied. TIME: LATE AFTERNOON during Mission 2, soft golden daylight enters from LEFT, lamps off. A clean cream padded play mat lies on the central floor beside the sofa. Laptop and closed notebook are on the low table safely beyond infant reach; no cords, hot drinks or sharp objects within reach. Laptop contains abstract unreadable blocks, no confirmed savings plan or fixed balance. The play mat is empty. Do not depict a child.

TITLE COMPOSITION: A polished illustrated final-chapter title card with cinematic typography integrated directly over the room. No parchment rectangle, wooden frame, signboard or opaque panel. Keep the room recognizable at the outer left/right edges, but visually secondary: add a soft translucent deep-color wash and gentle edge vignette, reduce background contrast and fine detail behind the text, without changing the original light direction or time of day. The title must be the first thing the viewer notices even at thumbnail size. Text group centered at x=50%, y=47%, within x=14-86% and y=29-67%. Keep ornaments outside this text area.

TITLE ART DIRECTION: EDUCATION: deep forest teal #214b48, warm cream #fff3d9, honey gold #d8b16b. Below the title, around y=76%, place a small illustrated open unmarked book with one delicate seedling rising beside it; slender leaf curves extend gently toward the lower outer corners. Keep all leaves and book edges outside the lettering. These are decorative graphic motifs, not extra physical props in the room. Preserve the late-afternoon sun direction from LEFT, with a soft honey-colored graphic wash around the central title. Mood: tender, hopeful, patient growth, no guaranteed return or graduation outcome.

TYPOGRAPHY AND HIERARCHY: Render the exact three lines below. Line 1 is the smaller mission label, approximately 42 px at 1920 x 1080, medium-weight clear lettering in muted gold, flanked by two short fine horizontal rules. Lines 2 and 3 are the main title, approximately 108-120 px, bold elegant storybook serif with sturdy readable strokes, luminous ivory fill, a very thin warm-gold edge and a soft dark shadow for contrast. Keep the two main lines equal in prominence, with generous line spacing for Vietnamese accents; never use cramped script, exaggerated bevels, metallic 3D extrusion or neon outlines. The mission label must be clearly smaller than the title. Keep at least 10% canvas-edge safety margin; shrink the title slightly if necessary rather than cropping or breaking words. Full accurate Vietnamese diacritics. Render ONLY this exact text with these line breaks:

Nhiệm vụ 2:
Quỹ giáo dục
tương lai

No-text rules for ordinary backgrounds do NOT apply to the specified title. No extra heading, English Mission label, subtitle, branch badge or caption. No cropped ornaments or letters.

CAMERA AND MATCHING SHOT LOCK: Fixed eye-level camera at the FRONT-LEFT family-room corner: window LEFT, sofa BACK, low table CENTER, desk/cabinet/lamp RIGHT, door REAR-RIGHT. Match the approved background for this mission. Preserve architecture, props and source-light direction. The title-specific color wash, vignette and reduced background contrast are allowed as graphic treatment only; do not change the room or time of day. All chairs, sofa and floor areas are unoccupied. Do not add any person.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. Only the specified title is readable; every prop remains unmarked.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: wooden title board, parchment panel, opaque central rectangle, generic slide template, busy ornamental border, tiny main title, low-contrast lettering, excessive glitter, confetti, victory trophy, money rain, neon glow, 3D metallic text, people, adults, children, babies, faces, hands, bodies, silhouettes, human reflections, portraits, missing title, blank sign, misspelled Vietnamese, missing accents, wrong mission number, extra text, tiny lettering, overlapping or cropped title, people, silhouettes, human reflections, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## Tiêu đề — Nhiệm vụ 3: Đích đến Tự do Tài chính - FIRE

**Output**: `images/chuong-8/bg_nhiem_vu_3.png`
**Loại ảnh**: ẢNH TIÊU ĐỀ — 0 nhân vật; tái dùng BG nhiệm vụ tương ứng.
**Aspect**: 16:9
**Thiết kế tiêu đề**: Xanh chàm – ngà – vàng champagne; vòng cung chân trời và đường hành trình, tạo điểm nhấn cho nhiệm vụ cuối.
**Ảnh nền cần đính kèm**: `c8_bg_fire_empty.png`. Giữ kiến trúc; cho phép phủ màu và giảm tương phản nền riêng cho ảnh tiêu đề.

```text
Create ONE full-bleed 16:9 landscape PNG, target 1920 x 1080.

STYLE TOKEN: 2D cartoon environment illustration with Ghibli-inspired everyday warmth, medium-thickness outlines, simplified coherent objects, soft cel-shading with gentle gradients, warm natural lighting, consistent with the approved Chapter 8 backgrounds. Environment and objects ONLY. No people, bodies, faces, hands, silhouettes, human reflections, portraits or people on screens. No photorealism, 3D, chibi characters, watermark or logo. Render only the exact Vietnamese title specified below.

ENVIRONMENT ONLY: NO people, NO silhouettes, NO sprites, NO human reflections, NO faces in photos or screens.

STORY MOMENT: Nighttime desk corner in the same family living room, ten years later. The chair and room are unoccupied. This is the mission title card before interaction.

SETTING, GEOMETRY, PROPS AND LIGHTING: The RIGHT-side study desk of the established Vietnamese FAMILY LIVING ROOM, at NIGHT, ten years after the earlier missions. This is a closer camera angle within the same room, NOT a separate new study. Camera near the central coffee table looking diagonally toward the RIGHT wall desk; preserve room coordinates. LEFT background: the familiar white-framed window with pale-beige curtain and dark blue night beyond. BACK-left background: recognizable portion of the light-gray two-seat sofa against cream wall and its small open wooden shelf with plain books and green plant. RIGHT main focus: the same compact medium-brown wooden desk and plain chair, closed storage cabinet and warm floor lamp; closed brown entrance door remains at far-right rear. Central coffee table edge appears in the lower-left foreground. Cream ceramic floor unchanged. Remove the infant play mat and visible infant toys at this later age. Desk holds a plain laptop, a warm task lamp at back-right, ceramic cup, capped pen and closed unmarked notebook. The EMPTY chair faces the desk; laptop keyboard is immediately in front of the empty chair, with its screen facing that chair. Camera sees a narrow side/rear angle of the laptop. No person is seated here. Clean modest intact furnishings; no property deeds, trophies, debt notices or wealth indicators. Warm task light, soft floor-lamp fill and subtle cool screen light; reflective neutral mood before scoring.

TITLE COMPOSITION: A polished illustrated final-chapter title card with cinematic typography integrated directly over the room. No parchment rectangle, wooden frame, signboard or opaque panel. Keep the room recognizable at the outer left/right edges, but visually secondary: add a soft translucent deep-color wash and gentle edge vignette, reduce background contrast and fine detail behind the text, without changing the original light direction or time of day. The title must be the first thing the viewer notices even at thumbnail size. Text group centered at x=50%, y=47%, within x=14-86% and y=29-67%. Keep ornaments outside this text area.

TITLE ART DIRECTION: FINAL MISSION: deep indigo #202b46, luminous ivory #fff5e2, champagne gold #dcc08a. An elegant open horizon arc sweeps behind and above the title, with a fine curved path rising from the lower outer edge toward that arc. Eight tiny unnumbered light points follow the outer path to recall the eight-chapter journey; no checked milestones, ranks or achievement badges. Keep this a graphic overlay on the established nighttime desk scene, not an actual sunrise or a new outdoor location. Use the strongest title contrast of the three cards, with a restrained radial gold glow and ample dark breathing space. Mood: reflective anticipation of the final assessment, never declared victory or guaranteed early retirement.

TYPOGRAPHY AND HIERARCHY: Render the exact three lines below. Line 1 is the smaller mission label, approximately 42 px at 1920 x 1080, medium-weight clear lettering in muted gold, flanked by two short fine horizontal rules. Lines 2 and 3 are the main title, approximately 100-112 px, bold elegant storybook serif with sturdy readable strokes, luminous ivory fill, a very thin warm-gold edge and a soft dark shadow for contrast. Keep the two main lines equal in prominence, with generous line spacing for Vietnamese accents; never use cramped script, exaggerated bevels, metallic 3D extrusion or neon outlines. The mission label must be clearly smaller than the title. Keep at least 10% canvas-edge safety margin; shrink the title slightly if necessary rather than cropping or breaking words. Full accurate Vietnamese diacritics. Render ONLY this exact text with these line breaks:

Nhiệm vụ 3:
Đích đến Tự do
Tài chính - FIRE

No-text rules for ordinary backgrounds do NOT apply to the specified title. No extra heading, English Mission label, subtitle, branch badge or caption. No cropped ornaments or letters.

CAMERA AND MATCHING SHOT LOCK: Closer view from near the central coffee table toward the RIGHT desk. Retain the LEFT window and BACK-left sofa landmarks; do not revert to the wide sofa-centered view. Match the approved background for this mission. Preserve architecture, props and source-light direction. The title-specific color wash, vignette and reduced background contrast are allowed as graphic treatment only; do not change the room or time of day. All chairs, sofa and floor areas are unoccupied. Do not add any person.

CONTINUITY: This prompt fully defines its location, time and props. Match approved location references for geometry if provided, never substitute another chapter's room or change left/right orientation. Do not invent transactions, selected options or later outcomes. Only the specified title is readable; every prop remains unmarked.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, rectangular image, no margins.

NEGATIVE: wooden title board, parchment panel, opaque central rectangle, generic slide template, busy ornamental border, tiny main title, low-contrast lettering, excessive glitter, confetti, victory trophy, money rain, neon glow, 3D metallic text, people, adults, children, babies, faces, hands, bodies, silhouettes, human reflections, portraits, missing title, blank sign, misspelled Vietnamese, missing accents, wrong mission number, extra text, tiny lettering, overlapping or cropped title, people, silhouettes, human reflections, watermark, photorealism, 3D, chibi, oversized head, distorted anatomy, black borders, doorway frame, cropped main subjects, luxury upgrade before choice, dirty ruined room, extra people.

```

---

## 🪧 TỔNG KẾT CHƯƠNG 8 — CHUẨN BỊ CHO MỘT ĐỜI AN TÂM

**Output**: `images/chuong-8/bg_tong_ket_chuong.png`
**Loại**: Tranh tổng kết biểu tượng, không nhân vật, 16:9 — 1920 × 1080.
**Dùng cho**: Nhìn lại ý nghĩa cả chương, dùng chung cho các nhánh; xuất hiện trước khi hiển thị kết thúc S/A/B/C.
**Ý nghĩa cần gợi**: Bảo vệ tài chính gia đình; quỹ giáo dục và lãi kép; kế hoạch dài hạn; nhìn lại hành trình trước khi phân loại ending.
**Thiết kế mới**: Chuẩn bị cho một đời an tâm. Tiêu đề và câu chốt ý đặt trên khoảng giấy sáng ở giữa; các cụm đồ vật kể lại bài học nằm quanh rìa. Không dùng bảng gỗ lớn che gần hết cảnh. Đây là tranh hồi tưởng mang tính biểu tượng, không phải cảnh mới xảy ra sau nhiệm vụ cuối.

```text
Create ONE beautifully composed 16:9 full-bleed illustrated chapter-recap card, target 1920 x 1080. This is a finished visual-novel chapter reflection illustration, not a slide template or a literal continuation of the last scene.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the three exact Vietnamese recap lines specified below, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii. ENVIRONMENT-ONLY RECAP: no people, faces, hands, silhouettes or human reflections. Keep the same kawaii 2D cartoon outlines, object simplification and cel-shading as the gameplay backgrounds. Subtle paper texture only, not painterly realism.

CHAPTER MEANING: A broad graceful arc of life links protection, education and later-life planning. The mood is meaningful and reflective, open to every ending rather than automatically celebrating financial freedom. The lesson is: Bảo vệ tài chính gia đình; quỹ giáo dục và lãi kép; kế hoạch dài hạn; nhìn lại hành trình trước khi phân loại ending. This meaning is visual direction; do not render that explanatory sentence as text.

COLOR STORY: luminous ivory #f5eee0, tranquil blue #708fa2, muted leaf green #91aa90 and restrained sunset gold #d4b680. Use cream for most of the image, two main supporting hues, and only small warm accents. Richer colors belong to the outer object groups; central text sits against a quiet light field.

CUSTOM ILLUSTRATED MOTIFS AND PLACEMENT: LOWER LEFT: a small protective umbrella over an unmarked family-planning folder, with a pair of tiny pale-yellow baby socks beside it; protection is a metaphor, not a purchased policy or proof that all risk is gone. UPPER LEFT: a plain school book and a pencil beside a young potted seedling, recalling the education fund started when the child is one year old. LOWER RIGHT: a blank monthly calendar, closed savings vessel and three gently spaced rings in the paper texture suggest long-term regular contributions and compounding, without any rate, amount or promised growth curve. UPPER RIGHT: an empty simple wooden chair facing a quiet distant horizon through a faint arch of leaves, representing preparation for later life, not an awarded early retirement or a luxury holiday. A very subtle path of eight small unnumbered stones along the lower outer curve recalls the eight chapters; no ranks or checked milestones.

BACKGROUND AND ATMOSPHERE: The entire illustration is an airy symbolic editorial panorama on warm paper; no literal hospital, child scene or home study is required. Horizon remains pale and neutral, a warm glow rather than a victory sunrise. Keep the visual weight balanced between protecting the present and planning the future.

COMPOSITION: One coherent illustration, not a grid or a set of cards. Arrange the specified object groups as an asymmetrical but balanced open wreath around a large central breathing space. Keep ALL objects outside the central text zone, approximately x=20-80% and y=28-65% of the canvas. Let the lower objects anchor the image, with lighter smaller accents above. Objects have consistent perspective and gentle contact shadows; no floating dashboard icons. Keep secondary details sparse, three depth levels at most. The light center has a soft irregular paper wash integrated into the artwork, NOT a rectangular parchment plaque, wooden sign, bordered box, ribbon banner or physical board. No hard frame around the image.

TEXT HIERARCHY AND EXACT VIETNAMESE COPY: Center-align the following three lines as one group, vertically centered around 46% of canvas height.
Line 1, modest chapter eyebrow, approximately 40 px at 1920 x 1080:
Tổng kết chương 8
Line 2, main meaning title, approximately 76 px, the largest text:
Chuẩn bị cho một đời an tâm
Line 3, supporting reflection, approximately 34 px:
Bảo vệ gia đình, vun đắp tương lai.

TYPOGRAPHY: Elegant bold readable storybook serif for the meaning title, simple clear medium-weight lettering for the chapter line and reflection. All text dark warm brown #3b3028 with strong contrast on light cream. Full accurate Vietnamese diacritics, no decorative strokes colliding with accents. Keep generous vertical gaps, at least 10% canvas-edge safety margin, no text touching objects. Main title must fit the central width; reduce it slightly only if needed, never crop it. These THREE specified lines are the ONLY readable text. All bills, books, screens, cards and calendars remain unmarked or abstract. No extra lesson labels or microtext.

NARRATIVE RULE: A thematic recap of learning, NOT a declared player achievement. No success badge, failure stamp, stars, grades, scores, balances, invented rates, selected choices, completed transaction or guaranteed outcome. Symbols show concepts explored in the chapter regardless of the chosen branches. Do not display S/A/B/C, a financial-personality title or a victorious retirement; the game selects and presents the ending afterward.

ASPECT AND DELIVERY: ONE rectangular 16:9 PNG, 1920 x 1080, full bleed, no black margins. Artwork already includes the three specified text lines. No sprite or dialogue box should be layered over the finished card. If gameplay needs scores or detailed recap text, show them on a subsequent UI screen instead of covering this illustration.

NEGATIVE: huge wooden title panel, boxed parchment, generic last-room screenshot, slide deck, infographic grid, collage of screenshots, split-screen rooms, icon stickers, money rain, giant coin piles, glitter explosion, victory trophy, neon finance dashboard, upward profit arrow, confirmed outcome, people, faces, hands, silhouettes, readable prop labels, extra text, misspelled Vietnamese, missing accents, tiny captions, crowded center, overlapping lettering, cropped title, illegible calligraphy, watermark, logo, photorealism, 3D render, heavy black outlines, black borders.
```

**Kiểm tra riêng ảnh tổng kết**: Đủ 3 dòng chữ đúng dấu; bài học được gợi qua đồ vật; trung tâm thoáng; không có bảng gỗ che tranh; không thể hiện người chơi đã thắng/thua. Giữ màu sắc và nét vẽ đồng bộ cả bộ, nhưng bố cục đồ vật đúng riêng chương 8.


---

# 🧩 MAPPING HIỂN THỊ

| Đoạn | Ảnh / UI | Quy tắc |
|---|---|---|
| Nhiệm vụ 1 | `bg_nhiem_vu_1.png` → composite nhiệm vụ 1 → `c8_bg_insurance_empty.png` + sprite / UI | Tiêu đề đúng địa điểm; composite không thêm sprite; UI mới hiển thị lựa chọn và kết quả. |
| Nhiệm vụ 2 | `bg_nhiem_vu_2.png` → composite nhiệm vụ 2 → `c8_bg_education_empty.png` + sprite / UI | Tiêu đề đúng địa điểm; composite không thêm sprite; UI mới hiển thị lựa chọn và kết quả. |
| Nhiệm vụ 3 | `bg_nhiem_vu_3.png` → composite nhiệm vụ 3 → `c8_bg_fire_empty.png` + sprite / UI | Tiêu đề đúng địa điểm; composite không thêm sprite; UI mới hiển thị lựa chọn và kết quả. |
| Tổng kết | `bg_tong_ket_chuong.png` | Tranh biểu tượng bảo vệ gia đình, học vấn và kế hoạch dài hạn; sau đó đọc dữ liệu phiên chơi và chuyển sang một ending. |

# KẾT CỤC — CHỈ HIỂN THỊ MỘT NHÁNH

| Tier | Danh hiệu cuối Word | Bối cảnh scene | Scene hiển thị |
|---|---|---|---|
| S — Tự do Tài chính & Viên mãn | The Master Investor | A peaceful seaside travel terrace at golden hour, camera on a modest clean wooden deck with simple chair on RIGHT and small side table, low railing across BACK, turquoise open sea and distant coastal hills beyond, a single leafy plant on LEFT, warm sky. No private yacht, mansion, champagne, piles of money or readable destination sign. Travel and rest represent the selected financial-freedom ending; do not imply ownership of the terrace. | `c8_scene_ending_s.png` + UI lời kết/danh hiệu; không ghép sprite |
| A — Ổn định & An yên | The Smart Saver | A modest well-kept Vietnamese home veranda in soft morning light: LEFT a small potted flowering plant and open view of a quiet garden, BACK clean cream wall with intact wooden door, RIGHT two plain wooden chairs and small tea table with two empty cups, intact terracotta floor. A second chair suggests room for family company without introducing an unnamed character. Comfortable ordinary home, no luxury estate or financial hardship props. | `c8_scene_ending_a.png` + UI lời kết/danh hiệu; không ghép sprite |
| B — Chật vật mưu sinh | The Survivor | An ordinary small Vietnamese workroom late at night: LEFT closed small window with dark blue outside, BACK cream wall and plain shelf of unmarked folders, RIGHT worn but intact wooden desk with simple working laptop, task lamp, closed notebook and ordinary chair. Clean floor, furnishings modest and used but serviceable. Warm small pool of desk light, subdued cool room. No debt collector, starvation, eviction or medical emergency. This represents continued work and insecure finances, not complete dependency. | `c8_scene_ending_b.png` + UI lời kết/danh hiệu; không ghép sprite |
| C — Khủng hoảng toàn diện | The Debt Slave | A sparse but clean Vietnamese family living room at night: LEFT small intact window with dark blue outside and faded beige curtain, BACK plain cream wall and older intact gray sofa, CENTER small wooden table with several unsigned unmarked bills and an almost empty open coin tray (no readable amount), RIGHT simple cabinet and low warm lamp. Clean intact tile floor. Subdued lighting, serious human dignity, no mold, broken house, homelessness, prison, collectors, chains, violence or hospital apparatus. Bills and worried posture convey financial pressure; dependency is explained by game text, not an invented family confrontation. | `c8_scene_ending_c.png` + UI lời kết/danh hiệu; không ghép sprite |

**Đối chiếu nguồn**: Investor/Saver/Spender là mô tả tính cách ở Mission 8.3; tên danh hiệu bốn tier trong bảng là tên ở hệ thống kết cục cuối Word. B không phải nhiệm vụ mới. Nguồn chưa định lượng “dư dả”, “RISK kiểm soát tốt”, cũng chưa chốt cách xử lý GOAL cao nhưng không đạt điều kiện phụ. Bộ prompt không tự đặt ngưỡng hoặc viết lại thuật toán. UI dùng kết quả phân loại đã xác định của game; không suy tier chỉ từ tranh. Không tạo thêm tiêu đề nhiệm vụ 4 hay Life Event. Danh hiệu, điểm và đoạn kết đặt bằng UI lên scene ending tương ứng; không chuyển sang nền trống hay ghép thêm sprite.

# 📋 BẢNG TỔNG HỢP — 14 PROMPT

| File | Nội dung | Loại |
|---|---|---|
| `c8_bg_insurance_empty.png` | BG1: Đọc bài báo về rủi ro — buổi tối | bg |
| `c8_bg_education_empty.png` | BG2: Quỹ giáo dục — con 1 tuổi | bg |
| `c8_bg_fire_empty.png` | BG3: Nhìn lại hành trình — Tí 50 tuổi | bg |
| `c8_scene_insurance_article.png` | Scene 1: Suy ngẫm sau bài báo | scene |
| `c8_scene_education_fund.png` | Scene 2: Nhìn con và nghĩ về học vấn | scene |
| `c8_scene_fire_reflection.png` | Scene 3: Tí 50 tuổi nhìn lại | scene |
| `c8_scene_ending_s.png` | Ending S: Tự do Tài chính & Viên mãn — The Master Investor | scene |
| `c8_scene_ending_a.png` | Ending A: Ổn định & An yên — The Smart Saver | scene |
| `c8_scene_ending_b.png` | Ending B: Chật vật mưu sinh — The Survivor | scene |
| `c8_scene_ending_c.png` | Ending C: Khủng hoảng toàn diện — The Debt Slave | scene |
| `bg_nhiem_vu_1.png` | Tiêu đề — Nhiệm vụ 1: Chiếc khiên bảo vệ tài chính | title |
| `bg_nhiem_vu_2.png` | Tiêu đề — Nhiệm vụ 2: Quỹ giáo dục tương lai | title |
| `bg_nhiem_vu_3.png` | Tiêu đề — Nhiệm vụ 3: Đích đến Tự do Tài chính - FIRE | title |
| `bg_tong_ket_chuong.png` | Tiêu đề — Tổng kết chương 8 | title |

**Tổng**: 3 BG trống + 3 scene nhiệm vụ + 4 scene ending + 3 tiêu đề nhiệm vụ + 1 tổng kết = **14 prompt**. Kết hợp **10 ảnh nhân vật/sprite** trong `chuong-8-characters.md`: **24 ảnh dự kiến**. Bốn ảnh biểu cảm ending chỉ làm reference tạo scene, không ghép lên tranh kết thúc.

## Cây đầu ra

```text
images/chuong-8/
  c8_ti40_thoughtful.png
  c8_ti40_worried.png
  c8_ti40_tender.png
  c8_ti40_determined.png
  c8_child1_happy.png
  c8_ti50_reflective.png
  c8_ti50_relaxed.png
  c8_ti50_content.png
  c8_ti50_tired.png
  c8_ti50_distressed.png
  c8_bg_insurance_empty.png
  c8_bg_education_empty.png
  c8_bg_fire_empty.png
  c8_scene_insurance_article.png
  c8_scene_education_fund.png
  c8_scene_fire_reflection.png
  c8_scene_ending_s.png
  c8_scene_ending_a.png
  c8_scene_ending_b.png
  c8_scene_ending_c.png
  bg_nhiem_vu_1.png
  bg_nhiem_vu_2.png
  bg_nhiem_vu_3.png
  bg_tong_ket_chuong.png
```

## Thứ tự tạo ảnh và kiểm tra

1. Tạo reference nhân vật trong file characters, khóa mặt, tuổi, màu đồ và phụ kiện; giữ quần dài.
2. Tạo BG đầu tiên; dùng ảnh đã duyệt hỗ trợ giữ vị trí cửa sổ trái, sofa sau, bàn phải giữa các giờ. Mỗi prompt vẫn đủ mô tả để dùng riêng.
3. Tạo BG2 và BG3; kiểm tra không có người, phản chiếu người, chữ/số hay kết quả dựng sẵn.
4. Tạo 3 scene nhiệm vụ kèm reference BG và nhân vật tương ứng. Tạo 4 scene ending trực tiếp từ prompt bối cảnh và reference Tí 50 tuổi; không tạo BG ending trung gian. Kiểm tra số người, tuổi, trang phục và thời điểm.
5. Tạo tiêu đề, kiểm tra đủ dấu tiếng Việt, số 1/2/3, chữ lớn ở giữa, không thiếu/cắt chữ. Tổng kết dùng tranh biểu tượng riêng, đủ ba dòng chữ và đồ vật gợi đúng bài học.
6. Kiểm tra giao diện không ghép sprite lên composite, không biến mini-game thành ảnh tĩnh; số liệu và kết quả do UI hiển thị.
7. Kiểm tra từng ending riêng: đủ S/A/B/C, Tí đều 50t và cùng bộ đồ; chỉ hiện nhánh đã chọn, không mang em bé 1t sang ending.
