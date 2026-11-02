// Preview fixtures only: never infer a real grade from chapter count or local saves.
const sampleGrades = { 1: "A", 2: "B", 3: "C" };
export const difficultyLabels = ["", "Dễ · Hoàn thành", "Vừa · Hạng C", "Khó · Hạng B", "Thử thách cao · Hạng A"];
export const mockAchievementCatalog = Array.from({ length: 8 }, (_, index) => {
  const chapter = index + 1;
  return [null, "C", "B", "A"].map((grade) => ({
    chapter,
    grade,
    difficulty: grade === "A" ? 4 : grade === "B" ? 3 : grade === "C" ? 2 : 1,
    code: `MOCK_CH${chapter}_${grade || "COMPLETE"}`,
    title: grade ? `Chương ${chapter} · Hạng ${grade}` : `Hoàn thành chương ${chapter}`,
    description: grade
      ? `Hoàn thành chương ${chapter} với đánh giá ${grade}.`
      : `Chơi đến cuối chương ${chapter}.`,
    unlocked: grade ? sampleGrades[chapter] === grade : chapter <= 3,
    source: "mock",
    emoji: grade === "A" ? "🥇" : grade === "B" ? "🥈" : grade === "C" ? "🥉" : "🏁",
  }));
}).flat();

export function resolveAchievements(achievements) {
  if (Array.isArray(achievements) && achievements.length) {
    return { source: "api", items: achievements.map((item) => ({ ...item, unlocked: true })) };
  }
  return { source: "mock", items: mockAchievementCatalog };
}

export const mockAchievementNote = "Đang sử dụng mock thành tựu vì dashboard chưa trả huy hiệu. Ví dụ chương 1 hạng A, chương 2 hạng B, chương 3 hạng C; đây không phải kết quả chơi của bạn. Các huy hiệu còn lại là mục tiêu minh họa, chưa có quy tắc chấm hạng từ máy chủ.";
