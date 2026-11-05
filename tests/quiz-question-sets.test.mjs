import test from "node:test";
import assert from "node:assert/strict";
import { groupQuestionSets, questionSetCode, toggleQuestionSet } from "../src/pages/Teacher/Quiz/questionSets.js";

test("question sets use the source code rather than a shared bank or question number", () => {
  const questions = [
    { id: "f1", externalId: "FDIC_MONEY_SMART-063", pool: "CEE" },
    { id: "c1", externalId: "CFPB-001", pool: "CEE" },
    { id: "f2", externalId: "fdic_money_smart-064", pool: "CEE" },
    { id: "p1", externalId: "PISA-001" },
    { id: "o1", externalId: "OECD_INFE-002" },
  ];
  const sets = groupQuestionSets([...questions, questions[0]]);
  assert.deepEqual(sets.map((set) => set.code), ["CFPB", "FDIC", "OECD", "PISA"]);
  assert.deepEqual(sets.find((set) => set.code === "FDIC").questions.map((question) => question.id), ["f1", "f2"]);
  assert.equal(questionSetCode({ externalId: "123", pool: "FDIC_MONEY_SMART" }), "FDIC");
  assert.equal(questionSetCode({}), "KHÁC");
});

test("selecting a set adds every question and deselecting preserves other sets", () => {
  const set = [{ id: "f1" }, { id: "f2" }, { id: "f3" }];
  const original = new Set(["p1"]);
  const selected = toggleQuestionSet(original, set);
  assert.deepEqual([...selected], ["p1", "f1", "f2", "f3"]);
  assert.deepEqual([...original], ["p1"]);
  assert.deepEqual([...toggleQuestionSet(selected, set)], ["p1"]);
});

test("editing a partially selected legacy set completes it without losing existing IDs", () => {
  const selected = new Set(["f2", "unlisted-legacy-question"]);
  const next = toggleQuestionSet(selected, [{ id: "f1" }, { id: "f2" }]);
  assert.deepEqual([...next], ["f2", "unlisted-legacy-question", "f1"]);
});

test("the full 139-question FDIC set can be combined with other sets without truncation", () => {
  const fdic = Array.from({ length: 139 }, (_, index) => ({ id: `fdic-${index}` }));
  const cfcb = new Set(Array.from({ length: 50 }, (_, index) => `cfpb-${index}`));
  const selected = toggleQuestionSet(cfcb, fdic);
  assert.equal(selected.size, 189);
  assert.ok(fdic.every((question) => selected.has(question.id)));
  assert.equal(cfcb.size, 50);
  assert.deepEqual(toggleQuestionSet(selected, fdic), cfcb);
  assert.equal(toggleQuestionSet(new Set(), fdic).size, 139);
});
