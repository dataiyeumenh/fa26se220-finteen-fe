import { auth } from "../../../../api/auth.api.js";

export const createParentLearnersApi = (client) => ({
  listGroups: () => client.accountRequest("/api/groups"),
  listGroupSlots: (groupId) =>
    client.accountRequest(`/api/groups/${encodeURIComponent(groupId)}/slots`),
  groupCapacity: (groupId) =>
    client.accountRequest(
      `/api/groups/${encodeURIComponent(groupId)}/capacity`,
    ),
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
  setGroupPostTest: (groupId, enabled) =>
    client.accountRequest(
      `/api/groups/${encodeURIComponent(groupId)}/post-test`,
      { body: { enabled: Boolean(enabled) } },
    ),
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
  changeSlotPin: (slotId, pin) =>
    client.accountRequest(`/api/slots/${encodeURIComponent(slotId)}/pin`, {
      body: { pin },
    }),
  returnSlot: (slotId) =>
    client.accountRequest(`/api/slots/${encodeURIComponent(slotId)}/return`, {
      method: "POST",
    }),
  wipeSlot: (slotId) =>
    client.accountRequest(`/api/slots/${encodeURIComponent(slotId)}`, {
      method: "DELETE",
    }),
});

export const parentLearnersApi = createParentLearnersApi(auth);
