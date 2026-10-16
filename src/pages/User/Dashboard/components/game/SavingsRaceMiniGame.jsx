import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Coins, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import "./chapter-two-minigames.css";
import { advanceFallingItems } from "./miniGameRules";

const formatMoney = value => `${value.toLocaleString("vi-VN")}đ`;
const clamp = value => Math.max(0, Math.min(1, value));
const spriteBase = "/images/finteen-v2/chapter-02/asset-mini-game/savings-race";
const freshCoin = () => ({ x: 0.1 + Math.random() * 0.8, y: 0, value: (1 + Math.floor(Math.random() * 10)) * 50000 });
const duration = 60;
const expenses = [
  { label: "Trò chơi", image: "/images/finteen-v2/chapter-02/asset-mini-game/budget-builder/entertainment.png", value: -200000 },
  { label: "Tai nghe xịn", image: "/images/finteen-v2/chapter-01/asset-mini-game/needs-or-wants/05-upgrade-headphones.png", value: -150000 },
  { label: "Tượng mèo trang trí", image: "/images/finteen-v2/chapter-01/asset-mini-game/needs-or-wants/06-desk-decoration.png", value: -100000 },
];
const freshItem = () => Math.random() < 0.25
  ? { ...freshCoin(), ...expenses[Math.floor(Math.random() * expenses.length)] }
  : { ...freshCoin(), label: "Tiền tiết kiệm", image: `${spriteBase}/gold-coin.png` };
const freshWave = (wave) => Array.from({ length: 2 + Math.floor(Math.random() * 2) }, (_, index) => ({
  ...freshItem(), id: `${wave}-${index}`, x: 0.15 + index * 0.3 + Math.random() * 0.1, y: -index * 0.12,
}));
const freshEngine = () => ({ basket: 0.5, items: freshWave(0), wave: 0, saved: 0, elapsed: 0 });

export function SavingsRaceMiniGame({ game, onComplete, className }) {
  const stageRef = useRef(null);
  const engine = useRef(null);
  const keys = useRef(new Set());
  const [frame, setFrame] = useState(freshEngine);
  const [catchFx, setCatchFx] = useState(null);
  const [status, setStatus] = useState("ready");
  const [feedback, setFeedback] = useState("Hứng từng đồng tiền để dành mua laptop nhé!");
  const finished = status === "won" || status === "timeout";
  const secondsLeft = Math.max(0, Math.ceil(duration - frame.elapsed));
  const finish = () => onComplete?.({ outcome: frame.saved >= game.targetAmount ? "success" : "failed" });

  useEffect(() => {
    if (status !== "playing") return;
    const heldKeys = keys.current;
    let request;
    let previous;
    const tick = time => {
      const elapsed = previous === undefined ? 0 : (time - previous) / 1000;
      const dt = Math.min(elapsed, 0.05);
      previous = time;
      const state = engine.current;
      state.elapsed = Math.min(duration, state.elapsed + elapsed);
      if (state.elapsed >= duration) {
        setFrame({ ...state });
        keys.current.clear();
        setStatus("timeout");
        setFeedback(`Hết giờ! Bạn đã tiết kiệm được ${formatMoney(state.saved)}.`);
        return;
      }
      const direction = Number(keys.current.has("ArrowRight")) - Number(keys.current.has("ArrowLeft"));
      state.basket = clamp(state.basket + direction * dt * 0.8);
      const width = stageRef.current?.clientWidth || 320;
      const next = advanceFallingItems(state.items, { dt, basket: state.basket, width, saved: state.saved, targetAmount: game.targetAmount });
      state.saved = next.saved;
      state.items = next.items;
      if (next.catches.length) {
        const delta = next.catches.reduce((sum, item) => sum + item.delta, 0);
        setCatchFx({ id: time, value: delta, expense: delta < 0 });
        setFeedback(`${next.catches.map(item => `${item.label}: ${item.delta > 0 ? "+" : ""}${formatMoney(item.delta)}`).join(" · ")}. Đã có ${formatMoney(state.saved)}.`);
      }
      if (!next.won && !state.items.length) {
        state.wave += 1;
        state.items = freshWave(state.wave);
      }
      setFrame({ ...state });
      if (state.saved >= game.targetAmount) {
        keys.current.clear();
        setStatus("won");
        return;
      }
      request = requestAnimationFrame(tick);
    };
    const pause = () => { keys.current.clear(); setStatus("paused"); };
    const hide = () => { if (document.hidden) pause(); };
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hide);
    request = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(request);
      heldKeys.clear();
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [status, game.targetAmount]);

  const start = () => { engine.current ??= { ...frame }; setStatus("playing"); stageRef.current?.focus(); };
  const reset = () => {
    engine.current = freshEngine();
    keys.current.clear();
    setFrame({ ...engine.current });
    setCatchFx(null);
    setFeedback("Hứng từng đồng tiền để dành mua laptop nhé!");
    setStatus("ready");
  };
  const move = event => {
    if (status !== "playing") return;
    const bounds = stageRef.current.getBoundingClientRect();
    engine.current.basket = clamp((event.clientX - bounds.left - 48) / (bounds.width - 96));
  };
  const step = direction => {
    if (status !== "playing") return;
    engine.current.basket = clamp(engine.current.basket + direction * 0.14);
    setFrame({ ...engine.current });
  };

  return (
    <section className={cn("c2-game catch-game", className)} aria-label="Hứng tiền mua laptop">
      <header className="c2-header"><div><span className="c2-eyebrow"><Coins size={16} /> KHU VƯỜN TIẾT KIỆM</span><h2>Gom tiền nhỏ, chạm ước mơ</h2><p>Hứng tiền, tránh trò chơi, tai nghe xịn và tượng mèo trang trí. Đủ mục tiêu hoặc hết 90 giây sẽ kết thúc.</p></div><span className="catch-timer" role="timer" aria-label="Thời gian còn lại">{Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}</span></header>
      <div className="catch-score"><img src={game.goalImage} alt="Laptop mục tiêu" /><div><strong>{formatMoney(frame.saved)} / {formatMoney(game.targetAmount)}</strong><progress aria-label="Tiền đã hứng" value={frame.saved} max={game.targetAmount} /><span>Còn thiếu {formatMoney(Math.max(0, game.targetAmount - frame.saved))}</span></div></div>
      <div ref={stageRef} className="catch-stage" tabIndex={0} role="group" aria-label="Sân chơi. Dùng phím mũi tên trái phải để di chuyển hũ."
        onKeyDown={event => { if (["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); keys.current.add(event.key); } }}
        onKeyUp={event => keys.current.delete(event.key)} onBlur={() => keys.current.clear()}
        onPointerDown={event => {
          // Capturing a button's pointer redirects its click to the stage.
          // Leave overlay controls alone; capture only active gameplay gestures.
          if (status !== "playing" || event.target.closest("button")) return;
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={event => { if (event.pointerType === "mouse" || event.buttons) move(event); }}>
        <div className="catch-scenery" aria-hidden="true"><i className="catch-sun" /><i className="catch-puff puff-one" /><i className="catch-puff puff-two" /><i className="catch-hill hill-one" /><i className="catch-hill hill-two" /></div>
        <div className="catch-cloud" aria-hidden="true">✦ Mỗi đồng nhỏ đều đáng quý ✦</div>
        {status === "playing" && frame.items.map(item => <div key={item.id} className={cn("catch-coin catch-coin-sprite", item.value < 0 && "is-expense")} aria-hidden="true" style={{ left: `calc(48px + (100% - 96px) * ${item.x})`, top: `${item.y * 100}%` }}><img src={item.image} alt="" draggable={false} /></div>)}
        <div className="catch-basket catch-pig-sprite" aria-hidden="true" style={{ left: `calc(48px + (100% - 96px) * ${frame.basket})` }}>
          <div className={cn("catch-pig-art", catchFx && "is-catching")}><img src={`${spriteBase}/piggy-bank.png`} alt="" draggable={false} /></div>
          {catchFx && <div key={catchFx.id} className="catch-impact" onAnimationEnd={event => {
            if (event.target === event.currentTarget) setCatchFx(current => current?.id === catchFx.id ? null : current);
          }}>
            <span className="catch-impact-ring" />
            <span className="catch-impact-flash">✦</span>
            {Array.from({ length: 6 }, (_, index) => <i key={index} className="catch-impact-spark" style={{ "--spark-x": `${Math.cos(index * Math.PI / 3) * 42}px`, "--spark-y": `${Math.sin(index * Math.PI / 3) * 28 - 20}px` }} />)}
            <b className={cn("catch-pop", catchFx.expense && "is-expense")}>{catchFx.value > 0 ? "+" : ""}{catchFx.value / 1000} nghìn</b>
          </div>}
        </div>
        {status !== "playing" && <div className={cn("catch-overlay", finished && "catch-victory")}>
          {status === "won" && <>
            <div className="catch-confetti" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--delay": `${(i % 6) * 0.12}s`, "--turn": `${i * 47}deg`, "--color": ["#e9b948", "#86b8a3", "#e89394", "#b29bd4"][i % 4] }} />)}</div>
            <div className="catch-prize"><span aria-hidden="true">✦</span><img src={game.goalImage} alt="Chiếc laptop bạn đã tiết kiệm đủ tiền để mua" /><span aria-hidden="true">✧</span></div>
          </>}
          <h3>{status === "won" ? "Chúc mừng bạn!" : status === "timeout" ? "Đã hoàn thành lượt chơi!" : status === "paused" ? "Đang tạm dừng" : "Sẵn sàng hứng tiền chưa?"}</h3>
          <p>{status === "won" ? "Bạn đã tiết kiệm đủ tiền mua laptop!" : status === "timeout" ? `Hết 90 giây. Bạn tiết kiệm được ${formatMoney(frame.saved)}; vẫn có thể tiếp tục câu chuyện.` : "Dùng phím ← → hoặc kéo hũ để hứng tiền. Tránh trò chơi, tai nghe xịn và tượng mèo trang trí để giữ tiền tiết kiệm!"}</p>
          {finished
            ? <button type="button" onClick={finish}>Tiếp tục →</button>
            : <button type="button" onClick={start}><Play size={18} /> {status === "paused" ? "Chơi tiếp" : "Bắt đầu"}</button>}
        </div>}
      </div>
      <p className="catch-feedback" role="status">{feedback}</p>
      <footer className="c2-footer catch-controls"><div><button type="button" className="c2-secondary" aria-label="Di chuyển hũ sang trái" disabled={status !== "playing"} onClick={() => step(-1)}><ArrowLeft /></button><button type="button" className="c2-secondary" aria-label="Di chuyển hũ sang phải" disabled={status !== "playing"} onClick={() => step(1)}><ArrowRight /></button></div><div><button type="button" className="c2-secondary" onClick={reset}><RotateCcw size={17} /> Chơi lại</button>{finished ? <button type="button" className="c2-primary" onClick={finish}>Tiếp tục →</button> : status === "playing" && <button type="button" className="c2-primary" onClick={() => setStatus("paused")}><Pause size={17} /> Tạm dừng</button>}</div></footer>
    </section>
  );
}
