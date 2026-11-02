import test from "node:test";
import assert from "node:assert/strict";
import { patchSceneVoice } from "../src/features/studio/sceneVoice.js";

const scene = { text: "Old dialogue", spokenText: "Old reading", voiceUrl: "old.mp3", speakerId: "AN" };
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
