import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { teacherGroupsApi as auth } from "../api/teacherGroupsApi";
import { withGroupConsent } from "../api/withGroupConsent.js";
import { learnerManagementError as errorMessage } from "../../../../features/workspace/learnerMessages.js";

const capacityFree = (value) => {
  const candidate = value?.free ?? value?.available ?? value;
  return Number.isFinite(Number(candidate)) ? Number(candidate) : null;
};

export default function useTeacherGroups({ requestedGroupId = "" } = {}) {
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const selectedGroupRef = useRef(requestedGroupId);
  const requestRef = useRef(0);
  const [slots, setSlots] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async (groupId = selectedGroupRef.current) => {
    selectedGroupRef.current = groupId;
    const request = ++requestRef.current;
    setLoading(true);
    setError("");
    try {
      const [groupResult, quotaResult] = await Promise.allSettled([
        auth.listGroups(),
        auth.getQuota(),
      ]);
      if (request !== requestRef.current) return;
      if (groupResult.status === "rejected") throw groupResult.reason;
      const groupRows = groupResult.value;
      const quotaRows = quotaResult.status === "fulfilled" ? quotaResult.value : null;
      const classGroups = (groupRows || []).filter(
        (item) => item.context === "CLASS",
      );
      const quotaList = Array.isArray(quotaRows) ? quotaRows : quotaRows?.items || quotaRows?.quotas || [];
      const teacherQuota = quotaList.find((item) => item.context === "CLASS" || item.plan === "TEACHER") || null;
      setQuota(teacherQuota);
      const openGroup = classGroups.find((item) => item.id === groupId)
        || classGroups.find((item) => !item.closedAt)
        || classGroups[0]
        || null;
      selectedGroupRef.current = openGroup?.id || "";
      setGroups(classGroups);
      setGroup(openGroup);
      setSlots([]);
      setCapacity(null);
      if (!openGroup) {
        setSlots([]);
        setCapacity(null);
        return;
      }
      const [slotResult, capacityResult] = await Promise.allSettled([
        auth.listGroupSlots(openGroup.id),
        openGroup.closedAt ? Promise.resolve(null) : auth.groupCapacity(openGroup.id),
      ]);
      if (request !== requestRef.current) return;
      if (slotResult.status === "rejected") throw slotResult.reason;
      setSlots(slotResult.value || []);
      setCapacity(capacityResult.status === "fulfilled" && capacityResult.value != null
        ? capacityFree(capacityResult.value) : null);
      if (quotaResult.status === "rejected" || capacityResult.status === "rejected") {
        setError("Chưa tải được số slot khả dụng. Danh sách học sinh vẫn được giữ; vui lòng làm mới để thử lại.");
      }
    } catch (loadError) {
      if (request === requestRef.current) setError(errorMessage(loadError));
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    return () => { requestRef.current += 1; };
  }, [refresh]);
  useEffect(() => {
    if (requestedGroupId && requestedGroupId !== selectedGroupRef.current) {
      void refresh(requestedGroupId);
    }
  }, [requestedGroupId, refresh]);
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 4500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const run = useCallback(
    async (action, success, selectCreated = false) => {
      setError("");
      try {
        const result = await action();
        setMessage(success);
        await refresh(selectCreated && result?.id ? result.id : selectedGroupRef.current);
        return result;
      } catch (actionError) {
        const text = errorMessage(actionError);
        setError(text);
        throw new Error(text, { cause: actionError });
      }
    },
    [refresh],
  );

  const actions = useMemo(
    () => ({
      openGroup: async (name, plannedSize) => {
        return run(
          () => auth.openGroup(name, "CLASS", plannedSize),
          "Đã tạo lớp thành công.",
          true,
        );
      },
      confirmConsent: (groupId = group.id) =>
        run(
          () => auth.confirmConsent(groupId),
          "Đã xác nhận sự đồng ý của phụ huynh.",
        ),
      closeGroup: (groupId = group.id) =>
        run(() => auth.closeGroup(groupId), "Đã kết thúc nhóm."),
      updatePlannedSize: (plannedSize, groupId = group.id) =>
        run(
          () => auth.updateGroupSize(groupId, plannedSize),
          "Đã cập nhật sĩ số lớp.",
        ),
      openSlot: ({ displayName, pin }) =>
        run(
          () => withGroupConsent(auth, group, () =>
            auth.openSlot({ groupId: group.id, displayName, pin })),
          "Đã tạo hồ sơ trẻ. Hãy sao chép mã đăng nhập trên thẻ và đưa mã PIN vừa đặt cho trẻ.",
        ),
      openSlots: (items) =>
        run(
          () => withGroupConsent(auth, group, () => auth.openSlots(group.id, items)),
          `Đã tạo ${items.length} hồ sơ trẻ.`,
        ),
      changeSlotPin: (slotId, displayName, pin) =>
        run(
          () => auth.updateSlot(slotId, displayName, pin),
          "Đã cập nhật tên và mã PIN hồ sơ.",
        ),
      wipeSlot: (slotId) =>
        run(() => auth.wipeSlot(slotId), "Đã xóa hồ sơ. Slot này không được hoàn lại vào ví."),
    }),
    [group, run],
  );

  const active = slots.filter((slot) => slot.status === "ACTIVE");
  const inactive = slots.filter((slot) => slot.status !== "ACTIVE");
  const available = group?.closedAt ? 0 : group
    ? capacity
    : (Number.isFinite(Number(quota?.free)) ? Number(quota.free) : 0);
  const quotaFree = Number.isFinite(Number(quota?.free)) ? Number(quota.free) : 0;
  return {
    context: "CLASS",
    group,
    groups,
    slots,
    active,
    inactive,
    available,
    quota,
    quotaFree,
    selectGroup: (groupId) => refresh(groupId),
    loading,
    message,
    error,
    refresh,
    actions,
    setMessage,
  };
}
