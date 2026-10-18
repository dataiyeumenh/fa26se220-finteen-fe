import { useRef, useState } from 'react';
import { InspectCardsDialog } from './ChapterFiveActivities.jsx';
import { applySafetyAction, createSafetyState, insuranceDocuments, insurancePayments, responseActions, safetyMessages, safetyResult } from './scamOrSafeRules.js';
import './loan-detective.css';
import './scam-or-safe.css';

const ART = '/images/finteen-v2/chapter-07';
const cash = value => `${value.toLocaleString('vi-VN')}đ`;
const titles = ['Quầy hồ sơ', 'Hộp thư cần kiểm tra', 'Ưu tiên xử lý'];
const answerLabel = answer => answer === 'check' ? 'Chưa làm theo, tìm nơi khác để hỏi lại' : 'Tiếp tục làm theo hướng dẫn';
export function ScamOrSafeMiniGame({ game, initialResult, onProgress, onComplete }) {
  const [state, setState] = useState(() => initialResult?.ui || createSafetyState(game.rounds));
  const [referenceOpen, setReferenceOpen] = useState(false);
  const current = useRef(state), completed = useRef(false), heading = useRef(null);
  const { round, history } = state;
  const finished = Boolean(state.submittedRounds[round]);
  const active = safetyMessages[state.activeMessage];
  const actionInfo = id => responseActions.find(action => action.id === id);
  const dispatch = action => {
    const next = applySafetyAction(current.current, action);
    if (next === current.current) return;
    current.current = next; setState(next);
    onProgress?.({ ...safetyResult(next.history, game.rounds), ui: next });
  };
  const correct = id => history[id]?.finalCorrect;
  const instructions = [
    'Chọn số tiền cần thanh toán hôm nay và những giấy tờ gửi theo thẻ bảo hiểm. Có thể thay đổi trước khi nộp. Bài thử chưa trừ tiền của An.',
    'Đọc cả nội dung lẫn bối cảnh của từng tin. Chọn cách xử lý cho cả sáu tin rồi nộp một lần; trước khi nộp, chạm số để xem hoặc đổi câu trả lời.',
    'Có giao dịch lạ sau khi lộ mã xác thực. Chọn bốn hành động và xếp theo thứ tự sẽ làm. Có thể lấy thẻ ra để đổi trước khi nộp.',
  ];
  return <section className="loan-game loan-neutral safety-game" aria-label="Bình tĩnh trước rủi ro">
    <header className="loan-heading"><img src={`${ART}/${round === 0 ? 'props/insurance-terms-folder' : 'asset-mini-game/scam-or-safe/message-phone'}.png`} alt=""/><div><span>CÙNG AN XỬ LÝ TỪNG VIỆC</span><h2>Bình tĩnh trước rủi ro</h2><p>Đọc kỹ điều kiện · xem ai đang liên hệ · giữ kín thông tin</p></div></header>
    <ol className="loan-steps safety-steps" aria-label="Các phần chơi">{titles.map((title, i) => <li key={title} className={round === i ? 'active' : ''} aria-current={round === i ? 'step' : undefined}><span>{i + 1}</span>{title}</li>)}</ol>
    <div className="loan-round-title"><h3 ref={heading} tabIndex={-1}>Màn {round + 1} · {titles[round]}</h3><span>{finished ? 'Đã nộp đáp án' : 'Chưa nộp đáp án'}</span></div>
    <p className="loan-instruction"><b>Cách chơi</b>{instructions[round]}</p>

    {round === 0 && <div className="loan-workbench">
      <aside className="loan-budget-note"><b>Hóa đơn y tế: 300.000đ, cần thanh toán trong ngày.</b><br/>Ví bài thử có 1.500.000đ. Khoản xét chi trả tối đa 200.000đ từ bảo hiểm chưa được duyệt; phí bảo hiểm đã đóng từ trước.</aside>
      <button data-safety-reference onClick={() => setReferenceOpen(true)}>Xem lại điều kiện bảo hiểm và hồ sơ</button>
      <h4 className="safety-subtitle">Bạn đưa bao nhiêu tiền để thanh toán hôm nay?</h4>
      <div className="safety-money">{insurancePayments.map(amount => <button key={amount} data-insurance-payment={amount} aria-pressed={state.payment === amount} disabled={finished} onClick={() => dispatch({ type: 'PAYMENT', amount })}>{cash(amount)}</button>)}</div>
      <h4 className="safety-subtitle">Bạn giữ những giấy tờ nào để gửi yêu cầu chi trả?</h4>
      <div className="safety-documents">{insuranceDocuments.map(document => <button key={document.id} data-document={document.id} aria-pressed={state.documents.includes(document.id)} disabled={finished} onClick={() => dispatch({ type: 'DOCUMENT', id: document.id })}><img src={document.image} alt=""/><b>{document.label}</b><span>{state.documents.includes(document.id) ? 'Đã chọn' : 'Chọn giấy tờ'}</span></button>)}</div>
      <button data-submit-insurance className="loan-primary" disabled={finished || state.payment === null} onClick={() => dispatch({ type: 'SUBMIT_INSURANCE' })}>{finished ? 'Đã nhận bài nộp' : 'Nộp cách thanh toán và hồ sơ'}</button>
      {finished && <div className="safety-explanation" data-insurance-result><p><b>{correct('insurancePayment') ? '✓ Đúng' : '× Chưa đúng'} · Tiền thanh toán hôm nay</b></p><p>Cần trả đủ 300.000đ. Ví bài thử còn 1.500.000đ − 300.000đ = <strong>1.200.000đ</strong>. Phần tự trả 100.000đ không có nghĩa hôm nay chỉ thanh toán 100.000đ; khoản bảo hiểm 200.000đ chưa được nhận.</p><p><b>{correct('insurancePacket') ? '✓ Đúng' : '× Chưa đúng'} · Hồ sơ theo thẻ này</b></p><p>Cần hóa đơn đã thanh toán, giấy ghi nhận xử lý y tế và mẫu yêu cầu chi trả. Lịch hẹn không thay chứng từ trong thẻ này; không gửi OTP cho người hỏi. Nộp đủ hồ sơ vẫn cần chờ bên bảo hiểm xem xét theo điều kiện đã ghi; lúc này An chưa nhận được tiền.</p></div>}
    </div>}

    {round === 1 && <div className="loan-workbench">
      <nav className="safety-inbox-nav" aria-label="Sáu tin nhắn">{safetyMessages.map((message, index) => {
        const result = finished ? correct(message.id) ? 'correct' : 'incorrect' : undefined;
        const status = finished ? correct(message.id) ? 'Đúng' : 'Chưa đúng' : state.messages[message.id] ? 'Đã chọn' : 'Chưa chọn';
        return <button key={message.id} data-message-index={index} data-message-result={result} aria-label={`Tin ${index + 1}, ${status.toLowerCase()}`} aria-current={state.activeMessage === index ? 'true' : undefined} onClick={() => dispatch({ type: 'MESSAGE', index })}><b>{index + 1}</b><small>{status}</small></button>;
      })}</nav>
      <article className="safety-message" data-message-id={active.id}><div className="safety-message-heading"><img src={`${ART}/asset-mini-game/scam-or-safe/message-phone.png`} alt=""/><div><span>Tin {state.activeMessage + 1}/{safetyMessages.length}</span><h4>{active.channel}</h4></div></div><blockquote>{active.text}</blockquote><p className="safety-context"><b>Bối cảnh:</b> {active.context}</p>
        <div className="safety-inbox-choices">{['continue', 'check'].map(answer => <button key={answer} data-message-answer={answer} aria-pressed={state.messages[active.id] === answer} disabled={finished} onClick={() => dispatch({ type: 'ANSWER_MESSAGE', id: active.id, answer })}>{answerLabel(answer)}</button>)}</div>
        {finished && <div className="safety-explanation" data-message-explanation><b>{correct(active.id) ? '✓ Đúng' : '× Chưa đúng'}</b><p>Bạn chọn: {answerLabel(state.messages[active.id])}.</p><p>{active.explanation}</p></div>}
      </article>
      <p className="loan-note" aria-live="polite">Đã chọn cách xử lý {Object.keys(state.messages).length}/{safetyMessages.length} tin. {finished ? 'Có thể mở từng tin để đọc lời giải.' : 'Chưa kiểm tra đúng sai; bạn có thể đổi trước khi nộp.'}</p>
      <button data-submit-messages className="loan-primary" disabled={finished || safetyMessages.some(message => !state.messages[message.id])} onClick={() => dispatch({ type: 'SUBMIT_MESSAGES' })}>{finished ? 'Đã kiểm tra hộp thư' : 'Nộp cách xử lý sáu tin'}</button>
    </div>}

    {round === 2 && <div className="loan-workbench">
      <aside className="loan-budget-note"><b>Tình huống:</b> vừa thấy giao dịch không do bạn thực hiện sau khi gửi mã cho người lạ. Bạn có ứng dụng ngân hàng đang dùng và số hỗ trợ ghi trên thẻ. Đây là bài giả lập, không nhập dữ liệu thật.</aside>
      <h4>Bốn bước bạn sẽ làm</h4>
      <ol className="safety-response-slots">{Array.from({ length: 4 }, (_, index) => { const action = actionInfo(state.response[index]); return <li key={index}><span className="safety-order">{index + 1}</span>{action ? <><img src={action.image} alt=""/><b>{action.label}</b>{!finished && <button data-remove-response={action.id} onClick={() => dispatch({ type: 'REMOVE_RESPONSE', id: action.id })} aria-label={`Lấy bước ${index + 1} ra`}>Lấy ra</button>}</> : <span>Chọn một thẻ bên dưới để đặt bước {index + 1}</span>}</li>; })}</ol>
      <div className="safety-action-cards">{responseActions.map(action => <button key={action.id} data-response={action.id} disabled={finished || state.response.includes(action.id) || state.response.length === 4} onClick={() => dispatch({ type: 'ADD_RESPONSE', id: action.id })}><img src={action.image} alt=""/><b>{action.label}</b><span>{state.response.includes(action.id) ? `Đã xếp bước ${state.response.indexOf(action.id) + 1}` : 'Thêm vào kế hoạch'}</span></button>)}</div>
      <button data-submit-response className="loan-primary" disabled={finished || state.response.length !== 4} onClick={() => dispatch({ type: 'SUBMIT_RESPONSE' })}>{finished ? 'Đã nhận kế hoạch' : 'Nộp kế hoạch ứng phó'}</button>
      {finished && <div className="safety-explanation" data-response-result><h4>Xem lại các bước đã chọn</h4><p><b>{correct('response_stop') ? '✓ Đúng' : '× Chưa đúng'} · Dừng ngay thao tác và không gửi thêm thông tin.</b></p><p><b>{correct('response_contact') ? '✓ Đúng' : '× Chưa đúng'} · Báo ngân hàng qua số trên thẻ hoặc mục hỗ trợ trong ứng dụng.</b></p><p><b>{correct('response_protect') ? '✓ Đúng' : '× Chưa đúng'} · Dùng chức năng khóa thẻ hoặc tài khoản trong ứng dụng ngân hàng.</b></p><p><b>{correct('response_save') ? '✓ Đúng' : '× Chưa đúng'} · Lưu tin nhắn và thông tin giao dịch để gửi ngân hàng; đừng đợi gom đủ mới báo và khóa.</b></p><p>Báo ngân hàng và khóa thẻ hoặc tài khoản đều cần làm sớm. Việc nào làm được trước thì làm trước. Đừng chuyển thêm phí hay nhờ lại người lạ. Dù đã báo ngân hàng, bạn vẫn chưa chắc lấy lại được tiền.</p></div>}
    </div>}

    <p className="loan-feedback" role="status">{state.feedback || 'Nộp một lần; sau đó đọc lời giải và tiếp tục, kể cả khi có câu chưa đúng.'}</p>
    <footer className="loan-footer"><span>{finished ? 'Đã xem kết quả · có thể tiếp tục' : 'Không đếm giờ · chưa nộp đáp án'}</span><button className="loan-primary" disabled={!finished} onClick={() => {
      if (round < game.rounds.at(-1)) { dispatch({ type: 'ROUND', round: round + 1 }); requestAnimationFrame(() => heading.current?.focus()); return; }
      if (completed.current) return;
      completed.current = true; onComplete({ ...safetyResult(history, game.rounds), ui: state });
    }}>{round === game.rounds.at(-1) ? 'Trở lại câu chuyện' : 'Sang màn tiếp theo →'}</button></footer>
    <p className="loan-note">Các thao tác trong bài thử không mở liên kết, gửi tin, tạo khoản vay hay thay đổi ví của An. Không nhập OTP, mật khẩu hoặc thông tin cá nhân thật.</p>
    {referenceOpen && game.reference && <InspectCardsDialog inspect={{ ...game.reference, reviewOnly: true }} onClose={() => setReferenceOpen(false)}/>}
  </section>;
}
