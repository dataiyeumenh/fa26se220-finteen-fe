import { useCallback, useEffect, useRef, useState } from "react";
import { teacherDashboardApi as auth } from "../api/teacherDashboardApi";
import { loadTeacherDashboard } from "../api/loadTeacherDashboard";

export default function useTeacherDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestRef = useRef(0);

  const refetch = useCallback(async () => {
    const request = ++requestRef.current;
    setLoading(true);
    setError("");
    try {
      const result = await loadTeacherDashboard(auth);
      if (request !== requestRef.current) return;
      setDashboard(result);
      setError(result.warning);
    } catch (loadError) {
      if (request === requestRef.current) setError(loadError.message || "Không tải được tổng quan giảng dạy.");
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
    return () => { requestRef.current += 1; };
  }, [refetch]);
  return { dashboard, loading, error, refetch };
}
