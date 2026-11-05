import { useState } from "react";
import { BookOpen, CheckCircle2, Search } from "lucide-react";
import { Empty, Modal } from "@/features/workspace/ui";

export default function QuestionSetPreview({ set, onClose }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLocaleLowerCase("vi-VN");
  const questions = set.questions
    .map((question, index) => ({ question, number: index + 1 }))
    .filter(({ question }) => `${question.externalId || ""} ${question.stem || ""}`.toLocaleLowerCase("vi-VN").includes(term));

  return (
    <Modal
      title={`Bộ câu hỏi ${set.code}`}
      description="Xem nội dung và các lựa chọn trả lời trước khi chọn bộ cho đề kiểm tra."
      className="ws-question-set-modal"
      onClose={onClose}
    >
      <div className="ws-set-preview__toolbar">
        <span className="ws-set-preview__count"><BookOpen size={17} aria-hidden="true" />{set.questions.length} câu hỏi</span>
        <label className="ws-set-preview__search">
          <Search size={18} aria-hidden="true" />
          <input type="search" aria-label="Tìm câu hỏi trong bộ" placeholder="Tìm mã hoặc nội dung câu hỏi…" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      <div className="ws-set-preview__body" tabIndex={0} role="region" aria-label={`Nội dung bộ ${set.code}`}>
        {questions.length ? (
          <ol className="ws-set-preview__questions">
            {questions.map(({ question, number }) => (
              <li className="ws-set-preview__question" key={question.id}>
                <span className="ws-set-preview__number" aria-label={`Câu ${number}`}>{number}</span>
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
        <span role="status">Hiển thị {questions.length}/{set.questions.length} câu hỏi</span>
        <button type="button" className="ws-btn primary" onClick={onClose}>Đóng xem trước</button>
      </div>
    </Modal>
  );
}
