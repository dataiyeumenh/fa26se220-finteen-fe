import { auth } from "@/api/auth.api";

export const parentDashboardApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  getGroupReport: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/report`),
};
