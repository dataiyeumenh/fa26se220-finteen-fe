export function nextSceneId(code, scenes) {
  const used = new Set(scenes.map((scene) => scene.id));
  let number = scenes.length + 1;
  while (used.has(`${code}_SC${String(number).padStart(2, "0")}`)) number++;
  return `${code}_SC${String(number).padStart(2, "0")}`;
}

export function insertScene(scenes, index, scene) {
  const copy = scenes.map((value) => ({ ...value }));
  const previous = copy[index];
  if (
    previous &&
    !["choice", "ending"].includes(previous.type) &&
    "nextSceneId" in previous
  )
    previous.nextSceneId = scene.id;
  const position = Math.min(index + 1, scenes.length);
  copy.splice(position, 0, scene);
  return { scenes: copy, index: position };
}

export function copyScene(scene, id) {
  const copy = structuredClone(scene);
  delete copy.onFailSceneId;
  copy.id = id;
  copy.title = `${scene.title || "Cảnh"} (bản sao)`;
  for (const key of [
    "nextSceneId",
    "onPassSceneId",
    "ifTrueSceneId",
    "ifFalseSceneId",
  ]) {
    if (copy[key] === scene.id) copy[key] = id;
  }
  if (copy.options)
    copy.options = copy.options.map((option, index) => ({
      ...option,
      id: `${id}_OPT${index + 1}`,
      ...(option.nextSceneId === scene.id ? { nextSceneId: id } : {}),
    }));
  return copy;
}
