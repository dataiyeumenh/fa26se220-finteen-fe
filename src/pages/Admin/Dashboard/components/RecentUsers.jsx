import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

const roleColors = {
  'Học sinh': 'bg-[#ff6b9d]/15 text-[#ff6b9d]',
  'Giáo viên': 'bg-[#fbbf24]/15 text-[#fbbf24]',
  'Phụ huynh': 'bg-[#4dabff]/15 text-[#4dabff]',
  'Quản trị': 'bg-[#a855f7]/15 text-[#a855f7]',
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
            className="border-2 border-[#2d1b4e] text-[#2d1b4e] hover:bg-[#2d1b4e] hover:text-white"
          >
            Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        }
      />
      <div className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 divide-y-2 divide-[#2d1b4e]/8">
        {items.map(u => (
          <div key={u.id} className="p-4 flex items-center gap-3 hover:bg-[#fff8f0]/50 transition-colors">
            <div
              className={`w-10 h-10 rounded-xl ${roleColors[u.role] || 'bg-[#2d1b4e]/10 text-[#2d1b4e]'} flex items-center justify-center text-base font-extrabold`}
            >
              {u.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-[#2d1b4e] truncate">{u.name}</div>
              <div className="text-xs text-[#2d1b4e]/60">{u.role}</div>
            </div>
            <div className="text-xs text-[#2d1b4e]/50">{u.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
