import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chapter6V2GameData as content } from "./fixtures/content/index.mjs";
import { branchTarget, endingId, isStructured, lockReason, normalizeChapter } from "./helpers/story.mjs";
import {
  loanApr,
  loanTotal,
  loanMonthlyPayment,
  monthlyCapacity,
  cartForecast,
  statementOutcome,
  applyLoanAction,
  createLoanState,
  loanResult,
  chapterSixLearning,
  affordabilityAt,
} from "../src/pages/Kid/Dashboard/components/game/loanDetectiveRules.js";
import {
  progressKey,
  readNovelProgress,
  saveNovelProgress,
} from "../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";

// Dữ liệu như game thấy (VisualNovelPlayer chuẩn hoá: inspect → scene, reflection → activity).
const data = normalizeChapter(content);

const scenes = new Map(data.scenes.map((s) => [s.id, s]));
const loanConfig = data.scenes.find(
  (scene) => scene.game?.kind === "LOAN_DETECTIVE",
).game.config;
const loanOffers = loanConfig.offers;
const bnplItems = loanConfig.cart.items;
const loanTasks = loanConfig.tasks;
const option = (id) =>
  data.scenes.flatMap((s) => s.options || []).find((o) => o.id === id);
function completedGames() {
  const history = Object.fromEntries(
    loanTasks.map((t) => [
      t.id,
      { finalCorrect: true, firstAttemptCorrect: true, attemptCount: 1 },
    ]),
  );
  return Object.fromEntries(
    [
      ["LOAN_OFFERS_CH06", [0, 1]],
      ["LOAN_REPAYMENT_CH06", [2, 3]],
    ].map(([gameId, rounds]) => [
      gameId,
      { ...loanResult(loanConfig, history, rounds), gameId, completed: true },
    ]),
  );
}
function resolveEnding(
  flags,
  ledger,
  results = completedGames(),
  stats = data.initialStats,
) {
  const learning = chapterSixLearning(ledger, results, data.endingReport);
  const args = {
    flags,
    ...stats,
    miniGameCompleted: true,
    ...learning,
    reflectionScore: Object.values(ledger).reduce(
      (n, e) => n + (e?.reflectionScore || 0),
      0,
    ),
  };
  return endingId(data, args);
}
const ledger = {
  CH06_PLAN: { evidenceScores: { I: 2, C: 2, P: 2 } },
  CH06_REPAYMENT: { evidenceScores: { I: 2, C: 2, P: 2 } },
};
const fit = {
  credit_plan_fit: true,
  fallback_verified: true,
  repayment_understood: true,
};

test("all story links resolve, every scene is reachable and all art files exist", () => {
  assert.equal(scenes.size, data.scenes.length);
  const seen = new Set();
  function visit(id) {
    if (!id || seen.has(id)) return;
    const s = scenes.get(id);
    assert.ok(s, `Broken link ${id}`);
    seen.add(id);
    for (const target of [
      s.nextSceneId,
      s.ifTrueSceneId,
      s.ifFalseSceneId,
      ...(s.options || []).map((o) => o.nextSceneId),
    ])
      visit(target);
  }
  visit(data.scenes[0].id);
  assert.equal(seen.size, scenes.size);
  function inspect(value) {
    if (typeof value === "string" && value.startsWith("/images/"))
      assert.ok(existsSync(`public${value}`), value);
    else if (value && typeof value === "object") {
      assert.ok(!value.moneyEvents?.length, "Planning must not transact");
      Object.values(value).forEach(inspect);
    }
  }
  inspect(data);
});
test("chapter has sustained dialogue in all four scenes, with no forced borrowing", () => {
  const dialogue = data.scenes.filter((s) => s.type === "dialogue");
  assert.ok(dialogue.length >= 120);
  for (const bg of [
    "bg10-design-lab",
    "bg10b-offer-comparison-board",
    "bg10c-statement-workstation",
    "bg10d-final-planning-table",
  ]) {
    assert.ok(
      dialogue.filter((s) => s.background.endsWith(`${bg}.png`)).length >= 20,
      bg,
    );
  }
  assert.equal(data.initialMoney, 0);
  assert.deepEqual(Object.keys(data.initialStats), [
    "SAVING",
    "HAPPINESS",
    "RISK",
    "GOAL",
  ]);
  assert.equal(
    data.scenes.some(
      (s) =>
        s.setFlags?.borrowConfirmed ||
        s.options?.some((o) => o.setFlags?.borrowConfirmed),
    ),
    false,
  );
  assert.equal(option("CH06_SIGN_B"), undefined);
  assert.equal(scenes.get("CH06_FINAL_B_1").setFlags.credit_plan_fit, true);
  // B luôn chọn được: không có điều kiện khoá.
  assert.equal(option("CH06_SC02_B").condition, undefined);
  assert.equal(lockReason(option("CH06_SC02_B"), {}), null);
});
test("loan labels and abbreviations are explained in the story", () => {
  const dialogue = data.scenes
    .filter((s) => s.type === "dialogue")
    .map((s) => s.text)
    .join("\n");
  assert.ok(dialogue.includes("ba gói vay mua laptop"));
  assert.ok(dialogue.includes("Annual Percentage Rate"));
  assert.ok(dialogue.includes("Buy Now, Pay Later"));
  assert.ok(dialogue.includes("mua trước, trả sau"));
  assert.ok(dialogue.includes("Gói vay A"));
  assert.ok(dialogue.includes("gói vay B"));
  assert.ok(dialogue.includes("gói vay C"));
  assert.ok(!dialogue.includes("BNLP"));
});
test("new offers have no upfront fee; C pays twice per monthly period and receives less than the contract amount", () => {
  assert.deepEqual(loanOffers.map(loanTotal), [6720000, 6600000, 8000000]);
  assert.deepEqual(
    loanOffers.map((o) => o.upfront),
    [0, 0, 0],
  );
  assert.deepEqual(
    loanOffers.map((o) => o.received),
    [6000000, 6000000, 5400000],
  );
  assert.equal(loanOffers[2].periods * loanOffers[2].intervalMonths, 8);
  assert.deepEqual(
    loanOffers.map(loanMonthlyPayment),
    [1120000, 550000, 1000000],
  );
  assert.equal(monthlyCapacity() - loanMonthlyPayment(loanOffers[0]), -120000);
  assert.equal(
    monthlyCapacity(2700000) - loanMonthlyPayment(loanOffers[1]),
    150000,
  );
});
test("APR follows new net proceeds and payment frequency rather than copying incompatible screenshot estimates", () => {
  const expected = [40.04798773, 17.9719975, 121.17817654];
  for (const [index, offer] of loanOffers.entries()) {
    assert.ok(Math.abs(loanApr(offer) - expected[index]) < 0.000001);
    const rate = loanApr(offer) / (1200 / offer.intervalMonths);
    const present = Array.from(
      { length: offer.periods },
      (_, k) => offer.installment / (1 + rate) ** (k + 1),
    ).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(present - offer.received) < 0.001);
  }
});
test("pre-game Inspect has exactly the requested shared context and never reveals the totals", () => {
  const popup = scenes.get("CH06_OFFERS").inspect;
  assert.deepEqual(popup.shared.items, [
    "Mục tiêu vay: 6.000.000đ",
    "Mỗi kỳ tương đương với 1 tháng.",
  ]);
  assert.deepEqual(
    popup.cards.map((c) => c.label),
    ["Gói vay A", "Gói vay B", "Gói vay C"],
  );
  for (const card of popup.cards) {
    const copy = JSON.stringify(card);
    assert.ok(!copy.includes("Tổng trả"));
    assert.ok(!copy.includes("6.720.000"));
    assert.ok(!copy.includes("6.600.000"));
    assert.ok(!copy.includes("8.000.000"));
    assert.ok(!copy.includes("Phí đầu"));
  }
  assert.ok(JSON.stringify(popup.cards[2]).includes("500.000đ / ½ kỳ"));
  assert.ok(JSON.stringify(popup.cards[2]).includes("5.400.000đ"));
  assert.ok(!JSON.stringify(popup.cards[2]).includes("đã khấu trừ"));
  assert.deepEqual(
    scenes.get("CH06_GAME_OFFERS").game.reference.cards,
    popup.cards,
  );
});
test("totals submit once, retain wrong answers and score without requiring correction", () => {
  let state = createLoanState([0, 1]);
  for (const offer of loanOffers)
    state = applyLoanAction(loanConfig, state, {
      type: "TOTAL_DRAFT",
      id: offer.id,
      value: String(offer.id === "C" ? 8600000 : loanTotal(offer)),
    });
  assert.deepEqual(state.history, {});
  state = applyLoanAction(loanConfig, state, { type: "TOTAL" });
  assert.equal(state.submittedRounds[0], true);
  assert.equal(state.totals.C, "8600000");
  const result = loanResult(loanConfig, state.history, [0]);
  assert.equal(result.completed, true);
  assert.equal(result.passed, false);
  assert.equal(result.score, 2);
  assert.equal(result.firstPercent, 67);
  assert.equal(
    applyLoanAction(loanConfig, state, { type: "TOTAL_DRAFT", id: "C", value: "8000000" }),
    state,
  );
  assert.equal(applyLoanAction(loanConfig, state, { type: "TOTAL" }), state);
  assert.equal(applyLoanAction(loanConfig, state, { type: "ROUND", round: 1 }).round, 1);
});
test("blank, incomplete or invalid totals cannot be submitted and unfinished rounds cannot be skipped", () => {
  let state = createLoanState([0, 1]);
  assert.equal(applyLoanAction(loanConfig, state, { type: "TOTAL" }), state);
  assert.equal(applyLoanAction(loanConfig, state, { type: "ROUND", round: 1 }), state);
  for (const [id, value] of [
    ["A", "6720000"],
    ["B", "6600000"],
    ["C", "Infinity"],
  ])
    state = applyLoanAction(loanConfig, state, { type: "TOTAL_DRAFT", id, value });
  assert.equal(applyLoanAction(loanConfig, state, { type: "TOTAL" }), state);
  assert.deepEqual(state.history, {});
});
test("sorting accepts wrong placements and moves freely before one explicit submission", () => {
  let state = { ...createLoanState([0, 1]), round: 1 };
  assert.equal(applyLoanAction(loanConfig, state, { type: "SUBMIT_SORT" }), state);
  state = applyLoanAction(loanConfig, state, { type: "SORT", id: "A", target: "fit" });
  assert.equal(state.sorted.A, "fit");
  assert.deepEqual(state.history, {});
  state = applyLoanAction(loanConfig, state, { type: "SORT", id: "A", target: "over" });
  state = applyLoanAction(loanConfig, state, { type: "UNSORT", id: "A" });
  assert.equal(state.sorted.A, undefined);
  assert.equal(state.selected, "A");
  for (const id of ["A", "B", "C"])
    state = applyLoanAction(loanConfig, state, { type: "SORT", id, target: "fit" });
  assert.deepEqual(state.sorted, { A: "fit", B: "fit", C: "fit" });
  assert.deepEqual(state.history, {});
  state = applyLoanAction(loanConfig, state, { type: "SUBMIT_SORT" });
  assert.equal(state.submittedRounds[1], true);
  assert.equal(loanResult(loanConfig, state.history, [1]).score, 1);
  assert.equal(loanResult(loanConfig, state.history, [1]).completed, true);
  assert.equal(state.history.sortA.firstAttemptCorrect, false);
  assert.equal(state.history.sortA.attemptCount, 1);
  for (const action of [
    { type: "SORT", id: "A", target: "over" },
    { type: "UNSORT", id: "B" },
    { type: "SELECT", id: "C" },
    { type: "SUBMIT_SORT" },
  ])
    assert.equal(applyLoanAction(loanConfig, state, action), state);
});
test("moving drafts before submission does not count as a wrong attempt", () => {
  let state = { ...createLoanState([0, 1]), round: 1 };
  state = applyLoanAction(loanConfig, state, { type: "SORT", id: "A", target: "fit" });
  for (const [id, target] of [
    ["A", "over"],
    ["B", "fit"],
    ["C", "shortfall"],
  ])
    state = applyLoanAction(loanConfig, state, { type: "SORT", id, target });
  state = applyLoanAction(loanConfig, state, { type: "SUBMIT_SORT" });
  assert.equal(loanResult(loanConfig, state.history, [1]).score, 3);
  assert.equal(loanResult(loanConfig, state.history, [1]).firstPercent, 100);
  assert.equal(loanResult(loanConfig, state.history, [1]).revised, false);
});
test("shopping cart stacks monthly obligations with an existing month-two payment", () => {
  for (const item of bnplItems) {
    // Ảnh nằm trong kho ảnh VPS (tên = hash) hoặc còn trong public/images.
    if (item.image.startsWith("/images/"))
      assert.ok(existsSync(`public${item.image}`), item.image);
    else
      assert.match(
        item.image,
        /^https:\/\/kidzeconomy\.com\.vn\/finteen\/assets\/a\/[0-9a-f]{20}\.webp$/,
      );
    assert.equal(item.price, item.installment * 3);
  }
  assert.deepEqual(
    cartForecast(loanConfig, ["headphones", "notebook"]).months.map(
      (month) => month.remaining,
    ),
    [200000, 0, 200000],
  );
  assert.equal(cartForecast(loanConfig, ["headphones", "notebook"]).meetsNeed, true);
  assert.equal(cartForecast(loanConfig, ["headphones", "notebook"]).affordable, true);
  assert.equal(
    cartForecast(loanConfig, ["headphones", "decoration"]).months[1].remaining,
    -50000,
  );
  assert.equal(cartForecast(loanConfig, ["headphones", "decoration"]).affordable, false);
  assert.equal(cartForecast(loanConfig, ["notebook", "decoration"]).meetsNeed, false);
  assert.equal(cartForecast(loanConfig, ["headphones"]).meetsNeed, false);
  assert.equal(
    cartForecast(loanConfig, ["headphones", "headphones", "missing"]).monthly,
    200000,
  );
});
test("cart only scores at checkout and wrong budgets are preserved without replay", () => {
  let state = createLoanState([2, 3]);
  assert.equal(applyLoanAction(loanConfig, state, { type: "BUY_CART" }), state);
  for (const id of ["headphones", "decoration", "notebook", "notebook"])
    state = applyLoanAction(loanConfig, state, { type: "TOGGLE_ITEM", id });
  assert.deepEqual(state.basket, ["headphones", "decoration"]);
  assert.deepEqual(state.history, {});
  state = applyLoanAction(loanConfig, state, { type: "BUY_CART" });
  assert.equal(state.history.cartNeed.finalCorrect, true);
  assert.equal(state.history.cartBudget.finalCorrect, false);
  assert.equal(loanResult(loanConfig, state.history, [2]).completed, true);
  assert.equal(loanResult(loanConfig, state.history, [2]).score, 1);
  assert.equal(
    applyLoanAction(loanConfig, state, { type: "TOGGLE_ITEM", id: "decoration" }),
    state,
  );
  assert.equal(applyLoanAction(loanConfig, state, { type: "BUY_CART" }), state);
  assert.equal(applyLoanAction(loanConfig, state, { type: "ROUND", round: 3 }).round, 3);
});
test("statement choices have distinct consequences for living costs, interest and next-month debt", () => {
  const minimum = statementOutcome(loanConfig, "minimum"),
    full = statementOutcome(loanConfig, "full"),
    partial = statementOutcome(loanConfig, "partial");
  assert.equal(minimum.walletLeft, 1100000);
  assert.equal(minimum.debtLeft, 900000);
  assert.equal(minimum.interest, 18000);
  assert.equal(minimum.nextDebt, 918000);
  assert.equal(minimum.livingCovered, true);
  assert.equal(minimum.costCovered, false);
  assert.equal(full.livingShortfall, 200000);
  assert.equal(full.debtLeft, 0);
  assert.equal(full.livingCovered, false);
  assert.equal(full.costCovered, true);
  assert.equal(full.interest, 0);
  assert.equal(partial.afterLiving, 0);
  assert.equal(partial.debtLeft, 200000);
  assert.equal(partial.livingCovered && partial.costCovered, true);
  assert.equal(partial.interest, 4000);
  assert.equal(partial.nextDebt, 204000);
  assert.equal(statementOutcome(loanConfig, "half").interest, 10000);
  assert.equal(statementOutcome(loanConfig, "threeQuarters").interest, 5000);
  assert.equal(statementOutcome(loanConfig, "threeQuarters").afterLiving, 50000);
  assert.equal(statementOutcome(loanConfig, "threeQuarters").costCovered, true);
  assert.equal(statementOutcome(loanConfig, "almostFull").livingShortfall, 100000);
  assert.equal(statementOutcome(loanConfig, "missing"), null);
});
test("statement locks on confirmation, reveals events sequentially, scores once and never transacts", () => {
  for (const [id, score] of [
    ["minimum", 1],
    ["half", 1],
    ["threeQuarters", 2],
    ["partial", 2],
    ["almostFull", 1],
    ["full", 1],
  ]) {
    let state = { ...createLoanState([2, 3]), round: 3 };
    assert.equal(applyLoanAction(loanConfig, state, { type: "CONFIRM_STATEMENT" }), state);
    assert.equal(applyLoanAction(loanConfig, state, { type: "REVEAL_STATEMENT" }), state);
    state = applyLoanAction(loanConfig, state, { type: "STATEMENT_CHOICE", id });
    assert.deepEqual(state.history, {});
    state = applyLoanAction(loanConfig, state, { type: "CONFIRM_STATEMENT" });
    assert.equal(state.statementStep, 1);
    assert.deepEqual(state.history, {});
    assert.equal(
      applyLoanAction(loanConfig, state, {
        type: "STATEMENT_CHOICE",
        id: id === "partial" ? "full" : "partial",
      }),
      state,
    );
    state = applyLoanAction(loanConfig, state, { type: "REVEAL_STATEMENT" });
    assert.equal(state.statementStep, 2);
    assert.equal(loanResult(loanConfig, state.history, [3]).score, score);
    assert.equal(loanResult(loanConfig, state.history, [3]).completed, true);
    assert.equal(applyLoanAction(loanConfig, state, { type: "REVEAL_STATEMENT" }), state);
    assert.equal(state.money, undefined);
  }
  assert.equal(loanTasks.length, data.endingReport.miniGameMax);
});
test("affordability view shows complete income-minus-living-minus-installment arithmetic", () => {
  assert.deepEqual(affordabilityAt(3000000), {
    income: 3000000,
    essentials: 2000000,
    repayment: 550000,
    remaining: 450000,
  });
  assert.equal(affordabilityAt(2700000).remaining, 150000);
  assert.equal(affordabilityAt(2400000).remaining, -150000);
  const inspect = scenes.get("CH06_FINAL_DATA").inspect;
  assert.equal(inspect.cashflows.length, 2);
  assert.deepEqual(inspect.cards, []);
  assert.ok(!JSON.stringify(inspect).includes("Nếu chờ"));
});
test("waiting earns A; conditional B with a school fallback earns B; unresolved mistakes earn C", () => {
  assert.equal(resolveEnding(fit, ledger), "A_GOAL_ACHIEVED");
  assert.equal(
    resolveEnding(
      { ...fit, credit_plan_fit: false, credit_plan_conditional: true },
      ledger,
    ),
    "B_BALANCED",
  );
  for (const changes of [
    { fallback_verified: false },
    { repayment_understood: false },
    { credit_unverified: true },
  ]) {
    assert.equal(resolveEnding({ ...fit, ...changes }, ledger), "C_RECOVERY");
  }
  assert.equal(
    resolveEnding(fit, ledger, completedGames(), {
      ...data.initialStats,
      RISK: 56,
    }),
    "C_RECOVERY",
  );
  assert.equal(
    resolveEnding(fit, ledger, completedGames(), {
      ...data.initialStats,
      SAVING: 39,
    }),
    "C_RECOVERY",
  );
});
test("A requires both mini-game stages but no reflection activities or reflection score", () => {
  const games = completedGames();
  delete games.LOAN_REPAYMENT_CH06;
  assert.equal(
    chapterSixLearning(ledger, games, data.endingReport)
      .coreCalculationsCorrect,
    false,
  );
  assert.equal(resolveEnding(fit, ledger, games), "B_BALANCED");
  assert.equal(resolveEnding(fit, ledger), "A_GOAL_ACHIEVED");
  assert.equal(
    data.scenes.some((s) => s.type === "activity"),
    false,
  );
  assert.equal(
    chapterSixLearning(ledger, completedGames(), data.endingReport)
      .reflectionPercent,
    null,
  );
  assert.equal(data.endingReport.weights.reflection, 0);
});
test("bad final decisions have feedback but no repair choice, loop or route back to choose again", () => {
  assert.deepEqual(option("CH06_SC02_C").deltaStats, {
    SAVING: -2,
    HAPPINESS: 3,
    RISK: 8,
  });
  assert.deepEqual(option("CH06_SC03_B").deltaStats, { RISK: 12, GOAL: -8 });
  assert.equal(scenes.has("CH06_REPAIR_PLAN"), false);
  assert.equal(scenes.has("CH06_REPAIR_CHOICE"), false);
  assert.equal(scenes.has("CH06_REPAIR_REPAYMENT"), false);
  assert.equal(scenes.get("CH06_FINAL_C_2").nextSceneId, "CH06_REPAY_CHECK");
  assert.equal(scenes.get("CH06_MINIMUM_REVIEW_3").nextSceneId, "CH06_RECAP_1");
  const active = new Set(),
    done = new Set();
  function walk(id) {
    if (!id || done.has(id)) return;
    assert.ok(!active.has(id), `Story loop at ${id}`);
    active.add(id);
    const scene = scenes.get(id);
    for (const next of [
      scene.nextSceneId,
      scene.ifTrueSceneId,
      scene.ifFalseSceneId,
      ...(scene.options || []).map((option) => option.nextSceneId),
    ])
      walk(next);
    active.delete(id);
    done.add(id);
  }
  walk(data.scenes[0].id);
  assert.equal(data.metadata.lockDecisions, true);
  assert.equal(data.metadata.preserveFirstChoiceStats, true);
  assert.equal(scenes.get("CH06_FINAL_C_1").setFlags.credit_unverified, true);
  assert.equal(scenes.has("CH06_FINAL_PLAN"), false);
  const lateScenes = data.scenes.slice(
    data.scenes.findIndex((scene) => scene.id === "CH06_SC04_ART"),
  );
  assert.equal(
    lateScenes.some((scene) => scene.type === "choice"),
    false,
  );
});
test("conditional story branches use expressions understood by the shared player and retain the original plan", () => {
  const evaluate = (id, flags, choiceLedger = {}) => {
    const scene = scenes.get(id);
    assert.ok(isStructured(scene.condition), id);
    return branchTarget(scene, { flags, choiceLedger });
  };
  assert.equal(
    evaluate("CH06_FINAL_ROUTE", { credit_plan_fit: true }),
    "CH06_FINAL_WAIT_1",
  );
  assert.equal(
    evaluate("CH06_FINAL_ROUTE", { credit_plan_conditional: true }),
    "CH06_FINAL_ROUTE_B",
  );
  assert.equal(
    evaluate("CH06_FINAL_ROUTE_B", { credit_plan_conditional: true }),
    "CH06_FINAL_B_1",
  );
  assert.equal(
    evaluate("CH06_FINAL_ROUTE_B", { credit_unverified: true }),
    "CH06_FINAL_C_1",
  );
  // Đã hiểu cách trả nợ = chọn CH06_SC03_A (lựa chọn duy nhất bật repayment_understood; B tắt cờ) → khuôn rẽ theo choice:CH06_REPAYMENT.
  const repayment = scenes.get("CH06_SC03");
  assert.equal(repayment.choiceGroup, "CH06_REPAYMENT");
  assert.deepEqual(
    repayment.options.map((item) => [item.id, item.setFlags.repayment_understood]),
    [
      ["CH06_SC03_A", true],
      ["CH06_SC03_B", false],
    ],
  );
  assert.equal(
    evaluate("CH06_REPAY_CHECK", { repayment_understood: true }, {
      CH06_REPAYMENT: { optionId: "CH06_SC03_A" },
    }),
    "CH06_RECAP_1",
  );
  assert.equal(
    evaluate("CH06_REPAY_CHECK", { repayment_understood: false }, {
      CH06_REPAYMENT: { optionId: "CH06_SC03_B" },
    }),
    "CH06_MINIMUM_REVIEW_1",
  );
  for (const scene of data.scenes.filter(
    (scene) => scene.type === "conditional",
  ))
    assert.ok(isStructured(scene.condition), scene.id);
});
test("checkpoint round trips and rejects invalid/old snapshots; unavailable storage is harmless", () => {
  const memory = new Map();
  const storage = {
    getItem: (k) => memory.get(k),
    setItem: (k, v) => memory.set(k, v),
  };
  const snapshot = {
    scenePath: [0, 1, 2],
    stats: data.initialStats,
    money: 0,
    committedDecisions: ["CH06_SC02"],
  };
  for (const key of [
    "flags",
    "choiceLedger",
    "firstChoiceScores",
    "inspectedIds",
    "moneyEventsApplied",
    "budgetAllocations",
    "miniGameResults",
    "miniGameDoneByScene",
    "sceneActionApplied",
  ])
    snapshot[key] = {};
  snapshot.miniGameResults.offers = {
    ...loanResult(loanConfig, {}, [0, 1]),
    ui: { round: 1 },
  };
  saveNovelProgress(storage, data, snapshot);
  assert.deepEqual(readNovelProgress(storage, data), {
    ...snapshot,
    version: data.version,
    sceneIds: snapshot.scenePath.map((index) => data.scenes[index].id),
  });
  assert.equal(
    readNovelProgress(storage, { ...data, version: "old" }).version,
    "old",
  );
  storage.setItem(
    progressKey(data),
    JSON.stringify({ ...snapshot, version: data.version, scenePath: [99999] }),
  );
  assert.equal(readNovelProgress(storage, data), null);
  storage.setItem(progressKey(data), "{broken");
  assert.equal(readNovelProgress(storage, data), null);
  const denied = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("full");
    },
  };
  assert.equal(readNovelProgress(denied, data), null);
  assert.doesNotThrow(() => saveNovelProgress(denied, data, snapshot));
});
