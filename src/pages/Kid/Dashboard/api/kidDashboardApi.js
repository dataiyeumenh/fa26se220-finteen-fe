import { auth } from "@/api/auth.api";

export const kidDashboardApi = {
  getSnapshot: () => auth.getSnapshot(),
  getPlayState: () => auth.slotRequest("/api/play/state"),
  submitChapterBatch: (batch) =>
    auth.slotRequest("/api/play/chapter", { body: batch }),
};
