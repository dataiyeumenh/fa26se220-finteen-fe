import { auth } from "@/api/auth.api";

export const parentDashboardApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  getQuota: () => auth.accountRequest("/api/me/quota"),
  getGroupReport: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/report`),
};
