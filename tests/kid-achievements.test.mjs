import test from "node:test";
import assert from "node:assert/strict";
import { resolveAchievements } from "../src/pages/Kid/Dashboard/api/kidAchievements.js";

test("missing achievements stay empty instead of unlocking mock badges", () => {
  const result = resolveAchievements([]);
  assert.equal(result.source, "api");
  assert.deepEqual(result.items, []);
});
test("real achievements replace all mock fixtures and preserve earned dates", () => {
  const items = [{ code: "CH01_COMPLETE", title: "Chương 1", earnedAt: "2026-11-02T00:00:00Z" }];
  const result = resolveAchievements(items);
  assert.equal(result.source, "api");
  assert.deepEqual(result.items, [{ ...items[0], unlocked: true }]);
  assert.equal(items[0].unlocked, undefined);
});
