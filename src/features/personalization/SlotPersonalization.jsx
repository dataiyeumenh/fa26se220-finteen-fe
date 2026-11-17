import { useEffect, useState } from "react";
import { personalizationApi } from "../../api/personalization.api.js";
import { PersonalizationStatus } from "./PersonalizationStatus.jsx";

// Parents and teachers share the read-only status view.
export function SlotPersonalization({ slot }) {
  const [view, setView] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    personalizationApi.getForParent(slot.id).then((result) => {
      if (alive) { setView(result); setError(""); }
    }).catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [slot.id, retry]);
  return <div className="my-3 grid gap-2">
    {view ? <PersonalizationStatus status={view.status} /> : <p role="status">{error || "Đang tải cá nhân hoá…"}</p>}
    {error && <button className="ws-btn" onClick={() => setRetry((n) => n + 1)}>Thử lại trạng thái</button>}
  </div>;
}
