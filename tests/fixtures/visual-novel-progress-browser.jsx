import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer";
import { chapter5V2GameData as data } from "./content/index.mjs";
import { chapter8V2GameData as other } from "./content/index.mjs";
import {
  clearBrowserNovelProgress,
  initialNovelProgress,
  progressKey,
  saveNovelProgress,
} from "../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import { timelineResult } from "../../src/pages/Kid/Dashboard/components/game/compoundTimelineRules.js";
import "../../src/index.css";

const timelineConfig = data.scenes.find(
  (scene) => scene.game?.kind === "COMPOUND_TIMELINE",
).game.config;
const challenges = timelineConfig.questions;

const root = createRoot(document.getElementById("root")),
  output = document.getElementById("progress-result");
const markerKey = "finteen:test:persistence",
  errors = [];
const wait = () => new Promise((resolve) => setTimeout(resolve, 50));
const assert = (condition, message) => {
  if (!condition) throw Error(message);
};
const saved = () => JSON.parse(localStorage.getItem(progressKey(data)));
const sceneId = () => document.querySelector(".vn-player")?.dataset.sceneId;
const find = (text) =>
  [...document.querySelectorAll("button")].find(
    (button) =>
      !button.disabled &&
      (button.getAttribute("aria-label") === text ||
        button.textContent.trim().startsWith(text)),
  );
const click = (text) => {
  const button = find(text);
  assert(button, `Missing ${text}`);
  button.click();
};
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) =>
  errors.push(String(event.reason)),
);
const originalError = console.error;
console.error = (...args) => {
  errors.push(args.map(String).join(" "));
  originalError(...args);
};
let mountId = 0;
async function mount() {
  root.render(
    <MemoryRouter key={++mountId}>
      <VisualNovelPlayer data={data} />
    </MemoryRouter>,
  );
  for (let tick = 0; tick < 60 && !sceneId(); tick++) await wait();
  await wait();
}
async function leave() {
  root.render(<div>Đã về danh sách chương</div>);
  await wait();
}
function reload(marker) {
  localStorage.setItem(markerKey, JSON.stringify(marker));
  location.reload();
}
function checkDraft() {
  const state = saved(),
    game = data.scenes.find(
      (scene) => scene.game?.id === "COMPOUND_TIMELINE_CH05",
    );
  assert(sceneId() === game.id, "Did not restore the mini-game scene");
  assert(
    document
      .querySelector(".compound-game > h3")
      ?.textContent.includes("Vòng 2"),
    "Mini-game returned to round 1",
  );
  assert(
    state.miniGameResults[game.id].answers.growth.finalCorrect === false,
    "Wrong submitted answer was lost",
  );
  const field = [...document.querySelectorAll(".compound-game fieldset")].find(
    (item) => item.textContent.includes("Bảng X"),
  );
  assert(field?.querySelector("input:checked"), "Draft answer was lost");
  assert(
    state.miniGameResults[game.id].score === 0,
    "Reload changed the recorded score",
  );
  return state;
}
async function run() {
  const marker = JSON.parse(localStorage.getItem(markerKey) || "null");
  if (!marker) {
    clearBrowserNovelProgress(data);
    saveNovelProgress(localStorage, other, {
      ...initialNovelProgress(other),
      scenePath: [0, 1, 2],
      money: 9870000,
    });
    await mount();
    for (let tick = 0; tick < 150 && saved().scenePath.length < 15; tick++) {
      const scene = data.scenes.find((item) => item.id === sceneId());
      const dialog = document.querySelector(".ch5-dialog");
      if (dialog) {
        const unread = [...dialog.querySelectorAll("nav button")].find(
          (button) => !button.textContent.includes("✓"),
        );
        if (unread) unread.click();
        else click("Đóng");
      } else if (scene.inspect) click(scene.inspect.buttonText);
      else if (scene.type === "scene")
        document.querySelector(".vn-scene-next")?.click();
      else document.querySelector(".vn-dialogue")?.click();
      await wait();
    }
    assert(
      saved().scenePath.length === 15,
      "Did not reach the fifteenth scene",
    );
    reload({ phase: "reload-scene", expected: saved(), sceneId: sceneId() });
    return;
  }
  await mount();
  if (marker.phase === "reload-scene") {
    assert(sceneId() === marker.sceneId, "F5 changed the current scene");
    assert(
      JSON.stringify(saved()) === JSON.stringify(marker.expected),
      "F5 changed recorded progress",
    );
    await leave();
    await mount();
    assert(
      sceneId() === marker.sceneId,
      "Returning from the chapter list changed the scene",
    );
    const checkpoint = saved();
    await leave();
    const gameIndex = data.scenes.findIndex(
        (scene) => scene.game?.id === "COMPOUND_TIMELINE_CH05",
      ),
      game = data.scenes[gameIndex];
    const history = {
      growth: {
        answer: "Đúng",
        firstAttemptCorrect: false,
        finalCorrect: false,
        attemptCount: 1,
        inspectedItems: [],
      },
    };
    saveNovelProgress(localStorage, data, {
      ...checkpoint,
      scenePath: [...checkpoint.scenePath, gameIndex],
      miniGameResults: {
        [game.id]: {
          ...timelineResult(timelineConfig, history),
          gameId: game.game.id,
          completed: false,
          ui: {
            round: 1,
            year: 2,
            visited: [1, 2],
            answers: {
              growth: "Đúng",
              simple: challenges.find((q) => q.id === "simple").answer,
            },
            inspected: [],
          },
        },
      },
    });
    await mount();
    checkDraft();
    reload({ phase: "reload-draft", sceneCheck: marker.sceneId });
    return;
  }
  if (marker.phase === "reload-draft") {
    checkDraft();
    assert(
      !document.querySelector(".vn-menu")?.textContent.includes("Lùi lại"),
      "Back-scene action remains in menu",
    );
    localStorage.setItem(
      markerKey,
      JSON.stringify({ phase: "reopen-ready", sceneCheck: marker.sceneCheck }),
    );
    assert(errors.length === 0, errors.join("; "));
    output.textContent = JSON.stringify({
      status: "PASS",
      phase: "ready-to-close-browser",
      scene15: marker.sceneCheck,
      draftRound: 2,
      errors,
    });
    return;
  }
  if (marker.phase === "reopen-ready") {
    checkDraft();
    assert(
      document.querySelector(".vn-menu") &&
        !document.querySelector(".vn-menu").textContent.includes("Lùi lại"),
      "Removed menu action visible",
    );
    const before = saved();
    document.querySelector(".vn-menu > summary").click();
    document.querySelector(".vn-restart-confirm > summary").click();
    await wait();
    assert(
      JSON.stringify(saved()) === JSON.stringify(before),
      "Opening restart confirmation reset progress",
    );
    click("Bắt đầu lại chương");
    await wait();
    assert(
      sceneId() === data.scenes[0].id,
      "Restart did not return to first scene",
    );
    assert(
      saved().money === data.initialMoney &&
        Object.keys(saved().miniGameResults).length === 0,
      "Restart retained old results",
    );
    reload({ phase: "reload-reset", sceneCheck: marker.sceneCheck });
    return;
  }
  assert(marker.phase === "reload-reset", "Unknown test phase");
  assert(
    sceneId() === data.scenes[0].id,
    "Reload resurrected pre-restart progress",
  );
  assert(
    Object.keys(saved().choiceLedger).length === 0 &&
      saved().scenePath.length === 1,
    "Old choices or history restored after restart",
  );
  const otherProgress = JSON.parse(localStorage.getItem(progressKey(other)));
  assert(
    otherProgress.money === 9870000 && otherProgress.scenePath.at(-1) === 2,
    "Restart reset another chapter",
  );
  assert(errors.length === 0, errors.join("; "));
  output.textContent = JSON.stringify({
    status: "PASS",
    phase: "complete",
    scene15: marker.sceneCheck,
    f5: true,
    leaveAndReturn: true,
    browserReopen: true,
    miniGameRoundAndDraft: true,
    restartOnlyOnConfirm: true,
    otherChapterPreserved: true,
    backActionRemoved: true,
    errors,
  });
}
run().catch((error) => {
  output.textContent = JSON.stringify({
    status: "FAIL",
    error: String(error),
    scene: sceneId(),
    errors,
  });
});
