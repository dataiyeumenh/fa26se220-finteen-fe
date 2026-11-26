import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import TeacherReportsContent from "/src/pages/Teacher/Reports/components/TeacherReportsContent.jsx";
import "/src/index.css";
import "/src/features/workspace/workspace-design-system.css";

const wait = () => new Promise((resolve) => setTimeout(resolve, 60));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const chapter = {
  chapter: 1, title: "Tiền đầu tiên", quizId: "quiz-one", active: 40, finished: 31, submitted: 30,
  comment: { state: "READY", text: "Lớp đã hiểu nội dung chính.\nCần ôn lại chi phí cơ hội.", at: "2026-11-25T03:31:00Z", basedOn: 28, sections: {
    overview: "Lớp đã hoàn thành những nội dung chính của chương.",
    decisions: [],
    doingWell: [{ concept: "D01.02", name: "Phân biệt cần và muốn", correct: 42, total: 50, text: "Phần lớn lớp đã nhận biết được các khoản cần thiết." }],
    needsPractice: [{ concept: "D01.03", name: "Chi phí cơ hội", correct: 25, total: 60, text: "Lớp cần luyện thêm cách cân nhắc điều phải từ bỏ." }],
    tips: [{ name: "Hoạt động gợi ý", text: "Cho các em so sánh hai lựa chọn gần gũi." }],
    notEnough: [],
  } },
  history: [{ at: "2026-11-24T03:31:00Z", basedOn: 14, text: "Bản nhận xét trước." }],
  concepts: [{ name: "Chi phí cơ hội", objective: "Biết cân nhắc điều phải từ bỏ.", correct: 25, total: 60, band: "PRACTICE", wrongLearners: [{ slotId: "slot-one", displayName: "An" }] }],
  decisions: [{ question: "Mình nên dùng khoản tiền đầu tiên thế nào?", options: [{ label: "Để dành", count: 17, learners: [{ slotId: "slot-one", displayName: "An" }] }, { label: "Mua ngay", count: 13, learners: [] }] }],
  notFinished: [{ slotId: "slot-two", displayName: "Bình" }], notSubmitted: [{ slotId: "slot-three", displayName: "Chi" }],
};
const report = { group: { id: "group-one", name: "Lớp 8A" }, summary: { learners: 40, active: 40, activeLast7Days: 35, chaptersCompleted: 1, totalChapters: 8, quizAssigned: 1, quizSubmitted: 30, averageScore: 4.5 }, chapters: [chapter], rows: [{ slotId: "slot-one", displayName: "An", status: "ACTIVE", averageScore: 4, quizSubmitted: 1 }, { slotId: "slot-archived", displayName: "Bạn cũ", status: "ARCHIVED", averageScore: 1, quizSubmitted: 1 }] };
const state = { groups: [report.group], reports: [report], report, rows: [], groupId: report.group.id, status: "", setStatus() {}, setGroupId() {}, loading: false, updating: false, error: "", warning: "", refresh() {}, refreshGroup() {} };

const root = createRoot(document.getElementById("root"));
try {
  root.render(<MemoryRouter><main className="ws"><TeacherReportsContent reportState={state} /></main></MemoryRouter>);
  await wait();
  const section = document.querySelector(".class-report-chapters");
  assert(section?.textContent.includes("30/40 em đã nộp bài"), "Chapter submission progress is missing");
  assert(section.querySelector(".class-report-note-section")?.textContent.includes("Chi phí cơ hội"), "Teaching focus is missing");
  assert(section.querySelector(".class-report-note-section")?.textContent.includes("Cho các em so sánh"), "Suggested teaching activity is missing");
  assert(section.textContent.includes("Bản trước (1)"), "Comment history is missing");
  const concept = section.querySelector(".class-report-concept-chart");
  assert(concept.textContent.includes("Cần ôn lại") && concept.textContent.includes("25/60"), "Concept band or evidence is missing");
  concept.open = true;
  const decision = section.querySelector(".class-report-story-options button");
  decision.click();
  await wait();
  assert(section.querySelector(".class-report-rechart-detail"), "Story chart drill-down is missing");
  assert(section.querySelector('a[href="/dashboard/learners/slot-one"]'), "Learner report link is missing");
  assert(!section.querySelector('a[href="/dashboard/quiz-management?quiz=quiz-one&slot=slot-one"]'), "Submitted learners should not appear in the attention list");
  assert(!section.querySelector(".is-correct, .is-wrong"), "Story decisions incorrectly use correctness styling");
  assert(!section.querySelector(".class-report-follow-up"), "The duplicated follow-up list should be removed");
  assert(!document.querySelector(".class-report-overview"), "Course-wide summary should not appear in a chapter report");
  assert(!document.querySelector(".class-report-analytics"), "Course-wide charts should not appear in a chapter report");
  assert(section.querySelectorAll(".class-report-progress-stack > i").length === 3, "The stacked chapter progress chart is missing");
  assert(section.querySelectorAll(".class-report-story-mini-chart").length === 2, "Each story option should expose its own chart");
  assert(section.textContent.includes("Dựa trên 30/40 em"), "Story chart sample size is missing");
  assert(document.querySelector(".class-report-controlbar .class-report-chapter-tabs") && !section.querySelector(".class-report-chapter-rail"), "Class, chapter and view controls should share one bar");
  assert(!document.querySelector(".class-report-roster"), "The course-wide roster should not appear in a chapter report");
  const courseTab = [...document.querySelectorAll(".class-report-view-tabs button")].find((button) => button.textContent.includes("Tổng quan lớp"));
  courseTab.click();
  await wait();
  assert(document.querySelector(".class-report-course-charts"), "Course-wide charts should remain available in their own tab");
  assert(document.querySelector(".class-report-course-roster")?.textContent.includes("2 hồ sơ · 1 đang hoạt động"), "The roster should distinguish profiles from active learners");
  assert(document.body.textContent.includes("0–2") && document.body.textContent.includes("5–6"), "Score distribution must use the six-question scale");
  assert(document.body.textContent.includes("Dựa trên 1 em đã nộp"), "Score distribution must exclude unscored and archived profiles");
  assert(document.body.textContent.includes("CH8"), "Course completion chart must always show all eight chapters");
  assert(document.querySelector(".class-report-course-roster")?.textContent.includes("Hậu trắc đã nộp"), "Roster submission evidence is missing");
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results: ["Class chapter report contract and learner navigation are rendered"] });
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message });
}
