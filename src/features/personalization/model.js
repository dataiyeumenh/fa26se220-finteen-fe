export const DIMENSIONS = ["gender", "age", "interest"];
export const DIMENSION_LABELS = { gender: "Giới tính", age: "Tuổi", interest: "Sở thích" };
export const CHILD_QUESTIONS = {
  gender: "Em là bạn nam hay bạn nữ?",
  age: "Em bao nhiêu tuổi rồi?",
  interest: "Em thích điều gì nhất?",
};
// These are display translations only. Available answers always come from catalog.
export const VALUE_LABELS = {
  MALE: "Nam", FEMALE: "Nữ", "8_10": "8–10 tuổi", "11_14": "11–14 tuổi", "15_18": "15–18 tuổi",
  SPORT: "Thể thao", GAME: "Trò chơi", MUSIC: "Âm nhạc", ANIME: "Phim / truyện",
  ART: "Vẽ / sáng tạo", TECH: "Công nghệ", FASHION: "Thời trang", TRIP: "Đi chơi",
};
export const STATUS_LABELS = {
  NOT_STARTED: "Chưa cá nhân hoá", WAITING_CHILD: "Chờ bé trả lời",
  WAITING_GAME: "Chờ bé chọn trong game", COMPLETED: "Đã cá nhân hoá", SKIPPED: "Đã bỏ qua",
};
export function personalizationStep(view) {
  if (!view) return null;
  if (["COMPLETED", "SKIPPED"].includes(view.status)) return { done: true };
  if (["NOT_STARTED", "WAITING_CHILD"].includes(view.status)) {
    return { source: "CHILD", dimensions: DIMENSIONS.filter((dim) => view.askChild?.includes(dim)) };
  }
  if (view.status === "WAITING_GAME") {
    return { source: "GAME", dimensions: ["gender", "interest"].filter((dim) => view.askInGame?.includes(dim)) };
  }
  throw new Error("Chưa đọc được trạng thái cá nhân hoá. Vui lòng thử lại.");
}
export function parentAnswers(answers = {}) {
  return Object.fromEntries(DIMENSIONS.map((dim) => [dim, answers?.[dim] ?? null]));
}
