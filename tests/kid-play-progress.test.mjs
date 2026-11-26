import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import { canPlayJourneyChapter, isJourneyPlayState, journeyChapterProgress, resumeJourneyChapter } from '../src/pages/Kid/Dashboard/api/kidJourneyProgress.js';
import { buildChapterBatch } from '../src/pages/Kid/Dashboard/components/game/playBatch.js';

test('chapter batch keeps first choices, opened information and raw CH05 reflections', () => {
  const data = { metadata: { chapterNumber: 5 }, releaseVersion: 'v5', scenes: [
    { id: 'CH03_DECISION', type: 'choice', options: [{ id: 'A' }, { id: 'B' }] },
    { id: 'CH05_R1', type: 'reflection', activity: 'reflection1' },
    { id: 'CH05_R2', type: 'reflection', activity: 'reflection2' },
  ] };
  const ledger = {
    CH03_DECISION: { optionId: 'B', firstOptionId: 'A', revised: true, chosenAt: '2026-11-26T00:00:00.000Z' },
    CH05_R1: { answer: { selected: ['deadline', 'fees'], method: 'net', accountB: true }, reflectionScore: 6 },
    CH05_R2: { answer: { action: 'keepB', date: 'month1', verified: true }, reflectionEvidenceScores: { I: 2 } },
  };
  const games = {
    one: { completed: true, gameId: 'GAME', inputs: { q1: 'x' }, inspected: ['mini-card'], ui: { inspected: ['mini-card-2'] } },
  };
  const batch = buildChapterBatch(data, ledger, games, { 'story-card': true, closed: false });
  assert.deepEqual(batch.choices, [{ sceneId: 'CH03_DECISION', optionId: 'B', chosenAt: '2026-11-26T00:00:00.000Z', firstOptionId: 'A', revised: true }]);
  assert.deepEqual(batch.inspected, ['story-card', 'mini-card', 'mini-card-2']);
  assert.deepEqual(batch.reflections, [
    { sceneId: 'CH05_R1', answer: { selected: ['deadline', 'fees'], method: 'net' } },
    { sceneId: 'CH05_R2', answer: { action: 'keepB', date: 'month1' } },
  ]);
  assert.equal('reflectionScore' in batch.reflections[0], false);
});

test('empty server progress never completes demo chapters', () => {
  const state = { chaptersDone: [], totalChapters: 8, attemptIndex: 1 };
  assert.equal(journeyChapterProgress(state, 1).status, 'current');
  for (let id = 1; id <= 8; id++) assert.equal(journeyChapterProgress(state, id).progress, 0);
});
test('journey reflects only chapters completed in the server attempt', () => {
  const state = { chaptersDone: [1, 2], totalChapters: 8 };
  assert.equal(journeyChapterProgress(state, 2).status, 'completed');
  assert.equal(journeyChapterProgress(state, 3).status, 'current');
  assert.equal(journeyChapterProgress(state, 3).progress, 0);
  assert.equal(journeyChapterProgress({ chaptersDone: [] }, 2).status, 'locked');
});

test('learners can replay completed chapters and enter only their next chapter', () => {
  const state = { chaptersDone: [1], continueChapter: 2, totalChapters: 8 };
  assert.equal(canPlayJourneyChapter(state, 1), true);
  assert.equal(canPlayJourneyChapter(state, 2), true);
  for (let chapter = 3; chapter <= 8; chapter++) {
    assert.equal(canPlayJourneyChapter(state, chapter), false);
    assert.equal(journeyChapterProgress(state, chapter).status, 'locked');
  }
  assert.equal(journeyChapterProgress(state, 2).status, 'current');
  assert.equal(canPlayJourneyChapter({ ...state, chaptersDone: [1, 2], continueChapter: 3 }, 3), true);
  assert.equal(canPlayJourneyChapter(state, 0), false);
  assert.equal(canPlayJourneyChapter(state, 9), false);
  assert.equal(canPlayJourneyChapter(state, 1.5), false);
});

test('missing or invalid play state cannot unlock a chapter while progress is loading or failed', () => {
  for (const state of [null, undefined, {}, { chaptersDone: null }, { chaptersDone: [0] }, { chaptersDone: [9], totalChapters: 8 }, { chaptersDone: [], totalChapters: Infinity }]) {
    assert.equal(isJourneyPlayState(state), false);
    assert.equal(canPlayJourneyChapter(state, 1), false);
    assert.equal(canPlayJourneyChapter(state, 8), false);
    assert.equal(journeyChapterProgress(state, 1).status, 'locked');
  }
  assert.equal(journeyChapterProgress(null, 1).status, 'locked');
});

test('a continuation pointer cannot bypass unfinished earlier chapters', () => {
  assert.equal(canPlayJourneyChapter({ chaptersDone: [1], continueChapter: 8, totalChapters: 8 }, 8), false);
  assert.equal(canPlayJourneyChapter({ chaptersDone: [1, 3], continueChapter: 4, totalChapters: 8 }, 4), false);
  const finished = { chaptersDone: [1, 2, 3, 4, 5, 6, 7, 8], continueChapter: 1, totalChapters: 8 };
  for (let chapter = 1; chapter <= 8; chapter++) assert.equal(canPlayJourneyChapter(finished, chapter), true);
});

test('a ninth published chapter unlocks after eight completions without a static fallback', () => {
  const state = { chaptersDone: [1, 2, 3, 4, 5, 6, 7, 8], totalChapters: 9 };
  assert.equal(resumeJourneyChapter(state), 9);
  assert.equal(canPlayJourneyChapter(state, 9), true);
  assert.equal(journeyChapterProgress(state, 9).status, 'current');
  assert.equal(canPlayJourneyChapter(state, 10), false);
  assert.equal(canPlayJourneyChapter({ ...state, chaptersDone: [1, 2] }, 9), false);
  for (const totalChapters of [undefined, null, NaN, -1]) {
    assert.equal(isJourneyPlayState({ chaptersDone: [], totalChapters }), false);
    assert.equal(canPlayJourneyChapter({ chaptersDone: [], totalChapters }, 1), false);
  }
  assert.equal(isJourneyPlayState({ chaptersDone: [], totalChapters: 0 }), true);
  assert.equal(resumeJourneyChapter({ chaptersDone: [], totalChapters: 0 }), null);
});

test('game entry resumes the server chapter instead of defaulting to chapter one', () => {
  assert.equal(resumeJourneyChapter({ chaptersDone: [1], continueChapter: 2, totalChapters: 8 }), 2);
  assert.equal(resumeJourneyChapter({ chaptersDone: [], continueChapter: 1, totalChapters: 8 }), 1);
  assert.equal(resumeJourneyChapter({ chaptersDone: [1, 2], nextChapter: '3', totalChapters: 8 }), 3);
  assert.equal(resumeJourneyChapter({ chaptersDone: [1, 2], totalChapters: 8 }), 3);
  assert.equal(resumeJourneyChapter({ chaptersDone: [1, 2, 3, 4, 5, 6, 7, 8], totalChapters: 8 }), 1);
  assert.equal(resumeJourneyChapter({ chaptersDone: [1], continueChapter: 8, totalChapters: 8 }), null);
  assert.equal(resumeJourneyChapter(null), null);
});
test('ending batch reaches backend with the learner slot and attempt', async () => {
  const source = await fs.readFile(new URL('../src/pages/Kid/Dashboard/components/game/playBatch.js', import.meta.url), 'utf8');
  const calls = [];
  globalThis.__playTestApi = {
    getSnapshot: () => ({ actor: { code: 'test-slot' } }),
    getPlayState: async () => ({ chaptersDone: [], totalChapters: 8, attemptIndex: 1 }),
    submitChapterBatch: async (batch) => { calls.push(batch); return { ok: true }; },
  };
  const instrumented = source.replace('return (await import("../../api/kidDashboardApi")).kidDashboardApi;', 'return globalThis.__playTestApi;');
  const { submitChapterBatch } = await import(`data:text/javascript;base64,${Buffer.from(instrumented).toString('base64')}`);
  const batch = { chapter: 1, releaseVersion: 'v1', choices: [], miniGames: [] };
  try {
    assert.equal((await submitChapterBatch(batch)).sent, true);
    assert.deepEqual(calls, [{ ...batch, attemptIndex: 1 }]);
    const wrapper = await fs.readFile(new URL('../src/pages/Kid/Dashboard/api/kidDashboardApi.js', import.meta.url), 'utf8');
    assert.match(wrapper, /getSnapshot:\s*\(\) => auth.getSnapshot\(\)/);
  } finally { delete globalThis.__playTestApi; }
});

test('chapter results survive recoverable errors and are discarded for invalid, missing or ended resources', async () => {
  const source = await fs.readFile(new URL('../src/pages/Kid/Dashboard/components/game/playBatch.js', import.meta.url), 'utf8');
  const instrumented = source.replace('return (await import("../../api/kidDashboardApi")).kidDashboardApi;', 'return globalThis.__playRetryApi;');
  const { submitChapterBatch, flushPendingBatches } = await import(`data:text/javascript;base64,${Buffer.from(instrumented).toString('base64')}`);
  const previousStorage = globalThis.localStorage;
  const storage = {};
  Object.defineProperties(storage, {
    getItem: { value: (key) => storage[key] ?? null },
    setItem: { value: (key, value) => { storage[key] = value; } },
    removeItem: { value: (key) => { delete storage[key]; } },
  });
  globalThis.localStorage = storage;
  const batch = { chapter: 2, releaseVersion: 'v1', choices: [{ sceneId: 'S1', optionId: 'A' }], miniGames: [] };
  const key = 'finteen:play:pending:child-a:2:v1';
  let status;
  const sent = [];
  globalThis.__playRetryApi = {
    getSnapshot: () => ({ actor: { code: 'child-a' } }),
    getPlayState: async () => ({ chaptersDone: [1], totalChapters: 8, attemptIndex: 1 }),
    submitChapterBatch: async (payload) => {
      if (status !== null) throw Object.assign(new Error('API failure'), { status });
      sent.push(payload);
      return { ok: true };
    },
  };
  try {
    for (const [failureStatus, retry] of [
      [undefined, true], [0, true], [401, true], [403, true], [408, true], [429, true],
      [500, true], [503, true], [400, false], [404, false], [409, false], [410, false],
    ]) {
      status = failureStatus;
      storage.setItem(key, JSON.stringify(batch));
      const result = await submitChapterBatch(batch, 'child-a');
      assert.equal(result.retry, retry, `status ${status}`);
      assert.deepEqual(storage.getItem(key) ? JSON.parse(storage.getItem(key)) : null, retry ? batch : null);
    }
    status = 429;
    await submitChapterBatch(batch, 'child-a');
    await flushPendingBatches('different-child');
    assert.ok(storage.getItem(key));
    status = null;
    await flushPendingBatches('child-a');
    assert.deepEqual(sent, [{ ...batch, attemptIndex: 1 }]);
    assert.equal(storage.getItem(key), null);
  } finally {
    globalThis.localStorage = previousStorage;
    delete globalThis.__playRetryApi;
  }
});

test('background dashboard refresh keeps the game mounted while initial loads still wait', async () => {
  const source = await fs.readFile(new URL('../src/pages/Kid/Dashboard/hooks/useKidDashboard.js', import.meta.url), 'utf8');
  const createHook = new Function('useCallback', 'useEffect', 'useNavigate', 'authSession', 'useWorkspace', 'useCurrentRelease',
    source.replace(/^import .*;\r?\n/gm, '').replace('export default function', 'function') + '\nreturn useKidDashboard;');
  let workspace = { learnerDashboard: null, learnerDashboardLoading: true };
  let release = { chapters: [], loading: false };
  const useKidDashboard = createHook(
    callback => callback, () => {}, () => () => {}, {}, () => workspace,
    () => release,
  );
  assert.equal(useKidDashboard().loading, true, 'Initial dashboard fetch should wait');
  workspace = { learnerDashboard: { progress: { completedChapters: 4 } }, learnerDashboardLoading: true };
  assert.equal(useKidDashboard().loading, false, 'Refreshing progress must not unmount the ending and submit the chapter again');
  assert.equal(useKidDashboard().completedChapters, 4, 'Existing progress remains available during refresh');
  release = { chapters: [], loading: true };
  assert.equal(useKidDashboard().loading, true, 'Initial release fetch should still wait');
});

test('dashboard waits for pending chapter results before loading progress', async () => {
  const source = await fs.readFile(new URL('../src/pages/Kid/Dashboard/hooks/useKidPlayState.js', import.meta.url), 'utf8');
  let effect;
  let result;
  let finishFlush;
  let stateRequests = 0;
  const pending = new Promise((resolve) => { finishFlush = resolve; });
  const state = { chaptersDone: [1, 2], totalChapters: 8, attemptIndex: 1 };
  const releasedChapters = Array.from({ length: 9 }, (_, i) => ({ chapterNumber: i + 1, title: `Published ${i + 1}` }));
  const createHook = new Function('useEffect', 'useState', 'useWorkspace', 'kidDashboardApi', 'isJourneyPlayState', 'flushPendingBatches', 'getCurrentRelease',
    source.replace(/^import .*;\r?\n/gm, '').replace('export function', 'function') + '\nreturn useKidPlayState;');
  const useKidPlayState = createHook(
    (callback) => { effect = callback; },
    (initial) => [initial, (value) => { result = value; }],
    () => ({ actor: { id: 'kid-1', role: 'kid', code: 'learner-a' } }),
    { getPlayState: async () => { stateRequests++; return state; } },
    isJourneyPlayState,
    async (code) => { assert.equal(code, 'learner-a'); await pending; },
    async () => ({ chapters: releasedChapters }),
  );
  assert.equal(useKidPlayState().loading, true);
  const cleanup = effect();
  assert.equal(stateRequests, 0);
  assert.equal(result, undefined);
  finishFlush();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(stateRequests, 1);
  assert.deepEqual(result.state, { ...state, totalChapters: 9 });
  assert.deepEqual(result.chapters, releasedChapters);
  assert.equal(canPlayJourneyChapter(result.state, 3), true);
  cleanup();
});

test('release changes discard removed completions and use the highest published chapter number', async () => {
  const source = await fs.readFile(new URL('../src/pages/Kid/Dashboard/hooks/useKidPlayState.js', import.meta.url), 'utf8');
  const createHook = new Function('useEffect', 'useState', 'useWorkspace', 'kidDashboardApi', 'isJourneyPlayState', 'flushPendingBatches', 'getCurrentRelease',
    source.replace(/^import .*;\r?\n/gm, '').replace('export function', 'function') + '\nreturn useKidPlayState;');
  for (const { numbers, playState, expectedDone, total, playable } of [
    { numbers: [1, 2, 3, 4, 5, 6, 7, 8], playState: { chaptersDone: [1, '9'], continueChapter: 2 }, expectedDone: [1], total: 8, playable: 2 },
    { numbers: [1, 2, 4, 5, 6, 7, 8, 9], playState: { chaptersDone: ['9'] }, expectedDone: ['9'], total: 9, playable: 9 },
    { numbers: [], playState: { chaptersDone: [9] }, expectedDone: [], total: 0, playable: null },
  ]) {
    let effect;
    let result;
    const original = structuredClone(playState);
    const chapters = numbers.map((chapterNumber) => ({ chapterNumber }));
    const useKidPlayState = createHook(
      (callback) => { effect = callback; },
      (initial) => [initial, (value) => { result = value; }],
      () => ({ actor: { id: 'kid-1', role: 'kid', code: 'learner-a' } }),
      { getPlayState: async () => playState },
      isJourneyPlayState,
      async () => {},
      async () => ({ chapters }),
    );
    useKidPlayState();
    const cleanup = effect();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(result.error, '');
    assert.equal(isJourneyPlayState(result.state), true);
    assert.equal(result.state.totalChapters, total);
    assert.deepEqual(result.state.chaptersDone, expectedDone);
    assert.deepEqual(result.chapters, chapters);
    assert.deepEqual(playState, original, 'release filtering must not mutate server progress');
    if (playable !== null) assert.equal(canPlayJourneyChapter(result.state, playable), true);
    else assert.equal(resumeJourneyChapter(result.state), null);
    cleanup();
  }
});

test('switching learners during a progress request cannot submit the previous learner batch', async () => {
  const source = await fs.readFile(new URL('../src/pages/Kid/Dashboard/components/game/playBatch.js', import.meta.url), 'utf8');
  const instrumented = source.replace('return (await import("../../api/kidDashboardApi")).kidDashboardApi;', 'return globalThis.__playTestApi;');
  const { submitChapterBatch } = await import(`data:text/javascript;base64,${Buffer.from(instrumented).toString('base64')}`);
  let code = 'learner-a';
  const calls = [];
  let resolveState;
  globalThis.__playTestApi = {
    getSnapshot: () => ({ actor: { code } }),
    getPlayState: () => new Promise((resolve) => { resolveState = resolve; }),
    submitChapterBatch: async (batch) => { calls.push({ code, batch }); },
  };
  const batch = { chapter: 1, releaseVersion: 'v1', choices: [], miniGames: [] };
  try {
    const pending = submitChapterBatch(batch, 'learner-a');
    await new Promise((resolve) => setImmediate(resolve));
    code = 'learner-b';
    resolveState({ chaptersDone: [], totalChapters: 8, attemptIndex: 1 });
    assert.ok((await pending).skipped);
    assert.deepEqual(calls, []);
    assert.ok((await submitChapterBatch(batch, 'learner-a')).skipped);
    assert.ok((await submitChapterBatch(batch, null)).skipped);
  } finally { delete globalThis.__playTestApi; }
});
