import { useWorkspace } from "@/features/workspace/useWorkspace";
import { CHAPTERS, canAccessChapter } from "@/features/workspace/model";
import { journeyChapterProgress } from "../api/kidJourneyProgress.js";
import { useKidPlayState } from "./useKidPlayState.js";

export function useKidLessons() {
  const { actor } = useWorkspace();
  const { state, loading, error } = useKidPlayState();
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
    loading,
    error,
  };
}
