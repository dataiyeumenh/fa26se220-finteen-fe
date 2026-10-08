// ACCOUNT endpoints and ApiResponse handling. No SLOT tokens or demo data.
export class ApiError extends Error {
  constructor(message, code, status) { super(message); this.code = code; this.status = status }
}

export function createAuthClient({ baseUrl, storage, contextStorage = storage, fetcher = (...args) => fetch(...args), now = Date.now }) {
  const key = `finteen.account.v1:${baseUrl}`
  const slotKey = `finteen.slot.v1:${baseUrl}`
  const contextKey = `finteen.account.context.v1:${baseUrl}`
  let saved, savedSlot
  try { saved = JSON.parse(storage.getItem(key)) } catch { /* Invalid or unavailable storage. */ }
  try { savedSlot = JSON.parse(storage.getItem(slotKey)) } catch { /* Invalid or unavailable storage. */ }
  let session = saved?.type === 'ACCOUNT' && saved.expiresAt > now() ? saved : null
  let slotSession = savedSlot?.type === 'SLOT' && savedSlot.expiresAt > now() ? savedSlot : null
  const slotActor = () => {
    if (!slotSession) return null
    const classroom = slotSession.slot?.groupContext === 'CLASS'
    const name = slotSession.slot?.displayName || 'Bạn nhỏ'
    return { ...slotSession.slot, id: slotSession.slot?.id || slotSession.code, name, displayName: name, code: slotSession.code, kind: 'learner', role: 'kid', learnerRole: classroom ? 'student' : 'child', plan: classroom ? 'teacher' : 'parent', plans: [classroom ? 'teacher' : 'parent'], roles: ['CHILD'], source: 'api' }
  }
  let state = { actor: slotActor(), entitlements: null, entitlementsLoading: false, loading: !slotSession && Boolean(session), error: '' }
  let entitlementsRequest = null
  let revision = 0
  const listeners = new Set()
  const publish = value => { state = { ...state, ...value }; listeners.forEach(fn => fn()) }
  const persist = () => { try { storage.setItem(key, JSON.stringify(session)) } catch { /* In-memory session still works. */ } }
  const persistSlot = () => { try { storage.setItem(slotKey, JSON.stringify(slotSession)) } catch { /* In-memory session still works. */ } }
  if (saved && !session) persist()
  if (savedSlot && !slotSession) persistSlot()
  const logout = () => { revision++; session = null; slotSession = null; entitlementsRequest = null; persist(); persistSlot(); publish({ actor: null, entitlements: null, entitlementsLoading: false, loading: false, error: '' }) }
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
    slotSession = null
    persistSlot()
    persist()
  }
  async function refresh() {
    if (slotSession) { publish({ actor: slotActor(), loading: false, error: '' }); return }
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
  async function ensureEntitlements({ force = false } = {}) {
    if (!session) return []
    if (!force && Array.isArray(state.entitlements)) return state.entitlements
    if (entitlementsRequest) return entitlementsRequest
    publish({ entitlementsLoading: true })
    entitlementsRequest = request('/api/entitlements', { authenticated: true })
      .then(result => {
        const entitlements = Array.isArray(result) ? result : []
        publish({ entitlements, entitlementsLoading: false })
        return entitlements
      })
      .catch(error => { publish({ entitlementsLoading: false }); throw error })
      .finally(() => { entitlementsRequest = null })
    return entitlementsRequest
  }
  async function slotLogin(code, pin) {
    const normalizedCode = String(code || '').trim().toUpperCase()
    const result = await request('/api/slots/login', { body: { code: normalizedCode, pin } })
    if (!result?.accessToken || !(result.expiresIn > 0)) throw new ApiError('Máy chủ chưa trả phiên học sinh hợp lệ.')
    if (!result.slot?.id || !result.slot?.displayName || !['FAMILY', 'CLASS'].includes(result.slot?.groupContext)) throw new ApiError('Máy chủ chưa trả đầy đủ thông tin hồ sơ trẻ.')
    slotSession = { type: 'SLOT', code: normalizedCode, slot: result.slot, accessToken: result.accessToken, expiresAt: now() + result.expiresIn * 1000 }
    persistSlot()
    publish({ actor: slotActor(), loading: false, error: '' })
  }
  return {
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) }, getSnapshot: () => state,
    logout, refresh, ensureEntitlements, hasSession: () => Boolean(session || slotSession),
    checkExpiry: () => { if ((slotSession && slotSession.expiresAt <= now()) || (!slotSession && session && session.expiresAt <= now())) expired() },
    register: ({ email, password, displayName, phone }) => request('/api/auth/register', { body: { email: email.trim(), password, displayName: displayName.trim(), ...(phone?.trim() ? { phone: phone.trim() } : {}) } }),
    login: (email, password) => signIn('/api/auth/login', { email: email.trim(), password }),
    verify: (email, otp) => signIn('/api/auth/verify', { email: email.trim(), otp: otp.trim() }),
    async resetPassword(email, otp, newPassword) {
      await request('/api/auth/password/reset', { body: { email: email.trim(), otp: otp.trim(), newPassword } })
      logout()
    },
    googleLogin: idToken => signIn('/api/auth/login/google', { provider: 'GOOGLE', idToken }),
    slotLogin,
    listPlans: () => request('/api/plans'),
    createPayment: kind => request('/api/payments', { authenticated: true, body: { kind } }),
    listPayments: ({ page = 0, size = 20 } = {}) => request(`/api/payments?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`, { authenticated: true }),
    getPayment: orderCode => request(`/api/payments/${encodeURIComponent(orderCode)}`, { authenticated: true }),
    cancelPayment: (orderCode, reason = '') => request(`/api/payments/${encodeURIComponent(orderCode)}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`, {
      authenticated: true, method: 'POST',
    }),
    listGroups: () => request('/api/groups', { authenticated: true }),
    openGroup: (name, context) => request('/api/groups', { authenticated: true, body: { name: name.trim(), context } }),
    confirmConsent: groupId => request(`/api/groups/${encodeURIComponent(groupId)}/consent`, { authenticated: true, method: 'POST' }),
    closeGroup: groupId => request(`/api/groups/${encodeURIComponent(groupId)}/close`, { authenticated: true, method: 'POST' }),
    listGroupSlots: groupId => request(`/api/groups/${encodeURIComponent(groupId)}/slots`, { authenticated: true }),
    groupCapacity: groupId => request(`/api/groups/${encodeURIComponent(groupId)}/capacity`, { authenticated: true }),
    openSlot: ({ groupId, displayName, pin, badge }) => request('/api/slots', { authenticated: true, body: { groupId, displayName: displayName.trim(), pin, ...(badge ? { badge } : {}) } }),
    openSlots: (groupId, items) => request('/api/slots/bulk', { authenticated: true, body: { slots: items.map(item => ({ groupId, displayName: item.displayName.trim(), pin: item.pin })) } }),
    returnSlot: slotId => request(`/api/slots/${encodeURIComponent(slotId)}/return`, { authenticated: true, method: 'POST' }),
    wipeSlot: slotId => request(`/api/slots/${encodeURIComponent(slotId)}`, { authenticated: true, method: 'DELETE' }),
    changeSlotPin: (slotId, pin) => request(`/api/slots/${encodeURIComponent(slotId)}/pin`, { authenticated: true, body: { pin } }),
    setPlanPrice: (kind, price, months) => request(`/api/admin/plans/${encodeURIComponent(kind)}`, {
      authenticated: true, method: 'PUT', body: { price, months },
    }),
    listAdminTransactions: ({ status = '', page = 0, size = 20 } = {}) => {
      const query = new URLSearchParams({ page: String(page), size: String(size) })
      if (status) query.set('status', status)
      return request(`/api/admin/transactions?${query}`, { authenticated: true })
    },
    reconcileTransaction: orderCode => request(`/api/admin/transactions/${encodeURIComponent(orderCode)}/reconcile`, {
      authenticated: true, method: 'POST',
    }),
    grantEntitlement: ({ accountId, kind, months, reason }) => request('/api/entitlements/grant', {
      authenticated: true,
      body: { accountId: accountId.trim(), kind, months, reason: reason.trim() },
    }),
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
