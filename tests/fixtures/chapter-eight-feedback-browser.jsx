import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { FuturePlanMiniGame } from "../../src/pages/Kid/Dashboard/components/game/FuturePlanMiniGame.jsx";
import { VisualNovelPlayer } from "../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx";
import { chapter8V2GameData as chapter } from "./content/index.mjs";
import { normalizeChapter } from "../../src/pages/Kid/Dashboard/components/game/chapterShape.js";
import { chapterEightSettlement, createFutureState } from "../../src/pages/Kid/Dashboard/components/game/futurePlanRules.js";
import { initialNovelProgress, progressKey, saveNovelProgress } from "../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import "../../src/index.css";

const root = createRoot(document.getElementById("root"));
const output = document.getElementById("ch8-feedback-result");
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw Error(message); };
async function waitFor(check) {
  for (let i = 0; i < 100; i++) {
    if (check()) return;
    await pause(30);
  }
  throw Error("Timed out waiting for feedback UI");
}

async function claimsFeedback(overrides) {
  const game = structuredClone(chapter.scenes.find((s) => s.game?.config?.mode === "claims").game);
  const { claims } = game.config;
  if (overrides) claims.resultLabels = overrides;
  const useful = claims.checks.filter((c) => c.correct);
  const unnecessary = claims.checks.filter((c) => !c.correct);
  assert(claims.pickCount === 3 && useful.length === 3, "Expected three useful claims");
  const state = { ...createFutureState(game.config), checks: [useful[0].id, useful[1].id, unnecessary.at(-1).id] };
  let result;
  root.render(<FuturePlanMiniGame key={overrides ? "custom" : "default"} game={game} initialResult={{ ui: state }} onProgress={(value) => { result = value; }} onComplete={() => {}} />);
  await waitFor(() => document.querySelectorAll("[data-claim]").length === 6 && document.querySelector("[data-submit-checks]")?.disabled === false);
  for (const check of claims.checks) {
    const small = document.querySelector(`[data-claim="${check.id}"] small`);
    assert(small.textContent === (state.checks.includes(check.id) ? claims.selected : claims.select), "Labels revealed before submission");
  }
  document.querySelector("[data-submit-checks]").click();
  await waitFor(() => document.querySelectorAll("[data-claim][data-result]").length === 6);
  assert(document.querySelector(".future-game").textContent.includes("Bạn chọn đúng 2/3 thông tin nên xem."), "Useful information summary should be 2/3");
  const labels = overrides || {
    pickedRight: "Nên xem · Bạn đã chọn ✓",
    missed: "Nên xem · Bạn bỏ sót",
    skippedRight: "Không cần xem · Bạn bỏ qua ✓",
    pickedWrong: "Không cần xem · Bạn chọn thừa",
  };
  const covered = new Set();
  const backgrounds = new Map();
  const verdicts = { pickedRight: "Chọn đúng", missed: "Bỏ sót", skippedRight: "Bỏ qua đúng", pickedWrong: "Chọn thừa" };
  for (const check of claims.checks) {
    const picked = state.checks.includes(check.id);
    const key = check.correct ? picked ? "pickedRight" : "missed" : picked ? "pickedWrong" : "skippedRight";
    covered.add(key);
    const card = document.querySelector(`[data-claim="${check.id}"]`);
    assert(card.querySelector("small").firstChild.textContent === labels[key], `Incorrect ${key} label`);
    assert(card.dataset.result === (picked === check.correct ? "correct" : "incorrect"), "Result colors changed");
    assert(card.dataset.claimResult === key, "Claim result type missing");
    const badge = card.querySelector(".future-claim-verdict");
    assert(badge?.textContent === verdicts[key] && badge.querySelector("svg"), "Visible verdict label or icon missing");
    assert(parseFloat(getComputedStyle(badge).fontSize) >= 14, "Verdict label is too small");
    assert(parseFloat(getComputedStyle(card.querySelector("small")).fontSize) >= 13, "Feedback text is too small");
    assert(getComputedStyle(card).boxShadow === "none", "Selection ring overrides submitted feedback");
    backgrounds.set(key, getComputedStyle(card).backgroundColor);
    assert(card.disabled && card.getAttribute("aria-pressed") === String(picked), "Submitted selection changed");
  }
  assert(covered.size === 4, "All four feedback cases must be covered");
  assert(new Set(backgrounds.values()).size === 4, "Submitted result types need four distinct backgrounds");
  assert(backgrounds.get("pickedWrong") !== backgrounds.get("pickedRight"), "Incorrect selected card still looks correct");
  assert(result.score === 2 && result.total === 3 && result.completed && !result.passed, "Claims scoring changed");
  return { usefulSelected: result.score, usefulTotal: result.total, classificationsCorrect: document.querySelectorAll('[data-claim][data-result="correct"]').length, backgrounds: Object.fromEntries(backgrounds) };
}

async function settlementBadge() {
  const game = chapter.scenes.find((s) => s.game?.config?.mode === "portfolio").game;
  const { portfolio } = game.config;
  const data = normalizeChapter({
    ...chapter,
    id: "ch8-money-feedback-regression",
    releaseVersion: null,
    scenes: [
      { id: "SETTLE", type: "dialogue", title: "Sau khi bán hết", text: "Sau khi bán hết", marketSettlement: true, nextSceneId: "AFTER" },
      { id: "AFTER", type: "dialogue", title: "Đã quyết toán", text: "Đã quyết toán", nextSceneId: null },
      { id: "CONFIG", type: "minigame", game },
    ],
  });
  const owner = "ch8-feedback-test";
  const saved = initialNovelProgress(data);
  saved.flags[portfolio.settlement.fitFlag] = true;
  saved.miniGameResults[portfolio.settlement.resultFrom] = { ui: { market: { ...portfolio.market.legacy, bonds: -1, equity: 0 } } };
  const settlement = chapterEightSettlement(portfolio, saved.miniGameResults, saved.flags);
  assert(settlement.delta === -40000, "Expected the -40,000 settlement fixture");
  assert(saveNovelProgress(localStorage, data, saved, owner), "Checkpoint setup failed");
  root.render(<MemoryRouter><VisualNovelPlayer data={data} progressOwner={owner} /></MemoryRouter>);
  await waitFor(() => document.querySelector(".vn-player")?.dataset.sceneId === "SETTLE");
  document.querySelector(".vn-dialogue-next").click();
  await waitFor(() => document.querySelector(".vn-wallet-delta"));
  assert(document.querySelector(".vn-wallet-delta").textContent === "-40.000", "Settlement badge did not show -40,000");
  const after = JSON.parse(localStorage.getItem(progressKey(data, owner)));
  assert(after.money === saved.money - 40000, "Wallet settlement changed");
  await pause(1400);
  assert(!document.querySelector(".vn-wallet-delta"), "Settlement badge did not clear after 1.2 seconds");
  const final = JSON.parse(localStorage.getItem(progressKey(data, owner)));
  assert(final.money === after.money && Object.keys(final.moneyEventsApplied).length === 1, "Clearing the badge altered wallet or applied settlement twice");
  return { delta: settlement.delta, badgeCleared: true, money: final.money };
}

async function run() {
  const claims = await claimsFeedback();
  if (new URLSearchParams(location.search).get("preview") === "claims") {
    output.textContent = JSON.stringify({ status: "PASS", claims });
    return;
  }
  await claimsFeedback({ pickedRight: "CUSTOM PICKED", missed: "CUSTOM MISSED", skippedRight: "CUSTOM SKIPPED", pickedWrong: "CUSTOM EXTRA" });
  const money = await settlementBadge();
  output.textContent = JSON.stringify({ status: "PASS", claims, money });
}
run().catch((error) => { output.textContent = JSON.stringify({ status: "FAIL", error: String(error) }); });
