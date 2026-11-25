import { AlertCircle, ArrowLeft, CheckCircle2, ChevronDown, ClipboardCheck, Clock3, Eye, Gamepad2, PlayCircle, RefreshCw, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "../../../features/workspace/format";
import { Empty } from "../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";
import { knowledgeUnitName } from "../knowledgeUnits.js";

const SUMMARY_LABELS = {
  WAITING_POST_TEST: "Bé chưa làm bài sau chương này.",
  GENERATING: "Hệ thống đang tổng hợp báo cáo…",
};
const FINAL_STATUS_LABELS = { PARTIAL: "Tạm thời (còn chương chờ hậu trắc)", COMPLETE: "Đầy đủ" };
const ratio = (value) => `${Number(value?.correct) || 0}/${Number(value?.total) || 0}`;
const choiceText = (item) => {
  if (item == null) return "Lựa chọn trong truyện";
  if (typeof item !== "object") return String(item);
  return item.label || item.text || item.question || item.itemLabel || "Lựa chọn trong truyện";
};
const conceptName = (item) => {
  if (item?.name) return item.name;
  const resolved = knowledgeUnitName(item?.concept);
  return /^D\d{2}\.\d{2}$/i.test(resolved) ? "Nội dung tài chính" : resolved;
};
const CONCEPT_SECTIONS = [
  { band: "GOOD", title: "Bé làm tốt", description: "Bé đã thể hiện tốt những nội dung này qua trò chơi và hậu trắc." },
  { band: "FAMILIAR", title: "Bé đang làm quen", description: "Bé đã bắt đầu hiểu và cần thêm cơ hội áp dụng." },
  { band: "PRACTICE", title: "Bé cần luyện thêm", description: "Đây là những nội dung nên cùng bé ôn lại." },
];

function LearningOverview({ concepts, completed, total }) {
  const assessed = concepts.filter((item) => ["GOOD", "FAMILIAR", "PRACTICE"].includes(item.band));
  const learnedUnrated = concepts.filter((item) => item.band === "NO_DATA");
  const hasAssessment = assessed.length > 0;
  return <section className="ws-card learner-learning-overview">
    <div className="learner-learning-heading"><div><span className="ws-eyebrow">TỔNG QUAN HỌC TẬP</span><h2>Những nội dung bé đã học</h2></div><p>Chi tiết bé làm tốt và cần luyện thêm nằm trong từng chương bên dưới.</p></div>
    {!hasAssessment && concepts.length > 0 && <aside className="learner-learning-progress-note">Bé mới học xong <strong>{completed}/{total} chương</strong> nên chưa đủ dữ liệu để đánh giá. Xem nội dung chi tiết trong từng chương bên dưới.</aside>}
    <div className="learner-learning-groups">
      {CONCEPT_SECTIONS.map((section) => {
        const items = concepts.filter((item) => item.band === section.band);
        if (!items.length) return null;
        return <article className={`learner-learning-group is-${section.band.toLowerCase()}`} key={section.band}>
          <header><h3>{section.title}</h3><span>{items.length} nội dung</span></header>
          <ul>{items.map((item, index) => <li key={item.concept || index}><div><strong>{conceptName(item)}</strong>{item.objective && <span>{item.objective}</span>}</div><em>{Number(item.correct) || 0}/{Number(item.total) || 0} câu đúng</em></li>)}</ul>
        </article>;
      })}
    </div>
    {learnedUnrated.length > 0 && <section className="learner-learning-unrated">
      <header><div><h3>Bé đã học qua</h3><p>Chưa đủ bài để xếp mức</p></div><span>{learnedUnrated.length} nội dung</span></header>
      <ul>{learnedUnrated.map((item, index) => <li key={item.concept || index}>
        <div><strong>{conceptName(item)}</strong>{item.objective && <span>{item.objective}</span>}</div>
        <em>{Number(item.correct) || 0}/{Number(item.total) || 0} câu đúng</em>
      </li>)}</ul>
    </section>}
    {!concepts.length && <aside className="learner-learning-no-data"><strong>Chưa có nội dung đã học</strong><p>Bé cần hoàn thành thêm trò chơi hoặc hậu trắc để hệ thống ghi nhận nội dung.</p></aside>}
  </section>;
}

function Summary({ summary, final = false }) {
  if (!summary) return null;
  const waiting = summary.status === "WAITING_POST_TEST";
  const generating = summary.status === "GENERATING";
  const Icon = waiting ? AlertCircle : generating ? Clock3 : Sparkles;
  return <aside className={`learner-report-summary is-${String(summary.status || "fallback").toLowerCase()}`}>
    <Icon size={20} /><div><strong>{final ? "Tổng kết hành trình" : "Nhận xét chương"}</strong><p>{summary.text || SUMMARY_LABELS[summary.status] || "Chưa có nhận xét."}</p>{generating && <small>Trang sẽ tự cập nhật sau mỗi 30 giây.</small>}</div>
  </aside>;
}

function ChapterResult({ title, result, postTest = false, postTestResult, postTestLoading, postTestError, onViewPostTest }) {
  const Icon = postTest ? ClipboardCheck : Gamepad2;
  const hasResult = result && (Number(result.total) > 0 || result.status === "SUBMITTED");
  const wrong = !postTest && Array.isArray(result?.wrong) ? result.wrong : [];
  return <section className={`learner-chapter-result ${postTest ? "is-post-test" : "is-mini-game"}`} aria-label={`Kết quả ${title}`}>
    <header><span className="learner-chapter-result-icon"><Icon size={20} aria-hidden="true" /></span><h3>{title}</h3></header>
    {hasResult ? <div className="learner-chapter-result-score"><strong>{ratio(result)}</strong><span>câu đúng</span></div> : <p className="learner-chapter-result-empty">{postTest ? "Chưa nộp" : "Chưa có kết quả"}</p>}
    {postTest && result?.status === "SUBMITTED" && result?.quizId && !postTestResult && <button type="button" className="ws-btn learner-post-test-button" disabled={postTestLoading} onClick={onViewPostTest}><Eye size={16} />{postTestLoading ? "Đang tải bài…" : "Xem bài hậu trắc"}</button>}
    {postTest && postTestError && <p className="learner-post-test-error" role="alert">{postTestError}</p>}
    {postTest && postTestResult && <details className="learner-post-test-paper" open><summary><h4>Chi tiết bài hậu trắc</h4><ChevronDown size={17} /></summary><div>{(postTestResult.paper || postTestResult.answers || []).length ? <ol>{(postTestResult.paper || postTestResult.answers).map((answer, index) => {
      const options = answer.options || [];
      const chosen = answer.chosen ?? answer.chosenIndex;
      const correctIndex = answer.correctPos ?? answer.correctIndex;
      return <li key={answer.questionId || answer.pos || index}><strong>{answer.stem || answer.question || `Câu ${index + 1}`}</strong><p>Bé chọn: {Number.isInteger(chosen) && chosen >= 0 ? `${String.fromCharCode(65 + chosen)}. ${options[chosen] ?? "Không có nội dung"}` : "Chưa trả lời"}</p>{answer.correct === false && Number.isInteger(correctIndex) && correctIndex >= 0 && options[correctIndex] != null && <p>Đáp án: {String.fromCharCode(65 + correctIndex)}. {options[correctIndex]}</p>}</li>;
    })}</ol> : <p>Chưa có nội dung bài làm để hiển thị.</p>}</div></details>}
    {wrong.length > 0 && <div className="learner-minigame-review"><h4>Bé cần luyện thêm ở chương này</h4><ol>{wrong.map((item) => <li key={`${item.gameId}-${item.itemId}`}>
      <strong>{item.label || "Câu hỏi mini-game"}</strong>
      <p>Bé chọn: {item.chosenLabel ?? "Chưa có dữ liệu"}</p>
      <p>Đáp án: {item.expectedLabel ?? "Chưa có dữ liệu"}</p>
      {item.explanation && <p className="learner-minigame-explanation">{item.explanation}</p>}
    </li>)}</ol></div>}
  </section>;
}

function Chapter({ chapter, index, reportState }) {
  const number = chapter.chapter ?? chapter.chapterNumber ?? index + 1;
  const choices = Array.isArray(chapter.choices) ? chapter.choices : Array.isArray(chapter.deliberate) ? chapter.deliberate : [];
  return <li className="is-done">
    <span className="ws-chapter-marker" aria-hidden="true"><CheckCircle2 /></span>
    <details className="learner-report-chapter">
      <summary className="ws-chapter-card"><div><span>Chương {number}</span><strong>{chapter.title || `Chương ${number}`}</strong>{chapter.summary?.text && <p className="learner-chapter-summary-preview">{chapter.summary.text}</p>}</div><span className="learner-chapter-summary-status"><span className={`ws-pill ${chapter.reportStatus === "COMPLETE" ? "success" : ""}`}>{chapter.reportStatus === "COMPLETE" ? "Đầy đủ" : "Tạm thời"}</span><ChevronDown size={18} /></span></summary>
      <div className="learner-report-chapter-body">
        <Summary summary={chapter.summary} />
        <div className="learner-report-metrics">
          <ChapterResult title="Mini-game" result={chapter.miniGames} />
          <ChapterResult title="Hậu trắc" result={chapter.postTest} postTest postTestResult={chapter.postTest?.quizId ? reportState.postTestResults?.[chapter.postTest.quizId] : null} postTestLoading={String(chapter.postTest?.quizId) === reportState.postTestLoading} postTestError={reportState.postTestError} onViewPostTest={() => void reportState.loadPostTest?.(chapter.postTest?.quizId)} />
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
  const concepts = (Array.isArray(report.concepts) ? report.concepts : [])
    .filter((item) => Number(item?.total) > 0);
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
    <LearningOverview concepts={concepts} completed={completed} total={total} />
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
      {chapters.length ? <ol className="ws-chapter-timeline">{chapters.map((chapter, index) => <Chapter key={chapter.chapter ?? chapter.chapterNumber ?? index} chapter={chapter} index={index} reportState={reportState} />)}</ol> : <Empty>Chưa có dữ liệu chi tiết theo chương.</Empty>}
    </section>
    {finalReport.status !== "NONE" && <section className="ws-card"><h2><CheckCircle2 size={20} /> Báo cáo cuối hành trình</h2><Summary summary={finalReport.summary} final /><p className="learner-final-status">Trạng thái: {FINAL_STATUS_LABELS[finalReport.status] || "Chưa xác định"}</p></section>}
    {report.progress?.lastPlayedAt && <footer className="ws-progress-meta">Hoạt động gần nhất {dateLabel(report.progress.lastPlayedAt)}</footer>}
  </div>;
}
