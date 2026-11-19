import assert from "node:assert/strict";
import test from "node:test";
import before from "../scripts/content-migrations/gv15-questions-2026-11-19.before.json" with { type: "json" };
import replacements from "../scripts/content-migrations/gv15-questions-2026-11-19.replacements.json" with { type: "json" };
import variants from "../scripts/content-migrations/lead-review-2026-11-19.variants.json" with { type: "json" };

const byCode = Object.fromEntries(replacements.map(({ body }) => [body.externalId.replace(/-R1$/, ""), body]));

test("replacement requests retain content, link old identities and fit the Studio source limit", () => {
  assert.equal(replacements.length, 12);
  for (const replacement of replacements) {
    const old = before.find((question) => question.id === replacement.replacesId);
    assert.ok(old);
    const { body } = replacement;
    assert.equal(body.externalId, `${old.externalId}-R1`);
    assert.equal(body.replacesId, old.id);
    assert.ok(body.source.length <= 160);
    assert.match(body.source, /https:\/\/doi.org\/10.1787\//);
    assert.ok(body.license.includes("OECD"));
    if (old.externalId === "PISA-035") assert.match(body.license, /CC BY-NC-SA/);
  }
});

test("every personalized item explains its category, including the premium art set", () => {
  const items = variants.CH01.scenes[0].game.items;
  const explanations = items.flatMap((item) => Object.values(item.variants));
  assert.equal(explanations.length, 31);
  for (const item of items) for (const variant of Object.values(item.variants)) {
    assert.match(variant.explanation, item.id === "ITEM_ART_CLASS" ? /Cần/ : /Muốn/);
    if (item.id === "ITEM_ART_CLASS") assert.match(variant.explanation, /ngày 28/);
  }
  assert.match(items.find((item) => item.id === "ITEM_REPLACEMENT_HEADPHONES").variants["interest:ART"].explanation, /hoãn nâng cấp/);
});

test("GV-15 covers all twelve reviewed questions and preserves identities and grading metadata", () => {
  assert.equal(replacements.length, 12);
  for (const { replacesId, body } of replacements) {
    const original = before.find((question) => question.id === replacesId);
    assert.ok(original);
    for (const key of ["pool", "correctIndex", "standard", "concept", "chapter"]) {
      assert.deepEqual(body[key], original[key]);
    }
    assert.match(body.license, /OECD/);
    assert.ok(body.correctIndex >= 0 && body.correctIndex < body.options.length);
    assert.equal(new Set(body.options).size, body.options.length);
    assert.doesNotMatch(body.stem + body.options.join(" "), /<[^>]*>|\$|zeds|Tôi muốn biết|Cùng bài|\[thêm|\[Tự phát\]/);
  }
});

test("inflation and annual compounding retain one mathematically correct answer", () => {
  assert.equal(byCode["OECD_INFE-002"].options.length, 3);
  assert.ok(200000 / 1.05 < 200000);
  assert.match(byCode["OECD_INFE-002"].options[2], /Ít hơn/);
  assert.ok(1000000 * 1.02 ** 5 > 1100000);
  assert.match(byCode["OECD_INFE-005"].stem, /2%\/năm/);
  assert.match(byCode["OECD_INFE-005"].stem, /lãi được nhập vào tiền gốc/);
  assert.match(byCode["OECD_INFE-005"].options[0], /Nhiều hơn 1\.100\.000/);
});

test("invoice item totals, tax, postage and outstanding balance agree", () => {
  const subtotal = 3 * 20000 + 60000 + 10000;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + 10000;
  const invoice = byCode["PISA-021"];
  assert.equal(subtotal, 130000);
  assert.equal(total, 153000);
  for (const line of ["Tổng tiền hàng chưa thuế: 130.000 đồng", "Thuế 10% trên tiền hàng: 13.000 đồng", "Tổng cộng: 153.000 đồng", "Đã thanh toán: 0 đồng", "Còn phải trả: 153.000 đồng"]) {
    assert.ok(invoice.stem.split("\n").includes(line));
  }
  assert.match(invoice.options[invoice.correctIndex], /Sarah cần trả tiền/);
  assert.match(byCode["PISA-035"].stem, /Greg vừa mua một chiếc xe đạp/);
  assert.match(byCode["PISA-035"].options[0], /Bảo hiểm/);
});
