// Cá nhân hoá trong Studio: hàm thuần đọc / ghi `variants` và `personalization.tokens` của JSON chương.
// Luật phải khớp BE `Personalizer` (build/api-docs/personalization.md, mục Studio). BE vẫn là chốt chặn cuối:
// lưu nháp cảnh báo, gửi duyệt chặn. Ở đây chỉ báo sớm để người soạn khỏi đoán.
import { DIMENSION_LABELS, VALUE_LABELS } from "../personalization/model.js";

/** = Personalizer.catalog() ở BE. */
export const CATALOG = {
  gender: ["MALE", "FEMALE"],
  age: ["8_10", "11_14", "15_18"],
  interest: ["SPORT", "GAME", "MUSIC", "ANIME", "ART", "TECH", "FASHION", "TRIP"],
};

/** 5 giọng đã duyệt (BE src/main/resources/voice/voices.json). */
export const VOICES = [
  ["adam", "Adam (nam, Nam Bộ)"],
  ["pham-tuyen", "Phạm Tuyên (nam, Bắc)"],
  ["ngoc-huyen", "Ngọc Huyền (nữ, Bắc)"],
  ["thuc-doan", "Thục Đoan (nữ, Nam Bộ)"],
  ["nu-luu-loat", "Nữ lưu loát"],
];

/** = Personalizer.STRUCTURAL ở BE: biến thể không được đổi, token không được nằm trong. */
export const STRUCTURAL = new Set([
  "id", "type", "kind", "mechanic", "code", "chapterId", "version", "schemaVersion", "releaseVersion", "nextSceneId",
  "targetSceneId", "ifTrueSceneId", "ifFalseSceneId", "onPassSceneId", "onFailSceneId", "speakerId", "backgroundId",
  "characterId", "gameId", "itemId", "choiceGroup", "category", "value", "values", "expectedValue", "correctId", "answer",
  "eq", "in", "all", "any", "op", "var", "expression", "condition", "requires", "when", "field", "sumOf", "rule", "grade",
  "concept", "knowledgeUnits", "position", "mode", "part", "from", "key", "check", "options", "deltaStats", "stats",
  "initialStats", "lockDecisions", "deferLedger", "legacyIds", "voiceUrl", "variants", "personalization", "flag",
]);

const TOKEN = /\{\{([A-Za-z][A-Za-z0-9_]*)\}\}/g;
const TOKEN_NAME = /^[A-Za-z][A-Za-z0-9_]*$/;
const RESERVED = "ASSET_BASE";

export const allLabels = () =>
  Object.entries(CATALOG).flatMap(([dim, values]) => values.map((value) => `${dim}:${value}`));
export const dimOf = (label) => String(label).split(":", 1)[0];
export const labelText = (label) => {
  const [dim, value] = String(label).split(":");
  return `${DIMENSION_LABELS[dim] || dim}: ${VALUE_LABELS[value] || value}`;
};

/** Trường chữ đổi được của một object (dùng cho thẻ mini-game, lựa chọn…). */
export const surfaceFields = (obj) =>
  Object.keys(obj || {}).filter((key) => !STRUCTURAL.has(key) && typeof obj[key] === "string");

/** Số trong chữ, như Personalizer.numbers(): bỏ {{ASSET_BASE}}, bỏ dấu . , ở cuối. */
export const numbersOf = (text) =>
  (String(text || "").replaceAll(RESERVED, "").match(/\d[\d.,]*/g) || []).map((n) => n.replace(/[.,]+$/, ""));

/**
 * Đặt (hoặc bỏ khi value rỗng) một trường của biến thể. Trả object MỚI. Biến thể rỗng → xoá khoá; hết biến thể → xoá `variants`.
 * Đổi `text` mà câu gốc có `spokenText` (cách đọc riêng): tự đặt `spokenText` của biến thể = chữ mới — thiếu nó thì giọng đọc
 * câu GỐC (lỗi CH01 2.3.0). Người soạn vẫn sửa lại cách đọc được.
 */
export function setVariantField(obj, label, field, value) {
  const variants = { ...(obj.variants || {}) };
  const variant = { ...(variants[label] || {}) };
  if (['text', 'prompt', 'spokenText', 'speaker', 'voice'].includes(field) && value !== variant[field]) delete variant.voiceUrl;
  if (value === "" || value == null) delete variant[field];
  else variant[field] = value;
  if (field === "text" && obj.spokenText) {
    const autoFilled = variants[label]?.spokenText === variants[label]?.text;
    if (value === "" || value == null) {
      if (autoFilled) delete variant.spokenText;
    } else if (!variant.spokenText || autoFilled) {
      variant.spokenText = value;
    }
  }
  return withVariant(obj, variants, label, variant);
}

/** Text follows interest; display names and voices follow gender. Other scene
 * fields remain shared. Keep existing per-field dimensions for older drafts. */
export function personalizedScenePatch(scene, answers, patch) {
  const dimensions = { text: 'interest', prompt: 'interest', spokenText: 'interest', speaker: 'gender', voice: 'gender' };
  const shared = {};
  let next = scene;
  for (const [field, value] of Object.entries(patch)) {
    if (!dimensions[field]) { shared[field] = value; continue; }
    const existing = Object.entries(scene.variants || {}).find(([, variant]) => Object.hasOwn(variant, field));
    const dim = existing ? dimOf(existing[0]) : dimensions[field];
    if (CATALOG[dim]?.includes(answers[dim])) next = setVariantField(next, `${dim}:${answers[dim]}`, field, value);
  }
  return next === scene ? shared : { ...shared, variants: next.variants };
}

/** Thêm biến thể rỗng để hiện ô nhập (chưa ghi gì vào JSON cho tới khi có chữ). */
export function addVariant(obj, label) {
  if (obj.variants?.[label]) return obj;
  return { ...obj, variants: { ...(obj.variants || {}), [label]: {} } };
}

export function removeVariant(obj, label) {
  const variants = { ...(obj.variants || {}) };
  return withVariant(obj, variants, label, {});
}

function withVariant(obj, variants, label, variant) {
  if (Object.keys(variant).length) variants[label] = variant;
  else delete variants[label];
  const next = { ...obj, variants };
  if (!Object.keys(variants).length) delete next.variants;
  return next;
}

/** Bỏ biến thể rỗng (thêm rồi chưa gõ gì) trước khi lưu. Đi cả cây. */
export function pruneEmptyVariants(node) {
  if (Array.isArray(node)) return node.map(pruneEmptyVariants);
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === "variants" && value && typeof value === "object") {
      const kept = Object.fromEntries(Object.entries(value).filter(([, v]) => v && Object.keys(v).length));
      if (Object.keys(kept).length) out.variants = kept;
    } else out[key] = pruneEmptyVariants(value);
  }
  return out;
}

/** Nhãn còn thêm được: chưa có, và chiều chưa bị chiều khác "giữ" ở cùng trường (mỗi trường một chiều). */
export function addableLabels(obj) {
  const taken = new Set(Object.keys(obj.variants || {}));
  const dims = new Set([...taken].map(dimOf));
  // Đã có biến thể theo một chiều → chỉ thêm tiếp cùng chiều đó (đơn giản, khỏi lo trùng trường).
  return allLabels().filter((label) => !taken.has(label) && (!dims.size || dims.has(dimOf(label))));
}

/** Lỗi của biến thể trên một object (chuỗi tiếng Việt). `tokens` = personalization.tokens của chương. */
export function variantProblems(obj, tokens = {}) {
  const problems = [];
  const fieldDim = {};
  for (const [label, variant] of Object.entries(obj.variants || {})) {
    if (!allLabels().includes(label)) problems.push(`Nhãn "${label}" không có trong danh mục.`);
    for (const [field, value] of Object.entries(variant || {})) {
      const where = `${labelText(label)} · ${field}`;
      if (STRUCTURAL.has(field)) problems.push(`${where}: trường cấu trúc / chấm điểm, không được đổi.`);
      if (typeof value !== "string") problems.push(`${where}: phải là chữ.`);
      const prev = fieldDim[field];
      if (prev && prev !== dimOf(label)) problems.push(`Trường "${field}" bị hai chiều cùng đổi (${prev}, ${dimOf(label)}).`);
      fieldDim[field] ??= dimOf(label);
      if (isReadable(field, value) && numbersOf(value).join("|") !== numbersOf(obj[field]).join("|"))
        problems.push(
          field === "spokenText"
            ? `${where}: cách đọc phải giữ số như cách đọc gốc (${numbersOf(obj[field]).join(", ") || "viết số bằng chữ, không dùng chữ số"}).`
            : `${where}: phải giữ đúng các con số của câu gốc (${numbersOf(obj[field]).join(", ") || "không có số"}).`,
        );
      for (const name of tokensIn(value))
        if (!tokens[name]) problems.push(`${where}: từ {{${name}}} chưa khai báo ở "Từ thay theo bé".`);
    }
    if (obj.spokenText && variant?.text && !variant.spokenText)
      problems.push(`${labelText(label)}: câu gốc có cách đọc riêng — điền "Cách đọc" cho bản này, nếu không giọng sẽ đọc câu gốc.`);
  }
  return problems;
}

/** = Personalizer.surfaceTexts(): ảnh / giọng là đường dẫn (hash có chữ số) — không kiểm số. */
const MEDIA_FIELDS = new Set(["image", "src", "background", "voice"]);
const isReadable = (field, value) =>
  typeof value === "string" && !MEDIA_FIELDS.has(field) && !value.startsWith("http") && !value.startsWith(`{{${RESERVED}}}`);

const tokensIn = (text) => [...String(text || "").matchAll(TOKEN)].map((m) => m[1]).filter((n) => n !== RESERVED);

// ---------------------------------------------------------------- từ thay theo bé (personalization.tokens)

export const tokensOf = (content) => content?.personalization?.tokens || {};

/** Trả content MỚI với tokens mới; hết token thì bỏ cả `personalization` (nếu không còn khoá nào khác). */
export function withTokens(content, tokens) {
  const personalization = { ...(content.personalization || {}), tokens };
  if (!Object.keys(tokens).length) delete personalization.tokens;
  const next = { ...content, personalization };
  if (!Object.keys(personalization).length) delete next.personalization;
  return next;
}

/** Đổi tên token (và mọi chỗ {{cũ}} trong chương). */
export function renameToken(content, from, to) {
  return renameTokens(content, { [from]: to });
}

/** Rename in one pass so swapped names and rename chains keep their original references. */
export function renameTokens(content, names) {
  const tokens = {};
  const replaced = replaceInStrings(content, names);
  for (const [name, def] of Object.entries(tokensOf(replaced))) tokens[Object.hasOwn(names, name) ? names[name] : name] = def;
  return withTokens(replaced, tokens);
}

function replaceInStrings(node, names) {
  if (typeof node === "string") return node.replace(TOKEN, (match, name) => Object.hasOwn(names, name) ? `{{${names[name]}}}` : match);
  if (Array.isArray(node)) return node.map((v) => replaceInStrings(v, names));
  if (!node || typeof node !== "object") return node;
  return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, replaceInStrings(v, names)]));
}

/** Token đang được dùng ở đâu (số chỗ), để báo "đã khai mà chưa dùng" / "dùng mà chưa khai". */
export function tokenUsage(content) {
  const used = {};
  const walk = (node, key) => {
    if (typeof node === "string") {
      if (key !== "personalization") for (const name of tokensIn(node)) used[name] = (used[name] || 0) + 1;
    } else if (Array.isArray(node)) node.forEach((v) => walk(v, key));
    else if (node && typeof node === "object")
      for (const [k, v] of Object.entries(node)) if (k !== "personalization") walk(v, k);
  };
  walk(content);
  return used;
}

export function tokenProblems(content) {
  const problems = [];
  const tokens = tokensOf(content);
  for (const [name, def] of Object.entries(tokens)) {
    if (!TOKEN_NAME.test(name) || name === RESERVED) problems.push(`Tên "${name}" không hợp lệ (chữ cái đầu, chỉ chữ / số / _).`);
    if (typeof def?.default !== "string" || !def.default) problems.push(`{{${name}}}: thiếu chữ mặc định.`);
    const dims = new Set(Object.keys(def || {}).filter((k) => k !== "default").map(dimOf));
    if (dims.size > 1) problems.push(`{{${name}}}: chỉ được theo một chiều, đang có ${[...dims].join(", ")}.`);
  }
  for (const [name, count] of Object.entries(tokenUsage(content)))
    if (!tokens[name]) problems.push(`{{${name}}} dùng ở ${count} chỗ nhưng chưa khai báo.`);
  return problems;
}

/** Local draft preview; labels never change the source chapter or its routing. */
export function previewPersonalization(content, answers = {}) {
  const labels = Object.entries(answers).filter(([dim, value]) => CATALOG[dim]?.includes(value)).map(([dim, value]) => `${dim}:${value}`);
  const tokens = tokensOf(content);
  const replaceTokens = (value, seen = new Set()) => value.replace(TOKEN, (match, name) => {
    if (name === RESERVED || seen.has(name) || !tokens[name]) return match;
    const def = tokens[name];
    const selected = labels.find(label => typeof def[label] === 'string' && def[label]);
    const replacement = selected ? def[selected] : def.default;
    return typeof replacement === 'string' ? replaceTokens(replacement, new Set([...seen, name])) : match;
  });
  const walk = node => {
    if (typeof node === 'string') return replaceTokens(node);
    if (Array.isArray(node)) return node.map(walk);
    if (!node || typeof node !== 'object') return node;
    const merged = { ...node };
    for (const label of labels) Object.assign(merged, node.variants?.[label]);
    const resolved = Object.fromEntries(Object.entries(merged).filter(([key]) => !['variants', 'personalization'].includes(key)).map(([key, value]) => [key, walk(value)]));
    if (resolved.voiceUrl === node.voiceUrl && ['text', 'prompt', 'spokenText', 'speaker', 'voice'].some(field => resolved[field] !== node[field])) delete resolved.voiceUrl;
    return resolved;
  };
  return walk(content);
}

// A gender variant selects an age token. This composes both dimensions without
// having two dimensions overwrite `src`, which the server rejects.
export function characterAppearanceToken(sceneId, index, gender) {
  const encoded = Array.from(String(sceneId), char => char.codePointAt(0).toString(16)).join('_');
  return `studioCharacter_${encoded}_${index}_${gender}`;
}

export function characterAppearanceDefinition(character, gender, tokens = {}) {
  const src = character.variants?.[`gender:${gender}`]?.src;
  const name = typeof src === 'string' ? /^\{\{(studioCharacter_[A-Za-z0-9_]+)\}\}$/.exec(src)?.[1] : null;
  return name && tokens[name] ? { name, def: tokens[name] } : null;
}

export function setCharacterAppearance(content, sceneId, index, gender, age, url) {
  if (!CATALOG.gender.includes(gender) || !CATALOG.age.includes(age)) return content;
  const scene = content.scenes.find(item => item.id === sceneId);
  const character = scene?.characters?.[index];
  if (!character) return content;
  const label = `gender:${gender}`;
  const tokens = { ...tokensOf(content) };
  const existing = characterAppearanceDefinition(character, gender, tokens);
  if (!url && !existing) return content;
  const uses = existing ? JSON.stringify(content.scenes).split(`{{${existing.name}}}`).length - 1 : 0;
  let name = existing && uses === 1 ? existing.name : characterAppearanceToken(sceneId, index, gender);
  if (!existing || uses > 1) {
    const stem = name;
    for (let suffix = 2; tokens[name]; suffix++) name = `${stem}_${suffix}`;
  }
  const ref = `{{${name}}}`;
  const def = { ...(existing?.def || { default: character.variants?.[label]?.src || character.src || '' }) };
  if (url) def[`age:${age}`] = url;
  else delete def[`age:${age}`];
  let next;
  if (Object.keys(def).some(key => key !== 'default')) {
    tokens[name] = def;
    next = setVariantField(character, label, 'src', ref);
  } else {
    delete tokens[name];
    next = setVariantField(character, label, 'src', def.default === character.src ? '' : def.default);
  }
  return withTokens({ ...content, scenes: content.scenes.map(item => item.id === sceneId
    ? { ...item, characters: item.characters.map((value, i) => i === index ? next : value) } : item) }, tokens);
}
