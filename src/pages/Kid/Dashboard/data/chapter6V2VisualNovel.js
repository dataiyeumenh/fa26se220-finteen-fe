import { loanApr } from "../components/game/loanDetectiveRules.js";

const BASE = "/images/finteen-v2/chapter-06";
const MINI = `${BASE}/asset-mini-game/loan-detective`;
// Mini-game "Thám tử khoản vay" (khung LOAN_DETECTIVE, dùng cho LOAN_OFFERS_CH06 + LOAN_REPAYMENT_CH06): mọi chữ / số /
// đáp án / ảnh nằm ở đây, component chỉ là khung (spec bộ khuôn 24/10, cách A). Chữ có "{x}" là mẫu, khung điền vào.
// Mảng rich: chuỗi = chữ thường, {b} = đậm, {strong} = nhấn, {br} = xuống dòng.
const loanOffers = [
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
const loanDetectiveConfig = {
  eyebrow: "CÙNG AN THỬ MỘT KẾ HOẠCH",
  heading: "Thám tử khoản vay",
  subheading: "Biết tổng chi · tính cả những lần trả sau",
  rounds: [
    {
      view: "totals",
      title: "Tính tổng trả",
      picture: `${MINI}/loan-offers-inspection.png`,
      instruction:
        "Nhập tổng tiền phải trả của cả ba gói rồi nộp một lần. Sau khi chấm, bạn sẽ thấy phép tính đúng và được tiếp tục dù có câu sai.",
      idleFeedback:
        "Chỉ kiểm tra sau khi bạn xác nhận. Không có lượt nộp lại.",
    },
    {
      view: "sort",
      title: "Xếp gói vay",
      picture: `${MINI}/laptop-goal.png`,
      instruction:
        "Đặt cả ba thẻ vào khay theo nhận định của bạn. Có thể chuyển thẻ trước khi bấm kiểm tra; hệ thống chỉ chấm sau khi bạn nộp.",
      idleFeedback: "Chưa chấm bài. Bạn được tự do xếp và chuyển thẻ.",
    },
    {
      view: "cart",
      neutral: true,
      title: "Giỏ hàng trả sau",
      picture: `${MINI}/repayment-calendar.png`,
      instruction:
        "Chọn tai nghe để học online và thêm ít nhất một món bạn muốn mua. Hãy cân đối giỏ hàng để ba tháng tới không thiếu tiền, rồi chốt giỏ một lần.",
      idleFeedback:
        "Chỉ kiểm tra sau khi bạn xác nhận. Không có lượt nộp lại.",
    },
    {
      view: "statement",
      neutral: true,
      title: "Trả nợ thẻ",
      picture: `${MINI}/card-and-statement.png`,
      instruction:
        "Chọn số tiền trả nợ hôm nay. Sau đó xem bạn còn đủ tiền sinh hoạt không và tháng sau còn phải trả bao nhiêu.",
      idleFeedback:
        "Chỉ kiểm tra sau khi bạn xác nhận. Không có lượt nộp lại.",
    },
  ],
  tasks: [
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
  ],
  offers: loanOffers,
  offerImage: `${MINI}/loan-offers-inspection.png`,
  intervalLabels: { 0.5: "nửa tháng", 1: "tháng" },
  totals: {
    inputLabel: "Bạn tính tổng phải trả",
    placeholder: "Nhập số đồng",
    explanation: "{periods} lần × {installment} =",
    notes: { C: "Mỗi tháng trả hai lần: 8 tháng là 16 lần trả." },
    review: "Xem lại thông tin ba gói vay",
    helpTitle: "Gợi ý cách tính",
    help: "Tổng tiền phải trả = số lần trả × số tiền mỗi lần. Nhớ phân biệt số tháng với số lần thanh toán.",
    submit: "Nộp kết quả ba gói",
    comparison:
      "Gói B có tổng trả thấp nhất. Tổng tiền chưa đủ để quyết định: màn sau còn xét tiền thực nhận và khả năng trả mỗi tháng.",
  },
  sort: {
    targets: { A: "over", B: "fit", C: "shortfall" },
    trays: [
      {
        id: "shortfall",
        label: "Chưa đủ tiền mua máy",
        help: "Tiền thực nhận dưới 6.000.000đ",
      },
      {
        id: "over",
        label: "Khoản trả vượt ngân sách",
        help: "Cần trả hơn 1.000.000đ mỗi tháng",
      },
      {
        id: "fit",
        label: "Đủ tiền mua, trả vừa ngân sách",
        help: "Nhận đủ 6.000.000đ; trả không quá 1.000.000đ/tháng",
      },
    ],
    reasons: {
      A: "Nhận đủ tiền mua máy nhưng cần trả 1.120.000đ/tháng, cao hơn ngân sách 120.000đ.",
      B: "Nhận đủ 6.000.000đ và trả 550.000đ/tháng, còn 450.000đ trong ngân sách tháng.",
      C: "Chỉ nhận 5.400.000đ, còn thiếu 600.000đ mua máy. Mỗi tháng có hai lần trả 500.000đ.",
    },
    budgetNote: [
      "Laptop giá ",
      { b: "6.000.000đ" },
      ". An đang có ",
      { b: "0đ" },
      " và có thể dành ",
      { b: "1.000.000đ/tháng" },
      " sau sinh hoạt.",
    ],
    placedCount: "Đã đặt {placed}/{total} thẻ",
    lockedStatus: "Các thẻ đã được khóa theo bài nộp.",
    holdingStatus: "Đang cầm gói {id} — chọn khay để đặt.",
    idleStatus: "Thẻ đã đặt sẽ nằm ngay trong khay, không còn ở hàng trên.",
    allPlaced:
      "Đã xếp hết. Chạm thẻ trong khay để chuyển nếu bạn muốn đổi ý, hoặc nộp bài bên dưới.",
    removeCard: "Lấy thẻ ra",
    placeHere: "Đặt gói {id} vào khay này",
    placeMore: "Chọn thẻ khác để đặt thêm",
    emptyTray: "Khay trống · chọn thẻ để đặt",
    submit: "Kiểm tra cách xếp của tôi",
    answersTitle: "Đối chiếu đáp án",
    yourTray: "Bạn xếp: {tray}.",
    correctTray: "Khay đúng: {tray}.",
  },
  card: {
    perPeriod: "{installment}/{interval}",
    received: "Thực nhận: {amount}",
    total: "Tổng trả: {amount}",
    schedule: "{periods} lần trả · {months} tháng",
    apr: "APR ≈ {apr}%/năm",
    holding: "Đang cầm thẻ · chọn một khay",
    placed: "Đã đặt · chạm để chuyển khay",
    idle: "Chạm hoặc kéo để xếp",
  },
  cart: {
    months: 3,
    available: 500000,
    otherDue: { 2: 200000 },
    requiredItemId: "headphones",
    minItems: 2,
    budgetNote: [
      { b: "Bài thử riêng: mua sắm để học online." },
      { br: true },
      "Mỗi tháng có 500.000đ sau sinh hoạt. Riêng tháng 2 đã có khoản khác đến hạn 200.000đ. Các món dưới đây đều trả ba lần, mỗi tháng một lần, 0% lãi và không có phí trong bài thử.",
    ],
    items: [
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
    ],
    price: "Giá {price}",
    installment: "{installment}/tháng × 3",
    remove: "Bỏ khỏi giỏ",
    add: "Thêm vào giỏ",
    basketTitle: "Giỏ của bạn · {count} món",
    basketJoin: " + ",
    basketEmpty: "Chưa có món nào.",
    monthlyLabel: "Mỗi tháng cần trả: ",
    submit: "Chốt giỏ và xem lịch trả",
    submitted: "Đã chốt giỏ hàng",
    month: "Tháng {month}",
    have: "Có: {amount}",
    payment: "Giỏ trả sau: − {amount}",
    other: "Khoản khác: − {amount}",
    remaining: "Còn",
    short: "Thiếu",
    needOk: "✓ Đúng: có tai nghe và ít nhất một món thêm như mục tiêu.",
    needBad:
      "× Chưa đúng mục tiêu: giỏ cần có tai nghe và ít nhất một món thêm.",
    budgetOk: "✓ Đúng: không tháng nào vượt số tiền có thể dùng.",
    budgetBad:
      "× Chưa đúng ngân sách: lịch trả có tháng thiếu tiền. Nhiều món 0% lãi vẫn cộng thành khoản phải trả lớn.",
    example:
      "Ví dụ đáp ứng cả hai mục tiêu: tai nghe + bộ sổ và bút, trả 300.000đ/tháng. Tháng 2 cộng khoản khác 200.000đ là vừa đủ 500.000đ.",
  },
  statement: {
    wallet: 1200000,
    debt: 1000000,
    living: 400000,
    interestRate: 0.02,
    maxInterest: 5000,
    options: [
      { id: "minimum", label: "Chỉ trả mức tối thiểu", amount: 100000 },
      { id: "half", label: "Trả một nửa số nợ", amount: 500000 },
      { id: "threeQuarters", label: "Trả ba phần tư số nợ", amount: 750000 },
      { id: "partial", label: "Trả phần lớn số nợ", amount: 800000 },
      { id: "almostFull", label: "Trả gần hết số nợ", amount: 900000 },
      { id: "full", label: "Trả hết số đang nợ", amount: 1000000 },
    ],
    question: "Bạn sẽ dùng bao nhiêu tiền trong ví để trả nợ thẻ?",
    facts: [
      { label: "Tiền trong ví", value: "1.200.000đ" },
      { label: "Tổng tiền đang nợ", value: "1.000.000đ" },
      { label: "Sinh hoạt sắp tới cần", value: "400.000đ" },
      { label: "Mức trả tối thiểu kỳ này", value: "100.000đ" },
    ],
    goalsTitle: "Cần đạt cả hai mục tiêu:",
    goals: [
      ["Trả nợ xong vẫn giữ đủ ", { b: "400.000đ" }, " sinh hoạt."],
      ["Tiền lãi tháng sau ", { b: "không quá 5.000đ" }, "."],
    ],
    ruleTitle: "Cách tính trong bài thử",
    rule: [
      "Phần nợ chưa trả sẽ thêm ",
      { b: "2% tiền lãi" },
      " vào tháng sau. Ví dụ: còn nợ 100.000đ thì thêm 2.000đ lãi.",
    ],
    ruleNote:
      "Chỉ là quy tắc giả lập; không tính chi tiêu mới hay phí khác, không đại diện cho thẻ ngân hàng cụ thể.",
    optionIcon: "✉",
    confirm: "Chốt cách trả và xem kết quả",
    todayTitle: "Hôm nay · trích tiền trả nợ",
    walletStart: "Ví ban đầu",
    walletStartValue: "1.200.000đ",
    pay: "Trả nợ",
    payValue: "− {amount}",
    walletLeft: "Ví còn",
    livingTitle: "Tiếp theo · chi sinh hoạt",
    livingNeed: "Cần 400.000đ.",
    livingOk: "Ví còn đủ để chi, sau đó còn {amount}.",
    livingShort: "Ví chỉ có {wallet}, còn thiếu {shortfall}.",
    reveal: "Xem khoản nợ tháng sau",
    debtTitle: "Tháng sau · cộng lãi vào nợ còn lại",
    debtLeft: "Nợ chưa trả",
    interest: "Thêm lãi 2%",
    interestValue: "+ {amount}",
    nextDebt: "Tổng còn phải trả",
    noteOk: "Tiền còn trong ví là {amount}; chưa dùng để trả khoản nợ này.",
    noteShort: "Khoản sinh hoạt thiếu {amount} vẫn chưa được giải quyết.",
    livingResultOk: "✓ Đúng: giữ đủ tiền sinh hoạt.",
    livingResultBad: "× Chưa đúng: còn thiếu tiền sinh hoạt.",
    costResultOk: "✓ Đúng: lãi {amount}, không vượt 5.000đ.",
    costResultBad: "× Chưa đúng: lãi {amount}, vượt mục tiêu 5.000đ.",
    summary:
      "Trả 750.000đ hoặc 800.000đ đều đáp ứng hai mục tiêu: giữ đủ tiền sinh hoạt và lãi không quá 5.000đ. Trả tối thiểu không làm hết nợ; trả hết ngay cũng cần xem còn đủ tiền sống không.",
  },
  texts: {
    stepsLabel: "Các màn chơi",
    roundTitle: "Màn {n} · {title}",
    submitted: "Đã nộp đáp án",
    notSubmitted: "Chưa nộp đáp án",
    howto: "Cách chơi",
    offerName: "Gói vay {id}",
    correct: "✓ Đúng",
    incorrect: "× Chưa đúng",
    footerDone: "Đã xem kết quả · có thể tiếp tục",
    footerIdle: "Không đếm giờ · nộp một lần",
    finish: "Trở lại câu chuyện",
    next: "Sang màn tiếp theo →",
    note: "Tiền trong bài thử là giả lập, không thay đổi số dư hiện tại của An.",
    feedback: {
      totals:
        "Đã nhận câu trả lời của bạn. Xem phép tính đúng ở từng gói rồi tiếp tục nhé.",
      sorted:
        "Đã đặt gói vay {id}. Bạn có thể chuyển thẻ trước khi kiểm tra.",
      sortChecked:
        "Đã kiểm tra. Vị trí bạn xếp được giữ nguyên; xem đáp án và lý do bên dưới.",
      cart: "Giỏ hàng đã được chốt trong bài thử. Xem cả ba tháng để biết các khoản trả góp cộng dồn thế nào.",
      statementConfirmed:
        "Đã ghi nhận cách thanh toán. Bây giờ đến khoản sinh hoạt 400.000đ; lựa chọn vừa rồi được giữ nguyên.",
      statementRevealed:
        "Đã kiểm tra hai mục tiêu: đủ tiền sinh hoạt và lãi kỳ sau không quá 5.000đ. Bạn tiếp tục với kết quả này.",
    },
  },
};
const backgrounds = [
  "bg10-design-lab",
  "bg10b-offer-comparison-board",
  "bg10c-statement-workstation",
  "bg10d-final-planning-table",
];
const people = {
  AN: ["an", "An"],
  MINH: ["minh", "Minh"],
  CO_LINH: ["co-linh", "Cô Linh"],
};
const sprite = (who, expression) =>
  `${BASE}/char/${people[who][0]}/${people[who][0]}-${expression}.png`;
const knowledge = [
  "D06.01",
  "D06.02",
  "D06.03",
  "D06.04",
  "D06.05",
  "D06.06",
  "D06.07",
  "D06.08",
  "D08.01",
  "D08.02",
  "D08.03",
  "D08.06",
];
const scene = (id, n, type, extra) => ({
  id,
  type,
  background: `${BASE}/bg/${backgrounds[n - 1]}.png`,
  characters: [],
  knowledgeUnits: knowledge,
  ...extra,
});
const lines = (prefix, n, script, next, firstFlags = null) =>
  script.map(([who, expression, text], i) =>
    scene(`${prefix}_${i + 1}`, n, "dialogue", {
      title: text,
      text,
      speaker: people[who][1],
      speakerId: who,
      characters: [
        {
          id: who,
          expression,
          src: sprite(who, expression),
          position: "center",
        },
      ],
      nextSceneId: i < script.length - 1 ? `${prefix}_${i + 2}` : next,
      ...(i === 0 && firstFlags ? { setFlags: firstFlags } : {}),
    }),
  );
const art = (n, image, nextSceneId) =>
  scene(`CH06_SC0${n}_ART`, n, "scene", {
    title: [
      "Chiếc máy mình cần",
      "Đọc phía sau con số",
      "Ngày đến hạn",
      "Kế hoạch của mình",
    ][n - 1],
    background: `${BASE}/scene/${image}.png`,
    sceneArt: `${BASE}/scene/${image}.png`,
    nextSceneId,
  });
const choice = (id, n, title, options, extra = {}) =>
  scene(id, n, "choice", {
    title,
    text: title,
    prompt: title,
    options,
    ...extra,
  });
const route = (id, label, nextSceneId) => ({
  id,
  label,
  nextSceneId,
  deferLedger: true,
});
const evidence = (I = 2, C = 2, P = 2) => ({ I, C, P });
const plan = (fit, conditional = false, unverified = false) => ({
  credit_plan_fit: fit,
  credit_plan_conditional: conditional,
  credit_unverified: unverified,
  borrowConfirmed: false,
});
const repayment = (understood) => ({
  repayment_understood: understood,
  minimum_trap: !understood,
});
const card = (id, label, text, image) => ({ id, label, text, image });
const budgetCards = [
  card(
    "goal",
    "Mục tiêu",
    "Laptop: 6.000.000đ. Có thể dùng máy trường trong 6 tháng.",
    `${MINI}/laptop-goal.png`,
  ),
  card(
    "budget",
    "Ngân sách tháng",
    "Thu dự kiến 3.000.000đ − thiết yếu 2.000.000đ = tối đa 1.000.000đ để dành/trả nợ.",
    `${MINI}/repayment-calendar.png`,
  ),
  card(
    "today",
    "Tiền hôm nay",
    "Hiện có 0đ. Khoản trả hằng tháng phải dựa vào thu nhập thực tế.",
    `${BASE}/props/terms-and-fees.png`,
  ),
];
const offerCards = loanOffers.map((o) => ({
  ...card(o.id, `Gói vay ${o.id}`, "", `${MINI}/loan-offers-inspection.png`),
  facts: [
    ["Số tiền trên hợp đồng", "6.000.000đ"],
    ["Số tiền thực nhận", o.id === "C" ? "5.400.000đ" : "6.000.000đ"],
    [
      "Lịch trả",
      o.id === "C"
        ? "500.000đ / ½ kỳ"
        : `${o.installment.toLocaleString("vi-VN")}đ/kỳ`,
    ],
    ["Kỳ hạn", o.id === "C" ? "16 lần trả · 8 kỳ" : `${o.periods} kỳ`],
    ["APR", `≈ ${loanApr(o).toFixed(1).replace(".", ",")}%/năm`],
  ],
}));
const sharedOffers = {
  label: "Chung cho các gói vay",
  items: ["Mục tiêu vay: 6.000.000đ", "Mỗi kỳ tương đương với 1 tháng."],
};
const inspect = (
  id,
  n,
  title,
  cards,
  nextSceneId,
  shared = null,
  cashflows = null,
) =>
  scene(id, n, "dialogue", {
    title,
    text: title,
    speaker: "An",
    characters: [
      {
        id: "AN",
        expression: "thinking",
        src: sprite("AN", "thinking"),
        position: "center",
      },
    ],
    requiredInspections: [id.toLowerCase()],
    nextSceneId,
    inspect: {
      id: id.toLowerCase(),
      buttonText: title,
      cards,
      shared,
      cashflows,
      autoNextSceneOnClose: true,
    },
  });
const game = (id, n, gameId, rounds, nextSceneId) =>
  scene(id, n, "minigame", {
    title: "Thám tử khoản vay",
    game: {
      id: gameId,
      kind: "LOAN_DETECTIVE",
      title: "Thám tử khoản vay",
      rounds,
      config: loanDetectiveConfig,
      reference: rounds.includes(0)
        ? {
            buttonText: "So ba gói vay",
            cards: offerCards,
            shared: sharedOffers,
          }
        : null,
    },
    nextSceneId,
  });

export const chapter6V2GameData = {
  id: "CH06_V2",
  version: "4.1",
  title: "Mượn tiền có dễ không?",
  initialMoney: 0,
  initialStats: { SAVING: 50, HAPPINESS: 50, RISK: 30, GOAL: 50 },
  metadata: {
    chapterId: "CH06",
    age: 18,
    projectionOnly: true,
    persistProgress: true,
    preserveFirstChoiceStats: true,
    lockDecisions: true,
    goalDescription:
      "Lập kế hoạch laptop khả thi, hiểu tổng chi phí, mua trước trả sau và khoản còn phải trả.",
    coreKnowledgeUnits: ["D06.02", "D06.03", "D06.06", "D06.08"],
    allKnowledgeUnits: knowledge,
  },
  scenes: [
    art(1, "sc01-school-computer-or-laptop", "CH06_OPEN_1"),
    ...lines(
      "CH06_OPEN",
      1,
      [
        [
          "AN",
          "thinking",
          "Thêm một nét nữa thôi… Ơ, phòng máy sắp đóng cửa rồi à?",
        ],
        [
          "MINH",
          "inviting",
          "Cậu vẫn đang chỉnh bài poster đó hả? Tớ tưởng cậu xong từ chiều.",
        ],
        [
          "AN",
          "neutral",
          "Tớ thử lại màu nền. Ban ngày nhìn ổn mà giờ xem lại cứ thấy chữ bị chìm.",
        ],
        [
          "MINH",
          "neutral",
          "Mang về làm tiếp đi. À quên, máy ở nhà cậu không chạy nổi phần mềm này.",
        ],
        [
          "AN",
          "thinking",
          "Ừ. Cứ đến đoạn đang có ý tưởng thì phải lưu lại rồi chờ buổi sau. Có máy riêng chắc đỡ hơn nhiều.",
        ],
        [
          "MINH",
          "inviting",
          "Đúng lúc tớ thấy laptop sáu triệu này. Có trả góp, không phải đợi dành đủ tiền.",
        ],
        [
          "AN",
          "neutral",
          "Sáu triệu thì hiện tại tớ chưa có. Hôm nay ví của tớ còn đúng không đồng.",
        ],
        [
          "MINH",
          "neutral",
          "Nhưng người ta ghi chỉ năm trăm nghìn mỗi nửa kỳ. Nhìn số tiền mỗi lần thì khá nhẹ.",
        ],
        [
          "AN",
          "thinking",
          "Một kỳ là một tháng, vậy nửa kỳ là nửa tháng à? Và phải trả bao nhiêu lần?",
        ],
        [
          "MINH",
          "neutral",
          "Tớ mới đọc dòng to nhất thôi. Để mở lịch trả đầy đủ xem nhé.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Hai em chưa về à? Nếu cần, nhớ lưu bài vào thư mục của mình trước khi tắt máy nhé.",
        ],
        [
          "AN",
          "neutral",
          "Dạ. Em đang nghĩ có nên mua laptop riêng không. Làm được ở nhà thì tiện hơn.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Em đang cần phương tiện để làm bài, hay cần có máy riêng ngay hôm nay? Hai việc đó có thể có cách giải quyết khác nhau.",
        ],
        [
          "AN",
          "thinking",
          "Em cần làm bài đều. Còn máy riêng ngay thì… em muốn, nhưng có lẽ chưa phải cách duy nhất.",
        ],
        [
          "MINH",
          "neutral",
          "Máy trường vẫn dùng được mà, chỉ là phải sắp lịch. Có máy riêng thì chủ động hơn.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Trường còn hỗ trợ máy chung trong sáu tháng. Các em có thể cân nhắc cả thời gian, sự tiện lợi và tiền phải dành ra.",
        ],
        [
          "AN",
          "thinking",
          "Vậy trước khi nhìn quảng cáo, mình xem lại những gì mình thực sự có nhé.",
        ],
      ],
      "CH06_NEED",
    ),
    inspect("CH06_NEED", 1, "Kế hoạch laptop", budgetCards, "CH06_PRIORITY", {
      label: "Tình huống",
      items: [
        "An 18 tuổi, học nghề thiết kế. Thu nhập và tích lũy tương lai là dự kiến, chưa phải tiền hiện có.",
      ],
    }),
    choice("CH06_PRIORITY", 1, "Điều gì khiến An phân vân nhất?", [
      route(
        "CH06_WANT_HOME",
        "Muốn có máy ở nhà để làm bài bất cứ lúc nào.",
        "CH06_HOME_1",
      ),
      route(
        "CH06_WANT_WAIT",
        "Lo có tháng không kiếm đủ tiền để trả góp.",
        "CH06_WAIT_1",
      ),
    ]),
    ...lines(
      "CH06_HOME",
      1,
      [
        [
          "AN",
          "neutral",
          "Tớ thích được mở máy ngay khi có ý tưởng, không phải chờ tới buổi học.",
        ],
        ["MINH", "inviting", "Chuẩn. Tối cả nhóm sửa bài online cũng dễ hơn."],
        [
          "AN",
          "thinking",
          "Nhưng tiện hơn thì phải trả bằng tiền của những tháng sau. Tớ muốn biết mức đánh đổi đó trước.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Mong muốn đó có lý do. Giờ mình kiểm tra xem kế hoạch nào thực hiện được nhé.",
        ],
      ],
      "CH06_SC02_ART",
    ),
    ...lines(
      "CH06_WAIT",
      1,
      [
        [
          "AN",
          "thinking",
          "Ba triệu mỗi tháng mới là dự kiến. Tớ chưa muốn hứa trả như thể tháng nào cũng chắc chắn nhận đủ.",
        ],
        [
          "MINH",
          "neutral",
          "Đổi lại là phải chịu đi phòng máy thêm một thời gian.",
        ],
        [
          "AN",
          "neutral",
          "Ừ, tớ không thấy chuyện đó thoải mái hơn. Nhưng mình có thể xếp lịch được.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Chờ cũng có cái giá về thời gian. Mình đặt hai bên cạnh nhau để chọn có căn cứ.",
        ],
      ],
      "CH06_SC02_ART",
    ),
    art(2, "sc02-comparing-loan-offers", "CH06_COMPARE_1"),
    ...lines(
      "CH06_COMPARE",
      2,
      [
        [
          "MINH",
          "neutral",
          "Đây là ba gói vay mua laptop, mình gọi là gói vay A, gói vay B và gói vay C để dễ so sánh. Gói vay A trả sáu kỳ, gói vay B trả mười hai kỳ.",
        ],
        [
          "AN",
          "thinking",
          "Tớ cũng muốn trả xong sớm. Nhưng mỗi tháng trả nhiều quá thì tiền ăn với đi lại lấy đâu ra?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Mình xem hai việc nhé: trả hết thì tổng cộng bao nhiêu tiền, và mỗi lần đến hạn em có đủ tiền trả không?",
        ],
        ["MINH", "neutral", "Vậy tổng rẻ hơn vẫn có thể khó trả hơn?"],
        [
          "CO_LINH",
          "neutral",
          "Có thể. Cũng cần xem số tiền thực nhận có bằng số tiền trên hợp đồng hay không.",
        ],
        [
          "AN",
          "thinking",
          "Nếu bị khấu trừ khi nhận tiền thì có thể chưa đủ mua máy, dù hợp đồng vẫn ghi sáu triệu.",
        ],
        [
          "MINH",
          "neutral",
          "Gói vay C ghi năm trăm nghìn mỗi nửa kỳ. Mình phải đọc cả số lần trả mới so được.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Chỗ nào chưa rõ thì ghi lại để hỏi bên cho vay. Mình đừng vội cho rằng điều kiện sẽ giống như mình mong muốn.",
        ],
      ],
      "CH06_OFFERS",
    ),
    inspect(
      "CH06_OFFERS",
      2,
      "So ba gói vay",
      offerCards,
      "CH06_TERMS_1",
      sharedOffers,
    ),
    ...lines(
      "CH06_TERMS",
      2,
      [
        [
          "MINH",
          "neutral",
          "Em thấy chữ APR trong hồ sơ gói vay. Đó có phải tiền mình trả mỗi tháng không cô?",
        ],
        [
          "CO_LINH",
          "explaining",
          "APR là Annual Percentage Rate, hiểu là tỷ lệ chi phí vay theo năm theo cách tính và phí được công bố. Nó giúp đối chiếu chi phí vay, chứ không phải số tiền trả mỗi tháng.",
        ],
        [
          "AN",
          "thinking",
          "Gói vay A khoảng 40,0%/năm, gói vay B khoảng 18,0%/năm trong ví dụ. Chỉ nhìn thời hạn thì chưa biết tổng phải trả đúng không cô?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đây là hai đề nghị có mức chi phí khác nhau, không phải cùng một gói chỉ đổi thời hạn. Gói vay A có chi phí theo năm cao hơn. Mình cần tự tính tiền trả trong sáu tháng và mười hai tháng để đối chiếu.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Nếu cùng số tiền vay, cùng lãi suất và cách tính phí, kéo dài thời gian thường làm tổng lãi tăng. Không thể chỉ nhìn kỳ hạn để kết luận đề nghị nào rẻ hơn.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ từng nghĩ được duyệt dễ nghĩa là khoản vay hợp với mình.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Bên cho vay có cách xét duyệt của họ. Còn em vẫn cần tự tính: sau khi trả góp, mình có đủ tiền ăn, đi lại và những việc khác không?",
        ],
        [
          "AN",
          "thinking",
          "Họ đồng ý cho vay và mình đủ khả năng trả đều là hai chuyện cần xem riêng.",
        ],
        [
          "MINH",
          "neutral",
          "Gói vay C có dòng “quyết định nhanh”. Tớ thấy hơi bị thúc. Có kết luận được là lừa đảo chưa cô?",
        ],
        [
          "CO_LINH",
          "neutral",
          "Thông tin thiếu là lý do dừng lại để kiểm tra. Chỉ từ đó thì mình chưa kết luận được về cả đơn vị.",
        ],
        [
          "AN",
          "neutral",
          "Mình cần đọc rõ điều kiện và hỏi trực tiếp bên cho vay, chứ không ký vì sợ bỏ lỡ.",
        ],
      ],
      "CH06_CREDIT_INFO",
    ),
    inspect(
      "CH06_CREDIT_INFO",
      2,
      "Những dòng chữ nhỏ cần đọc",
      [
        card(
          "apr",
          "APR là gì?",
          "Annual Percentage Rate: tỷ lệ chi phí vay quy đổi theo năm. Đối chiếu cùng cách tính, đồng thời xem số tiền thực nhận và khoảng cách giữa các lần trả.",
          `${BASE}/props/terms-and-fees.png`,
        ),
        card(
          "check",
          "Ở Việt Nam cần xem gì?",
          "Đọc lãi suất %/năm, cách tính trên dư nợ, các loại phí và lịch trả trong hợp đồng. Không nhầm lãi phẳng/tháng với APR.",
          `${MINI}/loan-offers-inspection.png`,
        ),
      ],
      "CH06_DETECTIVE_INTRO_1",
      {
        label: "Lưu ý chung",
        items: [
          "Số liệu là mô phỏng cho vay tiêu dùng bằng VND, không phải mức lãi của ngân hàng cụ thể.",
          "APR ở đây là chỉ số so sánh của bài học; không thay thế lãi suất và phương pháp tính ghi trong hợp đồng Việt Nam.",
        ],
      },
    ),
    ...lines(
      "CH06_DETECTIVE_INTRO",
      2,
      [
        [
          "MINH",
          "inviting",
          "Mình thử tự tính tổng tiền từng gói nhé? Quên số nào thì mở lại ba gói vay. Sau đó xem gói nào đủ tiền mua máy và có lịch trả vừa với thu nhập.",
        ],
        [
          "AN",
          "neutral",
          "Rồi đổi vai kiểm tra lại. Tớ sẽ tự chốt tổng phải trả của cả ba gói, không nhìn mỗi con số quảng cáo.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Các em cứ thử. Nếu thấy thiếu tiền ở bước nào, hãy chỉ đúng bước đó. Đây mới là bài tập, chưa tạo khoản vay.",
        ],
      ],
      "CH06_GAME_OFFERS",
    ),
    game(
      "CH06_GAME_OFFERS",
      2,
      "LOAN_OFFERS_CH06",
      [0, 1],
      "CH06_AFTER_OFFERS_1",
    ),
    ...lines(
      "CH06_AFTER_OFFERS",
      2,
      [
        [
          "AN",
          "thinking",
          "Gói vay A tổng là 6.720.000đ, gói vay B là 6.600.000đ, còn gói vay C là 8.000.000đ. Đó là tổng các lần trả theo lịch.",
        ],
        [
          "MINH",
          "neutral",
          "Gói vay A kết thúc sớm hơn nhưng mỗi tháng vượt phần mình dành được một trăm hai mươi nghìn.",
        ],
        [
          "AN",
          "neutral",
          "Gói vay B trả năm trăm năm mươi nghìn mỗi tháng. Tháng thường còn dư bốn trăm năm mươi nghìn, nhưng phải theo lịch suốt mười hai tháng.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Gói vay A và B không có phí đầu trong bài này. Em vẫn cần kiểm tra thu nhập có duy trì được suốt lịch trả trước khi cam kết.",
        ],
        [
          "MINH",
          "neutral",
          "Gói vay C cần hai lần trả mỗi tháng, tức một triệu. Mà thực nhận chỉ năm triệu tư, còn thiếu sáu trăm nghìn mua máy.",
        ],
        [
          "AN",
          "thinking",
          "Còn chờ sáu tháng thì có máy trường hỗ trợ. Mình sẽ phải làm bài theo lịch, thay vì mua ngay.",
        ],
      ],
      "CH06_SC02",
    ),
    choice(
      "CH06_SC02",
      2,
      "Sau khi so ba gói vay, An muốn tính tiếp theo hướng nào?",
      [
        {
          id: "CH06_SC02_A",
          label:
            "Dùng máy trường thêm một thời gian, mỗi tháng để dành tiền mua máy.",
          deltaStats: { RISK: -5, GOAL: 3 },
          evidenceScores: evidence(),
          setFlags: plan(true),
          nextSceneId: "CH06_PLAN_WAIT_1",
        },
        {
          id: "CH06_SC02_B",
          label:
            "Tìm hiểu thêm gói B: có máy sớm, trả 550.000đ mỗi tháng trong một năm.",
          deltaStats: { RISK: -5, GOAL: 3 },
          evidenceScores: evidence(),
          setFlags: plan(false, true),
          nextSceneId: "CH06_PLAN_B_1",
        },
        {
          id: "CH06_SC02_C",
          label: "Xem tiếp gói C: chia tiền trả thành 500.000đ mỗi nửa tháng.",
          deltaStats: { SAVING: -2, HAPPINESS: 3, RISK: 8 },
          evidenceScores: evidence(0, 0, 0),
          setFlags: plan(false, false, true),
          nextSceneId: "CH06_PLAN_C_1",
        },
      ],
      { choiceGroup: "CH06_PLAN" },
    ),
    ...lines(
      "CH06_PLAN_WAIT",
      2,
      [
        [
          "AN",
          "neutral",
          "Mình chọn dùng máy trường trước. Tớ phải đến đúng giờ mở phòng và lưu bài cẩn thận hơn.",
        ],
        [
          "MINH",
          "inviting",
          "Tớ cũng ở lại hai buổi một tuần. Hẹn cùng làm để đỡ bỏ buổi nhé.",
        ],
        [
          "AN",
          "thinking",
          "Mỗi tháng dành một triệu thì sáu tháng mới đủ sáu triệu, nếu thu nhập giữ đúng dự kiến.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Vậy em ghi rõ: chỉ khi dành đủ một triệu mỗi tháng thì sáu tháng mới mua được. Mình sẽ theo dõi số tiền thực sự để dành được nhé.",
        ],
      ],
      "CH06_SC03_ART",
    ),
    ...lines(
      "CH06_PLAN_B",
      2,
      [
        [
          "AN",
          "neutral",
          "Tớ muốn có máy sớm nên muốn tìm hiểu thêm gói B. Mỗi tháng 550.000đ có vẻ vừa, nhưng mình phải trả suốt 12 tháng.",
        ],
        [
          "MINH",
          "neutral",
          "Cậu có thể duy trì khoản thu nhập đó suốt một năm không?",
        ],
        [
          "AN",
          "thinking",
          "Tớ cần kiểm tra nguồn thu và ngày đến hạn, không chỉ hy vọng tháng nào cũng nhận đủ tiền.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Đúng. Trong lúc chưa xác minh, em vẫn có thể dùng máy trường. Cuối buổi mình quay lại điều kiện này.",
        ],
      ],
      "CH06_SC03_ART",
    ),
    ...lines(
      "CH06_PLAN_C",
      2,
      [
        [
          "AN",
          "neutral",
          "Tớ đã thấy lịch trả, nhưng năm trăm mỗi nửa kỳ vẫn khiến tớ cảm giác nhẹ hơn.",
        ],
        [
          "MINH",
          "neutral",
          "Hai lần trong một tháng là một triệu rồi. Chưa kể cậu còn thiếu 600.000đ mua máy vì tiền thực nhận bị khấu trừ.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Nếu chọn gói C, em sẽ lấy đâu bù tiền mua máy? Và nếu có tháng kiếm được ít hơn thì em trả thế nào?",
        ],
        [
          "AN",
          "thinking",
          "Vậy đây chưa phải quyết định mua. Tớ cần quay lại khoản thiếu 600.000đ và lịch trả trước khi chốt.",
        ],
      ],
      "CH06_SC03_ART",
    ),
    art(3, "sc03-bnpl-and-minimum-payment", "CH06_BNPL_1"),
    ...lines(
      "CH06_BNPL",
      3,
      [
        [
          "MINH",
          "inviting",
          "Khoan, cửa hàng còn ghi BNPL bên cạnh dòng mua trước trả sau. Đó là gì vậy cô?",
        ],
        [
          "CO_LINH",
          "explaining",
          "BNPL là Buy Now, Pay Later: mua trước, trả sau. Em nhận hàng trước rồi trả tiền theo lịch đã thỏa thuận. Dù quảng cáo không lãi, đó vẫn là nghĩa vụ phải trả.",
        ],
        [
          "AN",
          "thinking",
          "Không lãi thì có nghĩa mình không vay à? Nhưng họ vẫn đưa máy trước rồi mình trả sau.",
        ],
        ["MINH", "neutral", "Tớ cũng đang lẫn chỗ đó. Có khi chỉ là đổi tên?"],
        [
          "CO_LINH",
          "explaining",
          "Tên gọi không làm ngày đến hạn biến mất. Cô có bài thử giỏ hàng: mỗi món trả góp một ít, mình xem nhiều món cộng lại sẽ thế nào.",
        ],
        [
          "AN",
          "neutral",
          "Mua tai nghe để học online, rồi chọn thêm một món nữa phải không cô?",
        ],
        [
          "MINH",
          "neutral",
          "Mỗi tháng bài thử có năm trăm nghìn. Riêng tháng hai đã có khoản khác hai trăm nghìn, nên không thể dành hết cho giỏ mới.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Sau giỏ hàng là một ví dụ trả thẻ. Hai bài có ngân sách riêng, không lấy tiền của kế hoạch laptop hay tạo khoản vay thật cho An.",
        ],
        [
          "AN",
          "thinking",
          "Dạ, mình thử trên giấy trước, để biết nếu gặp tình huống đó thì phải tính những gì.",
        ],
      ],
      "CH06_STATEMENT_INTRO_1",
    ),
    ...lines(
      "CH06_STATEMENT_INTRO",
      3,
      [
        [
          "MINH",
          "neutral",
          "Ví dụ thẻ đang nợ một triệu, tối thiểu trả một trăm nghìn. Trong ví có một triệu hai, nhưng sắp cần bốn trăm nghìn sinh hoạt.",
        ],
        [
          "AN",
          "thinking",
          "Nhìn lướt thì tớ chỉ muốn trả một trăm nghìn thôi, vì thấy ghi là mức tối thiểu.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu trả một trăm nghìn rồi thì coi như xong khoản một triệu này chưa?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Chưa đâu. Bài thử này tính lãi bằng 2% phần chưa trả, để các em thấy khác biệt. Chọn một cách rồi mở từng mốc xem tiền sinh hoạt và sao kê kỳ sau thay đổi thế nào nhé.",
        ],
        [
          "AN",
          "neutral",
          "Vậy tớ phải cân nhắc cả hai việc: tiền sinh hoạt sắp tới và phần nợ sẽ đi theo sang tháng sau.",
        ],
      ],
      "CH06_GAME_REPAYMENT",
    ),
    game(
      "CH06_GAME_REPAYMENT",
      3,
      "LOAN_REPAYMENT_CH06",
      [2, 3],
      "CH06_AFTER_REPAYMENT_1",
    ),
    ...lines(
      "CH06_AFTER_REPAYMENT",
      3,
      [
        [
          "AN",
          "thinking",
          "Từng món trả sau trông không nhiều. Nhưng tháng hai còn có khoản đã hẹn trả từ trước, nên giỏ mới phải tính chung với khoản đó.",
        ],
        [
          "MINH",
          "neutral",
          "Tai nghe với bộ sổ và bút là ba trăm nghìn mỗi tháng. Cộng hai trăm nghìn đã đến hạn thì vừa hết năm trăm nghìn của tháng hai.",
        ],
        [
          "AN",
          "neutral",
          "Và trả tối thiểu một trăm nghìn trên sao kê thì vẫn còn chín trăm nghìn trước lãi với phí.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Trong bài thử, trả tối thiểu còn 900.000đ nợ nên lãi là 18.000đ; trả 800.000đ còn 200.000đ nợ nên lãi là 4.000đ. Cách tính của thẻ thật có thể khác, cần đọc hợp đồng. Nhưng em vẫn phải tính cả tiền sinh hoạt và phần chưa trả.",
        ],
        [
          "MINH",
          "neutral",
          "Cảm giác “xử lý xong rồi” dễ đến trước lúc mình đọc hết sao kê nhỉ.",
        ],
      ],
      "CH06_SC03",
    ),
    choice(
      "CH06_SC03",
      3,
      "Minh hỏi: “Nếu tháng này chỉ trả mức tối thiểu trên sao kê, cậu sẽ tính tiếp thế nào?”",
      [
        {
          id: "CH06_SC03_A",
          label: "Tớ muốn tính xem tháng sau lấy đâu ra tiền trả phần còn lại.",
          deltaStats: { RISK: -5, GOAL: 3 },
          evidenceScores: evidence(),
          setFlags: repayment(true),
          nextSceneId: "CH06_REPAID_A_1",
        },
        {
          id: "CH06_SC03_B",
          label:
            "Tớ sẽ lo các khoản khác trước, chuyện trả thêm để tháng sau tính.",
          deltaStats: { RISK: 12, GOAL: -8 },
          evidenceScores: evidence(0, 0, 0),
          setFlags: repayment(false),
          nextSceneId: "CH06_REPAID_B_1",
        },
      ],
      { choiceGroup: "CH06_REPAYMENT" },
    ),
    ...lines(
      "CH06_REPAID_A",
      3,
      [
        [
          "AN",
          "neutral",
          "Tớ sẽ ghi cả phần nợ còn lại vào ngân sách tháng sau, chứ không chỉ nhìn số phải trả tối thiểu hôm nay.",
        ],
        [
          "MINH",
          "neutral",
          "Còn trả tối thiểu thì chỉ là đã xử lý một phần. Tớ sẽ nhìn cả phần còn lại.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Đúng. Nhớ mang cách đọc đó vào mọi kế hoạch trả sau, dù quảng cáo dùng tên gọi nào.",
        ],
      ],
      "CH06_SC04_ART",
    ),
    ...lines(
      "CH06_REPAID_B",
      3,
      [
        [
          "AN",
          "thinking",
          "Em định trả tối thiểu trước cho nhẹ tháng này, còn tháng sau thì chưa tính tới…",
        ],
        [
          "CO_LINH",
          "explaining",
          "Em đạt số thanh toán tối thiểu, nhưng 900.000đ còn lại trên sao kê vẫn phải trả.",
        ],
        [
          "MINH",
          "neutral",
          "Mình thử đọc lại ở cuối buổi nhé. Tớ cũng từng gộp hai việc này thành một.",
        ],
        [
          "AN",
          "worried-money",
          "Ừ. Tớ muốn sửa cách hiểu đó trước khi hứa sẽ trả một khoản.",
        ],
      ],
      "CH06_SC04_ART",
    ),
    art(4, "sc04-realistic-repayment-plan", "CH06_CHECK_PLAN"),
    scene("CH06_CHECK_PLAN", 4, "conditional", {
      condition: { expression: "flags.credit_plan_fit" },
      ifTrueSceneId: "CH06_RETURN_WAIT_1",
      ifFalseSceneId: "CH06_CHECK_B",
    }),
    scene("CH06_CHECK_B", 4, "conditional", {
      condition: { expression: "flags.credit_plan_conditional" },
      ifTrueSceneId: "CH06_RETURN_B_1",
      ifFalseSceneId: "CH06_RETURN_C_1",
    }),
    ...lines(
      "CH06_RETURN_WAIT",
      4,
      [
        [
          "AN",
          "neutral",
          "Kế hoạch của tớ vẫn là máy trường trước. Tớ đã nhờ Minh nhắc hai buổi làm bài chung.",
        ],
        [
          "MINH",
          "inviting",
          "Tớ ghi lịch rồi. Nhưng tháng nào tiền về ít hơn thì cậu xử lý sao?",
        ],
        [
          "AN",
          "thinking",
          "Có lẽ ngày mua phải lùi. Tớ chưa tính kỹ đoạn máy trường chỉ hỗ trợ sáu tháng.",
        ],
      ],
      "CH06_STRESS_1",
    ),
    ...lines(
      "CH06_RETURN_B",
      4,
      [
        [
          "AN",
          "thinking",
          "Em vẫn đang cân nhắc gói B. Em muốn tính xem nếu có tháng kiếm ít hơn thì còn đủ trả 550.000đ không.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy giờ không được coi là đã có máy mới. Mình còn máy trường để học tiếp.",
        ],
        [
          "AN",
          "neutral",
          "Ừ. Tớ mới đang cân nhắc vay thôi, chưa thể tính như mình đã mua được máy.",
        ],
      ],
      "CH06_STRESS_1",
    ),
    ...lines(
      "CH06_RETURN_C",
      4,
      [
        [
          "AN",
          "thinking",
          "Tớ đã nghiêng về gói vay C vì khoản trả nhỏ, nhưng phải trả 16 lần và chỉ nhận 5.400.000đ.",
        ],
        [
          "MINH",
          "neutral",
          "Mình ghi rõ những khoản chưa có nguồn trả nhé. Giữ gói C không có nghĩa phần tiền thiếu tự biến mất.",
        ],
        [
          "AN",
          "neutral",
          "Ừ. Với gói C tớ đã chọn, phần tiền mua máy vẫn chưa đủ. Tớ cần ghi lại điều đó khi đánh giá kế hoạch.",
        ],
      ],
      "CH06_STRESS_1",
    ),
    ...lines(
      "CH06_STRESS",
      4,
      [
        [
          "CO_LINH",
          "neutral",
          "Thử thêm một tình huống nhé: một tháng thu nhập chỉ còn hai triệu bảy, chi thiết yếu vẫn hai triệu.",
        ],
        [
          "AN",
          "thinking",
          "Mình chỉ còn bảy trăm nghìn. Gói vay B cần 550.000đ, vẫn trả được và còn 150.000đ trong tháng đó.",
        ],
        [
          "MINH",
          "neutral",
          "Còn gói vay C cần hai lần 500.000đ, vậy tháng đó thiếu 300.000đ đúng không?",
        ],
        [
          "AN",
          "neutral",
          "Đúng. Nếu chưa tích lũy được từ trước thì không thể tự coi là đã có khoản dự phòng để bù.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng. Một khoảng dư trong dự tính chưa phải khoản dự phòng đã tích lũy.",
        ],
        [
          "MINH",
          "neutral",
          "Với kế hoạch chờ thì vẫn có thể dành ít hơn tháng đó, thay vì thiếu kỳ trả nợ.",
        ],
        [
          "AN",
          "thinking",
          "Nhưng mua sẽ chậm. Năm tháng một triệu và một tháng bảy trăm thì mới có năm triệu bảy.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Còn thiếu ba trăm nghìn. Nếu phải dùng máy chung lâu hơn sáu tháng, em cần xác minh phương án học tiếp.",
        ],
        [
          "AN",
          "neutral",
          "Em sẽ xem lại tiến độ mỗi tháng và hỏi nhà trường trước khi hết thời gian hỗ trợ. Không đợi đến ngày cuối mới tính.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy chờ cũng là một kế hoạch phải theo dõi, chứ không phải bấm “không mua” rồi quên luôn.",
        ],
      ],
      "CH06_FINAL_DATA",
    ),
    inspect(
      "CH06_FINAL_DATA",
      4,
      "Tháng này có đủ tiền trả gói B?",
      [],
      "CH06_FINAL_ROUTE",
      { label: "Gói B: trả 550.000đ mỗi tháng, trong 12 tháng.", items: [] },
      [
        { id: "normal", label: "Tháng bình thường", income: 3000000 },
        { id: "lower", label: "Tháng thu nhập giảm", income: 2700000 },
      ],
    ),
    scene("CH06_FINAL_ROUTE", 4, "conditional", {
      condition: { expression: "flags.credit_plan_fit" },
      ifTrueSceneId: "CH06_FINAL_WAIT_1",
      ifFalseSceneId: "CH06_FINAL_ROUTE_B",
    }),
    scene("CH06_FINAL_ROUTE_B", 4, "conditional", {
      condition: { expression: "flags.credit_plan_conditional" },
      ifTrueSceneId: "CH06_FINAL_B_1",
      ifFalseSceneId: "CH06_FINAL_C_1",
    }),
    ...lines(
      "CH06_FINAL_WAIT",
      4,
      [
        [
          "AN",
          "neutral",
          "Tớ chọn dùng máy trường và tích lũy trước. Tháng nào thu nhập giảm thì ghi lại, không tự coi vẫn dành đủ một triệu.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu cần mua muộn hơn thì cậu hỏi phương án thực hành tiếp trước tháng thứ sáu nhé.",
        ],
        [
          "AN",
          "neutral",
          "Ừ. Có máy riêng vẫn là mục tiêu, nhưng tớ không cần làm như thể đã có đủ tiền hôm nay.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Em đã có bước hiện tại và mốc để xem lại kế hoạch. Đó là điều mình cần chốt.",
        ],
      ],
      "CH06_REPAY_CHECK",
      { ...plan(true), selected_loan_B: false, fallback_verified: true },
    ),
    ...lines(
      "CH06_FINAL_B",
      4,
      [
        [
          "AN",
          "thinking",
          "Em sẽ tính ngân sách theo gói B, mỗi tháng trả 550.000đ trong một năm. Trước khi ký, em còn cần hỏi rõ hợp đồng và xem thu nhập có đủ đều không.",
        ],
        ["CO_LINH", "neutral", "Nếu liên hệ bên cho vay, em sẽ hỏi những gì?"],
        [
          "AN",
          "neutral",
          "Em sẽ đối chiếu hợp đồng, số tiền thực nhận và ngày trả. Nếu thu nhập giảm, em cập nhật kế hoạch và báo cho bên cho vay trước ngày đến hạn.",
        ],
        [
          "MINH",
          "neutral",
          "Và nếu chưa làm rõ được thì vẫn đi theo kế hoạch tích lũy. Có bước thay thế sẽ đỡ bị thúc phải ký.",
        ],
      ],
      "CH06_REPAY_CHECK",
      { ...plan(true), selected_loan_B: true, fallback_verified: true },
    ),
    ...lines(
      "CH06_FINAL_C",
      4,
      [
        [
          "AN",
          "thinking",
          "Tớ vẫn giữ gói vay C nhưng chưa có nguồn bù 600.000đ mua máy và chưa có phương án khi thu nhập giảm.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Cô ghi nhận kế hoạch em vừa chọn. Phần tiền còn thiếu và cách trả khi thu nhập giảm vẫn chưa được giải quyết; đó sẽ là điểm cần xem lại sau buổi này.",
        ],
      ],
      "CH06_REPAY_CHECK",
      {
        ...plan(false, false, true),
        selected_loan_B: false,
        fallback_verified: false,
      },
    ),
    scene("CH06_REPAY_CHECK", 4, "conditional", {
      condition: { expression: "flags.repayment_understood" },
      ifTrueSceneId: "CH06_RECAP_1",
      ifFalseSceneId: "CH06_MINIMUM_REVIEW_1",
    }),
    ...lines(
      "CH06_MINIMUM_REVIEW",
      4,
      [
        [
          "MINH",
          "neutral",
          "Mình còn lời lúc nãy: trả tối thiểu có phải là hết nợ không?",
        ],
        [
          "AN",
          "thinking",
          "Tớ đã chọn để tháng sau tính tiếp. Vậy chín trăm nghìn còn lại vẫn chưa có kế hoạch trả.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng. Cách xử lý vừa chọn sẽ được ghi nhận cùng kết quả buổi học. Lần sau em cần tính cả tiền trả phần còn nợ, không chỉ mức tối thiểu.",
        ],
      ],
      "CH06_RECAP_1",
    ),
    ...lines(
      "CH06_RECAP",
      4,
      [
        [
          "MINH",
          "neutral",
          "Hôm nay mình chưa mua máy, mà đã phải xem nhiều hơn tớ tưởng.",
        ],
        [
          "AN",
          "thinking",
          "Tổng trả, số tiền thực nhận, khoảng cách giữa các lần trả, cả tháng thu nhập giảm. Tớ không thể gói tất cả vào một con số quảng cáo.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Các em đã có cách kiểm tra cho lần sau rồi. Giữ lịch làm bài và xem lại kế hoạch khi thu nhập thay đổi nhé.",
        ],
      ],
      "CH06_CLOSE_1",
    ),
    ...lines(
      "CH06_CLOSE",
      4,
      [
        [
          "MINH",
          "inviting",
          "Tớ đi lấy xe nhé. Buổi phòng máy tiếp theo tớ giữ chỗ cạnh cậu.",
        ],
        [
          "AN",
          "neutral",
          "Nhớ gửi tớ lịch. Bài poster còn phải sửa màu nữa đấy.",
        ],
        ["MINH", "neutral", "Còn tờ quảng cáo này?"],
        [
          "AN",
          "thinking",
          "Cứ giữ làm hồ sơ đối chiếu. Lần sau tớ sẽ đọc cả những dòng nhỏ trước khi nghĩ “mỗi kỳ có ít thôi”.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Các em lưu bài xong rồi thì về nhé. Kế hoạch có thể cập nhật, còn điều kiện chưa rõ thì mình cứ hỏi tiếp.",
        ],
        [
          "AN",
          "neutral",
          "Dạ. Hôm nay em chưa có laptop mới, nhưng em biết mình cần làm gì tiếp theo rồi.",
        ],
      ],
      "CH06_ENDING",
    ),
    scene("CH06_ENDING", 4, "ending", {
      title: "Kết thúc Chương 6 · Mượn tiền có dễ không?",
      nextSceneId: null,
    }),
  ],
  endingRules: {
    priorityOrder: ["C_RECOVERY", "A_GOAL_ACHIEVED", "B_BALANCED"],
    endings: [
      {
        id: "C_RECOVERY",
        title: "Ending C: Recovery",
        condition:
          "miniGameNeedsPractice || !flags.fallback_verified || flags.credit_unverified || !flags.repayment_understood || RISK > 55 || SAVING < 40",
        storyText:
          "Khoản trả nhỏ chưa chứng minh tổng chi thấp hoặc đã hết nợ. Kế hoạch còn phần cần luyện; chưa có giao dịch vay nào phát sinh.",
        characterSprite: sprite("AN", "worried-money"),
      },
      {
        id: "A_GOAL_ACHIEVED",
        title: "Ending A: Goal Achieved",
        condition:
          "flags.credit_plan_fit && flags.repayment_understood && choicePercent >= 75 && learningScore >= 75 && miniGameCompleted && miniGameGoalEligible",
        storyText:
          "An có kế hoạch laptop khả thi theo giả định đã nêu, biết điều cần theo dõi và hiểu phần nghĩa vụ còn lại. Đạt mục tiêu lập kế hoạch không có nghĩa đã mua máy.",
        characterSprite: sprite("AN", "relieved"),
      },
      {
        id: "B_BALANCED",
        title: "Ending B: Balanced",
        condition: "DEFAULT_FALLBACK",
        storyText:
          "An dùng máy trường trong lúc xác minh điều kiện và theo dõi khả năng chi trả. Chưa ký cũng là một quyết định có căn cứ; gói vay B vẫn chưa được xác nhận.",
        characterSprite: sprite("AN", "thinking"),
      },
    ],
  },
  endingReport: {
    choiceGroupMaxima: { CH06_PLAN: 6, CH06_REPAYMENT: 6 },
    maxChoiceScore: 6,
    requiredGameIds: ["LOAN_OFFERS_CH06", "LOAN_REPAYMENT_CH06"],
    miniGameLabel: "Thám tử khoản vay",
    miniGameMax: 10,
    weights: { choices: 0.65, miniGame: 0.35, reflection: 0 },
    bands: [
      { min: 85, label: "Đã thể hiện vững" },
      { min: 60, label: "Đang hình thành" },
      { min: 0, label: "Cần luyện thêm" },
    ],
    achieved: [
      {
        when: "flags.selected_loan_B",
        text: "Đã lập dự thảo gói vay B: 550.000đ/tháng trong 12 tháng và kiểm tra khả năng trả.",
      },
      {
        when: "flags.credit_plan_fit && !flags.selected_loan_B",
        text: "Đã chọn kế hoạch dùng máy trường và tích lũy theo khả năng thực.",
      },
      { text: "Đã đối chiếu tổng chi, lịch đến hạn và số tiền thực nhận." },
    ],
    practice: [
      {
        when: "miniGameNeedsPractice",
        text: "Bài thực hành còn nhiều câu chưa đúng. Xem lại tổng tiền phải trả, lịch trả và số tiền cần giữ cho sinh hoạt.",
      },
      {
        when: "!flags.repayment_understood",
        text: "Phân biệt trả tối thiểu với hết dư nợ; xem lại 900.000đ còn lại.",
      },
      {
        when: "flags.credit_plan_conditional",
        text: "Xác minh nguồn thu và lịch 12 tháng trước khi cân nhắc gói vay B.",
      },
      {
        text: "Theo dõi thu nhập và xác minh cách học tiếp nếu thời điểm mua bị lùi.",
      },
    ],
    nextStep:
      "Kiểm tra kế hoạch mỗi tháng. Các khoản tích lũy là dự kiến, Money thực tế vẫn 0đ.",
  },
};
