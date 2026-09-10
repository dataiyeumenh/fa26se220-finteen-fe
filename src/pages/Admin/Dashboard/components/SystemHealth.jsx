import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/StatCard'

export default function SystemHealth({ stats }) {
  return (
    <div className="mb-8">
      <SectionHeader title="Tình trạng hệ thống" emoji="🖥️" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} emoji={s.emoji} accent={s.accent} />
        ))}
      </div>
    </div>
  )
}
