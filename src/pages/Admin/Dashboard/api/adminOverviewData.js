const businessDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit",
});

export function vietnamDateKey(value = new Date()) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = Object.fromEntries(businessDate.formatToParts(date).map(({ type, value: part }) => [type, part]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function revenueSeries(stats, days, now = new Date()) {
  if (!stats || !Array.isArray(stats.byDay) || stats.paidAmount == null) {
    throw new Error("Dữ liệu doanh thu chưa đầy đủ. Vui lòng thử lại.");
  }
  const today = vietnamDateKey(now);
  const end = new Date(`${today}T12:00:00+07:00`);
  const byDay = new Map(stats.byDay.map((row) => [row.date, Number(row.paidAmount || 0)]));
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end.getTime() - (days - index - 1) * 86400000);
    return { date, amount: byDay.get(vietnamDateKey(date)) ?? 0 };
  });
}

// The accounts endpoint has no creation-date filter or guaranteed sort order.
// Read every page so the seven-day count cannot silently omit later pages.
export async function loadRecentAccounts(api, { now = new Date(), isActive = () => true } = {}) {
  const today = vietnamDateKey(now);
  const firstDay = vietnamDateKey(new Date(new Date(`${today}T00:00:00+07:00`).getTime() - 6 * 86400000));
  const accounts = new Map();
  for (let page = 0; isActive(); page += 1) {
    const response = await api.listAdminAccounts({ page, size: 100 });
    if (!isActive()) return [];
    const rows = Array.isArray(response) ? response : response?.items;
    if (!Array.isArray(rows)) throw new Error("Không tải được danh sách tài khoản mới.");
    for (const account of rows) {
      const createdOn = account.createdAt ? vietnamDateKey(account.createdAt) : null;
      if (createdOn && createdOn >= firstDay && createdOn <= today) accounts.set(account.id, account);
    }
    if (Array.isArray(response) || !rows.length || page + 1 >= (response.totalPages ?? Math.ceil(response.totalElements / 100))) break;
    if (response.totalPages == null && response.totalElements == null && rows.length < 100) break;
  }
  return [...accounts.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
