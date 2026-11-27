// POST /api/play/chapter, data contract v2. The event log is captured while the
// chapter is played; this module only packages it and owns the durable retry queue.
async function authClient() {
  try {
    return (await import("../../api/kidDashboardApi")).kidDashboardApi;
  } catch {
    return null;
  }
}

const PENDING_PREFIX = "finteen:play:pending:";

export function chapterNumberOf(data) {
  if (Number.isInteger(data?.metadata?.chapterNumber)) return data.metadata.chapterNumber;
  const match = String(data?.metadata?.chapterId || data?.id || "").match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

export const hasMiniGameValue = (value) =>
  value !== null && value !== undefined &&
  !(typeof value === "string" && value.trim() === "");

/** Build phase-A schema 2 payload. Reflections deliberately stay empty. */
export function buildChapterBatch(data, playLog, miniGameResults) {
  const miniGames = Object.values(miniGameResults || {})
    .filter((result) => result?.completed && result.gameId && Number.isInteger(result.playSeq))
    .flatMap((result) =>
      Object.entries(result.inputs || {})
        .filter(([, chosen]) => hasMiniGameValue(chosen))
        .map(([itemId, chosen]) => ({
          seq: result.playSeq,
          gameId: result.gameId,
          itemId,
          chosen,
          ...(result.playedAt ? { at: result.playedAt } : {}),
        })),
    );
  return {
    schema: 2,
    chapter: chapterNumberOf(data),
    releaseVersion: playLog?.releaseVersion || data.releaseVersion || null,
    picks: [...(playLog?.picks || [])],
    inspections: [...(playLog?.inspections || [])],
    miniGames,
    reflections: [],
    finishedAt: new Date().toISOString(),
  };
}

const slotCodeOf = (auth) => auth?.getSnapshot?.().actor?.code;
const pendingKey = (code, batch) =>
  `${PENDING_PREFIX}${code}:${batch.chapter}:${batch.releaseVersion}`;

export function clearPendingChapterBatch(code, batch) {
  if (!code || !batch?.chapter || !batch?.releaseVersion) return false;
  try {
    const key = pendingKey(code, batch);
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}:blocked`);
    return true;
  } catch {
    return false;
  }
}

export async function submitChapterBatch(batch, expectedCode) {
  const auth = await authClient();
  const code = slotCodeOf(auth);
  if (!code) return { skipped: "chưa đăng nhập bằng mã của trẻ" };
  if (expectedCode !== undefined && code !== expectedCode)
    return { skipped: "phiên học đã thay đổi" };
  if (!batch.releaseVersion || !batch.chapter)
    return { skipped: "chương không đến từ API (không có releaseVersion)" };
  try {
    if (batch.schema === 2 && localStorage.getItem(`${pendingKey(code, batch)}:blocked`)) {
      return {
        failed: "Lô kết quả không hợp lệ đang được giữ để kiểm tra",
        retry: false,
        retained: true,
      };
    }
  } catch {
    /* browser storage unavailable; continue with the normal request */
  }
  try {
    const state = await auth.getPlayState();
    if (slotCodeOf(auth) !== code) return { skipped: "phiên học đã thay đổi" };
    const allDone = state.totalChapters &&
      (state.chaptersDone || []).length >= state.totalChapters;
    const attemptIndex =
      (state.attemptIndex || 1) + (allDone && batch.chapter === 1 ? 1 : 0);
    const result = await auth.submitChapterBatch({ ...batch, attemptIndex });
    try {
      localStorage.removeItem(pendingKey(code, batch));
      localStorage.removeItem(`${pendingKey(code, batch)}:blocked`);
    } catch { /* unavailable */ }
    return { sent: true, result };
  } catch (error) {
    const schema2 = batch.schema === 2;
    if (error?.status === 409) await auth.getPlayState().catch(() => null);
    const retry = schema2
      ? ![400, 404, 409, 410, 413].includes(error?.status)
      : ![400, 404, 409, 410].includes(error?.status);
    const retained = schema2 && [400, 413].includes(error?.status);
    try {
      const key = pendingKey(code, batch);
      if (retry || retained) localStorage.setItem(key, JSON.stringify(batch));
      else localStorage.removeItem(key);
      if (retained) localStorage.setItem(`${key}:blocked`, "1");
      else localStorage.removeItem(`${key}:blocked`);
    } catch { /* unavailable */ }
    return {
      failed: error?.message || String(error),
      code: error?.code,
      postTestRequired: error?.code === 7004,
      retry,
      retained,
    };
  }
}

export async function flushPendingBatches(expectedCode) {
  const auth = await authClient();
  const code = slotCodeOf(auth);
  if (!code || (expectedCode !== undefined && code !== expectedCode)) return;
  let keys;
  try {
    keys = Object.keys(localStorage).filter((key) =>
      key.startsWith(`${PENDING_PREFIX}${code}:`) && !key.endsWith(":blocked"),
    );
  } catch { return; }
  for (const key of keys) {
    if (slotCodeOf(auth) !== code) return;
    try {
      if (localStorage.getItem(`${key}:blocked`)) continue;
      const batch = JSON.parse(localStorage.getItem(key));
      if (batch) await submitChapterBatch(batch, code);
    } catch { /* keep for later */ }
  }
}
