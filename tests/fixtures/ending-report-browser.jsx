import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "/src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx";
import { initialNovelProgress, saveNovelProgress } from "/src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import { chapter1V2GameData, chapter2V2GameData, chapter3V2GameData, chapter4V2GameData, chapter5V2GameData, chapter6V2GameData, chapter7V2GameData, chapter8V2GameData } from "./content/index.mjs";
import "/src/index.css";

const root = createRoot(document.getElementById("root"));
const results = [], errors = [];
const wait = () => new Promise((resolve) => setTimeout(resolve, 50));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) => errors.push(String(event.reason)));
localStorage.setItem("finteen:voice-enabled", "false");
const originalFetch = window.fetch;
const reportCalls = [];
window.fetch = (url, ...args) => {
  if (/\/report(?:\?|$)|\/learner-model\/summary/.test(String(url))) {
    reportCalls.push(String(url));
    return Promise.reject(new Error("Adult report called from child recap"));
  }
  return originalFetch(url, ...args);
};

try {
  for (const data of [chapter3V2GameData, chapter4V2GameData, chapter5V2GameData, chapter6V2GameData, chapter7V2GameData, chapter8V2GameData]) {
    for (const section of ["achieved", "practice"]) {
      const line = data.endingReport[section][0];
      const snapshot = initialNovelProgress(data, data.scenes.findIndex((scene) => scene.type === "ending"));
      let needsPractice = false;
      for (const term of line.when.split("&&").map((value) => value.trim())) {
        const negated = term.startsWith("!");
        const name = negated ? term.slice(1) : term;
        if (name.startsWith("flags.")) snapshot.flags[name.slice(6)] = !negated;
        if (name === "miniGameNeedsPractice") needsPractice = !negated;
      }
      const gameTotals = { CH03_V2: [6], CH04_V2: [4], CH05_V2: [12], CH06_V2: [6, 4], CH07_V2: [2, 10], CH08_V2: [2, 3, 3] };
      const gameIds = data.endingReport.requiredGameIds || data.scenes.filter((scene) => scene.game).map((scene) => scene.game.id);
      snapshot.miniGameResults = Object.fromEntries(gameIds.map((gameId, index) => {
        const total = gameTotals[data.id]?.[index] || data.endingReport.miniGameMax;
        const gameScene = data.scenes.find((scene) => scene.game?.id === gameId);
        return [gameScene.id, { gameId, score: needsPractice ? 0 : total, firstScore: needsPractice ? 0 : total, total, completed: true, passed: !needsPractice }];
      }));
      snapshot.miniGameCompleted = true;
      const owner = "ending-report-test";
      saveNovelProgress(localStorage, data, snapshot, owner);
      root.render(<MemoryRouter key={`${data.id}-${section}`}><VisualNovelPlayer data={data} progressOwner={owner} /></MemoryRouter>);
      for (let tick = 0; tick < 120 && !document.querySelector(".vn-player")?.textContent.includes(line.text); tick++) await wait();
      const text = document.querySelector(".vn-player")?.textContent || "";
      assert(text.includes(line.text), `${data.id}.${section}: expected report line missing: ${line.when}`);
      assert(text.includes(section === "achieved" ? "Đã làm tốt:" : "Cần luyện thêm:"), `${data.id}.${section}: report label missing`);
      assert(document.querySelector(".vn-report-minigames")?.textContent.includes("câu đúng"), `${data.id}: mini-game recap missing`);
      assert(!/Điểm học chương|Quyết định trong truyện:|Phản tư sau trải nghiệm:|Dữ liệu mẫu|I\/C\/P/.test(text), `${data.id}: adult or mock score visible`);
      results.push({ chapter: data.id, section, when: line.when, visible: true });
    }
  }
  for (const data of [chapter1V2GameData, chapter2V2GameData]) {
    const snapshot = initialNovelProgress(data, data.scenes.findIndex((scene) => scene.type === "ending"));
    snapshot.money = 123456;
    const gameScene = data.scenes.find((s) => s.game && !s.game.id.includes("SAVINGS_RACE"));
    snapshot.miniGameResults = { [gameScene.id]: { gameId: gameScene.game.id, completed: true, score: 6, firstScore: 1, total: 6 } };
    const choice = data.scenes.find((s) => s.type === "choice" && s.options.length > 1);
    snapshot.choiceLedger = { [choice.choiceGroup || choice.id]: { optionId: choice.options[0].id, label: choice.options[0].label } };
    saveNovelProgress(localStorage, data, snapshot, "ending-report-test");
    root.render(<MemoryRouter key={data.id}><VisualNovelPlayer data={data} progressOwner="ending-report-test" /></MemoryRouter>);
    for (let tick = 0; tick < 120 && !document.querySelector(".vn-report")?.textContent.includes(choice.options[0].label); tick++) await wait();
    const text = document.querySelector(".vn-player")?.textContent || "";
    assert(text.includes("123.456") && text.includes("1/6 câu đúng"), `${data.id}: actual money / first submission missing`);
    assert(text.includes(choice.options[0].label), `${data.id}: selected choice missing`);
    assert(!/Điểm học chương|Phản tư sau trải nghiệm:|mẫu|Đang phát triển/i.test(document.querySelector(".vn-report").textContent), `${data.id}: mock or adult report remains`);
    assert(document.querySelector('.vn-ending-exit').getAttribute('href') === '/dashboard/kid/lessons', `${data.id}: map exit missing`);
    results.push({ chapter: data.id, actualRecap: true, firstScore: true });
  }
  assert(reportCalls.length === 0, "Child recap requested adult report / AI summary");
  assert(errors.length === 0, errors.join("; "));
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", results, error: error.message, errors });
}
