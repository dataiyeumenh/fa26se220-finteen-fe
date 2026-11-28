import test from "node:test";
import assert from "node:assert/strict";
import {
  insertLinked,
  insertAtPosition,
  moveScene,
  removeLinked,
  duplicateLinked,
  continuation,
  storyIssues,
  evalCondition,
  conditionSentence,
} from "../src/features/studio/storyOps.js";

const line = () => [
  { id: "a", type: "dialogue", text: "A", nextSceneId: "q" },
  {
    id: "q",
    type: "choice",
    text: "Q",
    options: [
      { id: "q1", text: "1", nextSceneId: "b" },
      { id: "q2", text: "2", nextSceneId: "c" },
    ],
  },
  { id: "b", type: "dialogue", text: "B", nextSceneId: "d" },
  { id: "c", type: "dialogue", text: "C", nextSceneId: "d" },
  { id: "d", type: "dialogue", text: "D", nextSceneId: "end" },
  { id: "end", type: "ending" },
];

test('explicit gaps insert at the start, between branching scenes, and after the final ending', () => {
  const source = line();
  const snapshot = structuredClone(source);
  const fresh = { id: 'new', type: 'dialogue', text: 'New' };
  const start = insertAtPosition(source, 0, fresh);
  assert.equal(start.index, 0);
  assert.equal(start.scenes[0].nextSceneId, 'a');
  const middle = insertAtPosition(source, 2, fresh);
  assert.deepEqual(middle.scenes.map(scene => scene.id), ['a', 'q', 'new', 'b', 'c', 'd', 'end']);
  assert.equal(middle.scenes[1].options[0].nextSceneId, 'new');
  assert.equal(middle.scenes[1].options[1].nextSceneId, 'c');
  assert.equal(middle.scenes[2].nextSceneId, 'b');
  const end = insertAtPosition(source, source.length, fresh);
  assert.equal(end.index, source.length);
  assert.equal(end.scenes.at(-1).id, 'new');
  assert.equal(end.scenes.at(-2).type, 'ending');
  assert.equal(end.scenes.at(-2).nextSceneId, undefined);
  assert.deepEqual(source, snapshot, 'input including choice options is unchanged');
  assert.deepEqual(insertAtPosition([], 0, fresh).scenes, [{ ...fresh, nextSceneId: null }]);
});

test('page reordering updates a straight story and preserves mini-game pass links', () => {
  const scenes = [
    { id: 'a', type: 'dialogue', nextSceneId: 'b' },
    { id: 'b', type: 'minigame', onPassSceneId: 'c' },
    { id: 'c', type: 'dialogue', nextSceneId: 'end' },
    { id: 'end', type: 'ending' },
  ];
  const snapshot = structuredClone(scenes);
  const result = moveScene(scenes, 2, 1);
  assert.equal(result.linked, true);
  assert.deepEqual(result.scenes.map(scene => scene.id), ['a', 'c', 'b', 'end']);
  assert.equal(result.scenes[0].nextSceneId, 'c');
  assert.equal(result.scenes[1].nextSceneId, 'b');
  assert.equal(result.scenes[2].onPassSceneId, 'end');
  assert.equal(result.scenes[2].nextSceneId, undefined);
  assert.deepEqual(scenes, snapshot);
  assert.equal(moveScene(scenes, 1, 1).scenes, scenes);
  assert.equal(moveScene(scenes, 1, 2).scenes, scenes);
  assert.equal(moveScene(scenes, 0, 4).index, 3);
  const last = moveScene(scenes, 1, 4);
  assert.equal(last.scenes.at(-1).onPassSceneId, null);
  const back = moveScene(last.scenes, 3, 1);
  assert.equal(back.scenes[1].onPassSceneId, 'c');
  assert.equal(back.scenes[1].nextSceneId, undefined);
});

test('moving an ending after an appended page reconnects the straight sequence', () => {
  const scenes = [{ id: 'a', type: 'dialogue', nextSceneId: 'end' }, { id: 'end', type: 'ending' }];
  const added = insertAtPosition(scenes, 2, { id: 'new', type: 'dialogue' });
  const moved = moveScene(added.scenes, 1, 3);
  assert.equal(moved.linked, true);
  assert.deepEqual(moved.scenes.map(scene => scene.id), ['a', 'new', 'end']);
  assert.equal(moved.scenes[0].nextSceneId, 'new');
  assert.equal(moved.scenes[1].nextSceneId, 'end');
});

test('reordering branches changes page placement without rewriting explicit routes or payloads', () => {
  const scenes = line();
  const result = moveScene(scenes, 2, 5);
  assert.equal(result.linked, false);
  assert.deepEqual(result.scenes.map(scene => scene.id), ['a', 'q', 'c', 'd', 'b', 'end']);
  for (const scene of scenes) assert.deepEqual(result.scenes.find(item => item.id === scene.id), scene);
  const conditional = [{ id: 'q', type: 'conditional', ifTrueSceneId: 'a', ifFalseSceneId: 'end' }, ...scenes.filter(scene => scene.id !== 'q')];
  const conditionalMove = moveScene(conditional, 0, conditional.length);
  assert.deepEqual(conditionalMove.scenes.at(-1), conditional[0]);
});

test("a new question after a dialogue sends every option to the old next scene (branch and rejoin)", () => {
  const scenes = line();
  const result = insertLinked(scenes, 2, {
    id: "new",
    type: "choice",
    options: [
      { id: "x", text: "" },
      { id: "y", text: "" },
    ],
  });
  assert.equal(result.index, 3);
  assert.equal(result.scenes[2].nextSceneId, "new");
  assert.deepEqual(
    result.scenes[3].options.map((option) => option.nextSceneId),
    ["d", "d"],
  );
  assert.equal(scenes[2].nextSceneId, "d", "input is not mutated");
  assert.equal(
    storyIssues(
      result.scenes.map((scene) =>
        scene.id === "new"
          ? {
              ...scene,
              options: scene.options.map((o) => ({ ...o, text: "ok" })),
            }
          : scene,
      ),
    ).length,
    0,
  );
});

test("inserting at a question puts the new scene before it so no branch is cut", () => {
  const result = insertLinked(line(), 1, {
    id: "new",
    type: "dialogue",
    text: "N",
  });
  assert.equal(result.index, 1);
  assert.equal(result.scenes[0].nextSceneId, "new");
  assert.equal(result.scenes[1].nextSceneId, "q");
});

test("deleting relinks the previous scene; deleting a question relinks to where its branches rejoin", () => {
  const plain = removeLinked(line(), 2);
  assert.equal(
    plain.scenes.find((scene) => scene.id === "q").options[0].nextSceneId,
    "d",
  );
  assert.equal(continuation(line(), line()[1]), "d");
  const question = removeLinked(line(), 1);
  assert.equal(question.scenes[0].nextSceneId, "d");
  const first = removeLinked(line(), 0);
  assert.equal(first.scenes[0].id, "q");
});

test("duplicating keeps the story connected and gives the copy fresh option ids", () => {
  const dialogue = duplicateLinked(line(), 0, "copy");
  assert.equal(dialogue.scenes[0].nextSceneId, "copy");
  assert.equal(dialogue.scenes[1].nextSceneId, "q");
  const question = duplicateLinked(line(), 1, "copy");
  assert.equal(question.scenes[0].nextSceneId, "copy");
  assert.deepEqual(
    question.scenes[1].options.map((option) => [option.id, option.nextSceneId]),
    [
      ["copy_OPT1", "q"],
      ["copy_OPT2", "q"],
    ],
  );
});

test("issues put the root cause first and group the consequences into one line", () => {
  const scenes = line();
  delete scenes[0].nextSceneId;
  const issues = storyIssues(scenes);
  assert.match(issues[0].text, /Cảnh 1: chưa chọn cảnh tiếp theo/);
  assert.equal(issues.filter((item) => item.group).length, 1);
  assert.match(issues.at(-1).text, /5 cảnh không có đường nào đi tới/);
});

test("conditions read as sentences and evaluate three-valued in play mode", () => {
  const state = {
    money: 300000,
    score: 0,
    stats: { SAVING: 50 },
    flags: { done: true },
    choices: { q: "q1" },
    inspected: {},
  };
  assert.equal(
    evalCondition(
      {
        all: [
          { var: "money", op: ">=", value: 200000 },
          { var: "choice:q", op: "==", value: "q1" },
        ],
      },
      state,
    ),
    true,
  );
  assert.equal(
    evalCondition({ var: "SAVING", op: ">", value: 60 }, state),
    false,
  );
  assert.equal(
    evalCondition(
      {
        any: [
          { var: "unknownVar", op: "==", value: true },
          { var: "flag:done", op: "==", value: true },
        ],
      },
      state,
    ),
    true,
  );
  assert.equal(
    evalCondition({ var: "unknownVar", op: "==", value: true }, state),
    undefined,
  );
  assert.equal(
    conditionSentence({ var: "money", op: ">=", value: 500000 }, line()),
    "Tiền của An ít nhất 500.000đ",
  );
  assert.match(
    conditionSentence({ var: "choice:q", op: "==", value: "q2" }, line()),
    /đã chọn “2”/,
  );
});

test("story map splits a question into lanes that rejoin, and marks empty lanes and loops", async () => {
  const { buildStoryMap } = await import("../src/features/studio/storyOps.js");
  const blocks = buildStoryMap(line());
  const branch = blocks.find((block) => block.kind === "branch");
  assert.equal(branch.index, 1);
  assert.equal(branch.join, 4);
  assert.deepEqual(
    branch.lanes.map((lane) => lane.body?.flatMap((b) => b.indexes)),
    [[2], [3]],
  );
  assert.equal(branch.lanes[0].last, 2);
  const same = line();
  same[1].options = same[1].options.map((option) => ({
    ...option,
    nextSceneId: "d",
  }));
  const sameBranch = buildStoryMap(same).find(
    (block) => block.kind === "branch",
  );
  assert.deepEqual(
    sameBranch.lanes.map((lane) => lane.empty),
    ["join", "join"],
  );
  const loop = line();
  loop[4].nextSceneId = "a";
  assert.ok(JSON.stringify(buildStoryMap(loop)).includes('"back":true'));
});
