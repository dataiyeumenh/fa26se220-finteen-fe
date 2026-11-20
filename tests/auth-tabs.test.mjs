import test from "node:test";
import assert from "node:assert/strict";
import { createAuthClient } from "../src/api/auth.client.js";

const baseUrl = "https://tabs.example.test";
const browserKey = `finteen.session.v1:${baseUrl}`;
const response = (result) => ({ ok: true, status: 200, json: async () => ({ code: 0, result }) });
const store = (data = new Map()) => ({ getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) });
function browser() {
  const shared = store();
  let time = 1000;
  const tab = (handler, slotStorage = store()) => {
    const calls = [];
    const options = { baseUrl, storage: shared, sharedStorage: shared, slotStorage, now: () => time, fetcher: async (url, init) => {
      calls.push({ url, ...init });
      if (handler) {
        const value = handler(url, init);
        if (value !== undefined) return value;
      }
      if (url.endsWith("/auth/login")) return response({ accessToken: `account:${JSON.parse(init.body).email}`, expiresIn: 60 });
      if (url.endsWith("/auth/me")) {
        const id = init.headers.Authorization.replace("Bearer account:", "");
        return response({ id, displayName: id, plans: ["PARENT"], roles: [] });
      }
      if (url.endsWith("/slots/login")) {
        const code = JSON.parse(init.body).code;
        return response({ accessToken: `slot:${code}`, expiresIn: 60, slot: { id: code, displayName: code, groupContext: "FAMILY" } });
      }
      if (url.endsWith("/entitlements")) return response([{ id: "old-entitlement" }]);
      if (url.endsWith("/auth/logout")) return response(null);
      return response([]);
    } };
    return { auth: createAuthClient(options), calls, options };
  };
  return { tab, shared, advance: (ms) => { time += ms; } };
}

test("all account tabs adopt the latest login and discard the previous account's entitlements", async () => {
  const { tab } = browser();
  const first = tab(), second = tab();
  await first.auth.login("A", "password");
  second.auth.syncBrowserSession();
  await second.auth.refresh();
  assert.equal(second.auth.getSnapshot().actor.id, "A");
  await first.auth.ensureEntitlements();
  await second.auth.login("B", "password");
  first.auth.syncBrowserSession();
  await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "B");
  assert.equal(second.auth.getSnapshot().actor.id, "B");
  assert.equal(first.auth.getSnapshot().entitlements, null);
});

test("ACCOUNT and SLOT share one browser identity across existing and newly opened tabs", async () => {
  const { tab } = browser();
  const first = tab(), second = tab();
  await first.auth.login("A", "password");
  second.auth.syncBrowserSession(); await second.auth.refresh();
  await second.auth.slotLogin("CHILD", "123456");
  first.auth.syncBrowserSession();
  assert.equal(first.auth.getSnapshot().actor.id, "CHILD");
  assert.equal(first.auth.getSnapshot().actor.role, "kid");
  const third = tab();
  assert.equal(third.auth.getSnapshot().actor.id, "CHILD");
  await third.auth.login("B", "password");
  for (const current of [first, second]) {
    current.auth.syncBrowserSession(); await current.auth.refresh();
    assert.equal(current.auth.getSnapshot().actor.id, "B");
    assert.equal(current.auth.getSnapshot().learnerDashboard, null);
  }
});

test("logout in one tab signs out other tabs and stale tab storage cannot revive the child", async () => {
  const { tab } = browser();
  const first = tab(), second = tab();
  await first.auth.slotLogin("CHILD", "123456");
  second.auth.syncBrowserSession();
  await first.auth.signOut();
  // Reload the other tab before it has received the storage event.
  const restored = createAuthClient(second.options);
  assert.equal(restored.hasSession(), false);
  second.auth.syncBrowserSession();
  assert.equal(second.auth.hasSession(), false);
  assert.equal(second.auth.getSnapshot().actor, null);
});

test("an expired background tab cannot erase a newer login before receiving a storage event", async () => {
  const { tab, advance } = browser();
  const first = tab(), second = tab();
  await first.auth.login("A", "password");
  advance(60001);
  await second.auth.login("B", "password");
  first.auth.checkExpiry(); await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "B");
  assert.equal(second.auth.hasSession(), true);
});

test("requests from a stale screen cannot send its resource ids with another account's token", async () => {
  const { tab } = browser();
  const first = tab(), second = tab();
  await first.auth.login("A", "password");
  await second.auth.login("B", "password");
  await assert.rejects(first.auth.accountRequest("/api/groups/group-owned-by-A"), (error) => error.status === 409);
  await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "B");
  assert.ok(!first.calls.some((call) => call.url.includes("group-owned-by-A")));
});

test("late expiry responses for another tab's replaced token do not log out the new user", async () => {
  let finish;
  const { tab } = browser();
  const first = tab((url) => {
    if (url.endsWith("/slow")) return new Promise((resolve) => { finish = () => resolve({ ok: false, status: 401, json: async () => ({ code: 3003 }) }); });
  });
  const second = tab();
  await first.auth.login("A", "password");
  const pending = first.auth.accountRequest("/slow");
  await second.auth.login("B", "password");
  finish();
  await assert.rejects(pending);
  await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "B");
  assert.equal(second.auth.hasSession(), true);
});

test("an older pending login cannot overwrite a login completed in another tab", async () => {
  let finish;
  const { tab, shared } = browser();
  const first = tab((url) => {
    if (url.endsWith("/auth/login")) return new Promise((resolve) => { finish = () => resolve(response({ accessToken: "old-pending", expiresIn: 60 })); });
  });
  const second = tab();
  const pending = first.auth.login("A", "password");
  await second.auth.login("B", "password");
  finish(); assert.equal(await pending, false); await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "B");
  assert.equal(JSON.parse(shared.getItem(browserKey)).accessToken, "account:B");
});

test("valid legacy sessions migrate once and an explicit shared logout wins over legacy data", async () => {
  const { shared, tab } = browser();
  shared.setItem(`finteen.account.v1:${baseUrl}`, JSON.stringify({ type: "ACCOUNT", accessToken: "account:A", expiresAt: 100000 }));
  const first = tab();
  await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "A");
  assert.equal(JSON.parse(shared.getItem(browserKey)).type, "ACCOUNT");
  first.auth.logout();
  shared.setItem(`finteen.account.v1:${baseUrl}`, JSON.stringify({ type: "ACCOUNT", accessToken: "account:OLD", expiresAt: 100000 }));
  const second = tab();
  assert.equal(second.auth.hasSession(), false);
});

test("isolated browser profiles retain independent sessions", async () => {
  const first = browser().tab(), second = browser().tab();
  await first.auth.login("A", "password");
  await second.auth.login("B", "password");
  first.auth.syncBrowserSession(); second.auth.syncBrowserSession();
  assert.equal(first.auth.getSnapshot().actor.id, "A");
  assert.equal(second.auth.getSnapshot().actor.id, "B");
});

test("a password reset completed after another tab signs in does not log out that account", async () => {
  let finish;
  const { tab } = browser();
  const first = tab((url) => {
    if (url.endsWith("/password/reset")) return new Promise((resolve) => { finish = () => resolve(response(null)); });
  });
  const second = tab();
  const pending = first.auth.resetPassword("A", "123456", "new-password");
  await second.auth.login("B", "password");
  finish();
  assert.equal(await pending, false);
  await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "B");
  assert.equal(second.auth.hasSession(), true);
});

test("a replaced login that was still loading its profile signals cancellation to the form", async () => {
  let finish;
  const { tab } = browser();
  const first = tab((url, options) => {
    if (url.endsWith("/auth/me") && options.headers.Authorization === "Bearer account:A") {
      return new Promise((resolve) => { finish = () => resolve(response({ id: "A", displayName: "A", plans: [], roles: [] })); });
    }
  });
  const second = tab();
  const pending = first.auth.login("A", "password");
  for (let tick = 0; tick < 10 && !finish; tick++) await Promise.resolve();
  assert.ok(finish);
  await second.auth.login("B", "password");
  finish();
  assert.equal(await pending, false);
  await first.auth.refresh();
  assert.equal(first.auth.getSnapshot().actor.id, "B");
});
