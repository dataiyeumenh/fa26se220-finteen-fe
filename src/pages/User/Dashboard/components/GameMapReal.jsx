import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Flag, Play } from 'lucide-react'
import './journey-map.css'

const REGIONS = [
  { title: 'Từ mái nhà nhỏ', file: '01-home', ratio: '2752 / 1536', points: [{ x: 33.8, y: 51, labelY: 70 }, { x: 70.3, y: 63.5, labelY: 82 }] },
  { title: 'Những bước đi mới', file: '02-new-steps', ratio: '2752 / 1536', points: [{ x: 29.7, y: 44.5, labelY: 63 }, { x: 74, y: 67, labelY: 85 }] },
  { title: 'Vun đắp tương lai', file: '03-build', ratio: '2750 / 1536', points: [{ x: 29.8, y: 44.5, labelY: 62 }, { x: 74.1, y: 67, labelY: 85 }] },
  { title: 'Chân trời rộng mở', file: '04-horizon', ratio: '2752 / 1536', points: [{ x: 29, y: 66.5, labelY: 83 }, { x: 77, y: 36.5, labelY: 52 }] },
]

function ChapterPoint({ chapter, point, onSelect }) {
  const current = chapter.status === 'current'
  const completed = chapter.status === 'completed'
  const status = current ? 'current' : completed ? 'complete' : 'available'
  return <>
    <button type="button" className={`atlas-stop ${status}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} onClick={() => onSelect?.(chapter)} aria-label={`${chapter.title}: ${chapter.subtitle}${current ? ', đang chơi' : ''}`}>
      <span className="atlas-ring" aria-hidden="true" />
      {current && <span className="atlas-here"><Flag size={14} /> BẠN ĐANG Ở ĐÂY</span>}
      <span className="atlas-medal">{String(chapter.id).padStart(2, '0')}{completed && <span className="atlas-check"><Check size={16} /></span>}</span>
      <span className="atlas-stop-action">{current ? 'Tiếp tục' : completed ? 'Chơi lại' : 'Khám phá'} <ArrowRight size={14} /></span>
    </button>
    <button type="button" className={`atlas-label ${status}`} style={{ left: `${point.x}%`, top: `${point.labelY}%` }} onClick={() => onSelect?.(chapter)}>
      <span>CHƯƠNG {chapter.id}</span><strong>{chapter.subtitle}</strong>
      <small>{completed ? '✓ Đã hoàn thành' : `${chapter.lessonsCompleted}/${chapter.totalLessons} bài · ${chapter.progress || 0}%`}</small>
      <span className="atlas-label-track"><i style={{ width: `${chapter.progress || 0}%` }} /></span>
    </button>
  </>
}

export default function GameMap({ chapters = [], onChapterClick }) {
  const current = chapters.find(chapter => chapter.status === 'current') || chapters[0]
  const [active, setActive] = useState(() => Math.floor(((current?.id || 1) - 1) / 2))
  const swipeStart = useRef(null)
  const region = REGIONS[active]
  const visible = chapters.filter(chapter => Math.floor((chapter.id - 1) / 2) === active)
  return <section className="journey-map">
    <div className="atlas-toolbar">
      <div className="atlas-tabs" role="group" aria-label="Các vùng hành trình">{REGIONS.map((item, index) => <button key={item.file} type="button" aria-pressed={active === index} onClick={() => setActive(index)}><span>0{index + 1}</span><div>{item.title}<small>Chương {index * 2 + 1}–{index * 2 + 2}</small></div></button>)}</div>
      {current && <button type="button" className="atlas-resume" onClick={() => onChapterClick?.(current)}><Play size={16} /> Tiếp tục chương {current.id}</button>}
    </div>
    <div className="atlas-scroller">
      <div className="atlas-world" style={{ aspectRatio: region.ratio }} onTouchStart={event => { swipeStart.current = [event.touches[0].clientX, event.touches[0].clientY] }} onTouchEnd={event => {
        if (!swipeStart.current) return
        const dx = event.changedTouches[0].clientX - swipeStart.current[0]
        const dy = event.changedTouches[0].clientY - swipeStart.current[1]
        if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2 && event.currentTarget.clientWidth <= event.currentTarget.parentElement.clientWidth) setActive(value => Math.max(0, Math.min(3, value + (dx < 0 ? 1 : -1))))
        swipeStart.current = null
      }}>
        <img key={region.file} className="atlas-background" src={`/images/map/journey-v2/finteen-map-${region.file}.png`} alt={`Bản đồ ${region.title}`} />
        <div className="atlas-world-title"><span>HÀNH TRÌNH · 0{active + 1} / 04</span><h2>{region.title}</h2></div>
        {visible.map(chapter => <ChapterPoint key={chapter.id} chapter={chapter} point={region.points[(chapter.id - 1) % 2]} onSelect={onChapterClick} />)}
      </div>
    </div>
    <div className="atlas-navigation">
      <button type="button" disabled={active === 0} onClick={() => setActive(value => value - 1)}><ArrowLeft size={17} /> Vùng trước</button>
      <div className="atlas-timeline" role="group" aria-label="Xem vùng của chương">{chapters.map(chapter => <button type="button" key={chapter.id} title={`${chapter.title}: ${chapter.subtitle}`} aria-label={`Xem vùng của chương ${chapter.id}`} aria-pressed={Math.floor((chapter.id - 1) / 2) === active} className={chapter.status} onClick={() => setActive(Math.floor((chapter.id - 1) / 2))}>{chapter.status === 'completed' ? <Check size={16} /> : chapter.id}</button>)}</div>
      <button type="button" disabled={active === 3} onClick={() => setActive(value => value + 1)}>Vùng tiếp <ArrowRight size={17} /></button>
    </div>
    <p className="atlas-caption"><span><Check size={14} /> Đã hoàn thành</span><span><Flag size={14} /> Đang chơi</span><span>Bấm vào đế tròn để vào chương.</span></p>
  </section>
}
