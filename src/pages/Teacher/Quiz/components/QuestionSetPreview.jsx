import { useState } from "react";
import { BookOpen, CheckCircle2, Search } from "lucide-react";
import { Empty, Modal } from "@/features/workspace/ui";
import { selectRandomQuestions } from "../questionSets.js";

export default function QuestionSetPreview({ set, selected, onChange, onClose }) {
  const [query, setQuery] = useState("");
  const [randomCount, setRandomCount] = useState("");
  const [randomError, setRandomError] = useState("");
  const term = query.trim().toLocaleLowerCase("vi-VN");
  const questions = set.questions
    .map((question, index) => ({ question, number: index + 1 }))
    .filter(({ question }) => `${question.externalId || ""} ${question.stem || ""}`.toLocaleLowerCase("vi-VN").includes(term));

  return (
    <Modal
      title={`Bộ câu hỏi ${set.code}`}
      description="Tích những câu thầy cô muốn đưa vào ngân hàng câu hỏi của đề. Có thể chọn hoặc bỏ chọn bất kỳ câu nào."
      className="ws-question-set-modal"
      onClose={onClose}
    >
      <div className="ws-set-preview__toolbar">
        <span className="ws-set-preview__count"><BookOpen size={17} aria-hidden="true" />{set.questions.length} câu hỏi</span>
        <label className="ws-set-preview__search">
          <Search size={18} aria-hidden="true" />
          <input type="search" aria-label="Tìm câu hỏi trong bộ" placeholder="Tìm mã hoặc nội dung câu hỏi…" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button type="button" className="ws-btn" onClick={() => {
          const next = new Set(selected);
          const allVisibleSelected = questions.every(({ question }) => next.has(question.id));
          questions.forEach(({ question }) => allVisibleSelected ? next.delete(question.id) : next.add(question.id));
          onChange(next);
        }}>{questions.length && questions.every(({question}) => selected.has(question.id)) ? "Bỏ chọn các câu đang hiển thị" : "Chọn các câu đang hiển thị"}</button>
      </div>
      <div className="ws-set-preview__random">
        <label><span>Muốn hệ thống chọn giúp bao nhiêu câu?</span><input type="number" min="1" max={set.questions.length} value={randomCount} placeholder={`Nhập từ 1 đến ${set.questions.length}`} onChange={(event) => { setRandomCount(event.target.value); setRandomError(""); }}/></label>
        <button type="button" className="ws-btn primary" onClick={() => {
          const count = Number(randomCount);
          if (!Number.isInteger(count) || count < 1 || count > set.questions.length) { setRandomError(`Vui lòng nhập số nguyên từ 1 đến ${set.questions.length}.`); return; }
          onChange(selectRandomQuestions(selected, set.questions, count));
        }}>Chọn giúp tôi</button>
        <small>Hệ thống sẽ tự tích đủ số câu trong bộ này. Thầy cô vẫn có thể xem lại, tích thêm hoặc bỏ bớt từng câu; các bộ khác không bị thay đổi.</small>
      </div>
      {randomError && <p className="ws-field-error" role="alert">{randomError}</p>}
      <div className="ws-set-preview__body" tabIndex={0} role="region" aria-label={`Nội dung bộ ${set.code}`}>
        {questions.length ? (
          <ol className="ws-set-preview__questions">
            {questions.map(({ question, number }) => (
              <li className={`ws-set-preview__question ${selected.has(question.id) ? "is-selected" : ""}`} key={question.id}>
                <label className="ws-set-preview__select" aria-label={`Chọn câu ${number}`}><input type="checkbox" checked={selected.has(question.id)} onChange={() => { const next = new Set(selected); if (next.has(question.id)) next.delete(question.id); else next.add(question.id); onChange(next); }}/><span className="ws-set-preview__number">{number}</span></label>
                <div className="ws-set-preview__content">
                  <span className="ws-set-preview__code">{question.externalId || set.code}</span>
                  <h3>{question.stem}</h3>
                  {question.options?.length > 0 && (
                    <ul className="ws-set-preview__options">
                      {question.options.map((option, index) => (
                        <li key={index} className={question.correctIndex === index ? "is-correct" : ""}>
                          <span>{String.fromCharCode(65 + index)}</span>
                          <p>{option}</p>
                          {question.correctIndex === index && <CheckCircle2 size={18} aria-label="Đáp án đúng" />}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : <Empty>Không tìm thấy câu hỏi phù hợp.</Empty>}
      </div>
      <div className="ws-set-preview__footer">
        <span role="status">Đã chọn {set.questions.filter((question) => selected.has(question.id)).length}/{set.questions.length} câu trong bộ</span>
        <button type="button" className="ws-btn primary" onClick={onClose}>Xong</button>
      </div>
    </Modal>
  );
}
