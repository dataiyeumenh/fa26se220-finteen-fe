import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyMinigameConcepts } from '../scripts/content-migrations/minigame-concepts-2026-11-24.mjs';

const load = n => JSON.parse(readFileSync(new URL(`./fixtures/content/CH0${n}.json`, import.meta.url)));
function withoutMapping(content) {
  const clone = structuredClone(content);
  delete clone.metadata.allKnowledgeUnits;
  for (const scene of clone.scenes) {
    if (!scene.game) continue;
    delete scene.knowledgeUnits;
    function walk(value) {
      if (!value || typeof value !== 'object') return;
      if (value.grade) delete value.grade.concept;
      for (const child of Object.values(value)) walk(child);
    }
    walk(scene.game);
  }
  return clone;
}

test('approved mapping covers 13 games and 63 active questions without changing content or rules', () => {
  const audits = [];
  for (let n = 1; n <= 8; n++) {
    const before = load(n), original = structuredClone(before);
    const { content, audit } = applyMinigameConcepts(before);
    assert.deepEqual(before, original, 'input draft must not be mutated');
    assert.deepEqual(withoutMapping(content), withoutMapping(before), 'only concepts and their lists may change');
    assert.deepEqual(applyMinigameConcepts(content).content, content, 'reapplying must be safe');
    for (const scene of audit) {
      for (const code of scene.knowledgeUnits) assert.ok(content.metadata.allKnowledgeUnits.includes(code));
      for (const grade of scene.grades) assert.match(grade.concept, /^D0[1-8]\.\d{2}$/);
    }
    audits.push(...audit);
  }
  assert.equal(audits.length, 13);
  assert.equal(audits.reduce((sum, scene) => sum + scene.gradedQuestions, 0), 63);
  const byScene = Object.fromEntries(audits.map(scene => [scene.sceneId, scene]));
  assert.deepEqual(byScene.CH02_SC02_BUDGET_BUILDER.knowledgeUnits, ['D03.01']);
  assert.deepEqual(byScene.CH02_SC03_SAVINGS_RACE.knowledgeUnits, ['D04.02']);
  assert.equal(byScene.CH02_SC03_SAVINGS_RACE.practiceOnly, true);
  const expected = {
    CH06_GAME_OFFERS: 6, CH06_GAME_REPAYMENT: 4,
    CH07_GAME_INSURANCE: 2, CH07_GAME_SAFETY: 10,
    CH08_GAME_PORTFOLIO: 2, CH08_GAME_CLAIMS: 3, CH08_GAME_PLANNER: 3,
  };
  for (const [id, count] of Object.entries(expected)) assert.equal(byScene[id].gradedQuestions, count);
  assert.deepEqual(byScene.CH08_GAME_PLANNER.knowledgeUnits, ['D04.02', 'D02.07', 'D08.08']);
  assert.equal(byScene.CH07_GAME_SAFETY.grades.find(g => g.id === 'response_stop').concept, 'D07.10');
  assert.equal(byScene.CH08_GAME_CLAIMS.grades.find(g => g.id === 'claim_esg').concept, 'D05.09');
});

test('migration stops on missing scenes, unknown questions or changed active parts', () => {
  const missing = load(1); missing.scenes = [];
  assert.throws(() => applyMinigameConcepts(missing), /Missing or duplicate game/);
  const changed = load(3);
  changed.scenes.find(s => s.id === 'CH03_SC03_CAREER_MATCH').game.questions[0].id = 'new_question';
  assert.throws(() => applyMinigameConcepts(changed), /Unknown or duplicate grade/);
  const part = load(6);
  part.scenes.find(s => s.id === 'CH06_GAME_OFFERS').game.config.tasks[0].grade.part = 2;
  assert.throws(() => applyMinigameConcepts(part), /Active grade count changed/);
  const mode = load(8);
  mode.scenes.find(s => s.id === 'CH08_GAME_PLANNER').game.config.mode = 'portfolio';
  assert.throws(() => applyMinigameConcepts(mode), /Game parts changed/);
});
