import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { chapter1V2GameData } from "../src/pages/User/Dashboard/data/chapter1V2VisualNovel.js";
import { chapter2V2GameData } from "../src/pages/User/Dashboard/data/chapter2V2VisualNovel.js";
import { chapter3V2GameData } from "../src/pages/User/Dashboard/data/chapter3V2VisualNovel.js";

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
