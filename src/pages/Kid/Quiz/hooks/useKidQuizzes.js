import { useCallback, useEffect, useState } from "react";
import { auth } from "@/api/auth.api";

const message = (error) => error?.message || "Không thể hoàn thành yêu cầu.";

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
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
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

export function useKidQuiz(quizId) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    auth
      .getLearnerQuiz(quizId)
      .then((value) => {
        if (active) setQuiz(value);
      })
      .catch((value) => {
        if (active) setError(message(value));
      });
    return () => {
      active = false;
    };
  }, [quizId]);
  const choose = (questionId, optionIndex) =>
    setAnswers((old) => ({ ...old, [questionId]: optionIndex }));
  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const payload = Object.entries(answers).map(
        ([questionId, chosenIndex]) => ({ questionId, chosenIndex }),
      );
      setResult(await auth.submitLearnerQuiz(quiz.id, payload));
      await auth.ensureLearnerDashboard({ force: true }).catch(() => {});
    } catch (value) {
      setError(message(value));
    } finally {
      setBusy(false);
    }
  };
  return { quiz, answers, result, busy, error, choose, submit };
}
