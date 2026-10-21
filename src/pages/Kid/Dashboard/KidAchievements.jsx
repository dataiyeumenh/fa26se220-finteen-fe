import { Award, RefreshCw } from "lucide-react";
import { Empty, Heading } from "@/features/workspace/ui";
import useKidDashboard from "./hooks/useKidDashboard";

export default function KidAchievements() {
  const { dashboard, loading, error, refresh } = useKidDashboard();
  const achievements = dashboard?.achievements || [];
  if (loading && !dashboard) return <Empty>Đang tải thành tích…</Empty>;
  if (error && !dashboard)
    return (
      <Empty>
        {error}{" "}
        <button className="ws-btn" onClick={() => void refresh()}>
          Thử lại
        </button>
      </Empty>
    );
  return (
    <>
      <Heading
        title="Thành tích của bạn"
        description="Những huy hiệu đạt được trong hành trình học tài chính."
      >
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      {achievements.length ? (
        <div className="ws-grid three">
          {achievements.map((item) => (
            <article
              className="ws-card ws-achievement"
              key={`${item.code}-${item.earnedAt}`}
            >
              <Award />
              <h2>{item.title || item.name || item.code}</h2>
              <p>
                Đạt ngày {new Date(item.earnedAt).toLocaleDateString("vi-VN")}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <Empty>
          Chưa có huy hiệu. Hoàn thành các chương để mở khóa thành tích đầu
          tiên.
        </Empty>
      )}
    </>
  );
}
