// Browser acceptance, independent of authentication and remote services.
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer";
import { chapter6V2GameData as data } from "../../src/pages/Kid/Dashboard/data/chapter6V2VisualNovel";
import {
  loanOffers,
  loanTotal,
  sortTargets,
} from "../../src/pages/Kid/Dashboard/components/game/loanDetectiveRules.js";
import { progressKey } from "../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import "../../src/index.css";

const params = new URLSearchParams(location.search);
const route = params.get("route") || "goal";
const snapshot = params.get("snapshot");
const resultNode = document.getElementById("ch6-browser-result");
const root = createRoot(document.getElementById("root"));
const errors = [];
window.addEventListener("error", (e) => errors.push(e.message));
window.addEventListener("unhandledrejection", (e) =>
  errors.push(String(e.reason)),
);
const wait = () => new Promise((resolve) => setTimeout(resolve, 30));
const buttons = () => [...document.querySelectorAll("button")];
const find = (text) =>
  buttons().find(
    (b) =>
      (b.getAttribute("aria-label") === text ||
        (b.querySelector(".vn-choice-copy")?.textContent.trim() ||
          b.textContent.trim()) === text) &&
      !b.disabled,
  );
const click = (text) => {
  const b = find(text);
  if (!b) throw Error(`Button unavailable: ${text}`);
  b.click();
};
const mount = (key) =>
  root.render(
    <MemoryRouter>
      <VisualNovelPlayer key={key} data={data} />
    </MemoryRouter>,
  );
const reloadKey = "finteen:ch6-acceptance:resume";
const resumeCount =
  route === "resume" ? Number(sessionStorage.getItem(reloadKey) || 0) : 0;
if (!resumeCount) localStorage.removeItem(progressKey(data));
mount(0);

async function run() {
  const visited = new Set();
  const overflow = new Set();
  const reloads = resumeCount;
  let wrongTried = false,
    ending;
  const wrongGame = ["wrong", "retry"].includes(route);
  let referenceChecked = false;
  const backChecks = new Set();
  for (let tick = 0; tick < 750; tick++) {
    await wait();
    const player = document.querySelector(".vn-player");
    if (!player) continue;
    const scene = data.scenes.find((s) => s.id === player.dataset.sceneId);
    if (!scene) throw Error(`Unknown scene ${player.dataset.sceneId}`);
    visited.add(scene.id);
    if (
      document.querySelector(
        ".vn-stats-grid,.vn-stats-details,.vn-stat-card",
      ) ||
      buttons().some((b) => b.title === "Chỉ số")
    )
      throw Error("Internal stats are visible");
    if (
      route === "back" &&
      ["CH06_OPEN_2", "CH06_AFTER_OFFERS_1", "CH06_PLAN_WAIT_1"].includes(
        scene.id,
      ) &&
      !backChecks.has(scene.id)
    ) {
      await wait();
      const before = localStorage.getItem(progressKey(data));
      const saved = JSON.parse(before);
      const previousId = data.scenes[saved.scenePath.at(-2)].id;
      document.querySelector(".vn-menu>summary").click();
      click("Lùi lại một cảnh");
      await wait();
      if (document.querySelector(".vn-player").dataset.sceneId !== previousId)
        throw Error("Back did not show preceding visited scene");
      if (localStorage.getItem(progressKey(data)) !== before)
        throw Error("Back modified progress or scoring");
      if (
        previousId === "CH06_SC02" &&
        document.querySelector(".vn-choices button")
      )
        throw Error("Review reopens committed choices");
      if (
        previousId === "CH06_GAME_OFFERS" &&
        document.querySelector(".loan-game")
      )
        throw Error("Review replays a completed mini-game");
      const forward =
        find("Tiếp tục →") || document.querySelector(".vn-dialogue-next");
      if (!forward) throw Error("No forward action while reviewing");
      forward.click();
      await wait();
      if (document.querySelector(".vn-player").dataset.sceneId !== scene.id)
        throw Error("Review did not resume current scene");
      if (localStorage.getItem(progressKey(data)) !== before)
        throw Error("Review forward reapplies effects");
      backChecks.add(scene.id);
      continue;
    }

    if (snapshot === scene.id) {
      resultNode.textContent = "SNAPSHOT";
      return;
    }
    if (
      document.querySelector(".vn-wallet")?.getAttribute("aria-label") !==
      "Số dư 0 đồng"
    )
      throw Error("Planning changed Money");
    if (document.querySelector("vite-error-overlay"))
      throw Error("Vite overlay");
    for (const el of document.querySelectorAll(
      ".loan-game,.loan-steps,.loan-workbench,.loan-calendar,.loan-questions,.ch5-dialog,.vn-choice-panel",
    )) {
      if (el.scrollWidth > el.clientWidth + 2)
        overflow.add(`${scene.id}:${el.className}`);
    }
    if (find("Đã hiểu")) {
      click("Đã hiểu");
      continue;
    }
    if (route === "resume" && reloads === 0 && scene.id === "CH06_COMPARE_1") {
      await wait();
      const saved = JSON.parse(localStorage.getItem(progressKey(data)));
      if (data.scenes[saved.scenePath.at(-1)].id !== scene.id)
        throw Error("Story checkpoint missing");
      sessionStorage.setItem(reloadKey, String(reloads + 1));
      location.reload();
      return;
    }
    const dialog = document.querySelector(".ch5-dialog");
    if (dialog) {
      if (scene.id === "CH06_FINAL_DATA") {
        if (
          dialog.querySelectorAll(".loan-affordability-card").length !== 2 ||
          dialog.querySelector("nav")
        )
          throw Error("Affordability still hidden behind tabs");
        if (
          !dialog.textContent.includes("450.000") ||
          !dialog.textContent.includes("150.000")
        )
          throw Error("Missing take-home balances");
        if (snapshot === "affordability") {
          resultNode.textContent = "SNAPSHOT";
          return;
        }
      }
      if (
        ["offersInspect", "offersInspectC"].includes(snapshot) &&
        scene.id === "CH06_OFFERS"
      ) {
        dialog
          .querySelectorAll("nav button")
          [snapshot === "offersInspectC" ? 2 : 0].click();
        await wait();
        if (
          !dialog.querySelector(".inspect-shared") ||
          !dialog.querySelector(".inspect-facts")
        )
          throw Error("Missing shared context or concise product fields");
        resultNode.textContent = "SNAPSHOT";
        return;
      }
      const unread = [...dialog.querySelectorAll("nav button")].find(
        (b) => !b.textContent.includes("✓"),
      );
      if (unread) unread.click();
      else click("Đóng");
      continue;
    }
    if (scene.type === "ending") {
      ending = document.querySelector("#vn-ending-title")?.textContent;
      break;
    }
    if (scene.type === "minigame") {
      const round =
        Number(
          document
            .querySelector(".loan-game h3")
            ?.textContent.match(/Màn (\d)/)?.[1],
        ) - 1;
      if (snapshot === `round${round + 1}`) {
        resultNode.textContent = "SNAPSHOT";
        return;
      }
      if (document.querySelector(".loan-questions") || find("Kiểm tra"))
        throw Error("Old quiz remains");
      if (round === 0) {
        if (document.querySelector("[data-piece],.loan-stamps"))
          throw Error("Repetitive installment assembly remains");
        if (!referenceChecked) {
          const cards = document.querySelector(".loan-total-cards");
          if (
            cards.textContent.includes("lần ×") ||
            cards.textContent.includes("Nhận ")
          )
            throw Error("Card leaks calculation data");
          const input = document.querySelector("[data-total-input=A]");
          Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value",
          ).set.call(input, "672");
          input.dispatchEvent(new Event("input", { bubbles: true }));
          await wait();
          document.querySelector("[data-review-offers]").click();
          await wait();
          const reference = document.querySelector(".ch5-dialog");
          if (
            !reference ||
            reference.querySelector('button[aria-label="Đóng"]').disabled
          )
            throw Error("Reference cannot be closed freely");
          reference.querySelector('button[aria-label="Gói vay C"]').click();
          await wait();
          if (
            reference.textContent.includes("đã khấu trừ") ||
            reference.textContent.includes("Tổng trả")
          )
            throw Error("Reference reveals removed fields");
          reference.querySelector('button[aria-label="Đóng"]').click();
          await wait();
          if (document.querySelector("[data-total-input=A]").value !== "672")
            throw Error("Reference lost draft answer");
          referenceChecked = true;
        }
        for (const offer of loanOffers) {
          const input = document.querySelector(
            `[data-total-input=${offer.id}]`,
          );
          if (!input.disabled) {
            Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype,
              "value",
            ).set.call(
              input,
              String(
                wrongGame && offer.id === "C" ? 8600000 : loanTotal(offer),
              ),
            );
            input.dispatchEvent(new Event("input", { bubbles: true }));
            await wait();
          }
        }
        const compare = document.querySelector("[data-submit-totals]");
        if (!compare.disabled) {
          compare.click();
          await wait();
        }
      }
      if (round === 1) {
        if (
          [...document.querySelectorAll("[data-tray]")]
            .map((el) => el.dataset.tray)
            .join(",") !== "shortfall,over,fit"
        )
          throw Error("Trays match the card answer positions");
        const submit = document.querySelector("[data-submit-sort]");
        if (
          !submit.disabled ||
          !document.querySelector("[data-offer=A]").disabled
        ) {
          if (!wrongTried) {
            document.querySelector("[data-offer=A]").click();
            await wait();
            document.querySelector("[data-tray=fit]").click();
            await wait();
            const zone = document
              .querySelector("[data-tray=fit]")
              .closest(".loan-sort-zone");
            if (!zone.querySelector("[data-offer=A]"))
              throw Error("Wrong draft placement was rejected or not visible");
            if (document.querySelector(".loan-sort-pool [data-offer=A]"))
              throw Error("Placed card is duplicated in pool");
            const saved = JSON.parse(localStorage.getItem(progressKey(data)));
            if (saved.miniGameResults[scene.id].answers.sortA)
              throw Error("Sorting scored before submission");
            const transfer = new DataTransfer();
            zone
              .querySelector("[data-offer=A]")
              .dispatchEvent(
                new DragEvent("dragstart", {
                  bubbles: true,
                  dataTransfer: transfer,
                }),
              );
            await wait();
            document
              .querySelector("[data-tray=over]")
              .closest(".loan-sort-zone")
              .dispatchEvent(
                new DragEvent("drop", {
                  bubbles: true,
                  cancelable: true,
                  dataTransfer: transfer,
                }),
              );
            await wait();
            if (
              !document
                .querySelector("[data-tray=over]")
                .closest(".loan-sort-zone")
                .querySelector("[data-offer=A]")
            )
              throw Error("Dragging a placed card did not move it");
            wrongTried = true;
          }
          for (const id of ["A", "B", "C"]) {
            const card = document.querySelector(`[data-offer=${id}]`);
            card.click();
            await wait();
            document
              .querySelector(
                `[data-tray=${wrongGame && id === "A" ? "fit" : sortTargets[id]}]`,
              )
              .click();
            await wait();
          }
          if (snapshot === "sortDraft") {
            resultNode.textContent = "SNAPSHOT";
            return;
          }
          if (route === "resume" && reloads === 1) {
            const saved = JSON.parse(localStorage.getItem(progressKey(data)));
            if (
              !saved.miniGameResults[scene.id]?.ui.sorted.B ||
              saved.miniGameResults[scene.id].ui.submittedRounds[1]
            )
              throw Error("Draft sorting checkpoint missing");
            sessionStorage.setItem(reloadKey, String(reloads + 1));
            location.reload();
            return;
          }
          document.querySelector("[data-submit-sort]").click();
          await wait();
          if (document.querySelectorAll("[data-sort-explanation]").length !== 3)
            throw Error("Missing grading explanations");
          if (!document.querySelector("[data-offer=A]").disabled)
            throw Error("Submitted sorting can be changed");
          if (snapshot === "sortFeedback") {
            resultNode.textContent = "SNAPSHOT";
            return;
          }
        }
      }
      if (round === 2) {
        const products = [...document.querySelectorAll(".loan-product-image")];
        if (
          products.length !== 4 ||
          products.some(
            (image) =>
              !image.getAttribute("src").startsWith("/images/") ||
              (image.complete && !image.naturalWidth),
          )
        )
          throw Error("Cart does not reuse working chapter images");
        if (document.querySelector("[data-plan],.loan-plan-picker"))
          throw Error("Old plan comparison remains");
        if (
          !document.querySelector("[data-buy-cart]").disabled ||
          !document.querySelector("[data-item=headphones]").disabled
        ) {
          document.querySelector("[data-item=headphones]").click();
          await wait();
          document
            .querySelector(
              `[data-item=${wrongGame ? "decoration" : "notebook"}]`,
            )
            .click();
          await wait();
          if (snapshot === "cartDraft") {
            resultNode.textContent = "SNAPSHOT";
            return;
          }
          document.querySelector("[data-buy-cart]").click();
          await wait();
          if (!document.querySelector("[data-item=headphones]").disabled)
            throw Error("Checkout can be changed");
          const result = document.querySelector("[data-cart-result]");
          if (
            !result ||
            !result.textContent.includes(wrongGame ? "50.000" : "300.000")
          )
            throw Error("Cart consequences missing");
          if (snapshot === "cartResult") {
            resultNode.textContent = "SNAPSHOT";
            return;
          }
        }
      }
      if (round === 3) {
        if (document.querySelector("[data-payment-slider]"))
          throw Error("Old payment slider remains");
        const confirm = document.querySelector("[data-confirm-statement]");
        if (confirm) {
          document
            .querySelector(
              `[data-statement-choice=${wrongGame ? "minimum" : route === "fullPayment" ? "full" : "partial"}]`,
            )
            .click();
          await wait();
          if (snapshot === "statementChoice") {
            resultNode.textContent = "SNAPSHOT";
            return;
          }
          document.querySelector("[data-confirm-statement]").click();
          await wait();
          if (
            !document.querySelector("[data-living-event]") ||
            !document.querySelector("[data-statement-choice=partial]").disabled
          )
            throw Error(
              "Statement confirmation did not lock and reveal living event",
            );
        }
        if (route === "resume" && reloads === 2) {
          const saved = JSON.parse(localStorage.getItem(progressKey(data)));
          if (
            saved.miniGameResults[scene.id]?.ui.statementStep !== 1 ||
            saved.miniGameResults[scene.id]?.ui.statementChoice !== "partial"
          )
            throw Error("Statement checkpoint missing");
          sessionStorage.setItem(reloadKey, String(reloads + 1));
          location.reload();
          return;
        }
        const reveal = document.querySelector("[data-reveal-statement]");
        if (reveal) {
          reveal.click();
          await wait();
        }
        if (!document.querySelector("[data-debt-event]"))
          throw Error("Next-month debt event missing");
        if (snapshot === "statementResult") {
          resultNode.textContent = "SNAPSHOT";
          return;
        }
      }
      if (/điểm/iu.test(document.querySelector(".loan-game").textContent))
        throw Error("Mini-game exposes scoring");
      if (round === 0 && snapshot === "totalsResult") {
        resultNode.textContent = "SNAPSHOT";
        return;
      }
      const next = find(
        round === scene.game.rounds.at(-1)
          ? "Trở lại câu chuyện"
          : "Sang màn tiếp theo →",
      );
      if (next) next.click();
      continue;
    }
    if (scene.type === "activity") throw Error("Reflection screen remains");
    if (scene.inspect) {
      click(scene.inspect.buttonText);
      continue;
    }
    if (scene.type === "choice") {
      let id = scene.options[0].id;
      if (scene.id === "CH06_SC02")
        id =
          route === "conditional"
            ? "CH06_SC02_B"
            : ["repair", "recovery"].includes(route)
              ? "CH06_SC02_C"
              : "CH06_SC02_A";
      if (scene.id === "CH06_SC03" && ["repair", "recovery"].includes(route))
        id = "CH06_SC03_B";
      click(scene.options.find((o) => o.id === id).label);
      continue;
    }
    if (scene.type === "scene")
      document.querySelector(".vn-scene-next")?.click();
    else document.querySelector(".vn-dialogue")?.click();
  }
  const expected = ["repair", "recovery"].includes(route)
    ? "Recovery"
    : wrongGame || route === "fullPayment"
      ? "Balanced"
      : "Goal Achieved";
  if (!ending?.includes(expected))
    throw Error(
      `Ending ${ending}; expected ${expected}; last ${[...visited].at(-1)}`,
    );
  const report = document.querySelector(".vn-report")?.textContent;
  if (report?.includes("Phản tư sau trải nghiệm"))
    throw Error("Reflection score remains");
  if (!report?.includes("Thám tử khoản vay"))
    throw Error("Missing learning report");
  const saved = JSON.parse(localStorage.getItem(progressKey(data)));
  const expectedPlan = ["repair", "recovery"].includes(route)
    ? "C"
    : route === "conditional"
      ? "B"
      : "WAIT";
  if (!visited.has(`CH06_FINAL_${expectedPlan}_1`))
    throw Error("Final story did not retain the original laptop plan");
  if (
    visited.has("CH06_MINIMUM_REVIEW_1") !==
    ["repair", "recovery"].includes(route)
  )
    throw Error("Minimum-payment feedback contradicts the chosen answer");
  const expectedStats = ["repair", "recovery"].includes(route)
    ? { SAVING: 48, HAPPINESS: 53, RISK: 50, GOAL: 42 }
    : { SAVING: 50, HAPPINESS: 50, RISK: 20, GOAL: 56 };
  for (const [key, value] of Object.entries(expectedStats))
    if (saved.stats[key] !== value)
      throw Error(`Wrong ${key}: ${saved.stats[key]} != ${value}`);
  if (route === "resume" && reloads !== 3)
    throw Error("Resume coverage missing");
  if (route === "resume") sessionStorage.removeItem(reloadKey);
  if (
    wrongGame &&
    (saved.miniGameResults.CH06_GAME_OFFERS.score !== 4 ||
      saved.miniGameResults.CH06_GAME_OFFERS.firstPercent !== 67 ||
      saved.miniGameResults.CH06_GAME_REPAYMENT.score !== 2)
  )
    throw Error("Submitted wrong answers were not preserved in scores");
  if (
    wrongGame &&
    saved.miniGameResults.CH06_GAME_OFFERS.ui.totals.C !== "8600000"
  )
    throw Error("Wrong total was overwritten");
  if (
    visited.has("CH06_FINAL_PLAN") ||
    visited.has("CH06_REPAIR_PLAN") ||
    visited.has("CH06_REPAIR_REPAYMENT")
  )
    throw Error("Bad choices reopened a repair selection");
  if (route === "back" && backChecks.size !== 3)
    throw Error("Missing dialogue, choice or mini-game back coverage");
  if (/SAVING:|HAPPINESS:|RISK:|GOAL:/.test(report))
    throw Error("Internal stat deltas leak into report");
  if (errors.length || overflow.size)
    throw Error(JSON.stringify({ errors, overflow: [...overflow] }));
  resultNode.textContent = JSON.stringify({
    status: "PASS",
    route,
    width: innerWidth,
    ending,
    visited: visited.size,
    reloads,
    stats: saved.stats,
    errors,
    overflow: [],
  });
}
run()
  .catch((error) => {
    resultNode.textContent = JSON.stringify({
      status: "FAIL",
      route,
      message: error.message,
      errors,
    });
  })
  .finally(() => {
    if (window.parent !== window)
      window.parent.postMessage(
        { type: "ch6-review", result: resultNode.textContent },
        location.origin,
      );
  });
