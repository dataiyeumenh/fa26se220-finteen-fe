const ASSET_BASE = "/images/story/chapter-1";

const backgrounds = {
  roomNight: `${ASSET_BASE}/background/c1_bg_piggybank_room_empty.png`,
  shopInside: `${ASSET_BASE}/background/c1_bg_shop_interior_empty.png`,
  shopOverview: `${ASSET_BASE}/background/c1_bg_shop_overview.png`,
  garden: `${ASSET_BASE}/background/c1_bg_garden_empty.png`,
  schoolyard: `${ASSET_BASE}/background/c1_bg_schoolyard_empty.png`,
  road: `${ASSET_BASE}/background/c1_bg_road_empty.png`,
  bridge: `${ASSET_BASE}/background/c1_bg_bridge_empty.png`,
  sickbed: `${ASSET_BASE}/background/c1_bg_sickbed_empty.png`,
};

const sprites = {
  ti: {
    neutral: `${ASSET_BASE}/characters/c1_ti_neutral.png`,
    curious: `${ASSET_BASE}/characters/c1_ti_curious.png`,
    worried: `${ASSET_BASE}/characters/c1_ti_worried.png`,
    happy: `${ASSET_BASE}/characters/c1_ti_happy.png`,
  },
  me: {
    neutral: `${ASSET_BASE}/characters/c1_me_neutral.png`,
    caring: `${ASSET_BASE}/characters/c1_me_caring.png`,
  },
  bo: {
    neutral: `${ASSET_BASE}/characters/c1_bo_neutral.png`,
    strict: `${ASSET_BASE}/characters/c1_bo_strict.png`,
  },
  teo: {
    neutral: `${ASSET_BASE}/characters/c1_teo_neutral.png`,
    excited: `${ASSET_BASE}/characters/c1_teo_excited.png`,
  },
  hung: {
    neutral: `${ASSET_BASE}/characters/c1_hung_neutral.png`,
    proud: `${ASSET_BASE}/characters/c1_hung_proud.png`,
  },
  cotu: {
    neutral: `${ASSET_BASE}/characters/c1_cotu_neutral.png`,
    grumpy: `${ASSET_BASE}/characters/c1_cotu_grumpy.png`,
  },
};

const miniGameItems = [
  {
    id: "rice",
    label: "Gạo",
    category: "need",
    image: `${ASSET_BASE}/mini-game/rice.png`,
  },
  {
    id: "student-book",
    label: "Student book",
    category: "need",
    image: `${ASSET_BASE}/mini-game/student-book.png`,
  },
  {
    id: "water-bottle",
    label: "Water bottle",
    category: "need",
    image: `${ASSET_BASE}/mini-game/water-bottle.png`,
  },
  {
    id: "bimbim",
    label: "Bim bim",
    category: "want",
    image: `${ASSET_BASE}/mini-game/bimbim.png`,
  },
  {
    id: "comic-book",
    label: "Comic book",
    category: "want",
    image: `${ASSET_BASE}/mini-game/comic-book.png`,
  },
  {
    id: "game-gift-card",
    label: "Game gift card",
    category: "want",
    image: `${ASSET_BASE}/mini-game/game-gift-card.png`,
  },
];

export const chapter1GameData = {
  id: "chapter-1",
  title: "Chuong 1 - Kham Pha Tien Te",
  subtitle: "Needs vs Wants | Nguon goc cua tien",
  sprites,
  initialStats: {
    wealth: 40,
    savings: 25,
    financialIq: 20,
    happiness: 60,
    risk: 45,
    goal: 5,
  },
  scenes: [
    {
      id: "s1",
      type: "narrator",
      background: backgrounds.roomNight,
      text: "Dem o lang que, Ti ngoi ben heo dat va lan dau tien tu hoi: tien den tu dau, va minh nen dung no nhu the nao?",
    },
    {
      id: "s2",
      type: "dialogue",
      background: backgrounds.roomNight,
      speaker: "Ti",
      speakerId: "ti",
      text: "Me oi, con mua bim bim ngay duoc khong? Con doi no ca tuan roi.",
      characters: [
        { id: "ti", expression: "curious", position: "left" },
        { id: "me", expression: "caring", position: "right" },
      ],
    },
    {
      id: "s3",
      type: "dialogue",
      background: backgrounds.roomNight,
      speaker: "Me",
      speakerId: "me",
      text: "Duoc, nhung con thu phan biet xem cai nao la Can, cai nao la Muon truoc da nhe.",
      characters: [
        { id: "ti", expression: "neutral", position: "left" },
        { id: "me", expression: "neutral", position: "right" },
      ],
    },
    {
      id: "s3-choice",
      type: "choice",
      background: backgrounds.roomNight,
      prompt: "Trong heo dat con 50k. Toi nay con muon quyet dinh sao?",
      options: [
        {
          id: "save-first",
          label: "Giữ lại 30k tiết kiệm, 20k mua đồ cần",
          nextSceneId: "s4",
          effects: {
            savings: +12,
            financialIq: +8,
            risk: -6,
            goal: +5,
            happiness: -2,
          },
        },
        {
          id: "spend-all",
          label: "Mua hết đồ thích ngay",
          nextSceneId: "s4",
          effects: {
            happiness: +8,
            savings: -10,
            financialIq: -4,
            risk: +10,
            goal: -2,
          },
        },
      ],
    },
    {
      id: "s4",
      type: "minigame",
      background: backgrounds.roomNight,
      prompt: "Hay keo tha vat pham vao dung vung: Can hoac Muon.",
      onPassEffects: { financialIq: +10, savings: +6, risk: -5, goal: +4 },
      game: {
        id: "need-vs-want",
        zones: ["inventory", "need", "want"],
        items: miniGameItems,
      },
    },
    {
      id: "s5",
      type: "narrator",
      background: backgrounds.shopOverview,
      text: "Hom sau, Ti den tap hoa Co Tu. Lan nay, Ti khong mua theo cam xuc nua ma tinh toan ky hon.",
    },
    {
      id: "s6",
      type: "dialogue",
      background: backgrounds.shopInside,
      speaker: "Co Tu",
      speakerId: "cotu",
      text: "Con chon gioi day. Biet uu tien cai Can truoc thi sau nay de tiet kiem lam.",
      characters: [
        { id: "ti", expression: "happy", position: "left" },
        { id: "cotu", expression: "neutral", position: "right" },
      ],
    },
    {
      id: "s7",
      type: "dialogue",
      background: backgrounds.schoolyard,
      speaker: "Teo",
      speakerId: "teo",
      text: "Toan mua theo trend la het tien do. Tui minh de danh mot it moi an tam.",
      characters: [
        { id: "teo", expression: "excited", position: "left" },
        { id: "ti", expression: "neutral", position: "right" },
      ],
    },
    {
      id: "s8",
      type: "narrator",
      background: backgrounds.garden,
      text: "Tu nhung quyet dinh nho, Ti bat dau hieu: tien la cong suc, va moi lan mua sam deu la mot lua chon.",
    },
    {
      id: "s9",
      type: "dialogue",
      background: backgrounds.road,
      speaker: "Ti",
      speakerId: "ti",
      text: "Tu nay con se ghi lai chi tieu, de biet minh dang song theo Can hay theo Muon.",
      characters: [{ id: "ti", expression: "happy", position: "left" }],
      effects: { goal: +3, financialIq: +4 },
    },
    {
      id: "s10-end",
      type: "narrator",
      background: backgrounds.bridge,
      text: "Tong ket Chuong 1: Moi dong tien deu mang theo mot lua chon. Ban da xay duoc nen tang tai chinh dau tien cho hanh trinh 8 chuong.",
    },
  ],
};
