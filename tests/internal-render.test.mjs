import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'

test('all staff pages render with role guards, public publication visibility and aggregate-only Admin monitoring', async () => {
  const memory = () => { const data = new Map(); return { getItem: k => data.get(k) || null, setItem: (k, v) => data.set(k, v) } }
  globalThis.localStorage = memory()
  globalThis.sessionStorage = memory()
  globalThis.window = { addEventListener() {} }
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    const store = await server.ssrLoadModule('/src/features/internal/store.js')
    const { default: InternalApp } = await server.ssrLoadModule('/src/features/internal/InternalApp.jsx')
    const { default: Editor } = await server.ssrLoadModule('/src/features/internal/ChapterEditor.jsx')
    const { default: Player } = await server.ssrLoadModule('/src/features/internal/StoryPlayer.jsx')
    const { KidGames } = await server.ssrLoadModule('/src/features/workspace/KidPages.jsx')
    const workspace = await server.ssrLoadModule('/src/features/workspace/demoStore.js')
    const render = (Component, props = {}, entry = '/') => renderToString(React.createElement(MemoryRouter, { initialEntries: [entry] }, React.createElement(Component, props)))
    const page = path => render(InternalApp, {}, path)
    assert.match(page('/login'), /Đăng nhập nội bộ/)
    assert.doesNotMatch(page('/staff'), /Nhân sự &amp; trách nhiệm/)
    const login = async role => { store.logoutInternal(); await store.loginInternal({ email: `${role}@finteen.demo`, password: store.DEMO_PASSWORD }) }
    const act = (type, data = {}) => { const c = store.getInternalSnapshot().db.chapters[0]; store.dispatchInternal(type, { chapterId: c.id, revision: c.revision, ...data }) }
    await login('manager')
    for (const path of ['/', '/chapters', '/chapters/demo-chapter-4', '/staff', '/publications', '/audit']) {
      const html = page(path)
      assert.ok(html.length > 500, path)
      assert.doesNotMatch(html, /undefined|NaN/)
    }
    assert.match(page('/staff'), /Tạo nhân sự/)
    assert.doesNotMatch(page('/accounts'), /Tài khoản &amp; giao dịch<\/h1>/)
    await login('editor')
    assert.match(page('/chapters/demo-chapter-4'), /Biên tập bản mới/)
    assert.doesNotMatch(page('/chapters/demo-chapter-4'), /Phân công lại|Xác nhận phát hành/)
    assert.doesNotMatch(page('/staff'), /Tạo nhân sự/)
    const c = store.getInternalSnapshot().db.chapters[0]
    assert.match(render(Editor, { chapter: c, onSaved() {}, onCancel() {} }), /Lưu phiên bản nháp/)
    const scenes = [{ id: 'intro', speaker: 'Minh', text: 'Published test dialogue', choices: [], minigame: '' }]
    act('SAVE_DRAFT', { title: 'Publication test title', scenes })
    assert.doesNotMatch(render(KidGames), /Publication test title/)
    act('SUBMIT_REVIEW')
    await login('reviewer')
    assert.match(page('/chapters/demo-chapter-4'), /Ghi nhận hoàn thành demo/)
    assert.doesNotMatch(page('/chapters/demo-chapter-4'), /name="decision"/)
    assert.match(page('/chapters/demo-chapter-4/demo'), /Published test dialogue/)
    act('COMPLETE_DEMO', { version: 2 })
    assert.match(page('/chapters/demo-chapter-4'), /name="decision"/)
    act('REVIEW', { decision: 'passed', comment: 'Ready to release' })
    await login('manager')
    assert.match(page('/publications'), /Publication test title/)
    act('PUBLISH')
    assert.match(render(KidGames), /Publication test title/)
    const published = store.getInternalSnapshot().db.chapters[0].versions.at(-1)
    assert.match(render(Player, { version: published }), /Published test dialogue/)
    await login('editor')
    act('SAVE_DRAFT', { title: 'Unreleased title', scenes })
    assert.match(render(KidGames), /Publication test title/)
    assert.doesNotMatch(render(KidGames), /Unreleased title/)
    await workspace.register({ name: 'Adult demo', email: 'adult@test.dev', password: 'adult-test-pass' })
    workspace.dispatch('ACTIVATE_DEMO_PLAN', { plan: 'parent' })
    await workspace.saveLearner({ slotId: workspace.getSnapshot().db.slots[0].id, name: 'PRIVATE_CHILD_NAME', pin: '123456' })
    await login('admin')
    assert.match(page('/'), /Chỉ đọc/)
    assert.doesNotMatch(page('/staff'), /Tạo nhân sự|>Quản lý<\/button>/)
    assert.doesNotMatch(page('/chapters/demo-chapter-4'), /Biên tập bản mới|Gửi duyệt|Phân công lại|Xác nhận phát hành/)
    const accounts = page('/accounts')
    assert.match(accounts, /adult@test.dev/)
    assert.match(accounts, /Không thu tiền/)
    assert.doesNotMatch(accounts, /PRIVATE_CHILD_NAME|credential|adult-test-pass/)
    assert.match(page('/audit'), /Ready to release/)
  } finally { await server.close() }
})
