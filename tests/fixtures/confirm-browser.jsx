import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import MyQuestionBank from "/src/pages/Teacher/Quiz/components/MyQuestionBank.jsx";
import PaymentResult from "/src/features/workspace/PaymentResult.jsx";
import StudioWorkspace from "/src/features/internal/StudioWorkspace.jsx";
import { auth } from "/src/api/auth.api.js";
import { teacherQuizApi } from "/src/pages/Teacher/Quiz/api/teacherQuizApi.js";
import { workspaceApi } from "/src/features/workspace/api/workspaceApi.js";
import { studioApi } from "/src/features/studio/studioClient.js";
import { StudioDialog } from "/src/features/studio/ui.jsx";
import { Dialog, DialogContent, DialogTitle } from "/src/components/ui/dialog.jsx";
import "/src/index.css";
import "/src/features/workspace/workspace.css";

const root = createRoot(document.getElementById("root"));
const results = [];
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const wait = () => new Promise((resolve) => setTimeout(resolve, 40));
async function until(check, label) {
  for (let tick = 0; tick < 200; tick++) { if (check()) return; await wait(); }
  throw new Error(`Timed out: ${label}`);
}
const button = (label, scope = document) => [...scope.querySelectorAll("button")].find((node) => node.textContent.trim() === label);
const dialog = () => document.querySelector('[role="alertdialog"]');
let nativeCalls = 0;
for (const name of ["confirm", "alert", "prompt"]) window[name] = () => { nativeCalls++; throw new Error(`Native ${name} invoked`); };
const actor = { id: "popup-test", name: "Test", kind: "adult", role: "teacher", plans: ["teacher"], roles: ["GAME_EDITOR"] };
const snapshot = { actor, entitlements: [] };
auth.getSnapshot = () => snapshot;
auth.ensureEntitlements = async () => [];
let questions = [{ id: "question-one", stem: "Nhu cầu thiết yếu là gì?", options: ["Thức ăn", "Đồ chơi"], correctIndex: 0 }];
teacherQuizApi.listMyQuestions = async () => questions;
let deleteCalls = 0, finishDelete;
teacherQuizApi.deleteMyQuestion = async (id) => {
  deleteCalls++;
  assert(id === "question-one", "Wrong question was deleted");
  if (deleteCalls === 1) return new Promise((resolve, reject) => { finishDelete = () => reject(new Error("Không thể xóa câu hỏi lúc này")); });
  questions = [];
};
async function mount(content, route = "/dashboard/quiz-management") {
  root.render(<div />); await wait();
  root.render(<MemoryRouter initialEntries={[route]}>{content}</MemoryRouter>); await wait();
}
try {
  await mount(<div className="ws"><MyQuestionBank /></div>);
  await until(() => button("Xóa"), "question list");
  button("Xóa").click();
  await until(dialog, "delete confirmation");
  const standardWidth = parseFloat(getComputedStyle(dialog()).width);
  assert(Math.abs(standardWidth - Math.min(560, innerWidth - 32)) < 1, "Reference confirmation has the wrong width");
  assert(deleteCalls === 0, "Question deleted before confirmation");
  assert(dialog().textContent.includes("Nhu cầu thiết yếu"), "Confirmation does not identify the question");
  assert(document.activeElement.textContent === "Hủy", "Safe cancel action is not initially focused");
  button("Hủy", dialog()).click(); await wait();
  assert(!dialog() && deleteCalls === 0, "Cancel changed the question");
  button("Xóa").click(); await wait();
  const confirm = button("Xóa câu hỏi", dialog());
  confirm.click(); confirm.click(); await wait();
  assert(deleteCalls === 1 && button("Hủy", dialog()).disabled, "Duplicate submission or busy cancel allowed");
  finishDelete();
  await until(() => dialog()?.textContent.includes("Không thể xóa câu hỏi lúc này"), "inline delete error");
  button("Xóa câu hỏi", dialog()).click();
  await until(() => !dialog() && document.body.textContent.includes("Chưa có câu hỏi"), "retry delete");
  assert(deleteCalls === 2, "Retry did not delete exactly once");
  results.push("Question deletion requires confirmation, safely cancels, blocks duplicate submissions and supports inline error retry");

  let cancelCalls = 0;
  workspaceApi.getPayment = async () => ({ status: "PENDING" });
  workspaceApi.cancelPayment = async () => { cancelCalls++; if (cancelCalls === 1) throw new Error("Hủy đơn thất bại"); return {}; };
  await mount(<PaymentResult payment={{ orderCode: "CONFIRM-TEST", amount: 5000, status: "PENDING", expiresAt: new Date(Date.now() + 3600000).toISOString() }} onClose={() => {}} />);
  button("Hủy giao dịch").click(); await until(dialog, "cancel payment confirmation");
  assert(cancelCalls === 0, "Payment cancelled before confirmation");
  button("Tiếp tục thanh toán", dialog()).click(); await wait();
  assert(!dialog() && cancelCalls === 0, "Continue payment cancelled the order");
  button("Hủy giao dịch").click(); await wait();
  button("Hủy giao dịch", dialog()).click();
  await until(() => dialog()?.textContent.includes("Hủy đơn thất bại"), "payment error");
  button("Hủy giao dịch", dialog()).click();
  await until(() => !dialog() && document.body.textContent.includes("Giao dịch chưa thành công"), "confirmed cancellation");
  results.push("Payment cancellation uses an app popup with keep-payment, inline errors and retry");

  const draft = { status: "DRAFT", revision: 1, editorId: actor.id, title: "Chương thử" };
  studioApi.get = async (path) => {
    if (path.endsWith("/draft")) return { draft, content: { id: "chapter-1", title: "Chương thử", sprites: {}, scenes: [{ id: "intro", type: "dialogue", speaker: "An", text: "Lời thoại ban đầu", characters: [], nextSceneId: "end" }, { id: "end", type: "ending", title: "Kết thúc", characters: [] }] } };
    if (path.endsWith("/scene-schema")) return {};
    if (path.endsWith("/voice")) return { entries: [], pending: 0 };
    if (path.endsWith("/chapters")) return [{ ...draft, code: "CH01" }];
    return [];
  };
  await mount(<StudioWorkspace actor={actor} />, "/internal/editor/CH01");
  await until(() => document.querySelector('textarea[aria-label="Lời thoại"]'), "editor ready");
  const speech = document.querySelector('textarea[aria-label="Lời thoại"]');
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(speech, "Lời thoại đã sửa chưa lưu");
  speech.dispatchEvent(new Event("input", { bubbles: true })); await wait();
  document.querySelector(".scene-editor-back").click();
  await until(() => dialog()?.textContent.includes("Rời trình soạn"), "unsaved draft confirmation");
  assert(dialog().textContent.includes("CH01"), "Unsaved confirmation does not identify the chapter");
  assert(dialog().getBoundingClientRect().width <= 560, "Unsaved confirmation stretches across the screen");
  button("Ở lại chỉnh sửa", dialog()).click(); await wait();
  assert(document.querySelector('textarea[aria-label="Lời thoại"]').value === "Lời thoại đã sửa chưa lưu", "Cancel discarded unsaved changes");
  document.querySelector(".scene-editor-back").click(); await wait();
  button("Bỏ thay đổi và rời đi", dialog()).click();
  await until(() => !document.querySelector(".scene-editor-back") && !dialog(), "returned to chapter list");
  results.push("Leaving the editor asks in-app; cancel preserves edits and confirmation returns to the chapter list");
  const assertPopupSize = () => {
    const panel = document.querySelector('[data-dialog-layout="popup"]');
    const style = getComputedStyle(panel);
    assert(Math.abs(parseFloat(style.width) - standardWidth) < 1, "Popup width differs from teacher question deletion");
    assert(parseFloat(style.maxHeight) <= innerHeight - 32, "Popup exceeds available viewport height");
    assert(panel.scrollWidth <= panel.clientWidth + 1, "Popup content overflows horizontally");
    return panel;
  };
  await mount(<StudioDialog title="Chấm Đạt cho Chương 1" onClose={() => {}} wide>
    <form className="sp-dialog-body"><p>Chương sẽ vào hàng chờ phát hành.</p><textarea aria-label="Nhận xét" />
      {Array.from({ length: 40 }, (_, index) => <p key={index}>Nội dung nhận xét chương {index + 1}</p>)}
      <button type="button">Chấm Đạt</button>
    </form>
  </StudioDialog>);
  const approval = assertPopupSize();
  approval.scrollTop = approval.scrollHeight;
  assert(approval.scrollTop > 0, "Long approval popup cannot scroll to its actions");
  await mount(<Dialog open><DialogContent className="ws-modal ws-question-set-modal" aria-describedby={undefined}>
    <DialogTitle>Popup bộ câu hỏi</DialogTitle><p>Kiểm tra kích thước dùng chung.</p>
  </DialogContent></Dialog>);
  assertPopupSize();
  results.push("Studio approval and workspace popups match teacher delete confirmation width; long content scrolls within the viewport");
  assert(nativeCalls === 0, "A native browser dialog was used");
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message, results });
}
