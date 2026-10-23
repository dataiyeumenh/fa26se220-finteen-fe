const BASE = "/images/finteen-v2/chapter-08";
const backgrounds = [
  "bg13-investment-classroom",
  "bg13b-asset-allocation-table",
  "bg12-investment-simulation-tablet",
  "bg14-twelve-month-planning-desk",
  "bg14b-plan-review-corner",
];
const people = {
  AN: ["an", "An"],
  MINH: ["minh", "Minh"],
  CO_LINH: ["co-linh", "Cô Linh"],
};
const sprite = (who, expression) =>
  `${BASE}/char/${people[who][0]}/${people[who][0]}-${expression}.png`;
const knowledge = [
  "D05.01",
  "D05.02",
  "D05.03",
  "D05.04",
  "D05.05",
  "D05.06",
  "D05.07",
  "D05.08",
  "D05.09",
  "D08.01",
  "D08.02",
  "D08.03",
  "D08.04",
  "D08.05",
  "D08.06",
  "D08.07",
  "D08.08",
  "D04.07",
];
const scene = (id, n, type, extra) => ({
  id,
  type,
  background: `${BASE}/bg/${backgrounds[n - 1]}.png`,
  characters: [],
  knowledgeUnits: knowledge,
  ...extra,
});
const lines = (prefix, n, script, next, setFlags) =>
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
      ...(i === 0 && setFlags ? { setFlags } : {}),
    }),
  );
const art = (n, file, nextSceneId) =>
  scene(`CH08_SC0${n}_ART`, n, "scene", {
    title: [
      "Tiền cần sớm và tiền có thể đợi",
      "Chia giỏ tiền",
      "Biến động và lời hứa",
      "Kế hoạch cho những tháng tới",
      "Bước vào tuổi 18",
    ][n - 1],
    sceneArt: `${BASE}/scene/${file}.png`,
    background: `${BASE}/scene/${file}.png`,
    nextSceneId,
  });
const choose = (id, n, prompt, options, group) =>
  scene(id, n, "choice", {
    title: prompt,
    text: prompt,
    prompt,
    options,
    choiceGroup: group,
  });
const inspect = (id, n, title, cards, nextSceneId, shared, extra = {}) =>
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
      autoNextSceneOnClose: true,
      ...extra,
    },
  });
const evidence = (I = 2, C = 2, P = 2) => ({ I, C, P });
const assetCards = [
  {
    id: "cash",
    label: "Tiền dễ rút",
    image:
      "/images/finteen-v2/chapter-08/asset-mini-game/portfolio-builder/liquid-money.png",
    facts: [
      [
        "Là gì?",
        "Tiền để sẵn trong ví hoặc tài khoản có thể rút khi cần, chưa đem đi đầu tư.",
      ],
      [
        "Dùng khi nào?",
        "Khi đã biết sắp phải chi, như 3.000.000đ học phí sau ba tháng.",
      ],
      [
        "Trong bài này",
        "Số tiền giữ nguyên, không tính lãi. Tài khoản thật có thể có phí và điều kiện rút riêng.",
      ],
    ],
  },
  {
    id: "bond",
    label: "Trái phiếu",
    image:
      "/images/finteen-v2/chapter-08/asset-mini-game/portfolio-builder/bond.png",
    facts: [
      [
        "Là gì?",
        "Mua trái phiếu nghĩa là cho công ty hoặc Chính phủ vay tiền trong một thời gian.",
      ],
      [
        "Có thể kiếm tiền thế nào?",
        "Bên vay hứa trả lãi và hoàn gốc. Nếu bán lại trước hạn, giá bán có thể cao hơn hoặc thấp hơn lúc mua.",
      ],
      [
        "Có thể mất tiền không?",
        "Có. Bên vay có thể trả chậm hoặc không đủ; bán lại khi giá giảm cũng có thể bị lỗ.",
      ],
    ],
  },
  {
    id: "equity",
    label: "Cổ phiếu",
    image:
      "/images/finteen-v2/chapter-08/asset-mini-game/portfolio-builder/equity.png",
    facts: [
      ["Là gì?", "Mua cổ phiếu nghĩa là sở hữu một phần nhỏ của công ty."],
      [
        "Có thể kiếm tiền thế nào?",
        "Bán với giá cao hơn lúc mua, hoặc nhận cổ tức nếu công ty chia lợi nhuận cho cổ đông.",
      ],
      [
        "Có thể mất tiền không?",
        "Có. Giá bán có thể thấp hơn giá mua. Công ty không bắt buộc lúc nào cũng chia cổ tức.",
      ],
    ],
  },
  {
    id: "fund",
    label: "Quỹ đầu tư",
    image:
      "/images/finteen-v2/chapter-08/asset-mini-game/portfolio-builder/diversified-fund.png",
    facts: [
      [
        "Là gì?",
        "Nhiều người góp tiền để một đơn vị quản lý mua các tài sản theo kế hoạch của quỹ.",
      ],
      [
        "Cần đọc gì?",
        "Quỹ đang mua những gì, thu phí bao nhiêu và khi nào bạn được bán hoặc rút tiền.",
      ],
      [
        "Có thể mất tiền không?",
        "Có. Nếu tài sản quỹ mua giảm giá, phần tiền đầu tư của bạn cũng có thể giảm. Góp vào quỹ không có nghĩa chắc chắn có lãi.",
      ],
    ],
  },
  {
    id: "property",
    label: "Bất động sản",
    image:
      "/images/finteen-v2/chapter-08/asset-mini-game/portfolio-builder/real-estate.png",
    facts: [
      [
        "Là gì?",
        "Nhà, đất hoặc căn hộ được mua để sử dụng, cho thuê hay bán lại.",
      ],
      [
        "Có thể kiếm tiền thế nào?",
        "Nhận tiền cho thuê hoặc bán với giá cao hơn, sau khi trừ các chi phí.",
      ],
      [
        "Có thể cần chờ lâu không?",
        "Có. Thường cần số vốn lớn và thời gian tìm người mua; không chắc bán được ngay lúc cần tiền.",
      ],
    ],
  },
];
const assetShared = {
  label: "Đọc trước khi chia tiền",
  items: [
    "An có 10.000.000đ trong bài mô phỏng. Trong đó, 3.000.000đ cần cho khóa học sau ba tháng.",
    "Xem mỗi loại để biết tiền có thể tăng, giảm và lấy ra thế nào. Mini-game chỉ dùng ba giỏ: tiền dễ rút, trái phiếu và cổ phiếu; quỹ và bất động sản là phần tìm hiểu thêm.",
  ],
};
// Mini-game "Kế hoạch tương lai" (khung FUTURE_PLAN): mọi chữ / số / đáp án / ảnh nằm ở đây, component chỉ là khung
// (spec bộ khuôn 24/10, cách A). Ba màn (config.mode = portfolio | claims | planner) dùng chung một hình dạng trạng thái
// (budgets 3 tháng có ở mọi màn — giữ tương thích tiến độ đã lưu), nên mỗi game mang trọn cấu hình chung.
// Chữ có "{x}" là mẫu, khung điền số vào.
const MINI = `${BASE}/asset-mini-game`;
const futurePlanConfig = {
  tasks: [
    "allocation_near",
    "allocation_spread",
    "claim_risk",
    "claim_commission",
    "claim_esg",
    "plan_normal",
    "plan_low",
    "plan_prices",
  ],
  texts: {
    eyebrow: "GÓC THỰC HÀNH CỦA AN",
    referenceButton: "Xem lại thông tin tài sản",
    decrease: "Giảm {label}",
    increase: "Tăng {label}",
    correct: "Đúng",
    incorrect: "Chưa đúng",
    footerDone: "Đã nộp · có thể đọc lời giải rồi tiếp tục",
    footerOpen: "Không đếm giờ · có thể sửa trước khi nộp",
    finish: "Trở lại câu chuyện →",
    disclaimer:
      "Số tiền và diễn biến đều giả lập. Các thao tác trong bài tập không mua sản phẩm thật và không làm thay đổi ví của An.",
  },
  portfolio: {
    heroImage: `${MINI}/portfolio-builder/diversified-fund.png`,
    intro: "Chia tiền theo ngày cần dùng, rồi xem kết quả sau ba tháng.",
    toolbar: "10.000.000đ · 100 điểm",
    startingAmount: 10000000,
    pointValue: 100000,
    totalPoints: 100,
    step: 10,
    unit: "điểm",
    nearAsset: "cash",
    nearMinPoints: 30,
    courseCost: 3000000,
    spreadAssets: ["bonds", "equity"],
    assets: [
      {
        id: "cash",
        label: "Tiền dễ rút",
        image: `${MINI}/portfolio-builder/liquid-money.png`,
        description: "Để dùng khi cần. Trong lượt thử này, giá trị giữ nguyên.",
      },
      {
        id: "bonds",
        label: "Trái phiếu",
        image: `${MINI}/portfolio-builder/bond.png`,
        description:
          "Cho công ty hoặc Chính phủ vay tiền. Có cam kết trả lãi, nhưng vẫn có rủi ro không được trả đủ.",
      },
      {
        id: "equity",
        label: "Cổ phiếu",
        image: `${MINI}/portfolio-builder/equity.png`,
        description: "Sở hữu một phần công ty. Giá có thể tăng hoặc giảm.",
      },
    ],
    market: {
      period: "sau ba tháng",
      maxMove: 10,
      fixed: { cash: 0 },
      drawn: ["bonds", "equity"],
      legacy: { period: "sau ba tháng", cash: 0, bonds: 2, equity: -10 },
    },
    settlement: {
      resultFrom: "CH08_GAME_PORTFOLIO",
      fitFlag: "portfolio_fit",
      fitAllocation: { cash: 30, bonds: 40, equity: 30 },
      otherAllocation: { cash: 10, bonds: 0, equity: 90 },
      eventId: "CH08_MARKET_SETTLEMENT",
    },
    noteTitle: "Khóa học cần 3.000.000đ sau ba tháng.",
    noteText:
      "Chia đủ 100 điểm vào ba giỏ. 1 điểm = 100.000đ; mỗi lần bấm thêm hoặc bớt 10 điểm (1.000.000đ). Bạn tự quyết định phần nào giữ dễ rút, phần nào chấp nhận biến động.",
    poolLabel: "Điểm chưa chia",
    submit: "Chốt phân bổ và xem biến động",
    resultsTitle: "Kết quả sau ba tháng trong tình huống này",
    resultsIntro:
      "Trái phiếu và cổ phiếu được chọn mức biến động độc lập từ −10% đến +10% cho mỗi lượt chơi mới. Tình huống của lượt này được giữ nguyên khi xem lại hoặc tải lại trang; tiền dễ rút không đổi.",
    resultsFine:
      "Đây là thay đổi tổng giá trị sau ba tháng, không phải lãi suất cố định mỗi tháng. Hai nhóm có thể cùng tăng, cùng giảm hoặc đi ngược chiều. Giới hạn 10% chỉ dùng cho bài tập; thực tế có thể biến động ngoài khoảng này.",
    marketRow: "{label} · {sign}{percent}% {period}",
    before: "Ban đầu: {amount}",
    after: "Sau đó: {amount}",
    change: "Chênh lệch: {amount}",
    changeLead: "Từ 10.000.000đ, thay đổi",
    changeMid: ". Nếu bán hết trong bài thử:",
    changeEnd: ".",
    nearTitle: "Tiền khóa học",
    nearLine: "Giỏ dễ rút có {amount}.",
    nearOk: "Đủ 3.000.000đ để không phải chờ bán tài sản đúng ngày đóng học phí.",
    nearShort:
      "Còn thiếu {amount} cho khóa học; nếu tài sản giảm giá, An có thể phải bán lúc bất lợi.",
    spreadTitle: "Chia phần đầu tư",
    spreadText:
      "Chia giữa trái phiếu và cổ phiếu giúp giảm phụ thuộc vào một nhóm trong bài này. Vẫn có thể lỗ; không có một tỷ lệ đúng cho mọi người.",
    closing:
      "Đây là lượt tập. Ví 10.000.000đ của An sẽ được cập nhật theo phương án bạn chọn trong câu chuyện tiếp theo, không trừ thêm kết quả ở đây.",
  },
  claims: {
    heroImage: `${MINI}/life-planner/month-calendar.png`,
    intro: "Chọn những thông tin cần xem trước khi trả lời lời mời đầu tư.",
    toolbar: "Đọc quảng cáo · chọn ba thông tin cần kiểm tra",
    pickCount: 3,
    ad: {
      image: `${BASE}/props/esg-claim-inspection.png`,
      eyebrow: "QUẢNG CÁO GIẢ LẬP",
      title: "“Đầu tư xanh, lợi nhuận chắc chắn!”",
      text: "Ứng dụng còn báo “mua ngay để lên hạng”. Người giới thiệu nhận hoa hồng nếu bạn tham gia.",
    },
    question: "Bạn sẽ tìm hiểu ba thông tin nào?",
    instruction:
      "An muốn biết lời mời có đáng cân nhắc không. Chọn ba thông tin giúp kiểm tra rủi ro và lời quảng cáo, rồi nộp để xem giải thích.",
    checks: [
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
    ],
    chosen: " · Bạn đã chọn",
    notChosen: " · Bạn không chọn",
    selected: "Đã chọn",
    select: "Chọn thẻ",
    submit: "Nộp ba điều muốn kiểm tra",
    submitted: "Đã kiểm tra quảng cáo",
  },
  planner: {
    heroImage: `${MINI}/life-planner/month-calendar.png`,
    intro: "Giúp An để dành tiền học cho năm sau mà vẫn đủ tiền sinh hoạt.",
    toolbar: "Tình huống {n}/{total} · Cân lại ngân sách",
    step: 100000,
    goal: {
      amount: 7200000,
      label: "Quỹ học tập cho năm sau",
      description:
        "Dành cho sách, dụng cụ và các lớp học trong năm sau. Khoản này khác với 3.000.000đ học phí đã tính ở đầu chương.",
    },
    goalLine: "{label}: {amount}",
    goalIntro: "An muốn có số tiền này sau 12 tháng.",
    howto:
      "Mỗi tình huống bắt đầu với hai khoản ở 0đ để bạn tự chia. Hai khoản dùng chung số tiền còn sau chi bắt buộc. Tăng một khoản vượt phần còn trống thì khoản kia tự giảm. Giảm một khoản sẽ để lại tiền dự phòng.",
    monthsLabel: "Ba tình huống trong kế hoạch năm",
    // yearCount: số tháng loại này trong năm mẫu (10 bình thường, 1 ít việc, 1 ít việc + giá tăng).
    months: [
      {
        id: "normal",
        label: "Tháng bình thường",
        income: 3000000,
        essential: 2000000,
        description:
          "An muốn để dành 600.000đ, phần còn lại dùng cho đi chơi và mua sắm.",
        prompt:
          "Sau chi bắt buộc, An còn 1.000.000đ. Bạn muốn dành bao nhiêu cho quỹ học tập và bao nhiêu để đi chơi, mua sắm?",
        yearCount: 10,
        yearLabel: "Bình thường",
        reviewImage: `${MINI}/life-planner/income-envelope.png`,
      },
      {
        id: "low",
        label: "Tháng ít việc",
        income: 2600000,
        essential: 2000000,
        description:
          "Thu nhập giảm. An vẫn muốn giữ mức để dành 600.000đ nếu có thể.",
        prompt:
          "An nhận ít việc hơn, thu nhập giảm 400.000đ. Với 600.000đ còn lại sau chi bắt buộc, bạn sẽ chia hai khoản thế nào?",
        yearCount: 1,
        yearLabel: "Ít việc",
        reviewImage: `${MINI}/life-planner/price-change.png`,
      },
      {
        id: "prices",
        label: "Ít việc, giá lại tăng",
        income: 2600000,
        essential: 2200000,
        description:
          "Chi phí thiết yếu tăng 200.000đ. Chưa có nguồn thu thêm nào được xác nhận.",
        prompt:
          "Thu nhập vẫn thấp, tiền ăn ở và đi lại tăng thêm 200.000đ. Lần này chỉ còn 400.000đ để chia. Bạn muốn dành bao nhiêu cho mỗi khoản?",
        yearCount: 1,
        yearLabel: "Ít việc, giá tăng",
        reviewImage: `${MINI}/life-planner/price-change.png`,
      },
    ],
    incomeLabel: "Thu nhập dự kiến",
    essentialLabel: "Chi bắt buộc",
    remainingLabel: "Còn sau chi bắt buộc",
    essentialNote:
      "Chi bắt buộc gồm tiền ăn ở, đi lại và 300.000đ trả góp cũ. Tổng ở trên đã tính cả khoản trả góp, không cộng thêm lần nữa.",
    goalBox: {
      image: `${MINI}/life-planner/course-goal.png`,
      title: "Bỏ vào quỹ học tập",
      counter: "Tiền để dành",
    },
    flexibleBox: {
      image: `${MINI}/life-planner/flexible-expenses.png`,
      title: "Đi chơi, mua sắm",
      counter: "Chi linh hoạt",
    },
    balanceShort: "Ngân sách đang thiếu",
    balanceExact: "Đã chia vừa số tiền còn lại",
    balanceSpare: "Còn giữ dự phòng",
    balanceFormula:
      "Tiền còn sau chi bắt buộc − tiền cho quỹ học tập − tiền đi chơi, mua sắm = {amount}.",
    submitMonth: "Chốt ngân sách tháng này",
    monthSubmitted: "Đã chốt tháng này",
    nextMonth: "Thử tháng tiếp theo →",
    feedback: {
      summary:
        "Sau chi bắt buộc, bạn có {available}. Bạn dành {goal} cho quỹ học tập và {flexible} cho đi chơi, mua sắm.",
      sum: "{goal} + {flexible} = {total}. {balance}",
      over: "Vượt ngân sách {amount}.",
      exact: "Hai khoản vừa đủ ngân sách, không bị thiếu tiền.",
      spare: "Còn {amount} giữ dự phòng.",
      noGoal:
        "Bạn chưa dành tiền cho quỹ học tập trong tình huống này, nên chưa đạt yêu cầu vừa cân ngân sách vừa tích lũy cho mục tiêu. Khoản chưa chia vẫn là tiền dự phòng, chưa được tính vào quỹ học tập.",
      withGoal:
        "Để đạt yêu cầu, hai khoản không vượt tiền đang có và có tiền đưa vào quỹ học tập. Không bắt buộc một mức để dành cụ thể; bảng cuối dùng mức bạn chọn để tính thời gian đạt mục tiêu.",
    },
    year: {
      title: "Bản kế hoạch 12 tháng của bạn",
      intro:
        "Lịch thử gồm 10 tháng bình thường, một tháng ít việc và một tháng ít việc kèm tăng giá. Mỗi ô dùng mức để dành bạn vừa chọn; không đoán trước tháng nào thực tế sẽ khó.",
      goalLabel: "Mục tiêu: {amount}",
      progressLabel: "Quỹ học tập dự kiến cuối năm",
      projected: "Dự kiến: {amount}",
      infeasibleTitle: "Bản kế hoạch chưa đủ điều kiện để thực hiện.",
      infeasibleOverspent:
        "Có tháng chi quá thu nhập, nên tổng để dành trên giấy chưa có đủ tiền để làm theo.",
      infeasibleNoSaving:
        "Chưa có mức để dành đều đặn để tính ngày đủ quỹ học tập.",
      infeasibleEnd:
        "Khi xem lại, cần cân lại khoản chi hoặc xác định nguồn tiền và thời hạn phù hợp.",
      shortfallLead: "Cuối tháng 12, quỹ còn thiếu",
      shortfallMid:
        ". Nếu sau đó mỗi tháng để dành {perMonth}, cần thêm khoảng",
      shortfallMonths: "{months} tháng",
      shortfallEnd:
        ". Bạn có thể ghi lại thời hạn mới, thay vì lấy lợi nhuận đầu tư chưa có để bù vào.",
      enough:
        "Với các giả định này, bạn có thể đủ tiền cho quỹ học tập trong 12 tháng. Hãy kiểm tra lại mỗi tháng bằng số tiền thực nhận và đã chi.",
      detailsSummary: "Xem mức để dành của từng tháng",
      monthLabel: "Tháng {n}",
      closing:
        "Đây là tiền dự kiến để dành từ công việc, chưa được cộng vào ví. Khoản học phí 3.000.000đ ở đầu chương không dùng để bù cho bảng này.",
    },
    review: {
      incomeLabel: "Thu nhập / chi bắt buộc",
      goalLabel: "Bạn dành cho học tập",
      flexibleLabel: "Bạn dành cho đi chơi, mua sắm",
      missingLabel: "Chưa có tiền bù",
      spareLabel: "Tiền giữ dự phòng",
      sharedLabel: "Theo số tiền bạn vừa chọn",
      goalLine:
        "Mục tiêu học tập: {goal}. Theo lịch thử, bạn dự kiến để dành {year} trong năm.",
      infeasible:
        "Kế hoạch còn phần chưa thực hiện được. Cần cân lại khoản chi hoặc mức để dành trước khi dùng tổng dự kiến.",
      shortfall:
        "Còn thiếu {shortfall}. Nếu sau đó để dành {perMonth}/tháng thì cần thêm khoảng {months} tháng.",
      enough:
        "Theo các giả định này, tiền dự kiến đủ mục tiêu trong 12 tháng. Hãy kiểm tra lại bằng thu chi thực tế mỗi tháng.",
    },
    // Cờ chương bật khi xong màn kế hoạch, giá trị lấy từ bảng dự kiến năm.
    projectionFlags: {
      feasible: "plan_draft_feasible",
      yearSavings: "plan_year_savings",
    },
  },
};

export const chapter8V2GameData = {
  id: "CH08_V2",
  version: "1.1",
  title: "Tiền sinh tiền và kế hoạch 18 tuổi",
  initialMoney: 10000000,
  initialStats: { SAVING: 50, HAPPINESS: 50, RISK: 30, GOAL: 50 },
  metadata: {
    chapterId: "CH08",
    age: 18,
    persistProgress: true,
    preserveFirstChoiceStats: true,
    lockDecisions: true,
    goalDescription:
      "Giữ tiền cho khóa học, hiểu rủi ro đầu tư và lập kế hoạch có thể điều chỉnh.",
    coreKnowledgeUnits: ["D05.04", "D05.05", "D05.08", "D08.06"],
    allKnowledgeUnits: knowledge,
  },
  scenes: [
    art(1, "sc01-near-and-long-term-goals", "CH08_OPEN_1"),
    ...lines(
      "CH08_OPEN",
      1,
      [
        [
          "MINH",
          "inviting",
          "Mười triệu trên màn hình kìa! Nếu đây là tiền thật thì tớ đã nghĩ ra cả danh sách muốn mua rồi.",
        ],
        [
          "AN",
          "neutral",
          "Tớ thì đang nhìn dòng học phí này. Ba tháng nữa cần ba triệu, vậy mình chỉ có bảy triệu chưa cần dùng ngay.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Hôm nay hai em thử quản lý tiền ở tuổi 18 nhé. Mọi số tiền và tài sản trên màn hình đều là mô phỏng, không mở tài khoản hay mua gì thật.",
        ],
        [
          "AN",
          "thinking",
          "Thưa cô, vậy trước khi chọn đầu tư vào đâu, em cần biết lúc nào sẽ dùng đến tiền đúng không ạ?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng rồi. Nếu một khoản cần sau ba tháng, em phải nghĩ đến việc lấy tiền ra đúng lúc, kể cả khi thị trường đang giảm.",
        ],
        [
          "MINH",
          "neutral",
          "Còn bảy triệu chưa cần ngay thì sao ạ? Làm thế nào để biết nên để trong bao lâu, thưa cô?",
        ],
        [
          "AN",
          "neutral",
          "Em chưa có mục tiêu cụ thể cho bảy triệu đó. Chắc em cần nghĩ rõ trước khi mua thứ khó bán lại ạ.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Đúng rồi. Hai em hãy ghi mục tiêu và ngày cần tiền trước. Có khoản cần vài tháng nữa, có khoản có thể để vài năm.",
        ],
        [
          "MINH",
          "neutral",
          "Em hay thấy người ta nói tiền sinh tiền. Có phải cứ đầu tư thì sau một thời gian tiền tự tăng không cô?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Không chắc đâu. Đầu tư là chấp nhận rủi ro để tìm cơ hội tăng giá trị hoặc nhận thu nhập. Có thể lãi, cũng có thể mất một phần tiền.",
        ],
        [
          "AN",
          "thinking",
          "Dạ, em hiểu là đầu tư có thể giúp tiền tăng lên, nhưng cũng có lúc tiền giảm đi ạ.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đúng rồi. Với tiền sắp dùng, khả năng rút và giữ được số tiền cần có thường quan trọng hơn việc mong lãi cao. Tài khoản tiết kiệm cũng cần xem kỳ hạn và điều kiện.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu mua cổ phiếu thì mình nhận tiền từ đâu hả cô? Mình chỉ đợi bán giá cao hơn ạ?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Có thể từ chênh lệch giá, hoặc cổ tức — phần công ty chia cho người sở hữu cổ phiếu. Nhưng không chắc giá sẽ tăng hay công ty sẽ chia cổ tức.",
        ],
        [
          "AN",
          "thinking",
          "Thưa cô, nếu bán cao hơn giá mua thì mình còn phải trừ phí nữa đúng không ạ?",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đúng. Chẳng hạn em nhận 100.000đ cổ tức, bán được cao hơn giá mua 200.000đ và trả 50.000đ phí. Khi đó tiền lãi sau phí là 250.000đ, nếu không có khoản thuế hay chi phí nào khác.",
        ],
        [
          "MINH",
          "neutral",
          "Em hiểu rồi. Tiền nhận trong lúc giữ tài sản và tiền chênh khi bán là hai phần khác nhau.",
        ],
        [
          "AN",
          "neutral",
          "Mình xem từng loại trước đi. Tớ muốn hiểu trái phiếu và quỹ là gì, chứ không chỉ nhớ tên.",
        ],
      ],
      "CH08_ASSETS",
    ),
    inspect(
      "CH08_ASSETS",
      1,
      "Tiền của An có thể đặt ở đâu?",
      assetCards,
      "CH08_ASSET_TALK_1",
      assetShared,
    ),
    ...lines(
      "CH08_ASSET_TALK",
      1,
      [
        [
          "MINH",
          "neutral",
          "Cổ phiếu là có một phần công ty. Trái phiếu thì là cho bên phát hành vay, không phải hai tên cho cùng một thứ.",
        ],
        [
          "AN",
          "thinking",
          "Đúng rồi, cậu đang cho bên phát hành vay tiền. Nhưng phải đọc xem họ trả lãi và trả gốc thế nào, chứ không phải cứ mua trái phiếu là yên tâm.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng. Tên gọi chỉ giúp nhận biết bước đầu. Mức rủi ro còn tùy tổ chức phát hành, tài sản và điều kiện cụ thể.",
        ],
        [
          "MINH",
          "neutral",
          "Quỹ có nhiều tài sản rồi thì không thể lỗ nữa nhỉ?",
        ],
        [
          "AN",
          "thinking",
          "Vẫn có thể lỗ chứ. Nếu những thứ quỹ mua đều giảm giá thì phần tiền mình góp cũng giảm. Phải xem quỹ đang mua những gì nữa.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Chia tiền ra giúp giảm phụ thuộc vào một khoản, chứ không xóa hết rủi ro. Mua nhiều thứ giống nhau cũng chưa chắc đã đa dạng.",
        ],
        [
          "MINH",
          "neutral",
          "Bất động sản còn mất thời gian để bán. Nếu cần tiền học gấp thì đâu thể chắc có người mua ngay.",
        ],
        [
          "AN",
          "neutral",
          "Vậy ba triệu tiền học cần một chỗ mà tớ lấy được đúng hẹn. Chuyện phần còn lại tăng hay giảm phải tính riêng.",
        ],
      ],
      "CH08_SC02_ART",
    ),
    art(2, "sc02-building-allocation", "CH08_ALLOCATE_INTRO_1"),
    ...lines(
      "CH08_ALLOCATE_INTRO",
      2,
      [
        [
          "MINH",
          "inviting",
          "Bảng này có một trăm điểm. Nhìn như chia quân vào ba giỏ ấy.",
        ],
        [
          "AN",
          "neutral",
          "Ừ, mỗi điểm là một trăm nghìn. Một trăm điểm là mười triệu mình đang có, chứ không phải điểm thưởng thêm.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Hai em thử tự chia trước. Mỗi lần thêm mười điểm là chuyển một triệu vào giỏ đó. Chưa chốt thì có thể lấy ra để đổi.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu tớ thích một công ty thì để gần hết vào cổ phiếu của nó có được không?",
        ],
        [
          "AN",
          "thinking",
          "Nếu giá cổ phiếu công ty đó giảm thì phần lớn tiền cũng giảm theo. Tớ còn đang nghĩ đến tiền học sắp phải đóng nữa.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Trong lượt này, các cách chia dùng chung một kết quả thị trường để mình so sánh. Sang lượt chơi mới, mức tăng giảm có thể khác nhé.",
        ],
        [
          "MINH",
          "neutral",
          "Thưa cô, nếu một bạn chọn khác nhưng lại lãi nhiều hơn thì có được coi là hiểu bài hơn không ạ?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Không. Mình xem em có giữ đủ tiền cho ngày cần dùng và hiểu việc tập trung vào một tài sản không. Lãi một lần chưa chứng minh quyết định phù hợp.",
        ],
        [
          "AN",
          "neutral",
          "Tớ sẽ chia theo mục tiêu trước. Sau đó xem giỏ của mình chịu biến động ra sao.",
        ],
      ],
      "CH08_GAME_PORTFOLIO",
    ),
    scene("CH08_GAME_PORTFOLIO", 2, "minigame", {
      title: "Chia giỏ tiền",
      game: {
        id: "PORTFOLIO_CH08",
        title: "Chia giỏ tiền",
        kind: "FUTURE_PLAN",
        config: { mode: "portfolio", ...futurePlanConfig },
        reference: {
          buttonText: "Thông tin tài sản",
          cards: assetCards,
          shared: assetShared,
        },
      },
      nextSceneId: "CH08_AFTER_PORTFOLIO_1",
    }),
    ...lines(
      "CH08_AFTER_PORTFOLIO",
      2,
      [
        [
          "MINH",
          "neutral",
          "Mỗi giỏ đã có kết quả rồi. Tớ muốn xem phần nào tăng, phần nào giảm và tổng tiền còn bao nhiêu.",
        ],
        [
          "AN",
          "thinking",
          "Vậy sang lượt chơi mới, mức tăng giảm có thể khác, phải không cô?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng rồi. Bài tập chọn riêng một mức từ giảm 10% đến tăng 10% cho mỗi nhóm. Hai nhóm có thể cùng tăng hoặc cùng giảm. Đây là giới hạn của bài học, không phải mức biến động tối đa ngoài thực tế.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu giữ tiền dễ rút thì phần đó không tăng trong lượt này. Tớ thấy hơi tiếc.",
        ],
        [
          "AN",
          "neutral",
          "Tớ thấy tiền học cần lấy được đúng hẹn. Nếu dùng phần đó mua cổ phiếu thì có thể phải bán khi giá chưa thuận lợi.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Mỗi khoản tiền có việc riêng của nó. Phần cần dùng sớm và phần có thể để lâu không nhất thiết phải chọn cùng một cách.",
        ],
        [
          "AN",
          "thinking",
          "Vừa rồi là lượt tập. Giờ tớ muốn chọn một cách chia để theo dõi đến cuối buổi học.",
        ],
        [
          "MINH",
          "neutral",
          "Mình chuyển sang chọn phương án cho lượt tiếp theo nhé.",
        ],
      ],
      "CH08_ALLOCATION_CARDS",
    ),
    // Keep the position for existing checkpoints; this is a normal line, with no inspect.
    scene("CH08_ALLOCATION_CARDS", 2, "dialogue", {
      speaker: "Minh",
      speakerId: "MINH",
      title: "Chọn cách chia tiền",
      text: "Có hai cách chia ở ngay bên dưới. Cậu muốn dùng cách nào cho lượt tiếp theo?",
      characters: [
        {
          id: "MINH",
          expression: "neutral",
          src: sprite("MINH", "neutral"),
          position: "center",
        },
      ],
      nextSceneId: "CH08_SC02",
    }),
    choose(
      "CH08_SC02",
      2,
      "An muốn dùng cách chia nào cho lượt mô phỏng tiếp theo?",
      [
        {
          id: "CH08_SC02_A",
          label:
            "Chia 3 triệu tiền dễ rút, 4 triệu trái phiếu và 3 triệu cổ phiếu.",
          deltaStats: { RISK: -6, GOAL: 3 },
          evidenceScores: evidence(),
          setFlags: { portfolio_fit: true, portfolio_concentrated: false },
          nextSceneId: "CH08_FIT_1",
        },
        {
          id: "CH08_SC02_B",
          label: "Để 1 triệu ở giỏ dễ rút, phần còn lại vào cổ phiếu.",
          deltaStats: { RISK: 12 },
          evidenceScores: evidence(0, 0, 0),
          setFlags: { portfolio_fit: false, portfolio_concentrated: true },
          nextSceneId: "CH08_CONCENTRATED_1",
        },
      ],
      "CH08_ALLOCATION",
    ),
    ...lines(
      "CH08_FIT",
      2,
      [
        [
          "AN",
          "neutral",
          "Ba triệu cho khóa học nằm ở phần dễ rút. Phần đầu tư còn lại được chia giữa hai nhóm.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu cổ phiếu tăng mạnh thì mình không được nhiều bằng cách dồn hết vào đó.",
        ],
        [
          "AN",
          "thinking",
          "Ừ. Nhưng tớ không muốn ngày đóng học phụ thuộc vào việc cổ phiếu có tăng hay không.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Em đã nói rõ điều mình ưu tiên. Giờ xem phương án này thay đổi thế nào trong cùng một tình huống nhé.",
        ],
      ],
      "CH08_SC03_ART",
    ),
    ...lines(
      "CH08_CONCENTRATED",
      2,
      [
        [
          "AN",
          "neutral",
          "Tớ để chín triệu vào cổ phiếu. Nếu tăng thì số tăng sẽ rõ hơn.",
        ],
        [
          "MINH",
          "neutral",
          "Còn tiền dễ rút chỉ một triệu, thiếu hai triệu so với tiền khóa học.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng. Hai triệu đó đang phụ thuộc việc bán cổ phiếu. Nếu giá giảm đúng lúc cần học phí, em sẽ phải tính lại.",
        ],
        [
          "AN",
          "worried-money",
          "Dạ, em sẽ nhìn cả phần tiền học khi xem kết quả, chứ không chỉ nhìn xem cổ phiếu lãi hay lỗ bao nhiêu.",
        ],
      ],
      "CH08_SC03_ART",
    ),
    art(3, "sc03-reviewing-market-and-promises", "CH08_MARKET_INTRO_1"),
    ...lines(
      "CH08_MARKET_INTRO",
      3,
      [
        [
          "MINH",
          "neutral",
          "Mình dùng lại đúng kết quả thị trường của lượt tập, chỉ đổi sang cách chia cậu vừa chọn để tính tiền thu về.",
        ],
        [
          "AN",
          "thinking",
          "Thưa cô, con số giá trị trên màn hình đã là tiền em nhận được chưa ạ?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Chưa, khi chưa bán thì giá vẫn có thể đổi. Ở bước này, mình giả sử bán hết để kết thúc bài mô phỏng; bảng tiếp theo cho biết tiền thực thu theo giá đã đặt ra.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy em sẽ xem số tiền thu về theo phương án vừa chọn, rồi so với mười triệu lúc đầu ạ.",
        ],
      ],
      "CH08_MARKET_ROUTE",
    ),
    scene("CH08_MARKET_ROUTE", 3, "conditional", {
      condition: { expression: "flags.portfolio_fit" },
      ifTrueSceneId: "CH08_SETTLE_FIT",
      ifFalseSceneId: "CH08_SETTLE_CONCENTRATED",
    }),
    scene("CH08_SETTLE_FIT", 3, "dialogue", {
      speaker: "An",
      speakerId: "AN",
      title: "Kết quả sau ba tháng",
      text: "Em xem số tiền thu về theo cách chia vừa chọn ạ.",
      characters: [
        {
          id: "AN",
          expression: "thinking",
          src: sprite("AN", "thinking"),
          position: "center",
        },
      ],
      marketSettlement: true,
      nextSceneId: "CH08_PROMISE_1",
    }),
    scene("CH08_SETTLE_CONCENTRATED", 3, "dialogue", {
      speaker: "An",
      speakerId: "AN",
      title: "Kết quả sau ba tháng",
      text: "Em xem số tiền thu về theo cách chia vừa chọn ạ.",
      characters: [
        {
          id: "AN",
          expression: "thinking",
          src: sprite("AN", "thinking"),
          position: "center",
        },
      ],
      marketSettlement: true,
      nextSceneId: "CH08_PROMISE_1",
    }),
    ...lines(
      "CH08_PROMISE",
      3,
      [
        [
          "AN",
          "worried-money",
          "Tớ đang nhìn số tiền sau khi kết thúc lượt đầu tư. Thấy giá đổi rồi mới hiểu cảm giác muốn thử tiếp.",
        ],
        [
          "MINH",
          "inviting",
          "Ứng dụng bên cạnh đang có thứ tăng mạnh kìa. Hay mình thử thêm một lượt?",
        ],
        [
          "CO_LINH",
          "neutral",
          "Khoan đã. Hai em đang nghĩ đến mục tiêu, hay chỉ đang bị kết quả vừa rồi cuốn theo?",
        ],
        [
          "AN",
          "thinking",
          "Dạ, em đang muốn thử tiếp. Nhưng em còn chưa biết tài sản bên kia là gì.",
        ],
        [
          "MINH",
          "neutral",
          "Nó còn có bảng xếp hạng và thông báo “mua ngay để không tụt hạng”. Nhìn như sắp bỏ lỡ một phần thưởng.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Cảm giác sợ bỏ lỡ thường được gọi là FOMO. Bảng xếp hạng và thông báo có thể khiến mình giao dịch nhiều hơn điều đã dự tính.",
        ],
        [
          "AN",
          "thinking",
          "Vậy dù nhiều người đang mua, em vẫn phải xem có hợp với lúc mình cần tiền không ạ.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đó là lúc dễ chạy theo đám đông. Vài lần đoán đúng còn có thể khiến mình tự tin rằng lần nào cũng sẽ đúng.",
        ],
        [
          "MINH",
          "neutral",
          "Thưa cô, tài sản mã hóa là gì ạ? Nó có giống tiền trong ứng dụng ngân hàng không?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đó là một loại tài sản số, không phải số dư tiền gửi ngân hàng. Giá có thể đổi rất mạnh; ngoài giá, còn có rủi ro mất quyền truy cập hoặc gặp nơi giao dịch không đáng tin.",
        ],
        [
          "AN",
          "neutral",
          "Vậy một bảng giá tăng và nhiều người khoe lãi chưa cho em biết có thể mất bao nhiêu.",
        ],
        [
          "MINH",
          "neutral",
          "Có thẻ khác ghi “đầu tư xanh, lợi nhuận chắc chắn”. Nhìn chiếc lá dễ có cảm giác an tâm hơn.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Chữ xanh chưa phải bằng chứng. ESG nói đến môi trường, xã hội và cách quản trị; mình cần xem họ đo điều gì, số liệu ở đâu.",
        ],
        [
          "AN",
          "thinking",
          "Thưa cô, nếu họ chỉ đưa hình cây xanh mà không có số liệu thì em chưa biết họ đã làm được gì cho môi trường, đúng không ạ?",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đúng. Dùng lời quảng cáo bền vững mà thiếu căn cứ thường được gọi là tô xanh. Dù có tác động tốt thật, vẫn phải xem rủi ro và chi phí đầu tư.",
        ],
        [
          "MINH",
          "neutral",
          "Cậu nhìn dòng chữ nhỏ này: người giới thiệu sẽ được trả hoa hồng khi mình tham gia.",
        ],
        [
          "AN",
          "neutral",
          "Ừ, tớ muốn biết họ được trả bao nhiêu và tài liệu có nói khác lời quảng cáo không. Mình xem kỹ đã.",
        ],
      ],
      "CH08_AD_INSPECT",
    ),
    inspect(
      "CH08_AD_INSPECT",
      3,
      "Đọc kỹ lời quảng cáo",
      [
        {
          id: "app",
          label: "Ứng dụng đang thúc mua",
          image: `${BASE}/props/crypto-app.png`,
          facts: [
            ["Thông báo", "“Mua ngay để lên hạng, đừng bỏ lỡ lượt tăng!”"],
            [
              "Điều chưa biết",
              "Khả năng mất tiền, chi phí giao dịch và điều kiện bán hoặc rút",
            ],
            [
              "Cần nhớ",
              "Bảng xếp hạng và giá đã tăng không bảo đảm kết quả lần tới",
            ],
          ],
        },
        {
          id: "green",
          label: "Lời hứa “xanh”",
          image: `${BASE}/props/esg-claim-inspection.png`,
          facts: [
            ["Quảng cáo", "“Đầu tư xanh, lợi nhuận chắc chắn”"],
            [
              "Bằng chứng đang thiếu",
              "Báo cáo tác động, số liệu và cách đo có thể kiểm tra",
            ],
            ["Người giới thiệu", "Nhận hoa hồng khi có người tham gia"],
            [
              "Cần xem thêm",
              "Tài liệu sản phẩm và đánh giá từ nơi không được trả tiền cho lời giới thiệu đó",
            ],
          ],
        },
      ],
      "CH08_GAME_CLAIMS",
      {
        label: "Không mua gì ở màn này",
        items: [
          "Quảng cáo chỉ là tình huống giả lập. Lựa chọn tiếp theo ghi lại cách An phản ứng, không tạo thêm giao dịch hoặc khoản lỗ ngẫu nhiên.",
        ],
      },
    ),
    scene("CH08_GAME_CLAIMS", 3, "minigame", {
      title: "Tìm hiểu lời mời đầu tư",
      game: {
        id: "CLAIM_REVIEW_CH08",
        title: "Tìm hiểu lời mời đầu tư",
        kind: "FUTURE_PLAN",
        config: { mode: "claims", ...futurePlanConfig },
      },
      nextSceneId: "CH08_SC03",
    }),
    choose(
      "CH08_SC03",
      3,
      "Sau lượt mô phỏng và lời mời đầu tư mới, An muốn làm gì?",
      [
        {
          id: "CH08_SC03_A",
          label: "Để lời mời lại, dành thời gian tìm hiểu thêm.",
          deltaStats: { RISK: -1, GOAL: 1 },
          evidenceScores: evidence(2, 1, 2),
          setFlags: { claims_checked: true, fomo: false },
          nextSceneId: "CH08_CHECKED_1",
        },
        {
          id: "CH08_SC03_B",
          label: "Thử theo tài sản đang đứng đầu bảng.",
          deltaStats: { HAPPINESS: 3, RISK: 3, GOAL: -5 },
          evidenceScores: evidence(0, 0, 0),
          setFlags: { claims_checked: false, fomo: true },
          nextSceneId: "CH08_FOMO_1",
        },
      ],
      "CH08_CLAIMS",
    ),
    ...lines(
      "CH08_CHECKED",
      3,
      [
        [
          "AN",
          "neutral",
          "Em chưa thấy bằng chứng cho lời hứa chắc chắn có lãi. Em muốn xem tài liệu và hỏi thêm trước.",
        ],
        [
          "MINH",
          "neutral",
          "Ừ, mình cứ đọc kỹ đã. Chưa có thông tin thì tớ cũng chưa biết nên tin lời quảng cáo đến đâu.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Em có thể chờ để tìm hiểu thêm. Kết quả vừa rồi không buộc em phải mua thứ khác ngay lập tức.",
        ],
      ],
      "CH08_SC04_ART",
    ),
    ...lines(
      "CH08_FOMO",
      3,
      [
        [
          "AN",
          "neutral",
          "Em chọn theo thứ đứng đầu bảng vì muốn tiếp tục thử vận may. Nhưng em vẫn chưa đọc đủ thông tin ạ.",
        ],
        [
          "MINH",
          "neutral",
          "Nhưng mình vẫn chưa biết rủi ro và khi nào lấy tiền ra được.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Điều còn thiếu là lý do để tin tài sản đó hợp với mục tiêu của em. Mình xem phần chưa biết trước, đừng vội quyết chỉ vì đang hào hứng hoặc sốt ruột nhé.",
        ],
        [
          "AN",
          "thinking",
          "Dạ, em sẽ ghi lại những điều mình chưa biết. Em không muốn vì đã chọn rồi mà bỏ qua chúng.",
        ],
      ],
      "CH08_SC04_ART",
    ),
    art(4, "sc04-adjusting-twelve-month-plan", "CH08_PLAN_INTRO_1"),
    ...lines(
      "CH08_PLAN_INTRO",
      4,
      [
        [
          "MINH",
          "neutral",
          "Thưa cô, sang phần kế hoạch năm thì mình dùng số tiền vừa còn lại để chi từng tháng phải không ạ?",
        ],
        [
          "CO_LINH",
          "neutral",
          "Phần này mình thử thu chi từ công việc làm thêm nhé. Tiền đầu tư vừa tính vẫn ở ví; không lấy khoản đó chia ra làm thu nhập hằng tháng.",
        ],
        [
          "AN",
          "thinking",
          "Em muốn có một quỹ học tập cho năm sau: tiền sách, dụng cụ và một vài lớp học. Mục tiêu là bảy triệu hai trăm nghìn trong mười hai tháng ạ.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy khoản này khác ba triệu cho khóa học sắp tới, đúng không cậu?",
        ],
        [
          "AN",
          "neutral",
          "Đúng rồi. Ba triệu là học phí cần sau ba tháng. Quỹ năm sau thì tớ muốn để dành dần từ tiền làm thêm.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Trong tình huống này, tháng bình thường An nhận ba triệu. Tiền ăn ở, đi lại và trả góp cũ hết hai triệu; trong đó đã có 300.000đ trả góp, không cộng lại lần nữa.",
        ],
        [
          "MINH",
          "neutral",
          "Muốn đủ bảy triệu hai sau một năm thì trung bình mỗi tháng cậu cần để dành sáu trăm nghìn.",
        ],
        [
          "AN",
          "thinking",
          "Ừ. Tớ định dành sáu trăm cho quỹ, còn bốn trăm để đi chơi và mua sắm.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đó là dự định khi công việc đều. Bây giờ mình thử xem chuyện gì xảy ra nếu có tháng ít việc hơn, rồi chi phí sinh hoạt lại tăng.",
        ],
        [
          "MINH",
          "neutral",
          "Với mỗi tình huống, mình tự chia lại tiền cho hai khoản hả cô?",
        ],
        [
          "AN",
          "thinking",
          "Tớ muốn thấy nếu giảm tiền bỏ vào quỹ thì cuối năm còn thiếu bao nhiêu, phải chờ thêm bao lâu.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng rồi. Mỗi tình huống bắt đầu từ 0 đồng ở cả hai khoản để các em tự chọn mức phù hợp. Khi chốt xong, bảng tổng hợp dùng chính các mức đã chọn để tính lại mục tiêu.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy có thể mỗi người chọn khác nhau, miễn biết số tiền của mình đi đâu và có đủ chi hay không.",
        ],
        [
          "AN",
          "neutral",
          "Dạ. Em sẽ thử cân hai khoản: tiền cho quỹ học tập và tiền đi chơi, mua sắm.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Hai em thử nhé. Chỉ dùng thu nhập đã cho trong tình huống, chưa tính lợi nhuận đầu tư vào số tiền có thể chi.",
        ],
      ],
      "CH08_GAME_PLANNER",
    ),
    scene("CH08_GAME_PLANNER", 4, "minigame", {
      title: "Bản kế hoạch của An",
      game: {
        id: "LIFE_PLAN_CH08",
        title: "Bản kế hoạch của An",
        kind: "FUTURE_PLAN",
        config: { mode: "planner", ...futurePlanConfig },
      },
      nextSceneId: "CH08_AFTER_PLAN_1",
    }),
    ...lines(
      "CH08_AFTER_PLAN",
      4,
      [
        [
          "AN",
          "thinking",
          "Thưa cô, bây giờ em thấy đổi một khoản chi thì số tiền quỹ học tập cuối năm cũng thay đổi theo ạ.",
        ],
        [
          "MINH",
          "neutral",
          "Và bảng có ghi cần thêm bao lâu nếu cuối năm vẫn chưa đủ. Đỡ hơn là cứ giữ ngày cũ mà không biết tiền đâu ra.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng rồi. Trước khi dùng bản kế hoạch, em xem còn tháng nào chi quá thu nhập không. Nếu còn thì tổng để dành trên giấy chưa thực hiện được.",
        ],
        [
          "AN",
          "neutral",
          "Cậu xem lại bảng của tớ nhé. Tớ muốn nhìn từng khoản mình vừa chọn, không chỉ nhìn tổng cuối cùng.",
        ],
        [
          "MINH",
          "neutral",
          "Ừ, có thể giữ mức để dành hoặc giữ một phần đi chơi, nhưng nếu thu nhập không đủ thì mình phải đổi một trong hai.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Khi thu nhập thực tế thay đổi, hai em lại tính tiếp. Không cần chờ hết năm mới sửa, cũng không nên coi khoản lãi chưa có là tiền chắc chắn nhận.",
        ],
        [
          "AN",
          "thinking",
          "Dạ, cuối mỗi tháng em sẽ ghi tiền thực nhận và đã chi, rồi cập nhật phần còn lại của năm ạ.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ sẽ đặt nhắc lịch. Giờ cậu mở lại bản kế hoạch trước khi chọn cách tiếp tục nhé.",
        ],
      ],
      "CH08_PLAN_CARDS",
    ),
    inspect(
      "CH08_PLAN_CARDS",
      4,
      "Bản kế hoạch vừa lập",
      [],
      "CH08_SC04",
      null,
      { planResultFrom: "CH08_GAME_PLANNER" },
    ),
    choose(
      "CH08_SC04",
      4,
      "An muốn ghi cách xử lý tháng khó vào kế hoạch thế nào?",
      [
        {
          id: "CH08_SC04_A",
          label: "Dùng bản vừa lập và hẹn cuối tháng xem lại.",
          deltaStats: { SAVING: 6, GOAL: 6 },
          evidenceScores: evidence(),
          setFlags: {
            plan_adopted: true,
            life_plan_feasible: false,
            life_plan_unverified: false,
          },
          nextSceneId: "CH08_PLAN_ROUTE",
        },
        {
          id: "CH08_SC04_B",
          label: "Tiếp tục để dành 600.000đ và chi thêm 400.000đ mỗi tháng.",
          deltaStats: { RISK: 4, GOAL: -5 },
          evidenceScores: evidence(0, 0, 0),
          setFlags: { life_plan_feasible: false, life_plan_unverified: true },
          nextSceneId: "CH08_UNVERIFIED_1",
        },
      ],
      "CH08_PLAN",
    ),
    scene("CH08_PLAN_ROUTE", 4, "conditional", {
      condition: { expression: "flags.plan_draft_feasible" },
      ifTrueSceneId: "CH08_FEASIBLE_1",
      ifFalseSceneId: "CH08_DRAFT_GAP_1",
    }),
    ...lines(
      "CH08_DRAFT_GAP",
      4,
      [
        [
          "AN",
          "thinking",
          "Thưa cô, em muốn dùng bản vừa lập, nhưng bảng vẫn báo chưa thực hiện được ạ.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng rồi. Em xem lại chỗ ngân sách vượt thu nhập hoặc phần chưa dành tiền cho mục tiêu nhé. Mình cần có mức chi và mức để dành thực hiện được trước khi dựa vào tổng đã tính.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ sẽ ghi lại phần chưa cân được để cậu biết cần xem lại chỗ nào. Tổng trong bảng vẫn là dự tính, chưa phải tiền đã có.",
        ],
      ],
      "CH08_SC05_ART",
      { life_plan_feasible: false, life_plan_unverified: true },
    ),
    ...lines(
      "CH08_FEASIBLE",
      4,
      [
        [
          "AN",
          "neutral",
          "Thưa cô, em muốn dùng bản vừa lập. Các khoản chi trong bảng không vượt thu nhập, còn quỹ học tập thì em theo mức để dành và thời hạn đã tính ạ.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ sẽ ghi cả số còn thiếu và thời hạn dự kiến trong bảng. Như vậy lần xem lại mình biết phải so với con số nào.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Em nhớ rằng đó là dự tính theo các giả định vừa thử. Khi biết lịch làm và chi tiêu thực tế, mình cập nhật lại cả mức để dành lẫn ngày đạt mục tiêu nhé.",
        ],
        [
          "AN",
          "thinking",
          "Dạ, em sẽ bắt đầu dùng bản này và xem lại vào cuối tháng ạ.",
        ],
      ],
      "CH08_SC05_ART",
      { life_plan_feasible: true, life_plan_unverified: false },
    ),
    ...lines(
      "CH08_UNVERIFIED",
      4,
      [
        [
          "AN",
          "thinking",
          "Thưa cô, em muốn giữ dự định sáu trăm nghìn vào quỹ và bốn trăm nghìn chi tiêu thêm, rồi xem tháng tới thế nào ạ.",
        ],
        [
          "MINH",
          "neutral",
          "Tháng khó chỉ còn bốn trăm nghìn. Giữ sáu trăm để dành và bốn trăm đi chơi thì thiếu sáu trăm nghìn.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Như vậy ở tháng khó, bản kế hoạch còn thiếu tiền. Mình cần ghi rõ khoản chưa có nguồn bù; chưa thể coi đủ số tiền để dành như dự định.",
        ],
        [
          "AN",
          "worried-money",
          "Dạ, em hiểu là chưa thể hứa chắc sẽ đủ quỹ đúng hạn nếu vẫn giữ mức này ạ.",
        ],
      ],
      "CH08_SC05_ART",
    ),
    art(5, "sc05-explaining-personal-plan", "CH08_CLOSE_1"),
    ...lines(
      "CH08_CLOSE",
      5,
      [
        [
          "MINH",
          "neutral",
          "Đầu buổi tớ nghĩ bài này chỉ là tìm chỗ nào tăng tiền nhanh nhất. Giờ thấy phải trả lời nhiều câu trước đó.",
        ],
        [
          "AN",
          "thinking",
          "Tớ sẽ hỏi: tiền cần dùng khi nào, có thể giảm bao nhiêu và muốn lấy ra thì phải làm gì. Với quảng cáo thì còn phải biết ai đang giới thiệu nữa.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Hai em có thể giữ một tờ ghi những điều đó cạnh kế hoạch. Mỗi lần thay mục tiêu hay thu nhập thì xem lại.",
        ],
        [
          "MINH",
          "neutral",
          "Thưa cô, còn những việc xa hơn một năm, như học tiếp hay lúc không còn đi làm, thì mình bắt đầu chuẩn bị thế nào ạ?",
        ],
        [
          "CO_LINH",
          "neutral",
          "Trước hết là nhận ra mình có những nhu cầu dài hạn. Ví dụ hưu trí là giai đoạn thu nhập từ công việc có thể giảm hoặc dừng; chuẩn bị sớm giúp có thêm thời gian.",
        ],
        [
          "AN",
          "neutral",
          "Dạ, trước hết em ghi mục tiêu và thời gian cần tiền, rồi tìm hiểu dần cách chuẩn bị phù hợp ạ.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng. Cũng cần xem giá cả, lãi suất và hoàn cảnh của mình thay đổi thế nào. Một kế hoạch hợp hôm nay không tự hợp mãi.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy khi một tháng thu ít hơn dự kiến, em nên sửa bằng số thực nhận, chứ không tự thêm tiền lãi cho bảng đủ phải không cô?",
        ],
        [
          "AN",
          "thinking",
          "Còn tớ sẽ dành một buổi cuối tháng để xem lại. Tin quảng cáo tới giữa chừng thì cứ lưu đó, không cần quyết ngay.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Tuổi 18 không đòi em biết hết mọi sản phẩm. Điều quan trọng là biết mình cần gì, đọc điều kiện và tìm người giúp khi chưa rõ.",
        ],
        [
          "MINH",
          "neutral",
          "Tờ kế hoạch của tớ có cả cột “chưa biết”. Thế còn dễ hỏi hơn là cứ điền một số cho đủ.",
        ],
        [
          "AN",
          "relieved",
          "Ừ. Tiền có thể tăng hoặc giảm, nhưng mình luôn cần biết vì sao chọn và chuyện gì phải theo dõi tiếp.",
        ],
      ],
      "CH08_ENDING",
    ),
    scene("CH08_ENDING", 5, "ending", {
      title: "Kết thúc Chương 8 · Tiền sinh tiền và kế hoạch 18 tuổi",
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
          "miniGameNeedsPractice || flags.portfolio_concentrated || flags.fomo || flags.life_plan_unverified || RISK > 55 || SAVING < 40",
        storyText:
          "An còn việc cần xử lý: bảo vệ tiền học, tìm hiểu lời mời đầu tư hoặc cân lại tháng thiếu tiền. Kết quả tăng hoặc giảm của lượt đầu tư vẫn được ghi nhận. Bước tiếp theo là ghi rõ khoản cần dùng và sửa phần chưa có nguồn tiền, thay vì dựa vào kết quả đầu tư chưa biết.",
        characterSprite: sprite("AN", "thinking"),
      },
      {
        id: "A_GOAL_ACHIEVED",
        title: "Ending A: Goal Achieved",
        condition:
          "flags.portfolio_fit && flags.claims_checked && flags.life_plan_feasible && choicePercent >= 75 && learningScore >= 75 && miniGameCompleted && miniGameGoalEligible",
        storyText:
          "An giữ được tiền cho mục tiêu gần, hiểu giới hạn của việc chia tài sản và có cách điều chỉnh tháng khó. Kết quả học dựa trên cách quyết định và tính toán, không dựa vào việc đầu tư tình cờ có lãi hay lỗ.",
        characterSprite: sprite("AN", "relieved"),
      },
      {
        id: "B_BALANCED",
        title: "Ending B: Balanced",
        condition: "DEFAULT_FALLBACK",
        storyText:
          "An có phương án giữ tiền học và kế hoạch tháng có thể điều chỉnh. Một số phép tính hoặc cách kiểm tra quảng cáo còn cần luyện thêm. Có thể xem lại lời giải và tiếp tục dùng số thực tế để cập nhật kế hoạch.",
        characterSprite: sprite("AN", "neutral"),
      },
    ],
  },
  endingReport: {
    choiceGroupMaxima: { CH08_ALLOCATION: 6, CH08_CLAIMS: 5, CH08_PLAN: 6 },
    maxChoiceScore: 6,
    requiredGameIds: ["PORTFOLIO_CH08", "CLAIM_REVIEW_CH08", "LIFE_PLAN_CH08"],
    miniGameLabel: "Chia giỏ tiền, kiểm tra lời mời và lập kế hoạch",
    miniGameMax: 8,
    weights: { choices: 0.65, miniGame: 0.35, reflection: 0 },
    bands: [
      { min: 85, label: "Đã thể hiện vững" },
      { min: 60, label: "Đang hình thành" },
      { min: 0, label: "Cần luyện thêm" },
    ],
    achieved: [
      {
        when: "flags.portfolio_fit",
        text: "Đã giữ 3.000.000đ dễ dùng cho khóa học và chia phần đầu tư.",
      },
      {
        when: "flags.claims_checked",
        text: "Đã tìm hiểu rủi ro, bằng chứng quảng cáo và cách người giới thiệu được trả tiền.",
      },
      {
        when: "flags.life_plan_feasible",
        text: "Đã chọn dùng ngân sách vừa lập và đặt lịch xem lại mục tiêu học tập.",
      },
    ],
    practice: [
      {
        when: "miniGameNeedsPractice",
        text: "Bài thực hành còn nhiều câu chưa đúng. Xem lại tiền dành cho mục tiêu gần, thông tin cần kiểm tra và cách chia ngân sách để có tiền học.",
      },
      {
        when: "flags.portfolio_concentrated",
        text: "Cần giữ đủ khoản sắp dùng trước khi đưa tiền vào tài sản biến động.",
      },
      {
        when: "flags.fomo",
        text: "Đừng quyết theo cảm xúc hoặc bảng xếp hạng; cần kiểm tra rủi ro, phí và điều kiện rút trước khi đầu tư tiếp.",
      },
      {
        when: "flags.life_plan_unverified",
        text: "Tháng khó còn thiếu 600.000đ nếu giữ cả mức để dành và chi linh hoạt cũ; chưa có nguồn bù được xác nhận.",
      },
      {
        text: "Rà lại lời giải của bài tập và dùng thu chi thực tế để cập nhật dự tính mỗi tháng.",
      },
    ],
    nextStep:
      "Đặt lịch cuối tháng để ghi thu chi, kiểm tra tiền mục tiêu và tính lại thời gian. Thu nhập tương lai chưa được cộng vào ví.",
  },
};
