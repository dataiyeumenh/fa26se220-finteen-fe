import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

test('real accounts render settings and server plans without demo activation or local profile writes', async () => {
  const memory = () => { const data = new Map(); return { getItem: k => data.get(k), setItem: (k, v) => data.set(k, v) } }
  globalThis.localStorage = memory(); globalThis.sessionStorage = memory()
  globalThis.window = { addEventListener() {} }
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  const originalFetch = globalThis.fetch
  try {
    const { auth } = await server.ssrLoadModule('/src/api/auth.api.js')
    const { default: OtpForm } = await server.ssrLoadModule('/src/features/auth/OtpForm.jsx')
    const otpHtml = renderToString(React.createElement(OtpForm, { email: 'real@example.com', mode: 'verify', cooldown: 60 }))
    assert.match(otpHtml, /autoComplete="one-time-code"/)
    assert.match(otpHtml, /Gửi lại mã.*60s/)
    assert.doesNotMatch(otpHtml, /name="newPassword"/)
    const resetHtml = renderToString(React.createElement(OtpForm, { email: 'real@example.com', mode: 'reset', cooldown: 60 }))
    assert.match(resetHtml, /name="newPassword"/)
    assert.match(resetHtml, /name="confirm"/)
    const { Overview, Plans, Settings } = await server.ssrLoadModule('/src/features/workspace/Overview.jsx')
    globalThis.fetch = async url => ({ ok: true, status: 200, json: async () => ({ code: 0, result: url.endsWith('/me')
      ? { id: 'real', displayName: 'API User', email: 'real@example.com', plans: ['PARENT'], roles: [] }
      : { accessToken: 'test-token', expiresIn: 60, refreshToken: null } }) })
    await auth.login('real@example.com', 'test-password')
    const render = Component => renderToString(React.createElement(MemoryRouter, null, React.createElement(Component)))
    assert.match(render(Overview), /API User/)
    assert.match(render(Settings), /name="oldPassword"/)
    assert.match(render(Settings), /Liên kết Google/)
    assert.doesNotMatch(render(Settings), /name="name"/)
    assert.doesNotMatch(render(Plans), /Kích hoạt gói thử/)
    assert.match(render(Plans), /Gia đình/)
    auth.logout()
  } finally { globalThis.fetch = originalFetch; await server.close() }
})
