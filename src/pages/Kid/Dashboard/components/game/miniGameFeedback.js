export function needWantFeedback(item, correct, zones) {
  const destination = zones.find((zone) => zone.id === item.category)?.title;
  const verdict = destination
    ? `${correct ? "Đúng rồi" : "Chưa đúng"}: thuộc ${destination}.`
    : `${correct ? "Đúng rồi" : "Chưa đúng"}.`;
  return `${verdict}${item.explanation ? ` ${item.explanation}` : ""}`;
}

export function budgetFeedback(zone, value) {
  const money = (amount) => `${amount.toLocaleString("vi-VN")}đ`;
  const target = `${zone.label} cần ${money(zone.expectedValue)} theo kế hoạch tháng này.`;
  if (value == null) return `Chưa phân bổ. ${target}`;
  const difference = value - zone.expectedValue;
  const verdict = difference === 0
    ? "Phân bổ hợp lý."
    : difference > 0
      ? `Đang phân bổ quá cao ${money(difference)}; hãy giảm khoản này để đủ tiền cho các phong bì khác.`
      : `Còn thiếu ${money(-difference)}; hãy bổ sung từ phong bì đang dư.`;
  return `${target} ${verdict}${zone.explanation ? ` ${zone.explanation}` : ""}`;
}
