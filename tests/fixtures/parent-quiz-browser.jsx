import { createRoot } from "react-dom/client";
import { auth } from "/src/api/auth.api.js";
import { teacherQuizApi as api } from "/src/pages/Teacher/Quiz/api/teacherQuizApi.js";

const results = [];
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const wait = () => new Promise((resolve) => setTimeout(resolve, 50));
async function until(check) {
  for (let index = 0; index < 200; index++) {
    if (check()) return;
    await wait();
  }
  throw new Error("Timed out waiting for page");
}
const text = () => document.body.textContent;
const button = (label) => [...document.querySelectorAll("button")].find((item) => item.textContent.includes(label));
const snapshot = { actor: { id: "owner", kind: "adult", name: "Phụ huynh", role: "parent", plans: ["parent", "teacher"] }, entitlements: [], loading: false };
auth.getSnapshot = () => snapshot;
auth.ensureEntitlements = async () => [];
let forbiddenCalls = 0;
auth.accountRequest = async (path, options = {}) => {
  if (path === '/api/notifications/unread-count' && (!options.method || options.method === 'GET')) return { count: 0 };
  forbiddenCalls++; throw new Error("Unexpected API call");
};
const requestedGroups = [];
let noFamily = false, fail = false;
api.listGroups = async () => {
  if (fail) throw new Error("Không thể kết nối");
  return [...(noFamily ? [] : [{ id: "family", name: "Nhà mình", context: "FAMILY" }, { id: "old-family", name: "Gia đình cũ", context: "FAMILY", closedAt: "2025-01-01" }]), { id: "class", name: "Lớp học", context: "CLASS" }];
};
api.listQuizzes = async (id) => {
  requestedGroups.push(id);
  return id === "family" ? [
    { id: "post", title: "Hậu trắc tiết kiệm", kind: "POST_TEST", chapter: 1, submittedCount: 1 },
    { id: "draft", title: "Đề giáo viên không được hiện", kind: "CUSTOM" },
  ] : [];
};
api.getQuiz = async () => ({ questions: [] });
api.getQuizResults = async () => ({ rows: [{ slotId: "child", displayName: "Bé An", attempted: true, score: 1, totalQuestions: 2 }] });
api.getQuizSlotResult = async () => ({ paper: [{ questionId: "q1", stem: "Em nên tiết kiệm thế nào?", options: ["Để dành", "Tiêu hết"], chosen: 0, correctPos: 0, correct: true }] });
let root, App;
async function mount() {
  root?.unmount();
  root = createRoot(document.getElementById("root"));
  history.replaceState(null, "", "/dashboard/quiz-management");
  App ??= (await import('/src/App.jsx')).default;
  root.render(<App />);
  await wait();
}
try {
  await mount();
  await until(() => button("Xem kết quả"));
  assert(document.querySelector('nav a[href="/dashboard/quiz-management"]'), "Parent sidebar entry missing");
  assert(requestedGroups.includes("family") && requestedGroups.includes("old-family") && !requestedGroups.includes("class"), "Parent results must only load family groups, including archived families");
  assert(!text().includes("Đề giáo viên không được hiện"), "Non-post-test quiz exposed");
  assert(!/Tạo đề|Kho câu hỏi chung|Kho câu hỏi riêng|Nhập từ tệp|Phát hành/.test(text()), "Teacher controls exposed to parent");
  button("Xem kết quả").click();
  await until(() => button("Xem bài"));
  assert(document.querySelector('[role="dialog"]').textContent.includes("Bé An"), "Child name missing");
  assert(document.querySelector('[role="dialog"]').textContent.includes("1/2"), "Child score missing");
  button("Xem bài").click();
  await until(() => text().includes("Em nên tiết kiệm thế nào?"));
  assert(text().includes("Trẻ đã chọn") && text().includes("A. Để dành"), "Answer detail missing");
  assert(forbiddenCalls === 0, "Parent screen made an unrelated or write request");
  results.push("Parent route and menu expose only family post-test results, scores and answer review without write requests");

  noFamily = true;
  await mount();
  await until(() => text().includes("Chưa có bài trắc nghiệm sau chương"));
  results.push("No family shows a useful empty state");
  fail = true;
  await mount();
  await until(() => text().includes("Không thể kết nối"));
  fail = false;
  button("Làm mới").click();
  await until(() => text().includes("Chưa có bài trắc nghiệm sau chương"));
  results.push("Load errors are visible and refresh retries successfully");

  snapshot.actor = { ...snapshot.actor, role: "teacher" };
  await mount();
  await until(() => button("Tạo đề"));
  assert(button("Kho câu hỏi chung") && button("Kho câu hỏi riêng"), "Teacher management features lost");
  results.push("Teacher route retains full quiz management");
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message, results });
}
