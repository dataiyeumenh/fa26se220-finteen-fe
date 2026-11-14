import { useCallback, useEffect, useState } from "react";
import { personalizationApi } from "../../../api/personalization.api.js";
import { CHILD_QUESTIONS, DIMENSIONS, DIMENSION_LABELS, VALUE_LABELS, personalizationStep } from "../../../features/personalization/model.js";
import { PersonalizationStatus } from "../../../features/personalization/PersonalizationStatus.jsx";
import { useWorkspace } from "../../../features/workspace/useWorkspace.js";
import { PersonalizationGate } from "./components/PersonalizationGate.jsx";
import { novelProgressOwner } from "./components/game/visualNovelProgress.js";

export function KidPersonalizationEditor({ onClose }) {
  const [view, setView] = useState(null);
  const [phase, setPhase] = useState("view");
  const [picked, setPicked] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    personalizationApi.getForChild().then((result) => {
      personalizationStep(result);
      if (alive) { setView(result); setError(""); }
    }).catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [retry]);
  const finish = useCallback((result) => {
    setView(result);
    setPhase("view");
    setSaved(true);
  }, []);
  if (!view) return <div>
    <p role={error ? "alert" : "status"}>{error || "Đang tải thông tin của em…"}</p>
    {error && <button className="ws-btn" onClick={() => setRetry((n) => n + 1)}>Thử lại</button>}
  </div>;
  if (phase === "resolve") return <PersonalizationGate initialView={view} onDone={finish} />;
  return <div className="grid gap-5">
    <PersonalizationStatus status={view.status} />
    <section aria-label="Nội dung em đang nhận" className="rounded-2xl bg-amber-50 p-4">
      <h2 className="mb-3 font-bold text-slate-800">Nội dung em đang nhận</h2>
      <dl className="grid gap-3 sm:grid-cols-3">
        {DIMENSIONS.map((dim) => <div key={dim}>
          <dt className="text-xs text-slate-600">{DIMENSION_LABELS[dim]}</dt>
          <dd className="mt-1 font-semibold text-slate-800">{view.labels?.[dim] ? VALUE_LABELS[view.labels[dim]] || view.labels[dim] : "Bản gốc"}</dd>
        </div>)}
      </dl>
    </section>
    {saved && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">Đã lưu! Nội dung mới sẽ được dùng từ lần mở chương tiếp theo.</p>}
    {phase === "view" ? <>
      <p className="text-sm text-slate-600">Em có thể chọn lại thông tin và sở thích của mình bất cứ lúc nào.</p>
      <div className="flex flex-wrap gap-3">
        <button className="ws-btn primary" onClick={() => { setPicked({}); setSaved(false); setError(""); setPhase("edit"); }}>Thay đổi câu trả lời</button>
        {onClose && <button className="ws-btn" onClick={onClose}>Xong</button>}
      </div>
    </> : <form className="grid gap-5" onSubmit={async (event) => {
      event.preventDefault();
      if (busy) return;
      setBusy(true);
      setError("");
      try {
        const result = await personalizationApi.saveForChild("CHILD", picked);
        const step = personalizationStep(result);
        setView(result);
        if (step.done) finish(result); else setPhase("resolve");
      } catch (e) { setError(e.message || "Chưa lưu được, em thử lại nhé."); }
      finally { setBusy(false); }
    }}>
      <p className="text-sm text-slate-600">Em chọn lại câu trả lời muốn dùng nhé. Câu nào chưa muốn trả lời, em có thể để trống. Nội dung mới sẽ được dùng từ lần mở chương tiếp theo.</p>
      <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
        {DIMENSIONS.map((dim) => <fieldset key={dim} className="border-0 p-0">
          <legend className="mb-2 font-semibold text-slate-800">{CHILD_QUESTIONS[dim]}</legend>
          <div className="flex flex-wrap gap-2">
            {[...(view.catalog?.[dim] || []), null].map((value) => <button key={value ?? "unknown"} type="button"
              aria-pressed={(picked[dim] ?? null) === value}
              className={`min-h-11 rounded-xl border-2 px-3 py-2 text-sm font-semibold ${(picked[dim] ?? null) === value ? "border-amber-500 bg-amber-50 text-amber-900" : "border-slate-200 bg-white text-slate-700"}`}
              onClick={() => setPicked((previous) => {
                const next = { ...previous };
                if (value === null) delete next[dim]; else next[dim] = value;
                return next;
              })}>{value === null ? "Chưa muốn trả lời" : VALUE_LABELS[value] || value}</button>)}
          </div>
        </fieldset>)}
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
        <button type="submit" disabled={busy} className="ws-btn primary">{busy ? "Đang lưu…" : "Lưu câu trả lời"}</button>
        <button type="button" disabled={busy} className="ws-btn" onClick={() => setPhase("view")}>Hủy</button>
      </div>
    </form>}
  </div>;
}

export default function KidPersonalization() {
  const { actor } = useWorkspace();
  return <div className="mx-auto max-w-3xl rounded-3xl border border-amber-200 bg-white p-5 sm:p-8">
    <h1 className="mb-5 text-2xl font-bold text-slate-800">Cá nhân hoá của em</h1>
    <KidPersonalizationEditor key={novelProgressOwner(actor)} />
  </div>;
}
