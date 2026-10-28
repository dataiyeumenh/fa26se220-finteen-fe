import { useRef, useState } from "react";
import { InspectCardsDialog } from "./ChapterFiveActivities.jsx";
import {
  applySafetyAction,
  createSafetyState,
  safetyResult,
} from "./scamOrSafeRules.js";
import "./loan-detective.css";
import "./scam-or-safe.css";
import { safetyInputs } from "./miniGameInputs.js";

// Khung SCAM_OR_SAFE: chữ, số, đáp án, ảnh đều đọc từ game.config (JSON chương) — khung không giữ nội dung.
const cash = (value) => `${value.toLocaleString("vi-VN")}đ`;
const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => values[key]);
// Mẫu → các mảnh chữ riêng (giữ đúng cách React chia nút chữ như bản viết tay trước đây).
const fillParts = (template, values) =>
  template
    .split(/(\{\w+\})/)
    .filter(Boolean)
    .map((part) => (/^\{\w+\}$/.test(part) ? values[part.slice(1, -1)] : part));
// Đoạn có định dạng: chuỗi = chữ, {b} / {strong} = chữ đậm, {br} = xuống dòng.
const rich = (parts) =>
  parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : part.br ? (
      <br key={i} />
    ) : part.b ? (
      <b key={i}>{part.b}</b>
    ) : (
      <strong key={i}>{part.strong}</strong>
    ),
  );
export function ScamOrSafeMiniGame({
  game,
  initialResult,
  onProgress,
  onComplete,
}) {
  const config = game.config;
  const { insurance, inbox, response, texts } = config;
  const [state, setState] = useState(
    () => initialResult?.ui || createSafetyState(game.rounds),
  );
  const [referenceOpen, setReferenceOpen] = useState(false);
  const current = useRef(state),
    completed = useRef(false),
    heading = useRef(null);
  const { round, history } = state;
  const finished = Boolean(state.submittedRounds[round]);
  const active = inbox.messages[state.activeMessage];
  const actionInfo = (id) =>
    response.actions.find((action) => action.id === id);
  const dispatch = (action) => {
    const next = applySafetyAction(config, current.current, action);
    if (next === current.current) return;
    current.current = next;
    setState(next);
    onProgress?.({
      ...safetyResult(config, next.history, game.rounds),
      ui: next,
    });
  };
  const correct = (id) => history[id]?.finalCorrect;
  const verdict = (id) => (correct(id) ? texts.correct : texts.incorrect);
  const answerLabel = (answer) => inbox.answerLabels[answer];
  return (
    <section
      className="loan-game loan-neutral safety-game"
      aria-label={config.heading}
    >
      <header className="loan-heading">
        <img src={config.rounds[round].image} alt="" />
        <div>
          <span>{config.eyebrow}</span>
          <h2>{config.heading}</h2>
          <p>{config.subheading}</p>
        </div>
      </header>
      <ol className="loan-steps safety-steps" aria-label={texts.stepsLabel}>
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
          {fillParts(texts.roundTitle, {
            n: round + 1,
            title: config.rounds[round].title,
          })}
        </h3>
        <span>{finished ? texts.submittedBadge : texts.openBadge}</span>
      </div>
      <p className="loan-instruction">
        <b>{texts.howto}</b>
        {config.rounds[round].instruction}
      </p>

      {round === 0 && (
        <div className="loan-workbench">
          <aside className="loan-budget-note">{rich(insurance.note)}</aside>
          <button data-safety-reference onClick={() => setReferenceOpen(true)}>
            {insurance.referenceButton}
          </button>
          <h4 className="safety-subtitle">{insurance.paymentQuestion}</h4>
          <div className="safety-money">
            {insurance.payments.map((amount) => (
              <button
                key={amount}
                data-insurance-payment={amount}
                aria-pressed={state.payment === amount}
                disabled={finished}
                onClick={() => dispatch({ type: "PAYMENT", amount })}
              >
                {cash(amount)}
              </button>
            ))}
          </div>
          <h4 className="safety-subtitle">{insurance.documentQuestion}</h4>
          <div className="safety-documents">
            {insurance.documents.map((document) => (
              <button
                key={document.id}
                data-document={document.id}
                aria-pressed={state.documents.includes(document.id)}
                disabled={finished}
                onClick={() => dispatch({ type: "DOCUMENT", id: document.id })}
              >
                <img src={document.image} alt="" />
                <b>{document.label}</b>
                <span>
                  {state.documents.includes(document.id)
                    ? insurance.documentSelected
                    : insurance.documentPick}
                </span>
              </button>
            ))}
          </div>
          <button
            data-submit-insurance
            className="loan-primary"
            disabled={finished || state.payment === null}
            onClick={() => dispatch({ type: "SUBMIT_INSURANCE" })}
          >
            {finished ? insurance.submitted : insurance.submit}
          </button>
          {finished && (
            <div className="safety-explanation" data-insurance-result>
              <p>
                <b>
                  {verdict("insurancePayment")}
                  {fill(texts.verdictLine, { label: insurance.paymentLabel })}
                </b>
              </p>
              <p>{rich(insurance.paymentExplanation)}</p>
              <p>
                <b>
                  {verdict("insurancePacket")}
                  {fill(texts.verdictLine, { label: insurance.packetLabel })}
                </b>
              </p>
              <p>{insurance.packetExplanation}</p>
            </div>
          )}
        </div>
      )}

      {round === 1 && (
        <div className="loan-workbench">
          <nav className="safety-inbox-nav" aria-label={inbox.navLabel}>
            {inbox.messages.map((message, index) => {
              const result = finished
                ? correct(message.id)
                  ? "correct"
                  : "incorrect"
                : undefined;
              const status = finished
                ? correct(message.id)
                  ? inbox.statusCorrect
                  : inbox.statusIncorrect
                : state.messages[message.id]
                  ? inbox.statusPicked
                  : inbox.statusOpen;
              return (
                <button
                  key={message.id}
                  data-message-index={index}
                  data-message-result={result}
                  aria-label={fill(inbox.navItem, {
                    n: index + 1,
                    status: status.toLowerCase(),
                  })}
                  aria-current={
                    state.activeMessage === index ? "true" : undefined
                  }
                  onClick={() => dispatch({ type: "MESSAGE", index })}
                >
                  <b>{index + 1}</b>
                  <small>{status}</small>
                </button>
              );
            })}
          </nav>
          <article className="safety-message" data-message-id={active.id}>
            <div className="safety-message-heading">
              <img src={inbox.image} alt="" />
              <div>
                <span>
                  {fillParts(inbox.counter, {
                    n: state.activeMessage + 1,
                    total: inbox.messages.length,
                  })}
                </span>
                <h4>{active.channel}</h4>
              </div>
            </div>
            <blockquote>{active.text}</blockquote>
            <p className="safety-context">
              <b>{inbox.contextLabel}</b> {active.context}
            </p>
            <div className="safety-inbox-choices">
              {inbox.answerOrder.map((answer) => (
                <button
                  key={answer}
                  data-message-answer={answer}
                  aria-pressed={state.messages[active.id] === answer}
                  disabled={finished}
                  onClick={() =>
                    dispatch({ type: "ANSWER_MESSAGE", id: active.id, answer })
                  }
                >
                  {answerLabel(answer)}
                </button>
              ))}
            </div>
            {finished && (
              <div className="safety-explanation" data-message-explanation>
                <b>{verdict(active.id)}</b>
                <p>
                  {fillParts(inbox.youChose, {
                    answer: answerLabel(state.messages[active.id]),
                  })}
                </p>
                <p>{active.explanation}</p>
              </div>
            )}
          </article>
          <p className="loan-note" aria-live="polite">
            {fillParts(inbox.progress, {
              count: Object.keys(state.messages).length,
              total: inbox.messages.length,
            })}{" "}
            {finished ? inbox.progressDone : inbox.progressOpen}
          </p>
          <button
            data-submit-messages
            className="loan-primary"
            disabled={
              finished ||
              inbox.messages.some((message) => !state.messages[message.id])
            }
            onClick={() => dispatch({ type: "SUBMIT_MESSAGES" })}
          >
            {finished ? inbox.submitted : inbox.submit}
          </button>
        </div>
      )}

      {round === 2 && (
        <div className="loan-workbench">
          <aside className="loan-budget-note">{rich(response.note)}</aside>
          <h4>{response.title}</h4>
          <ol className="safety-response-slots">
            {Array.from({ length: response.slots }, (_, index) => {
              const action = actionInfo(state.response[index]);
              return (
                <li key={index}>
                  <span className="safety-order">{index + 1}</span>
                  {action ? (
                    <>
                      <img src={action.image} alt="" />
                      <b>{action.label}</b>
                      {!finished && (
                        <button
                          data-remove-response={action.id}
                          onClick={() =>
                            dispatch({ type: "REMOVE_RESPONSE", id: action.id })
                          }
                          aria-label={fill(response.removeLabel, {
                            n: index + 1,
                          })}
                        >
                          {response.remove}
                        </button>
                      )}
                    </>
                  ) : (
                    <span>
                      {fillParts(response.emptySlot, { n: index + 1 })}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="safety-action-cards">
            {response.actions.map((action) => (
              <button
                key={action.id}
                data-response={action.id}
                disabled={
                  finished ||
                  state.response.includes(action.id) ||
                  state.response.length === response.slots
                }
                onClick={() =>
                  dispatch({ type: "ADD_RESPONSE", id: action.id })
                }
              >
                <img src={action.image} alt="" />
                <b>{action.label}</b>
                <span>
                  {state.response.includes(action.id)
                    ? fill(response.placed, {
                        n: state.response.indexOf(action.id) + 1,
                      })
                    : response.add}
                </span>
              </button>
            ))}
          </div>
          <button
            data-submit-response
            className="loan-primary"
            disabled={finished || state.response.length !== response.slots}
            onClick={() => dispatch({ type: "SUBMIT_RESPONSE" })}
          >
            {finished ? response.submitted : response.submit}
          </button>
          {finished && (
            <div className="safety-explanation" data-response-result>
              <h4>{response.reviewTitle}</h4>
              {response.grading.map(({ id, review }) => (
                <p key={id}>
                  <b>
                    {verdict(`response_${id}`)}
                    {fill(texts.verdictLine, { label: review })}
                  </b>
                </p>
              ))}
              <p>{response.reviewSummary}</p>
            </div>
          )}
        </div>
      )}

      <p className="loan-feedback" role="status">
        {state.feedback || texts.defaultFeedback}
      </p>
      <footer className="loan-footer">
        <span>{finished ? texts.footerDone : texts.footerOpen}</span>
        <button
          className="loan-primary"
          disabled={!finished}
          onClick={() => {
            if (round < game.rounds.at(-1)) {
              dispatch({ type: "ROUND", round: round + 1 });
              requestAnimationFrame(() => heading.current?.focus());
              return;
            }
            if (completed.current) return;
            completed.current = true;
            onComplete({
              ...safetyResult(config, history, game.rounds),
              inputs: safetyInputs(config, state, game.rounds),
              ui: state,
            });
          }}
        >
          {round === game.rounds.at(-1) ? texts.finish : texts.next}
        </button>
      </footer>
      <p className="loan-note">{texts.note}</p>
      {referenceOpen && game.reference && (
        <InspectCardsDialog
          inspect={{ ...game.reference, reviewOnly: true }}
          onClose={() => setReferenceOpen(false)}
        />
      )}
    </section>
  );
}
