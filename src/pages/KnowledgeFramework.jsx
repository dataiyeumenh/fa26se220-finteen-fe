import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  Gamepad2,
  Menu,
  MousePointer2,
  ShieldCheck,
  X,
} from "lucide-react";
import { Footer } from "@/components/shared/Footer";
import "@/components/home/home-colors.css";
import "./knowledge-framework.css";

const chapters = [
  {
    number: "01",
    title: "Tiền đầu tiên",
    image: "/images/finteen-v2/chapter-01/scene/sc01-receiving-allowance.webp",
    goals: ["Phân biệt nhu cầu và mong muốn", "Hiểu chi phí cơ hội khi lựa chọn", "Biết ưu tiên và đặt mục tiêu tiền bạc"],
    game: "Needs or Wants",
  },
  {
    number: "02",
    title: "Tháng đầu tiên và mục tiêu lớn",
    image: "/images/finteen-v2/chapter-02/scene/sc02-dividing-envelopes.webp",
    goals: ["Lập ngân sách và theo dõi dòng tiền", "Xây dựng kế hoạch tiết kiệm", "Chuẩn bị cho chi phí phát sinh"],
    game: "Budget Builder & Savings Race",
  },
  {
    number: "03",
    title: "Công việc đầu tiên",
    image: "/images/finteen-v2/chapter-03/scene/sc01-three-career-offers.webp",
    goals: ["Hiểu thu nhập thực nhận", "Khám phá nghề nghiệp và vốn con người", "Kiểm chứng thông tin từ nguồn độc lập"],
    game: "Career Match",
  },
  {
    number: "04",
    title: "Mua thông minh",
    image: "/images/finteen-v2/chapter-04/scene/sc02-comparing-three-phones.webp",
    goals: ["So sánh giá và tổng chi phí", "Nhận biết hợp đồng và đăng ký định kỳ", "Lưu hóa đơn và bằng chứng mua hàng"],
    game: "Smart Shopping",
  },
  {
    number: "05",
    title: "Ngân hàng và lãi",
    image: "/images/finteen-v2/chapter-05/scene/sc03-money-and-purchasing-power.webp",
    goals: ["Hiểu tài khoản, phí và lãi suất", "Quan sát sức mạnh của lãi kép", "Nhận biết ảnh hưởng của lạm phát"],
    game: "Compound Timeline",
  },
  {
    number: "06",
    title: "Mượn tiền có dễ không?",
    image: "/images/finteen-v2/chapter-06/scene/sc02-comparing-loan-offers.webp",
    goals: ["Tính tổng chi phí khi vay", "Hiểu thẻ tín dụng và trả góp", "Nhận diện rủi ro mua trước trả sau"],
    game: "Loan Detective",
  },
  {
    number: "07",
    title: "Biến cố bất ngờ",
    image: "/images/finteen-v2/chapter-07/scene/sc03-checking-refund-message.webp",
    goals: ["Nhận diện và quản lý rủi ro", "Hiểu vai trò cơ bản của bảo hiểm", "Phát hiện lừa đảo và bảo vệ tài khoản"],
    game: "Scam or Safe",
  },
  {
    number: "08",
    title: "Tiền sinh tiền và kế hoạch 18 tuổi",
    image: "/images/finteen-v2/chapter-08/scene/sc05-explaining-personal-plan.webp",
    goals: ["Hiểu rủi ro và đa dạng hóa đầu tư", "Tiếp cận crypto và ESG có chọn lọc", "Lập kế hoạch tài chính 12 tháng"],
    game: "Portfolio Builder & Life Planner",
  },
];

function KnowledgeHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <header className="knowledge-header">
      <div className="knowledge-shell knowledge-header__inner">
        <Link to="/" className="knowledge-brand" aria-label="FinTeen - Trang chủ">
          <img src="/brand/finteen-logo-v2.webp" alt="FinTeen" />
        </Link>
        <nav className="knowledge-nav" aria-label="Điều hướng chính">
          <Link to="/#danh-cho-ai">Dành cho ai</Link>
          <Link className="is-active" to="/khung-kien-thuc">Khung kiến thức</Link>
          <Link to="/#bao-cao">Báo cáo</Link>
        </nav>
        <div className="knowledge-header__actions">
          <button className="knowledge-login" onClick={() => navigate("/login")}>Đăng nhập</button>
          <button className="knowledge-start" onClick={() => navigate("/register")}>Bắt đầu</button>
        </div>
        <button className="knowledge-menu" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Đóng menu" : "Mở menu"}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="knowledge-mobile-nav" aria-label="Điều hướng trên điện thoại">
          <Link to="/#danh-cho-ai">Dành cho ai</Link>
          <Link to="/khung-kien-thuc">Khung kiến thức</Link>
          <Link to="/#bao-cao">Báo cáo</Link>
          <button onClick={() => navigate("/login")}>Đăng nhập</button>
          <button className="knowledge-start" onClick={() => navigate("/register")}>Bắt đầu</button>
        </nav>
      )}
    </header>
  );
}

export default function KnowledgeFramework() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="knowledge-page home-v2">
      <KnowledgeHeader />
      <main>
        <section className="knowledge-hero">
          <div className="knowledge-shell knowledge-hero__layout">
            <div className="knowledge-hero__copy">
              <h1>Con sẽ học gì cùng FinTeen?</h1>
              <p>Khung kiến thức được thiết kế để phụ huynh biết rõ nội dung trước khi trẻ bắt đầu. Mỗi chương đặt kiến thức tài chính vào một tình huống gần gũi để trẻ tự lựa chọn và quan sát hệ quả.</p>
              <a href="#chuong-hoc" className="knowledge-primary-link">Xem 8 chương học <ArrowRight /></a>
            </div>
            <div className="knowledge-hero__image">
              <img src="/images/finteen-v2/chapter-08/scene/sc05-explaining-personal-plan.webp" alt="Học sinh FinTeen trao đổi về kế hoạch tài chính" />
            </div>
          </div>
        </section>

        <section className="knowledge-facts" aria-label="Thông tin tổng quan">
          <div className="knowledge-shell knowledge-facts__grid">
            <article><Gamepad2 /><div><h2>8 chương tương tác</h2><p>Từ khoản tiền đầu tiên đến kế hoạch tuổi 18.</p></div></article>
            <article><CalendarDays /><div><h2>Dành cho tuổi 14–18</h2><p>Nội dung gắn với nhu cầu thật của lứa tuổi.</p></div></article>
            <article><MousePointer2 /><div><h2>Học qua lựa chọn</h2><p>Trẻ thử quyết định và thấy ngay hệ quả tài chính.</p></div></article>
          </div>
        </section>

        <section id="chuong-hoc" className="knowledge-curriculum">
          <div className="knowledge-shell">
            <div className="knowledge-section-heading">
              <div><h2>Khung kiến thức: 8 chương</h2><p>Đi từ nền tảng quản lý tiền đến tín dụng, rủi ro và đầu tư dài hạn.</p></div>
              <span><BookOpenCheck /> Mỗi chương gồm câu chuyện, lựa chọn, mini-game và quiz</span>
            </div>
            <div className="knowledge-chapters">
              {chapters.map((chapter) => (
                <article className="knowledge-chapter" key={chapter.number}>
                  <div className="knowledge-chapter__image"><img src={chapter.image} alt="" loading="lazy" decoding="async" /></div>
                  <div className="knowledge-chapter__content">
                    <div className="knowledge-chapter__title"><span>Chương {chapter.number}</span><h3>{chapter.title}</h3></div>
                    <ul>{chapter.goals.map((goal) => <li key={goal}><Check /> <span>{goal}</span></li>)}</ul>
                    <p className="knowledge-chapter__game"><Gamepad2 /><strong>Mini-game:</strong> {chapter.game}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="knowledge-source">
          <div className="knowledge-shell knowledge-source__inner">
            <ShieldCheck />
            <div><h2>Nội dung có định hướng rõ ràng</h2><p>Khung học tập được tổng hợp từ các năng lực tài chính cá nhân phổ biến của CEE/Jump$tart, CFPB, FDIC Money Smart và OECD/INFE, sau đó điều chỉnh thành tình huống phù hợp với học sinh Việt Nam. Đây là nguồn tham chiếu nội dung, không phải tuyên bố chứng nhận.</p></div>
          </div>
        </section>

        <section className="knowledge-cta">
          <div className="knowledge-shell knowledge-cta__inner">
            <div><h2>Sẵn sàng để trẻ bắt đầu hành trình?</h2><p>Người lớn tạo tài khoản và mở hồ sơ; trẻ tham gia bằng mã truy cập và PIN.</p></div>
            <button onClick={() => navigate("/register")}>Bắt đầu cùng FinTeen <ArrowRight /></button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
