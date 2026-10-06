import test from 'node:test'
import assert from 'node:assert/strict'
import { emptyDatabase, applyAction, resolveSession, canAccessChapter, workspaceDatabase, PLANS } from '../src/features/workspace/model.js'
import { reportRows, reportCsv, csvCell } from '../src/features/workspace/reporting.js'

const credential = { salt: 'test-salt', hash: 'test-hash' }
function setup(plan = null, name = 'owner') {
  let db = applyAction(emptyDatabase(), null, { type: 'REGISTER', payload: { id: name, name, email: `${name}@example.com`, credential } })
  const session = { kind: 'adult', id: name }
  if (plan) db = applyAction(db, session, { type: 'ACTIVATE_DEMO_PLAN', payload: { plan } })
  return { db, session }
}
const action = (db, session, type, payload = {}) => applyAction(db, session, { type, payload })
function activate(db, session, slotId = db.slots.find(s => !s.learnerId && s.ownerId === session.id).id) {
  return action(db, session, 'ACTIVATE_SLOT', { slotId, name: 'Học sinh', credential })
}
const q1 = { text: 'Nhu cầu thiết yếu?', options: ['Gạo', 'Game', 'Kẹo', 'Đồ chơi'], correct: 0 }

for (const first of ['parent', 'teacher']) test(`legacy ${first} data stays separate after buying both plans`, () => {
  let { db, session } = setup(first)
  db = activate(db, session)
  const original = db.learners[0]
  // Simulate v1 records saved before multi-role support.
  delete db.accounts[0].plans
  db.slots.forEach(s => { delete s.plan })
  delete original.plan
  const second = first === 'parent' ? 'teacher' : 'parent'
  assert.equal(resolveSession(db, { ...session, role: second }), null)
  db = action(db, session, 'ACTIVATE_DEMO_PLAN', { plan: second })
  const sessions = { parent: { ...session, role: 'parent' }, teacher: { ...session, role: 'teacher' } }
  const secondSlot = db.slots.find(s => s.plan === second)
  db = activate(db, sessions[second], secondSlot.id)
  const child = db.learners.find(l => (l.plan || first) === 'parent')
  const student = db.learners.find(l => (l.plan || first) === 'teacher')
  for (const role of ['parent', 'teacher']) {
    const actor = resolveSession(db, sessions[role])
    assert.equal(actor.role, role)
    assert.equal(actor.plan, role)
    assert.equal(actor.plans.length, 2)
    const scoped = workspaceDatabase(db, actor)
    assert.equal(scoped.slots.length, PLANS[role].capacity)
    assert.equal(scoped.learners.length, 1)
    const foreign = role === 'parent' ? student : child
    assert.equal(scoped.learners.some(l => l.id === foreign.id), false)
    assert.throws(() => action(db, sessions[role], 'RESET_PIN', { learnerId: foreign.id, credential }))
    assert.throws(() => action(db, sessions[role], 'REVOKE_LEARNER', { learnerId: foreign.id }))
    const foreignSlot = db.slots.find(s => !s.learnerId && (s.plan || first) !== role)
    assert.throws(() => activate(db, sessions[role], foreignSlot.id))
    assert.throws(() => action(db, sessions[role], 'ACTIVATE_DEMO_PLAN', { plan: role }))
  }
  const childSession = { kind: 'learner', id: child.id, authVersion: 1 }
  const studentSession = { kind: 'learner', id: student.id, authVersion: 1 }
  assert.equal(resolveSession(db, childSession).learnerRole, 'child')
  assert.equal(resolveSession(db, studentSession).learnerRole, 'student')
  assert.throws(() => action(db, sessions.parent, 'SAVE_QUIZ', { title: 'No', questions: [q1] }))
  assert.throws(() => action(db, sessions.teacher, 'SAVE_GROUP', { name: 'Mixed', learnerIds: [child.id, student.id] }))
  db = action(db, sessions.teacher, 'SAVE_GROUP', { name: 'Class', learnerIds: [student.id] })
  db = action(db, sessions.teacher, 'SAVE_QUIZ', { title: 'Class quiz', questions: [q1] })
  const quizId = db.quizzes[0].id
  assert.throws(() => action(db, sessions.teacher, 'ASSIGN_QUIZ', { quizId, learnerIds: [child.id] }))
  db = action(db, sessions.teacher, 'ASSIGN_QUIZ', { quizId, learnerIds: [student.id] })
  const assignmentId = db.assignments[0].id
  assert.throws(() => action(db, childSession, 'SUBMIT_QUIZ', { assignmentId, answers: [0] }))
  db = action(db, studentSession, 'SUBMIT_QUIZ', { assignmentId, answers: [0] })
  const parentDb = workspaceDatabase(db, resolveSession(db, sessions.parent))
  assert.equal(parentDb.quizzes.length, 0)
  assert.equal(parentDb.assignments.length, 0)
  assert.equal(parentDb.groups.length, 0)
  assert.equal(parentDb.submissions.length, 0)
  assert.equal(parentDb.events.some(e => e.learnerId === student.id), false)
  assert.equal(reportRows(parentDb, session.id, { learnerId: student.id }).length, 0)
  const teacherDb = workspaceDatabase(db, resolveSession(db, sessions.teacher))
  assert.equal(reportRows(teacherDb, session.id)[0].quizSubmitted, 1)
  assert.equal(reportRows(teacherDb, session.id, { learnerId: child.id }).length, 0)
  db = action(db, sessions.teacher, 'REVOKE_LEARNER', { learnerId: student.id })
  assert.ok(resolveSession(db, childSession))
  assert.equal(resolveSession(db, studentSession), null)
})
test('new adults are Guest; current main demo allows chapters 1 and 2 without a plan', () => {
  const { db, session } = setup()
  const guest = resolveSession(db, session)
  assert.equal(guest.role, 'guest')
  assert.equal(canAccessChapter(guest, 1), true)
  assert.equal(canAccessChapter(guest, 2), true)
  for (const chapter of [0, 3, 8, 9, 1.5, NaN]) assert.equal(canAccessChapter(guest, chapter), false)
  assert.equal(canAccessChapter(null, 1), false)
  assert.throws(() => action(db, session, 'ACTIVATE_SLOT', {}))
  assert.throws(() => action(db, null, 'ACTIVATE_DEMO_PLAN', { plan: 'parent' }))
})
for (const plan of ['parent', 'teacher']) test(`${plan} purchase allocates exactly ${PLANS[plan].capacity} inactive slots once, with permanent inheritance`, () => {
  let { db, session } = setup(plan)
  assert.equal(db.slots.length, PLANS[plan].capacity)
  assert.ok(db.slots.every(s => s.learnerId === null))
  for (let i = 1; i <= 8; i++) assert.equal(canAccessChapter(resolveSession(db, session), i), false)
  assert.throws(() => action(db, session, 'ACTIVATE_DEMO_PLAN', { plan }))
  db = action(db, session, 'ACTIVATE_DEMO_PLAN', { plan: plan === 'parent' ? 'teacher' : 'parent' })
  assert.equal(db.slots.length, 44)
  db = activate(db, session)
  const l = db.learners[0]
  const child = resolveSession(db, { kind: 'learner', id: l.id, authVersion: 1 })
  assert.equal(child.plan, plan)
  assert.equal(child.role, 'kid')
  for (let i = 1; i <= 8; i++) assert.equal(canAccessChapter(child, i), true)
  assert.throws(() => activate(db, session, db.slots[0].id))
  assert.equal(resolveSession(db, { kind: 'learner', id: l.id, authVersion: 0 }), null)
  assert.equal(resolveSession(db, { kind: 'invented', id: l.id, authVersion: 1 }), null)
})
test('PIN reset invalidates existing learner sessions; revocation preserves history and reactivation makes a new identity', () => {
  let { db, session } = setup('teacher')
  db = activate(db, session)
  const old = db.learners[0]
  const childSession = { kind: 'learner', id: old.id, authVersion: 1 }
  db = action(db, session, 'SAVE_GROUP', { name: 'Lớp A', learnerIds: [old.id] })
  db = action(db, session, 'RESET_PIN', { learnerId: old.id, credential: { ...credential, hash: 'new' } })
  assert.equal(resolveSession(db, childSession), null)
  assert.ok(resolveSession(db, { ...childSession, authVersion: 2 }))
  db = action(db, session, 'REVOKE_LEARNER', { learnerId: old.id })
  assert.equal(resolveSession(db, { ...childSession, authVersion: 2 }), null)
  assert.equal(db.slots[0].learnerId, null)
  assert.equal(db.learners[0].credential, null)
  assert.equal(db.groups[0].learnerIds.length, 0)
  db = activate(db, session, old.slotId)
  assert.equal(db.learners.length, 2)
  assert.notEqual(db.learners[1].id, old.id)
  assert.notEqual(db.learners[1].code, old.code)
  assert.deepEqual(db.learners[1].progress, [])
  assert.equal(db.slots.length, 40)
  assert.equal(db.learners[0].status, 'revoked')
  assert.ok(db.events.some(e => e.type === 'learner_revoked' && e.learnerId === old.id))
})
test('owners cannot reset, revoke, activate or group another owner’s learners', () => {
  let { db, session } = setup('teacher')
  db = activate(db, session)
  db = action(db, null, 'REGISTER', { id: 'other', name: 'Other', email: 'other@example.com', credential })
  const other = { kind: 'adult', id: 'other' }
  db = action(db, other, 'ACTIVATE_DEMO_PLAN', { plan: 'teacher' })
  for (const type of ['RESET_PIN','REVOKE_LEARNER']) assert.throws(() => action(db, other, type, { learnerId: db.learners[0].id, credential }))
  assert.throws(() => activate(db, other, db.slots[1].id))
  assert.throws(() => action(db, other, 'SAVE_GROUP', { name: 'Bad group', learnerIds: [db.learners[0].id] }))
  assert.deepEqual(reportRows(db, 'other'), [])
  const parent = setup('parent')
  assert.throws(() => action(parent.db, parent.session, 'SAVE_GROUP', { name: 'No' }))
  assert.throws(() => action(parent.db, parent.session, 'SAVE_QUIZ', { title: 'No', questions: [q1] }))
})
test('quiz assignments snapshot questions and learners; submissions and archive exports remain correct', () => {
  let { db, session } = setup('teacher')
  db = activate(db, session); db = activate(db, session)
  const [a, b] = db.learners
  db = action(db, session, 'SAVE_GROUP', { name: 'Team', learnerIds: [a.id] })
  db = action(db, session, 'SAVE_QUIZ', { title: 'Quiz 1', questions: [q1] })
  const quiz = db.quizzes[0]
  db = action(db, session, 'ASSIGN_QUIZ', { quizId: quiz.id, groupIds: [db.groups[0].id], learnerIds: [a.id] })
  const assignment = db.assignments[0]
  assert.deepEqual(assignment.learnerIds, [a.id])
  db = action(db, session, 'SAVE_QUIZ', { id: quiz.id, title: 'Edited', questions: [{ ...q1, correct: 2 }] })
  db = action(db, session, 'SAVE_GROUP', { id: db.groups[0].id, name: 'Team', learnerIds: [b.id] })
  assert.equal(db.assignments[0].questions[0].correct, 0)
  assert.deepEqual(db.assignments[0].learnerIds, [a.id])
  const s = { kind: 'learner', id: a.id, authVersion: 1 }
  assert.throws(() => action(db, s, 'SUBMIT_QUIZ', { assignmentId: assignment.id, answers: [] }))
  assert.throws(() => action(db, { ...s, id: b.id }, 'SUBMIT_QUIZ', { assignmentId: assignment.id, answers: [0] }))
  db = applyAction(db, s, { type: 'SUBMIT_QUIZ', payload: { assignmentId: assignment.id, answers: [0] } }, '2026-09-21T10:00:00.000Z')
  assert.equal(db.submissions[0].correct, 1)
  assert.throws(() => action(db, s, 'SUBMIT_QUIZ', { assignmentId: assignment.id, answers: [0] }))
  db = action(db, session, 'REVOKE_LEARNER', { learnerId: a.id })
  const rows = reportRows(db, session.id, { status: 'revoked', from: '2026-09-21', to: '2026-09-21' })
  assert.equal(rows.length, 1); assert.equal(rows[0].averagePercent, 100)
  assert.equal(reportRows(db, session.id, { learnerId: a.id, from: '2027-01-01' })[0].quizSubmitted, 0)
  assert.equal(JSON.stringify(rows).includes('credential'), false)
  assert.equal(reportCsv(rows).includes('Quiz 1'), true)
  db = activate(db, session, a.slotId)
  assert.equal(reportRows(db, session.id, { learnerId: db.learners[2].id })[0].quizSubmitted, 0)
})
test('invalid quiz and foreign assignments cannot be submitted or assigned', () => {
  let { db, session } = setup('teacher')
  assert.throws(() => action(db, session, 'SAVE_QUIZ', { title: 'Q', questions: [{ ...q1, correct: 4 }] }))
  db = action(db, session, 'SAVE_QUIZ', { title: 'Q', questions: [q1] })
  assert.throws(() => action(db, session, 'ASSIGN_QUIZ', { quizId: db.quizzes[0].id, learnerIds: [] }))
  assert.throws(() => action(db, session, 'ASSIGN_QUIZ', { quizId: db.quizzes[0].id, groupIds: ['foreign'] }))
})
test('CSV handles quotes, line breaks, unicode, and formula injection', () => {
  assert.equal(csvCell('a,"b"\nc'), '"a,""b""\nc"')
  assert.equal(csvCell(' =1+1'), '"\' =1+1"')
  assert.equal(csvCell('@SUM(A1)'), '"\'@SUM(A1)"')
  assert.ok(reportCsv([]).startsWith('\uFEFF'))
})
