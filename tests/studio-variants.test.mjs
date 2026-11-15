import test from "node:test";
import assert from "node:assert/strict";
import {
  addVariant,
  addableLabels,
  numbersOf,
  pruneEmptyVariants,
  removeVariant,
  renameToken,
  renameTokens,
  setVariantField,
  tokenProblems,
  variantProblems,
  withTokens,
  previewPersonalization,
  setCharacterAppearance,
  characterAppearanceDefinition,
  personalizedScenePatch,
} from "../src/features/studio/variantOps.js";

const SPORT = "interest:SPORT";

test("set and remove variant fields; empty variant and empty variants are dropped", () => {
  const scene = { id: "S1", text: "Tai nghe giảm còn 250.000đ" };
  const one = setVariantField(scene, SPORT, "text", "Giày giảm còn 250.000đ");
  assert.deepEqual(one.variants, { [SPORT]: { text: "Giày giảm còn 250.000đ" } });
  assert.equal(scene.variants, undefined, "input is not mutated");
  const cleared = setVariantField(one, SPORT, "text", "");
  assert.equal("variants" in cleared, false);
  assert.equal("variants" in removeVariant(one, SPORT), false);
});

test('personalized edits route display names and speech separately from shared scene settings', () => {
  const scene = { id: 'S1', text: 'Gốc', speaker: 'An', nextSceneId: 'S2', variants: { 'age:8_10': { description: 'Young' } } };
  const answers = { gender: 'FEMALE', age: '8_10', interest: 'MUSIC' };
  const patch = personalizedScenePatch(scene, answers, { text: 'Bản nhạc', speaker: 'Lan', voice: 'ngoc-huyen', title: 'Tên cảnh', nextSceneId: 'END' });
  assert.equal(patch.text, undefined);
  assert.equal(patch.speaker, undefined);
  assert.equal(patch.title, 'Tên cảnh');
  assert.equal(patch.nextSceneId, 'END');
  assert.deepEqual(patch.variants['interest:MUSIC'], { text: 'Bản nhạc' });
  assert.deepEqual(patch.variants['gender:FEMALE'], { speaker: 'Lan', voice: 'ngoc-huyen' });
  assert.deepEqual(patch.variants['age:8_10'], scene.variants['age:8_10']);
  assert.deepEqual(variantProblems({ ...scene, ...patch }), []);
  const reset = personalizedScenePatch({ ...scene, ...patch }, answers, { speaker: '' });
  assert.equal(reset.variants['gender:FEMALE'].speaker, undefined);
  assert.equal(scene.speaker, 'An');
});

test('older drafts keep their existing name dimension without conflicting field writes', () => {
  const scene = { text: 'Gốc', speaker: 'An', variants: { [SPORT]: { speaker: 'Bình' } } };
  const patch = personalizedScenePatch(scene, { gender: 'FEMALE', interest: 'MUSIC' }, { speaker: 'Lan' });
  assert.deepEqual(patch.variants['interest:MUSIC'], { speaker: 'Lan' });
  assert.equal(patch.variants['gender:FEMALE'], undefined);
  assert.deepEqual(variantProblems({ ...scene, ...patch }), []);
});

test('server-provided variant audio survives preview and is invalidated by speech edits', () => {
  const scene = { id: 'S1', text: 'Gốc', voiceUrl: 'base.mp3', variants: { [SPORT]: { text: 'Thể thao', voiceUrl: 'sport.mp3' } } };
  assert.equal(previewPersonalization({ scenes: [scene] }, { interest: 'SPORT' }).scenes[0].voiceUrl, 'sport.mp3');
  const changed = setVariantField(scene, SPORT, 'text', 'Câu mới');
  assert.equal(changed.variants[SPORT].voiceUrl, undefined);
  assert.equal(previewPersonalization({ scenes: [changed] }, { interest: 'SPORT' }).scenes[0].voiceUrl, undefined);
  assert.equal(scene.variants[SPORT].voiceUrl, 'sport.mp3');
});

test('preview composes gender, age, interest and tokens without changing routing or scores', () => {
  let content = { scenes: [{ id: 'S1', type: 'dialogue', text: 'Mua {{item}} giá 250.000đ', voiceUrl: 'old.mp3',
    nextSceneId: 'S2', characters: [{ id: 'AN', src: 'base.webp', position: 'left' }],
    game: { id: 'G', items: [{ id: 'I', image: 'base-item.webp', category: 'WANTS', value: 250000, variants: { [SPORT]: { image: 'sport.webp' } } }] },
  }] };
  content = withTokens(content, { item: { default: 'tai nghe', [SPORT]: 'giày' } });
  content = setCharacterAppearance(content, 'S1', 0, 'FEMALE', '11_14', 'girl-teen.webp');
  content = setCharacterAppearance(content, 'S1', 0, 'FEMALE', '8_10', 'girl-child.webp');
  content = setCharacterAppearance(content, 'S1', 0, 'MALE', '11_14', 'boy-teen.webp');
  const saved = JSON.stringify(content);
  const preview = previewPersonalization(content, { gender: 'FEMALE', age: '11_14', interest: 'SPORT' });
  const scene = preview.scenes[0];
  assert.equal(scene.characters[0].src, 'girl-teen.webp');
  assert.equal(scene.characters[0].position, 'left');
  assert.equal(scene.text, 'Mua giày giá 250.000đ');
  assert.equal(scene.voiceUrl, undefined, 'never play base audio over personalized text');
  assert.equal(scene.nextSceneId, 'S2');
  assert.equal(scene.game.items[0].image, 'sport.webp');
  assert.equal(scene.game.items[0].category, 'WANTS');
  assert.equal(scene.game.items[0].value, 250000);
  assert.equal(JSON.stringify(content), saved);
  assert.deepEqual(variantProblems(content.scenes[0].characters[0], content.personalization.tokens), []);
  assert.deepEqual(tokenProblems(content), []);
  const fallback = previewPersonalization(content, { gender: 'FEMALE', age: '15_18', interest: 'TECH' }).scenes[0];
  assert.equal(fallback.characters[0].src, 'base.webp');
  assert.equal(fallback.text, 'Mua tai nghe giá 250.000đ');
  assert.equal(fallback.game.items[0].image, 'base-item.webp');
});

test('clearing one appearance preserves other ages and removes the empty mapping', () => {
  const original = { scenes: [{ id: 'S1', characters: [{ id: 'AN', src: 'base.webp', variants: { 'gender:FEMALE': { src: 'female-default.webp' } } }] }] };
  let content = setCharacterAppearance(original, 'S1', 0, 'FEMALE', '8_10', 'young.webp');
  content = setCharacterAppearance(content, 'S1', 0, 'FEMALE', '11_14', 'teen.webp');
  content = setCharacterAppearance(content, 'S1', 0, 'FEMALE', '8_10', '');
  assert.equal(previewPersonalization(content, { gender: 'FEMALE', age: '8_10' }).scenes[0].characters[0].src, 'female-default.webp');
  assert.equal(previewPersonalization(content, { gender: 'FEMALE', age: '11_14' }).scenes[0].characters[0].src, 'teen.webp');
  content = setCharacterAppearance(content, 'S1', 0, 'FEMALE', '11_14', '');
  assert.deepEqual(content, original);
});

test('duplicating scenes or reordering characters does not make appearance edits leak', () => {
  let content = { scenes: [{ id: 'S1', characters: [{ id: 'AN', src: 'base.webp' }, { id: 'MINH', src: 'minh.webp' }] }] };
  content = setCharacterAppearance(content, 'S1', 0, 'MALE', '8_10', 'an.webp');
  content = setCharacterAppearance(content, 'S1', 1, 'MALE', '8_10', 'minh-young.webp');
  content.scenes.push({ ...structuredClone(content.scenes[0]), id: 'S2' });
  content = setCharacterAppearance(content, 'S2', 0, 'MALE', '8_10', 'copy.webp');
  let preview = previewPersonalization(content, { gender: 'MALE', age: '8_10' });
  assert.equal(preview.scenes[0].characters[0].src, 'an.webp');
  assert.equal(preview.scenes[1].characters[0].src, 'copy.webp');
  content.scenes[0].characters.reverse();
  content = setCharacterAppearance(content, 'S1', 0, 'MALE', '8_10', 'minh-revised.webp');
  preview = previewPersonalization(content, { gender: 'MALE', age: '8_10' });
  assert.equal(preview.scenes[0].characters[0].src, 'minh-revised.webp');
  assert.equal(preview.scenes[0].characters[1].src, 'an.webp');
  assert.ok(characterAppearanceDefinition(content.scenes[0].characters[0], 'MALE', content.personalization.tokens));
});

test('preview preserves unknown and asset tokens and stops recursive token definitions', () => {
  const content = withTokens({ scenes: [{ text: '{{a}} {{unknown}} {{ASSET_BASE}}' }] }, { a: { default: '{{b}}' }, b: { default: '{{a}}' } });
  assert.equal(previewPersonalization(content).scenes[0].text, '{{a}} {{unknown}} {{ASSET_BASE}}');
});

test("base spokenText: variant text auto-fills the variant spokenText (CH01 2.3.0 bug)", () => {
  const scene = { id: "S1", text: "Còn 250.000đ", spokenText: "Còn hai trăm năm mươi nghìn đồng" };
  const typed = setVariantField(scene, SPORT, "text", "Giày còn 250.000đ");
  assert.equal(typed.variants[SPORT].spokenText, "Giày còn 250.000đ");
  // the auto-filled reading still has digits while the base reading has none → must be spelled out
  assert.ok(variantProblems(typed).some((p) => p.includes("cách đọc phải giữ số")));
  const spelled = setVariantField(typed, SPORT, "spokenText", "Giày còn hai trăm năm mươi nghìn đồng");
  assert.deepEqual(variantProblems(spelled), []);
  // a hand-written reading is not overwritten by later text edits
  const again = setVariantField(spelled, SPORT, "text", "Giày mới còn 250.000đ");
  assert.equal(again.variants[SPORT].spokenText, "Giày còn hai trăm năm mươi nghìn đồng");
  // text without any reading when the base has one → warned
  const bare = { ...scene, variants: { [SPORT]: { text: "Giày còn 250.000đ" } } };
  assert.ok(variantProblems(bare).some((p) => p.includes("điền \"Cách đọc\"")));
});

test("numbers must match the base like Personalizer; images and voices are not checked", () => {
  assert.deepEqual(numbersOf("7 USD nhân 25.000đ, còn 300.000."), ["7", "25.000", "300.000"]);
  const item = { id: "I1", label: "Tai nghe 2 cái", image: "{{ASSET_BASE}}/a/aaa.webp" };
  const wrong = setVariantField(item, SPORT, "label", "Giày 3 đôi");
  assert.ok(variantProblems(wrong).some((p) => p.includes("con số")));
  const image = setVariantField(item, SPORT, "image", "{{ASSET_BASE}}/a/0eb57dbe071eca310936.webp");
  assert.deepEqual(variantProblems(image), []);
});

test("one field one dimension; structural fields and unknown tokens are reported", () => {
  const obj = { id: "S1", text: "Chào", variants: { [SPORT]: { text: "A" }, "age:8_10": { text: "B" } } };
  assert.ok(variantProblems(obj).some((p) => p.includes("hai chiều")));
  assert.ok(variantProblems({ id: "x", variants: { [SPORT]: { category: "WANTS" } } }).some((p) => p.includes("cấu trúc")));
  assert.ok(variantProblems({ id: "x", text: "a", variants: { [SPORT]: { text: "{{item}}" } } }).some((p) => p.includes("{{item}}")));
  assert.deepEqual(variantProblems({ id: "x", text: "a", variants: { [SPORT]: { text: "{{item}}" } } }, { item: { default: "x" } }), []);
  assert.ok(addableLabels({ variants: { [SPORT]: { text: "A" } } }).every((label) => label.startsWith("interest:")));
});

test("added-but-empty variants are pruned before save", () => {
  const content = { scenes: [addVariant({ id: "S1", text: "a" }, SPORT), { id: "S2", text: "b", variants: { [SPORT]: { text: "c" } } }] };
  const pruned = pruneEmptyVariants(content);
  assert.equal("variants" in pruned.scenes[0], false);
  assert.deepEqual(pruned.scenes[1].variants, { [SPORT]: { text: "c" } });
});

test("tokens: declare, rename everywhere, and report problems", () => {
  const content = { scenes: [{ id: "S1", text: "Mua {{item}} đi" }] };
  assert.ok(tokenProblems(content).some((p) => p.includes("chưa khai báo")));
  const declared = withTokens(content, { item: { default: "tai nghe", [SPORT]: "giày" } });
  assert.deepEqual(tokenProblems(declared), []);
  const renamed = renameToken(declared, "item", "goods");
  assert.equal(renamed.scenes[0].text, "Mua {{goods}} đi");
  assert.deepEqual(Object.keys(renamed.personalization.tokens), ["goods"]);
  const twoDims = withTokens(content, { item: { default: "x", [SPORT]: "a", "age:8_10": "b" } });
  assert.ok(tokenProblems(twoDims).some((p) => p.includes("một chiều")));
  assert.equal("personalization" in withTokens(declared, {}), false);
});

test("renaming multiple tokens preserves swapped references and updates nested token values", () => {
  const content = withTokens({ scenes: [{ text: "{{item}} và {{goods}}", variants: { [SPORT]: { text: "{{goods}}" } } }] }, {
    item: { default: "tai nghe" }, goods: { default: "giày", [SPORT]: "{{item}}" },
  });
  const swapped = renameTokens(content, { item: "goods", goods: "item" });
  assert.equal(swapped.scenes[0].text, "{{goods}} và {{item}}");
  assert.equal(swapped.scenes[0].variants[SPORT].text, "{{item}}");
  assert.deepEqual(swapped.personalization.tokens, { goods: { default: "tai nghe" }, item: { default: "giày", [SPORT]: "{{goods}}" } });
  assert.equal(content.scenes[0].text, "{{item}} và {{goods}}");
});
