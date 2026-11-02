import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import { journeyChapterProgress } from '../src/pages/Kid/Dashboard/api/kidJourneyProgress.js';

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
  assert.equal(journeyChapterProgress({ chaptersDone: [] }, 2).status, 'available');
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
