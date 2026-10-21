// Chapter-local progress on this browser; no account or payment credentials are stored.
export const progressKey = (data) => `finteen:vn:${data.id}`;
const legacyProgressKey = (data) => `${progressKey(data)}:${data.version}`;
export function readNovelProgress(storage, data) {
  try {
    const saved = JSON.parse(
      storage.getItem(progressKey(data)) ||
        storage.getItem(legacyProgressKey(data)),
    );
    if (!saved || !Array.isArray(saved.scenePath) || !saved.scenePath.length)
      return null;
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
    return { ...saved, version: data.version, scenePath };
  } catch {
    return null;
  }
}
export function saveNovelProgress(storage, data, snapshot) {
  try {
    storage.setItem(
      progressKey(data),
      JSON.stringify({
        ...snapshot,
        version: data.version,
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
function clearChapterStorage(storage, data) {
  if (!storage) return;
  try {
    const prefix = `${progressKey(data)}:`;
    const keys = [progressKey(data), legacyProgressKey(data)];
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (key?.startsWith(prefix)) keys.push(key);
    }
    keys.forEach((key) => storage.removeItem(key));
  } catch {
    /* Other chapters remain untouched even if storage is unavailable. */
  }
}
export function loadBrowserNovelProgress(data) {
  const local = browserStorage("localStorage");
  const current = readNovelProgress(local, data);
  if (current) return current;
  const session = browserStorage("sessionStorage");
  const previous = readNovelProgress(session, data);
  if (previous && saveNovelProgress(local, data, previous))
    clearChapterStorage(session, data);
  return previous;
}
export function saveBrowserNovelProgress(data, snapshot) {
  if (!saveNovelProgress(browserStorage("localStorage"), data, snapshot)) {
    saveNovelProgress(browserStorage("sessionStorage"), data, snapshot);
  }
}
export function clearBrowserNovelProgress(data) {
  clearChapterStorage(browserStorage("localStorage"), data);
  clearChapterStorage(browserStorage("sessionStorage"), data);
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
