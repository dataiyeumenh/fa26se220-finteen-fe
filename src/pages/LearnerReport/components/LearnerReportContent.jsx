import { AlertCircle, ArrowLeft, CheckCircle2, ChevronDown, ClipboardCheck, Clock3, Gamepad2, PlayCircle, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "../../../features/workspace/format";
import { Empty } from "../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";
import { knowledgeUnitName } from "../knowledgeUnits.js";

const SUMMARY_LABELS = {
  WAITING_POST_TEST: "Bé chưa làm bài sau chương này.",
  GENERATING: "Hệ thống đang tổng hợp báo cáo…",
};
const BAND_LABELS = { NO_DATA: "Chưa có dữ liệu", PRACTICE: "Cần luyện thêm", FAMILIAR: "Đã làm quen", GOOD: "Nắm vững" };
const FINAL_STATUS_LABELS = { PARTIAL: "Tạm thời (còn chương chờ hậu trắc)", COMPLETE: "Đầy đủ" };
const ratio = (value) => `${Number(value?.correct) || 0}/${Number(value?.total) || 0}`;
const choiceText = (item) => {
  if (item == null) return "Lựa chọn trong truyện";
  if (typeof item !== "object") return String(item);
  return item.label || item.text || item.question || item.itemLabel || "Lựa chọn trong truyện";
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

function ChapterResult({ title, result, postTest = false }) {
  const Icon = postTest ? ClipboardCheck : Gamepad2;
  const hasResult = result && (Number(result.total) > 0 || result.status === "SUBMITTED");
  const wrong = !postTest && Array.isArray(result?.wrong) ? result.wrong : [];
  return <section className={`learner-chapter-result ${postTest ? "is-post-test" : "is-mini-game"}`} aria-label={`Kết quả ${title}`}>
    <header><span className="learner-chapter-result-icon"><Icon size={20} aria-hidden="true" /></span><h3>{title}</h3></header>
    {hasResult ? <div className="learner-chapter-result-score"><strong>{ratio(result)}</strong><span>câu đúng</span></div> : <p className="learner-chapter-result-empty">{postTest ? "Chưa nộp" : "Chưa có kết quả"}</p>}
    {wrong.length > 0 && <div className="learner-minigame-review"><h4>Câu cần xem lại</h4><ol>{wrong.map((item, index) => <li key={item.id ?? index}>
      <strong>{item.label || "Câu hỏi mini-game"}</strong>
      <p>Bé chọn: {item.chosenLabel ?? "Chưa có dữ liệu"}</p>
      <p>Đáp án: {item.expectedLabel ?? "Chưa có dữ liệu"}</p>
      {item.explanation && <p className="learner-minigame-explanation">{item.explanation}</p>}
    </li>)}</ol></div>}
  </section>;
}

function Chapter({ chapter, index }) {
  const number = chapter.chapter ?? chapter.chapterNumber ?? index + 1;
  const choices = Array.isArray(chapter.choices) ? chapter.choices : Array.isArray(chapter.deliberate) ? chapter.deliberate : [];
  return <li className="is-done">
    <span className="ws-chapter-marker" aria-hidden="true"><CheckCircle2 /></span>
    <details className="learner-report-chapter">
      <summary className="ws-chapter-card"><div><span>Chương {number}</span><strong>{chapter.title || `Chương ${number}`}</strong></div><span className="learner-chapter-summary-status"><span className={`ws-pill ${chapter.reportStatus === "COMPLETE" ? "success" : ""}`}>{chapter.reportStatus === "COMPLETE" ? "Đầy đủ" : "Tạm thời"}</span><ChevronDown size={18} /></span></summary>
      <div className="learner-report-chapter-body">
        <Summary summary={chapter.summary} />
        <div className="learner-report-metrics">
          <ChapterResult title="Mini-game" result={chapter.miniGames} />
          <ChapterResult title="Hậu trắc" result={chapter.postTest} postTest />
        </div>
        <section className="learner-chapter-choices">
          <header><h3>Lựa chọn của trẻ trong câu chuyện</h3><span>{choices.length} lựa chọn</span></header>
          {choices.length ? <ol>{choices.map((choice, choiceIndex) => <li key={choice?.optionId ?? choiceIndex}>
            <span className="learner-choice-number" aria-hidden="true">{choiceIndex + 1}</span>
            <p>{choiceText(choice).replace(/^\s*[A-D][.)]\s+/i, "")}</p>
          </li>)}</ol> : <p className="learner-chapter-choices-empty">Chưa ghi nhận lựa chọn trong chương này.</p>}
        </section>
      </div>
    </details>
  </li>;
}

export default function LearnerReportContent({ reportState }) {
  const { report, loading, error, refresh, isGenerating } = reportState;
  if (loading && !report) return <ContentSkeleton cards={3} label="Đang tải báo cáo học tập…" />;
  if (error) return <Empty>{error} <button className="ws-btn" onClick={() => void refresh()}>Thử lại</button></Empty>;
  if (!report) return <Empty>Chưa có dữ liệu báo cáo.</Empty>;
  const learner = report.learner || {};
  const learnerName = learner.displayName || "Hồ sơ học tập";
  const learnerStatus = { ACTIVE: "Đang hoạt động", ARCHIVED: "Đã lưu trữ", WIPED: "Đã xóa" }[learner.status] || learner.status;
  const chapters = Array.isArray(report.chapters) ? report.chapters : [];
  const concepts = Array.isArray(report.concepts) ? report.concepts : [];
  const finalReport = report.finalReport || { status: "NONE", summary: null };
  const progress = report.progress || {};
  const completed = Number(progress.completedChapters ?? (Array.isArray(progress.chaptersDone) ? progress.chaptersDone.length : chapters.length));
  const total = Number(progress.totalChapters ?? Math.max(chapters.length, 1));
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return <div className="learner-report-page">
    <header className="learner-report-header">
      <div className="learner-report-identity">
        <span className="learner-report-avatar" aria-hidden="true">{learnerName.trim().charAt(0).toUpperCase()}</span>
        <div className="learner-report-heading">
          <span className="ws-eyebrow">BÁO CÁO HỌC TẬP</span>
          <h1>{learnerName}</h1>
          {(learner.group?.name || learnerStatus) && <div className="learner-report-meta">
            {learner.group?.name && <span>{learner.group.name}</span>}
            {learnerStatus && <span className={`learner-report-status${learner.status === "ACTIVE" ? " is-active" : ""}`}>{learnerStatus}</span>}
          </div>}
        </div>
      </div>
      <div className="learner-report-actions">
        <Link className="ws-btn" to="/dashboard/reports"><ArrowLeft size={16} aria-hidden="true" />Về báo cáo</Link>
        <button className="ws-btn" onClick={() => void refresh()} disabled={loading}><RefreshCw size={16} aria-hidden="true" className={isGenerating ? "is-spinning" : ""} />{loading ? "Đang làm mới…" : "Làm mới"}</button>
      </div>
    </header>
    <section className="ws-card ws-progress-report">
      <div className="ws-progress-report-head"><div><span className="ws-eyebrow">HÀNH TRÌNH HỌC TẬP</span><h2>Tiến độ theo từng chương</h2><p>Bấm vào từng chương để xem lựa chọn, mini-game, hậu trắc và nhận xét.</p></div><div className="ws-progress-score"><strong>{percent}%</strong><span>hoàn thành</span></div></div>
      <div className="ws-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${percent}%` }} /></div>
      <div className="ws-progress-summary" aria-label="Tóm tắt tiến độ học tập">
        <div className="ws-progress-stat is-completed">
          <span className="ws-progress-stat-icon"><CheckCircle2 aria-hidden="true" /></span>
          <div className="ws-progress-stat-content"><span>Đã hoàn thành</span><strong>{completed}<small> / {total} chương</small></strong><p>Số chương đã học xong</p></div>
        </div>
        <div className="ws-progress-stat is-next">
          <span className="ws-progress-stat-icon"><PlayCircle aria-hidden="true" /></span>
          <div className="ws-progress-stat-content"><span>Học tiếp từ</span><strong>{progress.continueChapter ? `Chương ${progress.continueChapter}` : "Chưa xác định"}</strong><p>Theo tiến trình hiện tại</p></div>
        </div>
        <div className="ws-progress-stat is-attempt">
          <span className="ws-progress-stat-icon"><RotateCcw aria-hidden="true" /></span>
          <div className="ws-progress-stat-content"><span>Lượt trải nghiệm</span><strong>{progress.attemptIndex != null ? `Lần ${progress.attemptIndex}` : "Chưa xác định"}</strong><p>Lượt chơi toàn bộ hành trình</p></div>
        </div>
      </div>
      {chapters.length ? <ol className="ws-chapter-timeline">{chapters.map((chapter, index) => <Chapter key={chapter.chapter ?? chapter.chapterNumber ?? index} chapter={chapter} index={index} />)}</ol> : <Empty>Chưa có dữ liệu chi tiết theo chương.</Empty>}
    </section>
    <section className="ws-card"><h2>Mức độ hiểu khái niệm</h2>{concepts.length ? <div className="learner-concept-grid">{concepts.map((item, index) => <article key={item.concept || index}><header><strong>{item.name || knowledgeUnitName(item.concept)}</strong><span className={`concept-band is-${String(item.band || "NO_DATA").toLowerCase()}`}>{BAND_LABELS[item.band] || item.band}</span></header>{item.objective && <p className="learner-concept-objective">{item.objective}</p>}<div><span>Trong game <b>{ratio(item.game)}</b></span><span>Hậu trắc <b>{ratio(item.postTest)}</b></span></div><p>Tổng cộng <strong>{Number(item.correct) || 0}/{Number(item.total) || 0}</strong></p></article>)}</div> : <Empty>Chưa có dữ liệu khái niệm.</Empty>}</section>
    {finalReport.status !== "NONE" && <section className="ws-card"><h2><CheckCircle2 size={20} /> Báo cáo cuối hành trình</h2><Summary summary={finalReport.summary} final /><p className="learner-final-status">Trạng thái: {FINAL_STATUS_LABELS[finalReport.status] || "Chưa xác định"}</p></section>}
    {report.progress?.lastPlayedAt && <footer className="ws-progress-meta">Hoạt động gần nhất {dateLabel(report.progress.lastPlayedAt)}</footer>}
  </div>;
}
