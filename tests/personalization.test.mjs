import test from "node:test";
import assert from "node:assert/strict";
import { createAuthClient } from "../src/api/auth.client.js";
import { createPersonalizationApi } from "../src/api/personalization.client.js";
import { parentAnswers, personalizationStep } from "../src/features/personalization/model.js";
import { initialNovelProgress, saveNovelProgress, readNovelProgress } from "../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import { createServer } from "vite";

test("status controls each step; GAME never asks age; terminal states never ask again", () => {
  const fields = { askChild: ["age"], askInGame: ["gender", "interest", "age"] };
  for (const status of ["NOT_STARTED", "WAITING_CHILD"])
    assert.deepEqual(personalizationStep({ ...fields, status }), { source: "CHILD", dimensions: ["age"] });
  assert.deepEqual(personalizationStep({ ...fields, status: "WAITING_GAME" }), { source: "GAME", dimensions: ["gender", "interest"] });
  for (const status of ["COMPLETED", "SKIPPED"])
    assert.deepEqual(personalizationStep({ ...fields, status }), { done: true });
  assert.throws(() => personalizationStep({ status: "UNKNOWN" }));
  assert.deepEqual(parentAnswers({ gender: "FEMALE" }), { gender: "FEMALE", age: null, interest: null });
});

test("ACCOUNT and SLOT requests keep separate tokens, explicit nulls and empty skip answers; CLASS 403 propagates", async () => {
  const calls = [], values = new Map();
  let denied = false;
  const client = createAuthClient({
    baseUrl: "https://example.test", storage: { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) },
    fetcher: async (url, init) => {
      calls.push({ url, ...init });
      let result = {};
      if (url.endsWith("/auth/login")) result = { accessToken: "ACCOUNT", expiresIn: 3600 };
      if (url.endsWith("/me")) result = { id: "parent", plans: ["PARENT"], roles: [] };
      if (url.endsWith("/slots/login")) result = { accessToken: "SLOT", expiresIn: 3600, slot: { id: "child", displayName: "Bé", groupContext: "FAMILY" } };
      return { ok: !denied, status: denied ? 403 : 200, json: async () => denied ? { code: 3004 } : { code: 0, result } };
    },
  });
  const api = createPersonalizationApi(client);
  await client.login("parent@example.test", "password");
  await api.saveForParent("slot/id", parentAnswers({ gender: "FEMALE" }));
  const parent = calls.at(-1);
  assert.equal(parent.url, "https://example.test/api/slots/slot%2Fid/personalization");
  assert.equal(parent.headers.Authorization, "Bearer ACCOUNT");
  assert.equal(parent.method, "PUT");
  assert.deepEqual(JSON.parse(parent.body), { gender: "FEMALE", age: null, interest: null });
  await client.slotLogin("CHILD", "000000");
  await api.getForChild();
  assert.equal(calls.at(-1).headers.Authorization, "Bearer SLOT");
  for (const source of ["CHILD", "GAME"]) {
    await api.saveForChild(source, {});
    assert.deepEqual(JSON.parse(calls.at(-1).body), { source, answers: {} });
  }
  await api.chapterForChild("release/1", "CH01");
  assert.equal(calls.at(-1).url, "https://example.test/api/play/releases/release%2F1/chapters/CH01");
  assert.equal(calls.at(-1).headers.Authorization, "Bearer SLOT");
  denied = true;
  await assert.rejects(api.saveForParent("class-slot", { gender: "FEMALE" }), (error) => error.status === 403 && error.code === 3004);
});

test("text-only variant changes preserve checkpoint decisions, money and scene progress", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) };
  const data = { id: "CH01", version: "1", variantKey: "gender:FEMALE", scenes: [{ id: "S1" }], initialStats: {} };
  const progress = { ...initialNovelProgress(data), money: 123000, choiceLedger: { choice: { optionId: "A" } } };
  saveNovelProgress(storage, data, progress, "slot:child");
  assert.equal(readNovelProgress(storage, data, "slot:child").variantKey, "gender:FEMALE");
  const resumed = readNovelProgress(storage, { ...data, variantKey: "base" }, "slot:child");
  assert.equal(resumed.variantKey, "base");
  assert.equal(resumed.money, 123000);
  assert.deepEqual(resumed.choiceLedger, progress.choiceLedger);
  assert.deepEqual(resumed.scenePath, progress.scenePath);
  const legacy = { ...data, variantKey: undefined };
  saveNovelProgress(storage, legacy, initialNovelProgress(legacy), "slot:legacy");
  assert.ok(readNovelProgress(storage, { ...data, variantKey: "base" }, "slot:legacy"));
  assert.ok(readNovelProgress(storage, data, "slot:legacy"));
});

test("personalization cache is scoped to the current SLOT login and rejects late responses from another session", async () => {
  let actor = { kind: "learner", id: "a" };
  let response = { status: "COMPLETED" };
  let resolve;
  let deferred = false;
  const api = createPersonalizationApi({
    getSnapshot: () => ({ actor }),
    slotRequest: async () => deferred ? new Promise((done) => { resolve = done; }) : response,
  });
  assert.equal(api.getCachedForChild(), null);
  await api.getForChild();
  assert.equal(api.getCachedForChild().status, "COMPLETED");
  response = { status: "WAITING_GAME" };
  await api.saveForChild("CHILD", {});
  assert.equal(api.getCachedForChild().status, "WAITING_GAME");
  deferred = true;
  const oldRequest = api.getForChild();
  actor = { kind: "learner", id: "b" };
  assert.equal(api.getCachedForChild(), null);
  resolve({ status: "COMPLETED" });
  await oldRequest;
  assert.equal(api.getCachedForChild(), null);
  deferred = false;
  response = { status: "SKIPPED" };
  await api.getForChild();
  assert.equal(api.getCachedForChild().status, "SKIPPED");
  actor = null;
  assert.equal(api.getCachedForChild(), null);
  actor = { kind: "learner", id: "b" };
  assert.equal(api.getCachedForChild(), null, "A new login for the same child needs a fresh read");
});

test("learners fetch personalized chapters; public previews keep the original API and content metadata is preserved", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  const originalFetch = globalThis.fetch;
  globalThis.sessionStorage = { getItem() {}, setItem() {} };
  globalThis.localStorage = { getItem() {}, setItem() {} };
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, ...init });
    let result = { id: "CH01", releaseVersion: "v1", variantKey: "gender:FEMALE", scenes: [] };
    if (url.endsWith("/content/current")) result = { version: "v1" };
    if (url.endsWith("/slots/login")) result = { accessToken: "SLOT", expiresIn: 3600, slot: { id: "child", displayName: "Bé", groupContext: "FAMILY" } };
    return { ok: true, status: 200, json: async () => ({ code: 0, result }) };
  };
  try {
    const { auth } = await server.ssrLoadModule("/src/api/auth.api.js");
    const { getChapterContent } = await server.ssrLoadModule("/src/api/content.api.js");
    await getChapterContent("CH01");
    assert.ok(calls.at(-1).url.endsWith("/api/content/releases/v1/chapters/CH01"));
    assert.equal(calls.at(-1).headers.Authorization, undefined);
    await auth.slotLogin("CHILD", "000000");
    const chapter = await getChapterContent("CH01");
    assert.ok(calls.at(-1).url.endsWith("/api/play/releases/v1/chapters/CH01"));
    assert.equal(calls.at(-1).headers.Authorization, "Bearer SLOT");
    assert.equal(chapter.variantKey, "gender:FEMALE");
    assert.equal(chapter.releaseVersion, "v1");
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.sessionStorage;
    delete globalThis.localStorage;
    await server.close();
  }
});
