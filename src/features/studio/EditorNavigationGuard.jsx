import { useCallback, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { AlertTriangle, LoaderCircle, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../components/ui/dialog';
import '../../components/shared/confirm-dialog.css';

/** One router blocker covers links, programmatic navigation and browser Back/Forward. */
export default function EditorNavigationGuard({ code, saveRef, busy, logoutPending, onCancelLogout, onLogout }) {
  const shouldBlock = useCallback(({ currentLocation, nextLocation }) => Boolean(saveRef.current?.dirty)
    && (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search), [saveRef]);
  const blocker = useBlocker(shouldBlock);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const running = useRef(false);
  const cancelButton = useRef(null);
  const blocked = blocker.state === 'blocked';
  const disabled = saving || busy;
  const stay = () => {
    if (running.current || busy) return;
    setError('');
    if (blocked) blocker.reset();
    onCancelLogout();
  };
  const proceed = async () => {
    if (logoutPending) {
      if (blocked) blocker.reset();
      onCancelLogout();
      await onLogout();
    } else if (blocked) blocker.proceed();
  };
  const leave = async saveFirst => {
    if (running.current || busy) return;
    running.current = true;
    setSaving(true); setError('');
    try {
      if (saveFirst && saveRef.current?.dirty) {
        const result = await saveRef.current.save({ leaving: true });
        if (!result?.saved) { setError(result?.error || 'Chưa lưu được bản nháp. Vui lòng thử lại.'); return; }
      }
      await proceed();
    } catch (failure) { setError(failure?.message || 'Chưa thể rời trình soạn. Vui lòng thử lại.'); }
    finally { running.current = false; setSaving(false); }
  };
  if (!blocked && !logoutPending) return null;
  return <Dialog open onOpenChange={open => { if (!open) stay(); }}>
    <DialogContent className="ft-confirm-dialog ft-leave-editor-confirm" role="alertdialog" aria-busy={disabled}
      onOpenAutoFocus={event => { event.preventDefault(); cancelButton.current?.focus(); }}
      onInteractOutside={event => event.preventDefault()}>
      <span className="ft-confirm-icon"><AlertTriangle size={24} aria-hidden="true" /></span>
      <DialogTitle className="ft-confirm-title">Rời trình soạn khi chưa lưu?</DialogTitle>
      <DialogDescription className="ft-confirm-description">Bạn có thay đổi chưa lưu. Lưu nháp trước khi {logoutPending ? 'đăng xuất' : 'rời trang'} để tiếp tục chỉnh sửa sau.</DialogDescription>
      <div className="ft-leave-editor-note"><span>Bản soạn hiện tại</span><strong>{code}</strong></div>
      {error && <p className="ft-confirm-error" role="alert">{error}</p>}
      {busy && !saving && <p className="ft-confirm-description" role="status">Đang xử lý bản nháp. Vui lòng chờ trước khi rời trang.</p>}
      <div className="ft-confirm-actions">
        <button ref={cancelButton} type="button" disabled={disabled} onClick={stay}>Ở lại chỉnh sửa</button>
        <button type="button" className="is-discard" disabled={disabled} onClick={() => void leave(false)}>Không lưu và rời đi</button>
        <button type="button" className="is-primary" disabled={disabled} onClick={() => void leave(true)}>{saving ? <LoaderCircle size={16} className="ft-confirm-spinner" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}{saving ? 'Đang xử lý…' : 'Lưu nháp và rời đi'}</button>
      </div>
    </DialogContent>
  </Dialog>;
}
