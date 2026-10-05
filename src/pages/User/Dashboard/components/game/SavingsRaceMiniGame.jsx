import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Coins, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import "./chapter-two-minigames.css";

const formatMoney = value => `${value.toLocaleString("vi-VN")}đ`;
const clamp = value => Math.max(0, Math.min(1, value));
const spriteBase = "/images/finteen-v2/chapter-02/asset-mini-game/savings-race";
const freshCoin = () => ({ x: 0.1 + Math.random() * 0.8, y: 0, value: (1 + Math.floor(Math.random() * 10)) * 50000 });

export function SavingsRaceMiniGame({ game, onComplete, className }) {
  const stageRef = useRef(null);
  const engine = useRef({ basket: 0.5, coin: freshCoin(), saved: 0 });
  const keys = useRef(new Set());
  const [frame, setFrame] = useState({ basket: 0.5, coin: { x: 0.5, y: 0, value: 50000 }, saved: 0 });
  const [catchFx, setCatchFx] = useState(null);
  const [status, setStatus] = useState("ready");
  const [feedback, setFeedback] = useState("Hứng từng đồng tiền để dành mua laptop nhé!");
  const finished = status === "won";

  useEffect(() => {
    if (status !== "playing") return;
    const heldKeys = keys.current;
    let request;
    let previous;
    const tick = time => {
      const dt = previous === undefined ? 0 : Math.min((time - previous) / 1000, 0.05);
      previous = time;
      const state = engine.current;
      const direction = Number(keys.current.has("ArrowRight")) - Number(keys.current.has("ArrowLeft"));
      state.basket = clamp(state.basket + direction * dt * 0.8);
      const oldY = state.coin.y;
      const y = oldY + dt / 3.8;
      const width = stageRef.current?.clientWidth || 320;
      // Coin and jar share the same horizontal travel bounds (48px margins).
      const caught = oldY < 0.82 && y >= 0.82 && Math.abs(state.coin.x - state.basket) * (width - 96) < 52;
      if (caught) {
        state.saved += state.coin.value;
        setCatchFx({ id: time, value: state.coin.value });
        setFeedback(`+${formatMoney(state.coin.value)}! Đã có ${formatMoney(state.saved)}.`);
        state.coin = freshCoin();
      } else if (y >= 1) {
        state.coin = freshCoin();
        setFeedback("Hụt một đồng rồi, thử hứng đồng tiếp theo nhé!");
      } else {
        state.coin = { ...state.coin, y };
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

  const start = () => { setStatus("playing"); stageRef.current?.focus(); };
  const reset = () => {
    engine.current = { basket: 0.5, coin: freshCoin(), saved: 0 };
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
      <header className="c2-header"><div><span className="c2-eyebrow"><Coins size={16} /> KHU VƯỜN TIẾT KIỆM</span><h2>Gom tiền nhỏ, chạm ước mơ</h2><p>Kéo hũ hoặc dùng phím ← → để hứng tiền mua laptop.</p></div><span className="catch-denominations">50–500 nghìn / đồng<span>Tiền mô phỏng · ngẫu nhiên từng lượt</span></span></header>
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
        {status === "playing" && <div className="catch-coin catch-coin-sprite" aria-hidden="true" style={{ left: `calc(48px + (100% - 96px) * ${frame.coin.x})`, top: `${frame.coin.y * 100}%` }}><img src={`${spriteBase}/gold-coin.png`} alt="" draggable={false} /></div>}
        <div className="catch-basket catch-pig-sprite" aria-hidden="true" style={{ left: `calc(48px + (100% - 96px) * ${frame.basket})` }}>
          <div className={cn("catch-pig-art", catchFx && "is-catching")}><img src={`${spriteBase}/piggy-bank.png`} alt="" draggable={false} /></div>
          {catchFx && <div key={catchFx.id} className="catch-impact" onAnimationEnd={event => {
            if (event.target === event.currentTarget) setCatchFx(current => current?.id === catchFx.id ? null : current);
          }}>
            <span className="catch-impact-ring" />
            <span className="catch-impact-flash">✦</span>
            {Array.from({ length: 6 }, (_, index) => <i key={index} className="catch-impact-spark" style={{ "--spark-x": `${Math.cos(index * Math.PI / 3) * 42}px`, "--spark-y": `${Math.sin(index * Math.PI / 3) * 28 - 20}px` }} />)}
            <b className="catch-pop">+{catchFx.value / 1000} nghìn</b>
          </div>}
        </div>
        {status !== "playing" && <div className={cn("catch-overlay", finished && "catch-victory")}>
          {finished && <>
            <div className="catch-confetti" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ "--x": `${(i * 37) % 100}%`, "--delay": `${(i % 6) * 0.12}s`, "--turn": `${i * 47}deg`, "--color": ["#e9b948", "#86b8a3", "#e89394", "#b29bd4"][i % 4] }} />)}</div>
            <div className="catch-prize"><span aria-hidden="true">✦</span><img src={game.goalImage} alt="Chiếc laptop bạn đã tiết kiệm đủ tiền để mua" /><span aria-hidden="true">✧</span></div>
          </>}
          <h3>{finished ? "Chúc mừng bạn!" : status === "paused" ? "Đang tạm dừng" : "Sẵn sàng hứng tiền chưa?"}</h3>
          <p>{finished ? "Bạn đã tiết kiệm đủ tiền mua laptop! Từng đồng nhỏ đã giúp bạn thực hiện ước mơ." : "Đưa hũ đến dưới đồng tiền. Rơi hụt cũng không sao!"}</p>
          {finished
            ? <button type="button" onClick={() => onComplete?.({ passed: true, score: 1, total: 1 })}>Nhận laptop · Tiếp tục →</button>
            : <button type="button" onClick={start}><Play size={18} /> {status === "paused" ? "Chơi tiếp" : "Bắt đầu"}</button>}
        </div>}
      </div>
      <p className="catch-feedback" role="status">{feedback}</p>
      <footer className="c2-footer catch-controls"><div><button type="button" className="c2-secondary" aria-label="Di chuyển hũ sang trái" disabled={status !== "playing"} onClick={() => step(-1)}><ArrowLeft /></button><button type="button" className="c2-secondary" aria-label="Di chuyển hũ sang phải" disabled={status !== "playing"} onClick={() => step(1)}><ArrowRight /></button></div><div><button type="button" className="c2-secondary" onClick={reset}><RotateCcw size={17} /> Chơi lại</button>{finished ? <button type="button" className="c2-primary" onClick={() => onComplete?.({ passed: true, score: 1, total: 1 })}>Tiếp tục →</button> : status === "playing" && <button type="button" className="c2-primary" onClick={() => setStatus("paused")}><Pause size={17} /> Tạm dừng</button>}</div></footer>
    </section>
  );
}
