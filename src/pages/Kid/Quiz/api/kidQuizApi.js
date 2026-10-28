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
};
