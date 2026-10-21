// FINTEEN_CH05_CODEX_SPEC.md. Projections never create Money events.
const BASE = "/images/finteen-v2/chapter-05";
const MINI = `${BASE}/asset-mini-game/compound-timeline`;
const backgrounds = [
  "bg09-banking-practice-room",
  "bg09b-provider-research-station",
  "bg09c-timeline-teaching-wall",
  "bg09d-plan-confirmation-counter",
];
const bg = (n) => `${BASE}/bg/${backgrounds[n - 1]}.png`;
const people = {
  AN: ["an", "An"],
  MINH: ["minh", "Minh"],
  CO_LINH: ["co-linh", "Cô Linh"],
  BANK_STAFF: ["bank-guide", "Nhân viên mô phỏng"],
};
const available = {
  AN: ["neutral", "thinking", "worried-money", "relieved"],
  MINH: ["neutral", "inviting"],
  CO_LINH: ["neutral", "explaining", "encouraging"],
  BANK_STAFF: ["neutral", "explaining"],
};
const sprite = (who, expression) =>
  `${BASE}/char/${people[who][0]}/${people[who][0]}-${available[who].includes(expression) ? expression : "neutral"}.png`;
const knowledge = (n) =>
  ({
    1: ["D04.04", "D07.07"],
    2: ["D07.07", "D08.01"],
    3: ["D04.05", "D04.06", "D04.07", "D08.06", "D08.08"],
    4: ["D04.04", "D04.05", "D04.06", "D08.06"],
  })[n];
const evidence = (I, C, P) => ({ I, C, P });
const none = evidence(0, 0, 0);
const fit = {
  account_fit: true,
  account_pending: false,
  account_mismatch: false,
};
const accountFlags = (code) => ({
  term_maturity: false,
  account_choice_A: code === "A",
  account_choice_B: code === "B",
  account_choice_C: code === "C",
  topup_source_verified: false,
});
const review = { label: "Xem lại dữ kiện", targetSceneId: "CH05_SC04_DATA" };
const card = (id, label, text, image) => ({
  id,
  label,
  text,
  ...(image ? { image } : {}),
});
const accountCards = [
  card(
    "A",
    "Tài khoản A · Rút linh hoạt",
    "Lãi đơn minh họa 3%/năm; phí quản lý 5.000đ/tháng; có thể rút khi cần. Tiền sử dụng được phải trừ phí phát sinh.",
    `${MINI}/flexible-account.png`,
  ),
  card(
    "B",
    "Tài khoản B · Kỳ hạn 12 tháng",
    "Lãi niêm yết 6%/năm khi đủ kỳ hạn theo giả định. Rút trước hạn áp dụng 2%/năm; không thu phí.",
    `${MINI}/term-account.png`,
  ),
];
const courseReference = card(
  "calendar",
  "Đối chiếu lịch đóng học phí",
  "An có 1.000.000đ và cần đóng 1.000.000đ học phí vào cuối tháng 3. Dùng mốc này để đối chiếu với điều kiện rút tiền của từng tài khoản.",
  `${BASE}/props/course-goal.png`,
);
const providerCards = [
  {
    ...card(
      "identity",
      "Đơn vị và giám sát",
      "",
      `${BASE}/props/provider-check-laptop.png`,
    ),
    sections: [
      {
        label: "Ai cung cấp A và B?",
        items: [
          "Ngân hàng thực hành FinTeen là đơn vị cung cấp hai tài khoản này.",
        ],
      },
      {
        label: "Kiểm tra ở đâu?",
        items: [
          "Hồ sơ sản phẩm có tên đơn vị, mã hồ sơ và nơi tra cứu thông tin về cơ quan giám sát. Đối chiếu các thông tin này với đúng sản phẩm bạn đang xem.",
        ],
      },
      {
        label: "Còn ứng dụng Minh giới thiệu?",
        items: [
          "Chưa thấy rõ tên đơn vị cung cấp và thông tin giám sát.",
          "Cần tìm thêm hồ sơ của ứng dụng đó; không dùng hồ sơ A/B để kết luận thay.",
        ],
      },
    ],
    note: "Biểu đồ đẹp hoặc lãi cao chưa cho biết ai chịu trách nhiệm về khoản tiền của bạn.",
  },
  {
    ...card("protection", "Phạm vi bảo vệ", ""),
    sections: [
      {
        label: "Khoản nào được bảo vệ?",
        items: [
          "Chỉ khoản tiền gửi đáp ứng các điều kiện ghi trong hồ sơ sản phẩm.",
        ],
      },
      {
        label: "Cần đọc những gì?",
        items: [
          "Loại tiền gửi được bảo vệ và mức giới hạn bảo vệ.",
          "Các trường hợp không được bảo vệ. Nếu chưa ghi rõ, cần hỏi thêm trước khi quyết định.",
        ],
      },
      {
        label: "Không áp dụng chung",
        items: [
          "Không phải mọi sản phẩm đầu tư đều được bảo vệ như tiền gửi.",
          "Hai sản phẩm nằm trên cùng một ứng dụng chưa chắc có cùng phạm vi bảo vệ.",
        ],
      },
    ],
    note: "Hãy kiểm tra phạm vi bảo vệ của từng sản phẩm, thay vì chỉ nhìn tên ứng dụng.",
  },
  {
    ...card("withdrawal", "Điều kiện rút", ""),
    sections: [
      {
        label: "Tài khoản A · Rút linh hoạt",
        items: [
          "Có thể rút tiền khi cần.",
          "Lãi suất: 3%/năm.",
          "Phí quản lý: 5.000đ mỗi tháng; phải trừ phí khi tính tiền có thể dùng.",
        ],
      },
      {
        label: "Tài khoản B · Kỳ hạn 12 tháng",
        items: [
          "Giữ đủ 12 tháng: lãi suất 6%/năm.",
          "Rút trước khi đủ 12 tháng: lãi suất 2%/năm, không dùng mức 6%.",
          "Không thu phí quản lý.",
        ],
      },
    ],
    note: "An cần đóng học phí cuối tháng 3. Hãy đối chiếu ngày cần tiền với thời điểm rút của từng tài khoản.",
  },
];
const art = (n, image, nextSceneId) => ({
  id: `CH05_SC0${n}_ART`,
  type: "scene",
  title: "Ngân hàng và lãi",
  background: `${BASE}/scene/${image}.png`,
  sceneArt: `${BASE}/scene/${image}.png`,
  characters: [],
  nextSceneId,
  knowledgeUnits: knowledge(n),
});
const dialogue = (id, n, who, expression, text, nextSceneId, extra = {}) => ({
  id,
  type: "dialogue",
  title: text,
  text,
  speaker: people[who][1],
  speakerId: who,
  background: bg(n),
  characters: [
    { id: who, expression, src: sprite(who, expression), position: "center" },
  ],
  nextSceneId,
  knowledgeUnits: knowledge(n),
  ...extra,
});
const lines = (prefix, n, script, next) =>
  script.map(([who, expression, text], i) =>
    dialogue(
      `${prefix}_${i + 1}`,
      n,
      who,
      expression,
      text,
      i < script.length - 1 ? `${prefix}_${i + 2}` : next,
    ),
  );
const choice = (id, n, title, options, extra = {}) => ({
  id,
  type: "choice",
  title,
  text: title,
  prompt: title,
  background: bg(n),
  characters: [],
  options,
  knowledgeUnits: knowledge(n),
  ...extra,
});
const inspected = (ids) => ({
  inspected: ids,
  lockedReason:
    "Hãy mở đủ các thẻ dữ kiện trước. Nút Xem lại dữ kiện ở bên dưới.",
});
const providerCheck = (id, next) => ({
  id,
  label: "Mở thông tin đơn vị cung cấp và điều kiện rút tiền.",
  requires: inspected(["ch05_accounts"]),
  deltaStats: { RISK: -1, GOAL: 1 },
  evidenceScores: evidence(2, 1, 2),
  setFlags: { provider_checked: true, provider_unchecked: false },
  nextSceneId: next,
});

export const chapter5V2GameData = {
  id: "CH05_V2",
  title: "Ngân hàng và lãi",
  version: "2.1",
  initialMoney: 1000000,
  initialStats: { SAVING: 50, HAPPINESS: 50, RISK: 30, GOAL: 50 },
  metadata: {
    chapterId: "CH05",
    goalDescription:
      "Có đủ tiền khóa học cuối tháng 3; hiểu phí, lãi và sức mua.",
    coreKnowledgeUnits: ["D04.04", "D04.05", "D04.06", "D07.07"],
    allKnowledgeUnits: [
      "D04.04",
      "D04.05",
      "D04.06",
      "D04.07",
      "D07.07",
      "D08.06",
      "D08.08",
      "D08.01",
    ],
    projectionOnly: true,
    lockDecisions: true,
  },
  scenes: [
    art(1, "sc01-two-accounts", "CH05_SC01_1"),
    ...lines(
      "CH05_SC01",
      1,
      [
        [
          "AN",
          "thinking",
          "Ba tháng nữa phải đóng một triệu tiền khóa học rồi. Để tiền không thôi thì hơi tiếc nhỉ?",
        ],
        [
          "MINH",
          "inviting",
          "Đúng lúc! Tớ vừa thấy chỗ này ghi lãi 6% một năm. Nghe cũng được đấy.",
        ],
        [
          "AN",
          "neutral",
          "Sáu phần trăm à? Nhưng mình đâu định để tiền tận một năm.",
        ],
        [
          "MINH",
          "neutral",
          "Thì cứ gửi trước đã. Đến lúc cần rút chắc cũng được mà?",
        ],
        [
          "BANK_STAFF",
          "neutral",
          "Hai tài khoản đều có thể rút tiền, nhưng cách tính lãi và phí không giống nhau đâu em.",
        ],
        ["AN", "thinking", "Vậy em xem điều kiện của từng loại được không ạ?"],
      ],
      "CH05_SC01_INSPECT",
    ),
    dialogue(
      "CH05_SC01_INSPECT",
      1,
      "BANK_STAFF",
      "explaining",
      "Được chứ. Em cứ đọc, phần nào chưa rõ thì hỏi anh.",
      "CH05_SC01_AFTER",
      {
        requiredInspections: ["ch05_accounts"],
        inspect: {
          id: "ch05_accounts",
          buttonText: "So sánh hai loại tài khoản",
          cards: accountCards,
          reference: courseReference,
          dataText:
            "Các tổ chức và điều kiện đều giả lập. Mở hai thẻ tài khoản để so sánh; lịch đóng học phí ở phần đối chiếu riêng bên dưới.",
          autoNextSceneOnClose: true,
        },
      },
    ),
    dialogue(
      "CH05_SC01_AFTER",
      1,
      "AN",
      "thinking",
      "Có vẻ nhìn mỗi con số phần trăm thì chưa đủ...",
      "CH05_SC02_ART",
    ),
    art(2, "sc02-investigating-provider", "CH05_SC02_1"),
    ...lines(
      "CH05_SC02",
      2,
      [
        ["MINH", "inviting", "Ê, app này còn ghi lợi nhuận cao hơn nữa nè!"],
        [
          "AN",
          "thinking",
          "Cao hơn bao nhiêu? Tớ chẳng thấy tên bên quản lý ở đâu cả.",
        ],
        [
          "MINH",
          "neutral",
          "Có cái biểu đồ đi lên kìa. Trông cũng chuyên nghiệp mà.",
        ],
        ["CO_LINH", "neutral", "Các em đang xem gì mà chăm chú thế?"],
        [
          "AN",
          "thinking",
          "Bọn em thấy vài mức lãi khác nhau. Nhưng thông tin mỗi bên ghi một kiểu ạ.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Vậy thử tìm phần điều kiện của sản phẩm xem. Đôi khi thứ mình muốn biết không nằm ở dòng chữ to nhất.",
        ],
      ],
      "CH05_SC02",
    ),
    choice(
      "CH05_SC02",
      2,
      "Trước khi quyết định, An sẽ xem phần nào tiếp theo?",
      [
        // A is committed only after the provider cards are actually read.
        {
          id: "CH05_SC02_OPEN_A",
          deferLedger: true,
          label: "Tìm hiểu bên đứng sau tài khoản và cách lấy tiền ra.",
          requires: inspected(["ch05_accounts"]),
          nextSceneId: "CH05_PROVIDER_READ",
        },
        {
          id: "CH05_AD_OPEN",
          label: "Tìm hiểu mức lãi đang được giới thiệu trên ứng dụng.",
          requires: inspected(["ch05_accounts"]),
          deferLedger: true,
          nextSceneId: "CH05_AD_1",
        },
      ],
      {
        choiceGroup: "CH05_PROVIDER",
        reviewAction: {
          label: "Xem lại hai tài khoản",
          targetSceneId: "CH05_SC01_INSPECT",
        },
      },
    ),
    ...lines(
      "CH05_AD",
      2,
      [
        [
          "MINH",
          "inviting",
          "Biểu đồ này tăng đều ghê. Nếu được như vậy thì cũng đáng cân nhắc nhỉ?",
        ],
        [
          "AN",
          "thinking",
          "Mình mới thấy con số trên màn hình. Tớ muốn biết nó liên quan thế nào đến khoản tiền học.",
        ],
      ],
      "CH05_AD_CHECK",
    ),
    choice(
      "CH05_AD_CHECK",
      2,
      "Sau khi xem phần giới thiệu, An sẽ làm gì tiếp?",
      [
        {
          id: "CH05_AD_COMPARE",
          label: "Mở hồ sơ sản phẩm để đối chiếu với mức lãi vừa xem.",
          deferLedger: true,
          nextSceneId: "CH05_PROVIDER_READ",
        },
        {
          id: "CH05_SC02_B",
          label: "Ghi lại mức lãi này làm cơ sở, chuyển sang phần mô phỏng.",
          evidenceScores: none,
          setFlags: { provider_checked: false, provider_unchecked: true },
          nextSceneId: "CH05_PROVIDER_B_1",
        },
      ],
      { choiceGroup: "CH05_PROVIDER" },
    ),
    dialogue(
      "CH05_PROVIDER_READ",
      2,
      "AN",
      "thinking",
      "Mình mở thử từng phần xem có gì khác nhau nhé.",
      "CH05_PROVIDER_CONFIRM",
      {
        requiredInspections: ["ch05_provider"],
        inspect: {
          id: "ch05_provider",
          buttonText: "Tra cứu nhà cung cấp",
          cards: providerCards,
          autoNextSceneOnClose: true,
        },
      },
    ),
    choice(
      "CH05_PROVIDER_CONFIRM",
      2,
      "Bạn sẽ dùng thông tin vừa đọc như thế nào?",
      [
        {
          ...providerCheck("CH05_SC02_A", "CH05_PROVIDER_A_1"),
          requires: inspected(["ch05_accounts", "ch05_provider"]),
          label:
            "Đối chiếu riêng từng sản phẩm với nhà cung cấp, phạm vi bảo vệ và ngày cần rút tiền.",
        },
        {
          id: "CH05_PROVIDER_GENERALIZE",
          label:
            "Dùng các điều kiện này để cân nhắc cả ứng dụng Minh vừa giới thiệu.",
          requires: inspected(["ch05_provider"]),
          evidenceScores: none,
          setFlags: { provider_checked: false, provider_unchecked: true },
          nextSceneId: "CH05_PROVIDER_ASSUMPTION_1",
        },
      ],
      {
        choiceGroup: "CH05_PROVIDER",
        reviewAction: {
          label: "Đọc lại hồ sơ",
          targetSceneId: "CH05_PROVIDER_READ",
        },
      },
    ),
    ...lines(
      "CH05_PROVIDER_ASSUMPTION",
      2,
      [
        [
          "AN",
          "neutral",
          "Vậy chắc mình có thể dùng các điều kiện này để cân nhắc ứng dụng kia luôn.",
        ],
        [
          "BANK_STAFF",
          "explaining",
          "Thẻ này chỉ ghi điều kiện của A và B thôi em. Với một sản phẩm khác, mình cần hồ sơ riêng của sản phẩm đó.",
        ],
        [
          "AN",
          "thinking",
          "À, mình đã gộp thông tin của hai bên với nhau rồi.",
        ],
      ],
      "CH05_SC03_ART",
    ),
    ...lines(
      "CH05_PROVIDER_A",
      2,
      [
        [
          "AN",
          "thinking",
          "À, tài khoản này rút sớm thì lãi khác hẳn lúc gửi đủ hạn.",
        ],
        ["MINH", "neutral", "Ủa, vậy số 6% kia không áp dụng cho ba tháng à?"],
        [
          "BANK_STAFF",
          "neutral",
          "Đúng rồi. Em cũng có thể xem ai cung cấp dịch vụ và phạm vi bảo vệ ngay trong thẻ.",
        ],
        [
          "AN",
          "neutral",
          "May mà mình xem thêm. Tớ cứ tưởng mấy mục đó giống nhau.",
        ],
      ],
      "CH05_SC03_ART",
    ),
    ...lines(
      "CH05_PROVIDER_B",
      2,
      [
        ["AN", "neutral", "Chắc mình xem thử phương án lãi cao trước."],
        ["MINH", "inviting", "Đấy, tớ cũng đang để ý chỗ đó!"],
        [
          "BANK_STAFF",
          "neutral",
          "Được em. Bảng phí và điều kiện rút vẫn ở đây, khi cần em có thể mở lại.",
        ],
        ["AN", "thinking", "Ừm... có khi lát nữa mình phải xem kỹ hơn."],
      ],
      "CH05_SC03_ART",
    ),
    art(3, "sc03-money-and-purchasing-power", "CH05_SC03_1"),
    ...lines(
      "CH05_SC03",
      3,
      [
        [
          "CO_LINH",
          "explaining",
          "Trước khi chọn tài khoản, thử một bài mô phỏng nhỏ nhé.",
        ],
        [
          "MINH",
          "inviting",
          "Hay, tớ muốn xem để lâu thì tiền tăng được bao nhiêu.",
        ],
        [
          "AN",
          "neutral",
          "Nhưng tháng thứ ba mình đã phải đóng học phí rồi...",
        ],
        [
          "CO_LINH",
          "neutral",
          "Bài này chỉ để xem cách tiền thay đổi theo thời gian. Chưa phải tiền trong tài khoản của An.",
        ],
      ],
      "CH05_GAME",
    ),
    {
      id: "CH05_GAME",
      type: "minigame",
      title: "Compound Timeline",
      background: bg(3),
      characters: [],
      game: { id: "COMPOUND_TIMELINE_CH05", title: "Compound Timeline" },
      nextSceneId: "CH05_AFTER_GAME_1",
      knowledgeUnits: knowledge(3),
    },
    ...lines(
      "CH05_AFTER_GAME",
      3,
      [
        [
          "AN",
          "thinking",
          "Tiền tăng thật, nhưng giá món đồ cũng tăng theo...",
        ],
        [
          "MINH",
          "neutral",
          "Thế nếu chỉ nhìn số tiền cuối năm thì dễ mừng hụt nhỉ?",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Ừ. Giờ các em đã có thêm dữ kiện để quay lại mục tiêu ba tháng rồi.",
        ],
      ],
      "CH05_SC04_ART",
    ),
    art(4, "sc04-planning-for-deadline", "CH05_SC04_1"),
    ...lines(
      "CH05_SC04",
      4,
      [
        [
          "BANK_STAFF",
          "neutral",
          "Giờ em đã xem cả hai tài khoản rồi. Em muốn chọn phương án nào?",
        ],
        [
          "AN",
          "thinking",
          "Em đang phân vân. A thì tiện, còn B nhìn lãi hấp dẫn hơn.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu cần tiền sau ba tháng thì sao? Chọn kiểu nào cũng có điểm phải cân nhắc nhỉ.",
        ],
        [
          "BANK_STAFF",
          "explaining",
          "Em có thể xem lại số tiền dự kiến nhận được ở tháng thứ ba.",
        ],
      ],
      "CH05_SC04_DATA",
    ),
    dialogue(
      "CH05_SC04_DATA",
      4,
      "AN",
      "thinking",
      "Mình xem lại ngày cần tiền và điều kiện một lần nữa nhé.",
      "CH05_SC04",
      {
        requiredInspections: ["ch05_plan_data"],
        inspect: {
          id: "ch05_plan_data",
          buttonText: "So sánh tài khoản A và tài khoản B",
          cards: accountCards,
          reference: courseReference,
          autoNextSceneOnClose: true,
        },
      },
    ),
    choice(
      "CH05_SC04",
      4,
      "Bạn muốn dùng loại tài khoản nào để giữ tiền cho khóa học?",
      [
        {
          id: "CH05_ACCOUNT_A",
          label: "Tài khoản A · Có thể rút tiền linh hoạt.",
          requires: inspected(["ch05_plan_data"]),
          deferLedger: true,
          nextSceneId: "CH05_PLAN_TOPUP",
        },
        {
          id: "CH05_ACCOUNT_B",
          label: "Tài khoản B · Gửi theo kỳ hạn 12 tháng.",
          requires: inspected(["ch05_plan_data"]),
          deferLedger: true,
          nextSceneId: "CH05_B_TIMING",
        },
      ],
      { choiceGroup: "CH05_PLAN", reviewAction: review },
    ),
    choice(
      "CH05_B_TIMING",
      4,
      "Bạn chọn tài khoản B. An sẽ dự tính lấy tiền ra vào lúc nào?",
      [
        {
          id: "CH05_B_MATURITY",
          label: "Giữ tiền đến cuối kỳ hạn 12 tháng rồi mới rút.",
          deltaStats: { GOAL: -3 },
          evidenceScores: evidence(2, 2, 0),
          setFlags: {
            ...accountFlags("A"),
            term_maturity: true,
            account_fit: false,
            account_pending: false,
            account_mismatch: true,
          },
          nextSceneId: "CH05_B_MATURITY_1",
        },
        {
          id: "CH05_SC04_A",
          label: "Dự tính rút tiền vào cuối tháng thứ ba.",
          deltaStats: { SAVING: 5, GOAL: 3 },
          evidenceScores: evidence(2, 2, 2),
          setFlags: { ...accountFlags("A"), ...fit },
          nextSceneId: "CH05_PLAN_A_1",
        },
      ],
      { choiceGroup: "CH05_PLAN" },
    ),
    ...lines(
      "CH05_B_MATURITY",
      4,
      [
        ["AN", "thinking", "Tớ muốn giữ đủ kỳ hạn để hưởng mức lãi niêm yết."],
        ["MINH", "neutral", "Thế còn khóa học cuối tháng thứ ba thì sao?"],
        [
          "AN",
          "worried-money",
          "À... mình chưa có nguồn tiền khác cho lúc đó. Tiền nhiều hơn ở tháng mười hai cũng không trả được học phí tháng ba.",
        ],
        [
          "BANK_STAFF",
          "explaining",
          "Đúng rồi. Mức lãi và ngày lấy tiền cần được cân nhắc cùng nhau. Kế hoạch em vừa chọn chưa đáp ứng ngày đóng học.",
        ],
      ],
      "CH05_SC04_RECAP",
    ),
    ...lines(
      "CH05_PLAN_A",
      4,
      [
        [
          "AN",
          "thinking",
          "Tớ chọn B. Dù không được mức 6% như quảng cáo, ba tháng nữa vẫn đủ tiền học.",
        ],
        ["MINH", "neutral", "Vậy là rút sớm lãi có chút xíu thôi à?"],
        [
          "AN",
          "neutral",
          "Ừ, nhưng ít nhất mình biết trước sẽ nhận được bao nhiêu.",
        ],
        [
          "BANK_STAFF",
          "neutral",
          "Anh ghi thời điểm rút dự kiến rồi: 1.005.000đ sau ba tháng theo giả định. Đây mới là kế hoạch, chưa có giao dịch nào nhé.",
        ],
      ],
      "CH05_SC04_RECAP",
    ),
    choice(
      "CH05_PLAN_TOPUP",
      4,
      "Bạn chọn tài khoản A. An sẽ sắp xếp khoản tiền học trong kế hoạch chi tiêu thế nào?",
      [
        {
          id: "CH05_TOPUP_OPEN",
          deferLedger: true,
          label: "Xem ngân sách tháng tới để dành riêng một khoản cho học phí.",
          nextSceneId: "CH05_TOPUP_CARD",
        },
        {
          id: "CH05_TOPUP_PROMISE",
          label:
            "Giữ lịch chi hiện tại, gần ngày đóng học sẽ tính nguồn bổ sung.",
          evidenceScores: none,
          setFlags: {
            ...accountFlags("B"),
            account_fit: false,
            account_pending: true,
            account_mismatch: false,
          },
          nextSceneId: "CH05_PENDING_1",
        },
        {
          id: "CH05_SC04_C",
          label:
            "Giữ nguyên khoản tiền này; phần lãi sẽ cộng thêm vào tiền học.",
          deltaStats: { GOAL: -3 },
          evidenceScores: none,
          setFlags: {
            ...accountFlags("C"),
            account_fit: false,
            account_pending: false,
            account_mismatch: true,
          },
          nextSceneId: "CH05_PLAN_C_1",
        },
      ],
      { choiceGroup: "CH05_PLAN", reviewAction: review },
    ),
    dialogue(
      "CH05_TOPUP_CARD",
      4,
      "AN",
      "thinking",
      "Mình cần một khoản chưa chi thật trong kế hoạch, chứ không chỉ là lời hứa.",
      "CH05_TOPUP_CONFIRM",
      {
        requiredInspections: ["ch05_topup_budget"],
        inspect: {
          id: "ch05_topup_budget",
          buttonText: "Thẻ ngân sách bổ sung · giả lập",
          dataText:
            "Tình huống luyện tập bổ sung, không phải Money hay khoản tiền mới. Chỉ dùng phương án này sau khi đọc và xác nhận thẻ.",
          cards: [
            card(
              "budget",
              "Khoản giải trí chưa chi",
              "Trong tình huống bổ sung này, kế hoạch tháng tới xác nhận 10.000đ dành cho giải trí chưa chi. Có thể giảm 7.500đ, dành cho học phí; kiểm tra cuối tháng 1. Đây là nguồn bù dự kiến có căn cứ trên thẻ, không cộng vào ví.",
              `${BASE}/props/course-fund-envelope.png`,
            ),
          ],
          autoNextSceneOnClose: true,
        },
      },
    ),
    choice(
      "CH05_TOPUP_CONFIRM",
      4,
      "Thẻ đã xác nhận khoản chưa chi. Bạn sẽ ghi kế hoạch thế nào?",
      [
        {
          id: "CH05_TOPUP_VERIFIED",
          label:
            "Dành 7.500đ từ khoản giải trí cho tiền học, kiểm tra lại cuối tháng 1.",
          requires: inspected(["ch05_topup_budget"]),
          deltaStats: { SAVING: 5, GOAL: 3 },
          evidenceScores: evidence(2, 2, 2),
          setFlags: {
            ...accountFlags("B"),
            ...fit,
            topup_source_verified: true,
          },
          nextSceneId: "CH05_PLAN_B_1",
        },
        {
          id: "CH05_TOPUP_UNVERIFIED",
          label: "Giữ nguyên khoản giải trí, để nguồn bổ sung tính sau.",
          evidenceScores: none,
          setFlags: {
            ...accountFlags("B"),
            account_fit: false,
            account_pending: true,
            account_mismatch: false,
          },
          nextSceneId: "CH05_PENDING_1",
        },
      ],
      {
        choiceGroup: "CH05_PLAN",
        reviewAction: {
          label: "Xem lại nguồn bù",
          targetSceneId: "CH05_TOPUP_CARD",
        },
      },
    ),
    ...lines(
      "CH05_PLAN_B",
      4,
      [
        [
          "AN",
          "thinking",
          "A dễ rút hơn, nhưng tính cả phí thì mình vẫn thiếu một ít.",
        ],
        ["MINH", "neutral", "Thiếu bao nhiêu?"],
        [
          "AN",
          "neutral",
          "7.500 đồng. Mình phải chừa khoản đó trong kế hoạch tháng tới.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Em ghi lại ngày kiểm tra và nguồn tiền dự kiến nhé.",
        ],
      ],
      "CH05_SC04_RECAP",
    ),
    ...lines(
      "CH05_PENDING",
      4,
      [
        ["AN", "neutral", "Chắc đến lúc đó mình xoay được..."],
        [
          "CO_LINH",
          "neutral",
          "Ừm, nhưng em đã biết khoản đó sẽ đến từ đâu chưa?",
        ],
        [
          "AN",
          "thinking",
          "Chưa chắc ạ. Kế hoạch của em vẫn còn thiếu nguồn bù.",
        ],
      ],
      "CH05_SC04_RECAP",
    ),
    ...lines(
      "CH05_PLAN_C",
      4,
      [
        ["AN", "neutral", "Tớ chọn A. Dù sao để tiền trong đó cũng có lãi mà."],
        ["MINH", "neutral", "Ừ, lại còn rút lúc nào cũng được."],
        [
          "CO_LINH",
          "neutral",
          "Thế thử xem ở tháng thứ ba, An thực sự có thể rút bao nhiêu nhé?",
        ],
        [
          "AN",
          "worried-money",
          "Khoan... mình quên khoản phí hằng tháng. Còn 992.500đ, thiếu 7.500đ rồi.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Em đã thấy khoản phí ảnh hưởng thế nào rồi. Hãy ghi nhớ điều này cho lần lập kế hoạch sau nhé.",
        ],
      ],
      "CH05_SC04_RECAP",
    ),
    choice(
      "CH05_SC04_RECAP",
      4,
      "Kết quả kế hoạch bạn đã chọn",
      [
        {
          id: "CH05_CONTINUE",
          label: "Tiếp tục phần phản tư về quyết định đã chọn.",
          nextSceneId: "CH05_REFLECTION_INTRO",
        },
      ],
      { planSummary: true },
    ),
    dialogue(
      "CH05_REFLECTION_INTRO",
      4,
      "CO_LINH",
      "neutral",
      "Giờ xem lại từ đầu nhé. Nếu lần sau gặp một tài khoản khác, em sẽ muốn biết điều gì trước?",
      "CH05_R1",
    ),
    {
      id: "CH05_R1",
      type: "activity",
      activity: "reflection1",
      title: "Thông tin nào quan trọng với quyết định của An?",
      background: bg(4),
      characters: [],
      completionOption: {
        id: "CH05_R1_DONE",
        nextSceneId: "CH05_REFLECTION_MIDDLE",
      },
      nextSceneId: "CH05_REFLECTION_MIDDLE",
      knowledgeUnits: knowledge(4),
    },
    dialogue(
      "CH05_REFLECTION_MIDDLE",
      4,
      "AN",
      "thinking",
      "Tớ cứ nghĩ gửi tiền là chỉ cần xem lãi. Giờ thì có nhiều thứ phải tính hơn.",
      "CH05_R2",
    ),
    {
      id: "CH05_R2",
      type: "activity",
      activity: "reflection2",
      title: "Bạn chấp nhận đánh đổi gì và sẽ làm gì tiếp?",
      background: bg(4),
      characters: [],
      completionOption: {
        id: "CH05_R2_DONE",
        setFlags: { reflection_completed: true },
        nextSceneId: "CH05_FINAL_1",
      },
      nextSceneId: "CH05_FINAL_1",
      knowledgeUnits: knowledge(4),
    },
    ...lines(
      "CH05_FINAL",
      4,
      [
        [
          "CO_LINH",
          "encouraging",
          "Em có thể chọn khác bạn mình. Miễn là em biết mình đang dựa vào thông tin nào.",
        ],
        [
          "AN",
          "neutral",
          "Ừm, lần này ít nhất mình biết điều gì cần xem trước.",
        ],
      ],
      "CH05_ENDING",
    ),
    {
      id: "CH05_ENDING",
      type: "ending",
      title: "Kết thúc Chương 5 · Ngân hàng và lãi",
      background: bg(4),
      characters: [],
      nextSceneId: null,
    },
  ],
  endingRules: {
    priorityOrder: ["C_RECOVERY", "A_GOAL_ACHIEVED", "B_BALANCED"],
    endings: [
      {
        id: "C_RECOVERY",
        title: "Ending C: Recovery",
        condition:
          "miniGameNeedsPractice || !flags.account_fit || flags.account_mismatch || flags.account_pending || RISK > 55 || SAVING < 40",
        storyText:
          "An cần xem lại phép tính lãi, phí hoặc nguồn tiền cho học phí. Kế hoạch chỉ có thể thực hiện khi các khoản cần trả có đủ nguồn tiền.",
        characterSprite: sprite("AN", "worried-money"),
      },
      {
        id: "A_GOAL_ACHIEVED",
        title: "Ending A: Goal Achieved",
        condition:
          "flags.provider_checked && flags.account_fit && choicePercent >= 75 && learningScore >= 75 && miniGameCompleted && miniGameGoalEligible && reflectionCompleted && reflectionScore >= 9",
        storyText:
          "Ba tháng nữa vẫn đủ tiền học theo kế hoạch. Vậy là yên tâm hơn rồi.",
        characterSprite: sprite("AN", "relieved"),
      },
      {
        id: "B_BALANCED",
        title: "Ending B: Balanced",
        condition: "DEFAULT_FALLBACK",
        storyText:
          "Mình đã có phương án dùng tiền đúng hạn. Nếu chọn cách tiện hơn, mình phải tính cả phí và khoản cần bù.",
        characterSprite: sprite("AN", "thinking"),
      },
    ],
  },
  endingReport: {
    choiceGroupMaxima: { CH05_PROVIDER: 6, CH05_PLAN: 6 },
    maxChoiceScore: 6,
    requiredGameIds: ["COMPOUND_TIMELINE_CH05"],
    miniGameMax: 12,
    miniGameLabel: "Compound Timeline",
    reflectionMax: 12,
    weights: { choices: 0.6, miniGame: 0.3, reflection: 0.1 },
    bands: [
      { min: 85, label: "Đã thể hiện vững" },
      { min: 60, label: "Đang hình thành" },
      { min: 0, label: "Cần luyện thêm" },
    ],
    achieved: [
      {
        when: "flags.account_fit",
        text: "Có kế hoạch khả thi cho ngày đóng học phí, theo dữ kiện đã kiểm tra.",
      },
      { text: "Đã thử so lãi, phí và sức mua qua các mốc thời gian." },
    ],
    practice: [
      {
        when: "miniGameNeedsPractice",
        text: "Bài thực hành còn nhiều câu chưa đúng. Xem lại cách tính lãi, trừ phí và so số tiền rút được với học phí đến hạn.",
      },
      {
        when: "!flags.account_fit",
        text: "Kiểm tra lại nguồn bù 7.500đ hoặc sửa phương án rút tiền.",
      },
      {
        when: "!flags.provider_checked",
        text: "Xác minh danh tính, phạm vi bảo vệ và điều kiện rút.",
      },
      {
        text: "Theo dõi kế hoạch và sức mua; tiền dự kiến chưa phải Money thực.",
      },
    ],
    nextStep:
      "Tiếp tục đối chiếu tổng chi phí và khả năng trả khi tìm hiểu về vay.",
  },
};
