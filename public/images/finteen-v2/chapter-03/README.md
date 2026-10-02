# Chương 3 — Công việc đầu tiên

Bộ ảnh theo GDD v2, phong cách kawaii cartoon 2D. **Hiện có 26 PNG: 4 background, 4 tranh scene hoàn chỉnh và 18 ảnh nhân vật/mini-game/đạo cụ.** Đợt bổ sung này thêm 2 góc nền và 4 tranh kể chuyện bằng imagegen tích hợp, giữ nguyên các ảnh đã có.

## Background và scene bổ sung — hướng dẫn sử dụng hiện tại

SC01: toàn hội chợ → tranh ba lời mời. SC02: bàn thông tin → tranh kiểm tra nguồn. SC03: bàn học → tranh lịch tuần → Career Match. SC04: khu báo cáo → tranh trình bày → reflection.

| File mới | Gắn vào đâu |
| --- | --- |
| `bg/bg06b-course-information-desk.png` | SC02: bàn thông tin khóa học, tách khỏi toàn cảnh hội chợ. |
| `bg/bg06c-career-report-corner.png` | SC04: góc báo cáo nghề nghiệp. |
| `scene/sc01-three-career-offers.png` | SC01: tiếp cận ba lời mời, chưa chọn nghề. |
| `scene/sc02-checking-course-source.png` | SC02: kiểm tra lời giới thiệu với nguồn độc lập. |
| `scene/sc03-weekly-career-plan.png` | SC03: ghép nghề, kỹ năng và thời gian; lịch chi tiết dựng bằng UI. |
| `scene/sc04-career-report.png` | SC04: báo cáo và phản hồi, không gắn cố định ending. |

- `bg/` là nền không có nhân vật, dùng cùng sprite khi thoại, chọn đáp án hoặc chơi mini-game. Các góc cận có bàn/quầy chiếm tiền cảnh: dùng chân dung nửa người hoặc ẩn sprite để tránh chân xuyên bàn.
- `scene/` là tranh đã có nhân vật và hành động. Dùng làm tranh dẫn cảnh/chuyển nhịp; ẩn sprite rời khi hiện tranh để không trùng nhân vật. Có thể chuyển về góc nền tương ứng khi người chơi bắt đầu thao tác.
- Các tranh dùng cùng nhận dạng tóc, màu áo và phong cách chibi của bộ đã duyệt. Độ tuổi tình huống vẫn giới thiệu theo GDD.
- Chữ, giá, công thức, ngày và trạng thái lựa chọn do UI hiển thị. Lưới lịch, nét giấy hoặc hình sản phẩm trong tranh chỉ minh họa, không lấy làm dữ liệu kiểm tra hoặc vùng bấm cố định.
- Các scene không chốt kết quả nhánh. Khi hiển thị hậu quả/ending, dùng dữ liệu và biểu cảm riêng theo lựa chọn thực của người chơi.
- Toàn bộ ảnh mới là tranh ngang có nền kín, không cần alpha. Chưa tích hợp vào gameplay; đây là hướng dẫn ghép cho bước triển khai.

### Prompt bổ sung (imagegen tích hợp)

<details>
<summary>bg/bg06b-course-information-desk.png</summary>

Tham chiếu: `chapter-03/bg/bg06-career-fair.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New close eye-level angle at course information booth inside reference career fair. Mint canopy overhead, plain brochures in wooden holders, blank laptop screen, two empty chairs beside consultation table. Other fair booths visible only in background, no people. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>bg/bg06c-career-report-corner.png</summary>

Tham chiếu: `chapter-03/bg/bg06-career-fair.png`.

```text
Use case: precise-object-edit. ONE full-bleed landscape 16:9 EMPTY visual-novel background, genuinely new camera angle not merely recolor/crop. New medium-wide angle of reporting area at same school career fair: large blank cream presentation board central, modest wooden lectern at side, three empty chairs, pastel bunting and trees framing scene. Space for character presenters. Reference 1 establishes the location and palette. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors. No people, faces, hands or silhouettes. No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc01-three-career-offers.png</summary>

Tham chiếu: `chapter-03/bg/bg06-career-fair.png`, `chapter-01/char/an/an-neutral.png`, `chapter-01/char/minh/minh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt and Minh navy polo walking through school career fair, pausing at three plain brochure cards on table with small pictograms of megaphone, drawing tablet and handmade parcel. Minh gestures excitedly, An examines thoughtfully. Medium wide two-shot, no selecting a final offer. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc02-checking-course-source.png</summary>

Tham chiếu: `chapter-03/bg/bg06-career-fair.png`, `chapter-01/char/an/an-neutral.png`, `chapter-03/char/tu-van/tu-van-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt at career fair consultation table cross-checks blank laptop screen and plain brochure while adviser cream shirt coral lanyard explains with open palm across table. Both attentive, adviser friendly not sinister. Medium over-table two-shot, no payment. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc03-weekly-career-plan.png</summary>

Tham chiếu: `chapter-01/bg/bg01b-study-corner.png`, `chapter-01/char/an/an-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt seated at home study desk laying three blank job cards beside blank weekly planner, pencil in hand, concentrating. Gentle daylight side view with face and desk clearly visible, no final selection marked. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

<details>
<summary>scene/sc04-career-report.png</summary>

Tham chiếu: `chapter-03/bg/bg06-career-fair.png`, `chapter-01/char/an/an-neutral.png`, `chapter-02/char/co-linh/co-linh-neutral.png`.

```text
Use case: compositing. ONE full-bleed landscape 16:9 finished narrative illustration with characters naturally performing the action, not pasted standing sprites. An yellow shirt stands beside blank report board in career fair reporting area holding plain notes and explaining; Co Linh glasses blue blouse listens warmly with one hand open. Medium wide presentation two-shot, no award, checkmark or claim of success. Reference 1 establishes the location and palette. Remaining references establish exact character identities: preserve faces, hairstyles, outfit colors and chibi proportions; adapt poses naturally. Consistent kawaii cartoon 2D, clean warm brown outlines, soft cel shading, fresh warm pastel colors.  No readable text, letters, numbers, logos, watermarks, UI panels, speech bubbles or split panels. Documents and screens remain blank for later UI. Keep important action above bottom dialogue area. Single coherent illustration.
```

</details>

## Cấu trúc và cách dùng

Đường dẫn frontend bắt đầu bằng `/images/finteen-v2/chapter-03/`. Các thư mục: `bg/`, `char/an/`, `char/minh/`, `char/co-linh/`, `char/tu-van/`, `asset-mini-game/career-match/`, `props/`. Ảnh dùng lại đã được sao chép vào chương này.

An 17 tuổi tham gia tuần hướng nghiệp mô phỏng, có ngân sách học kỹ năng 300.000đ, tối đa 12 giờ/tuần ngoài giờ học và quan tâm thiết kế. Chương độc lập, không mang số dư hoặc mục tiêu chương trước sang.

## Gắn ảnh vào cảnh

| Cảnh | Nền | Nhân vật và đạo cụ |
| --- | --- | --- |
| CH03_SC01 — Ba lời mời | BG06 | An trung tính/suy nghĩ, Minh rủ rê, cô Linh giải thích. Hiện ba icon nghề trên thẻ UI. |
| CH03_SC02 — Kiểm tra lời giới thiệu | BG06 | Tư vấn viên trung tính/thuyết trình, An suy nghĩ, cô Linh giải thích. Laptop để minh họa tra nguồn độc lập; sách cho khóa học. |
| CH03_SC03 — Chọn công việc và kỹ năng | BG07 | An suy nghĩ/lo lắng và cô Linh. Mở Career Match, lịch tuần bằng UI; có thể ẩn sprite khi thao tác. |
| CH03_SC04 — Ngày báo cáo nghề nghiệp | BG06 | An nhẹ nhõm/suy nghĩ, cô Linh động viên/giải thích. Bảng báo cáo là UI riêng; dùng lại nền cho ending. |

## Danh sách ảnh

| File | Dùng ở đâu |
| --- | --- |
| `bg/bg06-career-fair.png` | Hội chợ nghề sân trường, cảnh 1/2/4; đã bỏ người khỏi nền. |
| `bg/bg07-study-desk.png` | Góc học tập, cảnh 3. |
| `char/an/an-neutral.png` | Nhận thông tin, lắng nghe. |
| `char/an/an-thinking.png` | So sánh nghề, kiểm tra nguồn và tính toán. |
| `char/an/an-worried-money.png` | Phát hiện phí học hoặc giờ làm không phù hợp. |
| `char/an/an-relieved.png` | Hoàn thành phương án phù hợp. |
| `char/minh/minh-neutral.png` | Trao đổi tại hội chợ. |
| `char/minh/minh-inviting.png` | Giới thiệu lời mời thu nhập hấp dẫn. |
| `char/co-linh/co-linh-neutral.png` | Lắng nghe báo cáo. |
| `char/co-linh/co-linh-explaining.png` | Giải thích nguồn, thời gian, lương ròng và lợi nhuận. |
| `char/co-linh/co-linh-encouraging.png` | Động viên kiểm tra lại/kết thúc. |
| `char/tu-van/tu-van-neutral.png` | Bắt đầu trao đổi về khóa học. |
| `char/tu-van/tu-van-presenting.png` | Giới thiệu khóa học với brochure. |
| `asset-mini-game/career-match/commission-sales.png` | Thẻ bán hàng hưởng hoa hồng: loa và tờ giới thiệu sản phẩm. |
| `asset-mini-game/career-match/design-assistant.png` | Thẻ trợ lý thiết kế: bảng vẽ, bút và mẫu màu. |
| `asset-mini-game/career-match/small-business.png` | Thẻ kinh doanh nhỏ: đồ thủ công và kiện hàng. |
| `asset-mini-game/career-match/intro-course.png` | Khóa học nhập môn: sách và bút; không biểu thị bảo đảm việc làm. |
| `asset-mini-game/career-match/time-availability.png` | Biểu tượng quỹ thời gian; dựng lịch tuần tương tác bằng UI riêng. |
| `props/source-check-laptop.png` | Tra chương trình học/yêu cầu nghề từ nguồn độc lập ở cảnh 2. |
| `props/training-budget-envelope.png` | Ngân sách học kỹ năng đầu chương; ghi số tiền bằng UI. |

Hai nền: 1672 × 941. Năm icon và hai đạo cụ: 1254 × 1254. An trung tính/lo lắng và hai sprite Minh: 1792 × 2400; các sprite còn lại: 1084 × 1451. Toàn bộ 18 ảnh tiền cảnh có nền trong suốt.

## Số liệu và lưu ý tích hợp

| Nghề mô phỏng | Giờ/tuần | Dữ kiện |
| --- | --- | --- |
| Bán hàng hoa hồng | 16 | Tháng tốt 3.000.000đ, tháng thấp 2.000.000đ; vượt giới hạn của An 4 giờ. |
| Trợ lý thiết kế | 10 | Khóa học 200.000đ; lương gộp 3.000.000đ trừ khấu trừ giả định 300.000đ = 2.700.000đ ròng. |
| Kinh doanh nhỏ | 12 | Doanh thu 1.200.000đ trừ chi phí 800.000đ = lợi nhuận 400.000đ. |

- Chỉ trừ phí học sau xác nhận: 300.000đ còn 100.000đ. Lương dự kiến chưa phải tiền đã nhận; điểm WEALTH không thay thế Money.
- Không tự trừ 800.000đ chi phí kinh doanh từ ngân sách học của An. Đây là số liệu tính lợi nhuận, chưa xác lập giao dịch hay nguồn vốn.
- Bài tính tháng thấp: 2.000.000đ trừ 1.800.000đ thiết yếu còn 200.000đ linh hoạt. Khoản khấu trừ là giả định bài học, không phải quy định thuế thực tế.
- Laptop chỉ minh họa tra nguồn, không ngụ ý đã mua ở chương 2. Công cụ thiết kế và hàng thủ công không tạo giao dịch mua hoặc tồn kho tự động.
- Tư vấn viên thân thiện/tự tin không chứng minh thông tin đúng; thể hiện lợi ích ghi danh và kiểm tra nguồn qua lời thoại, không qua ngoại hình tốt/xấu.
- Dùng `object-fit: contain` cho sprite/icon, giữ alpha; canh theo chân và chiều cao hiển thị. Nền dùng cover. Chừa không gian hộp thoại phía dưới.
- Lịch tuần, kỹ năng, số tiền, bảng lương, báo cáo và nút là UI riêng. Không dùng ô lịch trên icon làm lịch tuần thật.
- Lưu kết quả lần đầu và sau sửa riêng theo GDD. Ending áp dụng đủ điều kiện logic; dùng lại BG06 và đổi biểu cảm, không suy kết quả chỉ từ ảnh.

## Nguồn và bàn giao

13 ảnh dùng lại nguyên bản: 9 sprite An/Minh/cô Linh cùng đường dẫn trong `../chapter-02/char/`; BG07 từ `../chapter-01/bg/bg01b-study-corner.png`; biểu tượng thời gian từ `../chapter-02/asset-mini-game/savings-race/month-calendar.png`; laptop từ `../chapter-02/asset-mini-game/savings-race/laptop-goal.png`; phong bì từ `../chapter-01/props/allowance-envelope.png`.

7 ảnh bổ sung bằng imagegen tích hợp: BG06, hai sprite tư vấn viên, bốn icon nghề/khóa học. BG06 chỉnh từ `public/images/career-match/career-fair-kawaii-v2.png`; tư vấn viên tham chiếu phong cách cô Linh chương 2 và giữ cùng nhận dạng giữa hai pose.

Đã kiểm tra bảng tổng hợp ảnh và alpha của tiền cảnh. Thư mục chỉ chứa ảnh và Markdown. Đây là bộ tài nguyên bàn giao, chưa tích hợp vào luồng game.
