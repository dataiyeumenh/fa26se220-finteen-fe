import { CheckCircle2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Empty, Modal } from "@/features/workspace/ui";
import { useKidQuiz } from "./hooks/useKidQuizzes";

export default function KidQuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quiz, answers, result, busy, error, choose, submit } = useKidQuiz(id);
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
  if (!quiz) return <Empty>Đang tải đề Quiz…</Empty>;
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
            if (window.confirm("Nộp bài ngay? Bạn chỉ được nộp một lần."))
              void submit();
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
