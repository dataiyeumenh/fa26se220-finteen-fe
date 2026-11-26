import { auth } from "@/api/auth.api";

export const teacherReportsApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  getGroupReport: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/report`),
  getChapterReport: (groupId, chapterNumber) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/reports/chapters/${encodeURIComponent(chapterNumber)}`),
  getCourseReport: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/reports/course`),
};
