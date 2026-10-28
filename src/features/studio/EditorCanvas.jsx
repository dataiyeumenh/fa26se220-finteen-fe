import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ImagePlus,
  Layers3,
  Lock,
  Mic,
  PanelRightClose,
  PanelRightOpen,
  Play,
  Plus,
  Redo2,
  Save,
  Trash2,
  Undo2,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { STATUS_LABEL } from "./studioClient";
import { Tag } from "./ui";
import SchemaFields from "./SchemaFields";
import ChoiceConditions from "./ChoiceConditions";
import StoryMap from "./StoryMap";
import { ChoicePanel, InspectPanel } from "./ScenePanels";
import { SceneThumb } from "./SceneDialogs";
import {
  TYPE_LABEL,
  branchSummary,
  conditionSentence,
  isLinear,
  nextKeyOf,
  sceneLabel,
  typeOf,
} from "./storyOps";
import "./editor-canvas.css";

function Thumbnail({ scene }) {
  return (
    <span
      className="scene-thumbnail-art"
      style={{
        backgroundImage: scene.background
          ? `url(${JSON.stringify(scene.background)})`
          : undefined,
      }}
    >
      {!scene.background && <Layers3 size={24} aria-hidden="true" />}
      <span className="scene-thumbnail-characters">
        {scene.characters
          ?.filter((character) => character.src)
          .map((character, index) => (
            <img key={index} src={character.src} alt="" />
          ))}
      </span>
    </span>
  );
}

/** Giọng đọc của một câu thoại: cách đọc (spokenText), nghe giọng đã có, tắt giọng. BE tự gắn / gỡ giọng khi lưu nháp. */
function VoiceFields({ scene, update }) {
  return (
    <div className="scene-voice-fields">
      <label>
        Cách đọc cho giọng <small>để trống thì đọc đúng lời thoại</small>
        <input
          value={scene.spokenText || ""}
          onChange={(event) =>
            update({ spokenText: event.target.value || undefined })
          }
          placeholder="Ví dụ: năm trăm nghìn đồng"
        />
      </label>
      <div className="scene-voice-row">
        {scene.voice === "off" ? (
          <small>Câu này không đọc</small>
        ) : scene.voiceUrl ? (
          <audio
            controls
            preload="none"
            src={scene.voiceUrl}
            aria-label="Nghe giọng đọc"
          />
        ) : (
          <small>Chưa có giọng đọc</small>
        )}
        <label className="scene-voice-off">
          <input
            type="checkbox"
            checked={scene.voice === "off"}
            onChange={(event) =>
              update({ voice: event.target.checked ? "off" : undefined })
            }
          />{" "}
          Tắt giọng câu này
        </label>
      </div>
    </div>
  );
}

const POSITIONS = [
  ["left", "Trái"],
  ["center", "Giữa"],
  ["right", "Phải"],
];

/** Khung cảnh sửa trực tiếp: bấm vào chữ để gõ, bấm nhân vật để đổi vị trí / nét mặt. Không hiện mã cảnh. */
function SceneStage({
  scene,
  scenes,
  sprites,
  write,
  update,
  onBackground,
  onAddCharacter,
  onOpenLock,
}) {
  const [picked, setPicked] = useState(null);
  const type = typeOf(scene);
  const speakers = [
    ...new Map(
      scenes
        .filter((item) => item.speaker)
        .map((item) => [item.speaker, item.speakerId]),
    ).entries(),
  ];
  const character = picked != null ? scene.characters?.[picked] : null;
  const setCharacter = (patch) =>
    update({
      characters: scene.characters.map((item, index) =>
        index === picked ? { ...item, ...patch } : item,
      ),
    });
  const textKey = type === "reflection" ? "prompt" : "text";
  return (
    <div
      className="stage-frame"
      style={{
        backgroundImage: scene.background
          ? `url(${JSON.stringify(scene.background)})`
          : undefined,
      }}
    >
      {!scene.background && type !== "conditional" && (
        <span className="stage-empty">Chưa có ảnh nền</span>
      )}
      {(scene.characters || []).map(
        (item, index) =>
          item.src &&
          (write ? (
            <button
              type="button"
              key={index}
              className={`stage-character pos-${String(item.position || "center").toLowerCase()}${picked === index ? " is-picked" : ""}`}
              aria-label={`Nhân vật ${item.id || index + 1}: đổi vị trí hoặc nét mặt`}
              onClick={() => setPicked(picked === index ? null : index)}
            >
              <img src={item.src} alt="" />
            </button>
          ) : (
            <img
              key={index}
              src={item.src}
              alt=""
              className={`stage-character pos-${String(item.position || "center").toLowerCase()}`}
            />
          )),
      )}
      {write && type !== "conditional" && (
        <div className="stage-tools">
          <button type="button" onClick={onBackground}>
            <ImagePlus size={16} />
            Đổi ảnh nền
          </button>
          <button type="button" onClick={onAddCharacter}>
            <UserPlus size={16} />
            Thêm nhân vật
          </button>
        </div>
      )}
      {character && (
        <div
          className="stage-popover"
          role="dialog"
          aria-label="Nhân vật trên cảnh"
        >
          <div className="stage-popover-head">
            <b>{character.id}</b>
            <button
              type="button"
              className="stage-icon"
              aria-label="Đóng"
              onClick={() => setPicked(null)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="stage-segment" role="group" aria-label="Vị trí">
            {POSITIONS.map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={
                  String(character.position).toLowerCase() === value
                }
                onClick={() => setCharacter({ position: value })}
              >
                {label}
              </button>
            ))}
          </div>
          {!!Object.keys(sprites?.[character.id] || {}).length && (
            <div className="stage-faces">
              {Object.entries(sprites[character.id]).map(([name, src]) => (
                <button
                  type="button"
                  key={name}
                  aria-pressed={src === character.src}
                  aria-label={`Nét mặt ${name}`}
                  onClick={() =>
                    setCharacter({
                      src,
                      expression: name.replace(/\.\w+$/, ""),
                    })
                  }
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className="stage-remove"
            onClick={() => {
              update({
                characters: scene.characters.filter(
                  (_, index) => index !== picked,
                ),
              });
              setPicked(null);
            }}
          >
            <Trash2 size={15} />
            Bỏ khỏi cảnh
          </button>
        </div>
      )}
      {type === "minigame" ? (
        <div className="stage-card">
          <b>{scene.game?.title || "Mini-game"}</b>
          <span>Trẻ chơi mini-game ở đây</span>
        </div>
      ) : type === "conditional" ? (
        <div className="stage-card">
          <b>Rẽ nhánh tự động</b>
          <span>
            Trẻ không thấy cảnh này. Game tự chọn đường theo điều kiện.
          </span>
        </div>
      ) : (
        <div className="stage-dialogue">
          {type !== "ending" &&
            (write ? (
              <select
                className="stage-speaker"
                aria-label="Người nói"
                value={scene.speaker || ""}
                onChange={(event) => {
                  const pair = speakers.find(
                    ([name]) => name === event.target.value,
                  );
                  update({
                    speaker: event.target.value || undefined,
                    speakerId: pair?.[1] || undefined,
                  });
                }}
              >
                <option value="">Người dẫn chuyện</option>
                {speakers.map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            ) : (
              scene.speaker && <b className="stage-speaker">{scene.speaker}</b>
            ))}
          {write ? (
            <textarea
              className="stage-text"
              aria-label={type === "choice" ? "Câu hỏi" : "Lời thoại"}
              value={scene[textKey] || ""}
              placeholder={type === "choice" ? "Gõ câu hỏi…" : "Gõ lời thoại…"}
              onChange={(event) => update({ [textKey]: event.target.value })}
            />
          ) : (
            <p className="stage-text">
              {scene[textKey] || scene.inspect?.dataText}
            </p>
          )}
          {type === "inspect" && scene.inspect && (
            <div className="stage-option">
              <span className="stage-option-mark">Nút</span>
              {write ? (
                <input
                  aria-label="Chữ trên nút bấm để xem"
                  value={scene.inspect.buttonText || ""}
                  onChange={(event) =>
                    update({
                      inspect: {
                        ...scene.inspect,
                        buttonText: event.target.value,
                      },
                    })
                  }
                />
              ) : (
                <span>{scene.inspect.buttonText}</span>
              )}
            </div>
          )}
          {type === "choice" &&
            (scene.options || []).map((option, index) => (
              <div className="stage-option" key={option.id || index}>
                <span className="stage-option-mark">{index + 1}</span>
                {write ? (
                  <input
                    aria-label={`Chữ lựa chọn ${index + 1}`}
                    value={option.text ?? option.label ?? ""}
                    placeholder="Gõ chữ của lựa chọn"
                    onChange={(event) =>
                      update({
                        options: scene.options.map((value, k) =>
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
                      })
                    }
                  />
                ) : (
                  <span>{option.text || option.label}</span>
                )}
                {option.condition && (
                  <button
                    type="button"
                    className="stage-icon"
                    aria-label={`Lựa chọn ${index + 1} đang khoá`}
                    onClick={() => onOpenLock(index)}
                  >
                    <Lock size={14} />
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

/** nút chọn cảnh đích: ảnh nhỏ + số + tên cảnh, không phải mã */
function TargetButton({ label, targetId, scenes, write, onOpen }) {
  const index = scenes.findIndex((scene) => scene.id === targetId),
    target = scenes[index];
  return (
    <div className="scene-target">
      <span>{label}</span>
      <button
        type="button"
        disabled={!write}
        onClick={onOpen}
        className={!target ? "is-missing" : ""}
      >
        {target ? (
          <>
            <SceneThumb scene={target} />
            <span>
              <b>Cảnh {index + 1}</b> {sceneLabel(target)}
            </span>
          </>
        ) : (
          <span>{targetId ? "Cảnh không còn, chọn lại" : "Chưa chọn"}</span>
        )}
      </button>
    </div>
  );
}

export default function EditorCanvas(props) {
  const {
    code,
    content,
    meta,
    scenes,
    scene,
    idx,
    setIdx,
    write,
    busy,
    dirty,
    json,
    setJson,
    toggleJson,
    save,
    update,
    schemaQuery,
    warnings = [],
    refreshError = "",
    conditionDrafts = {},
    editCondition,
    onSuggestVoice,
    history,
    notice,
    issues,
    onAdd,
    onDuplicate,
    onDelete,
    onPickBackground,
    onAddCharacter,
    onPlay,
    openDialog,
    onBranch,
    onLaneEnd,
    onPickImage,
  } = props;
  const trackRef = useRef(null);
  const [panel, setPanel] = useState(true);
  const [view, setView] = useState("frame"); // khung hình | bản đồ truyện
  const visualMode = json === null;
  const schema = schemaQuery.data;
  const stats = schema?.stats || [];
  const statLabels = Object.fromEntries(
    stats.map((stat) => [stat.key, stat.label]),
  );
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (event) => {
      // Keep browser zoom and native horizontal trackpad gestures intact.
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
        return;
      const scale =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? track.clientWidth
            : 1;
      const next = Math.max(
        0,
        Math.min(
          track.scrollWidth - track.clientWidth,
          track.scrollLeft + event.deltaY * scale,
        ),
      );
      if (next === track.scrollLeft) return;
      if (event.cancelable) event.preventDefault();
      track.scrollLeft = next;
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [visualMode]);
  useEffect(() => {
    const track = trackRef.current;
    const selected = track?.querySelector('[aria-pressed="true"]');
    if (!selected) return;
    const bounds = track.getBoundingClientRect();
    const item = selected.getBoundingClientRect();
    if (item.left < bounds.left)
      track.scrollLeft -= bounds.left - item.left + 18;
    else if (item.right > bounds.right)
      track.scrollLeft += item.right - bounds.right + 18;
  }, [idx, scenes.length, json]);
  const type = typeOf(scene);
  const issueScenes = new Set(issues.map((issue) => issue.index));
  const setOption = (index, patch) =>
    update({
      options: scene.options.map((value, k) =>
        k === index ? { ...value, ...patch } : value,
      ),
    });
  const pickTarget = (label, current, apply) =>
    openDialog({ kind: "target", title: label, currentId: current, apply });
  return (
    <section className="scene-editor" aria-label="Trình biên tập chương">
      <header className="scene-editor-toolbar">
        <div className="scene-editor-document">
          <h1>{content.title || code}</h1>
          <p>
            <Tag tone={meta?.status}>
              {STATUS_LABEL[meta?.status] || meta?.status}
            </Tag>
            <span>Bản nháp số {meta?.revision ?? 0}</span>
            <span className={`scene-save-state${dirty ? " dirty" : ""}`}>
              {dirty ? "Có thay đổi chưa lưu" : "Đã lưu"}
            </span>
          </p>
        </div>
        <div className="scene-editor-document-actions">
          {write && visualMode && (
            <>
              <button
                type="button"
                className="scene-icon-button"
                disabled={busy || !history.canUndo}
                onClick={history.undo}
                aria-label="Hoàn tác"
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button
                type="button"
                className="scene-icon-button"
                disabled={busy || !history.canRedo}
                onClick={history.redo}
                aria-label="Làm lại"
                title="Làm lại (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
            </>
          )}
          {visualMode && scene && (
            <button type="button" onClick={onPlay}>
              <Play size={16} />
              Chơi thử từ cảnh này
            </button>
          )}
          {write && onSuggestVoice && (
            <button
              type="button"
              className="scene-quiet"
              disabled={busy || dirty}
              title={
                dirty
                  ? "Lưu nháp trước để AI đọc bản mới nhất"
                  : "AI đề xuất cách đọc cho câu có số, ký hiệu, chữ viết tắt"
              }
              onClick={onSuggestVoice}
            >
              <Mic size={16} />
              Gợi ý cách đọc (AI)
            </button>
          )}
          <button
            type="button"
            className="scene-quiet"
            disabled={busy}
            onClick={toggleJson}
          >
            <Code2 size={16} />
            {json === null ? "JSON" : "Theo cảnh / Chơi thử"}
          </button>
          {write && (
            <button
              type="button"
              className="scene-primary"
              disabled={busy}
              onClick={save}
            >
              <Save size={16} />
              {busy ? "Đang lưu…" : "Lưu nháp"}
            </button>
          )}
        </div>
      </header>
      {meta?.status === "SUBMITTED" && (
        <p className="scene-editor-notice">
          Nháp đang chờ duyệt. Người biên tập cần rút nháp trước khi chỉnh sửa.
        </p>
      )}
      {meta?.status === "RELEASED" && write && (
        <p className="scene-editor-notice">
          Lưu thay đổi sẽ tạo bản nháp số {meta.revision + 1}. Bản trẻ đang chơi
          giữ nguyên tới khi phát hành bản mới.
        </p>
      )}
      {!write && (
        <p className="scene-editor-notice">
          Chỉ xem: bạn chọn cảnh và chơi thử được, không sửa được.
        </p>
      )}
      {notice && (
        <div className="scene-undo-bar" role="status">
          <span>{notice.text}</span>
          {notice.undo && (
            <button type="button" onClick={notice.undo}>
              <Undo2 size={15} />
              Hoàn tác
            </button>
          )}
        </div>
      )}
      {!!warnings.length && (
        <details open className="scene-draft-warnings" aria-live="polite">
          <summary>Cảnh báo cần kiểm tra ({warnings.length})</summary>
          <p>Bản nháp vẫn được lưu. Sửa các mục này trước khi gửi duyệt.</p>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </details>
      )}
      {refreshError && (
        <p role="alert" className="scene-editor-notice">
          Đã lưu nhưng chưa tải lại được thông tin nháp: {refreshError}
        </p>
      )}
      {visualMode && !!issues.length && (
        <details className="scene-issues">
          <summary>
            <AlertTriangle size={16} aria-hidden="true" />
            Cần sửa trước khi gửi duyệt ({issues.length}){" "}
            <small>Lưu nháp vẫn được.</small>
          </summary>
          <ul>
            {issues.slice(0, 40).map((issue, index) => (
              <li key={index}>
                <span>{issue.text}</span>
                <button type="button" onClick={() => setIdx(issue.index)}>
                  Tới chỗ sửa
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
      {json !== null ? (
        <div className="scene-json-editor">
          <div>
            <Code2 size={16} /> Nội dung JSON{" "}
            <small>Toàn bộ cấu trúc chương</small>
          </div>
          <textarea
            aria-label="JSON nội dung chương"
            readOnly={!write || busy}
            value={json}
            onChange={(event) => setJson(event.target.value)}
            spellCheck={false}
          />
        </div>
      ) : (
        <div
          className={`scene-editor-body${panel && view === "frame" ? "" : " is-wide"}`}
        >
          <div
            className={`scene-editor-workbench${view === "map" ? " is-map" : ""}${view === "frame" && (type === "choice" || (type === "inspect" && scene?.inspect)) ? " has-panel" : ""}`}
          >
            <div className="stage-well">
              <div className="scene-editor-canvas-heading">
                <div
                  className="scene-view-switch"
                  role="group"
                  aria-label="Cách xem"
                >
                  <button
                    type="button"
                    aria-pressed={view === "frame"}
                    onClick={() => setView("frame")}
                  >
                    Khung hình
                  </button>
                  <button
                    type="button"
                    aria-pressed={view === "map"}
                    onClick={() => setView("map")}
                  >
                    Bản đồ truyện
                  </button>
                </div>
                {view === "frame" && (
                  <div className="scene-nav">
                    <button
                      type="button"
                      aria-label="Cảnh trước"
                      disabled={idx === 0 || !scenes.length}
                      onClick={() => setIdx(idx - 1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span>
                      Cảnh {scenes.length ? idx + 1 : 0} / {scenes.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Cảnh sau"
                      disabled={idx >= scenes.length - 1}
                      onClick={() => setIdx(idx + 1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
                {view === "frame" && (
                  <button
                    type="button"
                    className="scene-panel-toggle"
                    onClick={() => setPanel(!panel)}
                    aria-expanded={panel}
                  >
                    {panel ? (
                      <PanelRightClose size={17} />
                    ) : (
                      <PanelRightOpen size={17} />
                    )}
                    {panel ? "Thu gọn bảng bên" : "Mở bảng bên"}
                  </button>
                )}
              </div>
              {view === "map" ? (
                <StoryMap
                  scenes={scenes}
                  currentIndex={idx}
                  write={write && !busy}
                  onOpen={(index) => {
                    setIdx(index);
                    setView("frame");
                  }}
                  onBranch={(...args) => {
                    onBranch(...args);
                    setView("frame");
                  }}
                  onLaneEnd={(index) => {
                    onLaneEnd(index);
                    setView("frame");
                  }}
                />
              ) : (
                <div className="scene-editor-canvas">
                  {scene ? (
                    <SceneStage
                      key={scene.id}
                      scene={scene}
                      scenes={scenes}
                      sprites={content.sprites}
                      write={write && !busy}
                      update={update}
                      onBackground={onPickBackground}
                      onAddCharacter={onAddCharacter}
                      onOpenLock={(index) =>
                        openDialog({ kind: "lock", index })
                      }
                    />
                  ) : (
                    <p className="scene-schema-status">
                      Chương chưa có cảnh nào. Bấm “Thêm cảnh” để bắt đầu.
                    </p>
                  )}
                </div>
              )}
            </div>
            {view === "frame" && scene && type === "choice" && (
              <ChoicePanel
                scene={scene}
                scenes={scenes}
                write={write && !busy}
                statLabels={statLabels}
                setOptions={(options) => update({ options })}
                openDialog={openDialog}
                pickTarget={pickTarget}
              />
            )}
            {view === "frame" &&
              scene &&
              type === "inspect" &&
              scene.inspect && (
                <InspectPanel
                  scene={scene}
                  write={write && !busy}
                  update={update}
                  onPickImage={onPickImage}
                />
              )}
          </div>
          {panel && view === "frame" && (
            <aside className="scene-inspector" aria-label="Thuộc tính cảnh">
              {scene ? (
                <>
                  <div className="scene-inspector-heading">
                    <h2>Cảnh {idx + 1}</h2>
                    <span>{TYPE_LABEL[type] || type}</span>
                    <code title="Mã cảnh, không đổi khi chèn hoặc xoá cảnh khác">
                      {scene.id}
                    </code>
                  </div>
                  <fieldset
                    disabled={!write || busy}
                    className="inspector-group"
                  >
                    <label>
                      Tiêu đề cảnh
                      <input
                        value={scene.title || ""}
                        onChange={(event) =>
                          update({ title: event.target.value })
                        }
                        placeholder="Tên ngắn để bạn dễ tìm"
                      />
                    </label>
                  </fieldset>
                  {type === "conditional" && (
                    <section
                      className="inspector-group"
                      aria-labelledby="group-cond"
                    >
                      <h3 id="group-cond">Điều kiện rẽ</h3>
                      <div className="scene-target">
                        <span>Game đi hướng “đúng” khi</span>
                        <button
                          type="button"
                          disabled={!write || busy}
                          onClick={() => openDialog({ kind: "condition" })}
                        >
                          {conditionSentence(
                            scene.condition,
                            scenes,
                            statLabels,
                          )}
                        </button>
                      </div>
                    </section>
                  )}
                  <section
                    className="inspector-group"
                    aria-labelledby="group-next"
                  >
                    <h3 id="group-next">Đi tiếp</h3>
                    {isLinear(scene) && (
                      <TargetButton
                        label="Sau cảnh này sang"
                        targetId={scene[nextKeyOf(scene)]}
                        scenes={scenes}
                        write={write && !busy}
                        onOpen={() =>
                          pickTarget(
                            "Sau cảnh này sang cảnh nào?",
                            scene[nextKeyOf(scene)],
                            (id) => update({ [nextKeyOf(scene)]: id }),
                          )
                        }
                      />
                    )}
                    {type === "choice" &&
                      (() => {
                        const summary = branchSummary(scenes, scene);
                        return (
                          <div className="branch-summary">
                            <p>
                              <b>{summary.options} lựa chọn</b> dẫn tới{" "}
                              <b>
                                {summary.targets}{" "}
                                {summary.targets === 1
                                  ? "đích"
                                  : "đích khác nhau"}
                              </b>
                              {summary.straight
                                ? `, ${summary.straight} lựa chọn đi thẳng về điểm nhập`
                                : ""}
                              .
                            </p>
                            <p>
                              {summary.join != null ? (
                                <>
                                  Các nhánh nhập lại ở{" "}
                                  <b>cảnh {summary.join + 1}</b>
                                  {scenes[summary.join]
                                    ? `: ${sceneLabel(scenes[summary.join])}`
                                    : ""}
                                  .
                                </>
                              ) : (
                                "Các nhánh không nhập lại (mỗi nhánh tự đi tới kết)."
                              )}
                            </p>
                            <button
                              type="button"
                              className="scene-text-button"
                              onClick={() => setView("map")}
                            >
                              Xem trên bản đồ truyện
                            </button>
                          </div>
                        );
                      })()}
                    {type === "conditional" && (
                      <>
                        <TargetButton
                          label="Nếu đúng thì sang"
                          targetId={scene.ifTrueSceneId}
                          scenes={scenes}
                          write={write && !busy}
                          onOpen={() =>
                            pickTarget(
                              "Nếu đúng thì sang cảnh nào?",
                              scene.ifTrueSceneId,
                              (id) => update({ ifTrueSceneId: id }),
                            )
                          }
                        />
                        <TargetButton
                          label="Nếu không thì sang"
                          targetId={scene.ifFalseSceneId}
                          scenes={scenes}
                          write={write && !busy}
                          onOpen={() =>
                            pickTarget(
                              "Nếu không thì sang cảnh nào?",
                              scene.ifFalseSceneId,
                              (id) => update({ ifFalseSceneId: id }),
                            )
                          }
                        />
                      </>
                    )}
                    {type === "ending" && (
                      <p className="scene-hint">
                        Hết chương. Game chọn kết theo kết quả chơi của trẻ.
                      </p>
                    )}
                  </section>
                  {type === "minigame" && (
                    <section
                      className="inspector-group"
                      aria-labelledby="group-game"
                    >
                      <h3 id="group-game">Mini-game</h3>
                      <p className="scene-hint">
                        {schema?.minigameKinds?.[scene.game?.kind]?.label ||
                          scene.game?.kind ||
                          "Chưa chọn loại"}
                        {schema?.minigameKinds?.[scene.game?.kind]
                          ? schema.minigameKinds[scene.game.kind].graded
                            ? ", có chấm điểm"
                            : ", luyện tập"
                          : ""}
                      </p>
                      <button
                        type="button"
                        className="inspector-wide"
                        onClick={() => openDialog({ kind: "minigame" })}
                      >
                        Soạn chữ, đáp án, con số
                      </button>
                    </section>
                  )}
                  {(scene.speaker || scene.speakerId) && scene.text && (
                    <section
                      className="inspector-group"
                      aria-labelledby="group-voice"
                    >
                      <h3 id="group-voice">Giọng đọc</h3>
                      <fieldset disabled={!write || busy}>
                        <VoiceFields scene={scene} update={update} />
                      </fieldset>
                    </section>
                  )}
                  {write && (
                    <div className="scene-inspector-actions inspector-group">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={onDuplicate}
                      >
                        <Copy size={15} />
                        Nhân đôi cảnh
                      </button>
                      <button
                        type="button"
                        className="scene-delete"
                        disabled={busy}
                        onClick={onDelete}
                      >
                        <Trash2 size={15} />
                        Xóa cảnh
                      </button>
                    </div>
                  )}
                  <details className="scene-advanced">
                    <summary>Nâng cao</summary>
                    <fieldset disabled={!write || busy}>
                      <label>
                        Người nói (tên hiển thị)
                        <input
                          value={scene.speaker || ""}
                          onChange={(event) =>
                            update({ speaker: event.target.value })
                          }
                          placeholder="Ví dụ: An"
                        />
                      </label>
                      <label>
                        Ảnh nền (đường dẫn)
                        <input
                          value={scene.background || ""}
                          onChange={(event) =>
                            update({ background: event.target.value })
                          }
                          placeholder="URL hoặc ref ảnh"
                        />
                      </label>
                      {type === "choice" &&
                        scene.options?.map((option, index) => (
                          <ChoiceConditions
                            key={`${scene.id}/${option.id || index}`}
                            option={option}
                            index={index}
                            raw={conditionDrafts[`${scene.id}/${index}`]}
                            onCondition={(raw) => editCondition(index, raw)}
                            onReason={(lockedReason) =>
                              setOption(index, { lockedReason })
                            }
                          />
                        ))}
                    </fieldset>
                    {schemaQuery.loading ? (
                      <p role="status" className="scene-schema-status">
                        Đang tải khuôn…
                      </p>
                    ) : schemaQuery.error ? (
                      <p role="alert">
                        {schemaQuery.error}{" "}
                        <button type="button" onClick={schemaQuery.reload}>
                          Tải lại khuôn
                        </button>
                      </p>
                    ) : (
                      <SchemaFields
                        schema={schema}
                        scene={scene}
                        update={update}
                        disabled={!write || busy}
                      />
                    )}
                  </details>
                </>
              ) : (
                <p className="scene-schema-status">
                  Thêm cảnh đầu tiên để bắt đầu biên tập.
                </p>
              )}
            </aside>
          )}
          <section
            className="scene-timeline"
            aria-label="Các cảnh trong chương"
          >
            <div className="scene-timeline-heading">
              <span>
                Các cảnh <b>{scenes.length}</b>
              </span>
              {write && (
                <button type="button" disabled={busy} onClick={onAdd}>
                  <Plus size={15} /> Thêm cảnh
                </button>
              )}
            </div>
            <div className="scene-timeline-track" ref={trackRef}>
              {scenes.map((item, index) => (
                <button
                  type="button"
                  className={`scene-thumbnail ${index === idx ? "selected" : ""}`}
                  key={item.id}
                  aria-label={`Cảnh ${index + 1}: ${item.title || item.id}`}
                  aria-pressed={index === idx}
                  onClick={() => setIdx(index)}
                >
                  <span className="scene-thumbnail-index">{index + 1}</span>
                  {issueScenes.has(index) && (
                    <span
                      className="scene-thumbnail-alert"
                      title="Cảnh này còn chỗ cần sửa"
                    />
                  )}
                  <Thumbnail scene={item} />
                  <span className="scene-thumbnail-label">
                    {sceneLabel(item)}
                  </span>
                </button>
              ))}
              {write && (
                <button
                  type="button"
                  className="scene-add-page"
                  disabled={busy}
                  onClick={onAdd}
                  aria-label="Thêm cảnh sau cảnh đang chọn"
                >
                  <Plus size={22} />
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
