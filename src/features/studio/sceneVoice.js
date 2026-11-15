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

export const voiceLineIdentity = item => JSON.stringify([item.sceneId, item.key || null, item.profile, item.readText]);

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

/** Never substitute a base/other variant recording just because its scene ID matches. */
export function sceneVoicePlayback(scene, items = []) {
  if (!scene || scene.voice === 'off') return { status: 'OFF' };
  const readText = normalizeVoiceReading(sceneReadText(scene));
  const matches = items.filter(item => item.sceneId === scene.id && readText && normalizeVoiceReading(item.readText) === readText
    && (!item.speakerId || !scene.speakerId || item.speakerId === scene.speakerId)
    && (!scene.voice || item.profile === scene.voice));
  const profiles = new Set(matches.map(item => item.profile));
  const match = profiles.size <= 1 ? matches.find(item => voiceClipUrl(item)) || matches[0] : null;
  if (scene.voiceUrl) return { ...match, status: 'READY', voiceUrl: scene.voiceUrl };
  return match ? { ...match, voiceUrl: voiceClipUrl(match) } : { status: 'MISSING' };
}

export function withSceneVoicePlayback(content, items = []) {
  return { ...content, scenes: (content.scenes || []).map(scene => {
    const playback = sceneVoicePlayback(scene, items);
    return playback.status === 'READY' && playback.voiceUrl ? { ...scene, voiceUrl: playback.voiceUrl } : scene;
  }) };
}
