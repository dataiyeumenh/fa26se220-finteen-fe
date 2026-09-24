import {
  Home,
  BookOpen,
  Gamepad2,
  Trophy as TrophyIcon,
  MessageCircle,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import useUserDashboard from "./hooks/useUserDashboard";
import { VisualNovelPlayer } from "./components/game/VisualNovelPlayer";
import { chapter1GameData } from "./data/chapter1VisualNovel";
import { loadChapter1RuntimeData } from "./data/runtimeAdapter";
import { loadChapter2RuntimeData } from "./data/chapter2RuntimeAdapter";

const role = {
  id: "user",
  label: "Học sinh",
  emoji: "GraduationCap",
  accent: "#fbbf24",
  accentText: "#92400e",
  accentBg: "#fbbf2415",
  accentHover: "#fbbf2410",
  accentDeep: "#d97706",
  onAccent: "#ffffff",
};

const navItems = [
  { icon: Home, label: "Tổng quan", to: "/dashboard/user" },
  {
    icon: BookOpen,
    label: "Bài học",
    to: "/dashboard/user/lessons",
    badge: "5 mới",
  },
  {
    icon: Gamepad2,
    label: "Trò chơi",
    to: "/dashboard/user/games",
    badge: "1 chương",
  },
  { icon: TrophyIcon, label: "Thành tích", to: "/dashboard/user/achievements" },
  { icon: MessageCircle, label: "Trợ lý AI", to: "/dashboard/user/ai" },
  { icon: UserIcon, label: "Hồ sơ", to: "/dashboard/user/profile" },
];

export default function UserGames() {
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapter") || "1";
  const isChapterOne = chapterId === "1";
  const isChapterTwo = chapterId === "2";
  const { user, loading, error } = useUserDashboard();
  const [gameData, setGameData] = useState(chapter1GameData);
  const [runtimeError, setRuntimeError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRuntime = async () => {
      try {
        const runtimeData = isChapterOne
          ? await loadChapter1RuntimeData()
          : isChapterTwo
            ? await loadChapter2RuntimeData()
            : null;
        if (mounted) {
          if (runtimeData) {
            setGameData(runtimeData);
            setRuntimeError("");
          }
        }
      } catch (e) {
        if (mounted) {
          setRuntimeError(
            e.message ||
              "Runtime data không hợp lệ, đang dùng dữ liệu fallback.",
          );
        }
      }
    };

    if (isChapterOne || isChapterTwo) loadRuntime();
    return () => {
      mounted = false;
    };
  }, [isChapterOne, isChapterTwo]);

  return (
    <DashboardLayout role={role} navItems={navItems} user={user}>
      {loading && (
        <div className="text-center text-sm text-[#1a3a1a]/60 py-12">
          Đang tải game...
        </div>
      )}

      {error && (
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: "#f8717115",
            borderColor: "#f87171",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && isChapterOne && runtimeError && (
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: "#fbbf2415",
            borderColor: "#fbbf24",
            color: "#92400e",
          }}
        >
          {runtimeError}
        </div>
      )}

      {!loading && !error && (isChapterOne || isChapterTwo) && <VisualNovelPlayer data={gameData} />}

      {!loading && !error && !isChapterOne && !isChapterTwo && (
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center">
            <Gamepad2 className="mx-auto mb-4 h-12 w-12 text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Chọn chương để bắt đầu
            </h1>
            <p className="mt-3 text-gray-600">
              Chọn Chapter 1 hoặc Chapter 2 để vào visual novel tương ứng.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/dashboard/demo/play?chapter=1"
              className="rounded-3xl border border-amber-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Chapter 1
              </div>
              <h2 className="mt-2 text-2xl font-black text-gray-900">
                Khám phá tiền tệ
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Hành trình đầu tiên về nhu cầu, mong muốn và tư duy tài chính.
              </p>
            </Link>

            <Link
              to="/dashboard/demo/play?chapter=2"
              className="rounded-3xl border border-sky-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-sky-600">
                Chapter 2
              </div>
              <h2 className="mt-2 text-2xl font-black text-gray-900">
                Học sinh cấp 3 - Quản lý chi tiêu
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Trải nghiệm trọ học, flash sale và bài học tiết kiệm trong đời sống cấp 3.
              </p>
            </Link>
          </div>

          <div className="text-center">
            <Link to="/dashboard/user/lessons" className="inline-flex rounded-xl bg-amber-400 px-5 py-3 font-bold text-amber-950">
              Về bản đồ chương
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
