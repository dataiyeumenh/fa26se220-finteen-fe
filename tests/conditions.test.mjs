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
  assert.equal(evaluateCondition({ var: "choice:CH04_SC02", op: "!=", value: "CH04_SC02_A" }, ctx), false);
  assert.equal(evaluateCondition({ var: "choice:CH09_X", op: "==", value: "A" }, ctx), false); // chưa chọn
  assert.equal(evaluateCondition({ var: "flag:chua_bat", op: "==", value: false }, ctx), true);
  assert.equal(evaluateCondition({ var: "bien_la", op: "==", value: 1 }, ctx), false); // biến lạ: không đoán
});

test("biến kết chương đọc từ ctx.derived", () => {
  assert.equal(evaluateCondition({ var: "choicePercent", op: ">=", value: 75 }, ctx, "ending"), true);
  assert.equal(evaluateCondition({ var: "miniGameNeedsPractice", op: "==", value: true }, ctx, "ending"), false);
});

test("dạng cũ giữ đúng hành vi cũ", () => {
  // rẽ tự động: {expression}/{check} chạy như trước; chuỗi trần bộ cũ không hiểu → false
  assert.equal(evaluateCondition({ expression: "flags.source_checked" }, ctx, "scene"), true);
  assert.equal(evaluateCondition({ check: "SAVING >= 60 && RISK < 40" }, ctx, "scene"), true);
  assert.equal(evaluateCondition("flags.source_checked", ctx, "scene"), false);
  assert.equal(evaluateCondition({ field: "SAVING", operator: ">=", value: 60 }, ctx, "scene"), true);
  // kết chương: chuỗi chạy với biến kết chương; DEFAULT_FALLBACK luôn đúng; object cũ → false
  assert.equal(evaluateCondition("money >= 1000000 && !miniGameNeedsPractice", ctx, "ending"), true);
  assert.equal(evaluateCondition("DEFAULT_FALLBACK", ctx, "ending"), true);
  assert.equal(evaluateCondition({ expression: "true" }, ctx, "ending"), false);
  assert.equal(evaluateCondition(undefined, ctx), false);
});

test("khoá lựa chọn: condition khuôn + lockedReason; requires cũ; ALWAYS_UNLOCKED = mở", () => {
  const locked = { condition: { var: "money", op: ">=", value: 2_000_000 }, lockedReason: "Chưa đủ tiền" };
  assert.equal(optionLockReason(locked, ctx), "Chưa đủ tiền");
  assert.equal(optionLockReason({ ...locked, condition: { var: "money", op: ">=", value: 1 } }, ctx), null);
  assert.equal(
    optionLockReason({ requires: { minMoney: 2_000_000, lockedReason: "Thiếu tiền" } }, ctx),
    "Thiếu tiền",
  );
  assert.equal(optionLockReason({ requires: { inspected: ["ch04_compare"] } }, ctx), null);
  assert.equal(optionLockReason({ condition: { type: "ALWAYS_UNLOCKED" } }, ctx), null);
  assert.equal(optionLockReason({}, ctx), null);
});

test("nhóm quyết định = choiceGroup, không có thì = mã cảnh (cùng luật BE)", () => {
  assert.equal(choiceGroupOf({ id: "S1" }), "S1");
  assert.equal(choiceGroupOf({ id: "S1", choiceGroup: "G" }), "G");
});
