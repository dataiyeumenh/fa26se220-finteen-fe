import test from "node:test";
import assert from "node:assert/strict";
import { buildShoppingOffers, INSPECTIONS, evaluatePurchase, invoiceFor, purchaseLedger } from "../src/pages/User/Dashboard/components/game/shoppingMissionRules.js";

import { chapter4V2GameData } from "../src/pages/User/Dashboard/data/chapter4V2VisualNovel.js";
const game = chapter4V2GameData.scenes.find(scene => scene.game?.id === "SMART_SHOPPING_CH04").game;
const offers = buildShoppingOffers(game.phones);
function buy(offer, changes = {}) {
  return evaluatePurchase({ offer, inspected: INSPECTIONS.map(check => `${offer.id}:${check.id}`), cancellationDay: String(offer.deadline || ""), disputedLine: "fee", budget: game.budget, reserve: game.reserve, batteryChecked: true, batteryPlan: "keep", ...changes });
}
test("missions use the exact chapter catalog and all three meet learning needs", () => {
  assert.deepEqual(offers.map(({ id, price, image }) => ({ id, price, image })), game.phones.map(({ id, price, image }) => ({ id, price, image })));
  assert.deepEqual(offers.map(offer => offer.price), [1600000, 1300000, 2300000]);
  assert.ok(offers.every(offer => offer.works));
  assert.deepEqual(offers.map(offer => buy(offer).score), [4, 4, 3]);
});
test("A cancellation avoids eleven monthly bills; keeping it totals 2150000", () => {
  const offer = offers[0];
  assert.equal(buy(offer).totalCost, 1600000);
  assert.equal(buy(offer, { cancellationDay: "29" }).subscription, 0);
  for (const day of ["", "0", "-1", "1.5", "30"]) {
    const report = buy(offer, { cancellationDay: day });
    assert.equal(report.subscription, 550000);
    assert.equal(report.totalCost, 2150000);
    assert.equal(report.remaining, 350000);
    assert.equal(report.criteria.find(item => item.id === "budget").passed, false);
  }
});
test("B has six-month warranty without an invented repair fee", () => {
  assert.equal(offers[1].warrantyMonths, 6);
  assert.equal(buy(offers[1]).totalCost, 1300000);
  assert.equal(buy(offers[1]).remaining, 1200000);
});
test("C works for school but leaves a 300000 reserve shortfall", () => {
  const report = buy(offers[2]);
  assert.equal(report.totalCost, 2300000);
  assert.equal(report.remaining, 200000);
  assert.equal(report.criteria.find(item => item.id === "needs").passed, true);
  assert.equal(report.criteria.find(item => item.id === "budget").passed, false);
});
test("all invoices add the story service fee; only disputing that row removes it", () => {
  for (const offer of offers) {
    assert.equal(invoiceFor(offer).reduce((sum, row) => sum + row.amount, 0), offer.price + 100000);
    assert.equal(buy(offer).fee, 0);
    assert.equal(buy(offer, { disputedLine: "price" }).totalCost, offer.price + 100000);
    assert.equal(buy(offer, { disputedLine: "" }).fee, 100000);
  }
});
test("evidence is counted for the selected phone only", () => {
  const report = buy(offers[1], { inspected: ["A:app", "A:battery", "A:terms", "B:app"] });
  assert.equal(report.criteria.find(item => item.id === "evidence").passed, false);
  assert.equal(report.score, 3);
});
test("reserve boundary includes all expenses once", () => {
  assert.equal(buy(offers[1], { budget: 1800000 }).criteria.find(item => item.id === "budget").passed, true);
  assert.equal(buy(offers[1], { budget: 1799999 }).criteria.find(item => item.id === "budget").passed, false);
});

test("results ledger can format every cost and reconciles with the purchase total", () => {
  for (const offer of offers) {
    for (const cancellationDay of ["", "29", "30"]) {
      for (const disputedLine of ["", "fee", "price"]) {
        const report = buy(offer, { cancellationDay, disputedLine });
        const rows = purchaseLedger(offer, report);
        for (const row of rows) {
          assert.ok(Number.isFinite(row.amount), `${offer.id}: ${row.label}`);
          assert.doesNotThrow(() => row.amount.toLocaleString("vi-VN"));
        }
        assert.equal(rows.reduce((sum, row) => sum + row.amount, 0), report.totalCost);
      }
    }
  }
});

test("B requires a battery check and an explicit usage plan", () => {
  for (const changes of [{ batteryChecked: false }, { batteryPlan: "" }]) {
    assert.equal(buy(offers[1], changes).criteria.find(item => item.id === "rights").passed, false);
  }
  const keep = buy(offers[1]);
  const replace = buy(offers[1], { batteryPlan: "replace" });
  assert.equal(keep.batteryCost, 0);
  assert.equal(replace.batteryCost, 250000);
  assert.equal(replace.totalCost, 1550000);
  assert.equal(replace.remaining, 950000);
  assert.equal(purchaseLedger(offers[1], replace).reduce((sum, row) => sum + row.amount, 0), replace.totalCost);
  assert.equal(buy(offers[0], { batteryPlan: "replace" }).batteryCost, 0);
  assert.equal(buy(offers[2], { batteryPlan: "replace" }).batteryCost, 0);
});

test("A supports the beginning, middle and end of the trial month", () => {
  assert.equal(buy(offers[0], { cancellationDay: "1" }).subscription, 0);
  assert.equal(buy(offers[0], { cancellationDay: "15" }).subscription, 0);
  assert.equal(buy(offers[0], { cancellationDay: "30" }).subscription, 550000);
});
