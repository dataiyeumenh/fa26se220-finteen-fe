import assert from "node:assert/strict";
import test from "node:test";
import {
  createNotificationsApi,
  notificationTarget,
} from "../src/features/workspace/api/notificationsApi.js";

test("notification API uses ACCOUNT requests and the deployed contract", async () => {
  const calls = [];
  const client = {
    accountRequest(path, options) {
      calls.push({ path, options });
      return Promise.resolve({});
    },
  };
  const api = createNotificationsApi(client);
  await api.list({ page: 2, size: 30, unreadOnly: true });
  await api.unreadCount();
  await api.markRead("notice/id");
  await api.markAllRead();
  assert.deepEqual(calls, [
    { path: "/api/notifications?page=2&size=30&unreadOnly=true", options: undefined },
    { path: "/api/notifications/unread-count", options: undefined },
    { path: "/api/notifications/notice%2Fid/read", options: { method: "PATCH" } },
    { path: "/api/notifications/read-all", options: { method: "PATCH" } },
  ]);
});

test("notification actions map only to supported dashboard destinations", () => {
  assert.equal(notificationTarget({ type: "OPEN_LEARNER_REPORT", resourceId: "slot/id" }), "/dashboard/learners/slot%2Fid");
  assert.equal(notificationTarget({ type: "OPEN_LEARNER_LIST", resourceId: "group/id" }), "/dashboard/groups?group=group%2Fid");
  assert.equal(notificationTarget({ type: "OPEN_GROUP_REPORT", resourceId: "group/id" }), "/dashboard/reports?group=group%2Fid");
  assert.equal(notificationTarget({ type: "OPEN_QUIZ_RESULTS", resourceId: "quiz/id" }), "/dashboard/quiz-management?quiz=quiz%2Fid");
  assert.equal(notificationTarget({ type: "UNKNOWN", resourceId: "id" }), null);
  assert.equal(notificationTarget(null), null);
});
