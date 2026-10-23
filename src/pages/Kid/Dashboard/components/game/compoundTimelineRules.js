import { chapterMiniGameSummary } from "./miniGameRules.js";
// Dữ liệu mini-game (câu hỏi, số liệu) nằm trong JSON chương: game.config (khung COMPOUND_TIMELINE).
export const timelineAt = (year, { principal, ratePercent }) => ({
  compound: Math.round(principal * (1 + ratePercent / 100) ** year),
  simple: Math.round(principal * (1 + (ratePercent / 100) * year)),
});
export function gradeReflection(activity, answer) {
  if (activity === "reflection1") {
    const has = (key) => answer.selected.includes(key);
    const relevant = [
      "deadline",
      "withdrawal",
      "fees",
      "provider",
      "protection",
    ].filter(has).length;
    return {
      I:
        relevant >= 4 && !has("color") && !has("friend")
          ? 2
          : relevant >= 2
            ? 1
            : 0,
      C: answer.method === "net" ? 2 : 0,
      P:
        has("deadline") && has("withdrawal") && has("fees")
          ? 2
          : has("deadline")
            ? 1
            : 0,
    };
  }
  const feasible =
    answer.action === "revise" ||
    (answer.action === "keepB" && answer.accountB) ||
    (answer.action === "verified" && answer.verified);
  const timely = ["month1", "month2"].includes(answer.date);
  return {
    I: feasible ? 2 : 0,
    C: feasible ? 2 : 0,
    P: feasible && timely ? 2 : timely ? 1 : 0,
  };
}
export function gradeRound(
  questions,
  round,
  answers,
  history = {},
  inspectedItems = [],
) {
  const next = { ...history };
  for (const q of questions.filter((item) => item.round === round)) {
    if (history[q.id]) continue; // Submitted answers are final for this chapter run.
    const answer = answers[q.id];
    const correct =
      typeof q.answer === "number"
        ? answer != null &&
          String(answer).trim() !== "" &&
          Number(answer) === q.answer
        : answer === q.answer;
    const old = history[q.id];
    next[q.id] = {
      answer,
      attemptCount: (old?.attemptCount || 0) + 1,
      firstAttempt: old ? old.firstAttempt : answer,
      firstAttemptCorrect: old ? old.firstAttemptCorrect : correct,
      finalCorrect: correct,
      inspectedItems: [
        ...new Set([...(old?.inspectedItems || []), ...inspectedItems]),
      ],
    };
  }
  return next;
}
export function timelineResult({ questions, competencies: keys }, history) {
  const score = questions.filter((q) => history[q.id]?.finalCorrect).length;
  const first = questions.filter(
    (q) => history[q.id]?.firstAttemptCorrect,
  ).length;
  const competencies = Object.fromEntries(
    keys.map((key) => {
      const group = questions.filter((q) => q.competency === key);
      return [
        key,
        {
          correct: group.filter((q) => history[q.id]?.finalCorrect).length,
          total: group.length,
        },
      ];
    }),
  );
  return {
    score,
    total: questions.length,
    completed: questions.every((q) => Boolean(history[q.id])),
    passed: score === questions.length,
    answers: history,
    firstAttempt: Object.fromEntries(
      questions.map((q) => [q.id, history[q.id]?.firstAttempt]),
    ),
    firstPercent: Math.round((100 * first) / questions.length),
    competencies,
    attemptCount: Math.max(
      0,
      ...Object.values(history).map((item) => item.attemptCount),
    ),
    revised: Object.values(history).some((item) => item.attemptCount > 1),
    inspectedItems: [
      ...new Set(Object.values(history).flatMap((item) => item.inspectedItems)),
    ],
  };
}
export function chapterFiveLearning(ledger, results, config) {
  const sum = (value) =>
    Object.values(value || {}).reduce((total, n) => total + n, 0);
  const groups = Object.entries(config.choiceGroupMaxima);
  const max = groups.reduce((total, [, n]) => total + n, 0);
  const choicePercent =
    (100 *
      groups.reduce(
        (total, [id]) => total + sum(ledger[id]?.evidenceScores),
        0,
      )) /
    max;
  const firstPercent =
    (100 *
      groups.reduce(
        (total, [id]) => total + sum(ledger[id]?.firstEvidenceScores),
        0,
      )) /
    max;
  const miniGames = chapterMiniGameSummary(results, config);
  const { miniPercent } = miniGames;
  const reflectionScore = Object.values(ledger).reduce(
    (total, entry) => total + (entry.reflectionScore || 0),
    0,
  );
  const reflectionPercent = Math.min(
    100,
    (100 * reflectionScore) / config.reflectionMax,
  );
  const learningScore =
    choicePercent * config.weights.choices +
    miniPercent * config.weights.miniGame +
    reflectionPercent * config.weights.reflection;
  return {
    ...miniGames,
    choicePercent,
    firstPercent,
    miniPercent,
    reflectionPercent,
    learningScore,
    reflectionCompleted: Boolean(ledger.CH05_R1 && ledger.CH05_R2),
  };
}
