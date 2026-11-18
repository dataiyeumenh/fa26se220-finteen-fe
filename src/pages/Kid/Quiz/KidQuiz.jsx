import { CheckCircle2, ClipboardList, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Empty, Heading } from "@/features/workspace/ui";
import { useWorkspace } from "@/features/workspace/useWorkspace";
import { dateLabel } from "@/features/workspace/format";
import { useKidQuizzes } from "./hooks/useKidQuizzes";
import { ContentSkeleton } from "@/components/feedback/LoadingState";

const quizTotal = (quiz) => Number(quiz?.totalQuestions ?? quiz?.total ?? quiz?.questionCount) || 0;
const scoreOnTen = (value, total) => total > 0 ? `${value}/${total} câu đúng` : `${value} câu đúng`;
const scoreLabel = (quiz) => {
  if (quiz?.score == null) return "Chờ công bố";
  const total = quizTotal(quiz);
  return scoreOnTen(quiz.score, total);
};
const canRetryPractice = (quiz) => quiz?.mode === "PRACTICE" && !quiz?.overdue && (!quiz?.dueAt || Number.isNaN(new Date(quiz.dueAt).getTime()) || new Date(quiz.dueAt).getTime() > Date.now());
const questionCountLabel = (quiz) => {
  const count = Number(quiz?.questionCount ?? quiz?.drawCount ?? quiz?.totalQuestions ?? quiz?.total);
  return Number.isFinite(count) && count > 0 ? `${count} câu hỏi` : "Số câu sẽ hiển thị khi mở bài";
};
export default function KidQuiz() {
  const { actor } = useWorkspace();
  const { pending, completed, loading, error, refresh } = useKidQuizzes();
  const familyChild = actor?.learnerRole === "child" || actor?.plan === "parent";
  return (
    <div className="ws-kid-quiz">
      <Heading
        title={familyChild ? "Hậu trắc của em" : "Quiz của bạn"}
        description={familyChild
          ? "Hoàn thành hậu trắc sau mỗi chương để ghi nhận kết quả vào báo cáo học tập của em."
          : "Hoàn thành bài luyện tập, bài kiểm tra của lớp và hậu trắc được giao."}
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
        <ContentSkeleton variant="cards" cards={3} label="Đang tải danh sách Quiz…" />
      ) : (
        <>
          <section className="ws-kid-quiz-overview">
            <article>
              <ClipboardList />
              <strong>{pending.length}</strong>
              <p>{familyChild ? "Hậu trắc chờ làm" : "Bài chờ làm"}</p>
            </article>
            <article>
              <CheckCircle2 />
              <strong>{completed.length}</strong>
              <p>Đã hoàn thành</p>
            </article>
          </section>
          <section className="ws-kid-quiz-section">
            <h2>{familyChild ? "Hậu trắc chờ làm" : "Chờ làm bài"}</h2>
            {pending.length ? (
              <div className="ws-kid-quiz-grid">
                {pending.map((quiz) => (
                  <article className="ws-kid-quiz-card pending" key={quiz.id}>
                    <span className="ws-pill">
                      {quiz.kind === "POST_TEST"
                        ? `Hậu trắc chương ${quiz.chapter}`
                        : "Đề giáo viên"}
                    </span>
                    <h3>{quiz.title || "Bài Quiz"}</h3>
                    <p>{questionCountLabel(quiz)}</p>
                    {quiz.overdue ? (
                      <button className="ws-btn" disabled>
                        Đã quá hạn
                      </button>
                    ) : (
                      <Link
                        className="ws-btn primary"
                        to={`/dashboard/kid/quiz/${quiz.id}`}
                        state={{ quiz }}
                      >
                        Bắt đầu làm bài
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <Empty>{familyChild ? "Hiện chưa có hậu trắc cần hoàn thành." : "Không còn bài đang chờ."}</Empty>
            )}
          </section>
          <section className="ws-kid-quiz-section">
            <h2>Đã hoàn thành</h2>
            {completed.length ? (
              <div className="ws-kid-quiz-completed">
                {completed.map((quiz) => (
                  <article key={quiz.id}>
                    <strong>{quiz.mode === "PRACTICE" ? `Lần đầu: ${scoreLabel(quiz)}` : scoreLabel(quiz)}</strong>
                    <div>
                      <h3>{quiz.title || "Bài Quiz"}</h3>
                      <p>{quiz.submittedAt ? `Nộp ${dateLabel(quiz.submittedAt)}` : "Đã nộp bài"}</p>
                      {quiz.mode === "PRACTICE" && quiz.bestScore != null && <p>Điểm cao nhất: {scoreOnTen(quiz.bestScore, quizTotal(quiz))}</p>}
                    </div>
                    {canRetryPractice(quiz) && <Link className="ws-btn primary" to={`/dashboard/kid/quiz/${quiz.id}`} state={{ quiz }} >Làm lại</Link>}
                    {quiz.mode === "PRACTICE" && !canRetryPractice(quiz) && <span className="ws-pill">Đã hết hạn luyện tập</span>}
                  </article>
                ))}
              </div>
            ) : (
              <Empty>{familyChild ? "Em chưa hoàn thành hậu trắc nào." : "Chưa có bài đã hoàn thành."}</Empty>
            )}
          </section>
        </>
      )}
    </div>
  );
}
