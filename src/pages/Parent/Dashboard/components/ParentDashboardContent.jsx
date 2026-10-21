import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Empty, Heading } from "../../../../features/workspace/ui";

export default function ParentDashboardContent({ actor, dashboardState }) {
  const { dashboard, loading, error, refetch } = dashboardState;
  const summary = dashboard?.report?.summary;
  const group = dashboard?.report?.group || dashboard?.group;
  return (
    <>
      <Heading
        title={`Chào ${actor.name}!`}
        description="Tình hình học tập của các con trong gia đình."
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
        <Empty>Đang tải tổng quan từ máy chủ…</Empty>
      ) : !group ? (
        <section className="ws-overview-hero">
          <div>
            <span className="ws-overview-kicker">BẮT ĐẦU THIẾT LẬP</span>
            <h2>Tạo không gian gia đình</h2>
            <p>Mở nhóm gia đình để tạo hồ sơ và mã đăng nhập cho các con.</p>
            <Link className="ws-btn primary" to="/dashboard/learners">
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
                {group.closedAt ? "NHÓM ĐÃ KẾT THÚC" : "ĐANG HOẠT ĐỘNG"}
              </span>
              <h2>{group.name}</h2>
              <p>Theo dõi hành trình của các con tại một nơi.</p>
              <div className="ws-actions">
                <Link className="ws-btn primary" to="/dashboard/reports">
                  Xem báo cáo chi tiết <ArrowRight size={16} />
                </Link>
                <Link className="ws-btn" to="/dashboard/learners">
                  Quản lý hồ sơ
                </Link>
              </div>
            </div>
            <div className="ws-overview-live-score">
              <Activity />
              <strong>{summary?.activeLast7Days ?? 0}</strong>
              <span>hoạt động trong 7 ngày</span>
            </div>
          </section>
          <div className="ws-overview-metrics">
            <Link to="/dashboard/learners">
              <span>
                <Users />
              </span>
              <div>
                <small>TỔNG HỒ SƠ</small>
                <strong>{summary?.learners ?? 0}</strong>
                <p>{summary?.active ?? 0} đang hoạt động</p>
              </div>
            </Link>
            <Link to="/dashboard/reports">
              <span>
                <Activity />
              </span>
              <div>
                <small>HOẠT ĐỘNG GẦN ĐÂY</small>
                <strong>{summary?.activeLast7Days ?? 0}</strong>
                <p>Trong 7 ngày gần nhất</p>
              </div>
            </Link>
            <Link to="/dashboard/reports">
              <span>
                <CheckCircle2 />
              </span>
              <div>
                <small>CHƯƠNG HOÀN THÀNH</small>
                <strong>{summary?.chaptersCompleted ?? 0}</strong>
                <p>Tổng trên mọi hồ sơ</p>
              </div>
            </Link>
            <Link to="/dashboard/learners">
              <span>
                <BookOpen />
              </span>
              <div>
                <small>NHÓM GIA ĐÌNH</small>
                <strong>{dashboard.groupCount}</strong>
                <p>
                  {summary?.active ?? 0}/{group.slotLimit} chỗ đang dùng
                </p>
              </div>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
