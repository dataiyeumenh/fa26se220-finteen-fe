// Play state records chapter completion, not individual scene/lesson percentages.
export function isJourneyPlayState(state) {
  const total = Number(state?.totalChapters ?? 8);
  return Boolean(
    state &&
    Number.isInteger(total) && total > 0 && total <= 99 &&
    Array.isArray(state.chaptersDone) &&
    state.chaptersDone.every((id) => Number.isInteger(Number(id)) && Number(id) >= 1 && Number(id) <= total),
  );
}

export function canPlayJourneyChapter(state, chapter) {
  if (!isJourneyPlayState(state) || !Number.isInteger(chapter) || chapter < 1 || chapter > Number(state.totalChapters ?? 8)) return false;
  const done = state.chaptersDone.map(Number);
  if (done.includes(chapter)) return true;
  const next = state.continueChapter ?? state.nextChapter ??
    Array.from({ length: Number(state.totalChapters ?? 8) }, (_, i) => i + 1).find((id) => !done.includes(id));
  return chapter === Number(next) && Array.from({ length: chapter - 1 }, (_, i) => i + 1).every((id) => done.includes(id));
}

export function resumeJourneyChapter(state) {
  if (!isJourneyPlayState(state)) return null;
  const done = state.chaptersDone.map(Number);
  const chapter = Number(state.continueChapter ?? state.nextChapter ??
    Array.from({ length: Number(state.totalChapters ?? 8) }, (_, i) => i + 1).find((id) => !done.includes(id)) ?? 1);
  return canPlayJourneyChapter(state, chapter) ? chapter : null;
}

export function journeyChapterProgress(state, chapter) {
  const valid = isJourneyPlayState(state);
  const done = valid ? state.chaptersDone.map(Number) : [];
  const completed = done.includes(chapter);
  const next = valid ? state.continueChapter ?? state.nextChapter ??
    Array.from({ length: Number(state.totalChapters ?? 8) }, (_, i) => i + 1).find((id) => !done.includes(id)) : null;
  return {
    status: completed ? "completed" : chapter === Number(next) && canPlayJourneyChapter(state, chapter) ? "current" : "locked",
    progress: completed ? 100 : 0,
    lessonsCompleted: completed ? 1 : 0,
    totalLessons: 1,
  };
}
