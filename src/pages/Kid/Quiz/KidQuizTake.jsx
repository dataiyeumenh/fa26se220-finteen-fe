import { CheckCircle2, Clock3, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal } from "@/features/workspace/ui";
import { useKidQuiz } from "./hooks/useKidQuizzes";
import { ContentSkeleton } from "@/components/feedback/LoadingState";

const formatRemainingTime = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainder = safeSeconds % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

export default function KidQuizTake() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, answers, result, busy, error, choose, submit, attempt, leaveCount, answerSync } = useKidQuiz(id, location.state?.quiz);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const submitRef = useRef(submit);
  const autoSubmittedRef = useRef(false);
  const resultTotal = Number(result?.totalQuestions ?? result?.total ?? quiz?.questions?.length) || quiz?.questions?.length || 0;

  useEffect(() => {
    submitRef.current = submit;
  }, [submit]);

  useEffect(() => {
    const deadlineMs = new Date(attempt?.deadlineAt).getTime();
    if (quiz?.mode !== "TEST" || !Number.isFinite(deadlineMs) || result) {
      return undefined;
    }

    const serverNowMs = new Date(attempt?.serverNow).getTime();
    const localDeadlineMs = Number.isFinite(serverNowMs)
      ? Date.now() + Math.max(0, deadlineMs - serverNowMs)
      : deadlineMs;

    const tick = () => {
      const nextSeconds = Math.max(0, Math.ceil((localDeadlineMs - Date.now()) / 1000));
      setRemainingSeconds(nextSeconds);
      if (nextSeconds === 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        setConfirmSubmit(false);
        setAutoSubmitting(true);
        void Promise.resolve(submitRef.current({ allowUnsaved: true })).finally(() => setAutoSubmitting(false));
      }
    };

    const initialTick = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, [attempt?.attemptId, attempt?.id, attempt?.deadlineAt, attempt?.serverNow, quiz?.mode, result]);

  const timeExpired = quiz?.mode === "TEST" && remainingSeconds === 0;
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
  if (!quiz.questions?.length) return <div className="ws-quiz-page"><h1>Chưa mở được câu hỏi</h1><p className="ws-notice" role="alert">{error || "Hệ thống chưa trả về nội dung đề. Vui lòng quay lại danh sách và mở lại bài."}</p><Link className="ws-btn" to="/dashboard/kid/quiz">← Quay lại danh sách Quiz</Link></div>;
  return (
    <div className="ws-quiz-page">
      <header className="ws-quiz-page-header">
        <div>
          <Link to="/dashboard/kid/quiz">← Danh sách Quiz</Link>
          <h1>{quiz.title || "Bài Quiz"}</h1>
          <p>{quiz.questions.length} câu · {quiz.mode === "PRACTICE" ? "chế độ luyện tập" : quiz.mode === "TEST" ? "chế độ kiểm tra, làm một lần" : "chỉ được nộp một lần"}</p>
          {attempt?.deadlineAt && !Number.isNaN(new Date(attempt.deadlineAt).getTime()) && <p className="ws-pill">Hạn phiên làm bài: {new Date(attempt.deadlineAt).toLocaleString("vi-VN")} · Rời trang {leaveCount} lần</p>}
        </div>
        {quiz.mode === "TEST" && remainingSeconds != null && (
          <div className={`ws-quiz-timer${remainingSeconds <= 60 ? " is-urgent" : ""}`} role="timer" aria-live={remainingSeconds <= 60 ? "polite" : "off"}>
            <Clock3 size={22} aria-hidden="true" />
            <span>
              <small>Thời gian còn lại</small>
              <strong>{formatRemainingTime(remainingSeconds)}</strong>
            </span>
          </div>
        )}
      </header>
      {autoSubmitting && <p className="ws-notice" role="status">Đã hết thời gian. Hệ thống đang tự động nộp bài của em…</p>}
      {attempt && !result && (
        <p
          className={`ws-quiz-save-status${answerSync.failed ? " is-offline" : answerSync.saving || answerSync.pendingCount ? " is-saving" : " is-saved"}`}
          role="status"
          aria-live="polite"
        >
          {answerSync.failed
            ? "Mất mạng — sẽ tự lưu khi có mạng"
            : answerSync.saving || answerSync.pendingCount
              ? "Đang lưu…"
              : "Đã lưu"}
        </p>
      )}
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
            {quiz.questions.map((question, index) => {
              const position = question.pos ?? index;
              const answerKey = attempt ? String(position) : question.id;
              return (
              <fieldset className="ws-question ws-checks" key={question.id || position}>
                <legend>
                  {index + 1}. {question.stem}
                </legend>
                {(question.options || []).map((option, optionIndex) => (
                  <label key={`${position}-${optionIndex}`}>
                    <input
                      type="radio"
                      name={String(question.id || position)}
                      checked={answers[answerKey] === optionIndex}
                      disabled={busy || timeExpired}
                      onChange={() => choose(question.id, optionIndex, position)}
                    />
                    <b>{String.fromCharCode(65 + optionIndex)}</b>
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>);
            })}
          </div>
          <button className="ws-btn primary" disabled={busy || timeExpired}>
            {busy || autoSubmitting ? "Đang nộp…" : "Nộp bài"}
          </button>
        </form>
      )}
      {confirmSubmit && !result && (
        <Modal
          className="ws-quiz-submit-modal"
          title="Sẵn sàng nộp bài?"
          description={quiz.mode === "PRACTICE" ? "Hãy kiểm tra lại các câu trả lời trước khi xác nhận. Em vẫn có thể luyện tập lại trước hạn nộp." : "Bài kiểm tra chỉ được làm và nộp một lần. Hãy kiểm tra lại các câu trả lời trước khi xác nhận."}
          onClose={() => setConfirmSubmit(false)}
        >
          <div className="ws-quiz-submit-summary">
            <span className="ws-quiz-submit-icon" aria-hidden="true"><Send size={26} /></span>
            <div>
              <strong>{quiz.title || "Bài Quiz"}</strong>
              <p>Đã trả lời {Object.values(answers).filter((value) => value != null).length}/{quiz.questions.length} câu</p>
            </div>
          </div>
          {Object.values(answers).filter((value) => value != null).length < quiz.questions.length && (
            <p className="ws-quiz-submit-warning" role="status">
              Còn {quiz.questions.length - Object.values(answers).filter((value) => value != null).length} câu chưa trả lời. Bạn có thể quay lại để hoàn thành bài.
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
          <h2>{result.score == null ? "Kết quả sẽ có sau hạn nộp" : resultTotal > 0 ? `${result.score}/${resultTotal} câu đúng` : `${result.score} câu đúng`}</h2>
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
