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
    summary: { status: "READY", text: summaryText, sections: {
      overview: "Bé đã hoàn thành chương Tiền đầu tiên.",
      decisions: [{ option: "Để dành tiền mua sách", deliberate: true, text: "Bé đã cân nhắc trước khi lựa chọn." }],
      doingWell: [{ concept: "D01.02", name: "Phân biệt cần và muốn", correct: 5, total: 6, text: "Bé nhận biết tốt các khoản cần thiết." }],
      needsPractice: [], tips: [], notEnough: [],
    } },
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
async function mount(value = report, extraState = {}) {
  root.render(<MemoryRouter initialEntries={["/dashboard/learners/report-test"]}>
    <WorkspaceLayout><LearnerReportContent reportState={{ report: value, loading: false, refresh() {}, ...extraState }} /></WorkspaceLayout>
  </MemoryRouter>);
  await wait();
  document.querySelectorAll(".learner-report-chapter").forEach((node) => { node.open = true; });
  await wait();
}
try {
  await mount();
  const notificationButton = document.querySelector(".ws-notification-button");
  notificationButton.click();
  await wait();
  assert(document.querySelector(".ws-notification-dropdown"), "Notification dropdown did not open");
  document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  await wait();
  assert(!document.querySelector(".ws-notification-dropdown"), "Notification dropdown did not close after an outside click");
  results.push("Notification dropdown closes when the user clicks outside it");
  assert(document.querySelector(".ws-progress-score strong").textContent.includes("2/8"), "Completed chapters do not match progress data");
  assert(document.querySelector(".learner-progress-meta").textContent.includes("Học tiếp từ Chương 3"), "Continue chapter does not match progress data");
  assert(document.querySelector(".learner-progress-meta").textContent.includes("Lượt trải nghiệm: Lần 1"), "Attempt index does not match progress data");
  const first = document.querySelector(".learner-report-chapter-body");
  const summary = first.querySelector(".learner-report-summary");
  assert(summary.textContent.includes("Bé đã hoàn thành chương Tiền đầu tiên.") && summary.textContent.includes("Phân biệt cần và muốn") && summary.textContent.includes("5/6 câu đúng"), "Structured backend summary is missing");
  assert(!summary.textContent.includes("Cần luyện thêm: Phân biệt nhu cầu"), "Legacy text was rendered instead of structured sections");
  results.push("Structured backend summary is rendered instead of the legacy text fallback");
  const choices = first.querySelector(".learner-chapter-choices");
  assert(choices.textContent.includes("Để dành tiền mua sách") && choices.textContent.includes("Chờ đủ tiền rồi mới mua"), "Choice content is missing");
  assert(!/A\.|B\.|Có chủ đích|Chưa chủ đích/.test(choices.textContent), "Ambiguous option codes or deliberate labels remain");
  assert(choices.textContent.includes("Lựa chọn trong truyện"), "Unlabelled choice has no fallback");
  results.push("Choices show the selected text without option codes or inferred judgments");
  const miniGame = first.querySelector(".is-mini-game");
  const postTest = first.querySelector(".is-post-test");
  assert(miniGame.querySelector("strong").textContent === "3/6", "Mini-game count changed");
  assert(postTest.querySelector("strong").textContent === "4/6", "Post-test count changed");
  assert(postTest.querySelector(".learner-post-test-button")?.textContent.includes("Xem bài trắc nghiệm"), "Submitted quiz does not expose its detail action");
  const review = miniGame.querySelector(".learner-minigame-review");
  assert(review?.textContent.includes("Bộ màu vẽ cao cấp"), "Wrong mini-game question is missing");
  assert(review.textContent.includes("Bé chọn: Cần") && review.textContent.includes("Đáp án: Muốn"), "Chosen and expected answers are missing");
  assert(review.textContent.includes(report.chapters[0].miniGames.wrong[0].explanation), "Wrong-answer explanation is missing");
  assert(!postTest.querySelector(".learner-minigame-review"), "Mini-game review appears on post-test card");
  results.push("Mini-game scores and wrong answers include the chosen answer, expected answer and explanation");
  await mount(report, { postTestResults: { "quiz-one": { paper: [
    { questionId: "q1", stem: "Khoản nào là nhu cầu?", options: ["Sách giáo khoa", "Đồ chơi"], chosen: 0, correctIndex: 0, correct: true },
    { questionId: "q2", stem: "Khoản nào có thể hoãn?", options: ["Tiền học", "Giày mới khi đôi cũ còn tốt"], chosen: 0, correctIndex: 1, correct: false },
  ] } } });
  const postTestDetails = document.querySelector(".learner-post-test-paper");
  assert(postTestDetails?.open, "Loaded post-test detail does not open initially");
  assert(postTestDetails.querySelector(".learner-answer.is-wrong")?.textContent.includes("Trả lời sai"), "Wrong quiz answer is not marked red");
  assert(postTestDetails.querySelectorAll(".learner-answer.is-correct").length === 2, "Correct quiz answers are not marked green");
  postTestDetails.open = false;
  assert(!postTestDetails.open, "Loaded post-test detail cannot be collapsed");
  results.push("Post-test detail opens after loading and can be collapsed");
  await mount();
  const empty = document.querySelectorAll(".learner-report-chapter-body")[1];
  assert(empty.textContent.includes("Chưa có kết quả") && empty.textContent.includes("Chưa nộp") && empty.textContent.includes("Chưa ghi nhận lựa chọn"), "Missing data is not explained");
  assert(!empty.textContent.includes("0/0"), "Missing data is incorrectly represented as a score");
  assert(!empty.querySelector(".learner-post-test-button"), "Pending post-test incorrectly exposes a detail action");
  results.push("Missing mini-game, post-test and choice data have explicit empty states");
  assert(document.querySelector(".learner-learning-overview")?.textContent.includes("Bé đã học được gì"), "Learning overview is missing");
  assert(document.querySelector(".learner-learning-overview")?.textContent.includes("Bé đang làm tốt"), "Strong learning content is missing");
  assert(first.querySelector(".learner-report-summary strong").textContent.includes("Nhận xét chương"), "Chapter summary is not correctly labelled");
  assert(review.querySelector("h4").textContent.includes("Bé cần luyện thêm ở chương này"), "Practice guidance is not attached to its chapter");
  results.push("Learning overview groups strengths and practice needs before chapter details");
  assert(document.querySelector(".learner-final-status").textContent === "Trạng thái: Tạm thời (còn chương chờ trắc nghiệm)", "PARTIAL status is not translated");
  await mount({ ...report, finalReport: { status: "COMPLETE", summary: { status: "READY", text: "Đã hoàn thành." } } });
  assert(document.querySelector(".learner-final-status").textContent === "Trạng thái: Đầy đủ", "COMPLETE status is not translated");
  await mount({ ...report, chapters: [{ ...report.chapters[0], miniGames: { correct: 6, total: 6, wrong: [] } }] });
  assert(!document.querySelector(".learner-minigame-review"), "Empty wrong-answer list renders a review");
  results.push("Final statuses use parent-friendly Vietnamese and empty wrong-answer lists stay hidden");
  const generating = { ...report, chapters: [{ ...report.chapters[0], summary: { status: "GENERATING" } }] };
  await mount(generating);
  assert(document.body.textContent.includes("Hệ thống đang tổng hợp báo cáo"), "Generating summary state missing");
  await mount({ ...report, progress: { completedChapters: 0, totalChapters: 8 } });
  assert(document.querySelector(".ws-progress-score strong").textContent.includes("0/8"), "Explicit zero was replaced with chapter list length");
  assert(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow") === "0", "Zero completion shows a nonzero percentage");
  assert(!document.querySelector(".learner-progress-meta small"), "Missing attempt index was guessed");
  results.push("Compact progress uses backend values, preserves zero completion and explains missing data");
  await mount();
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result" hidden></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message, results });
}
