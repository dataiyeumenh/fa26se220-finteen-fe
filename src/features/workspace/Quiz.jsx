import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, ClipboardList, Download, Eye, Pencil, Plus, RefreshCw, Send, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { auth } from '../../api/auth.api'
import { ActionForm, Empty, Heading, Modal, Notice } from './ui'
import { dateLabel } from './format'

const quizError = error => ({
  3004: 'Bạn không có quyền thao tác với lớp hoặc đề này.', 3005: 'Gói giáo viên đã hết hạn. Hãy gia hạn để tạo, sửa hoặc phát hành đề.',
  8001: 'Không tìm thấy đề phù hợp.', 8002: 'Đề đã phát hành hoặc là hậu trắc nên không thể thay đổi.',
  8003: 'Học sinh này chưa nộp bài.', 8004: 'Bài kiểm tra đã quá hạn nộp.', 8005: 'Bạn đã nộp bài này rồi.',
  8006: 'Câu trả lời không khớp với đề.', 8007: 'Một câu hỏi đã bị rút, không tồn tại hoặc không dùng được cho đề giáo viên.',
  8008: 'Chỉ lớp đang mở mới sử dụng được Quiz.',
})[error?.code] || error?.message || 'Không thể hoàn thành yêu cầu.'
const kindLabel = quiz => quiz.kind === 'POST_TEST' ? `Hậu trắc chương ${quiz.chapter}` : 'Đề giáo viên'
const localDateTime = value => value ? new Date(value).toLocaleString('vi-VN') : 'Không có hạn'
const scoreOnTen = (score, total) => total ? Number((Number(score || 0) / Number(total) * 10).toFixed(1)) : 0
const scoreLabel = (score, total) => `${scoreOnTen(score, total).toLocaleString('vi-VN')}/10`
const optionLabel = index => {
  let label = ''; let value = index + 1
  while (value > 0) { value -= 1; label = String.fromCharCode(65 + (value % 26)) + label; value = Math.floor(value / 26) }
  return label
}
const toInputDateTime = value => {
  if (!value) return ''
  const date = new Date(value); const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}
function Feedback({ message, error }) {
  if (!message && !error) return null
  return <div className={`ws-toast ${error ? 'error' : 'success'}`} role={error ? 'alert' : 'status'}>{error || message}</div>
}

function QuizEditor({ groups, quiz, onSaved, onClose }) {
  const [questions, setQuestions] = useState([])
  const [selected, setSelected] = useState(() => new Set(quiz?.questionIds || quiz?.questions?.map(item => item.id) || []))
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', standard: '', concept: '', pool: '' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [showSelected, setShowSelected] = useState(false)
  const [loadError, setLoadError] = useState('')
  const loadQuestions = useCallback(async () => {
    setLoading(true); setLoadError('')
    try { setQuestions(await auth.listQuestions(appliedFilters) || []) } catch (error) { setLoadError(quizError(error)) } finally { setLoading(false) }
  }, [appliedFilters])
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadQuestions() }, [loadQuestions])
  const standards = ['CEE-I', 'CEE-II', 'CEE-III', 'CEE-IV', 'CEE-V', 'CEE-VI']
  const toggle = id => setSelected(old => { const next = new Set(old); if (next.has(id)) next.delete(id); else if (next.size < 100) next.add(id); return next })
  const visibleQuestions = showSelected ? questions.filter(question => selected.has(question.id)) : questions
  const selectedInResults = questions.filter(question => selected.has(question.id)).length
  const selectAllResults = () => setSelected(old => {
    const next = new Set(old)
    questions.some(question => { if (next.size >= 100) return true; next.add(question.id); return false })
    return next
  })
  const clearResults = () => setSelected(old => {
    const next = new Set(old)
    questions.forEach(question => next.delete(question.id))
    return next
  })
  return <section className="ws-card ws-quiz-editor-page"><header><div><span className="ws-pill">{quiz ? 'Chỉnh sửa đề' : 'Tạo đề mới'}</span><h2>{quiz ? 'Chỉnh sửa đề nháp' : 'Tạo đề kiểm tra'}</h2><p>Chọn câu từ kho chung. Sau khi phát hành, đề và hạn nộp sẽ được khóa.</p></div><button type="button" className="ws-btn" onClick={onClose}>← Danh sách đề</button></header>
    <ActionForm submit={quiz ? 'Lưu thay đổi' : 'Tạo đề nháp'} onSubmit={async form => {
      if (!selected.size) throw new Error('Hãy chọn ít nhất một câu hỏi.')
      const dueValue = form.get('dueAt'); const dueAt = dueValue ? new Date(dueValue).toISOString() : null
      if (!dueAt || new Date(dueAt) <= new Date()) throw new Error('Hạn nộp phải ở tương lai.')
      const payload = { groupId: form.get('groupId'), title: form.get('title'), questionIds: [...selected], dueAt }
      try { if (quiz) await auth.updateQuiz(quiz.id, payload); else await auth.createQuiz(payload); await onSaved(quiz ? 'Đã cập nhật đề nháp.' : 'Đã tạo đề nháp.') } catch (error) { throw new Error(quizError(error), { cause: error }) }
    }}>
      <label>Lớp học<select name="groupId" defaultValue={quiz?.groupId || groups.find(item => !item.closedAt)?.id} disabled={Boolean(quiz)} required>{groups.filter(item => !item.closedAt).map(group => <option value={group.id} key={group.id}>{group.name}</option>)}</select></label>
      <label>Tên bài kiểm tra<input name="title" defaultValue={quiz?.title || ''} required minLength={1} maxLength={120}/></label>
      <label>Hạn nộp<input name="dueAt" type="datetime-local" defaultValue={toInputDateTime(quiz?.dueAt)} required/></label>
      <fieldset><legend>Kho câu hỏi · đã chọn {selected.size}/100</legend><div className="ws-toolbar"><label>Tìm nội dung<input value={filters.q} onChange={event => setFilters(old => ({ ...old, q: event.target.value }))} placeholder="VD: budget"/></label><label>Chuẩn CEE<select value={filters.standard} onChange={event => setFilters(old => ({ ...old, standard: event.target.value }))}><option value="">Tất cả</option>{standards.map(value => <option key={value}>{value}</option>)}</select></label><label>Nguồn câu hỏi<input value={filters.pool} onChange={event => setFilters(old => ({ ...old, pool: event.target.value }))} placeholder="VD: CFPB"/></label><label>Khái niệm<input value={filters.concept} onChange={event => setFilters(old => ({ ...old, concept: event.target.value }))} placeholder="VD: budget"/></label><button type="button" className="ws-btn" onClick={() => setAppliedFilters({ ...filters })}>Lọc câu hỏi</button><button type="button" className="ws-btn" onClick={() => { const empty = { q: '', standard: '', concept: '', pool: '' }; setFilters(empty); setAppliedFilters(empty) }}>Xóa lọc</button></div>
        {!loading && questions.length > 0 && <div className="ws-question-bulk"><span><strong>{questions.length}</strong> kết quả · <strong>{selectedInResults}</strong> đã chọn trong kết quả này</span><div><button type="button" className="ws-btn compact" disabled={selected.size >= 100 || selectedInResults === questions.length} onClick={selectAllResults}>Chọn tất cả kết quả</button><button type="button" className="ws-btn compact" disabled={!selectedInResults} onClick={clearResults}>Bỏ chọn kết quả</button><button type="button" className={`ws-btn compact ${showSelected ? 'is-active' : ''}`} disabled={!selectedInResults && !showSelected} aria-pressed={showSelected} onClick={() => setShowSelected(value => !value)}>{showSelected ? 'Xem tất cả kết quả' : 'Chỉ xem đã chọn'}</button></div></div>}
        <Notice text={loadError}/>{loading ? <Empty>Đang tải kho câu hỏi…</Empty> : visibleQuestions.length ? <div className="ws-checks">{visibleQuestions.map(question => <label key={question.id}><input type="checkbox" checked={selected.has(question.id)} onChange={() => toggle(question.id)}/><span><strong>{question.externalId || 'Câu hỏi'}</strong> · {question.stem}<span className="ws-question-options">{question.options?.map((option, index) => <span key={index}><b>{optionLabel(index)}.</b>{option}</span>)}</span><small>{question.standard || 'Chưa gắn chuẩn'} · {question.options?.length || 0} lựa chọn</small></span></label>)}</div> : showSelected ? <Empty>Chưa có câu nào được chọn trong kết quả hiện tại.</Empty> : <Empty>Kho câu hỏi chưa có dữ liệu phù hợp. Cần ADMIN import câu hỏi trước khi tạo đề.</Empty>}
      </fieldset>
    </ActionForm>
  </section>
}

function QuizDetail({ quizId, onClose }) {
  const [detail, setDetail] = useState(null); const [error, setError] = useState('')
  useEffect(() => { auth.getQuiz(quizId).then(setDetail).catch(value => setError(quizError(value))) }, [quizId])
  return <Modal title={detail?.quiz?.title || 'Chi tiết đề'} description={detail ? `${kindLabel(detail.quiz)} · ${detail.quiz.questionCount} câu` : 'Đang tải nội dung đề…'} onClose={onClose}><Notice text={error}/>{detail?.questions?.map((question, index) => <section className="ws-question" key={question.id}><h3>{index + 1}. {question.stem}</h3>{question.options?.map((option, optionIndex) => <p key={optionIndex}>{String.fromCharCode(65 + optionIndex)}. {option} {question.correctIndex === optionIndex && <strong>✓ Đáp án đúng</strong>}</p>)}</section>)}</Modal>
}

function QuizResults({ quiz, onClose }) {
  const [data, setData] = useState(null); const [slotResult, setSlotResult] = useState(null); const [error, setError] = useState('')
  useEffect(() => { auth.getQuizResults(quiz.id).then(setData).catch(value => setError(quizError(value))) }, [quiz.id])
  const viewSlot = async slotId => { setError(''); try { setSlotResult(await auth.getQuizSlotResult(quiz.id, slotId)) } catch (value) { setError(quizError(value)) } }
  const exportCsv = () => {
    if (!data) return
    const rows = [['Mã', 'Học sinh', 'Trạng thái', 'Số câu đúng', 'Tổng câu', 'Điểm thang 10', 'Thời gian nộp'], ...data.rows.map(row => [row.code || '', row.displayName || '', row.attempted ? 'Đã nộp' : 'Chưa nộp', row.score ?? '', row.totalQuestions, row.attempted ? scoreOnTen(row.score, row.totalQuestions) : '', row.submittedAt || ''])]
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' })); link.download = `${quiz.title}.csv`; link.click(); URL.revokeObjectURL(link.href)
  }
  return <Modal title={`Kết quả · ${quiz.title}`} description="Kết quả cả lớp và bài làm chi tiết của từng học sinh." onClose={onClose}><Notice text={error}/><div className="ws-quiz-results">{data && <>{<div className="ws-quiz-results-summary"><article><span>Học sinh được giao</span><strong>{data.summary.assigned}</strong><small>Tổng số học sinh</small></article><article><span>Đã hoàn thành</span><strong>{data.summary.submitted}</strong><small>{data.summary.assigned ? `${Math.round(data.summary.submitted / data.summary.assigned * 100)}% đã nộp` : 'Chưa có học sinh'}</small></article><article className="highlight"><span>Điểm trung bình</span><strong>{data.summary.averageScore == null ? '—' : scoreLabel(data.summary.averageScore, data.quiz.questionCount)}</strong><small>Quy đổi thang điểm 10</small></article></div>}<div className="ws-quiz-results-toolbar"><div><h3>Danh sách học sinh</h3><p>{data.summary.submitted}/{data.summary.assigned} học sinh đã nộp bài</p></div><button className="ws-btn" onClick={exportCsv}><Download size={16}/> Xuất kết quả CSV</button></div><div className="ws-quiz-results-table"><table><thead><tr><th>Học sinh</th><th>Trạng thái</th><th>Số câu đúng</th><th>Điểm thang 10</th><th>Thao tác</th></tr></thead><tbody>{data.rows.map(row => <tr key={row.slotId}><td><div className="ws-student-cell"><span>{String(row.displayName || '?').charAt(0).toUpperCase()}</span><div><strong>{row.displayName || 'Đã xóa dữ liệu'}</strong><small>{row.code || row.status}</small></div></div></td><td><span className={`ws-result-status ${row.attempted ? 'done' : 'pending'}`}>{row.attempted ? 'Đã nộp' : 'Chưa nộp'}</span></td><td>{row.attempted ? <strong>{row.score}/{row.totalQuestions} câu</strong> : <span className="ws-table-empty">—</span>}</td><td>{row.attempted ? <strong className="ws-grade">{scoreLabel(row.score, row.totalQuestions)}</strong> : <span className="ws-table-empty">—</span>}</td><td>{row.attempted ? <button className="ws-btn compact" onClick={() => void viewSlot(row.slotId)}>Xem bài</button> : <span className="ws-table-empty">Chờ nộp</span>}</td></tr>)}</tbody></table></div></>}
    {slotResult && <section className="ws-slot-result-detail"><div className="ws-row"><div><span className="ws-pill">Chi tiết bài làm</span><h3>{slotResult.score}/{slotResult.totalQuestions} câu đúng · {scoreLabel(slotResult.score, slotResult.totalQuestions)} điểm</h3></div><button className="ws-btn" onClick={() => setSlotResult(null)}>Đóng chi tiết</button></div>{slotResult.answers.map((answer, index) => <article className="ws-question" key={answer.questionId}><h3>{index + 1}. {answer.stem}</h3><p>Học sinh chọn: {answer.chosenIndex === null ? 'Bỏ trống' : String.fromCharCode(65 + answer.chosenIndex)}</p><strong>{answer.correct ? '✓ Trả lời đúng' : `✕ Trả lời sai · Đáp án ${String.fromCharCode(65 + answer.correctIndex)}`}</strong></article>)}</section>}</div>
  </Modal>
}

export function TeacherQuizManagement() {
  const [groups, setGroups] = useState([]); const [groupId, setGroupId] = useState(''); const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true); const [modal, setModal] = useState(null); const [message, setMessage] = useState(''); const [error, setError] = useState('')
  const loadGroups = useCallback(async () => { try { const rows = (await auth.listGroups() || []).filter(item => item.context === 'CLASS'); setGroups(rows); setGroupId(old => old || rows.find(item => !item.closedAt)?.id || rows[0]?.id || '') } catch (value) { setError(quizError(value)) } }, [])
  const loadQuizzes = useCallback(async () => { if (!groupId) { setQuizzes([]); setLoading(false); return } setLoading(true); setError(''); try { setQuizzes(await auth.listQuizzes(groupId) || []) } catch (value) { setError(quizError(value)) } finally { setLoading(false) } }, [groupId])
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadGroups() }, [loadGroups])
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadQuizzes() }, [loadQuizzes])
  useEffect(() => { if (!message) return undefined; const timer = window.setTimeout(() => setMessage(''), 4500); return () => window.clearTimeout(timer) }, [message])
  const currentGroup = groups.find(item => item.id === groupId)
  const refresh = async success => { setMessage(success || ''); setModal(null); await loadGroups(); await loadQuizzes() }
  const act = async (action, success) => { setError(''); try { await action(); await refresh(success) } catch (value) { setError(quizError(value)); setModal(null) } }
  const editing = modal?.type === 'edit'
  return <><Heading title="Quản lý Quiz" description="Tạo đề từ kho câu hỏi, phát hành cho lớp và theo dõi kết quả."><button className="ws-btn" onClick={() => { void loadGroups(); void loadQuizzes() }}><RefreshCw size={16}/> Làm mới</button></Heading><nav className="ws-quiz-tabs" aria-label="Quản lý Quiz"><button type="button" className={!editing ? 'active' : ''} onClick={() => setModal(null)}>Danh sách đề</button><button type="button" className={editing ? 'active' : ''} disabled={!currentGroup || Boolean(currentGroup.closedAt)} onClick={() => setModal({ type: 'edit' })}><Plus size={16}/> {editing && modal.quiz ? 'Chỉnh sửa đề' : 'Tạo đề mới'}</button></nav><Feedback message={message} error={error}/>
    {editing ? <QuizEditor key={modal.quiz?.id || 'new'} groups={groups} quiz={modal.quiz} onClose={() => setModal(null)} onSaved={refresh}/> : <>{groups.length ? <div className="ws-toolbar"><label>Lớp học<select value={groupId} onChange={event => setGroupId(event.target.value)}>{groups.map(group => <option value={group.id} key={group.id}>{group.name}{group.closedAt ? ' · đã kết thúc' : ''}</option>)}</select></label>{currentGroup && !currentGroup.closedAt && <button className="ws-btn primary" onClick={() => setModal({ type: 'edit' })}><Plus size={17}/> Tạo đề</button>}</div> : <Empty>Bạn chưa có lớp học. Hãy tạo lớp trước khi tạo Quiz.</Empty>}
    {loading ? <Empty>Đang tải danh sách Quiz…</Empty> : quizzes.length ? <div className="ws-grid two">{quizzes.map(quiz => { const draft = !quiz.publishedAt; return <article className="ws-card" key={quiz.id}><div className="ws-row"><span className="ws-pill">{kindLabel(quiz)}</span><span className="ws-pill">{draft ? 'Bản nháp' : 'Đã phát hành'}</span></div><h2>{quiz.title}</h2><p>{quiz.questionCount} câu · {quiz.dueAt ? `Hạn ${localDateTime(quiz.dueAt)}` : 'Không có hạn'}</p><p>{quiz.submittedCount || 0} học sinh đã nộp</p><div className="ws-actions"><button className="ws-btn" onClick={() => setModal({ type: 'detail', quiz })}><Eye size={16}/> Xem đề</button>{draft && quiz.kind !== 'POST_TEST' && <><button className="ws-btn" onClick={() => setModal({ type: 'edit', quiz })}><Pencil size={16}/> Sửa</button><button className="ws-btn primary" onClick={() => setModal({ type: 'publish', quiz })}><Send size={16}/> Phát hành</button><button className="ws-btn danger" onClick={() => setModal({ type: 'delete', quiz })}><Trash2 size={16}/> Xóa</button></>}{!draft && <button className="ws-btn" onClick={() => setModal({ type: 'results', quiz })}><ClipboardList size={16}/> Kết quả</button>}</div></article> })}</div> : groupId && <Empty>Lớp này chưa có đề kiểm tra hoặc hậu trắc.</Empty>}</>}
    {modal?.type === 'detail' && <QuizDetail quizId={modal.quiz.id} onClose={() => setModal(null)}/>} {modal?.type === 'results' && <QuizResults quiz={modal.quiz} onClose={() => setModal(null)}/>} {['publish', 'delete'].includes(modal?.type) && <Modal title={modal.type === 'publish' ? 'Phát hành đề?' : 'Xóa đề nháp?'} description={modal.type === 'publish' ? 'Sau khi phát hành, đề không thể sửa hoặc xóa. Mọi học sinh đang hoạt động trong lớp đều nhìn thấy đề.' : 'Đề nháp sẽ bị xóa và không thể khôi phục.'} onClose={() => setModal(null)}><button className={`ws-btn ${modal.type === 'delete' ? 'danger' : 'primary'}`} onClick={() => void act(() => modal.type === 'publish' ? auth.publishQuiz(modal.quiz.id) : auth.deleteQuiz(modal.quiz.id), modal.type === 'publish' ? 'Đã phát hành đề.' : 'Đã xóa đề nháp.')}>Xác nhận</button></Modal>}
  </>
}

export function KidQuizTake() {
  const { id } = useParams(); const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null); const [answers, setAnswers] = useState({}); const [result, setResult] = useState(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  useEffect(() => { auth.getLearnerQuiz(id).then(setQuiz).catch(value => setError(quizError(value))) }, [id])
  const submit = async event => {
    event.preventDefault(); if (!window.confirm(`Bạn đã trả lời ${Object.keys(answers).length}/${quiz.questions.length} câu. Nộp bài ngay? Bạn chỉ được nộp một lần.`)) return
    setBusy(true); setError('')
    try { const payload = Object.entries(answers).map(([questionId, chosenIndex]) => ({ questionId, chosenIndex })); const submitted = await auth.submitLearnerQuiz(quiz.id, payload); setResult(submitted); await auth.ensureLearnerDashboard({ force: true }).catch(() => {}) } catch (value) { setError(quizError(value)) } finally { setBusy(false) }
  }
  if (error && !quiz) return <><Heading title="Không thể mở bài" description={error}/><Link className="ws-btn" to="/dashboard/kid/quiz">← Quay lại danh sách</Link></>
  if (!quiz) return <Empty>Đang tải đề Quiz…</Empty>
  const answered = Object.keys(answers).length
  const review = result?.review || []
  const score = result?.score ?? review.filter(item => item.correct).length
  const totalQuestions = result?.totalQuestions ?? quiz.questions.length
  const wrong = review.filter(item => !item.correct && item.chosenIndex !== null).length
  const blank = review.filter(item => item.chosenIndex === null).length
  const percent = totalQuestions ? Math.round(score / totalQuestions * 100) : 0
  const convertedScore = scoreOnTen(score, totalQuestions)
  return <div className="ws-quiz-page"><header className="ws-quiz-page-header"><div><Link to="/dashboard/kid/quiz">← Danh sách Quiz</Link><span className="ws-pill">{kindLabel(quiz)}</span><h1>{quiz.title}</h1><p>{quiz.questions.length} câu · chỉ được nộp một lần{quiz.dueAt ? ` · hạn ${localDateTime(quiz.dueAt)}` : ''}</p></div>{!result && <div className="ws-quiz-progress"><strong>{answered}/{quiz.questions.length}</strong><span>câu đã trả lời</span><div><i style={{ width: `${quiz.questions.length ? answered / quiz.questions.length * 100 : 0}%` }}/></div></div>}</header><Notice text={error}/>
    {!result && <form className="ws-quiz-page-form" onSubmit={submit}><div className="ws-quiz-question-list">{quiz.questions.map((question, index) => <fieldset className="ws-question ws-checks" key={question.id}><legend><span>{index + 1}</span>{question.stem}</legend>{question.options.map((option, optionIndex) => <label key={optionIndex}><input type="radio" name={question.id} checked={answers[question.id] === optionIndex} onChange={() => setAnswers(old => ({ ...old, [question.id]: optionIndex }))}/><b className="ws-option-letter">{optionLabel(optionIndex)}</b><span>{option}</span></label>)}</fieldset>)}</div><aside className="ws-quiz-submit-bar"><span>Đã trả lời <strong>{answered}/{quiz.questions.length}</strong> câu. Câu bỏ trống sẽ được tính là sai.</span><button className="ws-btn primary" disabled={busy}>{busy ? 'Đang nộp bài…' : 'Nộp bài'}</button></aside></form>}
    {result && <Modal title="Kết quả bài làm" description={`Bạn đã hoàn thành “${quiz.title}”.`} onClose={() => navigate('/dashboard/kid/quiz')}><section className="ws-quiz-result-modal"><div className="ws-result-hero"><div className="ws-result-score-ring" style={{ '--score-percent': `${percent * 3.6}deg` }}><span><strong>{convertedScore.toLocaleString('vi-VN')}</strong><small>/10 điểm</small></span></div><div><CheckCircle2/><h2>Đã nộp bài thành công!</h2><p>Bạn trả lời đúng {score}/{totalQuestions} câu, đạt {percent}% · quy đổi {convertedScore.toLocaleString('vi-VN')}/10 điểm.</p></div></div><div className="ws-result-stats"><div className="correct"><strong>{score}</strong><span>Câu đúng</span></div><div className="wrong"><strong>{wrong}</strong><span>Câu sai</span></div><div className="blank"><strong>{blank}</strong><span>Bỏ trống</span></div></div><div className="ws-result-review"><h3>Chi tiết bài làm</h3>{review.map((answer, index) => { const question = quiz.questions.find(item => item.id === answer.questionId); const selected = answer.chosenIndex === null ? 'Bạn chưa chọn đáp án' : question?.options?.[answer.chosenIndex] || `Lựa chọn ${String.fromCharCode(65 + answer.chosenIndex)}`; return <article className={answer.correct ? 'is-correct' : 'is-wrong'} key={answer.questionId}><span className="ws-result-number">{index + 1}</span><div><strong>{question?.stem || `Câu ${index + 1}`}</strong><small>{selected}</small></div><b>{answer.correct ? '✓ Đúng' : answer.chosenIndex === null ? '— Bỏ trống' : '✕ Sai'}</b></article> })}</div><button className="ws-btn primary" onClick={() => navigate('/dashboard/kid/quiz')}>Hoàn tất</button></section></Modal>}
  </div>
}

export function KidQuiz() {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const load = useCallback(async () => { setLoading(true); setError(''); try { setData(await auth.listLearnerQuizzes()) } catch (value) { setError(quizError(value)) } finally { setLoading(false) } }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load]); const pending = data?.pending || []; const completed = data?.completed || []
  const average = completed.length ? completed.reduce((sum, quiz) => sum + scoreOnTen(quiz.score, quiz.totalQuestions), 0) / completed.length : null
  return <div className="ws-kid-quiz"><Heading title="Quiz của bạn" description="Hoàn thành bài kiểm tra của lớp và hậu trắc sau mỗi chương."><button className="ws-btn" onClick={() => void load()}><RefreshCw size={16}/> Làm mới</button></Heading><Feedback error={error}/>{loading ? <Empty>Đang tải danh sách Quiz…</Empty> : <><section className="ws-kid-quiz-overview"><article><span><ClipboardList/></span><div><small>CHỜ LÀM BÀI</small><strong>{pending.length}</strong><p>{pending.length ? 'Bài đang chờ bạn hoàn thành' : 'Bạn đã hoàn thành hết bài'}</p></div></article><article><span><CheckCircle2/></span><div><small>ĐÃ HOÀN THÀNH</small><strong>{completed.length}</strong><p>Tổng số bài đã nộp</p></div></article><article><span className="score">10</span><div><small>ĐIỂM TRUNG BÌNH</small><strong>{average === null ? '—' : average.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}</strong><p>Quy đổi theo thang điểm 10</p></div></article></section><section className="ws-kid-quiz-section"><div className="ws-kid-quiz-section-head"><div><span>BÀI CẦN HOÀN THÀNH</span><h2>Chờ làm bài</h2></div><b>{pending.length} bài</b></div>{pending.length ? <div className="ws-kid-quiz-grid">{pending.map(quiz => <article className={`ws-kid-quiz-card pending ${quiz.overdue ? 'overdue' : ''}`} key={quiz.id}><div className="ws-row"><span className="ws-pill">{kindLabel(quiz)}</span><span className={`ws-kid-quiz-status ${quiz.overdue ? 'overdue' : ''}`}>{quiz.overdue ? 'Quá hạn' : 'Chờ làm'}</span></div><div className="ws-kid-quiz-card-icon"><ClipboardList/></div><h3>{quiz.title}</h3><div className="ws-kid-quiz-meta"><span><b>{quiz.questionCount}</b> câu hỏi</span><span>{quiz.dueAt ? <>Hạn <b>{localDateTime(quiz.dueAt)}</b></> : <b>Không có hạn</b>}</span></div>{quiz.overdue ? <button className="ws-btn" disabled>Đã quá hạn nộp</button> : <Link className="ws-btn primary" to={`/dashboard/kid/quiz/${quiz.id}`}>Bắt đầu làm bài <span>→</span></Link>}</article>)}</div> : <div className="ws-kid-quiz-empty"><CheckCircle2/><strong>Không còn bài đang chờ</strong><p>Bạn đã hoàn thành tất cả Quiz hiện tại.</p></div>}</section><section className="ws-kid-quiz-section"><div className="ws-kid-quiz-section-head"><div><span>LỊCH SỬ LÀM BÀI</span><h2>Đã hoàn thành</h2></div><b>{completed.length} bài</b></div>{completed.length ? <div className="ws-kid-quiz-completed">{completed.map(quiz => { const grade = scoreOnTen(quiz.score, quiz.totalQuestions); const percent = quiz.totalQuestions ? Math.round(quiz.score / quiz.totalQuestions * 100) : 0; return <article key={quiz.id}><div className="ws-kid-grade"><strong>{grade.toLocaleString('vi-VN')}</strong><small>/10 điểm</small></div><div className="ws-kid-completed-copy"><span className="ws-pill">{kindLabel(quiz)}</span><h3>{quiz.title}</h3><p>Nộp {dateLabel(quiz.submittedAt)}</p></div><div className="ws-kid-completed-result"><strong>{quiz.score}/{quiz.totalQuestions}</strong><span>câu đúng · {percent}%</span></div></article> })}</div> : <div className="ws-kid-quiz-empty"><ClipboardList/><strong>Chưa có bài đã hoàn thành</strong><p>Kết quả của bạn sẽ xuất hiện tại đây sau khi nộp bài.</p></div>}</section></>}</div>
}
