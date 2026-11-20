import { useRef, useState } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import "./confirm-dialog.css";

export default function ConfirmDialog({ title, description, children, confirmLabel, cancelLabel = "Hủy", busyLabel = "Đang xử lý…", onConfirm, onClose, className = "", disabled = false }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const cancelButton = useRef(null);
  const confirmAction = async () => {
    if (submitting.current || disabled) return;
    submitting.current = true;
    setBusy(true); setError("");
    try { await onConfirm(); onClose(); }
    catch (value) { setError(value?.message || "Không thể hoàn tất thao tác. Vui lòng thử lại."); }
    finally { submitting.current = false; setBusy(false); }
  };
  return <Dialog open onOpenChange={(open) => { if (!open && !submitting.current && !disabled) onClose(); }}>
    <DialogContent
      className={`ft-confirm-dialog ${className}`.trim()}
      role="alertdialog"
      aria-busy={busy}
      onOpenAutoFocus={(event) => { event.preventDefault(); cancelButton.current?.focus(); }}
      onInteractOutside={(event) => event.preventDefault()}
    >
      <span className="ft-confirm-icon"><AlertTriangle size={24} aria-hidden="true" /></span>
      <DialogTitle className="ft-confirm-title">{title}</DialogTitle>
      <DialogDescription className="ft-confirm-description">{description}</DialogDescription>
      {children}
      {error && <p className="ft-confirm-error" role="alert">{error}</p>}
      <div className="ft-confirm-actions">
        <button ref={cancelButton} type="button" disabled={busy || disabled} onClick={() => { if (!submitting.current && !disabled) onClose(); }}>{cancelLabel}</button>
        <button type="button" className="is-danger" disabled={busy || disabled} onClick={() => void confirmAction()}>{busy && <LoaderCircle size={16} className="ft-confirm-spinner" aria-hidden="true" />}{busy ? busyLabel : confirmLabel}</button>
      </div>
    </DialogContent>
  </Dialog>;
}
