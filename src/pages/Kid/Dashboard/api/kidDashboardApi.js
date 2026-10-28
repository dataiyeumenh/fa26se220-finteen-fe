import { auth } from "@/api/auth.api";

export const kidDashboardApi = {
  getPlayState: () => auth.slotRequest("/api/play/state"),
  submitChapterBatch: (batch) =>
    auth.slotRequest("/api/play/chapter", { body: batch }),
};
