import { AlertCircle, CheckCircle2, Eye, EyeOff, GraduationCap, Info, LockKeyhole, Mail, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "../../api/auth.api";
import { googleIdToken, googleReady } from "../../api/firebase";
import "./account-settings.css";

const planNames = { parent: "Gói Gia đình", teacher: "Gói Giáo viên" };

function PasswordField({ label, name, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return <label className="account-password-field"><span>{label}</span><div>
    <input name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} minLength={name === "oldPassword" ? undefined : 8} required />
    <button type="button" aria-label={visible ? `Ẩn ${label.toLowerCase()}` : `Hiện ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
  </div></label>;
}

export default function AccountSettings({ actor }) {
  const [busyAction, setBusyAction] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const role = actor?.role === "teacher" ? "teacher" : "parent";
  const RoleIcon = role === "teacher" ? GraduationCap : UsersRound;
  const displayName = actor?.displayName || actor?.name || "Tài khoản FinTeen";
  const plans = Array.isArray(actor?.plans) ? actor.plans.map(plan => String(plan).toLowerCase()) : [];
  const activePlan = plans.includes(role) ? planNames[role] : "Chưa có gói hoạt động";

  useEffect(() => {
    if (!message && !error) return undefined;
    const timer = window.setTimeout(() => { setMessage(""); setError(""); }, 4500);
    return () => window.clearTimeout(timer);
  }, [message, error]);

  async function change(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setMessage(""); setError(""); setBusyAction("password");
    try {
      if (data.get("newPassword") !== data.get("confirm")) throw new Error("Mật khẩu xác nhận chưa khớp.");
      await auth.changePassword(data.get("oldPassword"), data.get("newPassword"));
      form.reset();
      setMessage("Đã đổi mật khẩu. Các phiên đăng nhập cũ không còn hiệu lực.");
    } catch (err) { setError(err.message); } finally { setBusyAction(""); }
  }

  async function link() {
    setBusyAction("google"); setMessage(""); setError("");
    try {
      await auth.linkGoogle(await googleIdToken());
      setMessage("Đã liên kết Google. Lần sau bạn có thể đăng nhập bằng Google.");
    } catch (err) {
      setError(err.code === 3021 ? "Google này đã liên kết với tài khoản FinTeen khác. Hãy chọn tài khoản Google khác." : err.message);
    } finally { setBusyAction(""); }
  }

  return <div className="account-settings" data-account-role={role}>
    <header className="account-page-heading"><h1>Tài khoản</h1><p>Quản lý thông tin đăng nhập và bảo mật tài khoản FinTeen.</p></header>

    <section className="account-identity" aria-label="Thông tin tài khoản hiện tại">
      <span className="account-avatar" aria-hidden="true">{displayName.slice(0, 1).toUpperCase()}</span>
      <div className="account-identity-copy"><h2>{displayName}</h2><p>{actor?.email}</p><div className="account-badges">
        <span><RoleIcon size={15} />{role === "teacher" ? "Giáo viên" : "Phụ huynh"}</span>
        <span className={plans.includes(role) ? "active" : "inactive"}><ShieldCheck size={15} />{activePlan}</span>
      </div></div>
    </section>

    <div className="account-settings-layout">
      <section className="account-panel account-profile-panel">
        <div className="account-panel-heading"><span><UserRound size={19} /></span><div><h2>Thông tin tài khoản</h2><p>Thông tin nhận diện từ hệ thống.</p></div></div>
        <dl className="account-readonly-list">
          <div><dt><UserRound size={17} />Họ và tên</dt><dd>{displayName}</dd></div>
          <div><dt><Mail size={17} />Email</dt><dd>{actor?.email}</dd></div>
        </dl>
        <div className="account-info-note"><Info size={18} /><p>Hiện tại FinTeen chưa hỗ trợ chỉnh sửa hồ sơ. Thông tin của bạn vẫn được đồng bộ an toàn từ máy chủ.</p></div>
        <div className="account-linked-login"><div className="account-section-title"><h3>Đăng nhập liên kết</h3><p>Dùng một tài khoản quen thuộc để đăng nhập nhanh hơn.</p></div>
          <div className="account-google-row"><span className="account-google-mark" aria-hidden="true">G</span><div><strong>Google</strong><small>Email Google có thể khác email FinTeen.</small></div><button className="ws-btn" disabled={Boolean(busyAction) || !googleReady} onClick={link}>{busyAction === "google" ? "Đang liên kết…" : "Liên kết Google"}</button></div>
          {!googleReady && <p className="account-firebase-note">Đang chờ cấu hình Firebase để bật liên kết Google.</p>}
        </div>
      </section>

      <section className="account-panel account-security-panel">
        <div className="account-panel-heading"><span><LockKeyhole size={19} /></span><div><h2>Bảo mật</h2><p>Cập nhật mật khẩu và phương thức đăng nhập.</p></div></div>
        {(message || error) && <div className={`account-feedback ${error ? "error" : "success"}`} role={error ? "alert" : "status"}>{error ? <AlertCircle size={19} /> : <CheckCircle2 size={19} />}<span>{error || message}</span></div>}
        <form className="account-password-form" onSubmit={change}><fieldset disabled={Boolean(busyAction)}>
          <PasswordField label="Mật khẩu hiện tại" name="oldPassword" autoComplete="current-password" />
          <div className="account-new-passwords"><PasswordField label="Mật khẩu mới" name="newPassword" autoComplete="new-password" /><PasswordField label="Xác nhận mật khẩu mới" name="confirm" autoComplete="new-password" /></div>
          <div className="account-password-requirements"><ShieldCheck size={19} /><div><strong>Yêu cầu mật khẩu</strong><p>Tối thiểu 8 ký tự. Nên kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</p></div></div>
          <button className="ws-btn primary account-submit" disabled={Boolean(busyAction)}>{busyAction === "password" ? "Đang đổi mật khẩu…" : "Đổi mật khẩu"}</button>
        </fieldset></form>

      </section>
    </div>
  </div>;
}
