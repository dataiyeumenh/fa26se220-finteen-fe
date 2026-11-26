import { lazy, Suspense } from "react";
import {
  BookOpenCheck,
  ClipboardCheck,
  Download,
  MapPinned,
  Printer,
  RefreshCw,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "../../../../features/workspace/format";
import {
  download,
  groupReportCsv,
} from "../../../../features/workspace/reporting";
import { Empty } from "../../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";

const ParentCourseProgressChart = lazy(() => import("./ParentReportCharts"));
const activityLabel = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(new Date(value))
        .replace(",", " lúc")
    : "Chưa chơi";

export default function ParentReportsContent({ reportState }) {
  const { reports, report, setGroupId, loading, error, warning, refresh } =
    reportState;
  if (loading)
    return (
      <ContentSkeleton variant="table" label="Đang tải báo cáo gia đình…" />
    );
  if (error)
    return (
      <Empty>
        {error}{" "}
        <button className="ws-btn" onClick={() => void refresh()}>
          Thử lại
        </button>
      </Empty>
    );
  if (!report) return <Empty>Chưa có nhóm gia đình để hiển thị báo cáo.</Empty>;

  const allRows = report.rows || [];
  const activeRows = allRows.filter((row) => row.status === "ACTIVE");
  const removedCount = allRows.length - activeRows.length;
  const courseChapters = report.course?.chapters || [];
  const activeLearnerCount =
    Number(report.course?.classSize) ||
    report.course?.learners?.length ||
    activeRows.length;
  const totalChapters =
    Number(report.course?.totalChapters) ||
    courseChapters.length ||
    Number(report.summary.totalChapters) ||
    8;
  const chaptersFinished = courseChapters.reduce(
    (sum, chapter) => sum + (Number(chapter.finished) || 0),
    0,
  );
  const testsSubmitted = courseChapters.reduce(
    (sum, chapter) => sum + (Number(chapter.submitted) || 0),
    0,
  );
  const familyChapterTotal = activeLearnerCount * totalChapters;
  const chapterProgress = familyChapterTotal
    ? Math.min(100, Math.round((chaptersFinished / familyChapterTotal) * 100))
    : 0;
  const testProgress = familyChapterTotal
    ? Math.min(100, Math.round((testsSubmitted / familyChapterTotal) * 100))
    : 0;

  return (
    <div className="family-report-page is-child-first">
      <header className="family-report-commandbar">
        <div>
          <h1>{report.group.name}</h1>
          <p>
            {report.frozenAt
              ? `Đã chốt ${dateLabel(report.frozenAt)}`
              : "Tự động cập nhật theo hoạt động mới nhất"}
          </p>
        </div>
        <label>
          Nhóm gia đình
          <select
            value={report.group.id}
            onChange={(event) => setGroupId(event.target.value)}
          >
            {reports.map((item) => (
              <option key={item.group.id} value={item.group.id}>
                {item.group.name}
                {item.group.closedAt ? " · Đã đóng" : ""}
              </option>
            ))}
          </select>
        </label>
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </header>
      {warning && (
        <p className="ws-notice" role="status">
          {warning}
        </p>
      )}

      <section
        className="family-report-key-stats"
        aria-label="Tiến độ chung của các bé"
      >
        <header>
          <div>
            <span className="family-report-overview-icon">
              <Users size={20} />
            </span>
            <div>
              <h2>Tiến độ chung của các bé</h2>
              <p>Tổng hợp từ {activeLearnerCount} bé đang hoạt động</p>
            </div>
          </div>
          <strong>{activeLearnerCount} bé</strong>
        </header>
        <div className="family-report-overview-metrics">
          <article>
            <div className="family-report-overview-label">
              <BookOpenCheck size={19} />
              <span>Hoàn thành chương</span>
            </div>
            <div className="family-report-overview-value">
              <strong>{chaptersFinished}</strong>
              <span>/ {familyChapterTotal} chương</span>
              <em>{chapterProgress}%</em>
            </div>
            <i aria-hidden="true">
              <b style={{ width: `${chapterProgress}%` }} />
            </i>
            <p>Cộng số chương từng bé đã hoàn thành.</p>
          </article>
          <article>
            <div className="family-report-overview-label">
              <ClipboardCheck size={19} />
              <span>Bài trắc nghiệm sau chương</span>
            </div>
            <div className="family-report-overview-value">
              <strong>{testsSubmitted}</strong>
              <span>/ {familyChapterTotal} bài</span>
              <em>{testProgress}%</em>
            </div>
            <i aria-hidden="true">
              <b style={{ width: `${testProgress}%` }} />
            </i>
            <p>Cộng số bài các bé đã nộp sau mỗi chương.</p>
          </article>
        </div>
      </section>

      <Suspense
        fallback={
          <ContentSkeleton variant="cards" label="Đang tải biểu đồ tiến độ…" />
        }
      >
        <ParentCourseProgressChart chapters={courseChapters} />
      </Suspense>

      <section className="family-report-roster family-report-child-cards">
        <header>
          <div>
            <h2>Tiến độ của các bé</h2>
            <p>{activeRows.length} bé đang hoạt động</p>
          </div>
          <div className="family-report-actions">
            <button
              disabled={!activeRows.length}
              className="ws-btn"
              onClick={() =>
                download(
                  groupReportCsv(activeRows),
                  `finteen-family-${new Date().toISOString().slice(0, 10)}.csv`,
                  "text/csv;charset=utf-16le",
                )
              }
            >
              <Download size={16} /> Tải dữ liệu
            </button>
            <button
              disabled={!activeRows.length}
              className="ws-btn primary"
              onClick={() => window.print()}
            >
              <Printer size={16} /> In PDF
            </button>
          </div>
        </header>
        {activeRows.length ? (
          <div className="family-report-list">
            {activeRows.map((row) => {
              const completed = Number(row.completedChapters) || 0;
              const progress = totalChapters
                ? Math.round((completed / totalChapters) * 100)
                : 0;
              return (
                <article key={row.slotId}>
                  <div className="family-report-child">
                    <span>
                      {(row.displayName || "?").trim().charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <strong>{row.displayName || "Bé"}</strong>
                      <small>
                        Hoạt động gần nhất: {activityLabel(row.lastActiveAt)}
                      </small>
                    </div>
                  </div>
                  <div className="family-report-child-progress">
                    <div>
                      <span>Tiến độ học</span>
                      <strong>
                        {completed}/{totalChapters} chương
                      </strong>
                    </div>
                    <i
                      role="progressbar"
                      aria-label={`${completed}/${totalChapters} chương`}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <b style={{ width: `${progress}%` }} />
                    </i>
                  </div>
                  <Link
                    className="ws-report-detail-button"
                    to={`/dashboard/learners/${row.slotId}`}
                  >
                    <MapPinned /> Xem báo cáo
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <Empty>Chưa có bé đang hoạt động.</Empty>
        )}
        {removedCount > 0 && (
          <p className="family-report-removed-count">
            {removedCount} hồ sơ đã xoá hoặc thu hồi
          </p>
        )}
      </section>
    </div>
  );
}
