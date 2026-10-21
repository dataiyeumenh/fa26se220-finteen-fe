export const loanOffers = [
  {
    id: "A",
    periods: 6,
    installment: 1120000,
    upfront: 0,
    principal: 6000000,
    received: 6000000,
    intervalMonths: 1,
  },
  {
    id: "B",
    periods: 12,
    installment: 550000,
    upfront: 0,
    principal: 6000000,
    received: 6000000,
    intervalMonths: 1,
  },
  {
    id: "C",
    periods: 16,
    installment: 500000,
    upfront: 0,
    principal: 6000000,
    received: 5400000,
    intervalMonths: 0.5,
  },
];
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
export const loanTasks = [
  { id: "receiptA", round: 0 },
  { id: "receiptB", round: 0 },
  { id: "receiptC", round: 0 },
  { id: "sortA", round: 1 },
  { id: "sortB", round: 1 },
  { id: "sortC", round: 1 },
  { id: "cartNeed", round: 2 },
  { id: "cartBudget", round: 2 },
  { id: "statementLiving", round: 3 },
  { id: "statementCost", round: 3 },
];
export const sortTargets = { A: "over", B: "fit", C: "shortfall" };
export const bnplItems = [
  {
    id: "headphones",
    label: "Tai nghe học online",
    image:
      "/images/finteen-v2/chapter-01/asset-mini-game/needs-or-wants/04-replacement-headphones.png",
    price: 600000,
    installment: 200000,
  },
  {
    id: "decoration",
    label: "Mèo trang trí bàn học",
    image:
      "/images/finteen-v2/chapter-01/asset-mini-game/needs-or-wants/06-desk-decoration.png",
    price: 450000,
    installment: 150000,
  },
  {
    id: "notebook",
    label: "Bộ sổ và bút",
    image: "/images/c1/mini-game/c1_item_student_book.png",
    price: 300000,
    installment: 100000,
  },
  {
    id: "artClass",
    label: "Lớp học vẽ",
    image:
      "/images/finteen-v2/chapter-01/asset-mini-game/needs-or-wants/03-art-class-booking.png",
    price: 750000,
    installment: 250000,
  },
];
export function cartForecast(ids) {
  const items = bnplItems.filter((item) => ids.includes(item.id));
  const monthly = items.reduce((sum, item) => sum + item.installment, 0);
  const months = [1, 2, 3].map((month) => ({
    month,
    available: 500000,
    other: month === 2 ? 200000 : 0,
    payment: monthly,
    remaining: 500000 - monthly - (month === 2 ? 200000 : 0),
  }));
  return {
    items,
    monthly,
    total: monthly * 3,
    months,
    meetsNeed:
      items.some((item) => item.id === "headphones") && items.length >= 2,
    affordable: months.every((month) => month.remaining >= 0),
  };
}
export const statementOptions = [
  { id: "minimum", label: "Chỉ trả mức tối thiểu", amount: 100000 },
  { id: "half", label: "Trả một nửa số nợ", amount: 500000 },
  { id: "threeQuarters", label: "Trả ba phần tư số nợ", amount: 750000 },
  { id: "partial", label: "Trả phần lớn số nợ", amount: 800000 },
  { id: "almostFull", label: "Trả gần hết số nợ", amount: 900000 },
  { id: "full", label: "Trả hết số đang nợ", amount: 1000000 },
];
export function statementOutcome(id) {
  const option = statementOptions.find((option) => option.id === id);
  if (!option) return null;
  const walletLeft = 1200000 - option.amount;
  const debtLeft = 1000000 - option.amount;
  // Explicit teaching rule, not a model of any actual credit-card contract.
  const interest = Math.round(debtLeft * 0.02);
  return {
    ...option,
    walletLeft,
    debtLeft,
    afterLiving: walletLeft - 400000,
    livingShortfall: Math.max(0, 400000 - walletLeft),
    interest,
    nextDebt: debtLeft + interest,
    livingCovered: walletLeft >= 400000,
    costCovered: interest <= 5000,
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
export function applyLoanAction(state, action) {
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
    state.round === 0 &&
    loanOffers.some((o) => o.id === action.id)
  ) {
    return { ...next, totals: { ...state.totals, [action.id]: action.value } };
  }
  if (action.type === "TOTAL" && state.round === 0) {
    if (
      !loanOffers.every(
        (o) =>
          String(state.totals[o.id] ?? "").trim() &&
          Number.isFinite(Number(state.totals[o.id])) &&
          Number(state.totals[o.id]) >= 0,
      )
    )
      return state;
    for (const offer of loanOffers)
      complete(
        `receipt${offer.id}`,
        Number(state.totals[offer.id]) === loanTotal(offer),
      );
    submit();
    next.feedback =
      "Đã nhận câu trả lời của bạn. Xem phép tính đúng ở từng gói rồi tiếp tục nhé.";
  } else if (
    action.type === "SELECT" &&
    state.round === 1 &&
    loanOffers.some((o) => o.id === action.id)
  ) {
    next.selected = action.id;
  } else if (
    action.type === "SORT" &&
    state.round === 1 &&
    sortTargets[action.id] &&
    Object.values(sortTargets).includes(action.target)
  ) {
    next.sorted = { ...state.sorted, [action.id]: action.target };
    next.selected = null;
    next.feedback = `Đã đặt gói vay ${action.id}. Bạn có thể chuyển thẻ trước khi kiểm tra.`;
  } else if (
    action.type === "UNSORT" &&
    state.round === 1 &&
    state.sorted[action.id]
  ) {
    next.sorted = { ...state.sorted };
    delete next.sorted[action.id];
    next.selected = action.id;
  } else if (action.type === "SUBMIT_SORT" && state.round === 1) {
    if (!loanOffers.every((o) => state.sorted[o.id])) return state;
    for (const offer of loanOffers)
      complete(
        `sort${offer.id}`,
        state.sorted[offer.id] === sortTargets[offer.id],
      );
    submit();
    next.feedback =
      "Đã kiểm tra. Vị trí bạn xếp được giữ nguyên; xem đáp án và lý do bên dưới.";
  } else if (
    action.type === "TOGGLE_ITEM" &&
    state.round === 2 &&
    bnplItems.some((item) => item.id === action.id)
  ) {
    next.basket = state.basket.includes(action.id)
      ? state.basket.filter((id) => id !== action.id)
      : [...state.basket, action.id];
  } else if (action.type === "BUY_CART" && state.round === 2) {
    if (!state.basket.length) return state;
    const forecast = cartForecast(state.basket);
    complete("cartNeed", forecast.meetsNeed);
    complete("cartBudget", forecast.affordable);
    submit();
    next.feedback =
      "Giỏ hàng đã được chốt trong bài thử. Xem cả ba tháng để biết các khoản trả góp cộng dồn thế nào.";
  } else if (
    action.type === "STATEMENT_CHOICE" &&
    state.round === 3 &&
    state.statementStep === 0 &&
    statementOutcome(action.id)
  ) {
    next.statementChoice = action.id;
  } else if (
    action.type === "CONFIRM_STATEMENT" &&
    state.round === 3 &&
    state.statementStep === 0 &&
    statementOutcome(state.statementChoice)
  ) {
    next.statementStep = 1;
    next.feedback =
      "Đã ghi nhận cách thanh toán. Bây giờ đến khoản sinh hoạt 400.000đ; lựa chọn vừa rồi được giữ nguyên.";
  } else if (
    action.type === "REVEAL_STATEMENT" &&
    state.round === 3 &&
    state.statementStep === 1
  ) {
    const outcome = statementOutcome(state.statementChoice);
    complete("statementLiving", outcome.livingCovered);
    complete("statementCost", outcome.costCovered);
    next.statementStep = 2;
    submit();
    next.feedback =
      "Đã kiểm tra hai mục tiêu: đủ tiền sinh hoạt và lãi kỳ sau không quá 5.000đ. Bạn tiếp tục với kết quả này.";
  } else return state;
  return next;
}
export function loanResult(history, rounds) {
  const tasks = loanTasks.filter(
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
  const games = config.requiredGameIds.map((id) =>
    Object.values(results).find((g) => g.gameId === id && g.completed),
  );
  const total = games.reduce((n, g) => n + (g?.total || 0), 0);
  const miniPercent = total
    ? (100 * games.reduce((n, g) => n + (g?.score || 0), 0)) / total
    : 0;
  return {
    choicePercent,
    firstPercent,
    miniPercent,
    reflectionPercent: null,
    learningScore:
      choicePercent * config.weights.choices +
      miniPercent * config.weights.miniGame,
    coreCalculationsCorrect: games.every((g) => g?.passed),
  };
}
