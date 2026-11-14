import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  // Biểu thức có phép so sánh vẫn bị từ chối.
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

test("ending report strings support flags, negation, derived booleans and conjunctions", () => {
  const context = {
    flags: { receipt_resolved: true, source_checked: false, credit_plan_fit: true, selected_loan_B: false },
    derived: { miniGameNeedsPractice: true },
  };
  const cases = [
    ["flags.receipt_resolved", true],
    ["!flags.source_checked", true],
    ["miniGameNeedsPractice", true],
    ["flags.credit_plan_fit && !flags.selected_loan_B", true],
    [" flags.credit_plan_fit  &&  !flags.selected_loan_B ", true],
    ["!miniGameNeedsPractice", false],
    ["flags.source_checked", false],
    ["flags.missing", false],
    ["missingDerived", false],
    ["!flags.missing", true],
  ];
  for (const [expression, expected] of cases) {
    assert.equal(evaluateCondition(expression, context, "ending"), expected, expression);
    assert.equal(evaluateCondition(expression, context, "scene"), false, expression);
  }
  const opposite = {
    flags: { receipt_resolved: false, source_checked: true, credit_plan_fit: true, selected_loan_B: true },
    derived: { miniGameNeedsPractice: false },
  };
  for (const expression of ["flags.receipt_resolved", "!flags.source_checked", "miniGameNeedsPractice", "flags.credit_plan_fit && !flags.selected_loan_B"]) {
    assert.equal(evaluateCondition(expression, opposite, "ending"), false, expression);
  }
});

test("ending report parser rejects unsupported syntax and inherited properties", () => {
  for (const expression of [
    "alert(1)", "flags.a || 1", "constructor.x", "flags.a.constructor", "flags['a']", "flags.a === true",
    "flags.a &&", "&& flags.a", "flags.a && && flags.b", "", " ", "!!flags.a", "(flags.a)",
    "flags.a; alert(1)", "flags.a\nalert(1)", "constructor", "flags.constructor", "toString", "flags.__proto__",
  ]) {
    assert.equal(evaluateCondition(expression, { flags: { a: true }, derived: {} }, "ending"), false, expression);
  }
});

test("all 34 published CH03–CH08 report when strings respond to matching and opposite state", () => {
  let checked = 0;
  for (let number = 3; number <= 8; number++) {
    const code = `CH${String(number).padStart(2, "0")}`;
    const chapter = JSON.parse(readFileSync(new URL(`./fixtures/content/${code}.json`, import.meta.url), "utf8"));
    for (const section of ["achieved", "practice"]) {
      const lines = chapter.endingReport[section];
      for (const line of lines.filter((item) => typeof item.when === "string")) {
        const matching = { flags: {}, derived: {} };
        for (const term of line.when.split("&&").map((value) => value.trim())) {
          const negated = term.startsWith("!");
          const name = negated ? term.slice(1) : term;
          (name.startsWith("flags.") ? matching.flags : matching.derived)[name.startsWith("flags.") ? name.slice(6) : name] = !negated;
        }
        assert.equal(evaluateCondition(line.when, matching, "ending"), true, `${code}.${section}: ${line.when}`);
        for (const values of [matching.flags, matching.derived]) {
          for (const key of Object.keys(values)) values[key] = !values[key];
        }
        assert.equal(evaluateCondition(line.when, matching, "ending"), false, `${code}.${section}: ${line.when}`);
        checked++;
      }
    }
  }
  assert.equal(checked, 34, "keep coverage for all published report when strings");
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
