import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import "/src/index.css";
import ParentPersonalization from "/src/pages/Parent/Learners/components/ParentPersonalization.jsx";
import { PersonalizationGate } from "/src/pages/Kid/Dashboard/components/PersonalizationGate.jsx";
import { SlotPersonalization } from "/src/features/personalization/SlotPersonalization.jsx";
import { personalizationApi } from "/src/api/personalization.api.js";

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
async function mount(element) {
  root.render(<MemoryRouter key={++mountId}>{element}</MemoryRouter>);
  await wait(120);
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
  document.getElementById("personalization-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.getElementById("personalization-result").textContent = JSON.stringify({ status: "FAIL", results, error: error.stack, errors });
}
