import { Outlet, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Gamepad2, Sprout, ArrowUpRight } from 'lucide-react'
import { PublicBrand } from '@/components/public/PublicBrand'
import '@/components/public/public.css'

export function AuthLayout() {
  return <div className="ft-public ft-auth-page">
    <header className="ft-auth-header">
      <Link to="/" className="ft-back-link"><ArrowLeft size={17} aria-hidden="true" /> Về trang chủ</Link>
      <PublicBrand />
    </header>
    <main className="ft-auth-center">
      <aside className="ft-auth-story" aria-label="Khám phá FinTeen">
        <span className="ft-story-kicker"><Sprout size={17} aria-hidden="true" /> LỚN LÊN CÙNG FINTEEN</span>
        <h2>Hiểu tiền hôm nay.<br /><span>Tự tin ngày mai.</span></h2>
        <p>Từ những khoản tiết kiệm đầu tiên đến những lựa chọn cho tương lai. Mỗi chương là một bước trưởng thành.</p>
        <div className="ft-story-preview">
          <img src="/images/map/journey-v2/finteen-map-01-home.png" alt="Con đường khám phá FinTeen bắt đầu từ một ngôi làng nhỏ" width="2752" height="1536" />
          <div className="ft-story-caption"><span><small>HÀNH TRÌNH CỦA BẠN</small><strong>Bắt đầu từ những điều nhỏ</strong></span><span className="ft-story-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span></div>
        </div>
        <div className="ft-story-details">
          <span><BookOpen size={19} aria-hidden="true" /><span><strong>8 chương</strong><small>Một hành trình trưởng thành</small></span></span>
          <span><Gamepad2 size={20} aria-hidden="true" /><span><strong>Học qua trò chơi</strong><small>Khám phá từ mỗi lựa chọn</small></span></span>
        </div>
      </aside>
      <div className="ft-auth-form-side"><Outlet /></div>
    </main>
    <footer className="ft-auth-footer">FinTeen · Hiểu tiền hôm nay. Tự tin ngày mai.</footer>
  </div>
}
