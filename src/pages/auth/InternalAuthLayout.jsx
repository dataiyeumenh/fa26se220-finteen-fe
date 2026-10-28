import { Link, Outlet } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCheck,
  Layers3,
  LockKeyhole,
  PenLine,
  ShieldCheck,
} from "lucide-react";
import "./internal-auth.css";

const roles = [
  [ShieldCheck, "Admin", "Quản trị hệ thống"],
  [Layers3, "Game Manager", "Quản lý phát hành"],
  [PenLine, "Game Editor", "Biên tập nội dung"],
  [CheckCheck, "Game Reviewer", "Kiểm duyệt chất lượng"],
];

export default function InternalAuthLayout() {
  return (
    <div className="ft-public internal-auth">
      <header className="internal-auth-header">
        <Link className="internal-auth-brand" to="/">
          <span>
            <Layers3 size={23} aria-hidden="true" />
          </span>
          finteen
          <span className="internal-auth-brand-divider" />{" "}
          <small>WORKSPACE</small>
        </Link>
        <Link className="internal-auth-back" to="/">
          <ArrowLeft size={15} aria-hidden="true" /> Về trang chủ
        </Link>
      </header>
      <main className="internal-auth-main">
        <aside
          className="internal-auth-story"
          aria-label="Không gian làm việc nội bộ"
        >
          <span className="internal-auth-eyebrow">
            <span /> CỔNG TRUY CẬP NỘI BỘ
          </span>
          <h2>
            Cùng tạo nên <br />
            những trải nghiệm <br />
            <em>học tập tốt hơn.</em>
          </h2>
          <p>
            Không gian dành cho đội ngũ xây dựng, kiểm duyệt và vận hành nội
            dung FinTeen.
          </p>
          <div className="internal-auth-roles">
            {roles.map(([Icon, title, description]) => (
              <div key={title}>
                <span>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="internal-auth-access-note">
            <LockKeyhole size={17} aria-hidden="true" />
            <p>Truy cập bằng tài khoản đã được quản trị viên cấp quyền.</p>
          </div>
        </aside>
        <div className="internal-auth-form-column">
          <div className="internal-auth-card">
            <div className="internal-auth-lock">
              <LockKeyhole size={25} aria-hidden="true" />
            </div>
            <Outlet />
          </div>
          <p className="internal-auth-user-link">
            Bạn là phụ huynh hoặc học sinh?{" "}
            <Link to="/login">
              Đăng nhập người dùng <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </main>
      <footer className="internal-auth-footer">
        <span>FinTeen · Internal Workspace</span>
        <span>Nội dung tốt bắt đầu từ đội ngũ tận tâm.</span>
      </footer>
    </div>
  );
}
