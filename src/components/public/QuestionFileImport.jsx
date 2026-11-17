import { useState } from "react";
import { CircleHelp, Download, FileCheck2, FileUp, UploadCloud } from "lucide-react";
import { useId } from "react";
import { parseQuizFile, QUIZ_CSV_TEMPLATE } from "../../pages/Teacher/Quiz/quizImport.js";
import { vietnameseError } from "../../lib/vietnameseMessages.js";
import { Modal } from "../../features/workspace/ui.jsx";

// Shared by teacher Quiz and the internal question library.
export default function QuestionFileImport({ questions, onChange, disabled = false }) {
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);
  const inputId = useId();
  const readFile = async (file) => {
        onChange([]); setError("");
        if (!file) return;
        setFileName(file.name);
        setReading(true);
        try {
          if (file.size > 1024 * 1024) throw new Error("Tệp vượt quá dung lượng 1 MB.");
          onChange(parseQuizFile(await file.text(), file.name));
        } catch (value) { setError(vietnameseError(value, "Không đọc được tệp câu hỏi. Vui lòng chọn lại tệp.")); }
        finally { setReading(false); }
  };
  return <div className="question-import">
    <div className="question-import__intro">
      <div><h4>Nhập nhanh danh sách câu hỏi</h4><p>Tải tệp mẫu, điền trong Excel rồi lưu lại để nhập tối đa 100 câu hỏi.</p></div>
      <div className="question-import__intro-actions">
        <button type="button" className="ws-btn" onClick={() => setGuideOpen(true)}><CircleHelp size={16}/>Hướng dẫn sử dụng</button>
        <a className="ws-btn" download="mau-cau-hoi-quiz.csv" href={'data:text/csv;charset=utf-8,' + encodeURIComponent(QUIZ_CSV_TEMPLATE)}><Download size={16}/>Tải tệp mẫu</a>
      </div>
    </div>
    {guideOpen && <Modal className="question-import__guide-modal" title="Cách nhập câu hỏi từ tệp" description="Thầy cô chỉ cần tải tệp mẫu, điền câu hỏi trong Excel rồi tải lại lên FinTeen." onClose={() => setGuideOpen(false)}>
      <div className="question-import__guide">
        <ol>
          <li><strong>Tải tệp mẫu</strong><span>Bấm “Tải tệp mẫu”, sau đó mở tệp bằng Microsoft Excel hoặc Google Sheets.</span></li>
          <li><strong>Điền mỗi câu hỏi trên một dòng</strong><span>Nhập nội dung câu hỏi và từ 2 đến 4 phương án ở các cột “Đáp án A” đến “Đáp án D”. Có thể viết theo mẫu “A. Nội dung đáp án”.</span></li>
          <li><strong>Đánh dấu đáp án đúng</strong><span>Ở cột “Đáp án đúng”, chỉ nhập một chữ A, B, C hoặc D tương ứng với phương án đúng.</span></li>
          <li><strong>Lưu đúng định dạng</strong><span>Trong Excel, chọn “Lưu thành” và chọn loại tệp “CSV UTF-8”. Không đổi tên các cột ở dòng đầu tiên.</span></li>
          <li><strong>Tải tệp lên và kiểm tra</strong><span>Bấm “Chọn tệp”, mở file vừa lưu và xem lại câu hỏi trước khi lưu vào đề.</span></li>
        </ol>
        <div className="question-import__guide-example">
          <strong>Ví dụ một dòng đã điền đúng</strong>
          <div className="ws-table-wrap">
            <table>
              <thead><tr><th>Câu hỏi</th><th>Đáp án A</th><th>Đáp án B</th><th>Đáp án đúng</th></tr></thead>
              <tbody><tr><td>Khoản tiền dự phòng gọi là gì?</td><td>A. Quỹ khẩn cấp</td><td>B. Tiền tiêu vặt</td><td>A</td></tr></tbody>
            </table>
          </div>
        </div>
        <p className="ws-notice"><strong>Lưu ý:</strong> Không tải trực tiếp file <code>.xlsx</code>. Hãy lưu file Excel thành <code>.csv</code> trước khi chọn tệp.</p>
        <div className="ws-actions">
          <a className="ws-btn primary" download="mau-cau-hoi-quiz.csv" href={'data:text/csv;charset=utf-8,' + encodeURIComponent(QUIZ_CSV_TEMPLATE)}><Download size={16}/>Tải tệp mẫu</a>
          <button type="button" className="ws-btn" onClick={() => setGuideOpen(false)}>Đã hiểu</button>
        </div>
      </div>
    </Modal>}
    <label className={`question-import__dropzone ${fileName ? "has-file" : ""} ${disabled || reading ? "is-disabled" : ""}`} htmlFor={inputId} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (!disabled && !reading) void readFile(event.dataTransfer.files?.[0]); }}>
      <input id={inputId} type="file" accept=".json,.csv" disabled={disabled || reading} onChange={(event) => void readFile(event.target.files?.[0])}/>
      <span className="question-import__icon">{fileName ? <FileCheck2/> : <UploadCloud/>}</span>
      <span><strong>{fileName || "Chọn tệp câu hỏi"}</strong><small>{fileName ? "Bấm để chọn tệp khác" : "Kéo thả tệp vào đây hoặc dùng nút Chọn tệp"}</small></span>
      <span className="ws-btn primary"><FileUp size={16}/>{reading ? "Đang đọc…" : "Chọn tệp"}</span>
    </label>
    {error && <p className="question-import__message error" role="alert">{error}</p>}
    {reading && <p className="question-import__message" role="status">Đang kiểm tra nội dung tệp…</p>}
    {questions.length > 0 && <>
      <p className="question-import__success"><FileCheck2 size={18}/>Đã đọc {questions.length} câu hỏi. Vui lòng xem lại trước khi lưu.</p>
      <div className="question-import__preview">
        {questions.map((q, i) => <article key={q.id || i}><strong>{i + 1}. {q.stem}</strong><ol type="A">{q.options.map((o, j) => <li key={j}>{o}{j === q.correctIndex ? " ✓ Đáp án đúng" : ""}</li>)}</ol></article>)}
      </div>
    </>}
  </div>;
}
