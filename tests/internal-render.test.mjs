import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

test("internal routes require the shared ACCOUNT login instead of seeded credentials", async () => {
  globalThis.localStorage = { getItem() {}, setItem() {} };
  globalThis.sessionStorage = { getItem() {}, setItem() {} };
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const { default: InternalApp } = await server.ssrLoadModule(
      "/src/features/internal/InternalApp.jsx",
    );
    const html = renderToString(
      React.createElement(MemoryRouter, null, React.createElement(InternalApp)),
    );
    assert.equal(html, "");
    assert.doesNotMatch(html, /FinTeenDemo!|@finteen.demo|<form/);
    const { default: AuthForm } = await server.ssrLoadModule('/src/features/workspace/AuthForm.jsx');
    const login = renderToString(React.createElement(MemoryRouter, { initialEntries: ['/internal/login?as=kid'] }, React.createElement(AuthForm, { internal: true })));
    assert.match(login, /Đăng nhập nội bộ/);
    assert.match(login, /type="email"/);
    assert.match(login, /Game Editor, Game Reviewer/);
    assert.doesNotMatch(login, /Loại tài khoản|href="\/register"|Mã PIN/);
    const { accountDestination, hasInternalAccess } = await server.ssrLoadModule('/src/features/internal/access.js');
    for (const role of ['ADMIN', 'GAME_EDITOR', 'GAME_REVIEWER', 'GAME_MANAGER']) {
      assert.equal(hasInternalAccess({ roles: [role] }), true);
      assert.equal(accountDestination({ roles: [role] }), '/internal');
    }
    assert.equal(hasInternalAccess({ roles: ['PARENT'] }), false);
    assert.equal(accountDestination({ role: 'kid' }), '/dashboard/kid');
    const { default: StudioWorkspace } = await server.ssrLoadModule('/src/features/internal/StudioWorkspace.jsx');
    const menuFor = roles => renderToString(React.createElement(MemoryRouter, { initialEntries: ['/internal'] }, React.createElement(StudioWorkspace, { actor: { roles, displayName: 'Studio User' } })));
    for (const [role, path] of [['GAME_EDITOR', 'chapters'], ['GAME_REVIEWER', 'reviews'], ['GAME_MANAGER', 'releases']]) {
      const menu = menuFor([role]);
      assert.match(menu, new RegExp(`href="/internal/${path}"`));
      assert.match(menu, /href="\/internal\/assets"/);
      assert.match(menu, /href="\/internal\/chapters"/);
      if (role === 'GAME_MANAGER') assert.match(menu, /href="\/internal\/releases"/);
      else assert.doesNotMatch(menu, /href="\/internal\/releases"/);
      assert.match(menu, /href="\/internal\/questions"/);
      if (role !== 'GAME_REVIEWER') assert.doesNotMatch(menu, /href="\/internal\/reviews"/);
    }
    const combined = menuFor(['GAME_EDITOR', 'GAME_REVIEWER']);
    assert.match(combined, /href="\/internal\/chapters"/);
    assert.match(combined, /href="\/internal\/reviews"/);
    assert.match(combined, /value="GAME_REVIEWER"/);
    assert.match(combined, /KHÔNG GIAN BIÊN TẬP/);
    const admin = menuFor(['ADMIN']);
    assert.match(admin, /href="\/internal\/admin"/);
    assert.match(admin, /href="\/internal\/history"/);
    assert.match(admin, /value="GAME_REVIEWER"/);
    assert.match(menuFor(['GAME_REVIEWER']), /KHÔNG GIAN KIỂM DUYỆT/);
    assert.match(menuFor(['GAME_MANAGER']), /KHÔNG GIAN PHÁT HÀNH/);
  } finally {
    await server.close();
  }
});
