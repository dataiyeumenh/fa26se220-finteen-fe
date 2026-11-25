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
    choices: [{ optionId: "one", label: "A. Để dành tiền mua sách", deliberate: true }, { optionId: "two", label: "B. Chờ đủ tiền rồi mới mua", deliberate: false }, { optionId: "three" }],
    miniGames: { correct: 3, total: 6, wrong: [{ gameId: "NEED_WANT_CH01", itemId: "art-colors", label: "Bộ màu vẽ cao cấp", chosenLabel: "Cần", expectedLabel: "Muốn", explanation: "Có thể hoãn mua để ưu tiên các khoản cần thiết." }] },
    postTest: { quizId: "quiz-one", status: "SUBMITTED", correct: 4, total: 6 },
  }, {
    chapter: 2, title: "Tháng đầu tiên và mục tiêu lớn", reportStatus: "PARTIAL",
    summary: { status: "WAITING_POST_TEST" }, choices: [], miniGames: null, postTest: null,
  }], concepts: [
    { concept: "D01.02", name: "Phân biệt cần và muốn", objective: "Phân biệt nhu cầu thiết yếu với mong muốn cá nhân.", band: "NO_DATA", game: { correct: 0, total: 0 }, postTest: { correct: 1, total: 1 }, correct: 1, total: 1 },
    { concept: "D02.02", band: "FAMILIAR", game: { correct: 4, total: 6 }, postTest: { correct: 0, total: 0 }, correct: 4, total: 6 },
  ],
  finalReport: { status: "PARTIAL", summary: { status: "WAITING_POST_TEST" } },
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
  assert(choices.textContent.includes("Lựa chọn trong truyện"), "Unlabelled choice has no fallback");
  results.push("Choices show the selected text without option codes or inferred judgments");
  const miniGame = first.querySelector(".is-mini-game");
  const postTest = first.querySelector(".is-post-test");
  assert(miniGame.querySelector("strong").textContent === "3/6", "Mini-game count changed");
  assert(postTest.querySelector("strong").textContent === "4/6", "Post-test count changed");
  assert(postTest.querySelector(".learner-post-test-button")?.textContent.includes("Xem bài hậu trắc"), "Submitted post-test does not expose its detail action");
  const review = miniGame.querySelector(".learner-minigame-review");
  assert(review?.textContent.includes("Bộ màu vẽ cao cấp"), "Wrong mini-game question is missing");
  assert(review.textContent.includes("Bé chọn: Cần") && review.textContent.includes("Đáp án: Muốn"), "Chosen and expected answers are missing");
  assert(review.textContent.includes(report.chapters[0].miniGames.wrong[0].explanation), "Wrong-answer explanation is missing");
  assert(!postTest.querySelector(".learner-minigame-review"), "Mini-game review appears on post-test card");
  results.push("Mini-game scores and wrong answers include the chosen answer, expected answer and explanation");
  const empty = document.querySelectorAll(".learner-report-chapter-body")[1];
  assert(empty.textContent.includes("Chưa có kết quả") && empty.textContent.includes("Chưa nộp") && empty.textContent.includes("Chưa ghi nhận lựa chọn"), "Missing data is not explained");
  assert(!empty.textContent.includes("0/0"), "Missing data is incorrectly represented as a score");
  assert(!empty.querySelector(".learner-post-test-button"), "Pending post-test incorrectly exposes a detail action");
  results.push("Missing mini-game, post-test and choice data have explicit empty states");
  const concepts = document.querySelector(".learner-learning-overview");
  assert(concepts.textContent.includes("Những nội dung bé đã học"), "Parent-friendly learning overview is missing");
  assert(concepts.textContent.includes("Bé đang làm quen"), "Assessment bands are not grouped into plain-language sections");
  assert(concepts.textContent.includes("Thu nhập trước và sau khấu trừ"), "Assessed concept name or legacy fallback missing");
  assert(concepts.textContent.includes("Bé đã học qua") && concepts.textContent.includes("Chưa đủ bài để xếp mức"), "Unrated learning section is missing");
  assert(concepts.textContent.includes("Phân biệt cần và muốn") && concepts.textContent.includes(report.concepts[0].objective), "Unrated concept name or objective is missing");
  assert(concepts.textContent.includes("1/1 câu đúng"), "Unrated concept evidence count is missing");
  assert(!/D01\.02|D02\.02/.test(concepts.textContent), "Internal knowledge codes are still displayed");
  assert(first.querySelector(".learner-report-summary strong").textContent.includes("Nhận xét chương"), "Chapter summary is not correctly labelled");
  assert(review.querySelector("h4").textContent.includes("Bé cần luyện thêm ở chương này"), "Practice guidance is not attached to its chapter");
  results.push("Knowledge units stay compact while learning and practice guidance appear in the relevant chapter");
  assert(document.querySelector(".learner-final-status").textContent === "Trạng thái: Tạm thời (còn chương chờ hậu trắc)", "PARTIAL status is not translated");
  await mount({ ...report, finalReport: { status: "COMPLETE", summary: { status: "READY", text: "Đã hoàn thành." } } });
  assert(document.querySelector(".learner-final-status").textContent === "Trạng thái: Đầy đủ", "COMPLETE status is not translated");
  await mount({ ...report, chapters: [{ ...report.chapters[0], miniGames: { correct: 6, total: 6, wrong: [] } }] });
  assert(!document.querySelector(".learner-minigame-review"), "Empty wrong-answer list renders a review");
  results.push("Final statuses use parent-friendly Vietnamese and empty wrong-answer lists stay hidden");
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
