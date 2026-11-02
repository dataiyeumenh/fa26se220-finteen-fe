import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { journeyDemoProgress } from "../src/pages/Kid/Dashboard/api/kidJourneyMock.js";
import { endingReportMock } from "../src/pages/Kid/Dashboard/components/game/endingReportMock.js";

test("journey preview has completed, current and upcoming chapters with consistent progress", () => {
  const chapters = Array.from({ length: 8 }, (_, i) => journeyDemoProgress(i + 1));
  assert.equal(chapters.filter((c) => c.status === "completed").length, 2);
  assert.equal(chapters.filter((c) => c.status === "current").length, 1);
  assert.equal(chapters.reduce((sum, c) => sum + c.lessonsCompleted, 0), 12);
  assert.equal(endingReportMock.source, "mock");
});
test("Studio validation messages preserve exact Vietnamese text", async () => {
  const studio = await readFile("src/features/studio/studioClient.js", "utf8");
  const assets = await readFile("src/features/studio/assetsApi.js", "utf8");
  assert.ok(studio.includes('Đường dẫn Studio không hợp lệ.'));
  assert.ok(assets.includes('Chọn ảnh PNG, JPEG hoặc WebP, tối đa 5 MB.'));
});
