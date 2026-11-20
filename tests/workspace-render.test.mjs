import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

test("adult learner journeys retain the reports sidebar selection and theme", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { auth } = await server.ssrLoadModule("/src/api/auth.api.js");
    const { default: WorkspaceLayout } = await server.ssrLoadModule("/src/features/workspace/WorkspaceLayout.jsx");
    for (const role of ["parent", "teacher"]) {
      const snapshot = { actor: { id: "nav-test", name: "Test", role, plans: [role] }, entitlements: [] };
      auth.getSnapshot = () => snapshot;
      for (const [path, active, theme] of [
        ["/dashboard/learners/child-123", "/dashboard/reports", "reports"],
        ["/dashboard/learners/child-123/", "/dashboard/reports", "reports"],
        ["/dashboard/reports", "/dashboard/reports", "reports"],
        ["/dashboard/reports/", "/dashboard/reports", "reports"],
        ["/dashboard/learners", "/dashboard/learners", "children"],
        ["/dashboard/learners/", "/dashboard/learners", "children"],
        ["/dashboard", "/dashboard", "overview"],
      ]) {
        const html = renderToString(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(WorkspaceLayout)));
        const activeLinks = [...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g)].map(([tag]) => tag.match(/href="([^"]+)"/)?.[1]);
        assert.deepEqual(activeLinks, [active], `${role} at ${path}`);
        assert.match(html, new RegExp(`data-ws-page="${theme}"`));
      }
    }
  } finally {
    await server.close();
  }
});

test("legacy browser sessions cannot restore a mock actor and Kid login uses the six-digit SLOT form", async () => {
  globalThis.localStorage = {
    getItem() {
      throw new Error("Must not read legacy database");
    },
  };
  globalThis.sessionStorage = {
    getItem: () => JSON.stringify({ kind: "adult", id: "legacy" }),
    setItem() {},
  };
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const { default: AuthForm } = await server.ssrLoadModule(
      "/src/features/workspace/AuthForm.jsx",
    );
    const html = renderToString(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/login?as=kid"] },
        React.createElement(AuthForm),
      ),
    );
    assert.doesNotMatch(html, /fieldset disabled/);
    assert.match(html, /VD: K7MPQ2XA/);
    assert.match(html, /pattern="\[0-9\]\{6\}"/);
    assert.doesNotMatch(html, /đang chờ kết nối API SLOT/);
  } finally {
    await server.close();
  }
});
