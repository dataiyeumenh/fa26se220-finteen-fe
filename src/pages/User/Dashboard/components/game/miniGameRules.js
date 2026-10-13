export function flexibleReserveLock(option, allocations) {
  const required = option.requires?.minFlexibleReserve ??
    (option.id === "CH02_SC04_CHOICE_A" || option.flag === "risk_handled_buffer" ? 200000 : null);
  if (required == null || Number(allocations.emergency_buffer || 0) >= required) return null;
  return `Quỹ dự trù linh hoạt chưa đủ ${required.toLocaleString("vi-VN")}đ. Hãy chọn cách xử lý khác.`;
}

export function advanceFallingItems(items, { dt, basket, width, saved, targetAmount }) {
  const remaining = [];
  const catches = [];
  for (const item of items) {
    const y = item.y + dt * 1.1 / 3.8;
    const caught = item.y < 0.82 && y >= 0.82 && Math.abs(item.x - basket) * Math.max(1, width - 96) < 52;
    if (caught) {
      const before = saved;
      saved = Math.max(0, saved + item.value);
      catches.push({ ...item, delta: saved - before });
      if (saved >= targetAmount) return { items: [], saved, catches, won: true };
    } else if (y < 1) {
      remaining.push({ ...item, y });
    }
  }
  return { items: remaining, saved, catches, won: false };
}
