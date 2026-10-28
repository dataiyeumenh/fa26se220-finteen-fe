import { MapPinned, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "../../../../features/workspace/format";
import {
  download,
  groupReportCsv,
} from "../../../../features/workspace/reporting";
import { Empty, Heading } from "../../../../features/workspace/ui";

const statusLabel = (status) =>
  ({ ACTIVE: "Hoạt động", ARCHIVED: "Đã thu hồi", WIPED: "Đã xoá" })[status] ||
  status;
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
  if (loading) return <Empty>Đang tải báo cáo từ máy chủ…</Empty>;
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
          Xuất CSV
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
            ? ` · Đóng băng ${dateLabel(report.frozenAt)}`
            : " · Dữ liệu trực tiếp"}
          .
        </p>
        {rows.length ? (
          <div className="ws-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Trẻ</th>
                  <th>Trạng thái</th>
                  <th>Tiến độ</th>
                  <th>5 chỉ số</th>
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
