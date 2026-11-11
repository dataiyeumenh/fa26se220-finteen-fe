import { useRef, useState } from "react";
import QuestionFileImport from "../../components/public/QuestionFileImport.jsx";
import { Btn, StudioDialog } from "./ui";
import { studioApi, formatError } from "./studioClient";
import { importQuestionRows } from "./questionImport.js";

export default function QuestionImportDialog({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [pool, setPool] = useState("CEE");
  const [chapter, setChapter] = useState("");
  const [saved, setSaved] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const running = useRef(false);
  const done = questions.length > 0 && saved === questions.length;
  return <StudioDialog title="Nhập câu hỏi từ tệp" onClose={onClose} busy={busy} wide>
    <form className="sp-dialog-body" onSubmit={async (event) => {
      event.preventDefault();
      if (running.current || !questions.length || done || !pool.trim()) return;
      running.current = true; setBusy(true); setError("");
      try {
        await importQuestionRows(studioApi, questions, { pool, chapter: chapter ? Number(chapter) : null }, saved, setSaved);
      } catch (value) {
        setError(`${formatError(value)} Các câu chưa xác nhận lưu chưa được tính là thành công. Nếu lỗi mạng, hãy kiểm tra kho trước khi thử lại để tránh trùng câu.`);
      } finally { running.current = false; setBusy(false); }
    }}>
      <p role="note">Lưu thật vào kho câu hỏi qua API. Câu hỏi trong file dùng chung kho và chương bạn chọn bên dưới; chưa tự tạo hoặc phát hành đề Quiz.</p>
      <QuestionFileImport questions={questions} onChange={setQuestions} disabled={busy || saved > 0} />
      <fieldset disabled={busy || saved > 0} className="sp-grid-2">
        <label className="sp-field">Kho câu hỏi<input className="sp-input" required value={pool} onChange={(e) => setPool(e.target.value)} /></label>
        <label className="sp-field">Chương (để trống nếu dùng chung)<input className="sp-input" type="number" min={1} step={1} value={chapter} onChange={(e) => setChapter(e.target.value)} /></label>
      </fieldset>
      {questions.length > 0 && <p role="status">Đã lưu {saved}/{questions.length} câu hỏi{done ? ". Hoàn tất import." : busy ? "…" : "."}</p>}
      {error && <p className="sp-inline-error" role="alert">{error}</p>}
      <div className="sp-dialog-actions">
        <Btn disabled={busy} onClick={onClose}>{done ? "Đóng" : "Hủy / Đóng"}</Btn>
        {!done && <Btn type="submit" tone="primary" disabled={busy || !questions.length || !pool.trim()}>{busy ? "Đang lưu…" : saved ? "Tiếp tục các câu chưa lưu" : "Lưu vào kho câu hỏi"}</Btn>}
      </div>
    </form>
  </StudioDialog>;
}
