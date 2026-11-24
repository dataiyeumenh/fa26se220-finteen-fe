# Kiến trúc FinTeen frontend

Phân tích source trong working tree ngày **09/11/2026**. Các sơ đồ mô tả hành vi hiện có của frontend React/Vite, bao gồm các thay đổi chưa commit tại thời điểm phân tích. Mỗi sơ đồ có nguồn Mermaid `.mmd`, bản vector `.svg` và bản xem nhanh `.png` cùng tên.

| Sơ đồ | Nguồn chỉnh sửa | Xem SVG |
| --- | --- | --- |
| 01 · Bối cảnh hệ thống và dịch vụ ngoài | [Mermaid](01-system-context.mmd) | [SVG](01-system-context.svg) |
| 02 · Thành phần frontend, API client và bộ nhớ | [Mermaid](02-frontend-components.mmd) | [SVG](02-frontend-components.svg) |
| 03 · Xác thực ACCOUNT và SLOT | [Mermaid](03-authentication.mmd) | [SVG](03-authentication.svg) |
| 04 · Tải nội dung, checkpoint và gửi kết quả game | [Mermaid](04-game-content-and-progress.mmd) | [SVG](04-game-content-and-progress.svg) |
| 05 · Content Studio và ranh giới phát hành | [Mermaid](05-studio-and-publication.mmd) | [SVG](05-studio-and-publication.svg) |

## Cách đọc và phạm vi

Đây là một ứng dụng chạy trong trình duyệt, gọi API tại `VITE_API_BASE_URL`. Các màn Parent, Teacher, Kid, Admin và Studio là module của cùng frontend, không phải các dịch vụ triển khai độc lập. Màu xanh đánh dấu thành phần chính, vàng đánh dấu bộ nhớ/mock, xám đánh dấu hệ thống ngoài. Mũi tên liền biểu diễn quan hệ đọc được từ source; quan hệ phát hành Studio → nội dung công khai được vẽ nét đứt vì chỉ suy luận từ hợp đồng API.

Repository không chứa controller, middleware hay schema database của backend. Vì vậy bộ sơ đồ không khẳng định công nghệ backend, cấu trúc database, cơ chế chấm điểm hoặc triển khai hạ tầng phía máy chủ. Các endpoint trong hình là endpoint frontend thực sự gọi; chưa thực hiện kiểm thử API trực tiếp.

## Kết quả phân tích đáng chú ý

- `main.jsx` khởi động xác thực, còn `App.jsx` định tuyến khu vực công khai, workspace và `/internal/*`. Khu nội bộ được lazy load. `RequireAccount` kiểm tra `kind`, `role`, `plan`; `InternalApp` kiểm tra danh sách `actor.roles`.
- `auth` là external store dùng chung. `useWorkspace` đọc store qua `useSyncExternalStore`. Token ACCOUNT/SLOT và hạn dùng được lưu trong **sessionStorage**; context parent/teacher được lưu riêng trong **localStorage**. Client phân biệt `publicRequest`, `accountRequest`, `slotRequest`, kiểm tra hạn dùng và xử lý `ApiResponse.code`.
- Google login là tùy chọn khi đủ cấu hình Firebase. Popup trả ID token để frontend đổi lấy phiên ACCOUNT qua `/api/auth/login/google`; đây không phải phiên dữ liệu Firestore.
- `KidGames` tải mọi chương qua `getChapterContent`, lấy release hiện tại rồi tải chương theo URL có phiên bản. `currentRelease` được cache trong bộ nhớ module. `resolveContentImages` chỉ đổi đường dẫn ảnh local đã biết sang WebP; giữ URL ảnh upload/CDN.
- `VisualNovelPlayer` điều khiển cảnh, điều kiện, lựa chọn, inspect và mini-game. Checkpoint được lưu theo `finteen:vn:{data.id}`, **chưa có mã người học trong khóa**, ưu tiên localStorage và dự phòng sessionStorage. Không đồng nhất checkpoint này với tiến độ chính thức trên API.
- Khi tới ending, `playBatch` chỉ gửi cho người có mã SLOT và dữ liệu có `releaseVersion`/chapter hợp lệ. Luồng lấy `/api/play/state` trước khi gửi `/api/play/chapter`. Lỗi mạng hoặc HTTP 5xx được giữ theo mã SLOT để gửi lại khi mở game; lỗi HTTP 4xx không được giữ để retry. Guest không gửi kết quả bằng luồng SLOT.
- `teacherQuizApi.importQuiz` dùng `createMockQuizApi` và localStorage. Danh sách quiz ghép kết quả API với bản mock; không thể mô tả toàn bộ chức năng quiz là đã lưu trên backend. Player còn có `endingReportMock` và dashboard có fallback thành tích mẫu.
- `canReview` yêu cầu draft `SUBMITTED`, người duyệt có quyền và khác `editorId`. `canPublish` yêu cầu mọi draft trong kế hoạch được `APPROVED`, có người sửa và người phát hành khác người sửa. Đây là điều kiện giao diện; việc backend thực thi tương ứng chưa được kiểm tra.
- Chú thích ở `App.jsx` nói guest chỉ thử chương 1, nhưng `model.js:canAccessChapter` hiện cho guest truy cập chương **1–8**. Các sơ đồ dựa trên điều kiện code. Một số README/comment cũ còn nói game dùng file tĩnh hoặc hệ thống chỉ là demo; đường chạy hiện tại gọi API.

## Bằng chứng source

| Phạm vi | File tham chiếu |
| --- | --- |
| Bootstrap, route, build và SPA hosting | [main.jsx](../../src/main.jsx), [App.jsx](../../src/App.jsx), [vite.config.js](../../vite.config.js), [vercel.json](../../vercel.json) |
| Phiên, transport, Google login | [auth.api.js](../../src/api/auth.api.js), [auth.client.js](../../src/api/auth.client.js), [config.js](../../src/api/config.js), [firebase.js](../../src/api/firebase.js) |
| Store và quyền workspace | [useWorkspace.js](../../src/features/workspace/useWorkspace.js), [Guards.jsx](../../src/features/workspace/Guards.jsx), [model.js](../../src/features/workspace/model.js) |
| API người lớn và quiz | [workspaceApi.js](../../src/features/workspace/api/workspaceApi.js), [parentLearnersApi.js](../../src/pages/Parent/Learners/api/parentLearnersApi.js), [teacherGroupsApi.js](../../src/pages/Teacher/Groups/api/teacherGroupsApi.js), [teacherQuizApi.js](../../src/pages/Teacher/Quiz/api/teacherQuizApi.js), [kidQuizApi.js](../../src/pages/Kid/Quiz/api/kidQuizApi.js) |
| Nội dung và game runtime | [KidGames.jsx](../../src/pages/Kid/Dashboard/KidGames.jsx), [content.api.js](../../src/api/content.api.js), [imageAssets.js](../../src/lib/imageAssets.js), [VisualNovelPlayer.jsx](../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx) |
| Checkpoint, kết quả, dashboard | [visualNovelProgress.js](../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js), [playBatch.js](../../src/pages/Kid/Dashboard/components/game/playBatch.js), [kidDashboardApi.js](../../src/pages/Kid/Dashboard/api/kidDashboardApi.js), [useKidDashboard.js](../../src/pages/Kid/Dashboard/hooks/useKidDashboard.js) |
| Portal nội bộ và quyền Studio | [InternalApp.jsx](../../src/features/internal/InternalApp.jsx), [access.js](../../src/features/internal/access.js), [StudioWorkspace.jsx](../../src/features/internal/StudioWorkspace.jsx), [permissions.js](../../src/features/studio/permissions.js), [portalMenu.js](../../src/features/studio/portalMenu.js) |
| Editor, preview và phát hành | [EditorPage.jsx](../../src/features/studio/EditorPage.jsx), [SceneDialogs.jsx](../../src/features/studio/SceneDialogs.jsx), [ChaptersPage.jsx](../../src/features/studio/ChaptersPage.jsx), [ReleasesPage.jsx](../../src/features/studio/ReleasesPage.jsx), [studioClient.js](../../src/features/studio/studioClient.js) |

## Render và kiểm tra

Chạy tại thư mục repository:

```powershell
node --experimental-websocket docs/diagrams/render.mjs
```

Script dùng Chrome headless có sẵn và Mermaid **11.12.0** từ jsDelivr; cần kết nối CDN khi render. Có thể đặt `CHROME_PATH` nếu Chrome nằm ở đường dẫn khác. Script chỉ phục vụ trang render tại localhost, parse từng `.mmd`, xuất SVG/PNG và ghi kết quả vào [validation.json](validation.json). Không cần cài thêm dependency cho ứng dụng. SVG dùng nhãn văn bản để thuận tiện nhúng vào tài liệu; mở SVG để xem ở kích thước đầy đủ, PNG chỉ là bản xem nhanh.

Đã parse và render thành công 5/5 sơ đồ, xem trực quan các bản PNG và kiểm tra đủ 45 liên kết trong tài liệu này. Không thay đổi logic ứng dụng. Lưu ý: `.gitignore` hiện bỏ qua toàn bộ `/docs/`, nên các file này đã lưu trên máy nhưng không xuất hiện trong `git status` mặc định.
