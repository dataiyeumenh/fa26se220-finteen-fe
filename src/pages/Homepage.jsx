import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart3, BookOpen, Check, ChevronRight, Gamepad2, Landmark, Menu, PiggyBank, Play, School, ShieldCheck, Sparkles, Target, TrendingUp, Users, WalletCards, X } from 'lucide-react'
import '@/components/home/home-colors.css'
import { DemoModal } from '@/components/home/DemoModal'

const audiences = [
  { icon: Gamepad2, title: 'Học sinh chủ động', description: 'Ra quyết định trong các tình huống gần gũi, nhận phản hồi và hình thành tư duy tài chính.', color: 'bg-white' },
  { icon: Users, title: 'Phụ huynh đồng hành', description: 'Quản lý hồ sơ của các con, gói học và theo dõi tiến độ trong cùng một nơi.', color: 'bg-white' },
  { icon: School, title: 'Giáo viên dễ triển khai', description: 'Tạo nhóm, giao hoạt động và quan sát hành trình học tài chính của học sinh.', color: 'bg-white' },
]

const chapters = [
  { number: '01', title: 'Từ mái nhà nhỏ', topic: 'Tiền tiêu vặt & nhu cầu', image: '/images/finteen-v2/chapter-01/scene/sc01-receiving-allowance.png', color: 'bg-[#fff2b8]' },
  { number: '02', title: 'Những bước đi mới', topic: 'Lập ngân sách & tiết kiệm', image: '/images/finteen-v2/chapter-02/scene/sc02-dividing-envelopes.png', color: 'bg-[#c8f4df]' },
  { number: '03', title: 'Vun đắp tương lai', topic: 'Nghề nghiệp & thu nhập', image: '/images/finteen-v2/chapter-03/scene/sc01-three-career-offers.png', color: 'bg-[#dcd3ff]' },
  { number: '04', title: 'Chân trời rộng mở', topic: 'So sánh & quyết định', image: '/images/finteen-v2/chapter-04/scene/sc02-comparing-three-phones.png', color: 'bg-[#ffd5c2]' },
]

const steps = [
  ['01', 'Tạo tài khoản', 'Chọn vai trò phụ huynh hoặc giáo viên và bắt đầu chỉ trong vài phút.'],
  ['02', 'Kết nối người học', 'Tạo hồ sơ cho trẻ hoặc nhóm học bằng mã truy cập riêng.'],
  ['03', 'Bắt đầu hành trình', 'Học qua tình huống, thử thách và xem tiến độ sau mỗi chương.'],
]

const financeTopics = [
  { icon: WalletCards, title: 'Thu nhập & chi tiêu', description: 'Hiểu tiền đến từ đâu, phân biệt nhu cầu với mong muốn và kiểm soát những khoản chi hằng ngày.', label: 'Nền tảng', tone: 'green' },
  { icon: PiggyBank, title: 'Tiết kiệm & mục tiêu', description: 'Lập mục tiêu vừa sức, chia nhỏ kế hoạch và duy trì thói quen tiết kiệm đều đặn.', label: 'Thói quen', tone: 'yellow' },
  { icon: BarChart3, title: 'Ngân sách cá nhân', description: 'Biết phân bổ một khoản tiền có hạn, theo dõi dòng tiền và điều chỉnh khi kế hoạch thay đổi.', label: 'Thực hành', tone: 'blue' },
  { icon: TrendingUp, title: 'Lãi suất & đầu tư', description: 'Làm quen với lãi đơn, lãi kép, lợi nhuận, rủi ro và sức mạnh của thời gian.', label: 'Phát triển', tone: 'purple' },
  { icon: ShieldCheck, title: 'Rủi ro & bảo vệ', description: 'Nhận diện lừa đảo tài chính, hiểu quỹ dự phòng và cách bảo vệ thông tin cá nhân.', label: 'An toàn', tone: 'orange' },
  { icon: Landmark, title: 'Kinh tế quanh ta', description: 'Khám phá giá cả, cung cầu, lạm phát và cách các thay đổi kinh tế ảnh hưởng đến gia đình.', label: 'Mở rộng', tone: 'cyan' },
]

const learningOutcomes = [
  'Biết cân nhắc trước khi mua sắm',
  'Tự lập một ngân sách đơn giản',
  'Hiểu giá trị của tiết kiệm dài hạn',
  'Nhận biết rủi ro và chi phí ẩn',
]

function Brand() {
  return <a href="#top" className="home-brand" aria-label="FinTeen - Trang chủ"><img src="/brand/finteen-logo-v2.png" alt="FinTeen" /></a>
}

export default function Homepage() {
  const navigate = useNavigate()
  const [demoOpen, setDemoOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div id="top" className="public-home home-v2 min-h-screen overflow-x-hidden bg-[#fffaf0] text-[#17212b]">
      <header className="sticky top-0 z-50 border-b-2 border-[#17212b] bg-[#fffaf0]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Điều hướng chính"><a href="#loi-ich">Lợi ích</a><a href="#hanh-trinh">Hành trình học</a><a href="#cach-hoat-dong">Cách hoạt động</a></nav>
          <div className="hidden items-center gap-3 sm:flex"><button className="home-link-button" onClick={() => navigate('/login')}>Đăng nhập</button><button className="home-solid-button px-5 py-2.5" onClick={() => navigate('/register')}>Bắt đầu ngay</button></div>
          <button className="grid size-11 place-items-center md:hidden" onClick={() => setMenuOpen(value => !value)} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="grid gap-3 border-t-2 border-[#17212b] bg-[#fffaf0] p-5 md:hidden"><a href="#loi-ich" onClick={() => setMenuOpen(false)}>Lợi ích</a><a href="#hanh-trinh" onClick={() => setMenuOpen(false)}>Hành trình học</a><a href="#cach-hoat-dong" onClick={() => setMenuOpen(false)}>Cách hoạt động</a><button className="text-left font-bold" onClick={() => navigate('/login')}>Đăng nhập</button><button className="home-solid-button" onClick={() => navigate('/register')}>Tạo tài khoản</button></nav>}
      </header>

      <main>
        <section className="border-b-2 border-[#17212b] px-5 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="home-kicker"><Sparkles className="size-4" /> Kỹ năng tài chính cho thế hệ mới</div>
              <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Hiểu tiền sớm.<br /><span className="home-marker">Tự tin chọn tương lai.</span></h1>
              <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-[#46505b]">FinTeen giúp học sinh cấp 2–3 rèn kỹ năng quản lý tiền qua tình huống thực tế, thử thách tương tác và lộ trình học rõ ràng.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button className="home-solid-button group" onClick={() => navigate('/register')}>Bắt đầu miễn phí <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></button><button className="home-outline-button" onClick={() => setDemoOpen(true)}><Play className="size-5 fill-current" /> Thử một bài học</button></div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-[#46505b]"><span className="flex items-center gap-2"><Check className="size-4" /> Nội dung tiếng Việt</span><span className="flex items-center gap-2"><Check className="size-4" /> Học theo tốc độ riêng</span></div>
            </div>
            <div className="relative pb-5 pr-1">
              <div className="home-art-card overflow-hidden bg-[#dff4c7]"><img src="/images/map/journey-v2/finteen-map-01-home.png" alt="Bản đồ hành trình học tài chính của FinTeen" className="aspect-[4/3] h-full w-full object-cover" /><div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border-2 border-[#17212b] bg-white p-3.5 shadow-[4px_4px_0_#17212b] sm:inset-x-6 sm:bottom-6"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[#ffe34f] font-black">01</span><div><p className="text-xs font-bold uppercase tracking-wider text-[#66717c]">Đang học</p><p className="font-black">Tiền đến từ đâu?</p></div></div><ChevronRight className="size-6" /></div></div>
              <div className="absolute -left-4 top-8 hidden rounded-xl border-2 border-[#17212b] bg-white px-4 py-3 font-black shadow-[4px_4px_0_#17212b] sm:block">8 chủ đề thiết thực</div><div className="absolute -right-3 top-20 hidden rounded-xl border-2 border-[#17212b] bg-[#dceaa7] px-4 py-3 font-black shadow-[4px_4px_0_#17212b] sm:block">Học qua quyết định</div>
            </div>
          </div>
        </section>

        <section id="loi-ich" className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="home-eyebrow">Một nền tảng, cả nhà cùng học</p><h2 className="home-section-title">Được thiết kế cho từng người trong hành trình.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{audiences.map(({ icon: Icon, title, description, color }) => <article key={title} className={`home-feature-card ${color}`}><span className="grid size-14 place-items-center rounded-2xl border-2 border-[#17212b] bg-white shadow-[3px_3px_0_#17212b]"><Icon className="size-7" /></span><h3 className="mt-7 text-2xl font-black">{title}</h3><p className="mt-3 leading-7 text-[#3f4a54]">{description}</p></article>)}</div></div></section>

        <section className="home-topics-section px-5 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl"><p className="home-eyebrow">Kiến thức dùng được ngoài đời</p><h2 className="home-section-title">Tài chính không chỉ là những con số.</h2></div>
              <p className="max-w-md leading-7 text-[#64748b]">Mỗi chủ đề bắt đầu từ một vấn đề quen thuộc của học sinh, sau đó mở rộng thành kiến thức kinh tế và kỹ năng ra quyết định.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {financeTopics.map(({ icon: Icon, title, description, label, tone }) => <article key={title} className="home-topic-card"><div className="flex items-start justify-between gap-4"><span className={`home-topic-icon home-topic-icon--${tone}`}><Icon className="size-6" /></span><span className="home-topic-label">{label}</span></div><h3 className="mt-6 text-xl font-extrabold">{title}</h3><p className="mt-2 leading-7 text-[#64748b]">{description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="home-outcomes-section px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div><p className="home-eyebrow">Học để tự lập</p><h2 className="home-section-title">Từ kiến thức đến quyết định tốt hơn mỗi ngày.</h2><p className="mt-5 max-w-2xl leading-7 text-[#64748b]">FinTeen không chấm điểm khả năng ghi nhớ. Học sinh được thử, sai và nhìn thấy hệ quả trong môi trường an toàn trước khi gặp những lựa chọn tương tự ngoài đời.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{learningOutcomes.map(item => <div key={item} className="home-outcome-item"><Check className="size-5" /><span>{item}</span></div>)}</div></div>
            <div className="home-insight-panel"><div className="flex items-center gap-3"><span className="home-insight-icon"><BookOpen className="size-6" /></span><div><p className="text-sm font-bold text-[#16a34a]">Phương pháp học</p><h3 className="text-xl font-extrabold">Tình huống → Quyết định → Phản hồi</h3></div></div><div className="mt-6 space-y-5"><div><div className="mb-2 flex justify-between text-sm font-bold"><span>Hiểu khái niệm</span><span>01</span></div><div className="home-learning-line"><span className="w-[72%]" /></div></div><div><div className="mb-2 flex justify-between text-sm font-bold"><span>Thực hành lựa chọn</span><span>02</span></div><div className="home-learning-line"><span className="w-[86%]" /></div></div><div><div className="mb-2 flex justify-between text-sm font-bold"><span>Rút kinh nghiệm</span><span>03</span></div><div className="home-learning-line"><span className="w-full" /></div></div></div></div>
          </div>
        </section>

        <section id="hanh-trinh" className="border-y-2 border-[#17212b] bg-[#17212b] px-5 py-16 text-white lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="max-w-2xl"><p className="font-black uppercase tracking-[0.16em] text-[#ffe34f]">Nội dung trong sản phẩm</p><h2 className="mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">Mỗi chương là một câu chuyện thật.</h2></div><p className="max-w-md text-[#cbd1d6]">Không học thuộc lòng. Trẻ quan sát tình huống, chọn cách xử lý và thấy hệ quả của quyết định.</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{chapters.map(chapter => <article key={chapter.number} className="group overflow-hidden rounded-3xl border-2 border-white bg-white text-[#17212b] transition-transform hover:-translate-y-1"><div className={`relative aspect-[4/3] overflow-hidden ${chapter.color}`}><img src={chapter.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 grid size-11 place-items-center rounded-xl border-2 border-[#17212b] bg-[#ffe34f] font-black shadow-[3px_3px_0_#17212b]">{chapter.number}</span></div><div className="p-5"><p className="text-sm font-bold text-[#68737d]">{chapter.topic}</p><h3 className="mt-1 text-xl font-black">{chapter.title}</h3></div></article>)}</div></div></section>

        <section id="cach-hoat-dong" className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="home-eyebrow">Bắt đầu thật đơn giản</p><h2 className="home-section-title">Ba bước để vào lớp học tài chính.</h2><p className="mt-5 max-w-md leading-7 text-[#52606b]">Không cần cài đặt phức tạp. FinTeen hoạt động trực tiếp trên trình duyệt và phù hợp cho cả học tại nhà lẫn trên lớp.</p></div><div className="grid gap-4">{steps.map(([number, title, description]) => <article key={number} className="home-step-card"><span className="home-step-number">{number}</span><div><h3 className="text-xl font-black">{title}</h3><p className="mt-1 leading-7 text-[#52606b]">{description}</p></div></article>)}</div></div></section>

        <section className="px-5 pb-16 lg:px-8 lg:pb-24"><div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[32px] border-2 border-[#17212b] bg-[#ffe34f] p-7 shadow-[8px_8px_0_#17212b] md:p-12 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="flex items-center gap-2 font-black uppercase tracking-wider"><Target className="size-5" /> Sẵn sàng bắt đầu?</p><h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">Biến những bài học về tiền thành kỹ năng dùng được cả đời.</h2></div><button className="home-dark-button whitespace-nowrap" onClick={() => navigate('/register')}>Tạo tài khoản <ArrowRight className="size-5" /></button></div></section>
      </main>

      <footer className="border-t-2 border-[#17212b] bg-white px-5 py-10 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><Brand /><p className="mt-3 text-sm text-[#66717c]">Nền tảng học tài chính dành cho trẻ em Việt Nam.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold"><a href="#loi-ich">Lợi ích</a><a href="#hanh-trinh">Hành trình học</a><a href="#cach-hoat-dong">Cách hoạt động</a><span className="text-[#66717c]">© 2026 FinTeen</span></div></div></footer>
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  )
}
