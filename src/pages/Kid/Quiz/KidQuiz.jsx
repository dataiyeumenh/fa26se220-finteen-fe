import { CheckCircle2, ClipboardList, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Empty, Heading } from "@/features/workspace/ui";
import { dateLabel } from "@/features/workspace/format";
import { useKidQuizzes } from "./hooks/useKidQuizzes";

const score = (quiz) =>
  quiz.totalQuestions
    ? Number(((quiz.score / quiz.totalQuestions) * 10).toFixed(1))
    : 0;
export default function KidQuiz() {
  const { pending, completed, loading, error, refresh } = useKidQuizzes();
  return (
    <div className="ws-kid-quiz">
      <Heading
        title="Quiz của bạn"
        description="Hoàn thành bài kiểm tra của lớp và hậu trắc sau mỗi chương."
      >
        <button className="ws-btn" onClick={() => void refresh()}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </Heading>
      {error && (
        <p className="ws-notice" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <Empty>Đang tải danh sách Quiz…</Empty>
      ) : (
        <>
          <section className="ws-kid-quiz-overview">
            <article>
              <ClipboardList />
              <strong>{pending.length}</strong>
              <p>Bài chờ làm</p>
            </article>
            <article>
              <CheckCircle2 />
              <strong>{completed.length}</strong>
              <p>Đã hoàn thành</p>
            </article>
          </section>
          <section className="ws-kid-quiz-section">
            <h2>Chờ làm bài</h2>
            {pending.length ? (
              <div className="ws-kid-quiz-grid">
                {pending.map((quiz) => (
                  <article className="ws-kid-quiz-card pending" key={quiz.id}>
                    <span className="ws-pill">
                      {quiz.kind === "POST_TEST"
                        ? `Hậu trắc chương ${quiz.chapter}`
                        : "Đề giáo viên"}
                    </span>
                    <h3>{quiz.title}</h3>
                    <p>{quiz.questionCount} câu hỏi</p>
                    {quiz.overdue ? (
                      <button className="ws-btn" disabled>
                        Đã quá hạn
                      </button>
                    ) : (
                      <Link
                        className="ws-btn primary"
                        to={`/dashboard/kid/quiz/${quiz.id}`}
                      >
                        Bắt đầu làm bài
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <Empty>Không còn bài đang chờ.</Empty>
            )}
          </section>
          <section className="ws-kid-quiz-section">
            <h2>Đã hoàn thành</h2>
            {completed.length ? (
              <div className="ws-kid-quiz-completed">
                {completed.map((quiz) => (
                  <article key={quiz.id}>
                    <strong>{score(quiz)}/10</strong>
                    <div>
                      <h3>{quiz.title}</h3>
                      <p>Nộp {dateLabel(quiz.submittedAt)}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty>Chưa có bài đã hoàn thành.</Empty>
            )}
          </section>
        </>
      )}
    </div>
  );
}
