import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import { canPlayJourneyChapter, isJourneyPlayState, journeyChapterProgress, resumeJourneyChapter } from '../src/pages/Kid/Dashboard/api/kidJourneyProgress.js';

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
