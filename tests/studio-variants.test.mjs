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
  patchInspect,
  patchChoiceText,
} from "../src/features/studio/variantOps.js";

const SPORT = "interest:SPORT";

test('choice wording follows interest while base labels, destinations, scoring and locks stay intact', () => {
  const original = { id: 'A', text: 'Mua tai nghe 250.000đ', label: 'Mua tai nghe 250.000đ', nextSceneId: 'S2', deltaStats: { SAVING: -10 }, condition: { flag: 'READY' }, lockedReason: 'Chưa đủ điều kiện' };
  const option = patchChoiceText(original, 'Mua giày 250.000đ', 'SPORT');
  assert.equal(original.variants, undefined);
  assert.equal(option.text, original.text);
  assert.equal(option.label, original.label);
  assert.deepEqual(option.variants[SPORT], { text: 'Mua giày 250.000đ', label: 'Mua giày 250.000đ' });
  assert.equal(option.nextSceneId, 'S2');
  assert.equal(option.deltaStats, original.deltaStats);
  assert.equal(option.condition, original.condition);
  assert.equal(option.lockedReason, original.lockedReason);
  const content = { scenes: [{ id: 'S1', type: 'choice', options: [option] }] };
  assert.equal(previewPersonalization(content, { interest: 'SPORT', gender: 'FEMALE', age: '15_18' }).scenes[0].options[0].text, 'Mua giày 250.000đ');
  assert.equal(previewPersonalization(content, { interest: 'MUSIC' }).scenes[0].options[0].text, original.text);
  assert.deepEqual(variantProblems(option), []);
  const baseEdit = patchChoiceText(option, 'Mua đồ dùng 250.000đ');
  assert.equal(baseEdit.text, 'Mua đồ dùng 250.000đ');
  assert.equal(baseEdit.variants[SPORT].text, 'Mua giày 250.000đ');
  assert.deepEqual(patchChoiceText(option, '', 'SPORT'), original);
});

test('label-only choices keep their schema and other interest versions are preserved', () => {
  const original = { id: 'B', label: 'Tiết kiệm 7 đồng', nextSceneId: 'END', variants: { 'interest:MUSIC': { label: 'Để dành 7 đồng' } } };
  const next = patchChoiceText(original, 'Tiết kiệm mua bóng 7 đồng', 'SPORT');
  assert.equal(next.text, undefined);
  assert.equal(next.variants[SPORT].text, undefined);
  assert.equal(next.variants[SPORT].label, 'Tiết kiệm mua bóng 7 đồng');
  assert.deepEqual(next.variants['interest:MUSIC'], original.variants['interest:MUSIC']);
  assert.deepEqual(variantProblems(next), []);
  assert.equal(patchChoiceText(next, 'Sai', 'MALE'), next);
  const shortLabel = { id: 'C', text: 'Mua tai nghe 250.000đ', label: 'A' };
  const edited = patchChoiceText(shortLabel, 'Mua giày 250.000đ', 'SPORT');
  assert.equal(edited.label, 'A');
  assert.equal(edited.variants[SPORT].label, undefined, 'a distinct short label is not replaced with the full wording');
  assert.deepEqual(variantProblems(edited), []);
});

test('inspect button, popup text and image follow the selected interest without changing the base or flags', () => {
  const original = { id: 'I1', buttonText: 'Mở phong bì', dataText: 'Bạn nhận 500.000đ. Đóng học phí ngày 28.', popupImage: '/images/base-1.webp', setFlags: { opened: true }, autoNextSceneOnClose: true };
  const answers = { gender: 'FEMALE', age: '11_14', interest: 'SPORT' };
  const inspect = patchInspect(original, { buttonText: 'Xem tiền học bóng đá', dataText: 'Bạn nhận 500.000đ. Đóng phí học bóng đá ngày 28.', popupImage: '/images/sport-2.webp', id: 'WRONG', setFlags: { opened: false } }, answers);
  assert.equal(original.variants, undefined);
  assert.equal(inspect.id, 'I1');
  assert.equal(inspect.setFlags, original.setFlags);
  assert.equal(inspect.autoNextSceneOnClose, true);
  assert.deepEqual(variantProblems(inspect), []);
  const content = { scenes: [{ id: 'S1', type: 'inspect', nextSceneId: 'S2', inspect }] };
  const rendered = previewPersonalization(content, answers).scenes[0];
  assert.equal(rendered.inspect.buttonText, 'Xem tiền học bóng đá');
  assert.equal(rendered.inspect.popupImage, '/images/sport-2.webp');
  assert.match(rendered.inspect.dataText, /bóng đá/);
  assert.equal(rendered.nextSceneId, 'S2');
  assert.equal(previewPersonalization(content, { ...answers, interest: 'GAME' }).scenes[0].inspect.dataText, original.dataText);
  const cleared = patchInspect(inspect, { popupImage: '', dataText: '', buttonText: '' }, answers);
  assert.deepEqual(cleared, original);
});

test('inspect gallery edits preserve captions, sibling images and existing variants', () => {
  const inspect = { id: 'I1', buttonText: 'Xem', popupImages: [
    { src: 'one.webp', caption: 'Ảnh 1', description: 'Thông tin 1', variants: { 'interest:MUSIC': { src: 'music.webp' } } },
    { src: 'two.webp', caption: 'Ảnh 2' },
  ] };
  const next = patchInspect(inspect, { popupImages: [{ src: 'sport.webp' }] }, { interest: 'SPORT' });
  assert.equal(next.popupImages.length, 2);
  assert.equal(next.popupImages[0].src, 'one.webp');
  assert.equal(next.popupImages[0].caption, 'Ảnh 1');
  assert.equal(next.popupImages[1], inspect.popupImages[1]);
  assert.equal(next.variants, undefined, 'never write an array as a variant field');
  assert.equal(next.popupImages[0].variants['interest:MUSIC'].src, 'music.webp');
  const render = answers => previewPersonalization({ scenes: [{ inspect: next }] }, answers).scenes[0].inspect;
  assert.equal(render({ interest: 'SPORT' }).popupImages[0].src, 'sport.webp');
  assert.equal(render({ interest: 'MUSIC' }).popupImages[0].src, 'music.webp');
  assert.equal(render({ interest: 'TECH' }).popupImages[0].src, 'one.webp');
  const baseEdit = patchInspect(next, { popupImages: [{ src: 'base-new.webp' }] });
  assert.equal(baseEdit.popupImages[0].src, 'base-new.webp');
  assert.equal(baseEdit.popupImages[0].variants['interest:SPORT'].src, 'sport.webp');
  assert.equal(baseEdit.popupImages[1], next.popupImages[1]);
});

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
  // Editing dialogue must invalidate a hand-written reading of the old line.
  const again = setVariantField(spelled, SPORT, "text", "Giày mới còn 250.000đ");
  assert.equal(again.variants[SPORT].spokenText, "Giày mới còn 250.000đ");
  // text without any reading when the base has one → warned
  const bare = { ...scene, variants: { [SPORT]: { text: "Giày còn 250.000đ" } } };
  assert.ok(variantProblems(bare).some((p) => p.includes("điền \"Cách đọc\"")));
});

test('editing existing personalized dialogue replaces stale reading even when the base has no reading', () => {
  const old = { text: 'Giày còn 250.000đ', spokenText: 'Giày còn hai trăm năm mươi nghìn đồng', voiceUrl: 'old.mp3' };
  const scene = { id: 'S1', text: 'Gốc', variants: { [SPORT]: old } };
  const unchanged = setVariantField(scene, SPORT, 'text', old.text);
  assert.equal(unchanged.variants[SPORT].spokenText, old.spokenText);
  assert.equal(unchanged.variants[SPORT].voiceUrl, 'old.mp3');
  const updated = setVariantField(scene, SPORT, 'text', `${old.text}. Tôi thử cảnh này`);
  assert.equal(updated.variants[SPORT].spokenText, `${old.text}. Tôi thử cảnh này`);
  assert.equal(updated.variants[SPORT].voiceUrl, undefined);
  assert.equal(old.spokenText, 'Giày còn hai trăm năm mươi nghìn đồng');
  const cleared = setVariantField(updated, SPORT, 'text', '');
  assert.equal(cleared.variants, undefined);
  const prompt = { prompt: 'Câu gốc', variants: { [SPORT]: { prompt: 'Câu cũ', spokenText: 'Đọc câu cũ' } } };
  assert.equal(setVariantField(prompt, SPORT, 'prompt', 'Câu mới').variants[SPORT].spokenText, 'Câu mới');
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
