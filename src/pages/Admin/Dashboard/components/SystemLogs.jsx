import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

const levelStyle = {
  info: { bg: '#bfdbfe30', text: '#1d4ed8' },
  success: { bg: '#a7f3d030', text: '#047857' },
  warn: { bg: '#fde68a30', text: '#a16207' },
  error: { bg: '#fecaca30', text: '#b91c1c' },
}

export default function SystemLogs({ logs }) {
  return (
    <div>
      <SectionHeader
        title="System logs"
        emoji="📋"
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
            Mở console
          </Button>
        }
      />
      <div className="bg-[#1a3a1a] rounded-2xl border-2 border-[#1a3a1a] p-4 font-mono text-xs">
        {logs.map(log => {
          const style = levelStyle[log.level] || levelStyle.info
          return (
            <div
              key={log.id}
              className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0"
            >
              <span className="text-white/40">[{log.time}]</span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {log.level}
              </span>
              <span className="text-white/85 flex-1 truncate">{log.msg}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
