// Ô nhập mini-game gửi lên BE (POST /api/play/chapter → miniGames[]: {gameId, itemId = mã ô, chosen = giá trị}). BE chấm bằng
// `grade` trong JSON bản đã chơi — FE KHÔNG gửi đúng / sai (spec build/spec-cham-minigame-be-2026-10-24.md, play.md mục khuôn v3).
// Gửi bản chụp LẦN NỘP ĐẦU; bỏ ô trống (BE từ chối chuỗi rỗng).
export function compactInputs(inputs) {
  return Object.fromEntries(
    Object.entries(inputs || {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

// Các khung nộp mỗi vòng MỘT lần (state sau khi nộp không đổi) → state lúc xong chính là lần nộp đầu.
// Tên ô khớp `grade.input` do ops/finteen-assets/them_grade.py khai.

/** COMPOUND_TIMELINE: mỗi câu chấm một lần — lấy câu trả lời đầu (history[q].firstAttempt). */
export const timelineInputs = (history) =>
  compactInputs(
    Object.fromEntries(
      Object.entries(history || {}).map(([id, h]) => [id, h?.firstAttempt]),
    ),
  );

/** LOAN_DETECTIVE: receipt<offer> = tổng trả trẻ nhập, sort<offer> = khay, cart = giỏ, statement = mức trả; chỉ vòng của cảnh. */
export function loanInputs(config, state, rounds) {
  const inputs = {};
  for (const task of config.tasks.filter((t) => rounds.includes(t.round))) {
    if (task.id.startsWith("receipt"))
      inputs[task.id] = state.totals?.[task.id.slice(7)];
    else if (task.id.startsWith("sort"))
      inputs[task.id] = state.sorted?.[task.id.slice(4)];
    else if (task.id.startsWith("cart"))
      inputs.cart = state.basket?.length ? state.basket : undefined;
    else if (task.id.startsWith("statement"))
      inputs.statement = state.statementChoice;
  }
  return compactInputs(inputs);
}

/** SCAM_OR_SAFE: vòng 0 payment + documents, vòng 1 mỗi tin một ô, vòng 2 slots (thứ tự hành động). */
export function safetyInputs(config, state, rounds) {
  const inputs = {};
  if (rounds.includes(0))
    Object.assign(inputs, {
      payment: state.payment,
      documents: state.documents,
    });
  if (rounds.includes(1))
    for (const m of config.inbox.messages)
      inputs[m.id] = state.messages?.[m.id];
  if (rounds.includes(2))
    inputs.slots = state.response?.length ? state.response : undefined;
  return compactInputs(inputs);
}

/** FUTURE_PLAN: portfolio → allocation, claims → claims, planner → plan_<tháng> = {goal, flexible}. */
export function futureInputs(config, state) {
  if (config.mode === "portfolio")
    return compactInputs({ allocation: state.allocation });
  if (config.mode === "claims") return compactInputs({ claims: state.checks });
  return compactInputs(
    Object.fromEntries(
      config.planner.months.map((m, i) => [
        `plan_${m.id}`,
        state.submittedMonths?.[i] ? state.budgets[i] : undefined,
      ]),
    ),
  );
}
