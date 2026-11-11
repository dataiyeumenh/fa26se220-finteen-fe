import { useEffect, useState } from "react";
import {
  personalizationApi,
  VALUE_EMOJI,
  VALUE_LABELS,
} from "@/api/personalization.api";

// Trước khi vào chương (BE PR #57): hỏi bé những câu phụ huynh để trống, rồi game chọn phụ nếu giới tính / sở thích
// vẫn chưa biết. Bé luôn được bỏ qua; bỏ qua thì chơi bản gốc. FE không ghép gì — BE trả chương đã ghép.
const CHILD_QUESTION = {
  gender: "Cậu muốn nhân vật chính là…",
  age: "Cậu bao nhiêu tuổi?",
  interest: "Cậu thích nhất…",
};
const GAME_QUESTION = {
  gender: "Chọn nhân vật đồng hành cùng em",
  interest: "Chọn món đồ em muốn mang theo hành trình",
};
const GAME_ITEM = {
  SPORT: "Quả bóng", GAME: "Tay cầm game", MUSIC: "Album nhạc", ANIME: "Bộ truyện",
  ART: "Hộp màu", TECH: "Bộ robot", FASHION: "Đôi giày", TRIP: "Máy ảnh",
};

export function PersonalizationGate({ onDone }) {
  const [view, setView] = useState(null);
  const [picked, setPicked] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    personalizationApi
      .getForChild()
      .then((v) => alive && setView(v))
      .catch(() => alive && onDone()); // lỗi thì không chặn bé chơi: về bản gốc
    return () => {
      alive = false;
    };
  }, [onDone]);

  useEffect(() => {
    if (view && !view.askChild.length && !view.askInGame.length) onDone();
  }, [view, onDone]);

  if (!view || (!view.askChild.length && !view.askInGame.length)) {
    return <div className="py-12 text-center text-sm text-gray-500">Đang chuẩn bị hành trình…</div>;
  }

  const mode = view.askChild.length ? "CHILD" : "GAME";
  const dims = mode === "CHILD" ? view.askChild : view.askInGame;
  const send = async (answers) => {
    setBusy(true);
    setError("");
    try {
      setView(await personalizationApi.saveForChild(mode, answers));
      setPicked({});
    } catch (e) {
      setError(e.message || "Chưa lưu được, thử lại nhé.");
    } finally {
      setBusy(false);
    }
  };
  const pick = (dim, value) => setPicked((p) => ({ ...p, [dim]: p[dim] === value ? undefined : value }));
  const chosen = Object.fromEntries(Object.entries(picked).filter(([, v]) => v));

  return (
    <div className="mx-auto max-w-3xl">
      <div
        className={`overflow-hidden rounded-[28px] border-2 bg-white shadow-xl ${
          mode === "GAME" ? "border-pink-200" : "border-amber-200"
        }`}
      >
        <div
          className={`px-8 py-6 text-white ${
            mode === "GAME"
              ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500"
              : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
            {mode === "GAME" ? "Trước khi lên đường" : "Làm quen một chút"}
          </div>
          <h1 className="mt-1 text-2xl font-black">
            {mode === "GAME" ? "Chọn đồ cho chuyến phiêu lưu!" : "Trả lời nhanh để game hợp với cậu hơn"}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.92)" }}>Không muốn trả lời thì bấm bỏ qua nhé — game vẫn chơi bình thường.</p>
        </div>

        <div className="space-y-6 px-8 py-6">
          {dims.map((dim) => (
            <div key={dim}>
              <div className="mb-3 font-bold text-gray-800">
                {mode === "GAME" ? GAME_QUESTION[dim] : CHILD_QUESTION[dim]}
              </div>
              <div className={`grid gap-3 ${dim === "interest" ? "grid-cols-4" : "grid-cols-3"}`}>
                {view.catalog[dim].map((value) => {
                  const on = picked[dim] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => pick(dim, value)}
                      className={`rounded-2xl border-2 px-2 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${
                        on
                          ? mode === "GAME"
                            ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-700"
                            : "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      {VALUE_EMOJI[value] && <span className="mb-1 block text-3xl">{VALUE_EMOJI[value]}</span>}
                      {mode === "GAME" && dim === "interest" ? GAME_ITEM[value] : VALUE_LABELS[value] || value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {error && <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{error}</div>}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => send(chosen)}
              className="rounded-2xl px-6 py-3 font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
              style={{ background: mode === "GAME" ? "#c026d3" : "#f59e0b" }}
            >
              {mode === "GAME" ? "Mang theo hành trình!" : "Vào game"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => send({})}
              className="rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {mode === "GAME" ? "Chọn sau" : "Bỏ qua hết"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
