const ASSET_BASE = "/images/finteen-v2/chapter-03";

const BG06 = {
  background: `${ASSET_BASE}/bg/bg06-career-fair.png`,
  backgroundId: "BG06",
};
const BG06B = {
  background: `${ASSET_BASE}/bg/bg06b-course-information-desk.png`,
  backgroundId: "BG06B",
};
const BG06C = {
  background: `${ASSET_BASE}/bg/bg06c-career-report-corner.png`,
  backgroundId: "BG06C",
};
const BG07 = {
  background: `${ASSET_BASE}/bg/bg07-study-desk.png`,
  backgroundId: "BG07",
};

const SPRITE_FOLDERS = {
  AN: "an",
  MINH: "minh",
  CO_LINH: "co-linh",
  TU_VAN: "tu-van",
};

const character = (id, expression, position = "center") => ({
  id,
  expression,
  src: `${ASSET_BASE}/char/${SPRITE_FOLDERS[id]}/${SPRITE_FOLDERS[id]}-${expression}.png`,
  position,
});

const SPEAKERS = {
  AN: "An",
  MINH: "Minh",
  CO_LINH: "Cô Linh",
  TU_VAN: "Người tư vấn",
};

const dialogue = ({
  id,
  title,
  bg,
  who,
  expression,
  position,
  text,
  nextSceneId,
  knowledgeUnits,
  inspect,
  setFlags,
}) => ({
  id,
  type: "dialogue",
  title,
  ...bg,
  characters: [character(who, expression, position)],
  speaker: SPEAKERS[who],
  speakerId: who,
  text,
  nextSceneId,
  knowledgeUnits,
  ...(inspect ? { inspect } : {}),
  ...(setFlags ? { setFlags } : {}),
});

const artScene = ({ id, title, art, nextSceneId, knowledgeUnits }) => ({
  id,
  type: "scene",
  title,
  background: `${ASSET_BASE}/scene/${art}.png`,
  sceneArt: `${ASSET_BASE}/scene/${art}.png`,
  characters: [],
  speaker: null,
  speakerId: null,
  text: null,
  nextSceneId,
  knowledgeUnits,
});

const CAREER_ICONS = `${ASSET_BASE}/asset-mini-game/career-match`;

const JOB_COMPARE_LOCK = "Hãy mở bảng so sánh ba việc trước khi chọn.";
const SOURCE_DATA_LOCK =
  "Hãy mở chương trình khóa học và yêu cầu tuyển dụng trước khi chọn.";

const designOption = (id, nextSceneId, label) => ({
  id,
  label,
  requires: {
    minMoney: 200000,
    flags: ["source_checked"],
    inspected: ["ch03_job_compare"],
    lockedReason:
      "Cần xem bảng so sánh, đã kiểm tra nguồn và phí khóa nhập môn (cảnh 2), và còn ít nhất 200.000đ.",
  },
  moneyEvents: [
    {
      eventId: "ch03_course_fee",
      amount: -200000,
      label: "Phí khóa nhập môn thiết kế",
    },
  ],
  deltaStats: { GOAL: 7 },
  evidenceScores: { I: 2, C: 2, P: 2 },
  flag: "career_fit",
  setFlags: { career_mismatch: false },
  nextSceneId,
});

const smallBusinessOption = (id, nextSceneId, label) => ({
  id,
  label,
  requires: { inspected: ["ch03_job_compare"], lockedReason: JOB_COMPARE_LOCK },
  moneyEvents: [],
  deltaStats: { GOAL: 3 },
  evidenceScores: { I: 2, C: 2, P: 2 },
  flag: "career_fit",
  setFlags: { career_mismatch: false },
  nextSceneId,
});

const jobCompareInspect = {
  id: "ch03_job_compare",
  buttonText: "Xem bảng so sánh ba việc",
  popupImages: [
    {
      src: `${CAREER_ICONS}/commission-sales.png`,
      caption: "Bán hàng hưởng hoa hồng · 16 giờ/tuần",
      description: "Thu nhập có thể lên tới 3.000.000đ!",
    },
    {
      src: `${CAREER_ICONS}/design-assistant.png`,
      caption: "Trợ lý thiết kế · 10 giờ/tuần",
      description:
        "Lương gộp 3.000.000đ, chưa trừ các khoản khấu trừ theo quy định. Cần đóng phí 200.000đ trước.",
    },
    {
      src: `${CAREER_ICONS}/small-business.png`,
      caption: "Bán hàng nhỏ · 12 giờ/tuần",
      description: "Doanh thu mang về 1.200.000đ.",
    },
  ],
  dataText: [
    "Quỹ thời gian của An: tối đa 12 giờ/tuần.",
    "Ngân sách học kỹ năng: 300.000đ.",
  ].join("\n"),
  setFlags: { jobs_compared: true },
};

export const chapter3V2GameData = {
  id: "CH03_V2",
  title: "Công việc đầu tiên",
  version: "2.0",
  initialStats: {
    SAVING: 50,
    HAPPINESS: 50,
    RISK: 30,
    GOAL: 50,
    WEALTH: 0,
    FIQ: 0,
  },
  initialMoney: 300000,
  metadata: {
    chapterId: "CH03",
    targetAge: 17,
    goalDescription:
      "Chọn hướng công việc mô phỏng theo thu nhập thực nhận, kỹ năng, thời gian học và tháng thu nhập thấp; kiểm tra thông tin độc lập trước khi quyết định.",
    coreKnowledgeUnits: ["D02.02", "D02.03", "D02.04", "D02.07"],
    allKnowledgeUnits: [
      "D02.01",
      "D02.02",
      "D02.03",
      "D02.04",
      "D02.05",
      "D02.06",
      "D02.07",
      "D02.08",
      "D08.01",
      "D08.07",
    ],
  },
  sprites: {
    AN: {
      "an-neutral.png": `${ASSET_BASE}/char/an/an-neutral.png`,
      "an-thinking.png": `${ASSET_BASE}/char/an/an-thinking.png`,
      "an-relieved.png": `${ASSET_BASE}/char/an/an-relieved.png`,
      "an-worried-money.png": `${ASSET_BASE}/char/an/an-worried-money.png`,
    },
    MINH: {
      "minh-neutral.png": `${ASSET_BASE}/char/minh/minh-neutral.png`,
      "minh-inviting.png": `${ASSET_BASE}/char/minh/minh-inviting.png`,
    },
    CO_LINH: {
      "co-linh-neutral.png": `${ASSET_BASE}/char/co-linh/co-linh-neutral.png`,
      "co-linh-explaining.png": `${ASSET_BASE}/char/co-linh/co-linh-explaining.png`,
      "co-linh-encouraging.png": `${ASSET_BASE}/char/co-linh/co-linh-encouraging.png`,
    },
    TU_VAN: {
      "tu-van-neutral.png": `${ASSET_BASE}/char/tu-van/tu-van-neutral.png`,
      "tu-van-presenting.png": `${ASSET_BASE}/char/tu-van/tu-van-presenting.png`,
    },
  },
  scenes: [
    // ---- Scene 1: Ba lời mời ----
    artScene({
      id: "CH03_SC01_A",
      title: "Ba lời mời",
      art: "sc01-three-career-offers",
      nextSceneId: "CH03_SC01_B0",
      knowledgeUnits: ["D02.01"],
    }),
    dialogue({
      id: "CH03_SC01_B0",
      title: "Tuần nghề nghiệp",
      bg: BG06,
      who: "CO_LINH",
      expression: "explaining",
      text: "Chào mừng các em đến với Tuần lễ Hướng nghiệp! Thử thách hôm nay là tìm một công việc phù hợp với quỹ thời gian rảnh tối đa 12 tiếng/tuần và số vốn hiện có là 300.000đ. Bàn của cô đang có 3 tấm thẻ công việc giả định để các em tập làm quen với việc quản lý thu nhập, hãy đọc và cân nhắc thật kỹ nhé!",
      nextSceneId: "CH03_SC01_JOBS",
      knowledgeUnits: ["D02.01"],
    }),
    dialogue({
      id: "CH03_SC01_JOBS",
      title: "An xem qua các việc làm",
      bg: BG06,
      who: "AN",
      expression: "thinking",
      text: "Để mình xem qua các việc làm trước đã.",
      nextSceneId: "CH03_SC01_JOBS_CHECK",
      knowledgeUnits: ["D02.01"],
      inspect: jobCompareInspect,
    }),
    {
      id: "CH03_SC01_JOBS_CHECK",
      type: "conditional",
      ifTrueSceneId: "CH03_SC01_B1",
      ifFalseSceneId: "CH03_SC01_JOBS",
      condition: { expression: "flags.jobs_compared" },
    },
    dialogue({
      id: "CH03_SC01_B1",
      title: "Minh rủ chọn hoa hồng",
      bg: BG06,
      who: "MINH",
      expression: "inviting",
      text: "Uầy An ơi, công việc bán hàng hưởng hoa hồng này ghi thu nhập cao nhất tận 3 triệu kìa! Chốt đơn đi ông, nghĩ nhiều làm gì!",
      nextSceneId: "CH03_SC01_B2",
      knowledgeUnits: ["D02.01"],
    }),
    dialogue({
      id: "CH03_SC01_B2",
      title: "Cô Linh nhắc dữ kiện còn thiếu",
      bg: BG06,
      who: "CO_LINH",
      expression: "explaining",
      text: "Minh nhìn kỹ lại xem nào. Con số to nhất trên quảng cáo chưa chắc là số tiền các em được cầm về tay đâu nhé. Thử nghĩ xem, nhỡ tháng đó ế khách thì sao? Hoặc lương 'gộp' có giống lương 'thực nhận' không?",
      nextSceneId: "CH03_SC01_B3",
      knowledgeUnits: ["D02.02", "D02.03"],
    }),
    dialogue({
      id: "CH03_SC01_B3",
      title: "An tách doanh thu và lợi nhuận",
      bg: BG06,
      who: "AN",
      expression: "thinking",
      text: "Đúng rồi đó Minh. Giống như cái việc bán đồ này nè, mang về 1 triệu 2 nhưng mình phải bỏ tiền vốn ra mua vật liệu trước mà. Đâu phải tất cả 1 triệu 2 đó đều là tiền lãi của mình đâu.",
      nextSceneId: "CH03_SC02_A",
      knowledgeUnits: ["D02.04"],
    }),

    // ---- Scene 2: Kiểm tra lời giới thiệu ----
    artScene({
      id: "CH03_SC02_A",
      title: "Kiểm tra lời giới thiệu",
      art: "sc02-checking-course-source",
      nextSceneId: "CH03_SC02_B1",
      knowledgeUnits: ["D08.01"],
    }),
    dialogue({
      id: "CH03_SC02_B1",
      title: "Lời hứa chắc chắn có việc",
      bg: BG06B,
      who: "TU_VAN",
      expression: "presenting",
      text: "Đăng ký khóa này đi em trai! Chỗ anh bảo đảm 100% học xong là có việc làm ngay, lương tháng đầu dư sức bù tiền học phí!",
      nextSceneId: "CH03_SC02_B2",
      knowledgeUnits: ["D08.01"],
    }),
    dialogue({
      id: "CH03_SC02_B2",
      title: "An muốn đọc chương trình",
      bg: BG06B,
      who: "AN",
      expression: "thinking",
      text: "Chắc chắn có việc luôn ạ? Lời hứa này 'mạnh' thật đấy... Nhưng em chưa thấy chương trình học cụ thể, và yêu cầu tuyển dụng của các công ty đối tác nằm ở đâu ạ?",
      nextSceneId: "CH03_SC02_B3",
      knowledgeUnits: ["D08.01", "D08.07"],
    }),
    dialogue({
      id: "CH03_SC02_B3",
      title: "Cô Linh về thuế và dữ liệu thực hành",
      bg: BG06B,
      who: "CO_LINH",
      expression: "explaining",
      text: "Khi ai đó cam kết quá chắc chắn, em thử đoán xem họ có được lợi ích gì khi em gật đầu không? À, còn dòng chữ nhỏ xíu ghi 'khấu trừ thuế' kia nữa, hãy nhớ thuế là khoản đóng góp để nhà nước duy trì dịch vụ công, nhưng trong các ví dụ thực hành của trung tâm thế này, em phải đọc kỹ xem đó là thuế thật hay chỉ là phí ảo nhé.",
      nextSceneId: "CH03_SC02_CHOICE",
      knowledgeUnits: ["D02.08"],
    }),
    {
      id: "CH03_SC02_CHOICE",
      type: "choice",
      title: "Kiểm tra lời giới thiệu",
      ...BG06B,
      characters: [],
      speaker: "An",
      speakerId: "AN",
      text: "Người tư vấn hưởng hoa hồng tuyển sinh. Em sẽ làm gì với lời bảo đảm này?",
      prompt: "Bạn sẽ làm gì với lời bảo đảm có việc?",
      inspect: {
        id: "ch03_source_data",
        buttonText: "Mở chương trình và yêu cầu tuyển dụng",
        popupImage: `${ASSET_BASE}/props/source-check-laptop.png`,
        dataText: [
          "Về người tư vấn: Phát hiện ra họ nhận được tiền hoa hồng trên mỗi học viên đăng ký. (Cẩn thận: Lời khuyên của họ có thể thiên vị vì lợi ích cá nhân!)",
          "Về khóa học thiết kế: Website trường có đăng chương trình học rõ ràng, nhưng không có văn bản nào cam kết chắc chắn có việc làm ngay như lời quảng cáo.",
          "Phí khóa nhập môn: 200.000đ.",
        ].join("\n"),
      },
      options: [
        {
          id: "CH03_SC02_CHOICE_A",
          label:
            "Đối chiếu chương trình học, chi phí và nguồn tuyển dụng độc lập",
          requires: {
            inspected: ["ch03_source_data"],
            lockedReason: SOURCE_DATA_LOCK,
          },
          moneyEvents: [],
          deltaStats: { RISK: -1, GOAL: 1 },
          evidenceScores: { I: 2, C: 1, P: 2 },
          flag: "source_checked",
          setFlags: { source_unchecked: false },
          nextSceneId: "CH03_SC02_A_R1",
        },
        {
          id: "CH03_SC02_CHOICE_B",
          label: "Đăng ký liền tay luôn",
          requires: {
            inspected: ["ch03_source_data"],
            lockedReason: SOURCE_DATA_LOCK,
          },
          moneyEvents: [],
          deltaStats: { RISK: 3 },
          evidenceScores: { I: 0, C: 0, P: 0 },
          flag: "source_unchecked",
          setFlags: { source_checked: false },
          nextSceneId: "CH03_SC02_B_R1",
        },
      ],
      knowledgeUnits: ["D02.08", "D08.01", "D08.07"],
    },
    dialogue({
      id: "CH03_SC02_A_R1",
      title: "Đã kiểm tra nguồn thông tin",
      bg: BG06B,
      who: "AN",
      expression: "relieved",
      text: "Trường này có dạy thiết kế thật, nhưng trên website không có văn bản nào cam kết '100% có việc làm' cả.",
      nextSceneId: "CH03_SC02_JOIN",
      knowledgeUnits: ["D08.01"],
    }),
    dialogue({
      id: "CH03_SC02_B_R1",
      title: "Nguồn thông tin chưa kiểm tra",
      bg: BG06B,
      who: "CO_LINH",
      expression: "explaining",
      text: "An ơi, em quyết định hơi vội rồi. Khi một người cố gắng thuyết phục em bằng mọi giá, rất có thể họ đang được nhận tiền hoa hồng trên chính quyết định của em đấy. Nhớ nhé, đừng bao giờ gật đầu với một lời hứa mà em chưa tự tay kiểm chứng.",
      nextSceneId: "CH03_SC02_JOIN",
      knowledgeUnits: ["D08.01", "D08.07"],
    }),
    {
      // Hội tụ về cảnh 3: lần đầu xem đầy đủ cảnh, khi quay lại sửa kế hoạch thì vào thẳng lựa chọn.
      id: "CH03_SC02_JOIN",
      type: "conditional",
      title: "Điểm hội tụ cảnh 3",
      condition: { check: "flags.career_plan_opened" },
      ifTrueSceneId: "CH03_SC03_CHOICE",
      ifFalseSceneId: "CH03_SC03_A",
      characters: [],
      knowledgeUnits: [],
    },

    // ---- Scene 3: Chọn công việc và kỹ năng ----
    artScene({
      id: "CH03_SC03_A",
      title: "Lịch tuần của An",
      art: "sc03-weekly-career-plan",
      nextSceneId: "CH03_SC03_B1",
      knowledgeUnits: ["D02.03"],
    }),
    dialogue({
      id: "CH03_SC03_B1",
      title: "An nhìn quỹ thời gian",
      bg: BG07,
      who: "AN",
      expression: "worried-money",
      text: "Nhìn lịch tuần này xem, mình rảnh tối đa có 12 tiếng thôi. Công việc bán hàng nhận hoa hồng kia yêu cầu làm tận 16 tiếng, chọn là kiểu gì cũng cấn lịch học trên trường cho xem.",
      nextSceneId: "CH03_SC03_B2",
      knowledgeUnits: ["D02.03"],
    }),
    dialogue({
      id: "CH03_SC03_B2",
      title: "Minh nhắc học phí trả trước",
      bg: BG07,
      who: "MINH",
      expression: "neutral",
      text: "Công nhận. Nhưng ông tính sao vụ làm trợ lý thiết kế? Muốn nhận việc đó thì ngay hôm nay phải bỏ ra 200.000đ đóng học phí khóa nhập môn trước đấy nhé!",
      nextSceneId: "CH03_SC03_B3",
      knowledgeUnits: ["D02.04"],
    }),
    dialogue({
      id: "CH03_SC03_B3",
      title: "Mở Career Match",
      bg: BG07,
      who: "CO_LINH",
      expression: "explaining",
      text: "Khoan chốt vội nhé An! Em thử mở Career Match lên để kiểm tra xem việc nào khớp với lịch rảnh và tự tính lại số tiền thực nhận xem sao. Nhớ quy tắc này: 'lương trên giấy' chưa phải là tiền trong ví, nên số dư tài khoản hiện tại sẽ chưa tăng lên đâu, nó chỉ bị trừ đi nếu em chọn việc phải đóng phí trước thôi.",
      nextSceneId: "CH03_SC03_CAREER_MATCH",
      setFlags: { career_plan_opened: true },
      knowledgeUnits: ["D02.03", "D02.04", "D02.07"],
    }),
    {
      id: "CH03_SC03_CAREER_MATCH",
      type: "minigame",
      title: "Career Match: ghép nghề với kỹ năng và thời gian",
      ...BG07,
      characters: [],
      speaker: null,
      speakerId: null,
      text: null,
      game: {
        id: "CAREER_MATCH_CH03",
        mechanic: "MATCH_AND_CALCULATE",
        title: "Career Match",
        instruction:
          "Ghép từng việc với quỹ thời gian 12 giờ/tuần, rồi tính thu nhập thực nhận, lợi nhuận và khoản linh hoạt của tháng thấp.",
        weeklyLimit: 12,
        timeImage: `${CAREER_ICONS}/time-availability.png`,
        jobs: [
          {
            id: "commission",
            name: "Bán hàng hoa hồng",
            image: `${CAREER_ICONS}/commission-sales.png`,
            hours: 16,
            facts: ["Tháng tốt: 3.000.000đ", "Tháng thấp: 2.000.000đ"],
          },
          {
            id: "design",
            name: "Trợ lý thiết kế",
            image: `${CAREER_ICONS}/design-assistant.png`,
            hours: 10,
            facts: [
              "Lương gộp: 3.000.000đ",
              "Khấu trừ giả định: 300.000đ",
              "Khóa nhập môn: 200.000đ",
            ],
          },
          {
            id: "small-business",
            name: "Bán sản phẩm nhỏ",
            image: `${CAREER_ICONS}/small-business.png`,
            hours: 12,
            facts: ["Doanh thu: 1.200.000đ", "Chi phí: 800.000đ"],
          },
        ],
        questions: [
          {
            id: "net_salary",
            title: "Trợ lý thiết kế: Lương thực nhận",
            formula:
              "Đừng để mức lương 'gộp' trên poster đánh lừa! Hãy tính số tiền An thực sự được mang về túi sau khi trừ đi các khoản khấu trừ bắt buộc.",
            options: [
              { id: "a", label: "2.700.000đ" },
              { id: "b", label: "3.300.000đ" },
              { id: "c", label: "2.400.000đ" },
            ],
            correctId: "a",
            hint: "Lương gộp là số trước khấu trừ. Thực nhận = lương gộp trừ khấu trừ là 300.000đ.",
            explain:
              "Chính xác! Lương thực nhận = Lương gộp (3.000.000đ) - Khấu trừ (300.000đ). Phải luôn phân biệt rõ hai khái niệm này nhé!",
          },
          {
            id: "profit",
            title: "Bán sản phẩm nhỏ: Lợi nhuận",
            formula:
              "Tiền bán hàng thu về (Doanh thu) chưa chắc là tiền của mình! Nhớ trừ đi phần tiền túi An phải tự ứng ra trước để nhập hàng nhé.",
            options: [
              { id: "a", label: "2.000.000đ" },
              { id: "b", label: "400.000đ" },
              { id: "c", label: "1.200.000đ" },
            ],
            correctId: "b",
            hint: "Doanh thu chưa phải tiền lãi. Lợi nhuận = doanh thu trừ chi phí.",
            explain:
              "Chuẩn luôn! Lợi nhuận = Doanh thu (1.200.000đ) - Chi phí vốn (800.000đ). Kinh doanh là phải tính cả chi phí rủi ro!",
          },
          {
            id: "low_month",
            title: "Tháng hoa hồng thấp: Bài toán bấp bênh thu nhập",
            formula:
              "Tháng này ế khách! Nếu An kiếm được mức thu nhập thấp nhất, sau khi thanh toán hết các chi phí sinh hoạt 'Thiết yếu', quỹ tiền cho các khoản 'Linh hoạt' còn lại bao nhiêu?",
            options: [
              { id: "a", label: "3.800.000đ" },
              { id: "b", label: "0đ" },
              { id: "c", label: "200.000đ" },
            ],
            correctId: "c",
            hint: "Lấy thu nhập tháng thấp trừ phần chi phí thiết yếu để biết còn bao nhiêu cho khoản linh hoạt.",
            explain:
              "Quá đỉnh! Quỹ linh hoạt = Thu nhập tháng thấp (2.000.000đ) - Chi phí thiết yếu (1.800.000đ). Cầm 200.000đ thì tháng này An phải 'thắt lưng buộc bụng' lắm đây!",
          },
        ],
        maxScore: 6,
      },
      nextSceneId: "CH03_SC03_CHOICE",
      onPassSceneId: "CH03_SC03_CHOICE",
      onFailSceneId: "CH03_SC03_CAREER_MATCH",
      knowledgeUnits: ["D02.03", "D02.04", "D02.07"],
    },
    {
      id: "CH03_SC03_CHOICE",
      type: "choice",
      title: "Chọn công việc và kỹ năng",
      ...BG07,
      characters: [],
      speaker: "An",
      speakerId: "AN",
      text: "Không nhận lương ngay khi chọn. Mình sẽ chọn hướng nào?",
      prompt: "Bạn chọn công việc nào?",
      inspect: jobCompareInspect,
      reviewAction: {
        label: "Quay lại kiểm tra nguồn",
        targetSceneId: "CH03_SC02_CHOICE",
      },
      options: [
        designOption(
          "CH03_SC03_CHOICE_A",
          "CH03_SC03_A_R1",
          "Làm Trợ lý thiết kế",
        ),
        {
          id: "CH03_SC03_CHOICE_B",
          label: "Nhận việc bán hàng hoa hồng",
          requires: {
            inspected: ["ch03_job_compare"],
            lockedReason: JOB_COMPARE_LOCK,
          },
          moneyEvents: [],
          deltaStats: { HAPPINESS: -4, GOAL: 1 },
          evidenceScores: { I: 0, C: 0, P: 0 },
          flag: "career_mismatch",
          setFlags: { career_fit: false },
          nextSceneId: "CH03_SC03_B_R1",
        },
        smallBusinessOption(
          "CH03_SC03_CHOICE_C",
          "CH03_SC03_D_R1",
          "Tự bán sản phẩm nhỏ",
        ),
      ],
      knowledgeUnits: ["D02.03", "D02.04", "D02.07"],
    },
    dialogue({
      id: "CH03_SC03_A_R1",
      title: "Đã trả phí khóa nhập môn",
      bg: BG07,
      who: "AN",
      expression: "relieved",
      text: "Chấp nhận đau ví chút vậy, tài khoản chỉ còn đúng 100.000đ. Nhưng bù lại, công việc này chỉ tốn 10 tiếng một tuần, mình vẫn dư sức đi học đầy đủ mà không lo trễ nải.",
      nextSceneId: "CH03_SC04_A",
      knowledgeUnits: ["D02.03", "D02.04"],
    }),
    dialogue({
      id: "CH03_SC03_B_R1",
      title: "Lịch học bị chồng",
      bg: BG07,
      who: "AN",
      expression: "worried-money",
      text: "Ủa chết, công việc này lẹm mất 4 tiếng vào lịch học chính trên trường rồi!",
      nextSceneId: "CH03_SC03_C_R1",
      knowledgeUnits: ["D02.03", "D02.07"],
    }),
    dialogue({
      id: "CH03_SC03_C_R1",
      title: "Lịch học bị chồng",
      bg: BG07,
      who: "CO_LINH",
      expression: "encouraging",
      text: "Làm thêm là tốt, nhưng đừng để ảnh hưởng đến việc học chính nhé An. Em xem lại lịch và cân nhắc đổi phương án khác xem sao?",
      nextSceneId: "CH03_SC03_REVISE",
      knowledgeUnits: ["D02.03", "D02.07"],
    }),
    {
      id: "CH03_SC03_REVISE",
      type: "choice",
      title: "Sửa kế hoạch công việc",
      ...BG07,
      characters: [],
      speaker: "Cô Linh",
      speakerId: "CO_LINH",
      text: "Lịch học đang bị cấn mất 4 tiếng! Mình phải đổi phương án thôi...",
      prompt: "Bạn sửa kế hoạch ra sao?",
      choiceGroup: "CH03_SC03_CHOICE",
      inspect: jobCompareInspect,
      reviewAction: {
        label: "Quay lại kiểm tra nguồn",
        targetSceneId: "CH03_SC02_CHOICE",
      },
      options: [
        designOption(
          "CH03_SC03_REVISE_A",
          "CH03_SC03_A_R1",
          "Quay xe làm trợ lý thiết kế",
        ),
        smallBusinessOption(
          "CH03_SC03_REVISE_C",
          "CH03_SC03_D_R1",
          "Chuyển sang Tự bán sản phẩm nhỏ",
        ),
        {
          id: "CH03_SC03_REVISE_KEEP",
          label: "Mặc kệ, cứ chọn Bán hàng hoa hồng!",
          moneyEvents: [],
          deltaStats: { HAPPINESS: -4, GOAL: 1 },
          evidenceScores: { I: 0, C: 0, P: 0 },
          flag: "career_mismatch",
          setFlags: { career_fit: false },
          nextSceneId: "CH03_SC04_A",
        },
      ],
      knowledgeUnits: ["D02.03", "D02.07"],
    },
    dialogue({
      id: "CH03_SC03_D_R1",
      title: "Chọn bán hàng nhỏ",
      bg: BG07,
      who: "AN",
      expression: "thinking",
      text: "Tuy tiền lời ít hơn mấy việc kia thật, nhưng thời gian lại vừa khít với lịch rảnh của mình. Chậm mà chắc, chọn cái này là hợp lý nhất rồi!",
      nextSceneId: "CH03_SC04_A",
      knowledgeUnits: ["D02.03", "D02.04"],
    }),

    // ---- Scene 4: Ngày báo cáo nghề nghiệp ----
    artScene({
      id: "CH03_SC04_A",
      title: "Ngày báo cáo nghề nghiệp",
      art: "sc04-career-report",
      nextSceneId: "CH03_SC04_B1",
      knowledgeUnits: ["D02.07", "D02.08"],
    }),
    dialogue({
      id: "CH03_SC04_B1",
      title: "Cô Linh hỏi về căn cứ lựa chọn",
      bg: BG06C,
      who: "CO_LINH",
      expression: "encouraging",
      text: "Tổng kết lại chặng đường hôm nay nào An! Sau bao nhiêu lần 'cân não', em đã rút ra được bí kíp gì khi chốt một công việc chưa? Và giả sử lỡ rơi vào những tháng 'ế khách', thu nhập sụt giảm thì em sẽ làm gì?",
      nextSceneId: "CH03_SC04_B2",
      knowledgeUnits: ["D02.07"],
    }),
    dialogue({
      id: "CH03_SC04_B2",
      title: "An trình bày căn cứ",
      bg: BG06C,
      who: "AN",
      expression: "thinking",
      text: "Dạ, bài học nhớ đời của em là không được lóa mắt bởi những con số to đùng trên quảng cáo nữa ạ! Từ giờ chọn việc, em phải soi xem lịch làm có khớp với thời gian rảnh không, tự nhẩm xem 'lương thực nhận' cầm về túi là bao nhiêu, và tuyệt đối phảikiểm chứng thông tin chứ không nghe mấy lời hứa suông.",
      nextSceneId: "CH03_SC04_R1",
      knowledgeUnits: ["D02.07", "D08.07"],
    }),
    {
      id: "CH03_SC04_R1",
      type: "choice",
      title: "Reflection 1: dữ kiện và phép tính",
      ...BG06C,
      characters: [],
      speaker: "Cô Linh",
      speakerId: "CO_LINH",
      text: "Tóm lại, bài học rút ra ở đây là gì nhỉ? Khi cân nhắc một công việc, mình bắt buộc phải soi kỹ những cái gì?",
      prompt:
        "Tóm lại, bài học rút ra ở đây là gì nhỉ? Khi cân nhắc một công việc, mình bắt buộc phải soi kỹ những cái gì?",
      options: [
        {
          id: "CH03_SC04_R1_A",
          label:
            "Soi toàn diện! Cân đối thời gian làm việc, tính 'lương cầm về' và phải kiểm chứng thông tin!",
          reflectionScore: 2,
          nextSceneId: "CH03_SC04_R2",
        },
        {
          id: "CH03_SC04_R1_B",
          label: "Chỉ quan tâm Lương và Giờ làm",
          reflectionScore: 1,
          nextSceneId: "CH03_SC04_R2",
        },
        {
          id: "CH03_SC04_R1_C",
          label: "Cứ thấy số tiền to nhất là chốt!",
          reflectionScore: 0,
          nextSceneId: "CH03_SC04_R2",
        },
      ],
      knowledgeUnits: ["D02.07"],
    },
    {
      id: "CH03_SC04_R2",
      type: "choice",
      title: "Reflection 2: đánh đổi và bước tiếp theo",
      ...BG06C,
      characters: [],
      speaker: "Cô Linh",
      speakerId: "CO_LINH",
      text: "Nhìn lại quyết định vừa rồi, nhận ra bài học lớn nhất khi đi làm là gì nhỉ?",
      prompt:
        "Nhìn lại quyết định vừa rồi, nhận ra bài học lớn nhất khi đi làm là gì nhỉ?",
      options: [
        {
          id: "CH03_SC04_R2_A",
          label:
            "Chấp nhận tốn phí học hoặc lãi ít đi để bảo vệ lịch học, và phải luôn có sẵn kế hoạch dự phòng cho những tháng 'ế khách'.",
          reflectionScore: 2,
          nextSceneId: "CH03_ENDING",
        },
        {
          id: "CH03_SC04_R2_B",
          label:
            "Chỉ biết chấp nhận mất tiền/thời gian trước mắt, còn hậu quả hay kế hoạch sau này thì... tới đâu hay tới đó!",
          reflectionScore: 1,
          nextSceneId: "CH03_ENDING",
        },
        {
          id: "CH03_SC04_R2_C",
          label:
            "Chẳng quan tâm đánh đổi! Cứ việc nào ghi lương to nhất là chốt.",
          reflectionScore: 0,
          nextSceneId: "CH03_ENDING",
        },
      ],
      knowledgeUnits: ["D02.08", "D08.07"],
    },
    {
      id: "CH03_ENDING",
      type: "ending",
      title: "Kết thúc Chương 3",
      ...BG06C,
      characters: [],
      speaker: null,
      speakerId: null,
      text: null,
      nextSceneId: null,
      knowledgeUnits: [],
    },
  ],

  endingRules: {
    priorityOrder: ["C_RECOVERY", "A_GOAL_ACHIEVED", "B_BALANCED"],
    endings: [
      {
        id: "C_RECOVERY",
        title: "Ending C: Recovery",
        condition:
          "flags.career_mismatch || !flags.source_checked || RISK > 55 || SAVING < 40",
        storyText:
          "An cần xem lại thông tin nghề: “Mức lương quảng cáo chưa đủ để quyết định.”",
        characterSprite: `${ASSET_BASE}/char/an/an-worried-money.png`,
        position: "center",
        backgroundId: "BG06C",
      },
      {
        id: "A_GOAL_ACHIEVED",
        title: "Ending A: Goal Achieved",
        condition:
          "flags.career_fit && flags.source_checked && !flags.choiceRevised && evidenceScore >= 9 && miniGameCompleted && reflectionScore >= 3",
        storyText:
          "An nộp lịch khả thi: “Mình đã chọn bằng dữ kiện, kể cả chi phí học trước mắt.”",
        characterSprite: `${ASSET_BASE}/char/an/an-relieved.png`,
        position: "center",
        backgroundId: "BG06C",
      },
      {
        id: "B_BALANCED",
        title: "Ending B: Balanced",
        condition: "DEFAULT_FALLBACK",
        storyText:
          "An sửa lịch hoặc chọn con đường khác phù hợp: “Mình có một phương án đủ căn cứ để thử.”",
        characterSprite: `${ASSET_BASE}/char/an/an-thinking.png`,
        position: "center",
        backgroundId: "BG06C",
      },
    ],
  },

  endingReport: {
    maxChoiceScore: 6,
    miniGameMax: 6,
    reflectionMax: 4,
    weights: { choices: 0.6, miniGame: 0.3, reflection: 0.1 },
    bands: [
      { min: 85, label: "Đã thể hiện vững" },
      { min: 60, label: "Đang hình thành" },
      { min: 0, label: "Cần luyện thêm" },
    ],
    achieved: [
      {
        when: "flags.source_checked",
        text: "Bạn đã đối chiếu chương trình, chi phí và nguồn tuyển dụng độc lập trước khi quyết định.",
      },
      {
        when: "flags.career_fit",
        text: "Bạn chọn công việc khớp quỹ thời gian 12 giờ/tuần và dựa trên số tiền thực nhận.",
      },
      {
        text: "Bạn đã hoàn thành Career Match và tính được thực nhận, lợi nhuận và khoản linh hoạt của tháng thấp.",
      },
    ],
    practice: [
      {
        when: "!flags.source_checked",
        text: "Hỏi xem người giới thiệu có hưởng hoa hồng không và đối chiếu nguồn độc lập trước khi tin lời bảo đảm.",
      },
      {
        when: "flags.career_mismatch",
        text: "Đặt số giờ làm cạnh quỹ thời gian trước khi nhìn mức thu nhập cao nhất.",
      },
      {
        when: "flags.choiceRevised",
        text: "Kiểm tra dữ kiện ngay từ lần chọn đầu để không phải sửa kế hoạch.",
      },
      {
        text: "Lập sẵn kế hoạch cho tháng thu nhập thấp: 2.000.000đ trừ 1.800.000đ thiết yếu còn 200.000đ linh hoạt.",
      },
    ],
    nextStep:
      "Mua thông minh: so sánh tổng giá trị, hợp đồng, thuê bao và quyền khiếu nại.",
  },
};
