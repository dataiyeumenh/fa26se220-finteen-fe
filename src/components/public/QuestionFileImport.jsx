import { useState } from "react";
import { parseQuizFile, QUIZ_CSV_TEMPLATE } from "../../pages/Teacher/Quiz/quizImport.js";
import { vietnameseError } from "../../lib/vietnameseMessages.js";

// Shared by teacher Quiz and the internal question library.
export default function QuestionFileImport({ questions, onChange, disabled = false }) {
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  return <div>
    <p>Mỗi dòng trong file CSV là một câu hỏi. Tối đa 100 câu, file 1 MB.</p>
    <ol>
      <li>Tải file mẫu và mở bằng Excel. Giữ nguyên hàng tiêu đề.</li>
      <li>Điền nội dung ở cột <strong>Câu hỏi</strong> và bốn phương án ở các cột <strong>Lựa chọn A–D</strong>.</li>
      <li>Ở cột <strong>Đáp án đúng</strong>, nhập chữ <strong>A, B, C hoặc D</strong>. Ví dụ: chọn phương án thứ hai thì nhập <strong>B</strong>.</li>
      <li>Xóa hoặc thay hai câu ví dụ, lưu dưới dạng <strong>CSV UTF-8</strong>, rồi chọn file bên dưới.</li>
    </ol>
    <details><summary>Dành cho người dùng file JSON hoặc CSV mẫu cũ</summary><p>JSON: stem là nội dung câu hỏi, options là bốn lựa chọn; correctIndex là vị trí đáp án đúng: 0 = A, 1 = B, 2 = C, 3 = D. CSV mẫu cũ vẫn được hỗ trợ.</p></details>
    <a download="quiz-template.csv" href={'data:text/csv;charset=utf-8,' + encodeURIComponent(QUIZ_CSV_TEMPLATE)}>Tải file mẫu CSV</a>
    <label style={{ display: "block", margin: "16px 0" }}>Chọn file câu hỏi
      <input type="file" accept=".json,.csv" disabled={disabled || reading} onChange={async (event) => {
        const file = event.target.files?.[0];
        onChange([]); setError("");
        if (!file) return;
        setReading(true);
        try {
          if (file.size > 1024 * 1024) throw new Error("File vượt quá 1 MB.");
          onChange(parseQuizFile(await file.text(), file.name));
        } catch (value) { setError(vietnameseError(value, "Không đọc được tệp câu hỏi. Vui lòng chọn lại tệp.")); }
        finally { setReading(false); }
      }} />
    </label>
    {error && <p role="alert">{error}</p>}
    {reading && <p role="status">Đang đọc file…</p>}
    {questions.length > 0 && <>
      <p>Đã kiểm tra {questions.length} câu hỏi. Xem lại trước khi lưu:</p>
      <div style={{ maxHeight: 260, overflowY: "auto" }}>
        {questions.map((q, i) => <article key={q.id}><strong>{i + 1}. {q.stem}</strong><ol type="A">{q.options.map((o, j) => <li key={j}>{o}{j === q.correctIndex ? " ✓ Đáp án đúng" : ""}</li>)}</ol></article>)}
      </div>
    </>}
  </div>;
}
