import test from "node:test";
import assert from "node:assert/strict";
import { loadRecentAccounts, revenueSeries, vietnamDateKey } from "../src/pages/Admin/Dashboard/api/adminOverviewData.js";

test("revenue chart uses the deployed API's paidAmount and fills missing dates", () => {
  const points = revenueSeries({ paidAmount: 450000, byDay: [
    { date: "2026-11-14", paidAmount: 150000, paidCount: 1 },
    { date: "2026-11-16", paidAmount: 300000, paidCount: 2 },
  ] }, 3, new Date("2026-11-16T08:00:00Z"));
  assert.deepEqual(points.map((point) => point.amount), [150000, 0, 300000]);
  assert.deepEqual(points.map((point) => vietnamDateKey(point.date)), ["2026-11-14", "2026-11-15", "2026-11-16"]);
});

test("zero revenue remains a valid series; incomplete responses are not disguised as no sales", () => {
  assert.deepEqual(revenueSeries({ paidAmount: 0, byDay: [] }, 7).map((point) => point.amount), Array(7).fill(0));
  assert.throws(() => revenueSeries({}, 7), /chưa đầy đủ/);
});

test("today follows Vietnam midnight independently of browser timezone", () => {
  assert.equal(vietnamDateKey("2026-11-15T16:59:59Z"), "2026-11-15");
  assert.equal(vietnamDateKey("2026-11-15T17:00:00Z"), "2026-11-16");
  assert.equal(vietnamDateKey("invalid"), null);
});

test("seven-day accounts include later pages, exclude older accounts, deduplicate and sort newest first", async () => {
  const calls = [];
  const first = { id: "first", createdAt: "2026-11-15T17:00:00Z" };
  const newest = { id: "newest", createdAt: "2026-11-16T08:00:00Z" };
  const pages = [
    { items: [first, { id: "old", createdAt: "2026-11-09T16:59:59Z" }], totalPages: 2 },
    { items: [newest, first, { id: "unknown", createdAt: null }], totalPages: 2 },
  ];
  const accounts = await loadRecentAccounts({ listAdminAccounts: async (params) => { calls.push(params); return pages[params.page]; } }, { now: new Date("2026-11-16T09:00:00Z") });
  assert.deepEqual(accounts.map((account) => account.id), ["newest", "first"]);
  assert.deepEqual(calls, [{ page: 0, size: 100 }, { page: 1, size: 100 }]);
});

test("seven-day range includes today and six preceding Vietnam calendar days", async () => {
  const items = [
    { id: "before-window", createdAt: "2026-11-09T16:59:59Z" },
    { id: "first-midnight", createdAt: "2026-11-09T17:00:00Z" },
    { id: "yesterday", createdAt: "2026-11-15T05:00:00Z" },
    { id: "today", createdAt: "2026-11-16T08:00:00Z" },
    { id: "tomorrow", createdAt: "2026-11-16T17:00:00Z" },
  ];
  const accounts = await loadRecentAccounts({ listAdminAccounts: async () => ({ items, totalPages: 1 }) }, { now: new Date("2026-11-16T09:00:00Z") });
  assert.deepEqual(accounts.map((account) => account.id), ["today", "yesterday", "first-midnight"]);
});

test("account load failures do not report a misleading zero count", async () => {
  await assert.rejects(loadRecentAccounts({ listAdminAccounts: async () => { throw new Error("offline"); } }), /offline/);
  await assert.rejects(loadRecentAccounts({ listAdminAccounts: async () => ({}) }), /Không tải được/);
});

test("cancelled account loads do not continue scanning pages", async () => {
  let active = true;
  let calls = 0;
  const rows = await loadRecentAccounts({ listAdminAccounts: async () => { calls++; active = false; return { items: [], totalPages: 20 }; } }, { isActive: () => active });
  assert.equal(calls, 1);
  assert.deepEqual(rows, []);
});
