import { useCallback, useState } from 'react'
import { auth } from '../../api/auth.api'
import { canWriteLibrary } from './permissions'
import { studioApi } from './studioClient'
import { useStudioAction, useStudioResource } from './useStudioResource'
import { Btn, Panel, Tag } from './ui'
import { inputCls } from './styles'
import Pagination from './Pagination'

function QuestionForm({ question, notify, onClose, onSaved }) {
  const [options, setOptions] = useState(question?.options || ['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(question?.correctIndex || 0)
  const { busy, run } = useStudioAction(notify)
  const fields = { externalId: 'Mã câu hỏi', pool: 'Kho (pool)', chapter: 'Chương (số)', standard: 'Chuẩn kiến thức', concept: 'Khái niệm', source: 'Nguồn', license: 'Giấy phép', replacesId: 'ID câu được thay thế (nếu có)' }
  return <Panel title={question ? 'Sửa câu hỏi' : 'Tạo câu hỏi'}><form onSubmit={event => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const body = Object.fromEntries(Object.keys(fields).map(key => [key, String(values.get(key) || '').trim() || null]))
    body.chapter = body.chapter ? Number(body.chapter) : null
    body.stem = String(values.get('stem')).trim()
    body.options = options.map(option => option.trim())
    body.correctIndex = correctIndex
    if (!body.stem || body.options.length < 2 || body.options.some(option => !option)) return notify('Nhập câu hỏi và ít nhất hai lựa chọn có nội dung.')
    void run(() => question?.id ? studioApi.put(`/api/studio/questions/${encodeURIComponent(question.id)}`, body) : studioApi.post('/api/studio/questions', body), 'Đã lưu câu hỏi.', onSaved)
  }}><fieldset disabled={busy} className="grid gap-3">
    <label>Nội dung câu hỏi<textarea name="stem" className={`${inputCls} w-full`} rows={3} required defaultValue={question?.stem || ''} /></label>
    <p className="text-xs text-slate-500">Chọn nút tròn trước đáp án đúng.</p>
    {options.map((option, index) => <label className="flex items-center gap-2" key={index}><input type="radio" name="correct" aria-label={`Đáp án đúng là lựa chọn ${index + 1}`} checked={correctIndex === index} onChange={() => setCorrectIndex(index)} /><span>{index + 1}.</span><input className={`${inputCls} min-w-0 flex-1`} aria-label={`Nội dung lựa chọn ${index + 1}`} value={option} required onChange={event => setOptions(values => values.map((value, i) => i === index ? event.target.value : value))} /></label>)}
    <div className="flex gap-2"><Btn disabled={busy || options.length >= 8} onClick={() => setOptions(values => [...values, ''])}>Thêm lựa chọn</Btn><Btn disabled={busy || options.length <= 2} onClick={() => { setOptions(values => values.slice(0, -1)); setCorrectIndex(value => Math.min(value, options.length - 2)) }}>Bớt lựa chọn cuối</Btn></div>
    <div className="grid gap-3 sm:grid-cols-2">{Object.entries(fields).map(([key, label]) => <label key={key}>{label}<input className={`${inputCls} w-full`} name={key} defaultValue={question?.[key] ?? (key === 'pool' ? 'CEE' : '')} type={key === 'chapter' ? 'number' : 'text'} min={key === 'chapter' ? 1 : undefined} step={key === 'chapter' ? 1 : undefined} required={key === 'pool'} /></label>)}</div>
    <p className="text-xs text-slate-500">Câu đã dùng trong đề phát hành có thể bị giới hạn sửa nội dung. Tạo câu mới và điền ID câu được thay thế khi cần.</p>
    <div className="flex gap-2"><Btn type="submit" disabled={busy} tone="primary">{busy ? 'Đang lưu…' : 'Lưu câu hỏi'}</Btn><Btn disabled={busy} onClick={onClose}>Hủy</Btn></div>
  </fieldset></form></Panel>
}

export default function QuestionsPage({ notify }) {
  const [filters, setFilters] = useState({})
  const [editing, setEditing] = useState(undefined)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const write = canWriteLibrary(auth.getSnapshot().actor)
  const loader = useCallback(() => {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== ''))
    return studioApi.get(`/api/studio/questions?${query}`)
  }, [filters])
  const query = useStudioResource(loader)
  const { busy, run } = useStudioAction(notify)
  const rows = query.data || []
  const activePage = Math.min(page, Math.max(0, Math.ceil(rows.length / size) - 1))
  return <>
    {editing !== undefined && write && <QuestionForm key={editing?.id || 'new'} question={editing} notify={notify} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); query.reload() }} />}
    <Panel title="Ngân hàng câu hỏi" actions={<><Btn onClick={query.reload} disabled={query.loading || busy}>Tải lại</Btn>{write && <Btn tone="primary" disabled={busy} onClick={() => setEditing(null)}>+ Câu hỏi mới</Btn>}</>}>
      <form className="mb-4 flex flex-wrap items-end gap-3" onSubmit={event => { event.preventDefault(); setFilters(Object.fromEntries(new FormData(event.currentTarget))); setPage(0) }}>
        {['q', 'chapter', 'pool', 'standard', 'concept'].map((key, index) => <label key={key}>{['Tìm từ khóa', 'Chương', 'Kho', 'Chuẩn', 'Khái niệm'][index]}<input className={`${inputCls} w-32`} name={key} type={key === 'chapter' ? 'number' : 'text'} min={key === 'chapter' ? 1 : undefined} /></label>)}
        <label><input name="includeRetired" type="checkbox" value="true" /> Cả câu ngừng dùng</label><Btn type="submit">Lọc</Btn>
      </form>
      {query.loading ? <p role="status">Đang tải câu hỏi…</p> : query.error ? <p role="alert" className="text-red-700">{query.error}</p> : <>
        <div className="studio-library-scroll studio-question-scroll" tabIndex={0} role="region" aria-label="Danh sách câu hỏi"><table className="w-full text-sm"><thead><tr>{['Mã / Kho', 'Nội dung và lựa chọn', 'Đáp án', 'Nhãn', 'Thao tác'].map(label => <th key={label} className="p-2 text-left">{label}</th>)}</tr></thead><tbody>
          {rows.slice(activePage * size, (activePage + 1) * size).map(question => <tr key={question.id} className="border-t border-slate-100 align-top"><td className="p-2">{question.externalId || question.id}<small className="block">{question.pool} · Chương {question.chapter || '—'}</small>{question.retiredAt && <Tag tone="REJECTED">Ngừng dùng</Tag>}</td><td className="p-2">{question.stem}<ol className="ml-5 list-decimal text-xs text-slate-500">{question.options?.map((option, index) => <li key={index}>{option}</li>)}</ol></td><td className="p-2">{question.correctIndex + 1}</td><td className="p-2">{question.standard} {question.concept}</td><td className="p-2">{write && <div className="flex gap-2"><Btn disabled={busy} onClick={() => setEditing(question)}>Sửa</Btn><Btn disabled={busy} tone="danger" onClick={() => {
            if (window.confirm(`${question.retiredAt ? 'Khôi phục' : 'Ngừng sử dụng'} câu hỏi này?`)) void run(() => studioApi.post(`/api/studio/questions/${encodeURIComponent(question.id)}/${question.retiredAt ? 'restore' : 'retire'}`), 'Đã cập nhật câu hỏi.', query.reload)
          }}>{question.retiredAt ? 'Khôi phục' : 'Ngừng dùng'}</Btn></div>}</td></tr>)}
          {!rows.length && <tr><td colSpan={5} className="p-4">Không có câu hỏi phù hợp.</td></tr>}
        </tbody></table></div>
        <Pagination total={rows.length} page={activePage} size={size} sizes={[10, 20, 50]} onPage={setPage} onSize={value => { setSize(value); setPage(0) }} noun="câu hỏi" />
      </>}
    </Panel>
  </>
}
