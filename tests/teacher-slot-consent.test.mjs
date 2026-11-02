import assert from "node:assert/strict";
import test from "node:test";
import { withGroupConsent } from "../src/pages/Teacher/Groups/api/withGroupConsent.js";

test("unconfirmed groups persist consent before creating students", async () => {
  const calls = [];
  const api = { confirmConsent: async (id) => { calls.push(id); } };
  const result = await withGroupConsent(api, { id: "class-1", consentConfirmed: false }, async () => {
    calls.push("create");
    return { id: "student-1" };
  });
  assert.deepEqual(calls, ["class-1", "create"]);
  assert.equal(result.id, "student-1");
});

test("confirmed groups create students without another consent request", async () => {
  const api = { confirmConsent: async () => assert.fail("already confirmed") };
  assert.equal(await withGroupConsent(api, { consentConfirmed: true }, async () => "created"), "created");
});

test("failed consent does not create students or report success", async () => {
  const api = { confirmConsent: async () => { throw new Error("Network error"); } };
  await assert.rejects(
    withGroupConsent(api, { id: "class-1" }, async () => assert.fail("must not create")),
    /Network error/,
  );
});
