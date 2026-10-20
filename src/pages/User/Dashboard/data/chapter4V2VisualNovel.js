// Chapter 4 — kịch bản đã chốt: Mua thông minh.
// Demo loads this local chapter; chapters 1–3 continue to use Content API.
const BASE = "/images/finteen-v2/chapter-04";
const SHOP = `${BASE}/bg/bg08-phone-shop.png`;
const COMPARE = `${BASE}/bg/bg08b-phone-comparison-counter.png`;
const CHECKOUT = `${BASE}/bg/bg08c-checkout-documents.png`;
const DESK = `${BASE}/bg/bg07-study-desk.png`;
const ICONS = `${BASE}/asset-mini-game/smart-shopping`;
const units = [
  "D03.04",
  "D03.05",
  "D03.06",
  "D03.07",
  "D03.08",
  "D03.09",
  "D07.08",
  "D07.09",
  "D08.02",
];
const sceneKnowledge = (id) => {
  if (id.startsWith("CH04_SC01"))
    return ["D03.04", "D03.05", "D03.06", "D03.09"];
  if (id.startsWith("CH04_SC02"))
    return ["D03.04", "D03.07", "D03.08", "D03.09", "D08.02"];
  if (id.startsWith("CH04_SC03"))
    return ["D03.06", "D03.07", "D03.08", "D07.08", "D07.09"];
  return ["D03.07", "D03.08", "D03.09", "D07.08", "D07.09"];
};
const folders = {
  AN: "an",
  MINH: "minh",
  CO_LINH: "co-linh",
  SHOP_ASSISTANT: "shop-assistant",
};
const names = {
  AN: "An",
  MINH: "Minh",
  CO_LINH: "Cô Linh",
  SHOP_ASSISTANT: "Nhân viên",
};
const sprite = (who, expression) =>
  `${BASE}/char/${folders[who]}/${folders[who]}-${expression}.png`;
const scores = (value) => ({ I: value, C: value, P: value });
// Các cảnh mới vẫn dùng schema dialogue/choice/conditional hiện tại của player.
// Mini-game có thông tin 4 vòng; player cũ có thể tiếp tục dùng questions[].
const dialogue = (
  id,
  background,
  who,
  expression,
  text,
  nextSceneId,
  extra = {},
) => ({
  id,
  type: "dialogue",
  title: text,
  background,
  speaker: names[who],
  speakerId: who,
  characters: [
    { id: who, expression, src: sprite(who, expression), position: "center" },
  ],
  text,
  nextSceneId,
  knowledgeUnits: sceneKnowledge(id),
  ...extra,
});
const art = (id, image, nextSceneId) => ({
  id,
  type: "scene",
  title: "Mua thông minh",
  background: `${BASE}/scene/${image}.png`,
  sceneArt: `${BASE}/scene/${image}.png`,
  characters: [],
  nextSceneId,
  knowledgeUnits: sceneKnowledge(id),
});
const conditional = (id, expression, yes, no) => ({
  id,
  type: "conditional",
  condition: { expression },
  ifTrueSceneId: yes,
  ifFalseSceneId: no,
});
const choice = (id, background, text, options, extra = {}) => ({
  id,
  type: "choice",
  title: text,
  background,
  characters: [],
  speaker: "An",
  speakerId: "AN",
  text,
  prompt: text,
  options,
  knowledgeUnits: sceneKnowledge(id),
  ...extra,
});
const transaction = (eventId, amount, description) => ({
  eventId,
  amount,
  description,
});

const phones = [
  {
    id: "A",
    label: "Máy A (mới)",
    image: `${ICONS}/phone-a-new.png`,
    price: 1600000,
    warrantyMonths: 12,
    meetsLearningNeeds: true,
    trialMonths: 1,
    monthlySubscription: 50000,
    billedMonthsFirstYear: 11,
    firstYearCostIfCancelled: 1600000,
    firstYearCostIfKept: 2150000,
    shopping: {
      claim: "Máy mới · Một tháng dùng thử",
      app: "Ứng dụng học và gọi video chạy mượt khi mở cùng lúc.",
      battery: "Pin mới, đủ một ngày học. Bảo hành máy 12 tháng.",
      terms: "Dùng thử 1 tháng, sau đó 50.000đ/tháng. Gia hạn ngày 30 trong lịch mô phỏng; hủy trước ngày này và lưu xác nhận.",
    },
  },
  {
    id: "B",
    label: "Máy B (đã qua sử dụng)",
    image: `${ICONS}/phone-b-used.png`,
    price: 1300000,
    warrantyMonths: 6,
    meetsLearningNeeds: true,
    inspectionRequired: true,
    firstYearCost: 1300000,
    shopping: {
      claim: "Giá thấp hơn · Chấp nhận đánh đổi máy cũ",
      app: "Mở được ứng dụng học. Chuyển giữa lớp video và tài liệu có độ trễ; dùng từng ứng dụng ổn định hơn.",
      battery: "Pin đã hao mòn. Cần đo thời lượng thực tế trước khi quyết định giữ pin hay thay.",
      terms: "Bảo hành máy 6 tháng, không gồm hao mòn pin. Không có thuê bao. Thay pin không khắc phục độ trễ khi mở nhiều ứng dụng.",
      batteryHealth: 78,
      batteryHours: 3,
      batteryReplacementCost: 250000,
      batteryTest: "Pin còn 78% dung lượng, dùng học liên tục khoảng 3 giờ. Không phồng pin. Có thể giữ và mang sạc, hoặc thay pin 250.000đ; bảo hành máy 6 tháng không trả khoản này.",
    },
  },
  {
    id: "C",
    label: "Máy C (nhiều tính năng)",
    image: `${ICONS}/phone-c-premium.png`,
    price: 2300000,
    meetsLearningNeeds: true,
    exceedsNeeds: true,
    firstYearCost: 2300000,
    shopping: {
      claim: "Màn hình đẹp · Camera và trò chơi tốt hơn",
      app: "Ứng dụng học chạy mượt. Camera cao cấp và cấu hình trò chơi không cần cho bài học hiện tại.",
      battery: "Máy đáp ứng một ngày học. Cần xác nhận bảo hành bằng văn bản trước khi thanh toán.",
      terms: "Không có thuê bao. Giá 2.300.000đ để lại 200.000đ, trong khi hoạt động trường cần 500.000đ.",
    },
  },
];
const comparison = {
  id: "ch04_comparison",
  buttonText: "Xem nhu cầu, giá và điều kiện ba máy",
  popupImages: phones.map((phone) => ({
    src: phone.image,
    caption: phone.label,
    description: `${phone.price.toLocaleString("vi-VN")}đ`,
  })),
  dataText: [
    "Máy A: 1.600.000đ, bảo hành 12 tháng. Dùng thử một tháng, tự gia hạn nếu không hủy.",
    "Giữ thuê bao: 1.600.000 + 11 × 50.000 = 2.150.000đ. Hủy trước gia hạn: 1.600.000đ.",
    "Máy B: 1.300.000đ, bảo hành máy 6 tháng, không gồm hao mòn pin. Chạy được ứng dụng học nhưng chậm khi đa nhiệm. Cần kiểm tra pin; có thể giữ pin và mang sạc hoặc thay pin 250.000đ.",
    "Máy C: 2.300.000đ, nhiều tính năng vượt nhu cầu và vượt mục tiêu chi.",
  ].join("\n"),
};
const phonePurchaseEvents = (phone) => [
  transaction(
    "EV_CH04_PHONE_PURCHASE",
    -phone.price,
    `Thanh toán máy ${phone.id}`,
  ),
];
const purchaseOption = (phone) => ({
  id: `CH04_SC03_CONFIRM_${phone.id}`,
  label: `Xác nhận mua ${phone.label}: ${phone.price.toLocaleString("vi-VN")}đ`,
  requires: {
    minMoney: phone.price,
    lockedReason:
      "Chưa đủ tiền: quay lại so sánh hoặc sửa kế hoạch trước khi mua.",
  },
  moneyEvents: [],
  setFlags: { purchase_confirmed: true },
  nextSceneId: "CH04_SC03_PAID_ROUTE",
});
const purchaseScenes = phones.flatMap((phone) => [
  choice(
    `CH04_SC03_PAY_${phone.id}`,
    CHECKOUT,
    `Kiểm tra giá và tên máy trước khi xác nhận: ${phone.label}, ${phone.price.toLocaleString("vi-VN")}đ.`,
    [
      purchaseOption(phone),
      {
        id: `CH04_SC03_BACK_${phone.id}`,
        label: "Chưa mua: xem lại dữ kiện và sửa kế hoạch",
        nextSceneId: "CH04_SC02",
      },
    ],
    {
      reviewAction: {
        label: "Xem lại dữ kiện / sửa kế hoạch",
        targetSceneId: "CH04_SC02",
      },
    },
  ),
]);
// These are elapsed billing months, not an upfront deduction of the annual forecast.
const subscriptionMonths = Array.from({ length: 11 }, (_, index) => {
  const month = index + 2;
  return choice(
    `CH04_SC04_MONTH_${month}`,
    DESK,
    `Tháng ${month}: thuê bao đang được giữ. Phí của tháng này là 50.000đ.`,
    [
      {
        id: `CH04_SC04_PAY_MONTH_${month}`,
        label: `Xác nhận tháng ${month} đã đi qua: thanh toán 50.000đ`,
        requires: { minMoney: 50000 },
        moneyEvents: [
          transaction(
            `EV_CH04_SUBSCRIPTION_MONTH_${month}`,
            -50000,
            `Thuê bao tháng ${month}`,
          ),
        ],
        nextSceneId:
          month === 12
            ? "CH04_SC04_OVER_BUDGET"
            : `CH04_SC04_MONTH_${month + 1}`,
      },
    ],
  );
});
const reflection = (id, prompt, nextSceneId, answers) =>
  choice(
    id,
    DESK,
    prompt,
    answers.map((label, index) => ({
      id: `${id}_${index + 1}`,
      label,
      reflectionScore: 2 - index,
      nextSceneId,
    })),
    {
      // Structured response anchors for the current choice-based player, not a wording-matching test.
      rubric: {
        maxScore: 2,
        criteria: [
          "Nêu căn cứ cụ thể từ quyết định thực",
          "Giải thích phép tính, đánh đổi hoặc bước theo dõi",
        ],
        acceptEquivalentReasoning: true,
      },
    },
  );

export const chapter4V2GameData = {
  id: "CH04_V2",
  title: "Mua thông minh",
  version: "2.1-expanded",
  initialMoney: 2500000,
  initialStats: {
    SAVING: 50,
    HAPPINESS: 50,
    RISK: 30,
    GOAL: 50,
    WEALTH: 0,
    FIQ: 0,
  },
  metadata: {
    chapterId: "CH04",
    persistProgress: true,
    targetAge: 16,
    goalDescription:
      "Mua điện thoại đáp ứng học tập, tổng chi phí năm đầu tối đa 2.000.000đ; kiểm tra chứng từ và thuê bao.",
    coreKnowledgeUnits: ["D03.04", "D03.06", "D03.07", "D03.08"],
    allKnowledgeUnits: units,
    reservedMoney: 500000,
    firstYearBudget: 2000000,
    initialStatsSource:
      "Giá trị khởi tạo theo cấu trúc các chương hiện có; kịch bản chỉ chốt các delta và ngưỡng ending.",
    integrationRequirements: [
      "Đăng ký SMART_SHOPPING_CH04 trong VisualNovelPlayer trước khi chạy chương.",
      "Reflection hiện dùng lựa chọn theo mức rubric; cần UI trả lời mở nếu muốn chấm câu trả lời tự do.",
      "Mini-game Smart Shopping v3 sử dụng 4 vòng: Inspect, Total Cost, Compare, Explain.",
    ],
  },
  sprites: Object.fromEntries(
    Object.keys(folders).map((who) => [
      who,
      Object.fromEntries(
        {
          AN: ["neutral", "thinking", "worried-money", "relieved"],
          MINH: ["neutral", "inviting"],
          CO_LINH: ["neutral", "explaining", "encouraging"],
          SHOP_ASSISTANT: ["neutral", "explaining"],
        }[who].map((expression) => [
          `${folders[who]}-${expression}.png`,
          sprite(who, expression),
        ]),
      ),
    ]),
  ),
  scenes: [
    art("CH04_SC01_ART", "sc01-phone-needs", "CH04_SC01_B01"),
    dialogue(
      "CH04_SC01_B01",
      SHOP,
      "AN",
      "worried-money",
      "Lại hết pin giữa giờ học rồi. Ứng dụng học cũng không cập nhật được nữa... Mình phải mua máy khác thôi.",
      "CH04_SC01_B02",
    ),
    dialogue(
      "CH04_SC01_B02",
      SHOP,
      "AN",
      "thinking",
      "Mẹ cho mình tự quản 2 triệu rưỡi. Nhưng tháng sau còn hoạt động ở trường cần 500 ngàn.",
      "CH04_SC01_B03",
      {
        inspect: {
          id: "ch04_needs",
          buttonText: "Xem nhu cầu và ngân sách",
          popupImage: `${BASE}/props/shopping-budget-envelope.png`,
          dataText:
            "Tiền: 2.500.000đ. Cần giữ 500.000đ cho hoạt động trường; giới hạn chi phí: 2.000.000đ. Máy phải chạy được ứng dụng học, pin sử dụng ổn và có điều kiện bảo hành rõ ràng. Không có nguồn tiền bổ sung chắc chắn.",
        },
      },
    ),
    dialogue(
      "CH04_SC01_B03",
      SHOP,
      "MINH",
      "inviting",
      "Ê An! Tớ mới xem mẫu C, camera đẹp và chơi game rất mượt. Mua giống tớ đi, cả nhóm dùng chung mẫu cho vui!",
      "CH04_SC01_B04",
    ),
    dialogue(
      "CH04_SC01_B04",
      SHOP,
      "AN",
      "thinking",
      "Nhưng tớ chỉ cần dùng ứng dụng học, liên lạc và xem video. Tớ không chắc cần nhiều tính năng như thế.",
      "CH04_SC01_B05",
    ),
    dialogue(
      "CH04_SC01_B05",
      SHOP,
      "MINH",
      "neutral",
      "Máy này mạnh hơn, cậu lo gì mà không chạy được ứng dụng học.",
      "CH04_SC01_B06",
    ),
    dialogue(
      "CH04_SC01_B06",
      SHOP,
      "SHOP_ASSISTANT",
      "explaining",
      "Cả ba mẫu đều chạy được ứng dụng học. Em nên xem nhu cầu, giá, pin, bảo hành và các chi phí kèm theo.",
      "CH04_SC01_PRIORITY",
    ),
    choice(
      "CH04_SC01_PRIORITY",
      SHOP,
      "Điều nào quan trọng nhất với hoàn cảnh của An?",
      [
        {
          id: "CH04_PRIORITY_NEEDS",
          label: "Đủ ứng dụng học, pin và bảo hành phù hợp với tổng ngân sách",
          setFlags: { priorities_checked: true },
          nextSceneId: "CH04_SC01_PRIORITY_OK",
        },
        {
          id: "CH04_PRIORITY_FRIENDS",
          label: "Mẫu mà bạn bè đang dùng, vì chắc chắn hợp với mình",
          setFlags: { priorities_checked: true },
          nextSceneId: "CH04_SC01_PRIORITY_PEER",
        },
        {
          id: "CH04_PRIORITY_CHEAP",
          label: "Mẫu nào càng rẻ càng tốt",
          setFlags: { priorities_checked: true },
          nextSceneId: "CH04_SC01_PRIORITY_CHEAP_FB",
        },
      ],
      { choiceGroup: "CH04_PRIORITY_WARMUP" },
    ),
    dialogue(
      "CH04_SC01_PRIORITY_OK",
      SHOP,
      "AN",
      "relieved",
      "Đúng rồi! Giá chỉ là một phần. Máy phải đáp ứng học tập và không vượt kế hoạch trường.",
      "CH04_SC02_ART",
    ),
    dialogue(
      "CH04_SC01_PRIORITY_PEER",
      SHOP,
      "AN",
      "thinking",
      "Minh muốn mua máy C, nhưng nhu cầu và khoản tiền cần giữ của hai đứa khác nhau. Mình nên cân nhắc thật kĩ.",
      "CH04_SC02_ART",
    ),
    dialogue(
      "CH04_SC01_PRIORITY_CHEAP_FB",
      SHOP,
      "SHOP_ASSISTANT",
      "explaining",
      "Giá thấp chưa nói đủ. Máy cũ cần xem tình trạng pin, sửa chữa và bảo hành để biết giá trị sử dụng.",
      "CH04_SC02_ART",
    ),
    {
      ...art("CH04_SC02_ART", "sc02-comparing-three-phones", "CH04_SC02_B01"),
      inspect: {
        ...comparison,
        hotspot: { x: 20.4, y: 63.2, width: 36.1, height: 23.8 },
        autoNextSceneOnClose: true,
      },
    },
    dialogue(
      "CH04_SC02_B01",
      COMPARE,
      "SHOP_ASSISTANT",
      "explaining",
      "Máy A mới giá 1 triệu 600, bảo hành 12 tháng và được dùng thử một tháng dịch vụ đi kèm.",
      "CH04_SC02_B02",
    ),
    dialogue(
      "CH04_SC02_B02",
      COMPARE,
      "MINH",
      "inviting",
      "Có quà dùng thử nữa à? Máy A nghe cũng hời đấy!",
      "CH04_SC02_B03",
    ),
    dialogue(
      "CH04_SC02_B03",
      COMPARE,
      "AN",
      "thinking",
      "Dùng thử xong thì sao ạ?",
      "CH04_SC02_B04",
    ),
    dialogue(
      "CH04_SC02_B04",
      COMPARE,
      "SHOP_ASSISTANT",
      "explaining",
      "Nếu không hủy trước kỳ gia hạn, từ tháng thứ hai sẽ thu 50 ngàn mỗi tháng.",
      "CH04_SC02_B05",
    ),
    dialogue(
      "CH04_SC02_B05",
      COMPARE,
      "AN",
      "thinking",
      "50 ngàn mỗi tháng á? Giữ cả năm thì số tiền sẽ chênh lên khá cao, vượt giới hạn của mình.",
      "CH04_SC02_B06",
    ),
    dialogue(
      "CH04_SC02_B06",
      COMPARE,
      "MINH",
      "neutral",
      "Nhưng máy C xịn nhất thật mà. Biết đâu sau này cậu xin thêm tiền được?",
      "CH04_SC02_B07",
    ),
    dialogue(
      "CH04_SC02_B07",
      COMPARE,
      "AN",
      "thinking",
      "Nếu mua máy C giá 2 triệu 300, mình chỉ còn 200 ngàn; khoản hoạt động trường sẽ thiếu 300 ngàn. Mình chưa có nguồn bù chắc chắn.",
      "CH04_SC02_B08",
    ),
    dialogue(
      "CH04_SC02_B08",
      COMPARE,
      "SHOP_ASSISTANT",
      "explaining",
      "Máy B đã qua sử dụng giá 1 triệu 300, bảo hành 6 tháng. Em có thể xem tình trạng máy, pin và điều kiện bảo hành.",
      "CH04_SC02_B09",
    ),
    dialogue(
      "CH04_SC02_B09",
      COMPARE,
      "AN",
      "thinking",
      "Máy cũ chưa chắc đã tệ, máy mới cũng chưa chắc đã ngon. Mình sẽ so tổng chi và điều kiện trước khi chọn.",
      "CH04_SC02",
    ),
    choice(
      "CH04_SC02",
      COMPARE,
      "Nếu dùng trong cả một năm thì em thấy phương án nào hợp lý hơn?",
      [
        {
          id: "CH04_SC02_A",
          label: "Chọn máy A",
          requires: {
            inspected: ["ch04_comparison"],
            lockedReason: "Hãy xem bảng dữ kiện bắt buộc trước khi xác nhận.",
          },
          moneyEvents: [],
          deltaStats: { RISK: -2, GOAL: 2 },
          evidenceScores: scores(2),
          flag: "purchase_fit",
          setFlags: {
            phone_a: true,
            phone_b: false,
            phone_c: false,
            purchase_fit: true,
            purchase_over_budget: false,
            budget_adjusted: true,
            reminder_set: true,
            cancellation_confirmed: false,
          },
          nextSceneId: "CH04_SC02_A_FEEDBACK",
        },
        {
          id: "CH04_SC02_B",
          label: "Chọn máy B",
          requires: {
            inspected: ["ch04_comparison"],
            lockedReason: "Hãy xem bảng dữ kiện bắt buộc trước khi xác nhận.",
          },
          moneyEvents: [],
          deltaStats: { RISK: -2, GOAL: 2 },
          evidenceScores: scores(2),
          flag: "purchase_fit",
          setFlags: {
            phone_a: false,
            phone_b: true,
            phone_c: false,
            purchase_fit: true,
            purchase_over_budget: false,
            budget_adjusted: true,
            used_phone_checked: true,
            reminder_set: false,
          },
          nextSceneId: "CH04_SC02_B_FEEDBACK",
        },
        {
          id: "CH04_SC02_C",
          label: "Chọn máy C",
          requires: {
            inspected: ["ch04_comparison"],
            lockedReason: "Hãy xem bảng dữ kiện bắt buộc trước khi xác nhận.",
          },
          moneyEvents: [],
          deltaStats: { HAPPINESS: 4, GOAL: -5 },
          evidenceScores: scores(0),
          flag: "purchase_over_budget",
          setFlags: {
            phone_a: false,
            phone_b: false,
            phone_c: true,
            purchase_fit: false,
            purchase_over_budget: true,
            budget_adjusted: false,
            reminder_set: false,
          },
          nextSceneId: "CH04_SC02_C_FEEDBACK",
        },
      ],
      {
        choiceGroup: "CH04_PURCHASE",
        reviewAction: {
          label: "Xem lại nhu cầu, giá và điều kiện ba máy",
          targetSceneId: "CH04_SC02_ART",
        },
      },
    ),
    dialogue(
      "CH04_SC02_A_FEEDBACK",
      COMPARE,
      "AN",
      "relieved",
      "Mình quyết định mua máy A, nhưng sẽ không để thuê bao tự động gia hạn. Mình sẽ đặt nhắc lịch trước. Đặt nhắc chưa phải đã hủy, mình cần xác nhận hủy đúng hạn.",
      "CH04_SC02_A_FB2",
    ),
    dialogue(
      "CH04_SC02_A_FB2",
      COMPARE,
      "SHOP_ASSISTANT",
      "explaining",
      "Đừng nhầm việc đặt nhắc lịch với hủy thành công nhé. Em phải thực hiện hủy và lưu xác nhận đúng hạn. Không thôi vẫn sẽ bị trừ tiền đấy nhé!",
      "CH04_SC02_GAME",
    ),
    dialogue(
      "CH04_SC02_B_FEEDBACK",
      COMPARE,
      "AN",
      "thinking",
      "Máy B tuy rẻ hơn, nhưng mình phải kiểm tra pin, bảo hành và tình trạng máy trước khi quyết định mua.",
      "CH04_SC02_B_FB2",
    ),
    dialogue(
      "CH04_SC02_B_FB2",
      COMPARE,
      "SHOP_ASSISTANT",
      "explaining",
      "Em nhớ giữ lại giấy kiểm tra pin và phiếu bảo hành nhé. Máy rẻ hơn cũng tốt, miễn là chất lượng ổn và đáp ứng được nhu cầu của em.",
      "CH04_SC02_GAME",
    ),
    dialogue(
      "CH04_SC02_C_FEEDBACK",
      COMPARE,
      "AN",
      "worried-money",
      "Máy C đúng là đẹp, chơi game cũng mượt nữa. Nhưng nếu mua thì mình sẽ không còn đủ tiền!",
      "CH04_SC02_C_FB2",
    ),
    dialogue(
      "CH04_SC02_C_FB2",
      COMPARE,
      "MINH",
      "neutral",
      "Tớ vẫn thấy máy C đẹp nhất. Nhưng mà... cậu chắc muốn mua nó chứ?",
      "CH04_SC02_GAME",
    ),
    {
      id: "CH04_SC02_GAME",
      type: "minigame",
      title: "Smart Shopping",
      background: COMPARE,
      characters: [],
      game: {
        id: "SMART_SHOPPING_CH04",
        title: "Bốn lượt. Một quyết định.",
        phones,
        instruction:
          "Kiểm tra đúng ba máy A/B/C với bốn lượt, xử lý phí ngoài báo giá và theo dõi chi phí năm đầu.",
        budget: 2500000,
        reserve: 500000,
        firstYearBudget: 2000000,
        estimatedMinutes: 5,
        maxScore: 4,
      },
      nextSceneId: "CH04_SC03_ART",
      onPassSceneId: "CH04_SC03_ART",
      onFailSceneId: "CH04_SC03_ART",
      knowledgeUnits: sceneKnowledge("CH04_SC02_GAME"),
    },
    art("CH04_SC03_ART", "sc03-questioning-receipt", "CH04_SC03_B01"),
    dialogue(
      "CH04_SC03_B01",
      CHECKOUT,
      "SHOP_ASSISTANT",
      "explaining",
      "Trước khi chốt, em kiểm tra lại xem đúng máy mình chọn chưa, giá bao nhiêu và sẽ thanh toán bằng cách nào nhé.",
      "CH04_SC03_B02",
    ),
    dialogue(
      "CH04_SC03_B02",
      CHECKOUT,
      "AN",
      "thinking",
      "Mình chọn cách nào nhỉ? Nếu chuyển khoản thì phải xem đúng người nhận chưa. Còn trả tiền mặt thì nhớ lấy hóa đơn. À, phải kiểm tra cả số tiền nữa.",
      "CH04_SC03_ROUTE_A",
    ),
    conditional(
      "CH04_SC03_ROUTE_A",
      "flags.phone_a",
      "CH04_SC03_PAY_A",
      "CH04_SC03_ROUTE_B",
    ),
    conditional(
      "CH04_SC03_ROUTE_B",
      "flags.phone_b",
      "CH04_SC03_PAY_B",
      "CH04_SC03_PAY_C",
    ),
    ...purchaseScenes,
    conditional(
      "CH04_SC03_PAID_ROUTE",
      "flags.phone_a",
      "CH04_SC03_PAID_A",
      "CH04_SC03_PAID_ROUTE_B",
    ),
    conditional(
      "CH04_SC03_PAID_ROUTE_B",
      "flags.phone_b",
      "CH04_SC03_PAID_B",
      "CH04_SC03_PAID_C",
    ),
    dialogue(
      "CH04_SC03_PAID_A",
      CHECKOUT,
      "AN",
      "relieved",
      "Mình đã xác nhận máy A giá 1.600.000đ, sẽ thanh toán sau khi kiểm tra hóa đơn. Gói dùng thử chưa phát sinh phí; phải theo dõi kỳ gia hạn.",
      "CH04_SC03_RECEIPT",
    ),
    dialogue(
      "CH04_SC03_PAID_B",
      CHECKOUT,
      "AN",
      "relieved",
      "Mình đã xác nhận máy B giá 1.300.000đ, sẽ thanh toán sau khi kiểm tra hóa đơn. Nhớ giữ biên bản pin và bảo hành sáu tháng.",
      "CH04_SC03_RECEIPT",
    ),
    dialogue(
      "CH04_SC03_PAID_C",
      CHECKOUT,
      "AN",
      "worried-money",
      "Mình đã xác nhận máy C giá 2.300.000đ, sau khi thanh toán sẽ còn 200.000đ. Hoạt động trường cần 500.000đ, nghĩa là thiếu 300.000đ.",
      "CH04_SC03_RECEIPT",
    ),
    dialogue(
      "CH04_SC03_RECEIPT",
      CHECKOUT,
      "AN",
      "thinking",
      "Ủa, hóa đơn lại có thêm phí dịch vụ 100.000đ? Báo giá ban đầu đâu có dòng này.",
      "CH04_SC03_RECEIPT_B2",
      {
        inspect: {
          id: "ch04_receipt",
          buttonText: "Đối chiếu báo giá và hóa đơn",
          popupImage: `${BASE}/props/receipt-and-quotation.png`,
          dataText:
            "Giá máy theo phương án đã xác nhận: A 1.600.000đ; B 1.300.000đ; C 2.300.000đ. Hóa đơn thêm 100.000đ không có trong báo giá. Chưa tự trả khoản đang tranh chấp. Lưu cả hai bản và hỏi bộ phận chăm sóc khách hàng của cửa hàng.",
        },
      },
    ),
    dialogue(
      "CH04_SC03_RECEIPT_B2",
      CHECKOUT,
      "SHOP_ASSISTANT",
      "explaining",
      "Em đợi chị xem lại một chút nhé. Chị sẽ kiểm tra khoản phí này để đảm bảo không bị tính nhầm.",
      "CH04_SC03_RECEIPT_B3",
    ),
    dialogue(
      "CH04_SC03_RECEIPT_B3",
      CHECKOUT,
      "MINH",
      "neutral",
      "Có một trăm nghìn thôi mà, hay trả luôn cho xong? Nhưng tớ cũng không rõ là phí gì.",
      "CH04_SC03_RECEIPT_B4",
    ),
    dialogue(
      "CH04_SC03_RECEIPT_B4",
      CHECKOUT,
      "AN",
      "thinking",
      "Tớ thấy khoản này hơi lạ. Không phải tớ muốn làm khó ai đâu, chỉ là muốn biết sao mình lại phải trả thêm thôi.",
      "CH04_SC03_RECEIPT_ROUTE_A",
    ),
    conditional(
      "CH04_SC03_RECEIPT_ROUTE_A",
      "flags.phone_a",
      "CH04_SC03",
      "CH04_SC03_RECEIPT_ROUTE_B",
    ),
    conditional(
      "CH04_SC03_RECEIPT_ROUTE_B",
      "flags.phone_b",
      "CH04_SC03_B_RECEIPT",
      "CH04_SC03_C_RECEIPT",
    ),
    ...phones.map((phone) => choice(
      phone.id === "A" ? "CH04_SC03" : `CH04_SC03_${phone.id}_RECEIPT`,
      CHECKOUT,
      "Cửa hàng yêu cầu thêm 100.000đ ngoài báo giá ban đầu. Em sẽ làm gì?",
      [
        {
          id: "CH04_SC03_A",
          label: "Khoan đã, mình muốn hỏi rõ khoản phí này trước.",
          requires: { minMoney: phone.price },
          moneyEvents: phonePurchaseEvents(phone),
          deltaStats: { RISK: -1, GOAL: 1 },
          evidenceScores: scores(2),
          flag: "receipt_resolved",
          setFlags: { receipt_resolved: true, receipt_unresolved: false },
          nextSceneId: "CH04_SC03_A_FEEDBACK",
        },
        {
          id: "CH04_SC03_B",
          label: "Chắc là phí phát sinh thôi, mình trả luôn cho xong.",
          requires: {
            minMoney: phone.price + 100000,
            lockedReason: "Cần đủ tiền máy và 100.000đ phí phát sinh để thanh toán.",
          },
          moneyEvents: [
            ...phonePurchaseEvents(phone),
            transaction(
              "EV_CH04_DISPUTED_FEE",
              -100000,
              "Đồng ý trả phí ngoài báo giá",
            ),
          ],
          deltaStats: { RISK: 1 },
          evidenceScores: scores(0),
          flag: "receipt_unresolved",
          setFlags: { receipt_resolved: false, receipt_unresolved: true },
          nextSceneId: "CH04_SC03_B_FEEDBACK",
        },
      ],
      { choiceGroup: "CH04_RECEIPT" },
    )),
    dialogue(
      "CH04_SC03_A_FEEDBACK",
      CHECKOUT,
      "SHOP_ASSISTANT",
      "explaining",
      "Chị kiểm tra lại rồi nhé. Đúng là bên chị có chút nhầm lẫn khi tính phí. Chị đã sửa lại hóa đơn cho em rồi, em giữ lại cả báo giá ban đầu để tiện đối chiếu nha.",
      "CH04_SC03_A_FB2",
    ),
    dialogue(
      "CH04_SC03_A_FB2",
      CHECKOUT,
      "AN",
      "relieved",
      "Ban đầu mình cũng ngại hỏi thật, nhưng may mà đã kiểm tra lại. Không thì mất thêm 100 ngàn rồi.",
      "CH04_SC04_ART",
    ),
    dialogue(
      "CH04_SC03_B_FEEDBACK",
      CHECKOUT,
      "AN",
      "worried-money",
      "Mình trả tiền luôn cho nhanh, giờ nghĩ lại thấy hơi sai sai. Không biết có bị tính nhầm không nhỉ?",
      "CH04_SC03_B_FB2",
    ),
    dialogue(
      "CH04_SC03_B_FB2",
      CHECKOUT,
      "SHOP_ASSISTANT",
      "explaining",
      "Em cứ giữ lại hóa đơn nhé. Nếu vẫn thắc mắc về khoản phí này, em có thể liên hệ bộ phận hỗ trợ để được kiểm tra lại.",
      "CH04_SC04_ART",
    ),
    art("CH04_SC04_ART", "sc04-following-renewal", "CH04_SC04_B0"),
    dialogue(
      "CH04_SC04_B0",
      DESK,
      "AN",
      "thinking",
      "Về nhà rồi. Mẹ hỏi mình đã dựa vào điều gì để chọn điện thoại, và còn khoản nào phải theo dõi.",
      "CH04_SC04_B1",
    ),
    dialogue(
      "CH04_SC04_B1",
      DESK,
      "AN",
      "thinking",
      "Mình giữ hóa đơn, nhắc lịch và kiểm tra máy đáp ứng ứng dụng học.",
      "CH04_SC04_B2",
    ),
    dialogue(
      "CH04_SC04_B2",
      DESK,
      "CO_LINH",
      "explaining",
      "Em đã đánh đổi điều gì giữa giá, chất lượng và cách sử dụng?",
      "CH04_SC04_BRANCH_A",
    ),
    conditional(
      "CH04_SC04_BRANCH_A",
      "flags.phone_a",
      "CH04_SC04_TALK_A",
      "CH04_SC04_BRANCH_B",
    ),
    conditional(
      "CH04_SC04_BRANCH_B",
      "flags.phone_b",
      "CH04_SC04_TALK_B",
      "CH04_SC04_TALK_C",
    ),
    dialogue(
      "CH04_SC04_TALK_A",
      DESK,
      "AN",
      "thinking",
      "Máy A mới, bảo hành 12 tháng. Mình lưu thông tin hủy nhưng phải thực hiện hủy đúng hạn, không chỉ đặt lời nhắc.",
      "CH04_SC04_ROUTE",
    ),
    dialogue(
      "CH04_SC04_TALK_B",
      DESK,
      "AN",
      "thinking",
      "Máy B tiết kiệm được nhiều tiền hơn. Mình sẽ theo dõi pin, cập nhật phần mềm và điều kiện bảo hành sáu tháng.",
      "CH04_SC04_ROUTE",
    ),
    dialogue(
      "CH04_SC04_TALK_C",
      DESK,
      "AN",
      "worried-money",
      "Mình thật sự thích máy C, nhưng tiền cho hoạt động trường vẫn thiếu 300.000đ. Không thể mặc định sẽ xin thêm được.",
      "CH04_SC04_ROUTE",
    ),
    conditional(
      "CH04_SC04_ROUTE",
      "flags.phone_a",
      "CH04_SC04_SUBSCRIPTION",
      "CH04_SC04_RECAP",
    ),
    choice(
      "CH04_SC04_SUBSCRIPTION",
      DESK,
      "Đến trước ngày gia hạn: nhắc lịch chưa đồng nghĩa đã hủy. Em làm gì?",
      [
        {
          id: "CH04_CANCEL",
          label: "Thực hiện hủy trước gia hạn và lưu xác nhận thành công",
          moneyEvents: [],
          setFlags: {
            cancellation_confirmed: true,
            subscription_kept: false,
            budget_adjusted: true,
          },
          nextSceneId: "CH04_SC04_CANCELLED",
        },
        {
          id: "CH04_KEEP",
          label: "Giữ thuê bao: xem từng tháng phí thực sự phát sinh",
          moneyEvents: [],
          setFlags: {
            cancellation_confirmed: false,
            subscription_kept: true,
            budget_adjusted: false,
          },
          nextSceneId: "CH04_SC04_MONTH_2",
        },
      ],
      {
        inspect: {
          id: "ch04_renewal",
          buttonText: "Xem lịch gia hạn",
          popupImage: `${ICONS}/renewal-calendar.png`,
          dataText:
            "Tháng đầu dùng thử. Nếu giữ thuê bao, mỗi tháng từ tháng 2 đến tháng 12 trả 50.000đ. Tổng 550.000đ là dự báo, không trừ trước. Hủy phải thực hiện trước gia hạn và có xác nhận.",
        },
      },
    ),
    dialogue(
      "CH04_SC04_CANCELLED",
      DESK,
      "AN",
      "relieved",
      "Mình đã hủy đúng hạn và lưu xác nhận: tổng năm đầu là 1.600.000đ, còn 900.000đ trước các phí khác.",
      "CH04_SC04_RECAP",
    ),
    ...subscriptionMonths,
    dialogue(
      "CH04_SC04_OVER_BUDGET",
      DESK,
      "AN",
      "worried-money",
      "Mười một tháng đã đi qua: phí thuê bao thực tế là 550.000đ. Tổng năm đầu 2.150.000đ vượt mục tiêu 2.000.000đ; mình cần điều chỉnh kế hoạch.",
      "CH04_SC04_RECAP",
    ),
    choice("CH04_SC04_RECAP", DESK, "Nhìn lại chứng từ và kế hoạch chi phí", [
      {
        id: "CH04_RECAP_KEEP",
        label: "Ghi nhận đúng tình trạng hiện tại và suy ngẫm",
        nextSceneId: "CH04_SC04_R1",
      },
      {
        id: "CH04_RECAP_RECEIPT",
        label:
          "Nhờ bộ phận chăm sóc khách hàng giải thích phí và kiểm tra lại hóa đơn",
        requires: {
          flags: ["receipt_unresolved"],
          lockedReason: "Chứng từ đã được kiểm tra và xử lý.",
        },
        setFlags: {
          receipt_resolved: true,
          receipt_unresolved: false,
          receipt_revised: true,
        },
        nextSceneId: "CH04_SC04_RECEIPT_FIXED",
      },
      {
        id: "CH04_RECAP_BUDGET",
        label:
          "Ghi nhận thiếu 300.000đ, điều chỉnh kế hoạch với nguồn bù và thời hạn kiểm chứng",
        requires: {
          flags: ["purchase_over_budget"],
          lockedReason:
            "Lựa chọn máy hiện tại không vượt mục tiêu; có thể kiểm tra thuê bao bên dưới.",
        },
        setFlags: { budget_adjusted: true, budget_revised: true },
        nextSceneId: "CH04_SC04_BUDGET_FIXED",
      },
      {
        id: "CH04_RECAP_SUBSCRIPTION",
        label: "Điều chỉnh kế hoạch cho chi phí thuê bao đã phát sinh",
        requires: {
          flags: ["subscription_kept"],
          lockedReason: "Không có thuê bao đang được giữ.",
        },
        setFlags: { budget_adjusted: true, budget_revised: true },
        nextSceneId: "CH04_SC04_BUDGET_FIXED",
      },
    ]),
    dialogue(
      "CH04_SC04_RECEIPT_FIXED",
      DESK,
      "AN",
      "thinking",
      "Mình đã nhận giải thích và kiểm tra chứng từ. Khoản đã trả không tự được hoàn lại; cần theo điều kiện tình huống. Lần sau mình sẽ hỏi trước khi thanh toán.",
      "CH04_SC04_RECAP",
    ),
    dialogue(
      "CH04_SC04_BUDGET_FIXED",
      DESK,
      "AN",
      "thinking",
      "Mình phải ghi rõ số tiền thiếu, nguồn bù và ngày kiểm tra. Kế hoạch chỉ được coi là khả thi khi có dữ kiện xác nhận, không chỉ hy vọng.",
      "CH04_SC04_RECAP",
    ),
    reflection(
      "CH04_SC04_R1",
      "Dữ kiện nào quyết định lựa chọn của bạn và phép tính nào cần kiểm tra?",
      "CH04_SC04_R2",
      [
        "Đối chiếu nhu cầu học, pin/bảo hành và tổng năm đầu; A giữ thuê bao là 1.600.000 + 11 × 50.000 = 2.150.000đ, hủy đúng hạn là 1.600.000đ; B cần bằng chứng kiểm tra.",
        "Mình có nhìn giá máy và bảo hành nhưng chưa tính đầy đủ thuê bao hoặc điều kiện.",
        "Mình chỉ nhìn mẫu máy bạn bè thích, chưa nêu được dữ kiện hay phép tính.",
      ],
    ),
    reflection(
      "CH04_SC04_R2",
      "Bạn đã đánh đổi gì, hậu quả nào cần theo dõi và bước tiếp theo là gì?",
      "CH04_ENDING",
      [
        "Mình cân bằng giá, chất lượng và nhu cầu; giữ chứng từ, xác nhận hủy nếu có và cập nhật kế hoạch theo khoản chi thực tế.",
        "Mình nhận ra có đánh đổi nhưng mới nêu được một phần hậu quả, chưa có bước theo dõi cụ thể.",
        "Mình chưa xác định đánh đổi, hậu quả hay bước tiếp theo.",
      ],
    ),
    {
      id: "CH04_ENDING",
      type: "ending",
      title: "Kết thúc Chương 4 — Mua thông minh",
      background: DESK,
      characters: [],
      text: null,
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
          "miniGameNeedsPractice || !flags.receipt_resolved || !flags.budget_adjusted || RISK > 55 || SAVING < 40",
        storyText:
          "An còn phần cần luyện về tổng chi, hóa đơn hoặc kế hoạch sử dụng máy. Hãy đối chiếu lời giải với các khoản tiền và điều kiện đã cho.",
        characterSprite: sprite("AN", "worried-money"),
        position: "center",
        backgroundId: "BG07",
      },
      {
        id: "A_GOAL_ACHIEVED",
        title: "Ending A: Goal Achieved",
        condition:
          "flags.purchase_fit && flags.receipt_resolved && (!flags.phone_a || flags.cancellation_confirmed) && !flags.subscription_kept && !flags.purchase_over_budget && evidenceScore >= 9 && miniGameCompleted && miniGameGoalEligible && reflectionScore >= 3",
        storyText:
          "An có máy đủ học và chứng từ rõ: “Mình biết cả giá máy lẫn phí sau đó.”",
        characterSprite: sprite("AN", "relieved"),
        position: "center",
        backgroundId: "BG07",
      },
      {
        id: "B_BALANCED",
        title: "Ending B: Balanced",
        condition: "DEFAULT_FALLBACK",
        storyText:
          "An chọn phương án khác và sửa mục chi có lý do: “Mình đã chấp nhận đánh đổi và cập nhật kế hoạch.”",
        characterSprite: sprite("AN", "thinking"),
        position: "center",
        backgroundId: "BG07",
      },
    ],
  },
  endingReport: {
    maxChoiceScore: 12,
    requiredGameIds: ["SMART_SHOPPING_CH04"],
    miniGameMax: 4,
    reflectionMax: 4,
    weights: { choices: 0.6, miniGame: 0.3, reflection: 0.1 },
    bands: [
      { min: 85, label: "Đã thể hiện vững" },
      { min: 60, label: "Đang hình thành" },
      { min: 0, label: "Cần luyện thêm" },
    ],
    achieved: [
      {
        when: "flags.receipt_resolved",
        text: "Bạn đã nhờ bộ phận chăm sóc khách hàng kiểm tra và sửa lại hóa đơn.",
      },
      {
        when: "flags.purchase_fit",
        text: "Phương án máy đáp ứng nhu cầu học và mục tiêu chi đã đặt.",
      },
      {
        text: "Bạn đã tiếp cận các dữ kiện của chương; chỉ lựa chọn và hoạt động được chấm mới là bằng chứng năng lực.",
      },
    ],
    practice: [
      { when: "miniGameNeedsPractice", text: "Bài thực hành còn nhiều câu chưa đúng. Xem lại cách tính tổng chi, đối chiếu hóa đơn và giữ đủ tiền cho hoạt động trường." },
      {
        when: "!flags.receipt_resolved",
        text: "Lưu báo giá, hóa đơn và hỏi rõ khoản phí trước khi đồng ý trả.",
      },
      {
        when: "!flags.budget_adjusted",
        text: "Tính tổng chi năm đầu và điều chỉnh kế hoạch nếu vượt mục tiêu.",
      },
      {
        text: "Nhắc lịch khác với xác nhận hủy; tiền dự báo khác với giao dịch thực tế. Quyết định một lần không định nghĩa bạn là người tốt hay xấu.",
      },
    ],
    nextStep:
      "Giữ thói quen đối chiếu nhu cầu, bằng chứng và tổng chi phí khi mua sắm.",
  },
};
