// Play state records chapter completion, not individual scene/lesson percentages.
export function journeyChapterProgress(state, chapter) {
  const done = (state?.chaptersDone || []).map(Number);
  const completed = done.includes(chapter);
  const next = state?.continueChapter ?? state?.nextChapter ??
    Array.from({ length: state?.totalChapters || 8 }, (_, i) => i + 1).find((id) => !done.includes(id));
  return {
    status: completed ? "completed" : chapter === Number(next) ? "current" : "available",
    progress: completed ? 100 : 0,
    lessonsCompleted: completed ? 1 : 0,
    totalLessons: 1,
  };
}
