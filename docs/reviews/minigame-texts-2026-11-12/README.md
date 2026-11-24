# Phần 2 — Khung mini-game đọc nội dung JSON

Thực hiện trực tiếp trên nhánh `dataiyeumenh`, theo yêu cầu của HA; không checkout `main` hoặc tạo `feat/minigame-texts`.

## Điều kiện triển khai bắt buộc

Đã đọc API nội dung công khai trong lúc thực hiện: bản phát hành **2.2.2** chưa có `requires` ở lựa chọn `CH02_SC04_CHOICE_A` và chưa có `marketText` ở CH08.

**Leader/BE phải phát hành JSON bổ sung trước khi triển khai mã mục 2.2 và 2.3.** Sau thay đổi này, lựa chọn không có `requires` không bị khóa; cảnh không có `marketText` được giữ nguyên. Không còn suy đoán bằng ID trong FE.

[JSON bàn giao CH02/CH05/CH08](../../../scripts/content-migrations/minigame-texts-2026-11-12.json) chứa các trường cần ghép vào lựa chọn/cảnh có cùng ID, không phải toàn bộ chương và không phải một bản đã phát hành. Chín câu CH08 được chuyển nguyên ý từ code cũ sang template. Không thay ID, đáp án hoặc công thức.

Không gửi duyệt, phát hành hoặc ghi bản TEST lên API. Việc kiểm tra Studio dùng API giả lập và JSON nháp trong bộ nhớ.

## Các mục đã thực hiện

| Mục | Thay đổi |
| --- | --- |
| 2.1 SAVINGS_RACE | Đọc `texts.eyebrow`, `heading`, `intro`, `howto`, `readyFeedback`, `winText`, `tagline`, `goalLabel`, `coinLabel`; đọc `coinImage`, `basketImage`; ghép danh sách cần tránh từ `expenses`. |
| 2.2 BUDGET_BUILDER | Đọc `texts.heading`, `boardTitle`, `boardSafe`, `passSummary`. Khóa chỉ đọc `option.requires.minFlexibleReserve`, `reserveZoneId` và `lockedReason`. |
| 2.3 CH08 | Chọn `scene.marketText.up/down/flat` theo lãi/lỗ thực tế của phương án phân bổ. Giữ nguyên tính thị trường, tiền, điểm và `scene.title`; không có template thì trả nguyên cảnh. |
| 2.4 CAREER_MATCH | Đọc `texts.steps`, `fitIntro`, `name`, `timeLabel`, `disclaimer`, `finish`. Các bước vẫn giữ ID `fit`/`calc`. |
| 2.5 NEED_WANT | Đọc `texts.heading`, `intro`, `tip`; giữ nguyên ID giỏ, category và cách chấm. |
| 2.6 Dùng chung | Đọc `inspect.eyebrow`, `subtitle`, `takeaway`, từng `cashflow.essentials/repayment`. CH05 nhận cả `scene` và đọc schema `planSummary` HA cung cấp trong chat. |
| 2.7 Mã chết | Xóa `ChapterFourMiniGame.jsx`, `chapterFourStory.js`, `features/internal/StoryPlayer.jsx` và bài kiểm thử chỉ dành cho mô hình chết này. CH04 hiện hành vẫn dùng SMART_SHOPPING. |

Mọi trường chữ/ảnh mới đều có nội dung cũ làm dự phòng. Nhãn kết thúc Career Match vẫn giữ “Hoàn tất Career Match” khi JSON chưa cung cấp `texts.finish`, theo yêu cầu giữ nguyên giao diện. Danh sách chi phí dùng dấu “và” như lời dẫn cũ. Một số đoạn dự phòng giữ nguyên các text node quanh số để ảnh không lệch do kerning của trình duyệt.

### CH05: schema chính thức HA cung cấp

Không dùng đề xuất `planSummary.texts` trong tài liệu ban đầu. Schema đã xác nhận là:

```json
{
  "planSummary": {
    "title": "Dự kiến cuối tháng 3",
    "cases": [
      { "flag": "term_maturity", "text": "B: nhận {amount}…", "values": { "amount": 1060000 } },
      { "flag": "account_choice_A", "text": "B: {amount}…", "values": { "amount": 1005000 } },
      { "flag": "topup_source_verified", "text": "A: {amount} + {gap}…", "values": { "amount": 992500, "gap": 7500 } },
      { "flag": "account_pending", "text": "A: {amount}, chờ {gap}…", "values": { "amount": 992500, "gap": 7500 } },
      { "text": "A: {amount}, thiếu {gap}…", "values": { "amount": 992500, "gap": 7500 } }
    ],
    "provider": { "flag": "provider_checked", "yes": "Đã kiểm tra.", "no": "Chưa kiểm tra." },
    "note": { "text": "Ví hiện tại vẫn là {wallet}.", "values": { "wallet": 1000000 } }
  }
}
```

Dùng phần tử đầu tiên có cờ đang bật; phần tử không có `flag` là mặc định và nên đặt cuối. Số trong `values` được định dạng tiền Việt, ví dụ `1060000` → `1.060.000đ`, rồi thay bằng hàm `fill` dùng chung. `planSummary: true` của nội dung cũ vẫn hoạt động với nguyên văn dự phòng. JSON bàn giao chứa đầy đủ câu, không chứa dấu ba chấm minh họa.

### Placeholder

- Savings: `intro`/`howto` nhận `{avoid}`, `{duration}`, `{goal}`; `readyFeedback`/`winText` nhận `{goal}`, `{duration}`.
- Career: `fitIntro`/`timeLabel` nhận `{name}` và `{hours}`.
- Khóa quỹ: `lockedReason` nhận `{amount}` đã định dạng tiền.
- CH08: `{bonds}`, `{equity}`, `{final}`, `{change}`, `{start}`. `change` là độ lớn tuyệt đối; câu mẫu quy định “tăng” hay “giảm”. `start` lấy từ `portfolio.startingAmount`.

## Chơi thử JSON trong Studio

Trước sửa, PlayDialog chỉ cho nhập điểm giả lập; nút chơi thử còn bị ẩn trong chế độ JSON. Để thực hiện bài kiểm tra của leader:

1. Player thật và Studio dùng chung registry `miniGameFrames.js`.
2. PlayDialog render mini-game thật với dữ liệu nháp. Kết quả chỉ cập nhật phiên chơi thử trong bộ nhớ, không gửi batch học tập.
3. “Chơi thử từ cảnh này” có trong cả chế độ cảnh lẫn JSON; JSON được parse riêng khi mở preview, không ghi đè hoặc lưu nháp.
4. Bộ kiểm tra trình duyệt đã thêm `texts.heading: "TEST …"` trong textarea JSON của NEED_WANT, BUDGET_BUILDER và SAVINGS_RACE, mở preview và xác nhận chữ mới hiển thị. Số request ghi API bằng **0**.

## Kiểm chứng

- `node --test tests/*.test.mjs`: **234 bài đạt** (trên PowerShell truyền danh sách tệp cụ thể).
- `npx vite build`: đạt; còn cảnh báo kích thước chunk và import động đã có trước.
- ESLint các tệp nguồn/fixture thay đổi: đạt.
- `node tests/minigame-texts-browser.mjs`: **4/4 kịch bản đạt**. Bài JSON overrides chơi đúng CH01/CH02/CH03, kiểm tra coin/basket, thắng/reset, chữ sau chấm Budget/Career và preview Studio. Các bài tự chơi CH05/CH06/CH08 đều đạt Ending A, không lỗi JS và không tràn khung.
- Hai kiểm thử CH08 ban đầu đang sai do chưa cập nhật theo quyền subscription và khóa tiến trình theo người dùng. Đã cập nhật kỳ vọng tương ứng. Fixture trình duyệt dùng cùng `resolveContentImages` như màn chơi thật; kiểm tra menu CH05 theo giao diện hiện hành.

### Ảnh trước/sau

Ảnh chụp cùng JSON fixture, kích thước **1440×1600**, seed cố định, tắt animation. Đây là so sánh trạng thái mở đầu của từng khung; luồng chơi và chấm điểm được kiểm tra riêng. **11/11 cặp ảnh giống từng pixel**: [comparison.json](comparison.json).

| Khung | Trước | Sau |
| --- | --- | --- |
| CH01 NEED_WANT | [Trước](before/need-want.png) | [Sau](after/need-want.png) |
| CH02 SAVINGS_RACE | [Trước](before/savings.png) | [Sau](after/savings.png) |
| CH02 BUDGET_BUILDER | [Trước](before/budget.png) | [Sau](after/budget.png) |
| CH03 CAREER_MATCH | [Trước](before/career.png) | [Sau](after/career.png) |
| CH05 COMPOUND_TIMELINE | [Trước](before/compound.png) | [Sau](after/compound.png) |
| CH06 LOAN_DETECTIVE | [Trước](before/loan.png) | [Sau](after/loan.png) |
| CH08 portfolio | [Trước](before/portfolio.png) | [Sau](after/portfolio.png) |
| CH08 claims | [Trước](before/claims.png) | [Sau](after/claims.png) |
| CH08 planner | [Trước](before/planner.png) | [Sau](after/planner.png) |
| Sổ tay dòng tiền CH06 | [Trước](before/cashflow.png) | [Sau](after/cashflow.png) |
| Tóm tắt kế hoạch CH05 | [Trước](before/plan-summary.png) | [Sau](after/plan-summary.png) |

Ảnh không thay thế việc xác nhận JSON mới đã được leader phát hành trước triển khai FE. Không tạo PR, không merge hoặc phát hành từ phiên làm việc này.
