import { auth } from "../../../api/auth.api.js";

export const createWorkspaceApi = (client) => ({
  listPlans: () => client.publicRequest("/api/plans"),
  getQuota: () => client.accountRequest("/api/me/quota"),
  createPayment: (kind) =>
    client.accountRequest("/api/payments", { body: { kind } }),
  createAddonPayment: (kind, packs = 1) =>
    client.accountRequest("/api/payments/addon", {
      body: { kind, packs: Math.max(1, Math.floor(Number(packs) || 1)) },
    }),
  listPayments: ({ page = 0, size = 20 } = {}) =>
    client.accountRequest(
      `/api/payments?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
    ),
  getPayment: (orderCode) =>
    client.accountRequest(`/api/payments/${encodeURIComponent(orderCode)}`),
  cancelPayment: (orderCode, reason = "") =>
    client.accountRequest(
      `/api/payments/${encodeURIComponent(orderCode)}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`,
      { method: "POST" },
    ),
});

export const workspaceApi = createWorkspaceApi(auth);
