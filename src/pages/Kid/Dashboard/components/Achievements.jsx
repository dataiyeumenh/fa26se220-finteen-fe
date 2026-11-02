import { SectionHeader } from "@/components/dashboard/StatCard";
import { DataSourceNote } from "@/features/workspace/ui";
import { mockAchievementNote } from "../api/kidAchievements.js";
import { Link } from "react-router-dom";
import AchievementCard from "./AchievementCard.jsx";

export default function Achievements({ items, source }) {
  return (
    <section className="mb-8">
      <div className="kid-achievement-preview-head">
        <SectionHeader title="Thành tích gần đây" emoji="🏅" />
        <Link to="/dashboard/kid/achievements" className="ws-btn">Xem tất cả thành tựu →</Link>
      </div>
      {source === "mock" && <DataSourceNote>{mockAchievementNote}</DataSourceNote>}
      <div className="kid-achievement-grid">
        {items.map((item) => <AchievementCard key={item.id} item={{ ...item, unlocked: true }} />)}
      </div>
    </section>
  );
}
