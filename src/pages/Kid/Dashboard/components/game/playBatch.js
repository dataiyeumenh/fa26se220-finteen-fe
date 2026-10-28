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

/** Lô của một chương: choices theo nhóm câu hỏi, miniGames theo ô nhập (giá trị JSON). */
export function buildChapterBatch(data, choiceLedger, miniGameResults) {
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
  return {
    chapter: chapterNumberOf(data),
    releaseVersion: data.releaseVersion || null,
    choices,
    miniGames,
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
export async function submitChapterBatch(batch) {
  const auth = await authClient();
  const code = slotCodeOf(auth);
  if (!code) return { skipped: "chưa đăng nhập bằng mã của trẻ" };
  if (!batch.releaseVersion || !batch.chapter)
    return { skipped: "chương không đến từ API (không có releaseVersion)" };
  try {
    const state = await auth.getPlayState();
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
    // Chỉ giữ để gửi lại khi mất mạng / máy chủ lỗi; BE từ chối hẳn (4xx — vd 7003 sai thứ tự chương với trẻ đã chơi trước khi
    // FE biết gửi) thì bỏ lô, không gửi lại mãi.
    const retry = !error?.status || error.status >= 500;
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
      retry,
    };
  }
}

/** Gửi lại các lô còn treo của trẻ đang đăng nhập (gọi khi mở game). */
export async function flushPendingBatches() {
  const code = slotCodeOf(await authClient());
  if (!code) return;
  let keys;
  try {
    keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(`${PENDING_PREFIX}${code}:`),
    );
  } catch {
    return;
  }
  for (const key of keys) {
    try {
      const batch = JSON.parse(localStorage.getItem(key));
      if (batch) await submitChapterBatch(batch);
    } catch {
      /* để lần sau */
    }
  }
}
