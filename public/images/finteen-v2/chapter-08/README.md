# Chương 8 — Tiền sinh tiền và kế hoạch 18 tuổi

Bộ art hoàn tất ngày 14/10/2026 theo `Document v2/FinTeen_Game_Design_Document_GDD_v2.docx`, mục 5.8; đối chiếu bối cảnh và mini-game với bản revised. An và Minh 18 tuổi trong mô phỏng độc lập.

**33 PNG: 5 background, 5 scene, 9 sprite, 12 ảnh mini-game, 2 props.** 16 ảnh tạo mới bằng imagegen tích hợp; 17 ảnh tái sử dụng nguyên bản. Cartoon 2D kawaii/chibi, màu mint–kem–coral và viền nâu ấm. Bộ art sẵn sàng để tích hợp; lượt này không thêm gameplay.

## Background và scene

| Scene GDD | Background trống | Tranh kể chuyện | Cách dùng |
| --- | --- | --- | --- |
| SC01 — Tiền cần sớm và tiền có thể đợi | `bg/bg13-investment-classroom.png` | `scene/sc01-near-and-long-term-goals.png` | An/cô Linh xem mục tiêu khóa học và thời hạn dài. |
| SC02 — Phân bổ 100 điểm | `bg/bg13b-asset-allocation-table.png` | `scene/sc02-building-allocation.png` | An/Minh phân bổ thẻ minh họa; chuyển sang UI cho Portfolio Builder. Số quân vẽ trong tranh không phải tỷ trọng đáp án. |
| SC03 — Biến động và lời hứa lợi nhuận | `bg/bg12-investment-simulation-tablet.png` | `scene/sc03-reviewing-market-and-promises.png` | An/Minh/cô Linh đối chiếu tablet, quảng cáo và hồ sơ; dữ liệu thị trường và nguồn quảng cáo nằm trong UI. |
| SC04 — Kế hoạch 12 tháng | `bg/bg14-twelve-month-planning-desk.png` | `scene/sc04-adjusting-twelve-month-plan.png` | An/cô Linh điều chỉnh lịch; mở Life Planner trên nền bàn. |
| SC05 — Bản kế hoạch của chính mình | `bg/bg14b-plan-review-corner.png` | `scene/sc05-explaining-personal-plan.png` | Trình bày và reflection; dùng nền này cho mọi ending với biểu cảm phù hợp. |

Ảnh ngang 1672×941, gần 16:9. BG13/BG14 và góc tablet cùng là các góc của buổi mô phỏng tại trường. `scene/` có sẵn nhân vật nên ẩn sprite rời. `bg/` dùng cho hội thoại, lựa chọn và thao tác; nền cận bàn nên dùng portrait nhỏ hoặc ẩn nhân vật khi chơi. Không dùng tranh kết thúc để mặc định lợi nhuận, thành công hay ending A.

## Nhân vật — 9 PNG alpha

Sao chép nguyên bản từ `../chapter-06/char/`, bộ 18 tuổi. An sơ mi vàng xắn tay trên áo kem, quần xanh dài; Minh sơ mi navy cài nút toàn thân áo, xắn tay, quần be và đồng hồ. Cô Linh giữ cùng mẫu chibi người lớn. Cảnh SC02 đã chỉnh riêng áo Minh cho đúng sprite 18 tuổi.

| File | Vai trò |
| --- | --- |
| `char/an/an-neutral.png` | Mở đầu/nhận dữ kiện |
| `char/an/an-thinking.png` | Xét thời hạn, rủi ro và sửa kế hoạch |
| `char/an/an-worried-money.png` | Phát hiện thiếu mục tiêu gần hoặc nguồn bù |
| `char/an/an-relieved.png` | Giải thích được kế hoạch phù hợp |
| `char/minh/minh-neutral.png` | Thảo luận phân bổ |
| `char/minh/minh-inviting.png` | Gợi ý theo tài sản đang tăng ở SC02/03 |
| `char/co-linh/co-linh-neutral.png` | Lắng nghe lý do |
| `char/co-linh/co-linh-explaining.png` | Hướng dẫn đối chiếu dữ kiện |
| `char/co-linh/co-linh-encouraging.png` | Phản hồi khả năng điều chỉnh |

Render `contain`, căn chân; giữ tỷ lệ chibi, không tăng chiều cao theo tuổi. Luôn dùng sprite trong thư mục chapter này.

## Portfolio Builder — 5 PNG alpha

Trong `asset-mini-game/portfolio-builder/`:

| File | Vai trò/nguồn |
| --- | --- |
| `liquid-money.png` | Thanh khoản; sao chép `chapter-05/asset-mini-game/compound-timeline/nominal-money.png` |
| `bond.png` | Trái phiếu giả lập; tạo mới |
| `equity.png` | Cổ phiếu/quyền sở hữu công ty giả lập; tạo mới |
| `diversified-fund.png` | Quỹ/danh mục đa dạng, thẻ minh họa; tạo mới |
| `real-estate.png` | Nhận biết bất động sản trong Inspect; tạo mới |

Ba nhóm thanh khoản/trái phiếu/cổ phiếu dùng cho bài phân bổ 100 điểm. Quỹ và bất động sản phục vụ phần kiến thức/Inspect. Mỗi điểm, tỷ trọng, rủi ro, lợi nhuận và phí phải hiển thị bằng UI. Không đọc số vật trong hình thành giá trị; hình không bảo đảm an toàn hoặc lợi nhuận.

## Life Planner — 7 PNG alpha

Trong `asset-mini-game/life-planner/`, sao chép nguyên bản từ bộ đã duyệt:

| File | Nguồn trong `finteen-v2/` | Cách dùng |
| --- | --- | --- |
| `month-calendar.png` | `chapter-02/asset-mini-game/savings-race/month-calendar.png` | Tái sử dụng cho 12 ô tháng, số tháng do UI ghi |
| `income-envelope.png` | `chapter-02/props/monthly-income-envelope.png` | Thu nhập kế hoạch/thu nhập tháng thấp |
| `essential-expenses.png` | `chapter-02/asset-mini-game/budget-builder/housing.png` | Nhóm chi thiết yếu; hình chỗ ở là đại diện, không giới hạn nhóm chỉ còn tiền nhà |
| `flexible-expenses.png` | `chapter-02/asset-mini-game/budget-builder/entertainment.png` | Phần chi có thể điều chỉnh |
| `course-goal.png` | `chapter-05/props/course-goal.png` | Mục tiêu khóa học |
| `existing-obligation.png` | `chapter-06/asset-mini-game/loan-detective/card-and-statement.png` | Nghĩa vụ cũ đã nằm trong chi thiết yếu; không cộng lại |
| `price-change.png` | `chapter-05/asset-mini-game/compound-timeline/purchasing-power-basket.png` | Thẻ kịch bản giá thiết yếu tăng; số tăng do UI hiển thị |

Không cần 12 ảnh lịch có chữ riêng: dùng cùng hình và nhãn tháng bằng UI. Lịch rà soát dài hạn/hưu trí ở mức nhận biết dùng cùng calendar và nội dung giải thích theo GDD.

## Props — 2 PNG alpha tạo mới

`props/crypto-app.png`: ứng dụng tài sản mã hóa mô phỏng có bảng xếp hạng, token và nút trống; nội dung gây thúc ép và giải thích FOMO nằm ở UI. `props/esg-claim-inspection.png`: kính lúp, tờ quảng cáo lá xanh và báo cáo dùng cho thao tác kiểm tra bằng chứng/xung đột lợi ích; không phải chứng nhận sản phẩm.

## Dữ kiện nội dung cần giữ khi tích hợp

Money đầu 10.000.000đ; 3.000.000đ dùng cho khóa học sau ba tháng. Phân bổ là bài tập, không tự tạo giao dịch hoặc ví phụ. Phương án 30 thanh khoản/40 trái phiếu/30 cổ phiếu và 10 thanh khoản/90 cổ phiếu phải được tính bằng UI. Thẻ thị trường cố định: cổ phiếu −10%, trái phiếu +2%, thanh khoản 0%; tất toán SC03 ghi chênh lệch một lần: −220.000đ hoặc −900.000đ. Không lấy lời/lỗ thị trường làm điểm năng lực.

Kế hoạch mẫu thu nhập 3 triệu, thiết yếu 2 triệu, mục tiêu 600 nghìn, linh hoạt 400 nghìn; nghĩa vụ 300 nghìn đã trong thiết yếu. Khi thu nhập 2,6 triệu và thiết yếu 2,2 triệu, còn 400 nghìn: cần sửa mục tiêu hoặc chứng minh nguồn bù. Thu nhập và lợi nhuận dự báo không là tiền đã nhận. Ending xét tính phù hợp, kiểm tra nguồn và kế hoạch khả thi; dùng nền SC05 cho cả ba nhánh.

Kiểm kê/kích thước/checksum: [manifest](../chapter-07-08-manifest.json). [Bảng xem toàn bộ ảnh](../../../../output/chapter-07-08-art/chapter-08-review.png). [Prompt tạo ảnh](../../../../output/chapter-07-08-art/final-prompts.md).
