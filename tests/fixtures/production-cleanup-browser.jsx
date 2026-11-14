import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "/src/components/feedback/ErrorBoundary.jsx";
import "/src/styles/scrollbars.css";

const root = createRoot(document.getElementById("root"), { onCaughtError() {} });
const results = [];
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(condition, message) {
  for (let i = 0; i < 150; i++) {
    if (condition()) return;
    await wait();
  }
  throw new Error(message);
}
export function Crash() { throw new Error("Intentional PR3 render failure"); }

try {
  const previous = sessionStorage.getItem("pr3:reload-check");
  if (previous) {
    sessionStorage.removeItem("pr3:reload-check");
    results.push(...JSON.parse(previous));
    assert(performance.getEntriesByType("navigation")[0]?.type === "reload", "Reload button did not reload the page");
    root.render(<ErrorBoundary><p id="recovered">Recovered after reload</p></ErrorBoundary>);
    await until(() => document.getElementById("recovered"), "Healthy content did not recover");
    results.push("Reload button performs a page reload and healthy content recovers");
    document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
  } else {
    root.render(<ErrorBoundary key="root-crash"><Crash /></ErrorBoundary>);
    await until(() => document.querySelector('[role="alert"]'), "Root render failure left a blank page");
    assert(document.querySelector("h1")?.textContent === "Trang gặp sự cố", "Root fallback heading missing");
    assert(document.querySelector("button")?.textContent === "Tải lại", "Root fallback reload action missing");
    results.push("Root render failure shows accessible recovery UI");

    root.render(<ErrorBoundary key="nested-crash">
      <header id="shell">Navigation remains available</header>
      <ErrorBoundary title="Không thể hiển thị chương này"><Crash /></ErrorBoundary>
      <p id="sibling">Other page content remains available</p>
    </ErrorBoundary>);
    await until(() => document.getElementById("shell"), "Player failure removed the app shell");
    assert(document.getElementById("sibling"), "Player failure removed sibling content");
    assert(document.querySelector("h1")?.textContent === "Không thể hiển thị chương này", "Player fallback missing");
    results.push("Nested player failure is contained without removing navigation or sibling content");

    let finishLoading;
    const DelayedPage = lazy(() => new Promise((resolve) => { finishLoading = resolve; }));
    root.render(<ErrorBoundary key="lazy-load"><Suspense fallback={<p role="status">Loading route</p>}><DelayedPage /></Suspense></ErrorBoundary>);
    await until(() => document.querySelector('[role="status"]'), "Lazy loading fallback missing");
    finishLoading({ default: () => <p id="loaded-page">Loaded route</p> });
    await until(() => document.getElementById("loaded-page"), "Lazy page did not finish loading");
    results.push("Suspense displays loading feedback and renders the resolved lazy page");

    const FailedPage = lazy(() => Promise.reject(new Error("Intentional PR3 chunk failure")));
    root.render(<ErrorBoundary key="lazy-fail"><Suspense fallback={<p role="status">Loading</p>}><FailedPage /></Suspense></ErrorBoundary>);
    await until(() => document.querySelector('[role="alert"]'), "Lazy chunk failure left a blank page");
    results.push("Rejected lazy chunk is caught by the root recovery boundary");
    sessionStorage.setItem("pr3:reload-check", JSON.stringify(results));
    document.querySelector("button").click();
  }
} catch (error) {
  sessionStorage.removeItem("pr3:reload-check");
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", results, error: error.message });
}
