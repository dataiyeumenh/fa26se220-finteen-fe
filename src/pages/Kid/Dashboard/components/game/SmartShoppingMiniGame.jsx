import { useRef, useState } from "react";
import {
  Search,
  Smartphone,
  BatteryCharging,
  FileText,
  Check,
  ArrowRight,
  RotateCcw,
  LockKeyhole,
  CalendarDays,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import {
  buildShoppingOffers,
  fill,
  inspectOffer,
  invoiceFor,
  evaluatePurchase,
  purchaseLedger,
} from "./shoppingMissionRules";
import "./chapter-two-minigames.css";
import "./smart-shopping.css";

const money = (value) => `${value.toLocaleString("vi-VN")}đ`;
// Khung SMART_SHOPPING: chữ, số, luật hiển thị đọc từ game.config (JSON chương). Biểu tượng chọn theo tên trong config.
const icons = {
  smartphone: Smartphone,
  battery: BatteryCharging,
  file: FileText,
};

function PhoneDecision({
  decision,
  offer,
  budget,
  reserve,
  cancellationDay,
  setCancellationDay,
  batteryChecked,
  setBatteryChecked,
  batteryPlan,
  setBatteryPlan,
}) {
  if (offer.monthly)
    return (
      <>
        <CalendarDays size={30} />
        <h3>{decision.subscription.title}</h3>
        <p>{decision.subscription.text}</p>
        <label htmlFor="mission-cancel-day">
          {decision.subscription.label}
        </label>
        <select
          id="mission-cancel-day"
          value={cancellationDay}
          onChange={(event) => setCancellationDay(event.target.value)}
        >
          <option value="" disabled>
            {decision.subscription.placeholder}
          </option>
          {decision.subscription.days.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </>
    );
  if (offer.inspectionRequired)
    return (
      <>
        <BatteryCharging size={30} />
        <h3>{decision.battery.title}</h3>
        <p>{decision.battery.text}</p>
        <button
          type="button"
          className="c2-secondary"
          disabled={batteryChecked}
          onClick={() => setBatteryChecked(true)}
        >
          {batteryChecked ? decision.battery.checked : decision.battery.check}
        </button>
        {batteryChecked && (
          <div className="mission-battery-result" role="status">
            <meter
              min="0"
              max="100"
              value={offer.shopping.batteryHealth}
              aria-label={decision.battery.meterLabel}
            />
            <p>{offer.shopping.batteryTest}</p>
            <fieldset>
              <legend>{decision.battery.planLegend}</legend>
              <label>
                <input
                  type="radio"
                  name="battery-plan"
                  checked={batteryPlan === "keep"}
                  onChange={() => setBatteryPlan("keep")}
                />
                {decision.battery.keep}
              </label>
              <label>
                <input
                  type="radio"
                  name="battery-plan"
                  checked={batteryPlan === "replace"}
                  onChange={() => setBatteryPlan("replace")}
                />
                {fill(decision.battery.replace, {
                  cost: money(offer.shopping.batteryReplacementCost),
                })}
              </label>
            </fieldset>
            <small>{decision.battery.note}</small>
          </div>
        )}
      </>
    );
  return (
    <>
      <Wallet size={30} />
      <h3>{decision.features.title}</h3>
      <p>{decision.features.text}</p>
      <div className="mission-balance is-risk">
        <span>{decision.features.balanceLabel}</span>
        <strong>{money(budget - offer.price)}</strong>
        <small>
          {fill(decision.features.shortfall, {
            shortfall: money(Math.max(0, reserve - (budget - offer.price))),
          })}
        </small>
      </div>
    </>
  );
}

export function SmartShoppingMiniGame({
  game,
  initialResult,
  onProgress,
  onComplete,
  className = "",
}) {
  const config = game.config;
  const { texts, inspections } = config;
  const offers = buildShoppingOffers(game.phones, config);
  const saved = initialResult?.ui;
  const [step, setStep] = useState(saved?.step ?? 0);
  const [inspected, setInspected] = useState(saved?.inspected ?? []);
  const [selectedId, setSelectedId] = useState(saved?.selectedId ?? "");
  const [activeFile, setActiveFile] = useState(null);
  const [cancellationDay, setCancellationDay] = useState(
    saved?.cancellationDay ?? "",
  );
  const [batteryChecked, setBatteryChecked] = useState(
    saved?.batteryChecked ?? false,
  );
  const [batteryPlan, setBatteryPlan] = useState(saved?.batteryPlan ?? "");
  const [disputedLine, setDisputedLine] = useState(saved?.disputedLine ?? "");
  const [invoiceOpened, setInvoiceOpened] = useState(
    saved?.invoiceOpened ?? false,
  );
  const [report, setReport] = useState(saved?.report ?? null);
  const [firstReport, setFirstReport] = useState(saved?.firstReport ?? null);
  const [attempt, setAttempt] = useState(saved?.attempt ?? 1);
  const submitted = useRef(false);
  const { budget, reserve } = game;
  const offer = offers.find((item) => item.id === selectedId);
  const checksLeft = config.checkTokens - inspected.length;
  const percent = (score, total) => (score * 100) / total;

  function inspect(item, type) {
    const key = `${item.id}:${type}`;
    if (!inspected.includes(key)) {
      if (!checksLeft) return;
      setInspected((previous) => [...previous, key]);
    }
    setActiveFile({ offer: item, type });
  }
  function purchase() {
    const result = evaluatePurchase({
      config,
      offer,
      inspected,
      cancellationDay,
      disputedLine,
      budget,
      reserve,
      batteryChecked,
      batteryPlan,
    });
    setReport(result);
    if (!firstReport) setFirstReport(result);
    setStep(2);
    const first = firstReport || result;
    onProgress?.({
      score: first.score,
      total: first.total,
      firstPercent: percent(first.score, first.total),
      ui: {
        step: 2,
        inspected,
        selectedId,
        cancellationDay,
        batteryChecked,
        batteryPlan,
        disputedLine,
        invoiceOpened,
        report: result,
        firstReport: first,
        attempt,
      },
    });
  }
  function retry() {
    setInvoiceOpened(false);
    setBatteryChecked(false);
    setBatteryPlan("");
    setStep(0);
    setInspected([]);
    setSelectedId("");
    setActiveFile(null);
    setCancellationDay("");
    setDisputedLine("");
    setReport(null);
    setAttempt((value) => value + 1);
  }
  function complete() {
    if (submitted.current) return;
    submitted.current = true;
    onComplete?.({
      score: firstReport.score,
      total: firstReport.total,
      passed: firstReport.score >= config.passMinScore,
      firstPercent: percent(firstReport.score, firstReport.total),
      revised: attempt > 1,
      attempt,
      selectedPhone: selectedId,
      inspected,
      cancellationDay,
      disputedLine,
      batteryChecked,
      batteryPlan,
      totalCost: report.totalCost,
      criteria: firstReport.criteria,
      ui: {
        step: 2,
        inspected,
        selectedId,
        cancellationDay,
        batteryChecked,
        batteryPlan,
        disputedLine,
        invoiceOpened,
        report,
        firstReport,
        attempt,
      },
    });
  }

  return (
    <section
      className={`c2-game shopping-mission ${className}`}
      aria-label={config.ariaLabel}
    >
      <header className="mission-header">
        <div>
          <span className="c2-eyebrow">
            <Search size={16} /> {config.eyebrow}
          </span>
          <h2>{config.heading}</h2>
          <p>{config.tagline}</p>
        </div>
        <span className="mission-attempt">
          {fill(texts.attempt, { n: attempt })}
        </span>
      </header>
      <div className="mission-brief">
        <div>
          <Wallet size={21} />
          <span>
            {texts.wallet}
            <strong>{money(budget)}</strong>
          </span>
        </div>
        <div>
          <ShieldCheck size={21} />
          <span>
            {texts.reserve}
            <strong>{money(reserve)}</strong>
          </span>
        </div>
        <p>{config.brief}</p>
      </div>
      <nav className="mission-steps" aria-label={texts.stepsLabel}>
        {config.steps.map((label, index) => (
          <span
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={
              index === step ? "is-current" : index < step ? "is-done" : ""
            }
          >
            <b>{index < step ? <Check size={15} /> : index + 1}</b>
            {label}
          </span>
        ))}
      </nav>

      {step === 0 && (
        <>
          <div className="mission-section-heading">
            <div>
              <h3>{texts.investigateTitle}</h3>
              <p>{texts.investigateText}</p>
            </div>
            <div
              className="mission-tokens"
              aria-label={fill(texts.tokensLabel, { left: checksLeft })}
            >
              {Array.from({ length: config.checkTokens }, (_, index) => (
                <i
                  key={index}
                  className={index < checksLeft ? "" : "is-used"}
                />
              ))}
              <strong>
                {fill(texts.tokens, {
                  left: checksLeft,
                  total: config.checkTokens,
                })}
              </strong>
            </div>
          </div>
          <div className="mission-offers">
            {offers.map((item) => (
              <article
                key={item.id}
                className={`mission-offer ${selectedId === item.id ? "is-selected" : ""}`}
              >
                <div className="mission-offer-art">
                  <span>{item.name}</span>
                  <img
                    src={item.image}
                    alt={fill(texts.phoneAlt, { name: item.name })}
                  />
                </div>
                <div className="mission-offer-body">
                  <p className="mission-ad">
                    {fill(texts.claim, { claim: item.claim })}
                  </p>
                  <strong className="mission-price">{money(item.price)}</strong>
                  <small>{texts.quoteNote}</small>
                  <div className="mission-inspections">
                    {inspections.map((check) => {
                      const opened = inspected.includes(
                        `${item.id}:${check.id}`,
                      );
                      const Icon = icons[check.icon];
                      return (
                        <button
                          key={check.id}
                          type="button"
                          disabled={!opened && checksLeft === 0}
                          onClick={() => inspect(item, check.id)}
                        >
                          <Icon size={17} />
                          <span>{check.label}</span>
                          <small>
                            {opened ? texts.reread : texts.costsCheck}
                          </small>
                        </button>
                      );
                    })}
                  </div>
                  {activeFile?.offer.id === item.id && (
                    <aside className="mission-notebook" aria-live="polite">
                      <div>
                        <h4>
                          {
                            inspections.find(
                              (check) => check.id === activeFile.type,
                            ).label
                          }
                        </h4>
                        <p>{inspectOffer(item, activeFile.type)}</p>
                      </div>
                    </aside>
                  )}
                  <button
                    type="button"
                    className="mission-select"
                    aria-pressed={selectedId === item.id}
                    onClick={() => setSelectedId(item.id)}
                  >
                    {selectedId === item.id ? (
                      <Check size={17} />
                    ) : (
                      <Smartphone size={17} />
                    )}
                    {fill(
                      selectedId === item.id ? texts.selected : texts.select,
                      { id: item.id },
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <footer className="mission-footer">
            <p>
              <LockKeyhole size={16} /> {texts.lockNote}
            </p>
            <button
              type="button"
              className="c2-primary"
              disabled={!offer}
              onClick={() => {
                setStep(1);
                setActiveFile(null);
              }}
            >
              {fill(texts.lockIn, {
                phone: offer
                  ? fill(texts.lockPhone, { id: offer.id })
                  : texts.lockPhoneNone,
              })}{" "}
              <ArrowRight size={17} />
            </button>
          </footer>
        </>
      )}

      {step === 1 && (
        <>
          <div className="mission-section-heading">
            <div>
              <h3>{texts.checkoutTitle}</h3>
              <p>{texts.checkoutText}</p>
            </div>
          </div>
          <div className="mission-checkout">
            <div className="mission-paper">
              <span>{fill(texts.invoiceEyebrow, { name: offer.name })}</span>
              <h3>{texts.invoiceTitle}</h3>
              <p>
                {texts.savedQuote}
                <strong>{money(offer.price)}</strong>
                {texts.savedQuoteAfter}
              </p>
              <button
                type="button"
                className="c2-secondary"
                aria-expanded={invoiceOpened}
                aria-controls="mission-invoice-details"
                onClick={() => setInvoiceOpened(true)}
                disabled={invoiceOpened}
              >
                <Search size={16} />
                {invoiceOpened ? texts.invoiceChecked : texts.invoiceCheck}
              </button>
              {invoiceOpened && (
                <div id="mission-invoice-details">
                  <fieldset>
                    <legend>{texts.disputeLegend}</legend>
                    {invoiceFor(offer, config).map((line) => (
                      <label
                        key={line.id}
                        className={disputedLine === line.id ? "is-marked" : ""}
                      >
                        <input
                          type="radio"
                          name="invoice-line"
                          checked={disputedLine === line.id}
                          onChange={() => setDisputedLine(line.id)}
                        />
                        <span>{line.label}</span>
                        <strong>{money(line.amount)}</strong>
                      </label>
                    ))}
                  </fieldset>
                  <button
                    type="button"
                    className="mission-text-button"
                    onClick={() => setDisputedLine("")}
                  >
                    {texts.noDispute}
                  </button>
                  <p className="mission-invoice-total">
                    {texts.invoiceTotal}
                    <strong>
                      {money(
                        invoiceFor(offer, config).reduce(
                          (sum, line) => sum + line.amount,
                          0,
                        ),
                      )}
                    </strong>
                  </p>
                  <small>{texts.disputeNote}</small>
                </div>
              )}
            </div>
            <div className="mission-planner">
              <PhoneDecision
                decision={config.decision}
                offer={offer}
                budget={budget}
                reserve={reserve}
                cancellationDay={cancellationDay}
                setCancellationDay={setCancellationDay}
                batteryChecked={batteryChecked}
                setBatteryChecked={setBatteryChecked}
                batteryPlan={batteryPlan}
                setBatteryPlan={setBatteryPlan}
              />
              <h4>{texts.savedFiles}</h4>
              {inspections.filter((check) =>
                inspected.includes(`${offer.id}:${check.id}`),
              ).map((check) => (
                <div className="mission-saved-file" key={check.id}>
                  <strong>{check.label}</strong>
                  <p>{inspectOffer(offer, check.id)}</p>
                </div>
              ))}
            </div>
          </div>
          <footer className="mission-footer">
            <p>{texts.noHints}</p>
            <button type="button" className="c2-primary" onClick={purchase}>
              {texts.pay} <ArrowRight size={17} />
            </button>
          </footer>
        </>
      )}

      {step === 2 && report && (
        <>
          <div className="mission-result-heading">
            <span>{texts.resultEyebrow}</span>
            <h3>
              {report.score === report.total
                ? texts.resultPerfect
                : texts.resultImperfect}
            </h3>
            <p>{fill(texts.resultSubtitle, { name: offer.name })}</p>
          </div>
          <div className="mission-results">
            <div className="mission-paper">
              <h3>{texts.ledgerTitle}</h3>
              {purchaseLedger(offer, report, config).map((row) => (
                <p className="mission-ledger-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{money(row.amount)}</strong>
                </p>
              ))}
              <p className="mission-invoice-total">
                {texts.actualTotal}
                <strong>{money(report.totalCost)}</strong>
              </p>
              <div
                className={`mission-balance ${report.remaining >= reserve ? "is-good" : "is-risk"}`}
              >
                <span>{texts.walletLeft}</span>
                <strong>{money(report.remaining)}</strong>
                <small>
                  {fill(texts.reserveNeeded, { amount: money(reserve) })}
                </small>
              </div>
            </div>
            <div className="mission-outcomes">
              {report.criteria.map((item) => (
                <article
                  key={item.id}
                  className={item.passed ? "is-good" : "is-risk"}
                >
                  <span>{item.passed ? texts.passed : texts.failed}</span>
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <footer className="mission-footer">
            <p>{texts.retryNote}</p>
            <div>
              <button type="button" className="c2-secondary" onClick={retry}>
                <RotateCcw size={16} /> {texts.retry}
              </button>
              <button type="button" className="c2-primary" onClick={complete}>
                {texts.finish} <ArrowRight size={16} />
              </button>
            </div>
          </footer>
        </>
      )}
      <p className="mission-simulation-note">{texts.simulationNote}</p>
    </section>
  );
}
