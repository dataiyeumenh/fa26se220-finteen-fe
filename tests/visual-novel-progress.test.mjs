import test from "node:test";
import assert from "node:assert/strict";
import { chapter1V2GameData as ch1 } from "../src/pages/Kid/Dashboard/data/chapter1V2VisualNovel.js";
import { chapter2V2GameData as ch2 } from "../src/pages/Kid/Dashboard/data/chapter2V2VisualNovel.js";
import { chapter3V2GameData as ch3 } from "../src/pages/Kid/Dashboard/data/chapter3V2VisualNovel.js";
import { chapter4V2GameData as ch4 } from "../src/pages/Kid/Dashboard/data/chapter4V2VisualNovel.js";
import { chapter5V2GameData as ch5 } from "../src/pages/Kid/Dashboard/data/chapter5V2VisualNovel.js";
import { chapter6V2GameData as ch6 } from "../src/pages/Kid/Dashboard/data/chapter6V2VisualNovel.js";
import { chapter7V2GameData as ch7 } from "../src/pages/Kid/Dashboard/data/chapter7V2VisualNovel.js";
import { chapter8V2GameData as ch8 } from "../src/pages/Kid/Dashboard/data/chapter8V2VisualNovel.js";
import {
  progressKey,
  readNovelProgress,
  saveNovelProgress,
  loadBrowserNovelProgress,
  saveBrowserNovelProgress,
  clearBrowserNovelProgress,
  initialNovelProgress,
} from "../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";

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
    assert.equal(saveNovelProgress(memory, data, state), true);
    const restored = readNovelProgress(memory, data);
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
  saveNovelProgress(memory, ch5, state);
  const updated = {
    ...ch5,
    version: "next",
    scenes: [{ id: "new-intro" }, ...ch5.scenes],
  };
  const restored = readNovelProgress(memory, updated);
  assert.deepEqual(
    restored.scenePath,
    state.scenePath.map((index) => index + 1),
  );
  assert.equal(progressKey(updated), progressKey(ch5));
  assert.deepEqual(restored.choiceLedger, state.choiceLedger);
  assert.equal(
    readNovelProgress(memory, { ...ch5, scenes: ch5.scenes.slice(15) }),
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
      `${progressKey(ch6)}:${ch6.version}`,
      JSON.stringify(old),
    );
    assert.deepEqual(loadBrowserNovelProgress(ch6), old);
    assert.ok(localStorage.getItem(progressKey(ch6)));
    assert.equal(sessionStorage.length, 0);
    globalThis.window = { localStorage, sessionStorage: storage() };
    assert.equal(loadBrowserNovelProgress(ch6).scenePath.at(-1), 14);
    assert.equal(loadBrowserNovelProgress(ch6).miniGameResults.game.score, 2);
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
    saveBrowserNovelProgress(ch5, snapshot(ch5));
    saveBrowserNovelProgress(ch8, snapshot(ch8));
    sessionStorage.setItem(`${progressKey(ch5)}:old`, "old");
    localStorage.setItem(`${progressKey(ch5)}:older`, "older");
    clearBrowserNovelProgress(ch5);
    assert.equal(loadBrowserNovelProgress(ch5), null);
    assert.equal(loadBrowserNovelProgress(ch8).scenePath.at(-1), 14);
    assert.equal(sessionStorage.length, 0);
    saveBrowserNovelProgress(ch5, initialNovelProgress(ch5));
    const initial = loadBrowserNovelProgress(ch5);
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
    saveNovelProgress(localStorage, ch5, snapshot(ch5));
    saveNovelProgress(sessionStorage, ch5, initialNovelProgress(ch5));
    assert.equal(loadBrowserNovelProgress(ch5).scenePath.at(-1), 14);
    globalThis.window = {
      get localStorage() {
        throw Error("blocked");
      },
      sessionStorage,
    };
    saveBrowserNovelProgress(ch5, snapshot(ch5));
    assert.equal(loadBrowserNovelProgress(ch5).scenePath.at(-1), 14);
    globalThis.window = {
      get localStorage() {
        throw Error("blocked");
      },
      get sessionStorage() {
        throw Error("blocked");
      },
    };
    assert.equal(loadBrowserNovelProgress(ch5), null);
    assert.doesNotThrow(() => saveBrowserNovelProgress(ch5, snapshot(ch5)));
    assert.doesNotThrow(() => clearBrowserNovelProgress(ch5));
  } finally {
    globalThis.window = previousWindow;
  }
});
