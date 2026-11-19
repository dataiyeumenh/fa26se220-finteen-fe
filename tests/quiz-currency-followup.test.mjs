import assert from "node:assert/strict";
import test from "node:test";
import before from "../scripts/content-migrations/quiz-currency-followup-2026-11-19.before.json" with { type: "json" };
import replacements from "../scripts/content-migrations/quiz-currency-followup-2026-11-19.replacements.json" with { type: "json" };

const byCode = Object.fromEntries(replacements.map(({ body }) => [body.externalId, body]));
test("all six PISA and eleven FDIC replacements preserve identities and valid answer positions", () => {
  assert.equal(replacements.filter(p => p.body.pool === "PISA").length, 6);
  assert.equal(replacements.length, 17);
  for (const { replacesId, body } of replacements) {
    const original = before.find(q => q.id === replacesId);
    assert.ok(original);
    assert.equal(body.externalId, `${original.externalId}-R1`);
    assert.equal(body.correctIndex, original.correctIndex);
    for (const key of ["pool", "standard", "concept", "chapter"]) assert.equal(body[key], original[key]);
    assert.ok(body.source.length <= 160);
    assert.equal(new Set(body.options).size, body.options.length);
    assert.ok(body.options[body.correctIndex]);
    assert.doesNotMatch(body.stem + body.options.join(" "), /\$|\bUSD\b|zeds|\[Hình|\[Biển|F306Q01|___/i);
  }
});
test("salary, phone plan and bike invoice arithmetic retain the correct choices", () => {
  assert.equal(28000000 - 3000000, 25000000);
  assert.equal(byCode["PISA-017-R1"].options[1], "25.000.000 đồng");
  const minutes = 60 * 30;
  const costs = [[200000,90,2700],[200000,90,2500],[300000,60,3000],[300000,60,2500]].map(([fee,free,rate]) => fee + (minutes-free)*rate);
  assert.equal(costs.indexOf(Math.min(...costs)), 1);
  assert.equal(6*200000 + 6*2*60000 - 1800000, 120000);
  assert.match(byCode["PISA-032-R1"].options[0], /120\.000 đồng/);
  assert.equal(420000 - 100000, 200000 + 2*60000);
  assert.match(byCode["PISA-033-R1"].options[1], /100\.000 đồng/);
});
test("FDIC financial ratios retain the source relationships and insurance avoids a fabricated VND legal limit", () => {
  assert.equal(15000000/45000000, 1500/4500);
  assert.equal((500000+2000000+250000+1750000+9000000)/32000000, (50+200+25+175+900)/3200);
  assert.equal(1000000/10000000, .1);
  assert.doesNotMatch(byCode["FDIC_MONEY_SMART-001-R1"].stem, /\d/);
  assert.match(byCode["FDIC_MONEY_SMART-001-R1"].stem, /giới hạn và phạm vi/);
});
