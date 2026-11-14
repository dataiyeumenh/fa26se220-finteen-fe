import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom";
import "/src/index.css";
import ParentPersonalization from "/src/pages/Parent/Learners/components/ParentPersonalization.jsx";
import { PersonalizationGate } from "/src/pages/Kid/Dashboard/components/PersonalizationGate.jsx";
import { SlotPersonalization } from "/src/features/personalization/SlotPersonalization.jsx";
import { personalizationApi } from "/src/api/personalization.api.js";
import { KidPersonalizationEditor } from "/src/pages/Kid/Dashboard/KidPersonalization.jsx";
import KidGames from "/src/pages/Kid/Dashboard/KidGames.jsx";
import { auth } from "/src/api/auth.api.js";
import chapter2 from "./content/CH02.json";
import WorkspaceLayout from "/src/features/workspace/WorkspaceLayout.jsx";

const childApi = { get: personalizationApi.getForChild, save: personalizationApi.saveForChild };

const root = createRoot(document.getElementById("root"));
const results = [], errors = [];
let mountId = 0;
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) => errors.push(String(event.reason)));
const wait = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw Error(message); };
const equal = (actual, expected, message) => assert(JSON.stringify(actual) === JSON.stringify(expected), `${message}: ${JSON.stringify(actual)}`);
const button = (label) => [...document.querySelectorAll("button")].find((item) => item.textContent.trim() === label);
const click = async (item) => { assert(item && !item.disabled, "Expected enabled button"); item.click(); await wait(); };
const view = (status, extra = {}) => ({ status, catalog: { gender: ["MALE", "FEMALE"], age: ["8_10"], interest: ["ART", "EXTRA_INTEREST"] }, askChild: [], askInGame: [], parent: null, ...extra });
async function mount(element, path = "/") {
  root.render(<MemoryRouter key={++mountId} initialEntries={[path]}>{element}</MemoryRouter>);
  await wait(120);
}
let navigateChapter;
export function GameHarness() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => { navigateChapter = navigate; }, [navigate]);
  return pathname.endsWith("/personalization") ? <KidPersonalizationEditor /> : <KidGames />;
}
async function until(condition, message) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (condition()) return;
    await wait();
  }
  throw Error(message);
}

try {
  const slot = { id: "child", displayName: "Bé thử", status: "ACTIVE" };
  let saved, finished = 0;
  personalizationApi.getForParent = async () => view("NOT_STARTED");
  personalizationApi.saveForParent = async (id, body) => { equal(id, "child", "Parent slot"); saved = body; return view("WAITING_CHILD"); };
  await mount(<ParentPersonalization slot={slot} onSaved={() => { finished++; }} onClose={() => {}} />);
  assert(button("EXTRA_INTEREST"), "New catalog value missing");
  assert(!button("Thể thao"), "Hardcoded choice outside catalog");
  assert([...document.querySelectorAll("button")].filter((item) => item.textContent === "Không biết, để bé chọn").length === 3, "Missing unknown option per dimension");
  await click(button("Nữ"));
  await click(button("Lưu cá nhân hoá"));
  equal(saved, { gender: "FEMALE", age: null, interest: null }, "Parent null payload");
  assert(finished === 1, "Parent save callback");
  results.push("Parent catalog buttons, unknown per dimension, FEMALE and explicit null payload");

  const parent = { gender: null, age: "8_10", interest: "TRIP" };
  personalizationApi.getForParent = async () => view("COMPLETED", {
    parent, labels: { gender: "MALE", age: "8_10", interest: "TRIP" },
  });
  await mount(<ParentPersonalization slot={slot} onSaved={() => {}} onClose={() => {}} />);
  equal([...document.querySelectorAll('[aria-label="Bé đang nhận nội dung"] dl > div')].map((item) => [item.querySelector("dt").textContent, item.querySelector("dd").textContent]), [["Giới tính", "Nam"], ["Tuổi", "8–10 tuổi"], ["Sở thích", "Đi chơi"]], "Resolved labels summary missing");
  assert(button("Nam").getAttribute("aria-pressed") === "false", "Child label overwrote parent gender");
  const genderGroup = button("Nam").closest("fieldset");
  assert([...genderGroup.querySelectorAll("button")].find((item) => item.textContent === "Không biết, để bé chọn").getAttribute("aria-pressed") === "true", "Parent unknown answer lost");
  await click(button("Lưu cá nhân hoá"));
  equal(saved, parent, "Saving again must preserve parent answers independently of labels");

  personalizationApi.getForParent = async () => view("WAITING_GAME", {
    parent, labels: { age: "8_10", interest: "TRIP" },
  });
  await mount(<ParentPersonalization slot={slot} onSaved={() => {}} onClose={() => {}} />);
  equal([...document.querySelectorAll('[aria-label="Bé đang nhận nội dung"] dd')].map((item) => item.textContent), ["Bản gốc", "8–10 tuổi", "Đi chơi"], "Missing label must use base, not a previous answer");
  assert(document.body.textContent.includes("Chờ bé chọn trong game"), "Conflict status missing");
  results.push("Read-only final labels are separate from parent answers; missing labels show base content");

  const writes = [];
  personalizationApi.getForChild = async () => view("WAITING_CHILD", { askChild: ["age"] });
  personalizationApi.saveForChild = async (source, answers) => {
    writes.push({ source, answers });
    return source === "CHILD" ? view("WAITING_GAME", { askInGame: ["gender", "interest", "age"] }) : view("SKIPPED");
  };
  let done = 0;
  await mount(<PersonalizationGate onDone={() => { done++; }} />);
  assert(button("8–10 tuổi") && !button("Nữ"), "Child ignores askChild");
  await click(button("Bỏ qua"));
  equal(writes[0], { source: "CHILD", answers: {} }, "Child skip must PUT");
  assert(button("Nữ") && button("🎨 Hộp màu"), "GAME choices");
  assert(!button("8–10 tuổi"), "GAME must not ask age");
  await click(button("Bỏ qua"));
  equal(writes[1], { source: "GAME", answers: {} }, "Game skip must PUT");
  assert(done === 1, "Skipped did not finish");
  results.push("WAITING_CHILD → CHILD skip → WAITING_GAME → GAME skip → SKIPPED; no age in GAME");

  for (const status of ["NOT_STARTED", "WAITING_GAME"]) {
    const source = status === "NOT_STARTED" ? "CHILD" : "GAME";
    personalizationApi.getForChild = async () => view(status, { askChild: ["gender"], askInGame: ["interest"] });
    personalizationApi.saveForChild = async (actualSource, answers) => {
      equal(actualSource, source, "Answer source");
      equal(answers, source === "CHILD" ? { gender: "FEMALE" } : { interest: "ART" }, "Selected answers");
      return view("COMPLETED");
    };
    done = 0;
    await mount(<PersonalizationGate onDone={() => { done++; }} />);
    await click(button(source === "CHILD" ? "Nữ" : "🎨 Hộp màu"));
    await click(button(source === "CHILD" ? "Tiếp tục" : "Mang theo hành trình!"));
    assert(done === 1, "Completed did not finish");
  }
  results.push("NOT_STARTED selection uses CHILD; WAITING_GAME selection uses GAME");

  for (const status of ["COMPLETED", "SKIPPED"]) {
    personalizationApi.getForChild = async () => view(status, { askChild: ["gender"], askInGame: ["interest"] });
    done = 0;
    await mount(<PersonalizationGate onDone={() => { done++; }} />);
    assert(done === 1 && !button("Bỏ qua"), `${status} asked again`);
  }
  results.push("COMPLETED and SKIPPED never show questions, even with stale question arrays");

  let requestCount = 0;
  personalizationApi.getForChild = async () => {
    if (++requestCount === 1) throw Error("Test network error");
    return view("WAITING_CHILD", { askChild: ["gender"] });
  };
  done = 0;
  await mount(<PersonalizationGate onDone={() => { done++; }} />);
  assert(done === 0 && document.querySelector('[role="alert"]'), "GET failure silently bypassed gate");
  await click(button("Thử lại"));
  personalizationApi.saveForChild = async () => { throw Error("Test save error"); };
  await click(button("Bỏ qua"));
  assert(done === 0 && button("Bỏ qua") && document.body.textContent.includes("Test save error"), "PUT failure advanced flow");
  results.push("GET retry and PUT errors keep gate pending");

  personalizationApi.getForParent = async () => view("WAITING_GAME");
  await mount(<SlotPersonalization slot={slot} context="CLASS" />);
  assert(document.body.textContent.includes("Chờ bé chọn trong game"), "Teacher missing status");
  assert(!button("Cá nhân hoá cho bé") && !document.querySelector("form"), "Teacher can edit");
  await mount(<SlotPersonalization slot={slot} context="FAMILY" />);
  assert(button("Cá nhân hoá cho bé"), "Family editor missing");
  await click(button("Cá nhân hoá cho bé"));
  assert(document.querySelector('[role="dialog"] form'), "Family dialog missing");
  assert(errors.length === 0, errors.join("; "));
  results.push("Teacher status only; FAMILY opens personalization dialog");

  let editorWrites = 0;
  personalizationApi.getForChild = async () => view("SKIPPED", { labels: { gender: "FEMALE" } });
  personalizationApi.saveForChild = async (source, answers) => {
    editorWrites++;
    equal(source, "CHILD", "Editor source");
    equal(answers, { gender: "MALE", age: "8_10", interest: "ART" }, "Editor selected answers");
    return view("COMPLETED", { labels: answers });
  };
  await mount(<KidPersonalizationEditor />);
  assert(document.querySelector('[aria-label="Nội dung em đang nhận"]').textContent.includes("Nữ"), "Editor missing current labels");
  await click(button("Thay đổi câu trả lời"));
  assert(button("Nữ").getAttribute("aria-pressed") === "false", "Final labels must not be copied into child answers");
  await click(button("Nam"));
  await click(button("Hủy"));
  assert(editorWrites === 0, "Cancel sent a write");
  await click(button("Thay đổi câu trả lời"));
  for (const label of ["Nam", "8–10 tuổi", "Vẽ / sáng tạo"]) await click(button(label));
  await click(button("Lưu câu trả lời"));
  assert(editorWrites === 1 && document.body.textContent.includes("Đã lưu!"), "Previously skipped child cannot edit answers");
  results.push("Child can edit after SKIPPED; cancel does not write; labels are not mistaken for child answers");

  personalizationApi.getForChild = async () => view("COMPLETED");
  personalizationApi.saveForChild = async () => { throw Error("Editor save failure"); };
  await mount(<KidPersonalizationEditor />);
  await click(button("Thay đổi câu trả lời"));
  await click(button("Nam"));
  await click(button("Lưu câu trả lời"));
  assert(document.body.textContent.includes("Editor save failure") && button("Nam").getAttribute("aria-pressed") === "true", "Editor loses selection on failed save");
  results.push("Editor keeps selected answers and allows retry after save failure");

  const originalFetch = window.fetch;
  const chapterRequests = [], personalizationWrites = [];
  let serverView = view("WAITING_CHILD", { askChild: ["gender"] });
  let variant = "base", gateRequests = 0;
  personalizationApi.getForChild = childApi.get;
  personalizationApi.saveForChild = childApi.save;
  window.fetch = async (url, init = {}) => {
    const path = new URL(url, location.origin).pathname;
    let result;
    if (path.endsWith("/api/slots/login")) result = { accessToken: "test-slot", expiresIn: 3600, slot: { id: "personalization-test", displayName: "Bé test", groupContext: "CLASS" } };
    else if (path.endsWith("/api/learner/dashboard")) result = { learner: { displayName: "Bé test" }, progress: { completedChapters: 1, totalChapters: 8, continueChapter: 2 } };
    else if (path.endsWith("/api/content/current")) result = { version: "test-release", chapters: [] };
    else if (path.endsWith("/api/play/personalization")) {
      if (init.method === "PUT") {
        const { source, answers } = JSON.parse(init.body);
        personalizationWrites.push({ source, answers });
        variant = answers.gender ? `gender:${answers.gender}` : "base";
        serverView = personalizationWrites.length === 2
          ? view("WAITING_GAME", { askInGame: ["gender"] })
          : view("COMPLETED", { labels: answers });
      } else gateRequests++;
      result = serverView;
    }
    else if (path.includes("/api/play/releases/test-release/chapters/")) {
      const code = path.split("/").at(-1);
      chapterRequests.push({ code, variant });
      result = { ...structuredClone(chapter2), id: `${code}_TEST`, releaseVersion: "test-release", variantKey: variant };
    } else throw Error(`Unexpected API request in browser test: ${path}`);
    return new Response(JSON.stringify({ code: 0, result }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    localStorage.setItem("finteen:voice-enabled", "false");
    await auth.slotLogin("PERSONALIZATION-TEST", "000000");
    await mount(<GameHarness />, "/dashboard/kid/play?chapter=2");
    await until(() => button("Nữ"), "CH02 gate did not open");
    assert(chapterRequests.length === 0 && !document.querySelector(".vn-player"), "CH02 loaded before personalization finished");
    await click(button("Nữ"));
    await click(button("Tiếp tục"));
    await until(() => document.querySelector(".vn-player"), "CH02 player did not load after gate");
    const activePlayer = document.querySelector(".vn-player");
    const firstSceneId = activePlayer.dataset.sceneId;
    for (let attempt = 0; attempt < 4 && activePlayer.dataset.sceneId === firstSceneId; attempt++) {
      await click([...document.querySelectorAll(".vn-player button")].find((item) => item.textContent.includes("Tiếp tục")));
    }
    assert(activePlayer.dataset.sceneId !== firstSceneId, "Test did not advance beyond the first scene");
    const sceneId = activePlayer.dataset.sceneId;
    equal(chapterRequests, [{ code: "CH02", variant: "gender:FEMALE" }], "Initial chapter content");
    assert(!button("Cá nhân hoá của em"), "Personalization shortcut must only appear in the profile menu");
    // A saved edit from another context must not mutate the mounted chapter.
    await personalizationApi.saveForChild("CHILD", { gender: "MALE" });
    await personalizationApi.saveForChild("GAME", { gender: "MALE" });
    assert(document.querySelector(".vn-player") === activePlayer && activePlayer.dataset.sceneId === sceneId, "Saved preferences changed the active chapter");
    assert(chapterRequests.length === 1, "Saved preferences refetched content mid-chapter");
    navigateChapter("/dashboard/kid/personalization");
    await until(() => button("Thay đổi câu trả lời"), "Profile editor missing");
    await click(button("Thay đổi câu trả lời"));
    await click(button("Nam"));
    await click(button("Lưu câu trả lời"));
    assert(document.body.textContent.includes("Đã lưu!"), "Profile edit did not save");
    const checksBeforeResume = gateRequests;
    navigateChapter("/dashboard/kid/play?chapter=2");
    await until(() => chapterRequests.length === 2 && document.querySelector(".vn-player"), "Chapter did not resume after profile edit");
    assert(document.querySelector(".vn-player").dataset.sceneId === sceneId, "Profile edit lost the unfinished chapter checkpoint");
    equal(chapterRequests[1], { code: "CH02", variant: "gender:MALE" }, "Reopened chapter should use new content");
    assert(gateRequests === checksBeforeResume, "Completed personalization was checked again on resume");
    const checksBeforeNextChapter = gateRequests;
    navigateChapter("/dashboard/kid/play?chapter=3");
    await until(() => chapterRequests.length === 3 && document.querySelector(".vn-player"), "Next chapter did not load new variant");
    assert(gateRequests === checksBeforeNextChapter, "Completed personalization was checked again on next chapter");
    equal(chapterRequests[2], { code: "CH03", variant: "gender:MALE" }, "New variant must apply on next chapter opening");
    serverView = view("WAITING_CHILD", { askChild: ["age"] });
    await personalizationApi.getForChild(); // A profile refresh discovers an unfinished step.
    navigateChapter("/dashboard/kid/play?chapter=3");
    await until(() => button("8–10 tuổi"), "Reopening same chapter did not recheck personalization");
    assert(chapterRequests.length === 3 && !document.querySelector(".vn-player"), "Stale player visible while reopened chapter is gated");
    results.push("Unfinished CH02 setup is gated; completed setup is not rechecked on resume/CH03; preference changes preserve active content and resumed progress");
    await mount(<WorkspaceLayout><p>Profile navigation check</p></WorkspaceLayout>);
    assert(!document.querySelector('nav a[href="/dashboard/kid/personalization"]'), "Personalization still appears in navigation");
    await click(document.querySelector(".ws-profile-trigger"));
    assert(document.querySelector('.ws-profile-dropdown a[href="/dashboard/kid/personalization"]'), "Profile menu missing personalization link");
    results.push("Personalization is available only from the profile menu, not top/bottom navigation or the game menu");
    await mount(<div>Game checks finished</div>);
    auth.logout();
  } finally { window.fetch = originalFetch; }
  assert(errors.length === 0, errors.join("; "));
  document.getElementById("personalization-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.getElementById("personalization-result").textContent = JSON.stringify({ status: "FAIL", results, error: error.stack, errors });
}
