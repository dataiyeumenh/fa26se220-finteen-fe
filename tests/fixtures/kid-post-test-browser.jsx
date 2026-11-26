import { createRoot } from "react-dom/client";
import GameMap from "/src/pages/Kid/Dashboard/components/GameMapReal.jsx";
import "/src/index.css";

const root = createRoot(document.getElementById("root"));
const wait = () => new Promise(resolve => setTimeout(resolve, 60));
const assert = (value, message) => { if (!value) throw new Error(message); };
const results = [];
let selected;
const chapters = (required) => Array.from({ length: 8 }, (_, index) => ({
  id: index + 1, title: `Chương ${index + 1}`, subtitle: "Bài học tài chính",
  status: index < 2 ? "completed" : index === 2 && !required ? "current" : "locked",
  lockReason: index === 2 && required ? "post-test" : null,
  postTestRequired: required ? { chapter: 2, quizId: "post-test-two" } : null,
  progress: index < 2 ? 100 : 0, lessonsCompleted: index < 2 ? 1 : 0, totalLessons: 1,
}));

try {
  root.render(<GameMap chapters={chapters(true)} onChapterClick={chapter => { selected = chapter; }} />);
  await wait();
  const resume = document.querySelector(".atlas-resume");
  assert(resume.textContent.includes("Làm hậu trắc chương 2"), "Resume must name the required post-test");
  resume.click();
  assert(selected?.postTestRequired?.quizId === "post-test-two" && selected.lockReason === "post-test", "Resume does not target the pending quiz");
  const blocked = document.querySelector(".atlas-stop.locked");
  assert(!blocked.disabled, "Child cannot open the required post-test from the locked chapter");
  selected = null;
  blocked.click();
  assert(selected?.id === 3 && selected?.postTestRequired?.chapter === 2, "Locked chapter does not offer its prerequisite post-test");
  assert(document.querySelectorAll(".atlas-stop.locked")[1].disabled, "Later chapters were incorrectly unlocked");
  results.push("Pending post-test is named and actionable without unlocking later chapters");
  root.render(<GameMap chapters={chapters(false)} onChapterClick={chapter => { selected = chapter; }} />);
  await wait();
  assert(document.querySelector(".atlas-resume").textContent.includes("Tiếp tục chương 3"), "Resume did not restore chapter 3 after post-test completion");
  results.push("Chapter 3 resumes normally after the post-test requirement is cleared");
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "PASS", results });
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", '<pre id="production-result"></pre>');
  document.getElementById("production-result").textContent = JSON.stringify({ status: "FAIL", error: error.message, results });
}
