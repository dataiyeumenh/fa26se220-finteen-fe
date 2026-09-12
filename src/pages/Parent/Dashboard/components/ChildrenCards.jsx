import { Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

// Warm Coral palette cho 2 thẻ con
const childColors = [
  { bg: '#fb923c', text: '#c2410c', stripe: '#fb923c' },
  { bg: '#fdba74', text: '#9a3412', stripe: '#fdba74' },
]

export default function ChildrenCards({ children, accent = '#fb923c', accentText = '#c2410c' }) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Theo dõi con em"
        subtitle="Tiến độ học tập của các con"
        emoji="Family"
        action={
          <Button
            variant="outline"
            size="sm"
            className="border-2"
            style={{
              borderColor: accent,
              color: accentText,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = accent
              e.currentTarget.style.color = '#1a3a1a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = accentText
            }}
          >
            Thêm con
          </Button>
        }
      />
      <div className="grid md:grid-cols-2 gap-4">
        {children.map((c, idx) => {
          const palette = childColors[idx % childColors.length]
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border-2 border-[#fb923c]/30 p-6 hover:shadow-[0_8px_30px_rgba(251,146,60,0.3)] transition-all relative overflow-hidden"
            >
              {/* Top color stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: palette.stripe }}
                aria-hidden="true"
              />

              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm text-white"
                  style={{ backgroundColor: palette.bg }}
                >
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-base font-extrabold text-[#1a3a1a]">{c.name}</div>
                  <div className="text-xs text-[#1a3a1a]/60">{c.grade}</div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: palette.bg }}
                >
                  🔥 {c.streak} ngày
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs font-bold text-[#1a3a1a] mb-1.5">
                  <span>Tiến độ tổng</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="h-2.5 bg-[#faf8f5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: palette.bg,
                      width: `${c.progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-[#1a3a1a]/65 font-medium pt-3 border-t border-[#fb923c]/20">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {c.weeklyTime} / tuần
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-[#fb923c]/15 h-auto p-0 font-extrabold text-[#c2410c]"
                >
                  Chi tiết
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
