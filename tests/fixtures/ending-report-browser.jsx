import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { VisualNovelPlayer } from "/src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx";
import { initialNovelProgress, saveNovelProgress } from "/src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import { chapter3V2GameData, chapter4V2GameData, chapter5V2GameData, chapter6V2GameData, chapter7V2GameData, chapter8V2GameData } from "./content/index.mjs";
import "/src/index.css";

const root = createRoot(document.getElementById("root"));
const results = [], errors = [];
const wait = () => new Promise((resolve) => setTimeout(resolve, 50));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) => errors.push(String(event.reason)));
localStorage.setItem("finteen:voice-enabled", "false");

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
      const gameTotals = { CH04_V2: [4], CH05_V2: [12], CH06_V2: [6, 4], CH07_V2: [2, 10], CH08_V2: [2, 3, 3] };
      snapshot.miniGameResults = Object.fromEntries((data.endingReport.requiredGameIds || []).map((gameId, index) => {
        const total = gameTotals[data.id]?.[index] || data.endingReport.miniGameMax;
        return [gameId, { gameId, score: needsPractice ? 0 : total, total, completed: true, passed: !needsPractice }];
      }));
      snapshot.miniGameCompleted = true;
      const owner = "ending-report-test";
      saveNovelProgress(localStorage, data, snapshot, owner);
      root.render(<MemoryRouter key={`${data.id}-${section}`}><VisualNovelPlayer data={data} progressOwner={owner} /></MemoryRouter>);
      for (let tick = 0; tick < 120 && !document.querySelector(".vn-player")?.textContent.includes(line.text); tick++) await wait();
      const text = document.querySelector(".vn-player")?.textContent || "";
      assert(text.includes(line.text), `${data.id}.${section}: expected report line missing: ${line.when}`);
      assert(text.includes(section === "achieved" ? "Đã làm tốt:" : "Cần luyện thêm:"), `${data.id}.${section}: report label missing`);
      results.push({ chapter: data.id, section, when: line.when, visible: true });
    }
  }
  assert(errors.length === 0, errors.join("; "));
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", results, error: error.message, errors });
}
