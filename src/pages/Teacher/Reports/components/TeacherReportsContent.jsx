import { useEffect, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle2, ChevronDown, ClipboardList, Clock3, History, MapPinned, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "../../../../features/workspace/format";
import {
  download,
  groupReportCsv,
} from "../../../../features/workspace/reporting";
import { Empty, Heading } from "../../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";
import ReportIndicatorHelp from "@/features/workspace/ReportIndicatorHelp";

const statusLabel = (status) =>
  ({ ACTIVE: "Hoạt động", ARCHIVED: "Đã thu hồi", WIPED: "Đã xoá" })[status] ||
  (status ? "Không xác định" : "—");
const indicatorLabels = {
  wealth: "Tài sản",
  saving: "Tiết kiệm",
  happiness: "Hạnh phúc",
  risk: "Rủi ro",
  goal: "Mục tiêu",
};
const indicatorText = (indicators) =>
  indicators
    ? Object.entries(indicators)
        .map(
          ([key, value]) =>
            `${indicatorLabels[key] || key}: ${value < 34 ? "thấp" : value < 67 ? "vừa" : "cao"}`,
        )
        .join(" · ")
    : "Chưa có dữ liệu";

const chapterStateCopy = {
  WAITING: "Chưa có nhận xét. Lớp nộp thêm bài sau chương thì sẽ có nhận xét. Số liệu bên dưới đã xem được.",
  PREPARING: "Nhận xét mới đang được chuẩn bị, đợi tí nhé!",
  BASIC: "Bản tóm tắt nhanh từ số liệu của lớp.",
};
const conceptBand = {
  GOOD: "Lớp làm tốt",
  FAMILIAR: "Đang làm quen",
  PRACTICE: "Cần ôn lại",
  NO_DATA: "Chưa đủ câu",
};

function LearnerLinks({ learners, empty = "Không có học sinh trong danh sách này." }) {
  if (!learners?.length) return <p className="class-report-empty-inline">{empty}</p>;
  return <div className="class-report-learners">{learners.map((learner, index) => learner?.slotId
    ? <Link key={learner.slotId} to={`/dashboard/learners/${encodeURIComponent(learner.slotId)}`}>{learner.displayName || "Học sinh"}</Link>
    : <span key={index}>{learner?.displayName || "Học sinh đã xoá"}</span>)}</div>;
}

function ClassComment({ chapter }) {
  const comment = chapter.comment || { state: "WAITING" };
  const state = comment.state || "WAITING";
  const preparingWithPrevious = state === "PREPARING" && Boolean(comment.text);
  return <section className={`class-report-comment is-${state.toLowerCase()}`}>
    <div className="class-report-comment-head">
      <div><h3>Nhận xét chương</h3>{comment.basedOn != null && <span>Nhận xét lúc {comment.basedOn}/{chapter.active || 0} em{comment.at ? ` · ${dateLabel(comment.at)}` : ""}</span>}</div>
      {state === "PREPARING" ? <Clock3 aria-hidden="true" /> : state === "WAITING" ? <AlertCircle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
    </div>
    {state !== "READY" && <p className="class-report-state-copy">{chapterStateCopy[state] || chapterStateCopy.WAITING}</p>}
    {comment.text && <div className="class-report-comment-text">{preparingWithPrevious && <strong>Nhận xét hiện có</strong>}<p>{comment.text}</p></div>}
    {chapter.history?.length > 0 && <details className="class-report-history"><summary><History size={16} /> Bản trước ({chapter.history.length}) <ChevronDown size={16} /></summary><ol>{chapter.history.map((item, index) => <li key={`${item.at || "history"}-${index}`}><span>Nhận xét lúc {item.basedOn ?? "—"}/{chapter.active || 0} em{item.at ? ` · ${dateLabel(item.at)}` : ""}</span><p>{item.text || "Không có nội dung."}</p></li>)}</ol></details>}
  </section>;
}

function ConceptList({ concepts = [] }) {
  return <section className="class-report-section"><header><div><h3>Nội dung trong chương</h3><p>Nội dung cần hỗ trợ được xếp trước.</p></div></header>{concepts.length ? <div className="class-report-concepts">{concepts.map((concept, index) => {
    const total = Number(concept.total) || 0;
    const correct = Number(concept.correct) || 0;
    const percent = total > 0 ? Math.min(100, Math.round(correct / total * 100)) : 0;
    return <details key={`${concept.name || "concept"}-${index}`} className={`class-report-concept is-${String(concept.band || "NO_DATA").toLowerCase()}`}>
      <summary><span className="class-report-rank">{index + 1}</span><div className="class-report-concept-name"><strong>{concept.name || "Nội dung học tập"}</strong>{concept.objective && <span>{concept.objective}</span>}</div><span className="class-report-band">{conceptBand[concept.band] || conceptBand.NO_DATA}</span><span className="class-report-ratio">{correct}/{total}</span><span className="class-report-concept-bar"><i style={{ width: `${percent}%` }} /></span><ChevronDown size={17} /></summary>
      <div className="class-report-concept-detail"><strong>{concept.wrongLearners?.length || 0} em sai ít nhất 1 câu</strong><LearnerLinks learners={concept.wrongLearners} empty="Chưa ghi nhận em nào cần xem lại nội dung này." /></div>
    </details>;
  })}</div> : <p className="class-report-empty-inline">Chưa có dữ liệu nội dung cho chương này.</p>}</section>;
}

function DecisionList({ decisions = [] }) {
  return <section className="class-report-section"><header><div><h3>Lựa chọn trong câu chuyện</h3><p>Phân bố lựa chọn của lớp, không đánh giá đúng hay sai.</p></div></header>{decisions.length ? <div className="class-report-decisions">{decisions.map((decision, decisionIndex) => {
    const total = (decision.options || []).reduce((sum, option) => sum + (Number(option.count) || 0), 0);
    return <article key={`${decision.question || "decision"}-${decisionIndex}`}><h4>{decision.question || `Tình huống ${decisionIndex + 1}`}</h4><div>{(decision.options || []).map((option, optionIndex) => {
      const count = Number(option.count) || 0;
      const percent = total > 0 ? Math.round(count / total * 100) : 0;
      return <details key={`${option.label || "option"}-${optionIndex}`}><summary><span>{option.label || `Lựa chọn ${optionIndex + 1}`}</span><i><b style={{ width: `${percent}%` }} /></i><strong>{count} em</strong><ChevronDown size={16} /></summary><LearnerLinks learners={option.learners} /></details>;
    })}</div></article>;
  })}</div> : <p className="class-report-empty-inline">Chưa có lựa chọn trong câu chuyện để tổng hợp.</p>}</section>;
}

function ClassChapterReport({ report, refreshGroup }) {
  const chapters = Array.isArray(report.chapters) ? report.chapters : [];
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]?.chapter ?? null);
  const chapter = chapters.find((item) => item.chapter === selectedChapter) || chapters[0];
  useEffect(() => {
    if (!chapter || chapter.comment?.state !== "PREPARING") return undefined;
    const update = () => { if (document.visibilityState === "visible") void refreshGroup(report.group.id); };
    const timer = window.setInterval(update, 60_000);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, [chapter, refreshGroup, report.group.id]);
  if (!chapter) return <section className="ws-card class-report-empty"><strong>Chưa có báo cáo theo chương</strong><p>Khi lớp bắt đầu học và nộp bài sau chương, số liệu sẽ xuất hiện tại đây.</p></section>;
  const active = Number(chapter.active) || 0;
  const submitted = Number(chapter.submitted) || 0;
  const submittedPercent = active > 0 ? Math.min(100, Math.round(submitted / active * 100)) : 0;
  return <section className="ws-card class-report-chapters">
    <div className="class-report-chapter-tabs" role="tablist" aria-label="Chọn chương">{chapters.map((item) => <button type="button" role="tab" aria-selected={item.chapter === chapter.chapter} className={item.chapter === chapter.chapter ? "is-active" : ""} key={item.chapter} onClick={() => setSelectedChapter(item.chapter)}>Chương {item.chapter}<small>{item.title}</small></button>)}</div>
    <div className="class-report-progress"><div><strong>Chương {chapter.chapter}: {chapter.title}</strong><span>{submitted}/{active} em đã nộp bài sau chương</span></div><div role="progressbar" aria-label="Tiến độ nộp bài sau chương" aria-valuemin="0" aria-valuemax={active} aria-valuenow={submitted}><i style={{ width: `${submittedPercent}%` }} /></div></div>
    <ClassComment chapter={chapter} />
    <ConceptList concepts={chapter.concepts} />
    <DecisionList decisions={chapter.decisions} />
    <section className="class-report-section class-report-follow-up"><header><div><h3>Theo dõi thêm</h3><p>Bấm tên học sinh để mở báo cáo chi tiết.</p></div></header><div><article><strong>Chưa xong chương</strong><LearnerLinks learners={chapter.notFinished} /></article><article><strong>Chưa nộp bài sau chương</strong><LearnerLinks learners={chapter.notSubmitted} /></article></div></section>
  </section>;
}

export default function TeacherReportsContent({ reportState }) {
  const {
    reports,
    report,
    rows,
    status,
    setStatus,
    setGroupId,
    loading,
    error,
    warning,
    refresh,
    refreshGroup,
  } = reportState;
  const quizAverage = report?.summary?.averageScore == null
    ? "—"
    : new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(report.summary.averageScore);
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
  if (!report)
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
      <Heading
        title="Báo cáo lớp học"
        description="Theo dõi tiến độ và hoạt động của từng học sinh."
      >
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      {warning && (
        <p className="ws-notice" role="status">
          {warning}
        </p>
      )}
      <div className="ws-toolbar ws-report-filters">
        <label>
          Lớp học
          <select
            value={report.group.id}
            onChange={(event) => setGroupId(event.target.value)}
          >
            {reports.map((item) => (
              <option key={item.group.id} value={item.group.id}>
                {item.group.name}
                {item.group.closedAt ? " · Đã kết thúc" : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Trạng thái
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="ARCHIVED">Đã thu hồi</option>
            <option value="WIPED">Đã xoá</option>
          </select>
        </label>
      </div>
      <div className="ws-actions ws-export">
        <button
          disabled={!rows.length}
          className="ws-btn"
          onClick={() =>
            download(
              groupReportCsv(rows),
              `finteen-class-${new Date().toISOString().slice(0, 10)}.csv`,
              "text/csv;charset=utf-16le",
            )
          }
        >
          Tải bảng dữ liệu
        </button>
        <button
          disabled={!rows.length}
          className="ws-btn primary"
          onClick={() => window.print()}
        >
          In / Lưu PDF
        </button>
      </div>
      <ClassChapterReport report={report} refreshGroup={refreshGroup} />
      <section className="ws-card ws-print-report">
        <h2>{report.group.name}</h2>
        <p>
          {report.summary.learners} học sinh · {report.summary.active} đang hoạt
          động · {report.summary.activeLast7Days} hoạt động trong 7 ngày
        </p>
        <p className="ws-muted">
          Đã hoàn thành {report.summary.chaptersCompleted} chương
          {report.frozenAt
            ? ` · Báo cáo đã được chốt ${dateLabel(report.frozenAt)}`
            : " · Tự động cập nhật theo hoạt động mới nhất"}
          .
        </p>
        <div className="ws-grid three" aria-label="Kết quả Quiz của lớp">
          <article><ClipboardList /><strong>{report.summary.quizAssigned ?? 0}</strong><p>Quiz đã giao</p></article>
          <article><CheckCircle2 /><strong>{report.summary.quizSubmitted ?? 0}</strong><p>Lượt học sinh đã nộp</p></article>
          <article><BarChart3 /><strong>{quizAverage}</strong><p>{report.summary.averageScore == null ? "Chưa có bài đã chấm" : "Số câu đúng trung bình mỗi lượt"}</p></article>
        </div>
        {rows.length ? (
          <div className="ws-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Học sinh</th>
                  <th>Trạng thái</th>
                  <th>Tiến độ</th>
                  <th><span className="ws-indicator-heading">5 chỉ số <ReportIndicatorHelp /></span></th>
                  <th>Hoạt động gần nhất</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.slotId}>
                    <td>
                      <strong>{row.displayName || "Đã xoá"}</strong>
                      <small>{row.code || "—"}</small>
                    </td>
                    <td>{statusLabel(row.status)}</td>
                    <td>
                      {row.completedChapters}/{report.summary.totalChapters}{" "}
                      chương
                    </td>
                    <td>{indicatorText(row.indicators)}</td>
                    <td>
                      {row.lastActiveAt
                        ? dateLabel(row.lastActiveAt)
                        : "Chưa chơi"}
                    </td>
                    <td>
                      <Link
                        className="ws-report-detail-button"
                        to={`/dashboard/learners/${row.slotId}`}
                      >
                        <MapPinned /> Xem hành trình
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>Không có học sinh phù hợp bộ lọc.</Empty>
        )}
      </section>
    </>
  );
}
