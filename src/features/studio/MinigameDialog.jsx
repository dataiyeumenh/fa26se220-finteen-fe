// Soạn nội dung mini-game ở chế độ đơn giản: chữ theo vùng, đáp án tích chọn, con số và ảnh; JSON để ở Nâng cao.
// Làm trên BẢN SAO của game — chỉ ghi vào cảnh khi bấm Xong.
import { useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog'
import { getAt, gradeItems, setAnswer, setAt, settingFields, textGroups } from './minigameOps'

const TABS = [['texts', 'Chữ trên màn chơi'], ['answers', 'Đáp án'], ['settings', 'Con số và ảnh'], ['json', 'Nâng cao (JSON)']]

export default function MinigameDialog({ game, kind, onPickImage, onSave, onClose }) {
  const [draft, setDraft] = useState(() => structuredClone(game || {}))
  const [tab, setTab] = useState('texts')
  const [json, setJson] = useState(null)
  const [error, setError] = useState('')
  const edit = (path, value) => { const next = structuredClone(draft); setAt(next, path, value); setDraft(next) }
  const groups = textGroups(draft), answers = gradeItems(draft), { numbers, images } = settingFields(draft)
  const missing = Object.entries(kind?.fields || {}).filter(([key, field]) => field.required && draft[key] == null).map(([key]) => key)
  const switchTab = next => {
    if (tab === 'json' && json !== null) {
      try { setDraft(JSON.parse(json)); setJson(null); setError('') } catch (problem) { return setError(`JSON chưa đúng: ${problem.message}`) }
    }
    setTab(next)
  }
  const save = () => {
    if (tab === 'json' && json !== null) {
      try { return onSave(JSON.parse(json)) } catch (problem) { return setError(`JSON chưa đúng: ${problem.message}`) }
    }
    onSave(draft)
  }
  return <Dialog open onOpenChange={open => { if (!open) onClose() }}>
    <DialogContent className="studio-dialog max-w-4xl max-h-[88vh] overflow-auto sm:rounded-xl" aria-describedby={undefined}>
      <DialogTitle className="studio-dialog-title">Soạn mini-game “{draft.title || kind?.label || 'Mini-game'}”</DialogTitle>
      <p className="studio-muted">Loại trò chơi: {kind?.label || draft.kind || 'chưa chọn'}{kind ? (kind.graded ? '. Có chấm điểm.' : '. Luyện tập, không chấm điểm.') : ''} Thay đổi chỉ ghi vào cảnh khi bấm Xong.</p>
      {!!missing.length && <p className="studio-error">Khuôn yêu cầu thêm: {missing.join(', ')}. Bổ sung ở Nâng cao (JSON).</p>}
      <div className="studio-tabs" role="tablist">{TABS.map(([key, label]) => <button type="button" role="tab" key={key} aria-selected={tab === key} onClick={() => switchTab(key)}>{label}{key === 'answers' && answers.length ? ` (${answers.length})` : ''}</button>)}</div>

      {tab === 'texts' && <div className="studio-mg-groups">
        {!groups.length && <p className="studio-muted">Mini-game này chưa có chữ tách riêng.</p>}
        {groups.map((group, k) => <details key={group.section} open={k === 0} className="studio-mg-group"><summary>{group.label} <small>{group.fields.length} chỗ</small></summary>
          {group.fields.map(field => <label key={field.path.join('.')} className="studio-block-field">{field.label}
            <textarea rows={field.value.length > 90 ? 3 : 1} value={getAt(draft, field.path) ?? ''} onChange={event => edit(field.path, event.target.value)} /></label>)}
        </details>)}
      </div>}

      {tab === 'answers' && <div className="studio-mg-answers">
        {!answers.length && <p className="studio-muted">{kind?.graded === false ? 'Mini-game luyện tập, không có đáp án để chấm.' : 'Mini-game này chưa khai đáp án.'}</p>}
        {answers.filter(item => item.simple).map(item => {
          const rule = getAt(draft, item.path).grade.rule
          return <fieldset key={item.path.join('.')} className="studio-answer"><legend>{item.label}{item.round != null ? ` · vòng ${Number(item.round) + 1 || item.round}` : ''}</legend>
            {item.numeric ? <input type="number" aria-label={`Đáp án của ${item.label}`} value={rule.eq} onChange={event => { const next = structuredClone(draft); setAnswer(next, item.path, { eq: Number(event.target.value) }); setDraft(next) }} />
              : <div className="studio-answer-choices">{item.choices.map(choice => {
                const on = item.multi ? (rule.in || []).includes(choice.value) : rule.eq === choice.value
                return <label key={String(choice.value)} className={on ? 'is-on' : ''}><input type={item.multi ? 'checkbox' : 'radio'} name={item.path.join('.')} checked={on} onChange={event => {
                  const next = structuredClone(draft)
                  if (!item.multi) setAnswer(next, item.path, { eq: choice.value })
                  else {
                    const set = new Set(rule.in || []); if (event.target.checked) set.add(choice.value); else set.delete(choice.value)
                    if (!set.size) return setError('Mỗi câu cần ít nhất một đáp án đúng.')
                    setAnswer(next, item.path, { in: [...set] })
                  }
                  setError(''); setDraft(next)
                }} />{String(choice.label).slice(0, 60)}</label>
              })}</div>}
          </fieldset>
        })}
        {answers.some(item => !item.simple) && <details className="studio-mg-group"><summary>{answers.filter(item => !item.simple).length} câu chấm theo luật ghép (vị trí, tổng, nhiều điều kiện)</summary>
          <ul>{answers.filter(item => !item.simple).map(item => <li key={item.path.join('.')}>{item.label}</li>)}</ul><p className="studio-muted">Sửa ở Nâng cao (JSON), mục grade.rule của từng câu.</p></details>}
      </div>}

      {tab === 'settings' && <div className="studio-mg-settings">
        {numbers.map(field => <label key={field.path.join('.')} className="studio-row-field">{field.label}<input type="number" value={getAt(draft, field.path) ?? 0} onChange={event => edit(field.path, Number(event.target.value))} /></label>)}
        {!!images.length && <div className="studio-mg-images">{images.map(field => <figure key={field.path.join('.')}>
          <img src={getAt(draft, field.path)} alt="" /><figcaption>{field.label}</figcaption>
          <button type="button" onClick={() => onPickImage(url => edit(field.path, url))}><ImagePlus size={15} />Đổi ảnh</button></figure>)}</div>}
        {!numbers.length && !images.length && <p className="studio-muted">Không có con số hay ảnh nào để chỉnh.</p>}
      </div>}

      {tab === 'json' && <label className="studio-block-field">Toàn bộ dữ liệu mini-game
        <textarea className="studio-code" rows={18} spellCheck={false} value={json ?? JSON.stringify(draft, null, 2)} onChange={event => { setJson(event.target.value); setError('') }} /></label>}

      {error && <p role="alert" className="studio-error">{error}</p>}
      <div className="studio-dialog-actions"><span /><button type="button" onClick={onClose}>Thôi</button><button type="button" className="is-primary" onClick={save}>Xong</button></div>
    </DialogContent>
  </Dialog>
}
