// Browser harness: run via Vite, independent of account/network services.
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer";
import { chapter5V2GameData as data } from "../../src/pages/Kid/Dashboard/data/chapter5V2VisualNovel";
import { progressKey } from "../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import "../../src/index.css";

const timelineConfig = data.scenes.find(
  (scene) => scene.game?.kind === "COMPOUND_TIMELINE",
).game.config;
const challenges = timelineConfig.questions;

const resultNode = document.getElementById("ch5-browser-result");
const errors = [];
window.addEventListener("error", (e) => errors.push(e.message));
const route = new URLSearchParams(location.search).get("route") || "goal";
const snapshot = new URLSearchParams(location.search).get("snapshot");
const wait = () => new Promise((resolve) => setTimeout(resolve, 35));
const buttons = () => [...document.querySelectorAll("button")];
const clickText = (text) => {
  const button = buttons().find(
    (b) =>
      (b.getAttribute("aria-label") === text ||
        (b.querySelector(".vn-choice-copy")?.textContent.trim() ||
          b.textContent.trim()) === text) &&
      !b.disabled,
  );
  if (!button) throw new Error(`Missing button: ${text}`);
  button.click();
};
function setValue(input, value) {
  const proto =
    input.tagName === "SELECT"
      ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(
    input,
    String(value),
  );
  input.dispatchEvent(
    new Event(input.tagName === "SELECT" ? "change" : "input", {
      bubbles: true,
    }),
  );
}
const testData = {
  ...data,
  id: "CH05_BROWSER_TEST",
  metadata: { ...data.metadata, persistProgress: true },
};
localStorage.removeItem(progressKey(testData));
createRoot(document.getElementById("root")).render(
  <MemoryRouter>
    <VisualNovelPlayer data={testData} />
  </MemoryRouter>,
);
async function run() {
  let miniTriedWrong = false;
  let miniRetried = false;
  const overflow = [];
  let ending;
  for (let tick = 0; tick < 500; tick++) {
    await wait();
    const player = document.querySelector(".vn-player");
    if (!player) continue;
    if (
      document.querySelector(".vn-wallet")?.getAttribute("aria-label") !==
      "Số dư 1.000.000 đồng"
    )
      throw new Error("Money changed during a projection");
    if (document.querySelector("vite-error-overlay"))
      throw new Error("Vite overlay");
    const scene = data.scenes.find((s) => s.id === player.dataset.sceneId);
    for (const element of document.querySelectorAll(
      ".compound-game,.compound-stepper,.ch5-dialog,.ch5-reflection,.vn-choice-panel",
    )) {
      if (element.scrollWidth > element.clientWidth + 2)
        overflow.push(`${scene.id}:${element.className}`);
    }
    if (buttons().some((b) => b.textContent.trim() === "Đã hiểu")) {
      clickText("Đã hiểu");
      continue;
    }
    const dialog = document.querySelector(".ch5-dialog");
    if (dialog) {
      if (snapshot === "inspect") {
        dialog.querySelector("nav button").click();
        await wait();
        resultNode.textContent = "SNAPSHOT";
        return;
      }
      const unread = [...dialog.querySelectorAll("nav button")].find(
        (b) => !b.textContent.includes("✓"),
      );
      if (unread) unread.click();
      else clickText("Đóng");
      continue;
    }
    if (scene.type === "ending") {
      ending = document.querySelector("#vn-ending-title")?.textContent;
      break;
    }
    if (scene.type === "minigame") {
      const h3 = document.querySelector(".compound-game > h3")?.textContent;
      const round = Number(h3?.match(/Vòng (\d)/)?.[1]) - 1;
      if (snapshot === `round${round + 1}`) {
        resultNode.textContent = "SNAPSHOT";
        return;
      }
      if (round === 0) {
        for (const year of ["Năm 1", "Năm 2"]) {
          const b = buttons().find((b) => b.textContent.trim() === year);
          if (b) {
            b.click();
            await wait();
          }
        }
      }
      if (round === 3) {
        for (const text of [
          "Tài khoản A · Rút linh hoạt",
          "Tài khoản B · Kỳ hạn 12 tháng",
        ]) {
          const b = buttons().find(
            (b) =>
              b.getAttribute("aria-label") === text &&
              !b.textContent.includes("✓"),
          );
          if (b) {
            b.click();
            await wait();
          }
        }
      }
      if (route === "miniRetry" && round === 0 && !miniTriedWrong) {
        [...document.querySelectorAll(".compound-game label")]
          .find((label) => label.textContent.trim() === "Đúng")
          .querySelector("input")
          .click();
        await wait();
        clickText("Kiểm tra");
        miniTriedWrong = true;
        continue;
      }
      const next = buttons().find(
        (b) =>
          ["Tiếp tục", "Trở lại câu chuyện"].includes(b.textContent.trim()) &&
          !b.disabled,
      );
      if (route === "miniRetry" && round === 0 && next && !miniRetried) {
        const input = [...document.querySelectorAll(".compound-game label")]
          .find((label) => label.textContent.trim() === "Không")
          .querySelector("input");
        if (!input.matches(":disabled"))
          throw new Error("Submitted answer is editable");
        input.click();
        await wait();
        if (input.checked) throw new Error("Submitted answer was changed");
        miniRetried = true;
      }
      if (next) {
        next.click();
        continue;
      }
      for (const q of challenges.filter((q) => q.round === round)) {
        const field = [
          ...document.querySelectorAll(".compound-game fieldset"),
        ].find((f) => f.querySelector("legend")?.textContent === q.prompt);
        if (!field) throw new Error(`Missing challenge: ${q.id}`);
        if (q.options) {
          const label = [...field.querySelectorAll("label")].find(
            (l) => l.textContent.trim() === q.answer,
          );
          if (!label.querySelector("input").checked) {
            label.querySelector("input").click();
            await wait();
          }
        } else {
          const input = field.querySelector("input");
          if (input.value !== String(q.answer)) {
            setValue(input, q.answer);
            await wait();
          }
        }
      }
      const check = buttons().find(
        (b) => b.textContent.trim() === "Kiểm tra" && !b.disabled,
      );
      if (check) check.click();
      continue;
    }
    if (scene.type === "activity") {
      const reflection = document.querySelector(".ch5-reflection");
      if (scene.id === "CH05_R1") {
        for (const input of reflection.querySelectorAll("input")) {
          const keep = (
            route === "reflectionRetry"
              ? ["Màu biểu đồ"]
              : [
                  "Ngày cần tiền",
                  "Cách tính lãi rút sớm",
                  "Phí duy trì",
                  "Tên nhà cung cấp",
                  "Điều kiện bảo vệ",
                ]
          ).includes(input.parentElement.textContent.trim());
          if (input.checked !== keep) {
            input.click();
            await wait();
          }
        }
        setValue(
          reflection.querySelector("select"),
          route === "reflectionRetry" ? "guess" : "net",
        );
      } else {
        const selects = reflection.querySelectorAll("select");
        setValue(selects[0], route === "topup" ? "verified" : "keepB");
        await wait();
        setValue(selects[1], "month1");
      }
      await wait();
      clickText("Ghi nhận và tiếp tục");
      continue;
    }
    if (scene.inspect) {
      clickText(scene.inspect.buttonText);
      continue;
    }
    if (scene.type === "choice") {
      let id = scene.options[0].id;
      if (scene.id === "CH05_SC02" && route === "providerRecover")
        id = "CH05_AD_OPEN";
      if (scene.id === "CH05_AD_CHECK")
        id = route === "providerRecover" ? "CH05_SC02_B" : "CH05_AD_COMPARE";
      if (scene.id === "CH05_SC04")
        id = ["pending", "topup", "revise"].includes(route)
          ? "CH05_ACCOUNT_A"
          : "CH05_ACCOUNT_B";
      if (scene.id === "CH05_B_TIMING")
        id = route === "maturity" ? "CH05_B_MATURITY" : "CH05_SC04_A";
      if (scene.id === "CH05_PLAN_TOPUP")
        id =
          route === "pending"
            ? "CH05_TOPUP_PROMISE"
            : route === "revise"
              ? "CH05_SC04_C"
              : "CH05_TOPUP_OPEN";
      if (scene.id === "CH05_SC04_RECAP") {
        id = "CH05_CONTINUE";
      }
      clickText(scene.options.find((o) => o.id === id).label);
      continue;
    }
    if (scene.type === "scene")
      document.querySelector(".vn-scene-next")?.click();
    else document.querySelector(".vn-dialogue")?.click();
  }
  const expected = ["pending", "revise", "maturity"].includes(route)
    ? "Recovery"
    : ["providerRecover", "miniRetry", "reflectionRetry"].includes(route)
      ? "Balanced"
      : "Goal Achieved";
  if (!ending?.includes(expected))
    throw new Error(`Ending ${ending}; expected ${expected}`);
  const report = document.querySelector(".vn-report")?.textContent || "";
  if (!report.includes("Compound Timeline") || !report.includes("1.000.000"))
    throw new Error("Missing game label or wallet");
  const stored = JSON.parse(localStorage.getItem(progressKey(testData)));
  if (
    document.querySelector(".vn-stats-grid,.vn-stats-details,.vn-stat-card") ||
    /SAVING:|HAPPINESS:|RISK:|GOAL:/.test(report)
  )
    throw Error("Internal stats visible");
  const delta = (key) => stored.stats[key] - data.initialStats[key];
  if (["goal", "topup", "miniRetry", "reflectionRetry"].includes(route)) {
    if (delta("SAVING") !== 5 || delta("GOAL") !== 4 || delta("RISK") !== -1)
      throw Error("Incorrect internal stat reversal");
  }
  if (
    ["revise", "maturity"].includes(route) &&
    (delta("SAVING") !== 0 || delta("GOAL") !== -2)
  )
    throw Error("Mismatch choice changed unexpectedly");
  if (
    buttons().some((b) =>
      b.textContent.includes(
        "Xem l\u1ea1i v\u00e0 s\u1eeda k\u1ebf ho\u1ea1ch",
      ),
    )
  )
    throw new Error("Ending allows decision revision");
  const back = buttons().find(
    (b) =>
      b.title ===
      "L\u00f9i l\u1ea1i m\u1ed9t c\u1ea3nh \u0111\u00e3 \u0111i qua; gi\u1eef nguy\u00ean ti\u1ec1n v\u00e0 \u0111i\u1ec3m",
  );
  if (!back || back.disabled) throw new Error("Back navigation is disabled");
  if (route === "pending" && (delta("SAVING") !== 0 || delta("GOAL") !== 1))
    throw new Error("Pending plan received feasibility reward");
  if (
    route === "providerRecover" &&
    (delta("RISK") !== 0 || delta("GOAL") !== 3)
  )
    throw new Error("Provider recovery awarded retroactive stats");
  if (route === "miniRetry" && !report.includes("Compound Timeline: 92%"))
    throw new Error("Incorrect submitted answer was rescored");
  if (errors.length || overflow.length)
    throw new Error(
      JSON.stringify({ errors, overflow: [...new Set(overflow)] }),
    );
  resultNode.textContent = JSON.stringify({
    status: "PASS",
    route,
    width: innerWidth,
    ending,
    overflow: [],
    errors,
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
        { type: "ch5-review", result: resultNode.textContent },
        location.origin,
      );
  });
