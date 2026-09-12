import { StatCard } from '@/components/dashboard/StatCard'

export default function StatsGrid({
  stats,
  accentColor = '#fbbf24',
  accentText = '#92400e',
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map(s => (
        <StatCard
          key={s.label}
          {...s}
          accentColor={accentColor}
          accentText={accentText}
        />
      ))}
    </div>
  )
}
