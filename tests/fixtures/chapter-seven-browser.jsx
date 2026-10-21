import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "../../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer";
import { chapter7V2GameData as data } from "../../src/pages/Kid/Dashboard/data/chapter7V2VisualNovel.js";
import { safetyMessages } from "../../src/pages/Kid/Dashboard/components/game/scamOrSafeRules.js";
import { progressKey } from "../../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import "../../src/index.css";

const params = new URLSearchParams(location.search),
  route = params.get("route") || "goal",
  snapshot = params.get("snapshot");
const node = document.getElementById("ch7-browser-result");
const errors = [],
  overflow = new Set(),
  reviewed = new Set(),
  visited = new Set();
const reloadKey = "finteen:ch7-acceptance:resume";
const reloads =
  route === "resume" ? Number(sessionStorage.getItem(reloadKey) || 0) : 0;
const wrong = route === "wrong";
const exposure = ["exposed", "allbad", "exposedBack"].includes(route);
const loan = ["balanced", "allbad"].includes(route),
  fee = ["fee", "allbad"].includes(route),
  pending = route === "pending";
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) =>
  errors.push(String(event.reason)),
);
if (!reloads) localStorage.removeItem(progressKey(data));
const wait = () => new Promise((resolve) => setTimeout(resolve, 35));
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
const root = createRoot(document.getElementById("root"));
root.render(
  <MemoryRouter>
    <VisualNovelPlayer data={data} />
  </MemoryRouter>,
);
function reload(next) {
  sessionStorage.setItem(reloadKey, String(next));
  location.reload();
}
async function run() {
  let ending,
    referenceChecked = false;
  for (let tick = 0; tick < 900; tick++) {
    await wait();
    const player = document.querySelector(".vn-player");
    if (!player) continue;
    const scene = data.scenes.find(
      (scene) => scene.id === player.dataset.sceneId,
    );
    if (!scene) throw Error("Unknown scene");
    visited.add(scene.id);
    if (
      document.querySelector(
        ".vn-stats-grid,.vn-stats-details,.vn-stat-card",
      ) ||
      [...document.querySelectorAll("button")].some(
        (button) => button.title === "Chỉ số",
      )
    )
      throw Error("Stats exposed");
    if (document.querySelector("vite-error-overlay"))
      throw Error("Vite overlay");
    for (const element of document.querySelectorAll(
      ".safety-game,.loan-workbench,.safety-documents,.safety-message,.safety-action-cards,.ch5-dialog,.phone-inspect-dialog,.phone-screen,.vn-choice-panel",
    ))
      if (element.scrollWidth > element.clientWidth + 2)
        overflow.add(`${scene.id}:${element.className}`);
    if (find("Đã hiểu")) {
      click("Đã hiểu");
      continue;
    }
    if (
      ["back", "exposedBack"].includes(route) &&
      [
        "CH07_AFTER_INSURANCE_1",
        "CH07_PAY_1",
        "CH07_VERIFY_1",
        "CH07_OFFICIAL_1",
        "CH07_EXPOSED_2",
      ].includes(scene.id) &&
      !reviewed.has(scene.id)
    ) {
      await wait();
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
    if (route === "resume" && reloads === 0 && scene.id === "CH07_TERMS_3") {
      reload(1);
      return;
    }
    if (route === "resume" && reloads === 1 && scene.id === "CH07_PAY_2") {
      const saved = JSON.parse(localStorage.getItem(progressKey(data)));
      if (
        saved.money !== 1200000 ||
        !saved.moneyEventsApplied.CH07_MEDICAL_PAYMENT
      )
        throw Error("Medical transaction checkpoint missing");
      reload(2);
      return;
    }
    if (snapshot === scene.id) {
      node.textContent = "SNAPSHOT";
      return;
    }
    const dialog = document.querySelector(".ch5-dialog,.phone-inspect-dialog");
    if (dialog) {
      if (dialog.classList.contains("phone-inspect-dialog")) {
        const close = dialog.querySelector('button[aria-label="Đóng"]');
        if (!close.disabled || !dialog.querySelector("[data-phone-message]"))
          throw Error("Phone must start on the received message");
        dialog.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
        await wait();
        if (!document.querySelector(".phone-inspect-dialog"))
          throw Error("Phone skipped unread contacts");
        if (snapshot === "phoneMessage") {
          node.textContent = "SNAPSHOT";
          return;
        }
        const sms = dialog.querySelector('[role="tab"][aria-label="Tin nhắn"]');
        const contacts = dialog.querySelector(
          '[role="tab"][aria-label="Thông tin liên lạc"]',
        );
        sms.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
        );
        await wait();
        if (
          dialog.querySelectorAll("[data-phone-contact]").length !== 3 ||
          close.disabled
        )
          throw Error("Phone contacts list incomplete");
        for (const name of [
          "Ứng dụng bảo hiểm",
          "Hỗ trợ bảo hiểm",
          "Bàn hỗ trợ của trường",
        ])
          if (!dialog.textContent.includes(name))
            throw Error(`Missing contact ${name}`);
        if (
          dialog.querySelector("input,textarea,a[href]") ||
          dialog.textContent.includes("Kênh An có từ trước")
        )
          throw Error("Phone contains old wording or live contact controls");
        if (snapshot === "phoneContacts") {
          node.textContent = "SNAPSHOT";
          return;
        }
        contacts.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
        );
        await wait();
        if (!dialog.querySelector("[data-phone-message]"))
          throw Error("Cannot return to message");
        close.focus();
        close.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
        );
        if (
          document.activeElement !== dialog.querySelector('[role="tabpanel"]')
        )
          throw Error("Phone focus escaped dialog");
        close.click();
        continue;
      }
      if (snapshot === "insuranceInspect" && scene.id === "CH07_INSURANCE") {
        dialog.querySelector("nav button").click();
        await wait();
        node.textContent = "SNAPSHOT";
        return;
      }
      const unread = [...dialog.querySelectorAll("nav button")].find(
        (button) => !button.textContent.includes("✓"),
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
      const host = document.querySelector(".safety-game");
      if (!host) throw Error("Chapter seven mini-game not mounted");
      if (
        host.querySelector("input,textarea,form,a") ||
        /(?:\d+\s*điểm|Điểm\s*:|ghi điểm)/iu.test(host.textContent)
      )
        throw Error("Mini-game asks for real data or exposes scores");
      const round =
        Number(host.querySelector("h3").textContent.match(/Màn (\d)/)?.[1]) - 1;
      if (snapshot === `round${round + 1}`) {
        node.textContent = "SNAPSHOT";
        return;
      }
      if (round === 0) {
        if (!referenceChecked) {
          document.querySelector("[data-safety-reference]").click();
          await wait();
          const reference = document.querySelector(".ch5-dialog");
          if (
            !reference ||
            reference.querySelector('button[aria-label="Đóng"]').disabled
          )
            throw Error("Insurance reference cannot close freely");
          reference.querySelector('button[aria-label="Đóng"]').click();
          await wait();
          referenceChecked = true;
        }
        if (
          !document.querySelector('[data-insurance-payment="300000"]').disabled
        ) {
          document
            .querySelector(
              `[data-insurance-payment="${wrong ? 100000 : 300000}"]`,
            )
            .click();
          await wait();
          for (const id of wrong
            ? ["otp"]
            : ["receipt", "medicalRecord", "claim"]) {
            document.querySelector(`[data-document=${id}]`).click();
            await wait();
          }
          if (snapshot === "insuranceDraft") {
            node.textContent = "SNAPSHOT";
            return;
          }
          document.querySelector("[data-submit-insurance]").click();
          await wait();
          if (
            !document.querySelector("[data-insurance-result]") ||
            !document.querySelector('[data-insurance-payment="300000"]')
              .disabled
          )
            throw Error("Insurance submission not frozen or explained");
          if (snapshot === "insuranceResult") {
            node.textContent = "SNAPSHOT";
            return;
          }
        }
      }
      if (round === 1) {
        if (!document.querySelector("[data-message-answer=check]").disabled) {
          for (const [index, message] of safetyMessages.entries()) {
            document.querySelector(`[data-message-index="${index}"]`).click();
            await wait();
            document
              .querySelector(
                `[data-message-answer=${wrong ? (message.answer === "check" ? "continue" : "check") : message.answer}]`,
              )
              .click();
            await wait();
            if (route === "resume" && reloads === 2 && index === 2) {
              const saved = JSON.parse(localStorage.getItem(progressKey(data)));
              if (
                Object.keys(saved.miniGameResults[scene.id].ui.messages)
                  .length !== 3
              )
                throw Error("Inbox drafts not saved");
              reload(3);
              return;
            }
          }
          if (document.querySelector("[data-message-result]"))
            throw Error("Inbox revealed results before submission");
          document.querySelector("[data-submit-messages]").click();
          await wait();
          const results = [
            ...document.querySelectorAll(
              ".safety-inbox-nav [data-message-result]",
            ),
          ];
          if (
            results.length !== 6 ||
            results.some(
              (button) =>
                button.dataset.messageResult !==
                (wrong ? "incorrect" : "correct"),
            )
          )
            throw Error("Inbox result badges missing or incorrect");
          document.querySelector('[data-message-index="0"]').click();
          await wait();
          if (!document.querySelector("[data-message-explanation]"))
            throw Error("Inbox explanations missing");
          if (snapshot === "inboxResult") {
            node.textContent = "SNAPSHOT";
            return;
          }
        }
      }
      if (round === 2) {
        const saved = JSON.parse(localStorage.getItem(progressKey(data)));
        const ui = saved.miniGameResults[scene.id]?.ui;
        if (!ui.submittedRounds[2]) {
          const sequence = wrong
            ? ["stop", "payFee", "reply", "save"]
            : route === "alternate"
              ? ["stop", "protect", "contact", "save"]
              : ["stop", "contact", "protect", "save"];
          for (const id of sequence) {
            if (!document.querySelector(`[data-response=${id}]`).disabled) {
              document.querySelector(`[data-response=${id}]`).click();
              await wait();
            }
            if (route === "resume" && reloads === 3 && id === "contact") {
              const saved = JSON.parse(localStorage.getItem(progressKey(data)));
              if (saved.miniGameResults[scene.id].ui.response.length !== 2)
                throw Error("Response draft not saved");
              reload(4);
              return;
            }
          }
          if (snapshot === "responseDraft") {
            node.textContent = "SNAPSHOT";
            return;
          }
          document.querySelector("[data-submit-response]").click();
          await wait();
          if (
            !document.querySelector("[data-response-result]") ||
            document.querySelector("[data-remove-response]")
          )
            throw Error("Response submission not frozen");
          if (snapshot === "responseResult") {
            node.textContent = "SNAPSHOT";
            return;
          }
        }
      }
      if (/(?:\d+\s*điểm|Điểm\s*:|ghi điểm)/iu.test(host.textContent))
        throw Error("Submitted mini-game exposes points");
      const next = find(
        round === scene.game.rounds.at(-1)
          ? "Trở lại câu chuyện"
          : "Sang màn tiếp theo →",
      );
      if (next) next.click();
      continue;
    }
    if (scene.type === "activity") throw Error("Reflection remains");
    if (scene.inspect) {
      click(scene.inspect.buttonText);
      continue;
    }
    if (scene.type === "choice") {
      const id =
        scene.id === "CH07_SC02"
          ? `CH07_SC02_${pending ? "C" : loan ? "B" : "A"}`
          : scene.id === "CH07_SC03"
            ? `CH07_SC03_${exposure ? "B" : "A"}`
            : `CH07_SC04_${fee ? "B" : "A"}`;
      click(scene.options.find((option) => option.id === id).label);
      continue;
    }
    if (scene.type === "scene")
      document.querySelector(".vn-scene-next")?.click();
    else document.querySelector(".vn-dialogue")?.click();
  }
  const expected =
    exposure || fee || pending
      ? "Recovery"
      : loan || wrong
        ? "Balanced"
        : "Goal Achieved";
  if (!ending?.includes(expected))
    throw Error(
      `Ending ${ending}; expected ${expected}; last ${[...visited].at(-1)}`,
    );
  const saved = JSON.parse(localStorage.getItem(progressKey(data)));
  const expectedMoney =
    1500000 -
    (!loan && !pending ? 300000 : 0) -
    (exposure ? 150000 : 0) -
    (fee ? 100000 : 0);
  if (saved.money !== expectedMoney)
    throw Error(`Money ${saved.money} != ${expectedMoney}`);
  const expectedStats = { ...data.initialStats };
  const selected = [
    `CH07_SC02_${pending ? "C" : loan ? "B" : "A"}`,
    `CH07_SC03_${exposure ? "B" : "A"}`,
    `CH07_SC04_${fee ? "B" : "A"}`,
  ];
  for (const id of selected) {
    const option = data.scenes
      .flatMap((scene) => scene.options || [])
      .find((option) => option.id === id);
    for (const [key, delta] of Object.entries(option.deltaStats))
      expectedStats[key] += delta;
  }
  for (const [key, value] of Object.entries(expectedStats))
    if (saved.stats[key] !== value)
      throw Error(`Stat ${key} replayed: ${saved.stats[key]} != ${value}`);
  if (Boolean(saved.flags.fraud_exposed) !== exposure)
    throw Error("Exposure was erased");
  if (exposure && !visited.has("CH07_EXPOSED_3") && route !== "resume")
    throw Error("Immediate protection guidance was skipped");
  if (
    Object.keys(saved.moneyEventsApplied).length !==
    (loan ? 2 : pending ? 0 : 1) + (exposure ? 1 : 0) + (fee ? 1 : 0)
  )
    throw Error("Financial events duplicated or missing");
  if (
    wrong &&
    (saved.miniGameResults.CH07_GAME_INSURANCE.score !== 0 ||
      saved.miniGameResults.CH07_GAME_SAFETY.score !== 2)
  )
    throw Error("Wrong submission score was rewritten");
  if (route === "resume" && reloads !== 4)
    throw Error("Reload coverage missing");
  if (route === "resume") sessionStorage.removeItem(reloadKey);
  if (["back", "exposedBack"].includes(route) && reviewed.size < 3)
    throw Error("Not enough review checks");
  if (
    document
      .querySelector(".vn-report")
      ?.textContent.includes("Phản tư sau trải nghiệm")
  )
    throw Error("Reflection report remains");
  if (document.querySelector(".vn-report")?.textContent.includes("(lần đầu"))
    throw Error("Report treats a locked single submission as a revised choice");
  if (errors.length || overflow.size)
    throw Error(JSON.stringify({ errors, overflow: [...overflow] }));
  node.textContent = JSON.stringify({
    status: "PASS",
    route,
    width: innerWidth,
    ending,
    money: saved.money,
    events: Object.keys(saved.moneyEventsApplied),
    reloads,
    visited: visited.size,
    errors,
    overflow: [],
  });
}
run()
  .catch((error) => {
    node.textContent = JSON.stringify({
      status: "FAIL",
      route,
      message: error.message,
      errors,
    });
  })
  .finally(() => {
    if (window.parent !== window)
      window.parent.postMessage(
        { type: "ch7-review", result: node.textContent },
        location.origin,
      );
  });
