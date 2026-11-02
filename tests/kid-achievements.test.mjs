import test from "node:test";
import assert from "node:assert/strict";
import { resolveAchievements } from "../src/pages/Kid/Dashboard/api/kidAchievements.js";

test("mock catalog covers all 8 chapters, completion and exact A/B/C grades", () => {
  const result = resolveAchievements([]);
  assert.equal(result.source, "mock");
  assert.equal(result.items.length, 32);
  assert.equal(new Set(result.items.map((i) => i.code)).size, 32);
  assert.equal(result.items.filter((i) => i.unlocked).length, 6);
  assert.deepEqual(result.items.slice(0, 4).map((i) => i.difficulty), [1, 2, 3, 4]);
  assert.deepEqual(result.items.slice(0, 4).map((i) => i.grade), [null, "C", "B", "A"]);
  for (let chapter = 1; chapter <= 8; chapter++) {
    for (const level of ["COMPLETE", "A", "B", "C"]) {
      assert.ok(result.items.find((i) => i.code === `MOCK_CH${chapter}_${level}`));
    }
  }
});
test("real achievements replace all mock fixtures and preserve earned dates", () => {
  const items = [{ code: "CH01_COMPLETE", title: "Chương 1", earnedAt: "2026-11-02T00:00:00Z" }];
  const result = resolveAchievements(items);
  assert.equal(result.source, "api");
  assert.deepEqual(result.items, [{ ...items[0], unlocked: true }]);
  assert.equal(items[0].unlocked, undefined);
});
