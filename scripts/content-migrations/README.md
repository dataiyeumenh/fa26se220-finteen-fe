# Bàn giao nội dung mini-game — 12/11/2026

[`minigame-texts-2026-11-12.json`](minigame-texts-2026-11-12.json) là **patch theo ID**, không phải chương hoàn chỉnh và không phải script tự phát hành. Ghép các thuộc tính vào lựa chọn/cảnh tương ứng, giữ nguyên mọi thuộc tính khác.

## Điều kiện triển khai

Bản nội dung công khai được kiểm tra trong lúc làm task là **2.2.2**: chưa có `requires` cho lựa chọn dùng quỹ dự trù CH02 và chưa có `marketText` CH08.

Leader/BE cần phát hành hai nhóm trường này **trước khi merge/triển khai FE**:

1. CH02: `CH02_SC04_CHOICE_A.requires = { minFlexibleReserve: 200000, reserveZoneId: "emergency_buffer" }` cùng `lockedReason`.
2. CH08: đủ `marketText.up/down/flat` của chín cảnh trong patch. Câu chữ giữ nguyên từ code cũ, chỉ thay các số bằng placeholder.

Không có `requires` thì FE không tự khóa theo ID nữa. Không có `marketText` thì FE giữ nguyên `scene.text`. Công thức thị trường, điểm và tiền không đổi.

## Hợp đồng đọc dữ liệu

- SAVINGS_RACE: `game.texts.{eyebrow,heading,intro,howto,readyFeedback,winText,tagline,goalLabel,coinLabel}`, `game.coinImage`, `game.basketImage`. Các món cần tránh lấy từ `game.expenses`.
- BUDGET_BUILDER: `game.texts.{heading,boardTitle,boardSafe,passSummary}`. Khóa đọc `option.requires.{minFlexibleReserve,reserveZoneId}` và `option.lockedReason`.
- CAREER_MATCH: `game.texts.{steps,fitIntro,name,timeLabel,disclaimer,finish}`; `steps` là mảng hai nhãn. `fitIntro`/`timeLabel` hỗ trợ `{name}`, `{hours}`.
- NEED_WANT: `game.texts.{heading,intro,tip}`.
- Sổ tay: `inspect.{eyebrow,subtitle,takeaway}`; từng phần tử `cashflows` có `income`, `essentials`, `repayment`.
- CH08: `scene.marketText.{up,down,flat}` hỗ trợ `{bonds}`, `{equity}`, `{final}`, `{change}`, `{start}`. Nhánh theo lãi/lỗ của phân bổ thực tế; `start` từ `portfolio.startingAmount`. `scene.title` được giữ nguyên.

CH05 dùng **schema HA cung cấp sau tài liệu gốc**, thay cho đề xuất `scene.planSummary.texts`:

```json
{
  "planSummary": {
    "title": "Dự kiến cuối tháng 3",
    "cases": [
      { "flag": "term_maturity", "text": "Nhận {amount}…", "values": { "amount": 1060000 } },
      { "text": "Thiếu {gap}…", "values": { "gap": 7500 } }
    ],
    "provider": { "flag": "provider_checked", "yes": "Đã kiểm tra.", "no": "Chưa kiểm tra." },
    "note": { "text": "Ví: {wallet}.", "values": { "wallet": 1000000 } }
  }
}
```

Chọn case đầu tiên có cờ đúng; case không có cờ đặt cuối làm mặc định. Các số trong `values` được định dạng tiền Việt rồi thay bằng `fill`. Patch kèm đủ năm case và đầy đủ nội dung, không có dấu ba chấm minh họa. `planSummary: true` cũ vẫn hiển thị nguyên văn dự phòng.

## Kiểm chứng và preview

- `node --test tests/*.test.mjs`: bộ kiểm thử đơn vị/tích hợp, bao gồm 441 tổ hợp thị trường với hai phân bổ, ngưỡng quỹ, schema CH05 và các trường chữ mới. PowerShell cần truyền danh sách tệp bằng `Get-ChildItem`/`ForEach-Object` nếu Node chưa hỗ trợ glob.
- `node tests/minigame-texts-browser.mjs`: dùng Chrome cục bộ (hoặc đặt `BROWSER_EXECUTABLE`), chơi CH01/CH02/CH03, kiểm tra chữ sau chấm điểm và dùng Studio sửa JSON thành TEST rồi preview **không lưu**; chạy tiếp fixture CH05/CH06/CH08. Không dùng tài khoản/API thật.
- `npx vite build`: kiểm tra bản build và xóa ba tệp chết. Test chỉ dành cho code chết cũng được xóa; CH04 hiện tại vẫn dùng SMART_SHOPPING.

Studio hiện render cùng khung mini-game với player. Nút chơi thử dùng bản JSON đang gõ, có trong cả chế độ cảnh và JSON; dữ liệu preview không được lưu hoặc gửi kết quả học tập.

Bộ ảnh trước/sau (11 cặp, giống từng pixel) và báo cáo so sánh có tại `docs/reviews/minigame-texts-2026-11-12/` trong workspace. `docs/` và `output/` đang được dự án gitignore; dùng ảnh tại đây để đính kèm khi gửi PR. Không cần thêm ảnh mẫu 4,7 MB vào bundle ứng dụng.
