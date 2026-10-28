// Vùng nội dung dưới khung cảnh: các lựa chọn của câu hỏi (mỗi lựa chọn một khối có thứ bậc rõ),
// và nội dung hiện ra khi trẻ bấm xem (cảnh "Bấm để xem"). Thao tác nặng (đích, ảnh hưởng, khoá) mở hộp làm trên bản sao.
import { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  ImagePlus,
  Lock,
  LockOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { SceneThumb } from "./SceneDialogs";
import { conditionSentence, isStructured, sceneLabel, vnd } from "./storyOps";

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
      <ol className="choice-list">
        {options.map((option, index) => {
          const problems = optionProblems(option, scenes);
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
                    value={option.text ?? option.label ?? ""}
                    placeholder="Chữ trẻ bấm chọn"
                    onChange={(event) =>
                      setOptions(
                        options.map((value, k) =>
                          k === index
                            ? {
                                ...value,
                                text: event.target.value,
                                ...(value.label !== undefined
                                  ? { label: event.target.value }
                                  : {}),
                              }
                            : value,
                        ),
                      )
                    }
                  />
                ) : (
                  <p className="choice-text">{option.text || option.label}</p>
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
                          `Bấm “${String(option.text || "").slice(0, 40)}” xong thì sang cảnh nào?`,
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

/** cảnh Bấm để xem: chữ và ảnh hiện ra khi trẻ bấm nút — trước đây không sửa được ở chế độ đơn giản */
export function InspectPanel({ scene, write, update, onPickImage }) {
  const inspect = scene.inspect || {};
  const image = inspect.popupImage || inspect.popupImages?.[0]?.src;
  const set = (patch) => update({ inspect: { ...inspect, ...patch } });
  return (
    <section className="content-panel" aria-labelledby="inspect-panel-title">
      <header className="content-panel-head">
        <h2 id="inspect-panel-title">
          Khi trẻ bấm “{inspect.buttonText || "Bấm để xem"}” sẽ thấy
        </h2>
      </header>
      <div className="inspect-body">
        <figure className="inspect-image">
          {image ? <img src={image} alt="" /> : <span>Chưa có ảnh</span>}
          {write && (
            <button
              type="button"
              onClick={() =>
                onPickImage((url) =>
                  inspect.popupImages?.length && !inspect.popupImage
                    ? set({
                        popupImages: [
                          { ...inspect.popupImages[0], src: url },
                          ...inspect.popupImages.slice(1),
                        ],
                      })
                    : set({ popupImage: url }),
                )
              }
            >
              <ImagePlus size={16} />
              {image ? "Đổi ảnh" : "Chọn ảnh"}
            </button>
          )}
        </figure>
        <label className="inspect-text">
          Chữ hiện ra
          <textarea
            rows={4}
            disabled={!write}
            value={inspect.dataText || ""}
            placeholder="Thông tin trẻ đọc khi bấm xem"
            onChange={(event) => set({ dataText: event.target.value })}
          />
        </label>
      </div>
    </section>
  );
}
