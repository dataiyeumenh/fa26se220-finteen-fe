import { Link } from "react-router-dom";
import "./footer.css";

const navigation = [
  {
    title: "Khám phá FinTeen",
    links: [
      { label: "Dành cho ai", href: "/#danh-cho-ai" },
      { label: "Hành trình học tập", href: "/#hanh-trinh" },
      { label: "Theo dõi tiến bộ", href: "/#bao-cao" },
    ],
  },
  {
    title: "Bắt đầu đồng hành",
    links: [
      { label: "Đăng nhập", to: "/login" },
      { label: "Tạo tài khoản", to: "/register" },
      { label: "Đăng nhập học sinh", to: "/login?as=kid" },
    ],
  },
];

/** Shared by public, authentication and learner pages without a sidebar. */
export function Footer() {
  return (
    <footer className="ft-site-footer" aria-label="Chân trang FinTeen">
      <div className="ft-site-footer__inner">
        <div className="ft-site-footer__grid">
          <div className="ft-site-footer__brand">
            <Link to="/" aria-label="FinTeen — Trang chủ">
              <img src="/brand/finteen-logo-v2.webp" alt="FinTeen" width="136" height="48" />
            </Link>
            <p className="ft-site-footer__tagline">Hiểu tiền hôm nay. Tự tin ngày mai.</p>
            <p>Đồng hành cùng học sinh Việt Nam xây dựng thói quen tài chính qua bài học, trò chơi và những lựa chọn thực tế.</p>
          </div>
          {navigation.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h2>{title}</h2>
              <ul>
                {links.map(({ label, href, to }) => (
                  <li key={label}>
                    {to ? <Link to={to}>{label}</Link> : <a href={href}>{label}</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="ft-site-footer__bottom">
          <p>© {new Date().getFullYear()} FinTeen. Bảo lưu mọi quyền.</p>
          <span>Học từ trải nghiệm · Lớn lên từ lựa chọn</span>
        </div>
      </div>
    </footer>
  );
}
