import { useState } from "react";
import { ShoppingBasket as Basket, Check, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import "./need-want.css";

const zones = [
  { id: "inventory", title: "Quầy hàng", hint: "Chọn một món, rồi chọn giỏ", icon: "✦" },
  { id: "need", title: "Giỏ Cần", hint: "Thiết yếu cho cuộc sống", icon: "✓" },
  { id: "want", title: "Giỏ Muốn", hint: "Những điều làm bạn vui", icon: "♡" },
];

function Item({ item, selected, onSelect, onDragStart, checked, correct }) {
  const [broken, setBroken] = useState(false);
  return (
    <button type="button" className={cn("nw-item", selected && "is-selected", checked && (correct ? "is-correct" : "is-incorrect"))}
      draggable onDragStart={onDragStart} onClick={onSelect} aria-pressed={selected} aria-label={`Chọn ${item.label}`}>
      <span className="nw-item-picture">
        {!broken && item.image ? <img src={item.image} alt="" draggable={false} onError={() => setBroken(true)} /> : <Basket size={40} />}
      </span>
      <span className="nw-item-label">{item.label}</span>
      {selected && <span className="nw-selected-mark"><Check size={14} /></span>}
      {checked && <span className="nw-item-feedback">{correct ? "Đúng rồi" : "Thử xem lại nhé"}</span>}
    </button>
  );
}

export function NeedWantMiniGame({ game, onComplete, className, immersive = false }) {
  const [placements, setPlacements] = useState({});
  const [selected, setSelected] = useState(null);
  const [dragZone, setDragZone] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const grouped = Object.fromEntries(zones.map(zone => [zone.id, game.items.filter(item => (placements[item.id] || "inventory") === zone.id)]));
  const placed = game.items.length - grouped.inventory.length;
  const correct = game.items.filter(item => placements[item.id] === item.category).length;
  const passed = correct === game.items.length;
  const selectedItem = game.items.find(item => item.id === selected);

  const moveItem = (id, zone) => {
    if (!game.items.some(item => item.id === id) || !zones.some(item => item.id === zone) || finished) return;
    setPlacements(previous => ({ ...previous, [id]: zone }));
    setSelected(null);
    setSubmitted(false);
    setDragZone(null);
  };
  const reset = () => { setPlacements({}); setSelected(null); setSubmitted(false); setFinished(false); };
  const finish = () => {
    if (finished) return;
    setFinished(true);
    onComplete?.({ score: correct, total: game.items.length, passed });
  };

  return (
    <section className={cn("nw-game", immersive && "nw-immersive", className)} aria-label="Minigame Cần hay Muốn">
      <header className="nw-header">
        <div><span className="nw-eyebrow"><Sparkles size={15} /> THỬ THÁCH NHỎ</span><h2>Cần hay Muốn?</h2><p>Cùng chọn đồ vào đúng giỏ nhé!</p></div>
        <div className="nw-progress"><span><strong>{placed}</strong> / {game.items.length} món đã xếp</span><div role="progressbar" aria-label="Vật phẩm đã xếp" aria-valuenow={placed} aria-valuemin={0} aria-valuemax={game.items.length}><i style={{ width: `${game.items.length ? placed / game.items.length * 100 : 0}%` }} /></div></div>
      </header>
      <div className="nw-tip"><Lightbulb size={20} /><span><b>Cần</b> là thiết yếu. <b>Muốn</b> là thứ bạn thích có thêm.</span></div>
      <div className="nw-board">
        {zones.map(zone => (
          <section key={zone.id} className={cn("nw-zone", `nw-${zone.id}`, dragZone === zone.id && "is-over")}
            onDragOver={event => { event.preventDefault(); setDragZone(zone.id); }}
            onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDragZone(null); }}
            onDrop={event => { event.preventDefault(); moveItem(event.dataTransfer.getData("text/plain"), zone.id); }}>
            <div className="nw-zone-heading"><span className="nw-zone-icon" aria-hidden="true">{zone.icon}</span><div><h3>{zone.title}</h3><p>{zone.hint}</p></div><span className="nw-count">{grouped[zone.id].length}</span></div>
            <div className="nw-items">
              {grouped[zone.id].map(item => <Item key={item.id} item={item} selected={selected === item.id}
                checked={submitted && zone.id !== "inventory"} correct={placements[item.id] === item.category}
                onSelect={() => setSelected(selected === item.id ? null : item.id)}
                onDragStart={event => { event.dataTransfer.setData("text/plain", item.id); event.dataTransfer.effectAllowed = "move"; setSelected(item.id); }} />)}
              {!grouped[zone.id].length && <div className="nw-empty"><Basket size={48} strokeWidth={1.2} /><span>{zone.id === "inventory" ? "Đã xếp hết các món!" : "Thả vật phẩm vào giỏ"}</span></div>}
            </div>
            <button type="button" className="nw-place" disabled={!selected || finished} onClick={() => moveItem(selected, zone.id)}>
              {zone.id === "inventory" ? "Đưa lại quầy" : `Cho vào ${zone.title.toLowerCase()}`} <span aria-hidden="true">→</span>
            </button>
          </section>
        ))}
      </div>
      <footer className="nw-footer">
        <div className="nw-status" aria-live="polite">
          {submitted ? <><strong>{passed ? "Tuyệt vời! Bạn đã xếp đúng tất cả." : `Bạn đã xếp đúng ${correct}/${game.items.length} món.`}</strong><span>{passed ? "Sẵn sàng tiếp tục câu chuyện!" : "Bạn có thể sửa lại các món được đánh dấu hoặc tiếp tục để xem kết quả."}</span></> : <><strong>{selectedItem ? `Đang chọn: ${selectedItem.label}` : "Kéo thả hoặc bấm để chọn"}</strong><span>{selectedItem ? "Bấm nút dưới giỏ để chuyển vật phẩm." : "Chọn vật phẩm, sau đó bấm nút dưới giỏ Cần hoặc Muốn."}</span></>}
        </div>
        <div className="nw-actions"><button type="button" className="nw-reset" onClick={reset}><RotateCcw size={17} /> Xếp lại</button>
          {submitted ? <button type="button" className="nw-submit" disabled={finished} onClick={finish}>Tiếp tục →</button> : <button type="button" className="nw-submit" disabled={placed !== game.items.length || !game.items.length} onClick={() => { setSubmitted(true); setSelected(null); }}>Kiểm tra <Check size={19} /></button>}
        </div>
      </footer>
    </section>
  );
}
