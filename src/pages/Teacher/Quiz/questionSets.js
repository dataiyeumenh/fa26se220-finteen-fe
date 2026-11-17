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

export function selectRandomQuestions(selected, sourceQuestions, count, random = Math.random) {
  const sourceIds = new Set(sourceQuestions.map((question) => question.id));
  const next = new Set([...selected].filter((id) => !sourceIds.has(id)));
  const shuffled = [...sourceQuestions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  shuffled.slice(0, count).forEach((question) => next.add(question.id));
  return next;
}
