export function createPersonalizationApi(auth) {
  const slotPath = (id) => `/api/slots/${encodeURIComponent(id)}/personalization`;
  return {
    getForParent: (id) => auth.accountRequest(slotPath(id)),
    saveForParent: (id, answers) => auth.accountRequest(slotPath(id), { method: "PUT", body: answers }),
    getForChild: () => auth.slotRequest("/api/play/personalization"),
    saveForChild: (source, answers) => auth.slotRequest("/api/play/personalization", {
      method: "PUT", body: { source, answers },
    }),
    chapterForChild: (version, code) => auth.slotRequest(
      `/api/play/releases/${encodeURIComponent(version)}/chapters/${encodeURIComponent(code)}`,
    ),
  };
}
