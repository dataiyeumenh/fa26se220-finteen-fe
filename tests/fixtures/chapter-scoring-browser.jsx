import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer";
import { SmartShoppingMiniGame } from "../../src/pages/Kid/Dashboard/components/game/SmartShoppingMiniGame";
import { chapter4V2GameData as ch4 } from "../../src/pages/Kid/Dashboard/data/chapter4V2VisualNovel.js";
import { chapter5V2GameData as ch5 } from "../../src/pages/Kid/Dashboard/data/chapter5V2VisualNovel.js";
import { chapter6V2GameData as ch6 } from "../../src/pages/Kid/Dashboard/data/chapter6V2VisualNovel.js";
import { chapter7V2GameData as ch7 } from "../../src/pages/Kid/Dashboard/data/chapter7V2VisualNovel.js";
import { chapter8V2GameData as ch8 } from "../../src/pages/Kid/Dashboard/data/chapter8V2VisualNovel.js";
import { saveNovelProgress } from "../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import "../../src/index.css";

const root = createRoot(document.getElementById("root")),
  output = document.getElementById("scoring-result");
const wait = () => new Promise((resolve) => setTimeout(resolve, 60));
const errors = [],
  checks = [];
const originalConsoleError = console.error;
console.error = (...args) => {
  errors.push(args.map(String).join(" "));
  originalConsoleError(...args);
};
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) =>
  errors.push(String(event.reason)),
);
const assert = (condition, message) => {
  if (!condition) throw Error(message);
};
const flags = {
  purchase_fit: true,
  receipt_resolved: true,
  budget_adjusted: true,
  provider_checked: true,
  account_fit: true,
  credit_plan_fit: true,
  fallback_verified: true,
  repayment_understood: true,
  incident_resolved: true,
  fraud_contained: true,
  recovery_done: true,
  portfolio_fit: true,
  claims_checked: true,
  life_plan_feasible: true,
};
async function run() {
  for (const data of [ch4, ch5, ch6, ch7, ch8]) {
    const games = data.scenes.filter((scene) => scene.type === "minigame");
    const totals =
      data === ch4
        ? [4]
        : data === ch5
          ? [12]
          : data === ch6
            ? [6, 4]
            : data === ch7
              ? [2, 10]
              : [2, 3, 3];
    for (const requested of [0, 0.5, 0.75, 1, "missing"]) {
      let remaining =
        requested === "missing"
          ? data.endingReport.miniGameMax
          : Math.ceil(data.endingReport.miniGameMax * requested);
      const results = Object.fromEntries(
        games.map((scene, index) => {
          const score = Math.min(totals[index], remaining);
          remaining -= score;
          return [
            scene.id,
            {
              gameId: scene.game.id,
              score,
              total: totals[index],
              completed: true,
              passed: false,
            },
          ];
        }),
      );
      if (requested === "missing") delete results[games.at(-1).id];
      const ledger = Object.fromEntries(
        Object.entries(
          data.endingReport.choiceGroupMaxima || { CH04_TEST: 12 },
        ).map(([id, maximum]) => [
          id,
          {
            evidenceScores: { I: maximum },
            firstEvidenceScores: { I: maximum },
          },
        ]),
      );
      ledger.CH05_R1 = { reflectionScore: 6 };
      ledger.CH05_R2 = { reflectionScore: 6 };
      for (const [id, entry] of Object.entries(ledger)) {
        entry.sceneTitle = id;
        entry.label = "Submitted";
      }
      const snapshot = {
        scenePath: [data.scenes.findIndex((scene) => scene.type === "ending")],
        money: data.initialMoney,
        stats: { ...data.initialStats, SAVING: 50, RISK: 30 },
        flags,
        choiceLedger: ledger,
        firstChoiceScores: {},
        inspectedIds: {},
        moneyEventsApplied: {},
        budgetAllocations: {},
        miniGameResults: results,
        miniGameDoneByScene: {},
        sceneActionApplied: {},
        committedDecisions: [],
        miniGameCompleted: true,
      };
      // Enable checkpoint loading only in this harness to open each chapter at its ending.
      const fixtureData = {
        ...data,
        metadata: { ...data.metadata, persistProgress: true },
      };
      saveNovelProgress(localStorage, fixtureData, snapshot);
      root.render(
        <MemoryRouter key={`${data.id}-${requested}`}>
          <VisualNovelPlayer data={fixtureData} />
        </MemoryRouter>,
      );
      await wait();
      for (
        let tick = 0;
        tick < 30 &&
        !document.querySelector(
          `[data-scene-id="${data.scenes[snapshot.scenePath[0]].id}"] #vn-ending-title`,
        );
        tick++
      )
        await wait();
      const expected =
        requested === "missing"
          ? "Balanced"
          : requested < 0.5
            ? "Recovery"
            : requested >= 0.75
              ? "Goal Achieved"
              : "Balanced";
      const actual = document.querySelector("#vn-ending-title")?.textContent;
      assert(
        actual?.includes(expected),
        `${data.id} ${requested}: ${actual}, expected ${expected}`,
      );
      checks.push({ chapter: data.id, requested, ending: actual });
    }
  }
  // Actual shopping interactions: a practice purchase and remount cannot replace the first score.
  const game = ch4.scenes.find(
    (scene) => scene.game?.id === "SMART_SHOPPING_CH04",
  ).game;
  let progress, completed;
  const mount = (key, initialResult) =>
    root.render(
      <SmartShoppingMiniGame
        key={key}
        game={game}
        initialResult={initialResult}
        onProgress={(result) => {
          progress = result;
        }}
        onComplete={(result) => {
          completed = result;
        }}
      />,
    );
  const click = (text) => {
    const button = [...document.querySelectorAll("button")].find(
      (item) => item.textContent.trim() === text && !item.disabled,
    );
    assert(button, `Missing ${text}`);
    button.click();
  };
  mount("shopping-first");
  await wait();
  click("Chọn máy A");
  await wait();
  click("Chốt máy A");
  await wait();
  click("Thanh toán & xem một năm sau");
  await wait();
  assert(progress?.score === 1, `Unexpected first score: ${progress?.score}`);
  mount("shopping-reload", JSON.parse(JSON.stringify(progress)));
  await wait();
  assert(
    document.querySelector(".mission-results"),
    "First submission not restored",
  );
  click("Thử phương án khác");
  await wait();
  click("Chọn máy B");
  await wait();
  click("Chốt máy B");
  await wait();
  click("Thanh toán & xem một năm sau");
  await wait();
  assert(
    progress.ui.report.score === 2 && progress.score === 1,
    "Practice overwrote the first score",
  );
  click("Trở lại câu chuyện");
  await wait();
  assert(
    completed?.score === 1 &&
      completed.criteria.filter((item) => item.passed).length === 1,
    "Final score differs from submitted criteria",
  );
  assert(
    !document.body.textContent.includes("1/4"),
    "Numeric score still displayed",
  );
  assert(errors.length === 0, errors.join("; "));
  output.textContent = JSON.stringify({
    status: "PASS",
    checks,
    shopping: {
      first: completed.score,
      practice: progress.ui.report.score,
      restored: true,
    },
    errors,
  });
}
run().catch((error) => {
  output.textContent = JSON.stringify({
    status: "FAIL",
    error: String(error),
    checks,
    errors,
  });
});
