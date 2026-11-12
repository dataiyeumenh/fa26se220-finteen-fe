import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { journeyDemoProgress } from "../src/pages/Kid/Dashboard/api/kidJourneyMock.js";
import { endingReportMock } from "../src/pages/Kid/Dashboard/components/game/endingReportMock.js";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

test("guest demo offers only chapter 1 and learners never render a player before progress is loaded", async () => {
  globalThis.localStorage = { getItem() {}, setItem() {} };
  globalThis.sessionStorage = { getItem() {}, setItem() {} };
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  const originalFetch = globalThis.fetch;
  try {
    const { GuestDemo } = await server.ssrLoadModule("/src/features/workspace/KidPages.jsx");
    const { ChapterGuard } = await server.ssrLoadModule("/src/features/workspace/Guards.jsx");
    const { auth } = await server.ssrLoadModule("/src/api/auth.api.js");
    globalThis.fetch = async (url) => ({
      ok: true,
      status: 200,
      json: async () => ({ code: 0, result: url.endsWith("/me")
        ? { id: "guest", displayName: "Khách", plans: [], roles: [] }
        : { accessToken: "guest-token", expiresIn: 60 } }),
    });
    await auth.login("guest@example.com", "password");
    const render = (child, path = "/dashboard/demo") => renderToString(
      React.createElement(MemoryRouter, { initialEntries: [path] }, child),
    );
    const html = render(React.createElement(GuestDemo));
    assert.match(html, /href="\/dashboard\/demo\/play\?chapter=1"/);
    assert.doesNotMatch(html, /href="\/dashboard\/demo\/play\?chapter=[2-8]"/);
    assert.match(html, /href="\/dashboard\/plans"/);
    assert.match(html, /Mở khóa chương 2–8/);
    for (let chapter = 1; chapter <= 8; chapter++) {
      const guarded = render(
        React.createElement(ChapterGuard, null, React.createElement("div", null, "chapter-player")),
        `/dashboard/demo/play?chapter=${chapter}`,
      );
      assert.equal(guarded.includes("chapter-player"), chapter === 1);
    }
    auth.logout();
    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ code: 0, result: {
        accessToken: "learner-token", expiresIn: 60,
        slot: { id: "learner-id", displayName: "Học sinh test", groupContext: "FAMILY" },
      } }),
    });
    await auth.slotLogin("TEST-SLOT", "000000");
    for (const chapter of [1, 2, 8]) {
      const guarded = render(
        React.createElement(ChapterGuard, null, React.createElement("div", null, "chapter-player")),
        `/dashboard/kid/play?chapter=${chapter}`,
      );
      assert.doesNotMatch(guarded, /chapter-player/);
      assert.match(guarded, /Đang kiểm tra tiến trình học/);
    }
    const { default: GameMap } = await server.ssrLoadModule("/src/pages/Kid/Dashboard/components/GameMapReal.jsx");
    const lockedMap = render(React.createElement(GameMap, { chapters: [7, 8].map((id) => ({ id, title: `Chương ${id}`, subtitle: "Chương chưa mở", status: "locked", progress: 0, lessonsCompleted: 0, totalLessons: 1 })) }));
    assert.equal((lockedMap.match(/class="atlas-stop locked"/g) || []).length, 2);
    assert.equal((lockedMap.match(/class="atlas-label locked"/g) || []).length, 2);
    assert.equal((lockedMap.match(/disabled="" class="atlas-stop locked"/g) || []).length, 2);
    assert.match(lockedMap, /Hoàn thành chương trước/);
    auth.logout();
  } finally {
    globalThis.fetch = originalFetch;
    await server.close();
  }
});

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
