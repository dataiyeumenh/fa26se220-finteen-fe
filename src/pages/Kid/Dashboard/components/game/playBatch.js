// Gửi lô kết quả cuối chương lên BE — POST /api/play/chapter (build/api-docs/play.md). FE chỉ gửi trẻ CHỌN gì: lựa chọn có hiệu lực
// của mỗi câu hỏi (choiceLedger) và ô nhập lần nộp đầu của mỗi mini-game; BE tự tính chỉ số / chấm điểm từ JSON bản đã chơi.
// Mất mạng / lỗi: giữ lô ở localStorage, lần sau mở game gửi lại (gửi trùng vô hại). Không chặn trẻ chơi tiếp.
// Nạp client API khi cần gửi (không nạp lúc tải game): thiếu cấu hình API thì bỏ qua gửi, game vẫn chơi được.
async function authClient() {
  try {
    return (await import("../../api/kidDashboardApi")).kidDashboardApi;
  } catch {
    return null;
  }
}

const PENDING_PREFIX = "finteen:play:pending:";

/** Số chương: metadata.chapterNumber, không có thì lấy số trong metadata.chapterId / id ("chapter-4", "CH04"). */
export function chapterNumberOf(data) {
  if (Number.isInteger(data?.metadata?.chapterNumber))
    return data.metadata.chapterNumber;
  const match = String(data?.metadata?.chapterId || data?.id || "").match(
    /(\d+)/,
  );
  return match ? Number(match[1]) : null;
}

/** Lô của một chương: lựa chọn, dữ kiện đã mở, phản tư và ô nhập mini-game. */
export function buildChapterBatch(data, choiceLedger, miniGameResults, inspectedIds = {}) {
  const scenes = data.scenes || [];
  const choices = Object.entries(choiceLedger || {})
    .map(([group, entry]) => {
      const scene = scenes.find(
        (s) =>
          s.type === "choice" &&
          (s.choiceGroup || s.id) === group &&
          (s.options || []).some((o) => o.id === entry.optionId),
      );
      return scene
        ? {
            sceneId: scene.id,
            optionId: entry.optionId,
            chosenAt: entry.chosenAt,
            firstOptionId: entry.firstOptionId || entry.optionId,
            revised: Boolean(entry.revised),
          }
        : null;
    })
    .filter(Boolean);
  const miniGames = Object.values(miniGameResults || {})
    .filter((r) => r?.completed && r.gameId && r.inputs)
    .flatMap((r) =>
      Object.entries(r.inputs).map(([itemId, chosen]) => ({
        gameId: r.gameId,
        itemId,
        chosen,
        playedAt: r.playedAt,
      })),
    );
  const inspected = [...new Set([
    ...Object.entries(inspectedIds || {}).filter(([, opened]) => Boolean(opened)).map(([id]) => id),
    ...Object.values(miniGameResults || {}).flatMap((result) => [
      ...(Array.isArray(result?.inspected) ? result.inspected : []),
      ...(Array.isArray(result?.inspectedItems) ? result.inspectedItems : []),
      ...(Array.isArray(result?.ui?.inspected) ? result.ui.inspected : []),
    ]),
  ].filter(Boolean))];
  const reflections = Object.entries(choiceLedger || {}).flatMap(([group, entry]) => {
    const scene = scenes.find((item) => item.type === "reflection" && (item.choiceGroup || item.id) === group);
    if (!scene || !entry?.answer) return [];
    const answer = scene.activity === "reflection1"
      ? { selected: entry.answer.selected || [], method: entry.answer.method || "" }
      : { action: entry.answer.action || "", date: entry.answer.date || "" };
    return [{ sceneId: scene.id, answer }];
  });
  return {
    chapter: chapterNumberOf(data),
    releaseVersion: data.releaseVersion || null,
    choices,
    miniGames,
    ...(inspected.length ? { inspected } : {}),
    ...(reflections.length ? { reflections } : {}),
    finishedAt: new Date().toISOString(),
  };
}

const slotCodeOf = (auth) => auth?.getSnapshot?.().actor?.code;
const pendingKey = (code, batch) =>
  `${PENDING_PREFIX}${code}:${batch.chapter}:${batch.releaseVersion}`;

/**
 * Gửi lô. Bỏ qua (trả lý do) khi không phải trẻ đăng nhập bằng slot hoặc chương không đến từ API (không có releaseVersion —
 * CH04–08 còn đọc file tĩnh). Lần chơi: theo GET /api/play/state; chơi lại chương 1 sau khi xong hết → lần chơi mới.
 */
export async function submitChapterBatch(batch, expectedCode) {
  const auth = await authClient();
  const code = slotCodeOf(auth);
  if (!code) return { skipped: "chưa đăng nhập bằng mã của trẻ" };
  if (expectedCode !== undefined && code !== expectedCode)
    return { skipped: "phiên học đã thay đổi" };
  if (!batch.releaseVersion || !batch.chapter)
    return { skipped: "chương không đến từ API (không có releaseVersion)" };
  try {
    const state = await auth.getPlayState();
    if (slotCodeOf(auth) !== code) return { skipped: "phiên học đã thay đổi" };
    const allDone =
      state.totalChapters &&
      (state.chaptersDone || []).length >= state.totalChapters;
    const attemptIndex =
      (state.attemptIndex || 1) + (allDone && batch.chapter === 1 ? 1 : 0);
    const result = await auth.submitChapterBatch({ ...batch, attemptIndex });
    try {
      localStorage.removeItem(pendingKey(code, batch));
    } catch {
      /* bộ nhớ trình duyệt bị chặn */
    }
    return { sent: true, result };
  } catch (error) {
    // Invalid/conflicting batches and missing/ended resources cannot be retried. Keep results across
    // expired sessions, denied requests, timeouts, rate limits and server outages.
    const retry = ![400, 404, 409, 410].includes(error?.status);
    try {
      if (retry)
        localStorage.setItem(pendingKey(code, batch), JSON.stringify(batch));
      else localStorage.removeItem(pendingKey(code, batch));
    } catch {
      /* bộ nhớ trình duyệt bị chặn */
    }
    return {
      failed: error?.message || String(error),
      code: error?.code,
      postTestRequired: error?.code === 7004,
      retry,
    };
  }
}

/** Gửi lại các lô còn treo của trẻ đang đăng nhập (gọi khi mở game). */
export async function flushPendingBatches(expectedCode) {
  const auth = await authClient();
  const code = slotCodeOf(auth);
  if (!code) return;
  if (expectedCode !== undefined && code !== expectedCode) return;
  let keys;
  try {
    keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(`${PENDING_PREFIX}${code}:`),
    );
  } catch {
    return;
  }
  for (const key of keys) {
    if (slotCodeOf(auth) !== code) return;
    try {
      const batch = JSON.parse(localStorage.getItem(key));
      if (batch) await submitChapterBatch(batch, code);
    } catch {
      /* để lần sau */
    }
  }
}
