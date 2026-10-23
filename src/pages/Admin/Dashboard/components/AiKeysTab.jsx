// Tab "Khoá AI" (24/10 — bản DEMO Claude làm theo lời Hưng; team FE trang trí lại cho đồng bộ).
// API: build/api-docs/plan-admin.md mục "Khoá AI". Khoá thật chỉ đi một chiều lên BE, không bao giờ quay lại trình duyệt.
import { useEffect, useState } from "react";
import { KeyRound, Pause, Play, RefreshCw, Trash2, Zap } from "lucide-react";
import { auth } from "../../../../api/auth.api";

const fmt = (t) => (t ? new Date(t).toLocaleString("vi-VN") : "—");

function stateOf(k) {
  if (!k.enabled) return ["Đã dừng", "#64748b"];
  if (k.coolDownUntil && new Date(k.coolDownUntil).getTime() > Date.now())
    return [`Nghỉ tới ${new Date(k.coolDownUntil).toLocaleTimeString("vi-VN")}`, "#b45309"];
  if (!k.lastTestAt) return ["Chưa thử", "#64748b"];
  return k.lastTestOk ? ["Dùng được", "#15803d"] : ["Lỗi", "#dc2626"];
}

export default function AiKeysTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);
  const [form, setForm] = useState({ provider: "GEMINI", alias: "", key: "", priority: "" });

  const load = async () => {
    setLoading(true);
    try {
      setRows((await auth.listAiKeys()) || []);
    } catch (e) {
      setNotice({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  const run = async (label, fn, okText) => {
    setBusy(label);
    setNotice(null);
    try {
      const r = await fn();
      setNotice({ type: "success", text: typeof okText === "function" ? okText(r) : okText });
      await load();
    } catch (e) {
      setNotice({ type: "error", text: `${e.code ?? ""} ${e.message}`.trim() });
    } finally {
      setBusy("");
    }
  };

  const add = () =>
    run(
      "add",
      () => auth.addAiKey(form),
      (k) => (k.lastTestOk ? `Đã nhập ${k.alias} — khoá dùng được.` : `Đã nhập ${k.alias} — thử lỗi: ${k.lastError}`),
    ).then(() => setForm((f) => ({ ...f, alias: "", key: "", priority: "" })));

  return (
    <>
      <section className="admin-card admin-section">
        <h2>
          <KeyRound size={18} /> Khoá AI
        </h2>
        <p>
          Hàng đợi AI dùng khoá <b>đang bật</b>, ưu tiên số nhỏ trước, bỏ qua khoá đang nghỉ (hết lượt → nghỉ 15 phút). Khoá
          lưu mã hoá, trang này chỉ thấy 4 ký tự cuối. Nhập xong máy chủ thử ngay một lần (không tốn lượt).
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
            <option>GEMINI</option>
            <option>OPENROUTER</option>
          </select>
          <input placeholder="Tên gợi nhớ, vd gemini-1" value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} />
          <input
            type="password"
            autoComplete="off"
            placeholder="Khoá API"
            style={{ minWidth: 280 }}
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
          />
          <input
            type="number"
            placeholder="Ưu tiên"
            style={{ width: 100 }}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          />
          <button className="admin-primary" disabled={busy === "add" || !form.alias || !form.key} onClick={add}>
            <Zap size={16} /> Nhập + thử
          </button>
        </div>
        {notice && (
          <div className={`admin-notice ${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>
            {notice.text}
          </div>
        )}
      </section>

      <section className="admin-card admin-table-card">
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nhà</th>
                <th>Tên</th>
                <th>Khoá</th>
                <th>Ưu tiên</th>
                <th>Trạng thái</th>
                <th>Lần thử</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>Đang tải…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>Chưa có khoá nào.</td>
                </tr>
              ) : (
                rows.map((k) => {
                  const [label, color] = stateOf(k);
                  return (
                    <tr key={k.id}>
                      <td>{k.provider}</td>
                      <td>
                        <b>{k.alias}</b>
                        <br />
                        <small>
                          {k.createdByName || ""} {fmt(k.createdAt)}
                        </small>
                      </td>
                      <td>
                        <code>{k.masked}</code>
                      </td>
                      <td>{k.priority ?? "—"}</td>
                      <td style={{ color, fontWeight: 600 }}>{label}</td>
                      <td>
                        {fmt(k.lastTestAt)}
                        {k.lastError && (
                          <>
                            <br />
                            <small>{k.lastError}</small>
                          </>
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <button
                          title="Thử lại"
                          disabled={!!busy}
                          onClick={() =>
                            run(k.id, () => auth.aiKeyAction(k.id, "test"), (r) =>
                              r.lastTestOk ? `${r.alias}: dùng được` : `${r.alias}: ${r.lastError}`,
                            )
                          }
                        >
                          <RefreshCw size={15} />
                        </button>{" "}
                        {k.enabled ? (
                          <button title="Dừng" disabled={!!busy} onClick={() => run(k.id, () => auth.aiKeyAction(k.id, "disable"), `Đã dừng ${k.alias}`)}>
                            <Pause size={15} />
                          </button>
                        ) : (
                          <button title="Bật lại" disabled={!!busy} onClick={() => run(k.id, () => auth.aiKeyAction(k.id, "enable"), `Đã bật ${k.alias}`)}>
                            <Play size={15} />
                          </button>
                        )}{" "}
                        <button
                          title="Xoá"
                          disabled={!!busy}
                          onClick={() => window.confirm(`Xoá hẳn khoá ${k.alias}?`) && run(k.id, () => auth.deleteAiKey(k.id), `Đã xoá ${k.alias}`)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
