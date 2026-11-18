import { useCallback, useEffect, useMemo, useState } from "react";
import { teacherGroupsApi as auth } from "../api/teacherGroupsApi";
import { withGroupConsent } from "../api/withGroupConsent.js";

const errorMessage = (error) =>
  ({
    3005: "Cần mua gói trước khi tạo lớp hoặc hồ sơ học sinh.",
    5001: "Bạn đã có nhóm đang mở — hãy kết thúc nhóm cũ trước.",
    5002: "Nhóm đã kết thúc.",
    5003: "Lớp cần xác nhận đã có sự đồng ý của phụ huynh trước.",
    3006: "Ví đã hết slot. Hãy mua thêm slot để tiếp tục.",
    3026: "Lớp đã đủ sĩ số dự kiến.",
    5004: "Hồ sơ trẻ này không còn hoạt động.",
    3004: "Bạn không có quyền thao tác với nhóm hoặc hồ sơ này.",
  })[error?.code] ||
  error?.message ||
  "Đã xảy ra lỗi. Vui lòng thử lại.";

const capacityFree = (value) => {
  const candidate = value?.free ?? value?.available ?? value;
  return Number.isFinite(Number(candidate)) ? Number(candidate) : null;
};

export default function useTeacherGroups() {
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [slots, setSlots] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [groupRows, quotaRows] = await Promise.all([
        auth.listGroups(),
        auth.getQuota(),
      ]);
      const classGroups = (groupRows || []).filter(
        (item) => item.context === "CLASS",
      );
      const quotaList = Array.isArray(quotaRows) ? quotaRows : quotaRows?.items || quotaRows?.quotas || [];
      const teacherQuota = quotaList.find((item) => item.context === "CLASS" || item.plan === "TEACHER") || null;
      setQuota(teacherQuota);
      const openGroup = classGroups.find((item) => !item.closedAt && item.id === selectedGroupId)
        || classGroups.find((item) => !item.closedAt)
        || null;
      setGroups(classGroups);
      setGroup(openGroup);
      if (!openGroup) {
        setSlots([]);
        setCapacity(null);
        return;
      }
      const [slotRows, availableCapacity] = await Promise.all([
        auth.listGroupSlots(openGroup.id),
        auth.groupCapacity(openGroup.id),
      ]);
      setSlots(slotRows || []);
      setCapacity(capacityFree(availableCapacity));
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [selectedGroupId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 4500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const run = useCallback(
    async (action, success) => {
      setError("");
      try {
        const result = await action();
        setMessage(success);
        await refresh();
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
        const created = await run(
          () => auth.openGroup(name, "CLASS", plannedSize),
          "Đã tạo lớp thành công.",
        );
        if (created?.id) setSelectedGroupId(created.id);
        return created;
      },
      confirmConsent: () =>
        run(
          () => auth.confirmConsent(group.id),
          "Đã xác nhận sự đồng ý của phụ huynh.",
        ),
      closeGroup: () =>
        run(() => auth.closeGroup(group.id), "Đã kết thúc nhóm."),
      updatePlannedSize: (plannedSize) =>
        run(
          () => auth.updateGroupSize(group.id, plannedSize),
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
  const available = group
    ? (capacity ??
      (Number.isFinite(Number(quota?.free)) ? Number(quota.free) : null))
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
    selectGroup: setSelectedGroupId,
    loading,
    message,
    error,
    refresh,
    actions,
    setMessage,
  };
}
