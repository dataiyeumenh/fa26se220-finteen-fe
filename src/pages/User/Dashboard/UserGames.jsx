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
  const { user, loading, error } = useUserDashboard();
  const [gameData, setGameData] = useState(chapter1GameData);
  const [runtimeError, setRuntimeError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRuntime = async () => {
      try {
        const runtimeData = await loadChapter1RuntimeData();
        if (mounted) {
          setGameData(runtimeData);
          setRuntimeError("");
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

    if (isChapterOne) loadRuntime();
    return () => {
      mounted = false;
    };
  }, [isChapterOne]);

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

      {!loading && !error && isChapterOne && <VisualNovelPlayer data={gameData} />}
      {!loading && !error && !isChapterOne && (
        <div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center">
          <Gamepad2 className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-800">{ /^[2-8]$/.test(chapterId) ? `Chương ${chapterId}` : "Không tìm thấy chương" }</h1>
          <p className="mt-3 text-gray-600">{ /^[2-8]$/.test(chapterId) ? "Nội dung trò chơi của chương này đang được chuẩn bị." : "Vui lòng chọn một chương trên bản đồ hành trình." }</p>
          <Link to="/dashboard/user/lessons" className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-bold text-amber-950">Về bản đồ chương</Link>
        </div>
      )}
    </DashboardLayout>
  );
}
