import { useMemo, useState } from "react";
import {
  Backpack,
  CheckCircle2,
  CircleDot,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ZONES = {
  inventory: "Kho vật phẩm",
  need: "Cần",
  want: "Muốn",
};

function ItemCard({ item, onMove, zoneKey, draggable = true }) {
  const [imgError, setImgError] = useState(false);

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", item.id);
  };

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      className={cn(
        "group rounded-2xl p-1.5 transition-all select-none",
        draggable &&
          "cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-[0_14px_26px_rgba(34,197,94,0.2)]",
      )}
    >
      <div className="aspect-square overflow-hidden flex items-center justify-center">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.label}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.05] drop-shadow-[0_8px_16px_rgba(15,23,42,0.2)]"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-[11px] text-[#1a3a1a]/55 font-bold px-2 text-center">
            Không có ảnh
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1.5 mt-2 md:hidden">
        <button
          type="button"
          onClick={() => onMove(item.id, "need")}
          className="px-2 py-1 rounded-full bg-[#22c55e]/15 text-[#166534] text-[11px] font-bold"
        >
          Cần
        </button>
        <button
          type="button"
          onClick={() => onMove(item.id, "want")}
          className="px-2 py-1 rounded-full bg-[#fbbf24]/20 text-[#92400e] text-[11px] font-bold"
        >
          Muốn
        </button>
        {zoneKey !== "inventory" && (
          <button
            type="button"
            onClick={() => onMove(item.id, "inventory")}
            className="px-2 py-1 rounded-full bg-[#e2e8f0] text-[#334155] text-[11px] font-bold"
          >
            Kho
          </button>
        )}
      </div>
    </div>
  );
}

function DropZone({
  zoneKey,
  title,
  items,
  onDropItem,
  onMove,
  hint,
  className,
  tone = "green",
}) {
  const [isOver, setIsOver] = useState(false);

  const colors = {
    green: {
      border: "#2ea76f66",
      bg: "#f2fcf6",
      active: "#22c55e22",
      title: "#166534",
      chipBg: "#d7f4e1",
    },
    amber: {
      border: "#f3b64a66",
      bg: "#fff9ec",
      active: "#fbbf2422",
      title: "#92400e",
      chipBg: "#ffecc4",
    },
    slate: {
      border: "#8aa1bd66",
      bg: "#f8fbff",
      active: "#e2e8f0",
      title: "#334155",
      chipBg: "#e9f0f7",
    },
  };

  const theme = colors[tone];

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        const itemId = event.dataTransfer.getData("text/plain");
        onDropItem(itemId, zoneKey);
        setIsOver(false);
      }}
      className={cn(
        "rounded-3xl border-2 p-4 md:p-5 min-h-[340px] h-full transition-colors shadow-[0_10px_26px_rgba(15,23,42,0.08)] flex flex-col",
        className,
      )}
      style={{
        borderColor: theme.border,
        backgroundColor: isOver ? theme.active : theme.bg,
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3
          className="text-sm md:text-base font-black"
          style={{ color: theme.title }}
        >
          {title}
        </h3>
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold"
          style={{
            color: theme.title,
            borderColor: theme.border,
            backgroundColor: theme.chipBg,
          }}
        >
          <CircleDot className="w-3 h-3" /> {items.length}
        </span>
      </div>
      <p className="text-[11px] text-[#1a3a1a]/60 mb-3">{hint}</p>
      {items.length === 0 && (
        <div className="flex-1 min-h-[180px] rounded-2xl border-2 border-dashed border-[#1a3a1a]/15 flex items-center justify-center px-3 bg-white/55">
          <p className="text-xs text-[#1a3a1a]/50 text-center">
            Kéo item vào đây
          </p>
        </div>
      )}
      {items.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 min-h-0",
          )}
        >
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onMove={onMove}
              zoneKey={zoneKey}
              draggable
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function NeedWantMiniGame({
  game,
  onComplete,
  className,
  immersive = false,
}) {
  const [placements, setPlacements] = useState(() => {
    const next = {};
    game.items.forEach((item) => {
      next[item.id] = "inventory";
    });
    return next;
  });

  const [submitted, setSubmitted] = useState(false);

  const grouped = useMemo(() => {
    const groups = {
      inventory: [],
      need: [],
      want: [],
    };

    game.items.forEach((item) => {
      const zone = placements[item.id] || "inventory";
      groups[zone].push(item);
    });

    return groups;
  }, [game.items, placements]);

  const score = useMemo(() => {
    const correct = game.items.filter(
      (item) => placements[item.id] === item.category,
    ).length;
    return {
      correct,
      total: game.items.length,
      passed: correct === game.items.length,
    };
  }, [game.items, placements]);

  const inventoryCount = grouped.inventory.length;
  const progressPercent =
    game.items.length > 0
      ? Math.round((score.correct / game.items.length) * 100)
      : 0;

  const placedCount = useMemo(
    () =>
      game.items.filter((item) => placements[item.id] !== "inventory").length,
    [game.items, placements],
  );
  const placementPercent =
    game.items.length > 0
      ? Math.round((placedCount / game.items.length) * 100)
      : 0;

  const moveItem = (itemId, zone) => {
    setSubmitted(false);
    setPlacements((prev) => ({
      ...prev,
      [itemId]: zone,
    }));
  };

  const reset = () => {
    const resetMap = {};
    game.items.forEach((item) => {
      resetMap[item.id] = "inventory";
    });
    setPlacements(resetMap);
    setSubmitted(false);
  };

  const submit = () => {
    setSubmitted(true);
    onComplete?.({
      score: score.correct,
      total: score.total,
      passed: score.passed,
    });
  };

  return (
    <div
      className={cn(
        "h-full flex flex-col gap-3",
        immersive &&
          "rounded-3xl border border-white/20 bg-[#0b1723]/78 backdrop-blur px-3 py-3 md:px-4 md:py-4",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#b5e9c6] bg-[linear-gradient(135deg,#f4fff6_0%,#ecfafc_48%,#fff6ea_100%)] p-4 md:p-5">
        <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-[#34d399]/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[#fbbf24]/18 blur-2xl" />
        <div className="relative z-10 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/35 bg-white/85 px-3 py-1 text-xs font-black text-[#166534]">
              <Target className="w-3.5 h-3.5" /> THỬ THÁCH PHÂN LOẠI
            </div>
            <h2 className="text-lg md:text-2xl font-black text-[#153e2c] mt-2">
              Cần hay Muốn?
            </h2>
            <p className="text-sm text-[#1f4f39]/75 mt-1">
              Xếp đúng toàn bộ vật phẩm để vượt qua mini-game và mở khóa cảnh
              tiếp theo.
            </p>
          </div>
          <div className="rounded-2xl border border-[#c8ebd2] bg-white/90 px-3 py-2 text-xs text-[#1f4f39] font-bold min-w-[190px]">
            <div className="flex items-center justify-between">
              <span>Đúng</span>
              <span>
                {score.correct}/{score.total}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Trong kho</span>
              <span>{inventoryCount}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Đã xếp</span>
              <span>{placedCount}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#1f4f39]/80">
            <span>Tiến độ phân loại</span>
            <span>{placementPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/80 border border-[#c8ebd2] overflow-hidden">
            <div
              className="h-full bg-[linear-gradient(90deg,#34d399_0%,#16a34a_100%)] transition-all duration-300"
              style={{ width: `${placementPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#1f4f39]/80 mt-1">
            <span>Độ chính xác hiện tại</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/80 border border-[#c8ebd2] overflow-hidden">
            <div
              className="h-full bg-[linear-gradient(90deg,#f59e0b_0%,#fbbf24_100%)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[#cfe7d7] bg-[#f8fffb] p-3 text-xs text-[#1f4f39] font-bold inline-flex items-center gap-2">
          <Backpack className="w-4 h-4" /> Kéo thả tự do giữa các vùng để chỉnh
          sửa đáp án.
        </div>
        <div className="rounded-2xl border border-[#f3deb4] bg-[#fffaf0] p-3 text-xs text-[#875715] font-bold inline-flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Gợi ý: "Cần" là thiết yếu, "Muốn" là
          thứ giúp vui vẻ hơn.
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full grid lg:grid-cols-3 gap-3">
          <DropZone
            zoneKey="inventory"
            title={ZONES.inventory}
            items={grouped.inventory}
            onDropItem={moveItem}
            onMove={moveItem}
            hint="Nguồn vật phẩm ban đầu"
            tone="slate"
            className="min-h-0"
          />
          <DropZone
            zoneKey="need"
            title={ZONES.need}
            items={grouped.need}
            onDropItem={moveItem}
            onMove={moveItem}
            hint="Thiết yếu cho học tập và sinh hoạt"
            tone="green"
            className="min-h-0"
          />
          <DropZone
            zoneKey="want"
            title={ZONES.want}
            items={grouped.want}
            onDropItem={moveItem}
            onMove={moveItem}
            hint="Không bắt buộc, chủ yếu để thỏa thích"
            tone="amber"
            className="min-h-0"
          />
        </div>
      </div>

      <div className="bg-white/95 rounded-2xl border-2 border-[#cfe8d6] p-4 flex flex-wrap items-center justify-between gap-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#1a3a1a]">
            <Target className="w-4 h-4" /> Bảng điều khiển
          </div>
          <div className="text-xs text-[#1a3a1a]/65">
            Chỉ khi đúng toàn bộ, bạn mới vượt qua mini-game.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="border-[#1a3a1a]/20 text-[#1a3a1a]"
          >
            <RotateCcw className="w-4 h-4" /> Đặt lại
          </Button>
          <Button
            size="sm"
            onClick={submit}
            className="bg-[linear-gradient(90deg,#16a34a_0%,#22c55e_100%)] text-white shadow-[0_8px_18px_rgba(34,197,94,0.35)]"
          >
            Chấm bài
          </Button>
        </div>
      </div>

      {submitted && (
        <div
          className={cn(
            "rounded-2xl border-2 p-4 text-sm font-bold",
            score.passed
              ? "bg-[#22c55e]/10 border-[#22c55e]/40 text-[#166534]"
              : "bg-[#f87171]/10 border-[#f87171]/40 text-[#b91c1c]",
          )}
        >
          {score.passed ? (
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Xuất sắc! Bạn đã phân loại đúng toàn bộ vật phẩm.
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Chưa đúng hết. Kéo thả lại để đạt 100% chính xác.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
