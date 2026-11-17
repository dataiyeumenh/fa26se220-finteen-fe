import { auth } from "../../../../api/auth.api.js";

export const createParentReportsApi = (client) => ({
  listGroups: () => client.accountRequest("/api/groups"),
  getGroupReport: (groupId) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/report`),
  setPostTest: (groupId, enabled) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/post-test`, {
      body: { enabled: Boolean(enabled) },
    }),
});

export const parentReportsApi = createParentReportsApi(auth);
