import test from "node:test";
import assert from "node:assert/strict";
import { chapter1V2GameData as ch1 } from "./fixtures/content/index.mjs";
import { chapter2V2GameData as ch2 } from "./fixtures/content/index.mjs";
import { chapter3V2GameData as ch3 } from "./fixtures/content/index.mjs";
import { chapter4V2GameData as ch4 } from "./fixtures/content/index.mjs";
import { chapter5V2GameData as ch5 } from "./fixtures/content/index.mjs";
import { chapter6V2GameData as ch6 } from "./fixtures/content/index.mjs";
import { chapter7V2GameData as ch7 } from "./fixtures/content/index.mjs";
import { chapter8V2GameData as ch8 } from "./fixtures/content/index.mjs";
import {
  novelProgressOwner,
  progressKey,
  readNovelProgress,
  saveNovelProgress,
  loadBrowserNovelProgress,
  saveBrowserNovelProgress,
  clearBrowserNovelProgress,
  initialNovelProgress,
} from "../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";

test("progress owners distinguish adult accounts and learner profiles", () => {
  assert.equal(novelProgressOwner({ id: "a", role: "guest" }), "account:a");
  assert.equal(novelProgressOwner({ id: "a", role: "kid" }), "slot:a");
  assert.notEqual(novelProgressOwner({ id: "a", role: "guest" }), novelProgressOwner({ id: "b", role: "guest" }));
  assert.equal(novelProgressOwner(null), null);
  assert.equal(novelProgressOwner({ role: "guest" }), null);
});

test("a new account never inherits another account's ending, choices or scores in any chapter", () => {
  const previousWindow = globalThis.window;
  const localStorage = storage(), sessionStorage = storage();
  globalThis.window = { localStorage, sessionStorage };
  try {
    for (const data of [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8]) {
      const completed = { ...snapshot(data), scenePath: [0, data.scenes.length - 1] };
      saveBrowserNovelProgress(data, completed, "account:a");
      assert.equal(loadBrowserNovelProgress(data, "account:b"), null);
      assert.equal(loadBrowserNovelProgress(data, "slot:a"), null);
      saveBrowserNovelProgress(data, initialNovelProgress(data), "account:b");
      assert.deepEqual(loadBrowserNovelProgress(data, "account:b").scenePath, [0]);
      assert.deepEqual(loadBrowserNovelProgress(data, "account:a").scenePath, completed.scenePath);
      clearBrowserNovelProgress(data, "account:b");
      assert.equal(loadBrowserNovelProgress(data, "account:b"), null);
      assert.deepEqual(loadBrowserNovelProgress(data, "account:a").miniGameResults, completed.miniGameResults);
    }
  } finally {
    globalThis.window = previousWindow;
  }
});

test("legacy checkpoints without an owner are never adopted by a newly signed-in account", () => {
  const previousWindow = globalThis.window;
  const localStorage = storage(), sessionStorage = storage();
  globalThis.window = { localStorage, sessionStorage };
  try {
    const legacy = JSON.stringify({ ...snapshot(ch1), version: ch1.version });
    localStorage.setItem(`finteen:vn:${ch1.id}`, legacy);
    sessionStorage.setItem(`finteen:vn:${ch1.id}:${ch1.version}`, legacy);
    for (const owner of ["account:a", "account:b", "slot:a", null]) {
      assert.equal(loadBrowserNovelProgress(ch1, owner), null);
    }
    saveBrowserNovelProgress(ch1, snapshot(ch1), null);
    assert.equal(localStorage.length, 1);
    assert.equal(sessionStorage.length, 1);
  } finally {
    globalThis.window = previousWindow;
  }
});

function storage() {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    key: (index) => [...values.keys()][index] || null,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
function snapshot(data) {
  return {
    ...initialNovelProgress(data),
    scenePath: Array.from({ length: 15 }, (_, i) => i),
    money: 0,
    choiceLedger: { choice: { optionId: "answer", deltaStats: { GOAL: 3 } } },
    miniGameResults: {
      game: {
        score: 2,
        total: 3,
        completed: true,
        answers: { first: { finalCorrect: false } },
      },
    },
    inspectedIds: { card: true },
    moneyEventsApplied: { transaction: true },
    committedDecisions: ["choice"],
    stats: { ...data.initialStats, GOAL: 63 },
  };
}
for (const data of [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8]) {
  test(`${data.id} saves the exact scene, decisions, money and scores regardless of old opt-in flags`, () => {
    const memory = storage(),
      state = snapshot(data);
    assert.equal(saveNovelProgress(memory, data, state, "test-owner"), true);
    const restored = readNovelProgress(memory, data, "test-owner");
    assert.deepEqual(restored, {
      ...state,
      version: data.version,
      sceneIds: state.scenePath.map((index) => data.scenes[index].id),
    });
    assert.equal(restored.scenePath.at(-1), 14);
    assert.equal(restored.money, 0);
  });
}
test("scene IDs preserve progress if an update inserts scenes or changes chapter version", () => {
  const memory = storage(),
    state = snapshot(ch5);
  saveNovelProgress(memory, ch5, state, "test-owner");
  const updated = {
    ...ch5,
    version: "next",
    scenes: [{ id: "new-intro" }, ...ch5.scenes],
  };
  const restored = readNovelProgress(memory, updated, "test-owner");
  assert.deepEqual(
    restored.scenePath,
    state.scenePath.map((index) => index + 1),
  );
  assert.equal(progressKey(updated, "test-owner"), progressKey(ch5, "test-owner"));
  assert.deepEqual(restored.choiceLedger, state.choiceLedger);
  assert.equal(
    readNovelProgress(memory, { ...ch5, scenes: ch5.scenes.slice(15) }, "test-owner"),
    null,
  );
});
test("old tab checkpoints migrate into durable storage and survive a fresh tab session", () => {
  const previousWindow = globalThis.window;
  const localStorage = storage(),
    sessionStorage = storage();
  globalThis.window = { localStorage, sessionStorage };
  try {
    const old = { ...snapshot(ch6), version: ch6.version };
    sessionStorage.setItem(
      `${progressKey(ch6, "test-owner")}:${ch6.version}`,
      JSON.stringify(old),
    );
    assert.deepEqual(loadBrowserNovelProgress(ch6, "test-owner"), old);
    assert.ok(localStorage.getItem(progressKey(ch6, "test-owner")));
    assert.equal(sessionStorage.length, 0);
    globalThis.window = { localStorage, sessionStorage: storage() };
    assert.equal(loadBrowserNovelProgress(ch6, "test-owner").scenePath.at(-1), 14);
    assert.equal(loadBrowserNovelProgress(ch6, "test-owner").miniGameResults.game.score, 2);
  } finally {
    globalThis.window = previousWindow;
  }
});
test("restart clears only its chapter, including legacy checkpoints, and immediately saves a clean start", () => {
  const previousWindow = globalThis.window;
  const localStorage = storage(),
    sessionStorage = storage();
  globalThis.window = { localStorage, sessionStorage };
  try {
    saveBrowserNovelProgress(ch5, snapshot(ch5), "test-owner");
    saveBrowserNovelProgress(ch8, snapshot(ch8), "test-owner");
    sessionStorage.setItem(`${progressKey(ch5, "test-owner")}:old`, "old");
    localStorage.setItem(`${progressKey(ch5, "test-owner")}:older`, "older");
    clearBrowserNovelProgress(ch5, "test-owner");
    assert.equal(loadBrowserNovelProgress(ch5, "test-owner"), null);
    assert.equal(loadBrowserNovelProgress(ch8, "test-owner").scenePath.at(-1), 14);
    assert.equal(sessionStorage.length, 0);
    saveBrowserNovelProgress(ch5, initialNovelProgress(ch5), "test-owner");
    const initial = loadBrowserNovelProgress(ch5, "test-owner");
    assert.deepEqual(initial.scenePath, [0]);
    assert.deepEqual(initial.choiceLedger, {});
    assert.deepEqual(initial.miniGameResults, {});
    assert.deepEqual(initial.moneyEventsApplied, {});
    assert.deepEqual(initial.stats, ch5.initialStats);
    assert.equal(initial.money, ch5.initialMoney);
  } finally {
    globalThis.window = previousWindow;
  }
});
test("durable progress takes priority over older tab state; denied storage never crashes the game", () => {
  const previousWindow = globalThis.window;
  const localStorage = storage(),
    sessionStorage = storage();
  globalThis.window = { localStorage, sessionStorage };
  try {
    saveNovelProgress(localStorage, ch5, snapshot(ch5), "test-owner");
    saveNovelProgress(sessionStorage, ch5, initialNovelProgress(ch5), "test-owner");
    assert.equal(loadBrowserNovelProgress(ch5, "test-owner").scenePath.at(-1), 14);
    globalThis.window = {
      get localStorage() {
        throw Error("blocked");
      },
      sessionStorage,
    };
    saveBrowserNovelProgress(ch5, snapshot(ch5), "test-owner");
    assert.equal(loadBrowserNovelProgress(ch5, "test-owner").scenePath.at(-1), 14);
    globalThis.window = {
      get localStorage() {
        throw Error("blocked");
      },
      get sessionStorage() {
        throw Error("blocked");
      },
    };
    assert.equal(loadBrowserNovelProgress(ch5, "test-owner"), null);
    assert.doesNotThrow(() => saveBrowserNovelProgress(ch5, snapshot(ch5), "test-owner"));
    assert.doesNotThrow(() => clearBrowserNovelProgress(ch5, "test-owner"));
  } finally {
    globalThis.window = previousWindow;
  }
});
