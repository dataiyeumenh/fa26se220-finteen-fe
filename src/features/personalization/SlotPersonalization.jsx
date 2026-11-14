import { useEffect, useState } from "react";
import { personalizationApi } from "../../api/personalization.api.js";
import { Modal } from "../workspace/ui";
import ParentPersonalization from "../../pages/Parent/Learners/components/ParentPersonalization.jsx";
import { PersonalizationStatus } from "./PersonalizationStatus.jsx";

// Teachers share the status view, but only FAMILY owners get the editor.
export function SlotPersonalization({ slot, context }) {
  const [view, setView] = useState(null);
  const [open, setOpen] = useState(false);
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
    {context === "FAMILY" && slot.status === "ACTIVE" && <button className="ws-btn" onClick={() => setOpen(true)}>Cá nhân hoá cho bé</button>}
    {open && context === "FAMILY" && <Modal title={`Cá nhân hoá cho ${slot.displayName}`} description="Chọn giới tính, tuổi và sở thích của bé." onClose={() => setOpen(false)}>
      <ParentPersonalization key={slot.id} slot={slot} onSaved={setView} onClose={() => setOpen(false)} />
    </Modal>}
  </div>;
}
