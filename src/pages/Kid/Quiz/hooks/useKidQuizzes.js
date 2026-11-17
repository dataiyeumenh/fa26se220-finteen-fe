import { useCallback, useEffect, useRef, useState } from "react";
import { kidQuizApi as auth } from "../api/kidQuizApi";
import { auth as authSession } from "@/api/auth.api";

const message = (error) => ({
  8004: "Bài Quiz đã quá hạn nộp.",
  8005: "Bài Quiz này đã được nộp.",
  8010: "Bài Quiz cần được mở lại bằng phiên làm bài mới.",
  8011: "Phiên làm bài đã hết giờ hoặc đã được nộp.",
  8012: "Bài kiểm tra chỉ được làm một lần.",
  8013: "Không tìm thấy phiên làm bài của bạn.",
})[error?.code] || error?.message || "Không thể hoàn thành yêu cầu.";

export function useKidQuizzes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await auth.listLearnerQuizzes());
    } catch (value) {
      setError(message(value));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);
  return {
    pending: data?.pending || [],
    completed: data?.completed || [],
    loading,
    error,
    refresh,
  };
}

export function useKidQuiz(quizId, quizHint = null) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [attempt, setAttempt] = useState(null);
  const [leaveCount, setLeaveCount] = useState(0);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submittingRef = useRef(false);
  useEffect(() => {
    let active = true;
    auth.getLearnerQuiz(quizId).then(async (value) => {
        if (!active) return;
        const quizMeta = value?.quiz || value || {};
        const shouldUseAttempt = Boolean(quizHint?.mode || quizHint?.kind === "POST_TEST" || quizMeta.mode || quizMeta.kind === "POST_TEST");
        if (shouldUseAttempt) {
          const started = await auth.startAttempt(quizId);
          if (!active) return;
          const attemptQuestions = started?.questions || started?.paper || [];
          setAttempt(started);
          setQuiz({ ...quizHint, ...quizMeta, ...started, id: quizId, questions: attemptQuestions });
          setAnswers(started.answers || {});
          if (!attemptQuestions.length) setError("Không tải được câu hỏi của đề. Vui lòng quay lại và mở bài lần nữa.");
        } else {
          const legacyQuestions = value?.questions || quizMeta.questions || [];
          setQuiz({ ...quizHint, ...quizMeta, id: quizId, questions: legacyQuestions });
          if (!legacyQuestions.length) setError("Không tải được câu hỏi của đề. Vui lòng quay lại và mở bài lần nữa.");
        }
      })
      .catch((value) => {
        if (active) setError(message(value));
      });
    return () => {
      active = false;
    };
  }, [quizId, quizHint]);
  useEffect(() => {
    if (!attempt) return undefined;
    const trackLeave = () => { if (document.hidden) setLeaveCount((old) => old + 1); };
    document.addEventListener("visibilitychange", trackLeave);
    return () => document.removeEventListener("visibilitychange", trackLeave);
  }, [attempt]);
  const choose = (questionId, optionIndex, position) => {
    const key = attempt ? String(position) : questionId;
    setAnswers((old) => ({ ...old, [key]: optionIndex }));
    if (attempt) auth.saveAttemptAnswer(attempt.attemptId || attempt.id, position, optionIndex, leaveCount).catch((value) => setError(message(value)));
  };
  const submit = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setBusy(true);
    setError("");
    try {
      if (attempt) setResult(await auth.submitAttempt(attempt.attemptId || attempt.id, leaveCount));
      else {
        const payload = Object.entries(answers).map(([questionId, chosenIndex]) => ({ questionId, chosenIndex }));
        setResult(await auth.submitLearnerQuiz(quiz.id, payload));
      }
      await authSession.ensureLearnerDashboard({ force: true }).catch(() => {});
    } catch (value) {
      setError(message(value));
    } finally {
      submittingRef.current = false;
      setBusy(false);
    }
  };
  return { quiz, answers, result, busy, error, choose, submit, attempt, leaveCount };
}
