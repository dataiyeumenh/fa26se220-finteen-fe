import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const contracts = [
  [
    "src/pages/Admin/Dashboard/hooks/useAdminDashboard.js",
    "src/pages/Admin/Dashboard/api/adminDashboardApi.js",
  ],
  [
    "src/pages/Kid/Quiz/hooks/useKidQuizzes.js",
    "src/pages/Kid/Quiz/api/kidQuizApi.js",
  ],
  [
    "src/pages/LearnerReport/hooks/useLearnerReport.js",
    "src/pages/LearnerReport/api/learnerReportApi.js",
  ],
  [
    "src/pages/Parent/Dashboard/hooks/useParentDashboard.js",
    "src/pages/Parent/Dashboard/api/parentDashboardApi.js",
  ],
  [
    "src/pages/Parent/Learners/hooks/useParentLearners.js",
    "src/pages/Parent/Learners/api/parentLearnersApi.js",
  ],
  [
    "src/pages/Parent/Reports/hooks/useParentReports.js",
    "src/pages/Parent/Reports/api/parentReportsApi.js",
  ],
  [
    "src/pages/Teacher/Dashboard/hooks/useTeacherDashboard.js",
    "src/pages/Teacher/Dashboard/api/teacherDashboardApi.js",
  ],
  [
    "src/pages/Teacher/Groups/hooks/useTeacherGroups.js",
    "src/pages/Teacher/Groups/api/teacherGroupsApi.js",
  ],
  [
    "src/pages/Teacher/Quiz/hooks/useTeacherQuizzes.js",
    "src/pages/Teacher/Quiz/api/teacherQuizApi.js",
  ],
  [
    "src/pages/Teacher/Reports/hooks/useTeacherReports.js",
    "src/pages/Teacher/Reports/api/teacherReportsApi.js",
  ],
];

const matches = (source, pattern) =>
  new Set([...source.matchAll(pattern)].map((match) => match[1]));

test("every page hook API call exists in its local API module", async () => {
  for (const [hookPath, apiPath] of contracts) {
    const [hook, api] = await Promise.all([
      readFile(hookPath, "utf8"),
      readFile(apiPath, "utf8"),
    ]);
    const calls = matches(hook, /\bauth\.([A-Za-z][A-Za-z0-9]*)\s*\(/g);
    const methods = matches(api, /^\s{2}([A-Za-z][A-Za-z0-9]*):/gm);
    const missing = [...calls].filter((method) => !methods.has(method));
    assert.deepEqual(missing, [], `${hookPath} thiếu API trong ${apiPath}`);
  }
});
