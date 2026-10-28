import { auth } from "@/api/auth.api";

export const teacherQuizApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  listQuestions: (filters = {}) => {
    const query = new URLSearchParams();
    ["standard", "concept", "pool", "q"].forEach((key) => {
      const value = String(filters[key] || "").trim();
      if (value) query.set(key, value);
    });
    return auth.accountRequest(
      `/api/questions${query.size ? `?${query}` : ""}`,
    );
  },
  listQuizzes: (groupId) =>
    auth.accountRequest(`/api/quizzes?groupId=${encodeURIComponent(groupId)}`),
  getQuiz: (quizId) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}`),
  publishQuiz: (quizId) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}/publish`, {
      method: "POST",
    }),
  deleteQuiz: (quizId) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}`, {
      method: "DELETE",
    }),
  createQuiz: ({ groupId, title, questionIds, dueAt }) =>
    auth.accountRequest("/api/quizzes", {
      body: { groupId, title: title.trim(), questionIds, dueAt },
    }),
  updateQuiz: (quizId, { title, questionIds, dueAt }) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}`, {
      method: "PUT",
      body: { title: title.trim(), questionIds, dueAt },
    }),
  getQuizResults: (quizId) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}/results`),
  getQuizSlotResult: (quizId, slotId) =>
    auth.accountRequest(
      `/api/quizzes/${encodeURIComponent(quizId)}/results/${encodeURIComponent(slotId)}`,
    ),
};
