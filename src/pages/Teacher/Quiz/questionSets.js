export function questionSetCode(question) {
  const prefix = (value) => String(value || "").trim().toUpperCase()
    .match(/^([A-Z][A-Z0-9]*)(?:[-_\s]|$)/)?.[1];
  return prefix(question.externalId) || prefix(question.pool) || "KHÁC";
}

export function groupQuestionSets(questions) {
  const groups = new Map();
  const seen = new Set();
  for (const question of questions) {
    if (!question.id || seen.has(question.id)) continue;
    seen.add(question.id);
    const code = questionSetCode(question);
    if (!groups.has(code)) groups.set(code, { code, questions: [] });
    groups.get(code).questions.push(question);
  }
  return [...groups.values()].sort((a, b) => a.code.localeCompare(b.code));
}

export function toggleQuestionSet(selected, questions) {
  const next = new Set(selected);
  const allSelected = questions.every((question) => next.has(question.id));
  for (const question of questions) {
    if (allSelected) next.delete(question.id);
    else next.add(question.id);
  }
  return next;
}
