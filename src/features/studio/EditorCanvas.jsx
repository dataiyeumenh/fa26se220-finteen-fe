import { ChevronLeft, ChevronRight, Code2, Copy, ImagePlus, Layers3, MessageSquare, Mic, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { STATUS_LABEL } from './studioClient'
import { Tag } from './ui'
import SchemaFields from './SchemaFields'
import ChoiceConditions from './ChoiceConditions'
import './editor-canvas.css'

const types = { scene: 'Mở cảnh', dialogue: 'Hội thoại', choice: 'Lựa chọn', minigame: 'Minigame', ending: 'Kết thúc', inspect: 'Khám phá' }

function Thumbnail({ scene }) {
  return <span className="scene-thumbnail-art" style={{ backgroundImage: scene.background ? `url(${JSON.stringify(scene.background)})` : undefined }}>
    {!scene.background && <Layers3 size={24} aria-hidden="true" />}
    <span className="scene-thumbnail-characters">{scene.characters?.filter(character => character.src).map((character, index) => <img key={index} src={character.src} alt="" />)}</span>
    {(scene.text || scene.title) && <span className="scene-thumbnail-dialogue">{scene.text || scene.title}</span>}
  </span>
}

/** Giọng đọc của một câu thoại: cách đọc (spokenText), nghe giọng đã có, tắt giọng. BE tự gắn / gỡ giọng khi lưu nháp. */
function VoiceFields({ scene, update }) {
  return <div className="scene-voice-fields">
    <label>Cách đọc cho giọng <small>để trống = đọc đúng lời thoại</small>
      <input value={scene.spokenText || ''} onChange={event => update({ spokenText: event.target.value || undefined })} placeholder="Ví dụ: năm trăm nghìn đồng" />
    </label>
    <div className="scene-voice-row">
      {scene.voice === 'off' ? <small>Câu này không đọc</small> : scene.voiceUrl ? <audio controls preload="none" src={scene.voiceUrl} aria-label="Nghe giọng đọc" /> : <small>Chưa có giọng đọc</small>}
      <label className="scene-voice-off"><input type="checkbox" checked={scene.voice === 'off'} onChange={event => update({ voice: event.target.checked ? 'off' : undefined })} /> Tắt giọng câu này</label>
    </div>
  </div>
}

export default function EditorCanvas({ code, content, meta, scenes, scene, idx, setIdx, preview, write, busy, dirty, json, setJson, toggleJson, save, update, addScene, duplicateScene, deleteScene, onPick, schemaQuery, warnings = [], refreshError = '', conditionDrafts = {}, editCondition, onSuggestVoice }) {
  const trackRef = useRef(null)
  const visualMode = json === null
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onWheel = event => {
      // Keep browser zoom and native horizontal trackpad gestures intact.
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
      const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1
      const next = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, track.scrollLeft + event.deltaY * scale))
      if (next === track.scrollLeft) return
      if (event.cancelable) event.preventDefault()
      track.scrollLeft = next
    }
    track.addEventListener('wheel', onWheel, { passive: false })
    return () => track.removeEventListener('wheel', onWheel)
  }, [visualMode])
  useEffect(() => {
    const track = trackRef.current
    const selected = track?.querySelector('[aria-pressed="true"]')
    if (!selected) return
    const bounds = track.getBoundingClientRect()
    const item = selected.getBoundingClientRect()
    if (item.left < bounds.left) track.scrollLeft -= bounds.left - item.left + 18
    else if (item.right > bounds.right) track.scrollLeft += item.right - bounds.right + 18
  }, [idx, scenes.length, json])
  const selectNext = (value, onChange, label) => <select aria-label={label} value={value || ''} onChange={event => onChange(event.target.value || null)}><option value="">Kết thúc / Không có</option>{scenes.map(item => <option key={item.id} value={item.id}>{item.title || item.id} · {item.id}</option>)}</select>
  return <section className="scene-editor" aria-label="Trình biên tập chương">
    <header className="scene-editor-toolbar">
      <div className="scene-editor-document"><span className="scene-editor-document-icon"><Layers3 size={20} /></span><div><h1>{content.title || code}</h1><p>{code}<span>·</span><Tag tone={meta?.status}>{STATUS_LABEL[meta?.status] || meta?.status}</Tag><span>·</span>Rev {meta?.revision}</p></div></div>
      <div className="scene-editor-document-actions"><span className={`scene-save-state ${dirty ? 'dirty' : ''}`}><span />{dirty ? 'Có thay đổi chưa lưu' : 'Đã tải từ máy chủ'}</span><button type="button" disabled={busy} onClick={toggleJson}><Code2 size={16} />{json === null ? 'JSON' : 'Theo cảnh / Chơi thử'}</button>{write && onSuggestVoice && <button type="button" disabled={busy || dirty} title={dirty ? 'Lưu nháp trước để AI đọc bản mới nhất' : 'AI đề xuất cách đọc cho câu có số, ký hiệu, chữ viết tắt'} onClick={onSuggestVoice}><Mic size={16} />Gợi ý cách đọc (AI)</button>}{write && <button type="button" className="scene-primary" disabled={busy} onClick={save}><Save size={16} />{busy ? 'Đang lưu…' : 'Lưu nháp'}</button>}</div>
    </header>
    {meta?.status === 'SUBMITTED' && <p className="scene-editor-notice">Nháp đang chờ duyệt. Người biên tập cần rút nháp trước khi chỉnh sửa.</p>}
    {meta?.status === 'RELEASED' && write && <p className="scene-editor-notice">Lưu thay đổi sẽ tạo nháp revision {meta.revision + 1}; bản phát hành hiện tại vẫn được giữ nguyên.</p>}
    {!write && <p className="scene-editor-notice">Chế độ chỉ đọc — bạn có thể chọn cảnh và chơi thử nội dung.</p>}
    {!!warnings.length && <details open className="scene-draft-warnings" aria-live="polite"><summary>Cảnh báo cần kiểm tra ({warnings.length})</summary><p>Bản nháp vẫn được lưu. Sửa các mục này trước khi gửi duyệt.</p><ul>{warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></details>}
    {refreshError && <p role="alert" className="scene-editor-notice">Đã lưu nhưng chưa tải lại được thông tin nháp: {refreshError}</p>}
    {json !== null ? <div className="scene-json-editor"><div><Code2 size={16} /> Nội dung JSON <small>Toàn bộ cấu trúc chương</small></div><textarea aria-label="JSON nội dung chương" readOnly={!write || busy} value={json} onChange={event => setJson(event.target.value)} spellCheck={false} /></div> : <div className="scene-editor-body">
      <div className="scene-editor-workbench">
        <div className="scene-editor-canvas-heading"><span><span className="scene-editor-page-number">{scenes.length ? idx + 1 : 0}</span>{scene?.title || 'Cảnh mới'}<small>{types[scene?.type] || scene?.type}</small></span><div><button type="button" aria-label="Cảnh trước" disabled={idx === 0 || !scenes.length} onClick={() => setIdx(idx - 1)}><ChevronLeft size={17} /></button><button type="button" aria-label="Cảnh sau" disabled={idx >= scenes.length - 1} onClick={() => setIdx(idx + 1)}><ChevronRight size={17} /></button></div></div>
        <div className="scene-editor-canvas"><div className="scene-editor-preview">{preview}</div></div>
        <div className="scene-editor-canvas-footer"><span>{scene?.id || 'Chưa có cảnh'} · 16:9</span><span>Xem trước tương tác</span></div>

      </div>
      <aside className="scene-inspector" aria-label="Thuộc tính cảnh">
        <div className="scene-inspector-heading"><div><MessageSquare size={18} /><h2>Nội dung cảnh</h2></div><small>{scene ? types[scene.type] || scene.type : 'Chưa có cảnh'}</small></div>
        <div className="scene-inspector-scroll">{scene ? <>
          <fieldset disabled={!write || busy}>
            <label>Tiêu đề cảnh<input value={scene.title || ''} onChange={event => update({ title: event.target.value })} placeholder="Đặt tên cho cảnh" /></label>
            <label>Người nói<input value={scene.speaker || ''} onChange={event => update({ speaker: event.target.value })} placeholder="Ví dụ: An" /></label>
            <label>Lời thoại<textarea rows={5} value={scene.text || ''} onChange={event => update({ text: event.target.value })} placeholder="Nhập lời thoại…" /></label>
            {(scene.speaker || scene.speakerId) && scene.text && <VoiceFields scene={scene} update={update} />}
            <div className="scene-inspector-divider" />
            <label>Ảnh nền<input value={scene.background || ''} onChange={event => update({ background: event.target.value })} placeholder="URL hoặc ref ảnh" /></label>
            <button type="button" className="scene-pick-background" onClick={onPick}><ImagePlus size={17} /> Chọn ảnh từ thư viện</button>
            {scene.type === 'choice' && <div className="scene-choice-fields"><h3>Các lựa chọn</h3>{scene.options?.map((option, index) => <div key={option.id || index}><label>Lựa chọn {index + 1}<input value={option.text || option.label || ''} onChange={event => update({ options: scene.options.map((value, i) => i === index ? { ...value, text: event.target.value, ...(value.label !== undefined ? { label: event.target.value } : {}) } : value) })} /></label><label>Chuyển đến{selectNext(option.nextSceneId, nextSceneId => update({ options: scene.options.map((value, i) => i === index ? { ...value, nextSceneId } : value) }), `Cảnh đích lựa chọn ${index + 1}`)}</label></div>)}</div>}
            {scene.type === 'choice' && scene.options?.map((option, index) => <ChoiceConditions key={`${scene.id}/${option.id || index}`} option={option} index={index} raw={conditionDrafts[`${scene.id}/${index}`]} onCondition={raw => editCondition(index, raw)} onReason={lockedReason => update({ options: scene.options.map((value, i) => i === index ? { ...value, lockedReason } : value) })} />)}
            {scene.type !== 'choice' && scene.type !== 'ending' && <label>Cảnh kế tiếp{selectNext(scene.nextSceneId, nextSceneId => update({ nextSceneId }), 'Cảnh kế tiếp')}</label>}
            {scene.type === 'minigame' && <><label>Cảnh khi hoàn thành{selectNext(scene.onPassSceneId, onPassSceneId => update({ onPassSceneId }), 'Cảnh khi hoàn thành')}</label><small>Chưa đạt sẽ chơi lại tại cảnh hiện tại, không có nhánh onFailSceneId.</small></>}
          </fieldset>
          {schemaQuery.loading ? <p role="status" className="scene-schema-status">Đang tải schema…</p> : schemaQuery.error ? <p role="alert">{schemaQuery.error} <button type="button" onClick={schemaQuery.reload}>Thử lại schema</button></p> : <SchemaFields schema={schemaQuery.data} scene={scene} update={update} disabled={!write || busy} />}
          {write && <div className="scene-inspector-actions"><button type="button" disabled={busy} onClick={duplicateScene}><Copy size={15} />Nhân đôi cảnh</button><button type="button" className="scene-delete" disabled={busy} onClick={deleteScene}><Trash2 size={15} />Xóa cảnh</button></div>}
        </> : <p className="scene-schema-status">Thêm cảnh đầu tiên để bắt đầu biên tập.</p>}
        </div>
      </aside>
        <section className="scene-timeline" aria-label="Các cảnh trong chương">
          <div className="scene-timeline-heading"><span><Layers3 size={15} /> Các cảnh <b>{scenes.length}</b></span>{write && <button type="button" disabled={busy} onClick={addScene}><Plus size={15} /> Thêm cảnh</button>}</div>
          <div className="scene-timeline-track" ref={trackRef}>{scenes.map((item, index) => <button type="button" className={`scene-thumbnail ${index === idx ? 'selected' : ''}`} key={item.id} aria-label={`Cảnh ${index + 1}: ${item.title || item.id}`} aria-pressed={index === idx} onClick={() => setIdx(index)}>
            <span className="scene-thumbnail-index">{index + 1}</span><Thumbnail scene={item} /><span className="scene-thumbnail-label">{item.title || item.id}</span>
          </button>)}{write && <button type="button" className="scene-add-page" disabled={busy} onClick={addScene}><Plus size={24} /><span>Thêm cảnh</span></button>}</div>
        </section>
    </div>}
  </section>
}
