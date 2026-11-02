import { DataSourceNote } from "@/features/workspace/ui";
import { endingReportMock as report } from "./endingReportMock.js";

export default function MockChapterReport() {
  return <section className="vn-report">
    <DataSourceNote>Báo cáo cuối chương đang phát triển. Điểm, số dư và nhận xét là ví dụ minh họa, không phải kết quả của bạn và không được lưu lên server.</DataSourceNote>
    <div className="vn-report-grid">
      <div className="vn-report-card"><small>Điểm học tập mẫu</small><strong>{report.learningScore}/100</strong><span>{report.bandLabel}</span></div>
      <div className="vn-report-card"><small>Số dư cuối chương mẫu</small><strong>{report.money.end.toLocaleString("vi-VN")} đ</strong><span>Ban đầu {report.money.start.toLocaleString("vi-VN")} đ</span></div>
    </div>
    <p><b>Đã làm tốt:</b> {report.achieved}</p>
    <p><b>Cần luyện thêm:</b> {report.practice}</p>
    <p><b>Bước tiếp theo:</b> {report.next}</p>
  </section>;
}
