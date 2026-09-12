import { PlusCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

const classColors = [
  { emoji: '⭐', bg: '#0284c7', badge: '#38bdf815', text: '#0369a1' },
  { emoji: '💼', bg: '#fbbf24', badge: '#fbbf2420', text: '#b45309' },
  { emoji: '📈', bg: '#a78bfa', badge: '#a78bfa15', text: '#6d28d9' },
]

export default function ClassesGrid({ classes }) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Lớp của tôi"
        subtitle="Quản lý học sinh và bài giảng"
        emoji="🏫"
        action={
          <Button
            variant="outline"
            size="sm"
            className="border-2 text-[#0369a1] hover:text-white"
            style={{ borderColor: '#0284c7' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#0284c7'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#0369a1'
            }}
          >
            <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" /> Tạo lớp
          </Button>
        }
      />
      <div className="grid md:grid-cols-3 gap-4">
        {classes.map((c, idx) => {
          const palette = classColors[idx % classColors.length]
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border-2 border-[#38bdf8]/15 p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(56,189,248,0.2)] hover:border-[#38bdf8] transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Top color stripe */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: palette.bg }} aria-hidden="true" />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-sm"
                style={{ backgroundColor: palette.bg }}
              >
                <span aria-hidden="true">{palette.emoji}</span>
              </div>
              <div className="text-base font-extrabold text-[#1a3a1a] mb-3">{c.name}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#faf8f5] rounded-xl p-3">
                  <div className="text-[10px] text-[#1a3a1a]/60 font-bold uppercase flex items-center gap-1">
                    <Users className="w-3 h-3" aria-hidden="true" />
                    Học sinh
                  </div>
                  <div className="text-lg font-black text-[#1a3a1a] mt-0.5">{c.students}</div>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: palette.badge }}>
                  <div className="text-[10px] font-bold uppercase" style={{ color: palette.text }}>Điểm TB</div>
                  <div className="text-lg font-black mt-0.5" style={{ color: palette.text }}>⭐ {c.avgScore}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
