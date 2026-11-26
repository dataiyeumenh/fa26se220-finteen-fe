// Child-facing recap: chapter content + this playthrough only. Adult report
// endpoints, I/C/P, reflection grades and gameplay stats do not belong here.
export function firstMiniGameScore(game, result) {
  if (!result || !Number.isInteger(result.total) || result.total <= 0) return null;
  const total = result.total;
  if (Number.isFinite(result.firstScore))
    return Math.max(0, Math.min(total, result.firstScore));
  const inputs = result.inputs;
  if (inputs) {
    if (game.items?.every((item) => item.category != null))
      return game.items.filter((item) => inputs[item.id] === item.category).length;
    if (game.dropZones && game.draggables)
      return game.dropZones.filter((zone) => game.draggables.find((item) => item.id === inputs[zone.id])?.value === zone.expectedValue).length;
    if (game.jobs && game.questions) {
      const fit = game.jobs.filter((job) => inputs[job.id] != null &&
        (inputs[job.id] === 'fit') === (job.hours <= game.weeklyLimit)).length;
      return fit + game.questions.filter((question) => inputs[question.id] === question.correctId).length;
    }
  }
  if (Number.isFinite(result.firstPercent))
    return Math.round(total * Math.max(0, Math.min(100, result.firstPercent)) / 100);
  // Older checkpoints may contain only the corrected score. Do not present it
  // as a first submission or fabricate a zero for a missing result.
  return null;
}

export function buildChildChapterReport(data, ledger, results, money, matches = () => false) {
  const config = data.endingReport || {};
  const pickLine = (list) => (list || []).find((item) => !item.when || matches(item.when))?.text || null;
  const miniGames = (data.scenes || []).filter((scene) => scene.game).map((scene) => {
    const game = scene.game;
    const result = results[scene.id];
    // Savings Race is practice without scored questions.
    if (!result?.completed || result.outcome || !result.total) return null;
    return {
      id: scene.id,
      title: game.title || scene.title || 'Mini-game',
      correct: firstMiniGameScore(game, result),
      total: result.total,
    };
  }).filter(Boolean);
  const choices = new Map();
  for (const scene of data.scenes || []) {
    if (scene.type !== 'choice') continue;
    const group = scene.choiceGroup || scene.id;
    const entry = ledger[group];
    const option = scene.options?.find((item) => item.id === entry?.optionId);
    if (!option || option.deferLedger) continue;
    // Reflection remains in the story and is scored separately for adults.
    if (option.reflectionScore != null || option.reflectionEvidenceScores || scene.reflection) continue;
    // Forced confirmations/monthly payments are not independent decisions.
    if (scene.options.length < 2) continue;
    choices.set(group, {
      id: group,
      title: scene.title || entry.sceneTitle || 'Lựa chọn trong truyện',
      label: option.label || option.text || entry.label || 'Lựa chọn trong truyện',
      revised: Boolean(entry.revised),
    });
  }
  return {
    money: { start: data.initialMoney ?? 0, end: money },
    miniGames,
    decisions: [...choices.values()],
    achieved: pickLine(config.achieved),
    practice: pickLine(config.practice),
    next: config.nextStep || null,
  };
}
