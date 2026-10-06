# FinTeen — bản đồ dự án và hướng dẫn bàn giao cho AI

> Đọc file này trước khi sửa game. Đây là điểm vào kỹ thuật; tài liệu ảnh An/Minh nằm tại [`public/images/finteen-v2/README.md`](public/images/finteen-v2/README.md), còn mục lục nguồn nằm tại [`docs/README.md`](docs/README.md).

## Dự án này đang có hai tuyến nội dung

Không được tự động trộn hai tuyến chỉ vì số chương giống nhau:

| Tuyến | Nhân vật | Nguồn dữ liệu | Trạng thái |
| --- | --- | --- | --- |
| Gameplay đang chạy | Tí, Hùng và các nhân vật trong `public/images/c1`, `c2` | `scene_data_runtime.js/json`, adapter trong `src/pages/User/Dashboard/data/` | Chương 1–2 đã có player; chương 4 có đoạn demo riêng. |
| Bộ art/GDD v2 để tích hợp | An, Minh, mẹ, cô Linh và NPC | `public/images/finteen-v2/`, GDD trong `docs/finteen-game-context-sources/` | Có ảnh chương 1–6 và hướng dẫn ghép; chưa phải runtime hoàn chỉnh. |

`cot_truyen_text.txt` thuộc tuyến Tí cũ. Không lấy lời thoại hoặc số tiền ở đó để gắn vào ảnh An/Minh nếu chưa có quyết định chuyển tuyến. Các chương GDD v2 là **tình huống độc lập**, không phải An lớn dần qua một timeline; mỗi chương phải khởi tạo lại tuổi, tiền, mục tiêu và cờ tình huống.

## Thứ tự đọc bắt buộc cho AI triển khai

1. Đọc file này để biết kiến trúc và ranh giới nội dung.
2. Đọc [`docs/README.md`](docs/README.md) để chọn đúng nguồn sự thật.
3. Đọc [`public/images/finteen-v2/README.md`](public/images/finteen-v2/README.md) để hiểu loại ảnh, thứ tự layer và contract dữ liệu.
4. Đọc `public/images/finteen-v2/chapter-NN/README.md` của chương cần làm; làm đúng bảng **Công thức lắp cảnh**.
5. Đọc GDD nguồn để lấy lời thoại/điều kiện nhánh. README ảnh quyết định asset nào xuất hiện; GDD quyết định nội dung và logic. Khi mâu thuẫn, không tự đoán: ghi TODO kèm hai nguồn.
6. Chỉ sau đó mới nối vào player, state, route và persistence hiện có.

## Kiến trúc code liên quan

- `src/pages/User/Dashboard/components/game/VisualNovelPlayer.jsx`: player visual novel hiện tại.
- `src/pages/User/Dashboard/data/chapter1V2RuntimeAdapter.js`: dữ liệu runtime Chapter 1.
- `src/pages/User/Dashboard/data/chapter2V2RuntimeAdapter.js`: dữ liệu runtime Chapter 2.
- `src/pages/User/Dashboard/components/game/ChapterFourMiniGame.jsx`: demo chương 4 tuyến Minh cũ; không phải chương 4 “Mua thông minh” của bộ art v2.
- `public/images/c1`, `public/images/c2`: asset gameplay tuyến Tí đang chạy.
- `public/images/finteen-v2`: asset An/Minh được tài liệu hóa để xây tuyến mới.
- `src/features/internal`: Content Studio/frontend mô phỏng quy trình biên tập; không phải backend sản xuất.

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

```bash
npm install
npm run dev
npm run test:workspace
npm run test:internal
node --test tests/chapter-four-story.test.mjs
npm run build
```

Ứng dụng hiện là frontend demo dùng Vite/React và local browser state; đừng mô tả nó như hệ thống backend hoàn chỉnh.
