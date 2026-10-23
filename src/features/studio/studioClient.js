// Studio nội bộ (bản DEMO 24/10 — Claude làm theo lời Hưng, team FE tối ưu / trang trí sau).
// Đăng nhập bằng cửa nội bộ POST /api/auth/internal/login (token 8 giờ, tách hẳn phiên khách hàng của workspace).
// Giữ được nhiều phiên cùng lúc để đổi vai nhanh khi thử luật bốn mắt (người sửa không tự duyệt / tự phát hành).
import { useSyncExternalStore } from 'react'
import { apiConfig } from '@/api/config'

const KEY = `finteen.studio.v1:${apiConfig.baseUrl}`

export class StudioError extends Error {
  constructor(message, code, status) {
    super(message)
    this.code = code
    this.status = status
  }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved?.sessions) return saved
  } catch {
    /* storage hỏng / bị chặn: bắt đầu trống */
  }
  return { sessions: [], active: 0 }
}

let state = load()
const listeners = new Set()

function commit(next) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* phiên vẫn sống trong bộ nhớ */
  }
  listeners.forEach((fn) => fn())
}

export function currentSession() {
  const s = state.sessions[state.active]
  return s && s.expiresAt > Date.now() ? s : null
}

export function hasRole(...roles) {
  return (currentSession()?.roles || []).some((r) => roles.includes(r))
}

/** Đọc id tài khoản từ token (claim sub) — để biết "nháp này do chính mình sửa". */
export function currentAccountId() {
  try {
    const part = currentSession().accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(part)).sub
  } catch {
    return null
  }
}

async function call(method, path, { body, form, token } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const auth = token ?? currentSession()?.accessToken
  if (auth) headers.Authorization = `Bearer ${auth}`
  let res
  try {
    res = await fetch(apiConfig.baseUrl + path, {
      method,
      headers,
      credentials: 'omit',
      body: form ?? (body === undefined ? undefined : JSON.stringify(body)),
    })
  } catch {
    throw new StudioError('Không kết nối được máy chủ.', null, 0)
  }
  const data = await res.json().catch(() => null)
  if (!res.ok || data?.code !== 0) {
    throw new StudioError(data?.message || `Máy chủ trả lỗi ${res.status}`, data?.code, res.status)
  }
  return data.result
}

export const studioApi = {
  get: (path) => call('GET', path),
  post: (path, body) => call('POST', path, { body }),
  put: (path, body) => call('PUT', path, { body }),
  del: (path) => call('DELETE', path),
  upload: (path, form) => call('POST', path, { form }),
}

export async function login(email, password) {
  const tok = await call('POST', '/api/auth/internal/login', { body: { email, password } })
  const me = await call('GET', '/api/auth/me', { token: tok.accessToken })
  const session = {
    email,
    name: me.displayName || email,
    roles: me.roles || [],
    accessToken: tok.accessToken,
    expiresAt: Date.now() + tok.expiresIn * 1000,
  }
  const sessions = state.sessions.filter((s) => s.email !== email && s.expiresAt > Date.now())
  sessions.push(session)
  commit({ sessions, active: sessions.length - 1 })
}

export function switchSession(index) {
  commit({ ...state, active: index })
}

export function logout() {
  const sessions = state.sessions.filter((_, i) => i !== state.active)
  commit({ sessions, active: 0 })
}

/** Hook: re-render khi đăng nhập / đổi vai / đăng xuất. */
export function useStudioSession() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => state,
  )
}

export const STATUS_LABEL = {
  DRAFT: 'Nháp',
  SUBMITTED: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Trả về',
  RELEASED: 'Đã phát hành',
}

export const fmtTime = (t) => (t ? new Date(t).toLocaleString('vi-VN') : '')
