# Phân tích API còn thiếu cho Phụ huynh và Giáo viên

Ngày rà soát: 12/10/2026  
Phạm vi: frontend đang chạy trong `src/App.jsx`, mã gọi API trong `src/api/auth.client.js`, workspace trong `src/features/workspace`, và OpenAPI production tại `https://kidzeconomy.com.vn/finteen/v3/api-docs`.

## 1. Kết luận nhanh

Backend hiện đã đủ cho xác thực, gói, thanh toán và vòng đời group/slot. Những phần cốt lõi còn thiếu để hoàn thiện không gian Phụ huynh/Giáo viên là:

1. **Ghi và đọc tiến độ chơi theo từng học sinh**: route `/api/play/chapter` và `/api/play/state` đang có nhưng chưa có contract.
2. **Báo cáo cho người lớn**: route `/api/reports/{id}` và `/api/reports/freeze/{groupId}` đang có nhưng chưa có path parameter/schema; chưa có API danh sách/tổng hợp/filter phục vụ màn báo cáo.
3. **Quản lý Quiz end-to-end**: các route hiện tại chỉ là stub, thiếu list/detail/update/delete, giao bài, danh sách bài được giao, contract nộp bài và kết quả.
4. **Chi tiết hành trình của một học sinh** cho Parent/Teacher: route `/dashboard/learners/:id` hiện chỉ báo “chưa được máy chủ hỗ trợ”.
5. **Dashboard tổng quan người lớn**: chưa có endpoint tổng hợp. Không bắt buộc để chạy chức năng, nhưng nên có để tránh FE gọi nhiều API và tự ghép số liệu không nhất quán.

Nếu chỉ có thời gian làm một đợt, BE nên làm theo thứ tự: **Play progress → Adult learner report → Quiz → Dashboard summary**.

## 2. Hiện trạng thực tế của frontend

### Luồng đang được sử dụng

Các route `/dashboard/parent/*` và `/dashboard/teacher/*` cũ đều chuyển về workspace chung. UI thật đang dùng:

- `/dashboard`: tổng quan tài khoản.
- `/dashboard/learners`: group/slot thật từ API.
- `/dashboard/reports`: hiện đọc dữ liệu mock.
- `/dashboard/groups`: group thật từ API.
- `/dashboard/quiz-management`: hiện đọc/ghi mock và thao tác ghi sẽ bị từ chối.
- `/dashboard/learners/:id`: chưa có dữ liệu.
- `/dashboard/kid/*`: dashboard Kid có API, nhưng bản đồ chương và gameplay chưa ghi tiến độ lên server.

Hai hook cũ `useParentDashboard.js` và `useTeacherDashboard.js` không nằm trong route chính và đang trả lỗi “chưa kết nối API”. Không nên thiết kế API dựa riêng vào dashboard cũ.

### API đã dùng được, không cần làm lại

| Nhóm | API hiện có |
|---|---|
| Account | `GET /api/auth/me` và các API auth/OTP/password/Google |
| Gói | `GET /api/plans`, `GET /api/entitlements` |
| Thanh toán | `POST/GET /api/payments`, kiểm tra/hủy đơn |
| Group | `GET/POST /api/groups`, consent, close, capacity |
| Slot học sinh | create một/nhiều, list theo group, đổi PIN, return, wipe, login |
| Kid summary | `GET /api/learner/dashboard` có schema tương đối đầy đủ |

Lưu ý: response slot hiện chỉ có `id`, `code`, `displayName`, `badge`, `status`, `locked`. Báo cáo không nên dựa vào dữ liệu slot này; cần DTO báo cáo riêng.

## 3. Ma trận thiếu API

| Mức | Chức năng | Trạng thái BE | Việc cần làm |
|---|---|---|---|
| P0 | Lưu checkpoint/kết quả chương | Có route stub | Chốt request/response, idempotency và quyền SLOT |
| P0 | Lấy state/bản đồ chương của Kid | Có route stub | Trả tiến độ chi tiết từng chương, checkpoint để resume |
| P0 | Parent/Teacher xem chi tiết một học sinh | Chưa có API phù hợp | Thêm endpoint adult-scoped, kiểm tra ownership/context |
| P0 | Danh sách báo cáo có filter | Route report hiện không đủ | Thêm endpoint list/summary có phân trang và filter |
| P0 | CRUD Quiz | Chỉ có create stub | Bổ sung list/detail/update/archive và schema đầy đủ |
| P0 | Giao Quiz | Chưa có route rõ ràng | Tạo assignment snapshot, chọn group và/hoặc learner |
| P0 | Kid xem/nộp Quiz | Submit route stub, thiếu list/detail | Không trả đáp án đúng trước khi nộp |
| P0 | Teacher xem kết quả | Có route stub | Thêm schema, phân trang, filter, aggregate |
| P1 | Dashboard Parent/Teacher | Chưa có | Endpoint tổng hợp theo context |
| P1 | CSV export/server snapshot | Freeze stub | Chốt snapshot bất biến và export async/sync |
| P2 | Lịch học, tin nhắn | Chỉ xuất hiện ở UI cũ | Chỉ làm nếu product quyết định khôi phục route cũ |

## 4. Contract P0 đề xuất

Mọi response theo envelope đang dùng:

```json
{ "code": 0, "message": "OK", "result": {} }
```

ID dùng UUID; thời gian dùng ISO-8601 UTC có timezone; tiền là số nguyên VND. API người lớn dùng ACCOUNT bearer, API Kid dùng SLOT bearer.

### 4.1. Ghi tiến độ gameplay

#### `POST /api/play/chapter`

Auth: SLOT. Không cho ACCOUNT token ghi thay học sinh.

```json
{
  "eventId": "01J...",
  "chapterCode": "CH01",
  "contentVersion": "2026.10.1",
  "runId": "uuid",
  "checkpoint": {
    "sceneId": "CH01_SC03_B02",
    "step": 4,
    "state": {}
  },
  "status": "IN_PROGRESS",
  "occurredAt": "2026-10-12T08:30:00+07:00"
}
```

Khi kết thúc, `status = COMPLETED` và gửi thêm:

```json
{
  "outcome": {
    "choiceIds": ["CH01_C01_SAVE"],
    "score": 80,
    "maxScore": 100,
    "earnedAchievementCodes": ["PIGGY_GOLD"]
  }
}
```

Response nên trả state canonical:

```json
{
  "runId": "uuid",
  "chapterCode": "CH01",
  "status": "COMPLETED",
  "checkpoint": null,
  "completedAt": "2026-10-12T01:31:00Z",
  "progressRevision": 7,
  "newAchievements": [{ "code": "PIGGY_GOLD", "earnedAt": "..." }]
}
```

Quy tắc bắt buộc:

- `eventId` là idempotency key; gửi lại cùng event không cộng điểm/huy hiệu hai lần.
- Server không tính logic tài chính của game, nhưng phải kiểm tra chapter/content version hợp lệ và lưu kết quả.
- Checkpoint update dùng optimistic concurrency (`progressRevision`) hoặc server sequence để tránh tab cũ ghi đè tab mới.
- Không tin `learnerId` từ body; lấy learner từ SLOT token.
- Giới hạn kích thước `checkpoint.state` và whitelist dữ liệu cần resume; không nhận blob tùy ý.

#### `GET /api/play/state`

Auth: SLOT.

Response đề xuất:

```json
{
  "contentVersion": "2026.10.1",
  "totalChapters": 8,
  "continueChapter": 2,
  "chapters": [
    {
      "chapterCode": "CH01",
      "number": 1,
      "status": "COMPLETED",
      "percent": 100,
      "completedAt": "...",
      "lastPlayedAt": "...",
      "checkpoint": null
    },
    {
      "chapterCode": "CH02",
      "number": 2,
      "status": "IN_PROGRESS",
      "percent": 35,
      "lastPlayedAt": "...",
      "checkpoint": { "sceneId": "...", "step": 4, "state": {} }
    }
  ]
}
```

`GET /api/learner/dashboard` có thể tiếp tục trả summary; `/api/play/state` là nguồn chi tiết cho bản đồ và resume.

### 4.2. Chi tiết học sinh cho Parent/Teacher

#### `GET /api/adult/learners/{learnerId}`

Auth: ACCOUNT có entitlement đúng context. Nên dùng namespace `/api/adult` để không nhầm SLOT API.

Query tùy chọn: `from`, `to`, `include=progress,quiz,activities,achievements`.

```json
{
  "learner": {
    "id": "uuid",
    "displayName": "Nguyễn An",
    "code": "K7MPQ2XA",
    "badge": "blue",
    "status": "ACTIVE",
    "group": { "id": "uuid", "name": "Lớp 8A", "context": "CLASS" },
    "createdAt": "...",
    "returnedAt": null,
    "lastActiveAt": "..."
  },
  "progress": {
    "totalChapters": 8,
    "completedChapters": 2,
    "continueChapter": 3,
    "lastPlayedAt": "...",
    "chapters": [
      { "number": 1, "status": "COMPLETED", "percent": 100, "completedAt": "..." }
    ]
  },
  "quizSummary": { "assigned": 4, "submitted": 3, "averagePercent": 83 },
  "quizResults": [],
  "achievements": [],
  "recentActivities": []
}
```

Quyền:

- Parent chỉ đọc learner thuộc group `FAMILY` do chính account sở hữu.
- Teacher chỉ đọc learner thuộc group `CLASS` do chính account sở hữu.
- Với account có cả hai plan, scope lấy từ resource ownership, không nhận role tùy ý từ client.
- Learner đã return vẫn được xem lịch sử; learner đã wipe phải ẩn/xóa PII theo chính sách nhưng có thể giữ aggregate ẩn danh.

### 4.3. Danh sách báo cáo

#### `GET /api/adult/reports/learners`

Query:

- `context=FAMILY|CLASS` — bắt buộc nếu account có cả hai plan.
- `groupId`, `learnerId`, `status=ACTIVE|ARCHIVED`.
- `from`, `to` lọc theo thời điểm hoạt động/nộp bài.
- `page`, `size`, `sort`.

```json
{
  "content": [
    {
      "learnerId": "uuid",
      "displayName": "Nguyễn An",
      "code": "K7MPQ2XA",
      "groupId": "uuid",
      "groupName": "Lớp 8A",
      "status": "ACTIVE",
      "chaptersCompleted": 2,
      "totalChapters": 8,
      "lastPlayedAt": "...",
      "quizAssigned": 4,
      "quizSubmitted": 3,
      "averagePercent": 83,
      "lastSubmissionAt": "..."
    }
  ],
  "summary": {
    "totalLearners": 30,
    "activeLearners": 28,
    "activeInRange": 19,
    "chaptersCompleted": 54,
    "quizAssigned": 120,
    "quizSubmitted": 91,
    "averageQuizPercent": 78
  },
  "page": 0,
  "size": 20,
  "totalElements": 30,
  "totalPages": 2
}
```

Endpoint này thay dữ liệu mock mà `Reports.jsx` đang tự ghép từ `learners`, `groups`, `submissions`. Không nên trả toàn bộ đáp án của học sinh trong list.

#### Export

MVP có thể để FE tạo CSV từ các trang đã tải. Nếu báo cáo lớn hoặc cần snapshot chính thức:

- `POST /api/adult/report-exports` với cùng bộ filter.
- `GET /api/adult/report-exports/{id}` trả `PENDING|READY|FAILED` và signed URL hết hạn ngắn.

Route `POST /api/reports/freeze/{groupId}` hiện tại cần đổi thành contract rõ ràng hoặc bỏ; tên `freeze` chưa cho biết snapshot nào, quyền truy cập hay response.

### 4.4. Quiz cho Giáo viên

#### Quiz bank

- `GET /api/teacher/quizzes?page=0&size=20&status=DRAFT`
- `POST /api/teacher/quizzes`
- `GET /api/teacher/quizzes/{quizId}`
- `PUT /api/teacher/quizzes/{quizId}`
- `DELETE /api/teacher/quizzes/{quizId}` hoặc archive mềm

Request create/update:

```json
{
  "title": "Kiểm tra: Chi tiêu thông minh",
  "questions": [
    {
      "id": "optional-stable-id",
      "text": "Nội dung câu hỏi",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 1,
      "explanation": "Giải thích sau khi nộp"
    }
  ],
  "revision": 3
}
```

Response thêm `id`, `status`, `createdAt`, `updatedAt`, `revision`, `assignmentCount`.

Quy tắc:

- 1–100 câu; đúng 4 lựa chọn theo UI hiện tại; `correctIndex` 0–3.
- Không trả đáp án đúng trong DTO dành cho Kid trước khi nộp.
- Sửa quiz không làm đổi assignment đã giao: assignment phải giữ snapshot title/questions/options/correct answer tại thời điểm giao.
- Dùng `revision` để báo conflict khi hai tab cùng sửa.
- Quiz đã có assignment nên archive thay vì hard delete.

#### Giao bài

`POST /api/teacher/assignments`

```json
{
  "quizId": "uuid",
  "groupIds": ["uuid"],
  "learnerIds": ["uuid"],
  "dueAt": "2026-10-20T23:59:59+07:00",
  "resultVisibility": "AFTER_SUBMIT"
}
```

Response:

```json
{
  "id": "uuid",
  "quizId": "uuid",
  "title": "Kiểm tra: Chi tiêu thông minh",
  "questionCount": 3,
  "assignedLearnerCount": 30,
  "createdAt": "...",
  "dueAt": "..."
}
```

BE phải union learner từ group và learner chọn lẻ, loại trùng, chỉ nhận learner ACTIVE thuộc CLASS của teacher. Danh sách learner được chốt tại lúc giao; thêm học sinh vào lớp sau đó không tự được giao, đúng với UI hiện tại.

Thêm:

- `GET /api/teacher/assignments?page=...&quizId=...&status=...`
- `GET /api/teacher/assignments/{id}`
- `POST /api/teacher/assignments/{id}/cancel` nếu chưa có submission, hoặc định nghĩa rõ chính sách hủy.

### 4.5. Quiz cho Kid

- `GET /api/learner/assignments?status=PENDING|COMPLETED`
- `GET /api/learner/assignments/{assignmentId}`
- `POST /api/learner/assignments/{assignmentId}/submissions`
- `GET /api/learner/assignments/{assignmentId}/result`

DTO lấy bài trước khi nộp:

```json
{
  "id": "uuid",
  "title": "...",
  "assignedAt": "...",
  "dueAt": "...",
  "questions": [
    { "id": "uuid", "text": "...", "options": ["A", "B", "C", "D"] }
  ],
  "submission": null
}
```

Request nộp:

```json
{
  "submissionId": "01J...",
  "answers": [
    { "questionId": "uuid", "selectedIndex": 1 }
  ]
}
```

Response sau nộp:

```json
{
  "id": "uuid",
  "status": "SUBMITTED",
  "correct": 2,
  "total": 3,
  "percent": 67,
  "submittedAt": "...",
  "review": [
    {
      "questionId": "uuid",
      "selectedIndex": 1,
      "correctIndex": 2,
      "explanation": "..."
    }
  ]
}
```

Quy tắc: lấy learner từ SLOT token; chỉ nộp assignment được giao; một submission/assignment theo UI hiện tại; `submissionId` chống double click/retry; chấm trên server từ snapshot; quá hạn phải trả mã lỗi riêng; chính sách hiển thị đáp án theo `resultVisibility`.

Route Swagger hiện có `POST /api/quizzes/{id}/submit` dùng từ “quiz id” dễ nhầm quiz template với assignment. Nên dùng `assignmentId` rõ ràng.

### 4.6. Kết quả cho Giáo viên

#### `GET /api/teacher/assignments/{assignmentId}/results`

Query: `status=PENDING|SUBMITTED`, `groupId`, `search`, `page`, `size`, `sort`.

```json
{
  "assignment": {
    "id": "uuid",
    "title": "...",
    "assignedCount": 30,
    "submittedCount": 24,
    "averagePercent": 76,
    "dueAt": "..."
  },
  "content": [
    {
      "learnerId": "uuid",
      "displayName": "Nguyễn An",
      "status": "SUBMITTED",
      "correct": 2,
      "total": 3,
      "percent": 67,
      "submittedAt": "..."
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 30
}
```

`GET /api/teacher/submissions/{submissionId}` trả answers/review chi tiết. Route Swagger `GET /api/quizzes/{id}/results` cần xác định `id` là quiz hay assignment; kết quả chính xác phải gắn với assignment snapshot.

## 5. Endpoint P1: dashboard tổng hợp

Có thể dùng một API chung:

`GET /api/adult/dashboard?context=FAMILY|CLASS`

Parent result:

```json
{
  "learnerCount": 2,
  "activeThisWeek": 2,
  "chaptersCompletedThisWeek": 3,
  "averageProgressPercent": 31,
  "recentActivities": [],
  "learners": []
}
```

Teacher result:

```json
{
  "classCount": 1,
  "learnerCount": 32,
  "activeThisWeek": 25,
  "pendingSubmissions": 8,
  "averageQuizPercent": 76,
  "recentActivities": [],
  "assignments": []
}
```

Không dùng `rating` hoặc “streakChild” từ UI cũ nếu product chưa định nghĩa công thức. Mọi metric phải có định nghĩa cố định: timezone, khoảng thời gian, mẫu số và cách xử lý learner chưa có dữ liệu.

## 6. Những API chưa nên yêu cầu ở đợt này

UI cũ có menu lịch học và tin nhắn, nhưng route chính hiện không cung cấp màn hình tương ứng. Chỉ thiết kế calendar/messaging sau khi product trả lời:

- Ai được nhắn ai; Parent hiện không có quan hệ trực tiếp với Teacher trong mô hình group/slot.
- Có moderation, attachment, read receipt, retention và báo cáo nội dung hay không.
- Lịch là deadline Quiz, lịch cá nhân hay lịch lớp.

Nếu chỉ cần deadline, dùng `dueAt` của assignment trước, chưa cần một calendar service riêng.

## 7. Quyền, bảo mật và riêng tư bắt buộc

- Tách ACCOUNT token và SLOT token; không chấp nhận nhầm loại token.
- Mọi query adult phải scope theo `accountId` từ JWT và ownership trong DB, không nhận `ownerId` từ client.
- Parent không đọc student CLASS; Teacher không đọc child FAMILY; account hai gói vẫn phải scope từng resource.
- Teacher chỉ giao/đọc kết quả học sinh thuộc lớp của mình.
- PIN lưu dạng hash mạnh; API không bao giờ trả PIN. Đổi PIN phải vô hiệu toàn bộ SLOT token cũ.
- `return` giữ lịch sử học tập nhưng chặn đăng nhập; `wipe` cần định nghĩa rõ dữ liệu nào xóa, dữ liệu aggregate nào ẩn danh và audit nào phải giữ.
- Không log token, PIN, đáp án chưa công bố hoặc checkpoint chứa dữ liệu cá nhân.
- Rate-limit slot login, submit quiz, checkpoint; audit các thao tác consent, return, wipe, giao bài và export.
- CSV phải chống formula injection: prefix/escape ô bắt đầu bằng `=`, `+`, `-`, `@`.

## 8. Mã lỗi đề xuất

Giữ các mã hiện có (3003 auth hết hạn, 3004 forbidden, 3005 entitlement hết hạn, 3006 hết slot, 3007/3009 slot không còn hiệu lực, 5001–5004 group/slot). Bổ sung nhóm riêng:

| Code | Ý nghĩa |
|---|---|
| 6001 | Quiz không tồn tại/không thuộc teacher |
| 6002 | Quiz validation lỗi |
| 6003 | Assignment không tồn tại/không được giao |
| 6004 | Assignment đã quá hạn |
| 6005 | Đã nộp bài |
| 6006 | Submission không hợp lệ |
| 6007 | Revision conflict |
| 6101 | Chapter/content version không hợp lệ |
| 6102 | Checkpoint conflict |
| 6103 | Play event đã tồn tại nhưng payload khác |
| 6201 | Report filter không hợp lệ |
| 6202 | Không có quyền xem learner/report |

HTTP status vẫn phải đúng: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 duplicate/conflict, 410 expired/archived nếu phù hợp, 429 rate limit.

## 9. Database tối thiểu gợi ý

- `chapter_runs`: learner, chapter_code, content_version, status, checkpoint JSON giới hạn, revision, timestamps.
- `play_events`: event_id unique, run_id, type/status, payload hash, occurred_at, received_at.
- `learner_achievements`: unique `(learner_id, achievement_code)`.
- `quizzes`, `quiz_questions`, `quiz_options` cho template.
- `assignments`, `assignment_recipients` và **assignment snapshot**.
- `submissions`, `submission_answers`, unique `(assignment_id, learner_id)`.
- Index theo `(owner_account_id, context/status)`, `(learner_id, submitted_at)`, `(assignment_id, submitted_at)`.

Không dùng JSON cho toàn bộ Quiz/report nếu cần filter và aggregate; JSON chỉ hợp lý cho snapshot/checkpoint có version.

## 10. Tiêu chí nghiệm thu cho BE

1. OpenAPI có request/response schema thật cho mọi P0 endpoint; không còn response `200` rỗng.
2. Có test phân quyền chéo Parent/Teacher, chéo account và ACCOUNT/SLOT token.
3. Retry checkpoint/nộp quiz không tạo bản ghi hoặc điểm trùng.
4. Sửa quiz không thay đổi assignment cũ.
5. Return slot giữ report nhưng SLOT token hết hiệu lực; wipe tuân thủ chính sách PII đã chốt.
6. Filter report cho kết quả ổn định với timezone `Asia/Ho_Chi_Minh`; lưu DB bằng UTC.
7. List endpoint có phân trang, giới hạn `size` và sort whitelist.
8. Không trả `correctIndex` cho Kid trước khi được phép xem kết quả.
9. Dashboard Kid, bản đồ chương, báo cáo adult và kết quả Quiz đều đọc cùng nguồn dữ liệu canonical.
10. Swagger production phản ánh đúng contract, kèm ví dụ success/error để FE viết client và test mock.

## 11. Điểm FE cần sửa sau khi BE hoàn tất

- Bỏ `workspaceMockData()` khỏi `useWorkspace.js`.
- Thay `dispatch()` trong `Quiz.jsx` bằng API client thật.
- Cho `Reports.jsx` đọc endpoint report thay vì `reportRows(db, ...)`.
- Cho `LearnerDetail` gọi API chi tiết learner.
- `useUserLessons` phải dùng `/api/play/state`; hiện mọi chương luôn 0% và chương 1 luôn `current`.
- `VisualNovelPlayer`/`StoryPlayer` cần phát checkpoint/completed event vào `/api/play/chapter`.
- Sau submit Quiz hoặc hoàn thành chapter, invalidate/refetch `/api/learner/dashboard`.

