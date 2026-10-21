const BASE = "/images/finteen-v2/chapter-07";
const MINI = `${BASE}/asset-mini-game/scam-or-safe`;
const backgrounds = [
  "bg11-school-infirmary",
  "bg11b-medical-paperwork-desk",
  "bg12-refund-message-phone",
  "bg11c-recovery-evidence-desk",
];
const people = {
  AN: ["an", "An"],
  MINH: ["minh", "Minh"],
  CO_LINH: ["co-linh", "Cô Linh"],
};
const sprite = (who, expression) =>
  `${BASE}/char/${people[who][0]}/${people[who][0]}-${expression}.png`;
const knowledge = [
  "D07.01",
  "D07.02",
  "D07.03",
  "D07.04",
  "D07.05",
  "D07.06",
  "D07.08",
  "D07.09",
  "D07.10",
  "D08.01",
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
const lines = (prefix, n, script, next) =>
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
    }),
  );
const art = (n, file, nextSceneId) =>
  scene(`CH07_SC0${n}_ART`, n, "scene", {
    title: [
      "Một khoản chi bất ngờ",
      "Tiền hôm nay, hồ sơ ngày mai",
      "Tin nhắn đến đúng lúc",
      "Giữ lại điều cần thiết",
    ][n - 1],
    background: `${BASE}/scene/${file}.png`,
    sceneArt: `${BASE}/scene/${file}.png`,
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
const inspect = (id, n, title, cards, nextSceneId, shared, presentation = {}) =>
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
      ...presentation,
    },
  });
const evidence = (I = 2, C = 2, P = 2) => ({ I, C, P });
const insuranceCards = [
  {
    id: "bill",
    label: "Khoản cần trả hôm nay",
    image: `${BASE}/props/medical-receipt.png`,
    facts: [
      ["Hóa đơn y tế", "300.000đ, An cần trả đủ trong ngày"],
      ["Tiền An hiện có", "1.500.000đ"],
      [
        "Tiền dành cho việc bất ngờ",
        "300.000đ đã nằm trong 1.500.000đ trên, không phải tiền có thêm",
      ],
    ],
  },
  {
    id: "cover",
    label: "Thẻ bảo hiểm giả định",
    image: `${BASE}/props/insurance-terms-folder.png`,
    facts: [
      ["Phí bảo hiểm", "An đã đóng từ trước, hôm nay không đóng thêm"],
      [
        "Phạm vi",
        "Chỉ chi trả chi phí xử lý chấn thương được bảo hiểm theo thẻ này",
      ],
      [
        "Phần An tự trả",
        "100.000đ trong hóa đơn 300.000đ, bảo hiểm không hoàn phần này",
      ],
      [
        "Bảo hiểm có thể hoàn",
        "Tối đa 200.000đ sau khi hồ sơ được duyệt; chưa nhận ngay hôm nay",
      ],
      [
        "Không được bảo hiểm trả",
        "Đồ dùng cá nhân bị hỏng và chi phí không thuộc điều kiện của thẻ",
      ],
    ],
  },
  {
    id: "claim",
    label: "Giấy tờ và trạng thái",
    image: `${BASE}/props/medical-receipt.png`,
    facts: [
      [
        "Giấy tờ cần nộp",
        "Hóa đơn đã thanh toán, giấy ghi nhận xử lý y tế và mẫu yêu cầu chi trả",
      ],
      ["Cách nộp", "Nộp theo hướng dẫn trong tài liệu bảo hiểm"],
      [
        "Tình trạng hồ sơ",
        "Chưa được duyệt nên An chưa nhận được tiền bảo hiểm",
      ],
      [
        "Nếu thiếu hoặc bị từ chối",
        "Hỏi bộ phận hỗ trợ bảo hiểm về lý do và giấy tờ cần bổ sung",
      ],
    ],
  },
];
const sharedInsurance = {
  label: "Lưu ý cho tình huống này",
  items: [
    "Các điều kiện bảo hiểm dưới đây được đặt ra cho bài học; hợp đồng thực tế có thể khác.",
    "An đã được chăm sóc y tế. Bạn sẽ giúp An tính tiền cần trả và chuẩn bị giấy tờ bảo hiểm.",
  ],
};
const game = (id, n, gameId, rounds, nextSceneId) =>
  scene(id, n, "minigame", {
    title: "Bình tĩnh trước rủi ro",
    game: {
      id: gameId,
      title: "Bình tĩnh trước rủi ro",
      rounds,
      reference: rounds.includes(0)
        ? {
            buttonText: "Khoản chi và điều kiện bảo hiểm",
            cards: insuranceCards,
            shared: sharedInsurance,
          }
        : null,
    },
    nextSceneId,
  });
const moneyEvent = (eventId, amount, reason) => ({ eventId, amount, reason });

export const chapter7V2GameData = {
  id: "CH07_V2",
  version: "1.0",
  title: "Biến cố bất ngờ",
  initialMoney: 1500000,
  initialStats: { SAVING: 50, HAPPINESS: 50, RISK: 30, GOAL: 50 },
  metadata: {
    chapterId: "CH07",
    age: 17,
    persistProgress: true,
    preserveFirstChoiceStats: true,
    lockDecisions: true,
    goalDescription:
      "Xử lý khoản chi y tế, đọc điều kiện bảo hiểm và bảo vệ thông tin trước tin nhắn giả mạo.",
    coreKnowledgeUnits: ["D07.02", "D07.04", "D07.06", "D07.10"],
    allKnowledgeUnits: knowledge,
  },
  scenes: [
    art(1, "sc01-understanding-medical-cost", "CH07_OPEN_1"),
    ...lines(
      "CH07_OPEN",
      1,
      [
        [
          "AN",
          "worried-money",
          "Lúc chạy còn tưởng chỉ trượt một chút. Giờ ngồi đây mới thấy buổi thể thao hôm nay khác hẳn kế hoạch.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ lấy cặp cho cậu rồi. Bài vẽ nhóm để tối mình tính tiếp, giờ cậu cứ theo hướng dẫn của cô y tế nhé.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Phần chăm sóc đã có người hỗ trợ và liên hệ gia đình. Cô ngồi cùng hai em xem phần chi phí trong tình huống này.",
        ],
        [
          "AN",
          "thinking",
          "Dạ. Tờ giấy ghi ba trăm nghìn cần trả trong ngày. Em không ngờ hôm nay lại có khoản đó.",
        ],
        [
          "MINH",
          "neutral",
          "Trong kế hoạch của cậu có tiền để dành cho việc bất ngờ mà?",
        ],
        [
          "AN",
          "neutral",
          "Có. Tớ đang có một triệu rưỡi, trong đó dự tính giữ ba trăm nghìn cho những việc như thế này.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy ngoài một triệu rưỡi còn thêm ba trăm nghìn nữa à?",
        ],
        [
          "AN",
          "thinking",
          "Không, ba trăm nằm trong một triệu rưỡi. Tớ chỉ ghi mục đích sử dụng, chứ không có thêm một ví tiền nào.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng rồi. Ghi một khoản dự trù giúp em chuẩn bị cách chi, nhưng không tự làm tổng tiền tăng lên.",
        ],
        [
          "AN",
          "thinking",
          "Dùng đến khoản đó vẫn thấy tiếc. Nhìn tiền trong ví giảm xuống chắc em sẽ hơi lo.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Có một khoản cần xử lý và mình đã chuẩn bị được tiền cho nó cũng là ích lợi của kế hoạch. Không phải mọi lần dùng tiền đều là tiêu quá tay.",
        ],
        [
          "MINH",
          "neutral",
          "Nhưng cậu có bảo hiểm trong ví dụ này nữa. Có khi chỉ cần đưa thẻ là xong?",
        ],
        [
          "AN",
          "thinking",
          "Tớ cũng đang nghĩ vậy. Nếu bảo hiểm trả thì hôm nay mình cần bỏ ra bao nhiêu?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Mình mở điều kiện trước nhé. Có thẻ không có nghĩa mọi khoản đều thuộc phạm vi, hay tiền được chuyển ngay khi em đưa thẻ.",
        ],
        [
          "MINH",
          "neutral",
          "Để tớ giữ tờ chi phí, cậu mở phần điều kiện. Mình đọc hai thứ cạnh nhau cho đỡ lẫn.",
        ],
        [
          "AN",
          "neutral",
          "Dạ. Em muốn biết khoản nào phải trả hôm nay và khoản nào mới đang chờ xét.",
        ],
      ],
      "CH07_INSURANCE",
    ),
    inspect(
      "CH07_INSURANCE",
      1,
      "Khoản chi và điều kiện bảo hiểm",
      insuranceCards,
      "CH07_TERMS_1",
      sharedInsurance,
    ),
    ...lines(
      "CH07_TERMS",
      1,
      [
        [
          "MINH",
          "neutral",
          "Ở đây ghi phần tự trả một trăm nghìn, tối đa xét chi trả hai trăm nghìn. Hai số cộng lại là ba trăm.",
        ],
        [
          "AN",
          "thinking",
          "Vậy có phải hôm nay tớ chỉ cần đưa một trăm nghìn không?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Trong trường hợp này, hôm nay em vẫn phải trả đủ ba trăm nghìn. Sau đó mình mới nộp hồ sơ để bên bảo hiểm xem xét.",
        ],
        [
          "AN",
          "neutral",
          "Tức là em cần có đủ tiền trả trước. Khoản hai trăm nghìn chưa thể coi là tiền trong ví.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đúng. Phần tự trả là chi phí em phải chịu trong khoản đủ điều kiện. Khoản được xét còn phụ thuộc phạm vi, chứng từ và giới hạn đã ghi.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu hôm nay trả ba trăm nghìn, sau này hồ sơ được duyệt đủ hai trăm thì cuối cùng tự chịu một trăm. Nhưng chưa biết lúc nào và có được duyệt đủ không.",
        ],
        [
          "AN",
          "thinking",
          "Tớ sẽ không cộng trước hai trăm vào số tiền còn lại. Nếu không, nhìn ví cứ tưởng có nhiều hơn thực tế.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Phí bảo hiểm đã đóng từ trước rồi. Hôm nay em không phải đóng lại khoản đó.",
        ],
        [
          "AN",
          "neutral",
          "Còn hóa đơn, giấy xử lý y tế và mẫu yêu cầu chi trả, em cần giữ đủ ba loại.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu người ta hỏi OTP ngân hàng để bổ sung hồ sơ thì sao?",
        ],
        [
          "CO_LINH",
          "explaining",
          "OTP là mã xác thực dùng một lần, thường để xác nhận một thao tác cụ thể. Nó không phải chứng từ điều trị; mình không gửi cho người đang nhắn hay gọi đến.",
        ],
        [
          "AN",
          "thinking",
          "Vậy trước hết em thử xếp phần tiền cần trả và giấy tờ phải giữ. Đừng để có thẻ mà lại bỏ sót hóa đơn.",
        ],
      ],
      "CH07_GAME_INSURANCE",
    ),
    game(
      "CH07_GAME_INSURANCE",
      1,
      "INSURANCE_DESK_CH07",
      [0],
      "CH07_AFTER_INSURANCE_1",
    ),
    ...lines(
      "CH07_AFTER_INSURANCE",
      1,
      [
        [
          "AN",
          "thinking",
          "Hôm nay cần thanh toán đủ ba trăm nghìn. Còn quyền lợi tối đa hai trăm nghìn đang là khả năng được xét, chưa phải tiền đã nhận.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ đã ghi chỗ cất hồ sơ. Mình không cần gửi hết mọi thứ cho bất cứ ai nhận làm giúp.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Và mỗi hợp đồng thật có thể khác thẻ giả định này. Khi dùng, em cần xem đúng phạm vi, phần tự trả và thủ tục của sản phẩm đó.",
        ],
        [
          "AN",
          "neutral",
          "Giờ em phải tính xem lấy tiền đâu để trả hôm nay. Mỗi cách sẽ ảnh hưởng thế nào đến tháng sau nhỉ?",
        ],
      ],
      "CH07_SC02_ART",
    ),
    art(2, "sc02-paying-and-keeping-records", "CH07_PAYMENT_INTRO_1"),
    ...lines(
      "CH07_PAYMENT_INTRO",
      2,
      [
        [
          "MINH",
          "inviting",
          "Tớ thấy quảng cáo ứng trước ba trăm nghìn rất nhanh. Họ nói có tiền ngay để trả hóa đơn.",
        ],
        [
          "AN",
          "thinking",
          "Nhưng tớ đang có một triệu rưỡi. Nếu vay thêm chỉ để ví vẫn hiện số đó thì sau này sao?",
        ],
        [
          "MINH",
          "neutral",
          "Dòng điều kiện ghi một tháng nữa trả ba trăm sáu mươi nghìn. Tớ suýt bỏ qua vì chỉ nhìn tiền nhận hôm nay.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Đây là đề nghị vay giả lập, không mở khoản vay thật cho em. Mình vẫn tính đủ: nhận bao nhiêu, dùng vào đâu và phải trả lại bao nhiêu.",
        ],
        [
          "AN",
          "neutral",
          "Nhận ba trăm rồi trả chi phí ba trăm thì ví quay về số cũ. Nhưng có thêm khoản phải trả ba trăm sáu mươi vào tháng sau.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy số dư không giảm chưa chắc nghĩa là tình hình đỡ hơn.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đúng. Khoản đi vay cũng không phải thu nhập mình kiếm được. Nó có nghĩa vụ trả đi kèm.",
        ],
        [
          "AN",
          "thinking",
          "Em còn một cách nữa là cầm giấy tờ về rồi để sau tính. Nhưng khoản chi hôm nay vẫn chưa có cách xử lý.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Phần chăm sóc không bị bỏ mặc. Việc mình quyết định ở đây là phương án thanh toán và trách nhiệm giữ hồ sơ, không phải có xứng đáng được giúp hay không.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ để các con số ngay đây. Cậu xem muốn dùng tiền đang có hay tính cách khác nhé.",
        ],
      ],
      "CH07_SC02",
    ),
    choose(
      "CH07_SC02",
      2,
      "An sẽ lấy tiền đâu để trả chi phí hôm nay?",
      [
        {
          id: "CH07_SC02_A",
          label: "Dùng 300.000đ đang có, giữ giấy tờ để nộp hồ sơ bảo hiểm.",
          requires: { minMoney: 300000 },
          deltaStats: { RISK: -7 },
          evidenceScores: evidence(),
          moneyEvents: [
            moneyEvent(
              "CH07_MEDICAL_PAYMENT",
              -300000,
              "Thanh toán chi phí y tế",
            ),
          ],
          setFlags: {
            incident_resolved: true,
            incident_unresolved: false,
            hot_loan: false,
          },
          nextSceneId: "CH07_PAY_1",
        },
        {
          id: "CH07_SC02_B",
          label:
            "Giữ tiền đang có, dùng khoản vay 300.000đ để trả chi phí hôm nay.",
          deltaStats: { RISK: 15, GOAL: -5 },
          evidenceScores: evidence(0, 0, 0),
          moneyEvents: [
            moneyEvent(
              "CH07_HOT_LOAN_RECEIVED",
              300000,
              "Nhận tiền vay giả lập",
            ),
            moneyEvent(
              "CH07_HOT_LOAN_SPENT",
              -300000,
              "Dùng tiền vay trả chi phí y tế",
            ),
          ],
          setFlags: {
            incident_resolved: true,
            incident_unresolved: false,
            hot_loan: true,
          },
          nextSceneId: "CH07_LOAN_1",
        },
        {
          id: "CH07_SC02_C",
          label: "Mang giấy tờ về trước, để chuyện trả tiền tính sau.",
          deltaStats: { RISK: 5, GOAL: -5 },
          evidenceScores: evidence(0, 0, 0),
          setFlags: {
            incident_resolved: false,
            incident_unresolved: true,
            hot_loan: false,
          },
          nextSceneId: "CH07_PENDING_1",
        },
      ],
      "CH07_PAYMENT",
    ),
    ...lines(
      "CH07_PAY",
      2,
      [
        [
          "AN",
          "neutral",
          "Em dùng ba trăm nghìn trong khoản đã dự trù. Ví còn một triệu hai trăm nghìn.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ cất hóa đơn cùng giấy xử lý y tế vào bìa này nhé.",
        ],
        [
          "AN",
          "thinking",
          "Ừ. Trả tiền xong chưa có nghĩa hồ sơ bảo hiểm xong. Mình vẫn cần mẫu yêu cầu và theo dõi phản hồi.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Khoản chi đã được xử lý bằng tiền hiện có. Phần xét chi trả bảo hiểm vẫn tách riêng, chưa cộng gì vào ví.",
        ],
      ],
      "CH07_RISK_1",
    ),
    ...lines(
      "CH07_LOAN",
      2,
      [
        [
          "AN",
          "thinking",
          "Bài mô phỏng ghi nhận thêm ba trăm nghìn tiền vay, rồi trừ đúng ba trăm nghìn trả chi phí. Ví vẫn một triệu rưỡi.",
        ],
        [
          "MINH",
          "neutral",
          "Nhưng một tháng nữa phải trả ba trăm sáu mươi nghìn. Tớ sẽ không xóa dòng đó chỉ vì ví trông chưa giảm.",
        ],
        [
          "AN",
          "worried-money",
          "Để giữ số dư hôm nay mà tạo thêm sáu mươi nghìn chi phí… Tớ cần ghi nghĩa vụ đó cùng kế hoạch tháng tới.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Em ghi rõ ngày phải trả 360.000đ và nguồn tiền dự tính nhé. Dù ví hôm nay vẫn đủ tiền, tháng sau em còn phải trả thêm khoản vay này.",
        ],
      ],
      "CH07_RISK_1",
    ),
    ...lines(
      "CH07_PENDING",
      2,
      [
        [
          "AN",
          "thinking",
          "Em mang tờ giấy về trước. Nhưng em chưa chọn nguồn trả ba trăm nghìn hôm nay.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ sẽ ghi là khoản chưa xử lý, chứ không coi cất tờ giấy là chi phí tự hết.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Phần chăm sóc vẫn được hỗ trợ và có người lớn đồng hành. Về tài chính, khoản thanh toán và hồ sơ đang còn việc phải làm.",
        ],
        [
          "AN",
          "worried-money",
          "Dạ. Số tiền hiện có vẫn một triệu rưỡi, nhưng mình không thể coi mọi việc đã xong chỉ vì chưa trừ tiền.",
        ],
      ],
      "CH07_RISK_1",
    ),
    ...lines(
      "CH07_RISK",
      2,
      [
        [
          "MINH",
          "neutral",
          "Trước đây tớ nghe rủi ro thì chỉ nghĩ đến mất tiền. Hôm nay còn có sức khỏe và cả thời gian phải giải quyết nữa.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Rủi ro tài chính là sự việc có thể khiến mình mất tiền, thu nhập, tài sản hoặc thông tin. Không phải lúc nào cũng tránh được hết.",
        ],
        ["AN", "thinking", "Thế mua bảo hiểm là làm rủi ro biến mất à cô?"],
        [
          "CO_LINH",
          "explaining",
          "Không. Bảo hiểm chuyển một phần hậu quả tài chính theo hợp đồng sang đơn vị bảo hiểm, đổi lại mình đóng phí. Sự cố vẫn có thể xảy ra.",
        ],
        [
          "MINH",
          "neutral",
          "Còn chuẩn bị khoản dự trù là mình tự chịu một phần chi phí?",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đúng. Mình có bốn hướng thường gặp: tránh, giảm, tự gánh và chuyển giao. Có thể kết hợp, chứ không chỉ chọn một cho mọi chuyện.",
        ],
        [
          "AN",
          "neutral",
          "Ví dụ đường đang ngập thì chọn đường khác là tránh đi qua chỗ rủi ro đó.",
        ],
        [
          "MINH",
          "neutral",
          "Lưu bản sao bài vẽ là giảm nguy cơ mất hết dữ liệu, chứ không hứa máy không bao giờ hỏng.",
        ],
        [
          "AN",
          "thinking",
          "Dành tiền cho khoản sửa nhỏ là tự gánh trong khả năng. Bảo hiểm thì chỉ chuyển phần nào hợp đồng cho phép.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Các em đang nhìn vào hành động cụ thể rồi. Đọc điều kiện giúp mình biết phần nào vẫn cần tự chuẩn bị.",
        ],
        [
          "MINH",
          "neutral",
          "Mình còn phải kiểm tra người nhận hồ sơ là ai nữa. Chỉ có cái tên giống công ty chắc chưa đủ.",
        ],
        [
          "AN",
          "neutral",
          "Tớ sẽ tìm chỗ nộp hồ sơ trong tài liệu bảo hiểm. Có tin nhắn mới thì cứ đọc kỹ đã.",
        ],
      ],
      "CH07_SC03_ART",
    ),
    art(3, "sc03-checking-refund-message", "CH07_MESSAGE_1"),
    ...lines(
      "CH07_MESSAGE",
      3,
      [
        [
          "AN",
          "thinking",
          "Điện thoại rung đúng lúc mình đang nghĩ đến tiền bảo hiểm. Có tin ghi “nhận ngay hai trăm nghìn”.",
        ],
        [
          "MINH",
          "neutral",
          "Nhanh thế à? Mình còn chưa biết hồ sơ đã đủ hay chưa.",
        ],
        [
          "AN",
          "neutral",
          "Họ bảo gửi mã OTP và làm trong năm phút, không thì mất quyền nhận.",
        ],
        [
          "MINH",
          "neutral",
          "Lại đúng số tiền hai trăm nghìn trong thẻ. Tớ hiểu sao đọc vội dễ tưởng là chuyện của mình.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Hai em cứ đọc kỹ tin nhắn đã nhé. Chưa cần bấm vào đường dẫn hay trả lời người gửi đâu.",
        ],
        [
          "AN",
          "thinking",
          "OTP là mã xác thực một lần, không phải hóa đơn hay mã hồ sơ. Tớ chưa yêu cầu giao dịch nào cần xác nhận cả.",
        ],
        [
          "MINH",
          "neutral",
          "Tên người gửi trông như bộ phận hỗ trợ. Nhưng tên đó tự ghi được phải không cô?",
        ],
        [
          "CO_LINH",
          "explaining",
          "Tên và ảnh đại diện ai cũng có thể tự đặt. Muốn biết có đúng bên bảo hiểm không, mình cần hỏi lại qua ứng dụng đã dùng hoặc số điện thoại trong hợp đồng.",
        ],
        [
          "AN",
          "thinking",
          "Nếu gọi lại số họ vừa gửi thì vẫn là hỏi chính người đang tự nhận là hỗ trợ.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Đúng rồi. Em tự mở ứng dụng bảo hiểm đã dùng, hoặc gọi số hỗ trợ ghi trong hợp đồng. Đừng lấy số do người vừa nhắn gửi cho mình.",
        ],
        [
          "MINH",
          "neutral",
          "Còn cái mốc năm phút làm tớ chỉ muốn xử lý ngay cho khỏi mất tiền.",
        ],
        [
          "AN",
          "neutral",
          "Nhưng tiền chưa được duyệt thì lời hứa “nhận ngay” cần được kiểm tra, không phải vì thấy gấp là làm theo.",
        ],
      ],
      "CH07_MESSAGE_INSPECT",
    ),
    inspect(
      "CH07_MESSAGE_INSPECT",
      3,
      "Đọc tin nhắn và xem danh bạ",
      [
        {
          id: "sms",
          label: "Tin nhắn",
          sender: "Hỗ trợ hoàn phí",
          senderNote: "Số lạ · Tự giới thiệu là nhân viên hỗ trợ",
          message:
            "Hồ sơ của bạn được hoàn 200.000đ. Gửi mã OTP trong 5 phút để nhận tiền ngay. Quá thời gian sẽ mất quyền nhận.",
          context: "An không thực hiện giao dịch nào cần nhập OTP.",
        },
        {
          id: "contact",
          label: "Thông tin liên lạc",
          contacts: [
            {
              id: "insurance-app",
              name: "Ứng dụng bảo hiểm",
              detail: "An tự mở ứng dụng đã dùng từ trước.",
            },
            {
              id: "insurance-support",
              name: "Hỗ trợ bảo hiểm",
              detail: "Thông tin liên hệ được ghi trong tài liệu bảo hiểm.",
            },
            {
              id: "school-support",
              name: "Bàn hỗ trợ của trường",
              detail: "Điểm hỗ trợ đã được nhà trường giới thiệu.",
            },
          ],
          note: "Nếu muốn hỏi lại, hãy dùng thông tin liên hệ đã có từ trước, thay vì số điện thoại hay đường dẫn trong tin nhắn lạ.",
        },
      ],
      "CH07_SC03",
      {
        label: "Đang chờ xét hồ sơ",
        items: [
          "Bên bảo hiểm chưa thông báo duyệt hồ sơ và chưa chuyển tiền cho An.",
        ],
      },
      { layout: "phone" },
    ),
    choose(
      "CH07_SC03",
      3,
      "An sẽ làm gì với tin nhắn vừa đến?",
      [
        {
          id: "CH07_SC03_A",
          label:
            "Mở ứng dụng bảo hiểm để hỏi về tin vừa nhận, rồi lưu lại tin nhắn.",
          deltaStats: { SAVING: 1, HAPPINESS: 1, RISK: -8, GOAL: 2 },
          evidenceScores: evidence(2, 1, 2),
          setFlags: { fraud_contained: true, fraud_exposed: false },
          nextSceneId: "CH07_VERIFY_1",
        },
        {
          id: "CH07_SC03_B",
          label: "Gửi mã OTP theo yêu cầu trong bài thử để nhận 200.000đ ngay.",
          requires: { minMoney: 150000 },
          deltaStats: { RISK: 20 },
          evidenceScores: evidence(0, 0, 0),
          moneyEvents: [
            moneyEvent(
              "CH07_FRAUD_LOSS",
              -150000,
              "Tổn thất giả lập sau khi lộ OTP",
            ),
          ],
          setFlags: { fraud_contained: false, fraud_exposed: true },
          nextSceneId: "CH07_EXPOSED_1",
        },
      ],
      "CH07_FRAUD",
    ),
    ...lines(
      "CH07_VERIFY",
      3,
      [
        [
          "AN",
          "neutral",
          "Em tự mở mục hỗ trợ trong ứng dụng đã dùng, không mở từ tin nhắn. Đây là ảnh tin vừa đến.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Bộ phận hỗ trợ trả lời rồi: họ không yêu cầu gửi OTP cho nhân viên để nhận tiền bảo hiểm. Tin nhắn vừa rồi là giả mạo.",
        ],
        [
          "MINH",
          "neutral",
          "Vậy không có khoản hoàn tiền nào vừa vào ví. Chỉ là họ nhắc đúng con số mình đang chờ.",
        ],
        [
          "AN",
          "relieved",
          "Tớ chụp lại tin nhắn rồi. May là chưa gửi mã cho họ.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Lần sau gặp tin nhắn tương tự, em cứ tự mở ứng dụng hoặc tìm lại số hỗ trợ đã biết để hỏi nhé.",
        ],
      ],
      "CH07_INBOX_INTRO_1",
    ),
    ...lines(
      "CH07_EXPOSED",
      3,
      [
        [
          "AN",
          "worried-money",
          "Trong mô phỏng, em đã làm theo yêu cầu gửi OTP. Sao lại có giao dịch trừ một trăm năm mươi nghìn?",
        ],
        [
          "MINH",
          "neutral",
          "Mình dừng ở đây, đừng gửi thêm mã hay chuyển thêm tiền cho người đó. Tớ gọi cô ngồi cùng nhé.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Có cô ở đây rồi. Em mở ứng dụng ngân hàng để khóa thẻ hoặc tài khoản nếu có chức năng đó, rồi báo ngay cho ngân hàng về giao dịch lạ nhé.",
        ],
        [
          "AN",
          "thinking",
          "Em mở ứng dụng ngân hàng để tìm mục khóa thẻ, khóa tài khoản và ghi lại giao dịch lạ. Em sẽ không gọi lại số trong tin nhắn.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Nếu không mở được ứng dụng, cô sẽ cùng em tìm số hỗ trợ trên thẻ hoặc trang web của ngân hàng. Mình báo ngay, đừng đợi gom đủ giấy tờ.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ giữ thời điểm tin nhắn và mã giao dịch giả lập trên giấy cho cậu. Không đăng ảnh thông tin tài khoản lên nhóm.",
        ],
        [
          "AN",
          "worried-money",
          "Ví đã giảm một trăm năm mươi nghìn trong bài. Làm bước bảo vệ không làm số tiền đó tự quay lại.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Đúng. Mục tiêu trước mắt là ngăn thiệt hại tiếp diễn, rồi theo dõi hỗ trợ. Có thể báo cáo và yêu cầu tra soát, nhưng không hứa chắc lấy lại được tiền.",
        ],
      ],
      "CH07_INBOX_INTRO_1",
    ),
    ...lines(
      "CH07_INBOX_INTRO",
      3,
      [
        [
          "MINH",
          "neutral",
          "Không phải tin nào nói đến tiền cũng là lừa đảo. Tớ muốn biết cách phân biệt mà không đoán theo ảnh đại diện.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Giờ thử đọc vài tin trong hộp thư nhé. Ngoài nội dung, hãy xem tin đến từ đâu và An có biết người gửi từ trước không.",
        ],
        [
          "AN",
          "neutral",
          "Em sẽ chọn tin nào cần hỏi lại trước, tin nào có thể làm tiếp theo hướng dẫn.",
        ],
        [
          "MINH",
          "neutral",
          "Rồi mình xếp kế hoạch nếu thấy giao dịch lạ. Cần làm việc nào trước để rủi ro không tiếp tục?",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Bài thử không đếm ngược và không cần thông tin thật. Các em sắp xếp trước, nộp một lần rồi đọc lý do.",
        ],
      ],
      "CH07_GAME_SAFETY",
    ),
    game(
      "CH07_GAME_SAFETY",
      3,
      "SCAM_OR_SAFE_CH07",
      [1, 2],
      "CH07_AFTER_SAFETY_1",
    ),
    ...lines(
      "CH07_AFTER_SAFETY",
      3,
      [
        [
          "AN",
          "thinking",
          "Mình cần nhìn yêu cầu thực sự: lấy mã, lấy mật khẩu, cài tệp lạ hay chỉ hướng dẫn xem hồ sơ trong ứng dụng đã mở.",
        ],
        [
          "MINH",
          "neutral",
          "Nếu thấy giao dịch lạ thì dừng lại ngay. Báo ngân hàng và khóa thẻ hoặc tài khoản càng sớm càng tốt, đừng chờ người kia nhắn tiếp.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Nếu ứng dụng có nút khóa thẻ hoặc tài khoản thì dùng ngay, đồng thời nhờ ngân hàng hỗ trợ. Việc nào làm được trước thì làm, đừng mải gom bằng chứng mà chậm khóa.",
        ],
        [
          "AN",
          "neutral",
          "Lưu chứng từ là để có căn cứ theo dõi. Không phải đăng hết dữ liệu cá nhân để nhờ người lạ xét giúp.",
        ],
      ],
      "CH07_SC04_ART",
    ),
    art(4, "sc04-organizing-evidence-and-support", "CH07_SUPPORT_1"),
    ...lines(
      "CH07_SUPPORT",
      4,
      [
        [
          "MINH",
          "neutral",
          "Mình còn hồ sơ bảo hiểm. Cần hỏi họ đã nhận đủ giấy tờ hay thiếu mục nào, đúng không?",
        ],
        [
          "AN",
          "neutral",
          "Ừ. Tớ muốn giữ bản chụp hóa đơn, điều kiện bảo hiểm và ghi lại lần liên hệ, thay vì gửi đi rồi không biết hỏi ai.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Nếu hồ sơ chưa được duyệt hoặc bị từ chối, em hỏi bộ phận hỗ trợ bảo hiểm xem vì sao và cần bổ sung gì. Mình nghe họ giải thích rồi xem lại điều khoản nhé.",
        ],
        [
          "AN",
          "thinking",
          "Mình cũng cần làm theo hướng dẫn của hợp đồng, chứ không nghĩ cứ gửi càng nhiều dữ liệu càng tốt.",
        ],
        [
          "MINH",
          "neutral",
          "Có người nhắn riêng bảo nhận lấy lại tiền và làm bảo hiểm nhanh. Họ muốn một trăm nghìn phí trước.",
        ],
        [
          "AN",
          "worried-money",
          "Em đang muốn giải quyết cho xong nên nghe cũng thấy muốn thử. Họ bảo chỉ mất phí này một lần.",
        ],
        [
          "CO_LINH",
          "neutral",
          "Mình có biết người đó làm ở đâu không? Chỉ gửi tên hay ảnh giao dịch qua chat thì chưa biết họ có thật sự giúp được mình hay không.",
        ],
        [
          "MINH",
          "neutral",
          "Người này tự tìm tới, không phải địa chỉ trong hợp đồng hay nơi mình chủ động hỏi.",
        ],
        [
          "AN",
          "thinking",
          "Nếu chuyển thêm một trăm nghìn mà không có căn cứ thì mình tạo một khoản chi mới, chưa giải quyết được khoản cũ.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Mình xem lại giấy tờ đang có và thông tin liên hệ trong hợp đồng nhé. Sau đó quyết định sẽ nhờ ai hỗ trợ tiếp.",
        ],
      ],
      "CH07_SUPPORT_INSPECT",
    ),
    inspect(
      "CH07_SUPPORT_INSPECT",
      4,
      "Hồ sơ và nơi tìm hỗ trợ",
      [
        {
          id: "records",
          label: "Giữ lại để theo dõi",
          image: `${MINI}/save-evidence.png`,
          facts: [
            [
              "Hồ sơ chi phí",
              "Điều kiện bảo hiểm, hóa đơn, giấy xử lý y tế và mẫu yêu cầu",
            ],
            [
              "Nếu có giao dịch lạ",
              "Thời điểm, mã giao dịch, ảnh tin nhắn; cất riêng, không đăng công khai",
            ],
            [
              "Nhật ký hỗ trợ",
              "Ngày liên hệ, nơi đã hỏi, mã hồ sơ và giấy tờ cần bổ sung",
            ],
          ],
        },
        {
          id: "official",
          label: "Tự tìm đúng nơi",
          image: `${MINI}/official-contact.png`,
          facts: [
            [
              "Về hồ sơ bảo hiểm",
              "Bộ phận hỗ trợ ghi trong hợp đồng hoặc ứng dụng bảo hiểm",
            ],
            [
              "Về giao dịch tài khoản",
              "Gọi số trên thẻ hoặc mở mục hỗ trợ trong ứng dụng ngân hàng",
            ],
            [
              "Người đồng hành",
              "Gia đình, người lớn tin cậy và bàn hỗ trợ của trường",
            ],
            [
              "Nếu người lạ đòi phí trước",
              "Không chuyển tiền để mở khóa, lấy lại tiền hoặc làm hồ sơ theo lời hứa trong tin nhắn",
            ],
          ],
        },
      ],
      "CH07_SC04",
      {
        label: "Chưa có khoản hoàn tiền",
        items: [
          "Khoản bảo hiểm tối đa 200.000đ vẫn chờ xét; báo cáo lừa đảo cũng không tự hoàn lại tổn thất.",
        ],
      },
    ),
    choose(
      "CH07_SC04",
      4,
      "An muốn tiếp tục xử lý hồ sơ và tìm hỗ trợ thế nào?",
      [
        {
          id: "CH07_SC04_A",
          label:
            "Nhờ cô cùng hỏi bên bảo hiểm xem hồ sơ còn thiếu gì, rồi ghi lại mã hồ sơ.",
          deltaStats: { RISK: -8, GOAL: 2 },
          evidenceScores: evidence(2, 1, 2),
          setFlags: { recovery_done: true, recovery_unverified: false },
          nextSceneId: "CH07_OFFICIAL_1",
        },
        {
          id: "CH07_SC04_B",
          label: "Gửi 100.000đ phí trước cho người vừa nhắn để họ làm giúp.",
          requires: { minMoney: 100000 },
          deltaStats: { RISK: 5, GOAL: -2 },
          evidenceScores: evidence(0, 0, 0),
          moneyEvents: [
            moneyEvent(
              "CH07_RECOVERY_FEE_LOSS",
              -100000,
              "Phí chuyển cho người lạ nhận làm hồ sơ",
            ),
          ],
          setFlags: { recovery_done: false, recovery_unverified: true },
          nextSceneId: "CH07_FEE_1",
        },
      ],
      "CH07_SUPPORT",
    ),
    ...lines(
      "CH07_OFFICIAL",
      4,
      [
        [
          "AN",
          "neutral",
          "Em giữ giấy tờ và mã hồ sơ rồi. Nếu cần bổ sung, em hỏi lại bên bảo hiểm, chứ không chuyển phí cho người vừa nhắn.",
        ],
        [
          "MINH",
          "neutral",
          "Lần hỏi sau cậu có thể chỉ rõ đang chờ giấy gì và từ hôm nào. Đỡ phải kể lại từ đầu cho từng người.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Mình đã có cách theo dõi. Nếu có giao dịch bất thường, tiếp tục phối hợp bảo vệ và báo cáo; không vì đã báo một lần mà bỏ kiểm tra thông báo mới.",
        ],
        [
          "AN",
          "thinking",
          "Còn tiền bảo hiểm thì đợi họ trả lời đã. Em chưa tính hai trăm nghìn đó vào tiền có thể tiêu.",
        ],
      ],
      "CH07_CHECK_EXPOSED",
    ),
    ...lines(
      "CH07_FEE",
      4,
      [
        [
          "AN",
          "worried-money",
          "Em đã chuyển một trăm nghìn trong bài cho người nhắn. Họ lại yêu cầu thêm phí để mở hồ sơ.",
        ],
        [
          "MINH",
          "neutral",
          "Lời hứa ban đầu chưa thành khoản tiền về. Mình dừng gửi thêm và giữ lại tin yêu cầu phí mới.",
        ],
        [
          "CO_LINH",
          "explaining",
          "Một trăm nghìn đã chuyển vẫn chưa lấy lại được. Em đừng gửi thêm nhé. Cô sẽ cùng em báo ngân hàng và hỏi bên bảo hiểm về hồ sơ.",
        ],
        [
          "AN",
          "thinking",
          "Em cần có người lớn tin cậy cùng theo dõi và báo việc vừa xảy ra. Em không muốn tự giấu rồi làm tiếp theo họ.",
        ],
      ],
      "CH07_CHECK_EXPOSED",
    ),
    scene("CH07_CHECK_EXPOSED", 4, "conditional", {
      condition: { expression: "flags.fraud_exposed" },
      ifTrueSceneId: "CH07_CLOSE_EXPOSED_1",
      ifFalseSceneId: "CH07_CLOSE_CONTAINED_1",
    }),
    ...lines(
      "CH07_CLOSE_EXPOSED",
      4,
      [
        [
          "AN",
          "thinking",
          "Bài mô phỏng vẫn ghi nhận em đã lộ OTP và mất một trăm năm mươi nghìn. Bước bảo vệ giúp ngăn rủi ro tiếp diễn, không xóa việc đã xảy ra.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Em đã biết dừng lại và nhờ giúp đỡ rồi. Giờ mình tiếp tục kiểm tra tài khoản và làm theo hướng dẫn của ngân hàng nhé.",
        ],
        [
          "MINH",
          "neutral",
          "Tớ có thể ngồi cùng khi cậu rà lại thời điểm và chứng từ. Cậu không cần tự xử lý hết mọi thứ.",
        ],
      ],
      "CH07_CLOSE_1",
    ),
    ...lines(
      "CH07_CLOSE_CONTAINED",
      4,
      [
        [
          "AN",
          "neutral",
          "Em chưa gửi OTP cho họ. Giờ em cần xem lại khoản chi y tế và theo dõi hồ sơ bảo hiểm nữa.",
        ],
        [
          "MINH",
          "neutral",
          "May là chưa mất tiền vì tin đó. Nhưng những tin đến sau mình vẫn phải đọc kỹ và xem ai gửi.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Đúng. Không cần lúc nào cũng hoảng, cũng không cần tin ngay chỉ vì thông tin trông quen.",
        ],
      ],
      "CH07_CLOSE_1",
    ),
    ...lines(
      "CH07_CLOSE",
      4,
      [
        [
          "MINH",
          "neutral",
          "Tớ giữ cặp giúp cậu nhé. Lịch làm bài nhóm để mình sắp theo hướng dẫn của cô y tế và gia đình.",
        ],
        [
          "AN",
          "neutral",
          "Cảm ơn cậu. Tớ sẽ cất hồ sơ riêng, ghi lại việc còn chờ và nhờ gia đình xem cùng.",
        ],
        [
          "CO_LINH",
          "encouraging",
          "Biến cố có thể làm kế hoạch thay đổi. Điều mình làm tiếp là nhìn đúng số tiền đang có, giữ thông tin cần thiết và tìm đúng nơi hỗ trợ.",
        ],
        [
          "AN",
          "thinking",
          "Hôm nay em chưa thể nói mọi khoản đều được hoàn. Nhưng em đã biết cần theo dõi điều gì, và không phải làm theo lời hứa gấp trong tin nhắn.",
        ],
      ],
      "CH07_ENDING",
    ),
    scene("CH07_ENDING", 4, "ending", {
      title: "Kết thúc Chương 7 · Biến cố bất ngờ",
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
          "miniGameNeedsPractice || flags.incident_unresolved || flags.recovery_unverified || flags.fraud_exposed || RISK > 55 || SAVING < 40",
        storyText:
          "An cần luyện thêm cách xử lý khoản chi, kiểm tra tin nhắn hoặc tìm người hỗ trợ. Nếu đã có giao dịch đáng ngờ, cần tiếp tục theo dõi với ngân hàng. Khoản bảo hiểm vẫn chờ xét và chưa được cộng vào ví.",
        characterSprite: sprite("AN", "worried-money"),
      },
      {
        id: "A_GOAL_ACHIEVED",
        title: "Ending A: Goal Achieved",
        condition:
          "flags.incident_resolved && !flags.hot_loan && flags.fraud_contained && flags.recovery_done && choicePercent >= 75 && learningScore >= 75 && miniGameCompleted && miniGameGoalEligible",
        storyText:
          "An xử lý khoản chi bằng tiền đã chuẩn bị, dừng tin giả và giữ đủ giấy tờ và biết liên hệ ai để hỏi tiếp. Tiền bảo hiểm vẫn chờ xét; biết cách xử lý không có nghĩa mọi rủi ro biến mất.",
        characterSprite: sprite("AN", "relieved"),
      },
      {
        id: "B_BALANCED",
        title: "Ending B: Balanced",
        condition: "DEFAULT_FALLBACK",
        storyText:
          "An đã có cách tiếp tục xử lý sự việc và giữ thông tin an toàn. Một số điều kiện, nghĩa vụ hoặc kỹ năng vẫn cần theo dõi; chưa có khoản hoàn tiền tự động nào.",
        characterSprite: sprite("AN", "thinking"),
      },
    ],
  },
  endingReport: {
    choiceGroupMaxima: { CH07_PAYMENT: 6, CH07_FRAUD: 5, CH07_SUPPORT: 5 },
    maxChoiceScore: 6,
    requiredGameIds: ["INSURANCE_DESK_CH07", "SCAM_OR_SAFE_CH07"],
    miniGameLabel: "Bình tĩnh trước rủi ro",
    miniGameMax: 12,
    weights: { choices: 0.65, miniGame: 0.35, reflection: 0 },
    bands: [
      { min: 85, label: "Đã thể hiện vững" },
      { min: 60, label: "Đang hình thành" },
      { min: 0, label: "Cần luyện thêm" },
    ],
    achieved: [
      {
        when: "flags.incident_resolved && !flags.hot_loan",
        text: "Đã dùng 300.000đ hiện có để xử lý khoản y tế, giữ hồ sơ.",
      },
      {
        when: "flags.hot_loan",
        text: "Đã trả khoản y tế trong mô phỏng; còn nghĩa vụ trả 360.000đ sau một tháng.",
      },
      {
        when: "flags.fraud_contained",
        text: "Đã dừng tin giả trước khi gửi OTP.",
      },
      {
        when: "flags.recovery_done",
        text: "Đã hỏi bộ phận hỗ trợ bảo hiểm và ghi lại thông tin hồ sơ.",
      },
    ],
    practice: [
      {
        when: "miniGameNeedsPractice",
        text: "Bài thực hành còn nhiều câu chưa đúng. Xem lại giấy tờ bảo hiểm, bối cảnh tin nhắn và thứ tự xử lý giao dịch đáng ngờ.",
      },
      {
        when: "flags.incident_unresolved",
        text: "Khoản chi y tế và cách hoàn thiện hồ sơ vẫn chưa được xử lý.",
      },
      {
        when: "flags.fraud_exposed",
        text: "Tiếp tục bảo vệ tài khoản và phối hợp theo dõi tổn thất 150.000đ; không có bảo đảm thu hồi.",
      },
      {
        when: "flags.recovery_unverified",
        text: "Không gửi thêm phí cho người tự hứa thu hồi tiền; giữ bằng chứng và liên hệ ngân hàng, bên bảo hiểm bằng thông tin đã có từ trước.",
      },
      {
        text: "Kiểm tra phạm vi bảo hiểm và hồ sơ, không ghi khoản chờ xét thành tiền đã nhận.",
      },
    ],
    nextStep:
      "Xem phản hồi trong ứng dụng bảo hiểm, kiểm tra giao dịch ngân hàng và nhờ gia đình cùng theo dõi.",
  },
};
