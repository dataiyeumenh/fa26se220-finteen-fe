import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import LearnerReportContent from "/src/pages/LearnerReport/components/LearnerReportContent.jsx";
import WorkspaceLayout from "/src/features/workspace/WorkspaceLayout.jsx";
import { auth } from "/src/api/auth.api.js";
import "/src/index.css";

const root = createRoot(document.getElementById("root"));
const wait = () => new Promise((resolve) => setTimeout(resolve, 50));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const results = [];
const snapshot = { actor: { id: "report-test", name: "Phụ huynh", role: "parent", kind: "adult", plans: ["parent"] }, entitlements: [] };
auth.getSnapshot = () => snapshot;
auth.ensureEntitlements = async () => [];
const summaryText = "Bé đã hoàn thành chương Tiền đầu tiên.\n\nĐã làm tốt: Bé biết cân nhắc trước khi mua đồ.\nCần luyện thêm: Phân biệt nhu cầu và mong muốn.";
const report = {
  learner: { displayName: "Bé An", status: "ACTIVE", group: { name: "Gia đình" } },
  progress: { completedChapters: 2, totalChapters: 8, continueChapter: 3, attemptIndex: 1 },
  chapters: [{
    chapter: 1, title: "Tiền đầu tiên", reportStatus: "COMPLETE",
    summary: { status: "READY", text: summaryText },
    choices: [{ id: "one", label: "A. Để dành tiền mua sách", deliberate: true }, { id: "two", label: "B. Chờ đủ tiền rồi mới mua", deliberate: false }],
    miniGames: { correct: 3, total: 6, wrong: [{ id: "internal-id", label: "Nội dung cần xem lại không được hiện" }] },
    postTest: { status: "SUBMITTED", correct: 4, total: 6 },
  }, {
    chapter: 2, title: "Tháng đầu tiên và mục tiêu lớn", reportStatus: "PARTIAL",
    summary: { status: "WAITING_POST_TEST" }, choices: [], miniGames: null, postTest: null,
  }], concepts: [
    { concept: "D01.02", band: "NO_DATA", game: { correct: 0, total: 0 }, postTest: { correct: 1, total: 1 }, correct: 1, total: 1 },
    { concept: "D02.02", band: "FAMILIAR", game: { correct: 4, total: 6 }, postTest: { correct: 0, total: 0 }, correct: 4, total: 6 },
  ],
};
async function mount(value = report) {
  root.render(<MemoryRouter initialEntries={["/dashboard/learners/report-test"]}>
    <WorkspaceLayout><LearnerReportContent reportState={{ report: value, loading: false, refresh() {} }} /></WorkspaceLayout>
  </MemoryRouter>);
  await wait();
  document.querySelectorAll(".learner-report-chapter").forEach((node) => { node.open = true; });
  await wait();
}
try {
  await mount();
  const progressCards = document.querySelector(".ws-progress-summary");
  assert(progressCards.querySelector(".is-completed strong").textContent.includes("2 / 8"), "Completed chapters do not match progress data");
  assert(progressCards.querySelector(".is-next strong").textContent === "Chương 3", "Continue chapter does not match progress data");
  assert(progressCards.querySelector(".is-attempt strong").textContent === "Lần 1", "Attempt index does not match progress data");
  const first = document.querySelector(".learner-report-chapter-body");
  const summary = first.querySelector(".learner-report-summary p");
  assert(summary.textContent === summaryText, "Backend summary text was changed");
  assert(getComputedStyle(summary).whiteSpace === "pre-line", "Backend line breaks are collapsed");
  results.push("Backend summary wording and line breaks are preserved");
  const choices = first.querySelector(".learner-chapter-choices");
  assert(choices.textContent.includes("Để dành tiền mua sách") && choices.textContent.includes("Chờ đủ tiền rồi mới mua"), "Choice content is missing");
  assert(!/A\.|B\.|Có chủ đích|Chưa chủ đích/.test(choices.textContent), "Ambiguous option codes or deliberate labels remain");
  results.push("Choices show the selected text without option codes or inferred judgments");
  const miniGame = first.querySelector(".is-mini-game");
  const postTest = first.querySelector(".is-post-test");
  assert(miniGame.querySelector("strong").textContent === "3/6", "Mini-game count changed");
  assert(postTest.querySelector("strong").textContent === "4/6", "Post-test count changed");
  assert(!first.querySelector(".learner-report-metrics details"), "Mini-game review section remains");
  assert(!document.body.textContent.includes("Nội dung cần xem lại không được hiện"), "Wrong-answer review data was displayed");
  results.push("Matching result cards display only correct/total counts without mini-game review");
  const empty = document.querySelectorAll(".learner-report-chapter-body")[1];
  assert(empty.textContent.includes("Chưa có kết quả") && empty.textContent.includes("Chưa nộp") && empty.textContent.includes("Chưa ghi nhận lựa chọn"), "Missing data is not explained");
  assert(!empty.textContent.includes("0/0"), "Missing data is incorrectly represented as a score");
  results.push("Missing mini-game, post-test and choice data have explicit empty states");
  const concepts = document.querySelector(".learner-concept-grid");
  assert(concepts.textContent.includes("Nhu cầu và mong muốn") && concepts.textContent.includes("Thu nhập trước và sau khấu trừ"), "Knowledge unit names missing");
  assert(!/D01\.02|D02\.02/.test(concepts.textContent), "Internal knowledge codes are still displayed");
  assert(concepts.textContent.includes("1/1") && concepts.textContent.includes("4/6"), "Concept scores changed");
  results.push("Knowledge units show Vietnamese names while preserving scores and assessment bands");
  const generating = { ...report, chapters: [{ ...report.chapters[0], summary: { status: "GENERATING" } }] };
  await mount(generating);
  assert(document.body.textContent.includes("Hệ thống đang tổng hợp báo cáo"), "Generating summary state missing");
  await mount({ ...report, progress: { completedChapters: 0, totalChapters: 8 } });
  assert(document.querySelector(".ws-progress-summary .is-completed strong").textContent.includes("0 / 8"), "Explicit zero was replaced with chapter list length");
  assert(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow") === "0", "Zero completion shows a nonzero percentage");
  assert(document.querySelector(".ws-progress-summary .is-attempt strong").textContent === "Chưa xác định", "Missing attempt index was guessed");
  results.push("Progress cards show backend values, preserve zero completion and explain missing data");
  await mount();
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message, results });
}
