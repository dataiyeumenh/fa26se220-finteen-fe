import { auth } from "@/api/auth.api";

const suffix = (filters = {}) => {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    const normalized = String(value ?? "").trim();
    if (normalized) query.set(key, normalized);
  });
  return query.size ? `?${query}` : "";
};

export const teacherQuizApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  listQuestions: (filters = {}) => auth.accountRequest(`/api/questions${suffix(filters)}`),
  listMyQuestions: (filters = {}) => auth.accountRequest(`/api/questions/mine${suffix(filters)}`),
  createMyQuestions: (questions) => auth.accountRequest("/api/questions/mine", { body: questions }),
  updateMyQuestion: (id, question) => auth.accountRequest(`/api/questions/mine/${encodeURIComponent(id)}`, { method: "PUT", body: question }),
  deleteMyQuestion: (id) => auth.accountRequest(`/api/questions/mine/${encodeURIComponent(id)}`, { method: "DELETE" }),
  copyQuestion: (id) => auth.accountRequest(`/api/questions/${encodeURIComponent(id)}/copy`, { method: "POST" }),
  listQuizzes: (groupId) => auth.accountRequest(`/api/quizzes?groupId=${encodeURIComponent(groupId)}`),
  getQuiz: (quizId) => auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}`),
  publishQuiz: (quizId) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}/publish`, {
      method: "POST",
    }),
  deleteQuiz: (quizId) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}`, {
      method: "DELETE",
    }),
  createQuiz: (payload) =>
    auth.accountRequest("/api/quizzes", {
      body: { ...payload, title: payload.title.trim() },
    }),
  updateQuiz: (quizId, payload) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}`, {
      method: "PUT",
      body: { ...payload, title: payload.title.trim() },
    }),
  getQuizResults: (quizId) =>
    auth.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}/results`),
  getQuizSlotResult: (quizId, slotId) =>
    auth.accountRequest(
      `/api/quizzes/${encodeURIComponent(quizId)}/results/${encodeURIComponent(slotId)}`,
    ),
};
