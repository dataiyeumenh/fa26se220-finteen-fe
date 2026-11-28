import { conditionActionChoices, conditionActions, conditionSentence, OP_LABEL } from './storyOps'

/** Chọn theo hành động thực tế, giữ nguyên mã và ý nghĩa của điều kiện khi lưu. */
export default function ConditionFields({ condition, onChange, scenes, stats, questions, path = '1' }) {
  const actions = conditionActions(scenes)
  if (Array.isArray(condition.all) || Array.isArray(condition.any)) {
    const mode = Array.isArray(condition.all) ? 'all' : 'any'
    const list = condition[mode]
    const setList = next => onChange({ [mode]: next })
    return <div className="condition-fields">
      {list.length > 1 && <fieldset className="condition-combine" role="radiogroup" aria-label={`Cách kết hợp yêu cầu ${path}`}>
        <legend>Khi có nhiều yêu cầu</legend>
        {[['all', 'Trẻ cần đáp ứng tất cả yêu cầu'], ['any', 'Trẻ chỉ cần đáp ứng ít nhất một yêu cầu']].map(([key, text]) => <label key={key}><input type="radio" name={`condition-mode-${path}`} value={key} checked={mode === key} onChange={() => onChange({ [key]: list })} />{text}</label>)}
      </fieldset>}
      {list.map((leaf, i) => <div className="condition-requirement" key={i}>
        <div className="condition-requirement-head"><strong>{list.length > 1 ? `Yêu cầu ${i + 1}` : 'Trẻ cần làm gì?'}</strong>
          <button type="button" onClick={() => setList(list.filter((_, k) => k !== i))} aria-label={`Bỏ yêu cầu ${path}.${i + 1}`}>Bỏ yêu cầu</button>
        </div>
        <ConditionFields condition={leaf} onChange={next => setList(list.map((item, k) => k === i ? next : item))} scenes={scenes} stats={stats} questions={questions} path={`${path}.${i + 1}`} />
      </div>)}
      {!list.length && <p className="condition-empty">{mode === 'all' ? 'Không có yêu cầu: trẻ luôn được xem cảnh ở mục “Nếu có”.' : 'Không có yêu cầu nào để đáp ứng: trẻ luôn xem cảnh ở mục “Nếu không”.'}</p>}
      <button type="button" className="studio-link-button" onClick={() => setList([...list, { var: '', op: '==', value: '' }])}>+ Thêm yêu cầu</button>
    </div>
  }
  const name = String(condition.var || '')
  const kind = name.startsWith('flag:') || name.startsWith('inspected:') ? 'action' : name.startsWith('choice:') ? 'choice' : name
  const categories = [['action', 'Một việc trẻ đã làm'], ['choice', 'Câu trả lời trẻ đã chọn'], ['money', 'Số tiền trẻ đang có'], ['miniGameScore', 'Điểm trò chơi'], ...stats.map(s => [s.key, s.label])]
  const patch = next => onChange({ ...condition, ...next })
  const action = actions.find(item => item.var === name)
  const question = questions[name.slice(7)]
  const changeKind = next => {
    if (next === 'action') onChange({ var: actions[0]?.var || '', op: '==', value: true })
    else if (next === 'choice') {
      const group = Object.keys(questions)[0]
      onChange({ var: group ? `choice:${group}` : '', op: '==', value: questions[group]?.options[0]?.id ?? '' })
    } else onChange({ var: next, op: '>=', value: 0 })
  }
  return <div className="condition-fields">
    <label className="condition-field">Dựa vào
      <select aria-label={`Nội dung cần kiểm tra ${path}`} value={kind} onChange={e => changeKind(e.target.value)}>
        {categories.map(([key, text]) => <option key={key} value={key} disabled={(key === 'action' && !actions.length) || (key === 'choice' && !Object.keys(questions).length)}>{text}</option>)}
        {!categories.some(([key]) => key === kind) && <option value={kind}>{name ? 'Yêu cầu có sẵn trong nội dung' : 'Chọn nội dung cần kiểm tra'}</option>}
      </select>
    </label>
    {kind === 'action' && <>
      <label className="condition-field">Việc cần kiểm tra
        <select aria-label={`Việc cần kiểm tra ${path}`} value={name} onChange={e => patch({ var: e.target.value })}>
          {!action && <option value={name}>Việc chưa có mô tả trong chương</option>}
          {conditionActionChoices(actions, name).map(item => <option key={item.var} value={item.var}>{item.label} — {item.sources.length > 1 ? `được ghi nhận ở ${item.sources.length} cảnh` : item.location}</option>)}
        </select>
      </label>
      {action && <p className="condition-selected">{action.label} — {action.location}{action.sources.length > 1 ? ` và ${action.sources.length - 1} cảnh khác` : ''}</p>}
      <label className="condition-field">Cho trẻ đi tiếp khi
        <select aria-label={`Trẻ đã làm hay chưa ${path}`} value={String((condition.value !== false) !== (condition.op === '!='))} onChange={e => patch({ op: '==', value: e.target.value === 'true' })}>
          <option value="true">Trẻ đã làm việc này</option><option value="false">Trẻ chưa làm việc này</option>
        </select>
      </label>
      {action?.sources.length ? <details className="condition-source"><summary>Việc này được ghi nhận ở đâu?</summary><ul>{action.sources.map((s, i) => <li key={i}>{s.label} — {s.location}</li>)}</ul></details>
        : <><p className="condition-empty">Chưa tìm thấy hành động ghi nhận việc này. Hãy kiểm tra nội dung trước khi sử dụng.</p><details className="condition-source"><summary>Thông tin cho người quản lý nội dung</summary><code>{name}</code></details></>}
    </>}
    {kind === 'choice' && <>
      <label className="condition-field">Câu hỏi trước đó
        <select aria-label={`Câu hỏi ${path}`} value={name.slice(7)} onChange={e => onChange({ ...condition, var: `choice:${e.target.value}`, value: questions[e.target.value]?.options[0]?.id ?? '' })}>
          {!question && <option value={name.slice(7)}>Câu hỏi chưa được nối đến đây</option>}
          {Object.entries(questions).map(([key, item]) => <option key={key} value={key}>{item.scene.title || item.scene.text || 'Câu hỏi chưa có tên'}</option>)}
        </select>
      </label>
      <label className="condition-field">Câu trả lời
        <select aria-label={`Câu trả lời ${path}`} value={condition.value ?? ''} onChange={e => patch({ value: e.target.value })}>
          {!question?.options.some(o => o.id === condition.value) && <option value={condition.value ?? ''}>Chưa tìm thấy câu trả lời</option>}
          {(question?.options || []).map(o => <option key={o.id} value={o.id}>{o.text || o.label || 'Câu trả lời chưa có nội dung'}</option>)}
        </select>
      </label>
      <label className="condition-field">Cho trẻ đi tiếp khi
        <select aria-label={`Cách kiểm tra câu trả lời ${path}`} value={condition.op} onChange={e => patch({ op: e.target.value })}><option value="==">Trẻ đã chọn câu trả lời này</option><option value="!=">Trẻ không chọn câu trả lời này</option></select>
      </label>
    </>}
    {categories.some(([key]) => key === kind) && !['action', 'choice'].includes(kind) && <div className="condition-number">
      <label className="condition-field">Mức cần đạt<select aria-label={`Cách so sánh ${path}`} value={condition.op} onChange={e => patch({ op: e.target.value })}>{Object.entries(OP_LABEL).map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>
      <label className="condition-field">{kind === 'money' ? 'Số tiền (đồng)' : 'Số điểm'}<input aria-label={`Giá trị ${path}`} type="number" value={condition.value ?? ''} onChange={e => patch({ value: e.target.value === '' ? '' : Number(e.target.value) })} /></label>
    </div>}
    {name && !categories.some(([key]) => key === kind) && <p>{conditionSentence(condition, scenes)}. Yêu cầu này được giữ nguyên khi áp dụng.</p>}
  </div>
}
