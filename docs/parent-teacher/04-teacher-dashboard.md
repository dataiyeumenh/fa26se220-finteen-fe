# Trang Teacher Dashboard

## Mục tiêu

Trang tổng quan Teacher nằm ở `/dashboard`, hiển thị tổng số lớp, học sinh và bài quiz trên tất cả lớp. Hoạt động gần đây và tiến độ bên dưới thuộc lớp đang theo dõi.

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
  -> lấy report và danh sách quiz của từng lớp
  -> cộng số học sinh trên tất cả report, đếm quiz theo ID
  -> render ba thẻ tổng hợp và báo cáo của lớp đầu tiên
```

Parent dùng `FAMILY`; Teacher dùng `CLASS`. Backend dùng cùng endpoint nhưng frontend chọn đúng ngữ cảnh.

## API

| Hàm | Method | Endpoint | Kết quả dùng ở đâu |
|---|---|---|---|
| `listGroups()` | GET | `/api/groups` | Chọn lớp hiện tại, đếm số lớp |
| `getGroupReport(id)` | GET | `/api/groups/{id}/report` | Cộng `summary.learners` của tất cả lớp và lấy chi tiết lớp đang theo dõi |
| `listQuizzes(id)` | GET | `/api/quizzes?groupId={id}` | Đếm tất cả quiz đang quản lý; dùng chung nguồn với trang Quản lý Quiz, bao gồm bài nhập lưu trong trình duyệt |

## Giao diện theo trạng thái

- `loading && !dashboard`: hiện “Đang tải”.
- `error`: hiện lỗi nhưng vẫn có thể giữ dữ liệu cũ.
- Không có lớp: nút sang `/dashboard/groups`.
- Có lớp: link đến báo cáo, học sinh và quản lý lớp.

Ba thẻ đầu trang dùng `groupCount`, `studentCount`, `quizCount`; `activeGroupCount` cho biết số lớp đang mở. Nếu chưa tải đủ report hoặc quiz, chỉ số tương ứng hiển thị `—` kèm cảnh báo, không dùng tổng thiếu làm tổng toàn bộ. `loadTeacherDashboard.js` tổng hợp dữ liệu; hook bỏ qua phản hồi cũ khi làm mới.

Phần lớp đang theo dõi dùng `report.summary.learners`, `active` và `activeLast7Days` của riêng lớp đó.

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

