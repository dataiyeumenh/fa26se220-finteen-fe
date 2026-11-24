// Approved mapping: docs/knowledge-base/bao-cao-duyet-noi-dung-2026-11-23.md, Task 2.
// Pure transformation: apply to a fresh Studio draft, then PUT only the returned content.
const group = (concept, ids) => Object.fromEntries(ids.map(id => [id, concept]));
const career = {
  ...group('D02.04', ['commission', 'design', 'small-business']),
  net_salary: 'D02.02', profit: 'D02.05', low_month: 'D02.07',
};
const compound = {
  ...group('D04.05', ['growth', 'simple', 'compound', 'difference', 'aInterest', 'bInterest']),
  ...group('D04.06', ['basket', 'power']),
  ...group('D04.04', ['aFees', 'aBalance', 'aGap', 'bBalance']),
};
const loans = {
  ...group('D06.02', ['receiptA', 'receiptB', 'receiptC']),
  ...group('D06.06', ['sortA', 'sortB', 'sortC', 'statementLiving']),
  cartNeed: 'D01.02', cartBudget: 'D06.08', statementCost: 'D06.05',
};
const safety = {
  ...group('D07.04', ['insurancePayment', 'insurancePacket', 'claimStatus']),
  ...group('D07.06', ['instantRefund', 'fakeLink', 'remoteApp', 'verifiedSupport']),
  officialDesk: 'D07.08',
  ...group('D07.10', ['response_stop', 'response_contact', 'response_protect', 'response_save']),
};
const investing = {
  allocation_near: 'D05.06', allocation_spread: 'D05.05',
  claim_risk: 'D08.01', claim_commission: 'D08.07', claim_esg: 'D05.09',
  plan_normal: 'D04.02', plan_low: 'D02.07', plan_prices: 'D08.08',
};
export const SCENE_CONCEPTS = {
  CH01_SC03_MINIGAME: { single: 'D01.02', count: 6 },
  CH02_SC02_BUDGET_BUILDER: { single: 'D03.01', count: 6 },
  CH02_SC03_SAVINGS_RACE: { single: 'D04.02', count: 0 },
  CH03_SC03_CAREER_MATCH: { mapping: career, count: 6 },
  CH04_SC02_GAME: { single: 'D03.04', count: 3 },
  CH05_GAME: { mapping: compound, count: 12 },
  CH06_GAME_OFFERS: { mapping: loans, count: 10, parts: [0, 1], activeCount: 6 },
  CH06_GAME_REPAYMENT: { mapping: loans, count: 10, parts: [2, 3], activeCount: 4 },
  CH07_GAME_INSURANCE: { mapping: safety, count: 12, parts: [0], activeCount: 2 },
  CH07_GAME_SAFETY: { mapping: safety, count: 12, parts: [1, 2], activeCount: 10 },
  CH08_GAME_PORTFOLIO: { mapping: investing, count: 8, parts: ['portfolio'], activeCount: 2 },
  CH08_GAME_CLAIMS: { mapping: investing, count: 8, parts: ['claims'], activeCount: 3 },
  CH08_GAME_PLANNER: { mapping: investing, count: 8, parts: ['planner'], activeCount: 3 },
};

export function applyMinigameConcepts(content, code = content.metadata?.chapterId) {
  if (!Array.isArray(content.scenes)) throw new Error('Draft must contain scenes');
  const result = structuredClone(content);
  const expectedScenes = Object.keys(SCENE_CONCEPTS).filter(id => id.startsWith(`${code}_`));
  if (!expectedScenes.length) throw new Error(`Unknown chapter: ${code}`);
  const audit = [];
  for (const sceneId of expectedScenes) {
    const matches = result.scenes.filter(scene => scene.id === sceneId);
    if (matches.length !== 1 || !matches[0].game) throw new Error(`Missing or duplicate game: ${sceneId}`);
    const scene = matches[0], spec = SCENE_CONCEPTS[sceneId];
    if (spec.parts) {
      const actualParts = scene.game.config?.mode ? [scene.game.config.mode] : scene.game.rounds;
      if (JSON.stringify(actualParts) !== JSON.stringify(spec.parts)) throw new Error(`Game parts changed: ${sceneId}`);
    }
    const grades = [], ids = new Set();
    function visit(node, path = 'game') {
      if (!node || typeof node !== 'object') return;
      if (node.grade) {
        const id = node.grade.id ?? node.id ?? path.split('.').at(-1);
        const concept = spec.single ?? spec.mapping[id];
        if (!concept || ids.has(id)) throw new Error(`Unknown or duplicate grade: ${sceneId}/${id}`);
        ids.add(id);
        node.grade.concept = concept;
        grades.push({ id, path: `${path}.grade.concept`, concept, part: node.grade.part });
      }
      for (const [key, value] of Object.entries(node)) if (key !== 'grade') visit(value, `${path}.${key}`);
    }
    visit(scene.game);
    if (grades.length !== spec.count) throw new Error(`Grade count changed: ${sceneId}: ${grades.length} != ${spec.count}`);
    const active = grades.filter(g => !spec.parts || spec.parts.includes(g.part));
    if (active.length !== (spec.activeCount ?? spec.count)) throw new Error(`Active grade count changed: ${sceneId}`);
    // A single code also supports BE's scene-level fallback. Savings Race has no grades.
    scene.knowledgeUnits = [...new Set(spec.single ? [spec.single] : active.map(g => g.concept))];
    audit.push({ sceneId, knowledgeUnits: scene.knowledgeUnits, gradedQuestions: active.length, practiceOnly: spec.count === 0, grades });
  }
  result.metadata ??= {};
  result.metadata.allKnowledgeUnits = [...new Set([
    ...(result.metadata.allKnowledgeUnits || []),
    ...result.scenes.flatMap(scene => scene.knowledgeUnits || []),
  ])];
  return { content: result, audit };
}
