import { useCallback, useEffect, useState } from "react";
import { learnerReportApi as auth } from "../api/learnerReportApi";
import { getChapterContent } from "../../../api/content.api.js";

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
  const [itemLabels, setItemLabels] = useState({});

  const loadItemLabels = useCallback(async (value) => {
    const chapters = (value?.chapters || []).filter((chapter) => chapter?.miniGames?.wrong?.length);
    const labels = {};
    await Promise.all(chapters.map(async (chapter, index) => {
      const number = Number(chapter.chapter ?? chapter.chapterNumber ?? index + 1);
      if (!Number.isInteger(number) || number < 1) return;
      const content = await getChapterContent(`CH${String(number).padStart(2, "0")}`).catch(() => null);
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        if (!Array.isArray(node) && typeof node.id === "string") {
          const label = node.label || node.title || node.question;
          if (typeof label === "string" && label.trim()) labels[node.id] = label.trim();
        }
        Object.values(node).forEach(visit);
      };
      visit(content);
    }));
    setItemLabels(labels);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const value = await auth.getSlotReport(id);
      setReport(value);
      void loadItemLabels(value);
    } catch (loadError) {
      setError(reportError(loadError));
    } finally {
      setLoading(false);
    }
  }, [id, loadItemLabels]);

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

  return { report, loading, error, refresh, isGenerating, itemLabels };
}
