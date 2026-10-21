import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/api/auth.api";
import { useWorkspace } from "@/features/workspace/useWorkspace";

export default function useKidDashboard() {
  const {
    actor,
    learnerDashboard,
    learnerDashboardLoading,
    learnerDashboardError,
  } = useWorkspace();
  const navigate = useNavigate();
  const refresh = useCallback(
    async (force = false) => {
      try {
        await auth.ensureLearnerDashboard({ force });
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
  return {
    user: {
      ...actor,
      name: learnerDashboard?.learner?.displayName || actor?.name,
    },
    dashboard: learnerDashboard,
    loading: learnerDashboardLoading,
    error: learnerDashboardError,
    refresh: () => refresh(true),
    streak: progress?.streak || 0,
    lessonsThisWeek: progress?.completedChapters || 0,
    lessonsTarget: progress?.totalChapters || 0,
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
    achievements: (learnerDashboard?.achievements || []).map((item) => ({
      id: `${item.code}-${item.earnedAt}`,
      title: item.title || item.code,
      desc: item.earnedAt
        ? new Date(item.earnedAt).toLocaleDateString("vi-VN")
        : "",
      emoji: "🏆",
    })),
  };
}
