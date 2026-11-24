# Report 3 · Screen Flow Diagrams · Bản duyệt 3

Sáu hình cho mục 3.1.1, Figure 3-1–3-6. **Đã cập nhật vào Google Docs sau khi người dùng duyệt.**

[Report 3](https://docs.google.com/document/d/1z7dn2BFdA1OOdRYj-f7lyCGrbciKAE5ecvUgvHJY_Os) · [Nguồn draw.io trên Drive](https://drive.google.com/drive/folders/1ngLNwwR8ULyT_Po3ipwRkc8D3PHW5VcS)

Đã trim sát từng sơ đồ, đưa chú giải cách hình 24 px, thay sáu ảnh, cập nhật đoạn giới thiệu và thêm Record of Changes dưới tên Lê Hoàng Anh ngày 09/11/2026. Caption từng hình có link nguồn draw.io riêng. Readback xác nhận giữ heading, 16 bảng và tổng 54 ảnh. Xuất PDF từ Drive trả HTTP 403 Forbidden, nên chưa xác minh phân trang bằng PDF.

[Xem PDF sáu trang](report3-screen-flows-review.pdf) · [Xem từng hình](index.html) · [Nguồn draw.io gộp sáu trang](report3-screen-flows.drawio)

## Điều chỉnh theo phản hồi của lead

| Yêu cầu | Bản hiện tại |
| --- | --- |
| Ký hiệu có chú giải | Chỉ còn hai loại: hình chữ nhật xanh có mã SC = screen/tab; capsule trắng = action/form/dialog. Có chú giải trong mọi SVG, PNG và draw.io. |
| Cỡ chữ và tỉ lệ đồng nhất | Arial 22 px, graph scale 1:1, PNG xuất 2x. Bản đưa vào Docs trim canvas theo từng hình để bỏ khoảng trắng; kích thước chèn dùng chung tỉ lệ để giữ cỡ chữ tương ứng. |
| Bỏ tiêu đề trong ảnh | SVG/PNG/PDF không chứa dòng Figure 3-x. Tên chỉ nằm ngoài hình ở trang xem HTML hoặc tên trang draw.io; caption sẽ do tài liệu quản lý. |
| Import Quiz là mock | Teacher ghi Import quiz (sample), đúng với teacherQuizApi.importQuiz gọi mock.create; không thể hiện thành API import thật. |
| Tách đường đăng nhập Public | Public chuyển sang top-down; bỏ nhãn Sign in dư thừa; Adult sign-in, OTP và Google sign-in dùng các đường riêng. Kiểm tra tọa độ connector không có đoạn chồng nhau. |
| Có draw.io riêng | Mỗi hình có file draw.io một trang, xem bảng dưới; node và connector sửa được. |

| Hình | Nguồn Mermaid | Nguồn draw.io |
| --- | --- | --- |
| 3-1 · Public | [Mermaid](figure-3-1-public.mmd) | [draw.io](figure-3-1-public.drawio) |
| 3-2 · Parent | [Mermaid](figure-3-2-parent.mmd) | [draw.io](figure-3-2-parent.drawio) |
| 3-3 · Teacher | [Mermaid](figure-3-3-teacher.mmd) | [draw.io](figure-3-3-teacher.drawio) |
| 3-4 · Learner | [Mermaid](figure-3-4-learner.mmd) | [draw.io](figure-3-4-learner.drawio) |
| 3-5 · Studio | [Mermaid](figure-3-5-studio.mmd) | [draw.io](figure-3-5-studio.drawio) |
| 3-6 · Admin | [Mermaid](figure-3-6-admin.mmd) | [draw.io](figure-3-6-admin.drawio) |

Mỗi màn có một node duy nhất trong mỗi hình. Các action/form/dialog không có mã SC riêng vì không phải route độc lập. T01–T06 là các tab của SC-13; dùng mã đầy đủ SC-13.T01–SC-13.T06.

Sơ đồ ưu tiên đường đi chính. Menu dùng chung được biểu diễn từ dashboard/overview; không lặp mọi đường quay về, đóng popup hoặc đăng xuất. Public bao gồm guest demo và player demo. Learner Quiz chỉ dành cho CLASS. Menu và thao tác Studio phụ thuộc role; đối chiếu ma trận quyền ở mục 3.1.3.

## Nguồn và render

Đối chiếu với bảng Screen Descriptions trong Report 3 và source: `src/App.jsx`, `src/features/workspace/WorkspaceLayout.jsx`, `AuthForm.jsx`, `KidPages.jsx`, `src/pages/Homepage.jsx`, component Parent Learners, Teacher Groups/Quiz, Kid Quiz/Player, `src/features/studio/portalMenu.js`, các page Studio và `src/pages/Admin/Dashboard/components/AdminDashboardContent.jsx`. Mock import nằm trong `src/pages/Teacher/Quiz/api/teacherQuizApi.js`.

```powershell
node --experimental-websocket docs/diagrams/report3-screen-flows/render-preview.mjs
```

Dùng Mermaid 11.12.0 + ELK 0.1.9, Chrome headless và CDN. Renderer trim canvas theo graph, giữ nguyên scale/font, thêm chú giải gần hình và xuất từng file draw.io. Kết quả đo font/canvas và kiểm tra nằm trong validation.json; bằng chứng cập nhật Docs ở output/rp3-screen-flow-review/published-update.json. File Mermaid giữ nội dung; SVG/PNG/draw.io bao gồm chú giải do renderer bổ sung. Có thể mở draw.io bằng extension Draw.io Integration hoặc ứng dụng diagrams.net.
