import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chapter8V2GameData as chapter } from "./fixtures/content/index.mjs";
import { resolveFutureScene } from "../src/pages/Kid/Dashboard/components/game/futurePlanRules.js";

const portfolio = chapter.scenes.find(scene => scene.game?.config?.mode === "portfolio").game.config.portfolio;

test("scenes without marketText remain untouched even for settlement and formerly hard-coded IDs", () => {
  for (const scene of chapter.scenes) {
    assert.equal(resolveFutureScene(portfolio, scene, {}, {}), scene);
  }
});

test("market text follows settlement delta and synchronizes the history title without mutating the source scene", () => {
  const custom = { ...portfolio, startingAmount: 20000000 };
  for (const [move, direction] of [[5, "up"], [-5, "down"], [0, "flat"]]) {
    const market = { ...portfolio.market.legacy, bonds: move, equity: move };
    const results = { [portfolio.settlement.resultFrom]: { ui: { market } } };
    const flags = { [portfolio.settlement.fitFlag]: true };
    const scene = { id: "RENAMED", title: "Keep title", text: "Original", marketText: {
      [direction]: `${direction}: {start}; {final}; {change}; {bonds}; {equity}`,
    } };
    const resolved = resolveFutureScene(custom, scene, results, flags);
    assert.equal(resolved.title, resolved.text);
    assert.equal(resolved.id, scene.id);
    assert.equal(resolved.marketText, scene.marketText);
    assert.ok(resolved.text.startsWith(direction + ": 20.000.000đ;"));
    assert.doesNotMatch(resolved.text, /undefined|\{\w+\}/);
    assert.equal(scene.text, "Original");
    assert.equal(scene.title, "Keep title");
    const fallback = resolveFutureScene(custom, { ...scene, marketText: {} }, results, flags);
    assert.equal(fallback.text, "Original");
    assert.equal(fallback.title, fallback.text);
  }
});

test("handoff patch covers the reserve choice and every formerly overridden CH08 scene", () => {
  const patch = JSON.parse(readFileSync("scripts/content-migrations/minigame-texts-2026-11-12.json", "utf8"));
  assert.deepEqual(patch.CH02.options[0].requires, { minFlexibleReserve: 200000, reserveZoneId: "emergency_buffer" });
  assert.equal(patch.CH08.scenes.length, 9);
  for (const entry of patch.CH08.scenes) {
    assert.ok(chapter.scenes.some(scene => scene.id === entry.id), entry.id);
    assert.deepEqual(Object.keys(entry.marketText).sort(), ["down", "flat", "up"]);
  }
});
