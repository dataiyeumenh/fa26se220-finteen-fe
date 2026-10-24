import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { lazy, Suspense } from "react";
const InternalApp = lazy(() => import("@/features/internal/InternalApp"));

// Trang công khai và xác thực
import Homepage from "@/pages/Homepage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AuthForm from "@/features/workspace/AuthForm";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import InternalAuthLayout from "@/pages/auth/InternalAuthLayout";

// Dashboard CHUNG cho người lớn: Guest / Parent / Teacher
import {
  Overview as SharedDashboard,
  Plans,
  Settings,
} from "@/features/workspace/Overview";
import { useWorkspace } from "@/features/workspace/useWorkspace";
import ParentLearners from "@/pages/Parent/Learners/ParentLearners";
import TeacherGroups from "@/pages/Teacher/Groups/TeacherGroups";
import ParentReports from "@/pages/Parent/Reports/ParentReports";
import TeacherReports from "@/pages/Teacher/Reports/TeacherReports";
// Hai màn hình khác nhau: Teacher quản lý đề, Kid làm bài.
import KidQuiz from "@/pages/Kid/Quiz/KidQuiz";
import KidQuizTake from "@/pages/Kid/Quiz/KidQuizTake";
import TeacherQuizManagement from "@/pages/Teacher/Quiz/TeacherQuizManagement";
import ParentDashboard from "@/pages/Parent/Dashboard/ParentDashboard";
import TeacherDashboard from "@/pages/Teacher/Dashboard/TeacherDashboard";
import LearnerReport from "@/pages/LearnerReport/LearnerReport";

// Khu vực RIÊNG của role kid: Bài học / Trò chơi / Cửa hàng / Quiz
import KidDashboard from "@/pages/Kid/Dashboard/KidDashboard";
import KidLessons from "@/pages/Kid/Dashboard/KidLessons";
import KidGamesPage from "@/pages/Kid/Dashboard/KidGames";
import KidAchievements from "@/pages/Kid/Dashboard/KidAchievements";
import { GuestDemo } from "@/features/workspace/KidPages";

// Layout và kiểm tra quyền truy cập
import {
  RequireAccount,
  Shell as DashboardShell,
  AccountHome,
  LessonsEntry,
  LegacyGameEntry,
  ChapterGuard,
  NotFound,
} from "@/features/workspace/Guards";

function AdultLearners() {
  const { actor } = useWorkspace();
  return actor.role === "teacher" ? (
    <TeacherGroups groupsOnly={false} />
  ) : (
    <ParentLearners />
  );
}

function AdultReports() {
  const { actor } = useWorkspace();
  return actor.role === "teacher" ? <TeacherReports /> : <ParentReports />;
}

function AdultDashboard() {
  const { actor } = useWorkspace();
  if (actor.role === "parent") return <ParentDashboard />;
  if (actor.role === "teacher") return <TeacherDashboard />;
  return <SharedDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/internal/*"
          element={
            <Suspense
              fallback={<p role="status">Đang tải không gian nội bộ…</p>}
            >
              <InternalApp />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/editor/*"
          element={<Navigate to="/internal" replace />}
        />
        <Route
          path="/dashboard/reviewer/*"
          element={<Navigate to="/internal" replace />}
        />
        <Route
          path="/dashboard/manager/*"
          element={<Navigate to="/internal" replace />}
        />
        <Route
          path="/dashboard/admin/*"
          element={<Navigate to="/internal" replace />}
        />
        {/* 1. CÔNG KHAI */}
        <Route path="/" element={<Homepage />} />
        <Route element={<InternalAuthLayout />}>
          <Route path="/internal/login" element={<AuthForm internal />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<RequireAccount />}>
          {/* 2. DASHBOARD CHUNG — Guest / Parent / Teacher quản lý tài khoản và gói */}
          {/* Bài học, Trò chơi và Cửa hàng không nằm trong dashboard người lớn. */}
          <Route element={<RequireAccount kind="adult" />}>
            <Route element={<DashboardShell />}>
              <Route path="/dashboard" element={<AdultDashboard />} />
              <Route path="/dashboard/plans" element={<Plans />} />
              <Route path="/dashboard/settings" element={<Settings />} />

              {/* 2a. PARENT + TEACHER — quản lý 4 / 40 slot và báo cáo */}
              <Route element={<RequireAccount roles={["parent", "teacher"]} />}>
                <Route path="/dashboard/learners" element={<AdultLearners />} />
                <Route
                  path="/dashboard/learners/:id"
                  element={<LearnerReport />}
                />
                <Route path="/dashboard/reports" element={<AdultReports />} />
              </Route>

              {/* 2b. RIÊNG TEACHER — Quản lý Quiz: tạo đề, giao bài, theo dõi kết quả */}
              <Route element={<RequireAccount roles={["teacher"]} />}>
                <Route path="/dashboard/groups" element={<TeacherGroups />} />
                <Route
                  path="/dashboard/quiz-management"
                  element={<TeacherQuizManagement />}
                />
              </Route>
            </Route>
          </Route>

          {/* 3. RIÊNG KID — cả con của Parent và học sinh của Teacher đều có role kid */}
          <Route element={<RequireAccount roles={["kid"]} />}>
            <Route element={<DashboardShell />}>
              <Route path="/dashboard/kid" element={<KidDashboard />} />
              <Route path="/dashboard/kid/games" element={<KidGamesPage />} />
              <Route
                path="/dashboard/kid/achievements"
                element={<KidAchievements />}
              />
              <Route path="/dashboard/kid/lessons" element={<KidLessons />} />
              <Route
                path="/dashboard/kid/play"
                element={
                  <ChapterGuard>
                    <KidGamesPage />
                  </ChapterGuard>
                }
              />
              <Route
                path="/dashboard/kid/shop"
                element={<Navigate to="/dashboard/kid/lessons" replace />}
              />

              {/* QUIZ CỦA KID — làm bài, nộp bài và xem kết quả giáo viên giao. */}
              {/* Áp dụng cho Kid thuộc gói Teacher. */}
              <Route element={<RequireAccount plans={["teacher"]} />}>
                <Route path="/dashboard/kid/quiz" element={<KidQuiz />} />
                <Route
                  path="/dashboard/kid/quiz/:id"
                  element={<KidQuizTake />}
                />
              </Route>
            </Route>
          </Route>

          {/* 4. RIÊNG GUEST — chỉ dùng thử chương 1, không vào khu vực Kid */}
          <Route element={<RequireAccount roles={["guest"]} />}>
            <Route element={<DashboardShell />}>
              <Route path="/dashboard/demo" element={<GuestDemo />} />
              <Route
                path="/dashboard/demo/play"
                element={
                  <ChapterGuard>
                    <KidGamesPage />
                  </ChapterGuard>
                }
              />
            </Route>
          </Route>

          {/* 5. LINK CŨ — chuyển hướng về đúng khu vực, không phải dashboard riêng */}
          <Route
            path="/dashboard/quiz"
            element={<Navigate to="/dashboard/quiz-management" replace />}
          />
          <Route path="/dashboard/user" element={<AccountHome />} />
          <Route path="/dashboard/learner" element={<AccountHome />} />
          <Route
            path="/dashboard/learner/quiz"
            element={<Navigate to="/dashboard/kid/quiz" replace />}
          />
          <Route path="/dashboard/lessons" element={<LessonsEntry />} />
          <Route path="/dashboard/user/lessons" element={<LessonsEntry />} />
          <Route path="/dashboard/user/games" element={<LegacyGameEntry />} />
          <Route
            path="/dashboard/user/shop"
            element={<Navigate to="/dashboard/kid/lessons" replace />}
          />
          <Route path="/dashboard/parent/*" element={<AccountHome />} />
          <Route path="/dashboard/teacher/*" element={<AccountHome />} />
          <Route path="/dashboard/*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
