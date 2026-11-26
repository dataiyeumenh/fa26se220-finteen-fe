import test from "node:test";
import assert from "node:assert/strict";
import { defaultSceneVoice, normalizeVoiceReading, patchSceneVoice, pendingVoiceBatch, sceneVoicePlayback, voiceBatchItems, voiceClipUrl, withSceneVoicePlayback } from "../src/features/studio/sceneVoice.js";

const scene = { text: "Old dialogue", spokenText: "Old reading", voiceUrl: "old.mp3", speakerId: "AN" };

test('character default links edited dialogue when male and female recordings both exist', () => {
  const base = { id: 'S1', speakerId: 'AN', text: 'Base', voiceUrl: 'base.mp3' };
  const edited = { id: 'S1', speakerId: 'AN', text: 'Edited' };
  const items = [
    { sceneId: 'S1', speakerId: 'AN', readText: 'Edited', profile: 'ngoc-huyen', status: 'READY', voiceUrl: 'female.mp3' },
    { sceneId: 'S1', speakerId: 'AN', readText: 'Base', profile: 'adam', status: 'READY', voiceUrl: 'base.mp3' },
    { sceneId: 'S1', speakerId: 'AN', readText: 'Edited', profile: 'adam', status: 'READY', voiceUrl: 'male.mp3' },
  ];
  assert.equal(defaultSceneVoice(edited, items, [base]), 'adam');
  assert.equal(sceneVoicePlayback(edited, items, [base]).voiceUrl, 'male.mp3');
  assert.equal(sceneVoicePlayback({ ...edited, voice: 'ngoc-huyen' }, items, [base]).voiceUrl, 'female.mp3');
  assert.equal(sceneVoicePlayback({ ...edited, voice: 'pham-tuyen' }, items, [base]).voiceUrl, undefined);
  assert.equal(withSceneVoicePlayback({ scenes: [edited] }, items, [base]).scenes[0].voiceUrl, 'male.mp3');
  assert.equal(edited.voice, undefined);
  const pending = items.map(item => item.voiceUrl === 'male.mp3' ? { ...item, status: 'PENDING' } : item);
  assert.equal(sceneVoicePlayback(edited, pending, [base]).status, 'PENDING');
  assert.equal(sceneVoicePlayback(edited, pending, [base]).voiceUrl, undefined);
});

test('default can be learned from another base scene of the same speaker, without guessing conflicting defaults', () => {
  const selected = { id: 'S1', speakerId: 'AN', text: 'Edited' };
  const bases = [{ id: 'S2', speakerId: 'AN', text: 'Base', voiceUrl: 'base.mp3' }];
  const items = [{ sceneId: 'S2', speakerId: 'AN', readText: 'Base', profile: 'adam', status: 'READY', voiceUrl: 'base.mp3' }];
  assert.equal(defaultSceneVoice(selected, items, bases), 'adam');
  assert.equal(defaultSceneVoice({ ...selected, speakerId: 'MINH' }, items, bases), undefined);
  assert.equal(defaultSceneVoice(selected, items, [{ ...bases[0], voice: 'adam' }]), undefined);
  bases.push({ id: 'S3', speakerId: 'AN', text: 'Other', voiceUrl: 'other.mp3' });
  items.push({ sceneId: 'S3', speakerId: 'AN', readText: 'Other', profile: 'ngoc-huyen', status: 'READY', voiceUrl: 'other.mp3' });
  assert.equal(defaultSceneVoice(selected, items, bases), undefined);
});

test('selected scene finds generated audio when server expands currency shorthand', () => {
  const text = 'Skin trong game đang giảm giá còn 250.000đ nè An ơi! Nhóm mình mua chung để tối nay leo rank nhé!';
  const selected = { id: 'S1', speakerId: 'MINH', voice: 'pham-tuyen', text };
  const ready = { sceneId: 'S1', speakerId: 'MINH', profile: 'pham-tuyen', readText: text.replace('250.000đ', '250.000 đồng'), status: 'READY', key: 'skin_voice' };
  assert.ok(sceneVoicePlayback(selected, [ready]).voiceUrl.endsWith('/assets/v/skin_voice.mp3'));
  assert.ok(withSceneVoicePlayback({ scenes: [selected] }, [ready]).scenes[0].voiceUrl.endsWith('/assets/v/skin_voice.mp3'));
  for (const unit of ['đ', '₫', 'VND', 'VNĐ', 'đồng']) {
    assert.equal(normalizeVoiceReading(`Giá 250.000${unit}!`), 'Giá 250.000 đồng!');
  }
  assert.equal(sceneVoicePlayback({ ...selected, text: text.replace('250.000', '300.000') }, [ready]).voiceUrl, undefined);
  assert.equal(sceneVoicePlayback({ ...selected, text: text.replace('Skin', 'Giày') }, [ready]).voiceUrl, undefined);
  assert.equal(sceneVoicePlayback({ ...selected, voice: 'adam' }, [ready]).voiceUrl, undefined);
  assert.equal(sceneVoicePlayback({ ...selected, speakerId: 'AN' }, [ready]).voiceUrl, undefined);
});

test('voice matching normalizes whitespace and Unicode while honoring a separate reading', () => {
  const selected = { id: 'S1', text: 'Giá 250.000đ', spokenText: 'Hai trăm năm mươi nghìn đồng!' };
  const ready = { sceneId: 'S1', readText: '  Hai trăm\n năm mươi nghìn đồng!  '.normalize('NFD'), profile: 'adam', status: 'READY', key: 'spoken_voice' };
  assert.ok(sceneVoicePlayback(selected, [ready]).voiceUrl.endsWith('/assets/v/spoken_voice.mp3'));
  assert.equal(sceneVoicePlayback({ ...selected, spokenText: 'Ba trăm nghìn đồng!' }, [ready]).voiceUrl, undefined);
  assert.equal(normalizeVoiceReading('Giá 1,5đ'), 'Giá 1,5 đồng');
  assert.notEqual(normalizeVoiceReading('Giá 1,5đ'), normalizeVoiceReading('Giá 15đ'));
  assert.equal(sceneVoicePlayback({ id: 'S1', text: ' ', spokenText: ' ' }, [{ ...ready, readText: '' }]).voiceUrl, undefined);
});

test('a render batch excludes existing recordings and keeps its newly completed clips', () => {
  const old = { sceneId: 'S1', key: 'old', readText: 'Old', profile: 'adam', status: 'READY' };
  const missing = { sceneId: 'S1', key: 'new', readText: 'New', profile: 'adam', status: 'MISSING' };
  const failed = { sceneId: 'S2', key: 'retry', readText: 'Retry', profile: 'pham-tuyen', status: 'FAILED' };
  const before = { items: [old, missing, failed] };
  const batch = pendingVoiceBatch(before);
  assert.deepEqual(batch, [missing, failed]);
  assert.notEqual(batch[0], missing);
  const ready = { ...missing, status: 'READY' };
  const unexpected = { sceneId: 'S3', key: 'another', status: 'READY' };
  assert.deepEqual(voiceBatchItems(batch, { items: [old, ready, { ...failed, status: 'PENDING' }, unexpected] }), [ready, { ...failed, status: 'PENDING' }]);
  assert.equal(missing.status, 'MISSING');
  assert.deepEqual(pendingVoiceBatch({ items: [old, ready] }), []);
});

test('batch identity distinguishes different readings and profiles of the same scene', () => {
  const first = { sceneId: 'S1', key: 'one', readText: 'First', profile: 'adam', status: 'PENDING' };
  const second = { sceneId: 'S1', key: 'two', readText: 'Second', profile: 'pham-tuyen', status: 'MISSING' };
  const batch = pendingVoiceBatch({ items: [first, second] });
  assert.deepEqual(voiceBatchItems(batch, { items: [{ ...second, status: 'READY' }, { ...first, status: 'READY' }] }).map(item => item.key), ['one', 'two']);
  assert.deepEqual(voiceBatchItems(batch, null), batch);
});

test('completed render follows a line whose asset key and currency notation changed', () => {
  const pending = { sceneId: 'S1', speakerId: 'AN', profile: 'adam', readText: 'Giá 500.000đ', status: 'PENDING' };
  const ready = { ...pending, readText: 'Giá 500.000 đồng', key: 'rendered_clip', status: 'READY' };
  assert.deepEqual(voiceBatchItems([pending], { items: [ready] }), [ready]);
  assert.equal(sceneVoicePlayback({ id: 'S1', text: pending.readText, voiceUrl: 'outdated.mp3' }, [ready]).voiceUrl, voiceClipUrl(ready));
});

test('real LineStatus contract maps READY key to the public mp3 under the API prefix', () => {
  const line = { sceneId: 'S1', speakerId: 'ME', readText: 'Xin chào', profile: 'ngoc-huyen', key: '364b59d6f1d5c5faccc5', status: 'READY' };
  assert.equal(voiceClipUrl(line, 'https://kidzeconomy.com.vn/finteen/'), 'https://kidzeconomy.com.vn/finteen/assets/v/364b59d6f1d5c5faccc5.mp3');
  assert.equal(voiceClipUrl({ ...line, status: 'PENDING' }), undefined);
  assert.equal(voiceClipUrl({ ...line, status: 'FAILED' }), undefined);
  assert.equal(voiceClipUrl({ ...line, key: undefined }), undefined);
  assert.equal(voiceClipUrl({ ...line, key: '../other-file' }), undefined);
  assert.equal(voiceClipUrl({ ...line, voiceUrl: 'https://cdn.example/clip.mp3' }), 'https://cdn.example/clip.mp3');
});

test('key-only READY responses attach to matching personalized scenes and play previews', () => {
  const personalized = { id: 'S1', text: 'Thoại riêng', speakerId: 'AN', voice: 'adam' };
  const item = { sceneId: 'S1', readText: 'Thoại riêng', speakerId: 'AN', profile: 'adam', status: 'READY', key: 'custom_voice_key' };
  assert.ok(sceneVoicePlayback(personalized, [item]).voiceUrl.endsWith('/assets/v/custom_voice_key.mp3'));
  assert.ok(withSceneVoicePlayback({ scenes: [personalized] }, [item]).scenes[0].voiceUrl.endsWith('/assets/v/custom_voice_key.mp3'));
  assert.equal(sceneVoicePlayback({ ...personalized, text: 'Đã sửa' }, [item]).voiceUrl, undefined);
  assert.equal(sceneVoicePlayback({ ...personalized, voice: 'pham-tuyen' }, [item]).voiceUrl, undefined);
});
test("dialogue edits invalidate the old reading and mp3", () => {
  const next = patchSceneVoice(scene, { text: "New dialogue" });
  assert.equal(next.text, "New dialogue");
  assert.equal(next.spokenText, undefined);
  assert.equal(next.voiceUrl, undefined);
  assert.equal(scene.voiceUrl, "old.mp3");
});
test("reading or speaker edits invalidate mp3", () => {
  assert.equal(patchSceneVoice(scene, { spokenText: "New reading" }).voiceUrl, undefined);
  assert.equal(patchSceneVoice(scene, { speakerId: "MOTHER" }).voiceUrl, undefined);
});
test("unrelated and unchanged edits preserve mp3", () => {
  assert.equal(patchSceneVoice(scene, { title: "New title" }).voiceUrl, "old.mp3");
  assert.equal(patchSceneVoice(scene, { text: scene.text }).voiceUrl, "old.mp3");
});

test('generated recordings must match scene, reading, speaker and selected voice', () => {
  const current = { id: 'S1', text: 'Giày mới', spokenText: 'Giày mới!', speakerId: 'AN', voice: 'adam' };
  const ready = { sceneId: 'S1', readText: 'Giày mới!', speakerId: 'AN', profile: 'adam', status: 'READY', voiceUrl: 'right.mp3' };
  const items = [
    { ...ready, readText: 'Tai nghe', voiceUrl: 'base.mp3' },
    { ...ready, profile: 'ngoc-huyen', voiceUrl: 'female.mp3' },
    { ...ready, speakerId: 'MINH', voiceUrl: 'other-speaker.mp3' },
    ready,
  ];
  assert.equal(sceneVoicePlayback(current, items).voiceUrl, 'right.mp3');
  assert.equal(sceneVoicePlayback({ ...current, text: 'Mới', spokenText: undefined }, items).voiceUrl, undefined);
  assert.equal(sceneVoicePlayback({ ...current, voice: 'off' }, items).voiceUrl, undefined);
  assert.equal(withSceneVoicePlayback({ scenes: [current] }, items).scenes[0].voiceUrl, 'right.mp3');
  assert.equal(current.voiceUrl, undefined);
});

test('pending and ambiguous voice results never expose an unrelated recording', () => {
  const current = { id: 'S1', text: 'Hello' };
  const item = { sceneId: 'S1', readText: 'Hello', profile: 'adam', status: 'PENDING', voiceUrl: 'old.mp3' };
  assert.equal(sceneVoicePlayback(current, [item]).voiceUrl, undefined);
  assert.equal(sceneVoicePlayback(current, [{ ...item, status: 'READY' }, { ...item, status: 'READY', profile: 'ngoc-huyen', voiceUrl: 'female.mp3' }]).voiceUrl, undefined);
  assert.equal(sceneVoicePlayback({ ...current, voiceUrl: 'known-base.mp3' }, [item]).voiceUrl, 'known-base.mp3');
  assert.equal(sceneVoicePlayback(current, [{ ...item, status: 'READY', voiceUrl: undefined }]).status, 'READY');
});
