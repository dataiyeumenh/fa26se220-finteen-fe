export function patchSceneVoice(scene, patch) {
  const next = { ...scene, ...patch };
  const changed = (key) => Object.hasOwn(patch, key) && patch[key] !== scene[key];
  if (changed("text") || changed("prompt")) {
    if (!Object.hasOwn(patch, "spokenText")) delete next.spokenText;
    delete next.voiceUrl;
  }
  if (["spokenText", "speaker", "speakerId", "voice"].some(changed)) {
    delete next.voiceUrl;
  }
  return next;
}
