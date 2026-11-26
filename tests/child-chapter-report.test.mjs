import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildChildChapterReport, firstMiniGameScore } from '../src/pages/Kid/Dashboard/components/game/chapterReport.js';
import { recordMiniGameResult } from '../src/pages/Kid/Dashboard/components/game/miniGameRules.js';

const chapter = (number) => JSON.parse(readFileSync(new URL(`./fixtures/content/CH0${number}.json`, import.meta.url)));

test('all eight chapter recaps use actual money, choices and first submissions without adult scores', () => {
  for (let n = 1; n <= 8; n++) {
    const data = chapter(n);
    const scene = data.scenes.find((s) => s.type === 'choice' && s.options?.length > 1 && s.options.some((o) => !o.deferLedger && o.reflectionScore == null));
    const option = scene.options.find((o) => !o.deferLedger && o.reflectionScore == null);
    const ledger = { [scene.choiceGroup || scene.id]: { optionId: option.id, label: 'old label', evidenceScores: { I: 2, C: 2, P: 2 } } };
    const games = data.scenes.filter((s) => s.game && !s.game.id?.includes('SAVINGS_RACE'));
    const results = Object.fromEntries(games.map((s) => [s.id, { completed: true, score: 6, firstScore: 0, total: 6 }]));
    const report = buildChildChapterReport(data, ledger, results, 123456);
    assert.deepEqual(report.money, { start: data.initialMoney ?? 0, end: 123456 });
    assert.equal(report.decisions[0].label, option.label || option.text);
    assert.ok(report.miniGames.every((g) => g.correct === 0));
    for (const forbidden of ['learningScore', 'choicePercent', 'reflectionPercent', 'statDeltas', 'bandLabel', 'source'])
      assert.equal(forbidden in report, false);
  }
});

test('old checkpoints score CH01-03 from first inputs, not corrected scores', () => {
  for (let n = 1; n <= 3; n++) {
    const game = chapter(n).scenes.find((s) => s.game && !s.game.id?.includes('SAVINGS_RACE')).game;
    const total = n === 1 ? game.items.length : n === 2 ? game.dropZones.length : game.jobs.length + game.questions.length;
    assert.equal(firstMiniGameScore(game, { score: total, total, inputs: {} }), 0);
    const inputs = n === 1
      ? Object.fromEntries(game.items.map((i) => [i.id, i.category]))
      : n === 2
        ? Object.fromEntries(game.dropZones.map((z) => [z.id, game.draggables.find((i) => i.value === z.expectedValue).id]))
        : Object.fromEntries([...game.jobs.map((j) => [j.id, j.hours <= game.weeklyLimit ? 'fit' : 'over']), ...game.questions.map((q) => [q.id, q.correctId])]);
    assert.equal(firstMiniGameScore(game, { score: 0, total, inputs }), total);
  }
  assert.equal(firstMiniGameScore({}, { total: 6, score: 6, firstPercent: 33 }), 2);
  assert.equal(firstMiniGameScore({}, { total: 6, score: 6 }), null);
});

test('missing config/results never fabricate mock points; reflection and forced steps are excluded', () => {
  const data = { initialMoney: 500000, scenes: [
    { id: 'reflection', type: 'choice', options: [{ id: 'r', reflectionScore: 2 }, { id: 'r2', reflectionScore: 0 }] },
    { id: 'payment', type: 'choice', options: [{ id: 'pay' }] },
    { id: 'game', game: { title: 'Practice' } },
  ] };
  const report = buildChildChapterReport(data, { reflection: { optionId: 'r' }, payment: { optionId: 'pay' } }, { game: { completed: true, outcome: 'success' } }, 0);
  assert.deepEqual(report.money, { start: 500000, end: 0 });
  assert.deepEqual(report.miniGames, []);
  assert.deepEqual(report.decisions, []);
  assert.equal(report.achieved, null);
});

test('retry keeps first score and submitted inputs while internal ending score can improve', () => {
  const identity = { chapterId: 'CH01', sceneId: 'game', gameId: 'needs' };
  const first = recordMiniGameResult({}, identity, { score: 6, firstScore: 1, total: 6, inputs: { one: 'WANTS' }, playedAt: 'first' });
  const next = recordMiniGameResult(first, identity, { score: 6, firstScore: 6, total: 6, inputs: { one: 'NEEDS' }, playedAt: 'second' });
  assert.equal(next.game.firstScore, 1);
  assert.equal(next.game.score, 6);
  assert.deepEqual(next.game.inputs, first.game.inputs);
  assert.equal(next.game.playedAt, 'first');
  const saved = JSON.parse(JSON.stringify(next));
  assert.equal(firstMiniGameScore({}, saved.game), 1);
});

test('child feedback selects authored chapter lines and effective choices without grading them', () => {
  const data = { scenes: [{ id: 's', type: 'choice', options: [{ id: 'new', label: 'Hoãn mua' }, { id: 'old', label: 'Mua' }] }], endingReport: {
    achieved: [{ when: 'flags.saved', text: 'Bạn đã giữ tiền cho mục tiêu.' }],
    practice: [{ text: 'Hãy kiểm tra tổng giá.' }], nextStep: 'Xem lại kế hoạch.',
  } };
  const report = buildChildChapterReport(data, { s: { optionId: 'new', revised: true } }, {}, 500000, (when) => when === 'flags.saved');
  assert.equal(report.achieved, data.endingReport.achieved[0].text);
  assert.equal(report.practice, data.endingReport.practice[0].text);
  assert.equal(report.next, data.endingReport.nextStep);
  assert.equal(report.decisions[0].revised, true);
});
