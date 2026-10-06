import { createAuthClient } from './auth.client.js'
import { apiConfig } from './config.js'

export const auth = createAuthClient({
  baseUrl: apiConfig.baseUrl,
  storage: { getItem: key => sessionStorage.getItem(key), setItem: (key, value) => sessionStorage.setItem(key, value) },
  contextStorage: { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) },
})

export function startAuth() {
  const refresh = () => { if (auth.hasSession()) void auth.refresh().catch(() => {}) }
  refresh()
  window.addEventListener('focus', refresh)
  const timer = window.setInterval(() => auth.checkExpiry(), 1000)
  return () => { window.removeEventListener('focus', refresh); window.clearInterval(timer) }
}
