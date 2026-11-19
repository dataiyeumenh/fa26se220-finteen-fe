import { AlertCircle, CheckCircle2, ChevronDown, Clock3, PlayCircle, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "../../../features/workspace/format";
import { Empty, Heading } from "../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";

const SUMMARY_LABELS = {
  WAITING_POST_TEST: "Bé chưa làm bài sau chương này.",
  GENERATING: "Hệ thống đang tổng hợp báo cáo…",
};
const BAND_LABELS = { NO_DATA: "Chưa có dữ liệu", PRACTICE: "Cần luyện thêm", FAMILIAR: "Đã làm quen", GOOD: "Nắm vững" };
const ratio = (value) => `${Number(value?.correct) || 0}/${Number(value?.total) || 0}`;
const itemText = (item, itemLabels = {}) => {
  if (item == null) return "Nội dung chưa xác định";
  if (typeof item !== "object") return String(item);
  const id = item.itemId || item.gameItemId || item.id;
  return item.label || item.text || item.concept || item.question || item.itemLabel ||
    itemLabels[id] || "Một nội dung trong mini-game cần xem lại";
};

function Summary({ summary, final = false }) {
  if (!summary) return null;
  const waiting = summary.status === "WAITING_POST_TEST";
  const generating = summary.status === "GENERATING";
  const Icon = waiting ? AlertCircle : generating ? Clock3 : Sparkles;
  return <aside className={`learner-report-summary is-${String(summary.status || "fallback").toLowerCase()}`}>
    <Icon size={20} /><div><strong>{final ? "Tổng kết hành trình" : "Nhận xét chương"}</strong><p>{summary.text || SUMMARY_LABELS[summary.status] || "Chưa có nhận xét."}</p>{generating && <small>Trang sẽ tự cập nhật sau mỗi 30 giây.</small>}</div>
  </aside>;
}

function MiniGameDetails({ miniGames, itemLabels }) {
  if (!miniGames) return <span>—</span>;
  return <div><strong>{ratio(miniGames)} câu đúng</strong>{miniGames.wrong?.length > 0 && <details><summary>{miniGames.wrong.length} nội dung cần xem lại</summary><ul>{miniGames.wrong.map((item, index) => <li key={item.id || item.itemId || index}>{itemText(item, itemLabels)}</li>)}</ul></details>}</div>;
}

function Chapter({ chapter, index, itemLabels }) {
  const number = chapter.chapter ?? chapter.chapterNumber ?? index + 1;
  const choices = Array.isArray(chapter.choices) ? chapter.choices : Array.isArray(chapter.deliberate) ? chapter.deliberate : [];
  return <li className="is-done">
    <span className="ws-chapter-marker" aria-hidden="true"><CheckCircle2 /></span>
    <details className="learner-report-chapter">
      <summary className="ws-chapter-card"><div><span>Chương {number}</span><strong>{chapter.title || `Chương ${number}`}</strong></div><span className="learner-chapter-summary-status"><span className={`ws-pill ${chapter.reportStatus === "COMPLETE" ? "success" : ""}`}>{chapter.reportStatus === "COMPLETE" ? "Đầy đủ" : "Tạm thời"}</span><ChevronDown size={18} /></span></summary>
      <div className="learner-report-chapter-body">
        <Summary summary={chapter.summary} />
        <div className="learner-report-metrics">
          <section><span>Lựa chọn</span><strong>{choices.length}</strong>{choices.length > 0 && <ul>{choices.map((choice, choiceIndex) => <li key={choice.id || choiceIndex}>{itemText(choice)} {choice.deliberate != null && <small>· {choice.deliberate ? "Có chủ đích" : "Chưa chủ đích"}</small>}</li>)}</ul>}</section>
          <section><span>Mini-game</span><MiniGameDetails miniGames={chapter.miniGames} itemLabels={itemLabels} /></section>
          <section><span>Hậu trắc</span><strong>{chapter.postTest?.status === "SUBMITTED" || chapter.postTest?.total > 0 ? `${ratio(chapter.postTest)} câu đúng` : "Chưa nộp"}</strong></section>
        </div>
      </div>
    </details>
  </li>;
}

export default function LearnerReportContent({ reportState }) {
  const { report, loading, error, refresh, isGenerating, itemLabels } = reportState;
  if (loading && !report) return <ContentSkeleton cards={3} label="Đang tải báo cáo học tập…" />;
  if (error) return <Empty>{error} <button className="ws-btn" onClick={() => void refresh()}>Thử lại</button></Empty>;
  if (!report) return <Empty>Chưa có dữ liệu báo cáo.</Empty>;
  const learner = report.learner || {};
  const chapters = Array.isArray(report.chapters) ? report.chapters : [];
  const concepts = Array.isArray(report.concepts) ? report.concepts : [];
  const finalReport = report.finalReport || { status: "NONE", summary: null };
  const progress = report.progress || {};
  const completed = Number(progress.completedChapters) || chapters.length;
  const total = Number(progress.totalChapters) || Math.max(chapters.length, 1);
  const percent = Math.min(100, Math.round((completed / total) * 100));

  return <div className="learner-report-page">
    <Heading title={learner.displayName || "Hồ sơ học tập"} description={[learner.group?.name, learner.status].filter(Boolean).join(" · ")}><button className="ws-btn" onClick={() => void refresh()} disabled={loading}><RefreshCw size={16} className={isGenerating ? "is-spinning" : ""} /> Làm mới</button></Heading>
    <div className="ws-actions"><Link className="ws-btn" to="/dashboard/reports">Về báo cáo</Link></div>
    <section className="ws-card ws-progress-report">
      <div className="ws-progress-report-head"><div><span className="ws-eyebrow">HÀNH TRÌNH HỌC TẬP</span><h2>Tiến độ theo từng chương</h2><p>Bấm vào từng chương để xem lựa chọn, mini-game, hậu trắc và nhận xét.</p></div><div className="ws-progress-score"><strong>{percent}%</strong><span>hoàn thành</span></div></div>
      <div className="ws-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${percent}%` }} /></div>
      <div className="ws-progress-summary"><div><CheckCircle2 /><span><strong>{completed}</strong> đã xong</span></div><div><PlayCircle /><span>Chương tiếp theo <strong>{progress.continueChapter || "—"}</strong></span></div><div><Clock3 /><span>Lần chơi <strong>{progress.attemptIndex || 1}</strong></span></div></div>
      {chapters.length ? <ol className="ws-chapter-timeline">{chapters.map((chapter, index) => <Chapter key={chapter.chapter ?? chapter.chapterNumber ?? index} chapter={chapter} index={index} itemLabels={itemLabels} />)}</ol> : <Empty>Chưa có dữ liệu chi tiết theo chương.</Empty>}
    </section>
    <section className="ws-card"><h2>Mức độ hiểu khái niệm</h2>{concepts.length ? <div className="learner-concept-grid">{concepts.map((item, index) => <article key={item.concept || index}><header><strong>{item.concept || "Khái niệm"}</strong><span className={`concept-band is-${String(item.band || "NO_DATA").toLowerCase()}`}>{BAND_LABELS[item.band] || item.band}</span></header><div><span>Trong game <b>{ratio(item.game)}</b></span><span>Hậu trắc <b>{ratio(item.postTest)}</b></span></div><p>Tổng cộng <strong>{Number(item.correct) || 0}/{Number(item.total) || 0}</strong></p></article>)}</div> : <Empty>Chưa có dữ liệu khái niệm.</Empty>}</section>
    {finalReport.status !== "NONE" && <section className="ws-card"><h2><CheckCircle2 size={20} /> Báo cáo cuối hành trình</h2><Summary summary={finalReport.summary} final /><p className="learner-final-status">Trạng thái: {finalReport.status}</p></section>}
    {report.progress?.lastPlayedAt && <footer className="ws-progress-meta">Hoạt động gần nhất {dateLabel(report.progress.lastPlayedAt)}</footer>}
  </div>;
}
