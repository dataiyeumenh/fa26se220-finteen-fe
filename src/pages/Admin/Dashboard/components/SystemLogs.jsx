import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

const levelStyle = {
  info: 'bg-[#4dabff]/15 text-[#4dabff]',
  success: 'bg-[#b8ff3d]/20 text-[#9eea1f]',
  warn: 'bg-[#fbbf24]/15 text-[#fbbf24]',
  error: 'bg-[#ff6b9d]/15 text-[#ff6b9d]',
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
            className="border-2 border-[#2d1b4e] text-[#2d1b4e] hover:bg-[#2d1b4e] hover:text-white"
          >
            Mở console
          </Button>
        }
      />
      <div className="bg-[#2d1b4e] rounded-2xl border-2 border-[#2d1b4e] p-4 font-mono text-xs">
        {logs.map(log => (
          <div
            key={log.id}
            className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0"
          >
            <span className="text-white/40">[{log.time}]</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${levelStyle[log.level]}`}
            >
              {log.level}
            </span>
            <span className="text-white/85 flex-1 truncate">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
