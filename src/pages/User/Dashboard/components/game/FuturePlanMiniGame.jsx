import { useRef, useState } from 'react';
import { InspectCardsDialog } from './ChapterFiveActivities.jsx';
import { FUTURE_ART, annualGoal, planProjection, legacyMarketScenario, allocationAssets, allocationValue, applyFutureAction, availableBudget, budgetFeedback, claimChecks, restoreFutureState, futureResult, planBalance, planMonths } from './futurePlanRules.js';
import './future-plan.css';

const cash = amount => `${amount.toLocaleString('vi-VN')}đ`;
function Counter({ label, value, unit, step, maxValue = Infinity, disabled, onChange }) {
  return <div className="future-counter"><button aria-label={`Giảm ${label}`} disabled={disabled || value === 0} onClick={() => onChange(-step)}>−</button><output aria-label={label}>{unit ? value : cash(value)}{unit && <small>{unit}</small>}</output><button aria-label={`Tăng ${label}`} disabled={disabled || value + step > maxValue} onClick={() => onChange(step)}>+</button></div>;
}
export function FuturePlanMiniGame({ game, initialResult, onProgress, onComplete }) {
  const [state, setState] = useState(() => restoreFutureState(game.kind, initialResult?.ui));
  const [reference, setReference] = useState(false);
  const current = useRef(state), completed = useRef(false);
  const portfolio = game.kind === 'portfolio', claims = game.kind === 'claims';
  const projection = planProjection(state.budgets);
  const market = state.market || legacyMarketScenario;
  const result = futureResult(state), values = allocationValue(state.allocation, market);
  const month = planMonths[state.month], budget = state.budgets[state.month], monthDone = state.submittedMonths[state.month];
  const balance = planBalance(month, budget);
  const budgetLimit = availableBudget(month);
  const dispatch = action => {
    const next = applyFutureAction(current.current, action);
    if (next === current.current) return;
    current.current = next; setState(next); onProgress?.(futureResult(next));
    if (action.type === 'NEXT_MONTH') requestAnimationFrame(() => document.querySelector('[data-planner]')?.scrollIntoView({ block: 'start' }));
    if (action.type === 'SUBMIT_ALLOCATION' || action.type === 'SUBMIT_MONTH') requestAnimationFrame(() => document.querySelector(action.type === 'SUBMIT_ALLOCATION' ? '[data-allocation-results]' : '[data-month-result]')?.scrollIntoView({ block: 'nearest' }));
  };
  const correct = id => state.history[id]?.finalCorrect;
  const finish = () => { if (!result.completed || completed.current) return; completed.current = true; onComplete(result); };
  return <section className="future-game" aria-label={game.title}>
    <header className="future-heading"><img src={`${FUTURE_ART}/asset-mini-game/${portfolio ? 'portfolio-builder/diversified-fund' : 'life-planner/month-calendar'}.png`} alt=""/><div><span>GÓC THỰC HÀNH CỦA AN</span><h2>{game.title}</h2><p>{portfolio ? 'Chia tiền theo ngày cần dùng, rồi xem kết quả sau ba tháng.' : claims ? 'Chọn những thông tin cần xem trước khi trả lời lời mời đầu tư.' : 'Giúp An để dành tiền học cho năm sau mà vẫn đủ tiền sinh hoạt.'}</p></div></header>
    <div className="future-toolbar"><span>{portfolio ? '10.000.000đ · 100 điểm' : claims ? 'Đọc quảng cáo · chọn ba thông tin cần kiểm tra' : `Tình huống ${state.month + 1}/3 · Cân lại ngân sách`}</span>{game.reference && <button onClick={() => setReference(true)}>Xem lại thông tin tài sản</button>}</div>
    {portfolio ? <>
      <aside className="future-note"><b>Khóa học cần 3.000.000đ sau ba tháng.</b><p>Chia đủ 100 điểm vào ba giỏ. 1 điểm = 100.000đ; mỗi lần bấm thêm hoặc bớt 10 điểm (1.000.000đ). Bạn tự quyết định phần nào giữ dễ rút, phần nào chấp nhận biến động.</p></aside>
      <div className="future-pool"><span>Điểm chưa chia</span><strong>{100 - values.total}</strong><div className="future-tokens" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i < (100 - values.total) / 10 ? 'available' : ''}/>)}</div></div>
      <div className="future-baskets">{allocationAssets.map(asset => <article key={asset.id}>
        <img src={`${FUTURE_ART}/asset-mini-game/portfolio-builder/${asset.image}.png`} alt=""/><h3>{asset.label}</h3><p>{asset.description}</p>
        <Counter label={asset.label} value={state.allocation[asset.id]} unit="điểm" step={10} maxValue={state.allocation[asset.id] + 100 - values.total} disabled={state.allocationSubmitted} onChange={delta => dispatch({ type: 'ALLOCATE', id: asset.id, delta })}/><b>{cash(state.allocation[asset.id] * 100000)}</b>
      </article>)}</div>
      {!state.allocationSubmitted && <button className="future-primary" data-submit-allocation disabled={values.total !== 100} onClick={() => dispatch({ type: 'SUBMIT_ALLOCATION' })}>Chốt phân bổ và xem biến động</button>}
      {state.allocationSubmitted && <div className="future-results" data-allocation-results>
        <h3>Kết quả sau ba tháng trong tình huống này</h3><p>Trái phiếu và cổ phiếu được chọn mức biến động độc lập từ −10% đến +10% cho mỗi lượt chơi mới. Tình huống của lượt này được giữ nguyên khi xem lại hoặc tải lại trang; tiền dễ rút không đổi.</p><p className="future-fine">Đây là thay đổi tổng giá trị sau ba tháng, không phải lãi suất cố định mỗi tháng. Hai nhóm có thể cùng tăng, cùng giảm hoặc đi ngược chiều. Giới hạn 10% chỉ dùng cho bài tập; thực tế có thể biến động ngoài khoảng này.</p>
        <div className="future-market">{allocationAssets.map(asset => <div key={asset.id}><span>{asset.label} · {market[asset.id] > 0 ? '+' : ''}{market[asset.id]}% {market.period}</span><small>Ban đầu: {cash(state.allocation[asset.id] * 100000)}</small><b>Sau đó: {cash(state.allocation[asset.id] * 100000 * (1 + market[asset.id] / 100))}</b><small>Chênh lệch: {cash(state.allocation[asset.id] * 100000 * market[asset.id] / 100)}</small></div>)}</div>
        <p>Từ 10.000.000đ, thay đổi <b>{cash(values.delta)}</b>. Nếu bán hết trong bài thử: <strong>{cash(values.final)}</strong>.</p>
        <p data-result={correct('allocation_near') ? 'correct' : 'incorrect'}><b>{correct('allocation_near') ? 'Đúng' : 'Chưa đúng'} · Tiền khóa học</b><br/>Giỏ dễ rút có {cash(values.nearMoney)}. {correct('allocation_near') ? 'Đủ 3.000.000đ để không phải chờ bán tài sản đúng ngày đóng học phí.' : `Còn thiếu ${cash(3000000 - values.nearMoney)} cho khóa học; nếu tài sản giảm giá, An có thể phải bán lúc bất lợi.`}</p>
        <p data-result={correct('allocation_spread') ? 'correct' : 'incorrect'}><b>{correct('allocation_spread') ? 'Đúng' : 'Chưa đúng'} · Chia phần đầu tư</b><br/>Chia giữa trái phiếu và cổ phiếu giúp giảm phụ thuộc vào một nhóm trong bài này. Vẫn có thể lỗ; không có một tỷ lệ đúng cho mọi người.</p>
        <p className="future-fine">Đây là lượt tập. Ví 10.000.000đ của An sẽ được cập nhật theo phương án bạn chọn trong câu chuyện tiếp theo, không trừ thêm kết quả ở đây.</p>
      </div>}
    </> : claims ? <>
      <aside className="future-ad"><img src={`${FUTURE_ART}/props/esg-claim-inspection.png`} alt=""/><div><small>QUẢNG CÁO GIẢ LẬP</small><h3>“Đầu tư xanh, lợi nhuận chắc chắn!”</h3><p>Ứng dụng còn báo “mua ngay để lên hạng”. Người giới thiệu nhận hoa hồng nếu bạn tham gia.</p></div></aside>
      <h3>Bạn sẽ tìm hiểu ba thông tin nào?</h3><p>An muốn biết lời mời có đáng cân nhắc không. Chọn ba thông tin giúp kiểm tra rủi ro và lời quảng cáo, rồi nộp để xem giải thích.</p>
      <div className="future-checks">{claimChecks.map(check => {
        const matched = state.checks.includes(check.id) === check.correct;
        return <button key={check.id} data-claim={check.id} aria-pressed={state.checks.includes(check.id)} data-result={state.checksSubmitted ? matched ? 'correct' : 'incorrect' : undefined} disabled={state.checksSubmitted} onClick={() => dispatch({ type: 'CHECK', id: check.id })}><b>{check.label}</b><small>{state.checksSubmitted ? `${matched ? 'Đúng' : 'Chưa đúng'}${state.checks.includes(check.id) ? ' · Bạn đã chọn' : ' · Bạn không chọn'}` : state.checks.includes(check.id) ? 'Đã chọn' : 'Chọn thẻ'}{state.checksSubmitted && <span>{check.detail}</span>}</small></button>;
      })}</div>
      <button className="future-primary" data-submit-checks disabled={state.checksSubmitted || state.checks.length !== 3} onClick={() => dispatch({ type: 'SUBMIT_CHECKS' })}>{state.checksSubmitted ? 'Đã kiểm tra quảng cáo' : 'Nộp ba điều muốn kiểm tra'}</button>
    </> : <div className="future-planner" data-planner>
        <aside className="future-note future-goal-note"><b>{annualGoal.label}: {cash(annualGoal.amount)}</b><p>An muốn có số tiền này sau 12 tháng. {annualGoal.description}</p><p>Mỗi tình huống bắt đầu với hai khoản ở 0đ để bạn tự chia. Hai khoản dùng chung số tiền còn sau chi bắt buộc. Tăng một khoản vượt phần còn trống thì khoản kia tự giảm. Giảm một khoản sẽ để lại tiền dự phòng.</p></aside>
        <div className="future-months" aria-label="Ba tình huống trong kế hoạch năm">{planMonths.map((item, i) => <span key={item.id} aria-current={state.month === i ? 'step' : undefined} data-result={state.submittedMonths[i] ? correct(`plan_${item.id}`) ? 'correct' : 'incorrect' : undefined}>{i + 1}. {item.label}{state.submittedMonths[i] && <small>{correct(`plan_${item.id}`) ? 'Đúng' : 'Chưa đúng'}</small>}</span>)}</div>
        <h3>{month.label}</h3><p>{state.month === 0 ? 'Sau chi bắt buộc, An còn 1.000.000đ. Bạn muốn dành bao nhiêu cho quỹ học tập và bao nhiêu để đi chơi, mua sắm?' : state.month === 1 ? 'An nhận ít việc hơn, thu nhập giảm 400.000đ. Với 600.000đ còn lại sau chi bắt buộc, bạn sẽ chia hai khoản thế nào?' : 'Thu nhập vẫn thấp, tiền ăn ở và đi lại tăng thêm 200.000đ. Lần này chỉ còn 400.000đ để chia. Bạn muốn dành bao nhiêu cho mỗi khoản?'}</p>
        <div className="future-cashflow"><div><span>Thu nhập dự kiến</span><strong>{cash(month.income)}</strong></div><span aria-hidden="true">−</span><div><span>Chi bắt buộc</span><strong>{cash(month.essential)}</strong></div><span aria-hidden="true">=</span><div><span>Còn sau chi bắt buộc</span><strong>{cash(month.income - month.essential)}</strong></div></div>
        <p className="future-fine">Chi bắt buộc gồm tiền ăn ở, đi lại và 300.000đ trả góp cũ. Tổng ở trên đã tính cả khoản trả góp, không cộng thêm lần nữa.</p>
        <div className="future-budget"><article><img src={`${FUTURE_ART}/asset-mini-game/life-planner/course-goal.png`} alt=""/><h4>Bỏ vào quỹ học tập</h4><Counter label="Tiền để dành" value={budget.goal} step={100000} maxValue={budgetLimit} disabled={monthDone} onChange={delta => dispatch({ type: 'BUDGET', id: 'goal', delta })}/></article><article><img src={`${FUTURE_ART}/asset-mini-game/life-planner/flexible-expenses.png`} alt=""/><h4>Đi chơi, mua sắm</h4><Counter label="Chi linh hoạt" value={budget.flexible} step={100000} maxValue={budgetLimit} disabled={monthDone} onChange={delta => dispatch({ type: 'BUDGET', id: 'flexible', delta })}/></article></div>
        <div className="future-balance" aria-live="polite"><span>{balance < 0 ? 'Ngân sách đang thiếu' : balance === 0 ? 'Đã chia vừa số tiền còn lại' : 'Còn giữ dự phòng'}</span><strong>{cash(Math.abs(balance))}</strong></div><p className="future-fine">Tiền còn sau chi bắt buộc − tiền cho quỹ học tập − tiền đi chơi, mua sắm = {cash(balance)}.</p>
        <button className="future-primary" data-submit-month disabled={monthDone} onClick={() => dispatch({ type: 'SUBMIT_MONTH' })}>{monthDone ? 'Đã chốt tháng này' : 'Chốt ngân sách tháng này'}</button>
        {monthDone && <div className="future-results" data-month-result data-result={correct(`plan_${month.id}`) ? 'correct' : 'incorrect'}><b>{correct(`plan_${month.id}`) ? 'Đúng' : 'Chưa đúng'}</b>{budgetFeedback(month, budget).map(text => <p key={text}>{text}</p>)}</div>}
        {monthDone && state.month < 2 && <button className="future-primary" data-next-month onClick={() => dispatch({ type: 'NEXT_MONTH' })}>Thử tháng tiếp theo →</button>}
        {result.completed && <aside className="future-note" data-year-plan><b>Bản kế hoạch 12 tháng của bạn</b><p>Lịch thử gồm 10 tháng bình thường, một tháng ít việc và một tháng ít việc kèm tăng giá. Mỗi ô dùng mức để dành bạn vừa chọn; không đoán trước tháng nào thực tế sẽ khó.</p>
          <div className="future-goal-progress"><span>Mục tiêu: {cash(annualGoal.amount)}</span><progress max={annualGoal.amount} value={Math.min(annualGoal.amount, projection.yearSavings)} aria-label="Quỹ học tập dự kiến cuối năm"/><strong>Dự kiến: {cash(projection.yearSavings)}</strong></div>
          {!projection.feasible ? <p><b>Bản kế hoạch chưa đủ điều kiện để thực hiện.</b> {planMonths.some((item, i) => planBalance(item, state.budgets[i]) < 0) ? 'Có tháng chi quá thu nhập, nên tổng để dành trên giấy chưa có đủ tiền để làm theo.' : 'Chưa có mức để dành đều đặn để tính ngày đủ quỹ học tập.'} Khi xem lại, cần cân lại khoản chi hoặc xác định nguồn tiền và thời hạn phù hợp.</p> : projection.shortfall > 0 ? <p>Cuối tháng 12, quỹ còn thiếu <b>{cash(projection.shortfall)}</b>. Nếu sau đó mỗi tháng để dành {cash(state.budgets[0].goal)}, cần thêm khoảng <b>{projection.extraMonths} tháng</b>. Bạn có thể ghi lại thời hạn mới, thay vì lấy lợi nhuận đầu tư chưa có để bù vào.</p> : <p>Với các giả định này, bạn có thể đủ tiền cho quỹ học tập trong 12 tháng. Hãy kiểm tra lại mỗi tháng bằng số tiền thực nhận và đã chi.</p>}
          <details className="future-calendar-details"><summary>Xem mức để dành của từng tháng</summary><div className="future-year">{Array.from({ length: 12 }, (_, index) => { const type = index < 10 ? 0 : index === 10 ? 1 : 2; return <div key={index}><small>Tháng {index + 1}</small><b>{cash(state.budgets[type].goal)}</b><span>{type === 0 ? 'Bình thường' : type === 1 ? 'Ít việc' : 'Ít việc, giá tăng'}</span></div>; })}</div></details>
          <p>Đây là tiền dự kiến để dành từ công việc, chưa được cộng vào ví. Khoản học phí 3.000.000đ ở đầu chương không dùng để bù cho bảng này.</p></aside>}
      </div>}
    <footer className="future-footer"><p>{result.completed ? 'Đã nộp · có thể đọc lời giải rồi tiếp tục' : 'Không đếm giờ · có thể sửa trước khi nộp'}</p><button className="future-primary" disabled={!result.completed} data-future-finish onClick={finish}>Trở lại câu chuyện →</button></footer>
    <p className="future-fine">Số tiền và diễn biến đều giả lập. Các thao tác trong bài tập không mua sản phẩm thật và không làm thay đổi ví của An.</p>
    {reference && <InspectCardsDialog inspect={{ ...game.reference, reviewOnly: true }} onClose={() => setReference(false)}/>}
  </section>;
}
