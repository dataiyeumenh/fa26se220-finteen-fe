import { useEffect, useState } from "react";
import { Circle, CircleCheck, Save } from "lucide-react";
import { personalizationApi } from "../../../../api/personalization.api.js";
import { DIMENSIONS, DIMENSION_LABELS, VALUE_LABELS, parentAnswers } from "../../../../features/personalization/model.js";
import { PersonalizationStatus } from "../../../../features/personalization/PersonalizationStatus.jsx";
import "./parent-personalization.css";

export default function ParentPersonalization({ slot, onSaved, onClose }) {
  const [view, setView] = useState(null);
  const [answers, setAnswers] = useState(parentAnswers());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    personalizationApi.getForParent(slot.id).then((result) => {
      if (!alive) return;
      setView(result);
      setAnswers(parentAnswers(result.parent));
      setError("");
    }).catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [slot.id, retry]);
  if (!view) return <div>
    <p role={error ? "alert" : "status"}>{error || "Đang tải cá nhân hoá…"}</p>
    {error && <button className="ws-btn" onClick={() => setRetry((n) => n + 1)}>Thử lại</button>}
  </div>;
  return <form className="ws-form" onSubmit={async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await personalizationApi.saveForParent(slot.id, parentAnswers(answers));
      onSaved(result);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }}>
    <PersonalizationStatus status={view.status} />
    <section aria-label="Bé đang nhận nội dung" className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
      <p className="mb-3 font-semibold">Bé đang nhận nội dung</p>
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {DIMENSIONS.map((dim) => {
          const value = view.labels?.[dim];
          return <div key={dim} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <dt className="text-xs text-slate-500">{DIMENSION_LABELS[dim]}</dt>
            <dd className="mt-1 font-semibold">{value ? VALUE_LABELS[value] || value : "Bản gốc"}</dd>
          </div>;
        })}
      </dl>
    </section>
    <p>Không chắc câu nào, chọn “Không biết, để bé chọn” ở câu đó.</p>
    <fieldset disabled={busy} className="grid gap-4 border-0 p-0">
      {DIMENSIONS.map((dim) => <fieldset key={dim} className="border-0 p-0">
        <legend className="mb-2 font-semibold">{DIMENSION_LABELS[dim]}</legend>
        <div className="flex flex-wrap gap-2">
          {[...(view.catalog?.[dim] || []), null].map((value) => {
            const selected = answers[dim] === value;
            const Indicator = selected ? CircleCheck : Circle;
            return <button type="button" key={value ?? "unknown"}
              className="parent-personalization-choice" aria-pressed={selected}
              onClick={() => setAnswers((previous) => ({ ...previous, [dim]: value }))}>
              <Indicator size={17} aria-hidden="true" />
              <span>{value === null ? "Không biết, để bé chọn" : VALUE_LABELS[value] || value}</span>
            </button>;
          })}
        </div>
      </fieldset>)}
    </fieldset>
    {error && <p className="ws-notice" role="alert">{error}</p>}
    <div className="parent-personalization-actions">
      <p>Bấm Lưu để cập nhật câu trả lời.</p>
      <button type="submit" className="ws-btn primary" disabled={busy}>
        <Save size={17} aria-hidden="true" />
        {busy ? "Đang lưu…" : "Lưu cá nhân hoá"}
      </button>
    </div>
  </form>;
}
