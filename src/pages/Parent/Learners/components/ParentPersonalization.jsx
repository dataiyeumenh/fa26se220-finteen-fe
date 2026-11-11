import { useEffect, useState } from "react";
import {
  DIMENSION_LABELS,
  personalizationApi,
  VALUE_EMOJI,
  VALUE_LABELS,
} from "../../../../api/personalization.api.js";

// Phụ huynh khảo sát cá nhân hoá cho bé (BE PR #57). Không bắt buộc; câu nào không biết thì "Để bé tự chọn" —
// bé sẽ được hỏi khi vào game. Game chỉ đổi vài chi tiết (nhân vật, món đồ, cách nói), bài học và điểm không đổi.
const QUESTION = {
  gender: "Nhân vật chính của bé",
  age: "Bé đang ở độ tuổi",
  interest: "Bé thích nhất",
};
const STATUS = {
  NOT_STARTED: ["Chưa khảo sát", "#64748b", "#f1f5f9"],
  WAITING_CHILD: ["Chờ bé trả lời", "#7c3aed", "#f3eeff"],
  WAITING_GAME: ["Chờ bé chọn trong game", "#db2777", "#fdf2f8"],
  COMPLETED: ["Đã xong", "#16a34a", "#e8f7ee"],
  SKIPPED: ["Đã bỏ qua một phần", "#b45309", "#fef3c7"],
};

export function PersonalizationStatus({ status }) {
  const [text, color, bg] = STATUS[status] || STATUS.NOT_STARTED;
  return (
    <span style={{ color, background: bg, borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
      {text}
    </span>
  );
}

export default function ParentPersonalization({ slot, onSaved, onClose }) {
  const [view, setView] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    personalizationApi
      .getForParent(slot.id)
      .then((v) => {
        setView(v);
        setAnswers(v.parent || {});
      })
      .catch((e) => setError(e.message));
  }, [slot.id]);

  const save = async (body) => {
    setBusy(true);
    setError("");
    try {
      const v = await personalizationApi.saveForParent(slot.id, body);
      setView(v);
      onSaved?.(v);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!view) return <p style={{ color: "#64748b" }}>{error || "Đang tải…"}</p>;
  const chip = (on, dashed) => ({
    border: `${dashed ? "1.5px dashed" : "1.5px solid"} ${on ? "#2563eb" : "#e2e8f0"}`,
    background: on ? "#2563eb" : "#fff",
    color: on ? "#fff" : dashed ? "#64748b" : "#334155",
    borderRadius: 999,
    padding: "7px 13px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <PersonalizationStatus status={view.status} />
        <span style={{ color: "#64748b", fontSize: 13 }}>
          Game đổi vài chi tiết cho hợp với {slot.displayName}. Bài học và điểm không đổi. Không chắc thì chọn "Để bé tự chọn".
        </span>
      </div>
      {["gender", "age", "interest"].map((dim) => (
        <div key={dim}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{QUESTION[dim]}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {view.catalog[dim].map((value) => (
              <button
                key={value}
                type="button"
                style={chip(answers[dim] === value)}
                onClick={() => setAnswers((a) => ({ ...a, [dim]: value }))}
              >
                {VALUE_EMOJI[value] ? `${VALUE_EMOJI[value]} ` : ""}
                {VALUE_LABELS[value] || value}
              </button>
            ))}
            <button
              type="button"
              style={chip(!answers[dim], true)}
              onClick={() => setAnswers((a) => ({ ...a, [dim]: null }))}
            >
              Để bé tự chọn
            </button>
          </div>
        </div>
      ))}
      {view.labels && Object.keys(view.labels).length > 0 && (
        <div style={{ fontSize: 13, color: "#475569", background: "#f8fafc", borderRadius: 12, padding: "10px 12px" }}>
          Game đang dùng:{" "}
          {Object.entries(view.labels)
            .map(([d, v]) => `${DIMENSION_LABELS[d]}: ${VALUE_LABELS[v] || v}`)
            .join(" · ")}
        </div>
      )}
      {error && <p style={{ color: "#dc2626", fontWeight: 600 }}>{error}</p>}
      <div className="ws-actions">
        <button className="ws-btn primary" disabled={busy} onClick={() => save(answers)}>
          Lưu
        </button>
        <button className="ws-btn" disabled={busy} onClick={() => save({})}>
          Không biết — để bé tự chọn hết
        </button>
      </div>
    </div>
  );
}
