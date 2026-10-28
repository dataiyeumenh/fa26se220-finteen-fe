import { auth } from "../../../api/auth.api.js";

export const createLearnerReportApi = (client) => ({
  getSlotReport: (slotId) =>
    client.accountRequest(`/api/slots/${encodeURIComponent(slotId)}/report`),
});

export const learnerReportApi = createLearnerReportApi(auth);
