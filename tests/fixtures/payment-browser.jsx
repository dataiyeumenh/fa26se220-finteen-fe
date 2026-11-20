import { createRoot } from "react-dom/client";
import PaymentResult from "/src/features/workspace/PaymentResult.jsx";
import { workspaceApi } from "/src/features/workspace/api/workspaceApi.js";
import { auth } from "/src/api/auth.api.js";
import "/src/index.css";

const root = createRoot(document.getElementById("root"));
const results = [], errors = [];
const realTimeout = window.setTimeout.bind(window);
const realClearTimeout = window.clearTimeout.bind(window);
const realInterval = window.setInterval.bind(window);
const realClearInterval = window.clearInterval.bind(window);
const realNow = Date.now;
let time = Date.parse("2026-11-15T00:00:00Z"), sequence = 1000000, mountId = 0, requests = 0;
const timers = new Map(), intervals = new Map();
const wait = () => new Promise((resolve) => realTimeout(resolve, 40));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) => errors.push(String(event.reason)));
Date.now = () => time;
window.setTimeout = (callback, delay, ...args) => {
  if (delay !== 2500) return realTimeout(callback, delay, ...args);
  const id = ++sequence;
  timers.set(id, { callback, due: time + delay });
  return id;
};
window.clearTimeout = (id) => { if (!timers.delete(id)) realClearTimeout(id); };
window.setInterval = (callback, delay, ...args) => {
  if (delay !== 1000) return realInterval(callback, delay, ...args);
  const id = ++sequence;
  intervals.set(id, callback);
  return id;
};
window.clearInterval = (id) => { if (!intervals.delete(id)) realClearInterval(id); };
let reply = async () => ({ status: "PENDING" });
workspaceApi.getPayment = async () => { requests++; return reply(); };
let cancellations = 0;
workspaceApi.cancelPayment = async () => { cancellations++; return {}; };
let refreshed = 0, entitlements = 0;
auth.refresh = async () => { refreshed++; };
auth.ensureEntitlements = async () => { entitlements++; return []; };
const advance = async (ms) => {
  time += ms;
  for (const callback of [...intervals.values()]) callback();
  for (const [id, timer] of [...timers]) {
    if (timer.due <= time) { timers.delete(id); void timer.callback(); }
  }
  await wait();
};
async function mount(extra = {}) {
  root.render(<div />);
  await wait();
  requests = 0;
  reply = async () => ({ status: "PENDING" });
  root.render(<PaymentResult key={++mountId} payment={{ orderCode: `TEST-${mountId}`, amount: 10000, status: "PENDING", expiresAt: new Date(time + 3600000).toISOString(), ...extra }} onClose={() => {}} />);
  await wait();
}
const manualCheck = () => [...document.querySelectorAll("button")].find((button) => button.textContent.includes("Kiểm tra ngay"));

try {
  await mount({ expiresAt: new Date(time - 1).toISOString() });
  await advance(10000);
  assert(requests === 0, "Expired payment was polled");
  assert(document.querySelector("#root").textContent.includes("Mã thanh toán đã hết hạn"), "Expiry explanation missing");
  manualCheck().click(); await wait();
  assert(requests === 1, "Expired order cannot be checked manually");
  await advance(10000);
  assert(requests === 1, "Manual check restarted expired polling");
  results.push("Already expired orders stop polling while manual reconciliation remains available");

  await mount({ expiresAt: new Date(time + 3000).toISOString() });
  await advance(2500);
  assert(requests === 1, "Pending order was not polled");
  await advance(1000); await advance(10000);
  assert(requests === 1, "Polling continued beyond expiresAt");
  results.push("Polling stops when a pending order reaches expiresAt");

  await mount();
  reply = async () => { throw new Error("Simulated payment API outage"); };
  for (let i = 0; i < 3; i++) await advance(2500);
  assert(requests === 3, "Expected three consecutive failures");
  await advance(10000);
  assert(requests === 3, "Polling did not stop after three failures");
  assert(document.querySelector("#root").textContent.includes("Đã tạm dừng tự động kiểm tra"), "Paused explanation missing");
  reply = async () => ({ status: "PENDING" });
  manualCheck().click(); await wait();
  assert(requests === 4, "Manual retry did not run");
  await advance(2500);
  assert(requests === 5, "Successful manual retry did not resume pending polling");
  reply = async () => { throw new Error("Simulated payment API outage"); };
  await advance(2500); await advance(2500);
  assert(!document.querySelector("#root").textContent.includes("Đã tạm dừng tự động kiểm tra"), "Successful check did not reset failure count");
  results.push("Three failures pause polling; successful manual retry resumes and resets failure count");

  for (const status of ["PAID", "FAILED"]) {
    await mount({ status }); await advance(10000);
    assert(requests === 0, `${status} initial order was polled`);
  }
  await mount();
  reply = async () => ({ status: "PAID" });
  await advance(2500); await advance(10000);
  assert(requests === 1 && refreshed === 1 && entitlements === 1, "Paid result did not stop polling and refresh account");
  assert(document.querySelector("#root").textContent.includes("Thanh toán thành công"), "Paid UI missing");
  results.push("Terminal orders never poll; a PAID response stops polling and refreshes account entitlements");

  await mount(); await advance(2500);
  [...document.querySelectorAll("button")].find((button) => button.textContent.includes("Hủy giao dịch")).click();
  await wait();
  const cancelDialog = document.querySelector('[role="alertdialog"]');
  assert(cancelDialog, "Payment cancellation must ask for confirmation in the app");
  [...cancelDialog.querySelectorAll("button")].find((button) => button.textContent.includes("Hủy giao dịch")).click();
  await wait(); await advance(10000);
  assert(requests === 1 && document.querySelector("#root").textContent.includes("Giao dịch chưa thành công"), "Cancellation did not stop polling");
  results.push("Successful cancellation stops pending polling");

  await mount();
  const previousCancellations = cancellations;
  [...document.querySelectorAll("button")].find((button) => button.textContent.includes("Hủy giao dịch")).click();
  await wait();
  assert(document.querySelector('[role="alertdialog"]'), "Cancel confirmation did not open");
  reply = async () => ({ status: "PAID" });
  await advance(2500);
  assert(!document.querySelector('[role="alertdialog"]') && document.querySelector("#root").textContent.includes("Thanh toán thành công"), "Paid status did not replace the cancellation confirmation");
  assert(cancellations === previousCancellations, "Order was cancelled without confirmation after payment");
  results.push("Payment success dismisses an open cancellation popup without cancelling the paid order");

  await mount();
  let resolveRequest;
  reply = () => new Promise((resolve) => { resolveRequest = resolve; });
  await advance(2500); await advance(2500);
  assert(requests === 1, "Automatic requests overlap");
  assert([...document.querySelectorAll("button")].some((button) => button.disabled && button.textContent.includes("Đang kiểm tra")), "Manual check was not disabled during an in-flight request");
  root.render(<div>Closed</div>); await wait();
  resolveRequest({ status: "PENDING" }); await wait(); await advance(10000);
  assert(requests === 1 && timers.size === 0, "Closed payment scheduled another request");
  results.push("In-flight requests do not overlap; unmount prevents another poll");
  assert(errors.length === 0, errors.join("; "));
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", results, error: error.message, errors });
} finally {
  Date.now = realNow;
  window.setTimeout = realTimeout; window.clearTimeout = realClearTimeout;
  window.setInterval = realInterval; window.clearInterval = realClearInterval;
  timers.clear(); intervals.clear();
}
