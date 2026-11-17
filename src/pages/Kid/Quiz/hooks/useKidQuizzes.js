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

const pendingStorageKey = (attemptId) => `finteen:quiz-attempt:${attemptId}:pending-answers`;

const readPendingAnswers = (attemptId) => {
  if (!attemptId) return {};
  try {
    const value = JSON.parse(window.localStorage.getItem(pendingStorageKey(attemptId)) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
};

const writePendingAnswers = (attemptId, pending) => {
  if (!attemptId) return;
  try {
    const key = pendingStorageKey(attemptId);
    if (Object.keys(pending).length) window.localStorage.setItem(key, JSON.stringify(pending));
    else window.localStorage.removeItem(key);
  } catch {
    // The in-memory queue still protects the current page when storage is unavailable.
  }
};

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
  const [answerSync, setAnswerSync] = useState({ pendingCount: 0, saving: false, failed: false });
  const submittingRef = useRef(false);
  const attemptIdRef = useRef(null);
  const pendingAnswersRef = useRef({});
  const flushPromiseRef = useRef(null);

  const updatePendingState = useCallback((changes = {}) => {
    setAnswerSync((old) => ({
      ...old,
      ...changes,
      pendingCount: Object.keys(pendingAnswersRef.current).length,
    }));
  }, []);

  const flushPendingAnswers = useCallback(async () => {
    if (flushPromiseRef.current) return flushPromiseRef.current;
    const attemptId = attemptIdRef.current;
    if (!attemptId || !Object.keys(pendingAnswersRef.current).length) return true;

    const run = async () => {
      updatePendingState({ saving: true, failed: false });
      let failed = false;
      while (Object.keys(pendingAnswersRef.current).length && !failed) {
        const entries = Object.entries(pendingAnswersRef.current);
        for (const [position, queued] of entries) {
          try {
            await auth.saveAttemptAnswer(attemptId, Number(position), queued.choice, queued.leaveCount);
            const latest = pendingAnswersRef.current[position];
            if (latest && latest.choice === queued.choice) {
              const next = { ...pendingAnswersRef.current };
              delete next[position];
              pendingAnswersRef.current = next;
              writePendingAnswers(attemptId, next);
              updatePendingState({ failed: false });
            }
          } catch {
            failed = true;
            break;
          }
        }
      }
      updatePendingState({ saving: false, failed });
      return Object.keys(pendingAnswersRef.current).length === 0;
    };

    flushPromiseRef.current = run().finally(() => {
      flushPromiseRef.current = null;
    });
    return flushPromiseRef.current;
  }, [updatePendingState]);

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
          const attemptId = started?.attemptId || started?.id;
          const restoredPending = readPendingAnswers(attemptId);
          attemptIdRef.current = attemptId;
          pendingAnswersRef.current = restoredPending;
          setAttempt(started);
          setQuiz({ ...quizHint, ...quizMeta, ...started, id: quizId, questions: attemptQuestions });
          setAnswers({
            ...(started.answers || {}),
            ...Object.fromEntries(Object.entries(restoredPending).map(([position, queued]) => [position, queued.choice])),
          });
          updatePendingState({ saving: false, failed: Object.keys(restoredPending).length > 0 });
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
  }, [quizId, quizHint, updatePendingState]);

  useEffect(() => {
    if (!attempt) return undefined;
    const trackLeave = () => { if (document.hidden) setLeaveCount((old) => old + 1); };
    document.addEventListener("visibilitychange", trackLeave);
    return () => document.removeEventListener("visibilitychange", trackLeave);
  }, [attempt]);

  useEffect(() => {
    if (!attempt) return undefined;
    const retry = () => { void flushPendingAnswers(); };
    window.addEventListener("online", retry);
    const timer = window.setInterval(retry, 4000);
    if (Object.keys(pendingAnswersRef.current).length) void flushPendingAnswers();
    return () => {
      window.removeEventListener("online", retry);
      window.clearInterval(timer);
    };
  }, [attempt, flushPendingAnswers]);

  const choose = (questionId, optionIndex, position) => {
    const key = attempt ? String(position) : questionId;
    setAnswers((old) => ({ ...old, [key]: optionIndex }));
    if (attempt) {
      const attemptId = attempt.attemptId || attempt.id;
      attemptIdRef.current = attemptId;
      pendingAnswersRef.current = {
        ...pendingAnswersRef.current,
        [String(position)]: { choice: optionIndex, leaveCount },
      };
      writePendingAnswers(attemptId, pendingAnswersRef.current);
      updatePendingState({ failed: false });
      void flushPendingAnswers();
    }
  };

  const submit = async ({ allowUnsaved = false } = {}) => {
    if (submittingRef.current) return false;
    submittingRef.current = true;
    setBusy(true);
    setError("");
    try {
      if (attempt) {
        await flushPendingAnswers();
        const pendingCount = Object.keys(pendingAnswersRef.current).length;
        if (pendingCount && !allowUnsaved) {
          setError(`Còn ${pendingCount} câu chưa lưu, em kiểm tra mạng nhé.`);
          return false;
        }
        setResult(await auth.submitAttempt(attempt.attemptId || attempt.id, leaveCount));
        pendingAnswersRef.current = {};
        writePendingAnswers(attempt.attemptId || attempt.id, {});
        updatePendingState({ saving: false, failed: false });
      } else {
        const payload = Object.entries(answers).map(([questionId, chosenIndex]) => ({ questionId, chosenIndex }));
        setResult(await auth.submitLearnerQuiz(quiz.id, payload));
      }
      await authSession.ensureLearnerDashboard({ force: true }).catch(() => {});
      return true;
    } catch (value) {
      setError(message(value));
      return false;
    } finally {
      submittingRef.current = false;
      setBusy(false);
    }
  };

  return { quiz, answers, result, busy, error, choose, submit, attempt, leaveCount, answerSync };
}
