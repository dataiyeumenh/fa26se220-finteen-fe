import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, BarChart3, BookOpenCheck, Check, ChevronRight,
  CircleDollarSign, ClipboardCheck, Gamepad2, GraduationCap,
  KeyRound, Menu, Play, School, ShieldCheck, UserRoundPlus, Users, X,
} from "lucide-react";
import "@/components/home/home-colors.css";
import { DemoModal } from "@/components/home/DemoModal";
import { Footer } from "@/components/shared/Footer";

const audiences = [
  {
    id: "parent", icon: Users, label: "Phụ huynh",
    title: "Đồng hành mà không gây áp lực",
    description: "Tạo hồ sơ cho con, mở quyền truy cập và xem báo cáo sau từng chặng học.",
    detail: "Biết con đang hiểu gì và cần hỗ trợ ở đâu.",
    image: "/images/finteen-v2/chapter-01/scene/sc01-receiving-allowance.webp",
  },
  {
    id: "teacher", icon: School, label: "Giáo viên",
    title: "Dễ triển khai cho cả lớp",
    description: "Tạo lớp, giao quiz trước và sau khi học, rồi theo dõi báo cáo theo nhóm.",
    detail: "Quan sát tiến bộ mà không cần tổng hợp thủ công.",
    image: "/images/finteen-v2/chapter-08/scene/sc05-explaining-personal-plan.webp",
  },
  {
    id: "learner", icon: Gamepad2, label: "Học sinh",
    title: "Vào chơi nhanh, không cần email",
    description: "Đăng nhập bằng mã truy cập và PIN để bắt đầu câu chuyện, mini-game và quiz.",
    detail: "Tự do thử, sai và nhìn thấy hệ quả của mỗi lựa chọn.",
    image: "/images/finteen-v2/chapter-04/scene/sc02-comparing-three-phones.webp",
  },
];

const chapters = [
  ["01", "Tiền đầu tiên", "Nhu cầu và mong muốn", "chapter-01/scene/sc01-receiving-allowance.webp", "lime"],
  ["02", "Mục tiêu lớn", "Ngân sách và tiết kiệm", "chapter-02/scene/sc02-dividing-envelopes.webp", "coral"],
  ["03", "Công việc đầu tiên", "Thu nhập thực nhận", "chapter-03/scene/sc01-three-career-offers.webp", "amber"],
  ["04", "Mua thông minh", "So sánh tổng chi phí", "chapter-04/scene/sc02-comparing-three-phones.webp", "coral"],
  ["05", "Ngân hàng và lãi", "Phí, lãi và sức mua", "chapter-05/scene/sc03-money-and-purchasing-power.webp", "sky"],
  ["06", "Mượn tiền", "Vay và tổng chi phí", "chapter-06/scene/sc02-comparing-loan-offers.webp", "amber"],
  ["07", "Biến cố bất ngờ", "Bảo hiểm và lừa đảo", "chapter-07/scene/sc03-checking-refund-message.webp", "coral"],
  ["08", "Kế hoạch 18 tuổi", "Đầu tư và dài hạn", "chapter-08/scene/sc05-explaining-personal-plan.webp", "lime"],
].map(([number, title, topic, path, tone]) => ({
  number, title, topic, tone, image: `/images/finteen-v2/${path}`,
}));

const steps = [
  { icon: UserRoundPlus, title: "Tạo tài khoản", text: "Phụ huynh hoặc giáo viên đăng ký." },
  { icon: Users, title: "Mở slot cho trẻ", text: "Tạo hồ sơ hoặc nhóm học phù hợp." },
  { icon: KeyRound, title: "Vào bằng mã + PIN", text: "Trẻ không cần email hay mật khẩu." },
  { icon: BarChart3, title: "Xem báo cáo", text: "Theo dõi tiến độ sau mỗi chặng." },
];

const reportMetrics = [
  ["Hoàn thành nội dung", "80%"], ["Độ chính xác bài tập", "76%"],
  ["Thời gian học", "65%"], ["Duy trì học tập", "71%"], ["Tiến độ chương", "75%"],
];

function Brand() {
  return <a href="#top" className="home-brand" aria-label="FinTeen - Trang chủ"><img src="/brand/finteen-logo-v2.webp" alt="FinTeen" /></a>;
}

export default function Homepage() {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAudience, setActiveAudience] = useState("parent");
  const selectedAudience = audiences.find((item) => item.id === activeAudience);

  useEffect(() => {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }, []);

  return (
    <div id="top" className="public-home home-v2">
      <header className="home-header">
        <div className="home-shell home-header__inner">
          <Brand />
          <nav className="home-nav" aria-label="Điều hướng chính">
            <a href="#danh-cho-ai">Dành cho ai</a><a href="#hanh-trinh">Hành trình</a><a href="#bao-cao">Báo cáo</a>
          </nav>
          <div className="home-header__actions">
            <button className="home-link-button" onClick={() => navigate("/login")}>Đăng nhập</button>
            <button className="home-solid-button home-solid-button--compact" onClick={() => navigate("/register")}>Bắt đầu</button>
          </div>
          <button className="home-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="home-mobile-nav" aria-label="Điều hướng trên điện thoại">
            <a href="#danh-cho-ai" onClick={() => setMenuOpen(false)}>Dành cho ai</a>
            <a href="#hanh-trinh" onClick={() => setMenuOpen(false)}>Hành trình</a>
            <a href="#bao-cao" onClick={() => setMenuOpen(false)}>Báo cáo</a>
            <button onClick={() => navigate("/login")}>Đăng nhập</button>
            <button className="home-solid-button" onClick={() => navigate("/register")}>Bắt đầu</button>
          </nav>
        )}
      </header>

      <main>
        <section className="home-hero">
          <div className="home-shell home-hero__grid">
            <div className="home-hero__copy">
              <h1>Học cách quản lý tiền qua những lựa chọn thật.</h1>
              <p>FinTeen là game tài chính dành cho tuổi teen. Trẻ trải nghiệm 8 chương tương tác; phụ huynh và giáo viên theo dõi tiến bộ trong cùng một hệ thống.</p>
              <div className="home-action-row">
                <button className="home-solid-button" onClick={() => navigate("/register")}>Bắt đầu <ArrowRight /></button>
                <button className="home-outline-button" onClick={() => setDemoOpen(true)}><Play /> Thử một bài học</button>
              </div>
              <div className="home-hero__trust"><span><Check /> Nội dung tiếng Việt</span><span><Check /> Trẻ không cần email</span></div>
            </div>
            <div className="home-hero__visual" aria-label="Minh họa hành trình học FinTeen">
              <div className="home-hero__map-frame">
                <img src="/images/map/journey-v2/finteen-map-01-home.webp" alt="Bản đồ hành trình FinTeen" fetchPriority="high" decoding="async" width="2752" height="1536" />
                <div className="home-map-route" aria-hidden="true"><span /><span /><span /></div>
              </div>
              <div className="home-hero__scene-frame"><img src="/images/finteen-v2/chapter-08/scene/sc05-explaining-personal-plan.webp" alt="Học sinh trao đổi kế hoạch tài chính với giáo viên" /></div>
            </div>
          </div>
          <div className="home-landscape" aria-hidden="true" />
        </section>

        <section id="danh-cho-ai" className="home-audience home-section">
          <div className="home-shell">
            <div className="home-section-heading home-section-heading--center"><h2>Mỗi người một trải nghiệm rõ ràng</h2><p>Người lớn quản lý và đồng hành. Teen tập trung vào hành trình của mình.</p></div>
            <div className="home-audience__layout">
              <div className="home-audience__tabs" role="tablist" aria-label="Chọn người dùng">
                {audiences.map(({ id, icon: Icon, label }) => (
                  <button key={id} role="tab" aria-selected={activeAudience === id} className={activeAudience === id ? "is-active" : ""} onClick={() => setActiveAudience(id)}>
                    <Icon /><span>{label}</span><ChevronRight />
                  </button>
                ))}
              </div>
              <div className="home-audience__media" role="tabpanel" key={selectedAudience.id}><img src={selectedAudience.image} alt="" loading="lazy" decoding="async" /></div>
              <div className="home-audience__content">
                <p className="home-audience__label">{selectedAudience.label}</p><h3>{selectedAudience.title}</h3><p>{selectedAudience.description}</p>
                <div className="home-audience__detail"><ShieldCheck /><span>{selectedAudience.detail}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="hanh-trinh" className="home-journey home-section">
          <div className="home-shell">
            <div className="home-section-heading home-section-heading--journey"><h2>8 chương. Một hành trình trưởng thành cùng tiền.</h2><p>Từ khoản tiền đầu tiên đến kế hoạch tuổi 18.</p></div>
            <div className="home-journey__path" aria-label="Hành trình tám chương FinTeen">
              {chapters.map((chapter) => (
                <article key={chapter.number} className={`home-chapter home-chapter--${chapter.tone}`}>
                  <div className="home-chapter__pin">{chapter.number}</div>
                  <div className="home-chapter__image"><img src={chapter.image} alt="" loading="lazy" decoding="async" /></div>
                  <div className="home-chapter__copy"><h3>{chapter.title}</h3><p>{chapter.topic}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cach-hoat-dong" className="home-process home-section">
          <div className="home-shell">
            <div className="home-section-heading"><h2>Bắt đầu chỉ trong vài bước</h2><p>Người lớn thiết lập một lần. Trẻ có thể bắt đầu hành trình ngay trên trình duyệt.</p></div>
            <ol className="home-process__steps">
              {steps.map(({ icon: Icon, title, text }, index) => <li key={title}><span className="home-process__number">{index + 1}</span><span className="home-process__icon"><Icon /></span><h3>{title}</h3><p>{text}</p></li>)}
            </ol>
          </div>
        </section>

        <section id="bao-cao" className="home-report home-section">
          <div className="home-shell">
            <div className="home-section-heading home-section-heading--report"><h2>Biết trẻ đang hiểu gì — và cần hỗ trợ ở đâu.</h2><p>Báo cáo minh họa từ dữ liệu học tập trong FinTeen.</p></div>
            <div className="home-report__layout">
              <div className="home-report-ui" aria-label="Minh họa báo cáo học tập">
                <div className="home-report-ui__sidebar"><img src="/brand/finteen-logo-v2.webp" alt="" /><span>Trang chủ</span><strong><BarChart3 /> Báo cáo</strong><span>Học sinh</span></div>
                <div className="home-report-ui__main">
                  <div className="home-report-ui__topline"><div><small>Báo cáo</small><strong>Tổng quan tiến độ</strong></div><span>Minh họa</span></div>
                  <div className="home-report-ui__grid">
                    <div className="home-report-ui__metrics"><h3>5 chỉ số theo dõi</h3>{reportMetrics.map(([label, value]) => <div className="home-metric" key={label}><span>{label}</span><div><i style={{ width: value }} /></div><strong>{value}</strong></div>)}</div>
                    <div className="home-report-ui__knowledge">
                      <h3>Mức độ nắm khái niệm</h3><div className="home-knowledge-row"><span>Lập ngân sách</span><strong>Vững</strong></div><div className="home-knowledge-row"><span>Tiết kiệm</span><strong>Khá</strong></div><div className="home-knowledge-row"><span>Chi tiêu hợp lý</span><em>Đang học</em></div>
                      <div className="home-report-ui__review"><ClipboardCheck /><div><strong>Xem lại câu trả lời sai</strong><span>Biết điểm nào cần giải thích thêm</span></div></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-report__benefits">
                <article><BarChart3 /><div><h3>Theo dõi 5 chỉ số</h3><p>Nắm nhanh tiến độ và thói quen học tập.</p></div></article>
                <article><BookOpenCheck /><div><h3>Xem mức độ nắm khái niệm</h3><p>Biết nội dung nào đã vững hoặc đang học.</p></div></article>
                <article><ClipboardCheck /><div><h3>Nhận biết câu trả lời sai</h3><p>Hỗ trợ đúng chỗ thay vì đoán điều trẻ chưa hiểu.</p></div></article>
              </div>
            </div>
          </div>
        </section>

        <section className="home-final-cta">
          <div className="home-shell home-final-cta__inner">
            <div><CircleDollarSign /><h2>Cùng teen bắt đầu hành trình tài chính đầu tiên.</h2></div>
            <div className="home-action-row"><button className="home-lime-button" onClick={() => navigate("/register")}>Bắt đầu cho gia đình <ArrowRight /></button><button className="home-white-button" onClick={() => navigate("/register")}><GraduationCap /> Dành cho giáo viên</button></div>
          </div>
        </section>
      </main>

      <Footer />
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
