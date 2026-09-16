import { useMemo } from 'react'

/**
 * AdventureMap - Bản đồ phiêu lưu kiểu storybook 2D cartoon
 * - 8 chapter chia 2 khu: Cơ bản (Ch1-4) & Nâng cao (Ch5-8)
 * - Scroll dọc, đường uốn lượn zigzag
 * - Cổng chuyển khu vực giữa Ch4 → Ch5
 * - Chapter node là landmark trong thế giới
 * - Có nhân vật đứng cạnh chapter hiện tại
 *
 * Props:
 *   chapters:      [{ id, title, subtitle, icon, color, status, progress, lessonsCompleted, totalLessons }]
 *   onChapterClick: (chapter) => void
 *
 * status: 'completed' | 'current' | 'locked' | 'available'
 */

// ----- Layout zigzag cho 8 node -----
// Mỗi node có: row offset (0..7 từ dưới lên) + xAlign (0 = trái, 0.5 = giữa, 1 = phải)
// Bắt đầu từ dưới (Ch1) lên trên (Ch8), đường uốn lượn trái-phải
const NODE_LAYOUT = [
  { id: 1, side: 'left',   landmark: 'home',     label: 'Nhà Tí' },
  { id: 2, side: 'right',  landmark: 'shop',     label: 'Tạp hóa' },
  { id: 3, side: 'mid',    landmark: 'tree',     label: 'Cây đa' },
  { id: 4, side: 'right',  landmark: 'school',   label: 'Trường' },
  // --- cổng chuyển khu ---
  { id: 5, side: 'left',   landmark: 'tower',    label: 'Tháp' },
  { id: 6, side: 'mid',    landmark: 'bank',     label: 'Ngân hàng' },
  { id: 7, side: 'right',  landmark: 'market',   label: 'Chợ' },
  { id: 8, side: 'mid',    landmark: 'castle',   label: 'Lâu đài' },
]

// ----- Vị trí theo chiều dọc (% của map) từ dưới lên trên -----
const ROW_Y = {
  1: 96, 2: 86, 3: 74, 4: 60,
  // cổng ở giữa
  5: 44, 6: 32, 7: 20, 8: 6,
}

// Vị trí X theo side
const SIDE_X = {
  left: 18,
  mid:  50,
  right: 82,
}

// Sinh path SVG nối các node theo thứ tự
function buildPath(width = 800, height = 1600) {
  const W = width
  const H = height

  // Chuyển node layout thành toạ độ pixel
  const pts = NODE_LAYOUT.map(n => {
    const xPct = SIDE_X[n.side]
    const yPct = ROW_Y[n.id]
    return {
      id: n.id,
      x: (xPct / 100) * W,
      y: (yPct / 100) * H,
    }
  })

  // Tạo path đường cong giữa các điểm liên tiếp
  // dùng cubic bezier để uốn lượn tự nhiên
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const cur = pts[i]
    const dy = cur.y - prev.y
    // control points: offset theo chiều ngang để tạo cong
    const cx1 = prev.x + (cur.x - prev.x) * 0.5
    const cy1 = prev.y + dy * 0.5
    const cx2 = prev.x + (cur.x - prev.x) * 0.5
    const cy2 = prev.y + dy * 0.5
    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${cur.x} ${cur.y}`
  }

  return { d, pts }
}

// ----- SVG Landmark cho từng node -----
function NodeLandmark({ landmark, status, color, side }) {
  const stroke = '#1f2937'
  const sw = 2.5
  const common = { fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (status === 'locked') {
    // version mờ khi bị khóa
    return (
      <g opacity={0.35} filter="grayscale(70%)">
        <LandmarkSvg landmark={landmark} color="#9ca3af" />
      </g>
    )
  }
  return <LandmarkSvg landmark={landmark} color={color} />
}

function LandmarkSvg({ landmark, color }) {
  const stroke = '#1f2937'
  const sw = 2.5
  const c = { fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' }

  switch (landmark) {
    case 'home':
      // 🏠 ngôi nhà nhỏ
      return (
        <g>
          <path {...c} d="M-22 8 L-22 -10 L0 -26 L22 -10 L22 8 Z" fill="#fde68a" />
          <path {...c} d="M-22 -10 L0 -26 L22 -10" fill="#f59e0b" />
          <rect {...c} x="-6" y="-6" width="12" height="14" fill="#92400e" />
          <rect {...c} x="-16" y="-2" width="6" height="6" fill="#bae6fd" />
          <rect {...c} x="10" y="-2" width="6" height="6" fill="#bae6fd" />
        </g>
      )
    case 'shop':
      // 🏪 cửa hàng có mái che sọc
      return (
        <g>
          <path {...c} d="M-24 -6 L-22 -18 L22 -18 L24 -6 Z" fill="#fb7185" />
          <path {...c} d="M-18 -18 L-14 -6 M-10 -18 L-6 -6 M-2 -18 L2 -6 M6 -18 L10 -6 M14 -18 L18 -6" stroke="#fff" />
          <rect {...c} x="-20" y="-6" width="40" height="22" fill="#fef3c7" />
          <rect {...c} x="-14" y="-2" width="28" height="14" fill="#fde68a" />
          <rect {...c} x="-2" y="6" width="4" height="10" fill="#92400e" />
        </g>
      )
    case 'tree':
      // 🌳 cây đa lớn
      return (
        <g>
          <path {...c} d="M-4 14 L-4 -8 M4 14 L4 -8" fill="#92400e" />
          <circle {...c} cx="0" cy="-14" r="18" fill="#22c55e" />
          <circle {...c} cx="-12" cy="-8" r="10" fill="#16a34a" />
          <circle {...c} cx="12" cy="-8" r="10" fill="#16a34a" />
          <circle {...c} cx="0" cy="-22" r="8" fill="#4ade80" />
        </g>
      )
    case 'school':
      // 🏫 trường học
      return (
        <g>
          <rect {...c} x="-24" y="-8" width="48" height="22" fill="#fde68a" />
          <path {...c} d="M-24 -8 L0 -22 L24 -8 Z" fill="#dc2626" />
          <rect {...c} x="-4" y="2" width="8" height="12" fill="#92400e" />
          <rect {...c} x="-18" y="-2" width="8" height="8" fill="#bae6fd" />
          <rect {...c} x="10" y="-2" width="8" height="8" fill="#bae6fd" />
          <line {...c} x1="-18" y1="2" x2="-14" y2="2" />
          <line {...c} x1="14" y1="2" x2="18" y2="2" />
        </g>
      )
    case 'tower':
      // 🗼 tháp cao
      return (
        <g>
          <path {...c} d="M-10 14 L-10 -10 L-14 -10 L-14 -22 L14 -22 L14 -10 L10 -10 L10 14 Z" fill="#a78bfa" />
          <rect {...c} x="-10" y="-2" width="20" height="8" fill="#c4b5fd" />
          <path {...c} d="M-14 -22 L0 -30 L14 -22 Z" fill="#7c3aed" />
          <line {...c} x1="0" y1="-30" x2="0" y2="-36" stroke="#7c3aed" />
          <circle {...c} cx="0" cy="-36" r="2" fill="#fbbf24" stroke="#f59e0b" />
        </g>
      )
    case 'bank':
      // 🏦 ngân hàng - cột trụ
      return (
        <g>
          <rect {...c} x="-24" y="-2" width="48" height="16" fill="#e2e8f0" />
          <path {...c} d="M-24 -2 L0 -22 L24 -2 Z" fill="#94a3b8" />
          <line {...c} x1="-16" y1="0" x2="-16" y2="14" />
          <line {...c} x1="-8" y1="0" x2="-8" y2="14" />
          <line {...c} x1="8" y1="0" x2="8" y2="14" />
          <line {...c} x1="16" y1="0" x2="16" y2="14" />
          <rect {...c} x="-4" y="4" width="8" height="10" fill="#92400e" />
        </g>
      )
    case 'market':
      // 🏬 chợ - mái vòng
      return (
        <g>
          <path {...c} d="M-26 -8 Q0 -28 26 -8 L26 14 L-26 14 Z" fill="#fb923c" />
          <path {...c} d="M-26 -8 Q0 -28 26 -8" fill="#ea580c" />
          <rect {...c} x="-20" y="2" width="40" height="12" fill="#fef3c7" />
          <rect {...c} x="-14" y="6" width="10" height="8" fill="#fbbf24" />
          <rect {...c} x="4" y="6" width="10" height="8" fill="#fbbf24" />
        </g>
      )
    case 'castle':
      // 🏰 lâu đài cuối
      return (
        <g>
          <rect {...c} x="-22" y="-2" width="44" height="20" fill="#fde68a" />
          <path {...c} d="M-22 -2 L-22 -10 L-18 -10 L-18 -14 L-14 -14 L-14 -10 L-10 -10 L-10 -14 L-6 -14 L-6 -10 L-2 -10 L-2 -14 L2 -14 L2 -10 L6 -10 L6 -14 L10 -14 L10 -10 L14 -10 L14 -14 L18 -14 L18 -10 L22 -10 L22 -2 Z" fill="#dc2626" />
          <rect {...c} x="-4" y="6" width="8" height="12" fill="#7c2d12" />
          <circle {...c} cx="0" cy="-22" r="6" fill="#fbbf24" />
          <path {...c} d="M-2 -22 L0 -16 L-2 -14" />
        </g>
      )
    default:
      return null
  }
}

// ----- Nhân vật chính (SVG cartoon cute) -----
function HeroCharacter({ bounce = false }) {
  return (
    <g className={bounce ? 'origin-bottom animate-[floatY_2.4s_ease-in-out_infinite]' : ''}>
      {/* Bóng đổ */}
      <ellipse cx="0" cy="22" rx="10" ry="2.5" fill="#000" opacity="0.18" />
      {/* Thân áo */}
      <path
        d="M-10 6 L-12 22 L12 22 L10 6 Z"
        fill="#fbbf24"
        stroke="#92400e"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Đầu */}
      <circle cx="0" cy="-4" r="11" fill="#fde68a" stroke="#1f2937" strokeWidth="2" />
      {/* Tóc */}
      <path
        d="M-11 -6 Q-12 -16 0 -15 Q12 -16 11 -6 L9 -4 Q4 -10 -2 -10 Q-8 -10 -9 -4 Z"
        fill="#1f2937"
      />
      {/* Mắt */}
      <circle cx="-4" cy="-3" r="1.6" fill="#1f2937" />
      <circle cx="4" cy="-3" r="1.6" fill="#1f2937" />
      <circle cx="-3.4" cy="-3.6" r="0.5" fill="#fff" />
      <circle cx="4.6" cy="-3.6" r="0.5" fill="#fff" />
      {/* Miệng cười */}
      <path d="M-3 2 Q0 4 3 2" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Má hồng */}
      <circle cx="-7" cy="1" r="1.6" fill="#fca5a5" opacity="0.7" />
      <circle cx="7" cy="1" r="1.6" fill="#fca5a5" opacity="0.7" />
      {/* Tay */}
      <path d="M-12 10 L-16 16" stroke="#fde68a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M12 10 L16 16" stroke="#fde68a" strokeWidth="3.5" strokeLinecap="round" />
      {/* Chân */}
      <path d="M-6 22 L-6 28" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M6 22 L6 28" stroke="#1f2937" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  )
}

// ----- Mây trôi -----
function FloatingCloud({ x, y, scale = 1, delay = 0, duration = 28, opacity = 1 }) {
  return (
    <g
      style={{
        animation: `drift ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        transformOrigin: 'center',
      }}
      opacity={opacity}
    >
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <ellipse cx="0" cy="0" rx="28" ry="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="-14" cy="-6" r="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="12" cy="-7" r="13" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="-4" cy="-10" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      </g>
    </g>
  )
}

// ----- Đồi/cây trang trí -----
function HillDecor({ x, y, scale = 1, color = '#86efac' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="42" ry="14" fill={color} stroke="#15803d" strokeWidth="2" />
    </g>
  )
}

function BushDecor({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="10" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
      <circle cx="-8" cy="2" r="7" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
      <circle cx="8" cy="2" r="7" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
    </g>
  )
}

function PineTreeDecor({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-2" y="-2" width="4" height="8" fill="#92400e" stroke="#1f2937" strokeWidth="1.5" />
      <path d="M0 -22 L-12 -2 L12 -2 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
      <path d="M0 -14 L-9 4 L9 4 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
    </g>
  )
}

// ----- Cổng chuyển khu vực Cơ bản → Nâng cao -----
function AreaGate() {
  return (
    <g>
      {/* Glow nền */}
      <ellipse cx="0" cy="0" rx="80" ry="22" fill="#fde68a" opacity="0.6" className="animate-pulse" />
      {/* Cột trái */}
      <rect x="-46" y="-30" width="14" height="60" fill="#a78bfa" stroke="#1f2937" strokeWidth="2.5" />
      <circle cx="-39" cy="-32" r="9" fill="#fbbf24" stroke="#1f2937" strokeWidth="2.5" />
      {/* Cột phải */}
      <rect x="32" y="-30" width="14" height="60" fill="#a78bfa" stroke="#1f2937" strokeWidth="2.5" />
      <circle cx="39" cy="-32" r="9" fill="#fbbf24" stroke="#1f2937" strokeWidth="2.5" />
      {/* Vòng cung */}
      <path
        d="M-32 -28 Q0 -52 32 -28"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="3.5"
      />
      {/* Biển hiệu */}
      <rect x="-40" y="-12" width="80" height="20" rx="6" fill="#fff" stroke="#7c3aed" strokeWidth="2.5" />
      <text
        x="0"
        y="3"
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#7c3aed"
        style={{ fontFamily: 'system-ui' }}
      >
        🚀 NÂNG CAO
      </text>
      {/* Sao lấp lánh */}
      <g transform="translate(-58 -14)">
        <path
          d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
          fill="#fbbf24"
          stroke="#92400e"
          strokeWidth="1.5"
          className="origin-center"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            animation: 'twinkle 2s ease-in-out infinite',
          }}
        />
      </g>
      <g transform="translate(58 -14)">
        <path
          d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
          fill="#fbbf24"
          stroke="#92400e"
          strokeWidth="1.5"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            animation: 'twinkle 2s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
      </g>
    </g>
  )
}

// ----- Chapter Node -----
function ChapterNode({ chapter, x, y, onClick, isCurrent }) {
  const { status, color, icon, title, subtitle, progress, lessonsCompleted, totalLessons } = chapter
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'

  // Glow halo cho current
  const glow = isCurrent ? (
    <>
      <circle cx="0" cy="0" r="48" fill={color} opacity="0.15" className="animate-ping" />
      <circle cx="0" cy="0" r="42" fill={color} opacity="0.25" />
    </>
  ) : null

  // Pin/shield nền sau landmark
  const PinBg = (
    <g>
      <ellipse cx="0" cy="36" rx="28" ry="6" fill="#000" opacity="0.18" />
      <circle cx="0" cy="0" r="34" fill="#fff" stroke={isLocked ? '#9ca3af' : '#1f2937'} strokeWidth="3" />
      <circle cx="0" cy="0" r="34" fill={isLocked ? 'rgba(156,163,175,0.15)' : `${color}22`} />
    </g>
  )

  return (
    <g
      onClick={() => !isLocked && onClick?.(chapter)}
      style={{ cursor: isLocked ? 'not-allowed' : 'pointer', transition: 'transform 0.25s' }}
      className="hover:scale-105"
    >
      {glow}
      {PinBg}
      {/* Landmark nhỏ trong vòng tròn */}
      <g transform="scale(0.65)">
        <NodeLandmark landmark={NODE_LAYOUT.find(n => n.id === chapter.id)?.landmark} status={status} color={color} />
      </g>

      {/* Badge hoàn thành */}
      {isCompleted && (
        <g transform="translate(28 -28)">
          <circle r="11" fill="#22c55e" stroke="#fff" strokeWidth="2.5" />
          <path
            d="M-4.5 0 L-1.5 3 L5 -4"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Badge khóa */}
      {isLocked && (
        <g transform="translate(28 -28)">
          <circle r="11" fill="#6b7280" stroke="#fff" strokeWidth="2.5" />
          <rect x="-3.5" y="-1" width="7" height="6" rx="1" fill="#fff" />
          <path
            d="M-2.5 -1 L-2.5 -3.5 Q-2.5 -6 0 -6 Q2.5 -6 2.5 -3.5 L2.5 -1"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
          />
        </g>
      )}

      {/* Star cho current */}
      {isCurrent && (
        <g
          transform="translate(-30 -28)"
          style={{
            transformOrigin: 'center',
            transformBox: 'fill-box',
            animation: 'twinkle 1.6s ease-in-out infinite',
          }}
        >
          <path
            d="M0 -10 L3 -3 L10 -3 L4.5 2 L7 9 L0 5 L-7 9 L-4.5 2 L-10 -3 L-3 -3 Z"
            fill="#fbbf24"
            stroke="#92400e"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Label dưới node */}
      <g transform="translate(0 56)">
        <rect x="-58" y="0" width="116" height="34" rx="10" fill="#fff" stroke={isLocked ? '#9ca3af' : '#1f2937'} strokeWidth="2.5" />
        <text
          x="0"
          y="13"
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill={isLocked ? '#6b7280' : '#1f2937'}
          style={{ fontFamily: 'system-ui' }}
        >
          {title}
        </text>
        <text
          x="0"
          y="26"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill={isLocked ? '#9ca3af' : '#64748b'}
          style={{ fontFamily: 'system-ui' }}
        >
          {isLocked ? '🔒 Chưa mở' : subtitle}
        </text>
      </g>

      {/* Progress bar dưới label (current/completed) */}
      {!isLocked && (
        <g transform="translate(0 96)">
          <rect x="-44" y="0" width="88" height="10" rx="5" fill="#e2e8f0" stroke="#1f2937" strokeWidth="1.5" />
          <rect
            x="-42"
            y="2"
            width={(84 * progress) / 100}
            height="6"
            rx="3"
            fill={color}
          />
          <text
            x="0"
            y="22"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={isLocked ? '#9ca3af' : '#475569'}
            style={{ fontFamily: 'system-ui' }}
          >
            {lessonsCompleted}/{totalLessons} bài · {progress}%
          </text>
        </g>
      )}
    </g>
  )
}

// ----- Main Component -----
export default function GameMap({ chapters = [], onChapterClick }) {
  // Tính width/height SVG theo viewport-friendly tỉ lệ
  const W = 800
  const H = 1600

  const { d: pathD, pts } = useMemo(() => buildPath(W, H), [])

  // Map chapters theo id để tra nhanh
  const chapterMap = useMemo(() => {
    const m = {}
    chapters.forEach(c => {
      m[c.id] = c
    })
    return m
  }, [chapters])

  return (
    <div className="w-full">
      {/* Outer frame */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-[#92400e] shadow-[0_20px_60px_rgba(146,64,14,0.25)] bg-gradient-to-b from-[#bae6fd] via-[#fef3c7] to-[#fed7aa]">
        {/* Sticky mini-header */}
        <div className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b-2 border-[#92400e]/30 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <span className="font-extrabold text-[#92400e] text-sm md:text-base">HÀNH TRÌNH</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold">
            <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] border border-[#22c55e]">
              🌱 Cơ bản
            </span>
            <span className="text-[#92400e]">→</span>
            <span className="px-2 py-0.5 rounded-full bg-[#ede9fe] text-[#5b21b6] border border-[#a78bfa]">
              🚀 Nâng cao
            </span>
          </div>
        </div>

        {/* SVG MAP - scrollable dọc */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full block"
            style={{ maxHeight: '85vh', minHeight: '1200px' }}
          >
            {/* ===== SKY / BACKGROUND LAYERS ===== */}
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="50%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fed7aa" />
              </linearGradient>
              <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="dirtPath" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d6a374" />
                <stop offset="100%" stopColor="#b07a4f" />
              </linearGradient>
              <linearGradient id="pathGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#a16207" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <radialGradient id="sunGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Nền */}
            <rect width={W} height={H} fill="url(#skyGrad)" />

            {/* Mặt trời */}
            <circle cx={W - 100} cy={120} r="55" fill="#fbbf24" stroke="#92400e" strokeWidth="3" />
            <g stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.7">
              <line x1={W - 100} y1="40" x2={W - 100} y2="55" />
              <line x1={W - 100} y1="185" x2={W - 100} y2="200" />
              <line x1={W - 180} y1="120" x2={W - 165} y2="120" />
              <line x1={W - 35} y1="120" x2={W - 20} y2="120" />
              <line x1={W - 158} y1="62" x2={W - 148} y2="72" />
              <line x1={W - 52} y1="168" x2={W - 42} y2="178" />
              <line x1={W - 148} y1="62" x2={W - 158} y2="72" />
              <line x1={W - 42} y1="168" x2={W - 52} y2="178" />
            </g>

            {/* Mây trôi */}
            <FloatingCloud x={120} y={140} scale={1.0} delay={0} duration={45} />
            <FloatingCloud x={420} y={90} scale={0.8} delay={-10} duration={40} opacity={0.85} />
            <FloatingCloud x={620} y={220} scale={1.1} delay={-22} duration={50} />
            <FloatingCloud x={80} y={520} scale={0.9} delay={-15} duration={42} opacity={0.75} />
            <FloatingCloud x={560} y={620} scale={0.85} delay={-30} duration={48} opacity={0.7} />
            <FloatingCloud x={150} y={940} scale={1.0} delay={-5} duration={44} />
            <FloatingCloud x={600} y={1080} scale={0.95} delay={-25} duration={46} opacity={0.7} />
            <FloatingCloud x={350} y={1280} scale={1.05} delay={-12} duration={50} opacity={0.7} />
            <FloatingCloud x={100} y={1450} scale={0.85} delay={-20} duration={42} opacity={0.6} />

            {/* Núi xa */}
            <path
              d={`M 0 480 L 120 380 L 220 440 L 340 350 L 460 430 L 600 360 L 760 440 L ${W} 400 L ${W} 600 L 0 600 Z`}
              fill="#a7f3d0"
              stroke="#065f46"
              strokeWidth="3"
              opacity="0.85"
            />
            <path
              d={`M 0 600 L 100 520 L 240 580 L 400 490 L 560 570 L ${W} 530 L ${W} 700 L 0 700 Z`}
              fill="#6ee7b7"
              stroke="#065f46"
              strokeWidth="3"
              opacity="0.85"
            />

            {/* Mặt đất cỏ */}
            <rect y={H * 0.65} width={W} height={H * 0.4} fill="url(#groundGrad)" />
            <path
              d={`M 0 ${H * 0.65} Q ${W * 0.5} ${H * 0.6} ${W} ${H * 0.66} L ${W} ${H} L 0 ${H} Z`}
              fill="#4ade80"
              stroke="#14532d"
              strokeWidth="3"
            />

            {/* ===== KHU VỰC CƠ BẢN - decorations ===== */}
            <HillDecor x={80} y={H * 0.68} scale={1.1} color="#86efac" />
            <HillDecor x={W - 80} y={H * 0.7} scale={1.0} color="#4ade80" />
            <HillDecor x={W - 250} y={H * 0.95} scale={0.9} color="#86efac" />
            <HillDecor x={120} y={H * 0.96} scale={1.0} color="#4ade80" />

            <PineTreeDecor x={50} y={H * 0.78} scale={1.1} />
            <PineTreeDecor x={W - 60} y={H * 0.82} scale={1.0} />
            <PineTreeDecor x={W - 180} y={H * 0.98} scale={0.9} />
            <PineTreeDecor x={100} y={H * 0.88} scale={0.95} />

            <BushDecor x={170} y={H * 0.74} />
            <BushDecor x={W - 130} y={H * 0.76} />
            <BushDecor x={250} y={H * 0.94} />
            <BushDecor x={W - 300} y={H * 0.92} />

            {/* Cây táo nhỏ */}
            <g transform={`translate(${W - 120} ${H * 0.86})`}>
              <circle r="14" fill="#4ade80" stroke="#15803d" strokeWidth="2" />
              <circle cx="-6" cy="-2" r="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
              <circle cx="6" cy="-2" r="9" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
              <circle cx="-3" cy="-6" r="3" fill="#dc2626" />
              <circle cx="5" cy="0" r="3" fill="#dc2626" />
            </g>

            {/* ===== KHU VỰC NÂNG CAO - decorations thành phố ===== */}
            {/* Toà nhà xa */}
            <g opacity="0.55">
              <rect x="40" y={H * 0.32} width="50" height="120" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
              <rect x="100" y={H * 0.36} width="40" height="100" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
              <rect x="150" y={H * 0.34} width="60" height="120" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
              <rect x={W - 100} y={H * 0.34} width="60" height="120" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
              <rect x={W - 180} y={H * 0.38} width="50" height="100" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
              <rect x={W - 50} y={H * 0.32} width="40" height="120" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
            </g>
            {/* Toà nhà gần hơn */}
            <rect x="20" y={H * 0.42} width="70" height="140" fill="#fef3c7" stroke="#92400e" strokeWidth="2.5" />
            <g fill="#7dd3fc" stroke="#0369a1" strokeWidth="1.5">
              <rect x="30" y={H * 0.44} width="14" height="14" />
              <rect x="50" y={H * 0.44} width="14" height="14" />
              <rect x="70" y={H * 0.44} width="14" height="14" />
              <rect x="30" y={H * 0.47} width="14" height="14" />
              <rect x="50" y={H * 0.47} width="14" height="14" />
              <rect x="70" y={H * 0.47} width="14" height="14" />
              <rect x="30" y={H * 0.5} width="14" height="14" />
              <rect x="50" y={H * 0.5} width="14" height="14" />
              <rect x="70" y={H * 0.5} width="14" height="14" />
            </g>
            <rect x={W - 90} y={H * 0.42} width="70" height="140" fill="#fef3c7" stroke="#92400e" strokeWidth="2.5" />
            <g fill="#fde68a" stroke="#92400e" strokeWidth="1.5">
              <rect x={W - 80} y={H * 0.44} width="14" height="14" />
              <rect x={W - 60} y={H * 0.44} width="14" height="14" />
              <rect x={W - 40} y={H * 0.44} width="14" height="14" />
              <rect x={W - 80} y={H * 0.47} width="14" height="14" />
              <rect x={W - 60} y={H * 0.47} width="14" height="14" />
              <rect x={W - 40} y={H * 0.47} width="14" height="14" />
              <rect x={W - 80} y={H * 0.5} width="14" height="14" />
              <rect x={W - 60} y={H * 0.5} width="14" height="14" />
              <rect x={W - 40} y={H * 0.5} width="14" height="14" />
            </g>

            {/* Cỏ nhỏ trang trí khu nâng cao */}
            <BushDecor x={230} y={H * 0.58} />
            <BushDecor x={W - 280} y={H * 0.58} />
            <PineTreeDecor x={170} y={H * 0.55} scale={0.9} />
            <PineTreeDecor x={W - 220} y={H * 0.55} scale={0.9} />

            {/* ===== ĐƯỜNG ĐI (PATH) ===== */}
            {/* Path shadow */}
            <path
              d={pathD}
              stroke="#000"
              strokeOpacity="0.2"
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
              transform="translate(2 4)"
            />
            {/* Path dirt base */}
            <path
              d={pathD}
              stroke="url(#pathGrad)"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="0"
            />
            {/* Path dashes */}
            <path
              d={pathD}
              stroke="#fff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 14"
              opacity="0.7"
              className="animate-[flowDash_1.6s_linear_infinite]"
            />

            {/* ===== CỔNG CHUYỂN KHU VỰC (giữa Ch4 & Ch5) ===== */}
            <g transform={`translate(${W / 2} ${(ROW_Y[4] + ROW_Y[5]) / 2 / 100 * H})`}>
              <AreaGate />
            </g>

            {/* ===== CHAPTER NODES ===== */}
            {NODE_LAYOUT.map(layout => {
              const chapter = chapterMap[layout.id]
              if (!chapter) return null
              const pt = pts.find(p => p.id === layout.id)
              const isCurrent = chapter.status === 'current'
              const isLeftSide = layout.side === 'left'

              return (
                <g key={layout.id} transform={`translate(${pt.x} ${pt.y})`}>
                  {/* Nhân vật đứng cạnh node hiện tại */}
                  {isCurrent && (
                    <g transform={isLeftSide ? 'translate(48 12)' : 'translate(-48 12)'}>
                      <HeroCharacter bounce />
                    </g>
                  )}

                  <ChapterNode
                    chapter={chapter}
                    x={0}
                    y={0}
                    onClick={onChapterClick}
                    isCurrent={isCurrent}
                  />
                </g>
              )
            })}

            {/* ===== LABEL VÙNG ===== */}
            <g transform={`translate(${W / 2} ${ROW_Y[1] / 100 * H + 60})`}>
              <rect x="-72" y="-18" width="144" height="32" rx="16" fill="#dcfce7" stroke="#22c55e" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fontSize="14" fontWeight="800" fill="#166534" style={{ fontFamily: 'system-ui' }}>
                🌱 CƠ BẢN
              </text>
            </g>
            <g transform={`translate(${W / 2} ${ROW_Y[8] / 100 * H - 28})`}>
              <rect x="-78" y="-18" width="156" height="32" rx="16" fill="#ede9fe" stroke="#a78bfa" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fontSize="14" fontWeight="800" fill="#5b21b6" style={{ fontFamily: 'system-ui' }}>
                🚀 NÂNG CAO
              </text>
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-3 py-3 bg-white/80 border-t-2 border-[#92400e]/30">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#22c55e] border-2 border-white shadow" />
            <span className="text-[11px] md:text-xs font-bold text-gray-700">Hoàn thành</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-[#fbbf24] border-2 border-white shadow animate-pulse" />
            <span className="text-[11px] md:text-xs font-bold text-gray-700">Đang chơi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gray-400 border-2 border-white shadow" />
            <span className="text-[11px] md:text-xs font-bold text-gray-700">Bị khóa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">👤</span>
            <span className="text-[11px] md:text-xs font-bold text-gray-700">Nhân vật</span>
          </div>
        </div>
      </div>

      {/* ===== KEYFRAMES (in style tag) ===== */}
      <style>{`
        @keyframes drift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-40px); }
        }
        @keyframes flowDash {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -24; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}
