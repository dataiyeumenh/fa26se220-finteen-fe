# Trang Parent Reports

## Mục tiêu

Trang `/dashboard/reports` hiển thị tiến độ của các trẻ theo nhóm gia đình, cho phép lọc trạng thái, xem hành trình, xuất CSV và in/lưu PDF.

## Các file

```text
src/pages/Parent/Reports/
├── ParentReports.jsx
├── components/ParentReportsContent.jsx
├── hooks/useParentReports.js
└── api/parentReportsApi.js
```

## Luồng tải nhiều báo cáo

```text
GET /api/groups
  -> lọc context = FAMILY
  -> với mỗi group gọi GET /api/groups/{id}/report
  -> Promise.allSettled chờ tất cả request
  -> giữ các báo cáo thành công
  -> hiện warning nếu một phần request thất bại
  -> chỉ báo error nếu không lấy được báo cáo nào
```

`Promise.allSettled` được chọn thay cho `Promise.all` để một nhóm lỗi không làm mất báo cáo của tất cả nhóm còn lại.

## API

| Hàm | Method | Endpoint |
|---|---|---|
| `listGroups()` | GET | `/api/groups` |
| `getGroupReport(groupId)` | GET | `/api/groups/{groupId}/report` |

## State và lọc dữ liệu

- `reports`: toàn bộ báo cáo tải thành công.
- `groupId`: nhóm đang được chọn.
- `status`: bộ lọc `ACTIVE`, `ARCHIVED`, `WIPED` hoặc rỗng.
- `report`: báo cáo khớp `groupId`.
- `rows`: `report.rows` sau khi lọc trạng thái, được tính bằng `useMemo`.
- `warning`: lỗi một phần.
- `error`: không thể tải dữ liệu cần thiết.

`requestedGroupId` cho phép nơi gọi yêu cầu mở sẵn một nhóm. Hook vẫn kiểm tra ID đó có thật trong response trước khi dùng.

## Hiển thị báo cáo

Mỗi dòng có tên, mã đăng nhập, trạng thái, số chương hoàn thành, năm chỉ số, hoạt động gần nhất và link `/dashboard/learners/{slotId}`.

`indicatorText` đổi số thành ba mức:

- dưới 34: thấp;
- từ 34 đến 66: vừa;
- từ 67 trở lên: cao.

## CSV và PDF

- `groupReportCsv(rows)` chuyển dữ liệu thành chuỗi CSV.
- `download(...)` tạo file tải xuống với MIME `text/csv;charset=utf-16le` để Excel Windows đọc tiếng Việt tốt hơn.
- `window.print()` mở hộp thoại in; CSS dành cho print quyết định phần nào xuất hiện trong PDF.

Việc xuất file diễn ra ở trình duyệt, không gọi thêm API.

## Bài tập

1. Giải thích vì sao `rows` thay đổi khi `status` thay đổi dù không gọi lại API.
2. Dùng Network tạo tình huống một report lỗi và quan sát `warning`.
3. Tìm code tạo tên file CSV theo ngày hiện tại.
4. So sánh dữ liệu bảng trên màn hình với dữ liệu trong file CSV.

