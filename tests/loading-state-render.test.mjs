import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

test("shared loading states are accessible and preserve page structure", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { PageLoader, ContentSkeleton } = await server.ssrLoadModule(
      "/src/components/feedback/LoadingState.jsx",
    );
    const page = renderToString(React.createElement(PageLoader, { label: "Đang kiểm tra phiên…" }));
    assert.match(page, /role="status"/);
    assert.match(page, /finteen-logo-v2\.png/);
    assert.match(page, /Đang kiểm tra phiên/);

    const dashboard = renderToString(React.createElement(ContentSkeleton, { label: "Đang tải tổng quan…" }));
    assert.match(dashboard, /is-dashboard/);
    assert.match(dashboard, /aria-label="Đang tải tổng quan…"/);
    assert.match(dashboard, /ft-skeleton-hero/);

    const table = renderToString(React.createElement(ContentSkeleton, { variant: "table" }));
    assert.match(table, /is-table/);
    assert.match(table, /ft-skeleton-table-row/);
  } finally {
    await server.close();
  }
});
