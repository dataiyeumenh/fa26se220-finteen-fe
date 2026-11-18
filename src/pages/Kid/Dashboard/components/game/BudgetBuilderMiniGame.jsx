import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Coins,
  PiggyBank,
  RotateCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "./chapter-two-minigames.css";
import { compactInputs } from "./miniGameInputs.js";
import { budgetFeedback } from "./miniGameFeedback.js";

export function BudgetBuilderMiniGame({ game, onComplete, className }) {
  const t = game.texts ?? {};
  const [assignments, setAssignments] = useState({});
  const [selectedAmountId, setSelectedAmountId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [firstCheck, setFirstCheck] = useState(null); // ô → mã thẻ lúc Kiểm tra lần đầu
  const [draggingAmountId, setDraggingAmountId] = useState(null);
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const [recentDrop, setRecentDrop] = useState(null);
  const [dragNote, setDragNote] = useState(null);
  const touchDrag = useRef(null);
  const ignoreClickUntil = useRef(0);
  useEffect(() => {
    if (!recentDrop) return;
    const timer = setTimeout(() => setRecentDrop(null), 500);
    return () => clearTimeout(timer);
  }, [recentDrop]);
  useEffect(() => () => clearTimeout(touchDrag.current?.timer), []);
  const heldAmount = game.draggables.find((item) => item.id === (draggingAmountId || selectedAmountId));

  const usedAmountIds = useMemo(
    () => new Set(Object.values(assignments)),
    [assignments],
  );
  const assignedCount = Object.keys(assignments).length;
  const correctCount = game.dropZones.filter((zone) => {
    const amount = game.draggables.find(
      (item) => item.id === assignments[zone.id],
    );
    return amount?.value === zone.expectedValue;
  }).length;
  const assignedTotal = game.draggables
    .filter((amount) => usedAmountIds.has(amount.id))
    .reduce((sum, amount) => sum + amount.value, 0);
  const budgetTotal = game.draggables.reduce(
    (sum, amount) => sum + amount.value,
    0,
  );
  const remaining = budgetTotal - assignedTotal;
  const passed = correctCount === game.dropZones.length;

  const assign = (zoneId, amountId) => {
    if (!game.dropZones.some((zone) => zone.id === zoneId) || !game.draggables.some((amount) => amount.id === amountId)) return;
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
    setDraggingAmountId(null);
    setHoveredZoneId(null);
    setDragNote(null);
    setRecentDrop(zoneId);
  };

  const endDrag = () => {
    clearTimeout(touchDrag.current?.timer);
    touchDrag.current = null;
    setDraggingAmountId(null);
    setHoveredZoneId(null);
    setDragNote(null);
  };
  const zoneAt = (event) => document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-budget-zone]")?.dataset.budgetZone;
  const beginTouchDrag = (event, amountId) => {
    if (event.pointerType === "mouse") return;
    const drag = { amountId, x: event.clientX, y: event.clientY, active: false };
    const start = () => {
      drag.active = true;
      ignoreClickUntil.current = event.timeStamp + 500;
      setDraggingAmountId(amountId);
      setDragNote({ amountId, x: drag.x, y: drag.y });
    };
    drag.start = start;
    drag.timer = setTimeout(start, 180);
    touchDrag.current = drag;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveTouchDrag = (event) => {
    const drag = touchDrag.current;
    if (!drag) return;
    if (!drag.active && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 6) {
      clearTimeout(drag.timer);
      drag.start();
    }
    if (!drag.active) return;
    event.preventDefault();
    drag.x = event.clientX;
    drag.y = event.clientY;
    setDragNote({ amountId: drag.amountId, x: drag.x, y: drag.y });
    setHoveredZoneId(zoneAt(event) || null);
  };
  const dropTouchDrag = (event) => {
    const drag = touchDrag.current;
    if (!drag) return;
    clearTimeout(drag?.timer);
    if (drag?.active) {
      ignoreClickUntil.current = event.timeStamp + 500;
      const zoneId = zoneAt(event);
      if (zoneId) assign(zoneId, drag.amountId);
    }
    endDrag();
  };

  const handleEnvelopeClick = (zoneId, timeStamp) => {
    if (timeStamp < ignoreClickUntil.current) return;
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
    endDrag();
    setRecentDrop(null);
    setAssignments({});
    setSelectedAmountId(null);
    setSubmitted(false);
  };

  const check = () => {
    setSubmitted(true);
    setFirstCheck((first) => first ?? { ...assignments });
  };

  return (
    <section
      className={cn("c2-game c2-budget-game", className)}
      aria-label="Mini-game phân bổ ngân sách"
    >
      <header className="c2-header">
        <div>
          <span className="c2-eyebrow">
            <WalletCards size={16} /> THỬ THÁCH NGÂN SÁCH
          </span>
          <h2>{t.heading ?? "Chia phong bì thật hợp lý"}</h2>
          <p>{game.instruction}</p>
        </div>
        <div className="c2-counter">
          <strong>{assignedCount}</strong> / {game.dropZones.length}
          <span>
            {assignedTotal.toLocaleString("vi-VN")}đ /{" "}
            {budgetTotal.toLocaleString("vi-VN")}đ đã phân bổ
          </span>
        </div>
      </header>

      <div className="c2-budget-workspace">
        <div className="c2-budget-main">
          <div className="c2-money-tray">
            <div className="c2-tray-label">
              <Coins size={18} />
              <span>Tiền chờ phân bổ</span>
              <strong>{remaining.toLocaleString("vi-VN")}đ</strong>
            </div>
            <div className="c2-amounts" aria-label="Các thẻ tiền">
              {[...game.draggables]
                .sort((a, b) => a.value - b.value)
                .map((amount) => {
                  const used = usedAmountIds.has(amount.id);
                  return (
                    <button
                      key={amount.id}
                      type="button"
                      className={cn(
                        "c2-amount",
                        selectedAmountId === amount.id && "is-selected",
                        used && "is-used",
                      )}
                      disabled={used}
                      draggable={!used}
                      onClick={(event) => {
                        if (event.timeStamp < ignoreClickUntil.current) return;
                        setSelectedAmountId(
                          selectedAmountId === amount.id ? null : amount.id,
                        );
                      }}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", amount.id);
                        event.dataTransfer.effectAllowed = "move";
                        setDraggingAmountId(amount.id);
                      }}
                      onDragEnd={endDrag}
                      onPointerDown={(event) => beginTouchDrag(event, amount.id)}
                      onPointerMove={moveTouchDrag}
                      onPointerUp={dropTouchDrag}
                      onPointerCancel={() => {
                        // Native mouse dragging cancels pointer events, but dragover/dragend still follow.
                        if (touchDrag.current) endDrag();
                      }}
                    >
                      <span className="c2-banknote-mark">₫</span>
                      <strong>{amount.label}</strong>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="c2-budget-grid">
            {game.dropZones.map((zone, index) => {
              const amount = game.draggables.find(
                (item) => item.id === assignments[zone.id],
              );
              const correct = amount?.value === zone.expectedValue;
              const receiving = hoveredZoneId === zone.id && !!heldAmount;
              const open = !amount || receiving;
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={cn(
                    "c2-envelope",
                    `tone-${index + 1}`,
                    amount && "has-money",
                    open && "is-open",
                    receiving && "is-receiving",
                    recentDrop === zone.id && "is-depositing",
                    submitted && (correct ? "is-correct" : "is-incorrect"),
                  )}
                  onClick={(event) => handleEnvelopeClick(zone.id, event.timeStamp)}
                  data-budget-zone={zone.id}
                  aria-label={`${zone.label}: ${amount ? `đã có ${amount.label}` : "chưa có tiền, phong bì đang mở"}`}
                  onPointerEnter={() => setHoveredZoneId(zone.id)}
                  onPointerLeave={() => setHoveredZoneId((current) => current === zone.id ? null : current)}
                  onFocus={() => setHoveredZoneId(zone.id)}
                  onBlur={() => setHoveredZoneId(null)}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setHoveredZoneId(zone.id);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setHoveredZoneId(zone.id);
                  }}
                  onDragLeave={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    if (event.clientX <= rect.left || event.clientX >= rect.right || event.clientY <= rect.top || event.clientY >= rect.bottom) {
                      setHoveredZoneId((current) => current === zone.id ? null : current);
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    assign(zone.id, event.dataTransfer.getData("text/plain"));
                  }}
                >
                  <span className="c2-envelope-shell" aria-hidden="true">
                    <span className="c2-envelope-back" />
                    <span className="c2-envelope-lining" />
                    <span className="c2-envelope-lid" />
                    <span className={cn("c2-envelope-note", (amount || receiving) && "is-visible")}>
                      <b>₫</b>{(receiving ? heldAmount : amount)?.label}
                    </span>
                    <span className="c2-envelope-fold c2-envelope-fold-left" />
                    <span className="c2-envelope-fold c2-envelope-fold-right" />
                    <span className="c2-envelope-pocket" />
                  </span>
                  <span className="c2-envelope-label">
                    <span className="c2-envelope-art">
                      <img src={zone.image} alt="" />
                    </span>
                    <span className="c2-envelope-copy">
                      <span>{zone.label}</span>
                      <strong>{amount?.label || "Thả tiền vào phong bì"}</strong>
                    </span>
                  </span>
                  {submitted && (
                    <small>
                      {budgetFeedback(zone, amount?.value)}
                    </small>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="c2-budget-board" aria-label="Tổng kết ngân sách">
          <span className="c2-board-pin" aria-hidden="true" />
          <span className="c2-board-kicker">SỔ TAY THÁNG NÀY</span>
          <h3>{t.boardTitle ?? "Kế hoạch của An"}</h3>
          <div className="c2-ledger-row">
            <span>Thu nhập</span>
            <strong>{budgetTotal.toLocaleString("vi-VN")}đ</strong>
          </div>
          <div className="c2-ledger-row">
            <span>Đã chia</span>
            <strong>{assignedTotal.toLocaleString("vi-VN")}đ</strong>
          </div>
          <div className="c2-ledger-row is-remaining">
            <span>Còn lại</span>
            <strong>{remaining.toLocaleString("vi-VN")}đ</strong>
          </div>
          <div className="c2-board-divider" />
          <div
            className={cn("c2-plan-health", passed && submitted && "is-safe")}
          >
            {passed && submitted ? (
              <ShieldCheck size={24} />
            ) : (
              <PiggyBank size={24} />
            )}
            <span>
              <strong>
                {passed && submitted ? "Kế hoạch an toàn" : "Đang lập kế hoạch"}
              </strong>
              <small>
                {passed && submitted
                  ? (t.boardSafe ?? "Đủ thiết yếu, mục tiêu và dự phòng")
                  : `${assignedCount}/${game.dropZones.length} phong bì đã hoàn tất`}
              </small>
            </span>
          </div>
          <div className="c2-mini-progress">
            <i
              style={{
                width: `${(assignedCount / game.dropZones.length) * 100}%`,
              }}
            />
          </div>
        </aside>
      </div>

      {dragNote && (
        <span className="c2-drag-note" aria-hidden="true" style={{ left: dragNote.x, top: dragNote.y }}>
          ₫ {game.draggables.find((amount) => amount.id === dragNote.amountId)?.label}
        </span>
      )}

      <footer className="c2-footer">
        <p aria-live="polite">
          {submitted && !passed
            ? `Bạn đã đúng ${correctCount}/${game.dropZones.length} phong bì. Bạn có thể điều chỉnh các ô màu cam hoặc tiếp tục.`
            : submitted && passed
              ? (t.passSummary ?? "Ngân sách cân bằng: đủ nhu cầu thiết yếu, mục tiêu và quỹ dự trù.")
              : selectedAmountId
                ? "Đã chọn thẻ tiền. Bấm vào phong bì để phân bổ."
                : assignedCount === game.dropZones.length
                  ? "Bấm một phong bì để lấy thẻ tiền ra và đổi vị trí."
                  : "Kéo thả hoặc chọn một thẻ tiền rồi bấm vào phong bì."}
        </p>
        <div>
          <button type="button" className="c2-secondary" onClick={reset}>
            <RotateCcw size={17} /> Làm lại
          </button>
          {submitted ? (
            <button
              type="button"
              className="c2-primary"
              onClick={() =>
                onComplete?.({
                  passed,
                  score: correctCount,
                  total: game.dropZones.length,
                  inputs: compactInputs(firstCheck ?? assignments),
                  allocations: Object.fromEntries(
                    game.dropZones.map((zone) => [
                      zone.id,
                      game.draggables.find(
                        (item) => item.id === assignments[zone.id],
                      )?.value || 0,
                    ]),
                  ),
                })
              }
            >
              Tiếp tục →
            </button>
          ) : (
            <button
              type="button"
              className="c2-primary"
              disabled={assignedCount !== game.dropZones.length}
              onClick={check}
            >
              <Check size={18} /> Kiểm tra
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}
