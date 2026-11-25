import { auth } from "../../../api/auth.api.js";

export const createLearnerReportApi = (client) => ({
  getSlotReport: (slotId) =>
    client.accountRequest(`/api/slots/${encodeURIComponent(slotId)}/report`),
  getQuizResult: (quizId, slotId) =>
    client.accountRequest(`/api/quizzes/${encodeURIComponent(quizId)}/results/${encodeURIComponent(slotId)}`),
});

export const learnerReportApi = createLearnerReportApi(auth);
