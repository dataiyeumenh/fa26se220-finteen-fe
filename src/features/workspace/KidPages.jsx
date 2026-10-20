import { Link } from "react-router-dom";
import { CHAPTERS } from "./model";
import { Heading } from "./ui";
import { usePublishedChapters } from "../internal/hooks";

export function KidGames() {
  const published = usePublishedChapters();
  return <>
    <Heading title="Trò chơi theo chương" description="Chọn một chương để bước vào câu chuyện và thử thách tài chính."/>
    <div className="ws-grid two ws-kid-game-grid">{CHAPTERS.map((title, index) => {
      const chapter = index + 1
      const available = chapter <= 8 || published.some(item => item.number === chapter)
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
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-01/props/allowance-envelope.png" alt="" />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 2: Quản lý chi tiêu</h2>
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
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-02/asset-mini-game/savings-race/piggy-bank.png" alt="" />
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
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-03/asset-mini-game/career-match/design-assistant.png" alt="" />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 4: Mua thông minh</h2>
            <p>
              So sánh điện thoại theo nhu cầu và tổng chi phí, kiểm tra hóa đơn
              và theo dõi thuê bao để đưa ra lựa chọn phù hợp.
            </p>
            <Link className="ws-btn primary" to="/dashboard/demo/play?chapter=4">
              Bắt đầu Chapter 4 →
            </Link>
          </div>
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-04/asset-mini-game/smart-shopping/phone-a-new.png" alt="" />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 5: Ngân hàng và lãi</h2>
            <p>Đọc phí và điều kiện rút, khám phá lãi kép và sức mua, lập kế hoạch đủ tiền cho khóa học sau ba tháng.</p>
            <Link className="ws-btn primary" to="/dashboard/demo/play?chapter=5">
              Bắt đầu Chapter 5 →
            </Link>
          </div>
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-05/asset-mini-game/compound-timeline/term-account.png" alt="" />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 6: Mượn tiền có dễ không?</h2>
            <p>Cùng An cân nhắc laptop, lật hồ sơ vay, xếp lịch BNPL và tìm phần dư nợ còn lại qua Thám tử khoản vay.</p>
            <Link className="ws-btn primary" to="/dashboard/demo/play?chapter=6">
              Bắt đầu Chương 6 →
            </Link>
          </div>
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-06/asset-mini-game/loan-detective/laptop-goal.png" alt="" />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 7: Biến cố bất ngờ</h2>
            <p>Cùng An xử lý khoản chi bất ngờ, đọc điều kiện bảo hiểm và kiểm tra tin nhắn trước khi chia sẻ thông tin.</p>
            <Link className="ws-btn primary" to="/dashboard/demo/play?chapter=7">Bắt đầu Chương 7 →</Link>
          </div>
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-07/props/insurance-terms-folder.png" alt="" />
        </section>
        <section className="ws-hero ws-shop-intro">
          <div>
            <span className="ws-pill">CHƯƠNG MỚI</span>
            <h2>Chương 8: Tiền sinh tiền và kế hoạch 18 tuổi</h2>
            <p>Cùng An chia giỏ tiền, tìm hiểu lời quảng cáo đầu tư và cân đối kế hoạch khi thu nhập, giá cả thay đổi.</p>
            <Link className="ws-btn primary" to="/dashboard/demo/play?chapter=8">Bắt đầu Chương 8 →</Link>
          </div>
          <img className="ws-hero-art object-contain" src="/images/finteen-v2/chapter-08/asset-mini-game/portfolio-builder/diversified-fund.png" alt="" />
        </section>
      </div>
    </>
  );
}
