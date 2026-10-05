import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { chapter1V2GameData } from "../src/pages/User/Dashboard/data/chapter1V2VisualNovel.js";
import { chapter2V2GameData } from "../src/pages/User/Dashboard/data/chapter2V2VisualNovel.js";

function validateChapter(data) {
  const ids = new Set(data.scenes.map((scene) => scene.id));
  assert.equal(ids.size, data.scenes.length, "scene ids must be unique");

  for (const scene of data.scenes) {
    for (const key of ["nextSceneId", "onPassSceneId", "onFailSceneId"]) {
      if (scene[key]) assert.ok(ids.has(scene[key]), `${scene.id}.${key} must target a scene`);
    }
    for (const option of scene.options || []) {
      assert.ok(ids.has(option.nextSceneId), `${option.id} must target a scene`);
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

test("Chapter 1 postpone choice does not spend money and best ending is reachable", () => {
  const choiceScene = chapter1V2GameData.scenes.find((scene) => scene.id === "CH01_SC02_CHOICE");
  const postpone = choiceScene.options.find((option) => option.id === "CH01_SC02_CHOICE_C");
  assert.deepEqual(postpone.moneyEvents, []);
  assert.match(chapter1V2GameData.endingRules.endings[0].condition, /money >= 500000/);
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
    games.BUDGET_BUILDER_CH02.draggables.reduce((sum, item) => sum + item.value, 0),
    chapter2V2GameData.initialMoney,
  );
  assert.equal(games.SAVINGS_RACE_CH02.targetAmount, 6000000);
});
