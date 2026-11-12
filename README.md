# FinTeen — bản đồ dự án và hướng dẫn bàn giao cho AI

> Đọc file này trước khi sửa game. Đây là điểm vào kỹ thuật; tài liệu ảnh An/Minh nằm tại [`public/images/finteen-v2/README.md`](public/images/finteen-v2/README.md), còn mục lục nguồn nằm tại [`docs/README.md`](docs/README.md).

## Nội dung game hiện tại

`KidGames` tải chương từ API theo phiên bản phát hành qua `src/api/content.api.js`. Không coi asset cũ trong `public` là bằng chứng nội dung đó đang chạy. Xem [sơ đồ kiến trúc và luồng game](docs/diagrams/README.md).

Các chương là **tình huống độc lập**; mỗi chương khởi tạo tuổi, tiền, mục tiêu và cờ tình huống của riêng mình. README asset mô tả cách ghép hình; lời thoại, số tiền và điều kiện nhánh phải theo dữ liệu chương đã được duyệt.

## Thứ tự đọc bắt buộc cho AI triển khai

1. Đọc file này để biết kiến trúc và ranh giới nội dung.
2. Đọc [`docs/README.md`](docs/README.md) để chọn đúng nguồn sự thật.
3. Đọc [`public/images/finteen-v2/README.md`](public/images/finteen-v2/README.md) để hiểu loại ảnh, thứ tự layer và contract dữ liệu.
4. Đọc `public/images/finteen-v2/chapter-NN/README.md` của chương cần làm; làm đúng bảng **Công thức lắp cảnh**.
5. Đối chiếu dữ liệu chương từ API và source đang được import để xác định lời thoại, điều kiện nhánh và asset thực tế. Khi nguồn mâu thuẫn, ghi rõ điểm chưa xác nhận.
6. Chỉ sau đó mới nối vào player, state, route và persistence hiện có.

## Kiến trúc code liên quan

- `src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx`: player visual novel hiện tại.
- `src/pages/Kid/Dashboard/KidGames.jsx` và `src/api/content.api.js`: tải chương theo phiên bản phát hành.
- `src/pages/Kid/Dashboard/components/game/visualNovelProgress.js`: checkpoint trong trình duyệt.
- `src/pages/Kid/Dashboard/components/game/playBatch.js`: gửi kết quả cuối chương qua API khi có phiên SLOT hợp lệ.
- `public/images/finteen-v2`: asset An/Minh và hướng dẫn ghép hình.
- `src/features/internal`: layout và phân quyền portal nội bộ. `src/features/studio`: các màn/API chương, duyệt, phát hành, tài nguyên, câu hỏi và khóa AI; dùng phiên ACCOUNT hiện có. Hướng dẫn và ma trận quyền tại [`docs/STUDIO.md`](docs/STUDIO.md).

## Contract tối thiểu khi biến một chương v2 thành game

Mỗi beat nên có dữ liệu thay vì JSX hard-code:

```js
{
  id: "CH01_SC01_B01",
  mode: "dialogue", // cutscene | dialogue | inspect | choice | minigame | result | reflection
  background: "/images/finteen-v2/chapter-01/bg/bg01-living-room-afternoon.png",
  cutscene: null,
  actors: [
    { id: "me", sprite: ".../me-explaining.png", side: "left", active: true },
    { id: "an", sprite: ".../an-neutral.png", side: "right", active: false }
  ],
  props: [{ id: "allowance", image: ".../props/allowance-envelope.png" }],
  dialogue: { speaker: "Mẹ", text: "..." },
  uiFacts: [{ label: "Khoản nhận", value: 500000, unit: "VND" }],
  choices: [], effects: [], next: "CH01_SC01_B02"
}
```

Các trường tiền phải là số nguyên VND trong state; format dấu chấm chỉ ở UI. Điểm kỹ năng, `Money` của hồ sơ và số tiền giả lập trong bài học là ba loại dữ liệu khác nhau. Một phép tính, thẻ kéo thả hay số dư dự kiến không được tự biến thành giao dịch thật.

## Quy tắc dựng hình không được vi phạm

Thứ tự lớp từ sau ra trước: `background` → lớp tối/ánh sáng → `scene` **hoặc** `sprites + props` → UI mini-game → hộp thoại/HUD → modal kết quả. `scene/*.png` là tranh 16:9 đã chứa nhân vật; khi hiện nó phải ẩn sprite và prop trùng. `bg/*.png` là nền trống dùng cho hội thoại/tương tác. `char` và phần lớn `props`, `asset-mini-game` là PNG alpha, dùng `contain`, không crop và không kéo méo.

- Nền: full viewport, `object-fit: cover`, giữ tâm vùng hành động.
- Sprite: căn theo chân trên cùng một baseline; giới hạn chiều cao bằng viewport, không dùng scale để biểu thị tuổi.
- Hộp thoại: nằm dưới nhưng không che mặt/tay/vật đang được giải thích; ảnh đã chủ ý chừa vùng này.
- Chữ, số tiền, lịch, lãi suất, đáp án đúng và trạng thái chọn phải là HTML/UI, không đọc từ pixel và không ghi đè vĩnh viễn lên PNG.
- Một thời điểm chỉ có một nguồn kể hành động: tranh scene hoặc sprite ghép trên background, không hiển thị cả hai.

## Vòng đời chuẩn của một cảnh

`enter` khởi tạo background và dữ kiện → `cutscene` hiện tranh scene ngắn → `dialogue` trở về background + sprite → `inspect/choice/minigame` ẩn bớt sprite để đủ chỗ → `result` áp dụng effect đúng một lần → `reflection` giải thích hậu quả → `exit` lưu checkpoint rồi sang cảnh kế.

Khi tải lại checkpoint, không được áp dụng lại tiền/điểm/effect. Mọi lựa chọn phải có ID ổn định, lưu được và khôi phục đúng biểu cảm, nhánh, số dư và bước mini-game.

## Điều kiện hoàn thành một chương

- Tất cả asset trong README chương được dùng đúng vai hoặc được ghi rõ là dự phòng.
- Mọi scene có đường vào/ra; không có nút cụt, asset 404 hoặc nhánh không hội tụ.
- Đúng nhân vật, tuổi, trang phục và bối cảnh của chương; không kéo state tình huống khác sang.
- Phép tính, điều kiện ending và effect được test bằng dữ liệu, không suy từ tên ảnh.
- Có keyboard focus, alt text theo hành động, nút bỏ qua animation và giao diện dùng được ở màn hình nhỏ.
- Chạy các test hiện có bên dưới và `npm run build`; chơi tay toàn bộ nhánh, refresh giữa cảnh và kiểm tra không nhân đôi effect.

## Chạy dự án

### Ảnh trong bản deploy

`npm run build` chỉ chép ảnh được tham chiếu trong `src/`, `index.html` hoặc
`scripts/production-content-assets.json` vào `dist`. Ảnh ghép đường dẫn động
(bản đồ, thư mục sprite Savings Race) cũng được giữ. Các tài nguyên ngoài
`public/images/` vẫn được chép đầy đủ. `npm run dev` tiếp tục phục vụ toàn bộ
`public`; không xóa ảnh gốc hoặc thay đổi dữ liệu trên backend.

Danh sách ảnh từ backend đã đối chiếu với cả 8 chương của release `2.0.0`.
Khi backend phát hành nội dung mới có thay đổi ảnh local, cần cập nhật danh sách
và deploy frontend cùng đợt, trước khi người chơi chuyển sang nội dung đó:

```bash
npm run audit:assets -- --refresh-content --api-base=https://kidzeconomy.com.vn/finteen
node --test tests/production-assets.test.mjs
npm run build
```

Commit file `scripts/production-content-assets.json` sau khi cập nhật. Build dùng
danh sách đã commit nên không phụ thuộc kết nối backend. Nếu release mới tham
chiếu ảnh chưa có trong `public`, audit/build báo lỗi thay vì âm thầm bỏ ảnh.
`npm run audit:assets` kiểm tra offline và ghi danh sách file giữ/loại cùng lý do
tham chiếu vào `output/deployment-assets-audit.json`.

```bash
npm install
npm run dev
npm run test:workspace
npm run test:internal
node --test tests/chapter-four-story.test.mjs
npm run build
```

Repository này chứa frontend Vite/React gọi API; mã backend và schema database nằm ngoài repository. Một số tính năng còn dữ liệu mock, xem [phạm vi tích hợp API](docs/api-coverage-2026-11-02.md).
