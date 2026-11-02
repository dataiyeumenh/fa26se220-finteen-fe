import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/dashboard/StatCard";
import { useNavigate } from "react-router-dom";

const progressColors = ["#fbbf24", "#f59e0b", "#d97706", "#38bdf8", "#22c55e"];

export default function ContinueLearning({
  lessons,
  accent = "#fbbf24",
  accentText = "#92400e",
}) {
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      <SectionHeader
        title="Tiếp tục học"
        subtitle="Bài học bạn đang dở dang"
        emoji="📖"
        action={
          <Button
            onClick={() => navigate("/dashboard/kid/lessons")}
            variant="outline"
            size="sm"
            className="border-2 hover:text-[#1a3a1a]"
            style={{
              borderColor: accent,
              color: accentText,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = accent;
              e.currentTarget.style.color = "#1a3a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = accentText;
            }}
          >
            Xem tất cả
          </Button>
        }
      />
      <div className="grid md:grid-cols-3 gap-4">
        {!lessons.length && <p>Bạn chưa có bài học đang dở. Chọn “Xem tất cả” để khám phá hành trình.</p>}
        {lessons.map((l, idx) => {
          const color = progressColors[idx % progressColors.length];
          return (
            <button
              type="button"
              onClick={() => navigate(`/dashboard/kid/play?chapter=${l.id}`)}
              key={l.id}
              className="bg-white rounded-2xl border-2 border-[#fbbf24]/30 p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:border-[#fbbf24] transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Top color stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />

              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl" aria-hidden="true">
                  {l.emoji}
                </div>
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    color: color,
                    backgroundColor: `${color}15`,
                  }}
                >
                  {l.subject}
                </span>
              </div>

              <div className="text-base font-extrabold text-[#1a3a1a] mb-3">
                {l.title}
              </div>
              <div className="h-2 bg-[#faf8f5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${l.progress}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="text-xs text-[#1a3a1a]/60 mt-1.5 font-medium">
                {l.progress}% hoàn thành
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
