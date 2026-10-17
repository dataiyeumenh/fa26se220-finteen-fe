import { useRef, useState } from 'react';
import { applyLoanAction, bnplItems, cartForecast, createLoanState, loanApr, loanOffers, loanResult, loanTotal, sortTargets, statementOptions, statementOutcome } from './loanDetectiveRules.js';
import { InspectCardsDialog } from './ChapterFiveActivities.jsx';
import './loan-detective.css';

const BASE = '/images/finteen-v2/chapter-06/asset-mini-game/loan-detective';
const cash = n => `${n.toLocaleString('vi-VN')}đ`;
const titles = ['Tính tổng trả', 'Xếp gói vay', 'Giỏ hàng trả sau', 'Trả nợ thẻ'];
const pictures = ['loan-offers-inspection', 'laptop-goal', 'repayment-calendar', 'card-and-statement'];
const trays = [
  ['shortfall', 'Chưa đủ tiền mua máy', 'Tiền thực nhận dưới 6.000.000đ'],
  ['over', 'Khoản trả vượt ngân sách', 'Cần trả hơn 1.000.000đ mỗi tháng'],
  ['fit', 'Đủ tiền mua, trả vừa ngân sách', 'Nhận đủ 6.000.000đ; trả không quá 1.000.000đ/tháng'],
];
const trayName = id => trays.find(tray => tray[0] === id)?.[1];
const sortReason = {
  A: 'Nhận đủ tiền mua máy nhưng cần trả 1.120.000đ/tháng, cao hơn ngân sách 120.000đ.',
  B: 'Nhận đủ 6.000.000đ và trả 550.000đ/tháng, còn 450.000đ trong ngân sách tháng.',
  C: 'Chỉ nhận 5.400.000đ, còn thiếu 600.000đ mua máy. Mỗi tháng có hai lần trả 500.000đ.',
};

export function LoanDetectiveMiniGame({ game, initialResult, onProgress, onComplete }) {
  const [state, setState] = useState(() => initialResult?.ui || createLoanState(game.rounds));
  const [reviewOffers, setReviewOffers] = useState(false);
  const stateRef = useRef(state);
  const dragRef = useRef(null);
  const heading = useRef(null);
  const submitted = useRef(false);
  const { round, totals, sorted, selected, history, feedback } = state;
  const finished = Boolean(state.submittedRounds[round]);
  const basket = cartForecast(state.basket);
  const statement = statementOutcome(state.statementChoice);
  const dispatch = action => {
    const next = applyLoanAction(stateRef.current, action);
    if (next === stateRef.current) return;
    stateRef.current = next; setState(next);
    onProgress?.({ ...loanResult(next.history, game.rounds), ui: next });
  };
  const beginDrag = (event, id) => {
    dragRef.current = id; dispatch({ type: 'SELECT', id });
    event.dataTransfer.setData('text/plain', id); event.dataTransfer.effectAllowed = 'move';
  };
  const drop = (event, target) => {
    event.preventDefault(); event.stopPropagation();
    const id = event.dataTransfer.getData('text/plain') || dragRef.current || stateRef.current.selected;
    dragRef.current = null; dispatch({ type: 'SORT', id, target });
  };
  const offerCard = (offer, placed = false) => <button key={offer.id} className={`loan-offer-card${placed ? ' is-placed' : ''}`} data-offer={offer.id} draggable={!finished} onDragStart={event => beginDrag(event, offer.id)} disabled={finished} aria-pressed={selected === offer.id} onClick={() => dispatch({ type: 'SELECT', id: offer.id })}>
    {!placed && <img src={`${BASE}/loan-offers-inspection.png`} alt=""/>}<b>Gói vay {offer.id}</b>
    <span>{cash(offer.installment)}/{offer.intervalMonths === .5 ? 'nửa tháng' : 'tháng'}</span>
    <small>Thực nhận: {cash(offer.received)}</small><small>Tổng trả: {cash(loanTotal(offer))}</small>
    {!placed && <><small>{offer.periods} lần trả · {offer.periods * offer.intervalMonths} tháng</small><small>APR ≈ {loanApr(offer).toFixed(1).replace('.', ',')}%/năm</small></>}
    <span className="loan-placement-label">{finished ? history[`sort${offer.id}`]?.finalCorrect ? '✓ Đúng' : '× Chưa đúng' : selected === offer.id ? 'Đang cầm thẻ · chọn một khay' : placed ? 'Đã đặt · chạm để chuyển khay' : 'Chạm hoặc kéo để xếp'}</span>
  </button>;
  const instruction = [
    'Nhập tổng tiền phải trả của cả ba gói rồi nộp một lần. Sau khi chấm, bạn sẽ thấy phép tính đúng và được tiếp tục dù có câu sai.',
    'Đặt cả ba thẻ vào khay theo nhận định của bạn. Có thể chuyển thẻ trước khi bấm kiểm tra; hệ thống chỉ chấm sau khi bạn nộp.',
    'Chọn tai nghe để học online và thêm ít nhất một món bạn muốn mua. Hãy cân đối giỏ hàng để ba tháng tới không thiếu tiền, rồi chốt giỏ một lần.',
    'Chọn số tiền trả nợ hôm nay. Sau đó xem bạn còn đủ tiền sinh hoạt không và tháng sau còn phải trả bao nhiêu.',
  ][round];

  return <section className={`loan-game loan-casual${round >= 2 ? ' loan-neutral' : ''}`} aria-label="Thám tử khoản vay">
    <header className="loan-heading"><img src={`${BASE}/${pictures[round]}.png`} alt=""/><div><span>CÙNG AN THỬ MỘT KẾ HOẠCH</span><h2>Thám tử khoản vay</h2><p>Biết tổng chi · tính cả những lần trả sau</p></div></header>
    <ol className="loan-steps" aria-label="Các màn chơi">{titles.map((title, i) => <li key={title} className={round === i ? 'active' : ''} aria-current={round === i ? 'step' : undefined}><span>{i + 1}</span>{title}</li>)}</ol>
    <div className="loan-round-title"><h3 ref={heading} tabIndex={-1}>Màn {round + 1} · {titles[round]}</h3><span>{finished ? 'Đã nộp đáp án' : 'Chưa nộp đáp án'}</span></div>
    <p className="loan-instruction"><b>Cách chơi</b>{instruction}</p>

    {round === 0 && <div className="loan-workbench">
      <div className="loan-total-cards">{loanOffers.map(offer => {
        const result = history[`receipt${offer.id}`];
        return <article key={offer.id} className={result ? result.finalCorrect ? 'is-correct' : 'is-incorrect' : ''}><h4>Gói vay {offer.id}</h4>
          <label htmlFor={`total-${offer.id}`}>Bạn tính tổng phải trả<input id={`total-${offer.id}`} data-total-input={offer.id} type="number" min="0" step="1" inputMode="numeric" placeholder="Nhập số đồng" value={totals[offer.id] ?? ''} disabled={finished} onChange={event => dispatch({ type: 'TOTAL_DRAFT', id: offer.id, value: event.target.value })}/></label>
          {result && <div data-total-explanation={offer.id} className={result.finalCorrect ? 'loan-answer-success' : 'loan-answer-hint'}><b>{result.finalCorrect ? '✓ Đúng' : '× Chưa đúng'}</b><p>{offer.periods} lần × {cash(offer.installment)} = <strong>{cash(loanTotal(offer))}</strong>.</p>{offer.id === 'C' && <p>Mỗi tháng trả hai lần: 8 tháng là 16 lần trả.</p>}</div>}
        </article>;
      })}</div>
      <button data-review-offers onClick={() => setReviewOffers(true)}>Xem lại thông tin ba gói vay</button>
      <details className="loan-calc-help"><summary>Gợi ý cách tính</summary><p>Tổng tiền phải trả = số lần trả × số tiền mỗi lần. Nhớ phân biệt số tháng với số lần thanh toán.</p></details>
      <button data-submit-totals className="loan-primary" disabled={finished || !loanOffers.every(offer => String(totals[offer.id] ?? '').trim() && Number.isFinite(Number(totals[offer.id])) && Number(totals[offer.id]) >= 0)} onClick={() => dispatch({ type: 'TOTAL' })}>{finished ? 'Đã nộp đáp án' : 'Nộp kết quả ba gói'}</button>
      {finished && <p className="loan-comparison-note">Gói B có tổng trả thấp nhất. Tổng tiền chưa đủ để quyết định: màn sau còn xét tiền thực nhận và khả năng trả mỗi tháng.</p>}
    </div>}

    {round === 1 && <div className="loan-workbench loan-sort-board">
      <aside className="loan-budget-note">Laptop giá <b>6.000.000đ</b>. An đang có <b>0đ</b> và có thể dành <b>1.000.000đ/tháng</b> sau sinh hoạt.</aside>
      <div className="loan-placement-status" aria-live="polite"><b>Đã đặt {Object.keys(sorted).length}/3 thẻ</b><span>{finished ? 'Các thẻ đã được khóa theo bài nộp.' : selected ? `Đang cầm gói ${selected} — chọn khay để đặt.` : 'Thẻ đã đặt sẽ nằm ngay trong khay, không còn ở hàng trên.'}</span></div>
      <div className="loan-sort-pool">{loanOffers.filter(offer => !sorted[offer.id]).map(offer => offerCard(offer))}</div>
      {Object.keys(sorted).length === 3 && !finished && <p className="loan-note">Đã xếp hết. Chạm thẻ trong khay để chuyển nếu bạn muốn đổi ý, hoặc nộp bài bên dưới.</p>}
      <div className="loan-sort-zones">{trays.map(([id, label, help]) => <article key={id} className={`loan-sort-zone${selected && !finished ? ' can-place' : ''}`} onDragOver={event => event.preventDefault()} onDrop={event => drop(event, id)}>
        <h4>{label}</h4><p>{help}</p>
        <div className="loan-zone-cards">{loanOffers.filter(offer => sorted[offer.id] === id).map(offer => <div key={offer.id}>{offerCard(offer, true)}{!finished && <button className="loan-remove-card" data-unsort={offer.id} onClick={() => dispatch({ type: 'UNSORT', id: offer.id })}>Lấy thẻ ra</button>}</div>)}</div>
        <button data-tray={id} className="loan-place-button" disabled={finished || !selected} onClick={() => dispatch({ type: 'SORT', id: selected, target: id })}>{selected ? `Đặt gói ${selected} vào khay này` : Object.values(sorted).includes(id) ? 'Chọn thẻ khác để đặt thêm' : 'Khay trống · chọn thẻ để đặt'}</button>
      </article>)}</div>
      <button data-submit-sort className="loan-primary" disabled={finished || Object.keys(sorted).length !== 3} onClick={() => dispatch({ type: 'SUBMIT_SORT' })}>{finished ? 'Đã nộp đáp án' : 'Kiểm tra cách xếp của tôi'}</button>
      {finished && <div className="loan-sort-explanations"><h4>Đối chiếu đáp án</h4>{loanOffers.map(offer => <article key={offer.id} data-sort-explanation={offer.id}><b>{history[`sort${offer.id}`].finalCorrect ? '✓ Đúng' : '× Chưa đúng'} · Gói vay {offer.id}</b><p>Bạn xếp: {trayName(sorted[offer.id])}.</p><p><strong>Khay đúng: {trayName(sortTargets[offer.id])}.</strong> {sortReason[offer.id]}</p></article>)}</div>}
    </div>}

    {round === 2 && <div className="loan-workbench">
      <aside className="loan-budget-note"><b>Bài thử riêng: mua sắm để học online.</b><br/>Mỗi tháng có 500.000đ sau sinh hoạt. Riêng tháng 2 đã có khoản khác đến hạn 200.000đ. Các món dưới đây đều trả ba lần, mỗi tháng một lần, 0% lãi và không có phí trong bài thử.</aside>
      <div className="loan-shop">{bnplItems.map(item => <article key={item.id} className={state.basket.includes(item.id) ? 'in-basket' : ''}><img className="loan-product-image" src={item.image} alt=""/><h4>{item.label}</h4><p>Giá {cash(item.price)}</p><strong>{cash(item.installment)}/tháng × 3</strong><button data-item={item.id} aria-pressed={state.basket.includes(item.id)} disabled={finished} onClick={() => dispatch({ type: 'TOGGLE_ITEM', id: item.id })}>{state.basket.includes(item.id) ? 'Bỏ khỏi giỏ' : 'Thêm vào giỏ'}</button></article>)}</div>
      <div className="loan-basket" aria-live="polite"><h4>Giỏ của bạn · {state.basket.length} món</h4><p>{basket.items.length ? basket.items.map(item => item.label).join(' + ') : 'Chưa có món nào.'}</p><p>Mỗi tháng cần trả: <strong>{cash(basket.monthly)}</strong></p></div>
      <button data-buy-cart className="loan-primary" disabled={finished || !state.basket.length} onClick={() => dispatch({ type: 'BUY_CART' })}>{finished ? 'Đã chốt giỏ hàng' : 'Chốt giỏ và xem lịch trả'}</button>
      {finished && <div data-cart-result><div className="loan-plan-months">{basket.months.map(month => <article key={month.month}><h4>Tháng {month.month}</h4><p>Có: {cash(month.available)}</p><p>Giỏ trả sau: − {cash(month.payment)}</p><p>Khoản khác: − {cash(month.other)}</p><output>{month.remaining >= 0 ? 'Còn' : 'Thiếu'} <b>{cash(Math.abs(month.remaining))}</b></output></article>)}</div><div className="loan-comparison-note"><p>{basket.meetsNeed ? '✓ Đúng: có tai nghe và ít nhất một món thêm như mục tiêu.' : '× Chưa đúng mục tiêu: giỏ cần có tai nghe và ít nhất một món thêm.'}</p><p>{basket.affordable ? '✓ Đúng: không tháng nào vượt số tiền có thể dùng.' : '× Chưa đúng ngân sách: lịch trả có tháng thiếu tiền. Nhiều món 0% lãi vẫn cộng thành khoản phải trả lớn.'}</p><p>Ví dụ đáp ứng cả hai mục tiêu: tai nghe + bộ sổ và bút, trả 300.000đ/tháng. Tháng 2 cộng khoản khác 200.000đ là vừa đủ 500.000đ.</p></div></div>}
    </div>}

    {round === 3 && <div className="loan-workbench">
      <h4>Bạn sẽ dùng bao nhiêu tiền trong ví để trả nợ thẻ?</h4>
      <dl className="loan-statement-facts"><div><dt>Tiền trong ví</dt><dd>1.200.000đ</dd></div><div><dt>Tổng tiền đang nợ</dt><dd>1.000.000đ</dd></div><div><dt>Sinh hoạt sắp tới cần</dt><dd>400.000đ</dd></div><div><dt>Mức trả tối thiểu kỳ này</dt><dd>100.000đ</dd></div></dl>
      <aside className="loan-budget-note"><b>Cần đạt cả hai mục tiêu:</b><ul><li>Trả nợ xong vẫn giữ đủ <b>400.000đ</b> sinh hoạt.</li><li>Tiền lãi tháng sau <b>không quá 5.000đ</b>.</li></ul></aside>
      <div className="loan-comparison-note"><b>Cách tính trong bài thử</b><p>Phần nợ chưa trả sẽ thêm <b>2% tiền lãi</b> vào tháng sau. Ví dụ: còn nợ 100.000đ thì thêm 2.000đ lãi.</p><p className="loan-note">Chỉ là quy tắc giả lập; không tính chi tiêu mới hay phí khác, không đại diện cho thẻ ngân hàng cụ thể.</p></div>
      <div className="loan-statement-options">{statementOptions.map(option => <button key={option.id} data-statement-choice={option.id} disabled={state.statementStep > 0} aria-pressed={state.statementChoice === option.id} onClick={() => dispatch({ type: 'STATEMENT_CHOICE', id: option.id })}><span aria-hidden="true">✉</span><b>{option.label}</b><strong>{cash(option.amount)}</strong></button>)}</div>
      {state.statementStep === 0 && <button data-confirm-statement className="loan-primary" disabled={!statement} onClick={() => dispatch({ type: 'CONFIRM_STATEMENT' })}>Chốt cách trả và xem kết quả</button>}
      {state.statementStep >= 1 && <div className="loan-statement-events" aria-live="polite"><article><span className="loan-event-number">1</span><div><h4>Hôm nay · trích tiền trả nợ</h4><dl className="loan-statement-calculation"><div><dt>Ví ban đầu</dt><dd>1.200.000đ</dd></div><div><dt>Trả nợ</dt><dd>− {cash(statement.amount)}</dd></div><div><dt>Ví còn</dt><dd>{cash(statement.walletLeft)}</dd></div></dl></div></article><article data-living-event><span className="loan-event-number">2</span><div><h4>Tiếp theo · chi sinh hoạt</h4><p>Cần 400.000đ. {statement.livingCovered ? `Ví còn đủ để chi, sau đó còn ${cash(statement.afterLiving)}.` : `Ví chỉ có ${cash(statement.walletLeft)}, còn thiếu ${cash(statement.livingShortfall)}.`}</p></div></article>
        {state.statementStep === 1 && <button data-reveal-statement className="loan-primary" onClick={() => dispatch({ type: 'REVEAL_STATEMENT' })}>Xem khoản nợ tháng sau</button>}
        {finished && <><article data-debt-event><span className="loan-event-number">3</span><div><h4>Tháng sau · cộng lãi vào nợ còn lại</h4><dl className="loan-statement-calculation"><div><dt>Nợ chưa trả</dt><dd>{cash(statement.debtLeft)}</dd></div><div><dt>Thêm lãi 2%</dt><dd>+ {cash(statement.interest)}</dd></div><div><dt>Tổng còn phải trả</dt><dd>{cash(statement.nextDebt)}</dd></div></dl><p className="loan-note">{statement.livingCovered ? `Tiền còn trong ví là ${cash(statement.afterLiving)}; chưa dùng để trả khoản nợ này.` : `Khoản sinh hoạt thiếu ${cash(statement.livingShortfall)} vẫn chưa được giải quyết.`}</p></div></article><div className="loan-comparison-note"><p>{statement.livingCovered ? '✓ Đúng: giữ đủ tiền sinh hoạt.' : '× Chưa đúng: còn thiếu tiền sinh hoạt.'}</p><p>{statement.costCovered ? `✓ Đúng: lãi ${cash(statement.interest)}, không vượt 5.000đ.` : `× Chưa đúng: lãi ${cash(statement.interest)}, vượt mục tiêu 5.000đ.`}</p><p>Trả 750.000đ hoặc 800.000đ đều đáp ứng hai mục tiêu: giữ đủ tiền sinh hoạt và lãi không quá 5.000đ. Trả tối thiểu không làm hết nợ; trả hết ngay cũng cần xem còn đủ tiền sống không.</p></div></>}
      </div>}
    </div>}

    <p className="loan-feedback" role="status">{feedback || (round === 1 ? 'Chưa chấm bài. Bạn được tự do xếp và chuyển thẻ.' : 'Chỉ kiểm tra sau khi bạn xác nhận. Không có lượt nộp lại.')}</p>
    <footer className="loan-footer"><span>{finished ? 'Đã xem kết quả · có thể tiếp tục' : 'Không đếm giờ · nộp một lần'}</span><button className="loan-primary" disabled={!finished} onClick={() => {
      if (round < game.rounds.at(-1)) { dispatch({ type: 'ROUND', round: round + 1 }); requestAnimationFrame(() => heading.current?.focus()); return; }
      if (submitted.current) return;
      submitted.current = true; onComplete({ ...loanResult(history, game.rounds), ui: state });
    }}>{round === game.rounds.at(-1) ? 'Trở lại câu chuyện' : 'Sang màn tiếp theo →'}</button></footer>
    <p className="loan-note">Tiền trong bài thử là giả lập, không thay đổi số dư hiện tại của An.</p>
    {reviewOffers && game.reference && <InspectCardsDialog inspect={{ ...game.reference, reviewOnly: true }} onClose={() => setReviewOffers(false)}/>}
  </section>;
}
