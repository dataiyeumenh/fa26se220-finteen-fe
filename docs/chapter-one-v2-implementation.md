# Chapter 1 v2 — Hướng dẫn triển khai

## Tạo sẵn (Đã hoàn thành)

✅ **JSON Config**: [src/pages/User/Dashboard/data/chapter1V2VisualNovel.js](src/pages/User/Dashboard/data/chapter1V2VisualNovel.js)
- 18 scenes tuyến tính
- 3 lựa chọn chính ở Scene 2 (s2-choice)
- 3 endings riêng (A/B/C)
- Mini-game "needs-or-wants" tích hợp
- Stat effects theo GDD

✅ **Runtime Adapter**: [src/pages/User/Dashboard/data/chapter1V2RuntimeAdapter.js](src/pages/User/Dashboard/data/chapter1V2RuntimeAdapter.js)
- Hàm `loadChapter1V2RuntimeData()` để load config
- Sẵn sàng integrate vào UserGames.jsx

---

## Bước tiếp theo: Enable config mới

### 1. Import vào UserGames.jsx

```jsx
import { loadChapter1V2RuntimeData } from "./data/chapter1V2RuntimeAdapter";
```

### 2. Dùng V2 làm phiên bản duy nhất

```jsx
const isChapterOne = chapterId === "1";
const isChapterTwo = chapterId === "2";

useEffect(() => {
  const loadRuntime = async () => {
    try {
      const runtimeData = isChapterOne
        ? await loadChapter1V2RuntimeData()
        : isChapterTwo
          ? await loadChapter2V2RuntimeData()
          : null;
      
      setGameData(runtimeData);
    } catch (err) {
      setRuntimeError(err?.message || "Lỗi khi tải game");
    }
  };

  if (isChapterOne || isChapterTwo) loadRuntime();
}, [isChapterOne, isChapterTwo]);
```

### 3. Test

- URL chính: `/dashboard/demo/play?chapter=1` → dùng Chapter 1 v2

---

## Cấu trúc JSON Config

### A. Scenes (18 cảnh)

| Scene ID | Type | Mục đích |
|----------|------|---------|
| s1-opening | scene-art | An hoàn thành dự án |
| s1-money-gift | dialogue | Mẹ trao tiền |
| s1-money-explanation | dialogue | An hỏi dùng tiền làm gì |
| s1-goal-setting | dialogue | Mẹ giải thích mục tiêu (300.000đ ngày 28) |
| s1-intentional-spending | dialogue | Kết luận: 200.000đ còn lại |
| **s2-opening** | scene-art | Minh rủ mua tai nghe |
| s2-temptation | dialogue | An: tail nghe hiện tại vẫn tốt |
| s2-peer-pressure | dialogue | Minh: "Ai cũng mua thôi!" |
| **s2-choice** | dialogue | **LỰA CHỌN CHÍNH** (3 option) |
| s3-buy-now | scene-art | Nhánh A: An lo lắng vì thiếu tiền |
| s3-wait-compare | scene-art | Nhánh B: An suy nghĩ |
| s3-goal-first | scene-art | Nhánh C: An nhẹ nhõm |
| ending-a/b/c | ending | 3 kết thúc khác nhau |

### B. Stat Effects (Effects của mỗi lựa chọn)

```js
// Lựa chọn A: Mua ngay
effects: {
  WEALTH: -6,
  SAVINGS: -5,
  HAPPINESS: +5,
  GOAL: -6,
}

// Lựa chọn B: Chờ một tuần
effects: {
  SAVINGS: +5,
  GOAL: +6,
  HAPPINESS: -2,
}

// Lựa chọn C: Ưu tiên mục tiêu
effects: {
  SAVINGS: +2,
  HAPPINESS: +3,
  GOAL: +3,
}
```

### C. Mini-game: Needs or Wants

```js
miniGame: {
  type: "needs-or-wants",
  items: [6 thẻ],  // meal, bus, art-class, replacement-hp, upgrade-hp, deco
  trigger: "s3-*", // Chạy sau khi chọn lựa chọn
  rewards: {
    correct: { FIQ: +2, GOAL: +1 },
  }
}
```

---

## Có cần GDD không?

**Không bắt buộc** để triển khai phiên bản cơ bản. Tôi đã sử dụng:
- Script thoại từ GDD
- Stat effects từ GDD
- 3 endings từ thiết kế

**CÓ CẦN** GDD nếu bạn muốn:
- Thêm conditional dialogues dựa trên stats
- Flags xuyên chương (F_GOAL_SERIOUS, F_PEER_PRESSURE, v.v.)
- Thay đổi minigame dựa trên stats
- 6 endings phức tạp thay vì 3 ending hiện tại
- Kiểm tra điều kiện mở/khóa lựa chọn

---

## Cách dùng GDD (nếu cần)

1. Đọc section "Chapter 1" trong GDD v2/v3
2. Tra bảng "Flags" để xem điều kiện
3. Tra bảng "Endings" để xem threshold cho 6 endings
4. Sửa `chapter1V2GameData.scenes` thêm `condition` field nếu cần

Ví dụ:

```js
{
  id: "s2-special-dialogue",
  type: "dialogue",
  condition: {  // ← Thêm từ GDD
    field: "SAVINGS",
    operator: ">=",
    value: 50,
  },
  speaker: "AN",
  text: "Mình đã tiết kiệm được 500.000đ!",
}
```

---

## Checklist triển khai

- [ ] Import `loadChapter1V2RuntimeData` vào UserGames.jsx
- [x] Dùng Chapter 1 v2 làm phiên bản duy nhất
- [ ] Test URL `/dashboard/demo/play?chapter=1`
- [ ] Kiểm tra 3 nhánh lựa chọn
- [ ] Kiểm tra mini-game "needs-or-wants"
- [ ] Kiểm tra 3 endings
- [ ] (Optional) Đọc GDD để thêm logic nâng cao

---

## Ghi chú

- Config này là **tuyến tính** (não sau mỗi lựa chọn hội tụ lại ở 1 scene reflection)
- Asset paths dùng `/images/finteen-v2/chapter-01/` (v2 mới)
- Scenes được đánh số sn1-*, s2-*, s3-* để dễ track
- `uiDisplay` fields dùng để gợi ý UI panel (cash, goal, etc.)
