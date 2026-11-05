# Trang Teacher Quiz Management

## Mục tiêu

Trang `/dashboard/quiz-management` cho giáo viên chọn lớp, tạo/sửa đề, xem đề, phát hành, xóa bản nháp và xem kết quả.

## Cấu trúc

```text
src/pages/Teacher/Quiz/
├── TeacherQuizManagement.jsx
├── components/TeacherQuizContent.jsx
├── hooks/useTeacherQuizzes.js
└── api/teacherQuizApi.js
```

Đây là trang phức tạp nhất vì một file hook chứa bốn hook phục vụ bốn vùng dữ liệu khác nhau.

## Bốn hook

### `useTeacherQuizzes`

Quản lý danh sách lớp, lớp đang chọn, danh sách đề và các hành động phát hành/xóa.

```text
mount -> loadGroups()
groupId đổi -> loadQuizzes()
publish/delete -> act() -> refresh()
```

### `useTeacherQuestionBank(filters)`

Tải ngân hàng câu hỏi theo `standard`, `concept`, `pool`, `q`; đồng thời cung cấp `saveQuiz` để tạo mới hoặc cập nhật đề.

### `useTeacherQuizDetail(quizId)`

Tải đầy đủ nội dung một đề khi mở modal “Xem đề” hoặc cần dữ liệu sửa đề.

### `useTeacherQuizResults(quizId)`

Tải kết quả tổng hợp của đề và có `viewSlot(slotId)` để xem bài của một học sinh.

Các effect dùng biến `active` trong cleanup để response cũ không cập nhật state sau khi modal đóng hoặc ID thay đổi.

## Bảng API đầy đủ

| Chức năng | Method | Endpoint | Dữ liệu gửi |
|---|---|---|---|
| Lấy lớp | GET | `/api/groups` | — |
| Tìm câu hỏi | GET | `/api/questions?...` | Query `standard`, `concept`, `pool`, `q` |
| Danh sách đề | GET | `/api/quizzes?groupId={id}` | groupId trong query |
| Chi tiết đề | GET | `/api/quizzes/{quizId}` | — |
| Tạo đề | POST | `/api/quizzes` | `{ groupId, title, questionIds, dueAt }` |
| Sửa đề | PUT | `/api/quizzes/{quizId}` | `{ title, questionIds, dueAt }` |
| Phát hành | POST | `/api/quizzes/{quizId}/publish` | — |
| Xóa bản nháp | DELETE | `/api/quizzes/{quizId}` | — |
| Kết quả tổng | GET | `/api/quizzes/{quizId}/results` | — |
| Bài một học sinh | GET | `/api/quizzes/{quizId}/results/{slotId}` | — |

`URLSearchParams` chỉ thêm filter có giá trị. `encodeURIComponent` bảo vệ ID khi ghép vào URL.

## Luồng tạo đề

```text
Bấm “Tạo đề”
  -> modal type = edit
  -> QuizEditor gọi useTeacherQuestionBank(applied)
  -> người dùng lọc và chọn questionIds
  -> submit tạo payload
  -> saveQuiz(null, payload)
  -> POST /api/quizzes
  -> onSaved đóng modal và refresh danh sách
```

## Luồng sửa đề

```text
Bấm “Sửa”
  -> QuizEditLoader gọi GET /api/quizzes/{id}
  -> truyền detail vào QuizEditor
  -> form được điền từ đề hiện tại
  -> saveQuiz(id, payload)
  -> PUT /api/quizzes/{id}
```

Việc tải detail trước khi sửa rất quan trọng: item trong danh sách có thể chỉ là dữ liệu tóm tắt, không chứa đủ câu hỏi.

## Luồng xem đề và kết quả

- “Xem đề” mở `QuizDetail`, gọi `useTeacherQuizDetail` rồi render từng câu và đáp án.
- “Kết quả” mở `QuizResults`, gọi `useTeacherQuizResults`.
- Bấm một học sinh sẽ gọi endpoint kết quả theo `slotId` và lưu vào `slotResult`.

## Xử lý lỗi nghiệp vụ

`quizError` đổi mã backend thành thông báo. Ví dụ:

- `8002`: đề đã phát hành hoặc là hậu trắc nên không thể sửa;
- `8007`: câu hỏi đã bị rút hoặc không còn dùng được;
- `8008`: chỉ lớp đang mở mới dùng Quiz;
- `3005`: gói Teacher hết hạn.

Hook danh sách dùng `act()` và trả `true/false` thay vì ném lỗi ra component. Hook lưu đề lại ném `Error` để `ActionForm` có thể xử lý lỗi submit.

## State giao diện và state server

- `modal`, `filters`, câu hỏi đang chọn: state giao diện.
- `groups`, `quizzes`, `detail`, `data`: dữ liệu từ server.
- `loading`, `error`, `message`: trạng thái của request.

Phân biệt ba nhóm này giúp biết state nên đặt trong component hay custom hook.

## Bài tập

1. Tạo một đề nháp và ghi lại thứ tự các request trong Network.
2. Giải thích vì sao đổi `groupId` tự tải lại danh sách đề.
3. Tìm điều kiện chỉ cho phép sửa/xóa/phát hành bản nháp.
4. Giải thích cleanup `active = false` ngăn lỗi gì.
5. So sánh payload tạo đề và payload cập nhật đề.

