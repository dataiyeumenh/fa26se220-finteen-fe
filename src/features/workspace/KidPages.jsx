import { Link } from "react-router-dom";
import { BookOpen, BadgeDollarSign, Briefcase } from "lucide-react";
import { CHAPTERS } from "./model";
import { Heading } from "./ui";
import { usePublishedChapters } from "../internal/hooks";

export function KidGames() {
  const published = usePublishedChapters();
  return <>
    <Heading title="Trò chơi theo chương" description="Chọn một chương để bước vào câu chuyện và thử thách tài chính."/>
    <div className="ws-grid two ws-kid-game-grid">{CHAPTERS.map((title, index) => {
      const chapter = index + 1
      const available = chapter <= 3 || published.some(item => item.number === chapter)
      return <article className={`ws-card ws-chapter ${available ? '' : 'is-coming'}`} key={title}>
        <span className="ws-chapter-number">{String(chapter).padStart(2, '0')}</span>
        <div><small>CHƯƠNG {chapter}</small><h2>{published.find(item => item.number === chapter)?.version.title || title}</h2><p>{available ? 'Câu chuyện và thử thách đã sẵn sàng' : 'Nội dung chương đang được chuẩn bị'}</p><Link className={available ? 'ws-btn primary' : 'ws-btn'} to={`/dashboard/kid/play?chapter=${chapter}`}>{available ? 'Vào chơi →' : 'Xem chương →'}</Link></div>
      </article>
    })}</div>
  </>
}

export function GuestDemo() {
  return (
    <>
      <Heading
        title="Dùng thử chương"
        description="Trải nghiệm chương học trước khi chọn gói cho gia đình hoặc lớp học."
      />
      <div className="ws-grid two">
        <section className="ws-hero">
          <div>
            <span className="ws-pill">BẢN DEMO MIỄN PHÍ</span>
            <h2>Chương 1: Khám phá tiền tệ</h2>
            <p>
              Làm quen với nhu cầu, mong muốn và giá trị của đồng tiền qua câu
              chuyện đầu tiên.
            </p>
            <Link
              className="ws-btn primary"
              to="/dashboard/demo/play?chapter=1"
            >
              Bắt đầu dùng thử →
            </Link>
          </div>
          <BookOpen className="ws-hero-art" aria-hidden="true" />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 2: Học sinh cấp 3 - Quản lý chi tiêu</h2>
            <p>
              Tiếp tục hành trình bằng câu chuyện trọ học, chi tiêu, flash sale
              và bài học về tiết kiệm.
            </p>
            <Link
              className="ws-btn primary"
              to="/dashboard/demo/play?chapter=2"
            >
              Bắt đầu Chapter 2 →
            </Link>
          </div>
          <BadgeDollarSign className="ws-hero-art" aria-hidden="true" />
        </section>
        <section className="ws-hero">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 3: Công việc đầu tiên</h2>
            <p>
              Tìm kiếm cơ hội việc làm đầu tiên, so sánh việc thiết kế hoặc làm
              hoa hồng.
            </p>
            <Link
              className="ws-btn primary"
              to="/dashboard/demo/play?chapter=3"
            >
              Bắt đầu Chapter 3 →
            </Link>
          </div>
          <Briefcase className="ws-hero-art" aria-hidden="true" />
        </section>
      </div>
    </>
  );
}
