// Use the chapter's phone catalog directly so prices and conditions stay aligned.
export function buildShoppingOffers(phones) {
  return phones.map((phone) => ({
    ...phone,
    name: phone.label,
    works: phone.meetsLearningNeeds,
    monthly: phone.monthlySubscription || 0,
    billedMonths: phone.billedMonthsFirstYear || 0,
    // The practice calendar models a 30-day trial, with renewal on day 30.
    deadline: phone.trialMonths ? 29 : null,
    error: "fee",
    claim: phone.shopping.claim,
  }));
}

export const INSPECTIONS = [
  { id: "app", label: "Chạy thử ứng dụng học" },
  { id: "battery", label: "Kiểm định pin & bảo hành" },
  { id: "terms", label: "Đọc hợp đồng dịch vụ" },
];

export function inspectOffer(offer, type) {
  return offer.shopping[type];
}

export function invoiceFor(offer) {
  return [
    { id: "price", label: offer.label, amount: offer.price },
    { id: "fee", label: "Phí dịch vụ", amount: 100000 },
  ];
}

export function purchaseLedger(offer, report) {
  return [
    { label: "Máy", amount: offer.price },
    ...(offer.monthly
      ? [{ label: "Thuê bao 11 tháng", amount: report.subscription }]
      : []),
    ...(report.batteryCost
      ? [{ label: "Thay pin", amount: report.batteryCost }]
      : []),
    { label: "Chênh lệch hóa đơn chưa xử lý", amount: report.fee },
  ];
}

export function evaluatePurchase({
  offer,
  inspected,
  cancellationDay,
  disputedLine,
  budget,
  reserve,
  batteryChecked = false,
  batteryPlan = "",
}) {
  const cancelled =
    !!offer.monthly &&
    cancellationDay !== "" &&
    Number.isInteger(Number(cancellationDay)) &&
    Number(cancellationDay) >= 1 &&
    Number(cancellationDay) <= offer.deadline;
  const subscription =
    offer.monthly && !cancelled ? offer.monthly * offer.billedMonths : 0;
  const fee = disputedLine === offer.error ? 0 : 100000;
  const batteryCost =
    offer.inspectionRequired && batteryPlan === "replace"
      ? offer.shopping.batteryReplacementCost
      : 0;
  const totalCost = offer.price + subscription + fee + batteryCost;
  const remaining = budget - totalCost;
  const relevantChecks = INSPECTIONS.filter((check) =>
    inspected.includes(`${offer.id}:${check.id}`),
  ).length;
  const batteryManaged =
    !offer.inspectionRequired ||
    (batteryChecked && ["keep", "replace"].includes(batteryPlan));
  const aftercare = offer.monthly
    ? cancelled
      ? "Đã hủy trước gia hạn và lưu xác nhận."
      : "Chưa hủy trước gia hạn; phát sinh 11 tháng thuê bao."
    : offer.inspectionRequired
      ? batteryManaged
        ? batteryPlan === "replace"
          ? "Đã thay pin, tính đủ chi phí; độ trễ đa nhiệm vẫn còn."
          : "Giữ pin cũ và mang sạc cho buổi học; không phát sinh phí thay pin."
        : "Chưa đo pin hoặc chưa chọn kế hoạch cho buổi học 4 giờ."
      : "Máy không kèm thuê bao; các tính năng thêm vẫn làm giảm quỹ hoạt động.";
  const criteria = [
    {
      id: "needs",
      passed: offer.works,
      title: "Dùng được cho việc học",
      detail: offer.shopping.app,
    },
    {
      id: "budget",
      passed: remaining >= reserve,
      title: "Giữ được quỹ hoạt động trường",
      detail:
        remaining >= reserve
          ? "Tổng tiền máy, thuê bao và phí thực trả vẫn giữ đủ quỹ."
          : `Thiếu ${(reserve - remaining).toLocaleString("vi-VN")}đ cho hoạt động trường. ${offer.exceedsNeeds ? "Máy C đáp ứng việc học nhưng tính năng vượt nhu cầu khiến chi phí vượt mục tiêu." : "Cần tính cả thuê bao và phí ngoài báo giá."}`,
    },
    {
      id: "evidence",
      passed: relevantChecks === 3,
      title: "Mua dựa trên bằng chứng",
      detail: `Đã kiểm tra ${relevantChecks}/3 hồ sơ của máy mua. ${relevantChecks < 3 ? "Kết quả tốt do may mắn chưa thay thế việc kiểm tra trước mua." : "Đã thử ứng dụng, xem pin và đọc hợp đồng."}`,
    },
    {
      id: "rights",
      passed: fee === 0 && (!offer.monthly || cancelled) && batteryManaged,
      title: "Xử lý phí và kế hoạch sử dụng",
      detail: `${fee ? "Đã trả thêm 100.000đ ngoài báo giá." : "Đã đối chiếu và bỏ phí ngoài báo giá 100.000đ."} ${aftercare}`,
    },
  ];
  return {
    totalCost,
    remaining,
    subscription,
    batteryCost,
    fee,
    cancelled,
    criteria,
    score: criteria.filter((item) => item.passed).length,
    total: 4,
  };
}
