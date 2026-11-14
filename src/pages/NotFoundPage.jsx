import {
  ArrowLeft,
  CircleDollarSign,
  Compass,
  Home,
  MapPinned,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { accountDestination, hasInternalAccess } from "@/features/internal/access";
import { useWorkspace } from "@/features/workspace/useWorkspace";
import "@/components/public/public.css";
import "./not-found.css";

export default function NotFoundPage({ internal = false }) {
  const { actor } = useWorkspace();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isInternal = internal || pathname.startsWith("/internal");
  const home = actor
    ? accountDestination(actor)
    : isInternal
      ? "/internal/login"
      : "/";
  const homeLabel = isInternal
    ? hasInternalAccess(actor)
      ? "Về Workspace"
      : "Đăng nhập nội bộ"
    : actor
      ? "Về trang của tôi"
      : "Về trang chủ";

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(home, { replace: true });
  };

  return (
    <main className={`ft-public ft-not-found${isInternal ? " is-internal" : ""}`}>
      <Link className="ft-not-found-brand" to={home} aria-label="FinTeen">
        <img src="/brand/finteen-logo-v2.png" alt="FinTeen" />
        {isInternal && <small>WORKSPACE</small>}
      </Link>

      <section className="ft-not-found-content" aria-labelledby="not-found-title">
        <div className="ft-not-found-copy">
          <div className="ft-not-found-code" aria-label="Lỗi 404">
            <span>4</span>
            <span className="ft-not-found-code-mark"><Compass size={34} /></span>
            <span>4</span>
          </div>
          <h1 id="not-found-title">
            {isInternal
              ? "Không tìm thấy trang nội bộ"
              : "Hình như bạn đã rẽ nhầm một chặng."}
          </h1>
          <p>
            {isInternal
              ? "Đường dẫn này không tồn tại hoặc đã được chuyển sang vị trí khác trong Workspace."
              : "Đừng lo, hành trình tài chính của bạn vẫn ở đây. Mình quay lại bản đồ và tiếp tục nhé!"}
          </p>
          <div className="ft-not-found-actions">
            <Link className="ft-button ft-primary" to={home}>
              <Home size={18} aria-hidden="true" /> {homeLabel}
            </Link>
            <button className="ft-button ft-not-found-secondary" type="button" onClick={goBack}>
              <ArrowLeft size={18} aria-hidden="true" /> Quay lại
            </button>
          </div>
        </div>

        <div className="ft-not-found-scene" aria-hidden="true">
          <div className="ft-not-found-sun"><Sparkles size={24} /></div>
          <div className="ft-not-found-route">
            <span /><span /><span /><span />
          </div>
          <div className="ft-not-found-pin"><MapPinned size={29} /></div>
          <div className="ft-not-found-coin coin-one"><CircleDollarSign size={25} /></div>
          <div className="ft-not-found-coin coin-two"><CircleDollarSign size={20} /></div>
          <div className="ft-not-found-ground" />
          <img
            className="ft-not-found-character"
            src="/images/finteen-v2/chapter-01/char/an/an-thinking.webp"
            alt=""
          />
          <div className="ft-not-found-sign">
            <span>?</span>
            <strong>Đường này<br />chưa mở</strong>
          </div>
        </div>
      </section>

      <p className="ft-not-found-footnote">FinTeen · Học tài chính qua từng lựa chọn</p>
    </main>
  );
}
