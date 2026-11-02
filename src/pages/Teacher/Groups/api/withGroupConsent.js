// Automatically persist consent before creating student slots.
export async function withGroupConsent(api, group, createSlots) {
  if (!group.consentConfirmed) await api.confirmConsent(group.id);
  return createSlots();
}
