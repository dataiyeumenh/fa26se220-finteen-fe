import { useCallback, useEffect, useState } from "react";
import { auth } from "../../../../api/auth.api";

export default function useTeacherDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const groups = ((await auth.listGroups()) || [])
        .filter((group) => group.context === "CLASS")
        .sort(
          (a, b) => Number(Boolean(a.closedAt)) - Number(Boolean(b.closedAt)),
        );
      const group = groups[0] || null;
      const report = group ? await auth.getGroupReport(group.id) : null;
      setDashboard({ group, report, groupCount: groups.length });
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
