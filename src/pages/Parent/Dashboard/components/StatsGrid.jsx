import { StatCard } from '@/components/dashboard/StatCard'

export default function StatsGrid({ stats, accentColor = '#fb923c', accentText = '#c2410c' }) {
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
