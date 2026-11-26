import { lazy, Suspense, useEffect, useState } from "react";
import { ChevronDown, Download, History, MapPinned, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "../../../../features/workspace/format";
import { download, groupReportCsv } from "../../../../features/workspace/reporting";
import { Empty, Heading } from "../../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";
import StructuredReportSections from "@/features/workspace/StructuredReportSections";

const StoryChoiceChart = lazy(() => import("./TeacherReportCharts").then((module) => ({ default: module.StoryChoiceChart })));
const CourseOverviewCharts = lazy(() => import("./TeacherReportCharts").then((module) => ({ default: module.CourseOverviewCharts })));
const shortDateTime = (value) => value ? new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value)) : "Chưa chơi";
const conceptBand = {
  GOOD: "Lớp làm tốt",
  FAMILIAR: "Đang làm quen",
  PRACTICE: "Cần ôn lại",
  NO_DATA: "Chưa đủ dữ liệu",
};

function LearnerLinks({ learners, empty = "Không có học sinh trong danh sách này.", getTo }) {
  if (!learners?.length) return <p className="class-report-empty-inline">{empty}</p>;
  return <div className="class-report-learners">{learners.map((learner, index) => learner?.slotId
    ? <Link key={learner.slotId} to={getTo?.(learner) || `/dashboard/learners/${encodeURIComponent(learner.slotId)}`}>{learner.displayName || "Học sinh"}</Link>
    : <span key={index}>{learner?.displayName || "Học sinh đã xoá"}</span>)}</div>;
}

function ClassComment({ chapter }) {
  const comment = chapter.comment || { state: "WAITING" };
  const state = comment.state || "WAITING";
  if (state !== "READY" || (!comment.sections && !comment.text)) return null;
  const sections = comment.sections || {};
  return <section className="class-report-note-section">
    <header><div><h2>Nhận xét cho tiết sau</h2><p>Dựa trên {comment.basedOn || chapter.progress?.submitted?.count || 0}/{chapter.classSize || 0} em đã nộp{comment.at ? ` · cập nhật ${shortDateTime(comment.at)}` : ""}</p></div></header>
    {(sections.overview || comment.text) && <p className="class-report-note-overview">{sections.overview || comment.text}</p>}
    <div className="class-report-note-grid">{sections.doingWell?.length > 0 && <article className="is-good"><h3>Lớp làm tốt</h3>{sections.doingWell.map((item, index) => <p key={index}><strong>{item.name}</strong>{item.text ? ` · ${item.text}` : ""}</p>)}</article>}{sections.needsPractice?.length > 0 && <article className="is-weak"><h3>Cần ôn lại</h3>{sections.needsPractice.map((item, index) => <p key={index}><strong>{item.name}</strong>{item.text ? ` · ${item.text}` : ""}</p>)}</article>}{sections.tips?.length > 0 && <article className="is-tip"><h3>Gợi ý hoạt động</h3>{sections.tips.map((item, index) => <p key={index}>{item.text || item.name}</p>)}</article>}</div>
    {chapter.history?.length > 0 && <details className="class-report-history"><summary><History size={16} /> Bản trước ({chapter.history.length}) <ChevronDown size={16} /></summary><ol>{chapter.history.map((item, index) => <li key={`${item.at || "history"}-${index}`}><span>{item.at ? dateLabel(item.at) : "Bản trước"}</span><StructuredReportSections sections={item.sections} fallbackText={item.text || "Không có nội dung."} /></li>)}</ol></details>}
  </section>;
}

function ConceptList({ concepts = [] }) {
  const renderConcept = (concept, index) => {
    const total = Number(concept.total) || 0;
    const correct = Number(concept.correct) || 0;
    const level = concept.level || "NO_DATA";
    const percent = Number(concept.correctRate) || 0;
    const hasData = Boolean(concept.hasEnoughData) && level !== "NO_DATA";
    const learners = concept.learnersNeedingReview || [];
    return <details key={`${concept.name || "concept"}-${index}`} className={`class-report-concept-chart is-${String(level).toLowerCase()}`}>
      <summary><div className="class-report-concept-chart-head"><strong>{concept.name || "Nội dung học tập"}</strong><span>{conceptBand[level] || conceptBand.NO_DATA}</span></div><div className="class-report-concept-chart-track"><i style={{ width: `${hasData ? percent : 100}%` }} /></div><div className="class-report-concept-chart-values"><strong>{hasData ? `${percent}%` : "—"}</strong><span>{hasData ? `${correct}/${total} câu` : "Chưa đủ bài"}</span><ChevronDown size={16} /></div></summary>
      <div className="class-report-concept-detail"><div className="class-report-concept-evidence"><span>{conceptBand[level] || conceptBand.NO_DATA}</span>{hasData && <span>{percent}% câu trả lời đúng</span>}<span>{learners.length} em cần xem lại</span></div>{concept.objective && <p>{concept.objective}</p>}<LearnerLinks learners={learners} empty="Không có em nào cần xem lại nội dung này." /></div>
    </details>;
  };
  const measured = concepts.filter((concept) => concept.hasEnoughData && concept.level !== "NO_DATA");
  const waiting = concepts.filter((concept) => !concept.hasEnoughData || concept.level === "NO_DATA");
  const visible = measured.slice(0, 5);
  const remaining = measured.slice(5);
  return <section className="class-report-section"><header><div><h3>Kết quả theo nội dung</h3>{measured.length > 0 && <p>Thanh dài hơn nghĩa là lớp trả lời đúng nhiều hơn · Nội dung cần ôn được đặt lên trước.</p>}</div></header>{concepts.length ? <div className="class-report-concept-chart-list">{visible.map(renderConcept)}{remaining.length > 0 && <details className="class-report-concept-more"><summary>Xem thêm {remaining.length} nội dung <ChevronDown size={16} /></summary><div>{remaining.map((concept, index) => renderConcept(concept, index + 5))}</div></details>}{waiting.length > 0 && <p className="class-report-concept-waiting"><strong>Chưa đủ bài để thống kê:</strong> {waiting.map((concept) => concept.name || "Nội dung học tập").join(", ")}.</p>}</div> : <div className="class-report-chart-empty"><strong>Chưa đủ bài làm</strong><span>Chưa đủ bài làm để thống kê theo nội dung.</span></div>}</section>;
}

function DecisionList({ decisions = [], active = 0 }) {
  return <section className="class-report-section"><header><div><h3>Lựa chọn trong cốt truyện</h3><p>Thanh dài hơn nghĩa là có nhiều em chọn phương án đó hơn · Các lựa chọn không có đúng hoặc sai.</p></div></header>{decisions.length ? <Suspense fallback={<div className="class-report-chart-loading">Đang tải biểu đồ…</div>}><StoryChoiceChart decisions={decisions} active={active} /></Suspense> : <p className="class-report-empty-inline">Chưa có lựa chọn trong cốt truyện.</p>}</section>;
}

function ChapterProgress({ chapter }) {
  const [selected, setSelected] = useState(null);
  const progress = chapter.progress || {};
  const items = [
    { key: "submitted", label: "Đã nộp", tone: "submitted" },
    { key: "finishedNotSubmitted", label: "Xong, chưa nộp", tone: "waiting" },
    { key: "inProgress", label: "Đang học chương này", tone: "playing" },
    { key: "notStarted", label: "Chưa tới chương", tone: "not-started" },
  ];
  const selectedItem = items.find((item) => item.key === selected);
  const preview = (list) => list?.length ? `${list.slice(0, 3).map((item) => item.displayName || "Học sinh").join(", ")}${list.length > 3 ? `, +${list.length - 3}` : ""}` : "Không có em nào";
  return <section className="class-report-section class-report-progress-chart"><header><div><h2>Tiến độ chương</h2><p>Mỗi em chỉ nằm trong một nhóm · Các nhóm cộng lại bằng sĩ số lớp · Bấm để xem tên.</p></div></header><div className="class-report-progress-stats">{items.map((item) => <button type="button" key={item.key} className={`is-${item.tone}`} aria-pressed={selected === item.key} onClick={() => setSelected(selected === item.key ? null : item.key)}><strong>{progress[item.key]?.count || 0}</strong><span><i />{item.label}</span><small>{preview(progress[item.key]?.learners)}</small></button>)}</div><div className="class-report-progress-stack" role="img" aria-label={items.map((item) => `${progress[item.key]?.count || 0} ${item.label.toLowerCase()}`).join(", ")}>{items.map((item) => Number(progress[item.key]?.count) > 0 && <i key={item.key} className={`is-${item.tone}`} style={{ flex: progress[item.key].count }} />)}</div>{selectedItem && <div className="class-report-progress-detail"><strong>{selectedItem.label}</strong><LearnerLinks learners={progress[selectedItem.key]?.learners} empty="Chưa có học sinh trong nhóm này." /></div>}</section>;
}

function ClassChapterReport({ chapter, refreshChapter }) {
  useEffect(() => {
    if (!chapter || chapter.comment?.state !== "PREPARING") return undefined;
    const update = () => { if (document.visibilityState === "visible") void refreshChapter(chapter.chapter.number); };
    const timer = window.setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, [chapter, refreshChapter]);
  if (!chapter) return <section className="ws-card class-report-empty"><strong>Chưa có báo cáo theo chương</strong><p>Khi học sinh bắt đầu học và nộp bài trắc nghiệm, kết quả sẽ xuất hiện tại đây.</p></section>;
  const submitted = Number(chapter.progress?.submitted?.count) || 0;
  const classSize = Number(chapter.classSize) || 0;
  return <section className="class-report-chapters">
    <div className="class-report-chapter-sheet">
      <header className="class-report-chapter-heading"><div><h1>Chương {chapter.chapter.number} · {chapter.chapter.title}</h1><p>Theo dõi tiến độ, kết quả nội dung và lựa chọn của lớp.</p></div><div><strong>{submitted}/{classSize}</strong><span>em đã nộp bài sau chương</span></div></header>
      <ChapterProgress chapter={chapter} />
      <ClassComment chapter={chapter} />
      <ConceptList concepts={chapter.concepts} />
      <DecisionList decisions={chapter.storyDecisions} active={classSize} />
    </div>
  </section>;
}

function CourseOverview({ report }) {
  const rows = report.learners || [];
  const totalChapters = report.chapters?.length || 8;
  const sortedRows = [...rows].sort((a, b) => Number(a.postTestsSubmitted > 0) - Number(b.postTestsSubmitted > 0) || Number(a.chaptersDone) - Number(b.chaptersDone) || String(a.displayName || "").localeCompare(String(b.displayName || ""), "vi"));
  return <div className="class-report-course-view"><Suspense fallback={<div className="class-report-chart-loading">Đang tải biểu đồ cả lớp…</div>}><CourseOverviewCharts report={report} /></Suspense><section className="ws-card class-report-course-roster"><header><div><h2>Danh sách lớp</h2><p>{rows.length} học sinh đang hoạt động · Ưu tiên em chưa chơi hoặc chưa nộp</p></div></header>{rows.length ? <div className="ws-table-wrap"><table><thead><tr><th>Học sinh</th><th>Đã xong</th><th>Bài trắc nghiệm sau chương đã nộp</th><th>Kết quả bài trắc nghiệm sau chương</th><th>Hoạt động gần nhất</th><th>Báo cáo</th></tr></thead><tbody>{sortedRows.map((row) => <tr key={row.slotId}><td><strong>{row.displayName || "Học sinh"}</strong><small>{row.code || "—"}</small></td><td>{row.chaptersDone || 0}/{totalChapters} chương</td><td>{row.postTestsSubmitted || 0}</td><td>{row.postTestTotal ? `${row.postTestCorrect || 0}/${row.postTestTotal} câu` : "—"}</td><td>{shortDateTime(row.lastActiveAt)}</td><td><Link className="ws-report-detail-button" to={`/dashboard/learners/${row.slotId}`}><MapPinned /> Xem báo cáo</Link></td></tr>)}</tbody></table></div> : <Empty>Chưa có học sinh đang hoạt động.</Empty>}</section></div>;
}

export default function TeacherReportsContent({ reportState }) {
  const [view, setView] = useState("chapter");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const {
    groups,
    selectedGroup,
    groupId,
    setGroupId,
    courseReport,
    getChapterReport,
    loadChapter,
    loading,
    updating,
    error,
    warning,
    refresh,
    refreshChapter,
  } = reportState;
  const chapters = Array.isArray(courseReport?.chapters) ? courseReport.chapters : [];
  const activeChapter = chapters.some((chapter) => chapter.number === selectedChapter) ? selectedChapter : chapters[0]?.number ?? null;
  const chapterReport = activeChapter ? getChapterReport(activeChapter) : null;
  const exportRows = (courseReport?.learners || []).map((row) => ({
    ...row,
    status: "ACTIVE",
    completedChapters: row.chaptersDone,
    quizSubmitted: row.postTestsSubmitted,
    averageScore: row.postTestTotal ? `${row.postTestCorrect || 0}/${row.postTestTotal}` : "",
  }));
  useEffect(() => {
    if (groupId && activeChapter) void loadChapter(groupId, activeChapter);
  }, [activeChapter, groupId, loadChapter]);
  if (loading) return <ContentSkeleton variant="table" label="Đang tải báo cáo lớp học…" />;
  if (error)
    return (
      <Empty>
        {error}{" "}
        <button className="ws-btn" onClick={() => void refresh()}>
          Thử lại
        </button>
      </Empty>
    );
  if (!courseReport)
    return (
      <>
        <Heading
          title="Báo cáo lớp học"
          description="Theo dõi tiến độ của học sinh."
        />
        <Empty>Chưa có lớp để hiển thị báo cáo.</Empty>
      </>
    );
  return (
    <>
      <div className="class-report-controlbar">
        <div className="class-report-controlbar-top">
          <div className="class-report-context-controls">
            <label>
              <span>Lớp</span>
              <select value={groupId} disabled={updating} onChange={(event) => setGroupId(event.target.value)}>
                {groups.map((group) => <option key={group.id} value={group.id}>{group.name}{group.closedAt ? " · Đã kết thúc" : ""}</option>)}
              </select>
            </label>
            <nav className="class-report-view-tabs" aria-label="Phạm vi báo cáo">
              <button type="button" aria-pressed={view === "chapter"} onClick={() => setView("chapter")}>
                <strong>Theo chương</strong>
              </button>
              <button type="button" aria-pressed={view === "course"} onClick={() => setView("course")}>
                <strong>Cả lớp</strong>
              </button>
            </nav>
          </div>
          <div className="class-report-export-actions"><button type="button" disabled={!exportRows.length} onClick={() => download(groupReportCsv(exportRows), `finteen-class-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-16le")}><Download size={15} /> Tải dữ liệu</button><button type="button" onClick={() => window.print()}><Printer size={15} /> In / Lưu PDF</button></div>
        </div>
        {view === "chapter" && <div className="class-report-chapter-tabs" role="tablist" aria-label="Chọn chương">{chapters.map((item) => <button type="button" role="tab" title={item.title} aria-selected={item.number === activeChapter} className={item.number === activeChapter ? "is-active" : ""} key={item.number} onClick={() => setSelectedChapter(item.number)}><span>{item.number}</span><span><strong>{item.title}</strong></span></button>)}</div>}
      </div>
      {warning && (
        <p className="ws-notice" role="status">
          {warning}
        </p>
      )}
      {updating && !chapterReport && view === "chapter" ? <ContentSkeleton variant="cards" label={`Đang tải báo cáo chương ${activeChapter || ""}…`} /> : view === "chapter" ? <ClassChapterReport chapter={chapterReport} refreshChapter={refreshChapter} /> : <CourseOverview report={courseReport} group={selectedGroup} />}
    </>
  );
}
