import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import EditorPage from '/src/features/studio/EditorPage.jsx'
import { VisualNovelPlayer } from '/src/pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx'
import { kidDashboardApi } from '/src/pages/Kid/Dashboard/api/kidDashboardApi.js'
import { auth } from '/src/api/auth.api.js'
import { studioApi } from '/src/features/studio/studioClient.js'
import '/src/index.css'

const background = '/images/c1/scene/c1_cutscene_reading_manga.webp'
const qa = window.previewQA = { calls: [], saved: null }
const data = { id: 'preview-qa', title: 'Chương nháp', releaseVersion: 'qa', initialMoney: 300000, initialStats: { SAVING: 50 }, metadata: { chapterId: 'CH01' }, sprites: {}, scenes: [
  { id: 'INTRO', type: 'dialogue', title: 'Mở đầu', text: 'Nội dung nháp chưa lưu', variants: { 'interest:SPORT': { text: 'Bản riêng cho trẻ thích thể thao' } }, speaker: 'An', background, characters: [], nextSceneId: 'CARD' },
  { id: 'CARD', type: 'inspect', title: 'Bảng thông tin', background, characters: [], inspect: { id: 'card', buttonText: 'Đọc bảng thông tin', dataText: 'Thông tin trong bản nháp', setFlags: { read: true }, autoNextSceneOnClose: true }, nextSceneId: 'CHECK' },
  { id: 'CHECK', type: 'conditional', condition: { var: 'inspected:card', op: '==', value: true }, ifTrueSceneId: 'CHOICE', ifFalseSceneId: 'CARD' },
  { id: 'CHOICE', type: 'choice', title: 'Chọn cách làm', text: 'Bạn chọn cách nào?', background, characters: [], options: [
    { id: 'a', text: 'Chọn sau khi đã đọc', condition: { var: 'inspected:card', op: '==', value: true }, lockedReason: 'Hãy đọc bảng thông tin trước', setFlags: { chosen: true }, nextSceneId: 'END' },
    { id: 'b', text: 'Chơi phân loại', nextSceneId: 'GAME' },
  ] },
  { id: 'GAME', type: 'minigame', title: 'Phân loại', game: { id: 'g', kind: 'NEED_WANT', title: 'Phân loại nhu cầu', items: [{ id: 'water', label: 'Nước uống', category: 'NEEDS' }] }, nextSceneId: 'END' },
  { id: 'END', type: 'ending', title: 'Hoàn thành bản nháp', background, characters: [] },
], endingRules: { priorityOrder: ['done'], endings: [{ id: 'done', title: 'Đã hoàn thành', storyText: 'Kết chương trong game thật', fallback: true }] } }
qa.data = data
const sentinel = 'finteen:vn:v2:slot%3Apreview-qa:preview-qa'
localStorage.setItem(sentinel, 'learner checkpoint must survive')
localStorage.setItem('finteen:play:pending:QA_PREVIEW:1:qa', JSON.stringify({ schema: 2, chapter: 1, releaseVersion: 'qa' }))
const baseline = () => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('finteen:')).sort().map(k => [k, localStorage.getItem(k)]))
qa.baseline = baseline()
qa.checkStorage = () => JSON.stringify(baseline()) === JSON.stringify(qa.baseline)
kidDashboardApi.getSnapshot = () => { qa.calls.push('getSnapshot'); return { actor: { code: 'QA_PREVIEW' } } }
kidDashboardApi.getPlayState = async () => { qa.calls.push('getPlayState'); return { chaptersDone: [], attemptIndex: 1 } }
kidDashboardApi.submitChapterBatch = async () => { qa.calls.push('submit'); return {} }
auth.getSnapshot = () => ({ actor: { id: 'qa-editor', roles: ['GAME_EDITOR'] }, loading: false })
studioApi.get = async path => path.endsWith('/draft') ? { draft: { status: 'DRAFT', revision: 1 }, content: structuredClone(data) } : path.endsWith('/voice') ? { items: [], pending: 0 } : { stats: [{ key: 'SAVING', label: 'Tiết kiệm' }] }
studioApi.put = async (path, body) => { qa.saved = body; return { warnings: [] } }
const root = createRoot(document.getElementById('root'))
qa.mountEditor = () => root.render(<MemoryRouter><EditorPage code="CH01" notify={() => {}} /></MemoryRouter>)
qa.mountDirect = (startSceneId = 'INTRO') => root.render(<MemoryRouter><VisualNovelPlayer key={startSceneId} data={data} preview progressOwner="slot:preview-qa" learnerCode="QA_PREVIEW" startSceneId={startSceneId} onExit={qa.mountEditor} /></MemoryRouter>)
qa.mountEditor()
