import { useEffect, useRef, useState } from 'react';
import { gradeReflection } from './compoundTimelineRules';
import './compound-timeline.css';

// Cards are read-only evidence. Reading never grants choice points or stats.
export function InspectCardsDialog({ inspect, onClose }) {
  const dialog = useRef(null);
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState([]);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.querySelector('button')?.focus();
    return () => previous?.focus();
  }, []);
  const done = inspect.cards.every(card => seen.includes(card.id));
  function keys(event) {
    if (event.key === 'Escape') { event.stopPropagation(); if (done) onClose(); }
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled),summary')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <div className="ch5-modal"><section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="ch5-inspect-title" className="ch5-dialog" onKeyDown={keys}>
    <header className="ch5-inspect-heading"><span>SỔ TAY KHÁM PHÁ CỦA AN</span><h3 id="ch5-inspect-title">{inspect.buttonText}</h3><p>Chạm vào từng thẻ để đọc. Thẻ đã xem sẽ được đánh dấu ✓.</p></header>
    {inspect.dataText && <p className="ch5-inspect-context">{inspect.dataText}</p>}
    <nav aria-label="Thẻ dữ kiện" data-card-count={inspect.cards.length}>{inspect.cards.map((card, index) => <button key={card.id} aria-label={card.label} aria-pressed={active === card.id} onClick={() => { setActive(card.id); setSeen(prev => [...new Set([...prev, card.id])]); }}><span className="ch5-card-art" aria-hidden="true">{card.image ? <img src={card.image} alt=""/> : ['⌕', '♧', '◷'][index % 3]}</span><b>{card.label}</b><span className="ch5-card-state">{seen.includes(card.id) ? '✓ Đã xem' : 'Nhấn để mở'}</span></button>)}</nav>
    {!active && <div className="ch5-inspect-empty"><span aria-hidden="true">✦</span><p>Chọn một thẻ phía trên.<br/>Mỗi thẻ có một mảnh thông tin giúp bạn quyết định.</p></div>}
    {inspect.cards.filter(card => card.id === active).map(card => <article className={`ch5-card${card.sections ? ' ch5-structured-note' : ''}`} key={card.id} aria-live="polite"><span className="ch5-card-bookmark" aria-hidden="true">GHI CHÚ</span><h4>{card.label}</h4>{card.sections ? <><dl className="ch5-note-sections">{card.sections.map(section => <div key={section.label}><dt>{section.label}</dt><dd><ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul></dd></div>)}</dl>{card.note && <p className="ch5-note-takeaway"><b>Nhớ đối chiếu:</b> {card.note}</p>}</> : <p>{card.text}</p>}</article>)}
    {inspect.reference && <aside className="ch5-course-reference" aria-label={inspect.reference.label}>{inspect.reference.image && <img src={inspect.reference.image} alt=""/>}<div><span>MỐC ĐỂ ĐỐI CHIẾU</span><h4>{inspect.reference.label}</h4><p>{inspect.reference.text}</p></div></aside>}
    <footer className="ch5-inspect-footer"><div><progress max={inspect.cards.length} value={seen.length} aria-label="Số thẻ đã xem"/><p aria-live="polite">Đã xem {seen.length}/{inspect.cards.length} thẻ. {done ? 'Sẵn sàng trở lại câu chuyện!' : 'Mở đủ thẻ để tiếp tục nhé.'}</p></div><button aria-label="Đóng" disabled={!done} onClick={onClose}>Xong rồi <span aria-hidden="true">→</span></button></footer>
  </section></div>;
}

const information = [['deadline', 'Ngày cần tiền'], ['headline', 'Lãi niêm yết'], ['withdrawal', 'Cách tính lãi rút sớm'], ['fees', 'Phí duy trì'], ['provider', 'Tên nhà cung cấp'], ['protection', 'Điều kiện bảo vệ'], ['color', 'Màu biểu đồ'], ['friend', 'Lời bạn giới thiệu']];
export function ChapterFivePlanSummary({ flags }) {
  return <aside className="ch5-plan-summary" aria-label="Kế hoạch dự kiến"><p><b>Dự kiến cuối tháng 3</b></p><p>{flags.term_maturity ? 'B: dự tính giữ đến tháng 12 để nhận 1.060.000đ, nhưng chưa có nguồn học phí cho tháng 3. Kế hoạch chưa đáp ứng thời hạn.' : flags.account_choice_A ? 'B: 1.005.000đ theo lãi rút sớm, đủ học phí.' : flags.topup_source_verified ? 'A: 992.500đ sau phí + 7.500đ dành từ khoản chi đã xác nhận; cần kiểm tra cuối tháng 1.' : flags.account_pending ? 'A: 992.500đ sau phí. Nguồn bù 7.500đ chưa xác minh; kế hoạch còn chờ.' : 'A: 992.500đ sau phí, còn thiếu 7.500đ. Kế hoạch lần này chưa đạt mục tiêu.'}</p><p>{flags.provider_checked ? 'Đã kiểm tra thông tin nhà cung cấp.' : 'Thông tin nhà cung cấp chưa được kiểm tra đầy đủ.'}</p><small>Đây là kế hoạch. Ví hiện tại vẫn là 1.000.000đ.</small></aside>;
}
export function ChapterFiveReflection({ scene, flags, onComplete }) {
  const [selected, setSelected] = useState([]);
  const [method, setMethod] = useState('');
  const [action, setAction] = useState('');
  const [date, setDate] = useState('');
  const submitted = useRef(false);
  const first = scene.activity === 'reflection1';
  const ready = first ? selected.length > 0 && method : action && date;
  function finish() {
    if (!ready || submitted.current) return;
    submitted.current = true;
    const answer = { selected, method, action, date, accountB: flags.account_choice_A && !flags.term_maturity, verified: flags.topup_source_verified };
    const rubric = gradeReflection(scene.activity, answer);
    onComplete({ ...scene.completionOption, reflectionScore: rubric.I + rubric.C + rubric.P, reflectionEvidenceScores: rubric, answer });
  }
  return <section className="ch5-reflection" aria-label="Nhìn lại quyết định"><span>NHÌN LẠI · {first ? '1/2' : '2/2'}</span><h2>{scene.title}</h2>
    {first ? <><fieldset><legend>Chọn các thông tin bạn sẽ dùng để kiểm tra quyết định</legend>{information.map(([id, label]) => <label key={id}><input type="checkbox" checked={selected.includes(id)} onChange={() => setSelected(prev => prev.includes(id) ? prev.filter(key => key !== id) : [...prev, id])}/>{label}</label>)}</fieldset><label>Phép kiểm tra nào sẽ đi cùng các dữ kiện đó?<select value={method} onChange={e => setMethod(e.target.value)}><option value="">Chọn cách kiểm tra</option><option value="rate">So riêng lãi suất niêm yết</option><option value="net">Tính gốc + lãi theo thời hạn thực − phí rồi so với học phí</option><option value="guess">Ước lượng bằng biểu đồ quảng cáo</option></select></label></> : <><p>{flags.term_maturity ? 'Bạn dự tính giữ B đủ 12 tháng. Mốc đó ảnh hưởng thế nào đến học phí tháng 3? Hãy nêu bài học cho lần sau.' : flags.account_choice_A ? 'Bạn chọn B và dự tính rút sau ba tháng. Hãy nêu điều chấp nhận đánh đổi và cách theo dõi.' : 'Nếu chọn A tiện rút nhưng sau phí thiếu tiền học, bước tiếp theo nào có thể thực hiện được?'}</p><label>Hành động của bạn<select value={action} onChange={e => setAction(e.target.value)}><option value="">Chọn hành động</option><option value="keepB">Ghi rõ chấp nhận lãi rút sớm thấp của B để có tiền đúng hạn</option><option value="verified">Giảm khoản chi chưa dùng theo thẻ ngân sách đã kiểm tra, dành 7.500đ cho học phí</option><option value="revise">Rút kinh nghiệm cho lần sau: cân nhắc B theo điều kiện rút sớm</option><option value="hope">Giữ nguyên, hy vọng đến lúc đó sẽ có thêm tiền</option></select></label><label>Mốc kiểm tra kế hoạch<select value={date} onChange={e => setDate(e.target.value)}><option value="">Chọn mốc</option><option value="month1">Cuối tháng 1: kiểm tra nguồn bù và ngày rút, còn thời gian sửa</option><option value="month2">Cuối tháng 2: kiểm tra đủ tiền và điều kiện rút trước hạn</option><option value="after">Sau hạn đóng học phí</option></select></label></>}
    <p>Phần phản tư chỉ ảnh hưởng điểm học tập và điều kiện Ending; Money và stats không đổi. Câu trả lời này không sửa quyết định tài khoản đã ghi nhận.</p><button disabled={!ready} onClick={finish}>Ghi nhận và tiếp tục</button>
  </section>;
}
