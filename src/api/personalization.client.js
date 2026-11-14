export function createPersonalizationApi(auth) {
  const slotPath = (id) => `/api/slots/${encodeURIComponent(id)}/personalization`;
  let cachedActor = null;
  let cachedView = null;
  async function childRequest(options) {
    const actor = auth.getSnapshot?.().actor;
    const result = await auth.slotRequest("/api/play/personalization", options);
    if (actor?.kind === "learner" && auth.getSnapshot().actor === actor) {
      cachedActor = actor;
      cachedView = result;
    }
    return result;
  }
  return {
    getForParent: (id) => auth.accountRequest(slotPath(id)),
    saveForParent: (id, answers) => auth.accountRequest(slotPath(id), { method: "PUT", body: answers }),
    // Session memory only: a new login/actor or page reload requires a fresh read.
    getCachedForChild: () => {
      const actor = auth.getSnapshot?.().actor;
      return actor?.kind === "learner" && actor === cachedActor ? cachedView : null;
    },
    getForChild: () => childRequest(),
    saveForChild: (source, answers) => childRequest({
      method: "PUT", body: { source, answers },
    }),
    chapterForChild: (version, code) => auth.slotRequest(
      `/api/play/releases/${encodeURIComponent(version)}/chapters/${encodeURIComponent(code)}`,
    ),
  };
}
