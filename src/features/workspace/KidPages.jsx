import { Link } from "react-router-dom";
import { Heading } from "./ui";

export function GuestDemo() {
  return (
    <>
      <Heading
        title="Dùng thử chương 1"
        description="Trải nghiệm miễn phí chương 1. Chương 2–8 dành cho học sinh thuộc gói Gia đình hoặc Giáo viên."
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
          <img
            className="ws-hero-art object-contain"
            src="/images/finteen-v2/chapter-01/props/allowance-envelope.webp"
            alt=""
          />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">GÓI HỌC TẬP</span>
            <h2>Mở khóa chương 2–8</h2>
            <p>
              Đăng ký gói Gia đình hoặc Giáo viên để trẻ tiếp tục hành trình học
              qua hồ sơ học sinh được cấp trong gói.
            </p>
            <Link className="ws-btn primary" to="/dashboard/plans">
              Xem gói học tập →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
