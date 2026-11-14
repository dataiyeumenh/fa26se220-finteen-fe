// Never adopt old chapter-only checkpoints: their owner cannot be established.
export const novelProgressOwner = (actor) => {
  if (!actor?.id) return null;
  return `${actor.role === "kid" ? "slot" : "account"}:${actor.id}`;
};
export const progressKey = (data, owner) => owner
  ? `finteen:vn:v2:${encodeURIComponent(owner)}:${encodeURIComponent(data.id)}`
  : null;
const legacyProgressKey = (data, owner) => `${progressKey(data, owner)}:${data.version}`;
export function readNovelProgress(storage, data, owner) {
  if (!owner) return null;
  try {
    const saved = JSON.parse(
      storage.getItem(progressKey(data, owner)) ||
        storage.getItem(legacyProgressKey(data, owner)),
    );
    if (!saved || !Array.isArray(saved.scenePath) || !saved.scenePath.length)
      return null;
    // Backend variants preserve scene IDs, scoring and structure. Resume decisions
    // against the newly loaded text/images instead of discarding progress.
    let scenePath = saved.scenePath;
    if (saved.sceneIds) {
      if (
        !Array.isArray(saved.sceneIds) ||
        saved.sceneIds.length !== scenePath.length
      )
        return null;
      const indices = new Map(
        data.scenes.map((scene, index) => [scene.id, index]),
      );
      scenePath = saved.sceneIds.map((id) => indices.get(id));
    } else if (saved.version !== data.version) return null;
    if (
      !scenePath.every(
        (i) => Number.isInteger(i) && i >= 0 && i < data.scenes.length,
      )
    )
      return null;
    const maps = [
      "stats",
      "flags",
      "choiceLedger",
      "firstChoiceScores",
      "inspectedIds",
      "moneyEventsApplied",
      "budgetAllocations",
      "miniGameResults",
      "miniGameDoneByScene",
      "sceneActionApplied",
    ];
    if (
      !maps.every(
        (key) =>
          saved[key] &&
          typeof saved[key] === "object" &&
          !Array.isArray(saved[key]),
      )
    )
      return null;
    if (
      !Number.isFinite(saved.money) ||
      !Object.values(saved.stats).every(Number.isFinite) ||
      !Array.isArray(saved.committedDecisions)
    )
      return null;
    return {
      ...saved,
      version: data.version,
      ...(data.variantKey != null ? { variantKey: data.variantKey } : {}),
      scenePath,
    };
  } catch {
    return null;
  }
}
export function saveNovelProgress(storage, data, snapshot, owner) {
  if (!owner) return false;
  try {
    storage.setItem(
      progressKey(data, owner),
      JSON.stringify({
        ...snapshot,
        version: data.version,
        ...(data.variantKey != null ? { variantKey: data.variantKey } : {}),
        sceneIds: snapshot.scenePath.map((index) => data.scenes[index].id),
      }),
    );
    return true;
  } catch {
    return false;
  }
}

function browserStorage(name) {
  try {
    return window[name];
  } catch {
    return null;
  }
}
function clearChapterStorage(storage, data, owner) {
  if (!storage || !owner) return;
  try {
    const prefix = `${progressKey(data, owner)}:`;
    const keys = [progressKey(data, owner), legacyProgressKey(data, owner)];
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (key?.startsWith(prefix)) keys.push(key);
    }
    keys.forEach((key) => storage.removeItem(key));
  } catch {
    /* Other chapters remain untouched even if storage is unavailable. */
  }
}
export function loadBrowserNovelProgress(data, owner) {
  const local = browserStorage("localStorage");
  const current = readNovelProgress(local, data, owner);
  if (current) return current;
  const session = browserStorage("sessionStorage");
  const previous = readNovelProgress(session, data, owner);
  if (previous && saveNovelProgress(local, data, previous, owner))
    clearChapterStorage(session, data, owner);
  return previous;
}
export function saveBrowserNovelProgress(data, snapshot, owner) {
  if (!saveNovelProgress(browserStorage("localStorage"), data, snapshot, owner)) {
    saveNovelProgress(browserStorage("sessionStorage"), data, snapshot, owner);
  }
}
export function clearBrowserNovelProgress(data, owner) {
  clearChapterStorage(browserStorage("localStorage"), data, owner);
  clearChapterStorage(browserStorage("sessionStorage"), data, owner);
}
export function initialNovelProgress(data, sceneIndex = 0) {
  return {
    scenePath: [sceneIndex],
    miniGameDoneByScene: {},
    sceneActionApplied: {},
    stats: { ...data.initialStats },
    gameFlag: null,
    flags: {},
    choiceLedger: {},
    firstChoiceScores: {},
    inspectedIds: {},
    moneyEventsApplied: {},
    budgetAllocations: {},
    miniGameCompleted: false,
    miniGameResults: {},
    money: data.initialMoney || 0,
    committedDecisions: [],
  };
}
