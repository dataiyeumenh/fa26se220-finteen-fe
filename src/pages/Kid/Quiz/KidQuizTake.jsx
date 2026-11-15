import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "@/features/workspace/ui";
import { useKidQuiz } from "./hooks/useKidQuizzes";
import { ContentSkeleton } from "@/components/feedback/LoadingState";

export default function KidQuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quiz, answers, result, busy, error, choose, submit } = useKidQuiz(id);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  if (error && !quiz)
    return (
      <>
        <h1>Không thể mở bài</h1>
        <p>{error}</p>
        <Link className="ws-btn" to="/dashboard/kid/quiz">
          Quay lại
        </Link>
      </>
    );
  if (!quiz) return <ContentSkeleton variant="cards" cards={2} label="Đang tải đề Quiz…" />;
  return (
    <div className="ws-quiz-page">
      <header className="ws-quiz-page-header">
        <div>
          <Link to="/dashboard/kid/quiz">← Danh sách Quiz</Link>
          <h1>{quiz.title}</h1>
          <p>{quiz.questions.length} câu · chỉ được nộp một lần</p>
        </div>
      </header>
      {error && (
        <p className="ws-notice" role="alert">
          {error}
        </p>
      )}
      {!result && (
        <form
          className="ws-quiz-page-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!busy) setConfirmSubmit(true);
          }}
        >
          <div className="ws-quiz-question-list">
            {quiz.questions.map((question, index) => (
              <fieldset className="ws-question ws-checks" key={question.id}>
                <legend>
                  {index + 1}. {question.stem}
                </legend>
                {question.options.map((option, optionIndex) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === optionIndex}
                      onChange={() => choose(question.id, optionIndex)}
                    />
                    <b>{String.fromCharCode(65 + optionIndex)}</b>
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
          <button className="ws-btn primary" disabled={busy}>
            {busy ? "Đang nộp…" : "Nộp bài"}
          </button>
        </form>
      )}
      {confirmSubmit && !result && (
        <Modal
          className="ws-quiz-submit-modal"
          title="Sẵn sàng nộp bài?"
          description="Bạn chỉ được nộp bài một lần. Hãy kiểm tra lại các câu trả lời trước khi xác nhận."
          onClose={() => setConfirmSubmit(false)}
        >
          <div className="ws-quiz-submit-summary">
            <span className="ws-quiz-submit-icon" aria-hidden="true"><Send size={26} /></span>
            <div>
              <strong>{quiz.title}</strong>
              <p>Đã trả lời {quiz.questions.filter((question) => answers[question.id] != null).length}/{quiz.questions.length} câu</p>
            </div>
          </div>
          {quiz.questions.some((question) => answers[question.id] == null) && (
            <p className="ws-quiz-submit-warning" role="status">
              Còn {quiz.questions.filter((question) => answers[question.id] == null).length} câu chưa trả lời. Bạn có thể quay lại để hoàn thành bài.
            </p>
          )}
          <div className="ws-quiz-submit-actions">
            <button type="button" className="ws-btn" autoFocus onClick={() => setConfirmSubmit(false)}>
              Quay lại làm bài
            </button>
            <button
              type="button"
              className="ws-btn primary"
              disabled={busy}
              onClick={() => {
                setConfirmSubmit(false);
                void submit();
              }}
            >
              <Send size={16} /> Xác nhận nộp bài
            </button>
          </div>
        </Modal>
      )}
      {result && (
        <Modal
          title="Kết quả bài làm"
          onClose={() => navigate("/dashboard/kid/quiz")}
        >
          <CheckCircle2 />
          <h2>
            {result.score}/{result.totalQuestions} câu đúng
          </h2>
          <button
            className="ws-btn primary"
            onClick={() => navigate("/dashboard/kid/quiz")}
          >
            Hoàn tất
          </button>
        </Modal>
      )}
    </div>
  );
}
