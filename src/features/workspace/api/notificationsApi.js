import { auth } from "../../../api/auth.api.js";

export const createNotificationsApi = (client) => ({
  list: ({ page = 0, size = 20, unreadOnly = false } = {}) =>
    client.accountRequest(
      `/api/notifications?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}&unreadOnly=${encodeURIComponent(unreadOnly)}`,
    ),
  unreadCount: () => client.accountRequest("/api/notifications/unread-count"),
  markRead: (id) =>
    client.accountRequest(`/api/notifications/${encodeURIComponent(id)}/read`, {
      method: "PATCH",
    }),
  markAllRead: () =>
    client.accountRequest("/api/notifications/read-all", { method: "PATCH" }),
});

export const notificationsApi = createNotificationsApi(auth);

export function notificationTarget(action) {
  const id = action?.resourceId;
  if (!id) return null;
  const encoded = encodeURIComponent(id);
  return ({
    OPEN_LEARNER_REPORT: `/dashboard/learners/${encoded}`,
    OPEN_LEARNER_LIST: `/dashboard/groups?group=${encoded}`,
    OPEN_GROUP_REPORT: `/dashboard/reports?group=${encoded}`,
    OPEN_QUIZ_RESULTS: `/dashboard/quiz-management?quiz=${encoded}`,
  })[action.type] || null;
}
