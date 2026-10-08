import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

test('legacy browser sessions cannot restore a mock actor and Kid login uses the six-digit SLOT form', async () => {
  globalThis.localStorage = { getItem() { throw new Error('Must not read legacy database') } }
  globalThis.sessionStorage = { getItem: () => JSON.stringify({ kind: 'adult', id: 'legacy' }), setItem() {} }
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { default: AuthForm } = await server.ssrLoadModule('/src/features/workspace/AuthForm.jsx')
    const html = renderToString(React.createElement(MemoryRouter, { initialEntries: ['/login?as=kid'] }, React.createElement(AuthForm)))
    assert.doesNotMatch(html, /fieldset disabled/)
    assert.match(html, /VD: K7MPQ2XA/)
    assert.match(html, /pattern="\[0-9\]\{6\}"/)
    assert.doesNotMatch(html, /đang chờ kết nối API SLOT/)
  } finally { await server.close() }
})
