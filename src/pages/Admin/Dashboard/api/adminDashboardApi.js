import { auth } from "../../../../api/auth.api.js";

export const createAdminDashboardApi = (client) => ({
  listPlans: () => client.publicRequest("/api/plans"),
  setPlanPrice: (kind, price, months) =>
    client.accountRequest(`/api/admin/plans/${encodeURIComponent(kind)}`, {
      method: "PUT",
      body: { price, months },
    }),
  reconcileTransaction: (orderCode) =>
    client.accountRequest(
      `/api/admin/transactions/${encodeURIComponent(orderCode)}/reconcile`,
      { method: "POST" },
    ),
  findAdminAccount: (email) =>
    client.accountRequest(
      `/api/admin/accounts?email=${encodeURIComponent(email.trim())}`,
    ),
  grantAdminRole: ({ subjectId, role, reason }) =>
    client.accountRequest("/api/admin/roles/grant", {
      body: { subjectId: subjectId.trim(), role, reason: reason.trim() },
    }),
  revokeAdminRole: ({ subjectId, role, reason }) =>
    client.accountRequest("/api/admin/roles/revoke", {
      body: { subjectId: subjectId.trim(), role, reason: reason.trim() },
    }),
  grantEntitlement: ({ accountId, kind, months, reason }) =>
    client.accountRequest("/api/entitlements/grant", {
      body: {
        accountId: accountId.trim(),
        kind,
        months,
        reason: reason.trim(),
      },
    }),
  listAdminTransactions: ({ status = "", page = 0, size = 20 } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (status) query.set("status", status);
    return client.accountRequest(`/api/admin/transactions?${query}`);
  },
  listAdminAccounts: ({ q = "", page = 0, size = 20 } = {}) => {
    const query = new URLSearchParams({
      page: String(Math.max(0, Number(page) || 0)),
      size: String(Math.min(100, Math.max(1, Number(size) || 20))),
    });
    if (q.trim()) query.set("q", q.trim());
    return client.accountRequest(`/api/admin/accounts/list?${query}`);
  },
  listAdminRoleLogs: ({ subjectId = "", page = 0, size = 50 } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (subjectId.trim()) query.set("subjectId", subjectId.trim());
    return client.accountRequest(`/api/admin/roles/log?${query}`);
  },
});

export const adminDashboardApi = createAdminDashboardApi(auth);
