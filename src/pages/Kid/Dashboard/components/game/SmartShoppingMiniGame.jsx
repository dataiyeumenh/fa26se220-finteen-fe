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
  INSPECTIONS,
  inspectOffer,
  invoiceFor,
  evaluatePurchase,
  purchaseLedger,
} from "./shoppingMissionRules";
import "./chapter-two-minigames.css";
import "./smart-shopping.css";

const money = (value) => `${value.toLocaleString("vi-VN")}đ`;
const icons = { app: Smartphone, battery: BatteryCharging, terms: FileText };
const STEPS = ["Điều tra", "Chốt giao dịch", "Một năm sau"];

function PhoneDecision({
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
        <h3>Lịch hủy dùng thử</h3>
        <p>
          Chọn thời điểm gửi yêu cầu. Gia hạn vào ngày 30; yêu cầu hợp lệ được
          lưu xác nhận.
        </p>
        <label htmlFor="mission-cancel-day">
          Thời điểm trong tháng dùng thử
        </label>
        <select
          id="mission-cancel-day"
          value={cancellationDay}
          onChange={(event) => setCancellationDay(event.target.value)}
        >
          <option value="" disabled>
            Chọn thời điểm
          </option>
          <option value="1">Đầu tháng · ngày 1</option>
          <option value="15">Giữa tháng · ngày 15</option>
          <option value="30">Cuối tháng · ngày 30</option>
        </select>
      </>
    );
  if (offer.inspectionRequired)
    return (
      <>
        <BatteryCharging size={30} />
        <h3>Pin cũ có đủ cho bạn?</h3>
        <p>
          Một buổi học kéo dài 4 giờ. Hãy đo pin trước khi quyết định; bảo hành
          không bao gồm hao mòn pin.
        </p>
        <button
          type="button"
          className="c2-secondary"
          disabled={batteryChecked}
          onClick={() => setBatteryChecked(true)}
        >
          {batteryChecked ? "Đã đo pin" : "Chạy kiểm tra pin"}
        </button>
        {batteryChecked && (
          <div className="mission-battery-result" role="status">
            <meter
              min="0"
              max="100"
              value={offer.shopping.batteryHealth}
              aria-label="Dung lượng pin còn lại"
            />
            <p>{offer.shopping.batteryTest}</p>
            <fieldset>
              <legend>Kế hoạch cho buổi học</legend>
              <label>
                <input
                  type="radio"
                  name="battery-plan"
                  checked={batteryPlan === "keep"}
                  onChange={() => setBatteryPlan("keep")}
                />
                Giữ pin, mang sạc và sạc trong giờ nghỉ · 0đ
              </label>
              <label>
                <input
                  type="radio"
                  name="battery-plan"
                  checked={batteryPlan === "replace"}
                  onChange={() => setBatteryPlan("replace")}
                />
                Thay pin · {money(offer.shopping.batteryReplacementCost)}
              </label>
            </fieldset>
            <small>
              Thay pin tăng thời lượng sử dụng, không làm máy chạy đa nhiệm
              nhanh hơn.
            </small>
          </div>
        )}
      </>
    );
  return (
    <>
      <Wallet size={30} />
      <h3>Tính năng thêm hay quỹ hoạt động?</h3>
      <p>
        Máy C học tốt, nhưng camera cao cấp và trò chơi không phải nhu cầu học
        hiện tại.
      </p>
      <div className="mission-balance is-risk">
        <span>Sau khi trả tiền máy</span>
        <strong>{money(budget - offer.price)}</strong>
        <small>
          Thiếu {money(Math.max(0, reserve - (budget - offer.price)))} so với
          quỹ cần giữ. Chưa tính phí ngoài báo giá.
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
  const offers = buildShoppingOffers(game.phones || []);
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
  const budget = game.budget ?? 2500000;
  const reserve = game.reserve ?? 500000;
  const offer = offers.find((item) => item.id === selectedId);
  const checksLeft = 4 - inspected.length;

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
      total: 4,
      firstPercent: first.score * 25,
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
      total: 4,
      passed: firstReport.score >= 3,
      firstPercent: firstReport.score * 25,
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
      aria-label="Nhiệm vụ mua máy: bốn lượt kiểm tra"
    >
      <header className="mission-header">
        <div>
          <span className="c2-eyebrow">
            <Search size={16} /> HỒ SƠ MUA SẮM / A / B / C
          </span>
          <h2>Bốn lượt. Một quyết định.</h2>
          <p>Đừng mua lời quảng cáo. Hãy mua thứ bạn đã kiểm chứng.</p>
        </div>
        <span className="mission-attempt">Lần thử {attempt}</span>
      </header>
      <div className="mission-brief">
        <div>
          <Wallet size={21} />
          <span>
            Ví mô phỏng<strong>{money(budget)}</strong>
          </span>
        </div>
        <div>
          <ShieldCheck size={21} />
          <span>
            Phải giữ cho hoạt động trường<strong>{money(reserve)}</strong>
          </span>
        </div>
        <p>
          Nhiệm vụ: kiểm chứng ba máy A/B/C trong câu chuyện, chọn theo nhu cầu
          học và giữ đủ quỹ sau một năm. Giá và điều kiện giống phương án mua
          của An.
        </p>
      </div>
      <nav className="mission-steps" aria-label="Tiến trình">
        {STEPS.map((label, index) => (
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
              <h3>Bạn muốn kiểm chứng máy nào trước?</h3>
              <p>
                Chỉ có 4 lượt kiểm tra cho 3 máy. Cả ba chạy được ứng dụng học;
                hãy kiểm tra chất lượng, điều kiện và tổng chi thay vì chỉ nhìn
                giá. Hồ sơ đã mở được đọc lại miễn phí.
              </p>
            </div>
            <div
              className="mission-tokens"
              aria-label={`Còn ${checksLeft} lượt kiểm tra`}
            >
              {Array.from({ length: 4 }, (_, index) => (
                <i
                  key={index}
                  className={index < checksLeft ? "" : "is-used"}
                />
              ))}
              <strong>{checksLeft}/4 lượt</strong>
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
                  <img src={item.image} alt={`Điện thoại tại ${item.name}`} />
                </div>
                <div className="mission-offer-body">
                  <p className="mission-ad">“{item.claim}”</p>
                  <strong className="mission-price">{money(item.price)}</strong>
                  <small>
                    Báo giá: chỉ gồm máy. Phụ phí cần được đồng ý trước.
                  </small>
                  <div className="mission-inspections">
                    {INSPECTIONS.map((check) => {
                      const opened = inspected.includes(
                        `${item.id}:${check.id}`,
                      );
                      const Icon = icons[check.id];
                      return (
                        <button
                          key={check.id}
                          type="button"
                          disabled={!opened && checksLeft === 0}
                          onClick={() => inspect(item, check.id)}
                        >
                          <Icon size={17} />
                          <span>{check.label}</span>
                          <small>{opened ? "Đọc lại" : "−1 lượt"}</small>
                        </button>
                      );
                    })}
                  </div>
                  {activeFile?.offer.id === item.id && (
                    <aside className="mission-notebook" aria-live="polite">
                      <div>
                        <h4>
                          {
                            INSPECTIONS.find(
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
                    {selectedId === item.id
                      ? `Đã chọn máy ${item.id}`
                      : `Chọn máy ${item.id}`}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <footer className="mission-footer">
            <p>
              <LockKeyhole size={16} /> Sang thanh toán sẽ khóa lựa chọn máy và
              lượt điều tra.
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
              Chốt {offer ? `máy ${offer.id}` : "máy"} <ArrowRight size={17} />
            </button>
          </footer>
        </>
      )}

      {step === 1 && (
        <>
          <div className="mission-section-heading">
            <div>
              <h3>Tự kiểm tra trước khi trả tiền.</h3>
              <p>
                Xử lý chênh lệch hóa đơn nếu có và tự lên lịch dịch vụ. Khi
                thanh toán, một năm sử dụng sẽ được mô phỏng ngay.
              </p>
            </div>
          </div>
          <div className="mission-checkout">
            <div className="mission-paper">
              <span>HÓA ĐƠN TẠM TÍNH / {offer.name}</span>
              <h3>Kiểm tra từng dòng</h3>
              <p>
                Báo giá đã lưu: <strong>{money(offer.price)}</strong> cho máy,
                chưa thỏa thuận phụ phí.
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
                {invoiceOpened ? "Đã kiểm tra" : "Kiểm tra"}
              </button>
              {invoiceOpened && (
                <div id="mission-invoice-details">
                  <fieldset>
                    <legend>
                      Đánh dấu một dòng cần yêu cầu đối chiếu (nếu có).
                    </legend>
                    {invoiceFor(offer).map((line) => (
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
                    Không yêu cầu đối chiếu
                  </button>
                  <p className="mission-invoice-total">
                    Tổng tạm tính
                    <strong>
                      {money(
                        invoiceFor(offer).reduce(
                          (sum, line) => sum + line.amount,
                          0,
                        ),
                      )}
                    </strong>
                  </p>
                  <small>
                    Yêu cầu được gửi cùng lúc thanh toán. Cửa hàng chỉ sửa khi
                    dòng đánh dấu thực sự lệch báo giá.
                  </small>
                </div>
              )}
            </div>
            <div className="mission-planner">
              <PhoneDecision
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
              <h4>Hồ sơ đã thu thập</h4>
              {INSPECTIONS.filter((check) =>
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
            <p>Không có gợi ý đúng/sai trước khi thanh toán.</p>
            <button type="button" className="c2-primary" onClick={purchase}>
              Thanh toán & xem một năm sau <ArrowRight size={17} />
            </button>
          </footer>
        </>
      )}

      {step === 2 && report && (
        <>
          <div className="mission-result-heading">
            <span>MỘT NĂM SAU</span>
            <h3>
              {report.score === 4
                ? "Bạn đã mua bằng hiểu biết."
                : "Giá trên nhãn chưa kể hết câu chuyện."}
            </h3>
            <p>{offer.name} · Xem lại từng tiêu chí bên dưới.</p>
          </div>
          <div className="mission-results">
            <div className="mission-paper">
              <h3>Tiền đã đi đâu?</h3>
              {purchaseLedger(offer, report).map((row) => (
                <p className="mission-ledger-row" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{money(row.amount)}</strong>
                </p>
              ))}
              <p className="mission-invoice-total">
                Tổng chi thực tế<strong>{money(report.totalCost)}</strong>
              </p>
              <div
                className={`mission-balance ${report.remaining >= reserve ? "is-good" : "is-risk"}`}
              >
                <span>Ví còn lại</span>
                <strong>{money(report.remaining)}</strong>
                <small>Quỹ cần giữ: {money(reserve)}</small>
              </div>
            </div>
            <div className="mission-outcomes">
              {report.criteria.map((item) => (
                <article
                  key={item.id}
                  className={item.passed ? "is-good" : "is-risk"}
                >
                  <span>{item.passed ? "Đúng" : "Chưa đúng"}</span>
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
          <footer className="mission-footer">
            <p>
              Bạn có thể thử phương án khác để so sánh. Kết quả đúng/sai của lần
              nộp đầu được dùng để xét kết thúc chương.
            </p>
            <div>
              <button type="button" className="c2-secondary" onClick={retry}>
                <RotateCcw size={16} /> Thử phương án khác
              </button>
              <button type="button" className="c2-primary" onClick={complete}>
                Trở lại câu chuyện <ArrowRight size={16} />
              </button>
            </div>
          </footer>
        </>
      )}
      <p className="mission-simulation-note">
        Mô phỏng luyện tập · Các thao tác ở đây không trừ tiền trong câu chuyện
        của An.
      </p>
    </section>
  );
}
