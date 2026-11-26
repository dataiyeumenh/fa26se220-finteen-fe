import { apiConfig } from '../../api/config.js';

/** Compare display text with the server's spoken form without loosening words,
 * punctuation or amounts. Currency shorthand is read as the unit's full name. */
export function normalizeVoiceReading(text) {
  return String(text ?? '').normalize('NFC')
    .replace(/(\d[\d.,]*)\s*(?:đồng|vnđ|vnd|₫|đ)(?!\p{L})/giu, '$1 đồng')
    .replace(/\s+/gu, ' ').trim();
}

export function sceneReadText(scene) {
  return [scene?.spokenText, scene?.text, scene?.prompt].find(value => typeof value === 'string' && value.trim()) || '';
}

// The asset key can be assigned/replaced by the renderer after enqueueing.
export const voiceLineIdentity = item => JSON.stringify([item.sceneId, item.speakerId || null, item.profile, normalizeVoiceReading(item.readText)]);

export function pendingVoiceBatch(voice) {
  return (voice?.items || []).filter(item => ['MISSING', 'FAILED', 'PENDING'].includes(item.status)).map(item => ({ ...item }));
}

export function voiceBatchItems(batch, voice) {
  const current = new Map((voice?.items || []).map(item => [voiceLineIdentity(item), item]));
  return (batch || []).map(item => current.get(voiceLineIdentity(item)) || item);
}

/** LineStatus returns an asset key, not a voiceUrl. Ready clips are public
 * files under the same API base's /assets/v directory. */
export function voiceClipUrl(item, baseUrl = apiConfig.baseUrl) {
  if (item?.status !== 'READY') return undefined;
  if (item.voiceUrl) return item.voiceUrl;
  if (typeof item.key !== 'string' || !/^[A-Za-z0-9_-]+$/.test(item.key)) return undefined;
  return `${baseUrl.replace(/\/+$/, '')}/assets/v/${encodeURIComponent(item.key)}.mp3`;
}

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

/** Infer the server's character default from linked base recordings, never
 * from the first personalized result (which may use another gender's voice). */
export function defaultSceneVoice(scene, items = [], baseScenes = []) {
  const sources = baseScenes.filter(source => !source.voice && source.voiceUrl
    && (scene.speakerId ? source.speakerId === scene.speakerId : source.id === scene.id));
  const profilesFor = sources => new Set(sources.flatMap(source => items.filter(item =>
    item.sceneId === source.id && item.speakerId === source.speakerId
    && normalizeVoiceReading(item.readText) === normalizeVoiceReading(sceneReadText(source))
    && voiceClipUrl(item) === source.voiceUrl).map(item => item.profile)).filter(Boolean));
  const own = profilesFor(sources.filter(source => source.id === scene.id));
  if (own.size === 1) return [...own][0];
  const profiles = profilesFor(sources);
  return profiles.size === 1 ? [...profiles][0] : undefined;
}

/** Never substitute a base/other variant recording just because its scene ID matches. */
export function sceneVoicePlayback(scene, items = [], baseScenes = []) {
  if (!scene || scene.voice === 'off') return { status: 'OFF' };
  const profile = scene.voice || defaultSceneVoice(scene, items, baseScenes);
  const readText = normalizeVoiceReading(sceneReadText(scene));
  const matches = items.filter(item => item.sceneId === scene.id && readText && normalizeVoiceReading(item.readText) === readText
    && (!item.speakerId || !scene.speakerId || item.speakerId === scene.speakerId)
    && (!profile || item.profile === profile));
  const profiles = new Set(matches.map(item => item.profile));
  const match = profiles.size <= 1 ? matches.find(item => voiceClipUrl(item)) || matches[0] : null;
  if (voiceClipUrl(match)) return { ...match, voiceUrl: voiceClipUrl(match) };
  if (scene.voiceUrl) return { ...match, status: 'READY', voiceUrl: scene.voiceUrl };
  return match ? { ...match, voiceUrl: voiceClipUrl(match) } : { status: 'MISSING' };
}

export function withSceneVoicePlayback(content, items = [], baseScenes = content.scenes || []) {
  return { ...content, scenes: (content.scenes || []).map(scene => {
    const playback = sceneVoicePlayback(scene, items, baseScenes);
    return playback.status === 'READY' && playback.voiceUrl ? { ...scene, voiceUrl: playback.voiceUrl } : scene;
  }) };
}
