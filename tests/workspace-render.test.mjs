import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

test('dashboard pages render for Guest, Teacher and learner with actual demo store state', async () => {
  const memory = () => { const data = new Map(); return { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value) } }
  globalThis.localStorage = memory()
  globalThis.sessionStorage = memory()
  globalThis.window = { addEventListener() {} }
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    const store = await server.ssrLoadModule('/src/features/workspace/demoStore.js')
    const overview = await server.ssrLoadModule('/src/features/workspace/Overview.jsx')
    const learners = await server.ssrLoadModule('/src/features/workspace/Learners.jsx')
    const quiz = await server.ssrLoadModule('/src/features/workspace/Quiz.jsx')
    const reports = await server.ssrLoadModule('/src/features/workspace/Reports.jsx')
    const layout = await server.ssrLoadModule('/src/features/workspace/WorkspaceLayout.jsx')
    const auth = await server.ssrLoadModule('/src/features/workspace/AuthForm.jsx')
    const homepage = await server.ssrLoadModule('/src/pages/Homepage.jsx')
    const { AuthLayout } = await server.ssrLoadModule('/src/pages/auth/AuthLayout.jsx')
    const kidPages = await server.ssrLoadModule('/src/features/workspace/KidPages.jsx')
    const { RequireAccount } = await server.ssrLoadModule('/src/features/workspace/Guards.jsx')
    const render = (Component, props = {}, entry = '/') => renderToString(React.createElement(MemoryRouter, { initialEntries: [entry] }, React.createElement(Component, props)))
    const protectedPage = roles => renderToString(
      React.createElement(MemoryRouter, { initialEntries: ['/protected'] },
        React.createElement(Routes, null,
          React.createElement(Route, { element: React.createElement(RequireAccount, { roles }) },
            React.createElement(Route, { path: '/protected', element: React.createElement('p', null, 'PROTECTED CONTENT') }),
          ),
        ),
      ),
    )
    assert.match(render(auth.default), /Mã|Học sinh/)
    assert.match(render(auth.default, {}, '/login?as=kid'), /Mã đăng nhập/)
    assert.match(render(auth.default, {}, '/login?as=kid'), /Vào góc học tập/)
    assert.match(render(auth.default, { registration: true }), /Tạo tài khoản miễn phí/)
    assert.match(render(auth.default, { registration: true }), /name="confirm"/)
    assert.match(render(auth.default), /aria-label="Hiện mật khẩu"/)
    assert.match(render(auth.default, { registration: true }), /aria-label="Hiện xác nhận mật khẩu"/)
    assert.match(render(auth.default, {}, '/login?as=kid'), /aria-label="Hiện mã pin"/)
    assert.match(render(AuthLayout), /Về trang chủ/)
    assert.match(render(AuthLayout, {}, '/register'), /ft-auth-center/)
    const homeHtml = render(homepage.default)
    assert.match(homeHtml, /đồng tiền/)
    assert.match(homeHtml, /Xem demo 1 phút/)
    assert.match(homeHtml, /id="how-it-works"/)
    await store.register({ name: 'Giáo viên thử', email: 'render@example.com', password: 'test-pass-123' })
    assert.match(render(layout.default), /data-ws-role="guest"/)
    assert.match(render(overview.Overview), /Khám phá FinTeen/)
    assert.match(render(overview.Plans), /Kích hoạt gói thử/)
    assert.match(render(kidPages.GuestDemo), /Bắt đầu dùng thử/)
    assert.doesNotMatch(render(layout.default), /Nhóm học sinh|>Quiz</)
    assert.doesNotMatch(render(layout.default), />Bài học<|>Trò chơi<|>Cửa hàng</)
    assert.doesNotMatch(protectedPage(['kid']), /PROTECTED CONTENT/)
    assert.match(protectedPage(['guest']), /PROTECTED CONTENT/)
    store.dispatch('ACTIVATE_DEMO_PLAN', { plan: 'teacher' })
    assert.match(render(layout.default), /data-ws-role="teacher"/)
    for (const Component of [overview.Overview, overview.Plans, overview.Settings, learners.Learners, learners.Groups, quiz.TeacherQuizManagement, reports.default]) {
      const html = render(Component)
      assert.ok(html.length > 150)
      assert.doesNotMatch(html, /undefined|NaN/)
    }
    assert.match(render(layout.default), /Nhóm học sinh/)
    assert.doesNotMatch(render(layout.default), />Bài học<|>Trò chơi<|>Cửa hàng<|Dùng thử chương 1/)
    assert.doesNotMatch(protectedPage(['kid']), /PROTECTED CONTENT/)
    assert.match(protectedPage(['teacher']), /PROTECTED CONTENT/)
    await store.saveLearner({ slotId: store.getSnapshot().db.slots[0].id, name: 'Bạn An', pin: '4567' })
    assert.match(render(learners.Learners), /Bạn An/)
    const learner = store.getSnapshot().db.learners[0]
    store.logout()
    await store.login({ kind: 'learner', identifier: learner.code, secret: '4567' })
    assert.match(render(layout.default), /data-ws-role="kid"/)
    assert.match(render(overview.LearnerHome), /Bạn An/)
    assert.match(render(kidPages.KidGames), /Vào chơi/)
    assert.match(render(kidPages.KidShop), /Cửa hàng đang được chuẩn bị/)
    assert.match(render(quiz.KidQuiz), /chưa giao bài kiểm tra/)
    assert.doesNotMatch(render(layout.default), /Nhóm học sinh|Gói học tập/)
    for (const label of ['Bài học', 'Trò chơi', 'Cửa hàng']) assert.ok(render(layout.default).includes(label))
    assert.match(protectedPage(['kid']), /PROTECTED CONTENT/)
    assert.doesNotMatch(protectedPage(['guest', 'parent', 'teacher']), /PROTECTED CONTENT/)
    store.logout()
    await store.register({ name: 'Phụ huynh thử', email: 'parent-render@example.com', password: 'test-pass-123' })
    store.dispatch('ACTIVATE_DEMO_PLAN', { plan: 'parent' })
    assert.match(render(layout.default), /data-ws-role="parent"/)
  } finally { await server.close() }
})
