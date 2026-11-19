import { useCallback, useEffect, useMemo, useState } from "react";
import { parentLearnersApi as auth } from "../api/parentLearnersApi";
import { learnerManagementError as errorMessage } from "../../../../features/workspace/learnerMessages.js";

const capacityFree = (value) => {
  const candidate = value?.free ?? value?.available ?? value;
  return Number.isFinite(Number(candidate)) ? Number(candidate) : null;
};

export default function useParentLearners() {
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
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
      const familyGroups = (groupRows || []).filter(
        (item) => item.context === "FAMILY",
      );
      const quotaList = Array.isArray(quotaRows) ? quotaRows : quotaRows?.items || quotaRows?.quotas || [];
      const familyQuota = quotaList.find((item) => item.context === "FAMILY" || item.plan === "PARENT") || null;
      setQuota(familyQuota);
      const openGroup = familyGroups.find((item) => !item.closedAt) || null;
      setGroups(familyGroups);
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
  }, []);

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
      openGroup: (name) =>
        run(() => auth.openGroup(name, "FAMILY"), "Đã tạo nhóm thành công."),
      confirmConsent: () =>
        run(
          () => auth.confirmConsent(group.id),
          "Đã xác nhận sự đồng ý của phụ huynh.",
        ),
      closeGroup: () =>
        run(() => auth.closeGroup(group.id), "Đã kết thúc nhóm."),
      openSlot: ({ displayName, pin }) =>
        run(
          () => auth.openSlot({ groupId: group.id, displayName, pin }),
          "Đã tạo hồ sơ trẻ. Hãy sao chép mã đăng nhập trên thẻ và đưa mã PIN vừa đặt cho trẻ.",
        ),
      openSlots: (items) =>
        run(
          () => auth.openSlots(group.id, items),
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
    : 0;
  return {
    context: "FAMILY",
    group,
    groups,
    slots,
    active,
    inactive,
    available,
    quota,
    loading,
    message,
    error,
    refresh,
    actions,
    setMessage,
  };
}
