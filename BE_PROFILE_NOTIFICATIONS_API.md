# Đề xuất API Backend: Cập nhật hồ sơ và thông báo học tập

Tài liệu này mô tả hai nhóm API frontend FinTeen đang cần bổ sung:

1. Cập nhật hồ sơ tài khoản phụ huynh/giáo viên.
2. Thông báo sự kiện học tập cho phụ huynh/giáo viên.

## Quy ước chung

- Base path: `/api`.
- Tất cả API trong tài liệu dùng `ACCOUNT_TOKEN`:

```http
Authorization: Bearer <ACCOUNT_TOKEN>
```

- Response sử dụng cấu trúc chung hiện tại của hệ thống:

```json
{
  "code": 0,
  "message": "Thành công",
  "result": {}
}
```

- Backend là nguồn dữ liệu đáng tin cậy. Frontend không tự suy đoán quyền sở hữu hoặc tự tạo thông báo học tập.
- Các timestamp dùng ISO 8601 và có múi giờ, ví dụ `2026-11-23T10:30:00+07:00`.

---

## 1. Cập nhật hồ sơ phụ huynh/giáo viên

### Hiện trạng

Frontend đã có `GET /api/auth/me` để lấy tài khoản hiện tại nhưng chưa có API cập nhật. Trang tài khoản hiện chỉ hiển thị `displayName` và `email` ở chế độ chỉ đọc.

API này chỉ sửa hồ sơ của **tài khoản người lớn đang đăng nhập**. Việc sửa hồ sơ trẻ/học sinh tiếp tục dùng `PATCH /api/slots/{id}` hiện có.

### API cần bổ sung

```http
PATCH /api/auth/me
Content-Type: application/json
Authorization: Bearer <ACCOUNT_TOKEN>
```

### Request

```json
{
  "displayName": "Nguyễn Văn A"
}
```

| Trường | Kiểu | Bắt buộc | Quy tắc |
|---|---|---:|---|
| `displayName` | string | Có | Trim khoảng trắng; không được rỗng; tối đa 80 ký tự. |

Request phải có ít nhất một trường cần cập nhật. Không nhận các trường `id`, `email`, `plans`, `roles` hoặc thông tin phân quyền khác.

### Response thành công

Backend nên trả lại toàn bộ profile mới nhất để frontend cập nhật phiên hiện tại mà không cần suy đoán dữ liệu:

```json
{
  "code": 0,
  "message": "Cập nhật hồ sơ thành công",
  "result": {
    "id": "2e65a392-37a6-4e62-9806-34f8a4a162ea",
    "email": "user@example.com",
    "displayName": "Nguyễn Văn A",
    "plans": ["PARENT"],
    "roles": []
  }
}
```

Sau khi cập nhật thành công, `GET /api/auth/me` phải trả dữ liệu mới.

### Phân quyền và bảo mật

- Chỉ tài khoản đang đăng nhập được sửa hồ sơ của chính mình.
- Không nhận `accountId` từ client.
- Không cho phép API này thay đổi email, gói, entitlement hoặc role.
- Áp dụng giống nhau cho tài khoản có plan `PARENT`, `TEACHER` hoặc cả hai.
- Nên lưu audit về thời điểm cập nhật; không cần lưu giá trị nhạy cảm vào log.

### Mã lỗi đề xuất

| HTTP | Code | Trường hợp |
|---:|---:|---|
| 400 | `1001` | Body rỗng hoặc tên không hợp lệ. |
| 401 | `3003` | Chưa đăng nhập hoặc token hết hạn. |
| 403 | `3004` | Tài khoản không được phép thực hiện thao tác. |

Ví dụ lỗi validation:

```json
{
  "code": 1001,
  "message": "Tên hiển thị không được để trống",
  "result": null
}
```

---

## 2. Thông báo học tập

### Mục tiêu

Chuông thông báo trên frontend cần hiển thị các sự kiện học tập liên quan đến trẻ/học sinh mà tài khoản phụ huynh hoặc giáo viên đang quản lý.

Admin không tham gia luồng này. Không cần API quản trị, cấu hình mẫu hay màn hình quản lý thông báo cho Admin trong phạm vi hiện tại.

### Các loại thông báo ban đầu

| Type | Khi tạo |
|---|---|
| `CHAPTER_COMPLETED` | Trẻ hoàn thành một chương. |
| `QUIZ_SUBMITTED` | Học sinh nộp quiz do giáo viên giao. |
| `REPORT_READY` | Bé đã nộp hậu trắc nên báo cáo chương đã có. |

Một lần hoàn thành chương chỉ tạo **một** notification `CHAPTER_COMPLETED`. Không tạo thêm notification huy hiệu/thành tích từ cùng sự kiện.

### Người nhận

- Slot thuộc nhóm `FAMILY`: thông báo cho tài khoản phụ huynh sở hữu nhóm.
- Slot thuộc nhóm `CLASS`: thông báo cho tài khoản giáo viên quản lý nhóm.
- Một tài khoản chỉ được đọc và cập nhật thông báo của chính mình.
- Không trả thông báo dựa trên `accountId` do client truyền lên.
- Phụ huynh nhận một notification cho mỗi sự kiện của từng bé.
- Giáo viên nhận một notification gộp theo lớp và chương/đề. Mẫu số là số slot đã tạo trong lớp trừ slot đã xoá, được tính lại mỗi lần đọc; không dùng `plannedSize` và vẫn tính slot chưa từng đăng nhập.
- Khi có thêm học sinh hoàn thành hoặc nộp bài, backend cập nhật dòng gộp hiện có, cập nhật `updatedAt`, đưa dòng lên đầu và đặt lại thành chưa đọc.
- Với slot đã xoá, `slotDisplayName` là `null` và tiêu đề dùng “Học sinh đã xoá”.

### Cấu trúc notification

```json
{
  "id": "765683b2-1127-42e4-9204-2764f40fffc9",
  "type": "CHAPTER_COMPLETED",
  "title": "Minh đã hoàn thành Chương 3",
  "message": "Minh vừa hoàn thành chương Lương đầu tiên.",
  "slotId": "6eaf6884-811c-42e1-995d-93ea7862b219",
  "slotDisplayName": "Minh",
  "groupId": "be5aaf12-862f-401d-a878-c9a8c6a815a8",
  "chapter": 3,
  "quizId": null,
  "read": false,
  "readAt": null,
  "createdAt": "2026-11-23T10:30:00+07:00",
  "updatedAt": "2026-11-23T10:30:00+07:00",
  "action": {
    "type": "OPEN_LEARNER_REPORT",
    "resourceId": "6eaf6884-811c-42e1-995d-93ea7862b219"
  }
}
```

Các trường không áp dụng cho một loại notification có thể trả `null`. `action.type` nên là enum ổn định để frontend tự quyết định route; backend không cần trả URL frontend tuyệt đối.

Các action ban đầu đề xuất:

```text
OPEN_LEARNER_REPORT
OPEN_QUIZ_RESULTS
OPEN_LEARNER_LIST
OPEN_GROUP_REPORT
```

- `CHAPTER_COMPLETED` gộp của giáo viên: `OPEN_LEARNER_LIST`, `resourceId = groupId`.
- `REPORT_READY` của phụ huynh: `OPEN_LEARNER_REPORT`, `resourceId = slotId`.
- `REPORT_READY` gộp của giáo viên: `OPEN_GROUP_REPORT`, `resourceId = groupId`; FE mở báo cáo nhóm từ `GET /api/groups/{id}/report`.

### 2.1. Lấy danh sách thông báo

```http
GET /api/notifications?page=0&size=20&unreadOnly=false
Authorization: Bearer <ACCOUNT_TOKEN>
```

Query:

| Tham số | Mặc định | Quy tắc |
|---|---:|---|
| `page` | `0` | Tối thiểu 0. |
| `size` | `20` | Từ 1 đến 100. |
| `unreadOnly` | `false` | Nếu `true`, chỉ trả thông báo chưa đọc. |

Sắp xếp theo `updatedAt DESC`, sau đó `id DESC` để kết quả ổn định.

Response:

```json
{
  "code": 0,
  "message": "Thành công",
  "result": {
    "items": [
      {
        "id": "765683b2-1127-42e4-9204-2764f40fffc9",
        "type": "CHAPTER_COMPLETED",
        "title": "Minh đã hoàn thành Chương 3",
        "message": "Minh vừa hoàn thành chương Lương đầu tiên.",
        "slotId": "6eaf6884-811c-42e1-995d-93ea7862b219",
        "slotDisplayName": "Minh",
        "groupId": "be5aaf12-862f-401d-a878-c9a8c6a815a8",
        "chapter": 3,
        "quizId": null,
        "read": false,
        "readAt": null,
        "createdAt": "2026-11-23T10:30:00+07:00",
        "updatedAt": "2026-11-23T10:30:00+07:00",
        "action": {
          "type": "OPEN_LEARNER_REPORT",
          "resourceId": "6eaf6884-811c-42e1-995d-93ea7862b219"
        }
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "unreadCount": 1
  }
}
```

### 2.2. Lấy số thông báo chưa đọc

```http
GET /api/notifications/unread-count
Authorization: Bearer <ACCOUNT_TOKEN>
```

Response:

```json
{
  "code": 0,
  "message": "Thành công",
  "result": {
    "unreadCount": 3
  }
}
```

### 2.3. Đánh dấu một thông báo đã đọc

```http
PATCH /api/notifications/{id}/read
Authorization: Bearer <ACCOUNT_TOKEN>
```

Không cần request body.

Response:

```json
{
  "code": 0,
  "message": "Đã đánh dấu thông báo là đã đọc",
  "result": {
    "id": "765683b2-1127-42e4-9204-2764f40fffc9",
    "read": true,
    "readAt": "2026-11-23T10:35:00+07:00"
  }
}
```

Thao tác phải idempotent: gọi lại trên notification đã đọc vẫn trả thành công và không thay đổi `readAt` ban đầu.

### 2.4. Đánh dấu tất cả thông báo đã đọc

```http
PATCH /api/notifications/read-all
Authorization: Bearer <ACCOUNT_TOKEN>
```

Không cần request body.

Response:

```json
{
  "code": 0,
  "message": "Đã đánh dấu tất cả thông báo là đã đọc",
  "result": {
    "updatedCount": 5,
    "unreadCount": 0
  }
}
```

Chỉ cập nhật notification của tài khoản đang đăng nhập.

### Mã lỗi đề xuất

| HTTP | Code | Trường hợp |
|---:|---:|---|
| 400 | `1001` | Query phân trang không hợp lệ. |
| 401 | `3003` | Chưa đăng nhập hoặc token hết hạn. |
| 403 | `3004` | Cố truy cập notification không thuộc tài khoản. |
| 404 | `1003` | Không tìm thấy notification hoặc notification thuộc tài khoản khác. |

## Tạo notification theo sự kiện

Notification phải được tạo trong backend sau khi nghiệp vụ gốc hoàn thành thành công. Frontend không gửi request để tự khai báo rằng trẻ đã hoàn thành chương.

Ví dụ:

- `POST /api/play/chapter` xử lý thành công lần hoàn thành chương → chỉ tạo một `CHAPTER_COMPLETED`.
- API nộp quiz thành công → tạo `QUIZ_SUBMITTED`.
- API nộp hậu trắc thành công và báo cáo chương đã có → tạo hoặc cập nhật `REPORT_READY`.

### Chống tạo trùng

Các request chơi hoặc nộp bài có thể được frontend gửi lại sau lỗi mạng. Việc retry không được tạo notification trùng.

Backend nên lưu `eventKey` duy nhất, ví dụ:

```text
recipientAccountId:eventType:resourceId:attemptIndex
```

Ví dụ:

```text
account-uuid:CHAPTER_COMPLETED:slot-uuid:CH03:2
```

Một lần chơi mới có `attemptIndex` mới có thể tạo notification mới. Gửi lại cùng sự kiện phải trả kết quả nghiệp vụ hiện có và không insert thêm notification.

## Lưu trữ đề xuất

Một notification tối thiểu cần các trường:

```text
id
recipient_account_id
type
title
message
slot_id
group_id
chapter
quiz_id
action_type
action_resource_id
event_key (unique)
read_at
created_at
updated_at
```

`read` có thể được suy ra bằng `read_at IS NOT NULL`, không bắt buộc lưu thêm cột boolean.

## Phạm vi không thực hiện

- Không có API Admin quản lý notification.
- Không cho Admin xem hoặc đánh dấu đã đọc hộ người dùng.
- Không có thông báo hệ thống hoặc thông báo quảng bá trong phạm vi này.
- Chưa bắt buộc WebSocket, SSE, email hoặc push notification.
- Frontend có thể polling `unread-count` và danh sách notification ở giai đoạn đầu.

## Tiêu chí nghiệm thu

### Cập nhật profile

- Phụ huynh và giáo viên cập nhật được tên hiển thị của chính mình.
- Không thể thay đổi email, role, plan hoặc entitlement bằng request sửa profile.
- `GET /api/auth/me` trả dữ liệu mới ngay sau cập nhật.
- Không thể cập nhật tài khoản khác.

### Thông báo

- Hoàn thành chương tạo đúng một notification cho đúng phụ huynh/giáo viên.
- Nộp quiz tạo `QUIZ_SUBMITTED`; nộp hậu trắc và có báo cáo chương tạo `REPORT_READY`.
- Tài khoản A không thể xem hoặc đánh dấu notification của tài khoản B.
- Retry cùng một sự kiện không tạo notification trùng.
- Unread count giảm đúng khi đọc một thông báo hoặc đọc tất cả.
- Danh sách được phân trang và sắp xếp mới nhất trước.
- Không có quyền hoặc endpoint Admin liên quan đến notification trong phạm vi này.
