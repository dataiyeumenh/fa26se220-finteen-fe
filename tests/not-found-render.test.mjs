import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

test("404 page renders public and internal destinations", async () => {
  const memory = () => {
    const data = new Map();
    return { getItem: (key) => data.get(key), setItem: (key, value) => data.set(key, value) };
  };
  globalThis.localStorage = memory();
  globalThis.sessionStorage = memory();
  globalThis.window = { addEventListener() {}, history: { length: 1 } };
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: NotFoundPage } = await server.ssrLoadModule("/src/pages/NotFoundPage.jsx");
    const render = (path, props = {}) => renderToString(
      React.createElement(
        MemoryRouter,
        { initialEntries: [path] },
        React.createElement(NotFoundPage, props),
      ),
    );
    const publicPage = render("/khong-ton-tai");
    assert.match(publicPage, /Hình như bạn đã rẽ nhầm một chặng/);
    assert.match(publicPage, /finteen-logo-v2\.png/);
    assert.match(publicPage, /href="\/"/);
    const internalPage = render("/internal/khong-ton-tai", { internal: true });
    assert.match(internalPage, /Không tìm thấy trang nội bộ/);
    assert.match(internalPage, /href="\/internal\/login"/);
  } finally {
    await server.close();
  }
});
