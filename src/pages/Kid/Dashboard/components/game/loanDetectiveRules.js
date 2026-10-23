import { chapterMiniGameSummary } from "./miniGameRules.js";
// Dữ liệu mini-game (gói vay, khay, giỏ hàng, sao kê, chữ) nằm trong JSON chương: game.config (khung LOAN_DETECTIVE).
export const loanTotal = (offer) => offer.periods * offer.installment;
export const loanMonthlyPayment = (offer) =>
  offer.installment / offer.intervalMonths;
// Annualized periodic IRR from net proceeds and regularly spaced installments.
// Half a period is half a modeled month, not 14 days. Not a statutory disclosure.
export function loanApr(offer) {
  let low = 0,
    high = 1;
  for (let i = 0; i < 100; i++) {
    const rate = (low + high) / 2;
    const present = Array.from(
      { length: offer.periods },
      (_, k) => offer.installment / (1 + rate) ** (k + 1),
    ).reduce((a, b) => a + b, 0);
    if (present > offer.received) low = rate;
    else high = rate;
  }
  return ((((low + high) / 2) * 12) / offer.intervalMonths) * 100;
}
export const monthlyCapacity = (income = 3000000, essentials = 2000000) =>
  income - essentials;
export const affordabilityAt = (
  income,
  essentials = 2000000,
  repayment = 550000,
) => ({
  income,
  essentials,
  repayment,
  remaining: income - essentials - repayment,
});
export function cartForecast({ cart }, ids) {
  const items = cart.items.filter((item) => ids.includes(item.id));
  const monthly = items.reduce((sum, item) => sum + item.installment, 0);
  const months = Array.from({ length: cart.months }, (_, i) => i + 1).map(
    (month) => {
      const other = cart.otherDue[month] || 0;
      return {
        month,
        available: cart.available,
        other,
        payment: monthly,
        remaining: cart.available - monthly - other,
      };
    },
  );
  return {
    items,
    monthly,
    total: monthly * cart.months,
    months,
    meetsNeed:
      items.some((item) => item.id === cart.requiredItemId) &&
      items.length >= cart.minItems,
    affordable: months.every((month) => month.remaining >= 0),
  };
}
export function statementOutcome({ statement }, id) {
  const option = statement.options.find((option) => option.id === id);
  if (!option) return null;
  const walletLeft = statement.wallet - option.amount;
  const debtLeft = statement.debt - option.amount;
  // Explicit teaching rule, not a model of any actual credit-card contract.
  const interest = Math.round(debtLeft * statement.interestRate);
  return {
    ...option,
    walletLeft,
    debtLeft,
    afterLiving: walletLeft - statement.living,
    livingShortfall: Math.max(0, statement.living - walletLeft),
    interest,
    nextDebt: debtLeft + interest,
    livingCovered: walletLeft >= statement.living,
    costCovered: interest <= statement.maxInterest,
  };
}
export function createLoanState(rounds) {
  return {
    round: rounds[0],
    totals: {},
    sorted: {},
    selected: null,
    submittedRounds: {},
    basket: [],
    statementChoice: null,
    statementStep: 0,
    history: {},
    feedback: "",
  };
}
function recordTask(history, id, correct) {
  if (history[id]) return history;
  return {
    ...history,
    [id]: {
      firstAttemptCorrect: correct,
      finalCorrect: correct,
      attemptCount: 1,
    },
  };
}
// Drafts never score. A submission records all criteria once, including wrong answers.
// Completion and correctness are separate: feedback never blocks story progression.
export function applyLoanAction(config, state, action) {
  const { offers, sort } = config;
  const texts = config.texts.feedback;
  const view = config.rounds[state.round]?.view;
  let next = { ...state, feedback: "" };
  const complete = (id, correct) => {
    next.history = recordTask(next.history, id, correct);
  };
  const submit = () => {
    next.submittedRounds = { ...state.submittedRounds, [state.round]: true };
    next.selected = null;
  };
  if (action.type === "ROUND")
    return state.submittedRounds[state.round] &&
      action.round === state.round + 1
      ? { ...next, round: action.round, selected: null }
      : state;
  if (state.submittedRounds[state.round]) return state;
  if (
    action.type === "TOTAL_DRAFT" &&
    view === "totals" &&
    offers.some((o) => o.id === action.id)
  ) {
    return { ...next, totals: { ...state.totals, [action.id]: action.value } };
  }
  if (action.type === "TOTAL" && view === "totals") {
    if (
      !offers.every(
        (o) =>
          String(state.totals[o.id] ?? "").trim() &&
          Number.isFinite(Number(state.totals[o.id])) &&
          Number(state.totals[o.id]) >= 0,
      )
    )
      return state;
    for (const offer of offers)
      complete(
        `receipt${offer.id}`,
        Number(state.totals[offer.id]) === loanTotal(offer),
      );
    submit();
    next.feedback = texts.totals;
  } else if (
    action.type === "SELECT" &&
    view === "sort" &&
    offers.some((o) => o.id === action.id)
  ) {
    next.selected = action.id;
  } else if (
    action.type === "SORT" &&
    view === "sort" &&
    sort.targets[action.id] &&
    Object.values(sort.targets).includes(action.target)
  ) {
    next.sorted = { ...state.sorted, [action.id]: action.target };
    next.selected = null;
    next.feedback = texts.sorted.replace("{id}", action.id);
  } else if (
    action.type === "UNSORT" &&
    view === "sort" &&
    state.sorted[action.id]
  ) {
    next.sorted = { ...state.sorted };
    delete next.sorted[action.id];
    next.selected = action.id;
  } else if (action.type === "SUBMIT_SORT" && view === "sort") {
    if (!offers.every((o) => state.sorted[o.id])) return state;
    for (const offer of offers)
      complete(
        `sort${offer.id}`,
        state.sorted[offer.id] === sort.targets[offer.id],
      );
    submit();
    next.feedback = texts.sortChecked;
  } else if (
    action.type === "TOGGLE_ITEM" &&
    view === "cart" &&
    config.cart.items.some((item) => item.id === action.id)
  ) {
    next.basket = state.basket.includes(action.id)
      ? state.basket.filter((id) => id !== action.id)
      : [...state.basket, action.id];
  } else if (action.type === "BUY_CART" && view === "cart") {
    if (!state.basket.length) return state;
    const forecast = cartForecast(config, state.basket);
    complete("cartNeed", forecast.meetsNeed);
    complete("cartBudget", forecast.affordable);
    submit();
    next.feedback = texts.cart;
  } else if (
    action.type === "STATEMENT_CHOICE" &&
    view === "statement" &&
    state.statementStep === 0 &&
    statementOutcome(config, action.id)
  ) {
    next.statementChoice = action.id;
  } else if (
    action.type === "CONFIRM_STATEMENT" &&
    view === "statement" &&
    state.statementStep === 0 &&
    statementOutcome(config, state.statementChoice)
  ) {
    next.statementStep = 1;
    next.feedback = texts.statementConfirmed;
  } else if (
    action.type === "REVEAL_STATEMENT" &&
    view === "statement" &&
    state.statementStep === 1
  ) {
    const outcome = statementOutcome(config, state.statementChoice);
    complete("statementLiving", outcome.livingCovered);
    complete("statementCost", outcome.costCovered);
    next.statementStep = 2;
    submit();
    next.feedback = texts.statementRevealed;
  } else return state;
  return next;
}
export function loanResult({ tasks: allTasks }, history, rounds) {
  const tasks = allTasks.filter(
    (t) => rounds.includes(t.round) && t.required !== false,
  );
  const score = tasks.filter((t) => history[t.id]?.finalCorrect).length;
  return {
    score,
    total: tasks.length,
    completed: tasks.every((t) => Boolean(history[t.id])),
    passed: score === tasks.length,
    firstPercent: Math.round(
      (100 * tasks.filter((t) => history[t.id]?.firstAttemptCorrect).length) /
        tasks.length,
    ),
    answers: history,
    revised: tasks.some((t) => history[t.id]?.attemptCount > 1),
  };
}

export function chapterSixLearning(ledger, results, config) {
  const sum = (entry) =>
    Object.values(entry?.evidenceScores || {}).reduce((a, b) => a + b, 0);
  const groups = Object.entries(config.choiceGroupMaxima);
  const max = groups.reduce((n, [, value]) => n + value, 0);
  const choicePercent =
    (100 * groups.reduce((n, [id]) => n + sum(ledger[id]), 0)) / max;
  const firstPercent =
    (100 *
      groups.reduce(
        (n, [id]) =>
          n + sum({ evidenceScores: ledger[id]?.firstEvidenceScores }),
        0,
      )) /
    max;
  const miniGames = chapterMiniGameSummary(results, config);
  const { miniPercent } = miniGames;
  return {
    ...miniGames,
    choicePercent,
    firstPercent,
    miniPercent,
    reflectionPercent: null,
    learningScore:
      choicePercent * config.weights.choices +
      miniPercent * config.weights.miniGame,
  };
}
