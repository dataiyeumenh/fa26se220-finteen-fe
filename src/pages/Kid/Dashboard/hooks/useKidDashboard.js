import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth as authSession } from "@/api/auth.api";
import { useWorkspace } from "@/features/workspace/useWorkspace";
import { resolveAchievements } from "../api/kidAchievements.js";
import { useCurrentRelease } from "../../../../hooks/useCurrentRelease.js";

export default function useKidDashboard() {
  const {
    actor,
    learnerDashboard,
    learnerDashboardLoading,
    learnerDashboardError,
  } = useWorkspace();
  const navigate = useNavigate();
  const release = useCurrentRelease();
  const refresh = useCallback(
    async (force = false) => {
      try {
        await authSession.ensureLearnerDashboard({ force });
      } catch (error) {
        if ([3007, 3009].includes(error.code))
          navigate("/login?as=kid&reason=slot-ended", { replace: true });
        else if (error.code === 3003)
          navigate("/login?as=kid", { replace: true });
      }
    },
    [navigate],
  );
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const progress = learnerDashboard?.progress;
  const achievementData = resolveAchievements(learnerDashboard?.achievements);
  return {
    user: {
      ...actor,
      name: learnerDashboard?.learner?.displayName || actor?.name,
    },
    dashboard: learnerDashboard,
    loading: learnerDashboardLoading || release.loading,
    error: learnerDashboardError || release.error,
    refresh: () => { release.retry(); return refresh(true); },
    streak: progress?.streak || 0,
    completedChapters: progress?.completedChapters || 0,
    totalChapters: release.chapters.length,
    chapters: release.chapters,
    continueChapter: progress?.continueChapter || release.chapters[0]?.id || 1,
    continueLessons: progress?.continueChapter
      ? [
          {
            id: progress.continueChapter,
            title: `Chương ${progress.continueChapter}`,
            subject: "Tài chính",
            emoji: "📖",
            progress: 0,
          },
        ]
      : [],
    achievementSource: achievementData.source,
    achievementCatalog: achievementData.items,
    achievements: achievementData.items.filter((item) => item.unlocked).slice(0, 8).map((item) => ({
      ...item,
      id: `${item.code}-${item.earnedAt}`,
      title: item.title || item.code,
      desc: item.source === "mock" ? "Đã mở · Dữ liệu mẫu" : item.earnedAt
        ? new Date(item.earnedAt).toLocaleDateString("vi-VN")
        : "",
      emoji: item.emoji || "🏆",
    })),
  };
}
