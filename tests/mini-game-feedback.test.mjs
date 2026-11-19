import assert from "node:assert/strict";
import test from "node:test";
import { budgetFeedback, needWantFeedback } from "../src/pages/Kid/Dashboard/components/game/miniGameFeedback.js";
import { chapter2V2GameData } from "./fixtures/content/index.mjs";
import patch from "../scripts/content-migrations/lead-review-2026-11-19.json" with { type: "json" };

test("wrong placements show the correct basket and reason without repeating the item label", () => {
  const item = { label: "Bộ màu vẽ cao cấp", category: "WANTS", explanation: "Bộ màu cơ bản đã đủ để học; phần nâng cấp có thể hoãn." };
  const zones = [{ id: "NEEDS", title: "Giỏ Cần" }, { id: "WANTS", title: "Giỏ Muốn" }];
  const feedback = needWantFeedback(item, false, zones);
  assert.match(feedback, /Chưa đúng: thuộc Giỏ Muốn/);
  assert.ok(!feedback.includes(item.label));
  assert.ok(feedback.includes(item.explanation));
  assert.match(needWantFeedback(item, true, zones), /^Đúng rồi/);
});

test("each envelope explains the target and exact surplus or shortfall for every available amount", () => {
  const game = chapter2V2GameData.scenes.find((scene) => scene.game?.kind === "BUDGET_BUILDER").game;
  for (const zone of game.dropZones) {
    for (const amount of game.draggables) {
      const feedback = budgetFeedback(zone, amount.value);
      assert.ok(feedback.includes(zone.label));
      assert.ok(feedback.includes(`${zone.expectedValue.toLocaleString("vi-VN")}đ`));
      if (amount.value === zone.expectedValue) assert.match(feedback, /Phân bổ hợp lý/);
      else {
        assert.ok(feedback.includes(`${Math.abs(amount.value - zone.expectedValue).toLocaleString("vi-VN")}đ`));
        assert.match(feedback, amount.value > zone.expectedValue ? /quá cao/ : /Còn thiếu/);
      }
    }
    assert.match(budgetFeedback(zone, undefined), /Chưa phân bổ/);
  }
  assert.ok(budgetFeedback({ label: "Dự trù", expectedValue: 200000, explanation: "Để xử lý phát sinh." }, 100000).includes("Để xử lý phát sinh."));
});

test("CH03 content patch supplies all low-month operands before answering", () => {
  const question = patch.CH03.scenes[0].game.questions.find((item) => item.id === "low_month");
  assert.match(question.formula, /2\.000\.000đ/);
  assert.match(question.formula, /1\.800\.000đ/);
  assert.match(question.explain, /200\.000đ/);
  assert.equal(patch.CH02.scenes[0].game.dropZones.length, 6);
});
