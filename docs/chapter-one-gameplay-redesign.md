# Thiết kế lại gameplay chương 1 — Tiền đầu tiên

## Mục tiêu

Dựa trên cốt truyện trong README assets và GDD, Chapter 1 nên là một visual novel ngắn với 3 scene chính và 1 mini-game độc lập, tập trung vào bài học: cần và muốn, mục tiêu tiết kiệm, và kiên nhẫn chờ để đạt mục tiêu.

Nội dung tâm điểm:
- An nhận 500.000đ từ mẹ.
- Minh rủ mua tai nghe mới giá 250.000đ.
- An phải cân nhắc giữa mua ngay và giữ tiền cho lớp vẽ 300.000đ vào ngày 28.
- Hệ thống phản hồi bằng lựa chọn, mini-game phân loại needs vs wants, và kết thúc theo hành vi của người chơi.

---

## 1. Tông màu và nhịp cảm xúc

- Thể loại: visual novel + narrative choice + mini-game nhẹ.
- Tông cảm xúc: ấm, gần gũi, thực tế, không căng thẳng quá mức.
- Nhịp: 
  1. Mở cảnh: nhận tiền và cảm giác tự do.
  2. Căn nhắn: rủ mua tai nghe, tạo kích thích.
  3. Gặp rào cản: cần tiền cho lớp vẽ.
  4. Quyết định và phản hồi: chi / hoãn / so giá.
  5. Kết thúc: đối thoại và biểu cảm An, mẹ.

---

## 2. Flow gameplay đề xuất

### Scene 1 — Nhận tiền và xác định ưu tiên

Asset sử dụng:
- Background: `bg/bg01-living-room-afternoon.png`
- Close-up background: `bg/bg01c-family-table.png`
- Characters: `char/an/an-neutral.png`, `char/me/me-neutral.png`
- Prop: `props/allowance-envelope.png`

Mục tiêu:
- Giới thiệu khung tiền: An nhận 500.000đ.
- Khẳng định mục tiêu: 300.000đ cho lớp vẽ ngày 28.
- Đặt nền cho học thuyết: tiền có mục đích, không phải để tiêu xài vô tội vạ.

Luồng:
- Cảnh mở: An đang ở nhà, nhận phong bì từ mẹ.
- Mẹ giải thích: “Tiền này có thể dùng cho nhu cầu, nhưng cũng phải giữ cho mục tiêu.”
- Người chơi thấy số tiền và mục tiêu trong UI.
- Chọn tiếp tục vào scene 2.

UI hiển thị:
- Số dư hiện có: 500.000đ
- Mục tiêu: 300.000đ
- Ngày: 28
- Ghi chú: “Đừng tiêu trước khi đặt mục tiêu.”

---

### Scene 2 — Món đồ đang giảm giá

Asset sử dụng:
- Background: `bg/bg02-headphone-shop.png`
- Close-up: `bg/bg02b-headphone-display.png`
- Characters: `char/an/an-neutral.png`, `char/minh/minh-inviting.png`
- Scene art: `scene/sc02-headphone-temptation.png`

Mục tiêu:
- Tạo áp lực mua sắm và cảm giác “thích mua ngay”.
- Minh là người khơi gợi, An còn lưỡng lự.
- Không cần dạy quá nhiều, chỉ cần làm rõ 3 lựa chọn chính.

Luồng:
- Minh giới thiệu mẫu tai nghe mới, giá “250.000đ”.
- Hệ thống nêu rõ: hiện tại tai nghe cũ vẫn còn dùng được.
- Người chơi có thể:
  - Mua ngay
  - So sánh giá và chờ
  - Chia tiền cho mục tiêu

Dữ kiện gợi ý trong lựa chọn:
- Mua ngay: dễ thỏa mãn, nhưng thiếu tiền cho lớp vẽ.
- So sánh và chờ: giữ chiến lược, giảm nguy cơ hối tiếc.
- Đặt mục tiêu trước: khả năng đúng với thu nhập và kế hoạch.

---

### Scene 3 — Kiểm tra nhu cầu và mục tiêu

Asset sử dụng:
- Background: `bg/bg01b-study-corner.png`
- Scene art: `scene/sc03-checking-priorities.png`
- Characters: `char/an/an-thinking.png`, `char/an/an-relieved.png`, `char/an/an-worried-money.png`, `char/me/me-explaining.png`, `char/me/me-concerned.png`

Mục tiêu:
- Chốt bài học: cần và muốn không phải đồng nghĩa; mục tiêu phải được đặt trước.
- Chuyển từ suy nghĩ sang hành động bằng mini-game.

Luồng:
- An ngồi học, xem lại danh sách chi tiêu cần thiết và các món không cần thiết.
- Mẹ nhắc nhở mục tiêu lớp vẽ của An.
- Chuyển sang mini-game `Needs vs Wants`.

---

## 3. Script thoại chi tiết (từ GDD, chuẩn hóa cho An/Mẹ)

### Scene 1 — Nhận tiền từ mẹ

**Background**: `bg/bg01-living-room-afternoon.png` → `bg/bg01c-family-table.png`  
**Nhân vật**: An (neutral), Mẹ (explaining)  
**Prop**: `props/allowance-envelope.png`

```
[Cảnh mở: An ngồi ở phòng khách, mẹ đi lại]

MẸ: "Con có hoàn thành dự án của trường rồi không?"

AN: "Rồi ạ! Hoàn thành được."

MẸ: "Tốt lắm. Mẹ có điều muốn nói với con về tiền." 
[Mẹ trao cho An phong bì]

MẸ: "Đây là 500.000đ. Con làm việc tốt, mẹ muốn con biết tiền là gì."

AN: [Nhìn phong bì] "Vâ... nhưng con sẽ dùng 500.000đ để làm gì ạ?"

MẸ: "Tiền là của con. Trước khi mua cái gì, con hãy thử nghĩ xem con đang đánh đổi điều gì. 
Ví dụ, con có lớp vẽ vào ngày 28, phí là 300.000đ. 
Con cần giữ đủ tiền cho lớp vẽ, rồi mới dùng tiền còn lại cho nhu cầu khác."

AN: "Vậy là con chỉ có 200.000đ để dùng cho những cái khác à?"

MẸ: "Đúng là vậy. Hãy dùng tiền có chủ đích."

[UI hiển thị: Tiền mặt 500.000đ | Mục tiêu 300.000đ | Hạn chót 28]
[Người chơi chọn tiếp tục →]
```

---

### Scene 2 — Minh rủ mua tai nghe

**Background**: `bg/bg02-headphone-shop.png` → `bg/bg02b-headphone-display.png`  
**Nhân vật**: An (neutral/thinking), Minh (inviting)  
**Prop/Asset**: Hình tai nghe (từ mini-game)

```
[Cảnh chuyển: Cửa hàng phụ kiện, An đi cùng Minh]

MINH: "An ơi, mình tìm được tai nghe đang giảm giá! 
Hôm nay mới còn 250 nghìn, ngày bình thường 500 nghìn đó!"

AN: "Ờm... nhưng tai nghe của mình hiện tại vẫn dùng được mà."

MINH: "Ai cũng đang mua loại này thôi! 
Mình nên mua luôn đi, không biết khi nào hết hàng."

AN: [Suy nghĩ] "Mình biết là thích rồi, nhưng mình còn cần tiền cho lớp vẽ. 
Mình chưa chắc đã cần thiết ngay bây giờ..."

[Lựa chọn xuất hiện:]
├─ A. Mua ngay (250.000đ)
├─ B. Chờ một tuần để so sánh
└─ C. Ưu tiên mục tiêu trước
```

---

### Scene 3 — Kiểm tra lại kế hoạch (Reflection)

**Background**: `bg/bg01b-study-corner.png`  
**Nhân vật**: An (thinking/relieved/worried tùy lựa chọn), Mẹ (explaining/concerned)  
**Kích hoạt**: Sau khi người chơi chọn lựa chọn ở Scene 2

**Nếu chọn A (Mua ngay):**
```
[An ngồi ở bàn học, nhìn lại tiền còn lại]

AN: [Biểu cảm lo lắng] "Ơi không... mình vừa mua tai nghe hết 250.000đ. 
Mình còn 250.000đ, nhưng mục tiêu lớp vẽ cần 300.000đ!"

MẸ: [Đi lại, quan tâm] "Con đã mua cái tai nghe à?"

AN: "Vâng ạ... nhưng bây giờ mình thiếu 50.000đ cho lớp vẽ!"

MẸ: "Mỗi lần mua là một lần đánh đổi. 
Con vừa chọn mua theo cảm xúc, và bây giờ con mất mục tiêu quan trọng hơn. 
Lần sau, hãy lập kế hoạch trước khi mua."

[Stat update: WEALTH -6, SAVING -5, HAPPINESS +5, GOAL -6]
[Ending C: Vỡ kế hoạch]
```

**Nếu chọn B (Chờ một tuần):**
```
[An ngồi ở bàn học, vẫn có phong bì đầy]

AN: [Suy nghĩ] "Mình quyết định chờ một tuần. 
Không cần phải mua ngay để biết mình muốn gì."

MẸ: "Tốt lắm! Con đã cân nhắc kỹ trước khi quyết định. 
Điều gì xảy ra bây giờ?"

AN: "Mình nghĩ mình có thể so sánh giá, hoặc tìm mẫu khác rẻ hơn."

MẸ: "Chính xác. Chờ không có nghĩa là từ bỏ. 
Nó có nghĩa là con dành thời gian để chọn thông minh hơn."

[Stat update: SAVING +5, GOAL +6, HAPPINESS -2]
[Ending B: Cân bằng]
```

**Nếu chọn C (Ưu tiên mục tiêu):**
```
[An ngồi ở bàn học, kiểm tra danh sách chi tiêu]

AN: [Biểu cảm nhẹ nhõm] "Mình quyết định sẽ giữ 300.000đ cho lớp vẽ. 
Còn 200.000đ, mình có thể dùng cho những cái khác hoặc để dành thêm."

MẸ: [Vỗ vai con] "Con đã chọn đúng. 
Tiền không chỉ để chi, mà để phục vụ mục tiêu của con."

AN: "Vâng ạ. Mình sẽ mua khi thật sự cần hoặc có kế hoạch rõ."

MẸ: "Đó là tư duy người lớn. Mẹ tự hào về con."

[Stat update: SAVING +2, HAPPINESS +3, GOAL +3]
[Ending A: Kiểm soát tốt]
```

---

## 4. Mini-game đề xuất: Needs vs Wants

Tên: `Needs or Wants`

### Mục tiêu
Phân loại 6 thẻ thành 2 nhóm:
- Cần thiết (Needs)
- Muốn có (Wants)

### Thẻ dùng
Dùng các file asset hiện có:
- `01-meal.png` → Needs
- `02-bus-ticket.png` → Needs
- `03-art-class-booking.png` → Needs / mục tiêu bắt buộc
- `04-replacement-headphones.png` → Needs (nếu giả định tai nghe cũ hỏng)
- `05-upgrade-headphones.png` → Wants
- `06-desk-decoration.png` → Wants

### Cách chơi
- Người chơi kéo thẻ vào 2 cột: “Cần” và “Muốn”.
- Mỗi thẻ được đánh giá theo bối cảnh và văn bản đi kèm.
- Không gán đáp án cứng dựa vào hình thuần túy; lời dẫn và tiêu đề thẻ phải giúp người chơi nhận diện đúng vào tình huống xác định.
- Sau khi xếp xong, hệ thống tính điểm:
  - Đúng cần/wants: +1 điểm học tập
  - Sai: gợi ý phản hồi nhanh

### Mục tiêu giáo dục
- Người chơi hiểu: mua sắm không phải chỉ là “thích là mua”.
- Cần biết xác định trước “mục tiêu” và “bản chất chi tiêu”.
- Trong Chapter 1, bài học không phải “không được mua” mà là “mua đúng lúc, đúng mục đích”.

---

## 4. Logic quyết định và kết thúc

### Lựa chọn chính ở Scene 2

#### A. Mua ngay
- Giá: 250.000đ
- Số tiền còn lại: 250.000đ
- Thiếu: 50.000đ so với mục tiêu 300.000đ
- Kết quả: An lo lắng, biểu cảm `an-worried-money.png`
- Stat gợi ý:
  - WEALTH: -6
  - SAVING: -5
  - HAPPINESS: +5
  - GOAL: -6
- Endings phù hợp: Ending C hoặc kết thúc “vỡ kế hoạch”

#### B. So sánh giá và chờ 1 tuần
- Chưa quyết định ngay
- Có thời gian để suy nghĩ và điều chỉnh
- Kết quả: An suy nghĩ, biểu cảm `an-thinking.png`
- Stat gợi ý:
  - SAVING: +5
  - GOAL: +6
  - HAPPINESS: -2
- Endings phù hợp: Ending B, tâm thế cân bằng hơn

#### C. Đặt mục tiêu trước, không mua ngay
- Chốt giá trị mục tiêu của lớp vẽ
- Nhấn mạnh “mua khi đủ tiền hoặc có kế hoạch rõ"
- Kết quả: An nhẹ nhõm, biểu cảm `an-relieved.png`
- Stat gợi ý:
  - SAVING: cao
  - GOAL: cao
  - HAPPINESS: ổn định
- Endings phù hợp: Ending A, hành vi tiết kiệm và biết ưu tiên

---

## 5. Kết quả và ending

### Ending A — Kiểm soát tiền tốt
- An không mua ngay, giữ tiền cho mục tiêu.
- Mẹ hài lòng, An thấy tự tin.
- Hồi kết: “Tiền không chỉ để chi, mà để phục vụ mục tiêu.”

### Ending B — Cân bằng và suy nghĩ
- An chưa mua ngay, nhưng đã cân nhắc kỹ.
- Có thể chờ hoặc tìm giải pháp thay thế.
- Hồi kết: “Đề phòng mua theo cảm xúc, nhưng vẫn cho phép suy nghĩ.”

### Ending C — Mua theo cảm xúc
- An mua ngay và phát hiện thiếu tiền cho lớp vẽ.
- Mẹ nhắc lại mục tiêu và cách thức quản lý tiền.
- Hồi kết: “Mua theo cảm xúc dễ khiến bạn mất mục tiêu.”

---

## 6. Thiết kế UI và bố cục cảnh

### Layout chung
- Nền 16:9, `object-fit: cover`
- Nhân vật: `object-fit: contain`, đặt dưới khu vực thoại
- Chừa phần dưới cho hộp thoại và các nút lựa chọn
- Mỗi cảnh chỉ có tối đa 2 nhân vật chính trong khung để tránh rối

### Panel thông tin
- Số dư/tiền mặt
- Mục tiêu / kế hoạch
- Hạn chót / ngày 28
- Mức độ lựa chọn: `Mua ngay`, `Chờ`, `Ưu tiên mục tiêu`

### Chữ và số
- Không ghi vào ảnh nền; hiển thị bằng UI
- Số lượng cần thay đổi theo lựa chọn người chơi

---

## 7. Khuyến nghị triển khai kỹ thuật

### State
```js
{
  money: 500000,
  goal: 300000,
  date: 28,
  choice: null,
  stat: {
    wealth: 0,
    saving: 0,
    happiness: 0,
    goal: 0,
    risk: 0,
    financialIq: 0
  }
}
```

### Mô hình flow
```text
Scene 1 -> Scene 2 -> Choice -> Scene 3 -> Mini-game -> Ending
```

### Quy tắc ưu tiên khi render
- Nếu lựa chọn là mua ngay → render `an-worried-money` và cảnh `scene/sc03-checking-priorities.png`
- Nếu lựa chọn là chờ → render `an-thinking.png`
- Nếu lựa chọn là ưu tiên mục tiêu → render `an-relieved.png`

---

## 8. Kết luận

Chapter 1 nên được thiết kế là một bài học tài chính rất gần gũi, không quá phức tạp nhưng có đủ trọng tâm:
- Tiền không phải chỉ để chi.
- Mỗi khoản chi đều có cơ hội chi phí (opportunity cost).
- Mục tiêu cần được đặt trước, trước khi cảm xúc mua sắm xuất hiện.

Với bộ sprite và asset mới đã chuẩn bị, gameplay nên tập trung vào 3 yếu tố chính:
1. Câu chuyện gần gũi và dễ hiểu.
2. Lựa chọn có thật, không cứng nhắc.
3. Mini-game phân loại `Needs vs Wants` để củng cố kiến thức.

Đây là cấu trúc tốt nhất để Chapter 1 vừa có cảm xúc, vừa truyền tải tri thức tài chính một cách tự nhiên.
