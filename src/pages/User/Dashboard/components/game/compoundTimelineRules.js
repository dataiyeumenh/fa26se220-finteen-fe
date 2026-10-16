export const timelineAt = year => ({ compound: Math.round(1000000 * 1.05 ** year), simple: Math.round(1000000 * (1 + .05 * year)) });
export const accountForecast = { aInterest: 7500, aFees: 15000, aBalance: 992500, aGap: 7500, bInterest: 5000, bBalance: 1005000 };
export function gradeReflection(activity, answer) {
  if (activity === 'reflection1') {
    const has = key => answer.selected.includes(key);
    const relevant = ['deadline', 'withdrawal', 'fees', 'provider', 'protection'].filter(has).length;
    return { I: relevant >= 4 && !has('color') && !has('friend') ? 2 : relevant >= 2 ? 1 : 0, C: answer.method === 'net' ? 2 : 0, P: has('deadline') && has('withdrawal') && has('fees') ? 2 : has('deadline') ? 1 : 0 };
  }
  const feasible = answer.action === 'revise' || (answer.action === 'keepB' && answer.accountB) || (answer.action === 'verified' && answer.verified);
  const timely = ['month1', 'month2'].includes(answer.date);
  return { I: feasible ? 2 : 0, C: feasible ? 2 : 0, P: feasible && timely ? 2 : timely ? 1 : 0 };
}
export const challenges = [
  { id: 'growth', round: 0, competency: 'calculation', prompt: 'Năm 2 có phải chỉ thêm đúng 50.000đ không?', options: ['Đúng', 'Không'], answer: 'Không', feedback: 'Năm 2 tăng 52.500đ: lãi tính trên 1.050.000đ đã gồm lãi năm 1.' },
  { id: 'simple', round: 1, competency: 'information', prompt: 'Bảng X: ghép cách tính.', options: ['Lãi chỉ trên vốn ban đầu', 'Lãi trên vốn và lãi trước đó'], answer: 'Lãi chỉ trên vốn ban đầu', feedback: 'X là lãi đơn: mỗi năm tính 5% trên vốn ban đầu.' },
  { id: 'compound', round: 1, competency: 'information', prompt: 'Bảng Y: ghép cách tính.', options: ['Lãi chỉ trên vốn ban đầu', 'Lãi trên vốn và lãi trước đó'], answer: 'Lãi trên vốn và lãi trước đó', feedback: 'Y là lãi kép: lãi được giữ lại để tính lãi kỳ tiếp theo.' },
  { id: 'difference', round: 1, competency: 'calculation', prompt: 'Cuối năm 2, Y hơn X bao nhiêu đồng?', answer: 2500, feedback: '1.102.500 − 1.100.000 = 2.500đ.' },
  { id: 'basket', round: 2, competency: 'planning', prompt: 'Nếu hôm nay mua được món đó, một năm nữa thì sao?', options: ['Đủ mua', 'Thiếu 30.000đ', 'Dư 30.000đ'], answer: 'Thiếu 30.000đ', feedback: 'Tiền tăng 50.000đ nhưng giá tăng 80.000đ, nên thiếu 30.000đ.' },
  { id: 'power', round: 2, competency: 'information', prompt: 'Dữ kiện nào giải thích quyết định của bạn?', options: ['Chỉ cần tiền cuối năm cao hơn vốn', 'Cần so tiền có được với giá món hàng cùng thời điểm'], answer: 'Cần so tiền có được với giá món hàng cùng thời điểm', feedback: 'Tiền danh nghĩa tăng nhưng sức mua đối với món hàng này giảm.' },
  ...Object.entries(accountForecast).map(([id, answer]) => ({ id, answer, round: 3, competency: id === 'aGap' ? 'planning' : 'calculation',
    prompt: ({
      aInterest: 'Nếu gửi 1.000.000đ vào tài khoản A với lãi suất 3%/năm, sau 3 tháng An nhận được bao nhiêu tiền lãi?',
      aFees: 'Tài khoản A thu phí 5.000đ mỗi tháng. Sau 3 tháng, An phải trả tổng cộng bao nhiêu tiền phí?',
      aBalance: 'Sau 3 tháng gửi tiền vào tài khoản A, An có thể rút được bao nhiêu tiền, tính cả tiền lãi và trừ toàn bộ phí?',
      aGap: 'Khóa học cần 1.000.000đ. So với số tiền có thể rút từ tài khoản A sau 3 tháng, An còn thiếu bao nhiêu tiền?',
      bInterest: 'An gửi 1.000.000đ vào tài khoản B nhưng rút sau 3 tháng. Với lãi suất rút trước hạn 2%/năm, An nhận được bao nhiêu tiền lãi?',
      bBalance: 'Tài khoản B không thu phí. Nếu rút sau 3 tháng, An nhận được tổng cộng bao nhiêu tiền gốc và tiền lãi?',
    })[id],
    feedback: ({ aInterest: '1.000.000 × 3% × 3/12 = 7.500đ.', aFees: '5.000 × 3 = 15.000đ.', aBalance: '1.000.000 + 7.500 − 15.000 = 992.500đ.', aGap: '1.000.000 − 992.500 = 7.500đ.', bInterest: 'Rút sớm dùng 2%/năm: 1.000.000 × 2% × 3/12 = 5.000đ; không dùng 6%.', bBalance: '1.000.000 + 5.000 = 1.005.000đ dự kiến, không phải tiền nhận vào ví.' })[id],
  })),
];
export function gradeRound(round, answers, history = {}, inspectedItems = []) {
  const next = { ...history };
  for (const q of challenges.filter(item => item.round === round)) {
    if (history[q.id]) continue; // Submitted answers are final for this chapter run.
    const answer = answers[q.id];
    const correct = typeof q.answer === 'number' ? answer != null && String(answer).trim() !== '' && Number(answer) === q.answer : answer === q.answer;
    const old = history[q.id];
    next[q.id] = { answer, attemptCount: (old?.attemptCount || 0) + 1, firstAttempt: old ? old.firstAttempt : answer, firstAttemptCorrect: old ? old.firstAttemptCorrect : correct, finalCorrect: correct, inspectedItems: [...new Set([...(old?.inspectedItems || []), ...inspectedItems])] };
  }
  return next;
}
export function timelineResult(history) {
  const score = challenges.filter(q => history[q.id]?.finalCorrect).length;
  const first = challenges.filter(q => history[q.id]?.firstAttemptCorrect).length;
  const competencies = Object.fromEntries(['information', 'calculation', 'planning'].map(key => {
    const group = challenges.filter(q => q.competency === key);
    return [key, { correct: group.filter(q => history[q.id]?.finalCorrect).length, total: group.length }];
  }));
  return { score, total: challenges.length, passed: score === challenges.length, answers: history, firstAttempt: Object.fromEntries(challenges.map(q => [q.id, history[q.id]?.firstAttempt])), firstPercent: Math.round(100 * first / challenges.length), competencies, attemptCount: Math.max(0, ...Object.values(history).map(item => item.attemptCount)), revised: Object.values(history).some(item => item.attemptCount > 1), inspectedItems: [...new Set(Object.values(history).flatMap(item => item.inspectedItems))] };
}
export function chapterFiveLearning(ledger, results, config) {
  const sum = value => Object.values(value || {}).reduce((total, n) => total + n, 0);
  const groups = Object.entries(config.choiceGroupMaxima);
  const max = groups.reduce((total, [, n]) => total + n, 0);
  const choicePercent = 100 * groups.reduce((total, [id]) => total + sum(ledger[id]?.evidenceScores), 0) / max;
  const firstPercent = 100 * groups.reduce((total, [id]) => total + sum(ledger[id]?.firstEvidenceScores), 0) / max;
  const game = Object.values(results).find(item => item.gameId === 'COMPOUND_TIMELINE_CH05');
  const miniPercent = game?.total ? 100 * game.score / game.total : 0;
  const reflectionScore = Object.values(ledger).reduce((total, entry) => total + (entry.reflectionScore || 0), 0);
  const reflectionPercent = Math.min(100, 100 * reflectionScore / config.reflectionMax);
  const learningScore = choicePercent * config.weights.choices + miniPercent * config.weights.miniGame + reflectionPercent * config.weights.reflection;
  return { choicePercent, firstPercent, miniPercent, reflectionPercent, learningScore, coreCalculationsCorrect: Boolean(game?.passed), reflectionCompleted: Boolean(ledger.CH05_R1 && ledger.CH05_R2) };
}
