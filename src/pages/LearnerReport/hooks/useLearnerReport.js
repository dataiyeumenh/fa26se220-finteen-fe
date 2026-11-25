import { useCallback, useEffect, useState } from "react";
import { learnerReportApi as auth } from "../api/learnerReportApi";

const reportError = (error) =>
  ({
    3004: "Bạn không có quyền xem hồ sơ này.",
    5004: "Hồ sơ trẻ này không còn hoạt động.",
  })[error?.code] ||
  error?.message ||
  "Không thể tải báo cáo học tập.";

export default function useLearnerReport(id) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postTestResults, setPostTestResults] = useState({});
  const [postTestLoading, setPostTestLoading] = useState("");
  const [postTestError, setPostTestError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const value = await auth.getSlotReport(id);
      setReport(value);
    } catch (loadError) {
      setError(reportError(loadError));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const isGenerating = report?.chapters?.some((chapter) => chapter?.summary?.status === "GENERATING") ||
    report?.finalReport?.summary?.status === "GENERATING";

  useEffect(() => {
    if (!isGenerating) return undefined;
    const timer = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, [isGenerating, refresh]);

  const loadPostTest = useCallback(async (quizId) => {
    if (!quizId || postTestResults[quizId]) return;
    setPostTestLoading(String(quizId));
    setPostTestError("");
    try {
      const value = await auth.getQuizResult(quizId, id);
      setPostTestResults((current) => ({ ...current, [quizId]: value }));
    } catch (loadError) {
      setPostTestError(loadError?.message || "Không thể tải bài hậu trắc.");
    } finally {
      setPostTestLoading("");
    }
  }, [id, postTestResults]);

  return { report, loading, error, refresh, isGenerating, postTestResults, postTestLoading, postTestError, loadPostTest };
}
