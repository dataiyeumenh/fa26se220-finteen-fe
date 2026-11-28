// Hộp thoại của trình soạn: chọn cảnh bằng ảnh, thêm cảnh theo loại, ảnh hưởng, khoá / điều kiện, chơi thử.
// Ảnh hưởng và khoá làm trên BẢN SAO — chỉ ghi khi bấm Xong; đóng hộp thoại là không đổi gì.
import { useState } from "react";
import ConditionFields from "./ConditionFields";
import {
  Clapperboard,
  Flag,
  Gamepad2,
  GitBranch,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Plus,
  Search,
  Split,
  SquareMousePointer,
  Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import {
  TYPE_LABEL,
  conditionSentence,
  conditionOutcomeLabels,
  isStructured,
  questionsOf,
  sceneLabel,
  typeOf,
} from "./storyOps";

const TYPE_HELP = {
  dialogue: "Một nhân vật nói một câu.",
  choice: "Trẻ chọn một trong vài cách.",
  inspect: "Trẻ bấm một vật để xem thông tin.",
  minigame: "Một trò chơi nhỏ; chọn loại ở bước sau.",
  conditional:
    "Game tự rẽ theo tiền, chỉ số hoặc lựa chọn trước đó. Trẻ không thấy cảnh này.",
  reflection: "Trẻ tự trả lời để nghĩ lại.",
  summary: "Tóm lại điều vừa học.",
  cutscene: "Chữ dẫn chuyển cảnh.",
  ending: "Kết thúc chương ở đây.",
};
const TYPE_ICON = {
  dialogue: MessageSquare,
  choice: Split,
  inspect: SquareMousePointer,
  minigame: Gamepad2,
  conditional: GitBranch,
  reflection: Lightbulb,
  summary: ListChecks,
  cutscene: Clapperboard,
  ending: Flag,
};

function StudioDialog({ title, onClose, wide, play, children }) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        layout={play ? "studio-play" : "popup"}
        className={`studio-dialog ${play ? "studio-play-dialog" : wide ? "max-w-4xl" : "max-w-xl"} max-h-[88vh] overflow-auto sm:rounded-xl`}
        aria-describedby={undefined}
      >
        <DialogTitle className="studio-dialog-title">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function SceneThumb({ scene }) {
  return (
    <span
      className="studio-thumb"
      style={{
        backgroundImage: scene.background
          ? `url(${JSON.stringify(scene.background)})`
          : undefined,
      }}
    >
      {scene.characters
        ?.filter((character) => character.src)
        .slice(0, 2)
        .map((character, index) => (
          <img key={index} src={character.src} alt="" />
        ))}
    </span>
  );
}

/** chọn cảnh đích bằng ảnh nhỏ + tên, không bằng mã */
export function ScenePickerDialog({
  title,
  scenes,
  currentId,
  onPick,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = scenes
    .map((scene, index) => ({ scene, index }))
    .filter(
      ({ scene }) =>
        !q ||
        `${scene.id} ${sceneLabel(scene)} ${scene.text || ""}`
          .toLowerCase()
          .includes(q),
    );
  return (
    <StudioDialog title={title} onClose={onClose} wide>
      <label className="studio-search">
        <Search size={16} aria-hidden="true" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm theo tên hoặc nội dung cảnh"
          aria-label="Tìm cảnh"
        />
      </label>
      <div className="studio-pick-grid">
        {list.map(({ scene, index }) => (
          <button
            type="button"
            key={scene.id}
            className={scene.id === currentId ? "is-current" : ""}
            onClick={() => onPick(scene.id)}
          >
            <SceneThumb scene={scene} />
            <span>
              <b>Cảnh {index + 1}</b> {sceneLabel(scene)}
            </span>
            <small>{TYPE_LABEL[typeOf(scene)] || 'Cảnh trong câu chuyện'}</small>
          </button>
        ))}
      </div>
      {!list.length && (
        <p className="studio-muted">Không có cảnh nào khớp “{query}”.</p>
      )}
    </StudioDialog>
  );
}

/** thêm cảnh: loại lấy từ khuôn BE (sceneTypes); mini-game chọn loại ở bước 2 */
export function AddSceneDialog({ schema, position, scenes, onAdd, onClose }) {
  const [gamePick, setGamePick] = useState(false);
  const types = Object.keys(schema?.sceneTypes || TYPE_LABEL);
  if (gamePick)
    return (
      <StudioDialog title="Chọn loại mini-game" onClose={onClose} wide>
        <div className="studio-kind-grid">
          {Object.entries(schema?.minigameKinds || {}).map(([kind, value]) => (
            <button
              type="button"
              key={kind}
              onClick={() => onAdd("minigame", kind)}
            >
              <Gamepad2 size={20} aria-hidden="true" />
              <b>{value.label}</b>
              <small>
                {value.graded ? "Có chấm điểm" : "Luyện tập, không chấm điểm"}
              </small>
            </button>
          ))}
        </div>
      </StudioDialog>
    );
  return (
    <StudioDialog
      title={
        !scenes.length ? 'Thêm cảnh đầu tiên'
          : position === scenes.length ? 'Thêm cảnh vào cuối chương'
          : position === 0 ? 'Thêm cảnh vào đầu chương'
          : `Thêm cảnh giữa cảnh ${position} và ${position + 1}`
      }
      onClose={onClose}
      wide
    >
      {scenes[position - 1]?.type === 'ending' && (
        <p className="studio-muted">
          Cảnh mới nằm sau cảnh Kết chương. Để trẻ chơi tới đây, hãy chỉnh đường đi trong Bản đồ truyện hoặc chuyển cảnh Kết chương xuống cuối.
        </p>
      )}
      <div className="studio-kind-grid">
        {types.map((type) => {
          const Icon = TYPE_ICON[type] || MessageSquare;
          return (
            <button
              type="button"
              key={type}
              onClick={() =>
                type === "minigame" ? setGamePick(true) : onAdd(type)
              }
            >
              <Icon size={20} aria-hidden="true" />
              <b>
                {TYPE_LABEL[type] || schema?.sceneTypes?.[type]?.label || type}
              </b>
              <small>{TYPE_HELP[type] || ""}</small>
            </button>
          );
        })}
      </div>
    </StudioDialog>
  );
}

/** ảnh hưởng của một lựa chọn: đủ 5 chỉ số + mọi khoản tiền, ô số tự do */
export function EffectDialog({ option, stats, onSave, onClose }) {
  const [deltas, setDeltas] = useState({ ...(option.deltaStats || {}) });
  const [money, setMoney] = useState(structuredClone(option.moneyEvents || []));
  const save = () => {
    const cleanDeltas = Object.fromEntries(
      Object.entries(deltas)
        .filter(([, value]) => Number(value))
        .map(([key, value]) => [key, Number(value)]),
    );
    const cleanMoney = money
      .filter((event) => Number(event.amount))
      .map((event) => ({ ...event, amount: Number(event.amount) }));
    onSave({
      deltaStats: Object.keys(cleanDeltas).length ? cleanDeltas : undefined,
      moneyEvents: cleanMoney.length ? cleanMoney : undefined,
    });
  };
  return (
    <StudioDialog
      title={`Chọn “${String(option.text || option.label || "").slice(0, 50)}” thì`}
      onClose={onClose}
    >
      <fieldset className="studio-form-grid">
        <legend>Chỉ số ẩn của trẻ (âm là giảm)</legend>
        {stats.map((stat) => (
          <label key={stat.key} className="studio-row-field">
            {stat.label}
            <input
              type="number"
              step="1"
              value={deltas[stat.key] ?? 0}
              onChange={(event) =>
                setDeltas({ ...deltas, [stat.key]: event.target.value })
              }
            />
          </label>
        ))}
      </fieldset>
      <fieldset className="studio-form-grid">
        <legend>Tiền của An (âm là tiêu, dương là nhận)</legend>
        {money.map((event, index) => (
          <div key={index} className="studio-money-row">
            <input
              type="number"
              step="1000"
              aria-label={`Số tiền khoản ${index + 1}`}
              value={event.amount ?? 0}
              onChange={(changeEvent) =>
                setMoney(
                  money.map((item, k) =>
                    k === index
                      ? { ...item, amount: changeEvent.target.value }
                      : item,
                  ),
                )
              }
            />
            <span>đ</span>
            <input
              aria-label={`Ghi chú khoản ${index + 1}`}
              placeholder="Ghi chú, ví dụ: Thanh toán máy A"
              value={event.description || ""}
              onChange={(changeEvent) =>
                setMoney(
                  money.map((item, k) =>
                    k === index
                      ? { ...item, description: changeEvent.target.value }
                      : item,
                  ),
                )
              }
            />
            <button
              type="button"
              className="studio-icon-button"
              aria-label={`Bỏ khoản ${index + 1}`}
              onClick={() => setMoney(money.filter((_, k) => k !== index))}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {!money.length && (
          <p className="studio-muted">Lựa chọn này không đổi tiền.</p>
        )}
        <button
          type="button"
          className="studio-link-button"
          onClick={() =>
            setMoney([
              ...money,
              {
                eventId: `${option.id}_MONEY${money.length + 1}`,
                description: "",
                amount: 0,
              },
            ])
          }
        >
          <Plus size={16} />
          Thêm khoản tiền
        </button>
      </fieldset>
      <div className="studio-dialog-actions">
        <button type="button" onClick={onClose}>
          Thôi
        </button>
        <button type="button" className="is-primary" onClick={save}>
          Xong
        </button>
      </div>
    </StudioDialog>
  );
}

function questionsBefore(scenes, contextId) {
  const all = questionsOf(scenes);
  if (!contextId) return all;
  const back = {};
  for (const scene of scenes)
    for (const id of [
      scene.nextSceneId,
      scene.onPassSceneId,
      scene.ifTrueSceneId,
      scene.ifFalseSceneId,
      ...(scene.options || []).map((option) => option.nextSceneId),
    ].filter(Boolean))
      (back[id] ||= []).push(scene.id);
  const seen = new Set(),
    queue = [...(back[contextId] || [])];
  while (queue.length) {
    const id = queue.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    queue.push(...(back[id] || []));
  }
  return Object.fromEntries(
    Object.entries(all).filter(
      ([, value]) => seen.has(value.scene.id) && value.scene.id !== contextId,
    ),
  );
}

/** Soạn yêu cầu theo hành động; giữ các nhóm lồng nhau khi chỉnh sửa. */
export function ConditionDialog({ title, value, reason, withReason, scenes, stats = [], contextId, outcomes, onSave, onRemove, onClose }) {
  const [cond, setCond] = useState(() => !value ? { all: [] } : value.var ? { all: [structuredClone(value)] } : structuredClone(value));
  const [message, setMessage] = useState(reason || "");
  const [error, setError] = useState("");
  const questions = questionsBefore(scenes, contextId);
  const legacy = value && !isStructured(value);
  const empty = !cond.var && !(cond.all || cond.any || []).length;
  const sentence = conditionSentence(cond, scenes, Object.fromEntries(stats.map(s => [s.key, s.label])));
  const outcomeLabels = conditionOutcomeLabels(cond);
  const valid = c => {
    if (Array.isArray(c.all) || Array.isArray(c.any)) return (c.all || c.any).every(valid);
    return typeof c.var === 'string' && c.var.length > 0 && c.value !== '' && c.value !== undefined
      && (!['money', 'miniGameScore', ...stats.map(s => s.key)].includes(c.var) || (typeof c.value === 'number' && Number.isFinite(c.value)));
  };
  const save = () => {
    if (!valid(cond)) return setError('Hãy chọn đầy đủ việc cần kiểm tra, câu trả lời hoặc số điểm.');
    if (empty && withReason && cond.all) return onRemove();
    if (withReason && !message.trim()) return setError('Viết lời nhắn giải thích cho trẻ khi chưa được chọn câu trả lời này.');
    onSave(cond, message.trim());
  };
  return <StudioDialog title={withReason ? title : 'Khi nào cho trẻ xem cảnh tiếp theo?'} onClose={onClose} wide>
    {legacy ? <>
      <p>Yêu cầu này đang dùng cách thiết lập cũ. Bạn có thể xem và sửa trong phần Nâng cao của chương.</p>
      <div className="studio-dialog-actions"><button type="button" onClick={onClose}>Đóng</button></div>
    </> : <>
      <p className="condition-intro">{withReason ? 'Chọn việc trẻ cần làm trước khi được chọn câu trả lời này.' : 'Chọn một việc trong câu chuyện. Trò chơi sẽ nhớ trẻ đã làm việc đó hay chưa để chọn cảnh tiếp theo.'}</p>
      <ConditionFields condition={cond} onChange={next => { setCond(next); setError(''); }} scenes={scenes} stats={stats} questions={questions} />
      <div className="condition-preview" aria-live="polite">
        <strong>{withReason ? 'Trẻ được chọn khi' : 'Câu chuyện sẽ diễn ra như sau'}</strong>
        <p>{!valid(cond) ? 'Chọn đầy đủ yêu cầu để xem trước câu chuyện.' : empty ? (cond.any ? 'Không có yêu cầu nào có thể đáp ứng.' : 'Không cần làm gì trước.') : sentence}</p>
        {outcomes && valid(cond) && <ul><li><b>{outcomeLabels.yes}:</b> {outcomes.yes}</li><li><b>{outcomeLabels.no}:</b> {outcomes.no}</li></ul>}
      </div>
      {withReason && <label className="condition-field">Lời nhắn khi trẻ chưa được chọn<textarea rows={2} value={message} onChange={e => { setMessage(e.target.value); setError(''); }} placeholder="Ví dụ: Hãy xem bảng công việc trước khi chọn nhé." /></label>}
      {error && <p role="alert" className="studio-error">{error}</p>}
      <div className="studio-dialog-actions">
        {value && <button type="button" className="is-danger" onClick={withReason ? onRemove : () => { setCond({ all: [] }); setError(''); }}>{withReason ? 'Bỏ giới hạn lựa chọn' : 'Không cần yêu cầu trước'}</button>}
        <span />
        <button type="button" onClick={onClose}>Hủy</button>
        <button type="button" className="is-primary" onClick={save}>Áp dụng</button>
      </div>
    </>}
  </StudioDialog>;
}

export { default as PlayDialog } from './GamePreview'

export function CharacterDialog({
  sprites,
  present,
  onPick,
  onLibrary,
  onClose,
}) {
  const cast = Object.entries(sprites || {}).filter(
    ([, faces]) => Object.keys(faces || {}).length,
  );
  return (
    <StudioDialog title="Thêm nhân vật vào cảnh" onClose={onClose} wide>
      <div className="studio-cast-grid">
        {cast.map(([id, faces]) => {
          const [name, src] = Object.entries(faces)[0];
          const here = present.includes(id);
          return (
            <button
              type="button"
              key={id}
              disabled={here}
              onClick={() => onPick(id, src, name.replace(/\.\w+$/, ""))}
            >
              <img src={src} alt="" />
              <b>{id}</b>
              {here && <small>Đã có trong cảnh</small>}
            </button>
          );
        })}
      </div>
      {!cast.length && (
        <p className="studio-muted">
          Chương chưa khai dàn nhân vật. Chọn ảnh nhân vật từ kho ảnh.
        </p>
      )}
      <div className="studio-dialog-actions">
        <button type="button" onClick={onLibrary}>
          Chọn ảnh từ kho
        </button>
      </div>
    </StudioDialog>
  );
}
