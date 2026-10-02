import { lazy, Suspense, useState } from 'react'
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react'
import './internal.css'

const ChapterFourMiniGame = lazy(() => import('@/pages/User/Dashboard/components/game/ChapterFourMiniGame').then(module => ({ default: module.ChapterFourMiniGame })))

export default function StoryPlayer({ version, onFinish }) {
  const [index, setIndex] = useState(0)
  const [miniDone, setMiniDone] = useState(false)
  const [recorded, setRecorded] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const scene = version.scenes[index]
  function advance(next) {
    setMiniDone(false)
    setIndex(next === 'end' ? version.scenes.length : next ? version.scenes.findIndex(s => s.id === next) : index + 1)
  }
  function reset() { setIndex(0); setMiniDone(false); setRecorded(false); setError('') }
  if (!version.scenes.length) return <p className="ws-empty">Chưa có cảnh để chơi. Editor cần lưu nội dung trước.</p>
  if (!scene) return <section className="studio-player studio-ending"><BookOpen size={40}/><span className="studio-eyebrow">HÀNH TRÌNH VỪA HOÀN THÀNH</span><h2>{version.title}</h2><p>Bạn đã đi hết một nhánh của câu chuyện. Có thể chơi lại để khám phá các lựa chọn khác.</p><div className="ws-actions"><button className="ws-btn" onClick={reset}><RotateCcw size={16}/> Chơi lại</button>{onFinish && <button className="ws-btn primary" disabled={recorded || busy} onClick={async () => { setBusy(true); setError(''); try { await onFinish(); setRecorded(true) } catch (err) { setError(err.message) } finally { setBusy(false) } }}>{recorded ? 'Đã ghi nhận hoàn thành' : busy ? 'Đang lưu…' : 'Ghi nhận hoàn thành demo'}</button>}</div>{error && <p role="alert">{error}</p>}</section>
  if (scene.minigame === 'chapter4' && !miniDone) return <div className="studio-minigame"><Suspense fallback={<p role="status">Đang tải mini game chương 4…</p>}><ChapterFourMiniGame onComplete={() => { setMiniDone(true); if (!scene.choices.length) advance() }}/></Suspense></div>
  return <section className="studio-player" aria-label="Trình chơi cốt truyện"><div className="studio-player-top"><span>PHIÊN BẢN {version.number} · CẢNH {index + 1}/{version.scenes.length}</span><button className="ws-btn" onClick={reset} aria-label="Chơi lại câu chuyện"><RotateCcw size={16}/></button></div><div className="studio-story-mark"><BookOpen size={54}/></div><div className="studio-dialogue"><span className="studio-eyebrow">{scene.speaker || 'Người dẫn chuyện'}</span><h2>{version.title}</h2><p style={{ whiteSpace: 'pre-wrap' }}>{scene.text}</p><div className="studio-choices">{scene.choices.length ? scene.choices.map((choice, i) => <button className="ws-btn" key={i} onClick={() => advance(choice.next)}>{choice.label}<ArrowRight size={17}/></button>) : <button className="ws-btn primary" onClick={() => advance()}>{index === version.scenes.length - 1 ? 'Hoàn thành câu chuyện' : 'Tiếp tục'}<ArrowRight size={17}/></button>}</div></div></section>
}
