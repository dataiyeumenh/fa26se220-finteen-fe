import { useEffect, useState } from "react";
import { useWorkspace } from "@/features/workspace/useWorkspace";
import { CHAPTERS, canAccessChapter } from "@/features/workspace/model";
import { kidDashboardApi } from "../api/kidDashboardApi.js";
import { journeyChapterProgress } from "../api/kidJourneyProgress.js";

export function useKidLessons() {
  const { actor } = useWorkspace();
  const [result, setResult] = useState({ code: null, state: null, loading: true, error: "" });
  const code = actor?.role === "kid" ? actor.code : null;
  useEffect(() => {
    let active = true;
    if (!code) return;
    kidDashboardApi.getPlayState().then(
      (state) => active && setResult({ code, state, loading: false, error: "" }),
      (error) => active && setResult({ code, state: null, loading: false, error: error.message || "Không tải được tiến trình chơi." }),
    );
    return () => { active = false; };
  }, [code]);
  const state = result.code === code ? result.state : null;
  const chapters = CHAPTERS.map((subtitle, i) => {
    const id = i + 1;
    const progress = journeyChapterProgress(state, id);
    return {
      id,
      title: `Chương ${id}`,
      subtitle,
      description: i === 0 ? "Trải nghiệm chương đầu tiên" : subtitle,
      color: "#82a267",
      ...progress,
      status: canAccessChapter(actor, id) ? progress.status : "locked",
    };
  });
  return {
    chapters,
    source: "api",
    loading: Boolean(code) && (result.code !== code || result.loading),
    error: code && result.code === code ? result.error : "",
  };
}
