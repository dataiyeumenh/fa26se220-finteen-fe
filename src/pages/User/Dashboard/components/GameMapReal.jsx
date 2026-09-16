import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'

/**
 * AdventureMap - 2 Map riêng biệt, full-screen, nút Next/Prev chuyển
 * 
 * Cấu trúc:
 * - Map 1 (Chương 1-4): Ảnh background 16:9 + 4 stickers
 * - Map 2 (Chương 5-8): Ảnh background 16:9 + 4 stickers
 * - Nút Prev/Next để chuyển giữa 2 map
 * - Lock screen nếu chưa hoàn thành Map 1
 */

const MAP_IMAGES = {
  map1: '/images/map/map-1/background/Gemini_Generated_Image_906n1o906n1o906n.png',
  map2: '/images/map/map-2/background/Gemini_Generated_Image_57u6qg57u6qg57u6.png',
}

const LEVEL_IMAGES = {
  1: '/images/map/map-1/level/Gemini_Generated_Image_ey5kkoey5kkoey5k (1).png',
  2: '/images/map/map-1/level/Gemini_Generated_Image_j5nfinj5nfinj5nf (1).png',
  3: '/images/map/map-1/level/Gemini_Generated_Image_m02xgbm02xgbm02x (1).png',
  4: '/images/map/map-1/level/Gemini_Generated_Image_x20o0ax20o0ax20o (1).png',
  5: '/images/map/map-2/level/Gemini_Generated_Image_ftl7jgftl7jgftl7 (1).png',
  6: '/images/map/map-2/level/Gemini_Generated_Image_x7mygbx7mygbx7my (1).png',
  7: '/images/map/map-2/level/Gemini_Generated_Image_z3i0zz3i0zz3i0zz (1).png',
  8: '/images/map/map-2/level/Gemini_Generated_Image_xaoyzlxaoyzlxaoy (1).png',
}

// Vị trí stickers cho MAP 1 (Ch1-4) - căn giữa 4 scenes, sticker đứng trên platform
const MAP1_POSITIONS = {
  1: { left: '12.5%', top: '58%' },
  2: { left: '37.5%', top: '55%' },
  3: { left: '62.5%', top: '58%' },
  4: { left: '87.5%', top: '55%' },
}

// Vị trí stickers cho MAP 2 (Ch5-8) - căn giữa 4 scenes
const MAP2_POSITIONS = {
  5: { left: '12.5%', top: '58%' },
  6: { left: '37.5%', top: '55%' },
  7: { left: '62.5%', top: '58%' },
  8: { left: '87.5%', top: '55%' },
}

const FALLBACK_ICONS = {
  1: '🏡', 2: '🏘️', 3: '🚌', 4: '🎓',
  5: '💼', 6: '🏦', 7: '📈', 8: '🔥',
}

const STATUS_STYLES = {
  completed: {
    badge: 'bg-green-500',
    border: 'border-green-500',
    shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.5)]',
  },
  current: {
    badge: 'bg-amber-500',
    border: 'border-amber-400',
    shadow: 'shadow-[0_0_40px_rgba(251,191,36,0.7)]',
  },
  available: {
    badge: 'bg-blue-500',
    border: 'border-blue-400',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  },
  locked: {
    badge: 'bg-gray-400',
    border: 'border-gray-300',
    shadow: 'shadow-md',
  },
}

// ----- Chapter Sticker (dùng chung cho cả 2 map) -----
function ChapterSticker({ chapter, onClick, size = 'md' }) {
  const { id, title, subtitle, status, color, progress, lessonsCompleted, totalLessons } = chapter
  const pos = id <= 4 ? MAP1_POSITIONS[id] : MAP2_POSITIONS[id]
  const style = STATUS_STYLES[status] || STATUS_STYLES.locked
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'

  const sizeClass = size === 'sm'
    ? 'w-24 h-24 md:w-28 md:h-28'
    : 'w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36'

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: pos.left,
        top: pos.top,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => !isLocked && onClick?.(chapter)}
    >
      {/* Sticker với glow */}
      <div className="relative">
        {/* Pulse ring cho current */}
        {isCurrent && (
          <>
            <div
              className="absolute -inset-2 rounded-full animate-ping"
              style={{ backgroundColor: `${color}40`, animationDuration: '2s' }}
            />
            <div
              className="absolute -inset-4 rounded-full animate-pulse"
              style={{ backgroundColor: `${color}20` }}
            />
          </>
        )}

        <div
          className={`
            relative ${sizeClass}
            rounded-full overflow-hidden
            border-[5px] border-white
            ring-2 ${style.border.replace('border-', 'ring-')}
            ${style.shadow}
            bg-white
            transition-all duration-300
            group-hover:scale-110
            ${isLocked ? 'opacity-50 grayscale' : ''}
          `}
        >
          <img
            src={LEVEL_IMAGES[id]}
            alt={title}
            className="w-full h-full object-contain p-1"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl" style={{ color }}>
            {FALLBACK_ICONS[id]}
          </div>

          {/* Status badge */}
          <div className={`absolute -top-1 -right-1 w-7 h-7 rounded-full ${style.badge} border-2 border-white flex items-center justify-center text-white shadow`}>
            {isCompleted && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isCurrent && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {isLocked && <Lock className="w-3 h-3" />}
            {status === 'available' && <span className="text-xs font-bold">{id}</span>}
          </div>
        </div>

        {/* Hero bubble cho current */}
        {isCurrent && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
            <div className="bg-white rounded-full px-3 py-1 shadow-xl border-2 border-amber-400 flex items-center gap-1">
              <span className="text-xl">👤</span>
              <span className="text-xs font-bold text-amber-700">Đang ở đây!</span>
            </div>
            <div className="w-0 h-0 mx-auto border-l-4 border-r-4 border-t-8 border-transparent border-t-amber-400" />
          </div>
        )}
      </div>

      {/* Label card - solid bg để text rõ */}
      <div
        className={`
          mt-2 md:mt-3 px-3 py-2 md:px-4 md:py-2.5
          rounded-xl bg-white border-2 ${style.border}
          shadow-[0_4px_12px_rgba(0,0,0,0.3)]
          max-w-[130px] md:max-w-[160px]
          transition-transform group-hover:-translate-y-1
        `}
      >
        <p className={`text-xs md:text-sm font-extrabold text-center leading-tight ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
          {title}
        </p>
        <p className={`text-[10px] md:text-xs text-center mt-0.5 font-medium ${isLocked ? 'text-gray-300' : 'text-gray-600'}`}>
          {isLocked ? '🔒 Chưa mở' : subtitle}
        </p>
        {!isLocked && (
          <div className="mt-1.5">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: color }} />
            </div>
            <p className="text-[10px] text-gray-500 text-center mt-0.5 font-semibold">
              {lessonsCompleted}/{totalLessons} bài · {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ----- Map Panel (full screen 1 map) -----
function MapPanel({ mapNumber, chapters, onChapterClick, onPrev, onNext, canGoNext, canGoPrev, isLastMap, totalCompleted }) {
  const bgImage = mapNumber === 1 ? MAP_IMAGES.map1 : MAP_IMAGES.map2
  const labelText = mapNumber === 1 ? 'MAP CƠ BẢN' : 'MAP NÂNG CAO'
  const labelColor = mapNumber === 1 ? '#16a34a' : '#7c3aed'
  const labelEmoji = mapNumber === 1 ? '🌱' : '🚀'
  const subtitle = mapNumber === 1 ? 'Chương 1-4 · Nền tảng' : 'Chương 5-8 · Nâng cao'

  return (
    <div className="w-full">
      {/* Map container với tỷ lệ 16:9 */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border-4 border-amber-900 shadow-2xl"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Background image */}
        <img
          src={bgImage}
          alt={labelText}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Top gradient nhẹ để map label nổi */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />

        {/* Map label (top center) - nổi bật với solid bg */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20
                     px-6 py-3 rounded-2xl
                     bg-white border-[3px] shadow-2xl
                     flex items-center gap-3"
          style={{ borderColor: labelColor }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: `${labelColor}20` }}
          >
            {labelEmoji}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-lg md:text-xl leading-tight text-gray-900">
              {labelText}
            </span>
            <span className="text-xs text-gray-600 leading-tight">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Chapter stickers */}
        {chapters.map(c => (
          <ChapterSticker
            key={c.id}
            chapter={c}
            onClick={onChapterClick}
          />
        ))}

        {/* Navigation buttons */}
        {canGoPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20
                       w-12 h-12 md:w-14 md:h-14 rounded-full
                       bg-white/90 backdrop-blur border-2 border-amber-900
                       shadow-xl flex items-center justify-center
                       hover:bg-white hover:scale-110 transition-all
                       group"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-amber-900 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        {!isLastMap && (
          canGoNext ? (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                         w-12 h-12 md:w-14 md:h-14 rounded-full
                         bg-white/90 backdrop-blur border-2 border-purple-600
                         shadow-xl flex items-center justify-center
                         hover:bg-white hover:scale-110 transition-all
                         group animate-pulse"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-purple-700 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                         px-3 py-2 rounded-xl backdrop-blur
                         bg-gray-900/85 border-2 border-amber-500
                         shadow-xl text-center max-w-[140px]"
            >
              <Lock className="w-5 h-5 mx-auto text-amber-400 mb-1" />
              <p className="text-[10px] text-white font-bold">
                Hoàn thành<br/>Map 1 để mở
              </p>
              <p className="text-[9px] text-amber-300 mt-1">
                {totalCompleted}/4 chương
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

// ----- Map Switcher (Main) -----
export default function GameMap({ chapters = [], onChapterClick }) {
  const [activeMap, setActiveMap] = useState(1)

  const chapterMap = useMemo(() => {
    const m = {}
    chapters.forEach(c => { m[c.id] = c })
    return m
  }, [chapters])

  const map1Chapters = [1, 2, 3, 4].map(id => chapterMap[id]).filter(Boolean)
  const map2Chapters = [5, 6, 7, 8].map(id => chapterMap[id]).filter(Boolean)

  // Map 1 chưa hoàn thành thì khóa Map 2
  const map1CompletedCount = map1Chapters.filter(c => c.status === 'completed').length
  const canEnterMap2 = map1CompletedCount === 4

  const handlePrev = () => setActiveMap(1)
  const handleNext = () => {
    if (activeMap === 1 && canEnterMap2) setActiveMap(2)
  }

  const currentChapters = activeMap === 1 ? map1Chapters : map2Chapters

  return (
    <div className="w-full space-y-3">
      {/* ===== MAP SWITCHER ===== */}
      <MapPanel
        mapNumber={activeMap}
        chapters={currentChapters}
        onChapterClick={onChapterClick}
        onPrev={handlePrev}
        onNext={handleNext}
        canGoPrev={activeMap === 2}
        canGoNext={canEnterMap2}
        isLastMap={activeMap === 2}
        totalCompleted={map1CompletedCount}
      />

      {/* ===== TAB INDICATORS ===== */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveMap(1)}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
            activeMap === 1
              ? 'bg-green-500 text-white shadow-lg scale-105'
              : 'bg-white text-gray-500 border-2 border-green-300 hover:bg-green-50'
          }`}
        >
          🌱 Map 1 · Cơ bản
        </button>
        <button
          onClick={() => canEnterMap2 && setActiveMap(2)}
          disabled={!canEnterMap2}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-all relative ${
            activeMap === 2
              ? 'bg-purple-500 text-white shadow-lg scale-105'
              : canEnterMap2
                ? 'bg-white text-gray-500 border-2 border-purple-300 hover:bg-purple-50'
                : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
          }`}
        >
          🚀 Map 2 · Nâng cao
          {!canEnterMap2 && (
            <Lock className="w-3 h-3 inline-block ml-1" />
          )}
        </button>
      </div>

      {/* ===== LEGEND ===== */}
      <div className="flex flex-wrap justify-center gap-3 px-3 py-2 bg-white rounded-xl shadow text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
          <span className="font-semibold text-gray-600">Hoàn thành</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow animate-pulse" />
          <span className="font-semibold text-gray-600">Đang chơi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-400 border-2 border-white shadow" />
          <span className="font-semibold text-gray-600">Bị khóa</span>
        </div>
      </div>
    </div>
  )
}
