import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { chapter1V2GameData } from "../src/pages/User/Dashboard/data/chapter1V2VisualNovel.js";
import { chapter2V2GameData } from "../src/pages/User/Dashboard/data/chapter2V2VisualNovel.js";
import { chapter3V2GameData } from "../src/pages/User/Dashboard/data/chapter3V2VisualNovel.js";
import { chapter4V2GameData } from "../src/pages/User/Dashboard/data/chapter4V2VisualNovel.js";

function validateChapter(data) {
  const ids = new Set(data.scenes.map((scene) => scene.id));
  assert.equal(ids.size, data.scenes.length, "scene ids must be unique");

  for (const scene of data.scenes) {
    for (const key of ["nextSceneId", "onPassSceneId", "onFailSceneId"]) {
      if (scene[key])
        assert.ok(
          ids.has(scene[key]),
          `${scene.id}.${key} must target a scene`,
        );
    }
    for (const option of scene.options || []) {
      assert.ok(
        ids.has(option.nextSceneId),
        `${option.id} must target a scene`,
      );
    }
    for (const key of ["ifTrueSceneId", "ifFalseSceneId"]) {
      if (scene[key])
        assert.ok(
          ids.has(scene[key]),
          `${scene.id}.${key} must target a scene`,
        );
    }
    if (scene.reviewAction) {
      assert.ok(
        ids.has(scene.reviewAction.targetSceneId),
        `${scene.id}.reviewAction must target a scene`,
      );
    }
  }

  const visit = (value) => {
    if (typeof value === "string" && value.startsWith("/images/")) {
      assert.ok(fs.existsSync(`public${value}`), `missing asset: ${value}`);
    } else if (Array.isArray(value)) {
      value.forEach(visit);
    } else if (value && typeof value === "object") {
      Object.values(value).forEach(visit);
    }
  };
  visit(data);
}

test("Chapter 4 has valid scene links, reachable scenes and existing assets", () => {
  validateChapter(chapter4V2GameData);
  const byId = Object.fromEntries(chapter4V2GameData.scenes.map(scene => [scene.id, scene]));
  const reached = new Set();
  const visit = id => {
    if (!id || reached.has(id)) return;
    reached.add(id);
    const scene = byId[id];
    for (const key of ['nextSceneId', 'ifTrueSceneId', 'ifFalseSceneId', 'onPassSceneId', 'onFailSceneId']) visit(scene[key]);
    for (const option of scene.options || []) visit(option.nextSceneId);
  };
  visit(chapter4V2GameData.scenes[0].id);
  assert.equal(reached.size, chapter4V2GameData.scenes.length);
});

test("Chapter 4 compares for free, charges once at purchase and keeps fees separate", () => {
  const scenes = Object.fromEntries(chapter4V2GameData.scenes.map(scene => [scene.id, scene]));
  assert.equal(chapter4V2GameData.initialMoney, 2500000);
  for (const option of scenes.CH04_SC02.options) {
    assert.deepEqual(option.moneyEvents, []);
    assert.equal(option.requires.minMoney, undefined);
    assert.equal(option.requires.flags, undefined);
    assert.deepEqual(option.requires.inspected, ['ch04_comparison']);
  }
  for (const [phone, price] of [['A', 1600000], ['B', 1300000], ['C', 2300000]]) {
    const purchase = scenes[`CH04_SC03_PAY_${phone}`].options[0];
    assert.deepEqual(purchase.moneyEvents, []);
    const receipt = scenes[phone === 'A' ? 'CH04_SC03' : `CH04_SC03_${phone}_RECEIPT`];
    assert.equal(receipt.options[0].moneyEvents[0].amount, -price);
    assert.equal(receipt.options[0].moneyEvents[0].eventId, 'EV_CH04_PHONE_PURCHASE');
    assert.equal(receipt.options[1].moneyEvents[1].amount, -100000);
    assert.equal(purchase.requires.minMoney, price);
  }
  assert.equal(scenes.CH04_SC03.options[1].requires.minMoney, 1700000);
  const fees = chapter4V2GameData.scenes.filter(scene => /^CH04_SC04_MONTH_/.test(scene.id)).map(scene => scene.options[0].moneyEvents[0]);
  assert.equal(fees.length, 11);
  assert.equal(new Set(fees.map(fee => fee.eventId)).size, 11);
  assert.equal(fees.reduce((sum, fee) => sum + fee.amount, 0), -550000);
  assert.ok(fees.every(fee => fee.amount === -50000));
  assert.ok(!JSON.stringify(chapter4V2GameData).includes('"amount":-550000'));
  assert.equal(scenes.CH04_SC02.options[0].setFlags.cancellation_confirmed, false);
  assert.equal(scenes.CH04_SC04_SUBSCRIPTION.options[0].setFlags.cancellation_confirmed, true);
});

test("Chapter 4 mini-game has scored answers and both results continue the chapter", () => {
  const scene = chapter4V2GameData.scenes.find(scene => scene.type === 'minigame');
  assert.equal(scene.game.id, 'SMART_SHOPPING_CH04');
  assert.equal(scene.game.phones.length, 3);
  assert.equal(chapter4V2GameData.endingReport.miniGameMax, 4);
  assert.deepEqual(chapter4V2GameData.endingReport.requiredGameIds, [scene.game.id]);
  assert.equal(scene.onPassSceneId, scene.nextSceneId);
  assert.equal(scene.onFailSceneId, scene.nextSceneId);
});

test("Chapter 4 endings check recovery first, then fit, evidence, completion and reflection", () => {
  const rules = chapter4V2GameData.endingRules;
  const resolve = (flags, { risk = 30, saving = 50, evidence = 12, mini = true, reflection = 4 } = {}) => {
    for (const id of rules.priorityOrder) {
      const ending = rules.endings.find(ending => ending.id === id);
      if (ending.condition === 'DEFAULT_FALLBACK') return id;
      const check = new Function('flags', 'RISK', 'SAVING', 'evidenceScore', 'miniGameCompleted', 'reflectionScore', 'miniGameGoalEligible', 'miniGameNeedsPractice', `return ${ending.condition}`);
      if (check(flags, risk, saving, evidence, mini, reflection, mini, false)) return id;
    }
  };
  const fit = { purchase_fit: true, phone_b: true, receipt_resolved: true, budget_adjusted: true };
  assert.equal(resolve(fit), 'A_GOAL_ACHIEVED');
  assert.equal(resolve(fit, { risk: 55, saving: 40, evidence: 9, reflection: 3 }), 'A_GOAL_ACHIEVED');
  assert.equal(resolve({ ...fit, phone_a: true }), 'B_BALANCED');
  assert.equal(resolve({ ...fit, phone_a: true, cancellation_confirmed: true }), 'A_GOAL_ACHIEVED');
  assert.equal(resolve({ ...fit, receipt_resolved: false }), 'C_RECOVERY');
  assert.equal(resolve({ ...fit, budget_adjusted: false }), 'C_RECOVERY');
  assert.equal(resolve(fit, { risk: 56 }), 'C_RECOVERY');
  assert.equal(resolve(fit, { saving: 39 }), 'C_RECOVERY');
  assert.equal(resolve(fit, { evidence: 8 }), 'B_BALANCED');
  assert.equal(resolve(fit, { mini: false }), 'B_BALANCED');
  assert.equal(resolve(fit, { reflection: 2 }), 'B_BALANCED');
  assert.equal(resolve({ ...fit, budget_revised: true }), 'A_GOAL_ACHIEVED');
});

test("Chapter 1 and Chapter 2 V2 have valid scene graphs and assets", () => {
  validateChapter(chapter1V2GameData);
  validateChapter(chapter2V2GameData);
});

test("Chapter 3 V2 has a valid scene graph and assets", () => {
  validateChapter(chapter3V2GameData);
});

test("Chapter 3 gates the paid design course and never charges for commission", () => {
  assert.equal(chapter3V2GameData.initialMoney, 300000);
  const scenes = Object.fromEntries(
    chapter3V2GameData.scenes.map((scene) => [scene.id, scene]),
  );
  const design = scenes.CH03_SC03_CHOICE.options.find(
    (option) => option.id === "CH03_SC03_CHOICE_A",
  );
  assert.equal(
    design.moneyEvents.reduce((sum, event) => sum + event.amount, 0),
    -200000,
  );
  assert.equal(design.requires.minMoney, 200000);
  assert.ok(design.requires.flags.includes("source_checked"));
  const commission = scenes.CH03_SC03_CHOICE.options.find(
    (option) => option.id === "CH03_SC03_CHOICE_B",
  );
  assert.deepEqual(commission.moneyEvents, []);
  const revisedFee = scenes.CH03_SC03_REVISE.options.find(
    (option) => option.id === "CH03_SC03_REVISE_A",
  ).moneyEvents;
  assert.equal(
    revisedFee[0].eventId,
    design.moneyEvents[0].eventId,
    "revising must not charge the fee twice",
  );
});

test("Chapter 3 declares Career Match and the three endings", () => {
  const game = chapter3V2GameData.scenes.find(
    (scene) => scene.type === "minigame",
  ).game;
  assert.equal(game.id, "CAREER_MATCH_CH03");
  assert.equal(game.jobs.length, 3);
  assert.equal(game.maxScore, game.jobs.length + game.questions.length);
  for (const question of game.questions) {
    assert.ok(
      question.options.some((option) => option.id === question.correctId),
      question.id,
    );
  }
  assert.deepEqual(chapter3V2GameData.endingRules.priorityOrder, [
    "C_RECOVERY",
    "A_GOAL_ACHIEVED",
    "B_BALANCED",
  ]);
  assert.equal(chapter3V2GameData.endingRules.endings.length, 3);
});

test("Chapter 1 postpone choice does not spend money and best ending is reachable", () => {
  const choiceScene = chapter1V2GameData.scenes.find(
    (scene) => scene.id === "CH01_SC02_CHOICE",
  );
  const postpone = choiceScene.options.find(
    (option) => option.id === "CH01_SC02_CHOICE_C",
  );
  assert.deepEqual(postpone.moneyEvents, []);
  assert.match(
    chapter1V2GameData.endingRules.endings[0].condition,
    /money >= 500000/,
  );
});

test("Chapter 2 declares the supported Budget Builder and Savings Race schemas", () => {
  const games = Object.fromEntries(
    chapter2V2GameData.scenes
      .filter((scene) => scene.type === "minigame")
      .map((scene) => [scene.game.id, scene.game]),
  );
  assert.equal(games.BUDGET_BUILDER_CH02.draggables.length, 6);
  assert.equal(games.BUDGET_BUILDER_CH02.dropZones.length, 6);
  assert.equal(
    games.BUDGET_BUILDER_CH02.draggables.reduce(
      (sum, item) => sum + item.value,
      0,
    ),
    chapter2V2GameData.initialMoney,
  );
  assert.equal(games.SAVINGS_RACE_CH02.targetAmount, 6000000);
});
