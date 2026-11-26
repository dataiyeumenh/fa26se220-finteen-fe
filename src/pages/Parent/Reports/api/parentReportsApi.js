import { auth } from "../../../../api/auth.api.js";

export const createParentReportsApi = (client) => ({
  listGroups: () => client.accountRequest("/api/groups"),
  getGroupReport: (groupId) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/report`),
  getCourseReport: (groupId) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/reports/course`),
  getChapterReport: (groupId, chapterNumber) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/reports/chapters/${encodeURIComponent(chapterNumber)}`),
});

export const parentReportsApi = createParentReportsApi(auth);
