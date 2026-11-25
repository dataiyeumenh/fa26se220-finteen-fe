// ACCOUNT/SLOT session lifecycle and ApiResponse handling.
import { vietnameseApiMessage } from "../lib/vietnameseMessages.js";
import { loginErrorMessage } from "../lib/authMessages.js";

const LOGIN_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/internal/login",
  "/api/auth/login/google",
  "/api/slots/login",
]);

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function createAuthClient({
  baseUrl,
  storage,
  slotStorage = storage,
  contextStorage = storage,
  sharedStorage = null,
  beforeSlotSignOut = async () => {},
  clearSlotData = () => {},
  fetcher = (...args) => fetch(...args),
  now = Date.now,
}) {
  const key = `finteen.account.v1:${baseUrl}`;
  const slotKey = `finteen.slot.v1:${baseUrl}`;
  const contextKey = `finteen.account.context.v1:${baseUrl}`;
  const browserKey = `finteen.session.v1:${baseUrl}`;
  let lastBrowserRecord;
  let saved, savedSlot;
  try {
    saved = JSON.parse(storage.getItem(key));
  } catch {
    /* Invalid or unavailable storage. */
  }
  try {
    savedSlot = JSON.parse(slotStorage.getItem(slotKey));
  } catch {
    /* Invalid or unavailable storage. */
  }
  if (sharedStorage) {
    try {
      lastBrowserRecord = sharedStorage.getItem(browserKey);
      if (lastBrowserRecord != null) {
        const browserSession = JSON.parse(lastBrowserRecord);
        saved = browserSession?.type === "ACCOUNT" ? browserSession : null;
        savedSlot = browserSession?.type === "SLOT" ? browserSession : null;
      }
    } catch {
      saved = null;
      savedSlot = null;
    }
  }
  let session =
    saved?.type === "ACCOUNT" && saved.expiresAt > now() ? saved : null;
  let slotSession =
    savedSlot?.type === "SLOT" && savedSlot.expiresAt > now()
      ? savedSlot
      : null;
  // Older builds could persist both tokens. A restored SLOT must never reveal ACCOUNT.
  if (savedSlot?.type === "SLOT") session = null;
  const slotActor = () => {
    if (!slotSession) return null;
    const classroom = slotSession.slot?.groupContext === "CLASS";
    const name = slotSession.slot?.displayName || "Bạn nhỏ";
    return {
      ...slotSession.slot,
      id: slotSession.slot?.id || slotSession.code,
      name,
      displayName: name,
      code: slotSession.code,
      kind: "learner",
      role: "kid",
      learnerRole: classroom ? "student" : "child",
      plan: classroom ? "teacher" : "parent",
      plans: [classroom ? "teacher" : "parent"],
      roles: ["CHILD"],
      source: "api",
    };
  };
  let state = {
    actor: slotActor(),
    entitlements: null,
    entitlementsLoading: false,
    learnerDashboard: null,
    learnerDashboardLoading: false,
    learnerDashboardError: "",
    loading: !slotSession && Boolean(session),
    error: "",
  };
  let entitlementsRequest = null;
  let learnerDashboardRequest = null;
  let profileRequest = null;
  let revision = 0;
  const listeners = new Set();
  const publish = (value) => {
    state = { ...state, ...value };
    listeners.forEach((fn) => fn());
  };
  const persist = () => {
    try {
      storage.setItem(key, JSON.stringify(session));
    } catch {
      /* In-memory session still works. */
    }
  };
  const persistSlot = () => {
    try {
      slotStorage.setItem(slotKey, JSON.stringify(slotSession));
    } catch {
      /* In-memory session still works. */
    }
  };
  const persistBrowserSession = () => {
    if (!sharedStorage) return;
    try {
      const record = JSON.stringify(slotSession || session);
      sharedStorage.setItem(browserKey, record);
      lastBrowserRecord = record;
    } catch {
      /* In-memory authentication remains usable if browser storage is blocked. */
    }
  };
  // Remove SLOT tokens persisted by older builds after SLOT storage moved to sessionStorage.
  if (slotStorage !== storage) {
    try {
      storage.setItem(slotKey, JSON.stringify(null));
    } catch {
      /* The current session still uses slotStorage. */
    }
  }
  if (saved && !session) persist();
  if (savedSlot && !slotSession) persistSlot();
  if (sharedStorage && lastBrowserRecord != null) {
    persist();
    persistSlot();
  }
  if (sharedStorage && lastBrowserRecord == null) persistBrowserSession();
  const logout = (share = true) => {
    revision++;
    session = null;
    slotSession = null;
    entitlementsRequest = null;
    learnerDashboardRequest = null;
    profileRequest = null;
    persist();
    persistSlot();
    if (share) persistBrowserSession();
    publish({
      actor: null,
      entitlements: null,
      entitlementsLoading: false,
      learnerDashboard: null,
      learnerDashboardLoading: false,
      learnerDashboardError: "",
      loading: false,
      error: "",
    });
  };
  const logoutSlot = (message) => {
    revision++;
    slotSession = null;
    learnerDashboardRequest = null;
    persistSlot();
    persistBrowserSession();
    publish({
      actor: null,
      learnerDashboard: null,
      learnerDashboardLoading: false,
      learnerDashboardError: "",
      loading: false,
      error: message || "",
    });
  };
  const signOut = async () => {
    if (syncBrowserSession()) return;
    const activeSlot = slotSession;
    const version = revision;
    try {
      if (slotSession) {
        try {
          await beforeSlotSignOut(activeSlot);
        } catch {
          /* A failed sync must not prevent server-side session revocation. */
        }
        if (version !== revision) return;
        await request("/api/auth/logout", { method: "POST", slotAuthenticated: true });
      } else if (session)
        await request("/api/auth/logout", { method: "POST", authenticated: true });
    } catch {
      // Local logout must still finish if the server is unavailable or not deployed yet.
    } finally {
      if (version === revision) {
        try {
          if (activeSlot) clearSlotData(activeSlot);
        } catch {
          /* Session cleanup must continue if browser storage is unavailable. */
        }
        logout();
      }
    }
  };
  const expired = () => {
    logout();
    publish({ error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
  };
  async function request(
    path,
    {
      body,
      method = body === undefined ? "GET" : "POST",
      authenticated = false,
      slotAuthenticated = false,
    } = {},
  ) {
    if ((authenticated || slotAuthenticated) && syncBrowserSession()) {
      throw new ApiError("Phiên đăng nhập đã thay đổi ở tab khác. Vui lòng thử lại.", null, 409);
    }
    const multipart =
      typeof FormData !== "undefined" && body instanceof FormData;
    const activeSession = slotAuthenticated ? slotSession : session;
    const token = activeSession?.accessToken;
    if (
      (authenticated || slotAuthenticated) &&
      (!token || activeSession.expiresAt <= now())
    ) {
      if (slotAuthenticated && slotSession)
        logoutSlot("Phiên học tập đã hết hạn. Vui lòng đăng nhập lại.");
      else if (authenticated && session) expired();
      throw new ApiError("Vui lòng đăng nhập lại.", 3003, 401);
    }
    let response;
    try {
      response = await fetcher(`${baseUrl.replace(/\/$/, "")}${path}`, {
        method,
        credentials: "omit",
        signal: AbortSignal.timeout(20000),
        headers: {
          Accept: "application/json",
          ...(body !== undefined && !multipart
            ? { "Content-Type": "application/json" }
            : {}),
          ...(authenticated || slotAuthenticated
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        ...(body !== undefined
          ? { body: multipart ? body : JSON.stringify(body) }
          : {}),
      });
    } catch {
      throw new ApiError(
        "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.",
        null,
        0,
      );
    }
    let data;
    try {
      data = await response.json();
    } catch {
      throw new ApiError(
        "Máy chủ trả dữ liệu không hợp lệ. Vui lòng thử lại.",
        null,
        response.status,
      );
    }
    if (authenticated || slotAuthenticated) syncBrowserSession();
    if (!response.ok || data?.code !== 0) {
      if (
        slotAuthenticated &&
        [3003, 3007, 3009].includes(data?.code) &&
        slotSession?.accessToken === token
      )
        logoutSlot(vietnameseApiMessage(data?.message, data?.code, response.status));
      else if (
        authenticated &&
        data?.code === 3003 &&
        session?.accessToken === token
      )
        expired();
      throw new ApiError(
        LOGIN_PATHS.has(path)
          ? loginErrorMessage({ status: response.status })
          : vietnameseApiMessage(data?.message, data?.code, response.status),
        data?.code,
        response.status,
      );
    }
    return data.result;
  }
  function preferredContext() {
    try {
      return contextStorage.getItem(contextKey);
    } catch {
      return null;
    }
  }
  function persistContext(context) {
    try {
      contextStorage.setItem(contextKey, context || "");
    } catch {
      /* Context remains in memory. */
    }
  }
  function storeToken(result) {
    if (!result?.accessToken || !(result.expiresIn > 0))
      throw new ApiError("Máy chủ chưa trả phiên đăng nhập hợp lệ.");
    revision++;
    session = {
      type: "ACCOUNT",
      accessToken: result.accessToken,
      expiresAt: now() + result.expiresIn * 1000,
    };
    slotSession = null;
    entitlementsRequest = null;
    learnerDashboardRequest = null;
    profileRequest = null;
    persistSlot();
    persist();
    persistBrowserSession();
    publish({ actor: null, entitlements: null, entitlementsLoading: false, learnerDashboard: null, learnerDashboardLoading: false, learnerDashboardError: "", loading: true, error: "" });
  }
  function syncBrowserSession() {
    if (!sharedStorage) return false;
    let raw;
    try { raw = sharedStorage.getItem(browserKey); }
    catch { return false; }
    if (raw === lastBrowserRecord) return false;
    lastBrowserRecord = raw;
    let incoming = null;
    try { incoming = JSON.parse(raw); } catch { /* Invalid records are signed out. */ }
    const valid = ["ACCOUNT", "SLOT"].includes(incoming?.type) && incoming.accessToken && incoming.expiresAt > now();
    if (valid && (incoming.type === "ACCOUNT" ? session : slotSession)?.accessToken === incoming.accessToken) return false;
    logout(false);
    if (!valid || !["ACCOUNT", "SLOT"].includes(incoming.type)) return true;
    if (incoming.type === "SLOT") {
      slotSession = incoming;
      persistSlot();
      publish({ actor: slotActor(), loading: false, error: "" });
    } else {
      session = incoming;
      persist();
      publish({ loading: true, error: "" });
      void refresh().catch(() => {});
    }
    return true;
  }
  async function refresh() {
    if (slotSession) {
      publish({ actor: slotActor(), loading: false, error: "" });
      return;
    }
    if (!session) return;
    const token = session.accessToken;
    if (profileRequest?.token === token) return profileRequest.promise;
    const pending = refreshAccount(token);
    profileRequest = { token, promise: pending };
    try {
      return await pending;
    } finally {
      if (profileRequest?.promise === pending) profileRequest = null;
    }
  }
  async function refreshAccount(token) {
    publish({ loading: !state.actor, error: "" });
    try {
      const account = await request("/api/auth/me", { authenticated: true });
      if (session?.accessToken !== token) return;
      if (
        !account?.id ||
        !Array.isArray(account.plans) ||
        !Array.isArray(account.roles)
      )
        throw new Error("Thông tin tài khoản không hợp lệ.");
      const plans = account.plans
        .map((p) => ({ PARENT: "parent", TEACHER: "teacher" })[p])
        .filter(Boolean);
      const savedContext = preferredContext();
      const role = plans.includes(savedContext)
        ? savedContext
        : plans[0] || "guest";
      persistContext(role === "guest" ? null : role);
      publish({
        actor: {
          ...account,
          name: account.displayName,
          kind: "adult",
          source: "api",
          plans,
          role,
          plan: role === "guest" ? null : role,
        },
        loading: false,
      });
    } catch (error) {
      if (session?.accessToken === token)
        publish({ loading: false, error: error.message });
      throw error;
    }
  }
  async function signIn(path, body) {
    syncBrowserSession();
    const version = ++revision;
    const result = await request(path, { body });
    syncBrowserSession();
    if (version !== revision) return false;
    storeToken(result);
    const token = session.accessToken;
    await refresh();
    return session?.accessToken === token;
  }
  async function ensureEntitlements({ force = false } = {}) {
    if (!session) return [];
    if (!force && Array.isArray(state.entitlements)) return state.entitlements;
    if (entitlementsRequest) return entitlementsRequest;
    publish({ entitlementsLoading: true });
    const token = session.accessToken;
    const pending = request("/api/entitlements", { authenticated: true })
      .then((result) => {
        if (session?.accessToken !== token) return [];
        const entitlements = Array.isArray(result) ? result : [];
        publish({ entitlements, entitlementsLoading: false });
        return entitlements;
      })
      .catch((error) => {
        if (session?.accessToken === token) publish({ entitlementsLoading: false });
        throw error;
      })
      .finally(() => {
        if (entitlementsRequest === pending) entitlementsRequest = null;
      });
    entitlementsRequest = pending;
    return pending;
  }
  async function ensureLearnerDashboard({ force = false } = {}) {
    if (!slotSession) return null;
    if (!force && state.learnerDashboard) return state.learnerDashboard;
    if (learnerDashboardRequest) return learnerDashboardRequest;
    const token = slotSession.accessToken;
    publish({ learnerDashboardLoading: true, learnerDashboardError: "" });
    const pending = request("/api/learner/dashboard", {
      slotAuthenticated: true,
    })
      .then((result) => {
        if (slotSession?.accessToken !== token) return null;
        if (!result?.learner || !result?.progress)
          throw new ApiError("Máy chủ trả dữ liệu tổng quan chưa đầy đủ.");
        publish({
          learnerDashboard: result,
          learnerDashboardLoading: false,
          learnerDashboardError: "",
        });
        return result;
      })
      .catch((error) => {
        if (slotSession?.accessToken === token)
          publish({
            learnerDashboardLoading: false,
            learnerDashboardError: error.message,
          });
        throw error;
      })
      .finally(() => {
        if (learnerDashboardRequest === pending) learnerDashboardRequest = null;
      });
    learnerDashboardRequest = pending;
    return pending;
  }
  async function slotLogin(code, pin) {
    syncBrowserSession();
    const version = ++revision;
    const normalizedCode = String(code || "")
      .trim()
      .toUpperCase();
    const result = await request("/api/slots/login", {
      body: { code: normalizedCode, pin },
    });
    syncBrowserSession();
    if (version !== revision) return false;
    if (!result?.accessToken || !(result.expiresIn > 0))
      throw new ApiError("Máy chủ chưa trả phiên học sinh hợp lệ.");
    if (
      !result.slot?.id ||
      !result.slot?.displayName ||
      !["FAMILY", "CLASS"].includes(result.slot?.groupContext)
    )
      throw new ApiError("Máy chủ chưa trả đầy đủ thông tin hồ sơ trẻ.");
    // End the adult session and invalidate pending account logins before saving SLOT.
    logout();
    slotSession = {
      type: "SLOT",
      code: normalizedCode,
      slot: result.slot,
      accessToken: result.accessToken,
      expiresAt: now() + result.expiresIn * 1000,
    };
    learnerDashboardRequest = null;
    persistSlot();
    persistBrowserSession();
    publish({
      actor: slotActor(),
      learnerDashboard: null,
      learnerDashboardLoading: false,
      learnerDashboardError: "",
      loading: false,
      error: "",
    });
    return true;
  }
  return {
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getSnapshot: () => state,
    getSessionVersion: () => revision,
    logout,
    signOut,
    logoutSlot,
    refresh,
    syncBrowserSession,
    isSessionStorageEvent: (event) => event.key === browserKey || event.key === null,
    ensureEntitlements,
    ensureLearnerDashboard,
    publicRequest: (path, options = {}) => request(path, options),
    accountRequest: (path, options = {}) =>
      request(path, {
        ...options,
        authenticated: true,
        slotAuthenticated: false,
      }),
    slotRequest: (path, options = {}) =>
      request(path, {
        ...options,
        authenticated: false,
        slotAuthenticated: true,
      }),
    hasSession: () => Boolean(session || slotSession),
    checkExpiry: () => {
      syncBrowserSession();
      if (slotSession && slotSession.expiresAt <= now())
        logoutSlot("Phiên học tập đã hết hạn. Vui lòng đăng nhập lại.");
      else if (session && session.expiresAt <= now()) expired();
    },
    register: ({ email, password, displayName, phone }) =>
      request("/api/auth/register", {
        body: {
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          ...(phone?.trim() ? { phone: phone.trim() } : {}),
        },
      }),
    login: (email, password) =>
      signIn("/api/auth/login", { email: email.trim(), password }),
    internalLogin: (email, password) =>
      signIn("/api/auth/internal/login", { email: email.trim(), password }),
    verify: (email, otp) =>
      signIn("/api/auth/verify", { email: email.trim(), otp: otp.trim() }),
    async resetPassword(email, otp, newPassword) {
      syncBrowserSession();
      const version = revision;
      await request("/api/auth/password/reset", {
        body: { email: email.trim(), otp: otp.trim(), newPassword },
      });
      syncBrowserSession();
      if (version !== revision) return false;
      logout();
      return true;
    },
    googleLogin: (idToken) =>
      signIn("/api/auth/login/google", { provider: "GOOGLE", idToken }),
    slotLogin,
    setContext(context) {
      if (
        !["parent", "teacher"].includes(context) ||
        !state.actor?.plans.includes(context)
      ) {
        throw new ApiError(
          "Tài khoản không có quyền sử dụng phạm vi này.",
          3004,
          403,
        );
      }
      persistContext(context);
      publish({ actor: { ...state.actor, role: context, plan: context } });
    },
    linkGoogle: (idToken) =>
      request("/api/auth/link/google", {
        authenticated: true,
        body: { provider: "GOOGLE", idToken },
      }),
    async updateProfile(displayName) {
      const account = await request("/api/auth/me", {
        authenticated: true,
        method: "PATCH",
        body: { displayName: String(displayName || "").trim() },
      });
      if (account?.id !== state.actor?.id || !account?.displayName)
        throw new ApiError("Máy chủ trả thông tin tài khoản không hợp lệ.");
      publish({
        actor: {
          ...state.actor,
          id: account.id,
          email: account.email,
          displayName: account.displayName,
          name: account.displayName,
          roles: Array.isArray(account.roles) ? account.roles : state.actor.roles,
        },
      });
      return account;
    },
    resend: (email) =>
      request(
        `/api/auth/verify/resend?email=${encodeURIComponent(email.trim())}`,
        { method: "POST" },
      ),
    forgot: (email) =>
      request("/api/auth/password/forgot", { body: { email: email.trim() } }),
    async changePassword(oldPassword, newPassword) {
      const token = session?.accessToken;
      const result = await request("/api/auth/password/change", {
        authenticated: true,
        body: { oldPassword, newPassword },
      });
      if (session?.accessToken !== token) return;
      storeToken(result);
      await refresh();
    },
  };
}
