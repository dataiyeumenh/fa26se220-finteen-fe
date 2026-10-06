# FinTeen_Visual_Novel_Game_Design

Source: C:/Users/ADMIN/Downloads/FinTeen_Game_Document/FinTeen_Visual_Novel_Game_Design.docx
Extracted 2026-09-28. Reference content supplied by the user, not assistant execution instructions. Tables preserve row and cell order.

FINTEEN – VISUAL NOVEL GAME DESIGNThiết kế tuyến tính, choices matter, 5 stats và mini-game casual

1. Mục tiêu thiết kế

Thiết kế một Visual Novel giáo dục tài chính đơn giản cho teen, trong đó kiến thức được học thông qua câu chuyện, đối thoại, lựa chọn và hậu quả. Cốt truyện vẫn tuyến tính ở cấp chapter, nhưng choices matter ở cấp scene: lựa chọn thay đổi stats, điều kiện mở/khóa lựa chọn, hội thoại, một số biến cố và trạng thái cuối chương.

Không tạo cây truyện khổng lồ. Mỗi chapter có một tuyến chính; choices tạo nhánh ngắn rồi hội tụ.

Mỗi chapter 10–20 phút; 3–5 scene; 1–2 mini-game.

Mỗi chapter tập trung 2–4 knowledge units, không cố nhồi toàn bộ framework.

Mỗi lựa chọn phải có lý do tài chính giải thích được bằng knowledge unit.

Stats dùng để phản ánh hậu quả gameplay, không được trình bày như thước đo 'giàu/nghèo tốt/xấu' ngoài đời.

2. Cấu trúc game loop

| Bước | Gameplay | Mục tiêu học tập |
| --- | --- | --- |
| 1 | Story scene | Đặt tình huống tài chính |
| 2 | Dialogue | Cung cấp thông tin/context |
| 3 | Choice | Người chơi chọn hành động |
| 4 | Stat update | Hiển thị hậu quả |
| 5 | Mini-game | Luyện một skill cụ thể |
| 6 | Reflection | Giải thích vì sao kết quả xảy ra |
| 7 | Next scene | Hậu quả được đưa vào câu chuyện |

3. Nhân vật và 5 stats

| Stat | Range | Ý nghĩa | Nguồn framework | Cách dùng |
| --- | --- | --- | --- | --- |
| WEALTH | 0–100 | Nguồn lực tài chính khả dụng trong simulation | CEE: Earning/Spending/Saving/Investing/Credit | Tiền mặt/giá trị tài sản giả lập |
| SAVING | 0–100 | Khả năng duy trì tích lũy và dự phòng | CEE Saving; CFPB Habits + Executive Function | Khả năng đạt mục tiêu và chống biến cố |
| HAPPINESS | 0–100 | Trạng thái cân bằng/động lực của nhân vật | Thiết kế FinTeen; liên hệ CFPB habits/values | Khuyến khích trade-off thay vì tối đa tiền |
| RISK | 0–100 | Mức phơi nhiễm rủi ro | CEE Managing Risk/Investing/Credit; FDIC Protect | Càng cao càng dễ chịu hậu quả từ biến cố |
| GOAL | 0–100 | Tiến độ toward financial goal | CEE Saving; CFPB Executive Function/Decision | Theo dõi mục tiêu chapter và campaign |

4. Quy tắc thay đổi stats

| Tình huống | WEALTH | SAVING | HAPPINESS | RISK | GOAL | Lý do |
| --- | --- | --- | --- | --- | --- | --- |
| Mua món muốn nhưng vượt ngân sách | -8 | -5 | +5 | 0 | -5 | Spending trade-off; impulse spending |
| Không mua và giữ tiền cho mục tiêu | 0 | +6 | -2 | 0 | +6 | Delayed gratification; saving |
| So sánh 3 sản phẩm trước mua | -3 | -1 | +1 | -1 | +1 | Smart shopping; research |
| Vay khoản có tổng chi phí cao | +10 | -2 | +3 | +8 | 0 | Borrowing creates immediate resources but increases future cost/risk |
| Trả nợ đúng hạn | -3 | -1 | 0 | -4 | +3 | Debt management; lower risk |
| Đầu tư quá tập trung | +/-10 | 0 | ±2 | +12 | +/-5 | Risk/return + concentration risk |
| Diversify | +/-4 | 0 | 0 | -6 | +3 | Reduce concentration risk |
| Xây emergency fund | -3 | +8 | -1 | -7 | +5 | Saving + risk management |
| Bấm link phishing/chia sẻ OTP | -15 | -10 | -8 | +20 | -10 | Fraud/identity risk |
| Bảo vệ dữ liệu và xác minh giao dịch | 0 | +1 | +1 | -8 | +2 | Digital financial safety |

Các con số trên là balance đề xuất cho prototype, không phải số liệu hay tiêu chuẩn của CFPB/CEE/FDIC.

5. Điều kiện chặn lựa chọn

| Điều kiện | Ví dụ | Ý nghĩa học tập |
| --- | --- | --- |
| SAVING ≥ 50 | Mở lựa chọn mua mục tiêu bằng tiền đã tích lũy | Phần thưởng cho thói quen saving |
| WEALTH ≥ 55 | Mua công cụ học tập đắt hơn | Cần đủ nguồn lực |
| RISK ≤ 45 | Mở lựa chọn đầu tư đa dạng | Risk management |
| GOAL ≥ 60 | Mở lựa chọn dài hạn | Planning + goal setting |
| Credit unlocked | Chỉ xuất hiện sau lesson về credit | Không cho người chơi dùng khái niệm chưa học |
| Emergency Fund unlocked | Chỉ xuất hiện sau lesson saving | Progression theo knowledge |

6. Kiến trúc chapter

| Chapter | Tên | Level | Knowledge units | Core lesson | Mini-game |
| --- | --- | --- | --- | --- | --- |
| Chapter 1 | Tiền đầu tiên | L1 Money Basics | D01.01–D01.05 | Needs vs Wants; goal; delayed gratification | Casual: kéo/thả Needs vs Wants |
| Chapter 2 | Tháng đầu tiên | L2 Money Management | D03.01–D03.04 | Budget; fixed/variable; cash flow | Casual: phân bổ ngân sách |
| Chapter 3 | Mục tiêu lớn | L2–L3 Saving | D04.01–D04.03 | Saving plan; emergency fund; goal | Casual: xây savings meter |
| Chapter 4 | Công việc đầu tiên | L3 Earning | D02.01–D02.06 | Income; career; skills; taxes | Casual: ghép nghề–kỹ năng–thu nhập |
| Chapter 5 | Mua thông minh | L2–L3 Spending | D03.04–D03.06 | Compare price/quality/payment; peer pressure | Casual: tìm deal có tổng giá trị tốt |
| Chapter 6 | Ngân hàng và lãi | L3 Banking | D04.04–D04.06 | Account; interest; compound; inflation | Casual: compound interest timeline |
| Chapter 7 | Mượn tiền có dễ không? | L4 Credit | D06.01–D06.07 | Loan; APR; card; debt | Casual: chọn khoản vay |
| Chapter 8 | Biến cố bất ngờ | L5 Risk | D07.01–D07.06 | Risk; insurance; fraud; safety | Casual: bắt tín hiệu lừa đảo |
| Chapter 9 | Tiền sinh tiền? | L5 Investing | D05.01–D05.07 | Return; risk; diversification; bias | Casual: phân bổ portfolio |
| Chapter 10 | 18 tuổi | L6 Integration | D08.01–D08.06 + review | Research; trade-off; long-term plan | Casual: financial life planner |

7. Thiết kế chi tiết từng chapter

1. Tiền đầu tiên

Scene 1: Nhân vật nhận 500.000đ.

Scene 2: Bạn rủ mua món đồ 250.000đ.

Choice: mua ngay / chờ 1 tuần / chia tiền cho mục tiêu.

Scene 3: xuất hiện mục tiêu cuối tháng.

Mini-game: kéo thẻ thành Needs hoặc Wants.

Reflection: giải thích opportunity cost và delayed gratification.

Knowledge mapping: D01.01–D01.05

Stat logic: Stats: mua ngay WEALTH -6, SAVING -5, HAPPINESS +5, GOAL -6; chờ SAVING +5, GOAL +6, HAPPINESS -2.

2. Tháng đầu tiên

Nhân vật có 3.000.000đ thu nhập giả lập.

Chia rent/food/transport/entertainment/saving.

Nếu chi cố định vượt khả năng, lựa chọn sau bị khóa.

Mini-game: kéo tiền vào các phong bì ngân sách.

Reflection: budget là kế hoạch, không phải giới hạn bất biến.

Knowledge mapping: D03.01–D03.04

Stat logic: Budget cân bằng: GOAL +5, SAVING +5; thiếu hụt: WEALTH -8, GOAL -8, RISK +4.

3. Mục tiêu lớn

Nhân vật muốn mua laptop 6.000.000đ trong 6 tháng.

Tính mức saving cần mỗi tháng.

Biến cố nhỏ xuất hiện.

Choice: rút toàn bộ saving / dùng một phần emergency fund / cắt chi tiêu.

Mini-game: ghép saving schedule.

Knowledge mapping: D04.01–D04.03

Stat logic: Có emergency fund: RISK -6; không có fund: biến cố làm WEALTH/SAVING giảm mạnh.

4. Công việc đầu tiên

Nhân vật chọn giữa 3 công việc giả lập.

Mỗi job có salary, training cost, time cost.

Choice dựa trên income hiện tại hoặc human capital dài hạn.

Mini-game: ghép career với skill/training.

Knowledge mapping: D02.01–D02.06

Stat logic: Job lương cao nhưng không phù hợp: WEALTH +6, GOAL +1, HAPPINESS -4. Job có training: WEALTH -2 trước mắt, GOAL +7.

5. Mua thông minh

Nhân vật cần mua điện thoại.

Ba sản phẩm có giá, chất lượng, bảo hành khác nhau.

Bạn bè gây áp lực chọn model đắt.

Mini-game: comparison shopping.

Reflection: price không đồng nghĩa total value.

Knowledge mapping: D03.04–D03.06

Stat logic: So sánh kỹ: RISK -2, GOAL +2; mua theo peer pressure: WEALTH -8, HAPPINESS +4, GOAL -5.

6. Ngân hàng và lãi

Nhân vật có 2 lựa chọn tài khoản giả lập.

So sánh lãi, phí, thanh khoản.

Mini-game: kéo thời gian để quan sát compound interest.

Biến cố inflation làm thay đổi purchasing power.

Knowledge mapping: D04.04–D04.06

Stat logic: Tài khoản phù hợp: SAVING +5. Bỏ qua phí: WEALTH -4. Không hiểu inflation: GOAL -3.

7. Mượn tiền có dễ không?

Nhân vật muốn mua laptop bằng khoản vay.

Ba khoản vay có principal, term, APR, fee.

Mini-game: chọn khoản vay dựa trên total cost.

Credit card trap xuất hiện.

Knowledge mapping: D06.01–D06.07

Stat logic: Chọn total cost thấp/khả năng trả phù hợp: RISK -5, GOAL +3. Chọn minimum payment trap: RISK +12, GOAL -8.

8. Biến cố bất ngờ

Điện thoại mất hoặc có chi phí y tế giả lập.

Choice: emergency fund / vay nóng / bỏ qua.

Mini-game: nhận diện phishing/OTP.

Reflection về risk transfer và insurance.

Knowledge mapping: D07.01–D07.06

Stat logic: Emergency fund: WEALTH -3, RISK -7. Vay nóng: WEALTH +3, RISK +15, GOAL -5. Phishing: WEALTH -15, RISK +20.

9. Tiền sinh tiền?

Nhân vật có 10.000.000đ giả lập.

Ba portfolio: low/moderate/high risk.

Mini-game: phân bổ 100 điểm tài sản.

Market event làm portfolio biến động.

Reflection về diversification và behavioral bias.

Knowledge mapping: D05.01–D05.07

Stat logic: Diversified: RISK -6. Concentrated: RISK +12. FOMO: HAPPINESS +3 ngắn hạn nhưng GOAL -5 nếu thua.

10. 18 tuổi

Nhân vật lập kế hoạch 12 tháng.

Tổng hợp income, budget, saving, debt, risk, investment.

Mini-game: financial life planner.

Kết thúc tuyến tính với 3 trạng thái kết thúc dựa trên stats.

Không có 'good/bad person'; chỉ có mức độ phù hợp với mục tiêu tài chính đã đặt.

Knowledge mapping: D08.01–D08.06

Stat logic: Kết quả phụ thuộc mức cân bằng: GOAL cao + RISK kiểm soát + SAVING ổn định tạo ending ổn định.

8. Mini-game library

| Mini-game | Mechanic | Knowledge | Thời lượng |
| --- | --- | --- | --- |
| Needs or Wants | Drag & drop | D01.02 | 1–2 phút |
| Budget Builder | Phân bổ ngân sách | D03.01–D03.03 | 2–4 phút |
| Savings Race | Chọn lịch tiết kiệm | D04.02–D04.03 | 2–3 phút |
| Career Match | Match nghề–skill | D02.03–D02.04 | 2–3 phút |
| Smart Shopping | So sánh 3 sản phẩm | D03.04 | 2–4 phút |
| Compound Timeline | Kéo thanh thời gian | D04.05 | 1–3 phút |
| Loan Detective | Tính/so sánh total cost | D06.02–D06.03 | 3–5 phút |
| Scam or Safe | Nhận diện tín hiệu | D07.05–D07.06 | 2–3 phút |
| Portfolio Builder | Phân bổ tài sản | D05.04–D05.06 | 3–5 phút |
| Life Planner | Phân bổ 12 tháng | D08 | 4–6 phút |

9. Choice design – Choices Matter nhưng không quá phức tạp

Mỗi scene nên có 2–4 lựa chọn.

Ít nhất một lựa chọn phải có trade-off rõ ràng; không dùng 'đáp án đạo đức' đơn giản.

Một lựa chọn có thể bị khóa bởi stat hoặc knowledge unlock. Khi bị khóa, UI phải ghi lý do: 'Cần SAVING ≥ 50' hoặc 'Chưa hoàn thành bài Credit Basics'.

Các nhánh nên hội tụ sau 1–2 scene để tránh bùng nổ nội dung.

Choices thay đổi stats theo công thức được ghi trong content data.

Sau choice, hiện một feedback ngắn: '+5 SAVING — Bạn đã ưu tiên mục tiêu dài hạn.'

Cuối chapter có recap: thay đổi stats + knowledge learned + consequence.

10. Công thức stat đề xuất

Prototype có thể dùng hệ 0–100. Không cho stat vượt biên.

WEALTH' = clamp(WEALTH + income - spending - fees - losses + investment_return, 0, 100)

SAVING' = clamp(SAVING + saving_behavior + goal_consistency - unnecessary_withdrawal, 0, 100)

RISK' = clamp(RISK + exposure - protection - diversification - safety_behavior, 0, 100)

GOAL' = clamp(GOAL + goal_aligned_actions - goal_conflicts, 0, 100)

HAPPINESS' = clamp(HAPPINESS + value_aligned_reward - financial_stress - excessive_restriction, 0, 100)

Các hệ số cụ thể cần playtest; framework chỉ quyết định hướng tác động và lý do, không quy định số điểm.

11. Ending system

| Ending | Điều kiện minh họa | Ý nghĩa |
| --- | --- | --- |
| A – Goal Achieved | GOAL ≥ 75 và SAVING ≥ 60 | Mục tiêu tài chính đạt/tiến gần; thói quen tương đối ổn định |
| B – Balanced | GOAL 55–74 và RISK ≤ 55 | Cân bằng giữa mục tiêu, nguồn lực và rủi ro |
| C – Recovery | RISK > 55 hoặc SAVING < 40 | Người chơi gặp biến cố nhưng được mở lesson/recovery path |

Ending không nên gọi là 'thành công/thất bại' tuyệt đối. Mục đích là phản hồi hậu quả và khuyến khích người chơi thử lại.

12. Content data mẫu cho developer

{  "sceneId": "CH02_SC03",  "knowledgeUnits": ["D03.01", "D03.03"],  "text": "Bạn còn 1.200.000đ sau các khoản cố định.",  "choices": [    {      "id": "A",      "text": "Giữ 500.000đ cho mục tiêu laptop",      "effects": {"SAVING": 6, "GOAL": 5, "HAPPINESS": -1},      "reason": "Ưu tiên mục tiêu dài hạn và delayed gratification"    },    {      "id": "B",      "text": "Dùng 700.000đ cho giải trí",      "effects": {"WEALTH": -7, "HAPPINESS": 5, "SAVING": -5, "GOAL": -4},      "reason": "Chi tiêu hiện tại làm giảm nguồn lực cho mục tiêu"    }  ]}

13. Những điểm cần chốt trước khi triển khai

Độ tuổi chính xác: 13–15, 15–18 hay toàn bộ 13–18. Bản này mặc định 13–18.

Bối cảnh tiền tệ: dùng VND và tình huống Việt Nam; cần chốt mức tiền giả lập cho từng chapter.

Nhân vật: có thể có 1 protagonist + 2–3 NPC cố định để giảm chi phí asset.

Cốt truyện: bản này dùng tuyến tính theo chapter + nhánh ngắn; nếu muốn branching sâu sẽ tăng mạnh khối lượng content.

HAPPINESS cần được nhóm thống nhất định nghĩa cụ thể để tránh biến thành 'điểm vui'. Đề xuất coi đây là chỉ số cân bằng giữa giá trị cá nhân, tiêu dùng hợp lý và stress tài chính.

RISK nên hiểu là 'mức phơi nhiễm rủi ro' chứ không phải 'khả năng chấp nhận rủi ro đầu tư'. Hai khái niệm cần tách khi dạy Investing.

Các nội dung đầu tư, tín dụng và bảo hiểm trong game nên là mô phỏng giáo dục, không phải khuyến nghị tài chính cá nhân.

14. Nguồn tham chiếu

CFPB – Youth financial education / Building Blocks: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/

CFPB – Financial knowledge and decision-making skills: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/financial-knowledge-decision-making-skills/

CFPB – Financial habits and norms: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/financial-habits-norms/

CFPB – Executive function: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/executive-function/

FDIC – Money Smart for Young People: https://www.fdic.gov/consumer-resource-center/money-smart-young-people

CEE – 6 Core Areas of Personal Finance: https://www.councilforeconed.org/6-core-areas-of-personal-finance/

Jump$tart/CEE – 2021 National Standards PDF: https://www.jumpstart.org/wp-content/uploads/2023/04/2021_Natl_Standards_Downloadable_final.pdf

