import { useEffect, useRef, useState } from "react";
import {
  challenges,
  gradeRound,
  timelineAt,
  timelineResult,
} from "./compoundTimelineRules";
import "./compound-timeline.css";
const BASE = "/images/finteen-v2/chapter-05/asset-mini-game/compound-timeline";
const cash = (n) => `${n.toLocaleString("vi-VN")}đ`;
const steps = [
  "Mốc thời gian",
  "Hai cách tính lãi",
  "Tiền và sức mua",
  "Ngày cần tiền",
];
const missions = [
  [
    "Đi một vòng cùng tiền của bạn",
    "Bấm Năm 1 rồi Năm 2 để xem tiền thay đổi. Sau đó chọn câu trả lời bên dưới.",
    "time-calendar",
  ],
  [
    "Hai bảng tăng tiền khác nhau thế nào?",
    "Nhìn số tiền ở bảng X và Y. Ghép cách tính cho từng bảng, rồi tính phần chênh lệch.",
    "nominal-money",
  ],
  [
    "Một năm nữa, mình có mua được không?",
    "So số tiền bạn có với giá của cùng món hàng. Chọn kết quả và lý do của bạn.",
    "purchasing-power-basket",
  ],
  [
    "Giúp An chuẩn bị tiền học",
    "So sánh tài khoản A và tài khoản B, rồi đối chiếu lịch đóng học phí bên dưới. Nhập số tiền bằng đồng, không cần dấu chấm. Ví dụ: 20000 là 20.000đ.",
    "flexible-account",
  ],
];
const facts = {
  A: [
    "flexible-account",
    "Tài khoản A · Rút linh hoạt",
    "Vốn 1.000.000đ, lãi đơn minh họa 3%/năm, phí 5.000đ/tháng. Có thể rút khi cần.",
  ],
  B: [
    "term-account",
    "Tài khoản B · Kỳ hạn 12 tháng",
    "Vốn 1.000.000đ, lãi niêm yết 6%/năm nếu đủ hạn, không phí. Rút sau 3 tháng áp dụng 2%/năm.",
  ],
};
export function CompoundTimelineMiniGame({
  game = {},
  initialResult,
  onProgress,
  onComplete,
  className = "",
}) {
  const saved = initialResult?.ui;
  const [round, setRound] = useState(saved?.round ?? 0);
  const [year, setYear] = useState(saved?.year ?? 0);
  const [visited, setVisited] = useState(
    saved?.visited || initialResult?.visitedYears || [],
  );
  const [answers, setAnswers] = useState(
    () =>
      saved?.answers ||
      Object.fromEntries(
        Object.entries(initialResult?.answers || {}).map(([id, item]) => [
          id,
          item.answer,
        ]),
      ),
  );
  const [history, setHistory] = useState(initialResult?.answers || {});
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(
      [0, 1, 2, 3].map((n) => [
        n,
        challenges
          .filter((q) => q.round === n)
          .every((q) => Boolean(initialResult?.answers?.[q.id])),
      ]),
    ),
  );
  const [inspected, setInspected] = useState(saved?.inspected || []);
  const [activeFact, setActiveFact] = useState(null);
  const submitted = useRef(false);
  const titleRef = useRef(null);
  const feedbackRef = useRef(null);
  const progressCallback = useRef(onProgress);
  useEffect(() => {
    progressCallback.current = onProgress;
  }, [onProgress]);
  useEffect(() => {
    progressCallback.current?.({
      ...timelineResult(history),
      visitedYears: visited,
      ui: { round, year, visited, answers, inspected },
    });
  }, [round, year, visited, answers, inspected, history]);
  const questions = challenges.filter((q) => q.round === round);
  const complete =
    questions.every(
      (q) => answers[q.id] !== undefined && String(answers[q.id]).trim() !== "",
    ) &&
    (round !== 0 || [1, 2].every((n) => visited.includes(n))) &&
    (round !== 3 || ["A", "B"].every((id) => inspected.includes(id)));
  const result = timelineResult(history);
  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined && String(answers[q.id]).trim() !== "",
  ).length;
  const missingYears = [1, 2].filter((n) => !visited.includes(n));
  const missingCards = ["A", "B"].filter((id) => !inspected.includes(id));
  const nextTask = checked[round]
    ? "Đã ghi nhận câu trả lời. Đọc giải thích rồi bấm Tiếp tục."
    : round === 0 && missingYears.length
      ? `Hãy ghé ${missingYears.map((n) => `năm ${n}`).join(" và ")} trước nhé.`
      : round === 3 && missingCards.length
        ? `Còn ${missingCards.length} thẻ tài khoản chưa mở. Bấm các thẻ phía trên để xem dữ kiện.`
        : answeredCount < questions.length
          ? `Bạn đã trả lời ${answeredCount}/${questions.length} câu. Hoàn thành các câu còn lại rồi bấm Kiểm tra.`
          : "Đã điền đủ! Bấm Kiểm tra để xem kết quả.";
  function move(next) {
    setRound(next);
    setActiveFact(null);
    requestAnimationFrame(() => {
      titleRef.current?.focus();
      titleRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function change(id, answer) {
    if (history[id]) return;
    setAnswers((prev) => ({ ...prev, [id]: answer }));
    setChecked((prev) => ({ ...prev, [round]: false }));
  }
  function inspectYear(next) {
    setYear(next);
    setVisited((prev) => [...new Set([...prev, next])]);
  }
  return (
    <section
      className={`compound-game ${className}`}
      aria-label={game.title || "Compound Timeline"}
    >
      <header>
        <span>CHƯƠNG 5 · COMPOUND TIMELINE</span>
        <h2>Cỗ máy thời gian của tiền</h2>
        <p>
          Cùng An thử 4 nhiệm vụ nhỏ. Tiền trong bài tập là giả lập; ví của An
          vẫn giữ 1.000.000đ.
        </p>
      </header>
      <ol className="compound-stepper" aria-label="Tiến trình">
        {steps.map((label, i) => (
          <li
            key={label}
            aria-current={round === i ? "step" : undefined}
            className={checked[i] ? "is-done" : ""}
          >
            <span>{checked[i] ? "✓" : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <h3 ref={titleRef} tabIndex={-1}>
        Vòng {round + 1}: {steps[round]}
      </h3>
      <aside className="compound-mission">
        <img src={`${BASE}/${missions[round][2]}.png`} alt="" />
        <div>
          <span>NHIỆM VỤ CỦA BẠN</span>
          <h4>{missions[round][0]}</h4>
          <p>{missions[round][1]}</p>
        </div>
      </aside>
      <div className="compound-howto" aria-label="Cách chơi">
        <span>
          <b>1</b> Xem dữ kiện
        </span>
        <span>
          <b>2</b> Trả lời
        </span>
        <span>
          <b>3</b> Bấm Kiểm tra
        </span>
      </div>
      {round === 0 && (
        <div className="compound-panel">
          <p>
            Vốn 1.000.000đ · lãi kép cố định 5%/năm. Hãy ghé cả năm 1 và năm 2.
          </p>
          <label htmlFor="compound-year">Mốc hiện tại: năm {year}</label>
          <input
            id="compound-year"
            type="range"
            min="0"
            max="2"
            step="1"
            value={year}
            onChange={(e) => inspectYear(Number(e.target.value))}
          />
          <div className="compound-actions">
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                aria-pressed={n === year}
                onClick={() => inspectYear(n)}
              >
                Năm {n}
                {visited.includes(n) ? " ✓" : ""}
              </button>
            ))}
          </div>
          <output className="compound-amount" htmlFor="compound-year">
            {cash(timelineAt(year).compound)}
          </output>
          <p>
            Mô hình chưa xét phí, thuế hay biến động. Mức 5% này không phải lãi
            A hoặc B.
          </p>
        </div>
      )}
      {round === 1 && (
        <div className="compound-panel">
          <table>
            <caption>Cùng vốn 1.000.000đ và mức 5%/năm</caption>
            <thead>
              <tr>
                <th>Mốc</th>
                <th>Bảng X</th>
                <th>Bảng Y</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((n) => (
                <tr key={n}>
                  <th>Năm {n}</th>
                  <td>{cash(timelineAt(n).simple)}</td>
                  <td>{cash(timelineAt(n).compound)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <details
            className="compound-interest-help"
            onToggle={(e) => {
              if (e.currentTarget.open)
                setInspected((prev) => [
                  ...new Set([...prev, "interest-help"]),
                ]);
            }}
          >
            <summary>
              <span className="compound-help-icon" aria-hidden="true">
                ?
              </span>
              <span>
                Hai cách tính khác nhau ở đâu?
                <small>Nhấn để khám phá lãi đơn và lãi kép</small>
              </span>
              <span className="compound-help-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="compound-interest-answers">
              <article>
                <span>01</span>
                <h4>Lãi đơn</h4>
                <p>
                  Tiền lãi mỗi năm chỉ được tính trên{" "}
                  <strong>số tiền gửi ban đầu</strong>.
                </p>
              </article>
              <article>
                <span>02</span>
                <h4>Lãi kép</h4>
                <p>
                  Tiền lãi mỗi năm được tính trên{" "}
                  <strong>tiền gửi ban đầu và cả phần lãi đã tích lũy</strong>.
                </p>
              </article>
            </div>
            <p className="compound-interest-tip">
              Hãy so số tiền tăng thêm ở từng năm trong hai bảng để tìm cách
              tính phù hợp.
            </p>
          </details>
        </div>
      )}
      {round === 2 && (
        <div className="compound-values">
          <article>
            <img src={`${BASE}/nominal-money.png`} alt="" />
            <h4>Tiền sau một năm</h4>
            <strong>1.050.000đ</strong>
            <p>Vốn 1.000.000đ · tăng 5%</p>
          </article>
          <article>
            <img src={`${BASE}/purchasing-power-basket.png`} alt="" />
            <h4>Cùng món hàng</h4>
            <strong>1.080.000đ</strong>
            <p>Giá cũ 1.000.000đ · tăng 8%</p>
          </article>
        </div>
      )}
      {round === 3 && (
        <>
          <div className="compound-panel">
            <h4>So sánh hai loại tài khoản</h4>
            <p>
              A là tài khoản rút linh hoạt; B là tài khoản gửi có kỳ hạn 12
              tháng. Mở từng thẻ để xem lãi suất, phí và điều kiện rút.
            </p>
            <div className="compound-actions">
              {Object.entries(facts).map(([id, [, label]]) => (
                <button
                  key={id}
                  aria-label={label}
                  onClick={() => {
                    setActiveFact(id);
                    setInspected((prev) => [...new Set([...prev, id])]);
                  }}
                >
                  {label}
                  {inspected.includes(id) ? " ✓" : ""}
                </button>
              ))}
            </div>
            {activeFact && (
              <article className="compound-fact">
                <img src={`${BASE}/${facts[activeFact][0]}.png`} alt="" />
                <h4>{facts[activeFact][1]}</h4>
                <p>{facts[activeFact][2]}</p>
              </article>
            )}
          </div>
          <aside
            className="ch5-course-reference"
            aria-label="Đối chiếu lịch đóng học phí"
          >
            <img src={`${BASE}/time-calendar.png`} alt="" />
            <div>
              <span>MỐC ĐỂ ĐỐI CHIẾU</span>
              <h4>Lịch đóng học phí</h4>
              <p>
                An cần đủ 1.000.000đ vào cuối tháng 3. Hãy dùng thời hạn này để
                tính số tiền có thể rút từ từng tài khoản.
              </p>
            </div>
          </aside>
        </>
      )}
      <div className="compound-answer-heading">
        <span>ĐẾN LƯỢT BẠN</span>
        <b>
          {answeredCount}/{questions.length} câu đã trả lời
        </b>
      </div>
      {round === 3 && (
        <details className="compound-formula">
          <summary>Cần gợi ý cách tính?</summary>
          <p>
            Lãi = tiền ban đầu × lãi suất năm × 3 ÷ 12.
            <br />
            Phí = phí mỗi tháng × 3.
            <br />
            Tiền dùng được = tiền ban đầu + lãi − phí.
            <br />
            Khoản thiếu = học phí − tiền dùng được, nếu kết quả lớn hơn 0.
          </p>
          <p>
            Khi tính, đổi phần trăm thành số: 3% = 0,03; 2% = 0,02. Ba tháng là
            3/12 của một năm.
          </p>
          <p>
            Chú ý: chọn mức lãi phù hợp ngày rút, không chỉ dòng quảng cáo lớn
            nhất.
          </p>
        </details>
      )}
      <div className="compound-questions">
        {questions.map((q) => (
          <fieldset
            key={q.id}
            disabled={Boolean(checked[round])}
            className={
              checked[round]
                ? history[q.id]?.finalCorrect
                  ? "is-correct"
                  : "needs-retry"
                : ""
            }
          >
            <legend>{q.prompt}</legend>
            {q.options ? (
              q.options.map((label) => (
                <label
                  key={label}
                  className={answers[q.id] === label ? "is-selected" : ""}
                >
                  <input
                    type="radio"
                    name={`compound-${q.id}`}
                    checked={answers[q.id] === label}
                    onChange={() => change(q.id, label)}
                  />
                  {label}
                </label>
              ))
            ) : (
              <label>
                Số tiền (đồng)
                <span className="compound-money-input">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder="Nhập số tiền"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => change(q.id, e.target.value)}
                  />
                  <span aria-hidden="true">đ</span>
                </span>
                {String(answers[q.id] ?? "").trim() !== "" && (
                  <output className="compound-money-preview">
                    Bạn nhập: {cash(Number(answers[q.id]))}
                  </output>
                )}
              </label>
            )}
            {checked[round] && (
              <p className={history[q.id]?.finalCorrect ? "correct" : "retry"}>
                {history[q.id]?.finalCorrect ? "✓ Đúng rồi! " : "✗ Chưa đúng. "}
                {q.feedback}
              </p>
            )}
          </fieldset>
        ))}
      </div>
      <div
        ref={feedbackRef}
        className="compound-round-feedback"
        aria-live="polite"
      >
        {checked[round] && (
          <p>
            {questions.every((q) => history[q.id]?.finalCorrect)
              ? "✦ Bạn đã trả lời đúng các câu trong vòng này."
              : "Có câu trả lời chưa đúng. Phần giải thích dưới mỗi câu cho biết cách tính và kết quả đúng."}{" "}
            Câu trả lời đã được ghi nhận và không thể thay đổi.
          </p>
        )}
      </div>
      <div className="compound-next-task" aria-live="polite">
        {nextTask}
      </div>
      <footer className="compound-actions">
        <button
          className="compound-back"
          disabled={round === 0}
          onClick={() => move(round - 1)}
        >
          Quay lại
        </button>
        <button
          className="compound-check"
          disabled={!complete || checked[round]}
          onClick={() => {
            if (checked[round] || !complete) return;
            const nextHistory = gradeRound(round, answers, history, inspected);
            setHistory(nextHistory);
            setChecked((prev) => ({ ...prev, [round]: true }));
            requestAnimationFrame(() =>
              feedbackRef.current?.scrollIntoView({
                block: "nearest",
                behavior: "instant",
              }),
            );
          }}
        >
          Kiểm tra
        </button>
        <button
          className="compound-next"
          disabled={!checked[round]}
          onClick={() => {
            if (round < 3) move(round + 1);
            else if (!submitted.current) {
              submitted.current = true;
              onComplete?.({
                ...result,
                visitedYears: visited,
                ui: { round, year, visited, answers, inspected },
              });
            }
          }}
        >
          {round === 3 ? "Trở lại câu chuyện" : "Tiếp tục"}
        </button>
      </footer>
      <p className="compound-note">
        Mỗi vòng được nộp một lần. Bạn có thể xem lại dữ kiện và giải thích,
        nhưng không sửa câu trả lời sau khi bấm Kiểm tra.
      </p>
    </section>
  );
}
