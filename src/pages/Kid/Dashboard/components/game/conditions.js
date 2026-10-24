// Bộ đọc điều kiện DÙNG CHUNG cho rẽ tự động, kết chương và khoá lựa chọn (bộ khuôn BE v2, Hưng chốt 24/10).
// Trước đây ba chỗ tự viết ba bộ đọc riêng; giờ VisualNovelPlayer chỉ gọi module này.
//
// Dạng khuôn v2:  { all: [...] } / { any: [...] } lồng nhau, lá { var, op, value }.
//   var: money, miniGameScore, 5 chỉ số (SAVING, HAPPINESS, RISK, GOAL, WEALTH),
//        flag:<tên>        — cờ việc không phải lựa chọn,
//        inspected:<mã>    — trẻ đã mở thẻ / vật đó,
//        choice:<nhóm>     — lựa chọn cuối của câu hỏi (nhóm = choiceGroup, không có thì = mã cảnh), so == / != với mã lựa chọn,
//        biến kết chương   — choicePercent, learningScore, miniGameNeedsPractice… (ctx.derived).
// Dạng CŨ (còn trong dữ liệu tới khi chuyển xong) giữ ĐÚNG hành vi cũ: chuỗi chạy new Function với đúng danh sách
// biến của từng chỗ ("scene" cho rẽ tự động, "ending" cho kết chương), {check|expression|formula}, {field, operator, value}.

const STAT_KEYS = ["SAVING", "HAPPINESS", "RISK", "GOAL", "WEALTH"];

/** Nhóm quyết định của một cảnh lựa chọn — cùng luật với BE (ContentSchema.choiceGroupOf). */
export const choiceGroupOf = (scene) => scene?.choiceGroup || scene?.id;

/** Điều kiện kiểu khuôn v2 (khác dạng cũ). */
export const isStructured = (c) =>
  !!c && typeof c === "object" && ("all" in c || "any" in c || "var" in c);

function resolve(name, ctx) {
  if (name === "money") return ctx.money ?? 0;
  if (name === "miniGameScore") return ctx.miniGameScore ?? 0;
  if (STAT_KEYS.includes(name)) return ctx.stats?.[name] ?? 0;
  const at = name.indexOf(":");
  if (at > 0) {
    const kind = name.slice(0, at);
    const key = name.slice(at + 1);
    if (kind === "flag") return Boolean(ctx.flags?.[key]);
    if (kind === "inspected") return Boolean(ctx.inspectedIds?.[key]);
    if (kind === "choice") return ctx.choiceLedger?.[key]?.optionId ?? null;
  }
  return ctx.derived?.[name];
}

function compare(left, op, right) {
  switch (op) {
    case "==":
      return left === right;
    case "!=":
      return left !== right;
    case ">":
      return Number(left) > Number(right);
    case ">=":
      return Number(left) >= Number(right);
    case "<":
      return Number(left) < Number(right);
    case "<=":
      return Number(left) <= Number(right);
    default:
      return false;
  }
}

function evaluateStructured(c, ctx) {
  if (Array.isArray(c.all)) return c.all.every((x) => evaluateStructured(x, ctx));
  if (Array.isArray(c.any)) return c.any.some((x) => evaluateStructured(x, ctx));
  if (typeof c.var === "string") {
    const left = resolve(c.var, ctx);
    if (left === undefined) return false; // biến lạ: không đoán
    return compare(left, c.op, c.value);
  }
  return false;
}

// ---------------------------------------------------------------- dạng cũ (giữ nguyên hành vi)

function legacySceneExpression(expression, ctx) {
  try {
    const evaluator = new Function(
      "stats",
      "flags",
      `const { WEALTH = 0, SAVINGS = 0, SAVING = 0, FIQ = 0, HAPPINESS = 0, RISK = 0, GOAL = 0 } = stats || {}; return Boolean(${expression});`,
    );
    return evaluator(ctx.stats || {}, ctx.flags || {});
  } catch {
    return false;
  }
}

function legacyEndingExpression(expression, ctx) {
  const d = ctx.derived || {};
  try {
    const evaluator = new Function(
      "flag",
      "evidenceScore",
      "miniGameCompleted",
      "stats",
      "money",
      "miniGameScore",
      "flags",
      "reflectionScore",
      "choicePercent",
      "learningScore",
      "coreCalculationsCorrect",
      "reflectionCompleted",
      "miniGameGoalEligible",
      "miniGameNeedsPractice",
      `const { SAVING = 0, HAPPINESS = 0, RISK = 0, GOAL = 0 } = stats || {}; return Boolean(${expression});`,
    );
    return evaluator(
      d.gameFlag,
      d.evidenceScore,
      d.miniGameCompleted,
      ctx.stats,
      ctx.money,
      ctx.miniGameScore,
      ctx.flags,
      d.reflectionScore,
      d.choicePercent,
      d.learningScore,
      d.coreCalculationsCorrect,
      d.reflectionCompleted,
      d.miniGameGoalEligible,
      d.miniGameNeedsPractice,
    );
  } catch {
    return false;
  }
}

function legacyField(c, ctx) {
  const left = Number(ctx.stats?.[c.field] ?? 0);
  const right = Number(c.value ?? 0);
  return compare(left, c.operator === "=" ? "==" : c.operator, right);
}

/**
 * Đánh giá một điều kiện. mode = "scene" (rẽ tự động) hoặc "ending" (kết chương / dòng báo cáo) — chỉ ảnh hưởng dạng CHUỖI cũ.
 * Thiếu điều kiện → false (đúng hành vi cũ; nơi gọi tự quyết mặc định).
 */
export function evaluateCondition(condition, ctx, mode = "scene") {
  if (condition == null) return false;
  if (isStructured(condition)) return evaluateStructured(condition, ctx);
  if (typeof condition === "string") {
    if (mode === "ending") return condition === "DEFAULT_FALLBACK" || legacyEndingExpression(condition, ctx);
    return false; // bộ đọc cũ của rẽ tự động không hiểu chuỗi trần (chỉ {check|expression|formula}) — giữ y hành vi
  }
  if (mode === "scene" && typeof condition === "object") {
    const expression = condition.check || condition.expression || condition.formula;
    if (expression) return legacySceneExpression(String(expression).trim(), ctx);
    if (condition.field) return legacyField(condition, ctx);
  }
  return false;
}

/**
 * Lý do khoá một lựa chọn, null = mở. Khuôn v2: option.condition + option.lockedReason (Hưng 24/10 "cách 2").
 * Dạng cũ: option.requires {minMoney, flags[], inspected[], lockedReason}; condition {type: ALWAYS_UNLOCKED} (CH01–02) = mở như trước.
 */
export function optionLockReason(option, ctx) {
  if (isStructured(option.condition)) {
    return evaluateStructured(option.condition, ctx) ? null : option.lockedReason || "Chưa đủ điều kiện để chọn.";
  }
  const requires = option.requires;
  if (!requires) return null;
  const unmet =
    (requires.minMoney != null && (ctx.money ?? 0) < requires.minMoney) ||
    (requires.flags || []).some((key) => !ctx.flags?.[key]) ||
    (requires.inspected || []).some((key) => !ctx.inspectedIds?.[key]);
  return unmet ? requires.lockedReason || "Chưa đủ điều kiện để chọn." : null;
}
