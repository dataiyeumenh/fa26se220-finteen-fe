import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import TeacherReportsContent from "/src/pages/Teacher/Reports/components/TeacherReportsContent.jsx";
import "/src/index.css";
import "/src/features/workspace/workspace-design-system.css";

const wait = () => new Promise((resolve) => setTimeout(resolve, 60));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const chapter = {
  chapter: 1, title: "Tiền đầu tiên", active: 40, finished: 31, submitted: 30,
  comment: { state: "READY", text: "Lớp đã hiểu nội dung chính.\nCần ôn lại chi phí cơ hội.", at: "2026-11-25T03:31:00Z", basedOn: 28 },
  history: [{ at: "2026-11-24T03:31:00Z", basedOn: 14, text: "Bản nhận xét trước." }],
  concepts: [{ name: "Chi phí cơ hội", objective: "Biết cân nhắc điều phải từ bỏ.", correct: 25, total: 60, band: "PRACTICE", wrongLearners: [{ slotId: "slot-one", displayName: "An" }] }],
  decisions: [{ question: "Mình nên dùng khoản tiền đầu tiên thế nào?", options: [{ label: "Để dành", count: 17, learners: [{ slotId: "slot-one", displayName: "An" }] }, { label: "Mua ngay", count: 13, learners: [] }] }],
  notFinished: [{ slotId: "slot-two", displayName: "Bình" }], notSubmitted: [{ slotId: "slot-three", displayName: "Chi" }],
};
const report = { group: { id: "group-one", name: "Lớp 8A" }, summary: { learners: 40, active: 40, activeLast7Days: 35, chaptersCompleted: 1, totalChapters: 8, quizAssigned: 1, quizSubmitted: 30, averageScore: 4.5 }, chapters: [chapter], rows: [] };
const state = { reports: [report], report, rows: [], status: "", setStatus() {}, setGroupId() {}, loading: false, error: "", warning: "", refresh() {}, refreshGroup() {} };

const root = createRoot(document.getElementById("root"));
try {
  root.render(<MemoryRouter><main className="ws"><TeacherReportsContent reportState={state} /></main></MemoryRouter>);
  await wait();
  const section = document.querySelector(".class-report-chapters");
  assert(section?.textContent.includes("30/40 em đã nộp bài sau chương"), "Chapter submission progress is missing");
  assert(section.textContent.includes("Nhận xét lúc 28/40 em"), "Comment evidence count is missing");
  const commentWhiteSpace = getComputedStyle(section.querySelector(".class-report-comment-text p")).whiteSpace;
  assert(commentWhiteSpace === "pre-line", `Comment line breaks are not preserved (${commentWhiteSpace})`);
  assert(section.textContent.includes("Bản trước (1)"), "Comment history is missing");
  const concept = section.querySelector(".class-report-concept");
  assert(concept.textContent.includes("Cần ôn lại") && concept.textContent.includes("25/60"), "Concept band or evidence is missing");
  concept.open = true;
  const decision = section.querySelector(".class-report-decisions details");
  decision.open = true;
  await wait();
  assert(section.querySelector('a[href="/dashboard/learners/slot-one"]'), "Learner report link is missing");
  assert(!section.querySelector(".is-correct, .is-wrong"), "Story decisions incorrectly use correctness styling");
  assert(section.textContent.includes("Chưa xong chương") && section.textContent.includes("Chưa nộp bài sau chương"), "Follow-up lists are missing");
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results: ["Class chapter report contract and learner navigation are rendered"] });
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message });
}
