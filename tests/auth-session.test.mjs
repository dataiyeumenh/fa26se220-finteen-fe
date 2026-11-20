import test from "node:test";
import assert from "node:assert/strict";
import { createAuthClient } from "../src/api/auth.client.js";

const account = { id: "adult", displayName: "Adult", plans: ["PARENT"], roles: [] };
const accountToken = { accessToken: "adult-token", expiresIn: 3600 };
const slotToken = { accessToken: "child-token", expiresIn: 3600, slot: { id: "child", displayName: "Child", groupContext: "FAMILY" } };
const response = (result) => ({ ok: true, status: 200, json: async () => ({ code: 0, result }) });
function setup(handler, extra = {}) {
  const data = new Map();
  const calls = [];
  const auth = createAuthClient({
    baseUrl: "https://example.test",
    storage: { getItem: (key) => data.get(key), setItem: (key, value) => data.set(key, value) },
    fetcher: async (url, options) => {
      calls.push({ url, ...options });
      if (handler) {
        const reply = handler(url, options);
        if (reply !== undefined) return reply;
      }
      if (url.endsWith("/slots/login")) return response(slotToken);
      if (url.endsWith("/auth/login")) return response(accountToken);
      if (url.endsWith("/auth/me")) return response(account);
      throw new Error(`Unexpected request: ${url}`);
    },
    ...extra,
  });
  return { auth, calls, data };
}

test("a transient profile refresh failure retains the valid actor and can be retried", async () => {
  let fail = false;
  const { auth } = setup((url) => {
    if (fail && url.endsWith("/auth/me")) throw new Error("offline");
  });
  await auth.login("adult@example.test", "password");
  fail = true;
  await assert.rejects(auth.refresh());
  assert.equal(auth.getSnapshot().actor.id, account.id);
  assert.equal(auth.hasSession(), true);
  assert.ok(auth.getSnapshot().error);
  fail = false;
  await auth.refresh();
  assert.equal(auth.getSnapshot().error, "");
  assert.equal(auth.getSnapshot().actor.id, account.id);
});

test("concurrent focus refreshes share one profile request", async () => {
  let defer = false, finish;
  const { auth, calls } = setup((url) => {
    if (defer && url.endsWith("/auth/me")) return new Promise((resolve) => { finish = () => resolve(response(account)); });
  });
  await auth.login("adult@example.test", "password");
  defer = true;
  const first = auth.refresh();
  const second = auth.refresh();
  assert.equal(calls.filter((call) => call.url.endsWith("/auth/me")).length, 2);
  finish();
  await Promise.all([first, second]);
  assert.equal(auth.getSnapshot().actor.id, account.id);
});

test("an old adult component cannot log out a newly signed-in child by requesting ACCOUNT data", async () => {
  const { auth, calls } = setup();
  await auth.login("adult@example.test", "password");
  await auth.slotLogin("CHILD", "123456");
  const before = calls.length;
  await assert.rejects(auth.accountRequest("/api/groups"), (error) => error.code === 3003);
  assert.equal(calls.length, before);
  assert.equal(auth.getSnapshot().actor.id, "child");
  assert.equal(auth.hasSession(), true);
});

test("an old child component cannot log out a newly signed-in adult by requesting SLOT data", async () => {
  const { auth, calls } = setup();
  await auth.slotLogin("CHILD", "123456");
  await auth.login("adult@example.test", "password");
  const before = calls.length;
  await assert.rejects(auth.slotRequest("/api/learner/dashboard"), (error) => error.code === 3003);
  assert.equal(calls.length, before);
  assert.equal(auth.getSnapshot().actor.id, account.id);
  assert.equal(auth.hasSession(), true);
});

test("a late logout response cannot clear a replacement login", async () => {
  let finishLogout;
  const { auth } = setup((url) => {
    if (url.endsWith("/auth/logout")) return new Promise((resolve) => { finishLogout = () => resolve(response(null)); });
  });
  await auth.login("adult@example.test", "password");
  const logout = auth.signOut();
  await auth.slotLogin("CHILD", "123456");
  finishLogout();
  await logout;
  assert.equal(auth.getSnapshot().actor.id, "child");
  assert.equal(auth.hasSession(), true);
});

test("a pending learner sync on logout must not revoke a replacement session", async () => {
  let finishSync;
  const { auth, calls } = setup(undefined, {
    beforeSlotSignOut: () => new Promise((resolve) => { finishSync = resolve; }),
  });
  await auth.slotLogin("CHILD", "123456");
  const logout = auth.signOut();
  await auth.login("adult@example.test", "password");
  finishSync();
  await logout;
  assert.ok(!calls.some((call) => call.url.endsWith("/auth/logout")));
  assert.equal(auth.getSnapshot().actor.id, account.id);
});
