import { useEffect, useState } from "react";
import { useWorkspace } from "@/features/workspace/useWorkspace";
import { kidDashboardApi } from "../api/kidDashboardApi.js";
import { isJourneyPlayState } from "../api/kidJourneyProgress.js";
import { flushPendingBatches } from "../components/game/playBatch.js";
import { getCurrentRelease } from "../../../../api/content.api.js";

export function useKidPlayState({ enabled = true, refreshKey = null } = {}) {
  const { actor } = useWorkspace();
  const code = actor?.role === "kid" ? actor.code : null;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, state: null, error: "" });
  const key = JSON.stringify([actor?.id, code, refreshKey, attempt]);

  useEffect(() => {
    let active = true;
    if (!enabled || !code) return;
    const loadState = async () => {
      await flushPendingBatches(code);
      return kidDashboardApi.getPlayState();
    };
    Promise.all([loadState(), getCurrentRelease()]).then(([playState, release]) => {
      if (!Array.isArray(release?.chapters)) throw new Error("Không tải được danh sách chương. Vui lòng thử lại.");
      const state = { ...playState, totalChapters: release.chapters.length };
      if (!isJourneyPlayState(state)) throw new Error("Dữ liệu tiến trình chưa hợp lệ. Vui lòng thử lại.");
      if (active) setResult({ key, state, chapters: release.chapters, error: "" });
    }).catch((error) => {
      if (active) setResult({ key, state: null, error: error.message || "Không tải được tiến trình chơi. Vui lòng thử lại." });
    });
    return () => { active = false; };
  }, [code, enabled, key]);

  const current = enabled && Boolean(code) && result.key === key;
  return {
    state: current ? result.state : null,
    chapters: current ? result.chapters || [] : [],
    loading: enabled && Boolean(code) && !current,
    error: current ? result.error : "",
    retry: () => setAttempt((value) => value + 1),
  };
}
