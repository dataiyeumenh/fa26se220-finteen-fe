import { useMemo, useState } from "react";
import { Check, Coins, PiggyBank, RotateCcw, ShieldCheck, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";
import "./chapter-two-minigames.css";

export function BudgetBuilderMiniGame({ game, onComplete, className }) {
  const [assignments, setAssignments] = useState({});
  const [selectedAmountId, setSelectedAmountId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const usedAmountIds = useMemo(
    () => new Set(Object.values(assignments)),
    [assignments],
  );
  const assignedCount = Object.keys(assignments).length;
  const correctCount = game.dropZones.filter((zone) => {
    const amount = game.draggables.find((item) => item.id === assignments[zone.id]);
    return amount?.value === zone.expectedValue;
  }).length;
  const assignedTotal = game.draggables
    .filter((amount) => usedAmountIds.has(amount.id))
    .reduce((sum, amount) => sum + amount.value, 0);
  const budgetTotal = game.draggables.reduce((sum, amount) => sum + amount.value, 0);
  const remaining = budgetTotal - assignedTotal;
  const passed = correctCount === game.dropZones.length;

  const assign = (zoneId, amountId) => {
    if (!amountId) return;
    setAssignments((current) => {
      const next = { ...current };
      for (const [key, value] of Object.entries(next)) {
        if (value === amountId) delete next[key];
      }
      next[zoneId] = amountId;
      return next;
    });
    setSelectedAmountId(null);
    setSubmitted(false);
  };

  const handleEnvelopeClick = (zoneId) => {
    if (selectedAmountId) {
      assign(zoneId, selectedAmountId);
      return;
    }
    const currentAmountId = assignments[zoneId];
    if (!currentAmountId) return;
    setAssignments((current) => {
      const next = { ...current };
      delete next[zoneId];
      return next;
    });
    setSelectedAmountId(currentAmountId);
    setSubmitted(false);
  };

  const reset = () => {
    setAssignments({});
    setSelectedAmountId(null);
    setSubmitted(false);
  };

  const check = () => {
    setSubmitted(true);
  };

  return (
    <section className={cn("c2-game", className)} aria-label="Mini-game phân bổ ngân sách">
      <header className="c2-header">
        <div>
          <span className="c2-eyebrow"><WalletCards size={16} /> THỬ THÁCH NGÂN SÁCH</span>
          <h2>Chia phong bì thật hợp lý</h2>
          <p>{game.instruction}</p>
        </div>
        <div className="c2-counter"><strong>{assignedCount}</strong> / {game.dropZones.length}<span>{assignedTotal.toLocaleString("vi-VN")}đ / {budgetTotal.toLocaleString("vi-VN")}đ đã phân bổ</span></div>
      </header>

      <div className="c2-budget-workspace">
        <div className="c2-budget-main">
          <div className="c2-money-tray">
            <div className="c2-tray-label"><Coins size={18} /><span>Tiền chờ phân bổ</span><strong>{remaining.toLocaleString("vi-VN")}đ</strong></div>
            <div className="c2-amounts" aria-label="Các thẻ tiền">
              {game.draggables.map((amount) => {
                const used = usedAmountIds.has(amount.id);
                return (
                  <button
                    key={amount.id}
                    type="button"
                    className={cn("c2-amount", selectedAmountId === amount.id && "is-selected", used && "is-used")}
                    disabled={used}
                    draggable={!used}
                    onClick={() => setSelectedAmountId(selectedAmountId === amount.id ? null : amount.id)}
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", amount.id)}
                  >
                    <span className="c2-banknote-mark">₫</span><strong>{amount.label}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="c2-budget-grid">
            {game.dropZones.map((zone, index) => {
              const amount = game.draggables.find((item) => item.id === assignments[zone.id]);
              const correct = amount?.value === zone.expectedValue;
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={cn("c2-envelope", `tone-${index + 1}`, amount && "has-money", submitted && (correct ? "is-correct" : "is-incorrect"))}
                  onClick={() => handleEnvelopeClick(zone.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    assign(zone.id, event.dataTransfer.getData("text/plain"));
                  }}
                >
                  <span className="c2-envelope-flap" aria-hidden="true" />
                  <span className="c2-envelope-art"><img src={zone.image} alt="" /></span>
                  <span className="c2-envelope-copy"><span>{zone.label}</span><strong>{amount?.label || "Đặt tiền vào đây"}</strong></span>
                  {submitted && <small>{correct ? <><Check size={13} /> Hợp lý</> : "Cần cân đối lại"}</small>}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="c2-budget-board" aria-label="Tổng kết ngân sách">
          <span className="c2-board-pin" aria-hidden="true" />
          <span className="c2-board-kicker">SỔ TAY THÁNG NÀY</span>
          <h3>Kế hoạch của An</h3>
          <div className="c2-ledger-row"><span>Thu nhập</span><strong>{budgetTotal.toLocaleString("vi-VN")}đ</strong></div>
          <div className="c2-ledger-row"><span>Đã chia</span><strong>{assignedTotal.toLocaleString("vi-VN")}đ</strong></div>
          <div className="c2-ledger-row is-remaining"><span>Còn lại</span><strong>{remaining.toLocaleString("vi-VN")}đ</strong></div>
          <div className="c2-board-divider" />
          <div className={cn("c2-plan-health", passed && submitted && "is-safe")}>
            {passed && submitted ? <ShieldCheck size={24} /> : <PiggyBank size={24} />}
            <span><strong>{passed && submitted ? "Kế hoạch an toàn" : "Đang lập kế hoạch"}</strong><small>{passed && submitted ? "Đủ thiết yếu, mục tiêu và dự phòng" : `${assignedCount}/${game.dropZones.length} phong bì đã hoàn tất`}</small></span>
          </div>
          <div className="c2-mini-progress"><i style={{ width: `${assignedCount / game.dropZones.length * 100}%` }} /></div>
        </aside>
      </div>

      <footer className="c2-footer">
        <p aria-live="polite">
          {submitted && !passed
            ? `Bạn đã đúng ${correctCount}/${game.dropZones.length} phong bì. Hãy điều chỉnh các ô màu cam.`
            : submitted && passed
              ? "Ngân sách cân bằng: đủ nhu cầu thiết yếu, mục tiêu và quỹ dự trù."
            : selectedAmountId
              ? "Đã chọn thẻ tiền. Bấm vào phong bì để phân bổ."
              : assignedCount === game.dropZones.length
                ? "Bấm một phong bì để lấy thẻ tiền ra và đổi vị trí."
                : "Kéo thả hoặc chọn một thẻ tiền rồi bấm vào phong bì."}
        </p>
        <div>
          <button type="button" className="c2-secondary" onClick={reset}><RotateCcw size={17} /> Làm lại</button>
          {submitted && passed
            ? <button type="button" className="c2-primary" onClick={() => onComplete?.({ passed: true, score: correctCount, total: game.dropZones.length })}>Tiếp tục →</button>
            : <button type="button" className="c2-primary" disabled={assignedCount !== game.dropZones.length} onClick={check}><Check size={18} /> Kiểm tra</button>}
        </div>
      </footer>
    </section>
  );
}
