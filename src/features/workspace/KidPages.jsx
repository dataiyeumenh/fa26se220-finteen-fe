import { Link } from "react-router-dom";
import { Store, BookOpen, BadgeDollarSign, Briefcase } from "lucide-react";
import { CHAPTERS } from "./model";
import { Heading } from "./ui";
import { usePublishedChapters } from "../internal/hooks";

export function KidGames() {
  const published = usePublishedChapters();
  return (
    <>
      <Heading
        title="Trò chơi của bạn"
        description="Chọn một chương để khám phá câu chuyện và thử thách tài chính."
      />
      <div className="ws-grid two">
        {CHAPTERS.map((title, i) => (
          <article className="ws-card ws-chapter" key={title}>
            <span className="ws-chapter-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <small>CHƯƠNG {i + 1}</small>
              <h2>
                {published.find((c) => c.number === i + 1)?.version.title ||
                  title}
              </h2>
              <p>
                {i < 3 || published.some((c) => c.number === i + 1)
                  ? "Có thể trải nghiệm ngay"
                  : "Nội dung trò chơi đang được chuẩn bị"}
              </p>
              <Link
                className="ws-text-link"
                to={`/dashboard/kid/play?chapter=${i + 1}`}
              >
                {i < 3 || published.some((c) => c.number === i + 1)
                  ? "Vào chơi →"
                  : "Xem chương →"}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function KidShop() {
  return (
    <>
      <Heading
        title="Cửa hàng"
        description="Không gian cửa hàng dành cho các bạn nhỏ."
      />
      <section className="ws-hero ws-shop-intro">
        <div>
          <span className="ws-pill">GÓC KHÁM PHÁ</span>
          <h2>Một điều mới đang được chuẩn bị.</h2>
          <p>
            Cửa hàng đang được chuẩn bị. Bạn quay lại khám phá bài học và trò
            chơi trước nhé!
          </p>
          <Link className="ws-btn primary" to="/dashboard/kid/games">
            Khám phá trò chơi →
          </Link>
        </div>
        <Store className="ws-hero-art" aria-hidden="true" />
      </section>
    </>
  );
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
