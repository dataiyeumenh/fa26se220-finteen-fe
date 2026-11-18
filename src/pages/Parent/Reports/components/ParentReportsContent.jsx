import { BarChart3, CheckCircle2, ClipboardList, MapPinned, RefreshCw } from "lucide-react";
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

export default function ParentReportsContent({ reportState }) {
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
  } = reportState;
  const quizAverage = report?.summary?.averageScore == null
    ? "—"
    : new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(report.summary.averageScore);
  if (loading) return <ContentSkeleton variant="table" label="Đang tải báo cáo gia đình…" />;
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
          title="Tiến độ của các con"
          description="Theo dõi hành trình học tập trong gia đình."
        />
        <Empty>Chưa có nhóm gia đình để hiển thị báo cáo.</Empty>
      </>
    );
  return (
    <>
      <Heading
        title="Tiến độ của các con"
        description="Dữ liệu trực tiếp từ không gian gia đình."
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
              `finteen-family-${new Date().toISOString().slice(0, 10)}.csv`,
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
      <section className="ws-card ws-print-report">
        <h2>{report.group.name}</h2>
        <p>
          {report.summary.learners} hồ sơ · {report.summary.active} đang hoạt
          động · {report.summary.activeLast7Days} hoạt động trong 7 ngày
        </p>
        <p className="ws-muted">
          Đã hoàn thành {report.summary.chaptersCompleted} chương
          {report.frozenAt
            ? ` · Báo cáo đã được chốt ${dateLabel(report.frozenAt)}`
            : " · Tự động cập nhật theo hoạt động mới nhất"}
          .
        </p>
        <div className="ws-grid three" aria-label="Kết quả bài ôn tập sau chương">
          <article><ClipboardList /><strong>{report.summary.quizAssigned ?? 0}</strong><p>Bài ôn tập đã giao</p></article>
          <article><CheckCircle2 /><strong>{report.summary.quizSubmitted ?? 0}</strong><p>Lượt các con đã nộp</p></article>
          <article><BarChart3 /><strong>{quizAverage}</strong><p>{report.summary.averageScore == null ? "Chưa có bài đã chấm" : "Số câu đúng trung bình mỗi lượt"}</p></article>
        </div>
        {rows.length ? (
          <div className="ws-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Trẻ</th>
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
          <Empty>Không có hồ sơ phù hợp bộ lọc.</Empty>
        )}
      </section>
    </>
  );
}
