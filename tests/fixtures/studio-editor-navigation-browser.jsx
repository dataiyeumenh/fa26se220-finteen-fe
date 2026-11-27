import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Link, RouterProvider, useLocation } from 'react-router-dom';
import StudioWorkspace from '/src/features/internal/StudioWorkspace.jsx';
import { auth } from '/src/api/auth.api.js';
import '/src/index.css';

const actor = { id: 'navigation-editor', name: 'QA Editor', roles: ['GAME_EDITOR'] };
const chapter = code => ({ id: code, title: `Navigation ${code}`, sprites: {}, initialStats: {}, scenes: [
  { id: 'INTRO', type: 'dialogue', title: 'Intro', text: 'Original dialogue', characters: [], nextSceneId: 'END' },
  { id: 'END', type: 'ending', title: 'End', characters: [] },
] });
const state = { content: { CH04: chapter('CH04'), CH05: chapter('CH05') }, putCalls: 0, putCount: 0, signOuts: 0, failSave: false, delay: 0, failRefresh: false, events: [] };
window.studioNavigation = state;
auth.getSnapshot = () => ({ actor, loading: false });
auth.signOut = async () => { state.signOuts++; state.events.push('logout'); };
auth.accountRequest = async (path, options = {}) => {
  if (path === '/api/studio/chapters') return Object.keys(state.content).map(code => ({ code, chapterNumber: Number(code.slice(2)), title: `Navigation ${code}`, status: 'DRAFT', revision: 1, editorId: actor.id }));
  if (path.endsWith('/draft')) {
    const code = path.split('/').at(-2);
    if (options.method === 'PUT') {
      state.putCalls++; state.events.push('put-start');
      if (state.delay) await new Promise(resolve => setTimeout(resolve, state.delay));
      if (state.failSave) { state.events.push('put-failed'); throw Error('QA save unavailable'); }
      state.content[code] = structuredClone(options.body); state.putCount++; state.events.push('put-saved');
      return { warnings: [] };
    }
    if (state.failRefresh && state.putCount) throw Error('QA refresh unavailable');
    return { draft: { code, status: 'DRAFT', revision: state.putCount + 1, title: `Navigation ${code}`, editorId: actor.id }, content: structuredClone(state.content[code]) };
  }
  if (path.endsWith('/scene-schema')) return {};
  if (path.endsWith('/voice')) return { items: [], pending: 0 };
  if (path.startsWith('/api/studio/assets')) return [];
  throw Error(`Unexpected navigation test request: ${path}`);
};
export function Fixture() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/internal')) return <StudioWorkspace actor={actor} />;
  return <main><h1>Navigation fixture</h1><Link to="/internal/editor/CH04">Mở CH04</Link><br /><Link to="/internal/editor/CH05?new=1">Tạo CH05</Link></main>;
}
const router = createBrowserRouter([{ path: '*', element: <Fixture /> }]);
window.navigateStudio = (path, options) => router.navigate(path, options);
createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
