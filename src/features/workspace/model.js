export const PLANS = {
  parent: { name: 'Gia đình', role: 'parent', capacity: 4, chapters: [1,2,3,4,5,6,7,8] },
  teacher: { name: 'Giáo viên', role: 'teacher', capacity: 40, chapters: [1,2,3,4,5,6,7,8] },
}
export const CHAPTERS = ['Khám phá tiền tệ', 'Quản lý chi tiêu', 'Chi phí sinh hoạt', 'Bước đầu tự lập', 'Vượt khủng hoảng tài chính', 'Thế giới tài chính', 'Tài chính gia đình', 'Chuẩn bị tương lai']
export const emptyDatabase = () => ({ version: 1, accounts: [], slots: [], learners: [], groups: [], quizzes: [], assignments: [], submissions: [], events: [] })
const fail = message => { throw new Error(message) }
const requireValue = (condition, message) => { if (!condition) fail(message) }
const id = () => globalThis.crypto.randomUUID()
const clean = value => String(value || '').trim()
export function resolveSession(db, session) {
  if (!session) return null
  if (session.kind === 'adult') {
    const account = db.accounts.find(a => a.id === session.id)
    return account ? { ...account, kind: 'adult', role: account.plan || 'guest' } : null
  }
  if (session.kind !== 'learner') return null
  const learner = db.learners.find(l => l.id === session.id && l.status === 'active' && l.authVersion === session.authVersion)
  const owner = learner && db.accounts.find(a => a.id === learner.ownerId && PLANS[a.plan])
  return owner ? { ...learner, kind: 'learner', role: 'kid', plan: owner.plan } : null
}
export function canAccessChapter(actor, chapter) {
  return Boolean(actor && Number.isInteger(chapter) && (
    (actor.role === 'guest' && [1, 2].includes(chapter)) ||
    (actor.role === 'kid' && PLANS[actor.plan]?.chapters.includes(chapter))
  ))
}
export function activeLearners(db, ownerId) { return db.learners.filter(l => l.ownerId === ownerId && l.status === 'active') }
export function assignmentsFor(db, learnerId) { return db.assignments.filter(a => a.learnerIds.includes(learnerId)) }
export function applyAction(database, session, action, now = new Date().toISOString()) {
  const db = structuredClone(database)
  const actor = resolveSession(db, session)
  const payload = action.payload || {}
  const adult = () => { requireValue(actor?.kind === 'adult', 'Vui lòng đăng nhập tài khoản người lớn.'); return db.accounts.find(a => a.id === actor.id) }
  const paid = () => { const a = adult(); requireValue(PLANS[a.plan], 'Bạn cần mở khóa gói để dùng chức năng này.'); return a }
  const teacher = () => { const a = paid(); requireValue(a.plan === 'teacher', 'Chức năng chỉ dành cho Teacher.'); return a }
  const ownedLearner = owner => { const l = db.learners.find(l => l.id === payload.learnerId && l.ownerId === owner.id); requireValue(l, 'Không tìm thấy học sinh thuộc tài khoản của bạn.'); return l }
  const log = (type, learnerId, detail, ownerId = actor?.id) => db.events.push({ id: id(), type, ownerId, learnerId, detail, at: now })
  switch (action.type) {
    case 'REGISTER': {
      const email = clean(payload.email).toLowerCase()
      requireValue(clean(payload.name) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && payload.credential, 'Thông tin đăng ký chưa hợp lệ.')
      requireValue(payload.id && !db.accounts.some(a => a.id === payload.id), 'Mã tài khoản không hợp lệ.')
      requireValue(!db.accounts.some(a => a.email === email), 'Email đã được đăng ký trên trình duyệt này.')
      db.accounts.push({ id: payload.id, name: clean(payload.name), email, credential: payload.credential, plan: null, createdAt: now })
      break
    }
    case 'ACTIVATE_DEMO_PLAN': {
      const a = adult()
      requireValue(PLANS[payload.plan], 'Gói không hợp lệ.')
      requireValue(!a.plan, 'Tài khoản đã có gói. Quy tắc mua nhiều gói chưa được chốt.')
      a.plan = payload.plan; a.purchasedAt = now; a.purchaseMode = 'demo'
      for (let n = 1; n <= PLANS[a.plan].capacity; n++) db.slots.push({ id: id(), ownerId: a.id, number: n, learnerId: null })
      log('plan_activated', null, `Kích hoạt thử gói ${PLANS[a.plan].name}`)
      break
    }
    case 'ACTIVATE_SLOT': {
      const a = paid()
      const slot = db.slots.find(s => s.id === payload.slotId && s.ownerId === a.id)
      requireValue(slot && !slot.learnerId, 'Slot không tồn tại hoặc đã được kích hoạt.')
      requireValue(clean(payload.name) && payload.credential, 'Cần tên học sinh và PIN hợp lệ.')
      let code
      do { code = `FT-${id().replaceAll('-', '').slice(0, 10).toUpperCase()}` } while (db.learners.some(l => l.code === code))
      const learner = { id: id(), ownerId: a.id, slotId: slot.id, name: clean(payload.name), code, credential: payload.credential, authVersion: 1, status: 'active', createdAt: now, progress: [] }
      db.learners.push(learner); slot.learnerId = learner.id
      log('learner_created', learner.id, `Kích hoạt slot ${slot.number} cho ${learner.name}`)
      break
    }
    case 'RESET_PIN': {
      const l = ownedLearner(paid())
      requireValue(l.status === 'active' && payload.credential, 'Chỉ đặt lại PIN cho tài khoản đang hoạt động.')
      l.credential = payload.credential; l.authVersion += 1
      log('pin_reset', l.id, 'Đặt lại PIN; phiên học sinh trước đó hết hiệu lực')
      break
    }
    case 'REVOKE_LEARNER': {
      const l = ownedLearner(paid())
      requireValue(l.status === 'active', 'Tài khoản đã được thu hồi.')
      l.status = 'revoked'; l.revokedAt = now; l.authVersion += 1; l.credential = null
      const slot = db.slots.find(s => s.id === l.slotId)
      if (slot?.learnerId === l.id) slot.learnerId = null
      db.groups.forEach(g => { g.learnerIds = g.learnerIds.filter(learnerId => learnerId !== l.id) })
      log('learner_revoked', l.id, 'Thu hồi tài khoản; giữ lại lịch sử và kết quả')
      break
    }
    case 'SAVE_GROUP': {
      const a = teacher()
      requireValue(clean(payload.name), 'Nhập tên nhóm.')
      const learnerIds = [...new Set(payload.learnerIds || [])]
      requireValue(learnerIds.every(key => activeLearners(db, a.id).some(l => l.id === key)), 'Nhóm chỉ chứa học sinh đang hoạt động của bạn.')
      if (payload.id) {
        const group = db.groups.find(g => g.id === payload.id && g.ownerId === a.id)
        requireValue(group, 'Không tìm thấy nhóm.')
        Object.assign(group, { name: clean(payload.name), learnerIds })
      } else db.groups.push({ id: id(), ownerId: a.id, name: clean(payload.name), learnerIds })
      break
    }
    case 'SAVE_QUIZ': {
      const a = teacher()
      requireValue(clean(payload.title), 'Nhập tên bài kiểm tra.')
      const questions = payload.questions || []
      requireValue(questions.length > 0 && questions.every(q => clean(q.text) && q.options?.length === 4 && q.options.every(o => clean(o)) && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4), 'Mỗi câu cần nội dung, 4 đáp án và 1 đáp án đúng.')
      const existing = payload.id && db.quizzes.find(q => q.id === payload.id && q.ownerId === a.id)
      requireValue(!payload.id || existing, 'Không tìm thấy quiz.')
      const value = { title: clean(payload.title), questions: structuredClone(questions), updatedAt: now }
      if (existing) Object.assign(existing, value)
      else db.quizzes.push({ id: id(), ownerId: a.id, ...value })
      break
    }
    case 'ASSIGN_QUIZ': {
      const a = teacher()
      const quiz = db.quizzes.find(q => q.id === payload.quizId && q.ownerId === a.id)
      requireValue(quiz, 'Không tìm thấy quiz.')
      const groupIds = [...new Set(payload.groupIds || [])]
      requireValue(groupIds.every(key => db.groups.some(g => g.id === key && g.ownerId === a.id)), 'Nhóm không hợp lệ.')
      const learnerIds = [...new Set([...(payload.learnerIds || []), ...db.groups.filter(g => groupIds.includes(g.id)).flatMap(g => g.learnerIds)])]
      requireValue(learnerIds.length > 0 && learnerIds.every(key => activeLearners(db, a.id).some(l => l.id === key)), 'Chọn ít nhất một học sinh đang hoạt động.')
      db.assignments.push({ id: id(), ownerId: a.id, quizId: quiz.id, title: quiz.title, questions: structuredClone(quiz.questions), learnerIds, groupIds, createdAt: now })
      log('quiz_assigned', null, `Giao “${quiz.title}” cho ${learnerIds.length} học sinh`)
      break
    }
    case 'SUBMIT_QUIZ': {
      requireValue(actor?.kind === 'learner', 'Hãy đăng nhập bằng mã học sinh.')
      const assignment = db.assignments.find(a => a.id === payload.assignmentId && a.ownerId === actor.ownerId && a.learnerIds.includes(actor.id))
      requireValue(assignment, 'Bài kiểm tra không được giao cho bạn.')
      requireValue(!db.submissions.some(s => s.assignmentId === assignment.id && s.learnerId === actor.id), 'Bạn đã nộp bài này.')
      requireValue(payload.answers?.length === assignment.questions.length && payload.answers.every(n => Number.isInteger(n) && n >= 0 && n < 4), 'Hãy trả lời tất cả câu hỏi.')
      const correct = assignment.questions.filter((q, i) => q.correct === payload.answers[i]).length
      db.submissions.push({ id: id(), ownerId: actor.ownerId, learnerId: actor.id, assignmentId: assignment.id, title: assignment.title, answers: payload.answers, correct, total: assignment.questions.length, submittedAt: now })
      log('quiz_submitted', actor.id, `Nộp “${assignment.title}”: ${correct}/${assignment.questions.length}`, actor.ownerId)
      break
    }
    case 'UPDATE_PROFILE': {
      const a = adult(); requireValue(clean(payload.name), 'Nhập họ tên.'); a.name = clean(payload.name); break
    }
    default: fail('Thao tác không được hỗ trợ.')
  }
  return db
}
