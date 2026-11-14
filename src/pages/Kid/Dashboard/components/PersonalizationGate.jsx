import { useEffect, useState } from "react";
import { personalizationApi } from "../../../../api/personalization.api.js";
import { CHILD_QUESTIONS, VALUE_LABELS, personalizationStep } from "../../../../features/personalization/model.js";
const GAME_QUESTIONS = { gender: "Chọn nhân vật đồng hành", interest: "Chọn đồ mang theo hành trình" };
const GAME_ITEMS = {
  SPORT: "⚽ Quả bóng", GAME: "🎮 Tay cầm trò chơi", MUSIC: "🎧 Tai nghe", ANIME: "📚 Bộ truyện",
  ART: "🎨 Hộp màu", TECH: "🤖 Bộ robot", FASHION: "👟 Đôi giày", TRIP: "📷 Máy ảnh",
};

export function PersonalizationGate({ onDone, initialView = null }) {
  const [view, setView] = useState(initialView);
  const [picked, setPicked] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (initialView) return undefined;
    let alive = true;
    personalizationApi.getForChild().then((result) => {
      personalizationStep(result);
      if (alive) { setView(result); setError(""); }
    }).catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [retry, initialView]);
  const step = personalizationStep(view);
  useEffect(() => {
    if (step?.done) onDone(view);
  }, [step?.done, onDone, view]);

  const send = async (answers) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await personalizationApi.saveForChild(step.source, answers);
      personalizationStep(result);
      setView(result);
      setPicked({});
    } catch (e) { setError(e.message || "Chưa lưu được, thử lại nhé."); }
    finally { setBusy(false); }
  };
  if (!view) return <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6">
    <p role={error ? "alert" : "status"}>{error || "Đang chuẩn bị hành trình…"}</p>
    {error && <button className="ws-btn" onClick={() => setRetry((n) => n + 1)}>Thử lại</button>}
  </div>;
  if (step.done) return <p role="status">Đang mở chương…</p>;
  const game = step.source === "GAME";
  return <section className="mx-auto max-w-3xl rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-lg sm:p-8">
    <h1 className="text-2xl font-bold text-slate-800">{game ? "Chuẩn bị cho chuyến phiêu lưu!" : "Làm quen một chút nhé!"}</h1>
    <p className="mt-2 text-slate-600">{game
      ? "Chọn điều em thích hoặc bấm Bỏ qua để tiếp tục."
      : "Em trả lời vài câu để chúng mình hiểu em hơn nhé! Nếu chưa muốn trả lời, em có thể bấm Bỏ qua."}</p>
    <fieldset disabled={busy} className="my-6 grid gap-6 border-0 p-0">
      {step.dimensions.map((dim) => <fieldset key={dim} className="border-0 p-0">
        <legend className="mb-3 font-bold text-slate-800">{game ? GAME_QUESTIONS[dim] : CHILD_QUESTIONS[dim]}</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(view.catalog?.[dim] || []).map((value) => <button key={value} type="button" aria-pressed={picked[dim] === value}
            onClick={() => setPicked((previous) => {
              const next = { ...previous };
              if (next[dim] === value) delete next[dim]; else next[dim] = value;
              return next;
            })}
            className={`min-h-20 rounded-2xl border-2 p-3 font-semibold ${picked[dim] === value ? "border-amber-500 bg-amber-50 text-amber-900" : "border-slate-200 text-slate-700"}`}>
            {game && dim === "interest" ? GAME_ITEMS[value] || VALUE_LABELS[value] || value : VALUE_LABELS[value] || value}
          </button>)}
        </div>
      </fieldset>)}
    </fieldset>
    {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
    <div className="flex flex-wrap gap-3">
      <button className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-slate-900 disabled:opacity-50" disabled={busy} onClick={() => send(picked)}>{busy ? "Đang lưu…" : game ? "Mang theo hành trình!" : "Tiếp tục"}</button>
      <button className="rounded-xl border-2 border-slate-200 px-5 py-3 font-bold text-slate-600 disabled:opacity-50" disabled={busy} onClick={() => send({})}>Bỏ qua</button>
    </div>
  </section>;
}
