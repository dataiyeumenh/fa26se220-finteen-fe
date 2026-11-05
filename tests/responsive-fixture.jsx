// Browser-only layout fixture: actual components, deterministic local data, no API writes.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '../src/index.css';
import '../src/styles/responsive.css';
import Homepage from '../src/pages/Homepage.jsx';
import { AuthLayout } from '../src/pages/auth/AuthLayout.jsx';
import InternalAuthLayout from '../src/pages/auth/InternalAuthLayout.jsx';
import AuthForm from '../src/features/workspace/AuthForm.jsx';
import WorkspaceLayout from '../src/features/workspace/WorkspaceLayout.jsx';
import ParentDashboardContent from '../src/pages/Parent/Dashboard/components/ParentDashboardContent.jsx';
import TeacherDashboardContent from '../src/pages/Teacher/Dashboard/components/TeacherDashboardContent.jsx';
import TeacherQuizContent from '../src/pages/Teacher/Quiz/components/TeacherQuizContent.jsx';
import GameMap from '../src/pages/Kid/Dashboard/components/GameMapReal.jsx';
import AdminDashboardContent from '../src/pages/Admin/Dashboard/components/AdminDashboardContent.jsx';
import StudioWorkspace from '../src/features/internal/StudioWorkspace.jsx';
import { VisualNovelPlayer } from '../src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx';
import chapter from './fixtures/content/CH04.json';
import ch1 from './fixtures/content/CH01.json';
import ch2 from './fixtures/content/CH02.json';
import ch3 from './fixtures/content/CH03.json';
import ch5 from './fixtures/content/CH05.json';
import ch6 from './fixtures/content/CH06.json';
import ch7 from './fixtures/content/CH07.json';
import ch8 from './fixtures/content/CH08.json';
import { initialNovelProgress, saveNovelProgress } from '../src/pages/Kid/Dashboard/components/game/visualNovelProgress.js';
import { resolveContentImages } from '../src/lib/imageAssets.js';
import { auth } from '../src/api/auth.api.js';

const name = new URLSearchParams(location.search).get('case') || 'home';
// Measure settled layouts; animation frames are covered by visual review separately.
const stableLayout = document.createElement('style');
stableLayout.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }';
document.head.append(stableLayout);
const role = name === 'kid' || name === 'game' || name.startsWith('minigame-') ? 'kid' : name === 'parent' ? 'parent' : 'teacher';
const internalRole = ({ editor: 'GAME_EDITOR', 'editor-menu': 'GAME_EDITOR', reviewer: 'GAME_REVIEWER', manager: 'GAME_MANAGER', admin: 'ADMIN', 'admin-menu': 'ADMIN' })[name];
const actor = { id: 'layout-fixture', name: 'Nguyễn Minh Anh', displayName: 'Nguyễn Minh Anh', email: 'layout@example.test', role, kind: role === 'kid' ? 'kid' : 'adult', plans: ['parent', 'teacher'], roles: internalRole ? [internalRole] : [], source: 'api' };
if (role === 'kid') actor.learnerRole = 'student';
const snapshot = { actor: ['home', 'login', 'register', 'internal-login'].includes(name) ? null : actor, loading: false, entitlements: [], learnerDashboard: null };
auth.getSnapshot = () => snapshot;
auth.ensureEntitlements = async () => [];
auth.ensureLearnerDashboard = async () => ({});
auth.accountRequest = async (path) => {
  if (path.startsWith('/api/questions')) return Array.from({ length: 139 }, (_, i) => ({ id: `f${i}`, externalId: `FDIC_MONEY_SMART-${i}`, stem: 'Đây là câu hỏi thử có nội dung dài để kiểm tra bố cục trên điện thoại và máy tính bảng.', options: ['Lựa chọn một', 'Lựa chọn hai', 'Lựa chọn ba', 'Lựa chọn bốn'], correctIndex: 1 }));
  if (path.includes('/assets')) return { items: [], total: 0, page: 0, size: 24 };
  return [];
};
const dashboardState = { loading: false, refetch() {}, dashboard: { group: { id: 'g1', name: 'Lớp học tài chính cùng FinTeen' }, report: { summary: { learners: 40, active: 30, activeLast7Days: 25 } } } };
const quizState = { groups: [{ id: 'g1', name: 'Lớp học tài chính cùng FinTeen' }], currentGroup: { id: 'g1' }, groupId: 'g1', quizzes: [], loading: false, setGroupId() {}, reload() {}, refresh() {} };
const chapters = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, title: `Chương ${i + 1}`, subtitle: 'Hành trình học tài chính', status: i ? 'locked' : 'current', progress: 25, lessonsCompleted: 1, totalLessons: 4 }));
let view;
let route = '/';
if (name === 'kid') route = '/dashboard/kid/lessons';
else if (name === 'parent' || name === 'teacher-menu') route = '/dashboard';
if (name === 'home') view = <Homepage />;
else if (['login', 'register', 'internal-login'].includes(name)) {
  view = <Routes><Route element={name === 'internal-login' ? <InternalAuthLayout /> : <AuthLayout />}><Route path="*" element={<AuthForm registration={name === 'register'} internal={name === 'internal-login'} />} /></Route></Routes>;
} else if (name === 'admin' || name === 'admin-menu') view = <AdminDashboardContent actor={actor} />;
else if (internalRole) { route = '/internal'; view = <StudioWorkspace actor={actor} />; }
else if (name === 'game' || name.startsWith('minigame-')) {
  const data = resolveContentImages(name === 'game' ? chapter : [ch1, ch2, ch3, chapter, ch5, ch6, ch7, ch8][Number(name.split('-')[1]) - 1]);
  const index = name === 'game' ? 0 : data.scenes.findIndex(scene => scene.type === 'minigame');
  saveNovelProgress(localStorage, data, initialNovelProgress(data, index));
  view = <VisualNovelPlayer data={data} />;
}
else view = <WorkspaceLayout>{name === 'kid' ? <GameMap chapters={chapters} /> : name === 'quiz' || name === 'quiz-preview' ? <TeacherQuizContent quizState={quizState} /> : name === 'parent' ? <ParentDashboardContent actor={actor} dashboardState={dashboardState} /> : <TeacherDashboardContent actor={actor} dashboardState={dashboardState} />}</WorkspaceLayout>;
createRoot(document.getElementById('root')).render(<MemoryRouter initialEntries={[route]}>{view}</MemoryRouter>);

function clickText(text) { [...document.querySelectorAll('button')].find(button => button.textContent.trim() === text)?.click(); }
setTimeout(() => {
  if (name.startsWith('quiz')) clickText('Tạo đề');
  if (name.endsWith('-menu') && innerWidth <= 900) document.querySelector('.ft-navigation-toggle')?.click();
  setTimeout(() => {
    if (name === 'quiz-preview') document.querySelector('.ws-question-set__preview')?.click();
    setTimeout(() => {
      const width = innerWidth;
      const overflowing = [...document.querySelectorAll('body *')].filter(el => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || getComputedStyle(el).position === 'absolute') return false;
        // Contents of intentional horizontal scrollers may extend past their clip.
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(p).overflowX)) return false;
        }
        return rect.right > width + 1 || rect.left < -1;
      }).slice(0, 8).map(el => ({ tag: el.tagName, class: el.getAttribute('class') || '', width: Math.round(el.getBoundingClientRect().width) }));
      const failedImages = [...document.images].filter(img => img.complete && !img.naturalWidth).map(img => img.getAttribute('src'));
      const result = { name, width, scrollWidth: document.documentElement.scrollWidth, overflowing, imagesFailed: failedImages.filter(url => url?.startsWith('/')), externalImagesUnavailable: failedImages.filter(url => !url?.startsWith('/')), rendered: Boolean(document.querySelector('#root')?.textContent?.trim() || document.querySelector('.vn-player')), preview: name !== 'quiz-preview' || Boolean(document.querySelector('[role="dialog"]')), navigation: !name.endsWith('-menu') || width > 900 || Boolean(document.querySelector('[role="dialog"] .ft-sidebar--drawer')) };
      parent.postMessage({ responsiveResult: result }, location.origin);
      document.body.dataset.audit = JSON.stringify(result);
    }, 700);
  }, 700);
}, 700);
