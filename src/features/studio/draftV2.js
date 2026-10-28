// Only the obsolete scene transition is removed; preserve all other content.
export function prepareDraftV2(content) {
  if (!content || !Array.isArray(content.scenes)) return content;
  return {
    ...content,
    scenes: content.scenes.map((scene) => {
      const next = { ...scene };
      delete next.onFailSceneId;
      return next;
    }),
  };
}

export function parseCondition(text) {
  return text.trim() ? JSON.parse(text) : undefined;
}

export function hasCondition(option) {
  return option.condition !== undefined && option.condition !== null;
}
