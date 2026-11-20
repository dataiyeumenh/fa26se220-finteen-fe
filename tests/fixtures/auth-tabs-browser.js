import { createAuthClient } from "/src/api/auth.client.js";
import { startAuth } from "/src/api/auth.api.js";

const baseUrl = "https://session-check.invalid";
const worker = new URLSearchParams(location.search).has("worker");
const wait = () => new Promise((resolve) => setTimeout(resolve, 30));
async function until(check, label) {
  for (let count = 0; count < 200; count++) { if (check()) return; await wait(); }
  throw new Error(`Timed out: ${label}`);
}
const response = (result) => ({ ok: true, status: 200, json: async () => ({ code: 0, result }) });
if (worker) {
  const local = { getItem: (key) => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
  const test = { failProfile: false };
  test.auth = createAuthClient({
    baseUrl, storage: local, sharedStorage: local,
    slotStorage: { getItem: (key) => sessionStorage.getItem(key), setItem: (key, value) => sessionStorage.setItem(key, value) },
    fetcher: async (url, options) => {
      if (url.endsWith("/auth/login")) return response({ accessToken: `adult:${JSON.parse(options.body).email}`, expiresIn: 3600 });
      if (url.endsWith("/auth/me")) {
        if (test.failProfile) throw new Error("offline");
        const id = options.headers.Authorization.replace("Bearer adult:", "");
        return response({ id, displayName: id, plans: ["PARENT"], roles: [] });
      }
      if (url.endsWith("/slots/login")) {
        const id = JSON.parse(options.body).code;
        return response({ accessToken: `child:${id}`, expiresIn: 3600, slot: { id, displayName: id, groupContext: "FAMILY" } });
      }
      if (url.endsWith("/auth/logout")) return response(null);
      throw new Error("Unexpected API request");
    },
  });
  test.stop = startAuth(test.auth);
  window.authTabsTest = test;
} else {
  const results = [];
  const frames = [];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const createWindow = async () => {
    const frame = document.createElement("iframe");
    frame.src = `${location.pathname}?worker=1`;
    document.getElementById("root").append(frame);
    frames.push(frame);
    await until(() => frame.contentWindow?.authTabsTest, "window initialized");
    return frame.contentWindow;
  };
  try {
    for (const prefix of ["finteen.account.v1:", "finteen.slot.v1:", "finteen.session.v1:", "finteen.account.context.v1:"]) {
      localStorage.removeItem(prefix + baseUrl);
      sessionStorage.removeItem(prefix + baseUrl);
    }
    const first = await createWindow(), second = await createWindow();
    await first.authTabsTest.auth.login("A", "password");
    await until(() => second.authTabsTest.auth.getSnapshot().actor?.id === "A", "first account propagated by storage event");
    await second.authTabsTest.auth.login("B", "password");
    await until(() => first.authTabsTest.auth.getSnapshot().actor?.id === "B", "replacement account propagated");
    results.push("Real browser storage events synchronize account login across windows");

    first.authTabsTest.failProfile = true;
    first.dispatchEvent(new first.Event("focus"));
    await until(() => first.authTabsTest.auth.getSnapshot().error, "temporary profile error");
    assert(first.authTabsTest.auth.getSnapshot().actor.id === "B" && first.authTabsTest.auth.hasSession(), "Focus network failure erased the session");
    first.authTabsTest.failProfile = false;
    first.dispatchEvent(new first.Event("focus"));
    await until(() => !first.authTabsTest.auth.getSnapshot().error, "retry recovered");
    results.push("Temporary focus refresh failures retain the signed-in account and recover");

    await second.authTabsTest.auth.slotLogin("CHILD", "123456");
    await until(() => first.authTabsTest.auth.getSnapshot().actor?.id === "CHILD", "child login propagated");
    const third = await createWindow();
    assert(third.authTabsTest.auth.getSnapshot().actor?.id === "CHILD", "New window did not restore shared child session");
    results.push("A child login replaces the adult in existing and newly opened windows");

    await first.authTabsTest.auth.signOut();
    await until(() => !second.authTabsTest.auth.hasSession() && !third.authTabsTest.auth.hasSession(), "logout propagated");
    results.push("Logout is propagated to every window");
    document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
    document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
  } catch (error) {
    document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
    document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message, results });
  } finally {
    frames.forEach((frame) => frame.contentWindow?.authTabsTest?.stop());
  }
}
