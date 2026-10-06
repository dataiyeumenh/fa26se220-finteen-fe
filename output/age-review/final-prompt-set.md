# Bộ prompt chibi cuối cùng

Đợt sửa hoàn tất ngày 03/10/2026 bằng **imagegen tích hợp**. Quyết định cuối của người dùng: toàn bộ nhân vật chibi; khác tuổi chỉ qua quần áo và nét mặt. Bộ này thay các hướng tăng chiều cao hoặc kéo dài cơ thể ở những bản nháp trước.

## Sprite nhân vật

```text
Use case: identity-preserve. ONE full-body transparent CHIBI visual-novel sprite.
Reference 1 supplies identity and the original expression, action, gesture and props.
Reference 2 is the final chibi model and controls face, hair, outfit, compact body proportions and rendering.
Keep harmonious compact chibi anatomy, warm brown outlines and soft pastel 2D cel shading.
Show age through clothing and facial cues only. Do not stretch the torso or legs, shrink the head, or create a height progression by age.
Adults also use one fixed chibi model across chapters; never grow adults when An or Minh is older.
Match the requested expression and original prop interaction with coherent hands.
Entire body and feet visible with margins. Single character. Genuine transparent background.
No text, labels, added people, background, ground ellipse, glow or cast shadow.
```

| Nhân vật / tuổi | Trang phục và nhận diện |
| --- | --- |
| An 14 | Tóc nâu lệch, áo thun vàng, short xanh, dép trắng |
| An 16 | Sơ mi khoác vàng ngắn tay, thun trắng, jean xanh, sneaker trắng |
| An 17 | Polo vàng, quần xanh dài, sneaker trắng |
| An 18 | Sơ mi khoác vàng xắn tay, áo kem, quần xanh dài, sneaker trắng |
| Minh 14 | Tóc đen vuốt lệch, polo navy, short be, sneaker trắng, đồng hồ |
| Minh 16 | Sơ mi khoác navy, áo trong sáng, quần be dài, sneaker trắng |
| Minh 17 | Polo navy, quần be dài, sneaker trắng, đồng hồ |
| Minh 18 | Sơ mi navy xắn tay, quần be dài, sneaker trắng, đồng hồ |
| Mẹ | Khăn đầu vàng, tay áo kem, áo/tạp dề nâu, quần đen, dép đỏ; nét mặt người lớn |
| Cô Linh | Kính, tóc buộc lệch, blouse xanh nhạt, quần navy, giày kem; nét mặt người lớn |
| Tư vấn viên | Tóc nâu, sơ mi kem, quần teal, giày nâu, dây thẻ |
| Nhân viên cửa hàng | Tóc bob nâu, áo cổ bẻ mint, quần teal, sneaker trắng, bảng tên trống |
| Hướng dẫn ngân hàng | Tóc nâu, suit navy, áo trắng, cà vạt đỏ nâu, giày tối, bảng tên trống |

An có trung tính / nhẹ nhõm / suy nghĩ / lo về tiền; Minh có trung tính / mời gọi. Người lớn giữ các biểu cảm và đạo cụ của từng sprite gốc. Nhóm 17–18 có nét mặt bớt trẻ con nhẹ, không biến thành người già hoặc vóc dáng cao dài.

## Tranh cảnh

```text
Use case: identity-preserve. Edit ONE existing landscape 16:9 visual-novel scene.
Reference 1 supplies environment, framing, positions, original expressions, action and props.
Reference 2 is final chibi An for this independent scenario. Reference 3 is the final chibi companion when present.
ALL people use the exact balanced compact chibi style of the final sprite references.
Use final faces, hair and outfits while preserving original scene poses and expressive actions.
Age differences are shown ONLY by clothing and facial cues, never by growing people, stretching bodies or lengthening legs.
Keep each adult's fixed chibi model across chapters. Preserve sensible placement, perspective and seated/standing posture.
Keep the background, furniture, lighting, palette, number of people, learning props and story action.
Do not invent a transaction or change a branch outcome.
Coherent hands, limbs, occlusion and prop contact. Full-bleed landscape 16:9.
No readable text, numbers, captions, labels, UI, speech bubbles, logos or watermark. Papers and screens remain blank for UI.
```

Tuổi An/Minh theo chương 1–6: **14, 16, 17, 16, 16, 18**. Đây là sáu tình huống trong GDD v2 độc lập, không phải tuyến nhân vật lớn dần.

Prompt và đường dẫn tham chiếu của từng lượt được giữ trong `chibi-jobs.json` và `chibi-before-final-style.json`; các lượt dáng cao đã bỏ nằm trong `tall-jobs.json`. File này là bộ quy tắc cuối để tiếp tục sản xuất, không phải sự phê duyệt những bản nháp cũ.
