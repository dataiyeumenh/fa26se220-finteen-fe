import {
  Activity,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Heading } from "../../../../features/workspace/ui";
import { ContentSkeleton } from "@/components/feedback/LoadingState";
import OverviewInsights from "@/features/workspace/OverviewInsights";
import "../styles/teacher-dashboard.css";

const count = (value) => value == null ? "—" : new Intl.NumberFormat("vi-VN").format(value);

export default function TeacherDashboardContent({ actor, dashboardState }) {
  const { dashboard, loading, error, refetch } = dashboardState;
  const summary = dashboard?.report?.summary;
  const group = dashboard?.report?.group || dashboard?.group;
  return (
    <>
      <Heading
        title={`Chào ${actor.displayName || actor.name}!`}
        description="Tổng quan các lớp học, học sinh và bài quiz bạn đang quản lý."
      >
        <button
          className="ws-btn"
          onClick={() => void refetch()}
          disabled={loading}
        >
          Làm mới
        </button>
      </Heading>
      {error && (
        <p className="ws-notice" role="alert">
          {error}
        </p>
      )}
      {loading && !dashboard ? (
        <ContentSkeleton label="Đang tải tổng quan lớp học…" />
      ) : !dashboard ? null : !group ? (
        <section className="ws-overview-hero">
          <div>
            <span className="ws-overview-kicker">BẮT ĐẦU THIẾT LẬP</span>
            <h2>Tạo lớp học đầu tiên</h2>
            <p>Mở lớp, xác nhận đồng ý của phụ huynh và tạo hồ sơ học sinh.</p>
            <Link className="ws-btn primary" to="/dashboard/groups">
              Thiết lập ngay <ArrowRight size={16} />
            </Link>
          </div>
          <Users />
        </section>
      ) : (
        <>
          <section className="ws-overview-live">
            <div>
              <span className="ws-overview-kicker">
                {group.closedAt ? "LỚP ĐANG THEO DÕI · ĐÃ KẾT THÚC" : "LỚP ĐANG THEO DÕI · ĐANG MỞ"}
              </span>
              <h2>{group.name}</h2>
              <p>
                {count(summary?.learners)} học sinh trong lớp · {count(summary?.active)} đang hoạt động.
              </p>
              <div className="ws-actions">
                <Link className="ws-btn primary" to="/dashboard/reports">
                  Xem báo cáo chi tiết <ArrowRight size={16} />
                </Link>
                <Link className="ws-btn" to="/dashboard/learners">
                  Quản lý học sinh
                </Link>
              </div>
            </div>
            <div className="ws-overview-live-score">
              <Activity />
              <strong>{count(summary?.activeLast7Days)}</strong>
              <span>học sinh lớp này hoạt động trong 7 ngày</span>
            </div>
          </section>

        </>
      )}
      {dashboard && <div className="ws-overview-metrics ws-teacher-metrics" aria-label="Tổng quan trên tất cả lớp" aria-busy={loading}>
        <Link to="/dashboard/groups">
          <span><BookOpen /></span>
          <div><small>TỔNG LỚP HỌC</small><strong>{count(dashboard.groupCount)}</strong><p>{loading ? "Đang cập nhật…" : `${count(dashboard.activeGroupCount)} lớp đang mở · ${count(dashboard.groupCount - dashboard.activeGroupCount)} đã kết thúc`}</p></div>
        </Link>
        <Link to="/dashboard/learners">
          <span><Users /></span>
          <div><small>TỔNG HỌC SINH</small><strong>{count(dashboard.studentCount)}</strong><p>{loading ? "Đang cập nhật…" : dashboard.studentCount == null ? "Chưa tải đầy đủ dữ liệu" : "Trên tất cả lớp học"}</p></div>
        </Link>
        <Link to="/dashboard/quiz-management">
          <span><ClipboardList /></span>
          <div><small>BÀI QUIZ ĐANG QUẢN LÝ</small><strong>{count(dashboard.quizCount)}</strong><p>{loading ? "Đang cập nhật…" : dashboard.quizCount == null ? "Chưa tải đầy đủ dữ liệu" : "Tổng bài quiz trên tất cả lớp"}</p></div>
        </Link>
      </div>}
      {dashboard?.report && <OverviewInsights report={dashboard.report} role="teacher" />}
    </>
  );
}
