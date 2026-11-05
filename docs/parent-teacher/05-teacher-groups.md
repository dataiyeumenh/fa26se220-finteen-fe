# Trang Teacher Groups và Learners

## Mục tiêu

Teacher có hai cách dùng cùng khu vực code:

- `/dashboard/groups`: quản lý lớp, consent, hậu trắc và đóng lớp.
- `/dashboard/learners`: quản lý các hồ sơ học sinh trong lớp.

`TeacherGroups` nhận prop `groupsOnly`. Khi là `true`, component hiện quản lý lớp; khi là `false`, nó render `TeacherLearnerList`.

## Cấu trúc

```text
src/pages/Teacher/Groups/
├── TeacherGroups.jsx
├── components/TeacherGroupsContent.jsx
├── hooks/useTeacherGroups.js
└── api/teacherGroupsApi.js
```

## Luồng tải

```text
GET /api/groups
  -> lọc context = CLASS
  -> tìm lớp chưa đóng
  -> Promise.all([
       GET /api/groups/{id}/slots,
       GET /api/groups/{id}/capacity
     ])
  -> tách active/inactive và tính available
```

## API

| Chức năng | Method | Endpoint | Body |
|---|---|---|---|
| Danh sách lớp | GET | `/api/groups` | — |
| Danh sách slot | GET | `/api/groups/{id}/slots` | — |
| Sức chứa còn lại | GET | `/api/groups/{id}/capacity` | — |
| Tạo lớp | POST | `/api/groups` | `{ name, context: "CLASS" }` |
| Xác nhận consent | POST | `/api/groups/{id}/consent` | — |
| Đóng lớp | POST | `/api/groups/{id}/close` | — |
| Bật/tắt hậu trắc | POST | `/api/groups/{id}/post-test` | `{ enabled }` |
| Tạo học sinh | POST | `/api/slots` | `{ groupId, displayName, pin }` |
| Tạo nhiều học sinh | POST | `/api/slots/bulk` | `{ slots: [...] }` |
| Đổi PIN | POST | `/api/slots/{id}/pin` | `{ pin }` |
| Thu hồi | POST | `/api/slots/{id}/return` | — |
| Xóa dữ liệu | DELETE | `/api/slots/{id}` | — |

## Quản lý lớp

Component cho phép:

- tạo lớp mới nếu chưa có lớp đang mở;
- bật hoặc tắt hậu trắc;
- xác nhận đã có sự đồng ý của phụ huynh;
- đóng lớp sau bước xác nhận qua modal.

Mã lỗi `5003` được chuyển thành thông báo yêu cầu consent trước. Đây là ví dụ frontend dịch mã nghiệp vụ backend thành nội dung dễ hiểu.

## Quản lý học sinh

`TeacherLearnerList` dùng cùng `learnerState` nhưng chỉ trình bày slot:

- tab đang hoạt động và đã thu hồi;
- tạo học sinh nếu còn capacity;
- thu hồi hồ sơ;
- mở báo cáo chi tiết.

Các thao tác đều đi qua `actions`, rồi `run()` tự refresh. Component không tự chỉnh mảng `slots`, vì response mới từ backend là nguồn dữ liệu đáng tin cậy.

## Điểm khác Parent Learners

- context là `CLASS` thay vì `FAMILY`;
- giới hạn lớp thường lớn hơn;
- có consent và hậu trắc;
- có trang `/dashboard/groups` riêng;
- Teacher còn dùng group ID để tạo và lọc Quiz.

## Bài tập

1. Theo dõi prop `groupsOnly` từ `App.jsx` đến component con.
2. Giải thích tại sao không nên tự `slots.push(newSlot)` sau khi tạo học sinh.
3. Dùng Network quan sát hai request được chạy song song trong `refresh()`.
4. Tìm điều kiện khiến nút tạo học sinh không xuất hiện.

