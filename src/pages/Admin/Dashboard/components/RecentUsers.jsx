import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

const roleColors = {
  'Học sinh': { bg: '#fde68a25', text: '#a16207' },
  'Giáo viên': { bg: '#bfdbfe30', text: '#1d4ed8' },
  'Phụ huynh': { bg: '#fdba7430', text: '#c2410c' },
  'Quản trị': { bg: '#c4b5fd30', text: '#5b21b6' },
}

export default function RecentUsers({ items }) {
  return (
    <div>
      <SectionHeader
        title="Người dùng mới"
        emoji="🆕"
        action={
          <Button
            variant="outline"
            size="sm"
            className="border-2 text-[#5b21b6]"
            style={{ borderColor: '#c4b5fd' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#c4b5fd'
              e.currentTarget.style.color = '#1a3a1a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#5b21b6'
            }}
          >
            Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        }
      />
      <div className="bg-white rounded-2xl border-2 border-[#c4b5fd]/30 divide-y-2 divide-[#c4b5fd]/25">
        {items.map(u => {
          const colors = roleColors[u.role] || { bg: '#c4b5fd30', text: '#5b21b6' }
          return (
            <div key={u.id} className="p-4 flex items-center gap-3 hover:bg-[#faf8f5]/50 transition-colors">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-extrabold"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold text-[#1a3a1a] truncate">{u.name}</div>
                <div className="text-xs font-bold" style={{ color: colors.text }}>{u.role}</div>
              </div>
              <div className="text-xs text-[#1a3a1a]/50">{u.time}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
