import { Link } from 'react-router-dom'
import { Store, BookOpen } from 'lucide-react'
import { CHAPTERS } from './model'
import { Heading } from './ui'

export function KidGames() {
  return <>
    <Heading title="Trò chơi của bạn" description="Chọn một chương để khám phá câu chuyện và thử thách tài chính." />
    <div className="ws-grid two">
      {CHAPTERS.map((title, i) => (
        <article className="ws-card ws-chapter" key={title}>
          <span className="ws-chapter-number">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <small>CHƯƠNG {i + 1}</small>
            <h2>{title}</h2>
            <p>{i === 0 ? 'Có thể trải nghiệm ngay' : 'Nội dung trò chơi đang được chuẩn bị'}</p>
            <Link className="ws-text-link" to={`/dashboard/kid/play?chapter=${i + 1}`}>
              {i === 0 ? 'Vào chơi →' : 'Xem chương →'}
            </Link>
          </div>
        </article>
      ))}
    </div>
  </>
}

export function KidShop() {
  return <>
    <Heading title="Cửa hàng" description="Không gian cửa hàng dành cho các bạn nhỏ." />
    <section className="ws-hero ws-shop-intro"><div><span className="ws-pill">GÓC KHÁM PHÁ</span><h2>Một điều mới đang được chuẩn bị.</h2><p>Cửa hàng đang được chuẩn bị. Bạn quay lại khám phá bài học và trò chơi trước nhé!</p><Link className="ws-btn primary" to="/dashboard/kid/games">Khám phá trò chơi →</Link></div><Store className="ws-hero-art" aria-hidden="true" /></section>
  </>
}

export function GuestDemo() {
  return <>
    <Heading title="Dùng thử chương 1" description="Trải nghiệm chương học đầu tiên trước khi chọn gói cho gia đình hoặc lớp học." />
    <section className="ws-hero"><div>
      <span className="ws-pill">BẢN DEMO MIỄN PHÍ</span>
      <h2>Khám phá tiền tệ</h2>
      <p>Làm quen với nhu cầu, mong muốn và giá trị của đồng tiền qua câu chuyện đầu tiên.</p>
      <Link className="ws-btn primary" to="/dashboard/demo/play">Bắt đầu dùng thử →</Link>
      </div><BookOpen className="ws-hero-art" aria-hidden="true" />
    </section>
  </>
}
