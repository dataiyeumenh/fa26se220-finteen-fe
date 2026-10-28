import test from "node:test";
import assert from "node:assert/strict";
import {
  reviewedNote,
  stepOf,
  turnOf,
} from "../src/features/studio/chapterWork.js";

const editor = { id: "e", roles: ["GAME_EDITOR"] };
const reviewer = { id: "r", roles: ["GAME_REVIEWER"] };
const manager = { id: "m", roles: ["GAME_MANAGER"] };
const draft = (status, extra = {}) => ({
  code: "CH04",
  status,
  editorId: "e",
  ...extra,
});

test("turnOf tells each role which chapters wait for them, never their own review / release", () => {
  assert.equal(turnOf(reviewer, draft("SUBMITTED")), "review");
  assert.equal(turnOf({ id: "e", roles: ["ADMIN"] }, draft("SUBMITTED")), null);
  assert.equal(turnOf(editor, draft("REJECTED")), "fix");
  assert.equal(turnOf(editor, draft("DRAFT")), "submit");
  assert.equal(turnOf(editor, draft("SUBMITTED")), null);
  assert.equal(turnOf(manager, draft("APPROVED")), "publish");
  assert.equal(
    turnOf({ id: "e", roles: ["GAME_MANAGER"] }, draft("APPROVED")),
    null,
  );
  assert.equal(turnOf(reviewer, draft("APPROVED")), null);
});

test('"reviewed at revision N" only shows once the current draft really passed review', () => {
  assert.equal(
    reviewedNote(draft("APPROVED", { reviewedRevision: 4 })),
    "Duyệt ở bản nháp số 4",
  );
  assert.equal(
    reviewedNote(draft("RELEASED", { reviewedRevision: 5 })),
    "Duyệt ở bản nháp số 5",
  );
  assert.equal(reviewedNote(draft("REJECTED", { reviewedRevision: 2 })), "");
  assert.equal(reviewedNote(draft("DRAFT", { reviewedRevision: 2 })), "");
  assert.equal(reviewedNote(draft("RELEASED")), "");
  assert.deepEqual(
    ["DRAFT", "REJECTED", "SUBMITTED", "APPROVED", "RELEASED"].map(stepOf),
    [0, 0, 1, 2, 3],
  );
});
