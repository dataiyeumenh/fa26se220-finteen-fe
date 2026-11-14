import { STATUS_LABELS } from "./model.js";

export function PersonalizationStatus({ status }) {
  return <p className="text-sm font-semibold text-slate-600" role="status">
    Cá nhân hoá: {STATUS_LABELS[status] || status || "Chưa có trạng thái"}
  </p>;
}
