import test from "node:test";
import assert from "node:assert/strict";
import { loadTeacherDashboard } from "../src/pages/Teacher/Dashboard/api/loadTeacherDashboard.js";

const groups = [
  { id: "closed", context: "CLASS", closedAt: "2026-11-01" },
  { id: "family", context: "FAMILY" },
  { id: "open", context: "CLASS", closedAt: null },
];
const reports = {
  closed: { group: groups[0], summary: { learners: 12 } },
  open: { group: groups[2], summary: { learners: 25 } },
};
const api = {
  listGroups: async () => groups,
  getGroupReport: async (id) => reports[id],
  listQuizzes: async (id) => id === "open"
    ? [{ id: "draft" }, { id: "published", publishedAt: "2026-11-10" }, { id: "shared" }]
    : [{ id: "imported-quiz", source: "mock" }, { id: "shared" }],
};

test("teacher dashboard aggregates every class and uses an open class for the detailed report", async () => {
  const requested = [];
  const dashboard = await loadTeacherDashboard({ ...api, getGroupReport: async (id) => { requested.push(id); return reports[id]; } });
  assert.equal(dashboard.groupCount, 2);
  assert.equal(dashboard.activeGroupCount, 1);
  assert.equal(dashboard.studentCount, 37);
  assert.equal(dashboard.quizCount, 4);
  assert.equal(dashboard.group.id, "open");
  assert.equal(dashboard.report, reports.open);
  assert.deepEqual(requested.sort(), ["closed", "open"]);
  assert.equal(dashboard.warning, "");
});

test("no classes yields three real zeros and does not request reports or quizzes", async () => {
  const unexpected = async () => { throw new Error("Should not request a class"); };
  const dashboard = await loadTeacherDashboard({ listGroups: async () => [groups[1]], getGroupReport: unexpected, listQuizzes: unexpected });
  assert.equal(dashboard.groupCount, 0);
  assert.equal(dashboard.studentCount, 0);
  assert.equal(dashboard.quizCount, 0);
  assert.equal(dashboard.group, null);
  assert.equal(dashboard.warning, "");
});

test("a missing class report does not present a partial student count as the total", async () => {
  const dashboard = await loadTeacherDashboard({ ...api, getGroupReport: async (id) => {
    if (id === "closed") throw new Error("Unavailable");
    return reports[id];
  } });
  assert.equal(dashboard.studentCount, null);
  assert.equal(dashboard.quizCount, 4);
  assert.equal(dashboard.report, reports.open);
  assert.match(dashboard.warning, /Chưa tải đầy đủ số học sinh/);
});

test("failed quiz requests keep student totals available and mark the quiz count unavailable", async () => {
  const dashboard = await loadTeacherDashboard({ ...api, listQuizzes: async () => { throw new Error("Unavailable"); } });
  assert.equal(dashboard.studentCount, 37);
  assert.equal(dashboard.quizCount, null);
  assert.match(dashboard.warning, /Chưa tải đầy đủ số bài quiz/);
});

test("invalid summary data is not displayed as zero students", async () => {
  const dashboard = await loadTeacherDashboard({ ...api, getGroupReport: async () => ({ summary: {} }) });
  assert.equal(dashboard.studentCount, null);
  assert.match(dashboard.warning, /Chưa tải đầy đủ/);
});

test("failure to list classes is surfaced to the dashboard", async () => {
  await assert.rejects(loadTeacherDashboard({ ...api, listGroups: async () => { throw new Error("Offline"); } }), /Offline/);
});
