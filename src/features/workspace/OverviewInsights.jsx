import {
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  CircleAlert,
  ClipboardList,
  Clock3,
  Layers3,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { dateLabel } from "./format";
import "./overview-insights.css";

const quickActions = {
  parent: [
    ["/dashboard/learners", "Quản lý hồ sơ", "Tạo mã, đổi PIN và quản lý các con", UserPlus],
    ["/dashboard/reports", "Xem báo cáo", "Theo dõi tiến độ và 5 chỉ số", BarChart3],
    ["/dashboard/plans", "Gói học tập", "Kiểm tra thời hạn và quyền lợi", BookOpenCheck],
  ],
  teacher: [
    ["/dashboard/groups", "Quản lý lớp", "Thiết lập lớp và học sinh", Layers3],
    ["/dashboard/quiz-management", "Quản lý Quiz", "Tạo đề, phát hành và xem kết quả", ClipboardList],
    ["/dashboard/reports", "Báo cáo lớp", "Nhận ra học sinh cần hỗ trợ", BarChart3],
  ],
};

function progressOf(row, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((Number(row.completedChapters || 0) / total) * 100));
}

export default function OverviewInsights({ report, role }) {
  const rows = Array.isArray(report?.rows) ? report.rows : [];
  const total = Number(report?.summary?.totalChapters || 0);
  const activeRows = rows
    .filter((row) => row.status === "ACTIVE")
    .sort((a, b) => new Date(b.lastActiveAt || 0) - new Date(a.lastActiveAt || 0));
  const recent = activeRows.slice(0, 4);
  const needsAttention = activeRows.filter(
    (row) => !row.lastActiveAt || progressOf(row, total) < 35,
  );
  const isTeacher = role === "teacher";

  return (
    <section className="ws-overview-insights" aria-label="Thông tin tổng quan mở rộng">
      <div className="ws-overview-insights-main">
        <div className="ws-overview-section-head">
          <div>
            <span><Users size={17} /></span>
            <div>
              <h2>{isTeacher ? "Nhịp học của lớp" : "Hành trình gần đây"}</h2>
              <p>{isTeacher ? "Tiến độ mới nhất của học sinh đang hoạt động." : "Cập nhật mới nhất từ các con trong gia đình."}</p>
            </div>
          </div>
          <Link to="/dashboard/reports">Xem tất cả <ArrowUpRight size={15} /></Link>
        </div>

        {recent.length ? (
          <div className="ws-overview-learner-list">
            {recent.map((row) => {
              const progress = progressOf(row, total);
              return (
                <Link to={`/dashboard/learners/${row.slotId}`} key={row.slotId}>
                  <span className="ws-overview-avatar" aria-hidden="true">
                    {(row.displayName || "?").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="ws-overview-learner-copy">
                    <div>
                      <strong>{row.displayName || "Hồ sơ chưa đặt tên"}</strong>
                      <small>{row.lastActiveAt ? `Hoạt động ${dateLabel(row.lastActiveAt)}` : "Chưa bắt đầu hành trình"}</small>
                    </div>
                    <div className="ws-overview-progress" aria-label={`${progress}% tiến độ`}>
                      <span><i style={{ width: `${progress}%` }} /></span>
                      <em>{row.completedChapters || 0}/{total || 8} chương</em>
                    </div>
                  </div>
                  <ArrowUpRight size={17} />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="ws-overview-insight-empty">
            <Clock3 />
            <strong>Chưa có hoạt động học tập</strong>
            <p>{isTeacher ? "Tạo học sinh và chia sẻ mã đăng nhập để bắt đầu." : "Tạo hồ sơ cho con để theo dõi hành trình tại đây."}</p>
          </div>
        )}
      </div>

      <aside className="ws-overview-insights-side">
        <div className={`ws-overview-attention${needsAttention.length ? " has-items" : ""}`}>
          <span><CircleAlert size={18} /></span>
          <div>
            <small>{needsAttention.length ? "CẦN CHÚ Ý" : "MỌI THỨ ỔN ĐỊNH"}</small>
            <strong>
              {needsAttention.length
                ? `${needsAttention.length} ${isTeacher ? "học sinh" : "hồ sơ"} cần được khích lệ`
                : isTeacher ? "Cả lớp đang có tiến độ tốt" : "Các con đang có tiến độ tốt"}
            </strong>
            <p>
              {needsAttention.length
                ? "Chưa bắt đầu hoặc hoàn thành dưới 35% hành trình."
                : "Chưa phát hiện hồ sơ có tiến độ thấp trong nhóm hiện tại."}
            </p>
          </div>
        </div>

        <div className="ws-overview-quick-actions">
          <h2>Thao tác nhanh</h2>
          {quickActions[role].map(([to, title, description, Icon]) => (
            <Link to={to} key={to}>
              <span><Icon size={18} /></span>
              <div><strong>{title}</strong><small>{description}</small></div>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </aside>
    </section>
  );
}
