# 🎬 CHƯƠNG 6 — BACKGROUND & SCENE PROMPTS

> **MỤC ĐÍCH**: Bộ ảnh **Có việc làm — Thế giới tài chính** gồm BG môi trường không nhân vật, scene kể chuyện có nhân vật và ảnh tiêu đề có chữ lớn ở giữa.
>
> **⚠️ QUY TẮC STYLE BẮT BUỘC**: Dùng chính xác style token earnest teen/adult 1:4–1:5 như Chương 5, không quay về bible kawaii 1:2.5. Tí mặc quần dài; đồng bộ bộ đồ và nhận diện với `chuong-6-characters.md`.
>
> **⚠️ QUY TẮC COPY-PASTE MỖI PROMPT**: Mỗi khối BG, scene và tiêu đề ghi đủ bối cảnh, thời điểm, hình học căn phòng, ánh sáng và quy tắc riêng. Scene lặp đầy đủ reference nhân vật, không chỉ ghi “giống BG trên”. Reference ảnh chỉ hỗ trợ giữ nhất quán, không thay thế nội dung prompt.

---

# 📐 KIẾN TRÚC VISUAL NOVEL — CÁCH DÙNG ẢNH

| Loại | Sprite | Ảnh dùng | Chữ/số |
|---|---|---|---|
| Dialogue/độc thoại | Theo người nói | BG môi trường trống | UI của game |
| Narrator | Không ghép thêm | Scene composite có nhân vật | UI của game |
| Mini-game payslip / ứng dụng / lựa chọn | Tùy màn UI, không che vùng thao tác | BG đúng địa điểm | Văn bản và điều khiển dựng bằng UI, không gen thành ảnh tĩnh |
| Tiêu đề nhiệm vụ/tổng kết | Không ghép sprite | Ảnh tiêu đề Phần C | Tên tiếng Việt được gen sẵn, lớn ở giữa |

> **Cuộc gọi nhiệm vụ 2**: dùng BG2 cho Tí và BG3 cho đầu dây chuyên viên. Có thể cắt luân phiên, hoặc đặt chuyên viên trong ô chân dung cuộc gọi tách biệt. Không ghép chuyên viên đứng cạnh Tí trong phòng trọ, không biến cuộc gọi thành buổi gặp tại ngân hàng.
>
> **Ngoại lệ chữ**: `no text` áp dụng cho BG và composite, không áp dụng cho Phần C. Mỗi prompt tiêu đề thay rõ quy tắc này bằng “chỉ vẽ đúng tiêu đề chỉ định”.
>
> Các đường dẫn là **đầu ra dự kiến** khi tạo ảnh. Hai file Markdown không có nghĩa các PNG đã tồn tại.

---

# 📖 CỐT TRUYỆN GỐC VÀ PHẠM VI CHƯƠNG 6

> **Nguồn ưu tiên**: `D:\DO-AN\cot_truyen\mau\cot-truyen-hoan-chinh-v1.docx`, mục **CHƯƠNG 6: CÓ VIỆC LÀM — THẾ GIỚI TÀI CHÍNH**. Chương có **3 nhiệm vụ**, không có Life Event riêng. Không tự thêm nhiệm vụ 4 hoặc ảnh sự kiện bất ngờ.
>
> **Phân biệt cốt truyện và thiết kế hình ảnh**: Word không chốt tuổi, giới tính chuyên viên, địa điểm Tí nhận cuộc gọi hoặc giờ của từng nhiệm vụ. Bộ ảnh dùng Tí **26 tuổi** theo mốc tạo hình Chương 6 trong `image-generation-bible.md`; chuyên viên chọn **nữ 42 tuổi** để cố định nhận diện. Địa điểm và ánh sáng được chốt bên dưới là lựa chọn dàn cảnh, không phải tình tiết bổ sung vào cốt truyện.
>
> **Không sao chép lỗi từ bible cũ**: giữ style earnest teen/adult 1:4–1:5, không dùng kawaii 1:2.5. Nhiệm vụ 2 là **cuộc gọi điện thoại**, không phải gặp trực tiếp tại quầy ngân hàng. Nhiệm vụ 3 dùng **30%/năm** như Word, không lấy 25% từ prompt cũ. Cốt truyện chi tiết không có nhiệm vụ riêng về lãi kép/đầu tư trong chương này, nên không tự thêm dù phần game map nhắc đến.

| Nhiệm vụ hiển thị | Diễn biến đúng nguồn | Dàn cảnh cố định cho bộ ảnh |
|---|---|---|
| Nhiệm vụ 1: Cú sốc Gross và Net | Hợp đồng Gross 18.000.000đ; thông báo nhận 15.250.000đ; Tí mở payslip và tìm hiểu các khoản trừ | Bàn làm việc công ty, ban ngày; không thêm HR giải thích |
| Nhiệm vụ 2: Quy tắc “Pay Yourself First” | Chuyên viên gọi điện khuyên trích 20%; người chơi chọn bật 3.000.000đ/tháng hoặc tiêu trước, dư mới tiết kiệm | Tí ở phòng trọ cuối chiều sau giờ làm; chuyên viên ở khu tư vấn ngân hàng riêng, liên lạc từ xa |
| Nhiệm vụ 3: Bẫy thanh toán tối thiểu thẻ tín dụng | Sao kê dư nợ 6.000.000đ; chọn trả tối thiểu 300.000đ hoặc trả toàn bộ; nhánh tối thiểu còn gốc 5.700.000đ với mức lãi 30%/năm theo kịch bản | Tí xem ứng dụng tại bàn phòng trọ buổi tối, trước khi xác nhận lựa chọn |
| Tổng kết chương 6 | Nhìn lại ba bài học sau nhiệm vụ 3 | Tranh biểu tượng về thu nhập, tiết kiệm và thẻ tín dụng; dùng chung mọi nhánh, không khẳng định thành tích |

> **Số liệu để triển khai giao diện**: giữ các giá trị trên theo kịch bản; không coi chúng là phép tính thuế/lãi đã được xác minh. Word đồng thời nêu “20%” và lựa chọn “3 triệu”; không ghi `20% × 15.250.000 = 3.000.000` vì hai giá trị không bằng nhau. Ảnh nền/scene chỉ có màn hình và giấy tờ với hình khối không đọc được; các số, nhãn và thao tác kéo/xem/xác nhận được dựng bằng UI để đúng chữ và có thể tương tác.

---

# 👕 TRANG PHỤC CHUẨN — ĐỒNG BỘ SPRITE VÀ SCENE CHƯƠNG 6

> Áp dụng giống nhau trong `chuong-6-characters.md` và `chuong-6-backgrounds.md`. Cùng nhân vật phải giữ khuôn mặt, màu gốc quần áo, kiểu tóc, giày và vị trí phụ kiện qua mọi biểu cảm. Cả hai nhân vật đều mặc **quần dài đến mắt cá**. Không tự thay đồ giữa scene và sprite.

| Nhân vật | Bộ đồ cố định |
|---|---|
| Tí 26t | Sơ mi trắng `#f5f5f0` tay dài cài cổ tay, mở 1 nút cổ, sơ vin; quần dài ống đứng xám đậm `#4a4a4a`; thắt lưng đen khóa bạc; loafer đen `#222222`, tất xám đậm; đồng hồ mặt tròn dây da đen ở tay trái. Không vest, cà vạt hoặc thẻ nhân viên. |
| Chuyên viên ngân hàng nữ 42t | Blazer navy `#263b55` mở phía trước, blouse ngà `#f2eee5`, quần dài navy cùng bộ; giày đen gót vuông 3 cm; kính chữ nhật đen; tóc búi thấp; tai nghe công việc đen ở tai phải, mic gần miệng; khuyên nụ bạc nhỏ. Không logo hay thẻ tên ngân hàng thật. |

> **Ở phòng trọ**: Tí vẫn mặc bộ đồ đi làm trong thời điểm dàn cảnh; không thêm áo ngủ hoặc quần ngắn. Phòng trọ vẫn bình dân, cũ vừa phải nhưng sạch và nguyên vẹn như Chương 5; có việc làm không đồng nghĩa đã mua nhà hay chuyển sang căn hộ sang trọng.
>
> **Qua điện thoại**: chuyên viên không đứng/ngồi cùng phòng với Tí. Sprite chuyên viên chỉ dùng trong ô chân dung cuộc gọi riêng; nếu giao diện chưa hỗ trợ ô cuộc gọi thì dùng BG ngân hàng riêng khi chuyển sang đầu dây bên kia.

---

# 🎯 QUY TẮC CỐ ĐỊNH — ÁP DỤNG MỌI NHÂN VẬT (CHƯƠNG 6)

| ID | Nhân vật | Tuổi cố định | Quốc tịch | Cụm bắt buộc trong prompt |
|---|---|---|---|---|
| `ti` | Tí, nhân viên mới có công việc chính thức | 26 | Việt Nam | `a 26-year-old Vietnamese man` |
| `bank_advisor` | Chuyên viên tư vấn ngân hàng qua điện thoại | 42 | Việt Nam | `a 42-year-old Vietnamese woman` |

> Không thêm nhân vật HR, sếp, Minh hoặc nhân viên thu hồi nợ: cốt truyện Chương 6 không có thoại của họ. Thông báo ngân hàng và ứng dụng là giao diện hệ thống, không phải nhân vật cần sprite.

---

# 🎨 STYLE TOKEN — BG VÀ SCENE

```text
Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, no text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
```

### Anti-distortion CRITICAL block

```text
CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.
```

### Negative prompt cơ bản

```text
text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character
```

> Với BG: không có người, kể cả bóng người/phản chiếu. Với composite: nhân vật đúng tuổi, không cắt đầu/tay/chân bởi mép ảnh; tư thế ngồi có che khuất tự nhiên bởi bàn ghế nhưng bố cục ưu tiên đọc rõ hành động. Không dùng yêu cầu nền trắng của sprite cho scene.

---

# 🔗 CROSS-REFERENCE — NHẬN DIỆN VÀ KHÔNG GIAN

| Thành phần | Reference | Quy tắc |
|---|---|---|
| Tí | `c5_ti_neutral.png` đã duyệt; dự phòng `c4_ti_defeated.png` | Nhận diện cũ, 26t, sơ mi trắng và quần dài Chương 6; sau khi duyệt dùng `c6_ti_hopeful.png` |
| Chuyên viên | Tạo `c6_bank_advisor_professional.png` trước | Nhân vật mới, nữ 42t, navy suit, búi thấp, tai nghe phải |
| Phòng trọ | `c5_bg_rental_room_empty.png` nếu có | Giữ tường kem, cửa sổ trái/rèm hồng, giường sau, bàn phải, đồ cũ vừa phải nhưng nguyên vẹn; BG2 cuối chiều, BG4 buổi tối |
| Văn phòng công ty | BG1 mới của Chương 6 | Không dùng phòng họp offer 4,5 triệu của Chương 5 |
| Khu tư vấn ngân hàng | BG3 mới của Chương 6 | Địa điểm đầu dây chuyên viên, Tí không hiện diện |

---

# 🏞️ PHẦN A — BACKGROUND (BG) — NỀN TRỐNG, KHÔNG CÓ NHÂN VẬT

> Cả 4 BG là môi trường toàn cảnh 16:9, không người và không chữ. Gen trước composite để khóa không gian. Giữ vùng đặt sprite và vùng UI ít chi tiết, nhưng không vẽ sẵn giao diện vào nền.

---

## 📍 BG 1 — BÀN LÀM VIỆC CÔNG TY — NGÀY NHẬN LƯƠNG

### 📄 `c6_bg_salary_office_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: Nhiệm vụ 1: độc thoại Tí, đọc thông báo ngân hàng, mini-game payslip.
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_bg_salary_office_empty.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Tí đã có công việc chính thức. Dàn cảnh tại bàn làm việc vào ngày nhận lương, trước khi hiểu chênh lệch Gross/Net; không thêm đồng nghiệp hoặc HR vào cuộc thoại.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất Chương 1–5)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — ORDINARY MODERN VIETNAMESE OFFICE WORKSPACE, PAYDAY DAYTIME, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle view from INSIDE a clean ordinary office, camera facing the main workstation at a slight three-quarter angle. Left, back and right walls plus floor and ceiling visible, natural perspective, no doorway framing. Professional but not executive luxury.
>
> **LEFT WALL**: Large rectangular window with simple half-open roller blinds, daytime Vietnamese city buildings beyond, one modest potted plant beside the window. No street portraits, people or readable signs.
>
> **BACK WALL (CENTER of frame)**: Low neutral-gray office partitions and two empty workstations with ordinary monitors, a plain pale wall and closed storage cabinets. No employees, human silhouettes or portraits.
>
> **RIGHT WALL**: Simple light-wood shelving for folders, a plain wall noticeboard with abstract unlettered sheets, and a small shared water dispenser. No bank logos or company branding.
>
> **CENTER of frame**: A light-wood rectangular desk with dark metal legs, one ordinary monitor, keyboard, mouse, plain ceramic mug, closed CV folder and flat contract sheet with abstract lines. A generic smartphone rests near the right side of the desk. Ergonomic black mesh chair behind the desk; keep near-left and near-right sprite zones clear.
>
> **CEILING (TOP of frame)**: Simple white ceiling with neutral-white rectangular LED lights and a discreet air-conditioning vent, no chandeliers or decorative executive fixtures.
>
> **FLOOR (BOTTOM of frame)**: Clean medium-gray vinyl floor, tidy cable management, no scattered shopping bags or financial trophies. Low visual detail in the bottom 20% for the dialogue/mini-game interface.
>
> **ENTRANCE WALL**: Plain closed glass office door on the far-right wall, away from the lens, showing no one behind it. No doorway border.
>
> **Background atmosphere**: First stable-job optimism meeting ordinary payroll reality. The room is functional and reasonably comfortable; it is not the exploitative small-company interview room from Chapter 5.
>
> NO people, NO characters, NO sprites, NO silhouettes, NO human reflections, NO human photographs, NO DOORWAY framing the camera, NO DOORFRAME BORDER. NO text, NO title panel, NO UI, NO bank logo.
>
> **Lighting**: Soft neutral-white office LEDs with gentle daylight from the LEFT window. Daytime, clear and professional; normal brightness, no dramatic red debt warning light.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, background image ONLY, no characters; target 1920 × 1080.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, people, silhouettes, human reflections, occupied chairs, title card, parchment panel, interface, doorframe border, black margins.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 2 — PHÒNG TRỌ CUỐI CHIỀU — NHẬN CUỘC GỌI TƯ VẤN

### 📄 `c6_bg_rental_room_evening_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: Nhiệm vụ 2: đầu dây của Tí, thoại qua điện thoại và lựa chọn tiết kiệm tự động.
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_bg_rental_room_evening_empty.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Ngân hàng gọi cho Tí sau khi có thu nhập. Dàn cảnh Tí vừa về phòng sau giờ làm, cuối chiều; anh chưa đến chi nhánh và chưa bật/từ chối tiết kiệm tự động.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất Chương 1–5)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — MODEST VIETNAMESE RENTAL ROOM, OLD BUT CLEAN AND INTACT, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle camera INSIDE a roughly 12-square-meter room, with left, back and right walls, floor and ceiling visible. Entrance door sits at the far-left edge, not around the camera. This is the same modest dwelling used in Chapter 5, not a new luxury apartment.
>
> **LEFT WALL**: Small window with intact painted metal bars and a clean slightly faded pink curtain; neighboring tin roofs and electrical wires outside. Below it, a working white ceramic sink, soap dish and clean intact mirror with an aged plastic frame.
>
> **BACK WALL (CENTER of frame)**: Sturdy single wooden bed against the back wall, clean faded blue-white checkered bedding and one thin pillow. Small wooden shelf above holds used textbooks and a rolled diploma tied with a red ribbon; no readable titles.
>
> **RIGHT WALL**: Well-kept secondhand wooden desk with a few light surface scuffs, sturdy legs, simple wooden chair, older working laptop, pen holder, reusable water bottle and neatly stacked papers. A small closed savings tin sits on the shelf by the desk; no visible contents and no readable label.
>
> **CENTER of frame**: Simple open central floor area between bed and desk. Keep the left and right near-foreground clear enough for a character sprite. No random piles of bills, luxurious purchases or abandoned belongings.
>
> **CEILING (TOP of frame)**: Low approximately 2.5-meter ceiling, clean slightly aged off-white paint and a simple warm-yellow ceiling bulb. Secure neat wiring; no stains, peeling plaster or cobwebs.
>
> **FLOOR (BOTTOM of frame)**: Swept intact ivory ceramic tiles with a slightly worn matte finish. Clean cream walls gently yellowed with age and only faint furniture scuffs. A small wastebasket contains discarded paper; no scattered rubbish, cracked tiles, mold, leaks or broken furniture.
>
> **ENTRANCE WALL**: Intact dark-brown wooden door at the far-left edge, closed. The camera is inside, never peering through a doorway; no doorframe border.
>
> **Background atmosphere**: Plain and affordable, cared for and believable for a recently employed person. No signs of an upgrade to wealth, no eviction packing, no unrelated Chapter 5 emergency equipment.
>
> NO people, NO characters, NO sprites, NO silhouettes, NO human reflections, NO human photographs, NO DOORWAY framing the camera, NO DOORFRAME BORDER. NO text, NO title panel, NO UI, NO bank logo.
>
> **Lighting**: Soft late-afternoon gray-gold daylight through the LEFT window plus gentle warm-yellow ceiling light. Outside is still faintly light; the room remains modest, quiet and readable. Normal brightness for UI overlay, no wealth glow or nighttime emergency lighting.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, background image ONLY, no characters; target 1920 × 1080.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, people, silhouettes, human reflections, occupied chairs, title card, parchment panel, interface, doorframe border, black margins.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 3 — KHU TƯ VẤN NGÂN HÀNG — ĐẦU DÂY BÊN KIA

### 📄 `c6_bg_bank_advisor_office_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: Nhiệm vụ 2: nền riêng của chuyên viên khi game chuyển góc cuộc gọi; không phải điểm Tí đến.
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_bg_bank_advisor_office_empty.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Chuyên viên ngồi tại chỗ làm của ngân hàng và gọi điện cho Tí. Đây là địa điểm khác với phòng trọ; không có khách hàng ngồi đối diện.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất Chương 1–5)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — VIETNAMESE BANK REMOTE CUSTOMER-ADVICE WORKSTATION, LATE AFTERNOON, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle interior view, camera INSIDE the office at the FRONT-LEFT corner of the desk, looking diagonally toward the employee chair on the FAR side. Show left, back and right walls, floor and ceiling. Observational three-quarter angle, not a customer service counter. Camera sees the BACK casing and side edge of the monitor, NOT the display. No doorway border.
>
> **LEFT WALL**: Frosted-glass partition with a subtle plain geometric stripe, small clear upper window admitting soft late-afternoon light; no logos, silhouettes or reflections of people.
>
> **BACK WALL (CENTER of frame)**: Plain muted-blue acoustic divider behind a black mesh chair on the FAR side of the desk. Chair seat faces the desk and monitor, never the divider. Chair is centered on the keyboard-monitor working axis, not displaced sideways to the other end of the desk. Beyond it are empty workstations with coherent chair/keyboard/screen orientation; no customers or staff.
>
> **RIGHT WALL**: Low lockable filing cabinet, organized binders, a small green plant and a plain closed office door. No gold bank emblem, readable documents or marketing posters.
>
> **CENTER of frame**: Modest light-wood desk with slim legs, open legroom and NO full-height front modesty panel. WORKING ORDER from FAR side toward NEAR side: chair -> seated employee position -> keyboard -> monitor. Keyboard sits within easy reach directly in front of the chair, spacebar edge toward the chair; mouse on the seated employee's RIGHT. Monitor stands beyond the keyboard, display facing BACK toward the chair, rear casing facing the camera. Chair center, keyboard center and screen center align on ONE straight working axis. Screen stands upright at seated eye level with only 5-10 degrees backward tilt, never aimed upward at the ceiling. From the FRONT-LEFT camera, monitor appears to the RIGHT of the chair/head position so the employee's face remains visible on its LEFT. Show plain matte monitor BACK, stand and neatly routed rear cables, NO interface or display facing the viewer. Desk-phone base and unmarked notepad sit to the employee's LEFT outside the keyboard reach space. No visitor chair or customer tablet. Keep foreground clear for the dialogue sprite without displacing the workstation.
>
> **CEILING (TOP of frame)**: White ceiling with soft neutral LED panels and quiet air-conditioning vent, ordinary professional workspace rather than grand marble banking hall.
>
> **FLOOR (BOTTOM of frame)**: Clean pale-gray floor and neatly routed cables. Low-detail lower 20% for dialogue interface, no loose papers or luxury bags.
>
> **ENTRANCE WALL**: Closed plain door at the right edge, not framing the camera; no person outside and no queue of customers.
>
> **Background atmosphere**: Calm remote customer advice. The absent advisor will wear her personal right-ear headset in sprite/composite; do not draw a duplicate headset floating in the empty background.
>
> NO people, NO characters, NO sprites, NO silhouettes, NO human reflections, NO human photographs, NO DOORWAY framing the camera, NO DOORFRAME BORDER. NO text, NO title panel, NO UI, NO bank logo.
>
> **Lighting**: Soft neutral office LEDs and restrained late-afternoon daylight from the LEFT partition window. Professional and welcoming, still distinct from the warm rental-room end of the same call.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, background image ONLY, no characters; target 1920 × 1080.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, people, silhouettes, human reflections, occupied chairs, title card, parchment panel, interface, doorframe border, black margins.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 BG 4 — PHÒNG TRỌ BUỔI TỐI — XEM SAO KÊ THẺ

### 📄 `c6_bg_rental_room_night_empty.png`
**Loại**: BG (nền trống, không nhân vật)
**Dùng cho**: Nhiệm vụ 3: nền xem ứng dụng, lựa chọn thanh toán và phản hồi kết quả. Ảnh tổng kết dùng tranh biểu tượng riêng.
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_bg_rental_room_night_empty.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Kỳ sao kê đến hạn sau giai đoạn dùng thẻ quá tay. Dàn cảnh tại bàn phòng trọ buổi tối; không khẳng định đã thanh toán hay đã bị thu hồi nợ.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất Chương 1–5)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — MODEST VIETNAMESE RENTAL ROOM, OLD BUT CLEAN AND INTACT, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle camera INSIDE a roughly 12-square-meter room, with left, back and right walls, floor and ceiling visible. Entrance door sits at the far-left edge, not around the camera. This is the same modest dwelling used in Chapter 5, not a new luxury apartment.
>
> **LEFT WALL**: Small window with intact painted metal bars and a clean slightly faded pink curtain; neighboring tin roofs and electrical wires outside. Below it, a working white ceramic sink, soap dish and clean intact mirror with an aged plastic frame.
>
> **BACK WALL (CENTER of frame)**: Sturdy single wooden bed against the back wall, clean faded blue-white checkered bedding and one thin pillow. Small wooden shelf above holds used textbooks and a rolled diploma tied with a red ribbon; no readable titles.
>
> **RIGHT WALL**: Well-kept secondhand wooden desk with a few light surface scuffs, sturdy legs, simple wooden chair, older working laptop, pen holder, reusable water bottle and neatly stacked papers. A small closed savings tin sits on the shelf by the desk; no visible contents and no readable label.
>
> **CENTER of frame**: Simple open central floor area between bed and desk. Keep the left and right near-foreground clear enough for a character sprite. No random piles of bills, luxurious purchases or abandoned belongings.
>
> **CEILING (TOP of frame)**: Low approximately 2.5-meter ceiling, clean slightly aged off-white paint and a simple warm-yellow ceiling bulb. Secure neat wiring; no stains, peeling plaster or cobwebs.
>
> **FLOOR (BOTTOM of frame)**: Swept intact ivory ceramic tiles with a slightly worn matte finish. Clean cream walls gently yellowed with age and only faint furniture scuffs. A small wastebasket contains discarded paper; no scattered rubbish, cracked tiles, mold, leaks or broken furniture.
>
> **ENTRANCE WALL**: Intact dark-brown wooden door at the far-left edge, closed. The camera is inside, never peering through a doorway; no doorframe border.
>
> **Background atmosphere**: Plain and affordable, cared for and believable for a recently employed person. No signs of an upgrade to wealth, no eviction packing, no unrelated Chapter 5 emergency equipment.
>
> **Desk props for this moment**: A plain unmarked bank card, neatly folded statement and generic smartphone rest on the right-side desk. No visible card digits, confirmed payment, overdue warning or readable financial data.
>
> NO people, NO characters, NO sprites, NO silhouettes, NO human reflections, NO human photographs, NO DOORWAY framing the camera, NO DOORFRAME BORDER. NO text, NO title panel, NO UI, NO bank logo.
>
> **Lighting**: Warm-yellow ceiling bulb and a small warm desk lamp on the RIGHT desk, with deep blue-black night beyond the LEFT window. Keep the room layout identical to the afternoon call background; only time, lights and desk props change. Moderate readable contrast, no horror, red flashing alarm or dawn light.
>
> **Aspect ratio**: 16:9 widescreen FULL-BLEED EDGE-TO-EDGE, background image ONLY, no characters; target 1920 × 1080.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, people, silhouettes, human reflections, occupied chairs, title card, parchment panel, interface, doorframe border, black margins.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 🎬 PHẦN B — SCENE COMPOSITE (CÓ NHÂN VẬT — DÙNG CHO NARRATOR)

> Bốn scene minh họa các thời điểm kể chuyện; hai scene cuộc gọi thuộc cùng nhiệm vụ 2 và hai địa điểm khác nhau. Tất cả giữ tình huống trước quyết định, không chọn hộ người chơi. Dữ liệu tài chính đặt trong UI/thoại.

---

## 📍 SCENE 1 — CÚ SỐC GROSS VÀ NET

### 📄 `c6_scene_salary_gross_net.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Tí vừa đọc thông báo lương thực nhận, bất ngờ so với số Gross trong hợp đồng; trước mini-game tìm hiểu payslip.
**Nhân vật trong ảnh**: Tí 26t, một mình
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_scene_salary_gross_net.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Tí vừa đọc thông báo lương thực nhận, bất ngờ so với số Gross trong hợp đồng; trước mini-game tìm hiểu payslip.

**🔗 CROSS-REFERENCE**:
- BG cùng không gian: `c6_bg_salary_office_empty.png` (BG1).
- Nhân vật: `c6_ti_hopeful.png` đã duyệt; mô tả đầy đủ được lặp ngay trong prompt.
- **Giao diện sau scene**: UI/thoại hiển thị Gross 18.000.000đ, thực nhận 15.250.000đ. Sau scene chuyển BG1 để mở mini-game payslip; không coi ảnh composite là mini-game.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất các BG)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — ORDINARY MODERN VIETNAMESE OFFICE WORKSPACE, PAYDAY DAYTIME, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle view from INSIDE a clean ordinary office, camera facing the main workstation at a slight three-quarter angle. Left, back and right walls plus floor and ceiling visible, natural perspective, no doorway framing. Professional but not executive luxury.
>
> **LEFT WALL**: Large rectangular window with simple half-open roller blinds, daytime Vietnamese city buildings beyond, one modest potted plant beside the window. No street portraits, people or readable signs.
>
> **BACK WALL (CENTER of frame)**: Low neutral-gray office partitions and two empty workstations with ordinary monitors, a plain pale wall and closed storage cabinets. No employees, human silhouettes or portraits.
>
> **RIGHT WALL**: Simple light-wood shelving for folders, a plain wall noticeboard with abstract unlettered sheets, and a small shared water dispenser. No bank logos or company branding.
>
> **CENTER of frame**: A light-wood rectangular desk with dark metal legs, one ordinary monitor, keyboard, mouse, plain ceramic mug, closed CV folder and flat contract sheet with abstract lines. A generic smartphone rests near the right side of the desk. Ergonomic black mesh chair behind the desk; keep near-left and near-right sprite zones clear.
>
> **CEILING (TOP of frame)**: Simple white ceiling with neutral-white rectangular LED lights and a discreet air-conditioning vent, no chandeliers or decorative executive fixtures.
>
> **FLOOR (BOTTOM of frame)**: Clean medium-gray vinyl floor, tidy cable management, no scattered shopping bags or financial trophies. Low visual detail in the bottom 20% for the dialogue/mini-game interface.
>
> **ENTRANCE WALL**: Plain closed glass office door on the far-right wall, away from the lens, showing no one behind it. No doorway border.
>
> **Background atmosphere**: First stable-job optimism meeting ordinary payroll reality. The room is functional and reasonably comfortable; it is not the exploitative small-company interview room from Chapter 5.
>
> **FOCAL CHARACTER — FULL CHARACTER REFERENCE**: a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression**: SURPRISED CONFUSION: medium eyes slightly wider, eyebrows raised inward, lips parted a little, healthy face with no cartoon exaggeration. This is a questioning moment, not anger toward an invented employer character.
>
> **Pose and framing**: Ti sits naturally on the black mesh chair at his own desk, seen in a wide three-quarter view. RIGHT hand holds the plain smartphone at chest height, screen angled toward him; LEFT hand rests beside the flat contract sheet, watch visible. Head, hands, knees and both loafer-clad feet stay inside the frame; desk placement must not hide the face or hands. Ti occupies about 50–60% of frame height.
>
> **Story props and action boundary**: A plain contract sheet and a generic bank notification on the phone use only abstract lines and color blocks. No readable amounts, tiny generated payslip or fake legal terms. Leave the lower part visually quiet for game text. No extra HR, boss or adviser in this scene.
>
> **Lighting**: Soft neutral-white office LEDs with gentle daylight from the LEFT window. Daytime, clear and professional; normal brightness, no dramatic red debt warning light.
>
> **Aspect ratio**: 16:9 cinematic widescreen, target 1920 × 1080. Full environment fills the frame; no white backdrop, no cut-off head/hands/feet at image edges. Exactly ONE main character; no other people or silhouettes.
>
> **CRITICAL IDENTITY AND CONTINUITY**: Keep the exact age, face, hairstyle and complete outfit specified above. Match furniture placement and time-of-day lighting. No readable text on paper or screens, no invented success/failure state, no title panel, no additional interface baked into this composite.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, additional people, split screen, fictional transaction confirmation, luxury upgrade, title card, parchment panel, human silhouettes, black margins, doorway border.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 2A — CUỘC GỌI TƯ VẤN — PHÍA TÍ

### 📄 `c6_scene_savings_call_ti.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Tí nghe chuyên viên đề xuất tiết kiệm tự động sau giờ làm; chưa chọn bật hay bỏ qua.
**Nhân vật trong ảnh**: Tí 26t, một mình
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_scene_savings_call_ti.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Tí nghe chuyên viên đề xuất tiết kiệm tự động sau giờ làm; chưa chọn bật hay bỏ qua.

**🔗 CROSS-REFERENCE**:
- BG cùng không gian: `c6_bg_rental_room_evening_empty.png` (BG2).
- Nhân vật: `c6_ti_hopeful.png` đã duyệt; mô tả đầy đủ được lặp ngay trong prompt.
- **Giao diện sau scene**: Thoại ngân hàng là cuộc gọi từ xa. Sau scene dùng BG2 + sprite Tí; chuyên viên dùng ô cuộc gọi riêng hoặc BG3. Không cho hai sprite đứng cùng một căn phòng.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất các BG)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — MODEST VIETNAMESE RENTAL ROOM, OLD BUT CLEAN AND INTACT, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle camera INSIDE a roughly 12-square-meter room, with left, back and right walls, floor and ceiling visible. Entrance door sits at the far-left edge, not around the camera. This is the same modest dwelling used in Chapter 5, not a new luxury apartment.
>
> **LEFT WALL**: Small window with intact painted metal bars and a clean slightly faded pink curtain; neighboring tin roofs and electrical wires outside. Below it, a working white ceramic sink, soap dish and clean intact mirror with an aged plastic frame.
>
> **BACK WALL (CENTER of frame)**: Sturdy single wooden bed against the back wall, clean faded blue-white checkered bedding and one thin pillow. Small wooden shelf above holds used textbooks and a rolled diploma tied with a red ribbon; no readable titles.
>
> **RIGHT WALL**: Well-kept secondhand wooden desk with a few light surface scuffs, sturdy legs, simple wooden chair, older working laptop, pen holder, reusable water bottle and neatly stacked papers. A small closed savings tin sits on the shelf by the desk; no visible contents and no readable label.
>
> **CENTER of frame**: Simple open central floor area between bed and desk. Keep the left and right near-foreground clear enough for a character sprite. No random piles of bills, luxurious purchases or abandoned belongings.
>
> **CEILING (TOP of frame)**: Low approximately 2.5-meter ceiling, clean slightly aged off-white paint and a simple warm-yellow ceiling bulb. Secure neat wiring; no stains, peeling plaster or cobwebs.
>
> **FLOOR (BOTTOM of frame)**: Swept intact ivory ceramic tiles with a slightly worn matte finish. Clean cream walls gently yellowed with age and only faint furniture scuffs. A small wastebasket contains discarded paper; no scattered rubbish, cracked tiles, mold, leaks or broken furniture.
>
> **ENTRANCE WALL**: Intact dark-brown wooden door at the far-left edge, closed. The camera is inside, never peering through a doorway; no doorframe border.
>
> **Background atmosphere**: Plain and affordable, cared for and believable for a recently employed person. No signs of an upgrade to wealth, no eviction packing, no unrelated Chapter 5 emergency equipment.
>
> **FOCAL CHARACTER — FULL CHARACTER REFERENCE**: a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression**: ATTENTIVE THOUGHTFUL LISTENING: steady eyes, relaxed eyebrows slightly drawn together in concentration, small neutral mouth. No celebration, no confirmed savings outcome.
>
> **Pose and framing**: Ti sits on the simple chair at the right-side desk, torso turned three-quarter toward the camera. RIGHT hand holds the phone at his RIGHT ear, LEFT hand relaxed on the desk with the black-strap watch visible. His white shirt remains tucked into full-length dark-gray trousers; both black loafers visible below the chair, no shorts or home-clothing swap. Full head, hands and feet inside frame; person about 50–60% of frame height.
>
> **Story props and action boundary**: Closed laptop or a neutral unlettered screen, unmarked notepad, pen and closed savings tin; no successful-transfer badge or visible account balance. The adviser is NOT in this room. Do not add a floating video caller or split screen inside this image: that is game UI if needed.
>
> **Lighting**: Soft late-afternoon gray-gold daylight through the LEFT window plus gentle warm-yellow ceiling light. Outside is still faintly light; the room remains modest, quiet and readable. Normal brightness for UI overlay, no wealth glow or nighttime emergency lighting.
>
> **Aspect ratio**: 16:9 cinematic widescreen, target 1920 × 1080. Full environment fills the frame; no white backdrop, no cut-off head/hands/feet at image edges. Exactly ONE main character; no other people or silhouettes.
>
> **CRITICAL IDENTITY AND CONTINUITY**: Keep the exact age, face, hairstyle and complete outfit specified above. Match furniture placement and time-of-day lighting. No readable text on paper or screens, no invented success/failure state, no title panel, no additional interface baked into this composite.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, additional people, split screen, fictional transaction confirmation, luxury upgrade, title card, parchment panel, human silhouettes, black margins, doorway border.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 2B — CUỘC GỌI TƯ VẤN — PHÍA CHUYÊN VIÊN

### 📄 `c6_scene_savings_call_advisor.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Góc cắt phía ngân hàng trong cùng cuộc gọi nhiệm vụ 2; chuyên viên giải thích nguyên tắc trích tiết kiệm trước chi tiêu.
**Nhân vật trong ảnh**: Chuyên viên ngân hàng nữ 42t, một mình
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_scene_savings_call_advisor.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Góc cắt phía ngân hàng trong cùng cuộc gọi nhiệm vụ 2; chuyên viên giải thích nguyên tắc trích tiết kiệm trước chi tiêu.

**🔗 CROSS-REFERENCE**:
- BG cùng không gian: `c6_bg_bank_advisor_office_empty.png` (BG3).
- Nhân vật: `c6_bank_advisor_professional.png` đã duyệt; mô tả đầy đủ được lặp ngay trong prompt.
- **Giao diện sau scene**: Chuyên viên đề xuất 20% trong lời thoại; lựa chọn A của nguồn là trích tự động 3.000.000đ/tháng. Không hiển thị dấu bằng giữa hai số này.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất các BG)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — VIETNAMESE BANK REMOTE CUSTOMER-ADVICE WORKSTATION, LATE AFTERNOON, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle interior view, camera INSIDE the office at the FRONT-LEFT corner of the desk, looking diagonally toward the employee chair on the FAR side. Show left, back and right walls, floor and ceiling. Observational three-quarter angle, not a customer service counter. Camera sees the BACK casing and side edge of the monitor, NOT the display. No doorway border.
>
> **LEFT WALL**: Frosted-glass partition with a subtle plain geometric stripe, small clear upper window admitting soft late-afternoon light; no logos, silhouettes or reflections of people.
>
> **BACK WALL (CENTER of frame)**: Plain muted-blue acoustic divider behind a black mesh chair on the FAR side of the desk. Chair seat faces the desk and monitor, never the divider. Chair is centered on the keyboard-monitor working axis, not displaced sideways to the other end of the desk. Beyond it are empty workstations with coherent chair/keyboard/screen orientation; no customers or staff.
>
> **RIGHT WALL**: Low lockable filing cabinet, organized binders, a small green plant and a plain closed office door. No gold bank emblem, readable documents or marketing posters.
>
> **CENTER of frame**: Modest light-wood desk with slim legs, open legroom and NO full-height front modesty panel. WORKING ORDER from FAR side toward NEAR side: chair -> seated employee position -> keyboard -> monitor. Keyboard sits within easy reach directly in front of the chair, spacebar edge toward the chair; mouse on the seated employee's RIGHT. Monitor stands beyond the keyboard, display facing BACK toward the chair, rear casing facing the camera. Chair center, keyboard center and screen center align on ONE straight working axis. Screen stands upright at seated eye level with only 5-10 degrees backward tilt, never aimed upward at the ceiling. From the FRONT-LEFT camera, monitor appears to the RIGHT of the chair/head position so the employee's face remains visible on its LEFT. Show plain matte monitor BACK, stand and neatly routed rear cables, NO interface or display facing the viewer. Desk-phone base and unmarked notepad sit to the employee's LEFT outside the keyboard reach space. No visitor chair or customer tablet. Keep foreground clear for the dialogue sprite without displacing the workstation.
>
> **CEILING (TOP of frame)**: White ceiling with soft neutral LED panels and quiet air-conditioning vent, ordinary professional workspace rather than grand marble banking hall.
>
> **FLOOR (BOTTOM of frame)**: Clean pale-gray floor and neatly routed cables. Low-detail lower 20% for dialogue interface, no loose papers or luxury bags.
>
> **ENTRANCE WALL**: Closed plain door at the right edge, not framing the camera; no person outside and no queue of customers.
>
> **Background atmosphere**: Calm remote customer advice. The seated advisor wears her personal right-ear headset; no duplicate headset on the desk or floating in the room.
>
> **FOCAL CHARACTER — FULL CHARACTER REFERENCE**: a 42-year-old Vietnamese woman (bank financial advisor, age-locked 42), height 163 cm, average healthy proportional build, oval face with gently rounded jaw, warm medium-beige skin, medium dark-brown eyes and subtle natural age shading, no exaggerated wrinkles. Black hair parted slightly to the side and gathered into a neat LOW BUN at the nape, not a ponytail. Thin black rectangular glasses, calm approachable professional presence. New character, distinct from Chapter 5 HR: older face, low bun, navy trouser suit and work headset. Outfit: navy-blue fitted single-breasted blazer (#263b55), worn open over an ivory long-sleeve blouse (#f2eee5) with a simple round neckline; matching navy full-length straight-leg tailored trousers (#263b55), hems at ankles; plain black closed-toe low block-heel shoes (#222222, 3 cm heel); thin black rectangular eyeglasses; a small black single-ear work headset (#222222) over the RIGHT ear with microphone toward the mouth; tiny round silver stud earrings. NO bank logo, NO name badge, NO necklace, NO extra handset or smartwatch. Keep identical clothing, glasses and headset position in all portraits and the bank-side call scene.
>
> **Expression**: PATIENT PROFESSIONAL EXPLANATION: natural focused eyes through glasses, slightly raised eyebrows, small open speaking mouth, calm reassuring face. Not a salesperson promising wealth.
>
> **Pose and framing**: The adviser sits in the FAR-side black mesh chair, torso and knees aligned with keyboard and monitor. She faces the display, which faces her, not the camera. Her face remains readable in three-quarter view to the LEFT of the monitor. Black headset on RIGHT ear. LEFT palm open in a small explaining gesture; RIGHT hand on the mouse beside the keyboard within easy forearm reach. Both feet naturally on the floor below the open-legroom desk. No sideways displaced chair, no torso twisted toward an oppositely facing keyboard. Whole head, both hands and shoes remain within image edges; natural partial furniture occlusion is allowed, never distort the workstation to expose knees. Person about 50-60% of image height. Navy suit and ivory blouse exactly as character reference.
>
> **Story props and action boundary**: Monitor display faces the adviser and is hidden from the camera; show only plain rear casing and a narrow side edge, NO visible banking interface. Unmarked notepad and desk phone base stay on the employee's LEFT. NO Ti, NO visiting customer, NO tablet demonstration across a counter, NO handheld telephone added on top of the headset. This is a separate bank location reached by a visual cut, not the same physical room as Ti.
>
> **Lighting**: Soft neutral office LEDs and restrained late-afternoon daylight from the LEFT partition window. Professional and welcoming, still distinct from the warm rental-room end of the same call.
>
> **Aspect ratio**: 16:9 cinematic widescreen, target 1920 × 1080. Full environment fills the frame; no white backdrop, no cut-off head/hands/feet at image edges. Exactly ONE main character; no other people or silhouettes.
>
> **CRITICAL IDENTITY AND CONTINUITY**: Keep the exact age, face, hairstyle and complete outfit specified above. Match furniture placement and time-of-day lighting. No readable text on paper or screens, no invented success/failure state, no title panel, no additional interface baked into this composite.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, additional people, split screen, fictional transaction confirmation, luxury upgrade, title card, parchment panel, human silhouettes, black margins, doorway border.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

## 📍 SCENE 3 — BẪY THANH TOÁN TỐI THIỂU — TRƯỚC LỰA CHỌN

### 📄 `c6_scene_credit_card_statement.png`
**Loại**: SCENE (composite, có nhân vật)
**Dùng cho**: `narrator` — Tí xem sao kê đến hạn và cân nhắc trả tối thiểu hay toàn bộ; chưa nhấn xác nhận.
**Nhân vật trong ảnh**: Tí 26t, một mình
**Aspect**: 16:9
**Output**: `images/chuong-6/c6_scene_credit_card_statement.png`

**📍 BỐI CẢNH CỐT TRUYỆN**: Tí xem sao kê đến hạn và cân nhắc trả tối thiểu hay toàn bộ; chưa nhấn xác nhận.

**🔗 CROSS-REFERENCE**:
- BG cùng không gian: `c6_bg_rental_room_night_empty.png` (BG4).
- Nhân vật: `c6_ti_hopeful.png` đã duyệt; mô tả đầy đủ được lặp ngay trong prompt.
- **Giao diện sau scene**: UI hiển thị dư nợ 6.000.000đ, tối thiểu 300.000đ; nhánh A còn 5.700.000đ gốc, lãi 30%/năm theo nguồn; nhánh B trả toàn bộ. Không tạo cảnh riêng áp đặt lựa chọn trước khi người chơi chọn.

> **STYLE TOKEN + ANTI-DISTORTION + NEGATIVE (đầy đủ, thống nhất các BG)**:
>
> Kawaii 2D cartoon style, **Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS** (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, **no text, no watermark**. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.
>
> CRITICAL anti-distortion: face proportions stay NORMAL across ALL characters and emotions — do NOT enlarge the head, widen the mouth, stretch the face or bug-eye the eyes. Keep head size, facial structure, age, height and build consistent with the approved character reference. Hands must have natural anatomy; no extra fingers or limbs.

> **Setting (BG kawaii cartoon environment — MODEST VIETNAMESE RENTAL ROOM, OLD BUT CLEAN AND INTACT, FULL-BLEED EDGE-TO-EDGE INTERIOR VIEW, NO DOORWAY)**: Wide-angle camera INSIDE a roughly 12-square-meter room, with left, back and right walls, floor and ceiling visible. Entrance door sits at the far-left edge, not around the camera. This is the same modest dwelling used in Chapter 5, not a new luxury apartment.
>
> **LEFT WALL**: Small window with intact painted metal bars and a clean slightly faded pink curtain; neighboring tin roofs and electrical wires outside. Below it, a working white ceramic sink, soap dish and clean intact mirror with an aged plastic frame.
>
> **BACK WALL (CENTER of frame)**: Sturdy single wooden bed against the back wall, clean faded blue-white checkered bedding and one thin pillow. Small wooden shelf above holds used textbooks and a rolled diploma tied with a red ribbon; no readable titles.
>
> **RIGHT WALL**: Well-kept secondhand wooden desk with a few light surface scuffs, sturdy legs, simple wooden chair, older working laptop, pen holder, reusable water bottle and neatly stacked papers. A small closed savings tin sits on the shelf by the desk; no visible contents and no readable label.
>
> **CENTER of frame**: Simple open central floor area between bed and desk. Keep the left and right near-foreground clear enough for a character sprite. No random piles of bills, luxurious purchases or abandoned belongings.
>
> **CEILING (TOP of frame)**: Low approximately 2.5-meter ceiling, clean slightly aged off-white paint and a simple warm-yellow ceiling bulb. Secure neat wiring; no stains, peeling plaster or cobwebs.
>
> **FLOOR (BOTTOM of frame)**: Swept intact ivory ceramic tiles with a slightly worn matte finish. Clean cream walls gently yellowed with age and only faint furniture scuffs. A small wastebasket contains discarded paper; no scattered rubbish, cracked tiles, mold, leaks or broken furniture.
>
> **ENTRANCE WALL**: Intact dark-brown wooden door at the far-left edge, closed. The camera is inside, never peering through a doorway; no doorframe border.
>
> **Background atmosphere**: Plain and affordable, cared for and believable for a recently employed person. No signs of an upgrade to wealth, no eviction packing, no unrelated Chapter 5 emergency equipment.
>
> **FOCAL CHARACTER — FULL CHARACTER REFERENCE**: a 26-year-old Vietnamese man (Tí, age-locked 26), height 172 cm, healthy balanced slim build, warm light-beige skin, clean-shaven, recognizable slightly elongated face and defined but not gaunt jaw, medium dark-brown eyes, natural nose and mouth, short black hair neatly slicked back. Preserve the recognizable face, hairline, skin tone and height of the approved c5_ti_neutral.png; if unavailable use c4_ti_defeated.png for identity only. He looks a little more settled as a working adult, NOT a redesigned person, NOT a teenager and NOT a 35-year-old. No deep eye bags, illness, hollow cheeks or extreme muscularity. Outfit: clean white long-sleeve button-down cotton shirt (#f5f5f0), regular fit, collar open one button, sleeves down with cuffs buttoned, tucked into dark-gray full-length straight-leg trousers (#4a4a4a), hems reaching the ankles, no rolled cuffs; thin black leather belt (#222222) with small silver buckle; plain black leather loafers (#222222) and dark-gray socks; a modest round watch with black leather strap on LEFT wrist, silver case and dark face. NO blazer, NO tie, NO employee badge, NO bag worn on the body, NO shorts, NO ripped clothing. Keep identical colors, sleeve length, trouser length, shoes and watch across every portrait and scene, including the room after work.
>
> **Expression**: WORRIED HESITATION: eyes focused downward toward phone, gently furrowed brows, small tight mouth; a healthy adult considering a difficult decision, not a sick or defeated Chapter 5 patient.
>
> **Pose and framing**: Ti sits at the right-side desk under the warm lamp, three-quarter view. RIGHT hand holds the phone slightly above the desk; LEFT hand rests nearby without touching a payment button, watch on left wrist. Head, both hands and both trouser-covered legs with black loafers fit inside frame. Keep a wide environmental view; Ti roughly 50–60% of frame height, not a phone close-up.
>
> **Story props and action boundary**: Generic smartphone with two unselected abstract option shapes, unmarked folded statement and a plain bank card without visible name, logo, digits or security code. Do not draw debt paid, success checkmark, overdue collector or debt-free celebration. Exact amounts and buttons belong to game UI, not the raster scene.
>
> **Lighting**: Warm-yellow ceiling bulb and a small warm desk lamp on the RIGHT desk, with deep blue-black night beyond the LEFT window. Keep the room layout identical to the afternoon call background; only time, lights and desk props change. Moderate readable contrast, no horror, red flashing alarm or dawn light.
>
> **Aspect ratio**: 16:9 cinematic widescreen, target 1920 × 1080. Full environment fills the frame; no white backdrop, no cut-off head/hands/feet at image edges. Exactly ONE main character; no other people or silhouettes.
>
> **CRITICAL IDENTITY AND CONTINUITY**: Keep the exact age, face, hairstyle and complete outfit specified above. Match furniture placement and time-of-day lighting. No readable text on paper or screens, no invented success/failure state, no title panel, no additional interface baked into this composite.
>
> **Negative prompt**: text, watermark, logo, blurry, low quality, deformed hands, extra fingers, extra limbs, distorted face, oversized head, baby-face, toddler proportions, chibi-3-head-body, kawaii blush circles, photorealistic, semi-realistic, 3D render, wrong age, inconsistent outfit, cropped head, cropped feet, duplicate character, additional people, split screen, fictional transaction confirmation, luxury upgrade, title card, parchment panel, human silhouettes, black margins, doorway border.

> **⭐ KẾT THÚC PROMPT COPY-PASTE ⭐**

---

# 🪧 PHẦN C — ẢNH TIÊU ĐỀ NHIỆM VỤ VÀ TỔNG KẾT CHƯƠNG

> **Bộ thiết kế theo mẫu**: bảng giấy kem `#f2e4cf`, viền gỗ nâu `#805535`, chữ serif đậm nâu `#3b2417`, nằm chính giữa nền 16:9. Cùng kiểu bảng và kiểu chữ qua cả 4 ảnh. Nền mỗi ảnh phải đúng địa điểm và thời điểm nhiệm vụ đó xuất hiện; được mô tả đầy đủ ngay trong khối copy.
>
> **Tên hiển thị**: Nhiệm vụ 1, 2, 3; không ghi Mission hoặc số ghép 6.1/6.2/6.3 trên ảnh. Giữ “Pay Yourself First” vì đó là tên nguyên tắc trong cốt truyện; nhãn nhiệm vụ vẫn là tiếng Việt. **Không có ảnh Sự kiện bất ngờ** vì Chương 6 trong nguồn không có sự kiện riêng.
>
> Mỗi prompt có style đầy đủ, ngữ cảnh, tường/cửa/nội thất, ánh sáng, đồ vật tại thời điểm đó, bố cục và chữ. Không cần copy thêm BG hoặc tham khảo prompt phía trên. Đừng nối negative `text` hoặc quy tắc `no text` vào prompt tiêu đề.

---

## 🪧 NHIỆM VỤ 1 — CÚ SỐC GROSS VÀ NET

### 📄 `bg_nhiem_vu_1.png`
**Loại**: Ảnh nền tiêu đề, không nhân vật, có chữ lớn ở giữa
**Dùng cho**: Ngay trước thông báo lương ở nhiệm vụ 1; văn phòng ban ngày.
**Aspect**: 16:9
**Output**: `images/chuong-6/bg_nhiem_vu_1.png`
**Chữ chính xác**: `Nhiệm vụ 1: Cú sốc Gross và Net`

```text
Create ONE full-bleed 16:9 landscape PNG title background, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the exact specified Vietnamese title, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL TITLE RULE: This is an environment-only illustration. NO people, NO sprites, NO silhouettes, NO human reflections. Render the EXACT title specified below; a no-text rule from ordinary backgrounds does NOT apply here.

STORY CONTEXT AND EXACT APPEARANCE: Chapter 6, the start of Mission 1, immediately before Ti notices the difference between the gross salary in his contract and the actual bank deposit. He already has a formal job. Use the new company workstation on payday during daytime, NOT the Chapter 5 interview room. No character or chosen outcome is shown.

SETTING AND CAMERA: ORDINARY MODERN VIETNAMESE OFFICE WORKSPACE, PAYDAY DAYTIME. Wide-angle view from INSIDE a clean ordinary office, camera facing the main workstation at a slight three-quarter angle. Left, back and right walls plus floor and ceiling visible, natural perspective, no doorway framing. Professional but not executive luxury.

LEFT WALL: Large rectangular window with simple half-open roller blinds, daytime Vietnamese city buildings beyond, one modest potted plant beside the window. No street portraits, people or readable signs.

BACK WALL: Low neutral-gray office partitions and two empty workstations with ordinary monitors, a plain pale wall and closed storage cabinets. No employees, human silhouettes or portraits.

RIGHT WALL: Simple light-wood shelving for folders, a plain wall noticeboard with abstract unlettered sheets, and a small shared water dispenser. No bank logos or company branding.

CENTER: A light-wood rectangular desk with dark metal legs, one ordinary monitor, keyboard, mouse, plain ceramic mug, closed CV folder and flat contract sheet with abstract lines. A generic smartphone rests near the right side of the desk. Ergonomic black mesh chair behind the desk; keep near-left and near-right sprite zones clear.

CEILING: Simple white ceiling with neutral-white rectangular LED lights and a discreet air-conditioning vent, no chandeliers or decorative executive fixtures.

FLOOR: Clean medium-gray vinyl floor, tidy cable management, no scattered shopping bags or financial trophies. Low visual detail in the bottom 20% for the dialogue/mini-game interface.

ENTRANCE: Plain closed glass office door on the far-right wall, away from the lens, showing no one behind it. No doorway border.

LIGHTING AND ATMOSPHERE: Soft neutral-white office LEDs with gentle daylight from the LEFT window. Daytime, clear and professional; normal brightness, no dramatic red debt warning light. First stable-job optimism meeting ordinary payroll reality. The room is functional and reasonably comfortable; it is not the exploitative small-company interview room from Chapter 5.

MOMENT-SPECIFIC PROPS AND CONTINUITY: Show the plain contract sheet, generic smartphone and ordinary monitor around the panel. No readable salaries, payslip deductions or celebratory promotion trophy. This title prepares the payroll question, not its explanation or solution.

SELF-CONTAINED CONTINUITY RULE: The location, time, architecture, furniture, atmosphere and props above fully define this image. Do not substitute another chapter’s location or imply a future outcome. Reference images, if attached, only help match details; this prompt can be copied and used by itself.

COMPOSITION: A matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535) is centered horizontally and vertically, front-facing without perspective skew. Panel covers about 72% of image width and 46% of image height. It is a graphic overlay, not a physical sign installed in the room. Keep distinctive room landmarks visible around it. Subtle rounded paper corners and a soft shadow; the actual image stays rectangular with no black margins. All letters stay at least 10% from image edges and do not touch props.

RENDER THIS EXACT TEXT, centered with these line breaks:
Nhiệm vụ 1:
Cú sốc Gross và Net

TYPOGRAPHY: Large bold storybook serif with full Vietnamese diacritics and high contrast, dark brown (#3b2417) on cream. The first line is about 70% of the mission-name font size; subsequent name lines are equally large and dominant. Use generous spacing, not ornate illegible calligraphy. Preserve every Vietnamese accent, number and punctuation mark, including the colon in the mission label and the curly quotation marks around Pay Yourself First when specified. Do not translate or abbreviate the title. The specified title is the ONLY readable text in the image; papers, screens and cards remain abstract.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, no cropped panel or letters.

NEGATIVE: missing title, blank sign, wrong mission number, Mission label, chapter-prefixed mission number, numbered event label, extra captions, misspelled Vietnamese, missing diacritics, tiny text, illegible lettering, overlapping letters, cropped title, title hidden by objects, people, silhouettes, human reflections, bank logo, watermark, photorealism, 3D render, black margins, rounded outer image crop, invented transaction success or failure.
```

---

## 🪧 NHIỆM VỤ 2 — QUY TẮC “PAY YOURSELF FIRST”

### 📄 `bg_nhiem_vu_2.png`
**Loại**: Ảnh nền tiêu đề, không nhân vật, có chữ lớn ở giữa
**Dùng cho**: Ngay trước cuộc gọi tư vấn ở nhiệm vụ 2; đầu dây Tí tại phòng trọ cuối chiều.
**Aspect**: 16:9
**Output**: `images/chuong-6/bg_nhiem_vu_2.png`
**Chữ chính xác**: `Nhiệm vụ 2: Quy tắc “Pay Yourself First”`

```text
Create ONE full-bleed 16:9 landscape PNG title background, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the exact specified Vietnamese title, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL TITLE RULE: This is an environment-only illustration. NO people, NO sprites, NO silhouettes, NO human reflections. Render the EXACT title specified below; a no-text rule from ordinary backgrounds does NOT apply here.

STORY CONTEXT AND EXACT APPEARANCE: Chapter 6, the start of Mission 2, when a bank adviser calls Ti after he has begun earning a salary. The image is anchored at Ti’s end of the call in his modest rental room after work in the late afternoon, before he chooses automatic savings or spending first. Do NOT relocate Ti to a bank branch or show an adviser beside him.

SETTING AND CAMERA: MODEST VIETNAMESE RENTAL ROOM, OLD BUT CLEAN AND INTACT. Wide-angle camera INSIDE a roughly 12-square-meter room, with left, back and right walls, floor and ceiling visible. Entrance door sits at the far-left edge, not around the camera. This is the same modest dwelling used in Chapter 5, not a new luxury apartment.

LEFT WALL: Small window with intact painted metal bars and a clean slightly faded pink curtain; neighboring tin roofs and electrical wires outside. Below it, a working white ceramic sink, soap dish and clean intact mirror with an aged plastic frame.

BACK WALL: Sturdy single wooden bed against the back wall, clean faded blue-white checkered bedding and one thin pillow. Small wooden shelf above holds used textbooks and a rolled diploma tied with a red ribbon; no readable titles.

RIGHT WALL: Well-kept secondhand wooden desk with a few light surface scuffs, sturdy legs, simple wooden chair, older working laptop, pen holder, reusable water bottle and neatly stacked papers. A small closed savings tin sits on the shelf by the desk; no visible contents and no readable label.

CENTER: Simple open central floor area between bed and desk. Keep the left and right near-foreground clear enough for a character sprite. No random piles of bills, luxurious purchases or abandoned belongings.

CEILING: Low approximately 2.5-meter ceiling, clean slightly aged off-white paint and a simple warm-yellow ceiling bulb. Secure neat wiring; no stains, peeling plaster or cobwebs.

FLOOR: Swept intact ivory ceramic tiles with a slightly worn matte finish. Clean cream walls gently yellowed with age and only faint furniture scuffs. A small wastebasket contains discarded paper; no scattered rubbish, cracked tiles, mold, leaks or broken furniture.

ENTRANCE: Intact dark-brown wooden door at the far-left edge, closed. The camera is inside, never peering through a doorway; no doorframe border.

LIGHTING AND ATMOSPHERE: Soft late-afternoon gray-gold daylight through the LEFT window plus gentle warm-yellow ceiling light. Outside is still faintly light; the room remains modest, quiet and readable. Normal brightness for UI overlay, no wealth glow or nighttime emergency lighting. Plain and affordable, cared for and believable for a recently employed person. No signs of an upgrade to wealth, no eviction packing, no unrelated Chapter 5 emergency equipment.

MOMENT-SPECIFIC PROPS AND CONTINUITY: Place a generic smartphone with a small abstract incoming-call symbol on the right-side desk, beside an unmarked notepad and the closed savings tin. No contact name, account balance, savings percentage, readable digits or confirmed automatic-transfer checkmark. The room is old but clean and intact. This is a remote call, not a bank appointment.

SELF-CONTAINED CONTINUITY RULE: The location, time, architecture, furniture, atmosphere and props above fully define this image. Do not substitute another chapter’s location or imply a future outcome. Reference images, if attached, only help match details; this prompt can be copied and used by itself.

COMPOSITION: A matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535) is centered horizontally and vertically, front-facing without perspective skew. Panel covers about 78% of image width and 52% of image height. It is a graphic overlay, not a physical sign installed in the room. Keep distinctive room landmarks visible around it. Subtle rounded paper corners and a soft shadow; the actual image stays rectangular with no black margins. All letters stay at least 10% from image edges and do not touch props.

RENDER THIS EXACT TEXT, centered with these line breaks:
Nhiệm vụ 2:
Quy tắc
“Pay Yourself First”

TYPOGRAPHY: Large bold storybook serif with full Vietnamese diacritics and high contrast, dark brown (#3b2417) on cream. The first line is about 70% of the mission-name font size; subsequent name lines are equally large and dominant. Use generous spacing, not ornate illegible calligraphy. Preserve every Vietnamese accent, number and punctuation mark, including the colon in the mission label and the curly quotation marks around Pay Yourself First when specified. Do not translate or abbreviate the title. The specified title is the ONLY readable text in the image; papers, screens and cards remain abstract.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, no cropped panel or letters.

NEGATIVE: missing title, blank sign, wrong mission number, Mission label, chapter-prefixed mission number, numbered event label, extra captions, misspelled Vietnamese, missing diacritics, tiny text, illegible lettering, overlapping letters, cropped title, title hidden by objects, people, silhouettes, human reflections, bank logo, watermark, photorealism, 3D render, black margins, rounded outer image crop, invented transaction success or failure.
```

---

## 🪧 NHIỆM VỤ 3 — BẪY THANH TOÁN TỐI THIỂU THẺ TÍN DỤNG

### 📄 `bg_nhiem_vu_3.png`
**Loại**: Ảnh nền tiêu đề, không nhân vật, có chữ lớn ở giữa
**Dùng cho**: Ngay trước màn sao kê nhiệm vụ 3; phòng trọ buổi tối.
**Aspect**: 16:9
**Output**: `images/chuong-6/bg_nhiem_vu_3.png`
**Chữ chính xác**: `Nhiệm vụ 3: Bẫy thanh toán tối thiểu thẻ tín dụng`

```text
Create ONE full-bleed 16:9 landscape PNG title background, target 1920 x 1080.

STYLE TOKEN: Kawaii 2D cartoon style, Studio Ghibli x Takashi Yamashita x Makoto Shinkai x Slice-of-Life manga-inspired EARNEST TEEN PROPORTIONS (NOT Doraemon/Sanrio baby-cute, NOT baby-face, NOT toddler proportions, NOT chibi-3-head-body). head-to-body ratio 1:4 to 1:5 (MEDIUM head, NATURAL teenage/adult body proportions — KHÔNG đầu khổng lồ 1:2.5, KHÔNG thân hình tí hon baby), NATURAL-LOOKING medium-sized eyes (eyes nhỏ-vừa hơi to, đơn giản, có một white highlight nhỏ — KHÔNG phải "huge round sparkly eyes with two large white circle highlights", KHÔNG mắt tròn xoe Doraemon/Sanrio, KHÔNG ẩu-ni-mê giant eyes), MEDIUM-thickness outlines (vừa phải, KHÔNG thick black chibi outline), soft flat cel-shading with gentle gradients (chuyển sắc nhẹ ở mặt + áo — không flat 100%), VERY SUBTLE natural teen/adult skin shading, NO kawaii blush circles on cheeks (KHÔNG có 2 vòng tròn hồng đậm trên má — chỉ shading nhẹ tự nhiên), warm natural soft lighting (không warm-cozy-cute quá mức), gentle earnest wholesome everyday vibe, manga/illustration style with Ghibli character consistency, render ONLY the exact specified Vietnamese title, no extra text, no watermark. NOT realistic, NOT semi-realistic, NOT chibi-3-head-body, NOT Doraemon-baby-cute, NOT Sanrio-cuteness-overload, NOT baby-face, NOT toddler-face, NOT inflated-cheeks, NOT big-head-tiny-body, NOT Pixar, NOT creepy, NOT scary, NOT hyper-cute-kawaii.

CRITICAL TITLE RULE: This is an environment-only illustration. NO people, NO sprites, NO silhouettes, NO human reflections. Render the EXACT title specified below; a no-text rule from ordinary backgrounds does NOT apply here.

STORY CONTEXT AND EXACT APPEARANCE: Chapter 6, the start of Mission 3, at the credit-card statement due date after Ti has spent too much with the card. Anchor the image at his rental-room desk at night, immediately BEFORE reviewing the minimum-payment offer or making a payment choice. No payment has been confirmed.

SETTING AND CAMERA: MODEST VIETNAMESE RENTAL ROOM, OLD BUT CLEAN AND INTACT. Wide-angle camera INSIDE a roughly 12-square-meter room, with left, back and right walls, floor and ceiling visible. Entrance door sits at the far-left edge, not around the camera. This is the same modest dwelling used in Chapter 5, not a new luxury apartment.

LEFT WALL: Small window with intact painted metal bars and a clean slightly faded pink curtain; neighboring tin roofs and electrical wires outside. Below it, a working white ceramic sink, soap dish and clean intact mirror with an aged plastic frame.

BACK WALL: Sturdy single wooden bed against the back wall, clean faded blue-white checkered bedding and one thin pillow. Small wooden shelf above holds used textbooks and a rolled diploma tied with a red ribbon; no readable titles.

RIGHT WALL: Well-kept secondhand wooden desk with a few light surface scuffs, sturdy legs, simple wooden chair, older working laptop, pen holder, reusable water bottle and neatly stacked papers. A small closed savings tin sits on the shelf by the desk; no visible contents and no readable label.

CENTER: Simple open central floor area between bed and desk. Keep the left and right near-foreground clear enough for a character sprite. No random piles of bills, luxurious purchases or abandoned belongings.

CEILING: Low approximately 2.5-meter ceiling, clean slightly aged off-white paint and a simple warm-yellow ceiling bulb. Secure neat wiring; no stains, peeling plaster or cobwebs.

FLOOR: Swept intact ivory ceramic tiles with a slightly worn matte finish. Clean cream walls gently yellowed with age and only faint furniture scuffs. A small wastebasket contains discarded paper; no scattered rubbish, cracked tiles, mold, leaks or broken furniture.

ENTRANCE: Intact dark-brown wooden door at the far-left edge, closed. The camera is inside, never peering through a doorway; no doorframe border.

LIGHTING AND ATMOSPHERE: Warm-yellow ceiling bulb and a small warm desk lamp on the RIGHT desk, with deep blue-black night beyond the LEFT window. Keep the room layout identical to the afternoon call background; only time, lights and desk props change. Moderate readable contrast, no horror, red flashing alarm or dawn light. Plain and affordable, cared for and believable for a recently employed person. No signs of an upgrade to wealth, no eviction packing, no unrelated Chapter 5 emergency equipment.

MOMENT-SPECIFIC PROPS AND CONTINUITY: A plain unmarked card, neatly folded statement and generic smartphone with two unselected abstract option shapes rest on the right-side desk. Do not expose card digits, a real bank logo, exact financial UI, a successful payment receipt, collectors or shopping luxury. Keep the smartphone, desk lamp and familiar room readable around the title.

SELF-CONTAINED CONTINUITY RULE: The location, time, architecture, furniture, atmosphere and props above fully define this image. Do not substitute another chapter’s location or imply a future outcome. Reference images, if attached, only help match details; this prompt can be copied and used by itself.

COMPOSITION: A matte cream parchment panel (#f2e4cf) in a thin warm wooden frame (#805535) is centered horizontally and vertically, front-facing without perspective skew. Panel covers about 78% of image width and 52% of image height. It is a graphic overlay, not a physical sign installed in the room. Keep distinctive room landmarks visible around it. Subtle rounded paper corners and a soft shadow; the actual image stays rectangular with no black margins. All letters stay at least 10% from image edges and do not touch props.

RENDER THIS EXACT TEXT, centered with these line breaks:
Nhiệm vụ 3:
Bẫy thanh toán tối thiểu
thẻ tín dụng

TYPOGRAPHY: Large bold storybook serif with full Vietnamese diacritics and high contrast, dark brown (#3b2417) on cream. The first line is about 70% of the mission-name font size; subsequent name lines are equally large and dominant. Use generous spacing, not ornate illegible calligraphy. Preserve every Vietnamese accent, number and punctuation mark, including the colon in the mission label and the curly quotation marks around Pay Yourself First when specified. Do not translate or abbreviate the title. The specified title is the ONLY readable text in the image; papers, screens and cards remain abstract.

ASPECT: 16:9 landscape, 1920 x 1080, full bleed, no cropped panel or letters.

NEGATIVE: missing title, blank sign, wrong mission number, Mission label, chapter-prefixed mission number, numbered event label, extra captions, misspelled Vietnamese, missing diacritics, tiny text, illegible lettering, overlapping letters, cropped title, title hidden by objects, people, silhouettes, human reflections, bank logo, watermark, photorealism, 3D render, black margins, rounded outer image crop, invented transaction success or failure.
```

---

## 🪧 TỔNG KẾT CHƯƠNG 6 — LÀM CHỦ DÒNG TIỀN

**Output**: `images/chuong-6/bg_tong_ket_chuong.png`
**Loại**: Tranh tổng kết biểu tượng, không nhân vật, 16:9 — 1920 × 1080.
**Dùng cho**: Nhìn lại ý nghĩa cả chương, dùng chung cho các nhánh.
**Ý nghĩa cần gợi**: Gross và Net; Pay Yourself First; thanh toán thẻ tín dụng và bẫy trả tối thiểu.
**Thiết kế mới**: Làm chủ dòng tiền. Tiêu đề và câu chốt ý đặt trên khoảng giấy sáng ở giữa; các cụm đồ vật kể lại bài học nằm quanh rìa. Không dùng bảng gỗ lớn che gần hết cảnh. Đây là tranh hồi tưởng mang tính biểu tượng, không phải cảnh mới xảy ra sau nhiệm vụ cuối.

```text
Create ONE beautifully composed 16:9 full-bleed illustrated chapter-recap card, target 1920 x 1080. This is a finished visual-novel chapter reflection illustration, not a slide template or a literal continuation of the last scene.

STYLE: Hand-drawn 2D Vietnamese everyday-life storybook illustration, consistent with the established earnest slice-of-life game art: medium-thickness softly colored outlines, soft flat cel-shading with gentle gradients, subtle watercolor-paper grain, carefully simplified tangible objects, restrained warm natural light. Delicate edges, readable silhouettes, atmospheric depth, polished art direction. No photorealism, 3D, glossy vector clipart, giant cartoon faces or hyper-cute styling. NO people, character sprites, silhouettes, hands or human reflections.

CHAPTER MEANING: Three interlocking but spacious still-life groups trace the journey from earning to saving to responsible repayment, visually joined by one quiet flowing ribbon. The lesson is: Gross và Net; Pay Yourself First; thanh toán thẻ tín dụng và bẫy trả tối thiểu. This meaning is visual direction; do not render that explanatory sentence as text.

COLOR STORY: warm cream #f4eddd, slate-blue #66839a, sage green #89a68b and subtle brushed gold #c5aa75. Use cream for most of the image, two main supporting hues, and only small warm accents. Richer colors belong to the outer object groups; central text sits against a quiet light field.

CUSTOM ILLUSTRATED MOTIFS AND PLACEMENT: LOWER LEFT: an unmarked payslip with a few abstract ruled lines, a plain work ID turned blank-side up and a simple calculator with no legible digits, representing gross versus net without made-up amounts. LOWER CENTER-RIGHT: a modest ceramic savings vessel beside a small calendar with blank squares; a gentle curved line links the payslip to it, representing saving first, not a confirmed automatic transfer. UPPER RIGHT: a plain bank card with no logo or digits, a folded unmarked statement and a small analog clock, evoking due dates and the minimum-payment trap. No unlocked padlock, debt-free checkmark, payment confirmation or stack of gold coins.

BACKGROUND AND ATMOSPHERE: Subtle home-desk wood grain at the bottom edge and faint office-window shapes at the far upper-left edge dissolve into cream paper; they are memory cues, not two rooms physically merged. Restrained warm-neutral light, gentle sage and blue shadows, abundant open center.

COMPOSITION: One coherent illustration, not a grid or a set of cards. Arrange the specified object groups as an asymmetrical but balanced open wreath around a large central breathing space. Keep ALL objects outside the central text zone, approximately x=20-80% and y=28-65% of the canvas. Let the lower objects anchor the image, with lighter smaller accents above. Objects have consistent perspective and gentle contact shadows; no floating dashboard icons. Keep secondary details sparse, three depth levels at most. The light center has a soft irregular paper wash integrated into the artwork, NOT a rectangular parchment plaque, wooden sign, bordered box, ribbon banner or physical board. No hard frame around the image.

TEXT HIERARCHY AND EXACT VIETNAMESE COPY: Center-align the following three lines as one group, vertically centered around 46% of canvas height.
Line 1, modest chapter eyebrow, approximately 40 px at 1920 x 1080:
Tổng kết chương 6
Line 2, main meaning title, approximately 76 px, the largest text:
Làm chủ dòng tiền
Line 3, supporting reflection, approximately 34 px:
Hiểu thu nhập, tiết kiệm trước, dùng nợ tỉnh táo.

TYPOGRAPHY: Elegant bold readable storybook serif for the meaning title, simple clear medium-weight lettering for the chapter line and reflection. All text dark warm brown #3b3028 with strong contrast on light cream. Full accurate Vietnamese diacritics, no decorative strokes colliding with accents. Keep generous vertical gaps, at least 10% canvas-edge safety margin, no text touching objects. Main title must fit the central width; reduce it slightly only if needed, never crop it. These THREE specified lines are the ONLY readable text. All bills, books, screens, cards and calendars remain unmarked or abstract. No extra lesson labels or microtext.

NARRATIVE RULE: A thematic recap of learning, NOT a declared player achievement. No success badge, failure stamp, stars, grades, scores, balances, invented rates, selected choices, completed transaction or guaranteed outcome. Symbols show concepts explored in the chapter regardless of the chosen branches. 

ASPECT AND DELIVERY: ONE rectangular 16:9 PNG, 1920 x 1080, full bleed, no black margins. Artwork already includes the three specified text lines. No sprite or dialogue box should be layered over the finished card. If gameplay needs scores or detailed recap text, show them on a subsequent UI screen instead of covering this illustration.

NEGATIVE: huge wooden title panel, boxed parchment, generic last-room screenshot, slide deck, infographic grid, collage of screenshots, split-screen rooms, icon stickers, money rain, giant coin piles, glitter explosion, victory trophy, neon finance dashboard, upward profit arrow, confirmed outcome, people, faces, hands, silhouettes, readable prop labels, extra text, misspelled Vietnamese, missing accents, tiny captions, crowded center, overlapping lettering, cropped title, illegible calligraphy, watermark, logo, photorealism, 3D render, heavy black outlines, black borders.
```

**Kiểm tra riêng ảnh tổng kết**: Đủ 3 dòng chữ đúng dấu; bài học được gợi qua đồ vật; trung tâm thoáng; không có bảng gỗ che tranh; không thể hiện người chơi đã thắng/thua. Giữ màu sắc và nét vẽ đồng bộ cả bộ, nhưng bố cục đồ vật đúng riêng chương 6.


---

# 🧩 MAPPING ẢNH VÀ GIAO DIỆN THEO NHIỆM VỤ

| Đoạn | Ảnh | Cách chuyển |
|---|---|---|
| Vào nhiệm vụ 1 | `bg_nhiem_vu_1.png` | Sau tiêu đề vào scene nhận lương |
| Tí bất ngờ số thực nhận | `c6_scene_salary_gross_net.png` | Không ghép sprite chồng lên composite |
| Đọc payslip và tương tác | `c6_bg_salary_office_empty.png` | UI kéo/xem các khoản trừ; sprite Tí chỉ khi không che vùng thao tác |
| Vào nhiệm vụ 2 | `bg_nhiem_vu_2.png` | Giới thiệu cuộc gọi tại phòng trọ |
| Narrator cuộc gọi | `c6_scene_savings_call_ti.png`, `c6_scene_savings_call_advisor.png` | Hai ảnh cắt góc riêng; không hai người cùng địa điểm |
| Thoại cuộc gọi | `c6_bg_rental_room_evening_empty.png` và `c6_bg_bank_advisor_office_empty.png` | Tí/ô người gọi tách biệt hoặc chuyển nền theo đầu dây |
| Lựa chọn tự động tiết kiệm | BG phòng trọ cuối chiều | UI bật 3.000.000đ/tháng hoặc bỏ qua, không gen sẵn trạng thái đã bật |
| Vào nhiệm vụ 3 | `bg_nhiem_vu_3.png` | Chuyển sang sao kê tại phòng trọ tối |
| Narrator sao kê | `c6_scene_credit_card_statement.png` | Một Tí, chưa chọn thanh toán |
| Lựa chọn và kết quả thẻ | `c6_bg_rental_room_night_empty.png` | UI hiển thị lựa chọn/kết quả theo nhánh |
| Tổng kết | `bg_tong_ket_chuong.png` | Tranh biểu tượng ba bài học: hiểu thu nhập, tiết kiệm trước, dùng nợ tỉnh táo |

## Số liệu và trạng thái UI lấy từ cốt truyện

| Màn | Nội dung cần dựng bằng UI | Ràng buộc hình ảnh |
|---|---|---|
| Payslip | Gross 18.000.000đ; thực nhận 15.250.000đ; BHXH 8%, BHYT 1,5%, BHTN 1%, thuế TNCN; FIQ +30 sau tìm hiểu | Giữ dữ liệu nguồn; không bịa thêm phép tính thuế, tháng/năm hay dòng tiền để ép khớp |
| Tiết kiệm tự động | Lời khuyên 20%; lựa chọn A 3.000.000đ/tháng, SAVINGS +3.000k, FIQ +25, GOAL +15; B không tăng tiết kiệm, RISK +15 | Không vẽ `20% = 3 triệu`; không khóa ảnh vào một kết quả trước lựa chọn |
| Sao kê thẻ | Dư nợ 6.000.000đ; A trả tối thiểu 300.000đ, còn 5.700.000đ gốc, lãi 30%/năm theo nguồn, RISK +50, FIQ -20; B trả toàn bộ 6.000.000đ, WEALTH -6.000k, RISK về 0, FIQ +30 | Không dùng 25%/năm từ bible cũ; không tự tính lãi theo ngày hoặc lịch trả nợ ngoài nguồn |

---

# 📋 BẢNG TỔNG HỢP

## Tất cả BG không nhân vật — 4 file

| # | Tên file | Dùng cho |
|---|---|---|
| 1 | `c6_bg_salary_office_empty.png` | Nhiệm vụ 1: độc thoại Tí, đọc thông báo ngân hàng, mini-game payslip. |
| 2 | `c6_bg_rental_room_evening_empty.png` | Nhiệm vụ 2: đầu dây của Tí, thoại qua điện thoại và lựa chọn tiết kiệm tự động. |
| 3 | `c6_bg_bank_advisor_office_empty.png` | Nhiệm vụ 2: nền riêng của chuyên viên khi game chuyển góc cuộc gọi; không phải điểm Tí đến. |
| 4 | `c6_bg_rental_room_night_empty.png` | Nhiệm vụ 3: nền xem ứng dụng, lựa chọn thanh toán và phản hồi kết quả; tổng kết dùng tranh riêng. |

## Tất cả SCENE composite — 4 file

| # | Tên file | Nhân vật | Dùng cho |
|---|---|---|---|
| 1 | `c6_scene_salary_gross_net.png` | Tí | Tí vừa đọc thông báo lương thực nhận, bất ngờ so với số Gross trong hợp đồng; trước mini-game tìm hiểu payslip. |
| 2A | `c6_scene_savings_call_ti.png` | Tí | Tí nghe chuyên viên đề xuất tiết kiệm tự động sau giờ làm; chưa chọn bật hay bỏ qua. |
| 2B | `c6_scene_savings_call_advisor.png` | Chuyên viên ngân hàng | Góc cắt phía ngân hàng trong cùng cuộc gọi nhiệm vụ 2; chuyên viên giải thích nguyên tắc trích tiết kiệm trước chi tiêu. |
| 3 | `c6_scene_credit_card_statement.png` | Tí | Tí xem sao kê đến hạn và cân nhắc trả tối thiểu hay toàn bộ; chưa nhấn xác nhận. |

## Ảnh tiêu đề — 4 file

| Tên file | Chữ hiển thị | Địa điểm |
|---|---|---|
| `bg_nhiem_vu_1.png` | Nhiệm vụ 1: Cú sốc Gross và Net | BÀN LÀM VIỆC CÔNG TY — NGÀY NHẬN LƯƠNG |
| `bg_nhiem_vu_2.png` | Nhiệm vụ 2: Quy tắc “Pay Yourself First” | PHÒNG TRỌ CUỐI CHIỀU — NHẬN CUỘC GỌI TƯ VẤN |
| `bg_nhiem_vu_3.png` | Nhiệm vụ 3: Bẫy thanh toán tối thiểu thẻ tín dụng | PHÒNG TRỌ BUỔI TỐI — XEM SAO KÊ THẺ |
| `bg_tong_ket_chuong.png` | Tổng kết chương 6 — Làm chủ dòng tiền | TRANH BIỂU TƯỢNG THU NHẬP / TIẾT KIỆM / THẺ TÍN DỤNG |

> **Tổng trong file: 12 prompt ảnh** = 4 BG trống + 4 composite + 3 tiêu đề nhiệm vụ + 1 tổng kết. Kết hợp 9 sprite trong `chuong-6-characters.md`: **21 ảnh dự kiến** cho cả bộ Chương 6. Không có sự kiện bất ngờ mới.

### 📁 Cây thư mục đầu ra

```text
images/
└── chuong-6/
    ├── c6_ti_hopeful.png
    ├── c6_ti_surprised.png
    ├── c6_ti_attentive.png
    ├── c6_ti_tempted.png
    ├── c6_ti_worried.png
    ├── c6_ti_determined.png
    ├── c6_bank_advisor_professional.png
    ├── c6_bank_advisor_explaining.png
    ├── c6_bank_advisor_reassuring.png
    ├── c6_bg_salary_office_empty.png
    ├── c6_bg_rental_room_evening_empty.png
    ├── c6_bg_bank_advisor_office_empty.png
    ├── c6_bg_rental_room_night_empty.png
    ├── c6_scene_salary_gross_net.png
    ├── c6_scene_savings_call_ti.png
    ├── c6_scene_savings_call_advisor.png
    ├── c6_scene_credit_card_statement.png
    ├── bg_nhiem_vu_1.png
    ├── bg_nhiem_vu_2.png
    ├── bg_nhiem_vu_3.png
    └── bg_tong_ket_chuong.png
```

## Lệnh gen — thứ tự ưu tiên

1. Duyệt `c6_ti_hopeful.png` và `c6_bank_advisor_professional.png` để khóa mặt, quần áo và phụ kiện.
2. Gen BG1 văn phòng nhận lương, BG2 phòng trọ cuối chiều, BG3 phía ngân hàng; dùng BG2 đã duyệt làm reference hình học cho BG4 phòng trọ buổi tối.
3. Gen các emotion còn lại bằng ảnh nhân vật đã duyệt, không đổi trang phục.
4. Gen 4 composite, kèm BG và nhân vật tương ứng; hai ảnh cuộc gọi phải ở hai địa điểm tách biệt.
5. Gen 3 ảnh tiêu đề nhiệm vụ, mỗi prompt đã ghi trọn bối cảnh/thời điểm; giữ cùng thiết kế bảng và font giữa các ảnh.
6. Gen ảnh tổng kết bằng prompt tranh biểu tượng riêng; kiểm tra đủ tiêu đề, ý nghĩa chương và câu chốt ý.

## Kiểm tra trước khi dùng

- Nhân vật đúng tuổi, đúng bộ đồ, quần dài đến mắt cá; không lẫn HR Chương 5 với chuyên viên ngân hàng.
- BG không có người hoặc bóng người; composite đúng một nhân vật, không ghép sprite chồng lên người có sẵn.
- Phòng trọ cũ vừa phải nhưng sạch; bố trí cửa sổ trái/giường sau/bàn phải không đổi giữa cuối chiều và buổi tối.
- Cuộc gọi không biến thành buổi gặp mặt; chuyên viên chỉ ở ô gọi riêng hoặc nền ngân hàng.
- Mọi prompt tự chứa đủ style, không gian, ánh sáng, trang phục nếu có người và negative; không dùng “same as above” thay nội dung.
- Tiêu đề đúng tên, dấu tiếng Việt, số 1/2/3, nằm chính giữa và dễ đọc; không xuất hiện số nhiệm vụ 6.1/6.2/6.3.
- BG/composite không chứa chữ hoặc số tiền đọc được; UI dựng đúng dữ liệu kịch bản, không hiển thị kết quả trước quyết định.
- Đủ 12 prompt BG/scene/title và 9 emotion; đường dẫn đầu ra dưới `images/chuong-6/`.
