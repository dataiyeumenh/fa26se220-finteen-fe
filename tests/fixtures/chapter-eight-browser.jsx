import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer";
import { chapter8V2GameData as data } from "../../src/pages/Kid/Dashboard/data/chapter8V2VisualNovel.js";
import {
  availableBudget,
  planMonths,
  createFutureState,
  chapterEightSettlement,
  validMarket,
  resolveFutureScene,
} from "../../src/pages/Kid/Dashboard/components/game/futurePlanRules.js";
import { progressKey } from "../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import "../../src/index.css";
const params = new URLSearchParams(location.search),
  route = params.get("route") || "goal",
  snapshot = params.get("snapshot");
const node = document.getElementById("ch8-browser-result"),
  key = progressKey(data);
const reloads =
  route === "resume" ? Number(sessionStorage.getItem("ch8:reloads") || 0) : 0;
if (!reloads) localStorage.removeItem(key);
const errors = [],
  overflow = new Set(),
  reviewed = new Set();
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) =>
  errors.push(String(event.reason)),
);
const wait = () => new Promise((resolve) => setTimeout(resolve, 40));
const saved = () => JSON.parse(localStorage.getItem(key) || "{}");
const find = (text) =>
  [...document.querySelectorAll("button")].find(
    (button) =>
      !button.disabled &&
      (button.getAttribute("aria-label") === text ||
        (button.querySelector(".vn-choice-copy")?.textContent.trim() ||
          button.textContent.trim()) === text),
  );
const click = (text) => {
  const button = find(text);
  if (!button) throw Error(`Missing button ${text}`);
  button.click();
};
const reload = (step) => {
  sessionStorage.setItem("ch8:reloads", String(step));
  location.reload();
};
const concentrated = ["concentrated", "allbad"].includes(route),
  fomo = ["fomo", "allbad"].includes(route),
  unverified = ["unverified", "allbad"].includes(route),
  wrong = route === "wrong";
createRoot(document.getElementById("root")).render(
  <MemoryRouter>
    <VisualNovelPlayer data={data} />
  </MemoryRouter>,
);
async function run() {
  let ending;
  for (let tick = 0; tick < 1000; tick++) {
    await wait();
    const player = document.querySelector(".vn-player");
    if (!player) continue;
    const scene = data.scenes.find(
      (scene) => scene.id === player.dataset.sceneId,
    );
    if (!scene) throw Error("Unknown scene");
    if (document.querySelector("vite-error-overlay"))
      throw Error("Vite overlay");
    if (
      document.querySelector(".vn-stats-grid,.vn-stats-details,.vn-stat-card")
    )
      throw Error("Stats exposed");
    for (const element of document.querySelectorAll(
      ".future-game,.future-baskets,.future-checks,.future-cashflow,.future-counter,.ch5-dialog,.vn-choice-panel",
    ))
      if (element.scrollWidth > element.clientWidth + 2)
        overflow.add(`${scene.id}:${element.className}`);
    if (find("Đã hiểu")) {
      click("Đã hiểu");
      continue;
    }
    if (
      scene.id === "CH08_PROMISE_1" &&
      !document
        .querySelector(".vn-dialogue")
        .textContent.includes(
          resolveFutureScene(scene, saved().miniGameResults, saved().flags)
            .text,
        )
    )
      throw Error("Dialogue does not match market outcome");
    if (snapshot === "settlement" && scene.marketSettlement) {
      node.textContent = "SNAPSHOT";
      return;
    }
    if (snapshot === scene.id) {
      node.textContent = "SNAPSHOT";
      return;
    }
    if (route === "resume" && reloads === 1 && scene.id === "CH08_PROMISE_1") {
      if (
        saved().money !==
        chapterEightSettlement(saved().miniGameResults, saved().flags).final
      )
        throw Error("Settlement before reload incorrect");
      reload(2);
      return;
    }
    if (
      route === "back" &&
      [
        "CH08_FIT_1",
        "CH08_PROMISE_1",
        "CH08_CHECKED_1",
        "CH08_FEASIBLE_1",
      ].includes(scene.id) &&
      !reviewed.has(scene.id)
    ) {
      document.querySelector(".vn-menu>summary").click();
      await wait();
      if (find("Lùi lại một cảnh"))
        throw Error("Removed back action is still visible");
      document.querySelector(".vn-menu>summary").click();
      await wait();
      if (document.querySelector(".vn-player").dataset.sceneId !== scene.id)
        throw Error("Menu changed the current scene");
      reviewed.add(scene.id);
      continue;
    }
    const dialog = document.querySelector(".ch5-dialog");
    if (dialog) {
      const unread = [...dialog.querySelectorAll("nav button")].find(
        (button) => !button.textContent.includes("✓"),
      );
      if (unread) {
        unread.click();
        await wait();
      } else {
        if (
          (snapshot === "assets" && scene.id === "CH08_ASSETS") ||
          (snapshot === "settlement" && scene.id.startsWith("CH08_SETTLE"))
        ) {
          node.textContent = "SNAPSHOT";
          return;
        }
        if (
          scene.id === "CH08_PLAN_CARDS" &&
          (!dialog.textContent.includes("Bạn dành cho học tập") ||
            dialog.querySelectorAll("nav button").length !== 3)
        )
          throw Error(
            "Restored plan inspect is missing actual submitted values",
          );
        if (snapshot === "planReview" && scene.id === "CH08_PLAN_CARDS") {
          node.textContent = "SNAPSHOT";
          return;
        }
        click("Đóng");
      }
      continue;
    }
    if (scene.type === "ending") {
      ending = document.querySelector("#vn-ending-title")?.textContent;
      break;
    }
    if (scene.type === "minigame") {
      const host = document.querySelector(".future-game");
      if (!host) throw Error("Future game missing");
      if (
        host.querySelector("input,textarea,form,a") ||
        /\d+\s*điểm|điểm\s*:/iu.test(
          host.textContent.replace(/100 điểm|10 điểm|1 điểm|0 điểm|điểm/gu, ""),
        )
      )
        throw Error("Real data input or score exposed");
      const state =
        saved().miniGameResults?.[scene.id]?.ui ||
        createFutureState(scene.game.kind);
      if (scene.game.kind === "portfolio") {
        if (!host.querySelector("[data-allocation-results]")) {
          const current = state?.allocation || { cash: 0, bonds: 0, equity: 0 };
          const target = wrong
            ? { cash: 0, bonds: 0, equity: 100 }
            : { cash: 30, bonds: 40, equity: 30 };
          for (const [id, label] of [
            ["cash", "Tiền dễ rút"],
            ["bonds", "Trái phiếu"],
            ["equity", "Cổ phiếu"],
          ]) {
            for (let amount = current[id]; amount < target[id]; amount += 10) {
              click(`Tăng ${label}`);
              await wait();
              if (route === "resume" && reloads === 0 && id === "cash") {
                sessionStorage.setItem(
                  "ch8:market",
                  JSON.stringify(saved().miniGameResults[scene.id].ui.market),
                );
                reload(1);
                return;
              }
            }
          }
          if (
            saved().money !== 10000000 ||
            Object.keys(saved().miniGameResults[scene.id].ui.history).length
          )
            throw Error("Allocation draft altered wallet or grading");
          if (snapshot === "allocationDraft") {
            node.textContent = "SNAPSHOT";
            return;
          }
          host.querySelector("[data-submit-allocation]").click();
          await wait();
          if (
            !host.querySelector("[data-allocation-results]") ||
            saved().money !== 10000000
          )
            throw Error("Portfolio preview transacted");
          const market = saved().miniGameResults[scene.id].ui.market;
          if (!validMarket(market))
            throw Error("Market exceeded the permitted range");
          const previous = sessionStorage.getItem("ch8:market");
          if (previous && previous !== JSON.stringify(market))
            throw Error("Market rerolled on reload");
          sessionStorage.setItem("ch8:market", JSON.stringify(market));
          if (snapshot === "allocationResult") {
            node.textContent = "SNAPSHOT";
            return;
          }
        }
      } else if (scene.game.kind === "claims") {
        if (!state?.checksSubmitted) {
          for (const id of wrong || route === "claimsWrong"
            ? ["ranking", "likes", "recent"]
            : ["risk", "commission", "esg"]) {
            host.querySelector(`[data-claim=${id}]`).click();
            await wait();
          }
          if (host.querySelector("[data-claim][data-result]"))
            throw Error("Ad answer revealed before submit");
          if (snapshot === "claimDraft") {
            node.textContent = "SNAPSHOT";
            return;
          }
          host.querySelector("[data-submit-checks]").click();
          await wait();
          if (host.querySelectorAll("[data-claim][data-result]").length !== 6)
            throw Error("Ad answers not marked");
          if (snapshot === "claimResult") {
            node.textContent = "SNAPSHOT";
            return;
          }
        }
      } else {
        const month = state.month;
        if (!state.submittedMonths[month]) {
          if (snapshot === `month${month + 1}Empty`) {
            node.textContent = "SNAPSHOT";
            return;
          }
          const target = wrong
            ? { goal: 0, flexible: availableBudget(planMonths[month]) }
            : route === "split" && month === 1
              ? { goal: 400000, flexible: 200000 }
              : route === "pause" && month === 2
                ? { goal: 0, flexible: 400000 }
                : route === "alternate" && month === 2
                  ? { goal: 200000, flexible: 100000 }
                  : {
                      goal: month === 2 ? 400000 : 600000,
                      flexible: month === 0 ? 400000 : 0,
                    };
          const current = state.budgets[month];
          for (const [id, label] of [
            ["goal", "Tiền để dành"],
            ["flexible", "Chi linh hoạt"],
          ])
            for (
              let amount = current[id];
              amount !== target[id];
              amount += amount > target[id] ? -100000 : 100000
            ) {
              click(`${amount > target[id] ? "Giảm" : "Tăng"} ${label}`);
              await wait();
            }
          if (route === "split" && month === 0) {
            click("Tăng Chi linh hoạt");
            await wait();
            let budget = saved().miniGameResults[scene.id].ui.budgets[0];
            if (budget.goal !== 500000 || budget.flexible !== 500000)
              throw Error(
                "Increasing flexible expenses did not transfer from savings",
              );
            click("Tăng Tiền để dành");
            await wait();
            budget = saved().miniGameResults[scene.id].ui.budgets[0];
            if (budget.goal !== 600000 || budget.flexible !== 400000)
              throw Error(
                "Increasing savings did not transfer from flexible expenses",
              );
          }
          if (route === "resume" && reloads === 2 && month === 2) {
            reload(3);
            return;
          }
          if (snapshot === `month${month + 1}Draft`) {
            node.textContent = "SNAPSHOT";
            return;
          }
          host.querySelector("[data-submit-month]").click();
          await wait();
          if (!host.querySelector("[data-month-result]"))
            throw Error("Month feedback missing");
          if (
            route === "split" &&
            month === 1 &&
            !host
              .querySelector("[data-month-result]")
              .textContent.includes("400.000đ + 200.000đ = 600.000đ")
          )
            throw Error("Feedback does not describe submitted split");
          if (snapshot === `month${month + 1}Result`) {
            node.textContent = "SNAPSHOT";
            return;
          }
          if (snapshot === "year" && month === 2) {
            host
              .querySelector("[data-year-plan]")
              .scrollIntoView({ block: "start" });
            await wait();
            node.textContent = "SNAPSHOT";
            return;
          }
          continue;
        }
        if (month < 2) {
          host.querySelector("[data-next-month]").click();
          continue;
        }
      }
      const finish = host.querySelector("[data-future-finish]");
      if (finish.disabled) throw Error("Finished game blocked");
      finish.click();
      continue;
    }
    if (scene.inspect) {
      click(scene.inspect.buttonText);
      continue;
    }
    if (scene.type === "choice") {
      const letter =
        scene.id === "CH08_SC02"
          ? concentrated
            ? "B"
            : "A"
          : scene.id === "CH08_SC03"
            ? fomo
              ? "B"
              : "A"
            : unverified
              ? "B"
              : "A";
      click(
        scene.options.find((option) => option.id === `${scene.id}_${letter}`)
          .label,
      );
      continue;
    }
    if (scene.type === "scene")
      document.querySelector(".vn-scene-next")?.click();
    else document.querySelector(".vn-dialogue")?.click();
  }
  const checkpoint = saved();
  const expected =
    concentrated || fomo || unverified || wrong
      ? "Ending C: Recovery"
      : route === "claimsWrong"
        ? "Ending B: Balanced"
        : "Ending A: Goal Achieved";
  if (ending !== expected) throw Error(`Expected ${expected}; got ${ending}`);
  if (
    checkpoint.money !==
      chapterEightSettlement(checkpoint.miniGameResults, checkpoint.flags)
        .final ||
    Object.keys(checkpoint.moneyEventsApplied).length !== 1
  )
    throw Error("Settlement duplicated or forecast transacted");
  if (route === "back" && reviewed.size !== 4)
    throw Error("Review not covered");
  if (errors.length || overflow.size)
    throw Error(JSON.stringify({ errors, overflow: [...overflow] }));
  node.textContent = JSON.stringify({
    status: "PASS",
    route,
    width: innerWidth,
    ending,
    money: checkpoint.money,
    market: checkpoint.miniGameResults.CH08_GAME_PORTFOLIO.ui.market,
    reloads,
    errors,
    overflow: [],
  });
}
run().catch((error) => {
  node.textContent = JSON.stringify({
    status: "FAIL",
    route,
    error: String(error),
    scene: document.querySelector(".vn-player")?.dataset.sceneId,
  });
});
new MutationObserver(
  () =>
    parent !== window &&
    parent.postMessage(
      { type: "ch8-review", result: node.textContent },
      location.origin,
    ),
).observe(node, { childList: true });
