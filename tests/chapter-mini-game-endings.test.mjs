import test from 'node:test';
import assert from 'node:assert/strict';
import { chapter4V2GameData as ch4 } from '../src/pages/User/Dashboard/data/chapter4V2VisualNovel.js';
import { chapter5V2GameData as ch5 } from '../src/pages/User/Dashboard/data/chapter5V2VisualNovel.js';
import { chapter6V2GameData as ch6 } from '../src/pages/User/Dashboard/data/chapter6V2VisualNovel.js';
import { chapter7V2GameData as ch7 } from '../src/pages/User/Dashboard/data/chapter7V2VisualNovel.js';
import { chapter8V2GameData as ch8 } from '../src/pages/User/Dashboard/data/chapter8V2VisualNovel.js';
import { chapterMiniGameSummary, recordMiniGameResult } from '../src/pages/User/Dashboard/components/game/miniGameRules.js';
import { challenges, timelineResult, chapterFiveLearning } from '../src/pages/User/Dashboard/components/game/compoundTimelineRules.js';
import { loanTasks, loanResult, chapterSixLearning } from '../src/pages/User/Dashboard/components/game/loanDetectiveRules.js';
import { safetyTasks, safetyResult, chapterSevenLearning } from '../src/pages/User/Dashboard/components/game/scamOrSafeRules.js';
import { futureTasks, futureResult, createFutureState, chapterEightLearning, applyFutureAction, budgetFeedback, planMonths } from '../src/pages/User/Dashboard/components/game/futurePlanRules.js';

const safeFlags = {
  purchase_fit: true, receipt_resolved: true, budget_adjusted: true,
  provider_checked: true, account_fit: true, credit_plan_fit: true,
  fallback_verified: true, repayment_understood: true, incident_resolved: true,
  fraud_contained: true, recovery_done: true, portfolio_fit: true,
  claims_checked: true, life_plan_feasible: true,
};
const cases = [
  [ch4, null, [{ id: 'shopping' }], () => ({ total: 4 }), null],
  [ch5, chapterFiveLearning, challenges, history => timelineResult(history), null],
  [ch6, chapterSixLearning, loanTasks, (history, rounds) => loanResult(history, rounds), [[0, 1], [2, 3]]],
  [ch7, chapterSevenLearning, safetyTasks, (history, rounds) => safetyResult(history, rounds), [[0], [1, 2]]],
  [ch8, chapterEightLearning, futureTasks.map(id => ({ id })), (history, kind) => futureResult({ ...createFutureState(kind), history }), ['portfolio', 'claims', 'planner']],
];
function resultsFor(data, tasks, resultFor, groups, correct) {
  const history = Object.fromEntries(tasks.map((task, i) => [task.id, { finalCorrect: i < correct, firstAttemptCorrect: i < correct, attemptCount: 1 }]));
  return Object.fromEntries(data.endingReport.requiredGameIds.map((gameId, index) => {
    const result = resultFor(history, groups?.[index]);
    return [gameId, { ...result, score: data === ch4 ? correct : result.score, gameId, completed: true }];
  }));
}
function resolve(data, results, learning, flags = safeFlags) {
  const ledger = Object.fromEntries(Object.entries(data.endingReport.choiceGroupMaxima || {}).map(([id, maximum]) => [id, { evidenceScores: { I: maximum }, firstEvidenceScores: { I: maximum } }]));
  ledger.CH05_R1 = { reflectionScore: 6 }; ledger.CH05_R2 = { reflectionScore: 6 };
  const context = { flags, RISK: 30, SAVING: 50, evidenceScore: 12,
    miniGameCompleted: true, reflectionScore: 12,
    ...chapterMiniGameSummary(results, data.endingReport),
    ...(learning ? learning(ledger, results, data.endingReport) : {}),
  };
  return data.endingRules.endings.find(ending => ending.condition === 'DEFAULT_FALLBACK' || new Function(...Object.keys(context), `return Boolean(${ending.condition})`)(...Object.values(context))).id;
}

for (const [data, learning, tasks, resultFor, groups] of cases) {
  test(`${data.metadata.chapterId}: every correct-answer count affects the ending, independent of passed`, () => {
    const total = data.endingReport.miniGameMax;
    for (let correct = 0; correct <= total; correct++) {
      const results = resultsFor(data, tasks, resultFor, groups, correct);
      // Ending gates use the actual score, not this legacy boolean.
      Object.values(results).forEach(result => { result.passed = correct === 0; });
      const summary = chapterMiniGameSummary(results, data.endingReport);
      assert.equal(summary.miniCorrect, correct);
      assert.equal(summary.miniWrong, total - correct);
      const expected = correct / total < .5 ? 'C_RECOVERY' : correct / total >= .75 ? 'A_GOAL_ACHIEVED' : 'B_BALANCED';
      assert.equal(resolve(data, results, learning), expected, `${correct}/${total}`);
      const saved = JSON.parse(JSON.stringify(results));
      assert.equal(resolve(data, saved, learning), expected);
    }
  });
  test(`${data.metadata.chapterId}: incomplete activities cannot earn A; perfect games cannot undo story consequences`, () => {
    const results = resultsFor(data, tasks, resultFor, groups, data.endingReport.miniGameMax);
    assert.equal(resolve(data, results, learning, { ...safeFlags, receipt_resolved: false, account_pending: true, credit_unverified: true, fraud_exposed: true, fomo: true }), 'C_RECOVERY');
    Object.values(results).at(-1).completed = false;
    assert.equal(resolve(data, results, learning), 'B_BALANCED');
    assert.equal(resolve(data, {}, learning), 'B_BALANCED');
  });
}

test('only required completed games count, with a fixed denominator and no rounding across an ending threshold', () => {
  const config = { requiredGameIds: ['one', 'two'], miniGameMax: 12 };
  const results = { one: { gameId: 'one', completed: true, score: 2, total: 6 }, two: { gameId: 'two', completed: true, score: 6, total: 6 }, other: { gameId: 'other', completed: true, score: 100, total: 100 } };
  const summary = chapterMiniGameSummary(results, config);
  assert.equal(summary.miniCorrect, 8); assert.equal(summary.miniGameGoalEligible, false);
  results.one.score = 3;
  assert.equal(chapterMiniGameSummary(results, config).miniGameGoalEligible, true);
  results.two.completed = false;
  assert.equal(chapterMiniGameSummary(results, config).miniPercent, 25);
  assert.equal(chapterMiniGameSummary(results, config).miniGameNeedsPractice, false);
});

test('chapter 8 budget submissions require money for the goal as well as staying within income', () => {
  let state = createFutureState('planner');
  state = applyFutureAction(state, { type: 'SUBMIT_MONTH' });
  assert.equal(futureResult(state).score, 0);
  assert.ok(budgetFeedback(planMonths[0], state.budgets[0]).join(' ').includes('chưa dành tiền'));
  assert.equal(applyFutureAction(state, { type: 'BUDGET', id: 'goal', delta: 100000 }), state);
  const draft = applyFutureAction(createFutureState('planner'), { type: 'BUDGET', id: 'goal', delta: 100000 });
  const submitted = applyFutureAction(draft, { type: 'SUBMIT_MONTH' });
  assert.equal(futureResult(submitted).score, 1);
  assert.equal(recordMiniGameResult({}, { chapterId: 'CH08', sceneId: 'planner', gameId: 'LIFE_PLAN_CH08' }, futureResult(submitted)).planner.correctCount, 1);
});
