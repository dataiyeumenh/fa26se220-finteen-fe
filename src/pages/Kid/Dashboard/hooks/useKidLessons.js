import { useWorkspace } from "@/features/workspace/useWorkspace";
import { CHAPTERS, canAccessChapter } from "@/features/workspace/model";
export function useKidLessons() {
  const { actor } = useWorkspace();
  const chapters = CHAPTERS.map((subtitle, i) => ({
    id: i + 1,
    title: `Chương ${i + 1}`,
    subtitle,
    description:
      i === 0
        ? "Trải nghiệm chương đầu tiên"
        : i === 5
          ? "Cùng An so chi phí vay, xếp lịch trả và lập kế hoạch laptop"
          : "Nội dung đang được chuẩn bị",
    color: "#82a267",
    status:
      i === 0
        ? "current"
        : canAccessChapter(actor, i + 1)
          ? "available"
          : "locked",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 5,
  }));
  return { chapters, loading: false, error: "" };
}
