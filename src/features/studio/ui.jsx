// Mảnh UI dùng chung của Studio. Btn / Panel / Tag giữ nguyên API vì trình soạn cũng dùng.
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { cn } from "@/lib/utils";
import "./studio-pages.css";

export function Tag({ tone = "DRAFT", className, children }) {
  return (
    <span className={cn("sp-tag", `t-${tone}`, className)}>{children}</span>
  );
}

const BTN_TONES = {
  plain: "",
  primary: "is-primary",
  danger: "is-danger",
  "danger-solid": "is-danger-solid",
  quiet: "is-quiet",
};

export function Btn({ tone = "plain", className, ...props }) {
  return (
    <button
      type="button"
      className={cn("sp-btn", BTN_TONES[tone], className)}
      {...props}
    />
  );
}

export function Panel({ title, actions, className, children }) {
  return (
    <section className={cn("sp-panel", className)}>
      {(title || actions) && (
        <div className="sp-panel-head">
          {title && <h2>{title}</h2>}
          {actions && <div className="sp-panel-actions">{actions}</div>}
        </div>
      )}
      <div className="sp-panel-body">{children}</div>
    </section>
  );
}

/** Đầu màn: tên màn, một câu nói màn để làm gì, nút chính bên phải. */
export function PageHeader({ title, intro, actions, className }) {
  return (
    <header className={cn("sp-head", className)}>
      <div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {actions && <div className="sp-head-actions">{actions}</div>}
    </header>
  );
}

/** Trạng thái đang tải / rỗng / lỗi: luôn nói chuyện gì đang xảy ra và việc tiếp theo. */
export function StateBox({ kind, title, actions, children }) {
  if (kind === "loading")
    return (
      <div className="sp-state is-loading" role="status">
        {children || "Đang tải…"}
      </div>
    );
  return (
    <div
      className={cn("sp-state", kind === "error" && "is-error")}
      role={kind === "error" ? "alert" : undefined}
    >
      {title && <h2>{title}</h2>}
      {children && <p>{children}</p>}
      {actions && <div className="sp-head-actions">{actions}</div>}
    </div>
  );
}

export function StudioDialog({
  title,
  onClose,
  busy = false,
  wide = false,
  children,
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        className={cn(
          "sp-dialog max-h-[88vh] overflow-auto",
          wide ? "max-w-4xl" : "max-w-xl",
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sp-dialog-title">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hỏi lại trước thao tác nặng. `children` nói rõ hậu quả; `fields` là ô nhập (lý do…) nếu có.
 * Nút xác nhận mang đúng tên hành động, không dùng chữ chung chung.
 */
export function ConfirmDialog({
  title,
  confirmLabel,
  tone = "primary",
  busy,
  disabled,
  error,
  onConfirm,
  onClose,
  fields,
  children,
}) {
  return (
    <StudioDialog title={title} onClose={onClose} busy={busy}>
      <form
        className="sp-dialog-body"
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled && !busy) onConfirm();
        }}
      >
        <div className={cn("sp-consequence", tone === "danger" && "is-danger")}>
          {children}
        </div>
        {fields}
        {error && (
          <div className="sp-inline-error" role="alert">
            {error}
          </div>
        )}
        <div className="sp-dialog-actions">
          <Btn disabled={busy} onClick={onClose}>
            Huỷ
          </Btn>
          <Btn
            type="submit"
            tone={tone === "danger" ? "danger-solid" : "primary"}
            disabled={busy || disabled}
          >
            {busy ? "Đang xử lý…" : confirmLabel}
          </Btn>
        </div>
      </form>
    </StudioDialog>
  );
}
