import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const report = {
  summary: { totalChapters: 8 },
  rows: [
    { slotId: "one", displayName: "An", status: "ACTIVE", completedChapters: 5, lastActiveAt: "2026-11-10T08:00:00Z" },
    { slotId: "two", displayName: "Bình", status: "ACTIVE", completedChapters: 1, lastActiveAt: null },
  ],
};

test("overview insights adapt actions and attention copy by adult role", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: OverviewInsights } = await server.ssrLoadModule(
      "/src/features/workspace/OverviewInsights.jsx",
    );
    const render = (role) => renderToString(
      React.createElement(MemoryRouter, null, React.createElement(OverviewInsights, { report, role })),
    );
    const parent = render("parent");
    assert.match(parent, /Hành trình gần đây/);
    assert.match(parent, /Quản lý hồ sơ/);
    assert.match(parent, /1 hồ sơ.*cần được khích lệ/);
    assert.match(parent, /5.*8.*chương/s);

    const teacher = render("teacher");
    assert.match(teacher, /Nhịp học của lớp/);
    assert.match(teacher, /Quản lý Quiz/);
    assert.match(teacher, /1 học sinh.*cần được khích lệ/);
  } finally {
    await server.close();
  }
});
