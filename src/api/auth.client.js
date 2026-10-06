// ACCOUNT endpoints and ApiResponse handling. No SLOT tokens or demo data.
export class ApiError extends Error {
  constructor(message, code, status) { super(message); this.code = code; this.status = status }
}

export function createAuthClient({ baseUrl, storage, contextStorage = storage, fetcher = (...args) => fetch(...args), now = Date.now }) {
  const key = `finteen.account.v1:${baseUrl}`
  const contextKey = `finteen.account.context.v1:${baseUrl}`
  let saved
  try { saved = JSON.parse(storage.getItem(key)) } catch { /* Invalid or unavailable storage. */ }
  let session = saved?.type === 'ACCOUNT' && saved.expiresAt > now() ? saved : null
  let state = { actor: null, loading: Boolean(session), error: '' }
  let revision = 0
  const listeners = new Set()
  const publish = value => { state = { ...state, ...value }; listeners.forEach(fn => fn()) }
  const persist = () => { try { storage.setItem(key, JSON.stringify(session)) } catch { /* In-memory session still works. */ } }
  if (saved && !session) persist()
  const logout = () => { revision++; session = null; persist(); publish({ actor: null, loading: false, error: '' }) }
  const expired = () => { logout(); publish({ error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' }) }
  async function request(path, { body, method = body === undefined ? 'GET' : 'POST', authenticated = false } = {}) {
    const token = session?.accessToken
    if (authenticated && (!token || session.expiresAt <= now())) { expired(); throw new ApiError('Vui lòng đăng nhập lại.', 3003, 401) }
    let response
    try {
      response = await fetcher(`${baseUrl.replace(/\/$/, '')}${path}`, {
        method, credentials: 'omit', signal: AbortSignal.timeout(20000),
        headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(authenticated ? { Authorization: `Bearer ${token}` } : {}) },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      })
    } catch { throw new ApiError('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.', null, 0) }
    let data
    try { data = await response.json() } catch { throw new ApiError('Máy chủ trả dữ liệu không hợp lệ. Vui lòng thử lại.', null, response.status) }
    if (!response.ok || data?.code !== 0) {
      if (authenticated && data?.code === 3003 && session?.accessToken === token) expired()
      throw new ApiError(data?.message || 'Yêu cầu không thành công.', data?.code, response.status)
    }
    return data.result
  }
  function preferredContext() {
    try { return contextStorage.getItem(contextKey) } catch { return null }
  }
  function persistContext(context) {
    try { contextStorage.setItem(contextKey, context || '') } catch { /* Context remains in memory. */ }
  }
  function storeToken(result) {
    if (!result?.accessToken || !(result.expiresIn > 0)) throw new ApiError('Máy chủ chưa trả phiên đăng nhập hợp lệ.')
    session = { type: 'ACCOUNT', accessToken: result.accessToken, expiresAt: now() + result.expiresIn * 1000 }
    persist()
  }
  async function refresh() {
    if (!session) return
    const token = session.accessToken
    publish({ loading: !state.actor, error: '' })
    try {
      const account = await request('/api/auth/me', { authenticated: true })
      if (session?.accessToken !== token) return
      if (!account?.id || !Array.isArray(account.plans) || !Array.isArray(account.roles)) throw new Error('Thông tin tài khoản không hợp lệ.')
      const plans = account.plans.map(p => ({ PARENT: 'parent', TEACHER: 'teacher' })[p]).filter(Boolean)
      const savedContext = preferredContext()
      const role = plans.includes(savedContext) ? savedContext : plans[0] || 'guest'
      persistContext(role === 'guest' ? null : role)
      publish({ actor: { ...account, name: account.displayName, kind: 'adult', source: 'api', plans, role, plan: role === 'guest' ? null : role }, loading: false })
    } catch (error) {
      if (session?.accessToken === token) publish({ actor: null, loading: false, error: error.message })
      throw error
    }
  }
  async function signIn(path, body) {
    const version = ++revision
    const result = await request(path, { body })
    if (version !== revision) return
    storeToken(result)
    await refresh()
  }
  return {
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) }, getSnapshot: () => state,
    logout, refresh, hasSession: () => Boolean(session),
    checkExpiry: () => { if (session && session.expiresAt <= now()) expired() },
    register: ({ email, password, displayName, phone }) => request('/api/auth/register', { body: { email: email.trim(), password, displayName: displayName.trim(), ...(phone?.trim() ? { phone: phone.trim() } : {}) } }),
    login: (email, password) => signIn('/api/auth/login', { email: email.trim(), password }),
    verify: (email, otp) => signIn('/api/auth/verify', { email: email.trim(), otp: otp.trim() }),
    async resetPassword(email, otp, newPassword) {
      await request('/api/auth/password/reset', { body: { email: email.trim(), otp: otp.trim(), newPassword } })
      logout()
    },
    googleLogin: idToken => signIn('/api/auth/login/google', { provider: 'GOOGLE', idToken }),
    setContext(context) {
      if (!['parent', 'teacher'].includes(context) || !state.actor?.plans.includes(context)) {
        throw new ApiError('Tài khoản không có quyền sử dụng phạm vi này.', 3004, 403)
      }
      persistContext(context)
      publish({ actor: { ...state.actor, role: context, plan: context } })
    },
    linkGoogle: idToken => request('/api/auth/link/google', { authenticated: true, body: { provider: 'GOOGLE', idToken } }),
    resend: email => request(`/api/auth/verify/resend?email=${encodeURIComponent(email.trim())}`, { method: 'POST' }),
    forgot: email => request('/api/auth/password/forgot', { body: { email: email.trim() } }),
    async changePassword(oldPassword, newPassword) {
      const token = session?.accessToken
      const result = await request('/api/auth/password/change', { authenticated: true, body: { oldPassword, newPassword } })
      if (session?.accessToken !== token) return
      storeToken(result)
      await refresh()
    },
  }
}
