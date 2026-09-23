import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Trang công khai và xác thực
import Homepage from '@/pages/Homepage'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import { AuthLayout } from '@/pages/auth/AuthLayout'

// Dashboard CHUNG cho người lớn: Guest / Parent / Teacher
import {
  Overview as SharedDashboard,
  Plans,
  Settings,
  LearnerHome as KidDashboard,
} from '@/features/workspace/Overview'
import { Learners, LearnerDetail, Groups } from '@/features/workspace/Learners'
import Reports from '@/features/workspace/Reports'
// Hai màn hình khác nhau: Teacher quản lý đề, Kid làm bài.
import { TeacherQuizManagement, KidQuiz } from '@/features/workspace/Quiz'

// Khu vực RIÊNG của role kid: Bài học / Trò chơi / Cửa hàng / Quiz
import UserLessons from '@/pages/User/Dashboard/UserLessons'
import UserGames from '@/pages/User/Dashboard/UserGames'
import { KidGames, KidShop, GuestDemo } from '@/features/workspace/KidPages'

// Layout và kiểm tra quyền truy cập
import {
  RequireAccount,
  Shell as DashboardShell,
  AccountHome,
  LessonsEntry,
  LegacyGameEntry,
  ChapterGuard,
  NotFound,
} from '@/features/workspace/Guards'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. CÔNG KHAI */}
        <Route path="/" element={<Homepage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAccount />}>
          {/* 2. DASHBOARD CHUNG — Guest / Parent / Teacher quản lý tài khoản và gói */}
          {/* Bài học, Trò chơi và Cửa hàng không nằm trong dashboard người lớn. */}
          <Route element={<RequireAccount kind="adult" />}>
            <Route element={<DashboardShell />}>
              <Route path="/dashboard" element={<SharedDashboard />} />
              <Route path="/dashboard/plans" element={<Plans />} />
              <Route path="/dashboard/settings" element={<Settings />} />

              {/* 2a. PARENT + TEACHER — quản lý 4 / 40 slot và báo cáo */}
              <Route element={<RequireAccount roles={['parent', 'teacher']} />}>
                <Route path="/dashboard/learners" element={<Learners />} />
                <Route path="/dashboard/learners/:id" element={<LearnerDetail />} />
                <Route path="/dashboard/reports" element={<Reports />} />
              </Route>

              {/* 2b. RIÊNG TEACHER — Quản lý Quiz: tạo đề, giao bài, theo dõi kết quả */}
              <Route element={<RequireAccount roles={['teacher']} />}>
                <Route path="/dashboard/groups" element={<Groups />} />
                <Route path="/dashboard/quiz-management" element={<TeacherQuizManagement />} />
              </Route>
            </Route>
          </Route>

          {/* 3. RIÊNG KID — cả con của Parent và học sinh của Teacher đều có role kid */}
          <Route element={<RequireAccount roles={['kid']} />}>
            <Route element={<DashboardShell />}>
              <Route path="/dashboard/kid" element={<KidDashboard />} />
              <Route path="/dashboard/kid/games" element={<KidGames />} />
              <Route path="/dashboard/kid/shop" element={<KidShop />} />

              {/* QUIZ CỦA KID — làm bài, nộp bài và xem kết quả giáo viên giao. */}
              {/* Áp dụng cho Kid thuộc gói Teacher. */}
              <Route element={<RequireAccount plans={['teacher']} />}>
                <Route path="/dashboard/kid/quiz" element={<KidQuiz />} />
              </Route>
            </Route>

            {/* Hai trang hiện tại đã có layout bên trong, không bọc thêm DashboardShell. */}
            <Route path="/dashboard/kid/lessons" element={<UserLessons />} />
            <Route
              path="/dashboard/kid/play"
              element={<ChapterGuard><UserGames /></ChapterGuard>}
            />
          </Route>

          {/* 4. RIÊNG GUEST — chỉ dùng thử chương 1, không vào khu vực Kid */}
          <Route element={<RequireAccount roles={['guest']} />}>
            <Route element={<DashboardShell />}>
              <Route path="/dashboard/demo" element={<GuestDemo />} />
            </Route>
            <Route
              path="/dashboard/demo/play"
              element={<ChapterGuard><UserGames /></ChapterGuard>}
            />
          </Route>

          {/* 5. LINK CŨ — chuyển hướng về đúng khu vực, không phải dashboard riêng */}
          <Route path="/dashboard/quiz" element={<Navigate to="/dashboard/quiz-management" replace />} />
          <Route path="/dashboard/user" element={<AccountHome />} />
          <Route path="/dashboard/learner" element={<AccountHome />} />
          <Route path="/dashboard/learner/quiz" element={<Navigate to="/dashboard/kid/quiz" replace />} />
          <Route path="/dashboard/lessons" element={<LessonsEntry />} />
          <Route path="/dashboard/user/lessons" element={<LessonsEntry />} />
          <Route path="/dashboard/user/games" element={<LegacyGameEntry />} />
          <Route path="/dashboard/user/shop" element={<Navigate to="/dashboard/kid/shop" replace />} />
          <Route path="/dashboard/parent/*" element={<AccountHome />} />
          <Route path="/dashboard/teacher/*" element={<AccountHome />} />
          <Route path="/dashboard/admin/*" element={<AccountHome />} />
          <Route path="/dashboard/*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
