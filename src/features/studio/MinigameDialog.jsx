// Soạn nội dung mini-game ở chế độ đơn giản: chữ theo vùng, đáp án tích chọn, con số và ảnh; JSON để ở Nâng cao.
// Làm trên BẢN SAO của game — chỉ ghi vào cảnh khi bấm Xong.
import { useId, useMemo, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { vietnameseError } from "../../lib/vietnameseMessages.js";
import {
  getAt,
  gradeItems,
  setAnswer,
  setAt,
  settingFields,
  textGroups,
} from "./minigameOps";
import { MinigamePersonalization } from "./PersonalizationPanel";
import { personalizationDisplay } from './variantOps.js';
import './minigame-dialog.css';

const TABS = [
  ["texts", "Chữ trên màn chơi"],
  ["answers", "Đáp án"],
  ["settings", "Con số và ảnh"],
  ["variants", "Theo bé"],
  ["json", "Nâng cao (JSON)"],
];
const TAB_HELP = {
  texts: ['Nội dung trẻ sẽ đọc', 'Mở từng nhóm để sửa tiêu đề, hướng dẫn và nội dung trên màn chơi.'],
  answers: ['Chọn đáp án đúng', 'Đáp án được dùng để chấm kết quả khi trẻ chơi mini-game.'],
  settings: ['Thiết lập màn chơi', 'Điều chỉnh các con số và thay hình ảnh dùng chung cho mọi bé.'],
  variants: ['Nội dung theo sở thích của bé', 'Chọn sở thích, rồi mở nội dung muốn thay. Phần để trống sẽ dùng bản gốc.'],
  json: ['Chỉnh dữ liệu JSON', 'Dành cho chỉnh sửa nâng cao. Dữ liệu cần đúng định dạng trước khi chuyển tab hoặc bấm Xong.'],
};

export default function MinigameDialog({
  game,
  kind,
  tokens,
  initialTab = 'texts',
  interest,
  onPickImage,
  onSave,
  onClose,
}) {
  const [draft, setDraft] = useState(() => structuredClone(game || {}));
  const [tab, setTab] = useState(initialTab);
  const [json, setJson] = useState(null);
  const [error, setError] = useState("");
  const [selectedInterest, setSelectedInterest] = useState(interest || 'SPORT');
  const tabId = useId();
  const bodyRef = useRef(null);
  const edit = (path, value) => {
    if (!path.length) { setDraft(value); return; }
    const next = structuredClone(draft);
    setAt(next, path, value);
    setDraft(next);
  };
  const displayed = useMemo(() => personalizationDisplay(draft, tokens), [draft, tokens]);
  const groups = textGroups(displayed),
    answers = gradeItems(draft),
    { numbers, images } = settingFields(displayed);
  const missing = Object.entries(kind?.fields || {})
    .filter(([key, field]) => field.required && draft[key] == null)
    .map(([key]) => key);
  const switchTab = (next) => {
    if (tab === "json" && json !== null) {
      try {
        setDraft(JSON.parse(json));
        setJson(null);
        setError("");
      } catch (problem) {
        setError(vietnameseError(problem));
        return false;
      }
    }
    setTab(next);
    bodyRef.current?.scrollTo({ top: 0 });
    return true;
  };
  const save = () => {
    if (tab === "json" && json !== null) {
      try {
        return onSave(JSON.parse(json));
      } catch (problem) {
        return setError(vietnameseError(problem));
      }
    }
    onSave(draft);
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        layout="studio-minigame"
        className="studio-dialog studio-minigame-dialog"
        aria-describedby={undefined}
      >
        <header className="studio-mg-header">
        <span className="studio-mg-eyebrow">TRÌNH SOẠN MINI-GAME</span>
        <DialogTitle className="studio-dialog-title">
          Soạn mini-game “{draft.title || kind?.label || "Mini-game"}”
        </DialogTitle>
        <p className="studio-muted">
          Loại trò chơi: {kind?.label || draft.kind || "chưa chọn"}
          {kind
            ? kind.graded
              ? ". Có chấm điểm."
              : ". Luyện tập, không chấm điểm."
            : ""}{" "}
        </p>
        </header>
        <nav className="studio-mg-navigation" aria-label="Các phần soạn mini-game">
        {!!missing.length && (
          <p className="studio-error">
            Khuôn yêu cầu thêm: {missing.join(", ")}. Bổ sung ở Nâng cao (JSON).
          </p>
        )}
        <div className="studio-tabs" role="tablist" aria-label="Nội dung mini-game">
          {TABS.map(([key, label]) => (
            <button
              type="button"
              role="tab"
              key={key}
              id={`${tabId}-${key}`}
              aria-controls={`${tabId}-panel`}
              aria-selected={tab === key}
              tabIndex={tab === key ? 0 : -1}
              onClick={() => switchTab(key)}
              onKeyDown={(event) => {
                const index = TABS.findIndex(([value]) => value === key);
                const next = event.key === 'ArrowRight' ? (index + 1) % TABS.length
                  : event.key === 'ArrowLeft' ? (index + TABS.length - 1) % TABS.length
                  : event.key === 'Home' ? 0 : event.key === 'End' ? TABS.length - 1 : null;
                if (next === null) return;
                event.preventDefault();
                if (switchTab(TABS[next][0]))
                  document.getElementById(`${tabId}-${TABS[next][0]}`)?.focus();
              }}
            >
              {label}
              {key === "answers" && answers.length
                ? ` (${answers.length})`
                : ""}
            </button>
          ))}
        </div>
        </nav>
        <div className="studio-mg-body" ref={bodyRef} role="tabpanel" id={`${tabId}-panel`} aria-labelledby={`${tabId}-${tab}`} tabIndex={0}>
        <div className="studio-mg-intro">
          <h3>{TAB_HELP[tab][0]}</h3>
          <p>{TAB_HELP[tab][1]}</p>
        </div>

        {tab === "texts" && (
          <div className="studio-mg-groups">
            {!groups.length && (
              <p className="studio-muted">
                Mini-game này chưa có chữ tách riêng.
              </p>
            )}
            {groups.map((group, k) => (
              <details
                key={group.section}
                open={k === 0}
                className="studio-mg-group"
              >
                <summary>
                  {group.label} <small>{group.fields.length} chỗ</small>
                </summary>
                {group.fields.map((field) => (
                  <label
                    key={field.path.join(".")}
                    className="studio-block-field"
                  >
                    {field.label}
                    <textarea
                      rows={field.value.length > 90 ? 3 : 2}
                      value={getAt(displayed, field.path) ?? ""}
                      onChange={(event) => edit(field.path, event.target.value)}
                    />
                  </label>
                ))}
              </details>
            ))}
          </div>
        )}

        {tab === "answers" && (
          <div className="studio-mg-answers">
            {!answers.length && (
              <p className="studio-muted">
                {kind?.graded === false
                  ? "Mini-game luyện tập, không có đáp án để chấm."
                  : "Mini-game này chưa khai đáp án."}
              </p>
            )}
            {answers
              .filter((item) => item.simple)
              .map((item) => {
                const rule = getAt(draft, item.path).grade.rule;
                return (
                  <fieldset key={item.path.join(".")} className="studio-answer">
                    <legend>
                      {item.label}
                      {item.round != null
                        ? ` · vòng ${Number(item.round) + 1 || item.round}`
                        : ""}
                    </legend>
                    {item.numeric ? (
                      <input
                        type="number"
                        aria-label={`Đáp án của ${item.label}`}
                        value={rule.eq}
                        onChange={(event) => {
                          const next = structuredClone(draft);
                          setAnswer(next, item.path, {
                            eq: Number(event.target.value),
                          });
                          setDraft(next);
                        }}
                      />
                    ) : (
                      <div className="studio-answer-choices">
                        {item.choices.map((choice) => {
                          const on = item.multi
                            ? (rule.in || []).includes(choice.value)
                            : rule.eq === choice.value;
                          return (
                            <label
                              key={String(choice.value)}
                              className={on ? "is-on" : ""}
                            >
                              <input
                                type={item.multi ? "checkbox" : "radio"}
                                name={item.path.join(".")}
                                checked={on}
                                onChange={(event) => {
                                  const next = structuredClone(draft);
                                  if (!item.multi)
                                    setAnswer(next, item.path, {
                                      eq: choice.value,
                                    });
                                  else {
                                    const set = new Set(rule.in || []);
                                    if (event.target.checked)
                                      set.add(choice.value);
                                    else set.delete(choice.value);
                                    if (!set.size)
                                      return setError(
                                        "Mỗi câu cần ít nhất một đáp án đúng.",
                                      );
                                    setAnswer(next, item.path, {
                                      in: [...set],
                                    });
                                  }
                                  setError("");
                                  setDraft(next);
                                }}
                              />
                              {String(choice.label).slice(0, 60)}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </fieldset>
                );
              })}
            {answers.some((item) => !item.simple) && (
              <details className="studio-mg-group">
                <summary>
                  {answers.filter((item) => !item.simple).length} câu chấm theo
                  luật ghép (vị trí, tổng, nhiều điều kiện)
                </summary>
                <ul>
                  {answers
                    .filter((item) => !item.simple)
                    .map((item) => (
                      <li key={item.path.join(".")}>{item.label}</li>
                    ))}
                </ul>
                <p className="studio-muted">
                  Sửa ở Nâng cao (JSON), mục grade.rule của từng câu.
                </p>
              </details>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="studio-mg-settings">
            {numbers.map((field) => (
              <label key={field.path.join(".")} className="studio-row-field">
                {field.label}
                <input
                  type="number"
                  value={getAt(draft, field.path) ?? 0}
                  onChange={(event) =>
                    edit(field.path, Number(event.target.value))
                  }
                />
              </label>
            ))}
            {!!images.length && (
              <div className="studio-mg-images">
                {images.map((field) => (
                  <figure key={field.path.join(".")}>
                    <img src={getAt(displayed, field.path)} alt="" />
                    <figcaption>{field.label}</figcaption>
                    <button
                      type="button"
                      onClick={() =>
                        onPickImage((url) => edit(field.path, url))
                      }
                    >
                      <ImagePlus size={15} />
                      Đổi ảnh
                    </button>
                  </figure>
                ))}
              </div>
            )}
            {!numbers.length && !images.length && (
              <p className="studio-muted">
                Không có con số hay ảnh nào để chỉnh.
              </p>
            )}
          </div>
        )}

        {tab === "variants" && (
          <MinigamePersonalization
            interest={selectedInterest}
            onInterestChange={setSelectedInterest}
            draft={draft}
            tokens={tokens}
            onPickImage={onPickImage}
            onChange={(path, value) => edit(path, value)}
          />
        )}

        {tab === "json" && (
          <label className="studio-block-field">
            Toàn bộ dữ liệu mini-game
            <textarea
              className="studio-code"
              rows={18}
              spellCheck={false}
              value={json ?? JSON.stringify(draft, null, 2)}
              onChange={(event) => {
                setJson(event.target.value);
                setError("");
              }}
            />
          </label>
        )}
        </div>

        <footer className="studio-mg-footer">
        {error && (
          <p role="alert" className="studio-error">
            {error}
          </p>
        )}
        <div className="studio-dialog-actions">
          <span className="studio-mg-save-hint">Bấm <strong>Xong</strong> để áp dụng vào cảnh.<br />Sau đó bấm <strong>Lưu nháp</strong> để lưu chương.</span>
          <button type="button" onClick={onClose}>
            Thôi
          </button>
          <button type="button" className="is-primary" onClick={save}>
            Xong
          </button>
        </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
