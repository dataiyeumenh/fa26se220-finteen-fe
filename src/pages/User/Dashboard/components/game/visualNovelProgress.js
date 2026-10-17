// Tab-local progress; no account information or credit data is stored.
export const progressKey = data => `finteen:vn:${data.id}:${data.version}`;
export function readNovelProgress(storage, data) {
  if (!data.metadata?.persistProgress) return null;
  try {
    const saved = JSON.parse(storage.getItem(progressKey(data)));
    if (!saved || saved.version !== data.version || !Array.isArray(saved.scenePath) || !saved.scenePath.length ||
      !saved.scenePath.every(i => Number.isInteger(i) && i >= 0 && i < data.scenes.length)) return null;
    const maps = ['stats', 'flags', 'choiceLedger', 'firstChoiceScores', 'inspectedIds', 'moneyEventsApplied', 'budgetAllocations', 'miniGameResults', 'miniGameDoneByScene', 'sceneActionApplied'];
    if (!maps.every(key => saved[key] && typeof saved[key] === 'object' && !Array.isArray(saved[key]))) return null;
    if (!Number.isFinite(saved.money) || !Object.values(saved.stats).every(Number.isFinite) || !Array.isArray(saved.committedDecisions)) return null;
    return saved;
  } catch { return null; }
}
export function saveNovelProgress(storage, data, snapshot) {
  if (!data.metadata?.persistProgress) return;
  try { storage.setItem(progressKey(data), JSON.stringify({ ...snapshot, version: data.version })); }
  catch { /* Storage can be disabled or full; the current run remains playable. */ }
}
