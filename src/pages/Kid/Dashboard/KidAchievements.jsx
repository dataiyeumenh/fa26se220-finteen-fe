import { RefreshCw } from "lucide-react";
import { Empty, Heading, DataSourceNote } from "@/features/workspace/ui";
import { mockAchievementNote, difficultyLabels } from "./api/kidAchievements.js";
import useKidDashboard from "./hooks/useKidDashboard";
import AchievementCard from "./components/AchievementCard.jsx";

export default function KidAchievements() {
  const { dashboard, loading, error, refresh, achievementSource, achievementCatalog: achievements } = useKidDashboard();
  if (loading && !dashboard) return <Empty>Đang tải thành tích…</Empty>;
  if (error && !dashboard) return <Empty>{error} <button className="ws-btn" onClick={() => void refresh()}>Thử lại</button></Empty>;
  const mock = achievementSource === "mock";
  const earned = achievements.filter((item) => item.unlocked).length;
  const groups = mock
    ? Array.from({ length: 8 }, (_, index) => ({ title: `Chương ${index + 1}`, items: achievements.filter((item) => item.chapter === index + 1) }))
    : [{ title: "Huy hiệu đã đạt", items: achievements }];
  return (
    <>
      <Heading title="Bộ sưu tập thành tựu" description="Mỗi chương là một hành trình. Chinh phục từng huy hiệu từ dễ đến khó.">
        <button className="ws-btn" onClick={() => void refresh()}><RefreshCw size={16} /> Làm mới</button>
      </Heading>
      {mock && <DataSourceNote>{mockAchievementNote}</DataSourceNote>}
      <div className="kid-achievement-summary">
        <div><strong>{earned}{mock ? ` / ${achievements.length}` : ""} huy hiệu {mock ? "mẫu đã mở" : "đã đạt"}</strong><p>{mock ? "Trong mỗi chương: Hoàn thành → Hạng C → Hạng B → Hạng A. Độ khó chỉ mang tính minh họa." : "Thành tựu được ghi nhận từ hành trình của bạn."}</p></div>
        {mock && <div className="kid-achievement-legend" aria-label="Độ khó tăng dần">{difficultyLabels.slice(1).map((label) => <span key={label}>{label}</span>)}</div>}
      </div>
      {achievements.length ? groups.map((group) => (
        <section className="kid-achievement-chapter" key={group.title}>
          <header><h2>{group.title}</h2><span>{group.items.filter((i) => i.unlocked).length}/{group.items.length} đã mở{mock ? " · Mẫu" : ""}</span></header>
          <div className="kid-achievement-grid">{group.items.map((item) => <AchievementCard key={item.code} item={item} />)}</div>
        </section>
      )) : <Empty>Chưa có huy hiệu. Hoàn thành các chương để mở khóa thành tích đầu tiên.</Empty>}
    </>
  );
}
