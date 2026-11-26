import { useCallback, useEffect, useRef, useState } from "react";
import { teacherReportsApi as api } from "../api/teacherReportsApi";

const cacheKey = (groupId, chapterNumber) => `${groupId}:${chapterNumber}`;

export default function useTeacherReports(options = {}) {
  const { requestedGroupId = "" } = options;
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupIdState] = useState("");
  const [courseReport, setCourseReport] = useState(null);
  const [chapterReports, setChapterReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const activeGroupRef = useRef("");
  const courseCache = useRef(new Map());
  const chapterCache = useRef(new Map());
  const inflight = useRef(new Map());

  const runRequest = useCallback(async (key, request, { initial = false } = {}) => {
    if (inflight.current.has(key)) return inflight.current.get(key);
    if (initial) setLoading(true);
    else setUpdating(true);
    setWarning("");
    const pending = request()
      .catch((requestError) => {
        const message = requestError.message || "Chưa tải được báo cáo lớp.";
        if (initial) setError(message);
        else setWarning(message);
        return null;
      })
      .finally(() => {
        inflight.current.delete(key);
        if (initial) setLoading(false);
        else setUpdating(false);
      });
    inflight.current.set(key, pending);
    return pending;
  }, []);

  const loadCourse = useCallback(async (targetGroupId, { force = false, initial = false } = {}) => {
    if (!targetGroupId) return null;
    if (!force && courseCache.current.has(targetGroupId)) {
      const cached = courseCache.current.get(targetGroupId);
      if (activeGroupRef.current === targetGroupId) setCourseReport(cached);
      return cached;
    }
    const value = await runRequest(`course:${targetGroupId}`, () => api.getCourseReport(targetGroupId), { initial });
    if (value) {
      courseCache.current.set(targetGroupId, value);
      if (activeGroupRef.current === targetGroupId) setCourseReport(value);
    }
    return value;
  }, [runRequest]);

  const loadChapter = useCallback(async (targetGroupId, chapterNumber, { force = false } = {}) => {
    const number = Number(chapterNumber);
    if (!targetGroupId || !Number.isInteger(number) || number < 1) return null;
    const key = cacheKey(targetGroupId, number);
    if (!force && chapterCache.current.has(key)) return chapterCache.current.get(key);
    const value = await runRequest(`chapter:${key}`, () => api.getChapterReport(targetGroupId, number));
    if (value) {
      chapterCache.current.set(key, value);
      setChapterReports((current) => ({ ...current, [key]: value }));
    }
    return value;
  }, [runRequest]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const values = ((await api.listGroups()) || [])
          .filter((group) => group.context === "CLASS")
          .sort((a, b) => Number(Boolean(a.closedAt)) - Number(Boolean(b.closedAt)));
        if (!active) return;
        setGroups(values);
        const target = values.some((group) => group.id === requestedGroupId) ? requestedGroupId : values[0]?.id || "";
        activeGroupRef.current = target;
        setGroupIdState(target);
        if (target) await loadCourse(target, { initial: true });
        else setLoading(false);
      } catch (loadError) {
        if (!active) return;
        setError(loadError.message || "Chưa tải được danh sách lớp.");
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [loadCourse, requestedGroupId]);

  const setGroupId = useCallback((nextGroupId) => {
    activeGroupRef.current = nextGroupId;
    setGroupIdState(nextGroupId);
    setCourseReport(courseCache.current.get(nextGroupId) || null);
    void loadCourse(nextGroupId);
  }, [loadCourse]);

  const refresh = useCallback(() => loadCourse(groupId, { force: true }), [groupId, loadCourse]);
  const refreshChapter = useCallback((chapterNumber) => loadChapter(groupId, chapterNumber, { force: true }), [groupId, loadChapter]);
  const selectedGroup = groups.find((group) => group.id === groupId) || null;
  const getChapterReport = useCallback((chapterNumber) => chapterReports[cacheKey(groupId, chapterNumber)] || chapterCache.current.get(cacheKey(groupId, chapterNumber)) || null, [chapterReports, groupId]);

  return { groups, selectedGroup, groupId, setGroupId, courseReport, getChapterReport, loadCourse, loadChapter, refresh, refreshChapter, loading, updating, error, warning };
}
