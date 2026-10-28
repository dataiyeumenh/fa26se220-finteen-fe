import { auth } from "../../../../api/auth.api.js";

export const createParentReportsApi = (client) => ({
  listGroups: () => client.accountRequest("/api/groups"),
  getGroupReport: (groupId) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/report`),
});

export const parentReportsApi = createParentReportsApi(auth);
