# Học code Parent và Teacher trong FinTeen

Bộ tài liệu này bám trực tiếp vào code hiện tại của dự án. Hãy đọc theo thứ tự dưới đây, đồng thời mở file code được nhắc tới để đối chiếu.

## Cách đọc một trang

Mỗi trang trong dự án đi theo luồng:

```text
Route trong App.jsx
  -> file Page.jsx
  -> custom hook
  -> file api
  -> auth.accountRequest(...)
  -> backend
  -> hook cập nhật state
  -> component render giao diện
```

Trách nhiệm của từng tầng:

- `Page.jsx`: ghép hook với component, không chứa nhiều logic.
- `components/`: hiển thị dữ liệu, nhận thao tác của người dùng.
- `hooks/`: giữ state, gọi API và điều phối nghiệp vụ phía giao diện.
- `api/`: mô tả endpoint, HTTP method, query và body gửi đến backend.
- `auth.accountRequest`: gắn token tài khoản, gửi request và xử lý lỗi chung.

## Thứ tự học đề xuất

1. [Parent Dashboard](./01-parent-dashboard.md)
2. [Parent Learners](./02-parent-learners.md)
3. [Parent Reports](./03-parent-reports.md)
4. [Teacher Dashboard](./04-teacher-dashboard.md)
5. [Teacher Groups](./05-teacher-groups.md)
6. [Teacher Quiz](./06-teacher-quiz.md)

## Route và quyền truy cập

| Route | Trang thực tế | Quyền |
|---|---|---|
| `/dashboard` | Parent hoặc Teacher Dashboard | Adult đã đăng nhập |
| `/dashboard/learners` | Parent Learners hoặc danh sách Teacher Learners | Parent/Teacher |
| `/dashboard/learners/:id` | Báo cáo chi tiết một trẻ/học sinh | Parent/Teacher |
| `/dashboard/reports` | Parent hoặc Teacher Reports | Parent/Teacher |
| `/dashboard/groups` | Teacher Groups | Chỉ Teacher |
| `/dashboard/quiz-management` | Teacher Quiz | Chỉ Teacher |

`AdultDashboard`, `AdultLearners` và `AdultReports` trong `src/App.jsx` đọc `actor.role` để chọn đúng trang Parent hoặc Teacher. `RequireAccount` chặn người chưa đăng nhập hoặc sai vai trò trước khi component trang được render.

## Cách tự học với từng tài liệu

1. Mở tài liệu và file `Page.jsx` cùng lúc.
2. Đi theo các mũi tên từ Page sang hook, API rồi component.
3. Mở DevTools > Network và thực hiện một thao tác trên giao diện.
4. So sánh URL, method, request body và response với bảng API trong tài liệu.
5. Làm bài tập cuối tài liệu mà chưa nhìn đáp án.

## Từ khóa cần hiểu

- `state`: dữ liệu thay đổi khiến React render lại.
- `props`: dữ liệu component cha truyền xuống component con.
- `useEffect`: chạy tác vụ phụ sau khi component xuất hiện hoặc dependency đổi.
- `useCallback`: giữ ổn định một function giữa các lần render.
- `useMemo`: chỉ tính lại một giá trị khi dependency đổi.
- `async/await`: chờ Promise của API hoàn tất.
- `loading/error/message`: ba trạng thái giao diện phổ biến khi gọi API.
- `encodeURIComponent`: mã hóa ID trước khi đặt vào URL.

