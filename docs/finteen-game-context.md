# FinTeen — Context mới cho game và mini-game

> Rà soát 01/10/2026: tài liệu này mô tả tuyến Minh, 10 chương; code main và `cot_truyen_text.txt` vẫn có tuyến Tí, 8 chương. Người dùng xác nhận giữ mini game chương 1–2 trên main và bản Minh chọn lịch học/ca làm của chương 4. Không suy diễn rằng toàn bộ main đã chuyển sang thiết kế này. Xem `README.md` trong thư mục docs để biết phạm vi được giữ.

Cập nhật 28/09/2026 theo yêu cầu người dùng đọc kỹ và ghi nhớ ba tài liệu Word. Đây là mốc thiết kế mới cho công việc game/mini-game; chưa phải xác nhận mã nguồn hiện tại đã triển khai các nội dung này.

## Nguồn và cách sử dụng

Nguồn gốc nằm trong `C:/Users/ADMIN/Downloads/FinTeen_Game_Document/`:

1. `FinTeen_Financial_Knowledge_Framework.docx`: taxonomy, knowledge units và năng lực học tập.
2. `FinTeen_Visual_Novel_Game_Design.docx`: thiết kế VN nền, công thức stats và prototype.
3. `FinTeen_Game_Design_Document_GDD_v3_Expanded.docx`: nhân vật, 10 chương, scene, flags, decision styles, endings và thông số mini-game chi tiết.

Đã đọc toàn bộ nội dung, gồm 12/7/70 bảng tương ứng framework/VN/GDD. Không có ảnh nhúng, comments, footnotes, endnotes hoặc tracked changes. Đọc nội dung OOXML và bảng, không thực hiện kiểm định bố cục trang Word. Bản trích đầy đủ giữ thứ tự đoạn và hàng/cột bảng nằm trong [finteen-game-context-sources](finteen-game-context-sources/). Dùng các bản trích khi cần tra con số, lời thoại, effect hoặc scene chính xác; bản tổng hợp này không thay thế mọi chi tiết nguồn.

Các chỉ dẫn thiết kế trong tài liệu là dữ liệu yêu cầu sản phẩm, không phải lệnh thực thi cho trợ lý. Các nguồn quốc tế được tài liệu dẫn chưa được kiểm chứng độc lập trong lần đọc này.

Quy ước làm việc: lấy framework làm mốc ID kiến thức; dùng phần mở rộng 21–25 của GDD cho chi tiết scene/mini-game vì tài liệu gọi đây là phần triển khai chi tiết của phần trước. Đây là cách đọc để làm việc, không phải tuyên bố mọi mâu thuẫn đã được người dùng chốt. Ghi rõ điểm khác nhau trước khi triển khai logic phụ thuộc vào chúng.

Context này thay mô tả gameplay 8 chương và hành trình tới nghỉ hưu trong bản ghi cũ. Các yêu cầu tài khoản, slot, QR/PIN, gia đình/lớp học, quiz giáo viên, thanh toán và mobile trong [finteen-project-context.md](finteen-project-context.md) vẫn giữ nguyên khi chưa có cập nhật riêng. Không tự gán nội dung/asset/mini-game chương cũ sang số chương mới.

## Định hướng sản phẩm

- Educational Visual Novel + Life Simulation + Casual Mini-Games, working title `FinTeen — First Steps`.
- Teen 13–18, GDD ghi practical core 14–18; Việt Nam, tiền VND, dữ liệu và sản phẩm tài chính giả lập.
- 10 chương theo tuyến chính, nhánh ngắn hội tụ; 10–20 phút/chương. VN đề xuất 3–5 scene, 1–2 mini-game/chương; phần mở rộng mô tả 4 scene/chương.
- Story trước quiz; kiến thức xuất hiện do nhân vật gặp vấn đề tài chính. Lựa chọn có trade-off và hậu quả giải thích được, không đánh giá phẩm chất tốt/xấu.
- Loop: story/dialogue → choice → stats/flags → mini-game → consequence → reflection → scene tiếp.
- 2–4 knowledge units trọng tâm/chương là mục tiêu thiết kế, dù bảng coverage hiện liệt kê rộng hơn ở nhiều chương.
- Mỗi chương chạm factual concept, application/research/comparison, habit/reflection. Chơi lại để khám phá hậu quả khác và cải thiện hiểu biết.

## Nhân vật và thế giới

Minh 16 tuổi là protagonist; Linh 16 là bạn thân tạo tình huống trend/peer pressure; Nam 17 thiên về phân tích nhưng có thể overconfident; Mai 17 làm part-time, planning/saving/human capital; Ms. An 35 là mentor đặt câu hỏi; mẹ 42, bố 45 gắn với tài chính gia đình; Scam Account là đối kháng số.

Bối cảnh nhà, trường, thư viện, cafe, cửa hàng, nơi part-time, trạm xe buýt và UI số. GDD ghi cốt truyện khoảng một năm học, nhưng chương 10 là sinh nhật 18 tuổi: timeline chưa khớp với Minh 16 tuổi, không tự bịa time skip.

## Framework và taxonomy

CEE/Jump$tart 2021: sáu nhóm Earning Income, Spending, Saving, Investing, Managing Credit, Managing Risk. CFPB: Executive Function; Financial Habits & Norms; Financial Knowledge & Decision-Making Skills. FDIC Money Smart: tham chiếu bài học và tình huống thực hành. Các framework này không phải chuẩn Việt Nam; stats là thiết kế riêng FinTeen.

| Domain | Knowledge units theo thứ tự ID |
| --- | --- |
| D01 Money Foundations | .01 Money & value; .02 Needs vs Wants; .03 Opportunity Cost; .04 Financial Goals; .05 Delayed Gratification |
| D02 Earning & Career | .01 Sources of Income; .02 Gross vs Net Income; .03 Human Capital; .04 Career Choice; .05 Entrepreneurship; .06 Taxes & Deductions |
| D03 Spending & Budgeting | .01 Budget; .02 Fixed vs Variable Expense; .03 Cash Flow; .04 Smart Shopping; .05 Advertising & Peer Pressure; .06 Payment Methods |
| D04 Saving & Banking | .01 Why Save; .02 Savings Goal & Plan; .03 Emergency Fund; .04 Banking Basics; .05 Interest & Compound Interest; .06 Inflation & Purchasing Power |
| D05 Investing | .01 Saving vs Investing; .02 Assets; .03 Return; .04 Risk & Return; .05 Diversification; .06 Time Horizon & Goals; .07 Behavioral Biases |
| D06 Credit & Debt | .01 Credit & Borrowing; .02 Principal, Interest, Fees; .03 APR / Cost of Credit; .04 Creditworthiness; .05 Credit Card; .06 Debt Management; .07 Predatory Lending |
| D07 Risk, Insurance & Safety | .01 Financial Risk; .02 Avoid/Reduce/Retain/Transfer; .03 Insurance; .04 Insurance Terms; .05 Identity Theft & Fraud; .06 Digital Financial Safety |
| D08 Financial Decision-Making | .01 Research; .02 Comparison; .03 Trade-offs; .04 Self-control; .05 Habits; .06 Consequences |

Tổng 49 units. Lộ trình gợi ý L1 Money Basics (13–14), L2 Money Management (14–15), L3 Earning & Saving (15–16), L4 Credit & Debt (16–17), L5 Investing & Risk (17–18), L6 Financial Independence (18+). Tuổi của level là gợi ý, không tự biến thành khóa truy cập.

Mỗi unit nên có learning objective, skill/decision, tiêu chí đánh giá và tương tác. Thuế, ngân hàng, tín dụng, bảo hiểm, pháp lý cần Việt hóa tại thời điểm triển khai; không sao chép quy định Mỹ sang Việt Nam.

## Stats, choices và trạng thái

Năm stats trong prototype có miền 0–100, clamp khi cập nhật:

- WEALTH: nguồn lực khả dụng trong mô phỏng; không đồng nhất tự động 1 điểm với một số VND.
- SAVING: tích lũy, thói quen và dự phòng.
- HAPPINESS: cân bằng enjoyment, values, financial stress; không chỉ là điểm vui.
- RISK: mức phơi nhiễm rủi ro; **cao hơn nghĩa là dễ tổn thất hơn**. Tách khỏi risk tolerance trong đầu tư.
- GOAL: tiến độ mục tiêu hiện tại/campaign; quy tắc đổi mục tiêu chưa được mô tả đầy đủ.

Công thức VN: WEALTH cộng income/return, trừ spending/fees/losses; SAVING cộng saving behavior/goal consistency, trừ unnecessary withdrawal; RISK cộng exposure, trừ protection/diversification/safety; GOAL cộng aligned actions, trừ conflicts; HAPPINESS cộng value-aligned reward, trừ stress/excessive restriction. Mọi hệ số là balance prototype cần playtest, không phải thông số từ standards.

Ví dụ GDD (W/S/H/R/G): impulse buy -6/-5/+5/0/-6; delayed purchase 0/+5/-2/0/+6; budget first 0/+5/+1/-2/+5; emergency fund -2/+6/-1/-7/+5; high-cost debt +5/0/+3/+10/-6; diversification 0/0/0/-7/+3; verify scam 0/+1/+1/-8/+2; share OTP -15/-10/-8/+20/-10. Tra effect theo scene vì các bảng mẫu không hoàn toàn giống nhau.

Mỗi scene thường 2–4 choices; nhánh hội tụ sau 1–2 scene hoặc dialogue 2–6 dòng. Choice làm đổi stats, flags, dialogue, lựa chọn mở/khóa và hậu quả muộn. Locked choice vẫn hiển thị kèm lý do.

Gates: stat (ví dụ SAVING ≥50), knowledge (D06.03 completed), risk (RISK ≤45), resource (WEALTH ≥30), flag (F_RESEARCH_FIRST), story (chapter 6 completed). Tránh khóa vĩnh viễn nội dung học vì profile.

Save state: chapterId, sceneId, stats, personalityScores, flags, unlockedKnowledge, completedMinigames, choiceHistory, ending. Đây là danh sách trường thiết kế, chưa phải schema/backend contract đã triển khai.

Flags xuyên chương chính: F_GOAL_SERIOUS, F_EMERGENCY_READY, F_RESEARCH_FIRST, F_PEER_PRESSURE, F_DIGITAL_SAFE, F_DEBT_CAUTION, F_RISK_AWARE, F_OVER_RESTRICT. Scene còn có các flags cụ thể; tra bản trích GDD. Chương 7–10 phải đọc lịch sử chương 1–6; ví dụ nợ bạn/trả góp xuất hiện lại ở chương 7, nghĩa vụ cũ đưa vào planner chương 10.

## Financial Decision Style

Sáu chiều ẩn: Planner, Saver, Explorer, Balancer, Risk Manager, Independent Thinker (bảng điểm đôi khi viết Independent). Phản ánh hành vi trong FinTeen, không phải trắc nghiệm tâm lý, trí thông minh hay phẩm chất ngoài đời. Không có profile tốt nhất, không dùng xếp hạng, profile có thể đổi khi replay.

Điểm tăng/giảm từ hành vi lặp lại. Ví dụ extreme restriction tăng Planner/Saver nhưng giảm Balancer; research tăng Explorer; bảo vệ/đa dạng hóa tăng Risk Manager. Ngưỡng gợi ý 0–9 Emerging, 10–19 Developing, 20–29 Consistent, ≥30 Strongly demonstrated. Chưa có quy tắc chuẩn hóa số cơ hội hoặc xử lý điểm âm.

## Mười chương mới

| Chương | Tên và kiến thức | Tình huống, scene chính | Mini-game |
| --- | --- | --- | --- |
| 1 | Tiền đầu tiên; D01.01–05 | Kiếm 500k từ poster; phụ kiện 250k; goal tai nghe 1,2 triệu; mua/chờ/chia tiền; trò chuyện với mẹ | Needs or Wants — Context Edition |
| 2 | Tháng đầu tiên; D03.01–04 | 3 triệu/tháng; xem lịch sử giao dịch; budget; phí trường 350k; cân đối lại | Budget Builder |
| 3 | Mục tiêu lớn; D04.01–03 | Laptop 6 triệu/6 tháng; auto-save/cắt chi/tăng thu; sửa xe 450k; bảo vệ goal bằng buffer | Savings Race |
| 4 | Công việc đầu tiên; D02.01–06 | Event job/internship/shop; payslip gross/net; ca làm so với học tập; research nghề | Career Match; bài đọc payslip |
| 5 | Mua thông minh; D03.04–06 | Điện thoại hỏng; budget 6,5 triệu; tiêu chí, total cost, bảo hành; cash/debit/trả góp | Smart Shopping; Total Cost Calculator được nhắc như hoạt động hỗ trợ |
| 6 | Ngân hàng và lãi; D04.04–06 | Tách tiền goal/emergency; account fees/rate/liquidity; mô phỏng lãi và sức mua | Compound Timeline; Account Detective được nhắc nhưng chưa có spec riêng |
| 7 | Mượn tiền có dễ không?; D06.01–07 | Ba khoản vay; minimum payment; lịch trả nợ từ các chương trước; kế hoạch recovery | Loan Detective; credit-card scenario |
| 8 | Biến cố bất ngờ; D07.01–06 | Scam OTP 10 phút; xử lý sự cố; privacy; coverage và buffer | Scam or Safe; Coverage Match |
| 9 | Tiền sinh tiền?; D05.01–07 | 10 triệu giả lập; goal 6 tháng/3 năm/10+ năm; portfolio; headline/FOMO | Portfolio Builder; Bias Detector |
| 10 | 18 tuổi; D08.01–06 và tổng hợp | 3 priorities; kế hoạch 12 tháng; nghĩa vụ cũ; shock thu nhập -15%, social cost, skill course | Financial Life Planner; ending + reflection |

## Mini-game chi tiết theo GDD phần 22

| Mini-game | Thời lượng | Cơ chế và quy tắc | Trọng số score |
| --- | --- | --- | --- |
| Needs or Wants | 2–4 phút | 10–12 cards; Need/Want/Depends on context; giải thích Why và ưu tiên khi thiếu budget; không timer mặc định | Accuracy 50%, justification 30%, prioritization 20% |
| Budget Builder | 5–7 phút | Phân loại Fixed/Variable/Saving/Goal; cash flow realtime; shock rồi giữ buffer; Undo/Reset; không bỏ hết essential needs | Feasibility 35%, saving/goal 20%, resilience 25%, explanation 20% |
| Savings Race | 4–6 phút | 6–12 payday nodes; auto-save %/số tiền; events; 2 Adjust Plan miễn phí; goal + Emergency Shield | Goal progress 30%, resilience 30%, sustainability 25%, adaptation 15% |
| Career Match | 5 phút | 3–5 nghề; pay/training/commute/schedule/stability/interest/growth; research tốn turn; trọng số theo goal; không có nghề tốt nhất toàn cục | Goal fit 40%, research 30%, explanation 30% |
| Smart Shopping | 4–6 phút | 3 tiêu chí; inspect price/accessories/fee/warranty/repair/return; 2 evidence tokens; replay đổi sản phẩm | Fit 35%, total-cost inspection 30%, evidence 25%, resistance to irrelevant persuasion 10% |
| Compound Timeline | 4–5 phút | Principal/contribution/rate/years sliders; predict trước khi hiện graph; inflation toggle nâng cao; isolate-one-variable | Prediction 30%, causal explanation 40%, comparison 30% |
| Loan Detective | 6–8 phút | 3 dossiers, highlight 5 trường then chốt, calculator total repayment, xét cash flow và goal; replay đổi offer | Field detection 30%, cost comparison 40%, suitability explanation 30% |
| Scam or Safe | 3–5 phút | 12 messages; Safe/Suspicious/Need verification; Inspect sender/domain/request/context; timer optional; có tin hợp pháp nhưng bất thường | Classification 70%, inspection 20%, false-positive control 10% |
| Coverage Match | 4–5 phút | Probability × Impact; protection budget hữu hạn; buffer/prevention/insurance/accept risk; không thưởng bảo hiểm tất cả | High-impact protection 40%, cost efficiency 30%, buffer 20%, explanation 10% |
| Portfolio Builder | 6–8 phút | 100 tokens/4 asset classes; chọn goal/horizon trước; 6 events; tối đa 2 rebalance; không hứa lợi nhuận | Suitability 35%, diversification 25%, consistency 20%, event response 20% |
| Bias Detector | 3–4 phút | 8 scenes; FOMO/herding/overconfidence/loss aversion/anchoring; chọn bias + response process + lý do | Recognition 50%, response 30%, explanation 20% |
| Financial Life Planner | 10–15 phút | 12 tháng, 3 priorities, 3 shocks, borrowing/payment decision, chia surplus, 2 câu reflection, replay checkpoint | Feasibility 25%, resilience 25%, goal alignment 20%, risk management 15%, reasoning 15% |

Triết lý assessment: mini-game luyện học không tự trừ WEALTH/SAVING/RISK do đáp án sai. Hậu quả tài chính thuộc quyết định trong narrative khi được thiết kế rõ. Score dùng cho mastery, feedback, badge, unlock. Chấp nhận nhiều lời giải theo hoàn cảnh; phân biệt reasoning/goal-fit với câu factual có đáp án đúng. Không tối đa saving bằng mọi giá; không chấm portfolio chỉ theo lợi nhuận may mắn.

Global mastery: 80–100 Mastered (unlock unit, optional advanced challenge, không ép replay); 60–79 Developing (unlock base content, 1–2 targeted feedback cards); 0–59 Needs practice (guided replay, không phạt financial stats; knowledge gate mềm trừ prerequisite thật sự).

Telemetry được đề xuất: attempts, completion time, hint use, changed answers, evidence inspected, score by subskill, improvement on replay. Không biến telemetry thành nhãn tâm lý. Assessment còn gồm knowledge, application, decision quality, consistency, reflection, recovery; stats không thay thế mastery.

## Endings theo GDD

| Ending | Điều kiện gợi ý |
| --- | --- |
| E1 Mục tiêu đạt được | GOAL ≥75, SAVING ≥60, RISK ≤55 |
| E2 Cân bằng | GOAL ≥55, RISK ≤55, HAPPINESS ≥45 |
| E3 Người ra quyết định | Explorer ≥20, Independent ≥20, GOAL ≥55 |
| E4 Bài học từ biến cố | RISK >55 hoặc SAVING <40 |
| E5 Cơ hội mới | Planner ≥20, Explorer ≥20, GOAL ≥65 |
| E6 Thử lại | Không đạt threshold chính; 3 growth areas + replay |

GDD mở rộng nói ending kết hợp stats + flags + tendencies + mastery. Bảng threshold mới là gợi ý và chưa có thứ tự ưu tiên khi nhiều ending cùng thỏa. Không gọi Good/Bad Ending. VN nền chỉ có 3 trạng thái minh họa A/B/C; không dùng chúng thay 6 ending GDD khi làm thiết kế mới.

## UI và sản xuất nội dung

Background full-screen, 1–2 sprite, dialogue lower third; HUD compact 5 stats, click/tap xem định nghĩa; Knowledge Library D01–D08; stat animation và một câu giải thích sau major choice; recap cuối chương.

Accessibility: text speed, auto/skip, replay dialogue, keyboard navigation, contrast dễ đọc; tắt timer/turn pressure khi phù hợp. Tutorial mini-game tối đa 3 bước, lần sau có Skip. Dùng tooltip/inspect/mentor/reflection thay vì nhồi định nghĩa vào thoại.

Background modular: Bedroom Day/Night, Family Kitchen, School Courtyard, Classroom, Library, Cafe, Mall/Store, Part-time Workplace, Bus Stop, Digital UI Overlay; 2–3 lighting states. Major choice có close-up receipt/payslip/loan offer/phone/budget/account comparison. Không dùng thương hiệu ngân hàng, ticker, khoản vay hay scam thật.

## Điểm chưa thống nhất cần giữ lại khi triển khai

1. Framework mục 6 đặt hành vi protection/diversification trong cột tăng RISK dù định nghĩa là exposure. VN và GDD nhất quán protection làm giảm RISK; ghi nhận lỗi chiều trong bảng framework, không sao chép ngược vào code.
2. Tên file GDD là `v3_Expanded` nhưng bìa ghi Version 2.0. Nhận diện bằng tên file và ngày đọc, không tự khẳng định version chính thức.
3. Minh 16 tuổi, thời lượng một năm học, kết thúc 18 tuổi chưa khớp timeline.
4. VN nền có 3 endings, GDD có 6; các threshold GDD chồng lấn và chưa có precedence.
5. Global mastery 80/60 khác ngưỡng cục bộ: Budget unlock advanced ≥75; Career scene ≥80/≥65; Scam scene ≥90/75–89/<75. GDD section 21 cũng dùng Mastery +0…+4, chưa định nghĩa ánh xạ sang unit mastery 0–100.
6. Loan scene ghi mandatory comparison replay trong khi section 23 thiên về gate mềm. Cần xác định prerequisite và chính sách replay cụ thể khi xây game.
7. Thời lượng mini-game mở rộng dài hơn VN nền; planner 10–15 phút + narrative có thể vượt mục tiêu chương 10–20 phút.
8. Định hướng 2–4 units/chương khác bảng coverage 5–7 units ở một số chương. Phân biệt trọng tâm, giới thiệu và đánh giá thành thạo khi lên lesson plan.
9. Một số effects khác nhau giữa bảng chung, story beats ngắn và scene mở rộng; không cộng chồng các biến thể. Chương 5 có trừ WEALTH ở lựa chọn sản phẩm lẫn checkout, cần làm rõ để tránh tính hai lần một giao dịch.
10. Account Detective, payslip và Total Cost Calculator được nhắc nhưng không có spec độc lập đầy đủ trong thư viện 12 mini-game. Không tự coi đã có toàn bộ acceptance criteria.
11. Chưa chốt initial stats ngoài WEALTH=50 trong scene 1.1, quy đổi VND/điểm, reset GOAL, xử lý replay đối với điểm/flags, điều kiện trigger flags định lượng, RNG, schema đồng bộ và luật xếp ending. Cần thiết kế tiếp theo task, không suy diễn đã hoàn tất.

File này lưu bền trong workspace để đọc lại ở lần làm việc sau; không bảo đảm bộ nhớ tự động ở mọi cuộc trò chuyện hoặc workspace khác. Khi người dùng cập nhật, ghi rõ phần thay thế và giữ nguồn cũ để đối chiếu.
