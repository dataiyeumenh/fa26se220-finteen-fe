<div align="center">

<img src="public/brand/finteen-logo-v2.webp" alt="FinTeen" width="280" />

### Hiểu tiền hôm nay. Tự tin ngày mai.

Game học tài chính cá nhân cho trẻ 8–18 tuổi. Mỗi chương là một tình huống đời thường: tiền tiêu vặt, tháng lương đầu tiên, vay mượn, biến cố bất ngờ… Trẻ tự chọn và tự trả giá cho lựa chọn của mình. Phụ huynh và giáo viên theo dõi tiến bộ qua báo cáo.

[**▶ Chơi thử bản demo**](https://fa26se220-finteen-fe.vercel.app) · [Backend](https://github.com/NamHungBBB1/do-an-BE)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## FinTeen có gì

| Ai dùng | Làm được gì |
| --- | --- |
| **Trẻ** | Đăng nhập bằng **mã + PIN** do phụ huynh/giáo viên cấp, không cần email. Đi bản đồ hành trình qua từng chương visual novel, chơi mini-game (tính lương thực nhận, so lãi suất, xử lý tin nhắn lừa đảo…), làm quiz, xem báo cáo cuối chương, chọn sở thích để nội dung gần gũi hơn. |
| **Phụ huynh** | Mua gói gia đình qua mã QR VietQR, tạo tối đa 4 hồ sơ cho con, trả lời vài câu cá nhân hoá, xem tiến độ và 5 chỉ số tài chính của từng bé. |
| **Giáo viên** | Mở lớp tối đa 40 học sinh, giao và chấm quiz, xem báo cáo cả lớp lẫn từng em. |
| **Nội bộ** | **Content Studio** (soạn → duyệt → phát hành chương, kho ảnh, giọng đọc, gợi ý bằng AI) và trang quản trị (tài khoản, giao dịch, phân quyền). |

**Một nguồn nội dung.** Mọi chương đều tải từ bản phát hành hiện hành của API, frontend không gắn cứng chương nào. Studio phát hành bản mới thì bản đồ, game và báo cáo tự cập nhật theo.

## Bắt đầu nhanh

Cần **Node.js 20.19+ hoặc 22.12+** (yêu cầu của Vite 8) và npm.

```bash
git clone https://github.com/dataiyeumenh/fa26se220-finteen-fe.git
cd fa26se220-finteen-fe
npm install
cp .env.example .env      # điền giá trị cấu hình
npm run dev               # http://localhost:5173
```

## Kiến trúc trong 30 giây

```
Trình duyệt ──► React SPA (Vercel) ──► FinTeen API (Spring Boot)
                   │                       │
                   │  ACCOUNT token         ├─ /api/auth, /api/slots, /api/payments …  (người lớn)
                   │  SLOT token            ├─ /api/play/…                              (trẻ)
                   │                       └─ /api/content/current                      (công khai)
```

- **Hai loại phiên, không bao giờ trộn.** Người lớn dùng token `ACCOUNT`, trẻ dùng token `SLOT`. Trẻ đăng nhập trên máy của phụ huynh thì phiên phụ huynh bị đóng hẳn.
- **Server tính điểm.** FE chỉ gửi "chọn gì ở cảnh nào, phiên bản nào". Tiền, chỉ số và báo cáo người lớn do backend tự tính lại từ bản phát hành đã đóng băng.
- **Không mất tiến độ.** Checkpoint lưu trong trình duyệt. Kết quả chương gửi lỗi do mạng thì giữ lại và tự gửi lại lần sau.
- **Cá nhân hoá phía server.** Nội dung theo giới tính / độ tuổi / sở thích do backend ghép sẵn, FE chỉ hiển thị.

## Cấu trúc thư mục

```
src/
├── api/                  # HTTP client, phiên ACCOUNT/SLOT, content, personalization
├── features/
│   ├── auth/             # đăng nhập, đăng ký, Google
│   ├── workspace/        # khung dashboard, guard, gói & thanh toán
│   ├── personalization/  # câu hỏi cá nhân hoá
│   ├── studio/           # Content Studio (editor, reviewer, manager)
│   └── internal/         # cổng nội bộ + phân quyền
├── pages/
│   ├── Kid/              # bản đồ, game visual novel, mini-game, quiz
│   ├── Parent/  Teacher/ # dashboard, hồ sơ trẻ, lớp, báo cáo
│   ├── LearnerReport/    # báo cáo từng trẻ
│   └── Admin/            # quản trị
├── components/           # UI dùng chung (loading, ErrorBoundary…)
└── hooks/
public/images/finteen-v2/ # nhân vật, bối cảnh, mini-game theo chương
tests/                    # unit test + browser test
docs/                     # tài liệu kỹ thuật
```
