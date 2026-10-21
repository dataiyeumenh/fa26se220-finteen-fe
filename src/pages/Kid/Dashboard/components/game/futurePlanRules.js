// Classroom scenarios, not forecasts. One independent draw per asset and per playthrough.
export const FUTURE_ART = "/images/finteen-v2/chapter-08";
export const legacyMarketScenario = {
  period: "sau ba tháng",
  cash: 0,
  bonds: 2,
  equity: -10,
};
export function drawMarketScenario(random = Math.random) {
  const draw = () =>
    Math.max(-10, Math.min(10, Math.floor(random() * 21) - 10));
  return { period: "sau ba tháng", cash: 0, bonds: draw(), equity: draw() };
}
export function validMarket(market) {
  return Boolean(
    market &&
    market.cash === 0 &&
    ["bonds", "equity"].every(
      (id) => Number.isInteger(market[id]) && Math.abs(market[id]) <= 10,
    ),
  );
}
export const annualGoal = {
  amount: 7200000,
  label: "Quỹ học tập cho năm sau",
  description:
    "Dành cho sách, dụng cụ và các lớp học trong năm sau. Khoản này khác với 3.000.000đ học phí đã tính ở đầu chương.",
};
export const allocationAssets = [
  {
    id: "cash",
    label: "Tiền dễ rút",
    image: "liquid-money",
    description: "Để dùng khi cần. Trong lượt thử này, giá trị giữ nguyên.",
  },
  {
    id: "bonds",
    label: "Trái phiếu",
    image: "bond",
    description:
      "Cho công ty hoặc Chính phủ vay tiền. Có cam kết trả lãi, nhưng vẫn có rủi ro không được trả đủ.",
  },
  {
    id: "equity",
    label: "Cổ phiếu",
    image: "equity",
    description: "Sở hữu một phần công ty. Giá có thể tăng hoặc giảm.",
  },
];
export const sampleAllocations = {
  balanced: { cash: 30, bonds: 40, equity: 30 },
  concentrated: { cash: 10, bonds: 0, equity: 90 },
};
export function allocationValue(allocation, market = legacyMarketScenario) {
  const total = allocationAssets.reduce(
    (sum, asset) => sum + allocation[asset.id],
    0,
  );
  const delta = allocationAssets.reduce(
    (sum, asset) =>
      sum + (allocation[asset.id] * 100000 * market[asset.id]) / 100,
    0,
  );
  return {
    total,
    delta,
    final: 10000000 + delta,
    nearMoney: allocation.cash * 100000,
  };
}
export const claimChecks = [
  {
    id: "risk",
    label: "Điều kiện bán, rút tiền và các rủi ro",
    detail:
      "Những thông tin này giúp biết lúc nào lấy tiền ra được và vì sao có thể bị lỗ.",
    correct: true,
  },
  {
    id: "ranking",
    label: "Danh sách những người đang dẫn đầu",
    detail:
      "Kết quả của người khác không cho biết khoản đầu tư có phù hợp với An hay không.",
    correct: false,
  },
  {
    id: "commission",
    label: "Khoản hoa hồng người giới thiệu được nhận",
    detail:
      "Người nhận tiền khi An tham gia có thể chỉ nhấn mạnh mặt hấp dẫn của sản phẩm.",
    correct: true,
  },
  {
    id: "likes",
    label: "Lượt thích và chia sẻ của bài quảng cáo",
    detail:
      "Được chú ý nhiều chưa chứng minh lời hứa về lợi nhuận hay tác động môi trường.",
    correct: false,
  },
  {
    id: "esg",
    label: "Báo cáo về hoạt động bảo vệ môi trường",
    detail:
      "Cần xem số liệu, cách đo và ai kiểm tra báo cáo; hình chiếc lá không thay cho bằng chứng.",
    correct: true,
  },
  {
    id: "recent",
    label: "Biểu đồ giá tăng trong tuần vừa rồi",
    detail:
      "Giá đã tăng không bảo đảm sẽ tiếp tục tăng, cũng không giải thích lời quảng cáo “xanh”.",
    correct: false,
  },
];
export const planMonths = [
  {
    id: "normal",
    label: "Tháng bình thường",
    income: 3000000,
    essential: 2000000,
    description:
      "An muốn để dành 600.000đ, phần còn lại dùng cho đi chơi và mua sắm.",
  },
  {
    id: "low",
    label: "Tháng ít việc",
    income: 2600000,
    essential: 2000000,
    description:
      "Thu nhập giảm. An vẫn muốn giữ mức để dành 600.000đ nếu có thể.",
  },
  {
    id: "prices",
    label: "Ít việc, giá lại tăng",
    income: 2600000,
    essential: 2200000,
    description:
      "Chi phí thiết yếu tăng 200.000đ. Chưa có nguồn thu thêm nào được xác nhận.",
  },
];
// Three situations represent ten ordinary months and two more difficult months in a sample year.
export function planProjection(budgets) {
  const yearSavings = budgets[0].goal * 10 + budgets[1].goal + budgets[2].goal;
  const shortfall = Math.max(0, annualGoal.amount - yearSavings);
  const feasible =
    planMonths.every((month, index) => feasibleBudget(month, budgets[index])) &&
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
export function budgetFeedback(month, budget) {
  const cash = (value) => `${value.toLocaleString("vi-VN")}đ`;
  const balance = planBalance(month, budget);
  return [
    `Sau chi bắt buộc, bạn có ${cash(availableBudget(month))}. Bạn dành ${cash(budget.goal)} cho quỹ học tập và ${cash(budget.flexible)} cho đi chơi, mua sắm.`,
    `${cash(budget.goal)} + ${cash(budget.flexible)} = ${cash(budget.goal + budget.flexible)}. ${balance < 0 ? `Vượt ngân sách ${cash(-balance)}.` : balance === 0 ? "Hai khoản vừa đủ ngân sách, không bị thiếu tiền." : `Còn ${cash(balance)} giữ dự phòng.`}`,
    budget.goal === 0
      ? "Bạn chưa dành tiền cho quỹ học tập trong tình huống này, nên chưa đạt yêu cầu vừa cân ngân sách vừa tích lũy cho mục tiêu. Khoản chưa chia vẫn là tiền dự phòng, chưa được tính vào quỹ học tập."
      : "Để đạt yêu cầu, hai khoản không vượt tiền đang có và có tiền đưa vào quỹ học tập. Không bắt buộc một mức để dành cụ thể; bảng cuối dùng mức bạn chọn để tính thời gian đạt mục tiêu.",
  ];
}
export function buildPlanReview(state) {
  if (!state?.budgets) return {};
  const cash = (value) => `${value.toLocaleString("vi-VN")}đ`;
  const projection = planProjection(state.budgets);
  return {
    cards: planMonths.map((month, index) => {
      const budget = state.budgets[index],
        balance = planBalance(month, budget);
      return {
        id: month.id,
        label: month.label,
        image: `${FUTURE_ART}/asset-mini-game/life-planner/${index === 0 ? "income-envelope" : "price-change"}.png`,
        facts: [
          [
            "Thu nhập / chi bắt buộc",
            `${cash(month.income)} / ${cash(month.essential)}`,
          ],
          ["Bạn dành cho học tập", cash(budget.goal)],
          ["Bạn dành cho đi chơi, mua sắm", cash(budget.flexible)],
          [
            balance < 0 ? "Chưa có tiền bù" : "Tiền giữ dự phòng",
            cash(Math.abs(balance)),
          ],
        ],
      };
    }),
    shared: {
      label: "Theo số tiền bạn vừa chọn",
      items: [
        `Mục tiêu học tập: ${cash(annualGoal.amount)}. Theo lịch thử, bạn dự kiến để dành ${cash(projection.yearSavings)} trong năm.`,
        !projection.feasible
          ? "Kế hoạch còn phần chưa thực hiện được. Cần cân lại khoản chi hoặc mức để dành trước khi dùng tổng dự kiến."
          : projection.shortfall
            ? `Còn thiếu ${cash(projection.shortfall)}. Nếu sau đó để dành ${cash(state.budgets[0].goal)}/tháng thì cần thêm khoảng ${projection.extraMonths} tháng.`
            : "Theo các giả định này, tiền dự kiến đủ mục tiêu trong 12 tháng. Hãy kiểm tra lại bằng thu chi thực tế mỗi tháng.",
      ],
    },
  };
}
export function chapterEightSettlement(results, flags) {
  const saved = results.CH08_GAME_PORTFOLIO?.ui?.market;
  // Existing submitted 1.1 checkpoints used the old fixed market and must keep their result.
  const market = validMarket(saved) ? saved : legacyMarketScenario;
  const allocation = flags.portfolio_fit
    ? sampleAllocations.balanced
    : sampleAllocations.concentrated;
  return {
    ...allocationValue(allocation, market),
    market,
    eventId: "CH08_MARKET_SETTLEMENT",
  };
}
export function resolveFutureScene(scene, results, flags) {
  const { market, delta, final } = chapterEightSettlement(results, flags);
  const cash = (value) => `${value.toLocaleString("vi-VN")}đ`;
  const movement = (value) =>
    value > 0
      ? `tăng ${value}%`
      : value < 0
        ? `giảm ${-value}%`
        : "giữ nguyên giá trị";
  const outcome =
    delta > 0
      ? `tăng ${cash(delta)}`
      : delta < 0
        ? `giảm ${cash(-delta)}`
        : "không đổi";
  const text = scene.marketSettlement
    ? `Sau khi bán hết theo tình huống vừa thử, em thu về ${cash(final)}. So với 10.000.000đ ban đầu, số tiền ${outcome}. Đây là kết quả của cách chia em đã chọn, dùng cùng tỷ lệ với lượt tập.`
    : {
        CH08_AFTER_PORTFOLIO_1: `Lượt này, trái phiếu ${movement(market.bonds)}, còn cổ phiếu ${movement(market.equity)}. Tớ muốn xem mỗi giỏ đã thay đổi bao nhiêu.`,
        CH08_MARKET_INTRO_1: `Lượt tiếp theo dùng lại đúng tình huống vừa thử: trái phiếu ${movement(market.bonds)}, cổ phiếu ${movement(market.equity)}. Chỉ cách chia tiền là theo phương án cậu vừa chọn.`,
        CH08_PROMISE_1:
          delta < 0
            ? "Nhìn ví giảm vẫn thấy khó chịu, dù biết đây là mô phỏng."
            : delta > 0
              ? "Thấy tiền tăng lên cũng vui thật. Tớ bắt đầu muốn thử tiếp để kiếm thêm."
              : "Tổng tiền cuối cùng không đổi. Nhưng nhìn từng giỏ thì vẫn phải để ý chuyện giá lên xuống.",
        CH08_PROMISE_2:
          delta < 0
            ? "Ứng dụng bên cạnh đang có thứ tăng mạnh kìa. Hay chuyển sang đó để gỡ lại nhanh?"
            : "Ứng dụng bên cạnh đang có thứ tăng mạnh hơn nữa kìa. Hay mình thử thêm một lượt?",
        CH08_PROMISE_3:
          delta < 0
            ? "Khoan đã. Hai em đang nghĩ đến mục tiêu, hay chỉ muốn lấy lại số tiền vừa giảm?"
            : "Khoan đã. Hai em đang nghĩ đến mục tiêu, hay đang bị con số tăng trên màn hình cuốn theo?",
        CH08_PROMISE_4:
          delta < 0
            ? "Dạ, em chỉ đang muốn lấy lại số tiền vừa giảm. Nhưng em còn chưa biết tài sản bên kia là gì."
            : "Dạ, em đang nghĩ nếu thử tiếp thì có thể kiếm thêm. Nhưng em chưa tìm hiểu tài sản bên kia là gì.",
        CH08_FOMO_1:
          delta < 0
            ? "Em chọn theo thứ đứng đầu bảng vì muốn thấy số tiền tăng lại. Lúc bấm thấy nhẹ nhõm hơn một chút."
            : "Em chọn theo thứ đứng đầu bảng vì nghĩ mình còn có thể kiếm thêm. Lúc bấm thấy hào hứng hơn, nhưng em vẫn chưa đọc đủ thông tin.",
      }[scene.id];
  return text ? { ...scene, title: text, text } : scene;
}
export const futureTasks = [
  "allocation_near",
  "allocation_spread",
  "claim_risk",
  "claim_commission",
  "claim_esg",
  "plan_normal",
  "plan_low",
  "plan_prices",
];
export function createFutureState(kind) {
  return {
    kind,
    market: kind === "portfolio" ? drawMarketScenario() : null,
    allocation: { cash: 0, bonds: 0, equity: 0 },
    allocationSubmitted: false,
    checks: [],
    checksSubmitted: false,
    month: 0,
    budgets: planMonths.map(() => ({ goal: 0, flexible: 0 })),
    submittedMonths: {},
    history: {},
  };
}
export function restoreFutureState(kind, saved) {
  if (!saved) return createFutureState(kind);
  return {
    ...saved,
    market:
      kind !== "portfolio"
        ? null
        : validMarket(saved.market)
          ? saved.market
          : saved.allocationSubmitted
            ? { ...legacyMarketScenario }
            : drawMarketScenario(),
    budgets: saved.budgets.map((budget, index) =>
      saved.submittedMonths[index]
        ? budget
        : clampBudget(planMonths[index], budget),
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
export function applyFutureAction(state, action) {
  if (state.kind === "portfolio") {
    if (state.allocationSubmitted) return state;
    if (
      action.type === "ALLOCATE" &&
      allocationAssets.some((asset) => asset.id === action.id) &&
      [-10, 10].includes(action.delta)
    ) {
      if (
        state.allocation[action.id] + action.delta < 0 ||
        allocationValue(state.allocation).total + action.delta > 100
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
      allocationValue(state.allocation).total === 100
    )
      return {
        ...state,
        allocationSubmitted: true,
        history: {
          allocation_near: record(state.allocation.cash >= 30),
          allocation_spread: record(
            state.allocation.bonds > 0 && state.allocation.equity > 0,
          ),
        },
      };
    return state;
  }
  if (
    state.kind === "claims" &&
    action.type === "CHECK" &&
    !state.checksSubmitted &&
    claimChecks.some((check) => check.id === action.id)
  ) {
    const checks = state.checks.includes(action.id)
      ? state.checks.filter((id) => id !== action.id)
      : state.checks.length < 3
        ? [...state.checks, action.id]
        : state.checks;
    return checks === state.checks ? state : { ...state, checks };
  }
  if (
    state.kind === "claims" &&
    action.type === "SUBMIT_CHECKS" &&
    !state.checksSubmitted &&
    state.checks.length === 3
  )
    return {
      ...state,
      checksSubmitted: true,
      history: {
        ...state.history,
        ...Object.fromEntries(
          claimChecks
            .filter((check) => check.correct)
            .map((check) => [
              `claim_${check.id}`,
              record(state.checks.includes(check.id)),
            ]),
        ),
      },
    };
  if (state.kind !== "planner") return state;
  if (
    action.type === "BUDGET" &&
    !state.submittedMonths[state.month] &&
    ["goal", "flexible"].includes(action.id) &&
    [-100000, 100000].includes(action.delta)
  ) {
    const value = state.budgets[state.month][action.id] + action.delta;
    const available = availableBudget(planMonths[state.month]);
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
        [`plan_${planMonths[state.month].id}`]: record(
          feasibleBudget(planMonths[state.month], state.budgets[state.month]) &&
            state.budgets[state.month].goal > 0,
        ),
      },
    };
  if (
    action.type === "NEXT_MONTH" &&
    state.submittedMonths[state.month] &&
    state.month < planMonths.length - 1
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
export function futureResult(state) {
  const prefix =
    state.kind === "portfolio"
      ? "allocation_"
      : state.kind === "claims"
        ? "claim_"
        : "plan_";
  const tasks = futureTasks.filter((id) => id.startsWith(prefix));
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
