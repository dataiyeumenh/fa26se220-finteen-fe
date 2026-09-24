import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LAYOUT_STORAGE_KEY = "finteen.c2.minigame.layout.v1";

const defaultLayout = {
  customer: { left: 0, top: 21.7, width: 16.2, height: 34 },
  bubble: { left: 0, top: 2, width: 19.7, height: 26.9 },
  checkout: { left: 71.2, top: 29.3, width: 16, height: 49 },
  items: [
    { left: 13.7, top: 37.6, width: 15.9, height: 34.2 },
    { left: 27.3, top: 37.8, width: 15.7, height: 29.7 },
    { left: 42.2, top: 38.2, width: 14.9, height: 29.3 },
    { left: 56.3, top: 36.6, width: 16.1, height: 32.9 },
  ],
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function asPercent(value) {
  return `${value}%`;
}

function mergeLayout(base, incoming) {
  const normalized = incoming && typeof incoming === "object" ? incoming : {};
  const customer = { ...base.customer, ...(normalized.customer || {}) };
  const bubble = { ...base.bubble, ...(normalized.bubble || {}) };
  const checkout = { ...base.checkout, ...(normalized.checkout || {}) };
  const items = base.items.map((slot, index) => ({
    ...slot,
    ...((normalized.items || [])[index] || {}),
  }));

  return { customer, bubble, checkout, items };
}

function ItemTile({ item, selected, onSelect, onDragStart }) {
  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        "absolute grid place-items-center rounded-xl transition-all",
        selected && "ring-2 ring-[#7c3aed]",
      )}
      aria-label={`Chọn ${item.label}`}
      title={item.label}
    >
      <img
        src={item.image}
        alt={item.label}
        className={cn(
          "h-full w-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)] transition-transform",
          selected ? "scale-105" : "scale-100",
        )}
      />
    </button>
  );
}

function bubbleImageForState(game, customer, state) {
  // Product requirement: ordering bubble must use c2_mg_bubble_correct.
  if (state === "ordering") {
    return game.bubbles?.correct || customer?.sprites?.ordering || "";
  }

  if (state === "correct") {
    return customer?.sprites?.correct || customer?.sprites?.ordering || game.bubbles?.correct || "";
  }

  if (state === "wrong") {
    return customer?.sprites?.wrong || customer?.sprites?.ordering || game.bubbles?.wrong || "";
  }

  return customer?.sprites?.ordering || "";
}

export function ServeCustomerMiniGame({ game, onComplete, className, immersive = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(game.timeLimit || 0);
  const [layout, setLayout] = useState(() => {
    if (typeof window === "undefined") return defaultLayout;
    try {
      const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (!raw) return defaultLayout;
      return mergeLayout(defaultLayout, JSON.parse(raw));
    } catch {
      return defaultLayout;
    }
  });
  const finishTimerRef = useRef(null);

  const customers = game.customers || [];
  const items = game.items || [];
  const currentCustomer = customers[currentIndex];

  const total = customers.length;
  const served = Math.min(currentIndex, total);
  const isDone = served >= total;

  const currentOrderItem = useMemo(
    () => items.find((item) => item.id === currentCustomer?.order) || null,
    [items, currentCustomer],
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) || null,
    [items, selectedItemId],
  );

  const currentOutcome = feedback?.kind || "ordering";
  const showOrderBubble = currentOutcome === "ordering";

  useEffect(() => {
    if (!game.timeLimit || finished) return;
    if (secondsLeft <= 0) {
      completeGame();
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [game.timeLimit, finished, secondsLeft]);

  useEffect(() => {
    return () => {
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSavedLayout = Boolean(window.localStorage.getItem(LAYOUT_STORAGE_KEY));
    if (hasSavedLayout) return;

    let cancelled = false;

    fetch("/images/c2/c2-minigame-layout.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled || !json?.layout) return;
        const merged = mergeLayout(defaultLayout, json.layout);
        setLayout(merged);
      })
      .catch(() => {
        // Keep embedded defaults when external layout is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const customerSprite = (() => {
    if (!currentCustomer) return "";
    if (currentOutcome === "correct") return currentCustomer.sprites?.correct || currentCustomer.sprites?.ordering;
    if (currentOutcome === "wrong") return currentCustomer.sprites?.wrong || currentCustomer.sprites?.ordering;
    return currentCustomer.sprites?.ordering;
  })();

  const completeGame = () => {
    if (finished) return;
    setFinished(true);
    onComplete?.({
      score,
      total,
      passed: score === total,
    });
  };

  const serveItem = (itemId) => {
    if (!currentCustomer || finished || !itemId) return;

    const selected = items.find((item) => item.id === itemId);
    if (!selected) return;

    const isCorrect = selected.id === currentCustomer.order;
    setSelectedItemId(null);
    setFeedback({ kind: isCorrect ? "correct" : "wrong", itemId: selected.id });

    if (isCorrect) setScore((value) => value + 1);
    else setMistakes((value) => value + 1);

    finishTimerRef.current = setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((value) => value + 1);
    }, 820);
  };

  useEffect(() => {
    if (!finished && currentIndex >= total && total > 0) {
      const timer = setTimeout(() => completeGame(), 500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentIndex, total, finished]);

  const reset = () => {
    setCurrentIndex(0);
    setScore(0);
    setMistakes(0);
    setSelectedItemId(null);
    setFeedback(null);
    setFinished(false);
    setSecondsLeft(game.timeLimit || 0);
  };

  const itemSlots = [
    { left: "16.5%", top: "43.5%", width: "10.5%", height: "24%" },
    { left: "28.5%", top: "42.5%", width: "13%", height: "25%" },
    { left: "43.8%", top: "42.5%", width: "10.5%", height: "24%" },
    { left: "56.4%", top: "42.2%", width: "10.8%", height: "25%" },
  ];

  const progress = total > 0 ? Math.round((served / total) * 100) : 0;

  return (
    <section
      className={cn(
        "h-full rounded-3xl border border-white/20 bg-[#0f172a]/92 text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col",
        immersive && "backdrop-blur",
        className,
      )}
      aria-label="Mini-game phục vụ khách"
    >
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
        <div>
          <h2 className="text-base md:text-lg font-black">Mini-game: Phục vụ khách đúng order</h2>
          <p className="text-xs text-white/70">Kéo món vào ô chốt bên phải (hoặc chọn món rồi bấm ô chốt).</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/8 px-3 py-2 text-xs font-bold text-white/85 min-w-[150px]">
          <div className="flex items-center justify-between"><span>Tiến độ</span><span>{served}/{total}</span></div>
          <div className="flex items-center justify-between mt-1"><span>Đúng</span><span>{score}</span></div>
          <div className="flex items-center justify-between mt-1"><span>Sai</span><span>{mistakes}</span></div>
          {game.timeLimit ? (
            <div className="flex items-center justify-between mt-1"><span className="inline-flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" />Giờ</span><span>{secondsLeft}s</span></div>
          ) : null}
        </div>
      </header>

      <div className="flex-1 min-h-0 p-3 md:p-4">
        <div
          className="relative h-full w-full overflow-hidden rounded-3xl border border-white/15 bg-[#17324a]"
          style={{
            backgroundImage: game.deskBg ? `url(${game.deskBg})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          <div
            className="absolute z-20"
            style={{
              left: asPercent(layout.customer.left),
              top: asPercent(layout.customer.top),
              width: asPercent(layout.customer.width),
              height: asPercent(layout.customer.height),
            }}
          >
            {customerSprite ? (
              <img src={customerSprite} alt="Khách" className="w-full h-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]" />
            ) : null}
          </div>

          <div
            className="absolute z-30"
            style={{
              left: asPercent(layout.bubble.left),
              top: asPercent(layout.bubble.top),
              width: asPercent(layout.bubble.width),
              height: asPercent(layout.bubble.height),
            }}
          >
            {showOrderBubble && bubbleImageForState(game, currentCustomer, currentOutcome) ? (
              <img
                src={bubbleImageForState(game, currentCustomer, currentOutcome)}
                alt="Bong bóng hội thoại"
                className="w-full h-full object-contain"
              />
            ) : null}
            {showOrderBubble && currentOrderItem ? (
              <div className="absolute inset-0 flex items-center justify-center pt-[8%]">
                <img
                  src={currentOrderItem.image}
                  alt={currentOrderItem.label}
                  className="w-[47%] h-[47%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
                />
              </div>
            ) : null}
          </div>

          <div className="absolute bottom-[4%] left-[2.5%] z-30 rounded-xl bg-[#0f172acc] border border-white/20 px-3 py-2 text-xs font-bold">
            Khách {Math.min(currentIndex + 1, total)} / {total}
            <div className="mt-1 h-1.5 w-40 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-[#22c55e] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {items.map((item, index) => {
            const slot = layout.items[index] || itemSlots[index] || itemSlots[itemSlots.length - 1];
            return (
              <div
                key={`${item.id}-slot`}
                style={{
                  left: asPercent(slot.left),
                  top: asPercent(slot.top),
                  width: asPercent(slot.width),
                  height: asPercent(slot.height),
                }}
                className={cn(
                  "absolute z-20",
                )}
              >
                <ItemTile
                  item={item}
                  selected={selectedItemId === item.id}
                  onSelect={() => setSelectedItemId(item.id)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", item.id);
                    setSelectedItemId(item.id);
                  }}
                />
              </div>
            );
          })}

          <div
            className={cn(
              "absolute z-20 rounded-2xl border-2 border-dashed transition-colors grid place-items-center text-center px-2",
              feedback?.kind === "correct"
                ? "border-[#22c55e] bg-[#22c55e]/22"
                : feedback?.kind === "wrong"
                  ? "border-[#ef4444] bg-[#ef4444]/22"
                  : "border-[#fde68a] bg-black/12",
            )}
            style={{
              left: asPercent(layout.checkout.left),
              top: asPercent(layout.checkout.top),
              width: asPercent(layout.checkout.width),
              height: asPercent(layout.checkout.height),
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              serveItem(event.dataTransfer.getData("text/plain"));
            }}
            onClick={() => serveItem(selectedItemId)}
          >
            <div className="font-black text-sm leading-snug text-white drop-shadow">
              {feedback?.kind === "correct"
                ? "Chuẩn!"
                : feedback?.kind === "wrong"
                  ? "Sai món"
                  : "Kéo vào đây\nđể chốt"}
            </div>
          </div>

          {selectedItem ? (
            <div className="absolute right-[2.5%] bottom-[4%] z-30 rounded-xl bg-[#0f172acc] border border-white/20 px-3 py-2 text-xs font-bold">
              Đang chọn: {selectedItem.label}
            </div>
          ) : null}

        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#0b1723] px-4 py-3">
        <div className="text-xs text-white/75">
          {finished
            ? (score === total
              ? "Hoàn thành xuất sắc. Bấm Tiếp tục để về flow truyện."
              : "Đã hoàn thành mini-game. Bấm Tiếp tục để đi tiếp.")
            : "Phục vụ đúng món để tăng tỉ lệ thành công của ngày bán hàng."}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="border-white/25 bg-white/10 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" /> Đặt lại
          </Button>
          <Button
            size="sm"
            onClick={completeGame}
            className="bg-[linear-gradient(90deg,#16a34a_0%,#22c55e_100%)] text-white"
          >
            {finished ? "Tiếp tục" : "Kết thúc lượt"}
          </Button>
        </div>
      </footer>
    </section>
  );
}
