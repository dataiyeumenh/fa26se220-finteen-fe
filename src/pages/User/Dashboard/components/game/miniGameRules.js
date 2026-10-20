export function flexibleReserveLock(option, allocations) {
  const required = option.requires?.minFlexibleReserve ??
    (option.id === "CH02_SC04_CHOICE_A" || option.flag === "risk_handled_buffer" ? 200000 : null);
  if (required == null || Number(allocations.emergency_buffer || 0) >= required) return null;
  return `Quỹ dự trù linh hoạt chưa đủ ${required.toLocaleString("vi-VN")}đ. Hãy chọn cách xử lý khác.`;
}

export function advanceFallingItems(items, { dt, basket, width, saved, targetAmount }) {
  const remaining = [];
  const catches = [];
  const decisions = [];
  for (const item of items) {
    const y = item.y + dt * 1.1 / 3.8;
    const caught = item.y < 0.82 && y >= 0.82 && Math.abs(item.x - basket) * Math.max(1, width - 96) < 52;
    if (caught) {
      decisions.push({ itemId: item.id, correct: item.value > 0 });
      const before = saved;
      saved = Math.max(0, saved + item.value);
      catches.push({ ...item, delta: saved - before });
      if (saved >= targetAmount) return { items: [], saved, catches, decisions, won: true };
    } else if (y < 1) {
      remaining.push({ ...item, y });
    } else {
      decisions.push({ itemId: item.id, correct: item.value < 0 });
    }
  }
  return { items: remaining, saved, catches, decisions, won: false };
}

export function summarizeMiniGames(results) {
  const entries = Object.values(results).filter(result => result.score != null);
  const score = entries.reduce((sum, result) => sum + result.score, 0);
  const total = entries.reduce((sum, result) => sum + result.total, 0);
  return { score, total, percent: total > 0 ? Math.round(100 * score / total) : null };
}

export function recordMiniGameResult(results, { chapterId, sceneId, gameId }, result) {
  if (result.outcome === "success" || result.outcome === "failed") {
    return { ...results, [sceneId]: { chapterId, sceneId, gameId, completed: true, outcome: result.outcome, passed: result.outcome === "success" } };
  }
  const total = Math.max(0, Number(result.total) || 0);
  const score = Math.max(0, Math.min(total, Number(result.score) || 0));
  return { ...results, [sceneId]: {
    ...result, chapterId, sceneId, gameId, completed: true,
    score, correctCount: score, total,
    percent: total > 0 ? Math.round(100 * score / total) : null,
  } };
}

// One point per correct submitted answer/criterion. Missing activities never qualify for A.
export function chapterMiniGameSummary(results, config) {
  const required = config.requiredGameIds || [];
  const games = required.map(id => Object.values(results).find(result => result.gameId === id && result.completed));
  const total = config.miniGameMax || 0;
  const submittedTotal = games.reduce((sum, result) => sum + (result?.total || 0), 0);
  const correct = Math.min(total, games.reduce((sum, result) => sum + Math.max(0, Math.min(result?.total || 0, Math.trunc(result?.score || 0))), 0));
  const complete = required.length > 0 && games.every(result => result && result.total > 0) && submittedTotal === total;
  const percent = total > 0 ? 100 * correct / total : 0;
  return {
    miniCorrect: correct, miniWrong: Math.max(0, submittedTotal - correct), miniTotal: total,
    miniPercent: percent, miniGamesComplete: complete,
    miniGameGoalEligible: complete && percent >= 75,
    miniGameNeedsPractice: complete && percent < 50,
    coreCalculationsCorrect: complete && correct === total,
  };
}
