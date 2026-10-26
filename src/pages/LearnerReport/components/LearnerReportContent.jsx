import {
  CheckCircle2,
  Clock3,
  PlayCircle,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CHAPTERS } from "../../../features/workspace/model";
import { dateLabel } from "../../../features/workspace/format";
import { Empty, Heading } from "../../../features/workspace/ui";

export default function LearnerReportContent({ reportState }) {
  const { report, loading, error, refresh } = reportState;
  if (loading) return <Empty>Đang tải tiến độ học sinh…</Empty>;
  if (error)
    return (
      <Empty>
        {error}{" "}
        <button className="ws-btn" onClick={() => void refresh()}>
          Thử lại
        </button>
      </Empty>
    );
  if (!report) return <Empty>Chưa có dữ liệu báo cáo.</Empty>;
  const { learner, progress, indicators } = report;
  const done = new Set(progress.chaptersDone || []);
  const continueChapter = Number(progress.continueChapter) || null;
  const chapters = Array.from(
    { length: progress.totalChapters || 0 },
    (_, index) => ({
      number: index + 1,
      title: CHAPTERS[index] || `Chương ${index + 1}`,
      completed: done.has(index + 1),
    }),
  );
  const percent = progress.totalChapters
    ? Math.round((progress.completedChapters / progress.totalChapters) * 100)
    : 0;
  const labels = {
    wealth: "Tài sản",
    saving: "Tiết kiệm",
    happiness: "Hạnh phúc",
    risk: "Rủi ro",
    goal: "Mục tiêu",
  };
  return (
    <>
      <Heading
        title={learner.displayName || "Đã xoá"}
        description={`${learner.group.name} · ${learner.status}`}
      >
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      <div className="ws-actions">
        <Link className="ws-btn" to="/dashboard/reports">
          Về báo cáo
        </Link>
      </div>
      <section className="ws-card ws-progress-report">
        <div className="ws-progress-report-head">
          <div>
            <span className="ws-eyebrow">HÀNH TRÌNH HỌC TẬP</span>
            <h2>Tiến độ theo từng chương</h2>
          </div>
          <div className="ws-progress-score">
            <strong>{percent}%</strong>
            <span>hoàn thành</span>
          </div>
        </div>
        <div
          className="ws-progress-track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="ws-progress-summary">
          <div>
            <CheckCircle2 />
            <span>
              <strong>{progress.completedChapters}</strong> đã xong
            </span>
          </div>
          <div>
            <PlayCircle />
            <span>
              Chương tiếp theo{" "}
              <strong>{progress.continueChapter || "—"}</strong>
            </span>
          </div>
          <div>
            <Clock3 />
            <span>
              Lần chơi <strong>{progress.attemptIndex}</strong>
            </span>
          </div>
        </div>
        <ol className="ws-chapter-timeline">
          {chapters.map((chapter) => {
            const isPlaying =
              !chapter.completed && chapter.number === continueChapter;
            const stateClass = chapter.completed
              ? "is-done"
              : isPlaying
                ? "is-playing"
                : "is-not_started";
            const status = chapter.completed
              ? "Đã hoàn thành"
              : isPlaying
                ? "Đang học"
                : "Chưa hoàn thành";

            return (
              <li key={chapter.number} className={stateClass}>
                <span className="ws-chapter-marker" aria-hidden="true">
                  {chapter.completed ? (
                    <CheckCircle2 />
                  ) : isPlaying ? (
                    <PlayCircle />
                  ) : (
                    chapter.number
                  )}
                </span>
                <div className="ws-chapter-card">
                  <div>
                    <span>Chương {chapter.number}</span>
                    <strong>{chapter.title}</strong>
                  </div>
                  <span className="ws-chapter-status">{status}</span>
                </div>
              </li>
            );
          })}
        </ol>
        <footer className="ws-progress-meta">
          {progress.lastPlayedAt
            ? `Hoạt động gần nhất ${dateLabel(progress.lastPlayedAt)}`
            : "Chưa có hoạt động"}
        </footer>
      </section>
      <section className="ws-card">
        <h2>5 chỉ số hành vi</h2>
        {indicators ? (
          <div className="ws-grid three">
            {Object.entries(indicators).map(([key, value]) => (
              <article key={key}>
                <strong>{labels[key] || key}</strong>
                <p>{value < 34 ? "Thấp" : value < 67 ? "Vừa" : "Cao"}</p>
                <small>{value}/100</small>
              </article>
            ))}
          </div>
        ) : (
          <Empty>Chưa có dữ liệu chỉ số.</Empty>
        )}
      </section>
      <section className="ws-card">
        <h2>
          <Trophy size={20} /> Thành tích
        </h2>
        {report.achievements?.length ? (
          <div className="ws-achievement-grid">
            {report.achievements.map((item) => (
              <article key={`${item.code}-${item.earnedAt}`}>
                <Trophy />
                <div>
                  <strong>{item.title || item.name || item.code}</strong>
                  <small>Đạt lúc {dateLabel(item.earnedAt)}</small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty>Chưa có thành tích.</Empty>
        )}
      </section>
    </>
  );
}
