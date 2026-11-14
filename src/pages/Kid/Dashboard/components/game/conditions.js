// Bộ đọc điều kiện DÙNG CHUNG cho rẽ tự động, kết chương và khoá lựa chọn (bộ khuôn BE v2, Hưng chốt 24/10).
// Trước đây ba chỗ tự viết ba bộ đọc riêng; giờ VisualNovelPlayer chỉ gọi module này.
//
// Dạng khuôn v2:  { all: [...] } / { any: [...] } lồng nhau, lá { var, op, value }.
//   var: money, miniGameScore, 5 chỉ số (SAVING, HAPPINESS, RISK, GOAL, WEALTH),
//        flag:<tên>        — cờ việc không phải lựa chọn,
//        inspected:<mã>    — trẻ đã mở thẻ / vật đó,
//        choice:<nhóm>     — lựa chọn cuối của câu hỏi (nhóm = choiceGroup, không có thì = mã cảnh), so == / != với mã lựa chọn,
//        biến kết chương   — choicePercent, learningScore, miniGameNeedsPractice… (ctx.derived).
// Chuỗi báo cáo cuối chương chỉ hỗ trợ flags.tên / tên biến derived, phủ định ! và nối &&.
// Không chạy mã từ nội dung; giữ DEFAULT_FALLBACK và so sánh {field, operator, value}.

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
  if (Array.isArray(c.all))
    return c.all.every((x) => evaluateStructured(x, ctx));
  if (Array.isArray(c.any))
    return c.any.some((x) => evaluateStructured(x, ctx));
  if (typeof c.var === "string") {
    // Biến chưa có giá trị (vd chương không tính choicePercent) so như dạng cũ: undefined == true → sai, != true → đúng,
    // so số → sai. BE đã kiểm tên biến khi lưu nên ở đây không chặn thêm.
    return compare(resolve(c.var, ctx), c.op, c.value);
  }
  return false;
}

function legacyField(c, ctx) {
  const left = Number(ctx.stats?.[c.field] ?? 0);
  const right = Number(c.value ?? 0);
  return compare(left, c.operator === "=" ? "==" : c.operator, right);
}

// Read only the boolean report syntax retained in published releases.
function simpleEndingExpression(text, ctx) {
  const terms = text.split("&&").map((term) => term.trim());
  if (!terms.every((term) => /^!?(flags\.)?[A-Za-z_]\w*$/.test(term))) return false;
  return terms.every((term) => {
    const negated = term.startsWith("!");
    const name = negated ? term.slice(1) : term;
    const fromFlags = name.startsWith("flags.");
    const values = fromFlags ? ctx.flags : ctx.derived;
    const key = fromFlags ? name.slice(6) : name;
    const value = values != null && Object.hasOwn(values, key) ? values[key] : undefined;
    return Boolean(value) !== negated;
  });
}

/**
 * Đánh giá một điều kiện. mode = "scene" (rẽ tự động) hoặc "ending" (kết chương / dòng báo cáo) — chỉ ảnh hưởng dạng CHUỖI cũ.
 * Thiếu điều kiện → false (đúng hành vi cũ; nơi gọi tự quyết mặc định).
 */
export function evaluateCondition(condition, ctx, mode = "scene") {
  if (condition == null) return false;
  if (isStructured(condition)) return evaluateStructured(condition, ctx);
  if (typeof condition === "string") {
    return mode === "ending" &&
      (condition === "DEFAULT_FALLBACK" || simpleEndingExpression(condition, ctx));
  }
  if (mode === "scene" && typeof condition === "object") {
    if (condition.check || condition.expression || condition.formula) return false;
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
    return evaluateStructured(option.condition, ctx)
      ? null
      : option.lockedReason || "Chưa đủ điều kiện để chọn.";
  }
  const requires = option.requires;
  if (!requires) return null;
  const unmet =
    (requires.minMoney != null && (ctx.money ?? 0) < requires.minMoney) ||
    (requires.flags || []).some((key) => !ctx.flags?.[key]) ||
    (requires.inspected || []).some((key) => !ctx.inspectedIds?.[key]);
  return unmet ? requires.lockedReason || "Chưa đủ điều kiện để chọn." : null;
}

/**
 * Kết chương: đi theo endingRules.priorityOrder, kết "fallback": true luôn đúng, không kết nào khớp → kết cuối mảng.
 * ctx như evaluateCondition, thêm ctx.derived (biến kết chương). VisualNovelPlayer và test dùng chung hàm này.
 */
export function resolveEnding(endingRules, ctx) {
  if (!endingRules?.endings) return null;
  for (const id of endingRules.priorityOrder || []) {
    const ending = endingRules.endings.find((e) => e.id === id);
    if (
      ending &&
      (ending.fallback === true ||
        evaluateCondition(ending.condition, ctx, "ending"))
    )
      return ending;
  }
  return endingRules.endings[endingRules.endings.length - 1] || null;
}
