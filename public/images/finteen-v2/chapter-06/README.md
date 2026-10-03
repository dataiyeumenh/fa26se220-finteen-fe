# Chương 6 — Mượn tiền có dễ không?

Bộ art theo GDD v2, hoàn thành ngày 03/10/2026. Phong cách kawaii cartoon 2D, bảng màu mint–kem–coral, đồng bộ An, Minh và cô Linh của các chương trước.

Có **22 PNG**: 4 background, 4 scene, 9 sprite nhân vật, 4 asset mini game, 1 prop. **10 ảnh tạo mới bằng imagegen tích hợp; 12 ảnh tái sử dụng nguyên bản.** Đây là bộ tài nguyên hình ảnh, chưa tích hợp vào luồng chơi.

## Gắn nền và scene

Các góc BG10 cùng thuộc phòng thực hành thiết kế của trường; đổi góc nhìn theo hoạt động, không phải bốn địa điểm khác nhau.

| Nhịp truyện | Nền trống dùng cho hội thoại/tương tác | Scene minh họa có sẵn nhân vật | Cách dùng |
|---|---|---|---|
| SC01 — Cần laptop ngay hay có thể chờ? | `bg/bg10-design-lab.png` | `scene/sc01-school-computer-or-laptop.png` | Mở phòng máy, An dùng thiết bị chung; Minh đưa tờ giới thiệu. Chuyển về nền trống khi chọn phương án. |
| SC02 — So tổng chi phí và khả năng trả | `bg/bg10b-offer-comparison-board.png` | `scene/sc02-comparing-loan-offers.png` | Góc bảng ba đề nghị cho mini game Loan Detective; scene An và cô Linh so giấy tờ trước khi chọn. |
| SC03 — BNPL và thanh toán tối thiểu | `bg/bg10c-statement-workstation.png` | `scene/sc03-bnpl-and-minimum-payment.png` | Góc máy tính/sao kê cho hai thẻ bài tập. Scene An và Minh đọc giấy tờ dùng chuyển đoạn. |
| SC04 — Kế hoạch thực tế | `bg/bg10d-final-planning-table.png` | `scene/sc04-realistic-repayment-plan.png` | Bàn kế hoạch cuối buổi, dựng lịch và kiểm tra điều kiện; scene An trình bày với cô Linh dùng trước phản hồi. |

- Background và scene là ảnh ngang khoảng 16:9. Scene đã có người: ẩn sprite khi dùng, tránh nhân vật xuất hiện hai lần.
- Với nền góc cận bàn/màn hình, đặt UI trong panel riêng; nếu cần người nói, dùng chân dung hoặc crop nửa người ở cạnh. Không đặt sprite toàn thân đè lên mặt bàn.
- Các giấy, lịch và màn hình chỉ là minh họa. Chữ, số tiền, kỳ hạn, nút chọn và trạng thái phải dựng bằng UI; không dựa vào nét trang trí trên ảnh.
- Khi cần đọc số liệu, dùng nền trống + panel rõ ràng. Không chèn bảng số liệu nhỏ trực tiếp lên giấy nghiêng trong scene.
- SC04 là cảnh thảo luận, không phải ảnh xác nhận thắng. Các ending dùng nền bàn kế hoạch cùng biểu cảm/phản hồi tương ứng.

## Sprite nhân vật — 9 PNG nền trong suốt

Tất cả sao chép nguyên bản từ đường dẫn tương ứng trong `../chapter-02/char/`.

| File | Gợi ý |
|---|---|
| `char/an/an-neutral.png` | Hội thoại mở đầu |
| `char/an/an-thinking.png` | So phương án, đọc sao kê, lập lịch |
| `char/an/an-worried-money.png` | Phát hiện vượt khả năng trả hoặc thiếu phí ban đầu |
| `char/an/an-relieved.png` | Hiểu điều kiện và tìm được kế hoạch khả thi |
| `char/minh/minh-neutral.png` | Đọc thông tin cùng An |
| `char/minh/minh-inviting.png` | Gợi ý xem đề nghị trả góp ở SC01 |
| `char/co-linh/co-linh-neutral.png` | Lắng nghe |
| `char/co-linh/co-linh-explaining.png` | Giải thích tổng chi phí, dòng tiền, số dư |
| `char/co-linh/co-linh-encouraging.png` | Phản hồi kế hoạch đã kiểm tra |

GDD đặt An ở tuổi 18 trong tình huống chương này; thể hiện tuổi và bối cảnh qua lời dẫn. Bộ chibi giữ nhận diện chung. Không tự mang tiền hay quyền sở hữu đồ từ chương trước sang.

## Asset mini game và prop

| File | Nguồn | Vị trí/chức năng |
|---|---|---|
| `asset-mini-game/loan-detective/loan-offers-inspection.png` | Tạo mới, alpha | Icon mở mini game/đầu bảng so sánh; ba tờ đề nghị và kính lúp. Ba lựa chọn tương tác phải là ba card UI riêng. |
| `asset-mini-game/loan-detective/card-and-statement.png` | Tạo mới, alpha | Minh họa phần đọc sao kê và dư nợ ở SC03, không biểu thị trả xong. |
| `asset-mini-game/loan-detective/repayment-calendar.png` | `../chapter-02/asset-mini-game/savings-race/month-calendar.png` | Icon lịch SC04. Số kỳ và ngày đến hạn dùng UI. |
| `asset-mini-game/loan-detective/laptop-goal.png` | `../chapter-02/asset-mini-game/savings-race/laptop-goal.png` | Mục tiêu laptop 6 triệu ở SC01/SC02, không phải đồ An đã sở hữu. |
| `props/terms-and-fees.png` | `../chapter-04/props/receipt-and-quotation.png` | Minh họa mở chi tiết điều khoản/phí, không phải hợp đồng đã ký. |

## Lưu ý nội dung khi tích hợp

Theo tình huống giả lập trong GDD v2:
- Money đầu chương = 0; máy trường dùng được thêm 6 tháng. Thu nhập dự kiến 3 triệu/tháng, chi thiết yếu 2 triệu: trần trả nợ 1 triệu/tháng.
- Cùng khoản gốc 6 triệu: A = 6 × 1,1 triệu + 120 nghìn = 6,72 triệu, vượt trần tháng 100 nghìn. B = 8 × 800 nghìn + 200 nghìn = 6,6 triệu, còn 200 nghìn mỗi tháng nhưng thiếu nguồn trả phí ban đầu.
- C chỉ nêu 500 nghìn/kỳ, thiếu số kỳ/phí: chưa đủ thông tin tính tổng hoặc xác nhận. Không tự suy APR từ lãi phẳng.
- Chờ 6 tháng và tiết kiệm 1 triệu/tháng là lựa chọn khả thi. Chọn B chỉ có điều kiện: khóa bước ký đến khi xác minh nguồn phí 200 nghìn. Không cộng khoản vay vào Money nếu giải ngân thẳng cho cửa hàng.
- Ví dụ BNPL 6 triệu/3 kỳ = 2 triệu/kỳ; cộng nghĩa vụ 300 nghìn cùng kỳ thành 2,3 triệu. Phí chậm 100 nghìn/kỳ là dữ liệu giả lập của bài tập.
- Sao kê đến hạn 1 triệu, trả tối thiểu 100 nghìn thì còn 900 nghìn trước lãi/phí. Không mô tả trả tối thiểu là hết nợ.
- Thẻ BNPL/sao kê là bài học mô phỏng; ảnh không xác nhận đã cấp thẻ, phát sinh khoản vay hoặc trừ Money.
- Kết thúc cần xét điều kiện còn thiếu và mức hiểu bài theo GDD. Không dùng scene SC04 để mặc định người chơi đã vay hoặc đạt ending tốt.

## Nguồn và cách tạo

Tham chiếu nội dung: `FinTeen_Game_Design_Document_GDD_v2.docx`, chương 6; giữ định hướng visual novel và khung kiến thức tài chính v2.
Nền mới lấy phong cách ấm của chương 5 và bố cục phòng thiết kế; ảnh phòng IT cũ chỉ tham khảo không gian. Không dùng trực tiếp tuyến ảnh chương 6 cũ khác bối cảnh.
Các ảnh BG/scene mới dùng chế độ tạo/chỉnh có ảnh tham chiếu; hai icon tạo mới với nền alpha. File cuối nằm trong các thư mục trên; bản gốc do công cụ tạo được giữ trong cache ngoài dự án.

## Prompt tạo ảnh

### bg/bg10-design-lab.png

Use case: illustration-story. ONE 16:9 empty background BG10 for a kawaii cartoon 2D Vietnamese teen visual novel: vocational school DESIGN COMPUTER LAB, distinct from banking classroom. Reference 1 gives computer workstation idea only; reference 2 gives warm pastel style. Bright mint walls with pale peach accents, daylight from side windows, several wooden shared student workstations with monitors and drawing tablets, blank sketch sheets and color swatch cards on rear pinboard, a large blank teaching screen, small group planning table at side. Wide eye-level view with clear lower foreground for independent sprites and dialogue. Clean warm brown outlines, soft cel shading, fresh cream mint coral palette. No people, silhouettes, readable text, letters, prices, numbers, code, logos, watermarks, cash, bank counters or lending advertisement. All screens blank soft blue. Single coherent full-bleed scene.

### bg/bg10b-offer-comparison-board.png

Use case: precise-object-edit. ONE landscape 16:9 full-bleed illustration. EMPTY background: new near-frontal view of a comparison teaching corner in this design lab. Large cream board with exactly three completely blank pastel sheets mint coral lavender pinned side by side, small plain calculator and pencil on wooden ledge, workstation edge at side. Clear foreground for sprites. No people. Reference 1 establishes the location. Remaining references establish exact character identity: keep hairstyles, faces, yellow shirt for An, navy polo for Minh or blue blouse and glasses for Co Linh, same approved chibi proportions; change poses naturally. Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Screens and documents remain blank for later UI. Keep faces and key action above lower dialogue region.

### bg/bg10c-statement-workstation.png

Use case: precise-object-edit. ONE landscape 16:9 full-bleed illustration. EMPTY background: new close oblique view of design lab computer desk with large blank pale blue monitor, two completely blank cream statement sheets laid separately beside keyboard, a plain unbranded blue card at edge and a small desk calendar with blank page. No people. Screen is for later BNPL and statement UI. Reference 1 establishes the location. Remaining references establish exact character identity: keep hairstyles, faces, yellow shirt for An, navy polo for Minh or blue blouse and glasses for Co Linh, same approved chibi proportions; change poses naturally. Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Screens and documents remain blank for later UI. Keep faces and key action above lower dialogue region.

### scene/sc01-school-computer-or-laptop.png

Use case: compositing. ONE landscape 16:9 full-bleed illustration. Finished narrative scene: An yellow shirt sitting at a shared design-school computer with drawing tablet while Minh navy polo stands beside him showing a plain loan brochure. An pauses thoughtfully with stylus, Minh curious and enthusiastic. Medium side two-shot, visibly classroom-owned workstation, no newly purchased laptop, no money or signature. Reference 1 establishes the location. Remaining references establish exact character identity: keep hairstyles, faces, yellow shirt for An, navy polo for Minh or blue blouse and glasses for Co Linh, same approved chibi proportions; change poses naturally. Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Screens and documents remain blank for later UI. Keep faces and key action above lower dialogue region.

### bg/bg10d-final-planning-table.png

Create ONE empty environment background, landscape 16:9. Reference establishes the kawaii 2D design school lab art style and architecture. New camera angle: eye-level close view of a wooden group planning table beside the windows, blank open monthly planner, plain blank desk calendar, pencil, three blank pastel proposal cards. EMPTY chairs. Shared classroom computers and art pinboards behind. Warm afternoon light. Absolutely NO PEOPLE, no characters, no faces, no human silhouettes anywhere. Warm brown outlines, soft cel shading, fresh mint cream coral palette. Blank documents and screens, no text, numbers, watermark or UI. Full bleed.

### scene/sc02-comparing-loan-offers.png

Use case: compositing. ONE landscape 16:9 full-bleed illustration. Finished narrative scene: An yellow shirt and Co Linh glasses blue blouse at design lab table comparing exactly three plain pastel loan sheets and small calculator with blank display. An points to a sheet while Co Linh gestures to a separate blank calendar, thoughtful discussion. Medium over-table two-shot, no selected offer, signing, money transfer or approval badge. Reference 1 establishes the location. Remaining references establish exact character identity: keep hairstyles, faces, yellow shirt for An, navy polo for Minh or blue blouse and glasses for Co Linh, same approved chibi proportions; change poses naturally. Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Screens and documents remain blank for later UI. Keep faces and key action above lower dialogue region.

### scene/sc03-bnpl-and-minimum-payment.png

Use case: compositing. ONE landscape 16:9 full-bleed illustration. Finished narrative scene: An yellow shirt and Minh navy polo sit at design lab computer, examining two separate blank statement sheets beside a plain unbranded card. Minh looks puzzled and An thoughtfully traces one sheet with pencil without signing. Medium side two-shot, monitor blank soft blue, no cash, debt celebration, fixed numbers or completed payment. Reference 1 establishes the location. Remaining references establish exact character identity: keep hairstyles, faces, yellow shirt for An, navy polo for Minh or blue blouse and glasses for Co Linh, same approved chibi proportions; change poses naturally. Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Screens and documents remain blank for later UI. Keep faces and key action above lower dialogue region.

### scene/sc04-realistic-repayment-plan.png

Use case: compositing. ONE landscape 16:9 full-bleed illustration. Finished narrative scene: An yellow shirt explains a blank calendar and open planning notebook to Co Linh glasses blue blouse at group table in design lab. Co Linh listens supportively; shared classroom computer visible behind reinforces option to wait. Medium two-shot in afternoon light, no contract signature, new laptop, money transfer or success trophy. Reference 1 establishes the location. Remaining references establish exact character identity: keep hairstyles, faces, yellow shirt for An, navy polo for Minh or blue blouse and glasses for Co Linh, same approved chibi proportions; change poses naturally. Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Screens and documents remain blank for later UI. Keep faces and key action above lower dialogue region.

### asset-mini-game/loan-detective/loan-offers-inspection.png

Use case: illustration-story. ONE square game item. One square isolated icon: three overlapping blank cream loan proposal sheets with mint coral lavender header bands and one small magnifying glass resting beside them. Compact three-quarter still life, full objects centered ample margin. No printed letters, numbers, tick, seal, money, people or floor. Genuine alpha transparent background.  Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Real alpha background.

### asset-mini-game/loan-detective/card-and-statement.png

Use case: illustration-story. ONE square game item. One square isolated icon: long blank cream statement sheet beside plain muted blue payment card with small generic gold chip, no digits or brand. Compact coherent three-quarter still life. Represents an obligation to inspect, no completed payment or checkmark. Entire objects centered ample margin. No text, currency, arrows, logos, people or floor. Genuine alpha transparent background.  Clean kawaii cartoon 2D, warm dark brown outlines, soft cel shading, fresh mint cream coral palette consistent with previous chapters. No readable text, numbers, logos, watermark, speech bubbles or UI. Real alpha background.

