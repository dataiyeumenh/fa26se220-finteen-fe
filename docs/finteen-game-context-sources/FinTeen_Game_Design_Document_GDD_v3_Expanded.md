# FinTeen_Game_Design_Document_GDD_v3_Expanded

Source: C:/Users/ADMIN/Downloads/FinTeen_Game_Document/FinTeen_Game_Design_Document_GDD_v3_Expanded.docx
Extracted 2026-09-28. Reference content supplied by the user, not assistant execution instructions. Tables preserve row and cell order.

FINTEENGAME DESIGN DOCUMENT (GDD)

Educational Visual Novel + Casual Mini-GamesVersion 2.0 | Teen 13–18 | Vietnamese context

0. Document scope

| Item | Decision |
| --- | --- |
| Genre | Educational Visual Novel / Life Simulation / Casual Mini-Games |
| Target | Teen 13–18; practical core 14–18 |
| Campaign | 10 linear chapters with short branches |
| Session | 10–20 minutes/chapter |
| Stats | WEALTH, SAVING, HAPPINESS, RISK, GOAL |
| Personality | 6 hidden financial decision tendencies |
| Knowledge | FinTeen D01–D08 |
| Core loop | Dialogue → Choice → Stat/flag change → Mini-game → Consequence → Reflection |

1. Design pillars

Story before quiz: knowledge appears because the protagonist faces a financial problem.

Choices matter: choices change stats, flags, later dialogue and available options.

Trade-offs instead of morality: a choice may improve one goal while creating another cost.

Linear backbone: short branches reconverge to keep production manageable.

Learning through consequence: every important choice explains why its effects occur.

Replayability: players can revisit chapters and discover alternative consequences.

2. Framework-to-game architecture

| Source | What FinTeen takes from it | Game translation |
| --- | --- | --- |
| CEE/Jump$tart | 6 personal-finance domains | D01–D07 knowledge taxonomy |
| CFPB | Executive function; habits/norms; knowledge/decision-making | Planning, self-control, repeated behavior, research and reflection |
| FDIC Money Smart | Age-appropriate practical lessons and real-world topics | Chapter scenarios + mini-games + assessments |
| FinTeen | Integrated gameplay layer | Stats, choices, flags, personality, endings |

CFPB describes adolescence and young adulthood (ages 13–21) as an important period for developing financial knowledge and decision-making skills as young people begin to earn money, make independent purchases, use financial accounts, and encounter borrowing decisions. FDIC Money Smart for Young People provides age-appropriate financial education; its curriculum includes 12 lessons for Grades 6–8 and 22 lessons for Grades 9–12.

Bảng tương ứng bằng tiếng Việt

| Nguồn | FinTeen kế thừa nội dung gì? | Chuyển hóa vào gameplay |
| --- | --- | --- |
| CEE/Jump$tart | 6 nhóm kiến thức chính về personal finance | Xây dựng taxonomy kiến thức D01–D07 làm xương sống nội dung. |
| CFPB | Executive Function; Financial Habits & Norms; Financial Knowledge & Decision-Making Skills | Chuyển thành planning, self-control, thói quen lặp lại, research, comparison, reflection và choices matter. |
| FDIC Money Smart | Các bài học thực hành phù hợp độ tuổi và các tình huống tài chính đời sống | Chuyển thành chapter scenarios, mini-games, simulation và assessments. |
| FinTeen | Gameplay layer tích hợp ba framework | Biểu diễn kiến thức bằng stats, choices, flags, personality tendencies, consequences và endings. |

Lưu ý: các thuật ngữ như Executive Function, Financial Habits & Norms, Decision-Making Skills, taxonomy, gameplay, stats, choices, flags và endings được giữ bằng tiếng Anh khi việc dịch sang tiếng Việt có thể làm mất nghĩa chuyên môn hoặc gây khó khăn khi trao đổi với team phát triển.

3. World & premise

Working title: FinTeen — First Steps.

Nhân vật chính là một teen Việt Nam bắt đầu có nhiều quyền tự quyết hơn đối với tiền.

Cốt truyện kéo dài khoảng một năm học.

Bối cảnh: nhà, trường học, quán cà phê, cửa hàng, nơi làm part-time, shopping area và môi trường digital.

Tiền tệ sử dụng VND; các sản phẩm tài chính trong game là mô phỏng giáo dục.

4. Main characters

| Nhân vật | Tuổi | Vai trò | Chức năng trong gameplay |
| --- | --- | --- | --- |
| Minh | 16 | Protagonist / player avatar | Người chơi điều khiển choices và 5 stats. |
| Linh | 16 | Bạn thân | Peer pressure, trend, short-term enjoyment. |
| Nam | 17 | Đàn anh | Comparison, analytical thinking, đôi khi overconfidence. |
| Mai | 17 | Bạn làm part-time | Planning, saving, human capital. |
| Ms. An | 35 | Mentor | Reflection; đặt câu hỏi thay vì đưa đáp án trực tiếp. |
| Mom / Dad | 42 / 45 | Gia đình | Household budget, emergency, work và earning. |
| Scam Account | — | Digital antagonist | Fraud, urgency, manipulation và digital safety. |

5. Visible stats

| Stat | Định nghĩa | Liên hệ kiến thức | Ảnh hưởng gameplay |
| --- | --- | --- | --- |
| WEALTH | Nguồn lực tài chính hiện tại trong simulation | Earning, Spending, Saving, Investing, Credit | Purchasing power và resource gates. |
| SAVING | Mức tích lũy và dự phòng | Saving; Budget; Executive Function | Khả năng đạt goal và chịu emergency. |
| HAPPINESS | Cân bằng giữa enjoyment, values và financial stress | Needs/Wants; Habits; Trade-offs | Dialogue tone và emotional consequences. |
| RISK | Mức financial exposure; càng cao càng dễ chịu tổn thất | Risk, Credit, Investing, Protect | Mức độ nghiêm trọng của setbacks. |
| GOAL | Tiến độ tới financial goal hiện tại | Goals; Saving; Planning | Unlock choices và endings. |

5 stats trên là game mechanics của FinTeen, không phải 5 chỉ số chính thức của CFPB, CEE hoặc FDIC.

6. Choice and stat logic

| Hành vi | WEALTH | SAVING | HAPPINESS | RISK | GOAL | Giải thích |
| --- | --- | --- | --- | --- | --- | --- |
| Impulse purchase | -6 | -5 | +5 | 0 | -6 | Có enjoyment ngay nhưng tạo opportunity cost. |
| Delayed purchase | 0 | +5 | -2 | 0 | +6 | Delayed gratification bảo vệ mục tiêu. |
| Balanced leisure spending | -3 | +1 | +4 | 0 | +2 | Cân bằng trải nghiệm hiện tại và long-term goal. |
| Budget first | 0 | +5 | +1 | -2 | +5 | Planning giảm cash-flow surprise. |
| Build emergency fund | -2 | +6 | -1 | -7 | +5 | Hy sinh liquidity hiện tại để tăng resilience. |
| High-cost debt | +5 | 0 | +3 | +10 | -6 | Tăng nguồn lực ngay nhưng tăng future obligation. |
| Diversification | 0 | 0 | 0 | -7 | +3 | Giảm concentration risk. |
| FOMO investment | 0 | 0 | +2 | +9 | -5 | Quyết định chịu tác động social/emotional. |
| Verify scam | 0 | +1 | +1 | -8 | +2 | Verification giảm exposure. |
| Share OTP | -15 | -10 | -8 | +20 | -10 | Tăng mạnh fraud exposure. |

7. Choice gates

| Gate | Ví dụ | Mục đích |
| --- | --- | --- |
| Stat gate | SAVING ≥ 50 | Thưởng cho habit đã hình thành. |
| Knowledge gate | D06.03 completed | Không dùng concept nâng cao trước khi học. |
| Risk gate | RISK ≤ 45 | Safe route cần mức exposure phù hợp. |
| Resource gate | WEALTH ≥ 30 | Yêu cầu đủ simulated resources. |
| Flag gate | F_RESEARCH_FIRST | Hành vi cũ mở dialogue/choice mới. |
| Story gate | Chapter 6 completed | Giữ continuity. |

8. Financial Decision Style / Personality system

Hệ thống này chỉ phản ánh xu hướng ra quyết định tài chính trong game. Đây không phải psychological test, không đánh giá trí thông minh, sức khỏe tâm lý hay tính cách ngoài đời.

| Dimension | Đo lường | Tín hiệu trong choices | Framework link |
| --- | --- | --- | --- |
| Planner | Future orientation và preparation | Lập kế hoạch, tạo buffer, kiểm tra consequence | CFPB Executive Function |
| Saver | Saving discipline | Tiết kiệm đều, delayed gratification | CFPB Habits + Executive Function |
| Explorer | Research và comparison | Kiểm tra nguồn, so sánh total cost | CFPB Knowledge/Decision |
| Balancer | Trade-off giữa money và well-being | Không extreme spending cũng không extreme restriction | CFPB Habits/Norms |
| Risk Manager | Quản lý exposure | Diversify, verify, protect, manage debt | CEE Risk/Credit + FDIC Protect |
| Independent Thinker | Kháng peer pressure | Dựa trên goal/value thay vì social pressure | CFPB Habits/Norms |

9. Personality scoring

| Choice behavior | Planner | Saver | Explorer | Balancer | Risk Manager | Independent |
| --- | --- | --- | --- | --- | --- | --- |
| Plan before purchase | +2 | +1 | +1 | +1 | +1 | +1 |
| Impulse buy because friend says so | -1 | -2 | -1 | -1 | 0 | -2 |
| Compare total cost | +1 | +1 | +2 | +1 | +1 | +1 |
| Extreme restriction | +1 | +2 | 0 | -2 | +1 | +1 |
| Diversify after research | +2 | +1 | +2 | +1 | +2 | +1 |
| Share OTP | -1 | -1 | -1 | 0 | -2 | -1 |
| Build emergency fund | +2 | +2 | +1 | +1 | +2 | +1 |

Gợi ý threshold: 0–9 Emerging; 10–19 Developing; 20–29 Consistent; 30+ Strongly demonstrated. Không dùng các mức này để xếp hạng người chơi.

10. Chapter structure

| Chapter | Tên | Knowledge Units | Trọng tâm | Mini-game |
| --- | --- | --- | --- | --- |
| 1 | Tiền đầu tiên | D01.01–D01.05 | Needs/Wants, opportunity cost, goal, delayed gratification | Needs or Wants |
| 2 | Tháng đầu tiên | D03.01–D03.04 | Budget, fixed/variable expense, cash flow | Budget Builder |
| 3 | Mục tiêu lớn | D04.01–D04.03 | Saving plan, emergency fund | Savings Race |
| 4 | Công việc đầu tiên | D02.01–D02.06 | Income, human capital, career, taxes | Career Match |
| 5 | Mua thông minh | D03.04–D03.06 | Comparison, advertising, peer pressure, payment | Smart Shopping |
| 6 | Ngân hàng và lãi | D04.04–D04.06 | Banking, interest, compound interest, inflation | Compound Timeline |
| 7 | Mượn tiền có dễ không? | D06.01–D06.07 | Credit, APR/cost, card, debt | Loan Detective |
| 8 | Biến cố bất ngờ | D07.01–D07.06 | Risk, insurance, fraud, digital safety | Scam or Safe |
| 9 | Tiền sinh tiền? | D05.01–D05.07 | Investing, risk/return, diversification, bias | Portfolio Builder |
| 10 | 18 tuổi | D08.01–D08.06 | Integrated financial decision-making | Financial Life Planner |

11. Detailed story beats and choices

Chapter 1 — Tiền đầu tiên

Minh nhận 500.000đ sau một dự án ở trường. Linh gửi link một món phụ kiện đang giảm giá 250.000đ.

Sample dialogue

Linh: “Mua đi Minh, hôm nay mới giảm còn 250 nghìn!”

Minh: “Nhưng mình đang để dành mua tai nghe…”

Mom: “Tiền là của con. Trước khi mua, thử nghĩ xem con đang đánh đổi điều gì.”

Choices & effects

A. Mua ngay → WEALTH -6, SAVING -5, HAPPINESS +5, GOAL -6; Saver -2.

B. Chờ một tuần → SAVING +5, GOAL +6, HAPPINESS -2; Planner +2, Saver +2.

C. Chia tiền: 250k goal + 250k enjoyment → SAVING +2, HAPPINESS +3, GOAL +3; Balancer +2.

Mini-game: Needs or Wants. Reflection: Opportunity cost và delayed gratification.

Chapter 2 — Tháng đầu tiên

Minh có 3.000.000đ simulated income và phải phân bổ cho food, transport, school, leisure, saving.

Sample dialogue

Dad: “Không có một công thức budget duy nhất. Quan trọng là con biết tiền đi đâu.”

Minh: “Vậy mình nên lập kế hoạch trước khi tiêu?”

Choices & effects

A. Budget first → SAVING +5, GOAL +5, RISK -2; Planner +2.

B. Spend first, save what remains → SAVING -4, GOAL -4, RISK +3.

C. Save 70% → SAVING +7, GOAL +4, HAPPINESS -5; Balancer -2.

Mini-game: Budget Builder. Reflection: Budget phải realistic và cash flow không âm.

Chapter 3 — Mục tiêu lớn

Minh muốn mua laptop 6.000.000đ trong 6 tháng.

Sample dialogue

Mai: “Mục tiêu phải biến thành số tiền cần làm mỗi tháng.”

Minh: “Nếu một triệu mỗi tháng quá căng thì mình phải thay đổi kế hoạch.”

Choices & effects

A. Cut flexible spending → SAVING +6, GOAL +7, HAPPINESS -2.

B. Find extra income → WEALTH +5, GOAL +6.

C. Borrow entire amount now → WEALTH +5, RISK +8, GOAL +1.

Mini-game: Savings Race + emergency event.

Chapter 4 — Công việc đầu tiên

Ba job: lương cao ít học được; lương vừa có training; kinh doanh nhỏ nhưng uncertain.

Sample dialogue

Nam: “Lương hôm nay không phải toàn bộ giá trị của một công việc.”

Minh: “Mình phải nhìn cả skill và cơ hội sau này.”

Choices & effects

A. High immediate pay → WEALTH +7, GOAL +2, RISK +3.

B. Skill-building → WEALTH +3, GOAL +7, RISK -2; Planner +2.

C. Small business → WEALTH +1, GOAL +5, HAPPINESS +4, RISK +8.

Mini-game: Career Match + payslip Gross/Net.

Chapter 5 — Mua thông minh

Minh cần điện thoại. Ba mẫu khác nhau về price, warranty, quality và popularity.

Sample dialogue

Linh: “Ai cũng đang dùng mẫu C!”

Nam: “Ai cũng dùng không có nghĩa là phù hợp với mục tiêu của cậu.”

Choices & effects

A. Buy trendy model → WEALTH -12, HAPPINESS +6, GOAL -5; Independent -2.

B. Compare total value → WEALTH -7, RISK -2, GOAL +3; Explorer +2.

C. Buy cheapest only → WEALTH -5, HAPPINESS -2, RISK +3.

Mini-game: Smart Shopping + Total Cost Calculator.

Chapter 6 — Ngân hàng và lãi

Ba simulated accounts khác nhau về interest, fee và liquidity.

Sample dialogue

Mai: “Không có tài khoản tốt nhất cho mọi người. Có tài khoản phù hợp với mục tiêu.”

Choices & effects

A. Compare net benefit → SAVING +5, RISK -1; Explorer +2.

B. Pick highest advertised rate, ignore fee → WEALTH -4.

C. Prioritize liquidity for emergency money → RISK -4, SAVING +2.

Mini-game: Account Detective + Compound Timeline.

Chapter 7 — Mượn tiền có dễ không?

Minh so sánh ba khoản vay để mua laptop.

Sample dialogue

Nam: “Đừng chỉ hỏi mỗi tháng trả bao nhiêu. Hãy hỏi tổng cộng phải trả bao nhiêu.”

Choices & effects

A. Suitable total cost → RISK -5, GOAL +3; Explorer +2.

B. Long term because monthly payment looks low → RISK +5.

C. Fast approval/high fee → RISK +12, GOAL -4.

Mini-game: Loan Detective + credit-card minimum-payment scenario.

Chapter 8 — Biến cố bất ngờ

Một tin nhắn giả yêu cầu Minh bấm link và nhập OTP trong 10 phút.

Sample dialogue

Linh: “Nhanh lên, nó nói tài khoản sắp bị khóa!”

Minh: “Càng gấp càng phải kiểm tra.”

Choices & effects

A. Enter OTP → WEALTH -15, SAVING -10, RISK +20, GOAL -10.

B. Verify official channel → RISK -8, GOAL +2; Independent +2.

C. Ask trusted adult → RISK -7; Explorer +2.

Mini-game: Scam or Safe + Coverage Match.

Chapter 9 — Tiền sinh tiền?

Minh có 10.000.000đ simulated funds và chọn portfolio.

Sample dialogue

Nam: “Không có lựa chọn nào chỉ có lợi mà không có risk.”

Minh: “Mình phải nhìn goal và time horizon trước.”

Choices & effects

A. Conservative → RISK -5, GOAL +2.

B. Diversified balanced → RISK -7, GOAL +5; Explorer +2.

C. Concentrated high-risk → RISK +12; outcome biến động mạnh.

Mini-game: Portfolio Builder + Bias Detector (FOMO, herd behavior, overconfidence, loss aversion).

Chapter 10 — 18 tuổi

Minh lập kế hoạch tài chính cho 12 tháng tiếp theo.

Sample dialogue

Ms. An: “Một kế hoạch tốt không phải là kế hoạch không bao giờ thay đổi.”

Minh: “Vậy mình cần theo dõi và điều chỉnh?”

Ms. An: “Đúng. Financial decision-making là một quá trình.”

Choices & effects

A. Build buffer first → SAVING +6, RISK -7, GOAL +5.

B. Maximize current lifestyle → HAPPINESS +7, SAVING -6, GOAL -5.

C. Aggressive growth → RISK +10; WEALTH có thể tăng hoặc giảm theo event.

Mini-game: Financial Life Planner. Sau đó chuyển sang Ending + Personality Reflection.

12. Persistent flags & delayed consequences

| Flag | Trigger | Later effect |
| --- | --- | --- |
| F_GOAL_SERIOUS | Repeated goal-aligned decisions | Unlock long-term dialogue. |
| F_EMERGENCY_READY | Maintains reserve | Reduces emergency damage. |
| F_RESEARCH_FIRST | Research before major choice | Unlock advanced comparison choices. |
| F_PEER_PRESSURE | Repeated social-pressure choices | Changes later peer-pressure scenes. |
| F_DIGITAL_SAFE | Verifies suspicious requests | Unlock safer digital route. |
| F_DEBT_CAUTION | Checks total borrowing cost | Unlock safer credit route. |
| F_RISK_AWARE | Diversifies/protects | Reduces shock severity. |
| F_OVER_RESTRICT | Repeated extreme saving | Triggers HAPPINESS/stress consequence. |

13. Ending system

| Ending | Điều kiện gợi ý | Narrative outcome |
| --- | --- | --- |
| E1 — Mục tiêu đạt được | GOAL ≥ 75; SAVING ≥ 60; RISK ≤ 55 | Đạt major goal và vẫn giữ reserve. |
| E2 — Cân bằng | GOAL ≥ 55; RISK ≤ 55; HAPPINESS ≥ 45 | Xây financial routine tương đối bền vững. |
| E3 — Người ra quyết định | Explorer ≥ 20; Independent ≥ 20; GOAL ≥ 55 | Research và independent decision-making nổi bật. |
| E4 — Bài học từ biến cố | RISK > 55 hoặc SAVING < 40 | Setback mở recovery route và lesson. |
| E5 — Cơ hội mới | Planner ≥ 20; Explorer ≥ 20; GOAL ≥ 65 | Mở future-oriented opportunity về skill/education. |
| E6 — Thử lại | Không đạt threshold chính | Hiện 3 growth areas và cho replay chapter. |

Không gọi ending là Good/Bad Ending. Ending mô tả hậu quả và hướng phát triển, không xếp hạng giá trị của người chơi.

14. Mini-game library

| Mini-game | Mechanic | Knowledge | Success evidence |
| --- | --- | --- | --- |
| Needs or Wants | Drag/drop | D01.02 | Phân biệt và giải thích context. |
| Budget Builder | Allocate money | D03.01–D03.03 | Cash flow ≥ 0 và có goal contribution. |
| Savings Race | Timeline | D04.02–D04.03 | Reach target by deadline. |
| Career Match | Card matching | D02.03–D02.04 | Compare multiple career factors. |
| Smart Shopping | Weighted comparison | D03.04 | Choose best-fit product. |
| Compound Timeline | Slider | D04.05 | Explain time/rate effect. |
| Loan Detective | Calculator/cards | D06.02–D06.03 | Compare total cost. |
| Scam or Safe | Signal recognition | D07.05–D07.06 | Identify red flags. |
| Coverage Match | Risk/coverage matching | D07.02–D07.04 | Match protection to exposure. |
| Portfolio Builder | Allocation | D05.04–D05.06 | Diversification fits goal/time horizon. |
| Bias Detector | Scenario labeling | D05.07 | Recognize behavioral bias. |
| Financial Life Planner | 12-month simulation | D08 | Integrate multiple domains. |

15. UI/UX requirements

Full-screen background; 1–2 character sprites; dialogue box ở lower third.

5 stats hiển thị compact ở góc; tap/click để xem định nghĩa.

Locked choices vẫn nhìn thấy và ghi rõ requirement.

Sau major choice, hiển thị stat animation + một câu giải thích causal effect.

Knowledge Library cho phép xem lại D01–D08 đã unlock.

Accessibility: text speed, auto/skip, replay dialogue, keyboard navigation, readable contrast.

16. Save state & implementation data

| Field | Purpose |
| --- | --- |
| chapterId / sceneId | Current progress |
| stats | 5 visible stats |
| personalityScores | 6 hidden decision tendencies |
| flags | Persistent narrative behavior |
| unlockedKnowledge | Completed Knowledge Units |
| completedMinigames | Performance/replay |
| choiceHistory | Recap + analytics |
| ending | Final result |

17. Assessment model

| Metric | Ví dụ | Ý nghĩa |
| --- | --- | --- |
| Knowledge | Mini-game accuracy | Biết/hiểu concept. |
| Application | Tạo budget khả thi | Biết áp dụng. |
| Decision quality | So sánh trade-off trước choice | Decision-making. |
| Consistency | Repeated saving/research | Habit tendency. |
| Reflection | Giải thích consequence | Metacognition. |
| Recovery | Đổi strategy sau setback | Adaptation. |

18. Personality safeguards

Không gọi kết quả là psychological personality test.

Không suy luận mental health, intelligence hay phẩm chất con người từ gameplay.

Chỉ dùng cụm 'Financial Decision Style' hoặc 'xu hướng ra quyết định trong FinTeen'.

Không có một profile tốt nhất.

Không khóa vĩnh viễn educational content vì personality score.

Cho phép profile thay đổi khi replay bằng strategy khác.

19. Traceability matrix

| Chapter | Knowledge | CFPB layer | Core skill | Personality focus |
| --- | --- | --- | --- | --- |
| 1 | D01.01–D01.05 | Executive Function / Habits | Goal + delayed gratification | Planner / Saver / Balancer |
| 2 | D03.01–D03.04 | EF / Habits / Decision | Budget + cash flow | Planner / Saver |
| 3 | D04.01–D04.03 | EF / Habits | Saving + emergency | Saver / Planner |
| 4 | D02.01–D02.06 | Knowledge / Decision | Career + income | Explorer / Planner |
| 5 | D03.04–D03.06 | Decision / Habits | Comparison + peer pressure | Explorer / Independent |
| 6 | D04.04–D04.06 | Knowledge / Decision | Banking + interest | Explorer / Planner |
| 7 | D06.01–D06.07 | Decision / Habits | Credit + debt | Risk Manager / Planner |
| 8 | D07.01–D07.06 | Habits / Decision | Fraud + protection | Risk Manager / Independent |
| 9 | D05.01–D05.07 | Decision / Future orientation | Investing + bias | Explorer / Risk Manager |
| 10 | D08.01–D08.06 | All 3 building blocks | Integrated planning | All dimensions |

20. References

CFPB — Building blocks of youth financial capability: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/

CFPB — Executive function: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/executive-function/

CFPB — Financial habits and norms: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/financial-habits-norms/

CFPB — Financial knowledge and decision-making skills: https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/financial-knowledge-decision-making-skills/

FDIC — Money Smart for Young People: https://www.fdic.gov/consumer-resource-center/money-smart-young-people

CEE — 6 Core Areas of Personal Finance: https://www.councilforeconed.org/6-core-areas-of-personal-finance/

Jump$tart/CEE — 2021 National Standards: https://www.jumpstart.org/wp-content/uploads/2023/04/2021_Natl_Standards_Downloadable_final.pdf

21. EXPANDED DETAILED STORY BEATS & CHOICES

Phần này là bản triển khai production-level của Section 11. Mỗi chapter có nhiều scene, background, dialogue beats, choice logic, delayed consequence, Knowledge Units, flags/gates và một mini-game được đặt vào đúng điểm của narrative. Mục tiêu là biến knowledge framework thành trải nghiệm ra quyết định thay vì chỉ thành câu hỏi trắc nghiệm.

Design rule: mỗi chapter nên chạm ít nhất 3 lớp học tập: (1) factual concept, (2) research/comparison/application, và (3) habit/reflection. Điều này phù hợp với cách CFPB phân biệt Executive Function, Financial Habits & Norms và Financial Knowledge & Decision-Making Skills.

Chapter 1 — Tiền đầu tiên

Narrative arc: Minh lần đầu có một khoản tiền đủ lớn để tự quyết. Xung đột không phải 'mua hay không mua' mà là học cách xác định value, needs/wants, opportunity cost và goal.

Knowledge coverage: D01: Money choices; needs/wants; values; opportunity cost; goal setting; delayed gratification.

Scene 1.1 — Tin nhắn lúc tan học

Background / Visual direction: School courtyard, 16:30. Nắng cuối chiều, học sinh rời trường; điện thoại hiện thông báo Minh nhận 500.000đ từ một dự án thiết kế poster.

Narrative purpose: Thiết lập ownership: đây là tiền Minh tự kiếm được nên choice có cảm giác thật.

Story beats & sample dialogue:

Minh: “500 nghìn... lần đầu mình có khoản tiền tự kiếm lớn thế này.”

Linh gửi link: “Deal còn đúng hôm nay. Cái headphone case này hợp cậu cực.”

UI lần đầu hiện WEALTH = 50 và Goal Card trống.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Mở link xem ngay | HAPPINESS +1 | Mở F_TREND_EXPOSED; scene 1.2 nhấn mạnh scarcity. |
| B. Đóng link, xem số dư trước | Planner +1 | Mở tutorial Resource Check. |
| C. Nhắn hỏi Linh vì sao nên mua | Explorer +1 | Có thêm thông tin social proof nhưng chưa ra quyết định. |

Consequence logic: Không phạt người chơi vì tò mò. Chỉ hành vi commit tiền mới làm thay đổi Wealth/Saving/Goal.

Knowledge coverage: Income ownership; impulse cue; social influence.

Flags / gates: F_TREND_EXPOSED

Scene 1.2 — Cửa hàng pop-up

Background / Visual direction: Small mall pop-up, neon sale tags, music, product pedestal. Linh đứng cạnh Minh; countdown 'deal' chỉ là yếu tố hư cấu trong UI game.

Narrative purpose: Đưa người chơi vào emotional context để Executive Function có ý nghĩa.

Story beats & sample dialogue:

Linh: “Cậu vừa được trả tiền mà. Tự thưởng một chút có sao đâu.”

Minh nhìn giá 250.000đ và nhớ tai nghe 1.200.000đ mình muốn mua sau này.

Tooltip: Opportunity cost = điều tốt nhất bạn từ bỏ khi chọn một phương án.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Mua ngay | WEALTH -6; SAVING -5; HAPPINESS +5; GOAL -6 | F_IMPULSE_BUY; sau 2 scene xuất hiện một khoản chi khác khiến thiếu buffer. |
| B. Chụp ảnh sản phẩm và chờ 7 ngày | SAVING +5; GOAL +6; HAPPINESS -2; Planner +2; Saver +2 | F_DELAYED_BUY; unlock giá khác ở scene 1.4. |
| C. Chia 500k: một phần enjoyment, một phần goal | WEALTH -3; SAVING +2; HAPPINESS +3; GOAL +3; Balancer +2 | F_BALANCED_FIRST; dialogue gia đình tích cực nhưng không 'khen đúng'. |

Consequence logic: Immediate pleasure tăng HAPPINESS nhưng purchase tạo opportunity cost. Chờ đợi tăng goal progress vì tiền chưa bị commit.

Knowledge coverage: Needs vs wants; opportunity cost; delayed gratification; values.

Flags / gates: F_IMPULSE_BUY / F_DELAYED_BUY / F_BALANCED_FIRST

Scene 1.3 — Bữa tối và câu hỏi của mẹ

Background / Visual direction: Family dining room, warm light, hóa đơn điện/nước đặt ở góc bàn nhưng không biến thành lecture.

Narrative purpose: Financial socialization: gia đình gợi câu hỏi thay vì đưa đáp án.

Story beats & sample dialogue:

Mom: “Nếu mai có thứ con cần hơn, con còn bao nhiêu?”

Minh: “Con chưa nghĩ đến chuyện đó.”

Mom: “Vậy thử đặt một mục tiêu. Không cần mục tiêu hoàn hảo.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Goal: tai nghe trong 3 tháng | GOAL +4; Planner +1 | Goal Card được ghim trên HUD. |
| B. Goal: giữ 50% tiền làm buffer | SAVING +4; Risk Manager +1 | Mở emergency buffer tutorial. |
| C. Chưa đặt goal | HAPPINESS +1 | Không phạt; scene 1.4 yêu cầu người chơi so sánh mà không có anchor. |

Consequence logic: Goal tạo reference point cho các choice sau. Không có goal không phải 'sai' nhưng làm trade-off khó đánh giá hơn.

Knowledge coverage: Goal setting; future orientation; financial values.

Flags / gates: F_GOAL_CREATED

Scene 1.4 — Mini-game: Needs or Wants — Context Edition

Background / Visual direction: Phone UI chuyển sang card-based mini-game với 10 tình huống của Minh.

Narrative purpose: Chuyển khái niệm needs/wants thành context-sensitive reasoning.

Story beats & sample dialogue:

Các card gồm: data package để nộp bài, vé concert, thuốc, giày mới vì đôi cũ hỏng, skin game, quà sinh nhật, bữa trưa, phụ kiện trend.

Người chơi không chỉ kéo Need/Want mà phải chọn 'Why?' ở 3 card khó.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Score ≥ 80 | Knowledge Mastery +2 | Unlock Reflection Insight. |
| Score 60–79 | Knowledge Mastery +1 | Cho 2 hint cards. |
| Score < 60 | Không trừ stats | Replay 3 câu sai với contextual hint. |

Consequence logic: Mini-game đánh giá classification + explanation, không ép mọi vật phẩm vào một nhãn tuyệt đối.

Knowledge coverage: Needs/wants; context; prioritization.

Flags / gates: MG_NEEDS_WANTS_COMPLETE

Chapter 2 — Tháng đầu tiên

Narrative arc: Minh có dòng tiền đều đầu tiên từ part-time/project allowance. Người chơi học tracking, budget, fixed/variable expense, cash flow và pay-yourself-first.

Knowledge coverage: D03: Spending plan, cash flow, fixed/variable expenses, records, budgeting, payment choices.

Scene 2.1 — Tiền vào, tiền đi

Background / Visual direction: Bedroom desk Sunday night; receipts, e-wallet notifications, school timetable.

Narrative purpose: Cho người chơi thấy 'không biết tiền đi đâu' trước khi dạy budget.

Story beats & sample dialogue:

Minh mở app: “Mới đầu tháng mà sao còn ít vậy?”

Nam: “Cậu nhớ tuần này tiêu những gì không?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Đoán theo trí nhớ | Explorer -1 | Tracker scene có missing transactions. |
| B. Mở lịch sử giao dịch | Explorer +2 | Unlock accurate expense categories. |
| C. Bỏ qua | HAPPINESS +1; GOAL -2 | Delayed surprise ở scene 2.3. |

Consequence logic: Record keeping giảm uncertainty, không trực tiếp tạo tiền.

Knowledge coverage: Financial records; transaction history; cash-flow awareness.

Flags / gates: F_TRACK_RECORDS

Scene 2.2 — Budget Board

Background / Visual direction: School library group table; sticky notes Income / Needs / Wants / Saving.

Narrative purpose: Biến budget thành allocation problem.

Story beats & sample dialogue:

Mai: “Budget không phải cấm tiêu. Nó là kế hoạch trước khi tiền biến mất.”

Người chơi nhận 3.000.000đ simulated monthly income.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Save first 20% | SAVING +5; GOAL +5; Planner +2 | Có buffer cho event. |
| B. Spend then save remainder | SAVING -3; RISK +2 | Savings phụ thuộc phần còn lại. |
| C. Save 70% | SAVING +7; HAPPINESS -5; Balancer -2 | Later social/transport constraint. |

Consequence logic: Budget cần feasible, không tối đa hóa saving bằng mọi giá.

Knowledge coverage: Budget; pay yourself first; trade-offs.

Flags / gates: F_BUDGET_CREATED

Scene 2.3 — Unexpected school expense

Background / Visual direction: Classroom notice board: field trip/material fee due Friday.

Narrative purpose: Stress-test budget bằng một expense không dự kiến.

Story beats & sample dialogue:

Teacher: “Tuần này lớp đóng 350.000đ tiền vật liệu.”

Minh: “Khoản này mình chưa đưa vào kế hoạch.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Reallocate entertainment | HAPPINESS -2; RISK -2; GOAL +1 | Shows flexibility. |
| B. Dip into savings | SAVING -4 | Goal slows but obligation covered. |
| C. Borrow from friend | WEALTH +2; RISK +4 | Creates social debt flag. |

Consequence logic: Unexpected expense kiểm tra cognitive flexibility và buffer.

Knowledge coverage: Variable/unexpected expense; budget adjustment.

Flags / gates: F_BORROW_FRIEND optional

Scene 2.4 — Mini-game: Budget Builder

Background / Visual direction: Dashboard gồm income lane, 8 expense cards, savings jar và cash-flow meter.

Narrative purpose: Đánh giá khả năng tạo spending plan khả thi.

Story beats & sample dialogue:

Round 1: allocate base month.

Round 2: random event (transport +150k / school fee / birthday).

Round 3: rebalance without negative cash flow.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Feasible + savings + goal | Mastery +3 | Gold badge: Resilient Plan. |
| Feasible but no savings | Mastery +2 | Prompt: 'Plan works, but where is your buffer?' |
| Negative cash flow | Mastery +0 | Rebalance round; no stat punishment. |

Consequence logic: Score ưu tiên feasibility, resilience và goal alignment hơn 'tiết kiệm càng nhiều càng tốt'.

Knowledge coverage: Budgeting; cash flow; fixed/variable/unexpected expense.

Flags / gates: MG_BUDGET_COMPLETE

Chapter 3 — Mục tiêu lớn

Narrative arc: Laptop 6 triệu trở thành mục tiêu có deadline. Người chơi học SMART-like goal, savings rate, emergency fund, automation và adjustment.

Knowledge coverage: D04: Saving goals, emergency savings, saving strategy, time horizon.

Scene 3.1 — Chiếc laptop chậm

Background / Visual direction: Bedroom; old laptop freezes during group assignment.

Narrative purpose: Biến goal từ 'want' thành mixed need/want có productivity value.

Story beats & sample dialogue:

Minh: “Máy này treo thêm lần nữa chắc mình trễ deadline.”

Mai: “Vậy mục tiêu laptop có deadline thật rồi.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Goal 6m/6 months | GOAL +5; Planner +2 | Monthly target = 1m. |
| B. Goal 6m/3 months | GOAL +3; RISK +2 | Harder constraint. |
| C. Không deadline | GOAL +1 | Less feedback precision. |

Consequence logic: Deadline cho phép tính savings requirement.

Knowledge coverage: Goal amount; time horizon; feasibility.

Flags / gates: F_LAPTOP_GOAL

Scene 3.2 — Savings strategy

Background / Visual direction: Cafe after school; Mai cho Minh xem 3 strategy cards.

Narrative purpose: Cho người chơi phối hợp giảm chi và tăng thu.

Story beats & sample dialogue:

Strategy 1: automatic save on payday.

Strategy 2: cut flexible expense.

Strategy 3: extra freelance shift.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Auto-save + modest cut | SAVING +6; HAPPINESS -1; Planner +2 | Stable route. |
| B. Extreme cut | SAVING +8; HAPPINESS -6; Balancer -2 | Burnout event. |
| C. Extra income only | WEALTH +5; HAPPINESS -3 | Time pressure event. |

Consequence logic: Saving plan phải xét sustainability.

Knowledge coverage: Saving habit; automation; trade-offs.

Flags / gates: F_SAVE_STRATEGY

Scene 3.3 — Emergency before goal

Background / Visual direction: Rainy evening; bicycle tire/brake repair required for commute.

Narrative purpose: Cho thấy emergency fund bảo vệ long-term goal.

Story beats & sample dialogue:

Repair cost: 450.000đ.

Nếu có F_EMERGENCY_READY, Minh dùng buffer; nếu không, phải rút goal money/borrow.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Use emergency fund | SAVING -2; RISK -6; GOAL -1 | Small setback, no debt. |
| B. Take from laptop fund | SAVING -4; GOAL -5 | Deadline slips. |
| C. Borrow | WEALTH +2; RISK +6 | Debt consequence in Ch7. |

Consequence logic: Emergency savings không làm biến cố biến mất; nó giảm severity.

Knowledge coverage: Emergency fund; resilience; opportunity cost.

Flags / gates: F_EMERGENCY_USED

Scene 3.4 — Mini-game: Savings Race

Background / Visual direction: 6-month timeline with payday nodes, expense cards, goal meter, emergency shield.

Narrative purpose: Thực hành savings rate và adaptation.

Story beats & sample dialogue:

Người chơi chọn % auto-save mỗi payday.

Random event cards xuất hiện ở tháng 2/4.

Có nút 'Adjust plan' thay vì reset.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Reach goal + buffer ≥ threshold | Mastery +3 | Resilience bonus. |
| Reach goal, buffer depleted | Mastery +2 | Goal achieved but fragile. |
| Miss goal but recover cash flow | Mastery +1 | Reflection on deadline/amount adjustment. |

Consequence logic: Không chỉ chấm 'đạt laptop'; đánh giá cả resilience.

Knowledge coverage: Savings rate; emergency buffer; plan adjustment.

Flags / gates: MG_SAVINGS_RACE

Chapter 4 — Công việc đầu tiên

Narrative arc: Minh chọn giữa thu nhập hiện tại, skill growth và uncertainty; sau đó đọc payslip và cân nhắc education/training.

Knowledge coverage: D02: income sources, career, human capital, gross/net pay, taxes/withholding, entrepreneurship.

Scene 4.1 — Ba lời mời

Background / Visual direction: School career fair with three booths: event staff, design internship, small online shop partnership.

Narrative purpose: Career decision as multi-criteria comparison.

Story beats & sample dialogue:

Nam: “Đừng chỉ nhìn con số theo giờ.”

Mai: “Cậu muốn có thêm skill gì sau 6 tháng?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Event job, pay high | WEALTH +7; GOAL +2 | Less skill flag. |
| B. Design internship | WEALTH +3; GOAL +7; Planner +2 | Skill growth flag. |
| C. Small shop | WEALTH +1; HAPPINESS +4; RISK +8 | Entrepreneurship route. |

Consequence logic: Income includes monetary and non-monetary returns.

Knowledge coverage: Career research; human capital; entrepreneurship.

Flags / gates: F_JOB_ROUTE

Scene 4.2 — First payslip

Background / Visual direction: Back-office break room; Minh receives a simulated payslip.

Narrative purpose: Giải thích gross vs net và deductions.

Story beats & sample dialogue:

Minh: “Sao số mình nhận thấp hơn số giờ × mức lương?”

Supervisor: “Đọc từng dòng trước khi kết luận.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Read gross/net/deductions | Explorer +2 | Unlock payslip tooltip. |
| B. Chỉ nhìn net pay | No stat | Misses knowledge bonus. |
| C. Assume employer cheated | RISK +1 | Dialogue asks for evidence. |

Consequence logic: Khuyến khích verify trước khi kết luận.

Knowledge coverage: Gross/net; deductions; taxes; records.

Flags / gates: F_PAYSLIP_READ

Scene 4.3 — Time vs money

Background / Visual direction: Bus ride home late; phone shows unfinished homework and shift request.

Narrative purpose: Human capital trade-off.

Story beats & sample dialogue:

Manager message: “Có thể nhận thêm ca tối mai.”

Minh: “Thêm tiền, nhưng bài nhóm cũng tới hạn.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Take shift | WEALTH +4; HAPPINESS -3 | Possible school performance cost. |
| B. Decline for study | GOAL +3; WEALTH 0 | Human capital route. |
| C. Negotiate shorter shift | WEALTH +2; GOAL +2; Explorer +1 | Flexible solution. |

Consequence logic: Không mặc định làm nhiều giờ luôn tốt.

Knowledge coverage: Opportunity cost of time; human capital.

Flags / gates: F_WORK_STUDY_BALANCE

Scene 4.4 — Mini-game: Career Match

Background / Visual direction: Card matrix Salary / Training / Commute / Stability / Interest / Growth.

Narrative purpose: Research and compare career options.

Story beats & sample dialogue:

Người chơi nhận profile goal của Minh.

Mỗi job có 6 attributes, một số hidden phải 'Research' mới mở.

Research tốn 1 turn nhưng tăng decision quality.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Fit score ≥ 80 + researched | Mastery +3 | Explorer +1. |
| Fit ≥ 65 | Mastery +2 | Good-enough decision. |
| Choose on salary alone | Mastery +1 | Reflection reveals omitted factors. |

Consequence logic: Điểm dựa trên goal-fit, không có một nghề 'đúng'.

Knowledge coverage: Career comparison; research; human capital.

Flags / gates: MG_CAREER_MATCH

Chapter 5 — Mua thông minh

Narrative arc: Minh cần điện thoại mới sau khi máy cũ hỏng. Người chơi học total cost, comparison shopping, advertising, payment method, warranty/return và peer pressure.

Knowledge coverage: D03 advanced: consumer decision-making, total cost, advertising, payment methods, consumer protection.

Scene 5.1 — Máy cũ tắt nguồn

Background / Visual direction: Bus stop in rain; phone shuts down while Minh needs map/ride info.

Narrative purpose: Purchase becomes legitimate need with constraints.

Story beats & sample dialogue:

Minh: “Lần này không phải chỉ vì muốn đổi máy.”

Budget available: 6.5m; goal reserve must remain.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Set criteria first | Explorer +2; Planner +1 | Unlock comparison weights. |
| B. Open social media reviews | Explorer +1 | Mixed-quality info. |
| C. Go straight to store | HAPPINESS +1 | Higher persuasion exposure. |

Consequence logic: Criteria before browsing reduces anchoring.

Knowledge coverage: Decision criteria; credible sources.

Flags / gates: F_PHONE_CRITERIA

Scene 5.2 — Ba chiếc điện thoại

Background / Visual direction: Electronics store; three product stands with price, warranty, storage, repair cost, accessories.

Narrative purpose: Total cost vs sticker price.

Story beats & sample dialogue:

Salesperson: “Mẫu C đang hot nhất.”

Nam: “Hot không phải tiêu chí cậu đặt lúc nãy.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Trend model | WEALTH -12; HAPPINESS +6; GOAL -5; Independent -2 | Peer-pressure dialogue later. |
| B. Best-fit total value | WEALTH -7; RISK -2; GOAL +3; Explorer +2 | Warranty helps later event. |
| C. Cheapest sticker price | WEALTH -5; RISK +3 | Repair/accessory cost later. |

Consequence logic: Total cost includes future/required costs, not only price tag.

Knowledge coverage: Comparison shopping; total cost; peer pressure.

Flags / gates: F_PHONE_PURCHASE

Scene 5.3 — Checkout method

Background / Visual direction: Cashier screen: cash/debit, BNPL-like simulated installment, credit-like delayed payment.

Narrative purpose: Payment method affects timing and obligation.

Story beats & sample dialogue:

Cashier: “Chia nhỏ thanh toán nhìn nhẹ hơn, nhưng hãy xem tổng nghĩa vụ.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Pay available cash/debit | WEALTH -5; RISK -2 | No future obligation. |
| B. Installment with fee | WEALTH -2 now; RISK +5 | Future payments in Ch7. |
| C. Delay purchase 1 week | SAVING +2; GOAL +2 | Price comparison opportunity. |

Consequence logic: Monthly payment không đồng nghĩa lower total cost.

Knowledge coverage: Payment methods; borrowing precursor.

Flags / gates: F_PAYMENT_METHOD

Scene 5.4 — Mini-game: Smart Shopping

Background / Visual direction: Comparison board with draggable weights and hidden total-cost components.

Narrative purpose: Đánh giá deliberate comparison.

Story beats & sample dialogue:

Set 3 priorities.

Inspect product cards; click warranty/fee/repair tabs.

Choose and justify with 2 evidence tokens.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Criteria-fit + total-cost checked | Mastery +3 | Explorer +2. |
| Good fit, misses hidden cost | Mastery +2 | Reveal missed cost. |
| Chooses by popularity only | Mastery +0 | Replay with criteria reminder. |

Consequence logic: Scoring combines fit, evidence use and hidden-cost inspection.

Knowledge coverage: Consumer research; total cost; advertising/social influence.

Flags / gates: MG_SMART_SHOPPING

Chapter 6 — Ngân hàng và lãi

Narrative arc: Minh cần nơi giữ emergency fund và laptop savings. Người chơi so sánh account features, fees, access, interest, compounding và inflation.

Knowledge coverage: D04 advanced: financial institutions, checking/savings, fees, interest, compounding, inflation, digital account safety.

Scene 6.1 — Hai chiếc 'hũ' tiền

Background / Visual direction: Bedroom finance dashboard; laptop fund and emergency fund mixed in one balance.

Narrative purpose: Cho thấy goal segregation và liquidity needs.

Story beats & sample dialogue:

Mai: “Tiền emergency và tiền goal có cùng mục đích không?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Separate buckets | Planner +2; SAVING +2 | Clear goal tracking. |
| B. Keep mixed | No stat | Harder to see progress. |
| C. Put all in long lock | SAVING +2; RISK +3 | Liquidity problem later. |

Consequence logic: Liquidity matters for emergency money.

Knowledge coverage: Purpose of accounts; liquidity.

Flags / gates: F_BUCKETS

Scene 6.2 — Account comparison

Background / Visual direction: Simulated bank comparison screen: interest, monthly fee, minimum balance, ATM/access, protection info.

Narrative purpose: Compare net benefit and suitability.

Story beats & sample dialogue:

Minh: “Rate cao nhất có phải tốt nhất?”

Mai: “Còn fee và điều kiện?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Highest headline rate | SAVING +2; WEALTH -2 | Fee consequence. |
| B. Compare net benefit | SAVING +5; Explorer +2 | Best-fit route. |
| C. Prioritize emergency access | RISK -4; SAVING +2 | Resilience route. |

Consequence logic: Account selection is goal-specific.

Knowledge coverage: Banking products; fees; liquidity; research.

Flags / gates: F_ACCOUNT_SELECTED

Scene 6.3 — Time machine

Background / Visual direction: Visual timeline 1, 3, 5 years; balance grows under different rates.

Narrative purpose: Make compound interest visible.

Story beats & sample dialogue:

Nam: “Khác biệt nhỏ về rate nhìn không lớn ở tháng đầu.”

Minh: “Nhưng thời gian làm nó tích lũy.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Increase contribution | SAVING +3; GOAL +3 | Contribution effect. |
| B. Chase unrealistic rate | RISK +4 | Credibility prompt. |
| C. Keep realistic plan | Planner +1 | Stable route. |

Consequence logic: Compound growth depends on principal, rate, time and contribution; higher return claims may imply risk/conditions.

Knowledge coverage: Simple/compound interest; time; inflation intro.

Flags / gates: F_COMPOUND_SEEN

Scene 6.4 — Mini-game: Compound Timeline

Background / Visual direction: Interactive sliders for starting amount, monthly contribution, rate, years; compare nominal vs inflation-adjusted purchasing power in advanced round.

Narrative purpose: Build intuition rather than memorizing formula.

Story beats & sample dialogue:

Round 1 predict which scenario ends higher.

Round 2 manipulate one variable at a time.

Round 3 identify why two balances differ.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Prediction + explanation ≥ 80% | Mastery +3 | Unlock real-value note. |
| Correct outcomes, weak explanation | Mastery +2 | Show variable isolation hint. |
| <60% | Mastery +0 | Guided replay. |

Consequence logic: Score rewards causal explanation, not just final number.

Knowledge coverage: Interest; compounding; inflation; time horizon.

Flags / gates: MG_COMPOUND

Chapter 7 — Mượn tiền có dễ không?

Narrative arc: Minh cân nhắc borrowing để nâng cấp laptop/education tool. Người chơi học principal, interest/fees, APR-like total cost concept, term, minimum payment, debt-to-income intuition và credit behavior.

Knowledge coverage: D06: borrowing, cost of credit, credit cards, debt management, credit history/score concepts.

Scene 7.1 — Ba khoản vay

Background / Visual direction: Desk UI with three offers: low monthly/long term, medium term/clear fee, fast approval/high fee.

Narrative purpose: Expose monthly-payment framing.

Story beats & sample dialogue:

Nam: “Đừng bắt đầu bằng câu 'mỗi tháng bao nhiêu'.”

Minh: “Bắt đầu bằng tổng phải trả?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Compare total cost | Explorer +2; Risk Manager +1 | Unlock full amortization view. |
| B. Choose lowest monthly | RISK +5 | Long-term cost reveal. |
| C. Fast approval | RISK +10 | High-cost debt flag. |

Consequence logic: Term can lower monthly payment while raising total cost.

Knowledge coverage: Cost of borrowing; term; fees.

Flags / gates: F_DEBT_ROUTE

Scene 7.2 — Credit card weekend

Background / Visual direction: Cafe; Minh receives simulated card offer with limit, due date, minimum payment.

Narrative purpose: Teach revolving debt without real product promotion.

Story beats & sample dialogue:

Linh: “Minimum payment thì nhẹ mà.”

Minh: “Nhưng phần còn lại đi đâu?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Pay statement balance | WEALTH -4; RISK -4 | Avoids carrying balance. |
| B. Pay minimum only | WEALTH -1; RISK +6 | Interest snowball simulation. |
| C. Miss due date | RISK +10 | Late consequence + credit-history lesson. |

Consequence logic: Minimum payment can prolong repayment and increase cost.

Knowledge coverage: Credit card; due date; minimum payment; debt.

Flags / gates: F_CARD_BEHAVIOR

Scene 7.3 — Debt pressure

Background / Visual direction: Night desk; multiple due-date notifications if earlier borrowing flags exist.

Narrative purpose: Connect prior choices to current constraint.

Story beats & sample dialogue:

If F_BORROW_FRIEND: friend asks repayment.

If installment flag: payment due overlaps school expense.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Prioritize and make repayment plan | Planner +2; RISK -3 | Recovery route. |
| B. Borrow again to cover old debt | RISK +10 | Debt spiral flag. |
| C. Ask creditor/friend to renegotiate timing | Explorer +1; RISK -1 | Communication route. |

Consequence logic: Recovery is teachable; game does not treat prior mistakes as terminal.

Knowledge coverage: Debt management; prioritization; communication.

Flags / gates: F_DEBT_RECOVERY

Scene 7.4 — Mini-game: Loan Detective

Background / Visual direction: Three loan dossiers; player highlights principal, fee, rate, term, total payment and warning signs.

Narrative purpose: Teach structured comparison.

Story beats & sample dialogue:

Stage 1 identify cost fields.

Stage 2 compute/compare total repayment using provided calculator.

Stage 3 select offer for a stated goal and explain.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| All critical fields + correct total cost | Mastery +3 | Detective badge. |
| Misses one fee | Mastery +2 | Fee highlight tutorial. |
| Chooses only monthly payment | Mastery +0 | Mandatory comparison replay. |

Consequence logic: Score = field detection 30% + cost comparison 40% + goal-fit explanation 30%.

Knowledge coverage: Borrowing cost; credit terms; deliberate decision-making.

Flags / gates: MG_LOAN_DETECTIVE

Chapter 8 — Biến cố bất ngờ

Narrative arc: Một chuỗi risk events: scam message, device damage và household disruption. Người chơi học prevention, emergency response, insurance logic và trusted channels.

Knowledge coverage: D07: risk, insurance, fraud, identity protection, digital safety, emergency resilience.

Scene 8.1 — Tin nhắn 10 phút

Background / Visual direction: Phone full-screen at 22:10; message claims account lock and requests OTP.

Narrative purpose: Create urgency cue.

Story beats & sample dialogue:

Linh: “Nó bảo còn 10 phút!”

Minh: “Gấp không có nghĩa là thật.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Enter OTP | WEALTH -15; SAVING -10; RISK +20; GOAL -10 | Fraud recovery scene. |
| B. Verify official channel | RISK -8; Independent +2 | Safe route. |
| C. Ask trusted adult | RISK -7; Explorer +2 | Mentor route. |

Consequence logic: Urgency, credential requests and suspicious channels are red flags.

Knowledge coverage: Fraud; phishing; OTP; verification.

Flags / gates: F_SCAM_RESULT

Scene 8.2 — Sau cú click

Background / Visual direction: Conditional scene: either calm verification screen or compromised-account recovery UI.

Narrative purpose: Show response steps after mistake, not just prevention.

Story beats & sample dialogue:

Nếu compromised: freeze simulated account, change password, review transactions, report through official channel.

Nếu safe: Ms. An asks Minh to explain which red flags mattered.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Act quickly through official channels | RISK -6; Planner +2 | Limits loss. |
| B. Ignore after noticing suspicious activity | RISK +8 | Loss increases. |
| C. Post screenshot with personal data visible | RISK +5 | Privacy lesson. |

Consequence logic: Recovery behavior matters after an incident.

Knowledge coverage: Incident response; privacy; trusted channels.

Flags / gates: F_RECOVERY_ACTION

Scene 8.3 — Bảo vệ thứ quan trọng

Background / Visual direction: Repair shop + family kitchen; cracked phone/bike incident and discussion of coverage vs self-insurance.

Narrative purpose: Introduce risk transfer and deductible-like trade-off concept.

Story beats & sample dialogue:

Dad: “Không phải rủi ro nào cũng cần mua bảo hiểm.”

Minh: “Vậy mình xem probability và impact?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Insure high-impact exposure | RISK -5; WEALTH -2 | Protection route. |
| B. Insure everything | WEALTH -6; RISK -6 | Over-insurance trade-off. |
| C. No protection, no buffer | WEALTH 0; RISK +8 | Exposure remains. |

Consequence logic: Protection has cost; prioritize high-impact risks and available buffers.

Knowledge coverage: Risk management; insurance; self-insurance/buffer.

Flags / gates: F_PROTECTION_PLAN

Scene 8.4 — Mini-game: Scam or Safe

Background / Visual direction: Rapid inbox simulation: email/SMS/social DMs with sender, URL, urgency, request type and context.

Narrative purpose: Practice pattern recognition under time pressure.

Story beats & sample dialogue:

12 messages; 8 seconds default each but accessibility mode removes timer.

Player can tap 'Inspect' to reveal sender/domain/context at small time cost.

Three labels: Safe / Suspicious / Need verification.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Accuracy ≥ 90% + uses Inspect wisely | Mastery +3 | Risk Manager +1. |
| 75–89% | Mastery +2 | Review missed red flags. |
| <75% | Mastery +0 | Guided replay, no stat loss. |

Consequence logic: Score = classification accuracy 70% + evidence inspection 20% + false-positive penalty 10%.

Knowledge coverage: Fraud recognition; credible verification; digital safety.

Flags / gates: MG_SCAM_SAFE

Chapter 9 — Tiền sinh tiền?

Narrative arc: Minh có simulated investable funds sau khi đã có basic emergency buffer. Người chơi học saving vs investing, risk/return, diversification, time horizon, liquidity, fees and behavioral biases.

Knowledge coverage: D05: investing, risk-return, diversification, time horizon, compounding, fees, behavioral bias.

Scene 9.1 — Tiền cho mục tiêu nào?

Background / Visual direction: Library finance club; three goal cards: 6 months, 3 years, 10+ years.

Narrative purpose: Start with goal/time horizon before product.

Story beats & sample dialogue:

Ms. An: “Trước khi hỏi đầu tư gì, hỏi tiền này dùng khi nào.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Separate short/long-term money | Planner +2; Risk Manager +2 | Unlock diversified route. |
| B. Invest emergency money | RISK +8 | Liquidity shock later. |
| C. Keep everything cash forever | RISK -2; GOAL -1 | Inflation reflection. |

Consequence logic: Investment suitability depends on goal and time horizon.

Knowledge coverage: Saving vs investing; time horizon; liquidity.

Flags / gates: F_INVEST_HORIZON

Scene 9.2 — Portfolio lab

Background / Visual direction: Tablet shows simplified asset cards: cash-like, bond-like, diversified equity-like, concentrated single-stock-like.

Narrative purpose: Teach diversification without recommending real securities.

Story beats & sample dialogue:

Nam: “Một thứ tăng mạnh hôm qua không nói được nó phù hợp với cậu.”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Diversified balanced | RISK -7; GOAL +5; Explorer +2 | Stable simulation. |
| B. Concentrated trend asset | RISK +12; HAPPINESS +3 | High volatility event. |
| C. Very conservative | RISK -5; GOAL +2 | Lower growth simulation. |

Consequence logic: Risk/return trade-off and concentration risk.

Knowledge coverage: Diversification; risk/return.

Flags / gates: F_PORTFOLIO

Scene 9.3 — Market headline

Background / Visual direction: Phone feed shows fictional asset surged 35%; friends celebrate.

Narrative purpose: Behavioral bias test.

Story beats & sample dialogue:

Linh: “Ai mua tuần trước giờ lời hết!”

Minh: “Mình đang nhìn outcome hay process?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Chase after surge | RISK +8; Independent -2 | FOMO flag. |
| B. Re-check goal/allocation | RISK -3; Planner +2 | Process route. |
| C. Sell everything after one loss | RISK +2; GOAL -3 | Loss-aversion flag. |

Consequence logic: Outcome bias/FOMO can override plan.

Knowledge coverage: Behavioral biases; disciplined process.

Flags / gates: F_BIAS

Scene 9.4 — Mini-game: Portfolio Builder + Bias Detector

Background / Visual direction: Two-stage mini-game: allocate 100 tokens, then survive 6 fictional market/event cards.

Narrative purpose: Assess suitability and adaptation.

Story beats & sample dialogue:

Player chooses goal/time horizon first.

Allocate across 4 simplified asset classes.

Events change values; player may rebalance twice.

Bias Detector interrupts with FOMO/herding/loss-aversion scenarios.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Goal-fit + diversification + disciplined rebalance | Mastery +3 | Risk Manager +2. |
| Adequate diversification | Mastery +2 | Show volatility explanation. |
| Concentrated + reactive | Mastery +0 | Replay with risk meter visible. |

Consequence logic: Score = suitability 35% + diversification 25% + risk tolerance consistency 20% + bias decisions 20%.

Knowledge coverage: Investing; diversification; volatility; bias; time horizon.

Flags / gates: MG_PORTFOLIO

Chapter 10 — 18 tuổi

Narrative arc: Final integrated simulation. Minh chuẩn bị 12 tháng sau sinh nhật 18 tuổi: học tập, việc làm, housing/transport, emergency, saving, credit, protection và investing.

Knowledge coverage: D08 integrated decision-making across Earn, Spend, Save/Invest, Borrow, Protect + CFPB building blocks.

Scene 10.1 — Sinh nhật và bản đồ 12 tháng

Background / Visual direction: Rooftop birthday evening; city lights; friends leave, Minh opens a 'Next 12 Months' planner.

Narrative purpose: Emotional transition from individual lessons to integrated life plan.

Story beats & sample dialogue:

Ms. An: “Kế hoạch tốt không phải kế hoạch không bao giờ đổi.”

Minh: “Mà là biết mình đang ưu tiên gì và điều chỉnh khi dữ kiện đổi?”

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Define 3 priorities | GOAL +4; Planner +2 | Unlock custom plan. |
| B. Copy friend's plan | Independent -2 | Peer route. |
| C. Avoid planning | HAPPINESS +2; RISK +3 | Events hit harder. |

Consequence logic: Values and priorities anchor financial planning.

Knowledge coverage: Integrated planning; values; goals.

Flags / gates: F_FINAL_PRIORITIES

Scene 10.2 — Life Plan allocation

Background / Visual direction: Large dashboard: monthly income, study cost, commute, phone, leisure, savings, emergency, debt payment, investment.

Narrative purpose: Integrate cash flow and competing goals.

Story beats & sample dialogue:

Player must allocate 12 months with 3 milestone checkpoints.

Existing flags pre-fill obligations from earlier chapters.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Buffer-first balanced plan | SAVING +6; RISK -7; GOAL +5 | Resilient route. |
| B. Lifestyle-heavy | HAPPINESS +7; SAVING -6; GOAL -5 | Cash-flow stress. |
| C. Aggressive growth | RISK +10 | Volatile ending route. |

Consequence logic: Final plan reflects accumulated consequences, not a clean slate.

Knowledge coverage: Integrated financial plan.

Flags / gates: F_FINAL_PLAN

Scene 10.3 — Three shocks

Background / Visual direction: Montage: reduced work hours, friend invitation, device repair / opportunity course.

Narrative purpose: Test adaptation and priorities.

Story beats & sample dialogue:

Shock 1: income -15%.

Shock 2: social event cost.

Shock 3: skill course with future benefit.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| A. Rebalance using priorities | Planner +2; Balancer +1; RISK -2 | Adaptive ending. |
| B. Borrow for all gaps | RISK +10 | Debt ending pressure. |
| C. Cancel everything | HAPPINESS -7; Balancer -2 | Over-restriction ending tone. |

Consequence logic: Financial capability includes adaptation, not static optimization.

Knowledge coverage: Resilience; cognitive flexibility; debt; human capital.

Flags / gates: F_FINAL_ADAPT

Scene 10.4 — Mini-game: Financial Life Planner

Background / Visual direction: 12-month simulation board with calendar, cash-flow meter, goal bars, risk alerts and optional research panel.

Narrative purpose: Capstone assessment.

Story beats & sample dialogue:

Plan 12 months.

Respond to 3 shocks.

Make one major purchase decision.

Choose how to handle remaining surplus/deficit.

Final reflection asks player to explain 2 decisions.

Choices:

| Choice | Immediate effect | Delayed / narrative effect |
| --- | --- | --- |
| Resilient + goal-aligned + evidence-based | Mastery +4 | Eligible for E1/E2/E3/E5 depending stats/personality. |
| Feasible but fragile | Mastery +2 | Ending emphasizes growth area. |
| Persistent deficit | Mastery +1 | Recovery ending; replay suggestions. |

Consequence logic: Capstone score weighs feasibility, resilience, goal alignment, risk management and explanation.

Knowledge coverage: All FinTeen knowledge domains.

Flags / gates: MG_LIFE_PLANNER

22. EXPANDED MINI-GAME DESIGN LIBRARY

Các mini-game dưới đây dùng cùng một assessment philosophy: không trừ WEALTH/SAVING/RISK chỉ vì người chơi trả lời sai trong một bài học. Gameplay consequence chỉ xảy ra khi mini-game nằm trong một narrative decision. Điểm mini-game dùng để đo mastery, mở hint/reflection, badge hoặc Knowledge Gate.

Needs or Wants — Context Edition

| Field | Specification |
| --- | --- |
| Estimated duration | 2–4 phút |
| Core mechanic | Card sorting + contextual justification |
| Core loop | • 10–12 item cards xuất hiện theo đời sống của Minh.• Kéo vào Need / Want / Depends on context.• Các card 'Depends' mở câu hỏi Why? với 2–3 lý do.• Round cuối yêu cầu ưu tiên khi budget không đủ. |
| Scoring | Accuracy 50%; contextual justification 30%; prioritization 20%. Need/Want tuyệt đối chỉ áp dụng cho card rõ ràng; card phụ thuộc context chấm theo reasoning. |
| Feedback / fail-state | • Không dùng timer mặc định.• Sai → hiện contextual hint rồi cho sửa 1 lần.• Mastery ≥80 unlock Knowledge Unit D01.02. |

Budget Builder

| Field | Specification |
| --- | --- |
| Estimated duration | 5–7 phút |
| Core mechanic | Resource allocation / constraint puzzle |
| Core loop | • Income được đặt ở đầu tháng.• Kéo expense cards vào Fixed / Variable / Saving / Goal.• Cash-flow meter cập nhật real-time.• Round 2 thêm unexpected event; người chơi phải rebalance.• Round 3 yêu cầu giữ một minimum buffer. |
| Scoring | Feasibility 35%; savings/goal contribution 20%; resilience 25%; explanation 20%. Bonus không dành cho saving cực đoan nếu HAPPINESS/essential needs bị vi phạm. |
| Feedback / fail-state | • Có Undo/Reset.• Hard constraint: essential needs không thể bị bỏ hoàn toàn.• Mastery ≥75 unlock advanced budget events. |

Savings Race

| Field | Specification |
| --- | --- |
| Estimated duration | 4–6 phút |
| Core mechanic | Timeline / recurring contribution simulation |
| Core loop | • 6–12 payday nodes.• Chọn auto-save rate hoặc fixed amount.• Event cards thay đổi expense/income.• Có 2 lần Adjust Plan miễn phí.• Goal meter và Emergency Shield cùng hiển thị. |
| Scoring | Goal progress 30%; buffer resilience 30%; plan sustainability 25%; adaptation 15%. |
| Feedback / fail-state | • Không cần đạt 100% goal để pass nếu người chơi phục hồi tốt sau shock.• Cho xem counterfactual: 'Nếu tiết kiệm thêm X/tháng...' |

Career Match

| Field | Specification |
| --- | --- |
| Estimated duration | 5 phút |
| Core mechanic | Multi-criteria matching + research turns |
| Core loop | • Ba đến năm career cards.• Attributes: pay, training, commute, schedule, stability, interest, growth.• Một số attributes hidden; bấm Research tốn 1 turn.• Người chơi đặt trọng số theo goal. |
| Scoring | Goal fit 40%; evidence/research 30%; trade-off explanation 30%. Không có nghề 'best' toàn cục. |
| Feedback / fail-state | • Randomize profiles khi replay.• Có accessibility mode bỏ turn pressure. |

Smart Shopping

| Field | Specification |
| --- | --- |
| Estimated duration | 4–6 phút |
| Core mechanic | Comparison matrix / evidence hunt |
| Core loop | • Chọn 3 tiêu chí ưu tiên.• Inspect price, required accessories, fee, warranty, repair, return policy.• Một số quảng cáo là framing/social proof chứ không phải dữ kiện quyết định.• Chọn sản phẩm và gắn 2 evidence tokens. |
| Scoring | Criteria fit 35%; total-cost inspection 30%; evidence quality 25%; resistance to irrelevant persuasion 10%. |
| Feedback / fail-state | • Nếu bỏ sót hidden cost, game chỉ ra sau quyết định.• Replay thay đổi product set. |

Compound Timeline

| Field | Specification |
| --- | --- |
| Estimated duration | 4–5 phút |
| Core mechanic | Interactive simulation / prediction |
| Core loop | • Slider: principal, monthly contribution, rate, years.• Trước khi chạy simulation, player phải predict.• Advanced round bật inflation toggle.• Graph chỉ hiện sau prediction để tránh trial-and-error vô nghĩa. |
| Scoring | Prediction 30%; causal explanation 40%; scenario comparison 30%. |
| Feedback / fail-state | • Không yêu cầu tính tay công thức phức tạp.• Cho isolate-one-variable mode để học quan hệ nhân quả. |

Loan Detective

| Field | Specification |
| --- | --- |
| Estimated duration | 6–8 phút |
| Core mechanic | Document inspection + cost comparison |
| Core loop | • Mỗi loan dossier có principal, fee, rate, term, payment.• Highlight 5 critical fields.• Calculator trong game tính total repayment sau khi player nhập dữ liệu.• Final choice phải phù hợp goal/cash flow. |
| Scoring | Field detection 30%; total-cost comparison 40%; suitability explanation 30%. |
| Feedback / fail-state | • Penalty nhẹ cho missed fee; không chấm dựa trên 'lãi thấp nhất' nếu term/fee làm tổng chi phí khác.• Replay có bộ offer mới. |

Scam or Safe

| Field | Specification |
| --- | --- |
| Estimated duration | 3–5 phút |
| Core mechanic | Rapid classification + inspection |
| Core loop | • 12 messages từ email/SMS/social.• Label Safe / Suspicious / Need verification.• Inspect mở sender/domain/request/context.• Một số message hợp pháp nhưng unusual để tránh học heuristic quá đơn giản. |
| Scoring | Classification 70%; evidence inspection 20%; false-positive control 10%. |
| Feedback / fail-state | • Timer optional.• Không dùng thương hiệu thật.• Sau round có Red Flag Recap. |

Coverage Match

| Field | Specification |
| --- | --- |
| Estimated duration | 4–5 phút |
| Core mechanic | Risk matrix / protection matching |
| Core loop | • Risk cards có Probability và Impact.• Protection cards: buffer, prevention, insurance-like coverage, accept risk.• Người chơi đặt protection budget hữu hạn.• Một số low-impact risks nên accept thay vì insure. |
| Scoring | High-impact protection 40%; cost efficiency 30%; retained buffer 20%; explanation 10%. |
| Feedback / fail-state | • Không thưởng cho 'bảo hiểm tất cả'.• Dùng fictional coverage, không tư vấn sản phẩm thật. |

Portfolio Builder

| Field | Specification |
| --- | --- |
| Estimated duration | 6–8 phút |
| Core mechanic | Allocation + event simulation |
| Core loop | • 100 tokens across 4 simplified asset classes.• Goal/time horizon chọn trước.• 6 fictional market/event cards.• Tối đa 2 rebalance actions.• Risk meter cho volatility range, không hứa return. |
| Scoring | Suitability 35%; diversification 25%; consistency 20%; response to events 20%. |
| Feedback / fail-state | • Không dùng ticker/cổ phiếu thật.• Không có portfolio 'đảm bảo thắng'.• Replay randomizes event order. |

Bias Detector

| Field | Specification |
| --- | --- |
| Estimated duration | 3–4 phút |
| Core mechanic | Scenario recognition + response choice |
| Core loop | • 8 short scenes: FOMO, herd behavior, overconfidence, loss aversion, anchoring.• Chọn bias và chọn response process.• Một số scene có 2 bias gần nhau để yêu cầu reasoning. |
| Scoring | Bias recognition 50%; process response 30%; explanation 20%. |
| Feedback / fail-state | • Không gắn bias với 'tính cách xấu'.• Feedback tập trung vào decision process. |

Financial Life Planner

| Field | Specification |
| --- | --- |
| Estimated duration | 10–15 phút |
| Core mechanic | Capstone 12-month simulation |
| Core loop | • Set 3 priorities.• Allocate monthly cash flow.• Handle 3 shocks.• Make 1 borrowing/payment decision.• Allocate surplus between buffer, goal and long-term investing.• Final reflection with 2 written/multiple-choice reasoning prompts. |
| Scoring | Feasibility 25%; resilience 25%; goal alignment 20%; risk management 15%; evidence/reasoning 15%. |
| Feedback / fail-state | • Score không trực tiếp quyết định 'Good/Bad Ending'.• Ending kết hợp stats + flags + personality tendencies + mastery.• Cho replay từ checkpoint. |

23. MINI-GAME GLOBAL SCORING & MASTERY

| Mastery band | Score | Game response |
| --- | --- | --- |
| Mastered | 80–100 | Unlock Knowledge Unit; optional advanced challenge; no forced replay. |
| Developing | 60–79 | Unlock base content; show 1–2 targeted feedback cards. |
| Needs practice | 0–59 | No punishment to financial stats; guided replay of missed concepts; Knowledge Gate remains optional/soft unless later concept truly depends on it. |

Recommended telemetry per mini-game: attempts, completion time, hint use, changed answers, evidence inspected, score by subskill, and whether the player improved on replay. Không dùng telemetry này để gán nhãn tâm lý.

24. CONTENT COVERAGE CHECK

| Knowledge area | Chapters | Primary mini-games | Coverage mode |
| --- | --- | --- | --- |
| Earning Income | 4, 10 | Career Match; Life Planner | Career research, gross/net, human capital, income trade-offs |
| Spending | 1, 2, 5, 10 | Needs/Wants; Budget Builder; Smart Shopping | Needs/wants, opportunity cost, budget, total cost, consumer choice |
| Saving | 2, 3, 6, 10 | Budget Builder; Savings Race; Compound Timeline | Goals, pay-yourself-first, emergency fund, interest |
| Investing | 6, 9, 10 | Compound Timeline; Portfolio Builder; Bias Detector | Risk/return, diversification, time horizon, bias |
| Managing Credit | 5, 7, 10 | Smart Shopping; Loan Detective; Life Planner | Payment methods, borrowing cost, credit card/debt behavior |
| Managing Risk | 3, 8, 9, 10 | Scam or Safe; Coverage Match; Portfolio Builder | Emergency resilience, fraud, protection, investment risk |
| CFPB Executive Function | 1–10 | All planning/simulation games | Planning, self-control, working memory, flexibility, persistence |
| CFPB Habits & Norms | 1–10 | Repeated choice patterns | Saving routine, values, peer pressure, rules of thumb |
| CFPB Knowledge & Decision-Making | 4–10 strongly | Research/comparison games | Credible information, analysis, comparison, deliberate choices |

25. PRODUCTION NOTES FOR SCENES & BACKGROUNDS

Backgrounds nên tái sử dụng theo modular set: Bedroom Day/Night; Family Kitchen; School Courtyard; Classroom; Library; Cafe; Mall/Store; Part-time Workplace; Bus Stop; Digital UI Overlay.

Mỗi background có 2–3 lighting states để tạo cảm giác thời gian trôi mà không tăng quá nhiều asset cost.

Major choice scene nên có close-up prop/UI: receipt, payslip, loan offer, phone message, budget board, account comparison.

Không nhồi định nghĩa vào dialogue. Dùng tooltip, inspect panel, mentor question và post-choice reflection.

Dialogue branch nên ngắn 2–6 lines rồi reconverge; delayed consequences dùng flags để tạo cảm giác choices matter mà không nổ scope.

Chapter 7–10 phải đọc flags từ Chapter 1–6 để người chơi thấy lịch sử tài chính của mình được tích lũy.

Mini-game tutorial tối đa 3 steps; lần chơi sau bỏ tutorial hoặc cho Skip.

Không sử dụng thương hiệu ngân hàng, sản phẩm đầu tư, khoản vay hoặc scam thật; dùng fictional/simulated data.

