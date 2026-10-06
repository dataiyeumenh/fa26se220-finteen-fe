import test from 'node:test'
import assert from 'node:assert/strict'
import { applyInternal, emptyInternal, currentVersion, publicChapters, staffSession, internalView } from '../src/features/internal/model.js'

const credential = { salt: 'demo', hash: 'demo' }
function setup() {
  const db = emptyInternal()
  db.staff = ['admin', 'manager', 'editor', 'reviewer'].map(role => ({ id: role, role, name: role, email: `${role}@test.dev`, active: true, authVersion: 1, credential }))
  return applyInternal(db, { id: 'manager', authVersion: 1 }, 'CREATE_CHAPTER', { number: 4, title: 'Story', editorId: 'editor', reviewerId: 'reviewer' })
}
const scenes = [{ id: 'a', speaker: 'Minh', text: 'Opening', choices: [{ label: 'Continue', next: 'b' }, { label: 'Finish', next: 'end' }], minigame: '' }, { id: 'b', speaker: 'Mai', text: 'Closing', choices: [], minigame: '' }]
function act(db, role, type, payload = {}) {
  const chapter = db.chapters[0]
  return applyInternal(db, { id: role, authVersion: 1 }, type, { chapterId: chapter.id, revision: chapter.revision, ...payload })
}
function ready(db) {
  db = act(db, 'editor', 'SAVE_DRAFT', { title: 'Ready story', summary: 'Summary', scenes })
  db = act(db, 'editor', 'SUBMIT_REVIEW')
  db = act(db, 'reviewer', 'COMPLETE_DEMO', { version: currentVersion(db.chapters[0]).number })
  return act(db, 'reviewer', 'REVIEW', { decision: 'passed', comment: 'Played and checked.' })
}

test('draft -> review -> pass -> publish uses immutable content versions; newer drafts do not replace live content', () => {
  let db = setup()
  assert.deepEqual(publicChapters(db), [])
  assert.throws(() => act(db, 'editor', 'SUBMIT_REVIEW'), /Cần tên chương/)
  db = ready(db)
  assert.equal(currentVersion(db.chapters[0]).status, 'passed')
  assert.deepEqual(publicChapters(db), [])
  db = act(db, 'manager', 'PUBLISH')
  const published = structuredClone(publicChapters(db)[0])
  const originalVersion = structuredClone(currentVersion(db.chapters[0]))
  assert.equal('review' in published.version, false)
  assert.equal('demoBy' in published.version, false)
  assert.equal(published.version.title, 'Ready story')
  assert.throws(() => act(db, 'manager', 'PUBLISH'))
  db = act(db, 'editor', 'SAVE_DRAFT', { title: 'New revision', scenes })
  assert.deepEqual(publicChapters(db)[0], published)
  assert.equal(currentVersion(db.chapters[0]).review, null)
  assert.deepEqual(currentVersion(db.chapters[0]).demoBy, [])
  assert.throws(() => act(db, 'manager', 'PUBLISH'))
  db = act(db, 'editor', 'SUBMIT_REVIEW')
  assert.throws(() => act(db, 'reviewer', 'REVIEW', { decision: 'passed', comment: 'Old demo cannot qualify.' }), /chơi hết demo/)
  db = act(db, 'reviewer', 'COMPLETE_DEMO', { version: currentVersion(db.chapters[0]).number })
  db = act(db, 'reviewer', 'REVIEW', { decision: 'passed', comment: 'New demo checked.' })
  db = act(db, 'manager', 'PUBLISH')
  assert.equal(publicChapters(db)[0].version.title, 'New revision')
  assert.deepEqual(db.chapters[0].versions.find(v => v.number === published.version.number), originalVersion)
})

test('failed revisions keep review history and require a new draft and demo before resubmission', () => {
  let db = setup()
  db = act(db, 'editor', 'SAVE_DRAFT', { title: 'First', scenes })
  db = act(db, 'editor', 'SUBMIT_REVIEW')
  assert.throws(() => act(db, 'editor', 'SAVE_DRAFT', { title: 'Changing pending', scenes }))
  assert.throws(() => act(db, 'reviewer', 'COMPLETE_DEMO', { version: 1 }))
  db = act(db, 'reviewer', 'COMPLETE_DEMO', { version: 2 })
  assert.throws(() => act(db, 'reviewer', 'REVIEW', { decision: 'failed', comment: '   ' }))
  db = act(db, 'reviewer', 'REVIEW', { decision: 'failed', comment: 'Explain the consequences.' })
  assert.throws(() => act(db, 'editor', 'SUBMIT_REVIEW'))
  assert.throws(() => act(db, 'manager', 'PUBLISH'))
  db = act(db, 'editor', 'SAVE_DRAFT', { title: 'Revised', scenes })
  assert.equal(db.chapters[0].versions[1].review.comment, 'Explain the consequences.')
  assert.equal(currentVersion(db.chapters[0]).status, 'draft')
  db = act(db, 'editor', 'SUBMIT_REVIEW')
  assert.throws(() => act(db, 'reviewer', 'REVIEW', { decision: 'passed', comment: 'No replay.' }))
})

test('Admin is read-only and each operational role is checked by the model', () => {
  const db = ready(setup())
  const actions = ['CREATE_STAFF', 'UPDATE_STAFF', 'CREATE_CHAPTER', 'ASSIGN_CHAPTER', 'SAVE_DRAFT', 'SUBMIT_REVIEW', 'COMPLETE_DEMO', 'REVIEW', 'PUBLISH']
  for (const type of actions) assert.throws(() => act(db, 'admin', type))
  for (const role of ['editor', 'reviewer']) {
    assert.throws(() => act(db, role, 'PUBLISH'))
    assert.throws(() => act(db, role, 'CREATE_STAFF', { name: 'N', email: 'n@test.dev', role: 'editor', credential }))
    assert.throws(() => act(db, role, 'ASSIGN_CHAPTER', { editorId: 'editor', reviewerId: 'reviewer' }))
  }
  for (const role of ['editor', 'manager']) assert.throws(() => act(db, role, 'REVIEW', { decision: 'passed', comment: 'Cannot review.' }))
  assert.throws(() => act(db, 'manager', 'SAVE_DRAFT', { title: 'No', scenes }))
  assert.throws(() => applyInternal(db, null, 'PUBLISH'))
})

test('Manager can create only Editor/Reviewer, lock sessions and reassign chapters', () => {
  let db = setup()
  for (const role of ['admin', 'manager', 'invented']) assert.throws(() => act(db, 'manager', 'CREATE_STAFF', { name: 'N', email: 'n@test.dev', role, credential }))
  db = act(db, 'manager', 'CREATE_STAFF', { name: 'Editor 2', email: 'e2@test.dev', role: 'editor', credential })
  const other = db.staff.at(-1)
  assert.throws(() => act(db, 'manager', 'CREATE_STAFF', { name: 'Dup', email: 'E2@TEST.DEV', role: 'editor', credential }))
  assert.throws(() => act(db, 'manager', 'UPDATE_STAFF', { id: 'admin', role: 'editor', active: false }))
  assert.throws(() => act(db, 'manager', 'UPDATE_STAFF', { id: 'editor', role: 'reviewer', active: true }), /phân công lại/)
  db = act(db, 'manager', 'ASSIGN_CHAPTER', { editorId: other.id, reviewerId: 'reviewer' })
  assert.equal(internalView(db, staffSession(db, { id: 'editor', authVersion: 1 })).chapters.length, 0)
  assert.throws(() => act(db, 'editor', 'SAVE_DRAFT', { title: 'Foreign', scenes }))
  db = act(db, 'manager', 'UPDATE_STAFF', { id: 'editor', role: 'reviewer', active: false })
  assert.equal(staffSession(db, { id: 'editor', authVersion: 1 }), null)
  db = act(db, 'manager', 'UPDATE_STAFF', { id: 'editor', role: 'reviewer', active: true })
  assert.equal(staffSession(db, { id: 'editor', authVersion: 1 }), null)
  assert.equal(staffSession(db, { id: 'editor', authVersion: 3 }).role, 'reviewer')
  assert.equal(JSON.stringify(internalView(db, staffSession(db, { id: 'admin', authVersion: 1 }))).includes('credential'), false)
})

test('stale tabs cannot save, review or publish over newer state', () => {
  let db = setup()
  const revision = db.chapters[0].revision
  db = act(db, 'editor', 'SAVE_DRAFT', { title: 'New', scenes })
  assert.throws(() => act(db, 'editor', 'SAVE_DRAFT', { revision, title: 'Stale', scenes }), /phiên khác/)
  db = ready(db)
  assert.throws(() => act(db, 'manager', 'PUBLISH', { revision }), /phiên khác/)
})

test('scene validation rejects empty scripts, duplicate ids, loops and unsupported mini game placement', () => {
  const db = setup()
  for (const invalid of [[], [{ ...scenes[0], text: '' }], [scenes[0], scenes[0]], [{ ...scenes[0], choices: [{ label: 'Loop', next: 'a' }] }], [{ ...scenes[0], choices: [{ label: '', next: 'end' }] }]]) {
    assert.throws(() => act(db, 'editor', 'SAVE_DRAFT', { title: 'Invalid', scenes: invalid }))
  }
  const other = act(db, 'manager', 'CREATE_CHAPTER', { number: 3, title: 'Chapter 3', editorId: 'editor', reviewerId: 'reviewer' })
  const c = other.chapters[1]
  assert.throws(() => act(other, 'editor', 'SAVE_DRAFT', { chapterId: c.id, revision: c.revision, title: 'Wrong mini game', scenes: [{ ...scenes[1], minigame: 'chapter4' }] }))
  assert.throws(() => act(db, 'manager', 'CREATE_CHAPTER', { number: 4, title: 'Duplicate', editorId: 'editor', reviewerId: 'reviewer' }))
})
