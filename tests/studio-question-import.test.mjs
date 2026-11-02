import test from "node:test";
import assert from "node:assert/strict";
import { importQuestionRows } from "../src/features/studio/questionImport.js";
import { parseQuizFile, QUIZ_CSV_TEMPLATE } from "../src/pages/Teacher/Quiz/quizImport.js";

test("internal import uses the teacher CSV template and real create payload without temporary IDs", async () => {
  const calls = [];
  const progress = [];
  const questions = parseQuizFile(QUIZ_CSV_TEMPLATE, "questions.csv");
  await importQuestionRows({ post: async (...args) => calls.push(args) }, questions, { pool: " CEE ", chapter: 2 }, 0, (n) => progress.push(n));
  assert.deepEqual(progress, [1, 2]);
  assert.equal(calls[0][0], "/api/studio/questions");
  assert.equal(calls[0][1].stem, questions[0].stem);
  assert.equal(calls[1][1].correctIndex, 1);
  assert.equal(calls[0][1].pool, "CEE");
  assert.equal(calls[0][1].chapter, 2);
  assert.equal(calls[0][1].id, undefined);
});

test("partial failure stops import; retry skips confirmed successful rows", async () => {
  const questions = parseQuizFile(QUIZ_CSV_TEMPLATE, "questions.csv");
  let saved = 0;
  let requests = 0;
  await assert.rejects(importQuestionRows({ post: async () => {
    if (++requests === 2) throw new Error("Forbidden");
  } }, questions, { pool: "CEE" }, 0, (n) => { saved = n; }));
  assert.equal(saved, 1);
  const retried = [];
  await importQuestionRows({ post: async (_, body) => retried.push(body) }, questions, { pool: "CEE" }, saved, (n) => { saved = n; });
  assert.equal(saved, 2);
  assert.equal(retried.length, 1);
  assert.equal(retried[0].stem, questions[1].stem);
  assert.equal(retried[0].chapter, null);
});
