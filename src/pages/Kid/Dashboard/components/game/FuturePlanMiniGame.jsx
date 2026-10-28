import { useRef, useState } from "react";
import { InspectCardsDialog } from "./ChapterFiveActivities.jsx";
import {
  planProjection,
  allocationValue,
  applyFutureAction,
  availableBudget,
  budgetFeedback,
  restoreFutureState,
  futureResult,
  planBalance,
} from "./futurePlanRules.js";
import "./future-plan.css";
import { futureInputs } from "./miniGameInputs.js";
// Khung FUTURE_PLAN: chữ, số, đáp án, ảnh đều đọc từ game.config (JSON chương) — khung không giữ nội dung.

const cash = (amount) => `${amount.toLocaleString("vi-VN")}đ`;
const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => values[key]);
function Counter({
  label,
  value,
  unit,
  step,
  maxValue = Infinity,
  disabled,
  onChange,
  texts,
}) {
  return (
    <div className="future-counter">
      <button
        aria-label={fill(texts.decrease, { label })}
        disabled={disabled || value === 0}
        onClick={() => onChange(-step)}
      >
        −
      </button>
      <output aria-label={label}>
        {unit ? value : cash(value)}
        {unit && <small>{unit}</small>}
      </output>
      <button
        aria-label={fill(texts.increase, { label })}
        disabled={disabled || value + step > maxValue}
        onClick={() => onChange(step)}
      >
        +
      </button>
    </div>
  );
}
export function FuturePlanMiniGame({
  game,
  initialResult,
  onProgress,
  onComplete,
}) {
  const config = game.config;
  const { texts, portfolio: pf, claims: cl, planner: pl } = config;
  const [state, setState] = useState(() =>
    restoreFutureState(config, initialResult?.ui),
  );
  const [reference, setReference] = useState(false);
  const current = useRef(state),
    completed = useRef(false);
  const portfolio = config.mode === "portfolio",
    claims = config.mode === "claims";
  const screen = portfolio ? pf : claims ? cl : pl;
  const projection = planProjection(pl, state.budgets);
  const market = state.market || pf.market.legacy;
  const result = futureResult(config, state),
    values = allocationValue(pf, state.allocation, market);
  const month = pl.months[state.month],
    budget = state.budgets[state.month],
    monthDone = state.submittedMonths[state.month];
  const balance = planBalance(month, budget);
  const budgetLimit = availableBudget(month);
  const dispatch = (action) => {
    const next = applyFutureAction(config, current.current, action);
    if (next === current.current) return;
    current.current = next;
    setState(next);
    onProgress?.(futureResult(config, next));
    if (action.type === "NEXT_MONTH")
      requestAnimationFrame(() =>
        document
          .querySelector("[data-planner]")
          ?.scrollIntoView({ block: "start" }),
      );
    if (action.type === "SUBMIT_ALLOCATION" || action.type === "SUBMIT_MONTH")
      requestAnimationFrame(() =>
        document
          .querySelector(
            action.type === "SUBMIT_ALLOCATION"
              ? "[data-allocation-results]"
              : "[data-month-result]",
          )
          ?.scrollIntoView({ block: "nearest" }),
      );
  };
  const correct = (id) => state.history[id]?.finalCorrect;
  const status = (ok) => (ok ? texts.correct : texts.incorrect);
  const finish = () => {
    if (!result.completed || completed.current) return;
    completed.current = true;
    onComplete({ ...result, inputs: futureInputs(game.config, state) });
  };
  return (
    <section className="future-game" aria-label={game.title}>
      <header className="future-heading">
        <img src={screen.heroImage} alt="" />
        <div>
          <span>{texts.eyebrow}</span>
          <h2>{game.title}</h2>
          <p>{screen.intro}</p>
        </div>
      </header>
      <div className="future-toolbar">
        <span>
          {portfolio || claims
            ? screen.toolbar
            : fill(pl.toolbar, {
                n: state.month + 1,
                total: pl.months.length,
              })}
        </span>
        {game.reference && (
          <button onClick={() => setReference(true)}>
            {texts.referenceButton}
          </button>
        )}
      </div>
      {portfolio ? (
        <>
          <aside className="future-note">
            <b>{pf.noteTitle}</b>
            <p>{pf.noteText}</p>
          </aside>
          <div className="future-pool">
            <span>{pf.poolLabel}</span>
            <strong>{pf.totalPoints - values.total}</strong>
            <div className="future-tokens" aria-hidden="true">
              {Array.from({ length: pf.totalPoints / pf.step }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < (pf.totalPoints - values.total) / pf.step
                      ? "available"
                      : ""
                  }
                />
              ))}
            </div>
          </div>
          <div className="future-baskets">
            {pf.assets.map((asset) => (
              <article key={asset.id}>
                <img src={asset.image} alt="" />
                <h3>{asset.label}</h3>
                <p>{asset.description}</p>
                <Counter
                  label={asset.label}
                  value={state.allocation[asset.id]}
                  unit={pf.unit}
                  step={pf.step}
                  maxValue={
                    state.allocation[asset.id] + pf.totalPoints - values.total
                  }
                  disabled={state.allocationSubmitted}
                  texts={texts}
                  onChange={(delta) =>
                    dispatch({ type: "ALLOCATE", id: asset.id, delta })
                  }
                />
                <b>{cash(state.allocation[asset.id] * pf.pointValue)}</b>
              </article>
            ))}
          </div>
          {!state.allocationSubmitted && (
            <button
              className="future-primary"
              data-submit-allocation
              disabled={values.total !== pf.totalPoints}
              onClick={() => dispatch({ type: "SUBMIT_ALLOCATION" })}
            >
              {pf.submit}
            </button>
          )}
          {state.allocationSubmitted && (
            <div className="future-results" data-allocation-results>
              <h3>{pf.resultsTitle}</h3>
              <p>{pf.resultsIntro}</p>
              <p className="future-fine">{pf.resultsFine}</p>
              <div className="future-market">
                {pf.assets.map((asset) => (
                  <div key={asset.id}>
                    <span>
                      {fill(pf.marketRow, {
                        label: asset.label,
                        sign: market[asset.id] > 0 ? "+" : "",
                        percent: market[asset.id],
                        period: market.period,
                      })}
                    </span>
                    <small>
                      {fill(pf.before, {
                        amount: cash(
                          state.allocation[asset.id] * pf.pointValue,
                        ),
                      })}
                    </small>
                    <b>
                      {fill(pf.after, {
                        amount: cash(
                          state.allocation[asset.id] *
                            pf.pointValue *
                            (1 + market[asset.id] / 100),
                        ),
                      })}
                    </b>
                    <small>
                      {fill(pf.change, {
                        amount: cash(
                          (state.allocation[asset.id] *
                            pf.pointValue *
                            market[asset.id]) /
                            100,
                        ),
                      })}
                    </small>
                  </div>
                ))}
              </div>
              <p>
                {pf.changeLead} <b>{cash(values.delta)}</b>
                {pf.changeMid} <strong>{cash(values.final)}</strong>
                {pf.changeEnd}
              </p>
              <p
                data-result={
                  correct("allocation_near") ? "correct" : "incorrect"
                }
              >
                <b>
                  {status(correct("allocation_near"))} · {pf.nearTitle}
                </b>
                <br />
                {fill(pf.nearLine, { amount: cash(values.nearMoney) })}{" "}
                {correct("allocation_near")
                  ? pf.nearOk
                  : fill(pf.nearShort, {
                      amount: cash(pf.courseCost - values.nearMoney),
                    })}
              </p>
              <p
                data-result={
                  correct("allocation_spread") ? "correct" : "incorrect"
                }
              >
                <b>
                  {status(correct("allocation_spread"))} · {pf.spreadTitle}
                </b>
                <br />
                {pf.spreadText}
              </p>
              <p className="future-fine">{pf.closing}</p>
            </div>
          )}
        </>
      ) : claims ? (
        <>
          <aside className="future-ad">
            <img src={cl.ad.image} alt="" />
            <div>
              <small>{cl.ad.eyebrow}</small>
              <h3>{cl.ad.title}</h3>
              <p>{cl.ad.text}</p>
            </div>
          </aside>
          <h3>{cl.question}</h3>
          <p>{cl.instruction}</p>
          <div className="future-checks">
            {cl.checks.map((check) => {
              const matched = state.checks.includes(check.id) === check.correct;
              return (
                <button
                  key={check.id}
                  data-claim={check.id}
                  aria-pressed={state.checks.includes(check.id)}
                  data-result={
                    state.checksSubmitted
                      ? matched
                        ? "correct"
                        : "incorrect"
                      : undefined
                  }
                  disabled={state.checksSubmitted}
                  onClick={() => dispatch({ type: "CHECK", id: check.id })}
                >
                  <b>{check.label}</b>
                  <small>
                    {state.checksSubmitted
                      ? `${status(matched)}${state.checks.includes(check.id) ? cl.chosen : cl.notChosen}`
                      : state.checks.includes(check.id)
                        ? cl.selected
                        : cl.select}
                    {state.checksSubmitted && <span>{check.detail}</span>}
                  </small>
                </button>
              );
            })}
          </div>
          <button
            className="future-primary"
            data-submit-checks
            disabled={
              state.checksSubmitted || state.checks.length !== cl.pickCount
            }
            onClick={() => dispatch({ type: "SUBMIT_CHECKS" })}
          >
            {state.checksSubmitted ? cl.submitted : cl.submit}
          </button>
        </>
      ) : (
        <div className="future-planner" data-planner>
          <aside className="future-note future-goal-note">
            <b>
              {fill(pl.goalLine, {
                label: pl.goal.label,
                amount: cash(pl.goal.amount),
              })}
            </b>
            <p>
              {pl.goalIntro} {pl.goal.description}
            </p>
            <p>{pl.howto}</p>
          </aside>
          <div className="future-months" aria-label={pl.monthsLabel}>
            {pl.months.map((item, i) => (
              <span
                key={item.id}
                aria-current={state.month === i ? "step" : undefined}
                data-result={
                  state.submittedMonths[i]
                    ? correct(`plan_${item.id}`)
                      ? "correct"
                      : "incorrect"
                    : undefined
                }
              >
                {i + 1}. {item.label}
                {state.submittedMonths[i] && (
                  <small>{status(correct(`plan_${item.id}`))}</small>
                )}
              </span>
            ))}
          </div>
          <h3>{month.label}</h3>
          <p>{month.prompt}</p>
          <div className="future-cashflow">
            <div>
              <span>{pl.incomeLabel}</span>
              <strong>{cash(month.income)}</strong>
            </div>
            <span aria-hidden="true">−</span>
            <div>
              <span>{pl.essentialLabel}</span>
              <strong>{cash(month.essential)}</strong>
            </div>
            <span aria-hidden="true">=</span>
            <div>
              <span>{pl.remainingLabel}</span>
              <strong>{cash(month.income - month.essential)}</strong>
            </div>
          </div>
          <p className="future-fine">{pl.essentialNote}</p>
          <div className="future-budget">
            {[
              ["goal", pl.goalBox],
              ["flexible", pl.flexibleBox],
            ].map(([id, box]) => (
              <article key={id}>
                <img src={box.image} alt="" />
                <h4>{box.title}</h4>
                <Counter
                  label={box.counter}
                  value={budget[id]}
                  step={pl.step}
                  maxValue={budgetLimit}
                  disabled={monthDone}
                  texts={texts}
                  onChange={(delta) => dispatch({ type: "BUDGET", id, delta })}
                />
              </article>
            ))}
          </div>
          <div className="future-balance" aria-live="polite">
            <span>
              {balance < 0
                ? pl.balanceShort
                : balance === 0
                  ? pl.balanceExact
                  : pl.balanceSpare}
            </span>
            <strong>{cash(Math.abs(balance))}</strong>
          </div>
          <p className="future-fine">
            {fill(pl.balanceFormula, { amount: cash(balance) })}
          </p>
          <button
            className="future-primary"
            data-submit-month
            disabled={monthDone}
            onClick={() => dispatch({ type: "SUBMIT_MONTH" })}
          >
            {monthDone ? pl.monthSubmitted : pl.submitMonth}
          </button>
          {monthDone && (
            <div
              className="future-results"
              data-month-result
              data-result={
                correct(`plan_${month.id}`) ? "correct" : "incorrect"
              }
            >
              <b>{status(correct(`plan_${month.id}`))}</b>
              {budgetFeedback(pl, month, budget).map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          )}
          {monthDone && state.month < pl.months.length - 1 && (
            <button
              className="future-primary"
              data-next-month
              onClick={() => dispatch({ type: "NEXT_MONTH" })}
            >
              {pl.nextMonth}
            </button>
          )}
          {result.completed && (
            <aside className="future-note" data-year-plan>
              <b>{pl.year.title}</b>
              <p>{pl.year.intro}</p>
              <div className="future-goal-progress">
                <span>
                  {fill(pl.year.goalLabel, { amount: cash(pl.goal.amount) })}
                </span>
                <progress
                  max={pl.goal.amount}
                  value={Math.min(pl.goal.amount, projection.yearSavings)}
                  aria-label={pl.year.progressLabel}
                />
                <strong>
                  {fill(pl.year.projected, {
                    amount: cash(projection.yearSavings),
                  })}
                </strong>
              </div>
              {!projection.feasible ? (
                <p>
                  <b>{pl.year.infeasibleTitle}</b>{" "}
                  {pl.months.some(
                    (item, i) => planBalance(item, state.budgets[i]) < 0,
                  )
                    ? pl.year.infeasibleOverspent
                    : pl.year.infeasibleNoSaving}{" "}
                  {pl.year.infeasibleEnd}
                </p>
              ) : projection.shortfall > 0 ? (
                <p>
                  {pl.year.shortfallLead} <b>{cash(projection.shortfall)}</b>
                  {fill(pl.year.shortfallMid, {
                    perMonth: cash(state.budgets[0].goal),
                  })}{" "}
                  <b>
                    {fill(pl.year.shortfallMonths, {
                      months: projection.extraMonths,
                    })}
                  </b>
                  {pl.year.shortfallEnd}
                </p>
              ) : (
                <p>{pl.year.enough}</p>
              )}
              <details className="future-calendar-details">
                <summary>{pl.year.detailsSummary}</summary>
                <div className="future-year">
                  {pl.months
                    .flatMap((item, type) =>
                      Array.from({ length: item.yearCount }, () => type),
                    )
                    .map((type, index) => (
                      <div key={index}>
                        <small>
                          {fill(pl.year.monthLabel, { n: index + 1 })}
                        </small>
                        <b>{cash(state.budgets[type].goal)}</b>
                        <span>{pl.months[type].yearLabel}</span>
                      </div>
                    ))}
                </div>
              </details>
              <p>{pl.year.closing}</p>
            </aside>
          )}
        </div>
      )}
      <footer className="future-footer">
        <p>{result.completed ? texts.footerDone : texts.footerOpen}</p>
        <button
          className="future-primary"
          disabled={!result.completed}
          data-future-finish
          onClick={finish}
        >
          {texts.finish}
        </button>
      </footer>
      <p className="future-fine">{texts.disclaimer}</p>
      {reference && (
        <InspectCardsDialog
          inspect={{ ...game.reference, reviewOnly: true }}
          onClose={() => setReference(false)}
        />
      )}
    </section>
  );
}
