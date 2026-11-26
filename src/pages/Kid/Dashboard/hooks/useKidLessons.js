import { useWorkspace } from "@/features/workspace/useWorkspace";
import { canAccessChapter } from "@/features/workspace/model";
import { journeyChapterProgress } from "../api/kidJourneyProgress.js";
import { useKidPlayState } from "./useKidPlayState.js";

export function useKidLessons() {
  const { actor } = useWorkspace();
  const { state, chapters: releasedChapters, loading, error, retry } = useKidPlayState();
  const chapters = releasedChapters.map((chapter) => {
    const id = chapter.chapterNumber;
    const subtitle = chapter.title;
    const progress = journeyChapterProgress(state, id);
    return {
      id,
      title: `Chương ${id}`,
      subtitle,
      description: id === 1 ? "Trải nghiệm chương đầu tiên" : subtitle,
      color: "#82a267",
      ...progress,
      status: canAccessChapter(actor, id, releasedChapters) ? progress.status : "locked",
      postTestRequired: state?.postTestRequired || null,
    };
  });
  return {
    chapters,
    source: "api",
    postTestRequired: state?.postTestRequired || null,
    loading,
    error,
    retry,
  };
}
