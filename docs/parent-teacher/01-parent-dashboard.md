# Trang Parent Dashboard

## Mục tiêu của trang

Trang tổng quan cho phụ huynh xem nhanh nhóm gia đình, số hồ sơ trẻ, hoạt động bảy ngày gần nhất và số chương đã hoàn thành.

Route là `/dashboard`. `AdultDashboard` trong `src/App.jsx` chọn `ParentDashboard` khi `actor.role === "parent"`.

## Các file liên quan

```text
src/pages/Parent/Dashboard/
├── ParentDashboard.jsx
├── components/ParentDashboardContent.jsx
├── hooks/useParentDashboard.js
└── api/parentDashboardApi.js
```

`ParentDashboard.jsx` lấy `actor` từ `useWorkspace()`, gọi `useParentDashboard()` rồi truyền cả hai xuống component giao diện.

## Luồng tải dữ liệu

```text
ParentDashboard được render
  -> useParentDashboard tạo loading = true
  -> useEffect gọi refetch()
  -> GET /api/groups
  -> chỉ giữ group có context = FAMILY
  -> chọn group chưa đóng đầu tiên
  -> GET /api/groups/{groupId}/report
  -> setDashboard({ group, report, groupCount })
  -> component render các chỉ số
```

## API được sử dụng

| Hàm | Method | Endpoint | Mục đích |
|---|---|---|---|
| `listGroups()` | GET mặc định | `/api/groups` | Lấy tất cả nhóm của tài khoản |
| `getGroupReport(groupId)` | GET mặc định | `/api/groups/{groupId}/report` | Lấy báo cáo của nhóm gia đình |

Cả hai gọi thẳng `auth.accountRequest`, vì vậy token tài khoản được xử lý ở tầng auth dùng chung.

## State trong hook

- `dashboard`: `{ group, report, groupCount }` hoặc `null`.
- `loading`: đang chờ dữ liệu từ server.
- `error`: thông báo khi một request thất bại.
- `refetch`: hàm tải lại dữ liệu, dùng cả lúc mở trang và khi bấm “Làm mới”.

`useCallback(..., [])` giữ `refetch` ổn định. `useEffect` phụ thuộc vào `refetch`, nên lần tải đầu chỉ xảy ra khi component mount.

## Component hiển thị gì?

- Nếu đang tải lần đầu: hiện trạng thái chờ.
- Nếu lỗi: hiện notice có `role="alert"`.
- Nếu chưa có nhóm: hướng người dùng sang `/dashboard/learners` để tạo nhóm.
- Nếu có nhóm: hiển thị `learners`, `active`, `activeLast7Days`, `chaptersCompleted` và số chỗ đang dùng.

Toán tử `?? 0` bảo đảm giao diện hiện số 0 nếu backend chưa trả một chỉ số.

## Điểm cần nhớ

Frontend không tự tính báo cáo. Nó chỉ chọn đúng nhóm `FAMILY`, gọi endpoint report và trình bày dữ liệu backend trả về.

## Bài tập

1. Tìm dòng khiến nút “Làm mới” bị vô hiệu hóa trong lúc tải.
2. Thêm một `console.log(report)` tạm thời và quan sát response trong trình duyệt.
3. Giải thích vì sao trang kiểm tra `dashboard?.report?.group || dashboard?.group`.

