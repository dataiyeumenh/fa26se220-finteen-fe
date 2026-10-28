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

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await auth.getSlotReport(id));
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

  return { report, loading, error, refresh };
}
