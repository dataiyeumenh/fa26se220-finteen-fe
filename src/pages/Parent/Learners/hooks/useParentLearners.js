import { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "../../../../api/auth.api";

const errorMessage = (error) =>
  ({
    3005: "Gói đã hết hạn — hãy gia hạn để mở thêm hồ sơ trẻ.",
    5001: "Bạn đã có nhóm đang mở — hãy kết thúc nhóm cũ trước.",
    5002: "Nhóm đã kết thúc.",
    3006: "Nhóm đã hết chỗ.",
    5004: "Hồ sơ trẻ này không còn hoạt động.",
    3004: "Bạn không có quyền thao tác với nhóm hoặc hồ sơ này.",
  })[error?.code] ||
  error?.message ||
  "Đã xảy ra lỗi. Vui lòng thử lại.";

export default function useParentLearners() {
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [slots, setSlots] = useState([]);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const familyGroups = ((await auth.listGroups()) || []).filter(
        (item) => item.context === "FAMILY",
      );
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
      setCapacity(
        Number.isFinite(Number(availableCapacity))
          ? Number(availableCapacity)
          : null,
      );
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
      setPostTest: (value) =>
        run(
          () => auth.setGroupPostTest(group.id, value),
          value ? "Đã bật hậu trắc." : "Đã tắt hậu trắc.",
        ),
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
      changeSlotPin: (slotId, pin) =>
        run(
          () => auth.changeSlotPin(slotId, pin),
          "Đã đổi mã PIN và mở khóa hồ sơ.",
        ),
      returnSlot: (slotId) =>
        run(
          () => auth.returnSlot(slotId),
          "Đã thu hồi hồ sơ và trả lại chỗ trống.",
        ),
      wipeSlot: (slotId) =>
        run(() => auth.wipeSlot(slotId), "Đã xóa vĩnh viễn dữ liệu hồ sơ."),
    }),
    [group, run],
  );

  const active = slots.filter((slot) => slot.status === "ACTIVE");
  const inactive = slots.filter((slot) => slot.status !== "ACTIVE");
  const available = group
    ? (capacity ??
      Math.max(0, Number(group.slotLimit) - Number(group.slotUsed)))
    : 0;
  return {
    context: "FAMILY",
    group,
    groups,
    slots,
    active,
    inactive,
    available,
    loading,
    message,
    error,
    refresh,
    actions,
    setMessage,
  };
}
