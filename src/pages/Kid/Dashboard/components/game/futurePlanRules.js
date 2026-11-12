// Classroom scenarios, not forecasts. One independent draw per asset and per playthrough.
// Dữ liệu mini-game (tài sản, thị trường, thẻ kiểm tra, tháng, mục tiêu, chữ) nằm trong JSON chương: game.config
// (khung FUTURE_PLAN, config.mode = portfolio | claims | planner). File này chỉ còn luật.
import { fill } from "./shoppingMissionRules.js";
const cash = (value) => `${value.toLocaleString("vi-VN")}đ`;
export function drawMarketScenario(market, random = Math.random) {
  const max = market.maxMove;
  const draw = () =>
    Math.max(-max, Math.min(max, Math.floor(random() * (2 * max + 1)) - max));
  return {
    period: market.period,
    ...market.fixed,
    ...Object.fromEntries(market.drawn.map((id) => [id, draw()])),
  };
}
export function validMarket(market, value) {
  return Boolean(
    value &&
    Object.entries(market.fixed).every(([id, move]) => value[id] === move) &&
    market.drawn.every(
      (id) =>
        Number.isInteger(value[id]) && Math.abs(value[id]) <= market.maxMove,
    ),
  );
}
export function allocationValue(
  portfolio,
  allocation,
  market = portfolio.market.legacy,
) {
  const total = portfolio.assets.reduce(
    (sum, asset) => sum + allocation[asset.id],
    0,
  );
  const delta = portfolio.assets.reduce(
    (sum, asset) =>
      sum +
      (allocation[asset.id] * portfolio.pointValue * market[asset.id]) / 100,
    0,
  );
  return {
    total,
    delta,
    final: portfolio.startingAmount + delta,
    nearMoney: allocation[portfolio.nearAsset] * portfolio.pointValue,
  };
}
// Mỗi loại tháng lặp yearCount lần trong năm mẫu (10 tháng bình thường + 2 tháng khó).
export function planProjection(planner, budgets) {
  const yearSavings = planner.months.reduce(
    (sum, month, index) => sum + budgets[index].goal * month.yearCount,
    0,
  );
  const shortfall = Math.max(0, planner.goal.amount - yearSavings);
  const feasible =
    planner.months.every((month, index) =>
      feasibleBudget(month, budgets[index]),
    ) &&
    yearSavings > 0 &&
    (shortfall === 0 || budgets[0].goal > 0);
  return {
    yearSavings,
    shortfall,
    feasible,
    extraMonths:
      shortfall === 0
        ? 0
        : budgets[0].goal > 0
          ? Math.ceil(shortfall / budgets[0].goal)
          : null,
  };
}
export const availableBudget = (month) =>
  Math.max(0, month.income - month.essential);
export function clampBudget(month, budget) {
  const available = availableBudget(month);
  const goal = Math.min(available, Math.max(0, budget.goal));
  return {
    goal,
    flexible: Math.min(available - goal, Math.max(0, budget.flexible)),
  };
}
export function budgetFeedback(planner, month, budget) {
  const t = planner.feedback;
  const balance = planBalance(month, budget);
  return [
    fill(t.summary, {
      available: cash(availableBudget(month)),
      goal: cash(budget.goal),
      flexible: cash(budget.flexible),
    }),
    fill(t.sum, {
      goal: cash(budget.goal),
      flexible: cash(budget.flexible),
      total: cash(budget.goal + budget.flexible),
      balance:
        balance < 0
          ? fill(t.over, { amount: cash(-balance) })
          : balance === 0
            ? t.exact
            : fill(t.spare, { amount: cash(balance) }),
    }),
    budget.goal === 0 ? t.noGoal : t.withGoal,
  ];
}
export function buildPlanReview(planner, state) {
  if (!state?.budgets) return {};
  const t = planner.review;
  const projection = planProjection(planner, state.budgets);
  return {
    cards: planner.months.map((month, index) => {
      const budget = state.budgets[index],
        balance = planBalance(month, budget);
      return {
        id: month.id,
        label: month.label,
        image: month.reviewImage,
        facts: [
          [t.incomeLabel, `${cash(month.income)} / ${cash(month.essential)}`],
          [t.goalLabel, cash(budget.goal)],
          [t.flexibleLabel, cash(budget.flexible)],
          [
            balance < 0 ? t.missingLabel : t.spareLabel,
            cash(Math.abs(balance)),
          ],
        ],
      };
    }),
    shared: {
      label: t.sharedLabel,
      items: [
        fill(t.goalLine, {
          goal: cash(planner.goal.amount),
          year: cash(projection.yearSavings),
        }),
        !projection.feasible
          ? t.infeasible
          : projection.shortfall
            ? fill(t.shortfall, {
                shortfall: cash(projection.shortfall),
                perMonth: cash(state.budgets[0].goal),
                months: projection.extraMonths,
              })
            : t.enough,
      ],
    },
  };
}
export function chapterEightSettlement(portfolio, results, flags) {
  const { settlement } = portfolio;
  const saved = results[settlement.resultFrom]?.ui?.market;
  // Existing submitted 1.1 checkpoints used the old fixed market and must keep their result.
  const market = validMarket(portfolio.market, saved)
    ? saved
    : portfolio.market.legacy;
  const allocation = flags[settlement.fitFlag]
    ? settlement.fitAllocation
    : settlement.otherAllocation;
  return {
    ...allocationValue(portfolio, allocation, market),
    market,
    eventId: settlement.eventId,
  };
}
export function resolveFutureScene(portfolio, scene, results, flags) {
  if (!scene?.marketText) return scene;
  const { market, delta, final } = chapterEightSettlement(
    portfolio,
    results,
    flags,
  );
  const movement = (value) =>
    value > 0
      ? `tăng ${value}%`
      : value < 0
        ? `giảm ${-value}%`
        : "giữ nguyên giá trị";
  const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const text = fill(scene.marketText[dir] ?? scene.text, {
    bonds: movement(market.bonds),
    equity: movement(market.equity),
    final: cash(final),
    change: cash(Math.abs(delta)),
    start: cash(portfolio.startingAmount),
  });
  // Lịch sử lựa chọn trong VisualNovelPlayer lưu scene.title.
  return { ...scene, title: text, text };
}
export function createFutureState(config) {
  return {
    kind: config.mode,
    market:
      config.mode === "portfolio"
        ? drawMarketScenario(config.portfolio.market)
        : null,
    allocation: Object.fromEntries(
      config.portfolio.assets.map((asset) => [asset.id, 0]),
    ),
    allocationSubmitted: false,
    checks: [],
    checksSubmitted: false,
    month: 0,
    budgets: config.planner.months.map(() => ({ goal: 0, flexible: 0 })),
    submittedMonths: {},
    history: {},
  };
}
export function restoreFutureState(config, saved) {
  if (!saved) return createFutureState(config);
  const { market } = config.portfolio;
  return {
    ...saved,
    market:
      config.mode !== "portfolio"
        ? null
        : validMarket(market, saved.market)
          ? saved.market
          : saved.allocationSubmitted
            ? { ...market.legacy }
            : drawMarketScenario(market),
    budgets: saved.budgets.map((budget, index) =>
      saved.submittedMonths[index]
        ? budget
        : clampBudget(config.planner.months[index], budget),
    ),
  };
}
const record = (value) => ({
  firstAttemptCorrect: value,
  finalCorrect: value,
  attemptCount: 1,
});
export function planBalance(month, budget) {
  return month.income - month.essential - budget.goal - budget.flexible;
}
export function feasibleBudget(month, budget) {
  return (
    Number.isFinite(budget.goal) &&
    Number.isFinite(budget.flexible) &&
    budget.goal >= 0 &&
    budget.flexible >= 0 &&
    planBalance(month, budget) >= 0
  );
}
export function applyFutureAction(config, state, action) {
  const { portfolio, claims, planner } = config;
  if (state.kind === "portfolio") {
    if (state.allocationSubmitted) return state;
    if (
      action.type === "ALLOCATE" &&
      portfolio.assets.some((asset) => asset.id === action.id) &&
      [-portfolio.step, portfolio.step].includes(action.delta)
    ) {
      if (
        state.allocation[action.id] + action.delta < 0 ||
        allocationValue(portfolio, state.allocation).total + action.delta >
          portfolio.totalPoints
      )
        return state;
      return {
        ...state,
        allocation: {
          ...state.allocation,
          [action.id]: state.allocation[action.id] + action.delta,
        },
      };
    }
    if (
      action.type === "SUBMIT_ALLOCATION" &&
      allocationValue(portfolio, state.allocation).total ===
        portfolio.totalPoints
    )
      return {
        ...state,
        allocationSubmitted: true,
        history: {
          allocation_near: record(
            state.allocation[portfolio.nearAsset] >= portfolio.nearMinPoints,
          ),
          allocation_spread: record(
            portfolio.spreadAssets.every((id) => state.allocation[id] > 0),
          ),
        },
      };
    return state;
  }
  if (
    state.kind === "claims" &&
    action.type === "CHECK" &&
    !state.checksSubmitted &&
    claims.checks.some((check) => check.id === action.id)
  ) {
    const checks = state.checks.includes(action.id)
      ? state.checks.filter((id) => id !== action.id)
      : state.checks.length < claims.pickCount
        ? [...state.checks, action.id]
        : state.checks;
    return checks === state.checks ? state : { ...state, checks };
  }
  if (
    state.kind === "claims" &&
    action.type === "SUBMIT_CHECKS" &&
    !state.checksSubmitted &&
    state.checks.length === claims.pickCount
  )
    return {
      ...state,
      checksSubmitted: true,
      history: {
        ...state.history,
        ...Object.fromEntries(
          claims.checks
            .filter((check) => check.correct)
            .map((check) => [
              `claim_${check.id}`,
              record(state.checks.includes(check.id)),
            ]),
        ),
      },
    };
  if (state.kind !== "planner") return state;
  const months = planner.months;
  if (
    action.type === "BUDGET" &&
    !state.submittedMonths[state.month] &&
    ["goal", "flexible"].includes(action.id) &&
    [-planner.step, planner.step].includes(action.delta)
  ) {
    const value = state.budgets[state.month][action.id] + action.delta;
    const available = availableBudget(months[state.month]);
    if (value < 0 || value > available) return state;
    const other = action.id === "goal" ? "flexible" : "goal";
    const budget = {
      [action.id]: value,
      [other]: Math.min(state.budgets[state.month][other], available - value),
    };
    return {
      ...state,
      budgets: state.budgets.map((previous, index) =>
        index === state.month ? budget : previous,
      ),
    };
  }
  if (action.type === "SUBMIT_MONTH" && !state.submittedMonths[state.month])
    return {
      ...state,
      submittedMonths: { ...state.submittedMonths, [state.month]: true },
      history: {
        ...state.history,
        [`plan_${months[state.month].id}`]: record(
          feasibleBudget(months[state.month], state.budgets[state.month]) &&
            state.budgets[state.month].goal > 0,
        ),
      },
    };
  if (
    action.type === "NEXT_MONTH" &&
    state.submittedMonths[state.month] &&
    state.month < months.length - 1
  )
    return {
      ...state,
      month: state.month + 1,
      budgets: state.budgets.map((budget, index) =>
        index === state.month + 1 ? { goal: 0, flexible: 0 } : budget,
      ),
    };
  return state;
}
export function futureResult(config, state) {
  const prefix =
    state.kind === "portfolio"
      ? "allocation_"
      : state.kind === "claims"
        ? "claim_"
        : "plan_";
  const tasks = config.tasks.filter((id) => id.startsWith(prefix));
  const score = tasks.filter((id) => state.history[id]?.finalCorrect).length;
  return {
    score,
    total: tasks.length,
    completed: tasks.every((id) => Boolean(state.history[id])),
    passed: score === tasks.length,
    firstPercent: Math.round((score * 100) / tasks.length),
    answers: state.history,
    revised: false,
    ui: state,
  };
}
// Both chapters use a weighted, first-submission ledger; no reflections or random market scores.
export { chapterSevenLearning as chapterEightLearning } from "./scamOrSafeRules.js";
