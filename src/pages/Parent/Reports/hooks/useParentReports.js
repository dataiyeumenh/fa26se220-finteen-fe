import { useCallback, useEffect, useMemo, useState } from "react";
import { parentReportsApi as auth } from "../api/parentReportsApi";

export default function useParentReports(options = {}) {
  const { requestedGroupId = "" } = options;
  const [reports, setReports] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    setWarning("");
    try {
      const groups = ((await auth.listGroups()) || [])
        .filter((group) => group.context === "FAMILY")
        .sort(
          (a, b) => Number(Boolean(a.closedAt)) - Number(Boolean(b.closedAt)),
        );
      const settled = await Promise.allSettled(
        groups.map(async (group) => {
          const [legacyResult, courseResult] = await Promise.allSettled([
            auth.getGroupReport(group.id),
            auth.getCourseReport(group.id),
          ]);
          if (legacyResult.status === "rejected") throw legacyResult.reason;
          return {
            ...legacyResult.value,
            course:
              courseResult.status === "fulfilled" ? courseResult.value : null,
            courseUnavailable: courseResult.status === "rejected",
          };
        }),
      );
      const values = settled
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value)
        .filter(Boolean);
      const failed = settled.length - values.length;
      const courseUnavailable = values.filter(
        (item) => item.courseUnavailable,
      ).length;
      if (failed || courseUnavailable)
        setWarning(
          [
            failed
              ? `${failed} nhóm chưa tải được báo cáo.`
              : "",
            courseUnavailable
              ? `${courseUnavailable} nhóm chưa tải được biểu đồ tổng hợp; dữ liệu cơ bản vẫn được hiển thị.`
              : "",
          ]
            .filter(Boolean)
            .join(" "),
        );
      if (!values.length && failed)
        throw (
          settled.find((item) => item.status === "rejected")?.reason ||
          new Error("Không tải được báo cáo nhóm.")
        );
      setReports(values);
      setGroupId((current) =>
        current && values.some((item) => item.group.id === current)
          ? current
          : values.some((item) => item.group.id === requestedGroupId)
            ? requestedGroupId
            : values[0]?.group.id || "",
      );
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [requestedGroupId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);
  const report =
    reports.find((item) => item.group.id === groupId) || reports[0];
  const rows = useMemo(
    () =>
      (report?.rows || []).filter((row) => !status || row.status === status),
    [report, status],
  );
  return {
    reports,
    report,
    rows,
    groupId,
    setGroupId,
    status,
    setStatus,
    loading,
    error,
    warning,
    refresh,
  };
}
