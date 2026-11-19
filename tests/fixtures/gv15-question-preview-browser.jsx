import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import QuestionSetPreview from "/src/pages/Teacher/Quiz/components/QuestionSetPreview.jsx";
import MyQuestionBank from "/src/pages/Teacher/Quiz/components/MyQuestionBank.jsx";
import { teacherQuizApi } from "/src/pages/Teacher/Quiz/api/teacherQuizApi.js";
import replacements from "/scripts/content-migrations/gv15-questions-2026-11-19.replacements.json";
import "/src/index.css";
import "/src/features/workspace/workspace.css";
import "/src/features/workspace/quiz.css";

const root = createRoot(document.getElementById("root"));
const output = document.getElementById("gv15-question-preview-result");
const errors = [];
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) => errors.push(String(event.reason)));
const assert = (value, message) => { if (!value) throw Error(message); };
const wait = () => new Promise((resolve) => setTimeout(resolve, 40));
async function until(predicate) {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await wait(); }
  throw Error("Question view did not load");
}
const questions = replacements.map(({ body }) => ({ ...body, id: body.externalId, reference: null }));
const invoice = questions.find((question) => question.externalId === "PISA-021-R1");
const results = [];

try {
  root.render(<MemoryRouter><QuestionSetPreview set={{ code: "PISA", questions: [invoice] }} selected={new Set()} onChange={() => {}} onClose={() => {}} /></MemoryRouter>);
  await until(() => document.querySelector(".ws-set-preview__content h3"));
  const stem = document.querySelector(".ws-set-preview__content h3");
  assert(stem.textContent === invoice.stem, "Teacher preview changed invoice data");
  assert(getComputedStyle(stem).whiteSpace === "pre-line", "Teacher preview collapsed invoice rows");
  assert(stem.innerText.includes("\nThuế 10%"), "Invoice tax is not on a separate line");
  assert(stem.scrollWidth <= stem.clientWidth + 1, "Invoice overflows horizontally");
  assert(document.querySelectorAll(".ws-set-preview__options li.is-correct").length === 1, "Invoice must have one marked correct answer");
  results.push("Teacher Xem đề preserves invoice rows and exactly one correct answer");

  teacherQuizApi.listQuestions = async () => questions;
  root.render(<MemoryRouter><MyQuestionBank shared /></MemoryRouter>);
  await until(() => document.querySelectorAll(".ws-bank-list article").length === 12);
  assert(document.querySelectorAll(".ws-question-reference").length === 12, "Sources missing from replacement questions");
  assert(!document.body.textContent.includes("Nguồn: Chưa cập nhật"), "Studio source fallback ignored");
  const invoiceCard = [...document.querySelectorAll(".ws-bank-list article")].find((card) => card.textContent.includes("HÓA ĐƠN SỐ 2034"));
  assert(getComputedStyle(invoiceCard.querySelector("h3")).whiteSpace === "pre-line", "Shared bank collapsed invoice rows");
  assert(!document.body.textContent.includes("Tôi muốn biết"), "Interview wording remains");
  results.push("All twelve edited questions render in the shared bank with Studio source attribution");
  assert(errors.length === 0, errors.join("; "));
  output.textContent = JSON.stringify({ status: "PASS", results, errors });
} catch (error) {
  output.textContent = JSON.stringify({ status: "FAIL", error: error.message, results, errors });
}
