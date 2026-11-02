import { Award, CheckCircle2, LockKeyhole } from "lucide-react";
import "./achievements.css";
import { difficultyLabels } from "../api/kidAchievements.js";

export default function AchievementCard({ item }) {
  const level = item.difficulty || 0;
  return (
    <article className={`kid-achievement tier-${level} ${item.unlocked ? "is-earned" : "is-locked"}`}>
      <div className="kid-achievement-top">
        <span className="kid-achievement-icon" aria-hidden="true">{item.emoji || <Award size={28} />}</span>
        <span className="kid-achievement-status">
          {item.unlocked ? <CheckCircle2 size={14} /> : <LockKeyhole size={14} />}
          {item.unlocked ? "Đã mở" : "Chưa mở"}
        </span>
      </div>
      {level > 0 && <div className="kid-achievement-difficulty">
        <span className="kid-achievement-bars" aria-hidden="true">{[1, 2, 3, 4].map((n) => <i key={n} className={n <= level ? "filled" : ""} />)}</span>
        <span>{difficultyLabels[level]}</span>
      </div>}
      <h3>{item.title || item.name || item.code}</h3>
      <p>{item.description || item.desc || "Huy hiệu trong hành trình học tài chính."}</p>
      <footer>{item.source === "mock" ? "Dữ liệu mẫu" : item.earnedAt ? `Đạt ngày ${new Date(item.earnedAt).toLocaleDateString("vi-VN")}` : "Thành tựu đã đạt"}</footer>
    </article>
  );
}
