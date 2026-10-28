import test from "node:test";
import assert from "node:assert/strict";
import {
  canEdit,
  canManage,
  canWriteLibrary,
  canReview,
  canWithdraw,
  canPublish,
} from "../src/features/studio/permissions.js";

const actor = (role) => ({ id: "current", roles: [role] });
const submitted = { status: "SUBMITTED", editorId: "other" };

test("Studio writes follow the role matrix supplied by backend", () => {
  for (const role of [
    "ADMIN",
    "GAME_EDITOR",
    "GAME_REVIEWER",
    "GAME_MANAGER",
  ]) {
    const current = actor(role);
    assert.equal(canEdit(current), ["ADMIN", "GAME_EDITOR"].includes(role));
    assert.equal(canManage(current), ["ADMIN", "GAME_MANAGER"].includes(role));
    assert.equal(canWriteLibrary(current), role !== "GAME_REVIEWER");
    assert.equal(
      canReview(current, submitted),
      ["ADMIN", "GAME_REVIEWER"].includes(role),
    );
  }
  assert.equal(canWriteLibrary(actor("PARENT")), false);
  assert.equal(canReview(null, submitted), false);
});

test("even Admin cannot review or publish their own changes", () => {
  const admin = actor("ADMIN");
  assert.equal(canReview(admin, { ...submitted, editorId: admin.id }), false);
  assert.equal(canReview(admin, { ...submitted, status: "DRAFT" }), false);
  assert.equal(canReview(admin, { status: "SUBMITTED" }), false);
  const approved = { status: "APPROVED", editorId: "other" };
  assert.equal(canPublish(admin, { drafts: [approved] }), true);
  assert.equal(
    canPublish(admin, {
      drafts: [approved, { ...approved, editorId: admin.id }],
    }),
    false,
  );
  assert.equal(canPublish(admin, { drafts: [] }), false);
  assert.equal(
    canPublish(admin, { drafts: [{ ...approved, status: "SUBMITTED" }] }),
    false,
  );
  assert.equal(
    canPublish(actor("GAME_REVIEWER"), { drafts: [approved] }),
    false,
  );
});

test("only the editor of a submitted draft can withdraw it", () => {
  assert.equal(
    canWithdraw(actor("GAME_EDITOR"), { ...submitted, editorId: "current" }),
    true,
  );
  assert.equal(canWithdraw(actor("ADMIN"), submitted), false);
  assert.equal(
    canWithdraw(actor("GAME_MANAGER"), { ...submitted, editorId: "current" }),
    false,
  );
  assert.equal(
    canWithdraw(actor("GAME_EDITOR"), { status: "DRAFT", editorId: "current" }),
    false,
  );
});
