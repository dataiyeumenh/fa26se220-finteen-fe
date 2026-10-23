import { Fragment, useEffect, useRef, useState } from "react";
import { gradeRound, timelineAt, timelineResult } from "./compoundTimelineRules";
import "./compound-timeline.css";
// Khung COMPOUND_TIMELINE: chữ, số, đáp án, ảnh đều đọc từ game.config (JSON chương) — khung không giữ nội dung.
const cash = (n) => `${n.toLocaleString("vi-VN")}đ`;
const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => values[key]);
export function CompoundTimelineMiniGame({
  game = {},
  initialResult,
  onProgress,
  onComplete,
  className = "",
}) {
  const config = game.config;
  const { rounds, questions: allQuestions, texts, timeline } = config;
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
      rounds.map((_, n) => [
        n,
        allQuestions
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
      ...timelineResult(config, history),
      visitedYears: visited,
      ui: { round, year, visited, answers, inspected },
    });
  }, [config, round, year, visited, answers, inspected, history]);
  const step = rounds[round];
  const lastRound = rounds.length - 1;
  const questions = allQuestions.filter((q) => q.round === round);
  const mustVisit = step.mustVisitYears || [];
  const factIds = (step.facts || []).map((f) => f.id);
  const complete =
    questions.every(
      (q) => answers[q.id] !== undefined && String(answers[q.id]).trim() !== "",
    ) &&
    mustVisit.every((n) => visited.includes(n)) &&
    factIds.every((id) => inspected.includes(id));
  const result = timelineResult(config, history);
  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined && String(answers[q.id]).trim() !== "",
  ).length;
  const missingYears = mustVisit.filter((n) => !visited.includes(n));
  const missingCards = factIds.filter((id) => !inspected.includes(id));
  const nextTask = checked[round]
    ? texts.taskChecked
    : missingYears.length
      ? fill(texts.taskVisitYears, {
          years: missingYears
            .map((n) => fill(texts.taskYear, { n }))
            .join(texts.taskYearJoin),
        })
      : missingCards.length
        ? fill(texts.taskOpenFacts, { n: missingCards.length })
        : answeredCount < questions.length
          ? fill(texts.taskAnswer, {
              answered: answeredCount,
              total: questions.length,
            })
          : texts.taskReady;
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
  const years = timeline.years;
  const activeFactData = step.facts?.find((f) => f.id === activeFact);
  return (
    <section
      className={`compound-game ${className}`}
      aria-label={game.title || "Compound Timeline"}
    >
      <header>
        <span>{config.eyebrow}</span>
        <h2>{config.heading}</h2>
        <p>{config.intro}</p>
      </header>
      <ol className="compound-stepper" aria-label={texts.progressLabel}>
        {rounds.map(({ label }, i) => (
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
        {fill(texts.roundTitle, { n: round + 1, label: step.label })}
      </h3>
      <aside className="compound-mission">
        <img src={step.mission.image} alt="" />
        <div>
          <span>{texts.missionEyebrow}</span>
          <h4>{step.mission.title}</h4>
          <p>{step.mission.text}</p>
        </div>
      </aside>
      <div className="compound-howto" aria-label={texts.howtoLabel}>
        {config.howto.map((label, i) => (
          <span key={label}>
            <b>{i + 1}</b> {label}
          </span>
        ))}
      </div>
      {step.view === "timeline" && (
        <div className="compound-panel">
          <p>{step.intro}</p>
          <label htmlFor="compound-year">
            {fill(step.yearLabel, { year })}
          </label>
          <input
            id="compound-year"
            type="range"
            min={years[0]}
            max={years[years.length - 1]}
            step="1"
            value={year}
            onChange={(e) => inspectYear(Number(e.target.value))}
          />
          <div className="compound-actions">
            {years.map((n) => (
              <button
                key={n}
                aria-pressed={n === year}
                onClick={() => inspectYear(n)}
              >
                {fill(texts.yearButton, { n })}
                {visited.includes(n) ? " ✓" : ""}
              </button>
            ))}
          </div>
          <output className="compound-amount" htmlFor="compound-year">
            {cash(timelineAt(year, timeline).compound)}
          </output>
          <p>{step.note}</p>
        </div>
      )}
      {step.view === "table" && (
        <div className="compound-panel">
          <table>
            <caption>{step.caption}</caption>
            <thead>
              <tr>
                {step.columns.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {years.map((n) => (
                <tr key={n}>
                  <th>{fill(texts.yearButton, { n })}</th>
                  <td>{cash(timelineAt(n, timeline).simple)}</td>
                  <td>{cash(timelineAt(n, timeline).compound)}</td>
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
                {step.help.title}
                <small>{step.help.hint}</small>
              </span>
              <span className="compound-help-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="compound-interest-answers">
              {step.help.items.map((item) => (
                <article key={item.number}>
                  <span>{item.number}</span>
                  <h4>{item.title}</h4>
                  <p>
                    {item.text} <strong>{item.strong}</strong>.
                  </p>
                </article>
              ))}
            </div>
            <p className="compound-interest-tip">{step.help.tip}</p>
          </details>
        </div>
      )}
      {step.view === "cards" && (
        <div className="compound-values">
          {step.cards.map((card) => (
            <article key={card.title}>
              <img src={card.image} alt="" />
              <h4>{card.title}</h4>
              <strong>{card.amount}</strong>
              <p>{card.note}</p>
            </article>
          ))}
        </div>
      )}
      {step.view === "facts" && (
        <>
          <div className="compound-panel">
            <h4>{step.title}</h4>
            <p>{step.intro}</p>
            <div className="compound-actions">
              {step.facts.map(({ id, label }) => (
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
            {activeFactData && (
              <article className="compound-fact">
                <img src={activeFactData.image} alt="" />
                <h4>{activeFactData.label}</h4>
                <p>{activeFactData.text}</p>
              </article>
            )}
          </div>
          <aside
            className="ch5-course-reference"
            aria-label={step.reference.label}
          >
            <img src={step.reference.image} alt="" />
            <div>
              <span>{step.reference.eyebrow}</span>
              <h4>{step.reference.title}</h4>
              <p>{step.reference.text}</p>
            </div>
          </aside>
        </>
      )}
      <div className="compound-answer-heading">
        <span>{texts.answerEyebrow}</span>
        <b>
          {fill(texts.answeredCount, {
            answered: answeredCount,
            total: questions.length,
          })}
        </b>
      </div>
      {step.formula && (
        <details className="compound-formula">
          <summary>{step.formula.title}</summary>
          {step.formula.paragraphs.map((lines, i) => (
            <p key={i}>
              {lines.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </p>
          ))}
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
                {texts.moneyLabel}
                <span className="compound-money-input">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    placeholder={texts.moneyPlaceholder}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => change(q.id, e.target.value)}
                  />
                  <span aria-hidden="true">đ</span>
                </span>
                {String(answers[q.id] ?? "").trim() !== "" && (
                  <output className="compound-money-preview">
                    {fill(texts.moneyPreview, {
                      amount: cash(Number(answers[q.id])),
                    })}
                  </output>
                )}
              </label>
            )}
            {checked[round] && (
              <p className={history[q.id]?.finalCorrect ? "correct" : "retry"}>
                {history[q.id]?.finalCorrect ? texts.correct : texts.retry}
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
              ? texts.roundAllCorrect
              : texts.roundSomeWrong}{" "}
            {texts.roundLocked}
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
          {texts.back}
        </button>
        <button
          className="compound-check"
          disabled={!complete || checked[round]}
          onClick={() => {
            if (checked[round] || !complete) return;
            const nextHistory = gradeRound(
              allQuestions,
              round,
              answers,
              history,
              inspected,
            );
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
          {texts.check}
        </button>
        <button
          className="compound-next"
          disabled={!checked[round]}
          onClick={() => {
            if (round < lastRound) move(round + 1);
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
          {round === lastRound ? texts.finish : texts.next}
        </button>
      </footer>
      <p className="compound-note">{texts.note}</p>
    </section>
  );
}
