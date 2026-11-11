import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import "/src/index.css";
import { MINI_GAME_FRAMES } from "/src/pages/Kid/Dashboard/components/game/miniGameFrames.js";
import EditorPage from "/src/features/studio/EditorPage.jsx";
import { auth } from "/src/api/auth.api.js";
import { resolveContentImages } from "/src/lib/imageAssets.js";
import ch1 from "./content/CH01.json";
import ch2 from "./content/CH02.json";
import ch3 from "./content/CH03.json";

const root = createRoot(document.getElementById("root"));
const output = document.getElementById("minigame-texts-result");
const completed = [], errors = [], writes = [];
let mountId = 0, content;
window.addEventListener("error", event => errors.push(event.message));
window.addEventListener("unhandledrejection", event => errors.push(String(event.reason)));
const wait = (ms = 35) => new Promise(resolve => setTimeout(resolve, ms));
const assert = (ok, message) => { if (!ok) throw Error(message); };
const button = (text, scope = document) => [...scope.querySelectorAll("button")].find(item => item.textContent.trim() === text);
const click = async item => { assert(item && !item.disabled, "Missing/enabled button"); item.click(); await wait(); };
const gameOf = (chapter, kind) => structuredClone(resolveContentImages(chapter).scenes.find(scene => scene.game?.kind === kind).game);
async function mount(view) {
  root.render(<MemoryRouter key={++mountId} initialEntries={["/internal/editor/CH02"]}>{view}</MemoryRouter>);
  await wait(100);
}

async function checkNeedWant() {
  const game = gameOf(ch1, "NEED_WANT");
  game.texts = { heading: "TEST NEED", intro: "TEST INTRO", tip: "TEST TIP" };
  let result;
  const Component = MINI_GAME_FRAMES.NEED_WANT;
  await mount(<Component game={game} onComplete={value => { result = value; }} />);
  assert(document.body.textContent.includes("TEST NEED"), "Need/Want heading");
  for (const item of game.items) {
    const transfer = new DataTransfer();
    transfer.setData("text/plain", item.id);
    const target = document.querySelector(`.nw-${item.category}`);
    assert(target, "Need/Want target");
    target.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
    await wait();
  }
  await click(button("Kiểm tra"));
  await click([...document.querySelectorAll("button")].find(item => item.textContent.includes("Tiếp tục")));
  assert(result?.passed && result.score === game.items.length, "Need/Want score changed");
  completed.push("NEED_WANT: custom copy and full correct playthrough");
}

async function checkBudget() {
  const game = gameOf(ch2, "BUDGET_BUILDER");
  game.texts = { heading: "TEST BUDGET", boardTitle: "TEST BOARD", boardSafe: "TEST SAFE", passSummary: "TEST SUMMARY" };
  let result;
  const Component = MINI_GAME_FRAMES.BUDGET_BUILDER;
  await mount(<Component game={game} onComplete={value => { result = value; }} />);
  for (const [index, zone] of game.dropZones.entries()) {
    const amount = game.draggables.find(item => item.value === zone.expectedValue);
    await click([...document.querySelectorAll(".c2-amount")].find(item => !item.disabled && item.textContent.includes(amount.label)));
    await click(document.querySelectorAll(".c2-budget-grid > button")[index]);
  }
  await click(button("Kiểm tra"));
  assert(document.body.textContent.includes("TEST SAFE") && document.body.textContent.includes("TEST SUMMARY"), "Budget completion copy");
  await click(button("Tiếp tục →"));
  assert(result?.passed && result.score === game.dropZones.length, "Budget score changed");
  completed.push("BUDGET_BUILDER: JSON boardSafe/passSummary and full correct playthrough");
}

async function checkCareer() {
  const game = gameOf(ch3, "CAREER_MATCH");
  game.texts = { steps: ["TEST STEP 1", "TEST STEP 2"], name: "Bình", finish: "TEST FINISH" };
  let result;
  const Component = MINI_GAME_FRAMES.CAREER_MATCH;
  await mount(<Component game={game} onComplete={value => { result = value; }} />);
  for (const [index, job] of game.jobs.entries()) {
    await click(button(job.hours <= game.weeklyLimit ? "Vừa lịch" : "Quá giờ", document.querySelectorAll(".c3-job")[index]));
  }
  await click(button("Kiểm tra"));
  await click(button("Sang bước tính toán →"));
  for (const [index, question] of game.questions.entries()) {
    await click(button(question.options.find(item => item.id === question.correctId).label, document.querySelectorAll(".c3-question")[index]));
  }
  await click(button("TEST FINISH →"));
  assert(result?.passed && result.score === game.jobs.length + game.questions.length, "Career score changed");
  completed.push("CAREER_MATCH: JSON steps/name/finish and full correct playthrough");
}

async function checkSavings() {
  const game = gameOf(ch2, "SAVINGS_RACE");
  game.texts = { heading: "TEST RACE", goalLabel: "xe đạp", coinLabel: "TEST COIN", winText: "TEST WON {goal}", readyFeedback: "TEST READY {goal}" };
  game.coinImage = game.goalImage;
  game.basketImage = game.goalImage;
  game.expenseChance = 0;
  game.coinStep = game.targetAmount;
  game.coinMaxSteps = 1;
  game.durationSeconds = 15;
  let result;
  const Component = MINI_GAME_FRAMES.SAVINGS_RACE;
  await mount(<Component game={game} onComplete={value => { result = value; }} />);
  assert(document.querySelector(".catch-pig-art img").getAttribute("src") === game.basketImage, "Basket image");
  // Chrome's virtual-time timers do not advance native animation frames reliably.
  const nativeFrame = window.requestAnimationFrame;
  const nativeCancel = window.cancelAnimationFrame;
  let clock = performance.now();
  window.requestAnimationFrame = callback => setTimeout(() => callback(clock += 50), 16);
  window.cancelAnimationFrame = clearTimeout;
  await click(button("Bắt đầu"));
  for (let index = 0; index < 300 && !document.querySelector(".catch-victory"); index++) {
    const coin = document.querySelector(".catch-coin");
    if (coin) {
      assert(coin.querySelector("img").getAttribute("src") === game.coinImage, "Coin image");
      const box = coin.getBoundingClientRect();
      document.querySelector(".catch-stage").dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: box.left + box.width / 2 }));
    }
    await wait();
  }
  assert(document.body.textContent.includes("TEST WON xe đạp"), "Savings winText/goal or catch mechanics");
  assert(document.querySelector(".catch-feedback").textContent.includes("TEST COIN"), "Savings coinLabel");
  await click(document.querySelector(".catch-overlay button"));
  assert(result?.outcome === "success", "Savings outcome changed");
  await click(button("Chơi lại"));
  assert(document.querySelector(".catch-feedback").textContent.includes("TEST READY xe đạp"), "Savings reset feedback");
  window.requestAnimationFrame = nativeFrame;
  window.cancelAnimationFrame = nativeCancel;
  completed.push("SAVINGS_RACE: custom coin/basket/goal/win/reset and successful catch");
}

async function checkStudio() {
  auth.getSnapshot = () => ({ actor: { id: "preview-editor", roles: ["GAME_EDITOR"] }, loading: false });
  auth.accountRequest = async (path, options = {}) => {
    if (options.method && options.method !== "GET") { writes.push(path); throw Error("Unexpected API write"); }
    if (path.endsWith("/draft")) return { draft: { status: "DRAFT", revision: 1 }, content };
    if (path.endsWith("/voice")) return { missing: 0, failed: 0, pending: 0, items: [] };
    if (path.endsWith("/scene-schema")) return {};
    return [];
  };
  for (const [chapter, kind] of [[ch1, "NEED_WANT"], [ch2, "BUDGET_BUILDER"], [ch2, "SAVINGS_RACE"]]) {
    const original = resolveContentImages(chapter);
    const scene = structuredClone(original.scenes.find(item => item.game?.kind === kind));
    content = { ...original, scenes: [scene, { id: "END", type: "ending", title: "Done" }] };
    await mount(<div className="studio-workspace"><div className="studio-main"><EditorPage code="CH02" notify={message => errors.push(message)} /></div></div>);
    for (let i = 0; i < 50 && !button("JSON"); i++) await wait();
    await click(button("JSON"));
    const textarea = document.querySelector('[aria-label="JSON nội dung chương"]');
    const draft = JSON.parse(textarea.value);
    draft.scenes[0].game.texts = { ...draft.scenes[0].game.texts, heading: "TEST " + kind };
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(textarea, JSON.stringify(draft));
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    await wait();
    await click(button("Chơi thử từ cảnh này"));
    for (let i = 0; i < 50 && !document.querySelector('[role="dialog"] h2'); i++) await wait();
    assert(document.querySelector('[role="dialog"]').textContent.includes("TEST " + kind), "Studio preview ignored unsaved JSON: " + kind);
    assert(!JSON.stringify(content).includes("TEST " + kind), "Preview mutated original draft");
    await click(button("Đóng", document.querySelector('[role="dialog"]')));
  }
  assert(writes.length === 0, "Studio persisted/published the test draft");
  completed.push("STUDIO: unsaved JSON heading TEST visible in 3 real mini-game frames; zero writes");
}

async function run() {
  await checkNeedWant();
  await checkBudget();
  await checkCareer();
  await checkSavings();
  await checkStudio();
  assert(errors.length === 0, errors.join("; "));
  output.textContent = JSON.stringify({ status: "PASS", completed, writes, errors });
}
run().catch(error => { output.textContent = JSON.stringify({ status: "FAIL", message: error.message, completed, errors, writes }); });
