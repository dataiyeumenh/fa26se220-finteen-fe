import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { lazy, Suspense } from "react";
import "./styles/responsive.css";
const InternalApp = lazy(() => import("@/features/internal/InternalApp"));

// Trang công khai và xác thực
import Homepage from "@/pages/Homepage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AuthForm from "@/features/workspace/AuthForm";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import InternalAuthLayout from "@/pages/auth/InternalAuthLayout";
import KnowledgeFramework from "@/pages/KnowledgeFramework";
import NotFoundPage from "@/pages/NotFoundPage";
import { PageLoader } from "@/components/feedback/LoadingState";

// Dashboard CHUNG cho người lớn: Guest / Parent / Teacher
import {
  Overview as SharedDashboard,
  Plans,
  Settings,
} from "@/features/workspace/Overview";
import { useWorkspace } from "@/features/workspace/useWorkspace";
const ParentLearners = lazy(() => import("@/pages/Parent/Learners/ParentLearners"));
const TeacherGroups = lazy(() => import("@/pages/Teacher/Groups/TeacherGroups"));
const ParentReports = lazy(() => import("@/pages/Parent/Reports/ParentReports"));
const TeacherReports = lazy(() => import("@/pages/Teacher/Reports/TeacherReports"));
// Hai màn hình khác nhau: Teacher quản lý đề, Kid làm bài.
const KidQuiz = lazy(() => import("@/pages/Kid/Quiz/KidQuiz"));
const KidQuizTake = lazy(() => import("@/pages/Kid/Quiz/KidQuizTake"));
const TeacherQuizManagement = lazy(() => import("@/pages/Teacher/Quiz/TeacherQuizManagement"));
const ParentQuizResults = lazy(() => import("@/pages/Parent/Quiz/ParentQuizResults"));
const ParentDashboard = lazy(() => import("@/pages/Parent/Dashboard/ParentDashboard"));
const TeacherDashboard = lazy(() => import("@/pages/Teacher/Dashboard/TeacherDashboard"));
const LearnerReport = lazy(() => import("@/pages/LearnerReport/LearnerReport"));

// Khu vực RIÊNG của role kid: Bài học / Trò chơi / Cửa hàng / Quiz
const KidDashboard = lazy(() => import("@/pages/Kid/Dashboard/KidDashboard"));
const KidLessons = lazy(() => import("@/pages/Kid/Dashboard/KidLessons"));
const KidGamesPage = lazy(() => import("@/pages/Kid/Dashboard/KidGames"));
const KidPersonalization = lazy(() => import("@/pages/Kid/Dashboard/KidPersonalization"));
import { GuestDemo } from "@/features/workspace/KidPages";

// Layout và kiểm tra quyền truy cập
import {
  RequireAccount,
  Shell as DashboardShell,
  AccountHome,
  LessonsEntry,
  LegacyGameEntry,
  ChapterGuard,
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

function AdultQuizzes() {
  const { actor } = useWorkspace();
  return actor.role === "teacher" ? <TeacherQuizManagement /> : <ParentQuizResults />;
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
      <Suspense fallback={<PageLoader label="Đang tải trang…" />}>
      <Routes>
        <Route
          path="/internal/*"
          element={
            <Suspense
              fallback={<PageLoader label="Đang mở không gian nội bộ…" />}
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
        <Route path="/khung-kien-thuc" element={<KnowledgeFramework />} />
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
                <Route path="/dashboard/quiz-management" element={<AdultQuizzes />} />
              </Route>

              {/* 2b. RIÊNG TEACHER — Quản lý Quiz: tạo đề, giao bài, theo dõi kết quả */}
              <Route element={<RequireAccount roles={["teacher"]} />}>
                <Route path="/dashboard/groups" element={<TeacherGroups />} />
              </Route>
            </Route>
          </Route>

          {/* 3. RIÊNG KID — cả con của Parent và học sinh của Teacher đều có role kid */}
          <Route element={<RequireAccount roles={["kid"]} />}>
            <Route element={<DashboardShell />}>
              <Route path="/dashboard/kid" element={<KidDashboard />} />
              <Route path="/dashboard/kid/games" element={<ChapterGuard><KidGamesPage /></ChapterGuard>} />
              <Route path="/dashboard/kid/personalization" element={<KidPersonalization />} />
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

              {/* QUIZ CỦA KID — học sinh làm đề được giao; trẻ gia đình làm bài trắc nghiệm sau chương. */}
              <Route element={<RequireAccount plans={["teacher", "parent"]} />}>
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
          <Route path="/dashboard/*" element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
