import { applyAction, emptyDatabase, resolveSession } from './model.js'

const DB_KEY = 'finteen.workspace.demo.v1'
const SESSION_KEY = 'finteen.workspace.session.v1'
const listeners = new Set()
const read = (storage, key, fallback) => {
  try { return JSON.parse(storage.getItem(key)) || fallback } catch { return fallback }
}
let snapshot = { db: read(localStorage, DB_KEY, emptyDatabase()), session: read(sessionStorage, SESSION_KEY, null) }
const emit = () => listeners.forEach(fn => fn())
export const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn) }
export const getSnapshot = () => snapshot
function setSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  snapshot = { ...snapshot, session }; emit()
}
window.addEventListener('storage', event => {
  if (event.key === DB_KEY || event.key === null) {
    snapshot = { ...snapshot, db: read(localStorage, DB_KEY, emptyDatabase()) }; emit()
  }
})
export function dispatch(type, payload) {
  // Read immediately before each write so other open tabs are not overwritten by stale UI data.
  const current = read(localStorage, DB_KEY, emptyDatabase())
  const db = applyAction(current, snapshot.session, { type, payload })
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  snapshot = { ...snapshot, db }; emit()
  return db
}
const bytes = value => Uint8Array.from(atob(value), c => c.charCodeAt(0))
const base64 = value => btoa(String.fromCharCode(...new Uint8Array(value)))
async function hash(secret, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits'])
  return base64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256))
}
async function credential(secret) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return { salt: base64(salt), hash: await hash(secret, salt) }
}
export async function register({ name, email, password }) {
  if (password.length < 8) throw new Error('Mật khẩu cần ít nhất 8 ký tự.')
  const id = crypto.randomUUID()
  dispatch('REGISTER', { id, name, email, credential: await credential(password) })
  setSession({ kind: 'adult', id })
}
export async function login({ kind, identifier, secret }) {
  const db = read(localStorage, DB_KEY, emptyDatabase())
  const record = kind === 'adult'
    ? db.accounts.find(a => a.email === identifier.trim().toLowerCase())
    : db.learners.find(l => l.code === identifier.trim().toUpperCase() && l.status === 'active')
  if (!record?.credential || await hash(secret, bytes(record.credential.salt)) !== record.credential.hash) throw new Error('Thông tin đăng nhập không đúng hoặc tài khoản đã bị thu hồi.')
  const latest = read(localStorage, DB_KEY, emptyDatabase())
  const latestRecord = (kind === 'adult' ? latest.accounts : latest.learners).find(r => r.id === record.id)
  if (latestRecord?.credential?.hash !== record.credential.hash || (kind === 'learner' && latestRecord.authVersion !== record.authVersion)) throw new Error('Tài khoản vừa được cập nhật. Vui lòng đăng nhập lại.')
  snapshot = { ...snapshot, db: latest }
  const session = { kind, id: record.id, ...(kind === 'learner' ? { authVersion: record.authVersion } : {}) }
  if (!resolveSession(latest, session)) throw new Error('Tài khoản chưa được kích hoạt.')
  setSession(session)
}
export const logout = () => setSession(null)
export async function saveLearner({ slotId, learnerId, name, pin }) {
  if (!/^\d{4,6}$/.test(pin)) throw new Error('PIN cần 4–6 chữ số.')
  return dispatch(learnerId ? 'RESET_PIN' : 'ACTIVATE_SLOT', { slotId, learnerId, name, credential: await credential(pin) })
}
