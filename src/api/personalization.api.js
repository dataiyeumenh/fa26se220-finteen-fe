// Cá nhân hoá theo từng bé (BE PR #57, docs build/api-docs/personalization.md). FE không ghép gì:
// phụ huynh / bé chỉ gửi câu trả lời; BE ra nhãn và trả chương đã ghép.
import { auth } from "./auth.api.js";

const slotPath = (id) => `/api/slots/${encodeURIComponent(id)}/personalization`;

export const personalizationApi = {
  // Phụ huynh (token ACCOUNT, chủ nhóm). answers: { gender, age, interest } — null = "để bé tự chọn".
  getForParent: (slotId) => auth.accountRequest(slotPath(slotId)),
  saveForParent: (slotId, answers) =>
    auth.accountRequest(slotPath(slotId), { method: "PUT", body: answers }),
  // Bé (token SLOT). source: "CHILD" (màn hỏi nhanh) | "GAME" (game chọn phụ). answers rỗng = bỏ qua.
  getForChild: () => auth.slotRequest("/api/play/personalization"),
  saveForChild: (source, answers) =>
    auth.slotRequest("/api/play/personalization", {
      method: "PUT",
      body: { source, answers },
    }),
  chapterForChild: (version, code) =>
    auth.slotRequest(
      `/api/play/releases/${encodeURIComponent(version)}/chapters/${encodeURIComponent(code)}`,
    ),
};

export const DIMENSION_LABELS = { gender: "Nhân vật", age: "Tuổi", interest: "Sở thích" };
export const VALUE_LABELS = {
  MALE: "Bạn nam", FEMALE: "Bạn nữ",
  "8_10": "8–10 tuổi", "11_14": "11–14 tuổi", "15_18": "15–18 tuổi",
  SPORT: "Thể thao", GAME: "Game", MUSIC: "Âm nhạc", ANIME: "Phim / truyện",
  ART: "Vẽ / sáng tạo", TECH: "Công nghệ", FASHION: "Thời trang", TRIP: "Đi chơi",
};
export const VALUE_EMOJI = {
  MALE: "🧑", FEMALE: "👧", SPORT: "⚽", GAME: "🎮", MUSIC: "🎧", ANIME: "📚",
  ART: "🎨", TECH: "🤖", FASHION: "👟", TRIP: "📷",
};
