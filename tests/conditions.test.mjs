import test from "node:test";
import assert from "node:assert/strict";
import {
  choiceGroupOf,
  evaluateCondition,
  optionLockReason,
} from "../src/pages/Kid/Dashboard/components/game/conditions.js";

const ctx = {
  stats: { SAVING: 60, RISK: 30 },
  flags: { source_checked: true },
  money: 1_500_000,
  miniGameScore: 4,
  inspectedIds: { ch04_compare: true },
  choiceLedger: { CH04_SC02: { optionId: "CH04_SC02_A" } },
  derived: { miniGameNeedsPractice: false, choicePercent: 80 },
};

test("khuôn v2: all / any lồng nhau với tiền, chỉ số, flag:, inspected:, choice:", () => {
  const c = {
    all: [
      { var: "money", op: ">=", value: 1_000_000 },
      { var: "SAVING", op: ">", value: 50 },
      {
        any: [
          { var: "choice:CH04_SC02", op: "==", value: "CH04_SC02_B" },
          { var: "inspected:ch04_compare", op: "==", value: true },
        ],
      },
      { var: "flag:source_checked", op: "==", value: true },
    ],
  };
  assert.equal(evaluateCondition(c, ctx), true);
  assert.equal(
    evaluateCondition(
      { var: "choice:CH04_SC02", op: "!=", value: "CH04_SC02_A" },
      ctx,
    ),
    false,
  );
  assert.equal(
    evaluateCondition({ var: "choice:CH09_X", op: "==", value: "A" }, ctx),
    false,
  ); // chưa chọn
  assert.equal(
    evaluateCondition({ var: "flag:chua_bat", op: "==", value: false }, ctx),
    true,
  );
  assert.equal(
    evaluateCondition({ var: "bien_la", op: "==", value: 1 }, ctx),
    false,
  ); // chưa có giá trị
  // biến chưa có giá trị so như dạng cũ: !x (x undefined) là đúng
  assert.equal(
    evaluateCondition(
      { var: "coreCalculationsCorrect", op: "!=", value: true },
      { ...ctx, derived: {} },
      "ending",
    ),
    true,
  );
  assert.equal(
    evaluateCondition(
      { var: "choicePercent", op: ">=", value: 1 },
      { ...ctx, derived: {} },
      "ending",
    ),
    false,
  );
});

test("biến kết chương đọc từ ctx.derived", () => {
  assert.equal(
    evaluateCondition(
      { var: "choicePercent", op: ">=", value: 75 },
      ctx,
      "ending",
    ),
    true,
  );
  assert.equal(
    evaluateCondition(
      { var: "miniGameNeedsPractice", op: "==", value: true },
      ctx,
      "ending",
    ),
    false,
  );
});

test("legacy expressions are rejected while safe field comparisons and ending fallback remain", () => {
  assert.equal(
    evaluateCondition({ expression: "flags.source_checked" }, ctx, "scene"),
    false,
  );
  assert.equal(
    evaluateCondition({ check: "SAVING >= 60 && RISK < 40" }, ctx, "scene"),
    false,
  );
  assert.equal(evaluateCondition("flags.source_checked", ctx, "scene"), false);
  assert.equal(
    evaluateCondition(
      { field: "SAVING", operator: ">=", value: 60 },
      ctx,
      "scene",
    ),
    true,
  );
  // Chỉ DEFAULT_FALLBACK còn được chấp nhận dưới dạng chuỗi.
  assert.equal(
    evaluateCondition(
      "money >= 1000000 && !miniGameNeedsPractice",
      ctx,
      "ending",
    ),
    false,
  );
  assert.equal(evaluateCondition("DEFAULT_FALLBACK", ctx, "ending"), true);
  assert.equal(evaluateCondition({ expression: "true" }, ctx, "ending"), false);
  assert.equal(evaluateCondition(undefined, ctx), false);
});

test("string expressions never execute code in scenes or endings", () => {
  globalThis.__conditionExecuted = false;
  const expression = "(globalThis.__conditionExecuted = true)";
  try {
    for (const mode of ["scene", "ending"]) {
      for (const condition of [expression, { check: expression }, { expression }, { formula: expression }]) {
        assert.equal(evaluateCondition(condition, ctx, mode), false);
        assert.equal(globalThis.__conditionExecuted, false);
      }
    }
    assert.equal(evaluateCondition("DEFAULT_FALLBACK", ctx, "scene"), false);
  } finally {
    delete globalThis.__conditionExecuted;
  }
});

test("khoá lựa chọn: condition khuôn + lockedReason; requires cũ; ALWAYS_UNLOCKED = mở", () => {
  const locked = {
    condition: { var: "money", op: ">=", value: 2_000_000 },
    lockedReason: "Chưa đủ tiền",
  };
  assert.equal(optionLockReason(locked, ctx), "Chưa đủ tiền");
  assert.equal(
    optionLockReason(
      { ...locked, condition: { var: "money", op: ">=", value: 1 } },
      ctx,
    ),
    null,
  );
  assert.equal(
    optionLockReason(
      { requires: { minMoney: 2_000_000, lockedReason: "Thiếu tiền" } },
      ctx,
    ),
    "Thiếu tiền",
  );
  assert.equal(
    optionLockReason({ requires: { inspected: ["ch04_compare"] } }, ctx),
    null,
  );
  assert.equal(
    optionLockReason({ condition: { type: "ALWAYS_UNLOCKED" } }, ctx),
    null,
  );
  assert.equal(optionLockReason({}, ctx), null);
});

test("nhóm quyết định = choiceGroup, không có thì = mã cảnh (cùng luật BE)", () => {
  assert.equal(choiceGroupOf({ id: "S1" }), "S1");
  assert.equal(choiceGroupOf({ id: "S1", choiceGroup: "G" }), "G");
});
