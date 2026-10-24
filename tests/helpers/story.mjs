// Chạy logic cây truyện bằng CHÍNH module của game (chapterShape.js, conditions.js) — test không tự đọc điều kiện.
import { normalizeChapter } from "../../src/pages/Kid/Dashboard/components/game/chapterShape.js";
import {
  choiceGroupOf,
  isStructured,
  evaluateCondition,
  optionLockReason,
  resolveEnding,
} from "../../src/pages/Kid/Dashboard/components/game/conditions.js";

export { normalizeChapter, choiceGroupOf, isStructured };

const STATS = new Set(["SAVING", "HAPPINESS", "RISK", "GOAL", "WEALTH"]);

/**
 * Ngữ cảnh điều kiện của game từ ngữ cảnh phẳng: flags, money, miniGameScore, inspectedIds, choiceLedger, stats giữ nguyên;
 * chỉ số (SAVING, RISK…) để ngoài được gộp vào stats; mọi khoá khác là biến kết chương (ctx.derived).
 */
export function conditionContext({
  flags = {},
  stats = {},
  money,
  miniGameScore,
  inspectedIds = {},
  choiceLedger = {},
  ...rest
} = {}) {
  const ctx = { flags, stats: { ...stats }, money, miniGameScore, inspectedIds, choiceLedger, derived: {} };
  for (const [key, value] of Object.entries(rest)) (STATS.has(key) ? ctx.stats : ctx.derived)[key] = value;
  return ctx;
}

/** Mã kết chương game chọn (priorityOrder + "fallback": true). */
export const endingId = (data, context) => resolveEnding(data.endingRules, conditionContext(context))?.id;

/** Cảnh đích của một cảnh rẽ tự động. */
export const branchTarget = (scene, context) =>
  evaluateCondition(scene.condition, conditionContext(context), "scene") ? scene.ifTrueSceneId : scene.ifFalseSceneId;

/** Lý do khoá lựa chọn, null = mở. */
export const lockReason = (option, context) => optionLockReason(option, conditionContext(context));

/** Mục sổ quyết định như game ghi (choice:<nhóm> đọc optionId). */
export const ledgerEntry = (option, extra = {}) => ({ optionId: option.id, evidenceScores: option.evidenceScores, ...extra });
