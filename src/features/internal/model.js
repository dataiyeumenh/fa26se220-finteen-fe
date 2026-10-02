export const STAFF_ROLES = { editor: 'Game Editor', reviewer: 'Game Reviewer', manager: 'Manager Operator', admin: 'Admin' }
export const STATUS_LABELS = { draft: 'Bản nháp', pending: 'Chờ duyệt', passed: 'Pass', failed: 'Failed', published: 'Đã phát hành' }
export const emptyInternal = () => ({ version: 1, staff: [], chapters: [], audit: [] })
const ensure = (value, message) => { if (!value) throw new Error(message) }
const text = value => String(value || '').trim()
const uid = () => globalThis.crypto.randomUUID()
export const currentVersion = chapter => chapter.versions.at(-1)
export function staffSession(db, session) {
  const staff = session && db.staff.find(s => s.id === session.id && s.active && s.authVersion === session.authVersion)
  if (!staff) return null
  return { id: staff.id, name: staff.name, email: staff.email, role: staff.role }
}
export function canReadChapter(actor, chapter) {
  return Boolean(actor && (['admin', 'manager'].includes(actor.role) || (actor.role === 'editor' && chapter.editorId === actor.id) || (actor.role === 'reviewer' && chapter.reviewerId === actor.id)))
}
export function internalView(db, actor) {
  if (!actor) return { ...emptyInternal() }
  const chapters = db.chapters.filter(c => canReadChapter(actor, c))
  return { ...db, chapters, staff: db.staff.map(({ id, name, email, role, active }) => ({ id, name, email, role, active })), audit: db.audit.filter(e => ['admin', 'manager'].includes(actor.role) || e.actorId === actor.id || chapters.some(c => c.id === e.chapterId)) }
}
export function publicChapters(db) {
  return db.chapters.filter(c => c.publishedVersion).map(c => {
    const { number, title, summary, scenes, publishedAt } = c.versions.find(v => v.number === c.publishedVersion)
    return { id: c.id, number: c.number, version: { number, title, summary, scenes, publishedAt } }
  })
}
function contentFrom(payload) {
  const scenes = (payload.scenes || []).map(s => ({ id: text(s.id), speaker: text(s.speaker), text: text(s.text), minigame: s.minigame === 'chapter4' ? 'chapter4' : '', choices: (s.choices || []).map(c => ({ label: text(c.label), next: text(c.next) })) }))
  ensure(text(payload.title) && scenes.length > 0 && scenes.length <= 60, 'Cần tên chương và từ 1 đến 60 cảnh.')
  ensure(scenes.every(s => s.id && s.text && s.choices.length <= 4 && s.choices.every(c => c.label)), 'Mỗi cảnh cần nội dung; mỗi lựa chọn cần nhãn (tối đa 4 lựa chọn).')
  ensure(new Set(scenes.map(s => s.id)).size === scenes.length, 'Mã cảnh không được trùng.')
  ensure(scenes.every((s, i) => s.choices.every(c => !c.next || c.next === 'end' || scenes.slice(i + 1).some(next => next.id === c.next))), 'Lựa chọn phải dẫn tới cảnh phía sau hoặc kết thúc, không tạo vòng lặp.')
  return { title: text(payload.title), summary: text(payload.summary), scenes }
}
export function applyInternal(database, session, type, payload = {}, now = new Date().toISOString()) {
  const db = structuredClone(database)
  const actor = staffSession(db, session)
  ensure(actor, 'Phiên nội bộ đã hết hạn hoặc tài khoản bị khóa. Vui lòng đăng nhập lại.')
  const allowed = (...roles) => ensure(roles.includes(actor.role), 'Vai của bạn không được thực hiện thao tác này.')
  const log = (detail, chapterId = null) => db.audit.push({ id: uid(), type, actorId: actor.id, actorName: actor.name, actorRole: actor.role, chapterId, detail, at: now })
  const staffFor = (id, role) => db.staff.some(s => s.id === id && s.role === role && s.active)
  if (type === 'CREATE_STAFF') {
    allowed('manager')
    const email = text(payload.email).toLowerCase()
    ensure(['editor', 'reviewer'].includes(payload.role), 'Manager chỉ được cấp vai Editor hoặc Reviewer.')
    ensure(text(payload.name) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && payload.credential, 'Thông tin nhân sự chưa hợp lệ.')
    ensure(!db.staff.some(s => s.email === email), 'Email nội bộ đã tồn tại.')
    db.staff.push({ id: uid(), name: text(payload.name), email, role: payload.role, active: true, credential: payload.credential, authVersion: 1 })
    log(`Tạo ${STAFF_ROLES[payload.role]}: ${email}`)
  } else if (type === 'UPDATE_STAFF') {
    allowed('manager')
    const staff = db.staff.find(s => s.id === payload.id)
    ensure(staff && ['editor', 'reviewer'].includes(staff.role), 'Chỉ được quản lý Editor/Reviewer.')
    ensure(['editor', 'reviewer'].includes(payload.role) && typeof payload.active === 'boolean', 'Vai hoặc trạng thái không hợp lệ.')
    ensure(staff.role === payload.role || !db.chapters.some(c => c.editorId === staff.id || c.reviewerId === staff.id), 'Hãy phân công lại các chương trước khi đổi vai nhân sự này.')
    staff.role = payload.role; staff.active = payload.active; staff.authVersion += 1
    log(`${staff.email}: ${STAFF_ROLES[staff.role]} · ${staff.active ? 'Mở khóa' : 'Khóa'}`)
  } else if (type === 'CREATE_CHAPTER') {
    allowed('manager')
    ensure(Number.isInteger(payload.number) && payload.number >= 1 && payload.number <= 8, 'Chọn chương 1–8 theo bản đồ hiện tại.')
    ensure(!db.chapters.some(c => c.number === payload.number), 'Chương này đã có trong khu vực nội bộ.')
    ensure(text(payload.title), 'Nhập tên chương.')
    ensure(staffFor(payload.editorId, 'editor') && staffFor(payload.reviewerId, 'reviewer'), 'Chọn Editor và Reviewer đang hoạt động.')
    const chapter = { id: uid(), number: payload.number, editorId: payload.editorId, reviewerId: payload.reviewerId, revision: 1, publishedVersion: null, versions: [{ number: 1, title: text(payload.title), summary: '', scenes: [], status: 'draft', authorId: actor.id, createdAt: now, demoBy: [], review: null }] }
    db.chapters.push(chapter); log(`Tạo và phân công chương ${chapter.number}`, chapter.id)
  } else {
    const chapter = db.chapters.find(c => c.id === payload.chapterId)
    ensure(chapter && canReadChapter(actor, chapter), 'Không tìm thấy chương trong phạm vi của bạn.')
    ensure(chapter.revision === payload.revision, 'Chương vừa được cập nhật ở phiên khác. Tải lại trang trước khi thao tác.')
    const version = currentVersion(chapter)
    if (type === 'ASSIGN_CHAPTER') {
      allowed('manager')
      ensure(staffFor(payload.editorId, 'editor') && staffFor(payload.reviewerId, 'reviewer'), 'Chọn Editor và Reviewer đang hoạt động.')
      chapter.editorId = payload.editorId; chapter.reviewerId = payload.reviewerId
      log(`Phân công lại chương ${chapter.number}`, chapter.id)
    } else if (type === 'SAVE_DRAFT') {
      allowed('editor')
      ensure(chapter.editorId === actor.id && version.status !== 'pending', 'Không sửa được chương đang chờ duyệt.')
      const content = contentFrom(payload)
      ensure(chapter.number === 4 || !content.scenes.some(s => s.minigame), 'Mini game lịch học/ca làm chỉ dành cho chương 4.')
      chapter.versions.push({ ...content, number: version.number + 1, status: 'draft', authorId: actor.id, createdAt: now, demoBy: [], review: null })
      log(`Lưu bản nháp v${version.number + 1} · mọi thay đổi cần duyệt lại`, chapter.id)
    } else if (type === 'SUBMIT_REVIEW') {
      allowed('editor')
      ensure(chapter.editorId === actor.id && version.status === 'draft', 'Chỉ gửi bản nháp mới nhất đi duyệt.')
      contentFrom(version)
      ensure(staffFor(chapter.reviewerId, 'reviewer'), 'Reviewer đang bị khóa. Nhờ Manager phân công lại.')
      version.status = 'pending'; version.submittedAt = now
      log(`Gửi duyệt v${version.number}`, chapter.id)
    } else if (type === 'COMPLETE_DEMO') {
      allowed('editor', 'reviewer')
      ensure(payload.version === version.number && version.scenes.length, 'Bản demo đã thay đổi hoặc chưa có nội dung.')
      if (!version.demoBy.includes(actor.id)) version.demoBy.push(actor.id)
      log(`Chơi hết một nhánh demo v${version.number}`, chapter.id)
    } else if (type === 'REVIEW') {
      allowed('reviewer')
      ensure(chapter.reviewerId === actor.id && version.status === 'pending', 'Chỉ đánh giá chương được phân công đang chờ duyệt.')
      ensure(version.demoBy.includes(actor.id), 'Hãy chơi hết demo phiên bản này trước khi đánh giá.')
      ensure(['passed', 'failed'].includes(payload.decision) && text(payload.comment), 'Chọn Pass/Failed và nhập nhận xét.')
      version.status = payload.decision
      version.review = { reviewerId: actor.id, reviewerName: actor.name, decision: payload.decision, comment: text(payload.comment), at: now, version: version.number }
      log(`${STATUS_LABELS[payload.decision]} v${version.number}: ${text(payload.comment)}`, chapter.id)
    } else if (type === 'PUBLISH') {
      allowed('manager')
      ensure(version.status === 'passed' && version.review?.decision === 'passed' && version.review.version === version.number, 'Chỉ phát hành đúng phiên bản đã được Reviewer đánh giá Pass.')
      version.status = 'published'; version.publishedAt = now; chapter.publishedVersion = version.number
      log(`Phát hành v${version.number}`, chapter.id)
    } else throw new Error('Thao tác không được hỗ trợ.')
    chapter.revision += 1
  }
  return db
}
