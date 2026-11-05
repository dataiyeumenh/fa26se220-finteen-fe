# Trang Teacher Dashboard

## Mục tiêu

Trang tổng quan Teacher nằm ở `/dashboard`, hiển thị lớp đang hoạt động, số học sinh, hoạt động gần đây và tổng chương hoàn thành.

## Cấu trúc

```text
src/pages/Teacher/Dashboard/
├── TeacherDashboard.jsx
├── components/TeacherDashboardContent.jsx
├── hooks/useTeacherDashboard.js
└── api/teacherDashboardApi.js
```

## Luồng dữ liệu

Luồng gần giống Parent Dashboard, nhưng có một khác biệt nghiệp vụ quan trọng:

```text
GET /api/groups
  -> lọc group.context === "CLASS"
  -> ưu tiên lớp chưa đóng
  -> GET /api/groups/{id}/report
  -> render tổng quan lớp
```

Parent dùng `FAMILY`; Teacher dùng `CLASS`. Backend dùng cùng endpoint nhưng frontend chọn đúng ngữ cảnh.

## API

| Hàm | Method | Endpoint | Kết quả dùng ở đâu |
|---|---|---|---|
| `listGroups()` | GET | `/api/groups` | Chọn lớp hiện tại, đếm số lớp |
| `getGroupReport(id)` | GET | `/api/groups/{id}/report` | Lấy summary của lớp |

## Giao diện theo trạng thái

- `loading && !dashboard`: hiện “Đang tải”.
- `error`: hiện lỗi nhưng vẫn có thể giữ dữ liệu cũ.
- Không có lớp: nút sang `/dashboard/groups`.
- Có lớp: link đến báo cáo, học sinh và quản lý lớp.

Các chỉ số lấy từ `report.summary`: `learners`, `active`, `activeLast7Days`, `chaptersCompleted`.

## So sánh với Parent Dashboard

| Parent | Teacher |
|---|---|
| Lọc `FAMILY` | Lọc `CLASS` |
| “các con” | “học sinh” |
| Tạo nhóm tại learners | Tạo lớp tại groups |
| Link quản lý hồ sơ | Link quản lý học sinh/lớp |

Phần hook và API hiện gần như giống nhau. Việc tách riêng giúp mỗi vai trò có thể phát triển nghiệp vụ khác nhau mà không làm một file chung quá phức tạp.

## Bài tập

1. Đặt breakpoint trong `refetch` và theo dõi hai request.
2. Giải thích tác dụng của phép sort theo `closedAt`.
3. Tìm các dòng điều hướng sang Groups, Learners và Reports.

