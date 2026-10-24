import { Fragment, useRef, useState } from "react";
import {
  applyLoanAction,
  cartForecast,
  createLoanState,
  loanApr,
  loanResult,
  loanTotal,
  statementOutcome,
} from "./loanDetectiveRules.js";
import { InspectCardsDialog } from "./ChapterFiveActivities.jsx";
import "./loan-detective.css";
import { loanInputs } from "./miniGameInputs.js";

// Khung LOAN_DETECTIVE: chữ, số, đáp án, ảnh đều đọc từ game.config (JSON chương) — khung không giữ nội dung.
const cash = (n) => `${n.toLocaleString("vi-VN")}đ`;
const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => values[key]);
// Chữ nhiều đoạn: chuỗi = chữ thường, {b} = đậm, {strong} = nhấn, {br} = xuống dòng.
const rich = (parts) =>
  parts.map((part, i) =>
    typeof part === "string" ? (
      <Fragment key={i}>{part}</Fragment>
    ) : part.br ? (
      <br key={i} />
    ) : part.strong ? (
      <strong key={i}>{part.strong}</strong>
    ) : (
      <b key={i}>{part.b}</b>
    ),
  );

export function LoanDetectiveMiniGame({
  game,
  initialResult,
  onProgress,
  onComplete,
}) {
  const config = game.config;
  const { texts, offers, sort, cart, statement: st, card } = config;
  const [state, setState] = useState(
    () => initialResult?.ui || createLoanState(game.rounds),
  );
  const [reviewOffers, setReviewOffers] = useState(false);
  const stateRef = useRef(state);
  const dragRef = useRef(null);
  const heading = useRef(null);
  const submitted = useRef(false);
  const { round, totals, sorted, selected, history, feedback } = state;
  const step = config.rounds[round];
  const finished = Boolean(state.submittedRounds[round]);
  const basket = cartForecast(config, state.basket);
  const statement = statementOutcome(config, state.statementChoice);
  const trayName = (id) => sort.trays.find((tray) => tray.id === id)?.label;
  const dispatch = (action) => {
    const next = applyLoanAction(config, stateRef.current, action);
    if (next === stateRef.current) return;
    stateRef.current = next;
    setState(next);
    onProgress?.({ ...loanResult(config, next.history, game.rounds), ui: next });
  };
  const beginDrag = (event, id) => {
    dragRef.current = id;
    dispatch({ type: "SELECT", id });
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  };
  const drop = (event, target) => {
    event.preventDefault();
    event.stopPropagation();
    const id =
      event.dataTransfer.getData("text/plain") ||
      dragRef.current ||
      stateRef.current.selected;
    dragRef.current = null;
    dispatch({ type: "SORT", id, target });
  };
  const offerCard = (offer, placed = false) => (
    <button
      key={offer.id}
      className={`loan-offer-card${placed ? " is-placed" : ""}`}
      data-offer={offer.id}
      draggable={!finished}
      onDragStart={(event) => beginDrag(event, offer.id)}
      disabled={finished}
      aria-pressed={selected === offer.id}
      onClick={() => dispatch({ type: "SELECT", id: offer.id })}
    >
      {!placed && <img src={config.offerImage} alt="" />}
      <b>{fill(texts.offerName, { id: offer.id })}</b>
      <span>
        {fill(card.perPeriod, {
          installment: cash(offer.installment),
          interval: config.intervalLabels[offer.intervalMonths],
        })}
      </span>
      <small>{fill(card.received, { amount: cash(offer.received) })}</small>
      <small>{fill(card.total, { amount: cash(loanTotal(offer)) })}</small>
      {!placed && (
        <>
          <small>
            {fill(card.schedule, {
              periods: offer.periods,
              months: offer.periods * offer.intervalMonths,
            })}
          </small>
          <small>
            {fill(card.apr, {
              apr: loanApr(offer).toFixed(1).replace(".", ","),
            })}
          </small>
        </>
      )}
      <span className="loan-placement-label">
        {finished
          ? history[`sort${offer.id}`]?.finalCorrect
            ? texts.correct
            : texts.incorrect
          : selected === offer.id
            ? card.holding
            : placed
              ? card.placed
              : card.idle}
      </span>
    </button>
  );
  const lastRound = game.rounds.at(-1);

  return (
    <section
      className={`loan-game loan-casual${step.neutral ? " loan-neutral" : ""}`}
      aria-label={config.heading}
    >
      <header className="loan-heading">
        <img src={step.picture} alt="" />
        <div>
          <span>{config.eyebrow}</span>
          <h2>{config.heading}</h2>
          <p>{config.subheading}</p>
        </div>
      </header>
      <ol className="loan-steps" aria-label={texts.stepsLabel}>
        {config.rounds.map(({ title }, i) => (
          <li
            key={title}
            className={round === i ? "active" : ""}
            aria-current={round === i ? "step" : undefined}
          >
            <span>{i + 1}</span>
            {title}
          </li>
        ))}
      </ol>
      <div className="loan-round-title">
        <h3 ref={heading} tabIndex={-1}>
          {fill(texts.roundTitle, { n: round + 1, title: step.title })}
        </h3>
        <span>{finished ? texts.submitted : texts.notSubmitted}</span>
      </div>
      <p className="loan-instruction">
        <b>{texts.howto}</b>
        {step.instruction}
      </p>

      {step.view === "totals" && (
        <div className="loan-workbench">
          <div className="loan-total-cards">
            {offers.map((offer) => {
              const result = history[`receipt${offer.id}`];
              return (
                <article
                  key={offer.id}
                  className={
                    result
                      ? result.finalCorrect
                        ? "is-correct"
                        : "is-incorrect"
                      : ""
                  }
                >
                  <h4>{fill(texts.offerName, { id: offer.id })}</h4>
                  <label htmlFor={`total-${offer.id}`}>
                    {config.totals.inputLabel}
                    <input
                      id={`total-${offer.id}`}
                      data-total-input={offer.id}
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      placeholder={config.totals.placeholder}
                      value={totals[offer.id] ?? ""}
                      disabled={finished}
                      onChange={(event) =>
                        dispatch({
                          type: "TOTAL_DRAFT",
                          id: offer.id,
                          value: event.target.value,
                        })
                      }
                    />
                  </label>
                  {result && (
                    <div
                      data-total-explanation={offer.id}
                      className={
                        result.finalCorrect
                          ? "loan-answer-success"
                          : "loan-answer-hint"
                      }
                    >
                      <b>
                        {result.finalCorrect ? texts.correct : texts.incorrect}
                      </b>
                      <p>
                        {fill(config.totals.explanation, {
                          periods: offer.periods,
                          installment: cash(offer.installment),
                        })}{" "}
                        <strong>{cash(loanTotal(offer))}</strong>.
                      </p>
                      {config.totals.notes[offer.id] && (
                        <p>{config.totals.notes[offer.id]}</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <button data-review-offers onClick={() => setReviewOffers(true)}>
            {config.totals.review}
          </button>
          <details className="loan-calc-help">
            <summary>{config.totals.helpTitle}</summary>
            <p>{config.totals.help}</p>
          </details>
          <button
            data-submit-totals
            className="loan-primary"
            disabled={
              finished ||
              !offers.every(
                (offer) =>
                  String(totals[offer.id] ?? "").trim() &&
                  Number.isFinite(Number(totals[offer.id])) &&
                  Number(totals[offer.id]) >= 0,
              )
            }
            onClick={() => dispatch({ type: "TOTAL" })}
          >
            {finished ? texts.submitted : config.totals.submit}
          </button>
          {finished && (
            <p className="loan-comparison-note">{config.totals.comparison}</p>
          )}
        </div>
      )}

      {step.view === "sort" && (
        <div className="loan-workbench loan-sort-board">
          <aside className="loan-budget-note">{rich(sort.budgetNote)}</aside>
          <div className="loan-placement-status" aria-live="polite">
            <b>
              {fill(sort.placedCount, {
                placed: Object.keys(sorted).length,
                total: offers.length,
              })}
            </b>
            <span>
              {finished
                ? sort.lockedStatus
                : selected
                  ? fill(sort.holdingStatus, { id: selected })
                  : sort.idleStatus}
            </span>
          </div>
          <div className="loan-sort-pool">
            {offers
              .filter((offer) => !sorted[offer.id])
              .map((offer) => offerCard(offer))}
          </div>
          {Object.keys(sorted).length === offers.length && !finished && (
            <p className="loan-note">{sort.allPlaced}</p>
          )}
          <div className="loan-sort-zones">
            {sort.trays.map(({ id, label, help }) => (
              <article
                key={id}
                className={`loan-sort-zone${selected && !finished ? " can-place" : ""}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, id)}
              >
                <h4>{label}</h4>
                <p>{help}</p>
                <div className="loan-zone-cards">
                  {offers
                    .filter((offer) => sorted[offer.id] === id)
                    .map((offer) => (
                      <div key={offer.id}>
                        {offerCard(offer, true)}
                        {!finished && (
                          <button
                            className="loan-remove-card"
                            data-unsort={offer.id}
                            onClick={() =>
                              dispatch({ type: "UNSORT", id: offer.id })
                            }
                          >
                            {sort.removeCard}
                          </button>
                        )}
                      </div>
                    ))}
                </div>
                <button
                  data-tray={id}
                  className="loan-place-button"
                  disabled={finished || !selected}
                  onClick={() =>
                    dispatch({ type: "SORT", id: selected, target: id })
                  }
                >
                  {selected
                    ? fill(sort.placeHere, { id: selected })
                    : Object.values(sorted).includes(id)
                      ? sort.placeMore
                      : sort.emptyTray}
                </button>
              </article>
            ))}
          </div>
          <button
            data-submit-sort
            className="loan-primary"
            disabled={finished || Object.keys(sorted).length !== offers.length}
            onClick={() => dispatch({ type: "SUBMIT_SORT" })}
          >
            {finished ? texts.submitted : sort.submit}
          </button>
          {finished && (
            <div className="loan-sort-explanations">
              <h4>{sort.answersTitle}</h4>
              {offers.map((offer) => (
                <article key={offer.id} data-sort-explanation={offer.id}>
                  <b>
                    {history[`sort${offer.id}`].finalCorrect
                      ? texts.correct
                      : texts.incorrect}{" "}
                    · {fill(texts.offerName, { id: offer.id })}
                  </b>
                  <p>{fill(sort.yourTray, { tray: trayName(sorted[offer.id]) })}</p>
                  <p>
                    <strong>
                      {fill(sort.correctTray, {
                        tray: trayName(sort.targets[offer.id]),
                      })}
                    </strong>{" "}
                    {sort.reasons[offer.id]}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {step.view === "cart" && (
        <div className="loan-workbench">
          <aside className="loan-budget-note">{rich(cart.budgetNote)}</aside>
          <div className="loan-shop">
            {cart.items.map((item) => (
              <article
                key={item.id}
                className={state.basket.includes(item.id) ? "in-basket" : ""}
              >
                <img className="loan-product-image" src={item.image} alt="" />
                <h4>{item.label}</h4>
                <p>{fill(cart.price, { price: cash(item.price) })}</p>
                <strong>
                  {fill(cart.installment, {
                    installment: cash(item.installment),
                  })}
                </strong>
                <button
                  data-item={item.id}
                  aria-pressed={state.basket.includes(item.id)}
                  disabled={finished}
                  onClick={() => dispatch({ type: "TOGGLE_ITEM", id: item.id })}
                >
                  {state.basket.includes(item.id) ? cart.remove : cart.add}
                </button>
              </article>
            ))}
          </div>
          <div className="loan-basket" aria-live="polite">
            <h4>{fill(cart.basketTitle, { count: state.basket.length })}</h4>
            <p>
              {basket.items.length
                ? basket.items.map((item) => item.label).join(cart.basketJoin)
                : cart.basketEmpty}
            </p>
            <p>
              {cart.monthlyLabel}
              <strong>{cash(basket.monthly)}</strong>
            </p>
          </div>
          <button
            data-buy-cart
            className="loan-primary"
            disabled={finished || !state.basket.length}
            onClick={() => dispatch({ type: "BUY_CART" })}
          >
            {finished ? cart.submitted : cart.submit}
          </button>
          {finished && (
            <div data-cart-result>
              <div className="loan-plan-months">
                {basket.months.map((month) => (
                  <article key={month.month}>
                    <h4>{fill(cart.month, { month: month.month })}</h4>
                    <p>{fill(cart.have, { amount: cash(month.available) })}</p>
                    <p>{fill(cart.payment, { amount: cash(month.payment) })}</p>
                    <p>{fill(cart.other, { amount: cash(month.other) })}</p>
                    <output>
                      {month.remaining >= 0 ? cart.remaining : cart.short}{" "}
                      <b>{cash(Math.abs(month.remaining))}</b>
                    </output>
                  </article>
                ))}
              </div>
              <div className="loan-comparison-note">
                <p>{basket.meetsNeed ? cart.needOk : cart.needBad}</p>
                <p>{basket.affordable ? cart.budgetOk : cart.budgetBad}</p>
                <p>{cart.example}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {step.view === "statement" && (
        <div className="loan-workbench">
          <h4>{st.question}</h4>
          <dl className="loan-statement-facts">
            {st.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <aside className="loan-budget-note">
            <b>{st.goalsTitle}</b>
            <ul>
              {st.goals.map((goal, i) => (
                <li key={i}>{rich(goal)}</li>
              ))}
            </ul>
          </aside>
          <div className="loan-comparison-note">
            <b>{st.ruleTitle}</b>
            <p>{rich(st.rule)}</p>
            <p className="loan-note">{st.ruleNote}</p>
          </div>
          <div className="loan-statement-options">
            {st.options.map((option) => (
              <button
                key={option.id}
                data-statement-choice={option.id}
                disabled={state.statementStep > 0}
                aria-pressed={state.statementChoice === option.id}
                onClick={() =>
                  dispatch({ type: "STATEMENT_CHOICE", id: option.id })
                }
              >
                <span aria-hidden="true">{st.optionIcon}</span>
                <b>{option.label}</b>
                <strong>{cash(option.amount)}</strong>
              </button>
            ))}
          </div>
          {state.statementStep === 0 && (
            <button
              data-confirm-statement
              className="loan-primary"
              disabled={!statement}
              onClick={() => dispatch({ type: "CONFIRM_STATEMENT" })}
            >
              {st.confirm}
            </button>
          )}
          {state.statementStep >= 1 && (
            <div className="loan-statement-events" aria-live="polite">
              <article>
                <span className="loan-event-number">1</span>
                <div>
                  <h4>{st.todayTitle}</h4>
                  <dl className="loan-statement-calculation">
                    <div>
                      <dt>{st.walletStart}</dt>
                      <dd>{st.walletStartValue}</dd>
                    </div>
                    <div>
                      <dt>{st.pay}</dt>
                      <dd>{fill(st.payValue, { amount: cash(statement.amount) })}</dd>
                    </div>
                    <div>
                      <dt>{st.walletLeft}</dt>
                      <dd>{cash(statement.walletLeft)}</dd>
                    </div>
                  </dl>
                </div>
              </article>
              <article data-living-event>
                <span className="loan-event-number">2</span>
                <div>
                  <h4>{st.livingTitle}</h4>
                  <p>
                    {st.livingNeed}{" "}
                    {statement.livingCovered
                      ? fill(st.livingOk, {
                          amount: cash(statement.afterLiving),
                        })
                      : fill(st.livingShort, {
                          wallet: cash(statement.walletLeft),
                          shortfall: cash(statement.livingShortfall),
                        })}
                  </p>
                </div>
              </article>
              {state.statementStep === 1 && (
                <button
                  data-reveal-statement
                  className="loan-primary"
                  onClick={() => dispatch({ type: "REVEAL_STATEMENT" })}
                >
                  {st.reveal}
                </button>
              )}
              {finished && (
                <>
                  <article data-debt-event>
                    <span className="loan-event-number">3</span>
                    <div>
                      <h4>{st.debtTitle}</h4>
                      <dl className="loan-statement-calculation">
                        <div>
                          <dt>{st.debtLeft}</dt>
                          <dd>{cash(statement.debtLeft)}</dd>
                        </div>
                        <div>
                          <dt>{st.interest}</dt>
                          <dd>
                            {fill(st.interestValue, {
                              amount: cash(statement.interest),
                            })}
                          </dd>
                        </div>
                        <div>
                          <dt>{st.nextDebt}</dt>
                          <dd>{cash(statement.nextDebt)}</dd>
                        </div>
                      </dl>
                      <p className="loan-note">
                        {statement.livingCovered
                          ? fill(st.noteOk, {
                              amount: cash(statement.afterLiving),
                            })
                          : fill(st.noteShort, {
                              amount: cash(statement.livingShortfall),
                            })}
                      </p>
                    </div>
                  </article>
                  <div className="loan-comparison-note">
                    <p>
                      {statement.livingCovered
                        ? st.livingResultOk
                        : st.livingResultBad}
                    </p>
                    <p>
                      {fill(
                        statement.costCovered
                          ? st.costResultOk
                          : st.costResultBad,
                        { amount: cash(statement.interest) },
                      )}
                    </p>
                    <p>{st.summary}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <p className="loan-feedback" role="status">
        {feedback || step.idleFeedback}
      </p>
      <footer className="loan-footer">
        <span>{finished ? texts.footerDone : texts.footerIdle}</span>
        <button
          className="loan-primary"
          disabled={!finished}
          onClick={() => {
            if (round < lastRound) {
              dispatch({ type: "ROUND", round: round + 1 });
              requestAnimationFrame(() => heading.current?.focus());
              return;
            }
            if (submitted.current) return;
            submitted.current = true;
            onComplete({
              ...loanResult(config, history, game.rounds),
              inputs: loanInputs(config, state, game.rounds),
              ui: state,
            });
          }}
        >
          {round === lastRound ? texts.finish : texts.next}
        </button>
      </footer>
      <p className="loan-note">{texts.note}</p>
      {reviewOffers && game.reference && (
        <InspectCardsDialog
          inspect={{ ...game.reference, reviewOnly: true }}
          onClose={() => setReviewOffers(false)}
        />
      )}
    </section>
  );
}
