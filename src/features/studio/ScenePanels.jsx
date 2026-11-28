// Vùng nội dung dưới khung cảnh: các lựa chọn của câu hỏi (mỗi lựa chọn một khối có thứ bậc rõ),
// và nội dung hiện ra khi trẻ bấm xem (cảnh "Bấm để xem"). Thao tác nặng (đích, ảnh hưởng, khoá) mở hộp làm trên bản sao.
import { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Copy,
  ChevronDown,
  FileSearch,
  GripVertical,
  ImagePlus,
  Lock,
  LockOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { SceneThumb } from "./SceneDialogs";
import { conditionSentence, isStructured, sceneLabel, vnd } from "./storyOps";
import { INSPECT_CONTENT_GROUPS, INSPECT_CONTENT_LABELS, patchChoiceText, patchInspect } from './variantOps.js';

function optionProblems(option, scenes) {
  const out = [];
  if (!String(option.text || option.label || "").trim())
    out.push("Chưa có chữ cho lựa chọn");
  if (!option.nextSceneId) out.push("Chưa chọn bấm xong thì sang cảnh nào");
  else if (!scenes.some((scene) => scene.id === option.nextSceneId))
    out.push("Cảnh đích không còn, chọn lại");
  if (
    isStructured(option.condition) &&
    !String(option.lockedReason || "").trim()
  )
    out.push("Có khoá nhưng chưa có câu nhắn cho trẻ");
  return out;
}

function EffectBadges({ option, statLabels }) {
  const stats = Object.entries(option.deltaStats || {}),
    money = option.moneyEvents || [];
  if (!stats.length && !money.length)
    return <span className="choice-none">Không đổi gì</span>;
  return (
    <span className="choice-badges">
      {stats.map(([key, value]) => (
        <span key={key} className="choice-badge">
          {value > 0 ? "+" : "−"}
          {Math.abs(value)} {statLabels[key] || key}
        </span>
      ))}
      {money.map((event, index) => (
        <span
          key={index}
          className="choice-badge is-money"
          title={event.description || undefined}
        >
          {event.amount > 0 ? "+" : "−"}
          {vnd(Math.abs(event.amount))}
        </span>
      ))}
    </span>
  );
}

export function ChoicePanel({
  scene,
  scenes,
  write,
  statLabels,
  setOptions,
  openDialog,
  pickTarget,
  previewScene,
  onOptionText,
  scopeLabel,
}) {
  const [drag, setDrag] = useState(null);
  const options = scene.options || [];
  const move = (from, to) => {
    if (to < 0 || to >= options.length || from === to) return;
    const next = [...options];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setOptions(next);
  };
  const duplicate = (index) => {
    const copy = structuredClone(options[index]);
    copy.id = `${scene.id}_OPT${options.length + 1}_${Date.now().toString(36)}`;
    const next = [...options];
    next.splice(index + 1, 0, copy);
    setOptions(next);
  };
  const add = () =>
    setOptions([
      ...options,
      {
        id: `${scene.id}_OPT${options.length + 1}_${Date.now().toString(36)}`,
        text: "",
        nextSceneId: options[0]?.nextSceneId ?? null,
      },
    ]);
  return (
    <section className="content-panel" aria-labelledby="choice-panel-title">
      <header className="content-panel-head">
        <h2 id="choice-panel-title">
          Các lựa chọn <span>{options.length}</span>
        </h2>
        {write && (
          <button type="button" onClick={add}>
            <Plus size={16} />
            Thêm lựa chọn
          </button>
        )}
      </header>
      {scopeLabel && <p className="choice-personalization-hint">{scopeLabel} · Chữ lựa chọn được chỉnh riêng cho nhãn này. Số lựa chọn, thứ tự, cảnh đích, điểm và điều kiện dùng chung cho mọi bản.</p>}
      <ol className="choice-list">
        {options.map((option, index) => {
          const shown = previewScene?.options?.[index] || option;
          const problems = optionProblems(shown, scenes);
          const target = scenes.find((item) => item.id === option.nextSceneId),
            targetIndex = scenes.indexOf(target);
          return (
            <li
              key={option.id || index}
              className={`choice-card${problems.length ? " has-problem" : ""}${drag === index ? " is-dragging" : ""}`}
              draggable={write}
              onDragStart={(event) => {
                setDrag(index);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/x-choice", String(index));
              }}
              onDragEnd={() => setDrag(null)}
              onDragOver={(event) => {
                if (event.dataTransfer.types.includes("text/x-choice"))
                  event.preventDefault();
              }}
              onDrop={(event) => {
                const from = event.dataTransfer.getData("text/x-choice");
                if (from === "") return;
                event.preventDefault();
                move(Number(from), index);
                setDrag(null);
              }}
            >
              <div className="choice-top">
                {write && (
                  <span
                    className="choice-grip"
                    title="Kéo để đổi thứ tự"
                    aria-hidden="true"
                  >
                    <GripVertical size={18} />
                  </span>
                )}
                <span className="choice-number">{index + 1}</span>
                {write ? (
                  <textarea
                    className="choice-text"
                    rows={1}
                    aria-label={`Chữ lựa chọn ${index + 1} (khung bên)`}
                    value={shown.text ?? shown.label ?? ""}
                    placeholder="Chữ trẻ bấm chọn"
                    onChange={(event) =>
                      onOptionText ? onOptionText(index, event.target.value) : setOptions(
                        options.map((value, k) =>
                          k === index
                            ? patchChoiceText(value, event.target.value)
                            : value,
                        ),
                      )
                    }
                  />
                ) : (
                  <p className="choice-text">{shown.text || shown.label}</p>
                )}
                {write && (
                  <span className="choice-tools">
                    <button
                      type="button"
                      aria-label={`Đưa lựa chọn ${index + 1} lên`}
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Đưa lựa chọn ${index + 1} xuống`}
                      disabled={index === options.length - 1}
                      onClick={() => move(index, index + 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Nhân đôi lựa chọn ${index + 1}`}
                      onClick={() => duplicate(index)}
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      type="button"
                      className="is-danger"
                      aria-label={`Bỏ lựa chọn ${index + 1}`}
                      onClick={() =>
                        setOptions(options.filter((_, k) => k !== index))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </span>
                )}
              </div>
              {!!problems.length && (
                <p className="choice-problem" role="note">
                  <AlertCircle size={16} aria-hidden="true" />
                  {problems.join(" · ")}
                </p>
              )}
              <dl className="choice-facts">
                <div>
                  <dt>Bấm xong thì sang</dt>
                  <dd>
                    <button
                      type="button"
                      className={`choice-target${target ? "" : " is-missing"}`}
                      disabled={!write}
                      onClick={() =>
                        pickTarget(
                          `Bấm “${String(shown.text || shown.label || "").slice(0, 40)}” xong thì sang cảnh nào?`,
                          option.nextSceneId,
                          (id) =>
                            setOptions(
                              options.map((value, k) =>
                                k === index
                                  ? { ...value, nextSceneId: id }
                                  : value,
                              ),
                            ),
                        )
                      }
                    >
                      {target ? (
                        <>
                          <SceneThumb scene={target} />
                          <span>
                            <b>Cảnh {targetIndex + 1}</b> {sceneLabel(target)}
                          </span>
                        </>
                      ) : (
                        <span>
                          {option.nextSceneId
                            ? "Cảnh không còn, chọn lại"
                            : "Chọn cảnh"}
                        </span>
                      )}
                    </button>
                  </dd>
                </div>
                <div>
                  <dt>Ảnh hưởng</dt>
                  <dd className="choice-inline">
                    <EffectBadges option={option} statLabels={statLabels} />
                    {write && (
                      <button
                        type="button"
                        className="choice-link"
                        onClick={() => openDialog({ kind: "effect", index })}
                      >
                        Sửa
                      </button>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Khoá</dt>
                  <dd className="choice-inline">
                    {option.condition ? (
                      <span className="choice-lock">
                        <Lock size={15} aria-hidden="true" />
                        <span>
                          <b>
                            Mở khi{" "}
                            {conditionSentence(
                              option.condition,
                              scenes,
                              statLabels,
                            )}
                          </b>
                          {option.lockedReason && (
                            <small>Trẻ thấy: “{option.lockedReason}”</small>
                          )}
                        </span>
                      </span>
                    ) : (
                      <span className="choice-none">
                        <LockOpen size={15} aria-hidden="true" />
                        Luôn bấm được
                      </span>
                    )}
                    {write && (
                      <button
                        type="button"
                        className="choice-link"
                        onClick={() => openDialog({ kind: "lock", index })}
                      >
                        {option.condition ? "Sửa" : "Thêm khoá"}
                      </button>
                    )}
                  </dd>
                </div>
              </dl>
              {option.id && <code className="choice-id">{option.id}</code>}
            </li>
          );
        })}
      </ol>
      {!options.length && (
        <p className="choice-none">Câu hỏi chưa có lựa chọn nào.</p>
      )}
    </section>
  );
}

function InspectContentFields({ value, onChange, write, onPickImage, personalized }) {
  if (typeof value === 'string') return <label className="inspect-text">
    Nội dung
    <textarea aria-label="Nội dung" rows={2} disabled={!write || personalized} value={value} onChange={event => onChange(event.target.value)} />
    {personalized && <small>Nội dung dùng chung. Chuyển sang Bản gốc để sửa dòng này.</small>}
  </label>;
  if (Array.isArray(value)) return <div className="inspect-content-list">{value.map((item, index) => <details key={index} className="inspect-content-item" open={index === 0}>
    <summary>
      <span className="inspect-item-number">{index + 1}</span>
      {(item?.src || item?.image) && <img className="inspect-item-thumbnail" src={item.src || item.image} alt="" />}
      <span className="inspect-item-heading"><strong>{item?.caption || item?.label || item?.title || (Array.isArray(item) ? item[0] : null) || 'Nội dung'}</strong><small>{item?.description || item?.text || 'Bấm để chỉnh nội dung'}</small></span>
      <ChevronDown size={17} className="inspect-item-chevron" aria-hidden="true" />
    </summary>
    <InspectContentFields value={item} personalized={personalized} write={write} onPickImage={onPickImage}
      onChange={patch => { const partial = []; partial[index] = patch; onChange(partial); }} />
  </details>)}</div>;
  if (!value || typeof value !== 'object') return null;
  const mediaKeys = ['src', 'image', 'popupImage'].filter(key => typeof value[key] === 'string');
  const textKeys = Object.keys(INSPECT_CONTENT_LABELS).filter(key => !mediaKeys.includes(key) && typeof value[key] === 'string');
  return <div className={`inspect-content-fields ${mediaKeys.length ? 'has-media' : ''}`}>
    {!!mediaKeys.length && <div className="inspect-content-media">{mediaKeys.map(key => <figure className="inspect-image" key={key}>
          {value[key] ? <img src={value[key]} alt={value.caption || value.label || 'Ảnh khi mở thông tin'} /> : <span>Chưa có ảnh</span>}
          <button type="button" disabled={!write} onClick={() => onPickImage(url => onChange({ [key]: url }))}><ImagePlus size={16} /> {value[key] ? 'Đổi ảnh' : 'Chọn ảnh'}</button>
        </figure>)}</div>}
    {!!textKeys.length && <div className="inspect-content-copy">{textKeys.map(key => <label className="inspect-text" key={key}>{INSPECT_CONTENT_LABELS[key]}
          <textarea aria-label={INSPECT_CONTENT_LABELS[key]} rows={key === 'text' || key === 'description' || key === 'message' ? 3 : 2} disabled={!write} value={value[key]} onChange={event => onChange({ [key]: event.target.value })} />
        </label>)}</div>}
    {Object.entries(INSPECT_CONTENT_GROUPS).filter(([key]) => key !== 'popupImages' && value[key] != null).map(([key, label]) => <section className="inspect-content-group" key={key} aria-label={label}>
      <h3>{label}</h3>
      <InspectContentFields value={value[key]} personalized={personalized} write={write} onPickImage={onPickImage} onChange={patch => onChange({ [key]: patch })} />
    </section>)}
  </div>;
}

/** Nội dung mở ra từ inspect được gắn vào mọi loại cảnh, kể cả lời thoại và câu hỏi. */
export function InspectPanel({ scene, write, update, onPickImage, onChange, scopeLabel }) {
  const inspect = scene.inspect || {};
  const image = inspect.popupImage;
  const set = (patch) => onChange ? onChange(patch) : update({ inspect: patchInspect(inspect, patch) });
  return (
    <section className="content-panel inspect-panel" aria-labelledby="inspect-panel-title">
      <header className="content-panel-head">
        <span className="inspect-panel-icon" aria-hidden="true"><FileSearch size={22} /></span>
        <div>
        <span className="inspect-panel-eyebrow">NỘI DUNG MỞ RA KHI BẤM</span>
        <h2 id="inspect-panel-title">
          Khi trẻ bấm “{inspect.buttonText || "Bấm để xem"}” sẽ thấy
        </h2>
        <p>Sửa chữ trên nút, thông tin và ảnh trẻ sẽ thấy trong cửa sổ mở ra.</p>
        </div>
      </header>
      {scopeLabel && <p className="inspect-personalization-hint">{scopeLabel} · Ảnh, chữ trên nút và nội dung hiện ra được chỉnh riêng cho nhãn này.</p>}
      <div className="inspect-overview">
      <label className="inspect-text inspect-trigger-field">Chữ trên nút mở thông tin
        <input aria-label="Tên nút mở thông tin" disabled={!write} value={inspect.buttonText || ''} onChange={event => set({ buttonText: event.target.value })} />
        <small>Đây là nút nằm dưới lời thoại trong khung cảnh.</small>
      </label>
      <div className={`inspect-body ${image || (!inspect.popupImages?.length && !inspect.cards?.length) ? 'has-image' : ''}`}>
        {(image || (!inspect.popupImages?.length && !inspect.cards?.length)) && <figure className="inspect-image">
          {image ? <img src={image} alt="" /> : <span>Chưa có ảnh</span>}
          {write && (
            <button
              type="button"
              onClick={() =>
                onPickImage((url) =>
                  set({ popupImage: url }),
                )
              }
            >
              <ImagePlus size={16} />
              {image ? "Đổi ảnh" : "Chọn ảnh"}
            </button>
          )}
        </figure>}
        <label className="inspect-text">
          Chữ hiện ra
          <textarea
            aria-label="Nội dung khi bấm xem"
            rows={3}
            disabled={!write}
            value={inspect.dataText || ""}
            placeholder="Thông tin trẻ đọc khi bấm xem"
            onChange={(event) => set({ dataText: event.target.value })}
          />
        </label>
      </div>
      </div>
      {!!inspect.popupImages?.length && <section className="inspect-content-group" aria-label="Các ảnh khi mở">
        <h3>Các ảnh khi mở ({inspect.popupImages.length})</h3>
        <InspectContentFields value={inspect.popupImages} write={write} personalized={!!scopeLabel} onPickImage={onPickImage} onChange={popupImages => set({ popupImages })} />
      </section>}
      <InspectContentFields value={Object.fromEntries(Object.entries(inspect).filter(([key]) => !['buttonText', 'dataText', 'popupImage', 'popupImages'].includes(key)))}
        write={write} personalized={!!scopeLabel} onPickImage={onPickImage} onChange={set} />
    </section>
  );
}
