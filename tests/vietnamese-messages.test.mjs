import test from "node:test";
import assert from "node:assert/strict";
import { vietnameseApiMessage, vietnameseError } from "../src/lib/vietnameseMessages.js";
import { createAuthClient } from "../src/api/auth.client.js";
import { parseQuizFile } from "../src/pages/Teacher/Quiz/quizImport.js";

test("English API errors use domain codes before HTTP fallbacks; Vietnamese details survive", () => {
  assert.match(vietnameseApiMessage("Wrong password", 3002, 401), /Thông tin đăng nhập không đúng/);
  assert.match(vietnameseApiMessage("Use password", 3020, 401), /đăng nhập bằng mật khẩu/);
  assert.match(vietnameseApiMessage("Too many requests", 9999, 429), /quá nhiều yêu cầu/);
  assert.match(vietnameseApiMessage("Internal server error", null, 503), /Máy chủ đang gặp sự cố/);
  assert.equal(vietnameseApiMessage("Unrecognized error", null, 418, "Vui lòng thử lại."), "Vui lòng thử lại.");
  const detail = "Cảnh CH01_SC03: lựa chọn phải có nội dung.";
  assert.equal(vietnameseApiMessage(detail, 1001, 400), detail);
  assert.equal(vietnameseApiMessage(detail.normalize("NFD"), 1001, 400), detail.normalize("NFD"));
  assert.match(vietnameseError(new SyntaxError("Unexpected token")), /JSON chưa hợp lệ/);
});

test("API exceptions and expired learner notifications receive Vietnamese while retaining error metadata", async () => {
  const queue = [
    { code: 3002, message: "Wrong password" },
    { code: 0, result: { accessToken: "slot-token", expiresIn: 60, slot: { id: "child", displayName: "An", groupContext: "FAMILY" } } },
    { code: 3009, message: "Group has ended" },
  ];
  const client = createAuthClient({
    baseUrl: "https://example.com",
    storage: { getItem() {}, setItem() {} },
    fetcher: async () => {
      const reply = queue.shift();
      return { ok: reply.code === 0, status: reply.code === 0 ? 200 : 401, json: async () => reply };
    },
  });
  await assert.rejects(client.login("a@example.com", "bad"), (error) =>
    error.code === 3002 && error.status === 401 && /Thông tin đăng nhập không đúng/.test(error.message));
  await client.slotLogin("ABC", "1234");
  await assert.rejects(client.slotRequest("/api/learner/dashboard"), (error) =>
    error.code === 3009 && /Nhóm hoặc lớp học đã kết thúc/.test(error.message));
  assert.match(client.getSnapshot().error, /Nhóm hoặc lớp học đã kết thúc/);
  assert.equal(client.hasSession(), false);
});

test("malformed JSON and invalid question shapes show Vietnamese validation errors", () => {
  assert.throws(() => parseQuizFile('{"questions": [', "quiz.json"), /Tệp JSON chưa hợp lệ/);
  assert.throws(() => parseQuizFile("null", "quiz.json"), /File cần từ 1 đến 100 câu hỏi/);
  assert.throws(() => parseQuizFile('[{"stem":"Câu hỏi","options":{}}]', "quiz.json"), /Câu 1: hãy điền nội dung/);
});
