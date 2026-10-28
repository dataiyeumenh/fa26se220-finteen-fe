import { auth } from "@/api/auth.api";

export const teacherGroupsApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  listGroupSlots: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/slots`),
  groupCapacity: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/capacity`),
  openGroup: (name, context) =>
    auth.accountRequest("/api/groups", {
      body: { name: name.trim(), context },
    }),
  confirmConsent: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/consent`, {
      method: "POST",
    }),
  closeGroup: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/close`, {
      method: "POST",
    }),
  setGroupPostTest: (groupId, enabled) =>
    auth.accountRequest(
      `/api/groups/${encodeURIComponent(groupId)}/post-test`,
      { body: { enabled: Boolean(enabled) } },
    ),
  openSlot: ({ groupId, displayName, pin, badge }) =>
    auth.accountRequest("/api/slots", {
      body: {
        groupId,
        displayName: displayName.trim(),
        pin,
        ...(badge ? { badge } : {}),
      },
    }),
  openSlots: (groupId, items) =>
    auth.accountRequest("/api/slots/bulk", {
      body: {
        slots: items.map((item) => ({
          groupId,
          displayName: item.displayName.trim(),
          pin: item.pin,
        })),
      },
    }),
  changeSlotPin: (slotId, pin) =>
    auth.accountRequest(`/api/slots/${encodeURIComponent(slotId)}/pin`, {
      body: { pin },
    }),
  returnSlot: (slotId) =>
    auth.accountRequest(`/api/slots/${encodeURIComponent(slotId)}/return`, {
      method: "POST",
    }),
  wipeSlot: (slotId) =>
    auth.accountRequest(`/api/slots/${encodeURIComponent(slotId)}`, {
      method: "DELETE",
    }),
};
