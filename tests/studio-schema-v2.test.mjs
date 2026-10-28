import test from "node:test";
import assert from "node:assert/strict";
import {
  prepareDraftV2,
  parseCondition,
  hasCondition,
} from "../src/features/studio/draftV2.js";

test("v2 drops only obsolete fail transitions and preserves conditions, reasons and unknown fields", () => {
  const condition = {
    all: [{ variable: "choice:budget" }, { variable: "inspected:card-1" }],
  };
  const original = {
    title: "Chapter",
    custom: { untouched: true },
    scenes: [
      {
        id: "game",
        onPassSceneId: "end",
        nextSceneId: "end",
        onFailSceneId: "old-fail",
        game: { custom: true },
      },
      {
        id: "choice",
        options: [{ condition, lockedReason: "Hãy xem thẻ trước." }],
      },
    ],
  };
  const prepared = prepareDraftV2(original);
  assert.equal("onFailSceneId" in prepared.scenes[0], false);
  assert.equal(original.scenes[0].onFailSceneId, "old-fail");
  assert.equal(prepared.scenes[0].onPassSceneId, "end");
  assert.deepEqual(
    prepared.scenes[1].options[0],
    original.scenes[1].options[0],
  );
  assert.deepEqual(prepared.custom, original.custom);
});

test("condition editing accepts new variable names unchanged and keeps invalid JSON detectable", () => {
  const text = '{"all":[{"var":"choice:budget"},{"var":"inspected:card-1"}]}';
  assert.deepEqual(parseCondition(text), JSON.parse(text));
  assert.equal(parseCondition("  "), undefined);
  assert.throws(() => parseCondition('{"var":'), SyntaxError);
  assert.equal(hasCondition({ condition: { type: "ALWAYS_UNLOCKED" } }), true);
  assert.equal(hasCondition({}), false);
  assert.equal(hasCondition({ condition: null }), false);
});
