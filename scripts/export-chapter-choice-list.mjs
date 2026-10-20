import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chapter1V2GameData as ch1 } from '../src/pages/User/Dashboard/data/chapter1V2VisualNovel.js';
import { chapter2V2GameData as ch2 } from '../src/pages/User/Dashboard/data/chapter2V2VisualNovel.js';
import { chapter3V2GameData as ch3 } from '../src/pages/User/Dashboard/data/chapter3V2VisualNovel.js';
import { chapter4V2GameData as ch4 } from '../src/pages/User/Dashboard/data/chapter4V2VisualNovel.js';
import { chapter5V2GameData as ch5 } from '../src/pages/User/Dashboard/data/chapter5V2VisualNovel.js';
import { chapter6V2GameData as ch6 } from '../src/pages/User/Dashboard/data/chapter6V2VisualNovel.js';
import { chapter7V2GameData as ch7 } from '../src/pages/User/Dashboard/data/chapter7V2VisualNovel.js';
import { chapter8V2GameData as ch8 } from '../src/pages/User/Dashboard/data/chapter8V2VisualNovel.js';
import { buildShoppingOffers, INSPECTIONS, evaluatePurchase } from '../src/pages/User/Dashboard/components/game/shoppingMissionRules.js';
import { challenges, gradeReflection } from '../src/pages/User/Dashboard/components/game/compoundTimelineRules.js';
import { loanTasks, loanOffers, loanTotal, sortTargets, bnplItems, statementOptions, statementOutcome } from '../src/pages/User/Dashboard/components/game/loanDetectiveRules.js';
import { safetyTasks, insurancePayments, insuranceDocuments, requiredDocuments, safetyMessages, responseActions } from '../src/pages/User/Dashboard/components/game/scamOrSafeRules.js';
import { futureTasks, claimChecks, planMonths, allocationAssets, availableBudget } from '../src/pages/User/Dashboard/components/game/futurePlanRules.js';
import { chapterMiniGameSummary } from '../src/pages/User/Dashboard/components/game/miniGameRules.js';

const root = new URL('../', import.meta.url);
const sourceDir = 'src/pages/User/Dashboard/components/game/';
const activitySource = await readFile(new URL(`${sourceDir}ChapterFiveActivities.jsx`, root), 'utf8');
const informationSource = activitySource.match(/const information = \[([\s\S]*?)\];/);
assert.ok(informationSource, 'Missing reflection information options');
const reflectionInformation = [...informationSource[1].matchAll(/\['([^']+)', '([^']+)'\]/g)].map(([, id, label]) => ({ id, label }));
function selectOptions(field) {
  const select = activitySource.match(new RegExp(`<select value=\\{${field}\\}[\\s\\S]*?</select>`));
  assert.ok(select, `Missing reflection select ${field}`);
  return [...select[0].matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].map(([, id, label]) => ({ id, label }));
}
const reflectionOptions = {
  reflection1: { selected: reflectionInformation, method: selectOptions('method') },
  reflection2: { action: selectOptions('action'), date: selectOptions('date') },
};
assert.equal(reflectionInformation.length, 8);
const criterion = (id, round, label, correctWhen, answer = null) => ({ id, round, label, correctWhen, answer, correctPoints: 1, incorrectPoints: 0 });
const shoppingGame = ch4.scenes.find(scene => scene.game?.id === 'SMART_SHOPPING_CH04').game;
const shoppingCriteria = evaluatePurchase({ offer: buildShoppingOffers(shoppingGame.phones)[0], inspected: [], cancellationDay: '', disputedLine: '', budget: shoppingGame.budget, reserve: shoppingGame.reserve }).criteria;
const shoppingRules = [
  ['offer.works === true', 'Máy đáp ứng việc học.'],
  ['budget - totalCost >= reserve', 'Sau tiền máy, thuê bao, pin và phí vẫn giữ được ít nhất 500.000đ.'],
  ['relevantChecks === 3', 'Mở đủ ba hồ sơ ứng dụng, pin và điều khoản của chính máy mua.'],
  ['fee === 0 && (!offer.monthly || cancelled) && batteryManaged', 'Loại bỏ phí sai; máy A hủy trước gia hạn; máy B đo pin và chọn giữ/thay pin.'],
];
const rubrics = {
  SMART_SHOPPING_CH04: {
    source: `${sourceDir}shoppingMissionRules.js`,
    criteria: shoppingCriteria.map((item, i) => criterion(item.id, 0, item.title, shoppingRules[i][0], shoppingRules[i][1])),
    context: { budget: shoppingGame.budget, reserve: shoppingGame.reserve, offers: shoppingGame.phones, checks: INSPECTIONS },
    submission: 'Điểm xét ending lấy lần thanh toán đầu tiên. Thử phương án khác chỉ để luyện tập, không thay điểm lần đầu.',
  },
  COMPOUND_TIMELINE_CH05: {
    source: `${sourceDir}compoundTimelineRules.js`,
    criteria: challenges.map(q => ({ ...criterion(q.id, q.round, q.prompt, typeof q.answer === 'number' ? `Number(answer) === ${q.answer}` : `answer === ${JSON.stringify(q.answer)}`, q.answer), options: q.options || null, explanation: q.feedback, competency: q.competency })),
    submission: 'Nộp một lần ở mỗi vòng. Mỗi câu đúng được 1 điểm; câu sai vẫn được xem lời giải và tiếp tục.',
  },
};
const needsGame = ch1.scenes.find(scene => scene.game?.id === 'NEEDS_OR_WANTS_CH01').game;
rubrics[needsGame.id] = {
  source: `${sourceDir}NeedWantMiniGame.jsx`,
  criteria: needsGame.items.map(item => ({ ...criterion(item.id, 0, item.label, `placements.${item.id} === ${JSON.stringify(item.category)}`, { target: item.category, label: item.category === 'NEEDS' ? 'Giỏ Cần' : 'Giỏ Muốn' }), explanation: item.explanation })),
  context: { passScore: needsGame.passScore, items: needsGame.items },
  submission: 'Có thể xếp lại sau khi kiểm tra. Điểm chuyển về câu chuyện là số món đúng lúc bấm Tiếp tục; không khóa điểm lần kiểm tra đầu.',
};
const budgetGame = ch2.scenes.find(scene => scene.game?.id === 'BUDGET_BUILDER_CH02').game;
rubrics[budgetGame.id] = {
  source: `${sourceDir}BudgetBuilderMiniGame.jsx`,
  criteria: budgetGame.dropZones.map(zone => criterion(zone.id, 0, zone.label, `assignedAmount.value === ${zone.expectedValue}`, zone.expectedValue)),
  context: { draggables: budgetGame.draggables, dropZones: budgetGame.dropZones, passScore: budgetGame.dropZones.length },
  submission: 'Mỗi phong bì có đúng số tiền được 1 điểm. Hai thẻ 200.000đ có thể đổi chỗ vì chấm theo giá trị. Có thể chỉnh lại; điểm lưu khi bấm Tiếp tục.',
};
const savingsGame = ch2.scenes.find(scene => scene.game?.id === 'SAVINGS_RACE_CH02').game;
rubrics[savingsGame.id] = {
  source: `${sourceDir}SavingsRaceMiniGame.jsx`, criteria: [], scoreMode: 'outcome-only',
  context: { targetAmount: savingsGame.targetAmount, durationSeconds: 60, outcomes: ['success', 'failed'], successWhen: 'saved >= game.targetAmount' },
  submission: 'Hứng tiền, tránh khoản chi để đạt mục tiêu 6.000.000đ trong 60 giây. Chỉ trả về success/failed, không trả score/total; không cộng điểm mini-game của chương.',
};
const careerGame = ch3.scenes.find(scene => scene.game?.id === 'CAREER_MATCH_CH03').game;
rubrics[careerGame.id] = {
  source: `${sourceDir}CareerMatchMiniGame.jsx`,
  criteria: [
    ...careerGame.jobs.map(job => criterion(job.id, 0, `${job.name}: ${job.hours} giờ/tuần`, `(verdict === 'fit') === (${job.hours} <= ${careerGame.weeklyLimit})`, { target: job.hours <= careerGame.weeklyLimit ? 'fit' : 'over', label: job.hours <= careerGame.weeklyLimit ? 'Vừa lịch' : 'Quá giờ' })),
    ...careerGame.questions.map(question => ({ ...criterion(question.id, 1, question.title, `picked.${question.id} === ${JSON.stringify(question.correctId)}`, { target: question.correctId, label: question.options.find(option => option.id === question.correctId).label }), options: question.options, explanation: question.explain })),
  ],
  context: { weeklyLimit: careerGame.weeklyLimit, jobs: careerGame.jobs, questions: careerGame.questions },
  submission: 'Ghép lịch giữ điểm lần kiểm tra đầu. Phần tính toán lấy đáp án đang chọn khi kết thúc; có thể đổi đáp án sai, đáp án đúng thì khóa. Tổng điểm = điểm ghép lịch lần đầu + số phép tính đúng.',
};
const loanCriteria = [
  ...loanOffers.map(offer => criterion(`receipt${offer.id}`, 0, `Tổng trả gói vay ${offer.id}`, `Number(totals.${offer.id}) === ${loanTotal(offer)}`, loanTotal(offer))),
  ...loanOffers.map(offer => criterion(`sort${offer.id}`, 1, `Ghép gói vay ${offer.id}`, `sorted.${offer.id} === ${JSON.stringify(sortTargets[offer.id])}`, { target: sortTargets[offer.id], label: { over: 'Vượt tiền tháng', fit: 'Vừa ngân sách', shortfall: 'Thiếu tiền mua máy' }[sortTargets[offer.id]] })),
  criterion('cartNeed', 2, 'Giỏ hàng đáp ứng yêu cầu', "basket.includes('headphones') && basket.length >= 2", 'Có tai nghe và ít nhất một món khác.'),
  criterion('cartBudget', 2, 'Đủ tiền trả cả ba tháng', 'forecast.months.every(month => month.remaining >= 0)', 'Tháng 2 có thêm khoản 200.000đ; tổng trả góp mỗi tháng không quá 300.000đ.'),
  criterion('statementLiving', 3, 'Giữ đủ tiền sinh hoạt', '1200000 - payment >= 400000', 'Sau trả nợ còn ít nhất 400.000đ.'),
  criterion('statementCost', 3, 'Giới hạn lãi kỳ sau', 'Math.round((1000000 - payment) * 0.02) <= 5000', 'Lãi mô phỏng kỳ sau không vượt 5.000đ.'),
];
assert.deepEqual(loanCriteria.map(c => c.id), loanTasks.map(c => c.id));
for (const scene of ch6.scenes.filter(s => s.type === 'minigame')) {
  const rounds = scene.game.rounds;
  rubrics[scene.game.id] = { source: `${sourceDir}loanDetectiveRules.js`, criteria: loanCriteria.filter(c => rounds.includes(c.round)),
    context: { loanOffers, bnplItems, statementOptions: statementOptions.map(option => ({ ...statementOutcome(option.id), score: Number(statementOutcome(option.id).livingCovered) + Number(statementOutcome(option.id).costCovered) })) },
    submission: 'Chỉ chấm khi nộp; đáp án được giữ nguyên sau khi nộp mỗi màn.' };
}
const safetyCriteria = [
  criterion('insurancePayment', 0, 'Khoản cần thanh toán hôm nay', 'payment === 300000', 300000),
  criterion('insurancePacket', 0, 'Bộ giấy tờ cần nộp', 'documents.length === 3 && requiredDocuments.every(id => documents.includes(id))', requiredDocuments),
  ...safetyMessages.map(message => ({ ...criterion(message.id, 1, message.channel, `messages.${message.id} === ${JSON.stringify(message.answer)}`, message.answer), message: message.text, context: message.context, explanation: message.explanation })),
  criterion('response_stop', 2, 'Dừng gửi mã và thông tin', "response[0] === 'stop'", 'Đặt đầu tiên.'),
  criterion('response_contact', 2, 'Báo ngân hàng', "[1, 2].includes(response.indexOf('contact'))", 'Vị trí 2 hoặc 3; có thể đổi chỗ với thao tác khóa tài khoản.'),
  criterion('response_protect', 2, 'Khóa thẻ hoặc tài khoản', "[1, 2].includes(response.indexOf('protect'))", 'Vị trí 2 hoặc 3; có thể đổi chỗ với thao tác báo ngân hàng.'),
  criterion('response_save', 2, 'Lưu chứng từ và báo cáo', "response[3] === 'save'", 'Đặt cuối cùng.'),
];
assert.deepEqual(safetyCriteria.map(c => c.id), safetyTasks.map(c => c.id));
for (const scene of ch7.scenes.filter(s => s.type === 'minigame')) {
  rubrics[scene.game.id] = { source: `${sourceDir}scamOrSafeRules.js`, criteria: safetyCriteria.filter(c => scene.game.rounds.includes(c.round)),
    context: { insurancePayments, insuranceDocuments, requiredDocuments, responseActions, answerLabels: { check: 'Chưa làm theo, tìm nơi khác để hỏi lại', continue: 'Tiếp tục làm theo hướng dẫn' } },
    submission: 'Nộp một lần ở mỗi màn. Mỗi tin nhắn hoặc tiêu chí xử lý đúng được 1 điểm.' };
}
const futureCriteria = [
  criterion('allocation_near', 0, 'Bảo vệ tiền khóa học', 'allocation.cash >= 30', 'Ít nhất 30 điểm (3.000.000đ) ở giỏ tiền dễ rút.'),
  criterion('allocation_spread', 0, 'Chia phần đầu tư', 'allocation.bonds > 0 && allocation.equity > 0', 'Có tiền ở cả trái phiếu và cổ phiếu.'),
  ...claimChecks.filter(check => check.correct).map(check => ({ ...criterion(`claim_${check.id}`, 1, check.label, `checks.includes(${JSON.stringify(check.id)})`, check.id), explanation: check.detail })),
  ...planMonths.map(month => criterion(`plan_${month.id}`, 2, month.label, `budget.goal > 0 && budget.flexible >= 0 && budget.goal + budget.flexible <= ${availableBudget(month)}`, 'Có tiền đưa vào quỹ học tập và không chia quá tiền còn sau chi bắt buộc.')),
];
assert.deepEqual(futureCriteria.map(c => c.id), futureTasks);
for (const scene of ch8.scenes.filter(s => s.type === 'minigame')) {
  const round = { portfolio: 0, claims: 1, planner: 2 }[scene.game.kind];
  rubrics[scene.game.id] = { source: `${sourceDir}futurePlanRules.js`, criteria: futureCriteria.filter(c => c.round === round),
    context: { portfolio: { totalPoints: 100, amountPerPoint: 100000, nearGoal: 3000000, marketRangePercent: [-10, 10], investmentReturnAffectsScore: false, assets: allocationAssets }, claims: { selectedCount: 3, options: claimChecks }, planner: { months: planMonths.map(month => ({ ...month, available: availableBudget(month) })), initialBudget: { goal: 0, flexible: 0 } } }[scene.game.kind],
    submission: 'Đáp án được chấm một lần khi nộp. Lãi/lỗ ngẫu nhiên của thị trường không làm thay đổi điểm.' };
}

function withoutImages(value) {
  if (Array.isArray(value)) return value.map(withoutImages);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'image').map(([key, item]) => [key, withoutImages(item)]));
  return value;
}
const sourcePaths = [
  ...[1, 2, 3, 4, 5, 6, 7, 8].map(number => `src/pages/User/Dashboard/data/chapter${number}V2VisualNovel.js`),
  ...['miniGameRules.js', 'shoppingMissionRules.js', 'compoundTimelineRules.js', 'scamOrSafeRules.js', 'loanDetectiveRules.js', 'futurePlanRules.js', 'VisualNovelPlayer.jsx', 'SmartShoppingMiniGame.jsx', 'ChapterFiveActivities.jsx', 'NeedWantMiniGame.jsx', 'BudgetBuilderMiniGame.jsx', 'SavingsRaceMiniGame.jsx', 'CareerMatchMiniGame.jsx'].map(name => sourceDir + name),
];
const document = {
  schemaVersion: 2, kind: 'chapter-choice-and-scoring-reference', language: 'vi', chapterRange: [1, 8],
  description: 'Bảng tra cứu các lựa chọn có thể chọn và cách chấm trong code; không phải nhật ký của một người chơi hay một lượt chơi thực tế.',
  regenerate: 'node scripts/export-chapter-choice-list.mjs',
  sources: await Promise.all(sourcePaths.map(async path => ({ path, sha256: createHash('sha256').update(await readFile(new URL(path, root))).digest('hex') }))),
  scoring: { appliesToChapters: [4, 5, 6, 7, 8], correctPoints: 1, incorrectPoints: 0, goalMinimumPercent: 75, recoveryBelowPercent: 50, requireAllGamesCompletedForA: true, scoreDisplayDuringPlay: false,
    notes: ['Tính trên tổng số câu/tiêu chí của chương; không lấy trung bình phần trăm các mini-game có số câu khác nhau.', 'Điểm mini-game kết hợp với stats, cờ lựa chọn, điểm bằng chứng và điều kiện riêng của chương. Điểm cao không tự bảo đảm ending A.', 'Từ 50% đến dưới 75% xét B nếu không vướng điều kiện C. Dưới 50% sau khi hoàn thành đủ bài sẽ xét C trước A.', 'Chương 4–5 còn có điểm phản tư trong điều kiện ending hiện tại. Điểm này tách riêng với điểm mini-game.'], implementation: { path: `${sourceDir}miniGameRules.js`, function: 'chapterMiniGameSummary', source: chapterMiniGameSummary.toString() } },
  chapters: [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8].map((data, index) => {
    const games = data.scenes.filter(scene => scene.type === 'minigame').map(scene => ({ sceneId: scene.id, gameId: scene.game.id, title: scene.game.title, nextSceneId: scene.nextSceneId, ...withoutImages(rubrics[scene.game.id]) }));
    const maximum = games.reduce((sum, game) => sum + game.criteria.length, 0);
    if (data.endingReport?.miniGameMax != null) assert.equal(maximum, data.endingReport.miniGameMax, data.id);
    const choices = data.scenes.filter(scene => scene.type === 'choice').map(scene => ({ sceneId: scene.id, choiceGroup: scene.choiceGroup || scene.id, prompt: scene.prompt || scene.text || scene.title,
      options: scene.options.map(option => ({ optionId: option.id, label: option.label, deltaStats: option.deltaStats || option.effects || {}, evidenceScores: option.evidenceScores || null,
        reflectionScore: option.reflectionScore || 0, reflectionEvidenceScores: option.reflectionEvidenceScores || null,
        flag: option.flag || null, setFlags: option.setFlags || {}, requires: option.requires || {}, condition: option.condition || null, moneyEvents: option.moneyEvents || [], nextSceneId: option.nextSceneId || null })) }));
    const chapter = index + 1;
    const scoringNote = chapter === 1 ? 'Ending A cần tiền còn lại ít nhất 500.000đ và miniGameScore >= 5. Ending B xét kết hợp tiền với điểm; đọc nguyên điều kiện bên dưới, không dùng ngưỡng 75%/50%.'
      : chapter === 2 ? 'Ending hiện tại dựa vào cờ xử lý sự cố risk_handled_buffer/risk_handled_savings. Budget Builder có điểm, nhưng điểm không trực tiếp xuất hiện trong điều kiện ending. Savings Race chỉ có kết quả thành công/thất bại.'
      : chapter === 3 ? 'Ending A hiện tại cần hoàn thành mini-game cùng các điều kiện lựa chọn, stats, bằng chứng và phản tư; không yêu cầu một ngưỡng điểm mini-game cụ thể. Điểm có trong báo cáo học tập.'
      : 'Dùng điểm đúng/sai với ngưỡng 75%/50%, kết hợp các điều kiện riêng trong endingRules.';
    return { chapter, chapterId: data.metadata.chapterId, id: data.id, title: data.title, version: data.version, initialStats: data.initialStats, initialMoney: data.initialMoney,
      choiceCount: choices.reduce((sum, scene) => sum + scene.options.length, 0), choices,
      additionalScoredActivities: data.scenes.filter(scene => scene.type === 'activity').map(scene => ({ sceneId: scene.id, kind: scene.activity, title: scene.title, completionOption: scene.completionOption, options: reflectionOptions[scene.activity], deltaStats: {}, maxScore: 6, scoringSource: gradeReflection.toString() })),
      miniGameMax: maximum, minimumCorrectForA: chapter === 1 ? 5 : chapter >= 4 ? Math.ceil(maximum * .75) : null, maximumCorrectForScoreBasedC: chapter >= 4 ? Math.ceil(maximum * .5) - 1 : null,
      scoringNote, miniGames: games, endingRules: data.endingRules, endingReport: data.endingReport || null,
      automaticSceneEffects: data.scenes.filter(scene => scene.setFlags || scene.effects || scene.inspect?.effects || scene.inspect?.moneyEvents?.length || scene.marketSettlement || scene.moneyEvents?.length).map(scene => ({ sceneId: scene.id, setFlags: scene.setFlags || {}, effects: scene.effects || {}, moneyEvents: scene.moneyEvents || [], inspection: scene.inspect ? { id: scene.inspect.id, effects: scene.inspect.effects || {}, moneyEvents: scene.inspect.moneyEvents || [] } : null, marketSettlement: Boolean(scene.marketSettlement) })),
      conditionalRoutes: data.scenes.filter(scene => scene.type === 'conditional').map(scene => ({ sceneId: scene.id, condition: scene.condition, ifTrueSceneId: scene.ifTrueSceneId, ifFalseSceneId: scene.ifFalseSceneId })) };
  }),
};
const cell = value => String(value ?? '—').replaceAll('|', '\\|').replaceAll('\n', '<br>');
const json = value => JSON.stringify(value);
const changes = value => Object.entries(value).map(([key, amount]) => `${key} ${amount > 0 ? '+' : ''}${amount}`).join('; ') || 'Không đổi';
function readableAnswer(task, game) {
  if (Array.isArray(task.answer)) return task.answer.map(id => game.context?.insuranceDocuments?.find(document => document.id === id)?.label || id).join('; ');
  if (task.answer && typeof task.answer === 'object') return task.answer.label || json(task.answer);
  if (typeof task.answer === 'number') return `${task.answer.toLocaleString('vi-VN')}đ`;
  return game.context?.answerLabels?.[task.answer] || task.answer;
}
const lines = ['# Lựa chọn, stats và điểm mini-game — Chương 1–8', '', document.description, '',
  'Hai file `.md` và `.json` được xuất cùng lúc từ code. Chạy lại bằng: `node scripts/export-chapter-choice-list.mjs`.', '',
  '## Cách đọc', '',
  '- `deltaStats`: mức tăng/giảm stats của lựa chọn; `{}` nghĩa là không đổi.',
  '- `I / C / P`: điểm bằng chứng về thông tin / tính toán / lập kế hoạch, tách biệt với stats và điểm mini-game.',
  '- `setFlags`: trạng thái mà lựa chọn ghi lại; `false` có ý nghĩa xóa trạng thái tương ứng.',
  '- Với các mini-game có điểm, mỗi câu hoặc tiêu chí đúng được **1 điểm**, sai được **0 điểm**. Savings Race chương 2 chỉ có kết quả thành công/thất bại.',
  '- Ngưỡng 75%/50% và việc ẩn số điểm trong màn chơi bên dưới áp dụng cho chương 4–8. Chương 1–3 được ghi đúng cơ chế hiện tại, không áp ngưỡng mới vào tài liệu.',
  ...document.scoring.notes.map(note => `- ${note}`), '',
  '| Chương | Số lựa chọn trong code | Tổng điểm mini-game | Đủ điểm xét A | Điểm thấp xét C |', '| --- | ---: | ---: | ---: | ---: |',
  ...document.chapters.map(chapter => `| ${chapter.chapter}. ${chapter.title} | ${chapter.choiceCount} | ${chapter.miniGameMax} | ${chapter.minimumCorrectForA === null ? 'Không quy định ngưỡng điểm' : `${chapter.minimumCorrectForA}–${chapter.miniGameMax}${chapter.chapter === 1 ? ' + điều kiện tiền' : ''}`} | ${chapter.maximumCorrectForScoreBasedC === null ? 'Theo điều kiện riêng' : `0–${chapter.maximumCorrectForScoreBasedC}`} |`), '',
  'Các hàng lựa chọn dưới đây bao gồm cả nhánh thay thế, xác nhận thanh toán và phản tư nếu chương có. Một lượt chơi không đi qua toàn bộ các hàng.', ''];
for (const chapter of document.chapters) {
  lines.push(`## Chương ${chapter.chapter}: ${chapter.title}`, '', `Stats ban đầu: ${Object.entries(chapter.initialStats).map(([key, value]) => `${key} = ${value}`).join('; ')}. Tiền ban đầu: ${chapter.initialMoney.toLocaleString('vi-VN')}đ.`, '', '### Các lựa chọn', '');
  for (const scene of chapter.choices) {
    lines.push(`#### ${scene.sceneId}`, '', scene.prompt, '', `Nhóm lưu quyết định: \`${scene.choiceGroup}\`.`, '', '| Mã lựa chọn | Nội dung | Đổi stats | Điểm bằng chứng | Phản tư |', '| --- | --- | --- | --- | ---: |');
    for (const option of scene.options) lines.push(`| ${cell(option.optionId)} | ${cell(option.label)} | ${cell(changes(option.deltaStats))} | ${cell(option.evidenceScores ? json(option.evidenceScores) : 'Không chấm')} | ${option.reflectionScore} |`);
    lines.push('');
    for (const option of scene.options) lines.push(`- **${option.optionId}**: ${option.flag ? `cờ chính \`${option.flag}\`; ` : ''}trạng thái \`${json(option.setFlags)}\`; điều kiện chọn \`${json(option.requires)}\`${option.condition ? `; điều kiện bổ sung \`${json(option.condition)}\`` : ''}; giao dịch \`${json(option.moneyEvents)}\`; đi tới \`${option.nextSceneId || 'không có'}\`.`);
    lines.push('');
  }
  lines.push('### Điểm mini-game', '', chapter.scoringNote, '');
  for (const game of chapter.miniGames) {
    lines.push(`#### ${game.title} — ${game.scoreMode === 'outcome-only' ? 'không có điểm số' : `${game.criteria.length} điểm`}`, '', `Mã: \`${game.gameId}\`. Nguồn chấm: \`${game.source}\`.`, '', game.submission, '');
    if (game.criteria.length) lines.push('| Mã tiêu chí | Câu hỏi / mục tiêu | Đáp án hoặc điều kiện được 1 điểm |', '| --- | --- | --- |');
    for (const task of game.criteria) lines.push(`| ${task.id} | ${cell(task.label)} | ${cell(readableAnswer(task, game))} |`);
    lines.push('');
    for (const task of game.criteria) {
      if (task.message) lines.push(`- **${task.id}** — Tin nhắn: ${task.message} Bối cảnh: ${task.context}`);
      if (task.explanation) lines.push(`- **${task.id}** — Giải thích: ${task.explanation}`);
    }
    if (game.gameId === 'LOAN_REPAYMENT_CH06') {
      lines.push('', '| Cách trả nợ | Trả ngay | Đủ sinh hoạt | Lãi kỳ sau ≤ 5.000đ | Điểm |', '| --- | ---: | --- | --- | ---: |');
      for (const outcome of game.context.statementOptions) lines.push(`| ${outcome.label} | ${outcome.amount.toLocaleString('vi-VN')}đ | ${outcome.livingCovered ? 'Đúng' : 'Chưa đúng'} | ${outcome.costCovered ? 'Đúng' : 'Chưa đúng'} | ${outcome.score}/2 |`);
    }
    lines.push('');
  }
  if (chapter.additionalScoredActivities.length) {
    lines.push('### Hoạt động được chấm riêng', '', 'Hai hoạt động này không đổi stats hoặc tiền, không cộng vào điểm mini-game. Mỗi hoạt động tối đa 6 điểm phản tư; tổng tối đa 12.', '');
    for (const activity of chapter.additionalScoredActivities) {
      lines.push(`#### ${activity.sceneId}: ${activity.title}`, '', '| Nhóm nhập | Mã | Lựa chọn |', '| --- | --- | --- |');
      for (const [field, options] of Object.entries(activity.options)) for (const option of options) lines.push(`| ${field} | ${option.id} | ${cell(option.label)} |`);
      lines.push('', activity.kind === 'reflection1'
        ? 'Cách chấm: I = 2 nếu chọn ít nhất 4 trong deadline/withdrawal/fees/provider/protection và không chọn color/friend; I = 1 nếu chọn ít nhất 2 thông tin liên quan; còn lại 0. C = 2 nếu chọn net, còn lại 0. P = 2 nếu có deadline + withdrawal + fees; chỉ có deadline thì P = 1; không có deadline thì P = 0.'
        : 'Cách chấm: hành động có cơ sở là revise, hoặc keepB khi đã chọn B rút sớm, hoặc verified khi nguồn bù đã được xác nhận. I và C mỗi mục được 2 nếu hành động có cơ sở, còn lại 0. P = 2 khi hành động có cơ sở và chọn month1/month2; chỉ chọn đúng mốc thì P = 1; còn lại 0.', '');
    }
  }
  lines.push('### Điều kiện ending thực tế', '', `Thứ tự xét: ${chapter.endingRules.priorityOrder.join(' → ')}. Gặp điều kiện đúng đầu tiên thì chọn ending đó.`, '');
  for (const ending of chapter.endingRules.endings) lines.push(`**${ending.title}**`, '', '```js', ending.condition, '```', '', ending.storyText, '');
}
lines.push('## Nguồn dữ liệu', '', ...document.sources.map(source => `- \`${source.path}\` — SHA-256: \`${source.sha256}\``), '', 'JSON giữ thêm điều kiện rẽ nhánh, hiệu ứng tự động của cảnh, dữ kiện mini-game, trọng số học tập và hàm xét điểm để máy có thể đối chiếu.', '');
await mkdir(new URL('docs/', root), { recursive: true });
await writeFile(new URL('docs/chapter-04-08-choice-scoring-list.json', root), `${JSON.stringify(document, null, 2)}\n`, 'utf8');
await writeFile(new URL('docs/chapter-04-08-choice-scoring-list.md', root), lines.join('\n'), 'utf8');
console.log(JSON.stringify({ chapters: document.chapters.length, choices: document.chapters.reduce((sum, chapter) => sum + chapter.choiceCount, 0), criteria: document.chapters.reduce((sum, chapter) => sum + chapter.miniGameMax, 0), files: ['docs/chapter-04-08-choice-scoring-list.md', 'docs/chapter-04-08-choice-scoring-list.json'].map(path => fileURLToPath(new URL(path, root))) }, null, 2));
