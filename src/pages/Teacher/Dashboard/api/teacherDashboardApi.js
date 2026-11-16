import { auth } from "@/api/auth.api";
import { teacherQuizApi } from "../../Quiz/api/teacherQuizApi";

export const teacherDashboardApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  getGroupReport: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/report`),
  listQuizzes: (groupId) => teacherQuizApi.listQuizzes(groupId),
};
