import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chapter5V2GameData as data } from "../src/pages/Kid/Dashboard/data/chapter5V2VisualNovel.js";
import {
  gradeRound,
  timelineAt,
  timelineResult,
  chapterFiveLearning,
  gradeReflection,
} from "../src/pages/Kid/Dashboard/components/game/compoundTimelineRules.js";
const scenes = new Map(data.scenes.map((scene) => [scene.id, scene]));
const timelineConfig = data.scenes.find(
  (scene) => scene.game?.kind === "COMPOUND_TIMELINE",
).game.config;
const challenges = timelineConfig.questions;
const answerOf = (id) => challenges.find((q) => q.id === id).answer;
const option = (id) =>
  data.scenes
    .flatMap((scene) => scene.options || [])
    .find((item) => item.id === id);
const perfectAnswers = Object.fromEntries(
  challenges.map((q) => [q.id, q.answer]),
);
function perfectHistory() {
  let history = {};
  for (let round = 0; round < 4; round++)
    history = gradeRound(challenges, round, perfectAnswers, history, [
      "A",
      "B",
      "deadline",
    ]);
  return history;
}
const game = {
  ...timelineResult(timelineConfig, perfectHistory()),
  gameId: "COMPOUND_TIMELINE_CH05",
};
const ledger = {
  CH05_PROVIDER: {
    evidenceScores: { I: 2, C: 1, P: 2 },
    firstEvidenceScores: { I: 2, C: 1, P: 2 },
  },
  CH05_PLAN: {
    evidenceScores: { I: 2, C: 2, P: 2 },
    firstEvidenceScores: { I: 0, C: 0, P: 0 },
  },
  CH05_R1: { reflectionScore: 6 },
  CH05_R2: { reflectionScore: 6 },
};
function ending(flags, extra = {}) {
  const values = {
    flags,
    RISK: 30,
    SAVING: 50,
    miniGameCompleted: true,
    reflectionScore: 12,
    ...chapterFiveLearning(ledger, { game }, data.endingReport),
    ...extra,
  };
  return data.endingRules.endings.find(
    (item) =>
      item.condition === "DEFAULT_FALLBACK" ||
      new Function(...Object.keys(values), `return ${item.condition}`)(
        ...Object.values(values),
      ),
  ).id;
}
test("all scenes are reachable, links and nested assets exist; no projected money becomes a transaction", () => {
  assert.equal(scenes.size, data.scenes.length);
  const reached = new Set();
  function visit(id) {
    if (!id || reached.has(id)) return;
    const scene = scenes.get(id);
    assert.ok(scene, id);
    reached.add(id);
    for (const target of [
      scene.nextSceneId,
      scene.reviewAction?.targetSceneId,
      ...(scene.options || []).map((item) => item.nextSceneId),
    ])
      visit(target);
  }
  visit(data.scenes[0].id);
  assert.equal(reached.size, scenes.size);
  function check(value) {
    if (typeof value === "string" && value.startsWith("/images/"))
      assert.ok(existsSync(`public${value}`), value);
    else if (value && typeof value === "object") {
      assert.ok(!value.moneyEvents?.length);
      Object.values(value).forEach(check);
    }
  }
  check(data);
  assert.equal(data.initialMoney, 1000000);
  assert.deepEqual(Object.keys(data.initialStats), [
    "SAVING",
    "HAPPINESS",
    "RISK",
    "GOAL",
  ]);
});
test("primary branches preserve the specified stats, pending state and mutually exclusive flags", () => {
  assert.deepEqual(option("CH05_SC02_A").deltaStats, { RISK: -1, GOAL: 1 });
  assert.equal(option("CH05_SC02_B").deltaStats, undefined);
  assert.ok(
    scenes
      .get("CH05_SC02")
      .options.every(
        (item) => item.deferLedger && !item.feedback && !item.evidenceScores,
      ),
  );
  assert.equal(option("CH05_AD_OPEN").nextSceneId, "CH05_AD_1");
  assert.equal(option("CH05_AD_COMPARE").nextSceneId, "CH05_PROVIDER_READ");
  assert.equal(
    option("CH05_PROVIDER_GENERALIZE").setFlags.provider_checked,
    false,
  );
  assert.deepEqual(option("CH05_SC04_A").deltaStats, { SAVING: 5, GOAL: 3 });
  assert.deepEqual(option("CH05_SC04_C").deltaStats, { GOAL: -3 });
  for (const id of ["CH05_ACCOUNT_A", "CH05_ACCOUNT_B"]) {
    assert.equal(option(id).deferLedger, true);
    assert.equal(option(id).deltaStats, undefined);
    assert.equal(option(id).feedback, undefined);
  }
  assert.equal(option("CH05_B_MATURITY").setFlags.account_mismatch, true);
  assert.equal(option("CH05_B_MATURITY").setFlags.term_maturity, true);
  assert.deepEqual(option("CH05_B_MATURITY").deltaStats, { GOAL: -3 });
  assert.equal(option("CH05_TOPUP_PROMISE").setFlags.account_pending, true);
  assert.deepEqual(option("CH05_TOPUP_VERIFIED").requires.inspected, [
    "ch05_topup_budget",
  ]);
  assert.equal(
    option("CH05_TOPUP_VERIFIED").setFlags.topup_source_verified,
    true,
  );
  for (const id of ["CH05_SC04", "CH05_PLAN_TOPUP", "CH05_TOPUP_CONFIRM"])
    assert.equal(scenes.get(id).choiceGroup, "CH05_PLAN");
  assert.equal(option("CH05_PROVIDER_FIXED"), undefined);
  assert.equal(scenes.has("CH05_PROVIDER_REVIEW"), false);
});
test("timeline, inflation and early withdrawal arithmetic match the spec", () => {
  assert.deepEqual(timelineAt(1, timelineConfig.timeline), { compound: 1050000, simple: 1050000 });
  assert.deepEqual(timelineAt(2, timelineConfig.timeline), { compound: 1102500, simple: 1100000 });
  assert.equal(timelineAt(2, timelineConfig.timeline).compound - timelineAt(2, timelineConfig.timeline).simple, 2500);
  assert.equal(1080000 - timelineAt(1, timelineConfig.timeline).compound, 30000);
  assert.equal(
    answerOf("aBalance"),
    1000000 + (1000000 * 0.03 * 3) / 12 - 5000 * 3,
  );
  assert.equal(answerOf("bBalance"), 1000000 + (1000000 * 0.02 * 3) / 12);
});
test("submitted mini-game answers cannot be changed or graded again", () => {
  const wrong = { ...perfectAnswers, aInterest: 0, bInterest: 15000 };
  const first = gradeRound(challenges, 3, wrong, {}, ["A"]);
  const revised = gradeRound(challenges, 3, perfectAnswers, first, ["B"]);
  assert.equal(revised.bInterest.firstAttempt, 15000);
  assert.equal(revised.bInterest.firstAttemptCorrect, false);
  assert.equal(revised.bInterest.finalCorrect, false);
  assert.equal(revised.bInterest.attemptCount, 1);
  assert.deepEqual(revised.bInterest.inspectedItems, ["A"]);
  assert.deepEqual(revised, first);
  const result = timelineResult(timelineConfig, perfectHistory());
  assert.equal(result.score, 12);
  assert.equal(result.total, challenges.length);
  assert.equal(result.passed, true);
  assert.equal(
    Object.values(result.competencies).reduce((n, c) => n + c.total, 0),
    result.total,
  );
  assert.equal(timelineResult(timelineConfig, {}).passed, false);
});
test("account comparison has two named accounts and a separate course reference; no age or replay choice", () => {
  for (const id of ["CH05_SC01_INSPECT", "CH05_SC04_DATA"]) {
    const inspect = scenes.get(id).inspect;
    assert.deepEqual(
      inspect.cards.map((card) => card.id),
      ["A", "B"],
    );
    assert.ok(
      inspect.cards.every((card) => card.label.startsWith("Tài khoản")),
    );
    assert.equal(inspect.reference.id, "calendar");
  }
  assert.equal(data.metadata.targetAge, undefined);
  assert.ok(!JSON.stringify(data).includes("16 tuổi"));
  assert.equal(option("CH05_GAME_RETRY"), undefined);
  assert.equal(data.metadata.lockDecisions, true);
  assert.equal(option("CH05_REPAIR"), undefined);
  assert.equal(option("CH05_TOPUP_BACK"), undefined);
  assert.equal(data.endingReport.reviewSceneId, undefined);
  assert.deepEqual(
    scenes.get("CH05_SC04_RECAP").options.map((item) => item.id),
    ["CH05_CONTINUE"],
  );
  for (const id of [
    "CH05_SC04_A",
    "CH05_B_MATURITY",
    "CH05_SC04_C",
    "CH05_TOPUP_VERIFIED",
    "CH05_TOPUP_PROMISE",
  ])
    assert.equal(option(id).feedback, undefined);
});
test("normalized scores use a fixed denominator and retain first vs final choice evidence", () => {
  const score = chapterFiveLearning(ledger, { game }, data.endingReport);
  assert.ok(Math.abs(score.choicePercent - (100 * 11) / 12) < 0.001);
  assert.ok(score.firstPercent < score.choicePercent);
  assert.equal(score.reflectionPercent, 100);
  assert.equal(chapterFiveLearning({}, {}, data.endingReport).learningScore, 0);
});
test("ending C precedes A; A requires normalized learning, choices, calculations and reflections", () => {
  const fit = { provider_checked: true, account_fit: true };
  assert.equal(ending(fit), "A_GOAL_ACHIEVED");
  for (const flags of [
    { ...fit, account_pending: true },
    { ...fit, account_mismatch: true },
    {},
  ])
    assert.equal(ending(flags), "C_RECOVERY");
  for (const overrides of [{ RISK: 56 }, { SAVING: 39 }])
    assert.equal(ending(fit, overrides), "C_RECOVERY");
  for (const overrides of [
    { choicePercent: 74.99 },
    { learningScore: 74.99 },
    { miniGameGoalEligible: false },
    { reflectionCompleted: false },
    { reflectionScore: 8 },
  ])
    assert.equal(ending(fit, overrides), "B_BALANCED");
  assert.equal(ending({ account_fit: true }), "B_BALANCED");
});
test("reflection grades evidence rather than just selecting every information card", () => {
  assert.deepEqual(
    gradeReflection("reflection1", {
      selected: ["deadline", "withdrawal", "fees", "provider", "protection"],
      method: "net",
    }),
    { I: 2, C: 2, P: 2 },
  );
  assert.equal(
    gradeReflection("reflection1", {
      selected: ["color", "friend"],
      method: "guess",
    }).I,
    0,
  );
  assert.equal(
    gradeReflection("reflection2", {
      action: "verified",
      verified: false,
      date: "month1",
    }).I,
    0,
  );
  assert.deepEqual(
    gradeReflection("reflection2", {
      action: "keepB",
      accountB: true,
      date: "month2",
    }),
    { I: 2, C: 2, P: 2 },
  );
});
