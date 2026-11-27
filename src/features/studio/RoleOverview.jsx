import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCheck, CircleCheck, ClipboardCheck, Clock3, FilePenLine, History, Images, Layers3, ListChecks, Rocket, ShieldCheck } from "lucide-react";
import { fmtTime, STATUS_LABEL, studioApi } from "./studioClient";
import { useStudioResource } from "./useStudioResource";
import { ROLE_LABELS, TURN_LABEL, statusLine, turnOf } from "./chapterWork";
import { Btn, StateBox, Tag } from "./ui";
import "./role-overview.css";

// Mỗi vai: một câu nói vai làm gì, việc nào là "đến lượt mình", và nút dẫn tới đúng màn.
const work = {
  GAME_EDITOR: {
    about:
      "Bạn soạn chương, chơi thử, rồi gửi đi duyệt. Chương bị trả về sẽ quay lại đây kèm góp ý.",
    open: "Mở danh sách chương",
    path: "/internal/chapters",
    empty: "Không có chương nào đang chờ bạn soạn hay sửa",
    note: "Sau khi bạn gửi, người duyệt chơi thử và chấm. Chương đạt sẽ được người phát hành đưa vào game.",
  },
  GAME_REVIEWER: {
    about:
      "Bạn chơi thử chương người khác gửi lên, rồi chấm Đạt hoặc Trả về kèm góp ý.",
    open: "Mở danh sách chờ duyệt",
    path: "/internal/reviews",
    empty: "Không có chương nào đang chờ bạn duyệt",
    note: "Bạn không duyệt được chương do chính mình sửa. Kho tài nguyên và kho câu hỏi chỉ để tra cứu.",
  },
  GAME_MANAGER: {
    about:
      "Bạn đưa các chương đã duyệt vào game, chọn bản game đang dùng và thu hồi bản có lỗi.",
    open: "Mở màn phát hành",
    path: "/internal/releases",
    empty: "Không có chương đã duyệt nào đang chờ phát hành",
    note: "Bạn không phát hành được bản có chương do chính mình sửa.",
  },
};
const steps = [
  ["Đang soạn", ["DRAFT", "REJECTED"]],
  ["Chờ duyệt", ["SUBMITTED"]],
  ["Chờ phát hành", ["APPROVED"]],
  ["Đã phát hành", ["RELEASED"]],
];
const turnAction = {
  submit: "Soạn tiếp",
  fix: "Sửa theo góp ý",
  review: "Chơi thử và chấm",
  publish: "Phát hành",
};

const roleInfo = {
  GAME_EDITOR: { heading: 'KHÔNG GIAN BIÊN TẬP', icon: FilePenLine, focus: 0, hint: 'Tiếp tục bản soạn hoặc hoàn thiện các chương được góp ý.', links: [['Kho tài nguyên', 'Chuẩn bị hình ảnh và âm thanh', '/internal/assets', Images], ['Kho câu hỏi', 'Xây dựng câu hỏi cho bài kiểm tra', '/internal/questions', BookOpen]] },
  GAME_REVIEWER: { heading: 'KHÔNG GIAN KIỂM DUYỆT', icon: ClipboardCheck, focus: 1, hint: 'Chơi thử và đối chiếu nội dung trước khi đưa ra nhận xét.', links: [['Tra cứu nội dung', 'Xem các chương và trạng thái hiện tại', '/internal/chapters', Layers3], ['Kho câu hỏi', 'Đối chiếu câu hỏi và đáp án', '/internal/questions', BookOpen], ['Kho tài nguyên', 'Kiểm tra hình ảnh và âm thanh', '/internal/assets', Images]] },
  GAME_MANAGER: { heading: 'KHÔNG GIAN PHÁT HÀNH', icon: Rocket, focus: 2, hint: 'Các chương đã duyệt và đủ điều kiện để bạn phát hành.', links: [['Lịch sử phiên bản', 'Xem và quản lý các bản game đã phát hành', '/internal/history', History], ['Danh sách chương', 'Theo dõi nội dung trong từng giai đoạn', '/internal/chapters', Layers3], ['Kho tài nguyên', 'Quản lý hình ảnh và âm thanh dùng chung', '/internal/assets', Images]] },
};
const stepIcons = [FilePenLine, Clock3, CheckCheck, Rocket];
const stepHints = ['Hoàn thiện nội dung', 'Chơi thử và kiểm tra', 'Nội dung đã được duyệt', 'Đã đưa vào bản game'];
const activityTime = draft => [draft.updatedAt, draft.submittedAt, draft.reviewedAt, draft.releasedAt].filter(value => value && Number.isFinite(Date.parse(value))).sort((a, b) => Date.parse(b) - Date.parse(a))[0];

export default function RoleOverview({ actor, name, roles }) {
  const [chosen, setChosen] = useState(roles[0]);
  const role = roles.includes(chosen) ? chosen : roles[0];
  const config = { ...(work[role] || work.GAME_EDITOR), ...(roleInfo[role] || roleInfo.GAME_EDITOR) };
  const loader = useCallback(() => studioApi.get("/api/studio/chapters"), []);
  const query = useStudioResource(loader);
  const rows = query.data || [];
  // Xem theo đúng một vai: người nhiều vai chọn vai ở trên.
  const asRole = { ...actor, roles: [role] };
  const mine = rows.filter((draft) => turnOf(asRole, draft));
  const linkFor = (draft, turn) =>
    turn === "review"
      ? "/internal/reviews"
      : turn === "publish"
        ? "/internal/releases"
        : `/internal/editor/${encodeURIComponent(draft.code)}`;
  const RoleIcon = config.icon;
  const recent = [...rows].filter(draft => activityTime(draft)).sort((a, b) => Date.parse(activityTime(b)) - Date.parse(activityTime(a))).slice(0, 4);
  return <div className={`studio-role-overview studio-overview role-${role.toLowerCase()}`}>
    <header className="so-welcome">
      <div className="so-welcome-copy">
        <span className="so-eyebrow"><RoleIcon size={15} aria-hidden="true" />{config.heading}</span>
        <h1>Chào {String(name || 'bạn').split('@')[0]}<span className="so-greeting-dot" aria-hidden="true">.</span></h1>
        <p>{config.about}</p>
        <div className="so-welcome-actions"><Link className="sp-btn is-primary" to={config.path}>{config.open}<ArrowRight size={16} aria-hidden="true" /></Link>
          {roles.length > 1 && <label className="so-role-select">Xem việc của vai<select value={role} onChange={event => setChosen(event.target.value)}>{roles.map(value => <option value={value} key={value}>{ROLE_LABELS[value]}</option>)}</select></label>}
        </div>
      </div>
      <div className="so-welcome-visual" aria-hidden="true"><div className="so-visual-orbit" /><span className="so-visual-icon"><RoleIcon size={42} strokeWidth={1.5} /></span><span className="so-visual-caption">{ROLE_LABELS[role]}</span><div className="so-visual-flow"><FilePenLine size={16} /><span /><ClipboardCheck size={16} /><span /><Rocket size={16} /></div></div>
    </header>
    {query.loading ? <StateBox kind="loading">Đang tải tình hình các chương…</StateBox>
      : query.error ? <StateBox kind="error" title="Chưa tải được tình hình các chương" actions={<Btn onClick={query.reload}>Thử lại</Btn>}>{query.error}</StateBox>
        : <>
          <section className="so-stats" aria-label="Tình hình các chương">{steps.map(([label, statuses], index) => {
            const Icon = stepIcons[index];
            const count = rows.filter(draft => statuses.includes(draft.status)).length;
            const rejected = index === 0 ? rows.filter(draft => draft.status === 'REJECTED').length : 0;
            return <div key={label} className={`so-stat so-stat-${index}${index === config.focus ? ' is-focus' : ''}`}><div className="so-stat-top"><span className="so-stat-icon"><Icon size={21} aria-hidden="true" /></span>{index === config.focus && <span className="so-focus-label">Bước của bạn</span>}</div><strong>{count}</strong><span className="so-stat-label">{label}</span><small>{rejected ? `${rejected} chương cần sửa theo góp ý` : stepHints[index]}</small></div>;
          })}</section>
          <div className="so-columns">
            <div className="so-main-column">
              <section className="so-panel" aria-labelledby="so-work-heading">
                <div className="so-section-heading"><div><h2 id="so-work-heading"><ListChecks size={19} aria-hidden="true" />Đến lượt bạn<span className="so-count">{mine.length}</span></h2><p>{config.hint}</p></div><Link to={config.path} className="so-text-link">Xem tất cả<ArrowRight size={15} aria-hidden="true" /></Link></div>
                {mine.length ? <ul className="so-work-list">{mine.slice(0, 5).map(draft => {
                  const turn = turnOf(asRole, draft);
                  return <li key={draft.code} className={turn === 'fix' ? 'needs-fix' : undefined}><span className="so-chapter-number" aria-hidden="true">{String(draft.chapterNumber ?? draft.code.slice(2)).padStart(2, '0')}</span><div className="so-work-copy"><div className="so-work-title"><h3>{draft.title || draft.code}</h3><span className={`so-turn so-turn-${turn}`}>{TURN_LABEL[turn]}</span></div><p>{draft.code} · Bản nháp {draft.revision ?? '—'}</p><small title={statusLine(draft)}>{statusLine(draft)}</small></div><Link className={`sp-btn${turn === 'fix' ? ' is-primary' : ''}`} to={linkFor(draft, turn)}>{turnAction[turn]}<ArrowRight size={14} aria-hidden="true" /></Link></li>;
                })}</ul> : <div className="so-empty"><span className="so-empty-icon"><CircleCheck size={30} strokeWidth={1.5} aria-hidden="true" /></span><h3>{config.empty}</h3><p>{role === 'GAME_EDITOR' ? 'Bạn có thể xem lại các chương hoặc chuẩn bị tài nguyên cho nội dung tiếp theo.' : 'Các chương đủ điều kiện sẽ xuất hiện tại đây khi đến lượt bạn xử lý.'}</p><Link className="so-text-link" to={config.path}>{config.open}<ArrowRight size={15} aria-hidden="true" /></Link></div>}
                {mine.length > 5 && <Link className="so-more-work" to={config.path}>Xem thêm {mine.length - 5} chương cần xử lý<ArrowRight size={15} aria-hidden="true" /></Link>}
              </section>
              <section className="so-panel" aria-labelledby="so-recent-heading">
                <div className="so-section-heading"><div><h2 id="so-recent-heading"><History size={18} aria-hidden="true" />Cập nhật gần đây</h2><p>Những chương vừa có thay đổi trong Studio.</p></div></div>
                {recent.length ? <ul className="so-recent-list">{recent.map(draft => <li key={draft.code}><span className={`so-activity-dot status-${draft.status}`} aria-hidden="true" /><div><Link to={`/internal/editor/${encodeURIComponent(draft.code)}`}>{draft.title || draft.code}</Link><p>{draft.code} · <time dateTime={activityTime(draft)}>{fmtTime(activityTime(draft))}</time></p></div><Tag tone={draft.status}>{STATUS_LABEL[draft.status] || draft.status}</Tag></li>)}</ul> : <p className="so-no-activity">Chưa có cập nhật nào. Các thay đổi của chương sẽ xuất hiện tại đây.</p>}
              </section>
            </div>
            <aside className="so-side-column" aria-label="Tiện ích Studio">
              <section className="so-panel so-shortcuts"><div className="so-section-heading"><h2>Truy cập nhanh</h2></div>{config.links.map(([title, detail, path, Icon]) => <Link className="so-shortcut" to={path} key={path}><span className="so-shortcut-icon"><Icon size={20} aria-hidden="true" /></span><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={15} aria-hidden="true" /></Link>)}</section>
              <section className="so-panel so-workflow"><div className="so-section-heading"><h2>Luồng nội dung</h2></div><ol>{steps.map(([label], index) => <li key={label} className={index === config.focus ? 'is-current' : undefined}><span className="so-step-number">{index + 1}</span><div><strong>{label}</strong><small>{['Biên tập viên', 'Người duyệt', 'Người phát hành', 'Nội dung trong game'][index]}</small></div></li>)}</ol><p className="so-workflow-note"><ShieldCheck size={17} aria-hidden="true" /><span>{config.note}</span></p></section>
            </aside>
          </div>
        </>}
  </div>;
}
