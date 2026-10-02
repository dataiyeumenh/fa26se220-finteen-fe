import { applyInternal, emptyInternal, staffSession } from './model.js'
import { createCredential, verifyCredential } from './credentials.js'

export const INTERNAL_DB_KEY = 'finteen.internal.demo.v1'
export const INTERNAL_SESSION_KEY = 'finteen.internal.session.v1'
export const DEMO_PASSWORD = 'FinTeenDemo!2026'
export const DEMO_ACCOUNTS = [
  { id: 'staff-manager', name: 'Lan · Vận hành', email: 'manager@finteen.demo', role: 'manager' },
  { id: 'staff-editor', name: 'Minh Anh · Biên tập', email: 'editor@finteen.demo', role: 'editor' },
  { id: 'staff-reviewer', name: 'Hoàng · Kiểm duyệt', email: 'reviewer@finteen.demo', role: 'reviewer' },
  { id: 'staff-admin', name: 'An · Giám sát', email: 'admin@finteen.demo', role: 'admin' },
]
const read = (storage, key, fallback) => { try { return JSON.parse(storage.getItem(key)) || fallback } catch { return fallback } }
let snapshot = { db: read(localStorage, INTERNAL_DB_KEY, emptyInternal()), session: read(sessionStorage, INTERNAL_SESSION_KEY, null) }
const listeners = new Set()
const emit = () => listeners.forEach(fn => fn())
export const subscribeInternal = fn => { listeners.add(fn); return () => listeners.delete(fn) }
export const getInternalSnapshot = () => snapshot
function save(db) { localStorage.setItem(INTERNAL_DB_KEY, JSON.stringify(db)); snapshot = { ...snapshot, db }; emit() }
function setSession(session) { sessionStorage.setItem(INTERNAL_SESSION_KEY, JSON.stringify(session)); snapshot = { ...snapshot, session }; emit() }
window.addEventListener('storage', event => {
  if (event.key === INTERNAL_DB_KEY || event.key === null) { snapshot = { ...snapshot, db: read(localStorage, INTERNAL_DB_KEY, emptyInternal()) }; emit() }
})
let initializing
export function initializeInternal() {
  initializing ||= (async () => {
    if (read(localStorage, INTERNAL_DB_KEY, emptyInternal()).staff.length) return
    const credential = await createCredential(DEMO_PASSWORD)
    if (read(localStorage, INTERNAL_DB_KEY, emptyInternal()).staff.length) return
    const db = emptyInternal()
    db.staff = DEMO_ACCOUNTS.map(a => ({ ...a, credential, active: true, authVersion: 1 }))
    db.chapters = [{ id: 'demo-chapter-4', number: 4, editorId: 'staff-editor', reviewerId: 'staff-reviewer', revision: 1, publishedVersion: null, versions: [{ number: 1, title: 'Thời gian hay tiền bạc?', summary: 'Bản nháp demo chương 4 · Minh cân nhắc việc học và ca làm đầu tiên.', status: 'draft', authorId: 'staff-editor', createdAt: new Date().toISOString(), review: null, demoBy: [], scenes: [
      { id: 'intro', speaker: 'Minh', text: 'Ca làm đầu tiên trùng buổi ôn bài. Mình sẽ sắp xếp thế nào?', choices: [], minigame: '' },
      { id: 'decision', speaker: 'Minh', text: 'Cùng xem lời nhắn rồi chọn cách xử lý.', choices: [], minigame: 'chapter4' },
      { id: 'closing', speaker: 'Mai', text: 'Một công việc không chỉ có tiền công. Cậu đã cân nhắc cả thời gian học và cơ hội phía trước.', choices: [], minigame: '' },
    ] }] }]
    save(db)
  })().catch(error => { initializing = null; throw error })
  return initializing
}
export async function loginInternal({ email, password }) {
  await initializeInternal()
  const db = read(localStorage, INTERNAL_DB_KEY, emptyInternal())
  const staff = db.staff.find(s => s.email === email.trim().toLowerCase() && s.active)
  if (!staff || !await verifyCredential(password, staff.credential)) throw new Error('Email/mật khẩu không đúng hoặc tài khoản đã bị khóa.')
  const latest = read(localStorage, INTERNAL_DB_KEY, emptyInternal())
  const session = { id: staff.id, authVersion: staff.authVersion }
  if (!staffSession(latest, session)) throw new Error('Tài khoản vừa được cập nhật. Vui lòng đăng nhập lại.')
  snapshot = { ...snapshot, db: latest }; setSession(session)
}
export const logoutInternal = () => setSession(null)
export function dispatchInternal(type, payload) {
  const latest = read(localStorage, INTERNAL_DB_KEY, emptyInternal())
  const db = applyInternal(latest, snapshot.session, type, payload)
  save(db)
  return db
}
export async function createStaff({ name, email, role, password }) {
  return dispatchInternal('CREATE_STAFF', { name, email, role, credential: await createCredential(password) })
}
