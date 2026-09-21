import { useState } from 'react'
import { useWorkspace } from './useWorkspace'
import { dispatch } from './demoStore'
import { activeLearners } from './model'
import { Heading, Empty, Modal, ActionForm, Notice } from './ui'
import { dateLabel } from './format'

const blankQuestion = () => ({ text: '', options: ['', '', '', ''], correct: 0 })
function QuizEditor({ quiz, close }) {
  const [questions, setQuestions] = useState(quiz.questions)
  const change = (i, patch) => setQuestions(qs => qs.map((q, n) => n === i ? { ...q, ...patch } : q))
  return <Modal title={quiz.id ? 'Chỉnh sửa Quiz' : 'Tạo Quiz mới'} description="Mỗi câu có 4 lựa chọn và 1 đáp án đúng. Sửa đề không làm thay đổi những bản đã giao." onClose={close}><ActionForm submit="Lưu đề kiểm tra" onSubmit={form => { dispatch('SAVE_QUIZ', { id: quiz.id, title: form.get('title'), questions }); close() }}><label>Tên bài kiểm tra<input name="title" defaultValue={quiz.title} required maxLength={120}/></label>{questions.map((q, i) => <fieldset className="ws-question" key={i}><legend>Câu {i + 1}</legend><label>Nội dung<textarea value={q.text} required onChange={e => change(i, { text: e.target.value })}/></label>{q.options.map((option, n) => <label className="ws-answer-edit" key={n}><input type="radio" name={`correct-${i}`} checked={q.correct === n} onChange={() => change(i, { correct: n })} aria-label={`Đáp án đúng ${String.fromCharCode(65 + n)}`}/><span>{String.fromCharCode(65 + n)}</span><input aria-label={`Nội dung đáp án ${String.fromCharCode(65 + n)}`} value={option} required onChange={e => change(i, { options: q.options.map((o, j) => j === n ? e.target.value : o) })}/></label>)}<button type="button" className="ws-text-link" disabled={questions.length === 1} onClick={() => setQuestions(qs => qs.filter((_, n) => n !== i))}>Xóa câu này</button></fieldset>)}<button type="button" className="ws-btn" onClick={() => setQuestions(qs => [...qs, blankQuestion()])}>+ Thêm câu hỏi</button></ActionForm></Modal>
}
function AssignmentForm({ quiz, close }) {
  const { db, actor } = useWorkspace()
  return <Modal title={`Giao bài: ${quiz.title}`} description="Giao một bản sao của đề hiện tại. Danh sách học sinh được chốt tại thời điểm giao; mỗi học sinh nộp một lần." onClose={close}><ActionForm submit="Giao bài kiểm tra" onSubmit={form => { dispatch('ASSIGN_QUIZ', { quizId: quiz.id, groupIds: form.getAll('group'), learnerIds: form.getAll('learner') }); close() }}><fieldset className="ws-checks"><legend>Chọn nhóm</legend>{db.groups.filter(g => g.ownerId === actor.id).map(g => <label key={g.id}><input name="group" type="checkbox" value={g.id}/>{g.name} ({g.learnerIds.length})</label>)}</fieldset><fieldset className="ws-checks"><legend>Hoặc chọn từng học sinh</legend>{activeLearners(db, actor.id).map(l => <label key={l.id}><input name="learner" type="checkbox" value={l.id}/>{l.name} <small>{l.code}</small></label>)}</fieldset></ActionForm></Modal>
}
export function TeacherQuizManagement() {
  const { actor, db } = useWorkspace()
  const quizzes = db.quizzes.filter(q => q.ownerId === actor.id)
  const assignments = db.assignments.filter(a => a.ownerId === actor.id).toReversed()
  const [editing, edit] = useState(null)
  const [assigning, assign] = useState(null)
  const [preview, setPreview] = useState(null)
  return <><Heading title="Quản lý Quiz" description="Tạo đề, xem trước và giao cho nhóm hoặc từng học sinh."><button className="ws-btn primary" onClick={() => edit({ title: '', questions: [blankQuestion()] })}>+ Tạo Quiz</button></Heading><div className="ws-grid two">{quizzes.map(q => <article className="ws-card" key={q.id}><span className="ws-pill">{q.questions.length} câu hỏi</span><h2>{q.title}</h2><p>Cập nhật {dateLabel(q.updatedAt)}</p><div className="ws-actions"><button className="ws-btn" onClick={() => setPreview(q)}>Xem trước</button><button className="ws-btn" onClick={() => edit(q)}>Sửa đề</button><button className="ws-btn primary" onClick={() => assign(q)}>Giao bài</button></div></article>)}</div>{!quizzes.length && <Empty>Chưa có Quiz. Tạo đề đầu tiên để bắt đầu.</Empty>}<section className="ws-card"><h2>Các lượt giao bài</h2>{assignments.length ? assignments.map(a => { const done = db.submissions.filter(s => s.assignmentId === a.id).length; return <div className="ws-list-row" key={a.id}><span>{a.title}<small>{dateLabel(a.createdAt)} · {a.questions.length} câu</small></span><strong>{done}/{a.learnerIds.length} đã nộp</strong></div> }) : <Empty>Chưa giao bài kiểm tra.</Empty>}</section>{editing && <QuizEditor quiz={editing} close={() => edit(null)}/>} {assigning && <AssignmentForm quiz={assigning} close={() => assign(null)}/>} {preview && <Modal title={`Xem trước · ${preview.title}`} description="Bản xem của giáo viên, có đánh dấu đáp án đúng." onClose={() => setPreview(null)}>{preview.questions.map((q, i) => <div className="ws-question" key={i}><h3>{i + 1}. {q.text}</h3>{q.options.map((o, n) => <p key={n}>{String.fromCharCode(65 + n)}. {o} {q.correct === n && '✓'}</p>)}</div>)}</Modal>}</>
}
function TakeQuiz({ assignment, close }) {
  const [answers, setAnswers] = useState({})
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState('')
  const ready = Object.keys(answers).length === assignment.questions.length
  return <Modal title={assignment.title} description={`${assignment.questions.length} câu hỏi · Chọn một đáp án mỗi câu · Nộp bài một lần.`} onClose={close}><form className="ws-form" onSubmit={e => { e.preventDefault(); if (!confirm) { setConfirm(true); return } try { dispatch('SUBMIT_QUIZ', { assignmentId: assignment.id, answers: assignment.questions.map((_, i) => answers[i]) }); close() } catch (err) { setError(err.message) } }}>{assignment.questions.map((q, i) => <fieldset className="ws-question ws-checks" key={i}><legend>{i + 1}. {q.text}</legend>{q.options.map((o, n) => <label key={n}><input type="radio" name={`answer-${i}`} value={n} required checked={answers[i] === n} onChange={() => { setAnswers(old => ({ ...old, [i]: n })); setConfirm(false) }}/>{o}</label>)}</fieldset>)}<Notice text={error}/>{confirm && <p>Bạn đã trả lời đủ. Xác nhận nộp để lưu kết quả và kết thúc bài kiểm tra.</p>}<button className="ws-btn primary" disabled={!ready}>{confirm ? 'Xác nhận nộp bài' : `Nộp bài (${Object.keys(answers).length}/${assignment.questions.length})`}</button></form></Modal>
}
export function KidQuiz() {
  const { actor, db } = useWorkspace()
  const assignments = db.assignments.filter(a => a.ownerId === actor.ownerId && a.learnerIds.includes(actor.id)).toReversed()
  const [taking, take] = useState(null)
  const [review, setReview] = useState(null)
  return <><Heading title="Quiz của bạn" description="Hoàn thành bài giáo viên đã giao và xem lại kết quả."/><div className="ws-grid two">{assignments.map(a => { const result = db.submissions.find(s => s.assignmentId === a.id && s.learnerId === actor.id); return <article className="ws-card" key={a.id}><span className="ws-pill">{result ? 'Đã hoàn thành' : 'Chờ làm bài'}</span><h2>{a.title}</h2><p>{a.questions.length} câu · Giao ngày {dateLabel(a.createdAt)}</p>{result ? <><p className="ws-score">{result.correct}/{result.total} câu đúng</p><button className="ws-btn" onClick={() => setReview({ assignment: a, result })}>Xem lại bài</button></> : <button className="ws-btn primary" onClick={() => take(a)}>Bắt đầu làm bài →</button>}</article> })}</div>{!assignments.length && <Empty>Giáo viên chưa giao bài kiểm tra cho bạn.</Empty>}{taking && <TakeQuiz assignment={taking} close={() => take(null)}/>} {review && <Modal title={`Kết quả · ${review.assignment.title}`} description={`Bạn trả lời đúng ${review.result.correct}/${review.result.total} câu.`} onClose={() => setReview(null)}>{review.assignment.questions.map((q, i) => <section className="ws-question" key={i}><h3>{i + 1}. {q.text}</h3><p>Bạn chọn: {q.options[review.result.answers[i]]}</p><strong>Đáp án đúng: {q.options[q.correct]}</strong></section>)}</Modal>}</>
}
