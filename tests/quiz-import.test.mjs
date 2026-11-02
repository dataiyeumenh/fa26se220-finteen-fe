import test from "node:test";
import assert from "node:assert/strict";
import { parseQuizFile, createMockQuizApi, QUIZ_CSV_TEMPLATE } from "../src/pages/Teacher/Quiz/quizImport.js";

test("Excel template has UTF-8 BOM and round trips Vietnamese", () => {
  assert.deepEqual([...Buffer.from(QUIZ_CSV_TEMPLATE).subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  assert.equal(parseQuizFile(QUIZ_CSV_TEMPLATE, "template.csv")[0].stem, "Tiền tiết kiệm dùng để làm gì?");
  assert.equal(parseQuizFile(QUIZ_CSV_TEMPLATE, "template.csv")[1].correctIndex, 1);
  assert.ok(!QUIZ_CSV_TEMPLATE.includes("correctIndex"));
});

test("Vietnamese CSV accepts answer letters, rejects invalid answers and preserves old format", () => {
  const header = 'Câu hỏi,Lựa chọn A,Lựa chọn B,Lựa chọn C,Lựa chọn D,Đáp án đúng\n';
  for (const [index, answer] of ['A', 'b', ' C ', 'D'].entries()) {
    assert.equal(parseQuizFile(header + `Câu hỏi,A,B,C,D,${answer}`, "quiz.csv")[0].correctIndex, index);
  }
  for (const answer of ['', 'E', '0', 'AB']) {
    assert.throws(() => parseQuizFile(header + `Câu hỏi,A,B,C,D,${answer}`, "quiz.csv"));
  }
  assert.equal(parseQuizFile('stem,A,B,C,D,correctIndex\nQ,A,B,C,D,3', 'old.csv')[0].correctIndex, 3);
});

const question = { stem: "Tiết kiệm?", options: ["A", "B", "C", "D"], correctIndex: 0 };
test("imports JSON and CSV with quoted commas, newlines and BOM", () => {
  assert.equal(parseQuizFile(JSON.stringify({ questions: [question] }), "quiz.json")[0].stem, question.stem);
  const rows = parseQuizFile('\uFEFFstem,A,B,C,D,correctIndex\r\n"Câu, hỏi\n2",A,B,C,D,2\r\n', "quiz.csv");
  assert.equal(rows[0].stem, "Câu, hỏi\n2");
  assert.equal(rows[0].correctIndex, 2);
});
test("rejects invalid files and questions before saving", () => {
  for (const value of [[], Array(101).fill(question), [{ ...question, correctIndex: 4 }], [{ ...question, options: ["A"] }], [{ ...question, stem: " " }]]) {
    assert.throws(() => parseQuizFile(JSON.stringify(value), "quiz.json"));
  }
  assert.throws(() => parseQuizFile('stem,A,B,C,D,correctIndex\nQ,A,B,C,D,', "quiz.csv"));
  assert.throws(() => parseQuizFile('stem,A,B,C,D,correctIndex\n"Q,A,B,C,D,0', "quiz.csv"));
});
test("mock quizzes persist, filter by class, isolate accounts and delete", () => {
  const data = new Map(); let account = "teacher-1";
  const storage = { getItem: (k) => data.get(k), setItem: (k, v) => data.set(k, v) };
  const api = createMockQuizApi(storage, () => account);
  const quiz = api.create({ groupId: "class-1", title: " Quiz ", questions: [question] });
  assert.equal(api.list("class-1")[0].title, "Quiz");
  assert.equal(api.list("class-2").length, 0);
  assert.equal(createMockQuizApi(storage, () => account).get(quiz.id).questions.length, 1);
  account = "teacher-2";
  assert.throws(() => api.get(quiz.id));
  account = "teacher-1";
  api.delete(quiz.id);
  assert.equal(api.list("class-1").length, 0);
});
