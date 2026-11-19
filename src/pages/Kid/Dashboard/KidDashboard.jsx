import { ArrowRight, BookOpen, Check, CircleDollarSign, Flame, Gamepad2, Lightbulb, LockKeyhole, Map, Play, ShieldCheck, Target, Trophy, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useKidDashboard from "./hooks/useKidDashboard.js";
import "./kid-home.css";

const chapterNames = ["Nhu cầu & mong muốn", "Lập ngân sách", "Kiếm tiền", "Mua sắm thông minh", "Tiết kiệm", "Vay & tín dụng", "An toàn tài chính", "Đầu tư"];
const chapterScenes = [
  "/images/finteen-v2/chapter-01/scene/sc01-receiving-allowance.webp",
  "/images/finteen-v2/chapter-02/scene/sc03-laptop-goal-planning.webp",
  "/images/finteen-v2/chapter-03/scene/sc01-three-career-offers.webp",
  "/images/finteen-v2/chapter-04/scene/sc02-comparing-three-phones.webp",
  "/images/finteen-v2/chapter-05/scene/sc04-planning-for-deadline.webp",
  "/images/finteen-v2/chapter-06/scene/sc02-comparing-loan-offers.webp",
  "/images/finteen-v2/chapter-07/scene/sc03-checking-refund-message.webp",
  "/images/finteen-v2/chapter-08/scene/sc02-building-allocation.webp",
];
const knowledgeByChapter = [
  { title: "Phân biệt điều cần và điều muốn", intro: "Biết ưu tiên đúng giúp em sử dụng tiền cho những điều quan trọng trước.", points: ["Điều cần giúp cuộc sống và việc học diễn ra bình thường.", "Điều muốn làm cuộc sống vui hơn nhưng có thể chờ.", "Trước khi mua, hãy tự hỏi: mình có thật sự cần ngay không?"] },
  { title: "Ngân sách là bản đồ của tiền", intro: "Một kế hoạch đơn giản giúp em biết tiền đến từ đâu và sẽ đi đâu.", points: ["Ghi lại số tiền em đang có.", "Chia tiền cho nhu cầu, tiết kiệm và sở thích.", "Luôn để lại một khoản nhỏ cho việc bất ngờ."] },
  { title: "Kiếm tiền an toàn và phù hợp", intro: "Một cơ hội tốt cần phù hợp với tuổi, thời gian và khả năng của em.", points: ["Hiểu rõ công việc trước khi đồng ý.", "Không trả phí trước cho lời mời kiếm tiền.", "Trao đổi với người lớn khi cơ hội có dấu hiệu bất thường."] },
  { title: "Mua sắm thông minh hơn", intro: "Giá rẻ chưa chắc là lựa chọn tốt nhất nếu món đồ không phù hợp hoặc nhanh hỏng.", points: ["So sánh giá, chất lượng và thời gian sử dụng.", "Kiểm tra bảo hành, hóa đơn và điều kiện đổi trả.", "Đợi một ngày trước những món không thật sự cần."] },
  { title: "Tiết kiệm cần mục tiêu rõ ràng", intro: "Mục tiêu cụ thể giúp em biết cần dành bao nhiêu tiền và trong bao lâu.", points: ["Đặt tên và thời hạn cho mục tiêu.", "Chia số tiền lớn thành khoản nhỏ mỗi tuần.", "Theo dõi tiến độ để điều chỉnh kịp thời."] },
  { title: "Hiểu chi phí trước khi vay", intro: "Tiền vay cần được hoàn trả, thường kèm theo lãi và các khoản phí.", points: ["Đừng chỉ nhìn số tiền phải trả mỗi tháng.", "Kiểm tra tổng số tiền phải trả đến cuối kỳ.", "Chỉ vay khi có kế hoạch trả nợ thực tế."] },
  { title: "Dừng lại trước thông tin đáng ngờ", intro: "Kẻ xấu thường tạo cảm giác gấp gáp để mình hành động trước khi suy nghĩ.", points: ["Không chia sẻ mật khẩu hoặc mã xác nhận.", "Kiểm tra đường dẫn và người gửi bằng kênh chính thức.", "Lưu bằng chứng và nhờ người lớn hỗ trợ ngay."] },
  { title: "Đầu tư luôn đi cùng rủi ro", intro: "Lợi nhuận cao không bao giờ được bảo đảm, vì vậy cần hiểu rõ trước khi quyết định.", points: ["Không dùng tiền cần cho mục tiêu gần để đầu tư rủi ro.", "Chia tiền vào nhiều loại tài sản thay vì một nơi.", "Không đầu tư vào điều mình chưa hiểu."] },
];
const chapterTitles = ["Tiền đầu tiên", "Mục tiêu lớn", "Công việc đầu tiên", "Mua thông minh", "Ngân hàng và lãi", "Mượn tiền có dễ không?", "Biến cố bất ngờ", "Kế hoạch 18 tuổi"];
const chapterGames = ["Cần hay Muốn?", "Chia phong bì thật hợp lý", "Ghép việc phù hợp", "Smart Shopping", "Compound Timeline", "Loan Detective", "Scam or Safe", "Portfolio Builder"];

function chapterNumber(value) {
  const parsed = Number(String(value ?? "").match(/\d+/)?.[0]);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 8) : 1;
}

export default function KidDashboard() {
  const dashboard = useKidDashboard();
  const navigate = useNavigate();
  const activeChapter = chapterNumber(dashboard.continueChapter);
  const progress = dashboard.totalChapters ? Math.round((dashboard.completedChapters / dashboard.totalChapters) * 100) : 0;
  const achievementMock = dashboard.achievementSource === "mock";
  const achievementCount = Array.isArray(dashboard.dashboard?.achievements) ? dashboard.dashboard.achievements.length : 0;
  const newestAchievement = dashboard.achievements[0];
  const knowledge = knowledgeByChapter[activeChapter - 1];
  const requiredPostTest = dashboard.postTestRequired;
  const playChapter = (chapter = activeChapter) => navigate(`/dashboard/kid/play?chapter=${chapter}`);
  const continueJourney = () => requiredPostTest?.quizId
    ? navigate(`/dashboard/kid/quiz/${requiredPostTest.quizId}`, { state: { quiz: { id: requiredPostTest.quizId, chapter: requiredPostTest.chapter, kind: "POST_TEST" } } })
    : playChapter();

  if (dashboard.loading) return <div className="kid-home-state">Đang chuẩn bị hành trình của em…</div>;
  if (dashboard.error) return <div className="kid-home-state is-error" role="alert"><strong>Chưa tải được hành trình.</strong><span>{dashboard.error}</span><button type="button" onClick={dashboard.refresh}>Thử lại</button></div>;

  return <div className="kid-home">
    <section className="kid-home-hero" aria-labelledby="kid-home-title">
      <div className="kid-home-mission">
        <img src={chapterScenes[activeChapter - 1]} alt="" aria-hidden="true" />
        <div className="kid-home-mission-shade" />
        <div className="kid-home-mission-copy">
          <h1 id="kid-home-title">Chào {dashboard.user?.name || "em"}, hôm nay mình tiến thêm một bước nhé!</h1>
          <div className="kid-home-current">
            <span className="kid-home-current-icon"><BookOpen /></span>
            <div><strong>Chương {activeChapter} · {chapterNames[activeChapter - 1]}</strong><p>Bài tiếp theo: Khám phá thử thách mới</p></div>
          </div>
          <div className="kid-home-actions">
            <button className="kid-home-primary" type="button" onClick={continueJourney}><Play /> {requiredPostTest ? `Làm hậu trắc chương ${requiredPostTest.chapter}` : "Học tiếp"}</button>
            <button className="kid-home-secondary" type="button" onClick={() => navigate("/dashboard/kid/lessons")}><Map /> Xem hành trình</button>
          </div>
        </div>
      </div>
      <aside className="kid-home-progress" aria-label="Tiến độ của em">
        <div className="kid-home-progress-item"><span><BookOpen /></span><div><strong>{dashboard.completedChapters}/{dashboard.totalChapters || 8} chương</strong><small>{progress}% hành trình</small></div></div>
        <div className="kid-home-progress-bar"><i style={{ width: `${progress}%` }} /></div>
        <div className="kid-home-progress-item"><span className="is-fire"><Flame /></span><div><strong>{dashboard.streak} ngày liên tiếp</strong><small>Giữ nhịp học đều nhé</small></div></div>
        <div className="kid-home-progress-item"><span className="is-trophy"><Trophy /></span><div><strong>{achievementCount} thành tựu</strong><small>Những cột mốc em đã đạt</small></div></div>
      </aside>
    </section>
    <section className="kid-home-journey" aria-labelledby="journey-title">
      <div className="kid-home-section-head"><div><Map /><h2 id="journey-title">Hành trình học tài chính của em</h2></div><button type="button" onClick={() => navigate("/dashboard/kid/lessons")}>Xem tất cả <ArrowRight /></button></div>
      <div className="kid-home-track" style={{ "--journey-progress": `${Math.max(0, ((activeChapter - 1) / 7) * 100)}%` }}>
        {chapterNames.map((name, index) => {
          const number = index + 1, done = number < activeChapter, current = number === activeChapter;
          const blockedByPostTest = requiredPostTest && number > Number(requiredPostTest.chapter);
          return <button key={name} type="button" className={`kid-home-stop${done ? " is-done" : ""}${current ? " is-current" : ""}`} onClick={() => number <= activeChapter && !blockedByPostTest && playChapter(number)} disabled={number > activeChapter || blockedByPostTest}><span>{done ? <Check /> : current && !blockedByPostTest ? <BookOpen /> : <LockKeyhole />}</span><strong>{name}</strong></button>;
        })}
      </div>
    </section>
    <section className="kid-home-lower">
      <article className="kid-home-achievement">
        <div className="kid-home-lower-title"><Trophy /><h2>Thành tựu mới</h2></div>
        {newestAchievement ? <div className="kid-home-achievement-row"><span>{newestAchievement.emoji || "🏆"}</span><div>{achievementMock && <small className="kid-home-mock-label">Dữ liệu mock · Đang phát triển</small>}<strong>{newestAchievement.title}</strong><p>{newestAchievement.desc || "Một cột mốc mới trên hành trình của em."}</p></div><button type="button" aria-label="Xem thành tích" onClick={() => navigate("/dashboard/kid/achievements")}><ArrowRight /></button></div> : <p>Hoàn thành chương đầu tiên để mở thành tựu nhé!</p>}
      </article>
      <article className="kid-home-tip"><div className="kid-home-lower-title"><Lightbulb /><h2>Gợi ý cho em</h2></div><div className="kid-home-tip-copy"><span><CircleDollarSign /></span><p>Tiếp tục chương “{chapterNames[activeChapter - 1]}” để mở thêm một kỹ năng tài chính mới nhé!</p></div></article>
    </section>
    <section className="kid-home-knowledge" aria-labelledby="knowledge-title">
      <div className="kid-home-knowledge-intro">
        <span className="kid-home-knowledge-icon"><BookOpen /></span>
        <div><small>Kiến thức bỏ túi · Chương {activeChapter}</small><h2 id="knowledge-title">{knowledge.title}</h2><p>{knowledge.intro}</p></div>
        <button type="button" onClick={() => playChapter()}><Play /> Học trong chương</button>
      </div>
      <div className="kid-home-knowledge-points">
        {knowledge.points.map((point, index) => {
          const Icon = [Target, WalletCards, ShieldCheck][index];
          return <article key={point}><span><Icon /></span><div><strong>Ghi nhớ {index + 1}</strong><p>{point}</p></div></article>;
        })}
      </div>
    </section>
    <section className="kid-home-curriculum" aria-labelledby="curriculum-title">
      <header>
        <div><small>Khung kiến thức FinTeen</small><h2 id="curriculum-title">Em sẽ học gì trong 8 chương?</h2><p>Từ cách sử dụng khoản tiền đầu tiên đến kế hoạch tài chính dài hạn.</p></div>
        <button type="button" onClick={() => navigate("/dashboard/kid/lessons")}>Mở bản đồ hành trình <ArrowRight /></button>
      </header>
      <div className="kid-home-curriculum-grid">
        {chapterTitles.map((title, index) => {
          const number = index + 1;
          const current = number === activeChapter;
          return <article className={current ? "is-current" : ""} key={title}>
            <div className="kid-home-curriculum-image"><img src={chapterScenes[index]} alt="" loading="lazy" decoding="async" /><span>Chương {String(number).padStart(2, "0")}</span>{current && <b>Đang học</b>}</div>
            <div className="kid-home-curriculum-copy"><p>{chapterNames[index]}</p><h3>{title}</h3><ul>{knowledgeByChapter[index].points.slice(0, 2).map((point) => <li key={point}><Check /><span>{point}</span></li>)}</ul><div><Gamepad2 /><strong>Mini-game:</strong> {chapterGames[index]}</div></div>
          </article>;
        })}
      </div>
    </section>
  </div>;
}
