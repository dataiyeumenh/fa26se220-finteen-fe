// Use the chapter's phone catalog directly so prices and conditions stay aligned.
// Chữ / số của mini-game nằm trong JSON chương: game.config (khung SMART_SHOPPING).
const money = (value) => `${value.toLocaleString("vi-VN")}đ`;
export const fill = (template, values) =>
  template.replace(/\{(\w+)\}/g, (_, key) => values[key]);

export function buildShoppingOffers(phones, config) {
  return phones.map((phone) => ({
    ...phone,
    name: phone.label,
    works: phone.meetsLearningNeeds,
    monthly: phone.monthlySubscription || 0,
    billedMonths: phone.billedMonthsFirstYear || 0,
    // The practice calendar models a 30-day trial, with renewal on day 30.
    deadline: phone.trialMonths ? config.trialDeadlineDay : null,
    error: config.invoiceExtra.id,
    claim: phone.shopping.claim,
  }));
}

export function inspectOffer(offer, type) {
  return offer.shopping[type];
}

export function invoiceFor(offer, config) {
  const { id, label, amount } = config.invoiceExtra;
  return [
    { id: "price", label: offer.label, amount: offer.price },
    { id, label, amount },
  ];
}

export function purchaseLedger(offer, report, config) {
  const { ledger } = config;
  return [
    { label: ledger.phone, amount: offer.price },
    ...(offer.monthly
      ? [
          {
            label: fill(ledger.subscription, { months: offer.billedMonths }),
            amount: report.subscription,
          },
        ]
      : []),
    ...(report.batteryCost
      ? [{ label: ledger.battery, amount: report.batteryCost }]
      : []),
    { label: ledger.fee, amount: report.fee },
  ];
}

export function evaluatePurchase({
  config,
  offer,
  inspected,
  cancellationDay,
  disputedLine,
  budget,
  reserve,
  batteryChecked = false,
  batteryPlan = "",
}) {
  const { aftercare: care, criteria: text, inspections } = config;
  const extraFee = config.invoiceExtra.amount;
  const cancelled =
    !!offer.monthly &&
    cancellationDay !== "" &&
    Number.isInteger(Number(cancellationDay)) &&
    Number(cancellationDay) >= 1 &&
    Number(cancellationDay) <= offer.deadline;
  const subscription =
    offer.monthly && !cancelled ? offer.monthly * offer.billedMonths : 0;
  const fee = disputedLine === offer.error ? 0 : extraFee;
  const batteryCost =
    offer.inspectionRequired && batteryPlan === "replace"
      ? offer.shopping.batteryReplacementCost
      : 0;
  const totalCost = offer.price + subscription + fee + batteryCost;
  const remaining = budget - totalCost;
  const relevantChecks = inspections.filter((check) =>
    inspected.includes(`${offer.id}:${check.id}`),
  ).length;
  const allChecks = relevantChecks === inspections.length;
  const batteryManaged =
    !offer.inspectionRequired ||
    (batteryChecked && ["keep", "replace"].includes(batteryPlan));
  const aftercare = offer.monthly
    ? cancelled
      ? care.cancelled
      : fill(care.notCancelled, { months: offer.billedMonths })
    : offer.inspectionRequired
      ? batteryManaged
        ? batteryPlan === "replace"
          ? care.batteryReplaced
          : care.batteryKept
        : care.batteryUnmanaged
      : care.noSubscription;
  const criteria = [
    {
      id: "needs",
      passed: offer.works,
      title: text.needs.title,
      detail: offer.shopping.app,
    },
    {
      id: "budget",
      passed: remaining >= reserve,
      title: text.budget.title,
      detail:
        remaining >= reserve
          ? text.budget.passed
          : fill(text.budget.failed, {
              shortfall: money(reserve - remaining),
              reason: offer.exceedsNeeds
                ? text.budget.reasonExceedsNeeds
                : text.budget.reasonHiddenCosts,
            }),
    },
    {
      id: "evidence",
      passed: allChecks,
      title: text.evidence.title,
      detail: fill(text.evidence.detail, {
        checked: relevantChecks,
        total: inspections.length,
        note: allChecks ? text.evidence.complete : text.evidence.incomplete,
      }),
    },
    {
      id: "rights",
      passed: fee === 0 && (!offer.monthly || cancelled) && batteryManaged,
      title: text.rights.title,
      detail: `${fill(fee ? text.rights.feePaid : text.rights.feeRemoved, { fee: money(extraFee) })} ${aftercare}`,
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
    total: criteria.length,
  };
}
