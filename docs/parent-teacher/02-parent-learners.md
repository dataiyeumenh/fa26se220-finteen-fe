# Trang Parent Learners

## Mục tiêu của trang

Trang `/dashboard/learners` cho phụ huynh tạo không gian gia đình, tạo hồ sơ trẻ, đổi PIN, thu hồi hồ sơ và xóa dữ liệu.

## Cấu trúc

```text
src/pages/Parent/Learners/
├── ParentLearners.jsx
├── components/ParentLearnersContent.jsx
├── hooks/useParentLearners.js
└── api/parentLearnersApi.js
```

`ParentLearners.jsx` chỉ gọi hook và truyền `learnerState` xuống component. Đây là ví dụ rõ nhất về tách giao diện khỏi logic.

## Luồng tải ban đầu

```text
useEffect -> refresh()
  -> GET /api/groups
  -> lọc context = FAMILY
  -> tìm group chưa có closedAt
  -> song song:
       GET /api/groups/{id}/slots
       GET /api/groups/{id}/capacity
  -> cập nhật group, groups, slots, capacity
```

`Promise.all` phù hợp vì slots và capacity độc lập, có thể tải cùng lúc.

## Bảng API

| Hàm | Method | Endpoint | Body chính |
|---|---|---|---|
| `listGroups` | GET | `/api/groups` | Không có |
| `listGroupSlots` | GET | `/api/groups/{id}/slots` | Không có |
| `groupCapacity` | GET | `/api/groups/{id}/capacity` | Không có |
| `openGroup` | POST mặc định khi có body | `/api/groups` | `{ name, context: "FAMILY" }` |
| `confirmConsent` | POST | `/api/groups/{id}/consent` | Không có |
| `closeGroup` | POST | `/api/groups/{id}/close` | Không có |
| `setGroupPostTest` | POST mặc định khi có body | `/api/groups/{id}/post-test` | `{ enabled }` |
| `openSlot` | POST mặc định khi có body | `/api/slots` | `{ groupId, displayName, pin }` |
| `openSlots` | POST mặc định khi có body | `/api/slots/bulk` | `{ slots: [...] }` |
| `changeSlotPin` | POST mặc định khi có body | `/api/slots/{id}/pin` | `{ pin }` |
| `returnSlot` | POST | `/api/slots/{id}/return` | Không có |
| `wipeSlot` | DELETE | `/api/slots/{id}` | Không có |

Trong dự án, `accountRequest` tự chọn POST khi có `body` và không truyền method. Khi đọc code API, cần kiểm tra quy ước này trong `auth.accountRequest`.

## Cách hook tổ chức hành động

`run(action, success)` gom logic dùng chung:

1. Xóa lỗi cũ.
2. Chạy API được truyền vào.
3. Hiện thông báo thành công.
4. Gọi `refresh()` để lấy dữ liệu mới từ server.
5. Nếu lỗi, đổi mã lỗi backend thành câu dễ hiểu rồi ném lỗi lại.

`actions` được tạo bằng `useMemo`, gồm `openGroup`, `openSlot`, `changeSlotPin`, `returnSlot` và `wipeSlot`.

## State dẫn xuất

- `active`: slot có `status === "ACTIVE"`.
- `inactive`: các slot còn lại.
- `available`: capacity backend trả về; nếu thiếu thì tính từ `slotLimit - slotUsed`.
- `message`: tự biến mất sau 4,5 giây nhờ timer trong `useEffect`.

Đây là dữ liệu dẫn xuất từ state gốc, không cần tạo thêm `useState` riêng.

## Luồng một thao tác: đổi PIN

```text
Người dùng bấm “Đổi PIN”
  -> component setModal({ type: "pin", slot })
  -> ActionForm kiểm tra PIN gồm 6 chữ số
  -> actions.changeSlotPin(slot.id, pin)
  -> PUT/POST theo accountRequest tới /api/slots/{id}/pin
  -> run() hiện thông báo và refresh dữ liệu
  -> modal đóng khi Promise thành công
```

## Phần chỉ thuộc giao diện

`modal`, `tab` và `search` nằm trong component vì chúng chỉ điều khiển cách hiển thị, không phải dữ liệu nghiệp vụ từ server.

## Bài tập

1. Dùng Network kiểm tra body khi tạo hồ sơ trẻ.
2. Giải thích khác nhau giữa “Thu hồi” và “Xóa dữ liệu”.
3. Tìm validation khiến PIN bắt buộc đúng 6 chữ số.
4. Thử mô tả điều gì xảy ra nếu API tạo slot thành công nhưng `refresh()` thất bại.

