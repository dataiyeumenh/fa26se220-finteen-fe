import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

test('internal routes require the shared ACCOUNT login instead of seeded credentials', async () => {
  globalThis.localStorage = { getItem() {}, setItem() {} }
  globalThis.sessionStorage = { getItem() {}, setItem() {} }
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { default: InternalApp } = await server.ssrLoadModule('/src/features/internal/InternalApp.jsx')
    const html = renderToString(React.createElement(MemoryRouter, null, React.createElement(InternalApp)))
    assert.equal(html, '')
    assert.doesNotMatch(html, /FinTeenDemo!|@finteen.demo|<form/)
  } finally { await server.close() }
})
