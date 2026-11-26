import { useCallback, useEffect, useState } from "react";
import { parentDashboardApi as auth } from "../api/parentDashboardApi";

export default function useParentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [groupResult, quotaResult] = await Promise.allSettled([
        auth.listGroups(),
        auth.getQuota(),
      ]);
      if (groupResult.status === "rejected") throw groupResult.reason;
      const quotaRows = quotaResult.status === "fulfilled" ? quotaResult.value : null;
      const quotas = Array.isArray(quotaRows) ? quotaRows : quotaRows?.items || quotaRows?.quotas || [];
      const quota = quotas.find((item) => item.context === "FAMILY" || item.plan === "PARENT") || null;
      const groups = (groupResult.value || [])
        .filter((group) => group.context === "FAMILY")
        .sort(
          (a, b) => Number(Boolean(a.closedAt)) - Number(Boolean(b.closedAt)),
        );
      const group = groups[0] || null;
      const report = group ? await auth.getGroupReport(group.id) : null;
      setDashboard({ group, report, groupCount: groups.length, quota });
      if (quotaResult.status === "rejected") {
        setError("Chưa tải được số slot khả dụng. Vui lòng thử làm mới.");
      }
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refetch();
  }, [refetch]);
  return { dashboard, loading, error, refetch };
}
