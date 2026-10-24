import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { chapter8V2GameData as content } from "./fixtures/content/index.mjs";
import { branchTarget, choiceGroupOf, endingId, ledgerEntry, normalizeChapter } from "./helpers/story.mjs";
import {
  availableBudget,
  budgetFeedback,
  restoreFutureState,
  buildPlanReview,
  chapterEightSettlement,
  drawMarketScenario,
  resolveFutureScene,
  validMarket,
  planProjection,
  allocationValue,
  applyFutureAction,
  chapterEightLearning,
  createFutureState,
  feasibleBudget,
  futureResult,
  planBalance,
} from "../src/pages/Kid/Dashboard/components/game/futurePlanRules.js";
import {
  readNovelProgress,
  saveNovelProgress,
} from "../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js";
import { canAccessChapter, CHAPTERS } from "../src/features/workspace/model.js";
// Dữ liệu như game thấy (VisualNovelPlayer chuẩn hoá: inspect → scene, reflection → activity).
const data = normalizeChapter(content);
const futurePlanConfig = data.scenes.find(
  (scene) => scene.game?.kind === "FUTURE_PLAN",
).game.config;
const cfg = (mode) => ({ ...futurePlanConfig, mode });
const { portfolio, planner } = futurePlanConfig;
const annualGoal = planner.goal,
  legacyMarketScenario = portfolio.market.legacy,
  claimChecks = futurePlanConfig.claims.checks,
  futureTasks = futurePlanConfig.tasks,
  planMonths = planner.months,
  sampleAllocations = {
    balanced: portfolio.settlement.fitAllocation,
    concentrated: portfolio.settlement.otherAllocation,
  };
const scenes = new Map(data.scenes.map((scene) => [scene.id, scene]));
const fullRecord = {
  firstAttemptCorrect: true,
  finalCorrect: true,
  attemptCount: 1,
};
const games = () =>
  Object.fromEntries(
    [
      ["PORTFOLIO_CH08", "portfolio"],
      ["CLAIM_REVIEW_CH08", "claims"],
      ["LIFE_PLAN_CH08", "planner"],
    ].map(([gameId, kind]) => [
      gameId,
      {
        ...futureResult(futurePlanConfig, {
          ...createFutureState(cfg(kind)),
          history: Object.fromEntries(
            futureTasks.map((id) => [id, fullRecord]),
          ),
        }),
        gameId,
        completed: true,
      },
    ]),
  );
const ending = (flags, stats, ledger, results = games()) => {
  const context = {
    flags,
    ...stats,
    ...chapterEightLearning(ledger, results, data.endingReport),
    miniGameCompleted: true,
  };
  return endingId(data, context);
};
function assets(value) {
  if (typeof value === "string" && value.startsWith("/images/"))
    assert.ok(existsSync(`public${value}`), value);
  else if (value && typeof value === "object")
    Object.values(value).forEach(assets);
}
test("chapter 8 is a substantial, acyclic story with valid assets, one-shot choices and no reflections", () => {
  assert.equal(annualGoal.amount, 7200000);
  assert.equal(data.metadata.age, 18);
  assert.equal(data.initialMoney, 10000000);
  assert.equal(data.metadata.lockDecisions, true);
  assert.equal(scenes.size, data.scenes.length);
  assert.ok(
    data.scenes.filter((scene) => scene.type === "dialogue").length >= 125,
  );
  assert.equal(
    data.scenes.filter((scene) => scene.type === "choice").length,
    3,
  );
  assert.equal(
    data.scenes.some((scene) => scene.type === "activity"),
    false,
  );
  assert.equal(/kênh|người tốt|người xấu/iu.test(JSON.stringify(data)), false);
  const seen = new Set(),
    active = new Set();
  function visit(id) {
    if (!id || seen.has(id)) return;
    const scene = scenes.get(id);
    assert.ok(scene, id);
    assert.ok(!active.has(id), `Loop at ${id}`);
    active.add(id);
    [
      scene.nextSceneId,
      scene.ifTrueSceneId,
      scene.ifFalseSceneId,
      ...(scene.options || []).map((option) => option.nextSceneId),
    ].forEach(visit);
    active.delete(id);
    seen.add(id);
  }
  visit(data.scenes[0].id);
  assert.equal(seen.size, scenes.size);
  assets(data);
  for (const word of [
    "cổ tức",
    "hoa hồng",
    "ESG",
    "FOMO",
    "hưu trí",
    "300.000đ",
  ])
    assert.ok(JSON.stringify([data, annualGoal]).includes(word), word);
});
test("market arithmetic matches the fixed source examples; spreading risk can still lose money", () => {
  assert.deepEqual(legacyMarketScenario, {
    period: "sau ba tháng",
    cash: 0,
    bonds: 2,
    equity: -10,
  });
  assert.deepEqual(allocationValue(portfolio, sampleAllocations.balanced), {
    total: 100,
    delta: -220000,
    final: 9780000,
    nearMoney: 3000000,
  });
  assert.deepEqual(allocationValue(portfolio, sampleAllocations.concentrated), {
    total: 100,
    delta: -900000,
    final: 9100000,
    nearMoney: 1000000,
  });
});
test("independent market draws include both endpoints and zero without leaving the 10% range", () => {
  const draws = [0, 1 - Number.EPSILON];
  assert.deepEqual(
    drawMarketScenario(portfolio.market, () => draws.shift()),
    { period: "sau ba tháng", cash: 0, bonds: -10, equity: 10 },
  );
  assert.deepEqual(
    drawMarketScenario(portfolio.market, () => 0.5),
    { period: "sau ba tháng", cash: 0, bonds: 0, equity: 0 },
  );
  assert.equal(validMarket(portfolio.market, { cash: 0, bonds: 11, equity: 0 }), false);
  assert.equal(validMarket(portfolio.market, { cash: 0, bonds: 1.5, equity: 0 }), false);
  assert.equal(validMarket(portfolio.market, { cash: 1, bonds: 0, equity: 0 }), false);
});
test("every market combination has consistent arithmetic, dialogue and identical learning credit", () => {
  for (let bonds = -10; bonds <= 10; bonds++)
    for (let equity = -10; equity <= 10; equity++) {
      const draws = [(bonds + 10 + 0.1) / 21, (equity + 10 + 0.1) / 21];
      const market = drawMarketScenario(portfolio.market, () => draws.shift());
      assert.equal(market.bonds, bonds);
      assert.equal(market.equity, equity);
      const state = applyFutureAction(futurePlanConfig, 
        {
          ...createFutureState(cfg("portfolio")),
          allocation: sampleAllocations.balanced,
          market,
        },
        { type: "SUBMIT_ALLOCATION" },
      );
      assert.equal(futureResult(futurePlanConfig, state).score, 2);
      const results = { CH08_GAME_PORTFOLIO: futureResult(futurePlanConfig, state) };
      for (const fit of [true, false]) {
        const flags = { portfolio_fit: fit },
          settlement = chapterEightSettlement(portfolio, results, flags);
        const delta = fit ? 40000 * bonds + 30000 * equity : 90000 * equity;
        assert.equal(settlement.delta, delta);
        assert.equal(settlement.final, 10000000 + delta);
        const scene = scenes.get(
          fit ? "CH08_SETTLE_FIT" : "CH08_SETTLE_CONCENTRATED",
        );
        assert.equal(scene.inspect, undefined);
        assert.ok(
          resolveFutureScene(portfolio, scene, results, flags).text.includes(
            `${settlement.final.toLocaleString("vi-VN")}đ`,
          ),
        );
        const reaction = resolveFutureScene(portfolio, 
          scenes.get("CH08_PROMISE_1"),
          results,
          flags,
        ).text;
        assert.ok(
          reaction.includes(
            delta < 0 ? "giảm" : delta > 0 ? "tăng" : "không đổi",
          ),
          `${bonds}/${equity}: ${reaction}`,
        );
      }
    }
});
test("checkpoint restoration preserves random results and keeps legacy submitted outcomes unchanged", () => {
  const draft = createFutureState(cfg("portfolio"));
  const restored = restoreFutureState(
    cfg("portfolio"),
    JSON.parse(JSON.stringify(draft)),
  );
  assert.deepEqual(restored.market, draft.market);
  const submitted = applyFutureAction(futurePlanConfig, 
    { ...draft, allocation: sampleAllocations.balanced },
    { type: "SUBMIT_ALLOCATION" },
  );
  assert.deepEqual(
    restoreFutureState(cfg("portfolio"), JSON.parse(JSON.stringify(submitted)))
      .market,
    draft.market,
  );
  assert.equal(
    applyFutureAction(futurePlanConfig, submitted, { type: "SUBMIT_ALLOCATION" }),
    submitted,
  );
  const legacy = { ...submitted };
  delete legacy.market;
  assert.deepEqual(
    restoreFutureState(cfg("portfolio"), legacy).market,
    legacyMarketScenario,
  );
  assert.equal(
    chapterEightSettlement(portfolio, 
      { CH08_GAME_PORTFOLIO: { ui: legacy } },
      { portfolio_fit: true },
    ).final,
    9780000,
  );
});
test("each budget situation starts at zero and the chosen amounts determine the actual deadline", () => {
  let state = createFutureState(cfg("planner"));
  assert.deepEqual(
    state.budgets,
    planMonths.map(() => ({ goal: 0, flexible: 0 })),
  );
  const targets = [
    { goal: 600000, flexible: 400000 },
    { goal: 600000, flexible: 0 },
    { goal: 400000, flexible: 0 },
  ];
  for (let month = 0; month < 3; month++) {
    assert.deepEqual(state.budgets[month], { goal: 0, flexible: 0 });
    if (month > 0)
      assert.deepEqual(state.budgets[month - 1], targets[month - 1]);
    for (const [id, value] of Object.entries(targets[month]))
      for (let amount = 0; amount < value; amount += 100000) {
        state = applyFutureAction(futurePlanConfig, state, { type: "BUDGET", id, delta: 100000 });
      }
    assert.deepEqual(
      restoreFutureState(cfg("planner"), JSON.parse(JSON.stringify(state))).budgets,
      state.budgets,
    );
    state = applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_MONTH" });
    if (month < 2) state = applyFutureAction(futurePlanConfig, state, { type: "NEXT_MONTH" });
  }
  assert.deepEqual(state.budgets, targets);
  assert.equal(planBalance(planMonths[2], state.budgets[2]), 0);
  assert.equal(futureResult(futurePlanConfig, state).passed, true);
  assert.deepEqual(planProjection(planner, state.budgets), {
    yearSavings: 7000000,
    shortfall: 200000,
    feasible: true,
    extraMonths: 1,
  });
  assert.equal(scenes.get("CH08_ALLOCATION_CARDS").inspect, undefined);
  assert.equal(
    scenes.get("CH08_PLAN_CARDS").inspect.planResultFrom,
    "CH08_GAME_PLANNER",
  );
  assert.equal(buildPlanReview(planner, state).cards[2].facts[1][1], "400.000đ");
});
test("an adopted budget with a deficit remains unresolved instead of earning a feasible-plan ending", () => {
  const state = {
    ...createFutureState(cfg("planner")),
    budgets: planMonths.map(() => ({ goal: 600000, flexible: 400000 })),
  };
  assert.equal(planProjection(planner, state.budgets).feasible, false);
  const branch = scenes.get("CH08_PLAN_ROUTE");
  const flags = { plan_draft_feasible: false };
  assert.equal(branchTarget(branch, { flags }), branch.ifFalseSceneId);
  assert.equal(
    branchTarget(branch, { flags: { plan_draft_feasible: true } }),
    branch.ifTrueSceneId,
  );
  assert.equal(branch.ifFalseSceneId, "CH08_DRAFT_GAP_1");
  assert.deepEqual(scenes.get(branch.ifFalseSceneId).setFlags, {
    life_plan_feasible: false,
    life_plan_unverified: true,
  });
  assert.ok(
    budgetFeedback(planner, planMonths[2], state.budgets[2])[1].includes(
      "Vượt ngân sách 600.000đ",
    ),
  );
});
test("claims and planning are separate activities and every one is required for the final report", () => {
  const planner = createFutureState(cfg("planner")),
    claims = createFutureState(cfg("claims"));
  assert.equal(
    applyFutureAction(futurePlanConfig, planner, { type: "CHECK", id: "risk" }),
    planner,
  );
  assert.equal(applyFutureAction(futurePlanConfig, claims, { type: "SUBMIT_MONTH" }), claims);
  assert.equal(futureResult(futurePlanConfig, planner).total, 3);
  assert.equal(futureResult(futurePlanConfig, claims).total, 3);
  const results = games();
  delete results.CLAIM_REVIEW_CH08;
  assert.equal(
    chapterEightLearning({}, results, data.endingReport)
      .coreCalculationsCorrect,
    false,
  );
});
test("all eight story paths have exactly one settlement, unchanged forecast income, and source-aligned endings", () => {
  for (const a of ["A", "B"])
    for (const b of ["A", "B"])
      for (const c of ["A", "B"]) {
        let id = data.scenes[0].id,
          money = data.initialMoney,
          flags = { plan_draft_feasible: true },
          count = 0;
        const stats = { ...data.initialStats },
          ledger = {},
          applied = new Set();
        const choices = { CH08_SC02: a, CH08_SC03: b, CH08_SC04: c };
        while (id) {
          assert.ok(++count < 300);
          const scene = scenes.get(id);
          if (scene.type === "choice") {
            const option = scene.options.find(
              (option) => option.id === `${id}_${choices[id]}`,
            );
            flags = { ...flags, ...option.setFlags };
            for (const [key, value] of Object.entries(option.deltaStats))
              stats[key] += value;
            assert.equal(option.moneyEvents, undefined);
            ledger[choiceGroupOf(scene)] = ledgerEntry(option);
            id = option.nextSceneId;
          } else if (scene.type === "conditional")
            id = branchTarget(scene, { flags, stats, money, choiceLedger: ledger });
          else {
            flags = { ...flags, ...scene.setFlags };
            if (scene.marketSettlement) {
              const settlement = chapterEightSettlement(portfolio, {}, flags);
              assert.ok(!applied.has(settlement.eventId));
              money += settlement.delta;
              applied.add(settlement.eventId);
            }
            for (const event of scene.inspect?.moneyEvents || []) {
              assert.ok(!applied.has(event.eventId));
              money += event.amount;
              applied.add(event.eventId);
            }
            id = scene.nextSceneId;
          }
        }
        assert.equal(money, a === "A" ? 9780000 : 9100000);
        assert.equal(applied.size, 1);
        assert.equal(
          ending(flags, stats, ledger),
          a === b && b === c && c === "A" ? "A_GOAL_ACHIEVED" : "C_RECOVERY",
        );
        if (a === b && b === c && c === "A") {
          assert.equal(stats.SAVING, 56);
          assert.equal(stats.RISK, 23);
          assert.equal(stats.GOAL, 60);
          assert.equal(ending(flags, stats, ledger, {}), "B_BALANCED");
        }
      }
});
test("allocation drafts are bounded, cannot overallocate, and submit wrong answers without retries", () => {
  let state = createFutureState(cfg("portfolio"));
  assert.equal(applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_ALLOCATION" }), state);
  assert.equal(
    applyFutureAction(futurePlanConfig, state, { type: "ALLOCATE", id: "cash", delta: -10 }),
    state,
  );
  for (let i = 0; i < 10; i++)
    state = applyFutureAction(futurePlanConfig, state, {
      type: "ALLOCATE",
      id: "equity",
      delta: 10,
    });
  assert.equal(
    applyFutureAction(futurePlanConfig, state, { type: "ALLOCATE", id: "bonds", delta: 10 }),
    state,
  );
  assert.deepEqual(state.history, {});
  state = applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_ALLOCATION" });
  assert.equal(futureResult(futurePlanConfig, state).completed, true);
  assert.equal(futureResult(futurePlanConfig, state).score, 0);
  assert.equal(
    applyFutureAction(futurePlanConfig, state, { type: "ALLOCATE", id: "equity", delta: -10 }),
    state,
  );
  assert.equal(applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_ALLOCATION" }), state);
});
test("the portfolio exercise rewards goal protection and diversification, not the largest market return", () => {
  const balanced = applyFutureAction(futurePlanConfig, 
    {
      ...createFutureState(cfg("portfolio")),
      allocation: sampleAllocations.balanced,
    },
    { type: "SUBMIT_ALLOCATION" },
  );
  assert.equal(futureResult(futurePlanConfig, balanced).passed, true);
  const allCash = applyFutureAction(futurePlanConfig, 
    {
      ...createFutureState(cfg("portfolio")),
      allocation: { cash: 100, bonds: 0, equity: 0 },
    },
    { type: "SUBMIT_ALLOCATION" },
  );
  assert.ok(
    allocationValue(portfolio, allCash.allocation).final >
      allocationValue(portfolio, balanced.allocation).final,
  );
  assert.equal(futureResult(futurePlanConfig, allCash).score, 1);
});
test("claim checks permit unsafe selections, retain first answers, and freeze only after submission", () => {
  let state = createFutureState(cfg("claims"));
  assert.equal(
    applyFutureAction(futurePlanConfig, state, { type: "BUDGET", id: "goal", delta: -100000 }),
    state,
  );
  for (const check of claimChecks.filter((check) => !check.correct))
    state = applyFutureAction(futurePlanConfig, state, { type: "CHECK", id: check.id });
  assert.deepEqual(state.history, {});
  assert.equal(applyFutureAction(futurePlanConfig, state, { type: "CHECK", id: "risk" }), state);
  state = applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_CHECKS" });
  assert.equal(state.checksSubmitted, true);
  assert.equal(
    Object.values(state.history).filter((record) => record.finalCorrect).length,
    0,
  );
  assert.equal(applyFutureAction(futurePlanConfig, state, { type: "CHECK", id: "risk" }), state);
});
test("budget maths count the existing obligation once and allow different feasible tradeoffs", () => {
  assert.equal(
    planBalance(planMonths[0], { goal: 600000, flexible: 400000 }),
    0,
  );
  assert.equal(
    planBalance(planMonths[1], { goal: 600000, flexible: 400000 }),
    -400000,
  );
  assert.equal(
    planBalance(planMonths[2], { goal: 600000, flexible: 400000 }),
    -600000,
  );
  assert.ok(feasibleBudget(planMonths[2], { goal: 400000, flexible: 0 }));
  assert.ok(feasibleBudget(planMonths[2], { goal: 200000, flexible: 100000 }));
  assert.equal(
    feasibleBudget(planMonths[2], { goal: 600000, flexible: 0 }),
    false,
  );
  assert.ok(feasibleBudget(planMonths[2], { goal: 0, flexible: 0 }));
  assert.equal(
    planProjection(planner, planMonths.map(() => ({ goal: 0, flexible: 0 }))).feasible,
    false,
  );
});
test("the two budget controls share one limit and increasing either transfers from the other", () => {
  let state = createFutureState(cfg("planner"));
  for (const [id, steps] of [
    ["goal", 6],
    ["flexible", 4],
  ])
    for (let i = 0; i < steps; i++)
      state = applyFutureAction(futurePlanConfig, state, { type: "BUDGET", id, delta: 100000 });
  state = applyFutureAction(futurePlanConfig, state, {
    type: "BUDGET",
    id: "flexible",
    delta: 100000,
  });
  assert.deepEqual(state.budgets[0], { goal: 500000, flexible: 500000 });
  state = applyFutureAction(futurePlanConfig, state, {
    type: "BUDGET",
    id: "goal",
    delta: 100000,
  });
  assert.deepEqual(state.budgets[0], { goal: 600000, flexible: 400000 });
  for (let i = 0; i < 4; i++)
    state = applyFutureAction(futurePlanConfig, state, {
      type: "BUDGET",
      id: "goal",
      delta: 100000,
    });
  assert.deepEqual(state.budgets[0], { goal: 1000000, flexible: 0 });
  assert.equal(
    applyFutureAction(futurePlanConfig, state, { type: "BUDGET", id: "goal", delta: 100000 }),
    state,
  );
  for (let i = 0; i < 10; i++)
    state = applyFutureAction(futurePlanConfig, state, {
      type: "BUDGET",
      id: "flexible",
      delta: 100000,
    });
  assert.deepEqual(state.budgets[0], { goal: 0, flexible: 1000000 });
  state = applyFutureAction(futurePlanConfig, state, {
    type: "BUDGET",
    id: "flexible",
    delta: -100000,
  });
  assert.equal(planBalance(planMonths[0], state.budgets[0]), 100000);
});
test("no month can allocate more than its available income, including on load and when moving forward", () => {
  let state = createFutureState(cfg("planner"));
  for (let month = 0; month < 3; month++) {
    for (const id of ["goal", "flexible", "goal"])
      for (let i = 0; i < 12; i++) {
        state = applyFutureAction(futurePlanConfig, state, { type: "BUDGET", id, delta: 100000 });
        assert.ok(planBalance(planMonths[month], state.budgets[month]) >= 0);
        assert.ok(
          state.budgets[month][id] <= availableBudget(planMonths[month]),
        );
      }
    state = applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_MONTH" });
    if (month < 2) state = applyFutureAction(futurePlanConfig, state, { type: "NEXT_MONTH" });
  }
  const draft = createFutureState(cfg("planner"));
  draft.budgets[0] = { goal: 600000, flexible: 700000 };
  const repaired = restoreFutureState(cfg("planner"), draft);
  assert.deepEqual(repaired.budgets[0], { goal: 600000, flexible: 400000 });
  assert.deepEqual(draft.budgets[0], { goal: 600000, flexible: 700000 });
  draft.submittedMonths[0] = true;
  assert.deepEqual(
    restoreFutureState(cfg("planner"), draft).budgets[0],
    draft.budgets[0],
  );
});
test("feedback describes the actual 400k and 200k allocation instead of a fixed 600k saving example", () => {
  const feedback = budgetFeedback(planner, planMonths[1], {
    goal: 400000,
    flexible: 200000,
  });
  assert.ok(feedback[0].includes("400.000đ cho quỹ học tập"));
  assert.ok(feedback[0].includes("200.000đ cho đi chơi"));
  assert.ok(feedback[1].includes("400.000đ + 200.000đ = 600.000đ"));
  assert.ok(!feedback.join(" ").includes("để dành 600.000đ"));
});
test("all three budget months must be submitted once; mistakes still permit completion", () => {
  let state = createFutureState(cfg("planner"));
  assert.equal(applyFutureAction(futurePlanConfig, state, { type: "NEXT_MONTH" }), state);
  for (let month = 0; month < 3; month++) {
    state = applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_MONTH" });
    assert.equal(
      applyFutureAction(futurePlanConfig, state, { type: "BUDGET", id: "goal", delta: -100000 }),
      state,
    );
    assert.equal(applyFutureAction(futurePlanConfig, state, { type: "SUBMIT_MONTH" }), state);
    if (month < 2) state = applyFutureAction(futurePlanConfig, state, { type: "NEXT_MONTH" });
  }
  assert.equal(futureResult(futurePlanConfig, state).completed, true);
  assert.equal(futureResult(futurePlanConfig, state).score, 0);
  assert.equal(futureResult(futurePlanConfig, state).passed, false);
  assert.equal(applyFutureAction(futurePlanConfig, state, { type: "NEXT_MONTH" }), state);
});
test("checkpoint saves allocation drafts and one-time settlement without changing decisions", () => {
  const values = new Map(),
    storage = {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
    };
  const draft = applyFutureAction(futurePlanConfig, createFutureState(cfg("portfolio")), {
    type: "ALLOCATE",
    id: "cash",
    delta: 10,
  });
  const snapshot = {
    scenePath: [0],
    money: 9780000,
    stats: data.initialStats,
    committedDecisions: ["CH08_SC02"],
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
  snapshot.moneyEventsApplied.CH08_MARKET_SETTLEMENT = true;
  snapshot.miniGameResults.CH08_GAME_PORTFOLIO = { ui: draft };
  saveNovelProgress(storage, data, snapshot);
  const saved = readNovelProgress(storage, data);
  assert.deepEqual(saved.miniGameResults.CH08_GAME_PORTFOLIO.ui.allocation, {
    cash: 10,
    bonds: 0,
    equity: 0,
  });
  assert.equal(saved.money, 9780000);
  assert.equal(saved.moneyEventsApplied.CH08_MARKET_SETTLEMENT, true);
});
test("chapter eight is loadable and playable by an existing guest without a subscription", () => {
  assert.equal(CHAPTERS[7], data.title);
  assert.equal(canAccessChapter({ role: "guest" }, 8), true);
  assert.equal(canAccessChapter(null, 8), false);
  const read = (path) => readFileSync(path, "utf8");
  assert.ok(
    // Một nguồn: mọi chương (kể cả 8 → CH08) tải từ bản phát hành BE, không còn file chương tĩnh.
    read("src/pages/Kid/Dashboard/KidGames.jsx").includes(
      "getChapterContent(chapterCode(chapterNumber))",
    ) && !existsSync("src/pages/Kid/Dashboard/data/chapter8V2VisualNovel.js"),
  );
  assert.ok(
    read("src/features/workspace/KidPages.jsx").includes(
      "/dashboard/demo/play?chapter=8",
    ),
  );
  assert.ok(
    read(
      "src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx",
    ).includes("FuturePlanMiniGame"),
  );
});
