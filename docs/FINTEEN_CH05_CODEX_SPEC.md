# FINTEEN — CHAPTER 5: NGÂN HÀNG VÀ LÃI
## Kịch bản Visual Novel chi tiết + Choices Matter + Compound Timeline + yêu cầu Codex

**Trạng thái:** Đặc tả nội dung đề xuất để triển khai. **Nguồn nền:** `FinTeen_Game_Design_Document_GDD_v3_money_fixed.docx`, Chapter 5; `FinTeen_Visual_Novel_Game_Design_v3_money_fixed.docx`; `FinTeen_Financial_Knowledge_Framework_v3_money_fixed.docx`. Các **con số, lựa chọn chính và delta stats** bên dưới lấy từ GDD; **hội thoại dài, các lượt tương tác phụ và đặc tả UI** là phần phát triển mới, cần được kiểm thử.

## 0. Nguyên tắc biên kịch (bắt buộc)

- Khán giả tuổi 13–18; An 16 tuổi trong chương này. Nói như bạn bè/người bán thực sự; **không biến nhân vật thành người đọc giáo trình**.
- Kiến thức xuất hiện qua dữ kiện → tò mò/bất đồng → kiểm tra → hậu quả → tự rút kinh nghiệm. Không để nhân vật đọc phép tính đầy đủ ngay trước khi người chơi phải tự giải.
- Minh có thể thích lãi cao nhưng không phải nhân vật “sai” hoặc “xấu”; Cô Linh gợi ý để người chơi suy nghĩ, không đọc đáp án.
- Không dùng thuật ngữ quá kỹ; từ như **lãi kép, lãi rút trước hạn, sức mua** phải có giải thích tùy chọn bằng Inspect, không nhồi thoại.
- Mỗi chapter độc lập: Money khởi tạo **1.000.000 VND**, SAVING 50, HAPPINESS 50, RISK 30, GOAL 50. RISK càng cao càng xấu. Không tạo WEALTH/FIQ hay số dư phụ như tài khoản độc lập.
- **Money chỉ thay đổi khi giao dịch VND thực sự xảy ra.** Toàn bộ chapter 5 hiện chỉ nghiên cứu và lập kế hoạch: không chuyển khoản, không thu phí thực tế, không tự nhận lãi vào ví. Vì vậy **Money giữ 1.000.000đ** suốt lượt chơi; số dư ở tháng 3 chỉ là dự kiến trong bài tập.
- Đơn vị D04.04, D04.05, D04.06, D04.07, D07.07, D08.06, D08.08. Trọng tâm được chấm D04.04, D04.05, D04.06, D07.07.
- Tất cả tổ chức, lãi suất, phí, điều kiện rút trước hạn đều là **giả lập**, không phải báo giá/lời khuyên pháp lý tại Việt Nam. Đừng áp dụng bảo hiểm FDIC như bảo vệ tiền gửi Việt Nam.

## 1. Dữ liệu bất biến và phép tính nguồn (GDD v3)

| Dữ kiện | Giá trị |
|---|---|
| An cần đóng khóa học | 1.000.000đ vào cuối tháng thứ 3 |
| Money ban đầu | 1.000.000đ |
| Tài khoản A, linh hoạt | Lãi đơn minh họa 3%/năm; phí 5.000đ/tháng |
| Tài khoản B, kỳ hạn 12 tháng | Lãi niêm yết 6%/năm; phí 0; nếu rút sau 3 tháng, áp dụng 0,2%/năm theo điều kiện giả lập |
| A — lãi 3 tháng | 1.000.000 × 3% × 3/12 = 7.500đ |
| A — phí 3 tháng | 5.000 × 3 = 15.000đ |
| A — số tiền sử dụng được sau 3 tháng | **992.500đ**, thiếu **7.500đ** so với học phí |
| B — lãi khi rút sớm sau 3 tháng | 1.000.000 × 0,2% × 3/12 = 500đ |
| B — số tiền sử dụng được sau 3 tháng | **1.000.500đ**, đủ học phí nếu tuân theo điều kiện giả lập |
| Thí nghiệm lãi kép riêng trong minigame | 1.000.000đ × 5%/năm; cuối năm 1: 1.050.000đ; cuối năm 2: 1.102.500đ |
| Thí nghiệm giá cả riêng | Món hàng giá 1.000.000đ tăng 8% sau một năm → 1.080.000đ. Tiền cuối năm 1 là 1.050.000đ, nên thiếu 30.000đ để mua. |

**Quan trọng:** Lãi 5%/năm của timeline là bài tập riêng, không phải lãi tài khoản A hay B. B chọn kỳ hạn 12 tháng nhưng rút sau 3 tháng thì **không được tính 6%/năm**; dùng 0,2%/năm theo dữ kiện. Các phép tính mang tính minh họa, chưa tính thuế hay quy tắc làm tròn khác.

## 2. Nhân vật / asset / scene flow

- AN: nam/nữ tùy sprite do player thiết lập; nội tâm tự nhiên, có quyền do dự.
- MINH: bạn của An; thích lựa chọn nghe hấp dẫn, không thành nhân vật phản diện.
- CO_LINH: người hướng dẫn tại phòng thực hành, hỏi câu ngắn.
- BANK_STAFF: nhân viên ngân hàng **giả lập**, dùng asset NPC hiện có hoặc placeholder nếu chưa có.
- BG09: phòng thực hành ngân hàng; màn tra cứu; bảng timeline; quầy tư vấn. Có thể tái dùng một nền và overlay, không bắt buộc sinh thêm hình.

**Sơ đồ:** `SC01_ART → SC01_DIALOGUES → SC01_INSPECT → SC02_ART → SC02_DIALOGUES → SC02_CHOICE(A/B) → SC02_FEEDBACK_A/B → SC03_ART → SC03_DIALOGUES → COMPOUND_TIMELINE → SC04_ART → SC04_DIALOGUES → SC04_CHOICE(A/B/C) → FEEDBACK → SC04_REVIEW (sửa nếu cần) → REFLECTION_1 → REFLECTION_2 → ENDING`.

Giữ **4 scene chính** theo GDD. Đoạn “hội tụ về scene 5” trong phần mô tả GDD được thực hiện bằng **recap/reflection trong scene 4**, không tạo chapter 5 thứ hai.

## 3. SCRIPT SCENE 1 — HAI TÀI KHOẢN

**SceneId:** `CH05_SC01`. **BG09:** Phòng thực hành ngân hàng. **Objective:** D04.04, D07.07. **Hành động:** Xem lịch khóa học, mở hai thẻ tài khoản.

| Line ID | Nhân vật / biểu cảm | Nội dung hiển thị | Tiếp theo |
|---|---|---|---|
| 01_01 | AN / thinking | “Ba tháng nữa phải đóng một triệu tiền khóa học rồi. Để tiền không thôi thì hơi tiếc nhỉ?” | 01_02 |
| 01_02 | MINH / inviting | “Đúng lúc! Tớ vừa thấy chỗ này ghi lãi 6% một năm. Nghe cũng được đấy.” | 01_03 |
| 01_03 | AN / neutral | “Sáu phần trăm à? Nhưng mình đâu định để tiền tận một năm.” | 01_04 |
| 01_04 | MINH / neutral | “Thì cứ gửi trước đã. Đến lúc cần rút chắc cũng được mà?” | 01_05 |
| 01_05 | BANK_STAFF / neutral | “Hai tài khoản đều có thể rút tiền, nhưng cách tính lãi và phí không giống nhau đâu em.” | 01_06 |
| 01_06 | AN / curious | “Vậy em xem điều kiện của từng loại được không ạ?” | INSPECT_ACCOUNTS |
| 01_07 | BANK_STAFF / explaining | “Được chứ. Em cứ đọc, phần nào chưa rõ thì hỏi chị.” | 01_08 |
| 01_08 | AN / thinking | “Có vẻ nhìn mỗi con số phần trăm thì chưa đủ...” | SC02 |

### Inspect bắt buộc `ch05_accounts`
Hai thẻ mở cạnh nhau, không có lời giải sẵn:

**Thẻ A — Linh hoạt**: Lãi minh họa 3%/năm; phí quản lý 5.000đ/tháng; có thể rút khi cần; tiền thực nhận phải trừ phí đã phát sinh.

**Thẻ B — Kỳ hạn 12 tháng**: Niêm yết 6%/năm nếu đủ kỳ hạn theo điều kiện giả lập; rút trước hạn áp dụng 0,2%/năm; không thu phí; phải xem quy định rút sớm.

**Thẻ lịch:** “Ngày đóng khóa học: cuối tháng 3. Cần đủ 1.000.000đ”. **Nút:** `Xem A`, `Xem B`, `Xem lịch`, `Đóng`.

**Không tạo choice cộng điểm** khi chỉ mở thẻ. Có thể thêm câu hỏi tương tác phụ không ảnh hưởng stats: “Điều em muốn hỏi đầu tiên là gì?” → “Lãi tính ra sao?”, “Rút sớm thế nào?”, “Ai cung cấp sản phẩm?”. Cả ba dẫn tới thẻ liên quan.

## 4. SCRIPT SCENE 2 — ĐỌC ĐIỀU KIỆN TRƯỚC KHI CHỌN

**SceneId:** `CH05_SC02`. **Objective:** D07.07, D08.01. Có một quảng cáo app bên ngoài nói lợi nhuận cao nhưng không nêu rõ đơn vị cung cấp/phạm vi bảo vệ; chỉ là **dữ kiện giả lập**, không lừa đảo mặc định.

| Line ID | Nhân vật / biểu cảm | Nội dung hiển thị | Tiếp theo |
|---|---|---|---|
| 02_01 | MINH / inviting | “Ê, app này còn ghi lợi nhuận cao hơn nữa nè!” | 02_02 |
| 02_02 | AN / curious | “Cao hơn bao nhiêu? Tớ chẳng thấy tên bên quản lý ở đâu cả.” | 02_03 |
| 02_03 | MINH / neutral | “Có cái biểu đồ đi lên kìa. Trông cũng chuyên nghiệp mà.” | 02_04 |
| 02_04 | CO_LINH / neutral | “Các em đang xem gì mà chăm chú thế?” | 02_05 |
| 02_05 | AN / thinking | “Bọn em thấy vài mức lãi khác nhau. Nhưng thông tin mỗi bên ghi một kiểu ạ.” | 02_06 |
| 02_06 | CO_LINH / encouraging | “Vậy thử tìm phần điều kiện của sản phẩm xem. Đôi khi thứ mình muốn biết không nằm ở dòng chữ to nhất.” | SC02_CHOICE |

### Choice chính `CH05_SC02` — CHỌN CÁCH TÌM HIỂU

**Prompt UI (gợi mở):** “Trước khi quyết định, An sẽ xem phần nào tiếp theo?”

- **A** `CH05_SC02_A`: “Mở thông tin đơn vị cung cấp và điều kiện rút tiền.” (GDD: kiểm tra danh tính, phạm vi bảo vệ và điều kiện rút). Điều kiện: mở sau khi đã xem dữ kiện bắt buộc. **Money 0; SAVING 0; HAPPINESS 0; RISK −1; GOAL +1; evidence {I:2,C:1,P:2}; flag `provider_checked=true`, `provider_unchecked=false`.** Dialogue hậu quả:
  - AN / thinking: “À, tài khoản này rút sớm thì lãi khác hẳn lúc gửi đủ hạn.”
  - MINH / surprised: “Ủa, vậy số 6% kia không áp dụng cho ba tháng à?”
  - BANK_STAFF / neutral: “Đúng rồi. Em cũng có thể xem ai cung cấp dịch vụ và phạm vi bảo vệ của từng sản phẩm ngay trong thẻ.”
  - AN / neutral: “May mà mình xem thêm. Tớ cứ tưởng mấy mục đó giống nhau.”
  - **Next:** `CH05_SC03_ART`.
- **B** `CH05_SC02_B`: “Xem mức lãi nổi bật rồi chọn tiếp, chưa đọc điều kiện.” (GDD: chỉ nhìn lãi cao, bỏ qua phí/điều kiện). Điều kiện: như A. **Money 0; mọi stats 0; evidence {I:0,C:0,P:0}; flag `provider_unchecked=true`, `provider_checked=false`.** Dialogue hậu quả:
  - AN / neutral: “Chắc mình xem thử phương án lãi cao trước.”
  - MINH / inviting: “Đấy, tớ cũng đang để ý chỗ đó!”
  - BANK_STAFF / neutral: “Được em. Bảng phí và điều kiện rút vẫn ở đây, khi cần em có thể mở lại.”
  - AN / thinking: “Ừm... có khi lát nữa mình phải xem kỹ hơn.”
  - **Next:** `CH05_SC03_ART`.

**Quan trọng:** B không bị chê bai; đến recap có thể quay lại kiểm tra dữ kiện. Không được tự tính `provider_checked` chỉ vì người chơi xem biểu đồ lãi.

## 5. SCRIPT SCENE 3 — LÃI TĂNG, CÒN SỨC MUA?

**SceneId:** `CH05_SC03`. **Objective:** D04.05, D04.06, D04.07, D08.06, D08.08. Màn hình timeline và bảng giá.

| Line ID | Nhân vật / biểu cảm | Nội dung hiển thị | Tiếp theo |
|---|---|---|---|
| 03_01 | CO_LINH / explaining | “Trước khi chọn tài khoản, thử một bài mô phỏng nhỏ nhé.” | 03_02 |
| 03_02 | MINH / inviting | “Hay, tớ muốn xem để lâu thì tiền tăng được bao nhiêu.” | 03_03 |
| 03_03 | AN / neutral | “Nhưng tháng thứ ba mình đã phải đóng học phí rồi...” | 03_04 |
| 03_04 | CO_LINH / neutral | “Bài này chỉ để xem cách tiền thay đổi theo thời gian. Chưa phải tiền trong tài khoản của An.” | MINI_GAME |
| 03_05 | AN / surprised | “Tiền tăng thật, nhưng giá món đồ cũng tăng theo...” | 03_06 |
| 03_06 | MINH / thinking | “Thế nếu chỉ nhìn số tiền cuối năm thì dễ mừng hụt nhỉ?” | 03_07 |
| 03_07 | CO_LINH / encouraging | “Ừ. Giờ các em đã có thêm dữ kiện để quay lại mục tiêu ba tháng rồi.” | SC04 |

`03_05`–`03_07` chỉ xuất hiện sau minigame. Nếu làm sai, trước đó Cô Linh hỏi: “Em thử nhìn lại giá món hàng ở hai thời điểm xem?” và cho phép retry, không đọc đáp án trước khi người chơi thử.

### Mini-game `COMPOUND_TIMELINE_CH05`: 4 màn / 3–5 phút

**Màn 1 — Khám phá mốc thời gian**
- Hiển thị vốn giả lập 1.000.000đ, lãi kép 5%/năm, thanh trượt 0–2 năm hoặc nút năm 0/1/2. **Không ảnh hưởng Money.**
- Năm 0: 1.000.000; năm 1: 1.050.000; năm 2: 1.102.500.
- Yêu cầu: kéo tới cả năm 1 và năm 2; hỏi “Năm 2 có phải chỉ thêm đúng 50.000đ không?”
- Sau lần trả lời đầu mới hiện giải thích: lãi năm 2 tính trên số tiền đã gồm lãi năm 1. Chọn sai được thử lại, lưu firstAttempt.

**Màn 2 — Lãi đơn và lãi kép**
- Hai đường/bảng minh họa với cùng vốn 1.000.000đ, cùng 5%/năm, trong 2 năm. Lãi đơn 1.100.000; lãi kép 1.102.500.
- Yêu cầu: ghép nhãn “Lãi chỉ trên vốn ban đầu” và “Lãi trên vốn + lãi trước đó”; kiểm tra 2.500đ chênh.
- Đừng đưa đáp án trực tiếp trong nhãn câu hỏi.

**Màn 3 — Tiền tăng, giá cũng tăng**
- Món hàng từ 1.000.000 lên 1.080.000đ sau một năm (8%). Tiền mô phỏng cuối năm 1: 1.050.000đ.
- Yêu cầu chọn và giải thích: đủ mua / thiếu 30.000 / dư 30.000. Feedback: danh nghĩa tăng 50.000 nhưng sức mua so với món hàng giảm.
- Cô Linh chỉ hỏi: “Nếu hôm nay mua được món đó thì một năm nữa sao?”

**Màn 4 — Chọn tiền có thể dùng sau ba tháng**
- Hiện hai thẻ A/B, phí/lãi và lịch khóa học (các số nguồn ở mục 1).
- Người chơi lần lượt điền/chọn **A lãi 7.500; phí 15.000; số còn 992.500; thiếu 7.500**, **B lãi rút sớm 500; số còn 1.000.500**.
- Tự chọn thông tin muốn xem, không công bố đáp số trước khi làm.
- Feedback giải thích lãi niêm yết của B không phải lãi rút sớm.

**Đánh giá:** Chia 3 năng lực information / calculation / planning. Lưu answer, attemptCount, firstAttemptCorrect, finalCorrect, inspectedItems; điểm minigame độc lập điểm choice; cho retry nhưng không ghi đè lịch sử lần đầu. `onComplete({score,total,passed,answers,firstAttempt,...})` tương thích API player hiện tại; `total` phải bằng số thử thách được chấm (không phải số thẻ được mở). Các phép tính trong mini-game không phát sinh giao dịch.

**UI:** Có stepper 1/4, nút quay lại trong mini-game, xem dữ kiện, thanh trượt cho mốc thời gian, thẻ A/B, kết quả giải thích cuối mỗi bước, nút `Tiếp tục` chỉ mở khi xử lý xong bước; keyboard-accessible, không buộc kéo chuột trên điện thoại (có nút tăng/giảm và đáp án thay thế). Có thể dùng layout sẵn SmartShopping và CSS riêng `compound-timeline.css`.

## 6. SCRIPT SCENE 4 — CHỌN THEO THỜI HẠN

**SceneId:** `CH05_SC04`. **Objective:** D04.04, D04.05, D04.06, D08.06. Trước choice hiển thị lại thông tin A/B và lịch đóng học phí.

| Line ID | Nhân vật / biểu cảm | Nội dung hiển thị | Tiếp theo |
|---|---|---|---|
| 04_01 | BANK_STAFF / neutral | “Giờ em đã xem cả hai tài khoản rồi. Em muốn chọn phương án nào?” | 04_02 |
| 04_02 | AN / thinking | “Em đang phân vân. A thì tiện, còn B nhìn lãi hấp dẫn hơn.” | 04_03 |
| 04_03 | MINH / neutral | “Nếu cần tiền sau ba tháng thì sao? Chọn kiểu nào cũng có điểm phải cân nhắc nhỉ.” | 04_04 |
| 04_04 | BANK_STAFF / explaining | “Em có thể xem lại số tiền dự kiến nhận được ở tháng thứ ba.” | CHOICE |

### Choice chính `CH05_SC04` — ĐẾN LÚC CHỌN

**Prompt UI:** “Cuối tháng thứ ba, An phải có đủ 1 triệu đóng khóa học. Bạn sẽ chọn cách nào?”

**A** — `CH05_SC04_A`: **“Chọn B, dự tính rút sau ba tháng theo điều kiện rút sớm.”**
- Giữ nghĩa GDD: chấp nhận mức lãi thấp khi rút trước hạn. Điều kiện: đọc dữ kiện scene. **Money 0; SAVING +5; HAPPINESS 0; RISK 0; GOAL +3; evidence {I:2,C:2,P:2}; flag `account_fit=true`, `account_mismatch=false`, `account_pending=false`.**
- Nhánh thoại:
  - AN / thinking: “Tớ chọn B. Dù không được mức 6% như quảng cáo, ba tháng nữa vẫn đủ tiền học.”
  - MINH / surprised: “Vậy là rút sớm lãi có chút xíu thôi à?”
  - AN / neutral: “Ừ, nhưng ít nhất mình biết trước sẽ nhận được bao nhiêu.”
  - BANK_STAFF / neutral: “Chị đã ghi lại thời điểm rút dự kiến. Đây mới là kế hoạch mô phỏng, chưa có giao dịch nào nhé.”
- Hậu quả: B 1.000.500đ dự kiến; đáp ứng mục tiêu. **Không cộng 500đ vào Money.**

**B** — `CH05_SC04_B`: **“Chọn A vì dễ rút, rồi tìm cách bù khoản còn thiếu.”**
- Giữ nghĩa GDD: phải xác định nguồn bù **7.500đ** trước hạn, không ghi nhận tiền chưa nhận. **Chưa cấp `account_fit` ngay khi bấm.**
- Mở panel `CH05_PLAN_TOPUP`: “Dự kiến thiếu 7.500đ. An có thể làm gì trước hạn?”
  - **B1 – nguồn bù có căn cứ:** “Giảm 7.500đ trong khoản giải trí dự kiến của tháng tới, ghi rõ ngày kiểm tra.” Đây là **giả định kế hoạch thêm mới**; chỉ coi hợp lệ khi UI có thẻ ngân sách mô phỏng xác nhận khoản giải trí **chưa chi tối thiểu 7.500đ**. Nếu GDD hiện không có thẻ ngân sách này thì **không được tự giả định có khoản chi để cắt**; có thể yêu cầu người chơi nhập/xác minh nguồn bù qua Inspect và giữ `account_pending` đến khi có minh chứng.
  - **B2 – lời hứa chưa chắc chắn:** “Chắc lúc đó xin thêm được thôi.” Không có minh chứng → `account_pending=true`, `account_fit=false`, GOAL chưa cộng mức +3 của phương án khả thi; mở bước xem lại.
  - **B3 – xem lại:** quay về thẻ A/B, không nhân đôi delta/điểm.
- Khi **B1 được kiểm chứng**: **Money 0; SAVING +5; GOAL +3; evidence {I:2,C:2,P:2}; flag `account_fit=true`, `account_pending=false`**; nhánh thoại:
  - AN / thinking: “A dễ rút hơn, nhưng tính cả phí thì mình vẫn thiếu một ít.”
  - MINH / neutral: “Thiếu bao nhiêu?”
  - AN / neutral: “7.500 đồng. Mình phải chừa khoản đó trong kế hoạch tháng tới.”
  - CO_LINH / encouraging: “Em ghi lại ngày kiểm tra và nguồn tiền dự kiến nhé.”
- Khi **B2 chưa kiểm chứng**: thoại:
  - AN / neutral: “Chắc đến lúc đó mình xoay được...”
  - CO_LINH / neutral: “Ừm, nhưng em đã biết khoản đó sẽ đến từ đâu chưa?”
  - AN / thinking: “Chưa chắc ạ. Để em xem lại.”
  - Không trừ Money, không biến lời hứa thành tiền đã có. **Dẫn tới bước sửa kế hoạch**, không tự nâng flag `account_fit`.

**C** — `CH05_SC04_C`: **“Chọn A ngay, vì thấy có lãi là đủ rồi.”**
- Giữ nghĩa GDD: bỏ qua phí và tác động giá tăng. **Money 0; SAVING 0; HAPPINESS 0; RISK 0; GOAL −3; evidence {I:0,C:0,P:0}; flag `account_mismatch=true`, `account_fit=false`, `account_pending=false`.**
- Nhánh thoại:
  - AN / neutral: “Tớ chọn A. Dù sao để tiền trong đó cũng có lãi mà.”
  - MINH / neutral: “Ừ, lại còn rút lúc nào cũng được.”
  - CO_LINH / neutral: “Thế thử xem ở tháng thứ ba, An thực sự có thể rút bao nhiêu nhé?”
  - AN / worried-money: “Khoan... mình quên khoản phí hằng tháng.”
  - CO_LINH / encouraging: “Vẫn còn thời gian để xem lại kế hoạch.”
- Hậu quả: Dự kiến chỉ còn **992.500đ**, chưa đủ đóng học phí; cho xem lại, không chê trách người chơi.

### Recap / phục hồi lựa chọn
- Các nhánh quay về `CH05_SC04_RECAP`. Nếu `provider_unchecked`, hiện nút `Xem lại thông tin đơn vị cung cấp`; khi mở và trả lời kiểm tra đúng mới đổi `provider_checked=true` (không tự hồi tố tiền/điểm choice trước).
- Nếu `account_pending` hoặc `account_mismatch`, hiện nút `Tính lại tiền sau ba tháng` / `Sửa phương án`.
- Nếu sửa **trước khi có giao dịch**: hoàn tác delta của choice cũ, áp delta mới đúng một lần; lưu cả firstChoice và finalChoice. Không trừ Money ở bất cứ thao tác này.
- Một lựa chọn được sửa sau phản hồi có thể đạt Balanced hoặc Goal Achieved nếu thật sự đủ các điều kiện năng lực của GDD; **không loại khỏi Ending A chỉ vì có sửa**.
- Khi mọi lựa chọn và kiểm tra hoàn tất, chuyển Reflection.

## 7. REFLECTION — ĐỪNG BIẾN THÀNH CÂU HỎI ĐÁP ÁN LỘ LIỄU

**Line:** Cô Linh: “Giờ xem lại từ đầu nhé. Nếu lần sau gặp một tài khoản khác, em sẽ muốn biết điều gì trước?”

**R1 (Thông tin/phép tính):** “Thông tin nào quan trọng nhất với quyết định của An?” Các thẻ để người chơi **tự chọn**: ngày cần tiền; lãi niêm yết; cách tính lãi rút sớm; phí duy trì; tên nhà cung cấp; điều kiện bảo vệ; màu biểu đồ; lời bạn giới thiệu. Chấm dựa vào các nhóm bằng chứng; không buộc chọn một loại ngân hàng là đúng tuyệt đối.

**Line:** An: “Tớ cứ nghĩ gửi tiền là chỉ cần xem lãi. Giờ thì có nhiều thứ phải tính hơn.” (chỉ nếu người chơi đã xem phản hồi).

**R2 (Trade-off/hành động):** “Nếu chọn tài khoản tiện rút nhưng sau phí lại thiếu tiền học, bước tiếp theo nào có thể thực hiện được?” Cho chọn nguồn bù có kiểm chứng và ngày kiểm tra, hoặc sửa phương án theo dữ kiện. Nếu đã chọn B thì yêu cầu nói rõ đã đánh đổi mức lãi niêm yết để có tiền đúng thời điểm ra sao.

**Hội thoại kết:** Cô Linh: “Em có thể chọn khác bạn mình. Miễn là em biết mình đang dựa vào thông tin nào.” / An: “Ừm, lần này ít nhất mình biết điều gì cần xem trước.”

**Chấm:** tách `information / calculation / planning` (0–2 mỗi tiêu chí) theo rubric GDD; không đánh giá tính cách/giàu nghèo; không dựa duy nhất vào Money, SAVING, hay GOAL.

## 8. ENDING RULES — BẮT BUỘC THEO GDD

Xét theo thứ tự `C_RECOVERY` → `A_GOAL_ACHIEVED` → `B_BALANCED`.

- **C Recovery:** còn `account_mismatch` chưa sửa; còn `account_pending` chưa xác minh nguồn bù; hoặc `RISK > 55` hay `SAVING < 40`. Hội thoại kết đề xuất: **An:** “Mình tưởng để tiền có lãi là đủ. May là còn kịp tính lại trước ngày đóng học.”
- **A Goal Achieved:** `provider_checked`, `account_fit`, không thuộc C; điểm lựa chọn **>=75/100** theo rubric GDD; hoàn tất mini-game, reflection và tính đúng phép tính trọng tâm. Kết đề xuất: **An:** “Ba tháng nữa vẫn đủ tiền học. Vậy là yên tâm hơn rồi.”
- **B Balanced:** không thuộc C/A, đã có phương án thay thế hoặc kế hoạch sửa khả thi và hoàn thành học phần. Kết đề xuất: **An:** “Mình chọn cách tiện hơn, nhưng phải tính cả phí và khoản cần bù.”

**Lưu ý tính điểm:** Tổng trọng số trên 100 của GDD dùng hệ đánh giá học tập, không nhầm `evidenceScore` thô với 75%. Player cần tính phần trăm đã chuẩn hóa. Nếu chưa đủ dữ kiện/nguồn bù ở nút cuối, cho sửa; vẫn chưa giải quyết thì C.

## 9. YÊU CẦU KỸ THUẬT GIAO CODEX

**File đầu vào cần Codex đọc trong repo:** `VisualNovelPlayer.jsx`, `visual-novel.css`, `SmartShoppingMiniGame.jsx` (tham khảo workflow), `chapter4V3VisualNovel.js` (tham khảo schema scene và ledger), `miniGameRules` và router/data loader của chương. Tên thư mục được tự tìm trong repo; không đoán import path.

**Deliverables:**
1. `chapter5V3VisualNovel.js` chứa toàn bộ chapter với export thống nhất schema loader đang dùng; 4 scene chính và các nhánh hội tụ; mỗi thoại là một `dialogue` riêng, không gộp nhiều nhân vật vào một line.
2. `CompoundTimelineMiniGame.jsx` + `compound-timeline.css` tương thích `game`, `onComplete`, `className`; đủ bốn màn kể trên; mobile/keyboard; lưu kết quả lần đầu và sau retry.
3. Chỉnh `VisualNovelPlayer.jsx` **tối thiểu** để nhận game ID `COMPOUND_TIMELINE_CH05`; không phá chapter 1–4, không sửa API bắt buộc nếu có thể tránh.
4. Nếu thêm asset riêng, tham chiếu tên file thực có trong repo; nếu chưa có thì dùng lại sprite/background hoặc placeholder CSS thân thiện; không phát minh đường dẫn ảnh chắc chắn tồn tại.
5. Báo cáo cuối chapter hiển thị `Mini-game: Compound Timeline`, Money thực và stats delta; không hiển thị nhầm “chọn nghề”.
6. Cập nhật README ngắn hướng dẫn bật Chapter 5 và cách chạy/test.

### Điều kiện, flags và event keys

```js
const initialMoney = 1000000;
const initialStats = { SAVING: 50, HAPPINESS: 50, RISK: 30, GOAL: 50 };
const requiredKnowledge = ["D04.04","D04.05","D04.06","D04.07","D07.07","D08.06","D08.08"];
// Primary choice flags; clear mutually exclusive flags when revising.
// provider_checked / provider_unchecked
// account_fit / account_pending / account_mismatch
// account_choice_A / account_choice_B / account_choice_C
// topup_source_verified / mini_game_completed / reflection_completed
// No chapter 5 Money transaction events: all balances are forecasts.
```

- Kiểm tra `requires.inspected` và flag theo schema player; option bị khóa phải hiển thị lý do, có đường quay lại xem dữ liệu.
- Chống cộng lại delta khi mở Inspect hoặc retry mini-game. Khi sửa choice, cập nhật ledger theo `choiceGroup`, không được cộng lặp.
- Giới hạn stats [0,100], không chặn một lựa chọn chỉ vì Money ban đầu bằng tiền học; đây là hoạt động chọn kế hoạch giả lập.
- Không tự làm nhảy thời gian trong đời thật của An hoặc thu phí 3 tháng vào Money; đây là phép tính dự kiến, không là giao dịch.
- Có xử lý sai/thiếu thông tin và feedback: không đưa answer sẵn vào UI trước khi người chơi thử.

### Acceptance tests

1. Lựa chọn SC02 A → RISK 29, GOAL 51; Money vẫn 1.000.000đ.
2. Lựa chọn SC02 B → RISK 30, GOAL 50; Money vẫn 1.000.000đ.
3. SC04 A với lựa chọn SC02 A → SAVING 55, GOAL 54; `account_fit` true; Money 1.000.000đ.
4. SC04 B **chưa xác minh nguồn bù** → `account_pending` true, không được coi đã đủ 1.000.000đ sau phí.
5. SC04 B **đã xác minh nguồn bù theo thẻ dữ kiện** → SAVING +5, GOAL +3 chỉ một lần.
6. SC04 C → GOAL −3; còn thiếu 7.500đ dự kiến; có nút sửa.
7. Timeline: 1.050.000; 1.102.500; đơn năm 2 là 1.100.000; chênh 2.500.
8. Inflation: món hàng 1.080.000, tiền 1.050.000 → thiếu 30.000.
9. Tài khoản A 3 tháng: 992.500; B rút sớm: 1.000.500. Không dùng 6%/năm cho B rút sớm.
10. Inspect mở nhiều lần không cộng điểm; retry minigame không cộng thêm Money hay stats; initial vs revised choice lưu riêng.
11. Ending ưu tiên C trước A; Ending A chỉ xuất hiện khi đầy đủ điều kiện và learning score >= 75% chuẩn hóa.
12. Mobile: 360px và desktop: không tràn stepper, card, modal; bàn phím hoàn thành được nhiệm vụ thay kéo thả.
13. Không có import file/asset không tồn tại; chạy được kiểm tra lint/build của dự án nếu môi trường hỗ trợ.

## 10. PROMPT NGẮN DÁN VÀO CODEX

> Hãy mở và thực hiện **toàn bộ** đặc tả `FINTEEN_CH05_CODEX_SPEC.md` trong repo. Trước khi code, đọc `VisualNovelPlayer.jsx`, component mini-game chương 4, schema chapter 4 và `miniGameRules` để giữ tương thích. Tạo dữ liệu Chapter 5 + mini-game Compound Timeline 4 màn tương tác, cập nhật đăng ký game vào player và CSS responsive. Tuân thủ nguyên tắc Money không đổi khi chỉ lập kế hoạch, điểm gameplay không thay điểm năng lực, các phép tính/choice/stats/ending theo file đặc tả, lời thoại tự nhiên và gợi mở. Không tự thay các số liệu hay tạo quy định ngân hàng Việt Nam. Sau khi làm, chạy build/lint/tests có thể chạy được; báo cáo những file đã sửa và những điều chưa thể kiểm thử. Nếu thiếu asset dùng fallback, không tự phát minh file ảnh.
