import test from "node:test";
import assert from "node:assert/strict";
import {
  nextSceneId,
  insertScene,
  copyScene,
} from "../src/features/studio/sceneEditing.js";

test("one-click scene creation produces unique ids without changing existing ids", () => {
  const scenes = [{ id: "CH01_SC03" }, { id: "CH01_SC04" }];
  assert.equal(nextSceneId("CH01", scenes), "CH01_SC05");
  assert.equal(nextSceneId("CH01", []), "CH01_SC01");
});

test("insert after current dialogue preserves its successor and does not overwrite choice branches or endings", () => {
  const scenes = [
    { id: "start", type: "dialogue", nextSceneId: "end" },
    { id: "end", type: "ending", nextSceneId: null },
  ];
  const result = insertScene(scenes, 0, { id: "new", nextSceneId: "end" });
  assert.equal(result.index, 1);
  assert.deepEqual(
    result.scenes.map((scene) => scene.id),
    ["start", "new", "end"],
  );
  assert.equal(result.scenes[0].nextSceneId, "new");
  assert.equal(scenes[0].nextSceneId, "end");
  const branch = {
    id: "branch",
    type: "choice",
    options: [{ nextSceneId: "end" }],
  };
  assert.deepEqual(insertScene([branch], 0, { id: "new" }).scenes[0], branch);
  assert.equal(
    insertScene(scenes, 1, { id: "new" }).scenes[1].nextSceneId,
    null,
  );
  assert.equal(insertScene([], 0, { id: "first" }).index, 0);
});

test("duplicating a scene deep-copies content, gives options unique ids and preserves external branch targets", () => {
  const source = {
    id: "old",
    title: "Cảnh",
    nextSceneId: "old",
    onFailSceneId: "obsolete",
    custom: { keep: true },
    characters: [{ src: "hero.webp" }],
    options: [
      { id: "old_A", nextSceneId: "old" },
      { id: "old_B", nextSceneId: "end" },
    ],
  };
  const copy = copyScene(source, "new");
  assert.equal(copy.nextSceneId, "new");
  assert.equal("onFailSceneId" in copy, false);
  assert.deepEqual(
    copy.options.map((option) => option.id),
    ["new_OPT1", "new_OPT2"],
  );
  assert.deepEqual(
    copy.options.map((option) => option.nextSceneId),
    ["new", "end"],
  );
  copy.custom.keep = false;
  copy.characters[0].src = "changed.webp";
  assert.equal(source.custom.keep, true);
  assert.equal(source.characters[0].src, "hero.webp");
});
