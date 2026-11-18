import { auth } from "@/api/auth.api";

export const teacherGroupsApi = {
  listGroups: () => auth.accountRequest("/api/groups"),
  listGroupSlots: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/slots`),
  groupCapacity: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/capacity`),
  getQuota: () => auth.accountRequest("/api/me/quota"),
  openGroup: (name, context, plannedSize) =>
    auth.accountRequest("/api/groups", {
      body: { name: name.trim(), context, plannedSize: Number(plannedSize) },
    }),
  confirmConsent: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/consent`, {
      method: "POST",
    }),
  closeGroup: (groupId) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/close`, {
      method: "POST",
    }),
  updateGroupSize: (groupId, plannedSize) =>
    auth.accountRequest(`/api/groups/${encodeURIComponent(groupId)}`, {
      method: "PATCH",
      body: { plannedSize: Number(plannedSize) },
    }),
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
  updateSlot: (slotId, displayName, pin) =>
    auth.accountRequest(`/api/slots/${encodeURIComponent(slotId)}`, {
      method: "PATCH",
      body: { displayName: displayName.trim(), ...(pin ? { pin } : {}) },
    }),
  wipeSlot: (slotId) =>
    auth.accountRequest(`/api/slots/${encodeURIComponent(slotId)}`, {
      method: "DELETE",
    }),
};
