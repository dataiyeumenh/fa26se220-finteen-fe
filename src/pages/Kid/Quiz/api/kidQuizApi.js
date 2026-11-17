import { auth } from "@/api/auth.api";

export const kidQuizApi = {
  listLearnerQuizzes: () => auth.slotRequest("/api/learner/quizzes"),
  getLearnerQuiz: (quizId) =>
    auth.slotRequest(`/api/learner/quizzes/${encodeURIComponent(quizId)}`),
  submitLearnerQuiz: (quizId, answers) =>
    auth.slotRequest(
      `/api/learner/quizzes/${encodeURIComponent(quizId)}/submit`,
      { body: { answers } },
    ),
  startAttempt: (quizId) =>
    auth.slotRequest(`/api/learner/quizzes/${encodeURIComponent(quizId)}/attempts`, {
      method: "POST",
    }),
  getAttempt: (attemptId) =>
    auth.slotRequest(`/api/learner/attempts/${encodeURIComponent(attemptId)}`),
  saveAttemptAnswer: (attemptId, position, choice, leaveCount) =>
    auth.slotRequest(`/api/learner/attempts/${encodeURIComponent(attemptId)}/answers/${position}`, {
      method: "PUT",
      body: { choice, leaveCount },
    }),
  submitAttempt: (attemptId, leaveCount) =>
    auth.slotRequest(`/api/learner/attempts/${encodeURIComponent(attemptId)}/submit`, {
      method: "POST",
      body: { leaveCount },
    }),
};
