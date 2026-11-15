// Soạn cá nhân hoá không cần JSON: "bản theo bé" của từng cảnh / lựa chọn / thẻ mini-game, và "Từ thay theo bé" cấp chương.
// Dữ liệu và luật ở variantOps.js (khớp BE Personalizer). Mỗi ô hiện kèm chữ GỐC để người soạn so song song.
import { useState } from "react";
import { Copy, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { CHILD_QUESTIONS, DIMENSION_LABELS, VALUE_LABELS } from "../personalization/model.js";
import {
  CATALOG,
  VOICES,
  characterAppearanceDefinition,
  dimOf,
  labelText,
  removeVariant,
  renameTokens,
  setVariantField,
  surfaceFields,
  tokenProblems,
  tokenUsage,
  tokensOf,
  variantProblems,
  withTokens,
} from "./variantOps.js";

const FIELD_LABELS = {
  text: "Lời thoại / chữ",
  spokenText: "Cách đọc cho giọng",
  speaker: "Tên người nói",
  label: "Nhãn",
  title: "Tiêu đề",
  explanation: "Giải thích",
  description: "Mô tả",
  dataText: "Nội dung khi mở",
  buttonText: "Chữ trên nút",
  hint: "Gợi ý",
  feedback: "Phản hồi",
  prompt: "Câu hỏi",
  image: "Ảnh",
  src: "Ảnh",
  voice: "Giọng đọc",
};
const IMAGE_FIELDS = new Set(["image", "src", "popupImage", "icon", "goalImage", "calendarImage", "timeImage"]);

/**
 * Biến thể của MỘT object. `fields`: khoá được sửa (chữ / ảnh). `voice` chỉ hiện ở nhãn giới tính.
 * onChange(objMới) — object trả về đã bỏ `variants` khi rỗng.
 */
export function VariantEditor({ title, obj, fields, onChange, write, tokens, onPickImage, selectedLabel }) {
  const [interest, setInterest] = useState("SPORT");
  const label = selectedLabel || `interest:${interest}`;
  const problems = variantProblems(obj, tokens);
  return (
    <div className="studio-variant-block">
      {title && <h4>{title}</h4>}
      {!selectedLabel && <label>Sở thích
        <select value={interest} onChange={event => setInterest(event.target.value)}>
          {CATALOG.interest.map(value => <option key={value} value={value}>{VALUE_LABELS[value]}{Object.keys(obj.variants?.[`interest:${value}`] || {}).length ? ' • Đã chỉnh' : ''}</option>)}
        </select>
      </label>}
      <p className="studio-muted">{Object.keys(obj.variants?.[label] || {}).length ? 'Đã có nội dung riêng cho nhãn này.' : 'Đang dùng bản gốc. Nhập nội dung bên dưới để tạo bản riêng.'}</p>
        <fieldset key={label} className="studio-variant" disabled={!write}>
          <legend>
            {labelText(label)}
            {!!obj.variants?.[label] && <button type="button" aria-label={`Bỏ bản ${labelText(label)}`} onClick={() => onChange(removeVariant(obj, label))}>
              <Trash2 size={14} /> Dùng bản gốc
            </button>}
          </legend>
          {fields
            .filter((key) => key !== "voice" || dimOf(label) === "gender")
            .map((key) => {
              const value = obj.variants?.[label]?.[key] ?? "";
              const set = (next) => onChange(setVariantField(obj, label, key, next));
              if (key === "voice")
                return (
                  <label key={key}>
                    {FIELD_LABELS.voice}
                    <select value={value} onChange={(event) => set(event.target.value)}>
                      <option value="">Như bản gốc</option>
                      {VOICES.map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              if (IMAGE_FIELDS.has(key))
                return (
                  <div key={key} className="studio-variant-image">
                    <span>{FIELD_LABELS[key] || key}</span>
                    {obj[key] && <img src={obj[key]} alt="Ảnh gốc" title="Ảnh gốc" />}
                    <span aria-hidden>→</span>
                    {value ? <img src={value} alt="Ảnh theo bé" /> : <small>như gốc</small>}
                    <button type="button" onClick={() => onPickImage?.((url) => set(url))}>
                      <ImagePlus size={14} /> Chọn ảnh
                    </button>
                    {value && (
                      <button type="button" onClick={() => set("")}>
                        Bỏ
                      </button>
                    )}
                  </div>
                );
              return (
                <label key={key}>
                  {FIELD_LABELS[key] || key}
                  <small className="studio-variant-base">Gốc: {obj[key] || "—"}</small>
                  <textarea
                    rows={String(value || obj[key] || "").length > 80 ? 3 : 2}
                    value={value}
                    placeholder="Để trống = giữ như gốc"
                    onChange={(event) => set(event.target.value)}
                  />
                </label>
              );
            })}
        </fieldset>
      {!!problems.length && (
        <ul className="studio-variant-problems" role="alert">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const editable = (obj, extra = []) => [...new Set([...surfaceFields(obj).filter((key) => key in FIELD_LABELS), ...extra])];

/** Mục "Cá nhân hoá" trong khung Thuộc tính cảnh: cảnh, phần bấm xem (inspect), từng lựa chọn. */
export function ScenePersonalization({ scene, update, write, tokens, interest }) {
  const key = scene.type === 'reflection' ? 'prompt' : 'text';
  if (typeof scene[key] !== 'string') return <p className="studio-muted">Cảnh này không có lời thoại để chỉnh theo sở thích.</p>;
  const label = `interest:${interest}`;
  const problems = variantProblems(scene, tokens);
  return <div className="studio-variant-block">
    <p className="studio-muted">{labelText(label)} · Chỉnh lời thoại trực tiếp trong khung thoại.</p>
    {scene.variants?.[label] && <button type="button" disabled={!write} onClick={() => update({ variants: removeVariant(scene, label).variants })}>Dùng bản gốc</button>}
    {!!problems.length && <ul className="studio-variant-problems" role="alert">{problems.map(problem => <li key={problem}>{problem}</li>)}</ul>}
  </div>;
}

export function PersonalizationControls({ active, onActive, answers, onAnswers }) {
  return <section className="personalization-controls" aria-label="Chọn bản nội dung">
    <div className="personalization-mode" role="group" aria-label="Chế độ biên tập">
      <button type="button" aria-pressed={!active} onClick={() => onActive(false)}>Bản gốc</button>
      <button type="button" aria-pressed={active} onClick={() => onActive(true)}>Cá nhân hóa</button>
    </div>
    {active ? <>
      <div className="personalization-answers">{Object.entries(CATALOG).map(([dim, values]) => <label key={dim}>
        <span>{DIMENSION_LABELS[dim]} <small>{dim === 'gender' ? 'Nhân vật nam / nữ' : dim === 'age' ? 'Style nhân vật' : 'Lời thoại & asset mini-game'}</small></span>
        <select aria-label={DIMENSION_LABELS[dim]} title={CHILD_QUESTIONS[dim]} value={answers[dim]} onChange={event => onAnswers({ ...answers, [dim]: event.target.value })}>
          {values.map(value => <option key={value} value={value}>{VALUE_LABELS[value]}</option>)}
        </select>
      </label>)}</div>
      <p>Khung cảnh hiển thị theo 3 nhãn đang chọn. Nội dung chưa chỉnh sẽ dùng bản gốc.</p>
    </> : <p>Chỉnh nội dung chung tại khung cảnh. Chọn “Cá nhân hóa” để soạn theo giới tính, tuổi và sở thích.</p>}
  </section>;
}

export function CharacterPersonalization({ scene, preview, answers, tokens, write, onPickImage, onChange }) {
  if (!scene.characters?.length) return <p className="studio-muted">Cảnh này chưa có nhân vật. Thêm nhân vật trong Bản gốc trước.</p>;
  return <div className="personalization-characters">
    <p className="studio-muted">Chọn ảnh cho {VALUE_LABELS[answers.gender].toLowerCase()}, {VALUE_LABELS[answers.age]}. Vị trí và vai trò nhân vật giữ theo bản gốc.</p>
    {scene.characters.map((character, index) => {
      const own = characterAppearanceDefinition(character, answers.gender, tokens)?.def[`age:${answers.age}`];
      return <fieldset key={`${character.id}-${index}`} disabled={!write} className="personalization-character">
        <legend>{character.id || `Nhân vật ${index + 1}`}</legend>
        <div className="personalization-character-preview">{preview.characters?.[index]?.src && <img src={preview.characters[index].src} alt={`Ảnh hiện tại của ${character.id || 'nhân vật'}`} />}<span>{own ? 'Đã có ảnh riêng' : 'Đang dùng ảnh dự phòng / bản gốc'}</span></div>
        <button type="button" onClick={() => onPickImage(url => onChange(index, answers.gender, answers.age, url))}><ImagePlus size={16} /> Chọn ảnh nhân vật</button>
        {own && <button type="button" onClick={() => onChange(index, answers.gender, answers.age, '')}>Dùng ảnh dự phòng / bản gốc</button>}
      </fieldset>;
    })}
  </div>;
}

/** Tab "Theo bé" của MinigameDialog: mọi object có `id` trong game (thẻ, câu hỏi, phương án…). */
export function MinigamePersonalization({ draft, onChange, tokens, onPickImage, initialInterest = 'SPORT' }) {
  const [interest, setInterest] = useState(initialInterest);
  const targets = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...path, i]));
    else if (node && typeof node === "object") {
      if ((node.id || Object.keys(node).some(k => IMAGE_FIELDS.has(k))) && editable(node, Object.keys(node).filter((k) => IMAGE_FIELDS.has(k))).length)
        targets.push({ path, node });
      for (const [key, value] of Object.entries(node)) if (key !== "variants" && typeof value === "object") walk(value, [...path, key]);
    }
  };
  walk(draft, []);
  if (!targets.length) return <p className="studio-muted">Mini-game này không có thẻ / câu nào có chữ riêng.</p>;
  return (
    <div className="studio-personalization">
      <label>Sở thích áp dụng<select value={interest} onChange={event => setInterest(event.target.value)}>{CATALOG.interest.map(value => <option key={value} value={value}>{VALUE_LABELS[value]}</option>)}</select></label>
      <p className="studio-muted">
        Chỉ đổi chữ và ảnh. Đáp án (Cần / Muốn, đúng / sai, số) giữ nguyên cho mọi bé.
      </p>
      {targets.map(({ path, node }) => (
        <VariantEditor
          key={path.join(".")}
          title={node.label || node.title || node.text || node.id}
          obj={node}
          selectedLabel={`interest:${interest}`}
          fields={editable(node, Object.keys(node).filter((k) => IMAGE_FIELDS.has(k)))}
          write
          tokens={tokens}
          onPickImage={onPickImage}
          onChange={(next) => onChange(path, next)}
        />
      ))}
    </div>
  );
}

/** "Từ thay theo bé" (personalization.tokens): một từ, chữ mặc định, giá trị theo MỘT chiều. */
export function TokensDialog({ content, onSave, onClose }) {
  const [rows, setRows] = useState(() =>
    Object.entries(tokensOf(content)).map(([name, def]) => ({
      orig: name,
      name,
      def: { ...def },
      dim: dimOf(Object.keys(def).find((k) => k !== "default") || "interest:"),
    })),
  );
  const [copied, setCopied] = useState("");
  const build = () => {
    const next = renameTokens(content, Object.fromEntries(rows.filter((row) => row.orig && row.orig !== row.name).map((row) => [row.orig, row.name])));
    const tokens = {};
    for (const row of rows) {
      const def = { default: row.def.default || "" };
      for (const [k, v] of Object.entries(row.def)) if (k !== "default" && dimOf(k) === row.dim && v) def[k] = v;
      tokens[row.name] = def;
    }
    return withTokens(next, tokens);
  };
  const preview = build();
  const duplicateNames = rows.filter((row, index) => rows.findIndex((other) => other.name === row.name) !== index).map((row) => row.name);
  const invalidNames = rows.some((row) => !/^[A-Za-z][A-Za-z0-9_]*$/.test(row.name) || row.name === "ASSET_BASE");
  const problems = [...tokenProblems(preview), ...new Set(duplicateNames.map((name) => `Tên "${name}" bị trùng. Hãy đặt tên riêng để không ghi đè từ khác.`))];
  const usage = tokenUsage(preview);
  const setRow = (index, patch) => setRows(rows.map((row, k) => (k === index ? { ...row, ...patch } : row)));
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="studio-dialog max-w-3xl max-h-[88vh] overflow-auto sm:rounded-xl" aria-describedby={undefined}>
        <DialogTitle className="studio-dialog-title">Từ thay theo bé</DialogTitle>
        <p className="studio-muted">
          Dùng khi một từ lặp ở nhiều câu (ví dụ "tai nghe"). Gõ <code>{"{{tên}}"}</code> vào lời thoại, bé thuộc nhóm nào sẽ
          thấy chữ của nhóm đó; bé khác thấy chữ mặc định. Mỗi từ chỉ theo một chiều.
        </p>
        {rows.map((row, index) => (
          <fieldset key={index} className="studio-token">
            <legend>
              <input
                aria-label="Tên từ"
                value={row.name}
                onChange={(event) => setRow(index, { name: event.target.value.trim() })}
                placeholder="tenTu"
              />
              <small>{usage[row.name] ? `dùng ở ${usage[row.name]} chỗ` : "chưa dùng"}</small>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`{{${row.name}}}`);
                  setCopied(row.name);
                }}
              >
                <Copy size={14} /> {copied === row.name ? "Đã chép" : `Chép {{${row.name}}}`}
              </button>
              <button type="button" aria-label="Xoá từ" onClick={() => setRows(rows.filter((_, k) => k !== index))}>
                <Trash2 size={14} />
              </button>
            </legend>
            <label>
              Mặc định
              <input value={row.def.default || ""} onChange={(event) => setRow(index, { def: { ...row.def, default: event.target.value } })} />
            </label>
            <label>
              Thay theo
              <select value={row.dim} onChange={(event) => setRow(index, { dim: event.target.value })}>
                {Object.keys(CATALOG).map((dim) => (
                  <option key={dim} value={dim}>
                    {DIMENSION_LABELS[dim]}
                  </option>
                ))}
              </select>
            </label>
            {(CATALOG[row.dim] || []).map((value) => {
              const key = `${row.dim}:${value}`;
              return (
                <label key={key}>
                  {VALUE_LABELS[value] || value}
                  <input
                    value={row.def[key] || ""}
                    placeholder="để trống = như mặc định"
                    onChange={(event) => setRow(index, { def: { ...row.def, [key]: event.target.value } })}
                  />
                </label>
              );
            })}
          </fieldset>
        ))}
        <button type="button" onClick={() => setRows([...rows, { orig: "", name: `tu${rows.length + 1}`, def: { default: "" }, dim: "interest" }])}>
          <Plus size={14} /> Thêm từ
        </button>
        {!!problems.length && (
          <ul className="studio-variant-problems" role="alert">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        )}
        <div className="studio-dialog-actions">
          <span />
          <button type="button" onClick={onClose}>
            Thôi
          </button>
          <button type="button" className="is-primary" disabled={invalidNames || duplicateNames.length > 0} onClick={() => onSave(preview)}>
            Xong
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
