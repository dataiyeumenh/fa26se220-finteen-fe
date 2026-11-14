import { LoaderCircle } from "lucide-react";
import "./loading-state.css";

export function InlineSpinner({ label = "Đang xử lý" }) {
  return (
    <span className="ft-inline-spinner" role="status" aria-label={label}>
      <LoaderCircle aria-hidden="true" />
    </span>
  );
}

export function PageLoader({ label = "Đang chuẩn bị không gian của bạn…", compact = false }) {
  return (
    <div className={`ft-page-loader${compact ? " is-compact" : ""}`} role="status" aria-live="polite">
      <div className="ft-page-loader-mark" aria-hidden="true">
        <img src="/brand/finteen-logo-v2.png" alt="" />
        <span><i /><i /><i /></span>
      </div>
      <strong>{label}</strong>
      <small>Chỉ mất một chút thôi nhé</small>
    </div>
  );
}

function Lines({ count = 3 }) {
  return (
    <div className="ft-skeleton-lines" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <span key={index} />)}
    </div>
  );
}

export function ContentSkeleton({ variant = "dashboard", label = "Đang tải dữ liệu…", cards = 4, rows = 5 }) {
  return (
    <section className={`ft-content-skeleton is-${variant}`} role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>
      {variant === "table" ? (
        <div className="ft-skeleton-table" aria-hidden="true">
          <div className="ft-skeleton-table-head" />
          {Array.from({ length: rows }, (_, index) => (
            <div className="ft-skeleton-table-row" key={index}>
              <span /><span /><span /><span />
            </div>
          ))}
        </div>
      ) : (
        <>
          {variant === "dashboard" && (
            <div className="ft-skeleton-hero" aria-hidden="true">
              <Lines count={3} />
              <span className="ft-skeleton-orb" />
            </div>
          )}
          <div className="ft-skeleton-grid" aria-hidden="true">
            {Array.from({ length: cards }, (_, index) => (
              <div className="ft-skeleton-card" key={index}>
                <span className="ft-skeleton-icon" />
                <Lines count={3} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
