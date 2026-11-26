import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/pages/Teacher/Groups/hooks/useTeacherGroups.js", import.meta.url), "utf8");
function harness(api, requestedGroupId = "") {
  const values = [];
  let cursor = 0;
  const useState = (initial) => {
    const index = cursor++;
    if (!(index in values)) values[index] = initial;
    return [values[index], (value) => { values[index] = typeof value === "function" ? value(values[index]) : value; }];
  };
  const useRef = (initial) => {
    const index = cursor++;
    if (!(index in values)) values[index] = { current: initial };
    return values[index];
  };
  const make = new Function("useCallback", "useEffect", "useMemo", "useRef", "useState", "auth", "withGroupConsent", "errorMessage",
    source.replace(/^import .*;\r?\n/gm, "").replace("export default function", "function") + "\nreturn useTeacherGroups;");
  const hook = make((callback) => callback, () => {}, (callback) => callback(), useRef, useState, api,
    async (_api, _group, action) => action(), (error) => error.message);
  return () => { cursor = 0; return hook({ requestedGroupId }); };
}

const oldClass = { id: "old", name: "Lớp cũ", context: "CLASS", slotLimit: 20 };
const archived = { id: "closed", name: "Lớp đã kết thúc", context: "CLASS", closedAt: "2026-11-20", slotLimit: 10 };
function fixture() {
  const groups = [oldClass, archived, { id: "family", context: "FAMILY" }];
  const students = { old: [{ id: "student-old", status: "ACTIVE" }], closed: [{ id: "student-closed", status: "ACTIVE" }], new: [] };
  const calls = [];
  const api = {
    listGroups: async () => groups,
    getQuota: async () => [{ context: "CLASS", free: 40 }],
    listGroupSlots: async (id) => { calls.push(["students", id]); return students[id]; },
    groupCapacity: async (id) => { calls.push(["capacity", id]); return { free: 12 }; },
    openGroup: async (name, context, plannedSize) => {
      calls.push(["create", name, context, plannedSize]);
      const created = { id: "new", name, context, slotLimit: plannedSize };
      groups.push(created);
      return created;
    },
  };
  return { api, calls };
}

test("all classes remain available, including archived classes and their students", async () => {
  const { api, calls } = fixture();
  const render = harness(api, "closed");
  await render().refresh();
  const state = render();
  assert.deepEqual(state.groups.map((group) => group.id), ["old", "closed"]);
  assert.equal(state.group.id, "closed");
  assert.equal(state.slots[0].id, "student-closed");
  assert.equal(state.available, 0);
  assert.ok(!calls.some(([type]) => type === "capacity"), "Archived classes must not depend on an active capacity endpoint");
});

test("creating a new class selects it without losing students from the previous class", async () => {
  const { api, calls } = fixture();
  const render = harness(api, "old");
  await render().refresh();
  await render().actions.openGroup("Lớp mới", 20);
  assert.equal(render().group.id, "new");
  assert.deepEqual(render().slots, []);
  assert.equal(render().groups.length, 3);
  await render().selectGroup("old");
  assert.equal(render().group.id, "old");
  assert.equal(render().slots[0].id, "student-old");
  assert.deepEqual(calls.filter(([type]) => type === "create"), [["create", "Lớp mới", "CLASS", 20]]);
});

test("a late student response cannot overwrite the class selected most recently", async () => {
  const { api } = fixture();
  let releaseOld;
  let oldStarted;
  const started = new Promise((resolve) => { oldStarted = resolve; });
  api.listGroupSlots = (id) => id === "old"
    ? new Promise((resolve) => { releaseOld = resolve; oldStarted(); })
    : Promise.resolve([{ id: "archived-student", status: "ACTIVE" }]);
  const render = harness(api, "old");
  const oldRequest = render().refresh();
  await started;
  await render().selectGroup("closed");
  releaseOld([{ id: "late-old-student", status: "ACTIVE" }]);
  await oldRequest;
  assert.equal(render().group.id, "closed");
  assert.equal(render().slots[0].id, "archived-student");
  assert.equal(render().loading, false);
});

test("quota and capacity failures do not hide classes or students or invent class capacity", async () => {
  const { api } = fixture();
  api.getQuota = async () => { throw new Error("Quota unavailable"); };
  api.groupCapacity = async () => { throw new Error("Capacity unavailable"); };
  const render = harness(api);
  await render().refresh();
  assert.equal(render().groups.length, 2);
  assert.equal(render().slots[0].id, "student-old");
  assert.equal(render().available, null);
  assert.ok(render().error);
});

test("a teacher with only archived classes can still view the roster", async () => {
  const { api } = fixture();
  api.listGroups = async () => [archived];
  const render = harness(api);
  await render().refresh();
  assert.equal(render().group.id, "closed");
  assert.equal(render().slots[0].id, "student-closed");
});

test("actions on a class card target that class without changing the selected roster", async () => {
  const { api } = fixture();
  const changes = [];
  api.confirmConsent = async (id) => { changes.push(["consent", id]); };
  api.updateGroupSize = async (id, size) => { changes.push(["size", id, size]); };
  api.closeGroup = async (id) => { changes.push(["close", id]); };
  const render = harness(api, "old");
  await render().refresh();
  await render().actions.confirmConsent("other");
  await render().actions.updatePlannedSize(25, "other");
  await render().actions.closeGroup("other");
  assert.deepEqual(changes, [["consent", "other"], ["size", "other", 25], ["close", "other"]]);
  assert.equal(render().group.id, "old");
  assert.equal(render().slots[0].id, "student-old");
});
