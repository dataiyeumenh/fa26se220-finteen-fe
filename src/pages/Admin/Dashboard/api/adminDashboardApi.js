import { auth } from "../../../../api/auth.api.js";

export const createAdminDashboardApi = (client) => ({
  getAdminDashboard: () => client.accountRequest("/api/admin/dashboard"),
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
  listAdminTransactions: ({ status = "", q = "", from = "", to = "", refunded = "", page = 0, size = 20 } = {}) => {
    const query = new URLSearchParams({
      page: String(Math.max(0, Number(page) || 0)),
      size: String(Math.min(100, Math.max(1, Number(size) || 20))),
    });
    if (status) query.set("status", status);
    if (q.trim()) query.set("q", q.trim());
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    if (refunded !== "") query.set("refunded", String(refunded));
    return client.accountRequest(`/api/admin/transactions?${query}`);
  },
  getAdminTransaction: (orderCode) =>
    client.accountRequest(`/api/admin/transactions/${encodeURIComponent(orderCode)}`),
  getAdminTransactionStats: ({ from = "", to = "" } = {}) => {
    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    return client.accountRequest(`/api/admin/transactions/stats?${query}`);
  },
  refundAdminTransaction: ({ orderCode, amount = null, reason }) =>
    client.accountRequest(`/api/admin/transactions/${encodeURIComponent(orderCode)}/refund`, {
      method: "POST",
      body: {
        ...(amount == null ? {} : { amount }),
        reason: reason.trim(),
      },
    }),
  listAdminAccounts: ({ q = "", role = "", plan = "", page = 0, size = 20 } = {}) => {
    const query = new URLSearchParams({
      page: String(Math.max(0, Number(page) || 0)),
      size: String(Math.min(100, Math.max(1, Number(size) || 20))),
    });
    if (q.trim()) query.set("q", q.trim());
    if (role) query.set("role", role);
    if (plan) query.set("plan", plan);
    return client.accountRequest(`/api/admin/accounts/list?${query}`);
  },
  getAdminAccount: (id) =>
    client.accountRequest(`/api/admin/accounts/${encodeURIComponent(id)}`),
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
