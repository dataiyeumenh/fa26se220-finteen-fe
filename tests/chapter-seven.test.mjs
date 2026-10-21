import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { chapter7V2GameData as data } from '../src/pages/Kid/Dashboard/data/chapter7V2VisualNovel.js';
import { applySafetyAction, createSafetyState, safetyMessages, insuranceDocuments, responseActions, safetyTasks, safetyResult, chapterSevenLearning } from '../src/pages/Kid/Dashboard/components/game/scamOrSafeRules.js';
import { progressKey, readNovelProgress, saveNovelProgress } from '../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js';
import { CHAPTERS } from '../src/features/workspace/model.js';
const scenes = new Map(data.scenes.map(scene => [scene.id, scene]));
const option = id => data.scenes.flatMap(scene => scene.options || []).find(option => option.id === id);
const fullHistory = Object.fromEntries(safetyTasks.map(task => [task.id, { finalCorrect: true, firstAttemptCorrect: true, attemptCount: 1 }]));
const games = () => Object.fromEntries([['INSURANCE_DESK_CH07', [0]], ['SCAM_OR_SAFE_CH07', [1, 2]]].map(([gameId, rounds]) => [gameId, { ...safetyResult(fullHistory, rounds), gameId, completed: true }]));
const goodLedger = { CH07_PAYMENT: { evidenceScores: { I: 2, C: 2, P: 2 } }, CH07_FRAUD: { evidenceScores: { I: 2, C: 1, P: 2 } }, CH07_SUPPORT: { evidenceScores: { I: 2, C: 1, P: 2 } } };
function ending(flags, ledger = goodLedger, results = games(), stats = data.initialStats) {
  const context = { flags, ...stats, ...chapterSevenLearning(ledger, results, data.endingReport), miniGameCompleted: true };
  return data.endingRules.endings.find(rule => rule.condition === 'DEFAULT_FALLBACK' || new Function(...Object.keys(context), `return Boolean(${rule.condition})`)(...Object.values(context))).id;
}
const safeFlags = { incident_resolved: true, hot_loan: false, fraud_contained: true, recovery_done: true };

test('chapter graph is fully reachable, acyclic and every asset exists', () => {
  assert.equal(scenes.size, data.scenes.length);
  const active = new Set(), done = new Set();
  function walk(id) {
    if (!id || done.has(id)) return;
    const scene = scenes.get(id); assert.ok(scene, id); assert.ok(!active.has(id), `Loop at ${id}`); active.add(id);
    for (const next of [scene.nextSceneId, scene.ifTrueSceneId, scene.ifFalseSceneId, ...(scene.options || []).map(option => option.nextSceneId)]) walk(next);
    active.delete(id); done.add(id);
  }
  walk(data.scenes[0].id); assert.equal(done.size, scenes.size);
  function assets(value) {
    if (typeof value === 'string' && value.startsWith('/images/')) assert.ok(existsSync(`public${value}`), value);
    else if (value && typeof value === 'object') Object.values(value).forEach(assets);
  }
  assets(data); assets(insuranceDocuments); assets(responseActions);
});
test('story remains substantial and supports all four settings without reflections or reselect loops', () => {
  assert.ok(data.scenes.filter(scene => scene.type === 'dialogue').length >= 125);
  for (const background of ['bg11-school-infirmary', 'bg11b-medical-paperwork-desk', 'bg12-refund-message-phone', 'bg11c-recovery-evidence-desk']) assert.ok(data.scenes.filter(scene => scene.type === 'dialogue' && scene.background.endsWith(`${background}.png`)).length >= 20, background);
  assert.equal(data.scenes.filter(scene => scene.type === 'choice').length, 3);
  assert.equal(new Set(data.scenes.filter(scene => scene.type === 'choice').map(scene => scene.choiceGroup)).size, 3);
  assert.equal(data.scenes.some(scene => scene.type === 'activity'), false);
  assert.equal(data.metadata.lockDecisions, true);
  assert.equal(data.metadata.age, 17);
  assert.equal(data.initialMoney, 1500000);
  for (const scene of data.scenes.filter(scene => scene.type === 'conditional')) assert.ok(scene.condition.expression);
});
test('insurance and privacy concepts have explicit names, conditions and no automatic claim credit', () => {
  const text = JSON.stringify(data);
  for (const word of ['phần tự trả', 'phạm vi', 'đóng phí', 'tự gánh', 'chuyển giao', 'OTP', 'mã xác thực', 'số hỗ trợ ghi trong hợp đồng']) assert.ok(text.toLowerCase().includes(word.toLowerCase()), word);
  assert.ok(text.includes('Hóa đơn đã thanh toán'));
  const events = data.scenes.flatMap(scene => (scene.options || []).flatMap(option => option.moneyEvents || []));
  assert.equal(events.length, 5);
  assert.equal(new Set(events.map(event => event.eventId)).size, 5);
  assert.deepEqual(events.filter(event => event.amount > 0).map(event => event.amount), [300000]);
  assert.equal(data.scenes.some(scene => scene.inspect?.moneyEvents?.length), false);
  assert.equal(option('CH07_SC02_A').requires.minMoney, 300000);
  assert.deepEqual(option('CH07_SC02_B').moneyEvents.map(event => event.amount), [300000, -300000]);
  assert.equal(option('CH07_SC03_B').moneyEvents[0].amount, -150000);
  assert.equal(option('CH07_SC04_B').moneyEvents[0].amount, -100000);
});
test('all twelve story paths have exact balances, persistent exposure and source-aligned endings', () => {
  for (const payment of ['A', 'B', 'C']) for (const fraud of ['A', 'B']) for (const support of ['A', 'B']) {
    let money = data.initialMoney, flags = {}, stats = { ...data.initialStats }; const ledger = {};
    for (const [sceneId, letter] of [['CH07_SC02', payment], ['CH07_SC03', fraud], ['CH07_SC04', support]]) {
      const scene = scenes.get(sceneId), choice = option(`${sceneId}_${letter}`);
      for (const event of choice.moneyEvents || []) money += event.amount;
      flags = { ...flags, ...choice.setFlags };
      for (const [key, value] of Object.entries(choice.deltaStats)) stats[key] += value;
      ledger[scene.choiceGroup] = { evidenceScores: choice.evidenceScores };
    }
    assert.equal(money, 1500000 - (payment === 'A' ? 300000 : 0) - (fraud === 'B' ? 150000 : 0) - (support === 'B' ? 100000 : 0));
    const expected = payment === 'C' || fraud === 'B' || support === 'B' ? 'C_RECOVERY' : payment === 'B' ? 'B_BALANCED' : 'A_GOAL_ACHIEVED';
    assert.equal(ending(flags, ledger, games(), stats), expected, `${payment}${fraud}${support}`);
    if (fraud === 'B' && support === 'A') { assert.equal(flags.fraud_exposed, true); assert.equal(flags.recovery_done, true); assert.equal(ending(flags, ledger, games(), stats), 'C_RECOVERY'); }
  }
});
test('correct financial choice preserves savings stat; losses do not become score or reimbursement', () => {
  assert.deepEqual(option('CH07_SC02_A').deltaStats, { RISK: -7 });
  assert.deepEqual(option('CH07_SC02_B').deltaStats, { RISK: 15, GOAL: -5 });
  assert.deepEqual(option('CH07_SC02_C').deltaStats, { RISK: 5, GOAL: -5 });
  assert.deepEqual(option('CH07_SC03_A').deltaStats, { SAVING: 1, HAPPINESS: 1, RISK: -8, GOAL: 2 });
  assert.deepEqual(option('CH07_SC03_B').deltaStats, { RISK: 20 });
  assert.deepEqual(option('CH07_SC04_B').deltaStats, { RISK: 5, GOAL: -2 });
  assert.equal(scenes.get('CH07_EXPOSED_3').speaker, 'Cô Linh');
  assert.match(scenes.get('CH07_EXPOSED_3').text, /khóa thẻ hoặc tài khoản/);
  assert.match(scenes.get('CH07_EXPOSED_3').text, /báo ngay cho ngân hàng/);
});
test('insurance checkout records both criteria once and allows wrong submission to finish', () => {
  let state = createSafetyState([0]);
  assert.equal(applySafetyAction(state, { type: 'SUBMIT_INSURANCE' }), state);
  state = applySafetyAction(state, { type: 'PAYMENT', amount: 100000 });
  state = applySafetyAction(state, { type: 'DOCUMENT', id: 'otp' });
  assert.deepEqual(state.history, {});
  state = applySafetyAction(state, { type: 'SUBMIT_INSURANCE' });
  assert.equal(state.submittedRounds[0], true);
  assert.equal(safetyResult(state.history, [0]).completed, true);
  assert.equal(safetyResult(state.history, [0]).score, 0);
  for (const action of [{ type: 'PAYMENT', amount: 300000 }, { type: 'DOCUMENT', id: 'receipt' }, { type: 'SUBMIT_INSURANCE' }]) assert.equal(applySafetyAction(state, action), state);
  let correct = createSafetyState([0]);
  correct = applySafetyAction(correct, { type: 'PAYMENT', amount: 300000 });
  for (const id of ['receipt', 'medicalRecord', 'claim']) correct = applySafetyAction(correct, { type: 'DOCUMENT', id });
  correct = applySafetyAction(correct, { type: 'SUBMIT_INSURANCE' });
  assert.equal(safetyResult(correct.history, [0]).score, 2);
});
test('insurance packet must match the actual stated terms and rejects extra data', () => {
  let state = createSafetyState([0]);
  state = applySafetyAction(state, { type: 'PAYMENT', amount: 300000 });
  for (const id of ['receipt', 'medicalRecord', 'claim', 'otp']) state = applySafetyAction(state, { type: 'DOCUMENT', id });
  state = applySafetyAction(state, { type: 'SUBMIT_INSURANCE' });
  assert.equal(safetyResult(state.history, [0]).score, 1);
  assert.equal(state.money, undefined);
});
test('inbox drafts do not score, can be changed and are graded only after all six', () => {
  let state = createSafetyState([1, 2]);
  assert.equal(applySafetyAction(state, { type: 'ROUND', round: 2 }), state);
  state = applySafetyAction(state, { type: 'ANSWER_MESSAGE', id: safetyMessages[0].id, answer: 'continue' });
  assert.deepEqual(state.history, {});
  assert.equal(applySafetyAction(state, { type: 'SUBMIT_MESSAGES' }), state);
  for (const message of safetyMessages) state = applySafetyAction(state, { type: 'ANSWER_MESSAGE', id: message.id, answer: message.answer });
  state = applySafetyAction(state, { type: 'SUBMIT_MESSAGES' });
  assert.equal(safetyResult(state.history, [1]).score, 6);
  assert.equal(safetyResult(state.history, [1]).firstPercent, 100);
  assert.equal(applySafetyAction(state, { type: 'ANSWER_MESSAGE', id: safetyMessages[0].id, answer: 'continue' }), state);
  const review = applySafetyAction(state, { type: 'MESSAGE', index: 0 });
  assert.deepEqual(review.history, state.history);
  assert.equal(review.activeMessage, 0);
});
test('wrong inbox is completed without rewriting answers or granting correct evidence', () => {
  let state = createSafetyState([1, 2]);
  for (const message of safetyMessages) state = applySafetyAction(state, { type: 'ANSWER_MESSAGE', id: message.id, answer: message.answer === 'check' ? 'continue' : 'check' });
  state = applySafetyAction(state, { type: 'SUBMIT_MESSAGES' });
  assert.equal(safetyResult(state.history, [1]).score, 0);
  assert.equal(safetyResult(state.history, [1]).completed, true);
  assert.equal(safetyResult(state.history, [1]).passed, false);
  assert.equal(applySafetyAction(state, { type: 'ROUND', round: 2 }).round, 2);
});
test('response accepts immediate protection or official contact in either middle order', () => {
  for (const ids of [['stop', 'contact', 'protect', 'save'], ['stop', 'protect', 'contact', 'save']]) {
    let state = createSafetyState([2]);
    for (const id of ids) state = applySafetyAction(state, { type: 'ADD_RESPONSE', id });
    assert.deepEqual(state.history, {});
    state = applySafetyAction(state, { type: 'SUBMIT_RESPONSE' });
    assert.equal(safetyResult(state.history, [2]).score, 4);
    assert.equal(applySafetyAction(state, { type: 'REMOVE_RESPONSE', id: 'stop' }), state);
    assert.equal(applySafetyAction(state, { type: 'SUBMIT_RESPONSE' }), state);
  }
});
test('response permits unsafe drafts but freezes their partial credit and consequences on submission', () => {
  let state = createSafetyState([2]);
  state = applySafetyAction(state, { type: 'ADD_RESPONSE', id: 'reply' });
  state = applySafetyAction(state, { type: 'REMOVE_RESPONSE', id: 'reply' });
  for (const id of ['stop', 'payFee', 'reply', 'save']) state = applySafetyAction(state, { type: 'ADD_RESPONSE', id });
  assert.equal(applySafetyAction(state, { type: 'ADD_RESPONSE', id: 'protect' }), state);
  state = applySafetyAction(state, { type: 'SUBMIT_RESPONSE' });
  assert.equal(safetyResult(state.history, [2]).score, 2);
  assert.equal(safetyResult(state.history, [2]).completed, true);
  assert.deepEqual(state.response, ['stop', 'payFee', 'reply', 'save']);
  assert.equal(state.money, undefined);
});
test('normalized report needs both games, has no reflections and keeps all ending priorities', () => {
  const results = games();
  const report = chapterSevenLearning(goodLedger, results, data.endingReport);
  assert.equal(report.learningScore, 100);
  assert.equal(report.choicePercent, 100);
  assert.equal(report.firstPercent, 100);
  assert.equal(report.reflectionPercent, null);
  assert.equal(data.endingReport.weights.reflection, 0);
  assert.equal(data.endingReport.miniGameMax, safetyTasks.length);
  assert.equal(ending(safeFlags), 'A_GOAL_ACHIEVED');
  delete results.SCAM_OR_SAFE_CH07;
  assert.equal(ending(safeFlags, goodLedger, results), 'B_BALANCED');
  assert.equal(ending({ ...safeFlags, fraud_exposed: true }), 'C_RECOVERY');
  assert.equal(ending(safeFlags, goodLedger, games(), { ...data.initialStats, RISK: 56 }), 'C_RECOVERY');
});
test('chapter-seven checkpoint preserves drafts and decisions; route and card expose the chapter', () => {
  const memory = new Map(), storage = { getItem: key => memory.get(key), setItem: (key, value) => memory.set(key, value) };
  const snapshot = { scenePath: [0], stats: data.initialStats, money: 1200000, committedDecisions: ['CH07_SC02'] };
  for (const key of ['flags', 'choiceLedger', 'firstChoiceScores', 'inspectedIds', 'moneyEventsApplied', 'budgetAllocations', 'miniGameResults', 'miniGameDoneByScene', 'sceneActionApplied']) snapshot[key] = {};
  snapshot.miniGameResults.CH07_GAME_SAFETY = { ui: { ...createSafetyState([1, 2]), messages: { instantRefund: 'check' } } };
  saveNovelProgress(storage, data, snapshot);
  assert.deepEqual(readNovelProgress(storage, data), { ...snapshot, version: data.version });
  assert.equal(readNovelProgress(storage, { ...data, version: 'old' }), null);
  assert.equal(CHAPTERS[6], 'Biến cố bất ngờ');
  assert.ok(readFileSync('src/features/workspace/KidPages.jsx', 'utf8').includes('/dashboard/demo/play?chapter=7'));
  assert.ok(readFileSync('src/pages/Kid/Dashboard/KidGames.jsx', 'utf8').includes('chapter7V2VisualNovel'));
  assert.ok(progressKey(data).includes('CH07_V2'));
});
