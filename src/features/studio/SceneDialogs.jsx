// Hộp thoại của trình soạn: chọn cảnh bằng ảnh, thêm cảnh theo loại, ảnh hưởng, khoá / điều kiện, chơi thử.
// Ảnh hưởng và khoá làm trên BẢN SAO — chỉ ghi khi bấm Xong; đóng hộp thoại là không đổi gì.
import { useState } from 'react'
import { Clapperboard, Flag, Gamepad2, GitBranch, Lightbulb, ListChecks, MessageSquare, Plus, RotateCcw, Search, Split, SquareMousePointer, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog'
import { TYPE_LABEL, conditionSentence, evalCondition, isStructured, nextKeyOf, questionsOf, sceneLabel, typeOf, vnd, OP_LABEL } from './storyOps'

const TYPE_HELP = { dialogue: 'Một nhân vật nói một câu.', choice: 'Trẻ chọn một trong vài cách.', inspect: 'Trẻ bấm một vật để xem thông tin.', minigame: 'Một trò chơi nhỏ; chọn loại ở bước sau.', conditional: 'Game tự rẽ theo tiền, chỉ số hoặc lựa chọn trước đó. Trẻ không thấy cảnh này.', reflection: 'Trẻ tự trả lời để nghĩ lại.', summary: 'Tóm lại điều vừa học.', cutscene: 'Chữ dẫn chuyển cảnh.', ending: 'Kết thúc chương ở đây.' }
const TYPE_ICON = { dialogue: MessageSquare, choice: Split, inspect: SquareMousePointer, minigame: Gamepad2, conditional: GitBranch, reflection: Lightbulb, summary: ListChecks, cutscene: Clapperboard, ending: Flag }

function StudioDialog({ title, onClose, wide, children }) {
  return <Dialog open onOpenChange={open => { if (!open) onClose() }}>
    <DialogContent className={`studio-dialog ${wide ? 'max-w-4xl' : 'max-w-xl'} max-h-[88vh] overflow-auto sm:rounded-xl`} aria-describedby={undefined}>
      <DialogTitle className="studio-dialog-title">{title}</DialogTitle>
      {children}
    </DialogContent>
  </Dialog>
}

export function SceneThumb({ scene }) {
  return <span className="studio-thumb" style={{ backgroundImage: scene.background ? `url(${JSON.stringify(scene.background)})` : undefined }}>
    {scene.characters?.filter(character => character.src).slice(0, 2).map((character, index) => <img key={index} src={character.src} alt="" />)}
  </span>
}

/** chọn cảnh đích bằng ảnh nhỏ + tên, không bằng mã */
export function ScenePickerDialog({ title, scenes, currentId, onPick, onClose }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = scenes.map((scene, index) => ({ scene, index })).filter(({ scene }) => !q || `${scene.id} ${sceneLabel(scene)} ${scene.text || ''}`.toLowerCase().includes(q))
  return <StudioDialog title={title} onClose={onClose} wide>
    <label className="studio-search"><Search size={16} aria-hidden="true" /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm theo chữ hoặc mã cảnh" aria-label="Tìm cảnh" /></label>
    <div className="studio-pick-grid">{list.map(({ scene, index }) => <button type="button" key={scene.id} className={scene.id === currentId ? 'is-current' : ''} onClick={() => onPick(scene.id)}>
      <SceneThumb scene={scene} /><span><b>Cảnh {index + 1}</b> {sceneLabel(scene)}</span><small>{scene.id}</small>
    </button>)}</div>
    {!list.length && <p className="studio-muted">Không có cảnh nào khớp “{query}”.</p>}
  </StudioDialog>
}

/** thêm cảnh: loại lấy từ khuôn BE (sceneTypes); mini-game chọn loại ở bước 2 */
export function AddSceneDialog({ schema, linear, number, onAdd, onClose }) {
  const [gamePick, setGamePick] = useState(false)
  const types = Object.keys(schema?.sceneTypes || TYPE_LABEL)
  if (gamePick) return <StudioDialog title="Chọn loại mini-game" onClose={onClose} wide>
    <div className="studio-kind-grid">{Object.entries(schema?.minigameKinds || {}).map(([kind, value]) => <button type="button" key={kind} onClick={() => onAdd('minigame', kind)}>
      <Gamepad2 size={20} aria-hidden="true" /><b>{value.label}</b><small>{value.graded ? 'Có chấm điểm' : 'Luyện tập, không chấm điểm'}</small>
    </button>)}</div>
  </StudioDialog>
  return <StudioDialog title={linear ? `Thêm cảnh sau cảnh ${number}` : `Thêm cảnh trước cảnh ${number}`} onClose={onClose} wide>
    {!linear && <p className="studio-muted">Cảnh {number} là câu hỏi hoặc rẽ nhánh nên cảnh mới đứng ngay trước nó, không cắt nhánh nào.</p>}
    <div className="studio-kind-grid">{types.map(type => { const Icon = TYPE_ICON[type] || MessageSquare; return <button type="button" key={type} onClick={() => (type === 'minigame' ? setGamePick(true) : onAdd(type))}>
      <Icon size={20} aria-hidden="true" /><b>{TYPE_LABEL[type] || schema?.sceneTypes?.[type]?.label || type}</b><small>{TYPE_HELP[type] || ''}</small>
    </button> })}</div>
  </StudioDialog>
}

/** ảnh hưởng của một lựa chọn: đủ 5 chỉ số + mọi khoản tiền, ô số tự do */
export function EffectDialog({ option, stats, onSave, onClose }) {
  const [deltas, setDeltas] = useState({ ...(option.deltaStats || {}) })
  const [money, setMoney] = useState(structuredClone(option.moneyEvents || []))
  const save = () => {
    const cleanDeltas = Object.fromEntries(Object.entries(deltas).filter(([, value]) => Number(value)).map(([key, value]) => [key, Number(value)]))
    const cleanMoney = money.filter(event => Number(event.amount)).map(event => ({ ...event, amount: Number(event.amount) }))
    onSave({ deltaStats: Object.keys(cleanDeltas).length ? cleanDeltas : undefined, moneyEvents: cleanMoney.length ? cleanMoney : undefined })
  }
  return <StudioDialog title={`Chọn “${String(option.text || option.label || '').slice(0, 50)}” thì`} onClose={onClose}>
    <fieldset className="studio-form-grid"><legend>Chỉ số ẩn của trẻ (âm là giảm)</legend>
      {stats.map(stat => <label key={stat.key} className="studio-row-field">{stat.label}<input type="number" step="1" value={deltas[stat.key] ?? 0} onChange={event => setDeltas({ ...deltas, [stat.key]: event.target.value })} /></label>)}
    </fieldset>
    <fieldset className="studio-form-grid"><legend>Tiền của An (âm là tiêu, dương là nhận)</legend>
      {money.map((event, index) => <div key={index} className="studio-money-row">
        <input type="number" step="1000" aria-label={`Số tiền khoản ${index + 1}`} value={event.amount ?? 0} onChange={changeEvent => setMoney(money.map((item, k) => (k === index ? { ...item, amount: changeEvent.target.value } : item)))} /><span>đ</span>
        <input aria-label={`Ghi chú khoản ${index + 1}`} placeholder="Ghi chú, ví dụ: Thanh toán máy A" value={event.description || ''} onChange={changeEvent => setMoney(money.map((item, k) => (k === index ? { ...item, description: changeEvent.target.value } : item)))} />
        <button type="button" className="studio-icon-button" aria-label={`Bỏ khoản ${index + 1}`} onClick={() => setMoney(money.filter((_, k) => k !== index))}><Trash2 size={16} /></button>
      </div>)}
      {!money.length && <p className="studio-muted">Lựa chọn này không đổi tiền.</p>}
      <button type="button" className="studio-link-button" onClick={() => setMoney([...money, { eventId: `${option.id}_MONEY${money.length + 1}`, description: '', amount: 0 }])}><Plus size={16} />Thêm khoản tiền</button>
    </fieldset>
    <div className="studio-dialog-actions"><button type="button" onClick={onClose}>Thôi</button><button type="button" className="is-primary" onClick={save}>Xong</button></div>
  </StudioDialog>
}

const KINDS = [['money', 'Tiền của An'], ['miniGameScore', 'Điểm mini-game'], ['choice:', 'Câu hỏi đã chọn'], ['inspected:', 'Đã mở thẻ / vật'], ['flag:', 'Đã xảy ra việc']]
const kindOf = name => (String(name).includes(':') ? String(name).slice(0, String(name).indexOf(':') + 1) : name)

/** chỉ câu hỏi đứng TRƯỚC chỗ đặt điều kiện — câu phía sau không bao giờ "đã chọn" được */
function questionsBefore(scenes, contextId) {
  const all = questionsOf(scenes)
  if (!contextId) return all
  const back = {}
  for (const scene of scenes) for (const id of [scene.nextSceneId, scene.onPassSceneId, scene.ifTrueSceneId, scene.ifFalseSceneId, ...(scene.options || []).map(option => option.nextSceneId)].filter(Boolean)) (back[id] ||= []).push(scene.id)
  const seen = new Set(), queue = [...(back[contextId] || [])]
  while (queue.length) { const id = queue.pop(); if (seen.has(id)) continue; seen.add(id); queue.push(...(back[id] || [])) }
  return Object.fromEntries(Object.entries(all).filter(([, value]) => seen.has(value.scene.id) && value.scene.id !== contextId))
}

/** điều kiện bằng form (một tầng all / any); có câu nhắn khi dùng làm khoá */
export function ConditionDialog({ title, value, reason, withReason, scenes, stats, contextId, onSave, onRemove, onClose }) {
  const start = !value ? { all: [] } : value.var ? { all: [value] } : structuredClone(value)
  const [cond, setCond] = useState(start)
  const [message, setMessage] = useState(reason || '')
  const [error, setError] = useState('')
  const nested = value && !isStructured(value) || (start.all || start.any || []).some(item => item.all || item.any)
  const mode = cond.any ? 'any' : 'all', list = cond[mode] || []
  const questions = questionsBefore(scenes, contextId)
  const inspects = Object.fromEntries(scenes.filter(scene => scene.inspect?.id).map(scene => [scene.inspect.id, scene.inspect.buttonText || scene.inspect.id]))
  const flags = [...new Set(scenes.flatMap(scene => [...Object.keys(scene.setFlags || {}), ...(scene.options || []).flatMap(option => Object.keys(option.setFlags || {}))]))]
  const kinds = [...KINDS.slice(0, 2), ...stats.map(stat => [stat.key, stat.label]), ...KINDS.slice(2)]
  const setList = next => setCond({ [mode]: next })
  const setLeaf = (index, patch) => setList(list.map((leaf, k) => (k === index ? { ...leaf, ...patch } : leaf)))
  const changeKind = (index, kind) => {
    if (kind === 'choice:') { const group = Object.keys(questions)[0] || ''; setLeaf(index, { var: `choice:${group}`, op: '==', value: questions[group]?.options[0]?.id }) }
    else if (kind === 'inspected:') setLeaf(index, { var: `inspected:${Object.keys(inspects)[0] || ''}`, op: '==', value: true })
    else if (kind === 'flag:') setLeaf(index, { var: `flag:${flags[0] || ''}`, op: '==', value: true })
    else setLeaf(index, { var: kind, op: '>=', value: 0 })
  }
  const save = () => {
    if (!list.length) return onRemove()
    if (withReason && !message.trim()) return setError('Viết câu nhắn trẻ sẽ thấy khi lựa chọn còn khoá.')
    onSave(cond, message.trim())
  }
  if (nested) return <StudioDialog title={title} onClose={onClose}>
    <p>Điều kiện này: <b>{conditionSentence(value, scenes)}</b>.</p>
    <p className="studio-muted">Nó có nhiều tầng hoặc viết kiểu cũ, chỉ sửa được ở phần Nâng cao (JSON).</p>
    <div className="studio-dialog-actions"><button type="button" onClick={onClose}>Đóng</button></div>
  </StudioDialog>
  return <StudioDialog title={title} onClose={onClose} wide>
    <label className="studio-inline-field">Cần <select value={mode} onChange={event => setCond({ [event.target.value]: list })}><option value="all">tất cả các điều sau</option><option value="any">chỉ một trong các điều sau</option></select></label>
    <ul className="studio-cond-list">{list.map((leaf, index) => {
      const kind = kindOf(leaf.var), name = String(leaf.var).slice(kind.length), known = kinds.some(([key]) => key === kind)
      return <li key={index}>
        {known ? <select aria-label={`Loại điều kiện ${index + 1}`} value={kind} onChange={event => changeKind(index, event.target.value)}>{kinds.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select> : <span>{conditionSentence(leaf, scenes)} (biến chưa có trong khuôn)</span>}
        {kind === 'choice:' && <>
          <select aria-label="Câu hỏi" value={name} onChange={event => setLeaf(index, { var: `choice:${event.target.value}`, value: questions[event.target.value]?.options[0]?.id })}>{Object.entries(questions).map(([group, item]) => <option key={group} value={group}>{String(item.scene.text || item.scene.title || group).slice(0, 50)}</option>)}{name && !questions[name] && <option value={name}>Câu đứng sau chỗ này — không bao giờ đúng</option>}</select>
          <select aria-label="Đã chọn hay không" value={leaf.op === '!=' ? '!=' : '=='} onChange={event => setLeaf(index, { op: event.target.value })}><option value="==">đã chọn</option><option value="!=">không chọn</option></select>
          <select aria-label="Lựa chọn" value={leaf.value ?? ''} onChange={event => setLeaf(index, { value: event.target.value })}>{(questions[name]?.options || []).map(option => <option key={option.id} value={option.id}>{String(option.text || option.label || option.id).slice(0, 50)}</option>)}</select>
        </>}
        {(kind === 'inspected:' || kind === 'flag:') && <>
          <select aria-label={kind === 'flag:' ? 'Việc' : 'Thẻ'} value={name} onChange={event => setLeaf(index, { var: kind + event.target.value })}>{(kind === 'flag:' ? flags.map(flag => [flag, flag.replace(/_/g, ' ')]) : Object.entries(inspects)).concat(name && !(kind === 'flag:' ? flags.includes(name) : inspects[name]) ? [[name, name]] : []).map(([key, label]) => <option key={key} value={key}>{String(label).slice(0, 50)}</option>)}</select>
          <select aria-label="Trạng thái" value={String((leaf.value !== false) !== (leaf.op === '!='))} onChange={event => setLeaf(index, { op: '==', value: event.target.value === 'true' })}><option value="true">{kind === 'flag:' ? 'đã xảy ra' : 'đã mở'}</option><option value="false">{kind === 'flag:' ? 'chưa xảy ra' : 'chưa mở'}</option></select>
        </>}
        {known && !['choice:', 'inspected:', 'flag:'].includes(kind) && <>
          <select aria-label="Phép so sánh" value={leaf.op} onChange={event => setLeaf(index, { op: event.target.value })}>{Object.entries(OP_LABEL).map(([op, label]) => <option key={op} value={op}>{label}</option>)}</select>
          <input aria-label="Giá trị" type="number" value={leaf.value ?? 0} onChange={event => setLeaf(index, { value: Number(event.target.value) })} />{kind === 'money' && <span>đ</span>}
        </>}
        <button type="button" className="studio-icon-button" aria-label={`Bỏ điều kiện ${index + 1}`} onClick={() => setList(list.filter((_, k) => k !== index))}><Trash2 size={16} /></button>
      </li>
    })}</ul>
    {!list.length && <p className="studio-muted">Chưa có điều kiện nào. {withReason ? 'Bấm Xong lúc này là bỏ khoá.' : ''}</p>}
    <button type="button" className="studio-link-button" onClick={() => setList([...list, { var: 'money', op: '>=', value: 0 }])}><Plus size={16} />Thêm điều kiện</button>
    {withReason && <label className="studio-block-field">Câu nhắn trẻ thấy khi lựa chọn còn khoá<textarea rows={2} value={message} onChange={event => { setMessage(event.target.value); setError('') }} placeholder="Ví dụ: Chưa đủ tiền — xem lại kế hoạch trước khi mua." /></label>}
    {error && <p role="alert" className="studio-error">{error}</p>}
    <div className="studio-dialog-actions">{value && <button type="button" className="is-danger" onClick={onRemove}>{withReason ? 'Bỏ khoá' : 'Bỏ điều kiện'}</button>}<span /><button type="button" onClick={onClose}>Thôi</button><button type="button" className="is-primary" onClick={save}>Xong</button></div>
  </StudioDialog>
}

/* ---------- chơi thử từ cảnh đang xem: tiền, chỉ số, khoá, rẽ nhánh, báo ra kết ---------- */
function freshState(content, stats) {
  return { money: content.initialMoney ?? 0, score: 0, stats: Object.fromEntries(stats.map(stat => [stat.key, content.initialStats?.[stat.key] ?? stat.initial ?? 50])), flags: {}, choices: {}, inspected: {} }
}
const applyFlags = (state, flags) => { if (Array.isArray(flags)) flags.forEach(flag => { state.flags[flag] = true }); else Object.entries(flags || {}).forEach(([key, value]) => { state.flags[key] = !!value }) }

export function PlayDialog({ content, startIndex, stats, onEdit, onClose }) {
  const scenes = content.scenes || []
  const [run, setRun] = useState(() => ({ index: startIndex, state: freshState(content, stats), steps: 0, changed: '', opened: null }))
  const scene = scenes[run.index]
  const statLabels = Object.fromEntries(stats.map(stat => [stat.key, stat.label]))
  const goTo = (id, mutate, changed = '') => {
    const index = scenes.findIndex(item => item.id === id)
    const state = structuredClone(run.state)
    mutate?.(state)
    if (index < 0) return setRun({ ...run, state, dead: id ? 'dẫn tới một cảnh không còn' : 'chưa chọn đi tiếp tới cảnh nào' })
    applyFlags(state, scenes[index].setFlags)
    setRun({ index, state, steps: run.steps + 1, changed, opened: null })
  }
  const restart = () => setRun({ index: startIndex, state: freshState(content, stats), steps: 0, changed: '', opened: null })
  const type = typeOf(scene)
  let controls = null, note = null
  if (run.dead) note = <p role="alert" className="studio-error">Hết đường: cảnh {run.index + 1} {run.dead}.</p>
  else if (type === 'choice') controls = (scene.options || []).map(option => {
    const open = evalCondition(option.condition, run.state)
    return <div key={option.id} className="studio-play-option">
      <button type="button" disabled={open === false} onClick={() => goTo(option.nextSceneId, state => {
        Object.entries(option.deltaStats || {}).forEach(([key, value]) => { if (key in state.stats) state.stats[key] = Math.max(0, Math.min(100, state.stats[key] + value)) })
        ;(option.moneyEvents || []).forEach(event => { state.money += Number(event.amount) || 0 })
        applyFlags(state, option.setFlags); state.choices[scene.choiceGroup || scene.id] = option.id
      }, [...Object.entries(option.deltaStats || {}).map(([key, value]) => `${statLabels[key] || key} ${value > 0 ? '+' : ''}${value}`), ...(option.moneyEvents || []).map(event => `Tiền ${event.amount > 0 ? '+' : ''}${vnd(event.amount)}`)].join(', '))}>{option.text || option.label}</button>
      {open === false && <small>Đang khoá: {option.lockedReason || 'chưa đủ điều kiện'}</small>}
    </div>
  })
  else if (type === 'conditional') {
    const result = evalCondition(scene.condition, run.state)
    note = <p className="studio-muted">Rẽ tự động khi {conditionSentence(scene.condition, scenes, statLabels)}: {result === undefined ? 'không tính được, chọn giả sử' : result ? 'đúng' : 'sai'}.</p>
    controls = result === undefined ? <><button type="button" onClick={() => goTo(scene.ifTrueSceneId)}>Giả sử đúng</button><button type="button" onClick={() => goTo(scene.ifFalseSceneId)}>Giả sử sai</button></>
      : <button type="button" className="is-primary" onClick={() => goTo(result ? scene.ifTrueSceneId : scene.ifFalseSceneId)}>Tiếp</button>
  } else if (type === 'minigame') controls = <form onSubmit={event => { event.preventDefault(); const score = Number(new FormData(event.currentTarget).get('score')) || 0; goTo(scene.nextSceneId || scene.onPassSceneId, state => { state.score = score; applyFlags(state, scene.game?.onComplete?.setFlags) }, `Điểm mini-game ${score}`) }}>
    <label className="studio-inline-field">Giả lập điểm mini-game <input name="score" type="number" defaultValue={scene.game?.passScore ?? 5} /></label><button type="submit" className="is-primary">Chơi xong</button>
  </form>
  else if (type === 'ending') {
    const rules = content.endingRules || {}, endings = rules.endings || []
    const ordered = (rules.priorityOrder || []).map(id => endings.find(ending => ending.id === id)).filter(Boolean)
    let hit = null; const unknown = []
    for (const ending of ordered.length ? ordered : endings) { const result = evalCondition(ending.condition, run.state); if (result === undefined) unknown.push(ending.title); else if (result) { hit = ending; break } }
    note = hit && !unknown.length ? <div className="studio-play-ending"><b>Ra kết: {hit.title}</b><p>{hit.storyText}</p></div>
      : <p className="studio-muted">{hit ? `Bỏ qua các kết chưa tính được thì ra: ${hit.title}. ` : 'Chưa xác định được kết. '}{unknown.length ? `Chưa tính được điều kiện của: ${unknown.join(', ')} (điều kiện kiểu cũ hoặc biến chưa có trong khuôn).` : ''}</p>
  } else {
    if (type === 'inspect' && scene.inspect) controls = <button type="button" onClick={() => setRun({ ...run, opened: scene.inspect, state: { ...run.state, inspected: { ...run.state.inspected, [scene.inspect.id]: true } } })}>{scene.inspect.buttonText || 'Bấm để xem'}</button>
    controls = <>{controls}<button type="button" className="is-primary" onClick={() => goTo(scene[nextKeyOf(scene)])}>Tiếp</button></>
  }
  return <StudioDialog title={`Chơi thử từ cảnh ${startIndex + 1}`} onClose={onClose} wide>
    <div className="studio-hud" aria-live="polite"><span>Tiền <b>{vnd(run.state.money)}</b></span>{stats.map(stat => <span key={stat.key}>{stat.label} <b>{run.state.stats[stat.key]}</b></span>)}<span>Điểm mini-game <b>{run.state.score}</b></span></div>
    {run.changed && <p className="studio-play-change">Vừa thay đổi: {run.changed}</p>}
    <div className="studio-play-stage" style={{ backgroundImage: scene?.background ? `url(${JSON.stringify(scene.background)})` : undefined }}>
      {(scene?.characters || []).map((character, index) => character.src && <img key={index} src={character.src} alt="" className={`pos-${String(character.position || 'center').toLowerCase()}`} />)}
      {scene && type !== 'conditional' && <div className="studio-play-text">{scene.speaker && <b>{scene.speaker}</b>}<p>{scene.text || scene.prompt || ''}</p>{run.opened && <p className="studio-play-opened">{run.opened.dataText}</p>}</div>}
    </div>
    {note}
    {controls && <div className="studio-play-controls">{controls}</div>}
    <div className="studio-dialog-actions"><span className="studio-muted">Đang ở cảnh {run.index + 1}, đã đi {run.steps} cảnh</span><span />
      <button type="button" onClick={restart}><RotateCcw size={16} />Chơi lại</button>
      <button type="button" onClick={() => onEdit(run.index)}>Sửa cảnh này</button></div>
  </StudioDialog>
}

/** thêm nhân vật: chọn từ dàn nhân vật của chương (sprites); nhân vật mới thì lấy ảnh từ kho */
export function CharacterDialog({ sprites, present, onPick, onLibrary, onClose }) {
  const cast = Object.entries(sprites || {}).filter(([, faces]) => Object.keys(faces || {}).length)
  return <StudioDialog title="Thêm nhân vật vào cảnh" onClose={onClose} wide>
    <div className="studio-cast-grid">{cast.map(([id, faces]) => { const [name, src] = Object.entries(faces)[0]; const here = present.includes(id); return <button type="button" key={id} disabled={here} onClick={() => onPick(id, src, name.replace(/\.\w+$/, ''))}>
      <img src={src} alt="" /><b>{id}</b>{here && <small>Đã có trong cảnh</small>}
    </button> })}</div>
    {!cast.length && <p className="studio-muted">Chương chưa khai dàn nhân vật. Chọn ảnh nhân vật từ kho ảnh.</p>}
    <div className="studio-dialog-actions"><button type="button" onClick={onLibrary}>Chọn ảnh từ kho</button></div>
  </StudioDialog>
}
