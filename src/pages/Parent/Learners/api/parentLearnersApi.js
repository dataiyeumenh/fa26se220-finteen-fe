import { auth } from "../../../../api/auth.api.js";

export const createParentLearnersApi = (client) => ({
  listGroups: () => client.accountRequest("/api/groups"),
  listGroupSlots: (groupId) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/slots`),
  groupCapacity: (groupId) =>
    client.accountRequest(
      `/api/groups/${encodeURIComponent(groupId)}/capacity`,
    ),
  getQuota: () => client.accountRequest("/api/me/quota"),
  openGroup: (name, context) =>
    client.accountRequest("/api/groups", {
      body: { name: name.trim(), context },
    }),
  confirmConsent: (groupId) =>
    client.accountRequest(
      `/api/groups/${encodeURIComponent(groupId)}/consent`,
      {
        method: "POST",
      },
    ),
  closeGroup: (groupId) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/close`, {
      method: "POST",
    }),
  openSlot: ({ groupId, displayName, pin, badge }) =>
    client.accountRequest("/api/slots", {
      body: {
        groupId,
        displayName: displayName.trim(),
        pin,
        ...(badge ? { badge } : {}),
      },
    }),
  openSlots: (groupId, items) =>
    client.accountRequest("/api/slots/bulk", {
      body: {
        slots: items.map((item) => ({
          groupId,
          displayName: item.displayName.trim(),
          pin: item.pin,
        })),
      },
    }),
  updateSlot: (slotId, displayName, pin) =>
    client.accountRequest(`/api/slots/${encodeURIComponent(slotId)}`, {
      method: "PATCH",
      body: { displayName: displayName.trim(), ...(pin ? { pin } : {}) },
    }),
  wipeSlot: (slotId) =>
    client.accountRequest(`/api/slots/${encodeURIComponent(slotId)}`, {
      method: "DELETE",
    }),
});

export const parentLearnersApi = createParentLearnersApi(auth);
